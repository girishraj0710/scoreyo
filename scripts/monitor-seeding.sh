#!/bin/bash
# PrepGenie - Monitor Question Seeding Progress
# Usage: ./scripts/monitor-seeding.sh

export PATH="/opt/homebrew/bin:$PATH"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║   PrepGenie - Question Seeding Monitor                    ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if process is running
PROCESS_COUNT=$(ps aux | grep -E "fill-question-gaps|seed-questions" | grep -v grep | wc -l | tr -d ' ')

if [ "$PROCESS_COUNT" -gt 0 ]; then
    echo "✅ Seeding process is RUNNING"
    echo ""
    ps aux | grep -E "fill-question-gaps|seed-questions" | grep -v grep | awk '{print "   PID: " $2 " | CPU: " $3 "% | Memory: " $4 "% | Runtime: " $10}'
    echo ""
else
    echo "❌ No seeding process running"
    echo ""
fi

# Check Ollama service
if pgrep -x "ollama" > /dev/null; then
    echo "✅ Ollama service is running"
else
    echo "⚠️  Ollama service is NOT running"
    echo "   Start with: ollama serve &"
fi

echo ""
echo "─────────────────────────────────────────────────────────────"
echo "📊 Database Statistics"
echo "─────────────────────────────────────────────────────────────"

npx tsx scripts/check-progress.ts 2>&1 | grep -v "injected env"

echo ""
echo "─────────────────────────────────────────────────────────────"
echo ""
echo "💡 Commands:"
echo "   Monitor: ./scripts/monitor-seeding.sh"
echo "   Stop:    pkill -f 'fill-question-gaps'"
echo "   Restart: npm run fill:gaps"
echo ""
