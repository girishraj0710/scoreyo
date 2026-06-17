#!/usr/bin/env python3
"""
Generate Phase 3.2: Synonyms & Antonyms (100Q)
4 subtopics × 25Q each (40/40/20 = 10 easy, 10 medium, 5 hard per subtopic)
"""
import json

def escape_sql(text):
    return text.replace("'", "''")

TOPIC_ID = 'synonyms-antonyms'
LEVEL = 'beginner'
PATH_ID = 'foundation'

questions = [
    # Subtopic 1: Basic Synonyms (25Q) - 10 easy, 10 medium, 5 hard
    # Easy (10Q)
    {
        'subtopic': 'Basic Synonyms',
        'difficulty': 'easy',
        'question': 'Choose: a word that means the same as "happy".',
        'options': ['Joyful', 'Sad', 'Angry', 'Tired'],
        'correct_answer': 0,
        'explanation': 'Joyful and happy both mean feeling pleased. Common synonym pair.'
    },
    {
        'subtopic': 'Basic Synonyms',
        'difficulty': 'easy',
        'question': 'Which word is a synonym for "big"?',
        'options': ['Large', 'Small', 'Tiny', 'Little'],
        'correct_answer': 0,
        'explanation': 'Large means big in size. Basic size synonym.'
    },
    {
        'subtopic': 'Basic Synonyms',
        'difficulty': 'easy',
        'question': 'Choose: a synonym for "start".',
        'options': ['Begin', 'End', 'Finish', 'Stop'],
        'correct_answer': 0,
        'explanation': 'Begin and start both mean to commence. Common action synonym.'
    },
    {
        'subtopic': 'Basic Synonyms',
        'difficulty': 'easy',
        'question': 'Which word means the same as "quick"?',
        'options': ['Fast', 'Slow', 'Heavy', 'Light'],
        'correct_answer': 0,
        'explanation': 'Fast and quick both describe speed. Basic speed synonym.'
    },
    {
        'subtopic': 'Basic Synonyms',
        'difficulty': 'easy',
        'question': 'Choose: a synonym for "easy".',
        'options': ['Simple', 'Difficult', 'Hard', 'Complex'],
        'correct_answer': 0,
        'explanation': 'Simple means not complicated, like easy. Difficulty synonym.'
    },
    {
        'subtopic': 'Basic Synonyms',
        'difficulty': 'easy',
        'question': 'Which word is a synonym for "pretty"?',
        'options': ['Beautiful', 'Ugly', 'Plain', 'Dull'],
        'correct_answer': 0,
        'explanation': 'Beautiful and pretty both describe attractiveness. Appearance synonym.'
    },
    {
        'subtopic': 'Basic Synonyms',
        'difficulty': 'easy',
        'question': 'Choose: a word that means the same as "talk".',
        'options': ['Speak', 'Listen', 'Hear', 'See'],
        'correct_answer': 0,
        'explanation': 'Speak and talk both mean to use words. Communication synonym.'
    },
    {
        'subtopic': 'Basic Synonyms',
        'difficulty': 'easy',
        'question': 'Which word is a synonym for "small"?',
        'options': ['Tiny', 'Huge', 'Giant', 'Enormous'],
        'correct_answer': 0,
        'explanation': 'Tiny means very small. Size synonym.'
    },
    {
        'subtopic': 'Basic Synonyms',
        'difficulty': 'easy',
        'question': 'Choose: a synonym for "help".',
        'options': ['Assist', 'Hinder', 'Block', 'Stop'],
        'correct_answer': 0,
        'explanation': 'Assist and help both mean to support. Action synonym.'
    },
    {
        'subtopic': 'Basic Synonyms',
        'difficulty': 'easy',
        'question': 'Which word means the same as "smart"?',
        'options': ['Intelligent', 'Stupid', 'Dumb', 'Foolish'],
        'correct_answer': 0,
        'explanation': 'Intelligent and smart both describe cleverness. Quality synonym.'
    },

    # Medium (10Q)
    {
        'subtopic': 'Basic Synonyms',
        'difficulty': 'medium',
        'question': 'Choose: a synonym for "courageous".',
        'options': ['Brave', 'Cowardly', 'Fearful', 'Timid'],
        'correct_answer': 0,
        'explanation': 'Brave and courageous both mean having courage. Character synonym.'
    },
    {
        'subtopic': 'Basic Synonyms',
        'difficulty': 'medium',
        'question': 'Which word is closest in meaning to "accurate"?',
        'options': ['Precise', 'Wrong', 'Vague', 'Unclear'],
        'correct_answer': 0,
        'explanation': 'Precise and accurate both mean exact. Quality synonym.'
    },
    {
        'subtopic': 'Basic Synonyms',
        'difficulty': 'medium',
        'question': 'Choose: a synonym for "ancient".',
        'options': ['Old', 'New', 'Modern', 'Recent'],
        'correct_answer': 0,
        'explanation': 'Old and ancient both refer to great age. Time synonym.'
    },
    {
        'subtopic': 'Basic Synonyms',
        'difficulty': 'medium',
        'question': 'Which word means the same as "wealthy"?',
        'options': ['Rich', 'Poor', 'Broke', 'Needy'],
        'correct_answer': 0,
        'explanation': 'Rich and wealthy both mean having money. Financial synonym.'
    },
    {
        'subtopic': 'Basic Synonyms',
        'difficulty': 'medium',
        'question': 'Choose: a synonym for "prohibit".',
        'options': ['Forbid', 'Allow', 'Permit', 'Enable'],
        'correct_answer': 0,
        'explanation': 'Forbid and prohibit both mean to ban. Action synonym.'
    },
    {
        'subtopic': 'Basic Synonyms',
        'difficulty': 'medium',
        'question': 'Which word is closest to "construct"?',
        'options': ['Build', 'Destroy', 'Demolish', 'Ruin'],
        'correct_answer': 0,
        'explanation': 'Build and construct both mean to create. Action synonym.'
    },
    {
        'subtopic': 'Basic Synonyms',
        'difficulty': 'medium',
        'question': 'Choose: a synonym for "tranquil".',
        'options': ['Peaceful', 'Noisy', 'Chaotic', 'Loud'],
        'correct_answer': 0,
        'explanation': 'Peaceful and tranquil both mean calm. Atmosphere synonym.'
    },
    {
        'subtopic': 'Basic Synonyms',
        'difficulty': 'medium',
        'question': 'Which word means the same as "genuine"?',
        'options': ['Real', 'Fake', 'False', 'Artificial'],
        'correct_answer': 0,
        'explanation': 'Real and genuine both mean authentic. Quality synonym.'
    },
    {
        'subtopic': 'Basic Synonyms',
        'difficulty': 'medium',
        'question': 'Choose: a synonym for "sufficient".',
        'options': ['Enough', 'Lacking', 'Insufficient', 'Inadequate'],
        'correct_answer': 0,
        'explanation': 'Enough and sufficient both mean adequate. Quantity synonym.'
    },
    {
        'subtopic': 'Basic Synonyms',
        'difficulty': 'medium',
        'question': 'Which word is closest to "attempt"?',
        'options': ['Try', 'Quit', 'Abandon', 'Surrender'],
        'correct_answer': 0,
        'explanation': 'Try and attempt both mean to make an effort. Action synonym.'
    },

    # Hard (5Q)
    {
        'subtopic': 'Basic Synonyms',
        'difficulty': 'hard',
        'question': 'Identify: the synonym for "benevolent".',
        'options': ['Kind', 'Cruel', 'Harsh', 'Mean'],
        'correct_answer': 0,
        'explanation': 'Kind and benevolent both mean showing goodwill. Advanced character synonym.'
    },
    {
        'subtopic': 'Basic Synonyms',
        'difficulty': 'hard',
        'question': 'Choose: a synonym for "meticulous".',
        'options': ['Careful', 'Careless', 'Sloppy', 'Messy'],
        'correct_answer': 0,
        'explanation': 'Careful and meticulous both mean paying attention to detail. Advanced quality synonym.'
    },
    {
        'subtopic': 'Basic Synonyms',
        'difficulty': 'hard',
        'question': 'Which word is closest to "eloquent"?',
        'options': ['Articulate', 'Clumsy', 'Awkward', 'Inarticulate'],
        'correct_answer': 0,
        'explanation': 'Articulate and eloquent both mean expressing ideas well. Communication synonym.'
    },
    {
        'subtopic': 'Basic Synonyms',
        'difficulty': 'hard',
        'question': 'Choose: a synonym for "ubiquitous".',
        'options': ['Everywhere', 'Rare', 'Scarce', 'Limited'],
        'correct_answer': 0,
        'explanation': 'Everywhere and ubiquitous both mean present in all places. Advanced location synonym.'
    },
    {
        'subtopic': 'Basic Synonyms',
        'difficulty': 'hard',
        'question': 'Which word means the same as "ephemeral"?',
        'options': ['Temporary', 'Permanent', 'Lasting', 'Eternal'],
        'correct_answer': 0,
        'explanation': 'Temporary and ephemeral both mean short-lived. Advanced time synonym.'
    },

    # Subtopic 2: Basic Antonyms (25Q) - 10 easy, 10 medium, 5 hard
    # Easy (10Q)
    {
        'subtopic': 'Basic Antonyms',
        'difficulty': 'easy',
        'question': 'Choose: the opposite of "hot".',
        'options': ['Cold', 'Warm', 'Boiling', 'Burning'],
        'correct_answer': 0,
        'explanation': 'Cold is the opposite of hot. Temperature antonym.'
    },
    {
        'subtopic': 'Basic Antonyms',
        'difficulty': 'easy',
        'question': 'What is the antonym of "day"?',
        'options': ['Night', 'Morning', 'Afternoon', 'Evening'],
        'correct_answer': 0,
        'explanation': 'Night is the opposite of day. Time antonym.'
    },
    {
        'subtopic': 'Basic Antonyms',
        'difficulty': 'easy',
        'question': 'Choose: the opposite of "up".',
        'options': ['Down', 'Above', 'Top', 'High'],
        'correct_answer': 0,
        'explanation': 'Down is the opposite of up. Direction antonym.'
    },
    {
        'subtopic': 'Basic Antonyms',
        'difficulty': 'easy',
        'question': 'What is the antonym of "old"?',
        'options': ['Young', 'Ancient', 'Aged', 'Elderly'],
        'correct_answer': 0,
        'explanation': 'Young is the opposite of old. Age antonym.'
    },
    {
        'subtopic': 'Basic Antonyms',
        'difficulty': 'easy',
        'question': 'Choose: the opposite of "open".',
        'options': ['Closed', 'Wide', 'Loose', 'Free'],
        'correct_answer': 0,
        'explanation': 'Closed is the opposite of open. State antonym.'
    },
    {
        'subtopic': 'Basic Antonyms',
        'difficulty': 'easy',
        'question': 'What is the antonym of "fast"?',
        'options': ['Slow', 'Quick', 'Rapid', 'Swift'],
        'correct_answer': 0,
        'explanation': 'Slow is the opposite of fast. Speed antonym.'
    },
    {
        'subtopic': 'Basic Antonyms',
        'difficulty': 'easy',
        'question': 'Choose: the opposite of "good".',
        'options': ['Bad', 'Great', 'Excellent', 'Fine'],
        'correct_answer': 0,
        'explanation': 'Bad is the opposite of good. Quality antonym.'
    },
    {
        'subtopic': 'Basic Antonyms',
        'difficulty': 'easy',
        'question': 'What is the antonym of "happy"?',
        'options': ['Sad', 'Joyful', 'Cheerful', 'Glad'],
        'correct_answer': 0,
        'explanation': 'Sad is the opposite of happy. Emotion antonym.'
    },
    {
        'subtopic': 'Basic Antonyms',
        'difficulty': 'easy',
        'question': 'Choose: the opposite of "wet".',
        'options': ['Dry', 'Damp', 'Moist', 'Soaked'],
        'correct_answer': 0,
        'explanation': 'Dry is the opposite of wet. Moisture antonym.'
    },
    {
        'subtopic': 'Basic Antonyms',
        'difficulty': 'easy',
        'question': 'What is the antonym of "strong"?',
        'options': ['Weak', 'Powerful', 'Mighty', 'Robust'],
        'correct_answer': 0,
        'explanation': 'Weak is the opposite of strong. Strength antonym.'
    },

    # Medium (10Q)
    {
        'subtopic': 'Basic Antonyms',
        'difficulty': 'medium',
        'question': 'Choose: the opposite of "generous".',
        'options': ['Selfish', 'Giving', 'Charitable', 'Kind'],
        'correct_answer': 0,
        'explanation': 'Selfish is the opposite of generous. Character antonym.'
    },
    {
        'subtopic': 'Basic Antonyms',
        'difficulty': 'medium',
        'question': 'What is the antonym of "victory"?',
        'options': ['Defeat', 'Success', 'Win', 'Triumph'],
        'correct_answer': 0,
        'explanation': 'Defeat is the opposite of victory. Outcome antonym.'
    },
    {
        'subtopic': 'Basic Antonyms',
        'difficulty': 'medium',
        'question': 'Choose: the opposite of "include".',
        'options': ['Exclude', 'Contain', 'Comprise', 'Involve'],
        'correct_answer': 0,
        'explanation': 'Exclude is the opposite of include. Action antonym.'
    },
    {
        'subtopic': 'Basic Antonyms',
        'difficulty': 'medium',
        'question': 'What is the antonym of "accept"?',
        'options': ['Reject', 'Receive', 'Approve', 'Welcome'],
        'correct_answer': 0,
        'explanation': 'Reject is the opposite of accept. Action antonym.'
    },
    {
        'subtopic': 'Basic Antonyms',
        'difficulty': 'medium',
        'question': 'Choose: the opposite of "expand".',
        'options': ['Contract', 'Grow', 'Enlarge', 'Increase'],
        'correct_answer': 0,
        'explanation': 'Contract is the opposite of expand. Growth antonym.'
    },
    {
        'subtopic': 'Basic Antonyms',
        'difficulty': 'medium',
        'question': 'What is the antonym of "create"?',
        'options': ['Destroy', 'Build', 'Make', 'Form'],
        'correct_answer': 0,
        'explanation': 'Destroy is the opposite of create. Action antonym.'
    },
    {
        'subtopic': 'Basic Antonyms',
        'difficulty': 'medium',
        'question': 'Choose: the opposite of "modern".',
        'options': ['Traditional', 'New', 'Current', 'Contemporary'],
        'correct_answer': 0,
        'explanation': 'Traditional is the opposite of modern. Time period antonym.'
    },
    {
        'subtopic': 'Basic Antonyms',
        'difficulty': 'medium',
        'question': 'What is the antonym of "increase"?',
        'options': ['Decrease', 'Rise', 'Grow', 'Expand'],
        'correct_answer': 0,
        'explanation': 'Decrease is the opposite of increase. Change antonym.'
    },
    {
        'subtopic': 'Basic Antonyms',
        'difficulty': 'medium',
        'question': 'Choose: the opposite of "courage".',
        'options': ['Cowardice', 'Bravery', 'Valor', 'Boldness'],
        'correct_answer': 0,
        'explanation': 'Cowardice is the opposite of courage. Character antonym.'
    },
    {
        'subtopic': 'Basic Antonyms',
        'difficulty': 'medium',
        'question': 'What is the antonym of "frequent"?',
        'options': ['Rare', 'Often', 'Common', 'Usual'],
        'correct_answer': 0,
        'explanation': 'Rare is the opposite of frequent. Frequency antonym.'
    },

    # Hard (5Q)
    {
        'subtopic': 'Basic Antonyms',
        'difficulty': 'hard',
        'question': 'Identify: the opposite of "abundant".',
        'options': ['Scarce', 'Plentiful', 'Ample', 'Copious'],
        'correct_answer': 0,
        'explanation': 'Scarce is the opposite of abundant. Quantity antonym.'
    },
    {
        'subtopic': 'Basic Antonyms',
        'difficulty': 'hard',
        'question': 'Choose: the antonym of "ascend".',
        'options': ['Descend', 'Rise', 'Climb', 'Mount'],
        'correct_answer': 0,
        'explanation': 'Descend is the opposite of ascend. Movement antonym.'
    },
    {
        'subtopic': 'Basic Antonyms',
        'difficulty': 'hard',
        'question': 'What is the opposite of "transparent"?',
        'options': ['Opaque', 'Clear', 'Visible', 'Obvious'],
        'correct_answer': 0,
        'explanation': 'Opaque is the opposite of transparent. Visibility antonym.'
    },
    {
        'subtopic': 'Basic Antonyms',
        'difficulty': 'hard',
        'question': 'Choose: the antonym of "optimistic".',
        'options': ['Pessimistic', 'Hopeful', 'Positive', 'Cheerful'],
        'correct_answer': 0,
        'explanation': 'Pessimistic is the opposite of optimistic. Attitude antonym.'
    },
    {
        'subtopic': 'Basic Antonyms',
        'difficulty': 'hard',
        'question': 'What is the opposite of "conceal"?',
        'options': ['Reveal', 'Hide', 'Cover', 'Mask'],
        'correct_answer': 0,
        'explanation': 'Reveal is the opposite of conceal. Action antonym.'
    },
]

