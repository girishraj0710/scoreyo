#!/usr/bin/env python3
"""
AI-powered English question generation using OpenRouter API
Generates high-quality questions based on standard English materials
"""

import json
import os
import requests
from pathlib import Path

# OpenRouter API configuration
# Try to load from .env.local file
def load_env_file():
    env_path = Path(__file__).parent.parent / '.env.local'
    if env_path.exists():
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key] = value

load_env_file()
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

def generate_questions_with_ai(topic_config):
    """
    Generate questions using AI based on topic configuration

    topic_config should contain:
    - topic_id: str
    - topic_name: str
    - path_id: str ('foundation', 'competitive-exam', 'ielts', 'toefl', 'real-world')
    - level: str ('beginner', 'intermediate', 'advanced')
    - difficulty: str ('easy', 'medium', 'hard')
    - target_questions: int
    - subtopics: list[str]
    - standard_materials: list[str]
    """

    prompt = f"""You are an expert English language teacher following British Council, Cambridge, and Oxford standards.

Generate {topic_config['target_questions']} high-quality multiple-choice questions for:

**Topic:** {topic_config['topic_name']}
**Level:** {topic_config['level']} (CEFR A1-B1)
**Difficulty:** {topic_config['difficulty']}
**Subtopics to cover:** {', '.join(topic_config['subtopics'])}

**Standard Materials Reference:**
{chr(10).join(f"- {material}" for material in topic_config['standard_materials'])}

**Question Format Requirements:**
1. Each question must have exactly 4 options
2. 1 correct answer, 3 plausible distractors based on common learner errors
3. Rich explanation including:
   - Clear rule statement
   - Why the correct answer is right
   - Why each distractor is wrong (briefly)
   - 2-3 example sentences
   - Common mistakes (especially for Indian learners)
   - Trap alerts (what confuses learners)

**JSON Output Format:**
{{
  "topic_id": "{topic_config['topic_id']}",
  "topic_name": "{topic_config['topic_name']}",
  "path_id": "{topic_config['path_id']}",
  "level": "{topic_config['level']}",
  "difficulty": "{topic_config['difficulty']}",
  "questions": [
    {{
      "question": "Complete the sentence: She ___ coffee every morning.",
      "options": [
        "drink",
        "drinks",
        "drinking",
        "drank"
      ],
      "correctAnswer": 1,
      "explanation": "**RULE:** In Present Simple tense, with third-person singular subjects (he, she, it), we add -s or -es to the base verb.\\n\\n**WHY CORRECT:** 'drinks' is correct because 'She' is a third-person singular subject, and 'coffee every morning' indicates a daily habit (Present Simple).\\n\\n**WHY WRONG:**\\n- 'drink' (option 0): Missing -s for third person\\n- 'drinking' (option 2): This is present continuous form, not simple present\\n- 'drank' (option 3): This is past tense, but 'every morning' indicates present habit\\n\\n**EXAMPLES:**\\n- He plays football every Saturday. (habit)\\n- The sun rises in the east. (fact)\\n- My sister works at a bank. (routine)\\n\\n**COMMON MISTAKE:** Indian learners often forget to add -s/-es with he/she/it because Hindi verbs don't change based on person.\\n\\n**TRAP ALERT:** 'every morning' is a time expression that triggers Present Simple, not Present Continuous.",
      "skill": "Subject-Verb Agreement in Present Simple"
    }}
  ]
}}

**CRITICAL RULES:**
- NO markdown code blocks in output (no ```json```)
- Return ONLY valid JSON
- All strings must use double quotes, not single quotes
- Escape special characters in strings (use \\n for newlines, \\" for quotes)
- Cover ALL subtopics evenly
- Vary question difficulty: 40% easy, 40% medium, 20% hard
- Base distractors on real learner errors
- Reference standard materials' teaching patterns

Generate {topic_config['target_questions']} questions now:"""

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://scoreyo.in",
        "X-Title": "Scoreyo English Question Generator"
    }

    payload = {
        "model": "google/gemini-2.0-flash-exp:free",
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "temperature": 0.7,
        "max_tokens": 16000
    }

    print(f"🤖 Calling OpenRouter API to generate {topic_config['target_questions']} questions...")
    print(f"   Model: google/gemini-2.0-flash-exp:free")
    print(f"   Topic: {topic_config['topic_name']}")

    response = requests.post(OPENROUTER_API_URL, headers=headers, json=payload)

    if response.status_code != 200:
        raise Exception(f"OpenRouter API error: {response.status_code} - {response.text}")

    result = response.json()
    content = result['choices'][0]['message']['content']

    # Clean up response (remove markdown code blocks if present)
    content = content.strip()
    if content.startswith("```json"):
        content = content[7:]
    elif content.startswith("```"):
        content = content[3:]
    if content.endswith("```"):
        content = content[:-3]
    content = content.strip()

    # Find JSON object boundaries
    start_idx = content.find('{')
    end_idx = content.rfind('}') + 1

    if start_idx == -1 or end_idx == 0:
        raise Exception(f"No valid JSON found in response: {content[:200]}")

    json_str = content[start_idx:end_idx]

    try:
        questions_data = json.loads(json_str)
        return questions_data
    except json.JSONDecodeError as e:
        print(f"❌ JSON parse error: {e}")
        print(f"Response preview: {json_str[:500]}")
        raise


