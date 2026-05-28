#!/usr/bin/env tsx
/**
 * PrepGenie - Question Seeding Script with Ollama
 *
 * This script generates high-quality exam questions using Ollama (local LLM)
 * and seeds them into the dimensional database model.
 *
 * Features:
 * - Uses Ollama API (localhost:11434) - supports Gemma, Llama3, Mistral, etc.
 * - Generates questions for all exams, subjects, and topics in exams.ts
 * - Rich explanations with logic, formulas, trap alerts, and common mistakes
 * - Batch processing with progress tracking
 * - Difficulty distribution: 40% easy, 40% medium, 20% hard
 * - Validates and stores in fact_exam_questions (dimensional model)
 *
 * Prerequisites:
 * 1. Install Ollama: https://ollama.ai/download
 * 2. Pull a model: ollama pull gemma2:9b (or llama3, mistral, etc.)
 * 3. Start Ollama: ollama serve
 *
 * Usage:
 *   npm run seed:questions              # Full seed (all exams)
 *   npm run seed:questions -- jee-main  # Specific exam
 *   npm run seed:questions -- jee-main jee-physics  # Specific exam + subject
 *   npm run seed:questions -- jee-main jee-physics "Kinematics"  # Specific topic
 *
 * Environment Variables:
 *   OLLAMA_MODEL=gemma2:9b (default)
 *   OLLAMA_HOST=http://localhost:11434 (default)
 *   QUESTIONS_PER_TOPIC=30 (default)
 *   BATCH_SIZE=5 (default - questions per API call)
 */

import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

import { createClient } from "@libsql/client";
import { examCategories } from "../src/lib/exams";

// ─── Configuration ──────────────────────────────────────────
const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "gemma2:9b"; // gemma2:9b, llama3, mistral, etc.
const QUESTIONS_PER_TOPIC = parseInt(process.env.QUESTIONS_PER_TOPIC || "30");
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || "5");

// Difficulty distribution
const DIFFICULTY_DISTRIBUTION = [
  { difficulty: "easy", count: Math.floor(QUESTIONS_PER_TOPIC * 0.4) },
  { difficulty: "medium", count: Math.floor(QUESTIONS_PER_TOPIC * 0.4) },
  { difficulty: "hard", count: Math.ceil(QUESTIONS_PER_TOPIC * 0.2) },
];

// ─── Database Client ────────────────────────────────────────
const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

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
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.response;
}

// ─── Exam Pattern Guidelines ────────────────────────────────
const EXAM_PATTERNS: Record<string, string> = {
  "jee-main": `JEE Main pattern: Numerical value questions, assertion-reasoning, single/multiple correct. Focus on NCERT + moderate problem-solving. Time: ~3 min/question. Recent trends: conceptual understanding over rote formulas.`,
  "jee-advanced": `JEE Advanced pattern: Multi-concept integration, paragraph-based, matrix-match. Extremely challenging. Time: ~4-5 min/question. Requires deep analytical skills + multiple topic integration.`,
  "neet": `NEET pattern: Single correct MCQs, fact-based + applied. NCERT-centric (60-70%). Direct recall + clinical application. Time: ~45 sec/question. Biology heavy on diagrams/processes.`,
  "upsc": `UPSC CSAT/GS pattern: Current affairs integration, policy-based, analytical. Multi-disciplinary. Lengthy options. Time: ~2 min/question. Focus on conceptual clarity + real-world application.`,
  "ssc-cgl": `SSC CGL pattern: Speed-based, formula-heavy quants, vocab/grammar in English. Time: ~50 sec/question. Direct application questions, minimal theory.`,
  "cat": `CAT pattern: Data interpretation, logical reasoning, verbal ability. Lengthy passages. Time: ~2-3 min/question. Focus on speed + accuracy, unconventional problem types.`,
  "gate": `GATE pattern: Numerical answer type (NAT), heavy on formula application + numerical computation. Engineering depth. Time: ~1.5-2 min/question. Calculator allowed.`,
  "kcet": `Karnataka CET pattern: State board syllabus, NCERT-based. Single correct MCQs. Time: ~1 min/question. Moderate difficulty, formula-centric.`,
  default: `Standard competitive exam pattern: Single correct MCQs, NCERT + moderate problem-solving. Time: ~2 min/question. Balance between theory and application.`,
};

