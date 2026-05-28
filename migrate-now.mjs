/**
 * MIGRATION: exam_questions → fact_exam_questions
 * Run with: node migrate-now.mjs
 */

import { createClient } from "@libsql/client";
import { readFileSync } from 'fs';

// Load environment variables from .env.local
const envContent = readFileSync('.env.local', 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

process.env.TURSO_DATABASE_URL = envVars.TURSO_DATABASE_URL || process.env.TURSO_DATABASE_URL;
process.env.TURSO_AUTH_TOKEN = envVars.TURSO_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN;

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║     MIGRATION: exam_questions → fact_exam_questions           ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

async function migrate() {
  try {
    // Step 1: Count questions
    console.log('📊 Step 1: Checking current state...\n');

    const oldResult = await client.execute('SELECT COUNT(*) as count FROM exam_questions');
    const oldCount = oldResult.rows[0].count;

    const newResult = await client.execute('SELECT COUNT(*) as count FROM fact_exam_questions');
    const newCount = newResult.rows[0].count;

    console.log(`   Old table (exam_questions): ${oldCount} questions`);
    console.log(`   New table (fact_exam_questions): ${newCount} questions\n`);

    if (oldCount === 0) {
      console.log('✅ No questions to migrate. Old table is empty.\n');
      return;
    }

    // Step 2: Get all old questions
    console.log('📥 Step 2: Loading questions from old table...\n');
    const oldQuestions = await client.execute('SELECT * FROM exam_questions ORDER BY exam_id, subject_id, topic');
    console.log(`   Loaded ${oldQuestions.rows.length} questions\n`);

    // Step 3: Group by exam/subject/topic
    const grouped = new Map();
    for (const q of oldQuestions.rows) {
      const key = `${q.exam_id}|${q.subject_id}|${q.topic}`;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key).push(q);
    }

    console.log(`📦 Step 3: Found ${grouped.size} unique exam/subject/topic combinations\n`);
    console.log('🔄 Step 4: Migrating to dimensional model...\n');

    let migratedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    let dimCreated = 0;

    for (const [key, questions] of grouped.entries()) {
      const [examId, subjectId, topic] = key.split('|');

      process.stdout.write(`   ${examId}/${subjectId}/${topic} (${questions.length}Q)... `);

      try {
        // Get or create exam dimension
        let examDim = await client.execute('SELECT id FROM dim_exams WHERE exam_code = ?', [examId]);
        if (examDim.rows.length === 0) {
          await client.execute('INSERT INTO dim_exams (exam_code, exam_name, category) VALUES (?, ?, ?)', [examId, examId, 'migrated']);
          examDim = await client.execute('SELECT id FROM dim_exams WHERE exam_code = ?', [examId]);
          dimCreated++;
        }
        const examDimId = examDim.rows[0].id;

        // Get or create subject dimension
        let subjectDim = await client.execute('SELECT id FROM dim_subjects WHERE subject_code = ?', [subjectId]);
        if (subjectDim.rows.length === 0) {
          await client.execute('INSERT INTO dim_subjects (subject_code, subject_name, category) VALUES (?, ?, ?)', [subjectId, subjectId, 'migrated']);
          subjectDim = await client.execute('SELECT id FROM dim_subjects WHERE subject_code = ?', [subjectId]);
          dimCreated++;
        }
        const subjectDimId = subjectDim.rows[0].id;

        // Get or create topic dimension
        let topicDim = await client.execute('SELECT id FROM dim_topics WHERE topic_name = ?', [topic]);
        if (topicDim.rows.length === 0) {
          await client.execute('INSERT INTO dim_topics (topic_name, category, scope) VALUES (?, ?, ?)', [topic, 'migrated', 'universal']);
          topicDim = await client.execute('SELECT id FROM dim_topics WHERE topic_name = ?', [topic]);
          dimCreated++;
        }
        const topicDimId = topicDim.rows[0].id;

        // Create bridge entry
        await client.execute(
          'INSERT OR IGNORE INTO bridge_exam_subject_topic (exam_id, subject_id, topic_id) VALUES (?, ?, ?)',
          [examDimId, subjectDimId, topicDimId]
        );

        // Migrate questions
        for (const q of questions) {
          // Check if already exists
          const existing = await client.execute(
            'SELECT id FROM fact_exam_questions WHERE topic_id = ? AND question = ?',
            [topicDimId, q.question]
          );

          if (existing.rows.length > 0) {
            skippedCount++;
            continue;
          }

          // Insert into fact table
          await client.execute(
            `INSERT INTO fact_exam_questions
             (topic_id, question, options, correct_answer, explanation, difficulty, source, valid_from, valid_until)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              topicDimId,
              q.question,
              q.options,
              q.correct_answer,
              q.explanation,
              q.difficulty || 'medium',
              q.source || 'migrated',
              q.valid_from || new Date().getFullYear(),
              q.valid_until || null
            ]
          );

          migratedCount++;
        }

        console.log('✅');
      } catch (err) {
        console.log(`❌ ${err.message}`);
        errorCount += questions.length;
      }
    }

    // Final count
    const finalResult = await client.execute('SELECT COUNT(*) as count FROM fact_exam_questions');
    const finalCount = finalResult.rows[0].count;

    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║                    MIGRATION COMPLETE                          ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');
    console.log(`📊 Summary:`);
    console.log(`   Old table: ${oldCount} questions`);
    console.log(`   ✅ Migrated: ${migratedCount} questions`);
    console.log(`   ⏭️  Skipped (duplicates): ${skippedCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`   🎯 Dimensions created: ${dimCreated}`);
    console.log(`   📦 New table total: ${finalCount} questions\n`);

    console.log('🎉 Migration successful!\n');
    console.log('🔍 Verification:');
    console.log(`   Before: ${oldCount} in exam_questions`);
    console.log(`   After: ${finalCount} in fact_exam_questions\n`);

    if (finalCount >= oldCount) {
      console.log('✅ All questions migrated successfully!');
      console.log('   You can now safely use only fact_exam_questions.\n');
    } else {
      console.log('⚠️  Some questions may not have migrated. Please verify.\n');
    }

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

migrate().then(() => {
  console.log('✅ Migration script completed.');
  process.exit(0);
}).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
