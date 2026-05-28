#!/usr/bin/env tsx
/**
 * PrepGenie - Targeted Question Gap Filler (Ollama)
 *
 * Identifies topics with insufficient questions and fills the gaps
 * using local Ollama AI. More efficient than full seeding.
 *
 * Strategy:
 * 1. Scan database for topics with < MIN_QUESTIONS
 * 2. Prioritize by exam importance (JEE, NEET, UPSC first)
 * 3. Generate only what's needed to reach MIN_QUESTIONS
 * 4. Focus on exam-specific patterns
 *
 * Usage:
 *   npm run fill:gaps                    # Fill all gaps
 *   npm run fill:gaps -- 20              # Fill topics with < 20 questions
 *   npm run fill:gaps -- 30 jee-main    # Fill JEE Main topics with < 30
 */

import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

import { createClient } from "@libsql/client";
import { examCategories } from "../src/lib/exams";

// ─── Configuration ──────────────────────────────────────────
const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "gemma2:9b";
const MIN_QUESTIONS = parseInt(process.argv[2] || "25"); // Minimum questions per topic
const FILTER_EXAM_ID = process.argv[3]; // Optional: target specific exam
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || "5");

// Exam priority (higher = more important)
const EXAM_PRIORITY: Record<string, number> = {
  "jee-main": 100,
  "jee-advanced": 95,
  "neet": 90,
  "upsc-prelims": 85,
  "ssc-cgl": 80,
  "cat": 75,
  "gate": 75,
  "banking-po": 70,
  "kcet": 65,
  "mht-cet": 65,
  "comedk": 60,
  "wbjee": 60,
  "ts-eamcet": 55,
  "ap-eamcet": 55,
};

// ─── Database Client ────────────────────────────────────────
const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// ─── Exam Pattern Guidelines ────────────────────────────────
const EXAM_PATTERNS: Record<string, string> = {
  "jee-main": `JEE Main pattern: Single correct MCQs + numerical value questions. NCERT-based (40%) + moderate problem-solving (60%). Recent trends: conceptual understanding, less rote formulas. Use realistic numerical values, include units, options should be close enough to require calculation.`,
  "jee-advanced": `JEE Advanced pattern: Multi-concept integration, 3-4 concepts per question. Paragraph-based comprehension. Deep analytical thinking required. Use counter-intuitive scenarios, integrate Physics+Math or Chemistry+Math concepts.`,
  "neet": `NEET pattern: NCERT-centric (70%), direct recall + applied clinical reasoning. Biology: focus on diagrams, processes, disease mechanisms. Chemistry: focus on organic reactions, coordination chemistry. Physics: formula-based but conceptual understanding needed.`,
  "upsc-prelims": `UPSC pattern: Current affairs integration, policy analysis, multi-disciplinary. Questions are lengthy, options are close. Require elimination strategy. Focus on conceptual clarity + real-world application. Integrate history, polity, economy, geography.`,
  "ssc-cgl": `SSC CGL pattern: Speed-based calculation, formula-heavy quants. English: vocabulary, grammar, reading comprehension. General awareness: current affairs + static GK. Time pressure - questions should be solvable in 45-60 seconds max.`,
  "cat": `CAT pattern: Data Interpretation (lengthy tables/graphs), Logical Reasoning (puzzles, arrangements), Verbal Ability (RC passages 400-500 words). Focus on speed + accuracy. Unconventional problem types. Options designed to trap hasty solvers.`,
  "gate": `GATE pattern: Numerical Answer Type (NAT) - no negative marking. Formula application + numerical computation heavy. Engineering depth required. Questions test both understanding and computation accuracy. Calculator allowed - use realistic decimal answers.`,
  default: `Standard competitive exam pattern: Single correct MCQs, balance between theory (30%) and application (70%). Use proper scientific notation, realistic values, include units. Options should require careful analysis to distinguish.`,
};

