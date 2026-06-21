#!/usr/bin/env python3
"""
Generate and insert Common Mistakes study material directly into Supabase
Uses Python JSON to avoid SQL escaping issues
"""

import os
import sys
import json
from pathlib import Path
from datetime import datetime

sys.path.insert(0, str(Path(__file__).parent.parent))

try:
    import psycopg2
    from psycopg2.extras import Json
    from dotenv import load_dotenv
except ImportError:
    print("❌ Missing dependencies. Install with:")
    print("   pip3 install psycopg2-binary python-dotenv")
    sys.exit(1)

# Load environment
env_path = Path(__file__).parent.parent / '.env.local'
load_dotenv(env_path)
POSTGRES_URL = os.getenv('POSTGRES_URL')

# Build content structure
content = {
    "sections": [
        {
            "id": "intro",
            "title": "Introduction: Why Hindi Speakers Make Specific Mistakes",
            "type": "overview",
            "content": {
                "main_text": "When learning English, Hindi speakers often make predictable errors due to differences in grammar, word order, and linguistic features between the two languages. These are not signs of poor learning ability but natural consequences of language transfer. Understanding these patterns helps you avoid them systematically.",
                "key_points": [
                    "Hindi uses Subject-Object-Verb (SOV) word order; English uses Subject-Verb-Object (SVO)",
                    "Hindi has no articles (a/an/the); English requires them in specific contexts",
                    "Hindi uses postpositions (mein, par, ko); English uses prepositions (in, on, to) with different rules",
                    "Hindi tense system differs from English progressive and perfect tenses",
                    "Literal word-for-word translation from Hindi produces unnatural English"
                ],
                "learning_approach": "This lesson identifies five major error categories with correction strategies. Each section provides Hindi interference patterns, correct English structures, and practice exercises to retrain your language instincts."
            }
        },
        {
            "id": "core-concepts",
            "title": "Five Major Error Categories",
            "type": "concept-cards",
            "cards": [
                {
                    "title": "1. Word Order Errors (SOV → SVO)",
                    "definition": "Hindi places verbs at the end of sentences (Subject-Object-Verb), whilst English places verbs immediately after the subject (Subject-Verb-Object). Direct translation produces incorrect English word order.",
                    "rules": [
                        "English basic pattern: Subject + Verb + Object (I eat food)",
                        "NOT Hindi pattern: Subject + Object + Verb (×I food eat)",
                        "Adjectives before nouns in English: red car (NOT car red)",
                        "Question word order: Verb before subject (Do you...? NOT You do...?)",
                        "Adverb placement varies: He quickly ate (manner) / He ate quickly (neutral)"
                    ],
                    "examples": {
                        "correct": [
                            "I study English every day. (Subject-Verb-Object)",
                            "She bought a beautiful red saree. (opinion + colour + noun)",
                            "Do you speak Hindi? (auxiliary + subject + verb)",
                            "He completed his homework yesterday. (verb + object + time)",
                            "They are waiting outside. (progressive verb + location)"
                        ],
                        "incorrect": [
                            {
                                "text": "×I English every day study.",
                                "reason": "Direct Hindi translation (main SOV). English requires: I study English every day."
                            },
                            {
                                "text": "×She a red beautiful saree bought.",
                                "reason": "Hindi word order (adjectives after verb). English: She bought a beautiful red saree."
                            },
                            {
                                "text": "×You Hindi speak?",
                                "reason": "Missing auxiliary verb. Questions need: Do you speak Hindi?"
                            },
                            {
                                "text": "×He his homework yesterday completed.",
                                "reason": "Verb at end (Hindi SOV). English: He completed his homework yesterday."
                            },
                            {
                                "text": "×They outside waiting are.",
                                "reason": "Auxiliary at end. English progressive: They are waiting outside."
                            }
                        ]
                    }
                },
                # Continue with remaining cards...
            ]
        }
    ]
}

# Due to message length limits, I'll create a separate file with the full content structure
print("Creating full content JSON file...")
