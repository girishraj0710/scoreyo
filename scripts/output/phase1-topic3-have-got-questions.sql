-- Phase 1, Topic 3: "I Have, You Have" - Have/Has for Possession
-- 30 questions (12 easy, 12 medium, 6 hard)
-- Pattern-based, beginner-friendly, Indian context

INSERT INTO english_questions (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty) VALUES

-- EASY QUESTIONS (12) - Basic pattern recognition
('foundation', 'have-got-basic', 'beginner', 'I _____ a car.', '["have", "has", "am", "is"]', 0, 'Use "have" with I/you/we/they. Pattern: I + have + [thing]. "Have" = own or possess something.', 'easy'),

('foundation', 'have-got-basic', 'beginner', 'She _____ a beautiful house.', '["have", "has", "am", "is"]', 1, 'Use "has" with he/she/it. Pattern: He/She/It + has + [thing]. She = one person = "has".', 'easy'),

('foundation', 'have-got-basic', 'beginner', 'They _____ two children.', '["have", "has", "am", "are"]', 0, 'Use "have" with they/we/you. Pattern: They/We/You + have + [things]. They = more than one person = "have".', 'easy'),

('foundation', 'have-got-basic', 'beginner', 'We _____ a meeting today.', '["have", "has", "am", "are"]', 0, 'Use "have" with we. Pattern: We + have + [thing]. "Have a meeting" = scheduled event (not ownership).', 'easy'),

('foundation', 'have-got-basic', 'beginner', 'He _____ a new bike.', '["have", "has", "am", "is"]', 1, 'Use "has" with he. Pattern: He + has + [thing]. He = one man = "has" (not "have").', 'easy'),

('foundation', 'have-got-basic', 'beginner', 'You _____ a nice smile.', '["have", "has", "am", "are"]', 0, 'Use "have" with you. Pattern: You + have + [thing]. Always "have" with "you" (never "has"), even if talking to one person.', 'easy'),

('foundation', 'have-got-basic', 'beginner', 'My sister _____ three cats.', '["have", "has", "am", "is"]', 1, 'Use "has" with singular nouns. Pattern: [One person] + has. My sister = she = one person = "has".', 'easy'),

('foundation', 'have-got-basic', 'beginner', 'The company _____ 50 employees.', '["have", "has", "am", "is"]', 1, 'Use "has" with singular nouns. Pattern: The [company/organization] + has. A company = one thing = it = "has".', 'easy'),

('foundation', 'have-got-basic', 'beginner', 'I _____ a question.', '["have", "has", "am", "is"]', 0, 'Use "have" with I. Pattern: I + have + [thing]. Common phrase: "I have a question" (to ask something).', 'easy'),

('foundation', 'have-got-basic', 'beginner', 'My parents _____ a shop in Delhi.', '["have", "has", "am", "are"]', 0, 'Use "have" with plural nouns. Pattern: [More than one person] + have. Parents = two people = plural = "have".', 'easy'),

('foundation', 'have-got-basic', 'beginner', 'It _____ four wheels. (talking about a car)', '["have", "has", "am", "is"]', 1, 'Use "has" with it. Pattern: It + has + [things]. A car = it = one thing = "has".', 'easy'),

('foundation', 'have-got-basic', 'beginner', 'Rahul and Priya _____ a new apartment.', '["have", "has", "am", "are"]', 0, 'Use "have" with two or more people. Pattern: [Name + and + Name] = they + have. Two people = plural = "have".', 'easy'),

-- MEDIUM QUESTIONS (12) - Real-world contexts
('foundation', 'have-got-basic', 'beginner', 'What is wrong? "She have a beautiful voice."', '["Use has instead of have", "Use is instead of have", "Use am instead of have", "Nothing is wrong"]', 0, 'Pattern error: She = one person = "has". Correct: "She has a beautiful voice." Rule: He/She/It always use "has" (never "have").', 'medium'),

('foundation', 'have-got-basic', 'beginner', 'Arrange correctly: laptop / My / has / brother / new / a', '["My brother has a new laptop", "My brother a new laptop has", "Has my brother a new laptop", "A new laptop my brother has"]', 0, 'Pattern: [Subject] + has + a/an + [adjective] + [thing]. Order: My brother (who) + has (verb) + a new (what kind) + laptop (what).', 'medium'),

('foundation', 'have-got-basic', 'beginner', 'At the doctor, you say:', '["I have fever.", "I have a fever.", "I has a fever.", "I am have fever."]', 1, 'Pattern: I + have + a + [health problem]. Always say "a fever" (not just "fever"). Common health expressions: have a cold, have a headache, have a fever.', 'medium'),

('foundation', 'have-got-basic', 'beginner', 'Your friend asks: "Do you have time?" You answer:', '["Yes, I have time.", "Yes, I has time.", "Yes, I am have time.", "Yes, I having time."]', 0, 'Pattern: Yes, I + have + [thing]. Answer matches the question form. "Have time" = be free or available.', 'medium'),

('foundation', 'have-got-basic', 'beginner', 'Complete: The restaurant _____ good food.', '["have", "has", "having", "is have"]', 1, 'Use "has" with singular nouns. Pattern: The [place/business] + has. Restaurant = one place = it = "has". "Has good food" = serves good food.', 'medium'),

