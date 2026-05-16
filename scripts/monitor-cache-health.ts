#!/usr/bin/env tsx
/**
 * Cache Health Monitor
 *
 * Run this weekly to check cache system health.
 * Usage: npx tsx scripts/monitor-cache-health.ts
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

async function checkHealth() {
  console.log("\n" + "=".repeat(70));
  console.log("🏥 CACHE HEALTH MONITOR");
  console.log("=".repeat(70));
  console.log(`Run Date: ${new Date().toISOString()}`);
  console.log("=".repeat(70));

  // 1. Question counts
  const examQ = await db.execute("SELECT COUNT(*) as count FROM exam_questions");
  const cachedQ = await db.execute("SELECT COUNT(*) as count FROM cached_questions");

  const verified = Number(examQ.rows[0].count);
  const cached = Number(cachedQ.rows[0].count);
  const total = verified + cached;

  console.log("\n📊 QUESTION POOL STATUS:\n");
  console.log(`  Verified (exam_questions):  ${verified.toLocaleString()}`);
  console.log(`  Cached (cached_questions):  ${cached.toLocaleString()}`);
  console.log(`  Total Available:            ${total.toLocaleString()}`);

  // 2. Growth since last week (if we had tracking)
  const recentCached = await db.execute(`
    SELECT COUNT(*) as count
    FROM cached_questions
    WHERE created_at > datetime('now', '-7 days')
  `);

  console.log(`  Added Last 7 Days:          ${recentCached.rows[0].count}`);

  // 3. Top exams by coverage
  const topExams = await db.execute(`
    SELECT exam_id, COUNT(*) as count
    FROM exam_questions
    GROUP BY exam_id
    ORDER BY count DESC
    LIMIT 5
  `);

  console.log("\n🏆 TOP 5 EXAMS BY COVERAGE:\n");
  topExams.rows.forEach((r, i) => {
    console.log(`  ${i + 1}. ${String(r.exam_id).padEnd(20)} ${r.count} questions`);
  });

  // 4. Exams needing attention
  const lowExams = await db.execute(`
    SELECT exam_id, COUNT(*) as count
    FROM exam_questions
    GROUP BY exam_id
    HAVING COUNT(*) < 100
    ORDER BY count ASC
    LIMIT 5
  `);

  console.log("\n⚠️  EXAMS NEEDING ATTENTION (<100 questions):\n");
  lowExams.rows.forEach((r, i) => {
    console.log(`  ${i + 1}. ${String(r.exam_id).padEnd(20)} ${r.count} questions`);
  });

  // 5. Cache warming effectiveness (check recent additions)
  const warmingStats = await db.execute(`
    SELECT
      date(created_at) as date,
      COUNT(*) as questions_added
    FROM cached_questions
    WHERE created_at > datetime('now', '-7 days')
    GROUP BY date(created_at)
    ORDER BY date DESC
  `);

  console.log("\n📈 CACHE WARMING ACTIVITY (Last 7 Days):\n");
  if (warmingStats.rows.length === 0) {
    console.log("  No new cached questions in last 7 days ⚠️");
  } else {
    warmingStats.rows.forEach((r) => {
      console.log(`  ${r.date}: +${r.questions_added} questions`);
    });
  }

  // 6. Health indicators
  console.log("\n✅ HEALTH INDICATORS:\n");

  const indicators = [
    {
      name: "Total Pool Size",
      status: total >= 40000 ? "✅ Good" : total >= 20000 ? "⚠️  Fair" : "❌ Low",
      value: total.toLocaleString()
    },
    {
      name: "Verified Percentage",
      status: (verified / total * 100) >= 30 ? "✅ Good" : (verified / total * 100) >= 10 ? "⚠️  Fair" : "❌ Low",
      value: `${(verified / total * 100).toFixed(1)}%`
    },
    {
      name: "Cache Growth",
      status: Number(recentCached.rows[0].count) > 0 ? "✅ Active" : "⚠️  Stalled",
      value: `${recentCached.rows[0].count}/week`
    },
    {
      name: "Low-Coverage Exams",
      status: lowExams.rows.length === 0 ? "✅ None" : lowExams.rows.length <= 5 ? "⚠️  Some" : "❌ Many",
      value: `${lowExams.rows.length} exams`
    }
  ];

  indicators.forEach((ind) => {
    console.log(`  ${ind.name.padEnd(25)} ${ind.status.padEnd(15)} (${ind.value})`);
  });

  // 7. Recommendations
  console.log("\n💡 RECOMMENDATIONS:\n");

  if (verified / total < 0.15) {
    console.log("  🚨 URGENT: Verified questions <15% - prioritize manual curation");
  }
  if (Number(recentCached.rows[0].count) === 0) {
    console.log("  ⚠️  Cache warming stalled - check GitHub Actions prewarm cron");
  }
  if (lowExams.rows.length > 10) {
    console.log("  ⚠️  Many exams under-stocked - run targeted bulk generation");
  }
  if (total >= 40000 && verified / total >= 0.15) {
    console.log("  ✅ Cache system healthy - continue monitoring");
  }

  console.log("\n" + "=".repeat(70));
  console.log("📅 Next Check: Run this script again in 7 days");
  console.log("=".repeat(70) + "\n");
}

checkHealth()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Health check failed:", err);
    process.exit(1);
  });
