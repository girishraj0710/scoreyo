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

async function fixSchema() {
  console.log("\n🔧 Fixing fact_exam_questions schema...\n");

  // Drop old table
  console.log("1️⃣  Dropping old fact_exam_questions table...");
  await db.execute(`DROP TABLE IF EXISTS fact_exam_questions`);
  console.log("   ✅ Dropped\n");

  // Create new table (topic-only)
  console.log("2️⃣  Creating new fact_exam_questions (topic-only)...");
  await db.execute(`
    CREATE TABLE fact_exam_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      topic_id INTEGER NOT NULL,
      question TEXT NOT NULL,
      options TEXT NOT NULL,
      correct_answer INTEGER NOT NULL,
      explanation TEXT,
      difficulty TEXT CHECK(difficulty IN ('easy', 'medium', 'hard')),
      source TEXT,
      valid_from INTEGER,
      valid_until INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (topic_id) REFERENCES dim_topics(id)
    )
  `);
  console.log("   ✅ Created\n");

  // Create indexes
  console.log("3️⃣  Creating indexes...");
  await db.execute(`CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_question ON fact_exam_questions(topic_id, substr(question, 1, 100))`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_fact_topic ON fact_exam_questions(topic_id)`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_fact_difficulty ON fact_exam_questions(difficulty)`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_fact_source ON fact_exam_questions(source)`);
  console.log("   ✅ Indexes created\n");

  // Verify
  const schema = await db.execute(`
    SELECT sql FROM sqlite_master 
    WHERE type='table' AND name='fact_exam_questions'
  `);
  
  console.log("4️⃣  Verification - New schema:");
  console.log(schema.rows[0]?.sql || "Table not found");
  console.log("\n✅ Schema fixed! Ready to run Phase 4 again.\n");
}

fixSchema();
