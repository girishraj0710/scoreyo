-- ============================================================================
-- FOUNDATION PATH: Present Simple Tense (Consolidated)
-- Topic ID: present-simple
-- Level: beginner (A1)
-- Total: 100 questions covering ALL 5 subtopics
-- ============================================================================
-- Subtopics covered:
--   1. Basic Structure (I/You/We/They + base verb) - 20 questions
--   2. Adding -s/-es (He/She/It forms) - 20 questions
--   3. Negative Form (don't/doesn't) - 20 questions
--   4. Questions (Do/Does questions) - 20 questions
--   5. Time Expressions (frequency adverbs, time markers) - 20 questions
-- Distribution: 40 easy, 40 medium, 20 hard per 100 questions
-- ============================================================================

INSERT INTO english_questions (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty) VALUES

-- ============================================================================
-- SUBTOPIC 1: BASIC STRUCTURE (I/You/We/They + base verb) - 20 questions
-- ============================================================================

-- EASY (8 questions)
('foundation', 'present-simple', 'beginner', 'I _____ to work every day.', '["go", "goes", "going", "went"]', 0, 'Basic Structure: I/You/We/They + base verb. Use "go" (no changes). Present simple shows daily routines.', 'easy'),

('foundation', 'present-simple', 'beginner', 'They _____ cricket on Sundays.', '["play", "plays", "playing", "played"]', 0, 'Basic Structure: They + base verb. Use "play" (no -s). Present simple for regular activities.', 'easy'),

('foundation', 'present-simple', 'beginner', 'We _____ in Mumbai.', '["live", "lives", "living", "lived"]', 0, 'Basic Structure: We + base verb. Use "live" (no changes). Present simple for permanent situations.', 'easy'),

('foundation', 'present-simple', 'beginner', 'You _____ English very well.', '["speak", "speaks", "speaking", "spoke"]', 0, 'Basic Structure: You + base verb. Always "speak" (never "speaks") with "you". Present simple for abilities.', 'easy'),

('foundation', 'present-simple', 'beginner', 'I _____ coffee every morning.', '["drink", "drinks", "drinking", "drank"]', 0, 'Basic Structure: I + base verb. Use "drink" (simple form). Present simple for daily habits.', 'easy'),

('foundation', 'present-simple', 'beginner', 'They _____ in a software company.', '["work", "works", "working", "worked"]', 0, 'Basic Structure: They + base verb. No -s with plural subjects. Present simple for jobs/occupations.', 'easy'),

('foundation', 'present-simple', 'beginner', 'We _____ Indian food.', '["like", "likes", "liking", "liked"]', 0, 'Basic Structure: We + base verb. Use "like" (no changes). Present simple for preferences.', 'easy'),

('foundation', 'present-simple', 'beginner', 'You _____ hard.', '["study", "studies", "studying", "studied"]', 0, 'Basic Structure: You + base verb. Use "study" (no -ies). Present simple for general statements.', 'easy'),

-- MEDIUM (8 questions)
('foundation', 'present-simple', 'beginner', 'Choose the correct sentence:', '["I works from home.", "I work from home.", "I working from home.", "I am work from home."]', 1, 'Basic Structure: I + base verb. Correct: "I work from home." No -s with I/you/we/they. Present simple (not continuous) for regular work arrangement.', 'medium'),

('foundation', 'present-simple', 'beginner', 'Arrange correctly: every / tea / drink / morning / We', '["We drink tea every morning", "We every morning drink tea", "Every morning we drink tea", "Tea we drink every morning"]', 0, 'Basic Structure: Subject + verb + object + time. Natural order: "We drink tea every morning." Time expression usually goes at end.', 'medium'),

('foundation', 'present-simple', 'beginner', 'Talking about your daily routine, you say:', '["I gets up at 6 AM.", "I get up at 6 AM.", "I getting up at 6 AM.", "I am get up at 6 AM."]', 1, 'Basic Structure: I + base verb. Correct: "I get up at 6 AM." Phrasal verb "get up" stays in base form. Present simple for routines.', 'medium'),

('foundation', 'present-simple', 'beginner', 'What is wrong? "We goes to office by bus."', '["Use go instead of goes", "Use going instead of goes", "Use went instead of goes", "Nothing is wrong"]', 0, 'Basic Structure error: We + base verb. Use "go" (not "goes"). Rule: I/You/We/They never add -s/-es to the verb.', 'medium'),

