#!/bin/bash
# Post-Migration Validation Runner
# Sets up virtual environment and runs validation

set -e  # Exit on error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
VENV_DIR="$PROJECT_DIR/.venv"

echo "🔧 Setting up validation environment..."

# Create virtual environment if it doesn't exist
if [ ! -d "$VENV_DIR" ]; then
    echo "   Creating virtual environment..."
    python3 -m venv "$VENV_DIR"
fi

# Activate virtual environment
source "$VENV_DIR/bin/activate"

# Install psycopg2-binary if not installed
if ! python3 -c "import psycopg2" 2>/dev/null; then
    echo "   Installing psycopg2-binary..."
    pip install -q psycopg2-binary
fi

# Run validation
echo ""
echo "🚀 Running post-migration validation..."
echo ""

python3 "$SCRIPT_DIR/post-migration-validation.py"

# Deactivate virtual environment
deactivate
