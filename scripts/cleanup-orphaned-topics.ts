#!/usr/bin/env tsx
/**
 * Cleanup Orphaned Topics
 *
 * Deletes topics that have NO bridge mappings to any exam.
 * These topics are useless - they can never be selected for quiz generation.
 *
 * Safety:
 * - Only deletes topics with bridge_count = 0
 * - Handles questions: reassigns to "General" topic or deletes if duplicates
 * - Preserves all curriculum-required topics
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

async function cleanupOrphanedTopics() {
  console.log("\n🧹 Cleaning Up Orphaned Topics (No Exam Associations)...\n");
  console.log("=".repeat(80));

  // Step 1: Find all orphaned topics
  console.log("\n📊 Step 1: Identifying orphaned topics...\n");

  const orphanedResult = await db.execute(`
    SELECT
      t.id,
      t.topic_name,
      t.category,
      (SELECT COUNT(*) FROM fact_exam_questions WHERE topic_id = t.id) as question_count
    FROM dim_topics t
    WHERE (SELECT COUNT(*) FROM bridge_exam_subject_topic WHERE topic_id = t.id) = 0
    ORDER BY question_count DESC
  `);

  console.log(`  ✅ Found ${orphanedResult.rows.length} orphaned topics`);

  const withQuestions = orphanedResult.rows.filter(r => Number(r.question_count) > 0);
  const withoutQuestions = orphanedResult.rows.filter(r => Number(r.question_count) === 0);

  console.log(`  - With questions: ${withQuestions.length}`);
  console.log(`  - Without questions: ${withoutQuestions.length}`);

  // Step 2: Delete topics without questions (immediate cleanup)
  console.log("\n🗑️  Step 2: Deleting orphaned topics without questions...\n");

  let deletedCount = 0;
  let errorCount = 0;

  for (const row of withoutQuestions) {
    try {
      await db.execute({
        sql: "DELETE FROM dim_topics WHERE id = ?",
        args: [row.id]
      });
      deletedCount++;

      if (deletedCount % 100 === 0) {
        console.log(`  ✅ Deleted ${deletedCount}/${withoutQuestions.length}...`);
      }
    } catch (error: any) {
      errorCount++;
      if (errorCount <= 5) {
        console.error(`  ❌ Error deleting "${row.topic_name}": ${error.message}`);
      }
    }
  }

  console.log(`\n  ✅ Deleted ${deletedCount} orphaned topics without questions`);
  if (errorCount > 0) {
    console.log(`  ⚠️  Errors: ${errorCount}`);
  }

  // Step 3: Handle topics with questions
  console.log("\n🔄 Step 3: Handling orphaned topics with questions...\n");

  // Find or create "General" topic for each category
  const generalTopics = new Map<string, number>();

  const categories = ['physics', 'chemistry', 'mathematics', 'biology',
                     'general-knowledge', 'reasoning', 'english', 'science'];

  for (const category of categories) {
    const topicName = `General ${category.charAt(0).toUpperCase() + category.slice(1)}`;

    // Check if exists
    const existing = await db.execute({
      sql: "SELECT id FROM dim_topics WHERE topic_name = ?",
      args: [topicName]
    });

    if (existing.rows.length > 0) {
      generalTopics.set(category, Number(existing.rows[0].id));
    } else {
      // Create it
      const result = await db.execute({
        sql: `INSERT INTO dim_topics (topic_name, category, scope, created_at)
              VALUES (?, ?, 'universal', datetime('now'))`,
        args: [topicName, category]
      });
      generalTopics.set(category, Number(result.lastInsertRowid));
      console.log(`  ✅ Created "${topicName}" topic`);
    }
  }

  console.log(`\n  Processing ${withQuestions.length} topics with questions...\n`);

  let reassignedQuestions = 0;
  let deletedQuestions = 0;
  let deletedTopics = 0;

  for (const row of withQuestions) {
    const topicId = Number(row.id);
    const category = String(row.category);
    const questionCount = Number(row.question_count);

    // Get target topic (general topic for this category)
    const targetTopicId = generalTopics.get(category) || generalTopics.get('general-knowledge');

    if (!targetTopicId) {
      console.log(`  ⚠️  No target for "${row.topic_name}", skipping`);
      continue;
    }

    try {
      // Try to reassign questions
      await db.execute({
        sql: "UPDATE fact_exam_questions SET topic_id = ? WHERE topic_id = ?",
        args: [targetTopicId, topicId]
      });

      reassignedQuestions += questionCount;

      // Delete the orphaned topic
      await db.execute({
        sql: "DELETE FROM dim_topics WHERE id = ?",
        args: [topicId]
      });

      deletedTopics++;

      if (deletedTopics % 50 === 0) {
        console.log(`  ✅ Processed ${deletedTopics}/${withQuestions.length}...`);
      }
    } catch (error: any) {
      // If UNIQUE constraint, delete duplicate questions
      if (error.message && error.message.includes('UNIQUE constraint')) {
        try {
          await db.execute({
            sql: "DELETE FROM fact_exam_questions WHERE topic_id = ?",
            args: [topicId]
          });

          deletedQuestions += questionCount;

          await db.execute({
            sql: "DELETE FROM dim_topics WHERE id = ?",
            args: [topicId]
          });

          deletedTopics++;
        } catch (e: any) {
          console.error(`  ❌ Error handling "${row.topic_name}": ${e.message}`);
        }
      } else {
        console.error(`  ❌ Error processing "${row.topic_name}": ${error.message}`);
      }
    }
  }

  console.log(`\n  ✅ Reassigned ${reassignedQuestions} questions`);
  console.log(`  ✅ Deleted ${deletedQuestions} duplicate questions`);
  console.log(`  ✅ Deleted ${deletedTopics} orphaned topics with questions`);

  // Step 4: Final verification
  console.log("\n📊 Step 4: Final verification...\n");

  const finalTopics = await db.execute("SELECT COUNT(*) as cnt FROM dim_topics");
  const finalQuestions = await db.execute("SELECT COUNT(*) as cnt FROM fact_exam_questions");
  const finalBridge = await db.execute("SELECT COUNT(*) as cnt FROM bridge_exam_subject_topic");

  const remainingOrphans = await db.execute(`
    SELECT COUNT(*) as cnt FROM dim_topics t
    WHERE (SELECT COUNT(*) FROM bridge_exam_subject_topic WHERE topic_id = t.id) = 0
  `);

  console.log(`  Topics: ${finalTopics.rows[0].cnt}`);
  console.log(`  Questions: ${finalQuestions.rows[0].cnt}`);
  console.log(`  Bridge mappings: ${finalBridge.rows[0].cnt}`);
  console.log(`  Remaining orphaned topics: ${remainingOrphans.rows[0].cnt}`);

  console.log("\n" + "=".repeat(80));
  console.log("\n✅ Cleanup Complete!");
  console.log(`\n📊 Summary:`);
  console.log(`  - Deleted ${deletedCount + deletedTopics} orphaned topics`);
  console.log(`  - Reassigned ${reassignedQuestions} questions`);
  console.log(`  - Deleted ${deletedQuestions} duplicate questions`);
  console.log(`  - Remaining topics: ${finalTopics.rows[0].cnt}`);
  console.log(`  - Remaining orphans: ${remainingOrphans.rows[0].cnt}`);
  console.log();
}

cleanupOrphanedTopics().catch((error) => {
  console.error("\n❌ Cleanup failed:", error);
  process.exit(1);
});
