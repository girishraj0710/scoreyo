import { NextRequest, NextResponse } from "next/server";
import { generateQuiz } from "@/lib/quiz-generator";
import { getExamById } from "@/lib/exams";
import { queryAll, execute } from "@/lib/db";

// Secret token for cron job authentication
const CRON_SECRET = process.env.CRON_SECRET;

// Safety knobs to bound cost & latency
const QUESTIONS_PER_SPRINT = 20;
const MAX_SPRINTS_PER_RUN = 30; // hard cap regardless of configs
const BATCH_SIZE = 4; // generate this many sprints in parallel

/**
 * Automatic Sprint Creator - Called by GitHub Actions daily
 * GET /api/cron/create-sprint?secret=xxx
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (skip check if CRON_SECRET not configured in production)
    const secret = request.nextUrl.searchParams.get("secret");

    // Only validate if CRON_SECRET is configured
    if (CRON_SECRET && secret !== CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Log if running without secret (for debugging)
    if (!CRON_SECRET) {
      console.log("[Sprint Cron] Running without CRON_SECRET (not configured)");
    }

    const force = request.nextUrl.searchParams.get("force") === "true";
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    console.log("[Sprint Cron] Step 1: Checking existing sprints");
    // Check if sprints already exist for today
    const existing = await queryAll(
      "SELECT id, exam_id FROM daily_sprints WHERE date = ? AND status = 'active'",
      [today]
    );

    if (existing.length > 0 && !force) {
      return NextResponse.json({
        message: "Sprints already exist for today",
        count: existing.length,
        sprints: existing.map((r: any) => ({ id: r.id, examId: r.exam_id })),
      });
    }

    console.log("[Sprint Cron] Step 2: Deleting existing if force=true");
    // If force=true, delete existing sprints for today
    if (force && existing.length > 0) {
      await execute(
        "DELETE FROM daily_sprints WHERE date = ?",
        [today]
      );
      console.log(`🗑️  Deleted ${existing.length} existing sprints for ${today}`);
    }

    console.log("[Sprint Cron] Step 3: Deleting old sprints");
    // Delete old sprints (older than 7 days) - PostgreSQL INTERVAL syntax
    // date column is TEXT (YYYY-MM-DD), so cast CURRENT_DATE to text for comparison
    await execute(
      "DELETE FROM daily_sprints WHERE date < TO_CHAR(CURRENT_DATE - INTERVAL '7 days', 'YYYY-MM-DD')"
    );
    console.log("[Sprint Cron] Step 4: Old sprints deleted");

    // Exam-Specific Sprints (compete with peers in same exam)
    const examSpecificSprints = [
      // JEE Main - 3 subjects
      {
        examId: "jee-main",
        subjectId: "jee-physics",
        topics: ["Mechanics", "Thermodynamics", "Electrostatics", "Optics", "Modern Physics", "Waves"],
        name: "JEE Physics",
        category: "JEE Main"
      },
      {
        examId: "jee-main",
        subjectId: "jee-chemistry",
        topics: ["Organic Chemistry", "Physical Chemistry", "Inorganic Chemistry", "Thermodynamics", "Equilibrium"],
        name: "JEE Chemistry",
        category: "JEE Main"
      },
      {
        examId: "jee-main",
        subjectId: "jee-maths",
        topics: ["Calculus", "Algebra", "Coordinate Geometry", "Trigonometry", "Vectors"],
        name: "JEE Mathematics",
        category: "JEE Main"
      },

      // NEET - 3 subjects
      {
        examId: "neet-ug",
        subjectId: "neet-biology",
        topics: ["Cell Biology", "Genetics", "Human Physiology", "Ecology", "Plant Physiology", "Evolution"],
        name: "NEET Biology",
        category: "NEET"
      },
      {
        examId: "neet-ug",
        subjectId: "neet-physics",
        topics: ["Mechanics", "Optics", "Electricity", "Modern Physics", "Thermodynamics"],
        name: "NEET Physics",
        category: "NEET"
      },
      {
        examId: "neet-ug",
        subjectId: "neet-chemistry",
        topics: ["Organic Chemistry", "Physical Chemistry", "Inorganic Chemistry", "Biomolecules"],
        name: "NEET Chemistry",
        category: "NEET"
      },

      // UPSC - 3 subjects
      {
        examId: "upsc-cse",
        subjectId: "upsc-polity",
        topics: ["Constitution", "Fundamental Rights", "Parliament", "Judiciary", "Elections", "Federalism"],
        name: "UPSC Polity",
        category: "UPSC"
      },
      {
        examId: "upsc-cse",
        subjectId: "upsc-history",
        topics: ["Ancient India", "Medieval India", "Modern India", "Freedom Movement", "Art & Culture"],
        name: "UPSC History",
        category: "UPSC"
      },
      {
        examId: "upsc-cse",
        subjectId: "upsc-geography",
        topics: ["Physical Geography", "Indian Geography", "World Geography", "Economic Geography"],
        name: "UPSC Geography",
        category: "UPSC"
      },

      // CAT - 3 sections
      {
        examId: "cat",
        subjectId: "cat-quant",
        topics: ["Arithmetic", "Algebra", "Geometry", "Number System", "Percentages", "Time & Work"],
        name: "CAT Quantitative",
        category: "CAT"
      },
      {
        examId: "cat",
        subjectId: "cat-varc",
        topics: ["Reading Comprehension", "Para Jumbles", "Grammar", "Vocabulary", "Critical Reasoning"],
        name: "CAT Verbal",
        category: "CAT"
      },
      {
        examId: "cat",
        subjectId: "cat-dilr",
        topics: ["Data Interpretation", "Logical Reasoning", "Puzzles", "Arrangements", "Games"],
        name: "CAT DILR",
        category: "CAT"
      },

      // GATE CSE - 2 topic-flavored sprints (same subject, different topic pools)
      {
        examId: "gate",
        subjectId: "gate-cs",
        topics: ["Data Structures", "Algorithms", "Dynamic Programming", "Trees", "Graphs", "Sorting"],
        name: "GATE DSA",
        category: "GATE CSE"
      },
      {
        examId: "gate",
        subjectId: "gate-cs",
        topics: ["Operating Systems", "Process Management", "Memory Management", "File Systems", "Deadlocks", "Scheduling"],
        name: "GATE OS",
        category: "GATE CSE"
      },

      // SSC CGL - 3 sections
      {
        examId: "ssc-cgl",
        subjectId: "ssc-reasoning",
        topics: ["Logical Reasoning", "Verbal Reasoning", "Analytical Reasoning", "Blood Relations", "Puzzles"],
        name: "SSC Reasoning",
        category: "SSC CGL"
      },
      {
        examId: "ssc-cgl",
        subjectId: "ssc-quant",
        topics: ["Arithmetic", "Algebra", "Geometry", "Mensuration", "Percentages"],
        name: "SSC Quantitative",
        category: "SSC CGL"
      },
      {
        examId: "ssc-cgl",
        subjectId: "ssc-english",
        topics: ["Grammar", "Vocabulary", "Comprehension", "Sentence Correction", "Synonyms & Antonyms"],
        name: "SSC English",
        category: "SSC CGL"
      },

      // Banking - 2 sections
      {
        examId: "ibps-po",
        subjectId: "ibps-reasoning",
        topics: ["Puzzles", "Seating Arrangement", "Syllogism", "Coding-Decoding", "Blood Relations"],
        name: "Banking Reasoning",
        category: "Banking"
      },
      {
        examId: "ibps-po",
        subjectId: "ibps-quant",
        topics: ["Data Interpretation", "Simplification", "Number Series", "Percentage", "Profit & Loss"],
        name: "Banking Quantitative",
        category: "Banking"
      },
    ];

    // Generic Knowledge Sprints — stored under examId="general" so the UI
    // groups them in the "General Knowledge" section. We use a real backing
    // exam/subject (`generationExamId` / `generationSubjectId`) purely to
    // feed `generateQuiz` with a valid taxonomy entry.
    const genericSprints = [
      {
        examId: "general",
        subjectId: "mental-math",
        generationExamId: "ssc-cgl",
        generationSubjectId: "ssc-quant",
        topics: ["Quick Calculations", "Percentage Tricks", "Square Roots", "Multiplication Shortcuts", "Number Patterns"],
        name: "Mental Math Challenge",
        category: "General"
      },
      {
        examId: "general",
        subjectId: "english-grammar",
        generationExamId: "ssc-cgl",
        generationSubjectId: "ssc-english",
        topics: ["Tenses", "Articles", "Prepositions", "Subject-Verb Agreement", "Common Errors"],
        name: "English Grammar Sprint",
        category: "General"
      },
      {
        examId: "general",
        subjectId: "vocabulary",
        generationExamId: "ssc-cgl",
        generationSubjectId: "ssc-english",
        topics: ["Synonyms & Antonyms", "One Word Substitution", "Idioms & Phrases", "Word Usage", "Analogies"],
        name: "Vocabulary Builder",
        category: "General"
      },
      {
        examId: "general",
        subjectId: "current-affairs",
        generationExamId: "upsc-cse",
        generationSubjectId: "upsc-current",
        topics: ["National News", "International News", "Sports", "Awards & Honours", "Books & Authors"],
        name: "Current Affairs Quiz",
        category: "General"
      },
      {
        examId: "general",
        subjectId: "gk",
        generationExamId: "ssc-cgl",
        generationSubjectId: "ssc-gk",
        topics: ["Indian History", "Geography", "Science Facts", "Indian Polity", "Economics"],
        name: "General Knowledge",
        category: "General"
      },
      {
        examId: "general",
        subjectId: "logical-reasoning",
        generationExamId: "ssc-cgl",
        generationSubjectId: "ssc-reasoning",
        topics: ["Pattern Recognition", "Analogies", "Coding-Decoding", "Series", "Classification"],
        name: "Logical Reasoning Battle",
        category: "General"
      },
      {
        examId: "general",
        subjectId: "science-facts",
        generationExamId: "upsc-cse",
        generationSubjectId: "upsc-science",
        topics: ["Physics Facts", "Chemistry Basics", "Biology Concepts", "Scientific Discoveries", "Inventions"],
        name: "Science & Technology",
        category: "General"
      },
    ];

    const allConfigs = [...examSpecificSprints, ...genericSprints];
    // Enforce max cap to prevent runaway cost/latency
    const sprintConfigs = allConfigs.slice(0, MAX_SPRINTS_PER_RUN);
    const skippedCount = allConfigs.length - sprintConfigs.length;

    const createdSprints: Array<{ id: string; exam: string; topic: string; questions: number }> = [];
    const failedSprints: Array<{ exam: string; reason: string }> = [];
    const startTime = new Date().toISOString();
    const endTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    async function buildSprint(config: typeof sprintConfigs[number] & { generationExamId?: string; generationSubjectId?: string }) {
      try {
        const randomTopic = config.topics[Math.floor(Math.random() * config.topics.length)];
        // Use generation override if provided (for generic sprints stored under
        // examId="general" which is not in the exam taxonomy)
        const lookupExamId = config.generationExamId || config.examId;
        const lookupSubjectId = config.generationSubjectId || config.subjectId;
        const exam = getExamById(lookupExamId);
        const subject = exam?.subjects.find((s) => s.id === lookupSubjectId);

        if (!exam || !subject) {
          failedSprints.push({ exam: config.name, reason: `invalid exam/subject (${lookupExamId}/${lookupSubjectId})` });
          return;
        }

        const questions = await generateQuiz(
          exam.fullName,
          subject.name,
          randomTopic,
          QUESTIONS_PER_SPRINT,
          "mixed"
        );

        if (questions.length === 0) {
          failedSprints.push({ exam: config.name, reason: "no questions generated" });
          return;
        }

        const sprintId = `sprint-${config.examId}-${config.subjectId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

        await execute(
          `INSERT INTO daily_sprints (id, date, start_time, end_time, topic, exam_id, subject_id, questions, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            sprintId,
            today,
            startTime,
            endTime,
            `${config.name}: ${randomTopic}`,
            config.examId,
            config.subjectId,
            JSON.stringify(questions),
            "active",
          ]
        );

        createdSprints.push({
          id: sprintId,
          exam: config.name,
          topic: randomTopic,
          questions: questions.length,
        });

        console.log(`✅ Sprint created: ${config.name} - ${randomTopic} (${questions.length} Qs)`);
      } catch (error: any) {
        failedSprints.push({ exam: config.name, reason: error?.message || "unknown error" });
        console.error(`Failed to create sprint for ${config.name}:`, error);
      }
    }

    // Process in batches of BATCH_SIZE to limit concurrent OpenRouter calls
    for (let i = 0; i < sprintConfigs.length; i += BATCH_SIZE) {
      const batch = sprintConfigs.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map(buildSprint));
    }

    return NextResponse.json({
      success: true,
      message: `Created ${createdSprints.length} sprints for today`,
      created: createdSprints.length,
      failed: failedSprints.length,
      skippedDueToCap: skippedCount,
      questionsPerSprint: QUESTIONS_PER_SPRINT,
      batchSize: BATCH_SIZE,
      maxSprintsPerRun: MAX_SPRINTS_PER_RUN,
      sprints: createdSprints,
      failures: failedSprints,
      startTime,
      endTime,
    });
  } catch (error: any) {
    console.error("Sprint creation error:", error);
    return NextResponse.json(
      { error: "Failed to create sprint", details: error.message },
      { status: 500 }
    );
  }
}
