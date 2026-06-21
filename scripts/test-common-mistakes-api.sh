#!/bin/bash

# Test Common Mistakes study material via API
# Usage: ./scripts/test-common-mistakes-api.sh

echo "🧪 Testing Common Mistakes Study Material API..."
echo "================================================"
echo ""

# Check if server is running (development)
curl -s http://localhost:3000/api/study-content\?subject=english\&topic=common-mistakes\&path=foundation \
  -o /tmp/common-mistakes-response.json

if [ $? -eq 0 ]; then
  echo "✅ API Response received"
  echo ""

  # Parse and display key information
  echo "📊 Response Summary:"
  cat /tmp/common-mistakes-response.json | python3 -c "
import sys, json
data = json.load(sys.stdin)
if 'material' in data:
    m = data['material']
    print(f'  Topic ID: {m[\"topic_id\"]}')
    print(f'  Title: {m[\"title\"]}')
    print(f'  Level: {m[\"difficulty_level\"]}')
    print(f'  Duration: {m[\"estimated_time_minutes\"]} minutes')

    content = m['content']
    print(f'  Sections: {len(content[\"sections\"])}')

    for i, section in enumerate(content['sections'], 1):
        print(f'    {i}. {section[\"title\"]}')
else:
    print('  ❌ No material found in response')
"

  echo ""
  echo "✅ Test completed successfully"

else
  echo "❌ API request failed"
  echo "   Make sure the development server is running:"
  echo "   npm run dev"
fi

echo ""
echo "================================================"
echo "API Endpoint: /api/study-content?subject=english&topic=common-mistakes&path=foundation"
