#!/usr/bin/env tsx
/**
 * COMPREHENSIVE ALL-SUBJECTS SEEDER
 *
 * Coverage: ALL 225 SUBJECTS across ALL 28 CATEGORIES
 * - Engineering, Medical, Banking, SSC, Law, Defence, Teaching, Railways
 * - Police, Insurance, Commerce, Agriculture, Veterinary, Pharmacy, Nursing
 * - Hotel Management, Architecture, Design, Postal, Mass Communication, etc.
 *
 * Strategy:
 * 1. Scan ALL topics across ALL subjects
 * 2. Identify topics below 50 questions
 * 3. Generate 50 questions per topic (not just science subjects!)
 * 4. Cover EVERY exam equally
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

const TARGET_PER_TOPIC = 50; // Every topic should have at least 50 questions
const GENERATE_PER_BATCH = 5; // Generate 5 questions per API call

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: string;
}

async function dbExecuteWithRetry(query: any, maxRetries = 3): Promise<any> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await db.execute(query);
    } catch (error: any) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

/**
 * Generate questions for ANY topic
 */
async function generateQuestions(
  examName: string,
  subjectName: string,
  topic: string,
  count: number
): Promise<Question[]> {
  const prompt = `Generate ${count} high-quality multiple-choice questions for ${examName} exam.

Subject: ${subjectName}
Topic: ${topic}

Requirements:
- Exam-standard difficulty
- Clear, unambiguous questions
- 4 distinct options
- One definitively correct answer
- Detailed explanation (100+ words) with step-by-step reasoning

Return ONLY valid JSON array:
[
  {
    "question": "Complete question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Detailed explanation with reasoning, formulas where applicable, and why other options are wrong",
    "difficulty": "easy|medium|hard"
  }
]`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://prepgenie.co.in",
        "X-Title": "PrepGenie Comprehensive Seeder",
      },
      body: JSON.stringify({
        model: "google/gemini-3.1-flash-lite",
        messages: [
          {
            role: "system",
            content: `You are an expert exam question creator for Indian competitive exams. Generate high-quality MCQs matching the exam's difficulty and pattern. Return only JSON array.`
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2500,
      }),
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    let text = data.choices[0]?.message?.content || "";

    text = text.trim();
    if (text.startsWith('```')) {
      text = text.replace(/```json?\n?/g, '').replace(/```$/g, '').trim();
    }

    const questions = JSON.parse(text);

    if (!Array.isArray(questions)) {
      return [];
    }

    // Validate each question
    return questions.filter(q =>
      q.question &&
      Array.isArray(q.options) &&
      q.options.length === 4 &&
      typeof q.correctAnswer === 'number' &&
      q.explanation &&
      q.explanation.length > 50
    );
  } catch (err) {
    return [];
  }
}

/**
 * Fill a topic to target count
 */
