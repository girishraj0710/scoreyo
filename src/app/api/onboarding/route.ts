import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getLearnerProfile,
  saveLearnerProfile,
  execute,
  getUser,
} from "@/lib/db";
import { getExamById } from "@/lib/exams";
import { v4 as uuidv4 } from "uuid";

const COOKIE_NAME = "scoreyo-user-id";

// GET - Fetch the current user's learner profile + onboarding status.
// Used by the onboarding UI to pre-fill (exam pre-filled for existing users).
export async function GET() {
  try {
    const userId = (await cookies()).get(COOKIE_NAME)?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const row = await getLearnerProfile(userId);
    const user = await getUser(userId);

    return NextResponse.json({
      onboardingCompleted: row?.onboarding_completed === true,
      examId: row?.exam_id || user?.exam_preparing_for || null,
      profile: row?.profile || null,
    });
  } catch (error) {
    console.error("[Onboarding GET] Error:", error);
    return NextResponse.json({ error: "Failed to load onboarding" }, { status: 500 });
  }
}

// POST - Save the AI Assessment Interview answers, enroll the user in their
// single target exam, and mark onboarding complete.
export async function POST(request: Request) {
  try {
    const userId = (await cookies()).get(COOKIE_NAME)?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { examId, profile } = body as {
      examId?: string;
      profile?: Record<string, any>;
    };

    if (!examId || !getExamById(examId)) {
      return NextResponse.json({ error: "A valid target exam is required" }, { status: 400 });
    }

    const fullProfile = {
      ...(profile || {}),
      // Seed the evolving-profile fields. These are updated over time from
      // real quiz/behavior data; onboarding just sets the initial baseline.
      evolving: {
        source: "onboarding",
        updatedAt: null,
      },
    };

    // Save profile + mark onboarding complete (upsert).
    await saveLearnerProfile(userId, examId, fullProfile, true);

    // One student, one exam: make this the primary enrollment.
    // Demote any prior primary, then upsert this exam as primary.
    try {
      await execute(
        `UPDATE user_enrolled_exams SET is_primary = 0 WHERE user_id = ?`,
        [userId]
      );
      await execute(
        `INSERT INTO user_enrolled_exams (id, user_id, exam_id, is_primary)
         VALUES (?, ?, ?, 1)
         ON CONFLICT (user_id, exam_id) DO UPDATE SET is_primary = 1`,
        [uuidv4(), userId, examId]
      );
    } catch (enrollError) {
      console.error("[Onboarding POST] Enrollment upsert failed:", enrollError);
      // Non-fatal: keep exam_preparing_for as the fallback source of truth.
    }

    // Keep users.exam_preparing_for in sync as the derived-current-exam fallback.
    try {
      await execute(
        `UPDATE users SET exam_preparing_for = ? WHERE id = ?`,
        [examId, userId]
      );
    } catch (e) {
      console.error("[Onboarding POST] exam_preparing_for sync failed:", e);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Onboarding POST] Error:", error);
    return NextResponse.json({ error: "Failed to save onboarding" }, { status: 500 });
  }
}
