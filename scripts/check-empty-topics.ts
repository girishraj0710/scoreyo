import { Pool } from 'pg';
import { config } from 'dotenv';

config({ path: '.env.local' });

async function checkEmptyTopics() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    // Get all topics with their question counts
    const result = await pool.query(`
      SELECT topic_id, path_id, COUNT(*) as count
      FROM english_questions
      GROUP BY topic_id, path_id
      ORDER BY count ASC, topic_id
      LIMIT 40
    `);

    console.log('\n📊 Topics with Fewest Questions:\n');
    console.log('─'.repeat(80));

    result.rows.forEach((row, idx) => {
      const status = row.count === '0' ? '❌ EMPTY' :
                     row.count <= 5 ? '⚠️  CRITICAL' :
                     row.count <= 10 ? '⚠️  LOW' : '✓';
      console.log(`${String(idx + 1).padStart(2)}. ${row.topic_id.padEnd(35)} ${row.path_id.padEnd(20)} ${String(row.count).padStart(4)} ${status}`);
    });

    // Also check which Foundation topics from the curriculum have NO questions
    const foundationTopics = [
      'alphabet-basics', 'phonics-vowels', 'pronunciation-basics',
      'parts-of-speech', 'nouns-detailed', 'pronouns-detailed', 'articles',
      'adjectives', 'adverbs-complete', 'verbs-basics', 'prepositions-mastery',
      'there-is-are', 'question-formation', 'imperative-mood',
      'present-simple-complete', 'present-continuous-complete', 'past-simple-complete',
      'past-continuous-complete', 'future-tenses', 'present-perfect-complete',
      'present-perfect-continuous', 'past-perfect', 'tense-comparison',
      'modal-verbs', 'passive-voice', 'active-passive-conversion',
      'gerunds-infinitives', 'quantifiers-determiners', 'tag-questions', 'used-to-would',
      'reported-speech', 'conditionals', 'relative-clauses', 'sentence-types',
      'conjunctions-connectors', 'time-sequence',
      'essential-vocabulary', 'synonyms-antonyms', 'phrasal-verbs', 'idioms-expressions',
      'speaking-basics', 'writing-basics', 'common-mistakes'
    ];

    console.log('\n\n🔍 Foundation Topics Status Check:\n');
    console.log('─'.repeat(80));

    for (const topicId of foundationTopics) {
      const countResult = await pool.query(
        `SELECT COUNT(*) as count FROM english_questions WHERE topic_id = $1 AND path_id = 'foundation'`,
        [topicId]
      );

      const count = parseInt(countResult.rows[0].count);
      const status = count === 0 ? '❌ EMPTY' :
                     count <= 5 ? '⚠️  CRITICAL' :
                     count <= 10 ? '⚠️  LOW' :
                     count <= 20 ? '✓ OK' : '✅ GOOD';

      if (count <= 20) {
        console.log(`${topicId.padEnd(35)} ${String(count).padStart(4)} questions ${status}`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

checkEmptyTopics();
