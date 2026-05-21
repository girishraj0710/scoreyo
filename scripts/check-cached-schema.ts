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
  console.log("\n📋 CACHED_QUESTIONS SCHEMA:");
  console.log("═".repeat(80));

  const schema = await db.execute("PRAGMA table_info(cached_questions)");
  console.log("Columns:");
  schema.rows.forEach((row: any) => {
    console.log(`  ${row.name} (${row.type})`);
  });

  console.log("\n📋 Sample row:");
  const sample = await db.execute("SELECT * FROM cached_questions LIMIT 1");
  if (sample.rows.length > 0) {
    console.log(JSON.stringify(sample.rows[0], null, 2));
  }

  process.exit(0);
}

checkSchema().catch(console.error);
