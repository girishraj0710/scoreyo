#!/usr/bin/env node
/**
 * Question Bank Analyzer
 * Shows exactly how many questions are available and how many mock tests can be generated
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

async function analyzeQuestionBank() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║          📊 PrepGenie Question Bank Analysis              ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  // Count all question sources
  const cachedResult = await client.execute('SELECT COUNT(*) as count FROM cached_questions');
  const cachedCount = Number(cachedResult.rows[0]?.count || 0);

  const englishResult = await client.execute('SELECT COUNT(*) as count FROM english_questions');
  const englishCount = Number(englishResult.rows[0]?.count || 0);

  const attemptsResult = await client.execute('SELECT COUNT(DISTINCT question_text) as count FROM question_attempts');
  const uniqueAttemptsCount = Number(attemptsResult.rows[0]?.count || 0);

  console.log('📚 Question Bank Summary:\n');
  console.log(`   Cached Questions (AI-generated):    ${cachedCount.toLocaleString()}`);
  console.log(`   English Questions:                  ${englishCount.toLocaleString()}`);
  console.log(`   Unique Question Attempts:           ${uniqueAttemptsCount.toLocaleString()}`);
  console.log(`   ${'─'.repeat(50)}`);
  console.log(`   Total Unique Questions:             ${(cachedCount + englishCount).toLocaleString()}\n`);

  // Get subject distribution from cached questions
  console.log('📊 Top Subjects by Question Count (Cached Questions):\n');
  const subjectResult = await client.execute(
    'SELECT subject_id, COUNT(*) as count FROM cached_questions GROUP BY subject_id ORDER BY count DESC LIMIT 15'
  );

  for (const row of subjectResult.rows) {
    const subjectId = row.subject_id as string;
    const count = Number(row.count);
    console.log(`   ${subjectId.padEnd(30)} : ${count.toLocaleString().padStart(6)} questions`);
  }

  // Calculate mock test capacity
  console.log('\n' + '='.repeat(60) + '\n');
  console.log('🎯 Mock Test Generation Capacity:\n');

  // Example calculations for popular exams
  const exams = [
    { name: 'JEE Main', subjects: ['jee-physics', 'jee-chemistry', 'jee-maths'], questionsPerTest: 30 },
    { name: 'NEET UG', subjects: ['neet-physics', 'neet-chemistry', 'neet-biology'], questionsPerTest: 30 },
    { name: 'SSC CGL', subjects: ['ssc-quant', 'ssc-reasoning', 'ssc-english', 'ssc-gk'], questionsPerTest: 25 },
    { name: 'CAT', subjects: ['cat-quant', 'cat-varc', 'cat-dilr'], questionsPerTest: 20 },
    { name: 'GATE CS', subjects: ['gate-cs', 'gate-aptitude', 'gate-engineering-math'], questionsPerTest: 20 },
  ];

  console.log('Exam Name'.padEnd(20) + 'Questions Needed'.padEnd(20) + 'Possible Tests');
  console.log('─'.repeat(60));

  for (const exam of exams) {
    let minTests = Infinity;

    for (const subjectId of exam.subjects) {
      const result = await client.execute(
        'SELECT COUNT(*) as count FROM cached_questions WHERE subject_id = ?',
        [subjectId]
      );
      const available = Number(result.rows[0]?.count || 0);
      const questionsPerSubject = Math.ceil(exam.questionsPerTest / exam.subjects.length);
      const testsForSubject = Math.floor(available / questionsPerSubject);

      if (testsForSubject < minTests) {
        minTests = testsForSubject;
      }
    }

    const possibleTests = minTests === Infinity ? 0 : Math.min(minTests, 999);
    const status = possibleTests >= 50 ? '✅' : possibleTests >= 10 ? '⚠️ ' : '❌';

    console.log(
      exam.name.padEnd(20) +
      `${exam.questionsPerTest} questions`.padEnd(20) +
      `${status} ${possibleTests}+ tests`
    );
  }

  console.log('\n' + '='.repeat(60) + '\n');

  // Current mock test status
  const mockTestResult = await client.execute('SELECT COUNT(*) as count FROM mock_tests');
  const totalMockTests = Number(mockTestResult.rows[0]?.count || 0);

  const completedMockTests = await client.execute(
    'SELECT COUNT(*) as count FROM mock_tests WHERE status = ?',
    ['completed']
  );
  const completedCount = Number(completedMockTests.rows[0]?.count || 0);

  console.log('📈 Mock Test Usage Statistics:\n');
  console.log(`   Total Mock Tests Created:           ${totalMockTests.toLocaleString()}`);
  console.log(`   Completed Mock Tests:               ${completedCount.toLocaleString()}`);
  console.log(`   In Progress:                        ${(totalMockTests - completedCount).toLocaleString()}\n`);

  // Recommendations
  console.log('💡 Recommendations:\n');

  if (cachedCount < 10000) {
    console.log('   🔴 Question bank is small (< 10,000 questions)');
    console.log('      → Need to generate more questions via AI or templates\n');
  } else if (cachedCount < 30000) {
    console.log('   🟡 Question bank is moderate (10,000-30,000 questions)');
    console.log('      → Can support 10-50 unique tests per exam\n');
  } else {
    console.log('   🟢 Question bank is large (30,000+ questions)');
    console.log('      → Can support 100+ unique tests per exam\n');
  }

  console.log('   ✅ Next Steps:');
  console.log('      1. Implement dynamic mock test generation');
  console.log('      2. Remove hardcoded 3-test limit');
  console.log('      3. Show "Test 1/999+" in UI instead of "Test 1/3"');
  console.log('      4. Generate questions on-the-fly for each test\n');

  console.log('='.repeat(60) + '\n');

  await client.close();
}

analyzeQuestionBank().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
