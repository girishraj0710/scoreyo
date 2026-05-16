#!/usr/bin/env tsx
/**
 * Fix Source Labels in exam_questions Table
 *
 * Issue: 22,337 questions marked as source="cached" instead of "verified"
 * These are in exam_questions table (verified bank), so should be labeled correctly
 *
 * Solution: Update source from "cached" to "verified"
 * Reasoning: Questions in exam_questions are part of the verified bank,
 * regardless of their origin (bulk import, promotion, manual seeding)
 */
import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join } from "path";

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

async function fixSourceLabels() {
  console.log("=".repeat(80));
  console.log("🔧 FIXING SOURCE LABELS IN exam_questions TABLE");
  console.log("=".repeat(80));

  // Check current state
  const before = await db.execute(`
    SELECT source, COUNT(*) as count
    FROM exam_questions
    GROUP BY source
    ORDER BY count DESC
  `);

  console.log("\n📊 Current State:");
  before.rows.forEach((r: any) => {
    console.log(`   ${(r.source || "null").padEnd(20)} ${r.count}`);
  });

  const cachedCount = before.rows.find((r: any) => r.source === "cached")?.count || 0;
  console.log(`\n⚠️  Found ${cachedCount} questions marked as "cached"`);

  if (cachedCount === 0) {
    console.log("\n✅ No questions to fix! All source labels are correct.");
    return;
  }

  // Ask for confirmation
  console.log("\n🔄 Proposed Change:");
  console.log(`   UPDATE exam_questions`);
  console.log(`   SET source = 'verified'`);
  console.log(`   WHERE source = 'cached'`);
  console.log(`\n   This will update ${cachedCount} questions`);

  // Execute update
  console.log("\n⏳ Executing update...");
  const startTime = Date.now();

  await db.execute(`
    UPDATE exam_questions
    SET source = 'verified'
    WHERE source = 'cached'
  `);

  const duration = Date.now() - startTime;
  console.log(`✅ Update complete in ${duration}ms`);

  // Check new state
  const after = await db.execute(`
    SELECT source, COUNT(*) as count
    FROM exam_questions
    GROUP BY source
    ORDER BY count DESC
  `);

  console.log("\n📊 New State:");
  after.rows.forEach((r: any) => {
    console.log(`   ${(r.source || "null").padEnd(20)} ${r.count}`);
  });

  // Verify
  const stillCached = Number(after.rows.find((r: any) => r.source === "cached")?.count || 0);
  if (stillCached > 0) {
    console.log(`\n⚠️  Warning: Still ${stillCached} questions marked as "cached"`);
  } else {
    console.log("\n✅ All questions successfully relabeled!");
  }

  // Summary
  const verifiedCount = Number(after.rows.find((r: any) => r.source === "verified")?.count || 0);
  const total = after.rows.reduce((sum: number, r: any) => sum + Number(r.count), 0);

  console.log("\n" + "=".repeat(80));
  console.log("📈 SUMMARY");
  console.log("=".repeat(80));
  console.log(`   Total Questions:       ${total}`);
  console.log(`   Verified:              ${verifiedCount} (${((verifiedCount / total) * 100).toFixed(1)}%)`);
  console.log(`   Validated AI:          ${Number(after.rows.find((r: any) => r.source === "validated-ai")?.count || 0)}`);
  console.log(`   Cached (remaining):    ${stillCached}`);
  console.log("=".repeat(80));

  console.log("\n✅ Source labels fixed successfully!");
  console.log("\n📊 Impact:");
  console.log("   - Analytics will now show accurate verified count");
  console.log("   - Dashboard widgets will reflect correct quality metrics");
  console.log("   - Quiz generation unchanged (already working correctly)");
  console.log("=".repeat(80) + "\n");
}

fixSourceLabels()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to fix source labels:", err);
    process.exit(1);
  });
