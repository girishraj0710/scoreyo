-- ============================================
-- PHASE 1: ABSOLUTE BASICS - ALL QUESTIONS
-- ============================================
-- Total: 120 questions (4 topics × 30 questions)
-- Pattern-based, beginner-friendly, Indian context
-- Topics: be-verb, demonstratives, have/has, adjectives
-- Note: Articles (Topic 5) already exists with 40 questions
-- ============================================

-- Run this entire file in Supabase SQL Editor to insert all Phase 1 questions at once

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
-- Phase 1, Topic 2: "This Is My..." - Demonstratives (Pointing to Things)
-- 30 questions (12 easy, 12 medium, 6 hard)
-- Pattern-based, beginner-friendly, Indian context

INSERT INTO english_questions (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty) VALUES

-- EASY QUESTIONS (12) - Basic pattern recognition
('foundation', 'demonstratives-basic', 'beginner', '_____ is my book.', '["This", "These", "Those", "That"]', 0, 'Use "this" for one thing near you. Pattern: This + is + my + [thing]. "This" = one thing you can touch or point to right now.', 'easy'),

('foundation', 'demonstratives-basic', 'beginner', '_____ are my keys.', '["This", "These", "Those", "That"]', 1, 'Use "these" for more than one thing near you. Pattern: These + are + my + [things]. "These" = many things close to you.', 'easy'),

('foundation', 'demonstratives-basic', 'beginner', '_____ is your bag over there.', '["This", "These", "Those", "That"]', 3, 'Use "that" for one thing far from you. Pattern: That + is + your + [thing]. "That" = one thing far away (over there).', 'easy'),

('foundation', 'demonstratives-basic', 'beginner', '_____ are my parents.', '["This", "These", "Those", "That"]', 1, 'Use "these" for people near you. Pattern: These + are + my + [people]. Parents = two people = more than one = "these".', 'easy'),

('foundation', 'demonstratives-basic', 'beginner', 'This _____ my phone.', '["am", "is", "are", "be"]', 1, 'Use "is" with this/that (one thing). Pattern: This/That + is. "This" points to one thing, so use "is".', 'easy'),

('foundation', 'demonstratives-basic', 'beginner', 'These _____ my friends.', '["am", "is", "are", "be"]', 2, 'Use "are" with these/those (more than one). Pattern: These/Those + are. "These" points to many things, so use "are".', 'easy'),

('foundation', 'demonstratives-basic', 'beginner', '_____ building is very tall. (pointing to a building far away)', '["This", "These", "That", "Those"]', 2, 'Use "that" for one thing far away. Pattern: That + [thing] + is. Building = one thing far from you = "that building".', 'easy'),

('foundation', 'demonstratives-basic', 'beginner', '_____ flowers are beautiful. (pointing to flowers near you)', '["This", "These", "That", "Those"]', 1, 'Use "these" for many things near you. Pattern: These + [things] + are. Flowers = more than one = near you = "these flowers".', 'easy'),

('foundation', 'demonstratives-basic', 'beginner', 'Pointing to your pen, you say: "_____ is my pen."', '["This", "These", "That", "Those"]', 0, 'Use "this" when touching or holding something. Pattern: This + is + my + [thing]. The pen is in your hand = very close = "this".', 'easy'),

('foundation', 'demonstratives-basic', 'beginner', 'Pointing to cars in the parking lot (far away), you say: "_____ are expensive cars."', '["This", "These", "That", "Those"]', 3, 'Use "those" for many things far away. Pattern: Those + are + [things]. Cars = more than one + far away = "those".', 'easy'),

('foundation', 'demonstratives-basic', 'beginner', '_____ is my sister standing here.', '["This", "These", "That", "Those"]', 0, 'Use "this" for one person near you. Pattern: This + is + my + [person]. Sister = one person + near you (standing here) = "this".', 'easy'),

('foundation', 'demonstratives-basic', 'beginner', '_____ are your books on the table over there.', '["This", "These", "That", "Those"]', 3, 'Use "those" for many things far away. Pattern: Those + are + your + [things]. Books = more than one + over there = far = "those".', 'easy'),

