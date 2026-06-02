import { NextRequest, NextResponse } from "next/server";
import { queryAll } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const userId = request.cookies.get("prepgenie-user-id")?.value;

  if (!userId) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    // Get all quiz sessions to calculate streak
    // Use DISTINCT to get unique dates
    const sessions = await queryAll(
      `SELECT DISTINCT DATE(created_at) as date
       FROM quiz_sessions
       WHERE user_id = ?
       ORDER BY date DESC`,
      [userId]
    );

    console.log(`[Streak Calendar] User ${userId} has ${sessions.length} unique study days`);

    if (sessions.length === 0) {
      return NextResponse.json({
        currentStreak: 0,
        longestStreak: 0,
        totalDays: 0,
        last30Days: Array(30).fill(false),
      });
    }

    // Get unique dates (user studied on these days)
    // Normalize to YYYY-MM-DD format for consistent comparison
    const uniqueDates = new Set(
      sessions.map((s) => {
        // PostgreSQL returns Date objects or ISO strings
        if (s.date instanceof Date) {
          return s.date.toISOString().split("T")[0];
        }
        return String(s.date).split("T")[0];
      })
    );
    const totalDays = uniqueDates.size;

    console.log(`[Streak Calendar] Unique dates:`, Array.from(uniqueDates).slice(0, 5));

    // Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if user studied today or yesterday (allow one day gap)
    let checkDate = new Date(today);
    const todayStr = checkDate.toISOString().split("T")[0];

    // If didn't study today, check yesterday
    if (!uniqueDates.has(todayStr)) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Count consecutive days backwards
    while (true) {
      const dateStr = checkDate.toISOString().split("T")[0];
      if (uniqueDates.has(dateStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;

    // Sort all dates
    const allDates = Array.from(uniqueDates).sort();

    for (let i = 0; i < allDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prevDate = new Date(allDates[i - 1]);
        const currDate = new Date(allDates[i]);
        const diffDays = Math.floor(
          (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    console.log(`[Streak Calendar] Current streak: ${currentStreak}, Longest: ${longestStreak}, Total days: ${totalDays}`);

    // Get last 30 days status
    const last30Days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      last30Days.push(uniqueDates.has(dateStr));
    }

    return NextResponse.json({
      currentStreak,
      longestStreak,
      totalDays,
      last30Days,
    });
  } catch (error) {
    console.error("Streak calendar error:", error);
    return NextResponse.json(
      { error: "Failed to fetch streak data" },
      { status: 500 }
    );
  }
}
