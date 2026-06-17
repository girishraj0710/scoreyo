-- ============================================================================
-- FOUNDATION PATH: Past Simple Tense (COMPLETE)
-- Topic ID: past-simple
-- Level: beginner (A1)
-- Total: 100 questions covering ALL 5 subtopics
-- ============================================================================
-- Subtopics covered:
--   1. Regular Verbs: -ed (basic structure) - 20 questions
--   2. Irregular Verbs: Common Past Forms - 20 questions
--   3. Negative Form: didn't + base verb - 20 questions
--   4. Questions: Did + subject + base verb? - 20 questions
--   5. Time Expressions: yesterday, last, ago - 20 questions
-- Distribution: 40 easy, 40 medium, 20 hard per 100 questions
-- ============================================================================

INSERT INTO english_questions (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty) VALUES

-- ============================================================================
-- SUBTOPIC 1: Regular Verbs: -ed (basic structure) - 20 questions
-- ============================================================================

-- EASY (8 questions)
('foundation', 'past-simple', 'beginner', 'I _____ the movie yesterday.', '["watch", "watches", "watched", "watching"]', 2, 'Regular past simple: verb + ed. Watch → watched. Yesterday = past time marker. Pattern: Subject + verb-ed.', 'easy'),

('foundation', 'past-simple', 'beginner', 'She _____ to Delhi last week.', '["travel", "travels", "travelled", "traveling"]', 2, 'Regular past simple: verb + ed. Travel → travelled. Last week = finished time. Pattern: She + verb-ed.', 'easy'),

('foundation', 'past-simple', 'beginner', 'They _____ cricket on Sunday.', '["play", "plays", "played", "playing"]', 2, 'Regular past simple: verb + ed. Play → played. Sunday (past) = use past simple. Pattern: They + verb-ed.', 'easy'),

('foundation', 'past-simple', 'beginner', 'He _____ his homework.', '["finish", "finishes", "finished", "finishing"]', 2, 'Regular past simple: verb + ed. Finish → finished. Completed action. Pattern: He + verb-ed.', 'easy'),

('foundation', 'past-simple', 'beginner', 'We _____ in Mumbai last year.', '["live", "lives", "lived", "living"]', 2, 'Regular past simple: verb + ed. Live → lived. Last year = specific past time. Pattern: We + verb-ed.', 'easy'),

('foundation', 'past-simple', 'beginner', 'I _____ my friend yesterday.', '["call", "calls", "called", "calling"]', 2, 'Regular past simple: verb + ed. Call → called. Yesterday = finished action. Pattern: I + verb-ed.', 'easy'),

('foundation', 'past-simple', 'beginner', 'She _____ the meeting.', '["attend", "attends", "attended", "attending"]', 2, 'Regular past simple: verb + ed. Attend → attended. Finished action. Pattern: She + verb-ed.', 'easy'),

('foundation', 'past-simple', 'beginner', 'They _____ lunch at 1 PM.', '["cook", "cooks", "cooked", "cooking"]', 2, 'Regular past simple: verb + ed. Cook → cooked. Specific time (1 PM in past). Pattern: They + verb-ed.', 'easy'),

-- MEDIUM (8 questions)
('foundation', 'past-simple', 'beginner', 'What is wrong? "She cook dinner last night."', '["Use cooked instead of cook", "Use cooks instead of cook", "Use cooking instead of cook", "Nothing wrong"]', 0, 'Regular past simple: must add -ed. Correct: "She cooked dinner last night." Past time marker (last night) needs past verb.', 'medium'),

('foundation', 'past-simple', 'beginner', 'Choose the correct sentence:', '["He start his new job yesterday.", "He started his new job yesterday.", "He starting his new job yesterday.", "He starts his new job yesterday."]', 1, 'Regular past simple: verb + ed. Start → started. Yesterday = past time. Correct: "He started."', 'medium'),

('foundation', 'past-simple', 'beginner', 'Complete: I _____ for 2 hours. (Spelling: stop - CVC doubling)', '["stoped", "stopped", "stopd", "stops"]', 1, 'Spelling rule: short vowel + consonant → double + ed. Stop → stopped (double p). CVC pattern requires doubling.', 'medium'),

