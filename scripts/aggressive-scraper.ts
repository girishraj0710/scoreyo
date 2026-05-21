#!/usr/bin/env tsx
/**
 * AGGRESSIVE Open-Source Question Scraper
 *
 * Strategy: For EACH topic, search multiple sources and scrape hundreds of questions
 *
 * Sources per topic type:
 * - Aptitude: IndiaBix (500+ Q), Testbook, Lofoya, GeeksforGeeks
 * - Current Affairs: GKToday, AffairsCloud, Jagran Josh (daily updates)
 * - Programming: GeeksforGeeks (1000+ Q), Sanfoundry, W3Schools
 * - Banking: BankersAdda, AffairsCloud, Oliveboard
 * - UPSC: ClearIAS, IASBaba, InsightIAS
 * - SSC: SSCAdda, Testbook
 * - GATE: GATE Overflow, GeeksforGeeks
 * - Medical: Marrow, PrepLadder free sections
 *
 * Target: 50,000+ questions from open sources!
 */

import { createClient } from "@libsql/client";
import { readFileSync, writeFileSync, existsSync } from "fs";
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

// Comprehensive mapping of topics to multiple sources
const topicToSources: Record<string, string[]> = {
  // Aptitude & Reasoning
  "Quantitative Aptitude": [
    "https://www.indiabix.com/aptitude/questions-and-answers/",
    "https://www.geeksforgeeks.org/aptitude-questions-and-answers/",
    "https://www.lofoya.com/aptitude/",
  ],
  "Logical Reasoning": [
    "https://www.indiabix.com/logical-reasoning/questions-and-answers/",
    "https://www.lofoya.com/logical-reasoning/",
  ],
  "Verbal Ability": [
    "https://www.indiabix.com/verbal-ability/questions-and-answers/",
  ],
  "Data Interpretation": [
    "https://www.indiabix.com/data-interpretation/questions-and-answers/",
  ],

  // Current Affairs (multiple pages for latest)
  "Current Affairs": [
    "https://currentaffairs.gktoday.in/",
    "https://www.affairscloud.com/current-affairs-quiz/",
    "https://www.jagranjosh.com/current-affairs",
  ],

  // Programming & CS
  "Data Structures": [
    "https://www.geeksforgeeks.org/data-structures-mcq/",
    "https://www.sanfoundry.com/1000-data-structures-questions-answers/",
  ],
  "Algorithms": [
    "https://www.geeksforgeeks.org/algorithms-mcq/",
    "https://www.sanfoundry.com/1000-algorithms-questions-answers/",
  ],
  "C Programming": [
    "https://www.sanfoundry.com/1000-c-questions-answers/",
    "https://www.geeksforgeeks.org/c-programming-multiple-choice-questions/",
  ],
  "Java": [
    "https://www.sanfoundry.com/1000-java-questions-answers/",
    "https://www.geeksforgeeks.org/java-multiple-choice-questions/",
  ],
  "Python": [
    "https://www.sanfoundry.com/1000-python-questions-answers/",
    "https://www.geeksforgeeks.org/python-multiple-choice-questions/",
  ],
  "Database Management": [
    "https://www.sanfoundry.com/1000-database-questions-answers/",
    "https://www.geeksforgeeks.org/dbms-mcq/",
  ],
  "Operating Systems": [
    "https://www.geeksforgeeks.org/operating-systems-mcq/",
    "https://www.sanfoundry.com/1000-operating-system-questions-answers/",
  ],
  "Computer Networks": [
    "https://www.geeksforgeeks.org/computer-network-mcqs/",
    "https://www.sanfoundry.com/1000-computer-networks-questions-answers/",
  ],

  // Banking & Financial
  "Banking Awareness": [
    "https://www.bankersadda.com/banking-awareness-quiz/",
    "https://www.affairscloud.com/banking-awareness-quiz/",
  ],
  "Financial Awareness": [
    "https://www.bankersadda.com/financial-awareness-quiz/",
  ],

  // General Knowledge
  "General Knowledge": [
    "https://www.gktoday.in/general-knowledge/",
    "https://www.jagranjosh.com/general-knowledge",
  ],
  "Indian History": [
    "https://www.gktoday.in/indian-history/",
  ],
  "Indian Geography": [
    "https://www.gktoday.in/indian-geography/",
  ],
  "Indian Polity": [
    "https://www.gktoday.in/indian-polity/",
  ],
  "Economics": [
    "https://www.gktoday.in/economics/",
  ],

  // GATE specific
  "Digital Logic": [
    "https://www.geeksforgeeks.org/digital-logic-multiple-choice-questions/",
  ],
  "Theory of Computation": [
    "https://www.geeksforgeeks.org/theory-of-computation-mcq/",
  ],
  "Compiler Design": [
    "https://www.geeksforgeeks.org/compiler-design-multiple-choice-questions/",
  ],
};

