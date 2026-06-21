import { Pool } from 'pg';
import { config } from 'dotenv';

config({ path: '.env.local' });

/**
 * Adjectives Questions - Batch 2 (Complete)
 * Topic: adjectives (A1 level)
 * Subtopic: Order of Adjectives - 15 questions
 */

const ADJECTIVES_ORDER_QUESTIONS = [
  {
    question: "What is the correct order when using multiple adjectives before a noun?",
    options: [
      "Opinion → Size → Age → Color → Noun",
      "Color → Size → Opinion → Age → Noun",
      "Size → Color → Age → Opinion → Noun",
      "Age → Opinion → Size → Color → Noun"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Adjectives follow a specific order in English: Opinion (beautiful, ugly) → Size (big, small) → Age (old, new) → Color (red, blue) → Noun. Example: 'a beautiful big old red car'. Opinion adjectives (what you think) come first, physical facts come later.",
      formula: "OSAC order: Opinion → Size → Age → Color → Noun",
      trapAlerts: [
        "Starting with color puts physical attribute before opinion - breaks natural English order",
        "Option C starts with size, skipping opinion - incorrect sequence",
        "Option D starts with age - puts factual attribute before opinion, unnatural"
      ],
      commonMistakes: [
        "Not learning the OSAC order (Opinion-Size-Age-Color)",
        "Placing physical attributes (size, color) before opinions"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Which sentence has adjectives in the correct order?",
    options: [
      "She bought a beautiful small round table.",
      "She bought a small beautiful round table.",
      "She bought a round small beautiful table.",
      "She bought a beautiful round small table."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Correct order: Opinion (beautiful) → Size (small) → Shape (round) → Noun (table). Opinion comes first, then size, then other physical properties like shape. This sounds most natural to native speakers.",
      formula: "Opinion + Size + Shape + Noun (beautiful small round table)",
      trapAlerts: [
        "'small beautiful' puts size before opinion - reversed order",
        "'round small beautiful' starts with shape - completely backwards",
        "'beautiful round small' puts shape before size - breaks size-then-shape pattern"
      ],
      commonMistakes: [
        "Mixing up the order of size and opinion adjectives",
        "Not recognizing that opinion always comes first"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Complete with adjectives in correct order:\n\n'He lives in a ___ house.'",
    options: [
      "big old white",
      "white old big",
      "old big white",
      "white big old"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Order: Size (big) → Age (old) → Color (white). Physical dimensions (size) come before history (age), which comes before color. 'A big old white house' follows natural English order.",
      formula: "Size + Age + Color + Noun (big old white house)",
      trapAlerts: [
        "'white old big' reverses the entire sequence - starts with color",
        "'old big white' puts age before size - incorrect sequence",
        "'white big old' starts with color - should end with color, not start"
      ],
      commonMistakes: [
        "Placing color first (Hindi influence - colors often come early)",
        "Not maintaining size → age → color sequence"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Why do opinion adjectives come before fact adjectives?",
    options: [
      "Opinions are personal, so they frame our view first",
      "Opinions are always longer words",
      "Facts are more important than opinions",
      "There is no rule - any order works"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Opinion adjectives (beautiful, ugly, lovely, terrible) express personal judgment and come first. Fact adjectives (big, old, red) state measurable qualities and follow. We frame things with our opinion, then give facts: 'a beautiful big old house' (opinion → facts).",
      formula: "Opinion (subjective) before Facts (objective)",
      trapAlerts: [
        "Word length doesn't determine order - 'big' (fact) is short but comes after 'ugly' (opinion)",
        "Facts aren't more important - they just follow opinions in English grammar",
        "There is a specific rule - random order sounds unnatural to native speakers"
      ],
      commonMistakes: [
        "Thinking any order works - specific order sounds natural",
        "Not understanding the opinion vs. fact distinction"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Find the error in adjective order:\n\n'I saw a red big old car.'",
    options: [
      "'red big old' should be 'big old red'",
      "No error",
      "'car' should be plural",
      "'saw' should be 'seen'"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Correct order: Size (big) → Age (old) → Color (red). 'Red big old' starts with color, which should come last among these three. Rearrange to 'big old red car'.",
      formula: "Size → Age → Color (not Color → Size → Age)",
      trapAlerts: [
        "The sentence has an error in adjective order",
        "'car' is correctly singular (one car, uses 'a')",
        "'saw' is correct past tense (see → saw → seen)"
      ],
      commonMistakes: [
        "Placing color before size - very common error",
        "Not recognizing when adjective order sounds unnatural"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Which type of adjective comes FIRST before a noun?",
    options: [
      "Opinion (beautiful, ugly, lovely)",
      "Size (big, small, tall)",
      "Color (red, blue, green)",
      "Age (old, new, young)"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Opinion adjectives always come first: beautiful, ugly, lovely, terrible, wonderful, awful. These express what you think (subjective). After opinion come size, age, then color (objective facts).",
      formula: "Opinion FIRST, then facts (size, age, color)",
      trapAlerts: [
        "Size comes after opinion (a beautiful big house, not a big beautiful house)",
        "Color comes last in this sequence (after opinion, size, age)",
        "Age comes after size but before color"
      ],
      commonMistakes: [
        "Starting with size or color instead of opinion",
        "Not memorizing that opinion is always first"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Choose the correct order:\n\n'She wore a ___ dress.'",
    options: [
      "beautiful long blue",
      "long beautiful blue",
      "blue beautiful long",
      "blue long beautiful"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Order: Opinion (beautiful) → Size/Length (long) → Color (blue). Opinion first, physical dimension second, color last. 'A beautiful long blue dress' sounds natural.",
      formula: "Opinion + Length + Color + Noun (beautiful long blue dress)",
      trapAlerts: [
        "'long beautiful' puts size before opinion - incorrect order",
        "'blue beautiful long' starts with color - should end with color",
        "'blue long beautiful' has color first - completely backwards"
      ],
      commonMistakes: [
        "Not treating length (long, short) as a size adjective",
        "Placing color before other adjectives"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "What makes 'a red big ball' sound wrong to native speakers?",
    options: [
      "Color (red) should come after size (big)",
      "We should say 'a balls' instead of 'a ball'",
      "'big' should be 'bigger'",
      "Nothing - it's correct"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Adjective order rules make 'red big' sound unnatural. Correct order: size before color → 'a big red ball'. Native speakers internalize this order, so violations sound immediately wrong even if meaning is clear.",
      formula: "Size + Color (big red, not red big)",
      trapAlerts: [
        "'a balls' is grammatically wrong - 'a' requires singular noun",
        "'bigger' is comparative - no comparison happening here",
        "The sentence is incorrect - violates adjective order"
      ],
      commonMistakes: [
        "Thinking color can go anywhere because meaning is clear",
        "Not realizing adjective order affects naturalness, not just correctness"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Complete correctly:\n\n'They live in an ___ building.'",
    options: [
      "ugly old gray",
      "gray ugly old",
      "old gray ugly",
      "gray old ugly"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Order: Opinion (ugly) → Age (old) → Color (gray). Opinion frames our view first, then factual age, then appearance color. 'An ugly old gray building' follows natural order.",
      formula: "Opinion + Age + Color + Noun",
      trapAlerts: [
        "'gray ugly old' starts with color - should end with color",
        "'old gray ugly' puts age first - opinion should come first",
        "'gray old ugly' starts with color and ends with opinion - completely reversed"
      ],
      commonMistakes: [
        "Forgetting opinion must come first",
        "Placing color in random positions"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "When we use three adjectives (opinion, size, color), which pattern is correct?",
    options: [
      "Opinion + Size + Color (lovely big red)",
      "Size + Opinion + Color (big lovely red)",
      "Color + Size + Opinion (red big lovely)",
      "Color + Opinion + Size (red lovely big)"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Three adjectives follow OSC order: Opinion (lovely) → Size (big) → Color (red). Opinion always first, size in middle, color last. Example: 'a lovely big red balloon'.",
      formula: "Opinion-Size-Color pattern (lovely big red)",
      trapAlerts: [
        "'big lovely red' puts size before opinion - breaks the rule",
        "'red big lovely' starts with color - entire sequence backwards",
        "'red lovely big' has color first - should be last"
      ],
      commonMistakes: [
        "Randomly ordering adjectives without following OSC pattern",
        "Not practicing the Opinion-Size-Color sequence"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Which sentence sounds MOST natural to English speakers?",
    options: [
      "a nice small new black car",
      "a black small nice new car",
      "a small new nice black car",
      "a new black nice small car"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Complete order: Opinion (nice) → Size (small) → Age (new) → Color (black). Four adjectives follow the full OSAC pattern. Native speakers automatically use this order.",
      formula: "Full OSAC: Opinion → Size → Age → Color → Noun",
      trapAlerts: [
        "'black small nice new' starts with color - completely wrong sequence",
        "'small new nice black' has size first - skips opinion",
        "'new black nice small' starts with age - opinion should lead"
      ],
      commonMistakes: [
        "Not extending the pattern when using 4+ adjectives",
        "Thinking order doesn't matter if meaning is clear"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "What's the rule for opinion vs. size adjectives?",
    options: [
      "Opinion comes before size (beautiful big, not big beautiful)",
      "Size comes before opinion (big beautiful, not beautiful big)",
      "Either order works equally well",
      "Use only one, never both together"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Opinion adjectives (beautiful, ugly, lovely, terrible) ALWAYS come before size adjectives (big, small, tiny, huge). Rule is fixed: opinion → size. 'A beautiful big house' sounds natural; 'a big beautiful house' sounds off.",
      formula: "Opinion before Size (beautiful big, lovely small, terrible huge)",
      trapAlerts: [
        "'big beautiful' reverses the natural order - sounds unnatural",
        "Order matters for natural-sounding English - not interchangeable",
        "Using both together is fine - just follow the correct order"
      ],
      commonMistakes: [
        "Saying 'big beautiful' instead of 'beautiful big'",
        "Not recognizing opinion vs. size distinction"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Find the correctly ordered adjectives:\n\n'I want ___ flowers.'",
    options: [
      "some beautiful fresh red",
      "some red fresh beautiful",
      "some fresh red beautiful",
      "some red beautiful fresh"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "With quantity word 'some' included: Quantity (some) → Opinion (beautiful) → Age/Condition (fresh) → Color (red). 'Fresh' indicates newness/condition (like age). Complete order maintained.",
      formula: "Quantity + Opinion + Condition + Color + Noun",
      trapAlerts: [
        "'red fresh beautiful' puts color first - should come last",
        "'fresh red beautiful' skips opinion at start - opinion should lead",
        "'red beautiful fresh' starts with color - completely backwards"
      ],
      commonMistakes: [
        "Not knowing where quantity words (some, many, three) go in the sequence",
        "Forgetting 'fresh' acts like an age/condition adjective"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Why does 'a wooden old big table' sound strange?",
    options: [
      "Material (wooden) should come after size and age",
      "Material should always come first",
      "'table' should be plural",
      "Nothing - it's perfectly correct"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Material adjectives (wooden, metal, plastic, cotton) come very late in the sequence, after size and age. Correct order: 'a big old wooden table' (size → age → material). Material is a fact that comes near the end.",
      formula: "Size → Age → Material (big old wooden, not wooden old big)",
      trapAlerts: [
        "Material doesn't come first - it's near the end of the sequence",
        "'table' is correctly singular (using 'a')",
        "The order is incorrect - material is misplaced"
      ],
      commonMistakes: [
        "Not knowing where material adjectives fit in the order",
        "Placing material too early in the sequence"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "What is the complete adjective order pattern in English?",
    options: [
      "Opinion → Size → Age → Shape → Color → Origin → Material",
      "Color → Size → Age → Opinion → Material → Origin",
      "Size → Color → Age → Opinion → Origin → Material",
      "Any order works - English has no fixed pattern"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Complete order: Opinion (beautiful) → Size (big) → Age (old) → Shape (round) → Color (red) → Origin (Italian) → Material (wooden). Memory aid: OSASCOOM. Rarely use all 7 together - usually 2-3 adjectives maximum.",
      formula: "OSASCOOM: Opinion-Size-Age-Shape-Color-Origin-Material + Noun",
      trapAlerts: [
        "Option B starts with color - incorrect, opinion comes first",
        "Option C starts with size - skips opinion",
        "English has a very specific order - native speakers follow it automatically"
      ],
      commonMistakes: [
        "Not learning the complete sequence (even if rarely using all 7)",
        "Thinking English adjective order is flexible like some other languages"
      ]
    },
    difficulty: "hard",
    level: "A1"
  }
];

async function insertQuestions() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('\n🎓 Inserting Adjectives Questions (Batch 2/2 - FINAL)');
    console.log('='.repeat(80));
    console.log(`\n📋 Topic: adjectives (A1 level)`);
    console.log(`   Questions in this batch: ${ADJECTIVES_ORDER_QUESTIONS.length}`);
    console.log(`   Subtopic: Order of Adjectives (15 questions)\n`);

    let inserted = 0;
    for (const q of ADJECTIVES_ORDER_QUESTIONS) {
      await pool.query(
        `INSERT INTO english_questions
         (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
        [
          'foundation',
          'adjectives',
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
        console.log(`   ✓ Inserted ${inserted}/${ADJECTIVES_ORDER_QUESTIONS.length}...`);
      }
    }

    console.log(`\n✅ Successfully inserted ${inserted} questions!`);
    console.log(`\n📊 Complete Progress for adjectives:`);
    console.log(`   Batch 1 (Descriptive/Comparative/Superlative): 45 questions`);
    console.log(`   Batch 2 (Order of Adjectives): 15 questions`);
    console.log(`   TOTAL: 60/60 questions ✅ COMPLETE`);

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

insertQuestions();
