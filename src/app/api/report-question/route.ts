import { NextRequest, NextResponse } from "next/server";
import { queryOne, queryAll, execute } from "@/lib/db";

// Admin emails from environment - uses ADMIN_EMAILS env var
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "girish.raj0710@gmail.com,admin@krakkify.in").split(",").map(e => e.trim());

async function isAdmin(userId: string): Promise<boolean> {
  try {
    const user = await queryOne("SELECT email FROM users WHERE id = ?", [userId]);
    return user && ADMIN_EMAILS.includes(user.email);
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = req.cookies.get("krakkify-user-id")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { questionId, reason, details, examId, subjectId } = body;

    if (!questionId || !reason) {
      return NextResponse.json(
        { error: "Question ID and reason are required" },
        { status: 400 }
      );
    }

    // Validate reason
    const validReasons = [
      "incorrect_answer",
      "wrong_explanation",
      "unclear_question",
      "typo",
      "other",
    ];
    if (!validReasons.includes(reason)) {
      return NextResponse.json({ error: "Invalid reason" }, { status: 400 });
    }

    // Insert report with exam/subject context (if provided)
    const reportId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    await execute(
      `INSERT INTO question_reports
       (id, question_id, user_id, reason, details, exam_id, subject_id, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        reportId,
        questionId,
        userId,
        reason,
        details || null,
        examId || null,
        subjectId || null,
        "pending",
        new Date().toISOString(),
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Question reported successfully. We'll review it soon.",
      reportId,
    });
  } catch (error) {
    console.error("Error reporting question:", error);
    return NextResponse.json(
      { error: "Failed to report question" },
      { status: 500 }
    );
  }
}

// GET: Fetch reports (admin only)
export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get("krakkify-user-id")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!(await isAdmin(userId))) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "pending";

    // Fetch reports with question details using Dimensional Model
    const reports = await queryAll(
      `SELECT
         qr.id,
         qr.question_id,
         qr.user_id,
         qr.reason,
         qr.details,
         qr.status,
         qr.created_at,
         qr.exam_id,
         qr.subject_id,
         feq.question,
         dt.topic_name as topic,
         feq.correct_answer,
         feq.explanation
       FROM question_reports qr
       LEFT JOIN fact_exam_questions feq ON qr.question_id = feq.id
       LEFT JOIN dim_topics dt ON feq.topic_id = dt.id
       WHERE qr.status = ?
       ORDER BY qr.created_at DESC
       LIMIT 50`,
      [status]
    );

    return NextResponse.json({
      reports: reports.map((r: any) => ({
        id: r.id,
        questionId: r.question_id,
        userId: r.user_id,
        reason: r.reason,
        details: r.details,
        status: r.status,
        createdAt: r.created_at,
        question: {
          text: r.question,
          topic: r.topic,
          examId: r.exam_id,
          subjectId: r.subject_id,
          correctAnswer: r.correct_answer,
          explanation: r.explanation,
        },
      })),
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}

// PATCH: Update report status (admin only)
export async function PATCH(req: NextRequest) {
  try {
    const userId = req.cookies.get("krakkify-user-id")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!(await isAdmin(userId))) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { reportId, status, adminNotes } = body;

    if (!reportId || !status) {
      return NextResponse.json(
        { error: "Report ID and status are required" },
        { status: 400 }
      );
    }

    const validStatuses = ["pending", "reviewing", "fixed", "dismissed"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await execute(
      `UPDATE question_reports
       SET status = ?, admin_notes = ?, resolved_at = ?
       WHERE id = ?`,
      [
        status,
        adminNotes || null,
        status === "fixed" || status === "dismissed"
          ? new Date().toISOString()
          : null,
        reportId,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Report status updated",
    });
  } catch (error) {
    console.error("Error updating report:", error);
    return NextResponse.json(
      { error: "Failed to update report" },
      { status: 500 }
    );
  }
}
