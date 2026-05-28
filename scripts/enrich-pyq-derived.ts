#!/usr/bin/env tsx
import { createClient } from "@libsql/client";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

interface DbQuestion {
  id: number;
  question: string;
  options: string;
  correct_answer: number;
  explanation: string;
  source: string;
}

interface ModelAnswer {
  answer: number;
  explanation: string;
  confidence: number;
  model: string;
}

interface ProcessResult {
  id: number;
  status: "updated" | "skipped" | "failed";
  reason?: string;
  answer?: number;
  confidence?: number;
}

const envFile = readFileSync(join(process.cwd(), ".env.local"), "utf-8");
envFile.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const [, key, value] = match;
    process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, "");
  }
});

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const MODELS = [
  "deepseek/deepseek-v4-flash:free",
  "google/gemini-2.0-flash-exp:free",
];

function parseArgs() {
  const args = process.argv.slice(2);
  const sourceIdx = args.indexOf("--source");
  const limitIdx = args.indexOf("--limit");
  const aggressive = args.includes("--aggressive");
  const source = sourceIdx >= 0 ? args[sourceIdx + 1] : "pyq-jee-advanced-2024";
  const limit = limitIdx >= 0 ? Number.parseInt(args[limitIdx + 1], 10) : 200;
  return {
    source,
    limit: Number.isFinite(limit) && limit > 0 ? limit : 200,
    aggressive,
  };
}

function isPlaceholderExplanation(explanation: string | null | undefined): boolean {
  const text = (explanation || "").toLowerCase();
  return (
    text.includes("solution to be added") ||
    text.includes("answer key to be mapped") ||
    text.includes("official pyq parsed")
  );
}

