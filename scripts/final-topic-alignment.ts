import { Pool } from 'pg';
import { config } from 'dotenv';

config({ path: '.env.local' });

async function finalTopicAlignment() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('🔧 FINAL TOPIC ALIGNMENT\n');

    // 1. Rename writing-skills to writing-basics
    const result = await pool.query(
      "UPDATE english_questions SET topic_id = 'writing-basics' WHERE topic_id = 'writing-skills' RETURNING id"
    );
    console.log(`✅ Renamed writing-skills → writing-basics (${result.rowCount} questions)\n`);

    // 2. Get final counts
    const pathCounts = await pool.query(`
      SELECT path_id, COUNT(*) as count
      FROM english_questions
      GROUP BY path_id
      ORDER BY path_id
    `);

    console.log('📊 FINAL DISTRIBUTION BY PATH:\n');
    pathCounts.rows.forEach(row => {
      console.log(`   ${row.path_id.padEnd(20)} ${String(row.count).padStart(5)} questions`);
    });

    // 3. Get topic counts by path
    const foundationTopics = await pool.query(`
      SELECT topic_id, COUNT(*) as count
      FROM english_questions
      WHERE path_id = 'foundation'
      GROUP BY topic_id
      ORDER BY count DESC
    `);

    console.log(`\n📂 FOUNDATION PATH (${foundationTopics.rows.length} topics):\n`);
    foundationTopics.rows.forEach((row, idx) => {
      console.log(`   ${(idx + 1).toString().padStart(2)}. ${row.topic_id.padEnd(40)} ${String(row.count).padStart(4)} questions`);
    });

    const advancedTopics = await pool.query(`
      SELECT topic_id, COUNT(*) as count
      FROM english_questions
      WHERE path_id = 'advanced'
      GROUP BY topic_id
      ORDER BY count DESC
    `);

    console.log(`\n📂 ADVANCED PATH (${advancedTopics.rows.length} topics):\n`);
    advancedTopics.rows.forEach((row, idx) => {
      console.log(`   ${(idx + 1).toString().padStart(2)}. ${row.topic_id.padEnd(40)} ${String(row.count).padStart(4)} questions`);
    });

    const ieltsToeflTopics = await pool.query(`
      SELECT topic_id, COUNT(*) as count
      FROM english_questions
      WHERE path_id = 'ielts-toefl'
      GROUP BY topic_id
      ORDER BY count DESC
    `);

    console.log(`\n📂 IELTS/TOEFL PATH (${ieltsToeflTopics.rows.length} topics):\n`);
    ieltsToeflTopics.rows.forEach((row, idx) => {
      console.log(`   ${(idx + 1).toString().padStart(2)}. ${row.topic_id.padEnd(40)} ${String(row.count).padStart(4)} questions`);
    });

    const realWorldTopics = await pool.query(`
      SELECT topic_id, COUNT(*) as count
      FROM english_questions
      WHERE path_id = 'real-world'
      GROUP BY topic_id
      ORDER BY count DESC
    `);

    console.log(`\n📂 REAL-WORLD PATH (${realWorldTopics.rows.length} topics):\n`);
    realWorldTopics.rows.forEach((row, idx) => {
      console.log(`   ${(idx + 1).toString().padStart(2)}. ${row.topic_id.padEnd(40)} ${String(row.count).padStart(4)} questions`);
    });

    // 4. Frontend match verification
    console.log('\n' + '='.repeat(80));
    console.log('🔍 FRONTEND MATCH VERIFICATION\n');

    const frontendFoundation = [
      'alphabet-basics', 'phonics-vowels', 'parts-of-speech', 'nouns-detailed',
      'articles', 'verbs-basics', 'prepositions-mastery', 'sentence-basics',
      'present-simple-complete', 'present-continuous-complete', 'past-simple-complete',
      'past-continuous-complete', 'present-perfect-complete', 'present-perfect-continuous',
      'past-perfect', 'past-perfect-continuous', 'future-tenses', 'future-perfect-continuous',
      'modal-verbs', 'conditionals', 'relative-clauses',
      'phrasal-verbs', 'synonyms-antonyms', 'essential-vocabulary', 'idioms-expressions',
      'writing-basics', 'common-mistakes'
    ];

    const frontendAdvanced = [
      'collocations-advanced', 'past-perfect-continuous', 'future-perfect',
      'future-perfect-continuous', 'academic-vocabulary'
    ];

    const dbFoundation = foundationTopics.rows.map(r => r.topic_id);
    const dbAdvanced = advancedTopics.rows.map(r => r.topic_id);

    const matchedFoundation = frontendFoundation.filter(t => dbFoundation.includes(t));
    const missingFoundation = frontendFoundation.filter(t => !dbFoundation.includes(t));

    const matchedAdvanced = frontendAdvanced.filter(t => dbAdvanced.includes(t));
    const missingAdvanced = frontendAdvanced.filter(t => !dbAdvanced.includes(t));

    console.log('📊 Foundation Topics:');
    console.log(`   ✅ Matched: ${matchedFoundation.length} / ${frontendFoundation.length}`);
    console.log(`   ❌ Missing: ${missingFoundation.length}`);

    if (missingFoundation.length > 0) {
      console.log('\n   Missing topics (need question generation):');
      missingFoundation.forEach((topic, idx) => {
        console.log(`      ${idx + 1}. ${topic}`);
      });
    }

    console.log('\n📊 Advanced Topics:');
    console.log(`   ✅ Matched: ${matchedAdvanced.length} / ${frontendAdvanced.length}`);
    console.log(`   ❌ Missing: ${missingAdvanced.length}`);

    if (missingAdvanced.length > 0) {
      console.log('\n   Missing topics (need question generation):');
      missingAdvanced.forEach((topic, idx) => {
        console.log(`      ${idx + 1}. ${topic}`);
      });
    }

    console.log('\n' + '='.repeat(80));
    console.log('✅ ALIGNMENT COMPLETE!\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

finalTopicAlignment();
