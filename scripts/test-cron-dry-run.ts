#!/usr/bin/env tsx
/**
 * Dry Run Test - Check what the cron would do without actually seeding
 */

import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join } from "path";
import { examCategories } from "../src/lib/exams";

// Load environment
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

const LOW_STOCK_THRESHOLD = 50;
const MAX_TOPICS_PER_DAY = 10;

async function countTopicQuestions(examId: string, subjectId: string, topic: string): Promise<number> {
  const result = await db.execute({
    sql: "SELECT COUNT(*) as count FROM exam_questions WHERE exam_id = ? AND subject_id = ? AND topic = ?",
    args: [examId, subjectId, topic],
  });
  return Number(result.rows[0]?.count || 0);
}

async function dryRun() {
  console.log("🧪 DAILY CRON DRY RUN (No actual seeding)");
  console.log("═".repeat(60));
  console.log();

  console.log("🔍 Scanning for low-stock topics...");

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

  console.log(`   Found ${lowStockTopics.length} topics below threshold (${LOW_STOCK_THRESHOLD} questions)`);
  console.log();

  if (lowStockTopics.length === 0) {
    console.log("✅ All topics are well-stocked! No seeding needed.");
    return;
  }

  const topicsToSeed = lowStockTopics.slice(0, MAX_TOPICS_PER_DAY);

  console.log(`📋 Would seed these ${topicsToSeed.length} topics tomorrow:`);
  console.log();

  topicsToSeed.forEach((topic, i) => {
    console.log(`${i + 1}. ${topic.examName} → ${topic.subjectName} → ${topic.topic}`);
    console.log(`   Current: ${topic.currentStock} questions → Target: ${topic.currentStock + 20}`);
  });

  console.log();
  console.log("═".repeat(60));
  console.log("📊 SUMMARY");
  console.log("═".repeat(60));
  console.log(`Total low-stock topics: ${lowStockTopics.length}`);
  console.log(`Topics to seed tomorrow: ${topicsToSeed.length}`);
  console.log(`Questions to add: ${topicsToSeed.length * 20}`);
  console.log(`Estimated duration: ${(topicsToSeed.length * 0.8).toFixed(1)} minutes`);
  console.log("═".repeat(60));
}

dryRun()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
  });
