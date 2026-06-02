import { NextRequest, NextResponse } from "next/server";
import { setUserRole, getUser } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * POST /api/user/select-role
 * Allow existing users to select their role (teacher or student)
 * Used for one-time role selection when role system is introduced
 */
export async function POST(request: NextRequest) {
  try {
    const userId = request.cookies.get("prepgenie-user-id")?.value;
    if (!userId) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { role } = body;

    if (!role || !['student', 'teacher', 'contributor'].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be 'student', 'teacher', or 'contributor'" },
        { status: 400 }
      );
    }

    // Set the user's role
    await setUserRole(userId, role);

    // Get updated user data
    const user = await getUser(userId);

    console.log(`[Select Role] User ${userId} selected role: ${role}`);

    return NextResponse.json({
      success: true,
      message: `Your role has been set to ${role}`,
      user,
    });

  } catch (error: any) {
    console.error('[Select Role] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to set role',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/user/select-role
 * Get the current user's role and check if they need to select one
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

    const user = await getUser(userId);

    return NextResponse.json({
      success: true,
      hasRole: !!user?.role,
      role: user?.role || null,
      needsRoleSelection: !user?.role || user?.role === null,
    });

  } catch (error: any) {
    console.error('[Select Role] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to get role',
      },
      { status: 500 }
    );
  }
}
