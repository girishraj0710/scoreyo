/**
 * Direct Question Generation Script
 * Uses OpenRouter API directly to generate questions
 * Saves to JSON file (bypasses database)
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import { generateQuiz } from '../src/lib/quiz-generator';

interface GenerationTarget {
  exam: string;
  subject: string;
  topic: string;
  count: number;
}

const TARGETS: GenerationTarget[] = [
  { exam: 'JEE Main', subject: 'Physics', topic: 'Mechanics', count: 30 },
  { exam: 'JEE Main', subject: 'Chemistry', topic: 'Organic Chemistry', count: 30 },
  { exam: 'JEE Main', subject: 'Mathematics', topic: 'Calculus', count: 30 },
  { exam: 'NEET', subject: 'Biology', topic: 'Cell Biology', count: 40 },
  { exam: 'NEET', subject: 'Chemistry', topic: 'Inorganic Chemistry', count: 40 },
  { exam: 'UPSC Prelims', subject: 'Polity', topic: 'Indian Constitution', count: 25 },
  { exam: 'UPSC Prelims', subject: 'History', topic: 'Modern India', count: 25 },
  { exam: 'SSC CGL', subject: 'Reasoning', topic: 'Logical Reasoning', count: 25 },
  { exam: 'SSC CGL', subject: 'Quantitative Aptitude', topic: 'Arithmetic', count: 25 },
];

interface GeneratedData {
  timestamp: string;
  totalQuestions: number;
  byExam: Record<string, any[]>;
}

async function generateAll() {
  console.log('🚀 Starting Direct Question Generation via OpenRouter\n');
  console.log(`Total targets: ${TARGETS.length}`);
  console.log(`Total questions: ${TARGETS.reduce((s, t) => s + t.count, 0)}\n`);

  const allQuestions: GeneratedData = {
    timestamp: new Date().toISOString(),
    totalQuestions: 0,
    byExam: {},
  };

  for (let i = 0; i < TARGETS.length; i++) {
    const target = TARGETS[i];
    const key = `${target.exam}-${target.subject}`;

    console.log(`\n[${i + 1}/${TARGETS.length}] ${target.exam} - ${target.subject} - ${target.topic}`);
    console.log(`Target: ${target.count} questions`);

    // Generate in batches of 10
    const batches = Math.ceil(target.count / 10);
    let generated = 0;

    for (let batch = 0; batch < batches; batch++) {
      const batchSize = Math.min(10, target.count - batch * 10);

      try {
        console.log(`  Batch ${batch + 1}/${batches}: Generating ${batchSize} questions...`);

        const questions = await generateQuiz(
          target.exam,
          target.subject,
          target.topic,
          batchSize,
          'mixed'
        );

        // Filter out invalid questions
        const valid = questions.filter(q =>
          !q.question.includes('[Service Unavailable]') &&
          q.question.length > 10 &&
          q.options.length === 4
        );

        if (valid.length > 0) {
          if (!allQuestions.byExam[key]) {
            allQuestions.byExam[key] = [];
          }
          allQuestions.byExam[key].push(...valid);
          generated += valid.length;
          allQuestions.totalQuestions += valid.length;

          console.log(`  ✅ Generated ${valid.length} valid questions (${generated}/${target.count} total)`);
        } else {
          console.log(`  ⚠️  No valid questions in this batch`);
        }

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (error) {
        console.error(`  ❌ Batch ${batch + 1} failed:`, (error as Error).message);
      }
    }

    console.log(`  📊 ${key}: ${generated}/${target.count} questions generated`);
  }

  // Save to file
  const outputPath = resolve(process.cwd(), '.agents/artifacts/generated-questions.json');
  await import('fs').then(fs => {
    fs.writeFileSync(outputPath, JSON.stringify(allQuestions, null, 2));
  });

  console.log(`\n✅ Generation Complete!`);
  console.log(`Total questions: ${allQuestions.totalQuestions}`);
  console.log(`Saved to: ${outputPath}`);
  console.log(`\nBreakdown:`);
  Object.entries(allQuestions.byExam).forEach(([exam, questions]) => {
    console.log(`  ${exam}: ${questions.length} questions`);
  });
}

generateAll().catch(console.error);
