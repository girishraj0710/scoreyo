import { NextRequest, NextResponse } from "next/server";
import { getUserStats } from "@/lib/db";

export async function GET(request: NextRequest) {
  const userId = request.cookies.get("scoreyo-user-id")?.value;

  if (!userId) {
    return NextResponse.json(
      { error: "Authentication required", userId: null },
      { status: 401 }
    );
  }

  try {
    // Get fresh stats from database (bypass cache)
    const stats = await getUserStats(userId);

    // Show what's being calculated
    return NextResponse.json({
      success: true,
      userId,
      stats,
      breakdown: {
        questionsToday: {
          value: stats.questionsToday,
          description: "Questions answered today (based on created_at date)",
        },
        personalBest: {
          value: stats.personalBest,
          description: "Most questions answered in a single day (all time)",
        },
        streak: {
          value: stats.streak,
          description: "Current consecutive days streak",
        },
        bestStreak: {
          value: stats.bestStreak,
          description: "Longest consecutive days streak (all time)",
        },
        totalSessions: {
          value: stats.totalSessions,
          description: "Total quiz sessions completed",
        },
        totalQuestions: {
          value: stats.totalQuestions,
          description: "Total questions attempted across all sessions",
        },
        accuracy: {
          value: stats.accuracy,
          description: "Overall accuracy percentage",
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