-- MEDIUM QUESTIONS (12) - Real-world contexts
('foundation', 'demonstratives-basic', 'beginner', 'At a shop, pointing to a shirt on the rack near you, you ask:', '["How much is this?", "How much is that?", "How much are these?", "How much are those?"]', 0, 'Pattern: How much + is + this? Shirt = one thing + near you (you can touch the rack) = "this". For one thing near you, use "this is".', 'medium'),

('foundation', 'demonstratives-basic', 'beginner', 'Arrange correctly: my / This / phone / new / is', '["This is my new phone", "This my new phone is", "My new phone this is", "New phone is this my"]', 0, 'Pattern: This + is + my + [adjective] + [thing]. Order: This (pointing word) + is (verb) + my (whose) + new (what kind) + phone (what thing).', 'medium'),

('foundation', 'demonstratives-basic', 'beginner', 'Pointing to shoes in a display case (far from you), you ask the salesperson:', '["Can I try this?", "Can I try that?", "Can I try these?", "Can I try those?"]', 3, 'Pattern: Can I try + those? Shoes = two things (pair) + in display case = far away = "those". More than one thing + far = "those".', 'medium'),

('foundation', 'demonstratives-basic', 'beginner', 'What is wrong? "These is my laptop."', '["Use this instead of these", "Use are instead of is", "Both A and B", "Nothing is wrong"]', 2, 'Two problems: 1) Laptop = one thing, so use "this" (not "these"). 2) But if you use "these", you need "are" (not "is"). Correct: "This is my laptop." Pattern: This + is for one thing.', 'medium'),

('foundation', 'demonstratives-basic', 'beginner', 'Meeting your friend''s parents (standing right in front of you), you say:', '["That are my parents.", "Those are my parents.", "This is my parents.", "These are my parents."]', 3, 'Pattern: These + are + my + [people]. Parents = two people + right in front of you = near = "these". Use "these are" for people near you (more than one).', 'medium'),

('foundation', 'demonstratives-basic', 'beginner', 'In a meeting, pointing to papers on your desk, you say:', '["This documents are important.", "These documents are important.", "That documents are important.", "Those documents are important."]', 1, 'Pattern: These + [things] + are. Documents = more than one + on your desk = near you = "these". Always use "these" (not "this") with plural nouns near you.', 'medium'),

('foundation', 'demonstratives-basic', 'beginner', 'Pointing to a building across the street, which is correct?', '["This building is new.", "That building is new.", "These building is new.", "Those building is new."]', 1, 'Pattern: That + [thing] + is. Building = one thing + across the street = far away = "that". One thing far away = "that is".', 'medium'),

('foundation', 'demonstratives-basic', 'beginner', 'Your friend asks: "Whose laptop is this?" (pointing to your laptop). You say:', '["This is mine.", "That is mine.", "These are mine.", "Those are mine."]', 0, 'Pattern: This + is + mine. The laptop is near you (your friend is pointing to it close by) + one thing = "this is". "Mine" = my laptop.', 'medium'),

('foundation', 'demonstratives-basic', 'beginner', 'Rearrange: are / those / over / expensive / cars / there', '["Those cars are expensive over there", "Those are expensive cars over there", "Over there those cars are expensive", "Those expensive cars are over there"]', 1, 'Pattern: Those + are + [adjective] + [things] + over there. Order: Those (pointing far) + are + expensive (what kind) + cars (what things) + over there (where they are).', 'medium'),

('foundation', 'demonstratives-basic', 'beginner', 'At a restaurant, pointing to items on the menu (in your hand), you tell the waiter:', '["I want that items.", "I want this items.", "I want these items.", "I want those items."]', 2, 'Pattern: I want + these + [things]. Items = more than one + menu in your hand = very close = "these". Always use "these" (not "this") for plural things near you.', 'medium'),

