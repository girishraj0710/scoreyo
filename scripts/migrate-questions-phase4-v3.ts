#!/usr/bin/env tsx
/**
 * Phase 4 v3: Question Migration with Better Error Handling
 *
 * Improvements over v2:
 * - Smaller batch sizes (reduce timeout risk)
 * - Retry logic for failed inserts
 * - Better progress tracking
 * - Automatic resume from last successful topic
 */

import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join } from "path";
import { normalizeTopics, parseTopic, getAtomicTopics } from "./normalize-topics";
import { examCategories } from "../src/lib/exams";

// Load environment variables from .env.local
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

interface TopicLevel {
  topicId: number;
  topicName: string;
  examCount: number;
  threshold: number;
}

async function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function insertWithRetry(sql: string, args: any[], maxRetries = 3): Promise<{ success: boolean; isDuplicate: boolean }> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await db.execute({ sql, args });
      return { success: true, isDuplicate: false };
    } catch (error: any) {
      // Check if it's a duplicate constraint error (expected, not an error)
      if (error.message && error.message.includes('UNIQUE constraint failed')) {
        return { success: false, isDuplicate: true };
      }

      // For other errors, retry
      if (i === maxRetries - 1) {
        console.error(`   ❌ Failed after ${maxRetries} retries:`, error.message);
        return { success: false, isDuplicate: false };
      }
      // Wait before retry (exponential backoff)
      await wait(1000 * Math.pow(2, i));
    }
  }
  return { success: false, isDuplicate: false };
}

async function main() {
  console.log("=" .repeat(80));
  console.log("🚀 PHASE 4 v3: QUESTION MIGRATION (IMPROVED ERROR HANDLING)");
  console.log("=" .repeat(80));
  console.log("");

  // Step 1: Load normalized topics
  console.log("1️⃣  Loading normalized topic mappings...");
  const normalizedMap = normalizeTopics(examCategories);
  console.log(`   ✅ Loaded ${normalizedMap.size} normalized topics`);
  console.log("");

  // Step 2: Analyze topic sharing levels
  console.log("2️⃣  Analyzing topic sharing levels...");

  const topicExamCounts = new Map<number, number>();
  const bridgeResult = await db.execute(`
    SELECT topic_id, COUNT(DISTINCT exam_id) as exam_count
    FROM bridge_exam_subject_topic
    GROUP BY topic_id
  `);

  for (const row of bridgeResult.rows) {
    topicExamCounts.set(Number(row.topic_id), Number(row.exam_count));
  }

  const topicLevels: TopicLevel[] = [];
  const topicsResult = await db.execute(`SELECT id, topic_name FROM dim_topics`);

  for (const row of topicsResult.rows) {
    const topicId = Number(row.id);
    const examCount = topicExamCounts.get(topicId) || 1;

    let threshold: number;
    if (examCount >= 10) {
      threshold = 0.85; // 85% similarity for universal topics
    } else if (examCount >= 5) {
      threshold = 0.92; // 92% similarity for medium topics
    } else {
      threshold = 0.97; // 97% similarity for specific topics
    }

    topicLevels.push({
      topicId,
      topicName: String(row.topic_name),
      examCount,
      threshold,
    });
  }

  const universal = topicLevels.filter(t => t.examCount >= 10).length;
  const medium = topicLevels.filter(t => t.examCount >= 5 && t.examCount < 10).length;
  const specific = topicLevels.filter(t => t.examCount < 5).length;

  console.log(`   Universal topics (10+ exams): ${universal} - will deduplicate aggressively`);
  console.log(`   Medium topics (5-9 exams): ${medium} - will deduplicate moderately`);
  console.log(`   Specific topics (1-4 exams): ${specific} - minimal deduplication`);
  console.log("");

  // Step 3: Check current progress
  console.log("3️⃣  Checking current progress...");
  const currentCount = await db.execute(`SELECT COUNT(*) as cnt FROM fact_exam_questions`);
  const currentQuestions = Number(currentCount.rows[0]?.cnt || 0);
  console.log(`   Current questions in fact table: ${currentQuestions}`);
  console.log("");

  // Step 4: Migrate questions topic by topic
  console.log("4️⃣  Migrating questions...");
  console.log("   Processing one topic at a time with retry logic.");
  console.log("");

  let totalInserted = 0;
  let totalDuplicates = 0;
  let totalErrors = 0;
  const batchSize = 50; // Smaller batches

  for (let i = 0; i < topicLevels.length; i++) {
    const topicLevel = topicLevels[i];

    // Progress update every 10 topics
    if (i % 10 === 0) {
      console.log(`   Progress: ${i}/${topicLevels.length} topics | Inserted: ${totalInserted} | Duplicates: ${totalDuplicates} | Errors: ${totalErrors}`);
    }

    // Check if this topic already has questions
    const existingCheck = await db.execute({
      sql: `SELECT COUNT(*) as cnt FROM fact_exam_questions WHERE topic_id = ?`,
      args: [topicLevel.topicId],
    });

    const existingCount = Number(existingCheck.rows[0]?.cnt || 0);
    if (existingCount > 0) {
      // Skip this topic (already migrated)
      continue;
    }

    // Get all questions for this topic from old table
    const oldQuestions = await db.execute({
      sql: `
        SELECT DISTINCT eq.*
        FROM exam_questions eq
        JOIN bridge_exam_subject_topic b ON (
          b.topic_id = ? AND
          EXISTS (
            SELECT 1 FROM dim_exams e WHERE e.id = b.exam_id AND e.exam_code = eq.exam_id
          ) AND
          EXISTS (
            SELECT 1 FROM dim_subjects s WHERE s.id = b.subject_id AND s.subject_code = eq.subject_id
          )
        )
      `,
      args: [topicLevel.topicId],
    });

    if (oldQuestions.rows.length === 0) {
      continue;
    }

    // Deduplicate based on threshold
    const seen = new Set<string>();
    const questionsToInsert: any[] = [];

    for (const row of oldQuestions.rows) {
      const questionText = String(row.question);
      const normalized = questionText.toLowerCase().replace(/\s+/g, " ").trim();
      const key = normalized.substring(0, Math.floor(normalized.length * topicLevel.threshold));

      if (!seen.has(key)) {
        seen.add(key);
        questionsToInsert.push(row);
      } else {
        totalDuplicates++;
      }
    }

    // Insert in small batches with retry
    for (let j = 0; j < questionsToInsert.length; j += batchSize) {
      const batch = questionsToInsert.slice(j, j + batchSize);

      for (const row of batch) {
        const result = await insertWithRetry(
          `INSERT INTO fact_exam_questions
           (topic_id, question, options, correct_answer, explanation, difficulty, source, valid_from, valid_until)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            topicLevel.topicId,
            row.question,
            row.options,
            row.correct_answer,
            row.explanation,
            row.difficulty,
            row.source || 'verified',
            row.valid_from || 2024,
            row.valid_until,
          ]
        );

        if (result.success) {
          totalInserted++;
        } else if (result.isDuplicate) {
          totalDuplicates++;
        } else {
          totalErrors++;
        }
      }

      // Small delay between batches to avoid rate limiting
      await wait(100);
    }
  }

  console.log("");
  console.log("=" .repeat(80));
  console.log("✅ MIGRATION COMPLETE");
  console.log("=" .repeat(80));
  console.log(`   Total questions inserted: ${totalInserted}`);
  console.log(`   Duplicates skipped: ${totalDuplicates}`);
  console.log(`   Errors encountered: ${totalErrors}`);
  console.log("");
}

main().catch((error) => {
  console.error("❌ Migration failed:", error.message);
  process.exit(1);
});
