import { Pool } from 'pg';
import { config } from 'dotenv';
import { generateText } from 'ai';
import { openrouter } from '@openrouter/ai-sdk-provider';

config({ path: '.env.local' });

/**
 * Cambridge-Level Question Generator
 *
 * Generates high-quality English questions following strict Cambridge standards:
 * - NO AI clichés
 * - Rich explanations with trapAlerts and commonMistakes
 * - Indian context where appropriate
 * - CEFR-aligned difficulty
 */

interface QuestionSpec {
  topicId: string;
  topicName: string;
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2';
  pathId: string;
  count: number;
  subtopics: string[];
  learningObjectives: string[];
}

interface GeneratedQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: {
    logic: string;
    formula?: string;
    trapAlerts: string[];
    commonMistakes: string[];
  };
  difficulty: 'easy' | 'medium' | 'hard';
  level: 'A1' | 'A2' | 'B1' | 'B2';
}

// Topics to generate (empty or low-count Foundation topics)
const TOPICS_TO_GENERATE: QuestionSpec[] = [
  {
    topicId: 'nouns-detailed',
    topicName: 'Nouns Mastery',
    cefrLevel: 'A1',
    pathId: 'foundation',
    count: 60,
    subtopics: ['Common vs proper', 'Singular vs plural', 'Countable vs uncountable', 'Gender'],
    learningObjectives: [
      'Identify proper nouns vs common nouns',
      'Form regular and irregular plurals correctly',
      'Use countable and uncountable nouns with correct quantifiers',
      'Understand gender in English nouns'
    ]
  },
  {
    topicId: 'pronunciation-basics',
    topicName: 'Pronunciation Fundamentals',
    cefrLevel: 'A1',
    pathId: 'foundation',
    count: 40,
    subtopics: ['Word stress', 'Syllables', 'Common pronunciation mistakes'],
    learningObjectives: [
      'Identify syllables in words',
      'Mark correct word stress patterns',
      'Recognize common pronunciation errors',
      'Distinguish between similar-sounding words'
    ]
  },
  {
    topicId: 'pronouns-detailed',
    topicName: 'Pronouns Complete',
    cefrLevel: 'A1',
    pathId: 'foundation',
    count: 60,
    subtopics: ['Personal pronouns', 'Possessive pronouns', 'Reflexive pronouns', 'Demonstrative pronouns'],
    learningObjectives: [
      'Use subject and object pronouns correctly',
      'Distinguish between possessive adjectives (my) and pronouns (mine)',
      'Use reflexive pronouns (myself, yourself) appropriately',
      'Choose correct demonstrative pronouns (this/that/these/those)'
    ]
  },
  {
    topicId: 'adjectives',
    topicName: 'Adjectives & Comparisons',
    cefrLevel: 'A1',
    pathId: 'foundation',
    count: 60,
    subtopics: ['Descriptive adjectives', 'Comparative', 'Superlative', 'Order of adjectives'],
    learningObjectives: [
      'Use adjectives to describe nouns',
      'Form comparative adjectives correctly (bigger, more beautiful)',
      'Form superlative adjectives (biggest, most beautiful)',
      'Follow correct order of adjectives (opinion-size-age-color-origin-material)'
    ]
  },
];

const ANTI_CLICHE_INSTRUCTIONS = `
CRITICAL INSTRUCTIONS - NO AI CLICHÉS:

❌ FORBIDDEN PHRASES (Do NOT use these):
- "embark on a journey"
- "delve into"
- "unlock the secrets"
- "in the realm of"
- "it's important to note that"
- "in today's fast-paced world"
- "at the end of the day"
- "let's explore"
- "navigate the complexities"
- "dive deep into"

✅ USE INSTEAD:
- Direct, clear language
- Cambridge exam style
- Natural English
- Simple, precise wording

QUALITY STANDARDS:
1. Questions must be clear and unambiguous
2. Use Indian context (names: Raj, Priya, Arjun; places: Mumbai, Delhi; situations: Indian daily life)
3. Distractors must be plausible (based on actual student errors)
4. Rich explanations with:
   - logic: 2-3 sentences explaining the concept
   - formula: grammar rule in formula format (if applicable)
   - trapAlerts: EXACTLY 3 items, one for each wrong option explaining why it's tempting
   - commonMistakes: 2-3 common errors students make with this concept

5. Difficulty alignment:
   - easy (A1): Simple grammar, obvious wrong answers
   - medium (A2-B1): Requires understanding, plausible distractors
   - hard (B1-B2): Subtle distinctions, all options seemingly valid

EXAMPLE OF PERFECT QUESTION:
{
  "question": "Which word is a proper noun?\\n\\nProper nouns are names of specific people, places, or things.",
  "options": ["Mumbai", "city", "beautiful", "many"],
  "correctAnswer": 0,
  "explanation": {
    "logic": "Proper nouns are names of specific people, places, organizations, or brands. They always start with a capital letter. 'Mumbai' is the name of a specific city in India, so it's a proper noun. Common nouns (city, car, teacher) don't name specific things.",
    "trapAlerts": [
      "'city' is a common noun - it refers to any city, not a specific one like Mumbai or Delhi",
      "'beautiful' is an adjective (describing word), not a noun at all",
      "'many' is a quantifier (tells us 'how much'), not a noun"
    ],
    "commonMistakes": [
      "Confusing proper nouns with any noun that's important",
      "Forgetting to capitalize proper nouns in writing"
    ]
  },
  "difficulty": "easy",
  "level": "A1"
}
`;

