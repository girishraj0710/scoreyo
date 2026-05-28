#!/usr/bin/env tsx
/**
 * Monitor bulk generation progress
 * Run this periodically to check how generators are doing
 */

import { createClient } from "@libsql/client";
import { readFileSync } from "fs";

const env = readFileSync('.env.local', 'utf-8');
env.split('\n').forEach(line => {
  const m = line.match(/^([^=]+)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
});

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function monitor() {
  console.log('\n📊 BULK GENERATION MONITOR\n');
  console.log('='.repeat(80));

  // Overall stats
  const total = await db.execute('SELECT COUNT(*) as c FROM fact_exam_questions');
  const aiCached = await db.execute("SELECT COUNT(*) as c FROM fact_exam_questions WHERE source = 'ai-cached'");

  // Recent additions
  const last5min = await db.execute(`
    SELECT COUNT(*) as c FROM fact_exam_questions
    WHERE created_at > datetime('now', '-5 minutes')
  `);
  const last30min = await db.execute(`
    SELECT COUNT(*) as c FROM fact_exam_questions
    WHERE created_at > datetime('now', '-30 minutes')
  `);
  const last1hr = await db.execute(`
    SELECT COUNT(*) as c FROM fact_exam_questions
    WHERE created_at > datetime('now', '-1 hour')
  `);

  // Coverage breakdown
  const coverage = await db.execute(`
    SELECT
      CASE
        WHEN q_count = 0 THEN 'Zero'
        WHEN q_count < 10 THEN 'Critical (<10)'
        WHEN q_count < 30 THEN 'Low (10-29)'
        ELSE 'Good (30+)'
      END as category,
      COUNT(*) as topics
    FROM (
      SELECT COUNT(q.id) as q_count
      FROM bridge_exam_subject_topic b
      LEFT JOIN fact_exam_questions q ON q.topic_id = b.topic_id
      GROUP BY b.topic_id
    )
    GROUP BY category
    ORDER BY
      CASE category
        WHEN 'Zero' THEN 1
        WHEN 'Critical (<10)' THEN 2
        WHEN 'Low (10-29)' THEN 3
        ELSE 4
      END
  `);

  console.log('\n📈 Database Stats:');
  console.log(`   Total questions: ${total.rows[0].c}`);
  console.log(`   AI-cached: ${aiCached.rows[0].c}`);

  console.log('\n⚡ Recent Activity:');
  console.log(`   Last 5 min:  ${last5min.rows[0].c} questions`);
  console.log(`   Last 30 min: ${last30min.rows[0].c} questions`);
  console.log(`   Last 1 hour: ${last1hr.rows[0].c} questions`);

  const rate5 = Number(last5min.rows[0].c) / 5;
  const rate30 = Number(last30min.rows[0].c) / 30;
  const rate60 = Number(last1hr.rows[0].c) / 60;

  console.log('\n⏱️  Generation Rates:');
  console.log(`   Current (5min):  ~${Math.round(rate5)} Q/min (${Math.round(rate5 * 60)} Q/hour)`);
  console.log(`   Average (30min): ~${Math.round(rate30)} Q/min (${Math.round(rate30 * 60)} Q/hour)`);
  console.log(`   Average (1hr):   ~${Math.round(rate60)} Q/min (${Math.round(rate60 * 60)} Q/hour)`);

  console.log('\n📊 Topic Coverage:');
  coverage.rows.forEach(row => {
    console.log(`   ${row.category}: ${row.topics} topics`);
  });

  // Calculate remaining work
  const zeroCount = coverage.rows.find(r => r.category === 'Zero')?.topics || 0;
  const remaining = Number(zeroCount) * 20;
  const hoursLeft = remaining / (rate30 * 60);

  console.log('\n🎯 Estimates (based on 30min average):');
  console.log(`   Remaining work: ~${remaining} questions`);
  console.log(`   Time to complete: ~${hoursLeft.toFixed(1)} hours`);
  console.log(`   Cost estimate: $${(remaining * 0.00015).toFixed(2)}`);

  console.log('\n' + '='.repeat(80) + '\n');
}

monitor().catch(console.error);
