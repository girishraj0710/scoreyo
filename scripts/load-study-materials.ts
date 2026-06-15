#!/usr/bin/env tsx
/**
 * Load Study Materials into Supabase
 *
 * Usage:
 *   npx tsx scripts/load-study-materials.ts
 *
 * This script:
 * 1. Reads all markdown files from content-generated/study-materials/
 * 2. Extracts metadata from frontmatter (if present)
 * 3. Maps topic names to database topic_id
 * 4. Inserts into topic_study_content table in Supabase
 * 5. Reports success/failure statistics
 */

// Load environment variables from .env.local
import './load-env';

import { getPool } from '../src/lib/db';
import { readFile, readdir } from 'fs/promises';
import { join } from 'path';

interface StudyMaterial {
  fileName: string;
  topicName: string;
  title: string;
  subtitle?: string;
  overview?: string;
  content: string;
  difficultyLevel?: string;
  estimatedTimeMinutes?: number;
  level?: string; // CEFR level
}

const MATERIALS_DIR = 'content-generated/study-materials';

// Topic name mappings (filename → topic_id(s) in database)
// Some materials cover multiple topics (e.g., present-tenses.md covers all 4 present tense variations)
const TOPIC_MAPPINGS: Record<string, string[]> = {
  'parts-of-speech.md': ['parts-of-speech'],
  'present-tenses.md': ['present-tenses', 'present-simple', 'present-continuous', 'present-perfect', 'present-perfect-continuous'],
  'past-tenses.md': ['past-tenses', 'past-simple', 'past-continuous', 'past-perfect', 'past-perfect-continuous'],
  'future-tenses.md': ['future-tenses', 'future-simple', 'future-continuous', 'future-perfect', 'future-perfect-continuous'],
  'articles.md': ['articles'],
  'articles-a-an-the.md': ['articles'],
  'active-passive-voice.md': ['active-passive-voice', 'active-passive'],
  'active-and-passive-voice.md': ['active-passive-voice', 'active-passive'],
  'subject-verb-agreement.md': ['subject-verb-agreement']
};

