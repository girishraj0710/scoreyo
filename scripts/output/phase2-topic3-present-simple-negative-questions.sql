-- Phase 2, Topic 3: "I Don't Like..." - Present Simple Negative
-- 30 questions (12 easy, 12 medium, 6 hard)
-- Pattern-based, beginner-friendly, Indian context

INSERT INTO english_questions (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty) VALUES

-- EASY QUESTIONS (12) - Basic negative patterns
('foundation', 'present-simple-negative', 'beginner', 'I _____ coffee.', '["don''t like", "doesn''t like", "not like", "am not like"]', 0, 'Pattern: I/You/We/They + don''t + [base verb]. Use don''t (= do not) with I. Verb stays base form (like, not likes).', 'easy'),

('foundation', 'present-simple-negative', 'beginner', 'She _____ tea.', '["don''t drink", "doesn''t drink", "not drink", "isn''t drink"]', 1, 'Pattern: He/She/It + doesn''t + [base verb]. Use doesn''t (= does not) with she. Verb stays base form (drink, not drinks).', 'easy'),

('foundation', 'present-simple-negative', 'beginner', 'They _____ meat.', '["don''t eat", "doesn''t eat", "not eat", "aren''t eat"]', 0, 'Pattern: They + don''t + [base verb]. Use don''t with they. Verb: eat (no changes).', 'easy'),

('foundation', 'present-simple-negative', 'beginner', 'He _____ here.', '["don''t live", "doesn''t live", "not live", "isn''t live"]', 1, 'Pattern: He + doesn''t + [base verb]. Use doesn''t with he. Verb: live (base form, not lives).', 'easy'),

('foundation', 'present-simple-negative', 'beginner', 'We _____ the answer.', '["don''t know", "doesn''t know", "not know", "aren''t know"]', 0, 'Pattern: We + don''t + [base verb]. Use don''t with we. Verb: know (base form).', 'easy'),

('foundation', 'present-simple-negative', 'beginner', 'It _____ good. (talking about food)', '["don''t taste", "doesn''t taste", "not taste", "isn''t taste"]', 1, 'Pattern: It + doesn''t + [base verb]. Use doesn''t with it. Verb: taste (not tastes in negative).', 'easy'),

('foundation', 'present-simple-negative', 'beginner', 'You _____ my question.', '["don''t understand", "doesn''t understand", "not understand", "aren''t understand"]', 0, 'Pattern: You + don''t + [base verb]. Use don''t with you (always don''t, never doesn''t). Verb: understand.', 'easy'),

('foundation', 'present-simple-negative', 'beginner', 'My sister _____ spicy food.', '["don''t like", "doesn''t like", "not like", "isn''t like"]', 1, 'Pattern: My sister = she + doesn''t + [base verb]. Use doesn''t with singular nouns. Verb: like (base).', 'easy'),

('foundation', 'present-simple-negative', 'beginner', 'The shop _____ on Sundays.', '["don''t open", "doesn''t open", "not open", "isn''t open"]', 1, 'Pattern: The shop = it + doesn''t + [base verb]. Use doesn''t with singular nouns. Verb: open (action, not state).', 'easy'),

('foundation', 'present-simple-negative', 'beginner', 'I _____ to work on weekends.', '["don''t go", "doesn''t go", "not go", "am not go"]', 0, 'Pattern: I + don''t + [base verb]. Use don''t with I. Verb: go (base form, not goes).', 'easy'),

('foundation', 'present-simple-negative', 'beginner', 'They _____ English at home.', '["don''t speak", "doesn''t speak", "not speak", "aren''t speak"]', 0, 'Pattern: They + don''t + [base verb]. Use don''t with they. Verb: speak (base form).', 'easy'),

('foundation', 'present-simple-negative', 'beginner', 'He _____ his phone in meetings.', '["don''t use", "doesn''t use", "not use", "isn''t use"]', 1, 'Pattern: He + doesn''t + [base verb]. Use doesn''t with he. Verb: use (base form, not uses).', 'easy'),

