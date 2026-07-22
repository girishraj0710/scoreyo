import { NextRequest, NextResponse } from "next/server";
import { getEnglishAssessment, saveEnglishAssessment } from "@/lib/db";
import { generateStudyPath, type SkillKey } from "@/lib/english-study-path";

/**
 * GET /api/english/assessment
 * Returns the signed-in user's saved CEFR placement, or { completed: false }.
 */
export async function GET(request: NextRequest) {
  const userId = request.cookies.get("scoreyo-user-id")?.value;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const row = await getEnglishAssessment(userId);
    if (!row) {
      return NextResponse.json({ completed: false });
    }
    // Serve the stored path; regenerate on the fly for rows saved before the
    // path feature existed (so older placements still get a roadmap).
    const studyPath =
      row.study_path ??
      generateStudyPath(row.level, (row.skill_scores ?? {}) as Partial<Record<SkillKey, number>>);

    return NextResponse.json({
      completed: true,
      level: row.level,
      levelName: row.level_name,
      overallScore: row.overall_score,
      skillScores: row.skill_scores,
      recommendations: row.recommendations,
      confidence: row.confidence,
      studyPath,
      completedAt: row.completed_at,
    });
  } catch (error) {
    console.error("Error fetching english assessment:", error);
    return NextResponse.json({ error: "Failed to fetch assessment" }, { status: 500 });
  }
}

/**
 * POST /api/english/assessment
 * Persists the user's placement result (called on assessment completion).
 */
export async function POST(request: NextRequest) {
  const userId = request.cookies.get("scoreyo-user-id")?.value;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body?.level || !body?.levelName) {
      return NextResponse.json({ error: "Missing level" }, { status: 400 });
    }

    // Generate the personalized roadmap deterministically from the placement,
    // so it's computed once and travels with the account (no client trust).
    const studyPath = generateStudyPath(
      body.level,
      (body.skillScores ?? {}) as Partial<Record<SkillKey, number>>
    );

    await saveEnglishAssessment(userId, {
      level: body.level,
      levelName: body.levelName,
      overallScore: body.overallScore ?? 0,
      skillScores: body.skillScores ?? {},
      recommendations: body.recommendations ?? [],
      confidence: body.confidence,
      studyPath,
    });

    return NextResponse.json({ success: true, studyPath });
  } catch (error) {
    console.error("Error saving english assessment:", error);
    return NextResponse.json({ error: "Failed to save assessment" }, { status: 500 });
  }
}
