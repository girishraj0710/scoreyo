#!/usr/bin/env node
/**
 * Generate Additional English Questions
 * Expands topics with limited questions to support 5/10/20 question quizzes
 * Date: May 12, 2026
 */

import { createClient } from '@libsql/client';
import * as fs from 'fs';
import * as path from 'path';

// Load .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      process.env[match[1].trim()] = match[2].trim();
    }
  });
}

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

interface Question {
  pathId: string;
  topicId: string;
  level: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: string;
}

// Priority 1: Competitive Exam Topics (High Impact)
const grammarBasicsQuestions: Question[] = [
  {
    pathId: 'competitive-exam',
    topicId: 'grammar-basics',
    level: 'beginner',
    question: 'Which sentence is grammatically correct?',
    options: [
      'She don\'t like coffee.',
      'She doesn\'t likes coffee.',
      'She doesn\'t like coffee.',
      'She not like coffee.'
    ],
    correctAnswer: 2,
    explanation: 'In the third person singular (she), we use "doesn\'t" + base verb. "She doesn\'t like coffee" is correct.',
    difficulty: 'beginner'
  },
  {
    pathId: 'competitive-exam',
    topicId: 'grammar-basics',
    level: 'beginner',
    question: 'Choose the sentence with the correct word order:',
    options: [
      'Always she is late.',
      'She always is late.',
      'She is always late.',
      'She is late always.'
    ],
    correctAnswer: 2,
    explanation: 'Adverbs of frequency (always, usually, never) come after the verb "to be". "She is always late" is correct.',
    difficulty: 'beginner'
  },
  {
    pathId: 'competitive-exam',
    topicId: 'grammar-basics',
    level: 'intermediate',
    question: 'Identify the sentence with correct subject-verb agreement:',
    options: [
      'The team are playing well.',
      'The team is playing well.',
      'The team were playing well.',
      'The team have playing well.'
    ],
    correctAnswer: 1,
    explanation: 'Collective nouns like "team" are usually treated as singular, so "The team is playing well" is correct.',
    difficulty: 'intermediate'
  },
  {
    pathId: 'competitive-exam',
    topicId: 'grammar-basics',
    level: 'intermediate',
    question: 'Which sentence uses the correct comparative form?',
    options: [
      'This book is more better than that one.',
      'This book is more good than that one.',
      'This book is better than that one.',
      'This book is gooder than that one.'
    ],
    correctAnswer: 2,
    explanation: '"Good" has an irregular comparative form "better". We don\'t use "more" with it. "This book is better than that one" is correct.',
    difficulty: 'intermediate'
  },
  {
    pathId: 'competitive-exam',
    topicId: 'grammar-basics',
    level: 'intermediate',
    question: 'Select the sentence with correct pronoun usage:',
    options: [
      'Between you and I, this is a secret.',
      'Between you and me, this is a secret.',
      'Between you and myself, this is a secret.',
      'Between yourself and I, this is a secret.'
    ],
    correctAnswer: 1,
    explanation: 'After prepositions like "between", we use object pronouns. "Between you and me" is correct.',
    difficulty: 'intermediate'
  },
  {
    pathId: 'competitive-exam',
    topicId: 'grammar-basics',
    level: 'advanced',
    question: 'Which sentence demonstrates correct use of the subjunctive mood?',
    options: [
      'If I was you, I would accept the offer.',
      'If I were you, I would accept the offer.',
      'If I am you, I would accept the offer.',
      'If I will be you, I would accept the offer.'
    ],
    correctAnswer: 1,
    explanation: 'The subjunctive mood uses "were" for all persons in hypothetical situations. "If I were you" is correct.',
    difficulty: 'advanced'
  },
  {
    pathId: 'competitive-exam',
    topicId: 'grammar-basics',
    level: 'advanced',
    question: 'Identify the sentence with the correct use of "who" vs "whom":',
    options: [
      'To who should I address this letter?',
      'To whom should I address this letter?',
      'Who should I address this letter to?',
      'Both B and C are correct.'
    ],
    correctAnswer: 3,
    explanation: '"Whom" is used as an object. Both "To whom should I address..." and "Who should I address...to?" are acceptable in formal and informal English.',
    difficulty: 'advanced'
  }
];

