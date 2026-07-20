import { NextRequest, NextResponse } from "next/server";
import { execute, queryAll } from "@/lib/db";

const COOKIE_NAME = "scoreyo-user-id";

// POST /api/exam/switch - Switch between enrolled exams
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

    // Check if user is enrolled in this exam
    const enrollment = await queryAll(
      `SELECT * FROM user_enrolled_exams
       WHERE user_id = $1 AND exam_id = $2`,
      [userId, examId]
    );

    if (!enrollment || enrollment.length === 0) {
      return NextResponse.json(
        { error: "Not enrolled in this exam" },
        { status: 403 }
      );
    }

    // Set all exams for this user to is_primary = 0
    await execute(
      `UPDATE user_enrolled_exams
       SET is_primary = 0
       WHERE user_id = $1`,
      [userId]
    );

    // Set the selected exam to is_primary = 1
    await execute(
      `UPDATE user_enrolled_exams
       SET is_primary = 1
       WHERE user_id = $1 AND exam_id = $2`,
      [userId, examId]
    );

    // Fetch updated user data with enrolled exams
    const user = await getUserWithExams(userId);

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Switch exam error:", error);
    return NextResponse.json(
      { error: "Failed to switch exam" },
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
