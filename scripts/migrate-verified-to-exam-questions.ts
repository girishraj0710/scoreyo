#!/usr/bin/env tsx
/**
 * Migrate questions from verified_questions to exam_questions table
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

async function migrate() {
  console.log('🔄 Migrating questions from verified_questions to exam_questions...\n');

  const db = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  try {
    // Check if verified_questions table exists
    const tables = await db.execute(`SELECT name FROM sqlite_master WHERE type='table' AND name='verified_questions'`);

    if (tables.rows.length === 0) {
      console.log('⚠️  verified_questions table does not exist. Nothing to migrate.');
      return;
    }

    // Get all questions from verified_questions
    const result = await db.execute('SELECT * FROM verified_questions');
    console.log(`📊 Found ${result.rows.length} questions to migrate\n`);

    if (result.rows.length === 0) {
      console.log('✅ No questions to migrate.');
      return;
    }

    let migrated = 0;
    let skipped = 0;

    for (const row of result.rows) {
      try {
        // Parse exam_relevance JSON to get exam_id
        const examRelevance = JSON.parse(row.exam_relevance as string || '[]');
        const examId = examRelevance[0]?.toLowerCase() || 'general';

        // Insert into exam_questions
        await db.execute({
          sql: `INSERT INTO exam_questions
                (exam_id, subject_id, topic, question, options, correct_answer,
                 explanation, difficulty, source, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            examId,
            row.subject,
            row.topic,
            row.question,
            row.options,
            row.correct_answer,
            row.explanation || 'No explanation provided',
            row.difficulty || 'medium',
            row.source || 'NCERT',
            row.created_at || new Date().toISOString(),
          ],
        });

        migrated++;
        console.log(`✅ Migrated: ${String(row.question).slice(0, 60)}...`);
      } catch (error: any) {
        if (error.message?.includes('UNIQUE constraint failed')) {
          skipped++;
        } else {
          console.error(`❌ Failed to migrate question ${row.id}:`, error.message);
        }
      }
    }

    console.log(`\n📊 Migration complete:`);
    console.log(`   Migrated: ${migrated}`);
    console.log(`   Skipped (duplicates): ${skipped}`);
    console.log(`   Total: ${result.rows.length}`);

    // Verify migration
    const count = await db.execute('SELECT COUNT(*) as count FROM exam_questions');
    console.log(`\n✅ exam_questions now has ${count.rows[0].count} total questions`);

  } catch (error: any) {
    console.error('❌ Migration error:', error.message);
    process.exit(1);
  }
}

migrate();
