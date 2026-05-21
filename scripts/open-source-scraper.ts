#!/usr/bin/env tsx
/**
 * Open Source Question Scraper
 *
 * Sources questions from free websites for different topics:
 * - Aptitude: IndiaBix, Testbook free section
 * - Current Affairs: Government portals, free news APIs
 * - Technical: GeeksforGeeks, W3Schools, MDN
 * - Banking/SSC: Free mock test sites
 *
 * Strategy: Use Google search to find open-source questions
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

// Topic to search query mapping
const topicSearchStrategies: Record<string, string[]> = {
  // Aptitude topics
  "Quantitative Aptitude": [
    "site:indiabix.com quantitative aptitude questions",
    "site:geeksforgeeks.org aptitude questions",
  ],
  "Logical Reasoning": [
    "site:indiabix.com logical reasoning questions",
    "site:lofoya.com logical reasoning",
  ],
  "Verbal Ability": [
    "site:indiabix.com verbal ability questions",
  ],

  // Current Affairs (use free APIs)
  "Current Affairs": [
    "site:currentaffairs.gktoday.in",
    "site:affairscloud.com current affairs quiz",
  ],
  "Indian Polity": [
    "site:indianpolity.com questions",
  ],

  // Programming topics
  "Data Structures": [
    "site:geeksforgeeks.org data structures mcq",
    "site:sanfoundry.com data structures questions",
  ],
  "Algorithms": [
    "site:geeksforgeeks.org algorithms mcq",
  ],
  "C Programming": [
    "site:sanfoundry.com c programming questions",
    "site:geeksforgeeks.org c programming mcq",
  ],
  "Java": [
    "site:sanfoundry.com java questions",
  ],
  "Python": [
    "site:geeksforgeeks.org python mcq",
  ],

  // Banking topics
  "Banking Awareness": [
    "site:bankersadda.com banking awareness quiz",
    "site:affairscloud.com banking awareness",
  ],

  // General Knowledge
  "General Knowledge": [
    "site:gktoday.in general knowledge quiz",
  ],
};

// Known open-source question websites
const openSourceSites = [
  "indiabix.com",
  "geeksforgeeks.org",
  "sanfoundry.com",
  "gktoday.in",
  "affairscloud.com",
  "currentaffairs.gktoday.in",
  "bankersadda.com",
];

interface ScrapedQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  source: string;
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
 * Use AI to convert scraped content to structured questions
 * (Fallback when direct scraping doesn't work)
 */
async function extractQuestionsWithAI(
  topic: string,
  htmlContent: string
): Promise<ScrapedQuestion[]> {
  // Use free model to extract questions from HTML
  const prompt = `Extract multiple-choice questions from this HTML content about "${topic}".

HTML Content:
${htmlContent.substring(0, 4000)}

Return ONLY valid JSON array:
[
  {
    "question": "Question text",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": 0,
    "explanation": "Explanation if available or empty string"
  }
]

If no questions found, return empty array [].`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-v4-flash:free",
        messages: [
          { role: "system", content: "Extract questions from HTML. Return only JSON." },
          { role: "user", content: prompt }
        ],
        max_tokens: 3000,
      }),
    });

    if (!response.ok) return [];

    const data = await response.json();
    let content = data.choices[0]?.message?.content || "";

    content = content.trim();
    if (content.startsWith('```')) {
      content = content.replace(/```json?\n?/g, '').replace(/```$/g, '').trim();
    }

    const questions = JSON.parse(content);
    return Array.isArray(questions) ? questions : [];
  } catch (err) {
    return [];
  }
}

/**
 * Search Google for open-source questions
 */
async function searchOpenSourceQuestions(topic: string): Promise<string[]> {
  const searchQueries = topicSearchStrategies[topic] || [
    `${topic} multiple choice questions site:${openSourceSites[0]}`,
  ];

  const urls: string[] = [];

  // For now, return known URLs based on topic patterns
  // In production, you'd use Google Custom Search API (has free tier)

  if (topic.includes("Aptitude") || topic.includes("Reasoning") || topic.includes("Verbal")) {
    urls.push(
      `https://www.indiabix.com/_files/aptitude/${topic.toLowerCase().replace(/\s+/g, '-')}/`,
      `https://www.geeksforgeeks.org/${topic.toLowerCase().replace(/\s+/g, '-')}-questions/`
    );
  }

  if (topic.includes("Current Affairs")) {
    urls.push(
      "https://currentaffairs.gktoday.in/category/current-affairs-quiz/",
      "https://www.affairscloud.com/current-affairs-quiz/"
    );
  }

  if (topic.includes("Programming") || topic.includes("Data Structures") || topic.includes("Algorithm")) {
    urls.push(
      `https://www.geeksforgeeks.org/${topic.toLowerCase().replace(/\s+/g, '-')}-multiple-choice-questions/`,
      `https://www.sanfoundry.com/1000-${topic.toLowerCase().replace(/\s+/g, '-')}-questions-answers/`
    );
  }

  return urls.slice(0, 2); // Limit to 2 URLs per topic
}

