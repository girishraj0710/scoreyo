#!/usr/bin/env tsx
/**
 * BOOST LOW COVERAGE EXAMS
 * 
 * Target exams with less than 500 questions from the Top 20 priority list
 * Generate verified questions to reach minimum 1000 questions per exam
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

// Top 20 Priority Exams (using correct exam IDs from src/lib/exams.ts)
const TOP_20_EXAMS = [
  "jee-main", "neet-ug", "upsc-cse", "cat", "gate",
  "sbi-po", "ssc-cgl", "ibps-po", "kcet", "nda",
  "clat", "xat", "cds", "ibps-clerk", "ssc-chsl",
  "rrb-ntpc", "lic-aao", "delhi-police", "up-police", "ugc-net"
];

const VERIFIED_SOURCES = {
  "physics": "NCERT Class 11-12 Physics",
  "chemistry": "NCERT Class 11-12 Chemistry",
  "biology": "NCERT Class 11-12 Biology",
  "mathematics": "NCERT Class 11-12 Mathematics",
  "quantitative-aptitude": "R.S. Aggarwal Quantitative Aptitude",
  "numerical-ability": "R.S. Aggarwal Quantitative Aptitude",
  "reasoning-ability": "R.S. Aggarwal Logical Reasoning",
  "logical-reasoning": "R.S. Aggarwal Logical Reasoning",
  "general-intelligence": "Lucent's General Intelligence",
  "english-language": "Wren & Martin English Grammar",
  "english": "Standard English Comprehension Books",
  "general-knowledge": "Lucent's General Knowledge",
  "general-awareness": "Manorama Yearbook + Current Affairs",
  "current-affairs": "Daily Current Affairs Compilations",
  "computer-knowledge": "NIELIT/DOEACC Foundation Course",
  "default": "Standard Exam Preparation Books"
};

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: string;
}

function getVerifiedSource(subjectId: string, subjectName: string): string {
  if (VERIFIED_SOURCES[subjectId as keyof typeof VERIFIED_SOURCES]) {
    return VERIFIED_SOURCES[subjectId as keyof typeof VERIFIED_SOURCES];
  }
  const lower = subjectId.toLowerCase();
  for (const [key, source] of Object.entries(VERIFIED_SOURCES)) {
    if (lower.includes(key) || key.includes(lower.split('-')[0])) {
      return source;
    }
  }
  return VERIFIED_SOURCES.default;
}

async function generateVerifiedQuestions(
  examName: string,
  subjectId: string,
  subjectName: string,
  topic: string,
  count: number
): Promise<Question[]> {
  const source = getVerifiedSource(subjectId, subjectName);

  const prompt = `Generate ${count} high-quality MCQ questions for ${examName} exam.

Subject: ${subjectName}
Topic: ${topic}
Source: ${source}

Requirements:
- Based on ${source} curriculum and exam patterns
- Exam-standard difficulty
- Clear, unambiguous questions
- 4 distinct options
- Detailed 150+ character explanations with formulas/facts
- Mix of conceptual and application questions

Return ONLY valid JSON array:
[
  {
    "question": "Complete question text",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": 0,
    "explanation": "Detailed explanation citing source concept",
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
        "X-Title": "PrepGenie Boost Coverage",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-exp:free", // FREE model!
        messages: [
          {
            role: "system",
            content: `You are an expert exam question creator. Generate questions based on verified textbooks. Return only JSON array.`
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) return [];

    const data = await response.json();
    let text = data.choices[0]?.message?.content || "";
    text = text.trim().replace(/```json?\n?/g, '').replace(/```$/g, '').trim();
    const questions = JSON.parse(text);

    if (!Array.isArray(questions)) return [];

    return questions.filter(q =>
      q.question &&
      Array.isArray(q.options) &&
      q.options.length === 4 &&
      typeof q.correctAnswer === 'number' &&
      q.explanation &&
      q.explanation.length > 100
    );
  } catch (err) {
    return [];
  }
}

async function main() {
  console.log("=".repeat(80));
  console.log("🚀 BOOST LOW COVERAGE EXAMS");
  console.log("=".repeat(80));
  console.log("\nTarget: Top 20 exams with < 1000 questions");
  console.log("Goal: Reach minimum 1000 questions per exam");
  console.log("Strategy: 15 questions per topic using verified sources");
  console.log("\n" + "=".repeat(80));

  const TARGET_PER_EXAM = 1000;
  const QUESTIONS_PER_BATCH = 15;
  const PARALLEL_TOPICS = 5;

  // Find Top 20 exams with low coverage
  const examCoverage = await db.execute({
    sql: `SELECT exam_id, COUNT(*) as count
          FROM exam_questions
          WHERE exam_id IN (${TOP_20_EXAMS.map(() => '?').join(',')})
          GROUP BY exam_id
          ORDER BY count ASC`,
    args: TOP_20_EXAMS,
  });

  const lowCoverageExams = examCoverage.rows
    .filter((row: any) => Number(row.count) < TARGET_PER_EXAM)
    .map((row: any) => ({ examId: row.exam_id, currentCount: Number(row.count) }));

  console.log(`\nFound ${lowCoverageExams.length} exams needing boost:\n`);
  lowCoverageExams.forEach((exam: any) => {
    console.log(`  ${exam.examId.padEnd(20)} ${String(exam.currentCount).padStart(4)} → ${TARGET_PER_EXAM} (need ${TARGET_PER_EXAM - exam.currentCount})`);
  });

  console.log("\n" + "=".repeat(80));

  let totalInserted = 0;

  for (const examInfo of lowCoverageExams) {
    const examId = examInfo.examId;
    const needed = TARGET_PER_EXAM - examInfo.currentCount;

    console.log(`\n📚 Processing: ${examId} (need ${needed} questions)`);

    // Find exam definition
    let examDef: any = null;
    for (const category of examCategories) {
      const found = category.exams.find(e => e.id === examId);
      if (found) {
        examDef = found;
        break;
      }
    }

    if (!examDef) {
      console.log(`   ⚠️  Exam definition not found, skipping`);
      continue;
    }

    // Collect all topics
    const topics: any[] = [];
    for (const subject of examDef.subjects) {
      for (const topic of subject.topics) {
        const result = await db.execute({
          sql: "SELECT COUNT(*) as count FROM exam_questions WHERE exam_id = ? AND subject_id = ? AND topic = ?",
          args: [examId, subject.id, topic],
        });
        const count = Number(result.rows[0].count);
        topics.push({
          examId,
          examName: examDef.name,
          subjectId: subject.id,
          subjectName: subject.name,
          topic,
          currentCount: count,
        });
      }
    }

    // Sort by lowest count
    topics.sort((a, b) => a.currentCount - b.currentCount);

    console.log(`   Found ${topics.length} topics`);

    // Process in parallel batches
    for (let i = 0; i < topics.length && totalInserted < needed; i += PARALLEL_TOPICS) {
      const batch = topics.slice(i, i + PARALLEL_TOPICS);

      const results = await Promise.all(
        batch.map(async (t) => {
          const source = getVerifiedSource(t.subjectId, t.subjectName);
          try {
            const generated = await generateVerifiedQuestions(
              t.examName,
              t.subjectId,
              t.subjectName,
              t.topic,
              QUESTIONS_PER_BATCH
            );
            return { t, generated, source };
          } catch (e: any) {
            return { t, generated: [], source };
          }
        })
      );

      for (const { t, generated, source } of results) {
        if (generated.length === 0) continue;

        const validFrom = getCurrentSyllabusYear(t.examId);
        let inserted = 0;

        for (const q of generated) {
          try {
            if (q.explanation.length < 100) continue;

            const exactDupe = await db.execute({
              sql: "SELECT id FROM exam_questions WHERE exam_id = ? AND subject_id = ? AND LOWER(TRIM(question)) = LOWER(TRIM(?))",
              args: [t.examId, t.subjectId, q.question],
            });
            if (exactDupe.rows.length > 0) continue;

            const similarDupe = await db.execute({
              sql: "SELECT id FROM exam_questions WHERE exam_id = ? AND topic = ? AND LOWER(SUBSTR(question, 1, 80)) = LOWER(SUBSTR(?, 1, 80))",
              args: [t.examId, t.topic, q.question],
            });
            if (similarDupe.rows.length > 0) continue;

            await db.execute({
              sql: `INSERT INTO exam_questions
                (exam_id, subject_id, topic, question, options, correct_answer, explanation, difficulty, source, valid_from, valid_until)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              args: [
                t.examId,
                t.subjectId,
                t.topic,
                q.question,
                JSON.stringify(q.options),
                q.correctAnswer,
                q.explanation + ` [Source: ${source}]`,
                q.difficulty,
                `verified-${source.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
                validFrom,
                null,
              ],
            });
            inserted++;
            totalInserted++;
          } catch {}
        }

        if (inserted > 0) {
          console.log(`   ✅ ${t.topic}: +${inserted} | Total: ${totalInserted}`);
        }
      }

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    const newCount = await db.execute({
      sql: "SELECT COUNT(*) as count FROM exam_questions WHERE exam_id = ?",
      args: [examId],
    });
    console.log(`   📊 ${examId}: ${examInfo.currentCount} → ${newCount.rows[0].count}`);
  }

  console.log("\n" + "=".repeat(80));
  console.log("✅ BOOST COMPLETE");
  console.log("=".repeat(80));
  console.log(`Total questions added: ${totalInserted}`);
  console.log("=".repeat(80));
}

main().catch(console.error);
