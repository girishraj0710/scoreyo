import { Pool } from 'pg';
import { config } from 'dotenv';

config({ path: '.env.local' });

async function fixEnglishTopicNames() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('🔧 FIXING ENGLISH TOPIC NAMES\n');
    console.log('='.repeat(80));

    // Get initial state
    const initialResult = await pool.query(`
      SELECT topic_id, COUNT(*) as count
      FROM english_questions
      WHERE path_id = 'foundation'
      GROUP BY topic_id
      ORDER BY count DESC
    `);

    console.log('\n📊 BEFORE: Foundation topics in database:');
    initialResult.rows.forEach((row, idx) => {
      console.log(`   ${(idx + 1).toString().padStart(2)}. ${row.topic_id.padEnd(35)} ${row.count.padStart(4)} questions`);
    });

    console.log('\n' + '─'.repeat(80));
    console.log('🔄 Applying fixes...\n');

    // 1. Rename topics to match frontend exactly
    const renames = [
      { from: 'present-simple', to: 'present-simple-complete', desc: 'Present Simple' },
      { from: 'past-continuous', to: 'past-continuous-complete', desc: 'Past Continuous' },
      { from: 'present-perfect', to: 'present-perfect-complete', desc: 'Present Perfect' },
      { from: 'present-continuous', to: 'present-continuous-complete', desc: 'Present Continuous' },
      { from: 'past-simple', to: 'past-simple-complete', desc: 'Past Simple' },
      { from: 'prepositions', to: 'prepositions-mastery', desc: 'Prepositions' },
      { from: 'sentence-structure', to: 'sentence-basics', desc: 'Sentence Structure' },
      { from: 'modals', to: 'modal-verbs', desc: 'Modal Verbs' },
    ];

    for (const rename of renames) {
      const result = await pool.query(
        'UPDATE english_questions SET topic_id = $1 WHERE topic_id = $2 RETURNING id',
        [rename.to, rename.from]
      );
      console.log(`   ✅ ${rename.desc.padEnd(25)} ${rename.from.padEnd(30)} → ${rename.to.padEnd(30)} (${result.rowCount} questions)`);
    }

    // 2. Merge idioms into idioms-expressions
    const idiomsResult = await pool.query(
      "UPDATE english_questions SET topic_id = 'idioms-expressions' WHERE topic_id = 'idioms' RETURNING id"
    );
    console.log(`   ✅ ${'Merge idioms'.padEnd(25)} ${'idioms'.padEnd(30)} → ${'idioms-expressions'.padEnd(30)} (${idiomsResult.rowCount} questions)`);

    // 3. Move collocations to Advanced path
    const collocationsResult = await pool.query(
      "UPDATE english_questions SET path_id = 'advanced', topic_id = 'collocations-advanced' WHERE topic_id = 'collocations' RETURNING id"
    );
    console.log(`   ✅ ${'Move to Advanced'.padEnd(25)} ${'collocations'.padEnd(30)} → ${'advanced/collocations-advanced'.padEnd(30)} (${collocationsResult.rowCount} questions)`);

    // 4. Merge future tenses
    const futureResult = await pool.query(
      "UPDATE english_questions SET topic_id = 'future-tenses' WHERE topic_id IN ('future-simple', 'future-continuous') RETURNING id"
    );
    console.log(`   ✅ ${'Merge future tenses'.padEnd(25)} ${'future-simple, future-continuous'.padEnd(30)} → ${'future-tenses'.padEnd(30)} (${futureResult.rowCount} questions)`);

    // 5. Delete too-generic topics
    const deleteResult = await pool.query(
      "DELETE FROM english_questions WHERE topic_id IN ('basic-grammar', 'word-formation') RETURNING id"
    );
    console.log(`   ❌ ${'Delete generic'.padEnd(25)} ${'basic-grammar, word-formation'.padEnd(30)} ${'(removed)'.padEnd(30)} (${deleteResult.rowCount} questions)`);

    // Get final state
    console.log('\n' + '─'.repeat(80));
    console.log('📊 AFTER: Updated topic distribution\n');

    const foundationResult = await pool.query(`
      SELECT topic_id, COUNT(*) as count
      FROM english_questions
      WHERE path_id = 'foundation'
      GROUP BY topic_id
      ORDER BY count DESC
    `);

    console.log('📂 FOUNDATION PATH:');
    foundationResult.rows.forEach((row, idx) => {
      console.log(`   ${(idx + 1).toString().padStart(2)}. ${row.topic_id.padEnd(40)} ${String(row.count).padStart(4)} questions`);
    });

    const advancedResult = await pool.query(`
      SELECT topic_id, COUNT(*) as count
      FROM english_questions
      WHERE path_id = 'advanced'
      GROUP BY topic_id
      ORDER BY count DESC
    `);

    console.log('\n📂 ADVANCED PATH:');
    advancedResult.rows.forEach((row, idx) => {
      console.log(`   ${(idx + 1).toString().padStart(2)}. ${row.topic_id.padEnd(40)} ${String(row.count).padStart(4)} questions`);
    });

    // Summary
    const totalResult = await pool.query('SELECT COUNT(*) FROM english_questions');
    console.log('\n' + '='.repeat(80));
    console.log('✅ FIX COMPLETE\n');
    console.log(`   Total questions: ${totalResult.rows[0].count}`);
    console.log(`   Foundation topics: ${foundationResult.rows.length}`);
    console.log(`   Advanced topics: ${advancedResult.rows.length}`);

    // Check for frontend matches
    console.log('\n🔍 Verifying frontend matches...\n');

    const frontendFoundationTopics = [
      'alphabet-basics', 'phonics-vowels', 'parts-of-speech', 'nouns-detailed',
      'articles', 'verbs-basics', 'prepositions-mastery', 'sentence-basics',
      'present-simple-complete', 'present-continuous-complete', 'past-simple-complete',
      'past-continuous-complete', 'present-perfect-complete', 'present-perfect-continuous',
      'past-perfect', 'past-perfect-continuous', 'future-tenses', 'future-perfect-continuous',
      'modal-verbs', 'conditionals', 'relative-clauses',
      'phrasal-verbs', 'synonyms-antonyms', 'essential-vocabulary', 'idioms-expressions',
      'writing-basics', 'common-mistakes'
    ];

    const dbTopics = foundationResult.rows.map(r => r.topic_id);
    const matched = frontendFoundationTopics.filter(t => dbTopics.includes(t));
    const stillMissing = frontendFoundationTopics.filter(t => !dbTopics.includes(t));

    console.log(`   ✅ Matched topics: ${matched.length} / ${frontendFoundationTopics.length}`);
    if (stillMissing.length > 0) {
      console.log(`\n   ⚠️  Still missing (need question generation):`);
      stillMissing.forEach((topic, idx) => {
        console.log(`      ${idx + 1}. ${topic}`);
      });
    }

    console.log('\n' + '='.repeat(80) + '\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

fixEnglishTopicNames();
