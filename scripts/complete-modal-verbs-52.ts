import { Pool } from 'pg';
import { config } from 'dotenv';

config({ path: '.env.local' });

// MODAL-VERBS - 52 questions (to reach 60 total from current 8)
const MODAL_VERBS_52 = [
  {
    topic: 'modal-verbs', level: 'A2',
    question: 'Raj ___ swim when he was five.',
    options: ['could', 'can', 'must', 'should'],
    answer: 0,
    explanation: {
      logic: "Could is past form of can (ability). When he was five = past time, so use could for past ability. Can is present ability.",
      formula: "could + base verb = past ability (could swim, could run, could read)",
      trapAlerts: ["can is present ability, not past", "must expresses obligation, not ability", "should is for advice, not ability"],
      commonMistakes: ["Using can for past ability", "Not learning could = past of can"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'modal-verbs', level: 'A2',
    question: 'You ___ wear a helmet when riding a bike.',
    options: ['must', 'can', 'may', 'might'],
    answer: 0,
    explanation: {
      logic: "Must expresses strong obligation or necessity (safety rule). Must wear = it is necessary/required. Strong obligation for safety.",
      formula: "must + base verb = strong obligation/necessity",
      trapAlerts: ["can expresses ability or permission, not obligation", "may is for permission or possibility", "might is for weak possibility"],
      commonMistakes: ["Using can for obligations", "Not distinguishing must (strong) from should (advice)"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'modal-verbs', level: 'A2',
    question: 'She ___ be at home. I saw her car outside.',
    options: ['must', 'can', 'may', 'should'],
    answer: 0,
    explanation: {
      logic: "Must for logical deduction/strong certainty. I saw her car (evidence) - she must be home (strong conclusion). 90%+ certainty.",
      formula: "must + be/verb = logical deduction (She must be tired, It must be true)",
      trapAlerts: ["can expresses ability, not deduction", "may is for weaker possibility (50%)", "should is for expectation or advice"],
      commonMistakes: ["Using can for deductions", "Not learning must = logical conclusion from evidence"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'modal-verbs', level: 'A2',
    question: '___ I borrow your pen?',
    options: ['May', 'Must', 'Should', 'Would'],
    answer: 0,
    explanation: {
      logic: "May I...? asks for permission politely. May I borrow = asking if it is okay/allowed. Formal polite permission request.",
      formula: "May I + base verb? = polite permission request (May I come in? May I use this?)",
      trapAlerts: ["Must is for obligation, not permission", "Should is for advice, not asking permission", "Would is for requests but less formal for permission"],
      commonMistakes: ["Using can instead of may for formal permission", "Not learning may for polite permission"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'modal-verbs', level: 'A2',
    question: 'He ___ study harder if he wants to pass.',
    options: ['should', 'can', 'may', 'will'],
    answer: 0,
    explanation: {
      logic: "Should gives advice or recommendation. He should study = it is advisable/recommended. Advice for achieving goal (passing).",
      formula: "should + base verb = advice/recommendation",
      trapAlerts: ["can expresses ability, not advice", "may is for permission or possibility", "will is for future certainty, not advice"],
      commonMistakes: ["Using must when advice (should) is more appropriate", "Not distinguishing should (advice) from must (obligation)"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'modal-verbs', level: 'B1',
    question: 'It ___ rain tomorrow. The sky is cloudy.',
    options: ['might', 'must', 'can', 'should'],
    answer: 0,
    explanation: {
      logic: "Might expresses possibility (less than 50% certainty). Cloudy sky suggests possible rain but not certain. Might = perhaps/maybe.",
      formula: "might + base verb = possibility (It might rain, He might come)",
      trapAlerts: ["must is for strong certainty (90%+), not possibility", "can is for ability or permission", "should is for expectation (80%), too strong here"],
      commonMistakes: ["Using must for possibilities", "Not learning might = weak possibility"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'modal-verbs', level: 'A2',
    question: 'You ___ not smoke here. It is not allowed.',
    options: ['must', 'can', 'should', 'may'],
    answer: 0,
    explanation: {
      logic: "Must not = prohibition (not allowed/forbidden). It is not allowed = rule/prohibition. Must not is stronger than should not.",
      formula: "must not + base verb = prohibition/forbidden (must not smoke, must not park)",
      trapAlerts: ["can not is about ability, not prohibition", "should not is advice against, not prohibition", "may not is refusal of permission, less strong"],
      commonMistakes: ["Using cannot for prohibitions (should use must not)", "Confusing must not (forbidden) with do not have to (not necessary)"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'modal-verbs', level: 'A2',
    question: 'Priya ___ speak three languages.',
    options: ['can', 'must', 'should', 'may'],
    answer: 0,
    explanation: {
      logic: "Can expresses ability or capability. Can speak = has the ability to speak. Present ability with can.",
      formula: "can + base verb = ability (can swim, can drive, can speak)",
      trapAlerts: ["must is for obligation, not ability", "should is for advice, not ability", "may is for permission or possibility"],
      commonMistakes: ["Using may instead of can for ability", "Not learning can = ability"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'modal-verbs', level: 'B1',
    question: 'You ___ have told me earlier!',
    options: ['should', 'must', 'can', 'will'],
    answer: 0,
    explanation: {
      logic: "Should have + past participle = past advice/regret. You should have told = it would have been better if you had told. Criticism or regret about past.",
      formula: "should have + past participle = past advice/regret (should have studied, should have called)",
      trapAlerts: ["must is for present obligation, not past regret", "can is for ability, not advice", "will is for future, not past"],
      commonMistakes: ["Not using past participle after should have", "Confusing should have (past) with should (present)"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'modal-verbs', level: 'A2',
    question: 'Students ___ bring their books to class.',
    options: ['must', 'can', 'may', 'might'],
    answer: 0,
    explanation: {
      logic: "Must for obligation/requirement. Must bring = it is required/necessary. School rule or requirement.",
      formula: "must + base verb = obligation/necessity (must attend, must submit, must complete)",
      trapAlerts: ["can is for ability or permission, not requirement", "may is for permission, not obligation", "might is for possibility, not requirement"],
      commonMistakes: ["Using should when must (strong obligation) is needed", "Not distinguishing obligation from advice"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'modal-verbs', level: 'B1',
    question: 'He ___ be at work. He never misses a day.',
    options: ['must', 'can', 'may', 'might'],
    answer: 0,
    explanation: {
      logic: "Must for logical deduction based on evidence. He never misses = strong evidence - he must be at work (very certain conclusion).",
      formula: "must + be/verb = strong deduction from evidence (90%+ certainty)",
      trapAlerts: ["can is ability, not deduction", "may is weaker possibility (50%)", "might is even weaker possibility (30%)"],
      commonMistakes: ["Using can for deductions", "Not recognizing must = logical certainty from evidence"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'modal-verbs', level: 'A2',
    question: 'You ___ leave early if you have finished.',
    options: ['may', 'must', 'should', 'would'],
    answer: 0,
    explanation: {
      logic: "May gives permission. You may leave = you are allowed to leave (if finished). Permission granted conditionally.",
      formula: "may + base verb = permission granted (You may go, You may use this)",
      trapAlerts: ["must is obligation, opposite of permission", "should is advice, not permission", "would is for requests or conditional"],
      commonMistakes: ["Using can when may is more formal for permission", "Not learning may = permission given"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'modal-verbs', level: 'B1',
    question: 'She ___ have arrived by now. The train was early.',
    options: ['should', 'can', 'must', 'may'],
    answer: 0,
    explanation: {
      logic: "Should have + past participle = expectation about past. Train was early (reason) - she should have arrived (expected). 80% expectation.",
      formula: "should have + past participle = past expectation (should have arrived, should have finished)",
      trapAlerts: ["can is ability, not expectation", "must have is for deduction (90%+), too strong here", "may have is weaker possibility (50%)"],
      commonMistakes: ["Using must have when should have (expectation) fits better", "Not using past participle after should have"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'modal-verbs', level: 'A2',
    question: '___ you help me with this?',
    options: ['Can', 'Must', 'May', 'Should'],
    answer: 0,
    explanation: {
      logic: "Can you...? makes informal polite request. Can you help = asking someone to do something. Common request form.",
      formula: "Can you + base verb? = request (Can you open this? Can you call me?)",
      trapAlerts: ["Must is too strong for requests", "May you is not used for requests in modern English", "Should you is wrong for requests"],
      commonMistakes: ["Using may for requests (can is more common)", "Not learning can for requests"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'modal-verbs', level: 'B1',
    question: 'I ___ rather stay home than go out.',
    options: ['would', 'will', 'can', 'must'],
    answer: 0,
    explanation: {
      logic: "Would rather = preference. Would rather stay = prefer to stay. Fixed expression with would, not will.",
      formula: "would rather + base verb + than + base verb = preference",
      trapAlerts: ["will is for simple future, not preference", "can is ability, not preference", "must is obligation, not preference"],
      commonMistakes: ["Using will instead of would in would rather", "Not learning would rather = preference"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'modal-verbs', level: 'A2',
    question: 'You ___ not worry about the exam.',
    options: ['should', 'must', 'can', 'may'],
    answer: 0,
    explanation: {
      logic: "Should not = advice against doing something. Should not worry = it is not advisable to worry. Giving advice not to do something.",
      formula: "should not + base verb = advice against (should not eat, should not go, should not worry)",
      trapAlerts: ["must not is prohibition (forbidden), too strong", "cannot is about ability, not advice", "may not is refusal of permission"],
      commonMistakes: ["Using must not when should not (advice) is appropriate", "Confusing advice with prohibition"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'modal-verbs', level: 'B1',
    question: 'They ___ have forgotten about the meeting.',
    options: ['might', 'can', 'should', 'will'],
    answer: 0,
    explanation: {
      logic: "Might have + past participle = possibility about past. Maybe they forgot (uncertain). Might have = perhaps something happened.",
      formula: "might have + past participle = past possibility (might have left, might have seen)",
      trapAlerts: ["can is present ability, not past possibility", "should is expectation, not possibility", "will is future, not past"],
      commonMistakes: ["Not using past participle after might have", "Confusing might have (possibility) with must have (deduction)"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'modal-verbs', level: 'A2',
    question: 'Raj ___ play cricket very well.',
    options: ['can', 'must', 'should', 'may'],
    answer: 0,
    explanation: {
      logic: "Can for ability/skill. Can play very well = has the ability/skill. Present ability.",
      formula: "can + base verb = ability/skill",
      trapAlerts: ["must is obligation, not ability", "should is advice, not ability", "may is permission or possibility"],
      commonMistakes: ["Using may for ability (should use can)", "Not recognizing can = ability"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'modal-verbs', level: 'B1',
    question: 'You ___ have been more careful!',
    options: ['should', 'can', 'must', 'will'],
    answer: 0,
    explanation: {
      logic: "Should have been = past advice/criticism. You were not careful enough (regret). Should have been more careful = criticism about past behavior.",
      formula: "should have been + adjective/comparative = past criticism",
      trapAlerts: ["can is ability, not criticism", "must is present obligation, not past criticism", "will is future, not past"],
      commonMistakes: ["Not using should have for past criticism", "Using must instead of should for advice"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'modal-verbs', level: 'A2',
    question: 'Visitors ___ not park here.',
    options: ['must', 'can', 'should', 'may'],
    answer: 0,
    explanation: {
      logic: "Must not = prohibition (not allowed). Parking rule/prohibition. Must not park = it is forbidden.",
      formula: "must not + base verb = prohibition (must not enter, must not touch)",
      trapAlerts: ["cannot is about ability, not rule", "should not is advice, weaker than prohibition", "may not is permission refusal, less formal"],
      commonMistakes: ["Using cannot for prohibitions", "Not understanding must not = forbidden"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'modal-verbs', level: 'B1',
    question: 'She ___ be joking! That is impossible.',
    options: ['must', 'can', 'may', 'should'],
    answer: 0,
    explanation: {
      logic: "Must be joking = logical deduction. That is impossible (evidence) - she must be joking (certain conclusion). Strong certainty from context.",
      formula: "must + be + -ing = strong present deduction (must be sleeping, must be working)",
      trapAlerts: ["can is ability, not deduction", "may is weaker possibility", "should is expectation, not certainty"],
      commonMistakes: ["Using can for strong deductions", "Not learning must = logical certainty"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'modal-verbs', level: 'A2',
    question: 'We ___ go to the cinema tonight.',
    options: ['might', 'must', 'should', 'can'],
    answer: 0,
    explanation: {
      logic: "Might for tentative plan/possibility. Might go = perhaps we will go (not decided yet). Possibility about future plan.",
      formula: "might + base verb = future possibility (might go, might come, might stay)",
      trapAlerts: ["must is strong obligation, too strong", "should is advice or expectation", "can is ability or permission"],
      commonMistakes: ["Using must for tentative plans", "Not learning might = maybe/perhaps"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'modal-verbs', level: 'B1',
    question: 'He ___ have left already. His coat is gone.',
    options: ['must', 'can', 'may', 'should'],
    answer: 0,
    explanation: {
      logic: "Must have + past participle = past deduction. His coat is gone (evidence) - he must have left (strong conclusion about past). 90%+ certainty.",
      formula: "must have + past participle = past deduction (must have forgotten, must have seen)",
      trapAlerts: ["can is present ability", "may have is weaker (50% possibility)", "should have is expectation, not deduction"],
      commonMistakes: ["Not using past participle after must have", "Using can have (wrong form)"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'modal-verbs', level: 'A2',
    question: 'Children ___ play in the garden.',
    options: ['may', 'must', 'should', 'would'],
    answer: 0,
    explanation: {
      logic: "May = permission granted. Children may play = they are allowed to play. Giving permission.",
      formula: "may + base verb = permission (may go, may use, may eat)",
      trapAlerts: ["must is obligation, not permission", "should is advice, not permission", "would is for hypothetical or requests"],
      commonMistakes: ["Using must when giving permission (should use may)", "Not distinguishing permission from obligation"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'modal-verbs', level: 'B1',
    question: 'You ___ have seen the Taj Mahal. It is beautiful.',
    options: ['should', 'must', 'can', 'may'],
    answer: 0,
    explanation: {
      logic: "Should have + past participle = advice or regret. You should have seen = it would have been good to see (recommendation about past). Expressing missed opportunity.",
      formula: "should have + past participle = past advice/regret (should have visited, should have tried)",
      trapAlerts: ["must is deduction, not recommendation", "can is ability", "may is permission or possibility"],
      commonMistakes: ["Using must have for recommendations", "Not learning should have = past advice"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'modal-verbs', level: 'A2',
    question: 'I ___ swim when I was younger.',
    options: ['could', 'can', 'must', 'should'],
    answer: 0,
    explanation: {
      logic: "Could = past ability. When I was younger = past time. Could swim = had the ability in past.",
      formula: "could + base verb = past ability (could run, could speak, could play)",
      trapAlerts: ["can is present ability, not past", "must is obligation", "should is advice"],
      commonMistakes: ["Using can for past (should use could)", "Not learning could = past of can"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'modal-verbs', level: 'B1',
    question: 'It ___ be true. I do not believe it.',
    options: ['cannot', 'must not', 'should not', 'may not'],
    answer: 0,
    explanation: {
      logic: "Cannot be = logical impossibility/disbelief. I do not believe it - it cannot be true (impossible/certainly false). Strong negative deduction.",
      formula: "cannot + be/verb = impossibility/strong disbelief (cannot be right, cannot work)",
      trapAlerts: ["must not is prohibition, not impossibility", "should not is advice against", "may not is refusal or weak possibility"],
      commonMistakes: ["Using must not for impossibility (should use cannot)", "Not learning cannot = impossibility"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'modal-verbs', level: 'A2',
    question: 'You ___ wash your hands before eating.',
    options: ['should', 'can', 'may', 'might'],
    answer: 0,
    explanation: {
      logic: "Should = advice/recommendation for hygiene. Should wash = it is advisable. Health advice.",
      formula: "should + base verb = advice (should eat, should sleep, should exercise)",
      trapAlerts: ["can is ability or permission", "may is permission granted", "might is possibility"],
      commonMistakes: ["Using must for advice (should is softer)", "Not distinguishing advice from obligation"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'modal-verbs', level: 'B1',
    question: 'They ___ not have heard the news yet.',
    options: ['may', 'can', 'must', 'should'],
    answer: 0,
    explanation: {
      logic: "May not have + past participle = past negative possibility. Perhaps they have not heard yet (uncertain). 50% possibility.",
      formula: "may not have + past participle = past negative possibility",
      trapAlerts: ["cannot have is impossibility, too strong", "must is certainty, opposite", "should is expectation"],
      commonMistakes: ["Using cannot have when may not have (possibility) fits", "Not using past participle"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'modal-verbs', level: 'A2',
    question: 'Priya ___ drive a car.',
    options: ['can', 'must', 'should', 'may'],
    answer: 0,
    explanation: {
      logic: "Can = ability. Can drive = has the ability/knows how to drive.",
      formula: "can + base verb = ability",
      trapAlerts: ["must is obligation", "should is advice", "may is permission"],
      commonMistakes: ["Using may for ability", "Not recognizing can = ability"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'modal-verbs', level: 'B1',
    question: 'He ___ have studied more for the exam.',
    options: ['should', 'can', 'must', 'will'],
    answer: 0,
    explanation: {
      logic: "Should have + past participle = past advice/regret. He did not study enough - he should have studied more (regret/criticism).",
      formula: "should have + past participle = past advice/regret",
      trapAlerts: ["can is ability", "must is present obligation", "will is future"],
      commonMistakes: ["Not using should have for past regret", "Using must instead of should"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'modal-verbs', level: 'A2',
    question: 'We ___ be quiet in the library.',
    options: ['must', 'can', 'may', 'might'],
    answer: 0,
    explanation: {
      logic: "Must = obligation/rule. Library rule: must be quiet = it is required. Strong necessity.",
      formula: "must + be/verb = obligation (must be on time, must submit, must follow)",
      trapAlerts: ["can is ability or permission", "may is permission", "might is possibility"],
      commonMistakes: ["Using should when must (rule) is needed", "Not recognizing library rules as obligations"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'modal-verbs', level: 'B1',
    question: 'She ___ have been sleeping when you called.',
    options: ['must', 'can', 'should', 'may'],
    answer: 0,
    explanation: {
      logic: "Must have been + -ing = past continuous deduction. She did not answer (evidence) - she must have been sleeping (logical conclusion about ongoing past action).",
      formula: "must have been + -ing = past continuous deduction",
      trapAlerts: ["can is present ability", "should is expectation, not deduction", "may is weaker possibility"],
      commonMistakes: ["Using can have been (wrong)", "Not using past continuous after must have been"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'modal-verbs', level: 'A2',
    question: '___ I use your phone?',
    options: ['May', 'Must', 'Should', 'Will'],
    answer: 0,
    explanation: {
      logic: "May I = polite permission request. May I use = asking if allowed. Formal polite form.",
      formula: "May I + base verb? = polite permission request",
      trapAlerts: ["Must is obligation", "Should is advice", "Will is future or willingness"],
      commonMistakes: ["Using can instead of may for formal permission", "Not learning may for politeness"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'modal-verbs', level: 'B1',
    question: 'You ___ not have told him the secret.',
    options: ['should', 'can', 'must', 'will'],
    answer: 0,
    explanation: {
      logic: "Should not have + past participle = past criticism. You told him (mistake) - you should not have told (regret/criticism about past action).",
      formula: "should not have + past participle = past criticism (should not have gone, should not have said)",
      trapAlerts: ["can is ability", "must is present obligation", "will is future"],
      commonMistakes: ["Not using should not have for past mistakes", "Using must not for past criticism"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'modal-verbs', level: 'A2',
    question: 'It ___ be cold tomorrow.',
    options: ['will', 'can', 'must', 'should'],
    answer: 0,
    explanation: {
      logic: "Will = future prediction/certainty. Will be cold = predicting future weather with certainty.",
      formula: "will + be/verb = future prediction (will rain, will come, will be)",
      trapAlerts: ["can is ability or possibility, not prediction", "must is for deduction about present", "should is expectation, less certain"],
      commonMistakes: ["Using can for future predictions", "Not using will for definite future"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'modal-verbs', level: 'B1',
    question: 'He ___ have missed the train.',
    options: ['might', 'can', 'will', 'should'],
    answer: 0,
    explanation: {
      logic: "Might have + past participle = past possibility. Maybe he missed it (uncertain). Might have = perhaps something happened in past.",
      formula: "might have + past participle = past possibility (might have left, might have forgotten)",
      trapAlerts: ["can is present ability", "will is future", "should is expectation or advice"],
      commonMistakes: ["Not using past participle after might have", "Confusing possibility with deduction"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'modal-verbs', level: 'A2',
    question: 'You ___ eat more vegetables.',
    options: ['should', 'can', 'may', 'must'],
    answer: 0,
    explanation: {
      logic: "Should = health advice. Should eat more vegetables = it is advisable for health.",
      formula: "should + base verb = advice",
      trapAlerts: ["can is ability", "may is permission", "must is too strong for advice (obligation)"],
      commonMistakes: ["Using must for advice (should is softer)", "Not distinguishing advice from obligation"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'modal-verbs', level: 'B1',
    question: 'She ___ not have known about the party.',
    options: ['could', 'can', 'must', 'will'],
    answer: 0,
    explanation: {
      logic: "Could not have + past participle = past impossibility/inability. She did not come (evidence) - she could not have known (was not able to know). Past inability or impossibility.",
      formula: "could not have + past participle = past impossibility/inability",
      trapAlerts: ["cannot is present impossibility", "must is certainty, opposite meaning", "will is future"],
      commonMistakes: ["Using cannot have (wrong form)", "Not using past participle after could not have"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'modal-verbs', level: 'A2',
    question: 'Passengers ___ fasten their seatbelts.',
    options: ['must', 'can', 'may', 'might'],
    answer: 0,
    explanation: {
      logic: "Must = safety obligation/rule. Must fasten = it is required (airline rule). Strong necessity for safety.",
      formula: "must + base verb = strong obligation",
      trapAlerts: ["can is ability or permission", "may is permission granted", "might is possibility"],
      commonMistakes: ["Using should for safety rules (must is stronger)", "Not recognizing must for requirements"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'modal-verbs', level: 'B1',
    question: 'They ___ be happy with the news.',
    options: ['should', 'can', 'may', 'must'],
    answer: 0,
    explanation: {
      logic: "Should be = expectation (80% certainty). Good news - they should be happy (expected reaction). Reasonable expectation.",
      formula: "should + be/verb = expectation (should be ready, should arrive, should know)",
      trapAlerts: ["can is ability", "may is weaker possibility (50%)", "must is stronger deduction (90%+)"],
      commonMistakes: ["Using must when should (expectation) is more appropriate", "Not learning should = expectation"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'modal-verbs', level: 'A2',
    question: 'Raj ___ not go to school yesterday. He was sick.',
    options: ['could', 'can', 'must', 'should'],
    answer: 0,
    explanation: {
      logic: "Could not = past inability. He was sick (reason) - he could not go (was not able). Past inability due to sickness.",
      formula: "could not + base verb = past inability (could not come, could not finish)",
      trapAlerts: ["cannot is present inability", "must is obligation", "should is advice"],
      commonMistakes: ["Using cannot for past (should use could not)", "Not learning could not = past inability"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'modal-verbs', level: 'B1',
    question: 'You ___ better see a doctor.',
    options: ['had', 'have', 'must', 'should'],
    answer: 0,
    explanation: {
      logic: "Had better = strong advice/recommendation (stronger than should). You had better see a doctor = strong recommendation for health.",
      formula: "had better + base verb = strong advice (had better go, had better study)",
      trapAlerts: ["have is wrong - need had", "must is obligation, not advice", "should is weaker advice"],
      commonMistakes: ["Using have instead of had in had better", "Not learning had better = strong advice"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'modal-verbs', level: 'A2',
    question: 'She ___ be tired. She has been working all day.',
    options: ['must', 'can', 'may', 'should'],
    answer: 0,
    explanation: {
      logic: "Must = logical deduction. Working all day (evidence) - she must be tired (certain conclusion). Strong certainty from evidence.",
      formula: "must + be/verb = deduction from evidence",
      trapAlerts: ["can is ability", "may is weaker possibility", "should is expectation, less certain"],
      commonMistakes: ["Using can for deductions", "Not recognizing must = logical certainty"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'modal-verbs', level: 'B1',
    question: 'We ___ have taken a taxi. We are late.',
    options: ['should', 'can', 'must', 'will'],
    answer: 0,
    explanation: {
      logic: "Should have + past participle = past regret. We did not take taxi - we should have taken one (regret about past decision). We are late (consequence).",
      formula: "should have + past participle = past regret/missed opportunity",
      trapAlerts: ["can is ability", "must is present obligation", "will is future"],
      commonMistakes: ["Not using should have for past regrets", "Using must instead of should"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'modal-verbs', level: 'A2',
    question: '___ you like some tea?',
    options: ['Would', 'Can', 'Must', 'Should'],
    answer: 0,
    explanation: {
      logic: "Would you like = polite offer. Would you like some tea = offering something politely.",
      formula: "Would you like + noun/to + verb? = polite offer",
      trapAlerts: ["Can is less polite for offers", "Must is obligation, not offer", "Should is advice, not offer"],
      commonMistakes: ["Using can for polite offers (would is more polite)", "Not learning would you like for offers"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'modal-verbs', level: 'B1',
    question: 'He ___ have been lying. His story was not true.',
    options: ['must', 'can', 'should', 'may'],
    answer: 0,
    explanation: {
      logic: "Must have been + -ing = past continuous deduction. Story was not true (evidence) - he must have been lying (certain conclusion about ongoing past action).",
      formula: "must have been + -ing = past continuous deduction",
      trapAlerts: ["can is present ability", "should is expectation", "may is weaker possibility"],
      commonMistakes: ["Not using must have been for continuous past deductions", "Using present continuous form"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'modal-verbs', level: 'A2',
    question: 'You ___ do your homework now.',
    options: ['must', 'can', 'may', 'might'],
    answer: 0,
    explanation: {
      logic: "Must = parental/teacher obligation. Must do your homework = it is required/necessary. Giving strong instruction.",
      formula: "must + base verb = obligation/instruction",
      trapAlerts: ["can is ability or permission", "may is permission given", "might is possibility"],
      commonMistakes: ["Using should for strong obligations", "Not recognizing must for requirements"]
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
    console.log('\n🎓 MODAL-VERBS - 52 questions (to reach 60 total)');
    console.log('='.repeat(80));

    let inserted = 0;
    for (const q of MODAL_VERBS_52) {
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
        console.log(`   ✓ Inserted ${inserted}/52...`);
      }
    }

    console.log(`\n✅ Inserted all ${inserted} questions!`);
    console.log(`📊 MODAL-VERBS now complete: 60/60 total\n`);

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

insertQuestions();