('foundation', 'demonstratives-basic', 'beginner', 'Showing your new shoes (on your feet) to your friend, you say:', '["Look at this shoes!", "Look at that shoes!", "Look at these shoes!", "Look at those shoes!"]', 2, 'Pattern: Look at + these + [things]! Shoes = pair = two = more than one + on your feet = very close = "these". Shoes are always plural.', 'medium'),

('foundation', 'demonstratives-basic', 'beginner', 'What is the error? "That are my colleagues sitting over there."', '["Use this instead of that", "Use is instead of are", "Use those instead of that", "Nothing is wrong"]', 2, 'Pattern error: "That" = one thing, but "colleagues" = more than one. Use "those" for many people far away. Correct: "Those are my colleagues sitting over there." Those + are for many things far.', 'medium'),

-- HARD QUESTIONS (6) - Tricky usage, context switching
('foundation', 'demonstratives-basic', 'beginner', 'Which is correct for introducing your parents standing beside you to your boss?', '["This is my parents.", "These are my parents.", "That is my parents.", "Those are my parents."]', 1, 'Formal introduction pattern: These + are + my + [people]. Parents = two people + standing beside you = very close = "these". In formal situations, still use "these are" for people near you.', 'hard'),

('foundation', 'demonstratives-basic', 'beginner', 'On a phone call, talking about problems you are facing right now, you say:', '["This problems are difficult.", "These problems are difficult.", "That problems are difficult.", "Those problems are difficult."]', 1, 'Pattern: These + [things] + are. Even though you can''t touch problems (abstract things), if they are happening NOW = close to you in time = "these". Problems = more than one + current = "these".', 'hard'),

('foundation', 'demonstratives-basic', 'beginner', 'Pointing to your watch while wearing it, which is MOST natural?', '["This watch is expensive.", "This is an expensive watch.", "This is expensive watch.", "Both A and B are equally good."]', 3, 'Both are grammatically correct, but B is more natural in conversation. Pattern: This + is + a/an + [adjective] + [thing]. "This is an expensive watch" flows more naturally when showing something.', 'hard'),

('foundation', 'demonstratives-basic', 'beginner', 'Arrange correctly: were / in / those / studying / days / We / difficult', '["Those were difficult days we were studying in", "We were studying in those difficult days", "Those difficult days were we were studying in", "We were studying difficult in those days"]', 1, 'Pattern: We + were studying + in + those + [adjective] + [times]. "Those days" = past time = far away in time (not distance). Use "those" for past times: those days, those years, those times.', 'hard'),

('foundation', 'demonstratives-basic', 'beginner', 'What is wrong? "This mangoes are from my village." (holding a basket of mangoes)', '["Use that instead of this", "Use these instead of this", "Use are instead of is", "Nothing is wrong"]', 1, 'Mangoes = more than one. Pattern: These + [plural things] + are. Even though you''re holding the basket (close), mangoes = many fruits = "these" (not "this"). Correct: "These mangoes are from my village."', 'hard'),

('foundation', 'demonstratives-basic', 'beginner', 'In an email, referring to the documents you are attaching, you write:', '["Please find this attached documents.", "Please find these attached documents.", "Please find that attached documents.", "Please find those attached documents."]', 1, 'Pattern: These + attached + [things]. Documents = more than one + you are sending them NOW (present time) = close in time = "these". In emails, use "these" for things you are sending with the current email.', 'hard');

-- Verify insertion
SELECT COUNT(*) as total_inserted FROM english_questions WHERE topic_id = 'demonstratives-basic';
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
-- Phase 1, Topic 4: "Describing Things" - Basic Adjectives
-- 30 questions (12 easy, 12 medium, 6 hard)
-- Pattern-based, beginner-friendly, Indian context

INSERT INTO english_questions (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty) VALUES

-- EASY QUESTIONS (12) - Basic adjective usage
('foundation', 'adjectives-basic', 'beginner', 'This is a _____ book.', '["big", "bigger", "biggest", "more big"]', 0, 'Use simple form (no changes) when describing one thing. Pattern: a/an + [adjective] + [thing]. Just say the adjective directly: big book, small car, nice person.', 'easy'),

