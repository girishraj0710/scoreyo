import { Pool } from 'pg';
import { config } from 'dotenv';

config({ path: '.env.local' });

async function checkQuestions() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    // Check for reading comprehension questions
    const rcResult = await pool.query(
      "SELECT COUNT(*) FROM english_questions WHERE topic_id = 'reading-comprehension'"
    );
    console.log('📚 Reading comprehension questions:', rcResult.rows[0].count);

    // Check for long questions (passages embedded)
    const longResult = await pool.query(
      "SELECT COUNT(*) FROM english_questions WHERE length(question) > 500"
    );
    console.log('📝 Long questions (>500 chars):', longResult.rows[0].count);

    // Sample a reading comprehension question
    const sampleResult = await pool.query(
      "SELECT id, topic_id, substring(question, 1, 300) as preview FROM english_questions WHERE topic_id = 'reading-comprehension' LIMIT 1"
    );

    if (sampleResult.rows.length > 0) {
      console.log('\n📖 Sample reading comprehension question:');
      console.log('ID:', sampleResult.rows[0].id);
      console.log('Preview:', sampleResult.rows[0].preview + '...');
    }

    // Check topics distribution
    const topicsResult = await pool.query(`
      SELECT topic_id, COUNT(*) as count
      FROM english_questions
      GROUP BY topic_id
      ORDER BY count DESC
      LIMIT 10
    `);

    console.log('\n📊 Top 10 topics:');
    topicsResult.rows.forEach(row => {
      console.log(`   ${row.topic_id}: ${row.count}`);
    });

    // Check for empty/invalid questions
    const invalidResult = await pool.query(`
      SELECT COUNT(*) FROM english_questions
      WHERE question = '' OR question IS NULL
         OR options = '' OR options IS NULL
         OR explanation = '' OR explanation IS NULL
    `);
    console.log('\n⚠️  Invalid questions (empty fields):', invalidResult.rows[0].count);

    // Check options format
    const badOptionsResult = await pool.query(`
      SELECT COUNT(*) FROM english_questions
      WHERE options NOT LIKE '[%]'
    `);
    console.log('⚠️  Bad options format (not JSON array):', badOptionsResult.rows[0].count);

    // Sample some random questions
    const randomResult = await pool.query(`
      SELECT id, path_id, topic_id, difficulty, substring(question, 1, 100) as q_preview
      FROM english_questions
      ORDER BY RANDOM()
      LIMIT 5
    `);

    console.log('\n🎲 Random sample questions:');
    randomResult.rows.forEach(row => {
      console.log(`   [${row.id}] ${row.path_id}/${row.topic_id} (${row.difficulty})`);
      console.log(`       "${row.q_preview}..."`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

checkQuestions();
