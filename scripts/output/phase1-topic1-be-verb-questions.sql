-- Phase 1, Topic 1: "I Am, You Are, They Are" - Be Verb Questions
-- 30 questions (12 easy, 12 medium, 6 hard)
-- Pattern-based, beginner-friendly, Indian context

INSERT INTO english_questions (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty) VALUES

-- EASY QUESTIONS (12) - Basic pattern recognition
('foundation', 'be-verb-present', 'beginner', 'I _____ a student.', '["am", "is", "are", "be"]', 0, 'Use "am" with "I". Pattern: I + am. This is the fixed rule - "I" always goes with "am", never "is" or "are".', 'easy'),

('foundation', 'be-verb-present', 'beginner', 'She _____ my sister.', '["am", "is", "are", "be"]', 1, 'Use "is" with he/she/it. Pattern: He/She/It + is. Your sister = she (one person), so use "is".', 'easy'),

('foundation', 'be-verb-present', 'beginner', 'They _____ happy today.', '["am", "is", "are", "be"]', 2, 'Use "are" with they/we/you. Pattern: They/We/You + are. "They" = more than one person, so use "are".', 'easy'),

('foundation', 'be-verb-present', 'beginner', 'We _____ from Mumbai.', '["am", "is", "are", "be"]', 2, 'Use "are" with we. Pattern: We + are. "We" = I + other people = more than one, so use "are".', 'easy'),

('foundation', 'be-verb-present', 'beginner', 'He _____ a teacher.', '["am", "is", "are", "be"]', 1, 'Use "is" with he. Pattern: He + is. One man = he, so use "is" (singular).', 'easy'),

('foundation', 'be-verb-present', 'beginner', 'You _____ very kind.', '["am", "is", "are", "be"]', 2, 'Use "are" with you. Pattern: You + are. Whether talking to one person or many people, "you" always uses "are".', 'easy'),

('foundation', 'be-verb-present', 'beginner', 'It _____ hot today.', '["am", "is", "are", "be"]', 1, 'Use "is" with it. Pattern: It + is. Weather, time, and things = "it", so use "is".', 'easy'),

('foundation', 'be-verb-present', 'beginner', 'My mother _____ at home.', '["am", "is", "are", "be"]', 1, 'Use "is" with singular nouns. Pattern: [One person/thing] + is. My mother = she = one person, so use "is".', 'easy'),

('foundation', 'be-verb-present', 'beginner', 'The books _____ on the table.', '["am", "is", "are", "be"]', 2, 'Use "are" with plural nouns. Pattern: [More than one thing] + are. Books = more than one book, so use "are".', 'easy'),

('foundation', 'be-verb-present', 'beginner', 'I _____ tired after work.', '["am", "is", "are", "be"]', 0, 'Use "am" with I. Pattern: I + am + [feeling]. When describing how you feel, always use "I am".', 'easy'),

('foundation', 'be-verb-present', 'beginner', 'My friends _____ in Delhi.', '["am", "is", "are", "be"]', 2, 'Use "are" with plural nouns. Pattern: [More than one person] + are. Friends = more than one friend = plural, so use "are".', 'easy'),

('foundation', 'be-verb-present', 'beginner', 'This _____ my phone.', '["am", "is", "are", "be"]', 1, 'Use "is" with this/that (singular). Pattern: This/That + is. "This" points to one thing, so use "is".', 'easy'),

-- MEDIUM QUESTIONS (12) - Sentence construction and real-world context
('foundation', 'be-verb-present', 'beginner', 'Choose the correct sentence:', '["I am engineer.", "I am an engineer.", "I is an engineer.", "I are engineer."]', 1, 'Pattern: I + am + a/an + [job]. You need "an" before "engineer" because it starts with a vowel sound. The complete pattern is: I am + article + job name.', 'medium'),

('foundation', 'be-verb-present', 'beginner', 'Complete: My parents _____ doctors.', '["am", "is", "are", "be"]', 2, 'Use "are" with plural subjects. My parents = my mother + my father = two people = plural, so use "are". Pattern: [Plural noun] + are.', 'medium'),

('foundation', 'be-verb-present', 'beginner', 'Arrange in correct order: ready / for / We / the / are / meeting', '["We are ready for the meeting", "We ready are for the meeting", "Are we ready for the meeting", "Ready we are for the meeting"]', 0, 'Pattern: [Subject] + are + [adjective] + for + [thing]. Word order: We (subject) + are (verb) + ready (how we feel) + for the meeting (what we are ready for).', 'medium'),

('foundation', 'be-verb-present', 'beginner', 'Your friend asks: "Where is Priya?" You say:', '["She at office.", "She is at office.", "She is at the office.", "She are at office."]', 2, 'Pattern: She + is + at + the + [place]. You need both "is" (because Priya = she) and "the" before "office". Complete pattern: subject + is + at the + location.', 'medium'),

('foundation', 'be-verb-present', 'beginner', 'What is wrong? "Rahul and Priya is my friends."', '["Use am instead of is", "Use are instead of is", "Use be instead of is", "Nothing is wrong"]', 1, 'Rahul and Priya = two people = they = plural. Use "are" with plural subjects. Correct: "Rahul and Priya are my friends." Pattern: [Name + and + Name] = they = are.', 'medium'),

('foundation', 'be-verb-present', 'beginner', 'At a job interview, you introduce yourself:', '["I Ramesh from Chennai.", "I am Ramesh from Chennai.", "I is Ramesh from Chennai.", "I are Ramesh from Chennai."]', 1, 'Pattern: I + am + [name] + from + [place]. Always use "am" with "I". This is how you introduce yourself professionally.', 'medium'),

