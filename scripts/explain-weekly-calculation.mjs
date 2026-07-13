#!/usr/bin/env node
/**
 * Explain weekly study time calculation with real data
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

const userId = '2c10f9bb-50b2-4bb6-84c8-f12426d7ba37'; // girish.raj0710@gmail.com

async function explainCalculation() {
  const client = await pool.connect();

  try {
    console.log('\n📊 Weekly Study Time Calculation Breakdown\n');
    console.log('═'.repeat(60));

    // This week's data
    const thisWeek = await client.query(`
      SELECT
        created_at,
        total_questions,
        (total_questions * 1.5 / 60.0) as hours_contributed
      FROM quiz_sessions
      WHERE user_id = $1
        AND created_at >= date_trunc('week', CURRENT_DATE)
        AND created_at < date_trunc('week', CURRENT_DATE) + INTERVAL '1 week'
      ORDER BY created_at DESC
    `, [userId]);

    console.log('\n🗓️  THIS WEEK (Starting Monday):\n');
    if (thisWeek.rows.length === 0) {
      console.log('   ❌ No quiz sessions this week');
    } else {
      thisWeek.rows.forEach((row, i) => {
        console.log(`   ${i + 1}. ${row.created_at.toISOString().split('T')[0]} ${row.created_at.toISOString().split('T')[1].substring(0, 5)}`);
        console.log(`      Questions: ${row.total_questions}`);
        console.log(`      Calculation: ${row.total_questions} questions × 1.5 min/question ÷ 60 = ${parseFloat(row.hours_contributed).toFixed(3)} hours`);
      });
    }

    const thisWeekTotal = thisWeek.rows.reduce((sum, row) => sum + parseFloat(row.hours_contributed), 0);
    console.log(`\n   📈 Total This Week: ${thisWeekTotal.toFixed(3)} hours`);

    // Last week's data
    const lastWeek = await client.query(`
      SELECT
        created_at,
        total_questions,
        (total_questions * 1.5 / 60.0) as hours_contributed
      FROM quiz_sessions
      WHERE user_id = $1
        AND created_at >= date_trunc('week', CURRENT_DATE - INTERVAL '7 days')
        AND created_at < date_trunc('week', CURRENT_DATE)
      ORDER BY created_at DESC
    `, [userId]);

    console.log('\n\n🗓️  LAST WEEK (Previous Monday-Sunday):\n');
    if (lastWeek.rows.length === 0) {
      console.log('   ❌ No quiz sessions last week');
    } else {
      lastWeek.rows.forEach((row, i) => {
        console.log(`   ${i + 1}. ${row.created_at.toISOString().split('T')[0]} ${row.created_at.toISOString().split('T')[1].substring(0, 5)}`);
        console.log(`      Questions: ${row.total_questions}`);
        console.log(`      Calculation: ${row.total_questions} questions × 1.5 min/question ÷ 60 = ${parseFloat(row.hours_contributed).toFixed(3)} hours`);
      });
    }

    const lastWeekTotal = lastWeek.rows.reduce((sum, row) => sum + parseFloat(row.hours_contributed), 0);
    console.log(`\n   📈 Total Last Week: ${lastWeekTotal.toFixed(3)} hours`);

    // Difference calculation
    console.log('\n\n═'.repeat(60));
    console.log('\n💡 FINAL CALCULATION:\n');
    console.log(`   This Week:  ${thisWeekTotal.toFixed(3)} hours (rounded to ${Math.round(thisWeekTotal * 10) / 10}h)`);
    console.log(`   Last Week:  ${lastWeekTotal.toFixed(3)} hours (rounded to ${Math.round(lastWeekTotal * 10) / 10}h)`);
    console.log(`   Difference: ${thisWeekTotal.toFixed(3)} - ${lastWeekTotal.toFixed(3)} = ${(thisWeekTotal - lastWeekTotal).toFixed(3)} hours`);
    console.log(`   Rounded:    ${Math.round((thisWeekTotal - lastWeekTotal) * 10) / 10}h`);

    const diff = thisWeekTotal - lastWeekTotal;
    if (diff > 0) {
      console.log(`\n   ✅ Improvement! You studied ${Math.abs(diff).toFixed(1)}h MORE than last week`);
    } else if (diff < 0) {
      console.log(`\n   ⚠️  You studied ${Math.abs(diff).toFixed(1)}h LESS than last week`);
    } else {
      console.log(`\n   ⚖️  Same as last week`);
    }

    console.log('\n📝 FORMULA EXPLANATION:\n');
    console.log('   Study Time (hours) = Total Questions × 1.5 minutes ÷ 60');
    console.log('   ');
    console.log('   Why 1.5 min/question?');
    console.log('   - Average time to read question: 30 seconds');
    console.log('   - Average time to think & answer: 45 seconds');
    console.log('   - Average time to check result: 15 seconds');
    console.log('   - Total: ~1.5 minutes per question');
    console.log('   ');
    console.log('   Week Range:');
    console.log('   - This Week: Current Monday 00:00 → Now');
    console.log('   - Last Week: Previous Monday 00:00 → Sunday 23:59');
    console.log('   ');
    console.log('   Difference = This Week - Last Week');

    console.log('\n═'.repeat(60));
    console.log('\n');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

explainCalculation().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
