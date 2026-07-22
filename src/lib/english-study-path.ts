/**
 * english-study-path.ts — Deterministic personalized study-path generator.
 *
 * Given a learner's CEFR placement (`level`) and their per-skill assessment
 * scores, this produces an ordered, phased roadmap that carries the student
 * from where they are today all the way to Expert (CEFR C2, the Cambridge
 * "Proficiency" ceiling — the highest badge any top English app awards).
 *
 * Design principles:
 *  - REAL library only. Every topic in the path is a real topic id from the
 *    foundation/advanced content files, so every step is clickable and studied.
 *  - CEFR-ordered phases (natural pedagogical progression: A1→A2→B1→B2→C1→C2).
 *    Topics keep their in-library order within a phase, which preserves
 *    prerequisites — we never surface advanced grammar before its basics.
 *  - Weak-skills-first *focus*: the learner's weakest assessed skills are
 *    surfaced as each phase's `focusSkills`, and matching topics are flagged
 *    `isFocus` so the UI can highlight "spend extra time here" — without
 *    reordering past a prerequisite.
 *
 * This is the deterministic half of the hybrid model. A short AI-written
 * coaching rationale per phase can be layered on top and cached separately.
 */

import { getAllFoundationTopics } from "./english-foundation-complete-43";
import { advancedEnglishPath } from "./english-advanced-path";

export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type SkillKey = "grammar" | "vocabulary" | "reading" | "usage";

export const CEFR_ORDER: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

/** The target every learner is driving toward: Cambridge C2 "Proficiency". */
export const TARGET_LEVEL: CEFRLevel = "C2";

export interface StudyPathTopic {
  id: string;
  name: string;
  pathId: "foundation" | "advanced";
  cefrLevel: CEFRLevel;
  skill: SkillKey;
  estMinutes: number;
  /** True when this topic trains one of the phase's focus (weakest) skills. */
  isFocus: boolean;
}

export interface StudyPhase {
  cefrLevel: CEFRLevel;
  name: string;
  description: string;
  /** The learner's weakest skills that this phase can strengthen. */
  focusSkills: SkillKey[];
  topics: StudyPathTopic[];
  estWeeks: number;
  /** Set when the level has no authored content yet (e.g. C2 pre gap-fill). */
  comingSoon?: boolean;
}

export interface StudyPath {
  currentLevel: CEFRLevel;
  targetLevel: CEFRLevel;
  /** Ordered, human phrase e.g. "B1 → Expert". */
  journey: string;
  phases: StudyPhase[];
  totalTopics: number;
  estTotalWeeks: number;
}

const LEVEL_META: Record<CEFRLevel, { name: string; description: string }> = {
  A1: { name: "Beginner", description: "The essentials: alphabet, core grammar, and everyday sentences." },
  A2: { name: "Elementary", description: "Everyday conversations, key tenses, and useful vocabulary." },
  B1: { name: "Intermediate", description: "Express ideas clearly and handle most everyday situations." },
  B2: { name: "Upper-Intermediate", description: "Complex texts, fluent interaction, and detailed writing." },
  C1: { name: "Advanced", description: "Nuance, formality, and near-native command of the language." },
  C2: { name: "Expert", description: "Full mastery — precise, subtle, and effortless English." },
};

/**
 * Classify a topic into one of the four assessed skills. Keyword-based on the
 * topic id and name so it stays in sync with the library without a hand table.
 * Grammar is the default (most of the library is grammar).
 */
function classifySkill(id: string, name: string): SkillKey {
  const h = `${id} ${name}`.toLowerCase();

  // Vocabulary: word knowledge — synonyms, idioms, collocations, word lists.
  if (/vocab|synonym|antonym|idiom|collocation|phrasal|proverb|saying|word/.test(h)) {
    return "vocabulary";
  }
  // Reading: comprehension-oriented topics.
  if (/reading|comprehension|passage|skimming|scanning/.test(h)) {
    return "reading";
  }
  // Usage: production & register — writing, speaking, punctuation, mistakes.
  if (
    /writing|essay|report|speaking|conversation|debate|discussion|presentation|register|formal|informal|punctuation|pronunciation|phonics|alphabet|mistake|connector|conjunction|sequence/.test(
      h
    )
  ) {
    return "usage";
  }
  // Everything else (tenses, modals, clauses, articles, voice…) is grammar.
  return "grammar";
}

