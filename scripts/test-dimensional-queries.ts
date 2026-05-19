/**
 * Test Dimensional Queries Locally
 *
 * Validates that the new dimensional model queries work correctly
 * by testing various scenarios and comparing with expected results.
 *
 * Usage:
 *   npx tsx scripts/test-dimensional-queries.ts
 *
 * Prerequisites:
 *   - Phase 4 migration completed (fact_exam_questions populated)
 *   - Dimensional tables exist in database
 */

import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

interface TestCase {
  name: string;
  examId: string;
  subjectId: string;
  topic: string;
  difficulty: string;
  limit: number;
  expectedMin: number; // Minimum questions expected
}

const testCases: TestCase[] = [
  {
    name: "JEE Physics - Kinematics",
    examId: "jee-main",
    subjectId: "jee-physics",
    topic: "Kinematics",
    difficulty: "mixed",
    limit: 10,
    expectedMin: 10,
  },
  {
    name: "NEET Physics - Mechanics (broad topic)",
    examId: "neet-ug",
    subjectId: "neet-physics",
    topic: "Mechanics",
    difficulty: "mixed",
    limit: 20,
    expectedMin: 20,
  },
  {
    name: "CAT Quantitative - Algebra",
    examId: "cat",
    subjectId: "cat-quantitative",
    topic: "Algebra",
    difficulty: "mixed",
    limit: 15,
    expectedMin: 15,
  },
  {
    name: "SSC Reasoning - Analogies",
    examId: "ssc-cgl",
    subjectId: "ssc-reasoning",
    topic: "Analogies",
    difficulty: "mixed",
    limit: 10,
    expectedMin: 10,
  },
  {
    name: "UPSC Current Affairs",
    examId: "upsc-cse",
    subjectId: "upsc-current",
    topic: "Current Affairs",
    difficulty: "hard",
    limit: 5,
    expectedMin: 5,
  },
];

async function queryOne(sql: string, args: any[] = []): Promise<any | undefined> {
  const result = await db.execute({ sql, args });
  return result.rows[0];
}

async function queryAll(sql: string, args: any[] = []): Promise<any[]> {
  const result = await db.execute({ sql, args });
  return result.rows as any[];
}

async function testDimensionalQuery(testCase: TestCase): Promise<{
  success: boolean;
  count: number;
  availableInPool: number;
  error?: string;
}> {
  try {
    const { examId, subjectId, topic, difficulty, limit } = testCase;

    const currentYear = new Date().getFullYear();
    const validityCondition = "valid_from <= ? AND (valid_until IS NULL OR valid_until >= ?)";
    const validityArgs = [currentYear, currentYear];

    // Get dimension IDs
    const examDim = await queryOne(
      `SELECT id FROM dim_exams WHERE exam_code = ?`,
      [examId]
    );

    const subjectDim = await queryOne(
      `SELECT id FROM dim_subjects WHERE subject_code = ?`,
      [subjectId]
    );

    if (!examDim || !subjectDim) {
      return {
        success: false,
        count: 0,
        availableInPool: 0,
        error: `Exam or subject not found: exam=${examId}, subject=${subjectId}`,
      };
    }

    const examDimId = examDim.id;
    const subjectDimId = subjectDim.id;

    // Find matching topics
    const topicIds = await queryAll(
      `SELECT DISTINCT t.id
       FROM dim_topics t
       JOIN bridge_exam_subject_topic b ON t.id = b.topic_id
       WHERE b.exam_id = ?
         AND b.subject_id = ?
         AND (t.topic_name = ? OR t.topic_name LIKE ?)`,
      [examDimId, subjectDimId, topic, `%${topic}%`]
    );

    if (topicIds.length === 0) {
      return {
        success: false,
        count: 0,
        availableInPool: 0,
        error: `No topics found matching: ${topic}`,
      };
    }

    const topicIdList = topicIds.map((t: any) => t.id).join(',');

    // Get available count
    const countResult = await queryOne(
      `SELECT COUNT(*) as cnt
       FROM fact_exam_questions q
       WHERE q.topic_id IN (${topicIdList})
         AND q.${validityCondition}`,
      validityArgs
    );

    const availableInPool = Number(countResult?.cnt || 0);

    // Get sample questions
    const rows = await queryAll(
      difficulty === "mixed"
        ? `SELECT q.*
           FROM fact_exam_questions q
           WHERE q.topic_id IN (${topicIdList})
             AND q.${validityCondition}
           ORDER BY RANDOM()
           LIMIT ?`
        : `SELECT q.*
           FROM fact_exam_questions q
           WHERE q.topic_id IN (${topicIdList})
             AND q.difficulty = ?
             AND q.${validityCondition}
           ORDER BY RANDOM()
           LIMIT ?`,
      difficulty === "mixed"
        ? [...validityArgs, limit]
        : [difficulty, ...validityArgs, limit]
    );

    return {
      success: rows.length >= testCase.expectedMin,
      count: rows.length,
      availableInPool,
    };

  } catch (error: any) {
    return {
      success: false,
      count: 0,
      availableInPool: 0,
      error: error.message,
    };
  }
}

