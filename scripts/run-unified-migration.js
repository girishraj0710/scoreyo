#!/usr/bin/env node
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

async function runMigration() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
  });

  const sql = fs.readFileSync(path.join(__dirname, 'unified-activity-tracking-migration.sql'), 'utf8');

  console.log('🚀 Running unified activity tracking migration...\n');
  try {
    await pool.query(sql);
    console.log('✅ Migration completed successfully!\n');

    // Verify indexes
    const indexes = await pool.query(`
      SELECT tablename, indexname
      FROM pg_indexes
      WHERE indexname LIKE 'idx_%_activity'
         OR indexname LIKE 'idx_english_%'
         OR indexname LIKE 'idx_study_sessions%'
      ORDER BY tablename, indexname
    `);

    console.log('📋 Created/verified indexes:');
    indexes.rows.forEach(idx => {
      console.log(`  ✓ ${idx.tablename}.${idx.indexname}`);
    });

    await pool.end();
    console.log('\n✅ All done!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    await pool.end();
    process.exit(1);
  }
}

runMigration();