// Generic search patterns for topics not in mapping
const genericSearchPatterns: Record<string, string[]> = {
  "aptitude": ["indiabix.com", "geeksforgeeks.org", "lofoya.com"],
  "reasoning": ["indiabix.com", "lofoya.com"],
  "programming": ["geeksforgeeks.org", "sanfoundry.com", "w3schools.com"],
  "current": ["gktoday.in", "affairscloud.com", "jagranjosh.com"],
  "banking": ["bankersadda.com", "affairscloud.com"],
  "polity": ["gktoday.in", "clearias.com"],
  "history": ["gktoday.in", "jagranjosh.com"],
  "geography": ["gktoday.in", "pmfias.com"],
  "science": ["geeksforgeeks.org", "gktoday.in"],
  "math": ["geeksforgeeks.org", "indiabix.com"],
};

interface ScrapedQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: string;
}

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
 * Use AI to extract questions from webpage content
 */
async function extractQuestionsFromHTML(
  html: string,
  topic: string,
  url: string
): Promise<ScrapedQuestion[]> {
  // Try to extract structured content first
  const questions: ScrapedQuestion[] = [];

  // Use free AI model to extract questions
  const prompt = `Extract ALL multiple-choice questions from this webpage about "${topic}".

HTML snippet (first 6000 chars):
${html.substring(0, 6000)}

Return ONLY valid JSON array with ALL questions found:
[
  {
    "question": "Full question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Explanation text or empty string if not available",
    "difficulty": "medium"
  }
]

Extract as many questions as possible. Return empty array [] if no questions found.`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://prepgenie.co.in",
        "X-Title": "PrepGenie Aggressive Scraper",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-v4-flash:free",
        messages: [
          { role: "system", content: "Extract ALL questions from HTML. Return only JSON array." },
          { role: "user", content: prompt }
        ],
        max_tokens: 4000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    let content = data.choices[0]?.message?.content || "";

    content = content.trim();
    if (content.startsWith('```')) {
      content = content.replace(/```json?\n?/g, '').replace(/```$/g, '').trim();
    }

    const extracted = JSON.parse(content);

    if (Array.isArray(extracted)) {
      return extracted.filter(q =>
        q.question &&
        Array.isArray(q.options) &&
        q.options.length === 4 &&
        typeof q.correctAnswer === 'number' &&
        q.correctAnswer >= 0 &&
        q.correctAnswer <= 3
      );
    }

    return [];
  } catch (err: any) {
    console.log(`    ⚠️  AI extraction failed: ${err.message.substring(0, 50)}`);
    return [];
  }
}

/**
 * Scrape a single URL
 */
async function scrapeURL(url: string, topic: string): Promise<ScrapedQuestion[]> {
  console.log(`   🌐 ${url}`);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      },
    });

    if (!response.ok) {
      console.log(`      ⚠️  HTTP ${response.status}`);
      return [];
    }

    const html = await response.text();
    const questions = await extractQuestionsFromHTML(html, topic, url);

    if (questions.length > 0) {
      console.log(`      ✅ Extracted ${questions.length} questions`);
    } else {
      console.log(`      ⚠️  No questions found`);
    }

    return questions;
  } catch (err: any) {
    console.log(`      ❌ ${err.message.substring(0, 50)}`);
    return [];
  }
}

