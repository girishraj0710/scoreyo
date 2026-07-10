#!/usr/bin/env node

/**
 * Run Flashcard Enhancements Migration
 * Features: Daily Goals, Ratings, Quiz Integration, Badges, Share Links
 */

require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  console.log('🚀 Running Flashcard Enhancements Migration...\n');

  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
  });

  try {
    const client = await pool.connect();
    console.log('✅ Connected to database\n');

    // Migration steps (individual statements)
    const steps = [
      // Daily Goals Table
      {
        name: 'Create flashcard_daily_goals table',
        sql: `CREATE TABLE IF NOT EXISTS flashcard_daily_goals (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          date DATE NOT NULL DEFAULT CURRENT_DATE,
          target_cards INTEGER DEFAULT 20,
          cards_studied INTEGER DEFAULT 0,
          goal_reached BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW(),
          UNIQUE(user_id, date),
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`
      },
      {
        name: 'Create index on daily_goals',
        sql: 'CREATE INDEX IF NOT EXISTS idx_goals_user_date ON flashcard_daily_goals(user_id, date)'
      },

      // Ratings Table
      {
        name: 'Create flashcard_deck_ratings table',
        sql: `CREATE TABLE IF NOT EXISTS flashcard_deck_ratings (
          id SERIAL PRIMARY KEY,
          deck_id INTEGER NOT NULL,
          user_id INTEGER NOT NULL,
          rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
          review_text TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW(),
          UNIQUE(deck_id, user_id),
          FOREIGN KEY (deck_id) REFERENCES flashcard_decks(id) ON DELETE CASCADE,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`
      },
      {
        name: 'Create index on ratings (deck)',
        sql: 'CREATE INDEX IF NOT EXISTS idx_ratings_deck ON flashcard_deck_ratings(deck_id)'
      },
      {
        name: 'Create index on ratings (user)',
        sql: 'CREATE INDEX IF NOT EXISTS idx_ratings_user ON flashcard_deck_ratings(user_id)'
      },

      // Ratings columns on decks
      {
        name: 'Add average_rating column',
        sql: 'ALTER TABLE flashcard_decks ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0.0'
      },
      {
        name: 'Add rating_count column',
        sql: 'ALTER TABLE flashcard_decks ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0'
      },

      // Quiz Integration columns
      {
        name: 'Add source_type column',
        sql: "ALTER TABLE flashcard_decks ADD COLUMN IF NOT EXISTS source_type TEXT DEFAULT 'manual'"
      },
      {
        name: 'Add source_quiz_session_id column',
        sql: 'ALTER TABLE flashcard_decks ADD COLUMN IF NOT EXISTS source_quiz_session_id TEXT'
      },
      {
        name: 'Add created_from_mistakes column',
        sql: 'ALTER TABLE flashcard_decks ADD COLUMN IF NOT EXISTS created_from_mistakes BOOLEAN DEFAULT false'
      },
      {
        name: 'Update existing decks source_type',
        sql: `UPDATE flashcard_decks
              SET source_type = CASE
                WHEN is_ai_generated = true THEN 'ai_generated'
                ELSE 'manual'
              END
              WHERE source_type = 'manual'`
      },
      {
        name: 'Create index on source',
        sql: 'CREATE INDEX IF NOT EXISTS idx_decks_source ON flashcard_decks(source_type, user_id)'
      },
      {
        name: 'Create index on quiz_session',
        sql: 'CREATE INDEX IF NOT EXISTS idx_decks_quiz_session ON flashcard_decks(source_quiz_session_id)'
      },

      // Share Links columns
      {
        name: 'Add share_slug column',
        sql: 'ALTER TABLE flashcard_decks ADD COLUMN IF NOT EXISTS share_slug TEXT UNIQUE'
      },
      {
        name: 'Add share_count column',
        sql: 'ALTER TABLE flashcard_decks ADD COLUMN IF NOT EXISTS share_count INTEGER DEFAULT 0'
      },
      {
        name: 'Add view_count column',
        sql: 'ALTER TABLE flashcard_decks ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0'
      },
      {
        name: 'Create index on share_slug',
        sql: 'CREATE INDEX IF NOT EXISTS idx_decks_share_slug ON flashcard_decks(share_slug)'
      },

      // Badge stats columns
      {
        name: 'Add decks_created to badge_stats',
        sql: 'ALTER TABLE badge_stats ADD COLUMN IF NOT EXISTS decks_created INTEGER DEFAULT 0'
      },
      {
        name: 'Add cards_studied to badge_stats',
        sql: 'ALTER TABLE badge_stats ADD COLUMN IF NOT EXISTS cards_studied INTEGER DEFAULT 0'
      },
      {
        name: 'Add correct_streak_current to badge_stats',
        sql: 'ALTER TABLE badge_stats ADD COLUMN IF NOT EXISTS correct_streak_current INTEGER DEFAULT 0'
      },
      {
        name: 'Add correct_streak_best to badge_stats',
        sql: 'ALTER TABLE badge_stats ADD COLUMN IF NOT EXISTS correct_streak_best INTEGER DEFAULT 0'
      },
    ];

    console.log(`📝 Executing ${steps.length} migration steps...\n`);

    for (const step of steps) {
      try {
        await client.query(step.sql);
        console.log(`✅ ${step.name}`);
      } catch (err) {
        if (err.message.includes('already exists') || err.message.includes('duplicate')) {
          console.log(`⏭️  ${step.name} (already exists)`);
        } else {
          console.log(`⚠️  ${step.name} - ${err.message.split('\n')[0]}`);
        }
      }
    }

    console.log('\n📊 Verification:\n');

    // Verify tables
    const tables = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('flashcard_daily_goals', 'flashcard_deck_ratings')
      ORDER BY table_name
    `);
    console.log(`✅ New Tables Created: ${tables.rows.length}/2`);
    tables.rows.forEach(row => console.log(`   - ${row.table_name}`));

    // Verify flashcard_decks columns
    const deckCols = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'flashcard_decks'
      AND column_name IN ('average_rating', 'rating_count', 'source_type', 'source_quiz_session_id', 'created_from_mistakes', 'share_slug', 'share_count', 'view_count')
      ORDER BY column_name
    `);
    console.log(`\n✅ Flashcard Decks Columns: ${deckCols.rows.length}/8 added`);
    deckCols.rows.forEach(row => console.log(`   - ${row.column_name}: ${row.data_type}`));

    // Verify badge_stats columns
    const badgeCols = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'badge_stats'
      AND column_name IN ('decks_created', 'cards_studied', 'correct_streak_current', 'correct_streak_best')
      ORDER BY column_name
    `);
    console.log(`\n✅ Badge Stats Columns: ${badgeCols.rows.length}/4 added`);
    badgeCols.rows.forEach(row => console.log(`   - ${row.column_name}: ${row.data_type}`));

    // Check existing data
    const deckCount = await client.query('SELECT COUNT(*) as count FROM flashcard_decks');
    console.log(`\n📊 Existing Data:`);
    console.log(`   - Flashcard Decks: ${deckCount.rows[0].count}`);

    // Generate share_slug for existing decks (using deck ID for now)
    console.log('\n🔗 Generating share slugs for existing decks...');
    const { customAlphabet } = await import('nanoid');
    const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 8);

    const decksWithoutSlug = await client.query('SELECT id FROM flashcard_decks WHERE share_slug IS NULL');
    let slugCount = 0;

    for (const deck of decksWithoutSlug.rows) {
      const slug = nanoid();
      await client.query('UPDATE flashcard_decks SET share_slug = $1 WHERE id = $2', [slug, deck.id]);
      slugCount++;
    }

    console.log(`✅ Generated ${slugCount} share slugs`);

    client.release();
    console.log('\n🎉 Migration completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('  1. Restart dev server (npm run dev)');
    console.log('  2. Test daily goals API');
    console.log('  3. Test deck sharing');
    console.log('  4. Test ratings system');
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
