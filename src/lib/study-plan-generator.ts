// Scoreyo - Personalized study-plan generator
// Turns the onboarding learner profile into a structured study plan via OpenRouter.
import { generateText } from "ai";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { getExamById } from "@/lib/exams";

const MODEL = "openai/gpt-4o-mini";
const TIMEOUT_MS = 45000;

export interface StudyPlan {
  summary: string; // one-line coach framing of the plan
  focusSubjects: string[]; // subject names to prioritize (weak first)
  weeklyHours: number;
  phases: { title: string; weeks: string; focus: string }[];
  dailyMissionTemplate: string[]; // e.g. ["1 concept video", "10 practice Qs", "5-min revision"]
  generatedBy: "ai" | "fallback";
}

interface LearnerProfileLike {
  examId: string;
  targetYear?: number | null;
  dailyHours?: number;
  daysPerWeek?: number;
  subjectStrength?: Record<string, "strong" | "average" | "weak">;
  learningStyles?: string[];
  habits?: string[];
}

/**
 * Deterministic fallback so a plan always exists even if the AI call fails or
 * times out. Uses the profile directly — no network.
 */
function buildFallbackPlan(profile: LearnerProfileLike): StudyPlan {
  const exam = getExamById(profile.examId);
  const subjects = exam?.subjects || [];
  const strength = profile.subjectStrength || {};

  const weak = subjects.filter((s) => strength[s.id] === "weak").map((s) => s.name);
  const average = subjects.filter((s) => strength[s.id] === "average").map((s) => s.name);
  const focusSubjects = [...weak, ...average].slice(0, 4);
  if (focusSubjects.length === 0 && subjects.length) focusSubjects.push(subjects[0].name);

  const weeklyHours = (profile.dailyHours || 3) * (profile.daysPerWeek || 5);

  return {
    summary: `A ${weeklyHours}-hour-per-week plan for ${exam?.name || "your exam"}, leading with your weak areas.`,
    focusSubjects,
    weeklyHours,
    phases: [
      { title: "Foundation", weeks: "Weeks 1-4", focus: "Close gaps in weak subjects with concept-first learning." },
      { title: "Build-up", weeks: "Weeks 5-10", focus: "Balance all subjects; increase practice-question volume." },
      { title: "Mastery", weeks: "Ongoing", focus: "Timed mocks, revision cycles, and error-pattern fixes." },
    ],
    dailyMissionTemplate: ["Learn 1 new concept", "Solve 10 practice questions", "5-minute revision of yesterday"],
    generatedBy: "fallback",
  };
}

export async function generateStudyPlan(profile: LearnerProfileLike): Promise<StudyPlan> {
  const fallback = buildFallbackPlan(profile);
  if (!process.env.OPENROUTER_API_KEY) return fallback;

  const exam = getExamById(profile.examId);
  const prompt = `You are an exam-prep coach. Build a concise personalized study plan as JSON only.
Student: preparing for ${exam?.name || profile.examId}${profile.targetYear ? ` (target ${profile.targetYear})` : ""}.
Study capacity: ${profile.dailyHours || 3} hours/day, ${profile.daysPerWeek || 5} days/week.
Subject self-ratings: ${JSON.stringify(profile.subjectStrength || {})}.
Preferred learning styles: ${(profile.learningStyles || []).join(", ") || "any"}.
Struggles: ${(profile.habits || []).join(", ") || "none reported"}.
Return ONLY valid JSON:
{"summary":"one motivating line","focusSubjects":["subject names, weak first"],"phases":[{"title":"","weeks":"","focus":""}],"dailyMissionTemplate":["3-4 short daily actions"]}`;

  try {
    const { text } = await Promise.race([
      generateText({ model: openrouter(MODEL), prompt, maxOutputTokens: 700, temperature: 0.6 }),
      new Promise<{ text: string }>((_, reject) =>
        setTimeout(() => reject(new Error("study-plan generation timed out")), TIMEOUT_MS)
      ),
    ]);

    let clean = text.trim();
    if (clean.startsWith("```")) clean = clean.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    const start = clean.indexOf("{");
    const end = clean.lastIndexOf("}");
    if (start === -1 || end === -1) return fallback;
    const parsed = JSON.parse(clean.substring(start, end + 1));

    return {
      summary: typeof parsed.summary === "string" ? parsed.summary : fallback.summary,
      focusSubjects: Array.isArray(parsed.focusSubjects) && parsed.focusSubjects.length
        ? parsed.focusSubjects.slice(0, 5)
        : fallback.focusSubjects,
      weeklyHours: fallback.weeklyHours,
      phases: Array.isArray(parsed.phases) && parsed.phases.length ? parsed.phases.slice(0, 4) : fallback.phases,
      dailyMissionTemplate: Array.isArray(parsed.dailyMissionTemplate) && parsed.dailyMissionTemplate.length
        ? parsed.dailyMissionTemplate.slice(0, 5)
        : fallback.dailyMissionTemplate,
      generatedBy: "ai",
    };
  } catch (e) {
    console.warn("[StudyPlan] AI generation failed, using fallback:", (e as Error)?.message);
    return fallback;
  }
}
