-- ============================================================================
-- FOUNDATION PATH: Nouns Mastery (COMPLETE)
-- Topic ID: nouns-detailed
-- Level: beginner (A1)
-- Total: 120 questions covering ALL 5 subtopics
-- ============================================================================
-- Subtopics covered:
--   1. Proper vs Common Nouns - 24 questions
--   2. Singular → Plural - 24 questions
--   3. Irregular Plurals - 24 questions
--   4. Countable vs Uncountable - 24 questions
--   5. Collective Nouns - 24 questions
-- Distribution: 48 easy, 48 medium, 24 hard (40/40/20)
-- ============================================================================

INSERT INTO english_questions (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty) VALUES

-- ============================================================================
-- SUBTOPIC 1: Proper vs Common Nouns (24 questions)
-- ============================================================================

-- EASY (10 questions)
('foundation', 'nouns-detailed', 'beginner', 'Which is a proper noun?', '["city", "Mumbai", "school", "teacher"]', 1, 'Proper noun = specific name (always capitalized). Mumbai = specific city name. Common nouns: city, school, teacher (general names).', 'easy'),

('foundation', 'nouns-detailed', 'beginner', 'Which is a common noun?', '["India", "Taj Mahal", "book", "Rahul"]', 2, 'Common noun = general name (not capitalized unless starting sentence). Book = general thing. Proper nouns: India, Taj Mahal, Rahul (specific names).', 'easy'),

('foundation', 'nouns-detailed', 'beginner', 'Which needs a capital letter?', '["monday", "day", "week", "month"]', 0, 'Proper nouns need capitals. Days of the week = proper nouns. Correct: Monday. Common nouns (day, week, month) stay lowercase.', 'easy'),

('foundation', 'nouns-detailed', 'beginner', 'Which is proper? "I visited _____ last week."', '["city", "delhi", "Delhi", "DELHI"]', 2, 'Proper nouns: First letter capital only. Delhi = city name (specific). Not all caps unless acronym.', 'easy'),

('foundation', 'nouns-detailed', 'beginner', '"Ganga" is a _____ noun.', '["common", "proper", "abstract", "collective"]', 1, 'Ganga = name of specific river = proper noun. Always capitalized. Common would be "river" (general).', 'easy'),

('foundation', 'nouns-detailed', 'beginner', 'Which is common? "My _____ is tall."', '["Brother", "brother", "BROTHER", "Bother"]', 1, 'Common noun = lowercase (unless sentence start). "brother" = general relationship. "Brother" capitalized only at sentence start.', 'easy'),

('foundation', 'nouns-detailed', 'beginner', 'Proper noun for "country":',  '["land", "nation", "India", "place"]', 2, 'Proper noun = specific name. India = specific country name. Land, nation, place = common nouns (general).', 'easy'),

('foundation', 'nouns-detailed', 'beginner', '"Dr. Sharma" contains _____ proper noun(s).', '["0", "1", "2", "3"]', 2, 'Two proper nouns: Dr. (title) + Sharma (name). Both specific = both proper. Always capitalize both.', 'easy'),

('foundation', 'nouns-detailed', 'beginner', 'Which needs NO capital?', '["Sunday", "January", "mountain", "Christmas"]', 2, 'Common noun "mountain" = no capital (general). Proper: Sunday (day), January (month), Christmas (holiday) = all capitals.', 'easy'),

('foundation', 'nouns-detailed', 'beginner', '"The Himalayas" is _____.', '["common noun", "proper noun", "verb", "adjective"]', 1, 'The Himalayas = name of specific mountain range = proper noun. Always capitalized (including "The" when part of name).', 'easy'),

-- MEDIUM (10 questions)
('foundation', 'nouns-detailed', 'beginner', 'What is wrong? "I study at delhi university."', '["Capitalize: Delhi University", "Lowercase: university", "Add: the before delhi", "Nothing wrong"]', 0, 'Proper nouns need capitals. University name = proper noun. Correct: "I study at Delhi University." Both words capitalized.', 'medium'),

('foundation', 'nouns-detailed', 'beginner', 'Choose correct: "She lives in _____ apartment in _____ Mumbai."', '["an / a", "a / the", "an / -", "the / the"]', 2, 'Pattern: an (vowel sound) + common noun + in + proper noun (no article). "An apartment in Mumbai" (Mumbai needs no article).', 'medium'),

('foundation', 'nouns-detailed', 'beginner', 'Which sentence is correct?', '["I love Mango.", "I love mango.", "I love MANGO.", "I Love Mango."]', 1, 'Common noun (general fruit) = lowercase. "I love mango." Only capitalize if: sentence start OR proper noun.', 'medium'),

