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

async function compareTableCounts() {
  console.log("\n📊 QUESTION COUNT COMPARISON");
  console.log("═".repeat(80));

  // Legacy table
  const legacyCount = await db.execute("SELECT COUNT(*) as count FROM exam_questions");
  console.log(`\n1. exam_questions (legacy):      ${legacyCount.rows[0]?.count?.toLocaleString() || '0'}`);

  // Dimensional table
  try {
    const dimCount = await db.execute("SELECT COUNT(*) as count FROM fact_exam_questions");
    console.log(`2. fact_exam_questions (new):    ${dimCount.rows[0]?.count?.toLocaleString() || '0'}`);
  } catch (e) {
    console.log(`2. fact_exam_questions (new):    Table doesn't exist`);
  }

  // Cached questions
  try {
    const cachedCount = await db.execute("SELECT COUNT(*) as count FROM cached_questions");
    console.log(`3. cached_questions:             ${cachedCount.rows[0]?.count?.toLocaleString() || '0'}`);
  } catch (e) {
    console.log(`3. cached_questions:             Table doesn't exist`);
  }

  console.log("═".repeat(80));

  // Check for questions with invalid/orphaned topics
  console.log("\n🔍 DATA QUALITY CHECKS:");

  const emptyTopics = await db.execute(`
    SELECT COUNT(*) as count
    FROM exam_questions
    WHERE topic IS NULL OR topic = ''
  `);
  console.log(`   Questions with NULL/empty topic: ${emptyTopics.rows[0]?.count || 0}`);

  const invalidTopics = await db.execute(`
    SELECT COUNT(*) as count
    FROM exam_questions
    WHERE topic IN ('1', '2', 'E', 'E1', 'E2', '3', '4')
  `);
  console.log(`   Questions with invalid topic:    ${invalidTopics.rows[0]?.count || 0}`);

  // Check questions by source
  console.log("\n📈 QUESTIONS BY SOURCE:");
  const bySource = await db.execute(`
    SELECT source, COUNT(*) as count
    FROM exam_questions
    GROUP BY source
    ORDER BY count DESC
  `);

  for (const row of bySource.rows) {
    const source = String(row.source || 'unknown');
    const count = Number(row.count || 0);
    console.log(`   ${source.padEnd(25)} ${count.toLocaleString()}`);
  }

  console.log("═".repeat(80));
}

compareTableCounts().catch(console.error);
