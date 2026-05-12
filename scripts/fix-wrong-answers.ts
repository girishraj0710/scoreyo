#!/usr/bin/env node
/**
 * Fix Wrong Answer Indices in English Questions
 *
 * This script detects questions where the correctAnswer index doesn't match
 * the explanation, and attempts to fix them using AI.
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

interface Question {
  id: number;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

async function analyzeAndFixQuestions() {
  console.log('🔍 Scanning English questions for incorrect answer indices...\n');

  // Get all questions
  const result = await client.execute('SELECT id, question, options, correct_answer, explanation FROM english_questions LIMIT 1000');
  const questions = result.rows.map((row: any) => ({
    id: row.id,
    question: row.question,
    options: JSON.parse(row.options as string),
    correct_answer: row.correct_answer as number,
    explanation: row.explanation as string,
  })) as Question[];

  console.log(`Found ${questions.length} questions to analyze\n`);

  const problematicQuestions: Question[] = [];

  // Analyze each question
  for (const q of questions) {
    const currentCorrectOption = q.options[q.correct_answer];
    const explanation = q.explanation.toLowerCase();
    const questionText = q.question.toLowerCase();

    // Check if the explanation mentions one of the other options as correct
    let suspectedCorrectIndex = q.correct_answer;
    let suspicion = false;

    for (let i = 0; i < q.options.length; i++) {
      if (i === q.correct_answer) continue;

      const option = q.options[i].toLowerCase();
      const optionWords = option.split(/\W+/).filter(w => w.length > 3);

      // Check if this option is mentioned positively in the explanation
      const positivePatterns = [
        `"${option}" is correct`,
        `${option} is the correct`,
        `answer is "${option}"`,
        `answer is ${option}`,
        `correct answer is ${option}`,
        `should be "${option}"`,
        `should be ${option}`,
      ];

      for (const pattern of positivePatterns) {
        if (explanation.includes(pattern)) {
          suspectedCorrectIndex = i;
          suspicion = true;
          break;
        }
      }

      if (suspicion) break;
    }

    if (suspicion && suspectedCorrectIndex !== q.correct_answer) {
      problematicQuestions.push(q);
      console.log(`❌ Question ${q.id}: Mismatch detected!`);
      console.log(`   Q: ${q.question.substring(0, 80)}...`);
      console.log(`   Current correct (index ${q.correct_answer}): "${q.options[q.correct_answer]}"`);
      console.log(`   Suspected correct (index ${suspectedCorrectIndex}): "${q.options[suspectedCorrectIndex]}"`);
      console.log(`   Explanation: ${q.explanation.substring(0, 100)}...`);
      console.log('');
    }
  }

  console.log(`\n📊 Analysis complete:`);
  console.log(`   Total questions: ${questions.length}`);
  console.log(`   Problematic: ${problematicQuestions.length}`);
  console.log(`   Accuracy: ${((questions.length - problematicQuestions.length) / questions.length * 100).toFixed(1)}%\n`);

  if (problematicQuestions.length > 0) {
    console.log('🔧 Do you want to fix these questions using AI? (y/n)');
    console.log('   This will use OpenRouter API to re-determine the correct answers.\n');

    // For now, just export them to a file for manual review
    const exportPath = path.join(process.cwd(), '.agents', 'artifacts', 'problematic-questions.json');
    fs.mkdirSync(path.dirname(exportPath), { recursive: true });
    fs.writeFileSync(exportPath, JSON.stringify(problematicQuestions, null, 2));
    console.log(`✅ Exported problematic questions to: ${exportPath}`);
    console.log('   Review these manually and use the fix function if needed.');
  } else {
    console.log('✅ No problematic questions found! All answers look correct.');
  }
}

async function fixQuestionWithAI(questionId: number) {
  console.log(`🤖 Fixing question ${questionId} with AI...`);

  // Get the question
  const result = await client.execute({
    sql: 'SELECT id, question, options, correct_answer, explanation FROM english_questions WHERE id = ?',
    args: [questionId]
  });

  if (result.rows.length === 0) {
    console.log('❌ Question not found');
    return;
  }

  const row = result.rows[0];
  const question = row.question as string;
  const options = JSON.parse(row.options as string) as string[];
  const currentCorrect = row.correct_answer as number;

  // Ask AI to determine the correct answer
  const prompt = `You are an English language expert. Given this multiple-choice question, determine which option is correct.

Question: ${question}

Options:
${options.map((opt, idx) => `${idx}. ${opt}`).join('\n')}

Current marked answer: ${currentCorrect} (${options[currentCorrect]})

Analyze this question carefully and respond with ONLY a JSON object in this format:
{
  "correctIndex": <number 0-3>,
  "reasoning": "<brief explanation why this is correct>",
  "newExplanation": "<detailed explanation for students>"
}`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
      })
    });

    const data = await response.json();
    const content = data.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.log('❌ AI response not in expected format');
      return;
    }

    const aiResponse = JSON.parse(jsonMatch[0]);

    console.log(`   AI determined correct answer: ${aiResponse.correctIndex} (${options[aiResponse.correctIndex]})`);
    console.log(`   Reasoning: ${aiResponse.reasoning}`);

    if (aiResponse.correctIndex !== currentCorrect) {
      console.log(`   ⚠️ This differs from current answer: ${currentCorrect} (${options[currentCorrect]})`);
      console.log(`   Updating database...`);

      await client.execute({
        sql: 'UPDATE english_questions SET correct_answer = ?, explanation = ? WHERE id = ?',
        args: [aiResponse.correctIndex, aiResponse.newExplanation, questionId]
      });

      console.log(`   ✅ Question ${questionId} updated!`);
    } else {
      console.log(`   ✅ Current answer is correct, no update needed.`);
    }
  } catch (error) {
    console.error('❌ Error calling AI:', error);
  }
}

// Run analysis
analyzeAndFixQuestions();
