import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "prepgenie.db");

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    initializeDb(db);
  }
  return db;
}

function initializeDb(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT DEFAULT '',
      avatar_color TEXT DEFAULT '#6366f1',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS quiz_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      exam_id TEXT NOT NULL,
      subject_id TEXT NOT NULL,
      topic TEXT NOT NULL,
      total_questions INTEGER NOT NULL,
      correct_answers INTEGER NOT NULL,
      time_taken_seconds INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS question_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      exam_id TEXT NOT NULL,
      subject_id TEXT NOT NULL,
      topic TEXT NOT NULL,
      question_text TEXT NOT NULL,
      options TEXT NOT NULL,
      correct_answer INTEGER NOT NULL,
      user_answer INTEGER,
      is_correct BOOLEAN,
      explanation TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES quiz_sessions(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS topic_mastery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      exam_id TEXT NOT NULL,
      subject_id TEXT NOT NULL,
      topic TEXT NOT NULL,
      total_attempted INTEGER DEFAULT 0,
      total_correct INTEGER DEFAULT 0,
      mastery_score REAL DEFAULT 0,
      last_attempted DATETIME,
      next_review DATETIME,
      UNIQUE(user_id, exam_id, subject_id, topic),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS reported_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      exam_id TEXT NOT NULL,
      subject_id TEXT NOT NULL,
      topic TEXT NOT NULL,
      question_text TEXT NOT NULL,
      reported_issue TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_quiz_sessions_user ON quiz_sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_quiz_sessions_exam ON quiz_sessions(exam_id);
    CREATE INDEX IF NOT EXISTS idx_question_attempts_session ON question_attempts(session_id);
    CREATE INDEX IF NOT EXISTS idx_topic_mastery_user ON topic_mastery(user_id, exam_id);
    CREATE INDEX IF NOT EXISTS idx_reported_questions ON reported_questions(status);

    CREATE TABLE IF NOT EXISTS cached_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exam_id TEXT NOT NULL,
      subject_id TEXT NOT NULL,
      topic TEXT NOT NULL,
      difficulty TEXT NOT NULL DEFAULT 'medium',
      question_json TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      used_count INTEGER DEFAULT 0
    );

    CREATE INDEX IF NOT EXISTS idx_cached_questions_lookup ON cached_questions(exam_id, subject_id, topic);
    CREATE INDEX IF NOT EXISTS idx_cached_questions_difficulty ON cached_questions(exam_id, subject_id, topic, difficulty);

    CREATE TABLE IF NOT EXISTS otp_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      code TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      verified BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_otp_email ON otp_codes(email, code);

    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL UNIQUE,
      plan TEXT NOT NULL DEFAULT 'free',
      razorpay_payment_id TEXT,
      razorpay_order_id TEXT,
      amount INTEGER DEFAULT 0,
      currency TEXT DEFAULT 'INR',
      status TEXT DEFAULT 'active',
      started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
    CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

    CREATE TABLE IF NOT EXISTS payment_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      razorpay_payment_id TEXT,
      razorpay_order_id TEXT,
      plan TEXT NOT NULL,
      amount INTEGER NOT NULL,
      currency TEXT DEFAULT 'INR',
      status TEXT DEFAULT 'success',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE INDEX IF NOT EXISTS idx_payment_history_user ON payment_history(user_id);

    CREATE TABLE IF NOT EXISTS mock_tests (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      exam_id TEXT NOT NULL,
      total_questions INTEGER NOT NULL,
      correct_answers INTEGER DEFAULT 0,
      time_limit_seconds INTEGER NOT NULL,
      time_taken_seconds INTEGER DEFAULT 0,
      status TEXT DEFAULT 'in_progress',
      questions_json TEXT NOT NULL,
      answers_json TEXT DEFAULT '[]',
      started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE INDEX IF NOT EXISTS idx_mock_tests_user ON mock_tests(user_id);
    CREATE INDEX IF NOT EXISTS idx_mock_tests_exam ON mock_tests(exam_id);
    CREATE INDEX IF NOT EXISTS idx_mock_tests_status ON mock_tests(status);
  `);

  // Create a default user if none exists
  const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
  if (userCount.count === 0) {
    db.prepare("INSERT INTO users (id, name) VALUES (?, ?)").run(
      "default-user",
      "Student"
    );
  }
}

// ─── User functions ──────────────────────────────────────

export function getUser(userId: string = "default-user") {
  return getDb().prepare("SELECT * FROM users WHERE id = ?").get(userId);
}

export function updateUserName(userId: string, name: string) {
  return getDb()
    .prepare("UPDATE users SET name = ? WHERE id = ?")
    .run(name, userId);
}

export function createNewUser(id: string, name: string, email: string = "", avatarColor: string = "#6366f1") {
  return getDb()
    .prepare("INSERT INTO users (id, name, email, avatar_color) VALUES (?, ?, ?, ?)")
    .run(id, name, email, avatarColor);
}

export function listUsers() {
  return getDb()
    .prepare("SELECT id, name, email, avatar_color, created_at FROM users ORDER BY created_at DESC")
    .all() as any[];
}

export function updateUserProfile(userId: string, name: string, email: string) {
  return getDb()
    .prepare("UPDATE users SET name = ?, email = ? WHERE id = ?")
    .run(name, email, userId);
}

export function getUserByEmail(email: string) {
  return getDb()
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email.toLowerCase().trim()) as any | undefined;
}

// ─── OTP functions ──────────────────────────────────────

export function saveOtp(email: string, code: string, expiresMinutes: number = 10) {
  const expiresAt = new Date(Date.now() + expiresMinutes * 60 * 1000).toISOString();
  // Clear old OTPs for this email
  getDb().prepare("DELETE FROM otp_codes WHERE email = ?").run(email.toLowerCase().trim());
  // Save new OTP
  getDb()
    .prepare("INSERT INTO otp_codes (email, code, expires_at) VALUES (?, ?, ?)")
    .run(email.toLowerCase().trim(), code, expiresAt);
}

export function verifyOtp(email: string, code: string): boolean {
  const otp = getDb()
    .prepare("SELECT * FROM otp_codes WHERE email = ? AND code = ? AND verified = 0")
    .get(email.toLowerCase().trim(), code) as any;

  if (!otp) return false;

  // Check expiry
  if (new Date(otp.expires_at) < new Date()) {
    getDb().prepare("DELETE FROM otp_codes WHERE id = ?").run(otp.id);
    return false;
  }

  // Mark as verified
  getDb().prepare("UPDATE otp_codes SET verified = 1 WHERE id = ?").run(otp.id);
  return true;
}

export function isOtpVerified(email: string): boolean {
  const otp = getDb()
    .prepare("SELECT * FROM otp_codes WHERE email = ? AND verified = 1 ORDER BY created_at DESC LIMIT 1")
    .get(email.toLowerCase().trim()) as any;

  if (!otp) return false;

  // Verified OTP is valid for 15 minutes (to complete registration)
  // expires_at is stored as ISO string (UTC) so compare directly
  const expiresAt = new Date(otp.expires_at);
  return expiresAt > new Date();
}

export function cleanupOtps() {
  getDb().prepare("DELETE FROM otp_codes WHERE expires_at < ?").run(new Date().toISOString());
}

// ─── Quiz Session functions ──────────────────────────────

export function createQuizSession(
  sessionId: string,
  userId: string,
  examId: string,
  subjectId: string,
  topic: string,
  totalQuestions: number,
  correctAnswers: number,
  timeTaken: number
) {
  return getDb()
    .prepare(
      `INSERT INTO quiz_sessions (id, user_id, exam_id, subject_id, topic, total_questions, correct_answers, time_taken_seconds)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(sessionId, userId, examId, subjectId, topic, totalQuestions, correctAnswers, timeTaken);
}

export function getRecentSessions(userId: string, limit: number = 10) {
  return getDb()
    .prepare(
      `SELECT * FROM quiz_sessions WHERE user_id = ? ORDER BY created_at DESC LIMIT ?`
    )
    .all(userId, limit);
}

export function getSessionsByExam(userId: string, examId: string) {
  return getDb()
    .prepare(
      `SELECT * FROM quiz_sessions WHERE user_id = ? AND exam_id = ? ORDER BY created_at DESC`
    )
    .all(userId, examId);
}

// ─── Question Attempt functions ──────────────────────────

export function saveQuestionAttempts(
  attempts: Array<{
    sessionId: string;
    userId: string;
    examId: string;
    subjectId: string;
    topic: string;
    questionText: string;
    options: string[];
    correctAnswer: number;
    userAnswer: number | null;
    isCorrect: boolean;
    explanation: string;
  }>
) {
  const stmt = getDb().prepare(
    `INSERT INTO question_attempts (session_id, user_id, exam_id, subject_id, topic, question_text, options, correct_answer, user_answer, is_correct, explanation)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const insertMany = getDb().transaction((items: typeof attempts) => {
    for (const item of items) {
      stmt.run(
        item.sessionId,
        item.userId,
        item.examId,
        item.subjectId,
        item.topic,
        item.questionText,
        JSON.stringify(item.options),
        item.correctAnswer,
        item.userAnswer,
        item.isCorrect ? 1 : 0,
        item.explanation
      );
    }
  });

  insertMany(attempts);
}

// ─── Topic Mastery functions ─────────────────────────────

export function updateTopicMastery(
  userId: string,
  examId: string,
  subjectId: string,
  topic: string,
  attempted: number,
  correct: number
) {
  const existing = getDb()
    .prepare(
      `SELECT * FROM topic_mastery WHERE user_id = ? AND exam_id = ? AND subject_id = ? AND topic = ?`
    )
    .get(userId, examId, subjectId, topic) as any;

  if (existing) {
    const newTotal = existing.total_attempted + attempted;
    const newCorrect = existing.total_correct + correct;
    const mastery = newTotal > 0 ? (newCorrect / newTotal) * 100 : 0;

    // Spaced repetition: schedule next review based on mastery
    const daysUntilReview = mastery >= 90 ? 7 : mastery >= 70 ? 3 : mastery >= 50 ? 1 : 0;
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + daysUntilReview);

    getDb()
      .prepare(
        `UPDATE topic_mastery SET total_attempted = ?, total_correct = ?, mastery_score = ?, last_attempted = CURRENT_TIMESTAMP, next_review = ? WHERE id = ?`
      )
      .run(newTotal, newCorrect, mastery, nextReview.toISOString(), existing.id);
  } else {
    const mastery = attempted > 0 ? (correct / attempted) * 100 : 0;
    const daysUntilReview = mastery >= 90 ? 7 : mastery >= 70 ? 3 : mastery >= 50 ? 1 : 0;
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + daysUntilReview);

    getDb()
      .prepare(
        `INSERT INTO topic_mastery (user_id, exam_id, subject_id, topic, total_attempted, total_correct, mastery_score, last_attempted, next_review)
         VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)`
      )
      .run(userId, examId, subjectId, topic, attempted, correct, mastery, nextReview.toISOString());
  }
}

export function getTopicMastery(userId: string, examId: string) {
  return getDb()
    .prepare(
      `SELECT * FROM topic_mastery WHERE user_id = ? AND exam_id = ? ORDER BY mastery_score ASC`
    )
    .all(userId, examId) as any[];
}

export function getAllMastery(userId: string) {
  return getDb()
    .prepare(
      `SELECT * FROM topic_mastery WHERE user_id = ? ORDER BY last_attempted DESC`
    )
    .all(userId) as any[];
}

export function getWeakTopics(userId: string, examId: string, limit: number = 5) {
  return getDb()
    .prepare(
      `SELECT * FROM topic_mastery WHERE user_id = ? AND exam_id = ? AND total_attempted > 0 ORDER BY mastery_score ASC LIMIT ?`
    )
    .all(userId, examId, limit) as any[];
}

export function getTopicsForReview(userId: string) {
  return getDb()
    .prepare(
      `SELECT * FROM topic_mastery WHERE user_id = ? AND next_review <= CURRENT_TIMESTAMP ORDER BY mastery_score ASC`
    )
    .all(userId) as any[];
}

// ─── Report functions ────────────────────────────────────

export function saveReport(
  userId: string,
  examId: string,
  subjectId: string,
  topic: string,
  questionText: string,
  reportedIssue: string
) {
  return getDb()
    .prepare(
      `INSERT INTO reported_questions (user_id, exam_id, subject_id, topic, question_text, reported_issue)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(userId, examId, subjectId, topic, questionText, reportedIssue);
}

export function getReports(status: string = "pending") {
  return getDb()
    .prepare("SELECT * FROM reported_questions WHERE status = ? ORDER BY created_at DESC")
    .all(status);
}

// ─── Question Cache functions ────────────────────────────

export function getCachedQuestions(
  examId: string,
  subjectId: string,
  topic: string,
  difficulty: string = "mixed",
  limit: number = 10
) {
  const db = getDb();
  let rows: any[];

  if (difficulty === "mixed") {
    rows = db
      .prepare(
        `SELECT * FROM cached_questions WHERE exam_id = ? AND subject_id = ? AND topic = ? ORDER BY used_count ASC, RANDOM() LIMIT ?`
      )
      .all(examId, subjectId, topic, limit);
  } else {
    rows = db
      .prepare(
        `SELECT * FROM cached_questions WHERE exam_id = ? AND subject_id = ? AND topic = ? AND difficulty = ? ORDER BY used_count ASC, RANDOM() LIMIT ?`
      )
      .all(examId, subjectId, topic, difficulty, limit);
  }

  return rows.map((row: any) => ({
    ...JSON.parse(row.question_json),
    _cacheId: row.id,
  }));
}

export function saveCachedQuestions(
  examId: string,
  subjectId: string,
  topic: string,
  questions: Array<{ question: string; options: string[]; correctAnswer: number; explanation: string; difficulty: string }>
) {
  const db = getDb();
  const stmt = db.prepare(
    `INSERT INTO cached_questions (exam_id, subject_id, topic, difficulty, question_json) VALUES (?, ?, ?, ?, ?)`
  );

  // Check for duplicates by question text
  const existing = db
    .prepare(`SELECT question_json FROM cached_questions WHERE exam_id = ? AND subject_id = ? AND topic = ?`)
    .all(examId, subjectId, topic) as any[];
  const existingTexts = new Set(
    existing.map((r: any) => JSON.parse(r.question_json).question?.toLowerCase().trim())
  );

  const insertMany = db.transaction((items: typeof questions) => {
    let added = 0;
    for (const q of items) {
      // Skip duplicates
      if (existingTexts.has(q.question?.toLowerCase().trim())) continue;
      stmt.run(examId, subjectId, topic, q.difficulty || "medium", JSON.stringify(q));
      existingTexts.add(q.question?.toLowerCase().trim());
      added++;
    }
    return added;
  });

  return insertMany(questions);
}

export function markCachedQuestionsUsed(cacheIds: number[]) {
  if (cacheIds.length === 0) return;
  const db = getDb();
  const stmt = db.prepare(`UPDATE cached_questions SET used_count = used_count + 1 WHERE id = ?`);
  const updateMany = db.transaction((ids: number[]) => {
    for (const id of ids) {
      stmt.run(id);
    }
  });
  updateMany(cacheIds);
}

export function getCachedQuestionCount(examId: string, subjectId: string, topic: string) {
  const result = getDb()
    .prepare(`SELECT COUNT(*) as count FROM cached_questions WHERE exam_id = ? AND subject_id = ? AND topic = ?`)
    .get(examId, subjectId, topic) as { count: number };
  return result.count;
}

// ─── Stats functions ─────────────────────────────────────

export function getUserStats(userId: string) {
  const totalSessions = getDb()
    .prepare("SELECT COUNT(*) as count FROM quiz_sessions WHERE user_id = ?")
    .get(userId) as { count: number };

  const totalQuestions = getDb()
    .prepare(
      "SELECT COALESCE(SUM(total_questions), 0) as total, COALESCE(SUM(correct_answers), 0) as correct FROM quiz_sessions WHERE user_id = ?"
    )
    .get(userId) as { total: number; correct: number };

  const streakData = getDb()
    .prepare(
      `SELECT DISTINCT DATE(created_at) as day FROM quiz_sessions WHERE user_id = ? ORDER BY day DESC`
    )
    .all(userId) as { day: string }[];

  // Calculate streak
  let streak = 0;
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  if (streakData.length > 0) {
    const lastDay = streakData[0].day;
    if (lastDay === today || lastDay === yesterday) {
      streak = 1;
      for (let i = 1; i < streakData.length; i++) {
        const current = new Date(streakData[i - 1].day);
        const prev = new Date(streakData[i].day);
        const diffDays = (current.getTime() - prev.getTime()) / 86400000;
        if (diffDays === 1) {
          streak++;
        } else {
          break;
        }
      }
    }
  }

  const examBreakdown = getDb()
    .prepare(
      `SELECT exam_id, COUNT(*) as sessions, SUM(total_questions) as questions, SUM(correct_answers) as correct
       FROM quiz_sessions WHERE user_id = ? GROUP BY exam_id`
    )
    .all(userId) as any[];

  return {
    totalSessions: totalSessions.count,
    totalQuestions: totalQuestions.total,
    totalCorrect: totalQuestions.correct,
    accuracy:
      totalQuestions.total > 0
        ? Math.round((totalQuestions.correct / totalQuestions.total) * 100)
        : 0,
    streak,
    examBreakdown,
  };
}

// ─── Review functions ───────────────────────────────────

export function getReviewSummary(userId: string) {
  const now = new Date().toISOString();
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  const weekEnd = new Date();
  weekEnd.setDate(weekEnd.getDate() + 7);

  const overdue = getDb()
    .prepare(`SELECT * FROM topic_mastery WHERE user_id = ? AND next_review < ? AND total_attempted > 0 ORDER BY mastery_score ASC`)
    .all(userId, now) as any[];

  const dueToday = getDb()
    .prepare(`SELECT * FROM topic_mastery WHERE user_id = ? AND next_review >= ? AND next_review <= ? AND total_attempted > 0 ORDER BY mastery_score ASC`)
    .all(userId, now, todayEnd.toISOString()) as any[];

  const upcoming = getDb()
    .prepare(`SELECT * FROM topic_mastery WHERE user_id = ? AND next_review > ? AND next_review <= ? AND total_attempted > 0 ORDER BY next_review ASC`)
    .all(userId, todayEnd.toISOString(), weekEnd.toISOString()) as any[];

  return { overdue, dueToday, upcoming };
}

// ─── Leaderboard functions ──────────────────────────────

export function getPersonalBests(userId: string) {
  return getDb()
    .prepare(
      `SELECT exam_id,
              MAX(CAST(correct_answers AS REAL) / NULLIF(total_questions, 0) * 100) as best_accuracy,
              COUNT(*) as total_sessions,
              SUM(total_questions) as total_questions,
              SUM(correct_answers) as total_correct
       FROM quiz_sessions WHERE user_id = ? GROUP BY exam_id ORDER BY best_accuracy DESC`
    )
    .all(userId) as any[];
}

export function getLongestStreak(userId: string) {
  const streakData = getDb()
    .prepare(`SELECT DISTINCT DATE(created_at) as day FROM quiz_sessions WHERE user_id = ? ORDER BY day ASC`)
    .all(userId) as { day: string }[];

  if (streakData.length === 0) return 0;

  let longestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < streakData.length; i++) {
    const prev = new Date(streakData[i - 1].day);
    const curr = new Date(streakData[i].day);
    const diffDays = (curr.getTime() - prev.getTime()) / 86400000;
    if (diffDays === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return longestStreak;
}

export function getMilestones(userId: string) {
  const stats = getUserStats(userId);
  const milestones = [
    { label: "First Quiz", target: 1, current: stats.totalSessions, type: "sessions" },
    { label: "10 Quizzes", target: 10, current: stats.totalSessions, type: "sessions" },
    { label: "50 Quizzes", target: 50, current: stats.totalSessions, type: "sessions" },
    { label: "100 Questions", target: 100, current: stats.totalQuestions, type: "questions" },
    { label: "500 Questions", target: 500, current: stats.totalQuestions, type: "questions" },
    { label: "1000 Questions", target: 1000, current: stats.totalQuestions, type: "questions" },
    { label: "80% Accuracy", target: 80, current: stats.accuracy, type: "accuracy" },
    { label: "90% Accuracy", target: 90, current: stats.accuracy, type: "accuracy" },
    { label: "7-Day Streak", target: 7, current: stats.streak, type: "streak" },
    { label: "30-Day Streak", target: 30, current: stats.streak, type: "streak" },
  ];

  return milestones.map((m) => ({
    ...m,
    achieved: m.current >= m.target,
    progress: Math.min(100, Math.round((m.current / m.target) * 100)),
  }));
}

export function getLeaderboard() {
  return getDb()
    .prepare(
      `SELECT u.id, u.name, u.avatar_color,
              COUNT(qs.id) as total_sessions,
              COALESCE(SUM(qs.total_questions), 0) as total_questions,
              COALESCE(SUM(qs.correct_answers), 0) as total_correct,
              CASE WHEN SUM(qs.total_questions) > 0 THEN ROUND(CAST(SUM(qs.correct_answers) AS REAL) / SUM(qs.total_questions) * 100) ELSE 0 END as accuracy
       FROM users u LEFT JOIN quiz_sessions qs ON u.id = qs.user_id
       GROUP BY u.id HAVING total_sessions > 0
       ORDER BY total_questions DESC, accuracy DESC`
    )
    .all() as any[];
}

// ─── Subscription functions ─────────────────────────────

export function getUserSubscription(userId: string) {
  return getDb()
    .prepare("SELECT * FROM subscriptions WHERE user_id = ? AND status = 'active'")
    .get(userId) as any | undefined;
}

export function isProUser(userId: string): boolean {
  const sub = getUserSubscription(userId);
  if (!sub) return false;
  if (sub.plan === "free") return false;
  // Check if subscription has expired
  if (sub.expires_at && new Date(sub.expires_at) < new Date()) {
    // Mark as expired
    getDb().prepare("UPDATE subscriptions SET status = 'expired' WHERE id = ?").run(sub.id);
    return false;
  }
  return true;
}

export function getTodayQuizCount(userId: string): number {
  const today = new Date().toISOString().split("T")[0];
  const result = getDb()
    .prepare("SELECT COUNT(*) as count FROM quiz_sessions WHERE user_id = ? AND DATE(created_at) = ?")
    .get(userId, today) as { count: number };
  return result.count;
}

export function createSubscription(
  userId: string,
  plan: string,
  amount: number,
  razorpayPaymentId: string,
  razorpayOrderId: string
) {
  const now = new Date();
  let expiresAt: Date;

  if (plan === "monthly") {
    expiresAt = new Date(now);
    expiresAt.setMonth(expiresAt.getMonth() + 1);
  } else {
    // quarterly
    expiresAt = new Date(now);
    expiresAt.setMonth(expiresAt.getMonth() + 3);
  }

  // Upsert subscription
  const existing = getDb()
    .prepare("SELECT * FROM subscriptions WHERE user_id = ?")
    .get(userId) as any;

  if (existing) {
    getDb()
      .prepare(
        `UPDATE subscriptions SET plan = ?, amount = ?, razorpay_payment_id = ?, razorpay_order_id = ?, status = 'active', started_at = ?, expires_at = ? WHERE user_id = ?`
      )
      .run(plan, amount, razorpayPaymentId, razorpayOrderId, now.toISOString(), expiresAt.toISOString(), userId);
  } else {
    getDb()
      .prepare(
        `INSERT INTO subscriptions (user_id, plan, amount, razorpay_payment_id, razorpay_order_id, status, started_at, expires_at) VALUES (?, ?, ?, ?, ?, 'active', ?, ?)`
      )
      .run(userId, plan, amount, razorpayPaymentId, razorpayOrderId, now.toISOString(), expiresAt.toISOString());
  }

  // Record payment history
  getDb()
    .prepare(
      `INSERT INTO payment_history (user_id, razorpay_payment_id, razorpay_order_id, plan, amount) VALUES (?, ?, ?, ?, ?)`
    )
    .run(userId, razorpayPaymentId, razorpayOrderId, plan, amount);
}

export function getPaymentHistory(userId: string) {
  return getDb()
    .prepare("SELECT * FROM payment_history WHERE user_id = ? ORDER BY created_at DESC")
    .all(userId) as any[];
}

// ─── Mock Test functions ────────────────────────────────

export function createMockTest(
  id: string,
  userId: string,
  examId: string,
  totalQuestions: number,
  timeLimitSeconds: number,
  questionsJson: string
) {
  return getDb()
    .prepare(
      `INSERT INTO mock_tests (id, user_id, exam_id, total_questions, time_limit_seconds, questions_json) VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(id, userId, examId, totalQuestions, timeLimitSeconds, questionsJson);
}

export function getMockTest(id: string, userId: string) {
  return getDb()
    .prepare("SELECT * FROM mock_tests WHERE id = ? AND user_id = ?")
    .get(id, userId) as any | undefined;
}

export function completeMockTest(
  id: string,
  userId: string,
  correctAnswers: number,
  timeTakenSeconds: number,
  answersJson: string
) {
  return getDb()
    .prepare(
      `UPDATE mock_tests SET correct_answers = ?, time_taken_seconds = ?, answers_json = ?, status = 'completed', completed_at = ? WHERE id = ? AND user_id = ?`
    )
    .run(correctAnswers, timeTakenSeconds, answersJson, new Date().toISOString(), id, userId);
}

export function getUserMockTests(userId: string) {
  return getDb()
    .prepare("SELECT id, exam_id, total_questions, correct_answers, time_limit_seconds, time_taken_seconds, status, started_at, completed_at FROM mock_tests WHERE user_id = ? ORDER BY started_at DESC")
    .all(userId) as any[];
}

export function getInProgressMockTest(userId: string) {
  return getDb()
    .prepare("SELECT * FROM mock_tests WHERE user_id = ? AND status = 'in_progress' ORDER BY started_at DESC LIMIT 1")
    .get(userId) as any | undefined;
}

// ─── Performance Report functions ───────────────────────

export function getDetailedPerformance(userId: string) {
  // Subject-wise breakdown
  const subjectBreakdown = getDb()
    .prepare(
      `SELECT exam_id, subject_id,
              COUNT(*) as total_sessions,
              SUM(total_questions) as total_questions,
              SUM(correct_answers) as total_correct,
              AVG(time_taken_seconds) as avg_time,
              ROUND(CAST(SUM(correct_answers) AS REAL) / NULLIF(SUM(total_questions), 0) * 100) as accuracy
       FROM quiz_sessions WHERE user_id = ? GROUP BY exam_id, subject_id ORDER BY accuracy ASC`
    )
    .all(userId) as any[];

  // Daily activity (last 30 days)
  const dailyActivity = getDb()
    .prepare(
      `SELECT DATE(created_at) as day,
              COUNT(*) as sessions,
              SUM(total_questions) as questions,
              SUM(correct_answers) as correct
       FROM quiz_sessions WHERE user_id = ? AND created_at >= DATE('now', '-30 days')
       GROUP BY DATE(created_at) ORDER BY day ASC`
    )
    .all(userId) as any[];

  // Difficulty breakdown
  const difficultyBreakdown = getDb()
    .prepare(
      `SELECT
         CASE
           WHEN CAST(correct_answers AS REAL) / NULLIF(total_questions, 0) >= 0.8 THEN 'excellent'
           WHEN CAST(correct_answers AS REAL) / NULLIF(total_questions, 0) >= 0.6 THEN 'good'
           WHEN CAST(correct_answers AS REAL) / NULLIF(total_questions, 0) >= 0.4 THEN 'average'
           ELSE 'needs_work'
         END as performance_band,
         COUNT(*) as count
       FROM quiz_sessions WHERE user_id = ? GROUP BY performance_band`
    )
    .all(userId) as any[];

  // Time per question trend (last 20 sessions)
  const timeTrend = getDb()
    .prepare(
      `SELECT ROUND(CAST(time_taken_seconds AS REAL) / NULLIF(total_questions, 0), 1) as avg_seconds_per_question,
              ROUND(CAST(correct_answers AS REAL) / NULLIF(total_questions, 0) * 100) as accuracy,
              DATE(created_at) as day
       FROM quiz_sessions WHERE user_id = ? AND time_taken_seconds > 0 ORDER BY created_at DESC LIMIT 20`
    )
    .all(userId) as any[];

  // Accuracy trend (last 20 sessions)
  const accuracyTrend = getDb()
    .prepare(
      `SELECT ROUND(CAST(correct_answers AS REAL) / NULLIF(total_questions, 0) * 100) as accuracy,
              topic, exam_id, DATE(created_at) as day
       FROM quiz_sessions WHERE user_id = ? ORDER BY created_at DESC LIMIT 20`
    )
    .all(userId) as any[];

  // Strongest & weakest topics
  const topicPerformance = getDb()
    .prepare(
      `SELECT exam_id, subject_id, topic, total_attempted, total_correct, mastery_score
       FROM topic_mastery WHERE user_id = ? AND total_attempted >= 3 ORDER BY mastery_score DESC`
    )
    .all(userId) as any[];

  // Mock test history
  const mockTestHistory = getDb()
    .prepare(
      `SELECT id, exam_id, total_questions, correct_answers, time_limit_seconds, time_taken_seconds, status, completed_at
       FROM mock_tests WHERE user_id = ? AND status = 'completed' ORDER BY completed_at DESC LIMIT 10`
    )
    .all(userId) as any[];

  return {
    subjectBreakdown,
    dailyActivity,
    difficultyBreakdown,
    timeTrend: timeTrend.reverse(),
    accuracyTrend: accuracyTrend.reverse(),
    topicPerformance,
    mockTestHistory,
    strongTopics: topicPerformance.slice(0, 5),
    weakTopics: topicPerformance.slice(-5).reverse(),
  };
}
