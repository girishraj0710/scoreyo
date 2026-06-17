// Advanced English - B2 to C1 Level Topics
// Upper-Intermediate to Advanced English for competitive exams

// Internal interfaces for module structure
interface AdvancedTopicInternal {
  id: string;
  name: string;
  description: string;
  icon: string;
  level: "intermediate" | "advanced";
  cefrLevel: "B2" | "C1";
  category: "advanced";
  subtopics: string[];
  estimatedTime: number; // minutes
  questionCount: number;
  prerequisite?: string[]; // Topics that should be learned before this
}

interface EnglishModule {
  id: string;
  name: string;
  description: string;
  icon: string;
  level: "intermediate" | "advanced";
  topics: AdvancedTopicInternal[];
}

interface AdvancedPathInternal {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  goal: "advanced";
  modules: EnglishModule[];
  totalQuestions: number;
  estimatedWeeks: number;
}

// Advanced English Path - B2 to C1
export const advancedEnglishPath: AdvancedPathInternal = {
  id: "advanced",
  name: "Advanced English Mastery",
  description: "Upper-Intermediate to Advanced English (B2-C1) - Complex grammar, advanced vocabulary, and professional communication",
  icon: "🎓",
  color: "#7C3AED",
  goal: "advanced",
  totalQuestions: 800,
  estimatedWeeks: 16,

  modules: [
    // ==================== MODULE 1: Advanced Conditionals (B2) ====================
    {
      id: "advanced-conditionals",
      name: "Module 1: Advanced Conditionals",
      description: "Master complex conditional structures",
      icon: "🔀",
      level: "advanced",
      topics: [
        {
          id: "third-conditional",
          name: "Third Conditional",
          description: "Hypothetical past situations - If I had known, I would have...",
          icon: "⏮️",
          level: "advanced",
          cefrLevel: "B2",
          category: "advanced",
          subtopics: [
            "If + past perfect, would have + V3",
            "Hypothetical past situations",
            "Regrets and missed opportunities",
            "Unless in third conditional",
          ],
          estimatedTime: 90,
          questionCount: 50,
          prerequisite: ["conditionals"], // From foundation path
        },
        {
          id: "mixed-conditionals",
          name: "Mixed Conditionals",
          description: "Mixing time frames in conditionals",
          icon: "🔄",
          level: "advanced",
          cefrLevel: "B2",
          category: "advanced",
          subtopics: [
            "Past condition, present result",
            "Present condition, past result",
            "Time frame mixing",
            "Advanced applications",
          ],
          estimatedTime: 90,
          questionCount: 50,
          prerequisite: ["third-conditional"],
        },
        {
          id: "inversion-conditionals",
          name: "Conditional Inversion",
          description: "Formal conditional structures without 'if'",
          icon: "↕️",
          level: "advanced",
          cefrLevel: "C1",
          category: "advanced",
          subtopics: [
            "Had I known... (instead of If I had known)",
            "Were I to do... (instead of If I were to do)",
            "Should you need... (instead of If you should need)",
            "Formal written English",
          ],
          estimatedTime: 90,
          questionCount: 40,
          prerequisite: ["mixed-conditionals"],
        },
      ],
    },

    // ==================== MODULE 2: Advanced Relative Clauses (B2) ====================
    {
      id: "advanced-relatives",
      name: "Module 2: Advanced Relative Clauses",
      description: "Non-defining clauses and complex structures",
      icon: "🔗",
      level: "advanced",
      topics: [
        {
          id: "non-defining-relative-clauses",
          name: "Non-defining Relative Clauses",
          description: "Add extra information with commas",
          icon: "📌",
          level: "advanced",
          cefrLevel: "B2",
          category: "advanced",
          subtopics: [
            "Clauses with commas",
            "Which for whole clause reference",
            "Adding background information",
            "Difference from defining clauses",
          ],
          estimatedTime: 90,
          questionCount: 50,
          prerequisite: ["relative-clauses"], // From foundation
        },
        {
          id: "reduced-relative-clauses",
          name: "Reduced Relative Clauses",
          description: "Shorten relative clauses by removing pronouns",
          icon: "✂️",
          level: "advanced",
          cefrLevel: "B2",
          category: "advanced",
          subtopics: [
            "Participle clauses (The man standing...)",
            "Infinitive clauses (The first to arrive...)",
            "Omitting relative pronouns",
            "Formal writing style",
          ],
          estimatedTime: 90,
          questionCount: 50,
          prerequisite: ["non-defining-relative-clauses"],
        },
      ],
    },

    // ==================== MODULE 3: Advanced Modals (B2-C1) ====================
    {
      id: "advanced-modals",
      name: "Module 3: Advanced Modal Verbs",
      description: "Past modals and complex modal usage",
      icon: "🎭",
      level: "advanced",
      topics: [
        {
          id: "past-modals",
          name: "Past Modals (Modal + have + V3)",
          description: "Speculation, criticism, and deduction about the past",
          icon: "🔍",
          level: "advanced",
          cefrLevel: "B2",
          category: "advanced",
          subtopics: [
            "Must have + V3 (strong deduction)",
            "May/might have + V3 (possibility)",
            "Should have + V3 (criticism)",
            "Could have + V3 (missed opportunity)",
            "Would have + V3 (hypothetical)",
          ],
          estimatedTime: 120,
          questionCount: 60,
          prerequisite: ["modal-verbs"], // From foundation
        },
        {
          id: "modal-nuances",
          name: "Modal Verb Nuances",
          description: "Subtle differences in modal meanings",
          icon: "🎯",
          level: "advanced",
          cefrLevel: "C1",
          category: "advanced",
          subtopics: [
            "Shall vs will (formal/informal)",
            "Dare and need as modals",
            "Ought to vs should",
            "Would rather vs had better",
            "Modal + continuous/perfect continuous",
          ],
          estimatedTime: 90,
          questionCount: 50,
          prerequisite: ["past-modals"],
        },
      ],
    },

    // ==================== MODULE 4: Advanced Tenses (B2) ====================
    {
      id: "advanced-tenses",
      name: "Module 4: Advanced Tense Usage",
      description: "Complex tense combinations and narrative tenses",
      icon: "⏱️",
      level: "advanced",
      topics: [
        {
          id: "past-perfect-continuous",
          name: "Past Perfect Continuous",
          description: "Had been + V-ing for duration before past event",
          icon: "⏪",
          level: "advanced",
          cefrLevel: "B2",
          category: "advanced",
          subtopics: [
            "Structure: had been + V-ing",
            "Duration before past action",
            "Cause and effect in past",
            "Difference from past perfect simple",
          ],
          estimatedTime: 90,
          questionCount: 50,
          prerequisite: ["past-perfect", "present-perfect-continuous"],
        },
        {
          id: "future-perfect",
          name: "Future Perfect",
          description: "Will have + V3 for completed future actions",
          icon: "⏩",
          level: "advanced",
          cefrLevel: "B2",
          category: "advanced",
          subtopics: [
            "Structure: will have + V3",
            "Actions completed by future time",
            "By + time expressions",
            "Future predictions",
          ],
          estimatedTime: 90,
          questionCount: 50,
          prerequisite: ["future-tenses", "present-perfect-complete"],
        },
        {
          id: "future-perfect-continuous",
          name: "Future Perfect Continuous",
          description: "Will have been + V-ing for duration until future point",
          icon: "🔜",
          level: "advanced",
          cefrLevel: "B2",
          category: "advanced",
          subtopics: [
            "Structure: will have been + V-ing",
            "Duration until future time",
            "For/by with time expressions",
            "Emphasis on duration",
          ],
          estimatedTime: 90,
          questionCount: 40,
          prerequisite: ["future-perfect"],
        },
        {
          id: "narrative-tenses",
          name: "Narrative Tenses",
          description: "Combining tenses for storytelling",
          icon: "📖",
          level: "advanced",
          cefrLevel: "B2",
          category: "advanced",
          subtopics: [
            "Past simple for main events",
            "Past continuous for background",
            "Past perfect for earlier events",
            "Creating timeline in narratives",
          ],
          estimatedTime: 120,
          questionCount: 60,
          prerequisite: ["tense-comparison"],
        },
      ],
    },

    // ==================== MODULE 5: Advanced Vocabulary (B2-C1) ====================
    {
      id: "advanced-vocabulary",
      name: "Module 5: Advanced Vocabulary",
      description: "Academic words, collocations, and formal language",
      icon: "📚",
      level: "advanced",
      topics: [
        {
          id: "academic-vocabulary",
          name: "Academic Vocabulary",
          description: "Academic Word List for essays and reports",
          icon: "🎓",
          level: "advanced",
          cefrLevel: "B2",
          category: "advanced",
          subtopics: [
            "Academic Word List (570 families)",
            "Research and analysis vocabulary",
            "Argument and discussion words",
            "Formal register",
          ],
          estimatedTime: 180,
          questionCount: 100,
          prerequisite: ["essential-vocabulary"],
        },
        {
          id: "collocations-advanced",
          name: "Advanced Collocations",
          description: "Natural word combinations for fluency",
          icon: "🤝",
          level: "advanced",
          cefrLevel: "B2",
          category: "advanced",
          subtopics: [
            "Verb + noun collocations",
            "Adjective + noun collocations",
            "Adverb + adjective collocations",
            "Prepositional collocations",
          ],
          estimatedTime: 120,
          questionCount: 80,
          prerequisite: ["synonyms-antonyms"],
        },
        {
          id: "formal-informal-register",
          name: "Formal vs Informal Register",
          description: "Choose appropriate language for context",
          icon: "👔",
          level: "advanced",
          cefrLevel: "B2",
          category: "advanced",
          subtopics: [
            "Formal vocabulary alternatives",
            "Phrasal verbs vs single verbs",
            "Passive voice for formality",
            "Academic vs conversational style",
          ],
          estimatedTime: 90,
          questionCount: 50,
          prerequisite: ["writing-basics"],
        },
        {
          id: "proverbs-sayings",
          name: "Proverbs & Sayings",
          description: "Common English proverbs and their meanings",
          icon: "💬",
          level: "advanced",
          cefrLevel: "C1",
          category: "advanced",
          subtopics: [
            "Common English proverbs",
            "When to use proverbs",
            "Cultural context",
            "Indian equivalent proverbs",
          ],
          estimatedTime: 90,
          questionCount: 50,
          prerequisite: ["idioms-expressions"],
        },
      ],
    },

    // ==================== MODULE 6: Advanced Writing (B2-C1) ====================
    {
      id: "advanced-writing",
      name: "Module 6: Advanced Writing Skills",
      description: "Essays, reports, and formal correspondence",
      icon: "✍️",
      level: "advanced",
      topics: [
        {
          id: "essay-writing",
          name: "Essay Writing",
          description: "Argumentative, descriptive, and analytical essays",
          icon: "📝",
          level: "advanced",
          cefrLevel: "B2",
          category: "advanced",
          subtopics: [
            "Essay structure (introduction, body, conclusion)",
            "Thesis statements",
            "Paragraph development",
            "Cohesion and coherence",
            "Academic tone",
          ],
          estimatedTime: 150,
          questionCount: 50,
          prerequisite: ["writing-basics"],
        },
        {
          id: "report-writing",
          name: "Report Writing",
          description: "Business and academic reports",
          icon: "📊",
          level: "advanced",
          cefrLevel: "B2",
          category: "advanced",
          subtopics: [
            "Report structure and format",
            "Executive summary",
            "Data presentation",
            "Recommendations section",
            "Formal language",
          ],
          estimatedTime: 120,
          questionCount: 40,
          prerequisite: ["essay-writing"],
        },
        {
          id: "advanced-punctuation",
          name: "Advanced Punctuation",
          description: "Semicolons, colons, dashes, and complex usage",
          icon: "❗",
          level: "advanced",
          cefrLevel: "C1",
          category: "advanced",
          subtopics: [
            "Semicolons for related clauses",
            "Colons for lists and explanations",
            "Em-dashes and en-dashes",
            "Parentheses and brackets",
            "Quotation mark rules",
          ],
          estimatedTime: 90,
          questionCount: 40,
          prerequisite: ["writing-basics"],
        },
      ],
    },

    // ==================== MODULE 7: Advanced Speaking (B2-C1) ====================
    {
      id: "advanced-speaking",
      name: "Module 7: Advanced Speaking Skills",
      description: "Presentations, debates, and professional communication",
      icon: "🎤",
      level: "advanced",
      topics: [
        {
          id: "presentations-advanced",
          name: "Professional Presentations",
          description: "Deliver impactful presentations in English",
          icon: "📊",
          level: "advanced",
          cefrLevel: "B2",
          category: "advanced",
          subtopics: [
            "Opening and closing strategies",
            "Signposting language",
            "Visual aids commentary",
            "Handling Q&A sessions",
            "Body language and delivery",
          ],
          estimatedTime: 120,
          questionCount: 50,
          prerequisite: ["speaking-basics"],
        },
        {
          id: "debate-discussion",
          name: "Debates & Discussions",
          description: "Express opinions, agree, and disagree formally",
          icon: "💭",
          level: "advanced",
          cefrLevel: "B2",
          category: "advanced",
          subtopics: [
            "Expressing opinions formally",
            "Agreeing and disagreeing politely",
            "Interrupting appropriately",
            "Turn-taking in discussions",
            "Persuasive language",
          ],
          estimatedTime: 90,
          questionCount: 50,
          prerequisite: ["speaking-basics"],
        },
      ],
    },
  ],
};

