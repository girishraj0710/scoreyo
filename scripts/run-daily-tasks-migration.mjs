#!/usr/bin/env node
/**
 * Create daily tasks system tables
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
    console.log('\n🚀 Creating daily tasks system...\n');

    const sql = fs.readFileSync(
      path.join(__dirname, 'create-daily-tasks-system.sql'),
      'utf8'
    );

    await client.query(sql);

    console.log('✅ Tables created successfully:');
    console.log('   - user_daily_tasks');
    console.log('   - user_study_plans\n');

    // Verify tables exist
    const tables = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('user_daily_tasks', 'user_study_plans')
      ORDER BY table_name
    `);

    console.log('📊 Verification:');
    tables.rows.forEach(row => {
      console.log(`   ✓ ${row.table_name}`);
    });

    console.log('\n🎉 Migration complete!\n');

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
