// Dynamic Mock Test Configuration
// Auto-scales based on available questions in database

import { getExamQuestions } from "./db";
import { examCategories } from "./exams";
import { createClient } from "@libsql/client";

// Database client for direct queries
function getDbClient() {
  return createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });
}

// Helper to count questions using dimensional model
async function countQuestions(examId: string, subjectId?: string): Promise<number> {
  const db = getDbClient();

  let sql = `
    SELECT COUNT(DISTINCT q.id) as count
    FROM fact_exam_questions q
    JOIN bridge_exam_subject_topic b ON q.topic_id = b.topic_id
    JOIN dim_exams e ON b.exam_id = e.id
    JOIN dim_subjects s ON b.subject_id = s.id
    WHERE e.exam_code = ?
  `;
  let args: any[] = [examId];

  if (subjectId) {
    sql += " AND s.subject_code = ?";
    args.push(subjectId);
  }

  const result = await db.execute({ sql, args });
  return Number(result.rows[0]?.count || 0);
}

export interface MockTestTemplate {
  examId: string;
  examName: string;
  totalQuestionsPerTest: number;
  timeLimitMinutes: number;
  sections: {
    subjectId: string;
    subjectName: string;
    questionCount: number;
  }[];
}

export interface DynamicMockTestConfig extends MockTestTemplate {
  testNumber: number;
  availableTests: number;
  totalQuestionsAvailable: number;
}

