import { Pool } from 'pg';
import { config } from 'dotenv';

config({ path: '.env.local' });

async function analyzeEnglishTopics() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('🔍 ENGLISH TOPICS ANALYSIS\n');
    console.log('='.repeat(80));

    // 1. Get all unique path_id and topic_id combinations
    const topicsResult = await pool.query(`
      SELECT 
        path_id,
        topic_id,
        COUNT(*) as question_count,
        MIN(level) as min_level,
        MAX(level) as max_level,
        MIN(difficulty) as min_diff,
        MAX(difficulty) as max_diff
      FROM english_questions
      GROUP BY path_id, topic_id
      ORDER BY path_id, question_count DESC
    `);

    console.log(`\n📊 Total unique path-topic combinations: ${topicsResult.rows.length}\n`);

    // Group by path
    const byPath: Record<string, any[]> = {};
    topicsResult.rows.forEach(row => {
      if (!byPath[row.path_id]) {
        byPath[row.path_id] = [];
      }
      byPath[row.path_id].push(row);
    });

    // Display by path
    for (const [path, topics] of Object.entries(byPath)) {
      const totalQuestions = topics.reduce((sum, t) => sum + parseInt(t.question_count), 0);
      console.log(`\n📂 PATH: ${path.toUpperCase()} (${topics.length} topics, ${totalQuestions} questions)`);
      console.log('─'.repeat(80));

      topics.forEach((topic, idx) => {
        console.log(`${(idx + 1).toString().padStart(3)}. ${topic.topic_id.padEnd(40)} ${String(topic.question_count).padStart(5)} questions`);
      });
    }

    // 2. Check for topics that might be in frontend but not in database
    console.log('\n\n🔍 CROSS-REFERENCE CHECK\n');
    console.log('='.repeat(80));

    const allTopicIds = topicsResult.rows.map(r => r.topic_id);

    // Foundation topics from frontend (hardcoded list for quick check)
    const frontendFoundationTopics = [
      'alphabet-basics', 'phonics-vowels', 'pronunciation-basics',
      'parts-of-speech', 'nouns-detailed', 'pronouns-detailed', 'articles',
      'adjectives', 'adverbs-complete', 'verbs-basics', 'prepositions-mastery',
      'sentence-basics', 'there-is-are', 'question-formation', 'imperative-mood',
      'present-simple-complete', 'present-continuous-complete', 'past-simple-complete',
      'past-continuous-complete', 'future-tenses', 'present-perfect-complete',
      'present-perfect-continuous', 'past-perfect', 'tense-comparison',
      'modal-verbs', 'passive-voice', 'active-passive-conversion',
      'gerunds-infinitives', 'quantifiers-determiners', 'tag-questions', 'used-to-would',
      'reported-speech', 'conditionals', 'relative-clauses', 'sentence-types',
      'connecting-ideas', 'conjunctions-connectors', 'time-sequence',
      'essential-vocabulary', 'synonyms-antonyms', 'phrasal-verbs', 'idioms-expressions',
      'speaking-basics', 'writing-basics', 'common-mistakes'
    ];

    const frontendAdvancedTopics = [
      'third-conditional', 'mixed-conditionals', 'inversion-conditionals',
      'non-defining-relative-clauses', 'reduced-relative-clauses',
      'past-modals', 'modal-nuances',
      'past-perfect-continuous', 'future-perfect', 'future-perfect-continuous', 'narrative-tenses',
      'academic-vocabulary', 'collocations-advanced', 'formal-informal-register', 'proverbs-sayings',
      'essay-writing', 'report-writing', 'advanced-punctuation',
      'presentations-advanced', 'debate-discussion'
    ];

    console.log('\n📋 Frontend Foundation Topics NOT in Database:');
    const missingFoundation = frontendFoundationTopics.filter(t => !allTopicIds.includes(t));
    if (missingFoundation.length === 0) {
      console.log('   ✅ All foundation topics have questions!');
    } else {
      missingFoundation.forEach((topic, idx) => {
        console.log(`   ${idx + 1}. ${topic}`);
      });
    }

    console.log('\n📋 Frontend Advanced Topics NOT in Database:');
    const missingAdvanced = frontendAdvancedTopics.filter(t => !allTopicIds.includes(t));
    if (missingAdvanced.length === 0) {
      console.log('   ✅ All advanced topics have questions!');
    } else {
      missingAdvanced.forEach((topic, idx) => {
        console.log(`   ${idx + 1}. ${topic}`);
      });
    }

    console.log('\n📋 Database Topics NOT in Frontend (might be legacy):');
    const legacyTopics = allTopicIds.filter(t =>
      !frontendFoundationTopics.includes(t) &&
      !frontendAdvancedTopics.includes(t) &&
      !['toefl-vocabulary', 'vocabulary-ssc', 'grammar-basics', 'reading-comprehension',
        'common-vocabulary', 'writing-skills', 'daily-conversations', 'email-writing',
        'essential-phrasal-verbs'].includes(t)
    );

    if (legacyTopics.length === 0) {
      console.log('   ✅ No legacy topics found');
    } else {
      legacyTopics.forEach((topic, idx) => {
        const count = topicsResult.rows.find(r => r.topic_id === topic)?.question_count;
        console.log(`   ${idx + 1}. ${topic} (${count} questions)`);
      });
    }

    console.log('\n' + '='.repeat(80));
    console.log('✅ ANALYSIS COMPLETE\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

analyzeEnglishTopics();
