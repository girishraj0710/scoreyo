#!/bin/bash
# Monitor both import and comprehensive seeder

clear
echo "═══════════════════════════════════════════════════════════════════════════════"
echo "📊 SEEDING MONITOR - Real-time Progress"
echo "═══════════════════════════════════════════════════════════════════════════════"
echo ""

# Check import status
if ps aux | grep -q "[i]mport-cached-questions"; then
  echo "📥 IMPORT STATUS: Running"
  import_progress=$(tail -3 import-cached.log 2>/dev/null | grep "Batch" | tail -1)
  echo "   $import_progress"
else
  echo "📥 IMPORT STATUS: Completed"
  import_summary=$(grep -A3 "IMPORT COMPLETE" import-cached.log 2>/dev/null | tail -3)
  if [ -n "$import_summary" ]; then
    echo "$import_summary" | sed 's/^/   /'
  fi
fi

echo ""
echo "─────────────────────────────────────────────────────────────────────────────"
echo ""

# Check comprehensive seeder status
if ps aux | grep -q "[c]omprehensive-seed-generator"; then
  echo "🌱 COMPREHENSIVE SEEDER STATUS: Running"

  # Check if still scanning or generating
  if grep -q "Found.*empty topics" comprehensive-seed.log 2>/dev/null; then
    echo "   Phase: Generating Questions"
    batch_info=$(grep "📦 BATCH" comprehensive-seed.log 2>/dev/null | tail -1)
    echo "   $batch_info"
    recent_progress=$(tail -10 comprehensive-seed.log 2>/dev/null | grep -E "Generated|Inserted|Topic:" | tail -3)
    echo "$recent_progress" | sed 's/^/   /'
  else
    echo "   Phase: Scanning Topics"
    last_scan=$(tail -1 comprehensive-seed.log 2>/dev/null)
    echo "   $last_scan"
  fi
else
  echo "🌱 COMPREHENSIVE SEEDER STATUS: Not running"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════════════════════"
echo "Run 'bash scripts/monitor-seeding.sh' to refresh"
echo "Or: 'watch -n 10 bash scripts/monitor-seeding.sh' for auto-refresh every 10s"
echo "═══════════════════════════════════════════════════════════════════════════════"
