import { NextRequest, NextResponse } from "next/server";
import {
  getUserStats,
  getTopicMastery,
  getWeakTopics,
  getRecentSessions,
  getTopicsForReview,
  getAllMastery,
} from "@/lib/db";

export async function GET(request: NextRequest) {
  const userId = request.cookies.get("prepgenie-user-id")?.value || "default-user";
  const examId = request.nextUrl.searchParams.get("examId");

  try {
    const stats = getUserStats(userId);
    const recentSessions = getRecentSessions(userId, 20);
    const reviewTopics = getTopicsForReview(userId);

    let mastery: any[] = [];
    let weakTopics: any[] = [];

    if (examId) {
      mastery = getTopicMastery(userId, examId);
      weakTopics = getWeakTopics(userId, examId, 5);
    } else {
      mastery = getAllMastery(userId);
    }

    return NextResponse.json({
      stats,
      recentSessions,
      mastery,
      weakTopics,
      reviewTopics,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
