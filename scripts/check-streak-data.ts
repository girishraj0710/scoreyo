// Script to check streak data for debugging
// Run with: npx tsx scripts/check-streak-data.ts YOUR_USER_ID

import { queryAll } from "../src/lib/db";

async function checkStreakData(userId: string) {
  console.log(`\n🔍 Checking streak data for user: ${userId}\n`);

  // Check total quiz sessions
  const totalSessions = await queryAll(
    "SELECT id, created_at, exam_id FROM quiz_sessions WHERE user_id = ? ORDER BY created_at DESC LIMIT 10",
    [userId]
  );

  console.log(`📊 Total recent sessions: ${totalSessions.length}`);
  totalSessions.forEach((session, idx) => {
    console.log(`  ${idx + 1}. ${session.created_at} - Exam: ${session.exam_id}`);
  });

  // Check unique study days
  const uniqueDays = await queryAll(
    "SELECT DISTINCT DATE(created_at) as day, COUNT(*) as sessions FROM quiz_sessions WHERE user_id = ? GROUP BY DATE(created_at) ORDER BY day DESC LIMIT 10",
    [userId]
  );

  console.log(`\n📅 Unique study days (last 10):`);
  uniqueDays.forEach((day, idx) => {
    console.log(`  ${idx + 1}. ${day.day} - ${day.sessions} sessions`);
  });

  // Check if dates are consecutive
  if (uniqueDays.length >= 2) {
    console.log(`\n🔗 Checking consecutiveness:`);
    for (let i = 0; i < uniqueDays.length - 1; i++) {
      const current = new Date(uniqueDays[i].day);
      const next = new Date(uniqueDays[i + 1].day);
      const diffDays = Math.floor((current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24));
      console.log(`  ${uniqueDays[i].day} → ${uniqueDays[i + 1].day}: ${diffDays} day gap ${diffDays === 1 ? '✅ consecutive' : '❌ not consecutive'}`);
    }
  }

  console.log(`\n✅ Diagnosis complete!\n`);
}

// Get user ID from command line
const userId = process.argv[2];
if (!userId) {
  console.error("Usage: npx tsx scripts/check-streak-data.ts YOUR_USER_ID");
  process.exit(1);
}

checkStreakData(userId).catch(console.error);
