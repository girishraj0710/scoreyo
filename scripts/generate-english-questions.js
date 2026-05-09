#!/usr/bin/env node

/**
 * Generate Initial English Learning Questions
 * Creates questions for top topics in each learning path
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@libsql/client');

// Load environment variables
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
}

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║  PrepGenie - Generate English Learning Questions            ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

// Sample questions for each topic (starter set)
const sampleQuestions = {
  // Competitive Exam English
  "competitive-exam__grammar-basics__beginner": [
    {
      question: "Choose the correct sentence:",
      options: [
        "She don't like coffee",
        "She doesn't likes coffee",
        "She doesn't like coffee",
        "She not like coffee"
      ],
      correctAnswer: 2,
      explanation: "The correct form is 'doesn't like' (does not + base verb) for third person singular (she/he/it).",
      difficulty: "easy"
    },
    {
      question: "Fill in the blank: I _____ to the market yesterday.",
      options: ["go", "goes", "went", "going"],
      correctAnswer: 2,
      explanation: "'Went' is the past tense of 'go'. The word 'yesterday' indicates past time.",
      difficulty: "easy"
    },
    {
      question: "Select the correct article: ___ apple a day keeps the doctor away.",
      options: ["A", "An", "The", "No article needed"],
      correctAnswer: 1,
      explanation: "Use 'An' before words starting with a vowel sound. 'Apple' starts with the vowel 'A'.",
      difficulty: "easy"
    },
    {
      question: "Which sentence is in active voice?",
      options: [
        "The cake was eaten by John",
        "John ate the cake",
        "The cake has been eaten",
        "The cake is being eaten"
      ],
      correctAnswer: 1,
      explanation: "Active voice has the subject performing the action: 'John (subject) ate (verb) the cake (object)'.",
      difficulty: "medium"
    },
    {
      question: "Choose the correct preposition: She is good ___ mathematics.",
      options: ["in", "at", "on", "with"],
      correctAnswer: 1,
      explanation: "We use 'at' with skills and abilities. 'Good at mathematics' is the correct expression.",
      difficulty: "medium"
    }
  ],

  "competitive-exam__vocabulary-ssc__intermediate": [
    {
      question: "What is the synonym of 'ABUNDANT'?",
      options: ["Scarce", "Plentiful", "Rare", "Limited"],
      correctAnswer: 1,
      explanation: "'Abundant' means existing in large quantities, so 'Plentiful' is the correct synonym.",
      difficulty: "medium"
    },
    {
      question: "What is the antonym of 'GENEROUS'?",
      options: ["Kind", "Stingy", "Wealthy", "Charitable"],
      correctAnswer: 1,
      explanation: "'Generous' means willing to give. The opposite is 'Stingy' (unwilling to spend money).",
      difficulty: "medium"
    },
    {
      question: "One word substitution for 'A person who loves books':",
      options: ["Bibliophile", "Bibliophobe", "Librarian", "Scholar"],
      correctAnswer: 0,
      explanation: "'Bibliophile' comes from Greek: biblio (book) + phile (lover). A book lover.",
      difficulty: "medium"
    },
    {
      question: "What does the idiom 'Bite the bullet' mean?",
      options: [
        "To eat quickly",
        "To face a difficult situation bravely",
        "To make a mistake",
        "To avoid responsibility"
      ],
      correctAnswer: 1,
      explanation: "'Bite the bullet' means to endure a painful or difficult situation with courage.",
      difficulty: "medium"
    },
    {
      question: "Choose the correctly spelled word:",
      options: ["Occassion", "Occasion", "Ocasion", "Occation"],
      correctAnswer: 1,
      explanation: "The correct spelling is 'Occasion' (with double 'c' and single 's').",
      difficulty: "easy"
    }
  ],

  // IELTS & TOEFL
  "ielts-toefl__academic-vocabulary__intermediate": [
    {
      question: "The research _____ significant findings about climate change.",
      options: ["revealed", "reveled", "revelled", "revealled"],
      correctAnswer: 0,
      explanation: "'Revealed' means to make known or show. It's commonly used in academic writing.",
      difficulty: "medium"
    },
    {
      question: "Which word means 'to make something less severe'?",
      options: ["Aggravate", "Mitigate", "Exacerbate", "Intensify"],
      correctAnswer: 1,
      explanation: "'Mitigate' means to make less severe or serious. Common in IELTS/TOEFL essays.",
      difficulty: "medium"
    },
    {
      question: "Choose the formal alternative: 'The study shows that...'",
      options: [
        "The study tells that",
        "The study demonstrates that",
        "The study says that",
        "The study talks about"
      ],
      correctAnswer: 1,
      explanation: "'Demonstrates' is more formal and academic than 'shows'. Preferred in IELTS/TOEFL writing.",
      difficulty: "medium"
    },
    {
      question: "What is a synonym for 'UBIQUITOUS'?",
      options: ["Rare", "Present everywhere", "Unusual", "Limited"],
      correctAnswer: 1,
      explanation: "'Ubiquitous' means present, appearing, or found everywhere. Common in academic texts.",
      difficulty: "hard"
    },
    {
      question: "Select the correct collocation: 'to _____ a conclusion'",
      options: ["make", "do", "reach", "get"],
      correctAnswer: 2,
      explanation: "'Reach a conclusion' is the standard collocation in academic English.",
      difficulty: "medium"
    }
  ],

  // Foundation Builder
  "foundation__basic-grammar__beginner": [
    {
      question: "What is a noun?",
      options: [
        "An action word",
        "A describing word",
        "A naming word",
        "A connecting word"
      ],
      correctAnswer: 2,
      explanation: "A noun is a naming word. It names a person, place, thing, or idea.",
      difficulty: "easy"
    },
    {
      question: "Which is a proper noun?",
      options: ["city", "Mumbai", "building", "street"],
      correctAnswer: 1,
      explanation: "A proper noun is the specific name of a person, place, or thing. It's always capitalized.",
      difficulty: "easy"
    },
    {
      question: "Choose the correct verb: They _____ football every Sunday.",
      options: ["plays", "play", "playing", "played"],
      correctAnswer: 1,
      explanation: "'Play' is correct for plural subject 'They'. No 's' needed for plural.",
      difficulty: "easy"
    },
    {
      question: "What is the plural of 'child'?",
      options: ["childs", "childes", "children", "child's"],
      correctAnswer: 2,
      explanation: "'Children' is the irregular plural form of 'child'. Not all plurals add 's'.",
      difficulty: "easy"
    },
    {
      question: "Which word is an adjective?",
      options: ["quickly", "run", "beautiful", "happiness"],
      correctAnswer: 2,
      explanation: "An adjective describes a noun. 'Beautiful' describes how something looks.",
      difficulty: "easy"
    }
  ],

  "foundation__essential-vocabulary__beginner": [
    {
      question: "What does 'happy' mean?",
      options: ["Sad", "Angry", "Joyful", "Tired"],
      correctAnswer: 2,
      explanation: "'Happy' means feeling joy or pleasure. It's the opposite of 'sad'.",
      difficulty: "easy"
    },
    {
      question: "Choose the opposite of 'hot':",
      options: ["warm", "cold", "cool", "freezing"],
      correctAnswer: 1,
      explanation: "'Cold' is the direct opposite of 'hot'. Temperature extremes.",
      difficulty: "easy"
    },
    {
      question: "What is a synonym for 'big'?",
      options: ["small", "large", "tiny", "little"],
      correctAnswer: 1,
      explanation: "'Large' means the same as 'big'. Both describe size.",
      difficulty: "easy"
    },
    {
      question: "Which word means 'very tired'?",
      options: ["exhausted", "energetic", "active", "lively"],
      correctAnswer: 0,
      explanation: "'Exhausted' means extremely tired or having no energy left.",
      difficulty: "easy"
    },
    {
      question: "What does 'help' mean?",
      options: [
        "To make things worse",
        "To assist or support",
        "To ignore",
        "To criticize"
      ],
      correctAnswer: 1,
      explanation: "'Help' means to assist someone or make things easier for them.",
      difficulty: "easy"
    }
  ],

  // Real-World English
  "real-world__daily-conversations__beginner": [
    {
      question: "How do you greet someone in the morning?",
      options: [
        "Good night",
        "Good morning",
        "Good evening",
        "Good afternoon"
      ],
      correctAnswer: 1,
      explanation: "'Good morning' is used to greet someone from sunrise until noon.",
      difficulty: "easy"
    },
    {
      question: "At a restaurant, how do you politely order food?",
      options: [
        "Give me a burger",
        "I want a burger",
        "Can I have a burger, please?",
        "Burger"
      ],
      correctAnswer: 2,
      explanation: "'Can I have...please?' is the polite way to order. Always use 'please' in requests.",
      difficulty: "easy"
    },
    {
      question: "How do you ask for directions?",
      options: [
        "Where is the bank?",
        "Bank where?",
        "Tell me bank",
        "Bank?"
      ],
      correctAnswer: 0,
      explanation: "'Where is the [place]?' is the standard way to ask for directions.",
      difficulty: "easy"
    },
    {
      question: "What do you say when someone thanks you?",
      options: [
        "Yes",
        "Okay",
        "You're welcome",
        "No problem"
      ],
      correctAnswer: 2,
      explanation: "'You're welcome' is the most common response to 'Thank you'. 'No problem' is also acceptable.",
      difficulty: "easy"
    },
    {
      question: "How do you introduce yourself?",
      options: [
        "Me is John",
        "My name is John",
        "I John",
        "John here"
      ],
      correctAnswer: 1,
      explanation: "'My name is [name]' is the formal way to introduce yourself.",
      difficulty: "easy"
    }
  ],

  "real-world__email-writing__intermediate": [
    {
      question: "What is a professional way to start a formal email?",
      options: [
        "Hey!",
        "Hi there,",
        "Dear Sir/Madam,",
        "What's up?"
      ],
      correctAnswer: 2,
      explanation: "'Dear Sir/Madam' is formal and professional. Use for business emails to unknown recipients.",
      difficulty: "medium"
    },
    {
      question: "How do you end a professional email?",
      options: [
        "Bye",
        "See you",
        "Best regards,",
        "Later"
      ],
      correctAnswer: 2,
      explanation: "'Best regards' or 'Sincerely' are professional email closings.",
      difficulty: "medium"
    },
    {
      question: "Which is most appropriate for a job application email?",
      options: [
        "I want this job",
        "I am writing to express my interest in the position",
        "Give me the job",
        "I need a job"
      ],
      correctAnswer: 1,
      explanation: "Formal language shows professionalism. 'I am writing to express...' is appropriate.",
      difficulty: "medium"
    },
    {
      question: "How do you make a polite request in an email?",
      options: [
        "I need the report now",
        "Send me the report",
        "Could you please send me the report?",
        "Report please"
      ],
      correctAnswer: 2,
      explanation: "'Could you please...' is polite and professional for making requests.",
      difficulty: "medium"
    },
    {
      question: "What's wrong with this email opening? 'Hi Boss, What's up?'",
      options: [
        "Nothing wrong",
        "Too informal",
        "Too formal",
        "Grammatically incorrect"
      ],
      correctAnswer: 1,
      explanation: "This is too casual for professional communication. Use 'Dear [Name]' instead.",
      difficulty: "medium"
    }
  ]
};

async function generateQuestions() {
  console.log('📝 Generating initial English questions...\n');

  let totalGenerated = 0;

  for (const [key, questions] of Object.entries(sampleQuestions)) {
    const [pathId, topicId, level] = key.split('__');

    console.log(`   Processing: ${pathId} → ${topicId} (${level})`);

    const statements = questions.map(q => ({
      sql: `INSERT INTO english_questions (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        pathId,
        topicId,
        level,
        q.question,
        JSON.stringify(q.options),
        q.correctAnswer,
        q.explanation,
        q.difficulty
      ]
    }));

    try {
      await db.batch(statements, 'write');
      console.log(`   ✅ Added ${questions.length} questions\n`);
      totalGenerated += questions.length;
    } catch (error) {
      console.error(`   ❌ Failed: ${error.message}\n`);
    }
  }

  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║  ✅ GENERATION COMPLETE!                                     ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  console.log(`📊 Summary:`);
  console.log(`   ✅ Total questions generated: ${totalGenerated}`);
  console.log(`   ✅ Topics covered: ${Object.keys(sampleQuestions).length}`);
  console.log(`   ✅ Learning paths: 4 (Competitive, IELTS, Foundation, Real-World)\n`);

  console.log('🎉 English Learning Hub is ready for testing!');
  console.log('\n📦 Next steps:');
  console.log('   1. Test practice quizzes at /english');
  console.log('   2. Add more questions using AI generation');
  console.log('   3. Build level assessment page\n');
}

// Run
generateQuestions()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('\n❌ Error:', err);
    process.exit(1);
  });
