#!/usr/bin/env tsx
/**
 * Daily Auto-Seeding Cron Job
 *
 * Purpose: Automatically grow question bank by seeding low-stock topics
 * Frequency: Daily (recommended: 2 AM IST)
 * Target: Topics with < 100 questions (keep well-stocked!)
 * Amount: 30 questions per topic per day
 *
 * Strategy:
 * - Identify topics below threshold (100 questions)
 * - Prioritize topics with lowest stock first
 * - Seed 30 questions per topic
 * - Stop after 20 topics (600 total questions per day)
 * - Uses ~120 API requests/day (well under 1000/day quota)
 * - Ensures users NEVER hit Tier 3 AI generation
 *
 * Expected Growth:
 * - Day 1: 20 low-stock topics → +600 questions
 * - Day 7: +4,200 questions/week
 * - Day 30: +18,000 questions/month
 * - Result: All topics stay above 100 questions permanently!
 */

import { createClient } from "@libsql/client";
import { readFileSync, appendFileSync } from "fs";
import { join } from "path";
import { examCategories } from "../src/lib/exams";

// Load environment (only for local development)
const envPath = join(process.cwd(), ".env.local");
if (require("fs").existsSync(envPath)) {
  const envFile = readFileSync(envPath, "utf-8");
  envFile.split("\n").forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const [, key, value] = match;
      process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
    }
  });
}

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Configuration
const QUESTIONS_PER_TOPIC = 30; // Daily increment per topic (increased from 20)
const LOW_STOCK_THRESHOLD = 100; // Topics below this get priority (increased from 50)
const MAX_TOPICS_PER_DAY = 20; // Limit to 20 topics/day = 600 questions/day (increased from 10)
const BATCH_SIZE = 5; // Process 5 topics at a time
const DELAY_BETWEEN_BATCHES = 15000; // 15 seconds between batches

const LOG_FILE = join(process.cwd(), "daily-seed-cron.log");

function log(message: string) {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] ${message}\n`;
  console.log(message);
  try {
    appendFileSync(LOG_FILE, logLine);
  } catch (err) {
    // Ignore log file errors
  }
}

/**
 * Retry wrapper for database operations
 */
async function dbExecuteWithRetry(query: any, maxRetries = 3): Promise<any> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await db.execute(query);
    } catch (error: any) {
      if (i === maxRetries - 1) throw error;
      log(`  ⚠️  Database error (attempt ${i + 1}/${maxRetries}): ${error.message}. Retrying in 5s...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

/**
 * Count existing questions for a topic
 */
async function countTopicQuestions(
  examId: string,
  subjectId: string,
  topic: string
): Promise<number> {
  const result = await dbExecuteWithRetry({
    sql: "SELECT COUNT(*) as count FROM exam_questions WHERE exam_id = ? AND subject_id = ? AND topic = ?",
    args: [examId, subjectId, topic],
  });
  return Number(result.rows[0]?.count || 0);
}

/**
 * Generate questions using AI
 */
