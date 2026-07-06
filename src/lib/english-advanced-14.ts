// Advanced English - Redesigned 14-Topic Curriculum (CEFR B2-C1)
// Upper-Intermediate to Advanced English for professional and academic use
// Redesigned: June 23, 2026

export interface AdvancedTopic {
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
  prerequisite?: string[]; // Topics from Foundation or Advanced path
}

export interface EnglishModule {
  id: string;
  name: string;
  description: string;
  icon: string;
  level: "intermediate" | "advanced";
  topics: AdvancedTopic[];
}

export interface AdvancedPath {
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

// 14 Topics - Redesigned Structure (B2 → C1)
export const advancedPathRedesigned: AdvancedPath = {
  id: "advanced",
  name: "Advanced English Mastery (Redesigned)",
  description: "Upper-Intermediate to Advanced English (B2-C1) - Complex grammar, advanced vocabulary, professional communication",
  icon: "🎓",
  color: "#7C3AED",
  goal: "advanced",
  totalQuestions: 900,
  estimatedWeeks: 14,

  modules: [
    // ==================== MODULE 1: Advanced Tenses & Conditionals (5 topics, B2) ====================
    {
      id: "advanced-tenses-conditionals",
      name: "Module 1: Advanced Tenses & Conditionals",
      description: "Master complex tense combinations and hypothetical situations",
      icon: "⏱️",
      level: "advanced",
      topics: [
        {
          id: "advanced-tense-combinations",
          name: "Advanced Tense Combinations",
          description: "Past Perfect Continuous, Future Perfect, Future Perfect Continuous, narrative tenses",
          icon: "⏪",
          level: "advanced",
          cefrLevel: "B2",
          category: "advanced",
          subtopics: [
            "Past Perfect Continuous (had been + V-ing)",
            "Future Perfect (will have + V3)",
            "Future Perfect Continuous (will have been + V-ing)",
            "Narrative tenses (combining past tenses for storytelling)",
            "Timeline visualization",
          ],
          estimatedTime: 240,
          questionCount: 150,
          prerequisite: ["past-perfect", "present-perfect"], // From foundation
        },
        {
          id: "third-mixed-conditionals",
          name: "Third & Mixed Conditionals",
          description: "Hypothetical past (third) + mixing time frames (mixed conditionals)",
          icon: "🔀",
          level: "advanced",
          cefrLevel: "B2",
          category: "advanced",
          subtopics: [
            "Third conditional: If + past perfect, would have + V3",
            "Hypothetical past situations",
            "Regrets and missed opportunities",
            "Mixed conditionals: past condition, present result",
            "Mixed conditionals: present condition, past result",
          ],
          estimatedTime: 150,
          questionCount: 100,
          prerequisite: ["conditionals"], // From foundation
        },
        {
          id: "conditional-inversion",
          name: "Conditional Inversion",
          description: "Formal conditional structures without 'if' for advanced writing",
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
          prerequisite: ["third-mixed-conditionals"],
        },
        {
          id: "reduced-relative-clauses",
          name: "Reduced Relative Clauses",
          description: "Shorten relative clauses using participles and infinitives",
          icon: "✂️",
          level: "advanced",
          cefrLevel: "B2",
          category: "advanced",
          subtopics: [
            "Participle clauses (The man standing...)",
            "Infinitive clauses (The first to arrive...)",
            "Omitting relative pronouns for conciseness",
            "Formal writing style",
          ],
          estimatedTime: 90,
          questionCount: 50,
          prerequisite: ["relative-clauses"], // From foundation
        },
        {
          id: "subjunctive-mood",
          name: "Subjunctive Mood",
          description: "Express wishes, recommendations, and hypothetical situations formally",
          icon: "🎭",
          level: "advanced",
          cefrLevel: "C1",
          category: "advanced",
          subtopics: [
            "I wish + past simple (unreal present)",
            "I wish + past perfect (unreal past)",
            "If only (stronger than 'I wish')",
            "I'd rather + past tense",
            "It's time + past tense",
            "Formal recommendations (suggest, recommend, insist + that + base form)",
          ],
          estimatedTime: 90,
          questionCount: 50,
          prerequisite: ["third-mixed-conditionals", "modal-verbs"],
        },
      ],
    },

    // ==================== MODULE 2: Advanced Modals & Voice (2 topics, B2-C1) ====================
    {
      id: "advanced-modals-voice",
      name: "Module 2: Advanced Modals & Voice",
      description: "Past modals, subtle modal meanings, and advanced passive structures",
      icon: "🎭",
      level: "advanced",
      topics: [
        {
          id: "past-modals-nuances",
          name: "Past Modals & Nuances",
          description: "Modal + have + V3 for speculation, criticism, and subtle modal meanings",
          icon: "🔍",
          level: "advanced",
          cefrLevel: "B2",
          category: "advanced",
          subtopics: [
            "Must have + V3 (strong deduction about past)",
            "May/might have + V3 (possibility about past)",
            "Should have + V3 (criticism, regret)",
            "Could have + V3 (missed opportunity)",
            "Would have + V3 (hypothetical past)",
            "Can't/couldn't have + V3 (impossibility)",
            "Shall vs will (formal/informal)",
            "Dare and need as modals",
            "Modal + continuous/perfect continuous",
          ],
          estimatedTime: 150,
          questionCount: 100,
          prerequisite: ["modal-verbs", "past-perfect"], // From foundation
        },
        {
          id: "advanced-passive-structures",
          name: "Advanced Passive Structures",
          description: "Passive reporting verbs, passive infinitives, passive gerunds",
          icon: "🔄",
          level: "advanced",
          cefrLevel: "C1",
          category: "advanced",
          subtopics: [
            "It is said that... (impersonal passive)",
            "He is said to... (personal passive)",
            "It is believed/thought/reported that...",
            "Passive infinitives (to be done, to have been done)",
            "Passive gerunds (being done, having been done)",
            "Passive with reporting verbs (claim, allege, consider)",
          ],
          estimatedTime: 90,
          questionCount: 50,
          prerequisite: ["passive-voice"], // From foundation
        },
      ],
    },

    // ==================== MODULE 3: Advanced Vocabulary (3 topics, B2-C1) ====================
    {
      id: "advanced-vocabulary",
      name: "Module 3: Advanced Vocabulary",
      description: "Academic words, collocations, register, idioms, and proverbs",
      icon: "📚",
      level: "advanced",
      topics: [
        {
          id: "academic-vocabulary",
          name: "Academic Vocabulary",
          description: "Academic Word List (570 families) for essays, research, and formal writing",
          icon: "🎓",
          level: "advanced",
          cefrLevel: "B2",
          category: "advanced",
          subtopics: [
            "Academic Word List (570 word families)",
            "Research and analysis vocabulary",
            "Argument and discussion words",
            "Formal register vocabulary",
            "Discipline-specific academic terms",
          ],
          estimatedTime: 240,
          questionCount: 150,
          prerequisite: ["essential-vocabulary"], // From foundation
        },
        {
          id: "collocations-register",
          name: "Collocations & Register",
          description: "Natural word combinations + formal vs informal language choices",
          icon: "🤝",
          level: "advanced",
          cefrLevel: "B2",
          category: "advanced",
          subtopics: [
            "Verb + noun collocations (make a decision, do research)",
            "Adjective + noun collocations (strong possibility, heavy rain)",
            "Adverb + adjective collocations (highly unlikely, deeply concerned)",
            "Prepositional collocations (by accident, on purpose)",
            "Formal vocabulary alternatives",
            "Phrasal verbs vs single verbs (put off → postpone)",
            "Academic vs conversational style",
          ],
          estimatedTime: 150,
          questionCount: 100,
          prerequisite: ["phrasal-verbs", "writing-fundamentals"], // From foundation
        },
        {
          id: "idioms-proverbs",
          name: "Idioms & Proverbs",
          description: "Advanced idioms, common English proverbs, cultural context",
          icon: "💬",
          level: "advanced",
          cefrLevel: "C1",
          category: "advanced",
          subtopics: [
            "Advanced idioms (beat around the bush, hit the nail on the head)",
            "Business idioms (get the ball rolling, think outside the box)",
            "Common English proverbs (A stitch in time saves nine)",
            "When to use proverbs appropriately",
            "Cultural context and meanings",
            "Indian equivalent proverbs",
          ],
          estimatedTime: 120,
          questionCount: 80,
          prerequisite: ["idioms-expressions"], // From foundation
        },
      ],
    },

    // ==================== MODULE 4: Advanced Communication (4 topics, B2-C1) ====================
    {
      id: "advanced-communication",
      name: "Module 4: Advanced Communication",
      description: "Essays, reports, presentations, debates, and professional writing",
      icon: "✍️",
      level: "advanced",
      topics: [
        {
          id: "essay-writing",
          name: "Essay Writing",
          description: "Argumentative, descriptive, analytical essays with strong structure",
          icon: "📝",
          level: "advanced",
          cefrLevel: "B2",
          category: "advanced",
          subtopics: [
            "Essay structure (introduction, body, conclusion)",
            "Thesis statements and arguments",
            "Paragraph development and unity",
            "Cohesion and coherence",
            "Academic tone and objectivity",
            "Citing sources and avoiding plagiarism",
          ],
          estimatedTime: 180,
          questionCount: 60,
          prerequisite: ["writing-fundamentals", "conjunctions-connectors"], // From foundation
        },
        {
          id: "report-business-writing",
          name: "Report & Business Writing",
          description: "Reports, executive summaries, data presentation, advanced punctuation",
          icon: "📊",
          level: "advanced",
          cefrLevel: "B2",
          category: "advanced",
          subtopics: [
            "Report structure and format",
            "Executive summary writing",
            "Data presentation and interpretation",
            "Recommendations section",
            "Formal business language",
            "Advanced punctuation (semicolons, colons, dashes)",
            "Parentheses and brackets",
          ],
          estimatedTime: 150,
          questionCount: 60,
          prerequisite: ["essay-writing"],
        },
        {
          id: "professional-presentations",
          name: "Professional Presentations",
          description: "Deliver impactful presentations with signposting and Q&A handling",
          icon: "📊",
          level: "advanced",
          cefrLevel: "B2",
          category: "advanced",
          subtopics: [
            "Opening and closing strategies",
            "Signposting language (First, Moving on, In conclusion)",
            "Visual aids commentary (As you can see...)",
            "Handling Q&A sessions",
            "Body language and delivery",
            "Engaging the audience",
          ],
          estimatedTime: 120,
          questionCount: 50,
          prerequisite: ["speaking-essentials"], // From foundation
        },
        {
          id: "debates-formal-discussion",
          name: "Debates & Formal Discussion",
          description: "Express opinions, agree/disagree politely, persuasive language",
          icon: "💭",
          level: "advanced",
          cefrLevel: "B2",
          category: "advanced",
          subtopics: [
            "Expressing opinions formally (I would argue that...)",
            "Agreeing politely (I see your point, but...)",
            "Disagreeing diplomatically (I'm afraid I don't agree)",
            "Interrupting appropriately (If I may interrupt...)",
            "Turn-taking in discussions",
            "Persuasive language and rhetoric",
          ],
          estimatedTime: 90,
          questionCount: 50,
          prerequisite: ["professional-presentations"],
        },
      ],
    },
  ],
};

// Type for exported topics (matches english-content.ts EnglishTopic)
type ExportedEnglishTopic = {
  id: string;
  name: string;
  description: string;
  icon: string;
  level: "beginner" | "intermediate" | "advanced";
  category: "ielts-toefl" | "foundation" | "advanced" | "real-world";
  subtopics: string[];
  estimatedTime: number;
  questionCount: number;
};

// Helper to flatten all topics and convert to EnglishTopic format
export const getAllAdvancedTopics = (): ExportedEnglishTopic[] => {
  return advancedPathRedesigned.modules.flatMap((module) =>
    module.topics.map((topic) => ({
      id: topic.id,
      name: topic.name,
      description: topic.description,
      icon: topic.icon,
      level: topic.level as "intermediate" | "advanced",
      category: "advanced" as const,
      subtopics: topic.subtopics,
      estimatedTime: topic.estimatedTime,
      questionCount: topic.questionCount,
    }))
  );
};

// Helper to get topics by CEFR level (internal use)
export const getAdvancedTopicsByLevel = (
  level: "B2" | "C1"
): ExportedEnglishTopic[] => {
  const allTopics = advancedPathRedesigned.modules.flatMap(
    (module) => module.topics
  );
  return allTopics
    .filter((topic) => topic.cefrLevel === level)
    .map((topic) => ({
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

// Helper to get topic prerequisites
export const getAdvancedPrerequisites = (topicId: string): string[] => {
  const allTopics = advancedPathRedesigned.modules.flatMap(
    (module) => module.topics
  );
  const topic = allTopics.find((t) => t.id === topicId);
  return topic?.prerequisite || [];
};

// Learning path validation - check if prerequisites are completed
export const canStartAdvancedTopic = (
  topicId: string,
  completedTopics: string[]
): boolean => {
  const prerequisites = getAdvancedPrerequisites(topicId);
  return prerequisites.every((prereq) => completedTopics.includes(prereq));
};
