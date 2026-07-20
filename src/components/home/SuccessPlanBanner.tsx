"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarClock, Target, TrendingUp } from "lucide-react";
import { getExamById } from "@/lib/exams";

interface OnboardingData {
  examId: string | null;
  profile: {
    targetYear?: number | null;
    subjectStrength?: Record<string, "strong" | "average" | "weak">;
    evolving?: {
      readiness?: number; // measured 0..100 from real quiz behavior
      topicsTracked?: number;
    } | null;
  } | null;
}

interface PlanData {
  summary?: string;
  focusSubjects?: string[];
}

// Baseline readiness from the student's own subject self-ratings. This is the
// starting point — it evolves from real quiz behavior over time.
function baselineReadiness(strength?: Record<string, "strong" | "average" | "weak">): number | null {
  if (!strength) return null;
  const vals = Object.values(strength);
  if (!vals.length) return null;
  const score = vals.reduce((sum, v) => sum + (v === "strong" ? 100 : v === "average" ? 60 : 30), 0);
  return Math.round(score / vals.length);
}

// Approximate days until the exam. Exact exam dates vary, so we anchor to a
// representative date (Apr 1) of the target year for a stable countdown.
function daysRemaining(targetYear?: number | null): number | null {
  if (!targetYear) return null;
  const target = new Date(targetYear, 3, 1); // April 1 of target year
  const now = new Date();
  const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : null;
}

export function SuccessPlanBanner() {
  const [data, setData] = useState<OnboardingData | null>(null);
  const [plan, setPlan] = useState<PlanData | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [oRes, pRes] = await Promise.all([
          fetch("/api/onboarding"),
          fetch("/api/study-plan/generate"),
        ]);
        if (cancelled) return;
        if (oRes.ok) {
          const o = await oRes.json();
          setData({ examId: o.examId, profile: o.profile });
        }
        if (pRes.ok) {
          const p = await pRes.json();
          setPlan(p.plan || null);
        }
      } catch {
        /* banner is best-effort; silently skip if unavailable */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!data?.examId) return null;

  const exam = getExamById(data.examId);
  const targetYear = data.profile?.targetYear ?? null;
  const days = daysRemaining(targetYear);

  // Prefer readiness MEASURED from real quiz behavior once any topic is tracked;
  // fall back to the onboarding self-rating baseline until then.
  const evolving = data.profile?.evolving;
  const measured = evolving && (evolving.topicsTracked ?? 0) > 0 ? evolving.readiness ?? null : null;
  const readiness = measured ?? baselineReadiness(data.profile?.subjectStrength);
  const readinessLabel = measured != null ? "Readiness" : "Starting readiness";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl bg-[#16213E] text-white p-6 md:p-7 shadow-soft relative overflow-hidden mb-6"
    >
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: "#A182F955" }} />
      <div className="relative">
        <div className="flex items-center gap-2 text-xs uppercase text-white/60 font-bold" style={{ letterSpacing: "0.2em" }}>
          <Target className="w-3.5 h-3.5" /> Your success plan
        </div>
        <h2 className="font-heading text-2xl md:text-3xl font-black mt-2">
          {exam?.name || data.examId}
          {targetYear ? <span className="text-[#A182F9]"> {targetYear}</span> : null}
        </h2>
        {plan?.summary && <p className="text-sm text-white/70 mt-2 max-w-2xl">{plan.summary}</p>}

        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {days !== null && (
            <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase text-white/50 font-bold" style={{ letterSpacing: "0.15em" }}>
                <CalendarClock className="w-3.5 h-3.5" /> Days left
              </div>
              <div className="font-mono font-bold text-xl mt-1">{days}</div>
            </div>
          )}
          {readiness !== null && (
            <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase text-white/50 font-bold" style={{ letterSpacing: "0.15em" }}>
                <TrendingUp className="w-3.5 h-3.5" /> {readinessLabel}
              </div>
              <div className="font-mono font-bold text-xl mt-1">{readiness}%</div>
            </div>
          )}
          {plan?.focusSubjects && plan.focusSubjects.length > 0 && (
            <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3 col-span-2 sm:col-span-1">
              <div className="text-[10px] uppercase text-white/50 font-bold" style={{ letterSpacing: "0.15em" }}>
                Focus first
              </div>
              <div className="text-sm font-semibold mt-1 truncate">{plan.focusSubjects.slice(0, 2).join(", ")}</div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
