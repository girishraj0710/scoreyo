#!/usr/bin/env tsx
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { createClient } from '@libsql/client';

// Load environment variables
try {
  const envPath = resolve(process.cwd(), '.env.local');
  const envContent = readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
} catch (error) {
  console.error('⚠️  Could not load .env.local file');
}

async function check() {
  const db = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  console.log('📊 Checking dimensional model tables...\n');

  // Check fact_exam_questions
  try {
    const fact = await db.execute('SELECT COUNT(*) as count FROM fact_exam_questions');
    console.log(`fact_exam_questions: ${fact.rows[0].count} questions`);
  } catch (e) {
    console.log('fact_exam_questions: Table does not exist');
  }

  // Check exam_questions
  const exam = await db.execute('SELECT COUNT(*) as count FROM exam_questions');
  console.log(`exam_questions: ${exam.rows[0].count} questions`);

  // Check difference
  try {
    const fact = await db.execute('SELECT COUNT(*) as count FROM fact_exam_questions');
    const diff = Number(exam.rows[0].count) - Number(fact.rows[0].count);
    console.log(`\nDifference: ${diff} questions not in fact table`);
    console.log('\nThis explains why admin shows 42,095 (fact table)');
    console.log('But database has 45,937 (exam_questions table)');
  } catch (e) {}

  // Check recently added to exam_questions but not in fact table
  console.log('\n📊 Questions added in last 24 hours:');
  const recent = await db.execute(`
    SELECT source, COUNT(*) as count
    FROM exam_questions
    WHERE created_at > datetime('now', '-1 day')
    GROUP BY source
  `);
  recent.rows.forEach(row => {
    console.log(`  ${row.source}: ${row.count}`);
  });
}

check();
