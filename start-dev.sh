#!/bin/bash

# Start Next.js dev server with correct PATH for Turbopack
# This fixes the "No such file or directory (os error 2)" Turbopack error

export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
export NODE_PATH="/opt/homebrew/bin/node"

echo "🚀 Starting Next.js dev server..."
echo "📍 Node.js: $(which node)"
echo "📍 npm: $(which npm)"
echo ""

# Use the full path to node
/opt/homebrew/bin/node node_modules/.bin/next dev