('foundation', 'present-simple', 'beginner', 'Complete: They _____ their homework after dinner.', '["do", "does", "doing", "did"]', 0, 'Basic Structure: They + base verb. Use "do" (base form). "Do homework" = common expression for completing assignments.', 'medium'),

('foundation', 'present-simple', 'beginner', 'At a job interview, describing your skills:', '["I has good communication skills.", "I have good communication skills.", "I having good communication skills.", "I am have good communication skills."]', 1, 'Basic Structure: I + have (not "has"). Present simple for permanent skills/abilities. "Have" is an irregular verb.', 'medium'),

('foundation', 'present-simple', 'beginner', 'Rearrange: on / We / weekends / movies / watch', '["We watch movies on weekends", "We on weekends watch movies", "On weekends we watch movies", "Movies we watch on weekends"]', 0, 'Basic Structure: Subject + verb + object + time. Natural: "We watch movies on weekends." Can start with time, but this is most common.', 'medium'),

('foundation', 'present-simple', 'beginner', 'Choose the sentence about a regular habit:', '["I am eating breakfast now.", "I eat breakfast at 8 AM every day.", "I ate breakfast this morning.", "I will eat breakfast tomorrow."]', 1, 'Basic Structure for habits: I + verb + time expression. "Every day" signals present simple (not continuous/past/future). Present simple = routines.', 'medium'),

-- HARD (4 questions)
('foundation', 'present-simple', 'beginner', 'Which sentence uses present simple correctly for a universal truth?', '["The sun is rising in the east.", "The sun rises in the east.", "The sun rise in the east.", "The sun was rising in the east."]', 1, 'Basic Structure for facts: Subject + verb. Universal truths use present simple. "The sun rises" = permanent fact (not continuous/past).', 'hard'),

('foundation', 'present-simple', 'beginner', 'Which is correct for describing your job?', '["I am working as a software engineer.", "I work as a software engineer.", "I working as a software engineer.", "I works as a software engineer."]', 1, 'Basic Structure for permanent situations: I + work. Use present simple (not continuous) for jobs. "Work" = permanent, "am working" = temporary.', 'hard'),

('foundation', 'present-simple', 'beginner', 'What is wrong? "We are understanding English grammar."', '["Say We understand", "Say We understands", "Say We understood", "Nothing wrong"]', 0, 'Stative verbs (understand, know, like, want, need) don''t use continuous. Use: "We understand" (present simple). Understanding = state, not action.', 'hard'),

('foundation', 'present-simple', 'beginner', 'Complete: We _____ Hindi and English at home.', '["speak", "speaks", "speaking", "spoke"]', 0, 'Basic Structure: We + base verb. Use "speak" (no changes). Present simple for languages spoken regularly at home.', 'hard'),

-- ============================================================================
-- SUBTOPIC 2: ADDING -s/-es (He/She/It forms) - 20 questions
-- ============================================================================

-- EASY (8 questions)
('foundation', 'present-simple', 'beginner', 'He _____ in a bank.', '["work", "works", "working", "worked"]', 1, 'Adding -s/-es: He/She/It + verb + s. Add -s to "work" → "works". Present simple third person rule.', 'easy'),

('foundation', 'present-simple', 'beginner', 'She _____ to office by metro.', '["go", "goes", "going", "went"]', 1, 'Adding -s/-es: Verbs ending in o, s, sh, ch, x, z → add -es. "Go" + es = "goes" (not "gos").', 'easy'),

('foundation', 'present-simple', 'beginner', 'It _____ good. (talking about food)', '["taste", "tastes", "tasting", "tasted"]', 1, 'Adding -s/-es: It + verb + s. Add -s to "taste" → "tastes". It = singular = needs -s.', 'easy'),

('foundation', 'present-simple', 'beginner', 'My brother _____ in Delhi.', '["live", "lives", "living", "lived"]', 1, 'Adding -s/-es: My brother = he + verb + s. "Live" + s = "lives". Singular noun = add -s.', 'easy'),

('foundation', 'present-simple', 'beginner', 'She _____ English.', '["teach", "teaches", "teaching", "taught"]', 1, 'Adding -s/-es: Verbs ending in ch → add -es. "Teach" + es = "teaches". Also: watch→watches, catch→catches.', 'easy'),

