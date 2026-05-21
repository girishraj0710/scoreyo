#!/usr/bin/env tsx
/**
 * IndiaBix Scraper - Extract thousands of questions
 *
 * IndiaBix has 35+ aptitude topics with hundreds of questions each
 * Each question page has: question, 4 options, answer, explanation
 *
 * Strategy:
 * 1. Get topic list from main page
 * 2. For each topic, scrape all question pages
 * 3. Extract structured data
 * 4. Insert into database
 *
 * Expected: 10,000+ questions from IndiaBix alone!
 */

import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join } from "path";
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

// IndiaBix topics (from the page we just saw)
const indiaBixTopics = [
  { url: "problems-on-trains", name: "Problems on Trains" },
  { url: "time-and-distance", name: "Time and Distance" },
  { url: "time-and-work", name: "Time and Work" },
  { url: "simple-interest", name: "Simple Interest" },
  { url: "compound-interest", name: "Compound Interest" },
  { url: "profit-and-loss", name: "Profit and Loss" },
  { url: "partnership", name: "Partnership" },
  { url: "percentage", name: "Percentage" },
  { url: "problems-on-ages", name: "Problems on Ages" },
  { url: "calendar", name: "Calendar" },
  { url: "clock", name: "Clock" },
  { url: "average", name: "Average" },
  { url: "area", name: "Area" },
  { url: "volume-and-surface-area", name: "Volume and Surface Area" },
  { url: "permutation-and-combination", name: "Permutation and Combination" },
  { url: "problems-on-numbers", name: "Problems on Numbers" },
  { url: "problems-on-hcf-and-lcm", name: "Problems on HCF and LCM" },
  { url: "ratio-and-proportion", name: "Ratio and Proportion" },
  { url: "pipes-and-cistern", name: "Pipes and Cistern" },
  { url: "boats-and-streams", name: "Boats and Streams" },
  { url: "probability", name: "Probability" },
];

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
 * Scrape a single question page and use AI to extract structured data
 */
async function scrapeQuestionPage(url: string): Promise<any | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    });

    if (!response.ok) return null;

    const html = await response.text();

    // Use AI to extract question from HTML
    const prompt = `Extract the multiple-choice question from this HTML page.

HTML snippet (relevant parts):
${html.substring(0, 8000)}

The page contains:
- A question text
- 4 options (A, B, C, D)
- The correct answer
- An explanation

Return ONLY valid JSON with this exact structure:
{
  "question": "The complete question text",
  "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
  "correctAnswer": 0,
  "explanation": "The explanation text"
}

If you cannot find a valid question, return: {"error": "not found"}`;

    const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-v4-flash:free",
        messages: [
          { role: "system", content: "Extract MCQ data from HTML. Return only JSON." },
          { role: "user", content: prompt }
        ],
        max_tokens: 1500,
      }),
    });

    if (!aiResponse.ok) return null;

    const data = await aiResponse.json();
    let text = data.choices[0]?.message?.content || "";

    text = text.trim();
    if (text.startsWith('```')) {
      text = text.replace(/```json?\n?/g, '').replace(/```$/g, '').trim();
    }

    const extracted = JSON.parse(text);

    if (extracted.error || !extracted.question || !Array.isArray(extracted.options)) {
      return null;
    }

    return extracted;
  } catch (err) {
    return null;
  }
}

/**
 * Get all question URLs for a topic
 */
async function getQuestionURLs(topicUrl: string): Promise<string[]> {
  const urls: string[] = [];

  try {
    const response = await fetch(`https://www.indiabix.com/aptitude/${topicUrl}/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!response.ok) return urls;

    const html = await response.text();

    // Extract question URLs (pattern: /aptitude/topic-name/123456)
    const matches = html.matchAll(/href="https:\/\/www\.indiabix\.com\/aptitude\/${topicUrl}\/(\d{6})"/g);

    for (const match of matches) {
      urls.push(`https://www.indiabix.com/aptitude/${topicUrl}/${match[1]}`);
    }

    console.log(`   Found ${urls.length} question URLs`);
  } catch (err) {
    console.log(`   ⚠️  Error getting URLs`);
  }

  return urls;
}

/**
 * Scrape all questions from a topic
 */
async function scrapeTopic(topicUrl: string, topicName: string): Promise<number> {
  console.log(`\n📚 ${topicName}`);
  console.log(`   🌐 https://www.indiabix.com/aptitude/${topicUrl}/`);

  const urls = await getQuestionURLs(topicUrl);

  if (urls.length === 0) {
    console.log(`   ⚠️  No questions found`);
    return 0;
  }

  let inserted = 0;
  const validFrom = getCurrentSyllabusYear("quantitative-aptitude");

  // Process first 50 questions to avoid overwhelming (can remove limit later)
  const urlsToProcess = urls.slice(0, 50);

  console.log(`   Processing ${urlsToProcess.length} questions...`);

  for (const url of urlsToProcess) {
    const question = await scrapeQuestionPage(url);

    if (!question) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      continue;
    }

    try {
      // Check duplicate
      const existing = await dbExecuteWithRetry({
        sql: `SELECT id FROM exam_questions
              WHERE LOWER(TRIM(question)) = LOWER(TRIM(?))`,
        args: [question.question],
      });

      if (existing.rows.length > 0) continue;

      // Insert for multiple relevant exams
      const relevantExams = [
        { examId: "sbi-po", subjectId: "quantitative-aptitude" },
        { examId: "ibps-po", subjectId: "quantitative-aptitude" },
        { examId: "ssc-cgl", subjectId: "quantitative-aptitude" },
        { examId: "cat", subjectId: "quantitative-aptitude" },
      ];

      for (const exam of relevantExams) {
        await dbExecuteWithRetry({
          sql: `INSERT INTO exam_questions
                (exam_id, subject_id, topic, question, options, correct_answer, explanation, difficulty, source, valid_from, valid_until)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            exam.examId,
            exam.subjectId,
            topicName,
            question.question,
            JSON.stringify(question.options),
            question.correctAnswer,
            question.explanation || "",
            "medium",
            "indiabix.com",
            validFrom,
            null,
          ],
        });
      }

      inserted++;

      if (inserted % 10 === 0) {
        console.log(`   ✅ Progress: ${inserted} questions inserted`);
      }
    } catch (err) {
      // Skip errors
    }

    // Rate limit
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  console.log(`   ✅ Total: ${inserted} questions inserted for this topic`);
  return inserted;
}

async function main() {
  console.log("=".repeat(80));
  console.log("📖 INDIABIX SCRAPER");
  console.log("=".repeat(80));
  console.log("");
  console.log("Source: IndiaBix.com (Educational website with 10,000+ questions)");
  console.log("Topics: 21 aptitude topics");
  console.log("Target: 5,000+ questions (50 per topic × 21 topics × 4 exams)");
  console.log("Cost: $0 (FREE!)");
  console.log("");
  console.log("=".repeat(80));

  let totalInserted = 0;

  for (const topic of indiaBixTopics) {
    const count = await scrapeTopic(topic.url, topic.name);
    totalInserted += count;

    // Rate limit between topics
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  console.log("\n" + "=".repeat(80));
  console.log("✅ INDIABIX SCRAPING COMPLETE");
  console.log("=".repeat(80));
  console.log(`Topics processed: ${indiaBixTopics.length}`);
  console.log(`Questions inserted: ${totalInserted}`);
  console.log(`Average per topic: ${(totalInserted / indiaBixTopics.length).toFixed(1)}`);
  console.log("=".repeat(80));
}

main().then(() => process.exit(0)).catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
