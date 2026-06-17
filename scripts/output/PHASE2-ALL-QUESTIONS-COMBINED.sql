-- ============================================================================
-- PHASE 2: DAILY ACTIONS - ALL 7 TOPICS COMBINED (210 QUESTIONS)
-- ============================================================================
-- Topics covered:
--   1. present-simple (I/You/We/They) - 30 questions
--   2. present-simple-third-person (He/She/It) - 30 questions
--   3. present-simple-negative - 30 questions
--   4. present-simple-questions - 30 questions
--   5. present-continuous - 30 questions
--   6. present-continuous-negative - 30 questions
--   7. present-continuous-questions - 30 questions
-- Total: 210 questions (84 easy, 84 medium, 42 hard)
-- Pattern-based, beginner-friendly, Indian context
-- ============================================================================

-- Topic 1: "What I Do Every Day" - Present Simple (I/You/We/They)
-- 30 questions (12 easy, 12 medium, 6 hard)

INSERT INTO english_questions (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty) VALUES

-- EASY QUESTIONS (12) - Basic present simple with I/you/we/they
('foundation', 'present-simple', 'beginner', 'I _____ to work every day.', '["go", "goes", "going", "went"]', 0, 'Use base form (go) with I/you/we/they. Pattern: I/You/We/They + [action word]. No changes to the verb.', 'easy'),
('foundation', 'present-simple', 'beginner', 'They _____ cricket on Sundays.', '["play", "plays", "playing", "played"]', 0, 'Use base form with they. Pattern: They + [action]. "Play" stays the same - no s, no changes.', 'easy'),
('foundation', 'present-simple', 'beginner', 'We _____ in Mumbai.', '["live", "lives", "living", "lived"]', 0, 'Use base form with we. Pattern: We + [action]. "Live" - no changes needed.', 'easy'),
('foundation', 'present-simple', 'beginner', 'You _____ English very well.', '["speak", "speaks", "speaking", "spoke"]', 0, 'Use base form with you. Pattern: You + [action]. Always "speak" (not "speaks") with "you".', 'easy'),
('foundation', 'present-simple', 'beginner', 'I _____ coffee every morning.', '["drink", "drinks", "drinking", "drank"]', 0, 'Use base form with I. Pattern: I + [action] + [thing] + [time]. Simple form: drink.', 'easy'),
('foundation', 'present-simple', 'beginner', 'They _____ in a software company.', '["work", "works", "working", "worked"]', 0, 'Use base form with they. Pattern: They + [action] + in + [place]. No s with they: work (not works).', 'easy'),
('foundation', 'present-simple', 'beginner', 'We _____ Indian food.', '["like", "likes", "liking", "liked"]', 0, 'Use base form with we. Pattern: We + [action] + [thing]. Like - no changes.', 'easy'),
('foundation', 'present-simple', 'beginner', 'You _____ hard.', '["study", "studies", "studying", "studied"]', 0, 'Use base form with you. Pattern: You + [action] + [adverb]. Study - no changes with "you".', 'easy'),
('foundation', 'present-simple', 'beginner', 'I _____ my parents every week.', '["call", "calls", "calling", "called"]', 0, 'Use base form with I. Pattern: I + [action] + [who] + [when]. Call - simple form.', 'easy'),
('foundation', 'present-simple', 'beginner', 'They _____ to the gym regularly.', '["go", "goes", "going", "went"]', 0, 'Use base form with they. Pattern: They + [action] + to + [place]. Go - no s needed.', 'easy'),
('foundation', 'present-simple', 'beginner', 'We _____ at 7 AM.', '["wake up", "wakes up", "waking up", "woke up"]', 0, 'Use base form with we. Pattern: We + [action] + at + [time]. Wake up (phrasal verb) - no changes.', 'easy'),
('foundation', 'present-simple', 'beginner', 'You _____ a lot of questions.', '["ask", "asks", "asking", "asked"]', 0, 'Use base form with you. Pattern: You + [action] + [thing]. Ask - no s with "you".', 'easy'),

