import { NextRequest, NextResponse } from "next/server";
import { getDetailedPerformance, getUserStats, isProUser } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get("krakkify-user-id")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    // Only Pro users get detailed reports
    if (!(await isProUser(userId))) {
      return NextResponse.json(
        { error: "Performance reports are a Pro feature. Upgrade to access.", proRequired: true },
        { status: 403 }
      );
    }

    const stats = await getUserStats(userId);
    const performance = await getDetailedPerformance(userId);

    return NextResponse.json({
      stats,
      ...performance,
    });
  } catch (error) {
    console.error("Reports error:", error);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