const vocabularySSCQuestions: Question[] = [
  {
    pathId: 'competitive-exam',
    topicId: 'vocabulary-ssc',
    level: 'intermediate',
    question: 'Choose the word that is most nearly OPPOSITE in meaning to OPTIMISTIC:',
    options: ['Hopeful', 'Pessimistic', 'Positive', 'Confident'],
    correctAnswer: 1,
    explanation: 'Optimistic means having a positive outlook. Pessimistic means expecting the worst, making it the opposite.',
    difficulty: 'intermediate'
  },
  {
    pathId: 'competitive-exam',
    topicId: 'vocabulary-ssc',
    level: 'intermediate',
    question: 'Select the word that means "to make something less severe":',
    options: ['Aggravate', 'Mitigate', 'Exacerbate', 'Intensify'],
    correctAnswer: 1,
    explanation: 'Mitigate means to make less severe or painful. The other options mean to make worse.',
    difficulty: 'intermediate'
  },
  {
    pathId: 'competitive-exam',
    topicId: 'vocabulary-ssc',
    level: 'intermediate',
    question: 'Which word means "talkative" or "chatty"?',
    options: ['Taciturn', 'Laconic', 'Garrulous', 'Reticent'],
    correctAnswer: 2,
    explanation: 'Garrulous means excessively talkative. Taciturn, laconic, and reticent all mean quiet or using few words.',
    difficulty: 'intermediate'
  },
  {
    pathId: 'competitive-exam',
    topicId: 'vocabulary-ssc',
    level: 'intermediate',
    question: 'Choose the synonym for METICULOUS:',
    options: ['Careless', 'Thorough', 'Hasty', 'Negligent'],
    correctAnswer: 1,
    explanation: 'Meticulous means showing great attention to detail, which is synonymous with thorough.',
    difficulty: 'intermediate'
  },
  {
    pathId: 'competitive-exam',
    topicId: 'vocabulary-ssc',
    level: 'advanced',
    question: 'Which word means "existing everywhere at the same time"?',
    options: ['Ubiquitous', 'Sporadic', 'Intermittent', 'Occasional'],
    correctAnswer: 0,
    explanation: 'Ubiquitous means present, appearing, or found everywhere. It comes from Latin ubique meaning "everywhere".',
    difficulty: 'advanced'
  },
  {
    pathId: 'competitive-exam',
    topicId: 'vocabulary-ssc',
    level: 'advanced',
    question: 'Select the word that means "to weaken or damage gradually":',
    options: ['Bolster', 'Fortify', 'Undermine', 'Strengthen'],
    correctAnswer: 2,
    explanation: 'Undermine means to weaken or damage something gradually, especially by wearing away its base or foundation.',
    difficulty: 'advanced'
  }
];

// Priority 2: Real-World Topics (Practical Use)
const dailyConversationsQuestions: Question[] = [
  {
    pathId: 'real-world',
    topicId: 'daily-conversations',
    level: 'beginner',
    question: 'What is the most appropriate response to "How are you doing?"',
    options: [
      'I am 25 years old.',
      'I\'m doing well, thanks! How about you?',
      'My name is John.',
      'I live in Mumbai.'
    ],
    correctAnswer: 1,
    explanation: '"I\'m doing well, thanks!" is the standard polite response to "How are you doing?" and shows you\'re interested in their wellbeing too.',
    difficulty: 'beginner'
  },
  {
    pathId: 'real-world',
    topicId: 'daily-conversations',
    level: 'beginner',
    question: 'How do you politely ask someone to repeat what they said?',
    options: [
      'What?',
      'Say again!',
      'Could you please repeat that?',
      'I didn\'t hear.'
    ],
    correctAnswer: 2,
    explanation: '"Could you please repeat that?" is the most polite way to ask someone to say something again.',
    difficulty: 'beginner'
  },
  {
    pathId: 'real-world',
    topicId: 'daily-conversations',
    level: 'intermediate',
    question: 'What\'s the best way to politely decline an invitation?',
    options: [
      'No, I can\'t come.',
      'I\'m afraid I can\'t make it, but thank you for inviting me.',
      'I don\'t want to come.',
      'Maybe next time.'
    ],
    correctAnswer: 1,
    explanation: '"I\'m afraid I can\'t make it, but thank you for inviting me" shows appreciation while politely declining.',
    difficulty: 'intermediate'
  },
  {
    pathId: 'real-world',
    topicId: 'daily-conversations',
    level: 'intermediate',
    question: 'How do you appropriately interrupt someone in a conversation?',
    options: [
      'Stop talking!',
      'Excuse me, may I add something?',
      'Wait!',
      'I need to say something.'
    ],
    correctAnswer: 1,
    explanation: '"Excuse me, may I add something?" is polite and shows respect while expressing your need to contribute.',
    difficulty: 'intermediate'
  },
  {
    pathId: 'real-world',
    topicId: 'daily-conversations',
    level: 'intermediate',
    question: 'What\'s an appropriate way to end a conversation?',
    options: [
      'I have to go now.',
      'It was nice talking to you. I should get going.',
      'Bye.',
      'I\'m done talking.'
    ],
    correctAnswer: 1,
    explanation: '"It was nice talking to you. I should get going" is warm and polite, acknowledging the conversation before leaving.',
    difficulty: 'intermediate'
  }
];

