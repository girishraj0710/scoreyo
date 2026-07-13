/**
 * Setup script for exam-holistic level mode
 * Creates user_exam_levels table in Supabase
 *
 * Run with: npx tsx scripts/setup-exam-holistic-levels.ts
 */

import { execute, queryAll } from '../src/lib/db';

async function setupTable() {
  console.log('🚀 Setting up exam-holistic level mode...\n');

  try {
    // Check if table exists
    const tableCheck = await queryAll(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'user_exam_levels'
    `);

    if (tableCheck && tableCheck.length > 0) {
      console.log('✅ Table user_exam_levels already exists');
      return;
    }

    // Create table
    await execute(`
      CREATE TABLE user_exam_levels (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        exam_id TEXT NOT NULL,
        level_number INTEGER NOT NULL,
        level_type TEXT NOT NULL,
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
    await execute(`
      CREATE INDEX idx_user_exam_levels_user
      ON user_exam_levels(user_id, exam_id)
    `);

    await execute(`
      CREATE INDEX idx_user_exam_levels_status
      ON user_exam_levels(user_id, is_unlocked, is_completed)
    `);

    console.log('✅ Indexes created');
    console.log('\n🎮 Exam-Holistic Level Mode Ready!');
    console.log('   • JEE: Physics + Chemistry + Math mixed');
    console.log('   • NEET: Physics + Chemistry + Biology mixed');
    console.log('   • Each exam has 30 holistic levels\n');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

setupTable()
  .then(() => {
    console.log('✅ Setup complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  });
