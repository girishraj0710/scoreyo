#!/usr/bin/env python3
"""Generate remaining Phase 3 files: phrasal-verbs (80Q) and idioms (50Q)"""

# Phrasal Verbs (80Q) - 20Q each subtopic
phrasal_verbs_sql = '''-- ============================================================================
-- FOUNDATION PATH: Phrasal Verbs (COMPLETE)
-- Topic ID: phrasal-verbs
-- Level: intermediate (A2)
-- Total: 80 questions covering ALL 4 subtopics
-- Distribution: 32 easy, 32 medium, 16 hard (40/40/20)
-- ============================================================================

INSERT INTO english_questions (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty) VALUES

-- Common Phrasal Verbs (20Q: 8 easy, 8 medium, 4 hard)
('foundation', 'phrasal-verbs', 'intermediate', '"Turn off" means:', '["stop a device", "rotate something", "refuse an offer", "become angry"]', 0, 'Turn off = stop/switch off a device. "Turn off the lights." Pattern: verb + off = stop!', 'easy'),
('foundation', 'phrasal-verbs', 'intermediate', '"Look for" means:', '["search", "see", "watch", "appear"]', 0, 'Look for = search/try to find. "I''m looking for my keys." Pattern: look + for = search!', 'easy'),
('foundation', 'phrasal-verbs', 'intermediate', '"Get up" means:', '["rise from bed", "receive something", "become angry", "understand"]', 0, 'Get up = rise from bed/sitting. "I get up at 7 AM." Pattern: get + up = rise!', 'easy'),
('foundation', 'phrasal-verbs', 'intermediate', '"Put on" means:', '["wear clothes", "delay", "extinguish", "tolerate"]', 0, 'Put on = wear/dress in. "Put on your coat." Pattern: put + on = wear!', 'easy'),
('foundation', 'phrasal-verbs', 'intermediate', '"Take off" means:', '["remove clothes", "accept", "tolerate", "understand"]', 0, 'Take off = remove (clothes/shoes). Also: plane leaves ground. "Take off your shoes." Pattern: take + off = remove!', 'easy'),
('foundation', 'phrasal-verbs', 'intermediate', '"Give up" means:', '["stop trying", "distribute", "vomit", "surrender"]', 0, 'Give up = stop trying/quit. "Don''t give up!" Pattern: give + up = quit!', 'easy'),
('foundation', 'phrasal-verbs', 'intermediate', '"Come back" means:', '["return", "arrive", "approach", "remember"]', 0, 'Come back = return to place. "Come back home." Pattern: come + back = return!', 'easy'),
('foundation', 'phrasal-verbs', 'intermediate', '"Sit down" means:', '["take a seat", "refuse", "relax", "wait"]', 0, 'Sit down = take a seat. "Please sit down." Pattern: sit + down = be seated!', 'easy'),

('foundation', 'phrasal-verbs', 'intermediate', '"Run into" means:', '["meet by chance", "enter quickly", "crash", "escape"]', 0, 'Run into = meet unexpectedly. "I ran into an old friend." Pattern: run + into = unexpected meeting!', 'medium'),
('foundation', 'phrasal-verbs', 'intermediate', '"Look after" means:', '["take care of", "search", "follow", "admire"]', 0, 'Look after = take care of. "Look after your sister." Pattern: look + after = care for!', 'medium'),
('foundation', 'phrasal-verbs', 'intermediate', '"Work out" means:', '["exercise OR solve", "leave work", "succeed", "fail"]', 0, 'Work out = exercise OR solve a problem. "Work out at gym" / "Work out a solution." Two meanings! Pattern: context dependent!', 'medium'),
('foundation', 'phrasal-verbs', 'intermediate', '"Find out" means:', '["discover information", "search", "lose", "create"]', 0, 'Find out = discover/learn information. "Find out the truth." Pattern: find + out = discover facts!', 'medium'),
('foundation', 'phrasal-verbs', 'intermediate', '"Call off" means:', '["cancel", "telephone", "shout", "visit"]', 0, 'Call off = cancel. "Call off the meeting." Pattern: call + off = cancel!', 'medium'),
('foundation', 'phrasal-verbs', 'intermediate', '"Bring up" means:', '["raise a topic OR raise children", "carry upwards", "vomit", "arrive"]', 0, 'Bring up = mention a topic OR raise children. "Bring up the issue" / "Bring up kids." Two meanings! Pattern: context dependent!', 'medium'),
('foundation', 'phrasal-verbs', 'intermediate', '"Hold on" means:', '["wait", "grip", "continue", "stop"]', 0, 'Hold on = wait a moment. "Hold on, I''m coming!" Pattern: hold + on = wait!', 'medium'),
('foundation', 'phrasal-verbs', 'intermediate', '"Show up" means:', '["appear/arrive", "display", "prove", "expose"]', 0, 'Show up = appear/arrive. "He didn''t show up." Pattern: show + up = arrive!', 'medium'),

('foundation', 'phrasal-verbs', 'intermediate', '"Break down" has multiple meanings. Choose the correct one: "The car broke down."', '["stopped working", "collapsed emotionally", "analyzed details", "demolished"]', 0, 'Break down = stop functioning (machines). Also: emotional collapse, analyze. Pattern: machine context = malfunction!', 'hard'),
('foundation', 'phrasal-verbs', 'intermediate', '"Get over" means:', '["recover from illness/problem", "cross over", "receive", "understand"]', 0, 'Get over = recover from. "Get over a cold" / "Get over a breakup." Pattern: get + over = recover!', 'hard'),
('foundation', 'phrasal-verbs', 'intermediate', '"Make up" has multiple meanings. Choose: "They made up after the fight."', '["reconciled", "invented", "applied cosmetics", "compensated"]', 0, 'Make up = reconcile/become friends again. Also: invent story, apply makeup, compensate. Pattern: relationship context = reconcile!', 'hard'),
('foundation', 'phrasal-verbs', 'intermediate', '"Carry on" means:', '["continue", "transport", "behave badly", "manage"]', 0, 'Carry on = continue. "Carry on working." Pattern: carry + on = continue!', 'hard'),

-- Separable vs Inseparable (20Q: 8 easy, 8 medium, 4 hard)
('foundation', 'phrasal-verbs', 'intermediate', 'Which is correct? (turn off the TV)', '["Turn off the TV OR Turn the TV off", "Only: Turn off the TV", "Only: Turn the TV off", "Both wrong"]', 0, 'SEPARABLE: "turn off" can split. "Turn off TV" = "Turn TV off" (both correct). Pattern: separable phrasal verbs allow noun between!', 'easy'),
('foundation', 'phrasal-verbs', 'intermediate', 'Which is correct? (look after the baby)', '["Only: Look after the baby", "Look after the baby OR Look the baby after", "Only: Look the baby after", "Both wrong"]', 0, 'INSEPARABLE: "look after" cannot split. Only "Look after baby" is correct. Pattern: inseparable must stay together!', 'easy'),
('foundation', 'phrasal-verbs', 'intermediate', 'Which is correct? (take off your shoes)', '["Take off your shoes OR Take your shoes off", "Only: Take off your shoes", "Only: Take your shoes off", "Both wrong"]', 0, 'SEPARABLE: "take off" can split. Both forms correct. Pattern: separable phrasal verbs flexible!', 'easy'),
('foundation', 'phrasal-verbs', 'intermediate', 'Which is correct? (run into my friend)', '["Only: I ran into my friend", "I ran into my friend OR I ran my friend into", "Only: I ran my friend into", "Both wrong"]', 0, 'INSEPARABLE: "run into" cannot split. Only "ran into friend" correct. Pattern: inseparable fixed order!', 'easy'),
('foundation', 'phrasal-verbs', 'intermediate', 'Which is correct? (put on a coat)', '["Put on a coat OR Put a coat on", "Only: Put on a coat", "Only: Put a coat on", "Both wrong"]', 0, 'SEPARABLE: "put on" can split. Both correct. Pattern: separable allows split!', 'easy'),
('foundation', 'phrasal-verbs', 'intermediate', 'Which is correct? (look for my keys)', '["Only: Look for my keys", "Look for my keys OR Look my keys for", "Only: Look my keys for", "Both wrong"]', 0, 'INSEPARABLE: "look for" cannot split. Only "look for keys" correct. Pattern: inseparable stays together!', 'easy'),
('foundation', 'phrasal-verbs', 'intermediate', 'Which is correct? (give up smoking)', '["Only: Give up smoking", "Give up smoking OR Give smoking up", "Only: Give smoking up", "Both wrong"]', 0, 'INSEPARABLE: "give up" with gerund (-ing) is inseparable. Only "give up smoking" correct. Pattern: phrasal verb + gerund = inseparable!', 'easy'),
('foundation', 'phrasal-verbs', 'intermediate', 'Which is correct? (turn on the light)', '["Turn on the light OR Turn the light on", "Only: Turn on the light", "Only: Turn the light on", "Both wrong"]', 0, 'SEPARABLE: "turn on" can split. Both correct. Pattern: separable = flexible position!', 'easy'),

('foundation', 'phrasal-verbs', 'intermediate', 'With PRONOUN, which is correct? (turn it off)', '["Only: Turn it off", "Turn off it OR Turn it off", "Only: Turn off it", "Both wrong"]', 0, 'PRONOUN RULE: With pronoun, MUST separate! "Turn it off" (correct), NOT "Turn off it." Pattern: pronoun = must split!', 'medium'),
('foundation', 'phrasal-verbs', 'intermediate', 'Error in: "I''m looking my keys for."', '["Use: looking for my keys (inseparable)", "Nothing wrong", "Remove: for", "Use: my for keys"]', 0, 'INSEPARABLE: "look for" cannot split! Correct: "looking for my keys." Pattern: inseparable phrasal verbs never split!', 'medium'),
('foundation', 'phrasal-verbs', 'intermediate', 'With pronoun, which is correct? (pick up him)', '["Only: Pick him up", "Pick up him OR Pick him up", "Only: Pick up him", "Both wrong"]', 0, 'PRONOUN RULE: Must split! "Pick him up" (correct), NOT "Pick up him." Pattern: pronoun forces separation!', 'medium'),
('foundation', 'phrasal-verbs', 'intermediate', 'Which is SEPARABLE?', '["turn off", "look after", "run into", "look for"]', 0, 'Turn off = separable ("turn it off" / "turn TV off"). Look after/run into/look for = inseparable. Pattern: identify separable verb!', 'medium'),
('foundation', 'phrasal-verbs', 'intermediate', 'Error in: "Please put your coat on it."', '["Use: put it on (pronoun between)", "Nothing wrong", "Remove: it", "Use: on it put"]', 0, 'PRONOUN: "put it on" (correct). Can''t say "put on it." Pattern: pronoun = must separate!', 'medium'),
('foundation', 'phrasal-verbs', 'intermediate', 'Which is INSEPARABLE?', '["look after", "turn off", "take off", "put on"]', 0, 'Look after = inseparable ("look after baby," NOT "look baby after"). Others = separable. Pattern: identify inseparable verb!', 'medium'),
('foundation', 'phrasal-verbs', 'intermediate', 'Correct: "I need to ___ this problem ___." (work out)', '["work out this problem OR work this problem out", "only: work out this problem", "only: work this problem out", "Both wrong"]', 0, 'SEPARABLE: "work out" can split. Both forms correct! Pattern: separable = flexible!', 'medium'),
('foundation', 'phrasal-verbs', 'intermediate', 'With long noun phrase: "Turn ___ the old broken TV ___."', '["Only: Turn off the old broken TV (don''t split)", "Either position fine", "Must split", "Can''t use"]', 0, 'LONG OBJECT: Don''t split with long noun phrase (sounds awkward). "Turn off the old broken TV" (better than "Turn the old broken TV off"). Pattern: long object = keep together!', 'medium'),

('foundation', 'phrasal-verbs', 'intermediate', 'Three-word phrasal verb: "I can''t ___ my noisy neighbor." (put up with)', '["Only: put up with my noisy neighbor", "Can split: put my noisy neighbor up with", "Can split: put up my noisy neighbor with", "All positions work"]', 0, 'THREE-WORD = INSEPARABLE! "Put up with" never splits. Pattern: 3-word phrasal verbs are always inseparable!', 'hard'),
('foundation', 'phrasal-verbs', 'intermediate', 'Error: "I''ll think the offer over it."', '["Use: think it over (pronoun between)", "Nothing wrong", "Use: think over it", "Remove: it"]', 0, 'PRONOUN ERROR: "think it over" (correct). Pronoun must go between verb and particle. Pattern: pronoun = must separate!', 'hard'),
('foundation', 'phrasal-verbs', 'intermediate', 'Which can NEVER split?', '["look forward to", "turn on", "take off", "give up"]', 0, 'Look forward to = 3-word phrasal verb (always inseparable). Turn on/take off = separable, give up = usually inseparable. Pattern: 3-word = never splits!', 'hard'),
('foundation', 'phrasal-verbs', 'intermediate', 'Correct both: Noun AND pronoun (fill in the form / fill it in)', '["Fill in the form; Fill it in", "Fill the form in; Fill in it", "Fill in the form; Fill in it", "Both must split"]', 0, 'Noun = flexible ("fill in form" OR "fill form in"). Pronoun = must split ("fill it in"). Pattern: noun flexible, pronoun must split!', 'hard'),

-- Multiple Meanings (20Q: 8 easy, 8 medium, 4 hard)
('foundation', 'phrasal-verbs', 'intermediate', '"Go off" can mean: alarm sound OR food spoil. Choose: "The milk went off."', '["spoiled", "alarm rang", "exploded", "left"]', 0, 'Context: milk = food. "Went off" = became bad/spoiled. If alarm: "went off" = rang. Pattern: context determines meaning!', 'easy'),
('foundation', 'phrasal-verbs', 'intermediate', '"Turn up" can mean: arrive OR increase volume. Choose: "Turn up the music."', '["increase volume", "arrive", "refuse", "discover"]', 0, 'Context: music = volume. "Turn up" = make louder. If person: "turned up" = arrived. Pattern: object determines meaning!', 'easy'),
('foundation', 'phrasal-verbs', 'intermediate', '"Take in" can mean: understand OR deceive. Choose: "I didn''t take in what he said."', '["understand", "deceive", "accept", "shorten"]', 0, 'Context: what he said = information. "Take in" = understand. Also: deceive ("taken in by scam"), clothes ("take in a dress"). Pattern: context key!', 'easy'),
('foundation', 'phrasal-verbs', 'intermediate', '"Pick up" can mean: collect OR learn. Choose: "I picked up Spanish quickly."', '["learned", "collected person", "lifted", "improved"]', 0, 'Context: Spanish = language. "Picked up" = learned informally. Also: collect person/thing, lift object. Pattern: object determines meaning!', 'easy'),
('foundation', 'phrasal-verbs', 'intermediate', '"Come across" can mean: find OR seem. Choose: "I came across an old photo."', '["found", "seemed", "visited", "met"]', 0, 'Context: found by chance. Also: "She comes across as confident" = seems. Pattern: "come across + noun" = find; "come across as + adjective" = seem!', 'easy'),
('foundation', 'phrasal-verbs', 'intermediate', '"Check out" can mean: investigate OR leave hotel. Choose: "We check out at noon."', '["leave hotel", "investigate", "look at", "verify"]', 0, 'Context: hotel. "Check out" = leave hotel. Also: investigate ("check out this website"), look at person. Pattern: location context!', 'easy'),
('foundation', 'phrasal-verbs', 'intermediate', '"Break up" can mean: end relationship OR stop fight. Choose: "They broke up last year."', '["ended relationship", "stopped fight", "divided", "separated items"]', 0, 'Context: couple. "Broke up" = ended relationship. Also: stop fight, divide items, break into pieces. Pattern: subject context!', 'easy'),
('foundation', 'phrasal-verbs', 'intermediate', '"Fall out" can mean: argue OR hair loss. Choose: "His hair is falling out."', '["losing hair", "argued", "dropped", "failed"]', 0, 'Context: hair. "Falling out" = losing hair. If people: "fell out" = had argument. Pattern: subject determines meaning!', 'easy'),

('foundation', 'phrasal-verbs', 'intermediate', '"Get on" meanings: board vehicle OR have good relationship. Choose: "They get on well."', '["have good relationship", "board vehicle", "continue", "succeed"]', 0, 'Context: people + well. "Get on" = have good relationship. If vehicle: "get on bus" = board. Pattern: subject + "well" = relationship!', 'medium'),
('foundation', 'phrasal-verbs', 'intermediate', '"Set up" meanings: arrange OR trick. Choose: "He was set up by criminals."', '["tricked/framed", "arranged", "established", "assembled"]', 0, 'Context: "by criminals." "Set up" = tricked/framed. Also: arrange meeting, establish business. Pattern: passive + "by" = tricked!', 'medium'),
('foundation', 'phrasal-verbs', 'intermediate', '"Take off" meanings: remove OR succeed. Choose: "His career took off."', '["became successful", "removed", "departed by plane", "imitated"]', 0, 'Context: career. "Took off" = became very successful. Also: remove clothes, plane departs, imitate person. Pattern: career/business context = success!', 'medium'),
('foundation', 'phrasal-verbs', 'intermediate', '"Put off" meanings: postpone OR discourage. Choose: "The smell put me off."', '["discouraged/disgusted", "postponed", "extinguished", "wore"]', 0, 'Context: smell + me. "Put off" = made me lose interest/disgusted. Also: postpone ("put off meeting"). Pattern: subject + personal pronoun = discourage!', 'medium'),
('foundation', 'phrasal-verbs', 'intermediate', '"Stand up" meanings: rise OR fail to meet. Choose: "He stood me up."', '["didn''t come to meeting/date", "rose from seat", "defended", "tolerated"]', 0, 'Context: "me." "Stood up" = didn''t show up for date/meeting. Also: rise from seat, defend. Pattern: personal pronoun object = failed to meet!', 'medium'),
('foundation', 'phrasal-verbs', 'intermediate', '"Hang on" meanings: wait OR persist. Choose: "Hang on, I need to check."', '["wait", "persist/continue", "grip", "depend"]', 0, 'Context: request. "Hang on" = wait a moment. Also: continue trying ("hang on to hope"), grip. Pattern: imperative = wait!', 'medium'),
('foundation', 'phrasal-verbs', 'intermediate', '"Blow up" meanings: explode OR inflate OR lose temper. Choose: "The building blew up."', '["exploded", "inflated balloon", "lost temper", "enlarged photo"]', 0, 'Context: building. "Blew up" = exploded. Also: inflate ("blow up balloon"), lose temper, enlarge photo. Pattern: building context = explode!', 'medium'),
('foundation', 'phrasal-verbs', 'intermediate', '"Let down" meanings: disappoint OR lengthen. Choose: "I was let down by my friend."', '["disappointed", "lengthened clothes", "lowered", "released"]', 0, 'Context: by friend (emotional). "Let down" = disappointed. Also: lengthen clothes, lower object. Pattern: emotional context = disappoint!', 'medium'),

('foundation', 'phrasal-verbs', 'intermediate', 'Three meanings: "Take in" = understand, deceive, OR shorten clothes. Choose: "The tailor took in my pants."', '["shortened clothes", "understood", "deceived", "accepted boarder"]', 0, 'Context: tailor + clothes. "Took in" = made smaller/shortened. Three meanings: understand info, deceive person, alter clothes. Pattern: tailor context = shorten!', 'hard'),
('foundation', 'phrasal-verbs', 'intermediate', 'Multiple meanings: "Run out" = finish supply OR expire. Choose: "My passport runs out next month."', '["expires", "finishes supply", "escapes", "manages"]', 0, 'Context: passport + time. "Runs out" = expires/becomes invalid. If supplies: "ran out of milk" = finished. Pattern: document + time = expire!', 'hard'),
('foundation', 'phrasal-verbs', 'intermediate', 'Four meanings: "Get by" = manage, pass, survive financially, be acceptable. Choose: "I can get by on $1000/month."', '["survive financially", "manage task", "pass obstacle", "be acceptable"]', 0, 'Context: money/month. "Get by" = survive on limited money. Four meanings! Pattern: on + money = financial survival!', 'hard'),
('foundation', 'phrasal-verbs', 'intermediate', 'Three meanings: "Go through" = experience, examine, use up. Choose: "She went through all her savings."', '["used up completely", "experienced difficulty", "examined carefully", "passed through"]', 0, 'Context: savings. "Went through" = used up/spent completely. Also: experience ("went through divorce"), examine. Pattern: through + resources = use up!', 'hard'),

-- Idiom-like Phrasal Verbs (20Q: 8 easy, 8 medium, 4 hard)
('foundation', 'phrasal-verbs', 'intermediate', '"Catch on" means: (idiom-like)', '["understand", "capture", "attach", "grab"]', 0, 'Catch on = understand (idiom). "I don''t catch on" = I don''t understand. Pattern: catch + on = comprehend (not literal catching)!', 'easy'),
('foundation', 'phrasal-verbs', 'intermediate', '"Show off" means: (idiom-like)', '["boast/display proudly", "demonstrate", "reveal", "guide"]', 0, 'Show off = boast/display abilities to impress. "Stop showing off!" Pattern: show + off = brag (not literal showing)!', 'easy'),
('foundation', 'phrasal-verbs', 'intermediate', '"Let off" means: (idiom-like)', '["excuse from punishment", "release", "fire weapon", "allow to exit"]', 0, 'Let off = excuse from punishment. "Let off with warning." Also: release gas, fire weapon. Pattern: let + off = forgive punishment!', 'easy'),
('foundation', 'phrasal-verbs', 'intermediate', '"Take after" means: (idiom-like)', '["resemble family member", "pursue", "care for", "remove following"]', 0, 'Take after = resemble/be like (parent/relative). "He takes after his father." Pattern: take + after = inherited similarity!', 'easy'),
('foundation', 'phrasal-verbs', 'intermediate', '"Fall for" means: (idiom-like)', '["fall in love OR believe trick", "trip over", "decrease", "support"]', 0, 'Fall for = fall in love OR believe a lie. "Fall for someone" / "Fall for a scam." Pattern: fall + for = emotional/deception!', 'easy'),
('foundation', 'phrasal-verbs', 'intermediate', '"Get away with" means: (idiom-like)', '["escape punishment", "vacation", "remove", "steal"]', 0, 'Get away with = escape punishment for wrongdoing. "You won''t get away with this!" Pattern: idiom = avoid consequences!', 'easy'),
('foundation', 'phrasal-verbs', 'intermediate', '"Come up with" means: (idiom-like)', '["produce idea", "approach", "vomit", "meet"]', 0, 'Come up with = produce/think of (idea/solution). "Come up with a plan." Pattern: idiom = create idea!', 'easy'),
('foundation', 'phrasal-verbs', 'intermediate', '"Look up to" means: (idiom-like)', '["respect/admire", "search above", "visit", "raise eyes"]', 0, 'Look up to = respect/admire someone. "I look up to my teacher." Pattern: idiom = admiration (not literal looking up)!', 'easy'),

('foundation', 'phrasal-verbs', 'intermediate', '"Put up with" means: (idiom-like)', '["tolerate", "accommodate guest", "construct", "display"]', 0, 'Put up with = tolerate/endure something annoying. "I can''t put up with noise." Pattern: 3-word idiom = tolerate!', 'medium'),
('foundation', 'phrasal-verbs', 'intermediate', '"Do away with" means: (idiom-like)', '["abolish/eliminate", "leave with", "finish", "store"]', 0, 'Do away with = abolish/get rid of. "Do away with old rules." Pattern: 3-word idiom = eliminate!', 'medium'),
('foundation', 'phrasal-verbs', 'intermediate', '"Look down on" means: (idiom-like)', '["regard as inferior", "look below", "supervise", "search down"]', 0, 'Look down on = regard as inferior/despise. "Don''t look down on others." Pattern: 3-word idiom = feel superior!', 'medium'),
('foundation', 'phrasal-verbs', 'intermediate', '"Go along with" means: (idiom-like)', '["agree/accept", "accompany", "proceed", "match"]', 0, 'Go along with = agree/accept idea. "I''ll go along with your plan." Pattern: 3-word idiom = agree!', 'medium'),
('foundation', 'phrasal-verbs', 'intermediate', '"Run out of" means: (idiom-like)', '["have no more supply", "exit running", "escape from", "manage"]', 0, 'Run out of = exhaust supply. "We ran out of milk." Pattern: 3-word idiom = finish supply!', 'medium'),
('foundation', 'phrasal-verbs', 'intermediate', '"Keep up with" means: (idiom-like)', '["maintain same pace", "continue upward", "store with", "retain"]', 0, 'Keep up with = maintain same speed/level. "Keep up with classmates." Pattern: 3-word idiom = match pace!', 'medium'),
('foundation', 'phrasal-verbs', 'intermediate', '"Cut down on" means: (idiom-like)', '["reduce amount", "chop downward", "criticize", "attack"]', 0, 'Cut down on = reduce consumption. "Cut down on sugar." Pattern: 3-word idiom = decrease!', 'medium'),
('foundation', 'phrasal-verbs', 'intermediate', '"Make up for" means: (idiom-like)', '["compensate", "invent for", "reconcile with", "create"]', 0, 'Make up for = compensate/offset loss. "Make up for lost time." Pattern: 3-word idiom = compensate!', 'medium'),

('foundation', 'phrasal-verbs', 'intermediate', '"Face up to" means: (idiom-like)', '["accept/confront reality", "turn face upward", "challenge", "meet"]', 0, 'Face up to = accept difficult truth/confront problem. "Face up to mistakes." Pattern: 3-word idiom = confront reality!', 'hard'),
('foundation', 'phrasal-verbs', 'intermediate', '"Live up to" means: (idiom-like)', '["meet expectations", "reside above", "survive until", "match lifestyle"]', 0, 'Live up to = meet/fulfill expectations. "Live up to reputation." Pattern: 3-word idiom = meet standards!', 'hard'),
('foundation', 'phrasal-verbs', 'intermediate', '"Get along with" means: (idiom-like)', '["have friendly relationship", "progress with", "bring along", "age"]', 0, 'Get along with = have good relationship with. "Get along with colleagues." Pattern: 3-word idiom = friendly relationship!', 'hard'),
('foundation', 'phrasal-verbs', 'intermediate', '"Stand up for" means: (idiom-like)', '["defend/support", "rise for", "represent", "tolerate"]', 0, 'Stand up for = defend/support (rights/person). "Stand up for justice." Pattern: 3-word idiom = defend principles!', 'hard');

SELECT 'Phrasal Verbs Question Count' as check;
SELECT COUNT(*) FROM english_questions WHERE topic_id = 'phrasal-verbs';
'''

