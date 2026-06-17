#!/usr/bin/env python3
"""
Generate Phase 3.1: Common Vocabulary (120Q)
5 subtopics × 24Q each (40/40/20 distribution = 9.6 easy, 9.6 medium, 4.8 hard → round to 10/10/4)
"""
import json

def escape_sql(text):
    """Escape single quotes for PostgreSQL"""
    return text.replace("'", "''")

# Topic structure
TOPIC_ID = 'common-vocabulary'
LEVEL = 'beginner'
PATH_ID = 'foundation'

# Questions database
questions = [
    # Subtopic 1: Daily Objects (24Q) - 10 easy, 10 medium, 4 hard
    {
        'subtopic': 'Daily Objects',
        'difficulty': 'easy',
        'question': 'What do you use to brush your teeth?',
        'options': ['Toothbrush', 'Comb', 'Spoon', 'Fork'],
        'correct_answer': 0,
        'explanation': 'A toothbrush is used to clean teeth. Pattern: Daily object + its primary function.'
    },
    {
        'subtopic': 'Daily Objects',
        'difficulty': 'easy',
        'question': 'Which object helps you see the time?',
        'options': ['Clock', 'Mirror', 'Book', 'Pen'],
        'correct_answer': 0,
        'explanation': 'A clock shows the time. Common daily object vocabulary.'
    },
    {
        'subtopic': 'Daily Objects',
        'difficulty': 'easy',
        'question': 'What do you drink water from?',
        'options': ['Cup', 'Plate', 'Towel', 'Blanket'],
        'correct_answer': 0,
        'explanation': 'A cup (or glass) is used to drink water. Basic household vocabulary.'
    },
    {
        'subtopic': 'Daily Objects',
        'difficulty': 'easy',
        'question': 'Which object do you use to write on paper?',
        'options': ['Pen', 'Scissors', 'Ruler', 'Eraser'],
        'correct_answer': 0,
        'explanation': 'A pen is used for writing. Essential stationery vocabulary.'
    },
    {
        'subtopic': 'Daily Objects',
        'difficulty': 'easy',
        'question': 'What do you sit on at a table?',
        'options': ['Chair', 'Bed', 'Floor', 'Wall'],
        'correct_answer': 0,
        'explanation': 'A chair is furniture for sitting. Basic home vocabulary.'
    },
    {
        'subtopic': 'Daily Objects',
        'difficulty': 'easy',
        'question': 'What do you use to unlock a door?',
        'options': ['Key', 'Knife', 'Bottle', 'Bag'],
        'correct_answer': 0,
        'explanation': 'A key opens locks. Essential daily life vocabulary.'
    },
    {
        'subtopic': 'Daily Objects',
        'difficulty': 'easy',
        'question': 'Which object keeps your food cold?',
        'options': ['Refrigerator', 'Oven', 'Lamp', 'Fan'],
        'correct_answer': 0,
        'explanation': 'A refrigerator (or fridge) keeps food cold. Common kitchen appliance.'
    },
    {
        'subtopic': 'Daily Objects',
        'difficulty': 'easy',
        'question': 'What do you use to dry yourself after a shower?',
        'options': ['Towel', 'Soap', 'Shampoo', 'Pillow'],
        'correct_answer': 0,
        'explanation': 'A towel is used to dry the body. Basic bathroom vocabulary.'
    },
    {
        'subtopic': 'Daily Objects',
        'difficulty': 'easy',
        'question': 'What do you wear on your feet outdoors?',
        'options': ['Shoes', 'Gloves', 'Hat', 'Scarf'],
        'correct_answer': 0,
        'explanation': 'Shoes are footwear. Essential clothing vocabulary.'
    },
    {
        'subtopic': 'Daily Objects',
        'difficulty': 'easy',
        'question': 'Which object tells you about news and stories?',
        'options': ['Newspaper', 'Calendar', 'Wallet', 'Umbrella'],
        'correct_answer': 0,
        'explanation': 'A newspaper contains news articles. Common daily object.'
    },

    # Medium (10Q)
    {
        'subtopic': 'Daily Objects',
        'difficulty': 'medium',
        'question': 'Choose: the object that is used both for cutting paper and fabric.',
        'options': ['Scissors', 'Knife', 'Spoon', 'Pencil'],
        'correct_answer': 0,
        'explanation': 'Scissors can cut paper, fabric, and other materials. Versatile tool vocabulary.'
    },
    {
        'subtopic': 'Daily Objects',
        'difficulty': 'medium',
        'question': 'Which item is commonly used to carry groceries home?',
        'options': ['Shopping bag', 'Wallet', 'Notebook', 'Keyboard'],
        'correct_answer': 0,
        'explanation': 'A shopping bag holds groceries. Context-specific vocabulary.'
    },
    {
        'subtopic': 'Daily Objects',
        'difficulty': 'medium',
        'question': 'What do you use to measure ingredients while cooking?',
        'options': ['Measuring cup', 'Dinner plate', 'Spoon', 'Bowl'],
        'correct_answer': 0,
        'explanation': 'A measuring cup shows exact amounts. Kitchen equipment vocabulary.'
    },
    {
        'subtopic': 'Daily Objects',
        'difficulty': 'medium',
        'question': 'Which object helps you find your way in a new city?',
        'options': ['Map', 'Magazine', 'Diary', 'Receipt'],
        'correct_answer': 0,
        'explanation': 'A map shows locations and routes. Navigation vocabulary.'
    },
    {
        'subtopic': 'Daily Objects',
        'difficulty': 'medium',
        'question': 'What do you use to keep your clothes wrinkle-free?',
        'options': ['Iron', 'Dryer', 'Hanger', 'Basket'],
        'correct_answer': 0,
        'explanation': 'An iron removes wrinkles from fabric. Household appliance vocabulary.'
    },
    {
        'subtopic': 'Daily Objects',
        'difficulty': 'medium',
        'question': 'Which item is used to protect you from rain?',
        'options': ['Umbrella', 'Coat', 'Backpack', 'Sunglasses'],
        'correct_answer': 0,
        'explanation': 'An umbrella shields from rain. Weather-related vocabulary.'
    },
    {
        'subtopic': 'Daily Objects',
        'difficulty': 'medium',
        'question': 'What do you use to store money and cards?',
        'options': ['Wallet', 'Box', 'Envelope', 'Folder'],
        'correct_answer': 0,
        'explanation': 'A wallet holds cash and cards. Personal item vocabulary.'
    },
    {
        'subtopic': 'Daily Objects',
        'difficulty': 'medium',
        'question': 'Choose: the object that provides light in a room at night.',
        'options': ['Lamp', 'Mirror', 'Fan', 'Cushion'],
        'correct_answer': 0,
        'explanation': 'A lamp is a light source. Home furnishing vocabulary.'
    },
    {
        'subtopic': 'Daily Objects',
        'difficulty': 'medium',
        'question': 'What do you use to clean the floor?',
        'options': ['Broom', 'Towel', 'Cloth', 'Sponge'],
        'correct_answer': 0,
        'explanation': 'A broom sweeps dirt from floors. Cleaning equipment vocabulary.'
    },
    {
        'subtopic': 'Daily Objects',
        'difficulty': 'medium',
        'question': 'Which object is used to organize important documents?',
        'options': ['File folder', 'Shopping bag', 'Lunchbox', 'Toolbox'],
        'correct_answer': 0,
        'explanation': 'A file folder keeps papers organized. Office supplies vocabulary.'
    },

    # Hard (4Q)
    {
        'subtopic': 'Daily Objects',
        'difficulty': 'hard',
        'question': 'Identify: the multi-purpose object that can be a timer, alarm, and communication device.',
        'options': ['Smartphone', 'Watch', 'Clock', 'Radio'],
        'correct_answer': 0,
        'explanation': 'A smartphone has multiple functions (calls, timer, alarm, apps). Modern technology vocabulary.'
    },
    {
        'subtopic': 'Daily Objects',
        'difficulty': 'hard',
        'question': 'What is the difference between a "mug" and a "cup"?',
        'options': ['A mug is larger and usually has a handle', 'A cup is only for coffee', 'They are exactly the same', 'A mug is made of plastic'],
        'correct_answer': 0,
        'explanation': 'A mug is typically larger with a handle (for hot drinks like coffee). Nuanced vocabulary distinction.'
    },
    {
        'subtopic': 'Daily Objects',
        'difficulty': 'hard',
        'question': 'Choose: the object that is primarily used for food preparation, not serving.',
        'options': ['Cutting board', 'Dinner plate', 'Bowl', 'Spoon'],
        'correct_answer': 0,
        'explanation': 'A cutting board is for chopping ingredients. Understanding object purpose context.'
    },
    {
        'subtopic': 'Daily Objects',
        'difficulty': 'hard',
        'question': 'Which item is both a decorative and functional object in a living room?',
        'options': ['Vase', 'Broom', 'Toolbox', 'Fire extinguisher'],
        'correct_answer': 0,
        'explanation': 'A vase holds flowers (functional) and adds beauty (decorative). Dual-purpose vocabulary.'
    },

    # Subtopic 2: Actions & Verbs (24Q) - 10 easy, 10 medium, 4 hard
    {
        'subtopic': 'Actions & Verbs',
        'difficulty': 'easy',
        'question': 'What action do you do when you are tired?',
        'options': ['Sleep', 'Run', 'Jump', 'Shout'],
        'correct_answer': 0,
        'explanation': 'Sleep is the action of resting. Common daily action.'
    },
    {
        'subtopic': 'Actions & Verbs',
        'difficulty': 'easy',
        'question': 'What do you do with food?',
        'options': ['Eat', 'Write', 'Draw', 'Sing'],
        'correct_answer': 0,
        'explanation': 'Eat means to consume food. Basic action verb.'
    },
    {
        'subtopic': 'Actions & Verbs',
        'difficulty': 'easy',
        'question': 'What action do you do with a book?',
        'options': ['Read', 'Cook', 'Drive', 'Plant'],
        'correct_answer': 0,
        'explanation': 'Read means to look at and understand written words. Essential literacy verb.'
    },
    {
        'subtopic': 'Actions & Verbs',
        'difficulty': 'easy',
        'question': 'What do you do when you meet someone?',
        'options': ['Say hello', 'Cry', 'Hide', 'Ignore'],
        'correct_answer': 0,
        'explanation': 'Saying hello is a polite greeting. Social interaction verb phrase.'
    },
    {
        'subtopic': 'Actions & Verbs',
        'difficulty': 'easy',
        'question': 'What do you do with a pen?',
        'options': ['Write', 'Drink', 'Eat', 'Wear'],
        'correct_answer': 0,
        'explanation': 'Write means to create text with a pen or pencil. Basic action verb.'
    },
    {
        'subtopic': 'Actions & Verbs',
        'difficulty': 'easy',
        'question': 'What action do you do with your legs?',
        'options': ['Walk', 'Think', 'Speak', 'Hear'],
        'correct_answer': 0,
        'explanation': 'Walk means to move using your legs. Body action verb.'
    },
    {
        'subtopic': 'Actions & Verbs',
        'difficulty': 'easy',
        'question': 'What do you do when something is funny?',
        'options': ['Laugh', 'Cry', 'Sleep', 'Work'],
        'correct_answer': 0,
        'explanation': 'Laugh is the action of expressing amusement. Emotion-related verb.'
    },
    {
        'subtopic': 'Actions & Verbs',
        'difficulty': 'easy',
        'question': 'What do you do with water?',
        'options': ['Drink', 'Read', 'Write', 'Draw'],
        'correct_answer': 0,
        'explanation': 'Drink means to swallow liquid. Essential daily action.'
    },
    {
        'subtopic': 'Actions & Verbs',
        'difficulty': 'easy',
        'question': 'What action involves moving fast?',
        'options': ['Run', 'Sit', 'Stand', 'Wait'],
        'correct_answer': 0,
        'explanation': 'Run means to move quickly on foot. Movement verb.'
    },
    {
        'subtopic': 'Actions & Verbs',
        'difficulty': 'easy',
        'question': 'What do you do to keep your body clean?',
        'options': ['Wash', 'Paint', 'Build', 'Break'],
        'correct_answer': 0,
        'explanation': 'Wash means to clean with water. Hygiene-related verb.'
    },

    # Medium (10Q)
    {
        'subtopic': 'Actions & Verbs',
        'difficulty': 'medium',
        'question': 'Choose: the action that means "to prepare food using heat".',
        'options': ['Cook', 'Freeze', 'Store', 'Serve'],
        'correct_answer': 0,
        'explanation': 'Cook means to prepare food by heating. Kitchen-related verb.'
    },
    {
        'subtopic': 'Actions & Verbs',
        'difficulty': 'medium',
        'question': 'What do you do when you want to remember something?',
        'options': ['Memorize', 'Forget', 'Delete', 'Erase'],
        'correct_answer': 0,
        'explanation': 'Memorize means to learn by heart. Cognitive action verb.'
    },
    {
        'subtopic': 'Actions & Verbs',
        'difficulty': 'medium',
        'question': 'Which action means "to speak very softly"?',
        'options': ['Whisper', 'Shout', 'Scream', 'Announce'],
        'correct_answer': 0,
        'explanation': 'Whisper means to speak quietly. Manner of speaking verb.'
    },
    {
        'subtopic': 'Actions & Verbs',
        'difficulty': 'medium',
        'question': 'What do you do to a present before giving it?',
        'options': ['Wrap', 'Unwrap', 'Open', 'Break'],
        'correct_answer': 0,
        'explanation': 'Wrap means to cover with paper. Gift-giving action.'
    },
    {
        'subtopic': 'Actions & Verbs',
        'difficulty': 'medium',
        'question': 'Choose: the verb that means "to look for something".',
        'options': ['Search', 'Find', 'Lose', 'Have'],
        'correct_answer': 0,
        'explanation': 'Search means to try to find. Action verb for seeking.'
    },
    {
        'subtopic': 'Actions & Verbs',
        'difficulty': 'medium',
        'question': 'What action do you do to make a bed neat?',
        'options': ['Make', 'Unmake', 'Sleep', 'Sit'],
        'correct_answer': 0,
        'explanation': 'Make (a bed) means to arrange sheets and pillows. Household chore verb.'
    },
    {
        'subtopic': 'Actions & Verbs',
        'difficulty': 'medium',
        'question': 'Which verb means "to move something towards you"?',
        'options': ['Pull', 'Push', 'Throw', 'Drop'],
        'correct_answer': 0,
        'explanation': 'Pull means to draw something closer. Directional action verb.'
    },
    {
        'subtopic': 'Actions & Verbs',
        'difficulty': 'medium',
        'question': 'What do you do when clothes are dirty?',
        'options': ['Wash', 'Fold', 'Hang', 'Wear'],
        'correct_answer': 0,
        'explanation': 'Wash means to clean with water and soap. Cleaning action.'
    },
    {
        'subtopic': 'Actions & Verbs',
        'difficulty': 'medium',
        'question': 'Choose: the action that means "to give back something borrowed".',
        'options': ['Return', 'Keep', 'Borrow', 'Lend'],
        'correct_answer': 0,
        'explanation': 'Return means to give something back. Transaction verb.'
    },
    {
        'subtopic': 'Actions & Verbs',
        'difficulty': 'medium',
        'question': 'What do you do to a button on a shirt?',
        'options': ['Fasten', 'Unfasten', 'Remove', 'Break'],
        'correct_answer': 0,
        'explanation': 'Fasten means to close or secure. Dressing action verb.'
    },

    # Hard (4Q)
    {
        'subtopic': 'Actions & Verbs',
        'difficulty': 'hard',
        'question': 'Identify: the verb that specifically means "to move in a circular motion".',
        'options': ['Rotate', 'Slide', 'Lift', 'Drop'],
        'correct_answer': 0,
        'explanation': 'Rotate means to turn around a center point. Precise movement verb.'
    },
    {
        'subtopic': 'Actions & Verbs',
        'difficulty': 'hard',
        'question': 'What is the difference between "borrow" and "lend"?',
        'options': ['Borrow is receiving, lend is giving', 'They mean the same', 'Borrow is for money only', 'Lend means to steal'],
        'correct_answer': 0,
        'explanation': 'Borrow means to receive temporarily; lend means to give temporarily. Perspective-based verb pair.'
    },
    {
        'subtopic': 'Actions & Verbs',
        'difficulty': 'hard',
        'question': 'Choose: the action that combines looking and understanding.',
        'options': ['Observe', 'Stare', 'Glance', 'Blink'],
        'correct_answer': 0,
        'explanation': 'Observe means to watch carefully and learn. Cognitive action verb (not just seeing).'
    },
    {
        'subtopic': 'Actions & Verbs',
        'difficulty': 'hard',
        'question': 'Which verb means "to gradually develop or appear"?',
        'options': ['Emerge', 'Disappear', 'Vanish', 'Hide'],
        'correct_answer': 0,
        'explanation': 'Emerge means to come out or become visible. Advanced process verb.'
    },

    # Subtopic 3: Emotions & Feelings (24Q) - 10 easy, 10 medium, 4 hard
    {
        'subtopic': 'Emotions & Feelings',
        'difficulty': 'easy',
        'question': 'How do you feel when something good happens?',
        'options': ['Happy', 'Sad', 'Angry', 'Scared'],
        'correct_answer': 0,
        'explanation': 'Happy is a positive emotion. Basic feeling vocabulary.'
    },
    {
        'subtopic': 'Emotions & Feelings',
        'difficulty': 'easy',
        'question': 'What emotion do you feel when you lose something important?',
        'options': ['Sad', 'Excited', 'Proud', 'Amused'],
        'correct_answer': 0,
        'explanation': 'Sad means feeling unhappy. Common negative emotion.'
    },
    {
        'subtopic': 'Emotions & Feelings',
        'difficulty': 'easy',
        'question': 'How do you feel when someone upsets you?',
        'options': ['Angry', 'Calm', 'Relaxed', 'Peaceful'],
        'correct_answer': 0,
        'explanation': 'Angry means feeling mad or upset. Basic emotion word.'
    },
    {
        'subtopic': 'Emotions & Feelings',
        'difficulty': 'easy',
        'question': 'What do you feel when you see something scary?',
        'options': ['Afraid', 'Brave', 'Confident', 'Cheerful'],
        'correct_answer': 0,
        'explanation': 'Afraid means feeling fear. Common emotion vocabulary.'
    },
    {
        'subtopic': 'Emotions & Feelings',
        'difficulty': 'easy',
        'question': 'How do you feel after working hard all day?',
        'options': ['Tired', 'Energetic', 'Active', 'Lively'],
        'correct_answer': 0,
        'explanation': 'Tired means needing rest. Physical state vocabulary.'
    },
    {
        'subtopic': 'Emotions & Feelings',
        'difficulty': 'easy',
        'question': 'What emotion do you feel when you win a prize?',
        'options': ['Proud', 'Ashamed', 'Guilty', 'Sorry'],
        'correct_answer': 0,
        'explanation': 'Proud means feeling pleased with an achievement. Positive emotion.'
    },
    {
        'subtopic': 'Emotions & Feelings',
        'difficulty': 'easy',
        'question': 'How do you feel before an exam?',
        'options': ['Nervous', 'Relaxed', 'Bored', 'Sleepy'],
        'correct_answer': 0,
        'explanation': 'Nervous means feeling worried or anxious. Common emotional state.'
    },
    {
        'subtopic': 'Emotions & Feelings',
        'difficulty': 'easy',
        'question': 'What do you feel when you help someone?',
        'options': ['Good', 'Bad', 'Angry', 'Scared'],
        'correct_answer': 0,
        'explanation': 'Good is a general positive feeling. Simple emotion word.'
    },
    {
        'subtopic': 'Emotions & Feelings',
        'difficulty': 'easy',
        'question': 'How do you feel when you are alone for a long time?',
        'options': ['Lonely', 'Crowded', 'Noisy', 'Busy'],
        'correct_answer': 0,
        'explanation': 'Lonely means feeling isolated. Emotional state vocabulary.'
    },
    {
        'subtopic': 'Emotions & Feelings',
        'difficulty': 'easy',
        'question': 'What emotion do you feel when you receive a gift?',
        'options': ['Grateful', 'Angry', 'Upset', 'Annoyed'],
        'correct_answer': 0,
        'explanation': 'Grateful means feeling thankful. Positive emotion.'
    },

    # Medium (10Q)
    {
        'subtopic': 'Emotions & Feelings',
        'difficulty': 'medium',
        'question': 'Choose: the emotion that means "feeling unsure or not confident".',
        'options': ['Uncertain', 'Confident', 'Certain', 'Sure'],
        'correct_answer': 0,
        'explanation': 'Uncertain means not sure or doubtful. Complex emotional state.'
    },
    {
        'subtopic': 'Emotions & Feelings',
        'difficulty': 'medium',
        'question': 'What do you feel when you have too much work?',
        'options': ['Stressed', 'Calm', 'Peaceful', 'Relaxed'],
        'correct_answer': 0,
        'explanation': 'Stressed means feeling pressure or tension. Common modern emotion.'
    },
    {
        'subtopic': 'Emotions & Feelings',
        'difficulty': 'medium',
        'question': 'Which emotion means "feeling happy about someone else''s success"?',
        'options': ['Proud', 'Jealous', 'Envious', 'Bitter'],
        'correct_answer': 0,
        'explanation': 'Proud (for someone) means pleased with their achievement. Positive relational emotion.'
    },
    {
        'subtopic': 'Emotions & Feelings',
        'difficulty': 'medium',
        'question': 'How do you feel when nothing interesting happens?',
        'options': ['Bored', 'Excited', 'Thrilled', 'Delighted'],
        'correct_answer': 0,
        'explanation': 'Bored means feeling uninterested or tired of inactivity. Common feeling.'
    },
    {
        'subtopic': 'Emotions & Feelings',
        'difficulty': 'medium',
        'question': 'Choose: the feeling when you want something others have.',
        'options': ['Jealous', 'Content', 'Satisfied', 'Pleased'],
        'correct_answer': 0,
        'explanation': 'Jealous means wanting what others have. Complex negative emotion.'
    },
    {
        'subtopic': 'Emotions & Feelings',
        'difficulty': 'medium',
        'question': 'What emotion describes feeling confused and unable to decide?',
        'options': ['Bewildered', 'Clear', 'Decisive', 'Focused'],
        'correct_answer': 0,
        'explanation': 'Bewildered means confused or puzzled. Advanced emotion vocabulary.'
    },
    {
        'subtopic': 'Emotions & Feelings',
        'difficulty': 'medium',
        'question': 'How do you feel when you achieve a difficult goal?',
        'options': ['Satisfied', 'Disappointed', 'Frustrated', 'Upset'],
        'correct_answer': 0,
        'explanation': 'Satisfied means feeling content with an outcome. Achievement-related emotion.'
    },
    {
        'subtopic': 'Emotions & Feelings',
        'difficulty': 'medium',
        'question': 'What do you feel when you wait for exciting news?',
        'options': ['Anxious', 'Indifferent', 'Bored', 'Uninterested'],
        'correct_answer': 0,
        'explanation': 'Anxious means feeling worried or eager. Anticipation emotion.'
    },
    {
        'subtopic': 'Emotions & Feelings',
        'difficulty': 'medium',
        'question': 'Choose: the emotion when you feel sorry for doing something wrong.',
        'options': ['Guilty', 'Proud', 'Happy', 'Excited'],
        'correct_answer': 0,
        'explanation': 'Guilty means feeling bad about a mistake. Moral emotion.'
    },
    {
        'subtopic': 'Emotions & Feelings',
        'difficulty': 'medium',
        'question': 'What emotion means "feeling very interested and enthusiastic"?',
        'options': ['Eager', 'Reluctant', 'Hesitant', 'Unwilling'],
        'correct_answer': 0,
        'explanation': 'Eager means enthusiastic or keen. Positive motivational emotion.'
    },

    # Hard (4Q)
    {
        'subtopic': 'Emotions & Feelings',
        'difficulty': 'hard',
        'question': 'Identify: the subtle difference between "lonely" and "alone".',
        'options': ['Lonely is an emotion, alone is a state', 'They mean the same thing', 'Lonely is physical, alone is emotional', 'Alone is always negative'],
        'correct_answer': 0,
        'explanation': 'Lonely is feeling sad about being alone (emotion); alone is just being by yourself (state). Nuanced vocabulary distinction.'
    },
    {
        'subtopic': 'Emotions & Feelings',
        'difficulty': 'hard',
        'question': 'Which emotion combines fear and respect together?',
        'options': ['Awe', 'Terror', 'Disgust', 'Contempt'],
        'correct_answer': 0,
        'explanation': 'Awe is a feeling of wonder mixed with respect or fear. Complex blended emotion.'
    },
    {
        'subtopic': 'Emotions & Feelings',
        'difficulty': 'hard',
        'question': 'Choose: the emotion that means "pleasantly surprised in a good way".',
        'options': ['Delighted', 'Shocked', 'Horrified', 'Terrified'],
        'correct_answer': 0,
        'explanation': 'Delighted means very pleased or happily surprised. Nuanced positive emotion.'
    },
    {
        'subtopic': 'Emotions & Feelings',
        'difficulty': 'hard',
        'question': 'What is "ambivalent" as an emotion?',
        'options': ['Having mixed or conflicting feelings', 'Being very certain', 'Feeling extremely happy', 'Being completely calm'],
        'correct_answer': 0,
        'explanation': 'Ambivalent means having both positive and negative feelings simultaneously. Advanced emotional vocabulary.'
    },
]