('foundation', 'nouns-detailed', 'beginner', 'Arrange correctly: uncle / My / lives / mumbai / in', '["My uncle lives in mumbai", "My uncle lives in Mumbai", "My Uncle lives in Mumbai", "my uncle lives in Mumbai"]', 1, 'Pattern: Capital at start + common noun lowercase + proper noun capitalized. Correct: "My uncle lives in Mumbai."', 'medium'),

('foundation', 'nouns-detailed', 'beginner', 'Error in: "ram and sita are friends."', '["Capitalize: Ram and Sita", "Add: the before Ram", "Lowercase: friends", "Nothing wrong"]', 0, 'Names = proper nouns = always capital. Correct: "Ram and Sita are friends." Both names need capitals.', 'medium'),

('foundation', 'nouns-detailed', 'beginner', 'Which is BOTH proper and common? "Bank"', '["Bank = river bank (common)", "Bank = State Bank of India (proper)", "Bank = both depending on meaning", "Bank = neither"]', 2, 'Context matters! "bank" (river edge) = common. "Bank" (institution name like ICICI Bank) = proper. Same word, different meanings.', 'medium'),

('foundation', 'nouns-detailed', 'beginner', '"Mount Everest is a mountain." How many proper nouns?', '["0", "1", "2", "3"]', 1, 'One proper noun: "Mount Everest" (specific mountain name). "mountain" = common noun (general category). "a mountain" describes what it is.', 'medium'),

('foundation', 'nouns-detailed', 'beginner', 'Rearrange: teaches / at / School / My / mother / Delhi / Public', '["My mother teaches at Delhi Public School", "My Mother teaches at delhi public school", "my mother teaches at Delhi public school", "My mother Teaches at Delhi Public School"]', 0, 'Pattern: Capital at start + common nouns lowercase + school name (all words) capitalized. Natural: "My mother teaches at Delhi Public School."', 'medium'),

('foundation', 'nouns-detailed', 'beginner', 'What is wrong? "The president of India arrived."', '["Capitalize: President", "Lowercase: India", "Add: the before India", "Nothing wrong"]', 3, 'Correct! "president" = title (common when not before name). "India" = proper noun (correct capital). "The president" = general reference OK.', 'medium'),

('foundation', 'nouns-detailed', 'beginner', '"Dr. Singh works at a hospital." Common nouns:', '["0", "1", "2", "3"]', 1, 'One common noun: "hospital" (general). Proper nouns: Dr. Singh (name). "a hospital" = any hospital (common/general).', 'medium'),

-- HARD (4 questions)
('foundation', 'nouns-detailed', 'beginner', 'Which is correct formal writing?', '["We met the Prime Minister", "We met the prime minister", "We met Prime Minister", "We met prime minister"]', 0, 'Title before name OR important title = capitalize. "the Prime Minister" (referring to THE person) = capitalize. Formal style.', 'hard'),

('foundation', 'nouns-detailed', 'beginner', 'Error: "I love reading The Times Of India newspaper."', '["Lowercase: of", "Capitalize: newspaper", "Remove: the", "No error"]', 0, 'Newspaper title style: Capitalize main words, lowercase articles/prepositions. Correct: "The Times of India newspaper" ("of" stays lowercase).', 'hard'),

('foundation', 'nouns-detailed', 'beginner', 'Arrange: river / the / flows / through / ganga / delhi', '["The ganga river flows through Delhi", "The Ganga River flows through Delhi", "The Ganga river flows through delhi", "the Ganga River flows through Delhi"]', 1, 'Pattern: Article + Proper Noun + Common Noun (if part of name) + through + Proper Noun. Correct: "The Ganga River flows through Delhi."', 'hard'),

('foundation', 'nouns-detailed', 'beginner', 'Which is WRONG? "My uncle works at State Bank of India."', '["Capitalize: Uncle", "Add: the before State", "Lowercase: of", "All correct"]', 3, 'All correct! "uncle" = common (not before name). "State Bank of India" = proper noun (bank name). "of" can stay lowercase in proper names.', 'hard'),

-- ============================================================================
-- SUBTOPIC 2: Singular → Plural (24 questions)
-- ============================================================================

-- EASY (10 questions)
('foundation', 'nouns-detailed', 'beginner', 'Plural of "book":', '["book", "books", "bookes", "bookies"]', 1, 'Regular plural: Add -s. book → books. Most nouns follow this simple rule.', 'easy'),

('foundation', 'nouns-detailed', 'beginner', 'Plural of "box":', '["boxs", "boxes", "boxies", "box"]', 1, 'Words ending in -x: Add -es. box → boxes. Also: tax → taxes, fox → foxes.', 'easy'),