# Idioms (50Q) - 5 subtopics with varying counts
idioms_sql = '''-- ============================================================================
-- FOUNDATION PATH: Idioms (COMPLETE)
-- Topic ID: idioms
-- Level: intermediate (A2)
-- Total: 50 questions covering ALL 5 subtopics
-- Distribution: 20 easy, 20 medium, 10 hard (40/40/20)
-- ============================================================================

INSERT INTO english_questions (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty) VALUES

-- Common Idioms (15Q: 6 easy, 6 medium, 3 hard)
('foundation', 'idioms', 'intermediate', '"Break the ice" means:', '["start conversation in awkward situation", "break frozen water", "stop being cold", "destroy something"]', 0, 'Break the ice = start conversation/reduce tension. "Let''s play a game to break the ice." Pattern: idiom for easing social tension!', 'easy'),
('foundation', 'idioms', 'intermediate', '"Piece of cake" means:', '["very easy", "dessert", "small portion", "reward"]', 0, 'Piece of cake = very easy task. "The test was a piece of cake!" Pattern: food idiom = easy!', 'easy'),
('foundation', 'idioms', 'intermediate', '"Cost an arm and a leg" means:', '["very expensive", "cause injury", "require body parts", "free"]', 0, 'Cost an arm and a leg = very expensive. "That car costs an arm and a leg." Pattern: body parts idiom = high cost!', 'easy'),
('foundation', 'idioms', 'intermediate', '"Once in a blue moon" means:', '["very rarely", "every month", "at night", "during lunar eclipse"]', 0, 'Once in a blue moon = very rarely. "I eat fast food once in a blue moon." Pattern: time idiom = rare frequency!', 'easy'),
('foundation', 'idioms', 'intermediate', '"Hit the nail on the head" means:', '["exactly correct", "use hammer", "hurt someone", "fix something"]', 0, 'Hit the nail on the head = exactly right/accurate. "You hit the nail on the head!" Pattern: construction idiom = precision!', 'easy'),
('foundation', 'idioms', 'intermediate', '"Under the weather" means:', '["feeling sick", "outside in rain", "below clouds", "depressed"]', 0, 'Under the weather = feeling ill/sick. "I''m feeling under the weather today." Pattern: weather idiom = illness!', 'easy'),

('foundation', 'idioms', 'intermediate', '"Spill the beans" means:', '["reveal a secret", "drop food", "make mess", "cook badly"]', 0, 'Spill the beans = reveal secret information. "Don''t spill the beans about the party!" Pattern: food idiom = tell secret!', 'medium'),
('foundation', 'idioms', 'intermediate', '"Bite the bullet" means:', '["do something difficult but necessary", "eat ammunition", "show courage", "fight"]', 0, 'Bite the bullet = face difficult situation bravely. "Just bite the bullet and call him." Pattern: courage idiom!', 'medium'),
('foundation', 'idioms', 'intermediate', '"Let the cat out of the bag" means:', '["reveal secret accidentally", "release animal", "make mistake", "cause chaos"]', 0, 'Let the cat out of the bag = accidentally reveal secret. "She let the cat out of the bag about the surprise." Pattern: animal idiom = accidental revelation!', 'medium'),
('foundation', 'idioms', 'intermediate', '"Burn the midnight oil" means:', '["work late into night", "use lamp", "waste time", "stay awake"]', 0, 'Burn the midnight oil = work very late at night. "Students burn the midnight oil before exams." Pattern: historical idiom = late-night work!', 'medium'),
('foundation', 'idioms', 'intermediate', '"Call it a day" means:', '["stop working for today", "name something", "quit permanently", "postpone"]', 0, 'Call it a day = stop working/decide to finish. "Let''s call it a day and go home." Pattern: time idiom = end work!', 'medium'),
('foundation', 'idioms', 'intermediate', '"Get the ball rolling" means:', '["start an activity", "play sports", "throw object", "continue"]', 0, 'Get the ball rolling = start/initiate activity. "Let''s get the ball rolling on this project." Pattern: sports idiom = begin!', 'medium'),

('foundation', 'idioms', 'intermediate', '"Beat around the bush" means:', '["avoid main topic", "hit plants", "search area", "waste time"]', 0, 'Beat around the bush = avoid saying something directly. "Stop beating around the bush and tell me!" Pattern: indirect communication idiom!', 'hard'),
('foundation', 'idioms', 'intermediate', '"A blessing in disguise" means:', '["something good in bad situation", "hidden gift", "costume", "surprise"]', 0, 'Blessing in disguise = something bad that turns out good. "Losing that job was a blessing in disguise." Pattern: hidden benefit idiom!', 'hard'),
('foundation', 'idioms', 'intermediate', '"Actions speak louder than words" means:', '["doing is more important than saying", "be quiet", "don''t talk", "actions are noisy"]', 0, 'Actions speak louder than words = what you do matters more than what you say. Proverb about proving through actions. Pattern: action vs speech!', 'hard'),

-- Animal Idioms (10Q: 4 easy, 4 medium, 2 hard)
('foundation', 'idioms', 'intermediate', '"Raining cats and dogs" means:', '["raining heavily", "animals falling", "light rain", "storm"]', 0, 'Raining cats and dogs = raining very heavily. "It''s raining cats and dogs outside!" Pattern: animal idiom = heavy rain!', 'easy'),
('foundation', 'idioms', 'intermediate', '"Hold your horses" means:', '["wait/be patient", "grip animals", "stop riding", "hurry up"]', 0, 'Hold your horses = wait/slow down/be patient. "Hold your horses, I''m coming!" Pattern: horse idiom = patience!', 'easy'),
('foundation', 'idioms', 'intermediate', '"When pigs fly" means:', '["never/impossible", "soon", "in winter", "rarely"]', 0, 'When pigs fly = never/something impossible. "He''ll apologize when pigs fly!" Pattern: pig idiom = impossibility!', 'easy'),
('foundation', 'idioms', 'intermediate', '"Let sleeping dogs lie" means:', '["don''t disturb peaceful situation", "allow dogs to sleep", "be quiet", "avoid animals"]', 0, 'Let sleeping dogs lie = don''t create problems when things are calm. "Let sleeping dogs lie and don''t mention it." Pattern: dog idiom = avoid conflict!', 'easy'),

('foundation', 'idioms', 'intermediate', '"A fish out of water" means:', '["uncomfortable in unfamiliar situation", "dying fish", "swimming", "fresh seafood"]', 0, 'Fish out of water = feeling uncomfortable/out of place. "I felt like a fish out of water at the party." Pattern: fish idiom = discomfort!', 'medium'),
('foundation', 'idioms', 'intermediate', '"Kill two birds with one stone" means:', '["achieve two goals with one action", "hunt birds", "be efficient", "hurt animals"]', 0, 'Kill two birds with one stone = accomplish two things at once. "I can kill two birds with one stone by shopping and meeting her." Pattern: bird idiom = efficiency!', 'medium'),
('foundation', 'idioms', 'intermediate', '"The lion''s share" means:', '["largest portion", "small amount", "fair share", "nothing"]', 0, 'Lion''s share = the largest part/majority. "He took the lion''s share of the profit." Pattern: lion idiom = biggest portion!', 'medium'),
('foundation', 'idioms', 'intermediate', '"A wolf in sheep''s clothing" means:', '["dangerous person pretending to be harmless", "costume", "animal disguise", "farmer"]', 0, 'Wolf in sheep''s clothing = dangerous person pretending to be innocent. Warning about deceptive people. Pattern: disguise idiom = hidden danger!', 'medium'),

('foundation', 'idioms', 'intermediate', '"Have bigger fish to fry" means:', '["have more important things to do", "cook large meal", "go fishing", "have problems"]', 0, 'Bigger fish to fry = more important matters to attend to. "I have bigger fish to fry than gossip." Pattern: fish idiom = priorities!', 'hard'),
('foundation', 'idioms', 'intermediate', '"The elephant in the room" means:', '["obvious problem no one mentions", "large animal inside", "big furniture", "main topic"]', 0, 'Elephant in the room = obvious problem everyone ignores. "Let''s address the elephant in the room." Pattern: elephant idiom = avoided issue!', 'hard'),

-- Body Part Idioms (10Q: 4 easy, 4 medium, 2 hard)
('foundation', 'idioms', 'intermediate', '"Keep an eye on" means:', '["watch/monitor", "look with one eye", "protect eyes", "stare"]', 0, 'Keep an eye on = watch carefully/monitor. "Keep an eye on the baby." Pattern: eye idiom = surveillance!', 'easy'),
('foundation', 'idioms', 'intermediate', '"Give someone a hand" means:', '["help someone", "shake hands", "donate body part", "applaud"]', 0, 'Give a hand = help someone OR applaud. "Can you give me a hand?" Pattern: hand idiom = assistance!', 'easy'),
('foundation', 'idioms', 'intermediate', '"Break a leg" means:', '["good luck", "injure yourself", "dance badly", "fail"]', 0, 'Break a leg = good luck (said before performance). Theater tradition. "Break a leg at your audition!" Pattern: leg idiom = wish success!', 'easy'),
('foundation', 'idioms', 'intermediate', '"Cost an arm and a leg" means:', '["very expensive", "require surgery", "sacrifice", "cheap"]', 0, 'Cost an arm and a leg = extremely expensive. "That watch costs an arm and a leg!" Pattern: body parts = high price!', 'easy'),

('foundation', 'idioms', 'intermediate', '"Pull someone''s leg" means:', '["joke/tease someone", "drag person", "help walk", "trip someone"]', 0, 'Pull someone''s leg = joke/tease playfully. "I''m just pulling your leg!" Pattern: leg idiom = joking!', 'medium'),
('foundation', 'idioms', 'intermediate', '"Turn a blind eye" means:', '["ignore problem deliberately", "close one eye", "become blind", "look away"]', 0, 'Turn a blind eye = deliberately ignore something wrong. "Don''t turn a blind eye to bullying." Pattern: eye idiom = willful ignorance!', 'medium'),
('foundation', 'idioms', 'intermediate', '"Stick your neck out" means:', '["take a risk", "stretch neck", "be brave", "look around"]', 0, 'Stick your neck out = take risk/be vulnerable. "He stuck his neck out by defending her." Pattern: neck idiom = risk-taking!', 'medium'),
('foundation', 'idioms', 'intermediate', '"Get something off your chest" means:', '["confess/express feelings", "remove clothing", "lose weight", "breathe"]', 0, 'Get off your chest = confess/share burden. "I need to get this off my chest." Pattern: chest idiom = emotional release!', 'medium'),

('foundation', 'idioms', 'intermediate', '"Have a chip on your shoulder" means:', '["be angry/resentful", "carry wood piece", "injured shoulder", "be proud"]', 0, 'Chip on shoulder = harbor resentment/grievance. "He has a chip on his shoulder about being rejected." Pattern: shoulder idiom = grudge!', 'hard'),
('foundation', 'idioms', 'intermediate', '"Play it by ear" means:', '["improvise/decide as you go", "play music without sheet", "listen carefully", "ignore"]', 0, 'Play it by ear = improvise/see what happens. "Let''s play it by ear." Pattern: ear idiom = flexible approach!', 'hard'),

-- Food Idioms (8Q: 3 easy, 3 medium, 2 hard)
('foundation', 'idioms', 'intermediate', '"Spill the beans" means:', '["reveal secret", "drop food", "make mess", "cook"]', 0, 'Spill the beans = reveal secret. "Don''t spill the beans!" Pattern: bean idiom = disclosure!', 'easy'),
('foundation', 'idioms', 'intermediate', '"Piece of cake" means:', '["very easy", "dessert", "reward", "small amount"]', 0, 'Piece of cake = very easy task. "That exam was a piece of cake!" Pattern: cake idiom = simplicity!', 'easy'),
('foundation', 'idioms', 'intermediate', '"In a nutshell" means:', '["in brief/summary", "inside shell", "small space", "complicated"]', 0, 'In a nutshell = summarized briefly. "In a nutshell, we failed." Pattern: nut idiom = concise summary!', 'easy'),

('foundation', 'idioms', 'intermediate', '"Cry over spilled milk" means:', '["regret past mistakes uselessly", "be upset about accident", "waste milk", "clean up"]', 0, 'Cry over spilled milk = regret something that can''t be changed. "No use crying over spilled milk." Pattern: milk idiom = useless regret!', 'medium'),
('foundation', 'idioms', 'intermediate', '"Take something with a grain of salt" means:', '["be skeptical/don''t fully believe", "add salt to food", "reduce amount", "believe easily"]', 0, 'Take with grain of salt = be skeptical/doubtful. "Take his advice with a grain of salt." Pattern: salt idiom = skepticism!', 'medium'),
('foundation', 'idioms', 'intermediate', '"Butter someone up" means:', '["flatter to get favor", "cook for someone", "make happy", "apply butter"]', 0, 'Butter someone up = flatter to gain advantage. "He''s buttering up the boss." Pattern: butter idiom = flattery!', 'medium'),

('foundation', 'idioms', 'intermediate', '"The icing on the cake" means:', '["something that makes good situation even better", "cake decoration", "final touch", "reward"]', 0, 'Icing on cake = extra benefit on top of good thing. "Winning prize was icing on the cake!" Pattern: cake idiom = bonus benefit!', 'hard'),
('foundation', 'idioms', 'intermediate', '"A tough cookie" means:', '["strong determined person", "hard biscuit", "difficult situation", "bad person"]', 0, 'Tough cookie = strong resilient person. "She''s a tough cookie who never gives up." Pattern: cookie idiom = resilience!', 'hard'),

-- Color Idioms (7Q: 3 easy, 2 medium, 2 hard)
('foundation', 'idioms', 'intermediate', '"Out of the blue" means:', '["unexpectedly", "from sky", "sadly", "openly"]', 0, 'Out of the blue = suddenly/unexpectedly. "He called me out of the blue." Pattern: blue idiom = surprise!', 'easy'),
('foundation', 'idioms', 'intermediate', '"Green with envy" means:', '["very jealous", "eco-friendly", "sick", "inexperienced"]', 0, 'Green with envy = very jealous. "She was green with envy of my car." Pattern: green idiom = jealousy!', 'easy'),
('foundation', 'idioms', 'intermediate', '"Catch someone red-handed" means:', '["catch in act of doing wrong", "grab hand", "find blood", "arrest"]', 0, 'Catch red-handed = catch someone in the act of wrongdoing. "Caught red-handed stealing!" Pattern: red idiom = crime evidence!', 'easy'),

('foundation', 'idioms', 'intermediate', '"Once in a blue moon" means:', '["very rarely", "every month", "during lunar event", "never"]', 0, 'Once in a blue moon = very rarely/hardly ever. "I eat dessert once in a blue moon." Pattern: blue idiom = rarity!', 'medium'),
('foundation', 'idioms', 'intermediate', '"Give the green light" means:', '["give permission", "show traffic signal", "be jealous", "grow plants"]', 0, 'Give green light = give permission/approval. "Boss gave us the green light." Pattern: green idiom = authorization!', 'medium'),

('foundation', 'idioms', 'intermediate', '"A white lie" means:', '["harmless lie to avoid hurt", "truth", "obvious lie", "pure honesty"]', 0, 'White lie = small harmless lie (usually to be polite). "I told a white lie about liking her haircut." Pattern: white idiom = benign deception!', 'hard'),
('foundation', 'idioms', 'intermediate', '"In the red" means:', '["in debt/losing money", "angry", "embarrassed", "successful"]', 0, 'In the red = in debt/losing money (accounting term). "The company is in the red." Opposite: "in the black" (profit). Pattern: red idiom = financial loss!', 'hard');

SELECT 'Idioms Question Count' as check;
SELECT COUNT(*) FROM english_questions WHERE topic_id = 'idioms';
'''

# Write files
with open('output/phrasal-verbs-80Q.sql', 'w', encoding='utf-8') as f:
    f.write(phrasal_verbs_sql)

with open('output/idioms-50Q.sql', 'w', encoding='utf-8') as f:
    f.write(idioms_sql)

print("✅ Generated phrasal-verbs-80Q.sql")
print("✅ Generated idioms-50Q.sql")
print("\n🎉 All Phase 3 files ready for insertion!")
