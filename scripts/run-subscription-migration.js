#!/usr/bin/env node

const { Pool } = require("pg");
const fs = require("fs");
require('dotenv').config({ path: '.env.local' });

async function runMigration() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false }
  });

  const client = await pool.connect();

  try {
    console.log('\n🔄 Running subscription migration...\n');

    const sql = fs.readFileSync('./migrations/add-subscription-status.sql', 'utf8');

    await client.query(sql);

    console.log('✅ Migration completed successfully!');

    // Verify the columns were added
    const checkResult = await client.query(`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns
      WHERE table_name = 'users'
      AND column_name IN ('subscription_status', 'subscription_expires_at')
    `);

    console.log('\n📋 New columns:');
    console.table(checkResult.rows);

    // Check user data
    const userResult = await client.query(
      `SELECT email, role, subscription_status, subscription_expires_at
       FROM users
       WHERE email = $1`,
      ['grgowda07.1992@gmail.com']
    );

    console.log('\n👤 User data:');
    console.table(userResult.rows);

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
