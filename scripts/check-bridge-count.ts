#!/usr/bin/env tsx
import { createClient } from "@libsql/client";
import { readFileSync } from "fs";

const env = readFileSync('.env.local', 'utf-8');
env.split('\n').forEach(line => {
  const m = line.match(/^([^=]+)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
});

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function check() {
  const b = await db.execute('SELECT COUNT(*) as c FROM bridge_exam_subject_topic');
  console.log('Bridge entries:', b.rows[0].c);
}

check();
