import { Pool } from 'pg';
import { config } from 'dotenv';

config({ path: '.env.local' });

/**
 * Pronouns Questions - Batch 2/2
 * Subtopics: Reflexive Pronouns (15) + Demonstrative Pronouns (15)
 */

const PRONOUNS_BATCH2 = [
  // SUBTOPIC 3: Reflexive Pronouns - 15 questions
  {
    question: "Complete the sentence:\n\n'I made this cake ___.'",
    options: ["myself", "me", "my", "mine"],
    correctAnswer: 0,
    explanation: {
      logic: "Reflexive pronouns (myself, yourself, himself, herself, itself, ourselves, themselves) show that the subject did the action alone or to themselves. 'I made it myself' = I did it without help. Reflexive = subject + self/selves.",
      formula: "Subject + verb + reflexive pronoun (I did it myself, She taught herself)",
      trapAlerts: [
        "'me' is object pronoun - receives actions but doesn't show 'by myself' meaning",
        "'my' is possessive adjective - needs a noun (my cake), not for emphasizing alone",
        "'mine' is possessive pronoun - shows ownership, not that I did it alone"
      ],
      commonMistakes: [
        "Not using reflexive for emphasis (saying 'I made it' without 'myself' loses the emphasis)",
        "Confusing reflexive (myself) with object pronouns (me)"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Which sentence uses a reflexive pronoun correctly?",
    options: [
      "She hurt herself while cooking.",
      "She hurt her while cooking.",
      "She hurt hers while cooking.",
      "She hurt she while cooking."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "When the subject and object are the same person, use reflexive pronoun: 'She hurt herself' = She hurt her own body. If subject ≠ object, use regular object pronoun: 'She hurt him' (him is someone else).",
      formula: "Subject = Object → Use reflexive (She hurt herself) | Subject ≠ Object → Use object pronoun (She hurt him)",
      trapAlerts: [
        "'her' is object pronoun - would mean she hurt another female person, not herself",
        "'hers' is possessive pronoun - for ownership, not for receiving actions",
        "'she' is subject pronoun - can't be object of verb 'hurt'"
      ],
      commonMistakes: [
        "Using object pronoun when subject = object (saying 'She hurt her' for hurting oneself)",
        "Not knowing when reflexive is required vs optional"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Complete correctly:\n\n'The children enjoyed ___ at the party.'",
    options: ["themselves", "theirselves", "them", "their"],
    correctAnswer: 0,
    explanation: {
      logic: "'Themselves' is the reflexive pronoun for 'they'. Pattern: myself, yourself, himself, herself, itself, ourselves, yourselves, themselves. Note: 'theirselves' is not a real word - common mistake!",
      formula: "Plural reflexive: ourselves (we), yourselves (you plural), themselves (they)",
      trapAlerts: [
        "'theirselves' is NOT a real word - extremely common error, correct form is 'themselves'",
        "'them' is object pronoun - doesn't show they enjoyed by themselves",
        "'their' is possessive adjective - needs noun (their party), not for actions"
      ],
      commonMistakes: [
        "Saying 'theirselves' - it's 'themselves' (no 'selves' with 'their')",
        "Using 'them' instead of 'themselves' in expressions like 'enjoyed themselves'"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Find the error:\n\n'He looked at hisself in the mirror.'",
    options: [
      "'hisself' should be 'himself'",
      "'looked at' should be 'looked'",
      "'in the mirror' should be 'at the mirror'",
      "No error"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Hisself' is not a real word - common non-standard error. Correct reflexive for 'he' is 'himself'. Pattern: himself, herself, itself (NOT hisself, herselfs, itsself).",
      formula: "Singular reflexive: myself (I), yourself (you), himself (he), herself (she), itself (it)",
      trapAlerts: [
        "'looked at' is correct - this phrasal verb needs 'at'",
        "'in the mirror' is correct - we look at our reflection IN the mirror",
        "The sentence has one error ('hisself' should be 'himself')"
      ],
      commonMistakes: [
        "Saying 'hisself' instead of 'himself' - non-standard dialectal form",
        "Creating reflexives by adding 'self' to possessives (his+self, their+selves)"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "When do we use reflexive pronouns?\n\nChoose the most complete answer:",
    options: [
      "When subject and object are the same, OR for emphasis",
      "Only when talking about injuries",
      "Only after prepositions",
      "Always after 'by'"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Reflexive pronouns have two main uses: (1) When subject = object: 'She saw herself', (2) For emphasis: 'I made it myself' (= without help). Also used after some prepositions: 'by myself', 'for yourself'.",
      formula: "Subject = Object (She saw herself) | Emphasis (I did it myself) | After 'by' (by myself = alone)",
      trapAlerts: [
        "Not only for injuries - used for all actions where subject = object (saw, taught, enjoyed)",
        "Not only after prepositions - main use is when subject = object",
        "Not always after 'by' - 'by' can take object pronouns too (pass by me)"
      ],
      commonMistakes: [
        "Overusing reflexives (saying 'I and myself went' instead of just 'I went')",
        "Not using reflexives when needed (saying 'He hurt him' when meaning himself)"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Complete the sentence:\n\n'You should be proud of ___.'",
    options: ["yourself", "you", "your", "yours"],
    correctAnswer: 0,
    explanation: {
      logic: "After the preposition 'of', when referring back to the subject 'you', use reflexive pronoun 'yourself'. Pattern: be proud of myself/yourself/himself/herself/ourselves/themselves. The person feeling pride and the object of pride are the same.",
      trapAlerts: [
        "'you' is subject/object pronoun - doesn't show you're proud of your own self",
        "'your' is possessive adjective - needs noun (your work), not used alone here",
        "'yours' is possessive pronoun - for ownership, not for reflexive meaning"
      ],
      commonMistakes: [
        "Not using reflexive after 'of' in these expressions",
        "Saying 'proud of you' when subject and object are same person"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Which is correct?",
    options: [
      "We taught ourselves to play guitar.",
      "We taught ourself to play guitar.",
      "We taught us to play guitar.",
      "We taught ours to play guitar."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Ourselves' is reflexive pronoun for 'we'. When 'we' is subject and also object (taught whom? ourselves), use reflexive. Note: plural reflexives end in '-selves' (ourselves, yourselves, themselves), not '-self'.",
      formula: "Plural reflexives: ourselves, yourselves, themselves (all end in -selves)",
      trapAlerts: [
        "'ourself' is wrong - plural reflexive needs '-selves', not '-self'",
        "'us' is object pronoun - doesn't emphasize we did it without a teacher",
        "'ours' is possessive pronoun - shows ownership, not reflexive action"
      ],
      commonMistakes: [
        "Using 'ourself' (singular) with 'we' (plural) - should be 'ourselves'",
        "Forgetting plural reflexives end in '-selves' not '-self'"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Complete correctly:\n\n'The cat cleaned ___ after eating.'",
    options: ["itself", "it", "its", "it's"],
    correctAnswer: 0,
    explanation: {
      logic: "'Itself' is reflexive pronoun for 'it'. When animals clean themselves, use reflexive: 'The cat cleaned itself' = cleaned its own body. Subject (cat) and object (what was cleaned) are the same.",
      trapAlerts: [
        "'it' is object pronoun - would mean the cat cleaned something else",
        "'its' is possessive - needs noun (its fur), not for receiving action",
        "'it's' = it is / it has (contraction), not reflexive or possessive"
      ],
      commonMistakes: [
        "Using 'it' when animal is both subject and object",
        "Confusing 'itself' (reflexive) with 'its' (possessive) and 'it's' (it is)"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Find the sentence that does NOT need a reflexive pronoun:",
    options: [
      "She introduced her friend to me.",
      "She introduced herself to me.",
      "He prepared himself for the exam.",
      "They enjoyed themselves at the party."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "In 'She introduced her friend', the subject (she) and object (her friend) are DIFFERENT people, so we use object pronoun 'her', not reflexive. Reflexive only when subject = object, or for emphasis.",
      trapAlerts: [
        "'introduced herself' needs reflexive - she introduced her own self",
        "'prepared himself' needs reflexive - he prepared his own self",
        "'enjoyed themselves' needs reflexive - they enjoyed their own selves"
      ],
      commonMistakes: [
        "Overusing reflexives when subject ≠ object",
        "Not recognizing when two different people/things are involved"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Complete with reflexive pronoun:\n\n'I cut ___ while chopping vegetables.'",
    options: ["myself", "me", "I", "my"],
    correctAnswer: 0,
    explanation: {
      logic: "When you accidentally hurt yourself, use reflexive pronoun: 'I cut myself' = I cut my own body. Subject (I) and object (who got cut) are the same person, so reflexive is required.",
      trapAlerts: [
        "'me' is object pronoun - technically could work but 'myself' is clearer for self-inflicted action",
        "'I' is subject pronoun - can't be object of verb 'cut'",
        "'my' is possessive adjective - needs noun (my finger), not used alone"
      ],
      commonMistakes: [
        "Using 'me' instead of 'myself' for accidental self-harm",
        "Not using reflexive for actions done to oneself"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Which sentence uses a reflexive pronoun for EMPHASIS (not required grammar)?",
    options: [
      "I myself will talk to the manager.",
      "She saw herself in the photo.",
      "They hurt themselves playing cricket.",
      "He taught himself to code."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Emphatic use: 'I myself' = I personally, not someone else. This is optional - sentence works without it ('I will talk'). Other sentences REQUIRE reflexives grammatically - subject = object in all of them.",
      formula: "Emphasis = optional (I myself = I personally) | Required = subject = object",
      trapAlerts: [
        "'saw herself' requires reflexive - she saw her own image (subject = object)",
        "'hurt themselves' requires reflexive - they hurt their own bodies",
        "'taught himself' requires reflexive - he taught his own self"
      ],
      commonMistakes: [
        "Not understanding the difference between emphatic and required reflexives",
        "Omitting required reflexives thinking they're just emphasis"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Complete the sentence:\n\n'She lives by ___ now.'",
    options: ["herself", "her", "she", "hers"],
    correctAnswer: 0,
    explanation: {
      logic: "'By myself/yourself/himself/herself' means alone - living alone. 'By' + reflexive = without others. This is an idiomatic use of reflexives showing independence.",
      formula: "by + reflexive pronoun = alone (by myself, by herself, by themselves)",
      trapAlerts: [
        "'her' is object pronoun - 'by her' would mean next to another female, not alone",
        "'she' is subject pronoun - can't come after preposition 'by'",
        "'hers' is possessive pronoun - doesn't mean 'alone'"
      ],
      commonMistakes: [
        "Not using reflexive after 'by' meaning alone",
        "Saying 'by her' when meaning 'alone' - should be 'by herself'"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Find the error:\n\n'My brother and myself went to the cinema.'",
    options: [
      "'myself' should be 'I'",
      "'My brother' should be 'Me brother'",
      "'went' should be 'goed'",
      "No error"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Don't use reflexive as subject! 'Myself' cannot be subject of a sentence. Use 'I': 'My brother and I went'. Reflexives are for objects or emphasis, not subjects. Test: 'Myself went' ✗ = wrong, so 'I went' ✓.",
      formula: "Subject position = I, you, he, she, we, they (NEVER myself, yourself, etc.)",
      trapAlerts: [
        "'My brother' is correct - possessive adjective before noun is right",
        "'went' is correct irregular past tense (go → went, not 'goed')",
        "The sentence has one error ('myself' as subject)"
      ],
      commonMistakes: [
        "Using reflexive pronouns as subjects (very common error)",
        "Thinking 'myself' sounds more formal than 'I' - it's wrong as subject"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Choose the correct reflexive pronoun:\n\n'Be careful! Don't burn ___.'",
    options: ["yourself", "you", "your", "yours"],
    correctAnswer: 0,
    explanation: {
      logic: "In warnings about self-harm, use reflexive: 'Don't burn yourself' = don't burn your own body. The person being warned (you) is also the potential victim (yourself), so reflexive is needed.",
      trapAlerts: [
        "'you' is object pronoun - less clear that you'd burn your own self",
        "'your' is possessive adjective - needs noun (your hand), not alone",
        "'yours' is possessive pronoun - for ownership, not receiving action"
      ],
      commonMistakes: [
        "Using 'you' instead of 'yourself' in self-harm warnings",
        "Not using reflexive in 'be careful' warnings"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "What's wrong with: 'The door opened by themselves'?",
    options: [
      "'themselves' should be 'itself' - door is singular",
      "'opened' should be 'openned'",
      "'by' should be 'with'",
      "Nothing is wrong"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'The door' is singular, so reflexive must be 'itself' (not 'themselves' for plural). Agreement: I→myself, you→yourself, he→himself, she→herself, it→itself, we→ourselves, they→themselves.",
      formula: "Singular subject = singular reflexive | Plural subject = plural reflexive",
      trapAlerts: [
        "'opened' is correct - regular past tense (open + ed, not 'openned')",
        "'by' is correct - 'by itself' = without help from others",
        "The sentence has one error (plural reflexive with singular subject)"
      ],
      commonMistakes: [
        "Not matching reflexive pronoun number with subject",
        "Using plural reflexive with singular subjects"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },

  // SUBTOPIC 4: Demonstrative Pronouns - 15 questions
  {
    question: "Complete the sentence:\n\n'___ is my house.' (pointing to nearby house)",
    options: ["This", "That", "These", "Those"],
    correctAnswer: 0,
    explanation: {
      logic: "Demonstrative pronouns point to things. 'This' = singular, near (close to speaker). 'That' = singular, far. 'These' = plural, near. 'Those' = plural, far. The house is near and singular, so 'this'.",
      formula: "Near + Singular = This | Far + Singular = That | Near + Plural = These | Far + Plural = Those",
      trapAlerts: [
        "'That' is for far things - use when pointing to something distant",
        "'These' is plural - use for multiple nearby things, not one",
        "'Those' is plural and far - wrong on both counts here"
      ],
      commonMistakes: [
        "Confusing this/that based on distance - 'this' is near, 'that' is far",
        "Using plural forms with singular nouns"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Which demonstrative pronoun is correct?\n\n'___ books on the top shelf belong to Priya.' (shelf is far from speaker)",
    options: ["Those", "That", "This", "These"],
    correctAnswer: 0,
    explanation: {
      logic: "'Books' is plural, and 'top shelf' suggests distance from speaker. 'Those' = plural + far. Demonstratives must agree in number (singular/plural) with the noun they refer to.",
      formula: "Far + Plural = Those",
      trapAlerts: [
        "'That' is singular - doesn't match plural 'books'",
        "'This' is singular and near - wrong on both distance and number",
        "'These' is near - but shelf is described as far (top shelf)"
      ],
      commonMistakes: [
        "Not matching demonstrative number with noun (using singular with plural nouns)",
        "Confusing near/far demonstratives"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Find the error:\n\n'This books are very interesting.'",
    options: [
      "'This' should be 'These'",
      "'books' should be 'book'",
      "'are' should be 'is'",
      "No error"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Books' is plural, so demonstrative must be plural: 'These books' (not 'this books'). Demonstratives must agree in number with their nouns. This/that = singular, these/those = plural.",
      formula: "Singular noun = this/that | Plural noun = these/those",
      trapAlerts: [
        "Changing 'books' to 'book' would work but changes meaning to one book",
        "'are' is correct for plural subject - don't change it to 'is'",
        "The sentence has one error (singular 'this' with plural 'books')"
      ],
      commonMistakes: [
        "Using 'this' with plural nouns (very common for Hindi speakers)",
        "Not making demonstratives agree with noun number"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Complete correctly:\n\n'What is ___?' (asking about something in your hand)",
    options: ["this", "that", "these", "those"],
    correctAnswer: 0,
    explanation: {
      logic: "'This' for singular things near you (in your hand = very close). Use 'this' in questions about nearby objects. Demonstratives work same in questions as statements.",
      trapAlerts: [
        "'that' is for things far away - not in your hand",
        "'these' is plural - for multiple things, question asks about one thing",
        "'those' is plural and far - wrong on both counts"
      ],
      commonMistakes: [
        "Using 'that' for everything regardless of distance",
        "Not considering proximity when choosing this vs that"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Which sentence uses demonstratives correctly?",
    options: [
      "This is my book, and that is yours.",
      "This is my book, and this is yours.",
      "That is my book, and this is yours.",
      "These is my book, and those is yours."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'This' points to the near book (mine), 'that' points to the far book (yours). Using different demonstratives shows they're in different locations. Both are singular ('is'), both books are singular.",
      formula: "Near object = this | Far object = that | Both singular = is",
      trapAlerts: [
        "Option B uses 'this' twice - doesn't distinguish near/far locations",
        "Option C uses 'that' for near object - backwards logic",
        "Option D uses 'these/those' (plural) with singular 'book' and singular verb 'is'"
      ],
      commonMistakes: [
        "Using same demonstrative for objects at different distances",
        "Not matching plural demonstratives with plural verbs"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Complete the sentence:\n\n'___ were the best days of my life.' (talking about past, distant time)",
    options: ["Those", "These", "That", "This"],
    correctAnswer: 0,
    explanation: {
      logic: "'Days' is plural, and past time is metaphorically 'far' from present. 'Those' = plural + distant (in time or space). We use 'those' for past events, 'these' for present/recent events.",
      formula: "Plural + Past/Distant = Those | Plural + Present/Recent = These",
      trapAlerts: [
        "'These' is for recent/present times - 'these days' = nowadays",
        "'That' is singular - doesn't match plural 'days'",
        "'This' is singular and present - wrong on both counts"
      ],
      commonMistakes: [
        "Using 'these' for distant past - should be 'those'",
        "Not recognizing time distance uses same demonstratives as space distance"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Find the correct sentence:",
    options: [
      "These shoes are too tight.",
      "This shoes are too tight.",
      "These shoe are too tight.",
      "This shoe are too tight."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Shoes' is plural (a pair has two shoes), so use plural demonstrative 'these' and plural verb 'are'. All three must agree: demonstrative + noun + verb = all plural or all singular.",
      formula: "Plural: these/those + plural noun + are | Singular: this/that + singular noun + is",
      trapAlerts: [
        "Option B uses singular 'this' with plural 'shoes' - number disagreement",
        "Option C uses singular 'shoe' with plural 'these' and 'are' - mixed singular/plural",
        "Option D has multiple errors - 'this shoe' is singular but 'are' is plural"
      ],
      commonMistakes: [
        "Not maintaining number agreement across demonstrative-noun-verb",
        "Forgetting 'shoes' is always plural (we don't say 'a shoe' when wearing)"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Complete the dialogue:\n\nA: 'I love pizza!'\nB: '___ is my favorite food too!'",
    options: ["That", "This", "Those", "These"],
    correctAnswer: 0,
    explanation: {
      logic: "'That' refers back to something just mentioned (pizza). When referring to something said/mentioned before, use 'that' (singular) or 'those' (plural). Pizza is singular, so 'that'.",
      formula: "Referring back to singular mention = that | Referring back to plural mention = those",
      trapAlerts: [
        "'This' is for introducing new topics or nearby things, not referring back",
        "'Those' is plural - pizza is singular food",
        "'These' is plural and for introducing/nearby things"
      ],
      commonMistakes: [
        "Using 'this' when referring back - 'that' is more natural",
        "Not matching number when referring back"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "What's wrong with: 'Those is my favorite movie'?",
    options: [
      "'Those' should be 'That' - movie is singular",
      "'is' should be 'are'",
      "'favorite' should be 'favorites'",
      "Nothing is wrong"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Movie' is singular, so demonstrative must be singular: 'that' (not plural 'those'). 'That is my favorite movie' = correct. Demonstrative number must match noun number.",
      trapAlerts: [
        "Changing 'is' to 'are' doesn't fix the plural 'those' with singular 'movie'",
        "Making 'favorite' plural doesn't make sense - you have one favorite",
        "The sentence has one error (plural demonstrative with singular noun)"
      ],
      commonMistakes: [
        "Using 'those' with singular nouns",
        "Not checking demonstrative-noun number agreement"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Choose the correct demonstrative:\n\n'I prefer ___ days when we had more time.' (past days)",
    options: ["those", "these", "that", "this"],
    correctAnswer: 0,
    explanation: {
      logic: "'Days' is plural, and 'had' (past tense) indicates we're talking about past time (distant). 'Those' = plural + distant time. Use 'those' for past, 'these' for present.",
      formula: "Plural + Past = those days | Plural + Present = these days",
      trapAlerts: [
        "'these' refers to present/recent time - 'these days' = nowadays",
        "'that' is singular - doesn't match plural 'days'",
        "'this' is singular and present - wrong on both counts"
      ],
      commonMistakes: [
        "Using 'these days' for past - should be 'those days'",
        "Not applying near/far rule to time as well as space"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Complete correctly:\n\n'___ is what I think about the plan.' (about to explain your opinion)",
    options: ["This", "That", "These", "Those"],
    correctAnswer: 0,
    explanation: {
      logic: "When introducing something you're about to say, use 'this' (if singular idea) or 'these' (if multiple ideas). 'This is what I think' = I'm about to tell you. 'That' refers back to what was already said.",
      formula: "About to say = this/these | Already said = that/those",
      trapAlerts: [
        "'That' is for referring back to what someone said, not introducing your new thought",
        "'These' is plural - for introducing multiple ideas, but 'what I think' is singular",
        "'Those' is plural and backwards - for multiple ideas already mentioned"
      ],
      commonMistakes: [
        "Using 'that' when introducing new thoughts - 'this' is for introducing",
        "Confusing forward-reference (this) with backward-reference (that)"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Find the sentence with correct demonstrative usage:",
    options: [
      "In those days, life was simpler.",
      "In these days, life was simpler.",
      "In this day, life were simpler.",
      "In that days, life were simpler."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Those days' = past time (distant). 'Life was' = singular subject with past tense 'was'. Past time events use 'those days', not 'these days' (present). Phrase 'in those days' is an idiom.",
      formula: "In those days = past time idiom | In these days = not idiomatic (say 'these days' or 'nowadays')",
      trapAlerts: [
        "'these days' refers to present/modern times, not past with 'was simpler'",
        "'this day' is singular + 'were' is plural - number disagreement",
        "'that days' has singular 'that' with plural 'days' + 'were' with singular 'life'"
      ],
      commonMistakes: [
        "Using 'these days' with past tense - should be 'those days'",
        "Not learning the idiom 'in those days' for talking about the past"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Complete the comparison:\n\n'I like this phone, but ___ one is better.' (pointing to distant phone)",
    options: ["that", "this", "these", "those"],
    correctAnswer: 0,
    explanation: {
      logic: "Comparing two singular items: nearby 'this phone' vs. distant 'that one'. When contrasting near and far items, use 'this' for near and 'that' for far. 'One' refers to phone (singular).",
      trapAlerts: [
        "'this' would refer to the same nearby phone - no contrast",
        "'these' is plural - 'one' is singular",
        "'those' is plural - 'one' is singular"
      ],
      commonMistakes: [
        "Using same demonstrative for both items being compared",
        "Not using demonstratives to show distance contrast"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Which demonstrates correct time reference?\n\n'___ days, everyone uses smartphones.' (talking about present)",
    options: ["These", "Those", "This", "That"],
    correctAnswer: 0,
    explanation: {
      logic: "'These days' = nowadays, in modern times (present). It's an idiom for current time period. 'Days' is plural, present time is metaphorically 'near', so 'these'. 'Those days' = past time.",
      formula: "These days = nowadays, currently | Those days = in the past, back then",
      trapAlerts: [
        "'Those' refers to past time - 'those days' = back then, not now",
        "'This' is singular - 'days' is plural",
        "'That' is singular and refers to past/distant time"
      ],
      commonMistakes: [
        "Using 'those days' for present time - should be 'these days'",
        "Not knowing 'these days' = 'nowadays' (common idiom)"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Find the error:\n\n'Give me that pen, this one is broken.' (both pens are nearby)",
    options: [
      "'that' should be 'this' - both are nearby",
      "'this' should be 'that'",
      "'pen' should be 'pens'",
      "No error"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "If both pens are nearby, use 'this' for both (or 'this one' and 'that one' to distinguish them by relative distance). Since question says both are nearby, saying 'that pen' creates unnecessary distance.",
      trapAlerts: [
        "Changing 'this' to 'that' makes both far - but question says both nearby",
        "'pen' is correctly singular in both uses",
        "The sentence has one error if both pens are truly nearby"
      ],
      commonMistakes: [
        "Automatically using 'that' for any object being discussed",
        "Not considering actual proximity when choosing demonstratives"
      ]
    },
    difficulty: "hard",
    level: "A1"
  }
];

async function insertQuestions() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('\n🎓 Inserting Pronouns Questions (Batch 2/2)');
    console.log('='.repeat(80));
    console.log(`\n📋 Topic: pronouns-detailed (A1 level)`);
    console.log(`   Questions in this batch: ${PRONOUNS_BATCH2.length}`);
    console.log(`   Subtopics covered: Reflexive Pronouns (15), Demonstrative Pronouns (15)\n`);

    let inserted = 0;
    for (const q of PRONOUNS_BATCH2) {
      await pool.query(
        `INSERT INTO english_questions
         (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
        [
          'foundation',
          'pronouns-detailed',
          q.level,
          q.question,
          JSON.stringify(q.options),
          q.correctAnswer,
          JSON.stringify(q.explanation),
          q.difficulty,
        ]
      );
      inserted++;

      if (inserted % 10 === 0) {
        console.log(`   ✓ Inserted ${inserted}/${PRONOUNS_BATCH2.length}...`);
      }
    }

    console.log(`\n✅ Successfully inserted ${inserted} questions!`);
    console.log(`\n📊 COMPLETE: 60/60 questions for pronouns-detailed topic`);
    console.log(`   ✅ Personal Pronouns (Subject & Object): 15 questions`);
    console.log(`   ✅ Possessive Pronouns & Adjectives: 15 questions`);
    console.log(`   ✅ Reflexive Pronouns: 15 questions`);
    console.log(`   ✅ Demonstrative Pronouns: 15 questions`);

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

insertQuestions();
