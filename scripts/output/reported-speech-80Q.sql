-- ============================================================================
-- FOUNDATION PATH: Reported Speech (COMPLETE)
-- Topic ID: reported-speech
-- Level: intermediate (A2)
-- Total: 80 questions covering ALL 4 subtopics
-- ============================================================================
-- Subtopics covered:
--   1. Statements (say/tell) - 20 questions
--   2. Questions - 20 questions
--   3. Commands - 20 questions
--   4. Time/Place Changes - 20 questions
-- Distribution: 32 easy, 32 medium, 16 hard (40/40/20)
-- ============================================================================

INSERT INTO english_questions (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty) VALUES

-- ============================================================================
-- SUBTOPIC 1: Statements (say/tell) (20 questions)
-- ============================================================================

-- EASY (8 questions)
('foundation', 'reported-speech', 'intermediate', 'Direct: "I am happy," she said. Reported:', '["She said that she was happy.", "She said that I am happy.", "She says that she is happy.", "She said that she is happy."]', 0, 'Reported speech: said + that + clause. Tense shift: am → was. Pronoun: I → she. Pattern: said that + past tense!', 'easy'),

('foundation', 'reported-speech', 'intermediate', 'In reported speech, "am/is" changes to:', '["was", "is", "are", "were"]', 0, 'Tense backshift: present → past. am/is → was. "I am" → "he/she was". Pattern: simple present → simple past!', 'easy'),

('foundation', 'reported-speech', 'intermediate', 'Direct: "I like tea," he said. Reported:', '["He said that he liked tea.", "He said that I like tea.", "He says that he likes tea.", "He said that he likes tea."]', 0, 'Reported: said + that + past. like → liked. Pronoun: I → he. Pattern: said that + past simple!', 'easy'),

('foundation', 'reported-speech', 'intermediate', '"She said that she was tired." Original:', '["I am tired.", "I was tired.", "She is tired.", "She was tired."]', 0, 'Reverse reporting: was (reported) → am (direct). Pronoun: she → I. Direct speech uses present: "I am tired." Pattern: reverse backshift!', 'easy'),

('foundation', 'reported-speech', 'intermediate', 'Reporting verb "tell" needs:', '["object (person)", "no object", "place", "time"]', 0, '"Tell" = transitive, needs object. "He told me..." (me = object). "He said..." (no object after said). Pattern: tell + person!', 'easy'),

('foundation', 'reported-speech', 'intermediate', 'Direct: "We are students," they said. Reported:', '["They said that they were students.", "They said that we are students.", "They say that they are students.", "They said that they are students."]', 0, 'Reported: said + that + past. are → were. Pronoun: we → they. Pattern: said that + past simple (plural)!', 'easy'),

('foundation', 'reported-speech', 'intermediate', 'Which is correct?', '["She told me that she was busy.", "She told that she was busy.", "She said me that she was busy.", "She told to me that she was busy."]', 0, 'Correct: told + object (me) + that. "told me" = correct pattern. No "told that" / "said me" / "told to me". Pattern: tell + person + that!', 'easy'),

('foundation', 'reported-speech', 'intermediate', 'Direct: "I work in Delhi," he said. Reported:', '["He said that he worked in Delhi.", "He said that I work in Delhi.", "He says that he works in Delhi.", "He said that he works in Delhi."]', 0, 'Reported: work → worked (backshift). Pronoun: I → he. Pattern: said that + past simple!', 'easy'),

-- MEDIUM (8 questions)
('foundation', 'reported-speech', 'intermediate', 'Direct: "I have finished the work," she said. Reported:', '["She said that she had finished the work.", "She said that she has finished the work.", "She said that I have finished the work.", "She says that she has finished the work."]', 0, 'Tense backshift: present perfect → past perfect. have finished → had finished. Pattern: said that + had + V3!', 'medium'),

('foundation', 'reported-speech', 'intermediate', 'Error in: "He told that he was tired."', '["Add: object (me/her/him) after told", "Remove: that", "Use: said instead of told", "Nothing wrong"]', 0, 'Tell needs object! Correct: "He told me that he was tired." OR "He said that he was tired." Pattern: tell + person + that!', 'medium'),

