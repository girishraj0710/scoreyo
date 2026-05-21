#!/bin/bash
# Milestone-based monitoring for comprehensive seeder

LOG_FILE="comprehensive-seed.log"
MONITOR_LOG="milestone-alerts.log"
MILESTONES=(25 50 75 100)
ALERTED=()

log_milestone() {
  local msg="$1"
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $msg" | tee -a "$MONITOR_LOG"
}

get_batch_progress() {
  grep "📦 BATCH" "$LOG_FILE" 2>/dev/null | tail -1 | grep -oE "[0-9]+/[0-9]+" | head -1
}

get_total_inserted() {
  grep "✅ Inserted" "$LOG_FILE" 2>/dev/null | grep -oE "[0-9]+/[0-9]+" | awk -F'/' '{sum+=$1} END {print sum}'
}

check_milestone() {
  local current=$1
  local total=$2
  local percent=$((current * 100 / total))

  for milestone in "${MILESTONES[@]}"; do
    # Check if we've passed this milestone and haven't alerted yet
    if [ $percent -ge $milestone ] && [[ ! " ${ALERTED[@]} " =~ " ${milestone} " ]]; then
      ALERTED+=($milestone)

      local inserted=$(get_total_inserted)

      log_milestone "═══════════════════════════════════════════════════════════════════════════════"
      log_milestone "🎯 MILESTONE REACHED: ${milestone}% COMPLETE"
      log_milestone "═══════════════════════════════════════════════════════════════════════════════"
      log_milestone "Progress: Batch ${current}/${total} (${percent}%)"
      log_milestone "Questions inserted: ~${inserted}"
      log_milestone "Estimated remaining: $((total - current)) batches"
      log_milestone "═══════════════════════════════════════════════════════════════════════════════"

      # Show recent batch stats
      log_milestone ""
      log_milestone "Recent batches:"
      grep "✅ Inserted" "$LOG_FILE" 2>/dev/null | tail -5 | while read line; do
        log_milestone "  $line"
      done
      log_milestone ""

      return 0
    fi
  done

  return 1
}

log_milestone "🚀 Starting milestone monitor for comprehensive seeder"
log_milestone "Milestones: 25%, 50%, 75%, 100%"
log_milestone ""

while true; do
  # Check if process is still running
  if ! ps aux | grep -q "[c]omprehensive-seed-generator"; then
    log_milestone "❌ Seeder process stopped!"

    # Check if completed successfully
    if grep -q "COMPREHENSIVE SEEDING COMPLETE" "$LOG_FILE" 2>/dev/null; then
      log_milestone ""
      log_milestone "═══════════════════════════════════════════════════════════════════════════════"
      log_milestone "✅ 100% COMPLETE - SEEDING FINISHED SUCCESSFULLY!"
      log_milestone "═══════════════════════════════════════════════════════════════════════════════"

      # Extract final stats
      grep -A10 "COMPREHENSIVE SEEDING COMPLETE" "$LOG_FILE" | while read line; do
        log_milestone "$line"
      done
    else
      log_milestone "Check comprehensive-seed.log for details"
      tail -20 "$LOG_FILE" | while read line; do
        log_milestone "  $line"
      done
    fi

    exit 0
  fi

  # Get current progress
  PROGRESS=$(get_batch_progress)

  if [ -n "$PROGRESS" ]; then
    CURRENT=$(echo "$PROGRESS" | cut -d'/' -f1)
    TOTAL=$(echo "$PROGRESS" | cut -d'/' -f2)

    check_milestone "$CURRENT" "$TOTAL"
  fi

  sleep 120  # Check every 2 minutes
done
