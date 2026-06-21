import fs from 'fs';

const data = JSON.parse(fs.readFileSync('audit_clean.json', 'utf8'));

console.log('Total topics audited:', data.total_topics);
console.log('Total issues found:', data.issues.length);
console.log('\nIssues by type:');

const byType = {};
data.issues.forEach(issue => {
  byType[issue.issue] = (byType[issue.issue] || 0) + 1;
});

Object.entries(byType).sort((a, b) => b[1] - a[1]).forEach(([type, count]) => {
  console.log(`  ${type}: ${count}`);
});

console.log('\nTopics with issues:');
const byTopic = {};
data.issues.forEach(issue => {
  const key = `${issue.path}/${issue.topic}`;
  byTopic[key] = (byTopic[key] || 0) + 1;
});

const topicCount = Object.keys(byTopic).length;
console.log(`  ${topicCount} out of ${data.total_topics} topics have issues`);
console.log(`  ${data.total_topics - topicCount} topics are clean`);
