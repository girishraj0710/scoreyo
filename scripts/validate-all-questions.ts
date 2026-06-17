import { Pool } from 'pg';
import { config } from 'dotenv';

config({ path: '.env.local' });

async function validateAllQuestions() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('🔍 COMPREHENSIVE VALIDATION REPORT\n');
    console.log('='  .repeat(60));

    // 1. Total count
    const totalResult = await pool.query('SELECT COUNT(*) FROM english_questions');
    console.log(`\n✅ Total questions: ${totalResult.rows[0].count}`);

    // 2. Check for duplicates
    const dupResult = await pool.query(`
      SELECT question, COUNT(*) as count
      FROM english_questions
      GROUP BY question
      HAVING COUNT(*) > 1
      LIMIT 10
    `);
    console.log(`\n🔍 Duplicate questions: ${dupResult.rows.length > 0 ? `${dupResult.rows.length} found` : 'None'}`);
    if (dupResult.rows.length > 0) {
      dupResult.rows.forEach(row => {
        console.log(`   ⚠️  "${row.question.substring(0, 80)}..." (${row.count} times)`);
      });
    }

    // 3. Validate JSON options
    const optionsResult = await pool.query(`
      SELECT id, options
      FROM english_questions
      WHERE options NOT LIKE '[%]' OR options NOT LIKE '%]'
      LIMIT 5
    `);
    console.log(`\n🔍 Invalid options format: ${optionsResult.rows.length > 0 ? `${optionsResult.rows.length} found` : 'None'}`);
    if (optionsResult.rows.length > 0) {
      optionsResult.rows.forEach(row => {
        console.log(`   ⚠️  ID ${row.id}: ${row.options}`);
      });
    }

    // 4. Validate correct_answer index (should be 0-3)
    const answerResult = await pool.query(`
      SELECT id, correct_answer, options
      FROM english_questions
      WHERE correct_answer < 0 OR correct_answer > 3
      LIMIT 5
    `);
    console.log(`\n🔍 Invalid correct_answer: ${answerResult.rows.length > 0 ? `${answerResult.rows.length} found` : 'None'}`);
    if (answerResult.rows.length > 0) {
      answerResult.rows.forEach(row => {
        console.log(`   ⚠️  ID ${row.id}: correct_answer=${row.correct_answer}`);
      });
    }

    // 5. Check option count (should be 4 options each)
    const optionCountResult = await pool.query(`
      SELECT id, options,
             (LENGTH(options) - LENGTH(REPLACE(options, '","', ''))) / 2 + 1 as option_count
      FROM english_questions
      WHERE (LENGTH(options) - LENGTH(REPLACE(options, '","', ''))) / 2 + 1 != 4
      LIMIT 10
    `);
    console.log(`\n🔍 Questions with != 4 options: ${optionCountResult.rows.length > 0 ? `${optionCountResult.rows.length} found` : 'None'}`);
    if (optionCountResult.rows.length > 0) {
      optionCountResult.rows.forEach(row => {
        console.log(`   ⚠️  ID ${row.id}: ${row.option_count} options`);
      });
    }

    // 6. Check for empty/null fields
    const emptyFieldsResult = await pool.query(`
      SELECT
        COUNT(CASE WHEN question = '' OR question IS NULL THEN 1 END) as empty_questions,
        COUNT(CASE WHEN options = '' OR options IS NULL THEN 1 END) as empty_options,
        COUNT(CASE WHEN explanation = '' OR explanation IS NULL THEN 1 END) as empty_explanations
      FROM english_questions
    `);
    console.log('\n🔍 Empty fields:');
    const empty = emptyFieldsResult.rows[0];
    console.log(`   Questions: ${empty.empty_questions}`);
    console.log(`   Options: ${empty.empty_options}`);
    console.log(`   Explanations: ${empty.empty_explanations}`);

    // 7. Path distribution
    const pathResult = await pool.query(`
      SELECT path_id, COUNT(*) as count
      FROM english_questions
      GROUP BY path_id
      ORDER BY count DESC
    `);
    console.log('\n📊 Distribution by path:');
    pathResult.rows.forEach(row => {
      const pct = ((row.count / totalResult.rows[0].count) * 100).toFixed(1);
      console.log(`   ${row.path_id.padEnd(20)} ${String(row.count).padStart(5)} (${pct}%)`);
    });

    // 8. Level distribution
    const levelResult = await pool.query(`
      SELECT level, COUNT(*) as count
      FROM english_questions
      GROUP BY level
      ORDER BY count DESC
    `);
    console.log('\n📊 Distribution by level:');
    levelResult.rows.forEach(row => {
      const pct = ((row.count / totalResult.rows[0].count) * 100).toFixed(1);
      console.log(`   ${row.level.padEnd(20)} ${String(row.count).padStart(5)} (${pct}%)`);
    });

    // 9. Difficulty distribution
    const diffResult = await pool.query(`
      SELECT difficulty, COUNT(*) as count
      FROM english_questions
      GROUP BY difficulty
      ORDER BY count DESC
    `);
    console.log('\n📊 Distribution by difficulty:');
    diffResult.rows.forEach(row => {
      const pct = ((row.count / totalResult.rows[0].count) * 100).toFixed(1);
      console.log(`   ${row.difficulty.padEnd(20)} ${String(row.count).padStart(5)} (${pct}%)`);
    });

    // 10. Check reading comprehension questions specifically
    const rcResult = await pool.query(`
      SELECT COUNT(*) as total,
             COUNT(CASE WHEN length(question) > 500 THEN 1 END) as with_passage,
             COUNT(CASE WHEN length(question) <= 500 THEN 1 END) as short
      FROM english_questions
      WHERE topic_id = 'reading-comprehension'
    `);
    console.log('\n📚 Reading comprehension analysis:');
    const rc = rcResult.rows[0];
    console.log(`   Total: ${rc.total}`);
    console.log(`   With embedded passage (>500 chars): ${rc.with_passage}`);
    console.log(`   Short questions (<=500 chars): ${rc.short}`);

    // 11. Sample questions from each path
    console.log('\n📝 Sample questions from each path:');
    for (const path of pathResult.rows) {
      const sampleResult = await pool.query(`
        SELECT id, topic_id, level, substring(question, 1, 80) as preview
        FROM english_questions
        WHERE path_id = $1
        ORDER BY RANDOM()
        LIMIT 1
      `, [path.path_id]);

      if (sampleResult.rows.length > 0) {
        const s = sampleResult.rows[0];
        console.log(`\n   [${path.path_id}]`);
        console.log(`   ID: ${s.id} | Topic: ${s.topic_id} | Level: ${s.level}`);
        console.log(`   "${s.preview}..."`);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ VALIDATION COMPLETE\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

validateAllQuestions();
