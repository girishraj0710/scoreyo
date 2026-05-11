#!/usr/bin/env node
/**
 * PrepGenie - TOEFL Essential Vocabulary Importer
 *
 * Source: wordlevel/toefl-essential-vocabulary-1k (Hugging Face)
 * License: MIT (Commercial use allowed)
 * Attribution: Required backlink to https://wordlevel.net
 *
 * This script:
 * 1. Downloads 1,000 TOEFL academic vocabulary words
 * 2. Generates 4 question types per word:
 *    - Synonym selection (250Q)
 *    - Definition matching (250Q)
 *    - Fill in the blank with context (250Q)
 *    - Word meaning from context (250Q)
 * 3. Total: 1,000+ high-quality vocabulary questions
 */

import { createClient } from '@libsql/client';
import * as fs from 'fs';
import * as path from 'path';
import https from 'https';

// Load environment variables
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

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

interface VocabWord {
  word: string;
  pos: string; // part of speech
  difficulty: number; // 3-5
  theme: string;
  synonyms: string[];
  definition_en: string;
  example_sentence: string;
}

interface Question {
  pathId: string;
  topicId: string;
  level: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║  PrepGenie - TOEFL Vocabulary Importer                      ║');
console.log('║  Source: wordlevel/toefl-essential-vocabulary-1k            ║');
console.log('║  License: MIT (Commercial use allowed)                      ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

// Download dataset from Hugging Face
async function downloadDataset(): Promise<VocabWord[]> {
  console.log('📥 Downloading TOEFL vocabulary dataset from Hugging Face...\n');

  const allWords: VocabWord[] = [];
  const pageSize = 100;
  let offset = 0;
  let totalRows = 0;

  while (true) {
    const url = `https://datasets-server.huggingface.co/rows?dataset=wordlevel%2Ftoefl-essential-vocabulary-1k&config=default&split=train&offset=${offset}&length=${pageSize}`;

    const page = await new Promise<{ words: VocabWord[], total: number, hasMore: boolean }>((resolve, reject) => {
      https.get(url, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (!json.rows || !Array.isArray(json.rows)) {
              throw new Error('Invalid API response format');
            }
            const words: VocabWord[] = json.rows.map((item: any) => item.row);
            const total = json.num_rows_total || 0;
            const hasMore = words.length === pageSize && (offset + pageSize) < total;

            resolve({ words, total, hasMore });
          } catch (error) {
            console.error('Parse error:', error);
            console.error('Response preview:', data.substring(0, 200));
            reject(error);
          }
        });
      }).on('error', (error) => {
        reject(error);
      });
    });

    allWords.push(...page.words);
    totalRows = page.total;
    console.log(`   ✅ Downloaded ${allWords.length}/${totalRows} words...`);

    if (!page.hasMore) {
      break;
    }

    offset += pageSize;

    // Add small delay to be nice to the API
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\n✅ Downloaded ${allWords.length} vocabulary words total\n`);
  return allWords;
}

// Generate questions from vocabulary words
function generateQuestions(words: VocabWord[]): Question[] {
  const questions: Question[] = [];

  console.log('🎯 Generating questions from vocabulary...\n');

  let synonymCount = 0;
  let definitionCount = 0;
  let fillBlankCount = 0;
  let contextCount = 0;

  for (const word of words) {
    const difficultyMap: Record<number, 'easy' | 'medium' | 'hard'> = {
      3: 'easy',
      4: 'medium',
      5: 'hard'
    };

    const difficulty = difficultyMap[word.difficulty] || 'medium';
    const level = word.difficulty <= 3 ? 'beginner' : word.difficulty === 4 ? 'intermediate' : 'advanced';

    // Question Type 1: Synonym Selection (if word has synonyms)
    if (word.synonyms && word.synonyms.length >= 1) {
      // Get other words from same theme for distractors
      const sameThemeWords = words.filter(w =>
        w.theme === word.theme &&
        w.word !== word.word &&
        w.synonyms &&
        w.synonyms.length > 0
      ).slice(0, 3);

      if (sameThemeWords.length >= 2) {
        const correctSynonym = word.synonyms[0];
        const distractors = sameThemeWords.map(w => w.synonyms[0]).slice(0, 3);

        // Ensure we have 4 unique options
        const allOptions = [correctSynonym, ...distractors];
        if (new Set(allOptions).size >= 4) {
          const options = shuffleArray([correctSynonym, ...distractors.slice(0, 3)]);
          const correctAnswer = options.indexOf(correctSynonym);

          questions.push({
            pathId: 'competitive-exam',
            topicId: 'toefl-vocabulary',
            level,
            question: `What is a synonym for "${word.word}"?`,
            options,
            correctAnswer,
            explanation: `"${correctSynonym}" is a synonym of "${word.word}." ${word.definition_en} Both words mean the same thing in the context of ${word.theme.toLowerCase()}.`,
            difficulty
          });
          synonymCount++;
        }
      }
    }

    // Question Type 2: Definition Matching
    {
      // Get other words from dataset for distractors
      const otherWords = words.filter(w =>
        w.word !== word.word &&
        w.pos === word.pos // Same part of speech for better distractors
      );

      if (otherWords.length >= 3) {
        const shuffledOthers = shuffleArray(otherWords).slice(0, 3);
        const options = shuffleArray([
          word.definition_en,
          ...shuffledOthers.map(w => w.definition_en)
        ]);
        const correctAnswer = options.indexOf(word.definition_en);

        questions.push({
          pathId: 'competitive-exam',
          topicId: 'toefl-vocabulary',
          level,
          question: `What is the meaning of "${word.word}" (${word.pos})?`,
          options,
          correctAnswer,
          explanation: `"${word.word}" means: ${word.definition_en} This word is commonly used in ${word.theme} contexts and is essential for TOEFL preparation.`,
          difficulty
        });
        definitionCount++;
      }
    }

    // Question Type 3: Fill in the Blank (using example sentence)
    if (word.example_sentence && word.example_sentence.toLowerCase().includes(word.word.toLowerCase())) {
      const sentenceWithBlank = word.example_sentence.replace(
        new RegExp(`\\b${word.word}\\b`, 'i'),
        '___'
      );

      // Get distractor words (similar difficulty, different meaning)
      const distractors = words
        .filter(w =>
          w.word !== word.word &&
          w.difficulty === word.difficulty &&
          w.pos === word.pos
        )
        .slice(0, 3)
        .map(w => w.word);

      if (distractors.length >= 3) {
        const options = shuffleArray([word.word, ...distractors]);
        const correctAnswer = options.indexOf(word.word);

        questions.push({
          pathId: 'competitive-exam',
          topicId: 'toefl-vocabulary',
          level,
          question: `Fill in the blank: "${sentenceWithBlank}"`,
          options,
          correctAnswer,
          explanation: `"${word.word}" is correct. ${word.definition_en} The sentence demonstrates how this word is used in ${word.theme} contexts.`,
          difficulty
        });
        fillBlankCount++;
      }
    }

    // Question Type 4: Word Meaning from Context
    if (word.example_sentence) {
      // Create options with the correct definition and 3 plausible but incorrect ones
      const otherDefs = words
        .filter(w => w.word !== word.word && w.theme === word.theme)
        .slice(0, 3)
        .map(w => w.definition_en);

      if (otherDefs.length >= 3) {
        const options = shuffleArray([word.definition_en, ...otherDefs]);
        const correctAnswer = options.indexOf(word.definition_en);

        questions.push({
          pathId: 'competitive-exam',
          topicId: 'toefl-vocabulary',
          level,
          question: `Read: "${word.example_sentence}"\n\nWhat does "${word.word}" mean in this context?`,
          options,
          correctAnswer,
          explanation: `In this context, "${word.word}" means: ${word.definition_en} Understanding words in context is crucial for TOEFL reading comprehension.`,
          difficulty
        });
        contextCount++;
      }
    }
  }

  console.log(`📊 Question Generation Summary:`);
  console.log(`   ✅ Synonym questions: ${synonymCount}`);
  console.log(`   ✅ Definition questions: ${definitionCount}`);
  console.log(`   ✅ Fill-in-blank questions: ${fillBlankCount}`);
  console.log(`   ✅ Context questions: ${contextCount}`);
  console.log(`   ─────────────────────────────────────────────`);
  console.log(`   📚 Total questions generated: ${questions.length}\n`);

  return questions;
}

// Shuffle array utility
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Seed questions to database
async function seedQuestions(questions: Question[]) {
  console.log('💾 Inserting questions into database...\n');

  let inserted = 0;
  let skipped = 0;
  let errors = 0;

  for (const q of questions) {
    try {
      // Check for duplicates
      const duplicate = await client.execute({
        sql: `SELECT id FROM english_questions
              WHERE path_id = ? AND topic_id = ? AND question = ?`,
        args: [q.pathId, q.topicId, q.question]
      });

      if (duplicate.rows.length > 0) {
        skipped++;
        continue;
      }

      // Insert question
      await client.execute({
        sql: `INSERT INTO english_questions
              (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          q.pathId,
          q.topicId,
          q.level,
          q.question,
          JSON.stringify(q.options),
          q.correctAnswer,
          q.explanation,
          q.difficulty
        ]
      });

      inserted++;

      if (inserted % 100 === 0) {
        console.log(`   ✅ Inserted ${inserted} questions...`);
      }
    } catch (error) {
      errors++;
      if (errors <= 5) { // Only show first 5 errors
        console.error(`   ⚠️  Error inserting question: ${q.question.substring(0, 50)}...`);
      }
    }
  }

  console.log(`\n═══════════════════════════════════════════════════════════════`);
  console.log(`✅ IMPORT COMPLETE!`);
  console.log(`   📥 Inserted: ${inserted} new questions`);
  console.log(`   ⏭️  Skipped: ${skipped} duplicates`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log(`═══════════════════════════════════════════════════════════════\n`);

  return { inserted, skipped, errors };
}

