/**
 * Generate English Questions using Claude 3.5 Sonnet
 *
 * Usage: npx tsx scripts/generate-english-questions-claude.ts
 *
 * This script generates high-quality MCQ questions for English topics
 * using Claude 3.5 Sonnet via OpenRouter API
 */

import { Pool } from 'pg';
import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

interface Question {
  path_id: string;
  topic_id: string;
  level: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  passage?: string;
}

// Topics to generate questions for
const TOPICS = [
  {
    path_id: 'foundation',
    topic_id: 'parts-of-speech',
    name: '8 Parts of Speech',
    level: 'beginner',
    count: 360,  // To reach 400 total (40 already exist)
    context: 'Focus on nouns, pronouns, verbs, adjectives, adverbs, prepositions, conjunctions, and interjections. Include examples from Indian context where relevant.'
  },
  {
    path_id: 'foundation',
    topic_id: 'articles',
    name: 'Articles (A, An, The)',
    level: 'beginner',
    count: 80,
    context: 'Cover definite (the) and indefinite (a, an) articles. Common mistakes by Indian learners. Usage rules and exceptions.'
  },
  {
    path_id: 'foundation',
    topic_id: 'present-simple',
    name: 'Present Simple Tense',
    level: 'beginner',
    count: 100,
    context: 'Usage, formation, time expressions, difference from present continuous. Common errors.'
  },
  {
    path_id: 'foundation',
    topic_id: 'present-continuous',
    name: 'Present Continuous Tense',
    level: 'beginner',
    count: 100,
    context: 'When to use, formation with be + -ing, stative verbs that don\'t use continuous, time expressions.'
  },
  {
    path_id: 'foundation',
    topic_id: 'past-simple',
    name: 'Past Simple Tense',
    level: 'beginner',
    count: 100,
    context: 'Regular and irregular verbs, usage, time expressions, difference from present perfect.'
  },
];

function validateQuestion(q: any, pathId: string, topicId: string, level: string): q is Question {
  if (!q || typeof q !== 'object') {
    console.log(`❌ Invalid: not an object`);
    return false;
  }

  // Question text must be at least 20 characters
  if (!q.question || typeof q.question !== 'string' || q.question.length < 20) {
    console.log(`❌ Invalid: question too short (${q.question?.length || 0} chars)`);
    return false;
  }

  // Must have exactly 4 options
  if (!Array.isArray(q.options) || q.options.length !== 4) {
    console.log(`❌ Invalid: must have 4 options (has ${q.options?.length || 0})`);
    return false;
  }

  // All options must be non-empty strings
  if (!q.options.every((opt: any) => opt && typeof opt === 'string' && opt.trim().length > 0)) {
    console.log(`❌ Invalid: empty option found`);
    return false;
  }

  // Correct answer must be 0-3
  if (typeof q.correct_answer !== 'number' || q.correct_answer < 0 || q.correct_answer > 3) {
    console.log(`❌ Invalid: correct_answer must be 0-3 (got ${q.correct_answer})`);
    return false;
  }

  // Explanation must be at least 30 characters
  if (!q.explanation || typeof q.explanation !== 'string' || q.explanation.length < 30) {
    console.log(`❌ Invalid: explanation too short (${q.explanation?.length || 0} chars)`);
    return false;
  }

  // Difficulty must be valid
  if (!['easy', 'medium', 'hard'].includes(q.difficulty)) {
    console.log(`❌ Invalid: difficulty must be easy/medium/hard (got ${q.difficulty})`);
    return false;
  }

  // No placeholders
  if (q.question.includes('[') || q.question.includes('____') || q.question.includes('...')) {
    console.log(`❌ Invalid: contains placeholders`);
    return false;
  }

  // Add required fields
  q.path_id = pathId;
  q.topic_id = topicId;
  q.level = level;

  return true;
}

