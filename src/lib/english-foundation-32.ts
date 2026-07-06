// Foundation English - Redesigned 32-Topic Curriculum (CEFR A1-B1)
// Cambridge-aligned, optimized learning sequence, no redundancy
// Redesigned: June 23, 2026

export interface EnglishTopic {
  id: string;
  name: string;
  description: string;
  icon: string;
  level: "beginner" | "intermediate" | "advanced";
  cefrLevel: "A1" | "A2" | "B1";
  category: "foundation";
  subtopics: string[];
  estimatedTime: number; // minutes
  questionCount: number;
  prerequisite?: string[]; // Topics that should be learned before this
}

export interface EnglishModule {
  id: string;
  name: string;
  description: string;
  icon: string;
  level: "beginner" | "intermediate" | "advanced";
  topics: EnglishTopic[];
}

export interface EnglishPath {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  goal: "foundation";
  modules: EnglishModule[];
  totalQuestions: number;
  estimatedWeeks: number;
}

// 32 Topics - Redesigned Structure (A1 → B1)
export const foundationPathRedesigned: EnglishPath = {
  id: "foundation",
  name: "Foundation Builder (Redesigned)",
  description: "Complete English from A1 to B1 - Cambridge-aligned, optimized curriculum with 32 comprehensive topics",
  icon: "📚",
  color: "#10B981",
  goal: "foundation",
  totalQuestions: 2400,
  estimatedWeeks: 24,

  modules: [
    // ==================== MODULE 1: Building Blocks (5 topics, A1) ====================
    {
      id: "building-blocks",
      name: "Module 1: Building Blocks",
      description: "Master the fundamentals - alphabet, sounds, and parts of speech",
      icon: "🔤",
      level: "beginner",
      topics: [
        {
          id: "alphabet-pronunciation",
          name: "Alphabet & Pronunciation",
          description: "26 letters, vowels/consonants, word stress, syllables, clear speaking",
          icon: "🔤",
          level: "beginner",
          cefrLevel: "A1",
          category: "foundation",
          subtopics: [
            "Capital and small letters",
            "5 vowels and 21 consonants",
            "Short vs long sounds",
            "Word stress and syllables",
            "Common pronunciation mistakes",
          ],
          estimatedTime: 90,
          questionCount: 60,
        },
        {
          id: "parts-of-speech",
          name: "Parts of Speech Complete",
          description: "8 types of words and their roles in sentences",
          icon: "🧩",
          level: "beginner",
          cefrLevel: "A1",
          category: "foundation",
          subtopics: [
            "Noun (person, place, thing)",
            "Pronoun (he, she, it, they)",
            "Verb (action or state)",
            "Adjective (describes nouns)",
            "Adverb (describes verbs)",
            "Preposition (in, on, at)",
            "Conjunction (and, but, or)",
            "Interjection (wow, oh)",
          ],
          estimatedTime: 60,
          questionCount: 40,
          prerequisite: ["alphabet-pronunciation"],
        },
        {
          id: "nouns-articles",
          name: "Nouns & Articles",
          description: "Types of nouns, plurals, countable/uncountable, a/an/the",
          icon: "📦",
          level: "beginner",
          cefrLevel: "A1",
          category: "foundation",
          subtopics: [
            "Common vs proper nouns",
            "Singular vs plural",
            "Regular and irregular plurals",
            "Countable vs uncountable",
            "Indefinite articles (a/an)",
            "Definite article (the)",
            "Zero article",
          ],
          estimatedTime: 120,
          questionCount: 80,
          prerequisite: ["parts-of-speech"],
        },
        {
          id: "pronouns-determiners",
          name: "Pronouns & Determiners",
          description: "Personal, possessive, reflexive, demonstrative, quantifiers",
          icon: "👤",
          level: "beginner",
          cefrLevel: "A1",
          category: "foundation",
          subtopics: [
            "Subject pronouns (I, you, he, she)",
            "Object pronouns (me, him, her)",
            "Possessive pronouns (mine, yours, his)",
            "Reflexive pronouns (myself, yourself)",
            "Demonstrative (this, that, these, those)",
            "Quantifiers (some, any, much, many)",
            "A lot of, lots of, few, little",
          ],
          estimatedTime: 120,
          questionCount: 80,
          prerequisite: ["parts-of-speech", "nouns-articles"],
        },
        {
          id: "adjectives-adverbs",
          name: "Adjectives & Adverbs",
          description: "Describe and compare things, modify verbs and adjectives",
          icon: "🎨",
          level: "beginner",
          cefrLevel: "A1",
          category: "foundation",
          subtopics: [
            "Descriptive adjectives",
            "Comparative (bigger, more expensive)",
            "Superlative (biggest, most expensive)",
            "Order of adjectives",
            "Adverbs of frequency (always, often, never)",
            "Adverbs of manner (quickly, carefully)",
            "Comparative and superlative adverbs",
          ],
          estimatedTime: 120,
          questionCount: 80,
          prerequisite: ["parts-of-speech"],
        },
      ],
    },

    // ==================== MODULE 2: Sentence Essentials (4 topics, A1-A2) ====================
    {
      id: "sentence-essentials",
      name: "Module 2: Sentence Essentials",
      description: "Build complete sentences with verbs, questions, and connectors",
      icon: "💬",
      level: "beginner",
      topics: [
        {
          id: "prepositions-mastery",
          name: "Prepositions Mastery",
          description: "Time (in/on/at), place, movement, common phrases",
          icon: "📍",
          level: "beginner",
          cefrLevel: "A1",
          category: "foundation",
          subtopics: [
            "Prepositions of time (in/on/at)",
            "Prepositions of place (in/on/at/under/above)",
            "Prepositions of movement (to/from/into/out of)",
            "Common prepositional phrases",
          ],
          estimatedTime: 90,
          questionCount: 60,
          prerequisite: ["parts-of-speech"],
        },
        {
          id: "basic-verbs-sentences",
          name: "Basic Verbs & Sentence Structure",
          description: "Action verbs, be/do/have, There is/are, commands, simple sentences",
          icon: "⚙️",
          level: "beginner",
          cefrLevel: "A1",
          category: "foundation",
          subtopics: [
            "Action verbs (run, eat, sleep)",
            "Auxiliary verbs (be, do, have)",
            "Regular vs irregular verbs",
            "There is / There are",
            "Imperative mood (commands)",
            "Simple sentence structure (Subject + Verb + Object)",
          ],
          estimatedTime: 150,
          questionCount: 100,
          prerequisite: ["parts-of-speech", "nouns-articles"],
        },
        {
          id: "question-formation",
          name: "Question Formation",
          description: "Yes/No questions, Wh- questions, subject questions, word order",
          icon: "❓",
          level: "beginner",
          cefrLevel: "A1",
          category: "foundation",
          subtopics: [
            "Yes/No questions (Do you...? Are you...?)",
            "Wh- questions (what, where, when, who, why, how)",
            "Subject questions (Who came?)",
            "Word order in questions",
          ],
          estimatedTime: 90,
          questionCount: 60,
          prerequisite: ["basic-verbs-sentences"],
        },
        {
          id: "conjunctions-connectors",
          name: "Conjunctions & Connectors",
          description: "Link sentences with and/but/or, because/although, time sequence words",
          icon: "🧲",
          level: "beginner",
          cefrLevel: "A2",
          category: "foundation",
          subtopics: [
            "Coordinating conjunctions (and, but, or, so)",
            "Subordinating conjunctions (because, although, when, if)",
            "Time sequence words (first, then, next, after that, finally)",
            "Transition words (however, moreover, therefore)",
          ],
          estimatedTime: 120,
          questionCount: 80,
          prerequisite: ["basic-verbs-sentences"],
        },
      ],
    },

    // ==================== MODULE 3: Core Tenses (5 topics, A1-A2) ====================
    {
      id: "core-tenses",
      name: "Module 3: Core Tenses",
      description: "Master all major verb tenses - present, past, future, perfect",
      icon: "⏰",
      level: "beginner",
      topics: [
        {
          id: "present-tenses",
          name: "Present Tenses",
          description: "Present Simple (habits, facts) + Present Continuous (now actions)",
          icon: "🔄",
          level: "beginner",
          cefrLevel: "A1",
          category: "foundation",
          subtopics: [
            "Present Simple: affirmative (I play)",
            "Present Simple: third person (He plays)",
            "Present Simple: negative (I don't play)",
            "Present Simple: questions (Do you play?)",
            "Present Continuous: affirmative (I am studying)",
            "Present Continuous: negative (I'm not studying)",
            "Present Continuous: questions (Are you studying?)",
            "When to use Simple vs Continuous",
          ],
          estimatedTime: 180,
          questionCount: 120,
          prerequisite: ["basic-verbs-sentences", "question-formation"],
        },
        {
          id: "past-tenses",
          name: "Past Tenses (Simple & Continuous)",
          description: "Past Simple (completed actions) + Past Continuous (was/were + -ing)",
          icon: "⏮️",
          level: "beginner",
          cefrLevel: "A1",
          category: "foundation",
          subtopics: [
            "Past Simple: affirmative (I went)",
            "Past Simple: regular verbs (-ed)",
            "Past Simple: irregular verbs",
            "Past Simple: negative (didn't)",
            "Past Simple: questions (Did you?)",
            "Past Continuous: structure (was/were + V-ing)",
            "Past Continuous: while + when usage",
            "Interrupted actions",
          ],
          estimatedTime: 180,
          questionCount: 120,
          prerequisite: ["present-tenses"],
        },
        {
          id: "future-tenses",
          name: "Future Tenses",
          description: "Will (predictions/promises) + Going to (plans/intentions)",
          icon: "⏭️",
          level: "beginner",
          cefrLevel: "A2",
          category: "foundation",
          subtopics: [
            "Will: predictions and promises",
            "Will: negative and questions",
            "Going to: plans and intentions",
            "Going to: negative and questions",
            "Differences between will and going to",
            "Time expressions (tomorrow, next week)",
          ],
          estimatedTime: 120,
          questionCount: 80,
          prerequisite: ["present-tenses"],
        },
        {
          id: "present-perfect",
          name: "Present Perfect",
          description: "Present Perfect Simple (has/have + V3) + Continuous (been + -ing)",
          icon: "✅",
          level: "intermediate",
          cefrLevel: "A2",
          category: "foundation",
          subtopics: [
            "Present Perfect Simple: structure (has/have + V3)",
            "Ever, never, already, yet, just",
            "For and since",
            "Difference from past simple",
            "Present Perfect Continuous: structure (has/have been + V-ing)",
            "How long questions",
            "Emphasis on duration",
          ],
          estimatedTime: 180,
          questionCount: 120,
          prerequisite: ["past-tenses"],
        },
        {
          id: "past-perfect",
          name: "Past Perfect",
          description: "Past Perfect (had + V3) for earlier past actions and time sequences",
          icon: "⏪",
          level: "intermediate",
          cefrLevel: "B1",
          category: "foundation",
          subtopics: [
            "Structure: had + past participle",
            "Before, after, when",
            "Past perfect vs past simple",
            "Time sequences in narratives",
          ],
          estimatedTime: 120,
          questionCount: 80,
          prerequisite: ["past-tenses", "present-perfect"],
        },
      ],
    },

    // ==================== MODULE 4: Modals & Voice (3 topics, A2-B1) ====================
    {
      id: "modals-voice",
      name: "Module 4: Modals & Voice",
      description: "Express ability, permission, advice, obligation - active and passive voice",
      icon: "🎭",
      level: "intermediate",
      topics: [
        {
          id: "modal-verbs",
          name: "Modal Verbs",
          description: "Can/could, may/might, must/should, will/would - ability, permission, advice",
          icon: "🔐",
          level: "intermediate",
          cefrLevel: "A2",
          category: "foundation",
          subtopics: [
            "Ability: can, could, be able to",
            "Permission: can, may, could",
            "Advice: should, ought to, had better",
            "Obligation: must, have to, need to",
            "Prohibition: mustn't, can't",
            "Possibility: may, might, could",
          ],
          estimatedTime: 120,
          questionCount: 80,
          prerequisite: ["present-tenses"],
        },
        {
          id: "passive-voice",
          name: "Passive Voice",
          description: "Be + V3 structure, passive in all tenses, active ↔ passive conversion",
          icon: "🔄",
          level: "intermediate",
          cefrLevel: "B1",
          category: "foundation",
          subtopics: [
            "Structure: be + past participle",
            "Passive in present simple",
            "Passive in past simple",
            "Passive in present perfect",
            "Passive in future",
            "By + agent",
            "When to use passive",
            "Active to passive conversion",
            "Passive to active conversion",
          ],
          estimatedTime: 150,
          questionCount: 100,
          prerequisite: ["present-perfect", "past-perfect"],
        },
        {
          id: "past-habits",
          name: "Past Habits (Used to / Would)",
          description: "Talk about past habits and states that are no longer true",
          icon: "🕰️",
          level: "intermediate",
          cefrLevel: "B1",
          category: "foundation",
          subtopics: [
            "Used to + infinitive",
            "Would for past habits",
            "Difference between used to and would",
            "Negative and question forms",
          ],
          estimatedTime: 90,
          questionCount: 60,
          prerequisite: ["past-tenses"],
        },
      ],
    },

    // ==================== MODULE 5: Complex Grammar (4 topics, B1) ====================
    {
      id: "complex-grammar",
      name: "Module 5: Complex Grammar",
      description: "Conditionals, reported speech, relative clauses, gerunds & infinitives",
      icon: "🏛️",
      level: "intermediate",
      topics: [
        {
          id: "conditionals",
          name: "Conditionals (Zero to Second)",
          description: "If clauses - facts, real future, and hypothetical present situations",
          icon: "🔀",
          level: "intermediate",
          cefrLevel: "B1",
          category: "foundation",
          subtopics: [
            "Zero conditional: facts (If you heat ice, it melts)",
            "First conditional: real future (If it rains, I will stay home)",
            "Second conditional: unreal present (If I were rich, I would travel)",
            "Unless, as long as, provided that",
          ],
          estimatedTime: 150,
          questionCount: 100,
          prerequisite: ["present-tenses", "future-tenses", "modal-verbs"],
        },
        {
          id: "reported-speech",
          name: "Reported Speech",
          description: "Report what people said - tense backshift, reporting verbs",
          icon: "💬",
          level: "intermediate",
          cefrLevel: "B1",
          category: "foundation",
          subtopics: [
            "Say vs tell",
            "Tense backshift rules",
            "Reporting statements",
            "Reporting questions",
            "Time and place changes (here→there, now→then)",
            "Reporting commands",
          ],
          estimatedTime: 120,
          questionCount: 80,
          prerequisite: ["present-perfect", "past-perfect"],
        },
        {
          id: "relative-clauses",
          name: "Relative Clauses",
          description: "Defining & non-defining clauses with who/which/that/whose",
          icon: "🔗",
          level: "intermediate",
          cefrLevel: "B1",
          category: "foundation",
          subtopics: [
            "Defining relative clauses",
            "Non-defining relative clauses (with commas)",
            "Who, which, that, whose",
            "Where and when",
            "Omitting relative pronouns",
          ],
          estimatedTime: 150,
          questionCount: 100,
          prerequisite: ["pronouns-determiners"],
        },
        {
          id: "gerunds-infinitives",
          name: "Gerunds & Infinitives",
          description: "To do vs doing - verb patterns and meaning changes",
          icon: "🎯",
          level: "intermediate",
          cefrLevel: "B1",
          category: "foundation",
          subtopics: [
            "Gerund (verb + -ing as noun)",
            "Infinitive (to + verb)",
            "Verbs followed by gerund (enjoy, finish, avoid)",
            "Verbs followed by infinitive (want, decide, hope)",
            "Verbs followed by both (like, love, hate)",
            "Change in meaning (stop, remember, forget)",
          ],
          estimatedTime: 120,
          questionCount: 80,
          prerequisite: ["basic-verbs-sentences", "present-tenses"],
        },
      ],
    },

    // ==================== MODULE 6: Vocabulary (4 topics, A2-B1) ====================
    {
      id: "vocabulary-building",
      name: "Module 6: Vocabulary",
      description: "1500+ essential words, word formation, phrasal verbs, idioms",
      icon: "📖",
      level: "intermediate",
      topics: [
        {
          id: "essential-vocabulary",
          name: "Essential 1500 Words",
          description: "Most common words by themes - home, work, travel, emotions, health",
          icon: "📚",
          level: "intermediate",
          cefrLevel: "A2",
          category: "foundation",
          subtopics: [
            "Home and daily life (200 words)",
            "Work and education (200 words)",
            "Travel and places (200 words)",
            "Emotions and feelings (150 words)",
            "Food and health (200 words)",
            "Technology and communication (150 words)",
            "Nature and environment (150 words)",
            "Sports and hobbies (150 words)",
            "Shopping and money (100 words)",
          ],
          estimatedTime: 240,
          questionCount: 150,
          prerequisite: ["parts-of-speech"],
        },
        {
          id: "word-formation",
          name: "Word Formation",
          description: "Prefixes, suffixes, compound words - build vocabulary systematically",
          icon: "🔧",
          level: "intermediate",
          cefrLevel: "B1",
          category: "foundation",
          subtopics: [
            "Common prefixes (un-, dis-, re-, pre-, mis-)",
            "Noun suffixes (-ness, -ment, -tion, -er)",
            "Adjective suffixes (-ful, -less, -ous, -ive)",
            "Adverb suffixes (-ly)",
            "Compound words (bedroom, toothbrush, homework)",
          ],
          estimatedTime: 120,
          questionCount: 80,
          prerequisite: ["essential-vocabulary"],
        },
        {
          id: "phrasal-verbs",
          name: "Phrasal Verbs",
          description: "100+ essential phrasal verbs with multiple meanings",
          icon: "🎯",
          level: "intermediate",
          cefrLevel: "B1",
          category: "foundation",
          subtopics: [
            "Separable phrasal verbs (pick up, turn on)",
            "Inseparable phrasal verbs (look after, get over)",
            "Three-word phrasal verbs (get away with, look forward to)",
            "Common phrasal verbs (get, take, make, give, put)",
          ],
          estimatedTime: 150,
          questionCount: 100,
          prerequisite: ["basic-verbs-sentences", "prepositions-mastery"],
        },
        {
          id: "idioms-expressions",
          name: "Idioms & Common Expressions",
          description: "100+ idioms, synonyms/antonyms, collocations",
          icon: "💡",
          level: "intermediate",
          cefrLevel: "B1",
          category: "foundation",
          subtopics: [
            "Emotions idioms (over the moon, down in the dumps)",
            "Success/failure idioms (piece of cake, miss the boat)",
            "Time idioms (in the nick of time, beat around the bush)",
            "Communication idioms (break the ice, spill the beans)",
            "Synonyms and antonyms (100+ pairs)",
            "Collocations (make a decision, do homework)",
          ],
          estimatedTime: 150,
          questionCount: 100,
          prerequisite: ["essential-vocabulary"],
        },
      ],
    },

    // ==================== MODULE 7: Communication Skills (4 topics, A2-B1) ====================
    {
      id: "communication-skills",
      name: "Module 7: Communication Skills",
      description: "Speaking, writing, listening, and reading for real-world communication",
      icon: "🗣️",
      level: "intermediate",
      topics: [
        {
          id: "speaking-essentials",
          name: "Speaking Essentials",
          description: "Greetings, shopping, directions, phone calls, restaurant, interview basics",
          icon: "🎤",
          level: "intermediate",
          cefrLevel: "A2",
          category: "foundation",
          subtopics: [
            "Greetings and introductions",
            "Shopping transactions and bargaining",
            "Asking for directions",
            "Phone conversations",
            "Restaurant orders",
            "Job interview basics",
          ],
          estimatedTime: 180,
          questionCount: 120,
          prerequisite: ["present-tenses", "question-formation"],
        },
        {
          id: "writing-fundamentals",
          name: "Writing Fundamentals",
          description: "Letters (formal/informal), emails, paragraphs, tone and register",
          icon: "✍️",
          level: "intermediate",
          cefrLevel: "B1",
          category: "foundation",
          subtopics: [
            "Informal letters (friends, family)",
            "Formal letters (job applications, complaints)",
            "Email writing (professional and personal)",
            "Paragraph structure (topic sentence, supporting details, conclusion)",
            "Tone and register (formal vs informal)",
          ],
          estimatedTime: 150,
          questionCount: 100,
          prerequisite: ["conjunctions-connectors"],
        },
        {
          id: "listening-comprehension",
          name: "Listening Comprehension",
          description: "Listen for gist, specific information, note-taking, accent recognition",
          icon: "🎧",
          level: "intermediate",
          cefrLevel: "A2",
          category: "foundation",
          subtopics: [
            "Listening for gist (main idea)",
            "Listening for specific information (details)",
            "Note-taking strategies",
            "Accent recognition (British, American, Australian)",
            "Understanding connected speech",
          ],
          estimatedTime: 120,
          questionCount: 80,
          prerequisite: ["present-tenses", "question-formation"],
        },
        {
          id: "reading-strategies",
          name: "Reading Strategies",
          description: "Skimming, scanning, inference, main idea, vocabulary in context",
          icon: "📖",
          level: "intermediate",
          cefrLevel: "B1",
          category: "foundation",
          subtopics: [
            "Skimming for main idea",
            "Scanning for specific information",
            "Making inferences",
            "Understanding vocabulary from context",
            "Identifying text structure",
          ],
          estimatedTime: 120,
          questionCount: 80,
          prerequisite: ["essential-vocabulary"],
        },
      ],
    },

    // ==================== MODULE 8: Refinement (3 topics, B1) ====================
    {
      id: "refinement",
      name: "Module 8: Refinement",
      description: "Sentence types, common mistakes, and practical scenarios",
      icon: "✨",
      level: "intermediate",
      topics: [
        {
          id: "sentence-types-punctuation",
          name: "Sentence Types & Punctuation",
          description: "Simple, compound, complex sentences, punctuation rules, tag questions",
          icon: "📐",
          level: "intermediate",
          cefrLevel: "B1",
          category: "foundation",
          subtopics: [
            "Simple sentences",
            "Compound sentences (and, but, or)",
            "Complex sentences (subordinate clauses)",
            "Compound-complex sentences",
            "Avoiding fragments and run-ons",
            "Punctuation rules (comma, period, question mark)",
            "Tag questions (isn't it? don't you?)",
          ],
          estimatedTime: 150,
          questionCount: 100,
          prerequisite: ["conjunctions-connectors", "relative-clauses"],
        },
        {
          id: "common-mistakes",
          name: "Common Mistakes for Indian Learners",
          description: "Hindi L1 interference - word order, articles, prepositions, tense confusion",
          icon: "⚠️",
          level: "intermediate",
          cefrLevel: "B1",
          category: "foundation",
          subtopics: [
            "Word order (SOV → SVO)",
            "Article errors (the vs a/an vs zero)",
            "Preposition mistakes (in vs on vs at)",
            "Tense confusion (present perfect vs past simple)",
            "Literal translations from Hindi",
            "Subject-verb agreement",
          ],
          estimatedTime: 120,
          questionCount: 80,
          prerequisite: ["present-perfect", "nouns-articles", "prepositions-mastery"],
        },
        {
          id: "practical-scenarios",
          name: "Practical Scenarios",
          description: "Business meetings, phone etiquette, presentations, professional communication",
          icon: "💼",
          level: "intermediate",
          cefrLevel: "B1",
          category: "foundation",
          subtopics: [
            "Business meetings vocabulary",
            "Phone etiquette",
            "Presentation basics (opening, closing)",
            "Professional email writing",
            "Networking and small talk",
          ],
          estimatedTime: 150,
          questionCount: 100,
          prerequisite: ["speaking-essentials", "writing-fundamentals"],
        },
      ],
    },
  ],
};

