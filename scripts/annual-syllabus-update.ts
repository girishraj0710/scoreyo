#!/usr/bin/env tsx
/**
 * Annual Syllabus Update Script
 *
 * Purpose: Set expiry date (valid_until) on old questions when syllabus changes
 * Frequency: Once a year (June 1st via cron)
 * Timing: June aligns with Indian academic year (starts April, new syllabi by May)
 * Safe: Non-destructive, only sets valid_until, doesn't delete
 *
 * How it works (Validity Period System):
 * 1. Reads current syllabus config from syllabus-config.ts
 * 2. For each exam, checks if syllabus changed
 * 3. If changed: Sets valid_until on old questions (makes them expire)
 * 4. New questions already have valid_from = new year, valid_until = NULL
 * 5. Quiz generator automatically uses questions valid for current year
 *
 * Example:
 *   JEE 2024 syllabus used 2024-2026 (valid_from=2024, valid_until=NULL)
 *   June 2027: JEE 2027 syllabus announced
 *   Update: Set valid_until=2026 on old questions
 *   Result: Quiz in 2027 only gets questions with valid_from<=2027 AND (valid_until=NULL OR valid_until>=2027)
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

    // Process each exam (Validity Period System)
    const currentYear = new Date().getFullYear();

    for (const syllabusConfig of CURRENT_SYLLABUS) {
      const { examId, examName, currentSyllabusYear } = syllabusConfig;

      log(`📚 Processing: ${examName} (${examId})`);
      log(`   Current syllabus year: ${currentSyllabusYear}`);

      // Check if there are questions with old valid_from (syllabus changed)
      // Old questions: valid_from < currentSyllabusYear AND valid_until IS NULL (still showing as valid)
      // Action: Set valid_until = currentYear - 1 (expire them)
      const outdatedResult = await db.execute({
        sql: `UPDATE exam_questions
              SET valid_until = ?
              WHERE exam_id = ?
                AND valid_from < ?
                AND valid_until IS NULL`,
        args: [currentYear - 1, examId, currentSyllabusYear],
      });

      const outdated = outdatedResult.rowsAffected || 0;

      // No need to "mark as current" - questions with valid_from = currentSyllabusYear and valid_until = NULL are already current
      // They will automatically be picked up by quiz generator (valid_from <= currentYear AND (valid_until IS NULL OR valid_until >= currentYear))

      totalQuestionsMarkedOutdated += outdated;

      if (outdated > 0) {
        log(`   ⚠️  Expired ${outdated} old questions (set valid_until=${currentYear - 1})`);
        log(`   ℹ️  These questions were valid until ${currentYear - 1}, now expired in ${currentYear}`);
      } else {
        log(`   ✓  No old questions to expire (syllabus unchanged or already expired)`);
      }

      log("");
      totalExamsChecked++;
    }

    // Generate summary report
    log("═".repeat(80));
    log("📊 SUMMARY REPORT");
    log("═".repeat(80));
    log("");

    // Get stats by exam (Validity Period System)
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

    log("Question Validity Distribution:");
    log("─".repeat(80));
    log("Exam ID              | Valid From | Valid Until | Status      | Questions");
    log("─".repeat(80));

    for (const row of stats.rows) {
      const examId = String(row.exam_id).padEnd(20);
      const validFrom = String(row.valid_from || "N/A").padEnd(10);
      const validUntil = row.valid_until ? String(row.valid_until).padEnd(11) : "CURRENT    ";
      const validUntilNum = row.valid_until ? Number(row.valid_until) : null;
      const status = !validUntilNum ? "✅ Current" : (validUntilNum >= currentYear ? "✅ Valid  " : "⚠️  Expired");
      const count = String(row.count).padStart(9);
      log(`${examId} | ${validFrom} | ${validUntil} | ${status} | ${count}`);
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
    log(`Next run: June 1st next year`);
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
