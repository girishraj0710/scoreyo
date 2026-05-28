#!/usr/bin/env tsx
/**
 * Sync questions from exam_questions to fact_exam_questions
 * Resolves topic_id from dimensional model and migrates questions
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

async function syncQuestions() {
  console.log('🔄 Syncing questions from exam_questions to fact_exam_questions...\n');

  const db = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  // Add retry logic for network issues
  async function executeWithRetry(query: any, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await db.execute(query);
      } catch (error: any) {
        if (i === maxRetries - 1) throw error;
        console.log(`   ⚠️  Retry ${i + 1}/${maxRetries} after error...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  try {
    // Get count before
    const beforeFact = await executeWithRetry('SELECT COUNT(*) as count FROM fact_exam_questions');
    const beforeExam = await executeWithRetry('SELECT COUNT(*) as count FROM exam_questions');

    console.log(`📊 Current state:`);
    console.log(`   exam_questions: ${beforeExam.rows[0].count}`);
    console.log(`   fact_exam_questions: ${beforeFact.rows[0].count}`);
    console.log(`   Difference: ${Number(beforeExam.rows[0].count) - Number(beforeFact.rows[0].count)}\n`);

    // Get all questions from exam_questions that need to be synced
    // We'll get questions that don't exist in fact_exam_questions
    const questions = await db.execute(`
      SELECT DISTINCT
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
        AND fq.correct_answer = eq.correct_answer
      )
      ORDER BY eq.created_at DESC
      LIMIT 5000
    `);

    console.log(`📦 Found ${questions.rows.length} questions to sync\n`);

    if (questions.rows.length === 0) {
      console.log('✅ All questions are already synced!');
      return;
    }

    let synced = 0;
    let skipped = 0;
    let errors = 0;
    const errorDetails: string[] = [];

    for (const row of questions.rows) {
      try {
        // Resolve topic_id from dim_topics
        // First, try to find the topic by matching exam_id, subject_id, and topic name
        const topicLookup = await db.execute({
          sql: `
            SELECT dt.id as topic_id
            FROM dim_topics dt
            JOIN dim_subjects ds ON dt.subject_id = ds.id
            JOIN dim_exams de ON ds.exam_id = de.id
            WHERE de.exam_id = ?
            AND ds.subject_id = ?
            AND dt.topic_name = ?
            LIMIT 1
          `,
          args: [row.exam_id, row.subject_id, row.topic],
        });

        let topicId: number;

        if (topicLookup.rows.length > 0) {
          // Found existing topic
          topicId = Number(topicLookup.rows[0].topic_id);
        } else {
          // Topic doesn't exist in dimensional model - need to create it
          // First, get or create exam
          let examResult = await db.execute({
            sql: 'SELECT id FROM dim_exams WHERE exam_id = ?',
            args: [row.exam_id],
          });

          let examDimId: number;
          if (examResult.rows.length === 0) {
            // Create exam
            const insertExam = await db.execute({
              sql: 'INSERT INTO dim_exams (exam_id, exam_name) VALUES (?, ?)',
              args: [row.exam_id, row.exam_id.toUpperCase()],
            });
            examDimId = Number(insertExam.lastInsertRowid);
          } else {
            examDimId = Number(examResult.rows[0].id);
          }

          // Get or create subject
          let subjectResult = await db.execute({
            sql: 'SELECT id FROM dim_subjects WHERE exam_id = ? AND subject_id = ?',
            args: [examDimId, row.subject_id],
          });

          let subjectDimId: number;
          if (subjectResult.rows.length === 0) {
            // Create subject
            const insertSubject = await db.execute({
              sql: 'INSERT INTO dim_subjects (exam_id, subject_id, subject_name) VALUES (?, ?, ?)',
              args: [examDimId, row.subject_id, row.subject_id],
            });
            subjectDimId = Number(insertSubject.lastInsertRowid);
          } else {
            subjectDimId = Number(subjectResult.rows[0].id);
          }

          // Create topic
          const insertTopic = await db.execute({
            sql: 'INSERT INTO dim_topics (subject_id, topic_name, topic_order) VALUES (?, ?, 999)',
            args: [subjectDimId, row.topic],
          });
          topicId = Number(insertTopic.lastInsertRowid);
        }

        // Now insert into fact_exam_questions
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
            row.explanation,
            row.difficulty || 'medium',
            row.source || 'verified',
            row.created_at || new Date().toISOString(),
          ],
        });

        synced++;
        if (synced % 100 === 0) {
          console.log(`   ✅ Synced ${synced}/${questions.rows.length}...`);
        }

      } catch (error: any) {
        if (error.message?.includes('UNIQUE constraint failed')) {
          skipped++;
        } else {
          errors++;
          const errorMsg = `Question ${row.id}: ${error.message}`;
          if (errorDetails.length < 10) {
            errorDetails.push(errorMsg);
          }
        }
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 SYNC COMPLETE');
    console.log('='.repeat(60));
    console.log(`Total questions processed: ${questions.rows.length}`);
    console.log(`✅ Synced: ${synced}`);
    console.log(`⏭️  Skipped (duplicates): ${skipped}`);
    console.log(`❌ Errors: ${errors}`);

    if (errorDetails.length > 0) {
      console.log('\nFirst 10 errors:');
      errorDetails.forEach(err => console.log(`  ${err}`));
    }

    // Get count after
    const afterFact = await db.execute('SELECT COUNT(*) as count FROM fact_exam_questions');
    console.log(`\n📊 New state:`);
    console.log(`   fact_exam_questions: ${afterFact.rows[0].count} (+${Number(afterFact.rows[0].count) - Number(beforeFact.rows[0].count)})`);
    console.log('='.repeat(60));

    console.log('\n✅ Admin page should now show the updated count!');
    console.log(`   Expected admin count: ${afterFact.rows[0].count}\n`);

  } catch (error: any) {
    console.error('❌ Fatal error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

syncQuestions();
