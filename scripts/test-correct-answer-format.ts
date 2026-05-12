#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
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

import { getEnglishQuestions } from '../src/lib/db.js';

(async () => {
  console.log('Testing getEnglishQuestions format...\n');

  const questions = await getEnglishQuestions('foundation', 'writing-skills', 'intermediate', 2);

  console.log(`Retrieved ${questions.length} questions\n`);

  questions.forEach((q, idx) => {
    console.log(`Question ${idx + 1}:`);
    console.log(`  Has 'correctAnswer' field: ${q.correctAnswer !== undefined ? '✅' : '❌'}`);
    console.log(`  Has 'correct_answer' field: ${(q as any).correct_answer !== undefined ? '⚠️ SNAKE_CASE' : '✅'}`);
    console.log(`  correctAnswer value: ${q.correctAnswer}`);
    console.log(`  correctAnswer type: ${typeof q.correctAnswer}`);
    console.log(`  Options: ${q.options.length} options`);
    console.log(`  Correct option: "${q.options[q.correctAnswer]}"`);
    console.log('');
  });

  console.log('✅ Format test complete!');
  console.log('Frontend can now correctly validate: userAnswer === q.correctAnswer');
})();