('foundation', 'present-simple', 'beginner', 'He _____ cricket every Sunday.', '["play", "plays", "playing", "played"]', 1, 'Adding -s/-es: He + verb + s. "Play" + s = "plays" (regular -s addition).', 'easy'),

('foundation', 'present-simple', 'beginner', 'The class _____ at 9 AM.', '["start", "starts", "starting", "started"]', 1, 'Adding -s/-es: Singular nouns + verb + s. "Class" = one thing = "starts". Present simple for schedules.', 'easy'),

('foundation', 'present-simple', 'beginner', 'She _____ two languages.', '["speak", "speaks", "speaking", "spoke"]', 1, 'Adding -s/-es: She + verb + s. "Speak" + s = "speaks". Present simple for abilities.', 'easy'),

-- MEDIUM (8 questions)
('foundation', 'present-simple', 'beginner', 'She _____ for her exams. (What is the correct spelling?)', '["studys", "studies", "studyes", "studis"]', 1, 'Adding -s/-es: Consonant + y → drop y + ies. "Study" → "studies". Also: try→tries, cry→cries, fly→flies.', 'medium'),

('foundation', 'present-simple', 'beginner', 'He _____ to finish his work on time.', '["trys", "tries", "tryes", "tris"]', 1, 'Adding -s/-es: Consonant + y → drop y + ies. "Try" → "tries" (not "trys"). T is consonant.', 'medium'),

('foundation', 'present-simple', 'beginner', 'What is wrong? "He go to gym every day."', '["Use goes instead of go", "Use going instead of go", "Use went instead of go", "Nothing wrong"]', 0, 'Adding -s/-es error: He + verb + es. "Go" ends in o → add -es = "goes". Correct: "He goes to gym every day."', 'medium'),

('foundation', 'present-simple', 'beginner', 'Choose the correct sentence:', '["My mother cook very well.", "My mother cooks very well.", "My mother cooking very well.", "My mother is cook very well."]', 1, 'Adding -s/-es: My mother = she + verb + s. "Cook" + s = "cooks". Present simple for abilities.', 'medium'),

('foundation', 'present-simple', 'beginner', 'Complete: The sun _____ in the east.', '["rise", "rises", "rising", "rised"]', 1, 'Adding -s/-es: The sun = it + verb + s. "Rise" + s = "rises". Universal truths use present simple.', 'medium'),

('foundation', 'present-simple', 'beginner', 'What is the error? "She wash her car every week."', '["Use washes instead of wash", "Use washing instead of wash", "Use washed instead of wash", "Nothing wrong"]', 0, 'Adding -s/-es: She + verb + es. "Wash" ends in sh → add -es = "washes". Correct: "She washes her car every week."', 'medium'),

('foundation', 'present-simple', 'beginner', 'Choose the correct form:', '["The shop open at 10 AM.", "The shop opens at 10 AM.", "The shop opening at 10 AM.", "The shop is open at 10 AM."]', 1, 'Adding -s/-es: The shop = it + verb + s. "Open" + s = "opens" (action). Option D = adjective "open" (state), not verb.', 'medium'),

('foundation', 'present-simple', 'beginner', 'What is wrong? "He catch the 8 AM train."', '["Use catches instead of catch", "Use catching instead of catch", "Use catched instead of catch", "Nothing wrong"]', 0, 'Adding -s/-es: He + verb + es. "Catch" ends in ch → add -es = "catches". Correct: "He catches the 8 AM train."', 'medium'),

-- HARD (4 questions)
('foundation', 'present-simple', 'beginner', 'Find the error: "She have a beautiful voice."', '["Use has instead of have", "Use is instead of have", "Use having instead of have", "No error"]', 0, 'Adding -s/-es: Irregular! "Have" becomes "has" with he/she/it (not "haves"). Exception to regular -s rule. Correct: "She has a beautiful voice."', 'hard'),

('foundation', 'present-simple', 'beginner', 'Which is correct?', '["He do his homework daily.", "He does his homework daily.", "He dos his homework daily.", "He doing his homework daily."]', 1, 'Adding -s/-es: Irregular! "Do" becomes "does" with he/she/it (not "dos"). Exception to regular -s rule.', 'hard'),

