#!/usr/bin/env tsx
/**
 * BOOST TOP 10 LOW-COVERAGE EXAMS - SIMPLIFIED
 * Uses FREE Gemini 2.0 Flash model
 */

import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join } from "path";
import { examCategories } from "../src/lib/exams";
import { getCurrentSyllabusYear } from "../src/lib/syllabus-config";

const envFile = readFileSync(join(process.cwd(), ".env.local"), "utf-8");
envFile.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const [, key, value] = match;
    process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
  }
});

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const VERIFIED_SOURCES: any = {
  "general-knowledge": "Lucent's General Knowledge",
  "general-awareness": "Manorama Yearbook",
  "current-affairs": "Current Affairs Compilations",
  "reasoning": "R.S. Aggarwal Logical Reasoning",
  "quantitative": "R.S. Aggarwal Quantitative Aptitude",
  "english": "Wren & Martin English Grammar",
  "computer": "NIELIT Foundation Course",
  "physics": "NCERT Physics",
  "chemistry": "NCERT Chemistry",
  "biology": "NCERT Biology",
  "mathematics": "NCERT Mathematics",
  "default": "Standard Exam Preparation Books"
};

function getSource(subjectId: string): string {
  for (const [key, source] of Object.entries(VERIFIED_SOURCES)) {
    if (subjectId.toLowerCase().includes(key)) return source as string;
  }
  return VERIFIED_SOURCES.default;
}

async function generateQuestions(examName: string, subject: string, topic: string, count: number) {
  const source = getSource(subject);
  const prompt = `You are generating exam questions. You MUST return valid JSON only.

Exam: ${examName}
Subject: ${subject}
Topic: ${topic}
Count: ${count} questions
Reference: ${source}

CRITICAL RULES:
1. Return ONLY a JSON array, no markdown, no extra text before or after
2. Use double quotes for all strings
3. Escape special characters: use \\" for quotes, \\n for newlines
4. No trailing commas
5. correctAnswer must be 0, 1, 2, or 3
6. EVERY question MUST have an "explanation" field (minimum 50 characters)

JSON TEMPLATE - YOU MUST USE ALL THESE FIELDS:
[
  {
    "question": "Clear question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Detailed explanation with reasoning why this answer is correct",
    "difficulty": "medium"
  }
]

IMPORTANT: The "explanation" field is MANDATORY. Never omit it!

Generate ${count} questions now. Return ONLY the JSON array.`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://prepgenie.co.in",
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-haiku",
        messages: [
          { role: "system", content: "You are a JSON generator. Output only valid JSON arrays. Never add markdown or explanations." },
          { role: "user", content: prompt }
        ],
        temperature: 0.5, // Reduced for more consistent formatting
        max_tokens: 3000, // Increased for batch generation
      }),
    });

    if (!response.ok) {
      console.log(`      API Error: ${response.status}`);
      return [];
    }
    const data = await response.json();
    let text = (data.choices[0]?.message?.content || "").trim();
    if (!text) {
      console.log(`      Empty response`);
      return [];
    }

    // More aggressive cleaning
    text = text.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();

    // Find JSON array boundaries
    const startIdx = text.indexOf('[');
    const endIdx = text.lastIndexOf(']');
    if (startIdx === -1 || endIdx === -1 || startIdx >= endIdx) {
      console.log(`      No valid JSON array found`);
      return [];
    }
    text = text.substring(startIdx, endIdx + 1);

    const questions = JSON.parse(text);
    if (!Array.isArray(questions)) {
      console.log(`      Not an array`);
      return [];
    }

    const filtered = questions.filter((q: any) => {
      // Detailed validation with logging
      if (!q.question || typeof q.question !== 'string') return false;
      if (!Array.isArray(q.options) || q.options.length !== 4) return false;
      if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) return false;
      if (!q.explanation || typeof q.explanation !== 'string') return false;
      return true;
    });

    if (filtered.length < questions.length) {
      // Debug: show first invalid question structure
      const invalid = questions.find((q: any) => !filtered.includes(q));
      if (invalid && filtered.length === 0) {
        console.log(`      Debug - Sample question keys: ${Object.keys(invalid).join(', ')}`);
        console.log(`      Debug - correctAnswer type: ${typeof invalid.correctAnswer}, value: ${invalid.correctAnswer}`);
      }
      console.log(`      Filtered: ${questions.length} → ${filtered.length} (${questions.length - filtered.length} invalid)`);
    }

    return filtered;
  } catch (err: any) {
    console.log(`      Exception: ${err.message}`);
    return [];
  }
}