/**
 * Scrape questions from a URL
 */
async function scrapeURL(url: string, topic: string): Promise<ScrapedQuestion[]> {
  console.log(`   🌐 Scraping: ${url.substring(0, 60)}...`);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PrepGenieBot/1.0; Educational)',
      },
    });

    if (!response.ok) {
      console.log(`   ⚠️  HTTP ${response.status}`);
      return [];
    }

    const html = await response.text();

    // Try to extract questions using AI
    const questions = await extractQuestionsWithAI(topic, html);

    if (questions.length > 0) {
      console.log(`   ✅ Extracted ${questions.length} questions`);
      return questions.map(q => ({
        ...q,
        source: url,
      }));
    }

    return [];
  } catch (err: any) {
    console.log(`   ❌ Scrape failed: ${err.message.substring(0, 50)}`);
    return [];
  }
}

/**
 * Main scraping logic
 */
async function scrapeTopicQuestions(
  examId: string,
  examName: string,
  subjectId: string,
  subjectName: string,
  topic: string,
  currentCount: number
): Promise<number> {
  console.log(`\n📚 ${examName} → ${topic} (${currentCount}Q)`);

  // Search for open-source URLs
  const urls = await searchOpenSourceQuestions(topic);

  if (urls.length === 0) {
    console.log(`   ⚠️  No open-source URLs found for this topic`);
    return 0;
  }

  let totalInserted = 0;
  const validFrom = getCurrentSyllabusYear(examId);

  for (const url of urls) {
    const questions = await scrapeURL(url, topic);

    // Insert scraped questions
    for (const q of questions) {
      try {
        // Validate
        if (!q.question || !Array.isArray(q.options) || q.options.length !== 4) {
          continue;
        }

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
            'medium', // Default difficulty
            `scraped-${new URL(url).hostname}`,
            validFrom,
            null,
          ],
        });

        totalInserted++;
      } catch (err) {
        // Skip duplicates or errors
      }
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  if (totalInserted > 0) {
    console.log(`   ✅ Inserted ${totalInserted} scraped questions`);
  }

  return totalInserted;
}

async function main() {
  console.log("=".repeat(80));
  console.log("🌐 OPEN SOURCE QUESTION SCRAPER");
  console.log("=".repeat(80));
  console.log("");
  console.log("Strategy: Scrape free questions from educational websites");
  console.log("Target: Aptitude, Current Affairs, Technical topics");
  console.log("Cost: $0 (free scraping + free AI extraction)");
  console.log("");
  console.log("=".repeat(80));

  // Focus on topics that have good open-source availability
  const priorityTopics = [
    "Quantitative Aptitude",
    "Logical Reasoning",
    "Verbal Ability",
    "Current Affairs",
    "Data Structures",
    "Algorithms",
    "Banking Awareness",
    "General Knowledge",
  ];

  let totalInserted = 0;
  let topicsProcessed = 0;

  for (const category of examCategories) {
    for (const exam of category.exams) {
      for (const subject of exam.subjects) {
        for (const topic of subject.topics) {
          // Check if topic is in priority list (partial match)
          const isPriority = priorityTopics.some(pt =>
            topic.toLowerCase().includes(pt.toLowerCase()) ||
            pt.toLowerCase().includes(topic.toLowerCase())
          );

          if (!isPriority) continue;

          // Check current count
          const result = await dbExecuteWithRetry({
            sql: `SELECT COUNT(*) as count FROM exam_questions
                  WHERE exam_id = ? AND subject_id = ? AND topic = ?`,
            args: [exam.id, subject.id, topic],
          });

          const count = Number(result.rows[0].count);

          // Only scrape if below 50 questions
          if (count >= 50) continue;

          const inserted = await scrapeTopicQuestions(
            exam.id,
            exam.name,
            subject.id,
            subject.name,
            topic,
            count
          );

          totalInserted += inserted;
          topicsProcessed++;

          // Rate limiting between topics
          await new Promise(resolve => setTimeout(resolve, 5000));

          // Stop after 20 topics to avoid overwhelming
          if (topicsProcessed >= 20) break;
        }
        if (topicsProcessed >= 20) break;
      }
      if (topicsProcessed >= 20) break;
    }
    if (topicsProcessed >= 20) break;
  }

  console.log("\n" + "=".repeat(80));
  console.log("✅ SCRAPING COMPLETE");
  console.log("=".repeat(80));
  console.log(`Topics processed: ${topicsProcessed}`);
  console.log(`Questions inserted: ${totalInserted}`);
  console.log(`Cost: $0 (free!)`);
  console.log("=".repeat(80));
}

main().then(() => process.exit(0)).catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
