#!/usr/bin/env tsx
/**
 * Seed NEET Physics - Semiconductors & Communication questions
 */
import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join } from "path";

const envFile = readFileSync(join(process.cwd(), ".env.local"), "utf-8");
envFile.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const [, key, value] = match;
    process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, "");
  }
});

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const questions = [
  {
    topic: "Semiconductors & Communication (Diodes, Transistors, Logic gates)",
    question: "In a forward biased p-n junction diode, which carriers are responsible for current?",
    options: [
      "Only majority carriers",
      "Only minority carriers",
      "Both majority and minority carriers",
      "Neither majority nor minority carriers"
    ],
    correctAnswer: 2,
    explanation: "In forward bias, both majority carriers (electrons from n-side, holes from p-side) and minority carriers contribute to current flow across the junction.",
    difficulty: "medium",
  },
  {
    topic: "Semiconductors & Communication (Diodes, Transistors, Logic gates)",
    question: "The output of an AND gate is HIGH only when:",
    options: [
      "At least one input is HIGH",
      "All inputs are HIGH",
      "All inputs are LOW",
      "At least one input is LOW"
    ],
    correctAnswer: 1,
    explanation: "An AND gate produces HIGH output (1) only when ALL inputs are HIGH. If any input is LOW, output is LOW.",
    difficulty: "easy",
  },
  {
    topic: "Semiconductors & Communication (Diodes, Transistors, Logic gates)",
    question: "In a transistor operating in active mode, which junction is forward biased?",
    options: [
      "Emitter-base junction",
      "Collector-base junction",
      "Both junctions",
      "Neither junction"
    ],
    correctAnswer: 0,
    explanation: "In active mode: emitter-base junction is forward biased (allows carriers to enter base), and collector-base junction is reverse biased (sweeps carriers to collector).",
    difficulty: "medium",
  },
  {
    topic: "Semiconductors & Communication (Diodes, Transistors, Logic gates)",
    question: "The barrier potential of a silicon p-n junction at room temperature is approximately:",
    options: [
      "0.3 V",
      "0.7 V",
      "1.1 V",
      "1.5 V"
    ],
    correctAnswer: 1,
    explanation: "Silicon p-n junction has a built-in barrier potential of ~0.7 V at room temperature. For germanium, it's ~0.3 V.",
    difficulty: "easy",
  },
  {
    topic: "Semiconductors & Communication (Diodes, Transistors, Logic gates)",
    question: "Which logic gate is represented by the Boolean expression: Y = A + B?",
    options: [
      "AND gate",
      "OR gate",
      "NOT gate",
      "NAND gate"
    ],
    correctAnswer: 1,
    explanation: "The Boolean expression Y = A + B represents an OR gate, where output is HIGH if at least one input is HIGH.",
    difficulty: "easy",
  },
  {
    topic: "Semiconductors & Communication (Diodes, Transistors, Logic gates)",
    question: "In a common emitter amplifier, the current gain (β) is defined as:",
    options: [
      "IC/IB",
      "IE/IB",
      "IC/IE",
      "IB/IC"
    ],
    correctAnswer: 0,
    explanation: "Current gain β (beta) = IC/IB, the ratio of collector current to base current. Typical values are 50-300.",
    difficulty: "easy",
  },
  {
    topic: "Semiconductors & Communication (Diodes, Transistors, Logic gates)",
    question: "A Zener diode is primarily used as a:",
    options: [
      "Rectifier",
      "Amplifier",
      "Voltage regulator",
      "Oscillator"
    ],
    correctAnswer: 2,
    explanation: "Zener diodes operate in reverse breakdown region and maintain constant voltage, making them ideal voltage regulators.",
    difficulty: "easy",
  },
  {
    topic: "Semiconductors & Communication (Diodes, Transistors, Logic gates)",
    question: "The output of a NOT gate is:",
    options: [
      "Always HIGH",
      "Always LOW",
      "Same as input",
      "Complement of input"
    ],
    correctAnswer: 3,
    explanation: "A NOT gate (inverter) produces the complement (opposite) of its input: if input is 0, output is 1, and vice versa.",
    difficulty: "easy",
  },
  {
    topic: "Semiconductors & Communication (Diodes, Transistors, Logic gates)",
    question: "In intrinsic semiconductors at temperature T > 0 K, the number of electrons in conduction band is:",
    options: [
      "Greater than holes in valence band",
      "Less than holes in valence band",
      "Equal to holes in valence band",
      "Zero"
    ],
    correctAnswer: 2,
    explanation: "In intrinsic (pure) semiconductors, thermal excitation creates electron-hole pairs. Thus, ne = nh at any temperature.",
    difficulty: "medium",
  },
  {
    topic: "Semiconductors & Communication (Diodes, Transistors, Logic gates)",
    question: "The depletion region in a p-n junction contains:",
    options: [
      "Mobile electrons and holes",
      "Fixed ions only",
      "Mobile carriers and fixed ions",
      "No charges"
    ],
    correctAnswer: 1,
    explanation: "Depletion region contains immobile ionized acceptor atoms (negative) on p-side and ionized donor atoms (positive) on n-side. Mobile carriers are depleted.",
    difficulty: "medium",
  },
  {
    topic: "Semiconductors & Communication (Diodes, Transistors, Logic gates)",
    question: "A half-wave rectifier converts:",
    options: [
      "AC to pure DC",
      "DC to AC",
      "AC to pulsating DC",
      "DC to pulsating AC"
    ],
    correctAnswer: 2,
    explanation: "A half-wave rectifier allows only one half of the AC cycle to pass, producing pulsating DC (not pure DC). Full-wave rectifiers are more efficient.",
    difficulty: "easy",
  },
  {
    topic: "Semiconductors & Communication (Diodes, Transistors, Logic gates)",
    question: "Which semiconductor has higher energy band gap?",
    options: [
      "Silicon",
      "Germanium",
      "Gallium Arsenide",
      "All are equal"
    ],
    correctAnswer: 2,
    explanation: "Energy band gaps: GaAs (1.43 eV) > Si (1.1 eV) > Ge (0.7 eV). GaAs is used in high-speed and optoelectronic devices.",
    difficulty: "medium",
  },
  {
    topic: "Semiconductors & Communication (Diodes, Transistors, Logic gates)",
    question: "The NAND gate is a universal gate because:",
    options: [
      "It has two inputs",
      "It can realize any Boolean function",
      "It has one output",
      "It consumes less power"
    ],
    correctAnswer: 1,
    explanation: "NAND (and NOR) gates are universal gates because any logic function (AND, OR, NOT) can be constructed using only NAND gates.",
    difficulty: "medium",
  },
  {
    topic: "Semiconductors & Communication (Diodes, Transistors, Logic gates)",
    question: "In a transistor, the base region is made thin to:",
    options: [
      "Reduce power dissipation",
      "Minimize recombination of carriers",
      "Increase current gain",
      "Both B and C"
    ],
    correctAnswer: 3,
    explanation: "Thin base minimizes electron-hole recombination (more carriers reach collector) and increases current gain β.",
    difficulty: "hard",
  },
  {
    topic: "Semiconductors & Communication (Diodes, Transistors, Logic gates)",
    question: "Light Emitting Diode (LED) works on the principle of:",
    options: [
      "Stimulated emission",
      "Spontaneous emission",
      "Photoelectric effect",
      "Thermionic emission"
    ],
    correctAnswer: 1,
    explanation: "LED emits light through spontaneous emission when electrons recombine with holes in a forward-biased p-n junction, releasing energy as photons.",
    difficulty: "medium",
  },
  {
    topic: "Semiconductors & Communication (Diodes, Transistors, Logic gates)",
    question: "The output of a NOR gate is HIGH when:",
    options: [
      "All inputs are HIGH",
      "At least one input is HIGH",
      "All inputs are LOW",
      "At least one input is LOW"
    ],
    correctAnswer: 2,
    explanation: "NOR gate = NOT(OR). Output is HIGH only when ALL inputs are LOW. If any input is HIGH, output is LOW.",
    difficulty: "easy",
  },
  {
    topic: "Semiconductors & Communication (Diodes, Transistors, Logic gates)",
    question: "In reverse bias, the width of depletion region:",
    options: [
      "Decreases",
      "Increases",
      "Remains constant",
      "Becomes zero"
    ],
    correctAnswer: 1,
    explanation: "Reverse bias increases the potential barrier, pulling more mobile carriers away from the junction, widening the depletion region.",
    difficulty: "easy",
  },
  {
    topic: "Semiconductors & Communication (Diodes, Transistors, Logic gates)",
    question: "Modulation is the process of:",
    options: [
      "Converting AC to DC",
      "Amplifying a signal",
      "Superimposing information signal on carrier wave",
      "Filtering noise"
    ],
    correctAnswer: 2,
    explanation: "Modulation superimposes low-frequency information (audio/video) onto high-frequency carrier wave for efficient transmission over long distances.",
    difficulty: "easy",
  },
  {
    topic: "Semiconductors & Communication (Diodes, Transistors, Logic gates)",
    question: "The majority carriers in n-type semiconductor are:",
    options: [
      "Holes",
      "Electrons",
      "Protons",
      "Neutrons"
    ],
    correctAnswer: 1,
    explanation: "In n-type semiconductors, pentavalent impurities (P, As) donate extra electrons, making electrons the majority carriers.",
    difficulty: "easy",
  },
  {
    topic: "Semiconductors & Communication (Diodes, Transistors, Logic gates)",
    question: "An ideal diode has:",
    options: [
      "Infinite forward resistance",
      "Zero reverse resistance",
      "Zero forward resistance and infinite reverse resistance",
      "Infinite forward and reverse resistance"
    ],
    correctAnswer: 2,
    explanation: "Ideal diode: zero resistance in forward bias (perfect conductor) and infinite resistance in reverse bias (perfect insulator).",
    difficulty: "medium",
  },
];

