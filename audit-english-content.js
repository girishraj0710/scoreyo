const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

async function auditEnglishContent() {
  const issues = [];
  let totalTopics = 0;

  try {
    // Fetch all English study content
    const result = await pool.query(
      `SELECT path_id, topic_id, content
       FROM topic_study_content
       WHERE subject_id = 'english'
       ORDER BY path_id, topic_id`
    );

    console.log(`Found ${result.rows.length} English topics in database`);
    totalTopics = result.rows.length;

    for (const row of result.rows) {
      const { path_id: path, topic_id: topic, content } = row;

      try {
        // Content is already a JSONB object in PostgreSQL, no need to parse
        const parsedContent = content;

        // Check each section
        if (parsedContent.sections && Array.isArray(parsedContent.sections)) {
          parsedContent.sections.forEach((section, index) => {
            const sectionNum = index + 1;

            // Issue 1: Empty sections (only intro, no examples)
            if (section.content) {
              const hasOnlyIntro =
                section.content.paragraphs?.length > 0 &&
                (!section.content.examples || section.content.examples.length === 0) &&
                (!section.content.table || section.content.table.rows?.length === 0) &&
                (!section.content.notes || section.content.notes.length === 0) &&
                (!section.content.exercises || section.content.exercises.length === 0);

              if (hasOnlyIntro && section.title !== 'Overview' && section.title !== 'Introduction') {
                issues.push({
                  path,
                  topic,
                  section: sectionNum,
                  section_title: section.title,
                  issue: 'EMPTY_CONTENT',
                  details: 'Only has intro paragraph, no examples/exercises'
                });
              }
            }

            // Issue 2: Emojis in text
            const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

            // Check paragraphs
            section.content?.paragraphs?.forEach((para, pIdx) => {
              if (emojiRegex.test(para)) {
                issues.push({
                  path,
                  topic,
                  section: sectionNum,
                  section_title: section.title,
                  issue: 'EMOJI_FOUND',
                  details: `Paragraph ${pIdx + 1}: "${para.substring(0, 50)}..."`
                });
              }
            });

            // Check examples
            section.content?.examples?.forEach((example, eIdx) => {
              if (emojiRegex.test(example.text || '')) {
                issues.push({
                  path,
                  topic,
                  section: sectionNum,
                  section_title: section.title,
                  issue: 'EMOJI_FOUND',
                  details: `Example ${eIdx + 1} text: "${(example.text || '').substring(0, 50)}..."`
                });
              }
              if (emojiRegex.test(example.explanation || '')) {
                issues.push({
                  path,
                  topic,
                  section: sectionNum,
                  section_title: section.title,
                  issue: 'EMOJI_FOUND',
                  details: `Example ${eIdx + 1} explanation: "${(example.explanation || '').substring(0, 50)}..."`
                });
              }
            });

            // Check notes
            section.content?.notes?.forEach((note, nIdx) => {
              if (emojiRegex.test(note)) {
                issues.push({
                  path,
                  topic,
                  section: sectionNum,
                  section_title: section.title,
                  issue: 'EMOJI_FOUND',
                  details: `Note ${nIdx + 1}: "${note.substring(0, 50)}..."`
                });
              }
            });

            // Check table cells
            section.content?.table?.rows?.forEach((rowData, rIdx) => {
              rowData.forEach((cell, cIdx) => {
                if (typeof cell === 'string' && emojiRegex.test(cell)) {
                  issues.push({
                    path,
                    topic,
                    section: sectionNum,
                    section_title: section.title,
                    issue: 'EMOJI_FOUND',
                    details: `Table row ${rIdx + 1}, cell ${cIdx + 1}: "${cell.substring(0, 50)}..."`
                  });
                }
              });
            });

            // Issue 3: Placeholder content
            const placeholders = [
              'Content is being prepared',
              'Content coming soon',
              '[Answer to be added]',
              'To be added',
              'TBD',
              'Coming soon'
            ];

            const allText = JSON.stringify(section.content || {}).toLowerCase();
            placeholders.forEach(placeholder => {
              if (allText.includes(placeholder.toLowerCase())) {
                issues.push({
                  path,
                  topic,
                  section: sectionNum,
                  section_title: section.title,
                  issue: 'PLACEHOLDER_CONTENT',
                  details: `Contains: "${placeholder}"`
                });
              }
            });

            // Issue 4: Formatting issues (excessive escape characters)
            const escapeRegex = /\\{2,}/g;
            if (escapeRegex.test(JSON.stringify(section.content || {}))) {
              issues.push({
                path,
                topic,
                section: sectionNum,
                section_title: section.title,
                issue: 'FORMATTING_ISSUE',
                details: 'Contains excessive escape characters (\\\\)'
              });
            }

            // Issue 5: Missing practice exercises (only for last section)
            if (index === parsedContent.sections.length - 1) {
              const hasExercises = section.content?.exercises?.length > 0;
              if (!hasExercises) {
                issues.push({
                  path,
                  topic,
                  section: sectionNum,
                  section_title: section.title,
                  issue: 'NO_PRACTICE_EXERCISES',
                  details: 'Final section lacks practice exercises'
                });
              }
            }
          });
        }

      } catch (parseError) {
        issues.push({
          path,
          topic,
          section: 0,
          section_title: 'N/A',
          issue: 'JSON_PARSE_ERROR',
          details: `Cannot parse content JSON: ${parseError.message}`
        });
      }
    }

    console.log(`\nAudit complete: ${issues.length} issues found across ${totalTopics} topics`);

    // Output results as JSON
    console.log('\n=== RESULTS ===');
    console.log(JSON.stringify({ issues, total_topics: totalTopics }, null, 2));

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

auditEnglishContent();
