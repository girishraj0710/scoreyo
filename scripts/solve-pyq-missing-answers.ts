#!/usr/bin/env tsx
import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join } from "path";

interface Row {
  id: number;
  question: string;
  options: string;
  explanation: string;
  source: string;
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

async function dbExecuteWithRetry(query: { sql: string; args?: any[] }, maxRetries = 4): Promise<any> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await db.execute(query);
    } catch (err) {
      if (i === maxRetries - 1) throw err;
      await new Promise((resolve) => setTimeout(resolve, 1200));
    }
  }
}

function cleanText(input: string): string {
  return input
    .replace(/JEE\s*\(Advanced\)\s*\d{4}\s*Paper\s*\d+\s*\d+\/\d+/gi, " ")
    .replace(/SECTION\s+\d+[\s\S]*$/gi, " ")
    .replace(/END OF THE QUESTION PAPER[\s\S]*$/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function needsAnswer(explanation: string, source: string): boolean {
  const e = (explanation || "").toLowerCase();
  const unresolved =
    e.includes("to be mapped") || e.includes("to be added") || e.includes("parsed from paper");
  return unresolved || source === "pyq-jee-advanced-2024";
}

async function solveOne(
  model: string,
  question: string,
  options: string[]
): Promise<{ answer: number; explanation: string } | null> {
  const prompt = `Solve this MCQ and return strict JSON only.
Question: ${question}
Options:
0) ${options[0]}
1) ${options[1]}
2) ${options[2]}
3) ${options[3]}

Return:
{"answer":0,"explanation":"3-6 lines reasoning"}

Rules:
- answer must be one of 0,1,2,3
- no markdown or extra text`;

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://prepgenie.co.in",
        "X-Title": "PrepGenie Missing PYQ Solver",
      },
      body: JSON.stringify({
        model,
        temperature: 0.1,
        max_tokens: 500,
        messages: [
          { role: "system", content: "You solve competitive exam MCQs accurately. Return strict JSON." },
          { role: "user", content: prompt },
        ],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    let text = (data.choices?.[0]?.message?.content || "").trim();
    text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const l = text.indexOf("{");
    const r = text.lastIndexOf("}");
    if (l < 0 || r <= l) return null;
    const parsed = JSON.parse(text.slice(l, r + 1));
    const answer = Number(parsed.answer);
    const explanation = String(parsed.explanation || "").trim();
    if (![0, 1, 2, 3].includes(answer)) return null;
    if (explanation.length < 10) return null;
    return { answer, explanation };
  } catch {
    return null;
  }
}

async function main() {
  const source = "pyq-jee-advanced-2024";
  const rowsResult = await dbExecuteWithRetry({
    sql: `SELECT id, question, options, explanation, source
          FROM exam_questions
          WHERE source IN (?, ?, ?)
          ORDER BY id ASC`,
    args: [source, `pyq-derived-${source}`, `pyq-derived-lowconf-${source}`],
  });

  const rows = rowsResult.rows as unknown as Row[];
  const candidates = rows.filter((r) => needsAnswer(r.explanation, r.source));

  let solved = 0;
  let failed = 0;

  for (let i = 0; i < candidates.length; i++) {
    const row = candidates[i];
    let options: string[] = [];
    try {
      options = JSON.parse(row.options);
    } catch {
      failed++;
      continue;
    }
    if (!Array.isArray(options) || options.length !== 4) {
      failed++;
      continue;
    }

    const q = cleanText(row.question).slice(0, 1200);
    const cleanedOptions = options.map((o) => cleanText(String(o)).slice(0, 400));
    if (!q || cleanedOptions.some((o) => !o)) {
      failed++;
      continue;
    }

    let answer = await solveOne("google/gemini-2.5-flash-lite", q, cleanedOptions);
    if (!answer) {
      answer = await solveOne("deepseek/deepseek-v4-flash:free", q, cleanedOptions);
    }
    if (!answer) {
      failed++;
      continue;
    }

    try {
      await dbExecuteWithRetry({
        sql: "UPDATE exam_questions SET correct_answer = ?, explanation = ?, source = ? WHERE id = ?",
        args: [
          answer.answer,
          answer.explanation,
          `pyq-solved-${source}`,
          row.id,
        ],
      });
      solved++;
    } catch {
      failed++;
      continue;
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  console.log("=".repeat(80));
  console.log("PYQ MISSING ANSWER SOLVE COMPLETE");
  console.log("=".repeat(80));
  console.log(`Candidates: ${candidates.length}`);
  console.log(`Solved+Updated: ${solved}`);
  console.log(`Failed: ${failed}`);
  console.log("=".repeat(80));
}

main().catch((err) => {
  console.error("solve-pyq-missing-answers failed:", err);
  process.exit(1);
});
