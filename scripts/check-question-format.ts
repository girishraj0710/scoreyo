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
  const result = await client.execute("SELECT question, options, correct_answer, difficulty FROM english_questions WHERE path_id = 'foundation' AND topic_id = 'writing-skills' LIMIT 1");
  const row = result.rows[0];

  console.log('Sample question from DB:\n');
  console.log('Question:', row.question?.toString().substring(0, 80) + '...');
  console.log('\nOptions (raw):', row.options);
  console.log('Options (type):', typeof row.options);

  const parsedOptions = typeof row.options === 'string' ? JSON.parse(row.options as string) : row.options;
  console.log('\nOptions (parsed):', parsedOptions);

  console.log('\nCorrect Answer:', row.correct_answer);
  console.log('Correct Answer (type):', typeof row.correct_answer);
  console.log('\nExpected correct option:', parsedOptions[row.correct_answer as number]);
})();