('foundation', 'present-simple', 'beginner', 'What is wrong? "The bus go from here."', '["Use goes instead of go", "Use going instead of go", "Use went instead of go", "Nothing wrong"]', 0, 'Adding -s/-es: The bus = it + verb + es. "Go" ends in o → add -es = "goes" (not "gos"). Correct: "The bus goes from here."', 'hard'),

('foundation', 'present-simple', 'beginner', 'Find the error: "My friend never go anywhere without his phone."', '["Use goes instead of go", "Use going instead of go", "Use went instead of go", "No error"]', 0, 'Adding -s/-es: My friend = he/she + verb + es. Frequency adverb (never) goes BEFORE verb, but verb still needs -s/-es. "Go" + es = "goes".', 'hard'),

-- ============================================================================
-- SUBTOPIC 3: NEGATIVE FORM (don't/doesn't) - 20 questions
-- ============================================================================

-- EASY (8 questions)
('foundation', 'present-simple', 'beginner', 'I _____ coffee.', '["don''t like", "doesn''t like", "not like", "am not like"]', 0, 'Negative Form: I/You/We/They + don''t + base verb. Use "don''t like" (not "doesn''t"). Verb stays base form after don''t.', 'easy'),

('foundation', 'present-simple', 'beginner', 'She _____ tea.', '["don''t drink", "doesn''t drink", "not drink", "isn''t drink"]', 1, 'Negative Form: He/She/It + doesn''t + base verb. Use "doesn''t drink". Verb stays base form (drink, not drinks).', 'easy'),

('foundation', 'present-simple', 'beginner', 'They _____ meat.', '["don''t eat", "doesn''t eat", "not eat", "aren''t eat"]', 0, 'Negative Form: They + don''t + base verb. Use "don''t eat". Verb: base form (eat, no changes).', 'easy'),

('foundation', 'present-simple', 'beginner', 'He _____ here.', '["don''t live", "doesn''t live", "not live", "isn''t live"]', 1, 'Negative Form: He + doesn''t + base verb. Use "doesn''t live". Verb: base form (live, not lives).', 'easy'),

('foundation', 'present-simple', 'beginner', 'We _____ the answer.', '["don''t know", "doesn''t know", "not know", "aren''t know"]', 0, 'Negative Form: We + don''t + base verb. Use "don''t know". Verb: base form (know).', 'easy'),

('foundation', 'present-simple', 'beginner', 'You _____ my question.', '["don''t understand", "doesn''t understand", "not understand", "aren''t understand"]', 0, 'Negative Form: You + don''t + base verb. Always "don''t" with you (never "doesn''t"). Verb: understand (base).', 'easy'),

('foundation', 'present-simple', 'beginner', 'The shop _____ on Sundays.', '["don''t open", "doesn''t open", "not open", "isn''t open"]', 1, 'Negative Form: Singular nouns + doesn''t + base verb. Use "doesn''t open". The shop = it = doesn''t.', 'easy'),

('foundation', 'present-simple', 'beginner', 'I _____ to work on weekends.', '["don''t go", "doesn''t go", "not go", "am not go"]', 0, 'Negative Form: I + don''t + base verb. Use "don''t go". Verb: base form (go, not goes).', 'easy'),

-- MEDIUM (8 questions)
('foundation', 'present-simple', 'beginner', 'What is wrong? "She don''t like cold weather."', '["Use doesn''t instead of don''t", "Use not instead of don''t", "Use didn''t instead of don''t", "Nothing wrong"]', 0, 'Negative Form error: She = doesn''t (not don''t). Rule: He/She/It + doesn''t. Correct: "She doesn''t like cold weather."', 'medium'),

('foundation', 'present-simple', 'beginner', 'At a restaurant, telling the waiter:', '["I don''t likes spicy food.", "I don''t like spicy food.", "I doesn''t like spicy food.", "I not like spicy food."]', 1, 'Negative Form: I + don''t + base verb. After don''t, verb is ALWAYS base form (like, not likes). Correct: "I don''t like spicy food."', 'medium'),

('foundation', 'present-simple', 'beginner', 'Choose the correct sentence:', '["He doesn''t works on Sundays.", "He doesn''t work on Sundays.", "He don''t work on Sundays.", "He not work on Sundays."]', 1, 'Negative Form: He + doesn''t + base verb. After doesn''t, use base form (work, not works). Doesn''t already shows third person.', 'medium'),

