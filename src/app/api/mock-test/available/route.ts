import { NextRequest, NextResponse } from "next/server";
import { getAllAvailableMockTests, getDynamicMockTestConfigs } from "@/lib/dynamic-mock-test-config";

/**
 * GET /api/mock-test/available
 *
 * Query params:
 * - examId (optional): Get tests for specific exam
 *
 * Returns dynamically calculated available mock tests based on question bank
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const examId = searchParams.get("examId");

    if (examId) {
      // Get tests for specific exam
      const tests = await getDynamicMockTestConfigs(examId);
      return NextResponse.json({
        examId,
        availableTests: tests.length,
        tests,
      });
    }

    // Get all exams with available tests
    const allTests = await getAllAvailableMockTests();
    return NextResponse.json({
      exams: allTests,
      totalExamsWithTests: allTests.length,
    });
  } catch (error) {
    console.error("Error fetching available mock tests:", error);
    return NextResponse.json(
      { error: "Failed to fetch mock tests" },
      { status: 500 }
    );
  }
}