def escape_sql_string(s):
    """Escape single quotes for SQL"""
    if s is None:
        return 'NULL'
    return "'" + str(s).replace("'", "''").replace("\\", "\\\\") + "'"


def generate_sql_inserts(questions_data, output_file):
    """Convert JSON questions to SQL INSERT statements"""

    sql_lines = [
        f"-- English Questions: {questions_data['topic_name']}",
        f"-- Topic ID: {questions_data['topic_id']}",
        f"-- Path: {questions_data['path_id']}",
        f"-- Level: {questions_data['level']}",
        f"-- Generated: {len(questions_data['questions'])} questions",
        "",
        "BEGIN;",
        ""
    ]

    for q in questions_data['questions']:
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
  {escape_sql_string(questions_data['path_id'])},
  {escape_sql_string(questions_data['topic_id'])},
  {escape_sql_string(questions_data['level'])},
  {escape_sql_string(question_text)},
  ARRAY[{', '.join(escape_sql_string(opt) for opt in options)}],
  {correct_answer},
  {escape_sql_string(full_explanation)},
  {escape_sql_string(questions_data['difficulty'])},
  NULL
);"""

        sql_lines.append(sql)

    sql_lines.append("")
    sql_lines.append("COMMIT;")

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_lines))

    return output_file


def main():
    """Generate questions for Present Simple Tense (Phase 1, Topic 1)"""

    if not OPENROUTER_API_KEY:
        print("❌ ERROR: OPENROUTER_API_KEY environment variable not set")
        print("   Set it with: export OPENROUTER_API_KEY='your-key-here'")
        return

    # Phase 1, Topic 1: Present Simple Tense
    topic_config = {
        "topic_id": "present-simple",
        "topic_name": "Present Simple Tense",
        "path_id": "foundation",
        "level": "beginner",
        "difficulty": "easy",
        "target_questions": 50,  # Start with 50, then generate remaining 50 in batch 2
        "subtopics": [
            "Basic Structure (Subject + Verb)",
            "Adding -s/-es to verbs (he/she/it)",
            "Negative Form (don't/doesn't)",
            "Question Form (Do/Does)",
            "Time Expressions (every day, always, usually, often, sometimes)"
        ],
        "standard_materials": [
            "British Council LearnEnglish Grammar - Present Simple",
            "Cambridge Grammar in Use (Raymond Murphy) - Unit 5-6",
            "Oxford Practice Grammar Basic - Unit 1-4",
            "Essential Grammar in Use (Cambridge) - Units 3-7"
        ]
    }

    try:
        # Generate questions using AI
        questions_data = generate_questions_with_ai(topic_config)

        print(f"\n✅ Generated {len(questions_data['questions'])} questions")

        # Save JSON
        artifacts_dir = Path('.agents/artifacts')
        artifacts_dir.mkdir(parents=True, exist_ok=True)

        json_file = artifacts_dir / 'foundation-present-simple-batch-01.json'
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(questions_data, f, indent=2, ensure_ascii=False)

        print(f"✅ Saved JSON: {json_file}")

        # Generate SQL
        sql_file = artifacts_dir / 'foundation-present-simple-batch-01.sql'
        generate_sql_inserts(questions_data, sql_file)

        print(f"✅ Saved SQL: {sql_file}")
        print(f"\n📊 Summary:")
        print(f"   Topic: {questions_data['topic_name']}")
        print(f"   Questions: {len(questions_data['questions'])}")
        print(f"   Path: {questions_data['path_id']}")
        print(f"   Level: {questions_data['level']}")
        print(f"\n🚀 Ready to upload to Supabase!")
        print(f"\n📝 Next: Review questions in {json_file}, then upload {sql_file} to Supabase SQL Editor")

    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    main()
