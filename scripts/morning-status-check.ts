#!/usr/bin/env tsx
/**
 * Morning Status Check
 * Quick overview of overnight progress
 */

import { createClient } from "@libsql/client";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";

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
  console.log("=".repeat(80));
  console.log("🌅 MORNING STATUS CHECK");
  console.log("=".repeat(80));
  console.log("");

  // Database status
  const total = await db.execute({
    sql: "SELECT COUNT(*) as count FROM exam_questions",
    args: [],
  });

  const bySource = await db.execute({
    sql: `SELECT source, COUNT(*) as count
          FROM exam_questions
          GROUP BY source
          ORDER BY count DESC
          LIMIT 10`,
    args: [],
  });

  console.log("📊 DATABASE STATUS:");
  console.log(`   Total questions: ${total.rows[0].count}`);
  console.log("");
  console.log("   By Source:");
  bySource.rows.forEach((r: any) => {
    console.log(`   - ${r.source}: ${r.count}`);
  });

  // Process status
  console.log("");
  console.log("=".repeat(80));
  console.log("🔄 PROCESS STATUS:");
  console.log("=".repeat(80));

  try {
    const processes = execSync("ps aux | grep -E 'continuous-free-seeder|verified' | grep -v grep").toString();
    const lines = processes.trim().split('\n');
    console.log(`   Running processes: ${lines.length / 3} (${lines.length} total threads)`);

    if (lines.length >= 3) {
      console.log("   ✅ Ollama Free Seeder: RUNNING");
    } else {
      console.log("   ❌ Ollama Free Seeder: STOPPED");
    }

    if (lines.length >= 6) {
      console.log("   ✅ Verified Top 20: RUNNING");
    } else {
      console.log("   ❌ Verified Top 20: STOPPED");
    }
  } catch {
    console.log("   ❌ No processes running");
  }

  // Log file analysis
  console.log("");
  console.log("=".repeat(80));
  console.log("📝 LOG ANALYSIS:");
  console.log("=".repeat(80));

  if (existsSync("continuous-free-seeder-v2.log")) {
    try {
      const ollamaLog = execSync("tail -100 continuous-free-seeder-v2.log | grep 'Total session'").toString();
      const matches = ollamaLog.match(/Total session: (\d+)/g);
      if (matches && matches.length > 0) {
        const lastMatch = matches[matches.length - 1];
        const count = lastMatch.match(/\d+/);
        console.log(`   Ollama Free Seeder:`);
        console.log(`   - Questions inserted: ${count ? count[0] : 'unknown'}`);

        const rejected = execSync("grep -c 'Explanation too short' continuous-free-seeder-v2.log 2>/dev/null || echo 0").toString().trim();
        console.log(`   - Rejected (short explanation): ${rejected}`);

        const duplicates = execSync("grep -c 'duplicate found' continuous-free-seeder-v2.log 2>/dev/null || echo 0").toString().trim();
        console.log(`   - Rejected (duplicate): ${duplicates}`);
      }
    } catch (e) {
      console.log("   Ollama Free Seeder: Log analysis failed");
    }
  }

  if (existsSync("verified-v2.log")) {
    try {
      const verifiedLog = execSync("tail -100 verified-v2.log | grep 'Total session'").toString();
      const matches = verifiedLog.match(/Total session: (\d+)/g);
      if (matches && matches.length > 0) {
        const lastMatch = matches[matches.length - 1];
        const count = lastMatch.match(/\d+/);
        console.log(`   Verified Top 20:`);
        console.log(`   - Questions inserted: ${count ? count[0] : 'unknown'}`);

        const progress = execSync("tail -100 verified-v2.log | grep -E '\\[\\d+/\\d+\\]' | tail -1").toString().trim();
        if (progress) {
          console.log(`   - Progress: ${progress.substring(0, 20)}...`);
        }
      }
    } catch (e) {
      console.log("   Verified Top 20: Log analysis failed");
    }
  }

  console.log("");
  console.log("=".repeat(80));
  console.log("💡 QUICK ACTIONS:");
  console.log("=".repeat(80));
  console.log("");
  console.log("View full logs:");
  console.log("  tail -100 continuous-free-seeder-v2.log");
  console.log("  tail -100 verified-v2.log");
  console.log("");
  console.log("Check admin dashboard:");
  console.log("  http://localhost:3000/admin");
  console.log("");
  console.log("Stop processes:");
  console.log("  ps aux | grep -E 'continuous-free-seeder|verified' | grep -v grep | awk '{print $2}' | xargs kill");
  console.log("");
  console.log("=".repeat(80));
}

main();
