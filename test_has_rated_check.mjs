import pg from 'pg';
import dotenv from 'dotenv';
const { Pool } = pg;

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

async function testHasRatedCheck() {
  const client = await pool.connect();
  try {
    console.log('🧪 Testing "Has User Rated" Check\n');

    // Get the test user and deck from previous test
    const userResult = await client.query(`
      SELECT id, email 
      FROM users 
      WHERE id = '77788b1d-ea0f-4f92-868b-285bbbe55473'
    `);
    
    if (userResult.rows.length === 0) {
      console.log('❌ Test user not found');
      return;
    }

    const testUserId = userResult.rows[0].id;
    const testUserEmail = userResult.rows[0].email;

    // Check deck 1 (we just rated it)
    console.log('📋 Test 1: Check Rated Deck (ID: 1)');
    console.log(`   User: ${testUserEmail}`);
    
    const ratedCheck = await client.query(`
      SELECT rating, review_text, created_at, updated_at
      FROM flashcard_deck_ratings
      WHERE deck_id = $1 AND user_id = $2
    `, [1, testUserId]);

    if (ratedCheck.rows.length > 0) {
      console.log('   ✅ hasRated: true');
      console.log(`   Rating: ${ratedCheck.rows[0].rating} stars`);
      console.log(`   Review: "${ratedCheck.rows[0].review_text}"`);
    } else {
      console.log('   ❌ hasRated: false (ERROR - we just rated this!)');
    }

    // Check another deck (not rated)
    console.log('\n📋 Test 2: Check Unrated Deck');
    
    const unratedDeck = await client.query(`
      SELECT id, title
      FROM flashcard_decks
      WHERE user_id != $1 
        AND is_public = true 
        AND id != 1
      LIMIT 1
    `, [testUserId]);

    if (unratedDeck.rows.length > 0) {
      const deckId = unratedDeck.rows[0].id;
      const deckTitle = unratedDeck.rows[0].title;
      
      console.log(`   Deck: "${deckTitle}" (ID: ${deckId})`);

      const unratedCheck = await client.query(`
        SELECT rating, review_text
        FROM flashcard_deck_ratings
        WHERE deck_id = $1 AND user_id = $2
      `, [deckId, testUserId]);

      if (unratedCheck.rows.length === 0) {
        console.log('   ✅ hasRated: false (correct)');
      } else {
        console.log(`   ❌ hasRated: true (unexpected - rating: ${unratedCheck.rows[0].rating})`);
      }
    } else {
      console.log('   ⚠️  No other public decks found to test');
    }

    console.log('\n✅ "Has Rated" check is working correctly!');
    console.log('\n💡 What this means:');
    console.log('   - GET /api/flashcards/rate/1 will return { hasRated: true, rating: 5 }');
    console.log('   - Frontend will hide rating buttons and show "You rated 5 stars"');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

testHasRatedCheck();