-- MEDIUM QUESTIONS (12) - Real contexts and error correction
('foundation', 'present-simple-negative', 'beginner', 'What is wrong? "She don''t like cold weather."', '["Use doesn''t instead of don''t", "Use not instead of don''t", "Use didn''t instead of don''t", "Nothing wrong"]', 0, 'Pattern error: She = doesn''t (not don''t). Rule: He/She/It + doesn''t. Correct: "She doesn''t like cold weather." Use doesn''t with singular subjects.', 'medium'),

('foundation', 'present-simple-negative', 'beginner', 'Arrange correctly: understand / don''t / We / question / the', '["We don''t understand the question", "We don''t the question understand", "Don''t we understand the question", "The question we don''t understand"]', 0, 'Pattern: We + don''t + [verb] + [object]. Order: subject + don''t + verb + what. Negative statement format (not question).', 'medium'),

('foundation', 'present-simple-negative', 'beginner', 'At a restaurant, telling the waiter:', '["I don''t likes spicy food.", "I don''t like spicy food.", "I doesn''t like spicy food.", "I not like spicy food."]', 1, 'Pattern: I + don''t + [base verb]. After don''t/doesn''t, verb is ALWAYS base form (like, not likes). Correct: "I don''t like spicy food."', 'medium'),

('foundation', 'present-simple-negative', 'beginner', 'Choose the correct sentence:', '["He doesn''t works on Sundays.", "He doesn''t work on Sundays.", "He don''t work on Sundays.", "He not work on Sundays."]', 1, 'Pattern: He + doesn''t + [base verb]. After doesn''t, use "work" (not "works"). Doesn''t already shows third person, so verb stays base form.', 'medium'),

('foundation', 'present-simple-negative', 'beginner', 'What is the error? "They doesn''t have time."', '["Use don''t instead of doesn''t", "Use not instead of doesn''t", "Use didn''t instead of doesn''t", "Nothing wrong"]', 0, 'Pattern error: They = don''t (not doesn''t). Rule: I/You/We/They + don''t. Correct: "They don''t have time." Only he/she/it use doesn''t.', 'medium'),

('foundation', 'present-simple-negative', 'beginner', 'Talking about your daily routine:', '["I don''t usually wake up early.", "I usually don''t wake up early.", "I don''t wake up usually early.", "Both A and B are correct"]', 3, 'Two correct positions for "usually"! 1) Subject + usually + don''t. 2) Subject + don''t + usually. Both are natural. Most common: "I don''t usually wake up early."', 'medium'),

('foundation', 'present-simple-negative', 'beginner', 'Rearrange: TV / doesn''t / My / watch / father / much', '["My father doesn''t watch TV much", "My father doesn''t much watch TV", "Doesn''t my father watch TV much", "TV my father doesn''t watch much"]', 0, 'Pattern: My father + doesn''t + [verb] + [object] + [adverb]. Order: subject + doesn''t + verb + what + how much. "Much" goes at the end.', 'medium'),

('foundation', 'present-simple-negative', 'beginner', 'At work, explaining your schedule:', '["I don''t comes to office on Mondays.", "I don''t come to office on Mondays.", "I doesn''t come to office on Mondays.", "I not come to office on Mondays."]', 1, 'Pattern: I + don''t + [base verb]. After don''t, verb is base form (come, not comes). Correct: "I don''t come to office on Mondays."', 'medium'),

('foundation', 'present-simple-negative', 'beginner', 'What is wrong? "We doesn''t need help."', '["Use don''t instead of doesn''t", "Use not instead of doesn''t", "Use didn''t instead of doesn''t", "Nothing wrong"]', 0, 'Pattern error: We = don''t (not doesn''t). Correct: "We don''t need help." Remember: We/They/You/I always use don''t.', 'medium'),

