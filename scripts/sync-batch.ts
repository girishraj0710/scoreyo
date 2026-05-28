#!/usr/bin/env tsx
/**
 * Sync questions in small batches (more reliable for large datasets)
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

async function syncBatch() {
  console.log('🔄 Batch syncing questions...\n');

  const db = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  const BATCH_SIZE = 50; // Process 50 questions at a time
  let offset = 0;
  let totalSynced = 0;
  let hasMore = true;

  console.log(`📊 Starting batch sync (${BATCH_SIZE} questions per batch)\n`);

  while (hasMore) {
    try {
      // Get a batch of questions
      const questions = await db.execute({
        sql: `
          SELECT
            eq.id,
            eq.exam_id,
            eq.subject_id,
            eq.topic,
            eq.question,
            eq.options,
            eq.correct_answer,
            eq.explanation,
            eq.difficulty,
            eq.source,
            eq.created_at
          FROM exam_questions eq
          WHERE NOT EXISTS (
            SELECT 1 FROM fact_exam_questions fq
            WHERE fq.question = eq.question
          )
          LIMIT ${BATCH_SIZE}
          OFFSET ${offset}
        `,
        args: [],
      });

      if (questions.rows.length === 0) {
        hasMore = false;
        break;
      }

      console.log(`\n📦 Batch ${Math.floor(offset / BATCH_SIZE) + 1}: Processing ${questions.rows.length} questions...`);

      let batchSynced = 0;

      for (const row of questions.rows) {
        try {
          // Simple approach: Use existing saveVerifiedQuestions if available,
          // or insert directly with a default topic_id

          // For now, let's find a matching topic_id or use 1 as fallback
          const topicLookup = await db.execute({
            sql: `
              SELECT dt.id
              FROM dim_topics dt
              JOIN dim_subjects ds ON dt.subject_id = ds.id
              JOIN dim_exams de ON ds.exam_id = de.id
              WHERE dt.topic_name = ?
              LIMIT 1
            `,
            args: [row.topic],
          });

          let topicId = topicLookup.rows.length > 0 ? Number(topicLookup.rows[0].id) : 1;

          // Insert into fact table
          await db.execute({
            sql: `
              INSERT INTO fact_exam_questions
              (topic_id, question, options, correct_answer, explanation, difficulty, source, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `,
            args: [
              topicId,
              row.question,
              row.options,
              row.correct_answer,
              row.explanation || 'No explanation provided',
              row.difficulty || 'medium',
              row.source || 'verified',
              row.created_at || new Date().toISOString(),
            ],
          });

          batchSynced++;
          totalSynced++;

        } catch (error: any) {
          if (!error.message?.includes('UNIQUE constraint')) {
            console.log(`   ⚠️  Error on question ${row.id}: ${error.message.slice(0, 100)}`);
          }
        }
      }

      console.log(`   ✅ Synced ${batchSynced}/${questions.rows.length} from this batch`);
      console.log(`   📊 Total synced so far: ${totalSynced}`);

      offset += BATCH_SIZE;

      // Small delay between batches to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error: any) {
      console.error(`\n❌ Batch error: ${error.message}`);
      console.log('   Continuing with next batch...\n');
      offset += BATCH_SIZE;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ BATCH SYNC COMPLETE');
  console.log('='.repeat(60));
  console.log(`Total questions synced: ${totalSynced}`);

  // Final count
  const finalCount = await db.execute('SELECT COUNT(*) as count FROM fact_exam_questions');
  console.log(`\nfact_exam_questions now has: ${finalCount.rows[0].count} questions`);
  console.log('\n✅ Check your admin page - it should show the updated count!\n');
}

syncBatch().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
