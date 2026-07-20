#!/usr/bin/env node

/**
 * Database Status Checker
 * Connects to Supabase PostgreSQL and reports status of all tables
 */

const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function checkDatabaseStatus() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
  });

  console.log('\n🔍 Scoreyo Database Status Check\n');
  console.log('=' .repeat(80));

  try {
    // Test connection
    const client = await pool.connect();
    console.log('✅ Connection successful to Supabase PostgreSQL');

    // Get database info
    const dbInfo = await client.query(`
      SELECT current_database() as database,
             version() as version,
             current_user as user
    `);
    console.log(`📦 Database: ${dbInfo.rows[0].database}`);
    console.log(`👤 User: ${dbInfo.rows[0].user}`);
    console.log(`🔧 Version: ${dbInfo.rows[0].version.split(',')[0]}`);
    console.log('=' .repeat(80));

    // Get all tables with row counts
    const tablesQuery = await client.query(`
      SELECT
        schemaname,
        tablename,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `);

    console.log(`\n📊 Found ${tablesQuery.rows.length} tables:\n`);

    // Get row counts for each table
    for (const table of tablesQuery.rows) {
      const tableName = table.tablename;

      try {
        const countResult = await client.query(`SELECT COUNT(*) as count FROM ${tableName}`);
        const rowCount = parseInt(countResult.rows[0].count);

        // Get last updated/created timestamp if available
        let lastActivity = '';
        const hasCreatedAt = await client.query(`
          SELECT column_name
          FROM information_schema.columns
          WHERE table_name = $1
          AND column_name IN ('created_at', 'updated_at')
          LIMIT 1
        `, [tableName]);

        if (hasCreatedAt.rows.length > 0) {
          const timeCol = hasCreatedAt.rows[0].column_name;
          const lastTime = await client.query(`
            SELECT MAX(${timeCol}) as last_time FROM ${tableName}
          `);
          if (lastTime.rows[0].last_time) {
            const date = new Date(lastTime.rows[0].last_time);
            lastActivity = ` (last: ${date.toLocaleString('en-IN')})`;
          }
        }

        // Visual indicator based on row count
        let indicator = rowCount === 0 ? '⚪' : rowCount < 100 ? '🟡' : rowCount < 1000 ? '🟢' : '🔵';

        console.log(`  ${indicator} ${tableName.padEnd(35)} ${String(rowCount).padStart(8)} rows   ${table.size.padStart(8)}${lastActivity}`);
      } catch (error) {
        console.log(`  ❌ ${tableName.padEnd(35)} ERROR: ${error.message}`);
      }
    }

    // Check critical tables
    console.log('\n' + '='.repeat(80));
    console.log('🎯 Critical Table Status:\n');

    const criticalTables = [
      'users',
      'dim_exams',
      'dim_subjects',
      'dim_topics',
      'bridge_exam_subject_topic',
      'fact_exam_questions',
      'quiz_sessions',
      'subscriptions',
      'mock_tests',
      'topic_study_content'
    ];

    for (const table of criticalTables) {
      try {
        const result = await client.query(`SELECT COUNT(*) as count FROM ${table}`);
        const count = parseInt(result.rows[0].count);
        const status = count > 0 ? '✅' : '⚠️ ';
        console.log(`  ${status} ${table.padEnd(35)} ${String(count).padStart(8)} rows`);
      } catch (error) {
        console.log(`  ❌ ${table.padEnd(35)} NOT FOUND or ERROR`);
      }
    }

    // Check dimensional model integrity
    console.log('\n' + '='.repeat(80));
    console.log('🔗 Dimensional Model Integrity:\n');

    const examCount = await client.query('SELECT COUNT(*) as count FROM dim_exams');
    const subjectCount = await client.query('SELECT COUNT(*) as count FROM dim_subjects');
    const topicCount = await client.query('SELECT COUNT(*) as count FROM dim_topics');
    const bridgeCount = await client.query('SELECT COUNT(*) as count FROM bridge_exam_subject_topic');
    const questionCount = await client.query('SELECT COUNT(*) as count FROM fact_exam_questions');

    console.log(`  📚 Exams:     ${examCount.rows[0].count} registered`);
    console.log(`  📖 Subjects:  ${subjectCount.rows[0].count} registered`);
    console.log(`  📝 Topics:    ${topicCount.rows[0].count} registered`);
    console.log(`  🔗 Bridges:   ${bridgeCount.rows[0].count} exam-subject-topic mappings`);
    console.log(`  ❓ Questions: ${questionCount.rows[0].count} total questions`);

    // Check for orphaned records
    const orphanedQuestions = await client.query(`
      SELECT COUNT(*) as count
      FROM fact_exam_questions q
      LEFT JOIN dim_topics t ON q.topic_id = t.id
      WHERE t.id IS NULL
    `);

    const orphanedBridges = await client.query(`
      SELECT COUNT(*) as count
      FROM bridge_exam_subject_topic b
      LEFT JOIN dim_topics t ON b.topic_id = t.id
      WHERE t.id IS NULL
    `);

    if (parseInt(orphanedQuestions.rows[0].count) > 0) {
      console.log(`  ⚠️  ${orphanedQuestions.rows[0].count} orphaned questions (missing topic)`);
    }
    if (parseInt(orphanedBridges.rows[0].count) > 0) {
      console.log(`  ⚠️  ${orphanedBridges.rows[0].count} orphaned bridge entries (missing topic)`);
    }
    if (parseInt(orphanedQuestions.rows[0].count) === 0 && parseInt(orphanedBridges.rows[0].count) === 0) {
      console.log(`  ✅ No orphaned records found`);
    }

    // Check exam coverage
    console.log('\n' + '='.repeat(80));
    console.log('🎓 Exam Coverage Report:\n');

    const examCoverage = await client.query(`
      SELECT
        e.exam_code,
        e.exam_name,
        COUNT(DISTINCT b.subject_id) as subjects,
        COUNT(DISTINCT b.topic_id) as topics,
        COUNT(q.id) as questions
      FROM dim_exams e
      LEFT JOIN bridge_exam_subject_topic b ON e.id = b.exam_id
      LEFT JOIN fact_exam_questions q ON b.topic_id = q.topic_id
      GROUP BY e.id, e.exam_code, e.exam_name
      ORDER BY questions DESC
      LIMIT 10
    `);

    console.log('  Top 10 exams by question count:\n');
    for (const exam of examCoverage.rows) {
      const indicator = exam.questions > 100 ? '🟢' : exam.questions > 10 ? '🟡' : '🔴';
      console.log(`  ${indicator} ${exam.exam_code.padEnd(15)} ${String(exam.questions).padStart(6)} Q  ${String(exam.subjects).padStart(3)} subj  ${String(exam.topics).padStart(3)} topics  ${exam.exam_name}`);
    }

    // Connection pool stats
    console.log('\n' + '='.repeat(80));
    console.log('🔌 Connection Pool Status:\n');
    console.log(`  Total connections:   ${pool.totalCount}`);
    console.log(`  Idle connections:    ${pool.idleCount}`);
    console.log(`  Waiting connections: ${pool.waitingCount}`);

    client.release();
    await pool.end();

    console.log('\n' + '='.repeat(80));
    console.log('✅ Database check complete!\n');

  } catch (error) {
    console.error('\n❌ Error connecting to database:', error.message);
    console.error('\n🔍 Check:');
    console.error('  1. .env.local file exists with POSTGRES_URL');
    console.error('  2. Supabase database is running');
    console.error('  3. Network connectivity to Supabase');
    process.exit(1);
  }
}

checkDatabaseStatus();