('foundation', 'reported-speech', 'intermediate', 'Direct: "I will come tomorrow," he said. Reported:', '["He said that he would come the next day.", "He said that he will come tomorrow.", "He said that I will come tomorrow.", "He says that he will come tomorrow."]', 0, 'Backshift: will → would. Time change: tomorrow → the next day. Pronoun: I → he. Pattern: would + base verb + time change!', 'medium'),

('foundation', 'reported-speech', 'intermediate', 'Convert: "I am reading a book," she said.', '["She said that she was reading a book.", "She said that I am reading a book.", "She said that she is reading a book.", "She says that she is reading a book."]', 0, 'Tense backshift: present continuous → past continuous. am reading → was reading. Pattern: said that + was/were + V-ing!', 'medium'),

('foundation', 'reported-speech', 'intermediate', 'Error: "She said me that she was happy."', '["Use: told instead of said", "Remove: me", "Both A and B correct", "Nothing wrong"]', 2, 'Two fixes: "She told me that..." (use told) OR "She said that..." (remove me). Can''t use "said + me". Pattern: say + that OR tell + person + that!', 'medium'),

('foundation', 'reported-speech', 'intermediate', 'Direct: "I can swim," he said. Reported:', '["He said that he could swim.", "He said that he can swim.", "He said that I can swim.", "He says that he can swim."]', 0, 'Modal backshift: can → could. Pronoun: I → he. Pattern: said that + could + base verb!', 'medium'),

('foundation', 'reported-speech', 'intermediate', 'Convert: "We have been waiting for hours," they said.', '["They said that they had been waiting for hours.", "They said that they have been waiting for hours.", "They said that we have been waiting for hours.", "They say that they have been waiting for hours."]', 0, 'Tense backshift: present perfect continuous → past perfect continuous. have been → had been. Pattern: had been + V-ing!', 'medium'),

('foundation', 'reported-speech', 'intermediate', 'Error in: "He told me that he will come."', '["Use: would instead of will", "Use: can", "Remove: that", "Nothing wrong"]', 0, 'Backshift needed! will → would. Correct: "He told me that he would come." Pattern: told + that + would (not will)!', 'medium'),

-- HARD (4 questions)
('foundation', 'reported-speech', 'intermediate', 'Direct: "I had finished before you arrived," she said. Reported:', '["She said that she had finished before I/we arrived.", "She said that she has finished before I arrived.", "She said that I had finished before you arrived.", "She said that she finished before I arrived."]', 0, 'Past perfect stays past perfect (no further backshift). Pronoun changes: I → she, you → I/we. Pattern: had + V3 (unchanged)!', 'hard'),

('foundation', 'reported-speech', 'intermediate', 'Error: "She told to me that she was busy."', '["Remove: to", "Use: said instead of told", "Remove: that", "Nothing wrong"]', 0, 'No "to" with tell! Correct: "She told me that..." Pattern: tell + person (no "to") + that. "say to" OK, "tell to" = wrong!', 'hard'),

('foundation', 'reported-speech', 'intermediate', 'Direct: "The earth revolves around the sun," he said. Reported:', '["He said that the earth revolves around the sun.", "He said that the earth revolved around the sun.", "Both A and B correct", "He says that the earth revolves around the sun."]', 0, 'Universal truth = no backshift! Keep present tense. "revolves" stays "revolves" (scientific fact). Pattern: universal truths keep original tense!', 'hard'),

('foundation', 'reported-speech', 'intermediate', 'Convert: "If I were you, I would quit," she said to me.', '["She told me that if she were me, she would quit.", "She said me that if she were me, she would quit.", "She told to me that if she were me, she would quit.", "She said that if I were you, I would quit."]', 0, 'Complex: told + me + that. Pronouns: I → she, you → me. would stays would. Pattern: told + object + that + conditional (with pronoun changes)!', 'hard'),

-- ============================================================================
-- SUBTOPIC 2: Questions (20 questions)
-- ============================================================================

-- EASY (8 questions)
('foundation', 'reported-speech', 'intermediate', 'Direct: "Where do you live?" he asked. Reported:', '["He asked where I lived.", "He asked where do you live.", "He asked where you live.", "He asked that where I live."]', 0, 'Reported question: asked + wh-word + statement order. do you live → I lived (backshift, no inversion). Pattern: asked + wh-word + subject + verb!', 'easy'),

