#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { createClient } from '@libsql/client';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const result = await db.execute('SELECT topic_id, COUNT(*) as count FROM english_questions GROUP BY topic_id ORDER BY topic_id');
console.log('Questions by topic:');
result.rows.forEach(row => console.log('  ' + row.topic_id.padEnd(30) + ': ' + row.count + ' questions'));

const total = await db.execute('SELECT COUNT(*) as total FROM english_questions');
console.log('\nTotal questions:', total.rows[0].total);
process.exit(0);
