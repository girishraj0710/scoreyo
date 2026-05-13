import { createClient, type Client } from "@libsql/client";

let client: Client | null = null;
let initialized = false;

function getClient(): Client {
  if (!client) {
    client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });
  }
  return client;
}

async function ensureInitialized() {
  if (initialized) return;
  await initializeDb();
  initialized = true;
}

async function initializeDb() {
  const db = getClient();

  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT DEFAULT '',
      age INTEGER,
      location TEXT,
      phone_number TEXT,
      exam_preparing_for TEXT,
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
      pressure_mode BOOLEAN DEFAULT 0,
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

    CREATE TABLE IF NOT EXISTS weakness_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      exam_id TEXT NOT NULL,
      subject_id TEXT NOT NULL,
      topic TEXT NOT NULL,
      calculation_errors INTEGER DEFAULT 0,
      concept_errors INTEGER DEFAULT 0,
      time_errors INTEGER DEFAULT 0,
      careless_errors INTEGER DEFAULT 0,
      total_errors INTEGER DEFAULT 0,
      last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, exam_id, subject_id, topic),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE INDEX IF NOT EXISTS idx_weakness_profiles_user ON weakness_profiles(user_id);

    CREATE TABLE IF NOT EXISTS clarifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      question_text TEXT NOT NULL,
      user_question TEXT NOT NULL,
      ai_response TEXT NOT NULL,
      helpful BOOLEAN DEFAULT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE INDEX IF NOT EXISTS idx_clarifications_question ON clarifications(question_text);

    CREATE TABLE IF NOT EXISTS daily_practice_problems (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      exam_id TEXT NOT NULL,
      subject_id TEXT NOT NULL,
      topic TEXT NOT NULL,
      questions TEXT NOT NULL,
      duration_minutes INTEGER DEFAULT 10,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS dpp_completions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      dpp_id TEXT NOT NULL,
      score INTEGER NOT NULL,
      total_questions INTEGER NOT NULL,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (dpp_id) REFERENCES daily_practice_problems(id)
    );

    CREATE INDEX IF NOT EXISTS idx_dpp_completions_user ON dpp_completions(user_id);

    CREATE TABLE IF NOT EXISTS daily_sprints (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      start_time DATETIME NOT NULL,
      end_time DATETIME NOT NULL,
      topic TEXT NOT NULL,
      exam_id TEXT NOT NULL,
      subject_id TEXT NOT NULL,
      questions TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sprint_participations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sprint_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      score INTEGER NOT NULL,
      total_questions INTEGER NOT NULL,
      time_taken_seconds INTEGER NOT NULL,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sprint_id) REFERENCES daily_sprints(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE INDEX IF NOT EXISTS idx_sprint_participations ON sprint_participations(sprint_id, score DESC);

    CREATE TABLE IF NOT EXISTS english_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      path_id TEXT NOT NULL,
      topic_id TEXT NOT NULL,
      level TEXT NOT NULL,
      completed_questions INTEGER DEFAULT 0,
      correct_answers INTEGER DEFAULT 0,
      total_time_seconds INTEGER DEFAULT 0,
      last_practiced DATETIME,
      mastery_score REAL DEFAULT 0,
      streak_days INTEGER DEFAULT 0,
      UNIQUE(user_id, path_id, topic_id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE INDEX IF NOT EXISTS idx_english_progress_user ON english_progress(user_id);

    CREATE TABLE IF NOT EXISTS english_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path_id TEXT NOT NULL,
      topic_id TEXT NOT NULL,
      level TEXT NOT NULL,
      question TEXT NOT NULL,
      options TEXT NOT NULL,
      correct_answer INTEGER NOT NULL,
      explanation TEXT NOT NULL,
      difficulty TEXT DEFAULT 'medium',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_english_questions_lookup ON english_questions(path_id, topic_id, level);

    CREATE TABLE IF NOT EXISTS english_daily_practice (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      date TEXT NOT NULL,
      questions_completed INTEGER DEFAULT 0,
      correct_answers INTEGER DEFAULT 0,
      streak_days INTEGER DEFAULT 0,
      UNIQUE(user_id, date),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE INDEX IF NOT EXISTS idx_english_daily_user ON english_daily_practice(user_id, date DESC);

    CREATE TABLE IF NOT EXISTS exam_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exam_id TEXT NOT NULL,
      subject_id TEXT NOT NULL,
      topic TEXT NOT NULL,
      question TEXT NOT NULL,
      options TEXT NOT NULL,
      correct_answer INTEGER NOT NULL,
      explanation TEXT NOT NULL,
      difficulty TEXT DEFAULT 'medium',
      source TEXT DEFAULT 'verified',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_exam_questions_lookup ON exam_questions(exam_id, subject_id, topic, difficulty);

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

    CREATE TABLE IF NOT EXISTS user_quiz_levels (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      exam_id TEXT NOT NULL,
      subject_id TEXT NOT NULL,
      level_number INTEGER NOT NULL,
      level_type TEXT NOT NULL DEFAULT 'normal',
      is_unlocked INTEGER DEFAULT 0,
      is_completed INTEGER DEFAULT 0,
      stars_earned INTEGER DEFAULT 0,
      best_accuracy INTEGER DEFAULT 0,
      attempts INTEGER DEFAULT 0,
      completed_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, exam_id, subject_id, level_number)
    );

    CREATE TABLE IF NOT EXISTS user_english_levels (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      path_id TEXT NOT NULL,
      topic_id TEXT NOT NULL,
      level_number INTEGER NOT NULL,
      is_unlocked INTEGER DEFAULT 0,
      practice_completed INTEGER DEFAULT 0,
      test_completed INTEGER DEFAULT 0,
      stars_earned INTEGER DEFAULT 0,
      best_accuracy INTEGER DEFAULT 0,
      attempts INTEGER DEFAULT 0,
      completed_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, path_id, topic_id)
    );

    CREATE TABLE IF NOT EXISTS level_definitions (
      id TEXT PRIMARY KEY,
      exam_id TEXT NOT NULL,
      subject_id TEXT NOT NULL,
      level_number INTEGER NOT NULL,
      level_name TEXT NOT NULL,
      level_type TEXT NOT NULL DEFAULT 'normal',
      difficulty TEXT NOT NULL,
      topic TEXT,
      question_count INTEGER NOT NULL,
      unlock_requirement TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(exam_id, subject_id, level_number)
    );

    CREATE INDEX IF NOT EXISTS idx_user_quiz_levels_user ON user_quiz_levels(user_id, exam_id, subject_id);
    CREATE INDEX IF NOT EXISTS idx_user_english_levels_user ON user_english_levels(user_id, path_id);
    CREATE INDEX IF NOT EXISTS idx_level_definitions_exam ON level_definitions(exam_id, subject_id);

    CREATE TABLE IF NOT EXISTS level_question_cache (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      exam_id TEXT NOT NULL,
      subject_id TEXT NOT NULL,
      level_number INTEGER NOT NULL,
      questions_json TEXT NOT NULL,
      is_passed INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, exam_id, subject_id, level_number)
    );

    CREATE INDEX IF NOT EXISTS idx_level_question_cache_user ON level_question_cache(user_id, exam_id, subject_id, level_number);
  `);

  // Create a default user if none exists
  const result = await db.execute("SELECT COUNT(*) as count FROM users");
  const count = result.rows[0].count as number;
  if (count === 0) {
    await db.execute({
      sql: "INSERT INTO users (id, name) VALUES (?, ?)",
      args: ["default-user", "Student"],
    });
  }
}

// Helper: get a single row
async function queryOne(sql: string, args: any[] = []): Promise<any | undefined> {
  await ensureInitialized();
  const result = await getClient().execute({ sql, args });
  if (result.rows.length === 0) return undefined;
  // Convert Row proxy to plain object
  const row = result.rows[0];
  const obj: any = {};
  for (const col of result.columns) {
    obj[col] = row[col];
  }
  return obj;
}

// Helper: get multiple rows
async function queryAll(sql: string, args: any[] = []): Promise<any[]> {
  await ensureInitialized();
  const result = await getClient().execute({ sql, args });
  return result.rows.map((row) => {
    const obj: any = {};
    for (const col of result.columns) {
      obj[col] = row[col];
    }
    return obj;
  });
}

// Helper: execute a write operation
async function execute(sql: string, args: any[] = []) {
  await ensureInitialized();
  return getClient().execute({ sql, args });
}

// ─── User functions ──────────────────────────────────────

export async function getUser(userId: string = "default-user") {
  return queryOne("SELECT * FROM users WHERE id = ?", [userId]);
}

export async function updateUserName(userId: string, name: string) {
  return execute("UPDATE users SET name = ? WHERE id = ?", [name, userId]);
}

export async function createNewUser(
  id: string,
  name: string,
  email: string = "",
  age: number | null = null,
  location: string = "",
  phoneNumber: string = "",
  examPreparingFor: string = "",
  avatarColor: string = "#6366f1"
) {
  return execute(
    "INSERT INTO users (id, name, email, age, location, phone_number, exam_preparing_for, avatar_color) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [id, name, email, age, location, phoneNumber, examPreparingFor, avatarColor]
  );
}

export async function listUsers() {
  return queryAll(
    "SELECT id, name, email, avatar_color, created_at FROM users ORDER BY created_at DESC"
  );
}

export async function updateUserProfile(
  userId: string,
  name: string,
  email: string,
  age?: number | null,
  location?: string,
  phoneNumber?: string,
  examPreparingFor?: string
) {
  const updates: string[] = ["name = ?", "email = ?"];
  const values: any[] = [name, email];

  if (age !== undefined) {
    updates.push("age = ?");
    values.push(age);
  }
  if (location !== undefined) {
    updates.push("location = ?");
    values.push(location);
  }
  if (phoneNumber !== undefined) {
    updates.push("phone_number = ?");
    values.push(phoneNumber);
  }
  if (examPreparingFor !== undefined) {
    updates.push("exam_preparing_for = ?");
    values.push(examPreparingFor);
  }

  values.push(userId);

  return execute(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`, values);
}

