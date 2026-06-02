import { NextRequest, NextResponse } from "next/server";
import { queryOne, execute } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/pending-questions/[id]/reject
 * Reject a pending question
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminId = request.cookies.get("prepgenie-user-id")?.value;
    if (!adminId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const id = params.id;
    const body = await request.json();
    const { reason } = body;

    // Get pending question
    const pending = await queryOne(
      `SELECT * FROM pending_questions WHERE id = $1`,
      [id]
    );

    if (!pending) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    if (pending.status !== 'pending') {
      return NextResponse.json(
        { error: `Question already ${pending.status}` },
        { status: 400 }
      );
    }

    // Update status to rejected
    await execute(
      `UPDATE pending_questions
       SET status = 'rejected',
           reviewed_by = $1,
           reviewed_at = CURRENT_TIMESTAMP,
           review_notes = $2
       WHERE id = $3`,
      [adminId, reason || 'No reason provided', id]
    );

    console.log('[Admin] Rejected question:', id, 'Reason:', reason);

    return NextResponse.json({
      success: true,
      message: "Question rejected",
      questionId: id,
    });

  } catch (error: any) {
    console.error('[Reject] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
