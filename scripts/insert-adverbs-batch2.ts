import { Pool } from 'pg';
import { config } from 'dotenv';

config({ path: '.env.local' });

/**
 * Adverbs Complete Questions - Batch 2 (FINAL)
 * Topic: adverbs-complete (A2 level)
 * Subtopics: Time Adverbs (5), Place Adverbs (5), Degree Adverbs (5)
 */

const ADVERBS_BATCH2 = [
  // SUBTOPIC 4: Time Adverbs - 5 questions
  {
    question: "What are adverbs of time?",
    options: [
      "Adverbs that tell WHEN something happens",
      "Adverbs that tell HOW something happens",
      "Adverbs that tell WHERE something happens",
      "Adverbs that tell HOW OFTEN something happens"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Time adverbs tell WHEN an action happens: yesterday, today, tomorrow, now, soon, later, already, yet, still. They answer 'When?' Example: 'I will call you tomorrow' (WHEN will I call?).",
      formula: "Time adverbs: yesterday, today, tomorrow, now, soon, later, already, yet",
      trapAlerts: [
        "HOW = manner adverbs (quickly, slowly)",
        "WHERE = place adverbs (here, there, outside)",
        "HOW OFTEN = frequency adverbs (always, sometimes, never)"
      ],
      commonMistakes: [
        "Confusing time (when) with frequency (how often)",
        "Not distinguishing between time and other adverb types"
      ]
    },
    difficulty: "easy",
    level: "A2"
  },
  {
    question: "Identify the adverb of time:\n\n'She will arrive tomorrow.'",
    options: ["tomorrow", "will", "arrive", "She"],
    correctAnswer: 0,
    explanation: {
      logic: "'Tomorrow' tells WHEN she will arrive. Time adverb answering 'When will she arrive?'. Other time adverbs: yesterday, today, soon, now, later.",
      formula: "Time adverbs: tomorrow, yesterday, today, soon, now, later",
      trapAlerts: [
        "'will' is a modal/auxiliary verb, not an adverb",
        "'arrive' is the main verb, not an adverb",
        "'She' is the subject pronoun"
      ],
      commonMistakes: [
        "Not recognizing time words as adverbs",
        "Thinking only -ly words are adverbs"
      ]
    },
    difficulty: "easy",
    level: "A2"
  },
  {
    question: "Where do time adverbs usually go?",
    options: [
      "At the end or beginning of the sentence",
      "Always between subject and verb",
      "Always before the subject only",
      "Always after the object only"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Time adverbs are flexible: (1) End: 'I will call you tomorrow', (2) Beginning: 'Tomorrow, I will call you'. Both positions work. End is more common, beginning adds emphasis.",
      formula: "End: I called him yesterday | Beginning: Yesterday, I called him (emphasis)",
      trapAlerts: [
        "Between subject and verb is possible but less common for time adverbs",
        "Not restricted to before subject - can go at end too",
        "Not restricted to after object - beginning is also common"
      ],
      commonMistakes: [
        "Thinking time adverbs have one fixed position",
        "Not using beginning position for emphasis"
      ]
    },
    difficulty: "medium",
    level: "A2"
  },
  {
    question: "Which is an adverb of time?",
    options: ["yesterday", "always", "quickly", "here"],
    correctAnswer: 0,
    explanation: {
      logic: "'Yesterday' tells WHEN (time). 'Always' = frequency (how often), 'quickly' = manner (how), 'here' = place (where). Only 'yesterday' answers 'When?'",
      formula: "Time: yesterday, today, tomorrow | Frequency: always, sometimes | Manner: quickly",
      trapAlerts: [
        "'always' is frequency (how often), not time (when)",
        "'quickly' is manner (how), not time",
        "'here' is place (where), not time"
      ],
      commonMistakes: [
        "Confusing frequency (always) with time (yesterday)",
        "Not categorizing adverbs by type"
      ]
    },
    difficulty: "easy",
    level: "A2"
  },
  {
    question: "Complete correctly:\n\n'I have ___ finished my homework.'",
    options: ["already", "yesterday", "tomorrow", "here"],
    correctAnswer: 0,
    explanation: {
      logic: "'Already' = by now, before now (time adverb with present perfect). 'I have already finished' = I finished it before this moment. 'Already' goes before the main verb or at the end.",
      formula: "Present perfect + already (have already finished, has already left)",
      trapAlerts: [
        "'yesterday' doesn't work with 'have finished' - use simple past instead",
        "'tomorrow' is future, contradicts 'have finished' (present perfect)",
        "'here' is place, doesn't fit the time context"
      ],
      commonMistakes: [
        "Not knowing 'already' is used with present perfect",
        "Placing 'already' in wrong position in the sentence"
      ]
    },
    difficulty: "hard",
    level: "A2"
  },

  // SUBTOPIC 5: Place Adverbs - 5 questions
  {
    question: "What are adverbs of place?",
    options: [
      "Adverbs that tell WHERE something happens",
      "Adverbs that tell WHEN something happens",
      "Adverbs that tell HOW something happens",
      "Adverbs that tell WHY something happens"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Place adverbs tell WHERE an action happens: here, there, outside, inside, upstairs, downstairs, everywhere, nowhere. They answer 'Where?' Example: 'Come here' (WHERE should you come?).",
      formula: "Place adverbs: here, there, outside, inside, upstairs, downstairs, everywhere",
      trapAlerts: [
        "WHEN = time adverbs (yesterday, tomorrow)",
        "HOW = manner adverbs (quickly, slowly)",
        "WHY = reason (usually clauses, not simple adverbs)"
      ],
      commonMistakes: [
        "Confusing place adverbs with prepositions (in, on, at)",
        "Not recognizing place adverbs answer 'Where?'"
      ]
    },
    difficulty: "easy",
    level: "A2"
  },
  {
    question: "Identify the adverb of place:\n\n'They are playing outside.'",
    options: ["outside", "are", "playing", "They"],
    correctAnswer: 0,
    explanation: {
      logic: "'Outside' tells WHERE they are playing. Place adverb answering 'Where are they playing?'. Other place adverbs: inside, here, there, upstairs, downstairs.",
      formula: "Place adverbs: outside, inside, here, there, upstairs, downstairs",
      trapAlerts: [
        "'are' is auxiliary/helping verb, not an adverb",
        "'playing' is the main verb (present continuous)",
        "'They' is the subject pronoun"
      ],
      commonMistakes: [
        "Not recognizing direction/location words as adverbs",
        "Confusing adverbs (outside) with prepositions (in, on, at)"
      ]
    },
    difficulty: "easy",
    level: "A2"
  },
  {
    question: "Where do place adverbs usually go?",
    options: [
      "After the verb (or after verb + object)",
      "Always before the subject",
      "Between subject and verb",
      "Always at the beginning"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Place adverbs usually go: (1) After verb: 'Come here', (2) After verb + object: 'Put the book there'. End position is most natural for place adverbs.",
      formula: "Verb + place adverb (Come here, Go there) | Verb + object + place (Put it here)",
      trapAlerts: [
        "Before subject is rare and unnatural for place adverbs",
        "Between subject and verb is not typical for place adverbs",
        "Beginning is rare - place adverbs prefer end position"
      ],
      commonMistakes: [
        "Placing place adverbs in beginning position unnecessarily",
        "Not learning that place adverbs naturally go at the end"
      ]
    },
    difficulty: "medium",
    level: "A2"
  },
  {
    question: "Which word is an adverb of place?",
    options: ["there", "tomorrow", "quickly", "always"],
    correctAnswer: 0,
    explanation: {
      logic: "'There' tells WHERE (place). 'Tomorrow' = time (when), 'quickly' = manner (how), 'always' = frequency (how often). Only 'there' answers 'Where?'",
      formula: "Place: here, there, outside, inside | Time: tomorrow | Manner: quickly",
      trapAlerts: [
        "'tomorrow' is time adverb, not place",
        "'quickly' is manner adverb, not place",
        "'always' is frequency adverb, not place"
      ],
      commonMistakes: [
        "Not categorizing 'here/there' as place adverbs",
        "Confusing different types of adverbs"
      ]
    },
    difficulty: "easy",
    level: "A2"
  },
  {
    question: "What's the difference between 'here' and 'there'?",
    options: [
      "'Here' = near speaker, 'there' = away from speaker",
      "They mean exactly the same",
      "'There' = near, 'here' = far",
      "'Here' is past, 'there' is future"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Here' = this place, near the speaker: 'Come here' (come to where I am). 'There' = that place, away from the speaker: 'Go there' (go to that place, not where I am). Distance/proximity difference.",
      formula: "Here = near speaker (this place) | There = away from speaker (that place)",
      trapAlerts: [
        "They have different meanings - not interchangeable",
        "'there' means far/away, not near",
        "Neither relates to time (past/future) - both are about place"
      ],
      commonMistakes: [
        "Using 'here' and 'there' randomly without considering proximity",
        "Not understanding the near/far distinction"
      ]
    },
    difficulty: "medium",
    level: "A2"
  },

  // SUBTOPIC 6: Degree Adverbs - 5 questions
  {
    question: "What are adverbs of degree?",
    options: [
      "Adverbs that tell HOW MUCH or TO WHAT EXTENT",
      "Adverbs that tell WHEN something happens",
      "Adverbs that tell WHERE something happens",
      "Adverbs that tell WHY something happens"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Degree adverbs tell intensity/extent (HOW MUCH): very, too, quite, extremely, rather, really, almost, completely, totally. They modify adjectives and other adverbs: 'very beautiful', 'too expensive', 'extremely quickly'.",
      formula: "Degree adverbs: very, too, quite, extremely, rather, really, almost, completely",
      trapAlerts: [
        "WHEN = time adverbs (yesterday, tomorrow)",
        "WHERE = place adverbs (here, there)",
        "WHY = reason (usually clauses)"
      ],
      commonMistakes: [
        "Not recognizing intensity words (very, too, quite) as adverbs",
        "Confusing degree with other adverb types"
      ]
    },
    difficulty: "easy",
    level: "A2"
  },
  {
    question: "Identify the adverb of degree:\n\n'This book is very interesting.'",
    options: ["very", "book", "interesting", "is"],
    correctAnswer: 0,
    explanation: {
      logic: "'Very' modifies the adjective 'interesting' - tells HOW interesting (to what degree). Degree adverb showing intensity. 'Very interesting' = high degree of interest.",
      formula: "Degree adverb + adjective (very interesting, extremely tall, too expensive)",
      trapAlerts: [
        "'book' is a noun, not an adverb",
        "'interesting' is the adjective being modified by 'very'",
        "'is' is the linking verb"
      ],
      commonMistakes: [
        "Not recognizing 'very' as an adverb",
        "Thinking 'very' is an adjective"
      ]
    },
    difficulty: "easy",
    level: "A2"
  },
  {
    question: "What's the difference between 'very' and 'too'?",
    options: [
      "'Very' = high degree (positive/neutral), 'too' = excessive (negative)",
      "They mean exactly the same",
      "'Too' is always positive",
      "'Very' means insufficient"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Very' = high degree, neutral/positive: 'very beautiful' (great!), 'very big' (impressive). 'Too' = excessive, negative: 'too expensive' (can't afford), 'too difficult' (can't do). 'Too' implies a problem.",
      formula: "Very = high degree (okay) | Too = excessive (problem/negative)",
      trapAlerts: [
        "They have different meanings - not interchangeable",
        "'too' indicates excess/problem, not positive",
        "'very' doesn't mean insufficient - means high degree"
      ],
      commonMistakes: [
        "Using 'very' and 'too' interchangeably",
        "Not understanding 'too' implies something negative"
      ]
    },
    difficulty: "hard",
    level: "A2"
  },
  {
    question: "Where do degree adverbs go?",
    options: [
      "Before the adjective or adverb they modify",
      "After the adjective or adverb",
      "At the end of the sentence only",
      "At the beginning of the sentence only"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Degree adverbs go BEFORE the adjective/adverb they modify: 'very beautiful' (before adjective), 'extremely quickly' (before adverb). They show the intensity of what follows.",
      formula: "Degree adverb + adjective (very big, too small) | Degree + adverb (extremely quickly)",
      trapAlerts: [
        "After adjective/adverb is wrong - must go before",
        "Not restricted to sentence end - they modify specific words",
        "Not restricted to beginning - they go before what they modify"
      ],
      commonMistakes: [
        "Placing degree adverbs after adjectives",
        "Not understanding they directly modify the following word"
      ]
    },
    difficulty: "medium",
    level: "A2"
  },
  {
    question: "Choose the correct sentence:",
    options: [
      "The test was extremely difficult.",
      "The test was difficult extremely.",
      "Extremely the test was difficult.",
      "The extremely test was difficult."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Extremely' modifies the adjective 'difficult' - goes before it: 'extremely difficult'. Shows the degree/intensity of difficulty.",
      formula: "Subject + verb + degree adverb + adjective (was extremely difficult)",
      trapAlerts: [
        "'difficult extremely' puts adverb after adjective - wrong order",
        "'Extremely the test' puts adverb before article - unnatural",
        "'extremely test' tries to modify noun - degree adverbs modify adjectives/adverbs"
      ],
      commonMistakes: [
        "Placing degree adverbs after the adjective they modify",
        "Trying to use degree adverbs to modify nouns directly"
      ]
    },
    difficulty: "medium",
    level: "A2"
  }
];

