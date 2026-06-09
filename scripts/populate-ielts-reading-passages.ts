/**
 * Script: Populate IELTS Reading Passages
 * Generates reading comprehension questions WITH passages from AI
 * This fixes the issue where passages were referenced but not displayed
 */

import { generateQuiz } from '../src/lib/quiz-generator';
import { saveVerifiedQuestions } from '../src/lib/db';

const IELTS_READING_TOPICS = [
  'Reading Comprehension',
  'Passage Analysis',
  'Academic Reading',
  'General Reading',
];

async function generateReadingQuestions() {
  console.log('🚀 Generating IELTS Reading Comprehension Questions with Passages...\n');

  for (const topic of IELTS_READING_TOPICS) {
    console.log(`📝 Generating questions for: ${topic}`);

    try {
      // Generate questions with passages (AI detects reading comprehension topic)
      const questions = await generateQuiz(
        'IELTS', // exam
        'English', // subject
        topic, // topic
        10, // number of questions
        'mixed' // difficulty
      );

      if (questions && questions.length > 0) {
        console.log(`  ✅ Generated ${questions.length} questions with passages`);

        // Save to database (with passages)
        const saved = await saveVerifiedQuestions(
          'ielts',
          'english',
          topic,
          questions
        );

        console.log(`  ✅ Saved ${saved} questions to database\n`);
      } else {
        console.log(`  ⚠️  No questions generated\n`);
      }
    } catch (error) {
      console.error(`  ❌ Error: ${error}\n`);
    }
  }

  console.log('✨ Done! IELTS Reading Comprehension questions now have passages.');
}

generateReadingQuestions().catch(console.error);
