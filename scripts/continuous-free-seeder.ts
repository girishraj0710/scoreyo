#!/usr/bin/env tsx
/**
 * Continuous Free Seeder - Runs forever using Ollama (FREE!)
 *
 * Strategy:
 * 1. Find topics with < 50 questions
 * 2. Generate 10 questions per topic using local Ollama
 * 3. Loop forever until all topics have 50+ questions
 * 4. 100% FREE - uses local Ollama models
 */

import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join } from "path";
import { examCategories } from "../src/lib/exams";
import { getCurrentSyllabusYear } from "../src/lib/syllabus-config";

type TopicCandidate = {
  examId: string;
  examName: string;
  subjectId: string;
  subjectName: string;
  topic: string;
  currentCount: number;
  category: string;
};

type GeneratedQuestion = {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
};

function loadEnvLocal() {
  const envPath = join(process.cwd(), ".env.local");
  const env = readFileSync(envPath, "utf-8");
  env.split("\n").forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (!match) return;
    const [, key, value] = match;
    process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, "");
  });
}

async function callOllama(model: string, prompt: string): Promise<string> {
  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 3000,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama error ${response.status}`);
    }
    const data = await response.json();
    return data.response || "";
  } catch (err: any) {
    console.log(`      ⚠️  Ollama error: ${err.message}`);
    return "";
  }
}

function parseQuestions(raw: string): GeneratedQuestion[] {
  try {
    let text = raw.trim();
    text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) return [];

    const parsed = JSON.parse(match[0]);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((q) =>
        q &&
        typeof q.question === "string" &&
        Array.isArray(q.options) &&
        q.options.length === 4 &&
        typeof q.correctAnswer === "number" &&
        q.correctAnswer >= 0 &&
        q.correctAnswer <= 3 &&
        typeof q.explanation === "string" &&
        ["easy", "medium", "hard"].includes(String(q.difficulty))
      )
      .map((q) => ({
        question: String(q.question).trim(),
        options: q.options.map((o: unknown) => String(o)),
        correctAnswer: q.correctAnswer,
        explanation: String(q.explanation).trim(),
        difficulty: q.difficulty as "easy" | "medium" | "hard",
      }));
  } catch (err) {
    return [];
  }
}

async function generateForTopic(
  model: string,
  examName: string,
  subjectName: string,
  topic: string,
  count: number
): Promise<GeneratedQuestion[]> {
  const prompt = `Generate exactly ${count} high-quality MCQ questions for Indian competitive exam preparation.

Exam: ${examName}
Subject: ${subjectName}
Topic: ${topic}

Return ONLY valid JSON array with no extra text:
[
  {
    "question": "Clear question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Detailed explanation with core concept and why the correct option is right",
    "difficulty": "easy"
  }
]

Rules:
- Exam-standard difficulty matching ${examName} pattern
- Factually accurate and well-researched
- Mix conceptual and application questions
- Difficulty: 30% easy, 50% medium, 20% hard
- NO markdown, NO extra text, ONLY JSON array`;

  const raw = await callOllama(model, prompt);
  return parseQuestions(raw);
}

async function main() {
  loadEnvLocal();
  const db = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  const TARGET_PER_TOPIC = 15;
  const QUESTIONS_PER_BATCH = 15;
  const MODEL = "llama3.2"; // or "llama3.2:3b", "mistral", etc.

  console.log("=".repeat(80));
  console.log("🔄 CONTINUOUS FREE SEEDER (Ollama)");
  console.log("=".repeat(80));
  console.log("");
  console.log("Model: " + MODEL);
  console.log("Target: 15 questions per topic");
  console.log("Batch size: 15 questions per generation");
  console.log("Cost: $0 (100% FREE using local Ollama)");
  console.log("");
  console.log("This will run continuously until ALL topics reach 15 questions.");
  console.log("Press Ctrl+C to stop at any time.");
  console.log("");
  console.log("=".repeat(80));

  let totalInserted = 0;
  let loopCount = 0;

  while (true) {
    loopCount++;
    console.log(`\n${"=".repeat(80)}`);
    console.log(`🔄 LOOP #${loopCount} - Scanning for topics needing questions...`);
    console.log("=".repeat(80));

    // Scan all topics
    const candidates: TopicCandidate[] = [];
    for (const category of examCategories) {
      for (const exam of category.exams) {
        for (const subject of exam.subjects) {
          for (const topic of subject.topics) {
            try {
              const countRes = await db.execute({
                sql: "SELECT COUNT(*) as c FROM exam_questions WHERE exam_id = ? AND subject_id = ? AND topic = ?",
                args: [exam.id, subject.id, topic],
              });
              const c = Number(countRes.rows[0]?.c || 0);
              if (c < TARGET_PER_TOPIC) {
                candidates.push({
                  examId: exam.id,
                  examName: exam.name,
                  subjectId: subject.id,
                  subjectName: subject.name,
                  topic,
                  currentCount: c,
                  category: category.name,
                });
              }
            } catch (err) {
              // Skip errors
            }
          }
        }
      }
    }

    // Sort by lowest count first
    candidates.sort((a, b) => a.currentCount - b.currentCount);

    console.log(`\nFound ${candidates.length} topics with < ${TARGET_PER_TOPIC} questions`);

    if (candidates.length === 0) {
      console.log("\n🎉 ALL TOPICS COMPLETE! All topics have 15+ questions.");
      console.log(`Total questions inserted this session: ${totalInserted}`);
      break;
    }

    // Process next 50 topics
    const batch = candidates.slice(0, 50);
    console.log(`Processing next ${batch.length} topics...`);

    for (let i = 0; i < batch.length; i++) {
      const t = batch[i];
      const needed = TARGET_PER_TOPIC - t.currentCount;
      const toGenerate = Math.min(QUESTIONS_PER_BATCH, needed);

      console.log(`\n[${i + 1}/${batch.length}] ${t.category} → ${t.examName}`);
      console.log(`   ${t.subjectName} → ${t.topic}`);
      console.log(`   Current: ${t.currentCount}/${TARGET_PER_TOPIC} | Generating: ${toGenerate}`);

      let generated: GeneratedQuestion[] = [];
      try {
        generated = await generateForTopic(MODEL, t.examName, t.subjectName, t.topic, toGenerate);
      } catch (e: any) {
        console.log(`      ⚠️  Generation failed: ${e.message}`);
        continue;
      }

      if (generated.length === 0) {
        console.log("      ⚠️  No valid questions parsed");
        continue;
      }

      console.log(`      ✅ Generated ${generated.length} questions`);

      const validFrom = getCurrentSyllabusYear(t.examId);
      let inserted = 0;
      for (const q of generated) {
        try {
          // Validation 1: Explanation length check (min 100 chars)
          if (q.explanation.length < 100) {
            console.log(`      ⚠️  Explanation too short (${q.explanation.length} chars), skipping`);
            continue;
          }

          // Validation 2: Check for exact duplicates
          const exactDupe = await db.execute({
            sql: "SELECT id FROM exam_questions WHERE exam_id = ? AND subject_id = ? AND LOWER(TRIM(question)) = LOWER(TRIM(?))",
            args: [t.examId, t.subjectId, q.question],
          });
          if (exactDupe.rows.length > 0) {
            console.log(`      ⚠️  Exact duplicate found, skipping`);
            continue;
          }

          // Validation 3: Check for similar duplicates (first 80 chars)
          const similarDupe = await db.execute({
            sql: "SELECT id FROM exam_questions WHERE exam_id = ? AND topic = ? AND LOWER(SUBSTR(question, 1, 80)) = LOWER(SUBSTR(?, 1, 80))",
            args: [t.examId, t.topic, q.question],
          });
          if (similarDupe.rows.length > 0) {
            console.log(`      ⚠️  Similar duplicate found, skipping`);
            continue;
          }

          await db.execute({
            sql: `INSERT INTO exam_questions
              (exam_id, subject_id, topic, question, options, correct_answer, explanation, difficulty, source, valid_from, valid_until)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
              t.examId,
              t.subjectId,
              t.topic,
              q.question,
              JSON.stringify(q.options),
              q.correctAnswer,
              q.explanation,
              q.difficulty,
              "ollama-local-free",
              validFrom,
              null,
            ],
          });
          inserted++;
        } catch {
          // Skip malformed/duplicate rows
        }
      }

      totalInserted += inserted;
      console.log(`      💾 Inserted ${inserted} questions | Total session: ${totalInserted}`);
    }

    console.log(`\n✅ Loop #${loopCount} complete. ${batch.length} topics processed.`);
    console.log(`Total inserted this session: ${totalInserted}`);
    console.log(`Remaining topics: ${candidates.length - batch.length}`);
    console.log("\nStarting next loop in 5 seconds...");

    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  console.log("\n" + "=".repeat(80));
  console.log("✅ CONTINUOUS SEEDING COMPLETE");
  console.log("=".repeat(80));
  console.log(`Total questions inserted: ${totalInserted}`);
  console.log("=".repeat(80));
}

main().catch((err) => {
  console.error("Continuous free seeding failed:", err);
  process.exit(1);
});
