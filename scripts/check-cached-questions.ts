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

async function checkCachedQuestions() {
  console.log("\n📊 CHECKING cached_questions TABLE:");
  console.log("═".repeat(80));

  try {
    const total = await db.execute("SELECT COUNT(*) as count FROM cached_questions");
    console.log(`Total cached questions: ${total.rows[0].count}`);

    const byExam = await db.execute(`
      SELECT exam_id, COUNT(*) as count
      FROM cached_questions
      GROUP BY exam_id
      ORDER BY count DESC
    `);

    console.log("\nBreakdown by exam:");
    byExam.rows.forEach((row: any) => {
      console.log(`  ${row.exam_id}: ${row.count} questions`);
    });
  } catch (err: any) {
    console.log(`❌ Error: ${err.message}`);
  }

  process.exit(0);
}

checkCachedQuestions().catch(console.error);
