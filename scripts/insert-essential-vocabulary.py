#!/usr/bin/env python3
import psycopg2
from urllib.parse import urlparse, unquote

POSTGRES_URL = "postgresql://postgres.zomcofptwlumqkeffbht:PrepGenie2026Secure%21%40%23@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"

parsed = urlparse(POSTGRES_URL)
conn = psycopg2.connect(
    host=parsed.hostname,
    port=parsed.port or 5432,
    database=parsed.path[1:],
    user=parsed.username,
    password=unquote(parsed.password)
)
cur = conn.cursor()

print("📄 Inserting essential-vocabulary-150Q.sql...")

with open('output/essential-vocabulary-150Q.sql', 'r', encoding='utf-8') as f:
    sql_content = f.read()

# Extract INSERT statements
lines = []
in_insert = False
for line in sql_content.split('\n'):
    stripped = line.strip()
    if stripped.startswith('INSERT INTO'):
        in_insert = True
        lines.append(line)
    elif in_insert:
        lines.append(line)
        if stripped.endswith(';'):
            break

insert_sql = '\n'.join(lines)
cur.execute(insert_sql)
conn.commit()

# Verify
cur.execute("SELECT COUNT(*) FROM english_questions WHERE topic_id = 'essential-vocabulary'")
count = cur.fetchone()[0]
print(f"✅ Inserted {count}/150 questions for essential-vocabulary")

cur.close()
conn.close()
