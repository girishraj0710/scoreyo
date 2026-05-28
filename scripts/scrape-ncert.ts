#!/usr/bin/env tsx
/**
 * NCERT Question Scraper CLI
 *
 * Usage:
 *   npm run scrape -- --subject physics --class 12 --chapter 1
 *   npm run scrape -- --subject chemistry --class 11 --all
 *   npm run scrape -- --test
 *
 * Prerequisites:
 *   1. Install pdf-parse: npm install pdf-parse
 *   2. Set OPENROUTER_API_KEY in .env.local
 *   3. Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN
 */

// Load environment variables from .env.local
import { readFileSync } from 'fs';
import { resolve } from 'path';

try {
  const envPath = resolve(process.cwd(), '.env.local');
  const envContent = readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
} catch (error) {
  console.error('⚠️  Could not load .env.local file');
}

import { processNCERTChapter } from '../src/lib/scrapers/ai-pdf-scraper';

// Parse command line arguments
const args = process.argv.slice(2);
const getArg = (flag: string) => {
  const index = args.indexOf(flag);
  return index !== -1 ? args[index + 1] : null;
};
const hasFlag = (flag: string) => args.includes(flag);

async function main() {
  console.log('🎓 PrepGenie NCERT Question Scraper\n');

  // Test mode
  if (hasFlag('--test')) {
    console.log('🧪 Running test extraction...\n');
    await testExtraction();
    return;
  }

  // Get parameters
  const subject = getArg('--subject') as 'physics' | 'chemistry' | 'biology' | 'mathematics' | null;
  const classNum = parseInt(getArg('--class') || '12') as 11 | 12;
  const chapter = getArg('--chapter');
  const scrapeAll = hasFlag('--all');

  // Validate
  if (!subject || !['physics', 'chemistry', 'biology', 'mathematics'].includes(subject)) {
    console.error('❌ Invalid or missing --subject (physics|chemistry|biology|mathematics)');
    process.exit(1);
  }

  if (![11, 12].includes(classNum)) {
    console.error('❌ Invalid --class (must be 11 or 12)');
    process.exit(1);
  }

  // Scrape all chapters
  if (scrapeAll) {
    await scrapeAllChapters(subject, classNum);
    return;
  }

  // Scrape single chapter
  if (!chapter) {
    console.error('❌ Missing --chapter (or use --all to scrape all chapters)');
    process.exit(1);
  }

  const chapterNum = parseInt(chapter);
  if (isNaN(chapterNum) || chapterNum < 1 || chapterNum > 20) {
    console.error('❌ Invalid chapter number');
    process.exit(1);
  }

  await scrapeSingleChapter(subject, classNum, chapterNum);
}

async function scrapeSingleChapter(
  subject: 'physics' | 'chemistry' | 'biology' | 'mathematics',
  classNum: 11 | 12,
  chapterNum: number
) {
  console.log(`📚 Scraping: ${subject.toUpperCase()} Class ${classNum} - Chapter ${chapterNum}\n`);

  const result = await processNCERTChapter(subject, classNum, chapterNum);

  if (result.success) {
    console.log(`✅ Success! Extracted ${result.questionsExtracted} questions`);
  } else {
    console.error(`❌ Failed: ${result.error}`);
    process.exit(1);
  }
}

async function scrapeAllChapters(
  subject: 'physics' | 'chemistry' | 'biology' | 'mathematics',
  classNum: 11 | 12
) {
  const maxChapters: Record<string, number> = {
    physics: 15,
    chemistry: 16,
    biology: 15,
    mathematics: 13,
  };

  const total = maxChapters[subject];
  console.log(`📚 Scraping ALL ${total} chapters of ${subject.toUpperCase()} Class ${classNum}\n`);

  let totalQuestions = 0;
  let successCount = 0;
  const failed: number[] = [];

  for (let ch = 1; ch <= total; ch++) {
    console.log(`\n[${ch}/${total}] Processing Chapter ${ch}...`);

    const result = await processNCERTChapter(subject, classNum, ch);

    if (result.success) {
      console.log(`   ✅ Extracted ${result.questionsExtracted} questions`);
      totalQuestions += result.questionsExtracted;
      successCount++;
    } else {
      console.log(`   ❌ Failed: ${result.error}`);
      failed.push(ch);
    }

    // Rate limiting - wait 3 seconds between chapters
    if (ch < total) {
      console.log('   ⏳ Waiting 3 seconds...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`📊 SUMMARY`);
  console.log('='.repeat(60));
  console.log(`Total chapters processed: ${total}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${failed.length} ${failed.length > 0 ? `(Chapters: ${failed.join(', ')})` : ''}`);
  console.log(`Total questions extracted: ${totalQuestions}`);
  console.log('='.repeat(60));
}

async function testExtraction() {
  const { extractQuestionsWithAI } = await import('../src/lib/scrapers/ai-pdf-scraper');

  const sampleText = `
    Multiple Choice Questions

    1.1 Which of the following is a vector quantity?
    (a) Speed
    (b) Distance
    (c) Velocity
    (d) Time

    Answer: (c) Velocity has both magnitude and direction, making it a vector quantity.

    1.2 The SI unit of force is:
    (a) Joule
    (b) Watt
    (c) Newton
    (d) Pascal

    Answer: (c) Newton (N) is the SI unit of force, defined as kg⋅m/s².

    1.3 Newton's second law states that F = ma. If mass is doubled and acceleration remains constant, force will:
    (a) Remain same
    (b) Become half
    (c) Become double
    (d) Become four times

    Answer: (c) Since F is directly proportional to m, doubling mass doubles the force.
  `;

  console.log('📝 Sample text provided\n');
  console.log('🤖 Extracting questions using AI...\n');

  const questions = await extractQuestionsWithAI(sampleText, 'physics', 'Test Chapter', 12);

  console.log(`✅ Extracted ${questions.length} questions:\n`);

  questions.forEach((q, i) => {
    console.log(`${i + 1}. ${q.question}`);
    console.log(`   Answer: ${String.fromCharCode(65 + q.correctAnswer)}`);
    console.log(`   Explanation: ${q.explanation.slice(0, 80)}...`);
    console.log(`   Difficulty: ${q.difficulty}`);
    console.log('');
  });
}

// Run the CLI
main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