('foundation', 'reported-speech', 'intermediate', 'In reported questions, word order is:', '["statement order (subject + verb)", "question order (verb + subject)", "inverted always", "unchanged"]', 0, 'Reported questions: statement order! "where I lived" (not "where did I live"). No inversion, no question mark. Pattern: subject + verb!', 'easy'),

('foundation', 'reported-speech', 'intermediate', 'Direct: "Are you happy?" she asked. Reported:', '["She asked if/whether I was happy.", "She asked are you happy.", "She asked that are you happy.", "She asked you are happy."]', 0, 'Yes/no question: asked + if/whether + statement order. are you → I was (backshift). Pattern: asked if/whether + subject + verb!', 'easy'),

('foundation', 'reported-speech', 'intermediate', 'Reported yes/no questions use:', '["if or whether", "that", "what or where", "when or why"]', 0, 'Yes/no questions → if/whether. "asked if/whether I was..." No wh-word in yes/no questions. Pattern: if/whether for yes/no!', 'easy'),

('foundation', 'reported-speech', 'intermediate', 'Direct: "What is your name?" he asked. Reported:', '["He asked what my name was.", "He asked what is your name.", "He asked that what your name is.", "He asked what your name is."]', 0, 'Reported wh-question: asked + what + statement order. is your → my...was (backshift, pronouns). Pattern: what + subject + verb!', 'easy'),

('foundation', 'reported-speech', 'intermediate', 'Reported questions end with:', '["period (.)", "question mark (?)", "exclamation mark (!)", "comma (,)"]', 0, 'Reported questions: period, not question mark! "He asked where I lived." = statement ABOUT a question. Pattern: statement = period!', 'easy'),

('foundation', 'reported-speech', 'intermediate', 'Direct: "Do you like tea?" she asked. Reported:', '["She asked if/whether I liked tea.", "She asked do you like tea.", "She asked that do I like tea.", "She asked if do you like tea."]', 0, 'Yes/no: asked + if/whether + statement order. do you like → I liked. Pattern: if/whether + subject + verb (no "do")!', 'easy'),

('foundation', 'reported-speech', 'intermediate', 'Direct: "When will you come?" he asked. Reported:', '["He asked when I would come.", "He asked when will you come.", "He asked that when you will come.", "He asked when you will come."]', 0, 'Wh-question: asked + when + statement order. will you → I would (backshift). Pattern: when + subject + would + verb!', 'easy'),

-- MEDIUM (8 questions)
('foundation', 'reported-speech', 'intermediate', 'Error in: "He asked that where I lived."', '["Remove: that", "Use: if", "Use: whether", "Nothing wrong"]', 0, 'No "that" with wh-questions! Correct: "He asked where I lived." Pattern: asked + wh-word (no "that")!', 'medium'),

('foundation', 'reported-speech', 'intermediate', 'Direct: "Have you finished the work?" she asked. Reported:', '["She asked if/whether I had finished the work.", "She asked have you finished the work.", "She asked if you have finished the work.", "She asked that have you finished."]', 0, 'Yes/no + backshift: have you → I had. Pattern: asked if/whether + subject + had + V3. Present perfect → past perfect!', 'medium'),

('foundation', 'reported-speech', 'intermediate', 'Convert: "Why are you late?" he asked me.', '["He asked me why I was late.", "He asked me why are you late.", "He asked me that why I am late.", "He asked me why you are late."]', 0, 'Wh-question + object: asked + me + why + statement order. are you → I was. Pattern: asked + person + wh-word + subject + verb!', 'medium'),

('foundation', 'reported-speech', 'intermediate', 'Error: "She asked if do I like coffee."', '["Remove: do", "Use: that", "Use: what", "Nothing wrong"]', 0, 'No "do" in reported questions! Correct: "She asked if I liked coffee." Statement order = no auxiliary "do". Pattern: if + subject + verb!', 'medium'),

('foundation', 'reported-speech', 'intermediate', 'Direct: "Can you help me?" he asked. Reported:', '["He asked if/whether I could help him.", "He asked can you help me.", "He asked if can you help me.", "He asked whether can I help him."]', 0, 'Yes/no + modal: can you → I could. Pronoun: me → him. Pattern: if/whether + subject + modal (backshifted)!', 'medium'),

