#!/usr/bin/env tsx
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { basename, join } from "path";

interface CollectedExamLinks {
  examId: string;
  examName: string;
  recommendedPaperYears: number[];
  discoveredPdfLinks: string[];
}

interface DownloadResult {
  examId: string;
  examName: string;
  attempted: number;
  downloaded: string[];
  skipped: string[];
  failed: Array<{ url: string; reason: string }>;
}

interface AllowlistConfig {
  default?: { allowPathPatterns?: string[]; allowNumericFilenames?: boolean };
  exams?: Record<string, { allowPathPatterns?: string[]; allowNumericFilenames?: boolean }>;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const examIdx = args.indexOf("--exam");
  const limitIdx = args.indexOf("--limit");
  const exam = examIdx >= 0 ? args[examIdx + 1] : null;
  const limit = limitIdx >= 0 ? Number.parseInt(args[limitIdx + 1], 10) : 3;
  return { exam, limit: Number.isFinite(limit) && limit > 0 ? limit : 3 };
}

function sanitizeFilename(examId: string, url: string): string {
  const parsed = new URL(url);
  const raw = basename(parsed.pathname) || `${examId}-${Date.now()}.pdf`;
  const clean = raw.replace(/[^a-zA-Z0-9._-]/g, "_");
  if (clean.toLowerCase().endsWith(".pdf")) return clean;
  return `${clean}.pdf`;
}

function scoreCandidateLink(url: string, years: number[]): number {
  const lower = url.toLowerCase();
  let score = 0;

  // Positive intent signals
  if (/(question[-_ ]?paper|questionpaper|qpaper|qp\b|paper[-_ ]?[12]|shift[-_ ]?\d+)/i.test(lower)) {
    score += 45;
  }
  if (/(jee|neet|gate|cat|upsc|ssc|ibps|sbi|cet|eamcet|wbjee|keam|rrb)/i.test(lower)) {
    score += 20;
  }
  if (/\b(answer[-_ ]?key|final[-_ ]?answer)\b/i.test(lower)) {
    score += 8; // still useful authenticity companion
  }
  if (years.some((year) => lower.includes(String(year)))) {
    score += 20;
  }

  // Negative signals: mostly admin/notice docs
  if (/(notice|circular|guideline|instruction|manual|schedule|timetable|advertisement|admit|result|methodology|malpractice|brochure|registration|extension|edit[-_ ]?facility|service|merit|fee|cvc)/i.test(lower)) {
    score -= 40;
  }
  if (/(pdf\/|uploads\/\d{4}\/\d{2}\/\d+\.pdf$)/i.test(lower) && !/(question|paper|qp|answer[-_ ]?key)/i.test(lower)) {
    // Generic CMS filename with no semantic hint (common noise source)
    score -= 15;
  }

  return score;
}

function loadAllowlistConfig(): AllowlistConfig {
  const path = join(process.cwd(), "pyq-templates", "official-pyq-allowlist.json");
  if (!existsSync(path)) return {};
  try {
    return JSON.parse(readFileSync(path, "utf-8"));
  } catch {
    return {};
  }
}

function urlMatchesAllowlist(url: string, examId: string, allowlist: AllowlistConfig): boolean {
  const lower = url.toLowerCase();
  const examPatterns = allowlist.exams?.[examId]?.allowPathPatterns || [];
  const defaultPatterns = allowlist.default?.allowPathPatterns || [];
  const patterns = [...examPatterns, ...defaultPatterns].filter(Boolean);

  if (patterns.length === 0) return true;
  return patterns.some((pattern) => lower.includes(pattern.toLowerCase()));
}

function isHardBlocked(url: string, examId: string, allowlist: AllowlistConfig): boolean {
  const lower = url.toLowerCase();
  const strongQuestionSignals =
    /(question[-_ ]?paper|questionpaper|qpaper|qp\b|paper[-_ ]?[12]|shift[-_ ]?\d+|previous[-_ ]?year)/i.test(
      lower
    );
  if (strongQuestionSignals) return false;

  const pathname = new URL(url).pathname.toLowerCase();
  const file = pathname.split("/").pop() || "";
  const allowNumericFilenames =
    allowlist.exams?.[examId]?.allowNumericFilenames ??
    allowlist.default?.allowNumericFilenames ??
    false;
  // Generic timestamp-like CMS filenames are usually not paper links.
  if (/^\d{10,}\.pdf$/.test(file) && !allowNumericFilenames) {
    return true;
  }

  return /(notice|circular|guideline|instruction|manual|schedule|timetable|advertisement|admit|result|methodology|malpractice|brochure|registration|extension|edit[-_ ]?facility|service|merit|fee|cvc|normalization|law_officer|digilocker|apaar|nursing|final[-_ ]?dates?|technical[-_ ]?education)/i.test(
    lower
  );
}

