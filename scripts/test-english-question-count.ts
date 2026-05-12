#!/usr/bin/env node
/**
 * Test English Practice Question Count
 * Verifies that requesting different counts (5, 10, 20) returns correct number of questions
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

// Simulate the getEnglishQuestions function
async function getEnglishQuestions(pathId: string, topicId: string, level: string, limit: number) {
  const result = await client.execute(
    "SELECT * FROM english_questions WHERE path_id = ? AND topic_id = ? AND level = ? ORDER BY RANDOM() LIMIT ?",
    [pathId, topicId, level, limit]
  );
  return result.rows;
}

async function testQuestionCounts() {
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║       English Practice Question Count Test                  ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  const testCases = [
    { topic: 'writing-skills', path: 'foundation', level: 'intermediate', counts: [5, 10, 20] },
    { topic: 'reading-comprehension', path: 'foundation', level: 'intermediate', counts: [5, 10, 20] },
    { topic: 'common-mistakes', path: 'foundation', level: 'intermediate', counts: [5, 10, 20] },
    { topic: 'phrasal-verbs', path: 'foundation', level: 'intermediate', counts: [5, 10, 20] },
  ];

  for (const testCase of testCases) {
    console.log(`📚 Topic: ${testCase.topic} (${testCase.level})`);
    console.log(`   Path: ${testCase.path}`);

    // Check total available
    const totalResult = await client.execute(
      "SELECT COUNT(*) as count FROM english_questions WHERE path_id = ? AND topic_id = ? AND level = ?",
      [testCase.path, testCase.topic, testCase.level]
    );
    const totalAvailable = totalResult.rows[0].count as number;
    console.log(`   Total available: ${totalAvailable} questions\n`);

    for (const requestedCount of testCase.counts) {
      // Simulate API: request count * 2 (for shuffling)
      const questions = await getEnglishQuestions(
        testCase.path,
        testCase.topic,
        testCase.level,
        requestedCount * 2
      );

      // Simulate API: limit to requested count
      const finalQuestions = questions.slice(0, requestedCount);

      const status = finalQuestions.length === requestedCount ? '✅' : '❌';
      console.log(`   ${status} Requested: ${requestedCount}, Got: ${finalQuestions.length}`);

      if (finalQuestions.length !== requestedCount && totalAvailable >= requestedCount) {
        console.log(`      ⚠️  WARNING: Should have returned ${requestedCount} but got ${finalQuestions.length}`);
      } else if (totalAvailable < requestedCount) {
        console.log(`      ℹ️  Note: Only ${totalAvailable} available in database`);
      }
    }
    console.log('\n');
  }

  // Test with topics that have limited questions
  console.log('🔍 Testing Topics with Limited Questions:\n');

  const limitedTopics = [
    { topic: 'grammar-basics', path: 'competitive-exam' },
    { topic: 'vocabulary-ssc', path: 'competitive-exam' },
    { topic: 'daily-conversations', path: 'real-world' },
  ];

  for (const testCase of limitedTopics) {
    const totalResult = await client.execute(
      "SELECT COUNT(*) as count FROM english_questions WHERE path_id = ? AND topic_id = ?",
      [testCase.path, testCase.topic]
    );
    const totalAvailable = totalResult.rows[0].count as number;

    console.log(`📚 Topic: ${testCase.topic}`);
    console.log(`   Total available (all levels): ${totalAvailable} questions`);

    for (const requestedCount of [5, 10, 20]) {
      const questions = await getEnglishQuestions(
        testCase.path,
        testCase.topic,
        'intermediate',
        requestedCount * 2
      );
      const finalQuestions = questions.slice(0, requestedCount);

      if (finalQuestions.length > 0) {
        const status = finalQuestions.length >= Math.min(requestedCount, totalAvailable) ? '✅' : '⚠️';
        console.log(`   ${status} Requested: ${requestedCount}, Got: ${finalQuestions.length}`);
      } else {
        console.log(`   ⚠️  Requested: ${requestedCount}, Got: 0 (may need level fallback)`);
      }
    }
    console.log('\n');
  }

  await client.close();
}

testQuestionCounts().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
