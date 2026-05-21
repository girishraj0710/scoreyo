#!/usr/bin/env tsx
/**
 * FREE PYQ Extractor using Local Ollama
 *
 * Uses local Ollama (FREE) instead of Claude API
 * Slower but $0 cost!
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { createClient } from "@libsql/client";

const envFile = readFileSync(join(process.cwd(), ".env.local"), "utf-8");
envFile.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const [, key, value] = match;
    process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
  }
});

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

/**
 * Call local Ollama (FREE)
 */
async function callOllama(prompt: string): Promise<string> {
  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2",
        prompt,
        stream: false,
        options: {
          temperature: 0.3,
          num_predict: 8000,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama error ${response.status}`);
    }
    const data = await response.json();
    return data.response || "";
  } catch (err: any) {
    console.log(`   ❌ Ollama error: ${err.message}`);
    return "";
  }
}

/**
 * Extract questions using FREE Ollama
 */
async function extractWithOllama(
  examId: string,
  subjectId: string,
  year: number,
  pdfText: string
): Promise<any[]> {

  console.log(`   🤖 Using FREE Ollama (local AI)...`);

  const prompt = `Extract ALL MCQ questions from this exam paper text.

Exam: ${examId} ${year} ${subjectId}

PDF Text:
${pdfText.substring(0, 8000)}

Return ONLY a valid JSON array:
[
  {
    "examId": "${examId}",
    "subjectId": "${subjectId}",
    "topic": "topic name",
    "question": "full question text",
    "options": ["A text", "B text", "C text", "D text"],
    "correctAnswer": 0,
    "explanation": "solution if provided, else 'Official PYQ'",
    "year": ${year},
    "difficulty": "medium"
  }
]

Extract every question. Return only JSON array, nothing else.`;

  const response = await callOllama(prompt);

  try {
    let text = response.trim();
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const match = text.match(/\[[\s\S]*\]/);
    if (!match) return [];

    const questions = JSON.parse(match[0]);
    if (!Array.isArray(questions)) return [];

    return questions.filter((q: any) =>
      q.question &&
      Array.isArray(q.options) &&
      q.options.length === 4 &&
      typeof q.correctAnswer === 'number'
    );
  } catch (err) {
    console.log(`   ⚠️  Parse error: ${err}`);
    return [];
  }
}

/**
 * Process paper with FREE Ollama
 */
async function processPaper(
  examId: string,
  subjectId: string,
  year: number,
  textFile: string
): Promise<number> {

  console.log(`\n📄 ${examId.toUpperCase()} ${year} - ${subjectId}`);

  if (!existsSync(textFile)) {
    console.log(`   ⚠️  File not found: ${textFile}`);
    return 0;
  }

  const pdfText = readFileSync(textFile, 'utf-8');
  if (pdfText.length < 100) {
    console.log(`   ⚠️  Text too short`);
    return 0;
  }

  console.log(`   📝 Text: ${(pdfText.length / 1024).toFixed(1)}KB`);

  const questions = await extractWithOllama(examId, subjectId, year, pdfText);

  if (questions.length === 0) {
    console.log(`   ❌ No questions extracted`);
    return 0;
  }

  console.log(`   ✅ Extracted ${questions.length} questions`);

  // Save JSON
  const outputFile = join('pyq-data', `${examId}-${subjectId}-${year}.json`);
  writeFileSync(outputFile, JSON.stringify(questions, null, 2));
  console.log(`   💾 Saved: ${outputFile}`);

  // Import to database
  let imported = 0;
  for (const q of questions) {
    try {
      const existing = await db.execute({
        sql: `SELECT id FROM exam_questions WHERE exam_id = ? AND LOWER(SUBSTR(question, 1, 80)) = LOWER(SUBSTR(?, 1, 80))`,
        args: [examId, q.question],
      });

      if (existing.rows.length > 0) continue;

      await db.execute({
        sql: `INSERT INTO exam_questions (exam_id, subject_id, topic, question, options, correct_answer, explanation, difficulty, source, valid_from, valid_until)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          examId, subjectId, q.topic, q.question,
          JSON.stringify(q.options), q.correctAnswer,
          q.explanation, q.difficulty || "medium",
          `pyq-${examId}-${year}`, year, null,
        ],
      });

      imported++;
    } catch {}
  }

  console.log(`   ✅ Imported ${imported}/${questions.length} to database`);
  return imported;
}

async function main() {
  console.log("=".repeat(80));
  console.log("🆓 FREE PYQ EXTRACTOR (Ollama)");
  console.log("=".repeat(80));
  console.log("\nCost: $0 (100% FREE using local Ollama)");
  console.log("Speed: Slower than Claude but FREE!");
  console.log("");

  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("Usage:");
    console.log("  npx tsx scripts/free-pyq-extract-ollama.ts <exam> <subject> <year> <text-file>");
    console.log("");
    console.log("Example:");
    console.log("  npx tsx scripts/free-pyq-extract-ollama.ts jee-main physics 2024 file.txt");
    console.log("");
    console.log("Prerequisites:");
    console.log("  1. Ollama must be running: ollama serve");
    console.log("  2. Model installed: ollama pull llama3.2");
    console.log("");
    console.log("=".repeat(80));
    return;
  }

  if (args.length === 4) {
    const [examId, subjectId, year, textFile] = args;
    await processPaper(examId, subjectId, parseInt(year), textFile);
  }
}

main().catch(console.error);
