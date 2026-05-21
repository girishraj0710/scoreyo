#!/usr/bin/env tsx
/**
 * Test Free Models for Question Generation
 */
import { readFileSync } from "fs";
import { join } from "path";

const envFile = readFileSync(join(process.cwd(), ".env.local"), "utf-8");
envFile.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const [, key, value] = match;
    process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
  }
});

const freeModels = [
  "deepseek/deepseek-v4-flash:free",
  "google/gemma-4-31b-it:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "qwen/qwen3-next-80b-a3b-instruct:free",
  "google/lyria-3-pro-preview",
];

async function testModel(model: string) {
  console.log(`\n🧪 Testing: ${model}`);
  console.log("─".repeat(80));

  const prompt = `Generate exactly 3 multiple-choice questions about basic mathematics (algebra).

Return ONLY valid JSON array:
[
  {
    "question": "What is 2 + 2?",
    "options": ["3", "4", "5", "6"],
    "correctAnswer": 1,
    "explanation": "Basic addition: 2 + 2 = 4",
    "difficulty": "easy"
  }
]`;

  try {
    const startTime = Date.now();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://prepgenie.co.in",
        "X-Title": "PrepGenie Free Model Test",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "Return only valid JSON arrays. No markdown." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    const duration = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`❌ API Error: ${errorText.substring(0, 150)}`);
      return null;
    }

    const data = await response.json();
    let content = data.choices[0]?.message?.content || "";

    // Clean markdown
    content = content.trim();
    if (content.startsWith('```')) {
      content = content.replace(/```json?\n?/g, '').replace(/```$/g, '').trim();
    }

    const questions = JSON.parse(content);

    if (Array.isArray(questions) && questions.length >= 2) {
      const validCount = questions.filter((q: any) =>
        q.question &&
        Array.isArray(q.options) &&
        q.options.length === 4 &&
        typeof q.correctAnswer === 'number' &&
        q.explanation &&
        q.difficulty
      ).length;

      console.log(`✅ SUCCESS!`);
      console.log(`   Generated: ${questions.length} questions`);
      console.log(`   Valid: ${validCount}/${questions.length}`);
      console.log(`   Speed: ${duration}ms`);
      console.log(`   Sample: ${questions[0].question.substring(0, 60)}...`);

      return { model, validCount, duration };
    } else {
      console.log(`⚠️  Wrong format: ${typeof questions}, length: ${questions?.length}`);
      return null;
    }
  } catch (err: any) {
    console.log(`❌ Error: ${err.message.substring(0, 100)}`);
    return null;
  }
}

async function main() {
  console.log("🔍 TESTING FREE MODELS FOR QUESTION GENERATION");
  console.log("=".repeat(80));

  const results = [];

  for (const model of freeModels) {
    const result = await testModel(model);
    if (result) {
      results.push(result);
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log("\n" + "=".repeat(80));
  console.log("🏆 RESULTS - Best to Worst:");
  console.log("=".repeat(80));

  if (results.length === 0) {
    console.log("❌ NO WORKING FREE MODELS FOUND");
  } else {
    results.sort((a, b) => b.validCount - a.validCount || a.duration - b.duration);

    results.forEach((r, i) => {
      console.log(`${i + 1}. ${r.model}`);
      console.log(`   Quality: ${r.validCount}/3 valid questions`);
      console.log(`   Speed: ${r.duration}ms`);
    });

    console.log("\n🎯 RECOMMENDATION: Use " + results[0].model);
    console.log("   Cost: $0 (FREE!)");
    console.log("   For 7,880 questions: $0 total");
  }

  process.exit(results.length > 0 ? 0 : 1);
}

main().catch(console.error);
