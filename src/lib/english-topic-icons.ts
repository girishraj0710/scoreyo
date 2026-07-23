// Premium 3D topic icons for the /english/* learning experience.
//
// The premium icon set (AllPremiumTopicIcons) is keyed by the topic IDs used in
// the "redesigned" content files. The canonical /english content library
// (english-content.ts) uses more granular IDs and has additional C1/C2 topics.
// This alias map bridges the canonical IDs to the closest existing premium icon
// so every topic renders a rich 3D icon (falling back to Book3DIcon otherwise).

import type React from "react";
import { AllPremiumTopicIcons, getTopicIcon as getPremiumIconByKey } from "@/components/icons/AllPremiumTopicIcons";

// Premium 3D icon components accept a className for sizing; they render their
// own colors internally.
type TopicIconProps = { className?: string };

// Canonical topic id (english-content.ts) → premium icon key (AllPremiumTopicIcons).
// Only ids that are NOT already direct keys need an entry here.
const TOPIC_ICON_ALIASES: Record<string, string> = {
  // ---- Foundation ----
  "alphabet-basics": "alphabet-pronunciation",
  "phonics-vowels": "alphabet-pronunciation",
  "pronunciation-basics": "alphabet-pronunciation",
  "nouns-detailed": "nouns-articles",
  "pronouns-detailed": "pronouns-determiners",
  "articles": "nouns-articles",
  "adjectives": "adjectives-adverbs",
  "adverbs-complete": "adjectives-adverbs",
  "verbs-basics": "basic-verbs-sentences",
  "there-is-are": "basic-verbs-sentences",
  "imperative-mood": "basic-verbs-sentences",
  "present-simple-complete": "present-tenses",
  "present-continuous-complete": "present-tenses",
  "past-simple-complete": "past-tenses",
  "past-continuous-complete": "past-tenses",
  "present-perfect-complete": "present-perfect",
  "present-perfect-continuous": "present-perfect",
  "tense-comparison": "present-tenses",
  "active-passive-conversion": "passive-voice",
  "quantifiers-determiners": "pronouns-determiners",
  "tag-questions": "question-formation",
  "used-to-would": "past-habits",
  "sentence-types": "sentence-types-punctuation",
  "time-sequence": "conjunctions-connectors",
  "synonyms-antonyms": "essential-vocabulary",
  "speaking-basics": "speaking-essentials",
  "writing-basics": "writing-fundamentals",

  // ---- Advanced: B2 ----
  "third-conditional": "third-mixed-conditionals",
  "mixed-conditionals": "third-mixed-conditionals",
  "non-defining-relative-clauses": "relative-clauses",
  "past-modals": "past-modals-nuances",
  "past-perfect-continuous": "past-perfect",
  "future-perfect": "future-tenses",
  "future-perfect-continuous": "future-tenses",
  "narrative-tenses": "past-tenses",
  "collocations-advanced": "collocations-register",
  "formal-informal-register": "collocations-register",
  "proverbs-sayings": "idioms-proverbs",
  "report-writing": "report-business-writing",
  "advanced-punctuation": "sentence-types-punctuation",
  "presentations-advanced": "professional-presentations",
  "debate-discussion": "debates-formal-discussion",

  // ---- Advanced: C1 ----
  "inversion-conditionals": "conditional-inversion",
  "modal-nuances": "past-modals-nuances",
  "cleft-sentences": "sentence-types-punctuation",
  "fronting-emphasis": "sentence-types-punctuation",
  "participle-clauses": "reduced-relative-clauses",
  "advanced-passive-reporting": "advanced-passive-structures",
  "subjunctive-unreal-past": "subjunctive-mood",
  "nominalisation": "word-formation",
  "hedging-cautious-language": "collocations-register",
  "discourse-markers-cohesion": "conjunctions-connectors",
  "ellipsis-substitution": "sentence-types-punctuation",
  "word-formation-affixation": "word-formation",
  "advanced-phrasal-verbs": "phrasal-verbs",
  "advanced-essay-genres": "essay-writing",
  "reading-for-inference": "reading-strategies",
  "register-tone-control": "collocations-register",

  // ---- Advanced: C2 (Expert) ----
  "stylistic-inversion": "conditional-inversion",
  "complex-fronting-thematisation": "sentence-types-punctuation",
  "advanced-ellipsis-substitution": "sentence-types-punctuation",
  "nuanced-modality": "modal-verbs",
  "mixed-hypotheticals": "third-mixed-conditionals",
  "cohesion-referencing-mastery": "conjunctions-connectors",
  "idiomatic-mastery": "idioms-expressions",
  "figurative-language": "idioms-expressions",
  "collocation-precision": "collocations-register",
  "near-synonym-nuance": "essential-vocabulary",
  "advanced-word-formation": "word-formation",
  "rhetorical-devices": "debates-formal-discussion",
  "formality-gradation": "collocations-register",
  "paraphrase-summary-mastery": "writing-fundamentals",
  "pragmatics-implicature": "speaking-essentials",
  "proficiency-writing": "writing-fundamentals",
  "reading-tone-attitude": "reading-strategies",
  "proficiency-speaking": "speaking-essentials",

  // ---- IELTS / TOEFL ----
  "ielts-reading": "ielts-toefl-reading",
  "ielts-writing": "ielts-toefl-writing",
  "ielts-listening": "ielts-toefl-listening",
  "ielts-speaking": "ielts-toefl-speaking",
  "toefl-integrated": "ielts-toefl-reading",

  // ---- Real-world ----
  "job-interviews": "workplace-communication",
  "daily-conversations": "social-travel-english",
  "email-writing": "report-business-writing",
  "presentations": "professional-presentations",
  "business-english": "workplace-communication",
};

/**
 * Resolve a premium 3D icon for any canonical English topic id.
 * Order: direct premium key → alias → Book3DIcon fallback.
 */
export function getPremiumTopicIcon(topicId: string): React.FC<TopicIconProps> {
  if (AllPremiumTopicIcons[topicId]) return AllPremiumTopicIcons[topicId];
  const alias = TOPIC_ICON_ALIASES[topicId];
  return getPremiumIconByKey(alias ?? topicId); // getPremiumIconByKey falls back to Book3DIcon
}
