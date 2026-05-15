import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Get current active sprint or create a new one
export async function GET() {
  try {
    const userId = (await cookies()).get("prepgenie-user-id")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();

    // Check for active sprints (all exams)
    const activeSprints = await db.execute({
      sql: `SELECT * FROM daily_sprints
            WHERE status = 'active' AND end_time > ?
            ORDER BY exam_id, start_time DESC`,
      args: [now.toISOString()]
    });

    if (activeSprints.rows.length === 0) {
      return NextResponse.json({ noActiveSprint: true });
    }

    // Get data for all sprints
    const sprintsData = await Promise.all(
      activeSprints.rows.map(async (sprint: any) => {
        // Get leaderboard for this sprint
        const leaderboard = await db.execute({
          sql: `SELECT sp.user_id, u.name, sp.score, sp.total_questions, sp.time_taken_seconds, sp.completed_at
                FROM sprint_participations sp
                JOIN users u ON sp.user_id = u.id
                WHERE sp.sprint_id = ?
                ORDER BY sp.score DESC, sp.time_taken_seconds ASC
                LIMIT 50`,
          args: [sprint.id]
        });

        // Check if user participated in this sprint
        const userParticipation = await db.execute({
          sql: `SELECT * FROM sprint_participations WHERE sprint_id = ? AND user_id = ?`,
          args: [sprint.id, userId]
        });

        const totalParticipants = leaderboard.rows.length;
        const userRank = leaderboard.rows.findIndex((r: any) => r.user_id === userId) + 1;
        const isTop10Percent = userRank > 0 && userRank <= Math.ceil(totalParticipants * 0.1);

        return {
          sprint: {
            id: sprint.id,
            topic: sprint.topic,
            examId: sprint.exam_id,
            subjectId: sprint.subject_id,
            startTime: sprint.start_time,
            endTime: sprint.end_time,
            questions: JSON.parse(sprint.questions as string),
          },
          participated: userParticipation.rows.length > 0,
          participation: userParticipation.rows.length > 0 ? userParticipation.rows[0] : null,
          leaderboard: leaderboard.rows.map((row: any, index: number) => ({
            rank: index + 1,
            userId: row.user_id,
            name: row.name,
            score: row.score,
            total: row.total_questions,
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

    const { sprintId, score, totalQuestions, timeTaken } = await request.json();

    // Check if already participated
    const existing = await db.execute({
      sql: `SELECT id FROM sprint_participations WHERE sprint_id = ? AND user_id = ?`,
      args: [sprintId, userId]
    });

    if (existing.rows.length > 0) {
      return NextResponse.json({ error: "Already participated" }, { status: 400 });
    }

    // Record participation
    await db.execute({
      sql: `INSERT INTO sprint_participations (sprint_id, user_id, score, total_questions, time_taken_seconds)
            VALUES (?, ?, ?, ?, ?)`,
      args: [sprintId, userId, score, totalQuestions, timeTaken]
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("[Sprint API] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
