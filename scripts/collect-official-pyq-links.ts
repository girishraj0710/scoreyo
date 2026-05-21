#!/usr/bin/env tsx
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

interface ManifestRow {
  examId: string;
  examName: string;
  recommendedPaperYears: number[];
  sourcePlan: {
    primaryUrl: string | null;
  };
}

interface CollectedExamLinks {
  examId: string;
  examName: string;
  primaryUrl: string | null;
  recommendedPaperYears: number[];
  discoveredPdfLinks: string[];
  notes: string[];
}

function normalizeUrl(baseUrl: string, candidate: string): string | null {
  try {
    return new URL(candidate, baseUrl).toString();
  } catch {
    return null;
  }
}

function extractPdfLinks(html: string, baseUrl: string): string[] {
  const links = new Set<string>();
  const patterns = [
    /href=["']([^"']+\.pdf(?:\?[^"']*)?)["']/gi,
    /src=["']([^"']+\.pdf(?:\?[^"']*)?)["']/gi,
  ];

  for (const pattern of patterns) {
    const matches = html.matchAll(pattern);
    for (const match of matches) {
      const normalized = normalizeUrl(baseUrl, match[1]);
      if (normalized) {
        links.add(normalized);
      }
    }
  }

  return Array.from(links);
}

function filterByYears(urls: string[], years: number[]): string[] {
  return urls.filter((url) => years.some((year) => url.includes(String(year))));
}

async function collectForExam(row: ManifestRow): Promise<CollectedExamLinks> {
  const result: CollectedExamLinks = {
    examId: row.examId,
    examName: row.examName,
    primaryUrl: row.sourcePlan.primaryUrl,
    recommendedPaperYears: row.recommendedPaperYears,
    discoveredPdfLinks: [],
    notes: [],
  };

  if (!row.sourcePlan.primaryUrl) {
    result.notes.push("No primary URL in manifest");
    return result;
  }

  try {
    const response = await fetch(row.sourcePlan.primaryUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (PrepGenie PYQ collector)",
      },
    });

    if (!response.ok) {
      result.notes.push(`HTTP ${response.status} while fetching primary URL`);
      return result;
    }

    const html = await response.text();
    const pdfLinks = extractPdfLinks(html, row.sourcePlan.primaryUrl);
    const yearFiltered = filterByYears(pdfLinks, row.recommendedPaperYears);
    result.discoveredPdfLinks = yearFiltered.length > 0 ? yearFiltered : pdfLinks;

    if (pdfLinks.length === 0) {
      result.notes.push("No PDF links found on the landing page");
    } else if (yearFiltered.length === 0) {
      result.notes.push("PDF links found, but none matched target years directly");
    }
  } catch (error: any) {
    result.notes.push(`Fetch failed: ${error.message}`);
  }

  return result;
}

async function main() {
  const manifestPath = join(process.cwd(), "pyq-templates", "authentic-pyq-manifest.json");
  if (!existsSync(manifestPath)) {
    throw new Error(
      "Manifest not found. Run: npx tsx scripts/build-pyq-authenticity-manifest.ts"
    );
  }

  const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
  const rows: ManifestRow[] = manifest.rows || [];

  const results: CollectedExamLinks[] = [];
  for (const row of rows) {
    const collected = await collectForExam(row);
    results.push(collected);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  const output = {
    generatedAt: new Date().toISOString(),
    totalExams: results.length,
    withLinks: results.filter((row) => row.discoveredPdfLinks.length > 0).length,
    withoutLinks: results.filter((row) => row.discoveredPdfLinks.length === 0).length,
    results,
  };

  const outputPath = join(process.cwd(), "pyq-templates", "official-pyq-links.json");
  writeFileSync(outputPath, JSON.stringify(output, null, 2));

  console.log("=".repeat(80));
  console.log("OFFICIAL PYQ LINK COLLECTION COMPLETE");
  console.log("=".repeat(80));
  console.log(`Output: ${outputPath}`);
  console.log(`Total exams scanned: ${output.totalExams}`);
  console.log(`Exams with discovered links: ${output.withLinks}`);
  console.log(`Exams without discovered links: ${output.withoutLinks}`);
  console.log("=".repeat(80));
}

main().catch((error) => {
  console.error("Collector failed:", error);
  process.exit(1);
});
