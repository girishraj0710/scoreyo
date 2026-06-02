import { NextRequest, NextResponse } from "next/server";
import { getTeacherSubmissions } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/teacher/submissions
 * Get contributor's pending/approved/rejected questions
 * Query params: status (pending/approved/rejected/all - default all), limit (default 50), offset (default 0)
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get("prepgenie-user-id")?.value;
    if (!userId) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = request.nextUrl;
    const status = searchParams.get("status") || "all";
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
    const offset = parseInt(searchParams.get("offset") || "0");

    // Validate status parameter
    const validStatuses = ["pending", "approved", "rejected", "all"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status parameter" },
        { status: 400 }
      );
    }

    // Fetch submissions
    const submissions = await getTeacherSubmissions(
      userId,
      status === "all" ? undefined : (status as "pending" | "approved" | "rejected"),
      limit,
      offset
    );

    return NextResponse.json({
      success: true,
      submissions: submissions || [],
      count: submissions?.length || 0,
    });
  } catch (error: any) {
    console.error("[Teacher Submissions] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch submissions",
      },
      { status: 500 }
    );
  }
}