export async function getUserByEmail(email: string) {
  return queryOne("SELECT * FROM users WHERE email = ?", [email.toLowerCase().trim()]);
}

// ─── OTP functions ──────────────────────────────────────

export async function saveOtp(email: string, code: string, expiresMinutes: number = 10) {
  const expiresAt = new Date(Date.now() + expiresMinutes * 60 * 1000).toISOString();
  const normalizedEmail = email.toLowerCase().trim();
  await execute("DELETE FROM otp_codes WHERE email = ?", [normalizedEmail]);
  await execute(
    "INSERT INTO otp_codes (email, code, expires_at) VALUES (?, ?, ?)",
    [normalizedEmail, code, expiresAt]
  );
}

export async function verifyOtp(email: string, code: string): Promise<boolean> {
  const normalizedEmail = email.toLowerCase().trim();
  const otp = await queryOne(
    "SELECT * FROM otp_codes WHERE email = ? AND code = ? AND verified = 0",
    [normalizedEmail, code]
  );

  if (!otp) return false;

  if (new Date(otp.expires_at) < new Date()) {
    await execute("DELETE FROM otp_codes WHERE id = ?", [otp.id]);
    return false;
  }

  await execute("UPDATE otp_codes SET verified = 1 WHERE id = ?", [otp.id]);
  return true;
}

export async function isOtpVerified(email: string): Promise<boolean> {
  const normalizedEmail = email.toLowerCase().trim();
  const otp = await queryOne(
    "SELECT * FROM otp_codes WHERE email = ? AND verified = 1 ORDER BY created_at DESC LIMIT 1",
    [normalizedEmail]
  );

  if (!otp) return false;

  const expiresAt = new Date(otp.expires_at);
  return expiresAt > new Date();
}

export async function cleanupOtps() {
  await execute("DELETE FROM otp_codes WHERE expires_at < ?", [new Date().toISOString()]);
}

// ─── Quiz Session functions ──────────────────────────────

