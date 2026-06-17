#!/usr/bin/env python3
"""
Fix option formatting in English questions.
Changes: "Say X" → "Say: X", "Use X" → "Use: X", etc.
"""
import psycopg2
from urllib.parse import urlparse, unquote
import json
import re

POSTGRES_URL = "postgresql://postgres.zomcofptwlumqkeffbht:PrepGenie2026Secure%21%40%23@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"

parsed = urlparse(POSTGRES_URL)
conn_params = {
    'host': parsed.hostname,
    'port': parsed.port or 5432,
    'database': parsed.path[1:],
    'user': parsed.username,
    'password': unquote(parsed.password) if parsed.password else None,
}

# Patterns to fix
INSTRUCTION_WORDS = [
    'Say',
    'Use',
    'Arrange',
    'Rearrange',
    'Add',
    'Remove',
    'Change',
    'Put',
]

def fix_option(option_text):
    """Add colon after instruction words if not already present."""
    for word in INSTRUCTION_WORDS:
        # Pattern: "Say something" or "Use something" → "Say: something" / "Use: something"
        # But don't change if already has colon: "Say: something"
        # Match: word + space + any character (capital or lowercase)
        if option_text.startswith(f"{word} ") and not option_text.startswith(f"{word}: "):
            # Add colon after the instruction word
            option_text = option_text.replace(f"{word} ", f"{word}: ", 1)
            break  # Only fix first match

    return option_text

def main():
    print("🔧 Fixing option formatting...\n")

    conn = psycopg2.connect(**conn_params)
    cur = conn.cursor()

    # Get all questions that need fixing
    cur.execute("""
        SELECT id, question, options, topic_id
        FROM english_questions
        WHERE topic_id IN (
            'present-simple',
            'present-continuous',
            'present-perfect',
            'past-simple',
            'past-continuous',
            'future-simple',
            'tenses-advanced'
        )
        AND (
            options LIKE '%"Say %' OR
            options LIKE '%"Use %' OR
            options LIKE '%"Arrange %' OR
            options LIKE '%"Rearrange %' OR
            options LIKE '%"Add %' OR
            options LIKE '%"Remove %' OR
            options LIKE '%"Change %' OR
            options LIKE '%"Put %'
        )
    """)

    questions = cur.fetchall()
    print(f"Found {len(questions)} questions to fix\n")

    fixed_count = 0

    for qid, question, options_str, topic in questions:
        try:
            # Parse options JSON
            options = json.loads(options_str)

            # Fix each option
            fixed_options = [fix_option(opt) for opt in options]

            # Check if anything changed
            if fixed_options != options:
                # Update database
                new_options_json = json.dumps(fixed_options, ensure_ascii=False)
                cur.execute(
                    "UPDATE english_questions SET options = %s WHERE id = %s",
                    (new_options_json, qid)
                )
                fixed_count += 1

                if fixed_count <= 5:  # Show first 5 examples
                    print(f"✅ Fixed Q{qid} ({topic}):")
                    print(f"   Question: {question[:60]}...")
                    print(f"   Before: {options[0]}")
                    print(f"   After:  {fixed_options[0]}\n")

        except Exception as e:
            print(f"❌ Error fixing Q{qid}: {e}")
            continue

    # Commit changes
    conn.commit()

    print(f"{'='*80}")
    print(f"✅ Fixed {fixed_count} questions")
    print(f"{'='*80}\n")

    # Verify
    cur.execute("""
        SELECT topic_id, COUNT(*)
        FROM english_questions
        WHERE topic_id IN (
            'present-simple',
            'present-continuous',
            'present-perfect',
            'past-simple',
            'past-continuous',
            'future-simple',
            'tenses-advanced'
        )
        GROUP BY topic_id
        ORDER BY topic_id
    """)

    print("📊 Questions by topic after fix:")
    for topic, count in cur.fetchall():
        print(f"   {topic}: {count}")

    cur.close()
    conn.close()

    print("\n✅ Done!")

if __name__ == '__main__':
    main()
