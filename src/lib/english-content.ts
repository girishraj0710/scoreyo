// English Learning Content Structure
// Comprehensive English learning paths for competitive exams, international tests, and real-world usage

export type EnglishLevel = "beginner" | "intermediate" | "advanced";
export type EnglishGoal = "competitive-exam" | "ielts-toefl" | "foundation" | "real-world";

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

// English Learning Paths
export const englishPaths: EnglishPath[] = [
  {
    id: "competitive-exam",
    name: "Competitive Exam English",
    description: "Master English for SSC, Banking, UPSC, and Railway exams",
    icon: "🎯",
    color: "#3B82F6",
    goal: "competitive-exam",
    totalQuestions: 500,
    estimatedWeeks: 8,
    topics: [
      {
        id: "grammar-basics",
        name: "Grammar Fundamentals",
        description: "Tenses, Articles, Prepositions, Voice, Narration",
        icon: "📝",
        level: "beginner",
        category: "competitive-exam",
        subtopics: [
          "Present Tenses",
          "Past Tenses",
          "Future Tenses",
          "Articles (a, an, the)",
          "Prepositions",
          "Active & Passive Voice",
          "Direct & Indirect Speech",
        ],
        estimatedTime: 120,
        questionCount: 100,
      },
      {
        id: "vocabulary-ssc",
        name: "Vocabulary for SSC/Banking",
        description: "Synonyms, Antonyms, One-word substitution, Idioms",
        icon: "📚",
        level: "intermediate",
        category: "competitive-exam",
        subtopics: [
          "Synonyms & Antonyms",
          "One Word Substitution",
          "Idioms & Phrases",
          "Spelling Correction",
          "Word Meanings",
        ],
        estimatedTime: 90,
        questionCount: 80,
      },
      {
        id: "sentence-improvement",
        name: "Sentence Improvement",
        description: "Error spotting, Fill in the blanks, Sentence rearrangement",
        icon: "✍️",
        level: "intermediate",
        category: "competitive-exam",
        subtopics: [
          "Error Spotting",
          "Fill in the Blanks",
          "Sentence Rearrangement",
          "Para Jumbles",
          "Sentence Completion",
        ],
        estimatedTime: 80,
        questionCount: 70,
      },
      {
        id: "comprehension",
        name: "Reading Comprehension",
        description: "Passage reading, inference, theme identification",
        icon: "📖",
        level: "advanced",
        category: "competitive-exam",
        subtopics: [
          "Short Passages",
          "Long Passages",
          "Main Theme",
          "Inference Questions",
          "Vocabulary in Context",
        ],
        estimatedTime: 100,
        questionCount: 50,
      },
      {
        id: "cloze-test",
        name: "Cloze Test",
        description: "Fill blanks in passages, context-based learning",
        icon: "🔤",
        level: "advanced",
        category: "competitive-exam",
        subtopics: [
          "Grammar-based Cloze",
          "Vocabulary-based Cloze",
          "Mixed Cloze Tests",
        ],
        estimatedTime: 60,
        questionCount: 40,
      },
    ],
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
        id: "academic-vocabulary",
        name: "Academic Vocabulary",
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
    id: "foundation",
    name: "Foundation Builder",
    description: "Build strong English basics from scratch",
    icon: "🏗️",
    color: "#10B981",
    goal: "foundation",
    totalQuestions: 400,
    estimatedWeeks: 6,
    topics: [
      {
        id: "basic-grammar",
        name: "Basic Grammar",
        description: "Subject-verb agreement, sentence structure, punctuation",
        icon: "🔤",
        level: "beginner",
        category: "foundation",
        subtopics: [
          "Parts of Speech",
          "Subject-Verb Agreement",
          "Simple Sentences",
          "Compound Sentences",
          "Complex Sentences",
          "Punctuation Rules",
        ],
        estimatedTime: 100,
        questionCount: 100,
      },
      {
        id: "essential-vocabulary",
        name: "Essential Vocabulary",
        description: "1000 most common English words",
        icon: "💬",
        level: "beginner",
        category: "foundation",
        subtopics: [
          "Daily Use Words",
          "Common Verbs",
          "Common Adjectives",
          "Common Nouns",
          "Basic Phrasal Verbs",
        ],
        estimatedTime: 120,
        questionCount: 150,
      },
      {
        id: "pronunciation",
        name: "Pronunciation Basics",
        description: "Phonetics, word stress, common mistakes",
        icon: "🗣️",
        level: "beginner",
        category: "foundation",
        subtopics: [
          "Vowel Sounds",
          "Consonant Sounds",
          "Word Stress",
          "Sentence Stress",
          "Common Mispronunciations",
        ],
        estimatedTime: 80,
        questionCount: 50,
      },
      {
        id: "reading-practice",
        name: "Reading Practice",
        description: "Simple stories and articles for beginners",
        icon: "📕",
        level: "beginner",
        category: "foundation",
        subtopics: [
          "Short Stories",
          "News Articles",
          "Blog Posts",
          "Instructions",
        ],
        estimatedTime: 90,
        questionCount: 100,
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

// Quick level assessment questions (3 questions to detect user level)
export const levelAssessmentQuestions = [
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
  },
  {
    question: "Choose the best phrase to complete: 'Despite _____ extensively, the team failed to achieve the desired outcome.'",
    options: [
      "to prepare",
      "preparing",
      "prepared",
      "preparation",
    ],
    correctAnswer: 1,
    level: "advanced",
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

export function getTopicsByLevel(level: EnglishLevel): EnglishTopic[] {
  return getAllTopics().filter((topic) => topic.level === level);
}

export function getTopicsByGoal(goal: EnglishGoal): EnglishTopic[] {
  return getAllTopics().filter((topic) => topic.category === goal);
}

// Get user level from assessment score
export function getUserLevelFromScore(score: number): EnglishLevel {
  if (score === 0) return "beginner";
  if (score === 1) return "beginner";
  if (score === 2) return "intermediate";
  if (score === 3) return "advanced";
  return "beginner";
}
