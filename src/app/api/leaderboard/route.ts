import { NextRequest, NextResponse } from "next/server";
import { getPersonalBests, getLongestStreak, getMilestones, getLeaderboard, getUserStats } from "@/lib/db";

export async function GET(request: NextRequest) {
  const userId = request.cookies.get("prepgenie-user-id")?.value || "default-user";

  try {
    const personalBests = getPersonalBests(userId);
    const longestStreak = getLongestStreak(userId);
    const milestones = getMilestones(userId);
    const leaderboard = getLeaderboard();
    const stats = getUserStats(userId);

    return NextResponse.json({
      personalBests,
      longestStreak,
      milestones,
      leaderboard,
      currentUserId: userId,
      stats,
    });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
