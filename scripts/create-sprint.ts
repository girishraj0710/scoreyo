import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join } from "path";

// Load env
const envFile = readFileSync(join(process.cwd(), ".env.local"), "utf-8");
envFile.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const [, key, value] = match;
    process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, "");
  }
});

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function createSprint() {
  // Check if sprint table exists
  const tables = await db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='daily_sprints'");

  if (tables.rows.length === 0) {
    console.log("❌ Table 'daily_sprints' doesn't exist. Creating it...");
    await db.execute(`
      CREATE TABLE IF NOT EXISTS daily_sprints (
        id TEXT PRIMARY KEY,
        topic TEXT NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        questions TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS sprint_participations (
        id TEXT PRIMARY KEY,
        sprint_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        score INTEGER NOT NULL,
        total_questions INTEGER NOT NULL,
        time_taken INTEGER NOT NULL,
        completed_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (sprint_id) REFERENCES daily_sprints(id)
      )
    `);
    console.log("✅ Tables created");
  }

  // Delete old sprints
  await db.execute("DELETE FROM daily_sprints WHERE datetime(end_time) < datetime('now')");

  // Check if active sprint exists
  const existing = await db.execute(
    "SELECT * FROM daily_sprints WHERE datetime(end_time) > datetime('now') LIMIT 1"
  );

  if (existing.rows.length > 0) {
    console.log("✅ Active sprint already exists:", existing.rows[0]);
    return;
  }

  // Create new sprint (24 hours from now)
  const sprintId = `sprint-${Date.now()}`;
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const startTime = new Date().toISOString();
  const endTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

  const questions = [
    {
      question: "What is the time complexity of binary search?",
      options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
      correctAnswer: 1,
      explanation: "Binary search divides the search space in half each time, resulting in O(log n) complexity.",
      difficulty: "medium"
    },
    {
      question: "Which data structure uses LIFO principle?",
      options: ["Queue", "Stack", "Array", "Tree"],
      correctAnswer: 1,
      explanation: "Stack follows Last-In-First-Out (LIFO) principle.",
      difficulty: "easy"
    },
    {
      question: "What is the capital of India?",
      options: ["Mumbai", "Delhi", "Bangalore", "Kolkata"],
      correctAnswer: 1,
      explanation: "New Delhi is the capital of India.",
      difficulty: "easy"
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswer: 1,
      explanation: "Mars appears red due to iron oxide on its surface.",
      difficulty: "easy"
    },
    {
      question: "What is 15% of 200?",
      options: ["20", "25", "30", "35"],
      correctAnswer: 2,
      explanation: "15% of 200 = (15/100) × 200 = 30",
      difficulty: "medium"
    }
  ];

  await db.execute({
    sql: `INSERT INTO daily_sprints (id, date, start_time, end_time, topic, exam_id, subject_id, questions, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [sprintId, today, startTime, endTime, "Quick Fire Challenge", "general", "general", JSON.stringify(questions), "active"]
  });

  console.log("✅ Sprint created successfully!");
  console.log("   Sprint ID:", sprintId);
  console.log("   Topic: Quick Fire Challenge");
  console.log("   Start:", startTime);
  console.log("   End:", endTime);
  console.log("   Questions:", questions.length);
}

createSprint().catch(console.error);
