-- Phase 2, Topic 4: "Do You...?" - Present Simple Questions
-- 30 questions (12 easy, 12 medium, 6 hard)
-- Pattern-based, beginner-friendly, Indian context

INSERT INTO english_questions (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty) VALUES

-- EASY QUESTIONS (12) - Basic question patterns
('foundation', 'present-simple-questions', 'beginner', '_____ you like coffee?', '["Do", "Does", "Are", "Is"]', 0, 'Pattern: Do + I/you/we/they + [base verb]? Use "Do" with you. Verb: like (no changes).', 'easy'),

('foundation', 'present-simple-questions', 'beginner', '_____ she work here?', '["Do", "Does", "Are", "Is"]', 1, 'Pattern: Does + he/she/it + [base verb]? Use "Does" with she. Verb: work (not works in questions).', 'easy'),

('foundation', 'present-simple-questions', 'beginner', '_____ they live in Mumbai?', '["Do", "Does", "Are", "Is"]', 0, 'Pattern: Do + they + [base verb]? Use "Do" with they. Verb: live (base form).', 'easy'),

('foundation', 'present-simple-questions', 'beginner', 'Do you _____ English?', '["speak", "speaks", "speaking", "spoke"]', 0, 'Pattern: Do + you + [base verb]? After Do/Does, verb is ALWAYS base form. Use "speak" (not "speaks").', 'easy'),

('foundation', 'present-simple-questions', 'beginner', 'Does he _____ cricket?', '["play", "plays", "playing", "played"]', 0, 'Pattern: Does + he + [base verb]? After Does, use base form. "Play" (not "plays") because "does" already shows third person.', 'easy'),

('foundation', 'present-simple-questions', 'beginner', '_____ it rain a lot here?', '["Do", "Does", "Is", "Are"]', 1, 'Pattern: Does + it + [base verb]? Use "Does" with it. Verb: rain (weather verb, base form).', 'easy'),

('foundation', 'present-simple-questions', 'beginner', 'Do we _____ time?', '["have", "has", "having", "had"]', 0, 'Pattern: Do + we + [base verb]? After Do, use base form. "Have" (not "has") - always base form in questions.', 'easy'),

('foundation', 'present-simple-questions', 'beginner', '_____ your brother work in IT?', '["Do", "Does", "Is", "Are"]', 1, 'Pattern: Does + [singular noun] + [base verb]? Your brother = he = use "Does". Verb: work (base).', 'easy'),

('foundation', 'present-simple-questions', 'beginner', 'Do they _____ this restaurant?', '["know", "knows", "knowing", "knew"]', 0, 'Pattern: Do + they + [base verb]? After Do, use base form. Know (not "knows").', 'easy'),

('foundation', 'present-simple-questions', 'beginner', '_____ the shop open on Sundays?', '["Do", "Does", "Is", "Are"]', 1, 'Pattern: Does + [singular noun] + [base verb]? The shop = it = use "Does". Action verb: open (Does it open?).', 'easy'),

('foundation', 'present-simple-questions', 'beginner', 'Do you _____ any questions?', '["have", "has", "having", "had"]', 0, 'Pattern: Do + you + [base verb]? After Do, use base form. Have (possession question).', 'easy'),

('foundation', 'present-simple-questions', 'beginner', 'Does she _____ tea or coffee?', '["prefer", "prefers", "preferring", "preferred"]', 0, 'Pattern: Does + she + [base verb]? After Does, use base form. Prefer (not "prefers").', 'easy'),

-- MEDIUM QUESTIONS (12) - Wh- questions and real contexts
('foundation', 'present-simple-questions', 'beginner', 'Arrange correctly: you / Where / live / do', '["Where do you live", "Where you do live", "Do you where live", "You where do live"]', 0, 'Pattern: Wh-word + do + subject + [base verb]? Order: Where (asking location) + do + you + live (no "s").', 'medium'),

('foundation', 'present-simple-questions', 'beginner', 'What is wrong? "Does they have a car?"', '["Use Do instead of Does", "Use Are instead of Does", "Use Is instead of Does", "Nothing wrong"]', 0, 'Pattern error: They = Do (not Does). Rule: Do with I/you/we/they. Correct: "Do they have a car?" Only he/she/it use Does.', 'medium'),

('foundation', 'present-simple-questions', 'beginner', 'Meeting someone new, you ask about their job:', '["What do you does?", "What you do?", "What do you do?", "What does you do?"]', 2, 'Pattern: What + do + you + do? Common question: "What do you do?" (= What is your job?). First "do" = question helper, second "do" = action verb.', 'medium'),

('foundation', 'present-simple-questions', 'beginner', 'Rearrange: does / train / leave / the / When', '["When does the train leave", "When the train does leave", "Does the train when leave", "When leave the train does"]', 0, 'Pattern: Wh-word + does + subject + [base verb]? Order: When + does + the train + leave (base form, not "leaves").', 'medium'),

('foundation', 'present-simple-questions', 'beginner', 'What is the error? "Do she speak English?"', '["Use Does instead of Do", "Use Is instead of Do", "Use Are instead of Do", "Nothing wrong"]', 0, 'Pattern error: She = Does (not Do). Correct: "Does she speak English?" He/She/It always use Does in questions.', 'medium'),

