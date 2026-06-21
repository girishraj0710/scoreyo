#!/usr/bin/env python3
"""
ADD AUDIO PRONUNCIATION EXAMPLES
Updates pronunciation/phonics/speaking topics with audio-enabled examples
"""

import os, json

env_vars = {}
with open('.env.local', 'r') as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith('#') and '=' in line:
            key, value = line.split('=', 1)
            env_vars[key] = value.strip('"')
os.environ.update(env_vars)

import psycopg2
conn = psycopg2.connect(os.environ.get('POSTGRES_URL'))
cur = conn.cursor()

# Pronunciation examples with phonetic notation
PRONUNCIATION_EXAMPLES = {
    'foundation/pronunciation-basics': [
        {
            'section_index': 1,  # After introduction
            'title': 'Vowel Sounds with Audio',
            'examples': [
                {'word': 'cat', 'phonetic': 'kæt', 'meaning': 'A small furry animal', 'sentence': 'The cat is sleeping.', 'audio': True},
                {'word': 'meet', 'phonetic': 'miːt', 'meaning': 'To come together', 'sentence': 'I will meet you tomorrow.', 'audio': True},
                {'word': 'sit', 'phonetic': 'sɪt', 'meaning': 'To rest on a chair', 'sentence': 'Please sit down.', 'audio': True},
                {'word': 'hot', 'phonetic': 'hɒt', 'meaning': 'High temperature', 'sentence': 'The tea is hot.', 'audio': True},
                {'word': 'put', 'phonetic': 'pʊt', 'meaning': 'To place something', 'sentence': 'Put the book on the table.', 'audio': True},
                {'word': 'cup', 'phonetic': 'kʌp', 'meaning': 'A drinking container', 'sentence': 'I need a cup of water.', 'audio': True},
                {'word': 'bird', 'phonetic': 'bɜːd', 'meaning': 'A flying animal', 'sentence': 'The bird is singing.', 'audio': True},
                {'word': 'about', 'phonetic': 'əˈbaʊt', 'meaning': 'Concerning or regarding', 'sentence': 'Tell me about your day.', 'audio': True},
            ]
        },
        {
            'section_index': 2,
            'title': 'Consonant Sounds with Audio',
            'examples': [
                {'word': 'pen', 'phonetic': 'pen', 'meaning': 'Writing instrument', 'sentence': 'I write with a pen.', 'audio': True},
                {'word': 'big', 'phonetic': 'bɪɡ', 'meaning': 'Large in size', 'sentence': 'The elephant is big.', 'audio': True},
                {'word': 'time', 'phonetic': 'taɪm', 'meaning': 'Duration or moment', 'sentence': 'What time is it?', 'audio': True},
                {'word': 'dog', 'phonetic': 'dɒɡ', 'meaning': 'A pet animal', 'sentence': 'The dog is barking.', 'audio': True},
                {'word': 'ship', 'phonetic': 'ʃɪp', 'meaning': 'A large boat', 'sentence': 'The ship is sailing.', 'audio': True},
                {'word': 'vision', 'phonetic': 'ˈvɪʒən', 'meaning': 'Ability to see', 'sentence': 'He has clear vision.', 'audio': True},
                {'word': 'think', 'phonetic': 'θɪŋk', 'meaning': 'To use your mind', 'sentence': 'I think therefore I am.', 'audio': True},
                {'word': 'this', 'phonetic': 'ðɪs', 'meaning': 'Used to indicate', 'sentence': 'This is my book.', 'audio': True},
            ]
        }
    ],
    'foundation/phonics-vowels': [
        {
            'section_index': 1,
            'title': 'Short Vowel Sounds',
            'examples': [
                {'word': 'bat', 'phonetic': 'bæt', 'meaning': 'A flying mammal or sports equipment', 'sentence': 'The bat flies at night.', 'audio': True},
                {'word': 'bed', 'phonetic': 'bed', 'meaning': 'Furniture for sleeping', 'sentence': 'I sleep in my bed.', 'audio': True},
                {'word': 'hit', 'phonetic': 'hɪt', 'meaning': 'To strike', 'sentence': 'Don\'t hit the ball too hard.', 'audio': True},
                {'word': 'pot', 'phonetic': 'pɒt', 'meaning': 'A cooking container', 'sentence': 'Cook rice in the pot.', 'audio': True},
                {'word': 'bus', 'phonetic': 'bʌs', 'meaning': 'Public transport vehicle', 'sentence': 'I take the bus to school.', 'audio': True},
            ]
        },
        {
            'section_index': 2,
            'title': 'Long Vowel Sounds',
            'examples': [
                {'word': 'cake', 'phonetic': 'keɪk', 'meaning': 'A sweet baked dessert', 'sentence': 'The birthday cake is delicious.', 'audio': True},
                {'word': 'bee', 'phonetic': 'biː', 'meaning': 'An insect that makes honey', 'sentence': 'The bee collects nectar.', 'audio': True},
                {'word': 'kite', 'phonetic': 'kaɪt', 'meaning': 'A flying toy', 'sentence': 'The kite is flying high.', 'audio': True},
                {'word': 'home', 'phonetic': 'həʊm', 'meaning': 'Where you live', 'sentence': 'I am going home.', 'audio': True},
                {'word': 'mule', 'phonetic': 'mjuːl', 'meaning': 'An animal (horse-donkey hybrid)', 'sentence': 'The mule carries heavy loads.', 'audio': True},
            ]
        }
    ],
    'foundation/speaking-basics': [
        {
            'section_index': 1,
            'title': 'Common Greetings with Pronunciation',
            'examples': [
                {'word': 'Hello', 'phonetic': 'həˈləʊ', 'meaning': 'A greeting', 'sentence': 'Hello, how are you?', 'audio': True},
                {'word': 'Good morning', 'phonetic': 'ɡʊd ˈmɔːnɪŋ', 'meaning': 'Morning greeting', 'sentence': 'Good morning, have a nice day!', 'audio': True},
                {'word': 'Thank you', 'phonetic': 'θæŋk juː', 'meaning': 'Expression of gratitude', 'sentence': 'Thank you for your help.', 'audio': True},
                {'word': 'Please', 'phonetic': 'pliːz', 'meaning': 'Polite request', 'sentence': 'Please give me water.', 'audio': True},
                {'word': 'Excuse me', 'phonetic': 'ɪkˈskjuːz miː', 'meaning': 'Polite interruption', 'sentence': 'Excuse me, where is the station?', 'audio': True},
            ]
        },
        {
            'section_index': 2,
            'title': 'Daily Conversation Phrases',
            'examples': [
                {'word': 'I am fine', 'phonetic': 'aɪ æm faɪn', 'meaning': 'I am well', 'sentence': 'I am fine, thank you.', 'audio': True},
                {'word': 'How are you', 'phonetic': 'haʊ ɑː juː', 'meaning': 'Asking about wellbeing', 'sentence': 'How are you doing today?', 'audio': True},
                {'word': 'See you later', 'phonetic': 'siː juː ˈleɪtə', 'meaning': 'Goodbye phrase', 'sentence': 'See you later, goodbye!', 'audio': True},
                {'word': 'What is your name', 'phonetic': 'wɒt ɪz jɔː neɪm', 'meaning': 'Asking someone\'s name', 'sentence': 'What is your name?', 'audio': True},
            ]
        }
    ]
}