('foundation', 'past-simple', 'beginner', 'Complete: She _____ her keys. (Spelling: drop - CVC doubling)', '["droped", "dropped", "dropd", "drops"]', 1, 'Spelling rule: short vowel + consonant → double + ed. Drop → dropped (double p). CVC pattern.', 'medium'),

('foundation', 'past-simple', 'beginner', 'Complete: They _____ all night. (Spelling: plan - CVC doubling)', '["planed", "planned", "pland", "plans"]', 1, 'Spelling rule: CVC pattern → double + ed. Plan → planned (double n). Short vowel + one consonant.', 'medium'),

('foundation', 'past-simple', 'beginner', 'Arrange correctly: to / Mumbai / moved / We / last / year', '["We moved to Mumbai last year", "We to Mumbai moved last year", "Last year we moved to Mumbai", "We moved last year to Mumbai"]', 0, 'Pattern: Subject + verb-ed + to + place + time. Order: We moved to Mumbai last year. Natural word order.', 'medium'),

('foundation', 'past-simple', 'beginner', 'Rearrange: the / She / yesterday / attended / meeting', '["She attended the meeting yesterday", "She the meeting attended yesterday", "Yesterday she attended the meeting", "She attended yesterday the meeting"]', 0, 'Pattern: Subject + verb-ed + object + time. Order: She attended the meeting yesterday. Time at end is natural.', 'medium'),

('foundation', 'past-simple', 'beginner', 'At work, reporting completed task:', '["I complete the report this morning.", "I completed the report this morning.", "I completes the report this morning.", "I completing the report this morning."]', 1, 'Regular past simple: verb + ed. Complete → completed. "This morning" (if afternoon now) = finished = past simple.', 'medium'),

-- HARD (4 questions)
('foundation', 'past-simple', 'beginner', 'Which is correct in formal business email?', '["We receive your email yesterday.", "We received your email yesterday.", "We receives your email yesterday.", "We receiving your email yesterday."]', 1, 'Regular past simple: verb + ed. Receive → received. Formal writing uses past simple for finished actions. Pattern: We received.', 'hard'),

('foundation', 'past-simple', 'beginner', 'Complete: I _____ my exam. (Spelling: consonant + y)', '["studyed", "studied", "studyd", "studies"]', 1, 'Spelling rule: consonant + y → drop y + ied. Study → studied. Also: try → tried, cry → cried.', 'hard'),

('foundation', 'past-simple', 'beginner', 'Arrange correctly: ago / lived / here / We / years / five', '["We lived here five years ago", "We lived five years ago here", "Five years ago we lived here", "We here lived five years ago"]', 0, 'Pattern: Subject + verb-ed + place + number + unit + ago. "Ago" goes at END of time expression. Natural: We lived here five years ago.', 'hard'),

('foundation', 'past-simple', 'beginner', 'Which shows completely finished action?', '["I am completing the task.", "I complete the task.", "I completed the task.", "I will complete the task."]', 2, 'Past simple = finished/completed action. "I completed the task" = 100% done. Other tenses show ongoing/habit/future.', 'hard'),

-- ============================================================================
-- SUBTOPIC 2: Irregular Verbs: Common Past Forms - 20 questions
-- ============================================================================

-- EASY (8 questions)
('foundation', 'past-simple', 'beginner', 'I _____ to Delhi yesterday. (go - irregular)', '["go", "goes", "went", "going"]', 2, 'Irregular past simple: Go → went (not "goed"). No -ed ending. Common irregular verb.', 'easy'),

('foundation', 'past-simple', 'beginner', 'She _____ the movie. (see - irregular)', '["see", "sees", "saw", "seeing"]', 2, 'Irregular past simple: See → saw (not "seed"). Change vowel sound. Common irregular verb.', 'easy'),

('foundation', 'past-simple', 'beginner', 'They _____ lunch. (eat - irregular)', '["eat", "eats", "ate", "eating"]', 2, 'Irregular past simple: Eat → ate (not "eated"). Vowel change. Common irregular verb.', 'easy'),

('foundation', 'past-simple', 'beginner', 'He _____ a letter. (write - irregular)', '["write", "writes", "wrote", "writing"]', 2, 'Irregular past simple: Write → wrote (not "writed"). Vowel change: i → o. Common irregular verb.', 'easy'),

