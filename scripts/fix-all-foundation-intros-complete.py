#!/usr/bin/env python3
"""
FIX ALL FOUNDATION INTRODUCTIONS - COMPLETE
Rewrite every Foundation topic introduction with proper content
"""

import os, json

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

# Comprehensive introduction templates for all major topics
INTROS = {
    'verbs-basics': """Verbs are the foundation of every English sentence. They express actions, states of being, and relationships between subjects and their circumstances. Understanding verbs is essential for constructing grammatically correct sentences in both written and spoken English.

For Indian learners preparing for competitive examinations like UPSC, SSC, banking, and railway exams, mastering verb usage is crucial. English verbs function differently from Hindi verbs in terms of tense formation, auxiliary usage, and agreement rules.

This comprehensive module covers all aspects of verbs: action verbs, linking verbs, helping verbs, regular and irregular forms, transitive and intransitive verbs, and phrasal verbs. Each concept is explained with examples from Indian contexts, ensuring relevance for exam preparation and practical communication.""",

    'phrasal-verbs-basic': """Phrasal verbs constitute a fundamental aspect of English grammar that presents particular challenges for learners whose first language is Hindi. These multi-word constructions combine a verb with one or more particles (prepositions or adverbs) to create meanings that often cannot be deduced from the individual words.

For example, "give up" means "to quit" or "to surrender", not simply "give" + "up". Understanding phrasal verbs is essential for competitive exam success, as they appear frequently in comprehension passages, error detection questions, and sentence completion exercises in UPSC, SSC, and banking examinations.

This module covers the most common phrasal verbs used in formal and informal English, organized by base verb. Each phrasal verb includes clear definitions, example sentences from Indian contexts, and usage notes indicating whether it is appropriate for formal writing or primarily used in spoken English.""",

    'nouns-detailed': """Nouns form the building blocks of English sentences, naming people, places, things, ideas, and concepts. For competitive exam aspirants, understanding noun types, formation rules, and usage patterns is fundamental to achieving accuracy in both objective questions and descriptive writing sections.

English nouns are classified into several categories: common and proper nouns, concrete and abstract nouns, countable and uncountable nouns, and collective nouns. Each category follows specific grammatical rules regarding article usage, plural formation, and verb agreement.

This detailed module systematically covers all noun types with examples relevant to Indian learners. Special attention is given to areas where Hindi and English differ, such as countability (information vs जानकारी), plural formation (irregular plurals), and article usage (when to use a/an/the with nouns).""",

    'pronouns-detailed': """Pronouns replace nouns to avoid repetition and create cohesive, fluent text. English employs eight types of pronouns: personal, possessive, reflexive, demonstrative, interrogative, relative, indefinite, and reciprocal. Each type serves a distinct grammatical function and follows specific usage rules.

For Indian learners, pronouns present particular challenges because many Indian languages handle pronoun reference, gender agreement, and formal/informal distinctions differently than English. Common errors include incorrect pronoun case (I vs me), ambiguous reference, and incorrect reflexive usage.

This comprehensive module covers all pronoun types with detailed explanations, comparison with Hindi equivalents, and extensive practice exercises. The content is specifically designed for competitive exam preparation, addressing the types of pronoun questions that appear in UPSC, SSC, banking, and other government examinations.""",

    'adjectives': """Adjectives describe or modify nouns and pronouns, providing additional information about size, color, quantity, quality, and other characteristics. Mastering adjective usage is essential for descriptive writing in UPSC essays, SSC English sections, and banking exam comprehension passages.

English adjectives follow specific order rules when multiple adjectives modify the same noun (opinion, size, age, shape, color, origin, material, purpose). Additionally, adjectives have three degrees of comparison: positive, comparative, and superlative, each following particular formation rules.

This module covers all types of adjectives: descriptive, quantitative, demonstrative, possessive, and interrogative adjectives. Special focus is given to adjective order, degree formation (including irregular comparatives like good-better-best), and common mistakes made by Indian learners due to interference from regional language structures.""",

    'adjectives-basic': """Adjectives are words that describe nouns and pronouns, adding detail and specificity to sentences. For beginner English learners, understanding basic adjectives is a crucial first step toward fluent communication and accurate writing.

Common adjectives describe size (big, small), color (red, blue), shape (round, square), quantity (many, few), and quality (good, bad). Learning to use these basic adjectives correctly helps build foundational English skills required for competitive exams and everyday communication.

This introductory module covers the most frequently used adjectives in English, with examples from familiar Indian contexts. The content is designed for beginners, progressing gradually from simple adjective placement (before nouns) to basic comparative forms (bigger, smaller).""",

    'adverbs-complete': """Adverbs modify verbs, adjectives, other adverbs, or entire sentences, providing information about how, when, where, why, or to what extent an action occurs. Understanding adverb types, placement rules, and formation patterns is essential for achieving precision in English writing and speaking.

English adverbs are categorized by function: adverbs of manner (carefully, quickly), time (yesterday, soon), place (here, there), frequency (always, never), and degree (very, quite). Each type follows specific placement rules within sentences, and incorrect adverb placement is a common error in competitive exam writing.

This comprehensive module covers all adverb types, formation from adjectives (adding -ly), irregular adverbs (well, fast), and placement rules. The content addresses typical errors made by Indian learners and provides extensive practice for UPSC, SSC, and banking exam preparation.""",

    'prepositions-mastery': """Prepositions are small words that create significant meaning by showing relationships between nouns, pronouns, and other sentence elements. They indicate direction (to, from), location (in, on, at), time (before, after), and various other relationships.

For Indian learners, prepositions are notoriously difficult because Hindi and other Indian languages use postpositions or handle spatial/temporal relationships differently. Common errors include incorrect preposition selection ("on the bus" vs "in the bus"), omission where English requires prepositions, and direct translation from Hindi that produces unnatural English.

This mastery module systematically covers all major prepositions with detailed usage rules, common collocations (interested in, fond of), and extensive practice exercises. The content specifically addresses preposition errors common in competitive exams and provides strategies for accurate usage in UPSC essays and SSC descriptive writing.""",

    'articles': """Articles (a, an, the) are determiners that specify whether a noun refers to something specific or general. For Hindi speakers, articles are particularly challenging because Hindi does not have articles, making their usage seem arbitrary and difficult to master.

The indefinite articles "a" and "an" are used with singular countable nouns to indicate "one" or "any" (a book, an apple). The definite article "the" is used when referring to something specific or previously mentioned. Zero article (no article) is used with plural countable nouns in general statements and with uncountable nouns.

This comprehensive module covers all article usage rules, including when to use "a" vs "an" (before vowel sounds, not just vowel letters), when "the" is required (superlatives, unique objects, previously mentioned items), and when no article is needed (general statements, abstract nouns, proper nouns). Special focus is given to article errors common in Indian learners' writing.""",

    'demonstratives-basic': """Demonstrative words (this, that, these, those) point to specific nouns, indicating their relative distance from the speaker. Understanding demonstratives is fundamental for clear reference in both spoken and written English.

"This" and "these" refer to things near the speaker (singular and plural respectively), while "that" and "those" refer to things farther away. Demonstratives can function as determiners (this book) or pronouns (this is good). Incorrect demonstrative usage creates ambiguity and is frequently tested in competitive exams.

This module covers all demonstrative uses with clear distance distinctions, agreement rules (this/that for singular, these/those for plural), and common errors made by Indian learners. The content includes practice exercises relevant to UPSC, SSC, and banking exam question patterns."""
}

