import pg from 'pg';
import dotenv from 'dotenv';
const { Pool } = pg;

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

async function verify() {
  const client = await pool.connect();
  try {
    console.log('🔍 Verifying user_id types across tables...\n');

    // Check users table
    const usersSchema = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'users' AND column_name = 'id';
    `);
    console.log('📋 users.id:', usersSchema.rows[0].data_type);

    // Check flashcard_decks table
    const decksSchema = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'flashcard_decks' AND column_name = 'user_id';
    `);
    console.log('📋 flashcard_decks.user_id:', decksSchema.rows[0].data_type);

    // Check flashcard_deck_ratings table
    const ratingsSchema = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'flashcard_deck_ratings' AND column_name = 'user_id';
    `);
    console.log('📋 flashcard_deck_ratings.user_id:', ratingsSchema.rows[0].data_type);

    // Sample user IDs
    const sample = await client.query(`
      SELECT id FROM users LIMIT 3;
    `);
    console.log('\n📝 Sample user IDs from users table:');
    sample.rows.forEach(row => {
      console.log(`   - ${row.id} (type: ${typeof row.id})`);
    });

    // Check rating with specific user
    const testUserId = sample.rows[0]?.id;
    if (testUserId) {
      const rating = await client.query(`
        SELECT deck_id, user_id, rating
        FROM flashcard_deck_ratings
        WHERE user_id = $1
        LIMIT 1;
      `, [testUserId]);

      console.log(`\n🧪 Test query for user_id=${testUserId}:`);
      if (rating.rows.length > 0) {
        console.log(`   ✅ Found rating:`, rating.rows[0]);
      } else {
        console.log(`   ❌ No ratings found for this user`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

verify();
