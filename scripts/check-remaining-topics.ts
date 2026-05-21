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
  const ids = [2958, 1542];
  
  for (const id of ids) {
    const topic = await db.execute({
      sql: "SELECT * FROM dim_topics WHERE id = ?",
      args: [id]
    });
    
    if (topic.rows.length === 0) {
      console.log(`Topic ${id} not found`);
      continue;
    }
    
    console.log(`\nTopic ${id}: "${topic.rows[0].topic_name}"`);
    
    const questions = await db.execute({
      sql: "SELECT COUNT(*) as cnt FROM fact_exam_questions WHERE topic_id = ?",
      args: [id]
    });
    console.log(`  Questions: ${questions.rows[0].cnt}`);
    
    const bridges = await db.execute({
      sql: "SELECT COUNT(*) as cnt FROM bridge_exam_subject_topic WHERE topic_id = ?",
      args: [id]
    });
    console.log(`  Bridge mappings: ${bridges.rows[0].cnt}`);
    
    const parents = await db.execute({
      sql: "SELECT COUNT(*) as cnt FROM dim_topics WHERE parent_topic_id = ?",
      args: [id]
    });
    console.log(`  Child topics (referencing as parent): ${parents.rows[0].cnt}`);
  }
}

check().then(() => process.exit(0)).catch(console.error);
