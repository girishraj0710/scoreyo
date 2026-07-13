import pg from 'pg';
import dotenv from 'dotenv';
const { Pool } = pg;

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

async function fixRatingsTable() {
  const client = await pool.connect();
  try {
    console.log('🔧 Fixing flashcard_deck_ratings.user_id type...\n');

    await client.query('BEGIN');

    // Check current data
    const currentData = await client.query(`
      SELECT COUNT(*) as count FROM flashcard_deck_ratings;
    `);
    console.log(`📊 Current ratings in table: ${currentData.rows[0].count}`);

    if (currentData.rows[0].count > 0) {
      console.log('⚠️  Table has data. Need to handle carefully...');
      
      // Since user_id is integer and users.id is text (UUID), 
      // the existing data is invalid and needs to be cleared
      console.log('\n⚠️  WARNING: Existing ratings have invalid user_ids');
      console.log('   They cannot be migrated because integer IDs don\'t match UUID text IDs');
      console.log('   Clearing existing ratings...');
      
      await client.query('DELETE FROM flashcard_deck_ratings');
      console.log('   ✅ Cleared invalid ratings');
    }

    // Drop and recreate with correct type
    console.log('\n🔨 Altering table structure...');
    
    // Drop foreign key constraint if exists
    await client.query(`
      ALTER TABLE flashcard_deck_ratings 
      DROP CONSTRAINT IF EXISTS flashcard_deck_ratings_user_id_fkey;
    `);

    // Change column type
    await client.query(`
      ALTER TABLE flashcard_deck_ratings 
      ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;
    `);
    console.log('   ✅ Changed user_id from INTEGER to TEXT');

    // Recreate unique constraint
    await client.query(`
      ALTER TABLE flashcard_deck_ratings
      DROP CONSTRAINT IF EXISTS flashcard_deck_ratings_deck_id_user_id_key;
    `);
    
    await client.query(`
      ALTER TABLE flashcard_deck_ratings
      ADD CONSTRAINT flashcard_deck_ratings_deck_id_user_id_key 
      UNIQUE (deck_id, user_id);
    `);
    console.log('   ✅ Recreated unique constraint');

    // Add foreign key to users table
    await client.query(`
      ALTER TABLE flashcard_deck_ratings
      ADD CONSTRAINT flashcard_deck_ratings_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    `);
    console.log('   ✅ Added foreign key to users table');

    await client.query('COMMIT');

    // Verify
    console.log('\n📊 Verification:');
    const schema = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'flashcard_deck_ratings' AND column_name = 'user_id';
    `);
    console.log(`   user_id type: ${schema.rows[0].data_type}`);

    console.log('\n✅ Fix complete! Users can now rate decks properly.');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

fixRatingsTable();
