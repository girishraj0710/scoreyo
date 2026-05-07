#!/bin/bash

###############################################################################
# PrepGenie - Generate Questions for ALL Exams
#
# This is the ONLY script you need to run!
# Generates questions for all major exams in one go.
#
# Usage:
#   bash scripts/generate-all-exams.sh
#
# Or with custom count:
#   bash scripts/generate-all-exams.sh 50
#
###############################################################################

# Configuration
COUNT_PER_EXAM=${1:-20}  # Default: 20 questions per exam (change as needed)

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║     PrepGenie - Generating Questions for ALL Exams            ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo "📊 Configuration:"
echo "   Questions per exam: $COUNT_PER_EXAM"
echo ""
echo "🚀 Starting generation for all exams..."
echo ""

# Array of ALL exams (20 major exams)
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
  echo "📚 Generating $COUNT_PER_EXAM questions for: $exam"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  node scripts/generate-with-ollama.js --exam "$exam" --count "$COUNT_PER_EXAM"

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
echo "   Questions per exam: $COUNT_PER_EXAM"
echo "   Total questions generated: $((${#EXAMS[@]} * $COUNT_PER_EXAM))"
echo ""
echo "✅ All questions have been auto-imported to the question bank!"
echo ""
