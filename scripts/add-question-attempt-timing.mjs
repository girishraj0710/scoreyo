#!/usr/bin/env node

/**
 * Add per-question behavioral columns to question_attempts:
 *   - time_ms         : decision time for the question, in milliseconds
 *                       (time from question appearing to first answer picked)
 *   - answer_changes  : how many times the student changed their answer
 *
 * Both are NULLABLE so all existing rows and any client that doesn't send the
 * new fields keep working unchanged. Feeds the behavior-driven learner model's
 * speed/careless dimension.
 */

import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.POSTGRES_URL });

async function run() {
  const client = await pool.connect();
  try {
    console.log('🚀 Adding timing columns to question_attempts...\n');
    await client.query('BEGIN');

    await client.query(`ALTER TABLE question_attempts ADD COLUMN IF NOT EXISTS time_ms INTEGER`);
    console.log('✅ Column added: time_ms');

    await client.query(`ALTER TABLE question_attempts ADD COLUMN IF NOT EXISTS answer_changes INTEGER`);
    console.log('✅ Column added: answer_changes');

    await client.query('COMMIT');
    console.log('\n✅ Success! question_attempts timing columns ready.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error adding timing columns:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
