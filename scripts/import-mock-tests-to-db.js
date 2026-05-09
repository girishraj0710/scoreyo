#!/usr/bin/env node

/**
 * Import Mock Test Questions Directly to Database
 * Bypasses cache, directly populates cached_questions table
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@libsql/client');

const mockTestsDir = path.join(__dirname, '..', '.agents', 'artifacts', 'complete-mock-tests');

console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║  PrepGenie - Import Mock Test Questions to Database         ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
}

// Verify database credentials
if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
  console.error('❌ Database credentials missing!');
  console.error('   Required in .env.local:');
  console.error('   - TURSO_DATABASE_URL');
  console.error('   - TURSO_AUTH_TOKEN\n');
  process.exit(1);
}

// Connect to database
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Parse CSV line handling quoted strings
function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current);

  return values;
}

// Parse CSV file
function parseCSV(content) {
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]).map(h => h.trim());
  const questions = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length !== headers.length) continue;

    const question = {};
    headers.forEach((header, index) => {
      question[header] = values[index].trim();
    });
    questions.push(question);
  }

  return questions;
}

// Main import function
async function importQuestions() {
  const files = fs.readdirSync(mockTestsDir).filter(f => f.endsWith('.csv'));

  if (files.length === 0) {
    console.error('❌ No CSV files found!');
    process.exit(1);
  }

  console.log(`📁 Found ${files.length} CSV files\n`);

  let totalImported = 0;
  let totalSkipped = 0;
  const startTime = Date.now();

  for (let fileIdx = 0; fileIdx < files.length; fileIdx++) {
    const file = files[fileIdx];
    const filepath = path.join(mockTestsDir, file);
    const examId = file.replace('-complete-mock-tests.csv', '');

    console.log(`\n[${fileIdx + 1}/${files.length}] Processing ${examId}...`);

    try {
      const content = fs.readFileSync(filepath, 'utf8');
      const questions = parseCSV(content);

      if (questions.length === 0) {
        console.log(`   ⚠️  No questions found in file`);
        continue;
      }

      console.log(`   📊 Found ${questions.length} questions`);

      // Check existing questions for this exam
      const existing = await db.execute({
        sql: 'SELECT COUNT(*) as count FROM cached_questions WHERE exam_id = ?',
        args: [examId]
      });

      const existingCount = existing.rows[0].count;
      console.log(`   💾 Already in DB: ${existingCount} questions`);

      // Prepare batch insert
      const statements = [];
      let imported = 0;
      let skipped = 0;

      for (const q of questions) {
        // Validate required fields
        if (!q.question || !q.option_a || !q.option_b || !q.option_c || !q.option_d) {
          skipped++;
          continue;
        }

        const correctAnswer = parseInt(q.correct_answer);
        if (isNaN(correctAnswer) || correctAnswer < 0 || correctAnswer > 3) {
          skipped++;
          continue;
        }

        // Build question JSON
        const questionJson = {
          question: q.question,
          options: [q.option_a, q.option_b, q.option_c, q.option_d],
          correctAnswer: correctAnswer,
          explanation: q.explanation || 'Explanation not available.',
          difficulty: q.difficulty?.toLowerCase() || 'medium'
        };

        statements.push({
          sql: `INSERT INTO cached_questions (exam_id, subject_id, topic, difficulty, question_json)
                VALUES (?, ?, ?, ?, ?)`,
          args: [
            examId,
            q.subject_id || 'general',
            q.topic || 'General',
            questionJson.difficulty,
            JSON.stringify(questionJson)
          ]
        });

        imported++;
      }

      // Execute batch insert
      if (statements.length > 0) {
        console.log(`   🔄 Importing ${statements.length} questions...`);

        // Insert in batches of 100 to avoid timeout
        const batchSize = 100;
        for (let i = 0; i < statements.length; i += batchSize) {
          const batch = statements.slice(i, i + batchSize);
          await db.batch(batch, 'write');
          process.stdout.write(`\r   📥 Progress: ${Math.min(i + batchSize, statements.length)}/${statements.length}`);
        }

        console.log(`\n   ✅ Imported ${imported} questions`);
        totalImported += imported;
      }

      if (skipped > 0) {
        console.log(`   ⚠️  Skipped ${skipped} invalid questions`);
        totalSkipped += skipped;
      }

    } catch (error) {
      console.error(`   ❌ Failed to import ${file}`);
      console.error(`   Error: ${error.message}`);
    }
  }

  const duration = Math.round((Date.now() - startTime) / 1000);

  console.log('\n\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║  ✅ IMPORT COMPLETE!                                         ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  console.log(`📊 Summary:`);
  console.log(`   ✅ Files processed: ${files.length}`);
  console.log(`   ✅ Questions imported: ${totalImported.toLocaleString()}`);
  console.log(`   ⚠️  Questions skipped: ${totalSkipped}`);
  console.log(`   ⏱️  Time taken: ${Math.floor(duration / 60)}m ${duration % 60}s\n`);

  // Get total count in database
  const total = await db.execute('SELECT COUNT(*) as count FROM cached_questions');
  console.log(`💾 Total questions in database: ${total.rows[0].count.toLocaleString()}\n`);

  console.log(`🎉 All mock test questions are now in your database!`);
  console.log(`\n📦 Next steps:`);
  console.log(`   1. Test mock tests: /mock-test`);
  console.log(`   2. Verify questions display correctly`);
  console.log(`   3. Push to production: git push origin main\n`);
}

// Run
importQuestions()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('\n❌ Unexpected error:', err);
    process.exit(1);
  });
