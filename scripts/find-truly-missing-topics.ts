#!/usr/bin/env tsx
/**
 * Find Truly Missing Topics
 *
 * This script identifies topics that are ACTUALLY missing from exams.ts,
 * not just named differently. It uses fuzzy matching to avoid false positives.
 */

import { examCategories } from "../src/lib/exams";

// Official syllabi from validate-exam-topics.ts
const officialSyllabi: Record<string, any> = {
  "jee-main": {
    subjects: {
      "jee-physics": {
        officialTopics: [
          "Units & Measurements", "Kinematics", "Laws of Motion",
          "Work Energy Power", "Rotational Motion", "Gravitation",
          "Properties of Solids & Liquids", "Fluid Mechanics",
          "Thermodynamics", "Kinetic Theory of Gases",
          "Oscillations", "Waves", "Ray Optics", "Wave Optics",
          "Electrostatics", "Current Electricity",
          "Magnetic Effects of Current", "Magnetism & Matter",
          "Electromagnetic Induction", "Alternating Current",
          "Electromagnetic Waves", "Dual Nature of Radiation",
          "Atoms & Nuclei", "Electronic Devices", "Communication Systems"
        ]
      },
      "jee-chemistry": {
        officialTopics: [
          "Basic Concepts of Chemistry", "Atomic Structure", "Chemical Bonding",
          "States of Matter", "Thermodynamics", "Chemical Equilibrium",
          "Ionic Equilibrium", "Redox Reactions", "Electrochemistry",
          "Chemical Kinetics", "Surface Chemistry", "Solutions", "Solid State",
          "Periodic Table", "Hydrogen", "s-Block Elements",
          "p-Block Elements", "d-Block & f-Block Elements", "Coordination Compounds",
          "Environmental Chemistry", "Metallurgy",
          "Organic Chemistry Basics", "Hydrocarbons", "Haloalkanes & Haloarenes",
          "Alcohols Phenols Ethers", "Aldehydes Ketones", "Carboxylic Acids",
          "Amines", "Biomolecules", "Polymers"
        ]
      }
    }
  }
};

function fuzzyMatch(topic1: string, topic2: string): boolean {
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const n1 = normalize(topic1);
  const n2 = normalize(topic2);

  // Exact match
  if (n1 === n2) return true;

  // One contains the other
  if (n1.includes(n2) || n2.includes(n1)) return true;

  // Common abbreviations
  if ((n1.includes('3d') && n2.includes('threedimensional')) ||
      (n2.includes('3d') && n1.includes('threedimensional'))) return true;

  if ((n1.includes('2d') && n2.includes('twodimensional')) ||
      (n2.includes('2d') && n1.includes('twodimensional'))) return true;

  return false;
}

function findTrulyMissing() {
  console.log("\n🔍 Finding Truly Missing Topics (Not Just Name Differences)...\n");
  console.log("=".repeat(80));

  // Get current topics from exams.ts
  const currentTopics = new Map<string, Set<string>>();

  for (const category of examCategories) {
    for (const exam of category.exams) {
      for (const subject of exam.subjects) {
        const key = `${exam.id}/${subject.id}`;
        if (!currentTopics.has(key)) {
          currentTopics.set(key, new Set());
        }
        subject.topics.forEach(t => currentTopics.get(key)!.add(t));
      }
    }
  }

  console.log("\n📊 Analysis:\n");

  // Check JEE Main Chemistry example
  const jeeChemKey = "jee-main/jee-chemistry";
  const currentJeeChem = currentTopics.get(jeeChemKey);
  const officialJeeChem = officialSyllabi["jee-main"]?.subjects["jee-chemistry"]?.officialTopics || [];

  console.log("Example: JEE Main Chemistry");
  console.log(`  Current topics: ${currentJeeChem?.size || 0}`);
  console.log(`  Official topics: ${officialJeeChem.length}`);
  console.log();

  const trulyMissing: string[] = [];
  const nameDifferences: Array<{official: string, current: string}> = [];

  for (const official of officialJeeChem) {
    let found = false;
    let match = "";

    for (const current of currentJeeChem || []) {
      if (fuzzyMatch(official, current)) {
        found = true;
        match = current;
        break;
      }
    }

    if (!found) {
      trulyMissing.push(official);
    } else if (match !== official) {
      nameDifferences.push({ official, current: match });
    }
  }

  console.log(`✅ Truly Missing: ${trulyMissing.length}`);
  if (trulyMissing.length > 0) {
    trulyMissing.forEach(t => console.log(`  - ${t}`));
  }

  console.log(`\n⚠️  Name Differences: ${nameDifferences.length}`);
  if (nameDifferences.length > 0) {
    nameDifferences.slice(0, 5).forEach(d => {
      console.log(`  - Official: "${d.official}"`);
      console.log(`    Current: "${d.current}"`);
    });
    if (nameDifferences.length > 5) {
      console.log(`  ... and ${nameDifferences.length - 5} more`);
    }
  }

  console.log("\n" + "=".repeat(80));
  console.log("\n💡 Conclusion:\n");

  if (trulyMissing.length === 0) {
    console.log("✅ No topics are truly missing! All official topics exist in some form.");
    console.log("   The differences are just naming conventions.");
    console.log();
    console.log("📝 Recommendation:");
    console.log("   Keep current topic names - they are more descriptive and work well");
    console.log("   for the dimensional model. No action needed.");
  } else {
    console.log(`❌ Found ${trulyMissing.length} truly missing topics that should be added.`);
  }

  console.log();
}

findTrulyMissing();
