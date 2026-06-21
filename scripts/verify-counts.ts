import { Pool } from 'pg';
import { config } from 'dotenv';

config({ path: '.env.local' });

async function verify() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
  });

  const topics = [
    'adjectives',
    'pronunciation-basics',
    'adverbs-complete',
    'there-is-are',
    'question-formation'
  ];

  console.log('\n📊 Counts for completed topics:\n');

  for (const topic of topics) {
    const result = await pool.query(
      "SELECT COUNT(*) FROM english_questions WHERE path_id='foundation' AND topic_id=$1",
      [topic]
    );
    console.log(`   ${topic}: ${result.rows[0].count}`);
  }

  await pool.end();
}

verify();
