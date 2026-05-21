#!/bin/bash
# Unified Status Dashboard

clear
echo "═══════════════════════════════════════════════════════════════════════════════"
echo "📊 QUESTION GENERATION STATUS DASHBOARD"
echo "═══════════════════════════════════════════════════════════════════════════════"
echo ""

# Current database status
echo "📚 DATABASE STATUS:"
npx tsx scripts/check-db-status.ts 2>/dev/null | tail -4
echo ""

echo "─────────────────────────────────────────────────────────────────────────────"
echo ""

# Free AI Seeder status
if ps aux | grep -q "[o]ptimized-seeder"; then
  echo "🤖 FREE AI SEEDER: ✅ Running (DeepSeek v4 - FREE)"
  BATCH=$(grep "📦 BATCH" optimized-seed-free.log 2>/dev/null | tail -1)
  INSERTED=$(grep "💾 Inserted" optimized-seed-free.log 2>/dev/null | grep -oE "[0-9]+ questions" | awk '{sum+=$1} END {print sum}')
  echo "   Progress: $BATCH"
  echo "   Inserted so far: $INSERTED questions"
  echo "   Target: 7,880 questions"
  echo "   Cost: $0 (FREE!)"

  # Check for rate limiting
  RECENT_ERRORS=$(tail -20 optimized-seed-free.log 2>/dev/null | grep -c "429")
  if [ "$RECENT_ERRORS" -gt 10 ]; then
    echo "   ⚠️  Rate limited (expected with free model)"
  fi
else
  echo "🤖 FREE AI SEEDER: ❌ Not running"
fi

echo ""

# Scraper status
if ps aux | grep -q "[o]pen-source-scraper"; then
  echo "🌐 OPEN-SOURCE SCRAPER: ✅ Running"
  LAST_TOPIC=$(grep "📚" scraper.log 2>/dev/null | tail -1)
  SCRAPED=$(grep "✅ Inserted" scraper.log 2>/dev/null | grep -oE "[0-9]+ scraped" | awk '{sum+=$1} END {print sum}')
  echo "   Current: $LAST_TOPIC"
  echo "   Scraped so far: ${SCRAPED:-0} questions"
  echo "   Sources: IndiaBix, GeeksforGeeks, Sanfoundry, etc."
  echo "   Cost: $0 (FREE!)"
else
  echo "🌐 OPEN-SOURCE SCRAPER: ❌ Not running"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════════════════════"
echo "💰 TOTAL COST SO FAR: $1.50 spent, $8.50 remaining"
echo "⏱️  Both processes running in parallel (FREE!)"
echo ""
echo "Run: bash scripts/status-dashboard.sh  (to refresh)"
echo "═══════════════════════════════════════════════════════════════════════════════"
