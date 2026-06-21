import { Pool } from 'pg';
import { config } from 'dotenv';

config({ path: '.env.local' });

/**
 * Adverbs Complete Questions - Batch 1
 * Topic: adverbs-complete (A2 level)
 * Subtopics: Types of Adverbs (15), Adverbs of Manner (15), Adverbs of Frequency (15)
 */

const ADVERBS_BATCH1 = [
  // SUBTOPIC 1: Types of Adverbs - 15 questions
  {
    question: "What is an adverb?",
    options: [
      "A word that describes a verb, adjective, or another adverb",
      "A word that describes only nouns",
      "A word that connects sentences",
      "A word that replaces a noun"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Adverbs modify (describe) three things: (1) Verbs: 'runs quickly', (2) Adjectives: 'very beautiful', (3) Other adverbs: 'extremely quickly'. They tell us HOW, WHEN, WHERE, or HOW MUCH something happens. Most adverbs end in '-ly' but not all.",
      formula: "Adverb modifies: verb (runs quickly) | adjective (very big) | adverb (too slowly)",
      trapAlerts: [
        "Words describing only nouns are adjectives, not adverbs (beautiful house)",
        "Connecting words are conjunctions (and, but, or), not adverbs",
        "Words replacing nouns are pronouns (he, she, it), not adverbs"
      ],
      commonMistakes: [
        "Confusing adjectives (describe nouns) with adverbs (describe verbs/adjectives)",
        "Thinking all -ly words are adverbs (friendly, lovely, ugly are adjectives)"
      ]
    },
    difficulty: "easy",
    level: "A2"
  },
  {
    question: "Identify the adverb:\n\n'She speaks English fluently.'",
    options: ["fluently", "speaks", "English", "She"],
    correctAnswer: 0,
    explanation: {
      logic: "'Fluently' describes HOW she speaks - it modifies the verb 'speaks'. Adverbs answer questions like: How? When? Where? How often? 'Fluently' answers 'How does she speak?'",
      formula: "Verb + adverb (speaks fluently, runs quickly, works hard)",
      trapAlerts: [
        "'speaks' is the verb being described, not the describer",
        "'English' is a noun (the language), not an adverb",
        "'She' is a pronoun (subject), not an adverb"
      ],
      commonMistakes: [
        "Identifying the verb instead of the word describing the verb",
        "Not asking 'How?' to find manner adverbs"
      ]
    },
    difficulty: "easy",
    level: "A2"
  },
  {
    question: "What type of word does an adverb usually describe?",
    options: [
      "Verbs (action words)",
      "Nouns only",
      "Pronouns only",
      "Prepositions only"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Adverbs MOST COMMONLY describe verbs (action words): 'runs quickly', 'speaks softly', 'works hard'. They can also describe adjectives ('very tall') and other adverbs ('too slowly'), but verbs are the primary target.",
      formula: "Most common: adverb + verb (quickly runs, slowly walks, carefully writes)",
      trapAlerts: [
        "Nouns are described by adjectives, not adverbs (beautiful house, not beautifully house)",
        "Pronouns are rarely directly modified by adverbs",
        "Prepositions (in, on, at) are not modified by adverbs"
      ],
      commonMistakes: [
        "Using adverbs to describe nouns instead of adjectives",
        "Not recognizing that verbs are the main target of adverbs"
      ]
    },
    difficulty: "easy",
    level: "A2"
  },
  {
    question: "Which sentence contains an adverb?",
    options: [
      "He runs fast.",
      "He is tall.",
      "This is a book.",
      "She has two brothers."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Fast' is an adverb describing HOW he runs. Other sentences have no adverbs: 'tall' is adjective (describes 'he'), 'book' is noun, 'two' is number/determiner. Only sentence A has a word describing the verb.",
      formula: "Verb + adverb = runs fast | Linking verb + adjective = is tall",
      trapAlerts: [
        "'tall' describes the noun/pronoun 'he' - it's an adjective, not adverb",
        "'book' is a noun being identified, no description of action",
        "'two' is a number/determiner, not describing how an action happens"
      ],
      commonMistakes: [
        "Confusing adjectives after 'be' verbs with adverbs",
        "Thinking 'fast' looks like adjective because no -ly ending"
      ]
    },
    difficulty: "easy",
    level: "A2"
  },
  {
    question: "How do most adverbs end?",
    options: [
      "With -ly (quickly, slowly, carefully)",
      "With -ed (walked, talked)",
      "With -ing (running, walking)",
      "With -s (runs, walks)"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "MOST adverbs end in '-ly': quickly, slowly, carefully, beautifully, happily. To form: adjective + ly (quick → quickly, slow → slowly). BUT important: not all -ly words are adverbs (friendly, lovely = adjectives), and not all adverbs end in -ly (fast, hard, well).",
      formula: "Adjective + ly = adverb (quick → quickly, careful → carefully)",
      trapAlerts: [
        "'-ed' endings are past tense verbs or past participles, not adverbs",
        "'-ing' endings are present participles or gerunds, not adverbs",
        "'-s' endings are plural nouns or present tense verbs, not adverbs"
      ],
      commonMistakes: [
        "Thinking ALL -ly words are adverbs (friendly, lovely are adjectives)",
        "Not recognizing adverbs without -ly (fast, hard, well, soon, now)"
      ]
    },
    difficulty: "medium",
    level: "A2"
  },
  {
    question: "What question do adverbs answer about verbs?",
    options: [
      "How? When? Where? How often?",
      "What? Which? Whose?",
      "Why only?",
      "Who? Whom?"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Adverbs answer four main questions: (1) HOW? (manner: quickly, carefully), (2) WHEN? (time: yesterday, soon, now), (3) WHERE? (place: here, there, outside), (4) HOW OFTEN? (frequency: always, never, sometimes).",
      formula: "HOW = manner | WHEN = time | WHERE = place | HOW OFTEN = frequency",
      trapAlerts: [
        "'What/Which/Whose' are answered by nouns and adjectives, not adverbs",
        "'Why' is answered by clauses/reasons, not simple adverbs (though 'therefore' exists)",
        "'Who/Whom' are about people (pronouns/question words), not adverb questions"
      ],
      commonMistakes: [
        "Not learning the four main adverb questions (How/When/Where/How often)",
        "Confusing adjective questions (What kind?) with adverb questions"
      ]
    },
    difficulty: "medium",
    level: "A2"
  },
  {
    question: "Which word is an adverb that does NOT end in -ly?",
    options: ["fast", "slowly", "quickly", "happily"],
    correctAnswer: 0,
    explanation: {
      logic: "'Fast' is an adverb (also an adjective) with no -ly: 'runs fast', 'drives fast'. Other adverbs without -ly: hard, well, soon, often, never, always. 'Slowly', 'quickly', 'happily' all end in -ly.",
      formula: "Adverbs without -ly: fast, hard, well, soon, often, always, never",
      trapAlerts: [
        "'slowly' ends in -ly - standard adverb formation",
        "'quickly' ends in -ly - standard adverb formation",
        "'happily' ends in -ly - standard adverb formation"
      ],
      commonMistakes: [
        "Thinking 'fast' needs -ly to be an adverb (saying 'fastly' - not a word)",
        "Not learning common irregular adverbs (well, hard, fast)"
      ]
    },
    difficulty: "medium",
    level: "A2"
  },
  {
    question: "Find the error:\n\n'She sang beautiful at the concert.'",
    options: [
      "'beautiful' should be 'beautifully'",
      "'sang' should be 'singed'",
      "'at' should be 'in'",
      "No error"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Beautiful' is an adjective (describes nouns). We need an adverb to describe the verb 'sang' (HOW she sang). Change to 'beautifully': 'She sang beautifully'. Rule: adjective + ly = adverb.",
      formula: "Verb needs adverb: sang beautifully | Noun needs adjective: beautiful song",
      trapAlerts: [
        "'sang' is correct past tense (sing → sang → sung), not 'singed' (that's burn → singed)",
        "'at the concert' is correct preposition for location of event",
        "The sentence has an error - wrong word form"
      ],
      commonMistakes: [
        "Using adjectives instead of adverbs after verbs (sang beautiful, ran quick)",
        "Not adding -ly to adjectives when describing verbs"
      ]
    },
    difficulty: "medium",
    level: "A2"
  },
  {
    question: "Where do adverbs of manner usually go in a sentence?",
    options: [
      "After the verb (or after verb + object)",
      "Always at the beginning",
      "Always before the subject",
      "Between subject and verb always"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Adverbs of manner (how?) usually go: (1) After verb: 'She speaks clearly', (2) After verb + object: 'She speaks English clearly'. Can also go at beginning for emphasis: 'Clearly, she speaks English'. Most natural position: after verb/object.",
      formula: "Subject + verb + adverb (She speaks clearly) | Subject + verb + object + adverb (She speaks English clearly)",
      trapAlerts: [
        "Beginning is possible but for emphasis, not the default position",
        "Before subject is rare and unnatural for manner adverbs",
        "Between subject and verb blocks the flow - not typical for manner adverbs"
      ],
      commonMistakes: [
        "Placing manner adverbs between subject and verb (She clearly speaks - less natural)",
        "Not learning flexible adverb positions"
      ]
    },
    difficulty: "hard",
    level: "A2"
  },
  {
    question: "Which is the correct adverb form of 'good'?",
    options: ["well", "goodly", "gooder", "good"],
    correctAnswer: 0,
    explanation: {
      logic: "'Good' is an adjective. The adverb form is IRREGULAR: 'well' (NOT 'goodly'). 'He plays well' (adverb), 'He is a good player' (adjective). This is one of the most common irregular forms - must be memorized.",
      formula: "Good (adjective) → well (adverb) | He is good → He plays well",
      trapAlerts: [
        "'goodly' is not standard modern English - archaic word meaning large/considerable",
        "'gooder' is comparative form attempted - not a real word",
        "'good' is the adjective form - doesn't describe verbs correctly"
      ],
      commonMistakes: [
        "Saying 'He plays good' instead of 'He plays well' (very common error)",
        "Not memorizing good → well irregular pair"
      ]
    },
    difficulty: "hard",
    level: "A2"
  },
  {
    question: "What type of adverb is 'very' in 'very beautiful'?",
    options: [
      "Adverb of degree (modifies adjective)",
      "Adverb of manner",
      "Adverb of time",
      "Adverb of place"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Very' is an adverb of DEGREE (intensity/extent). It modifies the adjective 'beautiful' (HOW beautiful?). Degree adverbs: very, quite, too, extremely, rather, really. They tell us the intensity of adjectives or other adverbs.",
      formula: "Degree adverb + adjective (very beautiful, extremely tall, too expensive)",
      trapAlerts: [
        "Manner adverbs describe verbs (how actions happen: quickly, slowly)",
        "Time adverbs tell when (yesterday, now, soon)",
        "Place adverbs tell where (here, there, outside)"
      ],
      commonMistakes: [
        "Not recognizing degree adverbs as a separate category",
        "Confusing degree (very, too) with manner (quickly, carefully)"
      ]
    },
    difficulty: "hard",
    level: "A2"
  },
  {
    question: "Choose the sentence with the adverb in the correct position:",
    options: [
      "She quickly finished her homework.",
      "She finished quickly her homework.",
      "Quickly she her homework finished.",
      "She her homework quickly finished."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Correct positions for 'quickly': (1) Before verb: 'She quickly finished', (2) After verb + object: 'She finished her homework quickly'. Option A uses position 1 (before verb). Options B, C, D have unnatural/incorrect word order.",
      formula: "Adverb before verb: quickly finished | Adverb after verb+object: finished homework quickly",
      trapAlerts: [
        "'finished quickly her' splits verb from object - unnatural",
        "Option C scrambles word order completely",
        "Option D puts verb at end - wrong English word order"
      ],
      commonMistakes: [
        "Placing adverbs between verb and direct object",
        "Not learning both positions (before verb or after verb+object)"
      ]
    },
    difficulty: "hard",
    level: "A2"
  },
  {
    question: "Which word is NOT an adverb?",
    options: ["friendly", "quickly", "slowly", "carefully"],
    correctAnswer: 0,
    explanation: {
      logic: "'Friendly' LOOKS like an adverb (ends in -ly) but it's an ADJECTIVE: 'a friendly person', 'friendly advice'. Other -ly adjectives: lovely, ugly, silly, lonely. Real adverbs: quickly, slowly, carefully (describe verbs).",
      formula: "-ly adjectives (no adverb form): friendly, lovely, ugly, silly, lonely",
      trapAlerts: [
        "'quickly' is an adverb (describes verbs: runs quickly)",
        "'slowly' is an adverb (describes verbs: walks slowly)",
        "'carefully' is an adverb (describes verbs: drives carefully)"
      ],
      commonMistakes: [
        "Thinking all -ly words are adverbs",
        "Not learning -ly adjectives (friendly, lovely, ugly, silly)"
      ]
    },
    difficulty: "hard",
    level: "A2"
  },
  {
    question: "What is the difference between 'hard' and 'hardly'?",
    options: [
      "'Hard' = with effort, 'hardly' = almost not at all",
      "They mean exactly the same",
      "'Hard' is adjective only, 'hardly' is adverb only",
      "'Hardly' means very hard"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Hard' (adverb) = with great effort: 'works hard', 'studies hard'. 'Hardly' = almost not, barely: 'hardly know him' (almost don't know), 'can hardly see' (almost can't see). These are DIFFERENT meanings despite similar spelling.",
      formula: "Hard = with effort (works hard) | Hardly = almost not (hardly works = rarely works)",
      trapAlerts: [
        "The meanings are completely different - NOT synonyms",
        "'Hard' can be adjective (hard rock) OR adverb (works hard)",
        "'Hardly' does NOT mean 'very hard' - opposite meaning!"
      ],
      commonMistakes: [
        "Confusing 'works hard' (with effort) with 'hardly works' (rarely works)",
        "Thinking 'hardly' is just the adverb form of adjective 'hard'"
      ]
    },
    difficulty: "hard",
    level: "A2"
  },
  {
    question: "Find the adverb:\n\n'Raj will visit Delhi tomorrow.'",
    options: ["tomorrow", "visit", "Delhi", "will"],
    correctAnswer: 0,
    explanation: {
      logic: "'Tomorrow' is an adverb of TIME - tells WHEN he will visit. Time adverbs: tomorrow, yesterday, today, soon, now, later. They answer 'When?' about the verb.",
      formula: "Time adverbs: yesterday, today, tomorrow, soon, now, later",
      trapAlerts: [
        "'visit' is the verb being described, not the describer",
        "'Delhi' is a proper noun (place name), not an adverb",
        "'will' is a modal/auxiliary verb, not an adverb"
      ],
      commonMistakes: [
        "Not recognizing time words as adverbs",
        "Thinking adverbs must end in -ly (many don't: tomorrow, yesterday, soon)"
      ]
    },
    difficulty: "easy",
    level: "A2"
  },

  // SUBTOPIC 2: Adverbs of Manner - 15 questions
  {
    question: "What are adverbs of manner?",
    options: [
      "Adverbs that describe HOW an action is done",
      "Adverbs that tell WHEN something happens",
      "Adverbs that tell WHERE something happens",
      "Adverbs that tell WHY something happens"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Adverbs of manner describe HOW an action is performed: quickly, slowly, carefully, beautifully, badly. They answer the question 'How?' or 'In what manner?'. Most end in -ly. Example: 'She sings beautifully' (HOW does she sing?).",
      formula: "Manner adverbs answer: How? or In what way? (quickly, carefully, well, badly)",
      trapAlerts: [
        "WHEN = time adverbs (yesterday, soon, now), not manner",
        "WHERE = place adverbs (here, there, outside), not manner",
        "WHY = reason (usually clauses, not simple adverbs)"
      ],
      commonMistakes: [
        "Confusing different types of adverbs (manner vs time vs place)",
        "Not asking 'How?' to identify manner adverbs"
      ]
    },
    difficulty: "easy",
    level: "A2"
  },
  {
    question: "Identify the adverb of manner:\n\n'She drives carefully.'",
    options: ["carefully", "drives", "She", "none"],
    correctAnswer: 0,
    explanation: {
      logic: "'Carefully' describes HOW she drives (in what manner). Manner adverbs tell us the way an action is performed. 'Carefully' = with care, paying attention.",
      formula: "Verb + manner adverb (drives carefully, speaks softly, works hard)",
      trapAlerts: [
        "'drives' is the verb being described, not the manner adverb",
        "'She' is the subject pronoun, not describing how the action happens",
        "There IS an adverb in the sentence"
      ],
      commonMistakes: [
        "Identifying the verb instead of the word describing the verb",
        "Not recognizing -ly words as adverbs"
      ]
    },
    difficulty: "easy",
    level: "A2"
  },
  {
    question: "How do you form most adverbs of manner?",
    options: [
      "Add -ly to the adjective (careful → carefully)",
      "Add -ing to the verb",
      "Add -ed to the verb",
      "Add -er to the adjective"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Form manner adverbs by adding -ly to adjectives: quick → quickly, slow → slowly, careful → carefully, beautiful → beautifully. Special rules: adjective ending in -y → change to -ily (happy → happily, easy → easily).",
      formula: "Adjective + ly = manner adverb (quick → quickly, slow → slowly)",
      trapAlerts: [
        "'-ing' creates present participles or gerunds, not adverbs",
        "'-ed' creates past tense or past participles, not adverbs",
        "'-er' creates comparative adjectives (bigger, taller), not adverbs"
      ],
      commonMistakes: [
        "Not changing -y to -ily (saying 'happyly' instead of 'happily')",
        "Forgetting to add -ly to adjectives when forming adverbs"
      ]
    },
    difficulty: "easy",
    level: "A2"
  },
  {
    question: "Choose the correct adverb of manner:\n\n'He speaks English ___.'",
    options: ["fluently", "fluent", "fluency", "more fluent"],
    correctAnswer: 0,
    explanation: {
      logic: "'Fluently' is the adverb (describes HOW he speaks). 'Fluent' = adjective, 'fluency' = noun, 'more fluent' = comparative adjective. Need adverb to describe the verb 'speaks'.",
      formula: "Verb + manner adverb (speaks fluently, reads carefully, writes neatly)",
      trapAlerts: [
        "'fluent' is adjective - describes nouns (fluent speaker), not verbs",
        "'fluency' is noun - the quality itself, not describing the action",
        "'more fluent' is comparative adjective - for comparing, not describing manner"
      ],
      commonMistakes: [
        "Using adjectives instead of adverbs after verbs",
        "Not adding -ly to form the adverb"
      ]
    },
    difficulty: "medium",
    level: "A2"
  },
  {
    question: "What is the adverb form of 'quick'?",
    options: ["quickly", "quicker", "quickest", "quick"],
    correctAnswer: 0,
    explanation: {
      logic: "'Quick' (adjective) → 'quickly' (adverb). Add -ly to form the adverb. 'Quicker' = comparative adjective, 'quickest' = superlative adjective. Need adverb form to describe verbs.",
      formula: "Quick (adjective) → quickly (adverb) | He is quick → He runs quickly",
      trapAlerts: [
        "'quicker' is comparative adjective - for comparing two things",
        "'quickest' is superlative adjective - for three or more things",
        "'quick' is the adjective - doesn't properly describe verbs in formal English"
      ],
      commonMistakes: [
        "Using 'quick' as adverb (saying 'Come quick!' instead of 'Come quickly!')",
        "Confusing comparative adjectives with adverbs"
      ]
    },
    difficulty: "easy",
    level: "A2"
  },
  {
    question: "Find the error:\n\n'She dances beautiful.'",
    options: [
      "'beautiful' should be 'beautifully'",
      "'dances' should be 'dancing'",
      "'She' should be 'Her'",
      "No error"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Beautiful' is an adjective. Need adverb 'beautifully' to describe the verb 'dances' (HOW she dances). Change to: 'She dances beautifully'.",
      formula: "Verb needs adverb: dances beautifully | Noun needs adjective: beautiful dance",
      trapAlerts: [
        "'dances' is correct present tense - no need for 'dancing'",
        "'She' is correct subject pronoun - 'Her' is object/possessive",
        "The sentence has an error - wrong word form"
      ],
      commonMistakes: [
        "Using adjectives after verbs (very common error for Indian learners)",
        "Not converting adjectives to adverbs with -ly"
      ]
    },
    difficulty: "medium",
    level: "A2"
  },
  {
    question: "Which adverb of manner is IRREGULAR (doesn't follow the adjective + ly pattern)?",
    options: ["well (from good)", "slowly (from slow)", "quickly (from quick)", "softly (from soft)"],
    correctAnswer: 0,
    explanation: {
      logic: "'Good' → 'well' (IRREGULAR, not 'goodly'). This is the most common irregular manner adverb. 'Slowly', 'quickly', 'softly' all follow regular pattern: adjective + ly.",
      formula: "Irregular: good → well | Regular: slow → slowly, quick → quickly",
      trapAlerts: [
        "'slowly' follows regular pattern (slow + ly)",
        "'quickly' follows regular pattern (quick + ly)",
        "'softly' follows regular pattern (soft + ly)"
      ],
      commonMistakes: [
        "Saying 'He plays good' instead of 'He plays well'",
        "Not memorizing the good → well exception"
      ]
    },
    difficulty: "hard",
    level: "A2"
  },
  {
    question: "Where should the manner adverb go?\n\n'She solved the problem ___.'",
    options: [
      "easily (after verb + object)",
      "before 'She'",
      "between 'solved' and 'the'",
      "before 'problem'"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Manner adverbs go: (1) After verb + object: 'solved the problem easily', (2) Before verb: 'easily solved the problem'. Option 1 (after object) is most natural. Don't place between verb and object.",
      formula: "Verb + object + adverb (solved the problem easily) | Adverb + verb (easily solved)",
      trapAlerts: [
        "Before subject is unnatural for manner adverbs in this context",
        "Between verb and object breaks the verb-object connection",
        "Directly before object is wrong position"
      ],
      commonMistakes: [
        "Placing adverbs between verb and direct object",
        "Not learning natural adverb positions"
      ]
    },
    difficulty: "medium",
    level: "A2"
  },
  {
    question: "What is the adverb form of 'happy'?",
    options: ["happily", "happyly", "happiness", "happy"],
    correctAnswer: 0,
    explanation: {
      logic: "Adjectives ending in -y: change 'y' to 'i' and add -ly. 'Happy' → 'happily'. NOT 'happyly'. Other examples: easy → easily, angry → angrily, lucky → luckily.",
      formula: "Adjective ending in -y: change y to i + ly (happy → happily, easy → easily)",
      trapAlerts: [
        "'happyly' doesn't change 'y' to 'i' - incorrect spelling",
        "'happiness' is a noun (the state of being happy), not an adverb",
        "'happy' is the adjective - doesn't describe verbs correctly"
      ],
      commonMistakes: [
        "Not changing 'y' to 'i' before adding -ly",
        "Forgetting the spelling rule for -y adjectives"
      ]
    },
    difficulty: "medium",
    level: "A2"
  },
  {
    question: "Which sentence uses a manner adverb correctly?",
    options: [
      "He explained the lesson clearly.",
      "He explained clear the lesson.",
      "He clear explained the lesson.",
      "Clear he explained the lesson."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Correct: 'explained the lesson clearly' (verb + object + adverb). The adverb 'clearly' describes HOW he explained. Other options have incorrect word order or use adjective instead of adverb.",
      formula: "Subject + verb + object + manner adverb (He explained the lesson clearly)",
      trapAlerts: [
        "'explained clear the lesson' uses adjective 'clear' and wrong order",
        "'clear explained' uses adjective before verb - needs adverb 'clearly'",
        "'Clear he explained' has very unnatural word order"
      ],
      commonMistakes: [
        "Using adjectives (clear) instead of adverbs (clearly) after verbs",
        "Placing manner adverbs in unnatural positions"
      ]
    },
    difficulty: "medium",
    level: "A2"
  },
  {
    question: "What does 'fast' function as in: 'She runs fast'?",
    options: [
      "Adverb of manner (describes HOW she runs)",
      "Adjective",
      "Noun",
      "Verb"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Fast' can be adjective ('a fast car') OR adverb ('runs fast'). In 'She runs fast', it describes HOW she runs = adverb of manner. No -ly needed. Other words like this: hard, late, early.",
      formula: "Fast as adverb: runs fast | Fast as adjective: fast runner",
      trapAlerts: [
        "In this sentence, 'fast' modifies the verb 'runs' - adverb function",
        "'fast' is not a noun here (though 'fasting' can be)",
        "'fast' is not a verb here (though 'to fast' = abstain exists)"
      ],
      commonMistakes: [
        "Saying 'fastly' (not a word) because most adverbs end in -ly",
        "Not recognizing flat adverbs (same form as adjective)"
      ]
    },
    difficulty: "hard",
    level: "A2"
  },
  {
    question: "Choose the correct form:\n\n'Priya sings ___.'",
    options: [
      "beautifully",
      "beautiful",
      "beauty",
      "more beautiful"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Beautifully' is the adverb describing HOW Priya sings. 'Beautiful' = adjective, 'beauty' = noun, 'more beautiful' = comparative adjective. Verb needs adverb.",
      formula: "Verb + manner adverb (sings beautifully, dances gracefully, plays skillfully)",
      trapAlerts: [
        "'beautiful' is adjective - describes nouns (beautiful song), not verbs",
        "'beauty' is noun - the quality itself, not describing action",
        "'more beautiful' is comparative adjective - wrong form"
      ],
      commonMistakes: [
        "Using adjectives after verbs (sings beautiful)",
        "Not forming adverbs from adjectives with -ly"
      ]
    },
    difficulty: "easy",
    level: "A2"
  },
  {
    question: "What's the difference between 'hard' and 'hardly' as manner adverbs?",
    options: [
      "'Hard' = with effort, 'hardly' = almost not (different meanings!)",
      "They mean exactly the same thing",
      "'Hard' is wrong - always use 'hardly'",
      "'Hardly' means very hard"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'He works hard' = with great effort. 'He hardly works' = almost doesn't work, rarely works. COMPLETELY DIFFERENT meanings! 'Hardly' is a negative adverb (almost not), not the -ly form of 'hard'.",
      formula: "Works hard = lots of effort | Hardly works = rarely works, little effort",
      trapAlerts: [
        "These are NOT synonyms - opposite meanings in practice",
        "'Hard' as adverb is correct - very common usage",
        "'Hardly' does NOT mean 'very hard' - means 'almost not'"
      ],
      commonMistakes: [
        "Thinking 'hardly' is just the adverb form of 'hard'",
        "Using 'hardly' when meaning 'with effort' (should be 'hard')"
      ]
    },
    difficulty: "hard",
    level: "A2"
  },
  {
    question: "Find the manner adverb:\n\n'Raj answered the question correctly.'",
    options: ["correctly", "answered", "question", "Raj"],
    correctAnswer: 0,
    explanation: {
      logic: "'Correctly' describes HOW Raj answered (in what manner). It's a manner adverb. Answers the question: 'How did Raj answer?' → correctly (in the correct way).",
      formula: "Answered (verb) + correctly (manner adverb) = answered correctly",
      trapAlerts: [
        "'answered' is the verb being described",
        "'question' is the noun (object of the verb)",
        "'Raj' is the subject (proper noun/name)"
      ],
      commonMistakes: [
        "Confusing the verb with the adverb describing it",
        "Not recognizing -ly words as adverbs"
      ]
    },
    difficulty: "easy",
    level: "A2"
  },
  {
    question: "What is the correct sentence?",
    options: [
      "He plays cricket well.",
      "He plays cricket good.",
      "He plays cricket goodly.",
      "He good plays cricket."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Good' is adjective. Its adverb form is 'well' (IRREGULAR). 'He plays well' (HOW he plays). 'Goodly' is not standard modern English. 'Good plays' uses adjective incorrectly.",
      formula: "Good (adjective) → well (adverb) | He is good → He plays well",
      trapAlerts: [
        "'plays cricket good' uses adjective instead of adverb - wrong",
        "'goodly' is archaic/not standard - not used in modern English",
        "'good plays' has adjective in wrong position"
      ],
      commonMistakes: [
        "Saying 'plays good' (extremely common error)",
        "Not memorizing good → well irregular form"
      ]
    },
    difficulty: "hard",
    level: "A2"
  },

  // SUBTOPIC 3: Adverbs of Frequency - 15 questions
  {
    question: "What are adverbs of frequency?",
    options: [
      "Adverbs that tell HOW OFTEN something happens",
      "Adverbs that tell WHERE something happens",
      "Adverbs that tell WHEN something happens",
      "Adverbs that tell WHY something happens"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Frequency adverbs tell HOW OFTEN an action happens: always, usually, often, sometimes, rarely, never. They answer 'How often?' or 'How many times?'. Example: 'I always brush my teeth' (100% of the time).",
      formula: "Frequency adverbs: always (100%), usually, often, sometimes, rarely, never (0%)",
      trapAlerts: [
        "WHERE = place adverbs (here, there, outside)",
        "WHEN = time adverbs (yesterday, tomorrow, soon) - different from frequency",
        "WHY = reason (usually clauses, not simple adverbs)"
      ],
      commonMistakes: [
        "Confusing frequency (how often) with time (when)",
        "Not learning the frequency scale from always to never"
      ]
    },
    difficulty: "easy",
    level: "A2"
  },
  {
    question: "Which word is an adverb of frequency?",
    options: ["always", "yesterday", "quickly", "here"],
    correctAnswer: 0,
    explanation: {
      logic: "'Always' tells HOW OFTEN (frequency): 100% of the time. 'Yesterday' = time (when), 'quickly' = manner (how), 'here' = place (where). Only 'always' answers 'How often?'",
      formula: "Frequency: always, often, sometimes, never | Time: yesterday, today, tomorrow",
      trapAlerts: [
        "'yesterday' is time adverb - tells when, not how often",
        "'quickly' is manner adverb - tells how, not how often",
        "'here' is place adverb - tells where, not how often"
      ],
      commonMistakes: [
        "Confusing time adverbs (yesterday) with frequency adverbs (always)",
        "Not distinguishing between different types of adverbs"
      ]
    },
    difficulty: "easy",
    level: "A2"
  },
  {
    question: "Where do frequency adverbs usually go?",
    options: [
      "Before the main verb (I always study)",
      "Always at the end of sentence",
      "Always at the beginning",
      "After the main verb always"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Frequency adverbs usually go: (1) BEFORE main verb: 'I always study', 'She often reads'. (2) AFTER 'be' verb: 'He is always late'. (3) Between auxiliary and main verb: 'I have never been there'.",
      formula: "Before main verb: always study | After 'be': is always | After auxiliary: have never",
      trapAlerts: [
        "End position is possible but less common for frequency adverbs",
        "Beginning is for emphasis only - not the usual position",
        "AFTER main verb is wrong - should be before"
      ],
      commonMistakes: [
        "Placing frequency adverbs after the main verb",
        "Not learning the 'before main verb, after be' rule"
      ]
    },
    difficulty: "medium",
    level: "A2"
  },
  {
    question: "Choose the correct position:\n\n'She ___ goes to the gym.'",
    options: [
      "usually (before main verb)",
      "goes usually",
      "to usually the gym",
      "the gym usually"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Frequency adverbs go BEFORE the main verb: 'She usually goes to the gym'. This is the standard position for frequency adverbs with main verbs.",
      formula: "Subject + frequency adverb + main verb (She usually goes, I often read)",
      trapAlerts: [
        "'goes usually' puts adverb after main verb - wrong position",
        "'to usually the gym' puts adverb in the middle of prepositional phrase - wrong",
        "'the gym usually' puts adverb after object - unnatural"
      ],
      commonMistakes: [
        "Placing frequency adverbs after the main verb",
        "Putting adverbs in random positions"
      ]
    },
    difficulty: "medium",
    level: "A2"
  },
  {
    question: "What is the correct order of frequency (most to least)?",
    options: [
      "always → usually → often → sometimes → rarely → never",
      "never → rarely → sometimes → often → usually → always",
      "always → never → usually → rarely → often → sometimes",
      "sometimes → often → always → usually → never → rarely"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Frequency scale from most to least: ALWAYS (100%) → USUALLY (80-90%) → OFTEN (60-70%) → SOMETIMES (40-50%) → RARELY (10-20%) → NEVER (0%). Learn this scale to use the right word.",
      formula: "100% always → usually → often → sometimes → rarely → never 0%",
      trapAlerts: [
        "Option B reverses the order - goes from never to always",
        "Option C has random order - not from most to least",
        "Option D starts with 'sometimes' - not the highest frequency"
      ],
      commonMistakes: [
        "Not learning the frequency scale",
        "Using 'sometimes' when meaning 'often' or vice versa"
      ]
    },
    difficulty: "medium",
    level: "A2"
  },
  {
    question: "Find the error:\n\n'I go always to school by bus.'",
    options: [
      "'go always' should be 'always go'",
      "'to school' should be 'at school'",
      "'by bus' should be 'in bus'",
      "No error"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Frequency adverbs go BEFORE the main verb: 'I always go to school'. NOT 'I go always'. Rule: Subject + frequency adverb + main verb.",
      formula: "Correct: I always go | Wrong: I go always",
      trapAlerts: [
        "'to school' is correct preposition - 'go to' for destination",
        "'by bus' is correct preposition - 'by' for mode of transport",
        "The sentence has an error - adverb position"
      ],
      commonMistakes: [
        "Placing frequency adverbs after the main verb (very common)",
        "Not following subject + adverb + verb pattern"
      ]
    },
    difficulty: "medium",
    level: "A2"
  },
  {
    question: "Where does the frequency adverb go with 'be' verbs?\n\n'He ___ late for class.'",
    options: [
      "is always (after 'be' verb)",
      "always is",
      "late always",
      "class always"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "With 'be' verbs, frequency adverbs go AFTER the verb: 'He is always late'. Exception to the usual 'before main verb' rule. Pattern: Subject + be + frequency adverb.",
      formula: "With 'be': is always, are usually, was often | Not: always is",
      trapAlerts: [
        "'always is' puts adverb before 'be' - wrong for this verb",
        "'late always' puts adverb after adjective - wrong position",
        "'class always' puts adverb at end - unnatural"
      ],
      commonMistakes: [
        "Putting frequency adverbs before 'be' verbs (saying 'always is')",
        "Not learning the special rule for 'be' verbs"
      ]
    },
    difficulty: "hard",
    level: "A2"
  },
  {
    question: "Which frequency adverb means 'not ever'?",
    options: ["never", "always", "sometimes", "often"],
    correctAnswer: 0,
    explanation: {
      logic: "'Never' = not ever, 0% frequency, not at any time. Example: 'I never eat meat' = I don't eat meat at any time. Negative meaning. Opposite of 'always'.",
      formula: "Never = 0% = not ever = at no time",
      trapAlerts: [
        "'always' means 100% = every time (opposite of never)",
        "'sometimes' means occasionally = 40-50%",
        "'often' means frequently = 60-70%"
      ],
      commonMistakes: [
        "Using double negative with 'never' (I don't never - wrong in standard English)",
        "Confusing 'never' with 'ever' (question/affirmative contexts)"
      ]
    },
    difficulty: "easy",
    level: "A2"
  },
  {
    question: "Choose the correct sentence:",
    options: [
      "She is usually on time.",
      "She usually is on time.",
      "She on time usually is.",
      "Usually she is time on."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "With 'be' verbs, frequency adverbs go AFTER: 'She is usually on time'. Pattern: Subject + be + frequency adverb + complement.",
      formula: "Subject + be + frequency adverb + complement (She is usually on time)",
      trapAlerts: [
        "'usually is' puts adverb before 'be' - breaks the rule",
        "Option C scrambles word order completely",
        "Option D has totally wrong word order"
      ],
      commonMistakes: [
        "Placing frequency adverbs before 'be' verbs",
        "Not learning the specific 'be' verb rule"
      ]
    },
    difficulty: "medium",
    level: "A2"
  },
  {
    question: "What does 'rarely' mean?",
    options: [
      "Not often, only occasionally (10-20%)",
      "Every time (100%)",
      "Most of the time (80%)",
      "Never (0%)"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Rarely' = not often, seldom, only occasionally. About 10-20% frequency. Example: 'I rarely eat fast food' = I eat it very infrequently. Less than 'sometimes', more than 'never'.",
      formula: "Frequency scale: sometimes (40-50%) → rarely (10-20%) → never (0%)",
      trapAlerts: [
        "'every time' = always (100%), not rarely",
        "'most of the time' = usually (80-90%), not rarely",
        "'never' = 0%, rarely is slightly more than never"
      ],
      commonMistakes: [
        "Confusing 'rarely' with 'never' - rarely is not zero",
        "Not knowing where 'rarely' fits in the frequency scale"
      ]
    },
    difficulty: "medium",
    level: "A2"
  },
  {
    question: "Find the adverb of frequency:\n\n'Raj sometimes visits his grandparents.'",
    options: ["sometimes", "visits", "grandparents", "his"],
    correctAnswer: 0,
    explanation: {
      logic: "'Sometimes' tells HOW OFTEN Raj visits (frequency: occasionally, about 40-50% of the time). It answers 'How often does Raj visit?'",
      formula: "Frequency adverb: sometimes (occasionally, now and then)",
      trapAlerts: [
        "'visits' is the verb being modified by 'sometimes'",
        "'grandparents' is a noun (object of the verb)",
        "'his' is a possessive adjective"
      ],
      commonMistakes: [
        "Not identifying frequency adverbs in sentences",
        "Confusing frequency with other types of information"
      ]
    },
    difficulty: "easy",
    level: "A2"
  },
  {
    question: "What is the correct position with modal verbs?\n\n'She ___ late.'",
    options: [
      "is never (after 'be')",
      "never is",
      "is late never",
      "late is never"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "With 'be' verbs (including 'is'), frequency adverbs go AFTER the verb: 'She is never late'. Special rule for 'be' verbs - different from main verbs.",
      formula: "Subject + be + frequency adverb (She is never, They are always)",
      trapAlerts: [
        "'never is' puts adverb before 'be' - wrong position",
        "'is late never' puts adverb at end - unnatural",
        "'late is never' scrambles word order"
      ],
      commonMistakes: [
        "Treating 'be' verbs like main verbs (putting adverb before)",
        "Not memorizing the 'after be' rule"
      ]
    },
    difficulty: "medium",
    level: "A2"
  },
  {
    question: "Which frequency adverb means 'most of the time'?",
    options: ["usually", "rarely", "never", "sometimes"],
    correctAnswer: 0,
    explanation: {
      logic: "'Usually' = most of the time, generally, about 80-90% frequency. Example: 'I usually wake up at 7am' = most mornings I wake up at 7am. Between 'always' and 'often'.",
      formula: "Frequency scale: always (100%) → usually (80-90%) → often (60-70%)",
      trapAlerts: [
        "'rarely' means not often (10-20%), opposite of usually",
        "'never' means 0%, not at all",
        "'sometimes' means occasionally (40-50%), less than usually"
      ],
      commonMistakes: [
        "Confusing 'usually' with 'sometimes'",
        "Not understanding the percentage ranges"
      ]
    },
    difficulty: "easy",
    level: "A2"
  },
  {
    question: "Choose the correct sentence with auxiliary verb:",
    options: [
      "I have never been to Mumbai.",
      "I never have been to Mumbai.",
      "I have been never to Mumbai.",
      "I have been to never Mumbai."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "With auxiliary verbs (have, has, had), frequency adverbs go BETWEEN auxiliary and main verb: 'have never been'. Pattern: auxiliary + frequency adverb + main verb.",
      formula: "Auxiliary + frequency adverb + main verb (have never been, has always done)",
      trapAlerts: [
        "'never have been' puts adverb before auxiliary - wrong order",
        "'have been never' puts adverb after main verb - wrong",
        "'been to never' puts adverb in wrong position"
      ],
      commonMistakes: [
        "Putting frequency adverbs before auxiliary verbs",
        "Not learning the auxiliary + adverb + main verb pattern"
      ]
    },
    difficulty: "hard",
    level: "A2"
  },
  {
    question: "What's the difference between 'often' and 'sometimes'?",
    options: [
      "'Often' is more frequent (60-70%), 'sometimes' is less (40-50%)",
      "They mean exactly the same",
      "'Sometimes' is more frequent than 'often'",
      "'Often' means never"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Often' = frequently, regularly (60-70%). 'Sometimes' = occasionally, now and then (40-50%). 'Often' is more frequent than 'sometimes'. Scale: always → usually → often → sometimes → rarely → never.",
      formula: "Often (60-70%) > sometimes (40-50%) | Often = more frequent",
      trapAlerts: [
        "They have different meanings - not synonyms",
        "'sometimes' is less frequent than 'often', not more",
        "'often' means frequently, not never"
      ],
      commonMistakes: [
        "Using 'often' and 'sometimes' interchangeably",
        "Not understanding the frequency difference"
      ]
    },
    difficulty: "medium",
    level: "A2"
  }
];

async function insertQuestions() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('\n🎓 Inserting Adverbs Complete Questions (Batch 1/2)');
    console.log('='.repeat(80));
    console.log(`\n📋 Topic: adverbs-complete (A2 level)`);
    console.log(`   Questions in this batch: ${ADVERBS_BATCH1.length}`);
    console.log(`   Subtopics covered: Types (15), Manner (15), Frequency (15)\n`);

    let inserted = 0;
    for (const q of ADVERBS_BATCH1) {
      await pool.query(
        `INSERT INTO english_questions
         (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
        [
          'foundation',
          'adverbs-complete',
          q.level,
          q.question,
          JSON.stringify(q.options),
          q.correctAnswer,
          JSON.stringify(q.explanation),
          q.difficulty,
        ]
      );
      inserted++;

      if (inserted % 10 === 0) {
        console.log(`   ✓ Inserted ${inserted}/${ADVERBS_BATCH1.length}...`);
      }
    }

    console.log(`\n✅ Successfully inserted ${inserted} questions!`);
    console.log(`\n📊 Progress: ${inserted}/60 questions for adverbs-complete`);
    console.log(`   Next batch will add 15 more (Time, Place, Degree adverbs)`);

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

insertQuestions();
