-- ============================================================================
-- FOUNDATION PATH: Pronouns Mastery (COMPLETE)
-- Topic ID: pronouns-detailed
-- Level: beginner (A1)
-- Total: 100 questions covering ALL 5 subtopics
-- ============================================================================
-- Subtopics covered:
--   1. Subject Pronouns - 20 questions
--   2. Object Pronouns - 20 questions
--   3. Possessive Pronouns - 20 questions
--   4. Reflexive Pronouns - 20 questions
--   5. Demonstrative Pronouns - 20 questions
-- Distribution: 40 easy, 40 medium, 20 hard (40/40/20)
-- ============================================================================

INSERT INTO english_questions (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty) VALUES

-- ============================================================================
-- SUBTOPIC 1: Subject Pronouns (20 questions)
-- ============================================================================

-- EASY (8 questions)
('foundation', 'pronouns-detailed', 'beginner', '"_____ am a student."', '["I", "Me", "My", "Mine"]', 0, 'Subject pronoun = I (before verb). Pattern: I + verb. "Me" is object pronoun. "My/Mine" are possessive.', 'easy'),

('foundation', 'pronouns-detailed', 'beginner', '"_____ is my friend."', '["Him", "He", "His", "He is"]', 1, 'Subject pronoun = He (before verb). Pattern: He + verb. "Him" = object, "His" = possessive.', 'easy'),

('foundation', 'pronouns-detailed', 'beginner', '"_____ are happy."', '["We", "Us", "Our", "Ours"]', 0, 'Subject pronoun = We (before verb). Pattern: We + verb. "Us" = object, "Our/Ours" = possessive.', 'easy'),

('foundation', 'pronouns-detailed', 'beginner', '"_____ go to school."', '["They", "Them", "Their", "Theirs"]', 0, 'Subject pronoun = They (before verb). Pattern: They + verb. "Them" = object, "Their/Theirs" = possessive.', 'easy'),

('foundation', 'pronouns-detailed', 'beginner', '"_____ is raining."', '["It", "Its", "It is", "That"]', 0, 'Subject pronoun = It (before verb). Pattern: It + verb. "Its" = possessive (no apostrophe). "It''s" = It is.', 'easy'),

('foundation', 'pronouns-detailed', 'beginner', '"_____ love music."', '["You", "Your", "Yours", "You are"]', 0, 'Subject pronoun = You (before verb). Pattern: You + verb. "Your/Yours" = possessive. "You''re" = You are.', 'easy'),

('foundation', 'pronouns-detailed', 'beginner', '"_____ plays tennis."', '["She", "Her", "Hers", "She is"]', 0, 'Subject pronoun = She (before verb). Pattern: She + verb. "Her" = object/possessive, "Hers" = possessive pronoun.', 'easy'),

('foundation', 'pronouns-detailed', 'beginner', 'Which is a subject pronoun?', '["me", "us", "I", "him"]', 2, 'Subject pronouns: I, you, he, she, it, we, they (before verbs). Object pronouns: me, you, him, her, it, us, them (after verbs).', 'easy'),

-- MEDIUM (8 questions)
('foundation', 'pronouns-detailed', 'beginner', 'What is wrong? "Me am tired."', '["Use: I instead of Me", "Use: I''m instead of am", "Use: We instead of Me", "Both A and B"]', 0, 'Subject pronoun before verb = I (not Me). Correct: "I am tired." Me = object pronoun (after verb/preposition).', 'medium'),

('foundation', 'pronouns-detailed', 'beginner', 'Choose correct: "_____ and I are friends."', '["She", "Her", "Hers", "She''s"]', 0, 'Subject pronoun = She (before verb). Pattern: [Subject] and I + verb. Never "Her and I" (her = object).', 'medium'),

('foundation', 'pronouns-detailed', 'beginner', 'Error in: "Him is my brother."', '["Use: He instead of Him", "Use: His instead of Him", "Add: the before Him", "Nothing wrong"]', 0, 'Subject pronoun = He (before verb). Him = object pronoun. Correct: "He is my brother."', 'medium'),

