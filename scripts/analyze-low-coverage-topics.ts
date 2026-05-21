#!/usr/bin/env tsx
import { createClient } from "@libsql/client";
import { readFileSync, writeFileSync } from "fs";
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

// Thresholds for question counts
const CRITICAL_THRESHOLD = 10; // < 10 questions = critical
const LOW_THRESHOLD = 30;      // < 30 questions = low
const TARGET_THRESHOLD = 50;   // 50+ questions = good

async function analyzeLowCoverage() {
  console.log("\n📊 LOW-COVERAGE TOPICS ANALYSIS\n");
  console.log("=".repeat(80));

  // Get question counts per topic
  const topicCounts = await db.execute(`
    SELECT
      exam_id,
      subject_id,
      topic,
      COUNT(*) as total_count,
      SUM(CASE WHEN source = 'verified' THEN 1 ELSE 0 END) as verified_count,
      SUM(CASE WHEN source IN ('ai-cached', 'ai-validated') THEN 1 ELSE 0 END) as ai_count
    FROM exam_questions
    GROUP BY exam_id, subject_id, topic
    ORDER BY total_count ASC, exam_id, subject_id
  `);

  const critical: any[] = [];
  const low: any[] = [];
  const good: any[] = [];

  for (const row of topicCounts.rows) {
    const count = Number(row.total_count);
    const data = {
      exam_id: String(row.exam_id),
      subject_id: String(row.subject_id),
      topic: String(row.topic),
      total: count,
      verified: Number(row.verified_count || 0),
      ai: Number(row.ai_count || 0),
    };

    if (count < CRITICAL_THRESHOLD) {
      critical.push(data);
    } else if (count < LOW_THRESHOLD) {
      low.push(data);
    } else {
      good.push(data);
    }
  }

  // Summary
  console.log(`\n📈 Coverage Summary:`);
  console.log(`   🔴 Critical (< ${CRITICAL_THRESHOLD}Q):  ${critical.length} topics`);
  console.log(`   🟡 Low (${CRITICAL_THRESHOLD}-${LOW_THRESHOLD}Q):       ${low.length} topics`);
  console.log(`   🟢 Good (${LOW_THRESHOLD}+Q):        ${good.length} topics`);
  console.log(`   📦 Total topics:       ${topicCounts.rows.length}`);

  // Show critical topics
  console.log(`\n🔴 CRITICAL TOPICS (Need immediate attention):\n`);
  console.log(`${'Exam'.padEnd(20)} ${'Subject'.padEnd(25)} ${'Topic'.padEnd(45)} ${'Total'.padEnd(8)} Ver  AI`);
  console.log("-".repeat(80));

  critical.slice(0, 50).forEach(t => {
    const exam = String(t.exam_id).padEnd(20);
    const subject = String(t.subject_id).substring(0, 24).padEnd(25);
    const topic = String(t.topic).substring(0, 44).padEnd(45);
    console.log(`${exam} ${subject} ${topic} ${String(t.total).padStart(5)}    ${String(t.verified).padStart(2)}   ${String(t.ai).padStart(2)}`);
  });

  if (critical.length > 50) {
    console.log(`\n   ... and ${critical.length - 50} more critical topics`);
  }

  // Show low topics (sample)
  console.log(`\n🟡 LOW TOPICS (Sample of ${Math.min(20, low.length)}):\n`);
  console.log(`${'Exam'.padEnd(20)} ${'Subject'.padEnd(25)} ${'Topic'.padEnd(45)} ${'Total'.padEnd(8)} Ver  AI`);
  console.log("-".repeat(80));

  low.slice(0, 20).forEach(t => {
    const exam = String(t.exam_id).padEnd(20);
    const subject = String(t.subject_id).substring(0, 24).padEnd(25);
    const topic = String(t.topic).substring(0, 44).padEnd(45);
    console.log(`${exam} ${subject} ${topic} ${String(t.total).padStart(5)}    ${String(t.verified).padStart(2)}   ${String(t.ai).padStart(2)}`);
  });

  // Top priority exams
  const examStats: Record<string, { critical: number; low: number; good: number }> = {};

  [...critical, ...low, ...good].forEach(t => {
    if (!examStats[t.exam_id]) {
      examStats[t.exam_id] = { critical: 0, low: 0, good: 0 };
    }

    if (t.total < CRITICAL_THRESHOLD) {
      examStats[t.exam_id].critical++;
    } else if (t.total < LOW_THRESHOLD) {
      examStats[t.exam_id].low++;
    } else {
      examStats[t.exam_id].good++;
    }
  });

  console.log(`\n📊 Priority Exams (Most critical topics):\n`);
  console.log(`${'Exam'.padEnd(20)} ${'Critical'.padEnd(12)} ${'Low'.padEnd(12)} ${'Good'.padEnd(12)} Priority`);
  console.log("-".repeat(80));

  const examPriority = Object.entries(examStats)
    .map(([exam, stats]) => ({
      exam,
      ...stats,
      priority: stats.critical * 10 + stats.low * 2,
    }))
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 20);

  examPriority.forEach(e => {
    console.log(
      `${String(e.exam).padEnd(20)} ${String(e.critical).padStart(8)}    ${String(e.low).padStart(8)}    ${String(e.good).padStart(8)}    ${e.priority}`
    );
  });

  // Export to JSON for import scripts
  const exportData = {
    generated_at: new Date().toISOString(),
    thresholds: {
      critical: CRITICAL_THRESHOLD,
      low: LOW_THRESHOLD,
      target: TARGET_THRESHOLD,
    },
    summary: {
      critical_topics: critical.length,
      low_topics: low.length,
      good_topics: good.length,
      total_topics: topicCounts.rows.length,
    },
    critical_topics: critical,
    low_topics: low,
    priority_exams: examPriority,
  };

  writeFileSync(
    'low-coverage-analysis.json',
    JSON.stringify(exportData, null, 2)
  );

  console.log(`\n✅ Analysis exported to: low-coverage-analysis.json`);
  console.log("=".repeat(80) + "\n");

  // Recommendations
  console.log("💡 RECOMMENDED ACTIONS:\n");
  console.log("1. Focus on critical topics first (< 10 questions)");
  console.log("2. Use AI generation for quick coverage: npx tsx scripts/bulk-generate-questions.ts");
  console.log("3. Import from verified sources where available");
  console.log("4. Target top priority exams: " + examPriority.slice(0, 5).map(e => e.exam).join(", "));
  console.log("\n");
}

analyzeLowCoverage().catch(console.error);
