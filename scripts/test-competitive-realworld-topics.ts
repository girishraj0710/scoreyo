#!/usr/bin/env node
/**
 * Test Competitive Exam & Real-World Topic Availability
 * Verifies all topics have questions mapped
 * Date: May 12, 2026
 */

import { createClient } from '@libsql/client';
import * as fs from 'fs';
import * as path from 'path';

// Load .env.local manually
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      process.env[key] = value;
    }
  });
}

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Topic mappings from API
const competitiveTopics: Record<string, string> = {
  'grammar-basics': 'grammar-basics',
  'vocabulary-ssc': 'vocabulary-ssc',
  'sentence-improvement': 'common-mistakes',
  'comprehension': 'reading-comprehension',
  'cloze-test': 'reading-comprehension',
};

const realWorldTopics: Record<string, string> = {
  'job-interviews': 'phrasal-verbs',
  'daily-conversations': 'daily-conversations',
  'email-writing': 'email-writing',
  'presentations': 'idioms',
  'business-english': 'phrasal-verbs',
};

const topicNames: Record<string, string> = {
  // Competitive Exam
  'grammar-basics': 'Grammar Fundamentals',
  'vocabulary-ssc': 'Vocabulary for SSC/Banking',
  'sentence-improvement': 'Sentence Improvement',
  'comprehension': 'Reading Comprehension',
  'cloze-test': 'Cloze Test',

  // Real-World
  'job-interviews': 'Job Interview English',
  'daily-conversations': 'Daily Conversations',
  'email-writing': 'Email Writing',
  'presentations': 'Presentations & Public Speaking',
  'business-english': 'Business English',
};

async function testTopics(
  title: string,
  topics: Record<string, string>,
  emoji: string
) {
  console.log(`\n${emoji} ${title}\n${'─'.repeat(64)}`);

  let allPassed = true;

  for (const [frontendTopic, dbTopic] of Object.entries(topics)) {
    const name = topicNames[frontendTopic];

    // Check questions in all paths
    const result = await client.execute(
      'SELECT path_id, level, COUNT(*) as count FROM english_questions WHERE topic_id = ? GROUP BY path_id, level',
      [dbTopic]
    );

    const totalCount = result.rows.reduce((sum, row) => sum + (row.count as number), 0);

    if (totalCount > 0) {
      console.log(`✅ ${name}`);
      console.log(`   Frontend: ${frontendTopic} → DB: ${dbTopic}`);
      console.log(`   Total: ${totalCount} questions`);

      // Show path distribution
      const pathCounts = new Map<string, number>();
      for (const row of result.rows) {
        const pathCount = pathCounts.get(row.path_id as string) || 0;
        pathCounts.set(row.path_id as string, pathCount + (row.count as number));
      }

      for (const [pathId, count] of pathCounts.entries()) {
        console.log(`   - ${pathId}: ${count}Q`);
      }
      console.log('');
    } else {
      console.log(`❌ ${name}`);
      console.log(`   Frontend: ${frontendTopic} → DB: ${dbTopic}`);
      console.log(`   ERROR: No questions found!\n`);
      allPassed = false;
    }
  }

  return allPassed;
}

async function runTests() {
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║    Competitive Exam & Real-World Topic Availability Test    ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');

  const competitivePassed = await testTopics(
    'COMPETITIVE EXAM TOPICS',
    competitiveTopics,
    '🎓'
  );

  const realWorldPassed = await testTopics(
    'REAL-WORLD TOPICS',
    realWorldTopics,
    '🌍'
  );

  console.log('═'.repeat(64));

  if (competitivePassed && realWorldPassed) {
    console.log('✅ All topics have questions available!');
    console.log('\n📊 Summary:');
    console.log(`   • Competitive Exam: ${Object.keys(competitiveTopics).length} topics working`);
    console.log(`   • Real-World: ${Object.keys(realWorldTopics).length} topics working`);
  } else {
    console.log('❌ Some topics are missing questions. Please check the mappings.');
  }

  console.log('\n');
  await client.close();

  return competitivePassed && realWorldPassed;
}

runTests().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