topics_updated = 0

for topic_key, sections_data in PRONUNCIATION_EXAMPLES.items():
    path_id, topic_id = topic_key.split('/')

    # Get topic content
    cur.execute("""
        SELECT content FROM topic_study_content
        WHERE subject_id='english' AND path_id=%s AND topic_id=%s
    """, (path_id, topic_id))

    result = cur.fetchone()
    if not result:
        print(f"⚠️  Topic not found: {topic_key}")
        continue

    content_json = result[0]
    sections = content_json['sections']
    modified = False

    for section_data in sections_data:
        section_idx = section_data['section_index']

        if section_idx >= len(sections):
            # Add new section
            sections.append({
                'title': section_data['title'],
                'content': [
                    {
                        'type': 'example',
                        'title': section_data['title'],
                        'examples': section_data['examples']
                    }
                ]
            })
            modified = True
        else:
            # Find or add example block in existing section
            section = sections[section_idx]
            content_blocks = section.get('content', [])

            # Check if audio examples already exist
            has_audio = False
            for block in content_blocks:
                if block.get('type') == 'example':
                    examples = block.get('examples', [])
                    if any(ex.get('audio') for ex in examples if isinstance(ex, dict)):
                        has_audio = True
                        break

            if not has_audio:
                # Add audio examples
                content_blocks.insert(0, {
                    'type': 'example',
                    'title': section_data['title'],
                    'examples': section_data['examples']
                })
                section['content'] = content_blocks
                modified = True

    if modified:
        cur.execute("""
            UPDATE topic_study_content
            SET content = %s, updated_at = NOW()
            WHERE subject_id='english' AND path_id=%s AND topic_id=%s
        """, (json.dumps(content_json), path_id, topic_id))
        topics_updated += 1
        print(f"✅ {topic_key}: Added audio pronunciation examples")

conn.commit()

print(f"\n{'='*80}")
print(f"COMPLETE: {topics_updated} topics updated with audio examples")
print(f"{'='*80}\n")

cur.close()
conn.close()
