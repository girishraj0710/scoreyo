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
