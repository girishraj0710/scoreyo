#!/usr/bin/env ts-node
/**
 * Automated Question Generation Script
 * Zero manual work - just run and get 300+ questions
 *
 * Usage:
 *   npm run generate-questions
 *   OR
 *   npx ts-node scripts/generate-questions.ts
 */

// Load environment variables from .env.local
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import AIQuestionGenerator from '../src/lib/ai-question-generator';

// Configuration: What to generate
const GENERATION_TARGETS = [
  // IELTS (Total: 150 questions)
  { exam: 'IELTS', subject: 'Reading', topic: 'Academic Reading', targetCount: 50, difficulty: 'mixed' as const },
  { exam: 'IELTS', subject: 'Reading', topic: 'General Training', targetCount: 50, difficulty: 'mixed' as const },
  { exam: 'IELTS', subject: 'Writing', topic: 'Task 1', targetCount: 25, difficulty: 'mixed' as const },
  { exam: 'IELTS', subject: 'Writing', topic: 'Task 2', targetCount: 25, difficulty: 'mixed' as const },

  // JEE (Total: 100 questions)
  { exam: 'JEE', subject: 'Physics', topic: 'Mechanics', targetCount: 30, difficulty: 'mixed' as const },
  { exam: 'JEE', subject: 'Chemistry', topic: 'Organic Chemistry', targetCount: 35, difficulty: 'mixed' as const },
  { exam: 'JEE', subject: 'Mathematics', topic: 'Calculus', targetCount: 35, difficulty: 'mixed' as const },

  // NEET (Total: 80 questions)
  { exam: 'NEET', subject: 'Biology', topic: 'Cell Biology', targetCount: 40, difficulty: 'mixed' as const },
  { exam: 'NEET', subject: 'Chemistry', topic: 'Inorganic Chemistry', targetCount: 40, difficulty: 'mixed' as const },

  // UPSC (Total: 50 questions)
  { exam: 'UPSC', subject: 'Polity', topic: 'Indian Constitution', targetCount: 25, difficulty: 'mixed' as const },
  { exam: 'UPSC', subject: 'History', topic: 'Modern India', targetCount: 25, difficulty: 'mixed' as const },

  // SSC (Total: 50 questions)
  { exam: 'SSC', subject: 'Reasoning', topic: 'Logical Reasoning', targetCount: 25, difficulty: 'mixed' as const },
  { exam: 'SSC', subject: 'Quantitative', topic: 'Arithmetic', targetCount: 25, difficulty: 'mixed' as const },
];

async function main() {
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║  AUTOMATED AI QUESTION GENERATION                              ║');
  console.log('║  Zero Manual Work - Fully Automated                            ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  console.log(`📋 Target: ${GENERATION_TARGETS.length} generation tasks`);
  console.log(`📊 Total Questions: ${GENERATION_TARGETS.reduce((sum, t) => sum + t.targetCount, 0)}\n`);

  const generator = new AIQuestionGenerator();
  const results: any[] = [];

  let totalGenerated = 0;
  let totalSaved = 0;
  let totalFailed = 0;

  // Generate for each target
  for (let i = 0; i < GENERATION_TARGETS.length; i++) {
    const target = GENERATION_TARGETS[i];

    console.log(`\n${'='.repeat(70)}`);
    console.log(`Task ${i + 1}/${GENERATION_TARGETS.length}: ${target.exam} - ${target.subject} - ${target.topic}`);
    console.log('='.repeat(70));

    try {
      const result = await generator.run(target);
      results.push(result);

      totalGenerated += result.questionsGenerated;
      totalSaved += result.questionsSaved;
      totalFailed += (result.questionsGenerated - result.questionsSaved);

      if (result.success) {
        console.log(`✅ Task ${i + 1} complete: ${result.questionsSaved} questions saved`);
      } else {
        console.log(`❌ Task ${i + 1} failed: ${result.errors.join(', ')}`);
      }

      // Rate limiting: Wait 2 seconds between API calls
      if (i < GENERATION_TARGETS.length - 1) {
        console.log('\n⏳ Waiting 2 seconds before next generation...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (err) {
      console.error(`❌ Task ${i + 1} crashed:`, err);
      results.push({
        success: false,
        questionsGenerated: 0,
        questionsSaved: 0,
        errors: [(err as Error).message],
      });
    }
  }

  // Final summary
  console.log('\n\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║  FINAL SUMMARY                                                 ║');
  console.log('╠═══════════════════════════════════════════════════════════════╣');
  console.log(`║  Total Generated: ${totalGenerated} questions`);
  console.log(`║  Total Saved:     ${totalSaved} questions`);
  console.log(`║  Total Failed:    ${totalFailed} questions`);
  console.log('╠═══════════════════════════════════════════════════════════════╣');
  console.log(`║  Success Rate:    ${((totalSaved / totalGenerated) * 100).toFixed(1)}%`);
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  // Breakdown by exam
  console.log('📊 Breakdown by Exam:\n');
  const examBreakdown: Record<string, number> = {};
  GENERATION_TARGETS.forEach((target, i) => {
    if (!examBreakdown[target.exam]) examBreakdown[target.exam] = 0;
    examBreakdown[target.exam] += results[i]?.questionsSaved || 0;
  });

  Object.entries(examBreakdown).forEach(([exam, count]) => {
    console.log(`   ${exam.padEnd(10)}: ${count} questions`);
  });

  console.log('\n✅ Generation complete! Check your database:\n');
  console.log('   SELECT exam, COUNT(*) FROM fact_exam_questions');
  console.log('   WHERE source LIKE \'ai_generated_%\'');
  console.log('   GROUP BY exam;\n');

  process.exit(0);
}

// Run
main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