def generate_generic_intro(title):
    """Generate a generic but proper introduction for any topic"""
    return f"""{title} is an essential component of English grammar for competitive examination preparation. This topic is frequently tested in UPSC, SSC, banking, railway, and other government exams through various question types including error detection, sentence completion, and comprehension passages.

For Indian learners, understanding {title.lower()} requires attention to how English grammar patterns differ from Hindi and regional language structures. Common errors arise from direct translation and interference from first language patterns.

This comprehensive module systematically explains all key concepts, rules, and exceptions related to {title.lower()}. Each section includes clear explanations, examples from Indian contexts, and practice exercises designed to build accuracy and confidence for competitive exam success."""

# Get ALL Foundation topics
cur.execute("""
    SELECT topic_id, title, content
    FROM topic_study_content
    WHERE subject_id='english' AND path_id='foundation'
    ORDER BY topic_id
""")

all_topics = cur.fetchall()
fixed_count = 0

for topic_id, title, content_json in all_topics:
    sections = content_json.get('sections', [])

    if len(sections) == 0:
        continue

    # Check first section
    first_section = sections[0]
    content_blocks = first_section.get('content', [])

    if len(content_blocks) == 0:
        continue

    # Find paragraph block and check if it needs replacement
    for block in content_blocks:
        if isinstance(block, dict) and block.get('type') == 'paragraph':
            current_text = block.get('text', '')

            # Check if broken (few spaces) OR placeholder text
            space_ratio = current_text[:100].count(' ') if len(current_text) >= 100 else 20
            is_placeholder = 'This section covers' in current_text and len(current_text) < 200

            if space_ratio < 8 or is_placeholder:
                # Get proper intro
                if topic_id in INTROS:
                    new_intro = INTROS[topic_id]
                else:
                    new_intro = generate_generic_intro(title)

                block['text'] = new_intro

                # Update database
                cur.execute("""
                    UPDATE topic_study_content
                    SET content = %s, updated_at = NOW()
                    WHERE subject_id='english' AND path_id='foundation' AND topic_id=%s
                """, (json.dumps(content_json), topic_id))

                fixed_count += 1
                print(f"✅ {topic_id}: Rewritten with proper introduction")

            break

conn.commit()

print(f"\n{'='*80}")
print(f"COMPLETE: {fixed_count} Foundation topics rewritten")
print(f"{'='*80}\n")

cur.close()
conn.close()
