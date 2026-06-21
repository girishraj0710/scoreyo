import { Pool } from 'pg';
import { config } from 'dotenv';

config({ path: '.env.local' });

async function checkStatus() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    const result = await pool.query(`
      SELECT topic_id, COUNT(*) as count
      FROM english_questions
      WHERE path_id = 'foundation'
      GROUP BY topic_id
      ORDER BY topic_id
    `);

    console.log('\n📊 FOUNDATION QUESTIONS STATUS:\n');
    console.log('='.repeat(60));

    const topics = {
      'nouns-basics': 60,
      'pronouns-basics': 60,
      'adjectives-basics': 60,
      'pronunciation-basics': 60,
      'adverbs-basics': 60,
      'there-is-are': 40,
      'question-formation': 60,
      'imperative-mood': 40,
      'tense-comparison': 80,
      'passive-voice': 80,
      'active-passive-conversion': 60,
      'gerunds-infinitives': 80,
      'quantifiers-determiners': 60,
      'tag-questions': 60,
      'used-to-would': 60,
      'reported-speech': 80,
      'sentence-types': 80,
      'conjunctions-connectors': 60,
      'time-sequence': 60,
      'speaking-basics': 80
    };

    let total = 0;
    let completed = 0;

    for (const [topic, target] of Object.entries(topics)) {
      const row = result.rows.find(r => r.topic_id === topic);
      const current = row ? parseInt(row.count) : 0;
      total += target;
      completed += current;

      const status = current === target ? '✅' : current > 0 ? '⏳' : '❌';
      console.log(`${status} ${topic.padEnd(30)} ${current.toString().padStart(3)}/${target}`);
    }

    console.log('='.repeat(60));
    console.log(`\n📈 TOTAL: ${completed}/${total} (${Math.round(completed/total*100)}% complete)`);
    console.log(`🎯 REMAINING: ${total - completed} questions\n`);

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkStatus();