('foundation', 'adjectives-basic', 'beginner', 'She is _____.', '["beautiful", "beauty", "beautifully", "more beautiful"]', 0, 'Use adjective after "is" to describe a person. Pattern: She/He/It + is + [adjective]. "Beautiful" describes how she looks.', 'easy'),

('foundation', 'adjectives-basic', 'beginner', 'Mumbai is a _____ city.', '["busy", "busily", "business", "busier"]', 0, 'Use simple adjective form. Pattern: a + [adjective] + [thing]. "Busy" describes the city (has many people/activity).', 'easy'),

('foundation', 'adjectives-basic', 'beginner', 'The weather is _____ today.', '["hot", "hotly", "hotter", "hottest"]', 0, 'Use simple form after "is" when describing one situation. Pattern: The [thing] + is + [adjective]. Just use "hot" (no changes needed).', 'easy'),

('foundation', 'adjectives-basic', 'beginner', 'I have a _____ car.', '["red", "redly", "more red", "reddest"]', 0, 'Use color adjectives in simple form. Pattern: a + [color] + [thing]. Colors never change: red car, blue shirt, green bag.', 'easy'),

('foundation', 'adjectives-basic', 'beginner', 'This mango is _____.', '["sweet", "sweetly", "sweeter", "sweetest"]', 0, 'Use simple adjective to describe taste. Pattern: This + [thing] + is + [adjective]. Sweet describes the taste of the mango.', 'easy'),

('foundation', 'adjectives-basic', 'beginner', 'He is a _____ student.', '["good", "well", "better", "best"]', 0, 'Use "good" before nouns. Pattern: a + [adjective] + [person]. "Good student" = studies well. (Don''t use "well" here - that''s for actions).', 'easy'),

('foundation', 'adjectives-basic', 'beginner', 'The Taj Mahal is _____.', '["beautiful", "beauty", "beautifully", "more beautiful"]', 0, 'Use adjective after "is" for descriptions. Pattern: The [place/thing] + is + [adjective]. Beautiful describes how it looks.', 'easy'),

('foundation', 'adjectives-basic', 'beginner', 'She has _____ eyes.', '["brown", "brownly", "more brown", "brownest"]', 0, 'Use color adjectives directly. Pattern: [adjective] + [body part]. Colors are always simple: brown eyes, black hair, fair skin.', 'easy'),

('foundation', 'adjectives-basic', 'beginner', 'This is an _____ house.', '["old", "older", "oldest", "more old"]', 0, 'Use simple form when describing one thing. Pattern: an + [adjective] + [thing]. Old (simple form) = not new.', 'easy'),

('foundation', 'adjectives-basic', 'beginner', 'The food is _____.', '["delicious", "deliciously", "more delicious", "most delicious"]', 0, 'Use simple adjective after "is". Pattern: The [thing] + is + [adjective]. Delicious = tastes very good.', 'easy'),

('foundation', 'adjectives-basic', 'beginner', 'He is a _____ person.', '["kind", "kindly", "kinder", "kindness"]', 0, 'Use adjective to describe a person. Pattern: a + [adjective] + person. Kind = helpful and nice to others.', 'easy'),

-- MEDIUM QUESTIONS (12) - Adjective order and usage
('foundation', 'adjectives-basic', 'beginner', 'Choose the correct order:', '["a beautiful big house", "a big beautiful house", "beautiful a big house", "big a house beautiful"]', 1, 'Pattern: a + [size] + [opinion] + [thing]. Order rule: SIZE comes before OPINION. Say: a big beautiful house (size first, then how you feel about it).', 'medium'),

('foundation', 'adjectives-basic', 'beginner', 'What is wrong? "She has hairs black long."', '["Say black long hairs", "Say long black hair", "Say hairs long black", "Nothing is wrong"]', 1, 'Two problems: 1) "Hair" (not "hairs") - uncountable. 2) Order: LENGTH + COLOR + thing. Correct: "She has long black hair." Pattern: [length] + [color] + [noun].', 'medium'),

