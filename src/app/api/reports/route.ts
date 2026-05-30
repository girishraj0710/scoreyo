import { NextRequest, NextResponse } from "next/server";
import { getDetailedPerformance, getUserStats, isProUser } from "@/lib/db";

// Helper to recursively parse numeric strings to numbers
function parseNumbers(obj: any): any {
  if (obj === null || obj === undefined) return obj;

  if (Array.isArray(obj)) {
    return obj.map(parseNumbers);
  }

  if (typeof obj === 'object') {
    const parsed: any = {};
    for (const key in obj) {
      parsed[key] = parseNumbers(obj[key]);
    }
    return parsed;
  }

  // Parse numeric strings to numbers
  if (typeof obj === 'string') {
    // Check if it's a pure numeric string (integer or decimal)
    if (/^\d+$/.test(obj) || /^\d+\.\d+$/.test(obj)) {
      return Number(obj);
    }
  }

  return obj;
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get("prepgenie-user-id")?.value;
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

    // Parse all numeric strings to actual numbers (PostgreSQL returns numbers as strings)
    const data = parseNumbers({
      stats,
      ...performance,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Reports error:", error);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