('foundation', 'reported-speech', 'intermediate', 'Convert: "How old are you?" she asked.', '["She asked how old I was.", "She asked how old are you.", "She asked that how old I am.", "She asked how old you are."]', 0, 'Wh-question: asked + how + adjective + statement order. are you → I was. Pattern: how + adjective + subject + verb!', 'medium'),

('foundation', 'reported-speech', 'intermediate', 'Error: "He asked me where did I live."', '["Use: I lived (not did I live)", "Use: do I live", "Remove: me", "Nothing wrong"]', 0, 'Wrong word order! Statement order, not question. Correct: "where I lived" (not "where did I live"). No inversion in reported questions!', 'medium'),

('foundation', 'reported-speech', 'intermediate', 'Direct: "Will you be free tomorrow?" she asked. Reported:', '["She asked if/whether I would be free the next day.", "She asked will you be free tomorrow.", "She asked if will you be free tomorrow.", "She asked whether you will be free tomorrow."]', 0, 'Yes/no + time: will you → I would. tomorrow → the next day. Pattern: if/whether + subject + would + time change!', 'medium'),

-- HARD (4 questions)
('foundation', 'reported-speech', 'intermediate', 'Direct: "Where have you been?" he asked me. Reported:', '["He asked me where I had been.", "He asked me where have you been.", "He asked me where you have been.", "He asked me that where I had been."]', 0, 'Wh-question + perfect: have you been → I had been. Statement order. Pattern: asked + me + where + I + had been. Backshift!', 'hard'),

('foundation', 'reported-speech', 'intermediate', 'Error: "She asked whether that I was ready."', '["Remove: that", "Remove: whether", "Use: if that", "Nothing wrong"]', 0, 'No "that" with if/whether! Correct: "She asked whether I was ready." Pattern: whether + subject + verb (no "that")!', 'hard'),

('foundation', 'reported-speech', 'intermediate', 'Direct: "What time does the train leave?" he asked. Reported:', '["He asked what time the train left.", "He asked what time does the train leave.", "He asked that what time the train leaves.", "He asked what time the train leaves."]', 0, 'Wh-question + timetable: does...leave → left (backshift). Statement order. Pattern: what time + subject + verb (past). Note: timetables can keep present but past safer!', 'hard'),

('foundation', 'reported-speech', 'intermediate', 'Convert: "Did you see the accident?" the police asked me.', '["The police asked me if/whether I had seen the accident.", "The police asked me did you see the accident.", "The police asked me if did I see the accident.", "The police asked me if I saw the accident."]', 0, 'Past simple question → past perfect. did you see → I had seen (backshift for reporting past). Pattern: if/whether + subject + had + V3. Formal reporting!', 'hard'),

-- ============================================================================
-- SUBTOPIC 3: Commands (20 questions)
-- ============================================================================

-- EASY (8 questions)
('foundation', 'reported-speech', 'intermediate', 'Direct: "Close the door," she said. Reported:', '["She told/asked me to close the door.", "She said close the door.", "She said to close the door.", "She told that close the door."]', 0, 'Reported command: told/asked + object + to + infinitive. Pattern: told/asked + person + to + base verb!', 'easy'),

('foundation', 'reported-speech', 'intermediate', 'Reported commands use:', '["to + infinitive", "that + clause", "verb-ing form", "past participle"]', 0, 'Commands → to + infinitive. "told me to go", "asked her to wait". Pattern: to + base verb!', 'easy'),

('foundation', 'reported-speech', 'intermediate', 'Direct: "Please help me," he said. Reported:', '["He asked/requested me to help him.", "He said help me.", "He told that help me.", "He said to help him."]', 0, 'Polite command (please): asked/requested + object + to + infinitive. Pronoun: me → him. Pattern: asked/requested + person + to + verb!', 'easy'),

('foundation', 'reported-speech', 'intermediate', 'Direct: "Don''t be late," she said. Reported:', '["She told/asked me not to be late.", "She said don''t be late.", "She told me to not be late.", "She said to not be late."]', 0, 'Negative command: told/asked + object + not to + infinitive. Pattern: told/asked + person + not to + base verb!', 'easy'),

