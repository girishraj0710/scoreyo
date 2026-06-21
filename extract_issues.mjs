import fs from 'fs';
const data = JSON.parse(fs.readFileSync('audit_clean.json', 'utf8'));
console.log(JSON.stringify(data.issues));
