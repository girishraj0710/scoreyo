/**
 * Upload English (IELTS/TOEFL) Questions to Database
 *
 * Reads all batch files from .agents/artifacts/
 * Uploads to english_questions table with proper structure
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import { readFileSync, readdirSync } from 'fs';
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
  // Additional fields depending on question type
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

    // Prepare questions for database
    const questionsToSave = passage.questions.map(q => {
      // Determine pathId based on exam
      const pathId = passage.exam === 'IELTS' ? 'ielts' : 'toefl';

      // Create a topicId from the topic (normalize)
      const topicId = passage.topic.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      // Determine level based on difficulty
      const level = passage.difficulty === 'easy' ? 'beginner'
                   : passage.difficulty === 'medium' ? 'intermediate'
                   : 'advanced';

      // Format question text
      let questionText = q.question || q.statement || '';

      // For question types that need special formatting
      if (q.questionType === 'sentence-completion' && !q.question) {
        questionText = `Complete the sentence: ${q.statement || ''}`;
      } else if (q.questionType === 'matching-headings') {
        questionText = `Match the heading for ${q.paragraph || 'the paragraph'}: ${q.question || ''}`;
      } else if (q.questionType === 'summary-completion') {
        questionText = q.summary || q.question || '';
      }

      // Format options - handle different question types
      let options: string[] = [];

      if (q.options && Array.isArray(q.options)) {
        options = q.options;
      } else if (q.questionType === 'true-false-not-given' || q.questionType === 'yes-no-not-given') {
        options = ['TRUE', 'FALSE', 'NOT GIVEN'];
        if (q.questionType === 'yes-no-not-given') {
          options = ['YES', 'NO', 'NOT GIVEN'];
        }
      } else if (q.headings) {
        options = q.headings;
      } else if (q.features) {
        options = q.features;
      } else if (q.wordBank) {
        options = q.wordBank;
      } else {
        // For short-answer and fill-in-the-blank, create placeholder options
        options = ['User writes answer', 'Multiple valid answers possible', '', ''];
      }

      // Handle correctAnswer - normalize to number index
      let correctAnswerIndex = 0;

      if (typeof q.correctAnswer === 'number') {
        correctAnswerIndex = q.correctAnswer;
      } else if (typeof q.correctAnswer === 'string') {
        // For TRUE/FALSE/NOT GIVEN
        if (q.correctAnswer === 'TRUE') correctAnswerIndex = 0;
        else if (q.correctAnswer === 'FALSE') correctAnswerIndex = 1;
        else if (q.correctAnswer === 'NOT GIVEN') correctAnswerIndex = 2;
        // For YES/NO/NOT GIVEN
        else if (q.correctAnswer === 'YES') correctAnswerIndex = 0;
        else if (q.correctAnswer === 'NO') correctAnswerIndex = 1;
        // For letter answers (A, B, C, D)
        else if (q.correctAnswer === 'A' || q.correctAnswer === 'i') correctAnswerIndex = 0;
        else if (q.correctAnswer === 'B' || q.correctAnswer === 'ii') correctAnswerIndex = 1;
        else if (q.correctAnswer === 'C' || q.correctAnswer === 'iii') correctAnswerIndex = 2;
        else if (q.correctAnswer === 'D' || q.correctAnswer === 'iv') correctAnswerIndex = 3;
        // For short-answer questions, store the answer text in options[0]
        else {
          options = [q.correctAnswer, ...(q.acceptableAnswers || []).slice(0, 3)];
          correctAnswerIndex = 0;
        }
      }

      // Create comprehensive explanation with question type info
      const fullExplanation = `[${q.questionType.toUpperCase()}] ${q.explanation}\n\nPassage Reference: ${q.passageReference}\nSkill: ${q.skill}`;

      return {
        pathId,
        topicId,
        level,
        question: questionText,
        options: options.slice(0, 4), // Ensure max 4 options
        correctAnswer: correctAnswerIndex,
        explanation: fullExplanation,
        difficulty: passage.difficulty,
        passage: passage.passage, // Include full passage
      };
    });

    // Upload to database
    try {
      await saveEnglishQuestions(questionsToSave);
      totalQuestionsUploaded += questionsToSave.length;
      console.log(`    ✅ Uploaded ${questionsToSave.length} questions`);
    } catch (error) {
      console.error(`    ❌ Error uploading questions:`, error);
    }
  }

  console.log(`\n  ✅ Batch ${batchNumber} complete: ${totalQuestionsUploaded} questions uploaded`);
  return totalQuestionsUploaded;
}

async function main() {
  console.log('🚀 English Questions Upload Script\n');
  console.log('Reading batches from .agents/artifacts/...\n');

  const artifactsDir = resolve(process.cwd(), '.agents/artifacts');
  const batchFiles = readdirSync(artifactsDir)
    .filter(f => f.startsWith('english-batch-') && f.endsWith('.json'))
    .sort(); // Sort to process in order

  console.log(`Found ${batchFiles.length} batch files:\n`);
  batchFiles.forEach(f => console.log(`  - ${f}`));

  let grandTotal = 0;

  for (const batchFile of batchFiles) {
    const batchNumber = parseInt(batchFile.match(/batch-(\d+)/)?.[1] || '0');
    const batchPath = resolve(artifactsDir, batchFile);

    const uploadedCount = await uploadBatch(batchNumber, batchPath);
    grandTotal += uploadedCount;

    // Small delay between batches
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`✅ UPLOAD COMPLETE`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Total batches processed: ${batchFiles.length}`);
  console.log(`Total questions uploaded: ${grandTotal}`);
  console.log(`${'='.repeat(60)}\n`);
}

main()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
