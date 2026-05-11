import { createClient } from "@libsql/client";
import { readFileSync } from "fs";

// Read .env.local file
const envFile = readFileSync(".env.local", "utf-8");
const envVars: Record<string, string> = {};
envFile.split("\n").forEach((line) => {
  const [key, ...valueParts] = line.split("=");
  if (key && valueParts.length) {
    envVars[key.trim()] = valueParts.join("=").trim();
  }
});

const client = createClient({
  url: envVars.TURSO_DATABASE_URL,
  authToken: envVars.TURSO_AUTH_TOKEN,
});

// Sample English questions for Grammar Basics path
const sampleQuestions = [
  // Parts of Speech - Beginner
  {
    pathId: "foundation",
    topicId: "parts-of-speech",
    level: "beginner",
    question: "Which word in the sentence is a noun? 'The cat sleeps on the mat.'",
    options: ["sleeps", "cat", "on", "the"],
    correctAnswer: 1,
    explanation: "A noun is a word that names a person, place, thing, or idea. 'Cat' is a noun because it names an animal (a thing).",
    difficulty: "easy",
  },
  {
    pathId: "foundation",
    topicId: "parts-of-speech",
    level: "beginner",
    question: "Identify the verb in this sentence: 'She runs every morning.'",
    options: ["She", "runs", "every", "morning"],
    correctAnswer: 1,
    explanation: "A verb is a word that shows action or state of being. 'Runs' is the verb because it shows the action that 'She' performs.",
    difficulty: "easy",
  },
  {
    pathId: "foundation",
    topicId: "parts-of-speech",
    level: "beginner",
    question: "Which word is an adjective? 'The beautiful flower blooms.'",
    options: ["The", "beautiful", "flower", "blooms"],
    correctAnswer: 1,
    explanation: "An adjective describes a noun. 'Beautiful' describes the flower, telling us what kind of flower it is.",
    difficulty: "easy",
  },
  {
    pathId: "foundation",
    topicId: "parts-of-speech",
    level: "beginner",
    question: "What part of speech is 'quickly' in: 'He quickly finished his work.'",
    options: ["Noun", "Verb", "Adjective", "Adverb"],
    correctAnswer: 3,
    explanation: "An adverb modifies a verb, adjective, or another adverb. 'Quickly' describes how he finished (modifies the verb 'finished').",
    difficulty: "medium",
  },
  {
    pathId: "foundation",
    topicId: "parts-of-speech",
    level: "beginner",
    question: "Identify the pronoun: 'They went to the store.'",
    options: ["went", "to", "They", "store"],
    correctAnswer: 2,
    explanation: "A pronoun replaces a noun. 'They' is a pronoun that refers to people without naming them specifically.",
    difficulty: "easy",
  },

  // Sentence Structure - Beginner
  {
    pathId: "foundation",
    topicId: "nouns-detailed",
    level: "beginner",
    question: "Which sentence is complete?",
    options: [
      "Running in the park.",
      "The dog barks.",
      "Because it was late.",
      "After the movie.",
    ],
    correctAnswer: 1,
    explanation: "A complete sentence must have a subject and a verb. 'The dog barks' has both: 'dog' (subject) and 'barks' (verb).",
    difficulty: "easy",
  },
  {
    pathId: "foundation",
    topicId: "nouns-detailed",
    level: "beginner",
    question: "What is the subject in: 'My sister loves chocolate.'",
    options: ["My", "sister", "loves", "chocolate"],
    correctAnswer: 1,
    explanation: "The subject is who or what the sentence is about. 'Sister' is the subject because she is the one performing the action.",
    difficulty: "easy",
  },
  {
    pathId: "foundation",
    topicId: "nouns-detailed",
    level: "beginner",
    question: "Identify the predicate: 'The children played in the garden.'",
    options: ["The children", "played", "played in the garden", "the garden"],
    correctAnswer: 2,
    explanation: "The predicate includes the verb and everything that describes what the subject does. 'Played in the garden' is the complete predicate.",
    difficulty: "medium",
  },
  {
    pathId: "foundation",
    topicId: "nouns-detailed",
    level: "beginner",
    question: "Which is a compound sentence?",
    options: [
      "I like tea.",
      "I like tea, and she likes coffee.",
      "I like tea with sugar.",
      "I really like tea.",
    ],
    correctAnswer: 1,
    explanation: "A compound sentence joins two independent clauses with a conjunction. 'I like tea, and she likes coffee' has two complete sentences joined by 'and'.",
    difficulty: "medium",
  },
  {
    pathId: "foundation",
    topicId: "nouns-detailed",
    level: "beginner",
    question: "What type of sentence is: 'Close the door!'",
    options: ["Declarative", "Interrogative", "Imperative", "Exclamatory"],
    correctAnswer: 2,
    explanation: "An imperative sentence gives a command or makes a request. 'Close the door!' is commanding someone to close the door.",
    difficulty: "medium",
  },

  // Tenses - Beginner
  {
    pathId: "foundation",
    topicId: "verbs-basics",
    level: "beginner",
    question: "Which sentence is in present tense?",
    options: [
      "She walked to school.",
      "She walks to school.",
      "She will walk to school.",
      "She had walked to school.",
    ],
    correctAnswer: 1,
    explanation: "Present tense shows action happening now. 'Walks' is the present tense form of the verb 'walk'.",
    difficulty: "easy",
  },
  {
    pathId: "foundation",
    topicId: "verbs-basics",
    level: "beginner",
    question: "Choose the past tense form: 'I ___ to the park yesterday.'",
    options: ["go", "goes", "went", "going"],
    correctAnswer: 2,
    explanation: "Past tense shows action that already happened. 'Went' is the past tense of 'go'. The word 'yesterday' indicates past time.",
    difficulty: "easy",
  },
  {
    pathId: "foundation",
    topicId: "verbs-basics",
    level: "beginner",
    question: "Which sentence is in future tense?",
    options: [
      "They are eating lunch.",
      "They ate lunch.",
      "They will eat lunch.",
      "They eat lunch daily.",
    ],
    correctAnswer: 2,
    explanation: "Future tense shows action that will happen later. 'Will eat' indicates the action hasn't happened yet.",
    difficulty: "easy",
  },
  {
    pathId: "foundation",
    topicId: "verbs-basics",
    level: "beginner",
    question: "What tense is: 'She is reading a book.'",
    options: [
      "Simple present",
      "Present continuous",
      "Past continuous",
      "Simple past",
    ],
    correctAnswer: 1,
    explanation: "Present continuous (is/are + verb-ing) shows action happening right now. 'Is reading' indicates the action is in progress.",
    difficulty: "medium",
  },
  {
    pathId: "foundation",
    topicId: "verbs-basics",
    level: "beginner",
    question: "Complete: 'He ___ his homework when I called.' (past continuous)",
    options: ["does", "did", "was doing", "will do"],
    correctAnswer: 2,
    explanation: "Past continuous (was/were + verb-ing) shows ongoing action in the past. 'Was doing' indicates he was in the middle of doing homework.",
    difficulty: "medium",
  },

  // Punctuation - Beginner
  {
    pathId: "foundation",
    topicId: "articles",
    level: "beginner",
    question: "Which sentence has correct punctuation?",
    options: [
      "Where are you going",
      "Where are you going.",
      "Where are you going?",
      "Where are you going!",
    ],
    correctAnswer: 2,
    explanation: "Questions must end with a question mark. 'Where are you going?' is asking a question, so it needs a '?' at the end.",
    difficulty: "easy",
  },
  {
    pathId: "foundation",
    topicId: "articles",
    level: "beginner",
    question: "Choose the correctly punctuated sentence:",
    options: [
      "I bought apples oranges and bananas.",
      "I bought apples, oranges, and bananas.",
      "I bought apples oranges, and bananas.",
      "I bought, apples oranges and bananas.",
    ],
    correctAnswer: 1,
    explanation: "Items in a list should be separated by commas. Each item (apples, oranges, and bananas) needs a comma between them.",
    difficulty: "easy",
  },
  {
    pathId: "foundation",
    topicId: "articles",
    level: "beginner",
    question: "Where does the apostrophe go? 'The ___ toys are on the floor.' (one dog)",
    options: ["dogs", "dog's", "dogs'", "dogs's"],
    correctAnswer: 1,
    explanation: "For singular possession, add 's. 'Dog's' shows the toys belong to one dog. The apostrophe comes before the 's'.",
    difficulty: "medium",
  },
  {
    pathId: "foundation",
    topicId: "articles",
    level: "beginner",
    question: "Which sentence uses quotation marks correctly?",
    options: [
      'She said, I am tired.',
      'She said, "I am tired".',
      'She said, "I am tired."',
      '"She said, I am tired."',
    ],
    correctAnswer: 2,
    explanation: "Quotation marks go around the exact words spoken. The period goes inside the closing quotation mark in American English.",
    difficulty: "medium",
  },
  {
    pathId: "foundation",
    topicId: "articles",
    level: "beginner",
    question: "Choose the correct sentence:",
    options: [
      "Its a beautiful day.",
      "Its' a beautiful day.",
      "It's a beautiful day.",
      "Its's a beautiful day.",
    ],
    correctAnswer: 2,
    explanation: "'It's' is a contraction meaning 'it is'. The apostrophe replaces the missing letter 'i' from 'is'.",
    difficulty: "medium",
  },
];

