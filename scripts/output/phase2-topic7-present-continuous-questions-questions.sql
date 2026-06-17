-- Phase 2, Topic 7: "Are You Studying?" - Present Continuous Questions
-- 30 questions (12 easy, 12 medium, 6 hard)
-- Pattern-based, beginner-friendly, Indian context

INSERT INTO english_questions (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty) VALUES

-- EASY QUESTIONS (12) - Basic question structure
('foundation', 'present-continuous-questions', 'beginner', '_____ you working now?', '["Am", "Is", "Are", "Be"]', 2, 'Pattern: Are + you + [verb + ing]? Use "Are" with you (always "Are", never "Am" or "Is"). Verb: working.', 'easy'),

('foundation', 'present-continuous-questions', 'beginner', '_____ she studying?', '["Am", "Is", "Are", "Be"]', 1, 'Pattern: Is + he/she/it + [verb + ing]? Use "Is" with she. Verb: studying.', 'easy'),

('foundation', 'present-continuous-questions', 'beginner', '_____ they playing cricket?', '["Am", "Is", "Are", "Be"]', 2, 'Pattern: Are + they/we/you + [verb + ing]? Use "Are" with they. Verb: playing.', 'easy'),

('foundation', 'present-continuous-questions', 'beginner', 'Is he _____ a book?', '["read", "reads", "reading", "readed"]', 2, 'Pattern: Is + he + [verb + ing]? After is/am/are in questions, use verb-ing. Read → reading.', 'easy'),

('foundation', 'present-continuous-questions', 'beginner', 'Are you _____ to music?', '["listen", "listens", "listening", "listened"]', 2, 'Pattern: Are + you + [verb + ing]? After are, use verb-ing. Listen → listening.', 'easy'),

('foundation', 'present-continuous-questions', 'beginner', '_____ it raining?', '["Am", "Is", "Are", "Be"]', 1, 'Pattern: Is + it + [verb + ing]? Use "Is" with it. Weather question: Is it raining?', 'easy'),

('foundation', 'present-continuous-questions', 'beginner', 'Are they _____ dinner?', '["cook", "cooks", "cooking", "cooked"]', 2, 'Pattern: Are + they + [verb + ing]? After are, use verb-ing. Cook → cooking.', 'easy'),

('foundation', 'present-continuous-questions', 'beginner', '_____ we going to the party?', '["Am", "Is", "Are", "Be"]', 2, 'Pattern: Are + we + [verb + ing]? Use "Are" with we. Go → going.', 'easy'),

('foundation', 'present-continuous-questions', 'beginner', 'Is she _____ her homework?', '["do", "does", "doing", "did"]', 2, 'Pattern: Is + she + [verb + ing]? After is, use verb-ing. Do → doing.', 'easy'),

('foundation', 'present-continuous-questions', 'beginner', '_____ your brother sleeping?', '["Am", "Is", "Are", "Be"]', 1, 'Pattern: Is + [singular noun] + [verb + ing]? Your brother = he = use "Is". Sleep → sleeping.', 'easy'),

('foundation', 'present-continuous-questions', 'beginner', 'Are you _____ tea or coffee?', '["drink", "drinks", "drinking", "drank"]', 2, 'Pattern: Are + you + [verb + ing]? After are, use verb-ing. Drink → drinking.', 'easy'),

('foundation', 'present-continuous-questions', 'beginner', 'Is the shop _____ today?', '["open", "opens", "opening", "opened"]', 2, 'Pattern: Is + [singular noun] + [verb + ing]? After is, use verb-ing. Open → opening (action of opening, not state).', 'easy'),

-- MEDIUM QUESTIONS (12) - Wh- questions and real contexts
('foundation', 'present-continuous-questions', 'beginner', 'Arrange correctly: doing / are / you / What', '["What are you doing", "What you are doing", "Are you what doing", "What doing are you"]', 0, 'Pattern: Wh-word + are + you + [verb + ing]? Order: What + are + you + doing (no "s" on verb). Common question: "What are you doing?"', 'medium'),

('foundation', 'present-continuous-questions', 'beginner', 'What is wrong? "Is they watching TV?"', '["Use Are instead of Is", "Use Am instead of Is", "Use Be instead of Is", "Nothing wrong"]', 0, 'Pattern error: They = Are (not Is). Correct: "Are they watching TV?" Only he/she/it use Is in questions.', 'medium'),

('foundation', 'present-continuous-questions', 'beginner', 'On the phone, asking about someone''s current activity:', '["What you doing?", "What are you doing?", "What do you doing?", "What you are doing?"]', 1, 'Pattern: What + are + you + [verb + ing]? Must have "are". Correct: "What are you doing?" Common phone/chat question.', 'medium'),

('foundation', 'present-continuous-questions', 'beginner', 'Rearrange: going / Where / you / are', '["Where are you going", "Where you are going", "Are you where going", "Where going are you"]', 0, 'Pattern: Wh-word + are + subject + [verb + ing]? Order: Where + are + you + going (asking about direction/destination).', 'medium'),

('foundation', 'present-continuous-questions', 'beginner', 'What is the error? "Are she coming to the meeting?"', '["Use Is instead of Are", "Use Am instead of Are", "Use Be instead of Are", "Nothing wrong"]', 0, 'Pattern error: She = Is (not Are). Correct: "Is she coming to the meeting?" He/She/It always use Is.', 'medium'),