# Continue with Subtopic 3 & 4...
# Subtopic 3: Adjective Pairs (25Q)
adjective_pairs = [
    # Easy (10Q)
    {
        'subtopic': 'Adjective Pairs',
        'difficulty': 'easy',
        'question': 'Choose: the opposite of "clean".',
        'options': ['Dirty', 'Pure', 'Neat', 'Tidy'],
        'correct_answer': 0,
        'explanation': 'Dirty is the opposite of clean. State antonym.'
    },
    {
        'subtopic': 'Adjective Pairs',
        'difficulty': 'easy',
        'question': 'What is the antonym of "hard"?',
        'options': ['Soft', 'Solid', 'Firm', 'Tough'],
        'correct_answer': 0,
        'explanation': 'Soft is the opposite of hard. Texture antonym.'
    },
    {
        'subtopic': 'Adjective Pairs',
        'difficulty': 'easy',
        'question': 'Choose: the opposite of "loud".',
        'options': ['Quiet', 'Noisy', 'Deafening', 'Thunderous'],
        'correct_answer': 0,
        'explanation': 'Quiet is the opposite of loud. Sound antonym.'
    },
    {
        'subtopic': 'Adjective Pairs',
        'difficulty': 'easy',
        'question': 'What is the antonym of "thick"?',
        'options': ['Thin', 'Dense', 'Heavy', 'Wide'],
        'correct_answer': 0,
        'explanation': 'Thin is the opposite of thick. Dimension antonym.'
    },
    {
        'subtopic': 'Adjective Pairs',
        'difficulty': 'easy',
        'question': 'Choose: the opposite of "bright".',
        'options': ['Dark', 'Shiny', 'Brilliant', 'Radiant'],
        'correct_answer': 0,
        'explanation': 'Dark is the opposite of bright. Light antonym.'
    },
    {
        'subtopic': 'Adjective Pairs',
        'difficulty': 'easy',
        'question': 'What is the antonym of "smooth"?',
        'options': ['Rough', 'Sleek', 'Polished', 'Glossy'],
        'correct_answer': 0,
        'explanation': 'Rough is the opposite of smooth. Texture antonym.'
    },
    {
        'subtopic': 'Adjective Pairs',
        'difficulty': 'easy',
        'question': 'Choose: the opposite of "narrow".',
        'options': ['Wide', 'Slim', 'Tight', 'Cramped'],
        'correct_answer': 0,
        'explanation': 'Wide is the opposite of narrow. Width antonym.'
    },
    {
        'subtopic': 'Adjective Pairs',
        'difficulty': 'easy',
        'question': 'What is the antonym of "light" (weight)?',
        'options': ['Heavy', 'Bright', 'Weightless', 'Airy'],
        'correct_answer': 0,
        'explanation': 'Heavy is the opposite of light in weight. Weight antonym.'
    },
    {
        'subtopic': 'Adjective Pairs',
        'difficulty': 'easy',
        'question': 'Choose: the opposite of "shallow".',
        'options': ['Deep', 'Surface', 'Low', 'Flat'],
        'correct_answer': 0,
        'explanation': 'Deep is the opposite of shallow. Depth antonym.'
    },
    {
        'subtopic': 'Adjective Pairs',
        'difficulty': 'easy',
        'question': 'What is the antonym of "empty"?',
        'options': ['Full', 'Vacant', 'Hollow', 'Bare'],
        'correct_answer': 0,
        'explanation': 'Full is the opposite of empty. Capacity antonym.'
    },
    # Medium (10Q)
    {
        'subtopic': 'Adjective Pairs',
        'difficulty': 'medium',
        'question': 'Choose: the opposite of "expensive".',
        'options': ['Cheap', 'Costly', 'Pricey', 'Valuable'],
        'correct_answer': 0,
        'explanation': 'Cheap is the opposite of expensive. Price antonym.'
    },
    {
        'subtopic': 'Adjective Pairs',
        'difficulty': 'medium',
        'question': 'What is the antonym of "public"?',
        'options': ['Private', 'Open', 'Common', 'Shared'],
        'correct_answer': 0,
        'explanation': 'Private is the opposite of public. Access antonym.'
    },
    {
        'subtopic': 'Adjective Pairs',
        'difficulty': 'medium',
        'question': 'Choose: the opposite of "polite".',
        'options': ['Rude', 'Courteous', 'Respectful', 'Mannerly'],
        'correct_answer': 0,
        'explanation': 'Rude is the opposite of polite. Behavior antonym.'
    },
    {
        'subtopic': 'Adjective Pairs',
        'difficulty': 'medium',
        'question': 'What is the antonym of "permanent"?',
        'options': ['Temporary', 'Lasting', 'Enduring', 'Eternal'],
        'correct_answer': 0,
        'explanation': 'Temporary is the opposite of permanent. Duration antonym.'
    },
    {
        'subtopic': 'Adjective Pairs',
        'difficulty': 'medium',
        'question': 'Choose: the opposite of "artificial".',
        'options': ['Natural', 'Fake', 'Synthetic', 'Man-made'],
        'correct_answer': 0,
        'explanation': 'Natural is the opposite of artificial. Origin antonym.'
    },
    {
        'subtopic': 'Adjective Pairs',
        'difficulty': 'medium',
        'question': 'What is the antonym of "guilty"?',
        'options': ['Innocent', 'Culpable', 'Blameworthy', 'Liable'],
        'correct_answer': 0,
        'explanation': 'Innocent is the opposite of guilty. Legal antonym.'
    },
    {
        'subtopic': 'Adjective Pairs',
        'difficulty': 'medium',
        'question': 'Choose: the opposite of "foreign".',
        'options': ['Domestic', 'External', 'Overseas', 'International'],
        'correct_answer': 0,
        'explanation': 'Domestic is the opposite of foreign. Origin antonym.'
    },
    {
        'subtopic': 'Adjective Pairs',
        'difficulty': 'medium',
        'question': 'What is the antonym of "urban"?',
        'options': ['Rural', 'City', 'Metropolitan', 'Municipal'],
        'correct_answer': 0,
        'explanation': 'Rural is the opposite of urban. Location antonym.'
    },
    {
        'subtopic': 'Adjective Pairs',
        'difficulty': 'medium',
        'question': 'Choose: the opposite of "major".',
        'options': ['Minor', 'Important', 'Significant', 'Chief'],
        'correct_answer': 0,
        'explanation': 'Minor is the opposite of major. Importance antonym.'
    },
    {
        'subtopic': 'Adjective Pairs',
        'difficulty': 'medium',
        'question': 'What is the antonym of "visible"?',
        'options': ['Invisible', 'Clear', 'Apparent', 'Obvious'],
        'correct_answer': 0,
        'explanation': 'Invisible is the opposite of visible. Visibility antonym.'
    },
    # Hard (5Q)
    {
        'subtopic': 'Adjective Pairs',
        'difficulty': 'hard',
        'question': 'Identify: the opposite of "ambiguous".',
        'options': ['Clear', 'Vague', 'Unclear', 'Confusing'],
        'correct_answer': 0,
        'explanation': 'Clear is the opposite of ambiguous. Clarity antonym.'
    },
    {
        'subtopic': 'Adjective Pairs',
        'difficulty': 'hard',
        'question': 'Choose: the antonym of "benign".',
        'options': ['Malignant', 'Harmless', 'Gentle', 'Mild'],
        'correct_answer': 0,
        'explanation': 'Malignant is the opposite of benign. Medical/nature antonym.'
    },
    {
        'subtopic': 'Adjective Pairs',
        'difficulty': 'hard',
        'question': 'What is the opposite of "austere"?',
        'options': ['Lavish', 'Simple', 'Plain', 'Bare'],
        'correct_answer': 0,
        'explanation': 'Lavish is the opposite of austere. Style antonym.'
    },
    {
        'subtopic': 'Adjective Pairs',
        'difficulty': 'hard',
        'question': 'Choose: the antonym of "volatile".',
        'options': ['Stable', 'Unstable', 'Changeable', 'Unpredictable'],
        'correct_answer': 0,
        'explanation': 'Stable is the opposite of volatile. Stability antonym.'
    },
    {
        'subtopic': 'Adjective Pairs',
        'difficulty': 'hard',
        'question': 'What is the opposite of "concrete" (abstract vs concrete)?',
        'options': ['Abstract', 'Solid', 'Real', 'Tangible'],
        'correct_answer': 0,
        'explanation': 'Abstract is the opposite of concrete (conceptual vs physical). Concept antonym.'
    },
]