('foundation', 'reported-speech', 'intermediate', 'For polite requests, use:', '["asked or requested", "told or ordered", "said or spoke", "commanded or forced"]', 0, 'Polite commands: asked/requested (softer). "asked me to..." Strong commands: told/ordered. Pattern: polite = ask/request!', 'easy'),

('foundation', 'reported-speech', 'intermediate', 'Direct: "Sit down," the teacher said. Reported:', '["The teacher told/asked us to sit down.", "The teacher said sit down.", "The teacher said to sit down.", "The teacher told that sit down."]', 0, 'Command: told/asked + object + to + infinitive. Pattern: told/asked + students + to + sit down!', 'easy'),

('foundation', 'reported-speech', 'intermediate', 'Which verb reports strong commands?', '["told, ordered, commanded", "asked, requested", "said, spoke", "questioned, inquired"]', 0, 'Strong commands: told/ordered/commanded. "The officer ordered them to stop." Forceful, not polite. Pattern: order = strong!', 'easy'),

('foundation', 'reported-speech', 'intermediate', 'Direct: "Open your books," he said. Reported:', '["He told/asked us to open our books.", "He said open your books.", "He said to open our books.", "He told that open books."]', 0, 'Command: told/asked + object + to + infinitive. Pronoun: your → our. Pattern: told/asked + us + to + open!', 'easy'),

-- MEDIUM (8 questions)
('foundation', 'reported-speech', 'intermediate', 'Error in: "She told me that close the window."', '["Use: to close (not that close)", "Remove: that", "Use: closing", "Nothing wrong"]', 0, 'Command structure! Correct: "She told me to close the window." Pattern: told + person + to + infinitive (not "that + imperative")!', 'medium'),

('foundation', 'reported-speech', 'intermediate', 'Direct: "Please don''t smoke here," she said. Reported:', '["She requested/asked me not to smoke there.", "She said don''t smoke here.", "She told me to not smoke there.", "She said to not smoke here."]', 0, 'Polite negative: requested/asked + not to. Place: here → there. Pattern: asked + person + not to + verb + place change!', 'medium'),

('foundation', 'reported-speech', 'intermediate', 'Convert: "Be quiet!" the librarian said.', '["The librarian told/ordered us to be quiet.", "The librarian said be quiet.", "The librarian said to be quiet.", "The librarian told that be quiet."]', 0, 'Strong command (exclamation): told/ordered + to + infinitive. Pattern: told/ordered + us + to + be quiet!', 'medium'),

('foundation', 'reported-speech', 'intermediate', 'Error in: "He asked me to not go there."', '["Use: not to go (not to not go)", "Remove: not", "Use: to don''t go", "Nothing wrong"]', 0, 'Word order! Negative: not + to + infinitive. Correct: "asked me not to go there." Pattern: not to (together), not "to not"!', 'medium'),

('foundation', 'reported-speech', 'intermediate', 'Direct: "Let''s go to the park," she said. Reported:', '["She suggested going to the park.", "She told to go to the park.", "She said let''s go to the park.", "She asked to go to the park."]', 0, 'Suggestion (Let''s): suggested + verb-ing. Pattern: suggested + going (not "to go"). Let''s = suggestion, not command!', 'medium'),

('foundation', 'reported-speech', 'intermediate', 'Convert: "Don''t touch that wire!" he shouted.', '["He warned/ordered me not to touch that wire.", "He said don''t touch that wire.", "He told me to not touch that wire.", "He said to not touch that wire."]', 0, 'Warning + exclamation: warned/ordered + not to. Strong command = ordered/warned. Pattern: warned + person + not to + verb!', 'medium'),

('foundation', 'reported-speech', 'intermediate', 'Error: "She said me to complete the work."', '["Use: told instead of said", "Remove: me", "Use: that", "Nothing wrong"]', 0, 'Wrong verb! Commands: told/asked (not "said"). Correct: "She told me to complete..." Pattern: told/asked + person + to + verb!', 'medium'),

('foundation', 'reported-speech', 'intermediate', 'Direct: "Could you please pass the salt?" he said. Reported:', '["He requested/asked me to pass the salt.", "He told me to pass the salt.", "He said pass the salt.", "He said to pass the salt."]', 0, 'Polite request (could you please): requested/asked + to. Pattern: requested/asked + person + to + verb. Very polite = request!', 'medium'),

