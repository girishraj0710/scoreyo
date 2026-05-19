#!/usr/bin/env tsx
/**
 * MIGRATION TO DIMENSIONAL MODEL
 * Phase 1: Create dimensional schema
 */

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

async function main() {
  console.log("=".repeat(80));
  console.log("🔄 MIGRATION TO DIMENSIONAL MODEL - Phase 1");
  console.log("=".repeat(80));
  console.log("\nCreating dimensional schema...\n");

  try {
    // 1. Create dim_topics (Master Topics)
    console.log("1️⃣  Creating dim_topics...");
    await db.execute(`
      CREATE TABLE IF NOT EXISTS dim_topics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        topic_name TEXT NOT NULL UNIQUE,
        category TEXT NOT NULL,
        scope TEXT NOT NULL CHECK(scope IN ('universal', 'state-specific', 'exam-specific')),
        parent_topic_id INTEGER,
        description TEXT,
        keywords TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (parent_topic_id) REFERENCES dim_topics(id)
      )
    `);
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_topics_category ON dim_topics(category)`);
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_topics_scope ON dim_topics(scope)`);
    console.log("   ✅ dim_topics created\n");

    // 2. Create dim_exams
    console.log("2️⃣  Creating dim_exams...");
    await db.execute(`
      CREATE TABLE IF NOT EXISTS dim_exams (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        exam_code TEXT NOT NULL UNIQUE,
        exam_name TEXT NOT NULL,
        category TEXT,
        conducting_body TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_exams_category ON dim_exams(category)`);
    console.log("   ✅ dim_exams created\n");

    // 3. Create dim_subjects
    console.log("3️⃣  Creating dim_subjects...");
    await db.execute(`
      CREATE TABLE IF NOT EXISTS dim_subjects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject_code TEXT NOT NULL UNIQUE,
        subject_name TEXT NOT NULL,
        category TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("   ✅ dim_subjects created\n");

    // 4. Create bridge_exam_subject_topic
    console.log("4️⃣  Creating bridge_exam_subject_topic...");
    await db.execute(`
      CREATE TABLE IF NOT EXISTS bridge_exam_subject_topic (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        exam_id INTEGER NOT NULL,
        subject_id INTEGER NOT NULL,
        topic_id INTEGER NOT NULL,
        is_mandatory BOOLEAN DEFAULT TRUE,
        weightage INTEGER DEFAULT 5,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (exam_id) REFERENCES dim_exams(id),
        FOREIGN KEY (subject_id) REFERENCES dim_subjects(id),
        FOREIGN KEY (topic_id) REFERENCES dim_topics(id),
        UNIQUE(exam_id, subject_id, topic_id)
      )
    `);
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_bridge_exam ON bridge_exam_subject_topic(exam_id)`);
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_bridge_topic ON bridge_exam_subject_topic(topic_id)`);
    console.log("   ✅ bridge_exam_subject_topic created\n");

    // 5. Create fact_exam_questions (TOPIC-ONLY - No exam_id/subject_id!)
    console.log("5️⃣  Creating fact_exam_questions...");
    await db.execute(`
      CREATE TABLE IF NOT EXISTS fact_exam_questions (
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
    await db.execute(`CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_question ON fact_exam_questions(topic_id, substr(question, 1, 100))`);
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_fact_topic ON fact_exam_questions(topic_id)`);
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_fact_difficulty ON fact_exam_questions(difficulty)`);
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_fact_source ON fact_exam_questions(source)`);
    console.log("   ✅ fact_exam_questions created (SHARED by topic only)\n");

    console.log("=".repeat(80));
    console.log("✅ Phase 1 Complete: Dimensional schema created!");
    console.log("=".repeat(80));
    console.log("\nNext steps:");
    console.log("  - Run Phase 2: Populate dimensions (dim_topics, dim_exams, dim_subjects)");
    console.log("  - Run Phase 3: Create bridge mappings");
    console.log("  - Run Phase 4: Migrate questions with deduplication");
    console.log("");

  } catch (error: any) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
}

main().catch(console.error);
