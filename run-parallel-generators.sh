#!/bin/zsh
export PATH="/opt/homebrew/bin:/opt/homebrew/Cellar/node/25.8.2/bin:$PATH"
cd /Users/girish.raj/prepgenie
mkdir -p logs

echo "Starting 7 parallel generators using only gpt-4o-mini..."
/opt/homebrew/bin/npx tsx scripts/bulk-generate-missing-topics.ts > logs/missing-topics-1.log 2>&1 &
sleep 2
/opt/homebrew/bin/npx tsx scripts/bulk-generate-questions.ts > logs/critical-topics-1.log 2>&1 &
sleep 2
/opt/homebrew/bin/npx tsx scripts/bulk-generate-single-question-topics.ts > logs/single-question-1.log 2>&1 &
sleep 2
/opt/homebrew/bin/npx tsx scripts/bulk-generate-low-question-topics.ts > logs/low-question-1.log 2>&1 &
sleep 3
/opt/homebrew/bin/npx tsx scripts/bulk-generate-missing-topics.ts > logs/missing-topics-2.log 2>&1 &
sleep 2
/opt/homebrew/bin/npx tsx scripts/bulk-generate-questions.ts > logs/critical-topics-2.log 2>&1 &
sleep 3
/opt/homebrew/bin/npx tsx scripts/bulk-generate-missing-topics.ts > logs/missing-topics-3.log 2>&1 &
sleep 2
echo "All 7 generators started."
ps aux | grep bulk-generate | grep -v grep | wc -l | xargs echo "Active processes:"
