#!/usr/bin/env python3
"""
Generate all Phase 3 Vocabulary Building SQL files (500 questions)
Uses direct generation without complex workflows
"""
import json

# Topic configurations
TOPICS = {
    'essential-vocabulary': {
        'count': 150,
        'level': 'beginner',
        'subtopics': [
            ('Daily Objects', 30),
            ('Actions & Verbs', 30),
            ('Emotions & Feelings', 30),
            ('Time & Frequency', 30),
            ('Places & Locations', 30)
        ],
        'distribution': {'easy': 60, 'medium': 60, 'hard': 30}
    },
    'synonyms-antonyms': {
        'count': 120,
        'level': 'beginner',
        'subtopics': [
            ('Basic Synonyms', 30),
            ('Basic Antonyms', 30),
            ('Adjective Pairs', 30),
            ('Verb Pairs', 30)
        ],
        'distribution': {'easy': 48, 'medium': 48, 'hard': 24}
    },
    'word-formation': {
        'count': 100,
        'level': 'intermediate',
        'subtopics': [
            ('Prefixes (un-, re-, pre-, dis-)', 25),
            ('Suffixes (-ly, -ness, -ful, -less)', 25),
            ('Root Words', 25),
            ('Compound Words', 25)
        ],
        'distribution': {'easy': 40, 'medium': 40, 'hard': 20}
    },
    'phrasal-verbs': {
        'count': 80,
        'level': 'intermediate',
        'subtopics': [
            ('Common Phrasal Verbs', 20),
            ('Separable vs Inseparable', 20),
            ('Multiple Meanings', 20),
            ('Idiom-like Phrasal Verbs', 20)
        ],
        'distribution': {'easy': 32, 'medium': 32, 'hard': 16}
    },
    'idioms': {
        'count': 50,
        'level': 'intermediate',
        'subtopics': [
            ('Common Idioms', 15),
            ('Animal Idioms', 10),
            ('Body Part Idioms', 10),
            ('Food Idioms', 8),
            ('Color Idioms', 7)
        ],
        'distribution': {'easy': 20, 'medium': 20, 'hard': 10}
    }
}

print("📋 Phase 3 Vocabulary Building Topics:")
print("=" * 80)
for topic_id, config in TOPICS.items():
    print(f"\n✅ {topic_id} ({config['count']}Q) - Level: {config['level']}")
    print(f"   Distribution: {config['distribution']}")
    print(f"   Subtopics:")
    for subtopic, count in config['subtopics']:
        print(f"      - {subtopic}: {count}Q")

print("\n" + "=" * 80)
print(f"📊 TOTAL: {sum(c['count'] for c in TOPICS.values())} questions across 5 topics")
print("\nThese need to be generated as SQL INSERT statements matching the pattern:")
print("INSERT INTO english_questions (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty) VALUES")
print("('foundation', 'topic-id', 'level', 'question', '[\"opt1\", \"opt2\", \"opt3\", \"opt4\"]', index, 'explanation', 'difficulty'),")
print("\n⚠️  CRITICAL: Use '' (double quotes) for apostrophes in PostgreSQL strings!")
print("⚠️  CRITICAL: All instruction words must have colons (Use:, Choose:, etc.)")
