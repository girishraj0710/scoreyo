import { NextRequest, NextResponse } from "next/server";
import {
  getUserStats,
  getTopicMastery,
  getWeakTopics,
  getRecentSessions,
  getTopicsForReview,
  getAllMastery,
} from "@/lib/db";
import { getCached, setCached, CacheKeys } from "@/lib/redis";

export async function GET(request: NextRequest) {
  const userId = request.cookies.get("prepgenie-user-id")?.value;

  if (!userId) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  const examId = request.nextUrl.searchParams.get("examId");

  try {
    // Try cache first (5-minute TTL - balances freshness vs performance)
    const cacheKey = CacheKeys.userStats(userId);
    const cached = await getCached<any>(cacheKey);

    if (cached && (!examId || cached.examId === examId)) {
      console.log(`[Stats API] ✓ Cache hit for user ${userId}`);
      return NextResponse.json(cached);
    }

    console.log(`[Stats API] Cache miss, querying DB for user ${userId}`);

    // Query from database
    const stats = await getUserStats(userId);

    console.log(`[Stats API] getUserStats returned streak: ${stats.streak}, bestStreak: ${stats.bestStreak}`);
    const recentSessions = await getRecentSessions(userId, 20);
    const reviewTopics = await getTopicsForReview(userId);

    let mastery: any[] = [];
    let weakTopics: any[] = [];

    if (examId) {
      mastery = await getTopicMastery(userId, examId);
      weakTopics = await getWeakTopics(userId, examId, 5);
    } else {
      mastery = await getAllMastery(userId);
    }

    const response = {
      stats,
      recentSessions,
      mastery,
      weakTopics,
      reviewTopics,
      examId: examId || null,
    };

    // Cache for 5 minutes (300 seconds)
    await setCached(cacheKey, response, 300);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
