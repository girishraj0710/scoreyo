#!/usr/bin/env bash
set -euo pipefail

# Launch multiple local-free seed workers with deterministic sharding.
# Usage:
#   bash scripts/run-free-seed-parallel.sh 3 15 5 24
#   args: <workers> <questions_per_topic> <max_topics_per_worker> <cooldown_hours>

WORKERS="${1:-2}"
QUESTIONS_PER_TOPIC="${2:-15}"
MAX_TOPICS="${3:-5}"
COOLDOWN_HOURS="${4:-24}"

echo "Starting ${WORKERS} workers (free/local Ollama seeding)..."
echo "  questions/topic=${QUESTIONS_PER_TOPIC}, max-topics=${MAX_TOPICS}, cooldown=${COOLDOWN_HOURS}h"

for ((i=0; i<WORKERS; i++)); do
  LOG_FILE="seed-worker-${i}.log"
  echo "Launching worker ${i}/${WORKERS} -> ${LOG_FILE}"
  nohup npx tsx scripts/free-seed-curriculum-ollama.ts \
    --questions-per-topic "${QUESTIONS_PER_TOPIC}" \
    --max-topics "${MAX_TOPICS}" \
    --cooldown-hours "${COOLDOWN_HOURS}" \
    --shard-count "${WORKERS}" \
    --shard-index "${i}" \
    > "${LOG_FILE}" 2>&1 &
done

echo "All workers launched."
echo "Monitor logs with: ls seed-worker-*.log && tail -f seed-worker-0.log"