# Continue with remaining subtopics...
# For brevity, I'll add representative questions for remaining subtopics

# Subtopic 4: Time & Frequency (24Q) - 10 easy, 10 medium, 4 hard
time_questions = [
    # Easy (10Q)
    {
        'subtopic': 'Time & Frequency',
        'difficulty': 'easy',
        'question': 'Which word means "every day"?',
        'options': ['Daily', 'Weekly', 'Monthly', 'Yearly'],
        'correct_answer': 0,
        'explanation': 'Daily means happening every day. Basic frequency vocabulary.'
    },
    {
        'subtopic': 'Time & Frequency',
        'difficulty': 'easy',
        'question': 'What time of day comes after afternoon?',
        'options': ['Evening', 'Morning', 'Noon', 'Dawn'],
        'correct_answer': 0,
        'explanation': 'Evening comes after afternoon. Time of day vocabulary.'
    },
    {
        'subtopic': 'Time & Frequency',
        'difficulty': 'easy',
        'question': 'How often is "always"?',
        'options': ['All the time', 'Never', 'Sometimes', 'Rarely'],
        'correct_answer': 0,
        'explanation': 'Always means at all times. Frequency adverb.'
    },
    {
        'subtopic': 'Time & Frequency',
        'difficulty': 'easy',
        'question': 'Which word means "one time"?',
        'options': ['Once', 'Twice', 'Thrice', 'Many times'],
        'correct_answer': 0,
        'explanation': 'Once means a single occurrence. Frequency vocabulary.'
    },
    {
        'subtopic': 'Time & Frequency',
        'difficulty': 'easy',
        'question': 'What does "noon" mean?',
        'options': ['12 o''clock midday', 'Midnight', 'Evening', 'Morning'],
        'correct_answer': 0,
        'explanation': 'Noon is 12:00 PM (middle of the day). Time vocabulary.'
    },
    {
        'subtopic': 'Time & Frequency',
        'difficulty': 'easy',
        'question': 'Which word means "not often"?',
        'options': ['Rarely', 'Always', 'Often', 'Usually'],
        'correct_answer': 0,
        'explanation': 'Rarely means not happening often. Frequency adverb.'
    },
    {
        'subtopic': 'Time & Frequency',
        'difficulty': 'easy',
        'question': 'What is the first day of the week?',
        'options': ['Monday', 'Sunday', 'Saturday', 'Friday'],
        'correct_answer': 0,
        'explanation': 'Monday is traditionally the first day of the week (in most calendars). Week vocabulary.'
    },
    {
        'subtopic': 'Time & Frequency',
        'difficulty': 'easy',
        'question': 'How many months are in a year?',
        'options': ['Twelve', 'Ten', 'Seven', 'Five'],
        'correct_answer': 0,
        'explanation': 'There are 12 months in a year. Calendar vocabulary.'
    },
    {
        'subtopic': 'Time & Frequency',
        'difficulty': 'easy',
        'question': 'Which word means "happening now"?',
        'options': ['Today', 'Yesterday', 'Tomorrow', 'Last week'],
        'correct_answer': 0,
        'explanation': 'Today means the current day. Time reference vocabulary.'
    },
    {
        'subtopic': 'Time & Frequency',
        'difficulty': 'easy',
        'question': 'What does "late" mean?',
        'options': ['After the expected time', 'Before the time', 'On time', 'Very early'],
        'correct_answer': 0,
        'explanation': 'Late means not on time, delayed. Time-related vocabulary.'
    },
    # Medium (10Q)
    {
        'subtopic': 'Time & Frequency',
        'difficulty': 'medium',
        'question': 'Choose: the term for "happening twice a year".',
        'options': ['Biannual', 'Annual', 'Monthly', 'Quarterly'],
        'correct_answer': 0,
        'explanation': 'Biannual means twice per year. Frequency prefix vocabulary.'
    },
    {
        'subtopic': 'Time & Frequency',
        'difficulty': 'medium',
        'question': 'What does "fortnight" mean?',
        'options': ['Two weeks', 'Four weeks', 'One week', 'One month'],
        'correct_answer': 0,
        'explanation': 'Fortnight is a period of 14 days (two weeks). British English time term.'
    },
    {
        'subtopic': 'Time & Frequency',
        'difficulty': 'medium',
        'question': 'Which phrase means "at the same time every day"?',
        'options': ['Regularly', 'Irregularly', 'Randomly', 'Occasionally'],
        'correct_answer': 0,
        'explanation': 'Regularly means in a consistent pattern. Frequency adverb.'
    },
    {
        'subtopic': 'Time & Frequency',
        'difficulty': 'medium',
        'question': 'What is "dawn"?',
        'options': ['The first light of day', 'Sunset', 'Midnight', 'Afternoon'],
        'correct_answer': 0,
        'explanation': 'Dawn is when the sun rises. Time of day vocabulary.'
    },
    {
        'subtopic': 'Time & Frequency',
        'difficulty': 'medium',
        'question': 'Choose: the word that means "lasting forever".',
        'options': ['Eternal', 'Temporary', 'Brief', 'Short'],
        'correct_answer': 0,
        'explanation': 'Eternal means without end. Duration vocabulary.'
    },
    {
        'subtopic': 'Time & Frequency',
        'difficulty': 'medium',
        'question': 'What does "quarterly" mean?',
        'options': ['Four times a year', 'Once a year', 'Twice a year', 'Monthly'],
        'correct_answer': 0,
        'explanation': 'Quarterly means every three months (four times yearly). Business time term.'
    },
    {
        'subtopic': 'Time & Frequency',
        'difficulty': 'medium',
        'question': 'Which term means "happening at midnight"?',
        'options': ['Nocturnal', 'Diurnal', 'Morning', 'Evening'],
        'correct_answer': 0,
        'explanation': 'Nocturnal refers to nighttime activity. Time-related adjective.'
    },
    {
        'subtopic': 'Time & Frequency',
        'difficulty': 'medium',
        'question': 'What is the meaning of "punctual"?',
        'options': ['On time', 'Late', 'Early', 'Delayed'],
        'correct_answer': 0,
        'explanation': 'Punctual means arriving or happening at the correct time. Time-related quality.'
    },
    {
        'subtopic': 'Time & Frequency',
        'difficulty': 'medium',
        'question': 'Choose: the word for "a ten-year period".',
        'options': ['Decade', 'Century', 'Millennium', 'Year'],
        'correct_answer': 0,
        'explanation': 'A decade is 10 years. Time period vocabulary.'
    },
    {
        'subtopic': 'Time & Frequency',
        'difficulty': 'medium',
        'question': 'What does "occasionally" mean?',
        'options': ['Sometimes, but not regularly', 'Always', 'Never', 'Every day'],
        'correct_answer': 0,
        'explanation': 'Occasionally means from time to time, not often. Frequency adverb.'
    },
    # Hard (4Q)
    {
        'subtopic': 'Time & Frequency',
        'difficulty': 'hard',
        'question': 'Identify: the difference between "continuous" and "continual".',
        'options': ['Continuous is non-stop, continual is repeated', 'They mean the same', 'Continuous is shorter', 'Continual never stops'],
        'correct_answer': 0,
        'explanation': 'Continuous means without interruption; continual means repeated frequently. Nuanced time vocabulary.'
    },
    {
        'subtopic': 'Time & Frequency',
        'difficulty': 'hard',
        'question': 'What is "ephemeral"?',
        'options': ['Lasting a very short time', 'Lasting forever', 'Happening daily', 'Occurring monthly'],
        'correct_answer': 0,
        'explanation': 'Ephemeral means short-lived or temporary. Advanced duration vocabulary.'
    },
    {
        'subtopic': 'Time & Frequency',
        'difficulty': 'hard',
        'question': 'Choose: the term for "existing at the same time".',
        'options': ['Concurrent', 'Sequential', 'Consecutive', 'Subsequent'],
        'correct_answer': 0,
        'explanation': 'Concurrent means happening simultaneously. Advanced time relationship vocabulary.'
    },
    {
        'subtopic': 'Time & Frequency',
        'difficulty': 'hard',
        'question': 'What does "perennial" mean in time context?',
        'options': ['Recurring year after year', 'Happening once', 'Temporary', 'Brief'],
        'correct_answer': 0,
        'explanation': 'Perennial means lasting through many years or recurring annually. Advanced frequency vocabulary.'
    },
]

