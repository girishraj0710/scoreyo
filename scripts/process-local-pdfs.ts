#!/usr/bin/env tsx
/**
 * Process Locally Downloaded NCERT Exemplar PDFs
 *
 * Usage:
 *   1. Download NCERT Exemplar PDFs from https://ncert.nic.in
 *   2. Place them in: ncert-exemplar/physics/, ncert-exemplar/chemistry/, etc.
 *   3. Run: npm run process-local-pdfs
 *
 * File naming convention:
 *   physics-12-01.pdf  (Class 12 Physics Chapter 1)
 *   chemistry-11-05.pdf (Class 11 Chemistry Chapter 5)
 */

import { readFileSync, readdirSync } from 'fs';
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

async function processLocalPDF(
  filePath: string,
  subject: string,
  classNum: number,
  chapterNum: number
) {
  console.log(`\n📄 Processing: ${filePath}`);

  try {
    // Read PDF file
    const pdfBuffer = readFileSync(filePath);
    console.log(`   ✅ Loaded ${(pdfBuffer.length / 1024).toFixed(0)} KB`);

    // Extract text
    const pdfText = await extractTextFromPDF(pdfBuffer);
    console.log(`   📄 Extracted ${pdfText.length} characters`);

    if (!pdfText || pdfText.length < 100) {
      console.log('   ⚠️  PDF is empty or too short');
      return { success: false, questionsExtracted: 0 };
    }

    // Extract questions using AI
    console.log(`   🤖 Analyzing with AI...`);
    const questions = await extractQuestionsWithAI(
      pdfText,
      subject,
      `Chapter ${chapterNum}`,
      classNum
    );

    console.log(`   ✅ AI found ${questions.length} MCQs`);

    if (questions.length === 0) {
      return { success: true, questionsExtracted: 0 };
    }

    // Save to database
    const saved = await saveScrapedQuestions(questions);
    console.log(`   💾 Saved ${saved}/${questions.length} to database`);

    return { success: true, questionsExtracted: saved };
  } catch (error: any) {
    console.log(`   ❌ Error: ${error.message}`);
    return { success: false, questionsExtracted: 0 };
  }
}

async function main() {
  console.log('🎓 NCERT Exemplar Local PDF Processor\n');
  console.log('='.repeat(60));

  const baseDir = resolve(process.cwd(), 'ncert-exemplar');
  const subjects = ['physics', 'chemistry', 'biology', 'mathematics'];

  let totalProcessed = 0;
  let totalExtracted = 0;

  for (const subject of subjects) {
    const subjectDir = join(baseDir, subject);

    try {
      const files = readdirSync(subjectDir).filter(f => f.endsWith('.pdf'));

      if (files.length === 0) {
        console.log(`\n📁 ${subject}: No PDFs found in ${subjectDir}`);
        continue;
      }

      console.log(`\n📚 Processing ${files.length} ${subject} files...`);

      for (const file of files) {
        // Parse filename: physics-12-01.pdf → Class 12, Chapter 1
        const match = file.match(/(\w+)-(\d+)-(\d+)\.pdf/);
        if (!match) {
          console.log(`   ⚠️  Skipping ${file} (invalid filename format)`);
          continue;
        }

        const [, , classNum, chapterNum] = match;
        const filePath = join(subjectDir, file);

        const result = await processLocalPDF(
          filePath,
          subject,
          parseInt(classNum),
          parseInt(chapterNum)
        );

        if (result.success) {
          totalProcessed++;
          totalExtracted += result.questionsExtracted;
        }

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.log(`   ⚠️  Directory not found: ${subjectDir}`);
      console.log(`      Create it and add PDFs: mkdir -p ${subjectDir}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`Files processed: ${totalProcessed}`);
  console.log(`Questions extracted: ${totalExtracted}`);
  console.log('='.repeat(60) + '\n');
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