async function generateQuestionsForTopic(spec: QuestionSpec): Promise<GeneratedQuestion[]> {
  console.log(`\n🎯 Generating ${spec.count} questions for: ${spec.topicName} (${spec.cefrLevel})`);
  console.log(`   Subtopics: ${spec.subtopics.join(', ')}`);

  const batchSize = 10; // Generate 10 questions at a time
  const batches = Math.ceil(spec.count / batchSize);
  const allQuestions: GeneratedQuestion[] = [];

  for (let i = 0; i < batches; i++) {
    const batchNumber = i + 1;
    const questionsInBatch = Math.min(batchSize, spec.count - allQuestions.length);

    console.log(`\n   📦 Batch ${batchNumber}/${batches} (${questionsInBatch} questions)...`);

    // Distribute difficulty across batches
    let difficultyDistribution: string;
    if (spec.cefrLevel === 'A1') {
      difficultyDistribution = '7 easy, 3 medium';
    } else if (spec.cefrLevel === 'A2') {
      difficultyDistribution = '4 easy, 4 medium, 2 hard';
    } else { // B1, B2
      difficultyDistribution = '3 easy, 4 medium, 3 hard';
    }

    const prompt = `Generate ${questionsInBatch} high-quality multiple-choice questions for Cambridge English learners.

TOPIC: ${spec.topicName}
CEFR LEVEL: ${spec.cefrLevel}
SUBTOPICS: ${spec.subtopics.join(', ')}
DIFFICULTY MIX: ${difficultyDistribution}

${ANTI_CLICHE_INSTRUCTIONS}

LEARNING OBJECTIVES:
${spec.learningObjectives.map((obj, idx) => `${idx + 1}. ${obj}`).join('\n')}

RETURN FORMAT:
Return ONLY a valid JSON array. Each question must have this EXACT structure:
[
  {
    "question": "Clear question text (use \\n for line breaks if needed)",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": {
      "logic": "2-3 sentences explaining the core concept and why the answer is correct",
      "formula": "Grammar rule in formula format (optional, only if applicable)",
      "trapAlerts": [
        "Why option B is wrong and why it's tempting",
        "Why option C is wrong and why it's tempting",
        "Why option D is wrong and why it's tempting"
      ],
      "commonMistakes": [
        "Common mistake 1 students make with this concept",
        "Common mistake 2 students make with this concept"
      ]
    },
    "difficulty": "easy",
    "level": "${spec.cefrLevel}"
  }
]

Rules:
- EXACTLY 4 options per question
- correctAnswer is 0-3 (array index)
- trapAlerts must have EXACTLY 3 items (one per wrong option)
- commonMistakes must have at least 2 items
- Use Indian names (Raj, Priya, Arjun, Neha, Amit, Sanya)
- Use Indian places (Mumbai, Delhi, Bengaluru, Chennai, Kolkata)
- Use Indian context (school, office, metro, festivals, family)
- NO AI CLICHÉS in questions or explanations
- Valid JSON starting with [ and ending with ]`;

    try {
      const { text } = await generateText({
        model: openrouter('openai/gpt-4o-mini'),
        prompt,
        maxOutputTokens: questionsInBatch * 350 + 200, // ~350 tokens per question
        temperature: 0.8, // Higher creativity while maintaining quality
      });

      // Parse response
      let cleanText = text.trim();
      if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
      }
      const jsonStart = cleanText.indexOf('[');
      const jsonEnd = cleanText.lastIndexOf(']');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleanText = cleanText.substring(jsonStart, jsonEnd + 1);
      }

      const questions: GeneratedQuestion[] = JSON.parse(cleanText);

      // Validate each question
      let validCount = 0;
      for (const q of questions) {
        if (validateQuestion(q, spec)) {
          allQuestions.push(q);
          validCount++;
        }
      }

      console.log(`   ✅ Generated ${validCount} valid questions (total: ${allQuestions.length}/${spec.count})`);

      // Small delay between batches to avoid rate limits
      if (i < batches - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

    } catch (error: any) {
      console.error(`   ❌ Batch ${batchNumber} failed:`, error.message);
      // Continue with next batch instead of failing completely
    }
  }

  return allQuestions;
}

