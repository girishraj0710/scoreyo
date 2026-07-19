#!/usr/bin/env node

/**
 * Check user's subscription status in database
 */

const { Pool } = require("pg");
require('dotenv').config({ path: '.env.local' });

async function checkUserSubscription() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false }
  });

  const client = await pool.connect();

  try {
    console.log('\n🔍 Checking user subscription status...\n');

    // Check schema
    const schemaResult = await client.query(`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns
      WHERE table_name = 'users'
      AND column_name IN ('role', 'subscription_status', 'subscription_expires_at')
      ORDER BY ordinal_position
    `);

    console.log('📋 Users table columns:');
    console.table(schemaResult.rows);

    // Check user data
    const userResult = await client.query(
      `SELECT id, name, email, role, subscription_status, subscription_expires_at
       FROM users
       WHERE email = $1`,
      ['grgowda07.1992@gmail.com']
    );

    if (userResult.rows.length > 0) {
      console.log('\n👤 User data:');
      console.table(userResult.rows);
    } else {
      console.log('\n❌ User not found!');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

checkUserSubscription();
