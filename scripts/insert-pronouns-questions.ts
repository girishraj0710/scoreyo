import { Pool } from 'pg';
import { config } from 'dotenv';

config({ path: '.env.local' });

/**
 * Pronouns Questions - Complete 60 questions
 * Topic: pronouns-detailed (A1 level)
 * Subtopics: Personal pronouns (15), Possessive pronouns (15), Reflexive pronouns (15), Demonstrative pronouns (15)
 */

const PRONOUNS_QUESTIONS = [
  // SUBTOPIC 1: Personal Pronouns (Subject & Object) - 15 questions
  {
    question: "Choose the correct subject pronoun:\n\n'___ is my best friend.'",
    options: ["She", "Her", "Hers", "Herself"],
    correctAnswer: 0,
    explanation: {
      logic: "Subject pronouns (I, you, he, she, it, we, they) come before verbs and perform actions. 'She' is the subject doing the action (is). 'Her' is object pronoun, 'hers' is possessive pronoun, 'herself' is reflexive pronoun.",
      formula: "Subject pronoun + verb (She is, He plays, They go)",
      trapAlerts: [
        "'Her' is object pronoun - comes after verbs (I saw her), not before",
        "'Hers' is possessive pronoun - shows ownership (The book is hers), not subject",
        "'Herself' is reflexive - used for emphasis or when subject = object (She saw herself)"
      ],
      commonMistakes: [
        "Using 'her' as subject (saying 'Her is my friend' instead of 'She is')",
        "Confusing subject and object pronouns - common for Hindi speakers where gender doesn't change form"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Complete the sentence:\n\n'I saw ___ at the market yesterday.'",
    options: ["him", "he", "his", "himself"],
    correctAnswer: 0,
    explanation: {
      logic: "Object pronouns (me, you, him, her, it, us, them) come after verbs and prepositions. 'Him' is object of the verb 'saw'. Rule: If the pronoun receives the action, use object form.",
      formula: "Verb + object pronoun (saw him, called me, helped us)",
      trapAlerts: [
        "'he' is subject pronoun - goes before verbs (He runs), not after",
        "'his' is possessive - shows ownership (his book), not action receiver",
        "'himself' is reflexive - used when he does action to himself (He saw himself)"
      ],
      commonMistakes: [
        "Using subject pronoun after verb (saying 'I saw he' instead of 'I saw him')",
        "Not knowing when to switch between he/him forms"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Which sentence uses pronouns correctly?",
    options: [
      "She and I went to the cinema.",
      "Her and me went to the cinema.",
      "She and me went to the cinema.",
      "Her and I went to the cinema."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "When using two pronouns as subjects, both must be in subject form: 'She and I' (not 'her and me'). Test by splitting: 'She went' ✓ 'I went' ✓ = both correct. Polite order: mention the other person first, yourself last.",
      formula: "Subject pronoun + and + subject pronoun + verb (She and I went, He and they play)",
      trapAlerts: [
        "'Her and me' uses both object pronouns - wrong for subjects before verbs",
        "'She and me' mixes subject + object - inconsistent, both must be subject",
        "'Her and I' mixes object + subject - inconsistent, both must be subject"
      ],
      commonMistakes: [
        "Using 'me' as subject (saying 'me went' instead of 'I went')",
        "Mixing subject and object pronouns in compound subjects"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Find the error:\n\n'Me and Priya are going to the park.'",
    options: [
      "'Me' should be 'I' and should come after 'Priya'",
      "'are going' should be 'is going'",
      "'the park' should be 'park'",
      "No error"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Two errors: (1) Use subject pronoun 'I' (not object 'me') before verbs, (2) Polite order: mention others first, yourself last: 'Priya and I' (not 'Me and Priya'). Test: 'I am going' ✓ (not 'Me am going' ✗).",
      formula: "Other person + and + I (subject) = Polite order | Verb + other + and + me (object)",
      trapAlerts: [
        "'are going' is correct - plural subject (Priya and I) needs plural verb",
        "'the park' is correct - 'the' is fine with specific locations",
        "The sentence has two errors (wrong pronoun + wrong order)"
      ],
      commonMistakes: [
        "Starting with 'Me and...' - should be 'I and...' or 'Other person and I'",
        "Not knowing 'me' is only for object position, never subject"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Choose the correct pronoun:\n\n'The teacher gave ___ homework.'",
    options: ["us", "we", "our", "ourselves"],
    correctAnswer: 0,
    explanation: {
      logic: "'Us' is object pronoun - receives the action of 'gave'. The teacher performed the action; we received it. Object pronouns come after verbs and prepositions.",
      formula: "gave/sent/told + object pronoun (gave us, told me, sent them)",
      trapAlerts: [
        "'we' is subject pronoun - goes before verbs (We play), not after",
        "'our' is possessive adjective - goes before nouns (our homework), not alone",
        "'ourselves' is reflexive - for when we give to ourselves (We gave ourselves homework)"
      ],
      commonMistakes: [
        "Using 'we' after verbs (saying 'gave we' instead of 'gave us')",
        "Confusing object pronoun (us) with possessive adjective (our)"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "What is the object pronoun for 'she'?",
    options: ["her", "hers", "herself", "she's"],
    correctAnswer: 0,
    explanation: {
      logic: "Subject 'she' becomes object 'her'. Pattern: I→me, you→you, he→him, she→her, it→it, we→us, they→them. Object pronouns receive actions or follow prepositions.",
      formula: "Subject forms: I, you, he, she, it, we, they | Object forms: me, you, him, her, it, us, them",
      trapAlerts: [
        "'hers' is possessive pronoun (That book is hers), not object form",
        "'herself' is reflexive pronoun (She saw herself), not basic object",
        "'she's' is contraction (she is / she has), not a pronoun form"
      ],
      commonMistakes: [
        "Not knowing 'her' works as both object AND possessive adjective (her = object, her book = possessive)",
        "Thinking 'hers' is the object form - it's possessive pronoun"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Complete correctly:\n\n'Can you help ___ with this bag?'",
    options: ["me", "I", "my", "mine"],
    correctAnswer: 0,
    explanation: {
      logic: "'Me' is object pronoun after verb 'help'. The pattern 'help + object pronoun' is very common. The person asking needs help, so they use 'me' (receiver of help).",
      trapAlerts: [
        "'I' is subject - goes before verbs (I help), not after",
        "'my' is possessive adjective - needs a noun after it (my bag), not alone",
        "'mine' is possessive pronoun - shows ownership (The bag is mine), not for receiving actions"
      ],
      commonMistakes: [
        "Using 'I' after verbs (saying 'help I' instead of 'help me')",
        "Confusing possessive adjectives (my, your, his) with object pronouns"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Which is correct when talking about Raj?",
    options: [
      "He is my friend. I like him.",
      "Him is my friend. I like he.",
      "He is my friend. I like he.",
      "Him is my friend. I like him."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Use 'he' (subject) before verbs: 'He is'. Use 'him' (object) after verbs: 'I like him'. First sentence: he = subject doing (is). Second sentence: him = object receiving (like).",
      formula: "Subject position = he | Object position = him",
      trapAlerts: [
        "Option B uses 'him' before verb and 'he' after verb - completely reversed",
        "Option C uses 'he' correctly first but wrong 'he' after 'like' - should be 'him'",
        "Option D uses 'him' as subject - wrong, subjects need 'he'"
      ],
      commonMistakes: [
        "Using same form in both positions (saying 'him is' or 'like he')",
        "Not understanding English pronouns change form based on position"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Choose the sentence with correct pronoun usage:",
    options: [
      "They invited my brother and me to the party.",
      "They invited my brother and I to the party.",
      "They invited me and my brother to the party.",
      "Them invited my brother and I to the party."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Invited' is a verb, so pronouns after it must be object form: 'me' (not 'I'). Test by removing 'my brother and': 'They invited me' ✓ (not 'They invited I' ✗). Option A also follows polite order: others first, yourself last.",
      formula: "Verb + other person + and + me (object) | Other + and + I (subject) + verb",
      trapAlerts: [
        "'I' is subject pronoun - can't be object of 'invited' (should be 'me')",
        "Option C uses 'me' correctly but wrong order (should mention others first)",
        "'Them' is object pronoun - can't be subject (should be 'they' before verb)"
      ],
      commonMistakes: [
        "Using 'I' after verbs (saying 'invited I' instead of 'invited me')",
        "Not applying the split test: remove others and check if pronoun alone works"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Find the error:\n\n'Between you and I, this is a secret.'",
    options: [
      "'I' should be 'me'",
      "'Between' should be 'Among'",
      "'you' should be 'your'",
      "No error"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "After prepositions (between, for, with, to), use object pronouns: 'me' (not 'I'). 'Between you and me' is correct. Common error: people think 'I' sounds more formal, but it's grammatically wrong after prepositions.",
      formula: "Preposition + object pronoun (between me, with him, for us, to them)",
      trapAlerts: [
        "'Between' is correct - use 'between' for two people, 'among' for three or more",
        "'you' is correct - 'you' stays same in subject and object forms",
        "The sentence has one error ('I' should be 'me')"
      ],
      commonMistakes: [
        "Using 'I' after prepositions (saying 'between you and I', 'with you and I')",
        "Thinking 'I' is more formal than 'me' - position matters, not formality"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Complete with the correct pronoun:\n\n'___ are my classmates.'",
    options: ["They", "Them", "Their", "Theirs"],
    correctAnswer: 0,
    explanation: {
      logic: "'They' is subject pronoun before verb 'are'. Subject pronouns perform actions or are linked to descriptions. 'They' refers to multiple people being described as classmates.",
      formula: "They + are/were/do (They are students, They were here, They do homework)",
      trapAlerts: [
        "'Them' is object pronoun - comes after verbs (I saw them), not before",
        "'Their' is possessive adjective - needs noun after (their books), not alone",
        "'Theirs' is possessive pronoun - shows ownership (The books are theirs), not subject"
      ],
      commonMistakes: [
        "Using 'them' as subject (saying 'Them are' instead of 'They are')",
        "Confusing they/them/their/theirs - all have different uses"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Which sentence is grammatically correct?",
    options: [
      "She gave it to him yesterday.",
      "Her gave it to he yesterday.",
      "She gave it to he yesterday.",
      "Her gave it to him yesterday."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'She' (subject) performs action. 'It' (object) receives action. 'Him' (object) receives after preposition 'to'. All pronouns are in correct forms for their positions.",
      formula: "Subject + verb + object + preposition + object (She gave it to him)",
      trapAlerts: [
        "Option B uses 'her' as subject and 'he' after 'to' - both wrong positions",
        "Option C uses 'he' after preposition - should be 'him' (object after prepositions)",
        "Option D uses 'her' as subject - should be 'she' (subject before verbs)"
      ],
      commonMistakes: [
        "Using subject pronouns after prepositions (saying 'to he', 'for she')",
        "Using object pronouns before verbs (saying 'her gave', 'him runs')"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Choose the correct pronouns:\n\n'___ and ___ are going shopping.'",
    options: [
      "She and I",
      "Her and me",
      "She and me",
      "Her and I"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Both pronouns are subjects before verb 'are going', so both need subject form: 'She and I'. Test each separately: 'She is going' ✓, 'I am going' ✓. Both work, so both are correct.",
      trapAlerts: [
        "'Her and me' uses both object forms - wrong before verbs",
        "'She and me' mixes subject + object - must be consistent (both subject or both object)",
        "'Her and I' mixes object + subject - must be consistent"
      ],
      commonMistakes: [
        "Using 'me' as subject in compound subjects",
        "Not testing each pronoun separately to check correctness"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "What are the three forms of 'we'?",
    options: [
      "Subject: we, Object: us, Possessive adjective: our",
      "Subject: we, Object: we, Possessive: ours",
      "Subject: us, Object: we, Possessive: our",
      "Subject: we, Object: our, Possessive: ours"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Every personal pronoun has three basic forms: Subject (we go), Object (help us), Possessive adjective (our book). Pattern: we → us → our. Fourth form is possessive pronoun: ours (The book is ours).",
      formula: "we (subject) → us (object) → our (possessive adj) → ours (possessive pronoun)",
      trapAlerts: [
        "Option B keeps 'we' for object - wrong, object form is 'us'",
        "Option C swaps subject and object - 'us' is object, not subject",
        "Option D uses 'our' as object - 'our' is possessive adjective, object is 'us'"
      ],
      commonMistakes: [
        "Using 'we' after verbs (saying 'gave we' instead of 'gave us')",
        "Confusing 'our' (needs noun: our book) with 'ours' (stands alone: book is ours)"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Complete the dialogue:\n\nA: 'Who is at the door?'\nB: 'It's ___.'",
    options: [
      "me",
      "I",
      "my",
      "mine"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "After 'It's' (It is), we use object pronoun 'me' in informal speech. Formal grammar says 'It is I', but natural English uses 'It's me'. Same pattern: It's him, It's her, It's us, It's them.",
      formula: "It's + object pronoun (natural English: It's me, It's him, It's us)",
      trapAlerts: [
        "'I' is grammatically formal ('It is I') but sounds unnatural in normal conversation",
        "'my' is possessive adjective - needs a noun (It's my turn), not alone",
        "'mine' is possessive pronoun - for ownership (The book is mine), not identity"
      ],
      commonMistakes: [
        "Using formal 'I' in casual speech (sounds overly formal: 'It is I')",
        "Not knowing informal English prefers object pronouns here"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },

  // SUBTOPIC 2: Possessive Pronouns & Adjectives - 15 questions
  // Continuing in same file...
  {
    question: "Choose the correct possessive adjective:\n\n'This is ___ book.'",
    options: ["my", "mine", "I", "me"],
    correctAnswer: 0,
    explanation: {
      logic: "Possessive adjectives (my, your, his, her, its, our, their) go BEFORE nouns. They describe ownership. 'My book' = the book belongs to me. 'Mine' stands alone without a noun.",
      formula: "Possessive adjective + noun (my book, your pen, his car) | Possessive pronoun alone (mine, yours, his)",
      trapAlerts: [
        "'mine' is possessive pronoun - stands alone (The book is mine), not before nouns",
        "'I' is subject pronoun - for performing actions (I read), not showing ownership",
        "'me' is object pronoun - receives actions (helped me), not for ownership"
      ],
      commonMistakes: [
        "Using 'mine' before nouns (saying 'mine book' instead of 'my book')",
        "Confusing possessive adjectives (my, your) with possessive pronouns (mine, yours)"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Complete the sentence:\n\n'That phone is not mine. It's ___.'",
    options: ["yours", "your", "you", "you're"],
    correctAnswer: 0,
    explanation: {
      logic: "Possessive pronouns (mine, yours, his, hers, ours, theirs) stand alone - no noun after them. They show ownership. 'It's yours' = It belongs to you. Compare: 'your phone' (adjective + noun) vs 'It's yours' (pronoun alone).",
      formula: "Possessive pronoun stands alone (mine, yours, his, hers, ours, theirs)",
      trapAlerts: [
        "'your' is possessive adjective - needs noun after (your phone), not alone",
        "'you' is personal pronoun - subject/object form, not possessive",
        "'you're' is contraction of 'you are' - not related to ownership"
      ],
      commonMistakes: [
        "Using possessive adjective alone (saying 'It's your' instead of 'It's yours')",
        "Confusing 'your' (adjective) with 'yours' (pronoun) and 'you're' (you are)"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Find the error:\n\n'This bag is her.'",
    options: [
      "'her' should be 'hers'",
      "'This' should be 'That'",
      "'is' should be 'are'",
      "No error"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Her' is possessive adjective and needs a noun (her bag). When standing alone after 'is', use possessive pronoun 'hers': 'The bag is hers'. Pattern: her bag (adjective) BUT it's hers (pronoun).",
      formula: "her + noun (her bag) | noun + is + hers (bag is hers)",
      trapAlerts: [
        "'This' is correct - can use 'this' for nearby items",
        "'is' is correct - singular subject (bag) needs singular verb",
        "The sentence has one error ('her' should be 'hers')"
      ],
      commonMistakes: [
        "Using 'her' alone after 'is' - common error for Hindi speakers",
        "Not knowing 'her' needs a noun, 'hers' stands alone"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Which sentence is correct?",
    options: [
      "This is my pen. That pen is yours.",
      "This is mine pen. That pen is your.",
      "This is my pen. That pen is your.",
      "This is mine pen. That pen is yours."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Before nouns: 'my pen', 'your pen' (possessive adjectives). Alone: 'mine', 'yours' (possessive pronouns). First sentence uses both correctly: 'my' + noun, then 'yours' alone.",
      formula: "Possessive adj + noun (my pen) | Possessive pronoun alone (yours)",
      trapAlerts: [
        "Option B uses 'mine pen' - wrong, 'mine' never goes before nouns",
        "Option C uses 'your' alone - wrong, need 'yours' when standing alone",
        "Option D uses 'mine pen' - possessive pronouns don't go before nouns"
      ],
      commonMistakes: [
        "Putting possessive pronouns before nouns (saying 'mine book', 'yours pen')",
        "Using possessive adjectives alone (saying 'It's my', 'That's your')"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Choose the correct word:\n\n'Whose laptop is this? It's ___.'",
    options: ["his", "him", "he", "he's"],
    correctAnswer: 0,
    explanation: {
      logic: "'His' works as BOTH possessive adjective (his laptop) AND possessive pronoun (It's his). Unique pattern: his is the only form that doesn't change. Compare: her → hers, my → mine, your → yours, but his stays his.",
      formula: "his + noun (his laptop) | It's + his (It's his) - same word both times!",
      trapAlerts: [
        "'him' is object pronoun - receives actions (I saw him), not for ownership",
        "'he' is subject pronoun - performs actions (He runs), not for ownership",
        "'he's' is contraction (he is / he has) - not possessive"
      ],
      commonMistakes: [
        "Thinking 'his' needs to change form like her→hers, my→mine",
        "Confusing 'his' with 'he's' (he is) in writing"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Complete correctly:\n\n'These are ___ books, and those are ___.'",
    options: [
      "our, theirs",
      "ours, their",
      "our, their",
      "ours, theirs"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "First blank needs possessive adjective before noun 'books': 'our books'. Second blank stands alone (no noun), so needs possessive pronoun: 'theirs'. Pattern: our books BUT books are theirs.",
      formula: "Possessive adj + noun (our books) | Possessive pronoun alone (theirs)",
      trapAlerts: [
        "Option B uses 'ours' before noun - wrong, 'ours' never precedes nouns",
        "Option C uses 'their' alone - wrong, need 'theirs' when standing alone",
        "Option D uses 'ours' before noun - possessive pronouns don't go before nouns"
      ],
      commonMistakes: [
        "Using possessive pronouns before nouns (saying 'ours books')",
        "Using possessive adjectives alone without nouns (saying 'Those are their')"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "What's the possessive pronoun for 'it'?",
    options: [
      "There is no possessive pronoun for 'it' - use 'its'",
      "its'",
      "it's",
      "ites"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'It' is unique - it only has possessive adjective 'its' (its tail), no separate possessive pronoun form. We don't say 'The tail is its'. Instead: 'It has its tail' or rephrase. Note: 'it's' = it is/has (contraction, not possessive).",
      formula: "its + noun (its tail, its color) | NO standalone form exists",
      trapAlerts: [
        "'its'' with apostrophe doesn't exist - possessives don't use apostrophes (his, hers, yours, theirs, its)",
        "'it's' = it is OR it has (contraction), NOT possessive",
        "'ites' is not a real word in English"
      ],
      commonMistakes: [
        "Writing 'it's' for possessive - should be 'its' (no apostrophe)",
        "Adding apostrophe to possessive pronouns (writing 'her's', 'your's', 'their's')"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Find the error:\n\n'The house lost it's roof in the storm.'",
    options: [
      "'it's' should be 'its'",
      "'The house' should be 'A house'",
      "'lost' should be 'losed'",
      "No error"
    },
    correctAnswer: 0,
    explanation: {
      logic: "'It's' = it is or it has (contraction). For possession, use 'its' (no apostrophe): 'its roof' = the roof of it. Possessive pronouns NEVER use apostrophes: its, his, hers, yours, theirs, ours.",
      formula: "Possessive = its (no apostrophe) | Contraction = it's (it is / it has)",
      trapAlerts: [
        "'The house' is correct - can use 'the' with specific houses",
        "'lost' is correct irregular past tense (lose → lost, not 'losed')",
        "The sentence has one error ('it's' should be 'its')"
      ],
      commonMistakes: [
        "Using apostrophe for possessive 'its' - very common error",
        "Confusing possessive 'its' with contraction 'it's' (it is)"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Choose the sentence where 'your' and 'yours' are used correctly:",
    options: [
      "Is this your bag? No, that one is yours.",
      "Is this yours bag? No, that one is your.",
      "Is this your bag? No, that one is your.",
      "Is this yours bag? No, that one is yours."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Before noun = possessive adjective 'your' (your bag). Alone = possessive pronoun 'yours' (it's yours). First part: 'your' + noun. Second part: 'yours' stands alone. Both used correctly.",
      trapAlerts: [
        "Option B uses 'yours bag' - possessive pronouns never go before nouns",
        "Option C uses 'your' alone - need 'yours' when standing without a noun",
        "Option D uses 'yours bag' - wrong, 'yours' doesn't precede nouns"
      ],
      commonMistakes: [
        "Using 'yours' before nouns (saying 'yours book')",
        "Using 'your' alone after 'is' (saying 'It's your')"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Complete the dialogue:\n\nA: 'Whose turn is it?'\nB: 'It's ___ turn.'",
    options: [
      "my",
      "mine",
      "I",
      "me"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'My' is possessive adjective before noun 'turn': 'my turn'. Even though it comes after 'is', the noun 'turn' is still there, so we use 'my' (not 'mine'). Compare: 'It's my turn' (noun present) vs 'It's mine' (no noun).",
      formula: "It's + possessive adjective + noun (my turn) | It's + possessive pronoun (mine - no noun)",
      trapAlerts: [
        "'mine' stands alone - can't say 'mine turn' (possessive pronouns don't precede nouns)",
        "'I' is subject pronoun - for actions (I play), not ownership",
        "'me' is object pronoun - receives actions (help me), not for ownership"
      ],
      commonMistakes: [
        "Using 'mine' before nouns (saying 'It's mine turn')",
        "Not recognizing that 'turn' is still a noun needing possessive adjective"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Which pair shows possessive adjective and possessive pronoun correctly?",
    options: [
      "her book / The book is hers",
      "hers book / The book is her",
      "her book / The book is her",
      "hers book / The book is hers"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Possessive adjective 'her' goes before noun: 'her book'. Possessive pronoun 'hers' stands alone: 'It's hers'. This matches the pattern: my/mine, your/yours, his/his, her/hers, our/ours, their/theirs.",
      formula: "her + noun (her book) | noun + is + hers (book is hers)",
      trapAlerts: [
        "Option B uses 'hers book' - possessive pronouns never precede nouns",
        "Option C uses 'her' alone after 'is' - need 'hers' when standing alone",
        "Option D uses 'hers book' - wrong position for possessive pronoun"
      ],
      commonMistakes: [
        "Using 'hers' before nouns",
        "Using 'her' alone after 'is' - common for Hindi speakers"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Find the correct sentence:",
    options: [
      "My sister's room is bigger than mine.",
      "My sister's room is bigger than my.",
      "Mine sister's room is bigger than my.",
      "My sister's room is bigger than me."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Than mine' compares rooms: my sister's room vs my room. 'Mine' stands for 'my room' (possessive pronoun replaces the whole phrase). Full sentence would be: 'than my room', shortened to 'than mine'.",
      formula: "Comparison + than + possessive pronoun (bigger than mine = bigger than my room)",
      trapAlerts: [
        "'than my' is incomplete - 'my' needs a noun after it (than my room = OK, than my = incomplete)",
        "'Mine sister's' uses possessive pronoun before noun - should be 'my'",
        "'than me' compares people, not rooms - 'me' is personal pronoun, not possessive"
      ],
      commonMistakes: [
        "Using possessive adjective alone in comparisons (saying 'bigger than my')",
        "Confusing personal pronouns (me) with possessive pronouns (mine)"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Complete with the correct possessive form:\n\n'The dog wagged ___ tail.'",
    options: [
      "its",
      "it's",
      "his",
      "their"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Its' (no apostrophe) shows possession for animals/things: 'its tail' = the tail of it (the dog). Animals use 'it/its' unless we know the gender and want to personalize (then we can use he/his or she/her).",
      formula: "Animal/thing + its (possessive, no apostrophe)",
      trapAlerts: [
        "'it's' = it is or it has (contraction), NOT possessive",
        "'his' could work if we're calling the dog 'he', but default for animals is 'its'",
        "'their' is plural - used for multiple dogs, not one dog"
      ],
      commonMistakes: [
        "Using apostrophe for possessive 'its' (writing 'it's tail')",
        "Using 'his/her' for all animals - default is 'its' unless personalized"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Which sentence correctly uses possessives?",
    options: [
      "Our house is bigger than theirs.",
      "Ours house is bigger than their.",
      "Our house is bigger than their.",
      "Ours house is bigger than theirs."
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Our' (adjective) + noun 'house'. 'Theirs' (pronoun) stands alone comparing 'our house' with 'their house'. The possessive pronoun 'theirs' replaces the full phrase 'their house'.",
      formula: "our + noun (our house) | comparison + theirs (theirs = their house)",
      trapAlerts: [
        "Option B uses 'ours house' - possessive pronouns don't go before nouns",
        "Option C uses 'their' alone - need 'theirs' when standing alone in comparison",
        "Option D uses 'ours house' - wrong, 'ours' never precedes nouns"
      ],
      commonMistakes: [
        "Using possessive pronouns before nouns (saying 'ours house', 'theirs car')",
        "Using possessive adjectives alone (saying 'bigger than our/their')"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Why is this wrong: 'The cat licked it's paws'?",
    options: [
      "'it's' should be 'its' - possessive has no apostrophe",
      "'licked' should be 'lick'",
      "'paws' should be 'paw'",
      "Nothing is wrong"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'It's' = it is/has (contraction). Possessive = 'its' (no apostrophe). The cat's paws belong to it, so possessive 'its' needed. Memory trick: Possessive pronouns never use apostrophes (his, hers, yours, ours, theirs, its).",
      formula: "Possessive = its (no apostrophe) | Contraction = it's (it is/has)",
      trapAlerts: [
        "'licked' is correct past tense (regular verb: lick + ed)",
        "'paws' is correct plural (cats have multiple paws)",
        "The sentence has one error - apostrophe in 'it's'"
      ],
      commonMistakes: [
        "Adding apostrophe to possessive 'its' - extremely common error",
        "Not remembering possessive pronouns NEVER use apostrophes"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },

  // SUBTOPIC 3: Reflexive Pronouns - 15 questions
  // SUBTOPIC 4: Demonstrative Pronouns - 15 questions
  // Will continue in next batch to stay under token limits
];

async function insertQuestions() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('\n🎓 Inserting Pronouns Questions (Batch 1/2)');
    console.log('='.repeat(80));
    console.log(`\n📋 Topic: pronouns-detailed (A1 level)`);
    console.log(`   Questions in this batch: ${PRONOUNS_QUESTIONS.length}`);
    console.log(`   Subtopics covered: Personal Pronouns (15), Possessive Pronouns (15)\n`);

    let inserted = 0;
    for (const q of PRONOUNS_QUESTIONS) {
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
        console.log(`   ✓ Inserted ${inserted}/${PRONOUNS_QUESTIONS.length}...`);
      }
    }

    console.log(`\n✅ Successfully inserted ${inserted} questions!`);
    console.log(`\n📊 Progress: ${inserted}/60 questions for pronouns-detailed`);
    console.log(`   Next batch will add 30 more (Reflexive + Demonstrative)`);

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

insertQuestions();
