/**
 * Dynamic Mock Test Generator
 * Generates unlimited mock tests on-the-fly using the 40,000+ question bank
 * Replaces static mock-test-config.ts with intelligent question selection
 */

import { getCachedQuestions } from './db';

export interface DynamicMockTestConfig {
  examId: string;
  examName: string;
  testNumber: number;
  totalQuestions: number;
  timeLimitMinutes: number;
  sections: {
    subjectId: string;
    subjectName: string;
    questionCount: number;
  }[];
}

// Exam-to-subject mapping (defines which subjects each exam tests)
const examSubjectMapping: Record<string, { subjectId: string; subjectName: string; weight: number }[]> = {
  "jee-main": [
    { subjectId: "jee-physics", subjectName: "Physics", weight: 1 },
    { subjectId: "jee-chemistry", subjectName: "Chemistry", weight: 1 },
    { subjectId: "jee-maths", subjectName: "Mathematics", weight: 1 },
  ],
  "jee-advanced": [
    { subjectId: "jee-adv-physics", subjectName: "Physics", weight: 1 },
    { subjectId: "jee-adv-chemistry", subjectName: "Chemistry", weight: 1 },
    { subjectId: "jee-adv-maths", subjectName: "Mathematics", weight: 1 },
  ],
  "neet-ug": [
    { subjectId: "neet-physics", subjectName: "Physics", weight: 1 },
    { subjectId: "neet-chemistry", subjectName: "Chemistry", weight: 1 },
    { subjectId: "neet-biology", subjectName: "Biology", weight: 1 },
  ],
  "upsc-cse": [
    { subjectId: "upsc-polity", subjectName: "Polity", weight: 1 },
    { subjectId: "upsc-history", subjectName: "History", weight: 1 },
    { subjectId: "upsc-geography", subjectName: "Geography", weight: 1 },
    { subjectId: "upsc-economy", subjectName: "Economy", weight: 1 },
    { subjectId: "upsc-science", subjectName: "Science", weight: 1 },
  ],
  "gate": [
    { subjectId: "gate-cs", subjectName: "Computer Science", weight: 2 },
    { subjectId: "gate-aptitude", subjectName: "General Aptitude", weight: 0.5 },
    { subjectId: "gate-engineering-math", subjectName: "Engineering Math", weight: 0.5 },
  ],
  "ssc-cgl": [
    { subjectId: "ssc-quant", subjectName: "Quantitative Aptitude", weight: 1 },
    { subjectId: "ssc-reasoning", subjectName: "Reasoning", weight: 1 },
    { subjectId: "ssc-english", subjectName: "English", weight: 1 },
    { subjectId: "ssc-gk", subjectName: "General Knowledge", weight: 1 },
  ],
  "ssc-chsl": [
    { subjectId: "ssc-quant", subjectName: "Quantitative Aptitude", weight: 1 },
    { subjectId: "ssc-reasoning", subjectName: "Reasoning", weight: 1 },
    { subjectId: "ssc-english", subjectName: "English", weight: 1 },
    { subjectId: "ssc-gk", subjectName: "General Knowledge", weight: 1 },
  ],
  "ibps-po": [
    { subjectId: "ibps-quant", subjectName: "Quantitative Aptitude", weight: 1 },
    { subjectId: "ibps-reasoning", subjectName: "Reasoning", weight: 1 },
    { subjectId: "ibps-english", subjectName: "English", weight: 1 },
    { subjectId: "ibps-gk", subjectName: "General Awareness", weight: 1 },
  ],
  "sbi-po": [
    { subjectId: "sbi-quant", subjectName: "Quantitative Aptitude", weight: 1 },
    { subjectId: "sbi-reasoning", subjectName: "Reasoning", weight: 1 },
    { subjectId: "sbi-english", subjectName: "English", weight: 1 },
    { subjectId: "sbi-gk", subjectName: "General Awareness", weight: 1 },
  ],
  "cat": [
    { subjectId: "cat-quant", subjectName: "Quantitative Aptitude", weight: 1 },
    { subjectId: "cat-varc", subjectName: "Verbal Ability & RC", weight: 1 },
    { subjectId: "cat-dilr", subjectName: "Data Interpretation & LR", weight: 1 },
  ],
  // Add more exams as needed...
};

// Default pattern for exams not explicitly mapped
const defaultExamPattern = {
  questionsPerTest: 25,
  timeLimitMinutes: 40,
  sectionsCount: 3,
};

/**
 * Check how many questions are available for a given exam and subject
 * Uses getCachedQuestions to sample the available questions
 */
