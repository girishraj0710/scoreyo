-- Phase 2, Topic 6: "I'm Not Working" - Present Continuous Negative
-- 30 questions (12 easy, 12 medium, 6 hard)
-- Pattern-based, beginner-friendly, Indian context

INSERT INTO english_questions (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty) VALUES

-- EASY QUESTIONS (12) - Basic negative structure
('foundation', 'present-continuous-negative', 'beginner', 'I _____ not working today.', '["am", "is", "are", "be"]', 0, 'Pattern: I + am + not + [verb + ing]. Use "am not" with I. Full form: I am not working (or short: I''m not working).', 'easy'),

('foundation', 'present-continuous-negative', 'beginner', 'She _____ not coming to the party.', '["am", "is", "are", "be"]', 1, 'Pattern: She + is + not + [verb + ing]. Use "is not" (or "isn''t") with she. Come → coming (drop e + ing).', 'easy'),

('foundation', 'present-continuous-negative', 'beginner', 'They _____ not listening.', '["am", "is", "are", "be"]', 2, 'Pattern: They + are + not + [verb + ing]. Use "are not" (or "aren''t") with they. Listen → listening.', 'easy'),

('foundation', 'present-continuous-negative', 'beginner', 'He _____ not eating right now.', '["am", "is", "are", "be"]', 1, 'Pattern: He + is + not + [verb + ing]. Use "is not" with he. Eat → eating (just add ing).', 'easy'),

('foundation', 'present-continuous-negative', 'beginner', 'We _____ not going anywhere.', '["am", "is", "are", "be"]', 2, 'Pattern: We + are + not + [verb + ing]. Use "are not" with we. Go → going (just add ing).', 'easy'),

('foundation', 'present-continuous-negative', 'beginner', 'I am not _____ to you.', '["talk", "talks", "talking", "talked"]', 2, 'Pattern: I + am + not + [verb + ing]. After "not", still use verb-ing. Talk → talking.', 'easy'),

('foundation', 'present-continuous-negative', 'beginner', 'It _____ not raining anymore.', '["am", "is", "are", "be"]', 1, 'Pattern: It + is + not + [verb + ing]. Use "is not" with it. Rain → raining. "Anymore" = has stopped.', 'easy'),

('foundation', 'present-continuous-negative', 'beginner', 'You _____ not helping me.', '["am", "is", "are", "be"]', 2, 'Pattern: You + are + not + [verb + ing]. Use "are not" with you. Help → helping.', 'easy'),

('foundation', 'present-continuous-negative', 'beginner', 'She is not _____ her phone.', '["use", "uses", "using", "used"]', 2, 'Pattern: She + is + not + [verb + ing]. After "not", use verb-ing. Use → drop e → using.', 'easy'),

('foundation', 'present-continuous-negative', 'beginner', 'They _____ not studying now.', '["am", "is", "are", "be"]', 2, 'Pattern: They + are + not + [verb + ing]. Use "are not" with they. Study → studying.', 'easy'),

('foundation', 'present-continuous-negative', 'beginner', 'My brother _____ not sleeping.', '["am", "is", "are", "be"]', 1, 'Pattern: My brother = he + is + not + [verb + ing]. Use "is not" with singular nouns. Sleep → sleeping.', 'easy'),

('foundation', 'present-continuous-negative', 'beginner', 'We are not _____ TV.', '["watch", "watches", "watching", "watched"]', 2, 'Pattern: We + are + not + [verb + ing]. After "not", use verb-ing. Watch → watching.', 'easy'),

-- MEDIUM QUESTIONS (12) - Contractions and real contexts
('foundation', 'present-continuous-negative', 'beginner', 'What is the short form of "I am not"?', '["I amn''t", "I''m not", "I''mn''t", "I not"]', 1, 'Contraction: I am not → I''m not (only this form exists). No "amn''t" in English. Other contractions: She isn''t, They aren''t. BUT "I''m not" (not "I ain''t" - that''s slang).', 'medium'),

('foundation', 'present-continuous-negative', 'beginner', 'Arrange correctly: now / not / He / working / is', '["He is not working now", "He not is working now", "Not he is working now", "He working is not now"]', 0, 'Pattern: He + is + not + [verb + ing] + now. Order: subject + be + not + verb-ing + time. "Now" usually at end.', 'medium'),

('foundation', 'present-continuous-negative', 'beginner', 'What is wrong? "She not is coming today."', '["Say She is not coming", "Say She isn''t not coming", "Say She are not coming", "Nothing wrong"]', 0, 'Word order error! Pattern: She + is + NOT (after is). Correct: "She is not coming today." Not comes AFTER is/am/are, never before.', 'medium'),

('foundation', 'present-continuous-negative', 'beginner', 'On the phone, saying you can talk:', '["I not am driving now.", "I am not driving now.", "I not driving now.", "I amn''t driving now."]', 1, 'Pattern: I + am + not + [verb + ing] + now. Correct word order: am NOT. Natural: "I am not driving now" or "I''m not driving now."', 'medium'),

('foundation', 'present-continuous-negative', 'beginner', 'Choose the sentence with correct contraction:', '["They''re not listening.", "They''ren''t listening.", "They not''re listening.", "They not listening."]', 0, 'Contraction: They are not → They''re not OR They aren''t (both correct). Never "they''ren''t". Most common: "They''re not listening."', 'medium'),

