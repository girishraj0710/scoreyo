#!/usr/bin/env tsx
/**
 * OpenStax Textbooks Scraper
 *
 * OpenStax books are Creative Commons licensed (CC BY 4.0)
 * Free to use with attribution
 *
 * Available books:
 * - Physics (College Physics, University Physics)
 * - Chemistry (Chemistry 2e)
 * - Biology (Biology 2e)
 * - Mathematics (Calculus)
 *
 * Usage:
 *   npm run scrape-openstax -- --book physics
 *   npm run scrape-openstax -- --book chemistry
 *   npm run scrape-openstax -- --all
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { fetchPDF } from '../src/lib/scrapers/pdf-fetcher';
import { extractQuestionsWithAI } from '../src/lib/scrapers/ai-pdf-scraper';
import { saveScrapedQuestions } from '../src/lib/scrapers/ncert-scraper';

// Load environment variables
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

// OpenStax Book URLs (CC BY 4.0 licensed, free to use)
const OPENSTAX_BOOKS = {
  physics: {
    url: 'https://assets.openstax.org/oscms-prodcms/media/documents/CollegePhysics2e-WEB.pdf',
    name: 'College Physics 2e',
    chapters: 34,
  },
  chemistry: {
    url: 'https://assets.openstax.org/oscms-prodcms/media/documents/Chemistry2e-WEB.pdf',
    name: 'Chemistry 2e',
    chapters: 21,
  },
  biology: {
    url: 'https://assets.openstax.org/oscms-prodcms/media/documents/Biology2e-WEB.pdf',
    name: 'Biology 2e',
    chapters: 47,
  },
  calculus: {
    url: 'https://assets.openstax.org/oscms-prodcms/media/documents/CalculusVolume1-WEB.pdf',
    name: 'Calculus Volume 1',
    chapters: 6,
  },
};

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const { PDFParse } = require('pdf-parse');
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    return result.text;
  } catch (error) {
    console.error('PDF parsing error:', error);
    return '';
  }
}

async function scrapeOpenStaxBook(
  bookKey: keyof typeof OPENSTAX_BOOKS
) {
  const book = OPENSTAX_BOOKS[bookKey];
  console.log(`\n📚 Scraping: ${book.name}`);
  console.log(`📥 Fetching: ${book.url}`);

  try {
    // Download the full book PDF (these are large!)
    const buffer = await fetchPDF(book.url);
    console.log(`   ✅ Downloaded ${(buffer.length / 1024 / 1024).toFixed(1)} MB`);

    // Extract text
    console.log(`   📄 Extracting text... (this may take a minute)`);
    const pdfText = await extractTextFromPDF(buffer);
    console.log(`   ✅ Extracted ${(pdfText.length / 1000).toFixed(0)}k characters`);

    if (!pdfText || pdfText.length < 1000) {
      return { success: false, questionsExtracted: 0, error: 'Empty PDF' };
    }

    // OpenStax books have "Conceptual Questions" and "Problems" at end of each chapter
    // We'll extract these sections
    console.log(`   🔍 Looking for end-of-chapter questions...`);

    // Split by chapters or process in chunks due to size
    const chunkSize = 50000; // Process 50k characters at a time
    const chunks: string[] = [];

    for (let i = 0; i < pdfText.length; i += chunkSize) {
      chunks.push(pdfText.slice(i, i + chunkSize));
    }

    console.log(`   📦 Processing in ${chunks.length} chunks...`);

    let allQuestions: any[] = [];

    for (let i = 0; i < chunks.length; i++) {
      console.log(`   🤖 Analyzing chunk ${i + 1}/${chunks.length}...`);

      const questions = await extractQuestionsWithAI(
        chunks[i],
        bookKey === 'calculus' ? 'mathematics' : bookKey,
        `${book.name}`,
        12
      );

      // Update source and license info
      questions.forEach(q => {
        q.source = `OpenStax ${book.name} (CC BY 4.0)`;
        q.examRelevance = bookKey === 'biology' ? ['NEET'] : ['JEE', 'NEET'];
      });

      allQuestions = allQuestions.concat(questions);
      console.log(`      Found ${questions.length} questions (total so far: ${allQuestions.length})`);

      // Rate limiting between AI calls
      if (i < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    console.log(`   ✅ Total MCQs found: ${allQuestions.length}`);

    if (allQuestions.length === 0) {
      return { success: true, questionsExtracted: 0, error: 'No MCQs found' };
    }

    // Save to database
    console.log(`   💾 Saving to database...`);
    const saved = await saveScrapedQuestions(allQuestions);
    console.log(`   ✅ Saved ${saved}/${allQuestions.length} questions`);

    return { success: true, questionsExtracted: saved };
  } catch (error: any) {
    console.log(`   ❌ Error: ${error.message}`);
    return { success: false, questionsExtracted: 0, error: error.message };
  }
}

async function main() {
  const args = process.argv.slice(2);
  const getArg = (flag: string) => {
    const index = args.indexOf(flag);
    return index !== -1 ? args[index + 1] : null;
  };
  const hasFlag = (flag: string) => args.includes(flag);

  console.log('🎓 OpenStax Textbooks Scraper');
  console.log('📜 License: CC BY 4.0 (Free to use with attribution)\n');

  const book = getArg('--book') as keyof typeof OPENSTAX_BOOKS | null;
  const scrapeAll = hasFlag('--all');

  if (!scrapeAll && (!book || !(book in OPENSTAX_BOOKS))) {
    console.error('❌ Invalid or missing --book');
    console.log('\nAvailable books:');
    Object.entries(OPENSTAX_BOOKS).forEach(([key, info]) => {
      console.log(`  - ${key}: ${info.name} (${info.chapters} chapters)`);
    });
    console.log('\nUsage:');
    console.log('  npm run scrape-openstax -- --book physics');
    console.log('  npm run scrape-openstax -- --book chemistry');
    console.log('  npm run scrape-openstax -- --all');
    process.exit(1);
  }

  console.log('='.repeat(60));

  const booksToScrape = scrapeAll
    ? (Object.keys(OPENSTAX_BOOKS) as (keyof typeof OPENSTAX_BOOKS)[])
    : [book!];

  let totalExtracted = 0;

  for (const bookKey of booksToScrape) {
    const result = await scrapeOpenStaxBook(bookKey);

    if (result.success) {
      totalExtracted += result.questionsExtracted;
    }

    // Rate limiting between books
    if (booksToScrape.length > 1) {
      console.log('\n   ⏳ Waiting 5 seconds before next book...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`Books processed: ${booksToScrape.length}`);
  console.log(`Questions extracted: ${totalExtracted}`);
  console.log('='.repeat(60));
  console.log('\n📜 Attribution: Content from OpenStax, CC BY 4.0');
  console.log('    https://openstax.org/');
  console.log('='.repeat(60) + '\n');
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