// ─── Ollama API Client ──────────────────────────────────────
async function generateWithOllama(prompt: string): Promise<string> {
  const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt,
      stream: false,
      options: {
        temperature: 0.8,
        top_p: 0.9,
        top_k: 40,
        num_predict: 2048,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.response;
}

// ─── Question Generation Prompt ─────────────────────────────
function buildQuestionPrompt(
  examId: string,
  examName: string,
  subjectName: string,
  topic: string,
  difficulty: string,
  count: number
): string {
  const examPattern = EXAM_PATTERNS[examId] || EXAM_PATTERNS.default;

  return `You are an expert Indian competitive exam question creator specializing in ${examName}.

Generate ${count} EXAM-REALISTIC multiple-choice questions for:
- Exam: ${examName}
- Subject: ${subjectName}
- Topic: ${topic}
- Difficulty: ${difficulty}

🎯 EXAM PATTERN (CRITICAL - FOLLOW EXACTLY):
${examPattern}

✅ QUALITY REQUIREMENTS:
1. Match previous year papers in style, complexity, and wording
2. Use realistic numerical values (not simple 1, 2, 3)
3. Include proper units (m/s², J/mol·K, etc.)
4. Options must be close enough to require calculation/analysis
5. Incorporate typical exam traps (sign errors, unit confusion, formula misapplication)
6. Use standard constants (g=9.8 m/s², R=8.314 J/mol·K, h=6.626×10⁻³⁴ J·s, etc.)
7. For diagrams: describe clearly in text
8. Questions should take 1-3 minutes to solve (depending on exam)

📊 DIFFICULTY CALIBRATION:
- easy: Direct formula application, single concept, 70% students solve (NCERT level)
- medium: Multi-step, 2 concepts, careful calculation needed, 40% students solve
- hard: Complex, 3+ concepts, counter-intuitive, analytical thinking, 15% students solve

📝 OUTPUT (STRICT JSON FORMAT):
{
  "questions": [
    {
      "question": "A uniform rod of length 2 m and mass 4 kg is pivoted at its center. Two forces of 10 N each are applied at the ends, perpendicular to the rod but in opposite directions. What is the angular acceleration of the rod? (Moment of inertia of rod about center = ML²/12)",
      "options": ["15 rad/s²", "30 rad/s²", "7.5 rad/s²", "60 rad/s²"],
      "correctAnswer": 0,
      "explanation": {
        "logic": "Both forces create torque in the same direction of rotation. Net torque = F×(L/2) + F×(L/2) = F×L. Using τ = I×α, where I = ML²/12 for rod about center.",
        "formula": "τ = I×α, where I = ML²/12, τ = 2F×(L/2) = F×L",
        "calculation": "τ = 10×2 = 20 N·m, I = 4×(2²)/12 = 4/3 kg·m², α = τ/I = 20÷(4/3) = 15 rad/s²",
        "trapAlerts": [
          "Don't use ML²/3 (that's for end pivot, not center)",
          "Both forces create torque in same direction - don't subtract"
        ],
        "commonMistakes": [
          "Using wrong moment of inertia formula",
          "Thinking forces cancel out because they're opposite"
        ]
      }
    }
  ]
}

⚠️ CRITICAL: Output ONLY valid JSON. No markdown, no code blocks, no extra text.

Generate ${count} questions now:`;
}

// ─── Parse Response ─────────────────────────────────────────
interface GeneratedQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: {
    logic: string;
    formula: string | null;
    calculation: string | null;
    trapAlerts: string[];
    commonMistakes: string[];
  };
}

