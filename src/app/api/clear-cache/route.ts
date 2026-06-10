import { NextRequest, NextResponse } from "next/server";
import { deleteCached, CacheKeys } from "@/lib/redis";

export const dynamic = "force-dynamic";

/**
 * Clear user stats cache
 */
export async function POST(request: NextRequest) {
  const userId = request.cookies.get("krakkify-user-id")?.value;

  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const cacheKey = CacheKeys.userStats(userId);
    await deleteCached(cacheKey);

    return NextResponse.json({
      success: true,
      message: "Cache cleared. Refresh your dashboard to see updated stats.",
    });
  } catch (error) {
    console.error("[Clear Cache] Error:", error);
    return NextResponse.json(
      { error: "Failed to clear cache" },
      { status: 500 }
    );
  }
}
