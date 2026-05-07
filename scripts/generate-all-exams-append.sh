#!/bin/bash

###############################################################################
# PrepGenie - Generate Questions for ALL Exams (APPEND MODE)
#
# This version APPENDS to existing question files.
# Perfect for:
#   - First run: Generate bulk questions (e.g., 500 per exam)
#   - Later runs: Add more questions (e.g., 50 more per exam)
#
# Usage:
#   bash scripts/generate-all-exams-append.sh
#
# Or with custom count:
#   bash scripts/generate-all-exams-append.sh 100
#
###############################################################################

# Configuration
COUNT_PER_EXAM=${1:-20}  # Default: 20 questions per exam (change as needed)

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║   PrepGenie - Generating Questions for ALL Exams (APPEND)    ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo "📊 Configuration:"
echo "   Questions per exam: $COUNT_PER_EXAM (will be ADDED to existing)"
echo ""
echo "🚀 Starting generation for all exams..."
echo ""

# Array of ALL exams (18 major exams)
EXAMS=(
  "jee-main"
  "jee-advanced"
  "neet-ug"
  "neet-pg"
  "upsc-cse"
  "gate"
  "ssc-cgl"
  "ssc-chsl"
  "ibps-po"
  "sbi-po"
  "cat"
  "xat"
  "clat"
  "nda"
  "cds"
  "rrb-ntpc"
  "ctet"
  "ca-foundation"
)

# Generate for each exam
for exam in "${EXAMS[@]}"; do
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📚 Adding $COUNT_PER_EXAM questions for: $exam"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  node scripts/generate-with-ollama-append.js --exam "$exam" --count "$COUNT_PER_EXAM"

  echo ""
  echo "✅ Completed: $exam"
  echo ""

  # Small delay between exams
  sleep 5
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 ALL DONE!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Summary:"
echo "   Total exams processed: ${#EXAMS[@]}"
echo "   Questions added per exam: $COUNT_PER_EXAM"
echo "   Total NEW questions: $((${#EXAMS[@]} * $COUNT_PER_EXAM))"
echo ""
echo "✅ All questions have been appended and auto-imported!"
echo ""
echo "📈 To see total questions per exam:"
echo "   ls -lh .agents/artifacts/ollama-generated/"
echo ""
echo "📝 Next time you run this, new questions will be ADDED (not replaced)"
echo ""
