// Advanced English - B2 to C1 Level Topics
// Upper-Intermediate to Advanced English for competitive exams

// Internal interfaces for module structure
interface AdvancedTopicInternal {
  id: string;
  name: string;
  description: string;
  icon: string;
  level: "intermediate" | "advanced";
  cefrLevel: "B2" | "C1" | "C2";
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

    // ==================== MODULE 8: C1 Advanced Structures ====================
    // Cambridge C1 (Advanced / CAE) — expands the thin C1 tier so learners have
    // a full Advanced curriculum before Proficiency.
    {
      id: "c1-advanced-structures",
      name: "Module 8: Advanced Sentence Structures (C1)",
      description: "Cleft sentences, fronting, participle clauses, and emphasis",
      icon: "🏛️",
      level: "advanced",
      topics: [
        {
          id: "cleft-sentences",
          name: "Cleft Sentences",
          description: "Restructure sentences for emphasis with it- and wh- clefts",
          icon: "✂️",
          level: "advanced",
          cefrLevel: "C1",
          category: "advanced",
          subtopics: [
            "It-clefts (It was John who...)",
            "Wh-clefts (What I need is...)",
            "All-clefts and the thing is...",
            "Emphasising different elements",
            "Cleft sentences in formal writing",
          ],
          estimatedTime: 90,
          questionCount: 50,
          prerequisite: ["sentence-types"],
        },
        {
          id: "fronting-emphasis",
          name: "Fronting & Emphasis",
          description: "Move elements to the front for stylistic emphasis",
          icon: "⬆️",
          level: "advanced",
          cefrLevel: "C1",
          category: "advanced",
          subtopics: [
            "Fronting objects and complements",
            "Fronting for contrast",
            "Negative adverbial fronting",
            "Emphatic 'do/did'",
            "Stylistic effect in writing",
          ],
          estimatedTime: 90,
          questionCount: 50,
          prerequisite: ["inversion-conditionals"],
        },
        {
          id: "participle-clauses",
          name: "Participle Clauses",
          description: "Condense clauses with -ing, -ed, and perfect participles",
          icon: "🔗",
          level: "advanced",
          cefrLevel: "C1",
          category: "advanced",
          subtopics: [
            "Present participle clauses (-ing)",
            "Past participle clauses (-ed)",
            "Perfect participle clauses (having done)",
            "Reducing relative and adverbial clauses",
            "Dangling participles to avoid",
          ],
          estimatedTime: 90,
          questionCount: 50,
          prerequisite: ["reduced-relative-clauses"],
        },
        {
          id: "advanced-passive-reporting",
          name: "Advanced Passive & Reporting",
          description: "Impersonal passive and distancing report structures",
          icon: "📰",
          level: "advanced",
          cefrLevel: "C1",
          category: "advanced",
          subtopics: [
            "It is said that... / He is said to...",
            "Passive with reporting verbs",
            "The passive of get and have",
            "Causative structures (have/get something done)",
            "Distancing and objectivity in academic writing",
          ],
          estimatedTime: 90,
          questionCount: 50,
          prerequisite: ["passive-voice"],
        },
        {
          id: "subjunctive-unreal-past",
          name: "Subjunctive & Unreal Past",
          description: "Formal subjunctive and unreal past for wishes and regrets",
          icon: "🕰️",
          level: "advanced",
          cefrLevel: "C1",
          category: "advanced",
          subtopics: [
            "Present subjunctive (I suggest that he be...)",
            "Were-subjunctive (If I were...)",
            "Unreal past after wish / if only",
            "It's time / would rather + past",
            "Formal register of the subjunctive",
          ],
          estimatedTime: 90,
          questionCount: 50,
          prerequisite: ["conditionals"],
        },
      ],
    },

