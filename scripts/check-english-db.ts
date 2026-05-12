#!/usr/bin/env node
/**
 * Check English question database stats
 */

import { createClient } from '@libsql/client';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
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

async function checkStats() {
  console.log('📊 English Question Bank Statistics\n');

  // Total count
  const total = await client.execute('SELECT COUNT(*) as count FROM english_questions');
  console.log(`Total Questions: ${total.rows[0].count}\n`);

  // By topic
  const byTopic = await client.execute(`
    SELECT topic_id, COUNT(*) as count
    FROM english_questions
    GROUP BY topic_id
    ORDER BY count DESC
  `);

  console.log('By Topic:');
  byTopic.rows.forEach(row => {
    console.log(`  ${row.topic_id}: ${row.count}Q`);
  });

  // By level
  const byLevel = await client.execute(`
    SELECT level, COUNT(*) as count
    FROM english_questions
    GROUP BY level
    ORDER BY count DESC
  `);

  console.log('\nBy Level:');
  byLevel.rows.forEach(row => {
    console.log(`  ${row.level}: ${row.count}Q`);
  });

  // By difficulty
  const byDiff = await client.execute(`
    SELECT difficulty, COUNT(*) as count
    FROM english_questions
    GROUP BY difficulty
    ORDER BY count DESC
  `);

  console.log('\nBy Difficulty:');
  byDiff.rows.forEach(row => {
    console.log(`  ${row.difficulty}: ${row.count}Q`);
  });
}

checkStats()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