('foundation', 'be-verb-present', 'beginner', 'Complete: The weather _____ very nice today.', '["am", "is", "are", "be"]', 1, 'Use "is" with singular nouns. The weather = it = singular, so use "is". Pattern: The + [singular thing] + is. Weather, time, temperature all use "is".', 'medium'),

('foundation', 'be-verb-present', 'beginner', 'Your boss asks: "Are you ready?" You answer:', '["Yes, I ready.", "Yes, I am ready.", "Yes, I is ready.", "Yes, I are ready."]', 1, 'Pattern: Yes, I + am + [adjective]. When answering yes/no questions, repeat the verb. Question has "are", but your answer uses "am" because you say "I am".', 'medium'),

('foundation', 'be-verb-present', 'beginner', 'Choose the sentence that is completely correct:', '["My sister is doctor in Mumbai.", "My sister is a doctor in Mumbai.", "My sister doctor in Mumbai.", "My sister are doctor in Mumbai."]', 1, 'Complete pattern: [Subject] + is + a/an + [job] + in + [place]. You need "is" (she = singular) and "a" before "doctor". All pieces must be there: sister is a doctor in Mumbai.', 'medium'),

('foundation', 'be-verb-present', 'beginner', 'Rearrange: very / The / are / today / tired / children', '["The children are very tired today", "The very children are tired today", "The children very are tired today", "Today the children are very tired"]', 0, 'Pattern: [The + plural noun] + are + [adverb] + [adjective] + [time]. Order: Subject (the children) + verb (are) + how much (very) + adjective (tired) + when (today).', 'medium'),

('foundation', 'be-verb-present', 'beginner', 'What is the problem? "I and my brother is students."', '["Say My brother and I", "Use are instead of is", "Both A and B", "Nothing is wrong"]', 2, 'Two problems: 1) Say "My brother and I" (not "I and my brother") - put yourself last. 2) Use "are" because my brother + I = we = plural. Correct: "My brother and I are students."', 'medium'),

('foundation', 'be-verb-present', 'beginner', 'At a restaurant, the waiter asks: "Are you ready to order?" You say:', '["Yes, we ready to order.", "Yes, we are ready to order.", "Yes, we is ready to order.", "Yes, we am ready to order."]', 1, 'Pattern: Yes, we + are + [adjective] + to + [action]. Use "are" with "we". When answering, repeat the verb structure from the question.', 'medium'),

-- HARD QUESTIONS (6) - Error correction, tricky cases, longer sentences
('foundation', 'be-verb-present', 'beginner', 'Find the error: "The team of engineers are working on the project."', '["Use is instead of are", "Use am instead of are", "Remove the word the", "No error"]', 0, 'Tricky! "Team" = one group = singular, so use "is". Don''t be confused by "engineers" (plural). The main subject is "team" (singular). Pattern: A [group word] + of + [plural noun] + is. Examples: team, group, class all use "is".', 'hard'),

('foundation', 'be-verb-present', 'beginner', 'Which sentence is correct for formal writing?', '["I''m a software engineer working in Bangalore.", "I am a software engineer working in Bangalore.", "I am software engineer working in Bangalore.", "I software engineer working in Bangalore."]', 1, 'In formal situations (job applications, interviews, official emails), write "I am" fully - don''t use "I''m". Also need "a" before "software engineer". Pattern: I am + a/an + [job] + working in + [place].', 'hard'),

('foundation', 'be-verb-present', 'beginner', 'Arrange correctly: not / today / I / am / at / feeling / well', '["I am not feeling well today", "I not am feeling well today", "I am feeling not well today", "Not I am feeling well today"]', 0, 'Pattern: I + am + not + [verb-ing] + [adverb] + [time]. Order for negative: subject (I) + am + not + feeling (action) + well (how) + today (when). "Not" goes right after "am".', 'hard'),

('foundation', 'be-verb-present', 'beginner', 'What is wrong with this? "The price of these phones are too high."', '["Use is instead of are", "Use am instead of are", "Remove these", "Nothing is wrong"]', 0, 'The main subject is "price" (singular), not "phones". Pattern: The [singular noun] + of + [plural noun] + is. Don''t let the plural word in the middle confuse you - look at the main subject (price = one thing = is).', 'hard'),

('foundation', 'be-verb-present', 'beginner', 'In a job interview, which is MOST professional?', '["I''m Suresh and I''m from Delhi.", "I am Suresh, and I am from Delhi.", "I Suresh from Delhi.", "I am being Suresh from Delhi."]', 1, 'Most professional: Full forms + comma. Use "I am" (not "I''m") twice. Add a comma before "and". Don''t use "being" - that''s wrong here. Pattern: I am [name], and I am from [place].', 'hard'),

('foundation', 'be-verb-present', 'beginner', 'Rewrite correctly: "Each of the students are responsible for their homework."', '["Each of the students is responsible for their homework.", "Each of the students am responsible for their homework.", "Each of the student is responsible for their homework.", "The sentence is already correct."]', 0, 'Tricky subject-verb agreement! "Each" = one = singular, so use "is". Pattern: Each + of + the + [plural noun] + is. Even though "students" is plural, "each" is the main subject and it''s singular. Each one = is.', 'hard');

-- Verify insertion
SELECT COUNT(*) as total_inserted FROM english_questions WHERE topic_id = 'be-verb-present';