    // ==================== MODULE 9: C1 Advanced Expression ====================
    {
      id: "c1-advanced-expression",
      name: "Module 9: Advanced Expression & Style (C1)",
      description: "Nominalisation, hedging, cohesion, and discourse control",
      icon: "🎨",
      level: "advanced",
      topics: [
        {
          id: "nominalisation",
          name: "Nominalisation",
          description: "Turn verbs and adjectives into nouns for formal density",
          icon: "🧱",
          level: "advanced",
          cefrLevel: "C1",
          category: "advanced",
          subtopics: [
            "Verb-to-noun transformations",
            "Adjective-to-noun transformations",
            "Information density in academic style",
            "Nominalisation vs plain verbs",
            "Overuse and readability trade-offs",
          ],
          estimatedTime: 90,
          questionCount: 50,
          prerequisite: ["formal-informal-register"],
        },
        {
          id: "hedging-cautious-language",
          name: "Hedging & Cautious Language",
          description: "Soften claims with tentative, academic language",
          icon: "🌫️",
          level: "advanced",
          cefrLevel: "C1",
          category: "advanced",
          subtopics: [
            "Modal hedges (may, might, could)",
            "Tentative verbs (suggest, appear, tend to)",
            "Qualifying adverbs (arguably, largely)",
            "Distancing (it could be argued that)",
            "Hedging in academic writing",
          ],
          estimatedTime: 90,
          questionCount: 50,
          prerequisite: ["academic-vocabulary"],
        },
        {
          id: "discourse-markers-cohesion",
          name: "Discourse Markers & Cohesion",
          description: "Link ideas smoothly across sentences and paragraphs",
          icon: "🔀",
          level: "advanced",
          cefrLevel: "C1",
          category: "advanced",
          subtopics: [
            "Contrast and concession markers",
            "Cause, result, and purpose linkers",
            "Adding, sequencing, and exemplifying",
            "Referencing and signposting",
            "Cohesion vs coherence",
          ],
          estimatedTime: 90,
          questionCount: 50,
          prerequisite: ["connecting-ideas"],
        },
        {
          id: "ellipsis-substitution",
          name: "Ellipsis & Substitution",
          description: "Omit and replace repeated words for natural flow",
          icon: "➖",
          level: "advanced",
          cefrLevel: "C1",
          category: "advanced",
          subtopics: [
            "Ellipsis after auxiliaries",
            "Substitution with so / do / one",
            "Ellipsis in coordinated clauses",
            "Reduced answers and comparatives",
            "Ellipsis in spoken vs written English",
          ],
          estimatedTime: 75,
          questionCount: 50,
          prerequisite: ["sentence-types"],
        },
        {
          id: "word-formation-affixation",
          name: "Word Formation & Affixation",
          description: "Build word families with prefixes and suffixes",
          icon: "🧩",
          level: "advanced",
          cefrLevel: "C1",
          category: "advanced",
          subtopics: [
            "Common and negative prefixes",
            "Noun, verb, and adjective suffixes",
            "Word families and part-of-speech shifts",
            "Spelling changes when adding affixes",
            "Word formation in the CAE exam",
          ],
          estimatedTime: 90,
          questionCount: 50,
          prerequisite: ["academic-vocabulary"],
        },
        {
          id: "advanced-phrasal-verbs",
          name: "Advanced Phrasal Verbs",
          description: "Master multi-word verbs and their nuances",
          icon: "🧗",
          level: "advanced",
          cefrLevel: "C1",
          category: "advanced",
          subtopics: [
            "Three-part phrasal verbs",
            "Separable vs inseparable",
            "Literal vs idiomatic meanings",
            "Phrasal verbs in formal registers",
            "Nominalised phrasal verbs (a breakdown)",
          ],
          estimatedTime: 90,
          questionCount: 50,
          prerequisite: ["collocations-advanced"],
        },
      ],
    },