('foundation', 'present-simple-questions', 'beginner', 'At a shop, asking about price:', '["How much does this costs?", "How much this cost?", "How much does this cost?", "How much do this cost?"]', 2, 'Pattern: How much + does + this + [base verb]? This = singular = Does. Verb: cost (base form, not "costs"). Correct: "How much does this cost?"', 'medium'),

('foundation', 'present-simple-questions', 'beginner', 'Choose the correct question:', '["Where does you work?", "Where do you work?", "Where you work?", "Where are you work?"]', 1, 'Pattern: Where + do + you + [base verb]? Use Do with you. Correct: "Where do you work?" (not Does with you).', 'medium'),

('foundation', 'present-simple-questions', 'beginner', 'Arrange correctly: does / your / start / When / office', '["When does your office start", "When your office does start", "Does your office when start", "When start your office does"]', 0, 'Pattern: When + does + [singular noun] + [base verb]? Order: When + does + your office + start (base form).', 'medium'),

('foundation', 'present-simple-questions', 'beginner', 'What is wrong? "Do he likes cricket?"', '["Use Does instead of Do, and like instead of likes", "Use Is instead of Do", "Remove likes", "Nothing wrong"]', 0, 'Two errors! 1) He = Does (not Do). 2) After Does, base form (like, not "likes"). Correct: "Does he like cricket?" Pattern: Does + he + [base verb]?', 'medium'),

('foundation', 'present-simple-questions', 'beginner', 'Asking about someone''s daily routine:', '["What time does you wake up?", "What time you wake up?", "What time do you wake up?", "What time are you wake up?"]', 2, 'Pattern: What time + do + you + [base verb]? Use Do with you. Correct: "What time do you wake up?" Common daily routine question.', 'medium'),

('foundation', 'present-simple-questions', 'beginner', 'Rearrange: they / How / English / do / learn', '["How do they learn English", "How they do learn English", "Do they how learn English", "How learn they do English"]', 0, 'Pattern: How + do + they + [base verb] + [object]? Order: How + do + they + learn + English (what they learn).', 'medium'),

('foundation', 'present-simple-questions', 'beginner', 'Choose the natural question at a restaurant:', '["Does this dish contains meat?", "Do this dish contain meat?", "Does this dish contain meat?", "This dish contain meat?"]', 2, 'Pattern: Does + this + [base verb]? This dish = it = singular = Does. Verb: contain (base form, not "contains"). Correct: "Does this dish contain meat?"', 'medium'),

-- HARD QUESTIONS (6) - Yes/No short answers, question tags
('foundation', 'present-simple-questions', 'beginner', 'Someone asks: "Do you work here?" What is the correct short answer?', '["Yes, I work.", "Yes, I do.", "Yes, I am.", "Yes, I does."]', 1, 'Short answer pattern: Yes/No + subject + do/does. Match the question helper. "Do you...?" → "Yes, I do." (not "Yes, I work" - too long). Never use "am" or "does" with I.', 'hard'),

('foundation', 'present-simple-questions', 'beginner', 'Question: "Does she like coffee?" Correct short answer:', '["Yes, she likes.", "Yes, she do.", "Yes, she does.", "Yes, she is."]', 2, 'Short answer: Yes/No + subject + do/does. "Does she...?" → "Yes, she does." Match the question: Does → does in answer. Never "Yes, she likes" (wrong structure).', 'hard'),

('foundation', 'present-simple-questions', 'beginner', 'Arrange correctly: office / from / your / work / Do / you', '["Do you work from your office", "You do work from your office", "From your office do you work", "Work you do from your office"]', 0, 'Pattern: Do + you + [verb] + from + [place]? Standard yes/no question order: Do + subject + verb + location. Natural: "Do you work from your office?"', 'hard'),

('foundation', 'present-simple-questions', 'beginner', 'What is wrong? "Why does they come late?"', '["Use do instead of does", "Use are instead of does", "Use come instead of comes", "Nothing wrong"]', 0, 'Pattern error: They = do (not does). Correct: "Why do they come late?" Only he/she/it use does. The verb "come" is already correct (base form).', 'hard'),

('foundation', 'present-simple-questions', 'beginner', 'Which question is grammatically perfect?', '["Where does your parents live?", "Where do your parents live?", "Where does your parents lives?", "Where your parents do live?"]', 1, 'Pattern: Where + do + [plural noun] + [base verb]? Parents = two people = plural = do (not does). Verb: live (base). Correct: "Where do your parents live?"', 'hard'),

('foundation', 'present-simple-questions', 'beginner', 'Find the error: "Do you knows the answer?"', '["Use know instead of knows", "Use does instead of do", "Use are instead of do", "No error"]', 0, 'Pattern error: After Do/Does, verb is base form. Correct: "Do you know the answer?" Never "knows" after do. Do + you + know (base form).', 'hard');

-- Verify insertion
SELECT COUNT(*) as total_inserted FROM english_questions WHERE topic_id = 'present-simple-questions';
