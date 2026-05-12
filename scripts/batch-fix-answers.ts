#!/usr/bin/env node
/**
 * Batch fix all suspicious questions identified by the scan
 */

import { createClient } from '@libsql/client';
import * as fs from 'fs';
import * as path from 'path';

// Load .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      process.env[match[1].trim()] = match[2].trim();
    }
  });
}

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function batchFixAnswers() {
  const suspiciousPath = path.join(process.cwd(), '.agents', 'artifacts', 'suspicious-questions.json');

  if (!fs.existsSync(suspiciousPath)) {
    console.log('❌ suspicious-questions.json not found. Run scan-all-questions.ts first.');
    return;
  }

  const suspicious = JSON.parse(fs.readFileSync(suspiciousPath, 'utf-8'));
  console.log(`🔧 Fixing ${suspicious.length} questions...\n`);

  let fixed = 0;
  let skipped = 0;

  for (const item of suspicious) {
    if (item.suspectedCorrect === undefined) {
      console.log(`⚠️ Question ${item.id}: No suspected correct answer, skipping`);
      skipped++;
      continue;
    }

    console.log(`Question ${item.id}:`);
    console.log(`  Current: [${item.correctAnswer}] "${item.correctOption}"`);
    console.log(`  Fixing to: [${item.suspectedCorrect}] "${item.suspectedOption}"`);

    try {
      await client.execute({
        sql: 'UPDATE english_questions SET correct_answer = ? WHERE id = ?',
        args: [item.suspectedCorrect, item.id]
      });

      console.log(`  ✅ Fixed\n`);
      fixed++;
    } catch (error) {
      console.log(`  ❌ Error: ${error}\n`);
    }
  }

  console.log(`\n📊 Batch Fix Summary:`);
  console.log(`   Total: ${suspicious.length}`);
  console.log(`   Fixed: ${fixed}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`\n✅ Done!`);
}

batchFixAnswers();
