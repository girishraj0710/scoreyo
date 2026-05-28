/**
 * FAST MIGRATION: exam_questions → fact_exam_questions
 * Uses batch operations and caching to speed up migration
 */

import { createClient } from "@libsql/client";
import { readFileSync } from 'fs';

// Load env
const envContent = readFileSync('.env.local', 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const client = createClient({
  url: envVars.TURSO_DATABASE_URL,
  authToken: envVars.TURSO_AUTH_TOKEN,
});

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║   FAST MIGRATION: exam_questions → fact_exam_questions    ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

async function fastMigrate() {
  try {
    // Count
    const oldResult = await client.execute('SELECT COUNT(*) as count FROM exam_questions');
    const oldCount = oldResult.rows[0].count;
    const newResult = await client.execute('SELECT COUNT(*) as count FROM fact_exam_questions');
    const newCount = newResult.rows[0].count;

    console.log(`📊 Current state:`);
    console.log(`   Old: ${oldCount} | New: ${newCount} | Gap: ${oldCount - newCount}\n`);

    if (oldCount <= newCount) {
      console.log('✅ Migration complete! New table has all questions.\n');
      return;
    }

    // Load all at once
    console.log('📥 Loading all questions...');
    const oldQuestions = await client.execute('SELECT * FROM exam_questions');
    console.log(`   Loaded ${oldQuestions.rows.length}\n`);

    // Pre-load all dimensions to cache
    console.log('🗂️  Caching dimensions...');
    const exams = await client.execute('SELECT id, exam_code FROM dim_exams');
    const subjects = await client.execute('SELECT id, subject_code FROM dim_subjects');
    const topics = await client.execute('SELECT id, topic_name FROM dim_topics');
    const existing = await client.execute('SELECT topic_id, question FROM fact_exam_questions');

    const examMap = new Map(exams.rows.map(r => [r.exam_code, r.id]));
    const subjectMap = new Map(subjects.rows.map(r => [r.subject_code, r.id]));
    const topicMap = new Map(topics.rows.map(r => [r.topic_name, r.id]));
    const existingSet = new Set(existing.rows.map(r => `${r.topic_id}:${r.question}`));

    console.log(`   ${examMap.size} exams, ${subjectMap.size} subjects, ${topicMap.size} topics cached\n`);

    console.log('🔄 Processing...');
    let migrated = 0, skipped = 0, errors = 0;
    const batch = [];
    const BATCH_SIZE = 100;

    for (const q of oldQuestions.rows) {
      try {
        // Get/create dimensions
        let examId = examMap.get(q.exam_id);
        if (!examId) {
          await client.execute('INSERT INTO dim_exams (exam_code, exam_name, category) VALUES (?, ?, ?)',
            [q.exam_id, q.exam_id, 'migrated']);
          const r = await client.execute('SELECT id FROM dim_exams WHERE exam_code = ?', [q.exam_id]);
          examId = r.rows[0].id;
          examMap.set(q.exam_id, examId);
        }

        let subjectId = subjectMap.get(q.subject_id);
        if (!subjectId) {
          await client.execute('INSERT INTO dim_subjects (subject_code, subject_name) VALUES (?, ?)',
            [q.subject_id, q.subject_id]);
          const r = await client.execute('SELECT id FROM dim_subjects WHERE subject_code = ?', [q.subject_id]);
          subjectId = r.rows[0].id;
          subjectMap.set(q.subject_id, subjectId);
        }

        let topicId = topicMap.get(q.topic);
        if (!topicId) {
          await client.execute('INSERT INTO dim_topics (topic_name, category, scope) VALUES (?, ?, ?)',
            [q.topic, 'migrated', 'universal']);
          const r = await client.execute('SELECT id FROM dim_topics WHERE topic_name = ?', [q.topic]);
          topicId = r.rows[0].id;
          topicMap.set(q.topic, topicId);
        }

        // Create bridge
        await client.execute('INSERT OR IGNORE INTO bridge_exam_subject_topic (exam_id, subject_id, topic_id) VALUES (?, ?, ?)',
          [examId, subjectId, topicId]);

        // Skip if exists
        const key = `${topicId}:${q.question}`;
        if (existingSet.has(key)) {
          skipped++;
          continue;
        }

        // Add to batch
        batch.push({
          sql: `INSERT INTO fact_exam_questions (topic_id, question, options, correct_answer, explanation, difficulty, source, valid_from, valid_until) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [topicId, q.question, q.options, q.correct_answer, q.explanation, q.difficulty || 'medium', q.source || 'migrated', q.valid_from || 2026, q.valid_until]
        });

        existingSet.add(key);

        if (batch.length >= BATCH_SIZE) {
          await client.batch(batch, 'write');
          migrated += batch.length;
          batch.length = 0;
          process.stdout.write(`\r   Migrated: ${migrated} | Skipped: ${skipped}`);
        }

      } catch (err) {
        errors++;
      }
    }

    // Final batch
    if (batch.length > 0) {
      await client.batch(batch, 'write');
      migrated += batch.length;
    }

    const finalResult = await client.execute('SELECT COUNT(*) as count FROM fact_exam_questions');
    const finalCount = finalResult.rows[0].count;

    console.log(`\n\n╔════════════════════════════════════════════════════════════╗`);
    console.log(`║                 MIGRATION COMPLETE                         ║`);
    console.log(`╚════════════════════════════════════════════════════════════╝\n`);
    console.log(`📊 Summary:`);
    console.log(`   ✅ Migrated: ${migrated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log(`   📦 Total in fact_exam_questions: ${finalCount}\n`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

fastMigrate().then(() => process.exit(0)).catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
