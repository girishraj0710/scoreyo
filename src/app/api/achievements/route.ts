import { NextRequest, NextResponse } from "next/server";
import { getUserBadges, getBadgeStats } from "@/lib/db";
import { BADGES, checkBadges } from "@/lib/achievements";

export async function GET(request: NextRequest) {
  const userId = request.cookies.get("prepgenie-user-id")?.value || "default-user";

  try {
    // Get user's unlocked badges
    const unlockedBadges = await getUserBadges(userId);
    const unlockedIds = new Set(unlockedBadges.map((b: any) => b.badge_id));

    // Get badge stats
    const stats = await getBadgeStats(userId);

    // Check which badges are earned
    const earnedBadges = checkBadges({
      levelsCompleted: stats.levels_completed || 0,
      streak: stats.streak || 0,
      totalQuizzes: stats.totalQuizzes || 0,
      totalQuestions: stats.totalQuestions || 0,
      highAccuracyQuizzes: stats.high_accuracy_quizzes || 0,
      veryHighAccuracyQuizzes: stats.very_high_accuracy_quizzes || 0,
      perfectQuizzes: stats.perfect_quizzes || 0,
      fastQuizzes: stats.fast_quizzes || 0,
      topicMasteries90: stats.topic_masteries_90 || 0,
      subjectMasteries80: stats.subject_masteries_80 || 0,
      earlyDPPs: stats.early_dpps || 0,
      lateQuizzes: stats.late_quizzes || 0,
      weekendSessions: stats.weekend_sessions || 0,
      mockTestsCompleted: stats.mockTestsCompleted || 0,
    });

    // Combine all badges with unlock status
    const allBadges = BADGES.map((badge) => {
      const unlocked = unlockedIds.has(badge.id);
      const unlockedData = unlockedBadges.find((b: any) => b.badge_id === badge.id);

      return {
        ...badge,
        unlocked,
        unlocked_at: unlockedData?.unlocked_at,
      };
    });

    return NextResponse.json({
      badges: allBadges,
      stats,
    });
  } catch (error) {
    console.error("Achievements error:", error);
    return NextResponse.json(
      { error: "Failed to fetch achievements" },
      { status: 500 }
    );
  }
}