// Mock test templates for each exam (structure only, count is dynamic)
export const mockTestTemplates: MockTestTemplate[] = [
  // Engineering Exams
  {
    examId: "jee-main",
    examName: "JEE Main",
    totalQuestionsPerTest: 30,
    timeLimitMinutes: 60,
    sections: [
      { subjectId: "jee-physics", subjectName: "Physics", questionCount: 10 },
      { subjectId: "jee-chemistry", subjectName: "Chemistry", questionCount: 10 },
      { subjectId: "jee-maths", subjectName: "Mathematics", questionCount: 10 },
    ],
  },
  {
    examId: "jee-advanced",
    examName: "JEE Advanced",
    totalQuestionsPerTest: 30,
    timeLimitMinutes: 60,
    sections: [
      { subjectId: "jee-adv-physics", subjectName: "Physics", questionCount: 10 },
      { subjectId: "jee-adv-chemistry", subjectName: "Chemistry", questionCount: 10 },
      { subjectId: "jee-adv-maths", subjectName: "Mathematics", questionCount: 10 },
    ],
  },
  {
    examId: "kcet",
    examName: "Karnataka CET",
    totalQuestionsPerTest: 30,
    timeLimitMinutes: 60,
    sections: [
      { subjectId: "kcet-physics", subjectName: "Physics", questionCount: 10 },
      { subjectId: "kcet-chemistry", subjectName: "Chemistry", questionCount: 10 },
      { subjectId: "kcet-maths", subjectName: "Mathematics", questionCount: 10 },
    ],
  },
  {
    examId: "comedk",
    examName: "COMEDK UGET",
    totalQuestionsPerTest: 30,
    timeLimitMinutes: 60,
    sections: [
      { subjectId: "comedk-physics", subjectName: "Physics", questionCount: 10 },
      { subjectId: "comedk-chemistry", subjectName: "Chemistry", questionCount: 10 },
      { subjectId: "comedk-maths", subjectName: "Mathematics", questionCount: 10 },
    ],
  },
  {
    examId: "mht-cet",
    examName: "MHT CET",
    totalQuestionsPerTest: 30,
    timeLimitMinutes: 60,
    sections: [
      { subjectId: "mht-physics", subjectName: "Physics", questionCount: 10 },
      { subjectId: "mht-chemistry", subjectName: "Chemistry", questionCount: 10 },
      { subjectId: "mht-maths", subjectName: "Mathematics", questionCount: 10 },
    ],
  },
  {
    examId: "ts-eamcet",
    examName: "TS EAMCET",
    totalQuestionsPerTest: 30,
    timeLimitMinutes: 60,
    sections: [
      { subjectId: "ts-physics", subjectName: "Physics", questionCount: 10 },
      { subjectId: "ts-chemistry", subjectName: "Chemistry", questionCount: 10 },
      { subjectId: "ts-maths", subjectName: "Mathematics", questionCount: 10 },
    ],
  },
  {
    examId: "ap-eamcet",
    examName: "AP EAMCET",
    totalQuestionsPerTest: 30,
    timeLimitMinutes: 60,
    sections: [
      { subjectId: "ap-physics", subjectName: "Physics", questionCount: 10 },
      { subjectId: "ap-chemistry", subjectName: "Chemistry", questionCount: 10 },
      { subjectId: "ap-maths", subjectName: "Mathematics", questionCount: 10 },
    ],
  },
  {
    examId: "wbjee",
    examName: "WBJEE",
    totalQuestionsPerTest: 30,
    timeLimitMinutes: 60,
    sections: [
      { subjectId: "wbjee-physics", subjectName: "Physics", questionCount: 10 },
      { subjectId: "wbjee-chemistry", subjectName: "Chemistry", questionCount: 10 },
      { subjectId: "wbjee-maths", subjectName: "Mathematics", questionCount: 10 },
    ],
  },
  {
    examId: "keam",
    examName: "KEAM",
    totalQuestionsPerTest: 30,
    timeLimitMinutes: 60,
    sections: [
      { subjectId: "keam-physics", subjectName: "Physics", questionCount: 10 },
      { subjectId: "keam-chemistry", subjectName: "Chemistry", questionCount: 10 },
      { subjectId: "keam-maths", subjectName: "Mathematics", questionCount: 10 },
    ],
  },
  {
    examId: "gate",
    examName: "GATE CS",
    totalQuestionsPerTest: 20,
    timeLimitMinutes: 40,
    sections: [
      { subjectId: "gate-cs", subjectName: "Computer Science", questionCount: 14 },
      { subjectId: "gate-aptitude", subjectName: "General Aptitude", questionCount: 3 },
      { subjectId: "gate-engineering-math", subjectName: "Engineering Math", questionCount: 3 },
    ],
  },

  // Medical Exams
  {
    examId: "neet-ug",
    examName: "NEET UG",
    totalQuestionsPerTest: 30,
    timeLimitMinutes: 60,
    sections: [
      { subjectId: "neet-physics", subjectName: "Physics", questionCount: 10 },
      { subjectId: "neet-chemistry", subjectName: "Chemistry", questionCount: 10 },
      { subjectId: "neet-biology", subjectName: "Biology", questionCount: 10 },
    ],
  },
  {
    examId: "neet-pg",
    examName: "NEET PG",
    totalQuestionsPerTest: 30,
    timeLimitMinutes: 60,
    sections: [
      { subjectId: "neet-pg-medicine", subjectName: "Medicine", questionCount: 10 },
      { subjectId: "neet-pg-surgery", subjectName: "Surgery", questionCount: 10 },
      { subjectId: "neet-pg-obs-gyn", subjectName: "Obs & Gynae", questionCount: 10 },
    ],
  },

  // Civil Services
  {
    examId: "upsc-cse",
    examName: "UPSC CSE Prelims",
    totalQuestionsPerTest: 25,
    timeLimitMinutes: 50,
    sections: [
      { subjectId: "upsc-polity", subjectName: "Polity", questionCount: 5 },
      { subjectId: "upsc-history", subjectName: "History", questionCount: 5 },
      { subjectId: "upsc-geography", subjectName: "Geography", questionCount: 5 },
      { subjectId: "upsc-economy", subjectName: "Economy", questionCount: 5 },
      { subjectId: "upsc-science", subjectName: "Science", questionCount: 5 },
    ],
  },

  // Banking & SSC
  {
    examId: "ssc-cgl",
    examName: "SSC CGL",
    totalQuestionsPerTest: 25,
    timeLimitMinutes: 40,
    sections: [
      { subjectId: "ssc-quant", subjectName: "Quantitative Aptitude", questionCount: 7 },
      { subjectId: "ssc-reasoning", subjectName: "Reasoning", questionCount: 6 },
      { subjectId: "ssc-english", subjectName: "English", questionCount: 6 },
      { subjectId: "ssc-gk", subjectName: "General Knowledge", questionCount: 6 },
    ],
  },
  {
    examId: "ssc-chsl",
    examName: "SSC CHSL",
    totalQuestionsPerTest: 25,
    timeLimitMinutes: 40,
    sections: [
      { subjectId: "ssc-quant", subjectName: "Quantitative Aptitude", questionCount: 7 },
      { subjectId: "ssc-reasoning", subjectName: "Reasoning", questionCount: 6 },
      { subjectId: "ssc-english", subjectName: "English", questionCount: 6 },
      { subjectId: "ssc-gk", subjectName: "General Knowledge", questionCount: 6 },
    ],
  },
  {
    examId: "ibps-po",
    examName: "IBPS PO",
    totalQuestionsPerTest: 25,
    timeLimitMinutes: 40,
    sections: [
      { subjectId: "ibps-quant", subjectName: "Quantitative Aptitude", questionCount: 6 },
      { subjectId: "ibps-reasoning", subjectName: "Reasoning", questionCount: 6 },
      { subjectId: "ibps-english", subjectName: "English", questionCount: 7 },
      { subjectId: "ibps-gk", subjectName: "General Awareness", questionCount: 6 },
    ],
  },
  {
    examId: "sbi-po",
    examName: "SBI PO",
    totalQuestionsPerTest: 25,
    timeLimitMinutes: 40,
    sections: [
      { subjectId: "sbi-quant", subjectName: "Quantitative Aptitude", questionCount: 6 },
      { subjectId: "sbi-reasoning", subjectName: "Reasoning", questionCount: 6 },
      { subjectId: "sbi-english", subjectName: "English", questionCount: 7 },
      { subjectId: "sbi-gk", subjectName: "General Awareness", questionCount: 6 },
    ],
  },
  {
    examId: "ibps-clerk",
    examName: "IBPS Clerk",
    totalQuestionsPerTest: 25,
    timeLimitMinutes: 40,
    sections: [
      { subjectId: "ibps-clerk-quant", subjectName: "Quantitative Aptitude", questionCount: 7 },
      { subjectId: "ibps-clerk-reasoning", subjectName: "Reasoning", questionCount: 6 },
      { subjectId: "ibps-clerk-english", subjectName: "English", questionCount: 6 },
      { subjectId: "ibps-clerk-computer", subjectName: "Computer", questionCount: 6 },
    ],
  },
  {
    examId: "rbi-grade-b",
    examName: "RBI Grade B",
    totalQuestionsPerTest: 25,
    timeLimitMinutes: 50,
    sections: [
      { subjectId: "rbi-quant", subjectName: "Quantitative Aptitude", questionCount: 6 },
      { subjectId: "rbi-reasoning", subjectName: "Reasoning", questionCount: 6 },
      { subjectId: "rbi-english", subjectName: "English", questionCount: 7 },
      { subjectId: "rbi-ga", subjectName: "General Awareness", questionCount: 6 },
    ],
  },

  // Law
  {
    examId: "clat",
    examName: "CLAT",
    totalQuestionsPerTest: 25,
    timeLimitMinutes: 50,
    sections: [
      { subjectId: "clat-english", subjectName: "English", questionCount: 6 },
      { subjectId: "clat-gk", subjectName: "Current Affairs & GK", questionCount: 6 },
      { subjectId: "clat-legal", subjectName: "Legal Reasoning", questionCount: 7 },
      { subjectId: "clat-logical", subjectName: "Logical Reasoning", questionCount: 6 },
    ],
  },

  // MBA
  {
    examId: "cat",
    examName: "CAT",
    totalQuestionsPerTest: 20,
    timeLimitMinutes: 40,
    sections: [
      { subjectId: "cat-quant", subjectName: "Quantitative Aptitude", questionCount: 7 },
      { subjectId: "cat-varc", subjectName: "Verbal Ability & RC", questionCount: 7 },
      { subjectId: "cat-dilr", subjectName: "Data Interpretation & LR", questionCount: 6 },
    ],
  },
  {
    examId: "xat",
    examName: "XAT",
    totalQuestionsPerTest: 20,
    timeLimitMinutes: 40,
    sections: [
      { subjectId: "xat-quant", subjectName: "Quantitative Aptitude", questionCount: 7 },
      { subjectId: "xat-verbal", subjectName: "Verbal Ability", questionCount: 7 },
      { subjectId: "xat-decision", subjectName: "Decision Making", questionCount: 6 },
    ],
  },
];

