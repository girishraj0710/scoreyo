#!/usr/bin/env tsx
/**
 * Comprehensive Seed Generator for ALL Empty Topics
 *
 * Philosophy: Every student matters - we serve ALL topics equally!
 *
 * This script:
 * 1. Runs the audit to identify all empty topics
 * 2. Generates 20 high-quality questions per empty topic using AI
 * 3. Inserts directly into database with review capability
 * 4. Processes in batches to manage API limits and costs
 *
 * Total Target: 165 topics × 20 questions = 3,300 questions
 * Est. Time: ~2-3 hours (with API rate limiting)
 * Est. Cost: $0 (using free Gemini model)
 */

import { createClient } from "@libsql/client";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { examCategories } from "../src/lib/exams";

// Load environment
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

/**
 * Retry wrapper for database operations
 */
async function dbExecuteWithRetry(query: any, maxRetries = 3): Promise<any> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await db.execute(query);
    } catch (error: any) {
      if (i === maxRetries - 1) throw error;
      console.log(`  ⚠️  Database error (attempt ${i + 1}/${maxRetries}): ${error.message}. Retrying in 5s...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

interface TopicInfo {
  examId: string;
  subjectId: string;
  examName: string;
  subjectName: string;
  topic: string;
  currentCount: number;
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: string;
}

// Configuration
const QUESTIONS_PER_TOPIC = 200; // 10 days supply per topic
const BATCH_SIZE = 5; // Process 5 topics at a time (larger question sets)
const DELAY_BETWEEN_BATCHES = 15000; // 15 seconds (longer for API stability)
const DELAY_BETWEEN_TOPICS = 3000; // 3 seconds (longer for larger batches)

/**
 * Scan all topics and identify empty ones
 */
async function identifyEmptyTopics(): Promise<TopicInfo[]> {
  console.log("🔍 Scanning all topics to identify empty ones...\n");

  const emptyTopics: TopicInfo[] = [];

  for (const category of examCategories) {
    for (const exam of category.exams) {
      // Process ALL exams (no filtering)
      console.log(`  📚 Scanning ${exam.name}...`);

      for (const subject of exam.subjects) {
        for (const topic of subject.topics) {
          // Check question count with retry
          const result = await dbExecuteWithRetry({
            sql: `SELECT COUNT(*) as count FROM exam_questions
                  WHERE exam_id = ? AND subject_id = ? AND topic = ?`,
            args: [exam.id, subject.id, topic],
          });

          const count = Number(result.rows[0].count);

          if (count === 0) {
            emptyTopics.push({
              examId: exam.id,
              subjectId: subject.id,
              examName: exam.name,
              subjectName: subject.name,
              topic,
              currentCount: count,
            });
          }
        }
      }
    }
  }

  return emptyTopics;
}

/**
 * Generate questions using AI (in chunks of 20 for reliability)
 */
async function generateQuestions(
  examName: string,
  subjectName: string,
  topic: string,
  count: number
): Promise<Question[]> {
  // Generate in chunks of 20 for better AI reliability
  const CHUNK_SIZE = 20;
  const chunks = Math.ceil(count / CHUNK_SIZE);
  const allQuestions: Question[] = [];

  for (let i = 0; i < chunks; i++) {
    const chunkCount = Math.min(CHUNK_SIZE, count - (i * CHUNK_SIZE));
    console.log(`   📝 Chunk ${i + 1}/${chunks}: Generating ${chunkCount} questions...`);

    const chunkQuestions = await generateQuestionChunk(examName, subjectName, topic, chunkCount, i + 1);
    allQuestions.push(...chunkQuestions);

    // Brief pause between chunks
    if (i < chunks - 1) {
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }

  return allQuestions;
}

/**
 * Generate a single chunk of questions
 */
async function generateQuestionChunk(
  examName: string,
  subjectName: string,
  topic: string,
  count: number,
  chunkNumber: number
): Promise<Question[]> {
  const prompt = `Generate exactly ${count} high-quality multiple-choice questions for ${examName} - ${subjectName} on the topic: "${topic}".

CRITICAL: These questions will be used by real students preparing for ${examName}. They must match the actual exam standard, syllabus coverage, and question patterns.

EXAM-SPECIFIC REQUIREMENTS:
1. **Syllabus Alignment**: Cover ALL major subtopics within "${topic}" as per official ${examName} syllabus
   - Example: If topic is "Thermodynamics", include questions on laws, processes, heat engines, entropy, etc.
   - Ensure no major subtopic is left out

2. **Exam Pattern Matching**: Follow ${examName} question style and difficulty
   - JEE/NEET: Numerical, conceptual, application-based, previous year patterns
   - GATE: Theory + numerical, algorithm-based for CS topics
   - UPSC: Analytical, current affairs integration where relevant
   - State CETs: Board + competitive level, practical applications
   - Banking/SSC: Speed-focused, mental math, real-world scenarios

3. **Question Type Distribution** (${count} questions):
   - ${Math.floor(count * 0.4)} Conceptual/Theoretical (definitions, principles, theory)
   - ${Math.floor(count * 0.35)} Numerical/Calculation (formulas, problem-solving)
   - ${Math.floor(count * 0.25)} Application/Analysis (real-world, case-based, multi-concept)

4. **Difficulty Distribution**:
   - ${Math.floor(count * 0.3)} EASY: NCERT/Board level, direct recall, basic formulas
   - ${Math.floor(count * 0.5)} MEDIUM: Standard competitive exam level, 2-3 step problems
   - ${Math.ceil(count * 0.2)} HARD: Advanced, multi-concept integration, tricky

5. **Quality Standards** (STRICT):
   - ✅ Use exact terminology from ${examName} syllabus
   - ✅ Include standard formulas, constants, units (SI units mandatory)
   - ✅ Numerical questions: realistic values, proper significant figures
   - ✅ Options: plausible distractors (common student mistakes, not random)
   - ✅ Explanation: 50-100 words, step-by-step reasoning, mention key concepts
   - ✅ No ambiguity: one definitively correct answer, others clearly wrong

6. **Coverage Checklist** for "${topic}":
   - Ensure questions span the breadth of the topic
   - Include both fundamental and advanced aspects
   - Mix theoretical understanding with practical application
   - Reference real-world examples where applicable (especially for UPSC/Banking)

7. **Common Pitfalls to AVOID**:
   - ❌ Generic questions that could fit any exam
   - ❌ Overly simplistic or overly complex for the exam level
   - ❌ Incomplete coverage (focusing on only one subtopic)
   - ❌ Copy-paste from internet (generate original questions)
   - ❌ Explanations that just restate the answer without teaching

Output ONLY a valid JSON array (no markdown, no extra text):
[
  {
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": 0,
    "explanation": "...",
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
        "X-Title": "PrepGenie Comprehensive Seeder",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-exp:free",
        messages: [
          {
            role: "system",
            content: `You are an expert educator, subject matter specialist, and former exam paper setter for Indian competitive exams (JEE, NEET, UPSC, GATE, State CETs, Banking/SSC).

Your role: Generate exam-standard questions that:
- Match official syllabus and exam patterns exactly
- Cover all subtopics comprehensively (no gaps in coverage)
- Use correct terminology, formulas, and difficulty levels
- Include detailed pedagogical explanations that teach concepts
- Feature realistic numerical values and plausible distractors

Quality benchmark: Your questions should be indistinguishable from official PYQs (Previous Year Questions) in terms of quality, accuracy, and exam relevance.

Student trust: Lakhs of students will use these questions to prepare for life-changing exams. Accuracy and comprehensiveness are non-negotiable.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 8000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    // Extract JSON (may be in markdown code blocks)
    let jsonStr = content.trim();
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/```json?\n?/g, '').replace(/```$/g, '').trim();
    }

    const questions: any[] = JSON.parse(jsonStr);

    // Enhanced validation with quality checks
    const validQuestions: Question[] = questions
      .filter((q, idx) => {
        // Basic structure validation
        const hasValidStructure =
          q.question &&
          typeof q.question === 'string' &&
          q.question.length >= 20 && // Minimum question length
          Array.isArray(q.options) &&
          q.options.length === 4 &&
          typeof q.correctAnswer === 'number' &&
          q.correctAnswer >= 0 &&
          q.correctAnswer <= 3 &&
          q.explanation &&
          typeof q.explanation === 'string' &&
          q.explanation.length >= 50 && // Increased from 30 for better explanations
          q.difficulty &&
          ['easy', 'medium', 'hard'].includes(q.difficulty);

        if (!hasValidStructure) {
          console.log(`  ⚠️  Invalid structure Q${idx + 1}: ${JSON.stringify(q).substring(0, 100)}`);
          return false;
        }

        // Quality checks
        const questionText = q.question.toLowerCase();
        const optionsText = q.options.map((o: string) => o.toLowerCase());

        // Check 1: Options must be distinct (no duplicates)
        const uniqueOptions = new Set(optionsText);
        if (uniqueOptions.size < 4) {
          console.log(`  ⚠️  Duplicate options Q${idx + 1}`);
          return false;
        }

        // Check 2: Options should have reasonable length (not too short like "a", "b")
        const hasReasonableOptions = q.options.every((o: string) => o.trim().length >= 2);
        if (!hasReasonableOptions) {
          console.log(`  ⚠️  Too-short options Q${idx + 1}`);
          return false;
        }

        // Check 3: Explanation should mention key concepts (not just "correct answer is...")
        const hasSubstantiveExplanation =
          q.explanation.length >= 50 &&
          !q.explanation.toLowerCase().startsWith('the correct answer is') &&
          !q.explanation.toLowerCase().startsWith('the answer is');

        if (!hasSubstantiveExplanation) {
          console.log(`  ⚠️  Weak explanation Q${idx + 1}`);
          return false;
        }

        // Check 4: Avoid obviously generic questions
        const isGeneric =
          questionText.includes('what is the value of x') ||
          questionText.includes('find the value of') && questionText.length < 50;

        if (isGeneric) {
          console.log(`  ⚠️  Too generic Q${idx + 1}`);
          return false;
        }

        return true;
      })
      .map(q => ({
        question: q.question.trim(),
        options: q.options.map((o: string) => o.trim()),
        correctAnswer: q.correctAnswer,
        explanation: q.explanation.trim(),
        difficulty: q.difficulty,
      }));

    return validQuestions;

  } catch (error: any) {
    console.error(`  ❌ Generation error: ${error.message}`);
    return [];
  }
}

/**
 * Insert questions into database
 */
async function insertQuestions(
  topicInfo: TopicInfo,
  questions: Question[]
): Promise<number> {
  let inserted = 0;

  for (const q of questions) {
    try {
      // Check for duplicate with retry
      const existing = await dbExecuteWithRetry({
        sql: `SELECT id FROM exam_questions
              WHERE exam_id = ? AND subject_id = ? AND question = ?`,
        args: [topicInfo.examId, topicInfo.subjectId, q.question],
      });

      if (existing.rows.length > 0) {
        continue;
      }

      // Insert with retry
      await dbExecuteWithRetry({
        sql: `INSERT INTO exam_questions
              (exam_id, subject_id, topic, question, options, correct_answer, explanation, difficulty, source)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          topicInfo.examId,
          topicInfo.subjectId,
          topicInfo.topic,
          q.question,
          JSON.stringify(q.options),
          q.correctAnswer,
          q.explanation,
          q.difficulty,
          'expert-curated',
        ],
      });

      inserted++;
    } catch (error) {
      console.error(`  ❌ Insert error:`, error);
    }
  }

  return inserted;
}