function validateQuestion(q: any, spec: QuestionSpec): boolean {
  // Check required fields
  if (!q.question || typeof q.question !== 'string') {
    console.warn('   ⚠️  Invalid: Missing question text');
    return false;
  }

  if (!Array.isArray(q.options) || q.options.length !== 4) {
    console.warn('   ⚠️  Invalid: Must have exactly 4 options');
    return false;
  }

  if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
    console.warn('   ⚠️  Invalid: correctAnswer must be 0-3');
    return false;
  }

  if (!q.explanation || typeof q.explanation !== 'object') {
    console.warn('   ⚠️  Invalid: Missing explanation object');
    return false;
  }

  if (!q.explanation.logic || typeof q.explanation.logic !== 'string') {
    console.warn('   ⚠️  Invalid: Missing explanation.logic');
    return false;
  }

  if (!Array.isArray(q.explanation.trapAlerts) || q.explanation.trapAlerts.length !== 3) {
    console.warn('   ⚠️  Invalid: trapAlerts must have exactly 3 items');
    return false;
  }

  if (!Array.isArray(q.explanation.commonMistakes) || q.explanation.commonMistakes.length < 2) {
    console.warn('   ⚠️  Invalid: commonMistakes must have at least 2 items');
    return false;
  }

  // Check for AI clichés
  const fullText = (q.question + q.options.join(' ') + q.explanation.logic).toLowerCase();
  const cliches = [
    'embark on a journey',
    'delve into',
    'unlock the secrets',
    'in the realm of',
    'navigate the complexities',
    'dive deep into',
  ];

  for (const cliche of cliches) {
    if (fullText.includes(cliche)) {
      console.warn(`   ⚠️  Invalid: Contains AI cliché "${cliche}"`);
      return false;
    }
  }

  return true;
}

async function insertQuestionsToDatabase(questions: GeneratedQuestion[], spec: QuestionSpec) {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log(`\n💾 Inserting ${questions.length} questions into database...`);

    let inserted = 0;
    for (const q of questions) {
      await pool.query(
        `INSERT INTO english_questions
         (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
        [
          spec.pathId,
          spec.topicId,
          q.level,
          q.question,
          JSON.stringify(q.options),
          q.correctAnswer,
          JSON.stringify(q.explanation),
          q.difficulty,
        ]
      );
      inserted++;

      if (inserted % 10 === 0) {
        console.log(`   ✓ Inserted ${inserted}/${questions.length}...`);
      }
    }

    console.log(`   ✅ Successfully inserted all ${inserted} questions!`);

  } catch (error: any) {
    console.error('   ❌ Database error:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

async function main() {
  console.log('🎓 CAMBRIDGE-LEVEL QUESTION GENERATOR');
  console.log('=' .repeat(80));

  // Generate for first topic only (for testing)
  const topicToGenerate = TOPICS_TO_GENERATE[0];

  console.log(`\n📋 Topic: ${topicToGenerate.topicName}`);
  console.log(`   Level: ${topicToGenerate.cefrLevel}`);
  console.log(`   Target: ${topicToGenerate.count} questions`);

  const questions = await generateQuestionsForTopic(topicToGenerate);

  console.log(`\n📊 Generation Summary:`);
  console.log(`   ✅ Generated: ${questions.length}/${topicToGenerate.count} questions`);
  console.log(`   📈 Success rate: ${((questions.length / topicToGenerate.count) * 100).toFixed(1)}%`);

  if (questions.length > 0) {
    // Show sample question
    console.log(`\n📖 Sample Question:\n`);
    console.log(JSON.stringify(questions[0], null, 2));

    // Ask for confirmation before inserting
    console.log(`\n⚠️  Ready to insert ${questions.length} questions into database.`);
    console.log(`   Topic: ${topicToGenerate.topicId}`);
    console.log(`   Path: ${topicToGenerate.pathId}`);

    // Insert to database
    await insertQuestionsToDatabase(questions, topicToGenerate);

    console.log(`\n✅ COMPLETE! ${questions.length} Cambridge-level questions added to ${topicToGenerate.topicId}`);
  } else {
    console.log(`\n❌ No valid questions generated. Please check the generation logs above.`);
  }
}

main().catch(console.error);
