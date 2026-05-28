#!/usr/bin/env tsx
import { createClient } from "@libsql/client";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

interface RawQuestion {
  qno: number;
  question: string;
  options: string[];
  section: string;
}

interface SolvedQuestion extends RawQuestion {
  correctAnswer: number;
  explanation: string;
  answerSource: "official-key" | "derived";
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

const PAPERS = [
  "pyq-raw/jee-advanced/p1_english.txt",
  "pyq-raw/jee-advanced/p2_english.txt",
];

const TARGET = {
  examId: "jee-advanced",
  subjectId: "jee-adv-maths",
  topic: "PYQ Mathematics",
  source: "pyq-real-jee-advanced-2024-v2",
  year: 2024,
};

function cleanText(text: string): string {
  return text
    .replace(/--\s*\d+\s*of\s*\d+\s*--/gi, " ")
    .replace(/JEE\s*\(Advanced\)\s*\d{4}\s*Paper\s*\d+\s*\d+\/\d+/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function trimOptionNoise(text: string): string {
  return cleanText(
    text
      .replace(/SECTION\s+\d+.*$/i, "")
      .replace(/END OF THE QUESTION PAPER.*$/i, "")
      .replace(/Match each entry.*$/i, "")
  );
}

function parseSingleCorrectMcq(raw: string): RawQuestion[] {
  const section1Start = raw.search(/SECTION\s*1/i);
  if (section1Start < 0) return [];
  const section2Start = raw.search(/SECTION\s*2/i);
  const sectionText = raw.slice(section1Start, section2Start > section1Start ? section2Start : undefined);

  const blocks = sectionText.split(/Q\.(\d+)\s+/g);
  const questions: RawQuestion[] = [];
  for (let i = 1; i < blocks.length; i += 2) {
    const qno = Number.parseInt(blocks[i], 10);
    const body = blocks[i + 1] || "";
    if (!Number.isFinite(qno)) continue;

    const a = body.indexOf("(A)");
    const b = body.indexOf("(B)");
    const c = body.indexOf("(C)");
    const d = body.indexOf("(D)");
    if ([a, b, c, d].some((x) => x < 0)) continue;
    if (!(a < b && b < c && c < d)) continue;

    const question = cleanText(body.slice(0, a));
    const oa = trimOptionNoise(body.slice(a + 3, b));
    const ob = trimOptionNoise(body.slice(b + 3, c));
    const oc = trimOptionNoise(body.slice(c + 3, d));

    const dTail = body.slice(d + 3);
    const nextQ = dTail.search(/Q\.\d+\s+/);
    const od = trimOptionNoise(nextQ >= 0 ? dTail.slice(0, nextQ) : dTail);

    if (!question || question.length < 20) continue;
    if ([oa, ob, oc, od].some((opt) => !opt || opt.length < 1)) continue;
    if (new Set([oa, ob, oc, od]).size < 4) continue;

    questions.push({
      qno,
      section: "single-correct",
      question,
      options: [oa, ob, oc, od],
    });
  }
  return questions;
}

function parseOfficialKeyMap(): Map<string, number> {
  // If any local key file exists later, this parser can be extended.
  // For now: return empty map and fallback to derivation.
  return new Map<string, number>();
}

async function solveWithModel(model: string, q: RawQuestion): Promise<{ answer: number; explanation: string } | null> {
  const prompt = `Solve this JEE Advanced single-correct MCQ.

Question: ${q.question}
Options:
0) ${q.options[0]}
1) ${q.options[1]}
2) ${q.options[2]}
3) ${q.options[3]}

Return strict JSON only:
{"answer":0,"explanation":"brief reasoning"}

Rules:
- answer must be one of 0,1,2,3
- no markdown`;

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://prepgenie.co.in",
        "X-Title": "PrepGenie Real PYQ Import V2",
      },
      body: JSON.stringify({
        model,
        temperature: 0.1,
        max_tokens: 450,
        messages: [
          { role: "system", content: "You solve MCQs and return strict JSON only." },
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
    if (explanation.length < 8) return null;
    return { answer, explanation };
  } catch {
    return null;
  }
}

async function deriveAnswer(q: RawQuestion): Promise<{ answer: number; explanation: string } | null> {
  // Two-model fallback. Accept first valid response for throughput.
  const models = ["deepseek/deepseek-v4-flash:free", "google/gemini-2.0-flash-exp:free"];
  for (const model of models) {
    const solved = await solveWithModel(model, q);
    if (solved) return solved;
  }
  return null;
}

async function insertQuestion(row: SolvedQuestion): Promise<"inserted" | "duplicate" | "failed"> {
  try {
    const existing = await db.execute({
      sql: `SELECT id FROM exam_questions
            WHERE exam_id = ?
              AND subject_id = ?
              AND LOWER(SUBSTR(question, 1, 140)) = LOWER(SUBSTR(?, 1, 140))`,
      args: [TARGET.examId, TARGET.subjectId, row.question],
    });
    if (existing.rows.length > 0) return "duplicate";

    await db.execute({
      sql: `INSERT INTO exam_questions
            (exam_id, subject_id, topic, question, options, correct_answer, explanation, difficulty, source, valid_from, valid_until)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        TARGET.examId,
        TARGET.subjectId,
        TARGET.topic,
        row.question,
        JSON.stringify(row.options),
        row.correctAnswer,
        row.explanation,
        "medium",
        TARGET.source,
        TARGET.year,
        null,
      ],
    });
    return "inserted";
  } catch {
    return "failed";
  }
}

async function main() {
  const parsedAll: RawQuestion[] = [];
  for (const file of PAPERS) {
    if (!existsSync(file)) continue;
    const raw = readFileSync(file, "utf-8");
    parsedAll.push(...parseSingleCorrectMcq(raw));
  }

  // De-dupe parsed set by question stem.
  const uniqMap = new Map<string, RawQuestion>();
  for (const q of parsedAll) {
    const k = q.question.toLowerCase().slice(0, 180);
    if (!uniqMap.has(k)) uniqMap.set(k, q);
  }
  const parsed = Array.from(uniqMap.values());

  const officialKeyMap = parseOfficialKeyMap();
  let solved = 0;
  let inserted = 0;
  let duplicates = 0;
  let failed = 0;
  let officialAnswered = 0;
  let derivedAnswered = 0;

  for (let i = 0; i < parsed.length; i++) {
    const q = parsed[i];
    const key = `${q.qno}`;
    const officialAnswer = officialKeyMap.get(key);
    let final: SolvedQuestion | null = null;

    if (officialAnswer !== undefined) {
      final = {
        ...q,
        correctAnswer: officialAnswer,
        explanation: "Answer mapped from official key.",
        answerSource: "official-key",
      };
    } else {
      const derived = await deriveAnswer(q);
      if (derived) {
        final = {
          ...q,
          correctAnswer: derived.answer,
          explanation: derived.explanation,
          answerSource: "derived",
        };
      }
    }

    if (!final) {
      failed++;
      continue;
    }
    solved++;
    if (final.answerSource === "official-key") officialAnswered++;
    else derivedAnswered++;

    const status = await insertQuestion(final);
    if (status === "inserted") inserted++;
    else if (status === "duplicate") duplicates++;
    else failed++;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  console.log("=".repeat(80));
  console.log("REAL PYQ IMPORT V2 COMPLETE");
  console.log("=".repeat(80));
  console.log(`Parsed real questions: ${parsed.length}`);
  console.log(`Solved answers: ${solved}`);
  console.log(`Official-key answers: ${officialAnswered}`);
  console.log(`Derived answers: ${derivedAnswered}`);
  console.log(`Inserted: ${inserted}`);
  console.log(`Duplicates: ${duplicates}`);
  console.log(`Failed: ${failed}`);
  console.log("=".repeat(80));
}

main().catch((err) => {
  console.error("Import failed:", err);
  process.exit(1);
});