async function runTests() {
  console.log("\n🧪 Testing Dimensional Queries\n");
  console.log("=" .repeat(80));

  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    const result = await testDimensionalQuery(testCase);

    const status = result.success ? "✅ PASS" : "❌ FAIL";
    const poolInfo = result.availableInPool > 0
      ? ` (pool: ${result.availableInPool} questions)`
      : "";

    console.log(`\n${status} ${testCase.name}`);
    console.log(`   Requested: ${testCase.limit} questions (min: ${testCase.expectedMin})`);
    console.log(`   Returned: ${result.count} questions${poolInfo}`);

    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }

    if (result.success) {
      passed++;
    } else {
      failed++;
    }
  }

  console.log("\n" + "=".repeat(80));
  console.log(`\n📊 Test Summary: ${passed} passed, ${failed} failed\n`);

  // Check dimensional tables exist and have data
  console.log("🔍 Checking dimensional tables...\n");

  const examCount = await queryOne("SELECT COUNT(*) as cnt FROM dim_exams", []);
  const subjectCount = await queryOne("SELECT COUNT(*) as cnt FROM dim_subjects", []);
  const topicCount = await queryOne("SELECT COUNT(*) as cnt FROM dim_topics", []);
  const bridgeCount = await queryOne("SELECT COUNT(*) as cnt FROM bridge_exam_subject_topic", []);
  const questionCount = await queryOne("SELECT COUNT(*) as cnt FROM fact_exam_questions", []);

  console.log(`   dim_exams: ${examCount?.cnt || 0} rows`);
  console.log(`   dim_subjects: ${subjectCount?.cnt || 0} rows`);
  console.log(`   dim_topics: ${topicCount?.cnt || 0} rows`);
  console.log(`   bridge_exam_subject_topic: ${bridgeCount?.cnt || 0} rows`);
  console.log(`   fact_exam_questions: ${questionCount?.cnt || 0} rows\n`);

  const minExpected = {
    exams: 50,
    subjects: 200,
    topics: 2000,
    bridge: 5000,
    questions: 10000,
  };

  const allTablesPopulated =
    Number(examCount?.cnt || 0) >= minExpected.exams &&
    Number(subjectCount?.cnt || 0) >= minExpected.subjects &&
    Number(topicCount?.cnt || 0) >= minExpected.topics &&
    Number(bridgeCount?.cnt || 0) >= minExpected.bridge &&
    Number(questionCount?.cnt || 0) >= minExpected.questions;

  if (allTablesPopulated) {
    console.log("✅ All dimensional tables populated\n");
  } else {
    console.log("⚠️  Some tables have fewer rows than expected");
    console.log("   This may indicate Phase 4 migration is still in progress.\n");
  }

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch((error) => {
  console.error("\n❌ Test script failed:", error);
  process.exit(1);
});
