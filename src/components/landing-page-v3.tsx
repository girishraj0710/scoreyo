"use client";

import { useState, useRef } from "react";
import { useUser } from "@/context/user-context";
import { examCategories } from "@/lib/exams";
import Image from "next/image";
import {
  Sparkles,
  Zap,
  Trophy,
  Target,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Landmark,
  Atom,
  Stethoscope,
  BarChart3,
  Briefcase,
  Scale,
  Calendar as CalendarIcon,
  PlayCircle,
} from "lucide-react";
import { getUpcomingExams } from "@/lib/exam-calendar";

// Icon mapping for exam categories
const EXAM_ICONS = {
  "Civil Services": Landmark,
  "Engineering": Atom,
  "Medical": Stethoscope,
  "Management": BarChart3,
  "Government Jobs": Briefcase,
  "Law": Scale,
  "Banking": BarChart3,
  "Teaching": GraduationCap,
  "Defense": Target,
};

// Features for carousel (keep existing data)
const FEATURES = [
  {
    id: 1,
    image: "/images/ai-tutor-3d.svg",
    title: "AI Tutor, on-demand",
    desc: "Get any concept explained, doubts solved, and worked examples — instantly.",
    tint: "#F26A4B",
    icon: Sparkles,
  },
  {
    id: 2,
    image: "/images/flashcards-3d.svg",
    title: "Smart Flashcards",
    desc: "Auto-generated cards + spaced repetition tuned to how you forget.",
    tint: "#2E8B57",
    icon: Zap,
  },
  {
    id: 3,
    image: "/images/mock-test-3d.svg",
    title: "Full-length Mock Tests",
    desc: "Real exam interface, timed sections, detailed analytics.",
    tint: "#16213E",
    icon: Trophy,
  },
  {
    id: 4,
    image: "/images/level-mode-3d.svg",
    title: "Level Mode",
    desc: "Progress through levels from beginner to expert. Unlock harder topics as you master basics.",
    tint: "#C89B3C",
    icon: Target,
  },
];

// Testimonials
const TESTIMONIALS = [
  { name: "Priya S.", exam: "JEE Main 2026", review: "Finally understand WHY I got questions wrong, not just WHAT the answer is. Game changer for JEE prep!" },
  { name: "Rahul M.", exam: "NEET UG 2026", review: "The mistake tracker helped me realize I was making the same careless errors. Fixed it in 2 weeks!" },
  { name: "Anjali K.", exam: "UPSC CSE 2026", review: "Best ₹79 I've spent on exam prep. Better than coaching classes charging ₹50,000!" },
];

