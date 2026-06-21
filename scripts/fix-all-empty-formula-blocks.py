#!/usr/bin/env python3
"""Fix all empty formula blocks across advanced English topics."""

import os
import json
import psycopg2
from urllib.parse import urlparse, unquote

POSTGRES_URL = os.environ.get('POSTGRES_URL', "postgresql://postgres.zomcofptwlumqkeffbht:PrepGenie2026Secure%21%40%23@aws-1-ap-south-1.pooler.supabase.com:6543/postgres")

def get_db_connection():
    parsed = urlparse(POSTGRES_URL)
    return psycopg2.connect(
        host=parsed.hostname,
        port=parsed.port or 5432,
        database=parsed.path[1:],
        user=parsed.username,
        password=unquote(parsed.password)
    )

# Define formulas for each topic
FORMULAS = {
    'conditional-inversion': {
        'Had I known': {
            'formula': 'Had + subject + past participle, subject + would/could/might + base verb',
            'description': 'Formal inversion replacing "If I had known..."',
            'examples': [
                {
                    'text': 'Had I known about the traffic, I would have left earlier.',
                    'explanation': 'Formal equivalent of: If I had known about the traffic...'
                },
                {
                    'text': 'Had she studied harder, she could have passed the exam.',
                    'explanation': 'More formal than: If she had studied harder...'
                },
                {
                    'text': 'Had they warned us, we might have avoided the problem.',
                    'explanation': 'Omits "if" and inverts subject with "had"'
                }
            ]
        },
        'Were I': {
            'formula': 'Were + subject + adjective/noun, subject + would/could/might + base verb',
            'description': 'Formal inversion replacing "If I were..."',
            'examples': [
                {
                    'text': 'Were I the manager, I would change this policy.',
                    'explanation': 'Formal equivalent of: If I were the manager...'
                },
                {
                    'text': 'Were she more confident, she could present better.',
                    'explanation': 'More formal than: If she were more confident...'
                },
                {
                    'text': 'Were it not for your help, we might have failed.',
                    'explanation': 'Common in formal writing and speeches'
                }
            ]
        },
        'Should you': {
            'formula': 'Should + subject + base verb, subject + will/would + base verb',
            'description': 'Formal inversion for first conditional',
            'examples': [
                {
                    'text': 'Should you need assistance, please contact us.',
                    'explanation': 'Formal equivalent of: If you need assistance...'
                },
                {
                    'text': 'Should the problem persist, we will investigate further.',
                    'explanation': 'More formal than: If the problem persists...'
                },
                {
                    'text': 'Should anyone ask, tell them I am in a meeting.',
                    'explanation': 'Common in professional communication'
                }
            ]
        }
    },
    'narrative-tenses': {
        'Past Perfect': {
            'formula': 'Had + past participle',
            'description': 'Used to show an action completed before another past action',
            'examples': [
                {
                    'text': 'By the time we arrived, the movie had already started.',
                    'explanation': 'Movie started BEFORE we arrived (both in past, but one earlier)'
                },
                {
                    'text': 'She had finished her homework before dinner.',
                    'explanation': 'Homework completion happened before dinner time'
                },
                {
                    'text': 'They had never seen the ocean until they visited Mumbai.',
                    'explanation': 'Experience happened before the visit'
                }
            ]
        },
        'Past Continuous': {
            'formula': 'Was/Were + verb-ing',
            'description': 'Used for ongoing actions in the past, often interrupted',
            'examples': [
                {
                    'text': 'I was studying when she called.',
                    'explanation': 'Studying was ongoing, then the call interrupted'
                },
                {
                    'text': 'They were watching TV while it was raining outside.',
                    'explanation': 'Two simultaneous ongoing actions in the past'
                },
                {
                    'text': 'What were you doing at 8 PM yesterday?',
                    'explanation': 'Asking about an action in progress at a specific past time'
                }
            ]
        },
        'Past Perfect Continuous': {
            'formula': 'Had been + verb-ing',
            'description': 'Used for actions that continued up to a point in the past',
            'examples': [
                {
                    'text': 'She had been working for three hours when I arrived.',
                    'explanation': 'Work started before and continued until arrival'
                },
                {
                    'text': 'They had been waiting since morning.',
                    'explanation': 'Waiting started in morning and continued for duration'
                },
                {
                    'text': 'I was tired because I had been running.',
                    'explanation': 'Running caused the tiredness (recent past activity)'
                }
            ]
        }
    },
    'reduced-relative-clauses': {
        'Present Participle': {
            'formula': 'Noun + verb-ing + (rest of clause)',
            'description': 'Reduces active relative clauses by removing relative pronoun and "be"',
            'examples': [
                {
                    'text': 'The man standing at the door is my uncle. (who is standing)',
                    'explanation': 'Reduced from: The man who is standing at the door...'
                },
                {
                    'text': 'Students taking the exam must arrive early. (who are taking)',
                    'explanation': 'More concise than: Students who are taking the exam...'
                },
                {
                    'text': 'The train leaving platform 3 goes to Delhi. (which is leaving)',
                    'explanation': 'Omits "which is" for brevity'
                }
            ]
        },
        'Past Participle': {
            'formula': 'Noun + past participle + (rest of clause)',
            'description': 'Reduces passive relative clauses',
            'examples': [
                {
                    'text': 'The book written by Tagore is famous. (which was written)',
                    'explanation': 'Reduced from: The book which was written by Tagore...'
                },
                {
                    'text': 'Emails sent after 5 PM will be read tomorrow. (which are sent)',
                    'explanation': 'Passive meaning retained without relative pronoun'
                },
                {
                    'text': 'The bridge built in 1920 needs repair. (which was built)',
                    'explanation': 'Shorter and more formal'
                }
            ]
        },
        'Infinitive Clauses': {
            'formula': 'Noun + to + base verb',
            'description': 'Reduces relative clauses showing purpose or necessity',
            'examples': [
                {
                    'text': 'He was the first student to arrive. (who arrived)',
                    'explanation': 'Used after ordinals (first, last, only)'
                },
                {
                    'text': 'She needs someone to help her. (who can help)',
                    'explanation': 'Shows purpose or potential'
                },
                {
                    'text': 'There is nothing to worry about. (that you should worry about)',
                    'explanation': 'Common with nothing, something, anything'
                }
            ]
        }
    },
    'past-modals': {
        'Must have': {
            'formula': 'Must have + past participle',
            'description': 'Strong deduction about the past (90-95% certain)',
            'examples': [
                {
                    'text': 'She must have missed the bus. (The only logical explanation)',
                    'explanation': 'Strong certainty based on evidence'
                },
                {
                    'text': 'They must have forgotten about the meeting.',
                    'explanation': 'Logical conclusion from their absence'
                },
                {
                    'text': 'He must have been tired after the journey.',
                    'explanation': 'Reasonable deduction from circumstances'
                }
            ]
        },
        "Can't/Couldn't have": {
            'formula': "Can't/Couldn't have + past participle",
            'description': 'Impossibility or strong negative deduction',
            'examples': [
                {
                    'text': "She can't have finished already. (It's impossible)",
                    'explanation': 'Expressing impossibility based on time'
                },
                {
                    'text': "They couldn't have known about it.",
                    'explanation': 'Impossible for them to know at that time'
                },
                {
                    'text': "He can't have said that. (I don't believe it)",
                    'explanation': 'Strong disbelief about past statement'
                }
            ]
        }
    },
    'debates-discussions': {
        'Opening Statement': {
            'formula': 'I believe/argue that + clause, because + reason',
            'description': 'Standard format for starting debate arguments',
            'examples': [
                {
                    'text': 'I believe that online education is effective because it offers flexibility.',
                    'explanation': 'Clear position + supporting reason'
                },
                {
                    'text': 'I would argue that social media has both benefits and drawbacks.',
                    'explanation': 'Nuanced opening for balanced debate'
                },
                {
                    'text': 'My position is that environmental protection should be prioritized over economic growth.',
                    'explanation': 'Formal declaration of stance'
                }
            ]
        }
    },
    'modal-verb-nuances': {
        'Permission vs Possibility': {
            'formula': 'Can/Could/May/Might + base verb',
            'description': 'Subtle differences in meaning and formality',
            'examples': [
                {
                    'text': 'Can I leave early? (informal permission)',
                    'explanation': 'Most common way to ask permission casually'
                },
                {
                    'text': 'May I leave early? (formal permission)',
                    'explanation': 'More polite and formal request'
                },
                {
                    'text': 'It might rain tomorrow. (low possibility)',
                    'explanation': 'Expressing uncertainty about future'
                },
                {
                    'text': 'It could be true. (50% possibility)',
                    'explanation': 'Moderate possibility'
                }
            ]
        }
    },
    'non-defining-relative-clauses': {
        'Structure': {
            'formula': 'Noun, + which/who/where + clause, + main clause continues',
            'description': 'Adds extra information, always uses commas',
            'examples': [
                {
                    'text': 'My brother, who lives in Delhi, is a doctor.',
                    'explanation': 'Extra info about brother (I have only one brother)'
                },
                {
                    'text': 'The Taj Mahal, which was built in 1632, is in Agra.',
                    'explanation': 'Additional historical fact (not essential to identify it)'
                },
                {
                    'text': 'Mumbai, where I was born, is a busy city.',
                    'explanation': 'Adding detail about place (not essential to know which Mumbai)'
                }
            ]
        }
    }
}

