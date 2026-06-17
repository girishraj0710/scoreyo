-- ============================================================================
-- FOUNDATION PATH: Active-Passive Voice (COMPLETE)
-- Topic ID: active-passive
-- Level: intermediate (A2)
-- Total: 150 questions covering ALL 5 subtopics
-- ============================================================================
-- Subtopics covered:
--   1. Basic Active to Passive Conversion - 30 questions
--   2. Passive with Different Tenses - 30 questions
--   3. By-Agent Usage - 30 questions
--   4. Questions in Passive - 30 questions
--   5. Negative Passive - 30 questions
-- Distribution: 60 easy, 60 medium, 30 hard (40/40/20)
-- ============================================================================

INSERT INTO english_questions (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty) VALUES

-- ============================================================================
-- SUBTOPIC 1: Basic Active to Passive Conversion (30 questions)
-- ============================================================================

-- EASY (12 questions)
('foundation', 'active-passive', 'intermediate', 'Active: "She writes a letter." Passive:', '["A letter is written by her.", "A letter was written by her.", "A letter writes by her.", "She is written a letter."]', 0, 'Simple present active → passive: Object + is/am/are + past participle + by + subject. "Letter" becomes subject, "writes" → "is written".', 'easy'),

('foundation', 'active-passive', 'intermediate', 'Passive voice uses:', '["past participle", "base verb", "present participle", "infinitive"]', 0, 'Passive voice: be + past participle. Pattern: Object + be + V3 + by + subject. Always uses past participle!', 'easy'),

('foundation', 'active-passive', 'intermediate', 'Active: "They built a house." Passive:', '["A house was built by them.", "A house is built by them.", "A house builds by them.", "They were built a house."]', 0, 'Simple past active → passive: Object + was/were + past participle + by + subject. "House" becomes subject, "built" → "was built".', 'easy'),

('foundation', 'active-passive', 'intermediate', '"The book is read by students." This is:', '["Passive voice", "Active voice", "Both", "Neither"]', 0, 'Passive voice: subject receives action. "Book" receives action (is read). Pattern: be + past participle = passive.', 'easy'),

('foundation', 'active-passive', 'intermediate', 'Active: "He eats an apple." Passive:', '["An apple is eaten by him.", "An apple eats by him.", "He is eaten an apple.", "An apple was eaten by him."]', 0, 'Simple present active → passive: apple (object) becomes subject. Pattern: Object + is + eaten (V3) + by him.', 'easy'),

('foundation', 'active-passive', 'intermediate', 'In passive voice, the object becomes:', '["subject", "verb", "adverb", "object"]', 0, 'Passive transformation: Active object → Passive subject. "I eat apple" (active) → "Apple is eaten by me" (passive). Object becomes subject!', 'easy'),

('foundation', 'active-passive', 'intermediate', 'Active: "She loves music." Passive:', '["Music is loved by her.", "Music loves by her.", "She is loved music.", "Music was loved by her."]', 0, 'Simple present: "music" (object) → subject. Pattern: Music + is + loved (V3) + by her. Present tense passive!', 'easy'),

('foundation', 'active-passive', 'intermediate', '"Was the door opened by you?" Type:', '["Passive question", "Active question", "Statement", "Command"]', 0, 'Passive question: Was + subject + past participle + by + agent? Door = subject receiving action. Passive voice!', 'easy'),

('foundation', 'active-passive', 'intermediate', 'Active: "They teach English." Passive:', '["English is taught by them.", "English teaches by them.", "They are taught English.", "English was taught by them."]', 0, 'Simple present: English (object) → subject. Pattern: English + is + taught (V3, irregular) + by them.', 'easy'),

('foundation', 'active-passive', 'intermediate', 'The word "by" in passive introduces:', '["the agent (doer)", "the object", "the action", "the time"]', 0, 'In passive voice, "by" introduces the agent (who did the action). "Letter written by John" = John is the doer/agent.', 'easy'),

('foundation', 'active-passive', 'intermediate', 'Active: "I write emails." Passive:', '["Emails are written by me.", "Emails write by me.", "I am written emails.", "Emails is written by me."]', 0, 'Simple present, plural object: Emails (object) → subject. Pattern: Emails + are + written (V3) + by me. Plural = "are"!', 'easy'),

('foundation', 'active-passive', 'intermediate', '"A cake was baked by Mom." Voice:', '["Passive", "Active", "Both", "Neither"]', 0, 'Passive voice: subject (cake) receives action. Pattern: be (was) + past participle (baked) = passive voice.', 'easy'),

-- MEDIUM (12 questions)
('foundation', 'active-passive', 'intermediate', 'Convert: "She cooks dinner every day."', '["Dinner is cooked by her every day.", "Dinner cooks by her every day.", "She is cooked dinner every day.", "Dinner was cooked by her every day."]', 0, 'Simple present: Dinner (object) → subject. Pattern: Dinner + is + cooked (V3) + by her + time. Keep time phrase at end!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Active: "John painted the wall." Passive:', '["The wall was painted by John.", "The wall is painted by John.", "The wall paints by John.", "John was painted the wall."]', 0, 'Simple past: wall (object) → subject. Past tense → was + V3. Pattern: The wall + was + painted + by John.', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Error in: "The letter is write by him."', '["Use: written instead of write", "Use: wrote", "Remove: is", "Nothing wrong"]', 0, 'Passive needs past participle! Correct: "The letter is written by him." Pattern: be + V3 (past participle), not base verb!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Convert: "They will build a bridge."', '["A bridge will be built by them.", "A bridge is built by them.", "A bridge was built by them.", "They will be built a bridge."]', 0, 'Future: will + be + V3. Pattern: Object + will be + past participle + by + subject. "will build" → "will be built"!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Active: "We clean the house." Passive:', '["The house is cleaned by us.", "The house cleans by us.", "We are cleaned the house.", "The house was cleaned by us."]', 0, 'Simple present: house (object) → subject. Pattern: The house + is + cleaned (V3) + by us. Present → "is"!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'What is wrong? "A song is sang by her."', '["Use: sung instead of sang", "Use: sing", "Use: singed", "Nothing wrong"]', 0, 'Irregular past participle! Correct: "A song is sung by her." Pattern: sing → sang → sung. Passive needs V3 (sung)!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Convert: "She has completed the project."', '["The project has been completed by her.", "The project is completed by her.", "The project was completed by her.", "The project completes by her."]', 0, 'Present perfect: has/have + been + V3. Pattern: Object + has been + V3 + by + subject. Present perfect passive!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Active: "He broke the glass." Passive:', '["The glass was broken by him.", "The glass is broken by him.", "The glass breaks by him.", "He was broken the glass."]', 0, 'Simple past: glass (object) → subject. Pattern: The glass + was + broken (V3, irregular) + by him. Past → "was"!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Error: "The food is being cook by the chef."', '["Use: cooked instead of cook", "Use: cooks", "Remove: being", "Nothing wrong"]', 0, 'Continuous passive: being + past participle. Correct: "The food is being cooked by the chef." Pattern: be + being + V3!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Convert: "People speak English worldwide."', '["English is spoken worldwide by people.", "English speaks worldwide by people.", "People are spoken English worldwide.", "English was spoken worldwide by people."]', 0, 'Simple present: English (object) → subject. Pattern: English + is + spoken (V3) + place + by people. Can omit "by people" (understood)!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Active: "They are watching a movie." Passive:', '["A movie is being watched by them.", "A movie watches by them.", "They are watched a movie.", "A movie was watched by them."]', 0, 'Present continuous: am/is/are + being + V3. Pattern: A movie + is being + watched + by them. Continuous passive!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Error in: "The bridge is build by workers."', '["Use: built instead of build", "Use: builds", "Remove: is", "Nothing wrong"]', 0, 'Past participle needed! Correct: "The bridge is built by workers." Pattern: be + V3 (built), not base verb!', 'medium'),

