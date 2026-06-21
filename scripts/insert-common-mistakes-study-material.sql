-- ============================================================================
-- COMMON MISTAKES FOR INDIAN LEARNERS - FOUNDATION ENGLISH
-- Topic ID: common-mistakes
-- Focus: Hindi L1 interference errors (word order, articles, prepositions, tense)
-- Level: A1-B1 (Beginner to Lower Intermediate)
-- Tone: Oxford British English, formal educational style
-- ============================================================================

INSERT INTO topic_study_content (
  subject_id, topic_id, path_id, title, subtitle, overview, content,
  difficulty_level, estimated_time_minutes, curriculum_standard, created_at, updated_at
) VALUES (
  'english',
  'common-mistakes',
  'foundation',
  'Common Mistakes for Indian Learners - Hindi L1 Interference',
  'Understand and correct typical errors made by Hindi speakers: word order, literal translations, articles, prepositions, and tense confusion.',
  'Foundation English lesson addressing Hindi-to-English transfer errors for A1-B1 learners',
  $$
{
    "sections": [
      {
        "id": "intro",
        "title": "Introduction: Why Hindi Speakers Make Specific Mistakes",
        "type": "overview",
        "content": {
          "main_text": "When learning English, Hindi speakers often make predictable errors due to differences in grammar, word order, and linguistic features between the two languages. These are not signs of poor learning ability but natural consequences of language transfer. Understanding these patterns helps you avoid them systematically.",
          "key_points": [
            "Hindi uses Subject-Object-Verb (SOV) word order; English uses Subject-Verb-Object (SVO)",
            "Hindi has no articles (a/an/the); English requires them in specific contexts",
            "Hindi uses postpositions (mein, par, ko); English uses prepositions (in, on, to) with different rules",
            "Hindi tense system differs from English progressive and perfect tenses",
            "Literal word-for-word translation from Hindi produces unnatural English"
          ],
          "learning_approach": "This lesson identifies five major error categories with correction strategies. Each section provides Hindi interference patterns, correct English structures, and practice exercises to retrain your language instincts."
        }
      },
      {
        "id": "core-concepts",
        "title": "Five Major Error Categories",
        "type": "concept-cards",
        "cards": [
          {
            "title": "1. Word Order Errors (SOV → SVO)",
            "definition": "Hindi places verbs at the end of sentences (Subject-Object-Verb), whilst English places verbs immediately after the subject (Subject-Verb-Object). Direct translation produces incorrect English word order.",
            "rules": [
              "English basic pattern: Subject + Verb + Object (I eat food)",
              "NOT Hindi pattern: Subject + Object + Verb (×I food eat)",
              "Adjectives before nouns in English: red car (NOT car red)",
              "Question word order: Verb before subject (Do you...? NOT You do...?)",
              "Adverb placement varies: He quickly ate (manner) / He ate quickly (neutral)"
            ],
            "examples": {
              "correct": [
                "I study English every day. (Subject-Verb-Object)",
                "She bought a beautiful red saree. (opinion + colour + noun)",
                "Do you speak Hindi? (auxiliary + subject + verb)",
                "He completed his homework yesterday. (verb + object + time)",
                "They are waiting outside. (progressive verb + location)"
              ],
              "incorrect": [
                {
                  "text": "×I English every day study.",
                  "reason": "Direct Hindi translation (main SOV). English requires: I study English every day."
                },
                {
                  "text": "×She a red beautiful saree bought.",
                  "reason": "Hindi word order (adjectives after verb). English: She bought a beautiful red saree."
                },
                {
                  "text": "×You Hindi speak?",
                  "reason": "Missing auxiliary verb. Questions need: Do you speak Hindi?"
                },
                {
                  "text": "×He his homework yesterday completed.",
                  "reason": "Verb at end (Hindi SOV). English: He completed his homework yesterday."
                },
                {
                  "text": "×They outside waiting are.",
                  "reason": "Auxiliary at end. English progressive: They are waiting outside."
                }
              ]
            }
          },
          {
            "title": "2. Article Errors (a/an/the/zero article)",
            "definition": "Hindi lacks articles entirely. English requires specific article usage: indefinite (a/an), definite (the), or zero article. Many Indian learners omit articles or overuse them incorrectly.",
            "rules": [
              "Indefinite a/an: first mention, any one item (I saw a dog)",
              "Definite the: specific item, second mention (The dog was brown)",
              "Zero article: plural general statements (Dogs are animals), uncountable (Water is essential)",
              "Use a before consonant sounds (a university, a one-hour class)",
              "Use an before vowel sounds (an apple, an hour, an MBA)"
            ],
            "examples": {
              "correct": [
                "I need a pen. (any pen, first mention)",
                "The pen you gave me is blue. (specific pen, known)",
                "Books are expensive. (general plural, no article)",
                "Water is essential for life. (uncountable, no article)",
                "She is an honest woman. (vowel sound /ɒ/, use an)"
              ],
              "incorrect": [
                {
                  "text": "×I need pen.",
                  "reason": "Missing article. Countable singular nouns require a/an/the: I need a pen."
                },
                {
                  "text": "×The books are the expensive.",
                  "reason": "Overuse of 'the'. General statements take zero article: Books are expensive."
                },
                {
                  "text": "×Give me the water.",
                  "reason": "Uncountable general noun. Correct: Give me water (general) OR Give me the water (specific bottle)."
                },
                {
                  "text": "×He is a honest man.",
                  "reason": "'Honest' starts with vowel sound /ɒ/. Use: He is an honest man."
                },
                {
                  "text": "×I go to school by the bus.",
                  "reason": "Fixed phrase 'by bus' (transport mode). Correct: I go to school by bus."
                }
              ]
            }
          },
          {
            "title": "3. Preposition Errors (in/on/at/to)",
            "definition": "Hindi uses postpositions (mein, par, ko) with different logic than English prepositions. Direct translation causes errors in time, place, and direction expressions.",
            "rules": [
              "Time: at (specific time: at 5pm), on (days: on Monday), in (months/years: in March/in 2024)",
              "Place: at (point: at the bus stop), on (surface: on the table), in (enclosed: in the room)",
              "Direction: to (movement towards: go to Delhi), into (entering: come into the house)",
              "Fixed phrases: listen to, agree with, depend on, wait for (NOT listen the, agree to, depend from, wait to)",
              "No preposition before home/here/there: go home (NOT go to home)"
            ],
            "examples": {
              "correct": [
                "I wake up at 6am every day. (specific time: at)",
                "My birthday is on 15th August. (date: on)",
                "She was born in 1995. (year: in)",
                "The book is on the table. (surface: on)",
                "They live in Mumbai. (city: in)",
                "I go home at 5pm. (no preposition before home)"
              ],
              "incorrect": [
                {
                  "text": "×I wake up in 6am.",
                  "reason": "Clock times take 'at', not 'in'. Correct: I wake up at 6am."
                },
                {
                  "text": "×My birthday is in 15th August.",
                  "reason": "Dates take 'on'. Correct: My birthday is on 15th August."
                },
                {
                  "text": "×The book is in the table.",
                  "reason": "Surface contact uses 'on'. Correct: The book is on the table."
                },
                {
                  "text": "×I go to home daily.",
                  "reason": "'Home' as adverb takes no preposition. Correct: I go home daily."
                },
                {
                  "text": "×Please listen the music.",
                  "reason": "Verb 'listen' requires preposition 'to'. Correct: Please listen to the music."
                }
              ]
            }
          },
          {
            "title": "4. Tense Errors (Simple vs Progressive vs Perfect)",
            "definition": "Hindi does not distinguish between simple and progressive aspects as English does. Indian learners often confuse ongoing actions with habitual actions, and misuse present perfect tense.",
            "rules": [
              "Present simple: habits, facts (I eat rice daily)",
              "Present progressive: ongoing now (I am eating right now)",
              "Present perfect: completed action with present relevance (I have eaten already)",
              "Past simple: completed action at specific time (I ate at 2pm)",
              "Use progressive for temporary situations (I am working in Delhi = temporary)"
            ],
            "examples": {
              "correct": [
                "I study English every day. (habit: present simple)",
                "I am studying English now. (ongoing: present progressive)",
                "I have studied English for five years. (experience: present perfect)",
                "I studied English yesterday. (completed past: past simple)",
                "She is living in Mumbai temporarily. (temporary: progressive)"
              ],
              "incorrect": [
                {
                  "text": "×I am eating rice every day.",
                  "reason": "Habits use simple tense, not progressive. Correct: I eat rice every day."
                },
                {
                  "text": "×I study English now.",
                  "reason": "Ongoing actions need progressive. Correct: I am studying English now."
                },
                {
                  "text": "×I have eaten lunch yesterday.",
                  "reason": "Specific past time needs past simple. Correct: I ate lunch yesterday."
                },
                {
                  "text": "×I am knowing the answer.",
                  "reason": "Stative verbs (know, like, want) do not take progressive. Correct: I know the answer."
                },
                {
                  "text": "×I work here since five years.",
                  "reason": "Duration with present relevance needs present perfect. Correct: I have worked here for five years."
                }
              ]
            }
          },
          {
            "title": "5. Literal Translation Errors",
            "definition": "Direct word-for-word translation from Hindi idioms, expressions, and sentence structures produces unnatural English. Learn English phrases as complete units, not Hindi translations.",
            "rules": [
              "Avoid Hindi idioms: 'I will do' ≠ Hindi 'main karunga' (context needed)",
              "Do not translate Hindi politeness markers: 'Please kindly' = redundant",
              "Avoid Hindi question patterns: 'You are coming, no?' = tag question error",
              "Use English verb patterns: 'I have doubt' → 'I have a question/I am confused'",
              "Learn collocations: 'do homework' (NOT make homework), 'take a bath' (NOT do a bath)"
            ],
            "examples": {
              "correct": [
                "I have a question about this topic. (NOT I have doubt)",
                "What is your good name? → What is your name? (standard English)",
                "I am confused about the homework. (NOT I have one doubt)",
                "She takes a bath every morning. (collocation: take a bath)",
                "Do your homework before dinner. (collocation: do homework)"
              ],
              "incorrect": [
                {
                  "text": "×What is your good name?",
                  "reason": "Direct Hindi translation ('aap ka shubh naam'). English: What is your name?"
                },
                {
                  "text": "×I have one doubt.",
                  "reason": "Hindi 'doubt' = English 'question'. Say: I have a question OR I am confused about..."
                },
                {
                  "text": "×Please do the needful.",
                  "reason": "Indian English office phrase. Standard English: Please complete the task / Please take necessary action."
                },
                {
                  "text": "×You are coming, no?",
                  "reason": "Hindi tag question pattern. English: You are coming, aren't you?"
                },
                {
                  "text": "×I will do my bath now.",
                  "reason": "Collocation error. English: I will take a bath now (NOT do a bath)."
                }
              ]
            }
          }
        ]
      },
      {
        "id": "key-rules",
        "title": "Essential Correction Rules",
        "type": "rule-cards",
        "cards": [
          {
            "title": "Rule 1: Always Use Subject-Verb-Object Order",
            "definition": "English sentences must follow SVO pattern. Place the verb immediately after the subject, followed by the object or complement.",
            "rules": [
              "Statement: Subject + Verb + Object (I like coffee)",
              "Question: Auxiliary + Subject + Verb (Do you like coffee?)",
              "Negative: Subject + Auxiliary + not + Verb (I do not like coffee)",
              "Adjective placement: before noun (beautiful house)",
              "Adverb of manner: usually after verb (speak clearly)"
            ],
            "examples": {
              "correct": [
                "I read books every evening.",
                "She speaks English fluently.",
                "Do you understand the lesson?",
                "They did not attend the meeting.",
                "We have completed the project."
              ],
              "incorrect": [
                {
                  "text": "×I books every evening read.",
                  "reason": "Verb at end (Hindi SOV). Use: I read books every evening (SVO)."
                }
              ]
            }
          },
          {
            "title": "Rule 2: Never Omit Articles Before Singular Countable Nouns",
            "definition": "Every singular countable noun in English requires an article (a/an/the) or determiner (my/this/some). Hindi speakers often omit articles because Hindi lacks them.",
            "rules": [
              "First mention: use a/an (I saw a dog)",
              "Second mention / Specific: use the (The dog was friendly)",
              "General plural: no article (Dogs are animals)",
              "Uncountable: no article for general (I drink water), the for specific (The water in this bottle)",
              "Jobs/Professions: use a/an (He is a teacher)"
            ],
            "examples": {
              "correct": [
                "I need a pen to write.",
                "The pen you lent me is very good.",
                "She is a doctor at Apollo Hospital.",
                "Doctors work very hard. (general, no article)",
                "Water is essential. (uncountable general, no article)"
              ],
              "incorrect": [
                {
                  "text": "×I need pen to write.",
                  "reason": "Singular countable 'pen' needs article. Use: I need a pen."
                }
              ]
            }
          },
          {
            "title": "Rule 3: Master Time Prepositions (at/on/in)",
            "definition": "English uses specific prepositions for time expressions. Hindi uses one word (ko/mein/par) for multiple English prepositions, causing confusion.",
            "rules": [
              "at: clock times, night, specific moments (at 5pm, at night, at noon)",
              "on: days, dates (on Monday, on 15th August, on Christmas Day)",
              "in: months, years, seasons, centuries, parts of day except night (in March, in 2024, in summer, in the morning)",
              "No preposition: next/last/this/every (next Monday, last year, this evening, every day)",
              "Fixed phrases: at the moment, on time, in time, at once"
            ],
            "examples": {
              "correct": [
                "The meeting starts at 10am on Monday.",
                "I was born in 1998 in the month of March.",
                "We celebrate Diwali in October or November.",
                "I wake up at 6am in the morning.",
                "She will arrive on Tuesday at noon."
              ],
              "incorrect": [
                {
                  "text": "×The meeting starts in 10am.",
                  "reason": "Clock time uses 'at'. Use: The meeting starts at 10am."
                }
              ]
            }
          },
          {
            "title": "Rule 4: Distinguish Simple and Progressive Tenses",
            "definition": "Use simple tenses for habits, facts, and completed actions. Use progressive (continuous) tenses only for ongoing, temporary, or developing situations.",
            "rules": [
              "Present simple: habits, routines, facts (I work in Delhi, Water boils at 100°C)",
              "Present progressive: happening now, temporary situations (I am working on a project)",
              "Past simple: completed action at specific time (I worked there in 2020)",
              "Past progressive: ongoing action in the past (I was working when you called)",
              "Do NOT use progressive with stative verbs: know, understand, like, want, need, believe"
            ],
            "examples": {
              "correct": [
                "I work in Mumbai. (permanent job: simple)",
                "I am working on a special project this month. (temporary: progressive)",
                "I know the answer. (stative verb: simple only)",
                "She was sleeping when I arrived. (ongoing past: progressive)",
                "They visited Agra last year. (completed past: simple)"
              ],
              "incorrect": [
                {
                  "text": "×I am knowing the answer.",
                  "reason": "'Know' is stative, cannot be progressive. Use: I know the answer."
                }
              ]
            }
          },
          {
            "title": "Rule 5: Avoid Direct Hindi Translations",
            "definition": "Learn English phrases as complete units. Hindi expressions do not translate word-for-word into natural English. Memorise common English collocations and idioms.",
            "rules": [
              "Replace 'I have doubt' → I have a question / I am confused",
              "Replace 'What is your good name?' → What is your name?",
              "Replace 'Do the needful' → Complete the task / Take necessary action",
              "Learn verb collocations: do homework, make a mistake, take a bath, have breakfast",
              "Learn adjective-noun collocations: strong tea, heavy rain, fast car (NOT hard tea, big rain, quick car)"
            ],
            "examples": {
              "correct": [
                "I have a question about the homework.",
                "What is your name?",
                "Please complete the task by Friday.",
                "I take a bath every morning.",
                "We had a heavy rain last night."
              ],
              "incorrect": [
                {
                  "text": "×I have one doubt in homework.",
                  "reason": "Hindi 'doubt' ≠ English 'doubt'. Use: I have a question about the homework."
                }
              ]
            }
          }
        ]
      },
      {
        "id": "common-mistakes",
        "title": "Five Most Common Error Patterns",
        "type": "mistake-pattern-cards",
        "cards": [
          {
            "title": "Mistake Pattern 1: Verb Placement at Sentence End",
            "definition": "Hindi speakers place the main verb at the end of sentences because Hindi follows SOV (Subject-Object-Verb) order. English requires SVO (Subject-Verb-Object) order with the verb immediately after the subject.",
            "rules": [
              "English basic order: Subject + Verb + Object + Other elements",
              "Place verb right after subject, even in complex sentences",
              "Objects and complements come AFTER the verb",
              "Time expressions usually go at the end or beginning, not between subject and verb",
              "Question order: Auxiliary + Subject + Main Verb + Object"
            ],
            "examples": {
              "correct": [
                "I completed my homework yesterday evening.",
                "She teaches mathematics at the university.",
                "They will visit Mumbai next month.",
                "We have finished all the preparations.",
                "Did you understand the lecture?"
              ],
              "incorrect": [
                {
                  "text": "×I my homework yesterday evening completed.",
                  "reason": "Verb 'completed' must come after subject 'I', not at end. Correct: I completed my homework yesterday evening."
                },
                {
                  "text": "×She at the university mathematics teaches.",
                  "reason": "Verb 'teaches' must follow subject 'She'. Correct: She teaches mathematics at the university."
                },
                {
                  "text": "×They next month Mumbai will visit.",
                  "reason": "Auxiliary 'will' and verb 'visit' must stay together after subject. Correct: They will visit Mumbai next month."
                },
                {
                  "text": "×You the lecture understood?",
                  "reason": "Questions need auxiliary: Did you understand the lecture? (NOT You understood the lecture?)"
                },
                {
                  "text": "×I English every day study.",
                  "reason": "Verb 'study' must come after subject 'I'. Correct: I study English every day."
                }
              ]
            }
          },
          {
            "title": "Mistake Pattern 2: Missing or Incorrect Articles",
            "definition": "Hindi has no article system. Indian learners often omit articles entirely or use 'the' incorrectly for all nouns. English requires precise article usage based on whether the noun is countable, specific, or mentioned before.",
            "rules": [
              "Singular countable nouns always need a/an/the or determiner (my, this, that)",
              "Use 'a/an' for first mention or any one item",
              "Use 'the' for specific items, second mention, or unique things",
              "No article for: plural general statements, uncountable general nouns, abstract concepts",
              "Fixed phrases: go to school/work/bed (no article), at the moment, in the morning"
            ],
            "examples": {
              "correct": [
                "I saw a snake in the garden. The snake was very long.",
                "She is a teacher at a private school.",
                "Books are expensive nowadays. (general plural)",
                "I need water to drink. (uncountable general)",
                "The sun rises in the east. (unique thing)"
              ],
              "incorrect": [
                {
                  "text": "×I saw snake in garden.",
                  "reason": "Singular countable needs article. Correct: I saw a snake in the garden."
                },
                {
                  "text": "×She is teacher at school.",
                  "reason": "Professions need 'a/an'. Correct: She is a teacher at a school."
                },
                {
                  "text": "×The books are the expensive.",
                  "reason": "General plural takes no article; adjective 'expensive' takes no article. Correct: Books are expensive."
                },
                {
                  "text": "×I need the water to drink.",
                  "reason": "General uncountable takes no article. Correct: I need water to drink (unless referring to specific water: the water in that bottle)."
                },
                {
                  "text": "×I go to the school daily.",
                  "reason": "Fixed phrase 'go to school' (activity). Use article only for building: I went to the school to meet the principal."
                }
              ]
            }
          },
          {
            "title": "Mistake Pattern 3: Time Preposition Confusion",
            "definition": "Hindi uses the same postposition (ko, mein, par) for different time expressions. English requires specific prepositions (at/on/in) depending on whether you are talking about clock time, days, or longer periods.",
            "rules": [
              "at: specific clock times (at 5pm, at midnight), festivals (at Diwali), meal times (at lunch)",
              "on: days of week (on Monday), dates (on 26th January), specific day parts (on Monday morning)",
              "in: months (in March), years (in 2024), seasons (in summer), centuries (in the 21st century), general day parts (in the morning/afternoon/evening)",
              "at night (exception: 'night' takes 'at', not 'in')",
              "No preposition with: next, last, this, every, tomorrow, yesterday"
            ],
            "examples": {
              "correct": [
                "I wake up at 6am in the morning.",
                "My exam is on 15th June at 10am.",
                "India became independent in 1947 in the month of August.",
                "We have a holiday on Monday.",
                "I will call you at night after dinner."
              ],
              "incorrect": [
                {
                  "text": "×I wake up in 6am at the morning.",
                  "reason": "Clock time uses 'at'; general morning uses 'in'. Correct: I wake up at 6am in the morning."
                },
                {
                  "text": "×My exam is in 15th June.",
                  "reason": "Dates use 'on'. Correct: My exam is on 15th June."
                },
                {
                  "text": "×India became independent at 1947.",
                  "reason": "Years use 'in'. Correct: India became independent in 1947."
                },
                {
                  "text": "×I will meet you in night.",
                  "reason": "'Night' is exception using 'at'. Correct: I will meet you at night."
                },
                {
                  "text": "×See you on tomorrow morning.",
                  "reason": "'Tomorrow' needs no preposition. Correct: See you tomorrow morning."
                }
              ]
            }
          },
          {
            "title": "Mistake Pattern 4: Overusing Progressive Tenses",
            "definition": "Hindi does not distinguish between simple and progressive aspects the way English does. Indian learners often use progressive tenses for habitual actions, or incorrectly with stative verbs that express states rather than actions.",
            "rules": [
              "Use present simple for: habits, routines, facts, permanent situations (I work in Delhi)",
              "Use present progressive for: actions happening now, temporary situations (I am working on a project)",
              "Do NOT use progressive with stative verbs: know, understand, like, love, want, need, believe, own, belong, seem, appear",
              "Past simple for completed actions at specific times; past progressive for ongoing background actions",
              "Use present perfect for life experiences or actions with present relevance (I have worked here for 5 years)"
            ],
            "examples": {
              "correct": [
                "I drink tea every morning. (habit: simple)",
                "I am drinking tea right now. (ongoing: progressive)",
                "I know the answer. (stative verb: simple only)",
                "She lives in Mumbai. (permanent: simple)",
                "She is living with her aunt this month. (temporary: progressive)"
              ],
              "incorrect": [
                {
                  "text": "×I am drinking tea every morning.",
                  "reason": "Habits use simple tense. Correct: I drink tea every morning (habit) OR I am drinking tea now (current action)."
                },
                {
                  "text": "×I am knowing the answer.",
                  "reason": "'Know' is stative verb (mental state), cannot be progressive. Correct: I know the answer."
                },
                {
                  "text": "×She is living in Mumbai.",
                  "reason": "Ambiguous. Use simple for permanent: She lives in Mumbai. Use progressive only for temporary: She is living with friends while looking for a flat."
                },
                {
                  "text": "×I am having a car.",
                  "reason": "'Have' (possession) is stative. Correct: I have a car. (But 'have' for experiences can be progressive: I am having lunch now.)"
                },
                {
                  "text": "×I am understanding English better now.",
                  "reason": "'Understand' is stative. Correct: I understand English better now."
                }
              ]
            }
          },
          {
            "title": "Mistake Pattern 5: Literal Hindi Phrase Translations",
            "definition": "Hindi idioms, polite expressions, and common phrases do not translate directly into English. Indian English has developed unique expressions ('do the needful', 'I have doubt') that are non-standard in British or American English.",
            "rules": [
              "Replace 'I have doubt' → I have a question / I am unsure / I am confused about",
              "Replace 'What is your good name?' → What is your name? (standard greeting)",
              "Replace 'Do the needful' → Please complete the task / Please take necessary action",
              "Replace 'I will do' → I will do it / I will complete it (need object)",
              "Learn English collocations: do homework, make a mistake, take a bath, have breakfast (NOT make homework, do a mistake, do a bath, eat breakfast)"
            ],
            "examples": {
              "correct": [
                "I have a question about the homework.",
                "What is your name? (standard English)",
                "Please complete the report by Friday.",
                "I will finish the task by evening.",
                "I take a bath every morning before breakfast."
              ],
              "incorrect": [
                {
                  "text": "×I have one doubt in this chapter.",
                  "reason": "Hindi 'doubt' (shanka) = English 'question' or 'confusion'. Correct: I have a question about this chapter OR I am confused about this chapter."
                },
                {
                  "text": "×What is your good name, sir?",
                  "reason": "Direct Hindi translation (aap ka shubh naam). Standard English: What is your name? (Add 'sir' at end if needed: What is your name, sir?)"
                },
                {
                  "text": "×Please do the needful at the earliest.",
                  "reason": "Indian English business phrase. Standard: Please complete the task as soon as possible."
                },
                {
                  "text": "×I will do my bath now.",
                  "reason": "Collocation error. English: take a bath (NOT do a bath). Correct: I will take a bath now."
                },
                {
                  "text": "×You are coming to the party, no?",
                  "reason": "Hindi tag question pattern (aap aa rahe ho, na?). English tag questions use auxiliary: You are coming to the party, aren't you?"
                }
              ]
            }
          }
        ]
      },
      {
        "id": "practice",
        "title": "Correction Practice Exercises",
        "type": "practice-exercises",
        "cards": [
          {
            "title": "Exercise 1: Correct the Word Order",
            "definition": "Rewrite these sentences using correct English SVO word order. Identify where the verb has been incorrectly placed at the end.",
            "rules": [
              "Step 1: Identify the subject (who/what does the action)",
              "Step 2: Find the main verb (the action word)",
              "Step 3: Place verb immediately after subject",
              "Step 4: Add object or complement after the verb",
              "Step 5: Put time/place expressions at the end or beginning"
            ],
            "examples": {
              "correct": [
                "I read the newspaper every morning. (Subject-Verb-Object-Time)",
                "She completed the project yesterday. (Subject-Verb-Object-Time)",
                "They will visit Delhi next week. (Subject-Auxiliary-Verb-Object-Time)"
              ],
              "incorrect": [
                {
                  "text": "×I the newspaper every morning read. → CORRECT: I read the newspaper every morning.",
                  "reason": "Move 'read' after subject 'I'. English: Subject + Verb + Object + Time."
                },
                {
                  "text": "×She the project yesterday completed. → CORRECT: She completed the project yesterday.",
                  "reason": "Place 'completed' right after subject 'She'."
                },
                {
                  "text": "×My brother in Delhi lives. → CORRECT: My brother lives in Delhi.",
                  "reason": "Verb 'lives' must follow subject 'My brother'."
                },
                {
                  "text": "×We tomorrow morning early the train will catch. → CORRECT: We will catch the train early tomorrow morning.",
                  "reason": "Keep auxiliary 'will' and verb 'catch' together after subject. Time expressions at the end."
                },
                {
                  "text": "×The students the exam carefully are writing. → CORRECT: The students are writing the exam carefully.",
                  "reason": "Progressive verb 'are writing' must stay together after subject. Adverb 'carefully' at the end."
                }
              ]
            }
          },
          {
            "title": "Exercise 2: Add Missing Articles (a/an/the)",
            "definition": "Insert the correct article (a, an, the, or no article) in the blank spaces. Pay attention to whether the noun is countable, specific, or mentioned before.",
            "rules": [
              "First mention of singular countable: a/an",
              "Second mention or specific item: the",
              "Plural general statements: no article",
              "Uncountable general: no article",
              "Jobs/Professions: a/an"
            ],
            "examples": {
              "correct": [
                "I bought a book yesterday. The book is about Indian history.",
                "She is an engineer at a multinational company.",
                "Apples are expensive this season. (no article for general plural)"
              ],
              "incorrect": [
                {
                  "text": "×I bought book yesterday. → CORRECT: I bought a book yesterday. (first mention: a)",
                  "reason": "Singular countable 'book' needs article 'a' on first mention."
                },
                {
                  "text": "×She is engineer at company. → CORRECT: She is an engineer at a company.",
                  "reason": "Profession 'engineer' starts with vowel sound (an); company is countable (a)."
                },
                {
                  "text": "×The apples are the expensive. → CORRECT: Apples are expensive. (no articles for general statement)",
                  "reason": "General plural 'apples' and adjective 'expensive' take no article."
                },
                {
                  "text": "×I need the water to drink. → CORRECT: I need water to drink. (general uncountable: no article)",
                  "reason": "Uncountable 'water' used generally takes no article. Use 'the water' only for specific water."
                },
                {
                  "text": "×Sun rises in east. → CORRECT: The sun rises in the east. (unique things: the)",
                  "reason": "Unique objects (sun, moon, earth) and cardinal directions (east, west) take 'the'."
                }
              ]
            }
          },
          {
            "title": "Exercise 3: Choose Correct Time Preposition (at/on/in)",
            "definition": "Select the appropriate preposition (at, on, or in) for each time expression. Remember the rules: at for clock times, on for days/dates, in for months/years.",
            "rules": [
              "at: 5pm, noon, midnight, night, the moment, Diwali",
              "on: Monday, 26th January, Christmas Day, Monday morning",
              "in: March, 2024, summer, the 21st century, the morning/afternoon/evening",
              "No preposition: next Monday, last year, this evening, tomorrow, yesterday"
            ],
            "examples": {
              "correct": [
                "The meeting is at 3pm on Tuesday afternoon.",
                "I was born in 1995 in the month of May.",
                "We celebrate Holi in March."
              ],
              "incorrect": [
                {
                  "text": "×The meeting is in 3pm. → CORRECT: The meeting is at 3pm.",
                  "reason": "Clock times take 'at', not 'in'."
                },
                {
                  "text": "×I was born at 1995. → CORRECT: I was born in 1995.",
                  "reason": "Years take 'in', not 'at'."
                },
                {
                  "text": "×My birthday is in 26th January. → CORRECT: My birthday is on 26th January.",
                  "reason": "Dates take 'on', not 'in'."
                },
                {
                  "text": "×I will call you in night. → CORRECT: I will call you at night.",
                  "reason": "'Night' is the exception that takes 'at', not 'in'."
                },
                {
                  "text": "×See you on next Monday. → CORRECT: See you next Monday. (no preposition with 'next')",
                  "reason": "'Next', 'last', 'this', 'every' take no preposition."
                }
              ]
            }
          },
          {
            "title": "Exercise 4: Fix Tense Errors (Simple vs Progressive)",
            "definition": "Correct the tense mistakes. Decide whether the sentence needs simple tense (habits, facts) or progressive tense (ongoing, temporary). Watch out for stative verbs.",
            "rules": [
              "Habits/Routines: present simple (I work, I eat)",
              "Ongoing now: present progressive (I am working, I am eating)",
              "Stative verbs (know, understand, like, want, need, own, believe): simple only, never progressive",
              "Temporary situations: progressive (I am living with friends this month)",
              "Permanent situations: simple (I live in Mumbai)"
            ],
            "examples": {
              "correct": [
                "I drink coffee every morning. (habit: simple)",
                "I am drinking coffee right now. (ongoing: progressive)",
                "I know the answer. (stative: simple only)"
              ],
              "incorrect": [
                {
                  "text": "×I am drinking coffee every morning. → CORRECT: I drink coffee every morning.",
                  "reason": "Habits use simple tense, not progressive."
                },
                {
                  "text": "×I am knowing the answer. → CORRECT: I know the answer.",
                  "reason": "'Know' is stative verb (mental state), cannot be progressive."
                },
                {
                  "text": "×She is living in Delhi. → CORRECT: She lives in Delhi. (if permanent) OR She is living in Delhi temporarily. (if temporary)",
                  "reason": "Clarify permanent (simple) vs temporary (progressive)."
                },
                {
                  "text": "×I am having a car. → CORRECT: I have a car.",
                  "reason": "'Have' for possession is stative. (But experiences can be progressive: I am having lunch now.)"
                },
                {
                  "text": "×He is understanding English. → CORRECT: He understands English. OR He is improving his English. (for development)",
                  "reason": "'Understand' is stative. Use 'improving' if you mean gradual development."
                }
              ]
            }
          },
          {
            "title": "Exercise 5: Replace Hindi-English Phrases with Standard English",
            "definition": "Identify the Indian English expression and rewrite it in standard British or American English. Focus on common Hindi translations that do not work in English.",
            "rules": [
              "I have doubt → I have a question / I am confused",
              "What is your good name? → What is your name?",
              "Do the needful → Complete the task / Take necessary action",
              "Collocation fixes: take a bath (NOT do a bath), do homework (NOT make homework)",
              "Tag questions: aren't you? (NOT no? / isn't it?)"
            ],
            "examples": {
              "correct": [
                "I have a question about Question 5.",
                "What is your name?",
                "Please complete the report by Friday."
              ],
              "incorrect": [
                {
                  "text": "×I have one doubt in Question 5. → CORRECT: I have a question about Question 5. OR I am confused about Question 5.",
                  "reason": "Hindi 'doubt' (shanka) = English 'question'. 'Doubt' in English means lack of trust."
                },
                {
                  "text": "×What is your good name? → CORRECT: What is your name?",
                  "reason": "Direct Hindi translation (shubh naam). Standard English omits 'good'."
                },
                {
                  "text": "×Please do the needful. → CORRECT: Please complete the task. OR Please take the necessary action.",
                  "reason": "Indian English phrase. Standard English needs specific verb."
                },
                {
                  "text": "×I will do my bath now. → CORRECT: I will take a bath now.",
                  "reason": "Collocation: take a bath (NOT do a bath)."
                },
                {
                  "text": "×You are going to the party, no? → CORRECT: You are going to the party, aren't you?",
                  "reason": "Hindi tag question (na?). English uses auxiliary in negative: aren't you?"
                }
              ]
            }
          }
        ]
      },
      {
        "id": "revision",
        "title": "Quick Revision - Ten Essential Points",
        "type": "revision-checklist",
        "points": [
          {
            "number": 1,
            "point": "Always use Subject-Verb-Object (SVO) word order in English sentences.",
            "example": "I read books (NOT I books read)."
          },
          {
            "number": 2,
            "point": "Never omit articles before singular countable nouns.",
            "example": "I need a pen (NOT I need pen)."
          },
          {
            "number": 3,
            "point": "Use 'at' for clock times, 'on' for days/dates, 'in' for months/years.",
            "example": "at 5pm, on Monday, in March, in 2024."
          },
          {
            "number": 4,
            "point": "Place adjectives before nouns in English (opposite of Hindi).",
            "example": "a beautiful house (NOT a house beautiful)."
          },
          {
            "number": 5,
            "point": "Use simple tenses for habits and facts; progressive tenses only for ongoing or temporary situations.",
            "example": "I work in Delhi (permanent) vs I am working on a project (temporary)."
          },
          {
            "number": 6,
            "point": "Never use progressive tenses with stative verbs (know, understand, like, want, need, own, believe).",
            "example": "I know the answer (NOT I am knowing)."
          },
          {
            "number": 7,
            "point": "Replace 'I have doubt' with 'I have a question' or 'I am confused'.",
            "example": "I have a question about the homework (NOT I have doubt in homework)."
          },
          {
            "number": 8,
            "point": "Use standard greeting: 'What is your name?' (not 'What is your good name?').",
            "example": "What is your name? (Drop 'good' completely)."
          },
          {
            "number": 9,
            "point": "Learn English collocations as fixed units: do homework, take a bath, make a mistake, have breakfast.",
            "example": "I take a bath every morning (NOT I do my bath)."
          },
          {
            "number": 10,
            "point": "Form tag questions with auxiliary verbs, not 'no' or 'isn't it'.",
            "example": "You are coming, aren't you? (NOT You are coming, no?)."
          }
        ]
      }
    ]
}
$$::jsonb,
  'beginner',
  180,
  'CEFR-A1-B1',
  NOW(),
  NOW()
)
ON CONFLICT (subject_id, topic_id, path_id)
DO UPDATE SET
  content = EXCLUDED.content,
  difficulty_level = EXCLUDED.difficulty_level,
  estimated_time_minutes = EXCLUDED.estimated_time_minutes,
  updated_at = NOW();