async function insertQuestions() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('\n🎓 Inserting Adverbs Complete Questions (Batch 2/2 - FINAL)');
    console.log('='.repeat(80));
    console.log(`\n📋 Topic: adverbs-complete (A2 level)`);
    console.log(`   Questions in this batch: ${ADVERBS_BATCH2.length}`);
    console.log(`   Subtopics covered: Time (5), Place (5), Degree (5)\n`);

    let inserted = 0;
    for (const q of ADVERBS_BATCH2) {
      await pool.query(
        `INSERT INTO english_questions
         (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
        [
          'foundation',
          'adverbs-complete',
          q.level,
          q.question,
          JSON.stringify(q.options),
          q.correctAnswer,
          JSON.stringify(q.explanation),
          q.difficulty,
        ]
      );
      inserted++;

      if (inserted % 5 === 0) {
        console.log(`   ✓ Inserted ${inserted}/${ADVERBS_BATCH2.length}...`);
      }
    }

    console.log(`\n✅ Successfully inserted ${inserted} questions!`);
    console.log(`\n📊 Complete Progress for adverbs-complete:`);
    console.log(`   Batch 1 (Types/Manner/Frequency): 45 questions`);
    console.log(`   Batch 2 (Time/Place/Degree): 15 questions`);
    console.log(`   TOTAL: 60/60 questions ✅ COMPLETE`);

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

insertQuestions();
