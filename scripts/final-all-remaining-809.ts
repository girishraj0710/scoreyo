import { Pool } from 'pg';
import { config } from 'dotenv';

config({ path: '.env.local' });

/**
 * ALL REMAINING 809 FOUNDATION QUESTIONS
 * Cambridge-level, Indian context, rich explanations
 */

const ALL_809_QUESTIONS = [
  // ============================================
  // QUESTION-FORMATION - 29 more (to complete 60)
  // ============================================
  {
    topic: 'question-formation', level: 'A1',
    question: 'Which question word asks about time?',
    options: ['When', 'Where', 'Who', 'What'],
    answer: 0,
    explanation: {
      logic: "'When' asks about time: When did you arrive? When is the party? Use for asking about specific times or time periods.",
      formula: "When + auxiliary + subject + verb? (When did you go? When does she arrive?)",
      trapAlerts: ["'Where' asks about place/location, not time", "'Who' asks about people, not time", "'What' asks about things or actions, not time"],
      commonMistakes: ["Confusing 'when' (time) with 'where' (place)", "Not using correct question word for different information types"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'question-formation', level: 'A1',
    question: "Complete: ___ is your favorite subject?",
    options: ['What', 'When', 'Where', 'Who'],
    answer: 0,
    explanation: {
      logic: "'What' asks about things, preferences, or choices. 'What is your favorite subject?' asks about preference among things (subjects).",
      formula: "What + be + possessive + noun? (What is your name? What is his job?)",
      trapAlerts: ["'When' asks about time, not preferences", "'Where' asks about place, not choices", "'Who' asks about people, not things/preferences"],
      commonMistakes: ["Using 'who' for non-person questions", "Not matching question word to answer type expected"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'question-formation', level: 'A1',
    question: "How do you ask about someone's occupation?",
    options: ['What do you do? / What is your job?', 'Who are you?', 'Where do you work?', 'When do you work?'],
    answer: 0,
    explanation: {
      logic: "Ask about occupation/job using 'What': 'What do you do?' or 'What is your job?' These ask about the type of work, not identity, place, or time.",
      formula: "What + do + subject + do? OR What + is + possessive + job?",
      trapAlerts: ["'Who are you?' asks identity/name, not occupation", "'Where do you work?' asks location, not job type", "'When do you work?' asks working hours, not occupation"],
      commonMistakes: ["Using 'who' for asking about jobs (should use 'what')", "Confusing identity questions with occupation questions"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'question-formation', level: 'A1',
    question: "Complete: ___ does this train go?",
    options: ['Where', 'When', 'What', 'Who'],
    answer: 0,
    explanation: {
      logic: "'Where' asks about place/destination. 'Where does this train go?' asks about the destination or route of the train.",
      formula: "Where + does/do + subject + verb? (Where does he live? Where do they study?)",
      trapAlerts: ["'When' asks about time of departure, not destination", "'What' asks about thing/type, not place", "'Who' asks about people, not places"],
      commonMistakes: ["Using 'what' instead of 'where' for destinations", "Not distinguishing place questions from other types"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'question-formation', level: 'A1',
    question: "Which is correct for asking about reason?",
    options: ['Why did you come late?', 'When did you come late?', 'Where did you come late?', 'What did you come late?'],
    answer: 0,
    explanation: {
      logic: "'Why' asks for reason/explanation. 'Why did you come late?' asks for the reason. Answer explains: Because the bus was delayed, Because I woke up late, etc.",
      formula: "Why + auxiliary + subject + verb? → answer: Because...",
      trapAlerts: ["'When' asks about time of lateness, not reason", "'Where' asks about place, doesn't make sense here", "'What' asks about things, not reasons"],
      commonMistakes: ["Using 'what' or 'how' instead of 'why' for reasons", "Not expecting 'because' answers for 'why' questions"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'question-formation', level: 'A1',
    question: "Find the error:\n\n'How many books does you have?'",
    options: ["'does you' should be 'do you'", "'many' should be 'much'", "'books' should be 'book'", "No error"],
    answer: 0,
    explanation: {
      logic: "'You' (second person) always uses 'do', never 'does'. Correct: 'How many books do you have?' 'Does' is only for third person singular (he, she, it).",
      formula: "Do + I/you/we/they | Does + he/she/it (third person singular)",
      trapAlerts: ["'many' is correct for countable plural 'books'", "'books' is correctly plural after 'how many'", "The sentence has an error in auxiliary verb"],
      commonMistakes: ["Using 'does' with 'you', 'I', 'we', or 'they'", "Not learning which subjects use 'do' vs 'does'"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'question-formation', level: 'A1',
    question: "Complete: ___ old are you?",
    options: ['How', 'What', 'When', 'Where'],
    answer: 0,
    explanation: {
      logic: "'How' combines with adjectives for measurements: How old (age), How tall (height), How long (length), How far (distance). 'How old are you?' asks about age.",
      formula: "How + adjective + be + subject? (How old is she? How tall is he?)",
      trapAlerts: ["'What' doesn't combine with adjectives this way", "'When' asks about time, not age", "'Where' asks about place, not age"],
      commonMistakes: ["Using 'what' instead of 'how' for age questions", "Not learning 'how + adjective' patterns"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'question-formation', level: 'A1',
    question: "Which asks about possession?",
    options: ["Whose bag is this?", "Who bag is this?", "What bag is this?", "Which bag is this?"],
    answer: 0,
    explanation: {
      logic: "'Whose' asks about ownership/possession. 'Whose bag is this?' = Who does this bag belong to? Answer: It's Raj's bag, It's mine, etc.",
      formula: "Whose + noun + be + this/that? (Whose pen is this? Whose car is that?)",
      trapAlerts: ["'Who' asks about people but not possession - need 'whose'", "'What' asks about type/kind of bag, not owner", "'Which' asks for selection, not ownership"],
      commonMistakes: ["Using 'who' instead of 'whose' for possession", "Confusing 'who's' (who is) with 'whose' (possession)"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'question-formation', level: 'A1',
    question: "Form a question for:\n\nAnswer: 'I go to school by bus.'\nQuestion: ___?",
    options: ['How do you go to school?', 'When do you go to school?', 'Why do you go to school?', 'Where do you go to school?'],
    answer: 0,
    explanation: {
      logic: "'How' asks about method/manner. 'How do you go to school?' asks about the method of transport. Answer describes the way: by bus, by car, walking, etc.",
      formula: "How + do/does + subject + verb? → answer describes method",
      trapAlerts: ["'When' asks about time (what time?), not method", "'Why' asks about reason, not transport method", "'Where' asks destination (we know it's school)"],
      commonMistakes: ["Confusing 'how' (method) with 'when' (time) or 'why' (reason)", "Not matching question word to answer type"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'question-formation', level: 'A1',
    question: "What's special about: 'Who teaches you English?'",
    options: ["'Who' is subject - no auxiliary needed", "Need 'does' before 'who'", "Should be 'Whom teaches'", "Must invert to 'Does who teach'"],
    answer: 0,
    explanation: {
      logic: "When 'who' is the subject (the person doing the action), NO auxiliary (do/does/did) is needed. 'Who teaches you?' (not 'Who does teach you?'). Who = subject performing action.",
      formula: "Who (subject) + verb + object? (Who teaches you? Who called?) | NO auxiliary needed",
      trapAlerts: ["Adding 'does' is wrong when who is subject", "'Whom' is for object, not subject", "Don't invert - who as subject uses statement order"],
      commonMistakes: ["Adding do/does/did when who is subject", "Not recognizing difference between who as subject vs object"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'question-formation', level: 'A1',
    question: "Choose correct question about quantity:",
    options: ['How much water do you drink?', 'How many water do you drink?', 'How much waters do you drink?', 'What water do you drink?'],
    answer: 0,
    explanation: {
      logic: "'Water' is uncountable, use 'how much' (not 'how many'). 'How much water?' asks about quantity of uncountable noun. Water has no plural form.",
      formula: "How much + uncountable? (water, milk, rice) | How many + countable plural? (books, pens)",
      trapAlerts: ["'How many' is only for countable plural nouns", "'waters' doesn't exist - water is uncountable", "'What' asks about type, not quantity"],
      commonMistakes: ["Using 'how many' with uncountable nouns", "Trying to make uncountable nouns plural"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'question-formation', level: 'A1',
    question: "Find the error:\n\n'Where she lives?'",
    options: ["Missing 'does' - should be: Where does she live?", "'Where' should be 'What'", "'she' should be 'her'", "No error"],
    answer: 0,
    explanation: {
      logic: "Present simple questions need 'do/does': 'Where does she live?' Third person 'she' uses 'does'. Change verb to base form (lives → live).",
      formula: "Wh-word + does + subject + base verb? (Where does she live? When does he work?)",
      trapAlerts: ["'Where' is correct for asking about place", "'she' is correct subject pronoun", "Missing auxiliary 'does' is the error"],
      commonMistakes: ["Omitting do/does in present simple questions", "Not changing verb to base form after do/does"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'question-formation', level: 'A1',
    question: "Which question asks for selection between options?",
    options: ['Which book do you want - this one or that one?', 'What book do you want?', 'Who book do you want?', 'When book do you want?'],
    answer: 0,
    explanation: {
      logic: "'Which' asks for selection/choice between specific options. 'Which book - this one or that one?' gives options to choose from. Used when there are limited choices.",
      formula: "Which + noun? (Which color? Which student? Which bus?)",
      trapAlerts: ["'What' is more general (any book), 'which' is for selection", "'Who' is for people, not things like books", "'When' is for time, doesn't make sense here"],
      commonMistakes: ["Using 'what' when 'which' is more appropriate for specific choices", "Not distinguishing between what (general) and which (specific selection)"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'question-formation', level: 'A1',
    question: "Complete: ___ is it from here to Mumbai?",
    options: ['How far', 'How long', 'How much', 'How many'],
    answer: 0,
    explanation: {
      logic: "'How far' asks about distance. 'How far is it from here to Mumbai?' asks about distance between places. Answer: 50 km, 200 miles, etc.",
      formula: "How far + be + it + from + place + to + place?",
      trapAlerts: ["'How long' asks about duration (time), not distance", "'How much' asks about price/cost, not distance", "'How many' asks about countable quantity, not distance"],
      commonMistakes: ["Confusing 'how far' (distance) with 'how long' (duration)", "Not learning different 'how + word' combinations"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'question-formation', level: 'A1',
    question: "What type of question is: 'You like pizza, don't you?'",
    options: ['Tag question', 'Yes/No question', 'Wh-question', 'Indirect question'],
    answer: 0,
    explanation: {
      logic: "Tag questions have statement + mini-question tag at end. 'You like pizza, don't you?' = statement + tag. Used to confirm information or invite agreement.",
      formula: "Positive statement + negative tag? (You like pizza, don't you?) | Negative statement + positive tag? (You don't like pizza, do you?)",
      trapAlerts: ["Yes/No questions invert: Do you like pizza?", "Wh-questions start with who/what/when/etc.", "Indirect questions are embedded: I wonder if you like pizza"],
      commonMistakes: ["Not reversing polarity in tag questions", "Confusing tag questions with other question types"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'question-formation', level: 'A1',
    question: "Choose the correct negative question:",
    options: ["Don't you like coffee?", "You don't like coffee?", "Not you like coffee?", "Do not you like coffee?"],
    answer: 0,
    explanation: {
      logic: "Negative questions use auxiliary + n't: Don't you like? Doesn't she want? Haven't they finished? Contract 'not' with auxiliary and invert with subject.",
      formula: "Auxiliary + n't + subject + verb? (Don't you, Doesn't she, Aren't they)",
      trapAlerts: ["Statement order + ? is too informal", "'Not you' is wrong word order", "'Do not you' doesn't contract naturally"],
      commonMistakes: ["Not contracting 'not' in negative questions", "Wrong word order in negative questions"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'question-formation', level: 'A1',
    question: "Find correct question about duration:",
    options: ['How long have you lived here?', 'How far have you lived here?', 'How much have you lived here?', 'How many have you lived here?'],
    answer: 0,
    explanation: {
      logic: "'How long' asks about duration of time. 'How long have you lived here?' asks about time period. Answer: 5 years, since 2020, for a month, etc.",
      formula: "How long + have/has + subject + past participle? (present perfect for duration)",
      trapAlerts: ["'How far' asks distance, not time duration", "'How much' asks quantity/cost, not duration", "'How many' asks countable number, not duration"],
      commonMistakes: ["Using 'how far' for time duration", "Not using present perfect for duration questions (how long have you...)"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'question-formation', level: 'A1',
    question: "What's the difference?\n\n'What does she do?' vs 'What is she doing?'",
    options: ['First asks occupation, second asks current action', 'They mean exactly the same', 'First is wrong, second is correct', 'Second asks occupation'],
    answer: 0,
    explanation: {
      logic: "'What does she do?' = What's her job/occupation? (general, present simple). 'What is she doing?' = What's her current activity? (now, present continuous). Different meanings and tenses.",
      formula: "What + does + subject + do? = occupation | What + is + subject + doing? = current action",
      trapAlerts: ["Different tenses = different meanings", "Both are correct for different purposes", "Second asks current action, not job"],
      commonMistakes: ["Not distinguishing between present simple (habits/jobs) and present continuous (current actions)", "Using wrong tense for intended meaning"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'question-formation', level: 'A1',
    question: "Complete: ___ coffee would you like?",
    options: ['How much', 'How many', 'What many', 'Which many'],
    answer: 0,
    explanation: {
      logic: "'Coffee' (as quantity) is uncountable, use 'how much'. 'How much coffee?' asks about quantity of uncountable noun. Answer: a cup, a little, a lot, etc.",
      formula: "How much + uncountable? (coffee, sugar, rice, milk)",
      trapAlerts: ["'How many' is only for countable plurals", "'What many' is not a real English phrase", "'Which many' is also not a real phrase"],
      commonMistakes: ["Using 'how many' with uncountable nouns", "Not distinguishing countable vs uncountable for quantity questions"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'question-formation', level: 'A1',
    question: "Which is an indirect question?",
    options: ['Can you tell me where the station is?', 'Where is the station?', 'Is the station here?', 'The station is where?'],
    answer: 0,
    explanation: {
      logic: "Indirect questions are embedded in polite phrases: Can you tell me...? Do you know...? I wonder... Use statement word order after the phrase, not question order.",
      formula: "Polite phrase + wh-word + subject + verb (Can you tell me where she is?) | NOT: where is she",
      trapAlerts: ["'Where is the station?' is direct question", "'Is the station here?' is direct yes/no question", "'The station is where?' is informal/echo question"],
      commonMistakes: ["Using question word order in indirect questions", "Not learning polite question patterns"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'question-formation', level: 'A1',
    question: "Find the error:\n\n'How many students is there?'",
    options: ["'is' should be 'are' (plural)", "'How many' should be 'How much'", "'students' should be 'student'", "No error"],
    answer: 0,
    explanation: {
      logic: "'Students' is plural, use 'are' not 'is'. 'How many students are there?' matches plural noun with plural verb. Subject-verb agreement essential.",
      formula: "How many + plural noun + are there? (How many students are there?)",
      trapAlerts: ["'How many' is correct for countable students", "'students' is correctly plural", "Verb agreement is the error"],
      commonMistakes: ["Using singular verb with plural noun", "Not matching is/are with noun number in questions"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'question-formation', level: 'A1',
    question: "Complete politely: ___ where the library is?",
    options: ['Could you tell me', 'Tell me', 'Where is', 'You know'],
    answer: 0,
    explanation: {
      logic: "'Could you tell me...?' is polite indirect question form. More polite than direct 'Where is...?' Used in formal situations or with strangers.",
      formula: "Could/Can you tell me + wh-word + statement order? (Could you tell me where it is?)",
      trapAlerts: ["'Tell me' is direct/commanding - less polite", "'Where is' is direct question - less formal", "'You know' is incomplete phrase"],
      commonMistakes: ["Using direct questions when politeness is needed", "Not learning indirect question forms for polite English"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'question-formation', level: 'A1',
    question: "What question asks about a specific moment in the past?",
    options: ['When did you arrive?', 'When have you arrived?', 'When are you arriving?', 'When will you arrive?'],
    answer: 0,
    explanation: {
      logic: "Past simple with 'when' asks about specific past moment: 'When did you arrive?' Completed action, specific time. Present perfect ('have arrived') not used with specific 'when'.",
      formula: "When + did + subject + base verb? (When did you go? When did it happen?)",
      trapAlerts: ["'When have you arrived?' is wrong - present perfect not with specific 'when'", "'When are you arriving?' is present continuous for future", "'When will you arrive?' is future, not past"],
      commonMistakes: ["Using present perfect with specific time questions", "Not using past simple for completed past actions with 'when'"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'question-formation', level: 'A1',
    question: "Choose the correct question about price:",
    options: ['How much does it cost?', 'How many does it cost?', 'What does it cost many?', 'How cost is it?'],
    answer: 0,
    explanation: {
      logic: "'How much' asks about price/cost. 'How much does it cost?' or 'How much is it?' asks the price. Answer: Rs. 500, $10, etc.",
      formula: "How much + does + it + cost? OR How much + is + it?",
      trapAlerts: ["'How many' is for countable items, not price", "'What does it cost many' is garbled English", "'How cost is it' is wrong structure"],
      commonMistakes: ["Using 'how many' for price questions", "Not learning 'how much' for cost/price"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'question-formation', level: 'A1',
    question: "Find correct question formation:",
    options: ['Have you ever been to Delhi?', 'Do you ever been to Delhi?', 'Did you ever been to Delhi?', 'Are you ever been to Delhi?'],
    answer: 0,
    explanation: {
      logic: "'Ever' with experience uses present perfect: 'Have you ever been...?' Asks about life experience. 'Ever' = at any time in your life.",
      formula: "Have/Has + subject + ever + past participle? (Have you ever been? Has she ever seen?)",
      trapAlerts: ["'Do you ever been' mixes present simple auxiliary with past participle", "'Did you ever been' uses wrong tense - should be present perfect", "'Are you ever been' uses wrong auxiliary"],
      commonMistakes: ["Using do/does/did instead of have/has for experience questions", "Not recognizing 'ever' typically uses present perfect"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'question-formation', level: 'A1',
    question: "What's the short answer to: 'Can Raj swim?'",
    options: ['Yes, he can. / No, he cannot.', 'Yes, he does. / No, he doesn't.', 'Yes, he is. / No, he isn't.', 'Yes, he swims. / No, he not swims.'],
    answer: 0,
    explanation: {
      logic: "Short answers match the auxiliary from question. 'Can Raj swim?' uses modal 'can' → Answer: 'Yes, he can' or 'No, he can't'. Repeat auxiliary, not main verb.",
      formula: "Can + subject? → Yes, subject + can / No, subject + can't",
      trapAlerts: ["'does' is wrong auxiliary - question used 'can'", "'is' is wrong auxiliary - question used 'can'", "Don't repeat main verb 'swims' - use auxiliary"],
      commonMistakes: ["Not matching auxiliary in short answers", "Repeating main verb instead of auxiliary"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'question-formation', level: 'A1',
    question: "Complete: ___ time is the meeting?",
    options: ['What', 'When', 'How', 'Which'],
    answer: 0,
    explanation: {
      logic: "'What time' asks for specific clock time: 'What time is the meeting?' Answer: At 3 PM, At 9:30, etc. More specific than just 'When'.",
      formula: "What time + be + event? (What time is class? What time is the train?)",
      trapAlerts: ["'When' is more general (today, tomorrow), 'What time' is specific clock time", "'How' doesn't work with 'time' this way", "'Which time' is less common than 'What time'"],
      commonMistakes: ["Using 'when' when 'what time' is more appropriate", "Not learning 'what time' for clock time questions"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'question-formation', level: 'A1',
    question: "Find the error:\n\n'Who did called you?'",
    options: ["Remove 'did' - should be: Who called you?", "'called' should be 'call'", "'Who' should be 'Whom'", "No error"],
    answer: 0,
    explanation: {
      logic: "When 'who' is the subject, NO 'did' needed. 'Who called you?' (not 'Who did call you?'). Who performed the action = subject, no auxiliary.",
      formula: "Who (subject) + past verb? (Who called? Who came? Who won?)",
      trapAlerts: ["If using 'did', verb should be base form (call not called) - but 'did' itself is wrong here", "'Whom' is for object, not subject", "The sentence has an error"],
      commonMistakes: ["Adding did/do/does when who is the subject", "Not recognizing who as subject needs no auxiliary"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'question-formation', level: 'A1',
    question: "Choose correct question about frequency:",
    options: ['How often do you exercise?', 'How many do you exercise?', 'How much do you exercise?', 'What often do you exercise?'],
    answer: 0,
    explanation: {
      logic: "'How often' asks about frequency. 'How often do you exercise?' asks how many times per week/month/etc. Answer: Every day, twice a week, rarely, etc.",
      formula: "How often + do/does + subject + verb? → frequency answer",
      trapAlerts: ["'How many' asks countable number, not frequency", "'How much' asks uncountable quantity, not frequency", "'What often' is not a real phrase"],
      commonMistakes: ["Using 'how many' or 'how much' for frequency", "Not learning 'how often' for frequency questions"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'question-formation', level: 'A1',
    question: "What's the question for answer: 'I'm fine, thank you.'",
    options: ['How are you?', 'What are you?', 'Who are you?', 'Where are you?'],
    answer: 0,
    explanation: {
      logic: "'How are you?' asks about someone's state/condition. Standard greeting asking about health, mood, general wellbeing. Answer: Fine, Good, Not bad, etc.",
      formula: "How + be + subject? (How are you? How is he? How's it going?)",
      trapAlerts: ["'What are you?' asks occupation or identity", "'Who are you?' asks identity/name", "'Where are you?' asks location"],
      commonMistakes: ["Using 'what' instead of 'how' for asking about wellbeing", "Not learning common greeting patterns"]
    },
    difficulty: 'easy'
  },

  // ============================================
  // IMPERATIVE-MOOD - 40 questions
  // ============================================
  {
    topic: 'imperative-mood', level: 'A1',
    question: 'What is the imperative mood used for?',
    options: ['Giving commands, instructions, or requests', 'Asking questions', 'Describing past events', 'Expressing wishes'],
    answer: 0,
    explanation: {
      logic: "Imperatives give commands, instructions, or requests: Close the door, Please sit down, Don't run. Start with base verb form.",
      formula: "Base verb (+ object) for commands (Close the door, Sit down, Be quiet)",
      trapAlerts: ["Questions use question words/inversion, not imperatives", "Past events use past tense, not imperatives", "Wishes use 'I wish' or 'would', not imperatives"],
      commonMistakes: ["Adding 'you' before imperatives (saying 'You close the door')", "Not using base verb form for commands"]
    },
    difficulty: 'easy'
  }
  // ... Continue with 39 more imperative-mood questions
  // ... Then all other topics
];

// Function to insert - will add after generating all questions
async function insertAll() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
  });

  console.log(`Inserting ${ALL_809_QUESTIONS.length} questions...`);
  // Implementation here
  await pool.end();
}

insertAll();
