#!/usr/bin/env tsx
/**
 * OpenStax Manual Download Helper
 *
 * OpenStax blocks direct PDF downloads (403 Forbidden).
 * This script provides instructions and automates the process after manual download.
 *
 * Usage:
 *   1. Run this script to get download links
 *   2. Download PDFs manually from OpenStax website
 *   3. Place in openstax/ folder
 *   4. Run again to process
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { resolve, join } from 'path';
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

const OPENSTAX_BOOKS = {
  physics: {
    downloadUrl: 'https://openstax.org/details/books/college-physics-2e',
    fileName: 'CollegePhysics2e.pdf',
    name: 'College Physics 2e',
  },
  chemistry: {
    downloadUrl: 'https://openstax.org/details/books/chemistry-2e',
    fileName: 'Chemistry2e.pdf',
    name: 'Chemistry 2e',
  },
  biology: {
    downloadUrl: 'https://openstax.org/details/books/biology-2e',
    fileName: 'Biology2e.pdf',
    name: 'Biology 2e',
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

async function processOpenStaxPDF(
  bookKey: keyof typeof OPENSTAX_BOOKS,
  pdfPath: string
) {
  const book = OPENSTAX_BOOKS[bookKey];
  console.log(`\n📚 Processing: ${book.name}`);
  console.log(`📄 File: ${pdfPath}`);

  try {
    // Read PDF
    const pdfBuffer = readFileSync(pdfPath);
    console.log(`   ✅ Loaded ${(pdfBuffer.length / 1024 / 1024).toFixed(1)} MB`);

    // Extract text
    console.log(`   📄 Extracting text... (this may take a minute)`);
    const pdfText = await extractTextFromPDF(pdfBuffer);
    console.log(`   ✅ Extracted ${(pdfText.length / 1000).toFixed(0)}k characters`);

    if (!pdfText || pdfText.length < 1000) {
      return { success: false, questionsExtracted: 0, error: 'Empty PDF' };
    }

    // Process in chunks
    const chunkSize = 50000;
    const chunks: string[] = [];

    for (let i = 0; i < pdfText.length; i += chunkSize) {
      chunks.push(pdfText.slice(i, i + chunkSize));
    }

    console.log(`   📦 Processing in ${chunks.length} chunks...`);

    let allQuestions: any[] = [];
    const maxChunks = Math.min(chunks.length, 10); // Limit to first 10 chunks for testing

    for (let i = 0; i < maxChunks; i++) {
      console.log(`   🤖 Analyzing chunk ${i + 1}/${maxChunks}...`);

      const questions = await extractQuestionsWithAI(
        chunks[i],
        bookKey === 'physics' ? 'physics' : bookKey === 'chemistry' ? 'chemistry' : 'biology',
        `${book.name}`,
        12
      );

      questions.forEach(q => {
        q.source = `OpenStax ${book.name} (CC BY 4.0)`;
        q.examRelevance = bookKey === 'biology' ? ['NEET'] : ['JEE', 'NEET'];
      });

      allQuestions = allQuestions.concat(questions);
      console.log(`      Found ${questions.length} questions (total: ${allQuestions.length})`);

      // Rate limiting
      if (i < maxChunks - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    console.log(`   ✅ Total MCQs found: ${allQuestions.length}`);

    if (allQuestions.length > 0) {
      console.log(`   💾 Saving to database...`);
      const saved = await saveScrapedQuestions(allQuestions);
      console.log(`   ✅ Saved ${saved}/${allQuestions.length} questions`);
      return { success: true, questionsExtracted: saved };
    }

    return { success: true, questionsExtracted: 0, error: 'No MCQs found' };
  } catch (error: any) {
    console.log(`   ❌ Error: ${error.message}`);
    return { success: false, questionsExtracted: 0, error: error.message };
  }
}

async function main() {
  console.log('🎓 OpenStax Manual Download Helper\n');
  console.log('='.repeat(60));

  const openStaxDir = resolve(process.cwd(), 'openstax');

  // Check if directory exists
  if (!existsSync(openStaxDir)) {
    console.log('\n📥 STEP 1: Download OpenStax PDFs');
    console.log('='.repeat(60));
    console.log('\nOpenStax blocks direct downloads. Please download manually:\n');

    Object.entries(OPENSTAX_BOOKS).forEach(([key, book]) => {
      console.log(`📚 ${book.name}:`);
      console.log(`   1. Visit: ${book.downloadUrl}`);
      console.log(`   2. Click "Download a PDF"`);
      console.log(`   3. Save as: openstax/${book.fileName}\n`);
    });

    console.log('Then create folder and place PDFs:');
    console.log(`   mkdir -p openstax/`);
    console.log(`   # Move downloaded PDFs to openstax/ folder\n`);
    console.log('After downloading, run this script again to process.');
    console.log('='.repeat(60) + '\n');
    return;
  }

  // Check for PDFs
  const files = readdirSync(openStaxDir).filter(f => f.endsWith('.pdf'));

  if (files.length === 0) {
    console.log('\n⚠️  No PDFs found in openstax/ directory\n');
    console.log('Download PDFs from these links:\n');

    Object.entries(OPENSTAX_BOOKS).forEach(([key, book]) => {
      console.log(`📚 ${book.name}: ${book.downloadUrl}`);
    });

    console.log('\nSave them in: openstax/ folder');
    console.log('='.repeat(60) + '\n');
    return;
  }

  // Process PDFs
  console.log(`\n✅ Found ${files.length} PDF(s) to process\n`);

  let totalExtracted = 0;

  for (const file of files) {
    const filePath = join(openStaxDir, file);

    // Determine book type from filename
    let bookKey: keyof typeof OPENSTAX_BOOKS | null = null;
    if (file.toLowerCase().includes('physics')) bookKey = 'physics';
    else if (file.toLowerCase().includes('chemistry')) bookKey = 'chemistry';
    else if (file.toLowerCase().includes('biology')) bookKey = 'biology';

    if (!bookKey) {
      console.log(`⚠️  Skipping ${file} (unknown book type)`);
      continue;
    }

    const result = await processOpenStaxPDF(bookKey, filePath);
    if (result.success) {
      totalExtracted += result.questionsExtracted;
    }

    // Rate limiting between books
    if (files.indexOf(file) < files.length - 1) {
      console.log('\n   ⏳ Waiting 5 seconds before next book...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`PDFs processed: ${files.length}`);
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
