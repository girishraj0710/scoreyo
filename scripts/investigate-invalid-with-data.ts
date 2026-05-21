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

async function investigate() {
  console.log("\n🔍 Investigating Invalid Topics with Questions...\n");
  console.log("=" .repeat(80));

  const invalidTopicsWithData = [
    64, 1992, 2905, 2244, 1236, 2097, 1194, 1739, 2274, 2098,
    2685, 1818, 1758, 1832, 1599, 1157, 1604, 1557, 3007
  ];

  for (const topicId of invalidTopicsWithData) {
    const topicResult = await db.execute({
      sql: "SELECT * FROM dim_topics WHERE id = ?",
      args: [topicId]
    });

    if (topicResult.rows.length === 0) continue;

    const topic = topicResult.rows[0];
    console.log(`\n📚 ID ${topicId}: "${topic.topic_name}" (${topic.category}, ${topic.scope})`);

    // Get sample questions
    const questionsResult = await db.execute({
      sql: `SELECT id, question, source, difficulty
            FROM fact_exam_questions
            WHERE topic_id = ?
            LIMIT 3`,
      args: [topicId]
    });

    console.log(`   ${questionsResult.rows.length} questions total. Sample:`);
    questionsResult.rows.forEach((q: any, i: number) => {
      const questionText = String(q.question).substring(0, 100);
      console.log(`     ${i+1}. [${q.source}/${q.difficulty}] ${questionText}...`);
    });
  }

  console.log("\n" + "=".repeat(80));
  console.log("\n💡 Analysis:\n");
  console.log("These invalid topics likely came from:");
  console.log("1. Old grouped topic parsing that broke on special characters");
  console.log("2. Topics like 'Art & Culture' → split incorrectly to 'Art'");
  console.log("3. Topics like '2D Geometry' → parsed as '2D'");
  console.log("4. Empty topic names from malformed data\n");
  console.log("Solution: Need to find correct topic for each question and reassign.\n");
}

investigate().then(() => process.exit(0)).catch(console.error);