('foundation', 'past-simple', 'beginner', 'We _____ coffee. (drink - irregular)', '["drink", "drinks", "drank", "drinking"]', 2, 'Irregular past simple: Drink → drank (not "drinked"). Vowel change: i → a. Common irregular verb.', 'easy'),

('foundation', 'past-simple', 'beginner', 'I _____ a new car. (buy - irregular)', '["buy", "buys", "bought", "buying"]', 2, 'Irregular past simple: Buy → bought (not "buyed"). Complete form change. Common irregular verb.', 'easy'),

('foundation', 'past-simple', 'beginner', 'She _____ English. (teach - irregular)', '["teach", "teaches", "taught", "teaching"]', 2, 'Irregular past simple: Teach → taught (not "teached"). Vowel change: ea → au. Common irregular verb.', 'easy'),

('foundation', 'past-simple', 'beginner', 'They _____ home early. (leave - irregular)', '["leave", "leaves", "left", "leaving"]', 2, 'Irregular past simple: Leave → left (not "leaved"). Vowel change: ea → e. Common irregular verb.', 'easy'),

-- MEDIUM (8 questions)
('foundation', 'past-simple', 'beginner', 'What is wrong? "I goed to Mumbai."', '["Use went instead of goed", "Use go instead of goed", "Use going instead of goed", "Nothing wrong"]', 0, 'Irregular past simple: Go → went (NOT "goed"). Correct: "I went to Mumbai." No -ed ending for irregular verbs.', 'medium'),

('foundation', 'past-simple', 'beginner', 'Choose the correct sentence:', '["He buyed a new phone.", "He bought a new phone.", "He buys a new phone.", "He buying a new phone."]', 1, 'Irregular past simple: Buy → bought (NOT "buyed"). Correct: "He bought." Complete form change.', 'medium'),

('foundation', 'past-simple', 'beginner', 'What is the error? "She writed a letter."', '["Use wrote instead of writed", "Use write instead of writed", "Use writing instead of writed", "Nothing wrong"]', 0, 'Irregular past simple: Write → wrote (NOT "writed"). Correct: "She wrote a letter." Don''t add -ed to irregular verbs.', 'medium'),

('foundation', 'past-simple', 'beginner', 'Complete: They _____ the news. (hear - irregular)', '["hear", "hears", "heard", "hearing"]', 2, 'Irregular past simple: Hear → heard. Vowel change: ea → ea (same spelling, different sound). Common irregular verb.', 'medium'),

('foundation', 'past-simple', 'beginner', 'Complete: I _____ my keys. (lose - irregular)', '["lose", "loses", "lost", "losing"]', 2, 'Irregular past simple: Lose → lost. Vowel change: o → o (same spelling, different pronunciation). Common irregular verb.', 'medium'),

('foundation', 'past-simple', 'beginner', 'Complete: She _____ me the truth. (tell - irregular)', '["tell", "tells", "told", "telling"]', 2, 'Irregular past simple: Tell → told. Vowel change: e → o. Common irregular verb.', 'medium'),

('foundation', 'past-simple', 'beginner', 'Rearrange: movie / saw / We / the / yesterday', '["We saw the movie yesterday", "We the movie saw yesterday", "Yesterday we saw the movie", "We saw yesterday the movie"]', 0, 'Irregular past simple: See → saw. Pattern: Subject + irregular past + object + time. Natural: We saw the movie yesterday.', 'medium'),

('foundation', 'past-simple', 'beginner', 'Talking about your vacation:', '["I go to Goa last month.", "I goed to Goa last month.", "I went to Goa last month.", "I going to Goa last month."]', 2, 'Irregular past simple: Go → went. Pattern: I went to + place + time. Correct: "I went to Goa last month."', 'medium'),

-- HARD (4 questions)
('foundation', 'past-simple', 'beginner', 'Which is correct? "I _____ a famous person yesterday."', '["meet", "meets", "met", "meeting"]', 2, 'Irregular past simple: Meet → met. Same form as past participle. Correct: "I met a famous person yesterday."', 'hard'),