questions.extend(adjective_pairs)

# Subtopic 4: Verb Pairs (25Q)
verb_pairs = [
    # Easy (10Q)
    {
        'subtopic': 'Verb Pairs',
        'difficulty': 'easy',
        'question': 'Choose: the opposite of "push".',
        'options': ['Pull', 'Shove', 'Press', 'Force'],
        'correct_answer': 0,
        'explanation': 'Pull is the opposite of push. Direction verb antonym.'
    },
    {
        'subtopic': 'Verb Pairs',
        'difficulty': 'easy',
        'question': 'What is the antonym of "give"?',
        'options': ['Take', 'Donate', 'Offer', 'Provide'],
        'correct_answer': 0,
        'explanation': 'Take is the opposite of give. Transfer verb antonym.'
    },
    {
        'subtopic': 'Verb Pairs',
        'difficulty': 'easy',
        'question': 'Choose: the opposite of "buy".',
        'options': ['Sell', 'Purchase', 'Acquire', 'Obtain'],
        'correct_answer': 0,
        'explanation': 'Sell is the opposite of buy. Transaction verb antonym.'
    },
    {
        'subtopic': 'Verb Pairs',
        'difficulty': 'easy',
        'question': 'What is the antonym of "remember"?',
        'options': ['Forget', 'Recall', 'Recollect', 'Memorize'],
        'correct_answer': 0,
        'explanation': 'Forget is the opposite of remember. Memory verb antonym.'
    },
    {
        'subtopic': 'Verb Pairs',
        'difficulty': 'easy',
        'question': 'Choose: the opposite of "find".',
        'options': ['Lose', 'Discover', 'Locate', 'Uncover'],
        'correct_answer': 0,
        'explanation': 'Lose is the opposite of find. Discovery verb antonym.'
    },
    {
        'subtopic': 'Verb Pairs',
        'difficulty': 'easy',
        'question': 'What is the antonym of "enter"?',
        'options': ['Exit', 'Go in', 'Come in', 'Arrive'],
        'correct_answer': 0,
        'explanation': 'Exit is the opposite of enter. Movement verb antonym.'
    },
    {
        'subtopic': 'Verb Pairs',
        'difficulty': 'easy',
        'question': 'Choose: the opposite of "love".',
        'options': ['Hate', 'Adore', 'Cherish', 'Treasure'],
        'correct_answer': 0,
        'explanation': 'Hate is the opposite of love. Emotion verb antonym.'
    },
    {
        'subtopic': 'Verb Pairs',
        'difficulty': 'easy',
        'question': 'What is the antonym of "break"?',
        'options': ['Fix', 'Shatter', 'Crack', 'Smash'],
        'correct_answer': 0,
        'explanation': 'Fix is the opposite of break. Repair verb antonym.'
    },
    {
        'subtopic': 'Verb Pairs',
        'difficulty': 'easy',
        'question': 'Choose: the opposite of "laugh".',
        'options': ['Cry', 'Giggle', 'Chuckle', 'Smile'],
        'correct_answer': 0,
        'explanation': 'Cry is the opposite of laugh. Emotion expression verb antonym.'
    },
    {
        'subtopic': 'Verb Pairs',
        'difficulty': 'easy',
        'question': 'What is the antonym of "arrive"?',
        'options': ['Depart', 'Come', 'Reach', 'Get to'],
        'correct_answer': 0,
        'explanation': 'Depart is the opposite of arrive. Journey verb antonym.'
    },
    # Medium (10Q)
    {
        'subtopic': 'Verb Pairs',
        'difficulty': 'medium',
        'question': 'Choose: the opposite of "lend".',
        'options': ['Borrow', 'Loan', 'Advance', 'Provide'],
        'correct_answer': 0,
        'explanation': 'Borrow is the opposite of lend. Transfer verb antonym.'
    },
    {
        'subtopic': 'Verb Pairs',
        'difficulty': 'medium',
        'question': 'What is the antonym of "import"?',
        'options': ['Export', 'Bring in', 'Receive', 'Acquire'],
        'correct_answer': 0,
        'explanation': 'Export is the opposite of import. Trade verb antonym.'
    },
    {
        'subtopic': 'Verb Pairs',
        'difficulty': 'medium',
        'question': 'Choose: the opposite of "praise".',
        'options': ['Criticize', 'Commend', 'Compliment', 'Applaud'],
        'correct_answer': 0,
        'explanation': 'Criticize is the opposite of praise. Evaluation verb antonym.'
    },
    {
        'subtopic': 'Verb Pairs',
        'difficulty': 'medium',
        'question': 'What is the antonym of "inflate"?',
        'options': ['Deflate', 'Expand', 'Blow up', 'Swell'],
        'correct_answer': 0,
        'explanation': 'Deflate is the opposite of inflate. Size change verb antonym.'
    },
    {
        'subtopic': 'Verb Pairs',
        'difficulty': 'medium',
        'question': 'Choose: the opposite of "advance".',
        'options': ['Retreat', 'Progress', 'Move forward', 'Proceed'],
        'correct_answer': 0,
        'explanation': 'Retreat is the opposite of advance. Movement verb antonym.'
    },
    {
        'subtopic': 'Verb Pairs',
        'difficulty': 'medium',
        'question': 'What is the antonym of "combine"?',
        'options': ['Separate', 'Merge', 'Unite', 'Join'],
        'correct_answer': 0,
        'explanation': 'Separate is the opposite of combine. Union verb antonym.'
    },
    {
        'subtopic': 'Verb Pairs',
        'difficulty': 'medium',
        'question': 'Choose: the opposite of "defend".',
        'options': ['Attack', 'Protect', 'Guard', 'Shield'],
        'correct_answer': 0,
        'explanation': 'Attack is the opposite of defend. Action verb antonym.'
    },
    {
        'subtopic': 'Verb Pairs',
        'difficulty': 'medium',
        'question': 'What is the antonym of "accelerate"?',
        'options': ['Decelerate', 'Speed up', 'Hasten', 'Quicken'],
        'correct_answer': 0,
        'explanation': 'Decelerate is the opposite of accelerate. Speed verb antonym.'
    },
    {
        'subtopic': 'Verb Pairs',
        'difficulty': 'medium',
        'question': 'Choose: the opposite of "reveal".',
        'options': ['Conceal', 'Show', 'Expose', 'Disclose'],
        'correct_answer': 0,
        'explanation': 'Conceal is the opposite of reveal. Visibility verb antonym.'
    },
    {
        'subtopic': 'Verb Pairs',
        'difficulty': 'medium',
        'question': 'What is the antonym of "strengthen"?',
        'options': ['Weaken', 'Reinforce', 'Fortify', 'Bolster'],
        'correct_answer': 0,
        'explanation': 'Weaken is the opposite of strengthen. Power verb antonym.'
    },
    # Hard (5Q)
    {
        'subtopic': 'Verb Pairs',
        'difficulty': 'hard',
        'question': 'Identify: the opposite of "alleviate".',
        'options': ['Aggravate', 'Relieve', 'Ease', 'Soothe'],
        'correct_answer': 0,
        'explanation': 'Aggravate is the opposite of alleviate. Impact verb antonym.'
    },
    {
        'subtopic': 'Verb Pairs',
        'difficulty': 'hard',
        'question': 'Choose: the antonym of "exaggerate".',
        'options': ['Understate', 'Overstate', 'Amplify', 'Magnify'],
        'correct_answer': 0,
        'explanation': 'Understate is the opposite of exaggerate. Expression verb antonym.'
    },
    {
        'subtopic': 'Verb Pairs',
        'difficulty': 'hard',
        'question': 'What is the opposite of "accumulate"?',
        'options': ['Disperse', 'Gather', 'Collect', 'Amass'],
        'correct_answer': 0,
        'explanation': 'Disperse is the opposite of accumulate. Collection verb antonym.'
    },
    {
        'subtopic': 'Verb Pairs',
        'difficulty': 'hard',
        'question': 'Choose: the antonym of "ascertain".',
        'options': ['Doubt', 'Confirm', 'Verify', 'Establish'],
        'correct_answer': 0,
        'explanation': 'Doubt is the opposite of ascertain. Certainty verb antonym.'
    },
    {
        'subtopic': 'Verb Pairs',
        'difficulty': 'hard',
        'question': 'What is the opposite of "proliferate"?',
        'options': ['Diminish', 'Multiply', 'Spread', 'Increase'],
        'correct_answer': 0,
        'explanation': 'Diminish is the opposite of proliferate. Growth verb antonym.'
    },
]

