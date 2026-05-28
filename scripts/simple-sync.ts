#!/usr/bin/env tsx
/**
 * Simple sync from exam_questions to fact_exam_questions
 * Uses topic_name to resolve topic_id
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

async function simpleSync() {
  console.log('🔄 Simple sync from exam_questions to fact_exam_questions...\n');

  const db = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  // Before counts
  const before = await db.execute('SELECT COUNT(*) as count FROM fact_exam_questions');
  console.log(`fact_exam_questions before: ${before.rows[0].count}\n`);

  // Get questions that don't exist in fact table
  const questions = await db.execute(`
    SELECT
      eq.topic,
      eq.question,
      eq.options,
      eq.correct_answer,
      eq.explanation,
      eq.difficulty,
      eq.source
    FROM exam_questions eq
    WHERE NOT EXISTS (
      SELECT 1 FROM fact_exam_questions fq
      WHERE fq.question = eq.question
    )
    LIMIT 5000
  `);

  console.log(`📦 Found ${questions.rows.length} questions to sync\n`);

  let synced = 0;
  let created = 0;

  for (const row of questions.rows) {
    try {
      // Find or create topic
      let topicResult = await db.execute({
        sql: 'SELECT id FROM dim_topics WHERE topic_name = ?',
        args: [row.topic],
      });

      let topicId: number;

      if (topicResult.rows.length === 0) {
        // Create new topic
        const insertTopic = await db.execute({
          sql: `INSERT INTO dim_topics (topic_name, category, scope)
                VALUES (?, 'general', 'universal')`,
          args: [row.topic],
        });
        topicId = Number(insertTopic.lastInsertRowid);
        created++;
      } else {
        topicId = Number(topicResult.rows[0].id);
      }

      // Insert into fact table
      await db.execute({
        sql: `
          INSERT INTO fact_exam_questions
          (topic_id, question, options, correct_answer, explanation, difficulty, source)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          topicId,
          row.question,
          row.options,
          row.correct_answer,
          row.explanation || 'No explanation provided',
          row.difficulty || 'medium',
          row.source || 'verified',
        ],
      });

      synced++;

      if (synced % 100 === 0) {
        console.log(`   ✅ Synced ${synced}/${questions.rows.length}...`);
      }

    } catch (error: any) {
      if (!error.message?.includes('UNIQUE constraint')) {
        console.log(`   ⚠️  Error: ${error.message.slice(0, 80)}`);
      }
    }
  }

  // After counts
  const after = await db.execute('SELECT COUNT(*) as count FROM fact_exam_questions');

  console.log('\n' + '='.repeat(60));
  console.log('✅ SYNC COMPLETE');
  console.log('='.repeat(60));
  console.log(`Questions synced: ${synced}`);
  console.log(`New topics created: ${created}`);
  console.log(`fact_exam_questions: ${before.rows[0].count} → ${after.rows[0].count} (+${Number(after.rows[0].count) - Number(before.rows[0].count)})`);
  console.log('='.repeat(60));
  console.log('\n✅ Your admin page should now show ' + after.rows[0].count + ' questions!\n');
}

simpleSync().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
