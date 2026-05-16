#!/usr/bin/env tsx
/**
 * Add Analytics Columns to quiz_sessions
 *
 * Adds:
 * - source_stats TEXT: Tracks question sources (verified vs cached vs AI)
 * - sprint_id TEXT: Tracks sprint participation
 *
 * Usage: npx tsx scripts/add-analytics-columns.ts
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

async function migrate() {
  console.log("\n" + "=".repeat(70));
  console.log("📊 Adding Analytics Columns to quiz_sessions");
  console.log("=".repeat(70) + "\n");

  try {
    // Check current schema
    const schema = await db.execute("PRAGMA table_info(quiz_sessions)");
    const hasSourceStats = schema.rows.some((r: any) => r.name === 'source_stats');
    const hasSprintId = schema.rows.some((r: any) => r.name === 'sprint_id');

    // Add source_stats column
    if (!hasSourceStats) {
      console.log("Adding source_stats column...");
      await db.execute(`
        ALTER TABLE quiz_sessions
        ADD COLUMN source_stats TEXT
      `);
      console.log("✅ source_stats column added");
    } else {
      console.log("✅ source_stats column already exists");
    }

    // Add sprint_id column
    if (!hasSprintId) {
      console.log("Adding sprint_id column...");
      await db.execute(`
        ALTER TABLE quiz_sessions
        ADD COLUMN sprint_id TEXT
      `);
      console.log("✅ sprint_id column added");
    } else {
      console.log("✅ sprint_id column already exists");
    }

    // Verify
    console.log("\n📋 Verifying new schema...\n");
    const newSchema = await db.execute("PRAGMA table_info(quiz_sessions)");
    newSchema.rows.forEach((r: any) => {
      const isNew = r.name === 'source_stats' || r.name === 'sprint_id';
      console.log(`  ${isNew ? '✨' : '  '} ${r.name} (${r.type})`);
    });

    console.log("\n" + "=".repeat(70));
    console.log("✅ Migration Complete!");
    console.log("=".repeat(70) + "\n");

    console.log("📝 Next Steps:");
    console.log("1. Update quiz submit API to save source_stats");
    console.log("2. Create analytics endpoint to query performance");
    console.log("3. Add dashboard widget showing cache hit rates\n");

  } catch (error: any) {
    console.error("\n❌ Migration failed:", error.message);
    process.exit(1);
  }
}

migrate().then(() => process.exit(0));
