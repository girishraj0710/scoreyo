import { Pool } from 'pg';
import { config } from 'dotenv';

config({ path: '.env.local' });

async function finalValidationCheck() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('🔍 FINAL VALIDATION CHECK\n');
    console.log('='.repeat(80));

    // Get all foundation topics with counts
    const foundationResult = await pool.query(`
      SELECT topic_id, COUNT(*) as count
      FROM english_questions
      WHERE path_id = 'foundation'
      GROUP BY topic_id
      ORDER BY count DESC
    `);

    console.log('\n📂 FOUNDATION PATH - Final Status:\n');
    console.log('   ' + 'Topic'.padEnd(40) + 'Questions'.padStart(10));
    console.log('   ' + '─'.repeat(50));

    let totalQuestions = 0;
    const emptyTopics: string[] = [];
    const lowCountTopics: { topic: string; count: number }[] = [];

    foundationResult.rows.forEach(row => {
      const count = parseInt(row.count);
      totalQuestions += count;

      let status = '✅';
      if (count === 0) {
        status = '❌';
        emptyTopics.push(row.topic_id);
      } else if (count < 10) {
        status = '⚠️ ';
        lowCountTopics.push({ topic: row.topic_id, count });
      }

      console.log(`   ${status} ${row.topic_id.padEnd(38)} ${String(count).padStart(8)}`);
    });

    console.log('   ' + '─'.repeat(50));
    console.log(`   ${'TOTAL'.padEnd(40)} ${String(totalQuestions).padStart(8)}`);

    // Summary
    console.log('\n' + '='.repeat(80));
    console.log('📊 VALIDATION SUMMARY\n');
    console.log(`   Total Foundation questions: ${totalQuestions}`);
    console.log(`   Topics with questions: ${foundationResult.rows.length}`);
    console.log(`   Topics with <10 questions: ${lowCountTopics.length}`);

    if (lowCountTopics.length > 0) {
      console.log('\n   ⚠️  Low-count topics (need more questions):');
      lowCountTopics.forEach(t => {
        console.log(`      • ${t.topic}: ${t.count} questions (need ${40 - t.count} more)`);
      });
    }

    // Check topic coverage vs frontend
    const frontendTopics = [
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
    const missingTopics = frontendTopics.filter(t => !dbTopics.includes(t));

    console.log('\n   📋 Frontend coverage:');
    console.log(`      Defined: ${frontendTopics.length} topics`);
    console.log(`      In database: ${dbTopics.filter(t => frontendTopics.includes(t)).length} topics`);
    console.log(`      Missing: ${missingTopics.length} topics`);

    if (missingTopics.length > 0) {
      console.log('\n   ❌ Missing topics (need question generation):');
      missingTopics.forEach(t => {
        console.log(`      • ${t}`);
      });
    }

    // Check for topics that are NOT in frontend (legacy/extra)
    const extraTopics = dbTopics.filter(t => !frontendTopics.includes(t));
    if (extraTopics.length > 0) {
      console.log('\n   ⚠️  Extra topics (not in frontend definition):');
      extraTopics.forEach(t => {
        const count = foundationResult.rows.find(r => r.topic_id === t)?.count;
        console.log(`      • ${t}: ${count} questions`);
      });
    }

    console.log('\n' + '='.repeat(80));
    console.log('✅ FINAL CHECK COMPLETE\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

finalValidationCheck();
