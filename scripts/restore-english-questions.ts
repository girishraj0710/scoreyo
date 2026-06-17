import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

/**
 * Restore English questions from Turso backup to Supabase
 * Usage: npx tsx scripts/restore-english-questions.ts
 */

interface EnglishQuestion {
  id: number;
  path_id: string;
  topic_id: string;
  level: string;
  question: string;
  options: string; // JSON string
  correct_answer: number;
  explanation: string;
  difficulty: string;
  created_at: string;
}

async function restoreEnglishQuestions() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    console.log('🔄 Loading backup data...');
    const backupPath = '/tmp/english_questions_backup.json';

    if (!fs.existsSync(backupPath)) {
      throw new Error(`Backup file not found: ${backupPath}`);
    }

    const questions: EnglishQuestion[] = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
    console.log(`✅ Loaded ${questions.length} questions from backup`);

    // Check current count in Supabase
    const countResult = await pool.query('SELECT COUNT(*) FROM english_questions');
    const currentCount = parseInt(countResult.rows[0].count);
    console.log(`📊 Current count in Supabase: ${currentCount}`);

    if (currentCount > 0) {
      console.log('⚠️  Table is not empty. Clearing existing data...');
      await pool.query('DELETE FROM english_questions');
      console.log('✅ Table cleared');
    }

    // Reset sequence to avoid ID conflicts
    await pool.query('ALTER SEQUENCE english_questions_id_seq RESTART WITH 1');
    console.log('✅ Sequence reset');

    // Batch insert (Supabase can handle large inserts, but we'll batch for safety)
    const BATCH_SIZE = 500;
    let inserted = 0;

    for (let i = 0; i < questions.length; i += BATCH_SIZE) {
      const batch = questions.slice(i, i + BATCH_SIZE);

      // Build multi-row INSERT
      const values: any[] = [];
      const placeholders: string[] = [];

      batch.forEach((q, idx) => {
        const offset = idx * 9;
        placeholders.push(
          `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7}, $${offset + 8}, $${offset + 9})`
        );
        values.push(
          q.path_id,
          q.topic_id,
          q.level,
          q.question,
          q.options,
          q.correct_answer,
          q.explanation,
          q.difficulty,
          q.created_at
        );
      });

      const sql = `
        INSERT INTO english_questions
        (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty, created_at)
        VALUES ${placeholders.join(', ')}
      `;

      await pool.query(sql, values);
      inserted += batch.length;

      const progress = ((inserted / questions.length) * 100).toFixed(1);
      console.log(`⏳ Progress: ${inserted}/${questions.length} (${progress}%)`);
    }

    // Verify final count
    const finalResult = await pool.query('SELECT COUNT(*) FROM english_questions');
    const finalCount = parseInt(finalResult.rows[0].count);

    console.log('\n✅ Restore complete!');
    console.log(`📊 Final count: ${finalCount}`);
    console.log(`✅ Expected: ${questions.length}`);

    if (finalCount !== questions.length) {
      console.error('❌ Count mismatch! Some questions may not have been restored.');
    }

    // Show distribution
    const distResult = await pool.query(`
      SELECT path_id, COUNT(*) as count
      FROM english_questions
      GROUP BY path_id
      ORDER BY count DESC
    `);

    console.log('\n📊 Distribution by path:');
    distResult.rows.forEach(row => {
      console.log(`   ${row.path_id}: ${row.count} questions`);
    });

    const levelResult = await pool.query(`
      SELECT level, COUNT(*) as count
      FROM english_questions
      GROUP BY level
      ORDER BY count DESC
    `);

    console.log('\n📊 Distribution by level:');
    levelResult.rows.forEach(row => {
      console.log(`   ${row.level}: ${row.count} questions`);
    });

  } catch (error) {
    console.error('❌ Error restoring questions:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

restoreEnglishQuestions();