('foundation', 'have-got-basic', 'beginner', 'What is the error? "We has a problem with the project."', '["Use have instead of has", "Use are instead of has", "Use is instead of has", "Nothing is wrong"]', 0, 'Pattern error: We = "have" always. Correct: "We have a problem." Rule: I/You/We/They always use "have" (never "has").', 'medium'),

('foundation', 'have-got-basic', 'beginner', 'Talking about your phone, you say:', '["My phone has 128GB storage.", "My phone have 128GB storage.", "My phone is 128GB storage.", "My phone are 128GB storage."]', 0, 'Pattern: My [thing] + has + [specification]. Phone = one thing = it = "has". Use "has" for features: has storage, has camera, has battery.', 'medium'),

('foundation', 'have-got-basic', 'beginner', 'Rearrange: important / today / have / an / meeting / We', '["We have an important meeting today", "We have today an important meeting", "An important meeting we have today", "Today we have meeting an important"]', 0, 'Pattern: We + have + a/an + [adjective] + [thing] + [time]. Order: We (who) + have (verb) + an important (what kind) + meeting (what) + today (when).', 'medium'),

('foundation', 'have-got-basic', 'beginner', 'Choose the correct sentence:', '["Each student have a book.", "Each student has a book.", "Each students has a book.", "Each students have a book."]', 1, 'Pattern: Each + [singular noun] + has. "Each" = every one = singular = "has". Also "student" (not "students") after "each". Correct: Each student has.', 'medium'),

('foundation', 'have-got-basic', 'beginner', 'At work, your manager says: "This project _____ a tight deadline."', '["have", "has", "having", "is have"]', 1, 'Use "has" with this/that (singular). Pattern: This/That + [thing] + has. Project = one thing = "has". "Has a deadline" = must be finished by a date.', 'medium'),

('foundation', 'have-got-basic', 'beginner', 'What is wrong? "The team have different opinions."', '["Use has instead of have", "Use are instead of have", "Use is instead of have", "Nothing is wrong"]', 0, 'Tricky! "Team" = one group = singular = "has". Correct: "The team has different opinions." Even though team = many people, it is ONE group = "has".', 'medium'),

('foundation', 'have-got-basic', 'beginner', 'Talking about your hometown, you say:', '["My city has beautiful temples.", "My city have beautiful temples.", "My city is beautiful temples.", "My city are beautiful temples."]', 0, 'Pattern: My [place] + has + [things]. City = one place = it = "has". Use "has" when talking about what a place contains or offers.', 'medium'),

-- HARD QUESTIONS (6) - Tricky patterns, advanced usage
('foundation', 'have-got-basic', 'beginner', 'Find the error: "Each of my friends have their own car."', '["Use has instead of have", "Use is instead of have", "Use are instead of have", "No error"]', 0, 'Tricky subject! "Each" = singular, so use "has". Pattern: Each + of + [plural noun] + has. Don''t be confused by "friends" (plural). The subject is "each" (one) = "has". Correct: "Each of my friends has their own car."', 'hard'),

('foundation', 'have-got-basic', 'beginner', 'Which is correct in formal business writing?', '["We have got a new office.", "We have a new office.", "We has a new office.", "We are having a new office."]', 1, 'In formal writing, use "have" (not "have got"). Pattern: We + have + [thing]. "Have got" is informal/spoken English. Professional emails use "have".', 'hard'),

('foundation', 'have-got-basic', 'beginner', 'Arrange correctly: experience / years / She / of / has / ten / teaching', '["She has ten years of teaching experience", "She has teaching ten years of experience", "Ten years she has of teaching experience", "She ten years has of teaching experience"]', 0, 'Pattern: She + has + [number] + [unit] + of + [type] + [thing]. Order: She has + ten years (how much) + of teaching (what type) + experience (what).', 'hard'),

('foundation', 'have-got-basic', 'beginner', 'What is the problem? "One of the students have submitted the assignment."', '["Use has instead of have", "Use is instead of have", "Use are instead of have", "No problem"]', 0, 'Tricky! "One" = singular, so use "has". Pattern: One + of + the + [plural noun] + has. Don''t let "students" confuse you - the subject is "one" = singular = "has". Correct: "One of the students has submitted."', 'hard'),

('foundation', 'have-got-basic', 'beginner', 'In a job interview, talking about your skills, which is MOST professional?', '["I have five years experience in marketing.", "I have five years of experience in marketing.", "I has five years of experience in marketing.", "I am having five years of experience in marketing."]', 1, 'Most professional: I + have + [number] + [unit] + OF + [thing]. Always use "of" between number and noun in formal English. "Five years of experience" is the standard business expression.', 'hard'),

('foundation', 'have-got-basic', 'beginner', 'Choose the sentence that follows formal grammar rules:', '["The data show interesting results.", "The data shows interesting results.", "The datas show interesting results.", "The data has shown interesting results."]', 1, 'In formal writing, "data" can be singular = "shows" or "has". Pattern: The data + shows/has (singular form is now more common). "Datas" is never correct. Modern usage treats "data" as singular (like "information").', 'hard');

-- Verify insertion
SELECT COUNT(*) as total_inserted FROM english_questions WHERE topic_id = 'have-got-basic';
