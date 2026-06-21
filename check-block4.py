import os, json, psycopg2
from urllib.parse import urlparse, unquote

POSTGRES_URL = os.environ.get('POSTGRES_URL', "postgresql://postgres.zomcofptwlumqkeffbht:PrepGenie2026Secure%21%40%23@aws-1-ap-south-1.pooler.supabase.com:6543/postgres")
parsed = urlparse(POSTGRES_URL)
conn = psycopg2.connect(host=parsed.hostname, port=parsed.port or 5432, database=parsed.path[1:], user=parsed.username, password=unquote(parsed.password))
cur = conn.cursor()

cur.execute("SELECT content FROM topic_study_content WHERE subject_id='english' AND path_id='ielts-toefl' AND topic_id='ielts-writing'")
content_json = cur.fetchone()[0]
block4 = content_json['sections'][7]['content'][3]

print("Block 4 complete structure:")
print(json.dumps(block4, indent=2))

cur.close()
conn.close()
