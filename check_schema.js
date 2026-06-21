const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkSchema() {
  try {
    // Get table schema
    const schema = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'topic_study_content'
      ORDER BY ordinal_position
    `);

    console.log('Table schema:');
    schema.rows.forEach(row => {
      console.log(`  ${row.column_name}: ${row.data_type}`);
    });

    // Get sample row
    const sample = await pool.query(`
      SELECT *
      FROM topic_study_content
      WHERE subject_id = 'english'
      LIMIT 1
    `);

    if (sample.rows.length > 0) {
      console.log('\nSample row columns:', Object.keys(sample.rows[0]));
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

checkSchema();
