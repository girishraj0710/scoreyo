#!/usr/bin/env tsx
/**
 * STREAM A: Study Materials Generation
 * Generates Week 1 - 7 Grammar Fundamentals
 */

import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});

interface StudyMaterialRequest {
  topic: string;
  level: string;
  targetExams: string[];
  wordCount: number;
  sections: string[];
}

async function generateStudyMaterial(request: StudyMaterialRequest): Promise<string> {
  const sectionsFormatted = request.sections.map((section, i) => `
### ${i + 1}. ${section}

**Definition:** [Clear explanation]

**Rules:**
1. [Rule 1 with example]
2. [Rule 2 with example]
3. [Rule 3 with example]

**Examples:**
- ✅ CORRECT: [Example sentence]
- ❌ INCORRECT: [Common mistake] → WHY: [Explanation]
`).join('\n');

  const prompt = `You are a Cambridge-certified English teacher creating study materials for Indian students preparing for competitive exams.

TOPIC: ${request.topic}
LEVEL: ${request.level}
TARGET EXAMS: ${request.targetExams.join(", ")}
WORD COUNT: ${request.wordCount}

Create a clean, focused study material with ONLY these sections:

# ${request.topic}

**Level:** ${request.level} | **Time:** 30-40 mins | **Category:** Grammar

---

# What is ${request.topic}?

[2-3 paragraph introduction explaining the concept clearly. Use simple language accessible to non-native speakers. Include why this is important for competitive exams.]

---

# Core Concepts

${sectionsFormatted}

---

## Practice Problems

### Beginner Level (30%)
1. [Question with 4 options]
   **Answer:** [Correct option] - [Brief explanation]

2. [Question with 4 options]
   **Answer:** [Correct option] - [Brief explanation]

### Intermediate Level (50%)
3. [Question with 4 options]
   **Answer:** [Correct option] - [Detailed explanation]

4. [Question with 4 options]
   **Answer:** [Correct option] - [Detailed explanation]

5. [Question with 4 options]
   **Answer:** [Correct option] - [Detailed explanation]

### Advanced Level (20%)
6. [Challenging question with 4 options]
   **Answer:** [Correct option] - [Comprehensive explanation]

7. [Challenging question with 4 options]
   **Answer:** [Correct option] - [Comprehensive explanation]

---

## 📝 Exam Applications

### SSC CGL/CHSL Pattern
[Explain how this topic appears in SSC exams with 1-2 actual sample questions in SSC style]

### Banking PO/Clerk Pattern
[Explain how this topic appears in banking exams with 1-2 actual sample questions in banking style]

### IELTS Pattern
[Explain how this topic appears in IELTS (if applicable) with sample usage]

---

---

CRITICAL REQUIREMENTS:
1. Use INDIAN context examples (RBI policy, UPSC exam, Delhi University, Mumbai, Bangalore, Indian names like Rahul, Priya, Amit)
2. Address SPECIFIC mistakes made by Hindi/Telugu/Tamil/Bengali speakers (language interference patterns)
3. Include 7-10 practice questions with DETAILED explanations (not just "correct answer is B")
4. Add at least 2 tables or visual aids
5. Write in CLEAR, ACCESSIBLE language - avoid academic jargon, define technical terms
6. Target EXACTLY ${request.wordCount} words (±10%)
7. Every example must be a complete, grammatically correct sentence
8. Explanations must TEACH the concept, not just confirm the answer

OUTPUT FORMAT: Pure markdown. No preamble, no meta-commentary, no markdown code fences. Start directly with the # heading.`;

  const { text } = await generateText({
    model: openrouter("google/gemini-2.0-flash-exp:free"),
    prompt,
    temperature: 0.7,
    maxTokens: 8000,
  });

  return text;
}

