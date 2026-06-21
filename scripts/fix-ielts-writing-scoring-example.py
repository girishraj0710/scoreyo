#!/usr/bin/env python3
"""Fix IELTS Writing scoring example - convert content string to examples array."""

import os
import json
import psycopg2
from urllib.parse import urlparse, unquote

# Database connection
POSTGRES_URL = os.environ.get('POSTGRES_URL', "postgresql://postgres.zomcofptwlumqkeffbht:PrepGenie2026Secure%21%40%23@aws-1-ap-south-1.pooler.supabase.com:6543/postgres")

def get_db_connection():
    """Get database connection."""
    parsed = urlparse(POSTGRES_URL)
    return psycopg2.connect(
        host=parsed.hostname,
        port=parsed.port or 5432,
        database=parsed.path[1:],
        user=parsed.username,
        password=unquote(parsed.password)
    )

conn = get_db_connection()
cur = conn.cursor()

cur.execute("""
    SELECT content
    FROM topic_study_content
    WHERE subject_id = 'english'
      AND path_id = 'ielts-toefl'
      AND topic_id = 'ielts-writing'
""")

result = cur.fetchone()
content_json = result[0]
sections = content_json.get('sections', [])

# Fix Section 8, Block 4
section8 = sections[7]
block4 = section8['content'][3]

print("\n" + "="*80)
print("Fixing IELTS Writing Section 8, Block 4")
print("="*80)

print(f"\nCurrent structure:")
print(f"  Type: {block4.get('type')}")
print(f"  Title: {block4.get('title')}")
print(f"  Has 'content' field: {'content' in block4}")
print(f"  Has 'examples' field: {'examples' in block4}")

if 'content' in block4 and not block4.get('examples'):
    # Convert content string to examples array
    content_text = block4['content']

    # Create proper examples structure
    block4['examples'] = [
        {
            "text": "Informal (Band 5): \"Nowadays, lots of kids use phones too much. It's really bad for them. Parents should stop it.\"",
            "context": "Common Band 5 writing"
        },
        {
            "text": "Formal (Band 7): \"In recent years, excessive smartphone usage among children has raised concerns. This trend can negatively impact their social development and academic performance. Parents should regulate screen time through clear boundaries and alternative activities.\"",
            "context": "Band 7+ improvement"
        },
        {
            "text": "Why it's better: Formal vocab (excessive usage vs. 'lots of kids use'), clear reasoning (impact → solution), no contractions, academic tone.",
            "context": "Analysis"
        }
    ]

    # Remove content field
    del block4['content']

    print(f"\n✅ Converted to examples array with {len(block4['examples'])} examples")

# Also check and fix Block 7 (practice with no questions)
block7 = section8['content'][6]
print(f"\nBlock 7 (practice):")
print(f"  Has 'questions' field: {'questions' in block7}")
print(f"  Questions count: {len(block7.get('questions', []))}")

if 'question' in block7:
    # Single question field - convert to questions array
    block7['questions'] = [{
        'question': block7['question'],
        'hint': block7.get('hint', '')
    }]
    del block7['question']
    if 'hint' in block7:
        del block7['hint']
    print(f"  ✅ Converted single question to questions array")

# Add a proper scoring example paragraph after the table
# Insert after Block 2 (the Four Band Descriptors table)
new_paragraph = {
    "type": "paragraph",
    "text": "Scoring Example: Band 6 vs. Band 7"
}

# Insert scoring comparison
scoring_example = {
    "type": "example",
    "title": "Task 2 Response Comparison",
    "examples": [
        {
            "text": "Band 6 Response: \"I agree that technology is good. Many people use phones for work. Students can learn online. However, phones are also bad sometimes. People spend too much time on social media. This causes health problems. In conclusion, technology has advantages and disadvantages.\"",
            "context": "Why Band 6: Generic statements, limited vocabulary, weak structure"
        },
        {
            "text": "Band 7 Response: \"While technological advancement has undoubtedly transformed modern communication, its impact on interpersonal relationships remains contentious. On one hand, digital platforms enable individuals to maintain connections across geographical boundaries. Conversely, excessive screen time may erode face-to-face interaction quality. A balanced approach—utilizing technology purposefully while preserving in-person engagement—appears most conducive to healthy social development.\"",
            "context": "Why Band 7: Sophisticated vocabulary (contentious, conducive), complex sentences, clear position, cohesive arguments"
        }
    ]
}

# Insert these after Block 2 (table)
section8['content'].insert(3, new_paragraph)
section8['content'].insert(4, scoring_example)

print(f"\n✅ Added scoring example paragraph and comparison")

# Update database
cur.execute("""
    UPDATE topic_study_content
    SET content = %s, updated_at = NOW()
    WHERE subject_id = 'english'
      AND path_id = 'ielts-toefl'
      AND topic_id = 'ielts-writing'
""", (json.dumps(content_json),))

conn.commit()

print(f"\n{'='*80}")
print("✅ IELTS Writing Section 8 fixed!")
print(f"{'='*80}\n")

cur.close()
conn.close()