('foundation', 'past-simple', 'beginner', 'Find the error: "She bringed her laptop."', '["Use brought instead of bringed", "Use bring instead of bringed", "Use bringing instead of bringed", "No error"]', 0, 'Irregular past simple: Bring → brought (NOT "bringed"). Correct: "She brought her laptop." Complete form change.', 'hard'),

('foundation', 'past-simple', 'beginner', 'Arrange correctly: book / read / I / this / week / last', '["I read this book last week", "I readed this book last week", "Last week I read this book", "I read last week this book"]', 0, 'Irregular past simple: Read → read (same spelling, different pronunciation: red). Pattern: I read + object + time. Natural word order.', 'hard'),

('foundation', 'past-simple', 'beginner', 'What is wrong? "He catched the ball."', '["Use caught instead of catched", "Use catch instead of catched", "Use catching instead of catched", "Nothing wrong"]', 0, 'Irregular past simple: Catch → caught (NOT "catched"). Correct: "He caught the ball." Complete form change.', 'hard'),

-- ============================================================================
-- SUBTOPIC 3: Negative Form: didn't + base verb - 20 questions
-- ============================================================================

-- EASY (8 questions)
('foundation', 'past-simple', 'beginner', 'I _____ watch the movie.', '["don''t", "doesn''t", "didn''t", "not"]', 2, 'Past simple negative: didn''t + base verb. Pattern: I + didn''t + verb. Don''t/doesn''t = present, didn''t = past.', 'easy'),

('foundation', 'past-simple', 'beginner', 'She _____ call me yesterday.', '["don''t", "doesn''t", "didn''t", "not"]', 2, 'Past simple negative: didn''t + base verb. Pattern: She + didn''t + call. Use "didn''t" (not "doesn''t") for past.', 'easy'),

('foundation', 'past-simple', 'beginner', 'They _____ play cricket.', '["don''t", "doesn''t", "didn''t", "not"]', 2, 'Past simple negative: didn''t + base verb. Pattern: They + didn''t + play. Didn''t = did not (past).', 'easy'),

('foundation', 'past-simple', 'beginner', 'He _____ finish his homework.', '["don''t", "doesn''t", "didn''t", "not"]', 2, 'Past simple negative: didn''t + base verb. Pattern: He + didn''t + finish. Same "didn''t" for all subjects.', 'easy'),

('foundation', 'past-simple', 'beginner', 'We _____ go to the party.', '["don''t", "doesn''t", "didn''t", "not"]', 2, 'Past simple negative: didn''t + base verb. Pattern: We + didn''t + go. Didn''t works with all subjects.', 'easy'),

('foundation', 'past-simple', 'beginner', 'I _____ see him yesterday.', '["don''t", "doesn''t", "didn''t", "not"]', 2, 'Past simple negative: didn''t + base verb. Pattern: I + didn''t + see. Use didn''t (not don''t) for past.', 'easy'),

('foundation', 'past-simple', 'beginner', 'She _____ attend the meeting.', '["don''t", "doesn''t", "didn''t", "not"]', 2, 'Past simple negative: didn''t + base verb. Pattern: She + didn''t + attend. Didn''t = universal past negative.', 'easy'),

('foundation', 'past-simple', 'beginner', 'They _____ know the answer.', '["don''t", "doesn''t", "didn''t", "not"]', 2, 'Past simple negative: didn''t + base verb. Pattern: They + didn''t + know. Didn''t for past negative.', 'easy'),

-- MEDIUM (8 questions)
('foundation', 'past-simple', 'beginner', 'What is wrong? "I didn''t went to work."', '["Use go instead of went", "Use going instead of went", "Use goes instead of went", "Nothing wrong"]', 0, 'Double past error! Didn''t + BASE verb (not past). Correct: "I didn''t go to work." Didn''t already shows past.', 'medium'),

('foundation', 'past-simple', 'beginner', 'What is the error? "She didn''t called me."', '["Use call instead of called", "Use calls instead of called", "Use calling instead of called", "Nothing wrong"]', 0, 'Double past error! Didn''t + BASE verb. Correct: "She didn''t call me." Don''t use past form after didn''t.', 'medium'),

('foundation', 'past-simple', 'beginner', 'Choose the correct sentence:', '["He doesn''t go to the party yesterday.", "He didn''t go to the party yesterday.", "He didn''t went to the party yesterday.", "He not go to the party yesterday."]', 1, 'Past simple negative: didn''t + base verb. Correct: "He didn''t go." Doesn''t = present, didn''t = past.', 'medium'),

