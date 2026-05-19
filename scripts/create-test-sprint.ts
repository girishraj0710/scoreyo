#!/usr/bin/env tsx
import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join } from "path";

const envFile = readFileSync(join(process.cwd(), ".env.local"), "utf-8");
envFile.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const [, key, value] = match;
    process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
  }
});

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function createTestSprint() {
  const now = new Date();
  const endTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

  const sprintId = `test-sprint-${Date.now()}`;
  const today = now.toISOString().split('T')[0];

  console.log("Creating test sprint...\n");

  // Create a test sprint
  await db.execute({
    sql: `INSERT INTO daily_sprints (id, date, start_time, end_time, topic, exam_id, subject_id, questions, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      sprintId,
      today,
      now.toISOString(),
      endTime.toISOString(),
      "Kinematics & Motion",
      "jee-main",
      "jee-physics",
      JSON.stringify([
        { question: "A particle moves with constant velocity. What is its acceleration?", options: ["Zero", "Constant", "Increasing", "Decreasing"], correctAnswer: 0, explanation: "Constant velocity means no change in velocity, hence acceleration is zero." },
        { question: "What is the SI unit of velocity?", options: ["m/s²", "m/s", "km/h", "mph"], correctAnswer: 1, explanation: "Velocity is distance per time, so m/s is the SI unit." },
        { question: "A body thrown vertically upward reaches maximum height when:", options: ["Velocity = 0", "Acceleration = 0", "Both v and a = 0", "None"], correctAnswer: 0, explanation: "At maximum height, instantaneous velocity becomes zero." },
        { question: "Distance covered in nth second is given by:", options: ["u + a(2n-1)/2", "u + an", "ut + at²/2", "None"], correctAnswer: 0, explanation: "This is the formula for distance in nth second." },
        { question: "If displacement-time graph is a straight line, motion is:", options: ["Uniform", "Accelerated", "Retarded", "None"], correctAnswer: 0, explanation: "Straight line on s-t graph indicates uniform motion." },
      ]),
      'active'
    ]
  });

  console.log("✅ Test sprint created successfully!");
  console.log(`Sprint ID: ${sprintId}`);
  console.log(`Topic: Kinematics & Motion`);
  console.log(`Expires: ${endTime.toLocaleString()}`);
  console.log(`\n🎨 Now refresh your browser to see:`);
  console.log(`   - Purple gradient leaderboard tile at the top`);
  console.log(`   - White sprint card below`);
  console.log(`   - Light gradient background`);
}

createTestSprint().catch(console.error);
