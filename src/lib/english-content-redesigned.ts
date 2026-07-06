// English Learning Content Structure - REDESIGNED
// Foundation: A1-B1 (32 topics) | Advanced: B2-C1 (14 topics) | IELTS/TOEFL (4 topics) | Real-world (2 topics)
// Total: 52 topics (down from 76)
// Redesigned: June 23, 2026

import { foundationPathRedesigned, getAllFoundationTopics } from './english-foundation-32';
import { advancedPathRedesigned, getAllAdvancedTopics } from './english-advanced-14';

export type EnglishLevel = "beginner" | "intermediate" | "advanced";
export type EnglishGoal = "ielts-toefl" | "foundation" | "advanced" | "real-world";

export interface EnglishTopic {
  id: string;
  name: string;
  description: string;
  icon: string;
  level: EnglishLevel;
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

// Flatten all modules into topics arrays
const foundationTopics: EnglishTopic[] = getAllFoundationTopics(); // 32 topics (A1-B1)
const advancedTopics: EnglishTopic[] = getAllAdvancedTopics(); // 14 topics (B2-C1)

// English Learning Paths - REDESIGNED
export const englishPaths: EnglishPath[] = [
  {
    id: "foundation",
    name: foundationPathRedesigned.name,
    description: foundationPathRedesigned.description,
    icon: foundationPathRedesigned.icon,
    color: foundationPathRedesigned.color,
    goal: "foundation",
    totalQuestions: foundationPathRedesigned.totalQuestions,
    estimatedWeeks: foundationPathRedesigned.estimatedWeeks,
    topics: foundationTopics, // ✅ 32 topics (A1-B1, Cambridge-aligned)
  },
  {
    id: "advanced",
    name: advancedPathRedesigned.name,
    description: advancedPathRedesigned.description,
    icon: advancedPathRedesigned.icon,
    color: advancedPathRedesigned.color,
    goal: "advanced",
    totalQuestions: advancedPathRedesigned.totalQuestions,
    estimatedWeeks: advancedPathRedesigned.estimatedWeeks,
    topics: advancedTopics, // ✅ 14 topics (B2-C1, professional/academic)
  },
  {
    id: "ielts-toefl",
    name: "IELTS & TOEFL Preparation",
    description: "Complete preparation for international English tests - consolidated skills",
    icon: "🌍",
    color: "#8B5CF6",
    goal: "ielts-toefl",
    totalQuestions: 380,
    estimatedWeeks: 8,
    topics: [
      {
        id: "ielts-toefl-reading",
        name: "IELTS/TOEFL Reading",
        description: "Academic passages, True/False/Not Given, multiple choice, vocabulary in context",
        icon: "📰",
        level: "advanced",
        category: "ielts-toefl",
        subtopics: [
          "IELTS: True/False/Not Given",
          "IELTS: Matching Headings",
          "IELTS: Multiple Choice",
          "TOEFL: Reading passages",
          "TOEFL: Inference questions",
          "Vocabulary in context",
        ],
        estimatedTime: 180,
        questionCount: 120,
      },
      {
        id: "ielts-toefl-writing",
        name: "IELTS/TOEFL Writing",
        description: "Task 1 (data description), Task 2 (essays), integrated tasks",
        icon: "✏️",
        level: "advanced",
        category: "ielts-toefl",
        subtopics: [
          "IELTS Task 1: Graphs, charts, tables",
          "IELTS Task 2: Opinion, discussion, problem-solution essays",
          "TOEFL Integrated Writing",
          "Essay structure and cohesion",
          "Academic tone",
        ],
        estimatedTime: 180,
        questionCount: 80,
      },
      {
        id: "ielts-toefl-listening",
        name: "IELTS/TOEFL Listening",
        description: "Form filling, note completion, academic lectures, conversations",
        icon: "🎧",
        level: "intermediate",
        category: "ielts-toefl",
        subtopics: [
          "IELTS: Form filling",
          "IELTS: Note completion",
          "IELTS: Multiple choice",
          "TOEFL: Academic lectures",
          "TOEFL: Conversations",
          "Accent recognition (British, American, Australian)",
        ],
        estimatedTime: 150,
        questionCount: 100,
      },
      {
        id: "ielts-toefl-speaking",
        name: "IELTS/TOEFL Speaking",
        description: "Part 1/2/3 (IELTS), integrated speaking (TOEFL), academic vocabulary",
        icon: "🎤",
        level: "advanced",
        category: "ielts-toefl",
        subtopics: [
          "IELTS Part 1: Personal questions",
          "IELTS Part 2: Cue card topics (2-minute speech)",
          "IELTS Part 3: Abstract discussion",
          "TOEFL Integrated Speaking",
          "TOEFL Independent Speaking",
          "Pronunciation and fluency",
        ],
        estimatedTime: 180,
        questionCount: 80,
      },
    ],
  },
  {
    id: "real-world",
    name: "Real-World English",
    description: "Practical English for work and daily life - consolidated scenarios",
    icon: "💼",
    color: "#F59E0B",
    goal: "real-world",
    totalQuestions: 220,
    estimatedWeeks: 2,
    topics: [
      {
        id: "workplace-communication",
        name: "Workplace Communication",
        description: "Job interviews, meetings, phone etiquette, professional emails, reports",
        icon: "👔",
        level: "intermediate",
        category: "real-world",
        subtopics: [
          "Job interview questions and answers",
          "Tell me about yourself",
          "Strengths and weaknesses",
          "Business meeting vocabulary",
          "Phone etiquette and voicemail",
          "Professional email writing",
          "Report writing for work",
        ],
        estimatedTime: 180,
        questionCount: 120,
      },
      {
        id: "social-travel-english",
        name: "Social & Travel English",
        description: "Daily scenarios - shopping, banking, doctor, travel, restaurant, social interactions",
        icon: "🛒",
        level: "beginner",
        category: "real-world",
        subtopics: [
          "Shopping and bargaining",
          "Bank transactions",
          "Doctor appointments",
          "Restaurant orders and complaints",
          "Travel and directions",
          "Hotel bookings",
          "Social conversations and small talk",
        ],
        estimatedTime: 150,
        questionCount: 100,
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
    options: ["childs", "childes", "children", "childrens"],
    correctAnswer: 2,
    level: "beginner",
    topic: "Nouns - Irregular Plurals",
  },
  {
    question: 'Choose the correct article: "I saw ___ elephant at the zoo."',
    options: ["a", "an", "the", "no article"],
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
    options: ["huge", "small", "large", "tall"],
    correctAnswer: 1,
    level: "beginner",
    topic: "Vocabulary - Antonyms",
  },
  {
    question: 'Choose the correct pronoun: "___ is my book."',
    options: ["These", "Those", "This", "Them"],
    correctAnswer: 2,
    level: "beginner",
    topic: "Pronouns - Demonstrative",
  },
  {
    question: "Which word is an adjective?",
    options: ["quickly", "run", "beautiful", "happiness"],
    correctAnswer: 2,
    level: "beginner",
    topic: "Parts of Speech - Adjectives",
  },

  // INTERMEDIATE QUESTIONS (8-14)
  {
    question: 'Choose the correct form: "I _____ in Mumbai for 5 years."',
    options: ["live", "am living", "have lived", "lived"],
    correctAnswer: 2,
    level: "intermediate",
    topic: "Tenses - Present Perfect",
  },
  {
    question: 'What does "ubiquitous" mean?',
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
    question: 'Convert to passive: "They are building a new bridge."',
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
    question:
      'Choose the correct phrasal verb: "Please _____ the lights when you leave."',
    options: ["turn off", "turn on", "turn up", "turn down"],
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
    question: 'What does the idiom "break the ice" mean?',
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
    question: 'Choose the correct preposition: "She is good ___ mathematics."',
    options: ["in", "at", "on", "with"],
    correctAnswer: 1,
    level: "intermediate",
    topic: "Prepositions",
  },

  // ADVANCED QUESTIONS (15-20)
  {
    question:
      'Choose the best phrase: "Despite _____ extensively, the team failed to achieve the desired outcome."',
    options: ["to prepare", "preparing", "prepared", "preparation"],
    correctAnswer: 1,
    level: "advanced",
    topic: "Grammar - Gerunds and Infinitives",
  },
  {
    question:
      'Identify the error: "Having finished the report, the meeting was attended by John."',
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
    question: 'Which word is closest in meaning to "meticulous"?',
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
    question:
      'Convert to reported speech: "She said, \\"I will call you tomorrow.\\""',
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

export function getTopicById(
  pathId: string,
  topicId: string
): EnglishTopic | undefined {
  const path = getPathById(pathId);
  return path?.topics.find((t) => t.id === topicId);
}

export function getAllTopics(): EnglishTopic[] {
  return englishPaths.flatMap((path) => path.topics);
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

// Statistics for the redesigned curriculum
export const curriculumStats = {
  totalTopics: 52,
  foundationTopics: 32,
  advancedTopics: 14,
  ieltsToeflTopics: 4,
  realWorldTopics: 2,
  totalQuestions: 3900,
  estimatedTotalHours: 630 / 60, // ~10.5 hours
  cefrLevels: ["A1", "A2", "B1", "B2", "C1"],
  improvementFromOld: {
    topicsReduction: "32% fewer topics (76 → 52)",
    timeReduction: "17% less time (760h → 630h)",
    betterStructure: "Balanced modules (3-5 topics each)",
    cambridgeAligned: "100% aligned with Cambridge Framework",
    newTopicsAdded: 5,
  },
};
