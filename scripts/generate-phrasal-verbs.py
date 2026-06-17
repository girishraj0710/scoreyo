#!/usr/bin/env python3
"""
Generate Phase 3.3: Essential Phrasal Verbs (80Q)
Focus on top 40 most common phrasal verbs only (not exhaustive 230)
4 subtopics × 20Q each (40/40/20 = 8 easy, 8 medium, 4 hard per subtopic)
"""
import json

def escape_sql(text):
    return text.replace("'", "''")

TOPIC_ID = 'essential-phrasal-verbs'
LEVEL = 'intermediate'
PATH_ID = 'foundation'

questions = [
    # Subtopic 1: Daily Use Phrasal Verbs (20Q) - 8 easy, 8 medium, 4 hard
    # Easy (8Q)
    {
        'subtopic': 'Daily Use Phrasal Verbs',
        'difficulty': 'easy',
        'question': 'Choose: the meaning of "wake up".',
        'options': ['Stop sleeping', 'Go to sleep', 'Take a nap', 'Rest'],
        'correct_answer': 0,
        'explanation': 'Wake up means to stop sleeping and become alert. Common daily phrasal verb.'
    },
    {
        'subtopic': 'Daily Use Phrasal Verbs',
        'difficulty': 'easy',
        'question': 'What does "get up" mean?',
        'options': ['Rise from bed or a seat', 'Lie down', 'Sit down', 'Sleep'],
        'correct_answer': 0,
        'explanation': 'Get up means to stand or leave your bed. Morning routine phrasal verb.'
    },
    {
        'subtopic': 'Daily Use Phrasal Verbs',
        'difficulty': 'easy',
        'question': 'Choose: the meaning of "turn on".',
        'options': ['Start a device', 'Stop a device', 'Break a device', 'Fix a device'],
        'correct_answer': 0,
        'explanation': 'Turn on means to activate or start something. Common appliance phrasal verb.'
    },
    {
        'subtopic': 'Daily Use Phrasal Verbs',
        'difficulty': 'easy',
        'question': 'What does "put on" mean?',
        'options': ['Wear clothes', 'Remove clothes', 'Wash clothes', 'Fold clothes'],
        'correct_answer': 0,
        'explanation': 'Put on means to dress yourself in clothing. Dressing phrasal verb.'
    },
    {
        'subtopic': 'Daily Use Phrasal Verbs',
        'difficulty': 'easy',
        'question': 'Choose: the meaning of "sit down".',
        'options': ['Take a seat', 'Stand up', 'Lie down', 'Walk away'],
        'correct_answer': 0,
        'explanation': 'Sit down means to lower yourself into a seated position. Posture phrasal verb.'
    },
    {
        'subtopic': 'Daily Use Phrasal Verbs',
        'difficulty': 'easy',
        'question': 'What does "come back" mean?',
        'options': ['Return', 'Leave', 'Go away', 'Depart'],
        'correct_answer': 0,
        'explanation': 'Come back means to return to a place. Movement phrasal verb.'
    },
    {
        'subtopic': 'Daily Use Phrasal Verbs',
        'difficulty': 'easy',
        'question': 'Choose: the meaning of "look for".',
        'options': ['Search for', 'Find', 'Ignore', 'Hide'],
        'correct_answer': 0,
        'explanation': 'Look for means to try to find something. Search phrasal verb.'
    },
    {
        'subtopic': 'Daily Use Phrasal Verbs',
        'difficulty': 'easy',
        'question': 'What does "turn off" mean?',
        'options': ['Stop a device', 'Start a device', 'Break a device', 'Use a device'],
        'correct_answer': 0,
        'explanation': 'Turn off means to deactivate or stop something. Common appliance phrasal verb.'
    },

    # Medium (8Q)
    {
        'subtopic': 'Daily Use Phrasal Verbs',
        'difficulty': 'medium',
        'question': 'Choose: the meaning of "give up".',
        'options': ['Stop trying', 'Keep trying', 'Start trying', 'Try harder'],
        'correct_answer': 0,
        'explanation': 'Give up means to quit or abandon an effort. Persistence phrasal verb.'
    },
    {
        'subtopic': 'Daily Use Phrasal Verbs',
        'difficulty': 'medium',
        'question': 'What does "find out" mean?',
        'options': ['Discover information', 'Forget information', 'Hide information', 'Ignore information'],
        'correct_answer': 0,
        'explanation': 'Find out means to learn or discover something. Discovery phrasal verb.'
    },
    {
        'subtopic': 'Daily Use Phrasal Verbs',
        'difficulty': 'medium',
        'question': 'Choose: the meaning of "look after".',
        'options': ['Take care of', 'Ignore', 'Abandon', 'Forget'],
        'correct_answer': 0,
        'explanation': 'Look after means to care for someone or something. Responsibility phrasal verb.'
    },
    {
        'subtopic': 'Daily Use Phrasal Verbs',
        'difficulty': 'medium',
        'question': 'What does "break down" mean (for machines)?',
        'options': ['Stop working', 'Start working', 'Work better', 'Work faster'],
        'correct_answer': 0,
        'explanation': 'Break down means to stop functioning. Malfunction phrasal verb.'
    },
    {
        'subtopic': 'Daily Use Phrasal Verbs',
        'difficulty': 'medium',
        'question': 'Choose: the meaning of "take off" (clothes).',
        'options': ['Remove clothing', 'Put on clothing', 'Wash clothing', 'Iron clothing'],
        'correct_answer': 0,
        'explanation': 'Take off means to remove what you are wearing. Dressing phrasal verb.'
    },
    {
        'subtopic': 'Daily Use Phrasal Verbs',
        'difficulty': 'medium',
        'question': 'What does "run out of" mean?',
        'options': ['Have no more left', 'Have too much', 'Buy more', 'Save some'],
        'correct_answer': 0,
        'explanation': 'Run out of means to use up all of something. Depletion phrasal verb.'
    },
    {
        'subtopic': 'Daily Use Phrasal Verbs',
        'difficulty': 'medium',
        'question': 'Choose: the meaning of "go on".',
        'options': ['Continue', 'Stop', 'Pause', 'End'],
        'correct_answer': 0,
        'explanation': 'Go on means to continue or proceed. Action phrasal verb.'
    },
    {
        'subtopic': 'Daily Use Phrasal Verbs',
        'difficulty': 'medium',
        'question': 'What does "pick up" mean (objects)?',
        'options': ['Lift something', 'Drop something', 'Throw something', 'Break something'],
        'correct_answer': 0,
        'explanation': 'Pick up means to lift or collect something. Physical action phrasal verb.'
    },

    # Hard (4Q)
    {
        'subtopic': 'Daily Use Phrasal Verbs',
        'difficulty': 'hard',
        'question': 'Identify: the difference between "look at" and "look for".',
        'options': ['"Look at" is observe, "look for" is search', 'They mean the same', '"Look at" is search, "look for" is observe', 'Both mean ignore'],
        'correct_answer': 0,
        'explanation': 'Look at means to observe; look for means to search. Nuanced phrasal verb distinction.'
    },
    {
        'subtopic': 'Daily Use Phrasal Verbs',
        'difficulty': 'hard',
        'question': 'Choose: the phrasal verb meaning "to resemble a family member".',
        'options': ['Take after', 'Take off', 'Take on', 'Take over'],
        'correct_answer': 0,
        'explanation': 'Take after means to resemble or act like a family member. Similarity phrasal verb.'
    },
    {
        'subtopic': 'Daily Use Phrasal Verbs',
        'difficulty': 'hard',
        'question': 'What does "put up with" mean?',
        'options': ['Tolerate', 'Reject', 'Avoid', 'Escape'],
        'correct_answer': 0,
        'explanation': 'Put up with means to endure or tolerate something unpleasant. Three-word phrasal verb.'
    },
    {
        'subtopic': 'Daily Use Phrasal Verbs',
        'difficulty': 'hard',
        'question': 'Choose: the phrasal verb that means "to invent or fabricate".',
        'options': ['Make up', 'Make out', 'Make for', 'Make do'],
        'correct_answer': 0,
        'explanation': 'Make up means to invent a story or excuse. Multiple-meaning phrasal verb (also: reconcile, apply cosmetics).'
    },

    # Subtopic 2: Movement & Direction (20Q) - 8 easy, 8 medium, 4 hard
    # Easy (8Q)
    {
        'subtopic': 'Movement & Direction',
        'difficulty': 'easy',
        'question': 'Choose: the meaning of "go up".',
        'options': ['Move higher', 'Move lower', 'Stay still', 'Move sideways'],
        'correct_answer': 0,
        'explanation': 'Go up means to ascend or increase. Direction phrasal verb.'
    },
    {
        'subtopic': 'Movement & Direction',
        'difficulty': 'easy',
        'question': 'What does "come in" mean?',
        'options': ['Enter', 'Exit', 'Leave', 'Stay outside'],
        'correct_answer': 0,
        'explanation': 'Come in means to enter a place. Entry phrasal verb.'
    },
    {
        'subtopic': 'Movement & Direction',
        'difficulty': 'easy',
        'question': 'Choose: the meaning of "go out".',
        'options': ['Leave a place', 'Enter a place', 'Stay inside', 'Return home'],
        'correct_answer': 0,
        'explanation': 'Go out means to exit or leave. Exit phrasal verb (also: socialize outside home).'
    },
    {
        'subtopic': 'Movement & Direction',
        'difficulty': 'easy',
        'question': 'What does "walk away" mean?',
        'options': ['Leave by walking', 'Come closer', 'Stand still', 'Sit down'],
        'correct_answer': 0,
        'explanation': 'Walk away means to depart on foot. Movement phrasal verb.'
    },
    {
        'subtopic': 'Movement & Direction',
        'difficulty': 'easy',
        'question': 'Choose: the meaning of "stand up".',
        'options': ['Rise to feet', 'Sit down', 'Lie down', 'Bend down'],
        'correct_answer': 0,
        'explanation': 'Stand up means to rise from sitting or lying. Posture phrasal verb.'
    },
    {
        'subtopic': 'Movement & Direction',
        'difficulty': 'easy',
        'question': 'What does "fall down" mean?',
        'options': ['Drop to the ground', 'Stand up', 'Jump up', 'Climb up'],
        'correct_answer': 0,
        'explanation': 'Fall down means to collapse or drop. Gravity phrasal verb.'
    },
    {
        'subtopic': 'Movement & Direction',
        'difficulty': 'easy',
        'question': 'Choose: the meaning of "move away".',
        'options': ['Go to a different place', 'Stay in same place', 'Come closer', 'Return home'],
        'correct_answer': 0,
        'explanation': 'Move away means to relocate elsewhere. Relocation phrasal verb.'
    },
    {
        'subtopic': 'Movement & Direction',
        'difficulty': 'easy',
        'question': 'What does "run away" mean?',
        'options': ['Escape quickly', 'Approach slowly', 'Stand still', 'Walk slowly'],
        'correct_answer': 0,
        'explanation': 'Run away means to flee or escape. Escape phrasal verb.'
    },

    # Medium (8Q)
    {
        'subtopic': 'Movement & Direction',
        'difficulty': 'medium',
        'question': 'Choose: the meaning of "get on" (transport).',
        'options': ['Board a vehicle', 'Exit a vehicle', 'Drive a vehicle', 'Park a vehicle'],
        'correct_answer': 0,
        'explanation': 'Get on means to board public transport (bus, train, plane). Transport phrasal verb.'
    },
    {
        'subtopic': 'Movement & Direction',
        'difficulty': 'medium',
        'question': 'What does "drop off" mean?',
        'options': ['Leave someone at a place', 'Pick someone up', 'Forget someone', 'Meet someone'],
        'correct_answer': 0,
        'explanation': 'Drop off means to deliver or leave someone somewhere. Transport phrasal verb.'
    },
    {
        'subtopic': 'Movement & Direction',
        'difficulty': 'medium',
        'question': 'Choose: the meaning of "set off".',
        'options': ['Begin a journey', 'End a journey', 'Cancel a journey', 'Postpone a journey'],
        'correct_answer': 0,
        'explanation': 'Set off means to start traveling. Journey phrasal verb.'
    },
    {
        'subtopic': 'Movement & Direction',
        'difficulty': 'medium',
        'question': 'What does "turn around" mean?',
        'options': ['Face the opposite direction', 'Keep going forward', 'Stop moving', 'Speed up'],
        'correct_answer': 0,
        'explanation': 'Turn around means to rotate 180 degrees. Direction phrasal verb.'
    },
    {
        'subtopic': 'Movement & Direction',
        'difficulty': 'medium',
        'question': 'Choose: the meaning of "pull over" (driving).',
        'options': ['Stop at roadside', 'Drive faster', 'Change lanes', 'U-turn'],
        'correct_answer': 0,
        'explanation': 'Pull over means to stop your car at the side of the road. Driving phrasal verb.'
    },
    {
        'subtopic': 'Movement & Direction',
        'difficulty': 'medium',
        'question': 'What does "catch up with" mean?',
        'options': ['Reach someone ahead', 'Fall behind', 'Stay in same place', 'Go backward'],
        'correct_answer': 0,
        'explanation': 'Catch up with means to reach someone who is ahead of you. Pursuit phrasal verb.'
    },
    {
        'subtopic': 'Movement & Direction',
        'difficulty': 'medium',
        'question': 'Choose: the meaning of "slow down".',
        'options': ['Reduce speed', 'Increase speed', 'Stop completely', 'Maintain speed'],
        'correct_answer': 0,
        'explanation': 'Slow down means to decrease velocity. Speed phrasal verb.'
    },
    {
        'subtopic': 'Movement & Direction',
        'difficulty': 'medium',
        'question': 'What does "head back" mean?',
        'options': ['Return to starting point', 'Go forward', 'Stop moving', 'Change direction'],
        'correct_answer': 0,
        'explanation': 'Head back means to return to where you came from. Return phrasal verb.'
    },

    # Hard (4Q)
    {
        'subtopic': 'Movement & Direction',
        'difficulty': 'hard',
        'question': 'Identify: the difference between "get in" and "get on".',
        'options': ['"Get in" for cars, "get on" for buses/trains', 'They are identical', '"Get in" for buses, "get on" for cars', 'Both mean exit'],
        'correct_answer': 0,
        'explanation': 'Get in is for enclosed vehicles (cars, taxis); get on is for public transport (buses, trains, planes). Transport phrasal verb distinction.'
    },
    {
        'subtopic': 'Movement & Direction',
        'difficulty': 'hard',
        'question': 'Choose: the phrasal verb meaning "to visit briefly while traveling".',
        'options': ['Stop by', 'Stop over', 'Stop off', 'Stop at'],
        'correct_answer': 0,
        'explanation': 'Stop by means to visit someone briefly. Casual visit phrasal verb (also: stop in).'
    },
    {
        'subtopic': 'Movement & Direction',
        'difficulty': 'hard',
        'question': 'What does "branch off" mean?',
        'options': ['Separate from main path', 'Stay on main path', 'Go backwards', 'Stop moving'],
        'correct_answer': 0,
        'explanation': 'Branch off means to diverge or separate from a main route. Navigation phrasal verb.'
    },
    {
        'subtopic': 'Movement & Direction',
        'difficulty': 'hard',
        'question': 'Choose: the phrasal verb for "to explode or launch suddenly".',
        'options': ['Take off', 'Take on', 'Take over', 'Take up'],
        'correct_answer': 0,
        'explanation': 'Take off means to leave the ground (planes) or to depart suddenly. Multiple-meaning phrasal verb (also: remove clothes, become successful).'
    },

    # Subtopic 3: Communication & Relationships (20Q) - 8 easy, 8 medium, 4 hard
    # Easy (8Q)
    {
        'subtopic': 'Communication & Relationships',
        'difficulty': 'easy',
        'question': 'Choose: the meaning of "hang up".',
        'options': ['End a phone call', 'Start a call', 'Continue talking', 'Answer a call'],
        'correct_answer': 0,
        'explanation': 'Hang up means to end a telephone conversation. Phone phrasal verb.'
    },
    {
        'subtopic': 'Communication & Relationships',
        'difficulty': 'easy',
        'question': 'What does "call back" mean?',
        'options': ['Phone again', 'Hang up', 'Ignore a call', 'Block a number'],
        'correct_answer': 0,
        'explanation': 'Call back means to return a phone call. Phone phrasal verb.'
    },
    {
        'subtopic': 'Communication & Relationships',
        'difficulty': 'easy',
        'question': 'Choose: the meaning of "speak up".',
        'options': ['Talk louder', 'Talk quietly', 'Stop talking', 'Whisper'],
        'correct_answer': 0,
        'explanation': 'Speak up means to talk more loudly or express your opinion. Communication phrasal verb.'
    },
    {
        'subtopic': 'Communication & Relationships',
        'difficulty': 'easy',
        'question': 'What does "shut up" mean (informal)?',
        'options': ['Stop talking', 'Start talking', 'Talk louder', 'Speak clearly'],
        'correct_answer': 0,
        'explanation': 'Shut up means to be quiet (informal/rude). Silence phrasal verb.'
    },
    {
        'subtopic': 'Communication & Relationships',
        'difficulty': 'easy',
        'question': 'Choose: the meaning of "ask out".',
        'options': ['Invite on a date', 'Reject someone', 'Argue with', 'Ignore someone'],
        'correct_answer': 0,
        'explanation': 'Ask out means to invite someone on a romantic date. Dating phrasal verb.'
    },
    {
        'subtopic': 'Communication & Relationships',
        'difficulty': 'easy',
        'question': 'What does "break up" mean (relationships)?',
        'options': ['End a relationship', 'Start dating', 'Get married', 'Fall in love'],
        'correct_answer': 0,
        'explanation': 'Break up means to end a romantic relationship. Relationship phrasal verb.'
    },
    {
        'subtopic': 'Communication & Relationships',
        'difficulty': 'easy',
        'question': 'Choose: the meaning of "get along".',
        'options': ['Have a good relationship', 'Argue constantly', 'Ignore each other', 'Disagree'],
        'correct_answer': 0,
        'explanation': 'Get along means to have a friendly relationship. Harmony phrasal verb.'
    },
    {
        'subtopic': 'Communication & Relationships',
        'difficulty': 'easy',
        'question': 'What does "make friends" mean?',
        'options': ['Form friendships', 'Lose friends', 'Avoid people', 'Argue with people'],
        'correct_answer': 0,
        'explanation': 'Make friends means to become friends with someone. Social phrasal verb.'
    },

    # Medium (8Q)
    {
        'subtopic': 'Communication & Relationships',
        'difficulty': 'medium',
        'question': 'Choose: the meaning of "bring up" (topic).',
        'options': ['Introduce a topic', 'Avoid a topic', 'Forget a topic', 'Ignore a topic'],
        'correct_answer': 0,
        'explanation': 'Bring up means to introduce or mention a subject. Conversation phrasal verb (also: raise children).'
    },
    {
        'subtopic': 'Communication & Relationships',
        'difficulty': 'medium',
        'question': 'What does "fall out" mean (friends)?',
        'options': ['Have an argument', 'Become closer', 'Make peace', 'Agree completely'],
        'correct_answer': 0,
        'explanation': 'Fall out means to have a disagreement and stop being friends. Conflict phrasal verb.'
    },
    {
        'subtopic': 'Communication & Relationships',
        'difficulty': 'medium',
        'question': 'Choose: the meaning of "make up" (after argument).',
        'options': ['Reconcile', 'Continue arguing', 'Avoid each other', 'Stay angry'],
        'correct_answer': 0,
        'explanation': 'Make up means to become friends again after a fight. Reconciliation phrasal verb.'
    },
    {
        'subtopic': 'Communication & Relationships',
        'difficulty': 'medium',
        'question': 'What does "stand up for" mean?',
        'options': ['Defend or support', 'Criticize', 'Ignore', 'Abandon'],
        'correct_answer': 0,
        'explanation': 'Stand up for means to defend someone or something. Support phrasal verb.'
    },
    {
        'subtopic': 'Communication & Relationships',
        'difficulty': 'medium',
        'question': 'Choose: the meaning of "let down".',
        'options': ['Disappoint', 'Encourage', 'Support', 'Help'],
        'correct_answer': 0,
        'explanation': 'Let down means to disappoint someone. Disappointment phrasal verb.'
    },
    {
        'subtopic': 'Communication & Relationships',
        'difficulty': 'medium',
        'question': 'What does "count on" mean?',
        'options': ['Rely on', 'Distrust', 'Ignore', 'Avoid'],
        'correct_answer': 0,
        'explanation': 'Count on means to depend on or trust someone. Trust phrasal verb.'
    },
    {
        'subtopic': 'Communication & Relationships',
        'difficulty': 'medium',
        'question': 'Choose: the meaning of "open up" (emotions).',
        'options': ['Share feelings', 'Hide feelings', 'Ignore feelings', 'Suppress feelings'],
        'correct_answer': 0,
        'explanation': 'Open up means to share your thoughts and feelings. Emotional expression phrasal verb.'
    },
    {
        'subtopic': 'Communication & Relationships',
        'difficulty': 'medium',
        'question': 'What does "look up to" mean?',
        'options': ['Admire and respect', 'Disrespect', 'Ignore', 'Look down on'],
        'correct_answer': 0,
        'explanation': 'Look up to means to respect and admire someone. Respect phrasal verb.'
    },

    # Hard (4Q)
    {
        'subtopic': 'Communication & Relationships',
        'difficulty': 'hard',
        'question': 'Identify: the difference between "tell off" and "tell on".',
        'options': ['"Tell off" is scold, "tell on" is report to authority', 'They mean the same', '"Tell off" is praise, "tell on" is compliment', 'Both mean ignore'],
        'correct_answer': 0,
        'explanation': 'Tell off means to reprimand; tell on means to report someone''s misbehavior. Authority-related phrasal verb pair.'
    },
    {
        'subtopic': 'Communication & Relationships',
        'difficulty': 'hard',
        'question': 'Choose: the phrasal verb meaning "to gradually stop communicating".',
        'options': ['Drift apart', 'Grow closer', 'Stay connected', 'Remain friends'],
        'correct_answer': 0,
        'explanation': 'Drift apart means to become less close over time. Relationship distance phrasal verb.'
    },
    {
        'subtopic': 'Communication & Relationships',
        'difficulty': 'hard',
        'question': 'What does "patch things up" mean?',
        'options': ['Repair a relationship', 'End a relationship', 'Avoid someone', 'Start an argument'],
        'correct_answer': 0,
        'explanation': 'Patch things up means to resolve a conflict and restore a relationship. Repair phrasal verb.'
    },
    {
        'subtopic': 'Communication & Relationships',
        'difficulty': 'hard',
        'question': 'Choose: the phrasal verb for "to manipulate or deceive".',
        'options': ['Take in', 'Take on', 'Take off', 'Take over'],
        'correct_answer': 0,
        'explanation': 'Take in means to deceive or trick someone. Deception phrasal verb (also: understand, provide shelter).'
    },

    # Subtopic 4: Problem Solving (20Q) - 8 easy, 8 medium, 4 hard
    # Easy (8Q)
    {
        'subtopic': 'Problem Solving',
        'difficulty': 'easy',
        'question': 'Choose: the meaning of "work out" (problem).',
        'options': ['Solve', 'Create', 'Ignore', 'Forget'],
        'correct_answer': 0,
        'explanation': 'Work out means to solve or find a solution. Problem-solving phrasal verb (also: exercise).'
    },
    {
        'subtopic': 'Problem Solving',
        'difficulty': 'easy',
        'question': 'What does "figure out" mean?',
        'options': ['Understand or solve', 'Confuse', 'Complicate', 'Forget'],
        'correct_answer': 0,
        'explanation': 'Figure out means to understand or solve a problem. Comprehension phrasal verb.'
    },
    {
        'subtopic': 'Problem Solving',
        'difficulty': 'easy',
        'question': 'Choose: the meaning of "clean up".',
        'options': ['Tidy or organize', 'Make messy', 'Destroy', 'Scatter'],
        'correct_answer': 0,
        'explanation': 'Clean up means to make something tidy. Cleaning phrasal verb.'
    },
    {
        'subtopic': 'Problem Solving',
        'difficulty': 'easy',
        'question': 'What does "throw away" mean?',
        'options': ['Discard', 'Keep', 'Save', 'Collect'],
        'correct_answer': 0,
        'explanation': 'Throw away means to dispose of something. Disposal phrasal verb.'
    },
    {
        'subtopic': 'Problem Solving',
        'difficulty': 'easy',
        'question': 'Choose: the meaning of "fill in" (forms).',
        'options': ['Complete', 'Delete', 'Ignore', 'Skip'],
        'correct_answer': 0,
        'explanation': 'Fill in means to complete a form or blank space. Documentation phrasal verb.'
    },
    {
        'subtopic': 'Problem Solving',
        'difficulty': 'easy',
        'question': 'What does "fix up" mean?',
        'options': ['Repair or renovate', 'Break', 'Destroy', 'Damage'],
        'correct_answer': 0,
        'explanation': 'Fix up means to repair or improve something. Repair phrasal verb.'
    },
    {
        'subtopic': 'Problem Solving',
        'difficulty': 'easy',
        'question': 'Choose: the meaning of "sort out".',
        'options': ['Organize or resolve', 'Mess up', 'Confuse', 'Complicate'],
        'correct_answer': 0,
        'explanation': 'Sort out means to organize or solve a problem. Organization phrasal verb.'
    },
    {
        'subtopic': 'Problem Solving',
        'difficulty': 'easy',
        'question': 'What does "clear up" mean (confusion)?',
        'options': ['Clarify', 'Confuse', 'Complicate', 'Obscure'],
        'correct_answer': 0,
        'explanation': 'Clear up means to explain or resolve confusion. Clarification phrasal verb (also: weather improving).'
    },

    # Medium (8Q)
    {
        'subtopic': 'Problem Solving',
        'difficulty': 'medium',
        'question': 'Choose: the meaning of "deal with".',
        'options': ['Handle or manage', 'Avoid', 'Ignore', 'Escape'],
        'correct_answer': 0,
        'explanation': 'Deal with means to handle or take action on something. Management phrasal verb.'
    },
    {
        'subtopic': 'Problem Solving',
        'difficulty': 'medium',
        'question': 'What does "carry out" mean?',
        'options': ['Execute or complete', 'Cancel', 'Postpone', 'Avoid'],
        'correct_answer': 0,
        'explanation': 'Carry out means to perform or complete a task. Execution phrasal verb.'
    },
    {
        'subtopic': 'Problem Solving',
        'difficulty': 'medium',
        'question': 'Choose: the meaning of "come up with".',
        'options': ['Think of an idea', 'Forget an idea', 'Reject an idea', 'Ignore an idea'],
        'correct_answer': 0,
        'explanation': 'Come up with means to think of or create an idea. Creativity phrasal verb.'
    },
    {
        'subtopic': 'Problem Solving',
        'difficulty': 'medium',
        'question': 'What does "fall through" mean (plans)?',
        'options': ['Fail to happen', 'Succeed', 'Proceed as planned', 'Improve'],
        'correct_answer': 0,
        'explanation': 'Fall through means when plans fail or don''t happen. Failure phrasal verb.'
    },
    {
        'subtopic': 'Problem Solving',
        'difficulty': 'medium',
        'question': 'Choose: the meaning of "cut down on".',
        'options': ['Reduce', 'Increase', 'Maintain', 'Expand'],
        'correct_answer': 0,
        'explanation': 'Cut down on means to reduce the amount of something. Reduction phrasal verb.'
    },
    {
        'subtopic': 'Problem Solving',
        'difficulty': 'medium',
        'question': 'What does "put off" mean (delay)?',
        'options': ['Postpone', 'Advance', 'Do immediately', 'Complete early'],
        'correct_answer': 0,
        'explanation': 'Put off means to delay or postpone. Procrastination phrasal verb.'
    },
    {
        'subtopic': 'Problem Solving',
        'difficulty': 'medium',
        'question': 'Choose: the meaning of "get rid of".',
        'options': ['Eliminate', 'Keep', 'Collect', 'Save'],
        'correct_answer': 0,
        'explanation': 'Get rid of means to dispose of or remove. Elimination phrasal verb.'
    },
    {
        'subtopic': 'Problem Solving',
        'difficulty': 'medium',
        'question': 'What does "go through" mean (examine)?',
        'options': ['Review carefully', 'Skip', 'Ignore', 'Forget'],
        'correct_answer': 0,
        'explanation': 'Go through means to examine or review something. Review phrasal verb (also: experience difficulty).'
    },

    # Hard (4Q)
    {
        'subtopic': 'Problem Solving',
        'difficulty': 'hard',
        'question': 'Identify: the difference between "think over" and "think through".',
        'options': ['"Think over" is consider, "think through" is analyze fully', 'They are identical', '"Think over" is ignore, "think through" is forget', 'Both mean reject'],
        'correct_answer': 0,
        'explanation': 'Think over means to consider carefully; think through means to analyze all aspects completely. Nuanced thinking phrasal verb pair.'
    },
    {
        'subtopic': 'Problem Solving',
        'difficulty': 'hard',
        'question': 'Choose: the phrasal verb meaning "to compensate for".',
        'options': ['Make up for', 'Make out', 'Make of', 'Make off'],
        'correct_answer': 0,
        'explanation': 'Make up for means to compensate or provide something in return. Compensation phrasal verb.'
    },
    {
        'subtopic': 'Problem Solving',
        'difficulty': 'hard',
        'question': 'What does "pull through" mean?',
        'options': ['Survive a difficulty', 'Give up', 'Fail', 'Surrender'],
        'correct_answer': 0,
        'explanation': 'Pull through means to recover from illness or survive a difficult situation. Survival phrasal verb.'
    },
    {
        'subtopic': 'Problem Solving',
        'difficulty': 'hard',
        'question': 'Choose: the phrasal verb for "to investigate thoroughly".',
        'options': ['Look into', 'Look after', 'Look for', 'Look up'],
        'correct_answer': 0,
        'explanation': 'Look into means to investigate or examine something carefully. Investigation phrasal verb.'
    },
]

# Generate SQL
output_lines = [
    "-- Phase 3.3: Essential Phrasal Verbs (80 Questions)",
    "-- 4 subtopics: Daily Use, Movement & Direction, Communication & Relationships, Problem Solving",
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

with open('output/essential-phrasal-verbs-80Q.sql', 'w', encoding='utf-8') as f:
    f.write(sql_content)

print("✅ Generated: output/essential-phrasal-verbs-80Q.sql")
print(f"📊 Total questions: {len(questions)}")
print("\n🔍 Breakdown by subtopic:")
subtopic_counts = {}
for q in questions:
    st = q['subtopic']
    diff = q['difficulty']
    key = f"{st} - {diff}"
    subtopic_counts[key] = subtopic_counts.get(key, 0) + 1

for subtopic in ['Daily Use Phrasal Verbs', 'Movement & Direction', 'Communication & Relationships', 'Problem Solving']:
    easy = subtopic_counts.get(f"{subtopic} - easy", 0)
    medium = subtopic_counts.get(f"{subtopic} - medium", 0)
    hard = subtopic_counts.get(f"{subtopic} - hard", 0)
    total = easy + medium + hard
    print(f"  {subtopic}: {total}Q (Easy: {easy}, Medium: {medium}, Hard: {hard})")
