#!/usr/bin/env tsx
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

async function testTopicSharing() {
  console.log("\n🧪 Testing Topic Sharing Across Exams\n");
  console.log("=" .repeat(80));

  // Test atomic topics that should be shared
  const testTopics = [
    "Kinematics",
    "Thermodynamics",
    "Chemical Bonding",
    "Algebra",
    "Probability"
  ];

  for (const topicName of testTopics) {
    console.log(`\n📚 Topic: "${topicName}"`);

    // Find topic_id
    const topicResult = await db.execute({
      sql: "SELECT id FROM dim_topics WHERE topic_name = ?",
      args: [topicName]
    });

    if (topicResult.rows.length === 0) {
      console.log(`  ❌ Topic not found in dim_topics`);
      continue;
    }

    const topicId = topicResult.rows[0].id;

    // Find exams sharing this topic
    const examsResult = await db.execute({
      sql: `SELECT DISTINCT e.exam_code, e.exam_name
            FROM bridge_exam_subject_topic b
            JOIN dim_exams e ON b.exam_id = e.id
            WHERE b.topic_id = ?
            ORDER BY e.exam_name`,
      args: [topicId]
    });

    console.log(`  ✅ Shared by ${examsResult.rows.length} exams:`);
    examsResult.rows.forEach(row => {
      console.log(`     - ${row.exam_name} (${row.exam_code})`);
    });

    // Count questions for this topic
    const questionsResult = await db.execute({
      sql: "SELECT COUNT(*) as cnt FROM fact_exam_questions WHERE topic_id = ?",
      args: [topicId]
    });

    console.log(`  📊 Question pool size: ${questionsResult.rows[0].cnt} questions`);
  }

  console.log("\n" + "=".repeat(80));
  console.log("\n✅ Topic sharing test complete!\n");
}

testTopicSharing().then(() => process.exit(0)).catch(console.error);
