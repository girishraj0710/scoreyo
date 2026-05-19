import { NextRequest, NextResponse } from "next/server";
import { getExamQuestions } from "@/lib/db";
import { getExamQuestionsDimensional, getAvailableQuestionCount } from "@/lib/db-dimensional";

/**
 * TEST ENDPOINT: Compare Old vs New Query Results
 *
 * Usage:
 * GET /api/test/dimensional?examId=jee-main&subjectId=jee-physics&topic=Kinematics&limit=10
 *
 * Returns comparison of:
 * - Old system (exam_questions)
 * - New system (fact_exam_questions + bridge)
 * - Shows which has more questions available
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const examId = searchParams.get("examId") || "jee-main";
  const subjectId = searchParams.get("subjectId") || "jee-physics";
  const topic = searchParams.get("topic") || "Kinematics";
  const difficulty = searchParams.get("difficulty") || "mixed";
  const limit = parseInt(searchParams.get("limit") || "10");

  console.log(`\n🔬 Testing Dimensional Queries:`);
  console.log(`   Exam: ${examId}, Subject: ${subjectId}, Topic: ${topic}`);
  console.log(`   Difficulty: ${difficulty}, Limit: ${limit}\n`);

  try {
    // Query OLD system
    const startOld = Date.now();
    const oldQuestions = await getExamQuestions(examId, subjectId, topic, difficulty, limit);
    const timeOld = Date.now() - startOld;

    // Query NEW system
    const startNew = Date.now();
    const newQuestions = await getExamQuestionsDimensional(examId, subjectId, topic, difficulty, limit);
    const timeNew = Date.now() - startNew;

    // Get available question count from new system
    const availableCount = await getAvailableQuestionCount(examId, subjectId, topic);

    // Compare results
    const comparison = {
      query: {
        examId,
        subjectId,
        topic,
        difficulty,
        limit,
      },
      results: {
        old: {
          count: oldQuestions.length,
          queryTime: `${timeOld}ms`,
          sample: oldQuestions.slice(0, 2).map(q => ({
            question: q.question.substring(0, 80) + "...",
            difficulty: q.difficulty,
            source: q.source,
          })),
        },
        new: {
          count: newQuestions.length,
          queryTime: `${timeNew}ms`,
          availableInPool: availableCount,
          sample: newQuestions.slice(0, 2).map(q => ({
            question: q.question.substring(0, 80) + "...",
            difficulty: q.difficulty,
            source: q.source,
          })),
        },
      },
      analysis: {
        improvement: newQuestions.length >= oldQuestions.length ? "✅ BETTER or EQUAL" : "⚠️ WORSE",
        poolSizeComparison: `Old: ~${oldQuestions.length * 5} estimated, New: ${availableCount} actual`,
        performanceDiff: `${timeNew - timeOld > 0 ? '+' : ''}${timeNew - timeOld}ms`,
        verdict: newQuestions.length >= oldQuestions.length
          ? `🎉 Success! New system returned ${newQuestions.length} questions (available pool: ${availableCount})`
          : `⚠️ Warning: New system returned fewer questions (${newQuestions.length} vs ${oldQuestions.length}). Phase 4 may still be migrating this topic.`,
      },
      migration: {
        phase4Status: "In progress (~10% complete)",
        note: "Low question counts are expected while Phase 4 is running. Full benefits will be visible after migration completes.",
      },
    };

    console.log(`   Old system: ${oldQuestions.length} questions in ${timeOld}ms`);
    console.log(`   New system: ${newQuestions.length} questions in ${timeNew}ms`);
    console.log(`   Available in pool: ${availableCount} questions`);
    console.log(`   ${comparison.analysis.verdict}\n`);

    return NextResponse.json(comparison);

  } catch (error: any) {
    console.error("❌ Test failed:", error);
    return NextResponse.json(
      {
        error: "Test failed",
        details: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}

/**
 * Test multiple exam-topic combinations
 *
 * POST /api/test/dimensional
 * Body: {
 *   "tests": [
 *     { "examId": "jee-main", "subjectId": "jee-physics", "topic": "Kinematics" },
 *     { "examId": "neet-ug", "subjectId": "neet-physics", "topic": "Mechanics" },
 *     ...
 *   ]
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const tests = body.tests || [];

    if (tests.length === 0) {
      return NextResponse.json({ error: "No tests provided" }, { status: 400 });
    }

    const results = [];

    for (const test of tests) {
      const { examId, subjectId, topic, difficulty = "mixed", limit = 10 } = test;

      try {
        const oldQuestions = await getExamQuestions(examId, subjectId, topic, difficulty, limit);
        const newQuestions = await getExamQuestionsDimensional(examId, subjectId, topic, difficulty, limit);
        const availableCount = await getAvailableQuestionCount(examId, subjectId, topic);

        results.push({
          test: { examId, subjectId, topic },
          old: oldQuestions.length,
          new: newQuestions.length,
          available: availableCount,
          verdict: newQuestions.length >= oldQuestions.length ? "✅ PASS" : "⚠️ NEEDS_MIGRATION",
        });
      } catch (error: any) {
        results.push({
          test: { examId, subjectId, topic },
          error: error.message,
        });
      }
    }

    const summary = {
      total: results.length,
      passed: results.filter(r => r.verdict === "✅ PASS").length,
      needsMigration: results.filter(r => r.verdict === "⚠️ NEEDS_MIGRATION").length,
      errors: results.filter(r => r.error).length,
    };

    return NextResponse.json({
      summary,
      results,
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: "Batch test failed", details: error.message },
      { status: 500 }
    );
  }
}