async function fillTopic(
  examId: string,
  examName: string,
  subjectId: string,
  subjectName: string,
  topic: string,
  currentCount: number,
  targetCount: number
): Promise<number> {
  const needed = targetCount - currentCount;
  if (needed <= 0) return 0;

  console.log(`   📝 ${topic} (${currentCount}/${targetCount})`);
  console.log(`      Need: ${needed} more questions`);

  let inserted = 0;
  const validFrom = getCurrentSyllabusYear(examId);

  while (inserted < needed) {
    const batchSize = Math.min(GENERATE_PER_BATCH, needed - inserted);

    const questions = await generateQuestions(
      examName,
      subjectName,
      topic,
      batchSize
    );

    if (questions.length === 0) {
      console.log(`      ⚠️  Generation failed, skipping`);
      break;
    }

    for (const q of questions) {
      try {
        // Check duplicate
        const existing = await dbExecuteWithRetry({
          sql: `SELECT id FROM exam_questions
                WHERE exam_id = ? AND subject_id = ? AND LOWER(TRIM(question)) = LOWER(TRIM(?))`,
          args: [examId, subjectId, q.question],
        });

        if (existing.rows.length > 0) continue;

        // Insert
        await dbExecuteWithRetry({
          sql: `INSERT INTO exam_questions
                (exam_id, subject_id, topic, question, options, correct_answer, explanation, difficulty, source, valid_from, valid_until)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            examId,
            subjectId,
            topic,
            q.question,
            JSON.stringify(q.options),
            q.correctAnswer,
            q.explanation,
            q.difficulty,
            'ai-generated-comprehensive',
            validFrom,
            null,
          ],
        });

        inserted++;
      } catch (err) {
        // Skip errors
      }
    }

    console.log(`      ✅ Progress: ${currentCount + inserted}/${targetCount}`);

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  return inserted;
}

async function main() {
  console.log("=".repeat(80));
  console.log("🌍 COMPREHENSIVE ALL-SUBJECTS SEEDER");
  console.log("=".repeat(80));
  console.log("");
  console.log("Coverage: ALL 225 subjects across ALL 28 categories");
  console.log("Target: 50 questions per topic minimum");
  console.log("Model: Google Gemini 3.1 Flash Lite");
  console.log("");
  console.log("=".repeat(80));

  // Scan all topics across all subjects
  interface TopicStatus {
    examId: string;
    examName: string;
    subjectId: string;
    subjectName: string;
    topic: string;
    currentCount: number;
    category: string;
  }

  const allTopics: TopicStatus[] = [];

  console.log("\n📊 Scanning all topics across all exams...\n");

  for (const category of examCategories) {
    console.log(`\n${category.icon} ${category.name}`);

    for (const exam of category.exams) {
      console.log(`   ${exam.icon} ${exam.name}`);

      for (const subject of exam.subjects) {
        console.log(`      ${subject.icon} ${subject.name}`);

        for (const topic of subject.topics) {
          const result = await dbExecuteWithRetry({
            sql: `SELECT COUNT(*) as count FROM exam_questions
                  WHERE exam_id = ? AND subject_id = ? AND topic = ?`,
            args: [exam.id, subject.id, topic],
          });

          const count = Number(result.rows[0].count);

          if (count < TARGET_PER_TOPIC) {
            allTopics.push({
              examId: exam.id,
              examName: exam.name,
              subjectId: subject.id,
              subjectName: subject.name,
              topic,
              currentCount: count,
              category: category.name,
            });
          }
        }
      }
    }
  }

  // Sort by current count (fill emptiest first)
  allTopics.sort((a, b) => a.currentCount - b.currentCount);

  console.log("\n" + "=".repeat(80));
  console.log("📊 ANALYSIS COMPLETE");
  console.log("=".repeat(80));
  console.log(`Total topics needing questions: ${allTopics.length}`);
  console.log(`Topics with 0 questions: ${allTopics.filter(t => t.currentCount === 0).length}`);
  console.log(`Topics with 1-25 questions: ${allTopics.filter(t => t.currentCount > 0 && t.currentCount <= 25).length}`);
  console.log(`Topics with 26-49 questions: ${allTopics.filter(t => t.currentCount > 25 && t.currentCount < 50).length}`);
  console.log("");

  // Show breakdown by category
  const byCategory: Record<string, number> = {};
  allTopics.forEach(t => {
    byCategory[t.category] = (byCategory[t.category] || 0) + 1;
  });

  console.log("Breakdown by category:");
  Object.keys(byCategory).sort((a, b) => byCategory[b] - byCategory[a]).forEach(cat => {
    console.log(`  ${cat}: ${byCategory[cat]} topics need questions`);
  });

  console.log("\n" + "=".repeat(80));
  console.log("🚀 STARTING GENERATION");
  console.log("=".repeat(80));

  let totalInserted = 0;
  let topicsProcessed = 0;

  for (const topicStatus of allTopics) {
    console.log(`\n[${topicsProcessed + 1}/${allTopics.length}] ${topicStatus.category} → ${topicStatus.examName}`);
    console.log(`   ${topicStatus.subjectName}`);

    const inserted = await fillTopic(
      topicStatus.examId,
      topicStatus.examName,
      topicStatus.subjectId,
      topicStatus.subjectName,
      topicStatus.topic,
      topicStatus.currentCount,
      TARGET_PER_TOPIC
    );

    totalInserted += inserted;
    topicsProcessed++;

    // Progress update every 10 topics
    if (topicsProcessed % 10 === 0) {
      console.log(`\n📊 Progress: ${topicsProcessed}/${allTopics.length} topics | ${totalInserted} questions added`);
    }
  }

  console.log("\n" + "=".repeat(80));
  console.log("✅ COMPREHENSIVE SEEDING COMPLETE");
  console.log("=".repeat(80));
  console.log(`Topics processed: ${topicsProcessed}`);
  console.log(`Questions inserted: ${totalInserted}`);
  console.log(`Coverage: ALL 225 subjects across ALL 28 categories`);
  console.log("=".repeat(80));
}

main().then(() => process.exit(0)).catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
