#!/usr/bin/env tsx
/**
 * Verify New State Exams Integration
 * Tests that all 7 new exams are properly accessible
 */

import { examCategories } from "../src/lib/exams";

const NEW_EXAMS = [
  { id: "upsee", name: "UPSEE", state: "Uttar Pradesh" },
  { id: "bcece", name: "BCECE", state: "Bihar" },
  { id: "ojee", name: "OJEE", state: "Odisha" },
  { id: "tnea", name: "TNEA", state: "Tamil Nadu" },
  { id: "gujcet", name: "GUJCET", state: "Gujarat" },
  { id: "reap", name: "REAP", state: "Rajasthan" },
  { id: "jcece", name: "JCECE", state: "Jharkhand" },
];

console.log("═".repeat(80));
console.log("🧪 VERIFYING NEW STATE ENGINEERING EXAMS");
console.log("═".repeat(80));
console.log("");

// Find engineering category
const engineeringCategory = examCategories.find(cat => cat.id === "engineering");
if (!engineeringCategory) {
  console.error("❌ Engineering category not found!");
  process.exit(1);
}

console.log(`📚 Total Engineering Exams: ${engineeringCategory.exams.length}`);
console.log("");

let allPassed = true;

for (const newExam of NEW_EXAMS) {
  const exam = engineeringCategory.exams.find(e => e.id === newExam.id);

  if (!exam) {
    console.log(`❌ ${newExam.name} (${newExam.state}) - NOT FOUND`);
    allPassed = false;
    continue;
  }

  // Verify structure
  const hasAllSubjects = exam.subjects.length === 3;
  const allSubjectsHaveTopics = exam.subjects.every(s => s.topics.length >= 15);
  const hasDescription = exam.description && exam.description.length > 20;
  const hasColor = exam.color && exam.color.startsWith("#");

  if (hasAllSubjects && allSubjectsHaveTopics && hasDescription && hasColor) {
    const topicCount = exam.subjects.reduce((sum, s) => sum + s.topics.length, 0);
    console.log(`✅ ${newExam.name.padEnd(10)} (${newExam.state.padEnd(15)}) - ${exam.subjects.length} subjects, ${topicCount} topics`);
  } else {
    console.log(`⚠️  ${newExam.name} - Found but incomplete structure`);
    allPassed = false;
  }
}

console.log("");
console.log("═".repeat(80));

if (allPassed) {
  console.log("✅ ALL NEW EXAMS VERIFIED SUCCESSFULLY!");
  console.log("");
  console.log("Next Steps:");
  console.log("1. Visit https://prepgenie.co.in to verify in production");
  console.log("2. Test exam selection on homepage");
  console.log("3. Generate quiz questions for new exams");
  console.log("4. Run: npm run seed:continuous -- --exams upsee,bcece,ojee,tnea,gujcet,reap,jcece");
  console.log("");
  console.log("📊 Expected Question Generation:");
  console.log("   • 7 exams × 3 subjects × 18 topics × 20 questions");
  console.log("   • Total: ~7,560 questions");
  console.log("   • Runtime: 7-10 hours (overnight)");
} else {
  console.log("❌ SOME EXAMS FAILED VERIFICATION");
  process.exit(1);
}

console.log("═".repeat(80));