-- HARD (4 questions)
('foundation', 'reported-speech', 'intermediate', 'Direct: "Never do that again!" she said angrily. Reported:', '["She ordered/warned me never to do that again.", "She told me to never do that again.", "She said never do that again.", "She told me to not do that again."]', 0, 'Strong negative (never): ordered/warned + never to. Pattern: ordered + person + never to + verb. "never to" (together)!', 'hard'),

('foundation', 'reported-speech', 'intermediate', 'Error: "He suggested to go to the movie."', '["Use: going (not to go)", "Use: to going", "Remove: to", "Nothing wrong"]', 0, 'Suggest + verb-ing! Correct: "He suggested going to the movie." Pattern: suggest + V-ing (not "to + infinitive")!', 'hard'),

('foundation', 'reported-speech', 'intermediate', 'Direct: "You should see a doctor," she advised. Reported:', '["She advised me to see a doctor.", "She told me to see a doctor.", "She said to see a doctor.", "She suggested to see a doctor."]', 0, 'Advice: advised + to + infinitive. "advised me to..." Pattern: advise + person + to + verb. Advice = advise!', 'hard'),

('foundation', 'reported-speech', 'intermediate', 'Convert: "Let''s not waste time," he said.', '["He suggested not wasting time.", "He told not to waste time.", "He said let''s not waste time.", "He suggested to not waste time."]', 0, 'Negative suggestion: suggested + not + verb-ing. Pattern: suggested + not + V-ing. Let''s not = negative suggestion!', 'hard'),

-- ============================================================================
-- SUBTOPIC 4: Time/Place Changes (20 questions)
-- ============================================================================

-- EASY (8 questions)
('foundation', 'reported-speech', 'intermediate', 'Direct: "I will come tomorrow," he said. Tomorrow becomes:', '["the next day / the following day", "tomorrow", "yesterday", "the day before"]', 0, 'Time change: tomorrow → the next day / the following day (when reporting later). Pattern: future reference shifts forward!', 'easy'),

('foundation', 'reported-speech', 'intermediate', 'Direct: "I saw her yesterday," he said. Yesterday becomes:', '["the day before / the previous day", "yesterday", "tomorrow", "today"]', 0, 'Time change: yesterday → the day before / the previous day (when reporting later). Pattern: past reference shifts back!', 'easy'),

('foundation', 'reported-speech', 'intermediate', 'Direct: "I live here," she said. Here becomes:', '["there", "here", "this place", "that place"]', 0, 'Place change: here → there (different location when reporting). Pattern: near → far reference!', 'easy'),

('foundation', 'reported-speech', 'intermediate', 'Direct: "I am busy today," he said. Today becomes:', '["that day", "today", "this day", "the day"]', 0, 'Time change: today → that day (when reporting later). Pattern: present reference → that day!', 'easy'),

('foundation', 'reported-speech', 'intermediate', '"This book" in reported speech becomes:', '["that book", "this book", "the book", "a book"]', 0, 'Demonstrative change: this → that (distance increases when reporting). Pattern: near → far!', 'easy'),

('foundation', 'reported-speech', 'intermediate', 'Direct: "I will call you tonight," she said. Tonight becomes:', '["that night", "tonight", "this night", "the night"]', 0, 'Time change: tonight → that night (when reporting later). Pattern: specific time shifts!', 'easy'),

('foundation', 'reported-speech', 'intermediate', '"These books" in reported speech becomes:', '["those books", "these books", "the books", "some books"]', 0, 'Demonstrative change: these (plural) → those (when reporting). Pattern: near plural → far plural!', 'easy'),

('foundation', 'reported-speech', 'intermediate', 'Direct: "I was here last week," he said. Last week becomes:', '["the week before / the previous week", "last week", "this week", "next week"]', 0, 'Time change: last week → the week before / the previous week (when reporting later). Pattern: recent past shifts back!', 'easy'),

-- MEDIUM (8 questions)
('foundation', 'reported-speech', 'intermediate', 'Direct: "I will see you next Monday," she said on Friday. Next Monday becomes:', '["the following Monday", "next Monday", "that Monday", "this Monday"]', 0, 'Time change: next Monday → the following Monday (when reporting later). Pattern: future specific day shifts!', 'medium'),

