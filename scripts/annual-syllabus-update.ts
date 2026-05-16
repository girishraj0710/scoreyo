#!/usr/bin/env tsx
/**
 * Annual Syllabus Update Script
 *
 * Purpose: Mark old questions as outdated when syllabus changes
 * Frequency: Once a year (January 1st via cron)
 * Safe: Non-destructive, only marks questions, doesn't delete
 *
 * How it works:
 * 1. Reads current syllabus config from syllabus-config.ts
 * 2. Compares with questions in database
 * 3. Marks old questions as is_current_syllabus = 0
 * 4. Keeps old questions as backup (still usable if needed)
 * 5. New questions will be tagged with current year automatically
 */

import { createClient } from "@libsql/client";
import { readFileSync, appendFileSync } from "fs";
import { join } from "path";
import { CURRENT_SYLLABUS, getCurrentSyllabusYear } from "../src/lib/syllabus-config";

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

const LOG_FILE = join(process.cwd(), "annual-syllabus-update.log");

function log(message: string) {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] ${message}\n`;
  console.log(message);
  try {
    appendFileSync(LOG_FILE, logLine);
  } catch (err) {
    // Ignore log file errors
  }
}

async function runAnnualUpdate() {
  const startTime = Date.now();

  log("═".repeat(80));
  log("📅 ANNUAL SYLLABUS UPDATE");
  log("═".repeat(80));
  log(`Started: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`);
  log("");

  try {
    let totalExamsChecked = 0;
    let totalQuestionsMarkedOutdated = 0;
    let totalQuestionsMarkedCurrent = 0;

    // Process each exam
    for (const syllabusConfig of CURRENT_SYLLABUS) {
      const { examId, examName, currentSyllabusYear } = syllabusConfig;

      log(`📚 Processing: ${examName} (${examId})`);
      log(`   Current syllabus year: ${currentSyllabusYear}`);

      // Mark old questions as outdated
      const outdatedResult = await db.execute({
        sql: `UPDATE exam_questions
              SET is_current_syllabus = 0
              WHERE exam_id = ?
                AND syllabus_year != ?
                AND is_current_syllabus = 1`,
        args: [examId, currentSyllabusYear],
      });

      const outdated = outdatedResult.rowsAffected || 0;

      // Mark current year questions as current
      const currentResult = await db.execute({
        sql: `UPDATE exam_questions
              SET is_current_syllabus = 1
              WHERE exam_id = ?
                AND syllabus_year = ?
                AND is_current_syllabus = 0`,
        args: [examId, currentSyllabusYear],
      });

      const current = currentResult.rowsAffected || 0;

      totalQuestionsMarkedOutdated += outdated;
      totalQuestionsMarkedCurrent += current;

      if (outdated > 0) {
        log(`   ⚠️  Marked ${outdated} questions as outdated (old syllabus)`);
      }
      if (current > 0) {
        log(`   ✅ Marked ${current} questions as current syllabus`);
      }
      if (outdated === 0 && current === 0) {
        log(`   ✓  No changes needed (all questions up to date)`);
      }

      log("");
      totalExamsChecked++;
    }

    // Generate summary report
    log("═".repeat(80));
    log("📊 SUMMARY REPORT");
    log("═".repeat(80));
    log("");

    // Get stats by exam
    const stats = await db.execute(`
      SELECT
        exam_id,
        syllabus_year,
        is_current_syllabus,
        COUNT(*) as count
      FROM exam_questions
      GROUP BY exam_id, syllabus_year, is_current_syllabus
      ORDER BY exam_id, is_current_syllabus DESC, syllabus_year DESC
    `);

    log("Question Distribution by Syllabus:");
    log("─".repeat(80));
    log("Exam ID              | Year | Status      | Questions");
    log("─".repeat(80));

    for (const row of stats.rows) {
      const examId = String(row.exam_id).padEnd(20);
      const year = String(row.syllabus_year).padEnd(4);
      const status = row.is_current_syllabus ? "✅ Current" : "⚠️  Outdated";
      const count = String(row.count).padStart(9);
      log(`${examId} | ${year} | ${status} | ${count}`);
    }

    log("─".repeat(80));
    log("");

    const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1);

    log("═".repeat(80));
    log("✅ ANNUAL UPDATE COMPLETED");
    log("═".repeat(80));
    log(`Exams checked: ${totalExamsChecked}`);
    log(`Questions marked outdated: ${totalQuestionsMarkedOutdated}`);
    log(`Questions marked current: ${totalQuestionsMarkedCurrent}`);
    log(`Duration: ${duration} minutes`);
    log(`Next run: January 1st next year`);
    log("═".repeat(80));
    log("");

    // Action items
    if (totalQuestionsMarkedOutdated > 0) {
      log("⚡ ACTION REQUIRED:");
      log("");
      log("Outdated questions detected! Consider:");
      log("1. Generate new questions for updated syllabus topics");
      log("2. Review changes in official notifications");
      log("3. Update mock test configurations if needed");
      log("4. Monitor user feedback on question relevance");
      log("");
      log("Run: npx tsx scripts/comprehensive-seed-generator.ts");
      log("");
    }

    return {
      success: true,
      examsChecked: totalExamsChecked,
      questionsMarkedOutdated: totalQuestionsMarkedOutdated,
      questionsMarkedCurrent: totalQuestionsMarkedCurrent,
      durationMinutes: parseFloat(duration),
    };

  } catch (error: any) {
    log("❌ ANNUAL UPDATE FAILED");
    log(`Error: ${error.message}`);
    log("═".repeat(80));
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  runAnnualUpdate()
    .then((result) => {
      process.exit(0);
    })
    .catch((error) => {
      console.error("Annual update failed:", error);
      process.exit(1);
    });
}

export { runAnnualUpdate };
