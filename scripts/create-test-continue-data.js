#!/usr/bin/env node

/**
 * Create test data for "Continue Learning" card
 */

const { Pool } = require("pg");
require('dotenv').config({ path: '.env.local' });

async function createTestData() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false }
  });

  const client = await pool.connect();

  try {
    const userId = '77788b1d-ea0f-4f92-868b-285bbbe55473';

    console.log('\n🔧 Creating test data for Continue Learning...\n');

    // Option 1: Create English progress with incomplete mastery
    console.log('📝 Creating English progress data...');

    const englishInsert = await client.query(`
      INSERT INTO english_progress (
        user_id,
        path_id,
        topic_id,
        level,
        completed_questions,
        correct_answers,
        mastery_score,
        last_practiced
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      ON CONFLICT (user_id, path_id, topic_id)
      DO UPDATE SET
        completed_questions = EXCLUDED.completed_questions,
        correct_answers = EXCLUDED.correct_answers,
        mastery_score = EXCLUDED.mastery_score,
        last_practiced = NOW()
      RETURNING *
    `, [
      userId,
      'foundation',
      'imperative-mood',
      'A1',
      15,  // completed_questions > 0
      12,  // 80% correct
      0.64 // 64% mastery (< 0.9)
    ]);

    console.log('✅ English progress created:');
    console.table([{
      path: englishInsert.rows[0].path_id,
      topic: englishInsert.rows[0].topic_id,
      questions: englishInsert.rows[0].completed_questions,
      mastery: Math.round(englishInsert.rows[0].mastery_score * 100) + '%'
    }]);

    // Verify it works
    console.log('\n🧪 Testing API response...');

    const testResult = await client.query(`
      SELECT ep.*, fd.title as path_title
      FROM english_progress ep
      LEFT JOIN (
        SELECT 'foundation' as id, 'Foundation English' as title
        UNION ALL SELECT 'advanced', 'Advanced English'
        UNION ALL SELECT 'ielts-toefl', 'IELTS/TOEFL Prep'
        UNION ALL SELECT 'real-world', 'Real-world English'
      ) fd ON ep.path_id = fd.id
      WHERE ep.user_id = $1
        AND ep.completed_questions > 0
        AND ep.mastery_score < 0.9
      ORDER BY ep.last_practiced DESC
      LIMIT 1
    `, [userId]);

    if (testResult.rows.length > 0) {
      console.log('✅ Continue Learning data found!');
      console.table([{
        'Topic': testResult.rows[0].topic_id,
        'Progress': Math.round(testResult.rows[0].mastery_score * 100) + '%',
        'Last Practiced': testResult.rows[0].last_practiced
      }]);

      console.log('\n✅ SUCCESS! Now refresh your browser to see the "Pick up where you left off" card!\n');
    } else {
      console.log('❌ No data found. Something went wrong.');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

createTestData();