('foundation', 'past-simple', 'beginner', 'What is wrong? "We doesn''t go to the party."', '["Use didn''t instead of doesn''t", "Use don''t instead of doesn''t", "Use not instead of doesn''t", "Nothing wrong"]', 0, 'Wrong helper for past! Use didn''t (not doesn''t). Correct: "We didn''t go to the party." Doesn''t = present.', 'medium'),

('foundation', 'past-simple', 'beginner', 'Arrange correctly: not / finish / did / homework / I / my', '["I did not finish my homework", "I finish did not my homework", "Did not I finish my homework", "I did my homework not finish"]', 0, 'Past simple negative: Subject + didn''t + base verb + object. Order: I did not finish my homework. Did not = didn''t.', 'medium'),

('foundation', 'past-simple', 'beginner', 'Rearrange: she / yesterday / me / didn''t / call', '["She didn''t call me yesterday", "She didn''t me call yesterday", "Yesterday she didn''t call me", "She call didn''t me yesterday"]', 0, 'Past simple negative: Subject + didn''t + base verb + object + time. Natural: She didn''t call me yesterday. Time at end.', 'medium'),

('foundation', 'past-simple', 'beginner', 'At work, explaining why task is incomplete:', '["I don''t finish the report yet.", "I didn''t finish the report yet.", "I doesn''t finish the report yet.", "I not finish the report yet."]', 1, 'Past simple negative: didn''t + base verb. Correct: "I didn''t finish the report yet." Didn''t = past negative.', 'medium'),

('foundation', 'past-simple', 'beginner', 'Choose the natural sentence:', '["He not go to school yesterday.", "He didn''t go to school yesterday.", "He doesn''t go to school yesterday.", "He didn''t went to school yesterday."]', 1, 'Past simple negative: didn''t + base verb. Correct: "He didn''t go to school yesterday." Natural past negative.', 'medium'),

-- HARD (4 questions)
('foundation', 'past-simple', 'beginner', 'Which is correct in formal writing?', '["We don''t receive your email yesterday.", "We didn''t receive your email yesterday.", "We didn''t received your email yesterday.", "We not receive your email yesterday."]', 1, 'Past simple negative: didn''t + base verb. Correct: "We didn''t receive." Formal writing uses didn''t for past negative.', 'hard'),

('foundation', 'past-simple', 'beginner', 'Find the error: "She doesn''t called me yesterday."', '["Use didn''t instead of doesn''t AND use call instead of called", "Use call instead of called", "Use didn''t instead of doesn''t", "No error"]', 0, 'Two errors! Doesn''t = present (use didn''t). Called = past form (use call after didn''t). Correct: "She didn''t call me yesterday."', 'hard'),

('foundation', 'past-simple', 'beginner', 'Arrange correctly: work / to / didn''t / yesterday / go / He', '["He didn''t go to work yesterday", "He didn''t to work go yesterday", "Yesterday he didn''t go to work", "He to work didn''t go yesterday"]', 0, 'Past simple negative: Subject + didn''t + base verb + to + place + time. Natural: He didn''t go to work yesterday. Time at end.', 'hard'),

('foundation', 'past-simple', 'beginner', 'What is wrong? "They not finished their homework."', '["Use didn''t finish instead of not finished", "Use don''t finish instead of not finished", "Use doesn''t finish instead of not finished", "Nothing wrong"]', 0, 'Need helper verb! Can''t use "not" alone. Correct: "They didn''t finish their homework." Pattern: didn''t + base verb.', 'hard'),

-- ============================================================================
-- SUBTOPIC 4: Questions: Did + subject + base verb? - 20 questions
-- ============================================================================

-- EASY (8 questions)
('foundation', 'past-simple', 'beginner', '_____ you go to the party?', '["Do", "Does", "Did", "Don''t"]', 2, 'Past simple question: Did + subject + base verb? Pattern: Did + you + go. Do/does = present, did = past.', 'easy'),

('foundation', 'past-simple', 'beginner', '_____ she call you yesterday?', '["Do", "Does", "Did", "Don''t"]', 2, 'Past simple question: Did + subject + base verb? Pattern: Did + she + call. Did works with all subjects.', 'easy'),

