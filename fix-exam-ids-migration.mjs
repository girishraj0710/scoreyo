#!/usr/bin/env node
/**
 * Migration: Fix legacy exam IDs to match canonical IDs
 *
 * Maps:
 *   jee → jee-main
 *   neet → neet-ug
 *   upsc → upsc-cse
 *   ssc → ssc-cgl
 *   ibps → ibps-po
 *   sbi → sbi-po
 */

import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

const EXAM_ID_MAP = {
  'jee': 'jee-main',
  'neet': 'neet-ug',
  'upsc': 'upsc-cse',
  'ssc': 'ssc-cgl',
  'ibps': 'ibps-po',
  'sbi': 'sbi-po'
};

async function migrateExamIds() {
  const client = await pool.connect();

  try {
    console.log('🔄 Starting exam ID migration...\n');

    await client.query('BEGIN');

    // 1. Check current enrollments
    const before = await client.query('SELECT exam_id, COUNT(*) as count FROM user_enrolled_exams GROUP BY exam_id');
    console.log('📊 Before migration:');
    before.rows.forEach(row => {
      console.log(`  ${row.exam_id}: ${row.count} users`);
    });
    console.log('');

    let totalUpdated = 0;

    // 2. Update each legacy ID
    for (const [oldId, newId] of Object.entries(EXAM_ID_MAP)) {
      const result = await client.query(
        `UPDATE user_enrolled_exams
         SET exam_id = $1
         WHERE exam_id = $2`,
        [newId, oldId]
      );

      if (result.rowCount > 0) {
        console.log(`✅ Updated ${result.rowCount} enrollments: ${oldId} → ${newId}`);
        totalUpdated += result.rowCount;
      }
    }

    // 3. Also update users table exam_preparing_for field
    for (const [oldId, newId] of Object.entries(EXAM_ID_MAP)) {
      const result = await client.query(
        `UPDATE users
         SET exam_preparing_for = $1
         WHERE exam_preparing_for = $2`,
        [newId, oldId]
      );

      if (result.rowCount > 0) {
        console.log(`✅ Updated ${result.rowCount} users.exam_preparing_for: ${oldId} → ${newId}`);
      }
    }

    await client.query('COMMIT');

    // 4. Check final state
    const after = await client.query('SELECT exam_id, COUNT(*) as count FROM user_enrolled_exams GROUP BY exam_id ORDER BY count DESC');
    console.log('\n📊 After migration:');
    after.rows.forEach(row => {
      console.log(`  ${row.exam_id}: ${row.count} users`);
    });

    console.log(`\n✅ Migration complete! Updated ${totalUpdated} enrollment records.`);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrateExamIds();
