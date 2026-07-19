#!/usr/bin/env node

const { Pool } = require("pg");
require('dotenv').config({ path: '.env.local' });

async function checkSchema() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false }
  });

  const client = await pool.connect();

  try {
    console.log('\n🔍 Checking users table schema...\n');

    // Get ALL columns
    const schemaResult = await client.query(`
      SELECT column_name, data_type, column_default, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);

    console.log('📋 ALL Users table columns:');
    console.table(schemaResult.rows);

    // Check user data with existing columns
    const userResult = await client.query(
      `SELECT * FROM users WHERE email = $1`,
      ['grgowda07.1992@gmail.com']
    );

    if (userResult.rows.length > 0) {
      console.log('\n👤 User data:');
      console.log(JSON.stringify(userResult.rows[0], null, 2));
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

checkSchema();
