import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/db";

const COOKIE_NAME = "krakkify-user-id";

export async function GET(request: NextRequest) {
  const userId = request.cookies.get(COOKIE_NAME)?.value;

  console.log('[Debug Session] Cookie value:', userId);

  if (!userId) {
    return NextResponse.json({
      error: "No session cookie found",
      cookieName: COOKIE_NAME,
      allCookies: Array.from(request.cookies.getAll()).map(c => c.name)
    });
  }

  const user = await getUser(userId);

  if (!user) {
    return NextResponse.json({
      error: "User not found in database",
      userId,
      suggestion: "Cookie has invalid user ID - clear cookies and login again"
    });
  }

  return NextResponse.json({
    success: true,
    session: {
      cookieUserId: userId,
      databaseUser: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        current_exam: user.exam_preparing_for
      }
    }
  });
}
