#!/usr/bin/env python3
"""
Insert Common Mistakes study material into Supabase
Run: python3 scripts/insert-common-mistakes.py
"""

import os
import sys
import json
from pathlib import Path

# Add parent directory to path to import from src/lib
sys.path.insert(0, str(Path(__file__).parent.parent))

try:
    import psycopg2
    from psycopg2.extras import Json
    from dotenv import load_dotenv
except ImportError:
    print("❌ Missing dependencies. Install with:")
    print("   pip3 install psycopg2-binary python-dotenv")
    sys.exit(1)

# Load environment variables
env_path = Path(__file__).parent.parent / '.env.local'
load_dotenv(env_path)

POSTGRES_URL = os.getenv('POSTGRES_URL')

if not POSTGRES_URL:
    print("❌ POSTGRES_URL not found in .env.local")
    sys.exit(1)


def insert_common_mistakes():
    """Insert Common Mistakes study material"""

    # Read SQL file
    sql_file = Path(__file__).parent / 'insert-common-mistakes-study-material.sql'

    if not sql_file.exists():
        print(f"❌ SQL file not found: {sql_file}")
        sys.exit(1)

    with open(sql_file, 'r', encoding='utf-8') as f:
        sql_content = f.read()

    # Connect and execute
    try:
        print('🔄 Connecting to Supabase...')
        conn = psycopg2.connect(POSTGRES_URL)
        cursor = conn.cursor()

        print('🔄 Inserting Common Mistakes study material...')
        cursor.execute(sql_content)
        conn.commit()

        print('✅ Successfully inserted Common Mistakes study material')

        # Verify insertion
        cursor.execute("""
            SELECT topic_id, title, difficulty_level, estimated_time_minutes,
                   LENGTH(content::text) as content_size
            FROM topic_study_content
            WHERE topic_id = 'common-mistakes' AND path_id = 'foundation'
        """)

        result = cursor.fetchone()
        if result:
            print('\n📊 Verification:')
            print(f"   Topic ID: {result[0]}")
            print(f"   Title: {result[1]}")
            print(f"   Level: {result[2]}")
            print(f"   Duration: {result[3]} minutes")
            print(f"   Content size: {result[4]:,} characters")
        else:
            print('\n⚠️  No data found after insertion')

        cursor.close()
        conn.close()
        print('\n✅ Database connection closed')

    except Exception as e:
        print(f'❌ Error: {e}')
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    insert_common_mistakes()