('foundation', 'pronouns-detailed', 'beginner', 'Arrange: playing / are / We / football', '["We are playing football", "Us are playing football", "We is playing football", "Our are playing football"]', 0, 'Subject pronoun = We (before verb). Pattern: Subject + verb (are) + verb-ing. Correct: "We are playing football."', 'medium'),

('foundation', 'pronouns-detailed', 'beginner', 'Which is correct?', '["Her and me went shopping", "She and I went shopping", "She and me went shopping", "Her and I went shopping"]', 1, 'Both pronouns = subject (before verb). Pattern: She and I + verb. Test: remove one pronoun — "She went" ✓, "I went" ✓.', 'medium'),

('foundation', 'pronouns-detailed', 'beginner', 'What is the error? "Us like pizza."', '["Use: We instead of Us", "Use: Our instead of Us", "Use: Ours instead of Us", "Nothing wrong"]', 0, 'Subject pronoun = We (before verb). Us = object pronoun. Correct: "We like pizza."', 'medium'),

('foundation', 'pronouns-detailed', 'beginner', 'Rearrange: teacher / They / their / are / and / nice', '["They are their teacher and nice", "They and their teacher are nice", "Their teacher and they are nice", "They are nice and their teacher"]', 1, 'Subject pronouns first in compound subjects. Natural: "They and their teacher are nice." Or: "Their teacher and they are nice" (both OK).', 'medium'),

('foundation', 'pronouns-detailed', 'beginner', 'Choose: "_____ or he can help."', '["Me", "I", "My", "Mine"]', 1, 'Subject pronoun = I (compound subject). Pattern: I or [subject] + verb. Test: "I can help" ✓, not "Me can help" ✗.', 'medium'),

-- HARD (4 questions)
('foundation', 'pronouns-detailed', 'beginner', 'Which is WRONG?', '["You and I are ready", "He and she are coming", "Me and him are friends", "They and we are neighbors"]', 2, 'Subject pronouns before verbs. "Me and him" = both object pronouns. Correct: "He and I are friends." Test each alone!', 'hard'),

('foundation', 'pronouns-detailed', 'beginner', 'Arrange: will / dinner / cook / She / I / and', '["She and I will cook dinner", "Her and I will cook dinner", "She and me will cook dinner", "Her and me will cook dinner"]', 0, 'Both subject pronouns (before verb). Pattern: She and I + will + verb. Test: "She will cook" ✓, "I will cook" ✓.', 'hard'),

('foundation', 'pronouns-detailed', 'beginner', 'Error: "It''s raining. Its is cold."', '["Use: It''s (It is) instead of Its is", "Use: It instead of Its", "Remove: is", "Both A and C"]', 3, '"Its is" = double verb! Correct: "It''s cold" (It is) OR "It is cold." "Its" = possessive (no apostrophe). Both fixes work.', 'hard'),

('foundation', 'pronouns-detailed', 'beginner', 'Which is correct formal writing?', '["It is I who called", "It is me who called", "It am I who called", "It''s me who called"]', 0, 'Formal = subject pronoun after linking verb "is." "It is I" = formal/traditional. "It''s me" = informal (common speech). Context: formal.', 'hard'),

-- ============================================================================
-- SUBTOPIC 2: Object Pronouns (20 questions)
-- ============================================================================

-- EASY (8 questions)
('foundation', 'pronouns-detailed', 'beginner', '"She loves _____."', '["I", "me", "my", "mine"]', 1, 'Object pronoun after verb = me. Pattern: verb + me. "I" = subject (before verb), "my/mine" = possessive.', 'easy'),

('foundation', 'pronouns-detailed', 'beginner', '"They called _____."', '["he", "him", "his", "he''s"]', 1, 'Object pronoun after verb = him. Pattern: verb + him. "He" = subject, "his" = possessive.', 'easy'),

('foundation', 'pronouns-detailed', 'beginner', '"Give the book to _____."', '["she", "her", "hers", "she''s"]', 1, 'Object pronoun after preposition (to) = her. Pattern: preposition + object pronoun. "She" = subject, "hers" = possessive.', 'easy'),