// Import the correct types from english-content.ts to match interface
export interface EnglishTopic {
  id: string;
  name: string;
  description: string;
  icon: string;
  level: "beginner" | "intermediate" | "advanced";
  category: "ielts-toefl" | "foundation" | "advanced" | "real-world";
  subtopics: string[];
  estimatedTime: number;
  questionCount: number;
}

// Helper to flatten all topics and convert to EnglishTopic format
export const getAllAdvancedTopics = (): EnglishTopic[] => {
  return advancedEnglishPath.modules.flatMap(module =>
    module.topics.map(topic => ({
      id: topic.id,
      name: topic.name,
      description: topic.description,
      icon: topic.icon,
      level: topic.level as "intermediate" | "advanced", // Already correct
      category: "advanced" as const,
      subtopics: topic.subtopics,
      estimatedTime: topic.estimatedTime,
      questionCount: topic.questionCount,
    }))
  );
};

// Helper to get topics by CEFR level (internal use)
export const getAdvancedTopicsByLevel = (level: "B2" | "C1"): EnglishTopic[] => {
  const allTopics = advancedEnglishPath.modules.flatMap(module => module.topics);
  return allTopics
    .filter(topic => topic.cefrLevel === level)
    .map(topic => ({
      id: topic.id,
      name: topic.name,
      description: topic.description,
      icon: topic.icon,
      level: topic.level as "intermediate" | "advanced",
      category: "advanced" as const,
      subtopics: topic.subtopics,
      estimatedTime: topic.estimatedTime,
      questionCount: topic.questionCount,
    }));
};