conn = get_db_connection()
cur = conn.cursor()

# Get topics with empty formula blocks
cur.execute("""
    SELECT topic_id, title, content
    FROM topic_study_content
    WHERE subject_id = 'english'
      AND path_id = 'advanced'
      AND topic_id IN ('conditional-inversion', 'narrative-tenses', 'reduced-relative-clauses',
                       'past-modals', 'debates-discussions', 'modal-verb-nuances', 'non-defining-relative-clauses')
""")

topics_fixed = 0
formulas_added = 0

for row in cur.fetchall():
    topic_id, title, content_json = row

    if topic_id not in FORMULAS:
        continue

    sections = content_json.get('sections', [])
    topic_had_fixes = False

    for section in sections:
        content = section.get('content')

        if isinstance(content, list):
            for block in content:
                if isinstance(block, dict) and block.get('type') == 'formula':
                    # Check if formula is empty
                    if not block.get('formula'):
                        # Find matching formula by section title or block context
                        section_title = section.get('title', '')

                        for formula_key, formula_data in FORMULAS[topic_id].items():
                            if formula_key.lower() in section_title.lower() or formula_key.lower() in str(block.get('title', '')).lower():
                                block.update(formula_data)
                                formulas_added += 1
                                topic_had_fixes = True
                                break
                        else:
                            # If no match, use first formula
                            first_formula = list(FORMULAS[topic_id].values())[0]
                            block.update(first_formula)
                            formulas_added += 1
                            topic_had_fixes = True

    if topic_had_fixes:
        # Update database
        cur.execute("""
            UPDATE topic_study_content
            SET content = %s, updated_at = NOW()
            WHERE subject_id = 'english'
              AND path_id = 'advanced'
              AND topic_id = %s
        """, (json.dumps(content_json), topic_id))

        topics_fixed += 1
        print(f"✅ {title}")

conn.commit()
cur.close()
conn.close()

print(f"\n{'='*80}")
print("FIX SUMMARY")
print(f"{'='*80}")
print(f"Topics fixed: {topics_fixed}")
print(f"Formulas added: {formulas_added}")
print(f"{'='*80}\n")