('foundation', 'reported-speech', 'intermediate', 'Direct: "I bought this car two days ago," he said. Reported:', '["He said that he had bought that car two days before.", "He said that he bought this car two days ago.", "He said that he had bought this car two days ago.", "He said that he bought that car two days before."]', 0, 'Multiple changes: this → that, ago → before, bought → had bought. Pattern: demonstrative + time + tense all shift!', 'medium'),

('foundation', 'reported-speech', 'intermediate', '"Now" in reported speech becomes:', '["then / at that moment", "now", "at this moment", "presently"]', 0, 'Time change: now → then / at that moment (when reporting later). Pattern: present moment shifts to past moment!', 'medium'),

('foundation', 'reported-speech', 'intermediate', 'Direct: "I will finish it by next week," he said last month. Reported:', '["He said that he would finish it by the following week.", "He said that he will finish it by next week.", "He said that he would finish it by next week.", "He said that he will finish it by the following week."]', 0, 'Time + modal: will → would, next week → the following week. Pattern: modal + time both shift!', 'medium'),

('foundation', 'reported-speech', 'intermediate', '"Come here" in reported speech becomes:', '["told to go there", "told to come here", "told to go here", "told to come there"]', 0, 'Place + direction: come here → go there. "come" (toward speaker) → "go" (away from reporter). Pattern: direction reverses!', 'medium'),

('foundation', 'reported-speech', 'intermediate', 'Direct: "I saw her this morning," he said in the evening. This morning becomes:', '["that morning", "this morning", "the morning", "in the morning"]', 0, 'Time change (same day): this morning → that morning (later that day). Pattern: earlier today → that [time]!', 'medium'),

('foundation', 'reported-speech', 'intermediate', '"A week ago" in reported speech becomes:', '["a week before / a week earlier", "a week ago", "a week later", "the week"]', 0, 'Time change: ago → before / earlier (when reporting past). Pattern: "ago" changes to "before/earlier"!', 'medium'),

('foundation', 'reported-speech', 'intermediate', 'Direct: "These are my books," she said. Reported:', '["She said that those were her books.", "She said that these are my books.", "She said that these were my books.", "She said that those are her books."]', 0, 'Multiple changes: these → those, are → were, my → her. Pattern: demonstrative + tense + pronoun all shift!', 'medium'),

-- HARD (4 questions)
('foundation', 'reported-speech', 'intermediate', 'Direct: "I will be here from tomorrow," he said yesterday. Reported:', '["He said that he would be there from the next day.", "He said that he will be here from tomorrow.", "He said that he would be here from tomorrow.", "He said that he will be there from the next day."]', 0, 'Triple change: will → would, here → there, tomorrow → the next day. Pattern: modal + place + time all shift!', 'hard'),

('foundation', 'reported-speech', 'intermediate', 'No time change when:', '["reporting immediately / same context", "always change time", "never change time", "only in questions"]', 0, 'Exception: no change if reporting immediately in same context! "She says she is busy today." (today = still today). Pattern: same time frame = no change!', 'hard'),

('foundation', 'reported-speech', 'intermediate', 'Direct: "I came here three days ago," she said on Monday. Reported on Friday:', '["She said on Monday that she had come/gone there three days before that.", "She said that she came here three days ago.", "She said that she had come here three days before.", "She said that she came there three days ago."]', 0, 'Complex: came → had come, here → there, ago → before that. When reporting much later: "three days before that (Monday)". Pattern: past perfect + place + time shifts!', 'hard'),

('foundation', 'reported-speech', 'intermediate', 'Direct: "The meeting is tomorrow at 3 PM here," he said. Reported next week:', '["He said that the meeting was the next day at 3 PM there.", "He said that the meeting is tomorrow at 3 PM here.", "He said that the meeting was tomorrow at 3 PM there.", "He said that the meeting is the next day at 3 PM here."]', 0, 'Multiple: is → was, tomorrow → the next day (from his perspective, not ours!), here → there. Pattern: tense + time + place all shift relative to original speaker''s moment!', 'hard');

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

SELECT 'Reported Speech Question Count Check' as check_name;
SELECT COUNT(*) as total_questions FROM english_questions WHERE topic_id = 'reported-speech';

-- Expected output: 80 questions
-- Breakdown: 20 per subtopic × 4 subtopics = 80