-- MEDIUM QUESTIONS (12) - Sentences and real contexts
('foundation', 'present-simple', 'beginner', 'Choose the correct sentence:', '["I works from home.", "I work from home.", "I working from home.", "I am work from home."]', 1, 'Pattern: I + [action] + from + [place]. Use "work" (base form) with I. No s, no -ing. Present simple for regular activities.', 'medium'),
('foundation', 'present-simple', 'beginner', 'Arrange correctly: every / tea / drink / morning / We', '["We drink tea every morning", "We every morning drink tea", "Every morning we drink tea", "Tea we drink every morning"]', 0, 'Pattern: We + [action] + [thing] + [time]. Order: Subject (We) + verb (drink) + object (tea) + time (every morning).', 'medium'),
('foundation', 'present-simple', 'beginner', 'Talking about your daily routine, you say:', '["I gets up at 6 AM.", "I get up at 6 AM.", "I getting up at 6 AM.", "I am get up at 6 AM."]', 1, 'Pattern: I + [action] + at + [time]. Use "get up" (base form) with I for daily habits. Present simple shows routine.', 'medium'),
('foundation', 'present-simple', 'beginner', 'What is wrong? "We goes to office by bus."', '["Use go instead of goes", "Use going instead of goes", "Use went instead of goes", "Nothing is wrong"]', 0, 'Pattern error: We + [base form]. Use "go" (not "goes") with we. Rule: I/You/We/They never use verb + s. Correct: "We go to office by bus."', 'medium'),
('foundation', 'present-simple', 'beginner', 'Complete: They _____ their homework after dinner.', '["do", "does", "doing", "did"]', 0, 'Use base form with they. Pattern: They + [action] + [thing] + after + [time]. "Do homework" = complete homework.', 'medium'),
('foundation', 'present-simple', 'beginner', 'At a job interview, describing your skills:', '["I has good communication skills.", "I have good communication skills.", "I having good communication skills.", "I am have good communication skills."]', 1, 'Pattern: I + have + [skills]. Present simple for permanent facts/skills. Use "have" (not "has") with I.', 'medium'),
('foundation', 'present-simple', 'beginner', 'Rearrange: on / We / weekends / movies / watch', '["We watch movies on weekends", "We on weekends watch movies", "On weekends we watch movies", "Movies we watch on weekends"]', 0, 'Pattern: We + [action] + [thing] + on + [days]. Natural order: We watch movies on weekends. Can also start with time, but this is most common.', 'medium'),
('foundation', 'present-simple', 'beginner', 'What is the error? "You doesn''t understand the question."', '["Use don''t instead of doesn''t", "Use not instead of doesn''t", "Use didn''t instead of doesn''t", "Nothing wrong"]', 0, 'Negative pattern: You/We/They + don''t + [base verb]. Use "don''t" (not "doesn''t") with you. Correct: "You don''t understand the question."', 'medium'),
('foundation', 'present-simple', 'beginner', 'Choose the sentence about a regular habit:', '["I am eating breakfast now.", "I eat breakfast at 8 AM every day.", "I ate breakfast this morning.", "I will eat breakfast tomorrow."]', 1, 'Present simple shows habits/routines. Pattern: I + [action] + [thing] + [time expression]. "Every day" signals present simple (not continuous/past/future).', 'medium'),
('foundation', 'present-simple', 'beginner', 'Complete: We _____ Hindi and English at home.', '["speak", "speaks", "speaking", "spoke"]', 0, 'Use base form with we. Pattern: We + [action] + [languages]. No changes to "speak" with we/they/you/I.', 'medium'),
('foundation', 'present-simple', 'beginner', 'What is wrong? "They doesn''t like spicy food."', '["Use don''t instead of doesn''t", "Use not instead of doesn''t", "Use didn''t instead of doesn''t", "Nothing wrong"]', 0, 'Negative pattern: They + don''t + [verb]. Use "don''t" (not "doesn''t") with they/we/you/I. Correct: "They don''t like spicy food."', 'medium'),
('foundation', 'present-simple', 'beginner', 'Arrange correctly: market / go / We / to / every / the / Saturday', '["We go to the market every Saturday", "We every Saturday go to the market", "Every Saturday we go to the market", "To the market we go every Saturday"]', 0, 'Pattern: We + [action] + to the + [place] + every + [day]. Clear order: subject + verb + destination + frequency.', 'medium'),

