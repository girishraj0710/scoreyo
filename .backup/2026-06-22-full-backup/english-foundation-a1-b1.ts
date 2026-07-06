// Foundation English - A1 to B1 Only (Pure Foundation)
// Removed B2 topics - they're now in Advanced English path

import { foundationPathComplete } from './english-foundation-complete-43';
import type { EnglishPath, EnglishTopic } from './english-foundation-complete-43';

// Create a clean A1-B1 foundation path by filtering out B2 content
export const foundationPathA1B1: EnglishPath = {
  ...foundationPathComplete,
  name: "Foundation Builder (A1-B1)",
  description: "Complete English from A1 to B1 - Cambridge-aligned beginner to intermediate curriculum",
  totalQuestions: 2150,
  estimatedWeeks: 28,
  modules: foundationPathComplete.modules.map(module => ({
    ...module,
    topics: module.topics.filter(topic =>
      // Keep only A1, A2, and B1 topics (exclude B2)
      topic.cefrLevel === "A1" || topic.cefrLevel === "A2" || topic.cefrLevel === "B1"
    )
  }))
};

// Helper to get all A1-B1 topics (no B2)
export const getAllFoundationA1B1Topics = (): EnglishTopic[] => {
  return foundationPathA1B1.modules.flatMap(module => module.topics);
};

// Note: B2 topics (third-conditional, mixed-conditionals, non-defining-relative-clauses, etc.)
// are now in the Advanced English path (english-advanced-path.ts)
