#!/usr/bin/env tsx
/**
 * Targeted Topic Scraper
 * Scrapes content for specific topics that need questions
 *
 * Usage:
 *   npm run scrape-topics -- --limit 10
 *   npm run scrape-topics -- --topic "Linear Algebra"
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { saveVerifiedQuestions } from '../src/lib/db';

// Load environment variables
try {
  const envPath = resolve(process.cwd(), '.env.local');
  const envContent = readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
} catch (error) {
  console.error('⚠️  Could not load .env.local file');
}

interface TargetTopic {
  name: string;
  category: string;
  currentCount: number;
}

async function generateQuestionsForTopic(
  topicName: string,
  examId: string,
  subjectId: string,
  count: number = 10
): Promise<any[]> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY not configured');

  console.log(`   🤖 Generating ${count} questions for: ${topicName}`);

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://prepgenie.co.in',
        'X-Title': 'PrepGenie Topic Scraper',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert question generator for Indian competitive exams.
Generate high-quality Multiple Choice Questions (MCQs) based on official syllabi and textbooks.

Requirements:
1. Each question must have exactly 4 options (A, B, C, D)
2. Include detailed explanation with logic, formulas, and common mistakes
3. Mark difficulty as easy, medium, or hard
4. Base questions on NCERT textbooks, official exam syllabi, and standard reference books
5. Include variety: conceptual, numerical, application-based

Return ONLY valid JSON array:
[
  {
    "question": "Full question text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0-3,
    "explanation": "Detailed step-by-step explanation with logic, formulas, and common mistakes",
    "difficulty": "easy|medium|hard"
  }
]`
          },
          {
            role: 'user',
            content: `Generate ${count} high-quality MCQ questions on the topic: "${topicName}"

Context:
- Exam: ${examId.toUpperCase()}
- Subject: ${subjectId}
- Based on: NCERT textbooks, official syllabus, standard reference books
- Level: ${examId.includes('jee') ? 'JEE Main/Advanced level' : examId.includes('neet') ? 'NEET level' : 'Competitive exam level'}

Include:
- Mix of conceptual, numerical, and application questions
- Common exam patterns and question types
- Real-world applications where relevant
- Difficulty progression (some easy, mostly medium, some hard)

Return ONLY the JSON array, no markdown formatting.`
          }
        ],
        temperature: 0.7,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '[]';

    // Parse JSON response
    let parsed: any[];
    try {
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.error('   ⚠️  Failed to parse AI response');
      return [];
    }

    // Validate and format questions
    const questions = parsed
      .filter(q => q.question && q.options?.length === 4 && q.correctAnswer !== undefined)
      .map(q => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || 'No explanation provided',
        difficulty: q.difficulty || 'medium',
        source: `AI-Generated from official syllabus - ${topicName}`,
      }));

    return questions;
  } catch (error: any) {
    console.error(`   ❌ Error generating questions: ${error.message}`);
    return [];
  }
}

async function scrapeTopics() {
  console.log('🎯 Targeted Topic Scraper\n');

  const args = process.argv.slice(2);
  const getArg = (flag: string) => {
    const index = args.indexOf(flag);
    return index !== -1 ? args[index + 1] : null;
  };

  // Load target topics
  const targetFile = resolve(process.cwd(), 'target-topics.json');
  if (!existsSync(targetFile)) {
    console.error('❌ target-topics.json not found!');
    console.log('   Run: npm run analyze-topics first\n');
    process.exit(1);
  }

  const targetTopics: TargetTopic[] = JSON.parse(readFileSync(targetFile, 'utf-8'));

  const limit = parseInt(getArg('--limit') || '20');
  const specificTopic = getArg('--topic');

  let topicsToScrape = specificTopic
    ? targetTopics.filter(t => t.name.toLowerCase().includes(specificTopic.toLowerCase()))
    : targetTopics.slice(0, limit);

  console.log(`📊 Targeting ${topicsToScrape.length} topics\n`);
  console.log('='.repeat(60));

  let totalGenerated = 0;

  for (let i = 0; i < topicsToScrape.length; i++) {
    const topic = topicsToScrape[i];

    console.log(`\n[${i + 1}/${topicsToScrape.length}] ${topic.name}`);
    console.log(`   Current: ${topic.currentCount} questions`);

    // Determine exam and subject from topic category and name
    let examId = 'jee-main';
    let subjectId = 'jee-physics';

    // Smart mapping based on topic name/category
    const topicLower = topic.name.toLowerCase();
    if (topicLower.includes('algebra') || topicLower.includes('calculus') || topicLower.includes('mathematics')) {
      examId = 'jee-main';
      subjectId = 'jee-maths';
    } else if (topicLower.includes('mechanics') || topicLower.includes('physics')) {
      examId = 'jee-main';
      subjectId = 'jee-physics';
    } else if (topicLower.includes('organic') || topicLower.includes('chemistry')) {
      examId = 'jee-main';
      subjectId = 'jee-chemistry';
    } else if (topicLower.includes('biology') || topicLower.includes('genetics') || topicLower.includes('botany')) {
      examId = 'neet-ug';
      subjectId = 'neet-biology';
    }

    // Generate 10 questions per topic
    const questions = await generateQuestionsForTopic(topic.name, examId, subjectId, 10);

    if (questions.length > 0) {
      try {
        // Save using the proper dimensional model function
        await saveVerifiedQuestions(examId, subjectId, topic.name, questions);
        console.log(`   ✅ Saved ${questions.length} questions`);
        totalGenerated += questions.length;
      } catch (error: any) {
        console.error(`   ❌ Failed to save: ${error.message}`);
      }
    } else {
      console.log(`   ⚠️  No questions generated`);
    }

    // Rate limiting
    if (i < topicsToScrape.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ SCRAPING COMPLETE');
  console.log('='.repeat(60));
  console.log(`Topics processed: ${topicsToScrape.length}`);
  console.log(`Total questions generated: ${totalGenerated}`);
  console.log('='.repeat(60) + '\n');
}

scrapeTopics().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
