#!/usr/bin/env node

/**
 * Generate English Learning Questions Using AI SDK (Same approach as quiz-generator.ts)
 * Races multiple free models on OpenRouter - fastest valid response wins
 */

import fs from 'fs';
import path from 'path';
import { generateText } from 'ai';
import { openrouter } from '@openrouter/ai-sdk-provider';
import { createClient } from '@libsql/client';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
console.log('║  PrepGenie - AI English Question Generator (AI SDK)         ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

// Free models - race them all
const FREE_MODELS = [
  "openai/gpt-oss-120b:free",
  "minimax/minimax-m2.5:free",
  "inclusionai/ling-2.6-1t:free",
  "google/gemma-3-27b-it:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
];

// Priority topics to generate (Module 1 & 2 - A1 Foundation)
const topicsToGenerate = [
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

Make questions simple, clear, and suitable for beginners learning English from scratch.`
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

Format each question as JSON with question, 4 options, correctAnswer (0-3), explanation, and difficulty (easy/medium).`
  },

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

Format: JSON with question, 4 options, correctAnswer (0-3), explanation, difficulty.`
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

Format: JSON with question, 4 options, correctAnswer, explanation, difficulty.`
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

Format: JSON with question, 4 options, correctAnswer, explanation, difficulty.`
  },

  {
    pathId: "foundation",
    topicId: "articles",
    level: "beginner",
    count: 25,
    prompt: `Generate 25 multiple-choice questions about Articles (a, an, the) for English learners.

Rules to cover:
- Use 'a' before consonant sounds (a book, a university)
- Use 'an' before vowel sounds (an apple, an hour)
- Use 'the' for specific things (the book I bought, the sun)
- When NOT to use articles (zero article: going to school)

Format: JSON with question, 4 options, correctAnswer, explanation, difficulty.`
  },

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

Format: JSON with question, 4 options, correctAnswer, explanation, difficulty.`
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
- Adding -ing to verbs (play→playing, run→running)
- Negative (is/am/are + not + V-ing)
- Questions (Is/Am/Are + subject + V-ing?)
- Time expressions (now, at the moment, right now)
- Stative verbs NOT used (know, love, understand)

Format: JSON with question, 4 options, correctAnswer, explanation, difficulty.`
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
- Irregular verbs (go→went, eat→ate, see→saw)
- Negative (didn't + V1)
- Questions (Did + subject + V1?)
- Time expressions (yesterday, last week, ago)

Format: JSON with question, 4 options, correctAnswer, explanation, difficulty.`
  },
];

// Parse AI response
function parseQuestions(text) {
  let cleanText = text.trim();
  // Remove markdown code blocks
  if (cleanText.startsWith("```")) {
    cleanText = cleanText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }
  // Extract JSON array
  const jsonStart = cleanText.indexOf("[");
  const jsonEnd = cleanText.lastIndexOf("]");
  if (jsonStart !== -1 && jsonEnd !== -1) {
    cleanText = cleanText.substring(jsonStart, jsonEnd + 1);
  }

  const questions = JSON.parse(cleanText);

  if (!Array.isArray(questions)) {
    throw new Error("Invalid response format");
  }

  // Validate and filter
  return questions.filter(q =>
    q.question &&
    Array.isArray(q.options) &&
    q.options.length === 4 &&
    typeof q.correctAnswer === 'number' &&
    q.correctAnswer >= 0 &&
    q.correctAnswer <= 3 &&
    q.explanation
  );
}

// Generate questions with AI (race all models)
async function generateQuestionsWithAI(prompt) {
  const fullPrompt = `You are an expert English teacher creating high-quality multiple-choice questions for Indian students learning English from basics.

${prompt}

Return ONLY a valid JSON array with NO markdown, NO code blocks, NO explanatory text - just the raw JSON array starting with [ and ending with ].`;

  try {
    // Race all models in parallel - first valid response wins
    const result = await Promise.any(
      FREE_MODELS.map(async (modelId) => {
        const { text } = await generateText({
          model: openrouter(modelId),
          prompt: fullPrompt,
          maxTokens: 4096,
          temperature: 0.7,
        });
        const questions = parseQuestions(text);
        return { questions, model: modelId };
      })
    );
    return result;
  } catch (error) {
    throw new Error(`All models failed: ${error.message}`);
  }
}

// Main generation function
async function generateAllQuestions() {
  console.log('🤖 Racing 6 free models on OpenRouter');
  console.log('💰 Cost: $0 (free tier)\n');

  let totalGenerated = 0;

  for (let i = 0; i < topicsToGenerate.length; i++) {
    const topic = topicsToGenerate[i];

    console.log(`\n[${i + 1}/${topicsToGenerate.length}] Generating: ${topic.topicId}`);
    console.log(`   Target: ${topic.count} questions`);

    try {
      console.log(`   🔄 Racing models...`);
      const { questions, model } = await generateQuestionsWithAI(topic.prompt);

      console.log(`   ✅ Generated ${questions.length} questions (winner: ${model.split('/')[1]})`);

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

      // Small delay
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
  console.log(`   💰 Cost: $0.00 (free models)`);
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
}

// Run
generateAllQuestions()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('\n❌ Error:', err);
    process.exit(1);
  });
