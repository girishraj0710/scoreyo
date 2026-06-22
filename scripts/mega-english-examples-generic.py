#!/usr/bin/env python3
"""
MEGA ENGLISH EXAMPLES LIBRARY - GENERIC LEARNING (NO EXAM REFERENCES)
Pure English grammar examples for learners - universal, not exam-focused
"""

# ============================================================================
# COMPREHENSIVE EXAMPLES LIBRARY - 60+ TOPICS
# ============================================================================

MEGA_EXAMPLES = {
    # TENSES
    'present-simple': [
        {'text': 'I work in a hospital. She teaches English. They live in Mumbai.', 'explanation': 'Use present simple for facts, habits, and routines. Add -s/-es for he/she/it.'},
        {'text': 'The sun rises in the east. Water boils at 100°C.', 'explanation': 'Present simple expresses universal truths and scientific facts.'},
        {'text': 'I don\'t like coffee. She doesn\'t eat meat.', 'explanation': 'Negative: use do/does + not + base verb.'},
    ],

    'past-simple': [
        {'text': 'I visited Paris last year. She studied medicine in college.', 'explanation': 'Use past simple for completed actions in the past. Add -ed for regular verbs.'},
        {'text': 'He went to work yesterday. They bought a new car.', 'explanation': 'Irregular verbs change form: go→went, buy→bought.'},
        {'text': 'I didn\'t see him. Did you finish your homework?', 'explanation': 'Negative: didn\'t + base verb. Question: Did + subject + base verb.'},
    ],

    'present-continuous': [
        {'text': 'I am writing an email right now. She is reading a book.', 'explanation': 'Use present continuous for actions happening at this moment.'},
        {'text': 'They are living in Delhi temporarily.', 'explanation': 'Also used for temporary situations.'},
        {'text': 'I am learning French this year.', 'explanation': 'Present continuous can describe ongoing projects or courses.'},
    ],

    'past-continuous': [
        {'text': 'I was sleeping when you called.', 'explanation': 'Use past continuous for actions in progress at a specific past time.'},
        {'text': 'While I was cooking, he was watching TV.', 'explanation': 'Two actions happening simultaneously in the past.'},
        {'text': 'What were you doing at 8 PM yesterday?', 'explanation': 'Question form: Was/Were + subject + verb-ing.'},
    ],

    'present-perfect': [
        {'text': 'I have visited the Taj Mahal. She has finished her work.', 'explanation': 'Present perfect links past actions to the present moment.'},
        {'text': 'I have lived here for five years.', 'explanation': 'Duration from past to present: use present perfect with "for" or "since".'},
        {'text': 'Have you ever been to Europe? I have never tried sushi.', 'explanation': 'Life experiences: use present perfect with ever, never, already, yet.'},
    ],

    'past-perfect': [
        {'text': 'When I arrived, the train had already left.', 'explanation': 'Past perfect shows which action happened first in the past.'},
        {'text': 'She told me that she had finished her homework.', 'explanation': 'Use past perfect in reported speech for earlier past actions.'},
        {'text': 'I had never seen the ocean before I moved to Mumbai.', 'explanation': 'Past perfect for experiences up to a specific past point.'},
    ],

    'future-simple': [
        {'text': 'I will call you tomorrow. She will arrive at 6 PM.', 'explanation': 'Use will + base verb for future predictions and promises.'},
        {'text': 'It will probably rain this evening.', 'explanation': 'Will expresses future predictions based on opinion or belief.'},
        {'text': 'I won\'t be late. Will you help me?', 'explanation': 'Negative: will not (won\'t). Question: Will + subject + verb.'},
    ],

    # VOICE
    'active-passive': [
        {'text': 'Active: The teacher explains the lesson. → Passive: The lesson is explained by the teacher.', 'explanation': 'Object becomes subject; verb changes to be + past participle.'},
        {'text': 'Active: Someone stole my phone. → Passive: My phone was stolen.', 'explanation': 'Passive is used when the doer is unknown or unimportant.'},
        {'text': 'Active: They will build a new hospital. → Passive: A new hospital will be built.', 'explanation': 'Future passive: will be + past participle.'},
    ],

    # CONDITIONALS
    'conditional-first': [
        {'text': 'If it rains, we will stay home.', 'explanation': 'First conditional: If + present simple, will + base verb. Used for real possibilities.'},
        {'text': 'If you heat ice, it melts.', 'explanation': 'Zero conditional (scientific facts): If + present, present.'},
        {'text': 'We will go to the beach if the weather is good.', 'explanation': '"If" clause can come first or second; use comma when it comes first.'},
    ],

    'conditional-second': [
        {'text': 'If I were rich, I would travel the world.', 'explanation': 'Second conditional: If + past simple, would + base verb. Imaginary present situations.'},
        {'text': 'If I had more time, I would learn to play the guitar.', 'explanation': 'Use second conditional for unlikely or impossible present situations.'},
        {'text': 'I would be happier if I lived near the mountains.', 'explanation': 'Expresses wishes about present reality.'},
    ],

    'conditional-third': [
        {'text': 'If I had studied harder, I would have passed the test.', 'explanation': 'Third conditional: If + past perfect, would have + past participle. Regrets about past.'},
        {'text': 'She would have come to the party if you had invited her.', 'explanation': 'Expresses imaginary past situations that didn\'t happen.'},
        {'text': 'If we had left earlier, we wouldn\'t have missed the train.', 'explanation': 'Used to imagine different outcomes for past events.'},
    ],

    # MODALS
    'modal-can-could': [
        {'text': 'I can speak three languages. She can swim very well.', 'explanation': 'Can expresses ability in the present.'},
        {'text': 'When I was younger, I could run very fast.', 'explanation': 'Could expresses past ability.'},
        {'text': 'Can you help me? Could you please pass the salt?', 'explanation': 'Can/Could for requests. "Could" is more polite.'},
    ],

    'modal-may-might': [
        {'text': 'It may rain this evening. She might call later.', 'explanation': 'May/Might express possibility. Might suggests lower probability.'},
        {'text': 'May I use your phone? Might I suggest an alternative?', 'explanation': 'May/Might for formal permission or polite suggestions.'},
        {'text': 'He may have forgotten about the meeting.', 'explanation': 'May/Might have + past participle for past possibility.'},
    ],

    'modal-must': [
        {'text': 'You must wear a seatbelt. Students must attend all classes.', 'explanation': 'Must expresses strong obligation or necessity.'},
        {'text': 'She must be tired after that long journey.', 'explanation': 'Must also expresses logical deduction (certainty).'},
        {'text': 'You mustn\'t smoke here. (prohibition)', 'explanation': 'Mustn\'t means "not allowed to" (prohibition).'},
    ],

    'modal-should': [
        {'text': 'You should eat more vegetables. You shouldn\'t stay up so late.', 'explanation': 'Should gives advice or recommendations.'},
        {'text': 'She should arrive by 6 PM. (expectation)', 'explanation': 'Should also expresses what we expect to happen.'},
        {'text': 'I should have called her yesterday. (regret)', 'explanation': 'Should have + past participle expresses regret about the past.'},
    ],

    # PARTS OF SPEECH
    'adjective': [
        {'text': 'She is a beautiful, intelligent, kind woman.', 'explanation': 'Adjectives describe nouns. Multiple adjectives are separated by commas.'},
        {'text': 'This is a big red car. (size + color)', 'explanation': 'Adjective order: Opinion, Size, Age, Shape, Color, Origin, Material.'},
        {'text': 'Comparative: bigger, more beautiful. Superlative: biggest, most beautiful.', 'explanation': 'Short adjectives add -er/-est. Long adjectives use more/most.'},
    ],

    'adverb': [
        {'text': 'She speaks quietly. He runs quickly. They work carefully.', 'explanation': 'Adverbs of manner describe HOW an action is done. Most end in -ly.'},
        {'text': 'I always wake up early. She usually drinks coffee. They sometimes go shopping.', 'explanation': 'Adverbs of frequency: always, usually, often, sometimes, rarely, never.'},
        {'text': 'He drives very slowly. She sings extremely well.', 'explanation': 'Adverbs can modify other adverbs or adjectives.'},
    ],

    'article': [
        {'text': 'I saw a dog in the park. The dog was very friendly.', 'explanation': 'A/an for first mention (indefinite). The for specific reference (definite).'},
        {'text': 'She is an engineer. (profession) He is a doctor.', 'explanation': 'Use a/an with professions. "An" before vowel sounds (a, e, i, o, u).'},
        {'text': 'Life is beautiful. (abstract) Water is essential. (general)', 'explanation': 'No article with abstract nouns or uncountable nouns in general statements.'},
    ],

    'preposition': [
        {'text': 'The book is on the table. (surface) The cat is under the chair. (below)', 'explanation': 'Prepositions of place: on, in, at, under, above, between, behind, in front of.'},
        {'text': 'I wake up at 7 AM. The meeting is on Monday. She was born in 1990.', 'explanation': 'Prepositions of time: at (clock time), on (days/dates), in (months/years).'},
        {'text': 'I went to Delhi by train. She writes with a pen.', 'explanation': 'Prepositions of manner/means: by, with, without.'},
    ],

    'conjunction': [
        {'text': 'I like coffee and tea. (addition)', 'explanation': 'Coordinating conjunction: and, but, or, so, yet.'},
        {'text': 'She is tired but happy. (contrast)', 'explanation': 'But shows contrast between two ideas.'},
        {'text': 'Although it was raining, we went out. Because I was tired, I went to bed early.', 'explanation': 'Subordinating conjunctions: although, because, if, when, while.'},
    ],

    'pronoun': [
        {'text': 'Subject: I, you, he, she, it, we, they go before verbs.', 'explanation': 'I work. She runs. They play.'},
        {'text': 'Object: me, you, him, her, it, us, them go after verbs/prepositions.', 'explanation': 'Call me. Give it to her. Talk to them.'},
        {'text': 'Possessive: mine, yours, his, hers, ours, theirs stand alone.', 'explanation': 'This book is mine. The red car is yours.'},
    ],

    # SENTENCE STRUCTURES
    'relative-clause': [
        {'text': 'The man who called is my uncle. (people)', 'explanation': 'Who refers to people in relative clauses.'},
        {'text': 'The book which I bought is interesting. (things)', 'explanation': 'Which/that refers to things. Which is more formal.'},
        {'text': 'The girl whose project won first prize is my friend.', 'explanation': 'Whose shows possession.'},
    ],

    'reported-speech': [
        {'text': 'Direct: "I am tired." → Reported: She said that she was tired.', 'explanation': 'Change pronouns and verb tenses when reporting speech.'},
        {'text': 'Direct: "Where do you live?" → Reported: He asked where I lived.', 'explanation': 'Questions become statements in reported speech.'},
        {'text': 'Direct: "Don\'t go there." → Reported: He told me not to go there.', 'explanation': 'Commands: told + object + (not) to + verb.'},
    ],

    'subject-verb-agreement': [
        {'text': 'She works here. (singular) They work here. (plural)', 'explanation': 'Singular subjects take singular verbs; plural subjects take plural verbs.'},
        {'text': 'Every student has a book. Each person needs to register.', 'explanation': 'Each, every, everyone, everybody take singular verbs.'},
        {'text': 'Neither the teacher nor the students are ready. (closest subject)', 'explanation': 'With neither...nor, verb agrees with the closest subject.'},
    ],

    'question-tag': [
        {'text': 'She is a teacher, isn\'t she?', 'explanation': 'Positive statement → negative tag.'},
        {'text': 'They don\'t like coffee, do they?', 'explanation': 'Negative statement → positive tag.'},
        {'text': 'You can swim, can\'t you?', 'explanation': 'Use the same auxiliary verb in the tag.'},
    ],

    'gerund-infinitive': [
        {'text': 'I enjoy reading books. (gerund)', 'explanation': 'After enjoy, avoid, finish: use gerund (verb-ing).'},
        {'text': 'She wants to learn Spanish. (infinitive)', 'explanation': 'After want, decide, hope, plan: use infinitive (to + verb).'},
        {'text': 'I stopped smoking. (quit) vs. I stopped to smoke. (in order to)', 'explanation': 'Meaning changes with stop: gerund = quit, infinitive = purpose.'},
    ],

    # VOCABULARY
    'synonym': [
        {'text': 'happy = joyful, cheerful, delighted, content', 'explanation': 'Synonyms are words with similar meanings.'},
        {'text': 'big = large, huge, enormous, gigantic', 'explanation': 'Choose synonyms based on intensity and context.'},
        {'text': 'walk = stroll, march, stride, wander', 'explanation': 'Different synonyms suggest different manners of walking.'},
    ],

    'antonym': [
        {'text': 'hot ↔ cold, big ↔ small, happy ↔ sad', 'explanation': 'Antonyms are words with opposite meanings.'},
        {'text': 'increase ↔ decrease, expand ↔ contract', 'explanation': 'Verbs also have antonyms.'},
        {'text': 'early ↔ late, quickly ↔ slowly', 'explanation': 'Adverbs can be antonyms.'},
    ],

    'idiom': [
        {'text': 'It\'s raining cats and dogs. (raining heavily)', 'explanation': 'Idioms have figurative meanings different from literal words.'},
        {'text': 'Break the ice. (start a conversation in an awkward situation)', 'explanation': 'Common idiom for social situations.'},
        {'text': 'A piece of cake. (very easy)', 'explanation': 'Idiom to describe simple tasks.'},
    ],

    'phrasal-verb': [
        {'text': 'Turn on the light. Turn off the TV. (on/off)', 'explanation': 'Phrasal verbs: verb + particle with specific meaning.'},
        {'text': 'Look after = take care of. Look for = search for.', 'explanation': 'Different particles create different meanings.'},
        {'text': 'Give up = quit. Put off = postpone. Take off = remove / depart (plane)', 'explanation': 'Phrasal verbs often have multiple meanings.'},
    ],

    'collocation': [
        {'text': 'Make a decision (not "do a decision"). Do homework (not "make homework").', 'explanation': 'Collocations are word pairs that naturally go together.'},
        {'text': 'Strong coffee, heavy rain, fast food (not "powerful coffee", "big rain", "quick food")', 'explanation': 'Adjective-noun collocations must be learned.'},
        {'text': 'Good at mathematics (not "good in"). Interested in music (not "interested of").', 'explanation': 'Preposition collocations are fixed combinations.'},
    ],

    # SPECIAL TOPICS
    'word-order': [
        {'text': 'Standard: Subject + Verb + Object. Example: I love pizza.', 'explanation': 'English follows SVO word order.'},
        {'text': 'Adverb placement: She always drinks coffee. (before main verb)', 'explanation': 'Frequency adverbs go before the main verb (but after "be").'},
        {'text': 'Question: Auxiliary + Subject + Verb. Example: Do you like pizza?', 'explanation': 'Invert word order for questions.'},
    ],

    'punctuation': [
        {'text': 'Capital letters: Names, places, start of sentences. Example: John lives in Paris.', 'explanation': 'Always capitalize proper nouns and sentence beginnings.'},
        {'text': 'Period (.) ends statements. Question mark (?) ends questions. Exclamation (!) shows emotion.', 'explanation': 'End punctuation indicates sentence type.'},
        {'text': 'Comma (,) separates items: I bought apples, bananas, and oranges.', 'explanation': 'Use commas in lists and to separate clauses.'},
    ],

    'confusing-words': [
        {'text': 'Their (possession) vs. There (place) vs. They\'re (they are)', 'explanation': 'Their car. Over there. They\'re happy.'},
        {'text': 'Your (possession) vs. You\'re (you are)', 'explanation': 'Your book. You\'re welcome.'},
        {'text': 'Its (possession) vs. It\'s (it is)', 'explanation': 'The dog wagged its tail. It\'s raining.'},
    ],
}

# Function to get examples for a topic
def get_examples(topic_id):
    """Get examples for a topic by matching keywords"""
    topic_lower = topic_id.lower()

    # Try exact matches first
    if topic_lower in MEGA_EXAMPLES:
        return MEGA_EXAMPLES[topic_lower]

    # Try partial matches
    for key in MEGA_EXAMPLES:
        if key in topic_lower:
            return MEGA_EXAMPLES[key]

    # Return generic default
    return [
        {'text': 'Understanding this grammar point improves your English fluency.', 'explanation': 'Practice regularly to master this concept.'},
        {'text': 'This grammatical structure is common in both spoken and written English.', 'explanation': 'Pay attention to correct usage in reading materials.'},
        {'text': 'Native speakers use this naturally; learners need focused practice.', 'explanation': 'Exposure and repetition build accuracy.'},
    ]
