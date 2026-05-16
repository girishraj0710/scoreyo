#!/usr/bin/env tsx
/**
 * Sprint System Health Check
 *
 * Verifies daily sprint creation is working correctly.
 * Usage: npx tsx scripts/check-sprint-health.ts
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

async function checkSprintHealth() {
  console.log("\n" + "=".repeat(70));
  console.log("🏃 SPRINT SYSTEM HEALTH CHECK");
  console.log("=".repeat(70));
  console.log(`Run Date: ${new Date().toISOString()}`);
  console.log("=".repeat(70));

  const today = new Date().toISOString().split("T")[0];

  // 1. Check today's sprints
  const todaySprints = await db.execute({
    sql: "SELECT id, topic, exam_id, subject_id, status FROM daily_sprints WHERE date = ? AND status = 'active'",
    args: [today],
  });

  console.log("\n📅 TODAY'S ACTIVE SPRINTS:\n");
  console.log(`  Total Created: ${todaySprints.rows.length}`);

  if (todaySprints.rows.length === 0) {
    console.log("  ⚠️  WARNING: No sprints found for today!");
    console.log("  Action: Check GitHub Actions 'Create Daily Sprint' workflow");
  } else {
    // Group by exam
    const byExam: Record<string, number> = {};
    todaySprints.rows.forEach((r: any) => {
      const exam = r.exam_id || "unknown";
      byExam[exam] = (byExam[exam] || 0) + 1;
    });

    console.log("\n  Breakdown by Exam:");
    Object.entries(byExam)
      .sort(([, a], [, b]) => b - a)
      .forEach(([exam, count]) => {
        console.log(`    ${exam.padEnd(20)} ${count} sprint(s)`);
      });

    // Show sample topics
    console.log("\n  Sample Sprint Topics:");
    todaySprints.rows.slice(0, 5).forEach((r: any, i: number) => {
      console.log(`    ${i + 1}. ${r.topic}`);
    });
  }

  // 2. Check participation (if any sprint_id exists in quiz_sessions)
  let participationCount = { rows: [{ users: 0 }] };
  try {
    participationCount = await db.execute({
      sql: `
        SELECT COUNT(DISTINCT user_id) as users
        FROM quiz_sessions
        WHERE sprint_id IS NOT NULL
        AND created_at > datetime('now', '-1 day')
      `,
    });
  } catch (err) {
    console.log("  (Participation tracking not yet implemented)");
  }

  console.log("\n👥 PARTICIPATION (Last 24 Hours):\n");
  console.log(`  Unique Participants: ${participationCount.rows[0].users || 0}`);

  // 3. Check last 7 days sprint creation
  const last7Days = await db.execute(`
    SELECT date, COUNT(*) as sprint_count
    FROM daily_sprints
    WHERE date >= date('now', '-7 days')
    GROUP BY date
    ORDER BY date DESC
  `);

  console.log("\n📊 SPRINT CREATION HISTORY (Last 7 Days):\n");
  if (last7Days.rows.length === 0) {
    console.log("  ⚠️  No sprint data found for last 7 days");
  } else {
    last7Days.rows.forEach((r: any) => {
      console.log(`  ${r.date}: ${r.sprint_count} sprints created`);
    });
  }

  // 4. Check for expired sprints cleanup
  const oldSprints = await db.execute(
    "SELECT COUNT(*) as count FROM daily_sprints WHERE date < date('now', '-7 days')"
  );

  console.log("\n🧹 CLEANUP STATUS:\n");
  console.log(`  Old Sprints (>7 days): ${oldSprints.rows[0].count}`);
  if (Number(oldSprints.rows[0].count) > 100) {
    console.log("  ⚠️  Many old sprints - cleanup may not be running");
  } else {
    console.log("  ✅ Cleanup working correctly");
  }

  // 5. Health indicators
  console.log("\n✅ HEALTH INDICATORS:\n");

  const expectedSprints = 26; // Should create 26 sprints daily
  const sprintHealthy = todaySprints.rows.length >= expectedSprints * 0.8;
  const cleanupHealthy = Number(oldSprints.rows[0].count) < 100;
  const historyHealthy = last7Days.rows.length >= 5;

  const indicators = [
    {
      name: "Today's Sprint Creation",
      status: sprintHealthy ? "✅ Good" : "❌ Issue",
      value: `${todaySprints.rows.length}/${expectedSprints} expected`,
    },
    {
      name: "Creation History",
      status: historyHealthy ? "✅ Good" : "⚠️  Gaps",
      value: `${last7Days.rows.length}/7 days`,
    },
    {
      name: "Old Sprint Cleanup",
      status: cleanupHealthy ? "✅ Good" : "⚠️  Issue",
      value: `${oldSprints.rows[0].count} remaining`,
    },
    {
      name: "User Participation",
      status: Number(participationCount.rows[0].users) > 0 ? "✅ Active" : "⚠️  None",
      value: `${participationCount.rows[0].users} users`,
    },
  ];

  indicators.forEach((ind) => {
    console.log(`  ${ind.name.padEnd(25)} ${ind.status.padEnd(15)} (${ind.value})`);
  });

  // 6. Recommendations
  console.log("\n💡 RECOMMENDATIONS:\n");

  if (!sprintHealthy) {
    console.log("  🚨 URGENT: Today's sprint count low - check GitHub Actions workflow");
  }
  if (!historyHealthy) {
    console.log("  ⚠️  Sprint creation has gaps - verify cron schedule (9 AM IST daily)");
  }
  if (!cleanupHealthy) {
    console.log("  ⚠️  Old sprints not being cleaned - check cleanup logic in create-sprint API");
  }
  if (Number(participationCount.rows[0].users) === 0) {
    console.log("  ℹ️  No participation yet - sprint feature may need marketing");
  }
  if (sprintHealthy && cleanupHealthy && historyHealthy) {
    console.log("  ✅ Sprint system fully operational - continue monitoring");
  }

  console.log("\n" + "=".repeat(70));
  console.log("📅 Next Check: Run this script daily to monitor sprint creation");
  console.log("=".repeat(70) + "\n");
}

checkSprintHealth()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Sprint health check failed:", err);
    process.exit(1);
  });
