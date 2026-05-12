#!/usr/bin/env node
import { createClient } from '@libsql/client';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
}

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

(async () => {
  console.log('Simulating listening-comprehension request:\n');

  // What the API receives
  const pathId = 'foundation';
  const topicId = 'listening-comprehension';
  const level = 'intermediate';

  console.log(`Input: pathId="${pathId}", topicId="${topicId}", level="${level}"`);

  // Mapping
  const mapping = 'reading-comprehension';
  console.log(`Mapping: "${topicId}" → "${mapping}"\n`);

  // Query 1: foundation path with mapped topic
  console.log('Query 1: foundation + reading-comprehension + intermediate');
  const q1 = await client.execute({
    sql: "SELECT * FROM english_questions WHERE path_id = ? AND topic_id = ? AND level = ? ORDER BY RANDOM() LIMIT ?",
    args: ['foundation', 'reading-comprehension', 'intermediate', 20]
  });
  console.log(`  Result: ${q1.rows.length} questions found`);

  if (q1.rows.length > 0) {
    console.log(`  ✅ SUCCESS! Sample question: ${q1.rows[0].question?.toString().substring(0, 80)}...`);
  } else {
    console.log(`  ❌ No questions found`);
  }
})();