('foundation', 'adjectives-basic', 'beginner', 'Arrange correctly: expensive / an / watch / This / is', '["This is an expensive watch", "This an expensive watch is", "An expensive watch this is", "Expensive watch is this an"]', 0, 'Pattern: This + is + an + [adjective] + [thing]. Order: This (pointing) + is (verb) + an expensive (what kind) + watch (what).', 'medium'),

('foundation', 'adjectives-basic', 'beginner', 'At a shop, asking about a shirt, you say:', '["Do you have this in large?", "Do you have this in big?", "Do you have this in great?", "Do you have this in huge?"]', 0, 'For clothing sizes, use: small, medium, large, extra large. Pattern: in + [size]. Don''t use "big" for sizes - use "large". Common sizes: S, M, L, XL.', 'medium'),

('foundation', 'adjectives-basic', 'beginner', 'Choose the natural sentence:', '["He drives a Japanese new car.", "He drives a new Japanese car.", "He drives new a Japanese car.", "He drives Japanese a new car."]', 1, 'Pattern: a + [age] + [origin] + [thing]. Order: NEW (age) before JAPANESE (where it''s from). Always: age → nationality/origin → noun.', 'medium'),

('foundation', 'adjectives-basic', 'beginner', 'What is the error? "This is a very book interesting."', '["Say very interesting book", "Say book very interesting", "Say interesting very book", "No error"]', 0, 'Pattern: a + [adverb] + [adjective] + [thing]. "Very" goes BEFORE the adjective. Correct: "This is a very interesting book." Order: very (how much) + interesting (what kind) + book.', 'medium'),

('foundation', 'adjectives-basic', 'beginner', 'Describing your phone, which is correct?', '["I have a phone black new.", "I have a new black phone.", "I have black a new phone.", "I have a black new phone."]', 1, 'Pattern: a + [age] + [color] + [thing]. Order: NEW (age) before BLACK (color). Always: age → color → noun. Say: a new black phone.', 'medium'),

('foundation', 'adjectives-basic', 'beginner', 'Rearrange: beautiful / has / India / temples / many / old', '["India has many old beautiful temples", "India has many beautiful old temples", "India has beautiful many old temples", "Many beautiful old temples India has"]', 1, 'Pattern: [Subject] + has + many + [adjective] + [adjective] + [things]. Order: many (quantity) + beautiful (opinion) + old (age) + temples. Quantity → opinion → age → noun.', 'medium'),

('foundation', 'adjectives-basic', 'beginner', 'At a restaurant, talking about the food, you say:', '["The food tastes well.", "The food tastes good.", "The food tastes goodly.", "The food tastes fine well."]', 1, 'After "tastes" (sense verb), use adjective "good" (not adverb "well"). Pattern: [Food] + tastes + [adjective]. Sense verbs (tastes, looks, smells, feels) use adjectives, not adverbs.', 'medium'),

('foundation', 'adjectives-basic', 'beginner', 'What is wrong? "He is a manager very efficient."', '["Say very efficient manager", "Say manager efficient very", "Say efficient very manager", "Nothing wrong"]', 0, 'Pattern: a + [adverb] + [adjective] + [noun]. The phrase "very efficient" must come BEFORE "manager". Correct: "He is a very efficient manager." Don''t split adjective phrases.', 'medium'),

('foundation', 'adjectives-basic', 'beginner', 'Choose the correct sentence:', '["She bought a silk beautiful saree.", "She bought a beautiful silk saree.", "She bought beautiful a silk saree.", "She bought silk a beautiful saree."]', 1, 'Pattern: a + [opinion] + [material] + [thing]. Order: BEAUTIFUL (opinion) before SILK (material). Always: opinion → material → noun. Say: a beautiful silk saree.', 'medium'),

('foundation', 'adjectives-basic', 'beginner', 'Talking about your day, which is natural?', '["I had a day very tiring.", "I had a very tiring day.", "I had very a tiring day.", "I had tiring a very day."]', 1, 'Pattern: a + very + [adjective] + [noun]. "Very tiring" stays together before "day". Order: a + very (how much) + tiring (what kind) + day (what). Natural flow.', 'medium'),

