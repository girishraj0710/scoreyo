#!/usr/bin/env tsx
/**
 * Topic Normalization Utility
 * Extracts smallest common topic units from exam definitions
 *
 * Example:
 * Input: "Mechanics (Kinematics, Laws of Motion, Work Energy Power)"
 * Output: ["Mechanics", "Kinematics", "Laws of Motion", "Work Energy Power"]
 *         with parent-child relationships
 */

export interface NormalizedTopic {
  name: string;
  parent?: string;
  category: string;
  scope: 'universal' | 'state-specific' | 'exam-specific';
  usedInExams: Set<string>;
}

/**
 * Parse topic string and extract parent + children
 *
 * Examples:
 * "Mechanics" → parent: "Mechanics", children: []
 * "Mechanics (Kinematics, Laws of Motion)" → parent: "Mechanics", children: ["Kinematics", "Laws of Motion"]
 * "Optics (Ray Optics - Reflection, Refraction; Wave Optics - Interference)" → parent: "Optics", children: ["Ray Optics", "Wave Optics"]
 */
export function parseTopic(topicStr: string): { parent: string; children: string[] } {
  const match = topicStr.match(/^([^(]+)(?:\((.+)\))?$/);

  if (!match) {
    return { parent: topicStr.trim(), children: [] };
  }

  const parent = match[1].trim();
  const childrenStr = match[2];

  if (!childrenStr) {
    return { parent, children: [] };
  }

  // Split by semicolon first (for subtopics), then by comma
  const children: string[] = [];
  const parts = childrenStr.split(';');

  for (const part of parts) {
    // Extract main topic name before dash (e.g., "Ray Optics - Reflection" → "Ray Optics")
    const subparts = part.split(',');
    for (const subpart of subparts) {
      const cleaned = subpart.split('-')[0].trim();
      if (cleaned && !children.includes(cleaned)) {
        children.push(cleaned);
      }
    }
  }

  return { parent, children };
}

/**
 * Normalize all topics from exam definitions
 */
export function normalizeTopics(examCategories: any[]): Map<string, NormalizedTopic> {
  const normalizedMap = new Map<string, NormalizedTopic>();

  for (const category of examCategories) {
    for (const exam of category.exams) {
      for (const subject of exam.subjects) {
        const subjectCategory = getSubjectCategory(subject.name);

        for (const topicStr of subject.topics) {
          const { parent, children } = parseTopic(topicStr);

          // Add parent topic
          if (!normalizedMap.has(parent)) {
            normalizedMap.set(parent, {
              name: parent,
              category: subjectCategory,
              scope: 'universal', // Will be determined later
              usedInExams: new Set(),
            });
          }
          normalizedMap.get(parent)!.usedInExams.add(exam.id);

          // Add child topics with parent relationship
          for (const child of children) {
            if (!normalizedMap.has(child)) {
              normalizedMap.set(child, {
                name: child,
                parent: parent,
                category: subjectCategory,
                scope: 'universal',
                usedInExams: new Set(),
              });
            }
            normalizedMap.get(child)!.usedInExams.add(exam.id);
          }
        }
      }
    }
  }

  // Determine scope based on usage count
  for (const [name, topic] of normalizedMap) {
    const examCount = topic.usedInExams.size;

    if (examCount >= 5) {
      topic.scope = 'universal';
    } else if (isStateSpecific(name)) {
      topic.scope = 'state-specific';
    } else {
      topic.scope = 'exam-specific';
    }
  }

  return normalizedMap;
}

/**
 * Get category for subject
 */
function getSubjectCategory(subjectName: string): string {
  const lower = subjectName.toLowerCase();

  if (lower.includes('physics')) return 'science';
  if (lower.includes('chemistry')) return 'science';
  if (lower.includes('biology') || lower.includes('botany') || lower.includes('zoology')) return 'science';
  if (lower.includes('math')) return 'mathematics';
  if (lower.includes('quantitative') || lower.includes('arithmetic')) return 'mathematics';
  if (lower.includes('reasoning') || lower.includes('logical')) return 'reasoning';
  if (lower.includes('english') || lower.includes('verbal')) return 'language';
  if (lower.includes('history') || lower.includes('geography') || lower.includes('polity') || lower.includes('economics')) return 'social-science';
  if (lower.includes('current affairs') || lower.includes('gk') || lower.includes('general knowledge')) return 'general-knowledge';

  return 'general-knowledge';
}

/**
 * Check if topic is state-specific
 */
function isStateSpecific(topicName: string): boolean {
  const states = ['Karnataka', 'Kerala', 'Tamil Nadu', 'Andhra Pradesh', 'Telangana',
                  'Maharashtra', 'Gujarat', 'Rajasthan', 'UP', 'MP', 'Bihar',
                  'West Bengal', 'Odisha', 'Assam', 'Punjab', 'Haryana'];

  return states.some(state => topicName.includes(state));
}

/**
 * Get all atomic (leaf) topics for an exam-subject combination
 *
 * Example:
 * If exam has: "Mechanics (Kinematics, Laws of Motion)"
 * Returns: ["Kinematics", "Laws of Motion"] (the children)
 *
 * If exam has: "Thermodynamics"
 * Returns: ["Thermodynamics"] (no children, so return parent)
 */
export function getAtomicTopics(
  topicStr: string,
  normalizedMap: Map<string, NormalizedTopic>
): string[] {
  const { parent, children } = parseTopic(topicStr);

  if (children.length > 0) {
    // Return children (atomic units)
    return children;
  } else {
    // No children, this is already atomic
    return [parent];
  }
}

// For testing
if (require.main === module) {
  console.log("\n=== Topic Normalization Tests ===\n");

  const testCases = [
    "Mechanics",
    "Mechanics (Kinematics, Laws of Motion, Work Energy Power)",
    "Optics (Ray Optics - Reflection, Refraction; Wave Optics - Interference, Diffraction)",
    "Thermodynamics (Laws, Heat Transfer, Kinetic Theory of Gases)",
  ];

  for (const test of testCases) {
    const result = parseTopic(test);
    console.log(`Input: "${test}"`);
    console.log(`Parent: "${result.parent}"`);
    console.log(`Children: [${result.children.map(c => `"${c}"`).join(", ")}]`);
    console.log();
  }
}
