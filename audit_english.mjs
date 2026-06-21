import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

const issues = [];
let totalTopics = 0;

try {
  const result = await pool.query(
    `SELECT path_id, topic_id, content 
     FROM topic_study_content 
     WHERE subject_id = 'english' 
     ORDER BY path_id, topic_id`
  );
  
  totalTopics = result.rows.length;
  
  for (const row of result.rows) {
    const { path_id, topic_id, content } = row;
    
    if (!content || !content.sections) {
      issues.push({ path: path_id, topic: topic_id, section: null, section_title: "ALL",
        issue: "MISSING_CONTENT", details: "No content" });
      continue;
    }
    
    content.sections.forEach((section, index) => {
      const sectionNum = index + 1;
      const title = section.title || `Section ${sectionNum}`;
      const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
      
      if (emojiRegex.test(section.title)) {
        issues.push({ path: path_id, topic: topic_id, section: sectionNum, section_title: title,
          issue: "EMOJI_IN_TITLE", details: section.title });
      }
      
      if (section.paragraphs?.length > 0) {
        section.paragraphs.forEach((para, pIdx) => {
          if (emojiRegex.test(para)) {
            issues.push({ path: path_id, topic: topic_id, section: sectionNum, section_title: title,
              issue: "EMOJI_IN_PARAGRAPH", details: `Para ${pIdx + 1}` });
          }
          
          const ph = ['content is being prepared', '[answer to be added]', 'coming soon', 'to be added'];
          if (ph.some(p => para.toLowerCase().includes(p))) {
            issues.push({ path: path_id, topic: topic_id, section: sectionNum, section_title: title,
              issue: "PLACEHOLDER_CONTENT", details: `Para ${pIdx + 1}` });
          }
        });
        
        if (section.paragraphs.length === 1 && section.paragraphs[0].length < 200 && 
            !section.examples && !section.table && !section.practice_exercises) {
          issues.push({ path: path_id, topic: topic_id, section: sectionNum, section_title: title,
            issue: "EMPTY_CONTENT", details: "Only brief intro" });
        }
      } else if (!section.table && !section.examples && !section.practice_exercises) {
        issues.push({ path: path_id, topic: topic_id, section: sectionNum, section_title: title,
          issue: "EMPTY_SECTION", details: "No content" });
      }
      
      if (section.examples?.length > 0) {
        section.examples.forEach((ex, eIdx) => {
          if (emojiRegex.test(ex.text)) {
            issues.push({ path: path_id, topic: topic_id, section: sectionNum, section_title: title,
              issue: "EMOJI_IN_EXAMPLE", details: `Example ${eIdx + 1}` });
          }
          if (ex.explanation && emojiRegex.test(ex.explanation)) {
            issues.push({ path: path_id, topic: topic_id, section: sectionNum, section_title: title,
              issue: "EMOJI_IN_EXPLANATION", details: `Example ${eIdx + 1}` });
          }
        });
      }
      
      if (section.table?.rows) {
        section.table.rows.forEach((row, rIdx) => {
          row.forEach((cell, cIdx) => {
            if (typeof cell === 'string' && emojiRegex.test(cell)) {
              issues.push({ path: path_id, topic: topic_id, section: sectionNum, section_title: title,
                issue: "EMOJI_IN_TABLE", details: `R${rIdx + 1}C${cIdx + 1}` });
            }
          });
        });
      }
      
      if (section.practice_exercises?.length > 0) {
        section.practice_exercises.forEach((ex, exIdx) => {
          if (emojiRegex.test(ex.question)) {
            issues.push({ path: path_id, topic: topic_id, section: sectionNum, section_title: title,
              issue: "EMOJI_IN_EXERCISE", details: `Q${exIdx + 1}` });
          }
          if (!ex.answer || !ex.answer.trim()) {
            issues.push({ path: path_id, topic: topic_id, section: sectionNum, section_title: title,
              issue: "MISSING_EXERCISE_ANSWER", details: `Q${exIdx + 1}` });
          }
          if (ex.answer && emojiRegex.test(ex.answer)) {
            issues.push({ path: path_id, topic: topic_id, section: sectionNum, section_title: title,
              issue: "EMOJI_IN_ANSWER", details: `A${exIdx + 1}` });
          }
        });
      }
      
      if (sectionNum === content.sections.length && 
          (!section.practice_exercises || section.practice_exercises.length === 0)) {
        issues.push({ path: path_id, topic: topic_id, section: sectionNum, section_title: title,
          issue: "MISSING_PRACTICE_EXERCISES", details: "Last section" });
      }
    });
  }
  
  console.log(JSON.stringify({ total_topics: totalTopics, issues }, null, 2));
  
} finally {
  await pool.end();
}
