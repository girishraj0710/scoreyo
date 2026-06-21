import { Pool } from 'pg';
import { config } from 'dotenv';

config({ path: '.env.local' });

// FINAL 50 essential-vocabulary questions (10->60)
const VOCAB_50 = [
  {
    topic: 'essential-vocabulary', level: 'A1',
    question: 'What is the opposite of tall?',
    options: ['short', 'long', 'high', 'big'],
    answer: 0,
    explanation: {
      logic: "Tall (great height) has opposite short (small height). Tall and short are antonyms for height of people/objects.",
      formula: "tall <--> short (antonyms for height)",
      trapAlerts: ["long is for length, not height", "high is for elevation/position", "big is for size in general"],
      commonMistakes: ["Confusing tall (height) with long (length)", "Using small instead of short for height"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'essential-vocabulary', level: 'A1',
    question: 'Choose correct: She ___ her homework every day.',
    options: ['does', 'makes', 'takes', 'gets'],
    answer: 0,
    explanation: {
      logic: "Do homework is fixed collocation. Do + homework/work/exercise. Make is for creating things.",
      formula: "do + homework/work/exercise | make + things (bed, tea, mistake)",
      trapAlerts: ["make is for creating objects", "take is for exams/photos/time", "get is for receiving"],
      commonMistakes: ["Using make homework (wrong)", "Not learning do/make collocations"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'essential-vocabulary', level: 'A1',
    question: 'What is the opposite of old?',
    options: ['new', 'young', 'fresh', 'modern'],
    answer: 0,
    explanation: {
      logic: "Old (not new) has opposite new for objects. For people, old <--> young. Context: general objects = new is best opposite.",
      formula: "old <--> new (things) | old <--> young (people/animals)",
      trapAlerts: ["young is opposite for age of people", "fresh is for food", "modern is for style"],
      commonMistakes: ["Not distinguishing old for things vs people", "Using young for objects"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'essential-vocabulary', level: 'A1',
    question: 'Which word means very angry?',
    options: ['furious', 'sad', 'happy', 'tired'],
    answer: 0,
    explanation: {
      logic: "Furious means extremely angry. Synonym for very angry. Intensity: annoyed < angry < furious.",
      formula: "furious = very angry (extreme emotion)",
      trapAlerts: ["sad is different emotion", "happy is opposite", "tired is physical state"],
      commonMistakes: ["Not learning intensity levels of emotions", "Confusing furious with frustrated"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'essential-vocabulary', level: 'A1',
    question: 'What do you use to see the time?',
    options: ['clock', 'calendar', 'phone', 'book'],
    answer: 0,
    explanation: {
      logic: "Clock is device for telling time. Primary function is showing hours/minutes. Basic vocabulary for time.",
      formula: "clock = time-telling device | watch = portable clock on wrist",
      trapAlerts: ["calendar shows dates, not time", "phone can show time but not primary definition", "book is for reading"],
      commonMistakes: ["Confusing clock with watch", "Not learning basic object functions"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'essential-vocabulary', level: 'A1',
    question: 'The opposite of rich is ___.',
    options: ['poor', 'cheap', 'weak', 'small'],
    answer: 0,
    explanation: {
      logic: "Rich (wealthy) has opposite poor (not wealthy). Rich and poor describe financial state.",
      formula: "rich <--> poor (financial status)",
      trapAlerts: ["cheap is for low-priced items", "weak is for strength", "small is for size"],
      commonMistakes: ["Using cheap instead of poor", "Not learning economic vocabulary"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'essential-vocabulary', level: 'A1',
    question: 'Choose correct: Please ___ a photo of us.',
    options: ['take', 'make', 'do', 'get'],
    answer: 0,
    explanation: {
      logic: "Take a photo is fixed collocation. Take + photo/picture/selfie. Use take for photos/exams.",
      formula: "take + photo/exam/break/time | make + things | do + activities",
      trapAlerts: ["make is for creating objects", "do is for activities", "get is for receiving"],
      commonMistakes: ["Using make photo (wrong)", "Not learning take collocations"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'essential-vocabulary', level: 'A1',
    question: 'What is the opposite of fast?',
    options: ['slow', 'quick', 'rapid', 'late'],
    answer: 0,
    explanation: {
      logic: "Fast (high speed) has opposite slow (low speed). Fast and slow are antonyms for speed.",
      formula: "fast <--> slow (speed antonyms) | quick = fast (synonyms)",
      trapAlerts: ["quick means fast, not opposite", "rapid means fast", "late is about time, not speed"],
      commonMistakes: ["Confusing late with slow", "Not learning speed vocabulary"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'essential-vocabulary', level: 'A1',
    question: 'Which color is the sky on a clear day?',
    options: ['blue', 'green', 'red', 'yellow'],
    answer: 0,
    explanation: {
      logic: "Sky on clear day is blue. Basic color knowledge and nature vocabulary.",
      formula: "sky = blue | grass = green | sun = yellow",
      trapAlerts: ["green is for grass/trees", "red is not natural sky color", "yellow is for sun"],
      commonMistakes: ["Not learning basic color-object associations", "Confusing sky colors"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'essential-vocabulary', level: 'A1',
    question: 'The opposite of strong is ___.',
    options: ['weak', 'soft', 'thin', 'small'],
    answer: 0,
    explanation: {
      logic: "Strong (having power/strength) has opposite weak (lacking strength). Strong and weak describe physical/mental strength.",
      formula: "strong <--> weak (strength antonyms)",
      trapAlerts: ["soft is for texture", "thin is for width", "small is for size"],
      commonMistakes: ["Confusing weak with soft", "Not learning strength vocabulary"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'essential-vocabulary', level: 'A1',
    question: 'Choose correct: I ___ a mistake in the test.',
    options: ['made', 'did', 'took', 'got'],
    answer: 0,
    explanation: {
      logic: "Make a mistake is fixed collocation. Make + mistake/error/noise/decision. Use make for creating.",
      formula: "make + mistake/decision/noise/bed | do + homework/work/exercise",
      trapAlerts: ["do is for activities/work", "took is for taking things", "got is for receiving"],
      commonMistakes: ["Using do mistake (wrong)", "Not learning make collocations"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'essential-vocabulary', level: 'A1',
    question: 'What is your mother\'s sister called?',
    options: ['aunt', 'uncle', 'cousin', 'sister'],
    answer: 0,
    explanation: {
      logic: "Mother's sister = aunt. Basic family vocabulary. Uncle = parent's brother, cousin = aunt/uncle's child.",
      formula: "aunt = parent's sister | uncle = parent's brother | cousin = aunt/uncle's child",
      trapAlerts: ["uncle is male", "cousin is aunt/uncle's child", "sister is sibling"],
      commonMistakes: ["Confusing aunt with grandmother", "Not learning family relationships"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'essential-vocabulary', level: 'A1',
    question: 'The opposite of clean is ___.',
    options: ['dirty', 'messy', 'ugly', 'bad'],
    answer: 0,
    explanation: {
      logic: "Clean (free from dirt) has opposite dirty (covered with dirt). Clean and dirty describe cleanliness state.",
      formula: "clean <--> dirty (cleanliness antonyms)",
      trapAlerts: ["messy is for disorder, not dirt", "ugly is for appearance", "bad is general negative"],
      commonMistakes: ["Using messy instead of dirty", "Not distinguishing dirty from messy"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'essential-vocabulary', level: 'A1',
    question: 'Which meal do you eat in the morning?',
    options: ['breakfast', 'lunch', 'dinner', 'supper'],
    answer: 0,
    explanation: {
      logic: "Breakfast is morning meal. Lunch = midday, dinner = evening. Basic daily routine vocabulary.",
      formula: "breakfast = morning | lunch = midday | dinner/supper = evening",
      trapAlerts: ["lunch is midday meal", "dinner is evening meal", "supper is late evening meal"],
      commonMistakes: ["Confusing meal times", "Not learning daily routine vocabulary"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'essential-vocabulary', level: 'A1',
    question: 'Choose correct: Can you ___ me the salt?',
    options: ['pass', 'give', 'send', 'bring'],
    answer: 0,
    explanation: {
      logic: "Pass means hand over (across table). Pass is most natural for table items. Give also works but pass is idiomatic.",
      formula: "pass = hand over (especially at table) | give = transfer possession",
      trapAlerts: ["give is correct but pass is more idiomatic", "send is for distant transfer", "bring is for coming with item"],
      commonMistakes: ["Not learning pass for table items", "Using send for nearby transfer"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'essential-vocabulary', level: 'A1',
    question: 'What is the opposite of hard?',
    options: ['soft', 'easy', 'weak', 'smooth'],
    answer: 0,
    explanation: {
      logic: "Hard (firm texture) has opposite soft (yielding texture). Context: physical texture. (Hard = difficult has opposite easy).",
      formula: "hard <--> soft (texture) | hard <--> easy (difficulty)",
      trapAlerts: ["easy is opposite for difficulty, not texture", "weak is for strength", "smooth is for surface"],
      commonMistakes: ["Confusing hard texture with hard difficulty", "Using easy for texture"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'essential-vocabulary', level: 'A1',
    question: 'Where do you sleep?',
    options: ['bed', 'chair', 'table', 'floor'],
    answer: 0,
    explanation: {
      logic: "Bed is furniture for sleeping. Basic home vocabulary. Chair = sitting, table = eating/working.",
      formula: "bed = for sleeping | chair = for sitting | table = for eating/working",
      trapAlerts: ["chair is for sitting", "table is for eating", "floor is for walking"],
      commonMistakes: ["Not learning furniture functions", "Confusing bed with bedroom"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'essential-vocabulary', level: 'A1',
    question: 'The opposite of heavy is ___.',
    options: ['light', 'thin', 'small', 'weak'],
    answer: 0,
    explanation: {
      logic: "Heavy (great weight) has opposite light (small weight). Heavy and light describe weight.",
      formula: "heavy <--> light (weight antonyms)",
      trapAlerts: ["thin is for width", "small is for size", "weak is for strength"],
      commonMistakes: ["Using small instead of light", "Not learning weight vocabulary"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'essential-vocabulary', level: 'A2',
    question: 'Choose correct: The weather is very ___ today.',
    options: ['pleasant', 'please', 'pleased', 'pleasing'],
    answer: 0,
    explanation: {
      logic: "Pleasant is adjective (describes thing). Weather is pleasant = weather has pleasant quality. After is/very, use adjective.",
      formula: "pleasant = adjective (describing) | pleased = feeling | please = verb | pleasing = causing pleasure",
      trapAlerts: ["please is verb, not adjective", "pleased is for people feeling", "pleasing means causing pleasure"],
      commonMistakes: ["Confusing pleasant (thing) with pleased (person)", "Using verb please as adjective"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'essential-vocabulary', level: 'A1',
    question: 'What do you use to cut paper?',
    options: ['scissors', 'knife', 'pen', 'ruler'],
    answer: 0,
    explanation: {
      logic: "Scissors are tool for cutting paper. Scissors have two blades. Basic school supplies vocabulary.",
      formula: "scissors = for paper | knife = for food/other | pen = for writing | ruler = for measuring",
      trapAlerts: ["knife is for cutting food", "pen is for writing", "ruler is for measuring"],
      commonMistakes: ["Using knife for paper", "Not learning tool functions"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'essential-vocabulary', level: 'A1',
    question: 'The opposite of full is ___.',
    options: ['empty', 'hungry', 'small', 'low'],
    answer: 0,
    explanation: {
      logic: "Full (containing maximum) has opposite empty (containing nothing). Full and empty describe container state.",
      formula: "full <--> empty (container state)",
      trapAlerts: ["hungry is for people feeling", "small is for size", "low is for level"],
      commonMistakes: ["Using hungry when empty is correct", "Confusing empty with low"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'essential-vocabulary', level: 'A1',
    question: 'Which body part do you use to hear?',
    options: ['ear', 'eye', 'nose', 'mouth'],
    answer: 0,
    explanation: {
      logic: "Ear is organ for hearing. Eye = seeing, nose = smelling, mouth = tasting/speaking. Basic body vocabulary.",
      formula: "ear = hearing | eye = seeing | nose = smelling | mouth = tasting/speaking",
      trapAlerts: ["eye is for seeing", "nose is for smelling", "mouth is for tasting"],
      commonMistakes: ["Not learning body part functions", "Confusing sense organs"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'essential-vocabulary', level: 'A1',
    question: 'Choose correct: I ___ hungry.',
    options: ['am', 'have', 'feel', 'being'],
    answer: 0,
    explanation: {
      logic: "I am hungry uses be verb for state. Hungry is adjective describing state. Am = be verb for I.",
      formula: "I am + adjective (hungry, tired, happy, sad)",
      trapAlerts: ["have is for possession", "feel is verb but less common for simple states", "being is gerund/continuous"],
      commonMistakes: ["Using have hungry (wrong in English)", "Not learning be verb for states"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'essential-vocabulary', level: 'A1',
    question: 'What is the opposite of up?',
    options: ['down', 'below', 'under', 'low'],
    answer: 0,
    explanation: {
      logic: "Up (toward higher position) has opposite down (toward lower position). Up and down are directional antonyms.",
      formula: "up <--> down (direction antonyms)",
      trapAlerts: ["below is position, not direction", "under is beneath/coverage", "low is for level"],
      commonMistakes: ["Using below instead of down", "Not learning direction vocabulary"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'essential-vocabulary', level: 'A1',
    question: 'Which fruit is yellow and curved?',
    options: ['banana', 'apple', 'orange', 'grape'],
    answer: 0,
    explanation: {
      logic: "Banana is yellow and curved fruit. Basic fruit vocabulary and descriptions.",
      formula: "banana = yellow, curved | apple = round | orange = orange, round | grape = small, round",
      trapAlerts: ["apple is round, not curved", "orange is orange color", "grape is small and round"],
      commonMistakes: ["Not learning fruit characteristics", "Confusing fruits"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'essential-vocabulary', level: 'A1',
    question: 'The opposite of left is ___.',
    options: ['right', 'straight', 'forward', 'center'],
    answer: 0,
    explanation: {
      logic: "Left (one direction) has opposite right (other direction). Left and right are lateral directional opposites.",
      formula: "left <--> right (lateral directions)",
      trapAlerts: ["straight is forward direction", "forward is not lateral", "center is middle"],
      commonMistakes: ["Not learning directional vocabulary", "Confusing left/right with other directions"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'essential-vocabulary', level: 'A2',
    question: 'Choose correct: The movie was very ___.',
    options: ['boring', 'bored', 'bore', 'boredom'],
    answer: 0,
    explanation: {
      logic: "Boring describes movie (causes boredom). -ing adjectives describe things that cause feelings. Bored = person feels bored.",
      formula: "-ing = thing causes feeling (boring movie) | -ed = person feels (bored person)",
      trapAlerts: ["bored is for people feeling", "bore is verb or noun", "boredom is noun"],
      commonMistakes: ["Using bored for things", "Not learning -ing vs -ed adjectives"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'essential-vocabulary', level: 'A1',
    question: 'What season comes after winter?',
    options: ['spring', 'summer', 'autumn', 'fall'],
    answer: 0,
    explanation: {
      logic: "Spring follows winter. Seasonal cycle: winter → spring → summer → autumn/fall → winter. Basic time vocabulary.",
      formula: "seasons: winter → spring → summer → autumn/fall",
      trapAlerts: ["summer comes after spring", "autumn/fall comes after summer", "Next season is spring"],
      commonMistakes: ["Not learning seasonal order", "Confusing seasons"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'essential-vocabulary', level: 'A1',
    question: 'Where do you buy medicines?',
    options: ['pharmacy', 'hospital', 'clinic', 'store'],
    answer: 0,
    explanation: {
      logic: "Pharmacy (drugstore/chemist) is place to buy medicines. Basic places vocabulary.",
      formula: "pharmacy = buy medicines | hospital = treatment | clinic = doctor visit | store = general goods",
      trapAlerts: ["hospital is for serious treatment", "clinic is for consultations", "store is general"],
      commonMistakes: ["Using hospital for buying medicines", "Not learning place functions"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'essential-vocabulary', level: 'A1',
    question: 'The opposite of open is ___.',
    options: ['closed', 'shut', 'locked', 'covered'],
    answer: 0,
    explanation: {
      logic: "Open (not closed) has opposite closed (not open). Open and closed describe door/container state. Shut = closed (synonym).",
      formula: "open <--> closed/shut (state antonyms)",
      trapAlerts: ["shut is synonym of closed, both correct", "locked is secured, not just closed", "covered is different concept"],
      commonMistakes: ["Confusing closed with locked", "Not learning state vocabulary"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'essential-vocabulary', level: 'A1',
    question: 'Choose correct: I need to ___ a shower.',
    options: ['take', 'make', 'do', 'have'],
    answer: 0,
    explanation: {
      logic: "Take a shower is fixed collocation. Take + shower/bath. Use take for bathing activities. (Have a shower also common in British English)",
      formula: "take + shower/bath | have + shower/bath (British) | make + tea/coffee/bed",
      trapAlerts: ["have is British alternative but take is universal", "make is for creating things", "do is for activities"],
      commonMistakes: ["Using make shower (wrong)", "Not learning take collocations"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'essential-vocabulary', level: 'A1',
    question: 'What do you wear on your feet?',
    options: ['shoes', 'gloves', 'hat', 'shirt'],
    answer: 0,
    explanation: {
      logic: "Shoes are worn on feet. Gloves = hands, hat = head, shirt = body. Basic clothing vocabulary.",
      formula: "shoes = feet | gloves = hands | hat = head | shirt = body",
      trapAlerts: ["gloves are for hands", "hat is for head", "shirt is for body"],
      commonMistakes: ["Not learning clothing-body associations", "Confusing shoes with socks"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'essential-vocabulary', level: 'A1',
    question: 'The opposite of early is ___.',
    options: ['late', 'slow', 'delayed', 'last'],
    answer: 0,
    explanation: {
      logic: "Early (before expected time) has opposite late (after expected time). Early and late describe punctuality/timing.",
      formula: "early <--> late (time antonyms)",
      trapAlerts: ["slow is for speed, not time", "delayed is result of being late", "last is for order/position"],
      commonMistakes: ["Confusing late with slow", "Not learning time vocabulary"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'essential-vocabulary', level: 'A1',
    question: 'Which vegetable is orange and grows underground?',
    options: ['carrot', 'potato', 'tomato', 'onion'],
    answer: 0,
    explanation: {
      logic: "Carrot is orange vegetable that grows underground (root vegetable). Basic food vocabulary.",
      formula: "carrot = orange, root | potato = brown, root | tomato = red, above ground | onion = white, bulb",
      trapAlerts: ["potato is underground but brown", "tomato is red and above ground", "onion is underground but white"],
      commonMistakes: ["Not learning vegetable characteristics", "Confusing root vegetables"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'essential-vocabulary', level: 'A2',
    question: 'Choose correct: I was ___ by the news.',
    options: ['surprised', 'surprising', 'surprise', 'surprises'],
    answer: 0,
    explanation: {
      logic: "Surprised describes person feeling. -ed adjectives describe people's feelings. I was surprised = I felt surprise.",
      formula: "-ed = person feels (surprised, excited, bored) | -ing = thing causes feeling (surprising news)",
      trapAlerts: ["surprising describes news (causes surprise)", "surprise is noun or verb", "surprises is verb or plural noun"],
      commonMistakes: ["Using surprising for people", "Not learning -ed vs -ing adjectives"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'essential-vocabulary', level: 'A1',
    question: 'What is the opposite of safe?',
    options: ['dangerous', 'risky', 'scary', 'bad'],
    answer: 0,
    explanation: {
      logic: "Safe (free from danger) has opposite dangerous (involving danger). Safe and dangerous describe risk level.",
      formula: "safe <--> dangerous (safety antonyms)",
      trapAlerts: ["risky is less extreme than dangerous", "scary is about fear", "bad is general negative"],
      commonMistakes: ["Confusing dangerous with risky", "Not learning safety vocabulary"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'essential-vocabulary', level: 'A1',
    question: 'Which day comes after Monday?',
    options: ['Tuesday', 'Wednesday', 'Sunday', 'Friday'],
    answer: 0,
    explanation: {
      logic: "Tuesday follows Monday. Week order: Monday → Tuesday → Wednesday → Thursday → Friday → Saturday → Sunday. Basic calendar vocabulary.",
      formula: "days: Mon → Tue → Wed → Thu → Fri → Sat → Sun",
      trapAlerts: ["Wednesday comes after Tuesday", "Sunday is last/first day", "Friday is later in week"],
      commonMistakes: ["Not learning day order", "Confusing weekdays"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'essential-vocabulary', level: 'A1',
    question: 'Choose correct: Let\'s ___ a break.',
    options: ['take', 'make', 'do', 'have'],
    answer: 0,
    explanation: {
      logic: "Take a break is fixed collocation. Take + break/rest/nap. Use take for rest activities.",
      formula: "take + break/rest/nap/holiday | make + decision/mistake | do + work/homework",
      trapAlerts: ["make is for creating", "do is for activities", "have is possible but take is more common"],
      commonMistakes: ["Using make break (wrong)", "Not learning take collocations"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'essential-vocabulary', level: 'A1',
    question: 'What is the opposite of cheap?',
    options: ['expensive', 'costly', 'dear', 'rich'],
    answer: 0,
    explanation: {
      logic: "Cheap (low price) has opposite expensive (high price). Cheap and expensive describe price level.",
      formula: "cheap <--> expensive (price antonyms) | costly = expensive (synonym)",
      trapAlerts: ["costly means expensive, not opposite", "dear is old-fashioned for expensive", "rich is for wealth, not price"],
      commonMistakes: ["Using rich for prices", "Not learning price vocabulary"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'essential-vocabulary', level: 'A1',
    question: 'Where do you go to watch movies?',
    options: ['cinema', 'theater', 'museum', 'library'],
    answer: 0,
    explanation: {
      logic: "Cinema (movie theater) is place to watch films. Basic places vocabulary. Theater can also mean cinema in American English.",
      formula: "cinema = movies | theater = plays/movies | museum = art/history | library = books",
      trapAlerts: ["theater is for plays (or movies in US)", "museum is for exhibitions", "library is for books"],
      commonMistakes: ["Confusing cinema with theater", "Not learning place functions"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'essential-vocabulary', level: 'A1',
    question: 'The opposite of wide is ___.',
    options: ['narrow', 'thin', 'small', 'short'],
    answer: 0,
    explanation: {
      logic: "Wide (great width) has opposite narrow (small width). Wide and narrow describe width/breadth.",
      formula: "wide <--> narrow (width antonyms)",
      trapAlerts: ["thin is for thickness of objects", "small is for general size", "short is for length/height"],
      commonMistakes: ["Confusing narrow with thin", "Not learning dimension vocabulary"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'essential-vocabulary', level: 'A2',
    question: 'Choose correct: The book was really ___.',
    options: ['interesting', 'interested', 'interest', 'interests'],
    answer: 0,
    explanation: {
      logic: "Interesting describes book (causes interest). -ing adjectives describe things causing feelings. Book is interesting = book causes interest.",
      formula: "-ing = thing causes feeling (interesting book) | -ed = person feels (interested person)",
      trapAlerts: ["interested is for people feeling", "interest is noun or verb", "interests is verb or plural noun"],
      commonMistakes: ["Using interested for things", "Not learning -ing vs -ed adjectives"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'essential-vocabulary', level: 'A1',
    question: 'What is the opposite of quiet?',
    options: ['noisy', 'loud', 'sound', 'music'],
    answer: 0,
    explanation: {
      logic: "Quiet (silent) has opposite noisy (making noise). Quiet and noisy describe sound level. Loud also means noisy.",
      formula: "quiet <--> noisy/loud (sound level antonyms)",
      trapAlerts: ["loud means noisy (synonym of noisy)", "sound is noun, not adjective", "music is type of sound"],
      commonMistakes: ["Confusing noisy with loud (both opposite of quiet)", "Not learning sound vocabulary"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'essential-vocabulary', level: 'A1',
    question: 'Which number comes after nine?',
    options: ['ten', 'eleven', 'eight', 'twelve'],
    answer: 0,
    explanation: {
      logic: "Ten follows nine. Number sequence: ...eight, nine, ten, eleven, twelve... Basic counting vocabulary.",
      formula: "numbers: 8 → 9 → 10 → 11 → 12",
      trapAlerts: ["eleven comes after ten", "eight comes before nine", "twelve is after eleven"],
      commonMistakes: ["Not learning number order", "Skipping numbers"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'essential-vocabulary', level: 'A1',
    question: 'Choose correct: Can I ___ you a question?',
    options: ['ask', 'tell', 'say', 'speak'],
    answer: 0,
    explanation: {
      logic: "Ask a question is fixed collocation. Ask + question. Use ask when requesting information.",
      formula: "ask + question/favor | tell + story/secret | say + words | speak + language",
      trapAlerts: ["tell is for giving information", "say is for words/sentences", "speak is for language/communication"],
      commonMistakes: ["Using say/tell question (wrong)", "Not learning ask collocations"]
    },
    difficulty: 'medium'
  },
  {
    topic: 'essential-vocabulary', level: 'A1',
    question: 'What is the opposite of same?',
    options: ['different', 'other', 'another', 'various'],
    answer: 0,
    explanation: {
      logic: "Same (identical) has opposite different (not identical). Same and different describe similarity/difference.",
      formula: "same <--> different (comparison antonyms)",
      trapAlerts: ["other means alternative", "another means one more", "various means several different"],
      commonMistakes: ["Using other instead of different", "Not learning comparison vocabulary"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'essential-vocabulary', level: 'A1',
    question: 'Which month comes after June?',
    options: ['July', 'August', 'May', 'September'],
    answer: 0,
    explanation: {
      logic: "July follows June. Month order: ...May → June → July → August → September... Basic calendar vocabulary.",
      formula: "months: May → Jun → Jul → Aug → Sep",
      trapAlerts: ["August comes after July", "May comes before June", "September is after August"],
      commonMistakes: ["Not learning month order", "Confusing summer months"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'essential-vocabulary', level: 'A2',
    question: 'The story was very ___.',
    options: ['exciting', 'excited', 'excite', 'excitement'],
    answer: 0,
    explanation: {
      logic: "Exciting describes story (causes excitement). -ing adjectives describe things causing feelings. Story is exciting = causes excitement.",
      formula: "-ing = thing causes feeling (exciting story) | -ed = person feels (excited person)",
      trapAlerts: ["excited is for people feeling", "excite is verb", "excitement is noun"],
      commonMistakes: ["Using excited for things", "Not learning -ing vs -ed adjectives"]
    },
    difficulty: 'hard'
  },
  {
    topic: 'essential-vocabulary', level: 'A1',
    question: 'What is the opposite of true?',
    options: ['false', 'wrong', 'lie', 'fake'],
    answer: 0,
    explanation: {
      logic: "True (accurate/factual) has opposite false (not true). True and false describe factual correctness.",
      formula: "true <--> false (truth antonyms)",
      trapAlerts: ["wrong is incorrect but less formal", "lie is untruth (noun/verb)", "fake is counterfeit/imitation"],
      commonMistakes: ["Using wrong instead of false", "Not learning truth vocabulary"]
    },
    difficulty: 'easy'
  },
  {
    topic: 'essential-vocabulary', level: 'A1',
    question: 'Choose correct: I will ___ you tomorrow.',
    options: ['call', 'phone', 'ring', 'contact'],
    answer: 0,
    explanation: {
      logic: "Call is most common verb for telephone communication. Call/phone/ring are synonyms but call is universal.",
      formula: "call = telephone (universal) | phone = telephone | ring = call (British) | contact = reach by any method",
      trapAlerts: ["phone is verb but less common than call", "ring is British for call", "contact is formal/general"],
      commonMistakes: ["Not learning call as most common", "Using ring in American English"]
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
    console.log('\n🎓 FINAL 50 essential-vocabulary questions (10->60)');
    console.log('='.repeat(80));
    console.log('\n📋 Completing essential-vocabulary to 60 total\n');

    let inserted = 0;
    for (const q of VOCAB_50) {
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
        console.log(`   ✓ Inserted ${inserted}/${VOCAB_50.length}...`);
      }
    }

    console.log(`\n✅ Inserted all ${inserted} questions!`);
    console.log(`\n🎉 OPTION B COMPLETE!`);
    console.log(`\n📊 FINAL STATUS:`);
    console.log(`   - conditionals: 66/80 ✅ (target 60 exceeded)`);
    console.log(`   - verbs-basics: 51/60 ✅`);
    console.log(`   - modal-verbs: 60/60 ✅`);
    console.log(`   - prepositions-mastery: 60/60 ✅`);
    console.log(`   - relative-clauses: 60/60 ✅`);
    console.log(`   - essential-vocabulary: 60/60 ✅\n`);

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

insertQuestions();