('foundation', 'present-simple', 'beginner', 'What is the error? "They doesn''t have time."', '["Use don''t instead of doesn''t", "Use not instead of doesn''t", "Use didn''t instead of doesn''t", "Nothing wrong"]', 0, 'Negative Form error: They = don''t (not doesn''t). Rule: I/You/We/They + don''t. Correct: "They don''t have time."', 'medium'),

('foundation', 'present-simple', 'beginner', 'What is wrong? "We doesn''t need help."', '["Use don''t instead of doesn''t", "Use not instead of doesn''t", "Use didn''t instead of doesn''t", "Nothing wrong"]', 0, 'Negative Form error: We = don''t (not doesn''t). Correct: "We don''t need help." Remember: We/They/You/I = don''t.', 'medium'),

('foundation', 'present-simple', 'beginner', 'Choose the natural sentence:', '["The train doesn''t stops here.", "The train doesn''t stop here.", "The train don''t stop here.", "The train not stop here."]', 1, 'Negative Form: Singular noun + doesn''t + base verb. After doesn''t, use base form (stop, not stops). Correct: "The train doesn''t stop here."', 'medium'),

('foundation', 'present-simple', 'beginner', 'What is the error? "She doesn''t goes to gym."', '["Use go instead of goes", "Use going instead of goes", "Use went instead of goes", "Nothing wrong"]', 0, 'Negative Form error: After doesn''t, use base form. Correct: "She doesn''t go to gym." Doesn''t = already third person, so verb = base (go, not goes).', 'medium'),

('foundation', 'present-simple', 'beginner', 'What is wrong? "They doesn''t like spicy food."', '["Use don''t instead of doesn''t", "Use not instead of doesn''t", "Use didn''t instead of doesn''t", "Nothing wrong"]', 0, 'Negative Form error: They = don''t (not doesn''t). Correct: "They don''t like spicy food." Only he/she/it use doesn''t.', 'medium'),

-- HARD (4 questions)
('foundation', 'present-simple', 'beginner', 'Which is correct in formal business writing?', '["We don''t have any updates.", "We do not have any updates.", "We doesn''t have any updates.", "We not have any updates."]', 1, 'Negative Form: In formal writing, avoid contractions. Use "do not" (not "don''t"). Full forms = more professional in emails/reports.', 'hard'),

('foundation', 'present-simple', 'beginner', 'Find the error: "I am not understanding this concept."', '["Say I don''t understand", "Say I doesn''t understand", "Say I not understand", "No error"]', 0, 'Stative verbs (understand, know, want) don''t use continuous. Correct negative: "I don''t understand this concept." Never "am understanding".', 'hard'),

('foundation', 'present-simple', 'beginner', 'What is wrong? "The data doesn''t shows any improvement."', '["Use show instead of shows", "Use showing instead of shows", "Use showed instead of shows", "Nothing wrong"]', 0, 'Negative Form: After doesn''t, use base form. Correct: "The data doesn''t show any improvement." Doesn''t + show (not "shows").', 'hard'),

('foundation', 'present-simple', 'beginner', 'Find the error: "He doesn''t never comes late." (Double negative)', '["Remove never OR change doesn''t to does", "Remove doesn''t", "Remove never", "No error"]', 0, 'Double negative error! Can''t use "doesn''t" + "never" together. Fixes: "He never comes late" OR "He doesn''t ever come late". Never use two negatives.', 'hard'),

-- ============================================================================
-- SUBTOPIC 4: QUESTIONS (Do/Does questions) - 20 questions
-- ============================================================================

-- EASY (8 questions)
('foundation', 'present-simple', 'beginner', '_____ you like coffee?', '["Do", "Does", "Are", "Is"]', 0, 'Questions: Do + I/you/we/they + base verb? Use "Do" with you. Verb: like (no changes).', 'easy'),

('foundation', 'present-simple', 'beginner', '_____ she work here?', '["Do", "Does", "Are", "Is"]', 1, 'Questions: Does + he/she/it + base verb? Use "Does" with she. Verb: work (not works in questions).', 'easy'),

