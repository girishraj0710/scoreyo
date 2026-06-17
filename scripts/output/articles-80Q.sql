-- ============================================================================
-- FOUNDATION PATH: Articles Mastery (COMPLETE)
-- Topic ID: articles
-- Level: beginner (A1)
-- Total: 80 questions covering ALL 4 subtopics
-- ============================================================================
-- Subtopics covered:
--   1. 'a' before consonants - 20 questions
--   2. 'an' before vowels - 20 questions
--   3. 'the' for specific - 20 questions
--   4. Zero Article - 20 questions
-- Distribution: 32 easy, 32 medium, 16 hard (40/40/20)
-- ============================================================================

INSERT INTO english_questions (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty) VALUES

-- ============================================================================
-- SUBTOPIC 1: 'a' before consonants (20 questions)
-- ============================================================================

-- EASY (8 questions)
('foundation', 'articles', 'beginner', '"I have _____ cat."', '["a", "an", "the", "no article"]', 0, 'Use: a before consonant sounds. "cat" starts with /k/ (consonant sound). Pattern: a + consonant sound.', 'easy'),

('foundation', 'articles', 'beginner', '"She is _____ teacher."', '["a", "an", "the", "no article"]', 0, 'Use: a before consonant sounds. "teacher" starts with /t/ (consonant). Pattern: a + consonant.', 'easy'),

('foundation', 'articles', 'beginner', '"He has _____ dog."', '["a", "an", "the", "no article"]', 0, 'Use: a before consonant sounds. "dog" starts with /d/ (consonant). Pattern: a + consonant.', 'easy'),

('foundation', 'articles', 'beginner', '"I need _____ pen."', '["a", "an", "the", "no article"]', 0, 'Use: a before consonant sounds. "pen" starts with /p/ (consonant). Pattern: a + consonant.', 'easy'),

('foundation', 'articles', 'beginner', '"There is _____ book on the table."', '["a", "an", "the", "no article"]', 0, 'Use: a = one book (not specific which). "book" starts with /b/ (consonant). Pattern: a + consonant + noun.', 'easy'),

('foundation', 'articles', 'beginner', '"She wants _____ car."', '["a", "an", "the", "no article"]', 0, 'Use: a = any car (general). "car" starts with /k/ (consonant). Pattern: a + consonant.', 'easy'),

('foundation', 'articles', 'beginner', '"I saw _____ bird."', '["a", "an", "the", "no article"]', 0, 'Use: a = one bird (not specific). "bird" starts with /b/ (consonant). Pattern: a + consonant.', 'easy'),

('foundation', 'articles', 'beginner', 'Use "a" before words starting with:', '["vowel sounds", "consonant sounds", "the letter h", "plural nouns"]', 1, 'Rule: a before consonant sounds (b, c, d, f, g...). an before vowel sounds (a, e, i, o, u). Sound matters, not letter!', 'easy'),

-- MEDIUM (8 questions)
('foundation', 'articles', 'beginner', 'What is wrong? "She is an doctor."', '["Use: a instead of an", "Remove: article", "Use: the instead of an", "Nothing wrong"]', 0, 'Consonant sound = a (not an). "doctor" starts with /d/ (consonant). Correct: "She is a doctor."', 'medium'),

('foundation', 'articles', 'beginner', 'Choose correct: "I bought _____ new phone."', '["a", "an", "the", "no article"]', 0, 'First mention + consonant sound = a. "new" starts with /n/ (consonant). Pattern: a + adjective (consonant) + noun.', 'medium'),

('foundation', 'articles', 'beginner', 'Error in: "He is an student."', '["Use: a instead of an", "Remove: article", "Use: the instead of an", "Nothing wrong"]', 0, 'Consonant sound = a. "student" starts with /s/ (consonant). Correct: "He is a student."', 'medium'),

('foundation', 'articles', 'beginner', 'Arrange: university / at / She / studies / a', '["She studies at a university", "She studies at an university", "She studies at university", "She studies at the university"]', 0, 'Consonant sound /j/ = a. "university" sounds like "YOU-ni" (consonant /j/). Correct: "a university" (not an).', 'medium'),

