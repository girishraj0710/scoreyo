#!/usr/bin/env tsx
/**
 * FREE Topic Scraper using Free Models
 * Uses free Gemini or other free models from OpenRouter
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

// LOW-COST MODEL from OpenRouter (same as working scraper)
const LOW_COST_MODEL = 'openai/gpt-4o-mini';  // ~$0.005 per topic

async function generateQuestionsForTopic(
  topicName: string,
  examId: string,
  subjectId: string,
  count: number = 10
): Promise<any[]> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY not configured');

  console.log(`   💰 Generating ${count} questions (ultra-low-cost) for: ${topicName}`);

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://prepgenie.co.in',
        'X-Title': 'PrepGenie Free Scraper',
      },
      body: JSON.stringify({
        model: LOW_COST_MODEL,
        messages: [
          {
            role: 'user',
            content: `Generate ${count} high-quality MCQ questions on: "${topicName}"

For ${examId.toUpperCase()} exam, ${subjectId} subject.
Based on NCERT textbooks and official syllabus.

Return ONLY JSON array (no markdown):
[
  {
    "question": "Question text?",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": 0-3,
    "explanation": "Detailed explanation",
    "difficulty": "easy|medium|hard"
  }
]`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`   ⚠️  API Response: ${errorBody}`);
      throw new Error(`API error: ${response.statusText} - ${errorBody}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '[]';

    // Parse JSON
    let parsed: any[];
    try {
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.error('   ⚠️  Parse failed, trying to fix...');
      // Try to extract JSON from text
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]);
        } catch (e2) {
          return [];
        }
      } else {
        return [];
      }
    }

    const questions = parsed
      .filter(q => q.question && q.options?.length === 4)
      .map(q => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer ?? 0,
        explanation: q.explanation || 'No explanation provided',
        difficulty: q.difficulty || 'medium',
        source: `Free AI - ${topicName}`,
      }));

    return questions;
  } catch (error: any) {
    console.error(`   ❌ Error: ${error.message}`);
    return [];
  }
}

async function scrapeTopics() {
  console.log('🆓 FREE Topic Scraper (No Cost!)\n');

  const args = process.argv.slice(2);
  const getArg = (flag: string) => {
    const index = args.indexOf(flag);
    return index !== -1 ? args[index + 1] : null;
  };

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

  console.log(`📊 Targeting ${topicsToScrape.length} topics`);
  console.log(`💰 Estimated cost: ~$${(topicsToScrape.length * 0.005).toFixed(2)} (GPT-4o-mini)\n`);
  console.log('='.repeat(60));

  let totalGenerated = 0;

  for (let i = 0; i < topicsToScrape.length; i++) {
    const topic = topicsToScrape[i];

    console.log(`\n[${i + 1}/${topicsToScrape.length}] ${topic.name}`);

    // Smart mapping
    let examId = 'jee-main';
    let subjectId = 'jee-physics';
    const topicLower = topic.name.toLowerCase();

    if (topicLower.includes('algebra') || topicLower.includes('calculus') || topicLower.includes('math')) {
      examId = 'jee-main'; subjectId = 'jee-maths';
    } else if (topicLower.includes('physics') || topicLower.includes('mechanics')) {
      examId = 'jee-main'; subjectId = 'jee-physics';
    } else if (topicLower.includes('chemistry') || topicLower.includes('organic')) {
      examId = 'jee-main'; subjectId = 'jee-chemistry';
    } else if (topicLower.includes('biology') || topicLower.includes('genetics')) {
      examId = 'neet-ug'; subjectId = 'neet-biology';
    }

    const questions = await generateQuestionsForTopic(topic.name, examId, subjectId, 10);

    if (questions.length > 0) {
      try {
        await saveVerifiedQuestions(examId, subjectId, topic.name, questions);
        console.log(`   ✅ Saved ${questions.length} questions`);
        totalGenerated += questions.length;
      } catch (error: any) {
        console.error(`   ❌ Save failed: ${error.message}`);
      }
    }

    // Rate limiting (be nice to free tier)
    if (i < topicsToScrape.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 3000)); // 3 second delay
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ SCRAPING COMPLETE');
  console.log('='.repeat(60));
  console.log(`Topics processed: ${topicsToScrape.length}`);
  console.log(`Questions generated: ${totalGenerated}`);
  console.log(`💰 Total cost: ~$${(topicsToScrape.length * 0.005).toFixed(2)}`);
  console.log('='.repeat(60) + '\n');
}

scrapeTopics().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
