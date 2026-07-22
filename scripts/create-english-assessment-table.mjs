#!/usr/bin/env node

/**
 * Create user_english_assessment — the persistent store for the Learn English
 * CEFR placement assessment result.
 *
 * One row per user. Previously the assessment result lived ONLY in localStorage
 * (keyed by user id), so it was per-origin and per-device: a user who took the
 * assessment on production saw no result on the preview deploy (or a new
 * device), which left the "Take Assessment" button showing and the learning
 * path un-highlighted. Persisting it here makes the placement follow the
 * account everywhere.
 */

import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.POSTGRES_URL });

async function run() {
  const client = await pool.connect();
  try {
    console.log('🚀 Creating user_english_assessment table...\n');
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS user_english_assessment (
        user_id TEXT PRIMARY KEY,
        level TEXT NOT NULL,
        level_name TEXT NOT NULL,
        overall_score INTEGER NOT NULL DEFAULT 0,
        skill_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
        recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
        confidence TEXT,
        study_path JSONB,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table created: user_english_assessment');

    // study_path stores the generated personalized roadmap (StudyPath JSON).
    // Added via ALTER so re-running the migration upgrades an existing table.
    await client.query(`
      ALTER TABLE user_english_assessment
      ADD COLUMN IF NOT EXISTS study_path JSONB
    `);
    console.log('✅ Column ensured: study_path');

    await client.query('COMMIT');
    console.log('\n✅ Success! user_english_assessment ready.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error creating user_english_assessment:', error);
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
