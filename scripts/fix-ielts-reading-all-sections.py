#!/usr/bin/env python3
"""Add intro paragraphs to all IELTS Reading sections."""

import os
import json
import psycopg2
from urllib.parse import urlparse, unquote

# Database connection
POSTGRES_URL = os.environ.get('POSTGRES_URL', "postgresql://postgres.zomcofptwlumqkeffbht:PrepGenie2026Secure%21%40%23@aws-1-ap-south-1.pooler.supabase.com:6543/postgres")

def get_db_connection():
    """Get database connection."""
    parsed = urlparse(POSTGRES_URL)
    return psycopg2.connect(
        host=parsed.hostname,
        port=parsed.port or 5432,
        database=parsed.path[1:],
        user=parsed.username,
        password=unquote(parsed.password)
    )

# Content for each section
section_intros = {
    "Multiple Choice Questions (MCQs)": {
        "intro": "Multiple Choice Questions test your ability to identify main ideas, specific details, and implied meanings. You'll choose the correct answer from 3-4 options. This format appears in all three passages and accounts for roughly 30% of Reading questions.",
        "tip": {
            "icon": "💡",
            "title": "Strategy",
            "content": "Eliminate obviously wrong answers first. IELTS MCQs often have two plausible options - the correct answer will match the passage EXACTLY, while the distractor will be close but slightly off. Look for synonyms and paraphrasing."
        }
    },
    "True/False/Not Given (TFNG)": {
        "intro": "True/False/Not Given questions test your ability to identify factual information and distinguish between what is stated, what is contradicted, and what is not mentioned. This is often the trickiest question type for Indian students who are used to binary True/False questions.",
        "tip": {
            "icon": "⚠️",
            "title": "Common Mistake",
            "content": "Don't confuse FALSE with NOT GIVEN. FALSE means the statement contradicts the passage. NOT GIVEN means the passage doesn't provide enough information to confirm or deny. If you assume knowledge from outside the passage, you'll get it wrong."
        }
    },
    "Matching Headings": {
        "intro": "Matching Headings requires you to match section headings (i-viii) to paragraphs (A-H). This tests your ability to identify main ideas and understand paragraph structure. It's particularly challenging because you must grasp the overall theme, not just individual details.",
        "tip": {
            "icon": "💡",
            "title": "Pro Tip",
            "content": "Read the first and last sentences of each paragraph first - they usually contain the main idea. Cross off used headings immediately. Watch for synonyms: 'rising temperatures' in the heading might become 'increasing heat' in the paragraph."
        }
    },
    "Sentence Completion": {
        "intro": "Sentence Completion questions give you incomplete sentences that you must complete using words from the passage. You'll be told the maximum word limit (usually 1-3 words). This tests your ability to locate specific information and understand grammatical structure.",
        "tip": {
            "icon": "💡",
            "title": "Grammar Tip",
            "content": "Your completed sentence must be grammatically correct. Check: Does the answer fit the sentence tense? Is it singular/plural? If the sentence starts with 'The...', your answer likely needs to be a noun. Pay attention to prepositions (in/on/at) - they give clues."
        }
    },
    "Summary Completion": {
        "intro": "Summary Completion provides a summary of part of the passage with gaps. You fill the gaps with words from a provided list OR from the passage itself (check instructions carefully). This tests your understanding of main ideas and ability to recognize paraphrased information.",
        "tip": {
            "icon": "⚠️",
            "title": "Watch Out",
            "content": "When choosing from a list, there will be more options than gaps (e.g., 10 options for 7 gaps). Don't rush - read the whole summary first to understand the context. Some words will fit grammatically but not match the passage meaning."
        }
    },
    "Time Management Strategies": {
        "intro": "Effective time management is crucial for IELTS Reading success. You have 60 minutes for 40 questions across 3 passages - that's 20 minutes per passage. Indian students often spend too long on Passage 1 (which is easier) and then rush through Passage 3 (which is harder and worth the same points).",
        "tip": {
            "icon": "⏱️",
            "title": "Time Allocation",
            "content": "Strict 20-minute rule: Set your watch to beep at 20 and 40 minutes. If you're not done with a passage, STOP and move on. It's better to guess 2-3 answers than to miss an entire passage. Practice this timing in every mock test."
        }
    },
    "Practice Techniques for Indian Students": {
        "intro": "Indian students often excel at IELTS Reading due to strong CBSE/ICSE comprehension skills, but face challenges with unfamiliar question formats (True/False/Not Given, Matching Headings) and time pressure. Here are targeted practice techniques designed specifically for Indian test-takers.",
        "tip": {
            "icon": "🎯",
            "title": "Daily Practice Plan",
            "content": "Week 1-2: Master each question type separately (spend 2 days per type). Week 3-4: Practice full 3-passage tests under strict time limits. Week 5-6: Focus on your weakest question types. Week 7-8: Full mock tests + review mistakes. Aim for 90+ minutes daily practice."
        }
    }
}

conn = get_db_connection()
cur = conn.cursor()

# Fetch current content
cur.execute("""
    SELECT content
    FROM topic_study_content
    WHERE subject_id = 'english'
      AND path_id = 'ielts-toefl'
      AND topic_id = 'ielts-reading'
""")

result = cur.fetchone()
content_json = result[0]
sections = content_json.get('sections', [])

print("\n" + "="*80)
print("Adding Content to IELTS Reading Sections 2-8")
print("="*80)

sections_fixed = 0

# Fix sections 2-8 (indices 1-7)
for idx in range(1, len(sections)):
    section = sections[idx]
    section_title = section.get('title', '')

    print(f"\nSection {idx + 1}: {section_title}")

    if section_title in section_intros:
        intro_data = section_intros[section_title]

        # Get current content
        current_content = section.get('content', [])

        # Check if first block is empty paragraph
        if current_content and isinstance(current_content[0], dict):
            first_block = current_content[0]
            if first_block.get('type') == 'paragraph' and len(first_block.get('text', '')) < 10:
                # Replace empty paragraph with intro text
                current_content[0] = {
                    "type": "paragraph",
                    "text": intro_data["intro"]
                }
                print(f"   ✅ Replaced empty paragraph with intro ({len(intro_data['intro'])} chars)")
                sections_fixed += 1

                # Add tip note if not already present
                has_tip = any(block.get('type') == 'note' for block in current_content)
                if not has_tip and 'tip' in intro_data:
                    current_content.insert(1, intro_data['tip'])
                    print(f"   ✅ Added strategy note")

                section['content'] = current_content

    else:
        print(f"   ⚠️  No predefined content for this section title")

# Update database
cur.execute("""
    UPDATE topic_study_content
    SET content = %s, updated_at = NOW()
    WHERE subject_id = 'english'
      AND path_id = 'ielts-toefl'
      AND topic_id = 'ielts-reading'
""", (json.dumps(content_json),))

conn.commit()

print(f"\n{'='*80}")
print(f"✅ Fixed {sections_fixed} sections successfully!")
print(f"{'='*80}\n")

cur.close()
conn.close()