('foundation', 'nouns-detailed', 'beginner', 'Plural of "cat":', '["cat", "cats", "cates", "caties"]', 1, 'Regular plural: Add -s. cat → cats. Simple rule for most nouns.', 'easy'),

('foundation', 'nouns-detailed', 'beginner', 'Plural of "class":', '["classs", "classes", "classies", "class"]', 1, 'Words ending in -ss: Add -es. class → classes. Also: glass → glasses, pass → passes.', 'easy'),

('foundation', 'nouns-detailed', 'beginner', 'Plural of "baby":', '["babys", "babies", "babyes", "baby"]', 1, 'Consonant + y: Change y → ies. baby → babies. Also: city → cities, party → parties.', 'easy'),

('foundation', 'nouns-detailed', 'beginner', 'Plural of "day":', '["daies", "days", "dayes", "day"]', 1, 'Vowel + y: Just add -s. day → days. Also: boy → boys, key → keys (y stays, add -s).', 'easy'),

('foundation', 'nouns-detailed', 'beginner', 'Plural of "pencil":', '["pencil", "pencils", "penciles", "pencilies"]', 1, 'Regular plural: Add -s. pencil → pencils. Simple rule.', 'easy'),

('foundation', 'nouns-detailed', 'beginner', 'Plural of "watch":', '["watchs", "watches", "watchies", "watch"]', 1, 'Words ending in -ch: Add -es. watch → watches. Also: match → matches, church → churches.', 'easy'),

('foundation', 'nouns-detailed', 'beginner', 'Plural of "bus":', '["buss", "buses", "busses", "bus"]', 1, 'Words ending in -s: Add -es. bus → buses. Some accept "busses" but "buses" is standard.', 'easy'),

('foundation', 'nouns-detailed', 'beginner', 'Plural of "toy":', '["toies", "toys", "toyes", "toy"]', 1, 'Vowel + y: Just add -s. toy → toys. Y stays when vowel before it.', 'easy'),

-- MEDIUM (10 questions)
('foundation', 'nouns-detailed', 'beginner', 'What is wrong? "I have three wishs."', '["Use: wishes instead of wishs", "Use: wish instead of wishs", "Use: wishing instead of wishs", "Nothing wrong"]', 0, 'Words ending in -sh: Add -es (not just -s). Correct: wishes. Also: dish → dishes, fish → fishes.', 'medium'),

('foundation', 'nouns-detailed', 'beginner', 'Choose correct: "She bought five _____."', '["boxs of chocolate", "boxes of chocolate", "box of chocolates", "boxies of chocolate"]', 1, 'Plural: box → boxes (add -es after -x). Pattern: Number + plural noun + of + noun. Correct: "five boxes of chocolate."', 'medium'),

('foundation', 'nouns-detailed', 'beginner', 'Error in: "Two citys are very crowded."', '["Use: cities instead of citys", "Use: city instead of citys", "Add: the before citys", "Nothing wrong"]', 0, 'Consonant + y: Change y → ies. Correct: cities (not citys). Pattern: city → cities.', 'medium'),

('foundation', 'nouns-detailed', 'beginner', 'Arrange: have / I / two / in / classess / the / morning', '["I have two classess in the morning", "I have two classes in the morning", "I have two class in the morning", "I have two classs in the morning"]', 1, 'Plural of class: classes (add -es). Pattern: Number + plural noun. Correct: "I have two classes in the morning."', 'medium'),

('foundation', 'nouns-detailed', 'beginner', 'Which is correct?', '["three babys", "three babies", "three babyes", "three baby"]', 1, 'Consonant + y → ies. baby → babies. After number, noun must be plural.', 'medium'),

('foundation', 'nouns-detailed', 'beginner', 'What is the error? "She has two watchs."', '["Use: watches instead of watchs", "Use: watch instead of watchs", "Add: the before watchs", "Nothing wrong"]', 0, 'Words ending in -ch: Add -es. Correct: watches (not watchs). Pattern: watch → watches.', 'medium'),

('foundation', 'nouns-detailed', 'beginner', 'Rearrange: three / buy / penciles / I / want / to', '["I want to buy three penciles", "I want to buy three pencils", "I want buy to three pencils", "I want to three buy pencils"]', 1, 'Regular plural: pencil → pencils (add -s, not -es). Pattern: want to + verb + number + plural. Correct: "I want to buy three pencils."', 'medium'),

('foundation', 'nouns-detailed', 'beginner', 'Choose: "Many _____ came to the party."', '["person", "persons", "peoples", "people"]', 3, 'Irregular! Person → people (not persons in casual speech). "People" = plural. "Many people" = correct.', 'medium'),