async function seedQuestions() {
  console.log("=".repeat(70));
  console.log("🔬 SEEDING NEET PHYSICS - SEMICONDUCTORS & COMMUNICATION");
  console.log("=".repeat(70));

  const beforeCount = await db.execute({
    sql: "SELECT COUNT(*) as count FROM exam_questions WHERE exam_id = 'neet-ug' AND subject_id = 'neet-physics'",
  });
  console.log(`\n📊 Current NEET Physics questions: ${beforeCount.rows[0].count}`);

  let inserted = 0;
  let skipped = 0;

  for (const q of questions) {
    try {
      const existing = await db.execute({
        sql: `SELECT id FROM exam_questions
              WHERE exam_id = 'neet-ug'
              AND subject_id = 'neet-physics'
              AND question = ?`,
        args: [q.question],
      });

      if (existing.rows.length > 0) {
        skipped++;
        continue;
      }

      await db.execute({
        sql: `INSERT INTO exam_questions
              (exam_id, subject_id, topic, question, options, correct_answer,
               explanation, difficulty, source)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          "neet-ug",
          "neet-physics",
          q.topic,
          q.question,
          JSON.stringify(q.options),
          q.correctAnswer,
          q.explanation,
          q.difficulty,
          "verified",
        ],
      });
      inserted++;
    } catch (err) {
      console.error(`Failed to insert question:`, err);
    }
  }

  const afterCount = await db.execute({
    sql: "SELECT COUNT(*) as count FROM exam_questions WHERE exam_id = 'neet-ug' AND subject_id = 'neet-physics'",
  });

  console.log("\n✅ Seeding Complete!");
  console.log(`   Before:  ${beforeCount.rows[0].count} questions`);
  console.log(`   Inserted: ${inserted} questions`);
  console.log(`   Skipped:  ${skipped} duplicates`);
  console.log(`   After:   ${afterCount.rows[0].count} questions`);

  // Check specifically for Semiconductors
  const semiconductorCount = await db.execute({
    sql: `SELECT COUNT(*) as count FROM exam_questions
          WHERE exam_id = 'neet-ug' AND subject_id = 'neet-physics'
          AND topic = 'Semiconductors & Communication (Diodes, Transistors, Logic gates)'`,
  });

  console.log(`\n🔬 Semiconductors & Communication: ${semiconductorCount.rows[0].count} questions`);
  console.log("\n" + "=".repeat(70));
  console.log("✅ Quiz should now work instantly for this topic!");
  console.log("=".repeat(70));
}

seedQuestions()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  });