// Helper to flatten all topics for quiz generation
export const getAllFoundationTopics = (): EnglishTopic[] => {
  return foundationPathRedesigned.modules.flatMap((module) => module.topics);
};

// Helper to get topics by CEFR level
export const getTopicsByLevel = (level: "A1" | "A2" | "B1"): EnglishTopic[] => {
  return getAllFoundationTopics().filter((topic) => topic.cefrLevel === level);
};

// Helper to get topic prerequisites
export const getPrerequisites = (topicId: string): string[] => {
  const topic = getAllFoundationTopics().find((t) => t.id === topicId);
  return topic?.prerequisite || [];
};

// Learning path validation - check if prerequisites are completed
export const canStartTopic = (
  topicId: string,
  completedTopics: string[]
): boolean => {
  const prerequisites = getPrerequisites(topicId);
  return prerequisites.every((prereq) => completedTopics.includes(prereq));
};

// Get next recommended topic based on completed topics
export const getNextRecommendedTopic = (
  completedTopics: string[]
): EnglishTopic | null => {
  const allTopics = getAllFoundationTopics();

  for (const topic of allTopics) {
    // Skip if already completed
    if (completedTopics.includes(topic.id)) continue;

    // Check if prerequisites are met
    if (canStartTopic(topic.id, completedTopics)) {
      return topic;
    }
  }

  return null; // All topics completed or prerequisites not met
};