('foundation', 'articles', 'beginner', 'Which is correct?', '["a umbrella", "an umbrella", "a uniform", "Both B and C"]', 3, 'Sound matters! "umbrella" = /ʌ/ (vowel) = an umbrella. "uniform" = /j/ (consonant) = a uniform. Both correct!', 'medium'),

('foundation', 'articles', 'beginner', 'What is the error? "I have an table."', '["Use: a instead of an", "Remove: article", "Use: the instead of an", "Nothing wrong"]', 0, 'Consonant sound = a. "table" starts with /t/ (consonant). Correct: "I have a table."', 'medium'),

('foundation', 'articles', 'beginner', 'Rearrange: bought / I / new / laptop / a', '["I bought a new laptop", "I bought an new laptop", "I bought the new laptop", "I bought new laptop"]', 0, 'First mention + consonant = a. "new" starts with /n/ (consonant). Pattern: a + adjective + noun.', 'medium'),

('foundation', 'articles', 'beginner', 'Choose: "He drives _____ truck."', '["a", "an", "the", "no article"]', 0, 'General reference + consonant = a. "truck" starts with /t/ (consonant). Pattern: a + noun (any truck).', 'medium'),

-- HARD (4 questions)
('foundation', 'articles', 'beginner', 'Which is WRONG?', '["a university", "a European country", "a one-way street", "a hour"]', 3, '"hour" starts with VOWEL sound /aʊ/ (silent h). Correct: "an hour." Others: /j/ or /w/ sounds (consonants) = a.', 'hard'),

('foundation', 'articles', 'beginner', 'Arrange: useful / is / This / tool / a', '["This is a useful tool", "This is an useful tool", "This is useful tool", "This is the useful tool"]', 0, '"useful" = /j/ sound (YOU-se-ful) = consonant. Use: a useful tool (not an). Sound determines article!', 'hard'),

('foundation', 'articles', 'beginner', 'Error: "She is an honest woman."', '["Use: a instead of an", "Remove: article", "Use: the instead of an", "Nothing wrong"]', 3, 'Correct! "honest" = silent h, vowel sound /ɒ/. Use: an honest (vowel sound). Common exception!', 'hard'),

('foundation', 'articles', 'beginner', 'Which is correct formal writing?', '["a historical event", "an historical event", "a history book", "Both A and C"]', 3, 'Modern: "a historical" (h pronounced). British old style: "an historical" (h silent). "a history" = always. Context: both A and C correct!', 'hard'),

-- ============================================================================
-- SUBTOPIC 2: 'an' before vowels (20 questions)
-- ============================================================================

-- EASY (8 questions)
('foundation', 'articles', 'beginner', '"I ate _____ apple."', '["a", "an", "the", "no article"]', 1, 'Use: an before vowel sounds. "apple" starts with /æ/ (vowel). Pattern: an + vowel sound.', 'easy'),

('foundation', 'articles', 'beginner', '"She is _____ engineer."', '["a", "an", "the", "no article"]', 1, 'Use: an before vowel sounds. "engineer" starts with /e/ (vowel). Pattern: an + vowel.', 'easy'),

('foundation', 'articles', 'beginner', '"He has _____ umbrella."', '["a", "an", "the", "no article"]', 1, 'Use: an before vowel sounds. "umbrella" starts with /ʌ/ (vowel). Pattern: an + vowel.', 'easy'),

('foundation', 'articles', 'beginner', '"I need _____ eraser."', '["a", "an", "the", "no article"]', 1, 'Use: an before vowel sounds. "eraser" starts with /ɪ/ (vowel). Pattern: an + vowel.', 'easy'),

('foundation', 'articles', 'beginner', '"There is _____ elephant in the zoo."', '["a", "an", "the", "no article"]', 1, 'Use: an = one elephant (not specific). "elephant" starts with /e/ (vowel). Pattern: an + vowel.', 'easy'),

('foundation', 'articles', 'beginner', '"She wants _____ ice cream."', '["a", "an", "the", "no article"]', 1, 'Use: an before vowel sounds. "ice" starts with /aɪ/ (vowel). Pattern: an + vowel.', 'easy'),

