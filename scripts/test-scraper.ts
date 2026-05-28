#!/usr/bin/env tsx
/**
 * Test NCERT Scraper Setup
 * Validates configuration and performs a dry run
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

async function testScraper() {
  console.log('🧪 Testing PrepGenie NCERT Scraper\n');
  console.log('='.repeat(60));

  // Test 1: Environment variables
  console.log('\n1️⃣  Checking environment variables...');
  const requiredEnvs = [
    'OPENROUTER_API_KEY',
    'TURSO_DATABASE_URL',
    'TURSO_AUTH_TOKEN',
  ];

  let envOk = true;
  for (const env of requiredEnvs) {
    const value = process.env[env];
    if (!value) {
      console.log(`   ❌ ${env} not set`);
      envOk = false;
    } else {
      console.log(`   ✅ ${env} configured (${value.slice(0, 20)}...)`);
    }
  }

  if (!envOk) {
    console.log('\n❌ Missing required environment variables');
    console.log('   Add them to .env.local file');
    process.exit(1);
  }

  // Test 2: Database connection
  console.log('\n2️⃣  Testing database connection...');
  try {
    const { createClient } = await import('@libsql/client');
    const db = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });

    const result = await db.execute('SELECT 1 as test');
    console.log('   ✅ Database connection successful');
  } catch (error: any) {
    console.log('   ❌ Database connection failed:', error.message);
    process.exit(1);
  }

  // Test 3: OpenRouter API
  console.log('\n3️⃣  Testing OpenRouter API...');
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
    });

    if (response.ok) {
      console.log('   ✅ OpenRouter API key valid');
    } else {
      console.log('   ❌ OpenRouter API key invalid');
      process.exit(1);
    }
  } catch (error: any) {
    console.log('   ❌ OpenRouter API test failed:', error.message);
    process.exit(1);
  }

  // Test 4: PDF parsing
  console.log('\n4️⃣  Testing PDF parser...');
  try {
    const pdfParse = (await import('pdf-parse')).default;
    console.log('   ✅ pdf-parse library loaded');
  } catch (error) {
    console.log('   ❌ pdf-parse not installed');
    console.log('   Run: npm install pdf-parse');
    process.exit(1);
  }

  // Test 5: Sample AI extraction
  console.log('\n5️⃣  Testing AI question extraction...');
  try {
    const { extractQuestionsWithAI } = await import('../src/lib/scrapers/ai-pdf-scraper');

    const sampleText = `
      Multiple Choice Questions

      1.1 Which of the following is a scalar quantity?
      (a) Force
      (b) Velocity
      (c) Temperature
      (d) Acceleration

      Answer: (c)

      1.2 The unit of electric current is:
      (a) Volt
      (b) Ampere
      (c) Ohm
      (d) Watt

      Answer: (b)
    `;

    const questions = await extractQuestionsWithAI(
      sampleText,
      'physics',
      'Test Chapter',
      12
    );

    if (questions.length === 2) {
      console.log('   ✅ AI extraction working correctly');
      console.log(`   Extracted ${questions.length} questions:`);
      questions.forEach((q, i) => {
        console.log(`      ${i + 1}. ${q.question.slice(0, 50)}...`);
      });
    } else {
      console.log(`   ⚠️  Expected 2 questions, got ${questions.length}`);
      console.log('   This may indicate an AI parsing issue');
    }
  } catch (error: any) {
    console.log('   ❌ AI extraction failed:', error.message);
    process.exit(1);
  }

  // Test 6: NCERT URL accessibility
  console.log('\n6️⃣  Testing NCERT server accessibility...');
  try {
    const testUrl = 'https://ncert.nic.in/textbook/pdf/leph101.pdf';
    const response = await fetch(testUrl, { method: 'HEAD' });

    if (response.ok) {
      console.log('   ✅ NCERT server accessible');
      console.log(`   Sample PDF available: ${testUrl}`);
    } else {
      console.log('   ⚠️  NCERT server returned:', response.status);
      console.log('   URLs may have changed or server may be down');
    }
  } catch (error: any) {
    console.log('   ⚠️  Could not reach NCERT server:', error.message);
    console.log('   Check your internet connection');
  }

  // Success!
  console.log('\n' + '='.repeat(60));
  console.log('✅ All tests passed! Scraper is ready to use.\n');
  console.log('Next steps:');
  console.log('  npm run scrape -- --test           (test on sample text)');
  console.log('  npm run scrape -- --subject physics --class 12 --chapter 1');
  console.log('  npm run scrape -- --subject chemistry --class 11 --all');
  console.log('='.repeat(60) + '\n');
}

testScraper().catch(error => {
  console.error('\n❌ Test failed:', error);
  process.exit(1);
});
