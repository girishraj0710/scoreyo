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
  const schema = await db.execute(`
    SELECT sql FROM sqlite_master 
    WHERE type='table' AND name='fact_exam_questions'
  `);
  
  console.log("\nfact_exam_questions schema:\n");
  console.log(schema.rows[0]?.sql || "Table not found");
  console.log();
}

checkSchema();