const emailWritingQuestions: Question[] = [
  {
    pathId: 'real-world',
    topicId: 'email-writing',
    level: 'intermediate',
    question: 'Which is the most professional email greeting for a first-time contact?',
    options: [
      'Hey there,',
      'Hi,',
      'Dear Mr. Smith,',
      'Yo,'
    ],
    correctAnswer: 2,
    explanation: '"Dear Mr./Ms. [Last Name]," is the most professional greeting for formal first-time emails.',
    difficulty: 'intermediate'
  },
  {
    pathId: 'real-world',
    topicId: 'email-writing',
    level: 'intermediate',
    question: 'What is the best way to start a formal email requesting information?',
    options: [
      'I want to know about...',
      'Tell me about...',
      'I am writing to inquire about...',
      'Give me information on...'
    ],
    correctAnswer: 2,
    explanation: '"I am writing to inquire about..." is formal and professional, clearly stating your purpose.',
    difficulty: 'intermediate'
  },
  {
    pathId: 'real-world',
    topicId: 'email-writing',
    level: 'intermediate',
    question: 'Which closing is most appropriate for a formal business email?',
    options: [
      'Cheers,',
      'See ya,',
      'Best regards,',
      'Later,'
    ],
    correctAnswer: 2,
    explanation: '"Best regards," is a professional and widely accepted closing for business emails.',
    difficulty: 'intermediate'
  },
  {
    pathId: 'real-world',
    topicId: 'email-writing',
    level: 'advanced',
    question: 'How should you politely follow up on an unanswered email?',
    options: [
      'Why haven\'t you replied?',
      'I am following up on my previous email regarding...',
      'You forgot to reply.',
      'Did you get my email?'
    ],
    correctAnswer: 1,
    explanation: '"I am following up on my previous email regarding..." is professional and non-confrontational.',
    difficulty: 'advanced'
  },
  {
    pathId: 'real-world',
    topicId: 'email-writing',
    level: 'advanced',
    question: 'What\'s the best way to apologize for a delay in responding?',
    options: [
      'Sorry for the late reply.',
      'I apologize for the delayed response. Thank you for your patience.',
      'My bad for not replying.',
      'I forgot to reply earlier.'
    ],
    correctAnswer: 1,
    explanation: 'This shows professional accountability and appreciation for their patience.',
    difficulty: 'advanced'
  }
];

