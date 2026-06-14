/**
 * Upload English Questions - Valid Batches Only (3-6)
 * Batches 1-2 have JSON syntax errors and will be fixed separately
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import { readFileSync } from 'fs';
import { saveEnglishQuestions } from '@/lib/db';

interface Question {
  questionNumber: number;
  questionType: string;
  question?: string;
  statement?: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  passageReference: string;
  skill: string;
  [key: string]: any;
}

interface Passage {
  exam: 'IELTS' | 'TOEFL';
  passageNumber: number;
  title: string;
  difficulty: string;
  topic: string;
  passage: string;
  wordCount: number;
  questions: Question[];
}

interface Batch {
  batch: number;
  passages: Passage[];
}

async function uploadBatch(batchNumber: number, batchPath: string) {
  console.log(`\n📦 Processing Batch ${batchNumber}...`);

  const content = readFileSync(batchPath, 'utf-8');
  const batch: Batch = JSON.parse(content);

  let totalQuestionsUploaded = 0;

  for (const passage of batch.passages) {
    console.log(`\n  📄 ${passage.exam} - ${passage.title} (${passage.questions.length} questions)`);

    const questionsToSave = passage.questions.map(q => {
      const pathId = passage.exam === 'IELTS' ? 'ielts' : 'toefl';
      const topicId = passage.topic.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const level = passage.difficulty === 'easy' ? 'beginner'
                   : passage.difficulty === 'medium' ? 'intermediate'
                   : 'advanced';

      let questionText = q.question || q.statement || '';
      if (q.questionType === 'sentence-completion' && !q.question) {
        questionText = `Complete the sentence: ${q.statement || ''}`;
      }

      let options: string[] = [];
      if (q.options && Array.isArray(q.options)) {
        options = q.options;
      } else if (q.questionType === 'true-false-not-given') {
        options = ['TRUE', 'FALSE', 'NOT GIVEN'];
      } else if (q.questionType === 'yes-no-not-given') {
        options = ['YES', 'NO', 'NOT GIVEN'];
      } else {
        options = ['User writes answer', 'Multiple valid answers possible', '', ''];
      }

      let correctAnswerIndex = 0;
      if (typeof q.correctAnswer === 'number') {
        correctAnswerIndex = q.correctAnswer;
      } else if (typeof q.correctAnswer === 'string') {
        if (q.correctAnswer === 'TRUE') correctAnswerIndex = 0;
        else if (q.correctAnswer === 'FALSE') correctAnswerIndex = 1;
        else if (q.correctAnswer === 'NOT GIVEN') correctAnswerIndex = 2;
        else if (q.correctAnswer === 'YES') correctAnswerIndex = 0;
        else if (q.correctAnswer === 'NO') correctAnswerIndex = 1;
        else {
          options = [q.correctAnswer, ...(q.acceptableAnswers || []).slice(0, 3)];
          correctAnswerIndex = 0;
        }
      }

      const fullExplanation = `[${q.questionType.toUpperCase()}] ${q.explanation}\n\nPassage Reference: ${q.passageReference}\nSkill: ${q.skill}`;

      return {
        pathId,
        topicId,
        level,
        question: questionText,
        options: options.slice(0, 4),
        correctAnswer: correctAnswerIndex,
        explanation: fullExplanation,
        difficulty: passage.difficulty,
        passage: passage.passage,
      };
    });

    try {
      await saveEnglishQuestions(questionsToSave);
      totalQuestionsUploaded += questionsToSave.length;
      console.log(`    ✅ Uploaded ${questionsToSave.length} questions`);
    } catch (error) {
      console.error(`    ❌ Error:`, error);
    }
  }

  console.log(`\n  ✅ Batch ${batchNumber} complete: ${totalQuestionsUploaded} questions`);
  return totalQuestionsUploaded;
}

async function main() {
  console.log('🚀 English Questions Upload - Valid Batches (3-6)\n');

  const batches = [3, 4, 5, 6];
  let grandTotal = 0;

  for (const batchNum of batches) {
    const batchPath = resolve(process.cwd(), `.agents/artifacts/english-batch-0${batchNum}.json`);
    const count = await uploadBatch(batchNum, batchPath);
    grandTotal += count;
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`✅ UPLOAD COMPLETE`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Batches uploaded: 3, 4, 5, 6 (Batches 1-2 need JSON fixes)`);
  console.log(`Total questions: ${grandTotal}`);
  console.log(`${'='.repeat(60)}\n`);
}

main()
  .then(() => {
    console.log('✅ Script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
