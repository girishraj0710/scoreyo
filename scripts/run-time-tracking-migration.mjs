#!/usr/bin/env node
/**
 * Add time tracking columns and tables
 */

import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const postgresLine = envContent
  .split('\n')
  .find(line => line.startsWith('POSTGRES_URL='));

let POSTGRES_URL = postgresLine?.substring('POSTGRES_URL='.length).trim();
if (POSTGRES_URL && (POSTGRES_URL.startsWith('"') || POSTGRES_URL.startsWith("'"))) {
  POSTGRES_URL = POSTGRES_URL.slice(1, -1);
}

const pool = new pg.Pool({
  connectionString: POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

async function runMigration() {
  const client = await pool.connect();

  try {
    console.log('\n🚀 Adding time tracking columns and tables...\n');

    const sql = fs.readFileSync(
      path.join(__dirname, 'add-time-tracking-columns.sql'),
      'utf8'
    );

    await client.query(sql);

    console.log('✅ Migration completed successfully\n');

    // Verify new tables
    const tables = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('flashcard_study_sessions', 'study_reading_sessions')
      ORDER BY table_name
    `);

    console.log('📊 New tables created:');
    tables.rows.forEach(row => {
      console.log(`   ✓ ${row.table_name}`);
    });

    // Verify new columns
    const columns = await client.query(`
      SELECT table_name, column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'quiz_sessions'
      AND column_name IN ('start_time', 'end_time', 'duration_seconds')
      ORDER BY table_name, column_name
    `);

    console.log('\n📊 New columns added:');
    let currentTable = '';
    columns.rows.forEach(row => {
      if (row.table_name !== currentTable) {
        console.log(`\n   ${row.table_name}:`);
        currentTable = row.table_name;
      }
      console.log(`      ✓ ${row.column_name} (${row.data_type})`);
    });

    console.log('\n🎉 Time tracking system ready!\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
