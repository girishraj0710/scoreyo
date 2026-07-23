#!/usr/bin/env node
/**
 * Run Generated Artifacts Schema Migration (Convert feature, Phase 1)
 * Creates generated_quizzes + generated_games + generated_mock_tests tables.
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

async function runMigration() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('[Migration] Connecting to database...');
    const sqlPath = path.join(__dirname, '../migrations/generated-artifacts-schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('[Migration] Running generated-artifacts-schema.sql...');
    await pool.query(sql);
    console.log('✅ Migration completed successfully!');

    for (const table of ['generated_quizzes', 'generated_games', 'generated_mock_tests']) {
      const result = await pool.query(
        `SELECT column_name, data_type
         FROM information_schema.columns
         WHERE table_name = $1
         ORDER BY ordinal_position`,
        [table]
      );
      console.log(`\n📊 ${table} structure:`);
      result.rows.forEach((row) => console.log(`  - ${row.column_name}: ${row.data_type}`));
    }
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

runMigration();
