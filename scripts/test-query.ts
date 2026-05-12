#!/usr/bin/env node
/**
 * Test direct query to verify database connection and data
 */

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
  console.log('Testing database queries...\n');

  // Test 1: letter-writing (should map to writing-skills)
  console.log('Test 1: letter-writing → writing-skills');
  const test1 = await client.execute({
    sql: "SELECT * FROM english_questions WHERE path_id = 'foundation' AND topic_id = 'writing-skills' AND level = 'intermediate' ORDER BY RANDOM() LIMIT 3",
    args: []
  });
  console.log(`  Found ${test1.rows.length} writing-skills questions`);
  if (test1.rows.length > 0) {
    console.log(`  Sample: ${test1.rows[0].question?.toString().substring(0, 60)}...`);
  }

  // Test 2: present-simple
  console.log('\nTest 2: present-simple');
  const test2 = await client.execute({
    sql: "SELECT * FROM english_questions WHERE path_id = 'foundation' AND topic_id = 'present-simple' AND level = 'intermediate' ORDER BY RANDOM() LIMIT 3",
    args: []
  });
  console.log(`  Found ${test2.rows.length} present-simple questions`);
  if (test2.rows.length > 0) {
    console.log(`  Sample: ${test2.rows[0].question?.toString().substring(0, 60)}...`);
  }

  // Test 3: daily-conversations in real-world path
  console.log('\nTest 3: daily-conversations in real-world');
  const test3 = await client.execute({
    sql: "SELECT * FROM english_questions WHERE path_id = 'real-world' AND topic_id = 'daily-conversations' LIMIT 3",
    args: []
  });
  console.log(`  Found ${test3.rows.length} daily-conversations questions`);
  if (test3.rows.length > 0) {
    console.log(`  Sample: ${test3.rows[0].question?.toString().substring(0, 60)}...`);
  }

  // Test 4: Count all questions
  console.log('\nTest 4: Total questions count');
  const test4 = await client.execute({
    sql: "SELECT COUNT(*) as total FROM english_questions",
    args: []
  });
  console.log(`  Total questions in database: ${test4.rows[0].total}`);

  console.log('\n✅ All tests complete!');
})();
