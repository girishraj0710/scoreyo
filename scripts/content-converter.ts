#!/usr/bin/env tsx
/**
 * Educational Content → MCQ Converter
 *
 * Sources:
 * - Wikipedia articles (comprehensive coverage)
 * - Free educational sites
 * - Government portals
 *
 * Strategy: Fetch content → AI converts to exam-relevant MCQs
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

// Topic → Wikipedia URL mapping
const topicToWikipedia: Record<string, string> = {
  // Physics
  "Mechanics": "https://en.wikipedia.org/wiki/Classical_mechanics",
  "Thermodynamics": "https://en.wikipedia.org/wiki/Thermodynamics",
  "Electromagnetism": "https://en.wikipedia.org/wiki/Electromagnetism",
  "Optics": "https://en.wikipedia.org/wiki/Optics",
  "Modern Physics": "https://en.wikipedia.org/wiki/Modern_physics",

  // Chemistry
  "Organic Chemistry": "https://en.wikipedia.org/wiki/Organic_chemistry",
  "Inorganic Chemistry": "https://en.wikipedia.org/wiki/Inorganic_chemistry",
  "Physical Chemistry": "https://en.wikipedia.org/wiki/Physical_chemistry",

  // Biology
  "Cell Biology": "https://en.wikipedia.org/wiki/Cell_biology",
  "Genetics": "https://en.wikipedia.org/wiki/Genetics",
  "Ecology": "https://en.wikipedia.org/wiki/Ecology",
  "Human Physiology": "https://en.wikipedia.org/wiki/Human_physiology",

  // Mathematics
  "Calculus": "https://en.wikipedia.org/wiki/Calculus",
  "Algebra": "https://en.wikipedia.org/wiki/Algebra",
  "Geometry": "https://en.wikipedia.org/wiki/Geometry",
  "Statistics": "https://en.wikipedia.org/wiki/Statistics",

  // Computer Science
  "Data Structures": "https://en.wikipedia.org/wiki/Data_structure",
  "Algorithms": "https://en.wikipedia.org/wiki/Algorithm",
  "Operating Systems": "https://en.wikipedia.org/wiki/Operating_system",
  "Database": "https://en.wikipedia.org/wiki/Database",

  // History
  "Ancient India": "https://en.wikipedia.org/wiki/History_of_India#Ancient_India",
  "Medieval India": "https://en.wikipedia.org/wiki/Medieval_India",
  "Modern India": "https://en.wikipedia.org/wiki/History_of_India#Modern_period",
  "World History": "https://en.wikipedia.org/wiki/World_history",

  // Geography
  "Physical Geography": "https://en.wikipedia.org/wiki/Physical_geography",
  "Indian Geography": "https://en.wikipedia.org/wiki/Geography_of_India",
  "World Geography": "https://en.wikipedia.org/wiki/Geography",

  // Polity
  "Indian Constitution": "https://en.wikipedia.org/wiki/Constitution_of_India",
  "Indian Polity": "https://en.wikipedia.org/wiki/Politics_of_India",
  "Governance": "https://en.wikipedia.org/wiki/Governance",

  // Economics
  "Microeconomics": "https://en.wikipedia.org/wiki/Microeconomics",
  "Macroeconomics": "https://en.wikipedia.org/wiki/Macroeconomics",
  "Indian Economy": "https://en.wikipedia.org/wiki/Economy_of_India",
};

async function dbExecuteWithRetry(query: any, maxRetries = 3): Promise<any> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await db.execute(query);
    } catch (error: any) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

/**
 * Extract main content from Wikipedia article
 */
function extractMainContent(html: string): string {
  // Remove HTML tags and extract meaningful text
  let text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  text = text.replace(/<[^>]+>/g, ' ');
  text = text.replace(/\s+/g, ' ').trim();

  return text.substring(0, 8000); // Limit to 8000 chars for AI processing
}

/**
 * Convert content to MCQs
 */
async function contentToMCQs(
  content: string,
  examId: string,
  examName: string,
  topic: string
): Promise<any[]> {
  const prompt = `You are creating practice questions for ${examName} exam on topic "${topic}".

Read this educational content and create 15 exam-relevant multiple-choice questions:

${content.substring(0, 4000)}

Requirements:
- Questions must be exam-standard for ${examName}
- Test conceptual understanding, not trivial facts
- Include numerical/calculation questions where relevant
- Difficulty: 5 easy, 7 medium, 3 hard

Return ONLY valid JSON array:
[
  {
    "question": "Clear, exam-relevant question",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Detailed explanation with reasoning",
    "difficulty": "easy|medium|hard"
  }
]`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://prepgenie.co.in",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-v4-flash:free",
        messages: [
          { role: "system", content: "Create exam-relevant MCQs from content. Return only JSON." },
          { role: "user", content: prompt }
        ],
        max_tokens: 4000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) return [];

    const data = await response.json();
    let text = data.choices[0]?.message?.content || "";

    text = text.trim();
    if (text.startsWith('```')) {
      text = text.replace(/```json?\n?/g, '').replace(/```$/g, '').trim();
    }

    const questions = JSON.parse(text);

    if (Array.isArray(questions)) {
      return questions.filter(q =>
        q.question &&
        Array.isArray(q.options) &&
        q.options.length === 4 &&
        typeof q.correctAnswer === 'number' &&
        q.explanation
      );
    }

    return [];
  } catch (err: any) {
    console.log(`    ⚠️  AI conversion failed: ${err.message.substring(0, 50)}`);
    return [];
  }
}