/**
 * Get URLs for a topic
 */
function getURLsForTopic(topic: string): string[] {
  // Direct mapping
  if (topicToSources[topic]) {
    return topicToSources[topic];
  }

  // Fuzzy matching
  const topicLower = topic.toLowerCase();

  for (const [key, urls] of Object.entries(topicToSources)) {
    if (topicLower.includes(key.toLowerCase()) || key.toLowerCase().includes(topicLower)) {
      return urls;
    }
  }

  // Generic pattern matching
  const urls: string[] = [];
  for (const [pattern, sites] of Object.entries(genericSearchPatterns)) {
    if (topicLower.includes(pattern)) {
      sites.forEach(site => {
        urls.push(`https://www.${site}/${topicLower.replace(/\s+/g, '-')}/`);
      });
      break;
    }
  }

  return urls.slice(0, 3); // Max 3 URLs per topic
}

/**
 * Scrape questions for a topic
 */
async function scrapeTopic(
  examId: string,
  examName: string,
  subjectId: string,
  subjectName: string,
  topic: string,
  currentCount: number
): Promise<number> {
  console.log(`\n📚 ${examName} → ${topic} (${currentCount}Q)`);

  const urls = getURLsForTopic(topic);

  if (urls.length === 0) {
    console.log(`   ⚠️  No sources found`);
    return 0;
  }

  let totalInserted = 0;
  const validFrom = getCurrentSyllabusYear(examId);

  for (const url of urls) {
    const questions = await scrapeURL(url, topic);

    // Insert each question
    for (const q of questions) {
      try {
        // Check duplicate
        const existing = await dbExecuteWithRetry({
          sql: `SELECT id FROM exam_questions
                WHERE exam_id = ? AND subject_id = ? AND LOWER(TRIM(question)) = LOWER(TRIM(?))`,
          args: [examId, subjectId, q.question],
        });

        if (existing.rows.length > 0) continue;

        // Insert
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
            q.explanation || '',
            q.difficulty || 'medium',
            `scraped-${new URL(url).hostname}`,
            validFrom,
            null,
          ],
        });

        totalInserted++;
      } catch (err) {
        // Skip duplicates
      }
    }

    // Rate limit between URLs
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  if (totalInserted > 0) {
    console.log(`   ✅ Total inserted for this topic: ${totalInserted} questions`);
  }

  return totalInserted;
}

async function main() {
  console.log("=".repeat(80));
  console.log("🚀 AGGRESSIVE OPEN-SOURCE SCRAPER");
  console.log("=".repeat(80));
  console.log("");
  console.log("Strategy: Scrape EVERY available source for EACH topic");
  console.log("Sources: 30+ educational websites");
  console.log("Target: 50,000+ questions (hundreds per topic)");
  console.log("Cost: $0 (FREE!)");
  console.log("");
  console.log("=".repeat(80));

  let totalInserted = 0;
  let topicsProcessed = 0;

  // Process ALL topics (no limits!)
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

          // Scrape if below 100 questions
          if (count >= 100) {
            console.log(`\n📚 ${exam.name} → ${topic} (${count}Q) - Skipping (already well-stocked)`);
            continue;
          }

          const inserted = await scrapeTopic(
            exam.id,
            exam.name,
            subject.id,
            subject.name,
            topic,
            count
          );

          totalInserted += inserted;
          topicsProcessed++;

          // Rate limit between topics
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }
    }
  }

  console.log("\n" + "=".repeat(80));
  console.log("✅ AGGRESSIVE SCRAPING COMPLETE");
  console.log("=".repeat(80));
  console.log(`Topics processed: ${topicsProcessed}`);
  console.log(`Questions inserted: ${totalInserted}`);
  console.log(`Average per topic: ${(totalInserted / topicsProcessed).toFixed(1)}`);
  console.log(`Cost: $0 (FREE!)`);
  console.log("=".repeat(80));
}

main().then(() => process.exit(0)).catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