('foundation', 'nouns-detailed', 'beginner', 'Error: "He planted two tomatos."', '["Use: tomatoes instead of tomatos", "Use: tomato instead of tomatos", "Add: the before tomatos", "Nothing wrong"]', 0, 'Words ending in -o (after consonant): Add -es. Correct: tomatoes. Also: potato → potatoes, hero → heroes.', 'medium'),

('foundation', 'nouns-detailed', 'beginner', 'Which is correct?', '["two monkeys", "two monkeies", "two monkey", "two monkies"]', 0, 'Vowel + y: Just add -s (y stays). monkey → monkeys. No change to y when vowel before it.', 'medium'),

-- HARD (4 questions)
('foundation', 'nouns-detailed', 'beginner', 'Which is WRONG?', '["two photos", "two videos", "two radios", "two potatos"]', 3, 'Exception! Words ending in -o: Most add -es (potato → potatoes), BUT photo/video/radio add -s only. Last one wrong: should be "potatoes."', 'hard'),

('foundation', 'nouns-detailed', 'beginner', 'Arrange: stories / reading / enjoys / five / in / She / day / a', '["She enjoys reading five stories in a day", "She enjoys reading five storys in a day", "She enjoys reading five story in a day", "She reading enjoys five stories in a day"]', 0, 'Consonant + y → ies. story → stories. Pattern: Subject + verb + gerund + number + plural + time. Natural order correct.', 'hard'),

('foundation', 'nouns-detailed', 'beginner', 'Error: "We visited three churchs yesterday."', '["Use: churches instead of churchs", "Use: church instead of churchs", "Add: the before churchs", "Nothing wrong"]', 0, 'Words ending in -ch: Add -es. Correct: churches (not churchs). Pattern: church → churches.', 'hard'),

('foundation', 'nouns-detailed', 'beginner', 'Which is correct for formal writing?', '["5 childs", "5 children", "5 childrens", "5 child"]', 1, 'Irregular plural! child → children (complete change, not add -s). "5 children" = correct. Never "childrens" (already plural).', 'hard'),

-- ============================================================================
-- SUBTOPIC 3: Irregular Plurals (24 questions)
-- ============================================================================

-- EASY (10 questions)
('foundation', 'nouns-detailed', 'beginner', 'Plural of "man":', '["mans", "men", "man", "mens"]', 1, 'Irregular plural: man → men (vowel change). Not mans!', 'easy'),

('foundation', 'nouns-detailed', 'beginner', 'Plural of "woman":', '["womans", "women", "woman", "womens"]', 1, 'Irregular plural: woman → women (vowel change). Not womans!', 'easy'),

('foundation', 'nouns-detailed', 'beginner', 'Plural of "child":', '["childs", "children", "childrens", "child"]', 1, 'Irregular plural: child → children (complete change). Never childrens (already plural).', 'easy'),

('foundation', 'nouns-detailed', 'beginner', 'Plural of "foot":', '["foots", "feet", "feets", "foot"]', 1, 'Irregular plural: foot → feet (vowel change). Not foots!', 'easy'),

('foundation', 'nouns-detailed', 'beginner', 'Plural of "tooth":', '["tooths", "teeth", "teeths", "tooth"]', 1, 'Irregular plural: tooth → teeth (vowel change). Not tooths!', 'easy'),

('foundation', 'nouns-detailed', 'beginner', 'Plural of "mouse":', '["mouses", "mice", "mices", "mouse"]', 1, 'Irregular plural: mouse → mice (vowel change). Not mouses!', 'easy'),

('foundation', 'nouns-detailed', 'beginner', 'Plural of "sheep":', '["sheeps", "sheep", "sheepes", "sheepies"]', 1, 'Irregular: Same form! sheep → sheep (no change). One sheep, two sheep.', 'easy'),

('foundation', 'nouns-detailed', 'beginner', 'Plural of "fish":', '["fishs", "fishes", "fish", "Both B and C"]', 3, 'Irregular: Both OK! fish → fish (same) OR fishes. "Fish" more common (5 fish). "Fishes" = species (3 types of fishes).', 'easy'),

('foundation', 'nouns-detailed', 'beginner', 'Plural of "person":', '["persons", "people", "peoples", "Both A and B"]', 3, 'Irregular: Both OK! person → people (common) OR persons (formal). "5 people" = everyday. "5 persons" = legal/formal.', 'easy'),

('foundation', 'nouns-detailed', 'beginner', 'Plural of "goose":', '["gooses", "geese", "geeses", "goose"]', 1, 'Irregular plural: goose → geese (vowel change). Not gooses!', 'easy'),

-- MEDIUM (10 questions)
('foundation', 'nouns-detailed', 'beginner', 'What is wrong? "Three mens are waiting."', '["Use: men instead of mens", "Use: man instead of mens", "Add: the before mens", "Nothing wrong"]', 0, 'Irregular plural: man → men (already plural). Never add -s! Correct: "Three men are waiting." Men ≠ mens.', 'medium'),

