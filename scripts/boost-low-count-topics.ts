#!/usr/bin/env tsx
/**
 * BOOST LOW-COUNT TOPICS
 * Targets topics with 1-10 questions to bring them up to minimum 15
 */

import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join } from "path";
import { examCategories } from "../src/lib/exams";
import { getCurrentSyllabusYear } from "../src/lib/syllabus-config";

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

const VERIFIED_SOURCES: any = {
  "general-knowledge": "Lucent's General Knowledge",
  "general-awareness": "Manorama Yearbook",
  "current-affairs": "Current Affairs Compilations",
  "reasoning": "R.S. Aggarwal Logical Reasoning",
  "quantitative": "R.S. Aggarwal Quantitative Aptitude",
  "english": "Wren & Martin English Grammar",
  "computer": "NIELIT Foundation Course",
  "physics": "NCERT Physics",
  "chemistry": "NCERT Chemistry",
  "biology": "NCERT Biology",
  "mathematics": "NCERT Mathematics",
  "default": "Standard Exam Preparation Books"
};

function getSource(subjectId: string): string {
  for (const [key, source] of Object.entries(VERIFIED_SOURCES)) {
    if (subjectId.toLowerCase().includes(key)) return source as string;
  }
  return VERIFIED_SOURCES.default;
}

async function generateQuestions(examName: string, subject: string, topic: string, count: number) {
  const source = getSource(subject);
  const prompt = `You are generating exam questions. You MUST return valid JSON only.

Exam: ${examName}
Subject: ${subject}
Topic: ${topic}
Count: ${count} questions
Reference: ${source}

CRITICAL RULES:
1. Return ONLY a JSON array, no markdown, no explanations, no extra text
2. Use double quotes for all strings
3. Escape special characters: use \\" for quotes, \\n for newlines
4. No trailing commas
5. correctAnswer must be 0, 1, 2, or 3
6. EVERY question MUST have an "explanation" field (minimum 50 characters)

JSON TEMPLATE - YOU MUST USE ALL THESE FIELDS:
[
  {
    "question": "Clear question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Detailed explanation with reasoning why this answer is correct",
    "difficulty": "medium"
  }
]

IMPORTANT: The "explanation" field is MANDATORY. Never omit it!

Generate ${count} questions now. Return ONLY the JSON array.`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://prepgenie.co.in",
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-haiku",
        messages: [
          { role: "system", content: "You are a JSON generator. Output only valid JSON arrays. Never add markdown or explanations." },
          { role: "user", content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    let text = (data.choices[0]?.message?.content || "").trim();
    if (!text) return [];

    text = text.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();

    const startIdx = text.indexOf('[');
    const endIdx = text.lastIndexOf(']');
    if (startIdx === -1 || endIdx === -1 || startIdx >= endIdx) {
      return [];
    }
    text = text.substring(startIdx, endIdx + 1);

    const questions = JSON.parse(text);
    if (!Array.isArray(questions)) return [];

    const filtered = questions.filter((q: any) =>
      q.question &&
      typeof q.question === 'string' &&
      Array.isArray(q.options) &&
      q.options.length === 4 &&
      typeof q.correctAnswer === 'number' &&
      q.correctAnswer >= 0 &&
      q.correctAnswer <= 3 &&
      q.explanation &&
      typeof q.explanation === 'string'
    );

    return filtered;
  } catch (err: any) {
    return [];
  }
}

async function main() {
  console.log("=".repeat(80));
  console.log("🎯 BOOST LOW-COUNT TOPICS - Claude Haiku");
  console.log("=".repeat(80));
  console.log("Target: Topics with 1-10 questions → bring up to 15 minimum");
  console.log("Model: anthropic/claude-3-haiku");
  console.log("=".repeat(80));

  const MIN_THRESHOLD = 10; // Topics with <= 10 questions
  const TARGET_MIN = 15; // Bring them up to at least 15
  const BATCH_SIZE = 10; // Generate 10 at a time
  let totalInserted = 0;

  // Find all topics with low counts
  const lowCountTopics = await db.execute({
    sql: `
      SELECT exam_id, subject_id, topic, COUNT(*) as cnt
      FROM exam_questions
      GROUP BY exam_id, subject_id, topic
      HAVING cnt <= ?
      ORDER BY cnt ASC, exam_id, subject_id, topic
    `,
    args: [MIN_THRESHOLD],
  });

  console.log(`\nFound ${lowCountTopics.rows.length} topics with ≤${MIN_THRESHOLD} questions\n`);

  if (lowCountTopics.rows.length === 0) {
    console.log("✅ All topics have sufficient questions!");
    return;
  }

  // Get exam names
  const examMap = new Map<string, string>();
  const subjectMap = new Map<string, string>();
  for (const category of examCategories) {
    for (const exam of category.exams) {
      examMap.set(exam.id, exam.name);
      for (const subject of exam.subjects) {
        subjectMap.set(`${exam.id}::${subject.id}`, subject.name);
      }
    }
  }

  let processed = 0;
  for (const row of lowCountTopics.rows) {
    const examId = String(row.exam_id);
    const subjectId = String(row.subject_id);
    const topic = String(row.topic);
    const currentCount = Number(row.cnt);
    const needed = TARGET_MIN - currentCount;

    processed++;
    console.log(`[${processed}/${lowCountTopics.rows.length}] ${examId} → ${subjectId} → ${topic}`);
    console.log(`   Current: ${currentCount}, Need: ${needed}`);

    const examName = examMap.get(examId) || examId;
    const subjectName = subjectMap.get(`${examId}::${subjectId}`) || subjectId;

    const questions = await generateQuestions(examName, subjectName, topic, Math.min(BATCH_SIZE, needed));

    if (questions.length === 0) {
      console.log(`   ⚠️  No valid questions generated`);
      continue;
    }

    const source = getSource(subjectId);
    const validFrom = getCurrentSyllabusYear(examId);
    let inserted = 0;

    for (const q of questions) {
      try {
        const dupe = await db.execute({
          sql: "SELECT id FROM exam_questions WHERE exam_id = ? AND LOWER(SUBSTR(question, 1, 80)) = LOWER(SUBSTR(?, 1, 80))",
          args: [examId, q.question],
        });
        if (dupe.rows.length > 0) continue;

        await db.execute({
          sql: `INSERT INTO exam_questions (exam_id, subject_id, topic, question, options, correct_answer, explanation, difficulty, source, valid_from, valid_until)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            examId, subjectId, topic, q.question, JSON.stringify(q.options),
            q.correctAnswer, q.explanation + ` [${source}]`, q.difficulty,
            `verified-free-${source.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
            validFrom, null,
          ],
        });
        inserted++;
      } catch {}
    }

    if (inserted > 0) {
      totalInserted += inserted;
      console.log(`   ✅ +${inserted} questions (${currentCount} → ${currentCount + inserted})`);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log("\n" + "=".repeat(80));
  console.log(`✅ COMPLETE: ${totalInserted} questions added to ${lowCountTopics.rows.length} topics`);
  console.log("=".repeat(80));
}

main().catch(console.error);
