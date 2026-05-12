#!/usr/bin/env node

/**
 * Generate Institute-Level English Questions
 * Based on British Council, Cambridge, IDP standards
 * Complete 4330+ questions across 8 modules
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

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║  PrepGenie - Institute-Level English Question Generator     ║');
console.log('║  Following British Council / Cambridge Standards            ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

// Module 1: Alphabet & Phonics (230 questions)
// Module 2: Basic Grammar (670 questions)
// Module 3: Tenses Mastery (1130 questions)
// Module 4: Sentence Construction (440 questions)
// Module 5: Vocabulary Building (720 questions)
// Module 6: Reading Skills (350 questions)
// Module 7: Writing Skills (470 questions)
// Module 8: Speaking & Listening (320 questions)

const moduleTopics = [
  // MODULE 1: Alphabet & Phonics (230 questions)
  {
    module: 1,
    name: "Alphabet & Phonics",
    topics: [
      {
        pathId: "foundation",
        topicId: "alphabet-basics",
        level: "beginner",
        count: 50,
        name: "English Alphabet",
        prompt: `Generate 50 multiple-choice questions about the English Alphabet for absolute beginners (A1 level).

Cover these topics:
- Identifying capital letters A-Z
- Identifying small letters a-z
- Letter names vs letter sounds
- Alphabetical order (which letter comes before/after)
- Letter recognition in words

Question format (JSON array):
[
  {
    "question": "Which letter comes after M in the alphabet?",
    "options": ["L", "N", "O", "P"],
    "correctAnswer": 1,
    "explanation": "The alphabetical order is ...L, M, N, O... Therefore, N comes after M.",
    "difficulty": "easy"
  }
]

Make questions:
- Simple and clear for beginners
- Mix capital and small letter questions
- Include real-world examples
- Progressive difficulty (easy → medium)
- Suitable for Indians learning English from scratch

Return ONLY the JSON array, no other text.`
      },
      {
        pathId: "foundation",
        topicId: "phonics-vowels",
        level: "beginner",
        count: 80,
        name: "Vowels & Consonants",
        prompt: `Generate 80 multiple-choice questions about Vowels and Consonants for English beginners (A1 level).

Cover these topics:
- Identifying the 5 vowels (a, e, i, o, u)
- Short vowel sounds (cat, bed, sit, hot, cup)
- Long vowel sounds (cake, meet, like, hope, cute)
- Consonant sounds
- Vowel vs Consonant recognition
- Silent letters (k in knife, b in climb)

Question types:
- "Which letter is a vowel?" - options with mixed vowels/consonants
- "Which word has a short 'a' sound?" - cat, cake, car
- "Identify the vowels in this word: ELEPHANT" - options with different letter combinations
- "Which word has a silent letter?" - knife, cat, pen

Make questions practical with real English words.
Mix difficulty: 40 easy, 30 medium, 10 hard.

Return ONLY the JSON array of 80 questions.`
      },
      {
        pathId: "foundation",
        topicId: "pronunciation",
        level: "beginner",
        count: 100,
        name: "Pronunciation Fundamentals",
        prompt: `Generate 100 multiple-choice questions about Pronunciation for Indian English learners (A1 level).

Cover these specific topics:
- Voiced vs Voiceless sounds (b/p, d/t, g/k, v/f)
- Minimal pairs that Indians confuse:
  * v/w (van/wan, vest/west)
  * th sounds (think, this, that)
  * r/l (rice/lice, right/light)
  * short i/long ee (ship/sheep, bit/beat)
- Word stress basics (PHOto, phoTOgraphy, photoGRAPHic)
- Common Indian pronunciation mistakes

Question examples:
- "Which word has the 'th' sound as in 'think'?" - three, tree, free, zee
- "What's the correct pronunciation stress: PhoTOgraph or PhotoGRAPH?"
- "Which pair has the SAME sound? van-wan, vet-wet, very-wary, vest-best"
- "In the word 'WATER', which syllable is stressed?"

Focus on practical pronunciation fixes for Indians.
Difficulty: 50 easy, 30 medium, 20 hard.

Return ONLY the JSON array of 100 questions.`
      }
    ]
  },

  // MODULE 2: Basic Grammar (670 questions)
  {
    module: 2,
    name: "Basic Grammar",
    topics: [
      {
        pathId: "foundation",
        topicId: "parts-of-speech",
        level: "beginner",
        count: 150,
        name: "8 Parts of Speech",
        prompt: `Generate 150 multiple-choice questions about the 8 Parts of Speech for beginners (A1 level).

Cover ALL 8 types with detailed questions:
1. Nouns (person, place, thing, idea) - 25 questions
2. Pronouns (I, you, he, she, it, we, they) - 20 questions
3. Verbs (action words: run, eat, sleep, is, are) - 25 questions
4. Adjectives (describing words: big, beautiful, fast) - 20 questions
5. Adverbs (how, when, where: quickly, tomorrow, here) - 20 questions
6. Prepositions (in, on, at, by, with, from) - 15 questions
7. Conjunctions (and, but, or, so, because) - 15 questions
8. Interjections (Wow!, Oh!, Alas!, Hurray!) - 10 questions

Question types:
- "Identify the noun: The CAT sits on the mat" → cat, sits, on, mat
- "Which word is a verb? She RUNS every morning" → She, runs, every, morning
- "What part of speech is 'quickly' in: He runs quickly" → noun, verb, adjective, adverb
- "Identify the preposition: The book is ON the table" → book, is, on, table

Include:
- Real sentences from daily life
- Simple vocabulary
- Clear explanations
- Mix all 8 types evenly

Difficulty: 75 easy, 50 medium, 25 hard.

Return ONLY the JSON array of 150 questions.`
      },
      {
        pathId: "foundation",
        topicId: "nouns-detailed",
        level: "beginner",
        count: 120,
        name: "Nouns Mastery",
        prompt: `Generate 120 multiple-choice questions about Nouns in detail (A1-A2 level).

Cover these topics in depth:
1. Proper Nouns (Mumbai, Rahul, India) - 15 questions
2. Common Nouns (city, boy, country) - 15 questions
3. Collective Nouns (team, class, family, flock) - 15 questions
4. Abstract Nouns (happiness, love, anger, freedom) - 15 questions
5. Material Nouns (gold, water, wood, cotton) - 10 questions
6. Singular → Plural (book→books, box→boxes) - 15 questions
7. Irregular Plurals (child→children, tooth→teeth, mouse→mice) - 15 questions
8. Countable vs Uncountable (apple/water, chair/furniture) - 15 questions
9. Gender (masculine, feminine, neuter, common) - 5 questions

Question examples:
- "Which is a proper noun?" → city, Mumbai, boy, school
- "What is the plural of 'child'?" → childs, childes, children, childs'
- "Which is an abstract noun?" → table, happiness, water, Mumbai
- "Which noun is countable?" → water, air, furniture, apple
- "A group of lions is called a ___" → herd, pride, flock, team

Include:
- Common Indian examples (Ganges, Delhi, Diwali)
- Practical real-life nouns
- Clear rules in explanations

Difficulty: 60 easy, 40 medium, 20 hard.

Return ONLY the JSON array of 120 questions.`
      },
      {
        pathId: "foundation",
        topicId: "pronouns-detailed",
        level: "beginner",
        count: 100,
        name: "Pronouns Complete",
        prompt: `Generate 100 multiple-choice questions about Pronouns (A1-A2 level).

Cover ALL pronoun types:
1. Subject Pronouns (I, you, he, she, it, we, they) - 15 questions
2. Object Pronouns (me, you, him, her, it, us, them) - 15 questions
3. Possessive Pronouns (mine, yours, his, hers, ours, theirs) - 15 questions
4. Possessive Adjectives (my, your, his, her, our, their) - 15 questions
5. Reflexive Pronouns (myself, yourself, himself, herself) - 10 questions
6. Demonstrative Pronouns (this, that, these, those) - 10 questions
7. Interrogative Pronouns (who, what, which, where, when, why, how) - 10 questions
8. Relative Pronouns (who, which, that, whose, whom) - 10 questions

Question examples:
- "Choose the correct pronoun: ___ is my brother" → He, Him, His, Himself
- "Which is an object pronoun?" → I, me, my, mine
- "Complete: This book is ___" → I, me, my, mine
- "This is the boy ___ won the prize" → who, which, what, whose

Include:
- Common mistakes Indians make (he/she confusion, I/me usage)
- Real conversation examples
- Subject-object pronoun differences

Difficulty: 50 easy, 35 medium, 15 hard.

Return ONLY the JSON array of 100 questions.`
      },
      {
        pathId: "foundation",
        topicId: "articles",
        level: "beginner",
        count: 80,
        name: "Articles (a, an, the)",
        prompt: `Generate 80 multiple-choice questions about Articles (A1-A2 level).

Cover ALL article rules:
1. Article 'A' before consonant sounds (a book, a university) - 20 questions
2. Article 'An' before vowel sounds (an apple, an hour) - 20 questions
3. Definite Article 'The' (the sun, the Taj Mahal) - 20 questions
4. Zero Article / No Article (go to school, play cricket) - 10 questions
5. Common mistakes Indians make - 10 questions

Special cases to include:
- "a university" (consonant sound 'yoo')
- "an hour" (silent h, vowel sound)
- "the" with unique things (the sun, the moon, the Prime Minister)
- "the" with musical instruments (play the guitar)
- No article with sports (play cricket, play football)
- No article with school/college/hospital when used generally

Question examples:
- "Complete: I saw ___ elephant in the zoo" → a, an, the, no article
- "She plays ___ piano beautifully" → a, an, the, no article
- "He goes to ___ school every day" → a, an, the, no article
- "Which is correct? ___ university or ___ university" → A, An

Focus on practical usage and common Indian mistakes.
Difficulty: 40 easy, 30 medium, 10 hard.

Return ONLY the JSON array of 80 questions.`
      },
      {
        pathId: "foundation",
        topicId: "adjectives",
        level: "beginner",
        count: 100,
        name: "Adjectives",
        prompt: `Generate 100 multiple-choice questions about Adjectives (A1-A2 level).

Cover these topics:
1. Identifying adjectives (big, small, beautiful, fast) - 25 questions
2. Types of adjectives:
   - Descriptive (beautiful, ugly, tall, short) - 15 questions
   - Quantitative (some, many, few, several, all) - 10 questions
   - Demonstrative (this, that, these, those) - 10 questions
   - Possessive (my, your, his, her, their) - 10 questions
3. Degrees of Comparison:
   - Positive (tall, beautiful, fast) - 10 questions
   - Comparative (taller, more beautiful, faster) - 10 questions
   - Superlative (tallest, most beautiful, fastest) - 10 questions

Question examples:
- "Identify the adjective: The BEAUTIFUL girl sings well" → the, beautiful, girl, sings
- "What is the comparative of 'good'?" → gooder, better, more good, best
- "Complete: Mount Everest is the ___ mountain" → tall, taller, tallest, most tall
- "Which is an adjective? She is VERY happy" → she, is, very, happy

Include:
- Irregular comparatives (good-better-best, bad-worse-worst)
- Order of adjectives (opinion, size, age, color: beautiful big old red car)
- Common adjectives in daily use

Difficulty: 50 easy, 35 medium, 15 hard.

Return ONLY the JSON array of 100 questions.`
      },
      {
        pathId: "foundation",
        topicId: "verbs-basics",
        level: "beginner",
        count: 120,
        name: "Verbs Fundamentals",
        prompt: `Generate 120 multiple-choice questions about Verbs (A1-A2 level).

Cover these verb topics:
1. Action Verbs (run, eat, sleep, write, read) - 20 questions
2. Linking Verbs (is, are, am, was, were, seem, look) - 15 questions
3. Helping Verbs (do, does, did, have, has, had, will, shall) - 15 questions
4. Regular Verbs (walk-walked, play-played, work-worked) - 15 questions
5. Irregular Verbs (go-went, eat-ate, see-saw, write-wrote) - 20 questions
6. Modal Verbs (can, could, may, might, must, should, will, would) - 20 questions
7. Verb Forms (V1, V2, V3, V4, V5) - 15 questions

Question examples:
- "Identify the verb: She RUNS every morning" → she, runs, every, morning
- "What is the past tense of 'go'?" → goed, went, gone, going
- "Which is a modal verb?" → is, run, can, happy
- "Complete: He ___ play cricket (ability)" → can, must, should, may
- "What is the V2 form of 'eat'?" → eats, eaten, eating, ate

Include:
- Common irregular verbs (50 most used)
- Modal verb usage (ability, possibility, permission, obligation)
- Verb forms (base, past, past participle, present participle)

Difficulty: 60 easy, 40 medium, 20 hard.

Return ONLY the JSON array of 120 questions.`
      }
    ]
  },

  // MODULE 3: Tenses - Starting with basic 3 tenses (more will be added later)
  {
    module: 3,
    name: "Tenses Mastery (Part 1)",
    topics: [
      {
        pathId: "foundation",
        topicId: "present-simple",
        level: "beginner",
        count: 100,
        name: "Present Simple Tense",
        prompt: `Generate 100 multiple-choice questions about Present Simple Tense (A1-A2 level).

Cover ALL aspects:
1. Structure: Subject + V1(+s/es) + Object
2. Positive sentences (I play, He plays) - 20 questions
3. Negative sentences (I don't play, He doesn't play) - 20 questions
4. Questions (Do you play? Does he play?) - 20 questions
5. Time expressions (every day, always, usually, sometimes, never) - 15 questions
6. Usage: habits, facts, routines - 15 questions
7. Third person singular (he/she/it + s/es/ies) - 10 questions

Question examples:
- "Complete: She ___ to school every day" → go, goes, going, went
- "Make negative: He plays cricket" → He don't play, He doesn't play, He not play
- "Which is correct? I goes / I go to college" → I goes, I go
- "Choose the time expression for present simple:" → yesterday, now, every day, tomorrow
- "Form question: You like pizza" → Do you like pizza, Are you like pizza, You like pizza

Include:
- Rules for -s, -es, -ies (play-plays, watch-watches, study-studies)
- Common verbs (be, have, go, come, like, want)
- Real-life examples from daily routine

Difficulty: 50 easy, 35 medium, 15 hard.

Return ONLY the JSON array of 100 questions.`
      },
      {
        pathId: "foundation",
        topicId: "present-continuous",
        level: "beginner",
        count: 100,
        name: "Present Continuous Tense",
        prompt: `Generate 100 multiple-choice questions about Present Continuous Tense (A1-A2 level).

Cover ALL aspects:
1. Structure: Subject + is/am/are + V1+ing + Object
2. Positive sentences (I am playing, He is playing) - 20 questions
3. Negative sentences (I am not playing, He is not playing) - 20 questions
4. Questions (Are you playing? Is he playing?) - 20 questions
5. Time expressions (now, at the moment, currently, right now) - 15 questions
6. Usage: actions happening now, temporary situations - 15 questions
7. Spelling rules for -ing (run-running, swim-swimming, die-dying) - 10 questions

Question examples:
- "Complete: She ___ dinner right now" → cook, cooks, is cooking, cooking
- "Make negative: They are playing" → They not playing, They aren't playing, They don't playing
- "Which is correct for NOW?" → I play, I am playing, I played, I will play
- "Choose the time expression: now / yesterday / always" → (for present continuous)
- "What's the -ing form of 'run'?" → runing, running, rining, runming

Include:
- Spelling rules (sit-sitting, swim-swimming, write-writing)
- Stative verbs that DON'T use continuous (know, understand, love, hate)
- Real situations (What are you doing? I am reading.)

Difficulty: 50 easy, 35 medium, 15 hard.

Return ONLY the JSON array of 100 questions.`
      },
      {
        pathId: "foundation",
        topicId: "past-simple",
        level: "beginner",
        count: 100,
        name: "Past Simple Tense",
        prompt: `Generate 100 multiple-choice questions about Past Simple Tense (A1-A2 level).

Cover ALL aspects:
1. Structure: Subject + V2 + Object
2. Positive sentences (I played, He went) - 20 questions
3. Negative sentences (I didn't play, He didn't go) - 20 questions
4. Questions (Did you play? Did he go?) - 20 questions
5. Time expressions (yesterday, last week, ago, in 2020) - 15 questions
6. Regular verbs (play-played, work-worked, study-studied) - 10 questions
7. Irregular verbs (go-went, eat-ate, see-saw, come-came) - 15 questions

Question examples:
- "Complete: He ___ to Delhi yesterday" → go, goes, went, going
- "Make negative: She ate pizza" → She didn't ate, She didn't eat, She not ate
- "Which is correct?" → I go yesterday, I went yesterday, I goed yesterday
- "Choose time expression: yesterday / now / tomorrow" → (for past simple)
- "What's the past of 'eat'?" → eated, eat, ate, eating

Include:
- 50 common irregular verbs (go-went, see-saw, have-had, do-did)
- Regular verb spelling rules (study-studied, stop-stopped, play-played)
- Real past events (I watched a movie yesterday)

Difficulty: 50 easy, 35 medium, 15 hard.

Return ONLY the JSON array of 100 questions.`
      }
    ]
  }
];

// Function to call OpenRouter API
async function generateQuestionsAI(prompt, count) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      model: "google/gemini-2.0-flash-exp:free",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 16000,
    });

    const options = {
      hostname: 'openrouter.ai',
      port: 443,
      path: '/api/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://prepgenie.co.in',
        'X-Title': 'PrepGenie English Learning',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = require('https').request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.choices && response.choices[0] && response.choices[0].message) {
            const content = response.choices[0].message.content;
            // Extract JSON array from markdown code blocks if present
            let jsonStr = content;
            if (content.includes('```json')) {
              jsonStr = content.split('```json')[1].split('```')[0].trim();
            } else if (content.includes('```')) {
              jsonStr = content.split('```')[1].split('```')[0].trim();
            }
            const questions = JSON.parse(jsonStr);
            resolve(questions);
          } else {
            reject(new Error('Invalid API response'));
          }
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(postData);
    req.end();
  });
}

// Main generation function
async function generateAllQuestions() {
  console.log('🎯 Target: Generate institute-level English questions\n');
  console.log('📚 Modules to generate:');
  moduleTopics.forEach((module, idx) => {
    const totalQuestions = module.topics.reduce((sum, t) => sum + t.count, 0);
    console.log(`   Module ${module.module}: ${module.name} - ${totalQuestions} questions (${module.topics.length} topics)`);
  });
  console.log('');

  let totalGenerated = 0;
  let totalFailed = 0;

  for (const module of moduleTopics) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`MODULE ${module.module}: ${module.name.toUpperCase()}`);
    console.log('='.repeat(70));

    for (const topic of module.topics) {
      console.log(`\n[${topic.topicId}] Generating: ${topic.name}`);
      console.log(`   Target: ${topic.count} questions`);
      console.log(`   🔄 Calling Gemini via OpenRouter...`);

      try {
        const questions = await generateQuestionsAI(topic.prompt, topic.count);

        if (!questions || questions.length === 0) {
          console.log(`   ❌ No questions generated`);
          totalFailed += topic.count;
          continue;
        }

        console.log(`   ✅ Generated ${questions.length} questions`);

        // Save to database
        let inserted = 0;
        let skipped = 0;

        for (const q of questions) {
          try {
            // Check for duplicates
            const existing = await db.execute({
              sql: 'SELECT id FROM english_questions WHERE path_id = ? AND topic_id = ? AND question = ?',
              args: [topic.pathId, topic.topicId, q.question]
            });

            if (existing.rows.length > 0) {
              skipped++;
              continue;
            }

            // Insert question
            await db.execute({
              sql: `INSERT INTO english_questions (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              args: [
                topic.pathId,
                topic.topicId,
                topic.level,
                q.question,
                JSON.stringify(q.options),
                q.correctAnswer,
                q.explanation,
                q.difficulty || 'medium'
              ]
            });
            inserted++;
          } catch (err) {
            console.error(`      ⚠️  Failed to insert: ${q.question.substring(0, 40)}...`);
          }
        }

        console.log(`   💾 Saved: ${inserted} new, ${skipped} duplicates`);
        totalGenerated += inserted;

        // Wait 2 seconds between API calls to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (err) {
        console.log(`   ❌ Failed: ${err.message}`);
        totalFailed += topic.count;
      }
    }
  }

  // Final summary
  console.log(`\n${'='.repeat(70)}`);
  console.log('✅ GENERATION COMPLETE!');
  console.log('='.repeat(70));

  const totalResult = await db.execute('SELECT COUNT(*) as count FROM english_questions');
  const totalInDB = totalResult.rows[0].count;

  console.log(`\n📊 Final Statistics:`);
  console.log(`   ✅ New questions generated: ${totalGenerated}`);
  console.log(`   ❌ Failed to generate: ${totalFailed}`);
  console.log(`   📦 Total in database: ${totalInDB}`);
  console.log(`   🎯 Target: 4330+ questions`);
  console.log(`   📈 Progress: ${Math.round((totalInDB / 4330) * 100)}%`);

  console.log(`\n🎉 Institute-level English question bank is growing!\n`);
}

// Run the generator
generateAllQuestions()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('\n❌ Generation failed:', err);
    process.exit(1);
  });
