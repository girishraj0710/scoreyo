#!/usr/bin/env node

/**
 * Create onboarding tables for the "One Student. One Goal. One AI Coach." flow.
 *
 * - learner_profiles: stores the AI Assessment Interview answers + an evolving
 *   profile (updated over time from real behavior). onboarding_completed gates
 *   whether a user has finished the interview.
 * - study_plans: stores the AI-generated personalized study plan (JSONB).
 *
 * Existing users are backfilled with a learner_profiles row where
 * onboarding_completed = false, so they are prompted through onboarding once on
 * their next login (their current exam is pre-filled from exam_preparing_for).
 */

import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

async function run() {
  const client = await pool.connect();

  try {
    console.log('🚀 Creating onboarding tables...\n');
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS learner_profiles (
        user_id TEXT PRIMARY KEY,
        exam_id TEXT,
        profile JSONB NOT NULL DEFAULT '{}'::jsonb,
        onboarding_completed BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table created: learner_profiles');

    await client.query(`
      CREATE TABLE IF NOT EXISTS study_plans (
        user_id TEXT PRIMARY KEY,
        exam_id TEXT,
        plan JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table created: study_plans');

    // Backfill existing users so they are prompted through onboarding once.
    const backfill = await client.query(`
      INSERT INTO learner_profiles (user_id, exam_id, profile, onboarding_completed)
      SELECT u.id, u.exam_preparing_for, '{}'::jsonb, false
      FROM users u
      LEFT JOIN learner_profiles lp ON lp.user_id = u.id
      WHERE lp.user_id IS NULL
    `);
    console.log(`✅ Backfilled ${backfill.rowCount} existing users (onboarding_completed = false)`);

    await client.query('COMMIT');
    console.log('\n✅ Success! Onboarding tables ready.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error creating onboarding tables:', error);
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