async function generateQuestionsForTopic(
  pathId: string,
  topicId: string,
  topicName: string,
  level: string,
  count: number,
  context: string
): Promise<Question[]> {
  console.log(`\n📝 Generating ${count} questions for ${topicName} using Claude 3.5 Sonnet...`);

  const easyCount = Math.floor(count * 0.4);
  const mediumCount = Math.floor(count * 0.4);
  const hardCount = count - easyCount - mediumCount;

  const prompt = `Generate ${count} multiple-choice English grammar questions about ${topicName}.

CONTEXT: ${context}

REQUIREMENTS:
- Question text MUST be at least 20 characters long and grammatically complete
- EXACTLY 4 options per question (labeled A, B, C, D)
- Explanation MUST be at least 30 characters and explain WHY the answer is correct
- Difficulty distribution: ${easyCount} easy, ${mediumCount} medium, ${hardCount} hard
- No placeholders like [sentence], ____, or ...
- Test understanding and application, not just memorization
- Include real-world examples and sentences
- For Indian learners: address common mistakes made by Hindi/Tamil/Bengali speakers

DIFFICULTY GUIDELINES:
- Easy: Direct identification, basic rules (e.g., "Which word is a noun?")
- Medium: Application of rules, choosing correct forms (e.g., "Fill in the blank with correct tense")
- Hard: Analysis, error correction, complex sentences (e.g., "Identify the error in this sentence")

EXAMPLE OUTPUT FORMAT:
[
  {
    "question": "Which word is a common noun in this sentence: 'The teacher gave Sarah a book'?",
    "options": ["teacher", "Sarah", "gave", "The"],
    "correct_answer": 0,
    "explanation": "A common noun names a general person, place, or thing. 'Teacher' is a common noun because it refers to any teacher in general, not a specific person. 'Sarah' is a proper noun (specific person), 'gave' is a verb, and 'The' is an article.",
    "difficulty": "easy"
  },
  {
    "question": "Choose the sentence with correct article usage:",
    "options": [
      "I saw a elephant at the zoo.",
      "I saw an elephant at the zoo.",
      "I saw the elephant at zoo.",
      "I saw elephant at the zoo."
    ],
    "correct_answer": 1,
    "explanation": "Use 'an' before words starting with vowel sounds. 'Elephant' starts with 'e' (vowel), so we use 'an'. We also need 'the' before 'zoo' because we're referring to a specific zoo. Option 1 is wrong because 'a' is used before consonants. Options 3 and 4 are missing required articles.",
    "difficulty": "medium"
  }
]

Return ONLY a valid JSON array of ${count} questions. No markdown formatting, no explanations outside the JSON.`;

  try {
    console.log(`⏳ Calling Claude API...`);
    const response = await openai.chat.completions.create({
      model: 'anthropic/claude-3.5-sonnet',
      messages: [
        {
          role: 'system',
          content: 'You are an expert English grammar teacher with 15+ years of experience teaching IELTS and competitive exams. You create clear, accurate, and pedagogically sound questions that help students learn. You are particularly skilled at addressing common mistakes made by Indian learners.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 8000,
    });

    const content = response.choices[0].message.content || '';
    console.log(`✅ Received response (${content.length} chars)`);

    // Extract JSON from markdown code blocks if present
    let jsonStr = content.trim();
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    }

    // Find JSON array
    const start = jsonStr.indexOf('[');
    const end = jsonStr.lastIndexOf(']');
    if (start === -1 || end === -1) {
      throw new Error('No JSON array found in response');
    }
    jsonStr = jsonStr.substring(start, end + 1);

    const questions = JSON.parse(jsonStr);

    if (!Array.isArray(questions)) {
      throw new Error('Response is not an array');
    }

    // Validate and filter
    const validQuestions = questions.filter(q => validateQuestion(q, pathId, topicId, level));

    console.log(`✅ Generated ${validQuestions.length}/${questions.length} valid questions`);

    // Show difficulty distribution
    const easy = validQuestions.filter(q => q.difficulty === 'easy').length;
    const medium = validQuestions.filter(q => q.difficulty === 'medium').length;
    const hard = validQuestions.filter(q => q.difficulty === 'hard').length;
    console.log(`   Distribution: ${easy} easy, ${medium} medium, ${hard} hard`);

    return validQuestions;
  } catch (error: any) {
    console.error(`❌ Error generating questions for ${topicName}:`, error.message);
    return [];
  }
}

function generateInsertSQL(questions: Question[]): string {
  if (questions.length === 0) return '';

  const values = questions.map(q => {
    const optionsJson = JSON.stringify(q.options).replace(/'/g, "''");
    const questionText = q.question.replace(/'/g, "''");
    const explanationText = q.explanation.replace(/'/g, "''");
    const passage = q.passage ? `'${q.passage.replace(/'/g, "''")}'` : 'NULL';

    return `('${q.path_id}', '${q.topic_id}', '${q.level}', '${questionText}', '${optionsJson}', ${q.correct_answer}, '${explanationText}', '${q.difficulty}', ${passage})`;
  }).join(',\n  ');

  return `-- Generated ${questions.length} questions
-- Run this in Supabase SQL Editor

INSERT INTO english_questions (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty, passage)
VALUES
  ${values};

-- Verify insertion
SELECT COUNT(*) as inserted_count FROM english_questions WHERE topic_id = '${questions[0].topic_id}';
`;
}

async function main() {
  console.log('🚀 Starting English Question Generation with Claude 3.5 Sonnet\n');
  console.log('📊 Cost estimate: ~$0.05-0.10 per 100 questions\n');

  const timestamp = new Date().toISOString().split('T')[0];
  const outputDir = path.join(process.cwd(), 'scripts', 'output');

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let totalGenerated = 0;
  let totalCost = 0;

  for (const topic of TOPICS) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`📚 Topic: ${topic.name}`);
    console.log(`   Path: ${topic.path_id}, ID: ${topic.topic_id}, Level: ${topic.level}`);
    console.log(`   Target: ${topic.count} questions`);
    console.log(`${'='.repeat(80)}`);

    const questions = await generateQuestionsForTopic(
      topic.path_id,
      topic.topic_id,
      topic.name,
      topic.level,
      topic.count,
      topic.context
    );

    totalGenerated += questions.length;

    // Estimate cost (rough: $3 per 1M input tokens, $15 per 1M output tokens)
    // Approx 2K input tokens + 10K output tokens per 100 questions
    const costEstimate = ((2000 / 1000000 * 3) + (10000 / 1000000 * 15)) * (questions.length / 100);
    totalCost += costEstimate;

    if (questions.length > 0) {
      // Save JSON
      const jsonFilename = `${topic.topic_id}-questions-${timestamp}.json`;
      const jsonPath = path.join(outputDir, jsonFilename);
      fs.writeFileSync(jsonPath, JSON.stringify(questions, null, 2));
      console.log(`\n💾 Saved JSON: ${jsonFilename}`);

      // Save SQL
      const sqlFilename = `${topic.topic_id}-questions-${timestamp}.sql`;
      const sqlPath = path.join(outputDir, sqlFilename);
      const sql = generateInsertSQL(questions);
      fs.writeFileSync(sqlPath, sql);
      console.log(`💾 Saved SQL: ${sqlFilename}`);
      console.log(`💰 Estimated cost for this topic: $${costEstimate.toFixed(4)}`);
    }

    // Delay to respect rate limits (avoid hitting Claude API too fast)
    if (TOPICS.indexOf(topic) < TOPICS.length - 1) {
      console.log('\n⏳ Waiting 3 seconds before next topic...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  console.log(`\n${'='.repeat(80)}`);
  console.log(`✨ GENERATION COMPLETE ✨`);
  console.log(`${'='.repeat(80)}`);
  console.log(`📊 Total questions generated: ${totalGenerated}`);
  console.log(`💰 Total estimated cost: $${totalCost.toFixed(2)}`);
  console.log(`📁 Output directory: ${outputDir}`);
  console.log(`\n📝 Next steps:`);
  console.log(`   1. Review generated JSON/SQL files in ${outputDir}`);
  console.log(`   2. Test a sample (10%) manually for quality`);
  console.log(`   3. Run SQL files in Supabase SQL Editor to insert questions`);
  console.log(`   4. Verify on frontend: https://scoreyo.in/english/foundation/[topic]/practice`);

  await pool.end();
}

main().catch(console.error);