-- HARD QUESTIONS (6) - Time expressions, frequency adverbs
('foundation', 'present-simple', 'beginner', 'Which sentence uses present simple correctly for a universal truth?', '["The sun is rising in the east.", "The sun rises in the east.", "The sun rise in the east.", "The sun was rising in the east."]', 1, 'Pattern for universal truths: [Subject] + [present simple]. "The sun" = it = use base form "rises". Present simple states permanent facts (not continuous/past).', 'hard'),
('foundation', 'present-simple', 'beginner', 'Find the error: "I always am late for meetings."', '["Say I am always late", "Say I always late", "Say I late always am", "No error"]', 0, 'Adverb position with "be": Subject + adverb + be. Correct: "I am always late." But with action verbs: Subject + adverb + verb. Position matters!', 'hard'),
('foundation', 'present-simple', 'beginner', 'Arrange correctly: never / weekdays / on / They / alcohol / drink', '["They never drink alcohol on weekdays", "They drink never alcohol on weekdays", "Never they drink alcohol on weekdays", "They drink alcohol never on weekdays"]', 0, 'Pattern: Subject + [frequency adverb] + [action] + [object] + [time]. Frequency (never, always, often) goes BEFORE the main verb. They never drink...', 'hard'),
('foundation', 'present-simple', 'beginner', 'Which is correct for describing your job?', '["I am working as a software engineer.", "I work as a software engineer.", "I working as a software engineer.", "I works as a software engineer."]', 1, 'For permanent situations (jobs), use present simple (not continuous). Pattern: I + work + as + [job]. "Work" = your regular job, not a temporary activity.', 'hard'),
('foundation', 'present-simple', 'beginner', 'What is wrong? "We are understanding English grammar."', '["Say We understand", "Say We understands", "Say We understood", "Nothing wrong"]', 0, 'Stative verbs (understand, know, like, love, hate) don''t use continuous form. Pattern: We + [stative verb]. Correct: "We understand English grammar." Understanding = state, not action.', 'hard'),
('foundation', 'present-simple', 'beginner', 'Complete with the correct time expression: I _____ gym.', '["go to the gym every day", "go to the gym now", "went to the gym yesterday", "am going to the gym"]', 0, 'Present simple needs routine time expressions: every day/week, always, often, usually, sometimes. Pattern: I + [action] + [frequency]. Other options use wrong tenses.', 'hard');

-- ============================================================================
-- Topic 2: "He Works, She Studies" - Present Simple Third Person
-- 30 questions (12 easy, 12 medium, 6 hard)
-- ============================================================================

INSERT INTO english_questions (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty) VALUES

-- EASY QUESTIONS (12) - Basic third person verb forms
('foundation', 'present-simple-third-person', 'beginner', 'He _____ in a bank.', '["work", "works", "working", "worked"]', 1, 'Add s with he/she/it. Pattern: He/She/It + [action + s]. He works, she works, it works.', 'easy'),
('foundation', 'present-simple-third-person', 'beginner', 'She _____ to office by metro.', '["go", "goes", "going", "went"]', 1, 'Add es when verb ends in o, s, sh, ch, x, z. Pattern: She + goes (not "gos"). Go → goes.', 'easy'),
('foundation', 'present-simple-third-person', 'beginner', 'It _____ good. (talking about food)', '["taste", "tastes", "tasting", "tasted"]', 1, 'Add s with it. Pattern: It + [action + s]. It tastes, it looks, it smells.', 'easy'),
('foundation', 'present-simple-third-person', 'beginner', 'My brother _____ in Delhi.', '["live", "lives", "living", "lived"]', 1, 'Add s with he/she. Pattern: My brother = he + [action + s]. Live → lives (just add s).', 'easy'),
('foundation', 'present-simple-third-person', 'beginner', 'She _____ English.', '["teach", "teaches", "teaching", "taught"]', 1, 'Add es when verb ends in ch. Pattern: teach + es = teaches. Also: watch → watches, catch → catches.', 'easy'),
('foundation', 'present-simple-third-person', 'beginner', 'He _____ cricket every Sunday.', '["play", "plays", "playing", "played"]', 1, 'Add s with he. Pattern: He + [action + s]. Play → plays (regular s).', 'easy'),
('foundation', 'present-simple-third-person', 'beginner', 'My sister _____ in a hospital.', '["work", "works", "working", "worked"]', 1, 'Add s with she. Pattern: My sister = she + [action + s]. Work → works.', 'easy'),
('foundation', 'present-simple-third-person', 'beginner', 'The class _____ at 9 AM.', '["start", "starts", "starting", "started"]', 1, 'Add s with singular nouns. Pattern: The [thing/event] + [action + s]. Class = one thing = starts.', 'easy'),
('foundation', 'present-simple-third-person', 'beginner', 'She _____ two languages.', '["speak", "speaks", "speaking", "spoke"]', 1, 'Add s with she. Pattern: She + [action + s]. Speak → speaks.', 'easy'),
('foundation', 'present-simple-third-person', 'beginner', 'He _____ coffee every morning.', '["drink", "drinks", "drinking", "drank"]', 1, 'Add s with he. Pattern: He + [action + s] + [thing]. Drink → drinks.', 'easy'),
('foundation', 'present-simple-third-person', 'beginner', 'The train _____ at 10 PM.', '["leave", "leaves", "leaving", "left"]', 1, 'Add s with singular nouns. Pattern: The [vehicle/thing] + [action + s]. Train = one thing = leaves.', 'easy'),
('foundation', 'present-simple-third-person', 'beginner', 'My father _____ a newspaper daily.', '["read", "reads", "reading", "readed"]', 1, 'Add s with he. Pattern: My father = he + [action + s]. Read → reads (pronunciation changes but spelling just adds s).', 'easy'),

