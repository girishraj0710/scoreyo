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
  const result = await client.execute("SELECT level, COUNT(*) as count FROM english_questions WHERE path_id = 'foundation' AND topic_id = 'reading-comprehension' GROUP BY level");
  console.log('Reading comprehension questions by level:');
  result.rows.forEach(row => console.log(`  ${row.level}: ${row.count}Q`));

  console.log('\nAll paths for reading-comprehension:');
  const result2 = await client.execute("SELECT path_id, level, COUNT(*) as count FROM english_questions WHERE topic_id = 'reading-comprehension' GROUP BY path_id, level");
  result2.rows.forEach(row => console.log(`  ${row.path_id} / ${row.level}: ${row.count}Q`));
})();