async function main() {
  console.log("=".repeat(80));
  console.log("🚀 BOOST TOP 10 EXAMS - Claude Haiku");
  console.log("=".repeat(80));
  console.log("Model: anthropic/claude-3-haiku");
  console.log("Target: 50 questions per topic (ALL topics)");
  console.log("Estimated cost: ~$1-2 total");
  console.log("=".repeat(80));

  const TARGET_EXAMS = [
    "up-police", "delhi-police", "nda", "ugc-net", "cat",
    "xat", "lic-aao", "cds", "kcet", "ibps-clerk"
  ];

  const TARGET_PER_TOPIC = 20; // Changed from 50 to 20 - focus on getting all topics to minimum first
  const BATCH_SIZE = 15; // Increased batch size for efficiency
  let totalInserted = 0;

  for (const examId of TARGET_EXAMS) {
    console.log(`\n📚 Processing: ${examId}`);

    // Find exam definition
    let examDef: any = null;
    for (const category of examCategories) {
      const found = category.exams.find(e => e.id === examId);
      if (found) { examDef = found; break; }
    }
    if (!examDef) { console.log("   ⚠️  Not found"); continue; }

    // Collect topics needing questions
    const topics: any[] = [];
    for (const subject of examDef.subjects) {
      for (const topic of subject.topics) {
        const result = await db.execute({
          sql: "SELECT COUNT(*) as c FROM exam_questions WHERE exam_id = ? AND subject_id = ? AND topic = ?",
          args: [examId, subject.id, topic],
        });
        const count = Number(result.rows[0].c);
        if (count < TARGET_PER_TOPIC) {
          topics.push({
            examName: examDef.name,
            subjectId: subject.id,
            subjectName: subject.name,
            topic,
            currentCount: count,
          });
        }
      }
    }

    topics.sort((a, b) => a.currentCount - b.currentCount);
    console.log(`   Found ${topics.length} topics needing questions`);

    let examInserted = 0;
    for (const t of topics) { // Process ALL topics (removed 30-topic limit)
      const needed = Math.min(BATCH_SIZE, TARGET_PER_TOPIC - t.currentCount);

      const questions = await generateQuestions(t.examName, t.subjectName, t.topic, needed);
      if (questions.length === 0) {
        console.log(`   ⚠️  ${t.topic}: No valid questions generated`);
        continue;
      }
      console.log(`   🔨 ${t.topic}: Generated ${questions.length} questions`);

      const source = getSource(t.subjectId);
      const validFrom = getCurrentSyllabusYear(examId);
      let inserted = 0;

      for (const q of questions) {
        try {
          // Check duplicates
          const dupe = await db.execute({
            sql: "SELECT id FROM exam_questions WHERE exam_id = ? AND LOWER(SUBSTR(question, 1, 80)) = LOWER(SUBSTR(?, 1, 80))",
            args: [examId, q.question],
          });
          if (dupe.rows.length > 0) continue;

          await db.execute({
            sql: `INSERT INTO exam_questions (exam_id, subject_id, topic, question, options, correct_answer, explanation, difficulty, source, valid_from, valid_until)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
              examId, t.subjectId, t.topic, q.question, JSON.stringify(q.options),
              q.correctAnswer, q.explanation + ` [${source}]`, q.difficulty,
              `verified-free-${source.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
              validFrom, null,
            ],
          });
          inserted++;
        } catch {}
      }

      if (inserted > 0) {
        examInserted += inserted;
        totalInserted += inserted;
        console.log(`   ✅ ${t.topic}: +${inserted} (${t.currentCount} → ${t.currentCount + inserted})`);
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`   📊 ${examId}: +${examInserted} questions`);
  }

  console.log("\n" + "=".repeat(80));
  console.log(`✅ COMPLETE: ${totalInserted} questions added`);
  console.log(`💰 Cost: $0 (FREE model)`);
  console.log("=".repeat(80));
}

main().catch(console.error);
