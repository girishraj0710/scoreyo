#!/usr/bin/env tsx
import { examCategories } from "../src/lib/exams";

console.log("\n📚 Complete List of All Exams in PrepGenie\n");
console.log("=".repeat(80));

let totalExams = 0;
let totalSubjects = 0;
let totalTopics = 0;

for (const category of examCategories) {
  console.log(`\n${category.icon} ${category.name.toUpperCase()}\n`);
  
  for (const exam of category.exams) {
    totalExams++;
    console.log(`  ${exam.icon} ${exam.name} (${exam.id})`);
    console.log(`     Subjects: ${exam.subjects.length}`);
    
    const topicCount = exam.subjects.reduce((sum, s) => sum + s.topics.length, 0);
    totalSubjects += exam.subjects.length;
    totalTopics += topicCount;
    
    console.log(`     Topics: ${topicCount}`);
    
    // Show subjects
    exam.subjects.forEach(s => {
      console.log(`       - ${s.name} (${s.id}): ${s.topics.length} topics`);
    });
    console.log();
  }
}

console.log("=".repeat(80));
console.log(`\n📊 TOTALS:`);
console.log(`  Exams: ${totalExams}`);
console.log(`  Subjects: ${totalSubjects}`);
console.log(`  Total Topic References: ${totalTopics}`);
console.log(`  Unique Topics: Will calculate from database\n`);
