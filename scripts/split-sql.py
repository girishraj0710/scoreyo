#!/usr/bin/env python3
"""
Split large SQL file into smaller chunks for Supabase SQL Editor
Each chunk will have ~36 questions (1 batch)
"""

import json
from pathlib import Path

def escape_sql_string(s):
    """Escape single quotes for SQL"""
    if s is None:
        return 'NULL'
    return "'" + str(s).replace("'", "''").replace("\\", "\\\\") + "'"

def normalize_topic(topic):
    """Convert topic to topicId format"""
    return topic.lower().replace(' ', '-').replace('&', 'and').replace(',', '').replace('/', '-')

def process_single_batch(batch_path, output_path, batch_num):
    """Process a single batch file and generate SQL"""
    with open(batch_path, 'r', encoding='utf-8') as f:
        batch = json.load(f)

    sql_lines = []
    sql_lines.append(f"-- Batch {batch_num}: English Questions Upload")
    sql_lines.append(f"-- {len([q for p in batch['passages'] for q in p['questions']])} questions")
    sql_lines.append("")
    sql_lines.append("BEGIN;")
    sql_lines.append("")

    for passage in batch['passages']:
        path_id = 'ielts' if passage['exam'] == 'IELTS' else 'toefl'
        topic_id = normalize_topic(passage['topic'])

        # Map difficulty
        difficulty_map = {'easy': 'beginner', 'medium': 'intermediate', 'hard': 'advanced'}
        level = difficulty_map.get(passage['difficulty'], 'intermediate')

        for q in passage['questions']:
            # Get question text
            question_text = q.get('question') or q.get('statement') or ''

            # Build options array
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

            # Ensure exactly 4 options
            while len(options) < 4:
                options.append('')
            options = options[:4]

            # Determine correct answer index
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

            # Build explanation
            explanation = f"[{q.get('questionType', 'unknown').upper()}] {q.get('explanation', '')}\n\n"
            explanation += f"Passage Reference: {q.get('passageReference', 'N/A')}\n"
            explanation += f"Skill: {q.get('skill', 'N/A')}"

            # Build SQL INSERT
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

    sql_lines.append("")
    sql_lines.append("COMMIT;")

    # Write to file
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_lines))

    return len([q for p in batch['passages'] for q in p['questions']])

def main():
    artifacts_dir = Path(__file__).parent.parent / '.agents' / 'artifacts'

    print("Splitting SQL into 6 separate files (one per batch)...\n")

    total = 0
    for i in range(1, 7):
        batch_file = artifacts_dir / f'english-batch-0{i}.json'
        output_file = artifacts_dir / f'upload-batch-0{i}.sql'

        if batch_file.exists():
            count = process_single_batch(batch_file, output_file, i)
            total += count
            print(f"✅ Batch {i}: {count} questions → {output_file.name}")

    print(f"\n✅ Complete! {total} total questions split into 6 files")
    print("\nTo upload:")
    print("1. Open Supabase SQL Editor")
    print("2. Copy and run upload-batch-01.sql")
    print("3. Copy and run upload-batch-02.sql")
    print("4. Continue through upload-batch-06.sql")
    print("\nEach file is small enough for SQL Editor")

if __name__ == '__main__':
    main()
