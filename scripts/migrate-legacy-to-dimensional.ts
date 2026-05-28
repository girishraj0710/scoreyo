#!/usr/bin/env tsx
/**
 * MIGRATION: Move questions from exam_questions → fact_exam_questions
 *
 * This script migrates all ai-cached questions that were wrongly inserted
 * into the legacy exam_questions table into the dimensional model.
 *
 * Prerequisites:
 * - Run setup-dimensional-model.ts first to ensure all mappings exist
 */

import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join } from "path";

// Load environment variables
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

async function migrateQuestions() {
  console.log("\n🔄 MIGRATION: exam_questions → fact_exam_questions\n");
  console.log("=".repeat(80));

  // Get all questions from legacy table
  const legacyQuestions = await db.execute({
    sql: `SELECT * FROM exam_questions WHERE source = 'ai-cached'`,
    args: []
  });

  console.log(`\n📊 Found ${legacyQuestions.rows.length} questions to migrate`);

  let migrated = 0;
  let skipped = 0;
  let errors = 0;

  for (const q of legacyQuestions.rows) {
    try {
      // Lookup topic_id from bridge table
      const topicLookup = await db.execute({
        sql: `
          SELECT b.topic_id
          FROM bridge_exam_subject_topic b
          JOIN dim_exams e ON b.exam_id = e.id
          JOIN dim_subjects s ON b.subject_id = s.id
          JOIN dim_topics t ON b.topic_id = t.id
          WHERE e.exam_code = ?
            AND s.subject_code = ?
            AND t.topic_name = ?
          LIMIT 1
        `,
        args: [q.exam_id, q.subject_id, q.topic]
      });

      if (topicLookup.rows.length === 0) {
        console.log(`⚠️  Topic not found in bridge: ${q.exam_id} > ${q.subject_id} > ${q.topic}`);
        skipped++;
        continue;
      }

      const topicId = topicLookup.rows[0].topic_id as number;

      // Check if question already exists in fact table (avoid duplicates)
      const dupCheck = await db.execute({
        sql: `SELECT id FROM fact_exam_questions
              WHERE topic_id = ? AND question = ?
              LIMIT 1`,
        args: [topicId, q.question]
      });

      if (dupCheck.rows.length > 0) {
        skipped++;
        continue;
      }

      // Insert into fact_exam_questions
      await db.execute({
        sql: `INSERT INTO fact_exam_questions
              (topic_id, question, options, correct_answer, explanation,
               difficulty, source, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          topicId,
          q.question,
          q.options,
          q.correct_answer,
          q.explanation,
          q.difficulty,
          q.source,
          q.created_at || new Date().toISOString()
        ]
      });

      migrated++;

      if (migrated % 100 === 0) {
        console.log(`✅ Migrated ${migrated} questions...`);
      }

    } catch (error: any) {
      console.error(`❌ Error migrating question ID ${q.id}:`, error.message);
      errors++;
    }
  }

  console.log("\n" + "=".repeat(80));
  console.log("📊 MIGRATION SUMMARY\n");
  console.log(`  ✅ Migrated:  ${migrated}`);
  console.log(`  ⏭️  Skipped:   ${skipped} (duplicate or missing topic mapping)`);
  console.log(`  ❌ Errors:    ${errors}`);

  if (migrated > 0) {
    console.log("\n💡 Next step: Delete migrated questions from exam_questions:");
    console.log("   DELETE FROM exam_questions WHERE source = 'ai-cached';");
  }

  console.log("=".repeat(80) + "\n");
}

migrateQuestions().catch(console.error);
