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
  const result = await client.execute("SELECT DISTINCT path_id, topic_id, COUNT(*) as count FROM english_questions GROUP BY path_id, topic_id ORDER BY path_id, topic_id");

  console.log('All English questions by path:\n');

  let currentPath = '';
  result.rows.forEach(row => {
    if (row.path_id !== currentPath) {
      currentPath = row.path_id as string;
      console.log(`\n${currentPath.toUpperCase()}:`);
    }
    console.log(`  ${row.topic_id}: ${row.count}Q`);
  });
})();