('foundation', 'articles', 'beginner', '"I saw _____ owl."', '["a", "an", "the", "no article"]', 1, 'Use: an before vowel sounds. "owl" starts with /aʊ/ (vowel). Pattern: an + vowel.', 'easy'),

('foundation', 'articles', 'beginner', 'Use "an" before words starting with:', '["vowel sounds", "consonant sounds", "the letter u", "plural nouns"]', 0, 'Rule: an before vowel sounds (a, e, i, o, u). a before consonant sounds. Sound determines article, not spelling!', 'easy'),

-- MEDIUM (8 questions)
('foundation', 'articles', 'beginner', 'What is wrong? "He is a engineer."', '["Use: an instead of a", "Remove: article", "Use: the instead of a", "Nothing wrong"]', 0, 'Vowel sound = an (not a). "engineer" starts with /e/ (vowel). Correct: "He is an engineer."', 'medium'),

('foundation', 'articles', 'beginner', 'Choose correct: "I bought _____ orange shirt."', '["a", "an", "the", "no article"]', 1, 'First mention + vowel sound = an. "orange" starts with /ɒ/ (vowel). Pattern: an + adjective (vowel) + noun.', 'medium'),

('foundation', 'articles', 'beginner', 'Error in: "She wants a umbrella."', '["Use: an instead of a", "Remove: article", "Use: the instead of a", "Nothing wrong"]', 0, 'Vowel sound = an. "umbrella" starts with /ʌ/ (vowel). Correct: "She wants an umbrella."', 'medium'),

('foundation', 'articles', 'beginner', 'Arrange: hour / an / for / waited / I', '["I waited for an hour", "I waited for a hour", "I waited for hour", "I waited for the hour"]', 0, 'Silent h = vowel sound /aʊ/ = an. "hour" pronounced /aʊər/. Correct: "an hour" (not a hour).', 'medium'),

('foundation', 'articles', 'beginner', 'Which is correct?', '["an university", "a university", "an umbrella", "Both B and C"]', 3, 'Sound determines article! "university" = /j/ (consonant) = a. "umbrella" = /ʌ/ (vowel) = an. Both correct!', 'medium'),

('foundation', 'articles', 'beginner', 'What is the error? "I need a apple."', '["Use: an instead of a", "Remove: article", "Use: the instead of a", "Nothing wrong"]', 0, 'Vowel sound = an. "apple" starts with /æ/ (vowel). Correct: "I need an apple."', 'medium'),

('foundation', 'articles', 'beginner', 'Rearrange: interesting / She / an / told / story', '["She told an interesting story", "She told a interesting story", "She told the interesting story", "She told interesting story"]', 0, 'First mention + vowel sound = an. "interesting" starts with /ɪ/ (vowel). Pattern: an + adjective + noun.', 'medium'),

('foundation', 'articles', 'beginner', 'Choose: "He is _____ artist."', '["a", "an", "the", "no article"]', 1, 'Profession + vowel sound = an. "artist" starts with /ɑː/ (vowel). Pattern: an + profession.', 'medium'),

-- HARD (4 questions)
('foundation', 'articles', 'beginner', 'Which is WRONG?', '["an hour", "an honest person", "an umbrella", "an university"]', 3, '"university" = /j/ sound (YOU-ni) = consonant. Correct: "a university." Others have vowel sounds = an.', 'hard'),

('foundation', 'articles', 'beginner', 'Arrange: European / He / is / official / an', '["He is an European official", "He is a European official", "He is European official", "He is the European official"]', 1, '"European" = /j/ sound (YU-ro) = consonant. Use: a European (not an). Sound determines article!', 'hard'),

('foundation', 'articles', 'beginner', 'Error: "I waited for a hour."', '["Use: an instead of a", "Remove: article", "Use: the instead of a", "Nothing wrong"]', 0, '"hour" = silent h = vowel sound /aʊ/. Correct: "I waited for an hour." Common mistake!', 'hard'),

