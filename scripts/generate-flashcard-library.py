#!/usr/bin/env python3
"""
Generate Pre-Made Flashcard Library
Creates public decks for top 100 topics across all major exams
One-time setup script
"""

import requests
import time
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

API_BASE = "http://localhost:3000"
OPENROUTER_KEY = os.getenv("OPENROUTER_API_KEY")

# Top 100 topics across major exams
TOPICS = [
    # JEE Main Physics (10 topics)
    {"examId": "jee", "subjectId": "physics", "exam": "JEE Main", "subject": "Physics", "topic": "Mechanics"},
    {"examId": "jee", "subjectId": "physics", "exam": "JEE Main", "subject": "Physics", "topic": "Thermodynamics"},
    {"examId": "jee", "subjectId": "physics", "exam": "JEE Main", "subject": "Physics", "topic": "Electrostatics"},
    {"examId": "jee", "subjectId": "physics", "exam": "JEE Main", "subject": "Physics", "topic": "Current Electricity"},
    {"examId": "jee", "subjectId": "physics", "exam": "JEE Main", "subject": "Physics", "topic": "Magnetism"},
    {"examId": "jee", "subjectId": "physics", "exam": "JEE Main", "subject": "Physics", "topic": "Optics"},
    {"examId": "jee", "subjectId": "physics", "exam": "JEE Main", "subject": "Physics", "topic": "Modern Physics"},
    {"examId": "jee", "subjectId": "physics", "exam": "JEE Main", "subject": "Physics", "topic": "Waves"},
    {"examId": "jee", "subjectId": "physics", "exam": "JEE Main", "subject": "Physics", "topic": "Rotational Motion"},
    {"examId": "jee", "subjectId": "physics", "exam": "JEE Main", "subject": "Physics", "topic": "Gravitation"},

    # JEE Main Chemistry (10 topics)
    {"examId": "jee", "subjectId": "chemistry", "exam": "JEE Main", "subject": "Chemistry", "topic": "Organic Chemistry Basics"},
    {"examId": "jee", "subjectId": "chemistry", "exam": "JEE Main", "subject": "Chemistry", "topic": "Alkanes and Alkenes"},
    {"examId": "jee", "subjectId": "chemistry", "exam": "JEE Main", "subject": "Chemistry", "topic": "Alcohols and Ethers"},
    {"examId": "jee", "subjectId": "chemistry", "exam": "JEE Main", "subject": "Chemistry", "topic": "Chemical Bonding"},
    {"examId": "jee", "subjectId": "chemistry", "exam": "JEE Main", "subject": "Chemistry", "topic": "Periodic Table"},
    {"examId": "jee", "subjectId": "chemistry", "exam": "JEE Main", "subject": "Chemistry", "topic": "Thermodynamics"},
    {"examId": "jee", "subjectId": "chemistry", "exam": "JEE Main", "subject": "Chemistry", "topic": "Equilibrium"},
    {"examId": "jee", "subjectId": "chemistry", "exam": "JEE Main", "subject": "Chemistry", "topic": "Electrochemistry"},
    {"examId": "jee", "subjectId": "chemistry", "exam": "JEE Main", "subject": "Chemistry", "topic": "Coordination Compounds"},
    {"examId": "jee", "subjectId": "chemistry", "exam": "JEE Main", "subject": "Chemistry", "topic": "Redox Reactions"},

    # JEE Main Mathematics (10 topics)
    {"examId": "jee", "subjectId": "mathematics", "exam": "JEE Main", "subject": "Mathematics", "topic": "Calculus"},
    {"examId": "jee", "subjectId": "mathematics", "exam": "JEE Main", "subject": "Mathematics", "topic": "Algebra"},
    {"examId": "jee", "subjectId": "mathematics", "exam": "JEE Main", "subject": "Mathematics", "topic": "Coordinate Geometry"},
    {"examId": "jee", "subjectId": "mathematics", "exam": "JEE Main", "subject": "Mathematics", "topic": "Trigonometry"},
    {"examId": "jee", "subjectId": "mathematics", "exam": "JEE Main", "subject": "Mathematics", "topic": "Probability"},
    {"examId": "jee", "subjectId": "mathematics", "exam": "JEE Main", "subject": "Mathematics", "topic": "Vectors"},
    {"examId": "jee", "subjectId": "mathematics", "exam": "JEE Main", "subject": "Mathematics", "topic": "3D Geometry"},
    {"examId": "jee", "subjectId": "mathematics", "exam": "JEE Main", "subject": "Mathematics", "topic": "Matrices"},
    {"examId": "jee", "subjectId": "mathematics", "exam": "JEE Main", "subject": "Mathematics", "topic": "Differential Equations"},
    {"examId": "jee", "subjectId": "mathematics", "exam": "JEE Main", "subject": "Mathematics", "topic": "Sequences and Series"},

    # NEET Biology (10 topics)
    {"examId": "neet", "subjectId": "biology", "exam": "NEET", "subject": "Biology", "topic": "Cell Biology"},
    {"examId": "neet", "subjectId": "biology", "exam": "NEET", "subject": "Biology", "topic": "Genetics"},
    {"examId": "neet", "subjectId": "biology", "exam": "NEET", "subject": "Biology", "topic": "Human Physiology"},
    {"examId": "neet", "subjectId": "biology", "exam": "NEET", "subject": "Biology", "topic": "Plant Physiology"},
    {"examId": "neet", "subjectId": "biology", "exam": "NEET", "subject": "Biology", "topic": "Ecology"},
    {"examId": "neet", "subjectId": "biology", "exam": "NEET", "subject": "Biology", "topic": "Evolution"},
    {"examId": "neet", "subjectId": "biology", "exam": "NEET", "subject": "Biology", "topic": "Reproduction"},
    {"examId": "neet", "subjectId": "biology", "exam": "NEET", "subject": "Biology", "topic": "Biotechnology"},
    {"examId": "neet", "subjectId": "biology", "exam": "NEET", "subject": "Biology", "topic": "Human Health"},
    {"examId": "neet", "subjectId": "biology", "exam": "NEET", "subject": "Biology", "topic": "Biodiversity"},

    # UPSC Polity (10 topics)
    {"examId": "upsc", "subjectId": "polity", "exam": "UPSC", "subject": "Polity", "topic": "Indian Constitution"},
    {"examId": "upsc", "subjectId": "polity", "exam": "UPSC", "subject": "Polity", "topic": "Fundamental Rights"},
    {"examId": "upsc", "subjectId": "polity", "exam": "UPSC", "subject": "Polity", "topic": "Directive Principles"},
    {"examId": "upsc", "subjectId": "polity", "exam": "UPSC", "subject": "Polity", "topic": "Parliament"},
    {"examId": "upsc", "subjectId": "polity", "exam": "UPSC", "subject": "Polity", "topic": "Judiciary"},
    {"examId": "upsc", "subjectId": "polity", "exam": "UPSC", "subject": "Polity", "topic": "President and VP"},
    {"examId": "upsc", "subjectId": "polity", "exam": "UPSC", "subject": "Polity", "topic": "Prime Minister"},
    {"examId": "upsc", "subjectId": "polity", "exam": "UPSC", "subject": "Polity", "topic": "State Government"},
    {"examId": "upsc", "subjectId": "polity", "exam": "UPSC", "subject": "Polity", "topic": "Local Government"},
    {"examId": "upsc", "subjectId": "polity", "exam": "UPSC", "subject": "Polity", "topic": "Constitutional Amendments"},

    # UPSC History (10 topics)
    {"examId": "upsc", "subjectId": "history", "exam": "UPSC", "subject": "History", "topic": "Ancient India"},
    {"examId": "upsc", "subjectId": "history", "exam": "UPSC", "subject": "History", "topic": "Medieval India"},
    {"examId": "upsc", "subjectId": "history", "exam": "UPSC", "subject": "History", "topic": "Modern India"},
    {"examId": "upsc", "subjectId": "history", "exam": "UPSC", "subject": "History", "topic": "Freedom Struggle"},
    {"examId": "upsc", "subjectId": "history", "exam": "UPSC", "subject": "History", "topic": "Mughal Empire"},
    {"examId": "upsc", "subjectId": "history", "exam": "UPSC", "subject": "History", "topic": "British Rule"},
    {"examId": "upsc", "subjectId": "history", "exam": "UPSC", "subject": "History", "topic": "Indian National Movement"},
    {"examId": "upsc", "subjectId": "history", "exam": "UPSC", "subject": "History", "topic": "Post-Independence India"},
    {"examId": "upsc", "subjectId": "history", "exam": "UPSC", "subject": "History", "topic": "World History"},
    {"examId": "upsc", "subjectId": "history", "exam": "UPSC", "subject": "History", "topic": "Art and Culture"},

    # SSC CGL (10 topics)
    {"examId": "ssc", "subjectId": "reasoning", "exam": "SSC CGL", "subject": "Reasoning", "topic": "Logical Reasoning"},
    {"examId": "ssc", "subjectId": "reasoning", "exam": "SSC CGL", "subject": "Reasoning", "topic": "Analytical Reasoning"},
    {"examId": "ssc", "subjectId": "reasoning", "exam": "SSC CGL", "subject": "Reasoning", "topic": "Verbal Reasoning"},
    {"examId": "ssc", "subjectId": "quantitative", "exam": "SSC CGL", "subject": "Quantitative Aptitude", "topic": "Number System"},
    {"examId": "ssc", "subjectId": "quantitative", "exam": "SSC CGL", "subject": "Quantitative Aptitude", "topic": "Percentage"},
    {"examId": "ssc", "subjectId": "quantitative", "exam": "SSC CGL", "subject": "Quantitative Aptitude", "topic": "Ratio and Proportion"},
    {"examId": "ssc", "subjectId": "gk", "exam": "SSC CGL", "subject": "General Knowledge", "topic": "Indian History"},
    {"examId": "ssc", "subjectId": "gk", "exam": "SSC CGL", "subject": "General Knowledge", "topic": "Geography"},
    {"examId": "ssc", "subjectId": "gk", "exam": "SSC CGL", "subject": "General Knowledge", "topic": "Current Affairs"},
    {"examId": "ssc", "subjectId": "english", "exam": "SSC CGL", "subject": "English", "topic": "Grammar Basics"},

    # Banking (10 topics)
    {"examId": "banking", "subjectId": "banking", "exam": "Banking", "subject": "Banking Awareness", "topic": "RBI Functions"},
    {"examId": "banking", "subjectId": "banking", "exam": "Banking", "subject": "Banking Awareness", "topic": "Banking Terms"},
    {"examId": "banking", "subjectId": "banking", "exam": "Banking", "subject": "Banking Awareness", "topic": "Financial Institutions"},
    {"examId": "banking", "subjectId": "banking", "exam": "Banking", "subject": "Banking Awareness", "topic": "Money Market"},
    {"examId": "banking", "subjectId": "computer", "exam": "Banking", "subject": "Computer Knowledge", "topic": "Computer Basics"},
    {"examId": "banking", "subjectId": "computer", "exam": "Banking", "subject": "Computer Knowledge", "topic": "MS Office"},
    {"examId": "banking", "subjectId": "computer", "exam": "Banking", "subject": "Computer Knowledge", "topic": "Internet Basics"},
    {"examId": "banking", "subjectId": "reasoning", "exam": "Banking", "subject": "Reasoning", "topic": "Puzzles"},
    {"examId": "banking", "subjectId": "reasoning", "exam": "Banking", "subject": "Reasoning", "topic": "Seating Arrangement"},
    {"examId": "banking", "subjectId": "quantitative", "exam": "Banking", "subject": "Quantitative Aptitude", "topic": "Data Interpretation"},

    # State CETs (10 topics - common across states)
    {"examId": "kcet", "subjectId": "physics", "exam": "Karnataka CET", "subject": "Physics", "topic": "Units and Measurements"},
    {"examId": "kcet", "subjectId": "physics", "exam": "Karnataka CET", "subject": "Physics", "topic": "Kinematics"},
    {"examId": "kcet", "subjectId": "chemistry", "exam": "Karnataka CET", "subject": "Chemistry", "topic": "Atomic Structure"},
    {"examId": "kcet", "subjectId": "chemistry", "exam": "Karnataka CET", "subject": "Chemistry", "topic": "Chemical Kinetics"},
    {"examId": "kcet", "subjectId": "mathematics", "exam": "Karnataka CET", "subject": "Mathematics", "topic": "Sets and Relations"},
    {"examId": "mht-cet", "subjectId": "physics", "exam": "MHT CET", "subject": "Physics", "topic": "Motion"},
    {"examId": "mht-cet", "subjectId": "chemistry", "exam": "MHT CET", "subject": "Chemistry", "topic": "States of Matter"},
    {"examId": "mht-cet", "subjectId": "mathematics", "exam": "MHT CET", "subject": "Mathematics", "topic": "Functions"},
    {"examId": "keam", "subjectId": "physics", "exam": "Kerala CET", "subject": "Physics", "topic": "Laws of Motion"},
    {"examId": "keam", "subjectId": "chemistry", "exam": "Kerala CET", "subject": "Chemistry", "topic": "Solutions"},
]