    // ==================== MODULE 10: C1 Advanced Skills ====================
    {
      id: "c1-advanced-skills",
      name: "Module 10: Advanced Writing & Reading (C1)",
      description: "Extended writing genres and reading for inference",
      icon: "🖋️",
      level: "advanced",
      topics: [
        {
          id: "advanced-essay-genres",
          name: "Advanced Essay & Proposal Writing",
          description: "Structure proposals, reports, and argumentative essays",
          icon: "📄",
          level: "advanced",
          cefrLevel: "C1",
          category: "advanced",
          subtopics: [
            "Proposal structure and recommendations",
            "Balanced argumentative essays",
            "Reviews with evaluation",
            "Formal report conventions",
            "Persuasive and evaluative language",
          ],
          estimatedTime: 120,
          questionCount: 50,
          prerequisite: ["essay-writing"],
        },
        {
          id: "reading-for-inference",
          name: "Reading for Inference",
          description: "Read between the lines for implied meaning and tone",
          icon: "🔎",
          level: "advanced",
          cefrLevel: "C1",
          category: "advanced",
          subtopics: [
            "Distinguishing fact from opinion",
            "Inferring attitude and purpose",
            "Understanding implication and nuance",
            "Following complex argumentation",
            "Guessing meaning from context",
          ],
          estimatedTime: 90,
          questionCount: 50,
          prerequisite: ["idioms-expressions"],
        },
        {
          id: "register-tone-control",
          name: "Register & Tone Control",
          description: "Shift precisely between formal, neutral, and informal tones",
          icon: "🎚️",
          level: "advanced",
          cefrLevel: "C1",
          category: "advanced",
          subtopics: [
            "Formal, neutral, and informal registers",
            "Diplomatic and tactful language",
            "Tone in emails and correspondence",
            "Adjusting tone for audience",
            "Consistency of register",
          ],
          estimatedTime: 75,
          questionCount: 50,
          prerequisite: ["formal-informal-register"],
        },
      ],
    },

    // ==================== MODULE 11: C2 Mastery — Structures ====================
    // Cambridge C2 (Proficiency / CPE) — the Expert tier. Authored from scratch.
    {
      id: "c2-mastery-structures",
      name: "Module 11: Expert Structures (C2)",
      description: "Stylistic inversion, complex fronting, and nuanced modality",
      icon: "👑",
      level: "advanced",
      topics: [
        {
          id: "stylistic-inversion",
          name: "Stylistic Inversion",
          description: "Deploy inversion for rhetorical and literary effect",
          icon: "🔃",
          level: "advanced",
          cefrLevel: "C2",
          category: "advanced",
          subtopics: [
            "Inversion after negative adverbials",
            "Inversion in conditional clauses",
            "Inversion after so/such and adverbs of place",
            "Literary and rhetorical inversion",
            "Formal vs archaic effect",
          ],
          estimatedTime: 100,
          questionCount: 50,
          prerequisite: ["fronting-emphasis"],
        },
        {
          id: "complex-fronting-thematisation",
          name: "Complex Fronting & Thematisation",
          description: "Control information flow through advanced word order",
          icon: "🎬",
          level: "advanced",
          cefrLevel: "C2",
          category: "advanced",
          subtopics: [
            "Theme and rheme in discourse",
            "Marked vs unmarked word order",
            "Fronting for cohesion and focus",
            "End-weight and end-focus principles",
            "Information packaging in writing",
          ],
          estimatedTime: 100,
          questionCount: 50,
          prerequisite: ["cleft-sentences"],
        },
        {
          id: "advanced-ellipsis-substitution",
          name: "Advanced Ellipsis & Substitution",
          description: "Master subtle omission across complex discourse",
          icon: "🫥",
          level: "advanced",
          cefrLevel: "C2",
          category: "advanced",
          subtopics: [
            "Gapping and stripping",
            "Cross-clause ellipsis",
            "Substitution in extended discourse",
            "Ambiguity from ellipsis",
            "Ellipsis in literary style",
          ],
          estimatedTime: 90,
          questionCount: 50,
          prerequisite: ["ellipsis-substitution"],
        },
        {
          id: "nuanced-modality",
          name: "Nuanced Modality",
          description: "Command the finest shades of modal meaning",
          icon: "🎭",
          level: "advanced",
          cefrLevel: "C2",
          category: "advanced",
          subtopics: [
            "Epistemic vs deontic modality",
            "Modal harmony and layering",
            "Speculation about the past",
            "Retrospective modal judgement",
            "Modality in formal and legal English",
          ],
          estimatedTime: 100,
          questionCount: 50,
          prerequisite: ["modal-nuances"],
        },
        {
          id: "mixed-hypotheticals",
          name: "Mixed & Advanced Hypotheticals",
          description: "Blend time frames in sophisticated conditional reasoning",
          icon: "🔮",
          level: "advanced",
          cefrLevel: "C2",
          category: "advanced",
          subtopics: [
            "Multi-clause mixed conditionals",
            "Implied and reduced conditionals",
            "Inverted and formal conditionals",
            "Hypothetical meaning without 'if'",
            "Nuanced regret and counterfactuals",
          ],
          estimatedTime: 100,
          questionCount: 50,
          prerequisite: ["subjunctive-unreal-past"],
        },
        {
          id: "cohesion-referencing-mastery",
          name: "Cohesion & Referencing Mastery",
          description: "Weave seamless texts with expert referencing",
          icon: "🕸️",
          level: "advanced",
          cefrLevel: "C2",
          category: "advanced",
          subtopics: [
            "Anaphoric and cataphoric reference",
            "Lexical cohesion and reiteration",
            "Substitution across paragraphs",
            "Signposting in long texts",
            "Coherence at discourse level",
          ],
          estimatedTime: 90,
          questionCount: 50,
          prerequisite: ["discourse-markers-cohesion"],
        },
      ],
    },

