import { Pool } from 'pg';
import { config } from 'dotenv';

config({ path: '.env.local' });

async function finalCleanup() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('🧹 FINAL CLEANUP\n');

    // 1. Remove questions with != 4 options
    const wrongOptionsResult = await pool.query(`
      SELECT id, options
      FROM english_questions
      WHERE json_array_length(options::json) != 4
    `);

    if (wrongOptionsResult.rows.length > 0) {
      console.log(`Found ${wrongOptionsResult.rows.length} questions with wrong option count`);
      wrongOptionsResult.rows.forEach(row => {
        console.log(`   ID ${row.id}: ${row.options}`);
      });

      await pool.query(`
        DELETE FROM english_questions
        WHERE json_array_length(options::json) != 4
      `);

      console.log(`✅ Deleted ${wrongOptionsResult.rows.length} questions\n`);
    }

    // 2. Remove remaining duplicates (generic questions)
    const dupResult = await pool.query(`
      WITH duplicates AS (
        SELECT
          id,
          question,
          options,
          ROW_NUMBER() OVER (PARTITION BY question, options ORDER BY id) as rn
        FROM english_questions
      )
      SELECT id FROM duplicates WHERE rn > 1
    `);

    if (dupResult.rows.length > 0) {
      console.log(`Found ${dupResult.rows.length} remaining duplicates`);

      await pool.query(`
        WITH duplicates AS (
          SELECT
            id,
            ROW_NUMBER() OVER (PARTITION BY question, options ORDER BY id) as rn
          FROM english_questions
        )
        DELETE FROM english_questions
        WHERE id IN (SELECT id FROM duplicates WHERE rn > 1)
      `);

      console.log(`✅ Deleted ${dupResult.rows.length} duplicates\n`);
    }

    // 3. Final count
    const finalResult = await pool.query('SELECT COUNT(*) FROM english_questions');
    console.log(`✅ Final count: ${finalResult.rows[0].count} questions`);

    // 4. Verify all reading comprehension have passages
    const rcResult = await pool.query(`
      SELECT COUNT(*) as total,
             MIN(length(question)) as min_len,
             MAX(length(question)) as max_len,
             AVG(length(question))::int as avg_len
      FROM english_questions
      WHERE topic_id = 'reading-comprehension'
    `);

    if (rcResult.rows.length > 0) {
      const rc = rcResult.rows[0];
      console.log(`\n📚 Reading Comprehension validation:`);
      console.log(`   Total: ${rc.total}`);
      console.log(`   Min length: ${rc.min_len} chars`);
      console.log(`   Max length: ${rc.max_len} chars`);
      console.log(`   Avg length: ${rc.avg_len} chars`);
    }

    // 5. Sample a reading comprehension question
    const sampleResult = await pool.query(`
      SELECT id, question
      FROM english_questions
      WHERE topic_id = 'reading-comprehension'
      ORDER BY RANDOM()
      LIMIT 1
    `);

    if (sampleResult.rows.length > 0) {
      console.log(`\n📖 Sample reading comprehension question (ID ${sampleResult.rows[0].id}):`);
      console.log(sampleResult.rows[0].question.substring(0, 500) + '...\n');
    }

    console.log('✅ CLEANUP COMPLETE!\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

finalCleanup();