export async function getAvailableQuestionCount(examId: string, subjectId: string): Promise<number> {
  try {
    // Try to get a large sample to estimate total count
    // Use actual examId to find questions in database
    const sampleQuestions = await getCachedQuestions(examId, subjectId, '', 'mixed', 1000);
    return sampleQuestions.length;
  } catch (error) {
    console.error(`Error counting questions for ${subjectId}:`, error);
    return 0;
  }
}

/**
 * Calculate maximum number of unique tests deliverable for an exam from the
 * cached question pool. Returns 0 if there isn't enough material — DO NOT
 * inflate this number; the UI uses it to decide how many test buttons to
 * render, and lying here causes "no test available" errors on click.
 *
 * The API route combines this with the count of hand-curated static configs
 * to compute the final per-exam capacity.
 */
export async function calculateMaxTestsAvailable(examId: string): Promise<number> {
  const subjects = examSubjectMapping[examId];

  // Unknown exam — no dynamic capacity. Caller falls back to static configs.
  if (!subjects) return 0;

  // Bottleneck-aware: each test must satisfy every section, so the available
  // count is the minimum across subjects of (cached_questions / per-section need).
  const subjectCounts = await Promise.all(
    subjects.map(async (subject) => {
      const count = await getAvailableQuestionCount(examId, subject.subjectId);
      const questionsNeeded = Math.max(
        1,
        Math.ceil((defaultExamPattern.questionsPerTest / subjects.length) * subject.weight)
      );
      return Math.floor(count / questionsNeeded);
    })
  );

  if (subjectCounts.length === 0) return 0;
  const maxTests = Math.min(...subjectCounts);
  // Hard cap to a sensible UI count regardless of how big the cache grows.
  return Math.max(0, Math.min(maxTests, 20));
}

/**
 * Generate dynamic mock test configuration
 * Creates unique test variants by intelligently selecting different questions
 */
export async function generateDynamicMockTest(
  examId: string,
  testNumber: number,
  isFullLength: boolean = false
): Promise<DynamicMockTestConfig | null> {

  const subjects = examSubjectMapping[examId];

  if (!subjects) {
    console.error(`No subject mapping found for exam: ${examId}`);
    return null;
  }

  // Calculate questions per section based on weights
  const totalWeight = subjects.reduce((sum, s) => sum + s.weight, 0);
  const baseQuestions = isFullLength ? 75 : defaultExamPattern.questionsPerTest;

  const sections = subjects.map(subject => {
    const questionCount = Math.round((baseQuestions * subject.weight) / totalWeight);
    return {
      subjectId: subject.subjectId,
      subjectName: subject.subjectName,
      questionCount: questionCount > 0 ? questionCount : 1, // Minimum 1 question per section
    };
  });

  const totalQuestions = sections.reduce((sum, s) => sum + s.questionCount, 0);
  const timeLimitMinutes = isFullLength
    ? Math.round(defaultExamPattern.timeLimitMinutes * 2.5)
    : defaultExamPattern.timeLimitMinutes;

  // Verify each section has enough questions
  for (const section of sections) {
    const availableCount = await getAvailableQuestionCount(examId, section.subjectId);
    if (availableCount < section.questionCount) {
      console.warn(
        `Subject ${section.subjectId} only has ${availableCount} questions but needs ${section.questionCount}`
      );
      // Adjust if needed
      if (availableCount === 0) {
        return null; // Cannot create test
      }
      section.questionCount = Math.min(section.questionCount, availableCount);
    }
  }

  return {
    examId,
    examName: getExamNameById(examId),
    testNumber,
    totalQuestions,
    timeLimitMinutes,
    sections,
  };
}

/**
 * Get exam name from exam ID
 */