/**
 * Calculate how many mock tests are available for an exam
 * based on current question bank size
 */
export async function calculateAvailableMockTests(
  examId: string
): Promise<number> {
  const template = mockTestTemplates.find((t) => t.examId === examId);
  if (!template) return 0;

  // Get total questions available for this exam across all subjects
  const totalQuestions = await countQuestions(examId);
  const questionsPerTest = template.totalQuestionsPerTest;

  // Calculate max tests (each test needs unique questions)
  // Leave 20% buffer for variety
  const maxTests = Math.floor((totalQuestions * 0.8) / questionsPerTest);

  return maxTests;
}

/**
 * Calculate available tests for each subject in the exam
 * to ensure minimum questions are available per subject
 */
export async function calculateDetailedAvailability(
  examId: string
): Promise<{
  totalTests: number;
  limitingSubject: string | null;
  subjectAvailability: Record<string, number>;
}> {
  const template = mockTestTemplates.find((t) => t.examId === examId);
  if (!template) {
    return { totalTests: 0, limitingSubject: null, subjectAvailability: {} };
  }

  const subjectAvailability: Record<string, number> = {};
  let minTests = Infinity;
  let limitingSubject: string | null = null;

  // Check each subject
  for (const section of template.sections) {
    const available = await countQuestions(examId, section.subjectId);
    const testsFromSubject = Math.floor((available * 0.8) / section.questionCount);

    subjectAvailability[section.subjectId] = testsFromSubject;

    if (testsFromSubject < minTests) {
      minTests = testsFromSubject;
      limitingSubject = section.subjectName;
    }
  }

  return {
    totalTests: minTests === Infinity ? 0 : minTests,
    limitingSubject,
    subjectAvailability,
  };
}

