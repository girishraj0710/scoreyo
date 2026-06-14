#!/usr/bin/env python3
"""
Simple Supabase Connection Test
Tests connection and shows basic database info
"""

import sys

# Connection details
DB_HOST = "db.zomcofptwlumqkeffbht.supabase.co"
DB_PORT = "5432"
DB_NAME = "postgres"
DB_USER = "postgres"
DB_PASSWORD = "PrepGenie2026Secure!@#"

print("=" * 70)
print("SUPABASE CONNECTION TEST")
print("=" * 70)
print(f"\nHost: {DB_HOST}")
print(f"Port: {DB_PORT}")
print(f"Database: {DB_NAME}")
print(f"User: {DB_USER}")
print()

# Try to import psycopg2
try:
    import psycopg2
    print("✅ psycopg2 library available")
except ImportError:
    print("❌ psycopg2 not installed")
    print("\nInstalling psycopg2-binary with --user flag...")
    import os
    result = os.system("pip3 install --user --quiet psycopg2-binary")
    if result == 0:
        print("✅ Installation complete. Please run this script again.")
    else:
        print("❌ Installation failed. Trying with --break-system-packages...")
        result = os.system("pip3 install --break-system-packages --quiet psycopg2-binary")
        if result == 0:
            print("✅ Installation complete. Please run this script again.")
        else:
            print("❌ Installation failed. Please run:")
            print("   pip3 install --user psycopg2-binary")
    sys.exit(0)

# Try to connect
print("\n🔌 Attempting connection...")

try:
    conn = psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        connect_timeout=10
    )

    print("✅ CONNECTION SUCCESSFUL!")

    # Get cursor
    cur = conn.cursor()

    # Test 1: Get PostgreSQL version
    print("\n" + "=" * 70)
    print("DATABASE INFO")
    print("=" * 70)

    cur.execute("SELECT version();")
    version = cur.fetchone()[0]
    print(f"\nPostgreSQL Version:\n{version}\n")

    # Test 2: List all tables
    cur.execute("""
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name;
    """)
    tables = cur.fetchall()

    print(f"Found {len(tables)} tables in 'public' schema:")
    for i, (table_name,) in enumerate(tables, 1):
        print(f"  {i:2}. {table_name}")

    # Test 3: Check dimensional tables specifically
    print("\n" + "=" * 70)
    print("DIMENSIONAL MODEL TABLES")
    print("=" * 70)

    dimensional_tables = [
        'dim_exams',
        'dim_subjects',
        'dim_topics',
        'bridge_exam_subject_topic',
        'fact_exam_questions'
    ]

    for table in dimensional_tables:
        cur.execute(f"SELECT COUNT(*) FROM {table};")
        count = cur.fetchone()[0]
        status = "✅" if count > 0 else "⚠️"
        print(f"{status} {table:30} : {count:6,} rows")

    # Test 4: Check if migration already ran
    print("\n" + "=" * 70)
    print("MIGRATION STATUS CHECK")
    print("=" * 70)

    # Check for shared subjects (migration creates these)
    cur.execute("""
        SELECT COUNT(*)
        FROM dim_subjects
        WHERE subject_code NOT LIKE '%-%';
    """)
    shared_subjects = cur.fetchone()[0]

    # Check for migration map table
    cur.execute("""
        SELECT EXISTS(
            SELECT 1
            FROM information_schema.tables
            WHERE table_name = 'subject_migration_map'
        );
    """)
    map_exists = cur.fetchone()[0]

    print(f"\nShared subjects (no hyphen): {shared_subjects}")
    print(f"Migration map table exists: {map_exists}")

    if shared_subjects > 0 or map_exists:
        print("\n⚠️  WARNING: Migration may have already been executed!")
        print("   Expected shared subjects: 0 (before migration)")
        print("   Expected migration map: False (before migration)")
    else:
        print("\n✅ Database is ready for migration")
        print("   No shared subjects found (expected before migration)")
        print("   No migration map table (expected before migration)")

    # Test 5: Sample data check
    print("\n" + "=" * 70)
    print("SAMPLE DATA")
    print("=" * 70)

    # Show a few subjects
    cur.execute("""
        SELECT subject_code, subject_name
        FROM dim_subjects
        LIMIT 5;
    """)
    subjects = cur.fetchall()

    print("\nFirst 5 subjects:")
    for code, name in subjects:
        print(f"  {code:20} : {name}")

    # Close connection
    cur.close()
    conn.close()

    print("\n" + "=" * 70)
    print("CONNECTION TEST COMPLETE - ALL SYSTEMS GO! 🚀")
    print("=" * 70)
    print("\nYou can now run the migration script.")

except Exception as e:
    print(f"\n❌ CONNECTION FAILED!")
    print(f"\nError: {e}")
    print(f"\nError Type: {type(e).__name__}")

    # Debug info
    print("\n" + "=" * 70)
    print("TROUBLESHOOTING")
    print("=" * 70)
    print("\n1. Check if the password is correct")
    print("2. Check if your IP is allowed in Supabase")
    print("   → Go to: https://supabase.com/dashboard/project/zomcofptwlumqkeffbht/settings/database")
    print("   → Check 'Connection Pooling' settings")
    print("3. Check if network allows PostgreSQL port 5432")

    sys.exit(1)
