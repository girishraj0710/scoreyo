#!/usr/bin/env node
/**
 * Fix the specific "moral/principal/principle" question that user reported
 */

import { createClient } from '@libsql/client';
import * as fs from 'fs';
import * as path from 'path';

// Load .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      process.env[match[1].trim()] = match[2].trim();
    }
  });
}

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function fixPrincipleQuestion() {
  console.log('🔍 Finding the "moral ___" principal/principle question...\n');

  // Find the question
  const result = await client.execute({
    sql: `SELECT id, question, options, correct_answer, explanation FROM english_questions WHERE question LIKE ? LIMIT 5`,
    args: ['%moral%principal%principle%']
  });

  if (result.rows.length === 0) {
    console.log('❌ Question not found in database');
    return;
  }

  console.log(`Found ${result.rows.length} matching question(s):\n`);

  for (const row of result.rows) {
    const id = row.id as number;
    const question = row.question as string;
    const options = JSON.parse(row.options as string) as string[];
    const correctAnswer = row.correct_answer as number;
    const explanation = row.explanation as string;

    console.log(`Question ID: ${id}`);
    console.log(`Q: ${question}`);
    console.log(`\nOptions:`);
    options.forEach((opt, idx) => {
      const marker = idx === correctAnswer ? ' ← MARKED CORRECT' : '';
      console.log(`  ${idx}. ${opt}${marker}`);
    });
    console.log(`\nExplanation: ${explanation}\n`);

    // Based on the explanation, "principle" should be correct
    // The explanation says: "Principal" = main/school head. "Principle" = rule/value. Here, "principle" is correct.

    // Determine the correct index
    let principleIndex = -1;
    options.forEach((opt, idx) => {
      if (opt.toLowerCase().includes('principle') && !opt.toLowerCase().includes('principal')) {
        principleIndex = idx;
      }
    });

    if (principleIndex === -1) {
      console.log('⚠️ Could not find "principle" option (without "principal")');
      // Try to find it more flexibly
      options.forEach((opt, idx) => {
        if (opt.toLowerCase() === 'principle' || opt.toLowerCase().trim() === 'b. principle') {
          principleIndex = idx;
        }
      });
    }

    if (principleIndex !== -1 && principleIndex !== correctAnswer) {
      console.log(`❌ WRONG ANSWER DETECTED!`);
      console.log(`   Current: [${correctAnswer}] "${options[correctAnswer]}"`);
      console.log(`   Should be: [${principleIndex}] "${options[principleIndex]}"`);
      console.log(`\n🔧 Fixing...`);

      await client.execute({
        sql: 'UPDATE english_questions SET correct_answer = ? WHERE id = ?',
        args: [principleIndex, id]
      });

      console.log(`✅ Question ${id} fixed! correct_answer updated from ${correctAnswer} to ${principleIndex}\n`);
    } else if (principleIndex === correctAnswer) {
      console.log(`✅ Answer is already correct!`);
    } else {
      console.log(`⚠️ Could not determine correct answer automatically`);
    }
  }
}

fixPrincipleQuestion();