function getExamPattern(examId: string): string {
  // Check for exact match
  if (EXAM_PATTERNS[examId]) return EXAM_PATTERNS[examId];

  // Check for partial match
  for (const [key, value] of Object.entries(EXAM_PATTERNS)) {
    if (examId.includes(key) || key.includes(examId)) {
      return value;
    }
  }

  return EXAM_PATTERNS.default;
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
  const examPattern = getExamPattern(examId);

  return `You are an expert question creator for Indian competitive exams with 10+ years of experience analyzing exam patterns.

Generate ${count} EXAM-REALISTIC multiple-choice questions for:
- Exam: ${examName} (${examId})
- Subject: ${subjectName}
- Topic: ${topic}
- Difficulty: ${difficulty}

🎯 EXAM PATTERN REQUIREMENTS:
${examPattern}

📋 QUESTION QUALITY CHECKLIST:
1. ✅ Match actual exam style (wording, length, complexity)
2. ✅ Use realistic numerical values (not 1,2,3 - use 9.8, 273.15, etc.)
3. ✅ Include units where applicable (m/s, kg, mol, etc.)
4. ✅ Options should be close enough to require calculation (not 1, 10, 100, 1000)
5. ✅ Incorporate common exam traps (sign errors, unit confusion, formula misapplication)
6. ✅ Use proper scientific notation and terminology
7. ✅ Reference standard constants (g=9.8 m/s², R=8.314 J/mol·K, etc.)
8. ✅ For Physics/Chemistry: Include diagrams description when needed
9. ✅ For Math: Use standard notation (∫, Σ, √, etc. in text form)
10. ✅ Mimic previous year question patterns

🎓 DIFFICULTY GUIDELINES:
- easy: Direct NCERT/textbook application, single concept, ~70% students solve
- medium: Multi-step, 2 concepts combined, requires careful calculation, ~40% students solve
- hard: Complex integration, 3+ concepts, counter-intuitive, ~15% students solve

📝 OUTPUT FORMAT (STRICT JSON):
{
  "questions": [
    {
      "question": "A block of mass 5 kg is placed on a frictionless inclined plane at 30° to the horizontal. What is the acceleration of the block down the plane? (g = 9.8 m/s²)",
      "options": ["4.9 m/s²", "8.5 m/s²", "9.8 m/s²", "2.45 m/s²"],
      "correctAnswer": 0,
      "explanation": {
        "logic": "On an inclined plane, the component of gravitational force along the plane is mg·sin(θ). Since the plane is frictionless, this is the net force causing acceleration: a = g·sin(θ).",
        "formula": "a = g·sin(θ) where θ = 30°",
        "calculation": "a = 9.8 × sin(30°) = 9.8 × 0.5 = 4.9 m/s²",
        "trapAlerts": [
          "Don't use cos(30°) - that's the normal force component",
          "Don't forget to multiply by sin(θ), not just use g directly"
        ],
        "commonMistakes": [
          "Using g directly (9.8 m/s²) without considering the angle",
          "Confusing perpendicular and parallel components of mg"
        ]
      }
    }
  ]
}

⚠️ CRITICAL: Output ONLY valid JSON. No markdown, no code blocks, no explanatory text.

Generate ${count} questions now:`;
}