export async function createQuizSession(
  sessionId: string,
  userId: string,
  examId: string,
  subjectId: string,
  topic: string,
  totalQuestions: number,
  correctAnswers: number,
  timeTaken: number
) {
  return execute(
    `INSERT INTO quiz_sessions (id, user_id, exam_id, subject_id, topic, total_questions, correct_answers, time_taken_seconds)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [sessionId, userId, examId, subjectId, topic, totalQuestions, correctAnswers, timeTaken]
  );
}

export async function getRecentSessions(userId: string, limit: number = 10) {
  return queryAll(
    "SELECT * FROM quiz_sessions WHERE user_id = ? ORDER BY created_at DESC LIMIT ?",
    [userId, limit]
  );
}

export async function getSessionsByExam(userId: string, examId: string) {
  return queryAll(
    "SELECT * FROM quiz_sessions WHERE user_id = ? AND exam_id = ? ORDER BY created_at DESC",
    [userId, examId]
  );
}

// ─── Question Attempt functions ──────────────────────────

export async function saveQuestionAttempts(
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
    explanation: string | { logic: string; formula?: string | null; calculation?: string | null; trapAlerts: string[]; commonMistakes: string[]; };
  }>
) {
  const db = getClient();
  await ensureInitialized();

  // Use batch for transactional inserts
  const statements = attempts.map((item) => {
    // Serialize explanation to string for storage
    const explanationStr = typeof item.explanation === 'string'
      ? item.explanation
      : JSON.stringify(item.explanation);

    return {
      sql: `INSERT INTO question_attempts (session_id, user_id, exam_id, subject_id, topic, question_text, options, correct_answer, user_answer, is_correct, explanation)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
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
      explanationStr,
    ] as any[],
    };
  });

  await db.batch(statements, "write");
}

// ─── Topic Mastery functions ─────────────────────────────

export async function updateTopicMastery(
  userId: string,
  examId: string,
  subjectId: string,
  topic: string,
  attempted: number,
  correct: number
) {
  const existing = await queryOne(
    "SELECT * FROM topic_mastery WHERE user_id = ? AND exam_id = ? AND subject_id = ? AND topic = ?",
    [userId, examId, subjectId, topic]
  );

  if (existing) {
    const newTotal = (existing.total_attempted as number) + attempted;
    const newCorrect = (existing.total_correct as number) + correct;
    const mastery = newTotal > 0 ? (newCorrect / newTotal) * 100 : 0;

    const daysUntilReview = mastery >= 90 ? 7 : mastery >= 70 ? 3 : mastery >= 50 ? 1 : 0;
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + daysUntilReview);

    await execute(
      "UPDATE topic_mastery SET total_attempted = ?, total_correct = ?, mastery_score = ?, last_attempted = CURRENT_TIMESTAMP, next_review = ? WHERE id = ?",
      [newTotal, newCorrect, mastery, nextReview.toISOString(), existing.id]
    );
  } else {
    const mastery = attempted > 0 ? (correct / attempted) * 100 : 0;
    const daysUntilReview = mastery >= 90 ? 7 : mastery >= 70 ? 3 : mastery >= 50 ? 1 : 0;
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + daysUntilReview);

    await execute(
      `INSERT INTO topic_mastery (user_id, exam_id, subject_id, topic, total_attempted, total_correct, mastery_score, last_attempted, next_review)
       VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)`,
      [userId, examId, subjectId, topic, attempted, correct, mastery, nextReview.toISOString()]
    );
  }
}

export async function getTopicMastery(userId: string, examId: string) {
  return queryAll(
    "SELECT * FROM topic_mastery WHERE user_id = ? AND exam_id = ? ORDER BY mastery_score ASC",
    [userId, examId]
  );
}

export async function getAllMastery(userId: string) {
  return queryAll(
    "SELECT * FROM topic_mastery WHERE user_id = ? ORDER BY last_attempted DESC",
    [userId]
  );
}

export async function getWeakTopics(userId: string, examId: string, limit: number = 5) {
  return queryAll(
    "SELECT * FROM topic_mastery WHERE user_id = ? AND exam_id = ? AND total_attempted > 0 ORDER BY mastery_score ASC LIMIT ?",
    [userId, examId, limit]
  );
}

export async function getTopicsForReview(userId: string) {
  return queryAll(
    "SELECT * FROM topic_mastery WHERE user_id = ? AND next_review <= CURRENT_TIMESTAMP ORDER BY mastery_score ASC",
    [userId]
  );
}

// ─── Report functions ────────────────────────────────────

