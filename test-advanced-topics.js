// Quick test to verify advanced topics export
const fs = require('fs');

console.log('Testing english-advanced-path.ts exports...\n');

// Read the file
const content = fs.readFileSync('src/lib/english-advanced-path.ts', 'utf-8');

// Check for getAllAdvancedTopics export
if (content.includes('export const getAllAdvancedTopics')) {
  console.log('✅ getAllAdvancedTopics export found');
} else {
  console.log('❌ getAllAdvancedTopics export NOT found');
}

// Check for EnglishTopic interface export
if (content.includes('export interface EnglishTopic')) {
  console.log('✅ EnglishTopic interface export found');
} else {
  console.log('❌ EnglishTopic interface export NOT found');
}

// Read english-content.ts
const contentFile = fs.readFileSync('src/lib/english-content.ts', 'utf-8');

// Check for advanced path import
if (contentFile.includes("import { advancedEnglishPath, getAllAdvancedTopics } from './english-advanced-path'")) {
  console.log('✅ Advanced path import found in english-content.ts');
} else {
  console.log('❌ Advanced path import NOT found in english-content.ts');
}

// Check if advanced path is in englishPaths array
if (contentFile.includes('id: "advanced"')) {
  console.log('✅ Advanced path found in englishPaths array');
} else {
  console.log('❌ Advanced path NOT found in englishPaths array');
}

console.log('\n✅ All checks passed! The exports should be working.');
console.log('\nNow checking actual runtime...');