function selectCandidateLinks(
  links: string[],
  years: number[],
  examId: string,
  allowlist: AllowlistConfig
): string[] {
  const ranked = links
    .filter((url) => urlMatchesAllowlist(url, examId, allowlist))
    .filter((url) => !isHardBlocked(url, examId, allowlist))
    .map((url) => ({ url, score: scoreCandidateLink(url, years) }))
    .sort((a, b) => b.score - a.score);

  if (ranked.length === 0) {
    return [];
  }

  // Primary: strong candidates only
  const strong = ranked.filter((item) => item.score >= 35).map((item) => item.url);
  if (strong.length > 0) return strong;

  // Secondary: moderate candidates if nothing strong
  const moderate = ranked.filter((item) => item.score >= 15).map((item) => item.url);
  if (moderate.length > 0) return moderate;

  // Last fallback for uncertain-but-not-blocked links
  return ranked.map((item) => item.url);
}

async function downloadPdf(url: string, savePath: string): Promise<{ ok: boolean; reason?: string }> {
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (PrepGenie PYQ downloader)" },
    });
    if (!response.ok) {
      return { ok: false, reason: `HTTP ${response.status}` };
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("pdf")) {
      return { ok: false, reason: `Not a PDF content-type (${contentType || "unknown"})` };
    }

    const bytes = Buffer.from(await response.arrayBuffer());
    writeFileSync(savePath, bytes);
    return { ok: true };
  } catch (error: any) {
    return { ok: false, reason: error.message };
  }
}

async function processExam(
  row: CollectedExamLinks,
  limit: number,
  allowlist: AllowlistConfig
): Promise<DownloadResult> {
  const targetDir = join(process.cwd(), "pyq-raw", row.examId);
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }

  const result: DownloadResult = {
    examId: row.examId,
    examName: row.examName,
    attempted: 0,
    downloaded: [],
    skipped: [],
    failed: [],
  };

  const candidates = selectCandidateLinks(
    row.discoveredPdfLinks,
    row.recommendedPaperYears,
    row.examId,
    allowlist
  ).slice(0, limit);
  for (const url of candidates) {
    result.attempted += 1;
    const filename = sanitizeFilename(row.examId, url);
    const savePath = join(targetDir, filename);

    if (existsSync(savePath)) {
      result.skipped.push(savePath);
      continue;
    }

    const dl = await downloadPdf(url, savePath);
    if (dl.ok) {
      result.downloaded.push(savePath);
    } else {
      result.failed.push({ url, reason: dl.reason || "Unknown download error" });
    }
    await new Promise((resolve) => setTimeout(resolve, 1200));
  }

  return result;
}

async function main() {
  const { exam, limit } = parseArgs();
  const linksPath = join(process.cwd(), "pyq-templates", "official-pyq-links.json");
  if (!existsSync(linksPath)) {
    throw new Error("Missing official links file. Run: npx tsx scripts/collect-official-pyq-links.ts");
  }

  const allowlist = loadAllowlistConfig();
  const data = JSON.parse(readFileSync(linksPath, "utf-8"));
  let rows: CollectedExamLinks[] = data.results || [];
  rows = rows.filter((row) => row.discoveredPdfLinks?.length > 0);
  if (exam) {
    rows = rows.filter((row) => row.examId === exam);
  }

  const results: DownloadResult[] = [];
  for (const row of rows) {
    console.log(`\n📥 ${row.examName} (${row.examId})`);
    const result = await processExam(row, limit, allowlist);
    results.push(result);
    console.log(
      `   attempted=${result.attempted} downloaded=${result.downloaded.length} skipped=${result.skipped.length} failed=${result.failed.length}`
    );
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    examFilter: exam,
    perExamLimit: limit,
    totalExamsProcessed: results.length,
    totalAttempted: results.reduce((acc, row) => acc + row.attempted, 0),
    totalDownloaded: results.reduce((acc, row) => acc + row.downloaded.length, 0),
    totalSkipped: results.reduce((acc, row) => acc + row.skipped.length, 0),
    totalFailed: results.reduce((acc, row) => acc + row.failed.length, 0),
    results,
  };

  const outPath = join(process.cwd(), "pyq-templates", "official-pyq-download-report.json");
  writeFileSync(outPath, JSON.stringify(summary, null, 2));

  console.log("\n" + "=".repeat(80));
  console.log("OFFICIAL PYQ DOWNLOAD COMPLETE");
  console.log("=".repeat(80));
  console.log(`Processed exams: ${summary.totalExamsProcessed}`);
  console.log(`Attempted: ${summary.totalAttempted}`);
  console.log(`Downloaded: ${summary.totalDownloaded}`);
  console.log(`Skipped: ${summary.totalSkipped}`);
  console.log(`Failed: ${summary.totalFailed}`);
  console.log(`Report: ${outPath}`);
  console.log("=".repeat(80));
}

main().catch((error) => {
  console.error("Downloader failed:", error);
  process.exit(1);
});
