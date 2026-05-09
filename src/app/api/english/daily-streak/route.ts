import { NextRequest, NextResponse } from "next/server";
import { getEnglishDailyStreak } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get("prepgenie-user-id")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const streakData = await getEnglishDailyStreak(userId);
    const today = new Date().toISOString().split("T")[0];

    const todayRecord = streakData.find(r => r.date === today);
    const streak = streakData.length > 0 ? streakData[0].streak_days : 0;

    return NextResponse.json({
      streak,
      todayCompleted: !!todayRecord,
      history: streakData,
    });
  } catch (error) {
    console.error("Error fetching daily streak:", error);
    return NextResponse.json({ error: "Failed to fetch streak" }, { status: 500 });
  }
}
