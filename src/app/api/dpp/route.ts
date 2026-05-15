import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@libsql/client";
import { generateQuiz } from "@/lib/quiz-generator";
import { v4 as uuidv4 } from "uuid";
import { updateBadgeStats, getBadgeStats, unlockBadge, getUserBadges } from "@/lib/db";
import { checkBadges } from "@/lib/achievements";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Get today's DPP (or create if doesn't exist)
export async function GET(request: Request) {
  try {
    const userId = (await cookies()).get("prepgenie-user-id")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Check if DPP exists for today
    const existingDpp = await db.execute({
      sql: `SELECT * FROM daily_practice_problems WHERE date = ?`,
      args: [today]
    });

    let dpp;
    if (existingDpp.rows.length > 0) {
      dpp = existingDpp.rows[0];
    } else {
      // Generate new DPP for today
      dpp = await generateDailyDPP(today);
    }

    // Check if user has completed it
    const completion = await db.execute({
      sql: `SELECT * FROM dpp_completions WHERE user_id = ? AND dpp_id = ?`,
      args: [userId, dpp.id]
    });

    // Get user's streak
    const streak = await getUserDPPStreak(userId);

    return NextResponse.json({
      dpp: {
        id: dpp.id,
        date: dpp.date,
        title: dpp.title,
        exam: dpp.exam_id,
        subject: dpp.subject_id,
        topic: dpp.topic,
        questions: JSON.parse(dpp.questions as string),
        duration: dpp.duration_minutes,
      },
      completed: completion.rows.length > 0,
      completionData: completion.rows[0] || null,
      streak
    });

  } catch (error) {
    console.error("[DPP API] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Submit DPP completion
export async function POST(request: Request) {
  try {
    const userId = (await cookies()).get("prepgenie-user-id")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { dppId, score, totalQuestions } = await request.json();

    if (!dppId || typeof score !== 'number' || typeof totalQuestions !== 'number') {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Check if already completed
    const existing = await db.execute({
      sql: `SELECT id FROM dpp_completions WHERE user_id = ? AND dpp_id = ?`,
      args: [userId, dppId]
    });

    if (existing.rows.length > 0) {
      return NextResponse.json({ error: "Already completed" }, { status: 400 });
    }

    // Record completion
    await db.execute({
      sql: `INSERT INTO dpp_completions (user_id, dpp_id, score, total_questions)
            VALUES (?, ?, ?, ?)`,
      args: [userId, dppId, score, totalQuestions]
    });

    // ── Badge Tracking ──────────────────────────────────────
    const hour = new Date().getHours();
    const badgeUpdates: any = {};

    // Early bird badge (before 8 AM)
    if (hour < 8) {
      badgeUpdates.earlyDPPs = 1;
    }

    if (Object.keys(badgeUpdates).length > 0) {
      await updateBadgeStats(userId, badgeUpdates);
    }

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

    // Calculate new streak
    const streak = await getUserDPPStreak(userId);

    return NextResponse.json({
      success: true,
      streak,
      score,
      percentage: Math.round((score / totalQuestions) * 100),
      newBadges,
    });

  } catch (error) {
    console.error("[DPP API] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Helper: Generate today's DPP
async function generateDailyDPP(date: string) {
  // Rotate through popular exam topics
  const dppTemplates = [
    { exam: 'jee-main', subject: 'jee-physics', topic: 'Mechanics', title: 'Physics: Mechanics Basics' },
    { exam: 'neet-ug', subject: 'neet-biology', topic: 'Cell Biology', title: 'Biology: Cell Structure' },
    { exam: 'jee-main', subject: 'jee-chemistry', topic: 'Organic Chemistry', title: 'Chemistry: Organic Reactions' },
    { exam: 'upsc-prelims', subject: 'upsc-history', topic: 'Modern India', title: 'History: Independence Movement' },
    { exam: 'ssc-cgl', subject: 'ssc-reasoning', topic: 'Logical Reasoning', title: 'Reasoning: Pattern Recognition' },
    { exam: 'cat', subject: 'cat-quant', topic: 'Arithmetic', title: 'Quant: Number Systems' },
    { exam: 'gate-cs', subject: 'gate-ds', topic: 'Data Structures', title: 'DS: Arrays & Linked Lists' },
  ];

  // Pick template based on date (cycles through list)
  const dayOfYear = Math.floor((new Date(date).getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const template = dppTemplates[dayOfYear % dppTemplates.length];

  // Generate 10 questions
  const questions = await generateQuiz(
    template.exam,
    template.subject,
    template.topic,
    10,
    'mixed'
  );

  const id = uuidv4();

  await db.execute({
    sql: `INSERT INTO daily_practice_problems (id, date, title, exam_id, subject_id, topic, questions, duration_minutes)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [id, date, template.title, template.exam, template.subject, template.topic, JSON.stringify(questions), 10]
  });

  return { id, date, title: template.title, exam_id: template.exam, subject_id: template.subject, topic: template.topic, questions: JSON.stringify(questions), duration_minutes: 10 };
}

// Helper: Calculate user's DPP streak
async function getUserDPPStreak(userId: string): Promise<number> {
  const completions = await db.execute({
    sql: `SELECT DATE(completed_at) as date
          FROM dpp_completions
          WHERE user_id = ?
          ORDER BY completed_at DESC
          LIMIT 30`,
    args: [userId]
  });

  if (completions.rows.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < completions.rows.length; i++) {
    const completionDate = new Date(completions.rows[i].date as string);
    completionDate.setHours(0, 0, 0, 0);

    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - streak);

    if (completionDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
