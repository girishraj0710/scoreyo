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
  const result = await client.execute("SELECT DISTINCT topic_id, COUNT(*) as count FROM english_questions WHERE path_id = 'foundation' GROUP BY topic_id ORDER BY topic_id");
  console.log('Available topics in foundation path:\n');
  result.rows.forEach(row => {
    console.log(`  - ${row.topic_id} (${row.count}Q)`);
  });

  // Check if letter-writing exists
  const letterWriting = await client.execute("SELECT COUNT(*) as count FROM english_questions WHERE path_id = 'foundation' AND topic_id LIKE '%letter%'");
  console.log(`\nLetter writing topics: ${letterWriting.rows[0].count}`);

  // Check for email or writing topics
  const writing = await client.execute("SELECT DISTINCT topic_id FROM english_questions WHERE path_id = 'foundation' AND (topic_id LIKE '%writing%' OR topic_id LIKE '%email%')");
  console.log('\nWriting-related topics:');
  writing.rows.forEach(row => {
    console.log(`  - ${row.topic_id}`);
  });
})();
