#!/usr/bin/env node
/**
 * Run Blocks Game Schema Migration
 * Uses existing database connection from lib/db.ts
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

async function runMigration() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
  });

  try {
    console.log('[Migration] Connecting to database...');

    const sqlPath = path.join(__dirname, '../migrations/blocks-game-schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('[Migration] Running blocks-game-schema.sql...');
    await pool.query(sql);

    console.log('✅ Migration completed successfully!');

    // Verify table exists
    const result = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'blocks_game_sessions'
      ORDER BY ordinal_position
    `);

    console.log('\n📊 Table structure:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type}`);
    });

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error.stack);
  } finally {
    await pool.end();
  }
}

runMigration();