('foundation', 'pronouns-detailed', 'beginner', '"We saw _____."', '["they", "them", "their", "theirs"]', 1, 'Object pronoun after verb = them. Pattern: verb + them. "They" = subject, "their/theirs" = possessive.', 'easy'),

('foundation', 'pronouns-detailed', 'beginner', '"He sat with _____."', '["we", "us", "our", "ours"]', 1, 'Object pronoun after preposition (with) = us. Pattern: preposition + us. "We" = subject, "our/ours" = possessive.', 'easy'),

('foundation', 'pronouns-detailed', 'beginner', '"She texted _____."', '["I", "me", "my", "mine"]', 1, 'Object pronoun after verb = me. Pattern: verb + object. "I" = subject (before verb).', 'easy'),

('foundation', 'pronouns-detailed', 'beginner', '"The dog followed _____."', '["she", "her", "hers", "she is"]', 1, 'Object pronoun after verb = her. Pattern: verb + object. "She" = subject, "hers" = possessive pronoun.', 'easy'),

('foundation', 'pronouns-detailed', 'beginner', 'Which is an object pronoun?', '["I", "we", "him", "they"]', 2, 'Object pronouns: me, you, him, her, it, us, them (after verbs/prepositions). Subject: I, we, he, they (before verbs).', 'easy'),

-- MEDIUM (8 questions)
('foundation', 'pronouns-detailed', 'beginner', 'What is wrong? "Call I tomorrow."', '["Use: me instead of I", "Use: my instead of I", "Move: I before Call", "Nothing wrong"]', 0, 'Object pronoun after verb = me (not I). Correct: "Call me tomorrow." I = subject (before verb only).', 'medium'),

('foundation', 'pronouns-detailed', 'beginner', 'Choose correct: "She invited _____ to the party."', '["he and I", "him and me", "he and me", "him and I"]', 1, 'Both object pronouns (after verb). Pattern: verb + him and me. Test: "invited him" ✓, "invited me" ✓.', 'medium'),

('foundation', 'pronouns-detailed', 'beginner', 'Error in: "Give the keys to she."', '["Use: her instead of she", "Use: hers instead of she", "Use: she''s instead of she", "Nothing wrong"]', 0, 'Object pronoun after preposition = her (not she). Correct: "Give the keys to her." She = subject only.', 'medium'),

('foundation', 'pronouns-detailed', 'beginner', 'Arrange: me / Can / help / you', '["Can you help me", "Can me help you", "Can you help I", "Can I help you"]', 0, 'Object pronoun after verb = me. Pattern: Can + subject (you) + verb + object (me). Correct: "Can you help me."', 'medium'),

('foundation', 'pronouns-detailed', 'beginner', 'Which is correct?', '["between you and I", "between you and me", "between you and my", "between you and mine"]', 1, 'Object pronoun after preposition = me. Pattern: preposition + object. "between you and me" = correct (not "and I").', 'medium'),

('foundation', 'pronouns-detailed', 'beginner', 'What is the error? "He told we the news."', '["Use: us instead of we", "Use: our instead of we", "Use: ours instead of we", "Nothing wrong"]', 0, 'Object pronoun after verb = us (not we). Correct: "He told us the news." We = subject only.', 'medium'),

('foundation', 'pronouns-detailed', 'beginner', 'Rearrange: for / This / is / they', '["This is for they", "This is for them", "This is for their", "This is for theirs"]', 1, 'Object pronoun after preposition = them (not they). Pattern: preposition + object. Correct: "This is for them."', 'medium'),

('foundation', 'pronouns-detailed', 'beginner', 'Choose: "She sat next to _____."', '["I", "me", "my", "mine"]', 1, 'Object pronoun after preposition (next to) = me. Pattern: preposition + object. "next to me" = correct.', 'medium'),

-- HARD (4 questions)
('foundation', 'pronouns-detailed', 'beginner', 'Which is WRONG?', '["Tell him the truth", "Give her the book", "Send they a message", "Show us the way"]', 2, 'Object pronouns: him, her, us, them. "they" = subject pronoun. Correct: "Send them a message."', 'hard'),