('foundation', 'present-simple', 'beginner', '_____ they live in Mumbai?', '["Do", "Does", "Are", "Is"]', 0, 'Questions: Do + they + base verb? Use "Do" with they. Verb: live (base form).', 'easy'),

('foundation', 'present-simple', 'beginner', 'Do you _____ English?', '["speak", "speaks", "speaking", "spoke"]', 0, 'Questions: After Do/Does, verb is ALWAYS base form. Use "speak" (not "speaks").', 'easy'),

('foundation', 'present-simple', 'beginner', 'Does he _____ cricket?', '["play", "plays", "playing", "played"]', 0, 'Questions: After Does, use base form. "Play" (not "plays") because "does" already shows third person.', 'easy'),

('foundation', 'present-simple', 'beginner', '_____ it rain a lot here?', '["Do", "Does", "Is", "Are"]', 1, 'Questions: Does + it + base verb? Use "Does" with it. Verb: rain (weather verb, base form).', 'easy'),

('foundation', 'present-simple', 'beginner', 'Do we _____ time?', '["have", "has", "having", "had"]', 0, 'Questions: After Do, use base form. "Have" (not "has") - always base form in questions.', 'easy'),

('foundation', 'present-simple', 'beginner', '_____ the shop open on Sundays?', '["Do", "Does", "Is", "Are"]', 1, 'Questions: Does + singular noun + base verb? The shop = it = use "Does". Verb: open (base).', 'easy'),

-- MEDIUM (8 questions)
('foundation', 'present-simple', 'beginner', 'Arrange correctly: you / Where / live / do', '["Where do you live", "Where you do live", "Do you where live", "You where do live"]', 0, 'Questions: Wh-word + do + subject + base verb? Order: Where + do + you + live (no -s).', 'medium'),

('foundation', 'present-simple', 'beginner', 'What is wrong? "Does they have a car?"', '["Use Do instead of Does", "Use Are instead of Does", "Use Is instead of Does", "Nothing wrong"]', 0, 'Questions error: They = Do (not Does). Rule: Do with I/you/we/they. Correct: "Do they have a car?" Only he/she/it use Does.', 'medium'),

('foundation', 'present-simple', 'beginner', 'Meeting someone new, you ask about their job:', '["What do you does?", "What you do?", "What do you do?", "What does you do?"]', 2, 'Questions: What + do + you + do? Common question about jobs. First "do" = question helper, second "do" = action verb.', 'medium'),

('foundation', 'present-simple', 'beginner', 'What is the error? "Do she speak English?"', '["Use Does instead of Do", "Use Is instead of Do", "Use Are instead of Do", "Nothing wrong"]', 0, 'Questions error: She = Does (not Do). Correct: "Does she speak English?" He/She/It = always Does.', 'medium'),

('foundation', 'present-simple', 'beginner', 'At a shop, asking about price:', '["How much does this costs?", "How much this cost?", "How much does this cost?", "How much do this cost?"]', 2, 'Questions: How much + does + this + base verb? This = singular = Does. Verb: cost (base, not "costs"). Correct: "How much does this cost?"', 'medium'),

('foundation', 'present-simple', 'beginner', 'Choose the correct question:', '["Where does you work?", "Where do you work?", "Where you work?", "Where are you work?"]', 1, 'Questions: Where + do + you + base verb? Use Do with you. Correct: "Where do you work?" (not Does with you).', 'medium'),

('foundation', 'present-simple', 'beginner', 'What is wrong? "Do he likes cricket?"', '["Use Does instead of Do, and like instead of likes", "Use Is instead of Do", "Remove likes", "Nothing wrong"]', 0, 'Two errors! 1) He = Does (not Do). 2) After Does, base form (like, not "likes"). Correct: "Does he like cricket?"', 'medium'),

('foundation', 'present-simple', 'beginner', 'Asking about someone''s daily routine:', '["What time does you wake up?", "What time you wake up?", "What time do you wake up?", "What time are you wake up?"]', 2, 'Questions: What time + do + you + base verb? Use Do with you. Correct: "What time do you wake up?" Common daily routine question.', 'medium'),

-- HARD (4 questions)
('foundation', 'present-simple', 'beginner', 'Someone asks: "Do you work here?" What is the correct short answer?', '["Yes, I work.", "Yes, I do.", "Yes, I am.", "Yes, I does."]', 1, 'Questions: Short answer = Yes/No + subject + do/does. Match the question helper. "Do you...?" → "Yes, I do." (not "Yes, I work" - too long).', 'hard'),

