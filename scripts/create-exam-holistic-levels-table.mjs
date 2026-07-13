#!/usr/bin/env node

/**
 * Create user_exam_levels table for exam-holistic level mode
 *
 * This table tracks user progress for HOLISTIC level mode where:
 * - Each level contains questions from ALL subjects of an exam
 * - No subject_id column (unlike user_quiz_levels which is per-subject)
 * - Example: JEE Level 1 = Mix of Physics + Chemistry + Math questions
 */

import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

async function createTable() {
  const client = await pool.connect();

  try {
    console.log('🚀 Creating user_exam_levels table...\n');

    await client.query('BEGIN');

    // Create table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_exam_levels (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        exam_id TEXT NOT NULL,
        level_number INTEGER NOT NULL,
        level_type TEXT NOT NULL, -- 'normal' or 'boss'
        is_unlocked INTEGER DEFAULT 0,
        is_completed INTEGER DEFAULT 0,
        stars_earned INTEGER DEFAULT 0,
        best_accuracy INTEGER DEFAULT 0,
        attempts INTEGER DEFAULT 0,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, exam_id, level_number)
      )
    `);

    console.log('✅ Table created: user_exam_levels');

    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_user_exam_levels_user
      ON user_exam_levels(user_id, exam_id)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_user_exam_levels_status
      ON user_exam_levels(user_id, is_unlocked, is_completed)
    `);

    console.log('✅ Indexes created');

    await client.query('COMMIT');

    console.log('\n✅ Success! Table structure:');
    console.log('┌────────────────────────────────────────────────────────────┐');
    console.log('│ user_exam_levels                                           │');
    console.log('├────────────────────────────────────────────────────────────┤');
    console.log('│ id              TEXT PRIMARY KEY                          │');
    console.log('│ user_id         TEXT NOT NULL                             │');
    console.log('│ exam_id         TEXT NOT NULL (jee, neet, upsc, etc.)    │');
    console.log('│ level_number    INTEGER (1-30)                            │');
    console.log('│ level_type      TEXT (normal, boss)                       │');
    console.log('│ is_unlocked     INTEGER (0/1)                             │');
    console.log('│ is_completed    INTEGER (0/1)                             │');
    console.log('│ stars_earned    INTEGER (0-3)                             │');
    console.log('│ best_accuracy   INTEGER (0-100)                           │');
    console.log('│ attempts        INTEGER                                   │');
    console.log('│ completed_at    TIMESTAMP                                 │');
    console.log('│ created_at      TIMESTAMP                                 │');
    console.log('│                                                            │');
    console.log('│ UNIQUE(user_id, exam_id, level_number)                   │');
    console.log('└────────────────────────────────────────────────────────────┘');
    console.log('\n🎮 Exam-Holistic Level Mode Ready!');
    console.log('   • JEE: Physics + Chemistry + Math mixed');
    console.log('   • NEET: Physics + Chemistry + Biology mixed');
    console.log('   • Each exam has 30 holistic levels');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error creating table:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

createTable().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
