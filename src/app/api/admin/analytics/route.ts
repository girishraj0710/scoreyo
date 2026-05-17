import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const ADMIN_EMAILS = ["girish.raj0710@gmail.com", "grgowda07.1992@gmail.com", "admin@prepgenie.co.in"];

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

export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get("prepgenie-user-id")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!(await isAdmin(userId))) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    // 1. Question Quality Metrics
    const totalQuestions = await db.execute({
      sql: "SELECT COUNT(*) as count FROM exam_questions",
      args: [],
    });

    const questionsBySource = await db.execute({
      sql: `SELECT source, COUNT(*) as count
            FROM exam_questions
            GROUP BY source
            ORDER BY count DESC
            LIMIT 10`,
      args: [],
    });

    const questionsByDifficulty = await db.execute({
      sql: `SELECT difficulty, COUNT(*) as count
            FROM exam_questions
            GROUP BY difficulty`,
      args: [],
    });

    const questionsByExam = await db.execute({
      sql: `SELECT exam_id, COUNT(*) as count
            FROM exam_questions
            GROUP BY exam_id
            ORDER BY count DESC
            LIMIT 20`,
      args: [],
    });

    const reportStats = await db.execute({
      sql: `SELECT
              status,
              COUNT(*) as count
            FROM question_reports
            GROUP BY status`,
      args: [],
    });

    const recentReports = await db.execute({
      sql: `SELECT
              COUNT(*) as count
            FROM question_reports
            WHERE created_at >= datetime('now', '-7 days')`,
      args: [],
    });

    // 2. Usage Pattern Metrics (using quiz_sessions table)
    const totalUsers = await db.execute({
      sql: "SELECT COUNT(*) as count FROM users",
      args: [],
    });

    const activeUsers7Days = await db.execute({
      sql: `SELECT COUNT(DISTINCT user_id) as count
            FROM quiz_sessions
            WHERE created_at >= datetime('now', '-7 days')`,
      args: [],
    });

    const activeUsers30Days = await db.execute({
      sql: `SELECT COUNT(DISTINCT user_id) as count
            FROM quiz_sessions
            WHERE created_at >= datetime('now', '-30 days')`,
      args: [],
    });

    const totalQuizzes = await db.execute({
      sql: "SELECT COUNT(*) as count FROM quiz_sessions",
      args: [],
    });

    const quizzesLast7Days = await db.execute({
      sql: `SELECT COUNT(*) as count
            FROM quiz_sessions
            WHERE created_at >= datetime('now', '-7 days')`,
      args: [],
    });

    const quizzesLast30Days = await db.execute({
      sql: `SELECT COUNT(*) as count
            FROM quiz_sessions
            WHERE created_at >= datetime('now', '-30 days')`,
      args: [],
    });

    const popularExams = await db.execute({
      sql: `SELECT exam_id, COUNT(*) as attempts
            FROM quiz_sessions
            WHERE created_at >= datetime('now', '-30 days')
            GROUP BY exam_id
            ORDER BY attempts DESC
            LIMIT 10`,
      args: [],
    });

    const popularSubjects = await db.execute({
      sql: `SELECT subject_id, COUNT(*) as attempts
            FROM quiz_sessions
            WHERE created_at >= datetime('now', '-30 days')
            GROUP BY subject_id
            ORDER BY attempts DESC
            LIMIT 10`,
      args: [],
    });

    const avgScores = await db.execute({
      sql: `SELECT
              exam_id,
              AVG(CAST(correct_answers AS REAL) / total_questions * 100) as avg_score_pct
            FROM quiz_sessions
            WHERE created_at >= datetime('now', '-30 days') AND total_questions > 0
            GROUP BY exam_id
            ORDER BY avg_score_pct DESC
            LIMIT 10`,
      args: [],
    });

    // 3. Daily activity (last 14 days)
    const dailyActivity = await db.execute({
      sql: `SELECT
              DATE(created_at) as date,
              COUNT(*) as quizzes,
              COUNT(DISTINCT user_id) as users
            FROM quiz_sessions
            WHERE created_at >= datetime('now', '-14 days')
            GROUP BY DATE(created_at)
            ORDER BY date DESC`,
      args: [],
    });

    // 4. Question accuracy (questions with low accuracy = potential issues)
    // Note: question_attempts doesn't have question_id, so we'll skip this for now
    const lowAccuracyQuestions = { rows: [] };

    // 5. Pro subscription stats
    const proUsers = await db.execute({
      sql: `SELECT COUNT(*) as count
            FROM subscriptions
            WHERE status = 'active'`,
      args: [],
    });

    const revenue30Days = await db.execute({
      sql: `SELECT
              COUNT(*) as count,
              SUM(amount) as total
            FROM subscriptions
            WHERE created_at >= datetime('now', '-30 days')`,
      args: [],
    });

    return NextResponse.json({
      questionMetrics: {
        total: Number(totalQuestions.rows[0]?.count || 0),
        bySource: questionsBySource.rows.map((r: any) => ({
          source: r.source,
          count: Number(r.count),
        })),
        byDifficulty: questionsByDifficulty.rows.map((r: any) => ({
          difficulty: r.difficulty,
          count: Number(r.count),
        })),
        byExam: questionsByExam.rows.map((r: any) => ({
          examId: r.exam_id,
          count: Number(r.count),
        })),
      },
      reportMetrics: {
        byStatus: reportStats.rows.map((r: any) => ({
          status: r.status,
          count: Number(r.count),
        })),
        recentCount: Number(recentReports.rows[0]?.count || 0),
      },
      usageMetrics: {
        users: {
          total: Number(totalUsers.rows[0]?.count || 0),
          active7Days: Number(activeUsers7Days.rows[0]?.count || 0),
          active30Days: Number(activeUsers30Days.rows[0]?.count || 0),
        },
        quizzes: {
          total: Number(totalQuizzes.rows[0]?.count || 0),
          last7Days: Number(quizzesLast7Days.rows[0]?.count || 0),
          last30Days: Number(quizzesLast30Days.rows[0]?.count || 0),
        },
        popularExams: popularExams.rows.map((r: any) => ({
          examId: r.exam_id,
          attempts: Number(r.attempts),
        })),
        popularSubjects: popularSubjects.rows.map((r: any) => ({
          subjectId: r.subject_id,
          attempts: Number(r.attempts),
        })),
        avgScores: avgScores.rows.map((r: any) => ({
          examId: r.exam_id,
          avgScore: Number(r.avg_score_pct).toFixed(1),
        })),
      },
      dailyActivity: dailyActivity.rows.map((r: any) => ({
        date: r.date,
        quizzes: Number(r.quizzes),
        users: Number(r.users),
      })),
      questionQuality: {
        lowAccuracy: lowAccuracyQuestions.rows.map((r: any) => ({
          id: r.id,
          question: String(r.question).substring(0, 100) + "...",
          examId: r.exam_id,
          topic: r.topic,
          correctCount: Number(r.correct_count),
          totalAttempts: Number(r.total_attempts),
          accuracy: Number(r.accuracy).toFixed(1),
        })),
      },
      subscriptions: {
        proUsers: Number(proUsers.rows[0]?.count || 0),
        revenue30Days: {
          count: Number(revenue30Days.rows[0]?.count || 0),
          total: Number(revenue30Days.rows[0]?.total || 0) / 100, // Convert paise to rupees
        },
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