('foundation', 'nouns-detailed', 'beginner', 'Choose correct: "I saw many _____ at the zoo."', '["deers", "deer", "deeres", "deeries"]', 1, 'Irregular: Same form! deer → deer (no change). One deer, many deer. Like sheep.', 'medium'),

('foundation', 'nouns-detailed', 'beginner', 'Error in: "She has beautiful tooths."', '["Use: teeth instead of tooths", "Use: tooth instead of tooths", "Add: the before tooths", "Nothing wrong"]', 0, 'Irregular plural: tooth → teeth (vowel change, no -s). Correct: "beautiful teeth."', 'medium'),

('foundation', 'nouns-detailed', 'beginner', 'Arrange: bought / shoes / I / two / pairs / of', '["I bought two pairs of shoes", "I bought two pair of shoes", "I bought two pairs of shoe", "I bought two pairs shoes"]', 0, 'Pattern: Number + plural (pairs) + of + plural (shoes). Correct: "I bought two pairs of shoes." Both nouns plural.', 'medium'),

('foundation', 'nouns-detailed', 'beginner', 'Which is correct?', '["five childs", "five children", "five childrens", "five child"]', 1, 'Irregular plural: child → children. Never childrens (already plural). Correct: "five children."', 'medium'),

('foundation', 'nouns-detailed', 'beginner', 'What is the error? "My foots hurt."', '["Use: feet instead of foots", "Use: foot instead of foots", "Add: the before foots", "Nothing wrong"]', 0, 'Irregular plural: foot → feet (vowel change). Correct: "My feet hurt." Never foots!', 'medium'),

('foundation', 'nouns-detailed', 'beginner', 'Rearrange: caught / We / two / big / fishes', '["We caught two big fishes", "We caught two big fish", "We caught two big fishs", "Both A and B correct"]', 3, 'Irregular: Both OK! "fish" (same form) OR "fishes" (different species). Both grammatically correct here.', 'medium'),

('foundation', 'nouns-detailed', 'beginner', 'Choose: "There are many _____ in the park."', '["person", "persons", "people", "peoples"]', 2, 'Informal = people (most common). Formal = persons. For "many" (casual context), "people" is natural.', 'medium'),

('foundation', 'nouns-detailed', 'beginner', 'Error: "I saw three sheeps in the field."', '["Use: sheep instead of sheeps", "Use: sheepies instead of sheeps", "Add: the before sheeps", "Nothing wrong"]', 0, 'Irregular: Same form! sheep → sheep (no change). Correct: "three sheep." Never sheeps!', 'medium'),

('foundation', 'nouns-detailed', 'beginner', 'Which is correct formal writing?', '["Five people attended", "Five persons attended", "Five peoples attended", "Five person attended"]', 1, 'Formal/legal writing = persons. Informal = people. "Five persons attended" = formal style (legal documents).', 'medium'),

-- HARD (4 questions)
('foundation', 'nouns-detailed', 'beginner', 'Which is WRONG?', '["three mice", "three men", "three children", "three womans"]', 3, 'All irregular plurals! mouse → mice ✓, man → men ✓, child → children ✓, woman → women (NOT womans) ✗', 'hard'),

('foundation', 'nouns-detailed', 'beginner', 'Arrange: geese / flying / Ten / are / the / in / sky', '["Ten geese are flying in the sky", "Ten gooses are flying in the sky", "Ten goose are flying in the sky", "Ten geeses are flying in the sky"]', 0, 'Irregular plural: goose → geese (vowel change). Pattern: Number + plural + verb. Correct: "Ten geese are flying."', 'hard'),

('foundation', 'nouns-detailed', 'beginner', 'Error: "The aquarium has 50 different fish species."', '["Use: fishes instead of fish", "Use: fishs instead of fish", "Add: the before fish", "No error"]', 3, 'Actually correct! "50 fish" or "50 fishes" both OK. When talking species/types, "fishes" is acceptable.', 'hard'),

('foundation', 'nouns-detailed', 'beginner', 'Which needs fixing? "Two mans, three womans, five childs."', '["men, women, children", "mans, womens, childrens", "man, woman, child", "All correct"]', 0, 'All irregular! man → men, woman → women, child → children. Correct: "Two men, three women, five children."', 'hard'),

-- ============================================================================
-- SUBTOPIC 4: Countable vs Uncountable (24 questions)
-- ============================================================================

-- EASY (10 questions)
('foundation', 'nouns-detailed', 'beginner', 'Which is countable?', '["water", "apple", "sugar", "milk"]', 1, 'Countable = can count (1, 2, 3...). Apple = countable (one apple, two apples). Water, sugar, milk = uncountable (can''t count drops).', 'easy'),

