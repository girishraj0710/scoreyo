// English Learning Content Structure
// Foundation: A1-B1 (43 topics) | Advanced: B2-C1 (22 topics)

import { foundationPathComplete, getAllFoundationTopics } from './english-foundation-complete-43';
import { advancedEnglishPath, getAllAdvancedTopics, getAdvancedModules } from './english-advanced-path';

export type EnglishLevel = "beginner" | "intermediate" | "advanced";
export type EnglishGoal = "ielts-toefl" | "foundation" | "advanced" | "real-world";

export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface EnglishTopic {
  id: string;
  name: string;
  description: string;
  icon: string;
  level: EnglishLevel;
  cefrLevel?: CEFRLevel; // Precise CEFR level for grouping/badges
  category: EnglishGoal;
  subtopics: string[];
  estimatedTime: number; // minutes
  questionCount: number;
}

export interface EnglishPath {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  goal: EnglishGoal;
  topics: EnglishTopic[];
  totalQuestions: number;
  estimatedWeeks: number;
}

// A group of topics within a path (Module 1, Module 2, ...). Used by the track
// UI to render module-grouped cards.
export interface EnglishModule {
  id: string;
  name: string;
  description: string;
  topics: EnglishTopic[];
}

// Flatten all modules into topics arrays
const foundationTopics: EnglishTopic[] = getAllFoundationTopics(); // 43 topics (A1-B1)
const advancedTopics: EnglishTopic[] = getAllAdvancedTopics(); // 22 topics (B2-C1)

