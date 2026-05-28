#!/usr/bin/env tsx
import { createClient } from "@libsql/client";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

interface ParsedQuestion {
  question: string;
  options: string[];
}

interface SolvedQuestion extends ParsedQuestion {
  correctAnswer: number;
  explanation: string;
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

const TARGETS = [
  {
    examId: "jee-advanced",
    subjectId: "jee-adv-maths",
    topic: "PYQ Mathematics",
    year: 2024,
    source: "pyq-auto-jee-advanced-2024",
    file: "pyq-raw/jee-advanced/p1_english.txt",
  },
  {
    examId: "jee-advanced",
    subjectId: "jee-adv-maths",
    topic: "PYQ Mathematics",
    year: 2024,
    source: "pyq-auto-jee-advanced-2024",
    file: "pyq-raw/jee-advanced/p2_english.txt",
  },
];

function cleanText(s: string): string {
  return s
    .replace(/--\s*\d+\s*of\s*\d+\s*--/g, " ")
    .replace(/JEE\s*\(Advanced\)\s*\d{4}\s*Paper\s*\d+\s*\d+\/\d+/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseMcqQuestions(text: string): ParsedQuestion[] {
  const chunks = text.split(/Q\.\d+\s+/g).slice(1);
  const questions: ParsedQuestion[] = [];

  for (const chunk of chunks) {
    const a = chunk.indexOf("(A)");
    const b = chunk.indexOf("(B)");
    const c = chunk.indexOf("(C)");
    const d = chunk.indexOf("(D)");
    if ([a, b, c, d].some((x) => x < 0)) continue;
    if (!(a < b && b < c && c < d)) continue;

    const stem = cleanText(chunk.slice(0, a));
    const oa = cleanText(chunk.slice(a + 3, b));
    const ob = cleanText(chunk.slice(b + 3, c));
    const oc = cleanText(chunk.slice(c + 3, d));
    const dRaw = chunk.slice(d + 3);
    const nextQ = dRaw.search(/Q\.\d+\s+/);
    const od = cleanText(nextQ >= 0 ? dRaw.slice(0, nextQ) : dRaw);

    if (!stem || !oa || !ob || !oc || !od) continue;
    if (stem.length < 25) continue;
    if ([oa, ob, oc, od].some((opt) => opt.length < 1)) continue;
    questions.push({ question: stem, options: [oa, ob, oc, od] });
  }

  return questions;
}

async function callSolverModel(model: string, q: ParsedQuestion): Promise<{ answer: number; explanation: string } | null> {
  const prompt = `Solve this MCQ and output strict JSON only.
Question: ${q.question}
Options:
0) ${q.options[0]}
1) ${q.options[1]}
2) ${q.options[2]}
3) ${q.options[3]}

Return:
{"answer":0,"explanation":"short reasoning"}
Rules:
- answer must be 0-3
- no markdown`;

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://prepgenie.co.in",
        "X-Title": "PrepGenie Autonomous PYQ Import",
      },
      body: JSON.stringify({
        model,
        temperature: 0.1,
        max_tokens: 500,
        messages: [
          { role: "system", content: "Return strict JSON only." },
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
    const ans = Number(parsed.answer);
    const explanation = String(parsed.explanation || "").trim();
    if (![0, 1, 2, 3].includes(ans)) return null;
    if (explanation.length < 8) return null;
    return { answer: ans, explanation };
  } catch {
    return null;
  }
}

async function solveQuestion(q: ParsedQuestion): Promise<SolvedQuestion | null> {
  const models = ["deepseek/deepseek-v4-flash:free", "google/gemini-2.0-flash-exp:free"];
  for (const model of models) {
    const solved = await callSolverModel(model, q);
    if (solved) {
      return {
        ...q,
        correctAnswer: solved.answer,
        explanation: solved.explanation,
      };
    }
  }
  return null;
}

async function insertSolved(
  examId: string,
  subjectId: string,
  topic: string,
  source: string,
  solved: SolvedQuestion
): Promise<"inserted" | "duplicate" | "failed"> {
  try {
    const existing = await db.execute({
      sql: `SELECT id FROM exam_questions
            WHERE exam_id = ?
              AND subject_id = ?
              AND LOWER(SUBSTR(question, 1, 120)) = LOWER(SUBSTR(?, 1, 120))`,
      args: [examId, subjectId, solved.question],
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
        solved.question,
        JSON.stringify(solved.options),
        solved.correctAnswer,
        solved.explanation,
        "medium",
        source,
        2024,
        null,
      ],
    });
    return "inserted";
  } catch {
    return "failed";
  }
}

async function processTarget(target: (typeof TARGETS)[0]) {
  if (!existsSync(target.file)) {
    return { parsed: 0, solved: 0, inserted: 0, duplicates: 0, failed: 0 };
  }

  const raw = readFileSync(target.file, "utf-8");
  const parsed = parseMcqQuestions(raw);

  let solvedCount = 0;
  let inserted = 0;
  let duplicates = 0;
  let failed = 0;

  for (let i = 0; i < parsed.length; i++) {
    const q = parsed[i];
    const solved = await solveQuestion(q);
    if (!solved) {
      failed++;
      continue;
    }
    solvedCount++;
    const status = await insertSolved(
      target.examId,
      target.subjectId,
      target.topic,
      target.source,
      solved
    );
    if (status === "inserted") inserted++;
    else if (status === "duplicate") duplicates++;
    else failed++;
    await new Promise((resolve) => setTimeout(resolve, 350));
  }

  return { parsed: parsed.length, solved: solvedCount, inserted, duplicates, failed };
}

async function main() {
  let totals = { parsed: 0, solved: 0, inserted: 0, duplicates: 0, failed: 0 };
  for (const target of TARGETS) {
    const r = await processTarget(target);
    totals = {
      parsed: totals.parsed + r.parsed,
      solved: totals.solved + r.solved,
      inserted: totals.inserted + r.inserted,
      duplicates: totals.duplicates + r.duplicates,
      failed: totals.failed + r.failed,
    };
  }

  console.log("=".repeat(80));
  console.log("AUTONOMOUS PYQ IMPORT COMPLETE");
  console.log("=".repeat(80));
  console.log(`Parsed: ${totals.parsed}`);
  console.log(`Solved: ${totals.solved}`);
  console.log(`Inserted: ${totals.inserted}`);
  console.log(`Duplicates: ${totals.duplicates}`);
  console.log(`Failed: ${totals.failed}`);
  console.log("=".repeat(80));
}

main().catch((err) => {
  console.error("Autonomous import failed:", err);
  process.exit(1);
});
