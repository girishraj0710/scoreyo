#!/usr/bin/env node
/**
 * Test daily tasks generation
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

const TEST_USER_ID = '2c10f9bb-50b2-4bb6-84c8-f12426d7ba37'; // girish.raj0710@gmail.com

async function testDailyTasks() {
  const client = await pool.connect();

  try {
    console.log('\n🧪 Testing Daily Tasks Generation\n');

    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
    console.log(`📅 Date: ${today}`);
    console.log(`👤 User: ${TEST_USER_ID}\n`);

    // Clear existing tasks for today (for testing)
    await client.query(
      'DELETE FROM user_daily_tasks WHERE user_id = $1 AND date = $2',
      [TEST_USER_ID, today]
    );

    console.log('✓ Cleared existing tasks for today\n');

    // Generate tasks by calling the API logic directly via SQL
    console.log('🔄 Generating tasks...\n');

    // 1. Check for due flashcards
    const dueCards = await client.query(
      `SELECT COUNT(DISTINCT fp.card_id) as count, fd.id as deck_id, fd.title as deck_title
       FROM flashcard_progress fp
       JOIN flashcard_decks fd ON fp.deck_id = fd.id
       WHERE fp.user_id = $1 AND fp.next_review <= NOW()
       GROUP BY fd.id, fd.title
       ORDER BY COUNT(*) DESC
       LIMIT 1`,
      [TEST_USER_ID]
    );

    if (dueCards.rows.length > 0 && parseInt(dueCards.rows[0].count) > 0) {
      console.log('📇 Found due flashcards:', {
        count: dueCards.rows[0].count,
        deck: dueCards.rows[0].deck_title
      });
    }

    // 2. Check quiz progress
    const questionsToday = await client.query(
      `SELECT COALESCE(SUM(total_questions), 0) as total
       FROM quiz_sessions
       WHERE user_id = $1 AND DATE(created_at) = $2`,
      [TEST_USER_ID, today]
    );

    console.log('❓ Questions answered today:', questionsToday.rows[0].total);

    console.log('✓ Basic checks complete');

    // Now fetch tasks via API simulation
    console.log('\n📥 Fetching generated tasks from database...\n');

    // Trigger task generation by making actual API call
    const response = await fetch(`http://localhost:3005/api/daily-tasks`, {
      headers: {
        'Cookie': `krakkify-user-id=${TEST_USER_ID}`
      }
    });

    if (!response.ok) {
      console.error('❌ API call failed:', response.status, response.statusText);
      return;
    }

    const data = await response.json();

    console.log('✅ Tasks generated successfully!\n');
    console.log(`📊 Stats: ${data.stats.completed}/${data.stats.total} completed (${data.stats.percentage}%)\n`);

    console.log('📝 Today\'s Tasks:\n');
    data.tasks.forEach((task, i) => {
      const status = task.done ? '✅' : '⬜';
      console.log(`${i + 1}. ${status} [${task.tag}] ${task.label}`);
      console.log(`   Link: ${task.link}\n`);
    });

  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

testDailyTasks().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