questions.extend(verb_pairs)

# Generate SQL
output_lines = [
    "-- Phase 3.2: Synonyms & Antonyms (100 Questions)",
    "-- 4 subtopics: Basic Synonyms, Basic Antonyms, Adjective Pairs, Verb Pairs",
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

with open('output/synonyms-antonyms-100Q.sql', 'w', encoding='utf-8') as f:
    f.write(sql_content)

print("✅ Generated: output/synonyms-antonyms-100Q.sql")
print(f"📊 Total questions: {len(questions)}")
print("\n🔍 Breakdown by subtopic:")
subtopic_counts = {}
for q in questions:
    st = q['subtopic']
    diff = q['difficulty']
    key = f"{st} - {diff}"
    subtopic_counts[key] = subtopic_counts.get(key, 0) + 1

for subtopic in ['Basic Synonyms', 'Basic Antonyms', 'Adjective Pairs', 'Verb Pairs']:
    easy = subtopic_counts.get(f"{subtopic} - easy", 0)
    medium = subtopic_counts.get(f"{subtopic} - medium", 0)
    hard = subtopic_counts.get(f"{subtopic} - hard", 0)
    total = easy + medium + hard
    print(f"  {subtopic}: {total}Q (Easy: {easy}, Medium: {medium}, Hard: {hard})")
