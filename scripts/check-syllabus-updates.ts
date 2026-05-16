#!/usr/bin/env tsx
/**
 * Syllabus Update Reminder Script
 *
 * Purpose: Check if syllabus config needs updating (runs in May)
 * Frequency: Annually in May (before June 1st cron)
 * Action: Generates reminder report, doesn't auto-change
 *
 * Why Not Auto-Increment?
 * - Syllabi don't change every year
 * - Different exams have different schedules
 * - Need to verify official notifications
 * - Need to document changes
 *
 * This script helps you identify what needs checking.
 */

import { CURRENT_SYLLABUS } from "../src/lib/syllabus-config";

console.log("═".repeat(80));
console.log("📅 SYLLABUS UPDATE REMINDER - May Check");
console.log("═".repeat(80));
console.log("");

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1; // 1-12

console.log(`Current Date: ${new Date().toLocaleDateString("en-IN")}`);
console.log(`Current Year: ${currentYear}`);
console.log("");

// Check if we're in May (reminder month)
if (currentMonth === 5) {
  console.log("🔔 REMINDER: Annual syllabus review time!");
  console.log("   New academic year starts in April. Check if any syllabi changed.");
  console.log("");
}

console.log("📋 Exams to Check:");
console.log("─".repeat(80));
console.log("");

// Group by likely update schedule
const annualExams = ["gate"];
const frequentExams = ["jee-main", "jee-advanced", "neet-ug", "mht-cet"];
const stableExams = ["upsc-cse", "cat", "neet-pg"];

console.log("🔴 HIGH PRIORITY (Check annually):");
console.log("");

frequentExams.forEach(examId => {
  const config = CURRENT_SYLLABUS.find(s => s.examId === examId);
  if (config) {
    const yearsSinceUpdate = currentYear - config.currentSyllabusYear;
    const lastUpdateDate = new Date(config.lastUpdated);
    const monthsSinceUpdate = Math.floor((Date.now() - lastUpdateDate.getTime()) / (1000 * 60 * 60 * 24 * 30));

    console.log(`  📚 ${config.examName}`);
    console.log(`     Current config: ${config.currentSyllabusYear}`);
    console.log(`     Years since update: ${yearsSinceUpdate}`);
    console.log(`     Last checked: ${config.lastUpdated} (${monthsSinceUpdate} months ago)`);

    if (yearsSinceUpdate >= 3) {
      console.log(`     ⚠️  WARNING: ${yearsSinceUpdate}+ years old! Check official notification.`);
    } else if (yearsSinceUpdate >= 2) {
      console.log(`     💡 TIP: ${yearsSinceUpdate} years old. Might be due for update.`);
    } else {
      console.log(`     ✅ Recent. Check NTA website anyway.`);
    }

    console.log(`     🔗 Official: ${config.officialNotice || 'N/A'}`);
    console.log("");
  }
});

console.log("🟡 MEDIUM PRIORITY (Check if 2+ years old):");
console.log("");

const otherExams = CURRENT_SYLLABUS.filter(
  s => !frequentExams.includes(s.examId) &&
       !annualExams.includes(s.examId) &&
       !stableExams.includes(s.examId)
);

otherExams.forEach(config => {
  const yearsSinceUpdate = currentYear - config.currentSyllabusYear;
  if (yearsSinceUpdate >= 2) {
    console.log(`  📚 ${config.examName} (${config.currentSyllabusYear}) - ${yearsSinceUpdate} years old`);
  }
});

console.log("");
console.log("🟢 LOW PRIORITY (Stable, rarely change):");
console.log("");

stableExams.forEach(examId => {
  const config = CURRENT_SYLLABUS.find(s => s.examId === examId);
  if (config) {
    console.log(`  📚 ${config.examName} (${config.currentSyllabusYear})`);
  }
});

console.log("");
console.log("─".repeat(80));
console.log("");

console.log("📝 ACTION STEPS:");
console.log("");
console.log("1. Check Official Notifications (April-May):");
console.log("   - NTA (JEE/NEET): https://nta.ac.in/");
console.log("   - State boards: Check respective websites");
console.log("   - GATE: https://gate.iitm.ac.in/");
console.log("");

console.log("2. If Any Syllabus Changed:");
console.log("   Update config using helper script:");
console.log("   npx tsx scripts/update-syllabus.ts <exam-id> <year> \"<changes>\"");
console.log("");
console.log("   Example:");
console.log("   npx tsx scripts/update-syllabus.ts jee-main 2027 \"Added ML in CS\"");
console.log("");

console.log("3. If No Changes:");
console.log("   Update lastUpdated date to mark as checked:");
console.log("   npx tsx scripts/update-syllabus.ts jee-main 2024 \"No changes\"");
console.log("");

console.log("4. After Updates:");
console.log("   - Commit and push changes");
console.log("   - Wait for June 1st cron (automatic)");
console.log("   - Or run manually: npx tsx scripts/annual-syllabus-update.ts");
console.log("");

console.log("═".repeat(80));
console.log("💡 TIP: This check is semi-automated on purpose!");
console.log("   Syllabi don't change every year, so manual verification is needed.");
console.log("   This script just reminds you what to check.");
console.log("═".repeat(80));
