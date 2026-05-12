#!/usr/bin/env node
/**
 * Mock Test Capacity Analyzer
 * Analyzes the 40,000+ question bank to show:
 * - How many unique mock tests can be generated per exam
 * - Current vs potential mock test availability
 * - Recommendations for scaling mock tests
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

// Exam to subject mapping (same as in dynamic generator)
const examSubjectMapping: Record<string, { subjectId: string; name: string; questionsPerTest: number }[]> = {
  "jee-main": [
    { subjectId: "jee-physics", name: "Physics", questionsPerTest: 10 },
    { subjectId: "jee-chemistry", name: "Chemistry", questionsPerTest: 10 },
    { subjectId: "jee-maths", name: "Mathematics", questionsPerTest: 10 },
  ],
  "jee-advanced": [
    { subjectId: "jee-adv-physics", name: "Physics", questionsPerTest: 10 },
    { subjectId: "jee-adv-chemistry", name: "Chemistry", questionsPerTest: 10 },
    { subjectId: "jee-adv-maths", name: "Mathematics", questionsPerTest: 10 },
  ],
  "neet-ug": [
    { subjectId: "neet-physics", name: "Physics", questionsPerTest: 10 },
    { subjectId: "neet-chemistry", name: "Chemistry", questionsPerTest: 10 },
    { subjectId: "neet-biology", name: "Biology", questionsPerTest: 10 },
  ],
  "upsc-cse": [
    { subjectId: "upsc-polity", name: "Polity", questionsPerTest: 5 },
    { subjectId: "upsc-history", name: "History", questionsPerTest: 5 },
    { subjectId: "upsc-geography", name: "Geography", questionsPerTest: 5 },
    { subjectId: "upsc-economy", name: "Economy", questionsPerTest: 5 },
    { subjectId: "upsc-science", name: "Science", questionsPerTest: 5 },
  ],
  "gate": [
    { subjectId: "gate-cs", name: "Computer Science", questionsPerTest: 14 },
    { subjectId: "gate-aptitude", name: "General Aptitude", questionsPerTest: 3 },
    { subjectId: "gate-engineering-math", name: "Engineering Math", questionsPerTest: 3 },
  ],
  "ssc-cgl": [
    { subjectId: "ssc-quant", name: "Quantitative Aptitude", questionsPerTest: 7 },
    { subjectId: "ssc-reasoning", name: "Reasoning", questionsPerTest: 6 },
    { subjectId: "ssc-english", name: "English", questionsPerTest: 6 },
    { subjectId: "ssc-gk", name: "General Knowledge", questionsPerTest: 6 },
  ],
  "ssc-chsl": [
    { subjectId: "ssc-quant", name: "Quantitative Aptitude", questionsPerTest: 7 },
    { subjectId: "ssc-reasoning", name: "Reasoning", questionsPerTest: 6 },
    { subjectId: "ssc-english", name: "English", questionsPerTest: 6 },
    { subjectId: "ssc-gk", name: "General Knowledge", questionsPerTest: 6 },
  ],
  "ibps-po": [
    { subjectId: "ibps-quant", name: "Quantitative Aptitude", questionsPerTest: 6 },
    { subjectId: "ibps-reasoning", name: "Reasoning", questionsPerTest: 6 },
    { subjectId: "ibps-english", name: "English", questionsPerTest: 7 },
    { subjectId: "ibps-gk", name: "General Awareness", questionsPerTest: 6 },
  ],
  "sbi-po": [
    { subjectId: "sbi-quant", name: "Quantitative Aptitude", questionsPerTest: 6 },
    { subjectId: "sbi-reasoning", name: "Reasoning", questionsPerTest: 6 },
    { subjectId: "sbi-english", name: "English", questionsPerTest: 7 },
    { subjectId: "sbi-gk", name: "General Awareness", questionsPerTest: 6 },
  ],
  "cat": [
    { subjectId: "cat-quant", name: "Quantitative Aptitude", questionsPerTest: 7 },
    { subjectId: "cat-varc", name: "Verbal Ability & RC", questionsPerTest: 7 },
    { subjectId: "cat-dilr", name: "Data Interpretation & LR", questionsPerTest: 6 },
  ],
};

async function getQuestionCountBySubject(): Promise<Record<string, number>> {
  const result = await client.execute(
    'SELECT subject_id, COUNT(*) as count FROM questions GROUP BY subject_id'
  );

  const counts: Record<string, number> = {};
  for (const row of result.rows) {
    counts[row.subject_id as string] = Number(row.count);
  }

  return counts;
}

async function analyzeMockTestCapacity() {
  console.log('\n╔══════════════════════════════════════════════════════════════════════╗');
  console.log('║              📊 Mock Test Capacity Analysis Report                  ║');
  console.log('╚══════════════════════════════════════════════════════════════════════╝\n');

  // Get total question count
  const totalResult = await client.execute('SELECT COUNT(*) as count FROM questions');
  const totalQuestions = Number(totalResult.rows[0].count);

  console.log(`📚 Total Questions in Database: ${totalQuestions.toLocaleString()}\n`);

  // Get subject-wise counts
  const subjectCounts = await getQuestionCountBySubject();

  console.log('📋 Subject-wise Question Distribution:\n');
  const sortedSubjects = Object.entries(subjectCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);

  for (const [subject, count] of sortedSubjects) {
    console.log(`   ${subject.padEnd(30)} : ${count.toLocaleString().padStart(6)} questions`);
  }

  console.log('\n' + '='.repeat(70) + '\n');

  // Analyze mock test capacity per exam
  console.log('🎯 Mock Test Generation Capacity:\n');
  console.log('Exam'.padEnd(20) + 'Current'.padEnd(15) + 'Possible'.padEnd(15) + 'Increase'.padEnd(15) + 'Bottleneck');
  console.log('-'.repeat(70));

  let totalCurrentTests = 0;
  let totalPossibleTests = 0;

  for (const [examId, subjects] of Object.entries(examSubjectMapping)) {
    // Calculate how many tests can be generated
    const capacities: number[] = [];
    let bottleneckSubject = '';
    let minCapacity = Infinity;

    for (const subject of subjects) {
      const available = subjectCounts[subject.subjectId] || 0;
      const capacity = Math.floor(available / subject.questionsPerTest);
      capacities.push(capacity);

      if (capacity < minCapacity) {
        minCapacity = capacity;
        bottleneckSubject = subject.name;
      }
    }

    const possibleTests = Math.min(...capacities, 999); // Cap at 999
    const currentTests = 3; // Currently hardcoded to 3 tests
    const increase = possibleTests - currentTests;

    totalCurrentTests += currentTests;
    totalPossibleTests += possibleTests;

    const examName = examId.replace(/-/g, ' ').toUpperCase().slice(0, 18);
    console.log(
      examName.padEnd(20) +
      `${currentTests} tests`.padEnd(15) +
      `${possibleTests} tests`.padEnd(15) +
      `+${increase}x`.padEnd(15) +
      (possibleTests < 10 ? `⚠️  ${bottleneckSubject}` : `✅ ${bottleneckSubject}`)
    );
  }

  console.log('-'.repeat(70));
  console.log(
    'TOTAL'.padEnd(20) +
    `${totalCurrentTests} tests`.padEnd(15) +
    `${totalPossibleTests} tests`.padEnd(15) +
    `+${Math.round((totalPossibleTests / totalCurrentTests - 1) * 100)}%`
  );

  console.log('\n' + '='.repeat(70) + '\n');

  // Recommendations
  console.log('💡 Key Insights:\n');

  const examsWithLowCapacity = Object.entries(examSubjectMapping).filter(([examId, subjects]) => {
    const capacities = subjects.map(s => {
      const available = subjectCounts[s.subjectId] || 0;
      return Math.floor(available / s.questionsPerTest);
    });
    return Math.min(...capacities) < 10;
  });

  if (examsWithLowCapacity.length > 0) {
    console.log(`⚠️  ${examsWithLowCapacity.length} exams have less than 10 tests available:`);
    for (const [examId] of examsWithLowCapacity) {
      console.log(`   • ${examId}`);
    }
    console.log('   → Need to add more questions for these subjects\n');
  }

  const avgIncrease = Math.round((totalPossibleTests / totalCurrentTests - 1) * 100);
  console.log(`✅ Overall: You can increase mock tests by ${avgIncrease}% (from ${totalCurrentTests} to ${totalPossibleTests})\n`);
  console.log(`📈 With ${totalQuestions.toLocaleString()} questions, you can support ${totalPossibleTests} unique mock tests\n`);
  console.log(`🚀 Recommendation: Implement dynamic mock test generation to unlock full capacity!\n`);

  // Show example of high-capacity exams
  console.log('🌟 Exams Ready for Unlimited Tests (100+ tests available):\n');
  const highCapacityExams = Object.entries(examSubjectMapping)
    .map(([examId, subjects]) => {
      const capacities = subjects.map(s => {
        const available = subjectCounts[s.subjectId] || 0;
        return Math.floor(available / s.questionsPerTest);
      });
      return { examId, capacity: Math.min(...capacities) };
    })
    .filter(e => e.capacity >= 100)
    .sort((a, b) => b.capacity - a.capacity)
    .slice(0, 5);

  for (const { examId, capacity } of highCapacityExams) {
    console.log(`   • ${examId.padEnd(20)} : ${capacity}+ unique tests possible`);
  }

  console.log('\n' + '='.repeat(70) + '\n');

  await client.close();
}

analyzeMockTestCapacity().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
