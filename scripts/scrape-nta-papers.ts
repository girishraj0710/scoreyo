#!/usr/bin/env tsx
/**
 * NTA Previous Year Papers Scraper
 *
 * Scrapes official JEE Main and NEET previous year papers
 * These are public domain after the exam is conducted
 *
 * Usage:
 *   npm run scrape-nta -- --exam jee --year 2024
 *   npm run scrape-nta -- --exam neet --year 2023
 *   npm run scrape-nta -- --exam jee --all
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

// NTA Previous Year Paper URLs (these are publicly available)
// Note: URLs may change - verify at official NTA websites
const NTA_PAPER_URLS = {
  jee: {
    2024: [
      // JEE Main 2024 papers (to be added when available)
      // 'https://jeemain.nta.nic.in/...paper-2024.pdf'
    ],
    2023: [
      // JEE Main 2023 papers
      // Add actual URLs here
    ],
  },
  neet: {
    2024: [
      // NEET 2024 papers
    ],
    2023: [
      // NEET 2023 papers
    ],
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

async function scrapeNTAPaper(
  url: string,
  exam: string,
  year: number,
  paperNum: number
) {
  console.log(`\n📥 Fetching: ${url}`);

  try {
    // Download PDF
    const buffer = await fetchPDF(url);
    console.log(`   ✅ Downloaded ${(buffer.length / 1024).toFixed(0)} KB`);

    // Extract text
    const pdfText = await extractTextFromPDF(buffer);
    console.log(`   📄 Extracted ${pdfText.length} characters`);

    if (!pdfText || pdfText.length < 100) {
      return { success: false, questionsExtracted: 0, error: 'Empty PDF' };
    }

    // Determine subject from content (JEE has Physics, Chemistry, Math)
    let subject = exam === 'neet' ? 'biology' : 'physics';

    // Extract questions using AI
    console.log(`   🤖 Analyzing with AI...`);
    const questions = await extractQuestionsWithAI(
      pdfText,
      subject,
      `${exam.toUpperCase()} ${year} Paper ${paperNum}`,
      12 // All NTA papers are Class 11-12 level
    );

    // Update source to reflect exam paper
    questions.forEach(q => {
      q.source = `${exam.toUpperCase()} ${year} Previous Year Paper ${paperNum}`;
      q.examRelevance = exam === 'jee' ? ['JEE'] : ['NEET'];
    });

    console.log(`   ✅ AI found ${questions.length} MCQs`);

    if (questions.length === 0) {
      return { success: true, questionsExtracted: 0, error: 'No MCQs found' };
    }

    // Save to database
    const saved = await saveScrapedQuestions(questions);
    console.log(`   💾 Saved ${saved}/${questions.length} to database`);

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

  console.log('🎓 NTA Previous Year Papers Scraper\n');

  const exam = getArg('--exam') as 'jee' | 'neet' | null;
  const year = parseInt(getArg('--year') || '2024');
  const scrapeAll = hasFlag('--all');

  if (!exam || !['jee', 'neet'].includes(exam)) {
    console.error('❌ Invalid or missing --exam (jee|neet)');
    console.log('\nUsage:');
    console.log('  npm run scrape-nta -- --exam jee --year 2024');
    console.log('  npm run scrape-nta -- --exam neet --year 2023');
    console.log('  npm run scrape-nta -- --exam jee --all');
    process.exit(1);
  }

  console.log(`📚 Scraping ${exam.toUpperCase()} papers${scrapeAll ? ' (all years)' : ` for ${year}`}\n`);
  console.log('='.repeat(60));

  // Get paper URLs
  const paperUrls = scrapeAll
    ? Object.values(NTA_PAPER_URLS[exam]).flat()
    : NTA_PAPER_URLS[exam][year] || [];

  if (paperUrls.length === 0) {
    console.log(`\n⚠️  No paper URLs configured for ${exam.toUpperCase()} ${year}`);
    console.log('\nTo add papers:');
    console.log('1. Visit https://jeemain.nta.nic.in or https://neet.nta.nic.in');
    console.log('2. Find official previous year paper PDFs');
    console.log('3. Add URLs to NTA_PAPER_URLS in scripts/scrape-nta-papers.ts');
    console.log('\nExample URLs to add:');
    console.log('  - https://jeemain.nta.nic.in/webinfo2024/File/GetFile?FileId=XXX');
    console.log('  - https://neet.nta.nic.in/Downloads/YYYY/Paper.pdf');
    process.exit(0);
  }

  let totalExtracted = 0;

  for (let i = 0; i < paperUrls.length; i++) {
    const url = paperUrls[i];
    const result = await scrapeNTAPaper(url, exam, year, i + 1);

    if (result.success) {
      totalExtracted += result.questionsExtracted;
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`Papers processed: ${paperUrls.length}`);
  console.log(`Questions extracted: ${totalExtracted}`);
  console.log('='.repeat(60) + '\n');
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
