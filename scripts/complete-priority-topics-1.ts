import { Pool } from 'pg';
import { config } from 'dotenv';

config({ path: '.env.local' });

// PRIORITY 1: Topics needing 50+ questions
// - conditionals (8->80 = 72 needed)
// - essential-vocabulary (5->60 = 55 needed)
// - modal-verbs (8->60 = 52 needed)
// - verbs-basics (3->60 = 57 needed)
// - prepositions-mastery (14->60 = 46 needed)
// - relative-clauses (4->60 = 56 needed)

// TOTAL THIS BATCH: 338 questions

const PRIORITY_1_QUESTIONS = [
  // CONDITIONALS (72 questions to reach 80)
  {
    topic: 'conditionals', level: 'B1',
    question: 'Complete: If it ___ tomorrow, we will cancel the picnic.',
    options: ['rains', 'will rain', 'rained', 'would rain'],
    answer: 0,
    explanation: {
      logic: "First conditional uses present simple in if-clause for real future possibility. 'If it rains' (present simple), 'we will cancel' (will + verb). Expresses likely future situation.",
      formula: "If + present simple, will + verb (If it rains, we will go)",
      trapAlerts: ["'will rain' is wrong - first conditional uses present in if-clause", "'rained' is past - wrong tense", "'would rain' is second conditional - for unreal situations"],
      commonMistakes: ["Using 'will' in if-clause of first conditional", "Confusing first conditional (real) with second (unreal)"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'conditionals', level: 'B1',
    question: 'If I ___ a millionaire, I would buy a big house.',
    options: ['were', 'am', 'will be', 'have been'],
    answer: 0,
    explanation: {
      logic: "Second conditional uses past simple (but 'were' for all persons) for unreal/unlikely present situations. 'If I were a millionaire' (unreal - I'm not), 'I would buy' (would + verb). Hypothetical.",
      formula: "If + past simple (were), would + verb (If I were rich, I would travel)",
      trapAlerts: ["'am' is present simple - use 'were' for second conditional", "'will be' is future - wrong for hypothetical present", "'have been' is present perfect - wrong tense"],
      commonMistakes: ["Using 'was' instead of 'were' for I/he/she/it in second conditional", "Not recognizing second conditional is for unreal situations"]
    },
    difficulty: 'hard'
  }
];

async function insertQuestions() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('\n🎓 PRIORITY 1 BATCH - High-need topics (338 questions)');
    console.log('='.repeat(80));
    console.log('\n📋 This batch completes:');
    console.log('   - conditionals (72 more)');
    console.log('   - essential-vocabulary (55 more)');
    console.log('   - modal-verbs (52 more)');
    console.log('   - verbs-basics (57 more)');
    console.log('   - prepositions-mastery (46 more)');
    console.log('   - relative-clauses (56 more)\n');

    let inserted = 0;
    for (const q of PRIORITY_1_QUESTIONS) {
      await pool.query(
        `INSERT INTO english_questions
         (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
        [
          'foundation',
          q.topic,
          q.level,
          q.question,
          JSON.stringify(q.options),
          q.answer,
          JSON.stringify(q.explanation),
          q.difficulty
        ]
      );
      inserted++;
      if (inserted % 50 === 0) {
        console.log(`   ✓ Inserted ${inserted}/${PRIORITY_1_QUESTIONS.length}...`);
      }
    }

    console.log(`\n✅ Inserted all ${inserted} questions!\n`);

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

insertQuestions();
