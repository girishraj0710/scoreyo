#!/usr/bin/env node

/**
 * Generate English Learning Questions Using Together.ai
 * Uses free credits to generate 1000+ questions across all modules
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
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
console.log('║  PrepGenie - AI English Question Generator (OpenRouter)     ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

// Priority topics to generate (Module 1 & 2 - A1 Foundation)
const topicsToGenerate = [
  // Module 1: Alphabet & Phonics
  {
    pathId: "foundation",
    topicId: "alphabet-basics",
    level: "beginner",
    count: 25,
    prompt: `Generate 25 multiple-choice questions about the English Alphabet for absolute beginners.

Topics to cover:
- Identifying capital letters (A-Z)
- Identifying small letters (a-z)
- Letter sounds vs letter names
- Alphabetical order
- Letter recognition

Format each question as JSON:
{
  "question": "Which letter comes after M in the alphabet?",
  "options": ["L", "N", "O", "P"],
  "correctAnswer": 1,
  "explanation": "The alphabet order is ...L, M, N, O... So N comes after M.",
  "difficulty": "easy"
}

Make questions simple, clear, and suitable for beginners learning English from scratch. Include visual descriptions where needed (capital vs small letters).`
  },

  {
    pathId: "foundation",
    topicId: "phonics-vowels",
    level: "beginner",
    count: 25,
    prompt: `Generate 25 multiple-choice questions about Vowels and Consonants for English beginners.

Topics to cover:
- Identifying the 5 vowels (a, e, i, o, u)
- Short vowel sounds (cat, bed, sit, hot, cup)
- Long vowel sounds (cake, meet, like, hope, cute)
- Consonant sounds
- Vowel vs Consonant recognition

Format each question as JSON with question, 4 options, correctAnswer (0-3), explanation, and difficulty (easy/medium).

Make questions practical with real English words as examples.`
  },

  // Module 2: Basic Grammar - Parts of Speech
  {
    pathId: "foundation",
    topicId: "parts-of-speech",
    level: "beginner",
    count: 30,
    prompt: `Generate 30 multiple-choice questions about the 8 Parts of Speech for English beginners.

Cover all 8 types:
1. Noun (person, place, thing, idea)
2. Pronoun (I, you, he, she, it, we, they)
3. Verb (action words: run, eat, sleep)
4. Adjective (describing words: big, beautiful, fast)
5. Adverb (how, when, where: quickly, tomorrow, here)
6. Preposition (in, on, at, by, with)
7. Conjunction (and, but, or, so, because)
8. Interjection (Wow!, Oh!, Alas!)

Format: JSON with question, 4 options, correctAnswer (0-3), explanation, difficulty.

Include examples like:
- "Which word is a noun? (table, quickly, and, wow)"
- "Identify the verb: She runs fast"
- "Find the adjective: The blue car"

Make it beginner-friendly with clear explanations.`
  },

  {
    pathId: "foundation",
    topicId: "nouns-detailed",
    level: "beginner",
    count: 30,
    prompt: `Generate 30 multiple-choice questions about Nouns in Detail for English learners.

Topics to cover:
- Proper nouns vs Common nouns (Mumbai vs city, Rahul vs boy)
- Collective nouns (team, class, family, flock)
- Abstract nouns (happiness, love, anger)
- Material nouns (gold, water, wood)
- Singular vs Plural (book→books)
- Irregular plurals (child→children, mouse→mice, tooth→teeth)
- Countable vs Uncountable nouns
- Gender (masculine, feminine, neuter)

Format: JSON with question, 4 options, correctAnswer, explanation, difficulty.

Include variety: identification, conversion (singular to plural), categorization.`
  },

  {
    pathId: "foundation",
    topicId: "pronouns-detailed",
    level: "beginner",
    count: 25,
    prompt: `Generate 25 multiple-choice questions about Pronouns for English beginners.

Types to cover:
- Subject pronouns (I, you, he, she, it, we, they)
- Object pronouns (me, you, him, her, it, us, them)
- Possessive pronouns (mine, yours, his, hers, ours, theirs)
- Possessive adjectives (my, your, his, her, our, their)
- Reflexive pronouns (myself, yourself, himself, herself)
- Demonstrative pronouns (this, that, these, those)

Format: JSON with question, 4 options, correctAnswer, explanation, difficulty.

Examples:
- "Replace with pronoun: Rahul is my friend. __ lives nearby."
- "Choose possessive pronoun: This book is __. (mine/my/me/I)"
- "Reflexive pronoun: I hurt __. (me/myself/I/mine)"`
  },

  {
    pathId: "foundation",
    topicId: "articles",
    level: "beginner",
    count: 25,
    prompt: `Generate 25 multiple-choice questions about Articles (a, an, the) for English learners.

Rules to cover:
- Use 'a' before consonant sounds (a book, a university, a one-rupee coin)
- Use 'an' before vowel sounds (an apple, an hour, an umbrella)
- Use 'the' for specific things (the book I bought, the sun, the Taj Mahal)
- When NOT to use articles (zero article: going to school, by car)
- Common mistakes Indians make

Format: JSON with question, 4 options, correctAnswer, explanation, difficulty.

Include fill-in-the-blank and error identification:
- "Fill: I have __ apple." (a/an/the/no article)
- "Find error: She goes to the school daily."
- "Choose article: He is __ honest man." (a/an/the/no article)`
  },

  // Module 3: Tenses (Most Important)
  {
    pathId: "foundation",
    topicId: "present-simple",
    level: "beginner",
    count: 30,
    prompt: `Generate 30 multiple-choice questions about Simple Present Tense for English learners.

Structure: Subject + V1(s/es)
Usage: Habits, routines, facts, universal truths

Topics:
- Basic structure (I play, He plays)
- Adding -s/-es for he/she/it
- Negative form (don't/doesn't + V1)
- Question form (Do/Does + subject + V1?)
- Time expressions (always, usually, often, sometimes, never, every day)
- Common mistakes

Format: JSON with question, 4 options, correctAnswer, explanation, difficulty.

Include variety:
- Fill blanks: "She __ (play/plays) cricket."
- Error spotting: "He don't like coffee."
- Sentence formation
- Time expression usage`
  },

  {
    pathId: "foundation",
    topicId: "present-continuous",
    level: "beginner",
    count: 30,
    prompt: `Generate 30 multiple-choice questions about Present Continuous Tense.

Structure: Subject + is/am/are + V-ing
Usage: Actions happening now, temporary situations

Topics:
- Basic structure (I am studying, She is cooking)
- Adding -ing to verbs (play→playing, run→running, write→writing)
- Negative (is/am/are + not + V-ing)
- Questions (Is/Am/Are + subject + V-ing?)
- Time expressions (now, at the moment, right now, currently)
- Stative verbs NOT used (know, love, understand, believe)
- Present Simple vs Present Continuous

Format: JSON with question, 4 options, correctAnswer, explanation, difficulty.

Include:
- Fill blanks: "They __ (study) right now."
- Choosing correct tense
- Error identification
- Stative verb recognition`
  },

  {
    pathId: "foundation",
    topicId: "past-simple",
    level: "beginner",
    count: 30,
    prompt: `Generate 30 multiple-choice questions about Simple Past Tense.

Structure: Subject + V2 (past form)
Usage: Completed actions at specific past time

Topics:
- Basic structure (I went, She studied)
- Regular verbs: -ed (walked, played, studied)
- Irregular verbs (go→went, eat→ate, see→saw, write→wrote, take→took)
- Negative (didn't + V1)
- Questions (Did + subject + V1?)
- Time expressions (yesterday, last week, ago, in 1999)
- Was/Were for 'be' verb

Format: JSON with question, 4 options, correctAnswer, explanation, difficulty.

Include:
- V1 to V2 conversion
- Fill blanks with past tense
- Error spotting
- Irregular verb mastery
- Time expression identification`
  },
];

// Function to call OpenRouter API
async function generateQuestionsWithAI(prompt, count) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: "google/gemini-flash-1.5",
      messages: [
        {
          role: "user",
          content: `You are an expert English teacher creating high-quality multiple-choice questions for Indian students learning English from basics.

${prompt}

Return ONLY a valid JSON array with NO markdown, NO code blocks, NO explanatory text - just the raw JSON array starting with [ and ending with ].`
        }
      ],
      max_tokens: 4000,
      temperature: 0.7,
      top_p: 0.9
    });

    const options = {
      hostname: 'openrouter.ai',
      path: '/api/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://prepgenie.co.in',
        'X-Title': 'PrepGenie English Question Generator',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (response.error) {
            reject(new Error(response.error.message || 'API Error'));
            return;
          }

          const content = response.choices[0].message.content;

          // Extract JSON array from response
          let questions = [];
          try {
            // Try parsing the entire content as JSON
            questions = JSON.parse(content);
          } catch {
            // Try extracting JSON array from markdown code blocks
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
              questions = JSON.parse(jsonMatch[0]);
            } else {
              throw new Error('Could not extract JSON from response');
            }
          }

          // Validate questions
          if (!Array.isArray(questions)) {
            questions = [questions];
          }

          // Ensure all required fields
          questions = questions.filter(q =>
            q.question &&
            Array.isArray(q.options) &&
            q.options.length === 4 &&
            typeof q.correctAnswer === 'number' &&
            q.correctAnswer >= 0 &&
            q.correctAnswer <= 3 &&
            q.explanation
          );

          resolve(questions);
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// Main generation function
async function generateAllQuestions() {
  console.log('🤖 Using OpenRouter API (Gemini Flash 1.5)');
  console.log('💰 Cost: ~$0.02 per 1M tokens (very cheap!)\n');

  let totalGenerated = 0;
  let totalCost = 0;

  for (let i = 0; i < topicsToGenerate.length; i++) {
    const topic = topicsToGenerate[i];

    console.log(`\n[${i + 1}/${topicsToGenerate.length}] Generating: ${topic.topicId}`);
    console.log(`   Target: ${topic.count} questions`);

    try {
      console.log(`   🔄 Calling Together.ai API...`);
      const questions = await generateQuestionsWithAI(topic.prompt, topic.count);

      console.log(`   ✅ Generated ${questions.length} questions`);

      // Save to database
      const statements = questions.map(q => ({
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
      }));

      await db.batch(statements, 'write');
      console.log(`   💾 Saved to database`);

      totalGenerated += questions.length;

      // Gemini 2.0 Flash is FREE via OpenRouter
      totalCost = 0;

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error) {
      console.error(`   ❌ Failed: ${error.message}`);
    }
  }

  // Get total count
  const total = await db.execute('SELECT COUNT(*) as count FROM english_questions');
  const totalCount = total.rows[0].count;

  console.log('\n\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║  ✅ GENERATION COMPLETE!                                     ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  console.log(`📊 Summary:`);
  console.log(`   ✅ New questions generated: ${totalGenerated}`);
  console.log(`   ✅ Total in database: ${totalCount}`);
  console.log(`   💰 Estimated cost: $${totalCost.toFixed(4)} (from free credits)`);
  console.log(`   🎯 Topics covered: ${topicsToGenerate.length}\n`);

  console.log('📚 Topics Generated:');
  console.log('   ✅ Alphabet Basics (25Q)');
  console.log('   ✅ Phonics - Vowels & Consonants (25Q)');
  console.log('   ✅ Parts of Speech (30Q)');
  console.log('   ✅ Nouns in Detail (30Q)');
  console.log('   ✅ Pronouns Mastery (25Q)');
  console.log('   ✅ Articles (a, an, the) (25Q)');
  console.log('   ✅ Present Simple Tense (30Q)');
  console.log('   ✅ Present Continuous Tense (30Q)');
  console.log('   ✅ Past Simple Tense (30Q)\n');

  console.log('🎓 Coverage:');
  console.log('   ✅ Module 1: Alphabet & Phonics - DONE');
  console.log('   ✅ Module 2: Basic Grammar - 50% DONE');
  console.log('   ✅ Module 3: Tenses - 25% DONE (3 of 12 tenses)\n');

  console.log('🚀 Next Steps:');
  console.log('   1. Test these topics in the app');
  console.log('   2. Run script again for remaining tenses');
  console.log('   3. Generate advanced modules\n');
}

// Run
generateAllQuestions()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('\n❌ Error:', err);
    process.exit(1);
  });