-- HARD (6 questions)
('foundation', 'active-passive', 'intermediate', 'Which is WRONG?', '["The car is washed by him.", "The letter was sent by her.", "The book is write by the author.", "A house was built by them."]', 2, 'Wrong past participle! "The book is write..." Correct: "is written". Pattern: be + V3. "write" is base verb, needs "written"!', 'hard'),

('foundation', 'active-passive', 'intermediate', 'Convert: "Someone stole my wallet."', '["My wallet was stolen by someone.", "My wallet is stolen by someone.", "Someone was stolen my wallet.", "My wallet stole by someone."]', 0, 'Simple past: wallet (object) → subject. Pattern: My wallet + was + stolen (V3) + by someone. Can simplify to "My wallet was stolen." (omit agent)!', 'hard'),

('foundation', 'active-passive', 'intermediate', 'Error: "The prize has been win by our team."', '["Use: won instead of win", "Use: wins", "Remove: been", "Nothing wrong"]', 0, 'Irregular V3! Correct: "The prize has been won by our team." Pattern: has been + V3. win → won (same for past and V3)!', 'hard'),

('foundation', 'active-passive', 'intermediate', 'Convert: "Did they complete the work?"', '["Was the work completed by them?", "Is the work completed by them?", "Did the work complete by them?", "Does the work completed by them?"]', 0, 'Past question → passive: Was/Were + object + V3 + by + subject? Pattern: Was + the work + completed + by them? Past → "Was"!', 'hard'),

('foundation', 'active-passive', 'intermediate', 'Which cannot be passive?', '["He runs fast.", "She wrote a letter.", "They built a house.", "I eat apples."]', 0, 'Intransitive verb (no object) = no passive! "runs fast" has no object. Pattern: Only transitive verbs (with objects) can be passive!', 'hard'),

('foundation', 'active-passive', 'intermediate', 'Error: "The homework must be did by students."', '["Use: done instead of did", "Use: do", "Remove: be", "Nothing wrong"]', 0, 'Modal + be + V3! Correct: "The homework must be done by students." Pattern: must + be + V3 (done), not past tense (did)!', 'hard'),

-- ============================================================================
-- SUBTOPIC 2: Passive with Different Tenses (30 questions)
-- ============================================================================

-- EASY (12 questions)
('foundation', 'active-passive', 'intermediate', 'Simple present passive form:', '["is/am/are + V3", "was/were + V3", "will + V3", "have + V3"]', 0, 'Simple present passive: is/am/are + past participle. "Book is read" (singular), "Books are read" (plural).', 'easy'),

('foundation', 'active-passive', 'intermediate', 'Simple past passive form:', '["was/were + V3", "is/am/are + V3", "has/have been + V3", "will be + V3"]', 0, 'Simple past passive: was/were + past participle. "Book was read" (singular), "Books were read" (plural).', 'easy'),

('foundation', 'active-passive', 'intermediate', 'Present continuous passive: "They are building a house."', '["A house is being built by them.", "A house is built by them.", "A house was being built by them.", "A house has been built by them."]', 0, 'Present continuous passive: is/am/are + being + V3. Pattern: Object + is being + past participle + by + subject.', 'easy'),

('foundation', 'active-passive', 'intermediate', 'Future simple passive form:', '["will be + V3", "will + V3", "is/are + V3", "was/were + V3"]', 0, 'Future simple passive: will be + past participle. "Book will be read" = passive future. Pattern: will + be + V3!', 'easy'),

('foundation', 'active-passive', 'intermediate', 'Present perfect passive: "She has written a book."', '["A book has been written by her.", "A book is written by her.", "A book was written by her.", "A book had been written by her."]', 0, 'Present perfect passive: has/have + been + V3. Pattern: Object + has been + past participle + by + subject.', 'easy'),

('foundation', 'active-passive', 'intermediate', 'Past continuous passive form:', '["was/were + being + V3", "is/am/are + being + V3", "was/were + V3", "has/have been + V3"]', 0, 'Past continuous passive: was/were + being + V3. "Letter was being written" = action in progress in past (passive).', 'easy'),

('foundation', 'active-passive', 'intermediate', 'Modal passive: "He can solve the problem."', '["The problem can be solved by him.", "The problem is solved by him.", "The problem was solved by him.", "The problem solves by him."]', 0, 'Modal passive: modal + be + V3. Pattern: can/must/should/will + be + past participle. "can solve" → "can be solved"!', 'easy'),

('foundation', 'active-passive', 'intermediate', 'Past perfect passive form:', '["had been + V3", "has been + V3", "was/were + V3", "will be + V3"]', 0, 'Past perfect passive: had + been + V3. "Book had been read" = action completed before another past action (passive).', 'easy'),

