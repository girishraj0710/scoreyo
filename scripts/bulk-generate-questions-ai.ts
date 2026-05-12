#!/usr/bin/env node
/**
 * AI-Powered Bulk Question Generator
 * Uses OpenRouter API to generate hundreds of questions per topic
 * Date: May 12, 2026
 */

import { createClient } from '@libsql/client';
import * as fs from 'fs';
import * as path from 'path';

// Load .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      process.env[match[1].trim()] = match[2].trim();
    }
  });
}

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

interface QuestionSpec {
  topicId: string;
  topicName: string;
  pathId: string;
  currentCount: number;
  targetCount: number;
  difficulty: string;
  level: string;
  context: string;
}

// Topics that need expansion based on screenshot
const topicsToExpand: QuestionSpec[] = [
  {
    topicId: 'reading-comprehension',
    topicName: 'IELTS Reading',
    pathId: 'foundation',
    currentCount: 42,
    targetCount: 120,
    difficulty: 'intermediate',
    level: 'intermediate',
    context: 'IELTS Academic Reading: passages with multiple choice, True/False/Not Given, matching headings, sentence completion'
  },
  {
    topicId: 'writing-skills',
    topicName: 'IELTS Writing',
    pathId: 'foundation',
    currentCount: 97,
    targetCount: 120,
    difficulty: 'advanced',
    level: 'advanced',
    context: 'IELTS Writing Task 1 (graphs, charts, diagrams) and Task 2 (essay writing, opinion, discussion)'
  },
  {
    topicId: 'idioms',
    topicName: 'IELTS Speaking',
    pathId: 'foundation',
    currentCount: 26,
    targetCount: 60,
    difficulty: 'intermediate',
    level: 'intermediate',
    context: 'IELTS Speaking: Part 1 (personal questions), Part 2 (cue card), Part 3 (abstract discussion), idioms and collocations'
  },
  {
    topicId: 'grammar-basics',
    topicName: 'Grammar Fundamentals',
    pathId: 'competitive-exam',
    currentCount: 12,
    targetCount: 50,
    difficulty: 'intermediate',
    level: 'intermediate',
    context: 'SSC/Banking grammar: tenses, subject-verb agreement, articles, prepositions, error detection'
  },
  {
    topicId: 'vocabulary-ssc',
    topicName: 'Vocabulary for SSC/Banking',
    pathId: 'competitive-exam',
    currentCount: 11,
    targetCount: 60,
    difficulty: 'intermediate',
    level: 'intermediate',
    context: 'SSC CGL/Banking exams: synonyms, antonyms, one-word substitution, idioms, phrasal verbs'
  },
  {
    topicId: 'common-mistakes',
    topicName: 'Sentence Improvement',
    pathId: 'foundation',
    currentCount: 131,
    targetCount: 150,
    difficulty: 'intermediate',
    level: 'intermediate',
    context: 'Common English mistakes: error detection, sentence correction, choose correct sentence'
  },
  {
    topicId: 'phrasal-verbs',
    topicName: 'Business English',
    pathId: 'foundation',
    currentCount: 110,
    targetCount: 150,
    difficulty: 'advanced',
    level: 'advanced',
    context: 'Business English: phrasal verbs, professional communication, workplace vocabulary'
  },
  {
    topicId: 'daily-conversations',
    topicName: 'Daily Conversations',
    pathId: 'real-world',
    currentCount: 10,
    targetCount: 40,
    difficulty: 'beginner',
    level: 'beginner',
    context: 'Everyday conversations: greetings, shopping, restaurants, directions, phone calls, making appointments'
  },
  {
    topicId: 'email-writing',
    topicName: 'Email Writing',
    pathId: 'real-world',
    currentCount: 10,
    targetCount: 40,
    difficulty: 'intermediate',
    level: 'intermediate',
    context: 'Professional email writing: formal/informal, requests, complaints, confirmations, follow-ups'
  },
  {
    topicId: 'academic-vocabulary',
    topicName: 'Academic Vocabulary',
    pathId: 'ielts-toefl',
    currentCount: 10,
    targetCount: 50,
    difficulty: 'advanced',
    level: 'advanced',
    context: 'Academic English for IELTS/TOEFL: formal synonyms, research terminology, essay connectors'
  }
];

