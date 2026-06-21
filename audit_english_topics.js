const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

async function auditEnglishTopics() {
  const issues = [];
  
  try {
    // Fetch all English topics
    const result = await pool.query(
      `SELECT path, topic_key, content 
       FROM topic_study_content 
       WHERE subject_id = 'english' 
       ORDER BY path, topic_key`
    );
    
    console.log(`Found ${result.rows.length} English topics to audit`);
    
    for (const row of result.rows) {
      const { path, topic_key, content } = row;
      
      if (!content || !content.sections) {
        issues.push({
          path,
          topic: topic_key,
          section: null,
          section_title: "ALL",
          issue: "MISSING_CONTENT",
          details: "No content object or sections array found"
        });
        continue;
      }
      
      // Check each section
      content.sections.forEach((section, index) => {
        const sectionNum = index + 1;
        const title = section.title || `Section ${sectionNum}`;
        
        // Check for emojis in title
        const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
        if (emojiRegex.test(section.title)) {
          issues.push({
            path,
            topic: topic_key,
            section: sectionNum,
            section_title: title,
            issue: "EMOJI_IN_TITLE",
            details: `Title contains emojis: "${section.title}"`
          });
        }
        
        // Check paragraphs
        if (section.paragraphs && section.paragraphs.length > 0) {
          section.paragraphs.forEach((para, pIndex) => {
            // Check for emojis in paragraphs
            if (emojiRegex.test(para)) {
              issues.push({
                path,
                topic: topic_key,
                section: sectionNum,
                section_title: title,
                issue: "EMOJI_IN_PARAGRAPH",
                details: `Paragraph ${pIndex + 1} contains emojis`
              });
            }
            
            // Check for placeholder content
            const placeholders = [
              'Content is being prepared',
              'content is being prepared',
              '[Answer to be added]',
              '[answer to be added]',
              'Coming soon',
              'coming soon',
              'To be added',
              'to be added'
            ];
            
            if (placeholders.some(ph => para.toLowerCase().includes(ph.toLowerCase()))) {
              issues.push({
                path,
                topic: topic_key,
                section: sectionNum,
                section_title: title,
                issue: "PLACEHOLDER_CONTENT",
                details: `Paragraph ${pIndex + 1} contains placeholder text`
              });
            }
            
            // Check for excessive escape characters or formatting issues
            if (para.includes('\\n\\n\\n') || para.includes('    ')) {
              issues.push({
                path,
                topic: topic_key,
                section: sectionNum,
                section_title: title,
                issue: "FORMATTING_ISSUE",
                details: `Paragraph ${pIndex + 1} has excessive whitespace/escapes`
              });
            }
          });
          
          // Check if section only has intro (single short paragraph)
          if (section.paragraphs.length === 1 && section.paragraphs[0].length < 200 && !section.examples && !section.table && !section.practice_exercises) {
            issues.push({
              path,
              topic: topic_key,
              section: sectionNum,
              section_title: title,
              issue: "EMPTY_CONTENT",
              details: "Only has brief intro paragraph, no examples or details"
            });
          }
        } else if (!section.table && !section.examples && !section.practice_exercises) {
          // Section has no paragraphs and no other content
          issues.push({
            path,
            topic: topic_key,
            section: sectionNum,
            section_title: title,
            issue: "EMPTY_SECTION",
            details: "Section has no paragraphs, examples, tables, or exercises"
          });
        }
        
        // Check examples
        if (section.examples && section.examples.length > 0) {
          section.examples.forEach((example, eIndex) => {
            if (emojiRegex.test(example.text)) {
              issues.push({
                path,
                topic: topic_key,
                section: sectionNum,
                section_title: title,
                issue: "EMOJI_IN_EXAMPLE",
                details: `Example ${eIndex + 1} contains emojis`
              });
            }
            
            if (example.explanation && emojiRegex.test(example.explanation)) {
              issues.push({
                path,
                topic: topic_key,
                section: sectionNum,
                section_title: title,
                issue: "EMOJI_IN_EXPLANATION",
                details: `Example ${eIndex + 1} explanation contains emojis`
              });
            }
          });
        }
        
        // Check table content
        if (section.table && section.table.rows) {
          section.table.rows.forEach((row, rIndex) => {
            row.forEach((cell, cIndex) => {
              if (typeof cell === 'string' && emojiRegex.test(cell)) {
                issues.push({
                  path,
                  topic: topic_key,
                  section: sectionNum,
                  section_title: title,
                  issue: "EMOJI_IN_TABLE",
                  details: `Table row ${rIndex + 1}, column ${cIndex + 1} contains emojis`
                });
              }
            });
          });
        }
        
        // Check practice exercises
        if (section.practice_exercises && section.practice_exercises.length > 0) {
          section.practice_exercises.forEach((exercise, exIndex) => {
            if (emojiRegex.test(exercise.question)) {
              issues.push({
                path,
                topic: topic_key,
                section: sectionNum,
                section_title: title,
                issue: "EMOJI_IN_EXERCISE",
                details: `Exercise ${exIndex + 1} question contains emojis`
              });
            }
            
            if (!exercise.answer || exercise.answer.trim() === '') {
              issues.push({
                path,
                topic: topic_key,
                section: sectionNum,
                section_title: title,
                issue: "MISSING_EXERCISE_ANSWER",
                details: `Exercise ${exIndex + 1} has no answer`
              });
            }
            
            if (exercise.answer && emojiRegex.test(exercise.answer)) {
              issues.push({
                path,
                topic: topic_key,
                section: sectionNum,
                section_title: title,
                issue: "EMOJI_IN_ANSWER",
                details: `Exercise ${exIndex + 1} answer contains emojis`
              });
            }
          });
        }
        
        // Check if section should have practice exercises but doesn't
        if (sectionNum === content.sections.length && (!section.practice_exercises || section.practice_exercises.length === 0)) {
          issues.push({
            path,
            topic: topic_key,
            section: sectionNum,
            section_title: title,
            issue: "MISSING_PRACTICE_EXERCISES",
            details: "Last section typically should have practice exercises"
          });
        }
      });
    }
    
    console.log('\n=== AUDIT COMPLETE ===');
    console.log(`Total topics audited: ${result.rows.length}`);
    console.log(`Total issues found: ${issues.length}`);
    console.log('\n' + JSON.stringify(issues, null, 2));
    
  } catch (error) {
    console.error('Audit failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

auditEnglishTopics();
