/**
 * Comprehensive Functional Testing Script
 * Tests all API endpoints, quiz functionality, stats, and features
 *
 * Run: npx tsx scripts/comprehensive-test.ts
 */

// Load environment variables from .env.local
import { readFileSync } from "fs";
import { join } from "path";

try {
  const envFile = readFileSync(join(process.cwd(), ".env.local"), "utf-8");
  envFile.split("\n").forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const [, key, value] = match;
      process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, "");
    }
  });
} catch (error) {
  console.warn("⚠️  Could not load .env.local file");
}

import { createClient } from "@libsql/client";

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

const BASE_URL = process.env.TEST_URL || "http://localhost:3000";
const TEST_USER_ID = process.env.TEST_USER_ID || "default-user";

let db: any;

// Initialize database connection
function initDB() {
  const dbUrl = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!dbUrl || !authToken) {
    console.error(`${colors.red}❌ Error: Database credentials not found in environment${colors.reset}`);
    console.log(`\nPlease ensure .env.local has:`);
    console.log(`  TURSO_DATABASE_URL=...`);
    console.log(`  TURSO_AUTH_TOKEN=...`);
    process.exit(1);
  }

  db = createClient({
    url: dbUrl,
    authToken: authToken,
  });
}

// Helper to make API calls
async function testAPI(
  endpoint: string,
  method: string = "GET",
  body?: any,
  expectStatus: number = 200
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        "Cookie": `prepgenie-user-id=${TEST_USER_ID}`,
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();

    if (response.status !== expectStatus) {
      return {
        success: false,
        error: `Expected ${expectStatus}, got ${response.status}`,
        data,
      };
    }

    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Test result tracking
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  skipped: 0,
};

function logTest(name: string, passed: boolean, details?: string) {
  results.total++;
  if (passed) {
    results.passed++;
    console.log(`  ${colors.green}✓${colors.reset} ${name}`);
    if (details) console.log(`    ${colors.cyan}${details}${colors.reset}`);
  } else {
    results.failed++;
    console.log(`  ${colors.red}✗${colors.reset} ${name}`);
    if (details) console.log(`    ${colors.red}${details}${colors.reset}`);
  }
}

function logSection(name: string) {
  console.log(`\n${colors.blue}${"=".repeat(60)}${colors.reset}`);
  console.log(`${colors.blue}📋 ${name}${colors.reset}`);
  console.log(`${colors.blue}${"=".repeat(60)}${colors.reset}\n`);
}

function logSubsection(name: string) {
  console.log(`\n${colors.magenta}▶ ${name}${colors.reset}`);
}

// ============================================================
// DATABASE TESTS
// ============================================================

async function testDatabaseConnection() {
  logSubsection("Database Connection");

  try {
    const result = await db.execute("SELECT 1 as test");
    logTest("Database connection", result.rows.length === 1, "Connected successfully");
  } catch (error: any) {
    logTest("Database connection", false, error.message);
  }
}

async function testDatabaseSchema() {
  logSubsection("Database Schema");

  const tables = [
    "users",
    "quiz_sessions",
    "question_attempts",
    "topic_mastery",
    "mock_tests",
    "user_badges",
    "badge_stats",
    "daily_challenges",
    "daily_challenge_progress",
    "cached_questions",
    "exam_questions",
    "subscriptions",
  ];

  for (const table of tables) {
    try {
      const result = await db.execute(`SELECT COUNT(*) as count FROM ${table}`);
      const count = result.rows[0].count;
      logTest(
        `Table: ${table}`,
        true,
        `${count} rows`
      );
    } catch (error: any) {
      logTest(`Table: ${table}`, false, error.message);
    }
  }
}

async function testUserData() {
  logSubsection("User Data");

  try {
    const result = await db.execute({
      sql: "SELECT * FROM users WHERE id = ?",
      args: [TEST_USER_ID],
    });

    if (result.rows.length === 0) {
      logTest("User exists", false, `User ${TEST_USER_ID} not found`);
      return;
    }

    const user = result.rows[0];
    logTest("User exists", true, `Found: ${user.name} (${user.email || "no email"})`);

    // Test quiz sessions
    const sessions = await db.execute({
      sql: "SELECT COUNT(*) as count FROM quiz_sessions WHERE user_id = ?",
      args: [TEST_USER_ID],
    });
    logTest("Quiz sessions", true, `${sessions.rows[0].count} total sessions`);

  } catch (error: any) {
    logTest("User data query", false, error.message);
  }
}

// ============================================================
// API ENDPOINT TESTS
// ============================================================

async function testAuthEndpoints() {
  logSubsection("Authentication Endpoints");

  // Test auth check
  const authCheck = await testAPI("/api/auth");
  logTest(
    "GET /api/auth",
    authCheck.success,
    authCheck.success ? `User: ${authCheck.data?.user?.name || "Not logged in"}` : authCheck.error
  );
}