('foundation', 'pronouns-detailed', 'beginner', 'Arrange: invited / She / to / dinner / he / and / I', '["She invited he and I to dinner", "She invited him and me to dinner", "She invited him and I to dinner", "She invited he and me to dinner"]', 1, 'Both object pronouns (after verb). Pattern: verb + him and me + to. Test each: "invited him" ✓, "invited me" ✓.', 'hard'),

('foundation', 'pronouns-detailed', 'beginner', 'Error: "Let''s keep this between you and I."', '["Use: me instead of I", "Use: my instead of I", "Use: mine instead of I", "Nothing wrong"]', 0, 'Object pronoun after preposition = me. Common mistake: "between you and I" → Correct: "between you and me."', 'hard'),

('foundation', 'pronouns-detailed', 'beginner', 'Which is correct formal writing?', '["The teacher asked she and I", "The teacher asked her and me", "The teacher asked her and I", "The teacher asked she and me"]', 1, 'Both object pronouns (after verb "asked"). Formal/informal both: "her and me." Test: "asked her" ✓, "asked me" ✓.', 'hard'),

-- ============================================================================
-- SUBTOPIC 3: Possessive Pronouns (20 questions)
-- ============================================================================

-- EASY (8 questions)
('foundation', 'pronouns-detailed', 'beginner', '"This is _____ book."', '["I", "me", "my", "mine"]', 2, 'Possessive adjective = my (before noun). Pattern: my + noun. "mine" = possessive pronoun (no noun after).', 'easy'),

('foundation', 'pronouns-detailed', 'beginner', '"That book is _____."', '["my", "mine", "me", "I"]', 1, 'Possessive pronoun = mine (no noun after). Pattern: is + mine (alone). "my" needs noun: "my book."', 'easy'),

('foundation', 'pronouns-detailed', 'beginner', '"_____ dog is cute."', '["He", "Him", "His", "He''s"]', 2, 'Possessive adjective = his (before noun). Pattern: his + noun. "he/him" = subject/object. "he''s" = he is.', 'easy'),

('foundation', 'pronouns-detailed', 'beginner', '"The blue car is _____."', '["her", "hers", "she", "she''s"]', 1, 'Possessive pronoun = hers (no noun after). Pattern: is + hers. "her" needs noun: "her car."', 'easy'),

('foundation', 'pronouns-detailed', 'beginner', '"_____ house is big."', '["We", "Us", "Our", "Ours"]', 2, 'Possessive adjective = our (before noun). Pattern: our + noun. "ours" = pronoun (no noun). "we/us" = subject/object.', 'easy'),

('foundation', 'pronouns-detailed', 'beginner', '"These toys are _____."', '["their", "theirs", "them", "they"]', 1, 'Possessive pronoun = theirs (no noun after). Pattern: are + theirs. "their" needs noun: "their toys."', 'easy'),

('foundation', 'pronouns-detailed', 'beginner', '"_____ name is Priya."', '["She", "Her", "Hers", "She''s"]', 1, 'Possessive adjective = her (before noun). Pattern: her + noun. "hers" = pronoun (no noun). "she" = subject.', 'easy'),

('foundation', 'pronouns-detailed', 'beginner', '"The cat licked _____ paw."', '["it", "its", "it''s", "itself"]', 1, 'Possessive adjective = its (no apostrophe). Pattern: its + noun. "it''s" = it is. "itself" = reflexive.', 'easy'),

-- MEDIUM (8 questions)
('foundation', 'pronouns-detailed', 'beginner', 'What is wrong? "This is mine book."', '["Use: my instead of mine", "Remove: mine", "Use: me instead of mine", "Nothing wrong"]', 0, 'Possessive adjective before noun = my (not mine). Correct: "This is my book." Mine = pronoun (no noun): "This book is mine."', 'medium'),

('foundation', 'pronouns-detailed', 'beginner', 'Choose correct: "Is this bag _____?"', '["your", "yours", "you", "you''re"]', 1, 'Possessive pronoun (no noun after) = yours. Pattern: is + yours. "your" needs noun: "your bag." "you''re" = you are.', 'medium'),

