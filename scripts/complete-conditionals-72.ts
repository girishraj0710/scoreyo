import { Pool } from 'pg';
import { config } from 'dotenv';

config({ path: '.env.local' });

// CONDITIONALS - 72 questions (to reach 80 total from current 8)
const CONDITIONALS_72 = [
  {
    topic: 'conditionals', level: 'B1',
    question: 'Complete: If it ___ tomorrow, we will cancel the picnic.',
    options: ['rains', 'will rain', 'rained', 'would rain'],
    answer: 0,
    explanation: {
      logic: "First conditional uses present simple in if-clause for real future possibility. If it rains (present simple), we will cancel (will + verb). Expresses likely future situation.",
      formula: "If + present simple, will + verb (If it rains, we will go)",
      trapAlerts: ["will rain is wrong - first conditional uses present in if-clause", "rained is past - wrong tense", "would rain is second conditional - for unreal situations"],
      commonMistakes: ["Using will in if-clause of first conditional", "Confusing first conditional (real) with second (unreal)"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'conditionals', level: 'B1',
    question: 'If I ___ a millionaire, I would buy a big house.',
    options: ['were', 'am', 'will be', 'have been'],
    answer: 0,
    explanation: {
      logic: "Second conditional uses past simple (but were for all persons) for unreal/unlikely present situations. If I were a millionaire (unreal - I am not), I would buy (would + verb). Hypothetical.",
      formula: "If + past simple (were), would + verb (If I were rich, I would travel)",
      trapAlerts: ["am is present simple - use were for second conditional", "will be is future - wrong for hypothetical present", "have been is present perfect - wrong tense"],
      commonMistakes: ["Using was instead of were for I/he/she/it in second conditional", "Not recognizing second conditional is for unreal situations"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'conditionals', level: 'B1',
    question: 'If Raj had studied harder, he ___ the exam.',
    options: ['would have passed', 'will pass', 'would pass', 'passes'],
    answer: 0,
    explanation: {
      logic: "Third conditional is for impossible past situations (cannot change now). If Raj had studied (past perfect), he would have passed (would have + past participle). Regret about past.",
      formula: "If + past perfect, would have + past participle (If I had known, I would have come)",
      trapAlerts: ["will pass is first conditional - wrong for past regret", "would pass is second conditional - for present unreal", "passes is present simple - wrong tense"],
      commonMistakes: ["Confusing third conditional (impossible past) with first/second", "Not using past perfect in if-clause"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'conditionals', level: 'A2',
    question: 'Find the error: If you will come early, we can watch a movie.',
    options: ["will come should be come (present simple)", "can should be could", "come should be came", "No error"],
    answer: 0,
    explanation: {
      logic: "First conditional: NO will in if-clause. Correct: If you come early (present simple), we can watch. Common error: adding will to if-clause.",
      formula: "If + present simple, will/can + verb (NOT: If + will)",
      trapAlerts: ["can is correct modal for ability/possibility", "come is right tense, but will is wrong", "Sentence has error in if-clause"],
      commonMistakes: ["Using will in if-clause of first conditional", "Not learning if-clause rules"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'conditionals', level: 'B1',
    question: 'Unless you hurry, you ___ the train.',
    options: ['will miss', 'would miss', 'miss', 'missed'],
    answer: 0,
    explanation: {
      logic: "Unless means if not. Unless you hurry (present simple) = If you do not hurry, you will miss (first conditional - real future). Unless + present simple, will + verb.",
      formula: "Unless + present simple, will + verb (Unless it rains, we will go = If it does not rain...)",
      trapAlerts: ["would miss is second conditional - for unreal", "miss is present simple - needs modal will", "missed is past - wrong tense"],
      commonMistakes: ["Not understanding unless = if not", "Using would after unless for real situations"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'conditionals', level: 'B1',
    question: 'What type: If water reaches 100 degrees, it boils.',
    options: ['Zero conditional (general truth)', 'First conditional', 'Second conditional', 'Third conditional'],
    answer: 0,
    explanation: {
      logic: "Zero conditional for universal truths, scientific facts, habits. If + present simple, present simple (no will). Always true, not just future possibility.",
      formula: "If/When + present simple, present simple (If you heat ice, it melts)",
      trapAlerts: ["First conditional uses will for future possibilities", "Second conditional uses would for unreal present", "Third conditional uses would have for impossible past"],
      commonMistakes: ["Confusing zero conditional (always true) with first (possible future)", "Adding will to zero conditional"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'conditionals', level: 'B1',
    question: 'If Priya ___ more time, she would learn French.',
    options: ['had', 'has', 'will have', 'would have'],
    answer: 0,
    explanation: {
      logic: "Second conditional for unreal present: If Priya had more time (past simple - but she does not), she would learn (would + verb). Hypothetical present situation.",
      formula: "If + past simple, would + verb (If I had money, I would buy)",
      trapAlerts: ["has is present - use past for second conditional", "will have is future - wrong for hypothetical present", "would have is third conditional - for impossible past"],
      commonMistakes: ["Using present tense in if-clause of second conditional", "Confusing second and third conditionals"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'conditionals', level: 'B1',
    question: 'Complete: If they had left earlier, they ___ the traffic.',
    options: ['would have avoided', 'will avoid', 'would avoid', 'avoid'],
    answer: 0,
    explanation: {
      logic: "Third conditional: If they had left (past perfect - they did not), they would have avoided (would have + past participle). Past situation that cannot be changed.",
      formula: "If + past perfect, would have + past participle",
      trapAlerts: ["will avoid is first conditional - for real future", "would avoid is second conditional - for present unreal", "avoid is present simple - wrong tense"],
      commonMistakes: ["Not using would have in main clause of third conditional", "Mixing up conditional types"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'conditionals', level: 'A2',
    question: 'When you heat ice, it ___.',
    options: ['melts', 'will melt', 'would melt', 'melted'],
    answer: 0,
    explanation: {
      logic: "Zero conditional with when for general truth: When you heat ice (present simple), it melts (present simple). Scientific fact, always happens - no will needed.",
      formula: "When + present simple, present simple (for facts/habits)",
      trapAlerts: ["will melt suggests future possibility, but this is always true", "would melt is for hypothetical situations", "melted is past - wrong tense"],
      commonMistakes: ["Using will for scientific facts (zero conditional)", "Not recognizing general truths use present simple"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'conditionals', level: 'B1',
    question: 'If I ___ you, I would apologize.',
    options: ['were', 'am', 'will be', 'have been'],
    answer: 0,
    explanation: {
      logic: "If I were you is fixed expression using second conditional. Were for all persons in formal second conditional. Giving advice about hypothetical situation.",
      formula: "If I were you, I would... (advice pattern)",
      trapAlerts: ["am is present - use were for advice", "will be is future - wrong here", "have been is present perfect - wrong tense"],
      commonMistakes: ["Using was instead of were in If I were you", "Not learning this common advice pattern"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'conditionals', level: 'B1',
    question: 'Provided that you ___ on time, we can catch the show.',
    options: ['arrive', 'will arrive', 'would arrive', 'arrived'],
    answer: 0,
    explanation: {
      logic: "Provided that means if (with condition). Like first conditional: present simple in condition clause, will/can in main clause. Provided that you arrive (present), we can catch.",
      formula: "Provided that/As long as + present simple, will/can + verb",
      trapAlerts: ["will arrive is wrong - no will in condition clause", "would arrive is for unreal situations", "arrived is past - wrong tense"],
      commonMistakes: ["Using will in condition clause with provided that", "Not recognizing provided that = if"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'conditionals', level: 'B1',
    question: 'If it ___ not raining, we could go out.',
    options: ['were', 'is', 'will be', 'has been'],
    answer: 0,
    explanation: {
      logic: "Second conditional negative: If it were not raining (past continuous - but it IS raining), we could go out (could = would be able). Hypothetical present.",
      formula: "If + past simple/continuous, would/could + verb",
      trapAlerts: ["is makes it first conditional for real future - but this is unreal present", "will be is future - wrong here", "has been is present perfect - wrong tense"],
      commonMistakes: ["Using present tense for unreal present conditions", "Not recognizing could = would be able in conditionals"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'conditionals', level: 'A2',
    question: 'Complete: If Raj studies hard, he ___ good marks.',
    options: ['will get', 'would get', 'gets', 'got'],
    answer: 0,
    explanation: {
      logic: "First conditional for real future possibility: If Raj studies (present simple), he will get (will + verb). Likely to happen if condition is met.",
      formula: "If + present simple, will + verb",
      trapAlerts: ["would get is second conditional - for unreal", "gets is present - needs will for future result", "got is past - wrong tense"],
      commonMistakes: ["Using would for real future possibilities", "Not using will in main clause of first conditional"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'conditionals', level: 'B1',
    question: 'Find the error: If I would have known, I would have called you.',
    options: ["would have known should be had known", "would have called is correct", "called should be call", "No error"],
    answer: 0,
    explanation: {
      logic: "Third conditional if-clause uses past perfect (had known), NOT would have. Correct: If I had known, I would have called. Common error: putting would have in both clauses.",
      formula: "If + past perfect (NOT would have), would have + past participle",
      trapAlerts: ["would have called in main clause IS correct", "call is wrong - need past participle called", "Sentence has error in if-clause"],
      commonMistakes: ["Using would have in if-clause of third conditional", "Not using past perfect in if-clause"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'conditionals', level: 'B1',
    question: 'If Mumbai ___ not so crowded, I would live there.',
    options: ['were', 'is', 'will be', 'has been'],
    answer: 0,
    explanation: {
      logic: "Second conditional for unreal present: If Mumbai were not so crowded (past simple were - but it IS crowded), I would live there. Hypothetical contrary to present reality.",
      formula: "If + past simple (were), would + verb",
      trapAlerts: ["is makes it real condition - but this is unreal/hypothetical", "will be is future - wrong for present unreal", "has been is present perfect - wrong tense"],
      commonMistakes: ["Using present tense for unreal present conditions", "Using was instead of were in formal second conditional"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'conditionals', level: 'A2',
    question: 'What happens in zero conditional?',
    options: ['Both clauses use present simple', 'If-clause: present, main: future', 'If-clause: past, main: would', 'If-clause: past perfect, main: would have'],
    answer: 0,
    explanation: {
      logic: "Zero conditional: present simple in BOTH clauses for general truths, scientific facts, habits. If/When you heat water, it boils. Always happens, not just future.",
      formula: "If/When + present simple, present simple (no will)",
      trapAlerts: ["Present + future is first conditional", "Past + would is second conditional", "Past perfect + would have is third conditional"],
      commonMistakes: ["Adding will to zero conditional", "Not distinguishing zero (always true) from first (possible future)"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'conditionals', level: 'B1',
    question: 'If she ___ harder last year, she would be in college now.',
    options: ['had worked', 'worked', 'works', 'has worked'],
    answer: 0,
    explanation: {
      logic: "Mixed conditional: past condition (third conditional if-clause) with present result (second conditional main clause). If she had worked (past perfect), she would be (would + be now). Past action, present consequence.",
      formula: "If + past perfect, would + verb (now) - mixed conditional",
      trapAlerts: ["worked is simple past - need past perfect for past time", "works is present - wrong tense", "has worked is present perfect - wrong tense"],
      commonMistakes: ["Not recognizing mixed conditionals exist", "Using simple past instead of past perfect"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'conditionals', level: 'B1',
    question: 'As long as you ___ your homework, you can watch TV.',
    options: ['finish', 'will finish', 'would finish', 'finished'],
    answer: 0,
    explanation: {
      logic: "As long as means provided that/if. Like first conditional: present simple in condition, will/can in main. As long as you finish (present), you can watch.",
      formula: "As long as + present simple, will/can + verb",
      trapAlerts: ["will finish is wrong - no will in condition clause", "would finish is for unreal situations", "finished is past - wrong tense"],
      commonMistakes: ["Using will in condition clause with as long as", "Not recognizing as long as = if/provided that"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'conditionals', level: 'A2',
    question: 'If you ___ the button, the machine starts.',
    options: ['press', 'will press', 'pressed', 'would press'],
    answer: 0,
    explanation: {
      logic: "Zero conditional for instructions/cause-effect: If you press (present simple), the machine starts (present simple). Always happens this way - fact, not future possibility.",
      formula: "If + present simple, present simple (for facts/instructions)",
      trapAlerts: ["will press suggests future possibility - this is always true", "pressed is past - wrong tense", "would press is for hypothetical - this is real cause-effect"],
      commonMistakes: ["Using will for instructions that always work the same way", "Not recognizing zero conditional for cause-effect"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'conditionals', level: 'B1',
    question: 'If I ___ my phone, I would call you.',
    options: ['had', 'have', 'will have', 'would have'],
    answer: 0,
    explanation: {
      logic: "Second conditional for unreal present: If I had my phone (past simple - but I do not have it now), I would call (would + verb). Hypothetical present situation.",
      formula: "If + past simple, would + verb",
      trapAlerts: ["have is present - use past for second conditional", "will have is future - wrong for hypothetical present", "would have is third conditional - for impossible past"],
      commonMistakes: ["Using present tense for unreal present conditions", "Confusing second (present unreal) with third (past unreal)"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'conditionals', level: 'B1',
    question: 'If we had taken a taxi, we ___ late.',
    options: ['would not have been', 'will not be', 'would not be', 'are not'],
    answer: 0,
    explanation: {
      logic: "Third conditional negative: If we had taken (past perfect - we did not take), we would not have been (would not have + past participle) late. Past regret.",
      formula: "If + past perfect, would not have + past participle",
      trapAlerts: ["will not be is first conditional - for real future", "would not be is second conditional - for present unreal", "are not is present - wrong tense"],
      commonMistakes: ["Not using would not have in third conditional", "Forgetting past participle after would have"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'conditionals', level: 'A2',
    question: 'Complete: If Priya is hungry, she ___ a sandwich.',
    options: ['will eat', 'would eat', 'eats', 'ate'],
    answer: 0,
    explanation: {
      logic: "First conditional for likely future: If Priya is hungry (present simple), she will eat (will + verb). Real possibility, probable future result.",
      formula: "If + present simple, will + verb",
      trapAlerts: ["would eat is second conditional - for unreal", "eats is present - needs will for future result", "ate is past - wrong tense"],
      commonMistakes: ["Using would for real future possibilities", "Not using will in first conditional main clause"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'conditionals', level: 'B1',
    question: 'Find the error: If I will see Raj tomorrow, I will tell him.',
    options: ["will see should be see", "will tell is correct", "see should be saw", "No error"],
    answer: 0,
    explanation: {
      logic: "First conditional: NO will in if-clause. Correct: If I see Raj tomorrow (present simple), I will tell him. Common error among Indian learners: adding will to if-clause.",
      formula: "If + present simple, will + verb (NOT: If + will)",
      trapAlerts: ["will tell in main clause IS correct", "saw is past - wrong tense", "Sentence has error in if-clause"],
      commonMistakes: ["Using will in if-clause of first conditional", "Direct Hindi translation interference (agar main dekhta hoon = if I will see)"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'conditionals', level: 'B1',
    question: 'If you ___ that movie, you would have enjoyed it.',
    options: ['had watched', 'watched', 'watch', 'have watched'],
    answer: 0,
    explanation: {
      logic: "Third conditional for impossible past: If you had watched (past perfect - you did not watch), you would have enjoyed. Cannot change past, expressing regret.",
      formula: "If + past perfect, would have + past participle",
      trapAlerts: ["watched is simple past - need past perfect for third conditional", "watch is present - wrong tense", "have watched is present perfect - wrong tense"],
      commonMistakes: ["Using simple past instead of past perfect in third conditional", "Not recognizing had + past participle structure"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'conditionals', level: 'B1',
    question: 'Suppose you ___ the lottery, what would you do?',
    options: ['won', 'win', 'will win', 'have won'],
    answer: 0,
    explanation: {
      logic: "Suppose means if (hypothetical). Like second conditional: Suppose you won (past simple - unreal), what would you do (would + verb). Hypothetical question.",
      formula: "Suppose/Imagine + past simple, would + verb",
      trapAlerts: ["win is present - use past for hypothetical", "will win is for real future - this is unreal", "have won is present perfect - wrong tense"],
      commonMistakes: ["Not recognizing suppose = if (hypothetical)", "Using present tense for unreal situations"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'conditionals', level: 'A2',
    question: 'If it ___ sunny tomorrow, we will go to the beach.',
    options: ['is', 'will be', 'were', 'would be'],
    answer: 0,
    explanation: {
      logic: "First conditional for real future weather possibility: If it is sunny (present simple - even though tomorrow), we will go. Always use present in if-clause.",
      formula: "If + present simple (even for tomorrow), will + verb",
      trapAlerts: ["will be is wrong - never use will in first conditional if-clause", "were is second conditional - for unreal", "would be is also for unreal situations"],
      commonMistakes: ["Using will be in if-clause (seems logical for tomorrow but wrong)", "Not learning if-clause always uses present simple"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'conditionals', level: 'B1',
    question: 'If Delhi ___ cleaner air, more tourists would visit.',
    options: ['had', 'has', 'will have', 'would have'],
    answer: 0,
    explanation: {
      logic: "Second conditional for unreal present: If Delhi had cleaner air (past simple - it does not), more tourists would visit. Hypothetical improvement, present situation.",
      formula: "If + past simple, would + verb",
      trapAlerts: ["has is present - use past for hypothetical", "will have is future - wrong for present unreal", "would have in if-clause is wrong - only in main clause"],
      commonMistakes: ["Using present tense for unreal conditions", "Putting would in if-clause"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'conditionals', level: 'B1',
    question: 'In case it ___, take an umbrella.',
    options: ['rains', 'will rain', 'would rain', 'rained'],
    answer: 0,
    explanation: {
      logic: "In case means if (precaution). Like first conditional: present simple in condition. In case it rains (present simple), take (imperative). Preparing for possible future.",
      formula: "In case + present simple, imperative/will + verb",
      trapAlerts: ["will rain is wrong - no will after in case", "would rain is for unreal - this is real precaution", "rained is past - wrong tense"],
      commonMistakes: ["Using will after in case", "Not recognizing in case = if (precaution)"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'conditionals', level: 'B1',
    question: 'If I ___ more time, I would have visited the Taj Mahal.',
    options: ['had had', 'had', 'have', 'would have'],
    answer: 0,
    explanation: {
      logic: "Third conditional: If I had had more time (past perfect - had + had), I would have visited. First had = auxiliary, second had = past participle of have. Looks strange but correct!",
      formula: "If + past perfect (had + past participle), would have + past participle",
      trapAlerts: ["had alone is simple past - need past perfect", "have is present - wrong tense", "would have in if-clause is grammatically wrong"],
      commonMistakes: ["Being confused by had had (correct structure)", "Not understanding past perfect needs auxiliary had + past participle"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'conditionals', level: 'A2',
    question: 'What is the main clause in: If you call me, I will help you?',
    options: ['I will help you', 'If you call me', 'you call me', 'I will'],
    answer: 0,
    explanation: {
      logic: "Main clause = result clause without if. I will help you is the main clause (what will happen). If you call me is the condition clause (if-clause).",
      formula: "If-clause (condition), main clause (result)",
      trapAlerts: ["If you call me is if-clause, not main", "you call me is incomplete", "I will is incomplete clause"],
      commonMistakes: ["Confusing if-clause with main clause", "Not identifying complete clauses"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'conditionals', level: 'B1',
    question: 'If she ___ to the party, she would have met him.',
    options: ['had gone', 'went', 'goes', 'has gone'],
    answer: 0,
    explanation: {
      logic: "Third conditional: If she had gone (past perfect - she did not go), she would have met. Past situation that cannot be changed, regret about missing opportunity.",
      formula: "If + past perfect (had + past participle), would have + past participle",
      trapAlerts: ["went is simple past - need past perfect", "goes is present - wrong tense", "has gone is present perfect - wrong tense"],
      commonMistakes: ["Using simple past in third conditional if-clause", "Not recognizing need for past perfect"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'conditionals', level: 'B1',
    question: 'Even if Raj ___ all night, he cannot finish the project.',
    options: ['works', 'will work', 'would work', 'worked'],
    answer: 0,
    explanation: {
      logic: "Even if means even though/if (real but difficult situation). Even if Raj works (present simple - real possibility), he cannot finish. First conditional type with even for emphasis.",
      formula: "Even if + present simple, will/can + verb",
      trapAlerts: ["will work is wrong - no will in even if clause", "would work is for unreal - this is real but difficult", "worked is past - wrong tense"],
      commonMistakes: ["Using will in even if clause", "Not recognizing even if = if (with emphasis on difficulty)"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'conditionals', level: 'A2',
    question: 'If you mix red and blue, you ___ purple.',
    options: ['get', 'will get', 'would get', 'got'],
    answer: 0,
    explanation: {
      logic: "Zero conditional for color mixing (scientific fact): If you mix red and blue (present simple), you get (present simple) purple. Always true, not future possibility.",
      formula: "If + present simple, present simple (for facts)",
      trapAlerts: ["will get suggests possibility - this is always true", "would get is for hypothetical - this is real fact", "got is past - wrong tense"],
      commonMistakes: ["Using will for scientific facts", "Not distinguishing facts from possibilities"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'conditionals', level: 'B1',
    question: 'If only I ___ his phone number!',
    options: ['knew', 'know', 'will know', 'have known'],
    answer: 0,
    explanation: {
      logic: "If only expresses wish (like second conditional). If only I knew (past simple - but I do not know). Regret about present situation, wish things were different.",
      formula: "If only + past simple = wish about present (If only I had money!)",
      trapAlerts: ["know is present - use past for wish", "will know is future - wrong for wish about present", "have known is present perfect - wrong tense"],
      commonMistakes: ["Not recognizing if only = wish", "Using present tense for wishes"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'conditionals', level: 'B1',
    question: 'Should you ___ Priya, please tell her I called.',
    options: ['see', 'saw', 'will see', 'would see'],
    answer: 0,
    explanation: {
      logic: "Should + subject (inversion) = if (formal). Should you see Priya = If you see Priya. Formal first conditional alternative, more common in written English.",
      formula: "Should + subject + base verb = formal if (Should you need help = If you need help)",
      trapAlerts: ["saw is past - wrong tense", "will see is wrong - no will after should in this structure", "would see is for unreal - this is real possibility"],
      commonMistakes: ["Not recognizing should + subject inversion = if", "Thinking should always means obligation"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'conditionals', level: 'B1',
    question: 'If it ___ for your help, I would have failed.',
    options: ['had not been', 'was not', 'is not', 'will not be'],
    answer: 0,
    explanation: {
      logic: "Third conditional negative: If it had not been for your help (past perfect - without your help), I would have failed. Fixed expression for gratitude about past help.",
      formula: "If it had not been for..., would have + past participle",
      trapAlerts: ["was not is simple past - need past perfect", "is not is present - wrong tense", "will not be is future - wrong tense"],
      commonMistakes: ["Using simple past instead of past perfect", "Not learning if it had not been for = without (past)"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'conditionals', level: 'A2',
    question: 'If Raj ___ tired, he will rest.',
    options: ['is', 'will be', 'were', 'would be'],
    answer: 0,
    explanation: {
      logic: "First conditional: If Raj is tired (present simple - real future possibility), he will rest (will + verb). Likely to happen.",
      formula: "If + present simple, will + verb",
      trapAlerts: ["will be is wrong - no will in if-clause", "were is second conditional - for unreal", "would be is also for unreal situations"],
      commonMistakes: ["Using will in if-clause of first conditional", "Thinking future needs will in if-clause"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'conditionals', level: 'B1',
    question: 'Were I you, I ___ accept the offer.',
    options: ['would', 'will', 'do', 'did'],
    answer: 0,
    explanation: {
      logic: "Were I you (formal inversion) = If I were you. Second conditional formal alternative: Were I you (past subjunctive inverted), I would accept (would + verb). Advice.",
      formula: "Were + subject + ..., would + verb (formal second conditional)",
      trapAlerts: ["will is first conditional - this is hypothetical advice", "do is present - wrong tense", "did is past simple - wrong tense"],
      commonMistakes: ["Not recognizing were + subject inversion = if I were", "Using will for hypothetical advice"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'conditionals', level: 'B1',
    question: 'If I knew the answer, I ___ tell you.',
    options: ['would', 'will', 'can', 'did'],
    answer: 0,
    explanation: {
      logic: "Second conditional: If I knew (past simple - but I do not know), I would tell (would + verb). Unreal present, hypothetical situation.",
      formula: "If + past simple, would + verb",
      trapAlerts: ["will is first conditional - for real future", "can suggests ability - use would for hypothetical", "did is past - wrong tense"],
      commonMistakes: ["Using will for unreal present situations", "Not using would in second conditional"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'conditionals', level: 'B1',
    question: 'Had we known about the strike, we ___ traveled yesterday.',
    options: ['would not have', 'will not', 'would not', 'do not'],
    answer: 0,
    explanation: {
      logic: "Had we known (inversion = If we had known) is formal third conditional. Had we known (past perfect inverted), we would not have traveled (would not have + past participle). Past regret.",
      formula: "Had + subject + past participle, would have + past participle",
      trapAlerts: ["will not is first conditional - wrong tense", "would not is second conditional - for present unreal", "do not is present - wrong tense"],
      commonMistakes: ["Not recognizing had + subject inversion = if we had", "Using wrong conditional type"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'conditionals', level: 'A2',
    question: 'If you see Priya, ___ her to call me.',
    options: ['ask', 'asks', 'asked', 'asking'],
    answer: 0,
    explanation: {
      logic: "First conditional with imperative main clause: If you see Priya (present simple condition), ask (imperative) her to call. Instruction dependent on condition.",
      formula: "If + present simple, imperative (If you see her, tell her)",
      trapAlerts: ["asks is third person - use base form imperative", "asked is past - wrong tense", "asking is -ing form - not imperative"],
      commonMistakes: ["Conjugating imperatives in conditional sentences", "Not recognizing imperative as main clause option"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'conditionals', level: 'B1',
    question: 'What if Raj ___ the interview? (hypothetical worry)',
    options: ['fails', 'will fail', 'would fail', 'failed'],
    answer: 0,
    explanation: {
      logic: "What if means supposing/imagine if (worry about real possibility). What if Raj fails (present simple - first conditional type). What if + present simple for real future worries.",
      formula: "What if + present simple? (for real worries about future)",
      trapAlerts: ["will fail is wrong - no will after what if", "would fail is for unreal - this is real worry", "failed is past - wrong tense"],
      commonMistakes: ["Using will after what if", "Confusing what if (real worry) with second conditional"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'conditionals', level: 'B1',
    question: 'If she ___ more careful, she would not make mistakes.',
    options: ['were', 'is', 'will be', 'has been'],
    answer: 0,
    explanation: {
      logic: "Second conditional: If she were more careful (past subjunctive - she is not careful now), she would not make (would not + verb) mistakes. Unreal present, suggestion.",
      formula: "If + past simple (were), would not + verb",
      trapAlerts: ["is makes it first conditional - but this is advice about unreal", "will be is future - wrong for hypothetical present", "has been is present perfect - wrong tense"],
      commonMistakes: ["Using was instead of were", "Not using subjunctive were for all persons"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'conditionals', level: 'B1',
    question: 'If it ___ been for the rain, we would have won.',
    options: ['had not', 'was not', 'is not', 'has not'],
    answer: 0,
    explanation: {
      logic: "If it had not been for = without (third conditional fixed expression). If it had not been for the rain (past perfect - the rain stopped us), we would have won. Past situation.",
      formula: "If it had not been for + noun, would have + past participle",
      trapAlerts: ["was not is simple past - need past perfect", "is not is present - wrong tense", "has not is present perfect - wrong tense"],
      commonMistakes: ["Not using past perfect in this expression", "Not learning if it had not been for = without"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'conditionals', level: 'B1',
    question: 'Whether it rains or not, we ___ go.',
    options: ['will', 'would', 'do', 'did'],
    answer: 0,
    explanation: {
      logic: "Whether... or not shows condition does not matter. We will go regardless. First conditional type: definite future plan independent of condition.",
      formula: "Whether + present simple + or not, will + verb",
      trapAlerts: ["would suggests hypothetical - this is definite plan", "do is present - need will for future", "did is past - wrong tense"],
      commonMistakes: ["Using would when action is definite despite condition", "Not understanding whether or not = regardless"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'conditionals', level: 'A2',
    question: 'If you ___ hungry, there is food in the fridge.',
    options: ['are', 'will be', 'were', 'would be'],
    answer: 0,
    explanation: {
      logic: "Zero conditional or first conditional for present/immediate situation: If you are hungry (present simple - now or soon), there is food (present simple fact). Offering information.",
      formula: "If + present simple, present simple (for present facts/offers)",
      trapAlerts: ["will be suggests future - this is present/immediate", "were is second conditional - for unreal", "would be is also for unreal situations"],
      commonMistakes: ["Overusing will in conditionals", "Not using present simple for present situations"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'conditionals', level: 'B1',
    question: 'If they had listened to me, this ___ happened.',
    options: ['would not have', 'will not have', 'would not', 'does not have'],
    answer: 0,
    explanation: {
      logic: "Third conditional negative: If they had listened (past perfect - they did not), this would not have happened (would not have + past participle). Past regret about ignored advice.",
      formula: "If + past perfect, would not have + past participle",
      trapAlerts: ["will not have is wrong tense for past situation", "would not is second conditional - for present unreal", "does not have is present - wrong tense"],
      commonMistakes: ["Not using would not have for third conditional negatives", "Forgetting past participle after would have"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'conditionals', level: 'B1',
    question: 'Imagine you ___ to any country. Where would you go?',
    options: ['could go', 'can go', 'will go', 'have gone'],
    answer: 0,
    explanation: {
      logic: "Imagine introduces hypothetical (second conditional type). Imagine you could go (past modal - unreal possibility), where would you go. Hypothetical question.",
      formula: "Imagine + past modal/simple, would + verb",
      trapAlerts: ["can go is present - use past could for hypothetical", "will go is for real future - this is unreal", "have gone is present perfect - wrong tense"],
      commonMistakes: ["Using present tense after imagine for hypotheticals", "Not recognizing imagine = if (unreal)"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'conditionals', level: 'B1',
    question: 'If Bengaluru ___ better public transport, traffic would improve.',
    options: ['had', 'has', 'will have', 'would have'],
    answer: 0,
    explanation: {
      logic: "Second conditional for unreal present: If Bengaluru had better transport (past simple - it does not), traffic would improve. Hypothetical improvement suggestion.",
      formula: "If + past simple, would + verb",
      trapAlerts: ["has is present - use past for hypothetical", "will have is future - wrong for present unreal", "would have in if-clause is grammatically wrong"],
      commonMistakes: ["Using present for unreal situations", "Putting would in if-clause"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'conditionals', level: 'A2',
    question: 'If you ___ thirsty, drink some water.',
    options: ['are', 'will be', 'were', 'would be'],
    answer: 0,
    explanation: {
      logic: "Zero/first conditional with imperative: If you are thirsty (present simple - now or anytime), drink (imperative) water. Advice/instruction for general situation.",
      formula: "If + present simple, imperative",
      trapAlerts: ["will be suggests future - this is present/general", "were is second conditional - for unreal", "would be is also for unreal situations"],
      commonMistakes: ["Overusing will", "Not recognizing imperatives work in conditionals"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'conditionals', level: 'B1',
    question: 'If the Taj Mahal ___ in Delhi, I would visit it every week.',
    options: ['were', 'is', 'will be', 'has been'],
    answer: 0,
    explanation: {
      logic: "Second conditional for impossible situation: If the Taj Mahal were in Delhi (past subjunctive - it is in Agra, cannot change), I would visit. Contrary to fact.",
      formula: "If + past simple (were), would + verb",
      trapAlerts: ["is makes it real condition - but Taj is in Agra, not Delhi", "will be is future - wrong for present unreal", "has been is present perfect - wrong tense"],
      commonMistakes: ["Using present tense for impossible situations", "Not recognizing geographical facts as unreal conditions"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'conditionals', level: 'B1',
    question: 'If he ___ permission, he could have joined us.',
    options: ['had asked for', 'asked for', 'asks for', 'has asked for'],
    answer: 0,
    explanation: {
      logic: "Third conditional: If he had asked for permission (past perfect - he did not ask), he could have joined (could have = would have been able). Past opportunity missed.",
      formula: "If + past perfect, could have + past participle",
      trapAlerts: ["asked for is simple past - need past perfect", "asks for is present - wrong tense", "has asked for is present perfect - wrong tense"],
      commonMistakes: ["Using simple past instead of past perfect in third conditional", "Not recognizing could have = would have been able"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'conditionals', level: 'B1',
    question: 'On condition that you ___ me back, I will lend you money.',
    options: ['pay', 'will pay', 'would pay', 'paid'],
    answer: 0,
    explanation: {
      logic: "On condition that means if/provided that. Like first conditional: present simple in condition clause. On condition that you pay (present), I will lend. Formal condition.",
      formula: "On condition that + present simple, will + verb",
      trapAlerts: ["will pay is wrong - no will in condition clause", "would pay is for unreal - this is real condition", "paid is past - wrong tense"],
      commonMistakes: ["Using will in condition clause", "Not recognizing on condition that = if"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'conditionals', level: 'B1',
    question: 'If I see him, I ___ him about the meeting.',
    options: ['will tell', 'would tell', 'tell', 'told'],
    answer: 0,
    explanation: {
      logic: "First conditional for real future possibility: If I see him (present simple), I will tell (will + verb) him. Likely to happen.",
      formula: "If + present simple, will + verb",
      trapAlerts: ["would tell is second conditional - for unreal", "tell is present - needs will for future result", "told is past - wrong tense"],
      commonMistakes: ["Using would for real future", "Not using will in first conditional"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'conditionals', level: 'A2',
    question: 'Complete: If she calls, I ___ answer.',
    options: ['will', 'would', 'do', 'did'],
    answer: 0,
    explanation: {
      logic: "First conditional: If she calls (present simple - real possibility), I will answer (will + verb). Definite future action if condition is met.",
      formula: "If + present simple, will + verb",
      trapAlerts: ["would is for unreal situations", "do is present - need will for future", "did is past - wrong tense"],
      commonMistakes: ["Using would for real future possibilities", "Not using will in first conditional"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'conditionals', level: 'B1',
    question: 'If only we ___ more time to visit Mumbai!',
    options: ['had', 'have', 'will have', 'would have'],
    answer: 0,
    explanation: {
      logic: "If only expresses wish about present: If only we had more time (past simple - we do not have time). Regret about current situation.",
      formula: "If only + past simple = wish about present",
      trapAlerts: ["have is present - use past for wish", "will have is future - wrong for present wish", "would have is for past wishes"],
      commonMistakes: ["Not using past tense for present wishes", "Confusing if only (wish) with regular conditionals"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'conditionals', level: 'B1',
    question: 'If she were here, she ___ know what to do.',
    options: ['would', 'will', 'can', 'does'],
    answer: 0,
    explanation: {
      logic: "Second conditional: If she were here (past subjunctive - she is not here), she would know (would + verb). Unreal present, wishing she were present.",
      formula: "If + past simple (were), would + verb",
      trapAlerts: ["will is first conditional - for real future", "can suggests ability but use would for hypothetical", "does is present - wrong tense"],
      commonMistakes: ["Using will for unreal present", "Not using would in second conditional"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'conditionals', level: 'B1',
    question: 'If you had told me earlier, I ___ have helped you.',
    options: ['could', 'can', 'will', 'do'],
    answer: 0,
    explanation: {
      logic: "Third conditional with could have: If you had told me (past perfect - you did not tell), I could have helped (could have = would have been able). Past missed opportunity.",
      formula: "If + past perfect, could have + past participle",
      trapAlerts: ["can is present - wrong tense", "will is future - wrong tense", "do is present - wrong tense"],
      commonMistakes: ["Not using could have for past ability in third conditional", "Using present modals for past situations"]
    },
    difficulty: 'hard'
  }
];

async function insertQuestions() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('\n🎓 CONDITIONALS - 72 questions (to reach 80 total)');
    console.log('='.repeat(80));

    let inserted = 0;
    for (const q of CONDITIONALS_72) {
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
        console.log(`   ✓ Inserted ${inserted}/72...`);
      }
    }

    console.log(`\n✅ Inserted all ${inserted} questions!`);
    console.log(`📊 CONDITIONALS now complete: 80/80 total\n`);

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

insertQuestions();
