#!/usr/bin/env node

/**
 * Test Together AI API Key
 * Quick verification before running full batch
 */

const fs = require('fs');
const path = require('path');

// Read API key
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local file not found');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const TOGETHER_API_KEY = envContent.match(/TOGETHER_API_KEY=(.+)/)?.[1]?.trim();

if (!TOGETHER_API_KEY) {
  console.error('❌ TOGETHER_API_KEY not found in .env.local\n');
  console.error('📝 Setup instructions:');
  console.error('   1. Sign up: https://api.together.xyz/signup');
  console.error('   2. Get API key from dashboard');
  console.error('   3. Add to .env.local: TOGETHER_API_KEY=your_key_here\n');
  process.exit(1);
}

console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║  Testing Together AI API Connection                         ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

console.log('✅ API key found in .env.local');
console.log(`📝 Key: ${TOGETHER_API_KEY.substring(0, 20)}...${TOGETHER_API_KEY.slice(-10)}\n`);

async function testAPI() {
  try {
    console.log('🔄 Testing API connection...\n');

    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'Qwen/Qwen2.5-7B-Instruct-Turbo',
        messages: [
          {
            role: 'user',
            content: 'Generate a simple math question: What is 5 + 7? Return only JSON: {"question": "...", "answer": "..."}'
          }
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`❌ API Error ${response.status}:`);
      console.error(error);

      if (response.status === 401) {
        console.error('\n💡 Your API key is invalid. Please check:');
        console.error('   1. Go to https://api.together.xyz/settings/api-keys');
        console.error('   2. Copy the key exactly (no spaces)');
        console.error('   3. Update .env.local\n');
      } else if (response.status === 402) {
        console.error('\n💡 Payment required. Please check:');
        console.error('   1. Go to https://api.together.xyz/settings/billing');
        console.error('   2. Verify you have $5 free credit');
        console.error('   3. If not, add $1 minimum\n');
      } else if (response.status === 429) {
        console.error('\n💡 Rate limit exceeded. This is normal if you just signed up.');
        console.error('   Wait 1 minute and try again.\n');
      }

      process.exit(1);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    console.log('✅ API connection successful!\n');
    console.log('📝 Test response:');
    console.log(content.substring(0, 200));
    console.log('\n✅ Model: Llama 3.1 8B Turbo');

    // Check usage/billing info if available
    if (data.usage) {
      console.log(`\n📊 Token usage:`);
      console.log(`   - Input tokens: ${data.usage.prompt_tokens}`);
      console.log(`   - Output tokens: ${data.usage.completion_tokens}`);
      console.log(`   - Total tokens: ${data.usage.total_tokens}`);
    }

    console.log('\n╔═══════════════════════════════════════════════════════════════╗');
    console.log('║  ✅ ALL CHECKS PASSED!                                       ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝\n');
    console.log('🚀 You are ready to generate mock tests!');
    console.log('   Run: ./scripts/generate-all-mock-tests.sh\n');

  } catch (error) {
    console.error(`❌ Connection error: ${error.message}\n`);
    console.error('💡 Possible issues:');
    console.error('   - Check your internet connection');
    console.error('   - Verify API key is correct');
    console.error('   - Try again in a few seconds\n');
    process.exit(1);
  }
}

testAPI();