('foundation', 'pronouns-detailed', 'beginner', 'Error in: "The dog wagged it''s tail."', '["Use: its instead of it''s", "Use: it instead of it''s", "Remove: ''s", "Nothing wrong"]', 0, 'Possessive = its (no apostrophe). "it''s" = it is. Correct: "The dog wagged its tail." Common mistake!', 'medium'),

('foundation', 'pronouns-detailed', 'beginner', 'Arrange: new / their / car / is', '["Their new car is", "Theirs new car is", "Their car new is", "Theirs car new is"]', 0, 'Possessive adjective before noun = their (not theirs). Pattern: Their + adjective + noun + verb. Incomplete sentence (needs ending).', 'medium'),

('foundation', 'pronouns-detailed', 'beginner', 'Which is correct?', '["This pen is my", "This pen is mine", "This pen is me", "This pen is I"]', 1, 'Possessive pronoun (no noun) = mine. Pattern: is + mine. "my" needs noun: "my pen." Correct: "This pen is mine."', 'medium'),

('foundation', 'pronouns-detailed', 'beginner', 'What is the error? "The house is our."', '["Use: ours instead of our", "Add: house after our", "Use: we instead of our", "Nothing wrong"]', 0, 'Possessive pronoun (no noun) = ours (not our). Correct: "The house is ours." "our" needs noun: "our house."', 'medium'),

('foundation', 'pronouns-detailed', 'beginner', 'Rearrange: friends / are / hers / These', '["These are hers friends", "These are her friends", "These friends are hers", "These friends are her"]', 2, 'Possessive pronoun = hers (no noun after). Pattern: These friends + are + hers. "her" = adjective (before noun).', 'medium'),

('foundation', 'pronouns-detailed', 'beginner', 'Choose: "_____ phone is ringing."', '["Your", "Yours", "You", "You''re"]', 0, 'Possessive adjective before noun = your. Pattern: your + noun. "yours" = pronoun (no noun). "you''re" = you are.', 'medium'),

-- HARD (4 questions)
('foundation', 'pronouns-detailed', 'beginner', 'Which is WRONG?', '["This is my book", "That is mine", "The cat licked its paw", "The dog wagged it''s tail"]', 3, '"it''s" = it is (contraction). Possessive = its (no apostrophe). Correct: "The dog wagged its tail."', 'hard'),

('foundation', 'pronouns-detailed', 'beginner', 'Arrange: your / Is / or / this / mine / book', '["Is this your book or mine", "Is this yours book or my", "Is this your book or my", "Is this yours book or mine"]', 0, 'Adjective before noun, pronoun alone. Pattern: your + noun (book) + or + mine (no noun). Correct: "Is this your book or mine."', 'hard'),

('foundation', 'pronouns-detailed', 'beginner', 'Error: "That idea of your is brilliant."', '["Use: yours instead of your", "Use: you instead of your", "Add: idea after your", "Nothing wrong"]', 0, 'After "of" = possessive pronoun. Correct: "That idea of yours is brilliant." Pattern: noun + of + possessive pronoun.', 'hard'),

('foundation', 'pronouns-detailed', 'beginner', 'Which is correct formal writing?', '["The choice is your", "The choice is yours", "The choice is you", "The choice is you''re"]', 1, 'Possessive pronoun (no noun) = yours. Formal/informal both: "The choice is yours." "your" needs noun.', 'hard'),

-- ============================================================================
-- SUBTOPIC 4: Reflexive Pronouns (20 questions)
-- ============================================================================

-- EASY (8 questions)
('foundation', 'pronouns-detailed', 'beginner', '"I did it _____."', '["me", "myself", "my", "mine"]', 1, 'Reflexive pronoun = myself (refers back to subject I). Pattern: I + verb + myself. Action done by and to myself.', 'easy'),

('foundation', 'pronouns-detailed', 'beginner', '"He hurt _____."', '["him", "himself", "his", "he"]', 1, 'Reflexive pronoun = himself (refers back to subject he). Pattern: subject + verb + reflexive. He hurt himself (not someone else).', 'easy'),