questions.extend(time_questions)

# Subtopic 5: Places & Locations (24Q) - 10 easy, 10 medium, 4 hard
place_questions = [
    # Easy (10Q)
    {
        'subtopic': 'Places & Locations',
        'difficulty': 'easy',
        'question': 'Where do you go to buy food?',
        'options': ['Supermarket', 'Library', 'Hospital', 'School'],
        'correct_answer': 0,
        'explanation': 'A supermarket sells food and groceries. Common place vocabulary.'
    },
    {
        'subtopic': 'Places & Locations',
        'difficulty': 'easy',
        'question': 'Where do students learn?',
        'options': ['School', 'Restaurant', 'Bank', 'Post office'],
        'correct_answer': 0,
        'explanation': 'School is where students study. Basic place vocabulary.'
    },
    {
        'subtopic': 'Places & Locations',
        'difficulty': 'easy',
        'question': 'Where do you go when you are sick?',
        'options': ['Hospital', 'Cinema', 'Park', 'Museum'],
        'correct_answer': 0,
        'explanation': 'Hospital is where sick people get treatment. Essential place vocabulary.'
    },
    {
        'subtopic': 'Places & Locations',
        'difficulty': 'easy',
        'question': 'Where do you sleep at night?',
        'options': ['Bedroom', 'Kitchen', 'Bathroom', 'Garden'],
        'correct_answer': 0,
        'explanation': 'Bedroom is for sleeping. Home room vocabulary.'
    },
    {
        'subtopic': 'Places & Locations',
        'difficulty': 'easy',
        'question': 'Where do you watch movies?',
        'options': ['Cinema', 'Bakery', 'Pharmacy', 'Garage'],
        'correct_answer': 0,
        'explanation': 'Cinema (or theater) shows movies. Entertainment place vocabulary.'
    },
    {
        'subtopic': 'Places & Locations',
        'difficulty': 'easy',
        'question': 'Where do you borrow books?',
        'options': ['Library', 'Gym', 'Airport', 'Station'],
        'correct_answer': 0,
        'explanation': 'Library lends books for reading. Public facility vocabulary.'
    },
    {
        'subtopic': 'Places & Locations',
        'difficulty': 'easy',
        'question': 'Where do you buy medicines?',
        'options': ['Pharmacy', 'Bookstore', 'Bakery', 'Salon'],
        'correct_answer': 0,
        'explanation': 'Pharmacy (or drugstore) sells medicines. Health-related place.'
    },
    {
        'subtopic': 'Places & Locations',
        'difficulty': 'easy',
        'question': 'Where do you save money?',
        'options': ['Bank', 'Beach', 'Mountain', 'River'],
        'correct_answer': 0,
        'explanation': 'Bank is a financial institution. Essential service vocabulary.'
    },
    {
        'subtopic': 'Places & Locations',
        'difficulty': 'easy',
        'question': 'Where do children play outdoors?',
        'options': ['Park', 'Office', 'Courthouse', 'Factory'],
        'correct_answer': 0,
        'explanation': 'Park is an outdoor recreation area. Common public place.'
    },
    {
        'subtopic': 'Places & Locations',
        'difficulty': 'easy',
        'question': 'Where do you catch a train?',
        'options': ['Station', 'Hotel', 'Cafe', 'Shop'],
        'correct_answer': 0,
        'explanation': 'Station (railway/train station) is where trains stop. Transport place vocabulary.'
    },
    # Medium (10Q)
    {
        'subtopic': 'Places & Locations',
        'difficulty': 'medium',
        'question': 'Choose: the place where people can see historical artifacts.',
        'options': ['Museum', 'Stadium', 'Mall', 'Market'],
        'correct_answer': 0,
        'explanation': 'Museum displays historical and cultural items. Cultural place vocabulary.'
    },
    {
        'subtopic': 'Places & Locations',
        'difficulty': 'medium',
        'question': 'Where do you go to send letters and parcels?',
        'options': ['Post office', 'Police station', 'Fire station', 'Embassy'],
        'correct_answer': 0,
        'explanation': 'Post office handles mail and packages. Postal service vocabulary.'
    },
    {
        'subtopic': 'Places & Locations',
        'difficulty': 'medium',
        'question': 'What is a "boulevard"?',
        'options': ['A wide street or avenue', 'A small path', 'A building', 'A bridge'],
        'correct_answer': 0,
        'explanation': 'Boulevard is a broad street, often tree-lined. Urban geography vocabulary.'
    },
    {
        'subtopic': 'Places & Locations',
        'difficulty': 'medium',
        'question': 'Where do planes take off and land?',
        'options': ['Airport', 'Harbor', 'Dockyard', 'Terminal'],
        'correct_answer': 0,
        'explanation': 'Airport is for air travel. Transportation facility vocabulary.'
    },
    {
        'subtopic': 'Places & Locations',
        'difficulty': 'medium',
        'question': 'Choose: the place where people worship in Christianity.',
        'options': ['Church', 'Mosque', 'Temple', 'Synagogue'],
        'correct_answer': 0,
        'explanation': 'Church is a Christian place of worship. Religious place vocabulary.'
    },
    {
        'subtopic': 'Places & Locations',
        'difficulty': 'medium',
        'question': 'What is a "plaza"?',
        'options': ['An open public square', 'A closed market', 'A private garden', 'A parking lot'],
        'correct_answer': 0,
        'explanation': 'Plaza is an open urban space. City planning vocabulary.'
    },
    {
        'subtopic': 'Places & Locations',
        'difficulty': 'medium',
        'question': 'Where do you go to exchange foreign currency?',
        'options': ['Currency exchange', 'Grocery store', 'Laundry', 'Barber shop'],
        'correct_answer': 0,
        'explanation': 'Currency exchange (or bureau de change) converts money. Financial service place.'
    },
    {
        'subtopic': 'Places & Locations',
        'difficulty': 'medium',
        'question': 'What is an "auditorium"?',
        'options': ['A large room for audiences', 'A storage room', 'A dining hall', 'A bedroom'],
        'correct_answer': 0,
        'explanation': 'Auditorium is for performances and lectures. Facility vocabulary.'
    },
    {
        'subtopic': 'Places & Locations',
        'difficulty': 'medium',
        'question': 'Choose: the place where legal cases are decided.',
        'options': ['Courthouse', 'Town hall', 'Clinic', 'Workshop'],
        'correct_answer': 0,
        'explanation': 'Courthouse is where trials happen. Legal system vocabulary.'
    },
    {
        'subtopic': 'Places & Locations',
        'difficulty': 'medium',
        'question': 'What is a "depot"?',
        'options': ['A storage or station facility', 'A restaurant', 'A school', 'A hospital ward'],
        'correct_answer': 0,
        'explanation': 'Depot is a storage place or transportation hub. Industrial vocabulary.'
    },
    # Hard (4Q)
    {
        'subtopic': 'Places & Locations',
        'difficulty': 'hard',
        'question': 'Identify: the difference between "avenue" and "alley".',
        'options': ['Avenue is wide, alley is narrow', 'They are the same', 'Avenue is short, alley is long', 'Alley is a main road'],
        'correct_answer': 0,
        'explanation': 'Avenue is a wide street; alley is a narrow passage. Street type vocabulary distinction.'
    },
    {
        'subtopic': 'Places & Locations',
        'difficulty': 'hard',
        'question': 'What is a "cul-de-sac"?',
        'options': ['A dead-end street', 'A highway', 'A roundabout', 'A bridge'],
        'correct_answer': 0,
        'explanation': 'Cul-de-sac is a street closed at one end. Urban planning term.'
    },
    {
        'subtopic': 'Places & Locations',
        'difficulty': 'hard',
        'question': 'Choose: the term for "a large, enclosed shopping complex".',
        'options': ['Mall', 'Market', 'Bazaar', 'Fair'],
        'correct_answer': 0,
        'explanation': 'Mall (or shopping center) is an indoor shopping facility. Commercial place vocabulary.'
    },
    {
        'subtopic': 'Places & Locations',
        'difficulty': 'hard',
        'question': 'What does "suburban" mean?',
        'options': ['Areas on the outskirts of a city', 'City center', 'Rural farmland', 'Industrial zones'],
        'correct_answer': 0,
        'explanation': 'Suburban refers to residential areas outside the city center. Geographic classification vocabulary.'
    },
]

