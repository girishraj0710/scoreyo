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

async function main() {
  const result = await db.execute({
    sql: `SELECT exam_id, COUNT(*) as count
          FROM exam_questions
          GROUP BY exam_id
          ORDER BY count ASC`,
    args: [],
  });

  console.log("\n📊 EXAM COVERAGE REPORT");
  console.log("=".repeat(80));
  console.log("\nExams sorted by question count (lowest first):\n");
  
  result.rows.forEach((row: any) => {
    console.log(`${String(row.exam_id).padEnd(30)} ${String(row.count).padStart(6)} questions`);
  });
  
  console.log("\n" + "=".repeat(80));
  console.log(`Total exams: ${result.rows.length}`);
  console.log(`Lowest: ${result.rows[0]?.exam_id} (${result.rows[0]?.count})`);
  console.log(`Highest: ${result.rows[result.rows.length - 1]?.exam_id} (${result.rows[result.rows.length - 1]?.count})`);
}

main().catch(console.error);