async function seedEnglishQuestions() {
  console.log("🌱 Starting English questions seeding...");

  try {
    // Check current question count
    const existing = await client.execute(
      "SELECT COUNT(*) as count FROM english_questions"
    );
    const existingCount = existing.rows[0].count as number;
    console.log(`📊 Current database has ${existingCount} English questions.`);

    // Insert questions (skip duplicates)
    let inserted = 0;
    let skipped = 0;

    for (const q of sampleQuestions) {
      try {
        // Check if this exact question already exists
        const duplicate = await client.execute({
          sql: `SELECT id FROM english_questions
                WHERE path_id = ? AND topic_id = ? AND question = ?
                LIMIT 1`,
          args: [q.pathId, q.topicId, q.question],
        });

        if (duplicate.rows.length > 0) {
          skipped++;
          continue; // Skip this question, it already exists
        }

        // Insert new question
        await client.execute({
          sql: `INSERT INTO english_questions (path_id, topic_id, level, question, options, correct_answer, explanation, difficulty)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            q.pathId,
            q.topicId,
            q.level,
            q.question,
            JSON.stringify(q.options),
            q.correctAnswer,
            q.explanation,
            q.difficulty,
          ],
        });
        inserted++;
      } catch (err) {
        console.error(`⚠️  Failed to insert question: ${q.question.substring(0, 50)}...`);
        skipped++;
      }
    }

    console.log(`\n✅ Seeding complete!`);
    console.log(`   📥 Inserted: ${inserted} new questions`);
    console.log(`   ⏭️  Skipped: ${skipped} duplicates`);
    console.log(`   📊 Total in DB: ${existingCount + inserted} questions`);

    if (inserted === 0 && skipped > 0) {
      console.log("\n💡 All sample questions already exist in database. No changes made.");
    } else if (inserted > 0) {
      console.log("\nBreakdown of new questions:");
      const topicCounts: Record<string, number> = {};
      for (const q of sampleQuestions) {
        const key = `${q.topicId}`;
        topicCounts[key] = (topicCounts[key] || 0) + 1;
      }
      Object.entries(topicCounts).forEach(([topic, count]) => {
        console.log(`  - ${topic}: ${count} questions`);
      });
    }
  } catch (error) {
    console.error("❌ Error seeding English questions:", error);
    throw error;
  }
}

// Run the seed function
seedEnglishQuestions()
  .then(() => {
    console.log("\n🎉 English questions seed complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Seed failed:", error);
    process.exit(1);
  });