    // ==================== MODULE 12: C2 Mastery — Vocabulary ====================
    {
      id: "c2-mastery-vocabulary",
      name: "Module 12: Expert Vocabulary (C2)",
      description: "Idiomatic mastery, figurative language, and precise word choice",
      icon: "💎",
      level: "advanced",
      topics: [
        {
          id: "idiomatic-mastery",
          name: "Idiomatic Mastery",
          description: "Use idioms naturally and appropriately in any register",
          icon: "🗝️",
          level: "advanced",
          cefrLevel: "C2",
          category: "advanced",
          subtopics: [
            "Opaque and semi-idiomatic expressions",
            "Register-sensitive idiom use",
            "Idioms in spoken vs written English",
            "Regional and cultural idioms",
            "Avoiding overuse and clichés",
          ],
          estimatedTime: 100,
          questionCount: 50,
          prerequisite: ["idioms-expressions"],
        },
        {
          id: "figurative-language",
          name: "Figurative Language",
          description: "Interpret and craft metaphor, metonymy, and imagery",
          icon: "🎨",
          level: "advanced",
          cefrLevel: "C2",
          category: "advanced",
          subtopics: [
            "Metaphor and simile",
            "Metonymy and synecdoche",
            "Personification and hyperbole",
            "Dead vs living metaphors",
            "Figurative language in argument",
          ],
          estimatedTime: 90,
          questionCount: 50,
          prerequisite: ["idiomatic-mastery"],
        },
        {
          id: "collocation-precision",
          name: "Collocation Precision",
          description: "Choose exactly the right word combinations",
          icon: "🎯",
          level: "advanced",
          cefrLevel: "C2",
          category: "advanced",
          subtopics: [
            "Strong vs weak collocations",
            "Delexical verbs and light verbs",
            "Collocation in academic English",
            "Common collocation errors at C2",
            "Building a collocation repertoire",
          ],
          estimatedTime: 90,
          questionCount: 50,
          prerequisite: ["collocations-advanced"],
        },
        {
          id: "near-synonym-nuance",
          name: "Near-Synonym Nuance",
          description: "Distinguish the fine shades between similar words",
          icon: "🔬",
          level: "advanced",
          cefrLevel: "C2",
          category: "advanced",
          subtopics: [
            "Connotation vs denotation",
            "Register differences among synonyms",
            "Intensity and gradation",
            "Collocational restrictions",
            "Choosing the precise word",
          ],
          estimatedTime: 90,
          questionCount: 50,
          prerequisite: ["synonyms-antonyms"],
        },
        {
          id: "advanced-word-formation",
          name: "Advanced Word Formation",
          description: "Exploit derivation, conversion, and compounding at expert level",
          icon: "⚗️",
          level: "advanced",
          cefrLevel: "C2",
          category: "advanced",
          subtopics: [
            "Complex derivation chains",
            "Conversion and zero-derivation",
            "Compounding patterns",
            "Neologisms and productivity",
            "Word formation in the CPE exam",
          ],
          estimatedTime: 90,
          questionCount: 50,
          prerequisite: ["word-formation-affixation"],
        },
        {
          id: "rhetorical-devices",
          name: "Rhetorical Devices",
          description: "Persuade with parallelism, antithesis, and rhetorical craft",
          icon: "📣",
          level: "advanced",
          cefrLevel: "C2",
          category: "advanced",
          subtopics: [
            "Parallelism and tricolon",
            "Antithesis and chiasmus",
            "Rhetorical questions",
            "Anaphora and repetition for effect",
            "Rhetoric in speeches and essays",
          ],
          estimatedTime: 90,
          questionCount: 50,
          prerequisite: ["advanced-essay-genres"],
        },
      ],
    },

