-- Phase 2, Topic 2: "He Works, She Studies" - Present Simple Third Person (He/She/It)
-- 30 questions (12 easy, 12 medium, 6 hard)
-- Pattern-based, beginner-friendly, Indian context

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

-- Verify insertion
SELECT COUNT(*) as total_inserted FROM english_questions WHERE topic_id = 'present-simple-third-person';
