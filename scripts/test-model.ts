#!/usr/bin/env tsx
/**
 * Test OpenRouter Models to Find One That Works
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

const models = [
  "google/gemini-3.1-flash-lite",
  "google/gemini-2.5-flash",
  "anthropic/claude-3.5-haiku",
  "openai/gpt-4o-mini",
];

async function testModel(model: string) {
  console.log(`\n🧪 Testing: ${model}`);
  console.log("=".repeat(80));

  const prompt = `Generate exactly 3 simple multiple-choice questions about basic physics.

Return ONLY valid JSON array (no markdown, no extra text):
[
  {
    "question": "What is the SI unit of force?",
    "options": ["Newton", "Joule", "Watt", "Pascal"],
    "correctAnswer": 0,
    "explanation": "Force is measured in Newtons (N). One Newton is the force required to accelerate 1 kg mass at 1 m/s².",
    "difficulty": "easy"
  }
]`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://prepgenie.co.in",
        "X-Title": "PrepGenie Model Test",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "You are a helpful assistant. Return only valid JSON." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`❌ API Error ${response.status}: ${errorText.substring(0, 200)}`);
      return false;
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || "";

    // Try to parse JSON
    let jsonStr = content.trim();
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/```json?\n?/g, '').replace(/```$/g, '').trim();
    }

    const questions = JSON.parse(jsonStr);

    if (Array.isArray(questions) && questions.length === 3) {
      console.log(`✅ SUCCESS! Generated ${questions.length} valid questions`);
      console.log(`Sample: ${questions[0].question.substring(0, 60)}...`);
      return true;
    } else {
      console.log(`⚠️  Parsed but wrong format: ${typeof questions}, length: ${questions?.length}`);
      return false;
    }
  } catch (err: any) {
    console.log(`❌ Error: ${err.message}`);
    return false;
  }
}

async function main() {
  console.log("🔍 TESTING OPENROUTER MODELS");
  console.log("=".repeat(80));
  console.log("");

  let winner: string | null = null;

  for (const model of models) {
    const success = await testModel(model);
    if (success && !winner) {
      winner = model;
      console.log(`\n🏆 FOUND WORKING MODEL: ${winner}`);
      break;
    }
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2s delay between tests
  }

  if (!winner) {
    console.log("\n❌ NO WORKING MODELS FOUND");
    console.log("All tested models failed. This indicates an API or account issue.");
  }

  process.exit(winner ? 0 : 1);
}

main().catch(console.error);
