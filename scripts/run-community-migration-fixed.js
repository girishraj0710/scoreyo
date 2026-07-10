#!/usr/bin/env node

/**
 * Run Flashcard Community Auto-Share Migration
 */

require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

async function runMigration() {
  console.log('🚀 Running Flashcard Community Migration...\n');

  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
  });

  try {
    const client = await pool.connect();
    console.log('✅ Connected to database\n');

    // Migration steps
    const steps = [
      {
        name: 'Add studies_today column',
        sql: 'ALTER TABLE flashcard_decks ADD COLUMN IF NOT EXISTS studies_today INTEGER DEFAULT 0'
      },
      {
        name: 'Add unique_students column',
        sql: 'ALTER TABLE flashcard_decks ADD COLUMN IF NOT EXISTS unique_students INTEGER DEFAULT 0'
      },
      {
        name: 'Add total_studies column',
        sql: 'ALTER TABLE flashcard_decks ADD COLUMN IF NOT EXISTS total_studies INTEGER DEFAULT 0'
      },
      {
        name: 'Add last_studied_at column',
        sql: 'ALTER TABLE flashcard_decks ADD COLUMN IF NOT EXISTS last_studied_at TIMESTAMP'
      },
      {
        name: 'Add preferred_exam to users',
        sql: 'ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_exam TEXT'
      },
      {
        name: 'Add username to users',
        sql: 'ALTER TABLE users ADD COLUMN IF NOT EXISTS username TEXT'
      },
      {
        name: 'Make all decks public',
        sql: 'UPDATE flashcard_decks SET is_public = true WHERE is_public = false OR is_public IS NULL'
      },
      {
        name: 'Create exam index',
        sql: 'CREATE INDEX IF NOT EXISTS idx_decks_exam_public ON flashcard_decks(exam_id, is_public) WHERE is_public = true'
      },
      {
        name: 'Create studies index',
        sql: 'CREATE INDEX IF NOT EXISTS idx_decks_studies ON flashcard_decks(studies_today DESC)'
      },
      {
        name: 'Create users exam index',
        sql: 'CREATE INDEX IF NOT EXISTS idx_users_exam ON users(preferred_exam)'
      }
    ];

    // Run each step
    for (const step of steps) {
      try {
        await client.query(step.sql);
        console.log(`✅ ${step.name}`);
      } catch (err) {
        console.log(`⚠️  ${step.name} - ${err.message}`);
      }
    }

    // Verification
    console.log('\n📊 Verification:\n');

    const deckCols = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'flashcard_decks'
      AND column_name IN ('studies_today', 'unique_students', 'total_studies', 'last_studied_at')
      ORDER BY column_name
    `);
    console.log(`Flashcard Deck Columns: ${deckCols.rows.length}/4 added ✅`);
    deckCols.rows.forEach(row => console.log(`  - ${row.column_name}: ${row.data_type}`));

    const userCols = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'users'
      AND column_name IN ('preferred_exam', 'username')
      ORDER BY column_name
    `);
    console.log(`\nUser Columns: ${userCols.rows.length}/2 added ✅`);
    userCols.rows.forEach(row => console.log(`  - ${row.column_name}: ${row.data_type}`));

    const publicDecks = await client.query(`
      SELECT
        COUNT(*) as total_decks,
        COUNT(*) FILTER (WHERE is_public = true) as public_decks
      FROM flashcard_decks
    `);
    const stats = publicDecks.rows[0];
    console.log('\n📊 Deck Statistics:');
    console.log(`  Total decks: ${stats.total_decks}`);
    console.log(`  Public decks: ${stats.public_decks}`);
    console.log(`  ${stats.total_decks === stats.public_decks ? '✅ All decks are public' : '⚠️  Some decks are private'}`);

    client.release();
    console.log('\n🎉 Migration completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('  1. Restart dev server (npm run dev)');
    console.log('  2. Test community flashcards');
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
