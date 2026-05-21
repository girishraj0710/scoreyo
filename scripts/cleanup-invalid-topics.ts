#!/usr/bin/env tsx
/**
 * Cleanup Invalid Topics from Database
 *
 * Removes topics that are:
 * - Empty strings
 * - Single letters (A, E, Z, etc.)
 * - Just numbers (1, 2, 3, 250)
 * - Letter + number (E1, E2)
 * - Very short and not in exams.ts (2D, 3D, AP, GP, etc.)
 *
 * Safety:
 * - Only deletes topics with NO questions
 * - Only deletes topics with NO bridge mappings
 * - Preserves all data
 */

import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join } from "path";
import { examCategories } from "../src/lib/exams";

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

async function cleanupInvalidTopics() {
  console.log("\n🧹 Cleaning Up Invalid Topics...\n");
  console.log("=" .repeat(80));

  // Get all valid topics from exams.ts
  const validTopicsSet = new Set<string>();
  for (const category of examCategories) {
    for (const exam of category.exams) {
      for (const subject of exam.subjects) {
        for (const topic of subject.topics) {
          validTopicsSet.add(topic);
        }
      }
    }
  }

  console.log(`\n✅ Valid topics in exams.ts: ${validTopicsSet.size}\n`);

  // Find invalid topics
  const allTopicsResult = await db.execute(`
    SELECT id, topic_name,
           (SELECT COUNT(*) FROM fact_exam_questions WHERE topic_id = dim_topics.id) as question_count,
           (SELECT COUNT(*) FROM bridge_exam_subject_topic WHERE topic_id = dim_topics.id) as bridge_count
    FROM dim_topics
  `);

  const toDelete: Array<{id: number, name: string, reason: string}> = [];
  const cannotDelete: Array<{id: number, name: string, reason: string, questions: number, bridges: number}> = [];

  for (const row of allTopicsResult.rows) {
    const id = Number(row.id);
    const name = String(row.topic_name);
    const questionCount = Number(row.question_count);
    const bridgeCount = Number(row.bridge_count);

    let isInvalid = false;
    let reason = "";

    // Check if invalid
    if (name.trim() === "") {
      isInvalid = true;
      reason = "Empty string";
    } else if (/^[A-Za-z]$/.test(name)) {
      isInvalid = true;
      reason = "Single letter";
    } else if (/^[0-9]+$/.test(name)) {
      isInvalid = true;
      reason = "Just numbers";
    } else if (/^[A-Z][0-9]$/.test(name)) {
      isInvalid = true;
      reason = "Letter + number";
    } else if (!validTopicsSet.has(name) && name.length <= 3) {
      isInvalid = true;
      reason = "Not in exams.ts and very short";
    }

    if (isInvalid) {
      // Can only delete if no questions and no bridges
      if (questionCount === 0 && bridgeCount === 0) {
        toDelete.push({ id, name, reason });
      } else {
        cannotDelete.push({ id, name, reason, questions: questionCount, bridges: bridgeCount });
      }
    }
  }

  console.log(`\n📊 Analysis:`);
  console.log(`  Invalid topics found: ${toDelete.length + cannotDelete.length}`);
  console.log(`  Safe to delete: ${toDelete.length}`);
  console.log(`  Cannot delete (has data): ${cannotDelete.length}\n`);

  if (cannotDelete.length > 0) {
    console.log(`\n⚠️  Cannot Delete (has questions or bridges):\n`);
    cannotDelete.forEach(t => {
      console.log(`  ID ${t.id}: "${t.name}" (${t.reason})`);
      console.log(`     Questions: ${t.questions}, Bridges: ${t.bridges}`);
    });
    console.log(`\n  Note: These topics have data and cannot be auto-deleted.`);
    console.log(`        Manual review required to reassign questions/bridges.\n`);
  }

  if (toDelete.length === 0) {
    console.log("\n✅ No invalid topics to delete.\n");
    console.log("=" .repeat(80));
    return;
  }

  // Delete invalid topics
  console.log(`\n🗑️  Deleting ${toDelete.length} invalid topics...\n`);

  let deletedCount = 0;
  let errorCount = 0;

  for (const topic of toDelete) {
    try {
      await db.execute({
        sql: "DELETE FROM dim_topics WHERE id = ?",
        args: [topic.id]
      });
      deletedCount++;

      if (deletedCount % 10 === 0) {
        console.log(`  ✅ Deleted ${deletedCount}/${toDelete.length}...`);
      }
    } catch (error: any) {
      console.error(`  ❌ Error deleting ID ${topic.id} ("${topic.name}"): ${error.message}`);
      errorCount++;
    }
  }

  console.log(`\n✅ Deletion complete!`);
  console.log(`  Deleted: ${deletedCount}`);
  console.log(`  Errors: ${errorCount}\n`);

  // Verify results
  const finalCount = await db.execute("SELECT COUNT(*) as cnt FROM dim_topics");
  console.log(`📊 Final topic count: ${finalCount.rows[0].cnt}\n`);

  console.log("=" .repeat(80));
  console.log("\n✅ Cleanup Complete!\n");
}

cleanupInvalidTopics().catch((error) => {
  console.error("\n❌ Cleanup failed:", error);
  process.exit(1);
});