('foundation', 'nouns-detailed', 'beginner', 'Which is uncountable?', '["book", "chair", "rice", "pencil"]', 2, 'Uncountable = cannot count individual items. Rice = uncountable (grains too many). Book, chair, pencil = countable (can count).', 'easy'),

('foundation', 'nouns-detailed', 'beginner', '"_____ apple is red."', '["A", "An", "Some", "Many"]', 1, 'Countable singular = a/an. Apple starts with vowel sound = "an." Pattern: an + singular countable noun.', 'easy'),

('foundation', 'nouns-detailed', 'beginner', '"Give me _____ water."', '["a", "an", "some", "two"]', 2, 'Uncountable = some/any/much (NOT a/an/numbers). Water = uncountable. "Some water" = correct.', 'easy'),

('foundation', 'nouns-detailed', 'beginner', 'Which takes "many"?', '["water", "books", "sugar", "milk"]', 1, 'Many = countable plural. Books = countable. Pattern: many + plural countable. Uncountable uses "much."', 'easy'),

('foundation', 'nouns-detailed', 'beginner', 'Which takes "much"?', '["apples", "chairs", "money", "books"]', 2, 'Much = uncountable. Money = uncountable (can''t count "one money"). Apples, chairs, books = countable (use "many").', 'easy'),

('foundation', 'nouns-detailed', 'beginner', '"I need _____ information."', '["a", "an", "some", "many"]', 2, 'Information = uncountable. Use some/any/much. "Some information" = correct. Never "an information" or "informations."', 'easy'),

('foundation', 'nouns-detailed', 'beginner', '"She has _____ cat."', '["a", "some", "many", "much"]', 0, 'Countable singular = a/an. Cat = countable. "A cat" = one cat. Pattern: a/an + singular countable.', 'easy'),

('foundation', 'nouns-detailed', 'beginner', 'Which is uncountable?', '["car", "furniture", "dog", "table"]', 1, 'Furniture = uncountable (refers to all items together, not individual pieces). Car, dog, table = countable.', 'easy'),

('foundation', 'nouns-detailed', 'beginner', '"_____ students are studying."', '["A", "An", "Some", "Much"]', 2, 'Countable plural = some/any/many. Students = countable plural. "Some students" = correct. Not "a students."', 'easy'),

-- MEDIUM (10 questions)
('foundation', 'nouns-detailed', 'beginner', 'What is wrong? "I bought three breads."', '["Use: loaves of bread", "Use: bread", "Use: pieces of bread", "All corrections possible"]', 3, 'Bread = uncountable. To count: use containers/pieces. "Three loaves of bread" OR "three pieces of bread." All valid!', 'medium'),

('foundation', 'nouns-detailed', 'beginner', 'Choose correct: "I need _____ advice."', '["a", "an", "some", "many"]', 2, 'Advice = uncountable (no -s plural). Use some/any/much. "Some advice" = correct. Never "an advice" or "advices."', 'medium'),

('foundation', 'nouns-detailed', 'beginner', 'Error in: "She gave me many informations."', '["Use: much information", "Use: a lot of information", "Use: some information", "All corrections work"]', 3, 'Information = uncountable. Never "informations." Use: much/a lot of/some information. All three corrections valid!', 'medium'),

('foundation', 'nouns-detailed', 'beginner', 'Arrange: bought / I / two / of / milk / bottles', '["I bought two bottles of milk", "I bought two milks", "I bought two bottle of milk", "I bought two bottles milk"]', 0, 'Uncountable = use containers. Pattern: Number + container plural + of + uncountable. "Two bottles of milk" = correct.', 'medium'),

('foundation', 'nouns-detailed', 'beginner', 'Which is correct?', '["two furnitures", "two pieces of furniture", "two furniture", "many furnitures"]', 1, 'Furniture = uncountable. To count: "pieces of furniture." Never furnitures! Correct: "two pieces of furniture."', 'medium'),

('foundation', 'nouns-detailed', 'beginner', 'What is the error? "I need a luggage."', '["Use: some luggage", "Use: a piece of luggage", "Use: luggage (no article)", "Both A and B correct"]', 3, 'Luggage = uncountable. Remove "a" OR use container. "Some luggage" / "a piece of luggage" = both correct!', 'medium'),

('foundation', 'nouns-detailed', 'beginner', 'Rearrange: cups / tea / I / two / drank / of', '["I drank two cups of tea", "I drank two teas", "I drank two cup of tea", "I drank two cups tea"]', 0, 'Tea = uncountable. Use containers. Pattern: verb + number + container plural + of + uncountable. Natural order correct.', 'medium'),