// English Learning Paths
export const englishPaths: EnglishPath[] = [
  {
    id: "foundation",
    name: foundationPathComplete.name,
    description: foundationPathComplete.description,
    icon: foundationPathComplete.icon,
    color: foundationPathComplete.color,
    goal: "foundation",
    totalQuestions: foundationPathComplete.totalQuestions,
    estimatedWeeks: foundationPathComplete.estimatedWeeks,
    topics: foundationTopics, // ✅ 43 topics (A1-B1 complete)
  },
  {
    id: "advanced",
    name: advancedEnglishPath.name,
    description: advancedEnglishPath.description,
    icon: advancedEnglishPath.icon,
    color: advancedEnglishPath.color,
    goal: "advanced",
    totalQuestions: advancedEnglishPath.totalQuestions,
    estimatedWeeks: advancedEnglishPath.estimatedWeeks,
    topics: advancedTopics, // ✅ 22 topics (B2-C1 advanced)
  },
  {
    id: "ielts-toefl",
    name: "IELTS & TOEFL Preparation",
    description: "Complete preparation for international English tests",
    icon: "🌍",
    color: "#8B5CF6",
    goal: "ielts-toefl",
    totalQuestions: 600,
    estimatedWeeks: 12,
    topics: [
      {
        id: "ielts-reading",
        name: "IELTS Reading",
        description: "Academic passages, True/False/Not Given, Matching headings",
        icon: "📰",
        level: "advanced",
        category: "ielts-toefl",
        subtopics: [
          "Multiple Choice",
          "True/False/Not Given",
          "Matching Headings",
          "Matching Information",
          "Sentence Completion",
          "Summary Completion",
        ],
        estimatedTime: 150,
        questionCount: 120,
      },
      {
        id: "ielts-writing",
        name: "IELTS Writing",
        description: "Task 1 (Data description) and Task 2 (Essay writing)",
        icon: "✏️",
        level: "advanced",
        category: "ielts-toefl",
        subtopics: [
          "Task 1: Line Graphs",
          "Task 1: Bar Charts",
          "Task 1: Pie Charts",
          "Task 1: Tables",
          "Task 2: Opinion Essays",
          "Task 2: Discussion Essays",
          "Task 2: Problem-Solution Essays",
        ],
        estimatedTime: 120,
        questionCount: 50,
      },
      {
        id: "ielts-listening",
        name: "IELTS Listening",
        description: "British, Australian accents, Form filling, Note completion",
        icon: "🎧",
        level: "intermediate",
        category: "ielts-toefl",
        subtopics: [
          "Form Filling",
          "Note Completion",
          "Multiple Choice",
          "Matching",
          "Map/Diagram Labeling",
        ],
        estimatedTime: 100,
        questionCount: 80,
      },
      {
        id: "ielts-speaking",
        name: "IELTS Speaking",
        description: "Part 1 (Introduction), Part 2 (Cue card), Part 3 (Discussion)",
        icon: "🎤",
        level: "advanced",
        category: "ielts-toefl",
        subtopics: [
          "Part 1: Personal Questions",
          "Part 2: Cue Card Topics",
          "Part 3: Abstract Discussion",
          "Pronunciation Practice",
          "Fluency Training",
        ],
        estimatedTime: 90,
        questionCount: 60,
      },
      {
        id: "toefl-integrated",
        name: "TOEFL Integrated Tasks",
        description: "Reading + Listening combined tasks",
        icon: "🔗",
        level: "advanced",
        category: "ielts-toefl",
        subtopics: [
          "Integrated Writing",
          "Integrated Speaking",
          "Academic Discussions",
          "Email Writing",
        ],
        estimatedTime: 100,
        questionCount: 50,
      },
      {
        id: "ielts-academic-vocabulary",
        name: "Academic Vocabulary (IELTS/TOEFL)",
        description: "3000+ essential academic words for IELTS/TOEFL",
        icon: "🎓",
        level: "intermediate",
        category: "ielts-toefl",
        subtopics: [
          "Academic Word List",
          "Subject-specific Terms",
          "Collocations",
          "Formal vs Informal",
        ],
        estimatedTime: 150,
        questionCount: 240,
      },
    ],
  },
  {
    id: "real-world",
    name: "Real-World English",
    description: "Practical English for daily life and work",
    icon: "💼",
    color: "#F59E0B",
    goal: "real-world",
    totalQuestions: 300,
    estimatedWeeks: 4,
    topics: [
      {
        id: "job-interviews",
        name: "Job Interview English",
        description: "Common questions, professional responses, confidence building",
        icon: "👔",
        level: "intermediate",
        category: "real-world",
        subtopics: [
          "Tell Me About Yourself",
          "Strengths & Weaknesses",
          "Why Should We Hire You",
          "Behavioral Questions",
          "Technical Questions",
        ],
        estimatedTime: 60,
        questionCount: 50,
      },
      {
        id: "daily-conversations",
        name: "Daily Conversations",
        description: "Shopping, banking, doctor, travel scenarios",
        icon: "🛒",
        level: "beginner",
        category: "real-world",
        subtopics: [
          "Shopping & Bargaining",
          "Bank Transactions",
          "Doctor Appointments",
          "Restaurant Orders",
          "Travel & Directions",
        ],
        estimatedTime: 80,
        questionCount: 80,
      },
      {
        id: "email-writing",
        name: "Email Writing",
        description: "Formal and informal emails for work and personal use",
        icon: "📧",
        level: "intermediate",
        category: "real-world",
        subtopics: [
          "Formal Business Emails",
          "Informal Personal Emails",
          "Complaint Emails",
          "Request Emails",
          "Thank You Emails",
        ],
        estimatedTime: 70,
        questionCount: 60,
      },
      {
        id: "presentations",
        name: "Presentations & Public Speaking",
        description: "Deliver confident presentations in English",
        icon: "🎙️",
        level: "advanced",
        category: "real-world",
        subtopics: [
          "Opening & Closing",
          "Structuring Presentations",
          "Visual Aids",
          "Handling Questions",
          "Voice Modulation",
        ],
        estimatedTime: 50,
        questionCount: 40,
      },
      {
        id: "business-english",
        name: "Business English",
        description: "Professional communication, meetings, reports",
        icon: "💻",
        level: "advanced",
        category: "real-world",
        subtopics: [
          "Meeting Vocabulary",
          "Report Writing",
          "Negotiation Skills",
          "Phone Etiquette",
        ],
        estimatedTime: 60,
        questionCount: 70,
      },
    ],
  },
];

