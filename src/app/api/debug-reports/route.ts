import { NextRequest, NextResponse } from "next/server";
import { getDetailedPerformance, getUserStats, isProUser } from "@/lib/db";

export async function GET(request: NextRequest) {
  const userId = request.cookies.get("krakkify-user-id")?.value;

  if (!userId) {
    return NextResponse.json(
      { error: "Authentication required", userId: null },
      { status: 401 }
    );
  }

  const debugInfo: any = {
    userId,
    steps: [],
    errors: [],
  };

  try {
    // Step 1: Check Pro status
    debugInfo.steps.push("Checking Pro status...");
    const isPro = await isProUser(userId);
    debugInfo.isPro = isPro;
    debugInfo.steps.push(`Pro status: ${isPro}`);

    if (!isPro) {
      debugInfo.note = "User is not Pro - reports require Pro subscription";
    }

    // Step 2: Get user stats
    debugInfo.steps.push("Fetching user stats...");
    try {
      const stats = await getUserStats(userId);
      debugInfo.stats = stats;
      debugInfo.steps.push(`Stats fetched: ${stats.totalSessions} sessions`);
    } catch (error: any) {
      debugInfo.errors.push({ step: "getUserStats", error: error.message, stack: error.stack });
    }

    // Step 3: Get detailed performance
    debugInfo.steps.push("Fetching detailed performance...");
    try {
      const performance = await getDetailedPerformance(userId);
      debugInfo.performance = {
        subjectBreakdownCount: performance.subjectBreakdown.length,
        dailyActivityCount: performance.dailyActivity.length,
        difficultyBreakdownCount: performance.difficultyBreakdown.length,
        accuracyTrendCount: performance.accuracyTrend.length,
        strongTopicsCount: performance.strongTopics.length,
        weakTopicsCount: performance.weakTopics.length,
        mockTestHistoryCount: performance.mockTestHistory.length,
      };
      debugInfo.performanceData = performance;
      debugInfo.steps.push("Performance data fetched successfully");
    } catch (error: any) {
      debugInfo.errors.push({ step: "getDetailedPerformance", error: error.message, stack: error.stack });
    }

    return NextResponse.json({
      success: debugInfo.errors.length === 0,
      debugInfo,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      debugInfo,
    }, { status: 500 });
  }
}