// Week 1 Materials Configuration
const week1Materials: StudyMaterialRequest[] = [
  {
    topic: "Parts of Speech",
    level: "A1",
    targetExams: ["SSC CGL", "SSC CHSL", "Banking PO", "Banking Clerk", "IELTS", "All Foundation Learners"],
    wordCount: 2500,
    sections: [
      "Nouns (Person, Place, Thing, Idea)",
      "Pronouns (I, you, he, she, it, they)",
      "Verbs (Action Words and State Verbs)",
      "Adjectives (Describing Words)",
      "Adverbs (Describing Actions)",
      "Prepositions (in, on, at, by, with)",
      "Conjunctions (and, but, or, because)",
      "Interjections (Wow!, Ouch!, Hey!)"
    ]
  },
  {
    topic: "Present Tenses",
    level: "A2",
    targetExams: ["SSC CGL", "SSC CHSL", "Banking", "IELTS", "TOEFL", "All Competitive Exams"],
    wordCount: 3000,
    sections: [
      "Present Simple Tense (I work, She works)",
      "Present Continuous Tense (I am working)",
      "Present Perfect Tense (I have worked)",
      "Present Perfect Continuous (I have been working)",
      "Time Expressions for Each Tense",
      "Present Simple vs Present Continuous",
      "Present Perfect vs Past Simple"
    ]
  },
  {
    topic: "Past Tenses",
    level: "A2",
    targetExams: ["SSC", "Banking", "IELTS", "All Competitive Exams"],
    wordCount: 3000,
    sections: [
      "Past Simple Tense (I worked, She went)",
      "Past Continuous Tense (I was working)",
      "Past Perfect Tense (I had worked)",
      "Past Perfect Continuous (I had been working)",
      "Past Simple vs Present Perfect (Key Differences)",
      "Used To vs Would (Past Habits)"
    ]
  },
  {
    topic: "Future Tenses",
    level: "A2",
    targetExams: ["SSC", "Banking", "IELTS", "All Competitive Exams"],
    wordCount: 2500,
    sections: [
      "Future Simple (will work)",
      "Going to Future (am going to work)",
      "Present Continuous for Future (am working tomorrow)",
      "Future Perfect (will have worked)",
      "Future Continuous (will be working)",
      "Will vs Going to (When to Use Each)",
      "Time Clauses (when, as soon as, before, after)"
    ]
  },
  {
    topic: "Articles (a, an, the)",
    level: "B1",
    targetExams: ["SSC", "Banking", "UPSC", "IELTS", "All Error Spotting Questions"],
    wordCount: 2000,
    sections: [
      "Indefinite Articles (a, an) - When to Use",
      "Definite Article (the) - When to Use",
      "Zero Article (No Article) - When to Omit",
      "Articles with Countable and Uncountable Nouns",
      "Common Article Errors by Indian Students",
      "Articles with Proper Nouns"
    ]
  },
  {
    topic: "Active and Passive Voice",
    level: "B1",
    targetExams: ["SSC CGL", "Banking PO", "UPSC", "IELTS Writing", "Sentence Transformation"],
    wordCount: 2500,
    sections: [
      "What is Voice? (Definition and Purpose)",
      "Active to Passive Transformation Rules",
      "Passive Voice in All Tenses",
      "By Agent Usage (When to Include 'by')",
      "When to Use Active vs Passive Voice",
      "Common Passive Voice Mistakes",
      "Passive Voice in Questions and Negatives"
    ]
  },
  {
    topic: "Subject-Verb Agreement",
    level: "B1",
    targetExams: ["SSC", "Banking", "Error Spotting in All Exams"],
    wordCount: 2000,
    sections: [
      "Basic Agreement Rules (Singular with Singular)",
      "Singular Subjects (Everyone, Each, Either, Neither)",
      "Plural Subjects (Both, Many, Several)",
      "Collective Nouns (Team, Family, Government)",
      "Compound Subjects (with 'and', 'or', 'nor')",
      "Quantifiers (Some, Most, All, None)",
      "Distance, Time, Money as Singular"
    ]
  }
];

async function main() {
  console.log("🎓 STREAM A: Study Materials Generation Starting...\n");
  console.log(`Target: ${week1Materials.length} materials (~17,500 words total)\n`);

  // Ensure output directory exists
  await mkdir("content-generated/study-materials", { recursive: true });

  const results: Array<{ topic: string; status: string; wordCount?: number; error?: string }> = [];

  for (let i = 0; i < week1Materials.length; i++) {
    const material = week1Materials[i];
    const progress = `[${i + 1}/${week1Materials.length}]`;

    console.log(`${progress} Generating: ${material.topic} (target: ${material.wordCount} words)...`);

    try {
      const content = await generateStudyMaterial(material);
      const wordCount = content.split(/\s+/).length;

      // Save to file
      const filename = material.topic.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.md';
      const filepath = join("content-generated/study-materials", filename);
      await writeFile(filepath, content, 'utf-8');

      console.log(`✅ Generated: ${material.topic}`);
      console.log(`   Words: ${wordCount} (target: ${material.wordCount})`);
      console.log(`   File: ${filename}\n`);

      results.push({
        topic: material.topic,
        status: 'success',
        wordCount
      });

      // Rate limit: 2 seconds between requests (30 requests/minute)
      if (i < week1Materials.length - 1) {
        console.log("⏳ Waiting 2 seconds (rate limit)...\n");
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error: any) {
      console.error(`❌ Error generating ${material.topic}:`, error.message);
      results.push({
        topic: material.topic,
        status: 'error',
        error: error.message
      });
    }
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 STREAM A WEEK 1 SUMMARY");
  console.log("=".repeat(60));

  const successful = results.filter(r => r.status === 'success');
  const failed = results.filter(r => r.status === 'error');
  const totalWords = successful.reduce((sum, r) => sum + (r.wordCount || 0), 0);

  console.log(`✅ Successful: ${successful.length}/${week1Materials.length}`);
  console.log(`❌ Failed: ${failed.length}/${week1Materials.length}`);
  console.log(`📝 Total Words: ${totalWords.toLocaleString()}`);
  console.log(`💰 Estimated Cost: $${(successful.length * 0.05).toFixed(2)}`);

  if (failed.length > 0) {
    console.log("\n⚠️  Failed Materials (need retry):");
    failed.forEach(f => console.log(`   - ${f.topic}: ${f.error}`));
  }

  console.log("\n📁 Output Location: content-generated/study-materials/");
  console.log("🔍 Next Step: Human review + quality check");
  console.log("=".repeat(60) + "\n");
}

main().catch(console.error);
