import fs from 'fs';
const data = JSON.parse(fs.readFileSync('audit_clean.json', 'utf8'));

const output = {
  total_topics: data.total_topics,
  issues: data.issues
};

console.log(JSON.stringify(output));
