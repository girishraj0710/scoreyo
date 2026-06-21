-- ============================================================================
-- IDIOMS & EXPRESSIONS - FOUNDATION ENGLISH
-- Topic ID: idioms-expressions
-- Focus: 50+ essential British English idioms grouped by theme (emotions, success, time, communication)
-- Level: A1-B1 (Beginner to Lower Intermediate)
-- Tone: Oxford British English, formal educational style (NO emojis, NO markdown headers)
-- ============================================================================

INSERT INTO topic_study_content (
  subject_id, topic_id, path_id, title, subtitle, overview, content,
  difficulty_level, estimated_time_minutes, curriculum_standard, created_at, updated_at
) VALUES (
  'english',
  'idioms-expressions',
  'foundation',
  'Idioms and Expressions - Essential British English Phrases',
  'Master 50+ common idioms grouped by theme: emotions, success and failure, time management, and communication for natural English fluency.',
  'Foundation English lesson covering essential British English idioms and expressions for A1-B1 learners',
  $$
{
    "sections": [
      {
        "id": "intro",
        "title": "Introduction: What Are Idioms and Why Learn Them?",
        "type": "overview",
        "content": {
          "main_text": "Idioms are fixed phrases whose meaning cannot be understood from the individual words alone. For example, 'break the ice' does not mean physically breaking ice; it means to initiate conversation in an awkward situation. Native speakers use idioms naturally in everyday speech, making them essential for fluency and comprehension in real-world English.",
          "key_points": [
            "Idioms are cultural expressions with non-literal meanings",
            "Understanding idioms improves listening comprehension in films, podcasts, and conversations",
            "Using idioms appropriately demonstrates advanced language mastery",
            "Idioms vary by region (British vs American English) but share many common expressions",
            "Context determines appropriateness: formal idioms for exams, casual idioms for friends"
          ],
          "learning_approach": "This lesson organises 50+ idioms into four thematic groups: emotions, success and failure, time management, and communication. Each idiom includes its meaning, example sentences, and usage notes. Practise using idioms in context rather than memorising isolated phrases."
        }
      },
      {
        "id": "core-concepts",
        "title": "50+ Essential Idioms by Theme",
        "type": "concept-cards",
        "cards": [
          {
            "title": "1. Emotions and Feelings (12 idioms)",
            "definition": "Idioms describing emotional states help express feelings vividly. These phrases add colour to your speech and writing, making your English more engaging and natural.",
            "rules": [
              "Over the moon = extremely happy (She was over the moon when she got the job.)",
              "Down in the dumps = feeling sad or depressed (He's been down in the dumps since his team lost.)",
              "On edge = nervous or anxious (I'm on edge about tomorrow's exam.)",
              "In high spirits = cheerful and energetic (The children were in high spirits during the festival.)",
              "Cold feet = sudden nervousness before an event (She got cold feet before the wedding.)",
              "A weight off one's shoulders = relief from stress (Finishing the project was a weight off my shoulders.)",
              "Walk on air = feeling extremely happy (He was walking on air after winning the competition.)",
              "Green with envy = extremely jealous (She turned green with envy when she saw his new car.)",
              "Hot under the collar = angry or annoyed (He got hot under the collar when I questioned his decision.)",
              "A shoulder to cry on = someone who listens to your problems (She's always been a shoulder to cry on.)",
              "Bite one's tongue = stop oneself from speaking (I had to bite my tongue to avoid arguing.)",
              "Keep one's chin up = remain positive in difficult times (Keep your chin up; things will improve.)"
            ],
            "examples": {
              "correct": [
                "After passing the exam, I was over the moon with joy.",
                "She felt down in the dumps after hearing the bad news.",
                "Before the interview, I was on edge and couldn't relax.",
                "Despite the rain, the team remained in high spirits.",
                "He got cold feet just before proposing marriage.",
                "Completing the assignment was a weight off my shoulders.",
                "She walked on air when she received the scholarship.",
                "I was green with envy when my friend bought a new phone.",
                "My father got hot under the collar when I came home late.",
                "During tough times, my sister is always a shoulder to cry on.",
                "I bit my tongue when my colleague criticised my work unfairly.",
                "Even though you failed, keep your chin up and try again."
              ],
              "incorrect": [
                {
                  "text": "×I was on the moon when I passed.",
                  "reason": "Wrong preposition. Correct: over the moon (fixed phrase)."
                },
                {
                  "text": "×She's in the dumps down.",
                  "reason": "Incorrect word order. Correct: down in the dumps."
                },
                {
                  "text": "×I'm on the edge about exam.",
                  "reason": "Wrong article and preposition. Correct: on edge about the exam."
                },
                {
                  "text": "×He walked in air.",
                  "reason": "Wrong preposition. Correct: walk on air (not 'in')."
                },
                {
                  "text": "×She became green of envy.",
                  "reason": "Wrong preposition. Correct: green with envy (not 'of')."
                }
              ]
            }
          },
          {
            "title": "2. Success and Failure (13 idioms)",
            "definition": "Idioms related to success and failure describe achievement, effort, and setbacks. These expressions are commonly used in academic, professional, and competitive contexts.",
            "rules": [
              "Ace it = perform excellently (She aced the maths test.)",
              "Hit the nail on the head = be exactly right (Your analysis hit the nail on the head.)",
              "A piece of cake = very easy (The grammar quiz was a piece of cake.)",
              "Break new ground = do something innovative (Their research breaks new ground in science.)",
              "Come out on top = win or succeed (After months of hard work, he came out on top.)",
              "Go the extra mile = make extra effort (She always goes the extra mile to help students.)",
              "Back to the drawing board = start again after failure (The plan failed; it's back to the drawing board.)",
              "Miss the boat = lose an opportunity (I missed the boat by not applying early.)",
              "Throw in the towel = give up (He threw in the towel after failing twice.)",
              "A long shot = unlikely to succeed (Winning the lottery is a long shot.)",
              "Cut corners = do something poorly to save time or money (Don't cut corners on your revision.)",
              "Burn the midnight oil = work late into the night (She burnt the midnight oil to finish her essay.)",
              "Pull one's weight = do one's fair share of work (Everyone must pull their weight in group projects.)"
            ],
            "examples": {
              "correct": [
                "She aced the presentation and impressed everyone.",
                "Your explanation hit the nail on the head perfectly.",
                "The English test was a piece of cake for advanced students.",
                "Their start-up breaks new ground in renewable energy technology.",
                "After years of practice, he came out on top in the competition.",
                "Teachers who go the extra mile make a real difference.",
                "The prototype failed, so we're back to the drawing board.",
                "I missed the boat on that scholarship because I submitted late.",
                "After three failed attempts, he threw in the towel.",
                "Getting into IIT without coaching is a long shot but possible.",
                "Avoid cutting corners when preparing for important exams.",
                "Students burn the midnight oil during exam season.",
                "In team assignments, everyone must pull their weight equally."
              ],
              "incorrect": [
                {
                  "text": "×She made an ace on the test.",
                  "reason": "Incorrect verb. Use 'aced' as a verb: She aced the test."
                },
                {
                  "text": "×He hit the head on the nail.",
                  "reason": "Wrong word order. Correct: hit the nail on the head."
                },
                {
                  "text": "×It was a cake piece for me.",
                  "reason": "Wrong word order. Correct: a piece of cake (fixed phrase)."
                },
                {
                  "text": "×Let's go back to drawing board.",
                  "reason": "Missing article. Correct: back to the drawing board."
                },
                {
                  "text": "×He burned the oil at midnight.",
                  "reason": "Incorrect phrase structure. Correct: burn the midnight oil."
                }
              ]
            }
          },
          {
            "title": "3. Time Management (13 idioms)",
            "definition": "Time-related idioms express urgency, delay, or the passing of time. These phrases are useful for describing deadlines, schedules, and daily routines.",
            "rules": [
              "In the nick of time = just before it's too late (I caught the train in the nick of time.)",
              "Beat the clock = finish before a deadline (We beat the clock and submitted on time.)",
              "Against the clock = working with little time (We're racing against the clock to finish.)",
              "Kill time = spend time doing nothing important (I killed time reading magazines.)",
              "Call it a day = stop working for the day (It's 6 PM; let's call it a day.)",
              "Round the clock = continuously, 24 hours (The hospital operates round the clock.)",
              "At the eleventh hour = at the last possible moment (He completed the assignment at the eleventh hour.)",
              "Time flies = time passes quickly (Time flies when you're having fun.)",
              "Better late than never = it's better to do something late than not at all (You submitted late, but better late than never.)",
              "The early bird catches the worm = those who act early get advantages (Start revision early; the early bird catches the worm.)",
              "Turn back the clock = return to an earlier time (impossible) (I wish I could turn back the clock and study harder.)",
              "Buy time = delay to gain an advantage (He's buying time until help arrives.)",
              "Run out of time = have no time left (I ran out of time during the exam.)"
            ],
            "examples": {
              "correct": [
                "I arrived in the nick of time before the meeting started.",
                "We beat the clock by finishing the project one hour early.",
                "The team worked against the clock to meet the tight deadline.",
                "While waiting for my friend, I killed time browsing my phone.",
                "After eight hours of work, we decided to call it a day.",
                "Emergency services are available round the clock every day.",
                "He submitted his application at the eleventh hour.",
                "Childhood memories fade quickly because time flies.",
                "You're an hour late, but better late than never.",
                "Start studying early; the early bird catches the worm.",
                "I wish I could turn back the clock and prepare better.",
                "The negotiator is buying time whilst waiting for reinforcements.",
                "I ran out of time and couldn't answer the last question."
              ],
              "incorrect": [
                {
                  "text": "×I came at the nick of time.",
                  "reason": "Wrong preposition. Correct: in the nick of time (not 'at')."
                },
                {
                  "text": "×We're working on the clock.",
                  "reason": "Incorrect preposition. Correct: against the clock (indicates pressure)."
                },
                {
                  "text": "×Let's call the day.",
                  "reason": "Missing 'it'. Correct: call it a day (fixed phrase)."
                },
                {
                  "text": "×The shop opens around the clock.",
                  "reason": "Wrong preposition. Correct: round the clock (not 'around')."
                },
                {
                  "text": "×He finished in the eleventh hour.",
                  "reason": "Wrong preposition. Correct: at the eleventh hour (not 'in')."
                }
              ]
            }
          },
          {
            "title": "4. Communication and Speech (12 idioms)",
            "definition": "Communication idioms describe how we share information, argue, or discuss topics. These expressions are essential for describing conversations and interactions.",
            "rules": [
              "Break the ice = start a conversation in an awkward situation (He told a joke to break the ice.)",
              "Spill the beans = reveal a secret (She accidentally spilt the beans about the surprise party.)",
              "Let the cat out of the bag = reveal a secret unintentionally (He let the cat out of the bag before the announcement.)",
              "Beat around the bush = avoid saying something directly (Stop beating around the bush and tell me the truth.)",
              "Get straight to the point = speak directly without unnecessary details (Let's get straight to the point; what do you want?)",
              "Clear the air = resolve misunderstandings (We need to clear the air about yesterday's argument.)",
              "Put one's foot in one's mouth = say something embarrassing or inappropriate (I put my foot in my mouth by mentioning her ex-boyfriend.)",
              "Speak one's mind = express one's opinion honestly (She always speaks her mind, even if it's uncomfortable.)",
              "Have a word with someone = speak to someone privately (Can I have a word with you after class?)",
              "Spread like wildfire = news spreading very quickly (Rumours spread like wildfire in small towns.)",
              "Hear it on the grapevine = hear gossip or unofficial information (I heard on the grapevine that the school is closing.)",
              "Talk at cross purposes = have a conversation where people misunderstand each other (We were talking at cross purposes because I meant something else.)"
            ],
            "examples": {
              "correct": [
                "At the party, he broke the ice by asking about everyone's hobbies.",
                "Please don't spill the beans about my promotion yet.",
                "He let the cat out of the bag by mentioning the surprise trip.",
                "Stop beating around the bush and tell me what happened.",
                "In business meetings, it's best to get straight to the point.",
                "After the misunderstanding, they cleared the air with an honest discussion.",
                "I put my foot in my mouth by asking if she'd lost weight.",
                "She's known for speaking her mind regardless of others' opinions.",
                "The manager wants to have a word with you about the report.",
                "News of the scandal spread like wildfire across social media.",
                "I heard on the grapevine that there's a new policy coming.",
                "We were talking at cross purposes because I thought you meant yesterday."
              ],
              "incorrect": [
                {
                  "text": "×He made the ice break.",
                  "reason": "Wrong verb form. Correct: break the ice (as a verb phrase)."
                },
                {
                  "text": "×She spilled beans on the secret.",
                  "reason": "Missing article. Correct: spill the beans (fixed phrase)."
                },
                {
                  "text": "×He let out the cat from the bag.",
                  "reason": "Incorrect preposition. Correct: let the cat out of the bag."
                },
                {
                  "text": "×Stop hitting around the bush.",
                  "reason": "Wrong verb. Correct: beating around the bush (not 'hitting')."
                },
                {
                  "text": "×I put my leg in my mouth.",
                  "reason": "Wrong body part. Correct: put one's foot in one's mouth (not 'leg')."
                }
              ]
            }
          },
          {
            "title": "5. Bonus: Mixed Everyday Idioms (10 idioms)",
            "definition": "Common idioms that don't fit into a single category but are frequently used in everyday British English. These expressions enhance conversational fluency.",
            "rules": [
              "Cost an arm and a leg = be very expensive (That car costs an arm and a leg.)",
              "Once in a blue moon = very rarely (I see him once in a blue moon.)",
              "Under the weather = feeling ill (I'm feeling under the weather today.)",
              "Bite off more than one can chew = take on too much responsibility (I bit off more than I could chew with three projects.)",
              "The ball is in your court = it's your turn to take action (I've made my offer; the ball is in your court.)",
              "Barking up the wrong tree = making a mistaken assumption (If you think I'm responsible, you're barking up the wrong tree.)",
              "It's not rocket science = it's not difficult to understand (Boiling water isn't rocket science.)",
              "Add insult to injury = make a bad situation worse (He broke my phone, then added insult to injury by laughing.)",
              "Caught between a rock and a hard place = forced to choose between two bad options (I'm caught between a rock and a hard place with this decision.)",
              "When pigs fly = something that will never happen (He'll apologise when pigs fly.)"
            ],
            "examples": {
              "correct": [
                "Private school fees cost an arm and a leg in Mumbai.",
                "She visits her grandparents once in a blue moon.",
                "I'm feeling under the weather, so I'll stay home.",
                "I bit off more than I could chew by joining four clubs.",
                "I've done my part; now the ball is in your court.",
                "You're barking up the wrong tree if you think I stole it.",
                "Operating this machine isn't rocket science; just follow the instructions.",
                "He criticised my work publicly, then added insult to injury by blaming me.",
                "Choosing between two bad jobs leaves me caught between a rock and a hard place.",
                "He'll study regularly when pigs fly."
              ],
              "incorrect": [
                {
                  "text": "×It cost a leg and an arm.",
                  "reason": "Wrong word order. Correct: cost an arm and a leg."
                },
                {
                  "text": "×I see him once in blue moon.",
                  "reason": "Missing article. Correct: once in a blue moon."
                },
                {
                  "text": "×I'm below the weather.",
                  "reason": "Wrong preposition. Correct: under the weather (not 'below')."
                },
                {
                  "text": "×The ball is in your field.",
                  "reason": "Wrong noun. Correct: the ball is in your court (not 'field')."
                },
                {
                  "text": "×You're barking the wrong tree.",
                  "reason": "Missing preposition. Correct: barking up the wrong tree."
                }
              ]
            }
          }
        ]
      },
      {
        "id": "key-rules",
        "title": "Five Golden Rules for Using Idioms Correctly",
        "type": "rule-cards",
        "cards": [
          {
            "title": "Rule 1: Learn Idioms as Fixed Phrases",
            "content": "Idioms are fixed expressions; you cannot change individual words without losing meaning. For example, 'break the ice' cannot become 'break the water' or 'crack the ice'.",
            "examples": {
              "correct": [
                "Correct: break the ice (fixed phrase)",
                "Correct: hit the nail on the head (cannot change to 'hit the screw')",
                "Correct: cost an arm and a leg (cannot change to 'cost a hand and a foot')",
                "Correct: spill the beans (cannot change to 'spill the peas')",
                "Correct: beat around the bush (cannot change to 'beat around the tree')"
              ],
              "incorrect": [
                {
                  "text": "×Break the water (to start a conversation)",
                  "reason": "You cannot substitute words. Must use: break the ice."
                },
                {
                  "text": "×Hit the screw on the head",
                  "reason": "Wrong noun. Fixed phrase is: hit the nail on the head."
                },
                {
                  "text": "×Cost a hand and a foot",
                  "reason": "Wrong body parts. Correct: cost an arm and a leg."
                },
                {
                  "text": "×Pour the beans",
                  "reason": "Wrong verb. Correct: spill the beans (not 'pour')."
                },
                {
                  "text": "×Hit around the bush",
                  "reason": "Wrong verb. Correct: beat around the bush (not 'hit')."
                }
              ]
            }
          },
          {
            "title": "Rule 2: Context Determines Appropriateness",
            "content": "Use idioms in appropriate contexts. Formal writing (academic essays, official letters) generally avoids idioms. Conversational English, stories, and informal writing embrace idioms naturally.",
            "examples": {
              "correct": [
                "Formal (avoid idioms): 'The project was completed successfully.' (plain English)",
                "Informal (use idioms): 'We aced the project!' (conversational)",
                "Narrative writing: 'Time flies when you're having fun.' (acceptable in stories)",
                "Job interview: 'I always go the extra mile.' (appropriate, shows effort)",
                "Academic essay: 'Avoid cutting corners.' (use plain: 'Avoid incomplete work')"
              ],
              "incorrect": [
                {
                  "text": "×Academic essay: 'The results were a piece of cake.'",
                  "reason": "Too informal for academic writing. Use: 'The results were easily obtained.'"
                },
                {
                  "text": "×Formal letter: 'I'm over the moon about your offer.'",
                  "reason": "Too casual. Use: 'I am delighted to accept your offer.'"
                },
                {
                  "text": "×Business report: 'Sales went through the roof.'",
                  "reason": "Too informal. Use: 'Sales increased significantly.'"
                },
                {
                  "text": "×University application: 'I'll burn the midnight oil.'",
                  "reason": "Too casual. Use: 'I will dedicate extensive time to my studies.'"
                },
                {
                  "text": "×Research paper: 'This theory is not rocket science.'",
                  "reason": "Too informal. Use: 'This theory is straightforward.'"
                }
              ]
            }
          },
          {
            "title": "Rule 3: Pay Attention to Prepositions",
            "content": "Many idioms use specific prepositions that cannot be changed. Learning the correct preposition is as important as learning the idiom itself.",
            "examples": {
              "correct": [
                "in the nick of time (not 'at the nick')",
                "on edge (not 'at edge' or 'in edge')",
                "over the moon (not 'on the moon' or 'above the moon')",
                "against the clock (not 'with the clock' or 'on the clock')",
                "at the eleventh hour (not 'in the eleventh hour')"
              ],
              "incorrect": [
                {
                  "text": "×I arrived at the nick of time.",
                  "reason": "Wrong preposition. Correct: in the nick of time."
                },
                {
                  "text": "×She's at edge before exams.",
                  "reason": "Wrong preposition. Correct: on edge (no article)."
                },
                {
                  "text": "×He was on the moon when he passed.",
                  "reason": "Wrong preposition. Correct: over the moon."
                },
                {
                  "text": "×We're working with the clock.",
                  "reason": "Wrong preposition. Correct: against the clock."
                },
                {
                  "text": "×She finished in the eleventh hour.",
                  "reason": "Wrong preposition. Correct: at the eleventh hour."
                }
              ]
            }
          },
          {
            "title": "Rule 4: Do Not Translate Idioms Literally",
            "content": "Hindi idioms often have different literal meanings. Translating word-for-word produces nonsensical English. Learn English idioms independently, not through direct translation.",
            "examples": {
              "correct": [
                "Hindi: 'Haath ka mael' → English: 'Dirt cheap' (very inexpensive), NOT 'hand's dirt'",
                "Hindi: 'Naak mein dam karna' → English: 'Drive someone crazy', NOT 'put pressure in nose'",
                "Hindi: 'Kaan khada karna' → English: 'Pay attention', NOT 'raise one's ears'",
                "Hindi: 'Muh mein paani aana' → English: 'Mouth-watering', acceptable literal match",
                "Hindi: 'Sir par bhoot sawaar hona' → English: 'Be obsessed', NOT 'ghost riding on head'"
              ],
              "incorrect": [
                {
                  "text": "×The food is hand's dirt. (literal from Hindi)",
                  "reason": "Nonsensical in English. Correct: dirt cheap (very inexpensive)."
                },
                {
                  "text": "×He's putting pressure in my nose. (literal from Hindi)",
                  "reason": "Confusing translation. Correct: He's driving me crazy."
                },
                {
                  "text": "×Raise your ears and listen. (literal from Hindi)",
                  "reason": "Unnatural English. Correct: Pay attention."
                },
                {
                  "text": "×A ghost is riding on his head. (literal from Hindi)",
                  "reason": "Meaningless in English. Correct: He's obsessed with it."
                },
                {
                  "text": "×His hands are full of butter. (literal from Hindi)",
                  "reason": "Unnatural. Correct: He's very clumsy (butterfingers)."
                }
              ]
            }
          },
          {
            "title": "Rule 5: Practice Idioms in Full Sentences",
            "content": "Memorising definitions is insufficient. Practise using idioms in complete sentences to understand grammar and context. Active usage develops natural fluency.",
            "examples": {
              "correct": [
                "Practice sentence: 'I was over the moon when I got the scholarship.'",
                "Practice sentence: 'Let's call it a day; we've done enough work.'",
                "Practice sentence: 'She always goes the extra mile to help others.'",
                "Practice sentence: 'Stop beating around the bush and tell the truth.'",
                "Practice sentence: 'I heard on the grapevine that there's a new policy.'"
              ],
              "incorrect": [
                {
                  "text": "×Just memorising: 'over the moon = happy'",
                  "reason": "Insufficient. Must practise in context: 'I was over the moon when...'"
                },
                {
                  "text": "×Isolated learning: 'break the ice = start conversation'",
                  "reason": "Lacks context. Better: 'He broke the ice by asking about hobbies.'"
                },
                {
                  "text": "×Translation practice: 'haath ka mael = dirt cheap'",
                  "reason": "Focus on English usage, not translation: 'The bag was dirt cheap.'"
                },
                {
                  "text": "×Rote learning: 'spill the beans = reveal secret'",
                  "reason": "Needs sentences: 'Don't spill the beans about the surprise party.'"
                },
                {
                  "text": "×Definition-only: 'pull one's weight = do fair share'",
                  "reason": "Use in speech: 'Everyone must pull their weight in group projects.'"
                }
              ]
            }
          }
        ]
      },
      {
        "id": "common-mistakes",
        "title": "Five Common Mistakes with Idioms",
        "type": "mistake-cards",
        "cards": [
          {
            "title": "Mistake 1: Changing Words in Fixed Phrases",
            "content": "Learners often substitute similar words, breaking the idiom's fixed structure. Idioms must be used exactly as they are, without word substitutions.",
            "examples": {
              "correct": [
                "Correct: break the ice (not 'crack the ice')",
                "Correct: cost an arm and a leg (not 'cost a hand and a foot')",
                "Correct: hit the nail on the head (not 'hit the pin on the head')",
                "Correct: beat around the bush (not 'hit around the bush')",
                "Correct: spill the beans (not 'pour the beans')"
              ],
              "incorrect": [
                {
                  "text": "×Crack the ice at the party",
                  "reason": "Wrong verb. Correct: break the ice (fixed phrase)."
                },
                {
                  "text": "×The car cost a hand and a foot.",
                  "reason": "Wrong body parts. Correct: cost an arm and a leg."
                },
                {
                  "text": "×He hit the pin on the head.",
                  "reason": "Wrong noun. Correct: hit the nail on the head."
                },
                {
                  "text": "×Stop hitting around the bush.",
                  "reason": "Wrong verb. Correct: beat around the bush (not 'hit')."
                },
                {
                  "text": "×She poured the beans about the secret.",
                  "reason": "Wrong verb. Correct: spill the beans (not 'pour')."
                }
              ]
            }
          },
          {
            "title": "Mistake 2: Using Wrong Prepositions",
            "content": "Many idioms require specific prepositions. Indian learners often use incorrect prepositions based on Hindi grammar or guessing.",
            "examples": {
              "correct": [
                "Correct: in the nick of time (not 'at the nick')",
                "Correct: on edge (not 'at edge')",
                "Correct: over the moon (not 'on the moon')",
                "Correct: against the clock (not 'with the clock')",
                "Correct: at the eleventh hour (not 'in the eleventh hour')"
              ],
              "incorrect": [
                {
                  "text": "×I finished at the nick of time.",
                  "reason": "Wrong preposition. Correct: in the nick of time."
                },
                {
                  "text": "×She's at edge before exams.",
                  "reason": "Wrong preposition. Correct: on edge."
                },
                {
                  "text": "×He was on the moon after winning.",
                  "reason": "Wrong preposition. Correct: over the moon."
                },
                {
                  "text": "×We worked with the clock.",
                  "reason": "Wrong preposition. Correct: against the clock."
                },
                {
                  "text": "×He finished in the eleventh hour.",
                  "reason": "Wrong preposition. Correct: at the eleventh hour."
                }
              ]
            }
          },
          {
            "title": "Mistake 3: Literal Translation from Hindi",
            "content": "Translating Hindi idioms word-for-word produces nonsensical English. Each language has unique idioms that do not translate literally.",
            "examples": {
              "correct": [
                "Hindi: 'Naak mein dam karna' → English: 'Drive someone crazy' (NOT literal)",
                "Hindi: 'Haath ka mael' → English: 'Dirt cheap' (NOT 'hand's dirt')",
                "Hindi: 'Kaan khada karna' → English: 'Pay attention' (NOT 'raise ears')",
                "Hindi: 'Sir par bhoot sawaar' → English: 'Be obsessed' (NOT 'ghost on head')",
                "Hindi: 'Aankhein chaar hona' → English: 'Make eye contact' (literal works here)"
              ],
              "incorrect": [
                {
                  "text": "×He's putting pressure in my nose.",
                  "reason": "Literal Hindi translation. Correct: He's driving me crazy."
                },
                {
                  "text": "×The phone is hand's dirt.",
                  "reason": "Nonsensical English. Correct: The phone is dirt cheap."
                },
                {
                  "text": "×Raise your ears and listen.",
                  "reason": "Unnatural. Correct: Pay attention."
                },
                {
                  "text": "×A ghost is riding on his head.",
                  "reason": "Meaningless. Correct: He's obsessed with it."
                },
                {
                  "text": "×His hands are full of butter.",
                  "reason": "Confusing. Correct: He's clumsy (butterfingers)."
                }
              ]
            }
          },
          {
            "title": "Mistake 4: Using Idioms in Formal Writing",
            "content": "Many learners overuse idioms in academic or formal contexts where plain English is preferred. Idioms suit conversation, not formal essays.",
            "examples": {
              "correct": [
                "Formal: 'The project was completed successfully.' (plain English)",
                "Formal: 'Sales increased significantly.' (no idiom needed)",
                "Formal: 'I will dedicate extensive time to studies.' (academic tone)",
                "Informal: 'We aced the project!' (appropriate in casual speech)",
                "Narrative: 'Time flies when you're having fun.' (acceptable in stories)"
              ],
              "incorrect": [
                {
                  "text": "×Academic essay: 'The results were a piece of cake.'",
                  "reason": "Too casual. Use: 'The results were easily obtained.'"
                },
                {
                  "text": "×Formal letter: 'I'm over the moon about your offer.'",
                  "reason": "Too informal. Use: 'I am delighted to accept.'"
                },
                {
                  "text": "×Business report: 'Sales went through the roof.'",
                  "reason": "Inappropriate tone. Use: 'Sales increased significantly.'"
                },
                {
                  "text": "×University application: 'I'll burn the midnight oil.'",
                  "reason": "Too casual. Use: 'I will dedicate time to my studies.'"
                },
                {
                  "text": "×Research paper: 'This theory isn't rocket science.'",
                  "reason": "Too informal. Use: 'This theory is straightforward.'"
                }
              ]
            }
          },
          {
            "title": "Mistake 5: Misunderstanding Idiom Meaning",
            "content": "Learners sometimes guess idiom meanings from individual words, leading to incorrect usage. Always learn the actual meaning, not the literal interpretation.",
            "examples": {
              "correct": [
                "Break the ice = start conversation (NOT physically break ice)",
                "Spill the beans = reveal secret (NOT accidentally drop beans)",
                "Beat around the bush = avoid direct speech (NOT physically hit bushes)",
                "Cold feet = nervousness (NOT physically cold feet)",
                "Green with envy = jealous (NOT literally green-coloured)"
              ],
              "incorrect": [
                {
                  "text": "×He broke the ice in the freezer. (literal meaning)",
                  "reason": "Misunderstood idiom. Means 'start conversation', not physical ice."
                },
                {
                  "text": "×She spilt beans on the floor. (literal meaning)",
                  "reason": "Misunderstood. Idiom means 'reveal secret', not physical beans."
                },
                {
                  "text": "×Stop beating the bushes in the garden. (literal)",
                  "reason": "Wrong usage. Idiom means 'avoid direct speech'."
                },
                {
                  "text": "×Wear socks if you have cold feet. (literal)",
                  "reason": "Misunderstood. Idiom means 'nervousness', not temperature."
                },
                {
                  "text": "×Her face turned green with envy. (literal colour)",
                  "reason": "Misunderstood. 'Green with envy' is figurative, not literal colour."
                }
              ]
            }
          }
        ]
      },
      {
        "id": "practice",
        "title": "Practice Exercises: Apply Idioms in Context",
        "type": "practice-cards",
        "cards": [
          {
            "title": "Exercise 1: Fill in the Blanks (10 sentences)",
            "content": "Complete each sentence with the correct idiom from the word bank. Each idiom is used once.",
            "instructions": "Word Bank: over the moon, break the ice, cost an arm and a leg, in the nick of time, spill the beans, beat around the bush, call it a day, go the extra mile, under the weather, once in a blue moon",
            "practice_items": [
              "1. She was ____________ when she received her exam results. (extremely happy)",
              "2. I arrived ____________ and caught the last bus home. (just in time)",
              "3. That new phone will ____________; it's very expensive. (be costly)",
              "4. He told a joke to ____________ at the awkward meeting. (start conversation)",
              "5. I'm feeling ____________ today, so I'll stay in bed. (ill)",
              "6. Please don't ____________ about the surprise party! (reveal the secret)",
              "7. Stop ____________ and tell me what you really think. (avoiding directness)",
              "8. Teachers who ____________ make a real difference. (make extra effort)",
              "9. I see my school friends ____________; they live far away. (very rarely)",
              "10. We've worked for eight hours; let's ____________. (stop working)"
            ],
            "answers": [
              "1. over the moon",
              "2. in the nick of time",
              "3. cost an arm and a leg",
              "4. break the ice",
              "5. under the weather",
              "6. spill the beans",
              "7. beating around the bush",
              "8. go the extra mile",
              "9. once in a blue moon",
              "10. call it a day"
            ]
          },
          {
            "title": "Exercise 2: Match Idioms to Meanings (10 pairs)",
            "content": "Match each idiom on the left with its correct meaning on the right.",
            "practice_items": [
              "1. Hit the nail on the head → A. Reveal a secret",
              "2. Miss the boat → B. Be exactly right",
              "3. Let the cat out of the bag → C. Give up",
              "4. Throw in the towel → D. Lose an opportunity",
              "5. Green with envy → E. Very jealous",
              "6. On edge → F. Work late at night",
              "7. Burn the midnight oil → G. Nervous or anxious",
              "8. Time flies → H. Very rarely",
              "9. Once in a blue moon → I. Time passes quickly",
              "10. The ball is in your court → J. It's your turn to act"
            ],
            "answers": [
              "1 → B (be exactly right)",
              "2 → D (lose an opportunity)",
              "3 → A (reveal a secret)",
              "4 → C (give up)",
              "5 → E (very jealous)",
              "6 → G (nervous or anxious)",
              "7 → F (work late at night)",
              "8 → I (time passes quickly)",
              "9 → H (very rarely)",
              "10 → J (it's your turn to act)"
            ]
          },
          {
            "title": "Exercise 3: Error Correction (10 sentences)",
            "content": "Identify and correct the mistake in each sentence. Focus on wrong prepositions, incorrect word substitutions, or misuse of idioms.",
            "practice_items": [
              "1. ×I was on the moon when I passed the exam.",
              "2. ×She spilled beans on the secret accidentally.",
              "3. ×We arrived at the nick of time.",
              "4. ×The laptop cost a hand and a foot.",
              "5. ×Stop hitting around the bush and speak directly.",
              "6. ×He threw the towel after failing twice.",
              "7. ×I see them one in a blue moon.",
              "8. ×She's feeling below the weather today.",
              "9. ×The ball is in your field now.",
              "10. ×He worked with the clock to finish."
            ],
            "answers": [
              "1. Correct: I was over the moon (not 'on')",
              "2. Correct: She spilt the beans (article needed)",
              "3. Correct: We arrived in the nick of time (not 'at')",
              "4. Correct: cost an arm and a leg (fixed phrase)",
              "5. Correct: beating around the bush (not 'hitting')",
              "6. Correct: threw in the towel (preposition needed)",
              "7. Correct: once in a blue moon (not 'one')",
              "8. Correct: under the weather (not 'below')",
              "9. Correct: in your court (not 'field')",
              "10. Correct: against the clock (not 'with')"
            ]
          },
          {
            "title": "Exercise 4: Contextual Usage (10 scenarios)",
            "content": "Choose the most appropriate idiom for each situation. Consider context and formality.",
            "practice_items": [
              "1. You finished an assignment just before the deadline. Which idiom fits? (a) miss the boat (b) in the nick of time (c) call it a day",
              "2. Your friend is extremely happy about getting a scholarship. Which idiom describes this? (a) over the moon (b) on edge (c) under the weather",
              "3. Someone is avoiding answering your question directly. They are: (a) breaking the ice (b) beating around the bush (c) speaking their mind",
              "4. A new phone costs rupees 80,000. It: (a) costs an arm and a leg (b) is a piece of cake (c) is once in a blue moon",
              "5. You're feeling ill and want to stay home. You say: (a) I'm on edge (b) I'm under the weather (c) I'm over the moon",
              "6. Someone accidentally revealed a secret. They: (a) beat the clock (b) threw in the towel (c) spilt the beans",
              "7. You want to suggest stopping work for the day. You say: (a) Let's call it a day (b) Let's miss the boat (c) Let's break the ice",
              "8. A teacher makes extra effort to help students. She: (a) beats around the bush (b) goes the extra mile (c) burns the midnight oil",
              "9. News spreads very quickly in a small town. It: (a) spreads like wildfire (b) costs an arm and a leg (c) throws in the towel",
              "10. You rarely see your cousin; perhaps twice a year. You see them: (a) in the nick of time (b) once in a blue moon (c) round the clock"
            ],
            "answers": [
              "1. (b) in the nick of time",
              "2. (a) over the moon",
              "3. (b) beating around the bush",
              "4. (a) costs an arm and a leg",
              "5. (b) I'm under the weather",
              "6. (c) spilt the beans",
              "7. (a) Let's call it a day",
              "8. (b) goes the extra mile",
              "9. (a) spreads like wildfire",
              "10. (b) once in a blue moon"
            ]
          },
          {
            "title": "Exercise 5: Creative Sentence Writing (10 idioms)",
            "content": "Write your own sentences using the following idioms. Ensure correct grammar and natural context.",
            "instructions": "Use these idioms in complete sentences: (1) break the ice, (2) over the moon, (3) cost an arm and a leg, (4) beat around the bush, (5) in the nick of time, (6) spill the beans, (7) call it a day, (8) go the extra mile, (9) under the weather, (10) once in a blue moon",
            "practice_items": [
              "Example 1: He broke the ice by asking everyone about their hobbies.",
              "Example 2: She was over the moon when she got the job offer.",
              "Example 3: That designer handbag costs an arm and a leg.",
              "Now write your own sentences for idioms 4–10:",
              "4. (beat around the bush): _________________________________",
              "5. (in the nick of time): _________________________________",
              "6. (spill the beans): _________________________________",
              "7. (call it a day): _________________________________",
              "8. (go the extra mile): _________________________________",
              "9. (under the weather): _________________________________",
              "10. (once in a blue moon): _________________________________"
            ],
            "sample_answers": [
              "4. Stop beating around the bush and tell me what happened.",
              "5. I caught the train in the nick of time before it left.",
              "6. Don't spill the beans about the surprise birthday party.",
              "7. We've worked for ten hours; let's call it a day.",
              "8. The best teachers always go the extra mile to help students.",
              "9. I'm feeling under the weather, so I'll skip the meeting.",
              "10. I eat fast food once in a blue moon because it's unhealthy."
            ]
          }
        ]
      },
      {
        "id": "revision",
        "title": "Quick Revision: 10 Key Takeaways",
        "type": "summary-points",
        "points": [
          "1. Idioms are fixed phrases with non-literal meanings (e.g., 'break the ice' means start conversation, not physical ice).",
          "2. Over 50 essential idioms organised into four themes: emotions (over the moon, on edge), success/failure (ace it, throw in the towel), time (in the nick of time, call it a day), and communication (spill the beans, beat around the bush).",
          "3. Learn idioms as fixed phrases; you cannot substitute words (correct: 'cost an arm and a leg', NOT 'cost a hand and a foot').",
          "4. Pay attention to prepositions: 'in the nick of time' (not 'at'), 'over the moon' (not 'on'), 'against the clock' (not 'with').",
          "5. Do not translate Hindi idioms literally into English (Hindi: 'naak mein dam' → English: 'drive someone crazy', NOT 'pressure in nose').",
          "6. Use idioms appropriately by context: informal speech, stories, and casual writing allow idioms; formal academic writing prefers plain English.",
          "7. Avoid overusing idioms in formal contexts: write 'Sales increased significantly' (formal) instead of 'Sales went through the roof' (informal).",
          "8. Practice idioms in complete sentences to understand grammar and usage: 'She was over the moon when she passed the exam.'",
          "9. Common mistakes: changing words in fixed phrases, using wrong prepositions, literal Hindi translation, misunderstanding meaning, using idioms in formal writing.",
          "10. Mastering idioms enhances fluency and comprehension in real-world English conversations, films, podcasts, and everyday interactions."
        ]
      }
    ]
  }
  $$::jsonb,
  'beginner',
  90,
  'British Council CEFR A1-B1',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);
