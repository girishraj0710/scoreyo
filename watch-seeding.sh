#!/bin/bash
# Watch seeding progress live
cd ~/prepgenie
export PATH="/opt/homebrew/bin:$PATH"

while true; do
    clear
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║   PrepGenie Seeding Progress (Auto-refresh every 60s)     ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    date
    echo ""
    
    ./scripts/monitor-seeding.sh 2>&1 | grep -v "injected env"
    
    echo ""
    echo "Press Ctrl+C to exit"
    echo ""
    
    sleep 60
done