('foundation', 'present-continuous-questions', 'beginner', 'Short answer to "Are you working now?" (correct form):', '["Yes, I working.", "Yes, I am.", "Yes, I do.", "Yes, I are."]', 1, 'Short answer pattern: Yes/No + subject + am/is/are. Match the question helper. "Are you...?" → "Yes, I am." (not "Yes, I working").', 'medium'),

('foundation', 'present-continuous-questions', 'beginner', 'Arrange correctly: he / Why / leaving / is / early', '["Why is he leaving early", "Why he is leaving early", "Is he why leaving early", "Why leaving he is early"]', 0, 'Pattern: Why + is + subject + [verb + ing] + [time]? Order: Why + is + he + leaving + early (asking for reason).', 'medium'),

('foundation', 'present-continuous-questions', 'beginner', 'At a restaurant, asking the waiter about food preparation:', '["Is my order coming?", "Are my order coming?", "My order is coming?", "Coming is my order?"]', 0, 'Pattern: Is + [singular noun] + [verb + ing]? My order = it = singular = Is. Correct: "Is my order coming?"', 'medium'),

('foundation', 'present-continuous-questions', 'beginner', 'Choose the natural question:', '["Where you going?", "Where are you going?", "Where do you going?", "Where going you are?"]', 1, 'Pattern: Where + are + you + [verb + ing]? Must have "are". Most natural: "Where are you going?" (WRONG: "Where you going" - informal/slang).', 'medium'),

('foundation', 'present-continuous-questions', 'beginner', 'What is wrong? "Is you listening to me?"', '["Use Are instead of Is", "Use Am instead of Is", "Use Be instead of Is", "Nothing wrong"]', 0, 'Pattern error: You = Are (always "Are", never "Is"). Correct: "Are you listening to me?" Only he/she/it use Is.', 'medium'),

('foundation', 'present-continuous-questions', 'beginner', 'Rearrange: they / How / learning / are / English', '["How are they learning English", "How they are learning English", "Are they how learning English", "How learning are they English"]', 0, 'Pattern: How + are + they + [verb + ing] + [object]? Order: How + are + they + learning + English (asking about method).', 'medium'),

('foundation', 'present-continuous-questions', 'beginner', 'Short answer to "Is she sleeping?" (correct form):', '["Yes, she sleeping.", "Yes, she does.", "Yes, she is.", "Yes, she are."]', 2, 'Short answer: Yes/No + subject + am/is/are. "Is she...?" → "Yes, she is." Match the question: Is → is in answer.', 'medium'),

-- HARD QUESTIONS (6) - Negative questions, embedded questions
('foundation', 'present-continuous-questions', 'beginner', 'Which is the correct NEGATIVE question?', '["Aren''t you coming?", "Don''t you coming?", "Not you are coming?", "You not are coming?"]', 0, 'Negative question pattern: Aren''t/Isn''t + subject + [verb + ing]? Contraction at start. "Aren''t you coming?" = surprise/expectation that you should come. WRONG: "Don''t you coming" (mixing tenses).', 'hard'),

('foundation', 'present-continuous-questions', 'beginner', 'Arrange correctly: sitting / Who / is / next / you / to', '["Who is sitting next to you", "Who sitting is next to you", "Is who sitting next to you", "Who is next to you sitting"]', 0, 'Pattern: Who + is + [verb + ing] + [where]? Order: Who + is + sitting + next to you (asking about person). "Next to" = prepositional phrase stays together.', 'hard'),

('foundation', 'present-continuous-questions', 'beginner', 'Find the error: "Why you are not studying?"', '["Say Why are you not studying", "Say Why you not studying", "Say Why are not you studying", "No error"]', 0, 'Word order! Pattern: Why + are + you + not + [verb + ing]? In questions, "are" comes BEFORE "you". Correct: "Why are you not studying?" Never "Why you are" in questions.', 'hard'),

('foundation', 'present-continuous-questions', 'beginner', 'Embedded question (indirect): "Do you know _____ he is going?"', '["where", "where is", "is where", "where are"]', 0, 'Embedded question pattern: Do you know + Wh-word + subject + verb (statement order, not question order). Correct: "Do you know where he is going?" NOT "where is he going" inside.', 'hard'),

('foundation', 'present-continuous-questions', 'beginner', 'Which sentence is grammatically perfect?', '["Are they not coming to the party?", "They are not coming to the party?", "Not they are coming to the party?", "Are not they coming to the party?"]', 0, 'Negative question: Are + subject + not + [verb + ing]? Correct: "Are they not coming to the party?" (formal). Casual: "Aren''t they coming?" Both acceptable, but A is most grammatical.', 'hard'),

('foundation', 'present-continuous-questions', 'beginner', 'Arrange correctly (negative question): still / working / Isn''t / he / there', '["Isn''t he still working there", "He isn''t still working there", "Isn''t still he working there", "Still isn''t he working there"]', 0, 'Negative question: Isn''t + subject + [adverb] + [verb + ing] + [where]? Order: Isn''t + he + still (adverb of time) + working + there. Negative question shows surprise/expectation.', 'hard');

-- Verify insertion
SELECT COUNT(*) as total_inserted FROM english_questions WHERE topic_id = 'present-continuous-questions';
