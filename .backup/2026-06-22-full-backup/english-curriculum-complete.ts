/**
 * COMPREHENSIVE ENGLISH CURRICULUM
 * Complete syllabus matching top English institutes (British Council, IDP, Coaching Centers)
 * Covers: Foundation (A1-A2) → Intermediate (B1-B2) → Advanced (C1-C2)
 * Total: 150+ topics, 3000+ questions planned
 */

export type EnglishLevel = "beginner" | "intermediate" | "advanced";
export type EnglishGoal = "competitive-exam" | "ielts-toefl" | "foundation" | "real-world";

export interface EnglishModule {
  id: string;
  name: string;
  description: string;
  icon: string;
  topics: EnglishTopic[];
}

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
  prerequisites?: string[]; // topic IDs that should be completed first
}

export interface EnglishPath {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  goal: EnglishGoal;
  modules: EnglishModule[];
  totalQuestions: number;
  estimatedWeeks: number;
}

// ============================================================================
// FOUNDATION BUILDER - Complete A1 to B1 Curriculum
// ============================================================================

export const foundationPath: EnglishPath = {
  id: "foundation",
  name: "Foundation Builder",
  description: "Complete English from scratch - Like a professional institute",
  icon: "🏗️",
  color: "#10B981",
  goal: "foundation",
  totalQuestions: 2000,
  estimatedWeeks: 24, // 6 months intensive
  modules: [
    // ========== MODULE 1: ALPHABET & PHONICS (A1 Beginner) ==========
    {
      id: "module-1-alphabet",
      name: "Module 1: Alphabet & Phonics",
      description: "Master the building blocks of English",
      icon: "🔤",
      topics: [
        {
          id: "alphabet-basics",
          name: "English Alphabet",
          description: "26 letters, capital & small, letter sounds",
          icon: "🔤",
          level: "beginner",
          category: "foundation",
          subtopics: [
            "Capital Letters A-Z",
            "Small Letters a-z",
            "Letter Names vs Sounds",
            "Alphabetical Order",
            "Letter Recognition",
          ],
          estimatedTime: 60,
          questionCount: 50,
        },
        {
          id: "phonics-vowels",
          name: "Vowels & Consonants",
          description: "5 vowels (a,e,i,o,u) and 21 consonants",
          icon: "🗣️",
          level: "beginner",
          category: "foundation",
          subtopics: [
            "Short Vowel Sounds (cat, bed, sit)",
            "Long Vowel Sounds (cake, meet, like)",
            "Consonant Sounds (b, c, d...)",
            "Vowel + Consonant Blends",
            "Silent Letters",
          ],
          estimatedTime: 90,
          questionCount: 80,
        },
        {
          id: "pronunciation-basics",
          name: "Pronunciation Fundamentals",
          description: "How to pronounce English sounds correctly",
          icon: "👄",
          level: "beginner",
          category: "foundation",
          subtopics: [
            "Mouth Positions for Sounds",
            "Voiced vs Voiceless Sounds",
            "Minimal Pairs (ship/sheep, bit/beat)",
            "Word Stress Basics",
            "Common Indian Pronunciation Mistakes",
          ],
          estimatedTime: 120,
          questionCount: 100,
        },
      ],
    },

    // ========== MODULE 2: BASIC GRAMMAR (A1) ==========
    {
      id: "module-2-grammar",
      name: "Module 2: Basic Grammar",
      description: "Essential grammar rules everyone must know",
      icon: "📝",
      topics: [
        {
          id: "parts-of-speech",
          name: "Parts of Speech",
          description: "8 types: Noun, Pronoun, Verb, Adjective, Adverb, Preposition, Conjunction, Interjection",
          icon: "🎯",
          level: "beginner",
          category: "foundation",
          subtopics: [
            "Nouns (Person, Place, Thing, Idea)",
            "Pronouns (I, you, he, she, it, we, they)",
            "Verbs (Action words)",
            "Adjectives (Describing words)",
            "Adverbs (How, when, where)",
            "Prepositions (in, on, at, by)",
            "Conjunctions (and, but, or)",
            "Interjections (Wow!, Oh!, Alas!)",
          ],
          estimatedTime: 180,
          questionCount: 150,
        },
        {
          id: "nouns-detailed",
          name: "Nouns in Detail",
          description: "Types, number, gender, case",
          icon: "📦",
          level: "beginner",
          category: "foundation",
          subtopics: [
            "Proper vs Common Nouns",
            "Collective Nouns (team, class, family)",
            "Abstract Nouns (happiness, love, anger)",
            "Material Nouns (gold, water, wood)",
            "Singular vs Plural",
            "Irregular Plurals (child→children, mouse→mice)",
            "Countable vs Uncountable Nouns",
            "Gender (masculine, feminine, neuter)",
          ],
          estimatedTime: 150,
          questionCount: 120,
        },
        {
          id: "pronouns-detailed",
          name: "Pronouns Mastery",
          description: "Personal, possessive, reflexive, demonstrative",
          icon: "👤",
          level: "beginner",
          category: "foundation",
          subtopics: [
            "Subject Pronouns (I, you, he, she, it)",
            "Object Pronouns (me, you, him, her, it)",
            "Possessive Pronouns (my, your, his, her)",
            "Possessive Adjectives vs Pronouns",
            "Reflexive Pronouns (myself, yourself, himself)",
            "Demonstrative Pronouns (this, that, these, those)",
            "Interrogative Pronouns (who, what, which)",
            "Relative Pronouns (who, which, that)",
          ],
          estimatedTime: 120,
          questionCount: 100,
        },
        {
          id: "articles",
          name: "Articles (a, an, the)",
          description: "Definite and indefinite articles with rules",
          icon: "📰",
          level: "beginner",
          category: "foundation",
          subtopics: [
            "Indefinite Articles: A vs An",
            "When to use 'A' (before consonant sounds)",
            "When to use 'An' (before vowel sounds)",
            "Definite Article: The",
            "When to use 'The' (specific things)",
            "When NOT to use articles",
            "Zero Article (going to school, by car)",
            "Common Mistakes Indians Make",
          ],
          estimatedTime: 90,
          questionCount: 80,
        },
        {
          id: "adjectives",
          name: "Adjectives",
          description: "Describing words and comparison",
          icon: "🎨",
          level: "beginner",
          category: "foundation",
          subtopics: [
            "Types of Adjectives (quality, quantity, number)",
            "Order of Adjectives (opinion, size, age, color)",
            "Degrees of Comparison (positive, comparative, superlative)",
            "Comparative: -er, more (bigger, more beautiful)",
            "Superlative: -est, most (biggest, most beautiful)",
            "Irregular Comparisons (good→better→best)",
            "Adjectives vs Adverbs",
          ],
          estimatedTime: 120,
          questionCount: 100,
        },
        {
          id: "verbs-basics",
          name: "Verbs - Action Words",
          description: "Main verbs, helping verbs, modals",
          icon: "⚡",
          level: "beginner",
          category: "foundation",
          subtopics: [
            "Action Verbs (run, eat, sleep, write)",
            "Linking Verbs (is, am, are, was, were)",
            "Helping Verbs (do, does, did, have, has, had)",
            "Modal Verbs (can, could, may, might, must, should)",
            "Transitive vs Intransitive Verbs",
            "Regular vs Irregular Verbs",
            "Verb Forms (V1, V2, V3, V4, V5)",
          ],
          estimatedTime: 150,
          questionCount: 120,
        },
      ],
    },

    // ========== MODULE 2.5: MICRO-LESSONS (A1-B1) ==========
    {
      id: "module-2.5-micro-lessons",
      name: "Module 2.5: Foundation Micro-Lessons",
      description: "41 bite-sized lessons covering A1 to B1 grammar",
      icon: "📝",
      topics: [
        // ===== PHASE 1: ABSOLUTE BASICS (A1) =====
        {
          id: "be-verb-present",
          name: "I Am, You Are, They Are",
          description: "Describing yourself and others using am, is, are",
          icon: "👤",
          level: "beginner",
          category: "foundation",
          subtopics: [
            "I + am + description",
            "He/She/It + is + description",
            "You/We/They + are + description",
            "Present state descriptions",
            "Common mistakes with be-verb"
          ],
          estimatedTime: 5,
          questionCount: 10,
        },
        {
          id: "demonstratives-basic",
          name: "This Is My...",
          description: "Pointing to things near and far (this, that, these, those)",
          icon: "👉",
          level: "beginner",
          category: "foundation",
          subtopics: [
            "This/That for singular",
            "These/Those for plural",
            "Near vs far distinctions",
            "Introducing people and things"
          ],
          estimatedTime: 5,
          questionCount: 10,
        },
        {
          id: "have-got-basic",
          name: "I Have, You Have",
          description: "Talking about possessions and relationships",
          icon: "🎒",
          level: "beginner",
          category: "foundation",
          subtopics: [
            "I/You/We/They have",
            "He/She/It has",
            "Don't have / Doesn't have",
            "Questions with have/has"
          ],
          estimatedTime: 5,
          questionCount: 10,
        },
        {
          id: "articles",
          name: "Using A, An, The",
          description: "When to use articles correctly",
          icon: "📰",
          level: "beginner",
          category: "foundation",
          subtopics: [
            "A vs An (consonant vs vowel sounds)",
            "The (specific things)",
            "Zero article (no article needed)",
            "Common article mistakes"
          ],
          estimatedTime: 5,
          questionCount: 10,
        },
        {
          id: "adjectives-basic",
          name: "Describing Things",
          description: "Colors, sizes, qualities - basic adjectives",
          icon: "🎨",
          level: "beginner",
          category: "foundation",
          subtopics: [
            "Common adjectives",
            "Order of adjectives",
            "Comparative forms (bigger, more beautiful)",
            "Superlative forms (biggest, most beautiful)"
          ],
          estimatedTime: 5,
          questionCount: 10,
        },

        // ===== PHASE 2: DAILY ACTIONS (A1) =====
        {
          id: "present-simple",
          name: "What I Do Every Day",
          description: "Daily routines and habits",
          icon: "☀️",
          level: "beginner",
          category: "foundation",
          subtopics: [
            "Subject + V1 (base form)",
            "Daily routines",
            "Habits and facts",
            "Time expressions"
          ],
          estimatedTime: 5,
          questionCount: 10,
        },
        {
          id: "present-simple-third-person",
          name: "What He/She Does",
          description: "Talking about others' routines (adds -s/-es)",
          icon: "👥",
          level: "beginner",
          category: "foundation",
          subtopics: [
            "He/She/It + V1+s/es",
            "Adding -s/-es rules",
            "Irregular third person (go→goes, do→does)",
            "Describing others' habits"
          ],
          estimatedTime: 5,
          questionCount: 10,
        },
        {
          id: "present-simple-negative",
          name: "I Don't, He Doesn't",
          description: "Saying what you don't do",
          icon: "🚫",
          level: "beginner",
          category: "foundation",
          subtopics: [
            "I/You/We/They + don't + V1",
            "He/She/It + doesn't + V1",
            "Negative statements",
            "Common mistakes"
          ],
          estimatedTime: 5,
          questionCount: 10,
        },
        {
          id: "present-simple-questions",
          name: "Do You...? Does She...?",
          description: "Asking about habits and routines",
          icon: "❓",
          level: "beginner",
          category: "foundation",
          subtopics: [
            "Do + I/you/we/they + V1?",
            "Does + he/she/it + V1?",
            "Yes/No answers",
            "Wh- questions"
          ],
          estimatedTime: 5,
          questionCount: 10,
        },
        {
          id: "present-continuous",
          name: "What I'm Doing Right Now",
          description: "Actions happening at this moment",
          icon: "▶️",
          level: "beginner",
          category: "foundation",
          subtopics: [
            "Subject + am/is/are + V-ing",
            "Actions happening now",
            "Temporary situations",
            "Adding -ing to verbs"
          ],
          estimatedTime: 5,
          questionCount: 10,
        },
        {
          id: "present-continuous-negative",
          name: "Not Doing Something Now",
          description: "Negative continuous actions (I'm not working)",
          icon: "⏸️",
          level: "beginner",
          category: "foundation",
          subtopics: [
            "Am/Is/Are + not + V-ing",
            "Contractions (I'm not, isn't, aren't)",
            "Negative continuous statements"
          ],
          estimatedTime: 5,
          questionCount: 10,
        },
        {
          id: "present-continuous-questions",
          name: "What Are You Doing?",
          description: "Asking about actions happening now",
          icon: "🤔",
          level: "beginner",
          category: "foundation",
          subtopics: [
            "Am/Is/Are + subject + V-ing?",
            "Wh- questions with continuous",
            "Answering continuous questions"
          ],
          estimatedTime: 5,
          questionCount: 10,
        },

        // ===== PHASE 3: TALKING ABOUT THE PAST (A1-A2) =====
        {
          id: "past-simple",
          name: "What I Did Yesterday",
          description: "Completed actions in the past",
          icon: "📅",
          level: "beginner",
          category: "foundation",
          subtopics: [
            "Subject + V2 (past form)",
            "Regular verbs (-ed)",
            "Time expressions (yesterday, last week)",
            "Past statements"
          ],
          estimatedTime: 5,
          questionCount: 10,
        },
        {
          id: "past-simple-irregular",
          name: "Common Irregular Verbs",
          description: "Go→Went, See→Saw, Eat→Ate",
          icon: "🔀",
          level: "beginner",
          category: "foundation",
          subtopics: [
            "Top 50 irregular verbs",
            "No -ed pattern",
            "Common irregular patterns",
            "Practice with irregular verbs"
          ],
          estimatedTime: 5,
          questionCount: 10,
        },
        {
          id: "past-simple-negative",
          name: "I Didn't Do That",
          description: "Negative past statements",
          icon: "⛔",
          level: "beginner",
          category: "foundation",
          subtopics: [
            "Subject + didn't + V1",
            "Did not (formal) vs didn't",
            "Negative past statements"
          ],
          estimatedTime: 5,
          questionCount: 10,
        },
        {
          id: "past-simple-questions",
          name: "Did You...?",
          description: "Asking about the past",
          icon: "❔",
          level: "beginner",
          category: "foundation",
          subtopics: [
            "Did + subject + V1?",
            "Yes/No past questions",
            "Wh- past questions",
            "Short answers"
          ],
          estimatedTime: 5,
          questionCount: 10,
        },
        {
          id: "past-continuous",
          name: "What I Was Doing",
          description: "Actions in progress in the past",
          icon: "⏪",
          level: "beginner",
          category: "foundation",
          subtopics: [
            "Was/Were + V-ing",
            "Actions in progress (past)",
            "Background actions"
          ],
          estimatedTime: 5,
          questionCount: 10,
        },
        {
          id: "past-continuous-while-when",
          name: "While I Was...",
          description: "Two actions at the same time (past)",
          icon: "⏯️",
          level: "beginner",
          category: "foundation",
          subtopics: [
            "While + past continuous",
            "When + past simple",
            "Interrupted actions",
            "Simultaneous past actions"
          ],
          estimatedTime: 5,
          questionCount: 10,
        },

        // ===== PHASE 4: TALKING ABOUT THE FUTURE (A2) =====
        {
          id: "future-simple",
          name: "I Will...",
          description: "Future predictions and promises",
          icon: "🔮",
          level: "beginner",
          category: "foundation",
          subtopics: [
            "Will + V1",
            "Predictions",
            "Spontaneous decisions",
            "Promises and offers"
          ],
          estimatedTime: 5,
          questionCount: 10,
        },
        {
          id: "going-to-future",
          name: "I'm Going To...",
          description: "Plans and intentions",
          icon: "📅",
          level: "beginner",
          category: "foundation",
          subtopics: [
            "Am/Is/Are + going to + V1",
            "Future plans",
            "Intentions",
            "Evidence-based predictions"
          ],
          estimatedTime: 5,
          questionCount: 10,
        },
        {
          id: "future-comparison",
          name: "Will vs Going To",
          description: "Choosing the right future tense",
          icon: "⚖️",
          level: "beginner",
          category: "foundation",
          subtopics: [
            "Will for spontaneous decisions",
            "Going to for plans",
            "Will for predictions",
            "Going to for evidence-based predictions"
          ],
          estimatedTime: 5,
          questionCount: 10,
        },

        // ===== PHASE 5: CONNECTING IDEAS (A2) =====
        {
          id: "present-perfect",
          name: "I Have Done This Before",
          description: "Past with present connection",
          icon: "✅",
          level: "intermediate",
          category: "foundation",
          subtopics: [
            "Has/Have + V3",
            "Life experiences",
            "Unfinished time periods",
            "Recent past actions"
          ],
          estimatedTime: 5,
          questionCount: 10,
        },
        {
          id: "present-perfect-time-markers",
          name: "Ever, Never, Already, Yet",
          description: "Time words with present perfect",
          icon: "🕐",
          level: "intermediate",
          category: "foundation",
          subtopics: [
            "Ever (questions)",
            "Never (negative)",
            "Already (affirmative)",
            "Yet (negative/questions)",
            "Just, recently"
          ],
          estimatedTime: 5,
          questionCount: 10,
        },
        {
          id: "present-perfect-for-since",
          name: "For vs Since",
          description: "Duration vs starting point",
          icon: "⏱️",
          level: "intermediate",
          category: "foundation",
          subtopics: [
            "For + duration (for 3 years)",
            "Since + starting point (since 2020)",
            "How long questions",
            "Common mistakes"
          ],
          estimatedTime: 5,
          questionCount: 10,
        },
        {
          id: "conjunctions-basic",
          name: "And, But, Or, Because",
          description: "Joining sentences with connectors",
          icon: "🔗",
          level: "beginner",
          category: "foundation",
          subtopics: [
            "And (addition)",
            "But (contrast)",
            "Or (choice)",
            "Because (reason)",
            "So (result)"
          ],
          estimatedTime: 5,
          questionCount: 10,
        },
        {
          id: "time-connectors",
          name: "When, Before, After, While",
          description: "Sequencing events in time",
          icon: "⏰",
          level: "beginner",
          category: "foundation",
          subtopics: [
            "When (at the time)",
            "Before (earlier)",
            "After (later)",
            "While (during)",
            "As soon as"
          ],
          estimatedTime: 5,
          questionCount: 10,
        },

        // ===== PHASE 6: ADVANCED STRUCTURES (A2-B1) =====
        {
          id: "modals-can-could",
          name: "Can, Could",
          description: "Ability and possibility",
          icon: "💪",
          level: "intermediate",
          category: "foundation",
          subtopics: [
            "Can (present ability)",
            "Could (past ability)",
            "Could (polite requests)",
            "Could (possibility)"
          ],
          estimatedTime: 5,
          questionCount: 10,
        },
        {
          id: "modals-should-must",
          name: "Should, Must",
          description: "Advice and obligation",
          icon: "📋",
          level: "intermediate",
          category: "foundation",
          subtopics: [
            "Should (advice)",
            "Must (strong obligation)",
            "Must (logical deduction)",
            "Have to vs must"
          ],
          estimatedTime: 5,
          questionCount: 10,
        },
        {
          id: "modals-possibility",
          name: "May, Might, Will",
          description: "Degrees of possibility",
          icon: "🎲",
          level: "intermediate",
          category: "foundation",
          subtopics: [
            "Will (certain)",
            "May (possible)",
            "Might (less certain)",
            "Could (also possible)"
          ],
          estimatedTime: 5,
          questionCount: 10,
        },
        {
          id: "passive-voice-basic",
          name: "It Is Made, It Was Built",
          description: "Passive voice basics",
          icon: "🔄",
          level: "intermediate",
          category: "foundation",
          subtopics: [
            "Be + V3 (past participle)",
            "Present passive (is made)",
            "Past passive (was built)",
            "When to use passive"
          ],
          estimatedTime: 5,
          questionCount: 10,
        },
        {
          id: "passive-voice-tenses",
          name: "Passive in Different Tenses",
          description: "Beyond present and past passive",
          icon: "🔃",
          level: "intermediate",
          category: "foundation",
          subtopics: [
            "Future passive (will be done)",
            "Present perfect passive (has been done)",
            "Modal passive (can be done)",
            "By agent (optional)"
          ],
          estimatedTime: 5,
          questionCount: 10,
        },
        {
          id: "reported-speech-statements",
          name: "He Said That...",
          description: "Reporting what others said",
          icon: "💬",
          level: "intermediate",
          category: "foundation",
          subtopics: [
            "Said that + statement",
            "Tense backshift",
            "Pronoun changes",
            "Time/place changes"
          ],
          estimatedTime: 5,
          questionCount: 10,
        },
        {
          id: "reported-speech-questions",
          name: "He Asked If...",
          description: "Reporting questions",
          icon: "❓💬",
          level: "intermediate",
          category: "foundation",
          subtopics: [
            "Asked if/whether (yes/no)",
            "Asked + wh- word (wh- questions)",
            "Question word order changes",
            "Tense backshift in questions"
          ],
          estimatedTime: 5,
          questionCount: 10,
        },

        // ===== PHASE 7: SPECIAL TOPICS (A2-B1) =====
        {
          id: "conditionals-first",
          name: "If I Do, I Will",
          description: "Real future conditions",
          icon: "🌦️",
          level: "intermediate",
          category: "foundation",
          subtopics: [
            "If + present simple, will + V1",
            "Real future situations",
            "Unless (if not)",
            "When vs if"
          ],
          estimatedTime: 5,
          questionCount: 10,
        },
        {
          id: "conditionals-second",
          name: "If I Did, I Would",
          description: "Hypothetical present situations",
          icon: "💭",
          level: "intermediate",
          category: "foundation",
          subtopics: [
            "If + past simple, would + V1",
            "Unreal present situations",
            "Imaginary scenarios",
            "Advice with would"
          ],
          estimatedTime: 5,
          questionCount: 10,
        },
        {
          id: "conditionals-third",
          name: "If I Had Done, I Would Have",
          description: "Hypothetical past (regrets)",
          icon: "⏮️",
          level: "intermediate",
          category: "foundation",
          subtopics: [
            "If + past perfect, would have + V3",
            "Unreal past situations",
            "Regrets about the past",
            "Different past outcomes"
          ],
          estimatedTime: 5,
          questionCount: 10,
        },
        {
          id: "relative-clauses-defining",
          name: "Who, Which, That",
          description: "Defining relative clauses",
          icon: "🔗",
          level: "intermediate",
          category: "foundation",
          subtopics: [
            "Who (for people)",
            "Which (for things)",
            "That (for people/things)",
            "Defining vs non-defining"
          ],
          estimatedTime: 5,
          questionCount: 10,
        },
        {
          id: "relative-clauses-advanced",
          name: "Where, When, Whose",
          description: "Advanced relative clauses",
          icon: "🔗➕",
          level: "intermediate",
          category: "foundation",
          subtopics: [
            "Where (for places)",
            "When (for time)",
            "Whose (for possession)",
            "Whom (formal, for people)"
          ],
          estimatedTime: 5,
          questionCount: 10,
        },

        // ===== PHASE 8: POLISH & PRACTICE (B1) =====
        {
          id: "common-mistakes-indian-learners",
          name: "Common Mistakes Indians Make",
          description: "L1 interference fixes",
          icon: "🇮🇳",
          level: "intermediate",
          category: "foundation",
          subtopics: [
            "Article mistakes",
            "Preposition confusion",
            "Tense errors",
            "Word order issues",
            "Hindi-to-English traps"
          ],
          estimatedTime: 5,
          questionCount: 10,
        },
        {
          id: "tricky-grammar",
          name: "Tricky Grammar Points",
          description: "Much/Many, Few/Little, etc.",
          icon: "🧩",
          level: "intermediate",
          category: "foundation",
          subtopics: [
            "Much vs Many",
            "Few vs Little",
            "Less vs Fewer",
            "Some vs Any",
            "Each vs Every"
          ],
          estimatedTime: 5,
          questionCount: 10,
        },
        {
          id: "phrasal-verbs-basic",
          name: "Phrasal Verbs Basics",
          description: "Get Up, Look After, Turn On",
          icon: "🔗",
          level: "intermediate",
          category: "foundation",
          subtopics: [
            "Most common 50 phrasal verbs",
            "Separable vs inseparable",
            "Literal vs idiomatic meaning",
            "Phrasal verbs in context"
          ],
          estimatedTime: 5,
          questionCount: 10,
        },
      ],
    },

    // ========== MODULE 3: TENSES (A1-A2) ==========
    {
      id: "module-3-tenses",
      name: "Module 3: Tenses Mastery",
      description: "All 12 tenses with rules, examples, and practice",
      icon: "⏰",
      topics: [
        {
          id: "present-simple",
          name: "Simple Present Tense",
          description: "Daily routines, habits, facts, universal truths",
          icon: "☀️",
          level: "beginner",
          category: "foundation",
          subtopics: [
            "Structure: Subject + V1(s/es)",
            "When to use: habits, facts, schedules",
            "Adding -s/-es for he/she/it",
            "Negative: don't/doesn't + V1",
            "Questions: Do/Does + subject + V1?",
            "Time expressions: always, usually, often, sometimes, never",
            "Common Mistakes",
          ],
          estimatedTime: 120,
          questionCount: 100,
        },
        {
          id: "present-continuous",
          name: "Present Continuous Tense",
          description: "Actions happening now, temporary situations",
          icon: "▶️",
          level: "beginner",
          category: "foundation",
          subtopics: [
            "Structure: Subject + is/am/are + V-ing",
            "When to use: happening now, temporary actions",
            "Adding -ing to verbs",
            "Negative: is/am/are + not + V-ing",
            "Questions: Is/Am/Are + subject + V-ing?",
            "Time expressions: now, at the moment, right now",
            "Stative Verbs (NOT used in continuous)",
          ],
          estimatedTime: 120,
          questionCount: 100,
        },
        {
          id: "present-perfect",
          name: "Present Perfect Tense",
          description: "Past actions with present relevance",
          icon: "✅",
          level: "intermediate",
          category: "foundation",
          subtopics: [
            "Structure: Subject + has/have + V3",
            "When to use: experience, completed actions, unfinished time",
            "Regular V3: -ed (walked, played)",
            "Irregular V3: (eat→eaten, go→gone)",
            "Negative: has/have + not + V3",
            "Questions: Has/Have + subject + V3?",
            "Time expressions: ever, never, already, yet, just, recently",
            "Present Perfect vs Simple Past",
          ],
          estimatedTime: 150,
          questionCount: 120,
        },
        {
          id: "past-simple",
          name: "Simple Past Tense",
          description: "Completed actions in the past",
          icon: "📅",
          level: "beginner",
          category: "foundation",
          subtopics: [
            "Structure: Subject + V2",
            "When to use: finished actions with specific time",
            "Regular V2: -ed (walked, played, studied)",
            "Irregular V2: (go→went, eat→ate, see→saw)",
            "Negative: didn't + V1",
            "Questions: Did + subject + V1?",
            "Time expressions: yesterday, last week, ago, in 1999",
            "Was/Were for 'be' verb",
          ],
          estimatedTime: 120,
          questionCount: 100,
        },
        {
          id: "past-continuous",
          name: "Past Continuous Tense",
          description: "Actions in progress in the past",
          icon: "⏪",
          level: "beginner",
          category: "foundation",
          subtopics: [
            "Structure: Subject + was/were + V-ing",
            "When to use: action in progress at a past time",
            "Negative: was/were + not + V-ing",
            "Questions: Was/Were + subject + V-ing?",
            "Two actions happening together (while, when)",
            "Interrupted actions",
            "Time expressions: at 5pm yesterday, while, when",
          ],
          estimatedTime: 120,
          questionCount: 100,
        },
        {
          id: "future-simple",
          name: "Simple Future Tense (will)",
          description: "Future predictions, decisions, promises",
          icon: "🔮",
          level: "beginner",
          category: "foundation",
          subtopics: [
            "Structure: Subject + will + V1",
            "When to use: predictions, spontaneous decisions, promises",
            "Negative: will not (won't) + V1",
            "Questions: Will + subject + V1?",
            "Time expressions: tomorrow, next week, soon, later",
            "Will vs Shall",
            "Be going to (for plans)",
          ],
          estimatedTime: 120,
          questionCount: 100,
        },
        {
          id: "future-continuous",
          name: "Future Continuous Tense",
          description: "Actions in progress in the future",
          icon: "⏩",
          level: "intermediate",
          category: "foundation",
          subtopics: [
            "Structure: Subject + will be + V-ing",
            "When to use: action in progress at future time",
            "Negative: will not be + V-ing",
            "Questions: Will + subject + be + V-ing?",
            "Time expressions: at this time tomorrow, this time next week",
            "Polite inquiries (Will you be using...?)",
          ],
          estimatedTime: 90,
          questionCount: 80,
        },
        {
          id: "all-tenses-comparison",
          name: "Tense Comparison & Usage",
          description: "When to use which tense - Complete guide",
          icon: "🔄",
          level: "intermediate",
          category: "foundation",
          subtopics: [
            "Timeline of Tenses (Past → Present → Future)",
            "Choosing the Right Tense",
            "Common Tense Confusion (Present Perfect vs Past Simple)",
            "Tense in Conditional Sentences",
            "Tense in Reported Speech",
            "Mixed Tense Practice",
          ],
          estimatedTime: 180,
          questionCount: 150,
        },
      ],
    },

    // ========== MODULE 4: SENTENCE STRUCTURE (A2-B1) ==========
    {
      id: "module-4-sentences",
      name: "Module 4: Sentence Construction",
      description: "Build correct English sentences like a native",
      icon: "🏗️",
      topics: [
        {
          id: "sentence-types",
          name: "Types of Sentences",
          description: "Simple, compound, complex sentences",
          icon: "📝",
          level: "beginner",
          category: "foundation",
          subtopics: [
            "Simple Sentence (one clause)",
            "Compound Sentence (two independent clauses)",
            "Complex Sentence (independent + dependent clause)",
            "Compound-Complex Sentence",
            "Using Conjunctions (and, but, or, so, because)",
            "Subordinating Conjunctions (although, while, unless)",
          ],
          estimatedTime: 120,
          questionCount: 100,
        },
        {
          id: "subject-verb-agreement",
          name: "Subject-Verb Agreement",
          description: "Making subjects and verbs agree in number",
          icon: "🤝",
          level: "intermediate",
          category: "foundation",
          subtopics: [
            "Singular Subject → Singular Verb",
            "Plural Subject → Plural Verb",
            "Compound Subjects (and, or)",
            "Collective Nouns (team, family)",
            "Indefinite Pronouns (everyone, somebody)",
            "Tricky Cases (news, mathematics, economics)",
            "Either/Neither Rules",
          ],
          estimatedTime: 120,
          questionCount: 100,
        },
        {
          id: "active-passive-voice",
          name: "Active & Passive Voice",
          description: "Converting between active and passive constructions",
          icon: "🔄",
          level: "intermediate",
          category: "foundation",
          subtopics: [
            "Active Voice Structure (Subject + Verb + Object)",
            "Passive Voice Structure (Object + be + V3 + by Subject)",
            "When to use Passive Voice",
            "Passive in Different Tenses",
            "Active to Passive Conversion",
            "Passive to Active Conversion",
            "By Agent (when to include/omit)",
          ],
          estimatedTime: 150,
          questionCount: 120,
        },
        {
          id: "direct-indirect-speech",
          name: "Direct & Indirect Speech",
          description: "Reporting what someone said",
          icon: "💬",
          level: "intermediate",
          category: "foundation",
          subtopics: [
            "Direct Speech (He said, \"I am happy\")",
            "Indirect Speech (He said that he was happy)",
            "Tense Changes in Reported Speech",
            "Pronoun Changes",
            "Time & Place Changes (today→that day)",
            "Reporting Questions",
            "Reporting Commands",
          ],
          estimatedTime: 150,
          questionCount: 120,
        },
      ],
    },

    // ========== MODULE 5: VOCABULARY BUILDING (A2-B1) ==========
    {
      id: "module-5-vocabulary",
      name: "Module 5: Vocabulary Building",
      description: "2000+ essential English words",
      icon: "📚",
      topics: [
        {
          id: "basic-vocabulary",
          name: "Essential 1000 Words",
          description: "Most common English words for daily use",
          icon: "💬",
          level: "beginner",
          category: "foundation",
          subtopics: [
            "Common Nouns (200 words)",
            "Common Verbs (200 words)",
            "Common Adjectives (200 words)",
            "Common Adverbs (100 words)",
            "Time Words (today, tomorrow, yesterday)",
            "Place Words (here, there, everywhere)",
            "Quantity Words (some, many, few, much)",
            "Frequency Words (always, never, sometimes)",
          ],
          estimatedTime: 300,
          questionCount: 250,
        },
        {
          id: "synonyms-antonyms",
          name: "Synonyms & Antonyms",
          description: "Words with similar and opposite meanings",
          icon: "↔️",
          level: "intermediate",
          category: "foundation",
          subtopics: [
            "What are Synonyms? (happy = joyful = glad)",
            "What are Antonyms? (happy ↔ sad)",
            "Common Synonym Pairs (500 words)",
            "Common Antonym Pairs (500 words)",
            "Context-Based Synonyms",
            "Using Thesaurus",
          ],
          estimatedTime: 180,
          questionCount: 150,
        },
        {
          id: "word-formation",
          name: "Word Formation",
          description: "Prefixes, suffixes, root words",
          icon: "🌱",
          level: "intermediate",
          category: "foundation",
          subtopics: [
            "Prefixes (un-, re-, pre-, dis-, mis-)",
            "Suffixes (-ness, -tion, -ly, -ful, -less)",
            "Root Words (Latin & Greek)",
            "Compound Words (notebook, sunrise)",
            "Word Families (act, action, active, actor)",
            "Derivation (noun → verb → adjective)",
          ],
          estimatedTime: 120,
          questionCount: 100,
        },
        {
          id: "phrasal-verbs",
          name: "Phrasal Verbs",
          description: "Verbs with prepositions/adverbs (get up, look after)",
          icon: "🔗",
          level: "intermediate",
          category: "foundation",
          subtopics: [
            "What are Phrasal Verbs?",
            "Common Phrasal Verbs (100 most used)",
            "Separable vs Inseparable",
            "Phrasal Verbs with 'get'",
            "Phrasal Verbs with 'take'",
            "Phrasal Verbs with 'put'",
            "Phrasal Verbs with 'look'",
          ],
          estimatedTime: 150,
          questionCount: 120,
        },
        {
          id: "idioms-proverbs",
          name: "Idioms & Proverbs",
          description: "Common expressions and sayings",
          icon: "💡",
          level: "intermediate",
          category: "foundation",
          subtopics: [
            "What are Idioms? (Piece of cake, Break a leg)",
            "100 Common Idioms",
            "Idioms with Body Parts (head, hand, foot)",
            "Idioms with Colors",
            "Idioms with Animals",
            "Common Proverbs",
            "When to Use Idioms",
          ],
          estimatedTime: 120,
          questionCount: 100,
        },
      ],
    },

    // ========== MODULE 6: READING & COMPREHENSION (A2-B1) ==========
    {
      id: "module-6-reading",
      name: "Module 6: Reading Skills",
      description: "From simple stories to complex passages",
      icon: "📖",
      topics: [
        {
          id: "reading-basics",
          name: "Reading Fundamentals",
          description: "How to read English effectively",
          icon: "👀",
          level: "beginner",
          category: "foundation",
          subtopics: [
            "Reading Aloud vs Silent Reading",
            "Reading Speed Techniques",
            "Skimming (getting main idea)",
            "Scanning (finding specific info)",
            "Understanding Context Clues",
            "Guessing Word Meanings",
          ],
          estimatedTime: 90,
          questionCount: 80,
        },
        {
          id: "short-stories",
          name: "Short Stories",
          description: "Simple stories with comprehension questions",
          icon: "📕",
          level: "beginner",
          category: "foundation",
          subtopics: [
            "50-100 word stories",
            "Main Character & Plot",
            "Setting & Theme",
            "Story Sequence",
            "Moral of the Story",
            "Retelling Stories",
          ],
          estimatedTime: 150,
          questionCount: 120,
        },
        {
          id: "comprehension-passages",
          name: "Reading Comprehension",
          description: "Passages with questions (100-200 words)",
          icon: "📰",
          level: "intermediate",
          category: "foundation",
          subtopics: [
            "Factual Passages",
            "Narrative Passages",
            "Descriptive Passages",
            "Main Idea Questions",
            "Detail Questions",
            "Inference Questions",
            "Vocabulary in Context",
          ],
          estimatedTime: 180,
          questionCount: 150,
        },
      ],
    },

    // ========== MODULE 7: WRITING SKILLS (A2-B1) ==========
    {
      id: "module-7-writing",
      name: "Module 7: Writing Skills",
      description: "From sentences to essays",
      icon: "✍️",
      topics: [
        {
          id: "sentence-writing",
          name: "Writing Correct Sentences",
          description: "Punctuation, capitalization, structure",
          icon: "📝",
          level: "beginner",
          category: "foundation",
          subtopics: [
            "Capitalization Rules (I, names, places)",
            "Full Stops, Commas, Question Marks",
            "Exclamation Marks, Apostrophes",
            "Writing Complete Sentences",
            "Avoiding Run-on Sentences",
            "Avoiding Sentence Fragments",
          ],
          estimatedTime: 120,
          questionCount: 100,
        },
        {
          id: "paragraph-writing",
          name: "Paragraph Writing",
          description: "Organizing ideas in paragraphs",
          icon: "📄",
          level: "intermediate",
          category: "foundation",
          subtopics: [
            "Topic Sentence",
            "Supporting Sentences",
            "Concluding Sentence",
            "Unity & Coherence",
            "Transition Words (First, Then, Finally)",
            "Types of Paragraphs (descriptive, narrative)",
          ],
          estimatedTime: 150,
          questionCount: 120,
        },
        {
          id: "essay-writing-basics",
          name: "Essay Writing Basics",
          description: "Introduction to essay structure",
          icon: "📋",
          level: "intermediate",
          category: "foundation",
          subtopics: [
            "Essay Structure (Intro, Body, Conclusion)",
            "Thesis Statement",
            "Introduction Techniques",
            "Body Paragraph Structure",
            "Conclusion Techniques",
            "Essay Types (narrative, descriptive, opinion)",
          ],
          estimatedTime: 180,
          questionCount: 150,
        },
        {
          id: "letter-writing",
          name: "Letter Writing",
          description: "Formal and informal letters",
          icon: "✉️",
          level: "intermediate",
          category: "foundation",
          subtopics: [
            "Letter Format (Date, Address, Salutation)",
            "Formal Letters (job, complaint, request)",
            "Informal Letters (friends, family)",
            "Email Format",
            "Opening & Closing Phrases",
            "Common Letter Writing Mistakes",
          ],
          estimatedTime: 120,
          questionCount: 100,
        },
      ],
    },

    // ========== MODULE 8: SPEAKING & LISTENING (A2-B1) ==========
    {
      id: "module-8-speaking",
      name: "Module 8: Speaking & Listening",
      description: "Practical communication skills",
      icon: "🎙️",
      topics: [
        {
          id: "daily-conversations",
          name: "Daily Conversations",
          description: "Common everyday dialogues",
          icon: "💬",
          level: "beginner",
          category: "foundation",
          subtopics: [
            "Greetings & Introductions",
            "Asking for Directions",
            "Shopping & Bargaining",
            "Ordering Food at Restaurants",
            "Making Phone Calls",
            "Doctor Appointments",
            "Bank Conversations",
            "Travel Situations",
          ],
          estimatedTime: 150,
          questionCount: 120,
        },
        {
          id: "pronunciation-practice",
          name: "Pronunciation Practice",
          description: "Speak English clearly and confidently",
          icon: "🗣️",
          level: "intermediate",
          category: "foundation",
          subtopics: [
            "Difficult Sounds for Indians (v/w, th, r/l)",
            "Word Stress Patterns",
            "Sentence Stress & Rhythm",
            "Intonation (rising, falling)",
            "Connected Speech (gonna, wanna)",
            "Common Pronunciation Errors",
          ],
          estimatedTime: 120,
          questionCount: 100,
        },
        {
          id: "listening-comprehension",
          name: "Listening Skills",
          description: "Understanding spoken English",
          icon: "👂",
          level: "intermediate",
          category: "foundation",
          subtopics: [
            "Understanding Native Speakers",
            "Different Accents (British, American)",
            "Listening for Main Ideas",
            "Listening for Specific Information",
            "Understanding Context",
            "Note-Taking While Listening",
          ],
          estimatedTime: 120,
          questionCount: 100,
        },
      ],
    },
  ],
};

// Export helper function to convert to the old format
export function getFoundationTopicsLegacy() {
  const allTopics: EnglishTopic[] = [];
  foundationPath.modules.forEach(module => {
    allTopics.push(...module.topics);
  });
  return allTopics;
}
