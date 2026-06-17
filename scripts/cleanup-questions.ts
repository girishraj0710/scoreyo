import { Pool } from 'pg';
import { config } from 'dotenv';

config({ path: '.env.local' });

async function cleanupQuestions() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('🧹 STARTING CLEANUP PROCESS\n');
    console.log('='.repeat(60));

    // 1. Count initial questions
    const initialResult = await pool.query('SELECT COUNT(*) FROM english_questions');
    const initialCount = parseInt(initialResult.rows[0].count);
    console.log(`\n📊 Initial count: ${initialCount} questions`);

    // 2. Remove questions with wrong option count (not 4 options)
    console.log('\n🔧 Checking option counts...');

    const wrongOptionResult = await pool.query(`
      SELECT id, options,
             json_array_length(options::json) as option_count
      FROM english_questions
      WHERE json_array_length(options::json) != 4
    `);

    console.log(`   Found ${wrongOptionResult.rows.length} questions with != 4 options`);

    if (wrongOptionResult.rows.length > 0) {
      const idsToDelete = wrongOptionResult.rows.map(r => r.id);
      console.log(`   Deleting IDs: ${idsToDelete.join(', ')}`);

      await pool.query(`
        DELETE FROM english_questions
        WHERE id = ANY($1)
      `, [idsToDelete]);

      console.log(`   ✅ Deleted ${wrongOptionResult.rows.length} questions with wrong option count`);
    }

    // 3. Check reading comprehension questions for passages
    console.log('\n🔧 Checking reading comprehension questions...');

    const rcQuestionsResult = await pool.query(`
      SELECT id, question, length(question) as q_len
      FROM english_questions
      WHERE topic_id = 'reading-comprehension'
    `);

    console.log(`   Found ${rcQuestionsResult.rows.length} reading comprehension questions`);

    const invalidRC = [];

    for (const row of rcQuestionsResult.rows) {
      const question = row.question;
      const hasPassageKeyword =
        question.includes('passage') ||
        question.includes('paragraph') ||
        question.includes('Read the following') ||
        question.includes('Read:');

      // If it references a passage, check if passage is actually embedded (>300 chars is a good threshold)
      if (hasPassageKeyword && row.q_len < 300) {
        console.log(`   ⚠️  ID ${row.id}: References passage but too short (${row.q_len} chars)`);
        invalidRC.push(row.id);
      }

      // If it doesn't reference a passage but is reading comprehension, also invalid
      if (!hasPassageKeyword) {
        console.log(`   ⚠️  ID ${row.id}: No passage reference found`);
        invalidRC.push(row.id);
      }
    }

    if (invalidRC.length > 0) {
      await pool.query(`
        DELETE FROM english_questions
        WHERE id = ANY($1)
      `, [invalidRC]);

      console.log(`   ✅ Deleted ${invalidRC.length} invalid reading comprehension questions`);
    } else {
      console.log(`   ✅ All reading comprehension questions have valid passages`);
    }

    // 4. Remove duplicates (keep the one with lowest ID)
    console.log('\n🔧 Removing duplicate questions...');

    const duplicatesResult = await pool.query(`
      WITH duplicates AS (
        SELECT
          id,
          question,
          options,
          ROW_NUMBER() OVER (PARTITION BY question, options ORDER BY id) as rn
        FROM english_questions
      )
      SELECT id, substring(question, 1, 80) as preview
      FROM duplicates
      WHERE rn > 1
      ORDER BY id
    `);

    console.log(`   Found ${duplicatesResult.rows.length} duplicate questions to remove`);

    if (duplicatesResult.rows.length > 0) {
      // Show sample
      console.log(`   Sample duplicates:`);
      duplicatesResult.rows.slice(0, 5).forEach(row => {
        console.log(`      ID ${row.id}: "${row.preview}..."`);
      });

      const dupIds = duplicatesResult.rows.map(r => r.id);
      await pool.query(`
        DELETE FROM english_questions
        WHERE id = ANY($1)
      `, [dupIds]);

      console.log(`   ✅ Deleted ${duplicatesResult.rows.length} duplicate questions`);
    } else {
      console.log(`   ✅ No duplicates found`);
    }

    // 5. Standardize difficulty values
    console.log('\n🔧 Standardizing difficulty values...');

    // Check current difficulty distribution
    const diffBeforeResult = await pool.query(`
      SELECT difficulty, COUNT(*) as count
      FROM english_questions
      GROUP BY difficulty
      ORDER BY count DESC
    `);

    console.log('   Current distribution:');
    diffBeforeResult.rows.forEach(row => {
      console.log(`      ${row.difficulty}: ${row.count}`);
    });

    // Standardize to: easy, medium, hard
    // Map: beginner → easy, intermediate → medium, advanced → hard
    await pool.query(`
      UPDATE english_questions
      SET difficulty = CASE
        WHEN difficulty = 'beginner' THEN 'easy'
        WHEN difficulty = 'intermediate' THEN 'medium'
        WHEN difficulty = 'advanced' THEN 'hard'
        ELSE difficulty
      END
      WHERE difficulty IN ('beginner', 'intermediate', 'advanced')
    `);

    const diffAfterResult = await pool.query(`
      SELECT difficulty, COUNT(*) as count
      FROM english_questions
      GROUP BY difficulty
      ORDER BY count DESC
    `);

    console.log('   After standardization:');
    diffAfterResult.rows.forEach(row => {
      console.log(`      ${row.difficulty}: ${row.count}`);
    });

    console.log(`   ✅ Difficulty values standardized`);

    // 6. Final count and report
    console.log('\n' + '='.repeat(60));
    console.log('📊 FINAL REPORT\n');

    const finalResult = await pool.query('SELECT COUNT(*) FROM english_questions');
    const finalCount = parseInt(finalResult.rows[0].count);
    const removed = initialCount - finalCount;

    console.log(`Initial count:    ${initialCount}`);
    console.log(`Questions removed: ${removed}`);
    console.log(`Final count:      ${finalCount}`);
    console.log(`Retention rate:   ${((finalCount / initialCount) * 100).toFixed(1)}%`);

    // Distribution report
    const pathResult = await pool.query(`
      SELECT path_id, COUNT(*) as count
      FROM english_questions
      GROUP BY path_id
      ORDER BY count DESC
    `);

    console.log('\n📊 Distribution by path:');
    pathResult.rows.forEach(row => {
      const pct = ((row.count / finalCount) * 100).toFixed(1);
      console.log(`   ${row.path_id.padEnd(20)} ${String(row.count).padStart(5)} (${pct}%)`);
    });

    const levelResult = await pool.query(`
      SELECT level, COUNT(*) as count
      FROM english_questions
      GROUP BY level
      ORDER BY count DESC
    `);

    console.log('\n📊 Distribution by level:');
    levelResult.rows.forEach(row => {
      const pct = ((row.count / finalCount) * 100).toFixed(1);
      console.log(`   ${row.level.padEnd(20)} ${String(row.count).padStart(5)} (${pct}%)`);
    });

    // Check for remaining issues
    const remainingIssuesResult = await pool.query(`
      SELECT
        COUNT(CASE WHEN json_array_length(options::json) != 4 THEN 1 END) as wrong_options,
        COUNT(CASE WHEN question = '' OR question IS NULL THEN 1 END) as empty_questions,
        COUNT(CASE WHEN options = '' OR options IS NULL THEN 1 END) as empty_options,
        COUNT(CASE WHEN explanation = '' OR explanation IS NULL THEN 1 END) as empty_explanations
      FROM english_questions
    `);

    console.log('\n🔍 Remaining issues:');
    const issues = remainingIssuesResult.rows[0];
    console.log(`   Wrong option count: ${issues.wrong_options}`);
    console.log(`   Empty questions: ${issues.empty_questions}`);
    console.log(`   Empty options: ${issues.empty_options}`);
    console.log(`   Empty explanations: ${issues.empty_explanations}`);

    const allClean = Object.values(issues).every(v => v === '0');

    if (allClean) {
      console.log('\n✅ ALL ISSUES RESOLVED! Database is clean.\n');
    } else {
      console.log('\n⚠️  Some issues remain. Review needed.\n');
    }

    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

cleanupQuestions();