('foundation', 'past-simple', 'beginner', '_____ they play cricket?', '["Do", "Does", "Did", "Don''t"]', 2, 'Past simple question: Did + subject + base verb? Pattern: Did + they + play. Universal "did" for past questions.', 'easy'),

('foundation', 'past-simple', 'beginner', '_____ he finish his homework?', '["Do", "Does", "Did", "Don''t"]', 2, 'Past simple question: Did + subject + base verb? Pattern: Did + he + finish. Same "did" for he/she/it.', 'easy'),

('foundation', 'past-simple', 'beginner', '_____ you see the movie?', '["Do", "Does", "Did", "Don''t"]', 2, 'Past simple question: Did + subject + base verb? Pattern: Did + you + see. Did = past question marker.', 'easy'),

('foundation', 'past-simple', 'beginner', '_____ she attend the meeting?', '["Do", "Does", "Did", "Don''t"]', 2, 'Past simple question: Did + subject + base verb? Pattern: Did + she + attend. Did for past questions.', 'easy'),

('foundation', 'past-simple', 'beginner', '_____ they know the answer?', '["Do", "Does", "Did", "Don''t"]', 2, 'Past simple question: Did + subject + base verb? Pattern: Did + they + know. Did = universal past question word.', 'easy'),

('foundation', 'past-simple', 'beginner', '_____ he come to the office?', '["Do", "Does", "Did", "Don''t"]', 2, 'Past simple question: Did + subject + base verb? Pattern: Did + he + come. Come (not came) after did.', 'easy'),

-- MEDIUM (8 questions)
('foundation', 'past-simple', 'beginner', 'What is wrong? "Did you went to the meeting?"', '["Use go instead of went", "Use going instead of went", "Use goes instead of went", "Nothing wrong"]', 0, 'Double past error in question! Did + BASE verb. Correct: "Did you go to the meeting?" Did already shows past.', 'medium'),

('foundation', 'past-simple', 'beginner', 'What is the error? "Did she called you?"', '["Use call instead of called", "Use calls instead of called", "Use calling instead of called", "Nothing wrong"]', 0, 'Double past error! Did + BASE verb (not past). Correct: "Did she call you?" Don''t use past form after did.', 'medium'),

('foundation', 'past-simple', 'beginner', 'Choose the correct question:', '["Does he go to the party yesterday?", "Did he go to the party yesterday?", "Did he went to the party yesterday?", "Do he go to the party yesterday?"]', 1, 'Past simple question: Did + subject + base verb. Correct: "Did he go." Does = present, did = past.', 'medium'),

('foundation', 'past-simple', 'beginner', 'Arrange correctly: movie / see / Did / the / you / yesterday', '["Did you see the movie yesterday", "Did you saw the movie yesterday", "You did see the movie yesterday", "Did see you the movie yesterday"]', 0, 'Past simple question: Did + subject + base verb + object + time. Order: Did you see the movie yesterday? Natural question word order.', 'medium'),

('foundation', 'past-simple', 'beginner', 'Rearrange: homework / your / finish / Did / you', '["Did you finish your homework", "Did you finished your homework", "You did finish your homework", "Did finish you your homework"]', 0, 'Past simple question: Did + subject + base verb + object. Order: Did you finish your homework? Natural question structure.', 'medium'),

('foundation', 'past-simple', 'beginner', 'At work, asking colleague about task:', '["Do you complete the report?", "Does you complete the report?", "Did you complete the report?", "Did you completed the report?"]', 2, 'Past simple question: Did + subject + base verb. Correct: "Did you complete the report?" Asking about finished task.', 'medium'),

('foundation', 'past-simple', 'beginner', 'Choose the natural question:', '["You went to Delhi?", "Did you went to Delhi?", "Did you go to Delhi?", "Do you went to Delhi?"]', 2, 'Past simple question: Did + subject + base verb. Correct: "Did you go to Delhi?" Most natural formal question.', 'medium'),

('foundation', 'past-simple', 'beginner', 'What is wrong? "Does she go to the party yesterday?"', '["Use did instead of does", "Use do instead of does", "Use doing instead of does", "Nothing wrong"]', 0, 'Wrong helper for past! Use did (not does). Correct: "Did she go to the party yesterday?" Does = present, did = past.', 'medium'),

