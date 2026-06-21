import { Pool } from 'pg';
import { config } from 'dotenv';

config({ path: '.env.local' });

async function findZeroTopics() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
  });

  // Get all foundation topics from the database
  const allTopics = await pool.query(
    "SELECT DISTINCT topic_id FROM english_questions WHERE path_id='foundation' ORDER BY topic_id"
  );

  console.log('\n📋 ALL Foundation topics in database:\n');

  for (const topic of allTopics.rows) {
    const count = await pool.query(
      "SELECT COUNT(*) FROM english_questions WHERE path_id='foundation' AND topic_id=$1",
      [topic.topic_id]
    );

    const num = parseInt(count.rows[0].count);
    const status = num === 0 ? '❌' : num < 40 ? '⏳' : '✅';
    console.log(`${status} ${topic.topic_id.padEnd(40)} ${num} questions`);
  }

  await pool.end();
}

findZeroTopics();
