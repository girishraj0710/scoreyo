import { NextRequest, NextResponse } from "next/server";
import { queryOne, queryAll } from "@/lib/db";
import { Pool } from 'pg';

// Temporary PostgreSQL wrapper for admin analytics (to be fully migrated)
const getPool = () => new Pool({ connectionString: process.env.POSTGRES_URL });
const db = {
  execute: async ({ sql, args }: { sql: string; args: any[] }) => {
    const pool = getPool();
    try {
      // Convert ? to $1, $2, etc
      let paramIndex = 1;
      const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
      const result = await pool.query(pgSql, args);
      await pool.end();
      return { rows: result.rows };
    } catch (error) {
      await pool.end();
      throw error;
    }
  }
};

const ADMIN_EMAILS = ["girish.raj0710@gmail.com", "grgowda07.1992@gmail.com", "admin@prepgenie.co.in"];

async function isAdmin(userId: string): Promise<boolean> {
  try {
    const user = await queryOne("SELECT email FROM users WHERE id = ?", [userId]);
    return user && ADMIN_EMAILS.includes(user.email);
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  // Get optional exam filter from query params (declare outside try-catch for error handling)
  const { searchParams } = new URL(req.url);
  const examFilter = searchParams.get("examId") || null;

  try {
    const userId = req.cookies.get("prepgenie-user-id")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!(await isAdmin(userId))) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    if (examFilter) {
      console.log("[Admin Analytics] Filtering by exam:", examFilter);
    }

    // 1. Question Quality Metrics - Using Dimensional Model
    const totalQuestions = await db.execute({
      sql: "SELECT COUNT(*) as count FROM fact_exam_questions",
      args: [],
    });

    const questionsBySource = await db.execute({
      sql: `SELECT source, COUNT(*) as count
            FROM fact_exam_questions
            GROUP BY source
            ORDER BY count DESC
            LIMIT 10`,
      args: [],
    });

    const questionsByDifficulty = await db.execute({
      sql: `SELECT difficulty, COUNT(*) as count
            FROM fact_exam_questions
            GROUP BY difficulty`,
      args: [],
    });

    const questionsByExam = await db.execute({
      sql: `SELECT e.exam_code as exam_id, e.exam_name, COUNT(DISTINCT q.id) as count
            FROM dim_exams e
            JOIN bridge_exam_subject_topic b ON e.id = b.exam_id
            JOIN fact_exam_questions q ON b.topic_id = q.topic_id
            GROUP BY e.id
            ORDER BY count DESC`,
      args: [],
    });

    const reportStats = await db.execute({
      sql: `SELECT
              status,
              COUNT(*) as count
            FROM reported_questions
            GROUP BY status`,
      args: [],
    });

    const recentReports = await db.execute({
      sql: `SELECT
              COUNT(*) as count
            FROM reported_questions
            WHERE created_at >= CURRENT_TIMESTAMP - INTERVAL '7 days'`,
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
            WHERE created_at >= CURRENT_TIMESTAMP - INTERVAL '7 days'`,
      args: [],
    });

    const activeUsers30Days = await db.execute({
      sql: `SELECT COUNT(DISTINCT user_id) as count
            FROM quiz_sessions
            WHERE created_at >= CURRENT_TIMESTAMP - INTERVAL '30 days'`,
      args: [],
    });

    const totalQuizzes = await db.execute({
      sql: "SELECT COUNT(*) as count FROM quiz_sessions",
      args: [],
    });

    const quizzesLast7Days = await db.execute({
      sql: `SELECT COUNT(*) as count
            FROM quiz_sessions
            WHERE created_at >= CURRENT_TIMESTAMP - INTERVAL '7 days'`,
      args: [],
    });

    const quizzesLast30Days = await db.execute({
      sql: `SELECT COUNT(*) as count
            FROM quiz_sessions
            WHERE created_at >= CURRENT_TIMESTAMP - INTERVAL '30 days'`,
      args: [],
    });

    const popularExams = await db.execute({
      sql: `SELECT exam_id, COUNT(*) as attempts
            FROM quiz_sessions
            WHERE created_at >= CURRENT_TIMESTAMP - INTERVAL '30 days'
            GROUP BY exam_id
            ORDER BY attempts DESC
            LIMIT 10`,
      args: [],
    });

    const popularSubjects = await db.execute({
      sql: `SELECT subject_id, COUNT(*) as attempts
            FROM quiz_sessions
            WHERE created_at >= CURRENT_TIMESTAMP - INTERVAL '30 days'
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
            WHERE created_at >= CURRENT_TIMESTAMP - INTERVAL '30 days' AND total_questions > 0
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
            WHERE created_at >= CURRENT_TIMESTAMP - INTERVAL '14 days'
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
            WHERE created_at >= CURRENT_TIMESTAMP - INTERVAL '30 days'`,
      args: [],
    });

    // 6. Detailed topic-level breakdown (sorted by count ASC - least to most)
    // Using Dimensional Model - show shared topics across exams
    let dimensionalQuery;
    let dimensionalArgs: any[];

    if (examFilter) {
      // Filter topics by exam using bridge table
      dimensionalQuery = `SELECT
              t.topic_name as topic,
              t.scope,
              COUNT(DISTINCT q.id) as question_count,
              1 as exam_count,
              STRING_AGG(DISTINCT q.source, ',') as sources,
              STRING_AGG(DISTINCT q.difficulty, ',') as difficulties
            FROM dim_topics t
            INNER JOIN bridge_exam_subject_topic b ON t.id = b.topic_id
            LEFT JOIN fact_exam_questions q ON t.id = q.topic_id
            WHERE b.exam_id = (SELECT id FROM dim_exams WHERE exam_code = ?)
            GROUP BY t.id
            ORDER BY question_count ASC, t.topic_name`;
      dimensionalArgs = [examFilter];
    } else {
      // Show all topics across all exams
      dimensionalQuery = `SELECT
              t.topic_name as topic,
              t.scope,
              COUNT(DISTINCT q.id) as question_count,
              COUNT(DISTINCT b.exam_id) as exam_count,
              STRING_AGG(DISTINCT q.source, ',') as sources,
              STRING_AGG(DISTINCT q.difficulty, ',') as difficulties
            FROM dim_topics t
            LEFT JOIN fact_exam_questions q ON t.id = q.topic_id
            LEFT JOIN bridge_exam_subject_topic b ON t.id = b.topic_id
            GROUP BY t.id
            ORDER BY question_count ASC, t.topic_name`;
      dimensionalArgs = [];
    }

    let topicBreakdown;
    try {
      const dimensionalResult = await db.execute({
        sql: dimensionalQuery,
        args: dimensionalArgs,
      });
      const dimensionalTopics = dimensionalResult.rows;

      console.log(`[Admin Analytics] Dimensional query returned ${dimensionalTopics.length} topics`);
      if (examFilter && dimensionalTopics.length === 0) {
        console.warn(`[Admin Analytics] No topics found for exam: ${examFilter}. Check if exam_code exists in dim_exams table.`);
      }

      topicBreakdown = {
        rows: dimensionalTopics.map((r: any) => ({
          topic: r.topic,
          scope: r.scope,
          exam_count: Number(r.exam_count),
          question_count: Number(r.question_count),
          sources: r.sources,
          difficulties: r.difficulties,
        })),
      };
    } catch (sqlError) {
      console.error("[Admin Analytics] SQL error in dimensional query:", sqlError);
      console.error("[Admin Analytics] Query:", dimensionalQuery);
      console.error("[Admin Analytics] Args:", dimensionalArgs);
      throw sqlError;
    }

    return NextResponse.json({
      questionMetrics: {
        total: Number(totalQuestions?.count || 0),
        bySource: questionsBySource.map((r: any) => ({
          source: r.source,
          count: Number(r.count),
        })),
        byDifficulty: questionsByDifficulty.map((r: any) => ({
          difficulty: r.difficulty,
          count: Number(r.count),
        })),
        byExam: questionsByExam.map((r: any) => ({
          examId: r.exam_id,
          count: Number(r.count),
        })),
      },
      reportMetrics: {
        byStatus: reportStats.map((r: any) => ({
          status: r.status,
          count: Number(r.count),
        })),
        recentCount: Number(recentReports?.count || 0),
      },
      usageMetrics: {
        users: {
          total: Number(totalUsers?.count || 0),
          active7Days: Number(activeUsers7Days?.count || 0),
          active30Days: Number(activeUsers30Days?.count || 0),
        },
        quizzes: {
          total: Number(totalQuizzes?.count || 0),
          last7Days: Number(quizzesLast7Days?.count || 0),
          last30Days: Number(quizzesLast30Days?.count || 0),
        },
        popularExams: popularExams.map((r: any) => ({
          examId: r.exam_id,
          attempts: Number(r.attempts),
        })),
        popularSubjects: popularSubjects.map((r: any) => ({
          subjectId: r.subject_id,
          attempts: Number(r.attempts),
        })),
        avgScores: avgScores.map((r: any) => ({
          examId: r.exam_id,
          avgScore: Number(r.avg_score_pct).toFixed(1),
        })),
      },
      dailyActivity: dailyActivity.map((r: any) => ({
        date: r.date,
        quizzes: Number(r.quizzes),
        users: Number(r.users),
      })),
      questionQuality: {
        lowAccuracy: lowAccuracyQuestions.map((r: any) => ({
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
        proUsers: Number(proUsers?.count || 0),
        revenue30Days: {
          count: Number(revenue30Days?.count || 0),
          total: Number(revenue30Days?.total || 0) / 100, // Convert paise to rupees
        },
      },
      topicBreakdown: topicBreakdown.rows,
      modelType: 'dimensional',
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to fetch analytics",
        details: errorMessage,
        examFilter: examFilter || "none"
      },
      { status: 500 }
    );
  }
}