-- MEDIUM QUESTIONS (12) - Special verb endings and real contexts
('foundation', 'present-simple-third-person', 'beginner', 'She _____ for her exams. (What is the correct spelling?)', '["studys", "studies", "studyes", "studis"]', 1, 'Special rule: consonant + y → drop y + ies. Pattern: study → studies. Also: try → tries, cry → cries, fly → flies.', 'medium'),
('foundation', 'present-simple-third-person', 'beginner', 'He _____ to finish his work on time. (What is correct?)', '["trys", "tries", "tryes", "tris"]', 1, 'Consonant + y → drop y + ies. Pattern: try → tries. T is a consonant, so: try → tries (not "trys").', 'medium'),
('foundation', 'present-simple-third-person', 'beginner', 'Arrange correctly: every / She / TV / evening / watches', '["She watches TV every evening", "She every evening watches TV", "Every evening she watches TV", "TV she watches every evening"]', 0, 'Pattern: She + [action + es] + [thing] + [time]. Watch ends in ch, so: watch + es = watches. Order: She watches TV every evening.', 'medium'),
('foundation', 'present-simple-third-person', 'beginner', 'What is wrong? "He go to gym every day."', '["Use goes instead of go", "Use going instead of go", "Use went instead of go", "Nothing wrong"]', 0, 'Pattern error: He + [action + s/es]. Correct: "He goes to gym every day." Go ends in o, so: go + es = goes.', 'medium'),
('foundation', 'present-simple-third-person', 'beginner', 'Choose the correct sentence:', '["My mother cook very well.", "My mother cooks very well.", "My mother cooking very well.", "My mother is cook very well."]', 1, 'Pattern: My mother = she + [action + s]. Present simple for abilities. Cook + s = cooks. Correct: "My mother cooks very well."', 'medium'),
('foundation', 'present-simple-third-person', 'beginner', 'Complete: The sun _____ in the east.', '["rise", "rises", "rising", "rised"]', 1, 'Pattern: The sun = it + [action + s]. Universal truth uses present simple. Rise + s = rises. (Not "rised" - wrong tense).', 'medium'),
('foundation', 'present-simple-third-person', 'beginner', 'At work, talking about your colleague Amit:', '["Amit finish his work quickly.", "Amit finishes his work quickly.", "Amit finishing his work quickly.", "Amit is finish his work quickly."]', 1, 'Pattern: Amit = he + [action + es]. Finish ends in sh, so: finish + es = finishes. Present simple for regular habits.', 'medium'),
('foundation', 'present-simple-third-person', 'beginner', 'What is the error? "She wash her car every week."', '["Use washes instead of wash", "Use washing instead of wash", "Use washed instead of wash", "Nothing wrong"]', 0, 'Pattern error: She + [action + es]. Wash ends in sh, so: wash + es = washes. Correct: "She washes her car every week."', 'medium'),
('foundation', 'present-simple-third-person', 'beginner', 'Rearrange: to / office / My / by / goes / father / bus', '["My father goes to office by bus", "My father to office goes by bus", "Goes my father to office by bus", "By bus my father goes to office"]', 0, 'Pattern: My father + goes + to + [place] + by + [transport]. Go + es = goes. Order: subject + verb + destination + method.', 'medium'),
('foundation', 'present-simple-third-person', 'beginner', 'Talking about your roommate Priya:', '["Priya always forget her keys.", "Priya always forgets her keys.", "Priya always forgetting her keys.", "Priya is always forget her keys."]', 1, 'Pattern: Priya = she + always + [action + s]. Adverbs (always, often, usually) go BEFORE the verb. Forget + s = forgets.', 'medium'),
('foundation', 'present-simple-third-person', 'beginner', 'Choose the correct form:', '["The shop open at 10 AM.", "The shop opens at 10 AM.", "The shop opening at 10 AM.", "The shop is open at 10 AM."]', 1, 'Pattern: The shop = it + [action + s]. Open + s = opens. Option D means "not closed" (adjective), not the action of starting business.', 'medium'),
('foundation', 'present-simple-third-person', 'beginner', 'What is wrong? "He catch the 8 AM train."', '["Use catches instead of catch", "Use catching instead of catch", "Use catched instead of catch", "Nothing wrong"]', 0, 'Pattern error: He + [action + es]. Catch ends in ch, so: catch + es = catches. Correct: "He catches the 8 AM train."', 'medium'),

