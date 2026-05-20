import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function POST(req: NextRequest) {
  try {
    const userId = req.cookies.get("prepgenie-user-id")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { questionId, reason, details } = body;

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

    // Insert report
    const reportId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await db.execute({
      sql: `INSERT INTO question_reports
            (id, question_id, user_id, reason, details, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        reportId,
        questionId,
        userId,
        reason,
        details || null,
        "pending",
        new Date().toISOString(),
      ],
    });

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

// GET: Fetch reports (admin only - simple check for now)
export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get("prepgenie-user-id")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "pending";

    // Fetch reports with question details
    // FEATURE FLAG: Support both legacy and dimensional models
    const useDimensional = process.env.USE_DIMENSIONAL_MODEL === 'true';

    let sql: string;
    if (useDimensional) {
      // Dimensional model: JOIN through bridge and dim tables
      sql = `SELECT
              qr.id,
              qr.question_id,
              qr.user_id,
              qr.reason,
              qr.details,
              qr.status,
              qr.created_at,
              feq.question,
              dt.topic_name as topic,
              de.exam_id,
              feq.correct_answer,
              feq.explanation
            FROM question_reports qr
            LEFT JOIN fact_exam_questions feq ON qr.question_id = feq.id
            LEFT JOIN dim_topics dt ON feq.topic_id = dt.id
            LEFT JOIN bridge_exam_subject_topic best ON dt.id = best.topic_id
            LEFT JOIN dim_exams de ON best.exam_id = de.id
            WHERE qr.status = ?
            ORDER BY qr.created_at DESC
            LIMIT 50`;
    } else {
      // Legacy model: Direct query
      sql = `SELECT
              qr.id,
              qr.question_id,
              qr.user_id,
              qr.reason,
              qr.details,
              qr.status,
              qr.created_at,
              eq.question,
              eq.topic,
              eq.exam_id,
              eq.correct_answer,
              eq.explanation
            FROM question_reports qr
            LEFT JOIN exam_questions eq ON qr.question_id = eq.id
            WHERE qr.status = ?
            ORDER BY qr.created_at DESC
            LIMIT 50`;
    }

    const reports = await db.execute({
      sql,
      args: [status],
    });

    return NextResponse.json({
      reports: reports.rows.map((r: any) => ({
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

// PATCH: Update report status (admin action)
export async function PATCH(req: NextRequest) {
  try {
    const userId = req.cookies.get("prepgenie-user-id")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    await db.execute({
      sql: `UPDATE question_reports
            SET status = ?, admin_notes = ?, resolved_at = ?
            WHERE id = ?`,
      args: [
        status,
        adminNotes || null,
        status === "fixed" || status === "dismissed"
          ? new Date().toISOString()
          : null,
        reportId,
      ],
    });

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
