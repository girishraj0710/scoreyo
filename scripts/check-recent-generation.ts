#!/usr/bin/env tsx
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

async function checkRecentGeneration() {
  // Check total ai-cached questions
  const total = await db.execute(`
    SELECT COUNT(*) as count
    FROM exam_questions
    WHERE source = 'ai-cached'
  `);
  console.log('📊 Total ai-cached questions in database:', total.rows[0].count);

  // Check recent generation
  const result = await db.execute(`
    SELECT COUNT(*) as count
    FROM exam_questions
    WHERE source = 'ai-cached'
    AND created_at > datetime('now', '-30 minutes')
  `);

  console.log('✅ Questions generated in last 30 minutes:', result.rows[0].count);

  if (Number(result.rows[0].count) > 0) {
    const byTopic = await db.execute(`
      SELECT topic, COUNT(*) as count
      FROM exam_questions
      WHERE source = 'ai-cached'
      AND created_at > datetime('now', '-30 minutes')
      GROUP BY topic
      ORDER BY count DESC
    `);

    console.log('\n📋 By topic:');
    byTopic.rows.forEach(row => {
      console.log(`   ${String(row.topic).padEnd(45)} ${row.count}Q`);
    });
  }
}

checkRecentGeneration().catch(console.error);
