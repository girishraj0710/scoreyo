#!/bin/bash

# PrepGenie - Generate ALL Mock Test Questions with Together AI
# Total: 11,210 questions across all exams
# Time: ~20 minutes
# Cost: FREE ($5 credit)

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║  PrepGenie - Generate ALL Mock Tests (Together AI)          ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo "📊 Target: 11,210 questions across 9 exams"
echo "⏱️  Estimated time: ~20 minutes"
echo "💰 Cost: FREE (uses $5 signup credit)"
echo ""

START_TIME=$(date +%s)

# Generate all exams
echo "🚀 Starting generation..."
echo ""

# 1. JEE Main (10 tests × 75 = 750 questions)
echo "1/9 - JEE Main (750 questions)..."
node scripts/generate-with-together-ai.js jee-main 10
echo ""

# 2. JEE Advanced (10 tests × 75 = 750 questions)
echo "2/9 - JEE Advanced (750 questions)..."
node scripts/generate-with-together-ai.js jee-advanced 10
echo ""

# 3. NEET (10 tests × 180 = 1,800 questions)
echo "3/9 - NEET (1,800 questions)..."
node scripts/generate-with-together-ai.js neet 10
echo ""

# 4. GATE CS (10 tests × 65 = 650 questions)
echo "4/9 - GATE CS (650 questions)..."
node scripts/generate-with-together-ai.js gate-cs 10
echo ""

# 5. UPSC CSE (15 tests × 100 = 1,500 questions)
echo "5/9 - UPSC CSE (1,500 questions)..."
node scripts/generate-with-together-ai.js upsc-cse 15
echo ""

# 6. SSC CGL (10 tests × 100 = 1,000 questions)
echo "6/9 - SSC CGL (1,000 questions)..."
node scripts/generate-with-together-ai.js ssc-cgl 10
echo ""

# 7. CAT (10 tests × 66 = 660 questions)
echo "7/9 - CAT (660 questions)..."
node scripts/generate-with-together-ai.js cat 10
echo ""

# 8. SBI PO (10 tests × 100 = 1,000 questions)
echo "8/9 - SBI PO (1,000 questions)..."
node scripts/generate-with-together-ai.js sbi-po 10
echo ""

# 9. IBPS PO (10 tests × 100 = 1,000 questions)
echo "9/9 - IBPS PO (1,000 questions)..."
node scripts/generate-with-together-ai.js ibps-po 10
echo ""

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
MINUTES=$((DURATION / 60))
SECONDS=$((DURATION % 60))

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║  ✅ ALL MOCK TESTS GENERATED!                                ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo "📊 Summary:"
echo "   - Total questions: ~11,210"
echo "   - Time taken: ${MINUTES}m ${SECONDS}s"
echo "   - Output: .agents/artifacts/mock-test-questions/*.csv"
echo ""
echo "📦 Next steps:"
echo "   1. Review questions: ls -lh .agents/artifacts/mock-test-questions/"
echo "   2. Import to database: node scripts/import-all-mock-tests.js"
echo ""