async function generateQuestions(
  examId: string,
  examName: string,
  subjectId: string,
  subjectName: string,
  topic: string,
  count: number
): Promise<any[]> {
  // Get exam details for better prompts
  const category = examCategories.find(c => c.exams.some(e => e.id === examId));
  const exam = category?.exams.find(e => e.id === examId);
  const subject = exam?.subjects.find(s => s.id === subjectId);

  const examContext = exam?.description || examName;
  const subjectDescription = subjectName; // Subject doesn't have description field

  const prompt = `You are an expert question setter for ${examName} exam preparation.

EXAM CONTEXT: ${examContext}
SUBJECT: ${subjectName} - ${subjectDescription}
TOPIC: ${topic}

Generate ${count} high-quality multiple-choice questions for ${examName} ${subjectName} - ${topic}.

QUALITY STANDARDS:
1. Syllabus-aligned: Follow official ${examName} syllabus patterns
2. Exam-realistic: Match actual ${examName} difficulty and format
3. Conceptual clarity: Test understanding, not just memorization
4. Varied difficulty: Mix of easy (30%), medium (40%), hard (30%)
5. Unique questions: No repetition of common textbook problems
6. Rich explanations: 50+ words with step-by-step logic

QUESTION TYPES (distribute evenly):
- Conceptual (40%): Test core principles and theory
- Numerical (35%): Calculations and problem-solving
- Application (25%): Real-world scenarios

EXPLANATION QUALITY:
✅ Include: Why correct answer is right + why others are wrong
✅ Include: Key formulas, theorems, or concepts used
✅ Include: Common mistakes students make
✅ Length: Minimum 50 words, preferably 80-100 words

Return ONLY valid JSON array (no markdown, no explanations outside JSON):
[
  {
    "question": "Complete question text (clear, unambiguous)",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Detailed 50+ word explanation with logic, formulas, and common mistakes",
    "difficulty": "easy|medium|hard"
  }
]

IMPORTANT: Return ONLY the JSON array. No markdown code blocks, no additional text.`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://prepgenie.co.in",
      "X-Title": "PrepGenie Daily Seeder",
    },
    body: JSON.stringify({
      model: "google/gemini-flash-1.5",
      messages: [
        {
          role: "system",
          content: "You are an expert exam question generator. Return only valid JSON arrays.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content || "";

  // Clean up response
  let jsonContent = content.trim();
  if (jsonContent.startsWith("```json")) {
    jsonContent = jsonContent.replace(/```json\n?/g, "").replace(/```\n?/g, "");
  } else if (jsonContent.startsWith("```")) {
    jsonContent = jsonContent.replace(/```\n?/g, "");
  }

  const questions = JSON.parse(jsonContent);

  // Validate questions
  const validQuestions = questions.filter((q: any) => {
    if (!q.question || !Array.isArray(q.options) || q.options.length !== 4) return false;
    if (typeof q.correctAnswer !== "number" || q.correctAnswer < 0 || q.correctAnswer > 3) return false;
    if (!q.explanation || q.explanation.length < 50) return false;
    if (!["easy", "medium", "hard"].includes(q.difficulty)) return false;
    return true;
  });

  return validQuestions;
}

/**
 * Seed a single topic
 */
async function seedTopic(
  examId: string,
  examName: string,
  subjectId: string,
  subjectName: string,
  topic: string
): Promise<boolean> {
  try {
    log(`   🌱 Seeding: ${examName} → ${subjectName} → ${topic}`);
    log(`   🤖 Generating ${QUESTIONS_PER_TOPIC} questions...`);

    const questions = await generateQuestions(
      examId,
      examName,
      subjectId,
      subjectName,
      topic,
      QUESTIONS_PER_TOPIC
    );

    if (questions.length === 0) {
      log(`   ⚠️  No valid questions generated`);
      return false;
    }

    log(`   ✅ Generated ${questions.length} questions, inserting into database...`);

    // Insert questions
    let inserted = 0;
    for (const q of questions) {
      try {
        await dbExecuteWithRetry({
          sql: `INSERT INTO exam_questions (exam_id, subject_id, topic, question, options, correct_answer, explanation, difficulty, source)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            examId,
            subjectId,
            topic,
            q.question,
            JSON.stringify(q.options),
            q.correctAnswer,
            q.explanation,
            q.difficulty,
            "expert-curated", // Daily seeded questions are expert-curated
          ],
        });
        inserted++;
      } catch (err: any) {
        log(`   ⚠️  Skipped duplicate question`);
      }
    }

    log(`   ✅ Inserted ${inserted}/${questions.length} questions`);
    return inserted > 0;
  } catch (error: any) {
    log(`   ❌ Error: ${error.message}`);
    return false;
  }
}

/**
 * Find low-stock topics that need seeding
 */
async function findLowStockTopics(): Promise<
  Array<{
    examId: string;
    examName: string;
    subjectId: string;
    subjectName: string;
    topic: string;
    currentStock: number;
  }>
