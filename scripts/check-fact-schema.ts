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

async function checkSchema() {
  console.log("📋 fact_exam_questions schema:");
  const schema = await db.execute("PRAGMA table_info(fact_exam_questions)");
  for (const col of schema.rows) {
    console.log(`  ${col.name} (${col.type})`);
  }

  console.log("\n📊 Current source values in fact_exam_questions:");
  const sources = await db.execute(`
    SELECT source, COUNT(*) as count
    FROM fact_exam_questions
    GROUP BY source
    ORDER BY count DESC
  `);
  for (const row of sources.rows) {
    console.log(`  ${row.source || 'NULL'}: ${row.count}`);
  }

  console.log("\n📊 Source values in cached_questions:");
  const cachedSources = await db.execute(`
    SELECT
      CASE
        WHEN question_json LIKE '%"source"%' THEN 'has-source'
        ELSE 'no-source'
      END as has_source,
      COUNT(*) as count
    FROM cached_questions
    GROUP BY has_source
  `);
  for (const row of cachedSources.rows) {
    console.log(`  ${row.has_source}: ${row.count}`);
  }
}

checkSchema().catch(console.error);
