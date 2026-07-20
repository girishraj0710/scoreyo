import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getLearnerProfile, saveStudyPlan, getStudyPlan } from "@/lib/db";
import { generateStudyPlan } from "@/lib/study-plan-generator";

const COOKIE_NAME = "scoreyo-user-id";

// POST - Generate (or regenerate) the personalized study plan from the saved
// learner profile. Called right after onboarding submit; safe to re-call.
export async function POST() {
  try {
    const userId = (await cookies()).get(COOKIE_NAME)?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const row = await getLearnerProfile(userId);
    if (!row?.exam_id) {
      return NextResponse.json({ error: "Complete onboarding first" }, { status: 400 });
    }

    const profile = { examId: row.exam_id, ...(row.profile || {}) };
    const plan = await generateStudyPlan(profile);
    await saveStudyPlan(userId, row.exam_id, plan);

    return NextResponse.json({ success: true, plan });
  } catch (error) {
    console.error("[StudyPlan generate] Error:", error);
    return NextResponse.json({ error: "Failed to generate study plan" }, { status: 500 });
  }
}

// GET - Fetch the stored plan for the personalized home.
export async function GET() {
  try {
    const userId = (await cookies()).get(COOKIE_NAME)?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const row = await getStudyPlan(userId);
    return NextResponse.json({ plan: row?.plan || null });
  } catch (error) {
    console.error("[StudyPlan GET] Error:", error);
    return NextResponse.json({ error: "Failed to load study plan" }, { status: 500 });
  }
}
