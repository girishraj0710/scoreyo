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

// Key tables to verify for schema integrity
const CRITICAL_TABLES = [
  'exam_questions',         // Main question table (post-refactoring)
  'cached_questions',       // Legacy cache (read-only backup)
  'users',                  // User accounts
  'quiz_sessions',          // Quiz history
  'subscriptions',          // Payment/pro status
  'fact_exam_questions',    // Dimensional model (when enabled)
  'dim_topics',             // Dimensional model
  'dim_exams',              // Dimensional model
  'dim_subjects',           // Dimensional model
  'bridge_exam_subject_topic', // Dimensional model
];

async function check() {
  console.log("\n🔍 DATABASE SCHEMA VALIDATION\n");
  console.log("=".repeat(70));

  // Get all tables
  const allTables = await db.execute(
    "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
  );

  console.log(`\n📊 Total tables found: ${allTables.rows.length}`);

  // Check critical tables
  console.log("\n✅ Critical Tables Check:\n");
  const existingTables = new Set(allTables.rows.map(r => String(r.name)));

  let allPresent = true;
  for (const table of CRITICAL_TABLES) {
    const exists = existingTables.has(table);
    const status = exists ? '✅' : '❌';
    console.log(`  ${status} ${table}`);
    if (!exists && !table.startsWith('fact_') && !table.startsWith('dim_') && !table.startsWith('bridge_')) {
      // Only warn for non-dimensional tables (dimensional are optional)
      allPresent = false;
    }
  }

  // Check exam_questions has source field (critical for refactoring)
  console.log("\n🔧 Schema Validation - exam_questions:\n");
  const examQSchema = await db.execute(
    "SELECT sql FROM sqlite_master WHERE type='table' AND name='exam_questions'"
  );

  if (examQSchema.rows.length > 0) {
    const schemaSql = String(examQSchema.rows[0]?.sql || '');
    const hasSource = schemaSql.includes('source');
    const hasCreatedAt = schemaSql.includes('created_at');

    console.log(`  ✅ Table exists`);
    console.log(`  ${hasSource ? '✅' : '❌'} Has 'source' field (required for refactoring)`);
    console.log(`  ${hasCreatedAt ? '✅' : '❌'} Has 'created_at' field`);

    if (!hasSource) {
      console.log("\n  ⚠️  WARNING: exam_questions missing 'source' field!");
      console.log("     This is required for the cache refactoring.");
      allPresent = false;
    }
  } else {
    console.log(`  ❌ Table does NOT exist!`);
    allPresent = false;
  }

  // Show indexes
  console.log("\n📇 Indexes Check:\n");
  const indexes = await db.execute(
    "SELECT name, tbl_name FROM sqlite_master WHERE type='index' ORDER BY tbl_name, name"
  );

  const indexesByTable: Record<string, number> = {};
  for (const row of indexes.rows) {
    const table = String(row.tbl_name);
    indexesByTable[table] = (indexesByTable[table] || 0) + 1;
  }

  console.log(`  Total indexes: ${indexes.rows.length}`);
  for (const table of CRITICAL_TABLES) {
    if (existingTables.has(table)) {
      const count = indexesByTable[table] || 0;
      console.log(`    ${table}: ${count} indexes`);
    }
  }

  // Final verdict
  console.log("\n" + "=".repeat(70));
  if (allPresent) {
    console.log("✅ SCHEMA VALIDATION PASSED");
    console.log("   All critical tables and fields are present.");
  } else {
    console.log("❌ SCHEMA VALIDATION FAILED");
    console.log("   Some critical tables or fields are missing!");
    console.log("   Review the output above for details.");
  }
  console.log("=".repeat(70) + "\n");

  return allPresent;
}

check()
  .then((success) => process.exit(success ? 0 : 1))
  .catch((err) => {
    console.error("❌ Schema check failed:", err);
    process.exit(1);
  });
