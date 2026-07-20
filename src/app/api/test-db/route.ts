import { NextRequest, NextResponse } from "next/server";
import { queryOne } from "@/lib/db";

export async function GET(request: NextRequest) {
  const userId = request.cookies.get("scoreyo-user-id")?.value;

  console.log('[Test DB] userId:', userId);

  if (!userId) {
    return NextResponse.json({ error: "No cookie" });
  }

  try {
    // Test simple query
    const result = await queryOne(
      "SELECT COUNT(*) as count FROM quiz_sessions WHERE user_id = $1",
      [userId]
    );

    console.log('[Test DB] Result:', result);

    return NextResponse.json({
      success: true,
      userId,
      result
    });
  } catch (error: any) {
    console.error('[Test DB] Error:', error);
    return NextResponse.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
