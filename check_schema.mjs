import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

try {
  const result = await pool.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'topic_study_content'
    ORDER BY ordinal_position
  `);
  console.log('Table columns:');
  result.rows.forEach(row => console.log(`  ${row.column_name}: ${row.data_type}`));
  
  const sample = await pool.query(`SELECT * FROM topic_study_content WHERE subject_id = 'english' LIMIT 1`);
  console.log('\nSample row keys:', Object.keys(sample.rows[0]));
} finally {
  await pool.end();
}