function getExamNameById(examId: string): string {
  const examNames: Record<string, string> = {
    "jee-main": "JEE Main",
    "jee-advanced": "JEE Advanced",
    "neet-ug": "NEET UG",
    "upsc-cse": "UPSC CSE Prelims",
    "gate": "GATE CS",
    "ssc-cgl": "SSC CGL",
    "ssc-chsl": "SSC CHSL",
    "ibps-po": "IBPS PO",
    "sbi-po": "SBI PO",
    "cat": "CAT",
    "ibps-clerk": "IBPS Clerk",
    "rbi-grade-b": "RBI Grade B",
    "clat": "CLAT",
    "xat": "XAT",
    "nda": "NDA",
    "cds": "CDS",
    "ugc-net": "UGC NET",
    "ctet": "CTET",
    "rrb-ntpc": "RRB NTPC",
    "rrb-group-d": "RRB Group D",
    "uppsc": "UPPSC",
    "mppsc": "MPPSC",
    "delhi-police": "Delhi Police",
    "nift": "NIFT",
    "ca-foundation": "CA Foundation",
    "ailet": "AILET",
    "cs-foundation": "CS Foundation",
    "nid": "NID DAT",
    "nata": "NATA",
    "nchmct": "NCHMCT JEE",
    "htet": "HTET",
    "uptet": "UPTET",
    "rtet": "RTET",
    "kvs": "KVS",
    "dsssb": "DSSSB",
    "up-police": "UP Police",
    "cisf": "CISF",
    "bpsc": "BPSC",
    "rpsc": "RPSC",
    "lic-aao": "LIC AAO",
    "afcat": "AFCAT",
    "indian-navy": "Indian Navy",
    "rrb-alp": "RRB ALP",
    "rrb-je": "RRB JE",
    "postal-assistant": "Postal Assistant",
    "gds": "GDS",
    "tnpsc": "TNPSC",
    "kpsc": "KPSC",
    "wbpsc": "WBPSC",
    "ifs": "IFS",
    "judicial-services": "Judicial Services",
    "iimc": "IIMC",
    "aiims-nursing": "AIIMS Nursing",
    "gpat": "GPAT",
    "icar-aieea": "ICAR AIEEA",
    "isi": "ISI Admission Test",
    "aipvt": "AIPVT",
    "indian-army": "Indian Army",
    "neet-pg": "NEET PG",
  };
  return examNames[examId] || examId.toUpperCase();
}

/**
 * Get list of all available dynamic mock tests for display
 * Shows up to maxTests per exam
 */
export async function getAllDynamicMockTests(): Promise<DynamicMockTestConfig[]> {
  const allTests: DynamicMockTestConfig[] = [];

  for (const examId of Object.keys(examSubjectMapping)) {
    const maxTests = await calculateMaxTestsAvailable(examId);

    // Generate first test config as template (others will be identical structure, different questions)
    const templateConfig = await generateDynamicMockTest(examId, 1, false);

    if (templateConfig) {
      // Show up to 10 tests per exam (UI will display them dynamically)
      const testsToShow = Math.min(maxTests, 10);
      for (let i = 1; i <= testsToShow; i++) {
        allTests.push({
          ...templateConfig,
          testNumber: i,
        });
      }
    }
  }

  return allTests;
}

/**
 * Select unique questions for a mock test
 * Uses smart randomization with seed based on testNumber to ensure consistency
 */
export async function selectQuestionsForMockTest(
  examId: string,
  testNumber: number,
  isFullLength: boolean = false
): Promise<any[]> {
  const config = await generateDynamicMockTest(examId, testNumber, isFullLength);

  if (!config) {
    throw new Error(`Cannot generate mock test for exam: ${examId}`);
  }

  const allQuestions: any[] = [];

  // Select questions for each section
  for (const section of config.sections) {
    try {
      // Get questions from cache using actual examId
      // Pass empty string for topic to match all topics in this subject
      const cached = await getCachedQuestions(examId, section.subjectId, '', 'mixed', section.questionCount * 20);

      if (cached.length > 0) {
        // Use deterministic selection based on testNumber
        const offset = ((testNumber - 1) * section.questionCount) % cached.length;
        const selectedQuestions = [];

        for (let i = 0; i < section.questionCount && i < cached.length; i++) {
          const index = (offset + i) % cached.length;
          const q = cached[index];

          selectedQuestions.push({
            question: q.question,
            options: Array.isArray(q.options) ? q.options : JSON.parse(q.options),
            correctAnswer: q.correctAnswer ?? q.correct_answer,
            explanation: q.explanation || '',
            difficulty: q.difficulty || 'medium',
            subjectId: section.subjectId,
            subjectName: section.subjectName,
          });
        }

        allQuestions.push(...selectedQuestions);
      }
    } catch (error) {
      console.error(`Error fetching questions for ${section.subjectId}:`, error);
    }
  }

  // Shuffle questions for variety
  return shuffleArray(allQuestions);
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get mock test statistics for an exam
 */
export async function getMockTestStats(examId: string): Promise<{
  availableTests: number;
  totalQuestions: number;
  averageTimeMinutes: number;
}> {
  const maxTests = await calculateMaxTestsAvailable(examId);
  const config = await generateDynamicMockTest(examId, 1, false);

  return {
    availableTests: maxTests,
    totalQuestions: config?.totalQuestions || 0,
    averageTimeMinutes: config?.timeLimitMinutes || 0,
  };
}
