import fs from 'fs';
const data = JSON.parse(fs.readFileSync('audit_clean.json', 'utf8'));

// Format each issue to match the schema
const formattedIssues = data.issues.map(issue => ({
  path: issue.path,
  topic: issue.topic,
  section: issue.section,
  section_title: issue.section_title,
  issue: issue.issue,
  details: issue.details
}));

const result = {
  total_topics: data.total_topics,
  issues: formattedIssues
};

// Output in a format that can be parsed
fs.writeFileSync('structured_output_data.json', JSON.stringify(result, null, 2));
console.log('Structured data saved to structured_output_data.json');
console.log(`Total topics: ${result.total_topics}`);
console.log(`Total issues: ${result.issues.length}`);