/**
 * Process a single topic
 */
async function processTopic(
  examId: string,
  examName: string,
  subjectId: string,
  topic: string,
  currentCount: number
): Promise<number> {
  console.log(`\n📚 ${examName} → ${topic} (${currentCount}Q)`);

  // Find Wikipedia URL
  let wikiUrl = topicToWikipedia[topic];

  // Fuzzy matching
  if (!wikiUrl) {
    for (const [key, url] of Object.entries(topicToWikipedia)) {
      if (topic.toLowerCase().includes(key.toLowerCase()) ||
          key.toLowerCase().includes(topic.toLowerCase())) {
        wikiUrl = url;
        break;
      }
    }
  }

  // Fallback: construct Wikipedia URL
  if (!wikiUrl) {
    wikiUrl = `https://en.wikipedia.org/wiki/${topic.replace(/\s+/g, '_')}`;
  }

  console.log(`   🌐 Source: ${wikiUrl}`);

  try {
    const response = await fetch(wikiUrl);

    if (!response.ok) {
      console.log(`   ⚠️  HTTP ${response.status}`);
      return 0;
    }

    const html = await response.text();
    const content = extractMainContent(html);

    if (content.length < 500) {
      console.log(`   ⚠️  Content too short`);
      return 0;
    }

    console.log(`   📖 Extracted ${content.length} chars, converting to MCQs...`);

    const questions = await contentToMCQs(content, examId, examName, topic);

    if (questions.length === 0) {
      console.log(`   ⚠️  No questions generated`);
      return 0;
    }

    console.log(`   ✅ Generated ${questions.length} questions`);

    // Insert into database
    let inserted = 0;
    const validFrom = getCurrentSyllabusYear(examId);

    for (const q of questions) {
      try {
        const existing = await dbExecuteWithRetry({
          sql: `SELECT id FROM exam_questions
                WHERE exam_id = ? AND subject_id = ? AND LOWER(TRIM(question)) = LOWER(TRIM(?))`,
          args: [examId, subjectId, q.question],
        });

        if (existing.rows.length > 0) continue;

        await dbExecuteWithRetry({
          sql: `INSERT INTO exam_questions
                (exam_id, subject_id, topic, question, options, correct_answer, explanation, difficulty, source, valid_from, valid_until)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            examId,
            subjectId,
            topic,
            q.question,
            JSON.stringify(q.options),
            q.correctAnswer,
            q.explanation,
            q.difficulty,
            'content-converted',
            validFrom,
            null,
          ],
        });

        inserted++;
      } catch (err) {
        // Skip duplicates
      }
    }

    console.log(`   💾 Inserted ${inserted} questions`);
    return inserted;
  } catch (err: any) {
    console.log(`   ❌ Error: ${err.message.substring(0, 50)}`);
    return 0;
  }
}

async function main() {
  console.log("=".repeat(80));
  console.log("🔄 CONTENT → MCQ CONVERTER");
  console.log("=".repeat(80));
  console.log("");
  console.log("Strategy: Extract educational content from Wikipedia");
  console.log("          Convert to exam-relevant MCQs using AI");
  console.log("Target: 15,000+ questions");
  console.log("Cost: $0 (FREE!)");
  console.log("");
  console.log("=".repeat(80));

  let totalInserted = 0;
  let topicsProcessed = 0;

  for (const category of examCategories) {
    for (const exam of category.exams) {
      console.log(`\n${"=".repeat(80)}`);
      console.log(`📖 ${exam.name}`);
      console.log("=".repeat(80));

      for (const subject of exam.subjects) {
        for (const topic of subject.topics) {
          // Check current count
          const result = await dbExecuteWithRetry({
            sql: `SELECT COUNT(*) as count FROM exam_questions
                  WHERE exam_id = ? AND subject_id = ? AND topic = ?`,
            args: [exam.id, subject.id, topic],
          });

          const count = Number(result.rows[0].count);

          // Only process if below 100
          if (count >= 100) continue;

          const inserted = await processTopic(
            exam.id,
            exam.name,
            subject.id,
            topic,
            count
          );

          totalInserted += inserted;
          topicsProcessed++;

          // Rate limit
          await new Promise(resolve => setTimeout(resolve, 6000));
        }
      }
    }
  }

  console.log("\n" + "=".repeat(80));
  console.log("✅ CONTENT CONVERSION COMPLETE");
  console.log("=".repeat(80));
  console.log(`Topics processed: ${topicsProcessed}`);
  console.log(`Questions inserted: ${totalInserted}`);
  console.log(`Average per topic: ${(totalInserted / topicsProcessed || 0).toFixed(1)}`);
  console.log("=".repeat(80));
}

main().then(() => process.exit(0)).catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
