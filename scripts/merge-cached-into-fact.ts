#!/usr/bin/env tsx
/**
 * Merge cached_questions into fact_exam_questions
 *
 * Strategy:
 * 1. Add quality tracking columns to fact_exam_questions
 * 2. Migrate cached_questions → fact_exam_questions with source='ai-cached'
 * 3. Update queries to prioritize by source
 * 4. After validation, drop cached_questions table
 */

import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join } from "path";

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

async function mergeCachedIntoFact() {
  console.log("🚀 Starting migration: cached_questions → fact_exam_questions\n");

  // Step 1: Add quality tracking columns
  console.log("Step 1: Adding quality tracking columns...");

  try {
    await db.execute("ALTER TABLE fact_exam_questions ADD COLUMN quality_score INTEGER DEFAULT 100");
    console.log("  ✅ Added quality_score column");
  } catch (e: any) {
    if (e.message?.includes("duplicate column")) {
      console.log("  ⚠️  quality_score already exists");
    } else {
      throw e;
    }
  }

  try {
    await db.execute("ALTER TABLE fact_exam_questions ADD COLUMN used_count INTEGER DEFAULT 0");
    console.log("  ✅ Added used_count column");
  } catch (e: any) {
    if (e.message?.includes("duplicate column")) {
      console.log("  ⚠️  used_count already exists");
    } else {
      throw e;
    }
  }

  // Step 2: Get count of cached questions
  const cachedCount = await db.execute("SELECT COUNT(*) as count FROM cached_questions");
  const totalCached = Number(cachedCount.rows[0].count);
  console.log(`\nStep 2: Found ${totalCached.toLocaleString()} cached questions to migrate`);

  // Step 3: Load dim_topics mapping (topic_name → id)
  console.log("\nStep 3: Loading topic mappings...");
  const topicsResult = await db.execute("SELECT id, topic_name FROM dim_topics");
  const topicMap = new Map<string, number>();
  for (const row of topicsResult.rows) {
    topicMap.set(String(row.topic_name).toLowerCase().trim(), Number(row.id));
  }
  console.log(`  ✅ Loaded ${topicMap.size} topic mappings`);

  // Step 4: Migrate in batches
  console.log("\nStep 4: Migrating cached questions...");
  const BATCH_SIZE = 500;
  let offset = 0;
  let migrated = 0;
  let skipped = 0;
  let errors = 0;

  while (offset < totalCached) {
    const batch = await db.execute({
      sql: `SELECT id, exam_id, subject_id, topic, difficulty, question_json, used_count
            FROM cached_questions
            ORDER BY id
            LIMIT ? OFFSET ?`,
      args: [BATCH_SIZE, offset]
    });

    if (batch.rows.length === 0) break;

    const insertBatch = [];

    for (const row of batch.rows) {
      try {
        const questionData = JSON.parse(String(row.question_json));
        const topicName = String(row.topic).toLowerCase().trim();
        const topicId = topicMap.get(topicName);

        if (!topicId) {
          console.log(`  ⚠️  Skipping question - topic not found: "${row.topic}"`);
          skipped++;
          continue;
        }

        if (!questionData.question || !questionData.options || questionData.correctAnswer === undefined) {
          skipped++;
          continue;
        }

        insertBatch.push({
          sql: `INSERT OR IGNORE INTO fact_exam_questions
                (topic_id, question, options, correct_answer, explanation, difficulty, source, quality_score, used_count, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
          args: [
            topicId,
            questionData.question,
            JSON.stringify(questionData.options),
            questionData.correctAnswer,
            questionData.explanation || '',
            row.difficulty || 'medium',
            'ai-cached',  // Source identifier for cached questions
            50,  // Lower quality score than verified (100)
            row.used_count || 0
          ]
        });
      } catch (e) {
        errors++;
      }
    }

    if (insertBatch.length > 0) {
      await db.batch(insertBatch, "write");
      migrated += insertBatch.length;
      process.stdout.write(`\r  Migrated: ${migrated.toLocaleString()} / ${totalCached.toLocaleString()} (${((migrated/totalCached)*100).toFixed(1)}%)`);
    }

    offset += BATCH_SIZE;
  }

  console.log(`\n  ✅ Migration complete!`);
  console.log(`     Migrated: ${migrated.toLocaleString()}`);
  console.log(`     Skipped: ${skipped.toLocaleString()}`);
  console.log(`     Errors: ${errors.toLocaleString()}`);

  // Step 5: Create index for efficient queries
  console.log("\nStep 5: Creating performance indexes...");
  try {
    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_fact_questions_priority
      ON fact_exam_questions(topic_id, source, quality_score DESC, used_count ASC)
    `);
    console.log("  ✅ Created priority index");
  } catch (e) {
    console.log("  ⚠️  Index may already exist");
  }

  // Step 6: Show final counts
  console.log("\nStep 6: Final verification...");
  const finalCount = await db.execute("SELECT COUNT(*) as count FROM fact_exam_questions");
  const bySource = await db.execute(`
    SELECT source, COUNT(*) as count
    FROM fact_exam_questions
    GROUP BY source
    ORDER BY count DESC
  `);

  console.log(`\n📊 fact_exam_questions now has ${Number(finalCount.rows[0].count).toLocaleString()} questions:`);
  for (const row of bySource.rows) {
    const source = row.source || 'NULL';
    const count = Number(row.count).toLocaleString();
    const isNew = source === 'ai-cached' ? ' 🆕' : '';
    console.log(`   ${source.padEnd(45)} ${count}${isNew}`);
  }

  console.log("\n✅ Migration complete!");
  console.log("\n📝 Next steps:");
  console.log("   1. Update quiz queries to use single table with ORDER BY source");
  console.log("   2. Test thoroughly in staging");
  console.log("   3. Deploy to production");
  console.log("   4. After 1 week of stable operation: DROP TABLE cached_questions");
}

mergeCachedIntoFact().catch(console.error);