('foundation', 'present-simple', 'beginner', 'Question: "Does she like coffee?" Correct short answer:', '["Yes, she likes.", "Yes, she do.", "Yes, she does.", "Yes, she is."]', 2, 'Questions: Short answer = Yes/No + subject + does. "Does she...?" → "Yes, she does." Match the question: Does → does in answer.', 'hard'),

('foundation', 'present-simple', 'beginner', 'What is wrong? "Why does they come late?"', '["Use do instead of does", "Use are instead of does", "Use come instead of comes", "Nothing wrong"]', 0, 'Questions error: They = do (not does). Correct: "Why do they come late?" Only he/she/it use does. Verb "come" is already correct (base).', 'hard'),

('foundation', 'present-simple', 'beginner', 'Find the error: "Do you knows the answer?"', '["Use know instead of knows", "Use does instead of do", "Use are instead of do", "No error"]', 0, 'Questions error: After Do/Does, verb = base form. Correct: "Do you know the answer?" Never "knows" after do. Do + you + know (base).', 'hard'),

-- ============================================================================
-- SUBTOPIC 5: TIME EXPRESSIONS (frequency adverbs, time markers) - 20 questions
-- ============================================================================

-- EASY (8 questions)
('foundation', 'present-simple', 'beginner', 'I _____ play cricket on Sundays.', '["always", "yesterday", "now", "tomorrow"]', 0, 'Time Expressions: Frequency adverbs (always, usually, often, sometimes, never) used with present simple for habits. "Always" = 100% of the time.', 'easy'),

('foundation', 'present-simple', 'beginner', 'She _____ goes to gym.', '["never", "yesterday", "last week", "tomorrow"]', 0, 'Time Expressions: "Never" = frequency adverb (0% of the time). Goes with present simple for habits. Means she doesn''t go to gym at all.', 'easy'),

('foundation', 'present-simple', 'beginner', 'We eat dinner _____ 8 PM.', '["at", "in", "on", "yesterday"]', 0, 'Time Expressions: "At" + specific time (8 PM, 9 AM, noon, midnight). Pattern: at + clock time.', 'easy'),

('foundation', 'present-simple', 'beginner', 'They work _____ weekdays.', '["on", "at", "in", "ago"]', 0, 'Time Expressions: "On" + days (Monday, weekends, Sundays, weekdays). Pattern: on + day names.', 'easy'),

('foundation', 'present-simple', 'beginner', 'He _____ drinks coffee.', '["sometimes", "now", "yesterday", "ago"]', 0, 'Time Expressions: "Sometimes" = frequency adverb (occasionally). Goes with present simple. Means he drinks coffee, but not always.', 'easy'),

('foundation', 'present-simple', 'beginner', 'I go to office _____ morning.', '["every", "yesterday", "last", "next"]', 0, 'Time Expressions: "Every" + time period (every day/week/month/morning). Shows repeated routine. Present simple for habits.', 'easy'),

('foundation', 'present-simple', 'beginner', 'She _____ eats junk food.', '["rarely", "now", "tomorrow", "yesterday"]', 0, 'Time Expressions: "Rarely" = frequency adverb (almost never, very seldom). Goes with present simple. Means she eats junk food very little.', 'easy'),

('foundation', 'present-simple', 'beginner', 'We meet _____ Saturdays.', '["on", "at", "in", "ago"]', 0, 'Time Expressions: "On" + day name (Saturdays = every Saturday). Present simple for repeated activities.', 'easy'),

-- MEDIUM (8 questions)
('foundation', 'present-simple', 'beginner', 'Where does the frequency adverb go? I _____ am _____ late for work.', '["Position 1 (before am)", "Position 2 (after am)", "Both positions work", "Neither position"]', 0, 'Time Expressions: Frequency adverb position with "be" = BEFORE be verb. Correct: "I never am late" → "I am never late." With be: after. With action verbs: before.', 'medium'),

