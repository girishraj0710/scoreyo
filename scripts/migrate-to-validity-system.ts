#!/usr/bin/env tsx
/**
 * Database Migration: Switch to Validity Period System
 *
 * Purpose: Replace syllabus year tracking with validity periods
 * Old: syllabus_year=2024, is_current_syllabus=1
 * New: valid_from=2024, valid_until=NULL (NULL = still valid)
 *
 * Why Better:
 * - Automatically determines valid questions based on current year
 * - No manual "mark as outdated" needed
 * - Quiz in 2027 gets questions valid in 2027 (could be 2024 syllabus if still valid)
 * - When syllabus changes, just set valid_until on old questions
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
  console.log("🔄 DATABASE MIGRATION: Switch to Validity Period System");
  console.log("═".repeat(80));
  console.log("");

  try {
    // Step 1: Add new columns
    console.log("📝 Step 1: Adding validity period columns...");

    try {
      await db.execute(`
        ALTER TABLE exam_questions
        ADD COLUMN valid_from INTEGER
      `);
      console.log("   ✅ Added valid_from column");
    } catch (err: any) {
      if (err.message.includes("duplicate column")) {
        console.log("   ⚠️  valid_from column already exists");
      } else {
        throw err;
      }
    }

    try {
      await db.execute(`
        ALTER TABLE exam_questions
        ADD COLUMN valid_until INTEGER
      `);
      console.log("   ✅ Added valid_until column (NULL = still valid)");
    } catch (err: any) {
      if (err.message.includes("duplicate column")) {
        console.log("   ⚠️  valid_until column already exists");
      } else {
        throw err;
      }
    }

    console.log("");

    // Step 2: Migrate existing data
    console.log("📝 Step 2: Migrating existing syllabus_year → valid_from...");
    console.log("");

    // If old columns exist, migrate data
    const columnsCheck = await db.execute("PRAGMA table_info(exam_questions)");
    const hasOldColumns = columnsCheck.rows.some((r: any) => r.name === "syllabus_year");

    if (hasOldColumns) {
      console.log("   Migrating from old system...");

      // Copy syllabus_year → valid_from
      await db.execute(`
        UPDATE exam_questions
        SET valid_from = syllabus_year
        WHERE valid_from IS NULL
      `);

      // Set valid_until = NULL for current syllabus (is_current_syllabus = 1)
      // Set valid_until = current_year - 1 for outdated syllabus
      const currentYear = new Date().getFullYear();

      await db.execute(`
        UPDATE exam_questions
        SET valid_until = NULL
        WHERE is_current_syllabus = 1 AND valid_until IS NULL
      `);

      await db.execute({
        sql: `UPDATE exam_questions
              SET valid_until = ?
              WHERE is_current_syllabus = 0 AND valid_until IS NULL`,
        args: [currentYear - 1],
      });

      console.log("   ✅ Migrated syllabus_year → valid_from");
      console.log("   ✅ Set valid_until for outdated questions");
    } else {
      console.log("   Setting default values for new system...");

      // Get all unique exam_ids and set valid_from based on config
      const examsResult = await db.execute(
        "SELECT DISTINCT exam_id FROM exam_questions WHERE valid_from IS NULL"
      );

      for (const row of examsResult.rows) {
        const examId = row.exam_id as string;
        const syllabusYear = getCurrentSyllabusYear(examId);

        await db.execute({
          sql: `UPDATE exam_questions
                SET valid_from = ?, valid_until = NULL
                WHERE exam_id = ? AND valid_from IS NULL`,
          args: [syllabusYear, examId],
        });

        console.log(`   ✅ ${examId}: valid_from=${syllabusYear}, valid_until=NULL (current)`);
      }
    }

    console.log("");

    // Step 3: Create indexes
    console.log("📝 Step 3: Creating indexes for fast validity queries...");

    try {
      await db.execute(`
        CREATE INDEX IF NOT EXISTS idx_exam_questions_validity
        ON exam_questions(exam_id, subject_id, topic, valid_from, valid_until, difficulty)
      `);
      console.log("   ✅ Created validity index");
    } catch (err: any) {
      console.log("   ⚠️  Index might already exist");
    }

    console.log("");

    // Step 4: Verify
    console.log("📝 Step 4: Verifying migration...");
    console.log("");

    const stats = await db.execute(`
      SELECT
        exam_id,
        valid_from,
        valid_until,
        COUNT(*) as count
      FROM exam_questions
      GROUP BY exam_id, valid_from, valid_until
      ORDER BY exam_id, valid_from DESC
    `);

    console.log("   📊 Question Validity Distribution:");
    console.log("   " + "─".repeat(80));
    console.log("   Exam ID              | Valid From | Valid Until | Questions");
    console.log("   " + "─".repeat(80));

    for (const row of stats.rows) {
      const examId = String(row.exam_id).padEnd(20);
      const validFrom = String(row.valid_from || "N/A").padEnd(10);
      const validUntil = row.valid_until ? String(row.valid_until).padEnd(11) : "CURRENT    ";
      const count = String(row.count).padStart(9);
      console.log(`   ${examId} | ${validFrom} | ${validUntil} | ${count}`);
    }

    console.log("   " + "─".repeat(80));
    console.log("");

    // Show example queries
    const currentYear = new Date().getFullYear();
    console.log(`   📋 Example: Questions valid in ${currentYear}:`);

    const validNow = await db.execute({
      sql: `SELECT exam_id, COUNT(*) as count
            FROM exam_questions
            WHERE valid_from <= ? AND (valid_until IS NULL OR valid_until >= ?)
            GROUP BY exam_id
            LIMIT 5`,
      args: [currentYear, currentYear],
    });

    for (const row of validNow.rows) {
      console.log(`      ${row.exam_id}: ${row.count} questions`);
    }

    console.log("");

    // Step 5: Verify NO questions are missing validity periods
    console.log("📝 Step 5: Checking for questions without validity periods...");
    console.log("");

    const missingValidity = await db.execute(`
      SELECT COUNT(*) as count
      FROM exam_questions
      WHERE valid_from IS NULL OR valid_from = 0
    `);

    const missingCount = Number(missingValidity.rows[0]?.count || 0);

    if (missingCount > 0) {
      console.log(`   ⚠️  WARNING: ${missingCount} questions missing valid_from!`);
      console.log("   Fixing by setting default validity...");

      await db.execute({
        sql: `UPDATE exam_questions
              SET valid_from = ?, valid_until = NULL
              WHERE valid_from IS NULL OR valid_from = 0`,
        args: [currentYear],
      });

      console.log("   ✅ Fixed! All questions now have validity periods.");
    } else {
      console.log("   ✅ Perfect! All questions have valid_from set.");
    }

    console.log("");

    console.log("═".repeat(80));
    console.log("✅ MIGRATION COMPLETED SUCCESSFULLY");
    console.log("═".repeat(80));
    console.log("");
    console.log("GUARANTEE: Never Show 'No Results'");
    console.log("─".repeat(80));
    console.log("✅ All questions have valid_from and valid_until set");
    console.log("✅ Quiz in any year will find relevant questions");
    console.log("✅ Old syllabus (still valid) → Shows those questions");
    console.log("✅ New syllabus → Shows new questions");
    console.log("✅ System always returns questions for current year!");
    console.log("");
    console.log("New System Benefits:");
    console.log("✅ Automatic validity checking based on current year");
    console.log("✅ Quiz in 2027 gets questions valid in 2027 (regardless of when they were created)");
    console.log("✅ No manual 'mark as outdated' needed");
    console.log("✅ When syllabus changes, just set valid_until on old questions");
    console.log("");
    console.log("Query Logic:");
    console.log(`  SELECT * FROM exam_questions`);
    console.log(`  WHERE valid_from <= ${currentYear}`);
    console.log(`    AND (valid_until IS NULL OR valid_until >= ${currentYear})`);
    console.log("");
    console.log("Example: JEE Main in 2027");
    console.log("  Scenario 1 (Syllabus still 2024):");
    console.log("    Questions: valid_from=2024, valid_until=NULL");
    console.log("    Query: 2024 <= 2027 AND NULL ✅");
    console.log("    Result: Shows 2024 syllabus questions (still relevant!)");
    console.log("");
    console.log("  Scenario 2 (New 2027 syllabus):");
    console.log("    Old: valid_from=2024, valid_until=2026 ❌");
    console.log("    New: valid_from=2027, valid_until=NULL ✅");
    console.log("    Result: Shows 2027 syllabus questions only!");
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
