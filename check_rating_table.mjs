import pg from 'pg';
import dotenv from 'dotenv';
const { Pool } = pg;

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

async function checkRatingTable() {
  const client = await pool.connect();
  try {
    console.log('🔍 Checking flashcard_deck_ratings table...\n');

    // Get table schema
    const schema = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'flashcard_deck_ratings'
      ORDER BY ordinal_position;
    `);
    
    console.log('📊 Table Schema:');
    schema.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type}`);
    });

    // Get sample data
    const sample = await client.query(`
      SELECT user_id, deck_id, rating, created_at
      FROM flashcard_deck_ratings
      LIMIT 5;
    `);
    
    console.log('\n📝 Sample Data:');
    sample.rows.forEach(row => {
      console.log(`  - user_id: ${row.user_id} (type: ${typeof row.user_id})`);
      console.log(`    deck_id: ${row.deck_id}`);
      console.log(`    rating: ${row.rating}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

checkRatingTable();