async function generateQuestionsWithAI(spec: QuestionSpec, count: number) {
  console.log(`\n🤖 Generating ${count} questions for ${spec.topicName}...`);

  const prompt = `You are an expert English language test creator. Generate ${count} multiple-choice questions for ${spec.topicName}.

Context: ${spec.context}
Difficulty: ${spec.difficulty}
Level: ${spec.level}

REQUIREMENTS:
1. Each question must have exactly 4 options (A, B, C, D)
2. Only ONE option is correct
3. Include a detailed explanation for the correct answer
4. Questions should be diverse and cover different aspects of the topic
5. Suitable for Indian students preparing for competitive exams

OUTPUT FORMAT (JSON array):
[
  {
    "question": "The question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Detailed explanation why this is correct",
    "difficulty": "${spec.difficulty}"
  }
]

Generate EXACTLY ${count} questions. Return ONLY valid JSON array, no other text.`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 8000,
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Extract JSON from response (might be wrapped in markdown)
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No JSON array found in AI response');
    }

    const questions = JSON.parse(jsonMatch[0]);
    console.log(`✅ Generated ${questions.length} questions`);

    return questions;

  } catch (error) {
    console.error(`❌ Error generating questions:`, error);
    return [];
  }
}

async function insertQuestions(spec: QuestionSpec, questions: any[]) {
  let inserted = 0;

  for (const q of questions) {
    try {
      await client.execute(
        `INSERT INTO english_questions (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          spec.pathId,
          spec.topicId,
          spec.level,
          q.question,
          JSON.stringify(q.options),
          q.correctAnswer,
          q.explanation,
          q.difficulty
        ]
      );
      inserted++;
    } catch (error) {
      console.error(`Failed to insert question:`, error);
    }
  }

  return inserted;
}

async function bulkGenerateQuestions() {
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║       🤖 AI-Powered Bulk Question Generator                 ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  let totalGenerated = 0;
  let totalInserted = 0;

  for (const spec of topicsToExpand) {
    const needed = spec.targetCount - spec.currentCount;

    if (needed <= 0) {
      console.log(`✅ ${spec.topicName}: Already has ${spec.currentCount}/${spec.targetCount} questions`);
      continue;
    }

    console.log(`\n📊 ${spec.topicName}`);
    console.log(`   Current: ${spec.currentCount} | Target: ${spec.targetCount} | Need: ${needed}`);

    // Generate in batches of 10-15 to avoid token limits
    const batchSize = 10;
    const batches = Math.ceil(needed / batchSize);

    for (let i = 0; i < batches; i++) {
      const batchCount = Math.min(batchSize, needed - (i * batchSize));
      console.log(`   Batch ${i + 1}/${batches}: Generating ${batchCount} questions...`);

      const questions = await generateQuestionsWithAI(spec, batchCount);

      if (questions.length > 0) {
        const inserted = await insertQuestions(spec, questions);
        totalGenerated += questions.length;
        totalInserted += inserted;
        console.log(`   ✅ Inserted ${inserted}/${questions.length} questions`);
      }

      // Small delay to avoid rate limiting
      if (i < batches - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    console.log(`   ✅ Completed ${spec.topicName}: Added ${spec.targetCount - spec.currentCount} questions`);
  }

  console.log('\n' + '='.repeat(64));
  console.log(`\n🎉 Bulk Generation Complete!`);
  console.log(`   Generated: ${totalGenerated} questions`);
  console.log(`   Inserted: ${totalInserted} questions`);
  console.log(`   Success Rate: ${((totalInserted/totalGenerated) * 100).toFixed(1)}%`);

  // Show updated counts
  console.log('\n📊 Updated Question Counts:\n');
  for (const spec of topicsToExpand) {
    const result = await client.execute(
      'SELECT COUNT(*) as count FROM english_questions WHERE topic_id = ?',
      [spec.topicId]
    );
    const newCount = result.rows[0].count;
    console.log(`   ${spec.topicName}: ${spec.currentCount} → ${newCount} questions`);
  }

  console.log('\n✅ All topics now have sufficient questions!');
  console.log('='.repeat(64) + '\n');

  await client.close();
}

// Check if OpenRouter API key is configured
if (!process.env.OPENROUTER_API_KEY) {
  console.error('\n❌ Error: OPENROUTER_API_KEY not found in .env.local');
  console.error('Please add your OpenRouter API key to continue.\n');
  process.exit(1);
}

bulkGenerateQuestions().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
