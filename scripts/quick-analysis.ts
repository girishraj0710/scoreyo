#!/usr/bin/env tsx
import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join } from "path";

const envFile = readFileSync(join(process.cwd(), ".env.local"), "utf-8");
envFile.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const [, key, value] = match;
    process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
  }
});

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function analyze() {
  console.log("\n📊 QUICK COVERAGE ANALYSIS");
  console.log("=".repeat(80));

  // Count topics by question range
  const result = await db.execute(`
    SELECT
      CASE
        WHEN cnt = 0 THEN 'Empty (0)'
        WHEN cnt < 20 THEN 'Critical (<20)'
        WHEN cnt < 50 THEN 'Low (20-50)'
        WHEN cnt < 100 THEN 'Medium (50-100)'
        ELSE 'Good (100+)'
      END as category,
      COUNT(*) as topic_count
    FROM (
      SELECT exam_id, subject_id, topic, COUNT(*) as cnt
      FROM exam_questions
      GROUP BY exam_id, subject_id, topic
    )
    GROUP BY category
    ORDER BY
      CASE category
        WHEN 'Empty (0)' THEN 1
        WHEN 'Critical (<20)' THEN 2
        WHEN 'Low (20-50)' THEN 3
        WHEN 'Medium (50-100)' THEN 4
        ELSE 5
      END
  `);

  console.log("\nCurrent Coverage:");
  result.rows.forEach((row: any) => {
    console.log(`  ${row.category.padEnd(20)} ${row.topic_count} topics`);
  });

  // Calculate cost estimate
  const emptyCount = Number(result.rows.find((r: any) => r.category === 'Empty (0)')?.topic_count || 0);
  const criticalCount = Number(result.rows.find((r: any) => r.category === 'Critical (<20)')?.topic_count || 0);
  const lowCount = Number(result.rows.find((r: any) => r.category === 'Low (20-50)')?.topic_count || 0);

  console.log("\n" + "=".repeat(80));
  console.log("📈 OPTIMIZED SEEDING PLAN:");
  console.log("=".repeat(80));
  console.log(`Empty topics:      ${emptyCount} × 30 Q = ${emptyCount * 30} questions`);
  console.log(`Critical topics:   ${criticalCount} × 20 Q = ${criticalCount * 20} questions`);
  console.log(`Low topics:        ${lowCount} × 10 Q = ${lowCount * 10} questions`);
  console.log(`─`.repeat(80));
  console.log(`TOTAL TARGET:      ${emptyCount * 30 + criticalCount * 20 + lowCount * 10} new questions`);

  const totalAPICalls =
    emptyCount * (30 / 5) +   // 30 questions ÷ 5 per call
    criticalCount * (20 / 5) + // 20 questions ÷ 5 per call
    lowCount * (10 / 5);       // 10 questions ÷ 5 per call

  console.log(`\nEstimated API calls: ${totalAPICalls}`);
  console.log(`Estimated cost: $${(totalAPICalls * 0.003).toFixed(2)}`);
  console.log(`Time estimate: ${Math.ceil(totalAPICalls / 10 * 1.5)} minutes`);
  console.log("=".repeat(80));

  process.exit(0);
}

analyze().catch(console.error);
