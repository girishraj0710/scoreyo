-- Phase 3, Topic 1: "I Went, I Saw" - Past Simple Regular Verbs
-- 30 questions (12 easy, 12 medium, 6 hard)
-- Pattern-based, beginner-friendly, Indian context

INSERT INTO english_questions (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty) VALUES

-- EASY QUESTIONS (12) - Basic past simple regular verbs
('foundation', 'past-simple', 'beginner', 'I _____ to Delhi yesterday.', '["go", "goes", "went", "going"]', 2, 'Past simple for finished actions. Pattern: Subject + [past form]. "Go" → "went" (irregular). Yesterday = past time.', 'easy'),

('foundation', 'past-simple', 'beginner', 'She _____ the movie last week.', '["watch", "watches", "watched", "watching"]', 2, 'Past simple regular: add -ed. Pattern: She + [verb + ed]. Watch → watched. "Last week" = past time marker.', 'easy'),

('foundation', 'past-simple', 'beginner', 'They _____ cricket on Sunday.', '["play", "plays", "played", "playing"]', 2, 'Past simple regular: add -ed. Pattern: They + [verb + ed]. Play → played. Finished action in past.', 'easy'),

('foundation', 'past-simple', 'beginner', 'He _____ his homework.', '["finish", "finishes", "finished", "finishing"]', 2, 'Past simple regular: add -ed. Pattern: He + [verb + ed]. Finish → finished. Action completed.', 'easy'),

('foundation', 'past-simple', 'beginner', 'We _____ in Mumbai last year.', '["live", "lives", "lived", "living"]', 2, 'Past simple regular: add -ed. Pattern: We + [verb + ed]. Live → lived. "Last year" = past time.', 'easy'),

('foundation', 'past-simple', 'beginner', 'I _____ my friend yesterday.', '["call", "calls", "called", "calling"]', 2, 'Past simple regular: add -ed. Pattern: I + [verb + ed]. Call → called. Yesterday = finished action.', 'easy'),

('foundation', 'past-simple', 'beginner', 'She _____ to office by bus.', '["travel", "travels", "travelled", "traveling"]', 2, 'Past simple regular: add -ed (British: double L). Pattern: She + [verb + ed]. Travel → travelled.', 'easy'),

('foundation', 'past-simple', 'beginner', 'They _____ the meeting.', '["attend", "attends", "attended", "attending"]', 2, 'Past simple regular: add -ed. Pattern: They + [verb + ed]. Attend → attended.', 'easy'),

('foundation', 'past-simple', 'beginner', 'He _____ to my question.', '["answer", "answers", "answered", "answering"]', 2, 'Past simple regular: add -ed. Pattern: He + [verb + ed]. Answer → answered.', 'easy'),

('foundation', 'past-simple', 'beginner', 'We _____ our lunch at 1 PM.', '["cook", "cooks", "cooked", "cooking"]', 2, 'Past simple regular: add -ed. Pattern: We + [verb + ed]. Cook → cooked. Time in past = 1 PM (finished).', 'easy'),

('foundation', 'past-simple', 'beginner', 'I _____ at the party.', '["dance", "dances", "danced", "dancing"]', 2, 'Past simple regular: add -ed. Pattern: I + [verb + ed]. Dance → danced. Party already happened.', 'easy'),

('foundation', 'past-simple', 'beginner', 'She _____ her keys.', '["drop", "drops", "dropped", "dropping"]', 2, 'Past simple: double consonant + ed. Pattern: She + [verb + p + ed]. Drop → dropped (short vowel + one consonant = double).', 'easy'),

-- MEDIUM QUESTIONS (12) - Spelling rules and real contexts
('foundation', 'past-simple', 'beginner', 'I _____ my exam. (Spelling: consonant + y)', '["studyed", "studied", "studyd", "studies"]', 1, 'Spelling rule: consonant + y → drop y + ied. Pattern: study → studied. Also: try → tried, cry → cried.', 'medium'),

('foundation', 'past-simple', 'beginner', 'Arrange correctly: to / Mumbai / moved / We / last / year', '["We moved to Mumbai last year", "We to Mumbai moved last year", "Last year we moved to Mumbai", "We moved last year to Mumbai"]', 0, 'Pattern: We + [past verb] + to + [place] + [time]. Order: subject + verb + destination + when. Both A and C work, A is most common.', 'medium'),

('foundation', 'past-simple', 'beginner', 'What is wrong? "She cook dinner last night."', '["Use cooked instead of cook", "Use cooks instead of cook", "Use cooking instead of cook", "Nothing wrong"]', 0, 'Missing past form! Pattern: She + [verb + ed]. Correct: "She cooked dinner last night." Past time marker (last night) needs past simple.', 'medium'),

('foundation', 'past-simple', 'beginner', 'Talking about your vacation:', '["I visit Goa last month.", "I visited Goa last month.", "I visits Goa last month.", "I am visiting Goa last month."]', 1, 'Pattern: I + [past verb] + [place] + [time]. Use visited (past). "Last month" = finished time = past simple. Correct: "I visited Goa last month."', 'medium'),

