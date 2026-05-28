import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Simple admin check (you can enhance this later with proper admin roles)
// Move admin emails to environment variable for security
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "admin@prepgenie.co.in").split(",").map(e => e.trim());

async function isAdmin(userId: string): Promise<boolean> {
  try {
    const user = await db.execute({
      sql: "SELECT email FROM users WHERE id = ?",
      args: [userId],
    });
    return user.rows.length > 0 && ADMIN_EMAILS.includes(user.rows[0].email as string);
  } catch {
    return false;
  }
}

// GET: Fetch all reported questions with pagination
export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get("prepgenie-user-id")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!(await isAdmin(userId))) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "pending";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    // Using Dimensional Model for all question data
    const sql = `SELECT
            qr.id as report_id,
            qr.question_id,
            qr.user_id,
            qr.reason,
            qr.details,
            qr.status,
            qr.admin_notes,
            qr.created_at,
            qr.resolved_at,
            qr.exam_id,
            qr.subject_id,
            feq.question,
            feq.options,
            feq.correct_answer,
            feq.explanation,
            dt.topic_name as topic,
            feq.difficulty,
            feq.source,
            u.name as reporter_name,
            u.email as reporter_email
          FROM question_reports qr
          LEFT JOIN fact_exam_questions feq ON qr.question_id = feq.id
          LEFT JOIN dim_topics dt ON feq.topic_id = dt.id
          LEFT JOIN users u ON qr.user_id = u.id
          WHERE qr.status = ?
          ORDER BY qr.created_at DESC
          LIMIT ? OFFSET ?`;

    // Fetch reported questions with details
    const reports = await db.execute({
      sql,
      args: [status, limit, offset],
    });

    // Get total count
    const countResult = await db.execute({
      sql: "SELECT COUNT(*) as count FROM question_reports WHERE status = ?",
      args: [status],
    });

    const total = Number(countResult.rows[0]?.count || 0);

    return NextResponse.json({
      reports: reports.rows.map((r: any) => ({
        reportId: r.report_id,
        questionId: r.question_id,
        reporter: {
          userId: r.user_id,
          name: r.reporter_name,
          email: r.reporter_email,
        },
        reason: r.reason,
        details: r.details,
        status: r.status,
        adminNotes: r.admin_notes,
        createdAt: r.created_at,
        resolvedAt: r.resolved_at,
        question: {
          text: r.question,
          options: JSON.parse(r.options || "[]"),
          correctAnswer: r.correct_answer,
          explanation: r.explanation,
          topic: r.topic,
          subjectId: r.subject_id,
          examId: r.exam_id,
          difficulty: r.difficulty,
          source: r.source,
        },
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching reported questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch reported questions" },
      { status: 500 }
    );
  }
}

// PUT: Update a question (admin edit)
export async function PUT(req: NextRequest) {
  try {
    const userId = req.cookies.get("prepgenie-user-id")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!(await isAdmin(userId))) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const {
      questionId,
      question,
      options,
      correctAnswer,
      explanation,
      difficulty,
    } = body;

    if (!questionId) {
      return NextResponse.json(
        { error: "Question ID is required" },
        { status: 400 }
      );
    }

    // Validate data
    if (options && (!Array.isArray(options) || options.length !== 4)) {
      return NextResponse.json(
        { error: "Options must be an array of 4 items" },
        { status: 400 }
      );
    }

    if (correctAnswer !== undefined && (correctAnswer < 0 || correctAnswer > 3)) {
      return NextResponse.json(
        { error: "Correct answer must be between 0-3" },
        { status: 400 }
      );
    }

    if (difficulty && !["easy", "medium", "hard"].includes(difficulty)) {
      return NextResponse.json(
        { error: "Invalid difficulty level" },
        { status: 400 }
      );
    }

    // Build update query dynamically
    const updates: string[] = [];
    const args: any[] = [];

    if (question !== undefined) {
      updates.push("question = ?");
      args.push(question);
    }
    if (options !== undefined) {
      updates.push("options = ?");
      args.push(JSON.stringify(options));
    }
    if (correctAnswer !== undefined) {
      updates.push("correct_answer = ?");
      args.push(correctAnswer);
    }
    if (explanation !== undefined) {
      updates.push("explanation = ?");
      args.push(explanation);
    }
    if (difficulty !== undefined) {
      updates.push("difficulty = ?");
      args.push(difficulty);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    args.push(questionId);

    await db.execute({
      sql: `UPDATE fact_exam_questions SET ${updates.join(", ")} WHERE id = ?`,
      args,
    });

    return NextResponse.json({
      success: true,
      message: "Question updated successfully",
    });
  } catch (error) {
    console.error("Error updating question:", error);
    return NextResponse.json(
      { error: "Failed to update question" },
      { status: 500 }
    );
  }
}

// PATCH: Update report status
export async function PATCH(req: NextRequest) {
  try {
    const userId = req.cookies.get("prepgenie-user-id")?.value;
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
      message: "Report status updated successfully",
    });
  } catch (error) {
    console.error("Error updating report status:", error);
    return NextResponse.json(
      { error: "Failed to update report status" },
      { status: 500 }
    );
  }
}
