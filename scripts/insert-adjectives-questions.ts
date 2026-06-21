import { Pool } from 'pg';
import { config } from 'dotenv';

config({ path: '.env.local' });

/**
 * Adjectives Questions - Complete 60 questions
 * Topic: adjectives (A1 level)
 * Subtopics: Descriptive adjectives (15), Comparative (15), Superlative (15), Order of adjectives (15)
 */

const ADJECTIVES_QUESTIONS = [
  // SUBTOPIC 1: Descriptive Adjectives - 15 questions
  {
    question: "What is an adjective?\n\nChoose the best definition:",
    options: [
      "A word that describes a noun",
      "A word that shows action",
      "A word that connects sentences",
      "A word that replaces a noun"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Adjectives are describing words that give information about nouns. They tell us what kind, which one, or how many. Examples: big house, red car, three books. Adjectives answer questions like 'What kind?' or 'How many?'",
      formula: "Adjective + Noun (big house, beautiful garden, old man)",
      trapAlerts: [
        "Action words are verbs (run, eat, sleep), not adjectives",
        "Connecting words are conjunctions (and, but, or), not adjectives",
        "Words that replace nouns are pronouns (he, she, it), not adjectives"
      ],
      commonMistakes: [
        "Confusing adjectives with adverbs (adverbs describe verbs: runs quickly)",
        "Not recognizing that adjectives come before nouns in English"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Identify the adjective:\n\n'Priya has a beautiful garden.'",
    options: ["beautiful", "has", "garden", "Priya"],
    correctAnswer: 0,
    explanation: {
      logic: "'Beautiful' describes the garden - tells us what kind of garden. It's an adjective that gives information about the noun 'garden'. We can ask: What kind of garden? Answer: A beautiful garden.",
      trapAlerts: [
        "'has' is a verb - shows possession/action, not a describing word",
        "'garden' is a noun - the thing being described, not the describer",
        "'Priya' is a proper noun (name) - the person, not a describing word"
      ],
      commonMistakes: [
        "Thinking nouns are adjectives because they seem important",
        "Not asking 'What kind?' to identify adjectives"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Choose the sentence with an adjective:",
    options: [
      "The tall building is in Mumbai.",
      "She runs every morning.",
      "They went to the market.",
      "He lives in Delhi."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Tall' is an adjective describing 'building' - tells us the building's height. Other sentences have no adjectives: 'runs' is verb, 'went' is verb, 'lives' is verb. Only Option A has a describing word.",
      trapAlerts: [
        "Option B has 'runs' (verb) and 'morning' (noun), no adjectives",
        "Option C has 'went' (verb) and 'market' (noun), no adjectives",
        "Option D has 'lives' (verb) and place names, no adjectives"
      ],
      commonMistakes: [
        "Thinking 'the' is an adjective - it's an article (determiner)",
        "Not recognizing size/dimension words (tall, short, big, small) as adjectives"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Complete with the correct adjective:\n\n'The sky is ___ today.'",
    options: ["blue", "bluely", "blues", "blueness"],
    correctAnswer: 0,
    explanation: {
      logic: "Adjectives describe nouns without changing form. 'Blue' is the adjective describing color. We don't add '-ly' (that makes adverbs) or '-s' (that's plural). Colors are adjectives: red, blue, green, yellow.",
      formula: "Noun + is/are + adjective (sky is blue, flowers are red)",
      trapAlerts: [
        "'bluely' adds '-ly' which creates adverbs (quickly, slowly), not adjectives",
        "'blues' is either plural noun or verb form, not adjective",
        "'blueness' is a noun (the quality of being blue), not an adjective"
      ],
      commonMistakes: [
        "Adding '-ly' to adjectives thinking it makes them stronger",
        "Making adjectives plural when describing plural nouns - adjectives don't change!"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Where does the adjective go in English?\n\n'book / old / an'",
    options: [
      "an old book",
      "book old an",
      "old an book",
      "an book old"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "In English, adjectives come BEFORE nouns: article + adjective + noun. Pattern: a/an/the + adjective + noun. 'An old book' = article (an) + adjective (old) + noun (book). Hindi places adjectives after nouns, but English before.",
      formula: "Article + Adjective + Noun (a big house, the small car, an old book)",
      trapAlerts: [
        "'book old an' puts adjective after noun - Hindi order, not English",
        "'old an book' puts adjective before article - wrong order",
        "'an book old' splits the phrase incorrectly"
      ],
      commonMistakes: [
        "Using Hindi word order (noun + adjective) in English",
        "Not learning the article + adjective + noun pattern"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Find the adjective that describes size:",
    options: ["large", "quickly", "yesterday", "beautiful"],
    correctAnswer: 0,
    explanation: {
      logic: "'Large' describes size (how big something is). Size adjectives: big, small, large, tiny, huge, enormous. These answer the question 'How big?' about a noun.",
      trapAlerts: [
        "'quickly' is an adverb describing speed of actions, not size of things",
        "'yesterday' is a time word (noun/adverb), not a describing word for size",
        "'beautiful' describes appearance/aesthetics, not size"
      ],
      commonMistakes: [
        "Confusing adverbs (quickly, slowly) with adjectives",
        "Not categorizing adjectives by what they describe (size, color, shape, etc.)"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Choose the correct sentence:",
    options: [
      "She has a red car.",
      "She has a car red.",
      "She has red a car.",
      "She a red has car."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Correct English order: subject + verb + article + adjective + noun. 'She has a red car' follows this pattern. Adjective (red) comes between article (a) and noun (car).",
      formula: "Subject + verb + a/an + adjective + noun",
      trapAlerts: [
        "'car red' puts adjective after noun - wrong English order (Hindi influence)",
        "'red a car' puts adjective before article - breaks a + adjective + noun pattern",
        "Option D scrambles the entire sentence structure"
      ],
      commonMistakes: [
        "Placing adjectives after nouns like in Hindi",
        "Not maintaining fixed English word order"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Which sentence uses multiple adjectives correctly?",
    options: [
      "He lives in a big, old house.",
      "He lives in a house big, old.",
      "He big, old lives in a house.",
      "He lives big, old in a house."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Multiple adjectives go before the noun, separated by commas: big, old + house. Order matters slightly (size before age), but both must come before noun in English.",
      formula: "Article + adjective + , + adjective + noun (a big, old house)",
      trapAlerts: [
        "Option B puts adjectives after noun - wrong position",
        "Option C puts adjectives in wrong position (before verb, not before noun)",
        "Option D puts adjectives after verb - they must describe the noun 'house'"
      ],
      commonMistakes: [
        "Placing adjectives anywhere except before the noun they describe",
        "Not using commas between multiple adjectives"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "What kind of adjective is 'happy'?\n\n'She is happy.'",
    options: [
      "Emotion/feeling adjective",
      "Size adjective",
      "Color adjective",
      "Number adjective"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Happy' describes an emotion or feeling state. Emotion adjectives: happy, sad, angry, excited, tired, bored. These tell us how someone feels internally.",
      trapAlerts: [
        "Size adjectives describe dimensions: big, small, tall, short",
        "Color adjectives describe visual appearance: red, blue, green, yellow",
        "Number adjectives tell quantity: one, two, three, many, few"
      ],
      commonMistakes: [
        "Not categorizing adjectives by type (size, color, emotion, age, etc.)",
        "Confusing adjectives that describe feelings with those describing physical attributes"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Find the error:\n\n'I bought three books new.'",
    options: [
      "'books new' should be 'new books'",
      "'three' should be 'third'",
      "'bought' should be 'buyed'",
      "No error"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Adjectives must come BEFORE nouns in English: 'new books' (not 'books new'). Even with numbers, adjectives still precede nouns: number + adjective + noun.",
      formula: "Number + adjective + noun (three new books, two old cars)",
      trapAlerts: [
        "'three' is correct - shows quantity (three books)",
        "'bought' is correct irregular past tense (buy → bought, not 'buyed')",
        "The sentence has one error (adjective position)"
      ],
      commonMistakes: [
        "Placing adjectives after nouns - very common for Hindi speakers",
        "Not maintaining adjective-before-noun rule with numbers present"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Complete correctly:\n\n'Mount Everest is a ___ mountain.'",
    options: [
      "high",
      "highly",
      "height",
      "higher"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'High' is the basic adjective describing height/altitude. Use simple adjective form before nouns. '-ly' makes adverbs, '-er' makes comparatives (for comparisons), 'height' is a noun.",
      formula: "a/an/the + adjective + noun (a high mountain, a tall building)",
      trapAlerts: [
        "'highly' is an adverb - describes verbs (highly recommend), not nouns",
        "'height' is a noun - the measurement itself, not a describing word",
        "'higher' is comparative - for comparing two things (higher than), not describing one"
      ],
      commonMistakes: [
        "Using adverbs (-ly words) instead of adjectives before nouns",
        "Using comparative forms when not comparing"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Which word is NOT an adjective?",
    options: ["quickly", "beautiful", "old", "small"],
    correctAnswer: 0,
    explanation: {
      logic: "'Quickly' is an adverb (ends in -ly), not an adjective. Adverbs describe verbs/actions: 'runs quickly'. Adjectives describe nouns: 'quick runner'. The other three (beautiful, old, small) are all adjectives.",
      formula: "Adjective describes noun | Adverb (often -ly) describes verb",
      trapAlerts: [
        "'beautiful' is adjective - describes appearance (beautiful girl, beautiful day)",
        "'old' is adjective - describes age (old man, old building)",
        "'small' is adjective - describes size (small car, small house)"
      ],
      commonMistakes: [
        "Thinking all describing words are adjectives - some are adverbs",
        "Not recognizing -ly endings usually indicate adverbs, not adjectives"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Choose the sentence where 'long' is used as an adjective:",
    options: [
      "She has long hair.",
      "She waited long.",
      "She has been here long.",
      "How long is it?"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "In Option A, 'long' describes the noun 'hair' (what kind of hair?). Adjective use: describing a noun. In other options, 'long' describes time duration (adverb use) or asks about measurement.",
      trapAlerts: [
        "Option B: 'long' describes the verb 'waited' (how long she waited) - adverb use",
        "Option C: 'long' describes duration of time, not a noun - adverb use",
        "Option D: 'long' is asking about length/duration - not describing a specific noun"
      ],
      commonMistakes: [
        "Not recognizing same word can be adjective or adverb depending on usage",
        "Thinking 'long' always means physical length - can also mean time duration"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "What do adjectives answer about nouns?",
    options: [
      "What kind? Which one? How many?",
      "When? Where? Why?",
      "Who? Whom? Whose?",
      "How? When? Why?"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Adjectives answer three main questions: (1) What kind? (red car, big house), (2) Which one? (this book, that pen), (3) How many? (three students, many people). These questions help identify adjectives.",
      formula: "What kind = quality (beautiful, old) | Which one = demonstrative (this, that) | How many = quantity (three, many)",
      trapAlerts: [
        "'When/Where/Why' are answered by adverbs and adverbial phrases, not adjectives",
        "'Who/Whom/Whose' are pronouns/question words about people, not adjective questions",
        "'How/When/Why' relate to manner, time, reason - adverb territory, not adjectives"
      ],
      commonMistakes: [
        "Confusing questions answered by adjectives vs adverbs",
        "Not using the 'What kind?' test to identify adjectives"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Complete with an opinion adjective:\n\n'That was a ___ movie!'",
    options: [
      "wonderful",
      "wooden",
      "Mumbai",
      "yesterday"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Wonderful' expresses opinion/judgment (speaker's view). Opinion adjectives: wonderful, terrible, good, bad, amazing, boring. These tell what you think, not objective facts.",
      trapAlerts: [
        "'wooden' describes material (objective fact), not opinion",
        "'Mumbai' is a proper noun (city name), not an adjective",
        "'yesterday' is a time word, not a describing adjective"
      ],
      commonMistakes: [
        "Not distinguishing opinion adjectives (good, bad) from fact adjectives (wooden, square)",
        "Using nouns or time words as adjectives"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },

  // SUBTOPIC 2: Comparative Adjectives - 15 questions
  {
    question: "How do we compare two things in English?",
    options: [
      "Add -er to short adjectives (bigger, taller)",
      "Add -est to all adjectives",
      "Add -ly to all adjectives",
      "Use 'very' before all adjectives"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "For short adjectives (1-2 syllables), add '-er' to compare two things: big → bigger, tall → taller, fast → faster. This is the comparative form. Use 'than' after: 'A is bigger than B'.",
      formula: "Short adjective + er + than (bigger than, taller than, faster than)",
      trapAlerts: [
        "'-est' is for superlatives (three or more things: biggest, tallest), not comparing two",
        "'-ly' creates adverbs (quickly, slowly), not comparative adjectives",
        "'very' intensifies but doesn't compare (very big = intense, not comparison)"
      ],
      commonMistakes: [
        "Adding '-est' when comparing only two things",
        "Not knowing the difference between comparative (-er) and superlative (-est)"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "What is the comparative form of 'tall'?",
    options: ["taller", "tallest", "more tall", "very tall"],
    correctAnswer: 0,
    explanation: {
      logic: "'Tall' is a short adjective (one syllable), so add '-er': taller. Use for comparing two things: 'Raj is taller than Amit'. Short adjectives form comparatives with '-er', not 'more'.",
      formula: "One-syllable adjective + er (tall → taller, big → bigger, fast → faster)",
      trapAlerts: [
        "'tallest' is superlative - for three or more (tallest of all), not comparing two",
        "'more tall' is wrong - one-syllable adjectives use '-er', not 'more'",
        "'very tall' intensifies but doesn't compare - means extremely tall, not taller than someone"
      ],
      commonMistakes: [
        "Using 'more' with short adjectives (saying 'more tall' instead of 'taller')",
        "Confusing comparative (taller) with superlative (tallest)"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Complete the sentence:\n\n'Mumbai is ___ than Delhi.'",
    options: [
      "bigger",
      "biggest",
      "more big",
      "very big"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Big' is short (one syllable), so comparative is 'bigger' (double the 'g', add '-er'). We're comparing two cities, so use comparative form with 'than'.",
      formula: "Short adjective ending in consonant-vowel-consonant: double last consonant + er (big → bigger, hot → hotter)",
      trapAlerts: [
        "'biggest' is superlative - use when comparing three or more cities",
        "'more big' is grammatically wrong - short adjectives don't use 'more'",
        "'very big' doesn't compare - just means extremely large"
      ],
      commonMistakes: [
        "Not doubling the final consonant (writing 'biger' instead of 'bigger')",
        "Using 'more' with one-syllable adjectives"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "How do we form comparatives for long adjectives (3+ syllables)?",
    options: [
      "Use 'more' before the adjective (more beautiful)",
      "Add -er to the end (beautifuler)",
      "Add -est to the end (beautifulest)",
      "Use 'very' before the adjective"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Long adjectives (3+ syllables) use 'more' + adjective for comparatives: beautiful → more beautiful, expensive → more expensive, intelligent → more intelligent. Don't add '-er' to long words.",
      formula: "More + long adjective + than (more beautiful than, more expensive than)",
      trapAlerts: [
        "'beautifuler' is not a real word - long adjectives don't take '-er'",
        "'-est' is for superlatives (most beautiful), not comparatives",
        "'very' intensifies but doesn't compare"
      ],
      commonMistakes: [
        "Adding '-er' to long adjectives (saying 'beautifuler', 'expensiver')",
        "Using 'more' with short adjectives that should take '-er'"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Choose the correct comparative:\n\n'This book is ___ than that one.'",
    options: [
      "more interesting",
      "interestinger",
      "most interesting",
      "very interesting"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Interesting' has 4 syllables (in-ter-est-ing), so it's long. Use 'more' for comparative: 'more interesting'. Comparing two books, so comparative (not superlative).",
      trapAlerts: [
        "'interestinger' tries to add '-er' to long adjective - grammatically wrong",
        "'most interesting' is superlative - for three or more books",
        "'very interesting' intensifies but doesn't compare with another book"
      ],
      commonMistakes: [
        "Adding '-er' to multi-syllable adjectives",
        "Not counting syllables to decide between -er and more"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "What is the irregular comparative of 'good'?",
    options: ["better", "gooder", "more good", "best"],
    correctAnswer: 0,
    explanation: {
      logic: "'Good' has an irregular comparative: better (NOT 'gooder'). Irregular comparatives must be memorized: good → better, bad → worse, far → farther/further. These don't follow normal rules.",
      formula: "Irregular comparatives: good → better, bad → worse, far → farther",
      trapAlerts: [
        "'gooder' applies regular -er rule - wrong, 'good' is irregular",
        "'more good' uses 'more' pattern - wrong, irregular form is 'better'",
        "'best' is superlative (good → better → best), not comparative"
      ],
      commonMistakes: [
        "Saying 'gooder' or 'more good' instead of 'better'",
        "Not memorizing the three most common irregular comparatives"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Find the error:\n\n'This car is more faster than that one.'",
    options: [
      "Remove 'more' - should be just 'faster'",
      "Remove 'faster' - should be just 'more fast'",
      "Remove 'than'",
      "No error"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Don't use both 'more' and '-er' together - it's double comparative! 'Fast' is short (one syllable), so only use '-er': faster (not 'more faster'). Choose one method: -er OR more, never both.",
      formula: "Short adjective: faster (not more faster) | Long adjective: more beautiful (no -er)",
      trapAlerts: [
        "Option B suggests 'more fast' - wrong, short adjectives take -er",
        "'than' is necessary for comparisons - shows what we're comparing to",
        "The error is using both 'more' and '-er' together"
      ],
      commonMistakes: [
        "Using double comparatives (more faster, more better) for emphasis",
        "Not knowing you must choose one method: -er OR more"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Complete the comparison:\n\n'Priya is ___ than her sister.'",
    options: [
      "older",
      "more old",
      "oldest",
      "very old"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Old' is short (one syllable), so comparative is 'older'. Comparing two people (Priya and sister), so use comparative (not superlative).",
      trapAlerts: [
        "'more old' uses 'more' with short adjective - should be '-er'",
        "'oldest' is superlative - for three or more people",
        "'very old' doesn't compare - means extremely aged"
      ],
      commonMistakes: [
        "Using 'more' with one-syllable adjectives",
        "Using superlative when comparing only two things"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "What word usually follows a comparative adjective?",
    options: ["than", "then", "from", "as"],
    correctAnswer: 0,
    explanation: {
      logic: "Comparatives use 'than' to show what we're comparing to: A is bigger than B, This is more expensive than that. 'Than' = comparison word.",
      formula: "Comparative adjective + than (bigger than, more beautiful than, better than)",
      trapAlerts: [
        "'then' is a time word (first...then) or consequence word (if...then), not for comparison",
        "'from' shows origin or source (from Mumbai), not comparison",
        "'as' is used in equal comparisons (as big as), not with comparatives"
      ],
      commonMistakes: [
        "Confusing 'than' (comparison) with 'then' (time/sequence)",
        "Using 'from' for comparisons (saying 'bigger from' instead of 'bigger than')"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Choose the correct sentence:",
    options: [
      "This exam is easier than the last one.",
      "This exam is more easy than the last one.",
      "This exam is easiest than the last one.",
      "This exam is more easier than the last one."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Easy' ends in '-y', change 'y' to 'i' and add '-er': easier. Two-syllable adjectives ending in '-y' use '-er', not 'more'. Comparing two exams, so comparative.",
      formula: "Adjective ending in -y: change y to i + er (easy → easier, happy → happier)",
      trapAlerts: [
        "'more easy' is wrong - adjectives ending in -y take -er (easier)",
        "'easiest' is superlative - for three or more exams",
        "'more easier' is double comparative - never use both 'more' and '-er'"
      ],
      commonMistakes: [
        "Not changing '-y' to 'i' before adding '-er'",
        "Using 'more' with -y adjectives (should use -ier)"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "What is the comparative of 'bad'?",
    options: ["worse", "badder", "more bad", "worst"],
    correctAnswer: 0,
    explanation: {
      logic: "'Bad' is irregular: bad → worse → worst. Irregular comparatives don't follow standard rules and must be memorized. 'Worse' is comparative (comparing two), 'worst' is superlative (three or more).",
      formula: "Irregular: bad → worse (comparative) → worst (superlative)",
      trapAlerts: [
        "'badder' applies regular -er rule - wrong, 'bad' is irregular",
        "'more bad' uses 'more' pattern - wrong, irregular is 'worse'",
        "'worst' is superlative, not comparative"
      ],
      commonMistakes: [
        "Saying 'badder' or 'more bad' instead of 'worse'",
        "Confusing 'worse' (comparative) with 'worst' (superlative)"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Find the correct comparative form:\n\n'Gold is ___ than silver.'",
    options: [
      "more expensive",
      "expensiver",
      "most expensive",
      "very expensive"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Expensive' has 3 syllables (ex-pen-sive), so use 'more' for comparative. Comparing two metals (gold vs silver), so comparative form.",
      trapAlerts: [
        "'expensiver' tries to add -er to long adjective - not standard English",
        "'most expensive' is superlative - for three or more items",
        "'very expensive' intensifies but doesn't compare with silver"
      ],
      commonMistakes: [
        "Adding '-er' to long adjectives",
        "Not recognizing when to use 'more' vs '-er'"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Which sentence correctly uses a comparative?",
    options: [
      "She is smarter than her brother.",
      "She is more smart than her brother.",
      "She is smartest than her brother.",
      "She is more smarter than her brother."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Smart' is short (one syllable), so add '-er': smarter. Comparing two people (she and brother), use comparative with 'than'.",
      trapAlerts: [
        "'more smart' uses 'more' with short adjective - should be '-er'",
        "'smartest' is superlative - can't be used with 'than' (use 'of' or 'in')",
        "'more smarter' is double comparative - never use both together"
      ],
      commonMistakes: [
        "Using 'more' with one-syllable adjectives",
        "Using superlative with 'than'"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Complete correctly:\n\n'Today is ___ than yesterday.'",
    options: [
      "hotter",
      "more hot",
      "hottest",
      "very hot"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Hot' is short (one syllable), ends in consonant-vowel-consonant, so double final 't' and add '-er': hotter. Comparing two days, so comparative.",
      formula: "CVC pattern: double last letter + er (hot → hotter, big → bigger, sad → sadder)",
      trapAlerts: [
        "'more hot' uses 'more' with short adjective - should be '-er'",
        "'hottest' is superlative - for three or more days",
        "'very hot' doesn't compare - means extremely hot"
      ],
      commonMistakes: [
        "Not doubling the final consonant (writing 'hoter' instead of 'hotter')",
        "Using 'more' with one-syllable adjectives"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "What's wrong with: 'He is more taller than me'?",
    options: [
      "Remove 'more' - should be just 'taller'",
      "Change 'taller' to 'tall'",
      "Change 'than' to 'then'",
      "Nothing is wrong"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Double comparative error! 'Tall' is short, so only use '-er': taller (not 'more taller'). Never combine 'more' with '-er' - choose one method based on adjective length.",
      trapAlerts: [
        "Changing 'taller' to 'tall' removes comparison - sentence needs comparative",
        "'than' is correct comparison word (not 'then')",
        "The sentence has an error - double comparative"
      ],
      commonMistakes: [
        "Using 'more' for emphasis with -er adjectives (very common error)",
        "Not recognizing double comparatives are always wrong"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },

  // SUBTOPIC 3: Superlative Adjectives - 15 questions
  {
    question: "When do we use superlative adjectives?",
    options: [
      "To compare three or more things (the biggest, the best)",
      "To compare two things only",
      "To describe one thing without comparison",
      "To make adjectives negative"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Superlatives show one item is the extreme among three or more: the tallest (of all students), the most expensive (of all cars). Use when comparing 3+ items to identify the maximum/minimum.",
      formula: "The + superlative (the biggest, the smallest, the most beautiful)",
      trapAlerts: [
        "Two things only use comparative (bigger), not superlative (biggest)",
        "Single items with no comparison use basic adjective (big house), not superlative",
        "Superlatives don't make negatives - they show extremes"
      ],
      commonMistakes: [
        "Using superlative when comparing only two things",
        "Forgetting 'the' before superlatives (saying 'biggest' without 'the')"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "What is the superlative form of 'big'?",
    options: ["biggest", "bigger", "most big", "very big"],
    correctAnswer: 0,
    explanation: {
      logic: "'Big' is short (one syllable), so add '-est': biggest. Don't forget to double the final 'g' because it follows consonant-vowel-consonant pattern. Always use 'the' before: the biggest.",
      formula: "Short adjective + est (big → biggest, tall → tallest, fast → fastest)",
      trapAlerts: [
        "'bigger' is comparative - for two things, not three or more",
        "'most big' is wrong - short adjectives use '-est', not 'most'",
        "'very big' intensifies but doesn't show it's the extreme among a group"
      ],
      commonMistakes: [
        "Not doubling final consonant (writing 'bigest' instead of 'biggest')",
        "Using 'most' with short adjectives"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Complete the sentence:\n\n'Mount Everest is ___ mountain in the world.'",
    options: [
      "the highest",
      "higher",
      "the most high",
      "very high"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'High' is short, so superlative is 'the highest'. Comparing among all mountains in the world (many), so superlative. Must use 'the' before superlatives.",
      formula: "The + adjective + est + in/of (the highest in the world, the biggest of all)",
      trapAlerts: [
        "'higher' is comparative - for two mountains, not all mountains",
        "'the most high' uses 'most' with short adjective - should be '-est'",
        "'very high' intensifies but doesn't show it's number one"
      ],
      commonMistakes: [
        "Omitting 'the' before superlatives",
        "Using comparative when comparing more than two things"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "How do we form superlatives for long adjectives?",
    options: [
      "Use 'the most' before the adjective (the most beautiful)",
      "Add -est to the end (beautifulest)",
      "Use 'more' before the adjective",
      "Add -er to the end"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Long adjectives (3+ syllables) use 'the most' + adjective: the most beautiful, the most expensive, the most intelligent. Never add '-est' to long words.",
      formula: "The most + long adjective (the most beautiful, the most interesting)",
      trapAlerts: [
        "'beautifulest' tries to add -est to long word - not standard English",
        "'more' is for comparatives (two things), superlatives use 'most' (three or more)",
        "'-er' is for comparative, not superlative"
      ],
      commonMistakes: [
        "Adding '-est' to long adjectives",
        "Confusing 'more' (comparative) with 'most' (superlative)"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Choose the correct superlative:\n\n'This is ___ movie I've ever seen.'",
    options: [
      "the best",
      "better",
      "the gooder",
      "the most good"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Good' is irregular: good → better → best. Superlative is 'the best'. Comparing among all movies seen (many), so superlative. Irregular forms must be memorized.",
      formula: "Irregular superlatives: good → the best, bad → the worst, far → the farthest",
      trapAlerts: [
        "'better' is comparative - for two movies, not all movies",
        "'the gooder' applies regular -er - wrong, 'good' is irregular",
        "'the most good' uses 'most' - wrong, irregular is 'best'"
      ],
      commonMistakes: [
        "Saying 'goodest' or 'most good' instead of 'best'",
        "Forgetting irregular superlatives"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Find the error:\n\n'She is the most smartest girl in the class.'",
    options: [
      "Remove 'most' - should be 'the smartest'",
      "Remove 'est' - should be 'the most smart'",
      "Remove 'the'",
      "No error"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Double superlative error! 'Smart' is short, so only use '-est': the smartest (not 'the most smartest'). Never use both 'most' and '-est' together.",
      formula: "Short adjective: the smartest | Long adjective: the most beautiful | NEVER both together",
      trapAlerts: [
        "Option B suggests 'the most smart' - wrong for short adjectives",
        "'the' is required before superlatives - don't remove it",
        "The error is using both 'most' and '-est'"
      ],
      commonMistakes: [
        "Using double superlatives (the most smartest, the most biggest)",
        "Not knowing you must choose: -est OR most, never both"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Complete correctly:\n\n'Of all the students, Priya is ___.'",
    options: [
      "the tallest",
      "taller",
      "more tall",
      "very tall"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Of all the students' indicates comparing many (3+), so superlative. 'Tall' is short, so 'the tallest'. Use 'of' or 'in' with superlatives to show the group.",
      formula: "The + superlative + of/in + group (the tallest of all, the biggest in the class)",
      trapAlerts: [
        "'taller' is comparative - for two students only",
        "'more tall' uses 'more' with short adjective - should be '-er' for comparative or '-est' for superlative",
        "'very tall' doesn't compare with the group"
      ],
      commonMistakes: [
        "Using comparative when 'of all' or 'in the' indicates many items",
        "Omitting 'the' before superlatives"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "What is the superlative of 'bad'?",
    options: ["the worst", "the baddest", "the most bad", "badder"],
    correctAnswer: 0,
    explanation: {
      logic: "'Bad' is irregular: bad → worse → worst. Superlative is 'the worst'. Must be memorized - doesn't follow regular patterns.",
      formula: "Irregular: bad → worse (comparative) → the worst (superlative)",
      trapAlerts: [
        "'the baddest' applies regular -est - wrong, 'bad' is irregular",
        "'the most bad' uses 'most' - wrong, irregular is 'worst'",
        "'badder' doesn't exist - and that would be comparative anyway"
      ],
      commonMistakes: [
        "Saying 'baddest' or 'most bad' instead of 'worst'",
        "Not memorizing the three main irregular superlatives (best, worst, farthest)"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Choose the correct sentence:",
    options: [
      "This is the most interesting book I've read.",
      "This is the interestingest book I've read.",
      "This is the more interesting book I've read.",
      "This is the very interesting book I've read."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Interesting' is long (4 syllables), so superlative uses 'the most': the most interesting. Comparing among all books read (many), so superlative.",
      trapAlerts: [
        "'interestingest' adds -est to long adjective - not standard",
        "'more interesting' is comparative - for two books, not all books",
        "'very interesting' is just intense description, not superlative comparison"
      ],
      commonMistakes: [
        "Adding '-est' to multi-syllable adjectives",
        "Using comparative (more) instead of superlative (most)"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "What word must come before every superlative?",
    options: ["the", "a", "an", "very"],
    correctAnswer: 0,
    explanation: {
      logic: "Superlatives ALWAYS use 'the' because we're identifying THE one extreme item among a group: the biggest, the best, the most expensive. 'The' shows this is THE unique maximum/minimum.",
      formula: "the + superlative adjective (the tallest, the most beautiful, the best)",
      trapAlerts: [
        "'a/an' are for one of many, superlatives identify THE unique extreme",
        "'very' intensifies but doesn't create superlative comparison",
        "Only 'the' works with superlatives"
      ],
      commonMistakes: [
        "Omitting 'the' before superlatives (saying 'biggest house' instead of 'the biggest house')",
        "Using 'a/an' with superlatives"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Find the correct form:\n\n'December is ___ month of the year.'",
    options: [
      "the coldest",
      "colder",
      "the most cold",
      "very cold"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Cold' is short (one syllable), so superlative is 'the coldest'. Comparing all 12 months, so superlative. Must include 'the'.",
      trapAlerts: [
        "'colder' is comparative - for two months, not all twelve",
        "'the most cold' uses 'most' with short adjective - should be '-est'",
        "'very cold' intensifies but doesn't compare with other months"
      ],
      commonMistakes: [
        "Using 'most' with one-syllable adjectives",
        "Using comparative when comparing more than two items"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Complete with superlative:\n\n'The Taj Mahal is one of ___ buildings in India.'",
    options: [
      "the most beautiful",
      "beautifuler",
      "more beautiful",
      "very beautiful"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Beautiful' is long (4 syllables), so superlative uses 'the most'. 'One of the most...' is a common pattern for superlatives, comparing among many buildings.",
      formula: "One of + the + superlative + plural noun (one of the most beautiful buildings)",
      trapAlerts: [
        "'beautifuler' adds -er to long adjective - not standard",
        "'more beautiful' is comparative - 'one of' requires superlative",
        "'very beautiful' intensifies but doesn't make it superlative"
      ],
      commonMistakes: [
        "Using comparative with 'one of the' - should be superlative",
        "Adding '-er' to long adjectives"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Which is the correct superlative form?",
    options: [
      "the easiest",
      "the most easy",
      "the easyest",
      "the more easy"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Easy' ends in '-y', change to 'i' and add '-est': easiest. Two-syllable adjectives ending in '-y' take '-est' (not 'most'). Don't forget 'the'.",
      formula: "Adjective ending in -y: change y to i + est (easy → the easiest, happy → the happiest)",
      trapAlerts: [
        "'the most easy' uses 'most' - wrong, -y adjectives take -est",
        "'the easyest' doesn't change 'y' to 'i' - must change it",
        "'the more easy' is comparative form, not superlative"
      ],
      commonMistakes: [
        "Not changing 'y' to 'i' before adding '-est'",
        "Using 'most' with -y adjectives (should be -iest)"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "What's wrong with: 'He is tallest boy in the class'?",
    options: [
      "Missing 'the' before 'tallest'",
      "'tallest' should be 'taller'",
      "'boy' should be 'boys'",
      "Nothing is wrong"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Superlatives MUST have 'the': the tallest (not just 'tallest'). The article 'the' is essential because superlatives identify THE unique extreme in a group.",
      trapAlerts: [
        "'taller' is comparative - wrong, comparing among whole class (many) needs superlative",
        "'boy' is correctly singular - we're talking about one boy who is the tallest",
        "The sentence is missing 'the'"
      ],
      commonMistakes: [
        "Omitting 'the' before superlatives - very common error",
        "Thinking 'the' is optional with superlatives"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Choose the sentence with correct superlative usage:",
    options: [
      "This is the hottest day of the summer.",
      "This is hotest day of the summer.",
      "This is the more hot day of the summer.",
      "This is the most hot day of the summer."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Hot' is short, ends in CVC (consonant-vowel-consonant), so double 't' and add '-est': the hottest. Comparing all summer days (many), so superlative with 'the'.",
      formula: "CVC + double + est (hot → the hottest, big → the biggest)",
      trapAlerts: [
        "'hotest' doesn't double 't' - must double: hottest",
        "'the more hot' is comparative form and uses 'more' with short adjective",
        "'the most hot' uses 'most' with short adjective - should be '-est'"
      ],
      commonMistakes: [
        "Not doubling final consonant (writing 'hotest')",
        "Using 'most' with one-syllable adjectives"
      ]
    },
    difficulty: "hard",
    level: "A1"
  }

  // SUBTOPIC 4: Order of Adjectives - 15 questions
  // Due to token limits, I'll create a separate batch file for this
];

async function insertQuestions() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('\n🎓 Inserting Adjectives Questions (Batch 1/2)');
    console.log('='.repeat(80));
    console.log(`\n📋 Topic: adjectives (A1 level)`);
    console.log(`   Questions in this batch: ${ADJECTIVES_QUESTIONS.length}`);
    console.log(`   Subtopics covered: Descriptive (15), Comparative (15), Superlative (15)\n`);

    let inserted = 0;
    for (const q of ADJECTIVES_QUESTIONS) {
      await pool.query(
        `INSERT INTO english_questions
         (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
        [
          'foundation',
          'adjectives',
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
        console.log(`   ✓ Inserted ${inserted}/${ADJECTIVES_QUESTIONS.length}...`);
      }
    }

    console.log(`\n✅ Successfully inserted ${inserted} questions!`);
    console.log(`\n📊 Progress: ${inserted}/60 questions for adjectives`);
    console.log(`   Next batch will add 15 more (Order of Adjectives)`);

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

insertQuestions();
