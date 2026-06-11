/**
 * Upload Generated Questions to Database
 * Reads from generated-questions.json and saves to Supabase
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import { readFileSync } from 'fs';
import { saveVerifiedQuestions } from '../src/lib/db';

// Map exam names to exam IDs
const EXAM_MAP: Record<string, string> = {
  'JEE Main': 'jee-main',
  'NEET': 'neet',
  'UPSC Prelims': 'upsc-prelims',
  'SSC CGL': 'ssc-cgl',
};

// Map subject names to subject IDs
const SUBJECT_MAP: Record<string, string> = {
  'Physics': 'jee-physics',
  'Chemistry': 'jee-chemistry',
  'Mathematics': 'jee-maths',
  'Biology': 'neet-biology',
  'Polity': 'upsc-polity',
  'History': 'upsc-history',
  'Reasoning': 'ssc-reasoning',
  'Quantitative Aptitude': 'ssc-quantitative',
};

async function uploadQuestions() {
  const filePath = resolve(process.cwd(), '.agents/artifacts/generated-questions.json');

  console.log('📤 Uploading Generated Questions to Database\n');

  // Read generated questions
  const data = JSON.parse(readFileSync(filePath, 'utf-8'));

  console.log(`Total questions: ${data.totalQuestions}`);
  console.log(`Generated at: ${data.timestamp}\n`);

  let uploaded = 0;
  let failed = 0;

  for (const [key, questions] of Object.entries(data.byExam)) {
    const [examName, subjectName] = key.split('-');
    const examId = EXAM_MAP[examName];
    const subjectId = SUBJECT_MAP[subjectName];

    if (!examId || !subjectId) {
      console.error(`❌ Unknown exam/subject: ${key}`);
      failed += (questions as any[]).length;
      continue;
    }

    // Get topic from first question (all should have same topic)
    const topic = (questions as any[])[0]?.topic || 'General';

    console.log(`\n📝 ${key}: ${(questions as any[]).length} questions`);
    console.log(`   Exam ID: ${examId}, Subject ID: ${subjectId}, Topic: ${topic}`);

    try {
      await saveVerifiedQuestions(
        examId,
        subjectId,
        topic,
        questions as any[]
      );
      uploaded += (questions as any[]).length;
      console.log(`   ✅ Uploaded successfully`);
    } catch (error) {
      console.error(`   ❌ Upload failed:`, (error as Error).message);
      failed += (questions as any[]).length;
    }

    // Rate limit
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\n✅ Upload Complete!`);
  console.log(`   Uploaded: ${uploaded} questions`);
  console.log(`   Failed: ${failed} questions`);
  console.log(`   Total: ${uploaded + failed} questions`);
}

uploadQuestions().catch(console.error);
