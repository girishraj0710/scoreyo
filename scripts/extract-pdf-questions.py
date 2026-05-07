#!/usr/bin/env python3
"""
PrepGenie - PDF Question Extractor
Extracts questions from official exam PDFs using OCR
"""

import sys
import os
import json
import re
from pathlib import Path

try:
    from pdf2image import convert_from_path
    import pytesseract
except ImportError:
    print("❌ Missing dependencies. Install with:")
    print("   pip install pdf2image pytesseract Pillow")
    print("   brew install tesseract poppler")
    sys.exit(1)

def extract_text_from_pdf(pdf_path):
    """Convert PDF to text using OCR"""
    print(f"📄 Processing: {pdf_path}")

    try:
        # Convert PDF to images
        images = convert_from_path(pdf_path)
        print(f"   Converted to {len(images)} pages")

        # Extract text from each page
        text = ""
        for i, image in enumerate(images):
            print(f"   OCR page {i+1}/{len(images)}...")
            page_text = pytesseract.image_to_string(image)
            text += page_text + "\n\n"

        return text
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return None

def parse_mcq_questions(text):
    """Parse MCQ questions from extracted text"""
    questions = []

    # Pattern: Question number followed by question text
    # Then (A), (B), (C), (D) or a), b), c), d) options

    # Simple pattern - can be improved based on actual PDF format
    lines = text.split('\n')
    current_q = None
    current_options = []

    for line in lines:
        line = line.strip()
        if not line:
            continue

        # Check if line starts with a number (question)
        if re.match(r'^\d+[\.\)]\s+', line):
            # Save previous question
            if current_q and len(current_options) == 4:
                questions.append({
                    'question': current_q,
                    'options': current_options,
                    'needs_review': True
                })

            # Start new question
            current_q = re.sub(r'^\d+[\.\)]\s+', '', line)
            current_options = []

        # Check if line is an option
        elif re.match(r'^[\(]?[A-Da-d][\)\.]?\s+', line):
            option = re.sub(r'^[\(]?[A-Da-d][\)\.]?\s+', '', line)
            current_options.append(option)

    # Save last question
    if current_q and len(current_options) == 4:
        questions.append({
            'question': current_q,
            'options': current_options,
            'needs_review': True
        })

    return questions

def save_to_csv(questions, output_path, exam_id, source):
    """Save questions to CSV format for PrepGenie"""
    import csv

    with open(output_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)

        # Header
        writer.writerow([
            'question', 'option_a', 'option_b', 'option_c', 'option_d',
            'correct_answer', 'explanation', 'difficulty', 'exam_id',
            'subject_id', 'topic', 'year', 'source_detail', 'source_type', 'verified'
        ])

        # Questions (needs manual review for correct answer)
        for q in questions:
            writer.writerow([
                q['question'],
                q['options'][0] if len(q['options']) > 0 else '',
                q['options'][1] if len(q['options']) > 1 else '',
                q['options'][2] if len(q['options']) > 2 else '',
                q['options'][3] if len(q['options']) > 3 else '',
                'NEEDS_REVIEW',  # Must be manually set
                'NEEDS_AI_EXPLANATION',  # Will be generated
                'medium',
                exam_id,
                'NEEDS_SUBJECT',  # Must be manually set
                'NEEDS_TOPIC',  # Must be manually set
                source.get('year', ''),
                source.get('detail', ''),
                'official',
                'false'
            ])

def main():
    if len(sys.argv) < 3:
        print("""
╔═══════════════════════════════════════════════════════════════╗
║        PrepGenie - PDF Question Extractor                     ║
╚═══════════════════════════════════════════════════════════════╝

Usage:
  python scripts/extract-pdf-questions.py <pdf-file> <exam-id> [year]

Example:
  python scripts/extract-pdf-questions.py upsc-2023.pdf upsc-cse 2023

Supported exam IDs:
  upsc-cse, ssc-cgl, jee-main, neet-ug, etc.

Output:
  Creates CSV file in .agents/artifacts/extracted-questions/

Note:
  - Requires manual review for correct answers
  - AI explanations can be generated separately
  - Questions need subject/topic assignment
""")
        sys.exit(1)

    pdf_path = sys.argv[1]
    exam_id = sys.argv[2]
    year = sys.argv[3] if len(sys.argv) > 3 else ''

    if not os.path.exists(pdf_path):
        print(f"❌ File not found: {pdf_path}")
        sys.exit(1)

    print(f"""
╔═══════════════════════════════════════════════════════════════╗
║        PrepGenie - PDF Question Extractor                     ║
╚═══════════════════════════════════════════════════════════════╝

Configuration:
  PDF File: {pdf_path}
  Exam ID:  {exam_id}
  Year:     {year or 'Not specified'}

🚀 Starting extraction...
""")

    # Extract text from PDF
    text = extract_text_from_pdf(pdf_path)
    if not text:
        print("❌ Failed to extract text from PDF")
        sys.exit(1)

    print(f"\n✅ Extracted {len(text)} characters")

    # Parse questions
    print("\n📝 Parsing questions...")
    questions = parse_mcq_questions(text)
    print(f"✅ Found {len(questions)} potential questions")

    if len(questions) == 0:
        print("\n⚠️  No questions found. PDF format may not be supported.")
        print("    Try adjusting the parsing logic for your specific PDF format.")

        # Save raw text for manual review
        output_dir = Path('.agents/artifacts/extracted-questions')
        output_dir.mkdir(parents=True, exist_ok=True)
        txt_path = output_dir / f"{exam_id}-{year or 'raw'}.txt"
        with open(txt_path, 'w', encoding='utf-8') as f:
            f.write(text)
        print(f"\n📄 Raw text saved to: {txt_path}")
        print("    Review this file to adjust parsing logic.")
        sys.exit(0)

    # Save to CSV
    output_dir = Path('.agents/artifacts/extracted-questions')
    output_dir.mkdir(parents=True, exist_ok=True)
    csv_path = output_dir / f"{exam_id}-{year or 'extracted'}.csv"

    save_to_csv(questions, csv_path, exam_id, {
        'year': year,
        'detail': f"Official {exam_id.upper()} {year or ''} - Extracted from PDF"
    })

    print(f"""
✨ Extraction complete!

📊 Summary:
   Questions found: {len(questions)}
   Output file:     {csv_path}

⚠️  IMPORTANT - Manual Review Required:
   1. Open the CSV file
   2. Set correct_answer for each question (0, 1, 2, or 3)
   3. Assign subject_id and topic
   4. Review question text and options for OCR errors

📝 Next Steps:
   1. Review and fix the CSV file
   2. Generate AI explanations:
      node scripts/generate-ai-explanations.js {csv_path}
   3. Import to database:
      node scripts/import-questions.js {csv_path}

🎉 Done!
""")

if __name__ == "__main__":
    main()
