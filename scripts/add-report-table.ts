#!/usr/bin/env tsx
/**
 * Add question_reports table
 */
import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join } from "path";

// Load environment variables
const envFile = readFileSync(join(process.cwd(), ".env.local"), "utf-8");
envFile.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const [, key, value] = match;
    process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, "");
  }
});

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function addReportTable() {
  console.log("📊 Adding question_reports table...");

  try {
    // Create table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS question_reports (
        id TEXT PRIMARY KEY,
        question_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        reason TEXT NOT NULL,
        details TEXT,
        status TEXT DEFAULT 'pending',
        admin_notes TEXT,
        created_at TEXT NOT NULL,
        resolved_at TEXT,
        FOREIGN KEY (question_id) REFERENCES exam_questions(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    console.log("✅ question_reports table created successfully");

    // Create indexes
    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_reports_status
      ON question_reports(status)
    `);
    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_reports_question
      ON question_reports(question_id)
    `);
    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_reports_user
      ON question_reports(user_id)
    `);

    console.log("✅ Indexes created successfully");

    // Check table structure
    const schema = await db.execute(
      "PRAGMA table_info(question_reports)"
    );
    console.log("\n📋 Table Schema:");
    schema.rows.forEach((col: any) => {
      console.log(`   ${col.name.padEnd(20)} ${col.type.padEnd(10)} ${col.notnull ? "NOT NULL" : ""}`);
    });

    console.log("\n✅ Migration complete!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

addReportTable()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
  });
