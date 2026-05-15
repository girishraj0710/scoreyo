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

async function createAllSprints() {
  const today = new Date().toISOString().split("T")[0];
  const startTime = new Date().toISOString();
  const endTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  // First delete existing sprints
  await db.execute({ sql: "DELETE FROM daily_sprints WHERE date = ?", args: [today] });
  console.log("🗑️  Deleted old sprints\n");

  const sprints = [
    // JEE Main (3)
    { examId: "jee-main", subjectId: "jee-physics", name: "JEE Physics", topic: "Mechanics", cat: "JEE Main" },
    { examId: "jee-main", subjectId: "jee-chemistry", name: "JEE Chemistry", topic: "Organic Chemistry", cat: "JEE Main" },
    { examId: "jee-main", subjectId: "jee-maths", name: "JEE Mathematics", topic: "Calculus", cat: "JEE Main" },

    // NEET (3)
    { examId: "neet", subjectId: "neet-biology", name: "NEET Biology", topic: "Cell Biology", cat: "NEET" },
    { examId: "neet", subjectId: "neet-physics", name: "NEET Physics", topic: "Optics", cat: "NEET" },
    { examId: "neet", subjectId: "neet-chemistry", name: "NEET Chemistry", topic: "Biomolecules", cat: "NEET" },

    // UPSC (3)
    { examId: "upsc-prelims", subjectId: "upsc-polity", name: "UPSC Polity", topic: "Constitution", cat: "UPSC" },
    { examId: "upsc-prelims", subjectId: "upsc-history", name: "UPSC History", topic: "Ancient India", cat: "UPSC" },
    { examId: "upsc-prelims", subjectId: "upsc-geography", name: "UPSC Geography", topic: "Physical Geography", cat: "UPSC" },

    // CAT (3)
    { examId: "cat", subjectId: "cat-quant", name: "CAT Quantitative", topic: "Percentages", cat: "CAT" },
    { examId: "cat", subjectId: "cat-verbal", name: "CAT Verbal", topic: "Reading Comprehension", cat: "CAT" },
    { examId: "cat", subjectId: "cat-dilr", name: "CAT DILR", topic: "Puzzles", cat: "CAT" },

    // GATE CSE (2)
    { examId: "gate-cse", subjectId: "gate-dsa", name: "GATE DSA", topic: "Binary Search Trees", cat: "GATE CSE" },
    { examId: "gate-cse", subjectId: "gate-os", name: "GATE OS", topic: "Process Management", cat: "GATE CSE" },

    // SSC CGL (3)
    { examId: "ssc-cgl", subjectId: "ssc-reasoning", name: "SSC Reasoning", topic: "Puzzles", cat: "SSC CGL" },
    { examId: "ssc-cgl", subjectId: "ssc-quant", name: "SSC Quantitative", topic: "Arithmetic", cat: "SSC CGL" },
    { examId: "ssc-cgl", subjectId: "ssc-english", name: "SSC English", topic: "Grammar", cat: "SSC CGL" },

    // Banking (2)
    { examId: "ibps-po", subjectId: "banking-reasoning", name: "Banking Reasoning", topic: "Seating Arrangement", cat: "Banking" },
    { examId: "ibps-po", subjectId: "banking-quant", name: "Banking Quantitative", topic: "Data Interpretation", cat: "Banking" },

    // Generic (7)
    { examId: "general", subjectId: "mental-math", name: "Mental Math Challenge", topic: "Quick Calculations", cat: "General" },
    { examId: "general", subjectId: "english-grammar", name: "English Grammar Sprint", topic: "Tenses", cat: "General" },
    { examId: "general", subjectId: "vocabulary", name: "Vocabulary Builder", topic: "Synonyms & Antonyms", cat: "General" },
    { examId: "general", subjectId: "current-affairs", name: "Current Affairs Quiz", topic: "National News", cat: "General" },
    { examId: "general", subjectId: "gk", name: "General Knowledge", topic: "Indian History", cat: "General" },
    { examId: "general", subjectId: "logical-reasoning", name: "Logical Reasoning Battle", topic: "Pattern Recognition", cat: "General" },
    { examId: "general", subjectId: "science-facts", name: "Science & Technology", topic: "Physics Facts", cat: "General" },
  ];

  console.log(`📦 Creating ${sprints.length} sprints...\n`);

  let created = 0;
  for (const sprint of sprints) {
    const sprintId = `sprint-${sprint.examId}-${Date.now()}-${created}`;

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

    console.log(`  ✅ [${sprint.cat}] ${sprint.name}: ${sprint.topic}`);
    created++;
  }

  console.log(`\n🎉 Created ${created} sprints across 8 categories!`);
  console.log(`\n📊 Breakdown:`);
  console.log(`   - JEE Main: 3 sprints`);
  console.log(`   - NEET: 3 sprints`);
  console.log(`   - UPSC: 3 sprints`);
  console.log(`   - CAT: 3 sprints`);
  console.log(`   - GATE CSE: 2 sprints`);
  console.log(`   - SSC CGL: 3 sprints`);
  console.log(`   - Banking: 2 sprints`);
  console.log(`   - General Knowledge: 7 sprints`);
  console.log(`\n🌐 Visit: http://localhost:3000/sprint`);
}

createAllSprints().catch(console.error);
