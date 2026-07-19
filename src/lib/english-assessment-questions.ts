// High-Quality English Assessment Question Bank
// 60 questions total: 12 per level (A1, A2, B1, B2, C1)
// Each level: 3 Grammar + 3 Vocabulary + 3 Reading + 3 Usage

export interface AssessmentQuestion {
  id: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  skill: 'grammar' | 'vocabulary' | 'reading' | 'usage' | 'speaking' | 'listening';
  type?: 'mcq' | 'speaking' | 'listening'; // Question type
  question: string;
  options: string[]; // For MCQ
  correctAnswer: number; // For MCQ
  minReadTimeSeconds: number; // Minimum time to read question naturally
  explanation: string;
  // Speaking-specific fields
  speakingPrompt?: string; // Text to read aloud
  speakingCriteria?: {
    minDuration: number; // Minimum seconds
    maxDuration: number; // Maximum seconds
    expectedWords?: string[]; // Key words that should be present
  };
  // Listening-specific fields
  audioUrl?: string; // URL to audio file
}

export const assessmentQuestions: AssessmentQuestion[] = [
  // ==================== A1 LEVEL (BEGINNER) ====================
  // A1 Grammar
  {
    id: 'A1-G1',
    level: 'A1',
    skill: 'grammar',
    question: 'Choose the correct sentence:',
    options: [
      'She go to school every day.',
      'She goes to school every day.',
      'She going to school every day.',
      'She is goes to school every day.'
    ],
    correctAnswer: 1,
    minReadTimeSeconds: 8,
    explanation: 'Use "goes" with third person singular (he/she/it) in present simple tense.'
  },
  {
    id: 'A1-G2',
    level: 'A1',
    skill: 'grammar',
    question: 'Fill in the blank: "I ___ a student."',
    options: ['am', 'is', 'are', 'be'],
    correctAnswer: 0,
    minReadTimeSeconds: 6,
    explanation: 'Use "am" with "I" in present tense of verb "to be".'
  },
  {
    id: 'A1-G3',
    level: 'A1',
    skill: 'grammar',
    question: 'Which sentence is correct?',
    options: [
      'They has two cats.',
      'They have two cats.',
      'They having two cats.',
      'They is have two cats.'
    ],
    correctAnswer: 1,
    minReadTimeSeconds: 7,
    explanation: 'Use "have" with plural subjects (we/you/they) in present simple.'
  },

  // A1 Vocabulary
  {
    id: 'A1-V1',
    level: 'A1',
    skill: 'vocabulary',
    question: 'What do you use to write on paper?',
    options: ['A chair', 'A pen', 'A cup', 'A door'],
    correctAnswer: 1,
    minReadTimeSeconds: 7,
    explanation: 'A pen is a basic writing instrument used on paper.'
  },
  {
    id: 'A1-V2',
    level: 'A1',
    skill: 'vocabulary',
    question: 'Choose the opposite of "big":',
    options: ['small', 'large', 'tall', 'long'],
    correctAnswer: 0,
    minReadTimeSeconds: 6,
    explanation: 'Small is the antonym (opposite) of big.'
  },
  {
    id: 'A1-V3',
    level: 'A1',
    skill: 'vocabulary',
    question: 'What is the color of the sky on a clear day?',
    options: ['green', 'blue', 'red', 'yellow'],
    correctAnswer: 1,
    minReadTimeSeconds: 8,
    explanation: 'The sky appears blue on a clear day due to light scattering.'
  },

  // A1 Reading
  {
    id: 'A1-R1',
    level: 'A1',
    skill: 'reading',
    question: 'Read: "My name is John. I am 10 years old." How old is John?',
    options: ['9 years old', '10 years old', '11 years old', '12 years old'],
    correctAnswer: 1,
    minReadTimeSeconds: 10,
    explanation: 'The text clearly states "I am 10 years old."'
  },
  {
    id: 'A1-R2',
    level: 'A1',
    skill: 'reading',
    question: 'Read: "The cat is on the table." Where is the cat?',
    options: ['under the table', 'on the table', 'near the table', 'behind the table'],
    correctAnswer: 1,
    minReadTimeSeconds: 9,
    explanation: 'The preposition "on" indicates the cat is on top of the table.'
  },
  {
    id: 'A1-R3',
    level: 'A1',
    skill: 'reading',
    question: 'Read: "I like apples and bananas." What does the person like?',
    options: ['only apples', 'only bananas', 'apples and bananas', 'oranges'],
    correctAnswer: 2,
    minReadTimeSeconds: 9,
    explanation: 'The conjunction "and" connects both fruits the person likes.'
  },

  // A1 Usage
  {
    id: 'A1-U1',
    level: 'A1',
    skill: 'usage',
    question: 'How do you greet someone in the morning?',
    options: ['Good night', 'Good morning', 'Goodbye', 'See you later'],
    correctAnswer: 1,
    minReadTimeSeconds: 8,
    explanation: '"Good morning" is the standard greeting used before noon.'
  },
  {
    id: 'A1-U2',
    level: 'A1',
    skill: 'usage',
    question: 'What do you say when someone says "Thank you"?',
    options: ['Please', 'Sorry', 'You\'re welcome', 'Excuse me'],
    correctAnswer: 2,
    minReadTimeSeconds: 9,
    explanation: '"You\'re welcome" is the polite response to "Thank you".'
  },
  {
    id: 'A1-U3',
    level: 'A1',
    skill: 'usage',
    question: 'Which question asks about a person\'s name?',
    options: ['How are you?', 'What is your name?', 'Where are you from?', 'How old are you?'],
    correctAnswer: 1,
    minReadTimeSeconds: 10,
    explanation: '"What is your name?" directly asks for a person\'s name.'
  },

  // ==================== A2 LEVEL (ELEMENTARY) ====================
  // A2 Grammar
  {
    id: 'A2-G1',
    level: 'A2',
    skill: 'grammar',
    question: 'Choose the correct past tense: "Yesterday, I ___ to the park."',
    options: ['go', 'goes', 'went', 'going'],
    correctAnswer: 2,
    minReadTimeSeconds: 10,
    explanation: '"Went" is the simple past tense of "go".'
  },
  {
    id: 'A2-G2',
    level: 'A2',
    skill: 'grammar',
    question: 'Which sentence uses the present continuous correctly?',
    options: [
      'She is reads a book.',
      'She reading a book.',
      'She is reading a book.',
      'She read a book now.'
    ],
    correctAnswer: 2,
    minReadTimeSeconds: 12,
    explanation: 'Present continuous: is/am/are + verb+ing'
  },
  {
    id: 'A2-G3',
    level: 'A2',
    skill: 'grammar',
    question: 'Fill in the blank: "There ___ many people at the party."',
    options: ['is', 'are', 'was', 'be'],
    correctAnswer: 1,
    minReadTimeSeconds: 10,
    explanation: 'Use "are" with plural nouns in present tense.'
  },

  // A2 Vocabulary
  {
    id: 'A2-V1',
    level: 'A2',
    skill: 'vocabulary',
    question: 'What does "exhausted" mean?',
    options: ['very happy', 'very tired', 'very angry', 'very hungry'],
    correctAnswer: 1,
    minReadTimeSeconds: 9,
    explanation: 'Exhausted means extremely tired or worn out.'
  },
  {
    id: 'A2-V2',
    level: 'A2',
    skill: 'vocabulary',
    question: 'Choose a synonym for "beautiful":',
    options: ['ugly', 'pretty', 'bad', 'strange'],
    correctAnswer: 1,
    minReadTimeSeconds: 8,
    explanation: 'Pretty and beautiful both mean attractive or pleasing.'
  },
  {
    id: 'A2-V3',
    level: 'A2',
    skill: 'vocabulary',
    question: 'What is a "neighbor"?',
    options: [
      'Someone who lives far away',
      'Someone who lives next to you',
      'Someone who works with you',
      'Someone from another country'
    ],
    correctAnswer: 1,
    minReadTimeSeconds: 11,
    explanation: 'A neighbor is someone who lives near or next to you.'
  },

  // A2 Reading
  {
    id: 'A2-R1',
    level: 'A2',
    skill: 'reading',
    question: 'Read: "Sarah usually wakes up at 7 AM. Today she woke up at 9 AM because it is Sunday." Why did Sarah wake up late?',
    options: [
      'She was sick',
      'It is Sunday',
      'She had work',
      'Her alarm didn\'t ring'
    ],
    correctAnswer: 1,
    minReadTimeSeconds: 15,
    explanation: 'The text states she woke up late "because it is Sunday".'
  },
  {
    id: 'A2-R2',
    level: 'A2',
    skill: 'reading',
    question: 'Read: "The weather was cold, so I wore a jacket." Why did the person wear a jacket?',
    options: [
      'It was raining',
      'It was cold',
      'It was sunny',
      'It was windy'
    ],
    correctAnswer: 1,
    minReadTimeSeconds: 12,
    explanation: '"Because" explains the reason - the weather was cold.'
  },
  {
    id: 'A2-R3',
    level: 'A2',
    skill: 'reading',
    question: 'Read: "I have two brothers and one sister. My brothers are older than me." How many siblings does the person have?',
    options: ['one', 'two', 'three', 'four'],
    correctAnswer: 2,
    minReadTimeSeconds: 14,
    explanation: '2 brothers + 1 sister = 3 siblings total.'
  },

  // A2 Usage
  {
    id: 'A2-U1',
    level: 'A2',
    skill: 'usage',
    question: 'How do you politely ask someone to repeat what they said?',
    options: [
      'What?',
      'Huh?',
      'Could you repeat that, please?',
      'Say again!'
    ],
    correctAnswer: 2,
    minReadTimeSeconds: 12,
    explanation: 'Using "Could you" and "please" makes the request polite.'
  },
  {
    id: 'A2-U2',
    level: 'A2',
    skill: 'usage',
    question: 'What is the appropriate response to "How are you?"',
    options: [
      'I am 25 years old',
      'I am fine, thank you',
      'My name is John',
      'I live in London'
    ],
    correctAnswer: 1,
    minReadTimeSeconds: 13,
    explanation: '"I am fine, thank you" appropriately answers about your well-being.'
  },
  {
    id: 'A2-U3',
    level: 'A2',
    skill: 'usage',
    question: 'Which phrase is used to make a suggestion?',
    options: [
      'You must do this',
      'You have to do this',
      'Why don\'t we do this?',
      'Do this now!'
    ],
    correctAnswer: 2,
    minReadTimeSeconds: 13,
    explanation: '"Why don\'t we" is a polite way to suggest something.'
  },

  // ==================== B1 LEVEL (INTERMEDIATE) ====================
  // B1 Grammar
  {
    id: 'B1-G1',
    level: 'B1',
    skill: 'grammar',
    question: 'Choose the correct sentence using present perfect:',
    options: [
      'I have saw that movie yesterday.',
      'I have seen that movie.',
      'I had seen that movie.',
      'I was seeing that movie.'
    ],
    correctAnswer: 1,
    minReadTimeSeconds: 13,
    explanation: 'Present perfect: have/has + past participle (seen).'
  },
  {
    id: 'B1-G2',
    level: 'B1',
    skill: 'grammar',
    question: 'Fill in the blank: "If I ___ more time, I would travel more."',
    options: ['have', 'had', 'will have', 'would have'],
    correctAnswer: 1,
    minReadTimeSeconds: 12,
    explanation: 'Second conditional uses past simple in the if-clause.'
  },
  {
    id: 'B1-G3',
    level: 'B1',
    skill: 'grammar',
    question: 'Which sentence uses the passive voice correctly?',
    options: [
      'The book was written by her.',
      'The book written by her.',
      'The book is writing by her.',
      'The book writes by her.'
    ],
    correctAnswer: 0,
    minReadTimeSeconds: 14,
    explanation: 'Passive voice: be + past participle + by + agent.'
  },

  // B1 Vocabulary
  {
    id: 'B1-V1',
    level: 'B1',
    skill: 'vocabulary',
    question: 'What does "postpone" mean?',
    options: [
      'to cancel something',
      'to delay something to a later time',
      'to finish something early',
      'to forget something'
    ],
    correctAnswer: 1,
    minReadTimeSeconds: 12,
    explanation: 'Postpone means to reschedule or delay to a future time.'
  },
  {
    id: 'B1-V2',
    level: 'B1',
    skill: 'vocabulary',
    question: 'Choose the best word: "The movie was so ___ that I fell asleep."',
    options: ['exciting', 'boring', 'interesting', 'thrilling'],
    correctAnswer: 1,
    minReadTimeSeconds: 13,
    explanation: 'Boring fits the context of falling asleep during the movie.'
  },
  {
    id: 'B1-V3',
    level: 'B1',
    skill: 'vocabulary',
    question: 'What is the meaning of "take into account"?',
    options: [
      'to ignore something',
      'to consider something',
      'to forget something',
      'to reject something'
    ],
    correctAnswer: 1,
    minReadTimeSeconds: 13,
    explanation: '"Take into account" is a phrasal verb meaning to consider.'
  },

  // B1 Reading
  {
    id: 'B1-R1',
    level: 'B1',
    skill: 'reading',
    question: 'Read: "Although it was raining heavily, they decided to continue their hike. They were determined to reach the summit before sunset." What can we infer about them?',
    options: [
      'They don\'t like rain',
      'They are persistent and goal-oriented',
      'They forgot their umbrella',
      'They wanted to go home'
    ],
    correctAnswer: 1,
    minReadTimeSeconds: 20,
    explanation: '"Determined" and continuing despite rain shows persistence.'
  },
  {
    id: 'B1-R2',
    level: 'B1',
    skill: 'reading',
    question: 'Read: "The company\'s profits increased significantly last quarter, despite the challenging economic conditions." What does this tell us about the company?',
    options: [
      'The company is struggling',
      'The economy is doing well',
      'The company performed well despite difficulties',
      'The company lost money'
    ],
    correctAnswer: 2,
    minReadTimeSeconds: 18,
    explanation: '"Despite" indicates success even in unfavorable conditions.'
  },
  {
    id: 'B1-R3',
    level: 'B1',
    skill: 'reading',
    question: 'Read: "Unlike his brother, who was extroverted and sociable, Tom preferred spending quiet evenings at home with a book." How is Tom different from his brother?',
    options: [
      'Tom is more outgoing',
      'Tom is more introverted',
      'Tom doesn\'t like his brother',
      'Tom can\'t read'
    ],
    correctAnswer: 1,
    minReadTimeSeconds: 19,
    explanation: 'The contrast shows Tom is introverted (quiet, prefers being alone).'
  },

  // B1 Usage
  {
    id: 'B1-U1',
    level: 'B1',
    skill: 'usage',
    question: 'In a business email, which phrase is most appropriate to end with?',
    options: [
      'See you later',
      'I look forward to hearing from you',
      'Bye!',
      'Talk soon'
    ],
    correctAnswer: 1,
    minReadTimeSeconds: 14,
    explanation: 'This phrase is formal and professional for business communication.'
  },
  {
    id: 'B1-U2',
    level: 'B1',
    skill: 'usage',
    question: 'How would you politely disagree with someone\'s opinion?',
    options: [
      'You\'re wrong!',
      'That\'s stupid.',
      'I see your point, but I have a different perspective.',
      'No way!'
    ],
    correctAnswer: 2,
    minReadTimeSeconds: 15,
    explanation: 'Acknowledging their view first, then presenting yours is diplomatic.'
  },
  {
    id: 'B1-U3',
    level: 'B1',
    skill: 'usage',
    question: 'Which phrase shows you\'re actively listening in a conversation?',
    options: [
      'Whatever.',
      'I don\'t care.',
      'That\'s interesting, tell me more.',
      'Are you done yet?'
    ],
    correctAnswer: 2,
    minReadTimeSeconds: 14,
    explanation: 'This encourages continued conversation and shows engagement.'
  },

  // ==================== B2 LEVEL (UPPER INTERMEDIATE) ====================
  // B2 Grammar
  {
    id: 'B2-G1',
    level: 'B2',
    skill: 'grammar',
    question: 'Choose the sentence with the correct use of the subjunctive mood:',
    options: [
      'I suggest that she goes to the doctor.',
      'I suggest that she go to the doctor.',
      'I suggest that she will go to the doctor.',
      'I suggest that she is going to the doctor.'
    ],
    correctAnswer: 1,
    minReadTimeSeconds: 16,
    explanation: 'Subjunctive mood uses base form (go) after "suggest that".'
  },
  {
    id: 'B2-G2',
    level: 'B2',
    skill: 'grammar',
    question: 'Which sentence correctly uses "would rather"?',
    options: [
      'I would rather stay at home than going out.',
      'I would rather stay at home than go out.',
      'I would rather to stay at home than go out.',
      'I would rather staying at home than going out.'
    ],
    correctAnswer: 1,
    minReadTimeSeconds: 17,
    explanation: '"Would rather" is followed by base verb, then "than" + base verb.'
  },
  {
    id: 'B2-G3',
    level: 'B2',
    skill: 'grammar',
    question: 'Identify the correct use of inversion:',
    options: [
      'Rarely I have seen such a beautiful sunset.',
      'Rarely have I seen such a beautiful sunset.',
      'Rarely seen I have such a beautiful sunset.',
      'I rarely have seen such a beautiful sunset.'
    ],
    correctAnswer: 1,
    minReadTimeSeconds: 17,
    explanation: 'After negative adverbs (rarely), use auxiliary + subject inversion.'
  },

  // B2 Vocabulary
  {
    id: 'B2-V1',
    level: 'B2',
    skill: 'vocabulary',
    question: 'What does "meticulous" mean?',
    options: [
      'careless and hasty',
      'showing great attention to detail',
      'average and ordinary',
      'lazy and unmotivated'
    ],
    correctAnswer: 1,
    minReadTimeSeconds: 13,
    explanation: 'Meticulous describes extreme carefulness and precision.'
  },
  {
    id: 'B2-V2',
    level: 'B2',
    skill: 'vocabulary',
    question: 'Choose the correct collocation: "to ___ an advantage"',
    options: ['make', 'do', 'take', 'get'],
    correctAnswer: 2,
    minReadTimeSeconds: 12,
    explanation: 'The correct phrase is "take advantage" (use opportunity).'
  },
  {
    id: 'B2-V3',
    level: 'B2',
    skill: 'vocabulary',
    question: 'What does "ambiguous" mean?',
    options: [
      'very clear and obvious',
      'open to more than one interpretation',
      'completely wrong',
      'easy to understand'
    ],
    correctAnswer: 1,
    minReadTimeSeconds: 13,
    explanation: 'Ambiguous means unclear or having multiple possible meanings.'
  },

  // B2 Reading
  {
    id: 'B2-R1',
    level: 'B2',
    skill: 'reading',
    question: 'Read: "The unprecedented surge in renewable energy adoption has been attributed to both environmental concerns and economic incentives. However, critics argue that infrastructure limitations remain a significant impediment." What is the main point?',
    options: [
      'Renewable energy has no benefits',
      'Renewable energy growth is driven by multiple factors but faces challenges',
      'Critics support renewable energy',
      'Infrastructure is not important'
    ],
    correctAnswer: 1,
    minReadTimeSeconds: 25,
    explanation: 'The passage balances growth factors with remaining obstacles.'
  },
  {
    id: 'B2-R2',
    level: 'B2',
    skill: 'reading',
    question: 'Read: "While the correlation between education and economic prosperity is well-established, the causality remains contested among scholars." What does this statement suggest?',
    options: [
      'Education always causes prosperity',
      'There\'s a relationship, but the direction of influence is debated',
      'Education has no effect on prosperity',
      'Scholars agree on everything'
    ],
    correctAnswer: 1,
    minReadTimeSeconds: 23,
    explanation: 'Correlation exists, but whether education causes prosperity is disputed.'
  },
  {
    id: 'B2-R3',
    level: 'B2',
    skill: 'reading',
    question: 'Read: "The novel\'s ambiguous ending has sparked considerable debate, with some interpreting it as optimistic while others view it as profoundly pessimistic." What can we infer about the novel?',
    options: [
      'The ending is clearly happy',
      'The ending is clearly sad',
      'The ending allows for different interpretations',
      'Nobody liked the novel'
    ],
    correctAnswer: 2,
    minReadTimeSeconds: 22,
    explanation: '"Ambiguous" and "debate" indicate multiple valid interpretations exist.'
  },

  // B2 Usage
  {
    id: 'B2-U1',
    level: 'B2',
    skill: 'usage',
    question: 'In an academic essay, which transition word best shows contrast?',
    options: [
      'Furthermore',
      'Nevertheless',
      'Consequently',
      'Similarly'
    ],
    correctAnswer: 1,
    minReadTimeSeconds: 14,
    explanation: '"Nevertheless" introduces contrasting information or concession.'
  },
  {
    id: 'B2-U2',
    level: 'B2',
    skill: 'usage',
    question: 'Which phrase is most appropriate for presenting a balanced argument?',
    options: [
      'I think, maybe',
      'On one hand... on the other hand',
      'It\'s obvious that',
      'Everyone knows'
    ],
    correctAnswer: 1,
    minReadTimeSeconds: 16,
    explanation: 'This structure explicitly presents both sides of an argument.'
  },
  {
    id: 'B2-U3',
    level: 'B2',
    skill: 'usage',
    question: 'How would you tactfully deliver criticism in a professional setting?',
    options: [
      'This is terrible work.',
      'You always make mistakes.',
      'I appreciate your effort; perhaps we could consider an alternative approach.',
      'Why did you do it this way?'
    ],
    correctAnswer: 2,
    minReadTimeSeconds: 18,
    explanation: 'Acknowledging effort first, then suggesting improvements is tactful.'
  },

  // ==================== C1 LEVEL (ADVANCED) ====================
  // C1 Grammar
  {
    id: 'C1-G1',
    level: 'C1',
    skill: 'grammar',
    question: 'Choose the sentence with the most sophisticated structure:',
    options: [
      'The report was completed and it was submitted.',
      'The report, having been completed, was duly submitted.',
      'The report was done and then submitted.',
      'After the report finished, it was submitted.'
    ],
    correctAnswer: 1,
    minReadTimeSeconds: 18,
    explanation: 'Participle clause "having been completed" shows advanced grammar.'
  },
  {
    id: 'C1-G2',
    level: 'C1',
    skill: 'grammar',
    question: 'Identify the correct use of cleft sentence for emphasis:',
    options: [
      'I need help with this.',
      'What I need is help with this.',
      'I am needing help with this.',
      'This needs help from me.'
    ],
    correctAnswer: 1,
    minReadTimeSeconds: 16,
    explanation: 'Cleft sentence "What I need is..." emphasizes the object.'
  },
  {
    id: 'C1-G3',
    level: 'C1',
    skill: 'grammar',
    question: 'Which sentence demonstrates correct use of ellipsis?',
    options: [
      'She can speak French and I can speak it too.',
      'She can speak French and I can too.',
      'She can speak French and I can speak too.',
      'She can speak French and I too.'
    ],
    correctAnswer: 1,
    minReadTimeSeconds: 17,
    explanation: 'Ellipsis omits "speak French" while maintaining clarity.'
  },

  // C1 Vocabulary
  {
    id: 'C1-V1',
    level: 'C1',
    skill: 'vocabulary',
    question: 'What does "ubiquitous" mean?',
    options: [
      'very rare and hard to find',
      'present everywhere at once',
      'ancient and outdated',
      'expensive and luxurious'
    ],
    correctAnswer: 1,
    minReadTimeSeconds: 13,
    explanation: 'Ubiquitous means omnipresent or found everywhere.'
  },
  {
    id: 'C1-V2',
    level: 'C1',
    skill: 'vocabulary',
    question: 'Choose the most precise word: "The politician\'s speech was full of ___ language designed to avoid commitment."',
    options: ['unclear', 'equivocal', 'confusing', 'difficult'],
    correctAnswer: 1,
    minReadTimeSeconds: 18,
    explanation: 'Equivocal specifically means deliberately ambiguous or unclear.'
  },
  {
    id: 'C1-V3',
    level: 'C1',
    skill: 'vocabulary',
    question: 'What is the meaning of "paradigm shift"?',
    options: [
      'a small change',
      'a fundamental change in approach or underlying assumptions',
      'a temporary problem',
      'a minor adjustment'
    ],
    correctAnswer: 1,
    minReadTimeSeconds: 16,
    explanation: 'Paradigm shift refers to a revolutionary change in fundamental concepts.'
  },

  // C1 Reading
  {
    id: 'C1-R1',
    level: 'C1',
    skill: 'reading',
    question: 'Read: "The paradox inherent in attempting to quantify subjective experience lies not merely in the methodological challenges, but in the ontological assumptions underpinning such endeavors." What is the author\'s primary concern?',
    options: [
      'The difficulty of using numbers',
      'The fundamental philosophical problem of measuring subjective phenomena',
      'The cost of research',
      'The lack of qualified researchers'
    ],
    correctAnswer: 1,
    minReadTimeSeconds: 28,
    explanation: 'Author questions the philosophical basis (ontological) of measuring subjectivity.'
  },
  {
    id: 'C1-R2',
    level: 'C1',
    skill: 'reading',
    question: 'Read: "The proliferation of algorithmic decision-making systems necessitates a reconsideration of accountability frameworks, particularly when opacity precludes meaningful human oversight." What implication does the author make?',
    options: [
      'Algorithms are always bad',
      'Current accountability systems may be inadequate for AI systems',
      'Humans should never use algorithms',
      'Everything is fine as it is'
    ],
    correctAnswer: 1,
    minReadTimeSeconds: 27,
    explanation: '"Necessitates reconsideration" implies current frameworks are insufficient.'
  },
  {
    id: 'C1-R3',
    level: 'C1',
    skill: 'reading',
    question: 'Read: "While acknowledging the efficacy of the intervention, one must remain cognizant of potential confounding variables that may attenuate or amplify the observed effects." What is the author\'s stance?',
    options: [
      'The intervention definitely works',
      'The intervention is cautiously supported but other factors need consideration',
      'The intervention is completely ineffective',
      'The author has no opinion'
    ],
    correctAnswer: 1,
    minReadTimeSeconds: 26,
    explanation: 'Author balances acknowledgment with awareness of complicating factors.'
  },

  // C1 Usage
  {
    id: 'C1-U1',
    level: 'C1',
    skill: 'usage',
    question: 'In academic discourse, which phrase best introduces a nuanced critique?',
    options: [
      'This is wrong because',
      'While this framework offers valuable insights, it arguably overlooks',
      'I disagree with this',
      'The author doesn\'t know'
    ],
    correctAnswer: 1,
    minReadTimeSeconds: 19,
    explanation: 'This acknowledges merit while introducing substantive criticism diplomatically.'
  },
  {
    id: 'C1-U2',
    level: 'C1',
    skill: 'usage',
    question: 'Which phrase demonstrates appropriate hedging in scientific writing?',
    options: [
      'The data proves absolutely',
      'The findings suggest a potential correlation',
      'It\'s definitely true that',
      'Everyone knows that'
    ],
    correctAnswer: 1,
    minReadTimeSeconds: 17,
    explanation: '"Suggest" and "potential" appropriately qualify claims in academic context.'
  },
  {
    id: 'C1-U3',
    level: 'C1',
    skill: 'usage',
    question: 'In formal discourse, how would you signal a paradigm shift in your argument?',
    options: [
      'But wait, there\'s more!',
      'However, a fundamental reconsideration of these premises reveals',
      'And another thing',
      'Also, I think'
    ],
    correctAnswer: 1,
    minReadTimeSeconds: 20,
    explanation: 'This signals significant conceptual shift with appropriate formality.'
  }
];