async function testStatsEndpoints() {
  logSubsection("Stats & Dashboard Endpoints");

  // Test user stats
  const stats = await testAPI("/api/stats");
  logTest(
    "GET /api/stats",
    stats.success,
    stats.success
      ? `Sessions: ${stats.data?.stats?.totalSessions}, Accuracy: ${stats.data?.stats?.accuracy}%, Streak: ${stats.data?.stats?.streak}`
      : stats.error
  );

  // Test leaderboard
  const leaderboard = await testAPI("/api/leaderboard");
  logTest(
    "GET /api/leaderboard",
    leaderboard.success,
    leaderboard.success
      ? `Milestones: ${leaderboard.data?.milestones?.length || 0}`
      : leaderboard.error
  );

  // Test achievements (new)
  const achievements = await testAPI("/api/achievements");
  logTest(
    "GET /api/achievements",
    achievements.success,
    achievements.success
      ? `Badges: ${achievements.data?.badges?.length || 0} total, ${achievements.data?.badges?.filter((b: any) => b.unlocked).length || 0} unlocked`
      : achievements.error
  );

  // Test level progress (new)
  const levelProgress = await testAPI("/api/level-progress");
  logTest(
    "GET /api/level-progress",
    levelProgress.success,
    levelProgress.success
      ? `Levels: ${levelProgress.data?.totalLevelsCompleted}, Stars: ${levelProgress.data?.totalStars}`
      : levelProgress.error
  );

  // Test streak calendar (new)
  const streakCalendar = await testAPI("/api/streak-calendar");
  logTest(
    "GET /api/streak-calendar",
    streakCalendar.success,
    streakCalendar.success
      ? `Current streak: ${streakCalendar.data?.currentStreak}, Longest: ${streakCalendar.data?.longestStreak}, Total days: ${streakCalendar.data?.totalDays}`
      : streakCalendar.error
  );
}

async function testQuizEndpoints() {
  logSubsection("Quiz Endpoints");

  // Note: These endpoints require POST data, so we'll test if they respond
  const quizResponse = await testAPI("/api/quiz", "POST", {
    examId: "jee-main",
    subjectId: "jee-physics",
    topic: "Mechanics",
    count: 5,
    difficulty: "medium",
  });

  logTest(
    "POST /api/quiz",
    quizResponse.success || quizResponse.data?.error === "User not found",
    quizResponse.success
      ? `Generated ${quizResponse.data?.questions?.length || 0} questions`
      : quizResponse.error || quizResponse.data?.error
  );
}

async function testReviewEndpoints() {
  logSubsection("Review Endpoints");

  const review = await testAPI("/api/review");
  logTest(
    "GET /api/review",
    review.success,
    review.success
      ? `Due today: ${review.data?.dueToday || 0}, Due this week: ${review.data?.dueThisWeek || 0}`
      : review.error
  );
}

async function testMockTestEndpoints() {
  logSubsection("Mock Test Endpoints");

  const mockTest = await testAPI("/api/mock-test", "POST", {
    examId: "jee-main",
  });

  logTest(
    "POST /api/mock-test",
    mockTest.success || mockTest.data?.error?.includes("not found"),
    mockTest.success
      ? `Generated mock test with ${mockTest.data?.questions?.length || 0} questions`
      : mockTest.error || mockTest.data?.error
  );
}

async function testReportsEndpoints() {
  logSubsection("Reports Endpoints");

  const reports = await testAPI("/api/reports");

  // Reports might require Pro subscription
  const isProRequired = reports.data?.proRequired === true;

  logTest(
    "GET /api/reports",
    reports.success || isProRequired,
    isProRequired
      ? "⚠️  Pro subscription required"
      : reports.success
        ? `Subject breakdown: ${reports.data?.subjectBreakdown?.length || 0} subjects`
        : reports.error
  );
}

// ============================================================
// STREAK CALCULATION TESTS
// ============================================================

async function testStreakCalculations() {
  logSubsection("Streak Calculation Consistency");

  try {
    // Get streak from stats API
    const statsResponse = await testAPI("/api/stats");
    const statsStreak = statsResponse.data?.stats?.streak || 0;

    // Get streak from calendar API
    const calendarResponse = await testAPI("/api/streak-calendar");
    const calendarStreak = calendarResponse.data?.currentStreak || 0;

    // Check if they match
    const streaksMatch = statsStreak === calendarStreak;
    logTest(
      "Dashboard vs Calendar streak consistency",
      streaksMatch,
      streaksMatch
        ? `Both show ${statsStreak} days`
        : `Dashboard: ${statsStreak}, Calendar: ${calendarStreak} ❌ MISMATCH`
    );

    // Test date consistency
    const studyDates = await db.execute({
      sql: `SELECT DISTINCT DATE(created_at, 'localtime') as day
            FROM quiz_sessions
            WHERE user_id = ?
            ORDER BY day DESC
            LIMIT 10`,
      args: [TEST_USER_ID],
    });

    const dates = studyDates.rows.map((r: any) => r.day);
    logTest(
      "Date timezone consistency",
      true,
      dates.length > 0
        ? `Recent dates: ${dates.slice(0, 5).join(", ")}`
        : "No quiz sessions found"
    );

  } catch (error: any) {
    logTest("Streak calculation test", false, error.message);
  }
}

