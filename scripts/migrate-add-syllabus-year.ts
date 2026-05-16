#!/usr/bin/env tsx
/**
 * Database Migration: Add Syllabus Year Tracking
 *
 * Purpose: Add syllabus_year and is_current_syllabus columns to exam_questions
 * Run once: When implementing syllabus currency system
 * Safe: Non-destructive, adds columns with defaults
 */

import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join } from "path";
import { getCurrentSyllabusYear } from "../src/lib/syllabus-config";

// Load environment
const envPath = join(process.cwd(), ".env.local");
if (require("fs").existsSync(envPath)) {
  const envFile = readFileSync(envPath, "utf-8");
  envFile.split("\n").forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const [, key, value] = match;
      process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
    }
  });
}

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function runMigration() {
  console.log("═".repeat(80));
  console.log("🔄 DATABASE MIGRATION: Add Syllabus Year Tracking");
  console.log("═".repeat(80));
  console.log("");

  try {
    // Step 1: Add columns
    console.log("📝 Step 1: Adding new columns...");

    try {
      await db.execute(`
        ALTER TABLE exam_questions
        ADD COLUMN syllabus_year INTEGER DEFAULT 2024
      `);
      console.log("   ✅ Added syllabus_year column");
    } catch (err: any) {
      if (err.message.includes("duplicate column")) {
        console.log("   ⚠️  syllabus_year column already exists");
      } else {
        throw err;
      }
    }

    try {
      await db.execute(`
        ALTER TABLE exam_questions
        ADD COLUMN is_current_syllabus BOOLEAN DEFAULT 1
      `);
      console.log("   ✅ Added is_current_syllabus column");
    } catch (err: any) {
      if (err.message.includes("duplicate column")) {
        console.log("   ⚠️  is_current_syllabus column already exists");
      } else {
        throw err;
      }
    }

    console.log("");

    // Step 2: Create index for fast lookups
    console.log("📝 Step 2: Creating indexes...");

    try {
      await db.execute(`
        CREATE INDEX IF NOT EXISTS idx_exam_questions_syllabus
        ON exam_questions(exam_id, subject_id, topic, is_current_syllabus, difficulty)
      `);
      console.log("   ✅ Created syllabus index for fast queries");
    } catch (err: any) {
      console.log("   ⚠️  Index might already exist");
    }

    console.log("");

    // Step 3: Update existing questions
    console.log("📝 Step 3: Marking existing questions as current syllabus...");

    // Get all unique exam_ids
    const examsResult = await db.execute(
      "SELECT DISTINCT exam_id FROM exam_questions"
    );

    let totalUpdated = 0;

    for (const row of examsResult.rows) {
      const examId = row.exam_id as string;
      const currentYear = getCurrentSyllabusYear(examId);

      // Mark all existing questions for this exam as current syllabus
      const result = await db.execute({
        sql: `UPDATE exam_questions
              SET syllabus_year = ?, is_current_syllabus = 1
              WHERE exam_id = ?`,
        args: [currentYear, examId],
      });

      const updated = result.rowsAffected || 0;
      totalUpdated += updated;
      console.log(`   ✅ ${examId}: Set ${updated} questions to syllabus year ${currentYear}`);
    }

    console.log("");
    console.log(`   📊 Total questions updated: ${totalUpdated}`);
    console.log("");

    // Step 4: Verify
    console.log("📝 Step 4: Verifying migration...");

    const stats = await db.execute(`
      SELECT
        exam_id,
        syllabus_year,
        is_current_syllabus,
        COUNT(*) as count
      FROM exam_questions
      GROUP BY exam_id, syllabus_year, is_current_syllabus
      ORDER BY exam_id, syllabus_year
    `);

    console.log("");
    console.log("   📊 Question Distribution by Syllabus:");
    console.log("   " + "─".repeat(70));
    console.log("   Exam ID              | Year | Current? | Questions");
    console.log("   " + "─".repeat(70));

    for (const row of stats.rows) {
      const examId = String(row.exam_id).padEnd(20);
      const year = String(row.syllabus_year).padEnd(4);
      const current = row.is_current_syllabus ? "✅ Yes" : "❌ No ";
      const count = String(row.count).padStart(9);
      console.log(`   ${examId} | ${year} | ${current}  | ${count}`);
    }

    console.log("   " + "─".repeat(70));
    console.log("");

    console.log("═".repeat(80));
    console.log("✅ MIGRATION COMPLETED SUCCESSFULLY");
    console.log("═".repeat(80));
    console.log("");
    console.log("Next steps:");
    console.log("1. Quiz generator will now prioritize current syllabus questions");
    console.log("2. Run annual update script every January: npx tsx scripts/annual-syllabus-update.ts");
    console.log("3. Update src/lib/syllabus-config.ts when new syllabi are announced");
    console.log("");

  } catch (error: any) {
    console.error("❌ MIGRATION FAILED");
    console.error(`Error: ${error.message}`);
    console.error("");
    console.error("Stack trace:", error.stack);
    process.exit(1);
  }
}

// Run migration
runMigration()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  });
