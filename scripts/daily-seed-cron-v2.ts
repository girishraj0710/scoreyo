#!/usr/bin/env tsx
/**
 * Daily Auto-Seeding Cron Job V2 - Launch Prep Mode
 *
 * Two modes:
 * 1. LAUNCH_PREP: Max quota usage for pre-launch (~800 API calls/day)
 * 2. MAINTENANCE: Conservative post-launch (~120 API calls/day)
 *
 * Features:
 * - Topic rotation: Never seed same topic consecutively
 * - Smart tracking: Remembers last seeded date per topic
 * - Diverse coverage: Cycles through all topics
 * - Easy toggle: Switch modes via environment variable
 */

import { createClient } from "@libsql/client";
import { readFileSync, appendFileSync, writeFileSync, existsSync } from "fs";
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

// ============================================================================
// CONFIGURATION MODES
// ============================================================================

type CronMode = "LAUNCH_PREP" | "MAINTENANCE";

// Set via environment variable or default to LAUNCH_PREP
const CRON_MODE: CronMode = (process.env.CRON_MODE as CronMode) || "LAUNCH_PREP";

// Mode-specific configurations
const CONFIG = {
  LAUNCH_PREP: {
    QUESTIONS_PER_TOPIC: 50,      // Max questions per topic
    LOW_STOCK_THRESHOLD: 200,     // Keep topics above 200
    MAX_TOPICS_PER_DAY: 80,       // Max topics per day (USE FULL QUOTA - no users yet!)
    BATCH_SIZE: 10,               // Larger batches
    DELAY_BETWEEN_BATCHES: 8000,  // 8 seconds (faster)
    ROTATION_COOLDOWN_DAYS: 5,    // Don't re-seed same topic for 5 days (faster rotation)
  },
  MAINTENANCE: {
    QUESTIONS_PER_TOPIC: 30,
    LOW_STOCK_THRESHOLD: 100,
    MAX_TOPICS_PER_DAY: 20,
    BATCH_SIZE: 5,
    DELAY_BETWEEN_BATCHES: 15000,
    ROTATION_COOLDOWN_DAYS: 14,   // Longer cooldown in maintenance
  },
};

// Active configuration based on mode
const {
  QUESTIONS_PER_TOPIC,
  LOW_STOCK_THRESHOLD,
  MAX_TOPICS_PER_DAY,
  BATCH_SIZE,
  DELAY_BETWEEN_BATCHES,
  ROTATION_COOLDOWN_DAYS,
} = CONFIG[CRON_MODE];

const LOG_FILE = join(process.cwd(), "daily-seed-cron.log");
const ROTATION_TRACKER_FILE = join(process.cwd(), ".cron-rotation-tracker.json");

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

// ============================================================================
// TOPIC ROTATION TRACKER
// ============================================================================

interface TopicTracker {
  [topicKey: string]: {
    lastSeeded: string;        // ISO date
    totalTimesSeeded: number;
    lastQuestionCount: number;
  };
}

