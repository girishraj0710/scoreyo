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

    // Check for active sprint
    const activeSprint = await db.execute({
      sql: `SELECT * FROM daily_sprints
            WHERE status = 'active' AND end_time > ?
            ORDER BY start_time DESC LIMIT 1`,
      args: [now.toISOString()]
    });

    if (activeSprint.rows.length === 0) {
      return NextResponse.json({ noActiveSprint: true });
    }

    const sprint = activeSprint.rows[0];

    // Get leaderboard
    const leaderboard = await db.execute({
      sql: `SELECT sp.user_id, u.name, sp.score, sp.total_questions, sp.time_taken_seconds, sp.completed_at
            FROM sprint_participations sp
            JOIN users u ON sp.user_id = u.id
            WHERE sp.sprint_id = ?
            ORDER BY sp.score DESC, sp.time_taken_seconds ASC
            LIMIT 50`,
      args: [sprint.id]
    });

    // Check if user participated
    const userParticipation = await db.execute({
      sql: `SELECT * FROM sprint_participations WHERE sprint_id = ? AND user_id = ?`,
      args: [sprint.id, userId]
    });

    const totalParticipants = leaderboard.rows.length;
    const userRank = leaderboard.rows.findIndex(r => r.user_id === userId) + 1;
    const isTop10Percent = userRank > 0 && userRank <= Math.ceil(totalParticipants * 0.1);

    return NextResponse.json({
      sprint: {
        id: sprint.id,
        topic: sprint.topic,
        startTime: sprint.start_time,
        endTime: sprint.end_time,
        questions: JSON.parse(sprint.questions as string),
      },
      participated: userParticipation.rows.length > 0,
      participation: userParticipation.rows[0] || null,
      leaderboard: leaderboard.rows.map((r, i) => ({
        rank: i + 1,
        userId: r.user_id,
        name: r.name,
        score: r.score,
        total: r.total_questions,
        time: r.time_taken_seconds,
        isTop10: i < Math.ceil(totalParticipants * 0.1)
      })),
      userRank,
      isTop10Percent,
      totalParticipants
    });

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