('foundation', 'pronouns-detailed', 'beginner', '"She taught _____ Spanish."', '["her", "herself", "hers", "she"]', 1, 'Reflexive pronoun = herself (refers back to subject she). Pattern: She taught herself (learned alone).', 'easy'),

('foundation', 'pronouns-detailed', 'beginner', '"They enjoyed _____."', '["them", "themselves", "their", "theirs"]', 1, 'Reflexive pronoun = themselves (refers back to subject they). Pattern: They enjoyed themselves (had fun).', 'easy'),

('foundation', 'pronouns-detailed', 'beginner', '"We prepared _____ for the exam."', '["us", "ourselves", "our", "ours"]', 1, 'Reflexive pronoun = ourselves (refers back to subject we). Pattern: We prepared ourselves (got ready alone).', 'easy'),

('foundation', 'pronouns-detailed', 'beginner', '"The cat cleaned _____."', '["it", "itself", "its", "it''s"]', 1, 'Reflexive pronoun = itself (refers back to subject cat/it). Pattern: subject + verb + itself. Cat cleaned itself (no one helped).', 'easy'),

('foundation', 'pronouns-detailed', 'beginner', '"You should believe in _____."', '["you", "yourself", "your", "yours"]', 1, 'Reflexive pronoun = yourself (singular) (refers back to subject you). Pattern: believe in + yourself.', 'easy'),

('foundation', 'pronouns-detailed', 'beginner', 'Which is a reflexive pronoun?', '["me", "my", "myself", "mine"]', 2, 'Reflexive pronouns: myself, yourself, himself, herself, itself, ourselves, yourselves, themselves (end in -self/-selves).', 'easy'),

-- MEDIUM (8 questions)
('foundation', 'pronouns-detailed', 'beginner', 'What is wrong? "He talked to himself about it."', '["Use: hisself instead of himself", "Use: him instead of himself", "Use: his instead of himself", "Nothing wrong"]', 3, 'Correct! "himself" = reflexive pronoun (he talked to himself). Never "hisself" (incorrect form).', 'medium'),

('foundation', 'pronouns-detailed', 'beginner', 'Choose correct: "Did you do this _____?"', '["yourself", "yourselves", "you", "your"]', 0, 'Singular you = yourself (one person). Plural you = yourselves (multiple people). Context: singular (Did YOU).', 'medium'),

('foundation', 'pronouns-detailed', 'beginner', 'Error in: "They hurt themself."', '["Use: themselves instead of themself", "Use: them instead of themself", "Use: their instead of themself", "Nothing wrong"]', 0, 'Plural subject (they) = themselves (plural reflexive). Singular = myself/yourself/himself. Correct: "They hurt themselves."', 'medium'),

('foundation', 'pronouns-detailed', 'beginner', 'Arrange: enjoyed / at / We / ourselves / the / party', '["We enjoyed ourselves at the party", "We enjoyed us at the party", "We enjoyed ourself at the party", "We enjoyed ours at the party"]', 0, 'Plural reflexive = ourselves (not ourself). Pattern: We + verb + ourselves. Correct: "We enjoyed ourselves."', 'medium'),

('foundation', 'pronouns-detailed', 'beginner', 'Which is correct?', '["She made it herself", "She made it her", "She made it hers", "She made it she"]', 0, 'Reflexive pronoun for emphasis = herself. Pattern: subject + verb + object + reflexive (emphasis: did it alone).', 'medium'),

('foundation', 'pronouns-detailed', 'beginner', 'What is the error? "The children dressed theirselves."', '["Use: themselves instead of theirselves", "Use: them instead of theirselves", "Use: their instead of theirselves", "Nothing wrong"]', 0, 'Correct form = themselves (not theirselves). Common mistake! Reflexive: myself, yourself, himself, herself, itself, ourselves, yourselves, themselves.', 'medium'),

('foundation', 'pronouns-detailed', 'beginner', 'Rearrange: himself / He / by / lives', '["He lives by himself", "He lives by him", "He lives by his", "He lives by he"]', 0, 'Reflexive after preposition = himself. Idiom: "by + reflexive" = alone. Correct: "He lives by himself."', 'medium'),