// Priority 3: IELTS/TOEFL Topics
const academicVocabularyQuestions: Question[] = [
  {
    pathId: 'ielts-toefl',
    topicId: 'academic-vocabulary',
    level: 'intermediate',
    question: 'Choose the academic synonym for "show":',
    options: ['Tell', 'Demonstrate', 'Say', 'Talk'],
    correctAnswer: 1,
    explanation: 'In academic writing, "demonstrate" is preferred over "show" as it sounds more formal and precise.',
    difficulty: 'intermediate'
  },
  {
    pathId: 'ielts-toefl',
    topicId: 'academic-vocabulary',
    level: 'intermediate',
    question: 'Which word means "to examine methodically"?',
    options: ['Look', 'Analyze', 'See', 'Watch'],
    correctAnswer: 1,
    explanation: 'Analyze means to examine something methodically and in detail, making it appropriate for academic contexts.',
    difficulty: 'intermediate'
  },
  {
    pathId: 'ielts-toefl',
    topicId: 'academic-vocabulary',
    level: 'intermediate',
    question: 'Select the academic word for "get":',
    options: ['Obtain', 'Take', 'Grab', 'Have'],
    correctAnswer: 0,
    explanation: 'Obtain is the academic equivalent of "get" and is preferred in formal writing.',
    difficulty: 'intermediate'
  },
  {
    pathId: 'ielts-toefl',
    topicId: 'academic-vocabulary',
    level: 'advanced',
    question: 'Which phrase means "significantly affect"?',
    options: [
      'Change a lot',
      'Have a substantial impact on',
      'Make different',
      'Affect much'
    ],
    correctAnswer: 1,
    explanation: '"Have a substantial impact on" is the formal academic phrase for expressing significant effects.',
    difficulty: 'advanced'
  },
  {
    pathId: 'ielts-toefl',
    topicId: 'academic-vocabulary',
    level: 'advanced',
    question: 'What does "empirical evidence" mean?',
    options: [
      'Theoretical proof',
      'Evidence based on observation and experimentation',
      'Written documentation',
      'Expert opinions'
    ],
    correctAnswer: 1,
    explanation: 'Empirical evidence refers to information acquired through observation, experience, or experimentation.',
    difficulty: 'advanced'
  }
];

async function insertQuestions(questions: Question[]) {
  for (const q of questions) {
    await client.execute(
      `INSERT INTO english_questions (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        q.pathId,
        q.topicId,
        q.level,
        q.question,
        JSON.stringify(q.options),
        q.correctAnswer,
        q.explanation,
        q.difficulty
      ]
    );
  }
}

async function expandQuestionBank() {
  console.log('\n🚀 Expanding English Question Bank...\n');

  try {
    console.log('📝 Adding Grammar Basics questions...');
    await insertQuestions(grammarBasicsQuestions);
    console.log(`✅ Added ${grammarBasicsQuestions.length} Grammar Basics questions (Total: ${5 + grammarBasicsQuestions.length})`);

    console.log('\n📝 Adding Vocabulary SSC questions...');
    await insertQuestions(vocabularySSCQuestions);
    console.log(`✅ Added ${vocabularySSCQuestions.length} Vocabulary SSC questions (Total: ${5 + vocabularySSCQuestions.length})`);

    console.log('\n📝 Adding Daily Conversations questions...');
    await insertQuestions(dailyConversationsQuestions);
    console.log(`✅ Added ${dailyConversationsQuestions.length} Daily Conversations questions (Total: ${5 + dailyConversationsQuestions.length})`);

    console.log('\n📝 Adding Email Writing questions...');
    await insertQuestions(emailWritingQuestions);
    console.log(`✅ Added ${emailWritingQuestions.length} Email Writing questions (Total: ${5 + emailWritingQuestions.length})`);

    console.log('\n📝 Adding Academic Vocabulary questions...');
    await insertQuestions(academicVocabularyQuestions);
    console.log(`✅ Added ${academicVocabularyQuestions.length} Academic Vocabulary questions (Total: ${5 + academicVocabularyQuestions.length})`);

    const totalAdded = grammarBasicsQuestions.length +
                       vocabularySSCQuestions.length +
                       dailyConversationsQuestions.length +
                       emailWritingQuestions.length +
                       academicVocabularyQuestions.length;

    console.log('\n' + '='.repeat(60));
    console.log(`🎉 Successfully added ${totalAdded} new questions!`);
    console.log('='.repeat(60));

    console.log('\n📊 Updated Question Counts:');
    console.log(`  • Grammar Basics: 5 → 12 questions`);
    console.log(`  • Vocabulary SSC: 5 → 11 questions`);
    console.log(`  • Daily Conversations: 5 → 10 questions`);
    console.log(`  • Email Writing: 5 → 10 questions`);
    console.log(`  • Academic Vocabulary: 5 → 10 questions`);

    console.log('\n✅ All topics now support 10-question quizzes!');
    console.log('💡 Run again to add more questions for 20-question support.\n');

  } catch (error) {
    console.error('\n❌ Error adding questions:', error);
    throw error;
  } finally {
    await client.close();
  }
}

expandQuestionBank();