('foundation', 'present-simple-negative', 'beginner', 'Choose the natural sentence:', '["The train doesn''t stops here.", "The train doesn''t stop here.", "The train don''t stop here.", "The train not stop here."]', 1, 'Pattern: The train = it + doesn''t + [base verb]. After doesn''t, use "stop" (not "stops"). Correct: "The train doesn''t stop here."', 'medium'),

('foundation', 'present-simple-negative', 'beginner', 'Talking about your friend:', '["My friend don''t likes cricket.", "My friend doesn''t likes cricket.", "My friend doesn''t like cricket.", "My friend don''t like cricket."]', 2, 'Pattern: My friend = he/she + doesn''t + [base verb]. Use doesn''t (not don''t) with singular noun. Verb: like (base form). Correct: "My friend doesn''t like cricket."', 'medium'),

('foundation', 'present-simple-negative', 'beginner', 'What is the error? "She doesn''t goes to gym."', '["Use go instead of goes", "Use going instead of goes", "Use went instead of goes", "Nothing wrong"]', 0, 'Pattern error: After doesn''t, use base form. Correct: "She doesn''t go to gym." Doesn''t already shows third person, so "go" (not "goes").', 'medium'),

-- HARD QUESTIONS (6) - Stative verbs, contractions, formal writing
('foundation', 'present-simple-negative', 'beginner', 'Which is correct in formal business writing?', '["We don''t have any updates.", "We do not have any updates.", "We doesn''t have any updates.", "We not have any updates."]', 1, 'In formal writing, avoid contractions. Pattern: We + do not + [verb] (not "don''t"). "Do not" is more professional than "don''t". Use full forms in emails/reports.', 'hard'),

('foundation', 'present-simple-negative', 'beginner', 'Find the error: "I am not understanding this concept."', '["Say I don''t understand", "Say I doesn''t understand", "Say I not understand", "No error"]', 0, 'Stative verb error! "Understand" = state (not action), so no continuous. Pattern: I + don''t + understand. Correct: "I don''t understand this concept." Never "am understanding".', 'hard'),

('foundation', 'present-simple-negative', 'beginner', 'Arrange correctly: believe / don''t / I / rumors / these', '["I don''t believe these rumors", "I don''t these rumors believe", "These rumors I don''t believe", "Don''t I believe these rumors"]', 0, 'Pattern: I + don''t + [verb] + [object]. Order: subject + don''t + verb + what. Natural flow: I don''t believe these rumors.', 'hard'),

('foundation', 'present-simple-negative', 'beginner', 'What is wrong? "The data doesn''t shows any improvement."', '["Use show instead of shows", "Use showing instead of shows", "Use showed instead of shows", "Nothing wrong"]', 0, 'Pattern error: After doesn''t, use base form. Correct: "The data doesn''t show any improvement." Doesn''t + show (not "shows").', 'hard'),

('foundation', 'present-simple-negative', 'beginner', 'Which sentence is most natural when refusing an offer?', '["I don''t want coffee.", "I am not wanting coffee.", "I don''t wants coffee.", "I doesn''t want coffee."]', 0, 'Pattern: I + don''t + want. "Want" = stative verb (no continuous). Most natural refusal: "I don''t want coffee." Simple and polite. Never "am wanting" or "wants" after don''t.', 'hard'),

('foundation', 'present-simple-negative', 'beginner', 'Find the error: "He doesn''t never comes late." (Double negative)', '["Remove never OR change doesn''t to does", "Remove doesn''t", "Remove never", "No error"]', 0, 'Double negative error! Can''t use "doesn''t" + "never" together. Two fixes: 1) "He never comes late" (remove doesn''t). 2) "He doesn''t ever come late" (remove never, use ever). Never use two negatives in one sentence.', 'hard');

-- Verify insertion
SELECT COUNT(*) as total_inserted FROM english_questions WHERE topic_id = 'present-simple-negative';
