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
  console.log('Testing Active & Passive Voice topic...\n');

  const pathId = 'foundation';
  const topicId = 'active-passive-voice';
  const level = 'intermediate';

  console.log(`Input: pathId="${pathId}", topicId="${topicId}", level="${level}"`);

  // Apply mapping
  const mappedTopicId = 'sentence-structure';
  console.log(`Mapping: "${topicId}" → "${mappedTopicId}"\n`);

  // Try foundation path
  console.log('Query 1: foundation + sentence-structure + intermediate');
  const q1 = await client.execute({
    sql: "SELECT * FROM english_questions WHERE path_id = ? AND topic_id = ? AND level = ? ORDER BY RANDOM() LIMIT ?",
    args: ['foundation', 'sentence-structure', 'intermediate', 20]
  });
  console.log(`  Result: ${q1.rows.length} questions`);
  if (q1.rows.length > 0) {
    console.log(`  ✅ Sample: ${q1.rows[0].question?.toString().substring(0, 80)}...`);
  }

  // Try beginner
  console.log('\nQuery 2: foundation + sentence-structure + beginner');
  const q2 = await client.execute({
    sql: "SELECT * FROM english_questions WHERE path_id = ? AND topic_id = ? AND level = ? ORDER BY RANDOM() LIMIT ?",
    args: ['foundation', 'sentence-structure', 'beginner', 20]
  });
  console.log(`  Result: ${q2.rows.length} questions`);
  if (q2.rows.length > 0) {
    console.log(`  ✅ Sample: ${q2.rows[0].question?.toString().substring(0, 80)}...`);
  }

  // Try advanced
  console.log('\nQuery 3: foundation + sentence-structure + advanced');
  const q3 = await client.execute({
    sql: "SELECT * FROM english_questions WHERE path_id = ? AND topic_id = ? AND level = ? ORDER BY RANDOM() LIMIT ?",
    args: ['foundation', 'sentence-structure', 'advanced', 20]
  });
  console.log(`  Result: ${q3.rows.length} questions`);
  if (q3.rows.length > 0) {
    console.log(`  ✅ Sample: ${q3.rows[0].question?.toString().substring(0, 80)}...`);
  }

  const total = q1.rows.length + q2.rows.length + q3.rows.length;
  console.log(`\nTotal questions available: ${total}`);

  if (total > 0) {
    console.log('✅ Questions should be available!');
  } else {
    console.log('❌ No questions found - this would cause the error');
  }
})();