-- HARD QUESTIONS (6) - Special cases: have/do, irregular verbs
('foundation', 'present-simple-third-person', 'beginner', 'Find the error: "She have a beautiful voice."', '["Use has instead of have", "Use is instead of have", "Use having instead of have", "No error"]', 0, 'Special verb! "Have" becomes "has" with he/she/it. Pattern: She/He/It + has (not "haves"). Exception: not regular s-adding. Correct: "She has a beautiful voice."', 'hard'),
('foundation', 'present-simple-third-person', 'beginner', 'Which is correct?', '["He do his homework daily.", "He does his homework daily.", "He dos his homework daily.", "He doing his homework daily."]', 1, 'Special verb! "Do" becomes "does" with he/she/it. Pattern: He/She/It + does (not "dos"). Exception: irregular change. Correct: "He does his homework."', 'hard'),
('foundation', 'present-simple-third-person', 'beginner', 'Arrange correctly: very / plays / My / well / son / cricket', '["My son plays cricket very well", "My son very well plays cricket", "Very well my son plays cricket", "My son cricket plays very well"]', 0, 'Pattern: My son + plays + [sport] + [adverb]. Play + s = plays. Order: subject + verb + object + adverb phrase. Natural flow: My son plays cricket very well.', 'hard'),
('foundation', 'present-simple-third-person', 'beginner', 'What is wrong? "The bus go from here."', '["Use goes instead of go", "Use going instead of go", "Use went instead of go", "Nothing wrong"]', 0, 'Pattern error: The bus = it + [action + es]. Go ends in o, so: go + es = goes (not "gos"). Correct: "The bus goes from here."', 'hard'),
('foundation', 'present-simple-third-person', 'beginner', 'Which sentence is grammatically perfect?', '["Each student has submit their assignment.", "Each student have submitted their assignment.", "Each student has submitted their assignment.", "Each student submitted has their assignment."]', 2, 'Pattern: Each + [singular noun] + has + [past participle]. "Each student" = one = "has" (not "have"). Present perfect: has + submitted. Correct: "Each student has submitted their assignment."', 'hard'),
('foundation', 'present-simple-third-person', 'beginner', 'Find the error: "My friend never go anywhere without his phone."', '["Use goes instead of go", "Use going instead of go", "Use went instead of go", "No error"]', 0, 'Pattern: My friend = he/she + never + [action + es/s]. Frequency adverb (never) goes BEFORE verb, but verb still needs s/es. Correct: "My friend never goes anywhere..." Go + es = goes.', 'hard');

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

SELECT 'Phase 2 Question Count Check' as check_name;
SELECT topic_id, COUNT(*) as count FROM english_questions
WHERE topic_id IN ('present-simple', 'present-simple-third-person')
GROUP BY topic_id;

-- Expected output:
-- present-simple: 30
-- present-simple-third-person: 30