def generate_flashcard_deck(topic_data):
    """Generate a flashcard deck via AI"""
    print(f"  🤖 Generating: {topic_data['exam']} → {topic_data['subject']} → {topic_data['topic']}")

    # Simulate API call to generate endpoint
    # In real use, this would call your /api/flashcards/generate
    # For now, we'll directly call OpenRouter

    prompt = f"""You are an expert educator creating flashcards for competitive exam preparation in India.

Context:
- Exam: {topic_data['exam']}
- Subject: {topic_data['subject']}
- Topic: {topic_data['topic']}

Generate 15 high-quality flashcards following these guidelines:

1. **Front (Question/Term)**: Clear, concise question or term (max 150 characters)
   - Focus on exam-relevant concepts
   - Include common MCQ patterns
   - Cover key definitions, formulas, dates, facts

2. **Back (Answer/Explanation)**: Comprehensive answer (150-400 characters)
   - Provide clear explanation
   - Include context or examples where helpful
   - Mention common misconceptions if relevant

3. **Hint (Optional)**: Memory trigger or mnemonic (max 50 characters)
   - Only for medium/hard cards
   - Help student recall the concept

4. **Difficulty**: Label as 'easy', 'medium', or 'hard'
   - Easy: Direct recall facts
   - Medium: Application or understanding
   - Hard: Complex concepts or tricky distinctions

Return ONLY a valid JSON array (no markdown, no extra text):
[
  {{
    "front": "What is Newton's Second Law of Motion?",
    "back": "F = ma. Force equals mass times acceleration. The net force on an object is directly proportional to its mass and acceleration.",
    "hint": "F = ma formula",
    "difficulty": "easy"
  }}
]

Generate 15 flashcards now for: {topic_data['topic']} in {topic_data['subject']} for {topic_data['exam']}"""

    try:
        response = requests.post(
            'https://openrouter.ai/api/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {OPENROUTER_KEY}',
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://krakkify.in',
                'X-Title': 'Krakkify Flashcard Library',
            },
            json={
                'model': 'google/gemini-2.5-flash-lite',
                'messages': [{'role': 'user', 'content': prompt}],
                'temperature': 0.7,
                'max_tokens': 4000,
            },
            timeout=30
        )

        if response.status_code != 200:
            print(f"    ❌ API Error: {response.status_code}")
            return None

        data = response.json()
        content = data['choices'][0]['message']['content']

        # Parse JSON
        import re
        json_match = re.search(r'\[[\s\S]*\]', content)
        if not json_match:
            print(f"    ❌ No JSON found in response")
            return None

        cards = json.loads(json_match.group())
        print(f"    ✅ Generated {len(cards)} cards")
        return cards

    except Exception as e:
        print(f"    ❌ Error: {str(e)}")
        return None


