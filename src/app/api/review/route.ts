import { NextRequest, NextResponse } from "next/server";
import { getReviewSummary } from "@/lib/db";

export async function GET(request: NextRequest) {
  const userId = request.cookies.get("scoreyo-user-id")?.value;

  if (!userId) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const summary = await getReviewSummary(userId);
    return NextResponse.json(summary);
  } catch (error) {
    console.error("Review error:", error);
    return NextResponse.json(
      { error: "Failed to fetch review data" },
      { status: 500 }
    );
  }
}
