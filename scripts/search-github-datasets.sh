#!/bin/bash

###############################################################################
# PrepGenie - GitHub Dataset Hunter
# Searches and clones repositories with competitive exam questions
###############################################################################

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║      PrepGenie - GitHub Dataset Hunter                        ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Create temp directory
WORK_DIR="/tmp/prepgenie-github-hunt"
mkdir -p "$WORK_DIR"
cd "$WORK_DIR"

echo "📂 Working directory: $WORK_DIR"
echo ""

# Search queries
QUERIES=(
  "upsc+mcq+questions"
  "jee+previous+year+questions"
  "neet+question+bank"
  "ssc+cgl+questions"
  "gate+computer+science+questions"
  "cat+mba+entrance+questions"
  "banking+exam+questions"
)

echo "🔍 Searching GitHub for exam question repositories..."
echo ""

for query in "${QUERIES[@]}"; do
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Query: $query"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  # Search GitHub API
  curl -s "https://api.github.com/search/repositories?q=$query&sort=stars&per_page=10" | \
    python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    for item in data.get('items', [])[:5]:
        print(f\"  ⭐ {item['stargazers_count']:3d} | {item['full_name']}\")
        print(f\"      {item.get('description', 'No description')[:80]}\")
        print()
except Exception as e:
    print(f'Error: {e}')
"

  sleep 2  # Rate limit
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎯 Search complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 To clone a repo:"
echo "   cd $WORK_DIR"
echo "   git clone https://github.com/username/repo.git"
echo ""
echo "📝 Then convert with:"
echo "   node /Users/girish.raj/prepgenie/scripts/convert-github-json.js"
echo ""
