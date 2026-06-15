#!/bin/bash

echo "════════════════════════════════════════════════════════════════"
echo "  FIXING ISSUES #3 AND #4"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Issue #3: 'Start Practice Problems' button doesn't work"
echo "Issue #4: Practice Problems section not visible"
echo ""
echo "ROOT CAUSE: Database still has OLD content (no Practice Problems)"
echo ""
echo "SOLUTION: Reload database with fixed markdown files"
echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""

cd ~/prepgenie || exit 1

echo "📂 Current directory: $(pwd)"
echo ""

if [ ! -f "scripts/load-study-materials.ts" ]; then
    echo "❌ ERROR: scripts/load-study-materials.ts not found!"
    echo "   Make sure you're in the prepgenie directory"
    exit 1
fi

echo "🔄 Loading study materials into database..."
echo ""

npx tsx scripts/load-study-materials.ts

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "  DONE!"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Wait 2 minutes for Vercel to deploy commit d37e032"
echo ""
echo "Then refresh: https://krakkify.in/english/foundation/parts-of-speech/study"
echo ""
echo "What you should see:"
echo "  ✅ No duplicate '1' badge (Issue #1)"
echo "  ✅ No 'Start Quiz Now' button on Core Concepts (Issue #2)"
echo "  ✅ 'Start Practice Problems' button works (Issue #3)"
echo "  ✅ Practice Problems section appears when clicked (Issue #4)"
echo ""
echo "════════════════════════════════════════════════════════════════"