('foundation', 'present-simple', 'beginner', 'Arrange correctly: always / We / breakfast / have / 7 AM / at', '["We always have breakfast at 7 AM", "We have always breakfast at 7 AM", "Always we have breakfast at 7 AM", "We have breakfast always at 7 AM"]', 0, 'Time Expressions: Position: Subject + frequency adverb + verb + object + at + time. "Always" goes BEFORE main verb. Natural: "We always have breakfast at 7 AM."', 'medium'),

('foundation', 'present-simple', 'beginner', 'Choose the sentence with correct time expression:', '["I go to gym yesterday.", "I go to gym every day.", "I go to gym tomorrow.", "I go to gym last week."]', 1, 'Time Expressions: Present simple needs routine time markers: every day/week, always, usually. "Yesterday/tomorrow/last week" = wrong tense (past/future).', 'medium'),

('foundation', 'present-simple', 'beginner', 'What is wrong? "He goes never to parties."', '["Say He never goes", "Say He not goes", "Say He doesn''t go never", "Nothing wrong"]', 0, 'Time Expressions: Frequency adverb goes BEFORE main verb (not after). Correct: "He never goes to parties." Position matters!', 'medium'),

('foundation', 'present-simple', 'beginner', 'Complete with correct time expression: She _____ the gym twice a week.', '["visits", "is visiting", "visited", "will visit"]', 0, 'Time Expressions: "Twice a week" = frequency expression = present simple. Use "visits" (not continuous/past/future). Present simple for repeated activities.', 'medium'),

('foundation', 'present-simple', 'beginner', 'Arrange correctly: often / market / go / to / the / We', '["We often go to the market", "We go often to the market", "Often we go to the market", "We go to the market often"]', 0, 'Time Expressions: Position: Subject + often + verb. "Often" goes BEFORE main verb. Natural: "We often go to the market." Can also go at end (D), but A is most common.', 'medium'),

('foundation', 'present-simple', 'beginner', 'Which time expression goes with present simple?', '["now", "every morning", "at the moment", "yesterday"]', 1, 'Time Expressions: Present simple = routines/habits. Use: every day/week/month, always, usually, often, sometimes. "Now/at the moment" = continuous. "Yesterday" = past.', 'medium'),

('foundation', 'present-simple', 'beginner', 'What is wrong? "They go usually to bed at 10 PM."', '["Say They usually go", "Say They goes usually", "Say They are going usually", "Nothing wrong"]', 0, 'Time Expressions: Frequency adverb goes BEFORE main verb. Correct: "They usually go to bed at 10 PM." Position: subject + usually + verb.', 'medium'),

-- HARD (4 questions)
('foundation', 'present-simple', 'beginner', 'Find the error: "I always am late for meetings."', '["Say I am always late", "Say I always late", "Say I late always am", "No error"]', 0, 'Time Expressions: With "be" verb, frequency adverb goes AFTER be (not before). Correct: "I am always late." But with action verbs: before verb. Position rule differs!', 'hard'),

('foundation', 'present-simple', 'beginner', 'Arrange correctly: never / weekdays / on / They / alcohol / drink', '["They never drink alcohol on weekdays", "They drink never alcohol on weekdays", "Never they drink alcohol on weekdays", "They drink alcohol never on weekdays"]', 0, 'Time Expressions: Position: Subject + frequency adverb + verb + object + on + days. "Never" goes BEFORE main verb. Correct order: They never drink alcohol on weekdays.', 'hard'),

('foundation', 'present-simple', 'beginner', 'Which is correct for a permanent schedule?', '["The train is leaving at 10 PM.", "The train leaves at 10 PM.", "The train left at 10 PM.", "The train will leave at 10 PM."]', 1, 'Time Expressions: Fixed schedules (trains, buses, classes) use present simple (not continuous/future). "The train leaves at 10 PM" = timetable. Present simple for permanent schedules.', 'hard'),

('foundation', 'present-simple', 'beginner', 'Complete with the correct frequency: I _____ understand this topic. (You never understand)', '["always", "never", "sometimes", "usually"]', 1, 'Time Expressions: "Never" = 0% frequency (you don''t understand at all). Context shows complete lack of understanding. Never = strongest negative frequency adverb.', 'hard');

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

SELECT 'Present Simple Question Count Check' as check_name;
SELECT COUNT(*) as total_questions FROM english_questions WHERE topic_id = 'present-simple';

-- Expected output: 100 questions
-- Breakdown: 20 per subtopic × 5 subtopics = 100