('foundation', 'active-passive', 'intermediate', 'Present perfect passive: "They have finished the work."', '["The work has been finished by them.", "The work is finished by them.", "The work was finished by them.", "The work finishing by them."]', 0, 'Present perfect: has/have + been + V3. Pattern: The work + has been + finished + by them. Perfect passive!', 'easy'),

('foundation', 'active-passive', 'intermediate', '"The letter is being written." Tense?', '["Present continuous passive", "Simple present passive", "Past continuous passive", "Present perfect passive"]', 0, 'Present continuous passive: is/am/are + being + V3. Shows ongoing action happening now (passive voice).', 'easy'),

('foundation', 'active-passive', 'intermediate', 'Simple present passive: "They sell books here."', '["Books are sold here by them.", "Books is sold here by them.", "Books sold here by them.", "Books are selling here by them."]', 0, 'Simple present, plural: Books (plural object) → are + V3. Pattern: Books + are + sold + place. Plural = "are"!', 'easy'),

('foundation', 'active-passive', 'intermediate', '"The house will be built next year." Tense?', '["Future simple passive", "Simple present passive", "Present perfect passive", "Past simple passive"]', 0, 'Future simple passive: will be + V3. Shows action will happen in future (passive voice).', 'easy'),

-- MEDIUM (12 questions)
('foundation', 'active-passive', 'intermediate', 'Convert to passive: "She is cooking dinner."', '["Dinner is being cooked by her.", "Dinner is cooked by her.", "Dinner was being cooked by her.", "Dinner has been cooked by her."]', 0, 'Present continuous: is/am/are + being + V3. Pattern: Dinner + is being + cooked + by her. Ongoing action now (passive)!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Past continuous passive: "They were repairing the road."', '["The road was being repaired by them.", "The road is being repaired by them.", "The road was repaired by them.", "The road has been repaired by them."]', 0, 'Past continuous: was/were + being + V3. Pattern: The road + was being + repaired + by them. Ongoing past action (passive)!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Error in: "The book has written by her."', '["Use: has been written", "Use: is written", "Use: was written", "Nothing wrong"]', 0, 'Present perfect passive needs "been"! Correct: "has been written". Pattern: has/have + been + V3. Missing "been"!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Convert: "He will finish the project tomorrow."', '["The project will be finished by him tomorrow.", "The project is finished by him tomorrow.", "The project was finished by him tomorrow.", "The project finishes by him tomorrow."]', 0, 'Future simple: will + be + V3. Pattern: The project + will be + finished + by him + time. Future passive!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Modal passive: "You must complete the assignment."', '["The assignment must be completed by you.", "The assignment is completed by you.", "The assignment was completed by you.", "The assignment completes by you."]', 0, 'Modal + be + V3: must + be + completed. Pattern: Object + modal + be + V3 + by + subject. Modal passive!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Error: "The letter was being write by him."', '["Use: written instead of write", "Use: wrote", "Remove: being", "Nothing wrong"]', 0, 'Continuous passive needs V3! Correct: "was being written". Pattern: was/were + being + V3 (past participle)!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Convert: "They had completed the task."', '["The task had been completed by them.", "The task has been completed by them.", "The task was completed by them.", "The task is completed by them."]', 0, 'Past perfect: had + been + V3. Pattern: The task + had been + completed + by them. Perfect passive (before past)!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Present continuous passive: "He is reading a book."', '["A book is being read by him.", "A book reads by him.", "A book was being read by him.", "A book has been read by him."]', 0, 'Present continuous: is + being + V3. Pattern: A book + is being + read + by him. Ongoing now (passive)!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Error: "The work will done by tomorrow."', '["Use: will be done", "Use: will do", "Remove: will", "Nothing wrong"]', 0, 'Future passive needs "be"! Correct: "will be done". Pattern: will + be + V3. Missing "be"!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Convert: "She has been writing a novel."', '["A novel has been being written by her.", "A novel is being written by her.", "A novel has been written by her.", "A novel was being written by her."]', 0, 'Present perfect continuous passive (rare, awkward): has been being + V3. Better: simplify to "A novel has been written" OR keep active voice! Grammar note: this form is grammatically correct but rarely used in practice.', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Past perfect passive: "They had built the house."', '["The house had been built by them.", "The house has been built by them.", "The house was built by them.", "The house is built by them."]', 0, 'Past perfect: had + been + V3. Pattern: The house + had been + built + by them. Completed before past point!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Error: "A new bridge is be built here."', '["Use: is being built", "Use: is built", "Remove: be", "Nothing wrong"]', 0, 'Present continuous passive! Correct: "is being built" (ongoing) OR "is built" (general fact). "is be" = wrong! Pattern: is + being + V3!', 'medium'),

-- HARD (6 questions)
('foundation', 'active-passive', 'intermediate', 'Which tense is WRONG in passive?', '["The letter is being write now.", "The letter was written yesterday.", "The letter will be written tomorrow.", "The letter has been written already."]', 0, 'Wrong V3! "is being write" → Correct: "is being written". Pattern: be + being + V3 (past participle)!', 'hard'),

('foundation', 'active-passive', 'intermediate', 'Convert: "They should have completed the work by now."', '["The work should have been completed by them by now.", "The work should be completed by them by now.", "The work should have complete by them by now.", "The work has been completed by them by now."]', 0, 'Modal perfect passive: should + have + been + V3. Pattern: Object + modal + have been + V3 + by + subject. Complex modal passive!', 'hard'),

('foundation', 'active-passive', 'intermediate', 'Error: "The house had built by 2020."', '["Use: had been built", "Use: has been built", "Use: was built", "Nothing wrong"]', 0, 'Past perfect passive needs "been"! Correct: "had been built". Pattern: had + been + V3. Passive needs "been"!', 'hard'),

('foundation', 'active-passive', 'intermediate', 'Convert: "Someone is following me."', '["I am being followed by someone.", "I am followed by someone.", "I was being followed by someone.", "I have been followed by someone."]', 0, 'Present continuous: Object (me → I) + am being + V3. Pattern: I + am being + followed + by someone. Ongoing now (passive)!', 'hard'),

('foundation', 'active-passive', 'intermediate', 'Which is grammatically correct but rarely used?', '["The work has been being done since morning.", "The work is done daily.", "The work was done yesterday.", "The work will be done tomorrow."]', 0, 'Present perfect continuous passive (awkward): has been being + V3. Grammatically valid but avoided in practice. Better: "has been done" OR use active voice!', 'hard'),

('foundation', 'active-passive', 'intermediate', 'Error: "The problem could solved by him."', '["Use: could be solved", "Use: could solve", "Remove: solved", "Nothing wrong"]', 0, 'Modal passive needs "be"! Correct: "could be solved". Pattern: modal + be + V3. Missing "be"!', 'hard'),

-- ============================================================================
-- SUBTOPIC 3: By-Agent Usage (30 questions)
-- ============================================================================

-- EASY (12 questions)
('foundation', 'active-passive', 'intermediate', 'The agent (doer) in passive voice is introduced by:', '["by", "with", "from", "for"]', 0, '"By" introduces the agent (who did the action). "Letter written by John" = John is the doer/agent.', 'easy'),

('foundation', 'active-passive', 'intermediate', '"The letter was written by her." Agent?', '["her", "letter", "written", "was"]', 0, 'Agent = doer = person after "by". "by her" = she is the agent who wrote. Pattern: by + agent!', 'easy'),

('foundation', 'active-passive', 'intermediate', 'When can we omit "by + agent"?', '["When agent is unknown/obvious", "Always", "Never", "Only in questions"]', 0, 'Omit "by + agent" when doer is unknown, unimportant, or obvious. "English is spoken here." (by whom? doesn''t matter). Focus on action/object!', 'easy'),

('foundation', 'active-passive', 'intermediate', 'Which is correct without agent?', '["The book was published in 2020.", "The book was published by in 2020.", "The book was published 2020.", "The book was published by."]', 0, 'Correct: omit entire "by + agent" phrase. "published in 2020" (year matters, publisher doesn''t). Don''t leave "by" alone!', 'easy'),

('foundation', 'active-passive', 'intermediate', '"Mistakes were made." Agent?', '["Not mentioned (unknown/avoided)", "Mistakes", "Made", "Were"]', 0, 'No agent mentioned! This is passive without agent. Common when avoiding responsibility or agent is unknown. Pattern: subject + be + V3 (no by-agent).', 'easy'),

('foundation', 'active-passive', 'intermediate', '"The house was built by workers." Can we omit agent?', '["Yes, if workers not important", "No, always need agent", "Only in past tense", "Never omit in passive"]', 0, 'Can omit if agent not important. "The house was built last year." (focus on house/time). Include agent only if relevant!', 'easy'),

('foundation', 'active-passive', 'intermediate', 'Which passive has agent?', '["The letter was sent by John.", "The letter was sent yesterday.", "The letter is sent daily.", "Letters are sent here."]', 0, 'Only A has agent: "by John". Others have time/frequency/place but no doer mentioned. Pattern: by + agent!', 'easy'),

('foundation', 'active-passive', 'intermediate', '"English is spoken in India." Agent?', '["Not mentioned (obvious/general)", "English", "India", "Spoken"]', 0, 'No agent! General statement, agent = people in general (obvious, not specified). Pattern: passive without by-agent = focus on fact!', 'easy'),

('foundation', 'active-passive', 'intermediate', 'When is agent important to mention?', '["When doer is significant/specific", "Always in passive", "Never in passive", "Only in questions"]', 0, 'Mention agent when doer is important: "Hamlet was written by Shakespeare." (author matters!). Omit if obvious/unimportant!', 'easy'),

('foundation', 'active-passive', 'intermediate', '"The door was opened." Need agent?', '["No, if who opened not important", "Yes, always need agent", "Only in past", "Only in questions"]', 0, 'Agent optional! "The door was opened." (focus: door is open now). Add agent only if who opened it matters: "by the guard".', 'easy'),

('foundation', 'active-passive', 'intermediate', '"The cake was eaten." Agent?', '["Not mentioned (focus on cake)", "Cake", "Eaten", "Was"]', 0, 'No agent! Focus on cake being gone. Agent unknown or unimportant. Pattern: passive without agent = focus on result/object!', 'easy'),

('foundation', 'active-passive', 'intermediate', 'Which needs agent?', '["The Mona Lisa was painted by da Vinci.", "Rice is grown in Asia.", "The window was broken.", "Dinner is served at 7."]', 0, 'A needs agent (artist is famous/important). Others: agent obvious/general/unimportant. Include agent when significant!', 'easy'),

-- MEDIUM (12 questions)
('foundation', 'active-passive', 'intermediate', 'Rewrite without agent: "The letter was written by someone."', '["The letter was written.", "The letter was written by.", "The letter was.", "The letter written."]', 0, 'Omit entire "by someone" phrase. "someone" = vague/unknown agent. Correct: "The letter was written." Complete passive without agent!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Error in: "The book was published by in 2020."', '["Remove: by", "Add: them after by", "Move: by to end", "Nothing wrong"]', 0, 'Don''t leave "by" alone! Correct: "The book was published in 2020." (omit "by") OR "by publisher name in 2020" (add agent). Never "by in"!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Which passive should include agent?', '["The theory was proposed by Einstein.", "The door was closed at 10 PM.", "Emails are sent daily.", "The room was cleaned."]', 0, 'A: Einstein = famous scientist, agent matters! Others: when/how matters more than who. Include agent when doer is significant!', 'medium'),

('foundation', 'active-passive', 'intermediate', '"The thief was caught by the police." Omit agent?', '["No, police is important context", "Yes, always omit agent", "Only in past tense", "Only in questions"]', 0, 'Agent important here! "by the police" adds crucial information (who caught = police, not random person). Keep when agent adds meaning!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Rewrite with agent: "A mistake was made."', '["A mistake was made by me/him/her.", "A mistake by was made.", "A mistake was by made.", "A made mistake."]', 0, 'Add agent after V3: Pattern: subject + was + V3 + by + agent. "A mistake was made by me." (now agent is clear!)', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Error: "The song was sung by."', '["Add: agent after by OR remove by", "Add: verb", "Move: by", "Nothing wrong"]', 0, 'Don''t end with "by"! Correct: "The song was sung by her" (add agent) OR "The song was sung" (omit by-agent). Never leave "by" hanging!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Which can omit agent?', '["All can omit if agent not crucial", "None can omit agent", "Only A", "Only B"]', 0, 'Any passive can omit agent if doer is obvious/unimportant/unknown. "The work was done." vs "The work was done by John." Both valid! Context decides!', 'medium'),

('foundation', 'active-passive', 'intermediate', '"The Taj Mahal was built by Shah Jahan." Omit agent?', '["No, historical figure is significant", "Yes, building matters not builder", "Only in formal writing", "Only in past"]', 0, 'Agent crucial! Shah Jahan = famous emperor, historical importance. "The Taj Mahal was built in 1653" (time) vs "by Shah Jahan" (who) — both important facts!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Rewrite: "Someone stole my wallet." (passive, no agent)', '["My wallet was stolen.", "My wallet was stolen by.", "My wallet was stolen by someone.", "My wallet stolen."]', 0, 'Omit agent (unknown/someone). Correct: "My wallet was stolen." Complete sentence, no agent needed! Pattern: subject + be + V3 (no by-phrase)!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Error: "The work was done by them by yesterday."', '["Remove: first by OR second by", "Nothing wrong", "Remove: both by", "Switch: by positions"]', 0, 'Two "by" wrong! Correct: "The work was done by them yesterday." (by + agent, no "by" before time) OR "The work was done by yesterday." (deadline meaning, rare). First = agent, second = wrong!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Which passive focuses on action, not doer?', '["All passive can (by omitting agent)", "None (passive needs agent)", "Only past tense", "Only present tense"]', 0, 'Passive voice purpose: focus on action/object, not doer! Omit agent to emphasize result: "The door was opened." (door = focus). Add agent only if relevant!', 'medium'),

('foundation', 'active-passive', 'intermediate', '"The match was won by our team." Essential agent?', '["Yes, who won matters here", "No, omit always", "Only in sports", "Only in present"]', 0, 'Agent important! "by our team" = crucial info (which team won). Sports context: winner identity matters! Keep agent when adds meaning!', 'medium'),

-- HARD (6 questions)
('foundation', 'active-passive', 'intermediate', 'Which is WRONG?', '["The work was done by.", "The work was done yesterday.", "The work was done by them.", "The work was done."]', 0, 'Wrong: "by." alone! Can''t end sentence with "by" without agent. Others correct: no agent (B, D) OR with agent (C). Remove "by" or add agent!', 'hard'),

('foundation', 'active-passive', 'intermediate', 'When is agent passive voice typically omitted?', '["All three scenarios warrant omission", "Never omit agent", "Only when unknown", "Only when obvious"]', 0, 'Omit agent when: (1) unknown ("My bike was stolen"), (2) obvious ("Mistakes were made"), (3) unimportant ("The room was cleaned"). All valid reasons! Context-driven decision!', 'hard'),

('foundation', 'active-passive', 'intermediate', 'Rewrite formal passive: "We made several improvements."', '["Several improvements were made.", "Several improvements were made by.", "Several improvements were made by us.", "We were made several improvements."]', 0, 'Formal passive often omits agent (focus on action). "Several improvements were made." (no need for "by us" in formal reports). Agent-less passive = more formal!', 'hard'),

('foundation', 'active-passive', 'intermediate', '"The decision was made by the committee unanimously." Error?', '["Move: unanimously before by-phrase", "Remove: by", "Remove: unanimously", "Nothing wrong"]', 0, 'Word order! Correct: "The decision was made unanimously by the committee." OR "by the committee unanimously" (both OK). Pattern: adverb typically before by-phrase OR after for emphasis!', 'hard'),

('foundation', 'active-passive', 'intermediate', 'Which needs agent for clarity?', '["The medicine was prescribed by Dr. Smith.", "The window was broken.", "Rice is eaten in Asia.", "The door was opened."]', 0, 'A: doctor''s name adds credibility/authority (medical context). Others: who did it = less important than the fact itself. Professional contexts often need agent!', 'hard'),

('foundation', 'active-passive', 'intermediate', 'Error: "The project was completed by us by the team."', '["Remove: by us OR by the team (redundant)", "Nothing wrong", "Remove: both by phrases", "Switch: order"]', 0, 'Redundant agents! "by us" AND "by the team" = same thing. Correct: "The project was completed by us/the team." Only one agent needed!', 'hard'),

-- ============================================================================
-- SUBTOPIC 4: Questions in Passive (30 questions)
-- ============================================================================

-- EASY (12 questions)
('foundation', 'active-passive', 'intermediate', 'Active: "Do they teach English here?" Passive:', '["Is English taught here by them?", "Does English teach here by them?", "Do English taught here by them?", "English is taught here by them?"]', 0, 'Passive question: Is/Are + subject + V3 + by-phrase? Pattern: Auxiliary + object (as subject) + past participle + by + agent?', 'easy'),

('foundation', 'active-passive', 'intermediate', 'Passive question form (present):', '["Is/Are + subject + V3 + ?", "Does + subject + V3 + ?", "Do + subject + V3 + ?", "Have + subject + V3 + ?"]', 0, 'Passive question: Is/Am/Are + subject + past participle? "Is the letter written?" Pattern: be + subject + V3?', 'easy'),

('foundation', 'active-passive', 'intermediate', 'Active: "Did she write the letter?" Passive:', '["Was the letter written by her?", "Is the letter written by her?", "Did the letter write by her?", "Does the letter written by her?"]', 0, 'Past passive question: Was/Were + subject + V3 + by-phrase? Pattern: Was + the letter + written + by her? Past → "Was"!', 'easy'),

('foundation', 'active-passive', 'intermediate', '"Was the door opened by you?" Type:', '["Passive question", "Active question", "Passive statement", "Active statement"]', 0, 'Passive question: Was + subject + V3 + by + agent? "door" receives action. Pattern: Auxiliary + subject + V3?', 'easy'),

('foundation', 'active-passive', 'intermediate', 'Passive question form (past):', '["Was/Were + subject + V3 + ?", "Is/Are + subject + V3 + ?", "Did + subject + V3 + ?", "Has + subject + V3 + ?"]', 0, 'Past passive question: Was/Were + subject + past participle? "Was the book read?" Pattern: be (past) + subject + V3?', 'easy'),

('foundation', 'active-passive', 'intermediate', 'Active: "Will they complete the work?" Passive:', '["Will the work be completed by them?", "Is the work completed by them?", "Was the work completed by them?", "Will the work complete by them?"]', 0, 'Future passive question: Will + subject + be + V3 + by-phrase? Pattern: Will + the work + be completed + by them?', 'easy'),

('foundation', 'active-passive', 'intermediate', '"Is the letter being written?" Tense?', '["Present continuous passive question", "Simple present passive question", "Past continuous passive question", "Present perfect passive question"]', 0, 'Present continuous passive question: Is/Are + subject + being + V3? Shows ongoing action now (question form).', 'easy'),

('foundation', 'active-passive', 'intermediate', 'Active: "Can you solve this?" Passive:', '["Can this be solved by you?", "Is this solved by you?", "Was this solved by you?", "This can solve by you?"]', 0, 'Modal passive question: Modal + subject + be + V3 + by-phrase? Pattern: Can + this + be solved + by you?', 'easy'),

('foundation', 'active-passive', 'intermediate', '"Has the work been done?" Type:', '["Present perfect passive question", "Simple present passive question", "Past simple passive question", "Future passive question"]', 0, 'Present perfect passive question: Has/Have + subject + been + V3? Shows completed action (question form).', 'easy'),

('foundation', 'active-passive', 'intermediate', 'Passive wh-question: "Who wrote this?"', '["Who was this written by?", "Who did write this?", "Who writes this?", "Who is writing this?"]', 0, 'Wh-question passive: Wh-word + be + subject + V3 + by? Pattern: Who + was + this + written + by? (asking about agent)', 'easy'),

('foundation', 'active-passive', 'intermediate', '"Are letters sent daily here?" Type:', '["Passive question", "Active question", "Statement", "Command"]', 0, 'Passive question: Are + subject + V3 + time/place? "letters" = subject receiving action. Pattern: be + subject + V3?', 'easy'),

('foundation', 'active-passive', 'intermediate', 'Active: "Do they speak English?" Passive:', '["Is English spoken by them?", "Does English speak by them?", "Do English spoken by them?", "English is spoken by them?"]', 0, 'Passive question: Is + subject (English) + V3 (spoken) + by-phrase? Pattern: Is + object + past participle + by-agent?', 'easy'),

-- MEDIUM (12 questions)
('foundation', 'active-passive', 'intermediate', 'Convert to passive: "What did she write?"', '["What was written by her?", "What is written by her?", "What does she write?", "What did write by her?"]', 0, 'Wh-question passive: What + was + written + by her? Pattern: Wh-word + be (past) + V3 + by-agent? Past → "was"!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Error in: "Is the work done by them?"', '["Nothing wrong", "Use: was", "Remove: by them", "Use: do"]', 0, 'Correct! Present passive question: Is + subject + V3 + by-phrase? No error! Pattern valid!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Active: "Where do they make these phones?" Passive:', '["Where are these phones made by them?", "Where do these phones make by them?", "Where are these phones make by them?", "Where these phones are made by them?"]', 0, 'Wh-question + place: Where + are + subject + V3 + by-phrase? Pattern: Where + are + phones + made + by them? Inverted order!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Present continuous passive question: "Are they building a house?"', '["Is a house being built by them?", "Is a house built by them?", "Was a house being built by them?", "Has a house been built by them?"]', 0, 'Present continuous question: Is + subject + being + V3 + by-phrase? Pattern: Is + house + being built + by them? Ongoing now!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Error: "Was the letter written?"', '["Nothing wrong", "Use: is", "Remove: was", "Add: by"]', 0, 'Correct! Past passive question: Was + subject + V3? No agent needed! Pattern valid! No error!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Active: "Have they finished the project?" Passive:', '["Has the project been finished by them?", "Is the project finished by them?", "Was the project finished by them?", "Will the project be finished by them?"]', 0, 'Present perfect question: Has/Have + subject + been + V3 + by-phrase? Pattern: Has + project + been finished + by them? Perfect tense!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Passive question (past continuous): "Were they repairing the road?"', '["Was the road being repaired by them?", "Is the road being repaired by them?", "Was the road repaired by them?", "Has the road been repaired by them?"]', 0, 'Past continuous question: Was/Were + subject + being + V3 + by-phrase? Pattern: Was + road + being repaired + by them? Ongoing past!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Error in: "Does the work done by them?"', '["Use: Is instead of Does", "Remove: done", "Use: do", "Nothing wrong"]', 0, 'Wrong auxiliary! Passive = be, not do. Correct: "Is the work done by them?" Pattern: Is/Are + subject + V3? Not "Does"!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Active: "When will they announce the results?" Passive:', '["When will the results be announced by them?", "When are the results announced by them?", "When were the results announced by them?", "When the results will be announced by them?"]', 0, 'Wh-question future: When + will + subject + be + V3 + by-phrase? Pattern: When + will + results + be announced + by them? Inverted!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Which is correct passive question?', '["Can this problem be solved?", "Can this problem solve?", "Does this problem be solved?", "Is this problem solve?"]', 0, 'Modal passive question: Can + subject + be + V3? Correct: Can + problem + be solved? Pattern: modal + be + V3!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Error: "Has the work been did by them?"', '["Use: done instead of did", "Use: do", "Remove: been", "Nothing wrong"]', 0, 'Wrong V3! Correct: "Has the work been done by them?" Pattern: Has + subject + been + V3 (done, not did)! Past participle needed!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Active: "Why did she reject the proposal?" Passive:', '["Why was the proposal rejected by her?", "Why is the proposal rejected by her?", "Why did the proposal reject by her?", "Why does the proposal rejected by her?"]', 0, 'Wh-question past: Why + was + subject + V3 + by-phrase? Pattern: Why + was + proposal + rejected + by her? Past → "was"!', 'medium'),

-- HARD (6 questions)
('foundation', 'active-passive', 'intermediate', 'Which is WRONG?', '["Was the letter written by her?", "Is the door opened?", "Has the work been completed?", "Does the food cooked?"]', 3, 'Wrong auxiliary! "Does the food cooked?" Correct: "Is the food cooked?" Passive uses be, not do! Pattern: Is/Are + V3, not Does/Do!', 'hard'),

('foundation', 'active-passive', 'intermediate', 'Convert: "Who invented the telephone?"', '["Who was the telephone invented by?", "Who invented the telephone by?", "Who is the telephone invented by?", "Who did invent the telephone by?"]', 0, 'Asking about agent: Who + was + subject + V3 + by? Pattern: Who + was + telephone + invented + by? (asking who = agent at end!) Note: Active "Who invented it?" is more natural, but passive "Who was it invented by?" is grammatically correct!', 'hard'),

('foundation', 'active-passive', 'intermediate', 'Error: "Is the project being complete by them?"', '["Use: completed instead of complete", "Use: completes", "Remove: being", "Nothing wrong"]', 0, 'Wrong V3! Continuous passive: be + being + V3. Correct: "Is the project being completed by them?" Pattern: being + past participle!', 'hard'),

('foundation', 'active-passive', 'intermediate', 'Active: "Had they finished the work before deadline?" Passive:', '["Had the work been finished by them before deadline?", "Has the work been finished by them before deadline?", "Was the work finished by them before deadline?", "Is the work finished by them before deadline?"]', 0, 'Past perfect question: Had + subject + been + V3 + by-phrase + time? Pattern: Had + work + been finished + by them + before deadline? Before past!', 'hard'),

('foundation', 'active-passive', 'intermediate', 'Which passive question omits agent naturally?', '["Is English spoken here?", "Was the letter written by her?", "Can this be solved by you?", "Has the work been done by them?"]', 0, 'A: agent obvious/general (people here). Natural: "Is English spoken here?" (no "by people" needed). Others: agent specified/important! Context-driven!', 'hard'),

('foundation', 'active-passive', 'intermediate', 'Error: "What has been the decision made by?"', '["Remove: been after has", "Move: been after made", "Remove: has", "Nothing wrong"]', 0, 'Word order! Correct: "What has the decision been made by?" OR better: "What decision has been made?" Pattern: What + has + subject + been + V3 (+ by-phrase)? "been" after subject!', 'hard'),

-- ============================================================================
-- SUBTOPIC 5: Negative Passive (30 questions)
-- ============================================================================

-- EASY (12 questions)
('foundation', 'active-passive', 'intermediate', 'Active: "She does not write letters." Passive:', '["Letters are not written by her.", "Letters do not write by her.", "Letters is not written by her.", "She is not written letters."]', 0, 'Negative passive: are/is + not + V3. Pattern: Subject + be + not + past participle + by-phrase. Present tense negative!', 'easy'),

('foundation', 'active-passive', 'intermediate', 'Negative passive form (present):', '["is/are + not + V3", "do/does + not + V3", "was/were + not + V3", "has/have + not + V3"]', 0, 'Negative passive: is/am/are + not + past participle. "The book is not read." Pattern: be + not + V3!', 'easy'),

('foundation', 'active-passive', 'intermediate', 'Active: "They did not complete the work." Passive:', '["The work was not completed by them.", "The work did not complete by them.", "The work is not completed by them.", "They were not completed the work."]', 0, 'Negative past passive: was/were + not + V3. Pattern: The work + was not + completed + by them. Past negative!', 'easy'),

('foundation', 'active-passive', 'intermediate', '"The door is not opened daily." Voice:', '["Passive", "Active", "Both", "Neither"]', 0, 'Passive voice: is + not + V3. Subject (door) receives action. Pattern: be + not + past participle = negative passive!', 'easy'),

('foundation', 'active-passive', 'intermediate', 'Negative passive form (past):', '["was/were + not + V3", "is/are + not + V3", "did + not + V3", "has/have + not + V3"]', 0, 'Negative past passive: was/were + not + past participle. "The letter was not sent." Pattern: be (past) + not + V3!', 'easy'),

('foundation', 'active-passive', 'intermediate', 'Active: "He will not finish the project." Passive:', '["The project will not be finished by him.", "The project is not finished by him.", "The project was not finished by him.", "The project does not finish by him."]', 0, 'Negative future passive: will + not + be + V3. Pattern: The project + will not be + finished + by him. Future negative!', 'easy'),

('foundation', 'active-passive', 'intermediate', '"The food is not being cooked." Tense?', '["Present continuous negative passive", "Simple present negative passive", "Past continuous negative passive", "Present perfect negative passive"]', 0, 'Present continuous negative passive: is/are + not + being + V3. Shows action not happening now (passive).', 'easy'),

('foundation', 'active-passive', 'intermediate', 'Active: "She has not written the letter." Passive:', '["The letter has not been written by her.", "The letter is not written by her.", "The letter was not written by her.", "The letter does not write by her."]', 0, 'Present perfect negative passive: has/have + not + been + V3. Pattern: Letter + has not been + written + by her. Perfect negative!', 'easy'),

('foundation', 'active-passive', 'intermediate', 'Negative modal passive: "He cannot solve the problem."', '["The problem cannot be solved by him.", "The problem is not solved by him.", "The problem was not solved by him.", "The problem does not solve by him."]', 0, 'Negative modal passive: modal + not + be + V3. Pattern: Problem + cannot be + solved + by him. Modal negative!', 'easy'),

('foundation', 'active-passive', 'intermediate', '"The work was not completed on time." Voice:', '["Passive", "Active", "Both", "Neither"]', 0, 'Passive voice: was + not + V3. Subject (work) receives action. Pattern: be + not + past participle = negative passive!', 'easy'),

('foundation', 'active-passive', 'intermediate', 'Short form of "is not" in passive:', '["isn''t (informal)", "don''t", "doesn''t", "wasn''t"]', 0, 'Negative passive contractions: is not = isn''t, are not = aren''t, was not = wasn''t. "The door isn''t opened." Informal writing!', 'easy'),

('foundation', 'active-passive', 'intermediate', 'Active: "They do not sell books here." Passive:', '["Books are not sold here by them.", "Books do not sell here by them.", "Books is not sold here by them.", "They are not sold books here."]', 0, 'Negative passive: are + not + V3. Pattern: Books + are not + sold + place. Present tense, plural negative!', 'easy'),

-- MEDIUM (12 questions)
('foundation', 'active-passive', 'intermediate', 'Convert: "She is not cooking dinner."', '["Dinner is not being cooked by her.", "Dinner does not cook by her.", "Dinner was not being cooked by her.", "Dinner has not been cooked by her."]', 0, 'Present continuous negative passive: is/are + not + being + V3. Pattern: Dinner + is not being + cooked + by her. Ongoing negative now!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Error in: "The work was not did by them."', '["Use: done instead of did", "Use: do", "Remove: not", "Nothing wrong"]', 0, 'Wrong V3! Correct: "The work was not done by them." Pattern: was + not + V3 (done, not did). Past participle needed!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Active: "They were not repairing the road." Passive:', '["The road was not being repaired by them.", "The road is not being repaired by them.", "The road was not repaired by them.", "The road has not been repaired by them."]', 0, 'Past continuous negative passive: was/were + not + being + V3. Pattern: Road + was not being + repaired + by them. Ongoing past negative!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Which is correct?', '["The letter isn''t written by her.", "The letter don''t write by her.", "The letter doesn''t write by her.", "The letter not is written by her."]', 0, 'Correct contraction: isn''t = is not. Pattern: Letter + isn''t + V3 + by-phrase. Passive uses be (isn''t), not do (don''t/doesn''t)!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Active: "He had not completed the task." Passive:', '["The task had not been completed by him.", "The task has not been completed by him.", "The task was not completed by him.", "The task is not completed by him."]', 0, 'Past perfect negative passive: had + not + been + V3. Pattern: Task + had not been + completed + by him. Before past negative!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Error: "The food is not being cook by the chef."', '["Use: cooked instead of cook", "Use: cooks", "Remove: being", "Nothing wrong"]', 0, 'Wrong V3! Continuous passive: being + V3. Correct: "is not being cooked". Pattern: be + not + being + past participle!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Active: "She should not have sent the email." Passive:', '["The email should not have been sent by her.", "The email should not be sent by her.", "The email was not sent by her.", "The email is not sent by her."]', 0, 'Modal perfect negative passive: should + not + have + been + V3. Pattern: Email + should not have been + sent + by her. Complex modal negative!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Convert: "They will not accept the proposal."', '["The proposal will not be accepted by them.", "The proposal is not accepted by them.", "The proposal was not accepted by them.", "The proposal does not accept by them."]', 0, 'Future negative passive: will + not + be + V3. Pattern: Proposal + will not be + accepted + by them. Future negative!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Error: "The work has not complete by them."', '["Use: been completed", "Use: completed", "Remove: not", "Nothing wrong"]', 0, 'Missing "been"! Present perfect passive: has + not + been + V3. Correct: "has not been completed". Pattern: has + not + been + V3!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Active: "Nobody has seen him." Passive:', '["He has not been seen by anybody.", "He is not seen by anybody.", "He was not seen by anybody.", "He does not see by anybody."]', 0, 'Nobody → not...anybody (negative transformation). Present perfect: has not been + V3. Pattern: He + has not been + seen + by anybody. Double negative avoided!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Which is informal negative passive?', '["The work wasn''t done.", "The work was not done.", "Both are correct", "Neither is correct"]', 2, 'Both correct! "wasn''t" = informal/spoken. "was not" = formal/written. Same meaning, different style! Contractions = informal!', 'medium'),

('foundation', 'active-passive', 'intermediate', 'Error: "The book is not wrote by her."', '["Use: written instead of wrote", "Use: write", "Remove: not", "Nothing wrong"]', 0, 'Wrong V3! Passive needs past participle. Correct: "is not written". Pattern: be + not + V3 (written, not wrote)!', 'medium'),

-- HARD (6 questions)
('foundation', 'active-passive', 'intermediate', 'Which is WRONG?', '["The work wasn''t completed.", "The letter isn''t written.", "The door doesn''t opened.", "The food wasn''t cooked."]', 2, 'Wrong auxiliary! "doesn''t opened" = wrong. Correct: "isn''t opened" OR "doesn''t open" (active). Passive uses be + not, not do + not!', 'hard'),

('foundation', 'active-passive', 'intermediate', 'Convert: "None of the students have submitted the assignment."', '["The assignment has not been submitted by any of the students.", "The assignment is not submitted by any students.", "The assignment was not submitted by any students.", "The assignment does not submit by any students."]', 0, 'None → not...any (negative transformation). Present perfect: has + not + been + V3. Pattern: Assignment + has not been + submitted + by any students. Avoid double negative!', 'hard'),

('foundation', 'active-passive', 'intermediate', 'Error: "The problem could not solved by him."', '["Use: be solved", "Use: solve", "Remove: not", "Nothing wrong"]', 0, 'Missing "be"! Modal passive: could + not + be + V3. Correct: "could not be solved". Pattern: modal + not + be + V3!', 'hard'),

('foundation', 'active-passive', 'intermediate', 'Active: "Nobody invited me to the party." Passive:', '["I was not invited to the party by anybody.", "I am not invited to the party by anybody.", "I was not invited to the party.", "I have not been invited to the party."]', 2, 'Best answer: omit "by anybody" (obvious). "I was not invited to the party." = cleaner. Pattern: was + not + V3 (no redundant agent). Alternative A is grammatically correct but wordy!', 'hard'),

('foundation', 'active-passive', 'intermediate', 'Which negative passive is most formal?', '["The proposal has not been accepted.", "The proposal hasn''t been accepted.", "The proposal is not accepted.", "The proposal wasn''t accepted."]', 0, 'Most formal: full forms (has not, was not) > contractions (hasn''t, wasn''t). Present perfect ("has not been accepted") also sounds more formal than simple tenses. Academic/business writing: avoid contractions!', 'hard'),

('foundation', 'active-passive', 'intermediate', 'Error: "The work has not been being done by them."', '["Use: has not been done", "Remove: being", "Use: is not being done", "Nothing wrong"]', 0, 'Awkward perfect continuous passive! Better: "has not been done" (simpler, clearer). "has not been being done" = grammatically possible but rarely used. Simplify: present perfect passive!', 'hard');

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

SELECT 'Active-Passive Question Count Check' as check_name;
SELECT COUNT(*) as total_questions FROM english_questions WHERE topic_id = 'active-passive';

-- Expected output: 150 questions
-- Breakdown: 30 per subtopic × 5 subtopics = 150
