#!/bin/bash
set -e

echo "🔗 Connecting to Supabase PostgreSQL..."
echo "📄 Inserting study material for 'Idioms & Expressions'..."

# Execute SQL file directly (requires psql or equivalent)
if command -v psql &> /dev/null; then
    psql "$POSTGRES_URL" -f scripts/insert-idioms-expressions-study-material.sql
    echo "✅ Successfully inserted!"
else
    echo "⚠️ psql not found. SQL file ready at: scripts/insert-idioms-expressions-study-material.sql"
    echo "💡 Run manually: psql \$POSTGRES_URL -f scripts/insert-idioms-expressions-study-material.sql"
fi
