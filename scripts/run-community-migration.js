#!/usr/bin/env node

/**
 * Run Flashcard Community Auto-Share Migration
 */

require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  console.log('🚀 Running Flashcard Community Migration...\n');

  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
  });

  try {
    const client = await pool.connect();
    console.log('✅ Connected to database\n');

    // Read migration file
    const sqlFile = path.join(__dirname, '../migrations/flashcards-community-auto-share.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Split by semicolons and run each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      try {
        await client.query(statement);
        console.log('✅ Executed statement');
      } catch (err) {
        // Ignore "already exists" errors
        if (err.message.includes('already exists') || err.message.includes('duplicate')) {
          console.log('⚠️  Column/index already exists, skipping...');
        } else {
          console.error('❌ Error:', err.message);
        }
      }
    }

    // Verification queries
    console.log('\n📊 Verification:\n');

    // Check flashcard_decks columns
    const deckCols = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'flashcard_decks'
      AND column_name IN ('studies_today', 'unique_students', 'total_studies', 'last_studied_at')
    `);
    console.log('Flashcard Deck Columns Added:', deckCols.rows.length === 4 ? '✅' : '❌');
    deckCols.rows.forEach(row => console.log(`  - ${row.column_name}: ${row.data_type}`));

    // Check users columns
    const userCols = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'users'
      AND column_name IN ('preferred_exam', 'username')
    `);
    console.log('\nUser Columns Added:', userCols.rows.length === 2 ? '✅' : '❌');
    userCols.rows.forEach(row => console.log(`  - ${row.column_name}: ${row.data_type}`));

    // Check public decks
    const publicDecks = await client.query(`
      SELECT
        COUNT(*) as total_decks,
        COUNT(*) FILTER (WHERE is_public = true) as public_decks
      FROM flashcard_decks
    `);
    const stats = publicDecks.rows[0];
    console.log('\nDeck Statistics:');
    console.log(`  Total decks: ${stats.total_decks}`);
    console.log(`  Public decks: ${stats.public_decks}`);
    console.log(`  All public: ${stats.total_decks === stats.public_decks ? '✅' : '❌'}`);

    client.release();
    console.log('\n🎉 Migration completed successfully!');
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
