#!/usr/bin/env tsx
/**
 * Phase A3: Re-populate Dimensional Tables with Corrected Atomic Topics
 *
 * This script:
 * 1. Clears dim_topics and bridge_exam_subject_topic tables
 * 2. Re-populates with corrected atomic topics from updated exams.ts
 * 3. Regenerates bridge mappings
 * 4. Keeps dim_exams and dim_subjects unchanged
 * 5. Keeps fact_exam_questions unchanged (will re-map in Phase A4)
 */

import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join } from "path";
import { examCategories } from "../src/lib/exams";

// Load environment variables
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

async function main() {
  console.log("\n🔄 Phase A3: Re-populating Dimensional Tables\n");
  console.log("=" .repeat(80));

  // Step 1: Clear existing topic and bridge data
  console.log("\n📦 Step 1: Clearing existing topics and bridge mappings...\n");

  try {
    await db.execute("DELETE FROM bridge_exam_subject_topic");
    console.log("  ✅ Cleared bridge_exam_subject_topic");

    await db.execute("DELETE FROM dim_topics");
    console.log("  ✅ Cleared dim_topics");

    console.log("\n✅ Step 1 Complete\n");
  } catch (error) {
    console.error("  ❌ Error clearing tables:", error);
    process.exit(1);
  }

  // Step 2: Re-populate dim_topics with atomic topics
  console.log("📦 Step 2: Re-populating dim_topics with corrected atomic topics...\n");

  const topicMap = new Map<string, number>(); // topic_name -> topic_id
  let topicCount = 0;
  let skippedTopics = 0;

  for (const category of examCategories) {
    for (const exam of category.exams) {
      for (const subject of exam.subjects) {
        for (const topicName of subject.topics) {
          if (topicMap.has(topicName)) {
            skippedTopics++;
            continue; // Topic already exists
          }

          try {
            // Determine scope based on topic name patterns
            let scope = "universal";
            if (topicName.toLowerCase().includes("indian") ||
                topicName.toLowerCase().includes("india")) {
              scope = "exam-specific";
            } else if (topicName.toLowerCase().includes("upsc") ||
                       topicName.toLowerCase().includes("ssc") ||
                       topicName.toLowerCase().includes("cat") ||
                       topicName.toLowerCase().includes("neet") ||
                       topicName.toLowerCase().includes("jee")) {
              scope = "exam-specific";
            }

            const result = await db.execute({
              sql: `INSERT INTO dim_topics (topic_name, scope, created_at)
                    VALUES (?, ?, datetime('now'))`,
              args: [topicName, scope]
            });

            topicCount++;
            topicMap.set(topicName, Number(result.lastInsertRowid));

            if (topicCount % 100 === 0) {
              console.log(`  ✅ Inserted ${topicCount} topics...`);
            }
          } catch (error: any) {
            if (error.message && error.message.includes('UNIQUE constraint')) {
              // Topic already exists (edge case)
              const existing = await db.execute({
                sql: "SELECT id FROM dim_topics WHERE topic_name = ?",
                args: [topicName]
              });
              if (existing.rows.length > 0) {
                topicMap.set(topicName, Number(existing.rows[0].id));
                skippedTopics++;
              }
            } else {
              console.error(`  ❌ Error inserting topic "${topicName}":`, error.message);
            }
          }
        }
      }
    }
  }

  console.log(`\n  ✅ Inserted ${topicCount} unique topics`);
  console.log(`  ℹ️  Skipped ${skippedTopics} duplicate topics`);
  console.log("\n✅ Step 2 Complete\n");

  // Step 3: Re-populate bridge table
  console.log("📦 Step 3: Re-populating bridge_exam_subject_topic...\n");

  let bridgeCount = 0;
  let bridgeErrors = 0;

  for (const category of examCategories) {
    for (const exam of category.exams) {
      // Get exam_id from dim_exams
      const examResult = await db.execute({
        sql: "SELECT id FROM dim_exams WHERE exam_code = ?",
        args: [exam.id]
      });

      if (examResult.rows.length === 0) {
        console.error(`  ⚠️  Exam not found in dim_exams: ${exam.id}`);
        continue;
      }

      const examId = Number(examResult.rows[0].id);

      for (const subject of exam.subjects) {
        // Get subject_id from dim_subjects
        const subjectResult = await db.execute({
          sql: "SELECT id FROM dim_subjects WHERE subject_code = ?",
          args: [subject.id]
        });

        if (subjectResult.rows.length === 0) {
          console.error(`  ⚠️  Subject not found in dim_subjects: ${subject.id}`);
          continue;
        }

        const subjectId = Number(subjectResult.rows[0].id);

        for (const topicName of subject.topics) {
          const topicId = topicMap.get(topicName);

          if (!topicId) {
            console.error(`  ⚠️  Topic not found in map: ${topicName}`);
            bridgeErrors++;
            continue;
          }

          try {
            await db.execute({
              sql: `INSERT INTO bridge_exam_subject_topic (exam_id, subject_id, topic_id, created_at)
                    VALUES (?, ?, ?, datetime('now'))`,
              args: [examId, subjectId, topicId]
            });

            bridgeCount++;

            if (bridgeCount % 500 === 0) {
              console.log(`  ✅ Inserted ${bridgeCount} bridge mappings...`);
            }
          } catch (error: any) {
            if (error.message && error.message.includes('UNIQUE constraint')) {
              // Duplicate mapping, skip
            } else {
              console.error(`  ❌ Error inserting bridge mapping:`, error.message);
              bridgeErrors++;
            }
          }
        }
      }
    }
  }

  console.log(`\n  ✅ Inserted ${bridgeCount} bridge mappings`);
  console.log(`  ⚠️  Errors: ${bridgeErrors}`);
  console.log("\n✅ Step 3 Complete\n");

  // Step 4: Verify results
  console.log("📦 Step 4: Verifying results...\n");

  const finalTopics = await db.execute("SELECT COUNT(*) as cnt FROM dim_topics");
  const finalBridge = await db.execute("SELECT COUNT(*) as cnt FROM bridge_exam_subject_topic");

  console.log(`  dim_topics: ${finalTopics.rows[0].cnt} rows`);
  console.log(`  bridge_exam_subject_topic: ${finalBridge.rows[0].cnt} mappings`);
  console.log("\n✅ Step 4 Complete\n");

  console.log("=" .repeat(80));
  console.log("\n✅ Phase A3 Complete!");
  console.log("\n📊 Summary:");
  console.log(`  - Total topics: ${finalTopics.rows[0].cnt}`);
  console.log(`  - Total bridge mappings: ${finalBridge.rows[0].cnt}`);
  console.log(`  - Next: Phase A4 - Re-map questions to corrected topics`);
  console.log();
}

main().catch((error) => {
  console.error("\n❌ Phase A3 failed:", error);
  process.exit(1);
});
