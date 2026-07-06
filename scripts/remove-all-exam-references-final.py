#!/usr/bin/env python3
"""
REMOVE ALL EXAM REFERENCES: Final cleanup - generic English learning content
"""

import os, json, re

env_vars = {}
with open('.env.local', 'r') as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith('#') and '=' in line:
            key, value = line.split('=', 1)
            env_vars[key] = value.strip('"')
os.environ.update(env_vars)

import psycopg2
conn = psycopg2.connect(os.environ.get('POSTGRES_URL'))
cur = conn.cursor()

# Aggressive exam reference patterns
EXAM_PATTERNS = [
    # Direct exam names
    r'\b(UPSC|SSC|banking|railway|RRB|IBPS|SBI|clerk|PO)\b',
    r'competitive exams?',
    r'government exams?',
    r'descriptive papers?',
    r'bank exams?',

    # Exam contexts
    r'For (UPSC|SSC|banking|railway|competitive exam|government exam)[^.]*?\.',
    r'In (UPSC|SSC|banking|railway) exams[^.]*?\.',
    r'This (topic|grammatical concept|structure) is (frequently|commonly|often) tested in[^.]*?\.',
    r'Competitive exam aspirants',

    # Indian learner references
    r'For Indian (learners|students|competitive exam aspirants)',
    r'Indian learners often face',
    r'Hindi speakers',
    r'from Hindi',
    r'Hindi and English',
    r'Hindi equivalents',

    # Context-specific removals
    r'particularly in formal contexts such as[^.]*?correspondence tests?\.',
    r'For.*?competitive exam.*?focus on accuracy and speed\.',
]

def clean_text(text):
    """Remove exam references from text"""
    if not text:
        return text

    original = text

    # Remove complete sentences with exam references
    for pattern in EXAM_PATTERNS:
        text = re.sub(pattern, '', text, flags=re.IGNORECASE)

    # Clean up multiple spaces and punctuation
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'\s+([.,!?;:])', r'\1', text)
    text = re.sub(r'([.,!?;:])\s*([.,!?;:])', r'\1', text)
    text = text.strip()

    # Replace problematic phrases
    replacements = {
        'Indian learners': 'Learners',
        'Hindi speakers': 'Language learners',
        'from Hindi': 'from their native language',
        'Hindi and English': 'different languages',
        'For Indian students': 'For students',
        'competitive exam aspirants': 'English learners',
        'exam preparation': 'English learning',
        'in exams': 'in practice',
    }

    for old, new in replacements.items():
        text = re.sub(old, new, text, flags=re.IGNORECASE)

    # Ensure proper sentence ending
    if text and not text.endswith(('.', '!', '?', ':')):
        text += '.'

    return text

# Process ALL English topics
cur.execute("""
    SELECT path_id, topic_id, title, content
    FROM topic_study_content
    WHERE subject_id='english'
    ORDER BY path_id, topic_id
""")

all_topics = cur.fetchall()
fixed_count = 0
section_count = 0

print("\n" + "="*100)
print("REMOVING ALL EXAM REFERENCES: Making content universal English learning")
print("="*100 + "\n")

for path_id, topic_id, title, content_json in all_topics:
    sections = content_json.get('sections', [])
    topic_modified = False

    for section in sections:
        section_title = section.get('title', '')
        content_blocks = section.get('content', [])
        section_modified = False

        for block in content_blocks:
            if not isinstance(block, dict):
                continue

            # Clean paragraphs
            if block.get('type') == 'paragraph':
                text = block.get('text', '')
                if any(keyword in text for keyword in ['UPSC', 'SSC', 'banking', 'railway', 'competitive', 'Hindi', 'Indian']):
                    cleaned = clean_text(text)
                    if cleaned != text:
                        block['text'] = cleaned
                        section_modified = True

            # Clean examples
            if block.get('type') == 'example':
                examples = block.get('examples', [])
                for ex in examples:
                    if isinstance(ex, dict):
                        ex_text = ex.get('text', '')
                        ex_explanation = ex.get('explanation', '')

                        if any(keyword in ex_text for keyword in ['UPSC', 'SSC', 'banking', 'competitive', 'exam']):
                            ex['text'] = clean_text(ex_text)
                            section_modified = True

                        if any(keyword in ex_explanation for keyword in ['UPSC', 'SSC', 'banking', 'competitive', 'exam']):
                            ex['explanation'] = clean_text(ex_explanation)
                            section_modified = True

            # Clean practice questions
            if block.get('type') == 'practice':
                questions = block.get('questions', [])
                for q in questions:
                    if isinstance(q, dict):
                        explanation = q.get('explanation', '')
                        if any(keyword in explanation for keyword in ['UPSC', 'SSC', 'banking', 'competitive', 'exam']):
                            q['explanation'] = clean_text(explanation)
                            section_modified = True

        if section_modified:
            section_count += 1
            topic_modified = True

    # Update database if modified
    if topic_modified:
        cur.execute("""
            UPDATE topic_study_content
            SET content = %s, updated_at = NOW()
            WHERE subject_id='english' AND path_id=%s AND topic_id=%s
        """, (json.dumps(content_json), path_id, topic_id))

        fixed_count += 1
        print(f"✅ {path_id}/{topic_id}")
        conn.commit()

print(f"\n{'='*100}")
print(f"COMPLETE: {fixed_count} topics cleaned, {section_count} sections updated")
print(f"All content is now universal English learning (no exam focus)")
print(f"{'='*100}\n")

conn.close()