function parseQuestions(response: string): GeneratedQuestion[] {
  try {
    let cleaned = response.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/```\n?/g, "");
    }

    const parsed = JSON.parse(cleaned);

    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error("Invalid response: missing questions array");
    }

    return parsed.questions.map((q: any, idx: number) => {
      if (!q.question || !q.options || q.correctAnswer === undefined) {
        throw new Error(`Question ${idx + 1}: missing required fields`);
      }

      if (!Array.isArray(q.options) || q.options.length !== 4) {
        throw new Error(`Question ${idx + 1}: must have exactly 4 options`);
      }

      if (q.correctAnswer < 0 || q.correctAnswer > 3) {
        throw new Error(`Question ${idx + 1}: correctAnswer must be 0-3`);
      }

      const explanation = q.explanation || {};
      return {
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: {
          logic: explanation.logic || "No explanation provided",
          formula: explanation.formula || null,
          calculation: explanation.calculation || null,
          trapAlerts: Array.isArray(explanation.trapAlerts)
            ? explanation.trapAlerts
            : [],
          commonMistakes: Array.isArray(explanation.commonMistakes)
            ? explanation.commonMistakes
            : [],
        },
      };
    });
  } catch (error: any) {
    console.error("❌ Parse error:", error.message);
    return [];
  }
}

// ─── Database Functions ─────────────────────────────────────
interface TopicGap {
  examId: string;
  examName: string;
  subjectId: string;
  subjectName: string;
  topicName: string;
  currentCount: number;
  needed: number;
  topicDimId: number;
  priority: number;
}

async function findTopicGaps(): Promise<TopicGap[]> {
  const gaps: TopicGap[] = [];

  for (const category of examCategories) {
    for (const exam of category.exams) {
      if (FILTER_EXAM_ID && exam.id !== FILTER_EXAM_ID) continue;

      // Get exam dimension
      const examDim = await db.execute({
        sql: "SELECT id FROM dim_exams WHERE exam_code = ?",
        args: [exam.id],
      });

      if (examDim.rows.length === 0) continue;
      const examDimId = examDim.rows[0].id as number;

      for (const subject of exam.subjects) {
        // Get subject dimension
        const subjectDim = await db.execute({
          sql: "SELECT id FROM dim_subjects WHERE subject_code = ?",
          args: [subject.id],
        });

        if (subjectDim.rows.length === 0) continue;
        const subjectDimId = subjectDim.rows[0].id as number;

        for (const topic of subject.topics) {
          // Get or create topic dimension
          let topicDim = await db.execute({
            sql: "SELECT id FROM dim_topics WHERE topic_name = ?",
            args: [topic],
          });

          let topicDimId: number;

          if (topicDim.rows.length === 0) {
            // Topic doesn't exist - needs all questions
            await db.execute({
              sql: "INSERT INTO dim_topics (topic_name, category, scope) VALUES (?, ?, ?)",
              args: [topic, "general", "universal"],
            });

            topicDim = await db.execute({
              sql: "SELECT id FROM dim_topics WHERE topic_name = ?",
              args: [topic],
            });

            topicDimId = topicDim.rows[0].id as number;

            // Create bridge
            await db.execute({
              sql: "INSERT OR IGNORE INTO bridge_exam_subject_topic (exam_id, subject_id, topic_id) VALUES (?, ?, ?)",
              args: [examDimId, subjectDimId, topicDimId],
            });

            gaps.push({
              examId: exam.id,
              examName: exam.fullName,
              subjectId: subject.id,
              subjectName: subject.name,
              topicName: topic,
              currentCount: 0,
              needed: MIN_QUESTIONS,
              topicDimId,
              priority: EXAM_PRIORITY[exam.id] || 50,
            });
            continue;
          }

          topicDimId = topicDim.rows[0].id as number;

          // Ensure bridge exists
          await db.execute({
            sql: "INSERT OR IGNORE INTO bridge_exam_subject_topic (exam_id, subject_id, topic_id) VALUES (?, ?, ?)",
            args: [examDimId, subjectDimId, topicDimId],
          });

          // Count existing questions
          const countResult = await db.execute({
            sql: "SELECT COUNT(*) as count FROM fact_exam_questions WHERE topic_id = ?",
            args: [topicDimId],
          });

          const currentCount = (countResult.rows[0].count as number) || 0;

          if (currentCount < MIN_QUESTIONS) {
            gaps.push({
              examId: exam.id,
              examName: exam.fullName,
              subjectId: subject.id,
              subjectName: subject.name,
              topicName: topic,
              currentCount,
              needed: MIN_QUESTIONS - currentCount,
              topicDimId,
              priority: EXAM_PRIORITY[exam.id] || 50,
            });
          }
        }
      }
    }
  }

  // Sort by priority (high to low), then by gap size (large to small)
  return gaps.sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return b.needed - a.needed;
  });
}

async function saveQuestions(
  topicId: number,
  questions: GeneratedQuestion[],
  difficulty: string
): Promise<number> {
  const currentYear = new Date().getFullYear();
  let savedCount = 0;

  // Get existing questions
  const existing = await db.execute({
    sql: "SELECT question FROM fact_exam_questions WHERE topic_id = ?",
    args: [topicId],
  });

  const existingTexts = new Set(
    existing.rows.map((r: any) => r.question?.toLowerCase().trim())
  );

  const statements = [];

  for (const q of questions) {
    const questionText = q.question.toLowerCase().trim();
    if (existingTexts.has(questionText)) continue;

    statements.push({
      sql: `INSERT INTO fact_exam_questions
            (topic_id, question, options, correct_answer, explanation,
             difficulty, source, valid_from, valid_until)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        topicId,
        q.question,
        JSON.stringify(q.options),
        q.correctAnswer,
        JSON.stringify(q.explanation),
        difficulty,
        `ollama-${OLLAMA_MODEL}`,
        currentYear,
        currentYear + 10,
      ],
    });

    existingTexts.add(questionText);
    savedCount++;
  }

  if (statements.length > 0) {
    await db.batch(statements as any, "write");
  }

  return savedCount;
}