def save_to_database(topic_data, cards):
    """Save deck to database as public"""
    import psycopg2
    from psycopg2.extras import execute_values

    conn = psycopg2.connect(os.getenv("POSTGRES_URL"))
    cur = conn.cursor()

    try:
        # Insert deck (user_id = 0 for system/public decks)
        title = f"{topic_data['topic']} ({topic_data['subject']})"
        description = f"Pre-generated flashcards for {topic_data['topic']} - {topic_data['exam']}"

        cur.execute("""
            INSERT INTO flashcard_decks
            (user_id, title, description, exam_id, subject_id, topic, is_public, is_ai_generated)
            VALUES (%s, %s, %s, %s, %s, %s, true, true)
            RETURNING id
        """, (0, title, description, topic_data['examId'], topic_data['subjectId'], topic_data['topic']))

        deck_id = cur.fetchone()[0]

        # Insert cards
        card_values = [
            (deck_id, i, card['front'], card['back'],
             card.get('hint'), card.get('difficulty', 'medium'))
            for i, card in enumerate(cards)
        ]

        execute_values(cur, """
            INSERT INTO flashcards
            (deck_id, card_order, front, back, hint, difficulty)
            VALUES %s
        """, card_values)

        conn.commit()
        print(f"    💾 Saved to database (deck_id: {deck_id})")
        return deck_id

    except Exception as e:
        conn.rollback()
        print(f"    ❌ Database error: {str(e)}")
        return None
    finally:
        cur.close()
        conn.close()


