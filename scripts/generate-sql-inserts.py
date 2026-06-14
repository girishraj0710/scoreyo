#!/usr/bin/env python3
"""
Generate SQL INSERT statements for English questions
Can be run directly in Supabase SQL editor
"""

import json
import os
from pathlib import Path

def escape_sql_string(s):
    """Escape single quotes for SQL"""
    if s is None:
        return 'NULL'
    return "'" + str(s).replace("'", "''").replace("\\", "\\\\") + "'"

def normalize_topic(topic):
    """Convert topic to topicId format"""
    return topic.lower().replace(' ', '-').replace('&', 'and').replace(',', '').replace('/', '-')

def process_batch(batch_path):
    """Process a single batch file and generate SQL"""
    with open(batch_path, 'r', encoding='utf-8') as f:
        batch = json.load(f)

    sql_statements = []

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
                # For fill-in questions, use the correct answer as first option
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
                # Otherwise keep 0 (answer is in options[0])

            # Build explanation with metadata
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

            sql_statements.append(sql)

    return sql_statements

def main():
    artifacts_dir = Path(__file__).parent.parent / '.agents' / 'artifacts'
    output_file = Path(__file__).parent.parent / '.agents' / 'artifacts' / 'upload-questions.sql'

    all_sql = []
    all_sql.append("-- English Questions Upload SQL")
    all_sql.append("-- Generated for direct execution in Supabase SQL editor")
    all_sql.append("-- Total: 216 questions across 6 batches\n")
    all_sql.append("BEGIN;\n")

    for i in range(1, 7):
        batch_file = artifacts_dir / f'english-batch-0{i}.json'
        if batch_file.exists():
            print(f"Processing batch {i}...")
            statements = process_batch(batch_file)
            all_sql.append(f"-- Batch {i}: {len(statements)} questions")
            all_sql.extend(statements)
            all_sql.append("")

    all_sql.append("\nCOMMIT;")

    # Write to file
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(all_sql))

    print(f"\n✅ SQL file generated: {output_file}")
    print(f"Total statements: {len([s for s in all_sql if s.startswith('INSERT')])}")
    print("\nTo upload:")
    print("1. Open Supabase dashboard → SQL Editor")
    print("2. Copy contents of upload-questions.sql")
    print("3. Paste and run")

if __name__ == '__main__':
    main()
