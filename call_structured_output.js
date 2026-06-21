const fs = require('fs');

// Load the audit results
const data = JSON.parse(fs.readFileSync('./structured_output_data.json', 'utf8'));

// Format output - this will be printed to console
console.log(JSON.stringify({
  _call: 'StructuredOutput',
  parameters: {
    total_topics: data.total_topics,
    issues: data.issues
  }
}));
