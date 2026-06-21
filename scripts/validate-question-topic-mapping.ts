import { Pool } from 'pg';
import { config } from 'dotenv';

config({ path: '.env.local' });

// Topic definitions and keywords for validation
const TOPIC_KEYWORDS: Record<string, {
  mustInclude?: string[];
  shouldInclude?: string[];
  mustNotInclude?: string[];
  description: string;
}> = {
  // Alphabet & Phonics
  'alphabet-basics': {
    mustInclude: ['letter', 'alphabet', 'capital', 'small'],
    description: 'Questions about letters, alphabet, capital/small forms',
  },
  'phonics-vowels': {
    mustInclude: ['vowel', 'consonant', 'sound'],
    shouldInclude: ['a', 'e', 'i', 'o', 'u', 'pronunciation'],
    description: 'Vowels, consonants, letter sounds',
  },
  'pronunciation-basics': {
    mustInclude: ['pronounce', 'pronunciation', 'stress', 'syllable'],
    description: 'Word stress, syllables, pronunciation',
  },

  // Parts of Speech
  'parts-of-speech': {
    mustInclude: ['noun', 'verb', 'adjective', 'adverb', 'pronoun', 'preposition', 'conjunction', 'part of speech'],
    description: '8 types of words and their roles',
  },
  'nouns-detailed': {
    mustInclude: ['noun'],
    shouldInclude: ['plural', 'singular', 'countable', 'uncountable', 'proper', 'common'],
    description: 'Noun types, plurals, countable/uncountable',
  },
  'pronouns-detailed': {
    mustInclude: ['pronoun'],
    shouldInclude: ['he', 'she', 'they', 'his', 'her', 'their', 'reflexive', 'possessive'],
    description: 'Personal, possessive, reflexive pronouns',
  },
  'articles': {
    mustInclude: ['article'],
    shouldInclude: ['a', 'an', 'the'],
    description: 'Articles: a, an, the',
  },
  'adjectives': {
    mustInclude: ['adjective'],
    shouldInclude: ['describe', 'comparative', 'superlative'],
    description: 'Adjectives and comparisons',
  },
  'adverbs-complete': {
    mustInclude: ['adverb'],
    shouldInclude: ['quickly', 'slowly', 'manner', 'place', 'time'],
    description: 'Adverbs of manner, place, time',
  },
  'verbs-basics': {
    mustInclude: ['verb'],
    shouldInclude: ['action', 'do', 'does', 'did'],
    description: 'Basic verb concepts and usage',
  },
  'prepositions-mastery': {
    mustInclude: ['preposition'],
    shouldInclude: ['in', 'on', 'at', 'by', 'with', 'from', 'to'],
    description: 'Prepositions of place, time, direction',
  },

  // Tenses
  'present-simple-complete': {
    mustInclude: ['present simple', 'do', 'does'],
    shouldInclude: ['daily', 'habit', 'routine', 'always', 'usually'],
    mustNotInclude: ['was', 'were', 'did', 'will', 'going to', 'has been', 'had been'],
    description: 'Present Simple tense',
  },
  'present-continuous-complete': {
    mustInclude: ['present continuous', 'am', 'is', 'are', '-ing'],
    shouldInclude: ['now', 'currently', 'right now'],
    mustNotInclude: ['yesterday', 'tomorrow', 'will', 'has been', 'had been'],
    description: 'Present Continuous tense (am/is/are + -ing)',
  },
  'past-simple-complete': {
    mustInclude: ['past simple', 'did', 'was', 'were', 'yesterday', 'ago'],
    shouldInclude: ['last', 'ed'],
    mustNotInclude: ['tomorrow', 'will', 'going to', 'right now'],
    description: 'Past Simple tense',
  },
  'past-continuous-complete': {
    mustInclude: ['past continuous', 'was', 'were', '-ing'],
    shouldInclude: ['while', 'when'],
    mustNotInclude: ['tomorrow', 'will', 'has', 'have'],
    description: 'Past Continuous (was/were + -ing)',
  },
  'present-perfect-complete': {
    mustInclude: ['present perfect', 'has', 'have'],
    shouldInclude: ['already', 'yet', 'just', 'ever', 'never', 'since', 'for'],
    mustNotInclude: ['yesterday', 'last week', 'ago'],
    description: 'Present Perfect (has/have + past participle)',
  },
  'present-perfect-continuous': {
    mustInclude: ['present perfect continuous', 'has been', 'have been', '-ing'],
    shouldInclude: ['since', 'for', 'how long'],
    description: 'Present Perfect Continuous',
  },
  'past-perfect': {
    mustInclude: ['past perfect', 'had'],
    shouldInclude: ['before', 'already', 'after'],
    mustNotInclude: ['has', 'have', 'will'],
    description: 'Past Perfect (had + past participle)',
  },
  'past-perfect-continuous': {
    mustInclude: ['past perfect continuous', 'had been', '-ing'],
    shouldInclude: ['since', 'for'],
    description: 'Past Perfect Continuous',
  },
  'future-tenses': {
    mustInclude: ['future', 'will', 'going to', 'shall', 'tomorrow'],
    shouldInclude: ['next', 'soon', 'later'],
    mustNotInclude: ['yesterday', 'ago', 'last'],
    description: 'Future tenses (will, going to)',
  },
  'future-perfect': {
    mustInclude: ['future perfect', 'will have'],
    shouldInclude: ['by', 'by the time'],
    description: 'Future Perfect',
  },
  'future-perfect-continuous': {
    mustInclude: ['future perfect continuous', 'will have been', '-ing'],
    description: 'Future Perfect Continuous',
  },

  // Modal Verbs & Voice
  'modal-verbs': {
    mustInclude: ['modal', 'can', 'could', 'may', 'might', 'must', 'should', 'would'],
    description: 'Modal verbs: can, could, may, might, must, should, would',
  },
  'passive-voice': {
    mustInclude: ['passive', 'be + past participle'],
    shouldInclude: ['by', 'was', 'were', 'is', 'are', 'been'],
    description: 'Passive voice construction',
  },

  // Advanced Grammar
  'conditionals': {
    mustInclude: ['conditional', 'if'],
    shouldInclude: ['would', 'will', 'were', 'had'],
    description: 'Conditional sentences (if clauses)',
  },
  'relative-clauses': {
    mustInclude: ['relative', 'who', 'which', 'that', 'whose', 'where', 'when'],
    description: 'Relative clauses with who/which/that',
  },
  'reported-speech': {
    mustInclude: ['reported speech', 'indirect speech', 'said', 'told'],
    shouldInclude: ['that', 'would', 'could'],
    description: 'Direct to indirect speech conversion',
  },
  'gerunds-infinitives': {
    mustInclude: ['gerund', 'infinitive', '-ing', 'to +'],
    shouldInclude: ['enjoy', 'want', 'like', 'decide'],
    description: 'Gerunds (-ing) and infinitives (to + verb)',
  },

  // Vocabulary
  'phrasal-verbs': {
    mustInclude: ['phrasal verb', 'up', 'down', 'on', 'off', 'out', 'in'],
    shouldInclude: ['turn', 'get', 'put', 'take', 'give'],
    description: 'Phrasal verbs (verb + particle)',
  },
  'synonyms-antonyms': {
    mustInclude: ['synonym', 'antonym', 'similar', 'opposite'],
    description: 'Words with similar/opposite meanings',
  },
  'idioms-expressions': {
    mustInclude: ['idiom', 'expression', 'phrase', 'meaning'],
    shouldInclude: ['break the ice', 'piece of cake', 'raining cats'],
    description: 'Idiomatic expressions and their meanings',
  },
  'common-mistakes': {
    mustInclude: ['mistake', 'error', 'correct', 'incorrect', 'wrong'],
    description: 'Common English mistakes',
  },
  'common-vocabulary': {
    shouldInclude: ['word', 'vocabulary', 'meaning', 'definition'],
    description: 'Common English vocabulary',
  },
  'essential-vocabulary': {
    shouldInclude: ['word', 'vocabulary', 'meaning'],
    description: 'Essential vocabulary for daily use',
  },
  'toefl-vocabulary': {
    mustInclude: ['synonym', 'meaning', 'word'],
    shouldInclude: ['academic', 'vocabulary'],
    description: 'TOEFL academic vocabulary',
  },
  'academic-vocabulary': {
    mustInclude: ['academic', 'word', 'vocabulary'],
    shouldInclude: ['formal', 'research', 'study'],
    description: 'Academic vocabulary for IELTS/TOEFL',
  },

  // Writing & Speaking
  'writing-basics': {
    mustInclude: ['write', 'writing', 'sentence', 'paragraph'],
    shouldInclude: ['essay', 'structure', 'punctuation'],
    description: 'Basic writing skills',
  },
  'sentence-basics': {
    mustInclude: ['sentence'],
    shouldInclude: ['subject', 'verb', 'object', 'structure'],
    description: 'Sentence structure and formation',
  },

  // Real-world
  'daily-conversations': {
    mustInclude: ['conversation', 'say', 'situation'],
    shouldInclude: ['shopping', 'restaurant', 'bank', 'doctor', 'travel'],
    description: 'Daily conversation scenarios',
  },
  'email-writing': {
    mustInclude: ['email'],
    shouldInclude: ['formal', 'informal', 'subject', 'greeting', 'closing'],
    description: 'Email writing skills',
  },

  // Advanced
  'collocations-advanced': {
    mustInclude: ['collocation'],
    shouldInclude: ['go with', 'combination', 'pair'],
    description: 'Word collocations and combinations',
  },
};

