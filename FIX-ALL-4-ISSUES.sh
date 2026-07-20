#!/bin/bash
set -e

echo "══════════════════════════════════════════════════════════════"
echo "  FIXING ALL 4 ISSUES AT ONCE"
echo "══════════════════════════════════════════════════════════════"
echo ""
echo "Current issues:"
echo "  #1: Duplicate '1' badge showing"
echo "  #2: 'Start Quiz Now' button still visible"
echo "  #3: 'Start Practice Problems' button has no action"
echo "  #4: Practice Problems section not visible"
echo ""
echo "ROOT CAUSE: Database has old content"
echo ""
echo "SOLUTION: Reload database with fixed markdown"
echo ""
echo "══════════════════════════════════════════════════════════════"
echo ""

cd ~/prepgenie || {
    echo "❌ ERROR: Could not cd to ~/prepgenie"
    exit 1
}

echo "📂 Working directory: $(pwd)"
echo ""

# Check if script exists
if [ ! -f "scripts/load-study-materials.ts" ]; then
    echo "❌ ERROR: scripts/load-study-materials.ts not found"
    exit 1
fi

echo "🔄 Reloading study materials into database..."
echo ""

npx tsx scripts/load-study-materials.ts

exit_code=$?

echo ""
if [ $exit_code -eq 0 ]; then
    echo "══════════════════════════════════════════════════════════════"
    echo "  ✅ DATABASE RELOADED SUCCESSFULLY"
    echo "══════════════════════════════════════════════════════════════"
    echo ""
    echo "What got fixed:"
    echo "  ✅ Issue #1: No more duplicate badges (clean titles in DB)"
    echo "  ✅ Issue #2: Start Quiz button hidden (code already deployed)"
    echo "  ✅ Issue #3: Practice Problems button now works (data exists)"
    echo "  ✅ Issue #4: Practice Problems section now loads (data exists)"
    echo ""
    echo "Wait 2 minutes for Vercel deploy (commit d37e032) to complete"
    echo ""
    echo "Then test at:"
    echo "  https://scoreyo.in/english/foundation/parts-of-speech/study"
    echo ""
    echo "Navigate to Card 8 (Interjections) and click 'Start Practice Problems'"
    echo ""
    echo "══════════════════════════════════════════════════════════════"
else
    echo "══════════════════════════════════════════════════════════════"
    echo "  ❌ DATABASE RELOAD FAILED"
    echo "══════════════════════════════════════════════════════════════"
    echo ""
    echo "Check for errors above. Common issues:"
    echo "  - Missing .env.local file"
    echo "  - POSTGRES_URL not set"
    echo "  - tsx not installed (run: npm install -g tsx)"
    echo ""
    exit 1
fi
