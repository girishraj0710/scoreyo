import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

async function findIncompleteQuestions() {
  console.log('🔍 Finding incomplete questions...\n');

  try {
    // Find questions with issues:
    // 1. Very short question_text (< 20 chars)
    // 2. Missing passage when passage_id exists
    // 3. Incomplete options (less than 4 options)
    // 4. Empty explanation

    const result = await pool.query(`
      SELECT
        id,
        topic_id,
        question,
        options,
        correct_answer,
        explanation,
        passage,
        LENGTH(question) as question_length
      FROM english_questions
      WHERE
        LENGTH(question) < 20  -- Very short questions
        OR options IS NULL
        OR jsonb_array_length(options) < 4  -- Less than 4 options
        OR explanation IS NULL
        OR explanation = ''
        OR question ILIKE '%[%'  -- Contains placeholder like [sentence]
        OR question ILIKE '%____%'  -- Contains blank like ____
      ORDER BY id
      LIMIT 50;
    `);

    console.log(`Found ${result.rows.length} potentially incomplete questions:\n`);

    result.rows.forEach((row, idx) => {
      console.log(`${idx + 1}. ID: ${row.id}`);
      console.log(`   Topic: ${row.topic_id}`);
      console.log(`   Question (${row.question_length} chars): "${row.question}"`);
      console.log(`   Options: ${row.options ? JSON.stringify(row.options).substring(0, 100) : 'NULL'}`);
      console.log(`   Answer: ${row.correct_answer}`);
      console.log(`   Explanation: ${row.explanation ? row.explanation.substring(0, 100) : 'NULL'}`);
      console.log('');
    });

    // Also find questions with just single words (like "hard")
    const singleWordQuestions = await pool.query(`
      SELECT
        id,
        topic_id,
        question,
        options
      FROM english_questions
      WHERE
        question !~ ' '  -- No spaces (single word)
      ORDER BY id;
    `);

    if (singleWordQuestions.rows.length > 0) {
      console.log(`\n⚠️  Found ${singleWordQuestions.rows.length} single-word questions:\n`);
      singleWordQuestions.rows.forEach((row) => {
        console.log(`ID ${row.id}: "${row.question}" (Topic: ${row.topic_id})`);
      });
    }

    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

findIncompleteQuestions();