export async function saveReport(
  userId: string,
  examId: string,
  subjectId: string,
  topic: string,
  questionText: string,
  reportedIssue: string
) {
  return execute(
    `INSERT INTO reported_questions (user_id, exam_id, subject_id, topic, question_text, reported_issue)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, examId, subjectId, topic, questionText, reportedIssue]
  );
}

export async function getReports(status: string = "pending") {
  return queryAll(
    "SELECT * FROM reported_questions WHERE status = ? ORDER BY created_at DESC",
    [status]
  );
}

// ─── Question Cache functions ────────────────────────────

export async function getCachedQuestions(
  examId: string,
  subjectId: string,
  topic: string,
  difficulty: string = "mixed",
  limit: number = 10
) {
  let rows: any[];

  // If topic is empty, match all topics in the subject (for mock tests)
  if (!topic || topic.trim() === '') {
    if (difficulty === "mixed") {
      rows = await queryAll(
        "SELECT * FROM cached_questions WHERE exam_id = ? AND subject_id = ? ORDER BY used_count ASC, RANDOM() LIMIT ?",
        [examId, subjectId, limit]
      );
    } else {
      rows = await queryAll(
        "SELECT * FROM cached_questions WHERE exam_id = ? AND subject_id = ? AND difficulty = ? ORDER BY used_count ASC, RANDOM() LIMIT ?",
        [examId, subjectId, difficulty, limit]
      );
    }
  } else {
    // Topic-specific query with fuzzy matching
    if (difficulty === "mixed") {
      rows = await queryAll(
        "SELECT * FROM cached_questions WHERE exam_id = ? AND subject_id = ? AND (topic = ? OR topic LIKE ?) ORDER BY used_count ASC, RANDOM() LIMIT ?",
        [examId, subjectId, topic, `%${topic}%`, limit]
      );
    } else {
      rows = await queryAll(
        "SELECT * FROM cached_questions WHERE exam_id = ? AND subject_id = ? AND (topic = ? OR topic LIKE ?) AND difficulty = ? ORDER BY used_count ASC, RANDOM() LIMIT ?",
        [examId, subjectId, topic, `%${topic}%`, difficulty, limit]
      );
    }

    // If still no results, try fuzzy match on keywords
    if (rows.length === 0 && topic.length > 0) {
      const keywords = topic.toLowerCase().split(/[&\s]+/).filter(w => w.length > 3);
      for (const keyword of keywords) {
        if (rows.length >= limit) break;

        const fuzzyRows = await queryAll(
          difficulty === "mixed"
            ? "SELECT * FROM cached_questions WHERE exam_id = ? AND subject_id = ? AND topic LIKE ? ORDER BY used_count ASC, RANDOM() LIMIT ?"
            : "SELECT * FROM cached_questions WHERE exam_id = ? AND subject_id = ? AND topic LIKE ? AND difficulty = ? ORDER BY used_count ASC, RANDOM() LIMIT ?",
          difficulty === "mixed"
            ? [examId, subjectId, `%${keyword}%`, limit - rows.length]
            : [examId, subjectId, `%${keyword}%`, difficulty, limit - rows.length]
        );

        rows = [...rows, ...fuzzyRows];
      }
    }
  }

  return rows.map((row: any) => ({
    ...JSON.parse(row.question_json),
    _cacheId: row.id,
  }));
}

export async function saveCachedQuestions(
  examId: string,
  subjectId: string,
  topic: string,
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string | { logic: string; formula?: string | null; calculation?: string | null; trapAlerts: string[]; commonMistakes: string[]; };
    difficulty: string
  }>
) {
  await ensureInitialized();
  const db = getClient();

  // Check for duplicates by question text
  const existing = await queryAll(
    "SELECT question_json FROM cached_questions WHERE exam_id = ? AND subject_id = ? AND topic = ?",
    [examId, subjectId, topic]
  );
  const existingTexts = new Set(
    existing.map((r: any) => JSON.parse(r.question_json).question?.toLowerCase().trim())
  );

  const statements = [];
  let added = 0;
  for (const q of questions) {
    if (existingTexts.has(q.question?.toLowerCase().trim())) continue;
    statements.push({
      sql: "INSERT INTO cached_questions (exam_id, subject_id, topic, difficulty, question_json) VALUES (?, ?, ?, ?, ?)",
      args: [examId, subjectId, topic, q.difficulty || "medium", JSON.stringify(q)] as any[],
    });
    existingTexts.add(q.question?.toLowerCase().trim());
    added++;
  }

  if (statements.length > 0) {
    await db.batch(statements, "write");
  }

  return added;
}

export async function markCachedQuestionsUsed(cacheIds: number[]) {
  if (cacheIds.length === 0) return;
  await ensureInitialized();
  const db = getClient();

  const statements = cacheIds.map((id) => ({
    sql: "UPDATE cached_questions SET used_count = used_count + 1 WHERE id = ?",
    args: [id] as any[],
  }));

  await db.batch(statements, "write");
}

export async function getCachedQuestionCount(examId: string, subjectId: string, topic: string) {
  const result = await queryOne(
    "SELECT COUNT(*) as count FROM cached_questions WHERE exam_id = ? AND subject_id = ? AND topic = ?",
    [examId, subjectId, topic]
  );
  return (result?.count as number) || 0;
}

// ─── Stats functions ─────────────────────────────────────

export async function getUserStats(userId: string) {
  const totalSessions = await queryOne(
    "SELECT COUNT(*) as count FROM quiz_sessions WHERE user_id = ?",
    [userId]
  );

  const totalQuestions = await queryOne(
    "SELECT COALESCE(SUM(total_questions), 0) as total, COALESCE(SUM(correct_answers), 0) as correct FROM quiz_sessions WHERE user_id = ?",
    [userId]
  );

  const streakData = await queryAll(
    "SELECT DISTINCT DATE(created_at) as day FROM quiz_sessions WHERE user_id = ? ORDER BY day DESC",
    [userId]
  );

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

  const examBreakdown = await queryAll(
    `SELECT exam_id, COUNT(*) as sessions, SUM(total_questions) as questions, SUM(correct_answers) as correct
     FROM quiz_sessions WHERE user_id = ? GROUP BY exam_id`,
    [userId]
  );

  return {
    totalSessions: (totalSessions?.count as number) || 0,
    totalQuestions: (totalQuestions?.total as number) || 0,
    totalCorrect: (totalQuestions?.correct as number) || 0,
    accuracy:
      (totalQuestions?.total as number) > 0
        ? Math.round(((totalQuestions?.correct as number) / (totalQuestions?.total as number)) * 100)
        : 0,
    streak,
    examBreakdown,
  };
}

// ─── Review functions ───────────────────────────────────

export async function getReviewSummary(userId: string) {
  const now = new Date().toISOString();
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  const weekEnd = new Date();
  weekEnd.setDate(weekEnd.getDate() + 7);

  const overdue = await queryAll(
    "SELECT * FROM topic_mastery WHERE user_id = ? AND next_review < ? AND total_attempted > 0 ORDER BY mastery_score ASC",
    [userId, now]
  );

  const dueToday = await queryAll(
    "SELECT * FROM topic_mastery WHERE user_id = ? AND next_review >= ? AND next_review <= ? AND total_attempted > 0 ORDER BY mastery_score ASC",
    [userId, now, todayEnd.toISOString()]
  );

  const upcoming = await queryAll(
    "SELECT * FROM topic_mastery WHERE user_id = ? AND next_review > ? AND next_review <= ? AND total_attempted > 0 ORDER BY next_review ASC",
    [userId, todayEnd.toISOString(), weekEnd.toISOString()]
  );

  return { overdue, dueToday, upcoming };
}

// ─── Leaderboard functions ──────────────────────────────

export async function getPersonalBests(userId: string) {
  return queryAll(
    `SELECT exam_id,
            MAX(CAST(correct_answers AS REAL) / NULLIF(total_questions, 0) * 100) as best_accuracy,
            COUNT(*) as total_sessions,
            SUM(total_questions) as total_questions,
            SUM(correct_answers) as total_correct
     FROM quiz_sessions WHERE user_id = ? GROUP BY exam_id ORDER BY best_accuracy DESC`,
    [userId]
  );
}

export async function getLongestStreak(userId: string) {
  const streakData = await queryAll(
    "SELECT DISTINCT DATE(created_at) as day FROM quiz_sessions WHERE user_id = ? ORDER BY day ASC",
    [userId]
  );

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

export async function getMilestones(userId: string) {
  const stats = await getUserStats(userId);
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

export async function getLeaderboard() {
  return queryAll(
    `SELECT u.id, u.name, u.avatar_color,
            COUNT(qs.id) as total_sessions,
            COALESCE(SUM(qs.total_questions), 0) as total_questions,
            COALESCE(SUM(qs.correct_answers), 0) as total_correct,
            CASE WHEN SUM(qs.total_questions) > 0 THEN ROUND(CAST(SUM(qs.correct_answers) AS REAL) / SUM(qs.total_questions) * 100) ELSE 0 END as accuracy
     FROM users u LEFT JOIN quiz_sessions qs ON u.id = qs.user_id
     GROUP BY u.id HAVING total_sessions > 0
     ORDER BY total_questions DESC, accuracy DESC`
  );
}

// ─── Subscription functions ─────────────────────────────

export async function getUserSubscription(userId: string) {
  return queryOne(
    "SELECT * FROM subscriptions WHERE user_id = ? AND status = 'active'",
    [userId]
  );
}

export async function isProUser(userId: string): Promise<boolean> {
  const sub = await getUserSubscription(userId);
  if (!sub) return false;
  if (sub.plan === "free") return false;
  // Check if subscription has expired
  if (sub.expires_at && new Date(sub.expires_at) < new Date()) {
    await execute("UPDATE subscriptions SET status = 'expired' WHERE id = ?", [sub.id]);
    return false;
  }
  return true;
}

export async function getTodayQuizCount(userId: string): Promise<number> {
  const today = new Date().toISOString().split("T")[0];
  const result = await queryOne(
    "SELECT COUNT(*) as count FROM quiz_sessions WHERE user_id = ? AND DATE(created_at) = ?",
    [userId, today]
  );
  return (result?.count as number) || 0;
}

export async function createSubscription(
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
    expiresAt = new Date(now);
    expiresAt.setMonth(expiresAt.getMonth() + 3);
  }

  const existing = await queryOne(
    "SELECT * FROM subscriptions WHERE user_id = ?",
    [userId]
  );

  if (existing) {
    await execute(
      "UPDATE subscriptions SET plan = ?, amount = ?, razorpay_payment_id = ?, razorpay_order_id = ?, status = 'active', started_at = ?, expires_at = ? WHERE user_id = ?",
      [plan, amount, razorpayPaymentId, razorpayOrderId, now.toISOString(), expiresAt.toISOString(), userId]
    );
  } else {
    await execute(
      "INSERT INTO subscriptions (user_id, plan, amount, razorpay_payment_id, razorpay_order_id, status, started_at, expires_at) VALUES (?, ?, ?, ?, ?, 'active', ?, ?)",
      [userId, plan, amount, razorpayPaymentId, razorpayOrderId, now.toISOString(), expiresAt.toISOString()]
    );
  }

  // Record payment history
  await execute(
    "INSERT INTO payment_history (user_id, razorpay_payment_id, razorpay_order_id, plan, amount) VALUES (?, ?, ?, ?, ?)",
    [userId, razorpayPaymentId, razorpayOrderId, plan, amount]
  );
}

export async function getPaymentHistory(userId: string) {
  return queryAll(
    "SELECT * FROM payment_history WHERE user_id = ? ORDER BY created_at DESC",
    [userId]
  );
}

// ─── Mock Test functions ────────────────────────────────

export async function createMockTest(
  id: string,
  userId: string,
  examId: string,
  totalQuestions: number,
  timeLimitSeconds: number,
  questionsJson: string
) {
  return execute(
    "INSERT INTO mock_tests (id, user_id, exam_id, total_questions, time_limit_seconds, questions_json) VALUES (?, ?, ?, ?, ?, ?)",
    [id, userId, examId, totalQuestions, timeLimitSeconds, questionsJson]
  );
}

export async function getMockTest(id: string, userId: string) {
  return queryOne(
    "SELECT * FROM mock_tests WHERE id = ? AND user_id = ?",
    [id, userId]
  );
}

export async function completeMockTest(
  id: string,
  userId: string,
  correctAnswers: number,
  timeTakenSeconds: number,
  answersJson: string
) {
  return execute(
    "UPDATE mock_tests SET correct_answers = ?, time_taken_seconds = ?, answers_json = ?, status = 'completed', completed_at = ? WHERE id = ? AND user_id = ?",
    [correctAnswers, timeTakenSeconds, answersJson, new Date().toISOString(), id, userId]
  );
}

export async function getUserMockTests(userId: string) {
  return queryAll(
    "SELECT id, exam_id, total_questions, correct_answers, time_limit_seconds, time_taken_seconds, status, started_at, completed_at FROM mock_tests WHERE user_id = ? ORDER BY started_at DESC",
    [userId]
  );
}

export async function getInProgressMockTest(userId: string) {
  return queryOne(
    "SELECT * FROM mock_tests WHERE user_id = ? AND status = 'in_progress' ORDER BY started_at DESC LIMIT 1",
    [userId]
  );
}

// ─── Performance Report functions ───────────────────────

export async function getDetailedPerformance(userId: string) {
  const subjectBreakdown = await queryAll(
    `SELECT exam_id, subject_id,
            COUNT(*) as total_sessions,
            SUM(total_questions) as total_questions,
            SUM(correct_answers) as total_correct,
            AVG(time_taken_seconds) as avg_time,
            ROUND(CAST(SUM(correct_answers) AS REAL) / NULLIF(SUM(total_questions), 0) * 100) as accuracy
     FROM quiz_sessions WHERE user_id = ? GROUP BY exam_id, subject_id ORDER BY accuracy ASC`,
    [userId]
  );

  const dailyActivity = await queryAll(
    `SELECT DATE(created_at) as day,
            COUNT(*) as sessions,
            SUM(total_questions) as questions,
            SUM(correct_answers) as correct
     FROM quiz_sessions WHERE user_id = ? AND created_at >= DATE('now', '-30 days')
     GROUP BY DATE(created_at) ORDER BY day ASC`,
    [userId]
  );

  const difficultyBreakdown = await queryAll(
    `SELECT
       CASE
         WHEN CAST(correct_answers AS REAL) / NULLIF(total_questions, 0) >= 0.8 THEN 'excellent'
         WHEN CAST(correct_answers AS REAL) / NULLIF(total_questions, 0) >= 0.6 THEN 'good'
         WHEN CAST(correct_answers AS REAL) / NULLIF(total_questions, 0) >= 0.4 THEN 'average'
         ELSE 'needs_work'
       END as performance_band,
       COUNT(*) as count
     FROM quiz_sessions WHERE user_id = ? GROUP BY performance_band`,
    [userId]
  );

  const timeTrend = await queryAll(
    `SELECT ROUND(CAST(time_taken_seconds AS REAL) / NULLIF(total_questions, 0), 1) as avg_seconds_per_question,
            ROUND(CAST(correct_answers AS REAL) / NULLIF(total_questions, 0) * 100) as accuracy,
            DATE(created_at) as day
     FROM quiz_sessions WHERE user_id = ? AND time_taken_seconds > 0 ORDER BY created_at DESC LIMIT 20`,
    [userId]
  );

  const accuracyTrend = await queryAll(
    `SELECT ROUND(CAST(correct_answers AS REAL) / NULLIF(total_questions, 0) * 100) as accuracy,
            topic, exam_id, DATE(created_at) as day
     FROM quiz_sessions WHERE user_id = ? ORDER BY created_at DESC LIMIT 20`,
    [userId]
  );

  const topicPerformance = await queryAll(
    `SELECT exam_id, subject_id, topic, total_attempted, total_correct, mastery_score
     FROM topic_mastery WHERE user_id = ? AND total_attempted >= 3 ORDER BY mastery_score DESC`,
    [userId]
  );

  const mockTestHistory = await queryAll(
    `SELECT id, exam_id, total_questions, correct_answers, time_limit_seconds, time_taken_seconds, status, completed_at
     FROM mock_tests WHERE user_id = ? AND status = 'completed' ORDER BY completed_at DESC LIMIT 10`,
    [userId]
  );

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

// ─── Weakness Profile functions ──────────────────────────

export async function recordWeaknessType(
  userId: string,
  examId: string,
  subjectId: string,
  topic: string,
  weaknessType: 'calculation' | 'concept' | 'time' | 'careless'
) {
  await ensureInitialized();
  const db = getClient();

  const columnMap = {
    calculation: 'calculation_errors',
    concept: 'concept_errors',
    time: 'time_errors',
    careless: 'careless_errors'
  };

  const column = columnMap[weaknessType];

  await db.execute({
    sql: `INSERT INTO weakness_profiles (user_id, exam_id, subject_id, topic, ${column}, total_errors, last_updated)
          VALUES (?, ?, ?, ?, 1, 1, CURRENT_TIMESTAMP)
          ON CONFLICT(user_id, exam_id, subject_id, topic) DO UPDATE SET
            ${column} = ${column} + 1,
            total_errors = total_errors + 1,
            last_updated = CURRENT_TIMESTAMP`,
    args: [userId, examId, subjectId, topic]
  });
}

export async function getWeaknessProfile(userId: string, examId: string) {
  await ensureInitialized();

  const rows = await queryAll(
    `SELECT
      exam_id,
      subject_id,
      topic,
      calculation_errors,
      concept_errors,
      time_errors,
      careless_errors,
      total_errors,
      last_updated
    FROM weakness_profiles
    WHERE user_id = ? AND exam_id = ?
    ORDER BY total_errors DESC
    LIMIT 10`,
    [userId, examId]
  );

  return rows;
}

export async function getWeaknessSummary(userId: string) {
  await ensureInitialized();

  const result = await queryOne(
    `SELECT
      SUM(calculation_errors) as calculation,
      SUM(concept_errors) as concept,
      SUM(time_errors) as time,
      SUM(careless_errors) as careless,
      SUM(total_errors) as total
    FROM weakness_profiles
    WHERE user_id = ?`,
    [userId]
  );

  return result || {
    calculation: 0,
    concept: 0,
    time: 0,
    careless: 0,
    total: 0
  };
}

// ─── English Learning functions ──────────────────────────

export async function getEnglishProgress(userId: string, pathId: string) {
  return queryAll(
    "SELECT * FROM english_progress WHERE user_id = ? AND path_id = ? ORDER BY last_practiced DESC",
    [userId, pathId]
  );
}

export async function getEnglishTopicProgress(userId: string, pathId: string, topicId: string) {
  return queryOne(
    "SELECT * FROM english_progress WHERE user_id = ? AND path_id = ? AND topic_id = ?",
    [userId, pathId, topicId]
  );
}

export async function updateEnglishProgress(
  userId: string,
  pathId: string,
  topicId: string,
  level: string,
  questionsCompleted: number,
  correctAnswers: number,
  timeTakenSeconds: number
) {
  const existing = await queryOne(
    "SELECT * FROM english_progress WHERE user_id = ? AND path_id = ? AND topic_id = ?",
    [userId, pathId, topicId]
  );

  if (existing) {
    const newTotal = (existing.completed_questions as number) + questionsCompleted;
    const newCorrect = (existing.correct_answers as number) + correctAnswers;
    const newTime = (existing.total_time_seconds as number) + timeTakenSeconds;
    const mastery = newTotal > 0 ? (newCorrect / newTotal) * 100 : 0;

    await execute(
      "UPDATE english_progress SET completed_questions = ?, correct_answers = ?, total_time_seconds = ?, mastery_score = ?, last_practiced = CURRENT_TIMESTAMP WHERE id = ?",
      [newTotal, newCorrect, newTime, mastery, existing.id]
    );
  } else {
    const mastery = questionsCompleted > 0 ? (correctAnswers / questionsCompleted) * 100 : 0;
    await execute(
      "INSERT INTO english_progress (user_id, path_id, topic_id, level, completed_questions, correct_answers, total_time_seconds, mastery_score, last_practiced) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)",
      [userId, pathId, topicId, level, questionsCompleted, correctAnswers, timeTakenSeconds, mastery]
    );
  }
}

export async function getExamQuestions(
  examId: string,
  subjectId: string,
  topic: string,
  difficulty: string = "mixed",
  limit: number = 10
) {
  let rows: any[];

  if (difficulty === "mixed") {
    rows = await queryAll(
      "SELECT * FROM exam_questions WHERE exam_id = ? AND subject_id = ? AND topic = ? ORDER BY RANDOM() LIMIT ?",
      [examId, subjectId, topic, limit]
    );
  } else {
    rows = await queryAll(
      "SELECT * FROM exam_questions WHERE exam_id = ? AND subject_id = ? AND topic = ? AND difficulty = ? ORDER BY RANDOM() LIMIT ?",
      [examId, subjectId, topic, difficulty, limit]
    );
  }

  return rows.map((row: any) => ({
    question: row.question,
    options: typeof row.options === 'string' ? JSON.parse(row.options) : row.options,
    correctAnswer: row.correct_answer,
    explanation: row.explanation,
    difficulty: row.difficulty,
    source: 'verified' as const,
  }));
}

export async function getEnglishQuestions(pathId: string, topicId: string, level: string, limit: number = 10) {
  const rows = await queryAll(
    "SELECT * FROM english_questions WHERE path_id = ? AND topic_id = ? AND level = ? ORDER BY RANDOM() LIMIT ?",
    [pathId, topicId, level, limit]
  );

  // Parse JSON fields and convert to camelCase for frontend
  return rows.map((row: any) => ({
    id: row.id,
    question: row.question,
    options: typeof row.options === 'string' ? JSON.parse(row.options) : row.options,
    correctAnswer: row.correct_answer, // Convert snake_case to camelCase
    explanation: row.explanation,
    difficulty: row.difficulty,
    level: row.level,
  }));
}

export async function saveEnglishQuestions(
  questions: Array<{
    pathId: string;
    topicId: string;
    level: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    difficulty: string;
  }>
) {
  await ensureInitialized();
  const db = getClient();

  const statements = questions.map((q) => ({
    sql: "INSERT INTO english_questions (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    args: [q.pathId, q.topicId, q.level, q.question, JSON.stringify(q.options), q.correctAnswer, q.explanation, q.difficulty] as any[],
  }));

  await db.batch(statements, "write");
}

export async function getEnglishDailyStreak(userId: string) {
  const rows = await queryAll(
    "SELECT date, questions_completed, correct_answers, streak_days FROM english_daily_practice WHERE user_id = ? ORDER BY date DESC LIMIT 30",
    [userId]
  );
  return rows;
}

export async function updateEnglishDailyPractice(
  userId: string,
  questionsCompleted: number,
  correctAnswers: number
) {
  const today = new Date().toISOString().split("T")[0];
  const existing = await queryOne(
    "SELECT * FROM english_daily_practice WHERE user_id = ? AND date = ?",
    [userId, today]
  );

  // Calculate streak
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const yesterdayRecord = await queryOne(
    "SELECT streak_days FROM english_daily_practice WHERE user_id = ? AND date = ?",
    [userId, yesterday]
  );

  const streakDays = existing
    ? existing.streak_days
    : yesterdayRecord
    ? (yesterdayRecord.streak_days as number) + 1
    : 1;

  if (existing) {
    await execute(
      "UPDATE english_daily_practice SET questions_completed = questions_completed + ?, correct_answers = correct_answers + ?, streak_days = ? WHERE id = ?",
      [questionsCompleted, correctAnswers, streakDays, existing.id]
    );
  } else {
    await execute(
      "INSERT INTO english_daily_practice (user_id, date, questions_completed, correct_answers, streak_days) VALUES (?, ?, ?, ?, ?)",
      [userId, today, questionsCompleted, correctAnswers, streakDays]
    );
  }

  return streakDays;
}

// ─── Level System functions ──────────────────────────────

export async function getUserQuizLevel(userId: string, examId: string, subjectId: string, levelNumber: number) {
  return queryOne(
    "SELECT * FROM user_quiz_levels WHERE user_id = ? AND exam_id = ? AND subject_id = ? AND level_number = ?",
    [userId, examId, subjectId, levelNumber]
  );
}

export async function getUserQuizLevels(userId: string, examId: string, subjectId: string) {
  return queryAll(
    "SELECT * FROM user_quiz_levels WHERE user_id = ? AND exam_id = ? AND subject_id = ? ORDER BY level_number ASC",
    [userId, examId, subjectId]
  );
}

export async function initializeFirstLevel(userId: string, examId: string, subjectId: string) {
  const { randomUUID } = await import('crypto');

  // Check if level 1 exists
  const level1 = await getUserQuizLevel(userId, examId, subjectId, 1);

  if (!level1) {
    // Initialize level 1 as unlocked
    await execute(
      "INSERT INTO user_quiz_levels (id, user_id, exam_id, subject_id, level_number, level_type, is_unlocked) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [randomUUID(), userId, examId, subjectId, 1, 'normal', 1]
    );
  }
}

export async function completeQuizLevel(
  userId: string,
  examId: string,
  subjectId: string,
  levelNumber: number,
  levelType: string,
  accuracy: number,
  stars: number
) {
  const { randomUUID } = await import('crypto');

  const existing = await getUserQuizLevel(userId, examId, subjectId, levelNumber);

  if (existing) {
    // Update if better performance
    if (accuracy > (existing.best_accuracy as number)) {
      await execute(
        "UPDATE user_quiz_levels SET is_completed = 1, stars_earned = ?, best_accuracy = ?, attempts = attempts + 1, completed_at = CURRENT_TIMESTAMP WHERE id = ?",
        [stars, accuracy, existing.id]
      );
    } else {
      await execute(
        "UPDATE user_quiz_levels SET attempts = attempts + 1 WHERE id = ?",
        [existing.id]
      );
    }
  } else {
    // Create new
    await execute(
      "INSERT INTO user_quiz_levels (id, user_id, exam_id, subject_id, level_number, level_type, is_unlocked, is_completed, stars_earned, best_accuracy, attempts, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)",
      [randomUUID(), userId, examId, subjectId, levelNumber, levelType, 1, 1, stars, accuracy, 1]
    );
  }

  // Unlock next level if performance is good enough
  const shouldUnlock = levelType === 'boss' ? accuracy >= 70 : accuracy >= 60;

  if (shouldUnlock) {
    const nextLevel = await getUserQuizLevel(userId, examId, subjectId, levelNumber + 1);

    if (!nextLevel) {
      // Get next level type from level_definitions or assume normal
      const nextLevelType = (levelNumber + 1) % 10 === 0 ? 'boss' : 'normal';

      await execute(
        "INSERT INTO user_quiz_levels (id, user_id, exam_id, subject_id, level_number, level_type, is_unlocked) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [randomUUID(), userId, examId, subjectId, levelNumber + 1, nextLevelType, 1]
      );
    }
  }
}

export async function getQuizLevelProgress(userId: string, examId: string, subjectId: string) {
  const levels = await getUserQuizLevels(userId, examId, subjectId);

  const totalStars = levels.reduce((sum: number, l: any) => sum + (l.stars_earned || 0), 0);
  const completedLevels = levels.filter((l: any) => l.is_completed).length;
  const currentLevel = levels.find((l: any) => l.is_unlocked && !l.is_completed);

  return {
    levels,
    totalStars,
    completedLevels,
    currentLevel: currentLevel ? currentLevel.level_number : completedLevels + 1,
  };
}

// English Level System functions

export async function getUserEnglishLevel(userId: string, pathId: string, topicId: string) {
  return queryOne(
    "SELECT * FROM user_english_levels WHERE user_id = ? AND path_id = ? AND topic_id = ?",
    [userId, pathId, topicId]
  );
}

export async function getUserEnglishLevels(userId: string, pathId: string) {
  return queryAll(
    "SELECT * FROM user_english_levels WHERE user_id = ? AND path_id = ? ORDER BY level_number ASC",
    [userId, pathId]
  );
}

export async function initializeFirstEnglishLevel(userId: string, pathId: string, firstTopicId: string) {
  const { randomUUID } = await import('crypto');

  const level1 = await getUserEnglishLevel(userId, pathId, firstTopicId);

  if (!level1) {
    await execute(
      "INSERT INTO user_english_levels (id, user_id, path_id, topic_id, level_number, is_unlocked) VALUES (?, ?, ?, ?, ?, ?)",
      [randomUUID(), userId, pathId, firstTopicId, 1, 1]
    );
  }
}

export async function completeEnglishLevel(
  userId: string,
  pathId: string,
  topicId: string,
  levelNumber: number,
  isPractice: boolean,
  accuracy: number,
  stars: number,
  nextTopicId?: string
) {
  const { randomUUID } = await import('crypto');

  const existing = await getUserEnglishLevel(userId, pathId, topicId);

  if (existing) {
    if (isPractice) {
      await execute(
        "UPDATE user_english_levels SET practice_completed = 1, attempts = attempts + 1 WHERE id = ?",
        [existing.id]
      );
    } else {
      // Test completion
      if (accuracy > (existing.best_accuracy as number)) {
        await execute(
          "UPDATE user_english_levels SET test_completed = 1, stars_earned = ?, best_accuracy = ?, attempts = attempts + 1, completed_at = CURRENT_TIMESTAMP WHERE id = ?",
          [stars, accuracy, existing.id]
        );
      } else {
        await execute(
          "UPDATE user_english_levels SET attempts = attempts + 1 WHERE id = ?",
          [existing.id]
        );
      }

      // Unlock next topic if stars >= 1 and nextTopicId exists
      if (stars >= 1 && nextTopicId) {
        const nextLevel = await getUserEnglishLevel(userId, pathId, nextTopicId);

        if (!nextLevel) {
          await execute(
            "INSERT INTO user_english_levels (id, user_id, path_id, topic_id, level_number, is_unlocked) VALUES (?, ?, ?, ?, ?, ?)",
            [randomUUID(), userId, pathId, nextTopicId, levelNumber + 1, 1]
          );
        }
      }
    }
  } else {
    // Create new
    await execute(
      "INSERT INTO user_english_levels (id, user_id, path_id, topic_id, level_number, is_unlocked, practice_completed, test_completed, stars_earned, best_accuracy, attempts, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)",
      [randomUUID(), userId, pathId, topicId, levelNumber, 1, isPractice ? 1 : 0, isPractice ? 0 : 1, stars, accuracy, 1]
    );
  }
}

export async function getEnglishLevelProgress(userId: string, pathId: string) {
  const levels = await getUserEnglishLevels(userId, pathId);

  const totalStars = levels.reduce((sum: number, l: any) => sum + (l.stars_earned || 0), 0);
  const completedLevels = levels.filter((l: any) => l.test_completed).length;
  const currentLevel = levels.find((l: any) => l.is_unlocked && !l.test_completed);

  return {
    levels,
    totalStars,
    completedLevels,
    currentLevel: currentLevel ? currentLevel.level_number : completedLevels + 1,
  };
}

// ─── Level Question Cache functions (for retry consistency) ──────

export async function getLevelQuestionCache(
  userId: string,
  examId: string,
  subjectId: string,
  levelNumber: number
) {
  const cached = await queryOne(
    "SELECT * FROM level_question_cache WHERE user_id = ? AND exam_id = ? AND subject_id = ? AND level_number = ?",
    [userId, examId, subjectId, levelNumber]
  );

  if (cached) {
    return {
      questions: JSON.parse(cached.questions_json),
      isPassed: cached.is_passed === 1,
    };
  }

  return null;
}

export async function saveLevelQuestionCache(
  userId: string,
  examId: string,
  subjectId: string,
  levelNumber: number,
  questions: any[]
) {
  await ensureInitialized();

  // Check if already exists
  const existing = await queryOne(
    "SELECT id FROM level_question_cache WHERE user_id = ? AND exam_id = ? AND subject_id = ? AND level_number = ?",
    [userId, examId, subjectId, levelNumber]
  );

  const questionsJson = JSON.stringify(questions);

  if (existing) {
    // Update existing cache (keep same questions)
    await execute(
      "UPDATE level_question_cache SET questions_json = ? WHERE id = ?",
      [questionsJson, existing.id]
    );
  } else {
    // Create new cache
    await execute(
      "INSERT INTO level_question_cache (user_id, exam_id, subject_id, level_number, questions_json, is_passed) VALUES (?, ?, ?, ?, ?, 0)",
      [userId, examId, subjectId, levelNumber, questionsJson]
    );
  }
}

export async function markLevelPassed(
  userId: string,
  examId: string,
  subjectId: string,
  levelNumber: number
) {
  await ensureInitialized();

  await execute(
    "UPDATE level_question_cache SET is_passed = 1 WHERE user_id = ? AND exam_id = ? AND subject_id = ? AND level_number = ?",
    [userId, examId, subjectId, levelNumber]
  );
}

export async function clearLevelQuestionCache(
  userId: string,
  examId: string,
  subjectId: string,
  levelNumber: number
) {
  await ensureInitialized();

  await execute(
    "DELETE FROM level_question_cache WHERE user_id = ? AND exam_id = ? AND subject_id = ? AND level_number = ?",
    [userId, examId, subjectId, levelNumber]
  );
}
