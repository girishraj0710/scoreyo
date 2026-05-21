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

async function check() {
  console.log("\n📊 Current Dimensional Table Status:\n");

  const exams = await db.execute("SELECT COUNT(*) as cnt FROM dim_exams");
  const subjects = await db.execute("SELECT COUNT(*) as cnt FROM dim_subjects");
  const topics = await db.execute("SELECT COUNT(*) as cnt FROM dim_topics");
  const bridge = await db.execute("SELECT COUNT(*) as cnt FROM bridge_exam_subject_topic");
  const questions = await db.execute("SELECT COUNT(*) as cnt FROM fact_exam_questions");

  console.log(`  dim_exams: ${exams.rows[0].cnt} rows`);
  console.log(`  dim_subjects: ${subjects.rows[0].cnt} rows`);
  console.log(`  dim_topics: ${topics.rows[0].cnt} rows`);
  console.log(`  bridge_exam_subject_topic: ${bridge.rows[0].cnt} mappings`);
  console.log(`  fact_exam_questions: ${questions.rows[0].cnt} questions\n`);
}

check().then(() => process.exit(0)).catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
