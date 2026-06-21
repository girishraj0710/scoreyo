#!/usr/bin/env python3
"""Fix Report Writing - Section 7: Sample Report with proper formatting"""

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

POSTGRES_URL = os.environ.get('POSTGRES_URL')
conn = psycopg2.connect(POSTGRES_URL)
cur = conn.cursor()

cur.execute("""
    SELECT content
    FROM topic_study_content
    WHERE subject_id = 'english'
      AND path_id = 'advanced'
      AND topic_id = 'report-writing'
""")

result = cur.fetchone()

if result:
    content_json = result[0]
    sections = content_json.get('sections', [])
    
    # Section 7 (index 6) - Sample Report with Annotations
    if len(sections) > 6:
        section = sections[6]
        print(f"Found section: {section['title']}")
        
        # Replace with properly formatted sample report
        section['content'] = [
            {
                'type': 'example',
                'title': 'Complete Sample Report',
                'examples': [
                    {
                        'text': '''REPORT ON DIGITAL LITERACY INITIATIVES IN RURAL INDIA

Prepared for: Ministry of Education
Prepared by: Rural Development Task Force
Date: June 2026

1. INTRODUCTION

1.1 Purpose
This report evaluates the effectiveness of digital literacy programs launched in rural India between 2024-2026 and provides recommendations for improvement.

1.2 Scope
The study covers 500 villages across 10 states, focusing on internet penetration, digital skills training, and economic impact.

1.3 Methodology
Data was collected through surveys (N=5,000), interviews with village leaders (N=150), and analysis of government records.


2. CURRENT SITUATION

2.1 Infrastructure Development
Internet connectivity has improved significantly, with 65% of surveyed villages now having 4G access (up from 28% in 2024). However, electricity reliability remains a challenge in 40% of locations.

2.2 Training Programs
Government-sponsored training centers have enrolled 250,000 participants. Completion rate stands at 72%, with higher success among women (78%) compared to men (68%).


3. KEY FINDINGS

3.1 Positive Outcomes
• Online banking adoption increased by 340%
• E-commerce participation grew from 5% to 23%
• Digital payment usage rose to 85% of households

3.2 Challenges Identified
• Language barriers: 55% struggle with English-only content
• Device availability: Only 31% own smartphones
• Sustainability concerns: 60% of training centers lack funding beyond 2026


4. RECOMMENDATIONS

4.1 Short-term Actions (2026-2027)
• Develop vernacular language training materials
• Subsidize smartphone distribution to eligible families
• Extend funding for existing training centers

4.2 Long-term Strategies (2027-2030)
• Integrate digital literacy into school curricula
• Establish public device-sharing facilities in villages
• Create mentorship programs with urban volunteers


5. CONCLUSION

Digital literacy initiatives have shown measurable success, but sustained investment and localization are essential. With recommended improvements, we project 90% rural digital participation by 2030.


APPENDICES

Appendix A: Survey Questionnaire
Appendix B: Statistical Analysis
Appendix C: Budget Breakdown''',
                        'explanation': '''Key formatting elements demonstrated:
• Clear numbering hierarchy (1, 1.1, 1.2)
• Consistent spacing between sections
• Bullet points for lists
• Formal headings in CAPITALS
• Logical flow: Introduction → Situation → Findings → Recommendations → Conclusion
• Professional metadata (Prepared for, Date)'''
                    }
                ]
            },
            {
                'type': 'note',
                'icon': '💡',
                'title': 'Report Formatting Tips',
                'content': '''• Use consistent heading styles throughout
• Leave blank lines between major sections
• Align subheadings properly (use numbering)
• Keep paragraphs concise (3-5 sentences)
• Use bullet points for lists, not long sentences
• Include page numbers (in actual reports)
• Add a table of contents for reports over 5 pages'''
            }
        ]
        
        print("✅ Fixed Section 7 with properly formatted sample report")
        
        # Update database
        cur.execute("""
            UPDATE topic_study_content
            SET content = %s, updated_at = NOW()
            WHERE subject_id = 'english'
              AND path_id = 'advanced'
              AND topic_id = 'report-writing'
        """, (json.dumps(content_json),))
        
        conn.commit()
        print("✅ Database updated successfully")

cur.close()
conn.close()
