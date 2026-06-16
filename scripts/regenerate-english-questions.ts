/**
 * Regenerate English Grammar Questions
 *
 * Generates questions for all English topics using AI
 * Safe validation before inserting
 */

import { Pool } from 'pg';
import OpenAI from 'openai';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

interface Question {
  topic_id: number;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  passage?: string;
}

// Topics to generate questions for (Parts of Speech)
const TOPICS = [
  { id: 1, name: 'Nouns', count: 50 },
  { id: 2, name: 'Pronouns', count: 50 },
  { id: 3, name: 'Verbs', count: 50 },
  { id: 4, name: 'Adjectives', count: 50 },
  { id: 5, name: 'Adverbs', count: 50 },
  { id: 6, name: 'Prepositions', count: 50 },
  { id: 7, name: 'Conjunctions', count: 50 },
  { id: 8, name: 'Interjections', count: 30 },
];

function validateQuestion(q: any): q is Question {
  if (!q || typeof q !== 'object') return false;

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

  return true;
}

async function generateQuestionsForTopic(topicId: number, topicName: string, count: number): Promise<Question[]> {
  console.log(`\n📝 Generating ${count} questions for ${topicName}...`);

  const prompt = `Generate ${count} multiple-choice English grammar questions about ${topicName}.

REQUIREMENTS:
- Mix of easy (40%), medium (40%), and hard (20%) difficulty
- Question text MUST be at least 20 characters long and make sense standalone
- EXACTLY 4 options per question (A, B, C, D)
- Include detailed explanation (at least 30 characters)
- Questions should test understanding, not just memorization
- Include examples in questions

Return ONLY valid JSON array:
[
  {
    "question": "Which word is a common noun in this sentence: 'The teacher gave Sarah a book'?",
    "options": ["teacher", "Sarah", "gave", "The"],
    "correct_answer": 0,
    "explanation": "A common noun names a general person, place, or thing. 'Teacher' is a common noun because it refers to any teacher in general, not a specific person. 'Sarah' is a proper noun (specific person).",
    "difficulty": "easy"
  }
]`;

  try {
    const response = await openai.chat.completions.create({
      model: 'anthropic/claude-3.5-sonnet',
      messages: [
        {
          role: 'system',
          content: 'You are an expert English grammar teacher creating high-quality IELTS-level questions.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 4000,
    });

    const content = response.choices[0].message.content || '';

    // Extract JSON from markdown code blocks
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
    const validQuestions = questions
      .map(q => ({ ...q, topic_id: topicId }))
      .filter(validateQuestion);

    console.log(`✅ Generated ${validQuestions.length}/${questions.length} valid questions`);

    return validQuestions;
  } catch (error) {
    console.error(`❌ Error generating questions for ${topicName}:`, error);
    return [];
  }
}

async function insertQuestions(questions: Question[]) {
  if (questions.length === 0) return 0;

  console.log(`\n💾 Inserting ${questions.length} questions into database...`);

  let inserted = 0;

  for (const q of questions) {
    try {
      await pool.query(
        `INSERT INTO english_questions (topic_id, question, options, correct_answer, explanation, difficulty, passage)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          q.topic_id,
          q.question,
          JSON.stringify(q.options),
          q.correct_answer,
          q.explanation,
          q.difficulty,
          q.passage || null
        ]
      );
      inserted++;
    } catch (error) {
      console.error(`❌ Failed to insert question: ${q.question.substring(0, 50)}...`, error);
    }
  }

  console.log(`✅ Inserted ${inserted}/${questions.length} questions`);
  return inserted;
}

async function main() {
  console.log('🚀 Starting English question generation...\n');

  let totalGenerated = 0;
  let totalInserted = 0;

  for (const topic of TOPICS) {
    const questions = await generateQuestionsForTopic(topic.id, topic.name, topic.count);
    totalGenerated += questions.length;

    const inserted = await insertQuestions(questions);
    totalInserted += inserted;

    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log(`\n✨ COMPLETE ✨`);
  console.log(`📊 Total generated: ${totalGenerated}`);
  console.log(`💾 Total inserted: ${totalInserted}`);

  // Verify final count
  const result = await pool.query('SELECT COUNT(*) as count FROM english_questions');
  console.log(`📈 Database now has: ${result.rows[0].count} questions`);

  await pool.end();
}

main().catch(console.error);