('foundation', 'nouns-detailed', 'beginner', 'Choose: "We need _____ equipment."', '["a", "an", "some", "many"]', 2, 'Equipment = uncountable (refers to all tools together). Use some/any/much. "Some equipment" = correct.', 'medium'),

('foundation', 'nouns-detailed', 'beginner', 'Error: "Can you give me a news?"', '["Use: some news", "Use: a piece of news", "Use: news (no article)", "Both A and B correct"]', 3, 'News = uncountable (even though ends in -s!). Remove "a" OR use piece. "Some news" / "a piece of news" = both correct.', 'medium'),

('foundation', 'nouns-detailed', 'beginner', 'Which is correct?', '["three homeworks", "three pieces of homework", "three homework", "many homeworks"]', 1, 'Homework = uncountable. To count: "pieces of homework." Never homeworks! Correct: "three pieces of homework."', 'medium'),

-- HARD (4 questions)
('foundation', 'nouns-detailed', 'beginner', 'Which is WRONG?', '["a piece of advice", "some rice", "three luggages", "much water"]', 2, 'Luggage = uncountable. Never luggages! Correct: "three pieces of luggage." All others correct.', 'hard'),

('foundation', 'nouns-detailed', 'beginner', 'Arrange: bought / slices / She / of / bread / five', '["She bought five slices of bread", "She bought five breads", "She bought five slice of bread", "She bought five slices bread"]', 0, 'Bread = uncountable. Use slices/loaves/pieces. Pattern: Number + slice plural + of + uncountable. Natural: "five slices of bread."', 'hard'),

('foundation', 'nouns-detailed', 'beginner', 'Error: "We need more furnitures for the office."', '["Use: furniture (no -s)", "Use: pieces of furniture", "Use: items of furniture", "All corrections work"]', 3, 'Furniture = uncountable. Never furnitures! Use: more furniture / more pieces of furniture / more items. All valid!', 'hard'),

('foundation', 'nouns-detailed', 'beginner', 'Which is correct formal writing?', '["I have many works to do", "I have much work to do", "I have many work to do", "I have much works to do"]', 1, 'Work (activity) = uncountable = much work. Works (art pieces) = countable. Context: activity = uncountable. Correct: "much work to do."', 'hard'),

-- ============================================================================
-- SUBTOPIC 5: Collective Nouns (24 questions)
-- ============================================================================

-- EASY (10 questions)
('foundation', 'nouns-detailed', 'beginner', 'Collective noun for birds:', '["group", "flock", "herd", "pack"]', 1, 'Flock = group of birds. Herd = animals, pack = wolves/dogs, group = general.', 'easy'),

('foundation', 'nouns-detailed', 'beginner', 'Collective noun for students:', '["team", "class", "herd", "flock"]', 1, 'Class = group of students. Team = players, herd = animals, flock = birds.', 'easy'),

('foundation', 'nouns-detailed', 'beginner', '"A _____ of players won."', '["class", "team", "flock", "herd"]', 1, 'Team = group of players. Pattern: a team of players. Collective noun!', 'easy'),

('foundation', 'nouns-detailed', 'beginner', 'Collective noun for fish:', '["herd", "pack", "school", "class"]', 2, 'School = group of fish swimming together. Herd = land animals, pack = wolves.', 'easy'),

('foundation', 'nouns-detailed', 'beginner', '"The _____ is playing well."', '["team", "teams", "player", "players"]', 0, 'Collective noun = singular form. "The team" (one group). Verb: is (singular). Team acts as one unit.', 'easy'),

('foundation', 'nouns-detailed', 'beginner', 'Collective noun for cows:', '["flock", "herd", "pack", "class"]', 1, 'Herd = group of cattle/cows. Flock = birds, pack = wolves, class = students.', 'easy'),

('foundation', 'nouns-detailed', 'beginner', '"A _____ of soldiers marched."', '["class", "team", "regiment", "herd"]', 2, 'Regiment = group of soldiers (military). Specific collective noun for army.', 'easy'),

('foundation', 'nouns-detailed', 'beginner', 'Collective noun for bees:', '["herd", "swarm", "flock", "class"]', 1, 'Swarm = group of bees/insects. Herd = large animals, flock = birds.', 'easy'),

('foundation', 'nouns-detailed', 'beginner', '"The family _____ on vacation."', '["is", "are", "be", "am"]', 0, 'Collective noun = singular verb (usually). "The family is" (acting as one unit). British: "are" also OK.', 'easy'),

('foundation', 'nouns-detailed', 'beginner', 'Collective noun for lions:', '["pack", "pride", "herd", "swarm"]', 1, 'Pride = group of lions. Pack = wolves, herd = cattle, swarm = insects.', 'easy'),