// Quick level assessment questions (20 questions covering all major topics)
export const levelAssessmentQuestions = [
  // BEGINNER QUESTIONS (1-7)
  {
    question: "Choose the correct sentence:",
    options: [
      "She don't like coffee",
      "She doesn't likes coffee",
      "She doesn't like coffee",
      "She not like coffee",
    ],
    correctAnswer: 2,
    level: "beginner",
    topic: "Grammar - Subject-Verb Agreement",
  },
  {
    question: "What is the plural of 'child'?",
    options: [
      "childs",
      "childes",
      "children",
      "childrens",
    ],
    correctAnswer: 2,
    level: "beginner",
    topic: "Nouns - Irregular Plurals",
  },
  {
    question: "Choose the correct article: 'I saw ___ elephant at the zoo.'",
    options: [
      "a",
      "an",
      "the",
      "no article",
    ],
    correctAnswer: 1,
    level: "beginner",
    topic: "Articles",
  },
  {
    question: "Which sentence is in Present Continuous tense?",
    options: [
      "I study every day",
      "I am studying now",
      "I studied yesterday",
      "I will study tomorrow",
    ],
    correctAnswer: 1,
    level: "beginner",
    topic: "Tenses - Present Continuous",
  },
  {
    question: "What is the opposite of 'big'?",
    options: [
      "huge",
      "small",
      "large",
      "tall",
    ],
    correctAnswer: 1,
    level: "beginner",
    topic: "Vocabulary - Antonyms",
  },
  {
    question: "Choose the correct pronoun: '___ is my book.'",
    options: [
      "These",
      "Those",
      "This",
      "Them",
    ],
    correctAnswer: 2,
    level: "beginner",
    topic: "Pronouns - Demonstrative",
  },
  {
    question: "Which word is an adjective?",
    options: [
      "quickly",
      "run",
      "beautiful",
      "happiness",
    ],
    correctAnswer: 2,
    level: "beginner",
    topic: "Parts of Speech - Adjectives",
  },

  // INTERMEDIATE QUESTIONS (8-14)
  {
    question: "Choose the correct form: 'I _____ in Mumbai for 5 years.'",
    options: [
      "live",
      "am living",
      "have lived",
      "lived",
    ],
    correctAnswer: 2,
    level: "intermediate",
    topic: "Tenses - Present Perfect",
  },
  {
    question: "What does 'ubiquitous' mean?",
    options: [
      "Very rare",
      "Present everywhere",
      "Extremely large",
      "Highly unusual",
    ],
    correctAnswer: 1,
    level: "intermediate",
    topic: "Vocabulary - Advanced Words",
  },
  {
    question: "Convert to passive: 'They are building a new bridge.'",
    options: [
      "A new bridge is building by them",
      "A new bridge is being built by them",
      "A new bridge was built by them",
      "A new bridge has been built by them",
    ],
    correctAnswer: 1,
    level: "intermediate",
    topic: "Grammar - Active/Passive Voice",
  },
  {
    question: "Choose the correct phrasal verb: 'Please _____ the lights when you leave.'",
    options: [
      "turn off",
      "turn on",
      "turn up",
      "turn down",
    ],
    correctAnswer: 0,
    level: "intermediate",
    topic: "Phrasal Verbs",
  },
  {
    question: "Which sentence uses the correct comparative form?",
    options: [
      "This book is more better than that one",
      "This book is better than that one",
      "This book is more good than that one",
      "This book is gooder than that one",
    ],
    correctAnswer: 1,
    level: "intermediate",
    topic: "Grammar - Comparatives",
  },
  {
    question: "What does the idiom 'break the ice' mean?",
    options: [
      "To damage something frozen",
      "To start a conversation in an awkward situation",
      "To work very hard",
      "To give up easily",
    ],
    correctAnswer: 1,
    level: "intermediate",
    topic: "Idioms & Expressions",
  },
  {
    question: "Choose the correct preposition: 'She is good ___ mathematics.'",
    options: [
      "in",
      "at",
      "on",
      "with",
    ],
    correctAnswer: 1,
    level: "intermediate",
    topic: "Prepositions",
  },

  // ADVANCED QUESTIONS (15-20)
  {
    question: "Choose the best phrase: 'Despite _____ extensively, the team failed to achieve the desired outcome.'",
    options: [
      "to prepare",
      "preparing",
      "prepared",
      "preparation",
    ],
    correctAnswer: 1,
    level: "advanced",
    topic: "Grammar - Gerunds and Infinitives",
  },
  {
    question: "Identify the error: 'Having finished the report, the meeting was attended by John.'",
    options: [
      "No error",
      "Dangling modifier - 'the meeting' didn't finish the report",
      "Wrong tense",
      "Missing article",
    ],
    correctAnswer: 1,
    level: "advanced",
    topic: "Grammar - Modifiers",
  },
  {
    question: "Which word is closest in meaning to 'meticulous'?",
    options: [
      "Careless",
      "Quick",
      "Extremely careful and precise",
      "Confused",
    ],
    correctAnswer: 2,
    level: "advanced",
    topic: "Vocabulary - Synonyms",
  },
  {
    question: "Convert to reported speech: 'She said, \"I will call you tomorrow.\"'",
    options: [
      "She said that she will call me tomorrow",
      "She said that she would call me the next day",
      "She said that she will call you tomorrow",
      "She says that she would call me the next day",
    ],
    correctAnswer: 1,
    level: "advanced",
    topic: "Grammar - Reported Speech",
  },
  {
    question: "Which sentence demonstrates correct use of subjunctive mood?",
    options: [
      "I wish I was rich",
      "I wish I am rich",
      "I wish I were rich",
      "I wish I been rich",
    ],
    correctAnswer: 2,
    level: "advanced",
    topic: "Grammar - Subjunctive Mood",
  },
  {
    question: "Choose the sentence with correct parallel structure:",
    options: [
      "She likes reading, to swim, and hiking",
      "She likes reading, swimming, and to hike",
      "She likes reading, swimming, and hiking",
      "She likes to read, swimming, and hiking",
    ],
    correctAnswer: 2,
    level: "advanced",
    topic: "Grammar - Parallel Structure",
  },
];