('foundation', 'articles', 'beginner', 'Which is correct formal writing?', '["an unique opportunity", "a unique opportunity", "an university student", "Both A and C"]', 1, '"unique" = /j/ sound (YU-neek) = consonant. Correct: "a unique opportunity" (not an). Sound-based rule!', 'hard'),

-- ============================================================================
-- SUBTOPIC 3: 'the' for specific (20 questions)
-- ============================================================================

-- EASY (8 questions)
('foundation', 'articles', 'beginner', '"_____ sun is bright." (only one sun)', '["A", "An", "The", "No article"]', 2, 'Use: the for unique/specific things. Only one sun exists = specific. Pattern: the + unique noun.', 'easy'),

('foundation', 'articles', 'beginner', '"_____ moon is beautiful tonight."', '["A", "An", "The", "No article"]', 2, 'Use: the for unique things. Only one moon (for Earth) = specific. Pattern: the + unique.', 'easy'),

('foundation', 'articles', 'beginner', '"Close _____ door, please." (specific door nearby)', '["a", "an", "the", "no article"]', 2, 'Use: the for specific (both know which door). Pattern: the + specific noun (context-clear).', 'easy'),

('foundation', 'articles', 'beginner', '"_____ book you gave me is good." (specific book)', '["A", "An", "The", "No article"]', 2, 'Use: the for specific book (you gave me). Already mentioned/known. Pattern: the + specific.', 'easy'),

('foundation', 'articles', 'beginner', '"I live near _____ park." (second mention)', '["a", "an", "the", "no article"]', 2, 'Use: the for second mention (already introduced). First: "a park." Second: "the park." Pattern: a → the.', 'easy'),

('foundation', 'articles', 'beginner', '"_____ Taj Mahal is in India." (proper noun)', '["A", "An", "The", "No article"]', 2, 'Use: the before some proper nouns (monuments, buildings). Pattern: The + proper noun (monuments).', 'easy'),

('foundation', 'articles', 'beginner', '"She is _____ best student."', '["a", "an", "the", "no article"]', 2, 'Use: the before superlatives (best, tallest, fastest). Pattern: the + superlative + noun.', 'easy'),

('foundation', 'articles', 'beginner', 'Use "the" for:', '["specific/known things", "first mention", "plural nouns always", "professions"]', 0, 'Rule: the for specific (both speaker and listener know which one). a/an for first mention/general.', 'easy'),

-- MEDIUM (8 questions)
('foundation', 'articles', 'beginner', 'What is wrong? "I saw a movie. A movie was great."', '["Use: The instead of second A", "Use: An instead of A", "Remove: second article", "Nothing wrong"]', 0, 'Second mention = the (specific). Correct: "I saw a movie. The movie was great." Pattern: a (first) → the (second).', 'medium'),

('foundation', 'articles', 'beginner', 'Choose correct: "_____ Earth orbits the Sun."', '["A", "An", "The", "No article"]', 2, 'Unique planet = the. Pattern: The + proper noun (planets, oceans, rivers). "The Earth" = specific.', 'medium'),

('foundation', 'articles', 'beginner', 'Error in: "She is a tallest girl in class."', '["Use: the instead of a", "Remove: article", "Use: an instead of a", "Nothing wrong"]', 0, 'Superlative = the (not a). Correct: "She is the tallest girl." Pattern: the + superlative.', 'medium'),

('foundation', 'articles', 'beginner', 'Arrange: sky / at / Look / the', '["Look at the sky", "Look at a sky", "Look at sky", "Look at an sky"]', 0, 'Unique/only one = the. Only one sky above us = specific. Pattern: the + unique noun.', 'medium'),

('foundation', 'articles', 'beginner', 'Which is correct?', '["a first day", "the first day", "an first day", "first day"]', 1, 'Ordinal numbers (first, second) = the. Pattern: the + first/second/third + noun. Correct: "the first day."', 'medium'),

('foundation', 'articles', 'beginner', 'What is the error? "I visited a Taj Mahal."', '["Use: the instead of a", "Remove: article", "Use: an instead of a", "Nothing wrong"]', 0, 'Specific monument = the. Correct: "I visited the Taj Mahal." Pattern: the + specific proper noun (monuments).', 'medium'),

