#!/usr/bin/env python3
"""Generate real debate discussion points for practice section."""

import os
import json

env_vars = {}
with open('.env.local', 'r') as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith('#') and '=' in line:
            key, value = line.split('=', 1)
            env_vars[key] = value.strip('"')

os.environ.update(env_vars)

import psycopg2
from urllib.parse import urlparse, unquote

POSTGRES_URL = os.environ.get('POSTGRES_URL')
parsed = urlparse(POSTGRES_URL)
conn = psycopg2.connect(
    host=parsed.hostname,
    port=parsed.port or 5432,
    database=parsed.path[1:],
    user=parsed.username,
    password=unquote(parsed.password)
)

cur = conn.cursor()

cur.execute("""
    SELECT content
    FROM topic_study_content
    WHERE subject_id = 'english'
      AND path_id = 'advanced'
      AND topic_id = 'debate-discussion'
""")

result = cur.fetchone()

if result:
    content_json = result[0]
    sections = content_json.get('sections', [])

    # Section 9 (index 8) - Practice Debate Topics
    if len(sections) > 8:
        section = sections[8]

        for block in section['content']:
            if block.get('type') == 'practice':
                questions = block.get('questions', [])

                # Generate real answers for each debate topic
                debate_answers = [
                    # Question 1: Economic growth vs environmental protection
                    '''FOR Economic Growth:
• Economic development lifts millions out of poverty - India needs jobs and infrastructure
• Environmental protection can happen alongside growth through green technology
• Strong economy provides resources for better environmental management later
• Countries like China prioritized growth first, now investing heavily in clean energy

AGAINST (Pro-Environment):
• Environmental damage is irreversible - GDP growth means nothing on a dead planet
• Climate change costs India billions (floods, droughts, agricultural losses)
• Short-term growth creates long-term health crises (air pollution in Delhi kills thousands yearly)
• Sustainable development is possible - solar energy, electric vehicles can drive growth without harm

Balanced Conclusion:
A false dichotomy. India needs "green growth" - environmental protection integrated into economic policy, not sacrificed for it. Examples: National Solar Mission, electric vehicle targets.''',

                    # Question 2: Social media harm vs good
                    '''HARMFUL Effects:
• Mental health crisis among youth - anxiety, depression, comparison culture
• Spread of misinformation and fake news affecting elections and public health
• Privacy violations and data exploitation by companies
• Cyberbullying, trolling, and online harassment becoming epidemic

BENEFICIAL Effects:
• Democratic tool - voices marginalized communities, enables activism (MeToo, farmers protests)
• Business opportunities - digital marketing, influencer economy creates jobs
• Educational resource - free learning content, skill development
• Connects families across distances, especially important for diaspora

Balanced View:
Social media is a tool - impact depends on usage and regulation. Need digital literacy education, stronger platform accountability, and individual responsibility. Not inherently good or bad.''',

                    # Question 3: Free higher education
                    '''FOR Free Education:
• Constitutional right - education shouldn\'t depend on family wealth
• Economic benefit - skilled workforce drives GDP growth
• Social mobility - breaks cycle of poverty across generations
• Many successful countries offer free university (Germany, Nordic countries)

AGAINST Free Education:
• Financially unsustainable - India\'s fiscal deficit already high
• Quality concerns - free doesn\'t guarantee better education
• May reduce accountability - students and institutions less motivated
• Better to target subsidies - free education for economically weaker sections only

Practical Solution:
Hybrid model: Free education for STEM, medicine, and essential fields; subsidized education for others; income-based fee structure; improved government college quality before expanding free access.''',

                    # Question 4: Future of work in India
                    '''OPPORTUNITIES:
• Digital revolution - IT, software, remote work expanding rapidly
• Gig economy - flexibility for workers, entrepreneurship opportunities
• Skill-based hiring - merit over degrees, online certifications valued
• Global talent market - Indians can work for international companies from home

CHALLENGES:
• Job displacement - AI and automation threatening traditional roles
• Skill gap - education system not preparing students for future jobs
• Inequality - digital divide leaving rural India behind
• Labor rights - gig workers lack benefits, job security
• Underemployment - graduates in non-relevant jobs

Way Forward:
Massive reskilling programs, stronger social security for gig workers, investment in digital infrastructure for tier-2/3 cities, education reform emphasizing critical thinking over rote learning.'''
                ]

                # Update each question with proper answer
                for i, q in enumerate(questions):
                    if i < len(debate_answers):
                        q['answer'] = debate_answers[i]
                        q['explanation'] = 'Structure your debate using these points. Add specific Indian examples, statistics, and current affairs references for UPSC mains preparation.'

        # Update database
        cur.execute("""
            UPDATE topic_study_content
            SET content = %s, updated_at = NOW()
            WHERE subject_id = 'english'
              AND path_id = 'advanced'
              AND topic_id = 'debate-discussion'
        """, (json.dumps(content_json),))

        conn.commit()
        print("✅ Debate & Discussion practice section - Added complete debate points")
        print("   4 debate topics with FOR/AGAINST arguments and balanced conclusions")

cur.close()
conn.close()
