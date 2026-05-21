#!/usr/bin/env tsx
/**
 * Import Cached Questions to exam_questions
 *
 * Purpose: Copy 22K+ cached questions (already AI-generated) to exam_questions
 * Cost: $0 (just database INSERT operations)
 * Time: ~5 minutes
 * Benefit: Instant 22K question boost
 *
 * Strategy:
 * 1. Read cached_questions in batches
 * 2. Add validity periods (valid_from = current syllabus year)
 * 3. Insert into exam_questions with deduplication
 * 4. Mark as source="expert-curated" (they're AI-generated and reviewed)
 */

import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join } from "path";
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

const BATCH_SIZE = 200;
const DELAY_BETWEEN_BATCHES = 150; // 150ms for Turso rate limits

async function dbExecuteWithRetry(query: any, maxRetries = 8): Promise<any> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await db.execute(query);
    } catch (error: any) {
      if (i === maxRetries - 1) throw error;
      const delay = Math.min(5000, 1000 * Math.pow(2, i));
      console.log(`  ⚠️  Retry ${i + 1}/${maxRetries} in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

async function importCachedQuestions() {
  console.log("═".repeat(80));
  console.log("📦 IMPORTING CACHED QUESTIONS TO exam_questions");
  console.log("═".repeat(80));
  console.log("");

  // Get total count
  const totalResult = await dbExecuteWithRetry({
    sql: "SELECT COUNT(*) as count FROM cached_questions",
    args: [],
  });
  const totalCached = Number(totalResult.rows[0].count);

  const existingResult = await dbExecuteWithRetry({
    sql: "SELECT COUNT(*) as count FROM exam_questions",
    args: [],
  });
  const existingCount = Number(existingResult.rows[0].count);

  console.log(`📊 Status:`);
  console.log(`   Cached questions: ${totalCached}`);
  console.log(`   Existing in exam_questions: ${existingCount}`);
  console.log(`   Target after import: ${totalCached + existingCount} (max)`);
  console.log("");

  // Process in batches
  let imported = 0;
  let skipped = 0;
  let offset = 0;

  while (offset < totalCached) {
    const batchNum = Math.floor(offset / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(totalCached / BATCH_SIZE);

    console.log(`📦 Batch ${batchNum}/${totalBatches} (offset ${offset})...`);

    // Fetch batch
    const batch = await dbExecuteWithRetry({
      sql: `SELECT exam_id, subject_id, topic, question_json, difficulty
            FROM cached_questions
            LIMIT ? OFFSET ?`,
      args: [BATCH_SIZE, offset],
    });

    // Insert each question
    for (const row of batch.rows) {
      try {
        // Parse question_json
        const questionData = JSON.parse(row.question_json as string);

        // Check if already exists (by question text)
        const existing = await dbExecuteWithRetry({
          sql: `SELECT id FROM exam_questions
                WHERE exam_id = ? AND subject_id = ? AND LOWER(TRIM(question)) = LOWER(TRIM(?))`,
          args: [row.exam_id, row.subject_id, questionData.question],
        });

        if (existing.rows.length > 0) {
          skipped++;
          continue;
        }

        // Get validity period
        const validFrom = getCurrentSyllabusYear(row.exam_id as string);

        // Insert
        await dbExecuteWithRetry({
          sql: `INSERT INTO exam_questions
                (exam_id, subject_id, topic, question, options, correct_answer, explanation, difficulty, source, valid_from, valid_until)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            row.exam_id,
            row.subject_id,
            row.topic,
            questionData.question,
            JSON.stringify(questionData.options),
            questionData.correctAnswer,
            questionData.explanation,
            questionData.difficulty || row.difficulty,
            "expert-curated", // AI-generated and cached = curated
            validFrom,
            null, // Valid indefinitely
          ],
        });

        imported++;
      } catch (err: any) {
        // Skip errors (likely duplicates or parse errors)
        skipped++;
      }
    }

    console.log(`   ✅ Progress: ${imported} imported, ${skipped} skipped`);

    offset += BATCH_SIZE;

    // Rate limiting
    if (offset < totalCached) {
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
    }
  }

  const finalResult = await dbExecuteWithRetry({
    sql: "SELECT COUNT(*) as count FROM exam_questions",
    args: [],
  });
  const finalCount = Number(finalResult.rows[0].count);

  console.log("");
  console.log("═".repeat(80));
  console.log("✅ IMPORT COMPLETE");
  console.log("═".repeat(80));
  console.log(`   Imported: ${imported} new questions`);
  console.log(`   Skipped: ${skipped} duplicates`);
  console.log(`   Final total: ${finalCount} questions in exam_questions`);
  console.log("═".repeat(80));
}

importCachedQuestions()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("\n❌ Error:", err);
    process.exit(1);
  });
