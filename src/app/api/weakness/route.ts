import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { recordWeaknessType, getWeaknessSummary } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const userId = (await cookies()).get("scoreyo-user-id")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { examId, subjectId, topic, weaknessType } = await request.json();

    if (!examId || !subjectId || !topic || !weaknessType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!['calculation', 'concept', 'time', 'careless'].includes(weaknessType)) {
      return NextResponse.json({ error: "Invalid weakness type" }, { status: 400 });
    }

    await recordWeaknessType(userId, examId, subjectId, topic, weaknessType);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Weakness API] Error:", error);
    // Return error details for debugging
    return NextResponse.json({
      error: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      hint: "weakness_profiles table may not exist"
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const userId = (await cookies()).get("scoreyo-user-id")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const summary = await getWeaknessSummary(userId);

    // Calculate percentages
    const total = summary.total || 1; // Avoid division by zero
    const breakdown = {
      calculation: Math.round((summary.calculation / total) * 100),
      concept: Math.round((summary.concept / total) * 100),
      time: Math.round((summary.time / total) * 100),
      careless: Math.round((summary.careless / total) * 100),
    };

    return NextResponse.json({
      summary,
      breakdown,
      total: summary.total
    });
  } catch (error) {
    console.error("[Weakness API] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
