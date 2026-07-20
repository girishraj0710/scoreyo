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
  const userId = request.cookies.get("scoreyo-user-id")?.value;

  console.log('[Stats API] === REQUEST START ===');
  console.log('[Stats API] Cookie userId:', userId);

  if (!userId) {
    console.log('[Stats API] ❌ No userId in cookie');
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  const examId = request.nextUrl.searchParams.get("examId");
  console.log('[Stats API] Exam filter:', examId || 'none');

  try {
    console.log('[Stats API] Querying DB for user:', userId);

    // Query from database
    const stats = await getUserStats(userId);

    console.log('[Stats API] ✅ Stats received:', {
      totalSessions: stats.totalSessions,
      totalQuestions: stats.totalQuestions,
      accuracy: stats.accuracy,
      streak: stats.streak
    });

    const recentSessions = await getRecentSessions(userId, 20);
    const reviewTopics = await getTopicsForReview(userId);

    console.log('[Stats API] Recent sessions count:', recentSessions?.length || 0);

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

    console.log('[Stats API] === RESPONSE ===');
    console.log('[Stats API] Sending response with totalSessions:', response.stats.totalSessions);

    return NextResponse.json(response);
  } catch (error) {
    console.error("[Stats API] ❌ ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
