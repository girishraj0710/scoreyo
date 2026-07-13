#!/usr/bin/env node
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

async function verifyTable() {
  const client = await pool.connect();

  try {
    console.log('🔍 Verifying user_enrolled_exams table...\n');

    // 1. Check if table exists
    const tableCheck = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_name = 'user_enrolled_exams'
    `);

    if (tableCheck.rows.length === 0) {
      console.log('❌ Table user_enrolled_exams does NOT exist');
      return;
    }

    console.log('✅ Table user_enrolled_exams exists');

    // 2. Check table structure
    console.log('\n📋 Table Structure:');
    const columns = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'user_enrolled_exams'
      ORDER BY ordinal_position
    `);

    columns.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : ''}`);
    });

    // 3. Check indexes
    console.log('\n🔑 Indexes:');
    const indexes = await client.query(`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename = 'user_enrolled_exams'
    `);

    if (indexes.rows.length > 0) {
      indexes.rows.forEach(idx => {
        console.log(`  - ${idx.indexname}`);
      });
    } else {
      console.log('  (No indexes found)');
    }

    // 4. Check row count
    const countResult = await client.query('SELECT COUNT(*) as count FROM user_enrolled_exams');
    console.log(`\n📊 Total enrollments: ${countResult.rows[0].count}`);

    // 5. Sample data
    const sampleData = await client.query(`
      SELECT user_id, exam_id, is_primary, enrolled_at
      FROM user_enrolled_exams
      ORDER BY enrolled_at DESC
      LIMIT 5
    `);

    if (sampleData.rows.length > 0) {
      console.log('\n📌 Sample Data (latest 5):');
      sampleData.rows.forEach(row => {
        console.log(`  User ${row.user_id}: ${row.exam_id} ${row.is_primary === 1 ? '(PRIMARY)' : ''}`);
      });
    } else {
      console.log('\n⚠️  No enrollment data found');
    }

    // 6. Check primary exam distribution
    const primaryExams = await client.query(`
      SELECT exam_id, COUNT(*) as user_count
      FROM user_enrolled_exams
      WHERE is_primary = 1
      GROUP BY exam_id
      ORDER BY user_count DESC
      LIMIT 10
    `);

    if (primaryExams.rows.length > 0) {
      console.log('\n🎯 Primary Exam Distribution:');
      primaryExams.rows.forEach(row => {
        console.log(`  ${row.exam_id}: ${row.user_count} users`);
      });
    }

    // 7. Check users with multiple enrollments
    const multiExamUsers = await client.query(`
      SELECT user_id, COUNT(*) as exam_count
      FROM user_enrolled_exams
      GROUP BY user_id
      HAVING COUNT(*) > 1
    `);

    console.log(`\n👥 Users enrolled in multiple exams: ${multiExamUsers.rows.length}`);

    if (multiExamUsers.rows.length > 0) {
      console.log('   Sample multi-exam users:');
      multiExamUsers.rows.slice(0, 5).forEach(row => {
        console.log(`     User ${row.user_id}: ${row.exam_count} exams`);
      });
    }

    console.log('\n✅ Verification complete!');

  } catch (error) {
    console.error('❌ Error during verification:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

verifyTable();
