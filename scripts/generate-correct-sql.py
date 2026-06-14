#!/usr/bin/env python3
"""
Generate CORRECT SQL files for English questions
Validates path_id is only 'ielts' or 'toefl'
"""

import json
from pathlib import Path

def escape_sql_string(s):
    if s is None:
        return 'NULL'
    return "'" + str(s).replace("'", "''").replace("\\", "\\\\") + "'"

def normalize_topic(topic):
    """Convert topic to topicId format"""
    return topic.lower().replace(' ', '-').replace('&', 'and').replace(',', '').replace('/', '-')

def process_batch(batch_num):
    artifacts_dir = Path('.agents/artifacts')
    batch_file = artifacts_dir / f'english-batch-0{batch_num}.json'

    with open(batch_file, 'r', encoding='utf-8') as f:
        batch = json.load(f)

    sql_lines = [
        f"-- Batch {batch_num}: English Questions Upload",
        f"-- VERIFIED: path_id will be 'ielts' or 'toefl' only",
        "",
        "BEGIN;",
        ""
    ]

    question_count = 0

    for passage in batch['passages']:
        # CRITICAL: Validate exam type
        if passage['exam'] not in ['IELTS', 'TOEFL']:
            print(f"ERROR: Invalid exam type '{passage['exam']}' in batch {batch_num}")
            continue

        path_id = 'ielts' if passage['exam'] == 'IELTS' else 'toefl'

        # Validate path_id is correct
        if path_id not in ['ielts', 'toefl']:
            print(f"ERROR: Invalid path_id '{path_id}' generated!")
            continue

        topic_id = normalize_topic(passage['topic'])
        difficulty_map = {'easy': 'beginner', 'medium': 'intermediate', 'hard': 'advanced'}
        level = difficulty_map.get(passage['difficulty'], 'intermediate')

        for q in passage['questions']:
            question_text = q.get('question') or q.get('statement') or ''

            if 'options' in q and q['options']:
                options = q['options']
            elif q.get('questionType') == 'true-false-not-given':
                options = ['TRUE', 'FALSE', 'NOT GIVEN']
            elif q.get('questionType') == 'yes-no-not-given':
                options = ['YES', 'NO', 'NOT GIVEN']
            else:
                correct = q.get('correctAnswer', '')
                acceptable = q.get('acceptableAnswers', [])
                options = [correct] + acceptable[:3]

            while len(options) < 4:
                options.append('')
            options = options[:4]

            correct_answer_idx = 0
            if isinstance(q.get('correctAnswer'), int):
                correct_answer_idx = q['correctAnswer']
            elif isinstance(q.get('correctAnswer'), str):
                answer_str = q['correctAnswer']
                if answer_str == 'TRUE': correct_answer_idx = 0
                elif answer_str == 'FALSE': correct_answer_idx = 1
                elif answer_str == 'NOT GIVEN': correct_answer_idx = 2
                elif answer_str == 'YES': correct_answer_idx = 0
                elif answer_str == 'NO': correct_answer_idx = 1

            explanation = f"[{q.get('questionType', 'unknown').upper()}] {q.get('explanation', '')}\n\n"
            explanation += f"Passage Reference: {q.get('passageReference', 'N/A')}\n"
            explanation += f"Skill: {q.get('skill', 'N/A')}"

            sql = f"""INSERT INTO english_questions (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty, passage)
VALUES (
  {escape_sql_string(path_id)},
  {escape_sql_string(topic_id)},
  {escape_sql_string(level)},
  {escape_sql_string(question_text)},
  ARRAY[{', '.join(escape_sql_string(opt) for opt in options)}],
  {correct_answer_idx},
  {escape_sql_string(explanation)},
  {escape_sql_string(passage['difficulty'])},
  {escape_sql_string(passage['passage'])}
);"""

            sql_lines.append(sql)
            question_count += 1

    sql_lines.append("")
    sql_lines.append("COMMIT;")

    output_file = artifacts_dir / f'CORRECT-batch-0{batch_num}.sql'
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_lines))

    return output_file.name, question_count

# Regenerate all batches
print("Generating CORRECT SQL files...\n")
total = 0
for i in range(1, 7):
    try:
        filename, count = process_batch(i)
        total += count
        print(f"✅ Batch {i}: {count} questions → {filename}")
    except Exception as e:
        print(f"❌ Batch {i} failed: {e}")

print(f"\n✅ Total: {total} questions generated")
print("\nCopying to Desktop...")

import shutil
for i in range(1, 7):
    src = Path('.agents/artifacts') / f'CORRECT-batch-0{i}.sql'
    if src.exists():
        dst = Path.home() / 'Desktop' / f'CORRECT-batch-0{i}.sql'
        shutil.copy(src, dst)
        print(f"  → {dst.name}")

print("\n✅ Ready to upload!")
print("\nUpload in order: CORRECT-batch-01.sql through CORRECT-batch-06.sql")
