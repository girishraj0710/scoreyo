#!/usr/bin/env node

/**
 * Quick test to verify OpenRouter API key works
 * Run: node test-openrouter.js
 */

require('dotenv').config({ path: '.env.local' });

async function testOpenRouter() {
  console.log('🧪 Testing OpenRouter API...\n');

  // Check API key
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error('❌ OPENROUTER_API_KEY not found in .env.local');
    process.exit(1);
  }

  console.log('✅ API Key found:', apiKey.substring(0, 20) + '...');
  console.log('📝 Making test request...\n');

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://krakkify.in',
        'X-Title': 'Krakkify Test',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite',
        messages: [
          {
            role: 'user',
            content: 'Generate 2 flashcards about Newton\'s Laws. Return as JSON array: [{"front": "...", "back": "..."}]'
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      })
    });

    console.log('📡 Response Status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:', errorText);
      process.exit(1);
    }

    const data = await response.json();
    console.log('✅ API Response received\n');
    console.log('📦 Full Response:', JSON.stringify(data, null, 2));

    const content = data.choices?.[0]?.message?.content;
    if (content) {
      console.log('\n📝 Generated Content:');
      console.log(content);

      // Try to parse JSON
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const cards = JSON.parse(jsonMatch[0]);
        console.log('\n✅ Successfully parsed', cards.length, 'flashcards');
        console.log('Sample card:', cards[0]);
      } else {
        console.log('\n⚠️  No JSON array found in response');
      }
    } else {
      console.log('\n❌ No content in response');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.stack) {
      console.error('Stack:', error.stack);
    }
    process.exit(1);
  }
}

testOpenRouter();
