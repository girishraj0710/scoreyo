#!/usr/bin/env node
/**
 * Run Group Study Schema Migration (Phase 1)
 * Creates study_groups + group_members tables.
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

async function runMigration() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    console.log('[Migration] Connecting to database...');

    const sqlPath = path.join(__dirname, '../migrations/group-study-schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('[Migration] Running group-study-schema.sql...');
    await pool.query(sql);

    console.log('✅ Migration completed successfully!');

    for (const table of ['study_groups', 'group_members']) {
      const result = await pool.query(
        `SELECT column_name, data_type
         FROM information_schema.columns
         WHERE table_name = $1
         ORDER BY ordinal_position`,
        [table]
      );
      console.log(`\n📊 ${table} structure:`);
      result.rows.forEach((row) => {
        console.log(`  - ${row.column_name}: ${row.data_type}`);
      });
    }
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
