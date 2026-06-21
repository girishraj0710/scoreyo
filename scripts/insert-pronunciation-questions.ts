import { Pool } from 'pg';
import { config } from 'dotenv';

config({ path: '.env.local' });

/**
 * Pronunciation Basics Questions - Batch 1
 * Topic: pronunciation-basics (A1 level)
 * Subtopics: Word Stress (20), Syllables (20)
 */

const PRONUNCIATION_QUESTIONS_BATCH1 = [
  // SUBTOPIC 1: Word Stress Patterns - 20 questions
  {
    question: "What is word stress?\n\nChoose the best definition:",
    options: [
      "The syllable we say louder and longer in a word",
      "Speaking every syllable equally loud",
      "The first letter of a word",
      "The last sound in a word"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Word stress means one syllable in a word is pronounced LOUDER, LONGER, and with higher pitch than others. In 'TAblet', the first syllable 'TA' is stressed. In 'comPUter', the middle syllable 'PU' is stressed. Stress changes meaning: 'REcord' (noun) vs 'reCORD' (verb).",
      formula: "Stressed syllable = LOUDER + LONGER + HIGHER pitch",
      trapAlerts: [
        "Equal stress on all syllables makes speech sound robotic and unnatural",
        "The first letter is spelling, not pronunciation - stress is about sound",
        "The last sound doesn't determine stress - stress is about syllables, not individual sounds"
      ],
      commonMistakes: [
        "Stressing every syllable equally (Hindi influence - Hindi has more even stress)",
        "Not recognizing that stress changes word meaning in English"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Where is the stress in the word 'STUDENT'?\n\n(Capital letters show stress)",
    options: [
      "STUdent (first syllable)",
      "stuDENT (second syllable)",
      "Both syllables equal",
      "No stress needed"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Student' has two syllables: STU-dent. English speakers stress the FIRST syllable: STU (loud and long) + dent (quiet and short). Pattern: STU-dent, not stu-DENT. Most two-syllable nouns stress the first syllable.",
      formula: "Two-syllable nouns often stress first: STUdent, TAble, PENcil",
      trapAlerts: [
        "'stuDENT' (second syllable stress) sounds unnatural - wrong stress pattern for this noun",
        "Equal stress on both syllables makes it sound non-native",
        "All English words have stress - it's essential for clear communication"
      ],
      commonMistakes: [
        "Stressing the second syllable in two-syllable nouns",
        "Not learning that most 2-syllable nouns = first syllable stress"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Which word has stress on the SECOND syllable?",
    options: [
      "baNAna",
      "APple",
      "ORange",
      "MANgo"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Banana' has three syllables: ba-NA-na. The middle syllable 'NA' is stressed: ba-NA-na (quiet-LOUD-quiet). Apple (AP-ple), orange (OR-ange), mango (MAN-go) all stress the FIRST syllable.",
      formula: "ba-NA-na: middle syllable stressed (1-2-1 pattern)",
      trapAlerts: [
        "'APple' stresses first syllable: AP-ple (not ap-PLE)",
        "'ORange' stresses first syllable: OR-ange (not or-ANGE)",
        "'MANgo' stresses first syllable: MAN-go (not man-GO)"
      ],
      commonMistakes: [
        "Stressing all three syllables in 'banana' equally",
        "Not recognizing which syllable is prominent in multi-syllable words"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Where is the stress in 'COMPUTER'?",
    options: [
      "comPUter (second syllable)",
      "COMputer (first syllable)",
      "compuTER (third syllable)",
      "All syllables equal"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Computer' has three syllables: com-PU-ter. The MIDDLE syllable 'PU' is stressed: com-PU-ter. This is the standard pronunciation in both British and American English.",
      formula: "com-PU-ter: middle syllable stressed",
      trapAlerts: [
        "'COMputer' stresses the wrong syllable - sounds unnatural",
        "'compuTER' puts stress at the end - incorrect pattern",
        "English words always have one main stress - never all equal"
      ],
      commonMistakes: [
        "Stressing the first syllable in 'computer' (Hindi influence)",
        "Not learning stress patterns for common words"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Why is word stress important in English?",
    options: [
      "It changes meaning and helps understanding",
      "It makes speech slower",
      "It's only for singing",
      "It's optional - not necessary"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Word stress is ESSENTIAL in English. Wrong stress can: (1) Change meaning: 'REcord' (noun) vs 'reCORD' (verb), (2) Make words unrecognizable: 'ba-NA-na' is clear, 'BA-na-na' confuses listeners. Native speakers identify words by stress patterns.",
      formula: "Correct stress = clear communication | Wrong stress = confusion",
      trapAlerts: [
        "Stress doesn't slow speech - it creates rhythm and clarity",
        "Stress is for all speech, not just singing - it's fundamental",
        "Stress is NOT optional - it's essential for natural English"
      ],
      commonMistakes: [
        "Thinking stress is just for emphasis or emotion",
        "Not practicing stress patterns when learning new words"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Which word pair shows how stress changes meaning?",
    options: [
      "REcord (noun) vs reCORD (verb)",
      "BOOK and COOK (same pattern)",
      "CAR and BAR (same pattern)",
      "PEN and TEN (same pattern)"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Record' changes meaning with stress: 'REcord' (first syllable stressed) = noun (a music record, a written record). 'ReCORD' (second syllable stressed) = verb (to record a video). Many two-syllable words work this way: noun = first stress, verb = second stress.",
      formula: "Two-syllable noun/verb pairs: Noun = 1st stress, Verb = 2nd stress (REcord/reCORD, PROduce/proDUCE)",
      trapAlerts: [
        "BOOK and COOK have the same stress (one syllable each) - no stress difference",
        "CAR and BAR are one syllable - they rhyme but no stress change",
        "PEN and TEN are one syllable - same pattern, no meaning change from stress"
      ],
      commonMistakes: [
        "Not learning noun/verb stress pairs (record, produce, present, object)",
        "Using the same stress for both noun and verb forms"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Where is the stress in 'IMPORTANT'?",
    options: [
      "imPORtant (second syllable)",
      "IMportant (first syllable)",
      "imporTANT (third syllable)",
      "All syllables equal"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Important' has three syllables: im-POR-tant. The SECOND syllable 'POR' is stressed. This follows a common pattern: many adjectives ending in '-ant' stress the syllable before '-ant'.",
      formula: "im-POR-tant: second syllable stressed (adjective pattern)",
      trapAlerts: [
        "'IMportant' stresses first syllable - sounds wrong",
        "'imporTANT' stresses last syllable - unnatural pronunciation",
        "This word has clear stress on the middle syllable"
      ],
      commonMistakes: [
        "Stressing the first syllable in long adjectives",
        "Not recognizing the -ant suffix pattern"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "What happens when you stress the wrong syllable?",
    options: [
      "Native speakers may not understand the word",
      "Nothing - stress doesn't matter",
      "The word becomes louder only",
      "It's fine - people will understand anyway"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Wrong stress makes words hard to recognize. Native speakers listen for stress patterns to identify words. Example: if you say 'BA-na-na' instead of 'ba-NA-na', listeners might not recognize you're saying 'banana'. Stress is part of the word's identity in English.",
      formula: "Wrong stress = word not recognized | Correct stress = clear communication",
      trapAlerts: [
        "Stress is crucial for meaning - it's not optional",
        "Stress affects the whole word rhythm, not just volume",
        "Context helps, but wrong stress still causes confusion"
      ],
      commonMistakes: [
        "Thinking context always saves wrong pronunciation",
        "Not prioritizing stress when learning new words"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Where is the stress in 'PHOTOGRAPH'?",
    options: [
      "PHOtograph (first syllable)",
      "phoTOgraph (second syllable)",
      "photoGRAPH (third syllable)",
      "All syllables equal"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Photograph' has three syllables: PHO-to-graph. The FIRST syllable 'PHO' is stressed. Interesting: same word family has different stress: 'PHOtograph' (noun), 'phoTOgrapher' (noun), 'photoGRAPHic' (adjective).",
      formula: "PHO-to-graph: first syllable stressed",
      trapAlerts: [
        "'phoTOgraph' stresses second - wrong, sounds unnatural",
        "'photoGRAPH' stresses third - incorrect pronunciation",
        "The stress is clearly on the first syllable for this word"
      ],
      commonMistakes: [
        "Not learning how stress shifts in word families (photograph/photographer/photographic)",
        "Stressing the wrong syllable in technical words"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Which syllable is stressed in 'UNDERSTAND'?",
    options: [
      "underSTAND (third syllable)",
      "UNderstand (first syllable)",
      "unDERstand (second syllable)",
      "All syllables equal"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Understand' has three syllables: un-der-STAND. The LAST syllable 'STAND' is stressed. This follows a pattern where the base word (STAND) keeps its stress even when prefixes (un-der-) are added.",
      formula: "un-der-STAND: last syllable stressed (base word pattern)",
      trapAlerts: [
        "'UNderstand' stresses first - sounds wrong",
        "'unDERstand' stresses middle - incorrect pronunciation",
        "The base word 'STAND' retains its stress"
      ],
      commonMistakes: [
        "Stressing the prefix instead of the base word",
        "Not recognizing that base words often keep stress when prefixed"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "What is the stress pattern in most two-syllable nouns?",
    options: [
      "First syllable stressed (TAble, PENcil)",
      "Second syllable stressed (taFLE, penCIL)",
      "Both syllables equal",
      "Random - no pattern"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Most two-syllable NOUNS stress the FIRST syllable: TAble, PENcil, WINdow, DOCtor, TEAcher. This is a reliable pattern. Two-syllable VERBS often stress the SECOND: beLIEVE, forGET, beGIN.",
      formula: "2-syllable nouns: 1st stress (TAble) | 2-syllable verbs: 2nd stress (beLIEVE)",
      trapAlerts: [
        "Second syllable stress is typical for verbs, not nouns",
        "Equal stress sounds unnatural in English",
        "There IS a pattern - learning it helps pronunciation"
      ],
      commonMistakes: [
        "Not learning the noun vs verb stress pattern",
        "Applying the same stress to all two-syllable words"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Where is the stress in 'HOTEL'?",
    options: [
      "hoTEL (second syllable)",
      "HOtel (first syllable)",
      "Both syllables equal",
      "No stress needed"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Hotel' has two syllables: ho-TEL. The SECOND syllable 'TEL' is stressed. This is an exception to the two-syllable noun rule - some words borrowed from French keep second-syllable stress: hoTEL, cafÉ, balLET.",
      formula: "ho-TEL: second syllable stressed (French loan pattern)",
      trapAlerts: [
        "'HOtel' sounds unnatural - wrong stress for this word",
        "Equal stress makes it sound non-native",
        "All words need stress - essential for clarity"
      ],
      commonMistakes: [
        "Applying the first-syllable rule to ALL two-syllable nouns",
        "Not learning exceptions (hotel, police, garage)"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "What is 'sentence stress'?",
    options: [
      "Stressing important words in a sentence",
      "Making every word equally loud",
      "Only stressing the last word",
      "Speaking very fast"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Sentence stress means stressing IMPORTANT words (content words: nouns, main verbs, adjectives) and reducing unimportant words (function words: articles, prepositions). Example: 'I'm going to the STORE' - 'STORE' is stressed, other words are reduced.",
      formula: "Stress content words (noun, verb, adjective) | Reduce function words (the, to, is, a)",
      trapAlerts: [
        "Equal stress on all words sounds robotic and unnatural",
        "Stressing only the last word loses meaning from the rest",
        "Speed is separate - stress creates rhythm, not necessarily speed"
      ],
      commonMistakes: [
        "Stressing every single word equally (common for Hindi speakers)",
        "Not reducing function words (articles, prepositions)"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Where is the stress in 'DICTIONARY'?",
    options: [
      "DICtion-ary (first syllable)",
      "dicTION-ary (second syllable)",
      "diction-ARY (third syllable)",
      "All syllables equal"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Dictionary' has four syllables: DIC-tion-ar-y (or DIC-tion-ry). The FIRST syllable 'DIC' is stressed. Long words often stress one syllable clearly and reduce others.",
      formula: "DIC-tion-ar-y: first syllable stressed",
      trapAlerts: [
        "'dicTION-ary' stresses second - sounds wrong",
        "'diction-ARY' stresses last - incorrect pronunciation",
        "Even long words have one main stress"
      ],
      commonMistakes: [
        "Stressing multiple syllables in long words equally",
        "Not learning stress patterns for academic vocabulary"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Which word has stress on the FIRST syllable?",
    options: [
      "TEAcher",
      "beLIEVE",
      "forGET",
      "beGIN"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Teacher' is a two-syllable noun: TEA-cher. First syllable stressed (follows noun pattern). 'Believe', 'forget', 'begin' are two-syllable verbs with SECOND syllable stress: be-LIEVE, for-GET, be-GIN.",
      formula: "TEA-cher (noun: 1st) vs be-LIEVE (verb: 2nd)",
      trapAlerts: [
        "'beLIEVE' is a verb - second syllable stressed",
        "'forGET' is a verb - second syllable stressed",
        "'beGIN' is a verb - second syllable stressed"
      ],
      commonMistakes: [
        "Not distinguishing noun vs verb stress patterns",
        "Applying the same stress to all two-syllable words"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "What does stress do to vowel sounds?",
    options: [
      "Stressed vowels are clear, unstressed become 'uh' (schwa)",
      "All vowels sound the same",
      "Stress only changes volume, not vowel sound",
      "Unstressed vowels disappear completely"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Stress affects vowel quality. STRESSED vowels are pronounced clearly: 'ba-NA-na' - the 'NA' has a clear 'ah' sound. UNSTRESSED vowels become weak 'uh' sound (schwa /ə/): 'buh-NA-nuh'. This schwa is the most common vowel sound in English.",
      formula: "Stressed vowel = clear sound | Unstressed vowel = schwa (uh)",
      trapAlerts: [
        "Vowel sounds DO change - unstressed vowels reduce to schwa",
        "Stress changes volume AND vowel quality together",
        "Unstressed vowels reduce but don't disappear completely"
      ],
      commonMistakes: [
        "Pronouncing every vowel clearly (makes speech sound over-articulated)",
        "Not learning the schwa sound for unstressed syllables"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Where is the stress in 'FAMILY'?",
    options: [
      "FAMily (first syllable)",
      "faMIly (second syllable)",
      "famiLY (third syllable)",
      "All syllables equal"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Family' has three syllables: FAM-i-ly (or FAM-ly in fast speech). The FIRST syllable 'FAM' is stressed. The other syllables are reduced.",
      formula: "FAM-i-ly: first syllable stressed",
      trapAlerts: [
        "'faMIly' stresses middle - sounds unnatural",
        "'famiLY' stresses last - incorrect pronunciation",
        "The first syllable carries the stress"
      ],
      commonMistakes: [
        "Pronouncing all three syllables with equal stress",
        "Not reducing the unstressed syllables"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Which verb has stress on the SECOND syllable?",
    options: [
      "forGET",
      "LISten",
      "ANswer",
      "VISit"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Forget' follows the two-syllable verb pattern: for-GET (second syllable stressed). 'Listen', 'answer', 'visit' are exceptions - these verbs stress the FIRST syllable: LIS-ten, AN-swer, VIS-it.",
      formula: "Most 2-syllable verbs: 2nd stress (forGET, beLIEVE) | Some exceptions: 1st stress (LISten, VISit)",
      trapAlerts: [
        "'LISten' is an exception verb - first syllable stressed",
        "'ANswer' is an exception verb - first syllable stressed",
        "'VISit' is an exception verb - first syllable stressed"
      ],
      commonMistakes: [
        "Thinking ALL two-syllable verbs stress the second syllable",
        "Not learning common exception verbs"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Where is the stress in 'CHOCOLATE'?",
    options: [
      "CHOCo-late (first syllable)",
      "chocoLATE (third syllable)",
      "choCOlate (second syllable)",
      "All syllables equal"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "'Chocolate' has three syllables: CHOC-o-late (or CHOC-late in fast speech). The FIRST syllable 'CHOC' is stressed. Many common food words stress the first syllable.",
      formula: "CHOC-o-late: first syllable stressed",
      trapAlerts: [
        "'chocoLATE' stresses last - sounds very wrong",
        "'choCOlate' stresses middle - unnatural",
        "Clear first-syllable stress for this word"
      ],
      commonMistakes: [
        "Stressing all syllables equally in common words",
        "Not learning stress for everyday vocabulary"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "What is the best way to learn word stress?",
    options: [
      "Listen to native speakers and mark stress in vocabulary notes",
      "Guess randomly when speaking",
      "Always stress the first syllable",
      "Never worry about stress"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Best practices: (1) Listen to pronunciation in dictionaries (shows stress marks), (2) Mark stress when learning new words: comPUter, STUdent, (3) Listen to native speakers/audio, (4) Learn patterns (2-syllable noun = 1st, verb = 2nd), (5) Practice saying words with correct stress.",
      formula: "Listen + Mark + Practice + Learn patterns = Better pronunciation",
      trapAlerts: [
        "Guessing causes fossilized errors - incorrect pronunciation becomes a habit",
        "First syllable isn't always correct - many patterns exist",
        "Stress is essential - ignoring it prevents clear communication"
      ],
      commonMistakes: [
        "Not checking stress when learning new words",
        "Learning only spelling, not pronunciation"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },

  // SUBTOPIC 2: Syllable Identification - 20 questions
  {
    question: "What is a syllable?",
    options: [
      "A unit of sound with one vowel sound",
      "Every letter in a word",
      "The first sound of a word",
      "Only consonant sounds"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "A syllable is a unit of pronunciation with ONE vowel sound. It can have consonants before and after, but must have one vowel sound. Example: 'cat' (1 syllable: one vowel sound 'a'), 'water' (2 syllables: wa-ter, two vowel sounds).",
      formula: "Syllable = at least one vowel sound (can have surrounding consonants)",
      trapAlerts: [
        "Letters and syllables are different - 'water' has 5 letters but 2 syllables",
        "First sound can be consonant or vowel - syllable is about the vowel unit",
        "Syllables must include a vowel sound - consonants alone don't make syllables"
      ],
      commonMistakes: [
        "Counting letters instead of syllables",
        "Thinking each letter is a syllable"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "How many syllables are in the word 'STUDENT'?",
    options: ["2 (stu-dent)", "1 (student)", "3 (s-tu-dent)", "7 (one per letter)"],
    correctAnswer: 0,
    explanation: {
      logic: "'Student' has TWO syllables: stu-dent. Two vowel sounds: 'u' in 'stu' and 'e' in 'dent'. Count syllables by clapping: stu (clap) dent (clap) = 2 claps.",
      formula: "Count vowel sounds = count syllables (student = u + e = 2 syllables)",
      trapAlerts: [
        "One syllable would be one vowel sound - 'student' has two",
        "Three syllables would need three vowel sounds - only two here",
        "Letters (7) and syllables (2) are different - don't count letters"
      ],
      commonMistakes: [
        "Counting letters instead of vowel sounds",
        "Not separating words into sound units"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "How many syllables are in 'CHOCOLATE'?",
    options: ["3 (choc-o-late)", "2 (choc-late)", "4 (cho-co-la-te)", "9 (one per letter)"],
    correctAnswer: 0,
    explanation: {
      logic: "'Chocolate' has THREE syllables formally: choc-o-late. Three vowel sounds. In fast/casual speech, native speakers often say it as TWO syllables (choc-late), dropping the middle vowel. Both pronunciations are acceptable.",
      formula: "Formal: 3 syllables (choc-o-late) | Casual: 2 syllables (choc-late)",
      trapAlerts: [
        "Two syllables is casual/fast speech only - formal is three",
        "Four syllables would over-pronounce it - not natural",
        "Nine letters but only 2-3 syllables - letters ≠ syllables"
      ],
      commonMistakes: [
        "Not recognizing syllable reduction in casual speech",
        "Counting letters as syllables"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Which word has ONE syllable?",
    options: ["book", "water", "table", "apple"],
    correctAnswer: 0,
    explanation: {
      logic: "'Book' has one syllable (one vowel sound: 'oo'). 'Water' = 2 syllables (wa-ter), 'table' = 2 syllables (ta-ble), 'apple' = 2 syllables (ap-ple). One-syllable words have one vowel sound.",
      formula: "One vowel sound = one syllable (book = oo)",
      trapAlerts: [
        "'water' has two vowel sounds (a + e = 2 syllables)",
        "'table' has two vowel sounds (a + e = 2 syllables)",
        "'apple' has two vowel sounds (a + e = 2 syllables)"
      ],
      commonMistakes: [
        "Not recognizing that 'book' is one syllable despite 4 letters",
        "Thinking longer words must have more syllables"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "How many syllables are in 'BANANA'?",
    options: ["3 (ba-na-na)", "2 (ba-nana)", "4 (b-a-n-a-n-a)", "6 (one per letter)"],
    correctAnswer: 0,
    explanation: {
      logic: "'Banana' has THREE syllables: ba-na-na. Three vowel sounds: three 'a' sounds. Clap it out: ba (clap) na (clap) na (clap) = 3 claps.",
      formula: "Three vowel sounds = three syllables (ba-na-na)",
      trapAlerts: [
        "Two syllables would merge sounds incorrectly",
        "Four syllables over-separates it - each syllable needs a vowel sound",
        "Six letters but only three syllables - don't count letters"
      ],
      commonMistakes: [
        "Merging syllables (saying it as 2 syllables)",
        "Counting letters instead of vowel sounds"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "What helps you count syllables in a word?",
    options: [
      "Count the vowel sounds (a, e, i, o, u sounds)",
      "Count all the letters",
      "Count only consonants",
      "Count capital letters"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Count VOWEL SOUNDS (not letters). Each syllable has one vowel sound. Example: 'water' (5 letters) has 2 vowel sounds (a, e) = 2 syllables. Method: Say the word and feel your jaw drop - each drop is a syllable.",
      formula: "Number of vowel sounds = number of syllables",
      trapAlerts: [
        "Letters don't equal syllables - 'strengths' has 9 letters but 1 syllable",
        "Consonants don't create syllables by themselves",
        "Capital letters are just spelling - unrelated to syllable count"
      ],
      commonMistakes: [
        "Counting letters instead of sounds",
        "Not distinguishing between vowel letters and vowel sounds"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "How many syllables are in 'COMPUTER'?",
    options: ["3 (com-pu-ter)", "2 (com-puter)", "4 (co-m-pu-ter)", "8 (one per letter)"],
    correctAnswer: 0,
    explanation: {
      logic: "'Computer' has THREE syllables: com-pu-ter. Three vowel sounds: 'o' in com, 'u' in pu, 'e' in ter. Clear separation into three units.",
      formula: "Three vowel sounds = three syllables (com-pu-ter)",
      trapAlerts: [
        "Two syllables would merge 'pu-ter' incorrectly",
        "Four syllables over-separates the word",
        "Eight letters but only three syllables"
      ],
      commonMistakes: [
        "Merging syllables in common words",
        "Counting letters as syllables"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "Which word has TWO syllables?",
    options: ["happy", "strength", "beautiful", "information"],
    correctAnswer: 0,
    explanation: {
      logic: "'Happy' has 2 syllables: hap-py (two vowel sounds: a + y). 'Strength' = 1 syllable, 'beautiful' = 3 syllables (beau-ti-ful), 'information' = 4 syllables (in-for-ma-tion).",
      formula: "Two vowel sounds = two syllables (hap-py)",
      trapAlerts: [
        "'strength' has only one vowel sound despite many letters = 1 syllable",
        "'beautiful' has three vowel sounds = 3 syllables",
        "'information' has four vowel sounds = 4 syllables"
      ],
      commonMistakes: [
        "Thinking longer words always have more syllables",
        "Not recognizing 'y' can be a vowel sound"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "How many syllables are in 'FAMILY'?",
    options: ["3 (fam-i-ly)", "2 (fam-ly)", "4 (fa-mi-ly)", "6 (one per letter)"],
    correctAnswer: 0,
    explanation: {
      logic: "'Family' has THREE syllables formally: fam-i-ly. Three vowel sounds: a + i + y. In casual speech, it's often pronounced as 2 syllables (fam-ly), but standard is 3.",
      formula: "Standard: 3 syllables (fam-i-ly) | Casual: 2 syllables (fam-ly)",
      trapAlerts: [
        "Two syllables is casual reduction - standard is three",
        "Four syllables over-separates it",
        "Six letters but three syllables"
      ],
      commonMistakes: [
        "Only using casual pronunciation (2 syllables)",
        "Not learning the formal pronunciation"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "What is syllable division?",
    options: [
      "Breaking a word into syllable parts (wa-ter)",
      "Making words longer",
      "Spelling a word correctly",
      "Pronouncing every letter"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Syllable division means breaking words into syllable units: 'water' → wa-ter (2 parts). Helps with pronunciation, spelling, and understanding word structure. Use hyphens to show divisions: stu-dent, com-pu-ter.",
      formula: "Syllable division = word → syl-la-ble parts (wa-ter, ta-ble)",
      trapAlerts: [
        "Division shortens words conceptually, doesn't make them longer",
        "Spelling and syllables are related but different skills",
        "Not every letter is pronounced - syllables are about vowel sounds"
      ],
      commonMistakes: [
        "Not practicing syllable division when learning new words",
        "Thinking syllable division is only for writing, not speaking"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "How many syllables are in 'IMPORTANT'?",
    options: ["3 (im-por-tant)", "2 (im-portant)", "4 (i-m-por-tant)", "9 (one per letter)"],
    correctAnswer: 0,
    explanation: {
      logic: "'Important' has THREE syllables: im-por-tant. Three vowel sounds: i + o + a. Clear three-part division.",
      formula: "Three vowel sounds = three syllables (im-por-tant)",
      trapAlerts: [
        "Two syllables would merge sounds incorrectly",
        "Four syllables over-separates it",
        "Nine letters but only three syllables"
      ],
      commonMistakes: [
        "Merging syllables in longer words",
        "Counting letters instead of vowel sounds"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Why is syllable counting important?",
    options: [
      "Helps with pronunciation, stress, and spelling",
      "Only for writing poetry",
      "Not important at all",
      "Only for singing"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Syllable counting helps: (1) Pronunciation: knowing how many parts makes words clearer, (2) Stress: you need to know syllables to stress correctly, (3) Spelling: syllables guide where letters go, (4) Rhythm: helps speech flow naturally.",
      formula: "Syllables → pronunciation + stress + spelling + rhythm",
      trapAlerts: [
        "Poetry uses syllables, but it's also essential for everyday speech",
        "Syllable awareness is fundamental for language learning",
        "Singing uses syllables, but so does all speaking"
      ],
      commonMistakes: [
        "Thinking syllables are only academic, not practical",
        "Not counting syllables when learning pronunciation"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "How many syllables are in 'BEAUTIFUL'?",
    options: ["3 (beau-ti-ful)", "2 (beau-tiful)", "4 (be-au-ti-ful)", "9 (one per letter)"],
    correctAnswer: 0,
    explanation: {
      logic: "'Beautiful' has THREE syllables: beau-ti-ful. Three vowel sounds: eau (sounds like 'u') + i + u. Clear three-part division.",
      formula: "Three vowel sounds = three syllables (beau-ti-ful)",
      trapAlerts: [
        "Two syllables merges sounds incorrectly",
        "Four syllables over-separates it (eau is one sound)",
        "Nine letters but only three syllables"
      ],
      commonMistakes: [
        "Not recognizing 'eau' as one vowel sound",
        "Counting letters instead of vowel sounds"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "Which word has the MOST syllables?",
    options: ["information (4)", "computer (3)", "student (2)", "book (1)"],
    correctAnswer: 0,
    explanation: {
      logic: "'Information' has FOUR syllables: in-for-ma-tion. 'Computer' = 3 (com-pu-ter), 'student' = 2 (stu-dent), 'book' = 1 syllable.",
      formula: "in-for-ma-tion = 4 vowel sounds = 4 syllables",
      trapAlerts: [
        "'computer' has only 3 syllables, not 4",
        "'student' has only 2 syllables",
        "'book' has only 1 syllable"
      ],
      commonMistakes: [
        "Thinking 'information' has fewer syllables",
        "Not breaking long words into syllables"
      ]
    },
    difficulty: "easy",
    level: "A1"
  },
  {
    question: "How many syllables are in 'TELEPHONE'?",
    options: ["3 (tel-e-phone)", "2 (tele-phone)", "4 (te-le-pho-ne)", "9 (one per letter)"],
    correctAnswer: 0,
    explanation: {
      logic: "'Telephone' has THREE syllables: tel-e-phone. Three vowel sounds: e + e + o. Some speakers may reduce it to 2 syllables casually (tel-phone), but standard is 3.",
      formula: "Three vowel sounds = three syllables (tel-e-phone)",
      trapAlerts: [
        "Two syllables is casual reduction only",
        "Four syllables over-separates it",
        "Nine letters but three syllables"
      ],
      commonMistakes: [
        "Reducing syllables in formal speech",
        "Counting letters as syllables"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "What is a 'closed syllable'?",
    options: [
      "A syllable ending in a consonant (cat, sit, hot)",
      "A syllable that's always unstressed",
      "A syllable with no vowels",
      "The last syllable in a word"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Closed syllable ends in a consonant: 'cat' (ends in 't'), 'sit' (ends in 't'), 'hot' (ends in 't'). The vowel sound is usually short. Opposite: open syllable ends in vowel: 'go', 'me', 'no' (long vowel sound).",
      formula: "Closed syllable = vowel + consonant (cat, hot, sit) | Open syllable = vowel only (go, me)",
      trapAlerts: [
        "Stress is separate from open/closed - closed syllables can be stressed or unstressed",
        "All syllables need vowels - closed means consonant AT THE END",
        "Position in word doesn't define closed/open - ending sound does"
      ],
      commonMistakes: [
        "Confusing closed/open syllables with stressed/unstressed syllables",
        "Not understanding how syllable type affects vowel sound"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "How many syllables are in 'VEGETABLE'?",
    options: ["4 (veg-e-ta-ble)", "3 (veg-ta-ble)", "5 (v-e-g-e-ta-ble)", "9 (one per letter)"],
    correctAnswer: 0,
    explanation: {
      logic: "'Vegetable' has FOUR syllables formally: veg-e-ta-ble. Four vowel sounds. In casual speech, often reduced to 3 syllables (veg-ta-ble), but standard is 4.",
      formula: "Standard: 4 syllables (veg-e-ta-ble) | Casual: 3 syllables (veg-ta-ble)",
      trapAlerts: [
        "Three syllables is casual reduction only",
        "Five syllables over-separates it",
        "Nine letters but four syllables"
      ],
      commonMistakes: [
        "Only using casual pronunciation",
        "Not learning the full formal pronunciation"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "Which technique helps identify syllables?",
    options: [
      "Clap or tap for each vowel sound",
      "Count all letters in the word",
      "Only look at consonants",
      "Count spaces in the word"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Physical methods help: (1) Clap/tap for each vowel sound: 'wa-ter' = 2 claps, (2) Place hand under chin - jaw drops for each syllable, (3) Say word slowly and listen for vowel sounds. Active methods work better than just thinking.",
      formula: "Clap method: one clap per syllable (wa-ter = clap-clap = 2)",
      trapAlerts: [
        "Letters don't equal syllables - count sounds, not letters",
        "Consonants don't create syllables alone",
        "Single words have no spaces - spaces separate words, not syllables"
      ],
      commonMistakes: [
        "Not using physical methods to practice syllable awareness",
        "Relying only on visual spelling, not oral practice"
      ]
    },
    difficulty: "medium",
    level: "A1"
  },
  {
    question: "How many syllables are in 'REFRIGERATOR'?",
    options: ["5 (re-frig-er-a-tor)", "4 (re-frig-ra-tor)", "6 (re-fri-ge-ra-tor)", "12 (one per letter)"],
    correctAnswer: 0,
    explanation: {
      logic: "'Refrigerator' has FIVE syllables: re-frig-er-a-tor. Five vowel sounds: e + i + e + a + o. Long words can have many syllables.",
      formula: "Five vowel sounds = five syllables (re-frig-er-a-tor)",
      trapAlerts: [
        "Four syllables merges sounds incorrectly",
        "Six syllables over-separates it",
        "Twelve letters but only five syllables"
      ],
      commonMistakes: [
        "Not breaking long technical words into syllables",
        "Merging syllables in long words"
      ]
    },
    difficulty: "hard",
    level: "A1"
  },
  {
    question: "What's the difference between letters and syllables?",
    options: [
      "Letters are written symbols, syllables are sound units",
      "They are exactly the same thing",
      "Letters are sounds, syllables are writing",
      "Syllables are always longer than letters"
    ],
    correctAnswer: 0,
    explanation: {
      logic: "Letters = written symbols (26 in English alphabet). Syllables = spoken sound units (based on vowel sounds). 'Strengths' has 9 letters but 1 syllable. 'I' has 1 letter but 1 syllable. Letters and syllables don't match one-to-one.",
      formula: "Letters = writing (symbols) | Syllables = speech (sound units)",
      trapAlerts: [
        "Letters and syllables are completely different concepts",
        "Syllables are sounds (oral), letters are symbols (written)",
        "Number of letters doesn't predict number of syllables"
      ],
      commonMistakes: [
        "Counting letters as syllables",
        "Not distinguishing between written and spoken forms"
      ]
    },
    difficulty: "medium",
    level: "A1"
  }
];

async function insertQuestions() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('\n🎓 Inserting Pronunciation Basics Questions (Batch 1/2)');
    console.log('='.repeat(80));
    console.log(`\n📋 Topic: pronunciation-basics (A1 level)`);
    console.log(`   Questions in this batch: ${PRONUNCIATION_QUESTIONS_BATCH1.length}`);
    console.log(`   Subtopics covered: Word Stress (20), Syllables (20)\n`);

    let inserted = 0;
    for (const q of PRONUNCIATION_QUESTIONS_BATCH1) {
      await pool.query(
        `INSERT INTO english_questions
         (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
        [
          'foundation',
          'pronunciation-basics',
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
        console.log(`   ✓ Inserted ${inserted}/${PRONUNCIATION_QUESTIONS_BATCH1.length}...`);
      }
    }

    console.log(`\n✅ Successfully inserted ${inserted} questions!`);
    console.log(`\n📊 Progress: ${inserted}/60 questions for pronunciation-basics`);
    console.log(`   Next batch will add 20 more (Common Pronunciation Mistakes)`);

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

insertQuestions();