function loadRotationTracker(): TopicTracker {
  try {
    if (existsSync(ROTATION_TRACKER_FILE)) {
      const content = readFileSync(ROTATION_TRACKER_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    log(`⚠️  Could not load rotation tracker: ${err}`);
  }
  return {};
}

function saveRotationTracker(tracker: TopicTracker): void {
  try {
    writeFileSync(ROTATION_TRACKER_FILE, JSON.stringify(tracker, null, 2));
  } catch (err) {
    log(`⚠️  Could not save rotation tracker: ${err}`);
  }
}

function getTopicKey(examId: string, subjectId: string, topic: string): string {
  return `${examId}::${subjectId}::${topic}`;
}

function shouldSeedTopic(
  tracker: TopicTracker,
  examId: string,
  subjectId: string,
  topic: string
): boolean {
  const key = getTopicKey(examId, subjectId, topic);
  const entry = tracker[key];

  if (!entry) return true; // Never seeded before

  const lastSeededDate = new Date(entry.lastSeeded);
  const daysSinceSeeded = Math.floor(
    (Date.now() - lastSeededDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return daysSinceSeeded >= ROTATION_COOLDOWN_DAYS;
}

function markTopicSeeded(
  tracker: TopicTracker,
  examId: string,
  subjectId: string,
  topic: string,
  questionCount: number
): void {
  const key = getTopicKey(examId, subjectId, topic);
  tracker[key] = {
    lastSeeded: new Date().toISOString(),
    totalTimesSeeded: (tracker[key]?.totalTimesSeeded || 0) + 1,
    lastQuestionCount: questionCount,
  };
}

// ============================================================================
// DATABASE OPERATIONS
// ============================================================================

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

// ============================================================================
// AI QUESTION GENERATION
// ============================================================================

async function generateQuestions(
  examId: string,
  examName: string,
  subjectId: string,
  subjectName: string,
  topic: string,
  count: number
): Promise<any[]> {
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
5. Unique questions: Generate FRESH, DIVERSE questions (avoid repetition)
6. Rich explanations: 50+ words with step-by-step logic

QUESTION TYPES (distribute evenly):
- Conceptual (40%): Test core principles and theory
- Numerical (35%): Calculations and problem-solving
- Application (25%): Real-world scenarios

CRITICAL: Generate NEW, DIFFERENT questions each time. Vary:
- Numerical values
- Scenario contexts
- Question phrasing
- Distractor options

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
      "X-Title": "PrepGenie Daily Seeder V2",
    },
    body: JSON.stringify({
      model: "google/gemini-flash-1.5",
      messages: [
        {
          role: "system",
          content: "You are an expert exam question generator. Return only valid JSON arrays with diverse, unique questions.",
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

  let jsonContent = content.trim();
  if (jsonContent.startsWith("```json")) {
    jsonContent = jsonContent.replace(/```json\n?/g, "").replace(/```\n?/g, "");
  } else if (jsonContent.startsWith("```")) {
    jsonContent = jsonContent.replace(/```\n?/g, "");
  }

  const questions = JSON.parse(jsonContent);

  const validQuestions = questions.filter((q: any) => {
    if (!q.question || !Array.isArray(q.options) || q.options.length !== 4) return false;
    if (typeof q.correctAnswer !== "number" || q.correctAnswer < 0 || q.correctAnswer > 3) return false;
    if (!q.explanation || q.explanation.length < 50) return false;
    if (!["easy", "medium", "hard"].includes(q.difficulty)) return false;
    return true;
  });

  return validQuestions;
}

// ============================================================================
// SEEDING LOGIC
// ============================================================================

async function seedTopic(
  examId: string,
  examName: string,
  subjectId: string,
  subjectName: string,
  topic: string
): Promise<number> {
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
      return 0;
    }

    log(`   ✅ Generated ${questions.length} questions, inserting into database...`);

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
            "expert-curated",
          ],
        });
        inserted++;
      } catch (err: any) {
        // Skip duplicates
      }
    }

    log(`   ✅ Inserted ${inserted}/${questions.length} questions`);
    return inserted;
  } catch (error: any) {
    log(`   ❌ Error: ${error.message}`);
    return 0;
  }
}

// ============================================================================
// MAIN CRON LOGIC
// ============================================================================

async function findTopicsToSeed(tracker: TopicTracker): Promise<
  Array<{
    examId: string;
    examName: string;
    subjectId: string;
    subjectName: string;
    topic: string;
    currentStock: number;
    daysSinceSeeded: number | null;
  }>
> {
  log("🔍 Scanning for topics to seed...");

  const candidates: Array<{
    examId: string;
    examName: string;
    subjectId: string;
    subjectName: string;
    topic: string;
    currentStock: number;
    daysSinceSeeded: number | null;
  }> = [];

  for (const category of examCategories) {
    for (const exam of category.exams) {
      for (const subject of exam.subjects) {
        for (const topic of subject.topics) {
          const count = await countTopicQuestions(exam.id, subject.id, topic);

          // Check if topic needs seeding (below threshold)
          if (count < LOW_STOCK_THRESHOLD) {
            // Check rotation cooldown
            if (shouldSeedTopic(tracker, exam.id, subject.id, topic)) {
              const key = getTopicKey(exam.id, subject.id, topic);
              const entry = tracker[key];
              const daysSince = entry
                ? Math.floor((Date.now() - new Date(entry.lastSeeded).getTime()) / (1000 * 60 * 60 * 24))
                : null;

              candidates.push({
                examId: exam.id,
                examName: exam.name,
                subjectId: subject.id,
                subjectName: subject.name,
                topic,
                currentStock: count,
                daysSinceSeeded: daysSince,
              });
            }
          }
        }
      }
    }
  }

  // Sort by:
  // 1. Lowest stock first (urgent)
  // 2. Longest time since seeded (fair rotation)
  // 3. Never seeded topics first (null daysSinceSeeded)
  candidates.sort((a, b) => {
    if (a.currentStock !== b.currentStock) {
      return a.currentStock - b.currentStock; // Lower stock = higher priority
    }
    if (a.daysSinceSeeded === null && b.daysSinceSeeded !== null) return -1;
    if (a.daysSinceSeeded !== null && b.daysSinceSeeded === null) return 1;
    if (a.daysSinceSeeded !== null && b.daysSinceSeeded !== null) {
      return b.daysSinceSeeded - a.daysSinceSeeded; // Longer time = higher priority
    }
    return 0;
  });

  log(`   Found ${candidates.length} topics eligible for seeding`);
  log(`   Mode: ${CRON_MODE}`);
  log(`   Will seed: ${Math.min(candidates.length, MAX_TOPICS_PER_DAY)} topics`);

  return candidates;
}

async function runDailySeeding() {
  const startTime = Date.now();

  log("═".repeat(80));
  log(`🌱 DAILY AUTO-SEEDING CRON JOB V2 - ${CRON_MODE} MODE`);
  log("═".repeat(80));
  log(`Started: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`);
  log("");

  if (CRON_MODE === "LAUNCH_PREP") {
    log("🚀 LAUNCH PREP MODE: Maximum quota usage for pre-launch");
    log(`   - Target: ${MAX_TOPICS_PER_DAY} topics × ${QUESTIONS_PER_TOPIC}Q = ${MAX_TOPICS_PER_DAY * QUESTIONS_PER_TOPIC} questions/day`);
    log(`   - API calls: ~${(MAX_TOPICS_PER_DAY * QUESTIONS_PER_TOPIC) / 20 * 2} per day`);
    log(`   - Goal: Load maximum questions before launch`);
  } else {
    log("🔧 MAINTENANCE MODE: Conservative post-launch seeding");
    log(`   - Target: ${MAX_TOPICS_PER_DAY} topics × ${QUESTIONS_PER_TOPIC}Q = ${MAX_TOPICS_PER_DAY * QUESTIONS_PER_TOPIC} questions/day`);
    log(`   - Goal: Maintain topics above ${LOW_STOCK_THRESHOLD} questions`);
  }
  log("");

  try {
    // Load rotation tracker
    const tracker = loadRotationTracker();
    log(`📊 Rotation Tracker: ${Object.keys(tracker).length} topics tracked`);
    log("");

    // Find topics to seed
    const candidates = await findTopicsToSeed(tracker);

    if (candidates.length === 0) {
      log("✅ All topics are well-stocked! No seeding needed today.");
      log("═".repeat(80));
      return { success: true, topicsSeeded: 0, questionsAdded: 0 };
    }

    const topicsToSeed = candidates.slice(0, MAX_TOPICS_PER_DAY);

    log(`📋 Seeding ${topicsToSeed.length} topics today:`);
    topicsToSeed.forEach((t, i) => {
      const cooldown = t.daysSinceSeeded === null ? "Never seeded" : `${t.daysSinceSeeded} days ago`;
      log(`   ${i + 1}. ${t.examName} → ${t.topic} (${t.currentStock}Q, last: ${cooldown})`);
    });
    log("");

    // Process in batches
    let totalQuestionsAdded = 0;
    for (let i = 0; i < topicsToSeed.length; i += BATCH_SIZE) {
      const batch = topicsToSeed.slice(i, i + BATCH_SIZE);
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(topicsToSeed.length / BATCH_SIZE);

      log(`📦 Batch ${batchNum}/${totalBatches} (${batch.length} topics)`);

      for (const topic of batch) {
        const questionsAdded = await seedTopic(
          topic.examId,
          topic.examName,
          topic.subjectId,
          topic.subjectName,
          topic.topic
        );

        if (questionsAdded > 0) {
          totalQuestionsAdded += questionsAdded;
          markTopicSeeded(tracker, topic.examId, topic.subjectId, topic.topic, questionsAdded);
        }
      }

      // Save tracker after each batch
      saveRotationTracker(tracker);

      // Delay between batches
      if (i + BATCH_SIZE < topicsToSeed.length) {
        log(`   ⏸️  Pausing ${DELAY_BETWEEN_BATCHES / 1000}s before next batch...`);
        await new Promise((resolve) => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
        log("");
      }
    }

    const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1);

    log("");
    log("═".repeat(80));
    log("✅ DAILY SEEDING COMPLETE");
    log("═".repeat(80));
    log(`Mode: ${CRON_MODE}`);
    log(`Topics Seeded: ${topicsToSeed.length}`);
    log(`Questions Added: ${totalQuestionsAdded}`);
    log(`Duration: ${duration} minutes`);
    log(`Next Run: Tomorrow at scheduled time`);
    log("═".repeat(80));

    return {
      success: true,
      mode: CRON_MODE,
      topicsSeeded: topicsToSeed.length,
      questionsAdded: totalQuestionsAdded,
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
