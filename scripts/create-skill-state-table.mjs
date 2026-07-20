#!/usr/bin/env node

/**
 * Create topic_skill_state — the persistent store for the behavior-driven
 * learner model (the "heart and soul" engine in src/lib/learner-model.ts).
 *
 * One row per (user, exam, subject, topic). Unlike the legacy topic_mastery
 * table (naive cumulative accuracy), this stores the full evolving skill state:
 *   - p_known    : Bayesian Knowledge Tracing probability of true mastery
 *   - stability  : forgetting-curve memory durability, in days
 *   - difficulty : Elo-style per-user difficulty of the topic (0..1)
 *   - ewma_*     : smoothed recent accuracy & speed (behavioral traits)
 *   - error tallies (calculation/concept/time/careless) — the Mistake Map
 *   - streak, last_seen, next_review (adaptive spaced repetition)
 *
 * topic_mastery is left UNTOUCHED for backward compatibility (dashboards,
 * review, leaderboard still read it). The engine writes BOTH going forward.
 */

import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.POSTGRES_URL });

async function run() {
  const client = await pool.connect();
  try {
    console.log('🚀 Creating topic_skill_state table...\n');
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS topic_skill_state (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        exam_id TEXT NOT NULL,
        subject_id TEXT NOT NULL,
        topic TEXT NOT NULL,
        p_known REAL NOT NULL DEFAULT 0.3,
        stability REAL NOT NULL DEFAULT 1.0,
        difficulty REAL NOT NULL DEFAULT 0.5,
        attempts INTEGER NOT NULL DEFAULT 0,
        correct INTEGER NOT NULL DEFAULT 0,
        streak INTEGER NOT NULL DEFAULT 0,
        ewma_accuracy REAL NOT NULL DEFAULT 0.5,
        ewma_speed_ratio REAL NOT NULL DEFAULT 1.0,
        err_calculation INTEGER NOT NULL DEFAULT 0,
        err_concept INTEGER NOT NULL DEFAULT 0,
        err_time INTEGER NOT NULL DEFAULT 0,
        err_careless INTEGER NOT NULL DEFAULT 0,
        last_seen TIMESTAMP,
        next_review TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, exam_id, subject_id, topic)
      )
    `);
    console.log('✅ Table created: topic_skill_state');

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_skill_state_lookup
        ON topic_skill_state(user_id, exam_id)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_skill_state_review
        ON topic_skill_state(user_id, next_review)
    `);
    console.log('✅ Indexes created');

    await client.query('COMMIT');
    console.log('\n✅ Success! topic_skill_state ready.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error creating topic_skill_state:', error);
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
