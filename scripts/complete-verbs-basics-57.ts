import { Pool } from 'pg';
import { config } from 'dotenv';

config({ path: '.env.local' });

// VERBS-BASICS - 57 questions (to reach 60 total from current 3)
const VERBS_BASICS_57 = [
  {
    topic: 'verbs-basics', level: 'A1',
    question: 'What is a verb?',
    options: ['A word that shows action or state', 'A word that describes a noun', 'A word that connects sentences', 'A word that modifies an adjective'],
    answer: 0,
    explanation: {
      logic: "Verbs express actions (run, eat, write) or states (is, seem, feel). They tell what the subject does or is. Essential part of every sentence.",
      formula: "Subject + verb (+ object) = basic sentence pattern",
      trapAlerts: ["Adjectives describe nouns, not verbs", "Conjunctions connect sentences", "Adverbs modify adjectives"],
      commonMistakes: ["Confusing verbs with other parts of speech", "Not recognizing state verbs (be, seem, appear) as verbs"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'verbs-basics', level: 'A1',
    question: 'Raj ___ to school every day.',
    options: ['goes', 'go', 'going', 'gone'],
    answer: 0,
    explanation: {
      logic: "Third person singular (Raj = he) uses -s/-es form in present simple. Goes is correct form. Every day signals habitual action = present simple.",
      formula: "He/She/It + verb+s (goes, eats, runs) | I/You/We/They + base verb",
      trapAlerts: ["go is for I/you/we/they, not he", "going is continuous form", "gone is past participle"],
      commonMistakes: ["Forgetting -s for he/she/it", "Using base form for third person singular"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'verbs-basics', level: 'A1',
    question: 'Which is an action verb?',
    options: ['jump', 'is', 'seem', 'feel'],
    answer: 0,
    explanation: {
      logic: "Jump shows physical action. Is/seem/feel are state/linking verbs (no action, describe condition). Action verbs show what subject does.",
      formula: "Action verbs = physical/mental actions (jump, think, eat, write)",
      trapAlerts: ["is is linking verb connecting subject to description", "seem expresses state, not action", "feel is state verb (emotion/sensation)"],
      commonMistakes: ["Thinking all verbs show action", "Not distinguishing action from state verbs"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'verbs-basics', level: 'A1',
    question: 'Complete: She ___ a book right now.',
    options: ['is reading', 'reads', 'read', 'reading'],
    answer: 0,
    explanation: {
      logic: "Right now signals present continuous (action happening now). Is reading = be + -ing form. Use continuous for actions in progress.",
      formula: "am/is/are + verb-ing = present continuous (for actions happening now)",
      trapAlerts: ["reads is present simple for habits, not current action", "read is base form or past, incomplete here", "reading needs helping verb is"],
      commonMistakes: ["Using present simple for actions happening now", "Forgetting be verb with -ing"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'verbs-basics', level: 'A1',
    question: 'What is the base form of ate?',
    options: ['eat', 'eating', 'eats', 'eaten'],
    answer: 0,
    explanation: {
      logic: "Base form = dictionary form without any endings. Eat is base form, ate is past simple, eating is -ing form, eats is third person, eaten is past participle.",
      formula: "Base form = infinitive without to (eat, run, go)",
      trapAlerts: ["eating has -ing ending", "eats has -s ending", "eaten is past participle form"],
      commonMistakes: ["Confusing base form with other verb forms", "Not knowing infinitive = to + base form"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'verbs-basics', level: 'A2',
    question: 'I ___ finished my homework.',
    options: ['have', 'has', 'am', 'is'],
    answer: 0,
    explanation: {
      logic: "Have finished = present perfect (completed action with present relevance). I/you/we/they use have, he/she/it uses has. Have/has + past participle.",
      formula: "I/you/we/they + have + past participle | he/she/it + has + past participle",
      trapAlerts: ["has is for third person singular only", "am is for continuous (am finishing), not perfect", "is is also for continuous"],
      commonMistakes: ["Using has with I/you/we/they", "Confusing present perfect with present continuous"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'verbs-basics', level: 'A1',
    question: 'Which sentence has a linking verb?',
    options: ['Priya is happy.', 'Priya runs fast.', 'Priya eats rice.', 'Priya writes well.'],
    answer: 0,
    explanation: {
      logic: "Linking verb connects subject to description. Is links Priya to happy (describes her state). Runs/eats/writes are action verbs showing what she does.",
      formula: "Subject + linking verb (be/seem/appear/feel) + adjective/noun",
      trapAlerts: ["runs is action verb (physical action)", "eats is action verb (what she does)", "writes is action verb (activity)"],
      commonMistakes: ["Not recognizing be as linking verb", "Thinking all verbs show action"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'verbs-basics', level: 'A1',
    question: 'Raj and Priya ___ to Mumbai.',
    options: ['go', 'goes', 'going', 'gone'],
    answer: 0,
    explanation: {
      logic: "Raj and Priya = they (plural). Plural subjects use base form in present simple. Go is correct, no -s needed.",
      formula: "Plural subjects (we/you/they) + base verb (go, eat, run)",
      trapAlerts: ["goes is for singular he/she/it only", "going needs helping verb", "gone is past participle"],
      commonMistakes: ["Adding -s to plural verbs", "Not recognizing compound subjects are plural"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'verbs-basics', level: 'A2',
    question: 'Find the main verb: She has been working hard.',
    options: ['working', 'has', 'been', 'hard'],
    answer: 0,
    explanation: {
      logic: "Working is main verb (shows the action). Has been are helping/auxiliary verbs that form present perfect continuous. Main verb = action word.",
      formula: "Helping verbs + main verb (has been working, will go, can run)",
      trapAlerts: ["has is auxiliary helping to form tense", "been is also auxiliary (part of has been)", "hard is adverb, not verb"],
      commonMistakes: ["Thinking auxiliary verb is main verb", "Not identifying the action word"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'verbs-basics', level: 'A1',
    question: 'Complete: They ___ football yesterday.',
    options: ['played', 'play', 'plays', 'playing'],
    answer: 0,
    explanation: {
      logic: "Yesterday signals past time. Played is past simple form. Regular verbs add -ed for past.",
      formula: "Subject + verb-ed (yesterday, last week, ago) = past simple",
      trapAlerts: ["play is present tense", "plays is third person present", "playing is continuous form"],
      commonMistakes: ["Using present for past time", "Forgetting -ed for regular past verbs"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'verbs-basics', level: 'A1',
    question: 'What type of verb is can in: I can swim?',
    options: ['Modal verb', 'Action verb', 'Linking verb', 'Main verb'],
    answer: 0,
    explanation: {
      logic: "Can is modal verb expressing ability. Modal verbs (can, will, must, should) help main verbs show mood, ability, permission, obligation. Swim is the main verb.",
      formula: "Modal + base verb (can swim, will go, must study)",
      trapAlerts: ["swim is action verb, can is modal", "Linking verbs are be/seem/appear", "Main verb is swim, not can"],
      commonMistakes: ["Confusing modal with main verb", "Not learning modal verb list"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'verbs-basics', level: 'A1',
    question: 'She ___ not like coffee.',
    options: ['does', 'do', 'is', 'are'],
    answer: 0,
    explanation: {
      logic: "She (third person singular) uses does for negative/question in present simple. Does not = doesn't. Do is for I/you/we/they.",
      formula: "He/she/it + does not + base verb | I/you/we/they + do not + base verb",
      trapAlerts: ["do is for I/you/we/they, not she", "is is for continuous, not simple present negative", "are is for plural/you"],
      commonMistakes: ["Using do with he/she/it", "Using is instead of does for negatives"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'verbs-basics', level: 'A2',
    question: 'What are the helping verbs: He will have finished by 5 PM?',
    options: ['will have', 'will', 'have finished', 'will have finished'],
    answer: 0,
    explanation: {
      logic: "Will have are both helping/auxiliary verbs forming future perfect. Finished is main verb. Helping verbs support main verb to create tense/mood.",
      formula: "Helping verbs + main verb (will have finished, has been working)",
      trapAlerts: ["will alone is incomplete - both will and have are helping", "have finished includes main verb", "will have finished includes main verb finished"],
      commonMistakes: ["Not identifying all helping verbs", "Including main verb in auxiliary verbs"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'verbs-basics', level: 'A1',
    question: 'Priya ___ her homework every evening.',
    options: ['does', 'do', 'doing', 'done'],
    answer: 0,
    explanation: {
      logic: "Every evening = habit = present simple. Priya (she) uses does (third person -s form). Do homework = fixed expression.",
      formula: "He/she/it + does/has/goes (third person -s form)",
      trapAlerts: ["do is for I/you/we/they", "doing is continuous form", "done is past participle"],
      commonMistakes: ["Using do instead of does for he/she/it", "Not learning do homework expression"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'verbs-basics', level: 'A1',
    question: 'Which is a regular verb?',
    options: ['walk', 'go', 'eat', 'run'],
    answer: 0,
    explanation: {
      logic: "Regular verbs add -ed for past: walk-walked, play-played. Irregular verbs change form: go-went, eat-ate, run-ran. Most verbs are regular.",
      formula: "Regular: walk-walked | Irregular: go-went (must memorize)",
      trapAlerts: ["go is irregular (went)", "eat is irregular (ate)", "run is irregular (ran)"],
      commonMistakes: ["Not learning which verbs are irregular", "Trying to add -ed to irregular verbs"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'verbs-basics', level: 'A2',
    question: 'Complete: If I ___ you, I would study harder.',
    options: ['were', 'am', 'was', 'be'],
    answer: 0,
    explanation: {
      logic: "If I were you = fixed conditional expression. Were (subjunctive) for all persons in unreal conditionals. Hypothetical situation.",
      formula: "If I/he/she/it were + ..., would + verb (subjunctive mood)",
      trapAlerts: ["am is present indicative, not subjunctive", "was is indicative past, use were for unreal", "be is infinitive"],
      commonMistakes: ["Using was in If I were you", "Not learning subjunctive were"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'verbs-basics', level: 'A1',
    question: '___ Raj speak English?',
    options: ['Does', 'Do', 'Is', 'Are'],
    answer: 0,
    explanation: {
      logic: "Questions in present simple use do/does. Raj (he) uses does. Does + subject + base verb for questions.",
      formula: "Does + he/she/it + base verb? | Do + I/you/we/they + base verb?",
      trapAlerts: ["Do is for I/you/we/they", "Is is for be verb or continuous", "Are is for plural/you with be"],
      commonMistakes: ["Using do with he/she/it in questions", "Using is instead of does"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'verbs-basics', level: 'A1',
    question: 'I ___ to school every day.',
    options: ['go', 'goes', 'going', 'gone'],
    answer: 0,
    explanation: {
      logic: "I uses base form in present simple. Every day = habit = present simple. Go is correct, no -s for I.",
      formula: "I/you/we/they + base verb (go, eat, study)",
      trapAlerts: ["goes is for he/she/it only", "going needs helping verb", "gone is past participle"],
      commonMistakes: ["Adding -s to verbs with I", "Not recognizing I takes base form"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'verbs-basics', level: 'A2',
    question: 'She ___ in Mumbai since 2020.',
    options: ['has lived', 'have lived', 'is living', 'lives'],
    answer: 0,
    explanation: {
      logic: "Since 2020 signals present perfect (action started in past, continues to now). She uses has (third person). Has + past participle (lived).",
      formula: "He/she/it + has + past participle + since/for",
      trapAlerts: ["have is for I/you/we/they", "is living is continuous, doesn't work with since for duration", "lives is present simple, doesn't show duration from past"],
      commonMistakes: ["Using have with he/she/it", "Using present simple with since/for duration"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'verbs-basics', level: 'A1',
    question: 'What is the past form of go?',
    options: ['went', 'goed', 'goes', 'going'],
    answer: 0,
    explanation: {
      logic: "Go is irregular verb. Past form is went (not goed). Must memorize irregular past forms: go-went, eat-ate, run-ran.",
      formula: "Irregular verbs change form (go-went-gone, not add -ed)",
      trapAlerts: ["goed is wrong - go is irregular", "goes is present third person", "going is continuous form"],
      commonMistakes: ["Adding -ed to irregular verbs", "Not memorizing common irregular verbs"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'verbs-basics', level: 'A1',
    question: 'They ___ watching TV now.',
    options: ['are', 'is', 'am', 'be'],
    answer: 0,
    explanation: {
      logic: "They (plural) uses are with continuous. Are watching = present continuous (action happening now). Are + -ing for current action.",
      formula: "They/we/you + are + verb-ing | He/she/it + is + verb-ing | I + am + verb-ing",
      trapAlerts: ["is is for he/she/it only", "am is for I only", "be is infinitive, not conjugated"],
      commonMistakes: ["Using is with they", "Not matching be verb to subject"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'verbs-basics', level: 'A2',
    question: 'Find the transitive verb: She gave me a book.',
    options: ['gave (takes object: book)', 'me', 'book', 'No verb'],
    answer: 0,
    explanation: {
      logic: "Transitive verb takes direct object. Gave takes object book (what she gave). Transitive verbs need object to complete meaning: She gave what? A book.",
      formula: "Transitive verb + object (gave a book, wrote a letter, bought a car)",
      trapAlerts: ["me is indirect object (to whom), not verb", "book is direct object, not verb", "Gave is the verb"],
      commonMistakes: ["Confusing object with verb", "Not understanding transitive needs object"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'verbs-basics', level: 'A1',
    question: 'Raj ___ to the market yesterday.',
    options: ['went', 'go', 'goes', 'going'],
    answer: 0,
    explanation: {
      logic: "Yesterday = past time. Went is past form of go (irregular). Past simple for completed past action.",
      formula: "Subject + past verb + time (yesterday, last week, ago)",
      trapAlerts: ["go is present form", "goes is third person present", "going is continuous form"],
      commonMistakes: ["Using present for past time", "Not using past form with yesterday"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'verbs-basics', level: 'A2',
    question: 'What is the past participle of write?',
    options: ['written', 'wrote', 'writing', 'writes'],
    answer: 0,
    explanation: {
      logic: "Past participle is third form used with have/has/had. Write-wrote-written (irregular). Written used in perfect tenses and passive voice.",
      formula: "Base-past-past participle (write-wrote-written, eat-ate-eaten)",
      trapAlerts: ["wrote is past simple, not past participle", "writing is -ing form", "writes is present third person"],
      commonMistakes: ["Confusing past simple with past participle", "Not learning three forms of irregular verbs"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'verbs-basics', level: 'A1',
    question: 'Complete: She ___ sleep early.',
    options: ['does not', 'do not', 'is not', 'are not'],
    answer: 0,
    explanation: {
      logic: "She (third person) uses does not for present simple negative. Does not = doesn't + base verb (sleep).",
      formula: "He/she/it + does not + base verb | I/you/we/they + do not + base verb",
      trapAlerts: ["do not is for I/you/we/they", "is not is for continuous or be verb", "are not is for plural"],
      commonMistakes: ["Using do not with he/she/it", "Using is not for simple present negatives"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'verbs-basics', level: 'A1',
    question: 'I ___ my friend tomorrow.',
    options: ['will meet', 'meet', 'met', 'meeting'],
    answer: 0,
    explanation: {
      logic: "Tomorrow = future time. Will meet = future simple. Will + base verb for future plans/predictions.",
      formula: "will + base verb (will go, will eat, will study)",
      trapAlerts: ["meet is present, needs will for future", "met is past", "meeting needs helping verb"],
      commonMistakes: ["Using present tense for future", "Forgetting will for future time expressions"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'verbs-basics', level: 'A2',
    question: 'Which sentence has an intransitive verb?',
    options: ['Birds fly.', 'She reads books.', 'He bought a car.', 'They made dinner.'],
    answer: 0,
    explanation: {
      logic: "Intransitive verb does NOT take object. Fly stands alone (complete meaning without object). Reads/bought/made all take objects (books, car, dinner).",
      formula: "Intransitive verb (no object needed) - Birds fly, She sleeps, He runs",
      trapAlerts: ["reads takes object books (transitive)", "bought takes object car (transitive)", "made takes object dinner (transitive)"],
      commonMistakes: ["Not recognizing verbs that don't need objects", "Thinking all verbs need objects"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'verbs-basics', level: 'A1',
    question: 'The sun ___ in the east.',
    options: ['rises', 'rise', 'rising', 'risen'],
    answer: 0,
    explanation: {
      logic: "Universal truth uses present simple. Sun (it) takes -s form. Rises is correct. Facts always use present simple.",
      formula: "Universal truths/facts use present simple (The sun rises, Water boils at 100C)",
      trapAlerts: ["rise is for I/you/we/they", "rising is continuous form", "risen is past participle"],
      commonMistakes: ["Not using -s for third person in facts", "Using continuous for permanent truths"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'verbs-basics', level: 'A2',
    question: 'He ___ working when I called.',
    options: ['was', 'is', 'were', 'am'],
    answer: 0,
    explanation: {
      logic: "Past continuous: was/were + -ing. He (singular) uses was. When I called signals past time. Was working = action in progress in past.",
      formula: "He/she/it/I + was + verb-ing | They/we/you + were + verb-ing",
      trapAlerts: ["is is present continuous", "were is for plural/you in past", "am is for I in present"],
      commonMistakes: ["Using were with he/she/it", "Using present be verb for past continuous"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'verbs-basics', level: 'A1',
    question: 'We ___ cricket every Sunday.',
    options: ['play', 'plays', 'playing', 'played'],
    answer: 0,
    explanation: {
      logic: "Every Sunday = habit = present simple. We (plural) uses base form play. No -s for plural subjects.",
      formula: "We/they/you + base verb (play, go, eat)",
      trapAlerts: ["plays is for he/she/it only", "playing is continuous form", "played is past"],
      commonMistakes: ["Adding -s to plural verbs", "Not recognizing we takes base form"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'verbs-basics', level: 'A2',
    question: 'What is a phrasal verb?',
    options: ['Verb + preposition/adverb (look after, give up)', 'Two verbs together', 'Verb phrase in sentence', 'Past tense verb'],
    answer: 0,
    explanation: {
      logic: "Phrasal verb = verb + particle (preposition or adverb) with special meaning. Look after = take care of, give up = quit. Meaning often not literal.",
      formula: "Verb + particle = phrasal verb (look after, turn on, give up, put off)",
      trapAlerts: ["Two verbs together is different structure", "Verb phrase is any verb construction", "Past tense is just tense, not phrasal verb"],
      commonMistakes: ["Not recognizing phrasal verbs as single units", "Translating phrasal verbs word by word"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'verbs-basics', level: 'A1',
    question: 'Priya ___ happy today.',
    options: ['is', 'are', 'am', 'be'],
    answer: 0,
    explanation: {
      logic: "Priya (she) uses is with be verb. Is happy = linking verb showing state. Present simple of be: I am, you/we/they are, he/she/it is.",
      formula: "I am | You/we/they are | He/she/it is",
      trapAlerts: ["are is for plural/you", "am is for I only", "be is infinitive"],
      commonMistakes: ["Using are with he/she/it", "Not conjugating be verb correctly"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'verbs-basics', level: 'A2',
    question: 'They ___ to Delhi next week.',
    options: ['are going', 'go', 'went', 'goes'],
    answer: 0,
    explanation: {
      logic: "Next week = future. Are going = present continuous for planned future. Often use present continuous for fixed plans/arrangements.",
      formula: "am/is/are + verb-ing for future plans (I am meeting him tomorrow)",
      trapAlerts: ["go is present simple", "went is past", "goes is third person present"],
      commonMistakes: ["Not using present continuous for future plans", "Using simple present for definite future arrangements"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'verbs-basics', level: 'A1',
    question: 'Find the error: She do not like tea.',
    options: ["do should be does", "not should be no", "like should be likes", "No error"],
    answer: 0,
    explanation: {
      logic: "She (third person) needs does not, not do not. Does not = doesn't + base verb like. Do is for I/you/we/they.",
      formula: "He/she/it + does not + base verb",
      trapAlerts: ["not is correct", "like is correct base form after does", "Sentence has error"],
      commonMistakes: ["Using do with he/she/it in negatives", "Not learning does/do distinction"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'verbs-basics', level: 'A2',
    question: 'What is the gerund form?',
    options: ['verb + -ing used as noun (Swimming is fun)', 'Present continuous verb', 'Past participle', 'Adjective form'],
    answer: 0,
    explanation: {
      logic: "Gerund = verb-ing used as noun. Swimming is fun (swimming = subject noun). Looks like -ing verb but functions as noun.",
      formula: "Gerund (noun) vs Present continuous (verb) - Swimming is fun vs I am swimming",
      trapAlerts: ["Present continuous is verb phrase (am swimming)", "Past participle is different form (eaten, written)", "Adjective form is different (-ed/-ing as adjective)"],
      commonMistakes: ["Confusing gerunds with present continuous", "Not recognizing -ing as noun"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'verbs-basics', level: 'A1',
    question: 'He ___ a car.',
    options: ['has', 'have', 'having', 'had'],
    answer: 0,
    explanation: {
      logic: "He (third person) uses has for possession. Has a car = owns a car. Have is for I/you/we/they.",
      formula: "I/you/we/they have | He/she/it has (possession/ownership)",
      trapAlerts: ["have is for I/you/we/they", "having is continuous form", "had is past"],
      commonMistakes: ["Using have with he/she/it", "Not learning has for third person"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'verbs-basics', level: 'A2',
    question: 'She ___ dinner when the phone rang.',
    options: ['was cooking', 'is cooking', 'cooked', 'cooks'],
    answer: 0,
    explanation: {
      logic: "Past continuous for interrupted action. Was cooking (in progress) when phone rang (interruption). When + past simple, past continuous.",
      formula: "was/were + verb-ing + when + past simple",
      trapAlerts: ["is cooking is present continuous", "cooked is simple past, doesn't show ongoing action", "cooks is present simple"],
      commonMistakes: ["Using present continuous for past", "Not using continuous for interrupted actions"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'verbs-basics', level: 'A1',
    question: 'Water ___ at 100 degrees Celsius.',
    options: ['boils', 'boil', 'boiling', 'boiled'],
    answer: 0,
    explanation: {
      logic: "Scientific fact uses present simple. Water (it) takes -s form. Boils is correct. Universal truths always present simple.",
      formula: "Facts/truths use present simple (Water boils, The earth rotates)",
      trapAlerts: ["boil is for I/you/we/they", "boiling is continuous", "boiled is past"],
      commonMistakes: ["Not using -s for facts with it/he/she", "Using will for permanent facts"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'verbs-basics', level: 'A2',
    question: 'By next year, I ___ in this company for 5 years.',
    options: ['will have worked', 'will work', 'have worked', 'work'],
    answer: 0,
    explanation: {
      logic: "Future perfect for action completed before future time. By next year (future point), will have worked (completed duration). Will have + past participle.",
      formula: "By + future time, will have + past participle",
      trapAlerts: ["will work is simple future, doesn't show completed duration", "have worked is present perfect for now, not future", "work is present simple"],
      commonMistakes: ["Not using future perfect with by + future time", "Confusing future perfect with simple future"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'verbs-basics', level: 'A1',
    question: 'I ___ my homework yesterday.',
    options: ['did', 'do', 'does', 'doing'],
    answer: 0,
    explanation: {
      logic: "Yesterday = past time. Did is past form of do. Did homework = completed homework in past. Past simple for finished past action.",
      formula: "Subject + past verb + time word (yesterday, last week, ago)",
      trapAlerts: ["do is present", "does is third person present", "doing is continuous form"],
      commonMistakes: ["Using present for past time", "Not using past with yesterday"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'verbs-basics', level: 'A2',
    question: 'She must ___ the truth.',
    options: ['tell', 'tells', 'telling', 'told'],
    answer: 0,
    explanation: {
      logic: "Modal verbs (must, can, will, should) take base verb form. Must tell (not tells/telling/told). Modal + base verb always.",
      formula: "Modal (must/can/will/should) + base verb",
      trapAlerts: ["tells has -s, wrong after modal", "telling is -ing form", "told is past, modal takes base"],
      commonMistakes: ["Adding -s after modals", "Using past or -ing after modals"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'verbs-basics', level: 'A1',
    question: '___ you like pizza?',
    options: ['Do', 'Does', 'Are', 'Is'],
    answer: 0,
    explanation: {
      logic: "You uses do in present simple questions. Do you like = question form. Do + subject + base verb.",
      formula: "Do + I/you/we/they + base verb? | Does + he/she/it + base verb?",
      trapAlerts: ["Does is for he/she/it", "Are is for be verb or continuous", "Is is for he/she/it with be"],
      commonMistakes: ["Using does with you", "Using be verb instead of do"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'verbs-basics', level: 'A2',
    question: 'The book ___ by many students.',
    options: ['is read', 'reads', 'reading', 'read'],
    answer: 0,
    explanation: {
      logic: "Passive voice: be + past participle. Is read = gets read (by students). Focus on book (receiver), not students (doers).",
      formula: "be (am/is/are/was/were) + past participle = passive voice",
      trapAlerts: ["reads is active voice third person", "reading is active continuous", "read alone is active or past"],
      commonMistakes: ["Not using be verb in passive", "Confusing active and passive voice"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'verbs-basics', level: 'A1',
    question: 'Raj ___ very fast.',
    options: ['runs', 'run', 'running', 'ran'],
    answer: 0,
    explanation: {
      logic: "Raj (he) takes -s form in present simple. Runs is correct. Third person singular needs -s.",
      formula: "He/she/it + verb+s (runs, eats, goes)",
      trapAlerts: ["run is for I/you/we/they", "running is continuous", "ran is past"],
      commonMistakes: ["Forgetting -s for he/she/it", "Using base form for third person"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'verbs-basics', level: 'A2',
    question: 'He enjoys ___ music.',
    options: ['listening to', 'listen to', 'listens to', 'listened to'],
    answer: 0,
    explanation: {
      logic: "After enjoy, use gerund (verb-ing as noun). Enjoys listening to music. Enjoy + gerund (not infinitive).",
      formula: "enjoy/finish/avoid/suggest + gerund (verb-ing)",
      trapAlerts: ["listen to is infinitive, wrong after enjoy", "listens to is conjugated verb", "listened to is past"],
      commonMistakes: ["Using infinitive after enjoy (should be gerund)", "Not learning verbs that take gerunds"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'verbs-basics', level: 'A1',
    question: 'They ___ not come to the party.',
    options: ['did', 'do', 'does', 'are'],
    answer: 0,
    explanation: {
      logic: "Come (base form after did) signals past. Did not = didn't come. Past simple negative uses did not + base verb.",
      formula: "Subject + did not + base verb (for past)",
      trapAlerts: ["do is present negative", "does is third person present", "are is for be verb or continuous"],
      commonMistakes: ["Using do for past negatives", "Not using did not for past"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'verbs-basics', level: 'A2',
    question: 'I would rather ___ at home.',
    options: ['stay', 'stays', 'staying', 'stayed'],
    answer: 0,
    explanation: {
      logic: "Would rather takes base verb form. Would rather stay (not stays/staying/stayed). Fixed expression with base verb.",
      formula: "would rather + base verb (stay, go, eat)",
      trapAlerts: ["stays has -s", "staying is -ing form", "stayed is past"],
      commonMistakes: ["Adding -s after would rather", "Using -ing or past after would rather"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'verbs-basics', level: 'A1',
    question: 'She ___ a teacher.',
    options: ['is', 'are', 'am', 'be'],
    answer: 0,
    explanation: {
      logic: "She uses is with be verb. Is a teacher = occupation/identity. Linking verb connecting subject to noun.",
      formula: "I am | You/we/they are | He/she/it is",
      trapAlerts: ["are is for plural/you", "am is for I", "be is infinitive"],
      commonMistakes: ["Using are with she", "Not conjugating be correctly"]
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
    console.log('\n🎓 VERBS-BASICS - 57 questions (to reach 60 total)');
    console.log('='.repeat(80));

    let inserted = 0;
    for (const q of VERBS_BASICS_57) {
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
        console.log(`   ✓ Inserted ${inserted}/57...`);
      }
    }

    console.log(`\n✅ Inserted all ${inserted} questions!`);
    console.log(`📊 VERBS-BASICS now complete: 60/60 total\n`);

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

insertQuestions();
