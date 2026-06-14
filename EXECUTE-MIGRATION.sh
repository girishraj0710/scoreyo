#!/bin/bash
# One-Command Migration Executor
# Runs complete migration + validation in one go

set -e

echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║  DIMENSIONAL MODEL MIGRATION - ONE-COMMAND EXECUTOR                ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""
echo "This will:"
echo "  1. Connect to Supabase"
echo "  2. Run pre-migration checks"
echo "  3. Execute the complete migration"
echo "  4. Run 13 validation tests"
echo "  5. Show you the results"
echo ""
echo "⏱️  Estimated time: 2-3 minutes"
echo ""

read -p "Ready to proceed? (yes/no): " response

if [ "$response" != "yes" ]; then
    echo "Aborted by user"
    exit 0
fi

echo ""
echo "🚀 Starting migration..."
echo ""

# Check if psycopg2 is installed
if ! python3 -c "import psycopg2" 2>/dev/null; then
    echo "📦 Installing psycopg2-binary..."
    pip3 install --user psycopg2-binary
    echo ""
fi

# Run the migration script
python3 scripts/run-migration-and-validate.py

echo ""
echo "✅ Migration script completed!"
echo ""
