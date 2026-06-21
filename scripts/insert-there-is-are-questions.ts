import { Pool } from 'pg';
import { config } from 'dotenv';

config({ path: '.env.local' });

/**
 * There Is/Are Questions - Complete
 * Topic: there-is-are (A1 level)
 * Subtopics: There is/are basics (15), Negative forms (10), Questions (10), Common errors (5)
 */

const THERE_IS_ARE_QUESTIONS = [
  // SUBTOPIC 1: There is/are basics - 15 questions
  {
    question: "When do we use 'there is' and 'there are'?",
    options: [
      "To say something exists or is in a place",
      "To talk about possession only",
      "To describe people's appearance",
      "To give directions only"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'There is/are' introduces the existence or location of something: 'There is a book on the table' (a book exists on the table), 'There are many students in the class' (students exist/are present). Shows existence, presence, or location.",
      formula: "There is + singular (There is a book) | There are + plural (There are books)",
      trapAlerts: [
        "Possession uses 'have/has' (I have a book), not 'there is'",
        "Appearance uses 'looks' or 'be' (She is tall), not 'there is'",
        "Directions use imperatives or location words, though 'there is' can be part of it"
      ],
      commonMistakes: [
        "Confusing 'there is' with 'it is' (different uses)",
        "Using 'there is' for possession instead of 'have/has'"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Choose the correct form:\n\n'___ a school near my house.'",
    options: ["There is", "There are", "It is", "They are"],
    correctAnswer: 0,
    explanation: {
      logic: "'A school' is SINGULAR, so use 'there is'. 'There is' introduces the existence of one thing. The subject 'a school' comes after 'there is'.",
      formula: "There is + a/an + singular noun (There is a school, There is an apple)",
      trapAlerts: [
        "'There are' is for plural - wrong for singular 'a school'",
        "'It is' identifies or describes something specific, not introducing existence",
        "'They are' is for plural subjects, and wrong structure here"
      ],
      commonMistakes: [
        "Using 'there are' with singular nouns",
        "Confusing 'there is' with 'it is'"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Choose the correct form:\n\n'___ three books on the table.'",
    options: ["There are", "There is", "It is", "They is"],
    correctAnswer: 0,
    explanation: {
      logic: "'Three books' is PLURAL, so use 'there are'. 'There are' introduces multiple things. The plural subject 'three books' comes after 'there are'.",
      formula: "There are + plural noun (There are three books, There are many students)",
      trapAlerts: [
        "'There is' is for singular - wrong for plural 'three books'",
        "'It is' doesn't work for introducing plural existence",
        "'They is' is grammatically wrong - should be 'they are', but wrong structure anyway"
      ],
      commonMistakes: [
        "Using 'there is' with plural nouns (very common error)",
        "Not checking if the noun after is singular or plural"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "What comes after 'there is' or 'there are'?",
    options: [
      "The subject (noun/noun phrase)",
      "The verb",
      "The object",
      "An adjective only"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "After 'there is/are', the SUBJECT comes: 'There is a book' (subject: a book), 'There are students' (subject: students). This is inverted word order - subject after verb instead of before.",
      formula: "There + is/are + subject (+ place/time)",
      trapAlerts: [
        "The verb is 'is/are' - it's already there, doesn't come after",
        "Objects come later if there's additional info, not immediately after",
        "Adjectives describe the noun, but the noun (subject) comes first"
      ],
      commonMistakes: [
        "Not recognizing inverted word order (subject after verb)",
        "Confusing subject with object in this structure"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Find the error:\n\n'There are a pen on the desk.'",
    options: [
      "'are' should be 'is' (singular noun)",
      "'a pen' should be 'pens'",
      "'on' should be 'in'",
      "No error"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'A pen' is SINGULAR, so use 'there is', not 'there are'. Rule: Check the noun after 'there is/are' - singular = is, plural = are. Correct: 'There is a pen on the desk'.",
      formula: "There is + a/an + singular | There are + plural (no a/an)",
      trapAlerts: [
        "'a pen' is correctly singular - doesn't need to be plural",
        "'on the desk' is correct preposition for surface location",
        "The sentence has an error - wrong verb form"
      ],
      commonMistakes: [
        "Not matching is/are with the noun that follows (very common error)",
        "Looking at nearby words instead of the actual subject"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Which sentence is correct?",
    options: [
      "There are many students in the class.",
      "There is many students in the class.",
      "There are a student in the class.",
      "There is much students in the class."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Many students' is PLURAL, use 'there are'. 'Many' is always with plural countable nouns. Correct match: are + plural.",
      formula: "There are + many/some/a few + plural (There are many students)",
      trapAlerts: [
        "'there is many students' has is + plural - wrong agreement",
        "'there are a student' has are + singular - wrong agreement",
        "'there is much students' uses 'much' (uncountable) with countable noun - wrong"
      ],
      commonMistakes: [
        "Using 'there is' with 'many + plural noun'",
        "Confusing 'many' (countable) with 'much' (uncountable)"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Complete correctly:\n\n'___ some milk in the fridge.'",
    options: ["There is", "There are", "It is", "They are"],
    correctAnswer: 0,
    explanation: {
      logic: "'Milk' is UNCOUNTABLE (singular treatment), use 'there is'. Uncountable nouns always take singular verbs: is, not are. Even with 'some', use 'is' for uncountable.",
      formula: "There is + uncountable noun (There is milk, water, rice, information)",
      trapAlerts: [
        "'There are' is for countable plurals - milk is uncountable",
        "'It is' doesn't introduce existence of something",
        "'They are' is for plural countables, not uncountable nouns"
      ],
      commonMistakes: [
        "Using 'there are' with uncountable nouns",
        "Thinking 'some' always means plural"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "What is the word order in 'there is/are' sentences?",
    options: [
      "There + is/are + subject + (place/time)",
      "Subject + there is/are + place",
      "There is/are + verb + subject",
      "Place + there is/are + subject"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Standard order: There + is/are + subject + optional place/time. Example: 'There is a book (subject) on the table (place)'. The structure is fixed: there + verb + subject.",
      formula: "There + is/are + subject + place/time (There is a book on the table)",
      trapAlerts: [
        "Subject doesn't come before 'there is/are' in this structure",
        "Another verb doesn't come after 'there is/are' - is/are IS the verb",
        "Place can come at the start for emphasis but not in standard order"
      ],
      commonMistakes: [
        "Trying to use normal subject-verb order with 'there is/are'",
        "Not learning the fixed structure"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Choose the correct form:\n\n'___ a lot of people at the party.'",
    options: ["There were", "There was", "It were", "They was"],
    correctAnswer: 0,
    explanation: {
      logic: "'A lot of people' is PLURAL (past tense), use 'there were'. 'A lot of' with countable plural takes 'are/were'. Past tense: were, not was.",
      formula: "There were + plural (There were people, There were books)",
      trapAlerts: [
        "'There was' is for singular past - wrong for 'people'",
        "'It were' is grammatically wrong - should be 'it was', but wrong structure",
        "'They was' is grammatically wrong - should be 'they were', but wrong structure"
      ],
      commonMistakes: [
        "Using 'was' with plural subjects",
        "Not recognizing 'a lot of + countable' = plural"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "What's the difference between 'there is' and 'it is'?",
    options: [
      "'There is' introduces existence, 'it is' identifies/describes something specific",
      "They mean exactly the same",
      "'It is' introduces existence, 'there is' describes",
      "'There is' is always wrong"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'There is' = introduces existence/presence: 'There is a problem' (a problem exists). 'It is' = identifies or describes something already mentioned: 'It is difficult' (the problem is difficult). Different functions.",
      formula: "There is = existence/introduction | It is = identification/description of known thing",
      trapAlerts: [
        "They have different uses - not interchangeable",
        "'It is' describes/identifies, doesn't introduce new existence",
        "'There is' is correct for introducing existence"
      ],
      commonMistakes: [
        "Using 'it is' when introducing something new (should be 'there is')",
        "Not understanding the functional difference"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Complete with the correct form:\n\n'___ no students in the classroom.'",
    options: ["There are", "There is", "It is", "They are"],
    correctAnswer: 0,
    explanation: {
      logic: "'No students' is PLURAL (zero students = plural), use 'there are'. 'No + plural noun' takes plural verb. Even though meaning is zero, grammar treats plural noun as plural.",
      formula: "There are + no + plural (There are no students, books, problems)",
      trapAlerts: [
        "'There is' is for singular - 'students' is plural",
        "'It is' doesn't work for introducing existence",
        "'They are' is wrong structure for this sentence"
      ],
      commonMistakes: [
        "Using 'there is' with 'no + plural noun' thinking zero = singular",
        "Not following noun number agreement"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Which is correct?",
    options: [
      "There is a park near my house.",
      "There are a park near my house.",
      "It is a park near my house.",
      "They is a park near my house."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'A park' is SINGULAR, use 'there is'. Introduces the existence/location of one park. Correct singular agreement.",
      formula: "There is + a/an + singular noun (There is a park, a school, a hospital)",
      trapAlerts: [
        "'There are' with singular 'a park' - wrong agreement",
        "'It is' doesn't introduce location/existence properly here",
        "'They is' is grammatically impossible - wrong form"
      ],
      commonMistakes: [
        "Using 'there are' with singular nouns",
        "Using 'it is' for introducing locations"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Choose the correct form:\n\n'___ only one answer to this question.'",
    options: ["There is", "There are", "It is", "They are"],
    correctAnswer: 0,
    explanation: {
      logic: "'One answer' is SINGULAR, use 'there is'. Even with numbers, 'one' takes singular. Introduces the existence of a single answer.",
      formula: "There is + one + singular (There is one book, one student, one problem)",
      trapAlerts: [
        "'There are' is for plural (two, three, many) - wrong for 'one'",
        "'It is' identifies/describes but doesn't introduce existence well here",
        "'They are' is plural form, wrong for 'one answer'"
      ],
      commonMistakes: [
        "Confusing number words - 'one' is singular, 'two+' is plural",
        "Using 'there are' with 'one + noun'"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "What does 'there' mean in 'there is/are'?",
    options: [
      "It's a dummy subject - no specific meaning",
      "It means 'that place over there'",
      "It means 'always'",
      "It means 'here'"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'There' in 'there is/are' is a DUMMY SUBJECT - grammatical placeholder with no real meaning. It's not about place. Just a structure word to introduce existence. Compare: 'There is a book here' - 'there' = dummy, 'here' = place.",
      formula: "'There' = grammatical placeholder (no location meaning in this structure)",
      trapAlerts: [
        "'There' as place ('over there') is different from dummy 'there' in 'there is'",
        "Doesn't mean frequency (always) - that's unrelated",
        "Doesn't mean 'here' - place is shown by other words (here, in the room, etc.)"
      ],
      commonMistakes: [
        "Thinking 'there' in 'there is' refers to a place",
        "Not understanding dummy subjects in English"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Find the correct sentence:",
    options: [
      "There are two cinemas in my city.",
      "There is two cinemas in my city.",
      "There are a cinema in my city.",
      "It are two cinemas in my city."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Two cinemas' is PLURAL, use 'there are'. Number 'two' (or any number >1) + plural noun = plural verb.",
      formula: "There are + number (2+) + plural (There are two cinemas, three books)",
      trapAlerts: [
        "'There is' with plural 'two cinemas' - wrong agreement",
        "'There are a cinema' has plural verb + singular noun - wrong",
        "'It are' is impossible form - wrong grammar"
      ],
      commonMistakes: [
        "Using 'there is' with numbers greater than one",
        "Not matching verb with noun number"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },

  // SUBTOPIC 2: Negative forms - 10 questions
  {
    question: "How do we make 'there is/are' negative?",
    options: [
      "Add 'not' after is/are (There is not, There are not)",
      "Add 'not' before there (Not there is)",
      "Use 'no' instead of 'a/an' (There is no)",
      "Both A and C are correct"
    ],
    correctAnswer: 3,
    explanation: {
      logic: "Two ways to make negative: (1) There is/are + not: 'There is not a book' (full negative), (2) There is/are + no: 'There is no book' (no + noun). Both correct. Option C uses 'no' which is also correct.",
      formula: "There is not + a/an + noun | There is no + noun (both correct)",
      trapAlerts: [
        "'Not there is' puts 'not' in wrong position - doesn't work",
        "Using 'no' (There is no book) IS correct, not wrong",
        "Both adding 'not' and using 'no' are valid negative forms"
      ],
      commonMistakes: [
        "Putting 'not' before 'there' instead of after is/are",
        "Not knowing both 'not' and 'no' work for negatives"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Choose the correct negative form:",
    options: [
      "There isn't a pen on the desk.",
      "There not is a pen on the desk.",
      "Not there is a pen on the desk.",
      "There no is a pen on the desk."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Correct negative: is + not = isn't (or is not). 'There isn't a pen' = There is not a pen. Contraction is natural in speech.",
      formula: "There isn't/is not + a/an + singular | There aren't/are not + plural",
      trapAlerts: [
        "'not is' reverses the order - grammatically wrong",
        "'Not there is' puts 'not' at the start - wrong structure",
        "'no is' doesn't work - should be 'is no' if using 'no'"
      ],
      commonMistakes: [
        "Putting 'not' in wrong position",
        "Not learning isn't/aren't contractions"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "What's the difference between these negatives?\n\n'There isn't a book.' vs 'There is no book.'",
    options: [
      "Same meaning, different form (both correct)",
      "'isn't a' is wrong, only 'no' works",
      "'is no' is wrong, only 'isn't' works",
      "Completely different meanings"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Both mean exactly the same: no book exists. 'There isn't a book' = 'There is no book'. Just different structures. 'No' is slightly more emphatic but meaning identical.",
      formula: "There isn't a = There is no (same meaning, different structure)",
      trapAlerts: [
        "'isn't a' is correct and natural",
        "'is no' is also correct and common",
        "The meanings are identical, not different"
      ],
      commonMistakes: [
        "Thinking only one form is correct",
        "Not knowing these are interchangeable"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Choose the correct negative:\n\n'___ any students in the library.'",
    options: [
      "There aren't",
      "There isn't",
      "There not are",
      "Not there are"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Any students' (plural) with negative, use 'aren't'. 'Any' with negatives = none. Plural subject + aren't.",
      formula: "There aren't + any + plural (There aren't any students, books, problems)",
      trapAlerts: [
        "'isn't' is singular - wrong for plural 'students'",
        "'not are' reverses word order - wrong",
        "'Not there are' puts 'not' at start - wrong structure"
      ],
      commonMistakes: [
        "Using 'isn't' with plural nouns",
        "Not matching negative form with noun number"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Find the error:\n\n'There are not milk in the fridge.'",
    options: [
      "'are' should be 'is' (milk is uncountable)",
      "'not' should come before 'there'",
      "'milk' should be 'milks'",
      "No error"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Milk' is UNCOUNTABLE (singular), use 'is', not 'are'. Correct: 'There is not milk' or 'There isn't milk' or 'There is no milk'.",
      formula: "There is not + uncountable (milk, water, rice) | There are not + countable plural",
      trapAlerts: [
        "'not' is in correct position (after verb)",
        "'milk' is uncountable - never 'milks'",
        "The sentence has an error - wrong verb"
      ],
      commonMistakes: [
        "Using 'are' with uncountable nouns",
        "Not distinguishing countable vs uncountable"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Which negative form is correct?",
    options: [
      "There are no people here.",
      "There is no people here.",
      "There not are people here.",
      "Not there are people here."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'People' is PLURAL (irregular plural of 'person'), use 'are'. 'There are no people' = no people exist here. Correct plural agreement with 'no'.",
      formula: "There are no + plural (people, students, books)",
      trapAlerts: [
        "'is no people' uses singular verb with plural noun - wrong",
        "'not are' reverses order - grammatically wrong",
        "'Not there are' puts 'not' at start - wrong structure"
      ],
      commonMistakes: [
        "Using 'is' with irregular plural 'people'",
        "Not recognizing 'people' as plural"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Complete the negative:\n\n'___ enough time to finish.'",
    options: [
      "There isn't",
      "There aren't",
      "It isn't",
      "They aren't"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Time' is UNCOUNTABLE (singular), use 'isn't'. 'There isn't enough time' = insufficient time exists. Uncountable noun + singular verb.",
      formula: "There isn't + uncountable (time, money, space, information)",
      trapAlerts: [
        "'aren't' is for plural countables - time is uncountable",
        "'It isn't' doesn't introduce existence properly",
        "'They aren't' is plural and wrong structure"
      ],
      commonMistakes: [
        "Using 'aren't' with uncountable nouns",
        "Not knowing which nouns are uncountable"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "What does 'There aren't any' mean?",
    options: [
      "There are zero, none exist",
      "There are many",
      "There are some",
      "There is one"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'There aren't any' = zero, none, not even one. 'Any' in negative context means zero. Example: 'There aren't any students' = no students, zero students.",
      formula: "There aren't any = There are no = zero (none exist)",
      trapAlerts: [
        "Negative 'any' means zero, not many",
        "Not 'some' - 'some' is positive/affirmative",
        "Not 'one' - means zero, none"
      ],
      commonMistakes: [
        "Confusing 'any' in negatives (zero) with 'any' in questions (some?)",
        "Not understanding negative 'any' = zero"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Choose the correct contraction:",
    options: [
      "There's no problem. (There is no)",
      "There're no problem. (wrong)",
      "Theren't a problem. (not a word)",
      "Theres'nt a problem. (wrong)"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'There's' = There is (common contraction). 'There's no problem' is natural and correct. Other options are not standard English contractions.",
      formula: "There's = There is | There're = There are (less common)",
      trapAlerts: [
        "'There're no problem' has wrong agreement (are + singular) even if contraction existed",
        "'Theren't' is not a real word",
        "'Theres'nt' is not proper English"
      ],
      commonMistakes: [
        "Making up non-existent contractions",
        "Not learning standard contractions (there's, there're, there isn't, there aren't)"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Find the correct sentence:",
    options: [
      "There wasn't any noise.",
      "There weren't any noise.",
      "There no was noise.",
      "Not there was noise."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Noise' is UNCOUNTABLE (singular), use 'wasn't' (past singular). 'There wasn't any noise' = no noise existed. Past tense negative with uncountable.",
      formula: "There wasn't + any + uncountable (noise, water, time)",
      trapAlerts: [
        "'weren't' is plural past - noise is uncountable singular",
        "'no was' reverses order - wrong structure",
        "'Not there was' puts 'not' wrong place - incorrect"
      ],
      commonMistakes: [
        "Using 'weren't' with uncountable nouns",
        "Not learning past tense negative forms"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },

  // SUBTOPIC 3: Questions - 10 questions
  {
    question: "How do we form questions with 'there is/are'?",
    options: [
      "Invert: Is there...? / Are there...?",
      "Add 'do': Do there is...?",
      "Keep order: There is...?",
      "Use 'have': Have there...?"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Questions: Invert 'there' and 'is/are' → 'Is there...?' 'Are there...?'. Example: Statement: 'There is a book' → Question: 'Is there a book?'. Simple inversion, no 'do/does'.",
      formula: "Is there + singular? | Are there + plural? (invert there and verb)",
      trapAlerts: [
        "'Do there is' adds unnecessary 'do' - wrong with 'be' verbs",
        "Keeping statement order with only '?' doesn't make proper question",
        "'Have' is for possession, not for 'there is/are' questions"
      ],
      commonMistakes: [
        "Adding 'do/does' to 'be' verb questions",
        "Not inverting the order for questions"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Choose the correct question:",
    options: [
      "Is there a bank near here?",
      "There is a bank near here?",
      "Do there is a bank near here?",
      "Does there a bank near here?"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Correct question form: 'Is there' (inverted). 'Is there a bank?' = Does a bank exist? Singular question with proper inversion.",
      formula: "Is there + a/an + singular + place? (Is there a bank near here?)",
      trapAlerts: [
        "Statement order + '?' is informal speech only, not proper written form",
        "'Do there is' adds wrong auxiliary - 'be' doesn't use 'do'",
        "'Does there' is also wrong - 'be' never uses 'do/does'"
      ],
      commonMistakes: [
        "Using 'do/does' with 'be' verbs in questions",
        "Not inverting for question form"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Choose the correct question:\n\n'___ any students in the classroom?'",
    options: [
      "Are there",
      "Is there",
      "Do there",
      "Does there"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Any students' is PLURAL in question context, use 'Are there'. 'Any' in questions = some (asking about existence of some). Plural question form.",
      formula: "Are there + any + plural? (Are there any students, books, problems?)",
      trapAlerts: [
        "'Is there' is singular - wrong for plural 'students'",
        "'Do there' adds wrong auxiliary - not used with 'be'",
        "'Does there' also wrong - 'be' doesn't use 'do/does'"
      ],
      commonMistakes: [
        "Using 'is there' with plural nouns",
        "Adding 'do/does' to 'be' verb questions"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "What's the short answer to: 'Is there a pen on the desk?'",
    options: [
      "Yes, there is. / No, there isn't.",
      "Yes, it is. / No, it isn't.",
      "Yes, there are. / No, there aren't.",
      "Yes, I am. / No, I'm not."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Short answers repeat the subject and verb from question: 'Is there...?' → 'Yes, there is' or 'No, there isn't'. Match the form used in the question.",
      formula: "Is there? → Yes, there is. / No, there isn't. | Are there? → Yes, there are. / No, there aren't.",
      trapAlerts: [
        "'Yes, it is' uses wrong subject - should be 'there', not 'it'",
        "'Yes, there are' has plural verb - question was singular 'is there'",
        "'Yes, I am' is completely wrong subject"
      ],
      commonMistakes: [
        "Using 'it is' instead of 'there is' in short answers",
        "Not matching singular/plural with the question"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Find the error:\n\n'Are there a book on the table?'",
    options: [
      "'Are' should be 'Is' (singular noun)",
      "'a book' should be 'books'",
      "'on' should be 'in'",
      "No error"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'A book' is SINGULAR, use 'Is there', not 'Are there'. Must match singular/plural. Correct: 'Is there a book on the table?'",
      formula: "Is there + a/an + singular? | Are there + plural?",
      trapAlerts: [
        "'a book' is correctly singular - doesn't need to change",
        "'on the table' is correct preposition for surface",
        "The sentence has an error - wrong verb form"
      ],
      commonMistakes: [
        "Not matching question verb (is/are) with noun number",
        "Not checking if noun after is singular or plural"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "How do we ask about quantity with 'there is/are'?",
    options: [
      "How many/much + are/is there?",
      "What + there is/are?",
      "Which + there is/are?",
      "Where + there is/are?"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Quantity questions: 'How many' (countable) + are there?, 'How much' (uncountable) + is there? Example: 'How many students are there?' 'How much water is there?'",
      formula: "How many + plural + are there? | How much + uncountable + is there?",
      trapAlerts: [
        "'What there is/are' asks about identity, not quantity",
        "'Which there is/are' is unnatural structure for existence questions",
        "'Where there is/are' asks about location, not quantity"
      ],
      commonMistakes: [
        "Using 'What' instead of 'How many/much' for quantity",
        "Not distinguishing between countable (many) and uncountable (much)"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Choose the correct question:",
    options: [
      "How many books are there on the shelf?",
      "How much books are there on the shelf?",
      "How many books is there on the shelf?",
      "How many book are there on the shelf?"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Books' is countable plural, use 'How many' + 'are there'. Correct match: countable + plural verb. Asking about quantity of countable items.",
      formula: "How many + countable plural + are there? (books, students, pens)",
      trapAlerts: [
        "'How much' is for uncountable - books are countable",
        "'is there' is singular - wrong for plural 'books'",
        "'book' (singular) doesn't match with 'how many' (plural question)"
      ],
      commonMistakes: [
        "Using 'how much' with countable nouns",
        "Not making noun plural after 'how many'"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "What's the short answer to: 'Are there any apples?'",
    options: [
      "Yes, there are. / No, there aren't.",
      "Yes, they are. / No, they aren't.",
      "Yes, there is. / No, there isn't.",
      "Yes, these are. / No, these aren't."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Match the question form: 'Are there...?' → 'Yes, there are' / 'No, there aren't'. Use same subject ('there') and same verb form ('are') in answer.",
      formula: "Are there? → Yes, there are. / No, there aren't.",
      trapAlerts: [
        "'they are' uses wrong subject - should be 'there'",
        "'there is' uses singular - question was plural 'are there'",
        "'these are' uses demonstrative - wrong for 'there' questions"
      ],
      commonMistakes: [
        "Using 'they are' instead of 'there are' in short answers",
        "Not matching singular/plural with the question"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Choose the correct question:",
    options: [
      "Is there any milk in the fridge?",
      "Are there any milk in the fridge?",
      "Is there any milks in the fridge?",
      "Do there any milk in the fridge?"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Milk' is UNCOUNTABLE (singular), use 'Is there'. 'Any' works with both countable and uncountable in questions. Uncountable + singular verb.",
      formula: "Is there + any + uncountable? (milk, water, rice, information)",
      trapAlerts: [
        "'Are there' is plural - milk is uncountable singular",
        "'milks' doesn't exist - milk is uncountable (no plural form)",
        "'Do there' adds wrong auxiliary - not used with 'be'"
      ],
      commonMistakes: [
        "Using 'are there' with uncountable nouns",
        "Trying to make uncountable nouns plural"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Find the correct question form:",
    options: [
      "Were there many people at the party?",
      "Was there many people at the party?",
      "Did there many people at the party?",
      "Do there many people at the party?"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Many people' is PLURAL (past tense), use 'Were there'. Past plural question form. 'Many' always with plural countable.",
      formula: "Were there + plural? (past) | Was there + singular? (past)",
      trapAlerts: [
        "'Was there' is past singular - wrong for plural 'people'",
        "'Did there' adds wrong auxiliary - 'be' doesn't use 'do/did'",
        "'Do there' is present and wrong auxiliary"
      ],
      commonMistakes: [
        "Using 'was' with plural subjects",
        "Adding 'do/did' to 'be' verb questions"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },

  // SUBTOPIC 4: Common errors - 5 questions
  {
    question: "Find the error:\n\n'There have many students in the class.'",
    options: [
      "'have' should be 'are'",
      "'many' should be 'much'",
      "'students' should be 'student'",
      "No error"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'There is/are' for existence, not 'there have'. 'Have' is for possession. Correct: 'There are many students'. Common error for Hindi speakers (confusion with Hindi 'hain').",
      formula: "There is/are (existence) | Subject + have/has (possession)",
      trapAlerts: [
        "'many' is correct for countable plural 'students'",
        "'students' is correctly plural with 'many'",
        "The sentence has an error - wrong verb"
      ],
      commonMistakes: [
        "Using 'there have' instead of 'there are' (Hindi L1 transfer)",
        "Confusing existence (there is/are) with possession (have/has)"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "What's wrong with: 'There is two dogs'?",
    options: [
      "'is' should be 'are' (plural noun)",
      "'two' should be 'one'",
      "'dogs' should be 'dog'",
      "Nothing wrong"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Two dogs' is PLURAL, must use 'are', not 'is'. Very common error: not matching verb with noun number. Correct: 'There are two dogs'.",
      formula: "Number (2+) + plural noun = are (There are two dogs, three books)",
      trapAlerts: [
        "'two' is correct - that's the intended quantity",
        "'dogs' is correctly plural for number 'two'",
        "The error is verb form, not nouns/numbers"
      ],
      commonMistakes: [
        "Using 'is' with plural nouns (extremely common error)",
        "Not checking agreement between verb and noun"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Find the error:\n\n'In my city there are many parks.'",
    options: [
      "No error - this is correct",
      "'are' should be 'is'",
      "'In my city' shouldn't start the sentence",
      "'parks' should be 'park'"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "This sentence is CORRECT. Place phrase ('In my city') can come first for emphasis, then 'there are' + plural. Valid word order variation: Place + there is/are + subject.",
      formula: "Place + there is/are + subject (In my city there are parks) = OK",
      trapAlerts: [
        "'are' is correct for plural 'parks'",
        "Place can start sentence for emphasis - acceptable structure",
        "'parks' is correctly plural"
      ],
      commonMistakes: [
        "Thinking place can never come first in 'there is/are' sentences",
        "Looking for errors when sentence is correct"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "What's wrong with: 'There is a lot of cars'?",
    options: [
      "'is' should be 'are' ('a lot of' + countable = plural)",
      "'a lot of' should be 'many'",
      "'cars' should be 'car'",
      "Nothing wrong"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'A lot of' + countable plural takes plural verb. 'Cars' is countable plural, use 'are'. Correct: 'There are a lot of cars'. 'A lot of' works with both countable (plural verb) and uncountable (singular verb).",
      formula: "There are + a lot of + countable plural | There is + a lot of + uncountable",
      trapAlerts: [
        "'a lot of' is fine - doesn't need to be 'many' (both work)",
        "'cars' is correctly plural",
        "The error is verb form"
      ],
      commonMistakes: [
        "Using 'is' with 'a lot of + countable plural'",
        "Not recognizing 'a lot of' can be plural or singular depending on noun"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Find the error:\n\n'Is there books on the table?'",
    options: [
      "'Is' should be 'Are' (plural noun)",
      "'books' should be 'book'",
      "'on' should be 'in'",
      "No error"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Books' is PLURAL, must use 'Are there', not 'Is there'. Match question verb with noun number. Correct: 'Are there books on the table?'",
      formula: "Is there + singular? | Are there + plural?",
      trapAlerts: [
        "'books' is correctly plural - that's what we're asking about",
        "'on the table' is correct preposition for surface",
        "The error is verb form in question"
      ],
      commonMistakes: [
        "Using 'is there' with plural nouns in questions",
        "Not checking noun number when forming questions"
      ]
    },
    difficulty: "easy",
    level: "A1"
  }
];

async function insertQuestions() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('\n🎓 Inserting There Is/Are Questions (COMPLETE)');
    console.log('='.repeat(80));
    console.log(`\n📋 Topic: there-is-are (A1 level)`);
    console.log(`   Questions in this batch: ${THERE_IS_ARE_QUESTIONS.length}`);
    console.log(`   Subtopics: Basics (15), Negatives (10), Questions (10), Common Errors (5)\n`);

    let inserted = 0;
    for (const q of THERE_IS_ARE_QUESTIONS) {
      await pool.query(
        `INSERT INTO english_questions
         (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
        [
          'foundation',
          'there-is-are',
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
        console.log(`   ✓ Inserted ${inserted}/${THERE_IS_ARE_QUESTIONS.length}...`);
      }
    }

    console.log(`\n✅ Successfully inserted ${inserted} questions!`);
    console.log(`\n📊 Complete: there-is-are: 40/40 questions ✅`);

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

insertQuestions();