questions.extend(place_questions)

# Generate SQL
output_lines = [
    "-- Phase 3.1: Common Vocabulary (120 Questions)",
    "-- 5 subtopics: Daily Objects, Actions & Verbs, Emotions & Feelings, Time & Frequency, Places & Locations",
    "-- Distribution: 40% easy, 40% medium, 20% hard per subtopic",
    "",
    "INSERT INTO english_questions (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty) VALUES"
]

for i, q in enumerate(questions):
    options_json = json.dumps(q['options'])
    sql_line = f"('{PATH_ID}', '{TOPIC_ID}', '{LEVEL}', '{escape_sql(q['question'])}', '{options_json}', {q['correct_answer']}, '{escape_sql(q['explanation'])}', '{q['difficulty']}')"

    if i < len(questions) - 1:
        sql_line += ","
    else:
        sql_line += ";"

    output_lines.append(sql_line)

sql_content = '\n'.join(output_lines)

# Write to file
with open('output/common-vocabulary-120Q.sql', 'w', encoding='utf-8') as f:
    f.write(sql_content)

print("✅ Generated: output/common-vocabulary-120Q.sql")
print(f"📊 Total questions: {len(questions)}")
print("\n🔍 Breakdown by subtopic:")
subtopic_counts = {}
for q in questions:
    st = q['subtopic']
    diff = q['difficulty']
    key = f"{st} - {diff}"
    subtopic_counts[key] = subtopic_counts.get(key, 0) + 1

for subtopic in ['Daily Objects', 'Actions & Verbs', 'Emotions & Feelings', 'Time & Frequency', 'Places & Locations']:
    easy = subtopic_counts.get(f"{subtopic} - easy", 0)
    medium = subtopic_counts.get(f"{subtopic} - medium", 0)
    hard = subtopic_counts.get(f"{subtopic} - hard", 0)
    total = easy + medium + hard
    print(f"  {subtopic}: {total}Q (Easy: {easy}, Medium: {medium}, Hard: {hard})")