('foundation', 'articles', 'beginner', 'Rearrange: most / is / He / person / intelligent / a', '["He is a most intelligent person", "He is the most intelligent person", "He is most intelligent person", "He is an most intelligent person"]', 1, 'Superlative = the. Pattern: the + most + adjective + noun. Correct: "He is the most intelligent person."', 'medium'),

('foundation', 'articles', 'beginner', 'Choose: "Please pass _____ salt." (on table, visible)', '["a", "an", "the", "no article"]', 2, 'Specific (both see it) = the. Context makes it clear which salt. Pattern: the + specific noun.', 'medium'),

-- HARD (4 questions)
('foundation', 'articles', 'beginner', 'Which is WRONG?', '["the sun", "the moon", "the Mars", "the sky"]', 2, 'Planets without "the": Mars, Venus, Jupiter. Correct: "Mars" (no article). Exception: "The Earth" sometimes OK. Unique celestial = the (sun, moon, sky).', 'hard'),

('foundation', 'articles', 'beginner', 'Arrange: I / ate / breakfast / I / Then / went / school / to', '["I ate breakfast. Then I went to school", "I ate the breakfast. Then I went to the school", "I ate a breakfast. Then I went to a school", "I ate breakfast. Then I went to the school"]', 0, 'Meals = no article (breakfast, lunch). Activities = no article (go to school). Correct: "ate breakfast" + "went to school."', 'hard'),

('foundation', 'articles', 'beginner', 'Error: "She plays the piano. He plays guitar."', '["Add: the before guitar", "Remove: the before piano", "Use: a before guitar", "Nothing wrong"]', 0, 'Musical instruments = the. Correct: "plays the piano" + "plays the guitar." Pattern: play + the + instrument.', 'hard'),

('foundation', 'articles', 'beginner', 'Which is correct formal writing?', '["the India", "India", "the Mount Everest", "Mount Everest"]', 1, 'Countries = no article (India, France). Mountains = no article (Mount Everest). Rivers = the (the Ganga). Correct: "India" (no the).', 'hard'),

-- ============================================================================
-- SUBTOPIC 4: Zero Article (20 questions)
-- ============================================================================

-- EASY (8 questions)
('foundation', 'articles', 'beginner', '"I like _____ music." (general)', '["a", "an", "the", "no article"]', 3, 'General/uncountable = no article. "music" = general (not specific music). Pattern: no article + uncountable.', 'easy'),

('foundation', 'articles', 'beginner', '"_____ water is important." (general)', '["A", "An", "The", "No article"]', 3, 'General/uncountable = no article. "water" = general concept. Pattern: No article + uncountable noun.', 'easy'),

('foundation', 'articles', 'beginner', '"I go to _____ school." (activity)', '["a", "an", "the", "no article"]', 3, 'Activity/purpose = no article. "go to school" = attend as student (not building). Pattern: go to + place (activity).', 'easy'),

('foundation', 'articles', 'beginner', '"She is at _____ home." (location)', '["a", "an", "the", "no article"]', 3, 'Home = no article (fixed expression). Always: "at home" (not "at the home"). Pattern: at home.', 'easy'),

('foundation', 'articles', 'beginner', '"I eat _____ breakfast at 8 AM."', '["a", "an", "the", "no article"]', 3, 'Meals = no article. breakfast, lunch, dinner = no article. Pattern: eat + meal (no article).', 'easy'),

('foundation', 'articles', 'beginner', '"_____ life is beautiful." (abstract)', '["A", "An", "The", "No article"]', 3, 'Abstract nouns (general) = no article. "life" = general concept. Pattern: No article + abstract.', 'easy'),

('foundation', 'articles', 'beginner', '"I play _____ cricket."', '["a", "an", "the", "no article"]', 3, 'Sports = no article. play cricket, play football = no article. Pattern: play + sport (no article).', 'easy'),

('foundation', 'articles', 'beginner', 'No article needed for:', '["general plural nouns", "specific singular nouns", "superlatives", "unique objects"]', 0, 'Zero article: general plurals (dogs = all dogs), uncountables (water), activities (go to school), sports (play cricket).', 'easy'),

