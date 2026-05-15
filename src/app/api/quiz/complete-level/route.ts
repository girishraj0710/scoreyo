import { NextRequest, NextResponse } from "next/server";
import { completeQuizLevel, updateBadgeStats, getBadgeStats, unlockBadge, getUserBadges } from "@/lib/db";
import { calculateStars } from "@/lib/level-definitions";
import { checkBadges } from "@/lib/achievements";

// POST /api/quiz/complete-level
export async function POST(req: NextRequest) {
  const userId = req.cookies.get("prepgenie-user-id")?.value;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      examId,
      subjectId,
      levelNumber,
      levelType,
      correctAnswers,
      totalQuestions,
      timeTakenSeconds,
    } = body;

    if (!examId || !subjectId || !levelNumber || correctAnswers === undefined || !totalQuestions) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Calculate accuracy and stars
    const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
    const stars = calculateStars(accuracy);

    // Save level completion
    await completeQuizLevel(
      userId,
      examId,
      subjectId,
      levelNumber,
      levelType || 'normal',
      accuracy,
      stars
    );

    // ── Badge Tracking ──────────────────────────────────────
    await updateBadgeStats(userId, { levelsCompleted: 1 });

    // Check for newly earned badges
    const stats = await getBadgeStats(userId);
    const earnedBadges = checkBadges(stats);
    const userBadges = await getUserBadges(userId);
    const userBadgeIds = new Set(userBadges.map((b: any) => b.badge_id));

    const newBadges = [];
    for (const badge of earnedBadges) {
      if (!userBadgeIds.has(badge.id)) {
        const unlocked = await unlockBadge(userId, badge.id);
        if (unlocked) {
          newBadges.push({
            id: badge.id,
            name: badge.name,
            description: badge.description,
            icon: badge.icon,
            rarity: badge.rarity,
          });
        }
      }
    }

    // Check if next level should be unlocked
    const shouldUnlock = levelType === 'boss' ? accuracy >= 70 : accuracy >= 60;

    return NextResponse.json({
      success: true,
      stars,
      accuracy,
      nextLevelUnlocked: shouldUnlock,
      newBadges,
    });
  } catch (error) {
    console.error("Error completing level:", error);
    return NextResponse.json({ error: "Failed to complete level" }, { status: 500 });
  }
}
