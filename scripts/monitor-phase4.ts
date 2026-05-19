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

async function monitor() {
  console.log(`\n📊 Phase 4 Progress - ${new Date().toLocaleTimeString()}\n`);

  const oldCount = await db.execute(`SELECT COUNT(*) as cnt FROM exam_questions`);
  const newCount = await db.execute(`SELECT COUNT(*) as cnt FROM fact_exam_questions`);
  const topicsWithQuestions = await db.execute(`SELECT COUNT(DISTINCT topic_id) as cnt FROM fact_exam_questions`);

  const oldTotal = Number(oldCount.rows[0].cnt);
  const newTotal = Number(newCount.rows[0].cnt);
  const progress = oldTotal > 0 ? ((newTotal / oldTotal) * 100).toFixed(1) : '0.0';

  console.log(`   Old table (exam_questions): ${oldTotal.toLocaleString()} questions`);
  console.log(`   New table (fact_exam_questions): ${newTotal.toLocaleString()} questions`);
  console.log(`   Progress: ${progress}%`);
  console.log(`   Topics with questions: ${topicsWithQuestions.rows[0].cnt}`);
  console.log(`   Deduplication: ${((1 - newTotal/oldTotal) * 100).toFixed(1)}% reduction\n`);

  // Show top shared topics
  if (newTotal > 0) {
    const topShared = await db.execute(`
      SELECT t.topic_name, COUNT(q.id) as q_count, COUNT(DISTINCT b.exam_id) as exam_count
      FROM dim_topics t
      JOIN fact_exam_questions q ON t.id = q.topic_id
      JOIN bridge_exam_subject_topic b ON t.id = b.topic_id
      GROUP BY t.id
      ORDER BY exam_count DESC, q_count DESC
      LIMIT 5
    `);

    console.log("   Top shared topics:");
    for (const row of topShared.rows) {
      console.log(`      ${row.topic_name}: ${row.q_count} questions → shared by ${row.exam_count} exams`);
    }
    console.log();
  }
}

monitor();