-- HARD QUESTIONS (6) - Complex adjective usage
('foundation', 'adjectives-basic', 'beginner', 'Which follows the correct adjective order?', '["a beautiful old small wooden Indian box", "a small old beautiful Indian wooden box", "a beautiful small old wooden Indian box", "a small beautiful old wooden Indian box"]', 2, 'Complete order: Opinion → Size → Age → Material → Origin → Noun. Correct: beautiful (opinion) → small (size) → old (age) → wooden (material) → Indian (origin) → box. This is the fixed sequence in English.', 'hard'),

('foundation', 'adjectives-basic', 'beginner', 'Find the error: "This is the more unique solution."', '["Use most unique", "Use very unique", "Use just unique (no more)", "No error"]', 2, 'Unique = one of a kind (absolute). Can''t be "more unique" or "most unique". Pattern: Absolute adjectives (perfect, unique, dead, pregnant) don''t take more/most. Just say "unique" or "very unusual".', 'hard'),

('foundation', 'adjectives-basic', 'beginner', 'In formal writing, which is preferred?', '["The project is real challenging.", "The project is really challenging.", "The project is very much challenging.", "The project is too much challenging."]', 1, 'In formal English, use "really" (adverb) before adjectives. Pattern: really + [adjective]. "Real" is informal. Professional writing: really challenging, really important, really difficult.', 'hard'),

('foundation', 'adjectives-basic', 'beginner', 'Arrange correctly: rectangular / bought / large / table / a / We / wooden / brown / new', '["We bought a large new rectangular brown wooden table", "We bought a new large brown rectangular wooden table", "We bought a large new brown rectangular wooden table", "We bought a brown large new rectangular wooden table"]', 0, 'Full order: Size → Age → Shape → Color → Material. Correct: large (size) → new (age) → rectangular (shape) → brown (color) → wooden (material) → table. This is the standard sequence.', 'hard'),

('foundation', 'adjectives-basic', 'beginner', 'What is wrong? "She seems very much tired today."', '["Say very tired (remove much)", "Say much very tired", "Say too much tired", "Nothing wrong"]', 0, 'Pattern: very + [adjective] (no "much" needed). "Very much" is used with verbs, not adjectives. Correct: "She seems very tired." Use "very" alone with adjectives.', 'hard'),

('foundation', 'adjectives-basic', 'beginner', 'Which sentence is grammatically perfect?', '["I want a silver, round, large mirror.", "I want a large, round, silver mirror.", "I want a round, large, silver mirror.", "I want a silver, large, round mirror."]', 1, 'Perfect order with commas: Size, Shape, Material. Correct: large (size), round (shape), silver (material) mirror. When listing adjectives before a noun, use this sequence and separate with commas.', 'hard');

-- Verify insertion
SELECT COUNT(*) as total_inserted FROM english_questions WHERE topic_id = 'adjectives-basic';

-- ============================================
-- FINAL VERIFICATION
-- ============================================

-- Count questions by topic
SELECT 
  topic_id,
  COUNT(*) as total_questions,
  COUNT(CASE WHEN difficulty = 'easy' THEN 1 END) as easy,
  COUNT(CASE WHEN difficulty = 'medium' THEN 1 END) as medium,
  COUNT(CASE WHEN difficulty = 'hard' THEN 1 END) as hard
FROM english_questions
WHERE topic_id IN ('be-verb-present', 'demonstratives-basic', 'have-got-basic', 'adjectives-basic')
GROUP BY topic_id
ORDER BY topic_id;

-- Total count for Phase 1 (excluding articles which already exists)
SELECT COUNT(*) as phase1_total 
FROM english_questions 
WHERE topic_id IN ('be-verb-present', 'demonstratives-basic', 'have-got-basic', 'adjectives-basic');

-- Expected result: 120 questions total (30 per topic × 4 topics)