-- MEDIUM (8 questions)
('foundation', 'articles', 'beginner', 'What is wrong? "I love the music."', '["Remove: the", "Use: a instead of the", "Use: an instead of the", "Nothing wrong"]', 0, 'General music = no article. Correct: "I love music." "the music" = specific music only. Remove article for general!', 'medium'),

('foundation', 'articles', 'beginner', 'Choose correct: "_____ dogs are loyal animals." (general)', '["A", "An", "The", "No article"]', 3, 'General plural = no article. "dogs" = all dogs (general). Pattern: No article + plural (general). "The dogs" = specific dogs.', 'medium'),

('foundation', 'articles', 'beginner', 'Error in: "I go to the school every day."', '["Remove: the", "Use: a instead of the", "Use: an instead of the", "Nothing wrong"]', 0, 'Activity = no article. "go to school" = attend (activity). "go to the school" = specific building. Correct: "go to school" (activity).', 'medium'),

('foundation', 'articles', 'beginner', 'Arrange: by / travel / bus / I', '["I travel by bus", "I travel by a bus", "I travel by the bus", "I travel bus"]', 0, 'Transport (general) = no article. by bus, by car, by train = no article. Pattern: by + transport (no article).', 'medium'),

('foundation', 'articles', 'beginner', 'Which is correct?', '["She is in the hospital (visitor)", "She is in hospital (patient)", "She is in a hospital (location)", "All can be correct"]', 3, 'Context matters! "in hospital" (patient, British). "in the hospital" (visitor/American). "in a hospital" (any hospital). All contexts valid!', 'medium'),

('foundation', 'articles', 'beginner', 'What is the error? "I had the lunch at noon."', '["Remove: the", "Use: a instead of the", "Use: an instead of the", "Nothing wrong"]', 0, 'Meals = no article. Correct: "I had lunch at noon." "the lunch" = specific lunch only. Remove article!', 'medium'),

('foundation', 'articles', 'beginner', 'Rearrange: bed / at / I / 10 / to / PM / go', '["I go to bed at 10 PM", "I go to the bed at 10 PM", "I go to a bed at 10 PM", "I go bed at 10 PM"]', 0, 'Activity = no article. "go to bed" = sleep (activity). "go to the bed" = approach furniture. Pattern: go to bed.', 'medium'),

('foundation', 'articles', 'beginner', 'Choose: "I study _____ English."', '["a", "an", "the", "no article"]', 3, 'Languages = no article. English, Hindi, French = no article. Pattern: study/speak + language (no article).', 'medium'),

-- HARD (4 questions)
('foundation', 'articles', 'beginner', 'Which is WRONG?', '["I love music", "I play cricket", "I go to school", "I eat the breakfast"]', 3, 'Meals = no article. Correct: "I eat breakfast" (not the breakfast). Others: music/sports/school activity = no article.', 'hard'),

('foundation', 'articles', 'beginner', 'Arrange: freedom / important / for / is / humans / The', '["The freedom is important for humans", "Freedom is important for humans", "A freedom is important for humans", "Freedom is important for the humans"]', 1, 'Abstract (general) = no article. "freedom" + "humans" (general) = both no article. Correct: "Freedom is important for humans."', 'hard'),

('foundation', 'articles', 'beginner', 'Error: "She is in the prison for theft."', '["Remove: the (if prisoner)", "Keep: the (if visitor)", "Use: a instead of the", "Both A and B"]', 3, 'Context! "in prison" (prisoner, activity). "in the prison" (visitor, location). Both grammatically correct, different meanings!', 'hard'),

('foundation', 'articles', 'beginner', 'Which is correct formal writing?', '["The patience is a virtue", "Patience is a virtue", "A patience is a virtue", "Patience is the virtue"]', 1, 'Abstract (general) = no article. Correct: "Patience is a virtue." Abstract nouns: love, freedom, patience = no article (general).', 'hard');

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

SELECT 'Articles Question Count Check' as check_name;
SELECT COUNT(*) as total_questions FROM english_questions WHERE topic_id = 'articles';

-- Expected output: 80 questions
-- Breakdown: 20 per subtopic × 4 subtopics = 80
