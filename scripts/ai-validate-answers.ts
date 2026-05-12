#!/usr/bin/env node
/**
 * AI-Powered Answer Validation
 *
 * Uses AI to validate that the marked correct answer actually matches the explanation
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

async function validateQuestionsWithAI(limit: number = 20) {
  console.log(`🤖 Validating ${limit} questions with AI...\n`);

  // Get random sample of questions
  const result = await client.execute(`SELECT id, question, options, correct_answer, explanation FROM english_questions ORDER BY RANDOM() LIMIT ${limit}`);

  const mismatches: any[] = [];

  for (const row of result.rows) {
    const id = row.id as number;
    const question = row.question as string;
    const options = JSON.parse(row.options as string) as string[];
    const markedCorrect = row.correct_answer as number;
    const explanation = row.explanation as string;

    console.log(`\n🔍 Question ${id}:`);
    console.log(`Q: ${question.substring(0, 100)}${question.length > 100 ? '...' : ''}`);
    console.log(`Marked correct: [${markedCorrect}] "${options[markedCorrect]}"`);

    // Ask AI to verify
    const prompt = `You are validating a multiple-choice question. Determine which option index (0, 1, 2, or 3) is the correct answer.

Question: ${question}

Options:
0. ${options[0]}
1. ${options[1]}
2. ${options[2]}
3. ${options[3]}

Explanation provided: ${explanation}

Respond with ONLY a JSON object:
{
  "correctIndex": <number 0-3>,
  "confidence": <number 0-1>,
  "reasoning": "<brief explanation>"
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
        console.log('⚠️ Could not parse AI response');
        continue;
      }

      const aiResponse = JSON.parse(jsonMatch[0]);
      const aiCorrect = aiResponse.correctIndex;

      if (aiCorrect !== markedCorrect) {
        console.log(`❌ MISMATCH! AI says: [${aiCorrect}] "${options[aiCorrect]}"`);
        console.log(`   Confidence: ${(aiResponse.confidence * 100).toFixed(0)}%`);
        console.log(`   Reasoning: ${aiResponse.reasoning}`);

        mismatches.push({
          id,
          question: question.substring(0, 150),
          options,
          markedCorrect,
          markedOption: options[markedCorrect],
          aiCorrect,
          aiOption: options[aiCorrect],
          confidence: aiResponse.confidence,
          reasoning: aiResponse.reasoning,
          explanation
        });
      } else {
        console.log(`✅ Match! Confidence: ${(aiResponse.confidence * 100).toFixed(0)}%`);
      }

      // Rate limit: 1 request per second
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.log(`⚠️ Error: ${error}`);
    }
  }

  console.log(`\n\n📊 Validation Summary:`);
  console.log(`   Questions checked: ${limit}`);
  console.log(`   Mismatches found: ${mismatches.length}`);
  console.log(`   Accuracy: ${((limit - mismatches.length) / limit * 100).toFixed(1)}%\n`);

  if (mismatches.length > 0) {
    console.log('❌ Questions with incorrect answers:');
    mismatches.forEach((m, idx) => {
      console.log(`\n${idx + 1}. Question ID ${m.id}:`);
      console.log(`   Q: ${m.question}`);
      console.log(`   Database says: [${m.markedCorrect}] "${m.markedOption}"`);
      console.log(`   AI says: [${m.aiCorrect}] "${m.aiOption}" (${(m.confidence * 100).toFixed(0)}% confident)`);
      console.log(`   Reasoning: ${m.reasoning}`);
    });

    // Export for review
    const exportPath = path.join(process.cwd(), '.agents', 'artifacts', 'answer-mismatches.json');
    fs.mkdirSync(path.dirname(exportPath), { recursive: true });
    fs.writeFileSync(exportPath, JSON.stringify(mismatches, null, 2));
    console.log(`\n✅ Exported mismatches to: ${exportPath}`);
    console.log('\n💡 To fix these questions, run:');
    console.log(`   npx tsx scripts/fix-specific-questions.ts`);
  } else {
    console.log('✅ All checked questions have correct answers!');
  }
}

// Run validation
const limitArg = process.argv[2] ? parseInt(process.argv[2]) : 20;
validateQuestionsWithAI(limitArg);
