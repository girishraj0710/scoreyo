#!/usr/bin/env bash
set -euo pipefail

# Continuous free seeding runner with safe parallel shards.
# Runs exactly 2 shard workers per cycle, waits for both to finish,
# then starts the next cycle (no overlap).
#
# Usage:
#   bash scripts/run-free-seed-forever.sh
#   bash scripts/run-free-seed-forever.sh 2 15 5 24 20
# args:
#   1) workers
#   2) questions_per_topic
#   3) max_topics_per_worker
#   4) cooldown_hours
#   5) sleep_seconds_between_cycles

WORKERS="${1:-2}"
QUESTIONS_PER_TOPIC="${2:-15}"
MAX_TOPICS="${3:-10}"
COOLDOWN_HOURS="${4:-24}"
SLEEP_SECONDS="${5:-10}"
CHUNK_SIZE="${6:-5}"
RETRIES_PER_CHUNK="${7:-3}"
SELECTION_MODE="${8:-least-first}"
MIN_STOCK="${9:-500}"

echo "Continuous free seeding started at $(date)"
echo "workers=${WORKERS}, questions/topic=${QUESTIONS_PER_TOPIC}, max-topics=${MAX_TOPICS}, cooldown=${COOLDOWN_HOURS}h, sleep=${SLEEP_SECONDS}s, chunk=${CHUNK_SIZE}, retries=${RETRIES_PER_CHUNK}, selection=${SELECTION_MODE}, min-stock=${MIN_STOCK}"

cycle=0
while true; do
  cycle=$((cycle + 1))
  echo ""
  echo "=== Cycle ${cycle} started at $(date) ==="

  pids=()
  for ((i=0; i<WORKERS; i++)); do
    LOG_FILE="seed-worker-${i}.log"
    echo "Starting worker ${i}/${WORKERS} -> ${LOG_FILE}"
    npx tsx scripts/free-seed-curriculum-ollama.ts \
      --questions-per-topic "${QUESTIONS_PER_TOPIC}" \
      --max-topics "${MAX_TOPICS}" \
      --min-stock "${MIN_STOCK}" \
      --cooldown-hours "${COOLDOWN_HOURS}" \
      --chunk-size "${CHUNK_SIZE}" \
      --retries-per-chunk "${RETRIES_PER_CHUNK}" \
      --selection-mode "${SELECTION_MODE}" \
      --shard-count "${WORKERS}" \
      --shard-index "${i}" \
      > "${LOG_FILE}" 2>&1 &
    pids+=("$!")
  done

  failed=0
  for pid in "${pids[@]}"; do
    if ! wait "$pid"; then
      failed=1
    fi
  done

  if [[ "$failed" -eq 1 ]]; then
    echo "Cycle ${cycle} finished with worker failures at $(date)"
  else
    echo "Cycle ${cycle} finished successfully at $(date)"
  fi

  sleep "${SLEEP_SECONDS}"
done
