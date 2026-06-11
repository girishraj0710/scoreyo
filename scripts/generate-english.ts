/**
 * IELTS/TOEFL English Question Generation with Passages
 * Priority: English learning for IELTS and TOEFL
 * Generates complete reading passages with associated questions
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import { generateText } from 'ai';
import { openrouter } from '@openrouter/ai-sdk-provider';

interface ReadingPassage {
  title: string;
  passage: string;
  wordCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    difficulty: string;
    topic: string;
    passage: string; // Include passage with each question
  }>;
}

const IELTS_TOPICS = [
  'Academic Reading - Science and Technology',
  'Academic Reading - History and Culture',
  'Academic Reading - Environment and Nature',
  'Academic Reading - Education and Society',
  'General Training - Work and Employment',
];

const TOEFL_TOPICS = [
  'Natural Sciences',
  'Social Sciences',
  'Arts and Humanities',
  'Technology and Innovation',
];

async function generateIELTSPassage(topic: string, difficulty: string): Promise<ReadingPassage | null> {
  console.log(`  🔄 Generating IELTS passage: ${topic} (${difficulty})`);

  const prompt = `You are an IELTS test creator. Generate a complete IELTS Academic Reading passage with questions.

Topic: ${topic}
Difficulty: ${difficulty}
Target: 600-800 word passage with 10 questions

Return ONLY valid JSON (no markdown, no code blocks):
{
  "title": "Passage title",
  "passage": "Full 600-800 word passage text...",
  "wordCount": 650,
  "difficulty": "${difficulty}",
  "topic": "${topic}",
  "questions": [
    {
      "question": "Question text referring to the passage",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "correctAnswer": 0,
      "explanation": "Why this answer is correct, citing passage evidence",
      "difficulty": "${difficulty}",
      "topic": "${topic}"
    }
  ]
}

REQUIREMENTS:
1. Passage must be 600-800 words (IELTS standard)
2. Academic style with formal vocabulary
3. Include specific facts, dates, names that questions can reference
4. 10 questions covering: main ideas, details, inference, vocabulary
5. Each question must clearly relate to passage content
6. Options should be plausible but only one correct
7. Explanations must cite specific passage evidence
8. Return ONLY the JSON object, no extra text`;

  try {
    const response = await generateText({
      model: openrouter('openai/gpt-4o'),  // Full GPT-4 for exam-quality
      prompt,
      temperature: 0.7,
      maxOutputTokens: 3000,
    });

    // Parse JSON response
    let text = response.text.trim();
    // Remove markdown code blocks if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    // Find JSON object
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    if (jsonStart === -1 || jsonEnd === 0) {
      console.error('  ❌ No JSON found in response');
      return null;
    }
    text = text.substring(jsonStart, jsonEnd);

    const data = JSON.parse(text) as ReadingPassage;

    // Validate
    if (!data.passage || data.passage.length < 500) {
      console.error('  ❌ Passage too short');
      return null;
    }
    if (!data.questions || data.questions.length < 8) {
      console.error('  ❌ Not enough questions');
      return null;
    }

    // Add passage text to each question
    data.questions = data.questions.map(q => ({
      ...q,
      passage: data.passage,
      topic: data.topic,
    }));

    console.log(`  ✅ Generated: "${data.title}" (${data.wordCount} words, ${data.questions.length} questions)`);
    return data;

  } catch (error) {
    console.error('  ❌ Generation failed:', (error as Error).message);
    return null;
  }
}

async function generateTOEFLPassage(topic: string, difficulty: string): Promise<ReadingPassage | null> {
  console.log(`  🔄 Generating TOEFL passage: ${topic} (${difficulty})`);

  const prompt = `You are a TOEFL test creator. Generate a complete TOEFL Reading passage with questions.

Topic: ${topic}
Difficulty: ${difficulty}
Target: 700 word passage with 10 questions

Return ONLY valid JSON (no markdown, no code blocks):
{
  "title": "Passage title",
  "passage": "Full 700 word passage text...",
  "wordCount": 700,
  "difficulty": "${difficulty}",
  "topic": "${topic}",
  "questions": [
    {
      "question": "Question text (TOEFL style: fact, negative fact, inference, vocabulary, rhetorical purpose, sentence insertion)",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "correctAnswer": 0,
      "explanation": "Why correct, with passage reference",
      "difficulty": "${difficulty}",
      "topic": "${topic}"
    }
  ]
}

REQUIREMENTS:
1. Passage must be exactly ~700 words (TOEFL standard)
2. Academic register with complex sentence structures
3. Include technical terms and academic vocabulary
4. 10 questions: factual (4), inference (2), vocabulary (2), rhetorical (2)
5. Each question must test reading comprehension skills
6. Options should all seem plausible
7. Explanations must reference specific passage content
8. Return ONLY the JSON object`;

  try {
    const response = await generateText({
      model: openrouter('openai/gpt-4o'),  // Full GPT-4 for exam-quality
      prompt,
      temperature: 0.7,
      maxOutputTokens: 3000,
    });

    let text = response.text.trim();
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    if (jsonStart === -1 || jsonEnd === 0) {
      console.error('  ❌ No JSON found in response');
      return null;
    }
    text = text.substring(jsonStart, jsonEnd);

    const data = JSON.parse(text) as ReadingPassage;

    if (!data.passage || data.passage.length < 500) {
      console.error('  ❌ Passage too short');
      return null;
    }
    if (!data.questions || data.questions.length < 8) {
      console.error('  ❌ Not enough questions');
      return null;
    }

    data.questions = data.questions.map(q => ({
      ...q,
      passage: data.passage,
      topic: data.topic,
    }));

    console.log(`  ✅ Generated: "${data.title}" (${data.wordCount} words, ${data.questions.length} questions)`);
    return data;

  } catch (error) {
    console.error('  ❌ Generation failed:', (error as Error).message);
    return null;
  }
}

async function generateAll() {
  console.log('🚀 IELTS/TOEFL English Question Generation with Passages\n');
  console.log('Priority: English learning - Reading comprehension\n');

  const allPassages: {
    ielts: ReadingPassage[];
    toefl: ReadingPassage[];
    totalQuestions: number;
    timestamp: string;
  } = {
    ielts: [],
    toefl: [],
    totalQuestions: 0,
    timestamp: new Date().toISOString(),
  };

  // Generate IELTS passages (5 topics × 2 difficulties = 10 passages = ~100 questions)
  console.log('📖 IELTS Academic Reading\n');
  for (const topic of IELTS_TOPICS) {
    for (const difficulty of ['medium', 'hard']) {
      const passage = await generateIELTSPassage(topic, difficulty);
      if (passage) {
        allPassages.ielts.push(passage);
        allPassages.totalQuestions += passage.questions.length;
      }
      await new Promise(resolve => setTimeout(resolve, 3000)); // Rate limit
    }
  }

  console.log(`\n✅ IELTS: ${allPassages.ielts.length} passages, ${allPassages.ielts.reduce((s, p) => s + p.questions.length, 0)} questions\n`);

  // Generate TOEFL passages (4 topics × 2 difficulties = 8 passages = ~80 questions)
  console.log('\n📖 TOEFL Reading\n');
  for (const topic of TOEFL_TOPICS) {
    for (const difficulty of ['medium', 'hard']) {
      const passage = await generateTOEFLPassage(topic, difficulty);
      if (passage) {
        allPassages.toefl.push(passage);
        allPassages.totalQuestions += passage.questions.length;
      }
      await new Promise(resolve => setTimeout(resolve, 3000)); // Rate limit
    }
  }

  console.log(`\n✅ TOEFL: ${allPassages.toefl.length} passages, ${allPassages.toefl.reduce((s, p) => s + p.questions.length, 0)} questions\n`);

  // Save to file
  const outputPath = resolve(process.cwd(), '.agents/artifacts/english-questions.json');
  await import('fs').then(fs => {
    fs.writeFileSync(outputPath, JSON.stringify(allPassages, null, 2));
  });

  console.log(`\n✅ Generation Complete!`);
  console.log(`   IELTS passages: ${allPassages.ielts.length}`);
  console.log(`   TOEFL passages: ${allPassages.toefl.length}`);
  console.log(`   Total questions: ${allPassages.totalQuestions}`);
  console.log(`   Saved to: ${outputPath}`);
  console.log(`\nEach question includes:`);
  console.log(`   - Full passage text`);
  console.log(`   - Question with 4 options`);
  console.log(`   - Correct answer`);
  console.log(`   - Detailed explanation with passage evidence`);
  console.log(`   - Topic and difficulty metadata`);
}

generateAll().catch(console.error);
