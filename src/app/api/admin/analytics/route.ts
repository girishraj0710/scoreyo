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

    // 1. Question Quality Metrics
    // FEATURE FLAG: Use dimensional model or legacy table
    const useDimensional = process.env.USE_DIMENSIONAL_MODEL === 'true';

    const totalQuestions = useDimensional
      ? await db.execute({
          sql: "SELECT COUNT(*) as count FROM fact_exam_questions",
          args: [],
        })
      : await db.execute({
          sql: "SELECT COUNT(*) as count FROM exam_questions",
          args: [],
        });

    const questionsBySource = useDimensional
      ? await db.execute({
          sql: `SELECT source, COUNT(*) as count
                FROM fact_exam_questions
                GROUP BY source
                ORDER BY count DESC
                LIMIT 10`,
          args: [],
        })
      : await db.execute({
          sql: `SELECT source, COUNT(*) as count
                FROM exam_questions
                GROUP BY source
                ORDER BY count DESC
                LIMIT 10`,
          args: [],
        });

    const questionsByDifficulty = useDimensional
      ? await db.execute({
          sql: `SELECT difficulty, COUNT(*) as count
                FROM fact_exam_questions
                GROUP BY difficulty`,
          args: [],
        })
      : await db.execute({
          sql: `SELECT difficulty, COUNT(*) as count
                FROM exam_questions
                GROUP BY difficulty`,
          args: [],
        });

    const questionsByExam = useDimensional
      ? await db.execute({
          sql: `SELECT e.exam_code as exam_id, e.exam_name, COUNT(DISTINCT q.id) as count
                FROM dim_exams e
                JOIN bridge_exam_subject_topic b ON e.id = b.exam_id
                JOIN fact_exam_questions q ON b.topic_id = q.topic_id
                GROUP BY e.id
                ORDER BY count DESC`,
          args: [],
        })
      : await db.execute({
          sql: `SELECT exam_id, COUNT(*) as count
                FROM exam_questions
                GROUP BY exam_id
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

    // 6. Detailed topic-level breakdown (sorted by count ASC - least to most)
    let topicBreakdown;

    if (useDimensional) {
      // NEW: Show shared topics across exams with dimensional model
      // Support optional exam filtering via bridge table
      let dimensionalQuery;
      let dimensionalArgs: any[];

      if (examFilter) {
        // Filter topics by exam using bridge table
        dimensionalQuery = `SELECT
                t.topic_name as topic,
                t.scope,
                COUNT(DISTINCT q.id) as question_count,
                COUNT(DISTINCT b.exam_id) as exam_count,
                GROUP_CONCAT(DISTINCT q.source) as sources,
                GROUP_CONCAT(DISTINCT q.difficulty) as difficulties
              FROM dim_topics t
              INNER JOIN bridge_exam_subject_topic b ON t.id = b.topic_id
              LEFT JOIN fact_exam_questions q ON t.id = q.topic_id AND q.exam_id = (SELECT id FROM dim_exams WHERE exam_code = ?)
              WHERE b.exam_id = (SELECT id FROM dim_exams WHERE exam_code = ?)
              GROUP BY t.id
              ORDER BY question_count ASC, t.topic_name`;
        dimensionalArgs = [examFilter, examFilter];
      } else {
        // Show all topics across all exams
        dimensionalQuery = `SELECT
                t.topic_name as topic,
                t.scope,
                COUNT(DISTINCT q.id) as question_count,
                COUNT(DISTINCT b.exam_id) as exam_count,
                GROUP_CONCAT(DISTINCT q.source) as sources,
                GROUP_CONCAT(DISTINCT q.difficulty) as difficulties
              FROM dim_topics t
              LEFT JOIN fact_exam_questions q ON t.id = q.topic_id
              LEFT JOIN bridge_exam_subject_topic b ON t.id = b.topic_id
              GROUP BY t.id
              ORDER BY question_count ASC, t.topic_name`;
        dimensionalArgs = [];
      }

      try {
        const dimensionalTopics = await db.execute({
          sql: dimensionalQuery,
          args: dimensionalArgs,
        });

        console.log(`[Admin Analytics] Dimensional query returned ${dimensionalTopics.rows.length} topics`);
        if (examFilter && dimensionalTopics.rows.length === 0) {
          console.warn(`[Admin Analytics] No topics found for exam: ${examFilter}. Check if exam_code exists in dim_exams table.`);
        }

        topicBreakdown = {
          rows: dimensionalTopics.rows.map((r: any) => ({
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
    } else {
      // OLD: Legacy topic breakdown by exam-subject-topic
      // First, get all existing questions grouped
      const existingQuestions = await db.execute({
        sql: `SELECT
                exam_id,
                subject_id,
                topic,
                source,
                difficulty,
                COUNT(*) as count
              FROM exam_questions
              GROUP BY exam_id, subject_id, topic, source, difficulty`,
        args: [],
      });

      // Build a map of existing questions
      const questionMap = new Map<string, any[]>();
      for (const row of existingQuestions.rows) {
        const key = `${row.exam_id}|||${row.subject_id}|||${row.topic}`;
        if (!questionMap.has(key)) {
          questionMap.set(key, []);
        }
        questionMap.get(key)!.push({
          source: row.source,
          difficulty: row.difficulty,
          count: Number(row.count),
        });
      }

      // Now generate ALL possible combinations from exam definitions
      const { examCategories } = await import("@/lib/exams");
      const allTopicCombinations: any[] = [];

      for (const category of examCategories) {
        for (const exam of category.exams) {
          for (const subject of exam.subjects) {
            for (const topic of subject.topics) {
              const key = `${exam.id}|||${subject.id}|||${topic}`;
              const existingData = questionMap.get(key);

              if (existingData && existingData.length > 0) {
                // Topic has questions - add each source/difficulty combo
                for (const item of existingData) {
                  allTopicCombinations.push({
                    exam_id: exam.id,
                    subject_id: subject.id,
                    topic: topic,
                    source: item.source,
                    difficulty: item.difficulty,
                    count: item.count,
                  });
                }
              } else {
                // Topic has NO questions - add with 0 count
                allTopicCombinations.push({
                  exam_id: exam.id,
                  subject_id: subject.id,
                  topic: topic,
                  source: "-",
                  difficulty: "-",
                  count: 0,
                });
              }
            }
          }
        }
      }

      // Sort by count ASC (0s first), then by exam/subject/topic
      topicBreakdown = {
        rows: allTopicCombinations.sort((a, b) => {
          if (a.count !== b.count) return a.count - b.count;
          if (a.exam_id !== b.exam_id) return a.exam_id.localeCompare(b.exam_id);
          if (a.subject_id !== b.subject_id) return a.subject_id.localeCompare(b.subject_id);
          return a.topic.localeCompare(b.topic);
        }),
      };
    }

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
      topicBreakdown: useDimensional
        ? topicBreakdown.rows
        : topicBreakdown.rows.map((r: any) => ({
            examId: r.exam_id,
            subjectId: r.subject_id,
            topic: r.topic,
            source: r.source,
            difficulty: r.difficulty,
            count: Number(r.count),
          })),
      modelType: useDimensional ? 'dimensional' : 'legacy',
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
