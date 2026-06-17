-- ============================================================================
-- FOUNDATION PATH: Present Continuous Tense (Consolidated)
-- Topic ID: present-continuous
-- Level: beginner (A1)
-- Total: 100 questions covering ALL 5 subtopics
-- ============================================================================
-- Subtopics covered:
--   1. am/is/are + V-ing (basic structure) - 20 questions
--   2. Adding -ing (spelling rules) - 20 questions
--   3. Negative & Questions - 20 questions
--   4. Stative Verbs (verbs that don't use continuous) - 20 questions
--   5. Simple vs Continuous (when to use each) - 20 questions
-- Distribution: 40 easy, 40 medium, 20 hard per 100 questions
-- ============================================================================

INSERT INTO english_questions (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty) VALUES

-- ============================================================================
-- SUBTOPIC 1: am/is/are + V-ing (basic structure) - 20 questions
-- ============================================================================

-- EASY (8 questions)
('foundation', 'present-continuous', 'beginner', 'I _____ working now.', '["am", "is", "are", "be"]', 0, 'am/is/are + V-ing: I + am + verb-ing. Use "am" with I. Present continuous shows action happening RIGHT NOW.', 'easy'),

('foundation', 'present-continuous', 'beginner', 'She _____ cooking dinner.', '["am", "is", "are", "be"]', 1, 'am/is/are + V-ing: He/She/It + is + verb-ing. Use "is" with she. Action in progress at this moment.', 'easy'),

('foundation', 'present-continuous', 'beginner', 'They _____ playing cricket.', '["am", "is", "are", "be"]', 2, 'am/is/are + V-ing: They/We/You + are + verb-ing. Use "are" with they. Action happening now.', 'easy'),

('foundation', 'present-continuous', 'beginner', 'He _____ reading a book.', '["am", "is", "are", "be"]', 1, 'am/is/are + V-ing: He + is + verb-ing. Use "is" with he. Present continuous = action in progress.', 'easy'),

('foundation', 'present-continuous', 'beginner', 'We _____ watching TV.', '["am", "is", "are", "be"]', 2, 'am/is/are + V-ing: We + are + verb-ing. Use "are" with we. Action happening at this moment.', 'easy'),

('foundation', 'present-continuous', 'beginner', 'It _____ raining outside.', '["am", "is", "are", "be"]', 1, 'am/is/are + V-ing: It + is + verb-ing. Use "is" with it. Weather verb in present continuous.', 'easy'),

('foundation', 'present-continuous', 'beginner', 'You _____ studying hard.', '["am", "is", "are", "be"]', 2, 'am/is/are + V-ing: You + are + verb-ing. Always "are" with you (never "am" or "is"). Action in progress.', 'easy'),

('foundation', 'present-continuous', 'beginner', 'My brother _____ sleeping.', '["am", "is", "are", "be"]', 1, 'am/is/are + V-ing: My brother = he + is + verb-ing. Singular noun uses "is". Action happening now.', 'easy'),

-- MEDIUM (8 questions)
('foundation', 'present-continuous', 'beginner', 'What is wrong? "She working on a project."', '["Add is before working", "Use works instead of working", "Use worked instead of working", "Nothing wrong"]', 0, 'am/is/are + V-ing: MUST have am/is/are. Correct: "She is working on a project." Never just "subject + verb-ing" alone.', 'medium'),

('foundation', 'present-continuous', 'beginner', 'Arrange correctly: now / is / He / tea / drinking', '["He is drinking tea now", "He is now drinking tea", "Now he is drinking tea", "He drinking is tea now"]', 0, 'am/is/are + V-ing: Subject + is/am/are + verb-ing + object + now. "Now" usually at end. Order: He is drinking tea now.', 'medium'),

('foundation', 'present-continuous', 'beginner', 'Choose the sentence about an action happening RIGHT NOW:', '["I work from home.", "I am working from home.", "I worked from home.", "I will work from home."]', 1, 'am/is/are + V-ing: Present continuous = happening NOW. "I am working" = right this moment. "I work" = general habit (not now).', 'medium'),

('foundation', 'present-continuous', 'beginner', 'What is the error? "They is watching a movie."', '["Use are instead of is", "Use watch instead of watching", "Use watched instead of watching", "Nothing wrong"]', 0, 'am/is/are + V-ing: They = are (not is). Correct: "They are watching a movie." I→am, He/She/It→is, You/We/They→are.', 'medium'),

('foundation', 'present-continuous', 'beginner', 'On a phone call, explaining what you''re doing:', '["I driving right now.", "I am drive right now.", "I am driving right now.", "I drives right now."]', 2, 'am/is/are + V-ing: Must have "am". Correct: "I am driving right now." Need both am + verb-ing. "Right now" = common time marker.', 'medium'),

('foundation', 'present-continuous', 'beginner', 'Rearrange: at / moment / the / studying / We / are', '["We are studying at the moment", "We are at the moment studying", "At the moment we are studying", "We studying are at the moment"]', 0, 'am/is/are + V-ing: Subject + are + verb-ing + at the moment. "At the moment" = phrase meaning "right now". Can start or end with it.', 'medium'),

('foundation', 'present-continuous', 'beginner', 'At work, your colleague asks "What are you doing?" You say:', '["I work on a report.", "I am work on a report.", "I am working on a report.", "I working on a report."]', 2, 'am/is/are + V-ing: Must have am + verb-ing. Correct: "I am working on a report." Answer matches question tense.', 'medium'),

('foundation', 'present-continuous', 'beginner', 'The children are _____ in the park.', '["play", "plays", "playing", "played"]', 2, 'am/is/are + V-ing: After are, use verb-ing. Play + ing = playing. Present continuous shows action in progress.', 'medium'),

-- HARD (4 questions)
('foundation', 'present-continuous', 'beginner', 'Which sentence is grammatically perfect for describing what you see NOW?', '["Look! The bus comes.", "Look! The bus is coming.", "Look! The bus come.", "Look! The bus coming."]', 1, 'am/is/are + V-ing: "Look!" signals something happening RIGHT NOW. Must have is + verb-ing. Correct: "The bus is coming." Need "is".', 'hard'),

('foundation', 'present-continuous', 'beginner', 'Which is correct for a TEMPORARY situation (this month only)?', '["I work from home.", "I am working from home.", "I worked from home.", "I will work from home."]', 1, 'am/is/are + V-ing: Temporary situations use present continuous. "I am working from home" = temporary (this week/month). "I work" = permanent habit.', 'hard'),

('foundation', 'present-continuous', 'beginner', 'Arrange correctly: days / staying / these / here / I / am', '["I am staying here these days", "I am these days staying here", "These days I am staying here", "I staying am here these days"]', 0, 'am/is/are + V-ing: Subject + am + verb-ing + place + time. "These days" = temporary time expression. Can start or end with time.', 'hard'),

('foundation', 'present-continuous', 'beginner', 'Rearrange: listening / I / am / to / music', '["I am listening to music", "I am to listening music", "I listening am to music", "Am I listening to music"]', 0, 'am/is/are + V-ing: Subject + am + verb-ing + to + object. Phrasal verb "listen to" stays together. Statement word order (not question).', 'hard'),

-- ============================================================================
-- SUBTOPIC 2: ADDING -ing (spelling rules) - 20 questions
-- ============================================================================

-- EASY (8 questions)
('foundation', 'present-continuous', 'beginner', 'She is _____ her homework. (do + ing)', '["do", "does", "doing", "did"]', 2, 'Adding -ing: Most verbs just add -ing. Do + ing = doing. Present continuous needs verb-ing form.', 'easy'),

('foundation', 'present-continuous', 'beginner', 'They are _____ coffee. (drink + ing)', '["drink", "drinks", "drinking", "drank"]', 2, 'Adding -ing: Regular rule: base verb + ing. Drink + ing = drinking. No spelling changes needed.', 'easy'),

('foundation', 'present-continuous', 'beginner', 'He is _____ a book. (read + ing)', '["read", "reads", "reading", "readed"]', 2, 'Adding -ing: Just add -ing. Read + ing = reading. Present continuous = action in progress.', 'easy'),

('foundation', 'present-continuous', 'beginner', 'I am _____ to music. (listen + ing)', '["listen", "listens", "listening", "listened"]', 2, 'Adding -ing: Regular: base + ing. Listen + ing = listening. No changes to base verb.', 'easy'),

('foundation', 'present-continuous', 'beginner', 'We are _____ TV. (watch + ing)', '["watch", "watches", "watching", "watched"]', 2, 'Adding -ing: Just add -ing. Watch + ing = watching. Present continuous for current activity.', 'easy'),

('foundation', 'present-continuous', 'beginner', 'She is _____ her keys. (look + ing)', '["look", "looks", "looking", "looked"]', 2, 'Adding -ing: Regular: base + ing. Look + ing = looking. Searching for her keys right now.', 'easy'),

('foundation', 'present-continuous', 'beginner', 'They are _____ in the park. (walk + ing)', '["walk", "walks", "walking", "walked"]', 2, 'Adding -ing: Just add -ing. Walk + ing = walking. Action happening in the park now.', 'easy'),

('foundation', 'present-continuous', 'beginner', 'You are _____ fast. (learn + ing)', '["learn", "learns", "learning", "learned"]', 2, 'Adding -ing: Base + ing. Learn + ing = learning. Making progress right now.', 'easy'),

-- MEDIUM (8 questions)
('foundation', 'present-continuous', 'beginner', 'I am _____ an email. (Spelling: drop silent e)', '["writeing", "writing", "writting", "writes"]', 1, 'Adding -ing: Silent e rule: drop e + add ing. Write → drop e → writ + ing = writing. Also: make→making, take→taking, come→coming.', 'medium'),

('foundation', 'present-continuous', 'beginner', 'She is _____ for the bus. (Spelling: double consonant)', '["runing", "running", "runs", "runned"]', 1, 'Adding -ing: Short vowel + one consonant → double it + ing. Run → runn + ing = running. Also: swim→swimming, sit→sitting, stop→stopping.', 'medium'),

('foundation', 'present-continuous', 'beginner', 'Choose the correct spelling:', '["He is siting on the chair.", "He is sitting on the chair.", "He is sitted on the chair.", "He is sits on the chair."]', 1, 'Adding -ing: Short vowel (i) + one consonant (t) → double. Sit → sitt + ing = sitting. Doubling rule for CVC pattern.', 'medium'),

('foundation', 'present-continuous', 'beginner', 'What is wrong? "She is haveing lunch."', '["Spell it as having (drop e)", "Use has instead of having", "Use had instead of having", "Nothing wrong"]', 0, 'Adding -ing: Silent e rule: drop e before -ing. Have → drop e → hav + ing = having (not "haveing"). Always drop silent e.', 'medium'),

('foundation', 'present-continuous', 'beginner', 'They are _____ a new house. (Spelling: make + ing)', '["makeing", "making", "makes", "maked"]', 1, 'Adding -ing: Silent e rule. Make → drop e → mak + ing = making (not "makeing"). Drop the silent e first.', 'medium'),

('foundation', 'present-continuous', 'beginner', 'He is _____ his car. (Spelling: drive + ing)', '["driveing", "driving", "drives", "drived"]', 1, 'Adding -ing: Silent e rule. Drive → drop e → driv + ing = driving (not "driveing"). E is silent, so drop it.', 'medium'),

('foundation', 'present-continuous', 'beginner', 'We are _____ our vacation. (Spelling: plan + ing)', '["planing", "planning", "plans", "planed"]', 1, 'Adding -ing: Short vowel + one consonant → double. Plan → plann + ing = planning (not "planing"). CVC doubling rule.', 'medium'),

('foundation', 'present-continuous', 'beginner', 'She is _____ the door. (Spelling: close + ing)', '["closeing", "closing", "closes", "closed"]', 1, 'Adding -ing: Silent e rule. Close → drop e → clos + ing = closing (not "closeing"). Drop e before -ing.', 'medium'),

-- HARD (4 questions)
('foundation', 'present-continuous', 'beginner', 'Which spelling is correct?', '["He is swimming in the pool.", "He is swiming in the pool.", "He is swumming in the pool.", "He is swims in the pool."]', 0, 'Adding -ing: Short vowel (i) + one consonant (m) → double. Swim → swimm + ing = swimming. Must double the m.', 'hard'),

('foundation', 'present-continuous', 'beginner', 'Choose the correct form:', '["They are begining the meeting.", "They are beginning the meeting.", "They are beginining the meeting.", "They are begins the meeting."]', 1, 'Adding -ing: Begin → double the n. Begin → beginn + ing = beginning (not "begining"). Short vowel + consonant = double.', 'hard'),

('foundation', 'present-continuous', 'beginner', 'What is the correct spelling?', '["She is dieing her hair.", "She is dying her hair.", "She is dyeing her hair.", "She is dies her hair."]', 2, 'Adding -ing: Tricky! "Dye" (color) → dyeing (keep the e to distinguish from "dying" = death). Exception: keep e to avoid confusion.', 'hard'),

('foundation', 'present-continuous', 'beginner', 'Which is spelled correctly?', '["We are traveling to Goa.", "We are travelling to Goa.", "We are travelin to Goa.", "Both A and B are correct"]', 3, 'Adding -ing: British spelling doubles L (travelling), American doesn''t (traveling). Both correct! In India, British spelling is more common.', 'hard'),

-- ============================================================================
-- SUBTOPIC 3: NEGATIVE & QUESTIONS - 20 questions
-- ============================================================================

-- EASY (8 questions)
('foundation', 'present-continuous', 'beginner', 'I _____ not working today.', '["am", "is", "are", "be"]', 0, 'Negative: I + am + not + verb-ing. Use "am not" with I. Negative present continuous = not happening now.', 'easy'),

('foundation', 'present-continuous', 'beginner', 'She _____ not coming to the party.', '["am", "is", "are", "be"]', 1, 'Negative: She + is + not + verb-ing. Use "is not" (or "isn''t") with she. Not happening/not planning to come.', 'easy'),

('foundation', 'present-continuous', 'beginner', 'They _____ not listening.', '["am", "is", "are", "be"]', 2, 'Negative: They + are + not + verb-ing. Use "are not" (or "aren''t") with they. Not paying attention right now.', 'easy'),

('foundation', 'present-continuous', 'beginner', '_____ you working now?', '["Am", "Is", "Are", "Be"]', 2, 'Questions: Are + you + verb-ing? Use "Are" with you. Asking about current activity.', 'easy'),

('foundation', 'present-continuous', 'beginner', '_____ she studying?', '["Am", "Is", "Are", "Be"]', 1, 'Questions: Is + she/he/it + verb-ing? Use "Is" with she. Asking if action is happening now.', 'easy'),

('foundation', 'present-continuous', 'beginner', 'He _____ not eating right now.', '["am", "is", "are", "be"]', 1, 'Negative: He + is + not + verb-ing. Use "is not" with he. Not eating at this moment.', 'easy'),

('foundation', 'present-continuous', 'beginner', '_____ they playing cricket?', '["Am", "Is", "Are", "Be"]', 2, 'Questions: Are + they + verb-ing? Use "Are" with they. Asking if action is in progress.', 'easy'),

('foundation', 'present-continuous', 'beginner', 'It _____ not raining anymore.', '["am", "is", "are", "be"]', 1, 'Negative: It + is + not + verb-ing. Use "is not" with it. Rain has stopped.', 'easy'),

-- MEDIUM (8 questions)
('foundation', 'present-continuous', 'beginner', 'What is the short form of "I am not"?', '["I amn''t", "I''m not", "I''mn''t", "I not"]', 1, 'Negative: "I am not" → "I''m not" (only form). No "amn''t" in English. Other contractions: isn''t, aren''t.', 'medium'),

('foundation', 'present-continuous', 'beginner', 'What is wrong? "She not is coming today."', '["Say She is not coming", "Say She isn''t not coming", "Say She are not coming", "Nothing wrong"]', 0, 'Negative: Word order! Pattern: She + is + NOT. "Not" comes AFTER is/am/are. Correct: "She is not coming today."', 'medium'),

('foundation', 'present-continuous', 'beginner', 'Arrange correctly: now / not / He / working / is', '["He is not working now", "He not is working now", "Not he is working now", "He working is not now"]', 0, 'Negative: Subject + is + not + verb-ing + now. Order: He is not working now. "Not" after "is".', 'medium'),

('foundation', 'present-continuous', 'beginner', 'Arrange correctly: doing / are / you / What', '["What are you doing", "What you are doing", "Are you what doing", "What doing are you"]', 0, 'Questions: Wh-word + are + you + verb-ing? Order: What + are + you + doing. Common question about current activity.', 'medium'),

('foundation', 'present-continuous', 'beginner', 'What is the error? "We isn''t coming to the meeting."', '["Use aren''t instead of isn''t", "Use am not instead of isn''t", "Use not is instead of isn''t", "Nothing wrong"]', 0, 'Negative: We = are (not is). Correct: "We aren''t coming" or "We are not coming." Only he/she/it use "isn''t".', 'medium'),

('foundation', 'present-continuous', 'beginner', 'Choose the correct contraction:', '["They''re not listening.", "They''ren''t listening.", "They not''re listening.", "They not listening."]', 0, 'Negative: "They are not" → "They''re not" OR "They aren''t" (both correct). Never "they''ren''t".', 'medium'),

('foundation', 'present-continuous', 'beginner', 'Rearrange: Where / you / are / going', '["Where are you going", "Where you are going", "Are you where going", "Where going are you"]', 0, 'Questions: Wh-word + are + subject + verb-ing? Order: Where + are + you + going. Asking about destination.', 'medium'),

('foundation', 'present-continuous', 'beginner', 'What is wrong? "Is they watching TV?"', '["Use Are instead of Is", "Use Am instead of Is", "Use Be instead of Is", "Nothing wrong"]', 0, 'Questions: They = Are (not Is). Correct: "Are they watching TV?" Only he/she/it use Is.', 'medium'),

-- HARD (4 questions)
('foundation', 'present-continuous', 'beginner', 'Which is the correct NEGATIVE question?', '["Aren''t you coming?", "Don''t you coming?", "Not you are coming?", "You not are coming?"]', 0, 'Negative Questions: Aren''t/Isn''t + subject + verb-ing? Contraction at start. "Aren''t you coming?" = surprise you''re not coming. NOT "Don''t you coming".', 'hard'),

('foundation', 'present-continuous', 'beginner', 'Find the error: "Why you are not studying?"', '["Say Why are you not studying", "Say Why you not studying", "Say Why are not you studying", "No error"]', 0, 'Questions: Word order! Pattern: Why + are + you + not + verb-ing? "Are" comes BEFORE "you" in questions. Correct: "Why are you not studying?"', 'hard'),

('foundation', 'present-continuous', 'beginner', 'Arrange correctly (negative question): still / working / Isn''t / he / there', '["Isn''t he still working there", "He isn''t still working there", "Isn''t still he working there", "Still isn''t he working there"]', 0, 'Negative Questions: Isn''t + subject + adverb + verb-ing + place? Order: Isn''t + he + still + working + there. Shows surprise/expectation.', 'hard'),

('foundation', 'present-continuous', 'beginner', 'Which is correct in formal business email?', '["We''re not attending the meeting.", "We are not attending the meeting.", "We aren''t attending the meeting.", "We not attending the meeting."]', 1, 'Negative: In formal writing, avoid contractions. Use "are not" (not "aren''t" or "''re not"). Full forms = more professional.', 'hard'),

-- ============================================================================
-- SUBTOPIC 4: STATIVE VERBS (verbs that don't use continuous) - 20 questions
-- ============================================================================

-- EASY (8 questions)
('foundation', 'present-continuous', 'beginner', 'I _____ the answer. (know - mental state)', '["am knowing", "know", "knowing", "knows"]', 1, 'Stative Verbs: "Know" = state (not action), never use continuous. Say: "I know" (not "am knowing"). Mental states use simple, not continuous.', 'easy'),

('foundation', 'present-continuous', 'beginner', 'She _____ chocolate. (like - preference)', '["is liking", "likes", "liking", "like"]', 1, 'Stative Verbs: "Like" = preference (state), not action. Say: "She likes" (not "is liking"). Preferences don''t use continuous.', 'easy'),

('foundation', 'present-continuous', 'beginner', 'We _____ you. (love - emotion)', '["are loving", "love", "loving", "loves"]', 1, 'Stative Verbs: "Love" = emotion (state), not action. Say: "We love you" (not "are loving"). Emotions use simple form.', 'easy'),

('foundation', 'present-continuous', 'beginner', 'They _____ a car. (have - possession)', '["are having", "have", "having", "has"]', 1, 'Stative Verbs: "Have" for possession = state. Say: "They have" (not "are having"). BUT "having lunch" = OK (action, not possession).', 'easy'),

('foundation', 'present-continuous', 'beginner', 'I _____ coffee. (want - desire)', '["am wanting", "want", "wanting", "wants"]', 1, 'Stative Verbs: "Want" = desire (state), not action. Say: "I want" (not "am wanting"). Desires don''t use continuous.', 'easy'),

('foundation', 'present-continuous', 'beginner', 'He _____ my name. (remember - mental)', '["is remembering", "remembers", "remembering", "remember"]', 1, 'Stative Verbs: "Remember" = mental state. Say: "He remembers" (not "is remembering"). Memory verbs use simple form.', 'easy'),

('foundation', 'present-continuous', 'beginner', 'She _____ your help. (need - necessity)', '["is needing", "needs", "needing", "need"]', 1, 'Stative Verbs: "Need" = necessity (state). Say: "She needs" (not "is needing"). Needs/necessities use simple form.', 'easy'),

('foundation', 'present-continuous', 'beginner', 'It _____ good. (smell - sense)', '["is smelling", "smells", "smelling", "smell"]', 1, 'Stative Verbs: "Smell" as sense = state. Say: "It smells good" (not "is smelling"). BUT "I am smelling the flowers" = action (OK).', 'easy'),

-- MEDIUM (8 questions)
('foundation', 'present-continuous', 'beginner', 'What is wrong? "I am knowing the answer."', '["Use know instead (no continuous)", "Use knows instead", "Use knew instead", "Nothing wrong"]', 0, 'Stative Verbs: "Know" never uses continuous. Correct: "I know the answer." Mental states (know, understand, believe) = always simple.', 'medium'),

('foundation', 'present-continuous', 'beginner', 'Find the error: "She is having a car."', '["Use has (have = possession, no continuous)", "Use have instead of having", "Use had instead of having", "No error"]', 0, 'Stative Verbs: "Have" for possession never continuous. Correct: "She has a car." BUT "She is having lunch" = OK (having = eating = action).', 'medium'),

('foundation', 'present-continuous', 'beginner', 'Which is correct?', '["I am understanding English grammar.", "I understand English grammar.", "I understanding English grammar.", "I understands English grammar."]', 1, 'Stative Verbs: "Understand" = mental state, no continuous. Correct: "I understand English grammar." Never "am understanding".', 'medium'),

('foundation', 'present-continuous', 'beginner', 'What is wrong? "They are wanting more money."', '["Use want (no continuous with want)", "Use wants instead of wanting", "Use wanted instead of wanting", "Nothing wrong"]', 0, 'Stative Verbs: "Want" = desire, no continuous. Correct: "They want more money." Desires (want, need, prefer) never use -ing.', 'medium'),

('foundation', 'present-continuous', 'beginner', 'Choose the correct sentence:', '["She is believing in god.", "She believes in god.", "She believing in god.", "She believe in god."]', 1, 'Stative Verbs: "Believe" = opinion/faith, no continuous. Correct: "She believes in god." Beliefs use simple form.', 'medium'),

('foundation', 'present-continuous', 'beginner', 'What is the error? "This bag is belonging to me."', '["Use belongs (no continuous)", "Use belong instead of belonging", "Use belonged instead of belonging", "Nothing wrong"]', 0, 'Stative Verbs: "Belong" = possession/ownership, no continuous. Correct: "This bag belongs to me." Ownership = state.', 'medium'),

('foundation', 'present-continuous', 'beginner', 'Which is natural when refusing an offer?', '["I am not wanting coffee.", "I don''t want coffee.", "I not want coffee.", "I doesn''t want coffee."]', 1, 'Stative Verbs: "Want" negative uses "don''t want" (not "am not wanting"). Simple form for desires. Natural refusal: "I don''t want coffee."', 'medium'),

('foundation', 'present-continuous', 'beginner', 'Find the error: "She is seeming tired today."', '["Use seems (no continuous)", "Use seem instead of seeming", "Use seemed instead of seeming", "Nothing wrong"]', 0, 'Stative Verbs: "Seem" = appearance/state, no continuous. Correct: "She seems tired today." Linking verbs use simple form.', 'medium'),

-- HARD (4 questions)
('foundation', 'present-continuous', 'beginner', 'Which sentence is correct?', '["I am thinking about the problem. (considering)", "I am thinking you are right. (opinion)", "Both are correct", "Neither is correct"]', 0, 'Stative Verbs: Tricky! "Think" has 2 meanings: 1) "Thinking about" = action (OK for continuous). 2) "Think that" = opinion (use simple). A is correct!', 'hard'),

('foundation', 'present-continuous', 'beginner', 'Choose the correct usage:', '["This food is tasting good. (trying it now)", "This food tastes good. (describing flavor)", "Both are correct", "Neither is correct"]', 1, 'Stative Verbs: "Taste" has 2 uses: 1) Action "tasting" = trying (OK continuous). 2) State "tastes" = flavor quality (use simple). B describes quality = use simple.', 'hard'),

('foundation', 'present-continuous', 'beginner', 'Which is grammatically perfect?', '["I am seeing what you mean. (understanding)", "I see what you mean. (understanding)", "I am seeing the doctor. (meeting)", "Both B and C are correct"]', 3, 'Stative Verbs: "See" meanings: 1) "See" = understand (stative, use simple). 2) "Seeing" = meeting (action, use continuous). B and C are both correct!', 'hard'),

('foundation', 'present-continuous', 'beginner', 'Find the correct sentence:', '["He is having a problem with his car. (experiencing)", "He has a problem with his car. (possesses)", "Both mean the same", "Neither is correct"]', 2, 'Stative Verbs: "Have" meanings: 1) "Have" = own (stative). 2) "Having" = experiencing problems (OK). Both A and B correct, mean same! "Having" issues = common expression.', 'hard'),

-- ============================================================================
-- SUBTOPIC 5: SIMPLE VS CONTINUOUS (when to use each) - 20 questions
-- ============================================================================

-- EASY (8 questions)
('foundation', 'present-continuous', 'beginner', 'Which shows a habit? A) I work in a bank. B) I am working in a bank.', '["A (Simple = habit)", "B (Continuous = habit)", "Both show habits", "Neither shows habit"]', 0, 'Simple vs Continuous: Present simple = permanent/habits. Present continuous = temporary. A = "I work" = permanent job. B = temporary arrangement.', 'easy'),

('foundation', 'present-continuous', 'beginner', 'Which shows an action happening NOW? A) She eats lunch. B) She is eating lunch.', '["A (Simple = now)", "B (Continuous = now)", "Both mean now", "Neither means now"]', 1, 'Simple vs Continuous: Present continuous = right now. Present simple = general habit. B = "is eating" = happening at this moment.', 'easy'),

('foundation', 'present-continuous', 'beginner', 'I _____ breakfast at 8 AM every day. (regular habit)', '["eat", "am eating", "ate", "will eat"]', 0, 'Simple vs Continuous: Habits/routines = present simple. Use "eat" (not "am eating"). "Every day" = routine signal.', 'easy'),

('foundation', 'present-continuous', 'beginner', 'She _____ on the phone right now. (happening at this moment)', '["talks", "is talking", "talked", "will talk"]', 1, 'Simple vs Continuous: Actions in progress = present continuous. Use "is talking". "Right now" = continuous signal.', 'easy'),

('foundation', 'present-continuous', 'beginner', 'The sun _____ in the east. (permanent fact)', '["rises", "is rising", "rose", "will rise"]', 0, 'Simple vs Continuous: Universal truths/facts = present simple. Use "rises" (not "is rising"). Permanent facts always use simple.', 'easy'),

('foundation', 'present-continuous', 'beginner', 'Look! It _____ outside. (happening now)', '["rains", "is raining", "rained", "will rain"]', 1, 'Simple vs Continuous: "Look!" = something happening NOW. Use present continuous "is raining". Visual cue words signal continuous.', 'easy'),

('foundation', 'present-continuous', 'beginner', 'Water _____ at 100°C. (scientific fact)', '["boils", "is boiling", "boiled", "will boil"]', 0, 'Simple vs Continuous: Scientific facts = present simple. Use "boils" (not "is boiling"). Permanent scientific truths use simple.', 'easy'),

('foundation', 'present-continuous', 'beginner', 'Shh! The baby _____. (happening now)', '["sleeps", "is sleeping", "slept", "will sleep"]', 1, 'Simple vs Continuous: "Shh!" = action happening NOW. Use "is sleeping". Present continuous for current moment.', 'easy'),

-- MEDIUM (8 questions)
('foundation', 'present-continuous', 'beginner', 'I live in Mumbai. vs I am living in Mumbai. What''s the difference?', '["First = permanent, Second = temporary", "First = temporary, Second = permanent", "Both mean the same", "First is wrong"]', 0, 'Simple vs Continuous: "I live" = permanent home. "I am living" = staying temporarily. Simple = permanent, Continuous = temporary.', 'medium'),

('foundation', 'present-continuous', 'beginner', 'This month, I _____ from home. (temporary arrangement)', '["work", "am working", "worked", "will work"]', 1, 'Simple vs Continuous: Temporary situations = continuous. "This month" = limited time = use "am working". Temporary period signals continuous.', 'medium'),

('foundation', 'present-continuous', 'beginner', 'Choose the sentence for a permanent job:', '["I work as a teacher.", "I am working as a teacher.", "Both mean permanent", "Neither is correct"]', 0, 'Simple vs Continuous: Permanent jobs = simple. "I work as a teacher" = career. "I am working" = temporary position/filling in.', 'medium'),

('foundation', 'present-continuous', 'beginner', 'He usually _____ tea, but today he _____ coffee.', '["drinks / is drinking", "is drinking / drinks", "drinks / drinks", "is drinking / is drinking"]', 0, 'Simple vs Continuous: Habit = simple (drinks). Unusual today = continuous (is drinking). Mix both: "usually drinks, but today is drinking".', 'medium'),

('foundation', 'present-continuous', 'beginner', 'My train _____ at 10 PM. (fixed schedule)', '["leaves", "is leaving", "left", "will leave"]', 0, 'Simple vs Continuous: Timetables/schedules = simple. Use "leaves" (not "is leaving"). Train schedules are permanent, use simple.', 'medium'),

('foundation', 'present-continuous', 'beginner', 'I _____ harder these days. (current period)', '["work", "am working", "worked", "will work"]', 1, 'Simple vs Continuous: "These days" = current temporary period. Use "am working" (continuous). Temporary intensification of effort.', 'medium'),

('foundation', 'present-continuous', 'beginner', 'What''s wrong? "I am understanding English now."', '["Use understand (stative verb)", "Use understands", "Use understood", "Nothing wrong"]', 0, 'Simple vs Continuous: Even though "now" = continuous signal, "understand" = stative verb (never continuous). Correct: "I understand English now."', 'medium'),

('foundation', 'present-continuous', 'beginner', 'She always _____ late. (repeated annoying habit)', '["comes", "is coming", "came", "will come"]', 0, 'Simple vs Continuous: "Always" with annoying habits = actually use simple! "She always comes late." Frequency adverbs = simple tense.', 'medium'),

-- HARD (4 questions)
('foundation', 'present-continuous', 'beginner', 'Which is correct? "She is being rude." vs "She is rude."', '["First = temporary behavior, Second = permanent character", "First = permanent, Second = temporary", "Both mean the same", "First is wrong"]', 0, 'Simple vs Continuous: "She is being rude" = behaving rudely NOW (temporary). "She is rude" = permanent character. Continuous with "be" = temporary behavior!', 'hard'),

('foundation', 'present-continuous', 'beginner', 'The river _____ through the city. (geographical fact)', '["flows", "is flowing", "flowed", "will flow"]', 0, 'Simple vs Continuous: Geographical facts = simple. Use "flows" (not "is flowing"). Permanent geographical features use simple tense.', 'hard'),

('foundation', 'present-continuous', 'beginner', 'I _____ what you mean. (understanding right now)', '["see", "am seeing", "saw", "will see"]', 0, 'Simple vs Continuous: Even with "right now", "see" = understand (stative). Use simple "I see what you mean." Stative verbs trump time signals.', 'hard'),

('foundation', 'present-continuous', 'beginner', 'Arrange: getting / these / days / colder / It / is', '["It is getting colder these days", "It gets colder these days", "These days it is getting colder", "It getting is colder these days"]', 0, 'Simple vs Continuous: Change in progress = continuous. "Getting colder" = gradual change happening. "These days" = current period = continuous.', 'hard');

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

SELECT 'Present Continuous Question Count Check' as check_name;
SELECT COUNT(*) as total_questions FROM english_questions WHERE topic_id = 'present-continuous';

-- Expected output: 100 questions
-- Breakdown: 20 per subtopic × 5 subtopics = 100
