import { NextRequest, NextResponse } from "next/server";
import { execute, queryAll } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

const COOKIE_NAME = "krakkify-user-id";

// POST /api/exam/add - Add new exam enrollment (Pro only)
export async function POST(request: NextRequest) {
  const userId = request.cookies.get(COOKIE_NAME)?.value;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { examId } = body;

    if (!examId) {
      return NextResponse.json({ error: "Missing examId" }, { status: 400 });
    }

    // Get user subscription status
    const users = await queryAll(
      `SELECT subscription_status, role FROM users WHERE id = $1`,
      [userId]
    );

    if (!users || users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = users[0];

    // Admin/Contributor: Block this action (they already have all exams)
    if (user.role === 'admin' || user.role === 'contributor') {
      return NextResponse.json(
        { error: "Admin users already have access to all exams" },
        { status: 403 }
      );
    }

    // Check if user is Pro
    if (user.subscription_status !== 'pro') {
      return NextResponse.json(
        { error: "Upgrade to Pro to add more exams" },
        { status: 403 }
      );
    }

    // Check if already enrolled
    const existing = await queryAll(
      `SELECT * FROM user_enrolled_exams
       WHERE user_id = $1 AND exam_id = $2`,
      [userId, examId]
    );

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: "Already enrolled in this exam" },
        { status: 400 }
      );
    }

    // Add enrollment (not primary by default)
    await execute(
      `INSERT INTO user_enrolled_exams (id, user_id, exam_id, is_primary)
       VALUES ($1, $2, $3, 0)`,
      [uuidv4(), userId, examId]
    );

    // Fetch updated user data
    const updatedUser = await getUserWithExams(userId);

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: `Successfully added ${examId.toUpperCase()} exam`,
    });
  } catch (error) {
    console.error("Add exam error:", error);
    return NextResponse.json(
      { error: "Failed to add exam" },
      { status: 500 }
    );
  }
}

// Helper: Get user with enrolled exams
async function getUserWithExams(userId: string) {
  // Get base user data
  const users = await queryAll(
    `SELECT id, name, email, age, location, phone_number, exam_preparing_for,
            avatar_color, created_at, role, subscription_status
     FROM users
     WHERE id = $1`,
    [userId]
  );

  if (!users || users.length === 0) {
    return null;
  }

  const user = users[0];

  // Get enrolled exams
  const enrollments = await queryAll(
    `SELECT exam_id, is_primary
     FROM user_enrolled_exams
     WHERE user_id = $1
     ORDER BY is_primary DESC, enrolled_at ASC`,
    [userId]
  );

  const enrolledExams = enrollments?.map((e: any) => e.exam_id) || [];
  const currentExam = enrollments?.find((e: any) => e.is_primary === 1)?.exam_id || enrolledExams[0];

  return {
    ...user,
    current_exam: currentExam,
    enrolled_exams: enrolledExams,
  };
}