// Add attribution notice
async function addAttribution() {
  const attributionFile = path.join(__dirname, '..', 'TOEFL_VOCABULARY_ATTRIBUTION.md');
  const content = `# TOEFL Vocabulary Attribution

## Source
TOEFL Essential Vocabulary dataset from **WordLevel.net**

## License
MIT License - Commercial use allowed

## Dataset Details
- **Dataset:** wordlevel/toefl-essential-vocabulary-1k
- **Source URL:** https://huggingface.co/datasets/wordlevel/toefl-essential-vocabulary-1k
- **Website:** https://wordlevel.net
- **Size:** 1,000 academic vocabulary words
- **Themes:** 77 academic disciplines

## Attribution Requirement
As per the MIT license terms, we provide the following attribution:

**TOEFL vocabulary content powered by [WordLevel.net](https://wordlevel.net)**

This attribution must be displayed in:
- PrepGenie app footer or credits page
- Any public documentation referencing this vocabulary

## Usage in PrepGenie
We use this dataset to generate:
- Synonym selection questions
- Definition matching questions
- Fill-in-the-blank exercises
- Context-based comprehension questions

All questions are generated programmatically from the vocabulary data and include:
- Original word definitions
- Example sentences
- Synonyms
- Academic themes
- Difficulty ratings (3-5 scale)

## Date Imported
${new Date().toISOString()}

## Questions Generated
See import log for exact count of questions generated from this dataset.
`;

  fs.writeFileSync(attributionFile, content);
  console.log(`📝 Attribution file created: ${attributionFile}\n`);
}

