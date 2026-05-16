#!/usr/bin/env tsx
/**
 * Syllabus Config Update Helper
 *
 * Purpose: Easy way to update syllabus config without manual editing
 * Usage: npx tsx scripts/update-syllabus.ts <exam-id> <year> "<changes>"
 *
 * Examples:
 *   npx tsx scripts/update-syllabus.ts jee-main 2027 "Added ML topics"
 *   npx tsx scripts/update-syllabus.ts neet-ug 2024 "No changes"
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

// Parse arguments
const args = process.argv.slice(2);

if (args.length < 3) {
  console.error("❌ Usage: npx tsx scripts/update-syllabus.ts <exam-id> <year> \"<changes>\"");
  console.error("");
  console.error("Examples:");
  console.error("  npx tsx scripts/update-syllabus.ts jee-main 2027 \"Added ML topics\"");
  console.error("  npx tsx scripts/update-syllabus.ts neet-ug 2024 \"No changes\"");
  process.exit(1);
}

const [examId, yearStr, changes] = args;
const year = parseInt(yearStr);

if (isNaN(year) || year < 2020 || year > 2050) {
  console.error("❌ Invalid year. Must be between 2020-2050.");
  process.exit(1);
}

console.log("═".repeat(80));
console.log("📝 SYLLABUS CONFIG UPDATE");
console.log("═".repeat(80));
console.log("");

// Read current config file
const configPath = join(process.cwd(), "src/lib/syllabus-config.ts");
let configContent = readFileSync(configPath, "utf-8");

// Find the exam entry
const examPattern = new RegExp(
  `(\\{\\s*examId:\\s*"${examId}"[^}]*currentSyllabusYear:\\s*)\\d+(,)`,
  "g"
);

const lastUpdatedPattern = new RegExp(
  `(\\{\\s*examId:\\s*"${examId}"[^}]*lastUpdated:\\s*")[^"]+(")`,
  "g"
);

const changesPattern = new RegExp(
  `(\\{\\s*examId:\\s*"${examId}"[^}]*changes:\\s*")[^"]+(")`,
  "g"
);

// Check if exam exists
if (!configContent.includes(`examId: "${examId}"`)) {
  console.error(`❌ Exam not found: ${examId}`);
  console.error("");
  console.error("Available exam IDs:");
  const matches = configContent.matchAll(/examId:\s*"([^"]+)"/g);
  for (const match of matches) {
    console.error(`  - ${match[1]}`);
  }
  process.exit(1);
}

console.log(`📚 Exam ID: ${examId}`);
console.log(`📅 New syllabus year: ${year}`);
console.log(`📝 Changes: ${changes}`);
console.log("");

// Get exam name for confirmation
const examNameMatch = configContent.match(
  new RegExp(`examId:\\s*"${examId}"[^}]*examName:\\s*"([^"]+)"`)
);
const examName = examNameMatch ? examNameMatch[1] : examId;

console.log(`Updating: ${examName}`);
console.log("");

// Update currentSyllabusYear
configContent = configContent.replace(
  examPattern,
  `$1${year}$2`
);

// Update lastUpdated
const today = new Date().toISOString().split("T")[0];
configContent = configContent.replace(
  lastUpdatedPattern,
  `$1${today}$2`
);

// Update changes
configContent = configContent.replace(
  changesPattern,
  `$1${changes}$2`
);

// Write back
writeFileSync(configPath, configContent, "utf-8");

console.log("✅ Config updated successfully!");
console.log("");
console.log("Changes made:");
console.log(`  - currentSyllabusYear: ${year}`);
console.log(`  - lastUpdated: ${today}`);
console.log(`  - changes: "${changes}"`);
console.log("");

console.log("─".repeat(80));
console.log("📋 Next Steps:");
console.log("");
console.log("1. Verify the change:");
console.log(`   cat src/lib/syllabus-config.ts | grep -A 5 '${examId}'`);
console.log("");
console.log("2. Commit and push:");
console.log("   git add src/lib/syllabus-config.ts");
console.log(`   git commit -m "chore: Update ${examName} syllabus to ${year}"`);
console.log("   git push origin main");
console.log("");
console.log("3. Wait for June 1st cron, or run manually:");
console.log("   npx tsx scripts/annual-syllabus-update.ts");
console.log("");
console.log("═".repeat(80));
