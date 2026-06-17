-- ============================================================================
-- FOUNDATION PATH: Subject-Verb Agreement (COMPLETE)
-- Topic ID: subject-verb-agreement
-- Level: intermediate (A2)
-- Total: 160 questions covering ALL 8 subtopics
-- ============================================================================
-- Subtopics covered:
--   1. Singular vs Plural Subjects - 20 questions
--   2. Compound Subjects (and/or) - 20 questions
--   3. Indefinite Pronouns - 20 questions
--   4. Collective Nouns - 20 questions
--   5. Inverted Sentences - 20 questions
--   6. Phrases Between Subject-Verb - 20 questions
--   7. There is/are, Here is/are - 20 questions
--   8. Special Cases (each, every, etc.) - 20 questions
-- Distribution: 64 easy, 64 medium, 32 hard (40/40/20)
-- ============================================================================

INSERT INTO english_questions (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty) VALUES

-- ============================================================================
-- SUBTOPIC 1: Singular vs Plural Subjects (20 questions)
-- ============================================================================

-- EASY (8 questions)
('foundation', 'subject-verb-agreement', 'intermediate', '"She _____ to school every day."', '["go", "goes", "going", "gone"]', 1, 'Singular subject (She) = singular verb + -s. Pattern: He/She/It + verb-s. goes = correct (3rd person singular).', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"They _____ cricket on weekends."', '["plays", "play", "playing", "played"]', 1, 'Plural subject (They) = base verb (no -s). Pattern: I/You/We/They + base verb. play = correct (plural).', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"He _____ his homework daily."', '["do", "does", "doing", "done"]', 1, 'Singular subject (He) = does (not do). Pattern: He/She/It + does. Singular needs -es.', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"The students _____ in the classroom."', '["is", "are", "am", "be"]', 1, 'Plural subject (students) = are (not is). Pattern: plural noun + are. Singular = is.', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"The cat _____ milk."', '["drink", "drinks", "drinking", "drank"]', 1, 'Singular subject (cat) = drinks (add -s). Pattern: singular noun + verb-s. 3rd person singular rule.', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"I _____ books every day."', '["reads", "read", "reading", "readed"]', 1, 'Subject "I" = base verb (no -s). Pattern: I/You + base verb. Only He/She/It add -s.', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"My brother _____ in Delhi."', '["live", "lives", "living", "lived"]', 1, 'Singular subject (brother) = lives (add -s). Pattern: singular noun + verb-s. 3rd person singular.', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Rule: Singular subjects use:', '["verb + -s/-es", "base verb", "verb + -ing", "verb + -ed"]', 0, 'Singular subjects (He/She/It/singular noun) = verb + -s/-es. Plural subjects = base verb (no -s).', 'easy'),

-- MEDIUM (8 questions)
('foundation', 'subject-verb-agreement', 'intermediate', 'What is wrong? "She go to school daily."', '["Use: goes instead of go", "Use: going instead of go", "Use: went instead of go", "Nothing wrong"]', 0, 'Singular subject (She) needs -s. Correct: "She goes to school." Pattern: She/He/It + verb-s.', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Choose correct: "The children _____ in the park."', '["plays", "play", "playing", "is playing"]', 1, 'Plural subject (children) = base verb. Correct: "The children play" (no -s). Pattern: plural + base verb.', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Error in: "My friends goes to the gym."', '["Use: go instead of goes", "Use: going instead of goes", "Use: is going instead of goes", "Nothing wrong"]', 0, 'Plural subject (friends) = base verb (no -s). Correct: "My friends go." Pattern: plural noun + base verb.', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Arrange: every / He / watches / TV / evening', '["He watches TV every evening", "He watch TV every evening", "He watching TV every evening", "He is watch TV every evening"]', 0, 'Singular subject (He) = watches (add -es). Pattern: He + verb-es. Correct: "He watches TV."', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Which is correct?', '["She study hard", "She studies hard", "She studying hard", "She is study hard"]', 1, 'Singular subject + simple present = verb-es. Correct: "She studies hard." y → ies rule applies!', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'What is the error? "The dog bark loudly."', '["Use: barks instead of bark", "Use: barking instead of bark", "Use: is bark instead of bark", "Nothing wrong"]', 0, 'Singular subject (dog) needs -s. Correct: "The dog barks." Pattern: singular noun + verb-s.', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Rearrange: plays / My / piano / sister / the', '["My sister plays the piano", "My sister play the piano", "My sisters plays the piano", "My sister playing the piano"]', 0, 'Singular subject (sister) = plays (add -s). Pattern: singular + verb-s. Correct: "My sister plays."', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Choose: "You _____ very smart."', '["is", "are", "am", "be"]', 1, 'Subject "You" = are (always, singular or plural). Pattern: You + are. Never "you is" or "you am."', 'medium'),

-- HARD (4 questions)
('foundation', 'subject-verb-agreement', 'intermediate', 'Which is WRONG?', '["She sings well", "They dance beautifully", "He play cricket", "I study daily"]', 2, 'Singular subject (He) needs -s. Wrong: "play" → Correct: "He plays cricket." Check subject-verb match!', 'hard'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Arrange: Saturdays / on / She / yoga / practices', '["She practices yoga on Saturdays", "She practice yoga on Saturdays", "She practicing yoga on Saturdays", "Both A and B"]', 0, 'Singular subject (She) = practices (add -es). Pattern: She + verb-es. Correct: "She practices."', 'hard'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Error: "My teacher teach English."', '["Use: teaches instead of teach", "Use: teaching instead of teach", "Use: is teach instead of teach", "Nothing wrong"]', 0, 'Singular subject (teacher) = teaches (add -es). Correct: "My teacher teaches English." -ch → -es rule!', 'hard'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Identify error: "The birds flies in the sky."', '["Use: fly instead of flies", "Use: is flying instead of flies", "Use: bird instead of birds", "Nothing wrong"]', 0, 'Plural subject (birds) = base verb (no -s). Correct: "The birds fly." Pattern: plural + base verb!', 'hard'),

-- ============================================================================
-- SUBTOPIC 2: Compound Subjects (and/or) (20 questions)
-- ============================================================================

-- EASY (8 questions)
('foundation', 'subject-verb-agreement', 'intermediate', '"Tom and Jerry _____ friends."', '["is", "are", "am", "be"]', 1, 'Compound subject with "and" = plural. Tom + Jerry = they = are. Pattern: [noun] and [noun] = plural verb.', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"Either he or she _____ coming."', '["is", "are", "am", "be"]', 0, 'Either/or: verb matches NEAREST subject. "she" (singular) = is. Pattern: either A or B → match B.', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"My brother and sister _____ doctors."', '["is", "are", "am", "be"]', 1, 'Compound subject with "and" = plural. brother + sister = they = are. Pattern: A and B = plural.', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"Neither the teacher nor the students _____ ready."', '["is", "are", "am", "be"]', 1, 'Neither/nor: verb matches NEAREST subject. "students" (plural) = are. Pattern: neither A nor B → match B.', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Compound subject with "and" uses:', '["plural verb", "singular verb", "no verb", "any verb"]', 0, 'Pattern: [noun] and [noun] = plural. A and B = they = plural verb (are, have, do).', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"He or she _____ responsible."', '["is", "are", "am", "be"]', 0, 'Or: verb matches NEAREST subject. "she" (singular) = is. Pattern: A or B → match B.', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"The cat and the dog _____ playing."', '["is", "are", "am", "be"]', 1, 'Compound subject with "and" = plural. cat + dog = they = are. Pattern: A and B = plural.', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Either/or and neither/nor: verb matches:', '["nearest subject", "first subject", "both subjects", "neither subject"]', 0, 'Rule: verb matches nearest subject to verb. "Either A or B" → match B. "Neither A nor B" → match B.', 'easy'),

-- MEDIUM (8 questions)
('foundation', 'subject-verb-agreement', 'intermediate', 'What is wrong? "Tom and Jerry is playing."', '["Use: are instead of is", "Use: am instead of is", "Remove: and", "Nothing wrong"]', 0, 'Compound with "and" = plural. Correct: "Tom and Jerry are playing." Pattern: A and B = are.', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Choose correct: "Either the students or the teacher _____ present."', '["is", "are", "am", "be"]', 0, 'Either/or: match nearest ("teacher" = singular). Correct: "is present." Pattern: either A or B → match B.', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Error in: "Neither he nor they is coming."', '["Use: are instead of is", "Use: am instead of is", "Use: he instead of they", "Nothing wrong"]', 0, 'Neither/nor: match nearest ("they" = plural). Correct: "are coming." Pattern: neither A nor B → match B.', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Arrange: brother / My / my / and / cricket / play / sister', '["My brother and my sister play cricket", "My brother and my sister plays cricket", "My brother and sister plays cricket", "Both A and C"]', 0, 'Compound subject = plural verb. Correct: "play cricket" (no -s). Pattern: A and B + base verb.', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Which is correct?', '["Either she or I am responsible", "Either she or I is responsible", "Either she or I are responsible", "All wrong"]', 0, 'Either/or: match nearest subject ("I" = am). Correct: "Either she or I am responsible." Pattern: match nearest!', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'What is the error? "Bread and butter are my favorite."', '["Use: is instead of are", "Remove: and", "Use: am instead of are", "Nothing wrong"]', 0, 'Single unit = singular verb! "Bread and butter" (one dish) = is. Exception: when compound refers to one thing. Correct: "is my favorite."', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Rearrange: the / or / Either / students / teacher / has / the / keys', '["Either the students or the teacher has keys", "Either the students or the teacher have keys", "Either the teacher or the students has keys", "Both A works, C wrong"]', 0, 'Either/or: match nearest. "teacher" (singular) nearest = has. Correct: "Either students or teacher has."', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Choose: "Neither the boys nor the girl _____ here."', '["is", "are", "am", "be"]', 0, 'Neither/nor: match nearest ("girl" = singular). Correct: "is here." Pattern: neither A nor B → match B!', 'medium'),

-- HARD (4 questions)
('foundation', 'subject-verb-agreement', 'intermediate', 'Which is WRONG?', '["Ram and Sita are friends", "Either you or he is wrong", "Neither they nor I am guilty", "Tom or his brothers is coming"]', 3, 'Or: match nearest ("brothers" = plural). Wrong: "is." Correct: "Tom or his brothers are coming." Match nearest!', 'hard'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Arrange: pen / pencil / or / a / My / on / is / the / desk', '["My pen or pencil is on the desk", "My pen and pencil is on the desk", "My pen or pencil are on the desk", "Both A and B"]', 0, 'Or: match nearest ("pencil" = singular) = is. Correct: "pen or pencil is." Pattern: A or B (both singular) = singular verb.', 'hard'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Error: "The teacher and the students is present."', '["Use: are instead of is", "Use: am instead of is", "Remove: and", "Nothing wrong"]', 0, 'Compound with "and" = plural. Correct: "are present." Pattern: A and B = plural verb always!', 'hard'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Identify correct: "Either the manager or the employees _____ responsible."', '["is", "are", "am", "Both A and B"]', 1, 'Either/or: match nearest ("employees" = plural) = are. Correct: "are responsible." Always match nearest subject!', 'hard'),

-- ============================================================================
-- SUBTOPIC 3: Indefinite Pronouns (20 questions)
-- ============================================================================

-- EASY (8 questions)
('foundation', 'subject-verb-agreement', 'intermediate', '"Everyone _____ present today."', '["is", "are", "am", "be"]', 0, 'Indefinite pronoun "Everyone" = singular. Always use "is" (not are). Pattern: Everyone/everybody + is.', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"Nobody _____ the answer."', '["know", "knows", "knowing", "known"]', 1, 'Indefinite pronoun "Nobody" = singular. Use verb + -s. Pattern: Nobody/no one + verb-s.', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"Somebody _____ at the door."', '["is", "are", "am", "be"]', 0, 'Indefinite pronoun "Somebody" = singular. Use "is." Pattern: Somebody/someone + is.', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"Each student _____ a book."', '["have", "has", "having", "had"]', 1, 'Indefinite pronoun "Each" = singular. Use "has" (not have). Pattern: Each/Every + singular verb.', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Indefinite pronouns ending in -one, -body, -thing are:', '["singular", "plural", "both", "neither"]', 0, 'Always singular: everyone, everybody, everything, someone, somebody, something, anyone, anybody, anything, no one, nobody, nothing. Pattern: -one/-body/-thing = singular.', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"Nothing _____ impossible."', '["is", "are", "am", "be"]', 0, 'Indefinite pronoun "Nothing" = singular. Use "is." Pattern: Nothing/everything + is.', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"Anyone _____ attend the meeting."', '["can", "cans", "is can", "are can"]', 0, 'Indefinite pronoun "Anyone" = singular. Modal "can" (no -s). Pattern: Anyone + can (modals never change).', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"Every teacher _____ dedicated."', '["is", "are", "am", "be"]', 0, 'Indefinite pronoun "Every" = singular. Use "is." Pattern: Every + singular noun + is.', 'easy'),

-- MEDIUM (8 questions)
('foundation', 'subject-verb-agreement', 'intermediate', 'What is wrong? "Everyone are happy."', '["Use: is instead of are", "Use: am instead of are", "Use: be instead of are", "Nothing wrong"]', 0, 'Indefinite pronoun "Everyone" = singular. Correct: "Everyone is happy." Common mistake: sounds plural but isn''t!', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Choose correct: "Each of the students _____ a laptop."', '["have", "has", "having", "are having"]', 1, 'Indefinite pronoun "Each" = singular (ignore "of the students"). Correct: "has a laptop." Pattern: Each of [plural] + singular verb.', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Error in: "Nobody know the truth."', '["Use: knows instead of know", "Use: knowing instead of know", "Use: are knowing instead of know", "Nothing wrong"]', 0, 'Indefinite pronoun "Nobody" = singular. Correct: "Nobody knows." Pattern: Nobody + verb-s.', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Arrange: here / Somebody / waiting / is', '["Somebody is waiting here", "Somebody are waiting here", "Somebody waiting is here", "Somebody here is waiting"]', 0, 'Indefinite pronoun "Somebody" = singular. Pattern: Somebody + is + verb-ing. Correct: "Somebody is waiting."', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Which is correct?', '["Everything are ready", "Everything is ready", "Everything am ready", "Everything be ready"]', 1, 'Indefinite pronoun "Everything" = singular. Correct: "Everything is ready." Pattern: Everything + is.', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'What is the error? "Each of the boys have a ball."', '["Use: has instead of have", "Use: having instead of have", "Remove: of the boys", "Nothing wrong"]', 0, 'Subject = "Each" (singular), NOT "boys." Correct: "Each has a ball." Pattern: Each of [plural] + singular verb!', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Rearrange: present / is / here / No / one', '["No one is present here", "No one are present here", "No ones is present here", "No one here present is"]', 0, 'Indefinite pronoun "No one" = singular. Pattern: No one + is (always two words). Correct: "No one is."', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Choose: "Neither of the answers _____ correct."', '["is", "are", "am", "be"]', 0, 'Indefinite pronoun "Neither" = singular (ignore "of the answers"). Correct: "is correct." Pattern: Neither of [plural] + singular verb.', 'medium'),

-- HARD (4 questions)
('foundation', 'subject-verb-agreement', 'intermediate', 'Which is WRONG?', '["Someone is calling", "Nobody knows", "Everyone are present", "Nothing works"]', 2, 'Indefinite pronoun "Everyone" = singular. Wrong: "are." Correct: "Everyone is present." Common error!', 'hard'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Arrange: of / Either / the / options / correct / is', '["Either of the options is correct", "Either of the options are correct", "Either options is correct", "Both A and B"]', 0, 'Indefinite pronoun "Either" = singular. Correct: "Either of the options is correct." Pattern: Either of [plural] + singular!', 'hard'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Error: "Every student and teacher are present."', '["Use: is instead of are", "Remove: and", "Use: am instead of are", "Nothing wrong"]', 0, '"Every" makes compound singular! Correct: "Every student and teacher is present." Pattern: Every A and B = singular (both share "every").', 'hard'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Identify correct: "One of the books _____ missing."', '["is", "are", "am", "Both A and B"]', 0, 'Subject = "One" (singular), NOT "books." Correct: "One is missing." Pattern: One of [plural] + singular verb!', 'hard'),

-- ============================================================================
-- SUBTOPIC 4: Collective Nouns (20 questions)
-- ============================================================================

-- EASY (8 questions)
('foundation', 'subject-verb-agreement', 'intermediate', '"The team _____ playing well."', '["is", "are", "am", "be"]', 0, 'Collective noun (team) acting as unit = singular. Use "is." Pattern: collective noun (as one) + singular verb.', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"The family _____ on vacation."', '["is", "are", "am", "be"]', 0, 'Collective noun (family) acting as unit = singular. Use "is." Pattern: family (together) + is.', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"The class _____ listening attentively."', '["is", "are", "am", "be"]', 0, 'Collective noun (class) acting as unit = singular. Use "is." Pattern: class (together) + is.', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"The audience _____ enjoying the show."', '["is", "are", "am", "be"]', 0, 'Collective noun (audience) acting as unit = singular. Use "is." American English: singular. British: can be plural.', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Collective nouns as one unit use:', '["singular verb", "plural verb", "no verb", "any verb"]', 0, 'Collective nouns (team, family, class, committee) acting as one unit = singular verb (is, has, does).', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"The committee _____ decided."', '["has", "have", "having", "had"]', 0, 'Collective noun (committee) acting as unit = singular. Use "has." Pattern: committee (as one) + has.', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"The jury _____ reached a verdict."', '["has", "have", "having", "had"]', 0, 'Collective noun (jury) acting as unit = singular. Use "has." American English: singular preferred.', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"The crowd _____ cheering loudly."', '["is", "are", "am", "be"]', 0, 'Collective noun (crowd) acting as unit = singular. Use "is." Pattern: crowd (together) + is.', 'easy'),

-- MEDIUM (8 questions)
('foundation', 'subject-verb-agreement', 'intermediate', 'What is wrong? "The team are playing well."', '["Use: is instead of are (American)", "Nothing wrong (British)", "Both A and B", "Remove: are"]', 2, 'Both acceptable! American: "team is" (singular). British: "team are" (plural OK). Context determines preference!', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Choose correct (American English): "The government _____ decided."', '["has", "have", "Both correct", "Neither"]', 0, 'American English: collective noun = singular. Correct: "has decided." British may use "have." Context: American = has.', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Error in: "The staff is disagreeing with each other."', '["Use: are instead of is", "Nothing wrong", "Remove: with each other", "Both A and B"]', 3, 'Members acting individually = plural verb! Correct: "The staff are disagreeing" (separate actions). "with each other" signals plural!', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Arrange: won / The / has / championship / the / team', '["The team has won the championship", "The team have won the championship", "The teams has won the championship", "Both A and B"]', 3, 'Both OK! American: "team has" (singular). British: "team have" (plural). Both grammatically correct!', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Which is correct formal American English?', '["The family are happy", "The family is happy", "Both correct", "Neither"]', 1, 'American formal: collective = singular. Correct: "The family is happy." British allows "are."', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'What is the error? "The committee have different opinions."', '["Use: has instead of have (if American)", "Nothing wrong (British or individual opinions)", "Remove: different", "Both A and B"]', 3, 'Context matters! "different opinions" = members disagree (plural action). British: "have" OK. American: "have" acceptable when emphasizing individual members!', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Rearrange: divided / The / are / jury', '["The jury are divided", "The jury is divided", "Both A and B correct", "The juries are divided"]', 2, 'Both correct! "divided" suggests individual disagreement = plural OK. American: "is" preferred. British: "are" natural. Context allows both!', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Choose: "The public _____ concerned about safety."', '["is", "are", "Both correct", "Neither"]', 2, 'Both OK! American: "public is" (singular). British: "public are" (plural). Both grammatically acceptable!', 'medium'),

-- HARD (4 questions)
('foundation', 'subject-verb-agreement', 'intermediate', 'Which is WRONG in American English?', '["The team has won", "The family is here", "The government have decided", "The class is listening"]', 2, 'American English: collective = singular. Wrong: "government have." Correct: "government has." British accepts "have."', 'hard'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Arrange: leaving / The / are / their / staff / desks', '["The staff are leaving their desks", "The staff is leaving their desks", "The staffs are leaving their desks", "Both A correct (individual action)"]', 0, 'Individual actions (leaving different desks) = plural verb! Correct: "The staff are leaving." Members acting separately!', 'hard'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Error: "The police is investigating the case."', '["Use: are instead of is", "Nothing wrong", "Use: has instead of is", "Remove: is"]', 0, 'Plural collective: "police" = always plural. Correct: "The police are investigating." Never "police is"!', 'hard'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Identify correct: "The data _____ analyzed."', '["is", "are", "Both correct", "Neither"]', 2, 'Both acceptable! Formal/scientific: "data are" (plural of datum). Informal/modern: "data is" (mass noun). Context determines!', 'hard'),

-- ============================================================================
-- SUBTOPIC 5: Inverted Sentences (20 questions)
-- ============================================================================

-- EASY (8 questions)
('foundation', 'subject-verb-agreement', 'intermediate', '"_____ you going to the party?"', '["Is", "Are", "Am", "Be"]', 1, 'Subject "you" after verb in question. Pattern: Are + you? "You" always takes "are."', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"_____ she a teacher?"', '["Is", "Are", "Am", "Be"]', 0, 'Subject "she" (singular) after verb. Pattern: Is + singular subject? Question form inverts.', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"Here _____ the books."', '["is", "are", "am", "be"]', 1, 'Real subject = "books" (plural) after verb. Pattern: Here + verb + subject. books = plural → are.', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"There _____ a cat on the roof."', '["is", "are", "am", "be"]', 0, 'Real subject = "cat" (singular) after verb. Pattern: There + verb + subject. cat = singular → is.', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', 'In questions, verb matches:', '["subject after verb", "first word", "last word", "no rule"]', 0, 'Inverted: verb comes before subject. Match verb to subject (even if subject comes later). Pattern: Verb + subject?', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"_____ they ready?"', '["Is", "Are", "Am", "Be"]', 1, 'Subject "they" (plural) after verb. Pattern: Are + they? Plural subject → are.', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"Here _____ your pen."', '["is", "are", "am", "be"]', 0, 'Real subject = "pen" (singular) after verb. Pattern: Here + is + singular subject. pen → is.', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"_____ he coming tomorrow?"', '["Is", "Are", "Am", "Do"]', 0, 'Subject "he" (singular) after verb. Pattern: Is + he? Singular → is.', 'easy'),

-- MEDIUM (8 questions)
('foundation', 'subject-verb-agreement', 'intermediate', 'What is wrong? "Here is the books."', '["Use: are instead of is", "Use: am instead of is", "Remove: the", "Nothing wrong"]', 0, 'Subject = "books" (plural). Correct: "Here are the books." Pattern: Here + are + plural subject.', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Choose correct: "There _____ many students in the class."', '["is", "are", "am", "be"]', 1, 'Subject = "students" (plural). Correct: "There are many students." Pattern: There + are + plural.', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Error in: "Where is the books?"', '["Use: are instead of is", "Use: am instead of is", "Use: book instead of books", "Nothing wrong"]', 0, 'Subject = "books" (plural). Correct: "Where are the books?" Match verb to subject (even in questions)!', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Arrange: your / Here / keys / are', '["Here are your keys", "Here is your keys", "Here your keys are", "Your keys here are"]', 0, 'Subject = "keys" (plural). Pattern: Here + are + plural subject. Correct: "Here are your keys."', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Which is correct?', '["There is three apples", "There are three apples", "There am three apples", "There be three apples"]', 1, 'Subject = "apples" (plural). Correct: "There are three apples." Pattern: There + are + plural.', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'What is the error? "Does they understand?"', '["Use: Do instead of Does", "Use: Is instead of Does", "Use: they understands", "Nothing wrong"]', 0, 'Subject = "they" (plural). Correct: "Do they understand?" Pattern: Do + plural subject.', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Rearrange: the / students / Where / are', '["Where are the students", "Where is the students", "Where the students are", "Both A and C"]', 0, 'Subject = "students" (plural). Pattern: Where + are + plural subject? Correct: "Where are the students?"', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Choose: "_____ the children playing?"', '["Is", "Are", "Am", "Be"]', 1, 'Subject = "children" (plural). Correct: "Are the children playing?" Pattern: Are + plural subject?', 'medium'),

-- HARD (4 questions)
('foundation', 'subject-verb-agreement', 'intermediate', 'Which is WRONG?', '["Here is your book", "There are many people", "Where is the keys", "Are you ready"]', 2, 'Subject = "keys" (plural). Wrong: "is." Correct: "Where are the keys?" Match subject after verb!', 'hard'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Arrange: the / On / lies / table / a / book', '["On the table lies a book", "On the table lie a book", "A book lies on the table", "Both A and C"]', 3, 'Both correct! Inverted: "On the table lies a book" (subject "book" after verb). Normal: "A book lies on the table." Both valid!', 'hard'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Error: "Rarely does she makes mistakes."', '["Use: make instead of makes", "Use: do instead of does", "Remove: Rarely", "Nothing wrong"]', 0, 'After auxiliary "does," use base verb. Correct: "Rarely does she make mistakes." Pattern: does + subject + base verb!', 'hard'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Identify correct: "Not only _____ he talented, but he is also hardworking."', '["is", "are", "am", "does"]', 0, 'Subject = "he" (singular). Inverted: "Not only is he talented." Pattern: Not only + verb + subject. Correct: "is he."', 'hard'),

-- ============================================================================
-- SUBTOPIC 6: Phrases Between Subject-Verb (20 questions)
-- ============================================================================

-- EASY (8 questions)
('foundation', 'subject-verb-agreement', 'intermediate', '"The book on the table _____ mine."', '["is", "are", "am", "be"]', 0, 'Subject = "book" (singular). Ignore "on the table" (prepositional phrase). Pattern: singular subject + is.', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"The students in the classroom _____ studying."', '["is", "are", "am", "be"]', 1, 'Subject = "students" (plural). Ignore "in the classroom" (phrase). Pattern: plural subject + are.', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"The cat with the kittens _____ sleeping."', '["is", "are", "am", "be"]', 0, 'Subject = "cat" (singular). Ignore "with the kittens" (phrase). Pattern: singular subject + is.', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"The keys in the drawer _____ missing."', '["is", "are", "am", "be"]', 1, 'Subject = "keys" (plural). Ignore "in the drawer" (phrase). Pattern: plural subject + are.', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Rule: Ignore phrases between:', '["subject and verb", "article and noun", "verb and object", "all phrases"]', 0, 'Verb matches SUBJECT only. Ignore intervening phrases (of, in, with, at). Find real subject first!', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"The teacher of these students _____ kind."', '["is", "are", "am", "be"]', 0, 'Subject = "teacher" (singular). Ignore "of these students" (phrase). Pattern: teacher + is.', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"The flowers in the vase _____ beautiful."', '["is", "are", "am", "be"]', 1, 'Subject = "flowers" (plural). Ignore "in the vase" (phrase). Pattern: flowers + are.', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"The man with the dogs _____ walking."', '["is", "are", "am", "be"]', 0, 'Subject = "man" (singular). Ignore "with the dogs" (phrase). Pattern: man + is.', 'easy'),

-- MEDIUM (8 questions)
('foundation', 'subject-verb-agreement', 'intermediate', 'What is wrong? "The box of chocolates are expensive."', '["Use: is instead of are", "Use: am instead of are", "Remove: of chocolates", "Nothing wrong"]', 0, 'Subject = "box" (singular). Ignore "of chocolates." Correct: "The box is expensive." Match verb to "box"!', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Choose correct: "The results of the exam _____ out."', '["is", "are", "am", "be"]', 1, 'Subject = "results" (plural). Ignore "of the exam." Correct: "The results are out." Match "results"!', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Error in: "The team with the best players lose."', '["Use: loses instead of lose", "Use: looses instead of lose", "Use: are losing instead of lose", "Nothing wrong"]', 0, 'Subject = "team" (singular). Ignore "with the best players." Correct: "The team loses." Singular verb!', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Arrange: the / of / The / students / is / group / large', '["The group of students is large", "The group of students are large", "The groups of students is large", "Both A and B"]', 0, 'Subject = "group" (singular). Ignore "of students." Pattern: group + is. Correct: "The group is large."', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Which is correct?', '["The bag of apples are heavy", "The bag of apples is heavy", "The bags of apple is heavy", "The bag of apple are heavy"]', 1, 'Subject = "bag" (singular). Ignore "of apples." Correct: "The bag is heavy." Match "bag"!', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'What is the error? "The list of names are long."', '["Use: is instead of are", "Use: am instead of are", "Use: lists instead of list", "Nothing wrong"]', 0, 'Subject = "list" (singular). Ignore "of names." Correct: "The list is long." Match "list"!', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Rearrange: with / The / are / teacher / students / the', '["The teacher with the students is here", "The teacher with the students are here", "The teachers with the students is here", "Teacher is with the students here"]', 0, 'Subject = "teacher" (singular). Ignore "with the students." Pattern: teacher + is. Correct word order!', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Choose: "One of the books _____ missing."', '["is", "are", "am", "be"]', 0, 'Subject = "One" (singular). Ignore "of the books." Correct: "One is missing." Match "One"!', 'medium'),

-- HARD (4 questions)
('foundation', 'subject-verb-agreement', 'intermediate', 'Which is WRONG?', '["The leader of the group is responsible", "The members of the team are ready", "The price of these items are high", "The colors of the rainbow are beautiful"]', 2, 'Subject = "price" (singular). Wrong: "are." Correct: "The price is high." Ignore "of these items"!', 'hard'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Arrange: along / The / students / are / the / teacher / with / walking', '["The students along with the teacher are walking", "The students along with the teacher is walking", "The teacher along with the students are walking", "Both A correct"]', 0, 'Subject = "students" (plural) before phrase. Ignore "along with the teacher." Correct: "students are walking."', 'hard'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Error: "Neither of the answers are correct."', '["Use: is instead of are", "Nothing wrong", "Use: answer instead of answers", "Remove: of"]', 0, 'Subject = "Neither" (singular). Ignore "of the answers." Correct: "Neither is correct." Singular verb!', 'hard'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Identify correct: "The committee, including all members, _____ decided."', '["has", "have", "Both correct", "Neither"]', 0, 'Subject = "committee" (singular). Ignore "including all members." Correct: "The committee has decided." Match committee!', 'hard'),

-- ============================================================================
-- SUBTOPIC 7: There is/are, Here is/are (20 questions)
-- ============================================================================

-- EASY (8 questions)
('foundation', 'subject-verb-agreement', 'intermediate', '"There _____ a book on the table."', '["is", "are", "am", "be"]', 0, 'Subject = "book" (singular) after "there." Pattern: There + is + singular subject. book → is.', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"There _____ many students here."', '["is", "are", "am", "be"]', 1, 'Subject = "students" (plural) after "there." Pattern: There + are + plural subject. students → are.', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"Here _____ your book."', '["is", "are", "am", "be"]', 0, 'Subject = "book" (singular) after "here." Pattern: Here + is + singular subject. book → is.', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"Here _____ the keys."', '["is", "are", "am", "be"]', 1, 'Subject = "keys" (plural) after "here." Pattern: Here + are + plural subject. keys → are.', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', 'There/Here: verb matches:', '["subject after there/here", "there/here itself", "nothing", "speaker"]', 0, 'Rule: There/Here + verb + SUBJECT. Verb matches subject (comes after). Ignore "there/here" for agreement!', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"There _____ a problem."', '["is", "are", "am", "be"]', 0, 'Subject = "problem" (singular). Pattern: There + is + singular. problem → is.', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"Here _____ the students."', '["is", "are", "am", "be"]', 1, 'Subject = "students" (plural). Pattern: Here + are + plural. students → are.', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"There _____ three apples."', '["is", "are", "am", "be"]', 1, 'Subject = "apples" (plural). Pattern: There + are + plural + noun. apples → are.', 'easy'),

-- MEDIUM (8 questions)
('foundation', 'subject-verb-agreement', 'intermediate', 'What is wrong? "There is many people."', '["Use: are instead of is", "Use: am instead of is", "Use: person instead of people", "Nothing wrong"]', 0, 'Subject = "people" (plural). Correct: "There are many people." Pattern: There + are + plural.', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Choose correct: "There _____ a pen and a pencil on the desk."', '["is", "are", "Both correct", "Neither"]', 0, 'Nearest subject = "pen" (singular). Correct: "There is a pen and a pencil." Match nearest in "there is/are" constructions!', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Error in: "Here are your pen."', '["Use: is instead of are", "Use: pens instead of pen", "Remove: are", "Both A and B"]', 3, 'Subject = "pen" (singular). Fix: "Here is your pen" (change verb) OR "Here are your pens" (change noun). Both work!', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Arrange: problems / many / There / this / in / are / question', '["There are many problems in this question", "There is many problems in this question", "There are much problems in this question", "Many problems there are in this question"]', 0, 'Subject = "problems" (plural). Pattern: There + are + plural + noun. Correct: "There are many problems."', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Which is correct?', '["There is two books", "There are two books", "There am two books", "There be two books"]', 1, 'Subject = "books" (plural). Correct: "There are two books." Pattern: There + are + number + plural.', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'What is the error? "Here is the books you wanted."', '["Use: are instead of is", "Use: book instead of books", "Remove: the", "Both A and B"]', 0, 'Subject = "books" (plural). Correct: "Here are the books." Pattern: Here + are + plural!', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Rearrange: friends / Here / my / are / and / I', '["Here are my friends and I", "Here is my friends and I", "Here are my friend and I", "My friends and I are here"]', 0, 'Subject = "friends and I" (plural). Pattern: Here + are + compound subject. Correct: "Here are my friends and I."', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Choose: "There _____ no time left."', '["is", "are", "am", "be"]', 0, 'Subject = "time" (singular, uncountable). Correct: "There is no time." Pattern: There + is + uncountable.', 'medium'),

-- HARD (4 questions)
('foundation', 'subject-verb-agreement', 'intermediate', 'Which is WRONG?', '["There is a cat", "There are many students", "Here is your keys", "There is no problem"]', 2, 'Subject = "keys" (plural). Wrong: "is." Correct: "Here are your keys." Match plural subject!', 'hard'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Arrange: a / There / books / pen / are / three / and', '["There are three books and a pen", "There is three books and a pen", "There are a pen and three books", "Both A and C"]', 0, 'Nearest subject = "books" (plural) when listed first. Correct: "There are three books and a pen." Match nearest!', 'hard'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Error: "There has been many accidents."', '["Use: have been instead of has been", "Nothing wrong", "Use: is instead of has been", "Use: was instead of has been"]', 0, 'Subject = "accidents" (plural). Correct: "There have been many accidents." Pattern: There + have been + plural!', 'hard'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Identify correct: "There _____ no milk and no eggs."', '["is", "are", "Both correct", "Neither"]', 0, 'Both subjects uncountable/singular concept. Correct: "There is no milk and no eggs." Treat compound of uncountables as singular!', 'hard'),

-- ============================================================================
-- SUBTOPIC 8: Special Cases (each, every, etc.) (20 questions)
-- ============================================================================

-- EASY (8 questions)
('foundation', 'subject-verb-agreement', 'intermediate', '"Each student _____ a book."', '["have", "has", "having", "had"]', 1, 'Each = singular. Always use singular verb. Pattern: Each + singular noun + singular verb. has = correct.', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"Every teacher _____ present."', '["is", "are", "am", "be"]', 0, 'Every = singular. Always use singular verb. Pattern: Every + singular noun + is. Every → singular.', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"Each of the boys _____ a ball."', '["have", "has", "having", "had"]', 1, 'Each = singular (ignore "of the boys"). Pattern: Each of [plural] + singular verb. has = correct.', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"Every one of them _____ ready."', '["is", "are", "am", "be"]', 0, 'Every one = singular (two words = each one). Pattern: Every one + is. Singular verb!', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Each/Every always use:', '["singular verb", "plural verb", "any verb", "no verb"]', 0, 'Rule: Each and Every = always singular. Each/Every + singular noun + singular verb (is, has, does).', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"Each boy and girl _____ present."', '["is", "are", "am", "be"]', 0, 'Each makes compound singular! Pattern: Each A and B + is (both covered by "each"). Singular verb!', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"Every student and teacher _____ invited."', '["is", "are", "am", "be"]', 0, 'Every makes compound singular! Pattern: Every A and B + is (both get "every"). Singular verb!', 'easy'),

('foundation', 'subject-verb-agreement', 'intermediate', '"Each answer _____ important."', '["is", "are", "am", "be"]', 0, 'Each = singular. Pattern: Each + singular noun + is. answer → is.', 'easy'),

-- MEDIUM (8 questions)
('foundation', 'subject-verb-agreement', 'intermediate', 'What is wrong? "Each of the students have a laptop."', '["Use: has instead of have", "Use: having instead of have", "Remove: of the students", "Nothing wrong"]', 0, 'Each = singular (ignore "of the students"). Correct: "Each has a laptop." Pattern: Each of [plural] + has!', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Choose correct: "Every man, woman, and child _____ accounted for."', '["is", "are", "am", "be"]', 0, 'Every makes all singular! Correct: "is accounted for." Pattern: Every A, B, and C + singular verb!', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Error in: "Each player and coach are present."', '["Use: is instead of are", "Remove: and", "Use: am instead of are", "Nothing wrong"]', 0, 'Each makes compound singular! Correct: "Each player and coach is present." Pattern: Each A and B + is!', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Arrange: the / Each / has / of / a / options / benefit', '["Each of the options has a benefit", "Each of the options have a benefit", "Each of the option has a benefit", "Each options has a benefit"]', 0, 'Each = singular. Pattern: Each of [plural] + has + singular noun. Correct: "Each has a benefit."', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Which is correct?', '["Every students are present", "Every student is present", "Every student are present", "Every students is present"]', 1, 'Every + singular noun + singular verb. Correct: "Every student is present." Pattern: Every + singular!', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'What is the error? "Each employee and supervisor were notified."', '["Use: was instead of were", "Nothing wrong", "Remove: and", "Use: are instead of were"]', 0, 'Each = singular (even compound). Correct: "Each employee and supervisor was notified." Past: was (not were)!', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Rearrange: question / important / Every / is', '["Every question is important", "Every question are important", "Every questions is important", "Every questions are important"]', 0, 'Every + singular noun + is. Pattern: Every + singular + singular verb. Correct: "Every question is."', 'medium'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Choose: "Each of us _____ responsible."', '["is", "are", "am", "be"]', 0, 'Each = singular (ignore "of us"). Correct: "Each is responsible." Pattern: Each of [plural] + is!', 'medium'),

-- HARD (4 questions)
('foundation', 'subject-verb-agreement', 'intermediate', 'Which is WRONG?', '["Each student has a book", "Every teacher is kind", "Each of them are ready", "Every answer is correct"]', 2, 'Each = singular. Wrong: "are." Correct: "Each of them is ready." Pattern: Each + is always!', 'hard'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Arrange: Every / pencil / and / has / eraser / pen / a', '["Every pen and pencil has an eraser", "Every pen and pencil have an eraser", "Every pens and pencils has an eraser", "Every pens and pencils have an eraser"]', 0, 'Every + compound = singular. Pattern: Every A and B + has. Correct: "Every pen and pencil has."', 'hard'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Error: "Everyone of the answers are wrong."', '["Use: is instead of are", "Change: Everyone to Every one", "Both A and B correct", "Nothing wrong"]', 2, 'Two issues: "Everyone" (one word) doesn''t use "of." Write: "Every one of the answers is wrong." Separate words + singular verb!', 'hard'),

('foundation', 'subject-verb-agreement', 'intermediate', 'Identify correct: "Each member of the teams _____ a uniform."', '["has", "have", "Both correct", "Neither"]', 0, 'Each = singular (ignore "of the teams"). Correct: "Each member has a uniform." Pattern: Each + has!', 'hard');

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

SELECT 'Subject-Verb Agreement Question Count Check' as check_name;
SELECT COUNT(*) as total_questions FROM english_questions WHERE topic_id = 'subject-verb-agreement';

-- Expected output: 160 questions
-- Breakdown: 20 per subtopic × 8 subtopics = 160