function extractMetadata(content: string): {
  title: string;
  subtitle?: string;
  level?: string;
  estimatedTime?: number;
  overview?: string;
} {
  const lines = content.split('\n');
  const metadata: any = {};

  // Extract title (first # heading)
  const titleMatch = content.match(/^#\s+(.+)$/m);
  if (titleMatch) {
    metadata.title = titleMatch[1];
  }

  // Extract level and time from **Level:** line
  const levelTimeMatch = content.match(/\*\*Level:\*\*\s+(\w+)\s*\|\s*\*\*Time:\*\*\s+(\d+(-\d+)?)\s*mins?/i);
  if (levelTimeMatch) {
    metadata.level = levelTimeMatch[1];
    const timeStr = levelTimeMatch[2];
    // Handle ranges like "40-50" by taking the average
    if (timeStr.includes('-')) {
      const [min, max] = timeStr.split('-').map(Number);
      metadata.estimatedTime = Math.round((min + max) / 2);
    } else {
      metadata.estimatedTime = parseInt(timeStr);
    }
  }

  // Extract overview from "What is..." section (emoji already cleaned)
  const overviewMatch = content.match(/##\s+What (?:is|are)\s+(.+?)\n\n((?:.|\n)+?)(?=\n##|\n---)/);
  if (overviewMatch) {
    const overviewText = overviewMatch[2].trim();
    // Take first 500 characters as overview
    metadata.overview = overviewText.length > 500
      ? overviewText.slice(0, 500) + '...'
      : overviewText;
  }

  // Fallback: if no "What is..." section, extract from first paragraph after metadata
  if (!metadata.overview) {
    const firstParaMatch = content.match(/^---\s*\n\n(.+?)(?=\n\n|$)/m);
    if (firstParaMatch) {
      metadata.overview = firstParaMatch[1].slice(0, 500);
    }
  }

  // Last resort: use title as overview
  if (!metadata.overview && metadata.title) {
    metadata.overview = `Study material for ${metadata.title}`;
  }

  return metadata;
}

/**
 * Parse markdown content into structured sections
 * Splits by # headings (level 1) to capture all major sections like "Core Concepts", "Common Mistakes", etc.
 */
function parseMarkdownIntoSections(markdown: string, title: string): any[] {
  const sections: any[] = [];

  // Split by # headings (level 1) - NOT ## which are subsections
  const parts = markdown.split(/^#\s+(?!#)/m);

  // Skip the first part (title) and process remaining sections
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    const lines = part.split('\n');
    const sectionTitle = lines[0].trim();
    const sectionContent = lines.slice(1).join('\n').trim();

    // Skip empty sections and horizontal rule lines
    if (!sectionContent || sectionTitle.includes('---') || sectionContent.length < 10) {
      continue;
    }

    // Skip metadata sections (title is already extracted)
    if (sectionTitle === title) {
      continue;
    }

    sections.push({
      id: `section-${i}`,
      title: sectionTitle,
      content: sectionContent,
      order: i
    });
  }

  return sections;
}

async function loadMaterialFromFile(filePath: string, fileName: string): Promise<{
  materials: StudyMaterial[];
  error: string | null;
}> {
  console.log(`\n📖 Reading: ${fileName}`);

  try {
    const content = await readFile(filePath, 'utf-8');

    // Get topic_id(s) from mapping
    const topicIds = TOPIC_MAPPINGS[fileName];
    if (!topicIds || topicIds.length === 0) {
      return {
        materials: [],
        error: `No topic mapping found for ${fileName}. Add to TOPIC_MAPPINGS.`
      };
    }

    // Extract metadata
    const metadata = extractMetadata(content);

    if (!metadata.title) {
      return {
        materials: [],
        error: `Could not extract title from ${fileName}. Ensure it has a # heading.`
      };
    }

    console.log(`   ✅ Title: ${metadata.title}`);
    console.log(`   📏 Level: ${metadata.level || 'A2'}`);
    console.log(`   ⏱️  Time: ${metadata.estimatedTime || 40} mins`);
    console.log(`   📝 Content: ${content.length} characters`);
    console.log(`   🔗 Maps to ${topicIds.length} topic(s): ${topicIds.join(', ')}`);

    // Create one StudyMaterial entry for each topic_id mapping
    const materials: StudyMaterial[] = topicIds.map(topicId => ({
      fileName,
      topicName: topicId,
      title: metadata.title,
      content,
      difficultyLevel: metadata.level || 'A2',
      estimatedTimeMinutes: metadata.estimatedTime || 40,
      level: metadata.level,
      overview: metadata.overview
    }));

    return { materials, error: null };
  } catch (err: any) {
    return {
      materials: [],
      error: `Failed to read file: ${err.message}`
    };
  }
}

async function insertMaterial(material: StudyMaterial): Promise<{
  success: boolean;
  error: string | null;
  isUpdate: boolean;
}> {
  const pool = getPool();

  try {
    // Check if material already exists for this topic
    const checkResult = await pool.query(
      `SELECT id FROM topic_study_content WHERE topic_id = $1`,
      [material.topicName]
    );

    const exists = checkResult.rows.length > 0;

    // Parse markdown content into structured sections for database storage
    // The content column is JSONB, expecting: { sections: [...] }
    const sections = parseMarkdownIntoSections(material.content, material.title);
    const contentJSON = JSON.stringify({
      sections: sections
    });

    if (exists) {
      // Update existing material
      await pool.query(
        `UPDATE topic_study_content
         SET
           title = $1,
           subtitle = $2,
           overview = $3,
           content = $4::jsonb,
           difficulty_level = $5,
           estimated_time_minutes = $6,
           updated_at = NOW()
         WHERE topic_id = $7`,
        [
          material.title,
          material.subtitle || null,
          material.overview || null,
          contentJSON,
          material.difficultyLevel || 'A2',
          material.estimatedTimeMinutes || 40,
          material.topicName
        ]
      );

      return { success: true, error: null, isUpdate: true };
    } else {
      // Insert new material
      await pool.query(
        `INSERT INTO topic_study_content
         (subject_id, topic_id, path_id, title, subtitle, overview, content,
          difficulty_level, estimated_time_minutes, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9, NOW(), NOW())`,
        [
          'english',              // subject_id
          material.topicName,     // topic_id
          'foundation',           // path_id (all Week 1 materials are foundation)
          material.title,
          material.subtitle || null,
          material.overview || null,
          contentJSON,
          material.difficultyLevel || 'A2',
          material.estimatedTimeMinutes || 40
        ]
      );

      return { success: true, error: null, isUpdate: false };
    }
  } catch (err: any) {
    return {
      success: false,
      error: `Database error: ${err.message}`,
      isUpdate: false
    };
  }
}

async function getMaterialCounts(pool: any): Promise<Map<string, boolean>> {
  const result = await pool.query(`
    SELECT topic_id, COUNT(*) as count
    FROM topic_study_content
    WHERE subject_id = 'english'
    GROUP BY topic_id
  `);

  const exists = new Map<string, boolean>();
  for (const row of result.rows) {
    exists.set(row.topic_id, true);
  }
  return exists;
}

async function main() {
  console.log('🚀 Loading Study Materials into Supabase\n');
  console.log('=' .repeat(60));

  const pool = getPool();

  try {
    // Get existing materials
    console.log('\n📊 Current study materials in database:');
    const beforeExists = await getMaterialCounts(pool);
    if (beforeExists.size === 0) {
      console.log('   (none found)');
    } else {
      for (const topic of beforeExists.keys()) {
        console.log(`   ✅ ${topic}`);
      }
    }

    // Read all markdown files from materials directory
    const files = await readdir(MATERIALS_DIR);
    const mdFiles = files.filter(f => f.endsWith('.md'));

    if (mdFiles.length === 0) {
      console.log(`\n❌ No markdown files found in ${MATERIALS_DIR}/`);
      process.exit(1);
    }

    console.log(`\n📁 Found ${mdFiles.length} material files:`);
    mdFiles.forEach(f => console.log(`   - ${f}`));

    // Load and validate all materials
    console.log('\n' + '='.repeat(60));
    console.log('LOADING PHASE');
    console.log('='.repeat(60));

    const materials: StudyMaterial[] = [];
    const loadErrors: string[] = [];

    for (const file of mdFiles) {
      const filePath = join(MATERIALS_DIR, file);
      const { materials: fileMaterials, error } = await loadMaterialFromFile(filePath, file);

      if (error) {
        loadErrors.push(`${file}: ${error}`);
      } else if (fileMaterials.length > 0) {
        materials.push(...fileMaterials);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`✅ Loaded ${materials.length} material entries (from ${mdFiles.length} files)`);
    if (loadErrors.length > 0) {
      console.log(`⚠️  ${loadErrors.length} loading errors:`);
      loadErrors.forEach(err => console.log(`   - ${err}`));
    }

    if (materials.length === 0) {
      console.log('\n❌ No valid materials to insert. Exiting.');
      process.exit(1);
    }

    // Confirm before insertion
    console.log('\n' + '='.repeat(60));
    console.log('INSERTION PHASE');
    console.log('='.repeat(60));
    console.log(`\nReady to insert/update ${materials.length} materials in Supabase.`);
    console.log('Press Ctrl+C to cancel, or wait 3 seconds to continue...\n');

    await new Promise(resolve => setTimeout(resolve, 3000));

    // Insert materials
    console.log('📥 Inserting/updating materials...\n');

    let inserted = 0;
    let updated = 0;
    const insertErrors: string[] = [];

    for (const material of materials) {
      const { success, error, isUpdate } = await insertMaterial(material);

      if (success) {
        if (isUpdate) {
          console.log(`   ✅ Updated: ${material.topicName}`);
          updated++;
        } else {
          console.log(`   ✅ Inserted: ${material.topicName}`);
          inserted++;
        }
      } else {
        console.log(`   ❌ Failed: ${material.topicName}`);
        insertErrors.push(`${material.topicName}: ${error}`);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('RESULTS');
    console.log('='.repeat(60));
    console.log(`✅ Successfully inserted: ${inserted} materials`);
    console.log(`✅ Successfully updated: ${updated} materials`);
    if (insertErrors.length > 0) {
      console.log(`❌ Insertion errors: ${insertErrors.length}`);
      insertErrors.forEach(err => console.log(`   - ${err}`));
    }

    // Get counts after insertion
    console.log('\n📊 Updated study materials in database:');
    const afterExists = await getMaterialCounts(pool);
    for (const topic of afterExists.keys()) {
      const isNew = !beforeExists.has(topic);
      console.log(`   ${topic} ${isNew ? '(NEW)' : ''}`);
    }

    // Total count
    const totalResult = await pool.query(
      `SELECT COUNT(*) as total FROM topic_study_content WHERE subject_id = 'english'`
    );
    const totalInDb = parseInt(totalResult.rows[0].total);
    console.log(`\n📈 Total English study materials in database: ${totalInDb}`);

    console.log('\n✅ Load complete!');

  } catch (err: any) {
    console.error('\n❌ Fatal error:', err.message);
    console.error(err.stack);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