def main():
    print("🚀 Flashcard Library Generator")
    print(f"📊 Generating {len(TOPICS)} decks...")
    print(f"💰 Estimated cost: ${len(TOPICS) * 0.0005:.2f}")
    print()

    success_count = 0
    failed_topics = []

    for i, topic_data in enumerate(TOPICS, 1):
        print(f"[{i}/{len(TOPICS)}] {topic_data['exam']} - {topic_data['topic']}")

        # Generate cards
        cards = generate_flashcard_deck(topic_data)
        if not cards:
            failed_topics.append(topic_data)
            continue

        # Save to database
        deck_id = save_to_database(topic_data, cards)
        if deck_id:
            success_count += 1
        else:
            failed_topics.append(topic_data)

        # Rate limit (1 request per second)
        if i < len(TOPICS):
            print(f"    ⏱️  Waiting 1 second...")
            time.sleep(1)
        print()

    print("=" * 60)
    print(f"✅ Success: {success_count}/{len(TOPICS)} decks")
    print(f"❌ Failed: {len(failed_topics)} decks")

    if failed_topics:
        print("\nFailed topics:")
        for topic in failed_topics:
            print(f"  - {topic['exam']}: {topic['topic']}")

    print(f"\n💰 Actual cost: ${success_count * 0.0005:.2f}")
    print("🎉 Library generation complete!")


if __name__ == "__main__":
    main()