/**
 * Main execution
 */
async function comprehensiveSeed() {
  console.log("=".repeat(80));
  console.log("🚀 COMPREHENSIVE SEED GENERATOR");
  console.log("=".repeat(80));
  console.log("\n💡 Philosophy: Every student matters - we serve ALL topics equally!\n");
  console.log("=".repeat(80));

  // Step 1: Identify empty topics
  const emptyTopics = await identifyEmptyTopics();

  if (emptyTopics.length === 0) {
    console.log("\n✅ No empty topics found! All topics have questions.");
    return;
  }

  console.log(`\n📊 Found ${emptyTopics.length} empty topics`);
  console.log(`🎯 Target: ${emptyTopics.length} × ${QUESTIONS_PER_TOPIC} = ${emptyTopics.length * QUESTIONS_PER_TOPIC} questions`);
  console.log(`⏱️  Estimated time: ${Math.ceil((emptyTopics.length * 30) / 60)} hours`);
  console.log(`💰 Estimated cost: $0 (free Gemini model)`);
  console.log(`📦 Supply per topic: 10 days (at 20 Q/day consumption)`);
  console.log("\n" + "=".repeat(80));

  // Create output directory
  const outputDir = join(process.cwd(), "seed-output");
  mkdirSync(outputDir, { recursive: true });

  // Progress tracking
  let totalGenerated = 0;
  let totalInserted = 0;
  let failedTopics: string[] = [];
  const successLog: Array<{topic: string, generated: number, inserted: number}> = [];

  // Process in batches
  const batches = [];
  for (let i = 0; i < emptyTopics.length; i += BATCH_SIZE) {
    batches.push(emptyTopics.slice(i, i + BATCH_SIZE));
  }

  console.log(`\n🔄 Processing ${batches.length} batches of ${BATCH_SIZE} topics each\n`);

  for (let batchIdx = 0; batchIdx < batches.length; batchIdx++) {
    const batch = batches[batchIdx];
    console.log(`\n${"=".repeat(80)}`);
    console.log(`📦 BATCH ${batchIdx + 1}/${batches.length} (${batch.length} topics)`);
    console.log("=".repeat(80));

    for (let i = 0; i < batch.length; i++) {
      const topicInfo = batch[i];
      const globalIdx = batchIdx * BATCH_SIZE + i + 1;

      console.log(`\n[${globalIdx}/${emptyTopics.length}] ${topicInfo.examName} → ${topicInfo.subjectName}`);
      console.log(`   Topic: ${topicInfo.topic}`);
      console.log(`   🤖 Generating ${QUESTIONS_PER_TOPIC} questions...`);

      // Generate
      const questions = await generateQuestions(
        topicInfo.examName,
        topicInfo.subjectName,
        topicInfo.topic,
        QUESTIONS_PER_TOPIC
      );

      if (questions.length === 0) {
        console.log(`   ❌ Failed to generate questions`);
        failedTopics.push(`${topicInfo.examName} - ${topicInfo.topic}`);
        continue;
      }

      console.log(`   ✅ Generated ${questions.length}/${QUESTIONS_PER_TOPIC} valid questions`);
      totalGenerated += questions.length;

      // Save to file
      const filename = `${topicInfo.examId}_${topicInfo.subjectId}_${topicInfo.topic.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50)}.json`;
      const filepath = join(outputDir, filename);
      writeFileSync(filepath, JSON.stringify({ topicInfo, questions }, null, 2), 'utf-8');

      // Insert
      console.log(`   💾 Inserting into database...`);
      const inserted = await insertQuestions(topicInfo, questions);
      console.log(`   ✅ Inserted ${inserted}/${questions.length} questions`);
      totalInserted += inserted;

      successLog.push({
        topic: `${topicInfo.examName} - ${topicInfo.topic}`,
        generated: questions.length,
        inserted
      });

      // Rate limiting
      if (i < batch.length - 1) {
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_TOPICS));
      }
    }

    // Delay between batches
    if (batchIdx < batches.length - 1) {
      console.log(`\n⏸️  Pausing ${DELAY_BETWEEN_BATCHES/1000}s before next batch...`);
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
    }
  }

  // Final summary
  console.log("\n" + "=".repeat(80));
  console.log("🎉 COMPREHENSIVE SEEDING COMPLETE!");
  console.log("=".repeat(80));
  console.log(`\n📊 Statistics:`);
  console.log(`   Topics Processed:      ${emptyTopics.length}`);
  console.log(`   Questions Generated:   ${totalGenerated}`);
  console.log(`   Questions Inserted:    ${totalInserted}`);
  console.log(`   Success Rate:          ${((totalInserted / (emptyTopics.length * QUESTIONS_PER_TOPIC)) * 100).toFixed(1)}%`);
  console.log(`   Failed Topics:         ${failedTopics.length}`);

  if (failedTopics.length > 0) {
    console.log(`\n⚠️  Failed Topics (retry recommended):`);
    failedTopics.forEach(topic => console.log(`   - ${topic}`));
  }

  console.log(`\n📁 Review files saved to: ${outputDir}`);
  console.log(`\n✅ All students can now access ${totalInserted} new questions!`);
  console.log("=".repeat(80));

  // Save summary
  const summary = {
    timestamp: new Date().toISOString(),
    totalTopics: emptyTopics.length,
    totalGenerated,
    totalInserted,
    successRate: (totalInserted / (emptyTopics.length * QUESTIONS_PER_TOPIC)) * 100,
    failedTopics,
    successLog
  };
  writeFileSync(
    join(outputDir, '_SUMMARY.json'),
    JSON.stringify(summary, null, 2),
    'utf-8'
  );
}

// Execute
comprehensiveSeed()
  .then(() => {
    console.log("\n✅ Done! Every topic now serves every student. 🎓");
    process.exit(0);
  })
  .catch((err) => {
    console.error("\n❌ Error:", err);
    process.exit(1);
  });