('foundation', 'pronouns-detailed', 'beginner', 'Choose: "We should ask _____ why."', '["us", "ourselves", "our", "ours"]', 1, 'Reflexive pronoun = ourselves (subject = we). Pattern: We ask ourselves (ask within our group). Refers back to subject.', 'medium'),

-- HARD (4 questions)
('foundation', 'pronouns-detailed', 'beginner', 'Which is WRONG?', '["I hurt myself", "You cut yourself", "He introduced hisself", "They taught themselves"]', 2, '"hisself" is incorrect! Correct form: himself. Reflexive forms: myself, yourself, himself (NOT hisself), herself, etc.', 'hard'),

('foundation', 'pronouns-detailed', 'beginner', 'Arrange: yourselves / help / to / Please / the / food', '["Please help yourselves to the food", "Please help yourself to the food", "Please help you to the food", "Both A and B correct"]', 3, 'Context: addressing multiple people = yourselves. One person = yourself. "Please help yourself/yourselves" = both can be correct depending on audience!', 'hard'),

('foundation', 'pronouns-detailed', 'beginner', 'Error: "The team enjoyed themself after winning."', '["Use: themselves instead of themself", "Use: them instead of themself", "Use: itself instead of themself", "Both A and C"]', 0, 'Team = plural/collective acting as group = themselves (plural). "themself" is non-standard. Correct: "The team enjoyed themselves."', 'hard'),

('foundation', 'pronouns-detailed', 'beginner', 'Which is correct formal writing?', '["She and myself went shopping", "She and I went shopping", "Her and myself went shopping", "Herself and I went shopping"]', 1, 'Reflexive = ONLY when subject and object are same. Compound subject = use subject pronouns (I). Correct: "She and I went shopping." Never "myself" in subject.', 'hard'),

-- ============================================================================
-- SUBTOPIC 5: Demonstrative Pronouns (20 questions)
-- ============================================================================

-- EASY (8 questions)
('foundation', 'pronouns-detailed', 'beginner', '"_____ is my pen." (near)', '["This", "That", "These", "Those"]', 0, 'Near + singular = this. Far + singular = that. Pattern: This/That is (singular). Near = close to speaker.', 'easy'),

('foundation', 'pronouns-detailed', 'beginner', '"_____ is her house." (far)', '["This", "That", "These", "Those"]', 1, 'Far + singular = that. Near + singular = this. Pattern: That is (singular, far). Far = away from speaker.', 'easy'),

('foundation', 'pronouns-detailed', 'beginner', '"_____ are my books." (near)', '["This", "That", "These", "Those"]', 2, 'Near + plural = these. Far + plural = those. Pattern: These are (plural, near). Near = close to speaker.', 'easy'),

('foundation', 'pronouns-detailed', 'beginner', '"_____ are their cars." (far)', '["This", "That", "These", "Those"]', 3, 'Far + plural = those. Near + plural = these. Pattern: Those are (plural, far). Far = away from speaker.', 'easy'),

('foundation', 'pronouns-detailed', 'beginner', 'Singular demonstrative (near):', '["This", "These", "That", "Those"]', 0, 'This = singular, near. That = singular, far. These = plural, near. Those = plural, far.', 'easy'),

('foundation', 'pronouns-detailed', 'beginner', 'Plural demonstrative (far):', '["This", "That", "These", "Those"]', 3, 'Those = plural, far. These = plural, near. This = singular, near. That = singular, far.', 'easy'),

('foundation', 'pronouns-detailed', 'beginner', '"_____ book is interesting." (near)', '["This", "That", "These", "Those"]', 0, 'Near + singular noun = this. Pattern: This + singular noun. Book = singular, near speaker.', 'easy'),

('foundation', 'pronouns-detailed', 'beginner', '"_____ shoes are new." (far)', '["This", "That", "These", "Those"]', 3, 'Far + plural noun = those. Pattern: Those + plural noun. Shoes = plural, far from speaker.', 'easy'),

