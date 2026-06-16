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
