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
  const pyqCount = await db.execute({
    sql: "SELECT COUNT(*) as count FROM exam_questions WHERE source LIKE 'pyq-%'",
    args: [],
  });

  const byExam = await db.execute({
    sql: "SELECT source, COUNT(*) as count FROM exam_questions WHERE source LIKE 'pyq-%' GROUP BY source ORDER BY count DESC",
    args: [],
  });

  console.log("\n" + "=".repeat(60));
  console.log("📚 PYQ (Past Year Questions) Status");
  console.log("=".repeat(60));
  console.log(`\nTotal PYQs imported: ${pyqCount.rows[0].count}`);

  if (byExam.rows.length > 0) {
    console.log("\nBy Exam & Year:");
    byExam.rows.forEach((r: any) => {
      console.log(`  ${r.source.padEnd(30)} ${r.count} questions`);
    });
  } else {
    console.log("\n⚠️  No PYQs imported yet");
    console.log("\nGet started:");
    console.log("  npx tsx scripts/import-pyq.ts pyq-templates/sample.csv");
  }

  console.log("\n" + "=".repeat(60));
}

main();
