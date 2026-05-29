import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { queryOne, queryAll, execute } from "@/lib/db";

// Get current active sprint or create a new one
export async function GET() {
  try {
    const userId = (await cookies()).get("prepgenie-user-id")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();

    // Check for active sprints (all exams)
    const activeSprints = await queryAll(
      `SELECT * FROM sprints
       WHERE status = 'active' AND end_time > ?
       ORDER BY exam_id, start_time DESC`,
      [now.toISOString()]
    );

    if (activeSprints.length === 0) {
      return NextResponse.json({ noActiveSprint: true });
    }

    // Get data for all sprints
    const sprintsData = await Promise.all(
      activeSprints.map(async (sprint: any) => {
        // Get leaderboard for this sprint
        const leaderboard = await queryAll(
          `SELECT sp.user_id, u.name, sp.score, sp.answers, sp.time_taken_seconds, sp.completed_at
           FROM sprint_participants sp
           JOIN users u ON sp.user_id = u.id
           WHERE sp.sprint_id = ?
           ORDER BY sp.score DESC, sp.time_taken_seconds ASC
           LIMIT 50`,
          [sprint.id]
        );

        // Check if user participated in this sprint
        const userParticipation = await queryOne(
          `SELECT * FROM sprint_participants WHERE sprint_id = ? AND user_id = ?`,
          [sprint.id, userId]
        );

        const totalParticipants = leaderboard.length;
        const userRank = leaderboard.findIndex((r: any) => r.user_id === userId) + 1;
        const isTop10Percent = userRank > 0 && userRank <= Math.ceil(totalParticipants * 0.1);

        // Parse questions if stored as string
        const questions = typeof sprint.questions === 'string'
          ? JSON.parse(sprint.questions)
          : sprint.questions;

        return {
          sprint: {
            id: sprint.id,
            topic: sprint.topic,
            examId: sprint.exam_id,
            subjectId: sprint.subject_id,
            startTime: sprint.start_time,
            endTime: sprint.end_time,
            questions,
          },
          participated: !!userParticipation,
          participation: userParticipation || null,
          leaderboard: leaderboard.map((row: any, index: number) => ({
            rank: index + 1,
            userId: row.user_id,
            name: row.name,
            score: row.score,
            total: questions.length,
            time: row.time_taken_seconds,
            isTop10: index < Math.ceil(totalParticipants * 0.1),
          })),
          userRank: userRank || null,
          isTop10Percent,
          totalParticipants,
        };
      })
    );

    return NextResponse.json({ sprints: sprintsData });

  } catch (error) {
    console.error("[Sprint API] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Submit sprint completion
export async function POST(request: Request) {
  try {
    const userId = (await cookies()).get("prepgenie-user-id")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sprintId, score, totalQuestions, timeTaken, answers } = await request.json();

    // Check if already participated
    const existing = await queryOne(
      `SELECT id FROM sprint_participants WHERE sprint_id = ? AND user_id = ?`,
      [sprintId, userId]
    );

    if (existing) {
      return NextResponse.json({ error: "Already participated" }, { status: 400 });
    }

    // Record participation
    await execute(
      `INSERT INTO sprint_participants (sprint_id, user_id, score, time_taken_seconds, answers)
       VALUES (?, ?, ?, ?, ?)`,
      [sprintId, userId, score, timeTaken, JSON.stringify(answers || [])]
    );

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("[Sprint API] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
