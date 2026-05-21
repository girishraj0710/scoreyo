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

// Top 20 with CORRECT exam IDs from src/lib/exams.ts
const TOP_20_FROM_CODE = [
  "jee-main", "neet-ug", "upsc-cse", "cat", "gate",
  "sbi-po", "ssc-cgl", "ibps-po", "kcet", "nda",
  "clat", "xat", "cds", "ibps-clerk", "ssc-chsl",
  "rrb-ntpc", "lic-aao", "delhi-police", "up-police", "ugc-net"
];

async function main() {
  console.log("\n📊 TOP 20 EXAM COVERAGE:\n");

  const results = [];
  for (const examId of TOP_20_FROM_CODE) {
    const result = await db.execute({
      sql: "SELECT COUNT(*) as count FROM exam_questions WHERE exam_id = ?",
      args: [examId],
    });
    const count = Number(result.rows[0]?.count || 0);
    results.push({ examId, count });
  }

  results.sort((a, b) => a.count - b.count);

  results.forEach(({ examId, count }) => {
    const status = count >= 1000 ? "✅" : "⚠️ ";
    console.log(`${status} ${examId.padEnd(20)} ${String(count).padStart(5)} questions`);
  });

  const needBoost = results.filter(r => r.count < 1000);
  console.log(`\n${needBoost.length} exams need boosting to 1000 questions`);
}

main().catch(console.error);