// ─── Fill Gap Logic ─────────────────────────────────────────
async function fillGap(gap: TopicGap): Promise<void> {
  console.log(`\n📝 ${gap.examName} > ${gap.subjectName} > ${gap.topicName}`);
  console.log(`   Current: ${gap.currentCount} | Target: ${MIN_QUESTIONS} | Need: ${gap.needed}`);

  // Distribute questions by difficulty
  const easyCount = Math.floor(gap.needed * 0.4);
  const mediumCount = Math.floor(gap.needed * 0.4);
  const hardCount = gap.needed - easyCount - mediumCount;

  const distribution = [
    { difficulty: "easy", count: easyCount },
    { difficulty: "medium", count: mediumCount },
    { difficulty: "hard", count: hardCount },
  ];

  let totalSaved = 0;

  for (const { difficulty, count } of distribution) {
    if (count === 0) continue;

    console.log(`\n   🎯 Generating ${count} ${difficulty} questions...`);

    const batches = Math.ceil(count / BATCH_SIZE);

    for (let batch = 0; batch < batches; batch++) {
      const questionsInBatch = Math.min(BATCH_SIZE, count - batch * BATCH_SIZE);

      try {
        console.log(`      Batch ${batch + 1}/${batches} (${questionsInBatch} questions)...`);

        const prompt = buildQuestionPrompt(
          gap.examId,
          gap.examName,
          gap.subjectName,
          gap.topicName,
          difficulty,
          questionsInBatch
        );

        const response = await generateWithOllama(prompt);
        const questions = parseQuestions(response);

        if (questions.length === 0) {
          console.error(`      ❌ No valid questions in this batch`);
          continue;
        }

        console.log(`      ✅ Parsed ${questions.length} questions`);

        const saved = await saveQuestions(gap.topicDimId, questions, difficulty);
        totalSaved += saved;

        console.log(`      💾 Saved ${saved} new questions`);

        // Rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error: any) {
        console.error(`      ❌ Batch ${batch + 1} failed:`, error.message);
      }
    }
  }

  const finalResult = await db.execute({
    sql: "SELECT COUNT(*) as count FROM fact_exam_questions WHERE topic_id = ?",
    args: [gap.topicDimId],
  });

  const finalCount = (finalResult.rows[0].count as number) || 0;
  console.log(`   ✅ Complete: ${finalCount} total (${totalSaved} new)`);
}

// ─── Main ───────────────────────────────────────────────────
async function main() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   PrepGenie - Question Gap Filler (Ollama)                ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

Configuration:
  • Ollama Host: ${OLLAMA_HOST}
  • Model: ${OLLAMA_MODEL}
  • Minimum Questions per Topic: ${MIN_QUESTIONS}
  • Batch Size: ${BATCH_SIZE}
  ${FILTER_EXAM_ID ? `• Filtering Exam: ${FILTER_EXAM_ID}` : "• Processing ALL exams"}
`);

  // Check Ollama
  try {
    console.log("🔍 Checking Ollama...");
    const testResponse = await fetch(`${OLLAMA_HOST}/api/tags`);
    if (!testResponse.ok) throw new Error("Ollama not responding");
    console.log("✅ Ollama connected\n");
  } catch (error: any) {
    console.error(`❌ Ollama error: ${error.message}`);
    console.error(`Run: ollama serve`);
    process.exit(1);
  }

  // Find gaps
  console.log("🔍 Scanning database for topics with insufficient questions...\n");
  const gaps = await findTopicGaps();

  if (gaps.length === 0) {
    console.log(`
✅ No gaps found! All topics have at least ${MIN_QUESTIONS} questions.

To increase the threshold:
  npm run fill:gaps -- 50  # Fill topics with < 50 questions
`);
    return;
  }

  // Summary
  console.log(`Found ${gaps.length} topics needing questions:\n`);

  const totalNeeded = gaps.reduce((sum, g) => sum + g.needed, 0);
  const byExam = gaps.reduce((acc, g) => {
    acc[g.examName] = (acc[g.examName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log(`Total questions needed: ${totalNeeded}`);
  console.log(`\nBreakdown by exam:`);
  Object.entries(byExam)
    .sort((a, b) => b[1] - a[1])
    .forEach(([exam, count]) => {
      console.log(`  • ${exam}: ${count} topics`);
    });

  console.log(`\n${"=".repeat(80)}\n`);

  // Fill gaps
  const startTime = Date.now();

  for (let i = 0; i < gaps.length; i++) {
    const gap = gaps[i];
    console.log(`\n[${i + 1}/${gaps.length}] Priority ${gap.priority}`);
    await fillGap(gap);
  }

  const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(2);

  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   ✅ Gap Filling Complete!                                 ║
║                                                            ║
║   Processed: ${gaps.length} topics                                ║
║   Duration: ${duration} minutes                                  ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
`);
}

main().catch((error) => {
  console.error("\n❌ Fatal error:", error);
  process.exit(1);
});
