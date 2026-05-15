import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join } from "path";

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

const testQuestions = [
  {
    question: "What is the speed of light in vacuum?",
    options: ["3 × 10⁸ m/s", "3 × 10⁶ m/s", "3 × 10⁷ m/s", "3 × 10⁹ m/s"],
    correctAnswer: 0,
    explanation: "The speed of light in vacuum is approximately 3 × 10⁸ m/s.",
    difficulty: "easy"
  },
  {
    question: "Which organelle is known as the powerhouse of the cell?",
    options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi apparatus"],
    correctAnswer: 1,
    explanation: "Mitochondria generate most of the cell's ATP through cellular respiration.",
    difficulty: "easy"
  },
  {
    question: "Who is known as the Father of the Indian Constitution?",
    options: ["Mahatma Gandhi", "B.R. Ambedkar", "Jawaharlal Nehru", "Sardar Patel"],
    correctAnswer: 1,
    explanation: "Dr. B.R. Ambedkar chaired the drafting committee of the Indian Constitution.",
    difficulty: "easy"
  },
  {
    question: "If 25% of a number is 50, what is the number?",
    options: ["150", "200", "250", "300"],
    correctAnswer: 1,
    explanation: "25% of 200 = (25/100) × 200 = 50",
    difficulty: "medium"
  },
  {
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correctAnswer: 1,
    explanation: "Binary search divides the search space in half each iteration, giving O(log n) complexity.",
    difficulty: "medium"
  }
];

async function createTestSprints() {
  const today = new Date().toISOString().split("T")[0];
  const startTime = new Date().toISOString();
  const endTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const sprints = [
    { examId: "jee-main", subjectId: "jee-physics", name: "JEE Main Physics", topic: "Mechanics" },
    { examId: "neet", subjectId: "neet-biology", name: "NEET Biology", topic: "Cell Biology" },
    { examId: "upsc-prelims", subjectId: "upsc-polity", name: "UPSC Polity", topic: "Constitution" },
    { examId: "cat", subjectId: "cat-quant", name: "CAT Quantitative", topic: "Percentages" },
    { examId: "gate-cse", subjectId: "gate-dsa", name: "GATE CSE - DSA", topic: "Binary Search" },
    { examId: "ssc-cgl", subjectId: "ssc-reasoning", name: "SSC CGL Reasoning", topic: "Logical Reasoning" },
  ];

  console.log("Creating 6 test sprints...\n");

  for (const sprint of sprints) {
    const sprintId = `sprint-${sprint.examId}-${Date.now()}`;

    await db.execute({
      sql: `INSERT INTO daily_sprints (id, date, start_time, end_time, topic, exam_id, subject_id, questions, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        sprintId,
        today,
        startTime,
        endTime,
        `${sprint.name}: ${sprint.topic}`,
        sprint.examId,
        sprint.subjectId,
        JSON.stringify(testQuestions),
        "active",
      ],
    });

    console.log(`✅ ${sprint.name}: ${sprint.topic}`);
  }

  console.log(`\n🎉 All 6 sprints created!`);
  console.log(`Visit: http://localhost:3000/sprint`);
}

createTestSprints().catch(console.error);
