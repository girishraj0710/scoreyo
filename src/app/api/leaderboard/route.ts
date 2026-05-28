import { NextRequest, NextResponse } from "next/server";
import { getPersonalBests, getLongestStreak, getMilestones, getLeaderboard, getUserStats } from "@/lib/db";

export async function GET(request: NextRequest) {
  const userId = request.cookies.get("prepgenie-user-id")?.value;

  if (!userId) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const personalBests = await getPersonalBests(userId);
    const longestStreak = await getLongestStreak(userId);
    const milestones = await getMilestones(userId);
    const leaderboard = await getLeaderboard();
    const stats = await getUserStats(userId);

    return NextResponse.json({
      personalBests,
      longestStreak,
      milestones,
      leaderboard,
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
