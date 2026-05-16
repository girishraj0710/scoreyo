#!/usr/bin/env tsx
/**
 * Test Mock Test Availability
 *
 * Checks how many mock tests are currently available for each exam
 * based on question bank size
 */

import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join } from "path";

const envFile = readFileSync(join(process.cwd(), ".env.local"), "utf-8");
envFile.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const [, key, value] = match;
    process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
  }
});

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Mock test templates (same as dynamic-mock-test-config.ts)
const templates = [
  { examId: "jee-main", examName: "JEE Main", questionsPerTest: 30, sections: [
    { subjectId: "jee-physics", name: "Physics", count: 10 },
    { subjectId: "jee-chemistry", name: "Chemistry", count: 10 },
    { subjectId: "jee-maths", name: "Mathematics", count: 10 },
  ]},
  { examId: "jee-advanced", examName: "JEE Advanced", questionsPerTest: 30, sections: [
    { subjectId: "jee-adv-physics", name: "Physics", count: 10 },
    { subjectId: "jee-adv-chemistry", name: "Chemistry", count: 10 },
    { subjectId: "jee-adv-maths", name: "Mathematics", count: 10 },
  ]},
  { examId: "kcet", examName: "Karnataka CET", questionsPerTest: 30, sections: [
    { subjectId: "kcet-physics", name: "Physics", count: 10 },
    { subjectId: "kcet-chemistry", name: "Chemistry", count: 10 },
    { subjectId: "kcet-maths", name: "Mathematics", count: 10 },
  ]},
  { examId: "comedk", examName: "COMEDK", questionsPerTest: 30, sections: [
    { subjectId: "comedk-physics", name: "Physics", count: 10 },
    { subjectId: "comedk-chemistry", name: "Chemistry", count: 10 },
    { subjectId: "comedk-maths", name: "Mathematics", count: 10 },
  ]},
  { examId: "mht-cet", examName: "MHT CET", questionsPerTest: 30, sections: [
    { subjectId: "mht-physics", name: "Physics", count: 10 },
    { subjectId: "mht-chemistry", name: "Chemistry", count: 10 },
    { subjectId: "mht-maths", name: "Mathematics", count: 10 },
  ]},
  { examId: "neet-ug", examName: "NEET UG", questionsPerTest: 30, sections: [
    { subjectId: "neet-physics", name: "Physics", count: 10 },
    { subjectId: "neet-chemistry", name: "Chemistry", count: 10 },
    { subjectId: "neet-biology", name: "Biology", count: 10 },
  ]},
  { examId: "gate", examName: "GATE CS", questionsPerTest: 20, sections: [
    { subjectId: "gate-cs", name: "CS", count: 14 },
    { subjectId: "gate-aptitude", name: "Aptitude", count: 3 },
    { subjectId: "gate-engineering-math", name: "Math", count: 3 },
  ]},
  { examId: "upsc-cse", examName: "UPSC CSE", questionsPerTest: 25, sections: [
    { subjectId: "upsc-polity", name: "Polity", count: 5 },
    { subjectId: "upsc-history", name: "History", count: 5 },
    { subjectId: "upsc-geography", name: "Geography", count: 5 },
    { subjectId: "upsc-economy", name: "Economy", count: 5 },
    { subjectId: "upsc-science", name: "Science", count: 5 },
  ]},
];

async function testAvailability() {
  console.log("=".repeat(80));
  console.log("🎯 MOCK TEST AVAILABILITY CHECK");
  console.log("=".repeat(80));
  console.log();

  for (const template of templates) {
    console.log(`\n📚 ${template.examName}`);
    console.log("─".repeat(60));

    let minTests = Infinity;
    let bottleneck = "";
    let totalQuestions = 0;

    for (const section of template.sections) {
      const result = await db.execute({
        sql: "SELECT COUNT(*) as count FROM exam_questions WHERE exam_id = ? AND subject_id = ?",
        args: [template.examId, section.subjectId],
      });

      const available = Number(result.rows[0].count);
      totalQuestions += available;

      // Calculate tests from this subject (with 80% buffer)
      const testsFromSubject = Math.floor((available * 0.8) / section.count);

      console.log(`   ${section.name.padEnd(15)} ${available.toString().padStart(4)}Q → ${testsFromSubject.toString().padStart(3)} tests`);

      if (testsFromSubject < minTests) {
        minTests = testsFromSubject;
        bottleneck = section.name;
      }
    }

    const availableTests = minTests === Infinity ? 0 : minTests;

    console.log();
    console.log(`   Total Questions:  ${totalQuestions}`);
    console.log(`   Questions/Test:   ${template.questionsPerTest}`);
    console.log(`   Available Tests:  ${availableTests} ${availableTests > 0 ? '✅' : '❌'}`);

    if (availableTests > 0) {
      console.log(`   Bottleneck:       ${bottleneck}`);
      if (availableTests < 5) {
        console.log(`   Status:           🌱 Growing (needs more questions)`);
      } else if (availableTests < 10) {
        console.log(`   Status:           ✨ Good (decent coverage)`);
      } else {
        console.log(`   Status:           🔥 Excellent (abundant tests)`);
      }
    } else {
      console.log(`   Status:           ⏳ Waiting for seeding`);
    }
  }

  console.log();
  console.log("=".repeat(80));
  console.log("📊 SUMMARY");
  console.log("=".repeat(80));

  // Overall stats
  const totalResult = await db.execute("SELECT COUNT(*) as count FROM exam_questions");
  const totalInBank = Number(totalResult.rows[0].count);

  console.log(`\nTotal Questions in Bank: ${totalInBank}`);
  console.log(`Exams Checked: ${templates.length}`);
  console.log();
  console.log("💡 More questions = More mock tests!");
  console.log("   Daily seeding will increase available tests automatically.");
  console.log("=".repeat(80));
}

testAvailability()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
  });