// Helper function to get questions by level
export function getQuestionsByLevel(level: AssessmentQuestion['level']): AssessmentQuestion[] {
  return assessmentQuestions.filter(q => q.level === level);
}

// Helper function to get random questions for adaptive testing
export function getAdaptiveQuestions(
  currentLevel: AssessmentQuestion['level'],
  skill?: AssessmentQuestion['skill']
): AssessmentQuestion[] {
  let questions = assessmentQuestions.filter(q => q.level === currentLevel);

  if (skill) {
    questions = questions.filter(q => q.skill === skill);
  }

  // Shuffle and return 3 questions
  return questions.sort(() => Math.random() - 0.5).slice(0, 3);
}

// ==================== SPEAKING QUESTIONS ====================
// Speaking questions for pronunciation, fluency, and clarity assessment

export const speakingQuestions: AssessmentQuestion[] = [
  // A1 Speaking
  {
    id: 'A1-SP1',
    level: 'A1',
    skill: 'speaking',
    type: 'speaking',
    question: 'Read this sentence aloud clearly:',
    options: [],
    correctAnswer: 0,
    minReadTimeSeconds: 5,
    explanation: 'Speaking assessment - pronunciation and clarity',
    speakingPrompt: 'Hello, my name is John. I am a student.',
    speakingCriteria: {
      minDuration: 3,
      maxDuration: 10,
      expectedWords: ['hello', 'name', 'student']
    }
  },
  {
    id: 'A2-SP1',
    level: 'A2',
    skill: 'speaking',
    type: 'speaking',
    question: 'Read this sentence aloud clearly:',
    options: [],
    correctAnswer: 0,
    minReadTimeSeconds: 6,
    explanation: 'Speaking assessment - pronunciation and fluency',
    speakingPrompt: 'Yesterday I went to the park with my friends and we played football.',
    speakingCriteria: {
      minDuration: 4,
      maxDuration: 12,
      expectedWords: ['yesterday', 'park', 'friends', 'football']
    }
  },
  {
    id: 'B1-SP1',
    level: 'B1',
    skill: 'speaking',
    type: 'speaking',
    question: 'Read this passage aloud clearly:',
    options: [],
    correctAnswer: 0,
    minReadTimeSeconds: 8,
    explanation: 'Speaking assessment - natural intonation and pacing',
    speakingPrompt: 'Technology has transformed the way we communicate. Social media platforms allow us to connect with people across the globe instantly.',
    speakingCriteria: {
      minDuration: 6,
      maxDuration: 15,
      expectedWords: ['technology', 'communicate', 'social', 'media', 'connect']
    }
  },
  {
    id: 'B2-SP1',
    level: 'B2',
    skill: 'speaking',
    type: 'speaking',
    question: 'Read this passage aloud with proper intonation:',
    options: [],
    correctAnswer: 0,
    minReadTimeSeconds: 10,
    explanation: 'Speaking assessment - advanced pronunciation and expression',
    speakingPrompt: 'Climate change poses significant challenges to our planet. Scientists worldwide are collaborating to develop sustainable solutions that can mitigate its impact on future generations.',
    speakingCriteria: {
      minDuration: 8,
      maxDuration: 20,
      expectedWords: ['climate', 'challenges', 'scientists', 'sustainable', 'generations']
    }
  },
  {
    id: 'C1-SP1',
    level: 'C1',
    skill: 'speaking',
    type: 'speaking',
    question: 'Read this complex passage aloud with appropriate emphasis:',
    options: [],
    correctAnswer: 0,
    minReadTimeSeconds: 12,
    explanation: 'Speaking assessment - native-like fluency and nuance',
    speakingPrompt: 'The philosophical implications of artificial intelligence extend far beyond technological advancement, challenging our fundamental understanding of consciousness, creativity, and what it truly means to be human in an increasingly automated world.',
    speakingCriteria: {
      minDuration: 10,
      maxDuration: 25,
      expectedWords: ['philosophical', 'artificial', 'intelligence', 'consciousness', 'automated']
    }
  }
];
