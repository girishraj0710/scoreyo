import { Pool } from 'pg';
import { config } from 'dotenv';

config({ path: '.env.local' });

async function debugQuestions() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    // Check those specific IDs
    const ids = [5643, 5644, 5645, 5646, 5647, 5648, 5649, 5650, 5651, 5652];
    
    const result = await pool.query(`
      SELECT id, question, options
      FROM english_questions
      WHERE id = ANY($1)
    `, [ids]);

    console.log(`Found ${result.rows.length} questions with IDs ${ids.join(', ')}\n`);

    result.rows.forEach(row => {
      console.log(`\n--- ID ${row.id} ---`);
      console.log(`Question: ${row.question.substring(0, 100)}...`);
      console.log(`Options: ${row.options}`);
      
      try {
        const parsed = JSON.parse(row.options);
        console.log(`Options count: ${parsed.length}`);
      } catch (e) {
        console.log(`ERROR parsing JSON: ${e}`);
      }
    });

    // Also check for generic duplicate questions
    const dupResult = await pool.query(`
      SELECT question, COUNT(*) as count, array_agg(id) as ids
      FROM english_questions
      WHERE question IN (
        'Choose the correct sentence:',
        'Which sentence uses quotation marks correctly?',
        'Which is correct?',
        'Select the correct sentence:',
        'Which sentence is correct?'
      )
      GROUP BY question
      HAVING COUNT(*) > 1
    `);

    if (dupResult.rows.length > 0) {
      console.log('\n\nGeneric duplicates:');
      dupResult.rows.forEach(row => {
        console.log(`\n"${row.question}": ${row.count} times`);
        console.log(`IDs: ${row.ids.join(', ')}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

debugQuestions();