('foundation', 'past-simple', 'beginner', 'Choose the correct sentence:', '["He start his new job yesterday.", "He started his new job yesterday.", "He starting his new job yesterday.", "He starts his new job yesterday."]', 1, 'Pattern: He + [verb + ed] + [time]. Past time (yesterday) = past simple. Start → started. Correct: "He started his new job yesterday."', 'medium'),

('foundation', 'past-simple', 'beginner', 'Complete: They _____ for two hours. (Spelling: CVC doubling)', '["stoped", "stopped", "stopd", "stops"]', 1, 'Spelling rule: short vowel + one consonant → double + ed. Stop → stopped (double p). Also: plan → planned.', 'medium'),

('foundation', 'past-simple', 'beginner', 'What is the error? "We doesn''t go to the party."', '["Use didn''t instead of doesn''t", "Use don''t instead of doesn''t", "Use not instead of doesn''t", "Nothing wrong"]', 0, 'Wrong helper! Past negative: didn''t (not doesn''t). Pattern: We + didn''t + [base verb]. Correct: "We didn''t go to the party." Doesn''t = present, didn''t = past.', 'medium'),

('foundation', 'past-simple', 'beginner', 'Rearrange: the / She / yesterday / attended / meeting', '["She attended the meeting yesterday", "She the meeting attended yesterday", "Yesterday she attended the meeting", "She attended yesterday the meeting"]', 0, 'Pattern: She + [past verb] + the + [thing] + [time]. Natural order: She attended the meeting yesterday. Time usually goes at end.', 'medium'),

('foundation', 'past-simple', 'beginner', 'At work, reporting what happened:', '["I complete the report this morning.", "I completed the report this morning.", "I completes the report this morning.", "I completing the report this morning."]', 1, 'Pattern: I + [past verb] + [thing] + [time]. "This morning" (if it''s afternoon/evening now) = finished = past simple. Complete → completed.', 'medium'),

('foundation', 'past-simple', 'beginner', 'Choose the natural sentence:', '["Last night I watch TV.", "I watch TV last night.", "I watched TV last night.", "I watching TV last night."]', 2, 'Pattern: I + [past verb] + [thing] + [time]. Past time marker (last night) = past simple. Watch → watched. Most natural: "I watched TV last night."', 'medium'),

('foundation', 'past-simple', 'beginner', 'What is wrong? "He walk to school yesterday."', '["Use walked instead of walk", "Use walks instead of walk", "Use walking instead of walk", "Nothing wrong"]', 0, 'Missing past form! Pattern: He + [verb + ed]. Correct: "He walked to school yesterday." Past time needs past verb.', 'medium'),

('foundation', 'past-simple', 'beginner', 'Complete: I _____ my car last week. (Spelling: silent e)', '["washd", "washed", "washe", "washing"]', 1, 'Spelling rule: verb ends in silent e → just add d. Pattern: wash has "sh" sound but no silent e, so: wash + ed = washed (regular).', 'medium'),

-- HARD QUESTIONS (6) - Irregular awareness, formal writing
('foundation', 'past-simple', 'beginner', 'Which is correct in formal business email?', '["We receive your email yesterday.", "We received your email yesterday.", "We receives your email yesterday.", "We receiving your email yesterday."]', 1, 'Pattern: We + [past verb] + [thing] + [time]. Formal writing still uses past simple for finished actions. Receive → received. Yesterday = past.', 'hard'),

('foundation', 'past-simple', 'beginner', 'Find the error: "I didn''t went to work."', '["Use go instead of went", "Use going instead of went", "Use goes instead of went", "No error"]', 0, 'Double past error! Pattern: didn''t + [BASE verb] (not past). Correct: "I didn''t go to work." Didn''t already shows past, so use "go" (not "went").', 'hard'),

('foundation', 'past-simple', 'beginner', 'Arrange correctly: ago / lived / here / We / years / five', '["We lived here five years ago", "We lived five years ago here", "Five years ago we lived here", "We here lived five years ago"]', 0, 'Pattern: We + [past verb] + [place] + [number] + [unit] + ago. "Ago" goes at END of time phrase. Natural: We lived here five years ago. Can also start with time.', 'hard'),

('foundation', 'past-simple', 'beginner', 'What is wrong? "She didn''t called me."', '["Use call instead of called", "Use calls instead of called", "Use calling instead of called", "Nothing wrong"]', 0, 'Double past error! Pattern: didn''t + [BASE verb]. Correct: "She didn''t call me." Didn''t = already past, so verb stays base form (call, not called).', 'hard'),

('foundation', 'past-simple', 'beginner', 'Which sentence shows the action is completely finished?', '["I am completing the task.", "I complete the task.", "I completed the task.", "I will complete the task."]', 2, 'Past simple = completed/finished action. Pattern: I + [past verb]. "I completed the task" = it''s done (100% finished). Other tenses show ongoing/habit/future.', 'hard'),

('foundation', 'past-simple', 'beginner', 'Find the error: "Did you went to the meeting?"', '["Use go instead of went", "Use going instead of went", "Use goes instead of went", "No error"]', 0, 'Double past error in question! Pattern: Did + subject + [BASE verb]? Correct: "Did you go to the meeting?" Did = already past, so use base form go (not went).', 'hard');

-- Verify insertion
SELECT COUNT(*) as total_inserted FROM english_questions WHERE topic_id = 'past-simple';
