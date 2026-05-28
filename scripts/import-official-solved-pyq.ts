#!/usr/bin/env tsx
import { createClient } from "@libsql/client";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

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

const INPUT_FILE =
  "/Users/girish.raj/.cursor/projects/Users-girish-raj-prepgenie/agent-tools/1237e88c-60ae-4283-afd8-aa3312eac68e.txt";

function clean(s: string): string {
  return s
    .replace(/\s+/g, " ")
    .replace(/\|\s*/g, " ")
    .replace(/\s*\|/g, " ")
    .trim();
}

function parseQuestions(content: string) {
  const chunks = content.split(/Q\.\d+\s+/g).slice(1);
  const out: Array<{ question: string; options: string[]; correct: number }> = [];

  for (const chunk of chunks) {
    const a = chunk.indexOf("(A)");
    const b = chunk.indexOf("(B)");
    const c = chunk.indexOf("(C)");
    const d = chunk.indexOf("(D)");
    if ([a, b, c, d].some((x) => x < 0)) continue;
    if (!(a < b && b < c && c < d)) continue;

    const qText = clean(chunk.slice(0, a));
    const oa = clean(chunk.slice(a + 3, b));
    const ob = clean(chunk.slice(b + 3, c));
    const oc = clean(chunk.slice(c + 3, d));
    const afterD = chunk.slice(d + 3);
    const answerMatch = afterD.match(/Answer:\s*([A-D])\b/i);
    if (!answerMatch) continue;
    const od = clean(afterD.slice(0, answerMatch.index || 0));

    if (!qText || !oa || !ob || !oc || !od) continue;
    if (qText.length < 20) continue;
    if (/Answer:\s*[A-D]\s*,/i.test(afterD)) continue;

    const answerLetter = answerMatch[1].toUpperCase();
    const answerIndex = { A: 0, B: 1, C: 2, D: 3 }[answerLetter as "A" | "B" | "C" | "D"];
    out.push({
      question: qText,
      options: [oa, ob, oc, od],
      correct: answerIndex,
    });
  }

  return out;
}

async function insertOne(question: string, options: string[], correct: number) {
  const examId = "jee-advanced";
  const subjectId = "jee-adv-maths";
  const topic = "PYQ Official Solved";
  const source = "pyq-official-solved-jee-adv-2025-p1";

  const existing = await db.execute({
    sql: `SELECT id FROM exam_questions
          WHERE exam_id = ?
            AND subject_id = ?
            AND LOWER(SUBSTR(question, 1, 120)) = LOWER(SUBSTR(?, 1, 120))`,
    args: [examId, subjectId, question],
  });
  if (existing.rows.length > 0) return "duplicate";

  await db.execute({
    sql: `INSERT INTO exam_questions
          (exam_id, subject_id, topic, question, options, correct_answer, explanation, difficulty, source, valid_from, valid_until)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      examId,
      subjectId,
      topic,
      question,
      JSON.stringify(options),
      correct,
      "Official solved PYQ answer mapping.",
      "medium",
      source,
      2024,
      null,
    ],
  });
  return "inserted";
}

async function main() {
  if (!existsSync(INPUT_FILE)) {
    throw new Error(`Input file missing: ${INPUT_FILE}`);
  }
  const content = readFileSync(INPUT_FILE, "utf-8");
  const parsed = parseQuestions(content);

  let inserted = 0;
  let duplicates = 0;
  let failed = 0;

  for (const row of parsed) {
    try {
      const status = await insertOne(row.question, row.options, row.correct);
      if (status === "inserted") inserted++;
      else duplicates++;
    } catch {
      failed++;
    }
  }

  console.log("=".repeat(80));
  console.log("OFFICIAL SOLVED PYQ IMPORT COMPLETE");
  console.log("=".repeat(80));
  console.log(`Parsed: ${parsed.length}`);
  console.log(`Inserted: ${inserted}`);
  console.log(`Duplicates: ${duplicates}`);
  console.log(`Failed: ${failed}`);
  console.log("=".repeat(80));
}

main().catch((err) => {
  console.error("Import failed:", err);
  process.exit(1);
});
