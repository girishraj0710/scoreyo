import { NextRequest, NextResponse } from "next/server";
import { getCompletedEnglishTopicIds } from "@/lib/db";

/**
 * GET /api/english/completed-topics
 * Returns the ids of every English topic the signed-in user has made progress
 * on (across all paths), so the full learning-path view can mark them complete.
 */
export async function GET(request: NextRequest) {
  const userId = request.cookies.get("scoreyo-user-id")?.value;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const completed = await getCompletedEnglishTopicIds(userId);
    return NextResponse.json({ completed });
  } catch (error) {
    console.error("Error fetching completed english topics:", error);
    return NextResponse.json({ error: "Failed to fetch completed topics" }, { status: 500 });
  }
}