('foundation', 'present-continuous-negative', 'beginner', 'What is the error? "We isn''t coming to the meeting."', '["Use aren''t instead of isn''t", "Use am not instead of isn''t", "Use not is instead of isn''t", "Nothing wrong"]', 0, 'Pattern error: We = are (not is). Correct: "We aren''t coming" or "We are not coming." Only he/she/it use "isn''t".', 'medium'),

('foundation', 'present-continuous-negative', 'beginner', 'Rearrange: messages / replying / not / I / to / am', '["I am not replying to messages", "I am not to replying messages", "Not I am replying to messages", "I not am replying to messages"]', 0, 'Pattern: I + am + not + [verb + ing] + to + [thing]. Phrasal verb "reply to" stays together. Order: I am not replying to messages.', 'medium'),

('foundation', 'present-continuous-negative', 'beginner', 'At work, explaining your situation:', '["I don''t working on that project.", "I am not working on that project.", "I not working on that project.", "I isn''t working on that project."]', 1, 'Pattern: I + am + not + [verb + ing]. Present continuous negative needs am/is/are + not. WRONG: "don''t working" (mixing simple + continuous). Correct: "I am not working on that project."', 'medium'),

('foundation', 'present-continuous-negative', 'beginner', 'Choose the natural sentence:', '["He isn''t eating anything.", "He not is eating anything.", "He don''t eating anything.", "He eating not anything."]', 0, 'Pattern: He + isn''t + [verb + ing] + [thing]. Natural contraction: "isn''t" (is + not). Correct: "He isn''t eating anything."', 'medium'),

('foundation', 'present-continuous-negative', 'beginner', 'What is wrong? "They not are playing cricket."', '["Say They are not playing", "Say They is not playing", "Say They don''t playing", "Nothing wrong"]', 0, 'Word order error! Pattern: They + are + NOT (after are). Correct: "They are not playing cricket." Not comes after are, never before.', 'medium'),

('foundation', 'present-continuous-negative', 'beginner', 'Arrange correctly: listening / You / not / me / are / to', '["You are not listening to me", "You not are listening to me", "Not you are listening to me", "You are to not listening me"]', 0, 'Pattern: You + are + not + [verb + ing] + to + [person]. Phrasal verb "listen to" = pay attention. Order: You are not listening to me.', 'medium'),

('foundation', 'present-continuous-negative', 'beginner', 'Choose the correct contraction:', '["She''s not coming.", "She not''s coming.", "She''sn''t coming.", "She not coming."]', 0, 'Contraction: She is not → She''s not OR She isn''t (both correct). Never "she''sn''t" or "not''s". Common: "She''s not coming" or "She isn''t coming."', 'medium'),

-- HARD QUESTIONS (6) - Double negatives, formal writing
('foundation', 'present-continuous-negative', 'beginner', 'Which is correct in formal business writing?', '["We''re not attending the meeting.", "We are not attending the meeting.", "We aren''t attending the meeting.", "We not attending the meeting."]', 1, 'In formal writing, avoid contractions. Use full forms: are not (not "aren''t" or "''re not"). Pattern: We + are + not + [verb + ing]. Professional: "We are not attending the meeting."', 'hard'),

('foundation', 'present-continuous-negative', 'beginner', 'Find the error: "I am not understanding nothing." (Double negative)', '["Say I am not understanding anything", "Say I am understanding nothing", "Remove not", "No error"]', 0, 'Double negative error! "Not" + "nothing" = wrong. Two fixes: 1) "I am not understanding anything" (not + anything). 2) "I am understanding nothing" (no "not"). Also, "understand" shouldn''t use continuous - say "I don''t understand anything."', 'hard'),

('foundation', 'present-continuous-negative', 'beginner', 'Arrange correctly: moment / not / at / the / working / She / is', '["She is not working at the moment", "She is not at the moment working", "At the moment she is not working", "She not is working at the moment"]', 0, 'Pattern: She + is + not + [verb + ing] + at the moment. "At the moment" = now. Can also start: "At the moment, she is not working." Word order: is NOT (not "not is").', 'hard'),

('foundation', 'present-continuous-negative', 'beginner', 'What is wrong? "He isn''t never coming to meetings."', '["Say He never comes OR He isn''t coming", "Remove isn''t", "Remove never", "Nothing wrong"]', 0, 'Double negative + tense mixing! "Isn''t" + "never" = wrong. Fixes: 1) "He never comes to meetings" (present simple for habit). 2) "He isn''t coming to the meeting" (continuous for one time, no "never"). Never mix "not" + "never".', 'hard'),

('foundation', 'present-continuous-negative', 'beginner', 'Which sentence is most natural when declining an offer right now?', '["I don''t eat right now.", "I am not eating right now.", "I not eating right now.", "I am not eat right now."]', 1, 'Pattern: I + am + not + [verb + ing] + right now. Present continuous for action happening (or NOT happening) at this moment. Natural refusal: "I am not eating right now" (= not hungry now). "I don''t eat" = general habit (wrong context).', 'hard'),

('foundation', 'present-continuous-negative', 'beginner', 'Find the error: "They aren''t doing nothing today."', '["Say They aren''t doing anything", "Say They are doing nothing", "Remove aren''t", "No error"]', 0, 'Double negative! "Aren''t" + "nothing" = wrong. Two fixes: 1) "They aren''t doing anything today" (not + anything). 2) "They are doing nothing today" (no "not", just "nothing"). Rule: Not + nothing = double negative (incorrect in standard English).', 'hard');

-- Verify insertion
SELECT COUNT(*) as total_inserted FROM english_questions WHERE topic_id = 'present-continuous-negative';