/**
 * Get all available mock tests for an exam (with test numbers)
 */
export async function getDynamicMockTestConfigs(
  examId: string
): Promise<DynamicMockTestConfig[]> {
  const template = mockTestTemplates.find((t) => t.examId === examId);
  if (!template) return [];

  const { totalTests, subjectAvailability } = await calculateDetailedAvailability(examId);

  // Get total questions for display
  const totalQuestionsAvailable = await countQuestions(examId);

  // Generate configs for each available test
  const configs: DynamicMockTestConfig[] = [];
  for (let i = 1; i <= totalTests; i++) {
    configs.push({
      ...template,
      testNumber: i,
      availableTests: totalTests,
      totalQuestionsAvailable,
    });
  }

  return configs;
}

/**
 * Get specific mock test config by exam ID and test number
 */
export async function getDynamicMockTestConfig(
  examId: string,
  testNumber: number
): Promise<DynamicMockTestConfig | null> {
  const configs = await getDynamicMockTestConfigs(examId);
  return configs.find((c) => c.testNumber === testNumber) || null;
}

/**
 * Get all exams with available mock tests
 */
export async function getAllAvailableMockTests(): Promise<
  Array<{
    examId: string;
    examName: string;
    availableTests: number;
    totalQuestions: number;
  }>
> {
  const results: Array<{
    examId: string;
    examName: string;
    availableTests: number;
    totalQuestions: number;
  }> = [];

  for (const template of mockTestTemplates) {
    const { totalTests } = await calculateDetailedAvailability(template.examId);

    if (totalTests > 0) {
      const totalQuestions = await countQuestions(template.examId);

      results.push({
        examId: template.examId,
        examName: template.examName,
        availableTests: totalTests,
        totalQuestions,
      });
    }
  }

  return results;
}
