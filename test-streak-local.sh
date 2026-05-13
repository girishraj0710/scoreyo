#!/bin/bash

echo "🔍 Testing Streak Data Locally"
echo "================================"
echo ""

# Wait for dev server
sleep 2

echo "1️⃣ Testing Dashboard Streak API..."
curl -s "http://localhost:3000/api/stats" \
  -H "Cookie: prepgenie-user-id=default-user" \
  | jq '.stats.streak' 2>/dev/null || echo "  ❌ Failed to get streak"

echo ""
echo "2️⃣ Testing Streak Calendar API..."
curl -s "http://localhost:3000/api/streak-calendar" \
  -H "Cookie: prepgenie-user-id=default-user" \
  | jq '.currentStreak, .last30Days' 2>/dev/null || echo "  ❌ Failed to get calendar data"

echo ""
echo "3️⃣ Testing Reports API (need Pro user)..."
curl -s "http://localhost:3000/api/reports" \
  -H "Cookie: prepgenie-user-id=default-user" \
  | jq '.stats.streak' 2>/dev/null || echo "  ⚠️  Reports might need Pro subscription"

echo ""
echo "================================"
echo "✅ Test complete!"
echo ""
echo "📝 Next steps:"
echo "1. Open browser: http://localhost:3000"
echo "2. Login with your actual account"
echo "3. Check Dashboard, Calendar, and Reports"
echo "4. Clear browser cache (Ctrl+Shift+R)"
