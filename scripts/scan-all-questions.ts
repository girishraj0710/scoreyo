#!/usr/bin/env node
/**
 * Scan all English questions for potential answer mismatches
 * by analyzing explanation text for keywords
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

async function scanAllQuestions() {
  console.log('🔍 Scanning ALL English questions for potential mismatches...\n');

  const result = await client.execute('SELECT id, question, options, correct_answer, explanation FROM english_questions');
  console.log(`Found ${result.rows.length} total questions\n`);

  const suspicious: any[] = [];

  for (const row of result.rows) {
    const id = row.id as number;
    const question = row.question as string;
    const options = JSON.parse(row.options as string) as string[];
    const correctAnswer = row.correct_answer as number;
    const explanation = row.explanation as string;

    const correctOption = options[correctAnswer];
    const expLower = explanation.toLowerCase();

    // Check for explicit contradiction patterns
    const patterns = [
      `"${correctOption.toLowerCase()}" is incorrect`,
      `${correctOption.toLowerCase()} is incorrect`,
      `"${correctOption.toLowerCase()}" is wrong`,
      `${correctOption.toLowerCase()} is wrong`,
      `not "${correctOption.toLowerCase()}"`,
      `not ${correctOption.toLowerCase()}`,
    ];

    let foundContradiction = false;
    for (const pattern of patterns) {
      if (expLower.includes(pattern)) {
        foundContradiction = true;
        break;
      }
    }

    if (foundContradiction) {
      suspicious.push({
        id,
        question: question.substring(0, 100),
        correctAnswer,
        correctOption,
        explanation: explanation.substring(0, 200),
        options
      });
      continue;
    }

    // Check if explanation says "Here, X is correct" where X is NOT the marked answer
    for (let i = 0; i < options.length; i++) {
      if (i === correctAnswer) continue;

      const opt = options[i].toLowerCase().trim();
      const patterns2 = [
        `here, "${opt}" is correct`,
        `here, ${opt} is correct`,
        `"${opt}" is the correct`,
        `${opt} is the correct answer`,
        `answer is "${opt}"`,
        `answer is ${opt}`,
        `should be "${opt}"`,
        `should be ${opt}`,
        `correct one is "${opt}"`,
        `correct one is ${opt}`,
      ];

      for (const p of patterns2) {
        if (expLower.includes(p)) {
          suspicious.push({
            id,
            question: question.substring(0, 100),
            correctAnswer,
            correctOption,
            suspectedCorrect: i,
            suspectedOption: options[i],
            explanation: explanation.substring(0, 200),
            options,
            pattern: p
          });
          foundContradiction = true;
          break;
        }
      }
      if (foundContradiction) break;
    }
  }

  console.log(`\n📊 Scan Results:`);
  console.log(`   Total questions: ${result.rows.length}`);
  console.log(`   Suspicious: ${suspicious.length}`);
  console.log(`   Pass rate: ${((result.rows.length - suspicious.length) / result.rows.length * 100).toFixed(2)}%\n`);

  if (suspicious.length > 0) {
    console.log('❌ Suspicious questions found:\n');
    suspicious.slice(0, 20).forEach((s, idx) => {
      console.log(`${idx + 1}. Question ID ${s.id}:`);
      console.log(`   Q: ${s.question}`);
      console.log(`   Marked: [${s.correctAnswer}] "${s.correctOption}"`);
      if (s.suspectedCorrect !== undefined) {
        console.log(`   Suspected: [${s.suspectedCorrect}] "${s.suspectedOption}"`);
        console.log(`   Pattern matched: "${s.pattern}"`);
      }
      console.log(`   Explanation: ${s.explanation}...`);
      console.log('');
    });

    if (suspicious.length > 20) {
      console.log(`... and ${suspicious.length - 20} more\n`);
    }

    // Export
    const exportPath = path.join(process.cwd(), '.agents', 'artifacts', 'suspicious-questions.json');
    fs.mkdirSync(path.dirname(exportPath), { recursive: true });
    fs.writeFileSync(exportPath, JSON.stringify(suspicious, null, 2));
    console.log(`✅ Exported to: ${exportPath}`);
  } else {
    console.log('✅ No suspicious questions found!');
  }
}

scanAllQuestions();
