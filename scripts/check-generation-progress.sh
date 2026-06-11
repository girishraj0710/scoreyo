#!/bin/bash
# Check AI question generation progress
# Usage: ./scripts/check-generation-progress.sh

echo "🔍 Checking AI Question Generation Progress..."
echo ""

# Check if generation is running
if pgrep -f "generate-questions.ts" > /dev/null; then
    echo "✅ Generation is RUNNING"
    echo ""
else
    echo "⚠️  Generation is NOT running"
    echo ""
    exit 0
fi

# Check database for generated questions
echo "📊 Questions Generated So Far:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Use psql or turso depending on what's available
if command -v psql &> /dev/null && [ -n "$POSTGRES_URL" ]; then
    psql "$POSTGRES_URL" -t -c "
        SELECT
          SUBSTRING(source, 14, LENGTH(source) - 18) as exam,
          COUNT(*) as count
        FROM fact_exam_questions
        WHERE source LIKE 'ai_generated_%'
        GROUP BY exam
        UNION ALL
        SELECT 'TOTAL', COUNT(*)
        FROM fact_exam_questions
        WHERE source LIKE 'ai_generated_%'
        ORDER BY exam;
    "
else
    echo "⚠️  psql not available, showing file-based estimate..."
    echo ""

    # Estimate from log file
    if [ -f /tmp/generation-log.txt ]; then
        completed=$(grep -c "Task .* complete:" /tmp/generation-log.txt)
        total=13
        echo "Tasks completed: $completed / $total"
        echo "Estimated questions: ~$((completed * 33))"
    else
        echo "No log file found. Generation may have just started."
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 Tip: Run this script every 10-15 minutes to track progress"
echo "📝 Full log: tail -f /tmp/generation-log.txt"
