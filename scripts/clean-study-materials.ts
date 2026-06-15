#!/usr/bin/env tsx
/**
 * Clean Study Materials - Remove emojis and fix markdown
 *
 * This script:
 * 1. Removes all emojis from study material markdown files
 * 2. Cleans up formatting to look professional
 * 3. Preserves all content and structure
 */

import { readFile, writeFile, readdir } from 'fs/promises';
import { join } from 'path';

const MATERIALS_DIR = 'content-generated/study-materials';

/**
 * Remove all emojis and clean markdown
 */
function cleanContent(content: string): string {
  return content
    // Remove ALL emojis using comprehensive Unicode ranges
    .replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')
    // Remove common emoji characters that might slip through
    .replace(/[📖📚🎯✅❌⚠️💡🔍📝🧪🎓📊⭐🏆🌟💪🔤🗣️👄⚡☀️📌🏗️♾️]/g, '')
    // Clean up emoji patterns in section headers (## 📖 becomes ## )
    .replace(/^(#{1,6})\s*[\p{Emoji}]+\s*/gmu, '$1 ')
    // Clean up multiple spaces left by emoji removal
    .replace(/\s{3,}/g, '  ')
    .replace(/\s{2,}\n/g, '\n')
    // Clean up list items with emoji prefixes (- ✅ becomes - )
    .replace(/^(\s*[-*])\s*[\p{Emoji}]+\s*/gm, '$1 ')
    // Trim whitespace from lines
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n')
    .trim();
}

async function main() {
  console.log('🧹 Cleaning Study Materials...\n');
  console.log('=' .repeat(60));

  try {
    // Read all markdown files
    const files = await readdir(MATERIALS_DIR);
    const mdFiles = files.filter(f => f.endsWith('.md'));

    console.log(`\n📁 Found ${mdFiles.length} markdown files\n`);

    let cleanedCount = 0;
    let errorCount = 0;

    for (const file of mdFiles) {
      const filePath = join(MATERIALS_DIR, file);

      try {
        console.log(`📄 Processing: ${file}`);

        // Read original content
        const originalContent = await readFile(filePath, 'utf-8');
        const originalLength = originalContent.length;

        // Clean content
        const cleanedContent = cleanContent(originalContent);
        const cleanedLength = cleanedContent.length;

        // Calculate bytes removed
        const bytesRemoved = originalLength - cleanedLength;

        // Write cleaned content back
        await writeFile(filePath, cleanedContent, 'utf-8');

        console.log(`   ✅ Cleaned: ${bytesRemoved} bytes removed (${originalLength} → ${cleanedLength})`);
        cleanedCount++;

      } catch (err: any) {
        console.log(`   ❌ Error: ${err.message}`);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Successfully cleaned: ${cleanedCount} files`);
    if (errorCount > 0) {
      console.log(`❌ Errors: ${errorCount} files`);
    }
    console.log('\n✨ All study materials cleaned!');
    console.log('\n📝 Next step: Run load-study-materials.ts to update database\n');

  } catch (err: any) {
    console.error('❌ Fatal error:', err.message);
    process.exit(1);
  }
}

main();