-- MEDIUM (8 questions)
('foundation', 'pronouns-detailed', 'beginner', 'What is wrong? "These is my phone."', '["Use: This instead of These", "Use: are instead of is", "Use: Those instead of These", "Both A and B"]', 3, 'Two issues: "These" = plural (needs "are"), OR singular phone needs "This." Correct: "This is my phone" OR "These are my phones."', 'medium'),

('foundation', 'pronouns-detailed', 'beginner', 'Choose correct: "_____ flowers are beautiful." (near)', '["This", "That", "These", "Those"]', 2, 'Near + plural = these. Flowers = plural, near speaker. Pattern: These + plural noun + are.', 'medium'),

('foundation', 'pronouns-detailed', 'beginner', 'Error in: "That are my friends." (far)', '["Use: Those instead of That", "Use: is instead of are", "Use: This instead of That", "Nothing wrong"]', 0, 'Plural (friends) = those (not that). That = singular. Correct: "Those are my friends." Match number!', 'medium'),

('foundation', 'pronouns-detailed', 'beginner', 'Arrange: pens / are / mine / Those', '["Those pens are mine", "Those are pens mine", "That pens are mine", "These pens are mine"]', 0, 'Far + plural = those. Pattern: Those + plural noun + verb. Correct: "Those pens are mine." (context: far).', 'medium'),

('foundation', 'pronouns-detailed', 'beginner', 'Which is correct? (pointing at 1 nearby object)', '["This are mine", "This is mine", "These is mine", "These are mine"]', 1, 'Singular + near = this. Verb = is (singular). Correct: "This is mine." One object, near speaker.', 'medium'),

('foundation', 'pronouns-detailed', 'beginner', 'What is the error? "This books are heavy."', '["Use: These instead of This", "Use: book instead of books", "Use: is instead of are", "Both A and B"]', 0, 'Plural noun (books) = these (not this). Correct: "These books are heavy." This = singular only.', 'medium'),

('foundation', 'pronouns-detailed', 'beginner', 'Rearrange: were / days / those / hard', '["Those days were hard", "Those were days hard", "That days were hard", "These days were hard"]', 0, 'Far + plural = those. Pattern: Those + noun + verb. Correct: "Those days were hard." (referring to past = far).', 'medium'),

('foundation', 'pronouns-detailed', 'beginner', 'Choose: "_____ person is kind." (far)', '["This", "These", "That", "Those"]', 2, 'Far + singular = that. Person = singular, far from speaker. Pattern: That + singular noun.', 'medium'),

-- HARD (4 questions)
('foundation', 'pronouns-detailed', 'beginner', 'Which is WRONG?', '["This is my bag", "These are my bags", "Those are their cars", "That are his books"]', 3, 'Plural (books) = those (not that). Correct: "Those are his books." That = singular only.', 'hard'),

('foundation', 'pronouns-detailed', 'beginner', 'Arrange: here / This / and / that / is / there / is', '["This is here and that is there", "This is there and that is here", "These is here and those is there", "These are here and those are there"]', 0, 'This = near/here (singular). That = far/there (singular). Pattern: This is here + that is there. Natural contrast.', 'hard'),

('foundation', 'pronouns-detailed', 'beginner', 'Error: "Those times was difficult."', '["Use: were instead of was", "Use: That instead of Those", "Use: is instead of was", "Both A and B"]', 0, 'Plural (those times) = were (not was). Correct: "Those times were difficult." Plural subject + plural verb.', 'hard'),

('foundation', 'pronouns-detailed', 'beginner', 'Which is correct formal writing?', '["This are the facts", "These are the facts", "This is the facts", "These is the facts"]', 1, 'Plural noun (facts) = these. Plural verb = are. Correct: "These are the facts." Match number throughout.', 'hard');

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

SELECT 'Pronouns Detailed Question Count Check' as check_name;
SELECT COUNT(*) as total_questions FROM english_questions WHERE topic_id = 'pronouns-detailed';

-- Expected output: 100 questions
-- Breakdown: 20 per subtopic × 5 subtopics = 100