export function LandingPageV3() {
  const { setShowLoginModal } = useUser();
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const upcomingExams = getUpcomingExams();

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Top Navigation Bar - Keep as is from existing */}
      <nav className="border-b border-black/5 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#F26A4B] rounded-lg flex items-center justify-center text-white font-bold text-base">
              K
            </div>
            <span className="text-lg font-bold text-[#16213E]">Krakkify</span>
          </a>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#exams" className="text-sm font-medium text-[#5A6478] hover:text-[#16213E]">
              Exams
            </a>
            <a href="#features" className="text-sm font-medium text-[#5A6478] hover:text-[#16213E]">
              Features
            </a>
            <a href="#pricing" className="text-sm font-medium text-[#5A6478] hover:text-[#16213E]">
              Pricing
            </a>
          </div>

          {/* Sign In */}
          <button
            onClick={() => setShowLoginModal(true)}
            className="h-10 px-5 rounded-xl bg-[#F26A4B] hover:bg-[#E15838] text-white font-semibold text-sm"
          >
            Sign in
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* 1. HERO SECTION */}
        <section className="pt-16 md:pt-24 pb-16 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-black/5 shadow-[0_8px_30px_rgba(22,33,62,0.06)] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E8B57] animate-pulse" />
              <span className="text-xs font-semibold tracking-wider uppercase text-[#5A6478]">
                1.2M+ questions · 74 exams · AI tutor
              </span>
            </div>

            {/* Hero H1 with gold squiggle */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-[#16213E]">
              Master India's toughest{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-[#F26A4B]">competitive exams</span>
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  viewBox="0 0 300 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 8 Q75 2, 150 6 T298 6"
                    stroke="#C89B3C"
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </span>
              .
            </h1>

            {/* Body text */}
            <p className="mt-6 text-lg text-[#5A6478] max-w-xl leading-relaxed">
              74+ exams, 200+ subjects, 1870+ topics. JEE, NEET, UPSC, CAT, SSC, Banking
              — with an AI tutor that actually understands the Indian syllabus.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => setShowLoginModal(true)}
                className="h-12 px-6 rounded-xl bg-[#F26A4B] hover:bg-[#E15838] text-white font-semibold shadow-[0_20px_60px_-20px_rgba(242,106,75,0.35)] flex items-center gap-2 transition-all"
              >
                Start learning free <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowLoginModal(true)}
                className="h-12 px-6 rounded-xl border border-black/10 hover:border-[#5A6478]/40 bg-white font-semibold text-[#16213E] flex items-center gap-2 transition-all"
              >
                <PlayCircle className="w-4 h-4" /> Take a mock test
              </button>
            </div>

            {/* Stats */}
            <div className="mt-10 flex items-center gap-6 text-sm">
              <div>
                <div className="font-mono text-2xl font-bold text-[#16213E]">92%</div>
                <div className="text-xs text-[#5A6478]">rank improvement</div>
              </div>
              <div className="w-px h-10 bg-black/10" />
              <div>
                <div className="font-mono text-2xl font-bold text-[#16213E]">
                  4.9<span className="text-[#5A6478]">/5</span>
                </div>
                <div className="text-xs text-[#5A6478]">aspirant rating</div>
              </div>
              <div className="w-px h-10 bg-black/10" />
              <div>
                <div className="font-mono text-2xl font-bold text-[#16213E]">18min</div>
                <div className="text-xs text-[#5A6478]">avg. daily</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden bg-white border border-black/5 shadow-[0_8px_30px_rgba(22,33,62,0.06)] aspect-[4/5]">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=85"
                alt="Indian students preparing for competitive exams"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#16213E]/70 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <div className="text-xs font-semibold uppercase tracking-widest opacity-80">
                  ALL EXAMS. ONE PLATFORM.
                </div>
                <div className="font-heading text-2xl font-bold mt-1">
                  Study smarter, together.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. MARQUEE TICKER */}
        <div className="relative overflow-hidden rounded-3xl bg-[#16213E] text-white py-4 mb-16">
          <div className="flex whitespace-nowrap animate-marquee font-heading text-lg font-semibold">
            {[...Array(2)].map((_, k) => (
              <div key={k} className="flex items-center">
                {["JEE · 256K aspirants", "NEET · 410K aspirants", "CAT · 97K aspirants", "UPSC · 184K aspirants", "SSC · 410K aspirants", "GATE · 61K aspirants", "CLAT · 38K aspirants"].map((t, i) => (
                  <span key={i} className="mx-8 flex items-center gap-8">
                    {t}
                    <span className="text-[#F26A4B]">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* 3. FEATURES CAROUSEL */}
        <section id="features" className="py-8">
          <div className="text-xs font-bold tracking-[0.2em] uppercase text-[#F26A4B] mb-2">
            STUDY MODES
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-black text-[#16213E] mb-8">
            Learn your way
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  className="rounded-3xl bg-white border border-black/5 p-6 shadow-[0_8px_30px_rgba(22,33,62,0.06)] hover:-translate-y-1 transition-transform"
                >
                  <div
                    className="w-12 h-12 rounded-2xl grid place-items-center"
                    style={{ backgroundColor: `${feature.tint}20`, color: feature.tint }}
                  >
                    <Icon className="w-6 h-6" strokeWidth={2.5} />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-[#16213E] mt-5">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[#5A6478] mt-2 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. EXAM CATEGORIES GRID - Emergent Structure */}
        <section id="exams" className="py-16" data-testid="exam-categories-section">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-xs font-bold tracking-[0.2em] uppercase text-[#F26A4B]">
                PICK YOUR BATTLE
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-black text-[#16213E] mt-2">
                All major exams. One place.
              </h2>
            </div>
            <button
              onClick={() => setShowLoginModal(true)}
              className="hidden md:inline-flex text-sm font-semibold text-[#16213E] hover:text-[#F26A4B] gap-1 items-center transition-colors"
            >
              Explore all <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {examCategories.slice(0, 8).flatMap((category) =>
              category.exams.slice(0, 1).map((exam, idx) => {
                const IconComponent = EXAM_ICONS[category.name as keyof typeof EXAM_ICONS] || BookOpen;
                const featured = idx === 0;
                const accent = category.name === "Civil Services" ? "#E76F51" :
                              category.name === "Engineering" ? "#2A9D8F" :
                              category.name === "Medical" ? "#E63946" :
                              category.name === "Management" ? "#F77F00" :
                              category.name === "Government Jobs" ? "#06A77D" :
                              category.name === "Law" ? "#9D4EDD" :
                              "#F26A4B";

                return (
                  <button
                    key={exam.id}
                    onClick={() => setShowLoginModal(true)}
                    data-testid={`exam-card-${exam.id}`}
                    className={`text-left group relative rounded-3xl border border-black/5 bg-white p-6 shadow-[0_8px_30px_rgba(22,33,62,0.06)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_rgba(242,106,75,0.35)] overflow-hidden ${
                      featured ? "lg:col-span-2 xl:col-span-2" : ""
                    }`}
                  >
                    <div
                      className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-10 transition-opacity group-hover:opacity-20"
                      style={{ backgroundColor: accent }}
                    />
                    <div className="relative flex items-start justify-between">
                      <div
                        className="w-12 h-12 rounded-2xl grid place-items-center"
                        style={{ backgroundColor: `${accent}20`, color: accent }}
                      >
                        <IconComponent className="w-6 h-6" strokeWidth={2.5} />
                      </div>
                      <div className="text-xs text-[#5A6478] font-mono">
                        {Math.floor(Math.random() * 500) + 50}K
                      </div>
                    </div>
                    <div className="relative mt-6">
                      <div className="text-xs font-bold uppercase tracking-widest text-[#5A6478]">
                        {category.name}
                      </div>
                      <div className="font-heading text-2xl sm:text-3xl font-black text-[#16213E] mt-1">
                        {exam.name}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {exam.subjects.slice(0, featured ? 4 : 3).map((s) => (
                          <span
                            key={s.name}
                            className="text-xs px-2 py-1 rounded-full bg-black/[0.04] text-[#5A6478] font-medium"
                          >
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="relative mt-5 flex items-center gap-1 text-sm font-semibold text-[#16213E] group-hover:text-[#F26A4B] transition-colors">
                      Enter <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </section>

        {/* 5. WHAT MAKES DIFFERENT */}
        <section className="py-16">
          <div className="text-xs font-bold tracking-[0.2em] uppercase text-[#F26A4B] mb-2">
            WHY KRAKKIFY
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-black text-[#16213E] mb-12">
            What makes us different
          </h2>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {[
                "AI tutor trained on Indian syllabus",
                "Spaced repetition that actually works",
                "Mock tests with detailed analytics",
                "1.2M+ verified questions",
                "74+ exams, 200+ subjects",
                "Progress tracking & weakness analysis",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#2E8B57]/20 text-[#2E8B57] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-lg text-[#16213E] font-medium">{item}</span>
                </div>
              ))}
            </div>
            <div className="relative h-[400px] rounded-3xl overflow-hidden bg-gradient-to-br from-[#F26A4B]/10 to-[#2E8B57]/10">
              {/* Placeholder for gradient illustration */}
              <div className="absolute inset-0 flex items-center justify-center text-[#5A6478]">
                <BookOpen className="w-32 h-32 opacity-20" />
              </div>
            </div>
          </div>
        </section>

        {/* 6. DARK CTA PANEL - MOVED HERE */}
        <section className="py-16">
          <div className="relative rounded-3xl bg-[#16213E] text-white p-8 md:p-14 overflow-hidden">
            <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-[#F26A4B]/30 blur-3xl" />
            <div className="absolute -left-20 -bottom-20 w-72 h-72 rounded-full bg-[#2E8B57]/20 blur-3xl" />
            <div className="relative max-w-2xl">
              <h2 className="font-heading text-3xl sm:text-4xl font-black">
                Your rank is waiting. Let's earn it.
              </h2>
              <p className="text-white/70 mt-3 text-lg">
                Join thousands of aspirants who study smarter — not longer.
              </p>
              <button
                onClick={() => setShowLoginModal(true)}
                className="mt-6 h-12 px-6 rounded-xl bg-[#F26A4B] hover:bg-[#E15838] text-white font-semibold flex items-center gap-2 transition-all"
              >
                Open my dashboard <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* 7. UPCOMING EXAM CALENDAR */}
        <section className="py-16">
          <div className="text-xs font-bold tracking-[0.2em] uppercase text-[#F26A4B] mb-2">
            UPCOMING EXAMS
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-black text-[#16213E] mb-8">
            Your exam calendar
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {upcomingExams.slice(0, 6).map((exam) => (
              <div
                key={exam.id}
                className="rounded-3xl bg-white border border-black/5 p-6 shadow-[0_8px_30px_rgba(22,33,62,0.06)] hover:-translate-y-1 transition-transform"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-[#5A6478]">
                      {exam.phase}
                    </div>
                    <div className="font-heading text-xl font-black text-[#16213E] mt-1">
                      {exam.name}
                    </div>
                  </div>
                  <CalendarIcon className="w-5 h-5 text-[#F26A4B]" />
                </div>
                <div className="mt-4 text-sm text-[#5A6478]">
                  {new Date(exam.date).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
                <button className="mt-4 text-sm font-semibold text-[#F26A4B] hover:text-[#E15838] transition-colors">
                  + Remind me
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 8. TESTIMONIALS */}
        <section className="py-16">
          <div className="text-xs font-bold tracking-[0.2em] uppercase text-[#F26A4B] mb-2">
            STUDENT STORIES
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-black text-[#16213E] mb-8">
            What students are saying
          </h2>

          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((testimonial, i) => (
              <div
                key={i}
                className="rounded-3xl bg-white border border-black/5 p-6 shadow-[0_8px_30px_rgba(22,33,62,0.06)]"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-[#C89B3C]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-[#16213E] leading-relaxed mb-4">
                  "{testimonial.review}"
                </p>
                <div className="text-sm">
                  <div className="font-semibold text-[#16213E]">{testimonial.name}</div>
                  <div className="text-[#5A6478]">{testimonial.exam}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-black/5">
          <div className="text-center text-sm text-[#5A6478]">
            <p>© 2026 Krakkify — built for Indian aspirants.</p>
            <div className="flex items-center justify-center gap-6 mt-4">
              <a href="/privacy" className="hover:text-[#16213E] transition-colors">
                Privacy
              </a>
              <a href="/terms" className="hover:text-[#16213E] transition-colors">
                Terms
              </a>
              <a href="/contact" className="hover:text-[#16213E] transition-colors">
                Contact
              </a>
            </div>
          </div>
        </footer>
      </div>

      {/* Marquee animation */}
      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </div>
  );
}
