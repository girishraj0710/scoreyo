#!/usr/bin/env tsx
/**
 * Load English Questions into Supabase
 *
 * Usage:
 *   npx tsx scripts/load-english-questions.ts
 *
 * This script:
 * 1. Reads all JSON question files from content-generated/questions/
 * 2. Validates question structure
 * 3. Inserts into english_questions table in Supabase
 * 4. Reports success/failure statistics
 */

// Load environment variables from .env.local
import './load-env';

import { getPool } from '../src/lib/db';
import { readFile, readdir } from 'fs/promises';
import { join } from 'path';

interface EnglishQuestion {
  path_id: string;
  topic_id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  difficulty: string;
  level: string;
  passage?: string; // Optional for comprehension questions
}

const QUESTIONS_DIR = 'content-generated/questions';

async function validateQuestion(q: any, index: number): Promise<string | null> {
  if (!q.path_id) return `Question ${index}: Missing path_id`;
  if (!q.topic_id) return `Question ${index}: Missing topic_id`;
  if (!q.question) return `Question ${index}: Missing question text`;
  if (!Array.isArray(q.options) || q.options.length !== 4) {
    return `Question ${index}: Must have exactly 4 options`;
  }
  if (typeof q.correct_answer !== 'number' || q.correct_answer < 0 || q.correct_answer > 3) {
    return `Question ${index}: correct_answer must be 0-3`;
  }
  if (!q.explanation) return `Question ${index}: Missing explanation`;
  if (!q.difficulty || !['easy', 'medium', 'hard'].includes(q.difficulty)) {
    return `Question ${index}: Invalid difficulty (must be easy/medium/hard)`;
  }
  if (!q.level || !['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(q.level)) {
    return `Question ${index}: Invalid CEFR level`;
  }
  return null;
}

async function loadQuestionsFromFile(filePath: string): Promise<{
  questions: EnglishQuestion[];
  errors: string[];
}> {
  console.log(`\n📖 Reading: ${filePath}`);

  try {
    const content = await readFile(filePath, 'utf-8');
    const questions = JSON.parse(content);

    if (!Array.isArray(questions)) {
      return { questions: [], errors: ['File does not contain a JSON array'] };
    }

    const errors: string[] = [];
    const validQuestions: EnglishQuestion[] = [];

    for (let i = 0; i < questions.length; i++) {
      const error = await validateQuestion(questions[i], i + 1);
      if (error) {
        errors.push(error);
      } else {
        validQuestions.push(questions[i]);
      }
    }

    console.log(`   ✅ Valid questions: ${validQuestions.length}`);
    if (errors.length > 0) {
      console.log(`   ⚠️  Validation errors: ${errors.length}`);
    }

    return { questions: validQuestions, errors };
  } catch (err: any) {
    return { questions: [], errors: [`Failed to read/parse file: ${err.message}`] };
  }
}

async function insertQuestions(questions: EnglishQuestion[]): Promise<{
  inserted: number;
  duplicates: number;
  errors: string[];
}> {
  const pool = getPool();
  let inserted = 0;
  let duplicates = 0;
  const errors: string[] = [];

  for (const q of questions) {
    try {
      // Check for duplicate (same question text)
      const checkResult = await pool.query(
        'SELECT id FROM english_questions WHERE question = $1 LIMIT 1',
        [q.question]
      );

      if (checkResult.rows.length > 0) {
        duplicates++;
        continue; // Skip duplicate
      }

      // Insert question
      const insertSQL = q.passage
        ? `INSERT INTO english_questions
           (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty, passage, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`
        : `INSERT INTO english_questions
           (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`;

      const params = q.passage
        ? [
            q.path_id,
            q.topic_id,
            q.level,
            q.question,
            JSON.stringify(q.options),
            q.correct_answer,
            q.explanation,
            q.difficulty,
            q.passage
          ]
        : [
            q.path_id,
            q.topic_id,
            q.level,
            q.question,
            JSON.stringify(q.options),
            q.correct_answer,
            q.explanation,
            q.difficulty
          ];

      await pool.query(insertSQL, params);
      inserted++;

      if (inserted % 50 === 0) {
        console.log(`   Progress: ${inserted} questions inserted...`);
      }
    } catch (err: any) {
      errors.push(`Failed to insert question "${q.question.slice(0, 50)}...": ${err.message}`);
    }
  }

  return { inserted, duplicates, errors };
}

async function getQuestionCounts(pool: any): Promise<Map<string, number>> {
  const result = await pool.query(`
    SELECT topic_id, COUNT(*) as count
    FROM english_questions
    GROUP BY topic_id
    ORDER BY topic_id
  `);

  const counts = new Map<string, number>();
  for (const row of result.rows) {
    counts.set(row.topic_id, parseInt(row.count));
  }
  return counts;
}

async function main() {
  console.log('🚀 Loading English Questions into Supabase\n');
  console.log('=' .repeat(60));

  const pool = getPool();

  try {
    // Get counts before insertion
    console.log('\n📊 Current question counts in database:');
    const beforeCounts = await getQuestionCounts(pool);
    for (const [topic, count] of beforeCounts.entries()) {
      console.log(`   ${topic}: ${count} questions`);
    }

    // Read all JSON files from questions directory
    const files = await readdir(QUESTIONS_DIR);
    const jsonFiles = files.filter(f => f.endsWith('.json'));

    if (jsonFiles.length === 0) {
      console.log(`\n❌ No JSON files found in ${QUESTIONS_DIR}/`);
      process.exit(1);
    }

    console.log(`\n📁 Found ${jsonFiles.length} question files:`);
    jsonFiles.forEach(f => console.log(`   - ${f}`));

    // Load and validate all questions
    let totalQuestions = 0;
    let totalValidationErrors = 0;
    const allQuestions: EnglishQuestion[] = [];

    console.log('\n' + '='.repeat(60));
    console.log('VALIDATION PHASE');
    console.log('='.repeat(60));

    for (const file of jsonFiles) {
      const filePath = join(QUESTIONS_DIR, file);
      const { questions, errors } = await loadQuestionsFromFile(filePath);

      totalQuestions += questions.length;
      totalValidationErrors += errors.length;
      allQuestions.push(...questions);

      if (errors.length > 0) {
        console.log(`\n   ⚠️  Validation errors in ${file}:`);
        errors.slice(0, 5).forEach(err => console.log(`      - ${err}`));
        if (errors.length > 5) {
          console.log(`      ... and ${errors.length - 5} more errors`);
        }
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`✅ Validation complete: ${totalQuestions} valid questions`);
    if (totalValidationErrors > 0) {
      console.log(`⚠️  ${totalValidationErrors} validation errors found`);
    }

    // Confirm before insertion
    console.log('\n' + '='.repeat(60));
    console.log('INSERTION PHASE');
    console.log('='.repeat(60));
    console.log(`\nReady to insert ${totalQuestions} questions into Supabase.`);
    console.log('Press Ctrl+C to cancel, or wait 3 seconds to continue...\n');

    await new Promise(resolve => setTimeout(resolve, 3000));

    // Insert questions
    console.log('📥 Inserting questions...\n');
    const { inserted, duplicates, errors } = await insertQuestions(allQuestions);

    console.log('\n' + '='.repeat(60));
    console.log('RESULTS');
    console.log('='.repeat(60));
    console.log(`✅ Successfully inserted: ${inserted} questions`);
    if (duplicates > 0) {
      console.log(`⏭️  Skipped duplicates: ${duplicates} questions`);
    }
    if (errors.length > 0) {
      console.log(`❌ Insertion errors: ${errors.length}`);
      console.log('\nFirst 5 errors:');
      errors.slice(0, 5).forEach(err => console.log(`   - ${err}`));
    }

    // Get counts after insertion
    console.log('\n📊 Updated question counts in database:');
    const afterCounts = await getQuestionCounts(pool);
    for (const [topic, count] of afterCounts.entries()) {
      const before = beforeCounts.get(topic) || 0;
      const added = count - before;
      console.log(`   ${topic}: ${count} questions ${added > 0 ? `(+${added})` : ''}`);
    }

    // Total count
    const totalResult = await pool.query('SELECT COUNT(*) as total FROM english_questions');
    const totalInDb = parseInt(totalResult.rows[0].total);
    console.log(`\n📈 Total questions in database: ${totalInDb}`);

    console.log('\n✅ Load complete!');

  } catch (err: any) {
    console.error('\n❌ Fatal error:', err.message);
    console.error(err.stack);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