async function validateQuestionTopicMapping() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('🔍 VALIDATING QUESTION-TOPIC MAPPINGS\n');
    console.log('='.repeat(80));

    // Get all questions grouped by topic
    const topicsResult = await pool.query(`
      SELECT topic_id, COUNT(*) as count
      FROM english_questions
      WHERE path_id IN ('foundation', 'advanced', 'ielts-toefl', 'real-world', 'competitive-exam')
      GROUP BY topic_id
      ORDER BY count DESC
    `);

    console.log(`\n📊 Total topics to validate: ${topicsResult.rows.length}\n`);

    let totalQuestions = 0;
    let validatedTopics = 0;
    let topicsWithIssues = 0;
    const issueReport: any[] = [];

    // Validate each topic
    for (const topicRow of topicsResult.rows) {
      const topicId = topicRow.topic_id;
      const count = parseInt(topicRow.count);
      totalQuestions += count;

      console.log(`\n${'─'.repeat(80)}`);
      console.log(`📂 Topic: ${topicId} (${count} questions)`);
      console.log(`${'─'.repeat(80)}`);

      // Sample 5-10 questions from this topic
      const sampleSize = Math.min(10, count);
      const questionsResult = await pool.query(`
        SELECT id, question, options, explanation, difficulty, level
        FROM english_questions
        WHERE topic_id = $1
        ORDER BY RANDOM()
        LIMIT $2
      `, [topicId, sampleSize]);

      const topicDef = TOPIC_KEYWORDS[topicId];

      if (!topicDef) {
        console.log(`   ⚠️  No validation rules defined for this topic`);
        console.log(`   → Skipping validation (needs manual review)\n`);
        continue;
      }

      console.log(`   📋 Validation rules: ${topicDef.description}`);
      console.log(`   🔍 Sampling ${sampleSize} questions...\n`);

      let matches = 0;
      let mismatches = 0;
      const mismatchedQuestions: any[] = [];

      for (const q of questionsResult.rows) {
        const fullText = `${q.question} ${q.explanation}`.toLowerCase();

        // Check must-include keywords
        let hasRequiredKeywords = true;
        if (topicDef.mustInclude) {
          const foundKeywords = topicDef.mustInclude.filter(keyword =>
            fullText.includes(keyword.toLowerCase())
          );

          if (foundKeywords.length === 0) {
            hasRequiredKeywords = false;
          }
        }

        // Check must-not-include keywords
        let hasForbiddenKeywords = false;
        if (topicDef.mustNotInclude) {
          const foundForbidden = topicDef.mustNotInclude.filter(keyword =>
            fullText.includes(keyword.toLowerCase())
          );

          if (foundForbidden.length > 0) {
            hasForbiddenKeywords = true;
          }
        }

        if (!hasRequiredKeywords || hasForbiddenKeywords) {
          mismatches++;
          mismatchedQuestions.push({
            id: q.id,
            question: q.question.substring(0, 100),
            reason: !hasRequiredKeywords
              ? 'Missing required keywords'
              : 'Contains forbidden keywords',
          });
        } else {
          matches++;
        }
      }

      const matchRate = (matches / sampleSize) * 100;

      if (matchRate >= 80) {
        console.log(`   ✅ VALID: ${matches}/${sampleSize} samples match (${matchRate.toFixed(0)}%)`);
        validatedTopics++;
      } else if (matchRate >= 50) {
        console.log(`   ⚠️  PARTIAL: ${matches}/${sampleSize} samples match (${matchRate.toFixed(0)}%)`);
        console.log(`   → Some questions may be incorrectly mapped`);
        topicsWithIssues++;

        issueReport.push({
          topic: topicId,
          count,
          matchRate,
          status: 'PARTIAL',
          mismatches: mismatchedQuestions,
        });
      } else {
        console.log(`   ❌ INVALID: Only ${matches}/${sampleSize} samples match (${matchRate.toFixed(0)}%)`);
        console.log(`   → Most questions appear to be incorrectly mapped!`);
        topicsWithIssues++;

        issueReport.push({
          topic: topicId,
          count,
          matchRate,
          status: 'INVALID',
          mismatches: mismatchedQuestions,
        });
      }

      if (mismatchedQuestions.length > 0) {
        console.log(`\n   ⚠️  Sample mismatched questions:`);
        mismatchedQuestions.slice(0, 3).forEach((mq, idx) => {
          console.log(`      ${idx + 1}. [ID ${mq.id}] "${mq.question}..."`);
          console.log(`         Reason: ${mq.reason}`);
        });
      }
    }

    // Final summary
    console.log('\n' + '='.repeat(80));
    console.log('📊 VALIDATION SUMMARY\n');
    console.log(`   Total questions validated: ${totalQuestions}`);
    console.log(`   Total topics: ${topicsResult.rows.length}`);
    console.log(`   ✅ Valid topics: ${validatedTopics}`);
    console.log(`   ⚠️  Topics with issues: ${topicsWithIssues}`);
    console.log(`   ⏭️  Skipped (no rules): ${topicsResult.rows.length - validatedTopics - topicsWithIssues}`);

    if (issueReport.length > 0) {
      console.log('\n' + '='.repeat(80));
      console.log('⚠️  TOPICS WITH MAPPING ISSUES\n');

      issueReport.forEach(issue => {
        console.log(`\n📂 ${issue.topic}`);
        console.log(`   Status: ${issue.status}`);
        console.log(`   Match rate: ${issue.matchRate.toFixed(0)}%`);
        console.log(`   Total questions: ${issue.count}`);
        console.log(`   Action needed: Review and remap incorrectly assigned questions`);

        if (issue.mismatches.length > 0) {
          console.log(`\n   Sample mismatched questions:`);
          issue.mismatches.slice(0, 5).forEach((mq: any, idx: number) => {
            console.log(`      ${idx + 1}. [ID ${mq.id}] "${mq.question}..."`);
          });
        }
      });

      // Export issue report to JSON
      const fs = require('fs');
      const reportPath = '/Users/girish.raj/prepgenie/.agents/artifacts/topic-mapping-issues.json';
      fs.writeFileSync(reportPath, JSON.stringify(issueReport, null, 2));
      console.log(`\n📁 Full report saved to: ${reportPath}`);
    }

    console.log('\n' + '='.repeat(80));
    console.log('✅ VALIDATION COMPLETE\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

validateQuestionTopicMapping();