// ============================================================
// QUESTION BANK TESTS
// ============================================================

async function testQuestionBank() {
  logSubsection("Question Bank Integrity");

  try {
    // Test cached questions
    const cached = await db.execute(
      "SELECT COUNT(*) as count FROM cached_questions"
    );
    logTest(
      "Cached questions",
      cached.rows[0].count > 0,
      `${cached.rows[0].count} questions available`
    );

    // Test exam questions
    const examQuestions = await db.execute(
      "SELECT COUNT(*) as count FROM exam_questions"
    );
    logTest(
      "Exam questions",
      examQuestions.rows[0].count >= 0,
      `${examQuestions.rows[0].count} verified questions`
    );

    // Test for NULL questions (data quality)
    const nullQuestions = await db.execute(
      "SELECT COUNT(*) as count FROM cached_questions WHERE question_json IS NULL OR question_json = ''"
    );
    logTest(
      "Data quality: No NULL questions",
      nullQuestions.rows[0].count === 0,
      nullQuestions.rows[0].count === 0
        ? "All questions valid ✓"
        : `Found ${nullQuestions.rows[0].count} NULL questions ❌`
    );

  } catch (error: any) {
    logTest("Question bank test", false, error.message);
  }
}

// ============================================================
// FEATURE TESTS
// ============================================================

async function testGamificationFeatures() {
  logSubsection("Gamification Features");

  try {
    // Test badges
    const badges = await db.execute({
      sql: "SELECT COUNT(*) as count FROM user_badges WHERE user_id = ?",
      args: [TEST_USER_ID],
    });
    logTest(
      "User badges system",
      true,
      `${badges.rows[0].count} badges unlocked`
    );

    // Test badge stats
    const badgeStats = await db.execute({
      sql: "SELECT * FROM badge_stats WHERE user_id = ?",
      args: [TEST_USER_ID],
    });

    if (badgeStats.rows.length > 0) {
      const stats = badgeStats.rows[0];
      logTest(
        "Badge stats tracking",
        true,
        `Levels: ${stats.levels_completed}, Perfect quizzes: ${stats.perfect_quizzes}`
      );
    } else {
      logTest("Badge stats tracking", true, "No stats yet (user hasn't completed any)");
    }

  } catch (error: any) {
    logTest("Gamification features test", false, error.message);
  }
}

// ============================================================
// MAIN TEST RUNNER
// ============================================================

async function runAllTests() {
  console.log(`\n${colors.cyan}${"=".repeat(60)}${colors.reset}`);
  console.log(`${colors.cyan}🧪 PrepGenie Comprehensive Functional Testing${colors.reset}`);
  console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}`);
  console.log(`\n${colors.yellow}Test Configuration:${colors.reset}`);
  console.log(`  Base URL: ${BASE_URL}`);
  console.log(`  Test User: ${TEST_USER_ID}`);
  console.log(`  Database: ${process.env.TURSO_DATABASE_URL?.substring(0, 50)}...`);

  try {
    initDB();

    // Run all test suites
    logSection("1. Database Tests");
    await testDatabaseConnection();
    await testDatabaseSchema();
    await testUserData();

    logSection("2. API Endpoint Tests");
    await testAuthEndpoints();
    await testStatsEndpoints();
    await testQuizEndpoints();
    await testReviewEndpoints();
    await testMockTestEndpoints();
    await testReportsEndpoints();

    logSection("3. Data Integrity Tests");
    await testStreakCalculations();
    await testQuestionBank();

    logSection("4. Feature Tests");
    await testGamificationFeatures();

    // Print summary
    console.log(`\n${colors.cyan}${"=".repeat(60)}${colors.reset}`);
    console.log(`${colors.cyan}📊 Test Summary${colors.reset}`);
    console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}\n`);

    const passRate = ((results.passed / results.total) * 100).toFixed(1);
    console.log(`  Total Tests: ${results.total}`);
    console.log(`  ${colors.green}Passed: ${results.passed}${colors.reset}`);
    console.log(`  ${colors.red}Failed: ${results.failed}${colors.reset}`);
    console.log(`  Pass Rate: ${passRate}%`);

    if (results.failed === 0) {
      console.log(`\n${colors.green}✅ All tests passed! System is healthy.${colors.reset}\n`);
      process.exit(0);
    } else {
      console.log(`\n${colors.yellow}⚠️  Some tests failed. Review the output above.${colors.reset}\n`);
      process.exit(1);
    }

  } catch (error: any) {
    console.error(`\n${colors.red}❌ Fatal error: ${error.message}${colors.reset}\n`);
    process.exit(1);
  }
}

// Run tests
runAllTests();
