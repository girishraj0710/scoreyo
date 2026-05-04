// Mock test configurations for each exam
// Defines how many questions per subject and total time

export interface MockTestConfig {
  examId: string;
  examName: string;
  totalQuestions: number;
  timeLimitMinutes: number;
  sections: {
    subjectId: string;
    subjectName: string;
    questionCount: number;
  }[];
}

export const mockTestConfigs: MockTestConfig[] = [
  {
    examId: "jee-main",
    examName: "JEE Main",
    totalQuestions: 30,
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
    totalQuestions: 30,
    timeLimitMinutes: 60,
    sections: [
      { subjectId: "jee-adv-physics", subjectName: "Physics", questionCount: 10 },
      { subjectId: "jee-adv-chemistry", subjectName: "Chemistry", questionCount: 10 },
      { subjectId: "jee-adv-maths", subjectName: "Mathematics", questionCount: 10 },
    ],
  },
  {
    examId: "neet-ug",
    examName: "NEET UG",
    totalQuestions: 30,
    timeLimitMinutes: 60,
    sections: [
      { subjectId: "neet-physics", subjectName: "Physics", questionCount: 10 },
      { subjectId: "neet-chemistry", subjectName: "Chemistry", questionCount: 10 },
      { subjectId: "neet-biology", subjectName: "Biology", questionCount: 10 },
    ],
  },
  {
    examId: "upsc-cse",
    examName: "UPSC CSE Prelims",
    totalQuestions: 25,
    timeLimitMinutes: 50,
    sections: [
      { subjectId: "upsc-polity", subjectName: "Polity", questionCount: 5 },
      { subjectId: "upsc-history", subjectName: "History", questionCount: 5 },
      { subjectId: "upsc-geography", subjectName: "Geography", questionCount: 5 },
      { subjectId: "upsc-economy", subjectName: "Economy", questionCount: 5 },
      { subjectId: "upsc-science", subjectName: "Science", questionCount: 5 },
    ],
  },
  {
    examId: "gate",
    examName: "GATE CS",
    totalQuestions: 20,
    timeLimitMinutes: 40,
    sections: [
      { subjectId: "gate-cs", subjectName: "Computer Science", questionCount: 14 },
      { subjectId: "gate-aptitude", subjectName: "General Aptitude", questionCount: 3 },
      { subjectId: "gate-engineering-math", subjectName: "Engineering Math", questionCount: 3 },
    ],
  },
  {
    examId: "ssc-cgl",
    examName: "SSC CGL",
    totalQuestions: 25,
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
    totalQuestions: 25,
    timeLimitMinutes: 40,
    sections: [
      { subjectId: "ibps-quant", subjectName: "Quantitative Aptitude", questionCount: 6 },
      { subjectId: "ibps-reasoning", subjectName: "Reasoning", questionCount: 6 },
      { subjectId: "ibps-english", subjectName: "English", questionCount: 7 },
      { subjectId: "ibps-gk", subjectName: "General Awareness", questionCount: 6 },
    ],
  },
  {
    examId: "cat",
    examName: "CAT",
    totalQuestions: 20,
    timeLimitMinutes: 40,
    sections: [
      { subjectId: "cat-quant", subjectName: "Quantitative Aptitude", questionCount: 7 },
      { subjectId: "cat-verbal", subjectName: "Verbal Ability", questionCount: 7 },
      { subjectId: "cat-dilr", subjectName: "Data Interpretation & LR", questionCount: 6 },
    ],
  },
];

export function getMockTestConfig(examId: string): MockTestConfig | undefined {
  return mockTestConfigs.find((c) => c.examId === examId);
}

export function getAllMockTestConfigs(): MockTestConfig[] {
  return mockTestConfigs;
}