-- MEDIUM (10 questions)
('foundation', 'nouns-detailed', 'beginner', 'What is the verb? "The committee _____ decided."', '["has", "have", "is", "Both A and B"]', 3, 'Collective noun: Both singular (has) and plural (have) OK! American = has (singular). British = have (plural). Both acceptable!', 'medium'),

('foundation', 'nouns-detailed', 'beginner', 'Choose correct: "The _____ of musicians played."', '["team", "band", "class", "herd"]', 1, 'Band/orchestra = group of musicians. Specific collective noun. Team = sports, class = students.', 'medium'),

('foundation', 'nouns-detailed', 'beginner', 'Error in: "A herds of elephants crossed."', '["Use: herd (singular)", "Use: group", "Use: pack", "Nothing wrong"]', 0, 'Collective noun itself = singular! "A herd" (one group). Never "a herds." Correct: "A herd of elephants."', 'medium'),

('foundation', 'nouns-detailed', 'beginner', 'Arrange: of / The / walking / is / group / students', '["The group of students is walking", "The group of students are walking", "The groups of student is walking", "Both A and B correct"]', 3, 'Collective noun: Both verbs OK! "group is" (singular) OR "group are" (British style, focus on members). Context allows both!', 'medium'),

('foundation', 'nouns-detailed', 'beginner', 'Which is correct?', '["The jury are divided", "The jury is divided", "Both correct", "Neither correct"]', 2, 'Both correct! American = "is" (singular). British = "are" (when members act individually). Context-dependent!', 'medium'),

('foundation', 'nouns-detailed', 'beginner', 'What is wrong? "The team are play well."', '["Use: playing instead of play", "Use: is instead of are", "Use: plays instead of play", "Both A and B possible"]', 3, 'Two issues: "are play" needs -ing (are playing) OR "is" + plays. Both fixes possible: "team is playing" / "team are playing."', 'medium'),

('foundation', 'nouns-detailed', 'beginner', 'Rearrange: audience / The / clapping / were', '["The audience were clapping", "The audience was clapping", "The audiences were clapping", "Both A and B correct"]', 3, 'Collective noun: Both OK! "audience was" (one group) OR "audience were" (individuals clapping). British allows both!', 'medium'),

('foundation', 'nouns-detailed', 'beginner', 'Choose: "A _____ of ships sailed away."', '["group", "fleet", "herd", "class"]', 1, 'Fleet = group of ships. Specific collective noun for naval vessels.', 'medium'),

('foundation', 'nouns-detailed', 'beginner', 'Error: "The family are goes on vacation."', '["Remove: are", "Use: going instead of goes", "Use: is instead of are", "Multiple fixes needed"]', 3, 'Multiple errors! "are goes" is wrong. Fix: "family is going" OR "family are going" (British). Never "are goes."', 'medium'),

('foundation', 'nouns-detailed', 'beginner', 'Which is formal?', '["The committee has decided", "The committee have decided", "The committees has decided", "Both A and B"]', 0, 'Formal American English = singular verb. "The committee has decided" = most formal. British accepts "have."', 'medium'),

-- HARD (4 questions)
('foundation', 'nouns-detailed', 'beginner', 'Which is WRONG?', '["The staff is working", "The staff are working", "The staffs are working", "Both A and B correct"]', 2, 'Staff = collective (already refers to group). Never "staffs" in this meaning! Correct: "staff is/are" (both OK).', 'hard'),

('foundation', 'nouns-detailed', 'beginner', 'Arrange: has / The / its / government / announced / decision', '["The government has announced its decision", "The government have announced their decision", "The governments has announced its decision", "Both A and B correct"]', 3, 'Both grammatically correct! American = "has/its" (singular). British = "have/their" (plural style). Context allows both!', 'hard'),

('foundation', 'nouns-detailed', 'beginner', 'Error: "The public are needs better services."', '["Remove: are", "Use: need instead of needs", "Use: is instead of are", "Multiple fixes needed"]', 3, 'Multiple errors! "are needs" is wrong. Fix: "public is" + needs OR "public are" + need. Never "are needs."', 'hard'),

('foundation', 'nouns-detailed', 'beginner', 'Which is correct American English?', '["The team have won", "The team has won", "The teams has won", "The team are won"]', 1, 'American English = singular verb with collective nouns. "The team has won" = correct American style. British = "have" OK.', 'hard');

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

SELECT 'Nouns Detailed Question Count Check' as check_name;
SELECT COUNT(*) as total_questions FROM english_questions WHERE topic_id = 'nouns-detailed';

-- Expected output: 120 questions
-- Breakdown: 24 per subtopic × 5 subtopics = 120
