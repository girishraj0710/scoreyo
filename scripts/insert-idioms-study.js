const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function insertIdiomsStudyMaterial() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔗 Connecting to database...');

    // Read the SQL file
    const sqlFile = path.join(__dirname, 'insert-idioms-expressions-study-material.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    console.log('📄 Executing SQL...');
    await pool.query(sql);

    console.log('✅ Successfully inserted study material for "Idioms & Expressions"!');

    // Verify insertion
    const result = await pool.query(`
      SELECT topic_id, title, subtitle, difficulty_level, estimated_time_minutes
      FROM topic_study_content
      WHERE topic_id = 'idioms-expressions' AND path_id = 'foundation'
    `);

    if (result.rows.length > 0) {
      console.log('\n📊 Verification:');
      console.log(JSON.stringify(result.rows[0], null, 2));
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

insertIdiomsStudyMaterial();
