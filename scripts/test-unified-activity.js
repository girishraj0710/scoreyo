#!/usr/bin/env node
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

async function testUnifiedActivity() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
  });

  console.log('🧪 Testing Unified Activity Tracking\n');
  console.log('=' .repeat(60));

  // Test user - use first user from database
  const usersResult = await pool.query('SELECT id FROM users LIMIT 1');
  if (usersResult.rows.length === 0) {
    console.log('⚠️  No users found in database. Please create a user first.');
    await pool.end();
    return;
  }

  const testUserId = usersResult.rows[0].id;
  console.log(`📍 Testing with user: ${testUserId}\n`);

  // Test 1: Check unified streak query
  console.log('1️⃣  Testing unified streak calculation...');
  const streakResult = await pool.query(`
    SELECT DISTINCT day FROM (
      SELECT DATE(created_at) as day FROM quiz_sessions WHERE user_id = $1
      UNION
      SELECT DATE(created_at) as day FROM flashcard_study_sessions WHERE user_id = $1
      UNION
      SELECT DATE(created_at) as day FROM user_quiz_levels WHERE user_id = $1
      UNION
      SELECT DATE(created_at) as day FROM user_exam_levels WHERE user_id = $1
      UNION
      SELECT CAST(date AS DATE) as day FROM english_daily_practice WHERE user_id = $1
      UNION
      SELECT DATE(last_practiced) as day FROM english_progress
      WHERE user_id = $1 AND last_practiced IS NOT NULL
      UNION
      SELECT DATE(start_time) as day FROM study_reading_sessions
      WHERE user_id = $1 AND start_time IS NOT NULL
    ) AS all_activity
    ORDER BY day DESC
  `, [testUserId]);

  console.log(`   ✓ Found ${streakResult.rows.length} unique activity days`);
  if (streakResult.rows.length > 0) {
    console.log(`   ✓ Most recent: ${streakResult.rows[0].day}`);
  }

  // Test 2: Check total questions from both systems
  console.log('\n2️⃣  Testing unified question counts...');
  const examQuestions = await pool.query(
    'SELECT COALESCE(SUM(total_questions), 0) as total, COALESCE(SUM(correct_answers), 0) as correct FROM quiz_sessions WHERE user_id = $1',
    [testUserId]
  );
  const englishQuestions = await pool.query(
    'SELECT COALESCE(SUM(completed_questions), 0) as total, COALESCE(SUM(correct_answers), 0) as correct FROM english_progress WHERE user_id = $1',
    [testUserId]
  );

  const examTotal = parseInt(examQuestions.rows[0].total);
  const examCorrect = parseInt(examQuestions.rows[0].correct);
  const englishTotal = parseInt(englishQuestions.rows[0].total);
  const englishCorrect = parseInt(englishQuestions.rows[0].correct);
  const combinedTotal = examTotal + englishTotal;
  const combinedCorrect = examCorrect + englishCorrect;

  console.log(`   ✓ Exam questions: ${examTotal} (${examCorrect} correct)`);
  console.log(`   ✓ English questions: ${englishTotal} (${englishCorrect} correct)`);
  console.log(`   ✓ Combined: ${combinedTotal} (${combinedCorrect} correct)`);

  // Test 3: Check today's questions from both systems
  console.log('\n3️⃣  Testing today\'s activity...');
  const today = new Date().toISOString().split('T')[0];
  const examToday = await pool.query(
    'SELECT COALESCE(SUM(total_questions), 0) as total FROM quiz_sessions WHERE user_id = $1 AND DATE(created_at) = $2',
    [testUserId, today]
  );
  const englishToday = await pool.query(
    'SELECT COALESCE(SUM(questions_completed), 0) as total FROM english_daily_practice WHERE user_id = $1 AND date = $2',
    [testUserId, today]
  );

  const examTodayCount = parseInt(examToday.rows[0].total);
  const englishTodayCount = parseInt(englishToday.rows[0].total);
  const combinedToday = examTodayCount + englishTodayCount;

  console.log(`   ✓ Exam today: ${examTodayCount} questions`);
  console.log(`   ✓ English today: ${englishTodayCount} questions`);
  console.log(`   ✓ Combined today: ${combinedToday} questions`);

  // Test 4: Check unified activity feed
  console.log('\n4️⃣  Testing unified activity feed API query...');
  const activityFeed = await pool.query(`
    SELECT * FROM (
      SELECT
        'exam_quiz' as activity_type,
        created_at as timestamp,
        exam_id as context_id,
        subject_id,
        topic as detail,
        total_questions as metric1,
        correct_answers as metric2,
        CASE
          WHEN total_questions > 0 THEN ROUND((correct_answers::DECIMAL / total_questions::DECIMAL) * 100, 1)
          ELSE 0
        END as metric3
      FROM quiz_sessions
      WHERE user_id = $1

      UNION ALL

      SELECT
        'english_practice' as activity_type,
        last_practiced as timestamp,
        path_id as context_id,
        topic_id as subject_id,
        level as detail,
        completed_questions as metric1,
        correct_answers as metric2,
        mastery_score as metric3
      FROM english_progress
      WHERE user_id = $1 AND last_practiced IS NOT NULL

      UNION ALL

      SELECT
        CASE
          WHEN path_id IN ('foundation', 'advanced', 'ielts-toefl', 'real-world') THEN 'english_study'
          ELSE 'exam_study'
        END as activity_type,
        start_time as timestamp,
        path_id as context_id,
        subject_id,
        topic_id as detail,
        duration_seconds as metric1,
        sections_read as metric2,
        completion_percentage as metric3
      FROM study_reading_sessions
      WHERE user_id = $1 AND start_time IS NOT NULL

      UNION ALL

      SELECT
        'flashcard' as activity_type,
        created_at as timestamp,
        CAST(deck_id AS TEXT) as context_id,
        NULL as subject_id,
        NULL as detail,
        cards_studied as metric1,
        cards_correct as metric2,
        NULL as metric3
      FROM flashcard_study_sessions
      WHERE user_id = $1

    ) AS unified_activity
    ORDER BY timestamp DESC
    LIMIT 10
  `, [testUserId]);

  console.log(`   ✓ Found ${activityFeed.rows.length} activities`);
  if (activityFeed.rows.length > 0) {
    const typeCounts = {};
    activityFeed.rows.forEach(row => {
      typeCounts[row.activity_type] = (typeCounts[row.activity_type] || 0) + 1;
    });
    console.log('   ✓ Activity breakdown:');
    Object.entries(typeCounts).forEach(([type, count]) => {
      console.log(`      - ${type}: ${count}`);
    });
  }

  // Test 5: Check index usage with EXPLAIN
  console.log('\n5️⃣  Testing index performance...');
  const explainResult = await pool.query(`
    EXPLAIN (FORMAT JSON)
    SELECT DISTINCT day FROM (
      SELECT CAST(date AS DATE) as day FROM english_daily_practice WHERE user_id = $1
    ) AS activity
  `, [testUserId]);

  const plan = explainResult.rows[0]['QUERY PLAN'][0];
  const usesIndex = JSON.stringify(plan).includes('Index');
  console.log(`   ${usesIndex ? '✓' : '⚠️ '} Query uses index: ${usesIndex}`);

  console.log('\n' + '='.repeat(60));
  console.log('✅ All unified activity tests completed!\n');

  await pool.end();
}

testUnifiedActivity().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
