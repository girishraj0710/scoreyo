import { Pool } from 'pg';
import { config } from 'dotenv';

config({ path: '.env.local' });

async function check() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
  });

  const result = await pool.query("SELECT DISTINCT topic_id FROM english_questions WHERE path_id='foundation' ORDER BY topic_id");
  console.log('\n📋 Actual topics in database:\n');
  result.rows.forEach(r => console.log('   - ' + r.topic_id));
  await pool.end();
}

check();