async function askModel(
  model: string,
  question: string,
  options: string[]
): Promise<ModelAnswer | null> {
  const prompt = `Solve this MCQ and return strict JSON.

Question:
${question}

Options:
0) ${options[0]}
1) ${options[1]}
2) ${options[2]}
3) ${options[3]}

Return ONLY:
{
  "answer": 0,
  "confidence": 0.0,
  "explanation": "clear reasoning in 3-6 sentences"
}

Rules:
- answer must be integer 0-3
- confidence must be between 0 and 1
- no markdown`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://prepgenie.co.in",
        "X-Title": "PrepGenie PYQ Enrichment",
      },
      body: JSON.stringify({
        model,
        temperature: 0.1,
        max_tokens: 600,
        messages: [
          {
            role: "system",
            content: "You solve competitive exam MCQs accurately and return strict JSON only.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    let text = (data.choices?.[0]?.message?.content || "").trim();
    text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace < 0 || lastBrace <= firstBrace) return null;
    const parsed = JSON.parse(text.slice(firstBrace, lastBrace + 1));

    const answer = Number(parsed.answer);
    const confidence = Number(parsed.confidence);
    const explanation = String(parsed.explanation || "").trim();
    if (![0, 1, 2, 3].includes(answer)) return null;
    if (!Number.isFinite(confidence) || confidence < 0 || confidence > 1) return null;
    if (explanation.length < 20) return null;

    return { answer, confidence, explanation, model };
  } catch {
    return null;
  }
}

function selectBest(
  a: ModelAnswer | null,
  b: ModelAnswer | null,
  aggressive: boolean
): ModelAnswer | null {
  if (!a && !b) return null;
  if (a && !b) return a.confidence >= (aggressive ? 0.6 : 0.72) ? a : null;
  if (b && !a) return b.confidence >= (aggressive ? 0.6 : 0.72) ? b : null;
  if (!a || !b) return null;

  if (a.answer === b.answer) {
    return {
      answer: a.answer,
      confidence: Math.min(0.99, (a.confidence + b.confidence) / 2 + 0.05),
      explanation: `${a.explanation}\n\nCross-validated with ${a.model} and ${b.model}.`,
      model: `${a.model},${b.model}`,
    };
  }

  const higher = a.confidence >= b.confidence ? a : b;
  const lower = a.confidence >= b.confidence ? b : a;
  if (
    higher.confidence >= (aggressive ? 0.62 : 0.75) &&
    higher.confidence - lower.confidence >= (aggressive ? 0.05 : 0.1)
  ) {
    return higher;
  }
  return null;
}

async function enrichOne(row: DbQuestion, aggressive: boolean): Promise<ProcessResult> {
  let options: string[];
  try {
    options = JSON.parse(row.options);
  } catch {
    return { id: row.id, status: "failed", reason: "Invalid options JSON" };
  }
  if (!Array.isArray(options) || options.length !== 4) {
    return { id: row.id, status: "failed", reason: "Options length not 4" };
  }

  const [m1, m2] = await Promise.all([
    askModel(MODELS[0], row.question, options),
    askModel(MODELS[1], row.question, options),
  ]);
  const chosen = selectBest(m1, m2, aggressive);
  if (!chosen) {
    return { id: row.id, status: "skipped", reason: "No high-confidence consensus" };
  }

  try {
    await db.execute({
      sql: "UPDATE exam_questions SET correct_answer = ?, explanation = ?, source = ? WHERE id = ?",
      args: [
        chosen.answer,
        aggressive
          ? `${chosen.explanation}\n\n[Derived with relaxed confidence mode; manual audit recommended.]`
          : chosen.explanation,
        aggressive ? `pyq-derived-lowconf-${row.source}` : `pyq-derived-${row.source}`,
        row.id,
      ],
    });
    return {
      id: row.id,
      status: "updated",
      answer: chosen.answer,
      confidence: chosen.confidence,
    };
  } catch (err: any) {
    return { id: row.id, status: "failed", reason: err.message || "DB update failed" };
  }
}

async function main() {
  const { source, limit, aggressive } = parseArgs();
  console.log("=".repeat(80));
  console.log("PYQ ANSWER ENRICHMENT RUN");
  console.log("=".repeat(80));
  console.log(`Source filter: ${source}`);
  console.log(`Limit: ${limit}`);
  console.log(`Mode: ${aggressive ? "aggressive" : "standard"}`);

  const rows = await db.execute({
    sql: `SELECT id, question, options, correct_answer, explanation, source
          FROM exam_questions
          WHERE source = ?
          ORDER BY id ASC
          LIMIT ?`,
    args: [source, limit],
  });
  const candidates = (rows.rows as unknown as DbQuestion[]).filter((row) =>
    isPlaceholderExplanation(row.explanation) || row.correct_answer === 0
  );
  console.log(`Fetched: ${rows.rows.length}, candidates: ${candidates.length}`);

  const results: ProcessResult[] = [];
  for (let i = 0; i < candidates.length; i++) {
    const row = candidates[i];
    console.log(`[${i + 1}/${candidates.length}] id=${row.id}`);
    const result = await enrichOne(row, aggressive);
    results.push(result);
    console.log(`   -> ${result.status}${result.reason ? ` (${result.reason})` : ""}`);
    await new Promise((resolve) => setTimeout(resolve, 800));
  }

  const updated = results.filter((r) => r.status === "updated").length;
  const skipped = results.filter((r) => r.status === "skipped").length;
  const failed = results.filter((r) => r.status === "failed").length;

  const reportDir = join(process.cwd(), "pyq-templates");
  if (!existsSync(reportDir)) mkdirSync(reportDir, { recursive: true });
  const reportPath = join(reportDir, "pyq-enrichment-report.json");
  writeFileSync(
    reportPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        source,
        limit,
        candidates: candidates.length,
        updated,
        skipped,
        failed,
        results,
      },
      null,
      2
    )
  );

  console.log("=".repeat(80));
  console.log(`Updated: ${updated}, Skipped: ${skipped}, Failed: ${failed}`);
  console.log(`Report: ${reportPath}`);
  console.log("=".repeat(80));
}

main().catch((err) => {
  console.error("Enrichment run failed:", err);
  process.exit(1);
});
