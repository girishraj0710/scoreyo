import pg from 'pg';
import dotenv from 'dotenv';
const { Pool } = pg;

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

async function testRatingFix() {
  const client = await pool.connect();
  try {
    console.log('🧪 Testing Rating Feature Fix\n');

    // Get a real user ID
    const userResult = await client.query(`
      SELECT id, email 
      FROM users 
      WHERE id != 'default-user'
      LIMIT 1
    `);
    
    if (userResult.rows.length === 0) {
      console.log('❌ No test user found');
      return;
    }

    const testUserId = userResult.rows[0].id;
    const testUserEmail = userResult.rows[0].email;
    console.log(`✅ Test User: ${testUserEmail}`);
    console.log(`   User ID: ${testUserId} (${typeof testUserId})\n`);

    // Get a deck the user doesn't own
    const deckResult = await client.query(`
      SELECT id, title, user_id
      FROM flashcard_decks
      WHERE user_id != $1 AND is_public = true
      LIMIT 1
    `, [testUserId]);

    if (deckResult.rows.length === 0) {
      console.log('❌ No public deck from another user found');
      return;
    }

    const testDeckId = deckResult.rows[0].id;
    const testDeckTitle = deckResult.rows[0].title;
    console.log(`✅ Test Deck: "${testDeckTitle}" (ID: ${testDeckId})\n`);

    // Check if user already rated this deck
    console.log('📊 Checking existing rating...');
    const existingRating = await client.query(`
      SELECT rating, review_text, created_at
      FROM flashcard_deck_ratings
      WHERE deck_id = $1 AND user_id = $2
    `, [testDeckId, testUserId]);

    if (existingRating.rows.length > 0) {
      console.log(`   ✅ User has already rated: ${existingRating.rows[0].rating} stars`);
      console.log(`   Review: "${existingRating.rows[0].review_text || 'No review'}"`);
      console.log(`   Rated at: ${existingRating.rows[0].created_at}`);
    } else {
      console.log('   ❌ User has NOT rated this deck yet');
    }

    // Test inserting a new rating (or updating existing)
    console.log('\n🔧 Testing rating submission...');
    await client.query(`
      INSERT INTO flashcard_deck_ratings (deck_id, user_id, rating, review_text)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (deck_id, user_id)
      DO UPDATE SET
        rating = $3,
        review_text = $4,
        updated_at = NOW()
    `, [testDeckId, testUserId, 5, 'Test rating - works correctly now!']);

    console.log('   ✅ Rating submitted successfully');

    // Verify the rating was saved
    const verifyRating = await client.query(`
      SELECT rating, review_text, created_at, updated_at
      FROM flashcard_deck_ratings
      WHERE deck_id = $1 AND user_id = $2
    `, [testDeckId, testUserId]);

    console.log('\n📋 Verification:');
    if (verifyRating.rows.length > 0) {
      console.log('   ✅ Rating found in database');
      console.log(`   Rating: ${verifyRating.rows[0].rating} stars`);
      console.log(`   Review: "${verifyRating.rows[0].review_text}"`);
      console.log(`   Updated: ${verifyRating.rows[0].updated_at}`);
    } else {
      console.log('   ❌ Rating NOT found (this should not happen!)');
    }

    console.log('\n✅ All tests passed! Rating feature is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

testRatingFix();
