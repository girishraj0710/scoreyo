import { Pool } from 'pg';
import { config } from 'dotenv';

config({ path: '.env.local' });

/**
 * Nouns Questions - Batch 2/2
 * Subtopics: Countable vs Uncountable (15) + Mixed Practice (15)
 */

const NOUNS_QUESTIONS_BATCH2 = [
  // SUBTOPIC 3: Countable vs Uncountable (15 questions)
  {
    question: "Which noun is uncountable?\n\nUncountable nouns cannot be counted individually.",
    options: ["water", "bottle", "cup", "glass"],
    correctAnswer: 0,
    explanation: {
      logic: "Uncountable nouns refer to things we cannot count as individual units. 'Water' is uncountable - we can't say 'one water, two waters'. We measure it (a glass of water, two liters of water). Bottle, cup, and glass are containers - they're countable.",
      formula: "Uncountable = Cannot count directly (water, milk, rice) | Countable = Can count (bottle, cup, glass)",
      trapAlerts: [
        "'bottle' is countable - we can say 'one bottle, two bottles, three bottles'",
        "'cup' is countable - we can count cups (one cup, two cups)",
        "'glass' is countable - refers to the container, not the water inside"
      ],
      commonMistakes: [
        "Confusing the liquid (uncountable) with its container (countable)",
        "Adding 's' to uncountable nouns (saying 'two waters' in standard English)"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Complete the sentence:\n\n'I need ___ to make tea.'",
    options: ["some sugar", "a sugar", "sugars", "two sugar"],
    correctAnswer: 0,
    explanation: {
      logic: "'Sugar' is uncountable. With uncountable nouns, we use 'some' (not 'a/an') and no plural form. We can't say 'a sugar' or 'two sugars' in standard English. To specify amount, we use containers: 'two spoons of sugar', 'a packet of sugar'.",
      formula: "Uncountable noun + some (not a/an) | No plural form",
      trapAlerts: [
        "'a sugar' is wrong - uncountable nouns don't use 'a/an' (we don't count them)",
        "'sugars' adds plural 's' - uncountable nouns have no plural form",
        "'two sugar' uses a number - uncountable nouns can't be directly counted"
      ],
      commonMistakes: [
        "Using 'a/an' with uncountable nouns (saying 'a sugar', 'a rice', 'a milk')",
        "Making uncountable nouns plural (saying 'sugars', 'rices', 'milks')"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Which sentence is correct?",
    options: [
      "I bought some rice from the shop.",
      "I bought a rice from the shop.",
      "I bought rices from the shop.",
      "I bought two rice from the shop."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Rice' is uncountable. We use 'some' (or 'much'/'a lot of') with uncountable nouns. We can't say 'a rice' or count rice grains individually in normal conversation. To specify amount: 'a bag of rice', 'two kilos of rice'.",
      trapAlerts: [
        "'a rice' uses 'a' with uncountable - wrong (rice can't be counted as 'one rice')",
        "'rices' makes it plural - wrong (uncountable nouns don't have plural)",
        "'two rice' uses a number - wrong (can't directly count rice without a measuring word)"
      ],
      commonMistakes: [
        "Treating uncountable nouns like countable (saying 'a rice', 'two rice')",
        "Direct translation from Hindi where 'ek chawal' makes sense but 'a rice' doesn't in English"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Choose the countable noun:",
    options: ["apple", "milk", "air", "water"],
    correctAnswer: 0,
    explanation: {
      logic: "Countable nouns can be counted individually: one apple, two apples, three apples. We can use 'a/an' with them and make them plural. Milk, air, and water are uncountable - we measure them, not count them.",
      trapAlerts: [
        "'milk' is uncountable - we say 'some milk' or 'a glass of milk', not 'a milk'",
        "'air' is uncountable - we can't count air units, we measure it",
        "'water' is uncountable - we measure it (liters, glasses) rather than count it"
      ],
      commonMistakes: [
        "Thinking all food items are countable - many are uncountable (milk, bread, butter)",
        "Not recognizing that liquids and gases are typically uncountable"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "What do we use with uncountable nouns to show quantity?",
    options: [
      "some, much, a lot of",
      "a, an",
      "many, few",
      "one, two, three"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "With uncountable nouns, we use 'some' (positive), 'much' (negative/question), 'a lot of' (large quantity), 'a little' (small quantity). We cannot use 'a/an' (for single items) or numbers directly with uncountable nouns.",
      formula: "Uncountable: some/much/a lot of | Countable: a/an/many/few",
      trapAlerts: [
        "'a, an' work ONLY with singular countable nouns (a book, an apple)",
        "'many, few' work ONLY with countable plural nouns (many books, few apples)",
        "Numbers (one, two, three) work ONLY with countable nouns"
      ],
      commonMistakes: [
        "Using 'many' with uncountable (saying 'many milk' instead of 'much milk')",
        "Using 'much' with countable (saying 'much apples' instead of 'many apples')"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Find the error:\n\n'Can I have two breads please?'",
    options: [
      "'breads' should be 'slices of bread' or 'pieces of bread'",
      "'Can I have' should be 'May I have'",
      "'two' should be 'some'",
      "The sentence is correct"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Bread' is uncountable. We can't say 'two breads'. We need a counting word: 'two slices of bread', 'two pieces of bread', 'two loaves of bread'. The counting word depends on the form: slice (cut pieces), loaf (whole bread), piece (any portion).",
      formula: "Uncountable noun needs measuring words: slice/piece/loaf/glass/cup of + noun",
      trapAlerts: [
        "'Can I have' is polite and correct for requests - both 'Can' and 'May' work here",
        "Changing 'two' to 'some' doesn't fix the plural 'breads' problem",
        "The sentence has an error ('breads'), so it's not correct"
      ],
      commonMistakes: [
        "Making uncountable nouns plural (saying 'breads', 'milks', 'rices')",
        "Not using measuring words (slice, piece, glass, cup) with uncountable nouns"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Which is uncountable?",
    options: ["furniture", "chair", "table", "desk"],
    correctAnswer: 0,
    explanation: {
      logic: "'Furniture' is uncountable in English - it's a collective term for chairs, tables, beds, etc. We say 'some furniture', 'much furniture', not 'a furniture' or 'two furnitures'. Individual items (chair, table, desk) are countable.",
      trapAlerts: [
        "'chair' is countable - one chair, two chairs, many chairs",
        "'table' is countable - we can count tables individually",
        "'desk' is countable - one desk, two desks, three desks"
      ],
      commonMistakes: [
        "Saying 'a furniture' or 'two furnitures' - furniture is uncountable",
        "Not knowing furniture is a category word (like 'information', 'equipment')"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Complete correctly:\n\n'There is ___ in the fridge.'",
    options: ["some milk", "a milk", "two milk", "milks"],
    correctAnswer: 0,
    explanation: {
      logic: "'Milk' is uncountable. We use 'is' (not 'are') with uncountable nouns because they're treated as singular. We use 'some' to indicate an unspecified amount. To specify: 'a bottle of milk', 'two liters of milk'.",
      formula: "Uncountable noun + is (singular verb) | There is some milk (not there are)",
      trapAlerts: [
        "'a milk' treats milk as countable - wrong ('milk' can't be counted as units)",
        "'two milk' uses a number directly - need measuring word: 'two bottles of milk'",
        "'milks' makes it plural - uncountable nouns don't have plural forms"
      ],
      commonMistakes: [
        "Using 'are' with uncountable nouns (saying 'there are milk')",
        "Forgetting uncountable nouns are grammatically singular"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Which sentence uses the uncountable noun correctly?",
    options: [
      "I need some information about the course.",
      "I need an information about the course.",
      "I need informations about the course.",
      "I need two information about the course."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Information' is uncountable in English (though it's countable in some languages). We use 'some information', 'much information', never 'an information' or 'informations'. To specify units: 'a piece of information', 'two pieces of information'.",
      trapAlerts: [
        "'an information' treats it as countable - wrong (information is uncountable)",
        "'informations' adds plural - wrong (uncountable nouns don't pluralize)",
        "'two information' uses a number - need 'two pieces of information'"
      ],
      commonMistakes: [
        "Making information plural (saying 'informations') - common error for Hindi speakers",
        "Using 'a/an' with information - it's always uncountable in English"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "How do we make uncountable nouns countable?",
    options: [
      "Use measuring words: a cup of, a piece of, a kilo of",
      "Add -s to make plural",
      "Use a/an before them",
      "Use numbers directly"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "To count uncountable nouns, we use measuring/partitive words before them. Examples: a cup of tea, two glasses of water, three slices of bread, four kilos of rice. The measuring word becomes countable, not the noun itself.",
      formula: "Number + measuring word + of + uncountable noun (two cups of coffee)",
      trapAlerts: [
        "Adding '-s' doesn't work - uncountable nouns don't have plural forms",
        "Using 'a/an' alone doesn't work - need the measuring word (a cup of, not just a)",
        "Numbers can't be used directly - need measuring word in between"
      ],
      commonMistakes: [
        "Trying to count uncountable nouns directly (two sugar, three milk)",
        "Not learning common measuring words (cup, glass, slice, piece, kilo)"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Which is correct?",
    options: [
      "I bought three bottles of water.",
      "I bought three waters.",
      "I bought three water.",
      "I bought a three water."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Water' is uncountable, so we need a measuring word 'bottle' to count it. The counting word 'bottle' becomes plural (bottles), not the water. This pattern works for all uncountable nouns: three cups of tea, two kilos of sugar.",
      formula: "Number + countable container (plural) + of + uncountable noun",
      trapAlerts: [
        "'three waters' treats water as countable - wrong in standard English",
        "'three water' uses number without measuring word or plural - grammatically broken",
        "'a three water' mixes 'a' (singular) with 'three' (plural) - contradictory"
      ],
      commonMistakes: [
        "Saying 'three waters' or 'two milks' - need containers (bottles, glasses)",
        "Making the uncountable noun plural instead of the container"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Choose the countable noun from this group of food words:",
    options: ["orange", "sugar", "rice", "salt"],
    correctAnswer: 0,
    explanation: {
      logic: "'Orange' (the fruit) is countable - we can say one orange, two oranges, three oranges. Sugar, rice, and salt are uncountable - they're substances we measure, not count. Note: 'orange' (color/juice) might be uncountable in different contexts.",
      trapAlerts: [
        "'sugar' is uncountable - we measure it (a spoon of sugar, not a sugar)",
        "'rice' is uncountable - grains are too small to count individually in normal conversation",
        "'salt' is uncountable - it's a substance we measure (a pinch of salt)"
      ],
      commonMistakes: [
        "Thinking all food is uncountable - whole fruits/vegetables are countable (apple, banana, potato)",
        "Treating powders and grains as countable (saying 'a salt', 'two rices')"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Find the error:\n\n'She gave me many advices.'",
    options: [
      "'many advices' should be 'much advice' or 'many pieces of advice'",
      "'gave me' should be 'give me'",
      "'She' should be 'Her'",
      "The sentence is correct"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Advice' is uncountable in English. We use 'much advice' (not 'many advices'). With uncountable nouns, we use 'much' (not 'many'). To count: 'a piece of advice', 'two pieces of advice'. 'Many' works only with countable plurals.",
      formula: "Uncountable + much | Countable plural + many",
      trapAlerts: [
        "'gave me' is correct past tense - 'She gave' is grammatically fine",
        "'She' is correct subject pronoun - 'Her' would be object (gave her, not her gave)",
        "The sentence has an error ('many advices'), so it's not correct"
      ],
      commonMistakes: [
        "Making advice plural (saying 'advices') - it's uncountable in English",
        "Using 'many' with uncountable nouns - should be 'much'"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Which pair is correct?\n\nCountable and uncountable versions of similar items:",
    options: [
      "banana (countable) / fruit (can be uncountable)",
      "banana (uncountable) / fruit (countable)",
      "Both are always countable",
      "Both are always uncountable"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Banana' is countable (one banana, two bananas) because we can count individual fruits. 'Fruit' can be uncountable when referring to the general category (I eat fruit daily) or countable when referring to types (tropical fruits). General rule: specific items = countable, categories = often uncountable.",
      trapAlerts: [
        "Option B reverses them incorrectly - bananas are clearly countable items",
        "Both can't always be countable - 'fruit' as a category is uncountable",
        "Both can't always be uncountable - we clearly count bananas (one, two, three)"
      ],
      commonMistakes: [
        "Not understanding category words (fruit, furniture, equipment) are uncountable",
        "Treating all food items the same - some countable (apple), some uncountable (rice)"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Complete the sentence:\n\n'There ___ much traffic today.'",
    options: ["is", "are", "am", "were"],
    correctAnswer: 0,
    explanation: {
      logic: "'Traffic' is uncountable and grammatically singular, so we use 'is' (not 'are'). 'Much' confirms it's uncountable (we use 'much' with uncountable, 'many' with countable). Even though traffic consists of many vehicles, the word itself is uncountable.",
      formula: "Uncountable noun + is (singular) | Countable plural + are",
      trapAlerts: [
        "'are' is for plural countable subjects - traffic is uncountable singular",
        "'am' only works with 'I' (I am, not there am)",
        "'were' is past tense, but 'today' indicates present tense is needed"
      ],
      commonMistakes: [
        "Using 'are' with uncountable nouns (saying 'there are traffic')",
        "Thinking uncountable nouns that represent many items are plural"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },

  // SUBTOPIC 4: Mixed Practice (15 questions)
  {
    question: "Identify all the nouns in this sentence:\n\n'Rahul bought a new laptop from the store.'",
    options: [
      "Rahul, laptop, store",
      "bought, new, from",
      "Rahul, new, store",
      "a, the, from"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Nouns name people, places, or things. In this sentence: 'Rahul' (person's name - proper noun), 'laptop' (thing - common noun), 'store' (place - common noun). The other words are: 'bought' (verb), 'new' (adjective), 'a/the' (articles), 'from' (preposition).",
      formula: "Noun = Names person, place, or thing | Verb = Action | Adjective = Describes",
      trapAlerts: [
        "'bought, new, from' are not nouns - they're verb, adjective, and preposition",
        "'new' is an adjective describing laptop, not a noun itself",
        "'a, the, from' are articles and preposition, not nouns"
      ],
      commonMistakes: [
        "Confusing adjectives with nouns (thinking 'new' is a noun because it's near 'laptop')",
        "Not recognizing proper nouns (names) as a type of noun"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Which sentence has correct noun usage (capitalization, singular/plural)?",
    options: [
      "My brother lives in Mumbai and works at Microsoft.",
      "My Brother lives in mumbai and works at microsoft.",
      "My brother lives in Mumbai and works at microsofts.",
      "My brothers lives in Mumbai and works at Microsoft."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Correct: 'brother' is common (lowercase), 'Mumbai' is proper (capitalize city), 'Microsoft' is proper (capitalize company name). 'Brother' is singular ('My brother' = one person, so 'lives' not 'live').",
      trapAlerts: [
        "Option B doesn't capitalize proper nouns Mumbai and Microsoft",
        "Option C makes 'Microsoft' plural - company names don't pluralize",
        "Option D makes 'brother' plural but uses singular verb 'lives' (mismatch)"
      ],
      commonMistakes: [
        "Capitalizing common nouns (Brother, Sister) when not used as names",
        "Not capitalizing company names or city names"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Complete with the correct noun form:\n\n'Five ___ are playing in the park.'",
    options: ["children", "child", "childs", "childrens"],
    correctAnswer: 0,
    explanation: {
      logic: "'Five' indicates we need plural. 'Child' has irregular plural 'children' (not 'childs'). Irregular plurals must be memorized - they don't follow standard rules.",
      formula: "Irregular plurals: child → children, man → men, woman → women, person → people",
      trapAlerts: [
        "'child' is singular - can't use with 'five' (numbers > 1 need plural)",
        "'childs' treats child as regular - wrong, it's irregular (children)",
        "'childrens' adds 's' to 'children' - double plural error"
      ],
      commonMistakes: [
        "Treating all nouns as regular (saying 'childs', 'mans', 'womans')",
        "Adding '-s' to irregular plurals that are already plural"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Which sentence shows correct countable/uncountable usage?",
    options: [
      "I need to buy some vegetables and some milk.",
      "I need to buy some vegetable and a milk.",
      "I need to buy many vegetable and many milk.",
      "I need to buy two vegetable and two milk."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Vegetables' (plural countable) takes 'some'. 'Milk' (uncountable) takes 'some' (not 'a'). 'Some' works with both countable plurals and uncountable nouns. For specific amounts: 'three carrots' (countable), 'two liters of milk' (uncountable with measuring word).",
      formula: "some + countable plural OR some + uncountable",
      trapAlerts: [
        "Option B uses 'vegetable' (singular) and 'a milk' (wrong for uncountable)",
        "Option C uses 'many' - wrong with uncountable 'milk' (should be 'much')",
        "Option D uses numbers without plural or measuring words"
      ],
      commonMistakes: [
        "Using 'many' with uncountable (saying 'many milk' instead of 'much milk')",
        "Forgetting to pluralize countable nouns after 'some'"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Find all proper nouns:\n\n'Last Tuesday, Meera visited the Taj Mahal with her uncle.'",
    options: [
      "Tuesday, Meera, Taj Mahal",
      "Last, visited, with",
      "Meera, uncle, her",
      "visited, Taj Mahal"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Proper nouns are specific names that capitalize: 'Tuesday' (day name), 'Meera' (person's name), 'Taj Mahal' (monument name). Common nouns here: 'uncle' (not a specific name, just a relationship).",
      trapAlerts: [
        "'Last, visited, with' are not nouns - adjective, verb, and preposition",
        "'uncle' is common (not proper) - it's lowercase and refers to any uncle, not his name",
        "'visited' is a verb (action), not a noun"
      ],
      commonMistakes: [
        "Not capitalizing days of the week - they're proper nouns in English",
        "Thinking family words (uncle, aunt) are proper - they're common unless used AS the name"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Choose the sentence with the correct plural form:",
    options: [
      "The shelves in the library are full of books.",
      "The shelfs in the library are full of books.",
      "The shelve in the library are full of books.",
      "The shelvies in the library are full of books."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Shelf' ends in 'f', so it changes to 'ves' in plural: shelves (like knife → knives, wolf → wolves). The verb 'are' confirms we need plural. 'Shelves' has a 'v' sound, not 'f' sound.",
      formula: "Noun ending in f/fe → ves (shelf → shelves, knife → knives, life → lives)",
      trapAlerts: [
        "'shelfs' just adds 's' - wrong for words ending in f/fe",
        "'shelve' is singular (one), doesn't match plural verb 'are'",
        "'shelvies' is not a real pattern - f/fe words become 'ves', not 'vies'"
      ],
      commonMistakes: [
        "Not changing f to v in plurals (writing 'shelfs', 'knifes', 'lifes')",
        "Forgetting the sound change from 'f' to 'v' in these plurals"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Which noun needs to be changed?\n\n'I have ten book and five pen.'",
    options: [
      "Both: books and pens",
      "Only book",
      "Only pen",
      "No changes needed"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Numbers greater than one require plural nouns. 'Ten' needs 'books' (plural). 'Five' needs 'pens' (plural). Both are regular nouns that add '-s' for plural.",
      formula: "Number (2+) + plural noun | One + singular noun",
      trapAlerts: [
        "Changing only 'book' leaves 'pen' singular after 'five' - wrong",
        "Changing only 'pen' leaves 'book' singular after 'ten' - wrong",
        "Both nouns need plural because both numbers are greater than one"
      ],
      commonMistakes: [
        "Using singular nouns after numbers > 1 (common Hindi L1 interference)",
        "Only fixing one error when there are multiple"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Identify the noun that can be BOTH countable and uncountable:\n\nContext changes the meaning.",
    options: [
      "paper",
      "table",
      "Mumbai",
      "child"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Paper' is countable when meaning sheets (I need two papers) or uncountable when meaning the material (I need some paper to write on). Context determines usage. 'Table', 'Mumbai', and 'child' have only one usage pattern.",
      trapAlerts: [
        "'table' is always countable - one table, two tables",
        "'Mumbai' is always proper noun (city name) - can't be uncountable",
        "'child' is always countable - has irregular plural 'children'"
      ],
      commonMistakes: [
        "Not recognizing some nouns change countability based on context",
        "Always treating nouns the same way regardless of meaning (paper as sheets vs. paper as material)"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Complete correctly:\n\n'The ___ of this city are very old.'",
    options: [
      "buildings",
      "building",
      "buildinges",
      "building's"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'The' at the start and 'are' (plural verb) indicate we need plural noun. 'Building' is regular, so add '-s': buildings. The plural subject matches the plural verb.",
      formula: "Plural noun + are | Singular noun + is",
      trapAlerts: [
        "'building' is singular - doesn't match with plural verb 'are'",
        "'buildinges' adds '-es' incorrectly - 'building' doesn't end in s/x/z/ch/sh",
        "'building's' is possessive (building's door), not plural"
      ],
      commonMistakes: [
        "Confusing possessive ('s) with plural ('s without apostrophe)",
        "Not matching plural subject with plural verb form"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Which sentence has correct noun-verb agreement?",
    options: [
      "The furniture in my room is new.",
      "The furniture in my room are new.",
      "The furnitures in my room is new.",
      "The furnitures in my room are new."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Furniture' is uncountable and grammatically singular, so we use 'is' (not 'are'). We never say 'furnitures' - furniture has no plural form. Even though furniture includes multiple items, the word itself is uncountable.",
      formula: "Uncountable noun (furniture) + is | Countable plural + are",
      trapAlerts: [
        "'furniture are' treats it as plural - wrong, furniture is uncountable singular",
        "'furnitures is' makes furniture plural - it doesn't have a plural form",
        "'furnitures are' has double error - wrong plural and wrong verb"
      ],
      commonMistakes: [
        "Making furniture plural (saying 'furnitures')",
        "Using plural verb with uncountable nouns"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Find the error:\n\n'My sister birthday is in march.'",
    options: [
      "Both: sister's and March",
      "Only sister",
      "Only march",
      "No error"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Two errors: (1) 'sister birthday' should be 'sister's birthday' (possessive), (2) 'march' should be 'March' (month names are proper nouns, capitalize them). The apostrophe shows ownership.",
      formula: "Possessive = apostrophe + s ('s) | Months = Always capitalize (proper nouns)",
      trapAlerts: [
        "Fixing only possessive misses that months need capitals",
        "Fixing only capitalization misses the possessive error",
        "The sentence has two errors, so it's not correct"
      ],
      commonMistakes: [
        "Forgetting apostrophe for possession (writing 'sister birthday' instead of 'sister's birthday')",
        "Not capitalizing month names - they're proper nouns in English"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Which shows correct use of singular and plural?",
    options: [
      "One child is playing. Two children are playing.",
      "One child is playing. Two childs are playing.",
      "One children is playing. Two children are playing.",
      "One child are playing. Two children is playing."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Singular: 'one child' (singular noun) + 'is' (singular verb). Plural: 'two children' (irregular plural) + 'are' (plural verb). Subject-verb agreement must match: singular with singular, plural with plural.",
      formula: "Singular: child + is | Plural: children + are",
      trapAlerts: [
        "'childs' is wrong - 'child' has irregular plural 'children'",
        "'one children' uses plural with 'one' - wrong (one = singular)",
        "Last option has mismatched verbs - 'child are' and 'children is' are both wrong"
      ],
      commonMistakes: [
        "Using 'childs' instead of irregular 'children'",
        "Not matching singular subjects with singular verbs, plural with plural"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Complete with the correct noun:\n\n'___ India has a long history.'",
    options: [
      "Remove the blank (no article needed)",
      "The",
      "A",
      "An"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Country names don't use articles in English. We say 'India' (not 'the India'), 'China' (not 'the China'). Exception: Some country names DO use 'the' (the USA, the UK, the Philippines) - usually plurals or unions.",
      formula: "Most countries = No article | Plural/union countries = the (the USA, the UK)",
      trapAlerts: [
        "'The India' is wrong - single country names don't use articles",
        "'A India' treats it like countable common noun - wrong, it's a proper noun",
        "'An India' also treats it as common - country names are proper nouns"
      ],
      commonMistakes: [
        "Adding 'the' before country names (saying 'the India', 'the China')",
        "Direct translation from Hindi where articles don't exist"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Which sentence correctly uses both countable and uncountable nouns?",
    options: [
      "I bought three apples and some honey from the market.",
      "I bought three apple and a honey from the market.",
      "I bought three apples and two honey from the market.",
      "I bought three apple and many honey from the market."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Three' needs plural countable 'apples'. 'Honey' is uncountable, so we use 'some' (not 'a', not a number directly). Countable and uncountable nouns follow different rules even in the same sentence.",
      trapAlerts: [
        "Option B uses 'apple' (singular) with 'three' and 'a honey' (wrong for uncountable)",
        "Option C uses 'two honey' - honey is uncountable, need 'two jars of honey'",
        "Option D has 'apple' (singular) with 'three' and 'many honey' (wrong, use 'much')"
      ],
      commonMistakes: [
        "Not pluralizing countable nouns after numbers greater than one",
        "Trying to count uncountable nouns directly without measuring words"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Identify the type of noun:\n\n'happiness'",
    options: [
      "Abstract noun (uncountable)",
      "Concrete noun (countable)",
      "Proper noun",
      "Collective noun"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Happiness' is an abstract noun - it names a feeling/emotion you can't touch or see. Abstract nouns are usually uncountable. We say 'much happiness' (not 'many happinesses'). Concrete nouns name physical things you can touch (book, table).",
      formula: "Abstract = Feelings/ideas (happiness, love, courage) | Concrete = Physical things (book, chair, apple)",
      trapAlerts: [
        "Not concrete - you can't physically touch or see happiness",
        "Not proper - it's not a specific name of a person/place/thing",
        "Not collective - it doesn't name a group (collective: team, family, crowd)"
      ],
      commonMistakes: [
        "Not recognizing feelings and ideas as abstract nouns",
        "Trying to make abstract nouns countable (saying 'two happinesses')"
      ]
    },
    difficulty: "hard",
    level: "A1"
  }
];

async function insertQuestions() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('\n🎓 Inserting Nouns Questions (Batch 2/2)');
    console.log('='.repeat(80));
    console.log(`\n📋 Topic: nouns-detailed (A1 level)`);
    console.log(`   Questions in this batch: ${NOUNS_QUESTIONS_BATCH2.length}`);
    console.log(`   Subtopics covered: Countable vs Uncountable (15), Mixed Practice (15)\n`);

    let inserted = 0;
    for (const q of NOUNS_QUESTIONS_BATCH2) {
      await pool.query(
        `INSERT INTO english_questions
         (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
        [
          'foundation',
          'nouns-detailed',
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
        console.log(`   ✓ Inserted ${inserted}/${NOUNS_QUESTIONS_BATCH2.length}...`);
      }
    }

    console.log(`\n✅ Successfully inserted ${inserted} questions!`);
    console.log(`\n📊 COMPLETE: 60/60 questions for nouns-detailed topic`);
    console.log(`   ✅ Common vs Proper Nouns: 15 questions`);
    console.log(`   ✅ Singular vs Plural: 15 questions`);
    console.log(`   ✅ Countable vs Uncountable: 15 questions`);
    console.log(`   ✅ Mixed Practice: 15 questions`);

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

insertQuestions();