-- HARD (4 questions)
('foundation', 'past-simple', 'beginner', 'Which is correct formal question?', '["You receive our email yesterday?", "Did you receive our email yesterday?", "Did you received our email yesterday?", "Does you receive our email yesterday?"]', 1, 'Past simple question: Did + subject + base verb. Correct: "Did you receive." Formal writing uses did for past questions.', 'hard'),

('foundation', 'past-simple', 'beginner', 'Find the error: "Did they finished their work?"', '["Use finish instead of finished", "Use finishes instead of finished", "Use finishing instead of finished", "No error"]', 0, 'Double past error! Did + BASE verb. Correct: "Did they finish their work?" Don''t use past form after did.', 'hard'),

('foundation', 'past-simple', 'beginner', 'Arrange correctly: go / work / to / Did / yesterday / he', '["Did he go to work yesterday", "Did he went to work yesterday", "Yesterday did he go to work", "Did go he to work yesterday"]', 0, 'Past simple question: Did + subject + base verb + to + place + time. Natural: Did he go to work yesterday? Time at end.', 'hard'),

('foundation', 'past-simple', 'beginner', 'What is wrong? "He went to the party yesterday?"', '["Start with Did: Did he go to the party yesterday?", "Change went to go", "Add does at the beginning", "Nothing wrong"]', 0, 'Need helper for formal question! Rising tone (informal) vs proper structure. Correct: "Did he go to the party yesterday?" Use did + base verb.', 'hard'),

-- ============================================================================
-- SUBTOPIC 5: Time Expressions: yesterday, last, ago - 20 questions
-- ============================================================================

-- EASY (8 questions)
('foundation', 'past-simple', 'beginner', 'I went to Delhi _____.', '["yesterday", "tomorrow", "today", "next week"]', 0, 'Past simple + time marker: yesterday = past. Pattern: past verb + yesterday. Yesterday shows finished time.', 'easy'),

('foundation', 'past-simple', 'beginner', 'She called me _____ week.', '["last", "next", "every", "this"]', 0, 'Past simple + time marker: last + week = past. Pattern: past verb + last + time unit. Last shows finished period.', 'easy'),

('foundation', 'past-simple', 'beginner', 'They moved here 5 years _____.', '["ago", "before", "later", "after"]', 0, 'Past simple + time marker: ago = time before now. Pattern: number + time unit + ago. Ago always at END.', 'easy'),

('foundation', 'past-simple', 'beginner', 'He finished his work _____ night.', '["last", "next", "every", "this"]', 0, 'Past simple + time marker: last + night = past. Pattern: past verb + last night. Last night = yesterday evening.', 'easy'),

('foundation', 'past-simple', 'beginner', 'We saw that movie _____ month.', '["last", "next", "every", "this"]', 0, 'Past simple + time marker: last + month = past. Pattern: past verb + last + time period. Last shows finished time.', 'easy'),

('foundation', 'past-simple', 'beginner', 'I met him 2 days _____.', '["ago", "before", "later", "after"]', 0, 'Past simple + time marker: ago = time back from now. Pattern: number + days + ago. Ago = time before present.', 'easy'),

('foundation', 'past-simple', 'beginner', 'She traveled to Mumbai _____.', '["yesterday", "tomorrow", "today", "next week"]', 0, 'Past simple + time marker: yesterday = past time. Pattern: past verb + yesterday. Yesterday = specific past day.', 'easy'),

('foundation', 'past-simple', 'beginner', 'They attended the meeting _____ Monday.', '["last", "next", "every", "this"]', 0, 'Past simple + time marker: last + Monday = past. Pattern: past verb + last + day. Last Monday = previous Monday.', 'easy'),

-- MEDIUM (8 questions)
('foundation', 'past-simple', 'beginner', 'Where does "ago" go? I _____ met _____ him _____ 5 years _____.', '["Position 1", "Position 2", "Position 3", "Position 4 (at end)"]', 3, 'Time marker position: "ago" always goes AT END. Pattern: number + time unit + ago. Correct: I met him 5 years ago.', 'medium'),