// Helper functions
export function getPathById(pathId: string): EnglishPath | undefined {
  return englishPaths.find((p) => p.id === pathId);
}

export function getTopicById(pathId: string, topicId: string): EnglishTopic | undefined {
  const path = getPathById(pathId);
  return path?.topics.find((t) => t.id === topicId);
}

export function getAllTopics(): EnglishTopic[] {
  return englishPaths.flatMap((path) => path.topics);
}

// Returns the module grouping for a path so the UI can render module-based
// sections. Foundation and Advanced have real modules in their source
// libraries; IELTS/TOEFL and Real-world are flat, so each is wrapped in a
// single module using the path's own name/description.
export function getPathModules(pathId: string): EnglishModule[] {
  if (pathId === "foundation") {
    return foundationPathComplete.modules.map((m) => ({
      id: m.id,
      name: m.name,
      description: m.description,
      topics: m.topics as EnglishTopic[],
    }));
  }

  if (pathId === "advanced") {
    return getAdvancedModules().map((m) => ({
      id: m.id,
      name: m.name,
      description: m.description,
      topics: m.topics as EnglishTopic[],
    }));
  }

  const path = getPathById(pathId);
  if (!path) return [];
  return [
    {
      id: `${path.id}-all`,
      name: path.name,
      description: path.description,
      topics: path.topics,
    },
  ];
}

export function getTopicsByLevel(level: EnglishLevel): EnglishTopic[] {
  return getAllTopics().filter((topic) => topic.level === level);
}

export function getTopicsByGoal(goal: EnglishGoal): EnglishTopic[] {
  return getAllTopics().filter((topic) => topic.category === goal);
}

// Get user level from assessment score (out of 20 questions)
export function getUserLevelFromScore(score: number): EnglishLevel {
  // Beginner: 0-7 correct (0-35%)
  if (score <= 7) return "beginner";

  // Intermediate: 8-14 correct (40-70%)
  if (score <= 14) return "intermediate";

  // Advanced: 15-20 correct (75-100%)
  return "advanced";
}

// Get detailed assessment results
export function getDetailedAssessmentResults(userAnswers: number[]) {
  const topicScores: Record<string, { correct: number; total: number }> = {};
  let beginnerScore = 0;
  let intermediateScore = 0;
  let advancedScore = 0;

  levelAssessmentQuestions.forEach((q, idx) => {
    const isCorrect = userAnswers[idx] === q.correctAnswer;

    // Track by topic
    if (!topicScores[q.topic]) {
      topicScores[q.topic] = { correct: 0, total: 0 };
    }
    topicScores[q.topic].total++;
    if (isCorrect) {
      topicScores[q.topic].correct++;
    }

    // Track by level
    if (isCorrect) {
      if (q.level === "beginner") beginnerScore++;
      if (q.level === "intermediate") intermediateScore++;
      if (q.level === "advanced") advancedScore++;
    }
  });

  return {
    topicScores,
    levelScores: {
      beginner: { score: beginnerScore, total: 7 },
      intermediate: { score: intermediateScore, total: 7 },
      advanced: { score: advancedScore, total: 6 },
    },
  };
}
