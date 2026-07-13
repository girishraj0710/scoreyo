#!/usr/bin/env node
/**
 * Add weekly_goal_hours column to users table
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
    console.log('\n🚀 Adding weekly_goal_hours column...\n');

    const sql = fs.readFileSync(
      path.join(__dirname, 'add-weekly-goal-column.sql'),
      'utf8'
    );

    await client.query(sql);

    console.log('✅ Column added successfully\n');

    // Verify
    const verify = await client.query(`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns
      WHERE table_name = 'users' AND column_name = 'weekly_goal_hours'
    `);

    if (verify.rows.length > 0) {
      console.log('📊 Verification:');
      console.log(`   Column: ${verify.rows[0].column_name}`);
      console.log(`   Type: ${verify.rows[0].data_type}`);
      console.log(`   Default: ${verify.rows[0].column_default}\n`);
    }

    console.log('🎉 Migration complete!\n');

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