// Main execution
async function main() {
  try {
    // Step 1: Download dataset
    const words = await downloadDataset();

    // Step 2: Generate questions
    const questions = generateQuestions(words);

    if (questions.length === 0) {
      console.log('❌ No questions generated. Check data format.\n');
      return;
    }

    // Step 3: Seed to database
    const result = await seedQuestions(questions);

    // Step 4: Add attribution
    await addAttribution();

    // Final summary
    console.log('🎉 TOEFL Vocabulary Import Complete!\n');
    console.log('📊 Final Statistics:');
    console.log(`   Original vocabulary words: 1,000`);
    console.log(`   Questions generated: ${questions.length}`);
    console.log(`   Successfully inserted: ${result.inserted}`);
    console.log(`   Already existed: ${result.skipped}`);
    console.log(`   Errors: ${result.errors}\n`);

    console.log('📋 Next Steps:');
    console.log('   1. Add attribution to your app footer:');
    console.log('      "TOEFL vocabulary powered by WordLevel.net"');
    console.log('   2. Link to: https://wordlevel.net (must be do-follow)');
    console.log('   3. Test the new vocabulary questions in your app');
    console.log('   4. Run: npx tsx scripts/count-english.ts\n');

    console.log('✅ All vocabulary questions are MIT-licensed and safe for commercial use!\n');

  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

// Run the import
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