    // ==================== MODULE 13: C2 Mastery — Communication ====================
    {
      id: "c2-mastery-communication",
      name: "Module 13: Expert Communication (C2)",
      description: "Formality gradation, pragmatics, and proficiency-level skills",
      icon: "🎓",
      level: "advanced",
      topics: [
        {
          id: "formality-gradation",
          name: "Formality Gradation",
          description: "Move fluidly across the full formality spectrum",
          icon: "🎚️",
          level: "advanced",
          cefrLevel: "C2",
          category: "advanced",
          subtopics: [
            "The formality cline",
            "Colloquial, neutral, and elevated diction",
            "Latinate vs Anglo-Saxon vocabulary",
            "Matching tone to genre",
            "Deliberate register shifting for effect",
          ],
          estimatedTime: 90,
          questionCount: 50,
          prerequisite: ["register-tone-control"],
        },
        {
          id: "paraphrase-summary-mastery",
          name: "Paraphrase & Summary Mastery",
          description: "Condense and rephrase complex texts with precision",
          icon: "🗜️",
          level: "advanced",
          cefrLevel: "C2",
          category: "advanced",
          subtopics: [
            "Faithful paraphrase without plagiarism",
            "Multi-source summary",
            "Preserving nuance while condensing",
            "Reformulating for different audiences",
            "CPE summary task strategies",
          ],
          estimatedTime: 100,
          questionCount: 50,
          prerequisite: ["reading-for-inference"],
        },
        {
          id: "pragmatics-implicature",
          name: "Pragmatics & Implicature",
          description: "Grasp meaning beyond the literal — implication and inference",
          icon: "🧠",
          level: "advanced",
          cefrLevel: "C2",
          category: "advanced",
          subtopics: [
            "Grice's maxims and implicature",
            "Presupposition and entailment",
            "Politeness and face",
            "Irony, understatement, and sarcasm",
            "Reading speaker intention",
          ],
          estimatedTime: 90,
          questionCount: 50,
          prerequisite: ["reading-for-inference"],
        },
        {
          id: "proficiency-writing",
          name: "Proficiency Writing",
          description: "Produce sophisticated, well-organised extended texts",
          icon: "✍️",
          level: "advanced",
          cefrLevel: "C2",
          category: "advanced",
          subtopics: [
            "Essays with sophisticated argument",
            "Articles and reviews with voice",
            "Cohesive extended discourse",
            "Stylistic range and flair",
            "Editing for precision and concision",
          ],
          estimatedTime: 120,
          questionCount: 50,
          prerequisite: ["advanced-essay-genres"],
        },
        {
          id: "reading-tone-attitude",
          name: "Reading for Tone & Attitude",
          description: "Detect subtle authorial stance in demanding texts",
          icon: "🎼",
          level: "advanced",
          cefrLevel: "C2",
          category: "advanced",
          subtopics: [
            "Detecting irony and bias",
            "Authorial voice and stance",
            "Evaluative and emotive language",
            "Comparing perspectives across texts",
            "Nuance in literary and journalistic prose",
          ],
          estimatedTime: 90,
          questionCount: 50,
          prerequisite: ["pragmatics-implicature"],
        },
        {
          id: "proficiency-speaking",
          name: "Proficiency Speaking",
          description: "Speak with near-native fluency, precision, and flexibility",
          icon: "🎙️",
          level: "advanced",
          cefrLevel: "C2",
          category: "advanced",
          subtopics: [
            "Sustained fluent monologue",
            "Nuanced negotiation and discussion",
            "Idiomatic and spontaneous speech",
            "Managing complex interaction",
            "Precision under time pressure",
          ],
          estimatedTime: 100,
          questionCount: 50,
          prerequisite: ["debate-discussion"],
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
  cefrLevel: "B2" | "C1" | "C2";
  category: "ielts-toefl" | "foundation" | "advanced" | "real-world";
  subtopics: string[];
  estimatedTime: number;
  questionCount: number;
};

// Helper to flatten all topics and convert to EnglishTopic format
export const getAllAdvancedTopics = (): ExportedEnglishTopic[] => {
  return advancedEnglishPath.modules.flatMap(module =>
    module.topics.map(topic => ({
      id: topic.id,
      name: topic.name,
      description: topic.description,
      icon: topic.icon,
      level: topic.level as "intermediate" | "advanced", // Already correct
      cefrLevel: topic.cefrLevel,
      category: "advanced" as const,
      subtopics: topic.subtopics,
      estimatedTime: topic.estimatedTime,
      questionCount: topic.questionCount,
    }))
  );
};

// A module with its topics converted to the exported EnglishTopic shape.
export type ExportedEnglishModule = {
  id: string;
  name: string;
  description: string;
  icon: string;
  topics: ExportedEnglishTopic[];
};

// Helper to expose the module grouping (name, description, topics) for the UI.
export const getAdvancedModules = (): ExportedEnglishModule[] => {
  return advancedEnglishPath.modules.map(module => ({
    id: module.id,
    name: module.name,
    description: module.description,
    icon: module.icon,
    topics: module.topics.map(topic => ({
      id: topic.id,
      name: topic.name,
      description: topic.description,
      icon: topic.icon,
      level: topic.level as "intermediate" | "advanced",
      cefrLevel: topic.cefrLevel,
      category: "advanced" as const,
      subtopics: topic.subtopics,
      estimatedTime: topic.estimatedTime,
      questionCount: topic.questionCount,
    })),
  }));
};

// Helper to get topics by CEFR level (internal use)
export const getAdvancedTopicsByLevel = (level: "B2" | "C1" | "C2"): ExportedEnglishTopic[] => {
  const allTopics = advancedEnglishPath.modules.flatMap(module => module.topics);
  return allTopics
    .filter(topic => topic.cefrLevel === level)
    .map(topic => ({
      id: topic.id,
      name: topic.name,
      description: topic.description,
      icon: topic.icon,
      level: topic.level as "intermediate" | "advanced",
      cefrLevel: topic.cefrLevel,
      category: "advanced" as const,
      subtopics: topic.subtopics,
      estimatedTime: topic.estimatedTime,
      questionCount: topic.questionCount,
    }));
};
