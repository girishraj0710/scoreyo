#!/bin/bash

###############################################################################
# PrepGenie - PARALLEL Question Generation (FAST!)
#
# Generates questions for multiple exams simultaneously
# Much faster than sequential generation
#
# Usage:
#   bash scripts/generate-parallel.sh [questions_per_exam] [parallel_jobs]
#
# Examples:
#   bash scripts/generate-parallel.sh 500 3    # 500 per exam, 3 at a time
#   bash scripts/generate-parallel.sh 100 6    # 100 per exam, 6 at a time
#
###############################################################################

COUNT=${1:-500}
PARALLEL=${2:-3}  # Number of exams to run at once

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║        PrepGenie - PARALLEL Question Generation               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo "📊 Configuration:"
echo "   Questions per exam: $COUNT"
echo "   Parallel jobs: $PARALLEL"
echo "   Total time estimate: $((COUNT / PARALLEL * 20 / 60)) hours"
echo ""

# All 18 exams
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

# Function to generate for one exam
generate_exam() {
  local exam=$1
  local count=$2
  echo "🚀 Starting: $exam (PID: $$)"
  node scripts/generate-with-ollama-append.js --exam "$exam" --count "$count" 2>&1 | \
    sed "s/^/[$exam] /"
  echo "✅ Completed: $exam"
}

export -f generate_exam

# Create log directory
mkdir -p .agents/logs

# Run in parallel using xargs
printf "%s\n" "${EXAMS[@]}" | xargs -P "$PARALLEL" -I {} bash -c "generate_exam {} $COUNT" 2>&1 | tee ".agents/logs/parallel-generation-$(date +%Y%m%d-%H%M%S).log"

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                    ALL DONE!                                  ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo "📊 Summary:"
echo "   Total exams: ${#EXAMS[@]}"
echo "   Questions per exam: $COUNT"
echo "   Total questions: $((${#EXAMS[@]} * COUNT))"
echo ""
echo "📁 Check results:"
echo "   ls -lh .agents/artifacts/ollama-generated/"
echo "   wc -l .agents/artifacts/ollama-generated/*.csv"
echo ""