// ─── Parse and Validate Response ────────────────────────────
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
    // Clean markdown code blocks if present
    let cleaned = response.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/```\n?/g, "");
    }

    const parsed = JSON.parse(cleaned);

    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error("Invalid response format: missing questions array");
    }

    // Validate each question
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

      // Ensure explanation format
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
    console.error("❌ Failed to parse response:", error.message);
    console.error("Raw response:", response.substring(0, 500));
    return [];
  }
}

// ─── Database Functions ─────────────────────────────────────
async function getDimensionIds(
  examId: string,
  subjectId: string,
  topic: string
): Promise<{ examDimId: number; subjectDimId: number; topicDimId: number } | null> {
  // Get exam dimension
  const examDim = await db.execute({
    sql: "SELECT id FROM dim_exams WHERE exam_code = ?",
    args: [examId],
  });

  if (examDim.rows.length === 0) {
    console.error(`❌ Exam not found in dim_exams: ${examId}`);
    return null;
  }

  // Get subject dimension
  const subjectDim = await db.execute({
    sql: "SELECT id FROM dim_subjects WHERE subject_code = ?",
    args: [subjectId],
  });

  if (subjectDim.rows.length === 0) {
    console.error(`❌ Subject not found in dim_subjects: ${subjectId}`);
    return null;
  }

  // Get or create topic dimension
  let topicDim = await db.execute({
    sql: "SELECT id FROM dim_topics WHERE topic_name = ?",
    args: [topic],
  });

  if (topicDim.rows.length === 0) {
    // Create topic
    await db.execute({
      sql: "INSERT INTO dim_topics (topic_name, category, scope) VALUES (?, ?, ?)",
      args: [topic, "general", "universal"],
    });

    topicDim = await db.execute({
      sql: "SELECT id FROM dim_topics WHERE topic_name = ?",
      args: [topic],
    });
  }

  const examDimId = examDim.rows[0].id as number;
  const subjectDimId = subjectDim.rows[0].id as number;
  const topicDimId = topicDim.rows[0].id as number;

  // Ensure bridge entry exists
  await db.execute({
    sql: "INSERT OR IGNORE INTO bridge_exam_subject_topic (exam_id, subject_id, topic_id) VALUES (?, ?, ?)",
    args: [examDimId, subjectDimId, topicDimId],
  });

  return { examDimId, subjectDimId, topicDimId };
}

async function saveQuestions(
  topicId: number,
  questions: GeneratedQuestion[],
  difficulty: string
): Promise<number> {
  const currentYear = new Date().getFullYear();
  let savedCount = 0;

  // Get existing questions for deduplication
  const existing = await db.execute({
    sql: "SELECT question FROM fact_exam_questions WHERE topic_id = ?",
    args: [topicId],
  });

  const existingTexts = new Set(
    existing.rows.map((r: any) => r.question?.toLowerCase().trim())
  );

  // Prepare batch insert
  const statements = [];

  for (const q of questions) {
    const questionText = q.question.toLowerCase().trim();

    // Skip duplicates
    if (existingTexts.has(questionText)) {
      console.log(`   ⏭️  Skipping duplicate: ${q.question.substring(0, 60)}...`);
      continue;
    }

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

// ─── Question Count Helper ──────────────────────────────────
async function getQuestionCount(topicId: number): Promise<number> {
  const result = await db.execute({
    sql: "SELECT COUNT(*) as count FROM fact_exam_questions WHERE topic_id = ?",
    args: [topicId],
  });

  return (result.rows[0].count as number) || 0;
}

// ─── Main Seeding Logic ─────────────────────────────────────
async function seedTopic(
  examId: string,
  examName: string,
  subjectId: string,
  subjectName: string,
  topic: string
): Promise<void> {
  console.log(`\n📝 Processing: ${examName} > ${subjectName} > ${topic}`);

  // Get dimension IDs
  const dims = await getDimensionIds(examId, subjectId, topic);
  if (!dims) {
    console.error(`❌ Failed to get dimension IDs - skipping topic`);
    return;
  }

  // Check existing question count
  const existingCount = await getQuestionCount(dims.topicDimId);
  console.log(`   📊 Existing questions: ${existingCount}`);

  if (existingCount >= QUESTIONS_PER_TOPIC) {
    console.log(`   ✅ Topic already has ${existingCount} questions - skipping`);
    return;
  }

  // Generate questions by difficulty
  let totalSaved = 0;

  for (const { difficulty, count } of DIFFICULTY_DISTRIBUTION) {
    console.log(`\n   🎯 Generating ${count} ${difficulty} questions...`);

    // Generate in batches
    const batches = Math.ceil(count / BATCH_SIZE);

    for (let batch = 0; batch < batches; batch++) {
      const questionsInBatch = Math.min(BATCH_SIZE, count - batch * BATCH_SIZE);

      try {
        console.log(`      Batch ${batch + 1}/${batches} (${questionsInBatch} questions)...`);

        const prompt = buildQuestionPrompt(
          examId,
          examName,
          subjectName,
          topic,
          difficulty,
          questionsInBatch
        );

        const response = await generateWithOllama(prompt);
        const questions = parseQuestions(response);

        if (questions.length === 0) {
          console.error(`      ❌ No valid questions generated in this batch`);
          continue;
        }

        console.log(`      ✅ Parsed ${questions.length} questions`);

        // Save to database
        const saved = await saveQuestions(dims.topicDimId, questions, difficulty);
        totalSaved += saved;

        console.log(`      💾 Saved ${saved} new questions`);

        // Rate limiting - avoid overwhelming Ollama
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error: any) {
        console.error(`      ❌ Batch ${batch + 1} failed:`, error.message);
      }
    }
  }

  const finalCount = await getQuestionCount(dims.topicDimId);
  console.log(`\n   ✅ Topic complete: ${finalCount} total questions (${totalSaved} new)`);
}

async function seedSubject(
  examId: string,
  examName: string,
  subjectId: string,
  subjectName: string,
  topics: string[],
  filterTopic?: string
): Promise<void> {
  console.log(`\n${"=".repeat(80)}`);
  console.log(`📚 Subject: ${examName} - ${subjectName}`);
  console.log(`${"=".repeat(80)}`);

  const topicsToProcess = filterTopic
    ? topics.filter((t) => t.toLowerCase().includes(filterTopic.toLowerCase()))
    : topics;

  if (topicsToProcess.length === 0) {
    console.log(`❌ No topics match filter: ${filterTopic}`);
    return;
  }

  console.log(`📋 Topics to process: ${topicsToProcess.length}`);

  for (const topic of topicsToProcess) {
    await seedTopic(examId, examName, subjectId, subjectName, topic);
  }
}

async function seedExam(
  examId: string,
  examName: string,
  subjects: any[],
  filterSubjectId?: string,
  filterTopic?: string
): Promise<void> {
  console.log(`\n${"#".repeat(80)}`);
  console.log(`🎓 Exam: ${examName} (${examId})`);
  console.log(`${"#".repeat(80)}`);

  const subjectsToProcess = filterSubjectId
    ? subjects.filter((s) => s.id === filterSubjectId)
    : subjects;

  if (subjectsToProcess.length === 0) {
    console.log(`❌ No subjects match filter: ${filterSubjectId}`);
    return;
  }

  console.log(`📚 Subjects to process: ${subjectsToProcess.length}`);

  for (const subject of subjectsToProcess) {
    await seedSubject(
      examId,
      examName,
      subject.id,
      subject.name,
      subject.topics,
      filterTopic
    );
  }
}

// ─── Main Entry Point ───────────────────────────────────────
async function main() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   PrepGenie - Question Seeding Script (Ollama)            ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

Configuration:
  • Ollama Host: ${OLLAMA_HOST}
  • Model: ${OLLAMA_MODEL}
  • Questions per Topic: ${QUESTIONS_PER_TOPIC}
  • Batch Size: ${BATCH_SIZE}
  • Difficulty: 40% easy, 40% medium, 20% hard

`);

  // Check Ollama connection
  try {
    console.log("🔍 Checking Ollama connection...");
    const testResponse = await fetch(`${OLLAMA_HOST}/api/tags`);
    if (!testResponse.ok) {
      throw new Error("Ollama not responding");
    }
    console.log("✅ Ollama connected\n");
  } catch (error: any) {
    console.error(`❌ Ollama connection failed: ${error.message}`);
    console.error(`
Please ensure Ollama is running:
  1. Install Ollama: https://ollama.ai/download
  2. Pull a model: ollama pull ${OLLAMA_MODEL}
  3. Start Ollama: ollama serve
`);
    process.exit(1);
  }

  // Parse CLI arguments
  const args = process.argv.slice(2);
  const filterExamId = args[0];
  const filterSubjectId = args[1];
  const filterTopic = args[2];

  if (filterExamId) {
    console.log(`🎯 Filter: Exam=${filterExamId}${filterSubjectId ? `, Subject=${filterSubjectId}` : ""}${filterTopic ? `, Topic=${filterTopic}` : ""}\n`);
  } else {
    console.log(`🌍 Processing ALL exams\n`);
  }

  // Process exams
  const startTime = Date.now();

  for (const category of examCategories) {
    for (const exam of category.exams) {
      if (filterExamId && exam.id !== filterExamId) {
        continue;
      }

      await seedExam(
        exam.id,
        exam.fullName,
        exam.subjects,
        filterSubjectId,
        filterTopic
      );
    }
  }

  const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(2);

  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   ✅ Seeding Complete!                                     ║
║                                                            ║
║   Duration: ${duration} minutes                                  ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
`);
}

// ─── Error Handling ─────────────────────────────────────────
main().catch((error) => {
  console.error("\n❌ Fatal error:", error);
  process.exit(1);
});
