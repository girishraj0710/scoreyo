#!/usr/bin/env python3
"""
Convert JSON question files to SQL INSERT statements
"""

import json
import sys
from pathlib import Path

def escape_sql_string(s):
    """Escape single quotes for SQL"""
    if s is None:
        return 'NULL'
    return "'" + str(s).replace("'", "''").replace("\\", "\\\\") + "'"

def convert_json_to_sql(json_file, output_sql_file):
    """Convert JSON questions to SQL INSERT statements"""

    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    sql_lines = [
        f"-- English Questions: {data['topic_name']}",
        f"-- Topic ID: {data['topic_id']}",
        f"-- Path: {data['path_id']}",
        f"-- Level: {data['level']}",
        f"-- Difficulty: {data['difficulty']}",
        f"-- Generated: {len(data['questions'])} questions",
        "",
        "BEGIN;",
        ""
    ]

    for q in data['questions']:
        question_text = q['question']
        options = q['options'][:4]  # Ensure exactly 4 options
        while len(options) < 4:
            options.append('')

        correct_answer = q['correctAnswer']
        explanation = q['explanation']
        skill = q.get('skill', 'General')

        # Build full explanation with skill
        full_explanation = f"{explanation}\n\nSkill: {skill}"

        sql = f"""INSERT INTO english_questions (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty, passage)
VALUES (
  {escape_sql_string(data['path_id'])},
  {escape_sql_string(data['topic_id'])},
  {escape_sql_string(data['level'])},
  {escape_sql_string(question_text)},
  ARRAY[{', '.join(escape_sql_string(opt) for opt in options)}],
  {correct_answer},
  {escape_sql_string(full_explanation)},
  {escape_sql_string(data['difficulty'])},
  NULL
);"""

        sql_lines.append(sql)

    sql_lines.append("")
    sql_lines.append("COMMIT;")

    with open(output_sql_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_lines))

    return len(data['questions'])

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 json-to-sql-converter.py <json-file> [output-sql-file]")
        print("\nExample: python3 json-to-sql-converter.py foundation-present-simple-batch-01-MANUAL.json")
        return

    json_file = Path(sys.argv[1])
    if not json_file.exists():
        print(f"❌ Error: File not found: {json_file}")
        return

    if len(sys.argv) >= 3:
        output_sql_file = Path(sys.argv[2])
    else:
        output_sql_file = json_file.with_suffix('.sql')

    try:
        question_count = convert_json_to_sql(json_file, output_sql_file)
        print(f"✅ Converted {question_count} questions")
        print(f"✅ JSON: {json_file}")
        print(f"✅ SQL:  {output_sql_file}")
        print(f"\n🚀 Ready to upload to Supabase SQL Editor!")
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()
