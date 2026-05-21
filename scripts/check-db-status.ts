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

async function checkStatus() {
  const total = await db.execute("SELECT COUNT(*) as total FROM exam_questions");
  console.log("\n📊 DATABASE STATUS:");
  console.log("═".repeat(80));
  console.log(`Total questions: ${total.rows[0].total}`);

  const topicStats = await db.execute(`
    SELECT
      exam_id,
      subject_id,
      topic,
      COUNT(*) as count
    FROM exam_questions
    GROUP BY exam_id, subject_id, topic
    ORDER BY count ASC
  `);

  const empty = topicStats.rows.filter((row: any) => Number(row.count) === 0);
  const below100 = topicStats.rows.filter((row: any) => Number(row.count) < 100 && Number(row.count) > 0);

  console.log(`Empty topics (0 questions): ${empty.length}`);
  console.log(`Topics below 100 questions: ${below100.length}`);
  console.log("═".repeat(80));

  if (empty.length > 0) {
    console.log("\n⚠️  EMPTY TOPICS (first 10):");
    empty.slice(0, 10).forEach((row: any) => {
      console.log(`   ${row.exam_id} → ${row.subject_id} → ${row.topic}`);
    });
  }

  process.exit(0);
}

checkStatus().catch(console.error);
