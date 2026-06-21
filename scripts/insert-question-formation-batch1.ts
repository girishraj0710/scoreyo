import { Pool } from 'pg';
import { config } from 'dotenv';

config({ path: '.env.local' });

/**
 * Question Formation - Batch 1
 * Topic: question-formation (A1 level)
 * Subtopics: Yes/No Questions (15), Wh-Questions (15), Question Words (15)
 */

const QUESTION_FORMATION_BATCH1 = [
  // YES/NO QUESTIONS - 15 questions
  {
    question: "What are Yes/No questions?",
    options: [
      "Questions answered with 'yes' or 'no'",
      "Questions that always need long answers",
      "Questions that start with 'why'",
      "Questions about time only"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Yes/No questions can be answered with simply 'yes' or 'no'. Examples: 'Do you like pizza?' → 'Yes/No', 'Is she a teacher?' → 'Yes/No'. They ask for confirmation or denial, not detailed information.",
      formula: "Yes/No question → answer: Yes, I do / No, I don't (simple confirmation/denial)",
      trapAlerts: [
        "Long answers are possible but not required - yes/no is sufficient",
        "'Why' questions need explanations, not yes/no - those are Wh-questions",
        "Time questions often use 'when' - yes/no questions cover any topic"
      ],
      commonMistakes: [
        "Confusing yes/no questions with information questions (who, what, when, where, why, how)",
        "Giving long answers when simple yes/no would suffice"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "How do we form Yes/No questions with 'be' verbs?",
    options: [
      "Invert: Be verb + subject (Is she...?)",
      "Add 'do': Do she is...?",
      "Keep order: She is...?",
      "Add 'what': What she is...?"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "With 'be' verbs (am, is, are, was, were), simply invert verb and subject. Statement: 'She is happy' → Question: 'Is she happy?' No 'do/does' needed with 'be'.",
      formula: "Statement: Subject + be + complement → Question: Be + subject + complement?",
      trapAlerts: [
        "'Do she is' adds unnecessary 'do' - be verbs don't use 'do/does' in questions",
        "Statement order + '?' is informal only - proper questions need inversion",
        "'What' changes it to information question, not yes/no"
      ],
      commonMistakes: [
        "Adding 'do/does' to 'be' verb questions (very common error)",
        "Not inverting subject and verb for questions"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Form a Yes/No question:\n\nStatement: 'You like coffee.'",
    options: [
      "Do you like coffee?",
      "You like coffee?",
      "Like you coffee?",
      "You do like coffee?"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Present simple (like) needs 'do/does' for questions. 'You like' → 'Do you like?' Add 'do' before subject, use base verb form.",
      formula: "Present simple: Do/Does + subject + base verb? (Do you like, Does she like)",
      trapAlerts: [
        "Statement order + '?' is too informal for proper questions",
        "'Like you' inverts incorrectly - need 'do' + subject + base verb",
        "'You do like' is statement word order, not question"
      ],
      commonMistakes: [
        "Not adding 'do/does' to present simple questions",
        "Inverting verb-subject without 'do/does'"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Choose the correct Yes/No question:",
    options: [
      "Can you speak English?",
      "You can speak English?",
      "Can speak you English?",
      "Do you can speak English?"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Modal verbs (can, will, should, etc.) invert directly with subject - no 'do/does'. Statement: 'You can speak' → Question: 'Can you speak?' Simple inversion.",
      formula: "Modal + subject + base verb? (Can you, Will she, Should I)",
      trapAlerts: [
        "Statement order + '?' is informal - proper questions need inversion",
        "'Can speak you' has wrong word order after modal",
        "'Do you can' adds unnecessary 'do' - modals don't use 'do/does'"
      ],
      commonMistakes: [
        "Adding 'do/does' to modal verb questions",
        "Wrong word order after modal verbs"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Find the error:\n\n'Does he is a student?'",
    options: [
      "Remove 'does' - be verbs don't use 'do/does' (Is he a student?)",
      "Change 'is' to 'are'",
      "Remove 'he'",
      "No error"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "BE VERBS never use 'do/does' in questions. Invert directly: 'he is' → 'Is he?' Correct question: 'Is he a student?' This is a very common error - mixing be verb rules with other verb rules.",
      formula: "Be verb question: Is/Are/Was/Were + subject? | NO 'do/does' ever",
      trapAlerts: [
        "'is' is correct for singular 'he' - doesn't need 'are'",
        "'he' is the correct subject pronoun",
        "The sentence has an error - wrong auxiliary"
      ],
      commonMistakes: [
        "Adding 'do/does' to be verb questions (extremely common for Indian learners)",
        "Not learning that be verbs have different question rules"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Form the question:\n\nStatement: 'She has a car.'",
    options: [
      "Does she have a car?",
      "Has she a car?",
      "She has a car?",
      "Do she has a car?"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Has' (possession) uses 'does' for questions in modern English, with base form 'have'. 'She has' → 'Does she have?' British: 'Has she' is old-fashioned but still acceptable.",
      formula: "Does + subject + have? (modern standard) | Has + subject? (British, formal)",
      trapAlerts: [
        "'Has she' is British/formal - American standard is 'Does she have'",
        "Statement order + '?' is too informal",
        "'Do she has' has wrong auxiliary (do→does with 'she') and doesn't change verb to base form"
      ],
      commonMistakes: [
        "Not changing 'has' to 'have' after 'does'",
        "Using 'do' instead of 'does' with third person singular"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "What's the short answer to: 'Are you a student?'",
    options: [
      "Yes, I am. / No, I'm not.",
      "Yes, you are. / No, you aren't.",
      "Yes, I'm. / No, I not.",
      "Yes. / No."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Short answers use: Yes/No + subject pronoun + auxiliary verb. Question has 'you', answer switches to 'I'. Match the auxiliary: 'Are you?' → 'Yes, I am'.",
      formula: "Are you? → Yes, I am / No, I'm not | Is he? → Yes, he is / No, he isn't",
      trapAlerts: [
        "'Yes, you are' doesn't switch pronoun - answer should use 'I' for yourself",
        "'Yes, I'm' in short answer is incomplete - need full form 'I am'",
        "Just 'Yes/No' is too brief for formal short answers"
      ],
      commonMistakes: [
        "Not switching 'you' to 'I' in answers about yourself",
        "Using contractions in affirmative short answers (I'm, he's - should be full forms)"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Choose correct question formation:",
    options: [
      "Did you go to school yesterday?",
      "Do you went to school yesterday?",
      "Did you went to school yesterday?",
      "You did go to school yesterday?"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Past simple questions use 'did' + base verb form. 'You went' → 'Did you go?' The verb changes from past (went) to base form (go) when 'did' is added.",
      formula: "Did + subject + base verb? (Did you go, Did she eat, Did they come)",
      trapAlerts: [
        "'Do you went' mixes present auxiliary with past verb - wrong tense",
        "'Did you went' keeps past verb after 'did' - should be base form",
        "Statement order + '?' is informal - need proper inversion"
      ],
      commonMistakes: [
        "Using past verb form after 'did' (saying 'did you went' instead of 'did you go')",
        "Using 'do/does' with past time expressions instead of 'did'"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Find the correct Yes/No question:",
    options: [
      "Will you come to the party?",
      "You will come to the party?",
      "Will come you to the party?",
      "Do you will come to the party?"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Future 'will' is a modal - invert directly with subject. 'You will come' → 'Will you come?' No 'do/does' with modals.",
      formula: "Will + subject + base verb? (Will you come, Will she help)",
      trapAlerts: [
        "Statement order + '?' is informal - need proper inversion",
        "'Will come you' has wrong word order - subject must follow modal",
        "'Do you will' adds unnecessary 'do' - modals don't use it"
      ],
      commonMistakes: [
        "Adding 'do/does' to modal verb questions",
        "Wrong subject position after modal"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "What's wrong with: 'He likes pizza?'",
    options: [
      "Missing 'Does' at start - needs: Does he like pizza?",
      "Should be 'like' not 'likes'",
      "Should be 'Do' not 'Does'",
      "Nothing wrong"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Statement order + rising intonation (?) is only for informal/surprised questions. Proper question needs inversion with 'does': 'Does he like pizza?' Add auxiliary, change verb to base form.",
      formula: "Informal: Statement + ? | Formal: Does + subject + base verb?",
      trapAlerts: [
        "'like' without 'does' is incomplete - need auxiliary for question",
        "'Do' is wrong - third person singular 'he' needs 'does'",
        "The informal form is used in speech but formal writing needs 'does'"
      ],
      commonMistakes: [
        "Using statement order for questions in formal contexts",
        "Not adding 'do/does' to present simple questions"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Complete the question:\n\n'___ there any milk in the fridge?'",
    options: ["Is", "Are", "Do", "Does"],
    correctAnswer: 0,
    explanation: {
      logic: "'Milk' is uncountable (singular), use 'Is'. 'There is' questions invert to 'Is there'. Uncountable nouns always take singular verbs.",
      formula: "Is there + singular/uncountable? | Are there + plural?",
      trapAlerts: [
        "'Are' is for plural countables - milk is uncountable",
        "'Do' is not used with 'there is/are' - just invert the 'be' verb",
        "'Does' also not used with 'there is/are'"
      ],
      commonMistakes: [
        "Using 'are there' with uncountable nouns",
        "Adding 'do/does' to 'there is/are' questions"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Which is correct?",
    options: [
      "Have you finished your homework?",
      "Do you have finished your homework?",
      "You have finished your homework?",
      "Did you have finished your homework?"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Present perfect questions invert 'have/has' with subject. 'You have finished' → 'Have you finished?' No 'do/does' with auxiliary 'have'.",
      formula: "Have/Has + subject + past participle? (Have you finished, Has she gone)",
      trapAlerts: [
        "'Do you have finished' adds wrong auxiliary - 'have' IS the auxiliary",
        "Statement order + '?' is informal - need proper inversion",
        "'Did you have finished' is double past - wrong tense structure"
      ],
      commonMistakes: [
        "Adding 'do/does' to present perfect questions",
        "Confusing present perfect (have finished) with simple past (finished)"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Form a tag question:\n\n'She is coming, ___?'",
    options: [
      "isn't she",
      "is she",
      "doesn't she",
      "does she"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Tag questions reverse polarity: positive statement → negative tag. 'She is' (positive) → 'isn't she?' (negative). Use same auxiliary as statement.",
      formula: "Positive statement + negative tag? (She is coming, isn't she?)",
      trapAlerts: [
        "'is she' is positive like statement - should reverse to negative",
        "'doesn't she' uses wrong auxiliary - statement has 'is', not 'do'",
        "'does she' also wrong auxiliary and wrong polarity"
      ],
      commonMistakes: [
        "Not reversing positive to negative in tag questions",
        "Using wrong auxiliary in tag (doesn't match statement verb)"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "What's the short answer to: 'Does she play tennis?'",
    options: [
      "Yes, she does. / No, she doesn't.",
      "Yes, she plays. / No, she not plays.",
      "Yes, she do. / No, she don't.",
      "Yes, she is. / No, she isn't."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Short answers match the auxiliary in the question. Question: 'Does she...?' → Answer: 'Yes, she does' or 'No, she doesn't'. Use same auxiliary, not the main verb.",
      formula: "Does...? → Yes, [subject] does / No, [subject] doesn't",
      trapAlerts: [
        "'she plays' repeats main verb - short answers use auxiliary only",
        "'she do' has wrong form - third person needs 'does', not 'do'",
        "'she is' uses wrong auxiliary - question used 'does', not 'is'"
      ],
      commonMistakes: [
        "Repeating the main verb in short answers instead of auxiliary",
        "Not matching the auxiliary from the question"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Choose the correct question:",
    options: [
      "Was he at school yesterday?",
      "Did he was at school yesterday?",
      "Was he be at school yesterday?",
      "He was at school yesterday?"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Past 'be' (was/were) inverts directly - no 'did'. 'He was' → 'Was he?' Simple inversion, like all be verbs in questions.",
      formula: "Was/Were + subject? (Was he, Were they) | NO 'did' with 'be'",
      trapAlerts: [
        "'Did he was' adds 'did' to be verb - never do this",
        "'Was he be' is impossible structure - can't have two be verbs",
        "Statement order + '?' is informal - need proper inversion"
      ],
      commonMistakes: [
        "Adding 'did' to past be verb questions",
        "Not learning be verbs have unique question formation"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },

  // WH-QUESTIONS - 15 questions
  {
    question: "What are Wh-questions?",
    options: [
      "Questions that ask for information using who, what, when, where, why, how",
      "Questions answered with yes or no",
      "Questions about time only",
      "Questions that don't need answers"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Wh-questions ask for specific information, not yes/no. They start with: Who, What, When, Where, Why, How. Example: 'What is your name?' → detailed answer, not yes/no.",
      formula: "Wh-word + auxiliary + subject + verb? (What do you like? When did she arrive?)",
      trapAlerts: [
        "Yes/no questions need only confirmation - Wh-questions need detailed info",
        "Not just time - Wh-questions cover all types of information",
        "All questions need answers - Wh-questions need specific information answers"
      ],
      commonMistakes: [
        "Confusing Wh-questions (information) with yes/no questions",
        "Answering Wh-questions with just 'yes' or 'no'"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "What's the structure of a Wh-question?",
    options: [
      "Wh-word + auxiliary + subject + main verb?",
      "Wh-word + subject + verb?",
      "Subject + Wh-word + verb?",
      "Auxiliary + Wh-word + subject + verb?"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Standard structure: Wh-word first, then auxiliary, then subject, then main verb. Example: 'What do you want?' (What + do + you + want). Exception: when asking about subject, no auxiliary needed.",
      formula: "Wh + aux + subject + verb? (What do you eat? Where does she live?)",
      trapAlerts: [
        "Wh-word + subject + verb missing auxiliary in most cases",
        "Subject before Wh-word is wrong order",
        "Auxiliary before Wh-word is wrong - Wh-word always first"
      ],
      commonMistakes: [
        "Forgetting auxiliary in Wh-questions (saying 'What you want?' instead of 'What do you want?')",
        "Wrong word order in Wh-questions"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Choose the correct Wh-question:",
    options: [
      "Where do you live?",
      "Where you live?",
      "Where live you?",
      "You live where?"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Where' asks about place. Need auxiliary 'do' with present simple: 'Where do you live?' Structure: Wh-word + do + subject + base verb.",
      formula: "Where + do/does + subject + verb? (Where do you live? Where does she work?)",
      trapAlerts: [
        "'Where you live' missing auxiliary - informal/wrong",
        "'Where live you' wrong word order - subject must follow auxiliary",
        "'You live where' has Wh-word at end - only in informal/Echo questions"
      ],
      commonMistakes: [
        "Omitting 'do/does' in present simple Wh-questions",
        "Wrong word order after Wh-word"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Find the error:\n\n'What she is doing?'",
    options: [
      "'she is' should be 'is she' (invert auxiliary and subject)",
      "'doing' should be 'do'",
      "'What' should be 'Why'",
      "No error"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "After Wh-word, invert auxiliary and subject: 'What is she doing?' not 'What she is doing'. Structure: Wh + auxiliary + subject + verb-ing.",
      formula: "What + is/are + subject + verb-ing? (What is she doing? What are they eating?)",
      trapAlerts: [
        "'doing' is correct present continuous form",
        "'What' is correct question word for asking about activity",
        "The word order is wrong - need inversion after Wh-word"
      ],
      commonMistakes: [
        "Not inverting auxiliary and subject after Wh-word (very common for Indian learners)",
        "Using statement word order in questions"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Complete correctly:\n\n'___ did you go yesterday?'",
    options: ["Where", "What", "Who", "How"],
    correctAnswer: 0,
    explanation: {
      logic: "'Where' asks about place/location. 'Where did you go?' asks about the place you visited. Match question word to the type of answer expected.",
      formula: "Where = place (Where did you go? → I went to Mumbai)",
      trapAlerts: [
        "'What' asks about things/actions - 'What did you do?' is different question",
        "'Who' asks about people - wrong for asking about places",
        "'How' asks about manner/method - wrong for place"
      ],
      commonMistakes: [
        "Confusing which Wh-word to use for different information types",
        "Not learning what each Wh-word asks about"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Which question asks about a person?",
    options: [
      "Who is your teacher?",
      "What is your teacher?",
      "Where is your teacher?",
      "When is your teacher?"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Who' asks about people/identity. 'Who is your teacher?' asks for the person's name. 'What' would ask about job/profession, 'Where' = location, 'When' = time.",
      formula: "Who = person/identity (Who is she? → Name/identity)",
      trapAlerts: [
        "'What is your teacher' asks about profession, not the person's identity",
        "'Where' asks location of teacher, not their identity",
        "'When' asks time, not person - doesn't make sense here"
      ],
      commonMistakes: [
        "Using 'what' instead of 'who' for people",
        "Not distinguishing between 'who' (person) and 'what' (thing/profession)"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Form a question for this answer:\n\nAnswer: 'She is 25 years old.'\nQuestion: '___?'",
    options: [
      "How old is she?",
      "What old is she?",
      "How age is she?",
      "What age is she?"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Ask about age with 'How old'. 'How old is she?' → answer gives age. 'How + adjective' pattern for measurements: How old, How tall, How long, How far.",
      formula: "How old + be + subject? (How old is she? How old are you?)",
      trapAlerts: [
        "'What old' is not a standard question form in English",
        "'How age' doesn't work - should be 'How old' for age",
        "'What age' is less common - standard is 'How old'"
      ],
      commonMistakes: [
        "Using 'What' instead of 'How' for age questions",
        "Saying 'How age' instead of 'How old'"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Complete the question:\n\n'___ are you going to the market?'\n(asking about reason)",
    options: ["Why", "When", "Where", "How"],
    correctAnswer: 0,
    explanation: {
      logic: "'Why' asks about reason/purpose. 'Why are you going?' → answer explains the reason (to buy vegetables, because I need food, etc.).",
      formula: "Why = reason/purpose (Why are you...? → Because...)",
      trapAlerts: [
        "'When' asks about time - when you're going, not why",
        "'Where' asks about destination - but we already know (to market)",
        "'How' asks about method/manner - how you'll travel, not why"
      ],
      commonMistakes: [
        "Confusing 'why' (reason) with 'when' (time)",
        "Not understanding 'why' answers always explain reason/purpose"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Find the correct question:",
    options: [
      "When did you arrive?",
      "When you did arrive?",
      "When did arrive you?",
      "When you arrived?"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Past tense Wh-question: Wh-word + did + subject + base verb. 'When did you arrive?' asks about time of arrival in past.",
      formula: "Wh + did + subject + base verb? (When did you go? Where did she live?)",
      trapAlerts: [
        "'you did arrive' doesn't invert subject and auxiliary - wrong order",
        "'did arrive you' puts subject in wrong position",
        "'you arrived' missing auxiliary 'did' - too informal"
      ],
      commonMistakes: [
        "Not inverting subject and auxiliary after Wh-word",
        "Using past verb form (arrived) instead of base form (arrive) after 'did'"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Which asks about manner/method?",
    options: [
      "How did you come here?",
      "When did you come here?",
      "Where did you come here?",
      "Why did you come here?"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'How' asks about manner/method. 'How did you come?' → answer tells method (by bus, by car, walking, etc.). Explains the way/method of doing something.",
      formula: "How = manner/method (How did you...? → By bus, walking, etc.)",
      trapAlerts: [
        "'When' asks time of arrival, not method",
        "'Where' asks place - doesn't make sense with 'come here' (place is 'here')",
        "'Why' asks reason, not method"
      ],
      commonMistakes: [
        "Confusing 'how' (method) with other Wh-words",
        "Not understanding 'how' questions ask about the way something is done"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "What's special about 'Who' as subject?\n\nExample: 'Who called you?'",
    options: [
      "No auxiliary needed - 'Who' acts as subject",
      "Always needs 'did'",
      "Must invert with 'do'",
      "Can't be used as subject"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "When 'Who' is the subject (person doing the action), NO auxiliary needed. 'Who called you?' (not 'Who did call you?'). But 'Who did you call?' (Who as object) needs auxiliary.",
      formula: "Who (subject) + verb? (Who called?) | Who (object) + aux + subject + verb? (Who did you call?)",
      trapAlerts: [
        "Auxiliary 'did' is wrong when Who is subject",
        "Inversion with 'do' is wrong - Who as subject doesn't invert",
        "Who CAN be used as subject - very common actually"
      ],
      commonMistakes: [
        "Adding 'did/do/does' when Who is the subject",
        "Not recognizing the difference between Who as subject vs object"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Complete correctly:\n\n'___ book is this?' (asking about ownership)",
    options: ["Whose", "Who", "Which", "What"],
    correctAnswer: 0,
    explanation: {
      logic: "'Whose' asks about possession/ownership. 'Whose book?' = Who does this book belong to? Answer: It's Raj's book / It's mine.",
      formula: "Whose + noun? (Whose book, Whose pen, Whose car) → ownership answer",
      trapAlerts: [
        "'Who' asks about people but not possession - 'Whose' needed for ownership",
        "'Which' asks for selection between options, not ownership",
        "'What' asks about type/identity, not owner"
      ],
      commonMistakes: [
        "Using 'Who' instead of 'Whose' for possession",
        "Confusing 'Who's' (who is) with 'Whose' (possession)"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Find the error:\n\n'What time is it?'",
    options: [
      "No error - this is correct",
      "'What' should be 'When'",
      "'is it' should be 'it is'",
      "Need to add 'do'"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "This question is CORRECT. 'What time' asks for specific clock time. 'What time is it?' = What is the time? Standard way to ask for the time.",
      formula: "What time + be + it? (What time is it?) | What time + do/does + subject + verb? (What time do you wake up?)",
      trapAlerts: [
        "'What time' is correct - more specific than just 'When'",
        "'is it' is correct word order for question",
        "'do' is not needed with 'be' verb"
      ],
      commonMistakes: [
        "Thinking 'What time' is wrong (it's correct and common)",
        "Trying to change correct questions"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Choose the correct question about quantity:",
    options: [
      "How many students are there?",
      "How much students are there?",
      "How many student are there?",
      "What many students are there?"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Students' is countable plural, use 'How many' + plural noun. 'How many students?' asks about number/quantity of countable things.",
      formula: "How many + countable plural? (How many students, books, cars)",
      trapAlerts: [
        "'How much' is for uncountable nouns - students are countable",
        "'student' should be plural 'students' after 'how many'",
        "'What many' is not a real question form in English"
      ],
      commonMistakes: [
        "Using 'How much' with countable nouns",
        "Not making noun plural after 'how many'"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "What's the difference?\n\n'Who did you see?' vs 'Who saw you?'",
    options: [
      "First: Who is object. Second: Who is subject.",
      "They mean exactly the same",
      "First is wrong, second is correct",
      "Both are wrong"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Who did you see?' = You saw someone (Who is object, needs 'did'). 'Who saw you?' = Someone saw you (Who is subject, no 'did' needed). Different meanings and grammar.",
      formula: "Who (object) + did + subject + see? | Who (subject) + saw + object?",
      trapAlerts: [
        "They have different meanings - not the same",
        "First is correct for 'Who is object'",
        "Both are grammatically correct - different situations"
      ],
      commonMistakes: [
        "Not understanding Who can be subject or object with different grammar",
        "Adding 'did' when Who is the subject"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },

  // QUESTION WORDS - 15 questions
  {
    question: "What does 'What' ask about?",
    options: [
      "Things, actions, or information",
      "People only",
      "Time only",
      "Place only"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'What' asks about things, actions, or information (not people). Examples: 'What is this?' (thing), 'What do you do?' (action/job), 'What is your name?' (information).",
      formula: "What = thing/action/info (What is it? What are you doing? What's your name?)",
      trapAlerts: [
        "People: use 'Who' not 'What' (Who is she? not What is she?)",
        "Time: use 'When' not 'What' (When is it? not What is it? for time)",
        "Place: use 'Where' not 'What' (Where is it? not What is it? for location)"
      ],
      commonMistakes: [
        "Using 'What' for people (should use 'Who')",
        "Not understanding 'What' covers things, actions, and general information"
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
    console.log('\n🎓 Inserting Question Formation Questions (Batch 1/2)');
    console.log('='.repeat(80));
    console.log(`\n📋 Topic: question-formation (A1 level)`);
    console.log(`   Questions in this batch: ${QUESTION_FORMATION_BATCH1.length}`);
    console.log(`   Subtopics: Yes/No (15), Wh-Questions (15), Question Words (15 started)\n`);

    let inserted = 0;
    for (const q of QUESTION_FORMATION_BATCH1) {
      await pool.query(
        `INSERT INTO english_questions
         (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
        [
          'foundation',
          'question-formation',
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
        console.log(`   ✓ Inserted ${inserted}/${QUESTION_FORMATION_BATCH1.length}...`);
      }
    }

    console.log(`\n✅ Successfully inserted ${inserted} questions!`);
    console.log(`\n📊 Progress: 45/60 for question-formation (need 15 more)`);

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

insertQuestions();
