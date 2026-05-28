#!/usr/bin/env tsx
/**
 * Check actual question count in database
 */

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

async function checkCounts() {
  console.log('📊 Checking question counts in database...\n');

  const db = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  try {
    // Check exam_questions
    const examQs = await db.execute('SELECT COUNT(*) as count FROM exam_questions');
    console.log(`exam_questions table: ${examQs.rows[0].count} questions`);

    // Check by source
    const bySource = await db.execute(`
      SELECT source, COUNT(*) as count
      FROM exam_questions
      GROUP BY source
      ORDER BY count DESC
      LIMIT 10
    `);
    console.log('\nTop sources:');
    bySource.rows.forEach(row => {
      console.log(`  ${row.source}: ${row.count}`);
    });

    // Check NCERT questions specifically
    const ncert = await db.execute(`
      SELECT COUNT(*) as count
      FROM exam_questions
      WHERE source LIKE '%NCERT%'
    `);
    console.log(`\nNCERT questions: ${ncert.rows[0].count}`);

    // Check verified_questions table if it exists
    try {
      const verifiedQs = await db.execute('SELECT COUNT(*) as count FROM verified_questions');
      console.log(`\nverified_questions table: ${verifiedQs.rows[0].count} questions`);
    } catch (e) {
      console.log('\nverified_questions table: Does not exist or is empty');
    }

    // Check by exam_id
    const byExam = await db.execute(`
      SELECT exam_id, COUNT(*) as count
      FROM exam_questions
      GROUP BY exam_id
      ORDER BY count DESC
    `);
    console.log('\nBy exam:');
    byExam.rows.forEach(row => {
      console.log(`  ${row.exam_id}: ${row.count}`);
    });

    // Check by subject
    const bySubject = await db.execute(`
      SELECT subject_id, COUNT(*) as count
      FROM exam_questions
      GROUP BY subject_id
      ORDER BY count DESC
    `);
    console.log('\nBy subject:');
    bySubject.rows.forEach(row => {
      console.log(`  ${row.subject_id}: ${row.count}`);
    });

    // Check recently added (last 24 hours)
    const recent = await db.execute(`
      SELECT COUNT(*) as count
      FROM exam_questions
      WHERE created_at > datetime('now', '-1 day')
    `);
    console.log(`\nAdded in last 24 hours: ${recent.rows[0].count}`);

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

checkCounts();
