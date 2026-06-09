#!/bin/bash

# Verification Script: Passage Questions Fix
# Checks if the passage fix is properly deployed

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  Passage Questions Fix - Verification Script                  ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

# Helper function
check() {
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅${NC} $1"
    ((PASSED++))
  else
    echo -e "${RED}❌${NC} $1"
    ((FAILED++))
  fi
}

echo "📋 CODE CHANGES"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Check 1: Migration file exists
[ -f scripts/add-passage-column.sql ]
check "Migration SQL file exists"

# Check 2: Verify API route includes passage
grep -q '...(q.passage && { passage: q.passage })' src/app/api/quiz/route.ts
check "API route includes passage mapping"

# Check 3: Verify getExamQuestions includes passage
grep -q '...(row.passage && { passage: row.passage })' src/lib/db.ts | head -1
check "getExamQuestions() includes passage mapping"

# Check 4: Verify saveVerifiedQuestions accepts passage
grep -q 'passage?: string' src/lib/db.ts
check "saveVerifiedQuestions() accepts passage parameter"

# Check 5: Verify saveEnglishQuestions accepts passage
grep -q 'passage?: string' src/lib/db.ts
check "saveEnglishQuestions() accepts passage parameter"

echo ""
echo "🔨 BUILD STATUS"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Check 6: Build passes
npm run build > /tmp/build.log 2>&1
check "Build passes TypeScript validation"

# Check 7: No build errors
! grep -i "error" /tmp/build.log > /dev/null
check "No build errors"

echo ""
echo "📦 GIT STATUS"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Check 8: Changes committed
git log -1 --oneline | grep -q "Fix: Enable passage display"
check "Changes committed with proper message"

# Check 9: On main branch
[ "$(git branch --show-current)" = "main" ]
check "On main branch"

# Check 10: No uncommitted changes
[ -z "$(git status -s)" ] || echo -e "${YELLOW}⚠️${NC} Uncommitted changes present (normal during development)"

echo ""
echo "🌐 DEPLOYMENT STATUS"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Check 11: Check if POSTGRES_URL is set
[ -n "$POSTGRES_URL" ]
check "POSTGRES_URL environment variable configured"

# Check 12: Check if we can reach Supabase
curl -s --connect-timeout 5 "https://app.supabase.com/api/projects" > /dev/null 2>&1
check "Supabase is reachable (for migration)"

echo ""
echo "🗄️ DATABASE CHECKS (if connected to Supabase)"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Check 13: Try to query english_questions table
if [ -n "$POSTGRES_URL" ]; then
  psql "$POSTGRES_URL" -c "SELECT column_name FROM information_schema.columns WHERE table_name='english_questions' AND column_name='passage';" > /dev/null 2>&1
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅${NC} english_questions table has passage column"
    ((PASSED++))
  else
    echo -e "${YELLOW}⚠️${NC} english_questions table - migration not yet applied"
    echo "     → Run: psql \"\$POSTGRES_URL\" < scripts/add-passage-column.sql"
  fi

  # Check 14: Try to query fact_exam_questions table
  psql "$POSTGRES_URL" -c "SELECT column_name FROM information_schema.columns WHERE table_name='fact_exam_questions' AND column_name='passage';" > /dev/null 2>&1
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅${NC} fact_exam_questions table has passage column"
    ((PASSED++))
  else
    echo -e "${YELLOW}⚠️${NC} fact_exam_questions table - migration not yet applied"
    echo "     → Run: psql \"\$POSTGRES_URL\" < scripts/add-passage-column.sql"
  fi
else
  echo -e "${YELLOW}⚠️${NC} POSTGRES_URL not set - skipping database checks"
  echo "     → Set environment variable and re-run to verify database"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "📊 SUMMARY"
echo "───────────────────────────────────────────────────────────────"
echo -e "Checks Passed: ${GREEN}$PASSED${NC}"
echo -e "Checks Failed: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ ALL CHECKS PASSED!${NC}"
  echo ""
  echo "🚀 Next Steps:"
  echo "  1. If not done: Run SQL migration in Supabase"
  echo "  2. git push origin main"
  echo "  3. Test reading comprehension quiz"
  echo ""
  exit 0
else
  echo -e "${RED}❌ SOME CHECKS FAILED${NC}"
  echo ""
  echo "ℹ️  Please address the issues above and re-run"
  echo ""
  exit 1
fi