('foundation', 'past-simple', 'beginner', 'What is wrong? "I will go to Delhi yesterday."', '["Use went instead of will go", "Use go instead of will go", "Use going instead of will go", "Nothing wrong"]', 0, 'Tense mismatch! Yesterday = past, not future. Correct: "I went to Delhi yesterday." Yesterday needs past simple.', 'medium'),

('foundation', 'past-simple', 'beginner', 'Choose the correct sentence:', '["She goes to Mumbai last week.", "She go to Mumbai last week.", "She went to Mumbai last week.", "She going to Mumbai last week."]', 2, 'Past simple + last week: must use past verb. Correct: "She went to Mumbai last week." Last week = past time marker.', 'medium'),

('foundation', 'past-simple', 'beginner', 'Arrange correctly: yesterday / called / She / me', '["She called me yesterday", "She me called yesterday", "Yesterday she called me", "She called yesterday me"]', 0, 'Pattern: Subject + past verb + object + time. Order: She called me yesterday. Time usually at end. Both A and C natural.', 'medium'),

('foundation', 'past-simple', 'beginner', 'Rearrange: lived / years / here / We / five / ago', '["We lived here five years ago", "We lived five years ago here", "Five years ago we lived here", "We here lived five years ago"]', 0, 'Pattern: Subject + past verb + place + number + time + ago. "Ago" at END of time expression. Natural: We lived here five years ago.', 'medium'),

('foundation', 'past-simple', 'beginner', 'What is the error? "I see that movie last month."', '["Use saw instead of see", "Use sees instead of see", "Use seeing instead of see", "Nothing wrong"]', 0, 'Tense mismatch! Last month = past time marker = must use past verb. Correct: "I saw that movie last month." Last = past simple.', 'medium'),

('foundation', 'past-simple', 'beginner', 'Talking about recent event:', '["I attend the meeting yesterday.", "I attended the meeting yesterday.", "I attends the meeting yesterday.", "I attending the meeting yesterday."]', 1, 'Past simple + yesterday: use past verb. Correct: "I attended the meeting yesterday." Yesterday = finished time = past simple.', 'medium'),

('foundation', 'past-simple', 'beginner', 'Choose the natural sentence:', '["Ago 2 weeks I called him.", "I called him 2 weeks ago.", "I called ago 2 weeks him.", "2 weeks I called him ago."]', 1, 'Pattern: Subject + past verb + object + number + time + ago. Natural: I called him 2 weeks ago. Ago always at END.', 'medium'),

-- HARD (4 questions)
('foundation', 'past-simple', 'beginner', 'Which is correct in formal writing?', '["We receive your application yesterday.", "We received your application yesterday.", "We receives your application yesterday.", "We are receiving your application yesterday."]', 1, 'Past simple + yesterday: must use past verb. Correct: "We received your application yesterday." Yesterday = past time.', 'hard'),

('foundation', 'past-simple', 'beginner', 'Find the error: "He finish his work last night."', '["Use finished instead of finish", "Use finishes instead of finish", "Use finishing instead of finish", "No error"]', 0, 'Tense mismatch! Last night = past time = must use past verb. Correct: "He finished his work last night." Last = past marker.', 'hard'),

('foundation', 'past-simple', 'beginner', 'Arrange correctly: meeting / attended / ago / the / days / She / two', '["She attended the meeting two days ago", "She attended two days ago the meeting", "Two days ago she attended the meeting", "She the meeting attended two days ago"]', 0, 'Pattern: Subject + past verb + object + number + time + ago. Natural: She attended the meeting two days ago. Ago at END of time.', 'hard'),

('foundation', 'past-simple', 'beginner', 'What is wrong? "Last week I am going to Delhi."', '["Use went instead of am going", "Use go instead of am going", "Use will go instead of am going", "Nothing wrong"]', 0, 'Tense mismatch! Last week = finished past time = must use past simple. Correct: "Last week I went to Delhi." Last = past, not present continuous/future.', 'hard');

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

SELECT 'Past Simple Question Count Check' as check_name;
SELECT COUNT(*) as total_questions FROM english_questions WHERE topic_id = 'past-simple';

-- Expected output: 100 questions
-- Breakdown: 20 per subtopic × 5 subtopics = 100
