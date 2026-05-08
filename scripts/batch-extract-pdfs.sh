#!/bin/bash

###############################################################################
# PrepGenie - Batch PDF Extraction
# Automatically extracts questions from all downloaded PDFs
###############################################################################

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║      PrepGenie - Batch PDF Extraction                         ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

PDF_DIR="/tmp/prepgenie-official-pdfs"
OUTPUT_DIR=".agents/artifacts/extracted-questions"

if [ ! -d "$PDF_DIR" ]; then
  echo "❌ PDF directory not found: $PDF_DIR"
  echo "Run: bash scripts/download-official-pdfs.sh"
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

echo "📂 PDF directory: $PDF_DIR"
echo "📁 Output directory: $OUTPUT_DIR"
echo ""

TOTAL_PDFS=0
TOTAL_QUESTIONS=0

# JEE Main
if [ -d "$PDF_DIR/jee-main" ]; then
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📘 Processing JEE Main PDFs..."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  for pdf in "$PDF_DIR/jee-main"/*.pdf; do
    if [ -f "$pdf" ]; then
      filename=$(basename "$pdf" .pdf)
      year=$(echo "$filename" | grep -oE '[0-9]{4}' | head -1)
      echo "  Processing: $filename"
      python3 scripts/extract-pdf-questions.py "$pdf" "jee-main" "$year"
      TOTAL_PDFS=$((TOTAL_PDFS + 1))
    fi
  done
  echo ""
fi

# NEET
if [ -d "$PDF_DIR/neet" ]; then
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "🩺 Processing NEET PDFs..."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  for pdf in "$PDF_DIR/neet"/*.pdf; do
    if [ -f "$pdf" ]; then
      filename=$(basename "$pdf" .pdf)
      year=$(echo "$filename" | grep -oE '[0-9]{4}' | head -1)
      echo "  Processing: $filename"
      python3 scripts/extract-pdf-questions.py "$pdf" "neet" "$year"
      TOTAL_PDFS=$((TOTAL_PDFS + 1))
    fi
  done
  echo ""
fi

# UPSC
if [ -d "$PDF_DIR/upsc" ]; then
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "🏛️  Processing UPSC PDFs..."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  for pdf in "$PDF_DIR/upsc"/*.pdf; do
    if [ -f "$pdf" ]; then
      filename=$(basename "$pdf" .pdf)
      year=$(echo "$filename" | grep -oE '[0-9]{4}' | head -1)
      echo "  Processing: $filename"
      python3 scripts/extract-pdf-questions.py "$pdf" "upsc-cse" "$year"
      TOTAL_PDFS=$((TOTAL_PDFS + 1))
    fi
  done
  echo ""
fi

# SSC CGL
if [ -d "$PDF_DIR/ssc-cgl" ]; then
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📋 Processing SSC CGL PDFs..."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  for pdf in "$PDF_DIR/ssc-cgl"/*.pdf; do
    if [ -f "$pdf" ]; then
      filename=$(basename "$pdf" .pdf)
      year=$(echo "$filename" | grep -oE '[0-9]{4}' | head -1)
      echo "  Processing: $filename"
      python3 scripts/extract-pdf-questions.py "$pdf" "ssc-cgl" "$year"
      TOTAL_PDFS=$((TOTAL_PDFS + 1))
    fi
  done
  echo ""
fi

# GATE CS
if [ -d "$PDF_DIR/gate-cs" ]; then
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "💻 Processing GATE CS PDFs..."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  for pdf in "$PDF_DIR/gate-cs"/*.pdf; do
    if [ -f "$pdf" ]; then
      filename=$(basename "$pdf" .pdf)
      year=$(echo "$filename" | grep -oE '[0-9]{4}' | head -1)
      echo "  Processing: $filename"
      python3 scripts/extract-pdf-questions.py "$pdf" "gate-cs" "$year"
      TOTAL_PDFS=$((TOTAL_PDFS + 1))
    fi
  done
  echo ""
fi

# CAT
if [ -d "$PDF_DIR/cat" ]; then
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "🎓 Processing CAT PDFs..."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  for pdf in "$PDF_DIR/cat"/*.pdf; do
    if [ -f "$pdf" ]; then
      filename=$(basename "$pdf" .pdf)
      year=$(echo "$filename" | grep -oE '[0-9]{4}' | head -1)
      echo "  Processing: $filename"
      python3 scripts/extract-pdf-questions.py "$pdf" "cat" "$year"
      TOTAL_PDFS=$((TOTAL_PDFS + 1))
    fi
  done
  echo ""
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Batch extraction complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Processed: $TOTAL_PDFS PDFs"
echo "📁 Output: $OUTPUT_DIR"
echo ""
echo "📝 Next steps:"
echo "   1. Review extracted CSV files in $OUTPUT_DIR"
echo "   2. Manually verify and set correct answers (marked as NEEDS_MANUAL_REVIEW)"
echo "   3. Generate AI explanations: node scripts/generate-ai-explanations.js <csv-file>"
echo "   4. Import to database: node scripts/import-questions.js <csv-file>"
echo ""