interface LibraryTopic {
  id: string;
  name: string;
  pathId: "foundation" | "advanced";
  cefrLevel: CEFRLevel;
  estMinutes: number;
  skill: SkillKey;
}

/** Flatten the real library into a single CEFR-tagged list (module order preserved). */
function loadLibrary(): LibraryTopic[] {
  const foundation: LibraryTopic[] = getAllFoundationTopics().map((t) => ({
    id: t.id,
    name: t.name,
    pathId: "foundation" as const,
    cefrLevel: t.cefrLevel as CEFRLevel,
    estMinutes: t.estimatedTime,
    skill: classifySkill(t.id, t.name),
  }));

  const advanced: LibraryTopic[] = advancedEnglishPath.modules
    .flatMap((m) => m.topics)
    .map((t) => ({
      id: t.id,
      name: t.name,
      pathId: "advanced" as const,
      cefrLevel: t.cefrLevel as CEFRLevel,
      estMinutes: t.estimatedTime,
      skill: classifySkill(t.id, t.name),
    }));

  return [...foundation, ...advanced];
}

/** Weakest skills first (lowest score). Skills missing from the map score 100 (ignored). */
function rankWeakestSkills(skillScores: Partial<Record<SkillKey, number>>): SkillKey[] {
  const skills: SkillKey[] = ["grammar", "vocabulary", "reading", "usage"];
  return skills
    .map((s) => ({ s, score: skillScores[s] ?? 100 }))
    .sort((a, b) => a.score - b.score)
    .map((x) => x.s);
}

/**
 * Build the personalized study path.
 *
 * @param level        CEFR placement from the assessment (A1–C1). Unknown/absent → A1.
 * @param skillScores  Per-skill scores 0–100 from the assessment (may be partial).
 */
export function generateStudyPath(
  level: string | undefined,
  skillScores: Partial<Record<SkillKey, number>> = {}
): StudyPath {
  const currentLevel: CEFRLevel = CEFR_ORDER.includes(level as CEFRLevel)
    ? (level as CEFRLevel)
    : "A1";
  const currentIdx = CEFR_ORDER.indexOf(currentLevel);
  const targetIdx = CEFR_ORDER.indexOf(TARGET_LEVEL);

  const library = loadLibrary();
  const weakest = rankWeakestSkills(skillScores);
  // A phase's focus = the two weakest skills it actually contains topics for.
  const globalFocus = new Set<SkillKey>(weakest.slice(0, 2));

  const phases: StudyPhase[] = [];

  for (let i = currentIdx; i <= targetIdx; i++) {
    const lvl = CEFR_ORDER[i];
    const meta = LEVEL_META[lvl];
    const levelTopics = library.filter((t) => t.cefrLevel === lvl);

    const focusSkills = weakest.filter((s) => levelTopics.some((t) => t.skill === s)).slice(0, 2);

    const topics: StudyPathTopic[] = levelTopics.map((t) => ({
      id: t.id,
      name: t.name,
      pathId: t.pathId,
      cefrLevel: t.cefrLevel,
      skill: t.skill,
      estMinutes: t.estMinutes,
      isFocus: globalFocus.has(t.skill),
    }));

    const totalMinutes = topics.reduce((sum, t) => sum + (t.estMinutes || 0), 0);
    // ~100 focused minutes/week of study → weeks. Min 1 week for any non-empty phase.
    const estWeeks = topics.length === 0 ? 0 : Math.max(1, Math.round(totalMinutes / 100));

    phases.push({
      cefrLevel: lvl,
      name: meta.name,
      description: meta.description,
      focusSkills,
      topics,
      estWeeks,
      comingSoon: topics.length === 0,
    });
  }

  const totalTopics = phases.reduce((sum, p) => sum + p.topics.length, 0);
  const estTotalWeeks = phases.reduce((sum, p) => sum + p.estWeeks, 0);

  return {
    currentLevel,
    targetLevel: TARGET_LEVEL,
    journey: `${currentLevel} → Expert`,
    phases,
    totalTopics,
    estTotalWeeks,
  };
}
