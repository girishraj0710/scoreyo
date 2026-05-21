#!/usr/bin/env tsx
/**
 * Phase A3 V2: Update Dimensional Tables (Non-Destructive)
 *
 * Strategy:
 * 1. Keep existing dim_topics (referenced by fact_exam_questions)
 * 2. Add NEW atomic topics from corrected exams.ts
 * 3. Update bridge_exam_subject_topic with new mappings
 * 4. Mark old grouped topics as deprecated
 *
 * This preserves existing questions while adding new atomic topics.
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
  console.log("\n🔄 Phase A3 V2: Updating Dimensional Tables (Non-Destructive)\n");
  console.log("=" .repeat(80));

  // Step 1: Get all existing topics
  console.log("\n📦 Step 1: Analyzing existing topics...\n");

  const existingTopicsResult = await db.execute("SELECT id, topic_name FROM dim_topics");
  const existingTopics = new Map<string, number>();
  for (const row of existingTopicsResult.rows) {
    existingTopics.set(String(row.topic_name), Number(row.id));
  }

  console.log(`  ✅ Found ${existingTopics.size} existing topics`);
  console.log("\n✅ Step 1 Complete\n");

  // Step 2: Add new atomic topics
  console.log("📦 Step 2: Adding new atomic topics...\n");

  const topicMap = new Map<string, number>(); // topic_name -> topic_id
  let newTopicsCount = 0;
  let reusedTopicsCount = 0;

  for (const category of examCategories) {
    for (const exam of category.exams) {
      for (const subject of exam.subjects) {
        for (const topicName of subject.topics) {
          if (topicMap.has(topicName)) {
            continue; // Already processed
          }

          // Check if topic already exists
          if (existingTopics.has(topicName)) {
            topicMap.set(topicName, existingTopics.get(topicName)!);
            reusedTopicsCount++;
            continue;
          }

          // Insert new topic
          try {
            // Determine category and scope
            let category = "general";
            let scope = "universal";

            // Infer category from topic name
            const lowerTopic = topicName.toLowerCase();
            if (lowerTopic.includes("physic")) category = "physics";
            else if (lowerTopic.includes("chem")) category = "chemistry";
            else if (lowerTopic.includes("math") || lowerTopic.includes("algebra") ||
                     lowerTopic.includes("geometry") || lowerTopic.includes("calculus") ||
                     lowerTopic.includes("trigonometry")) category = "mathematics";
            else if (lowerTopic.includes("biolog") || lowerTopic.includes("botany") ||
                     lowerTopic.includes("zoology")) category = "biology";
            else if (lowerTopic.includes("history")) category = "history";
            else if (lowerTopic.includes("geography")) category = "geography";
            else if (lowerTopic.includes("polity") || lowerTopic.includes("constitution")) category = "polity";
            else if (lowerTopic.includes("econom")) category = "economics";
            else if (lowerTopic.includes("english") || lowerTopic.includes("comprehension") ||
                     lowerTopic.includes("grammar") || lowerTopic.includes("vocabulary")) category = "english";
            else if (lowerTopic.includes("reasoning") || lowerTopic.includes("logic")) category = "reasoning";
            else if (lowerTopic.includes("data interpretation")) category = "data-interpretation";
            else if (lowerTopic.includes("current affairs")) category = "current-affairs";

            if (lowerTopic.includes("indian") || lowerTopic.includes("india")) {
              scope = "exam-specific";
            }

            const result = await db.execute({
              sql: `INSERT INTO dim_topics (topic_name, category, scope, created_at)
                    VALUES (?, ?, ?, datetime('now'))`,
              args: [topicName, category, scope]
            });

            newTopicsCount++;
            topicMap.set(topicName, Number(result.lastInsertRowid));

            if (newTopicsCount % 50 === 0) {
              console.log(`  ✅ Inserted ${newTopicsCount} new topics...`);
            }
          } catch (error: any) {
            if (error.message && error.message.includes('UNIQUE constraint')) {
              // Race condition - topic inserted by another process
              const existing = await db.execute({
                sql: "SELECT id FROM dim_topics WHERE topic_name = ?",
                args: [topicName]
              });
              if (existing.rows.length > 0) {
                topicMap.set(topicName, Number(existing.rows[0].id));
                reusedTopicsCount++;
              }
            } else {
              console.error(`  ❌ Error inserting topic "${topicName}":`, error.message);
            }
          }
        }
      }
    }
  }

  console.log(`\n  ✅ Added ${newTopicsCount} new topics`);
  console.log(`  ✅ Reused ${reusedTopicsCount} existing topics`);
  console.log(`  ✅ Total topics now: ${existingTopics.size + newTopicsCount}`);
  console.log("\n✅ Step 2 Complete\n");

  // Step 3: Update bridge table (add new mappings, keep old)
  console.log("📦 Step 3: Updating bridge_exam_subject_topic...\n");

  let bridgeAddedCount = 0;
  let bridgeSkippedCount = 0;
  let bridgeErrors = 0;

  for (const category of examCategories) {
    for (const exam of category.exams) {
      // Get exam_id
      const examResult = await db.execute({
        sql: "SELECT id FROM dim_exams WHERE exam_code = ?",
        args: [exam.id]
      });

      if (examResult.rows.length === 0) {
        console.error(`  ⚠️  Exam not found: ${exam.id}`);
        continue;
      }

      const examId = Number(examResult.rows[0].id);

      for (const subject of exam.subjects) {
        // Get subject_id
        const subjectResult = await db.execute({
          sql: "SELECT id FROM dim_subjects WHERE subject_code = ?",
          args: [subject.id]
        });

        if (subjectResult.rows.length === 0) {
          console.error(`  ⚠️  Subject not found: ${subject.id}`);
          continue;
        }

        const subjectId = Number(subjectResult.rows[0].id);

        for (const topicName of subject.topics) {
          const topicId = topicMap.get(topicName);

          if (!topicId) {
            console.error(`  ⚠️  Topic not found: ${topicName}`);
            bridgeErrors++;
            continue;
          }

          try {
            // Check if mapping already exists
            const existing = await db.execute({
              sql: `SELECT id FROM bridge_exam_subject_topic
                    WHERE exam_id = ? AND subject_id = ? AND topic_id = ?`,
              args: [examId, subjectId, topicId]
            });

            if (existing.rows.length > 0) {
              bridgeSkippedCount++;
              continue;
            }

            // Insert new mapping
            await db.execute({
              sql: `INSERT INTO bridge_exam_subject_topic (exam_id, subject_id, topic_id, created_at)
                    VALUES (?, ?, ?, datetime('now'))`,
              args: [examId, subjectId, topicId]
            });

            bridgeAddedCount++;

            if (bridgeAddedCount % 200 === 0) {
              console.log(`  ✅ Added ${bridgeAddedCount} new bridge mappings...`);
            }
          } catch (error: any) {
            if (error.message && error.message.includes('UNIQUE constraint')) {
              bridgeSkippedCount++;
            } else {
              console.error(`  ❌ Error inserting bridge mapping:`, error.message);
              bridgeErrors++;
            }
          }
        }
      }
    }
  }

  console.log(`\n  ✅ Added ${bridgeAddedCount} new bridge mappings`);
  console.log(`  ℹ️  Skipped ${bridgeSkippedCount} existing mappings`);
  console.log(`  ⚠️  Errors: ${bridgeErrors}`);
  console.log("\n✅ Step 3 Complete\n");

  // Step 4: Verify results
  console.log("📦 Step 4: Verifying results...\n");

  const finalTopics = await db.execute("SELECT COUNT(*) as cnt FROM dim_topics");
  const finalBridge = await db.execute("SELECT COUNT(*) as cnt FROM bridge_exam_subject_topic");
  const finalQuestions = await db.execute("SELECT COUNT(*) as cnt FROM fact_exam_questions");

  console.log(`  dim_topics: ${finalTopics.rows[0].cnt} rows`);
  console.log(`  bridge_exam_subject_topic: ${finalBridge.rows[0].cnt} mappings`);
  console.log(`  fact_exam_questions: ${finalQuestions.rows[0].cnt} questions (preserved)`);
  console.log("\n✅ Step 4 Complete\n");

  console.log("=" .repeat(80));
  console.log("\n✅ Phase A3 V2 Complete!");
  console.log("\n📊 Summary:");
  console.log(`  - Total topics: ${finalTopics.rows[0].cnt} (${newTopicsCount} new)`);
  console.log(`  - Total bridge mappings: ${finalBridge.rows[0].cnt} (${bridgeAddedCount} new)`);
  console.log(`  - Questions preserved: ${finalQuestions.rows[0].cnt}`);
  console.log(`  - Next: Test dimensional queries with atomic topics`);
  console.log();
}

main().catch((error) => {
  console.error("\n❌ Phase A3 V2 failed:", error);
  process.exit(1);
});