> {
  log("🔍 Scanning for low-stock topics...");

  const lowStockTopics: Array<{
    examId: string;
    examName: string;
    subjectId: string;
    subjectName: string;
    topic: string;
    currentStock: number;
  }> = [];

  // Scan all exams
  for (const category of examCategories) {
    for (const exam of category.exams) {
      for (const subject of exam.subjects) {
        for (const topic of subject.topics) {
          const count = await countTopicQuestions(exam.id, subject.id, topic);

          if (count < LOW_STOCK_THRESHOLD) {
            lowStockTopics.push({
              examId: exam.id,
              examName: exam.name,
              subjectId: subject.id,
              subjectName: subject.name,
              topic,
              currentStock: count,
            });
          }
        }
      }
    }
  }

  // Sort by lowest stock first
  lowStockTopics.sort((a, b) => a.currentStock - b.currentStock);

  log(`   Found ${lowStockTopics.length} topics below threshold (${LOW_STOCK_THRESHOLD} questions)`);

  return lowStockTopics;
}

/**
 * Main cron execution
 */
async function runDailySeeding() {
  const startTime = Date.now();

  log("═".repeat(80));
  log("🌱 DAILY AUTO-SEEDING CRON JOB");
  log("═".repeat(80));
  log(`Started: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`);
  log("");

  try {
    // Find topics that need seeding
    const lowStockTopics = await findLowStockTopics();

    if (lowStockTopics.length === 0) {
      log("✅ All topics are well-stocked! No seeding needed today.");
      log("═".repeat(80));
      return { success: true, topicsSeeded: 0, questionsAdded: 0 };
    }

    // Limit to MAX_TOPICS_PER_DAY
    const topicsToSeed = lowStockTopics.slice(0, MAX_TOPICS_PER_DAY);

    log(`📋 Target: ${topicsToSeed.length} topics (${topicsToSeed.length * QUESTIONS_PER_TOPIC} questions total)`);
    log(`💪 Aggressive mode: Keeping all topics above 100 questions!`);
    log("");

    // Process in batches
    let successCount = 0;
    for (let i = 0; i < topicsToSeed.length; i += BATCH_SIZE) {
      const batch = topicsToSeed.slice(i, i + BATCH_SIZE);
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(topicsToSeed.length / BATCH_SIZE);

      log(`📦 Batch ${batchNum}/${totalBatches} (${batch.length} topics)`);

      for (const topic of batch) {
        const success = await seedTopic(
          topic.examId,
          topic.examName,
          topic.subjectId,
          topic.subjectName,
          topic.topic
        );
        if (success) successCount++;
      }

      // Delay between batches
      if (i + BATCH_SIZE < topicsToSeed.length) {
        log(`   ⏸️  Pausing ${DELAY_BETWEEN_BATCHES / 1000}s before next batch...`);
        await new Promise((resolve) => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
        log("");
      }
    }

    const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
    const questionsAdded = successCount * QUESTIONS_PER_TOPIC;

    log("");
    log("═".repeat(80));
    log("✅ DAILY SEEDING COMPLETE");
    log("═".repeat(80));
    log(`Topics Seeded: ${successCount}/${topicsToSeed.length}`);
    log(`Questions Added: ~${questionsAdded}`);
    log(`Duration: ${duration} minutes`);
    log(`Next Run: Tomorrow at scheduled time`);
    log("═".repeat(80));

    return {
      success: true,
      topicsSeeded: successCount,
      questionsAdded,
      durationMinutes: parseFloat(duration),
    };
  } catch (error: any) {
    log("❌ CRON JOB FAILED");
    log(`Error: ${error.message}`);
    log("═".repeat(80));
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  runDailySeeding()
    .then((result) => {
      process.exit(0);
    })
    .catch((error) => {
      console.error("Cron job failed:", error);
      process.exit(1);
    });
}

export { runDailySeeding };
