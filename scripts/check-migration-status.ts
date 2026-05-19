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
  console.log("\n📊 Current Migration Status:\n");
  
  const topics = await db.execute(`SELECT COUNT(*) as cnt FROM dim_topics`);
  const exams = await db.execute(`SELECT COUNT(*) as cnt FROM dim_exams`);
  const subjects = await db.execute(`SELECT COUNT(*) as cnt FROM dim_subjects`);
  const bridge = await db.execute(`SELECT COUNT(*) as cnt FROM bridge_exam_subject_topic`);
  
  console.log(`   Exams: ${exams.rows[0].cnt}`);
  console.log(`   Subjects: ${subjects.rows[0].cnt}`);
  console.log(`   Topics: ${topics.rows[0].cnt}`);
  console.log(`   Bridge mappings: ${bridge.rows[0].cnt}\n`);
}

check();
