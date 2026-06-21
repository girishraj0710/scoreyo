#!/usr/bin/env python3
"""Verify Common Mistakes study material content structure"""

import os
import sys
import json
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

try:
    import psycopg2
    from dotenv import load_dotenv
except ImportError:
    print("❌ Missing dependencies")
    sys.exit(1)

# Load environment
env_path = Path(__file__).parent.parent / '.env.local'
load_dotenv(env_path)
POSTGRES_URL = os.getenv('POSTGRES_URL')

def verify_content():
    """Verify content structure"""
    try:
        conn = psycopg2.connect(POSTGRES_URL)
        cursor = conn.cursor()

        cursor.execute("""
            SELECT content
            FROM topic_study_content
            WHERE topic_id = 'common-mistakes' AND path_id = 'foundation'
        """)

        result = cursor.fetchone()
        if result:
            content = result[0]

            print('✅ Content Structure Verification:\n')
            print(f"Total sections: {len(content['sections'])}")

            for i, section in enumerate(content['sections'], 1):
                print(f"\n{i}. {section['title']} (ID: {section['id']})")

                if 'cards' in section:
                    print(f"   Cards: {len(section['cards'])}")
                    for j, card in enumerate(section['cards'][:2], 1):  # Show first 2 cards
                        print(f"   {j}. {card['title']}")

                if 'points' in section:
                    print(f"   Revision points: {len(section['points'])}")

        else:
            print('❌ No content found')

        cursor.close()
        conn.close()

    except Exception as e:
        print(f'❌ Error: {e}')
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    verify_content()
