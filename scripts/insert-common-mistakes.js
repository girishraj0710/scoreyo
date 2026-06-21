#!/usr/bin/env node

/**
 * Insert Common Mistakes study material into Supabase
 * Run: node scripts/insert-common-mistakes.js
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

async function insertCommonMistakes() {
  const client = await pool.connect();

  try {
    console.log('🔄 Inserting Common Mistakes study material...');

    const sqlFile = fs.readFileSync(
      path.join(__dirname, 'insert-common-mistakes-study-material.sql'),
      'utf8'
    );

    await client.query(sqlFile);

    console.log('✅ Successfully inserted Common Mistakes study material');

    // Verify insertion
    const result = await client.query(`
      SELECT topic_id, title, difficulty_level, estimated_time_minutes
      FROM topic_study_content
      WHERE topic_id = 'common-mistakes'
    `);

    if (result.rows.length > 0) {
      console.log('\n📊 Verification:');
      console.log(result.rows[0]);
    }

  } catch (error) {
    console.error('❌ Error inserting study material:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

insertCommonMistakes();
