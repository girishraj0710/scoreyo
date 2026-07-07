"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "@/context/user-context";
import Image from "next/image";
import {
  Sparkles,
  Zap,
  Trophy,
  ArrowRight,
  BookOpen,
  Landmark,
  Atom,
  Stethoscope,
  BarChart3,
  Briefcase,
  Scale,
  Cpu,
  Calendar as CalendarIcon,
  PlayCircle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { getUpcomingExams } from "@/lib/exam-calendar";
import { ColorfulExamIcon } from "@/lib/colorful-exam-icons";

// Version: 2026-07-07 - Fixed imports (removed Target, GraduationCap)

// Emergent exam data - exact match
const EXAMS = [
  {
    id: 'upsc',
    name: 'UPSC',
    tagline: 'Civil Services',
    accent: '#E76F51',
    icon: 'Landmark',
    learners: '184K',
    subjects: [
      { id: 'polity', name: 'Indian Polity' },
      { id: 'history', name: 'Modern History' },
      { id: 'geo', name: 'Geography' },
      { id: 'econ', name: 'Economy' },
    ],
  },
  {
    id: 'jee',
    name: 'JEE',
    tagline: 'Engineering',
    accent: '#2A9D8F',
    icon: 'Atom',
    learners: '312K',
    subjects: [
      { id: 'phy', name: 'Physics' },
      { id: 'chem', name: 'Chemistry' },
      { id: 'math', name: 'Mathematics' },
    ],
  },
  {
    id: 'neet',
    name: 'NEET',
    tagline: 'Medical',
    accent: '#264653',
    icon: 'Stethoscope',
    learners: '256K',
    subjects: [
      { id: 'bio', name: 'Biology' },
      { id: 'chem', name: 'Chemistry' },
      { id: 'phy', name: 'Physics' },
    ],
  },
  {
    id: 'cat',
    name: 'CAT',
    tagline: 'MBA / IIM',
    accent: '#E9C46A',
    icon: 'BarChart3',
    learners: '97K',
    subjects: [
      { id: 'qa', name: 'Quantitative Aptitude' },
      { id: 'lrdi', name: 'LRDI' },
      { id: 'varc', name: 'VARC' },
    ],
  },
  {
    id: 'ssc',
    name: 'SSC & Banking',
    tagline: 'Govt Jobs',
    accent: '#7C3AED',
    icon: 'Briefcase',
    learners: '410K',
    subjects: [
      { id: 'reason', name: 'Reasoning' },
      { id: 'quant', name: 'Quant' },
      { id: 'eng', name: 'English' },
      { id: 'ga', name: 'General Awareness' },
    ],
  },
  {
    id: 'gate',
    name: 'GATE',
    tagline: 'M.Tech / PSU',
    accent: '#0EA5E9',
    icon: 'Cpu',
    learners: '61K',
    subjects: [
      { id: 'ec', name: 'Electronics' },
      { id: 'cs', name: 'Computer Science' },
      { id: 'me', name: 'Mechanical' },
    ],
  },
  {
    id: 'clat',
    name: 'CLAT',
    tagline: 'Law',
    accent: '#DC2626',
    icon: 'Scale',
    learners: '38K',
    subjects: [
      { id: 'legal', name: 'Legal Reasoning' },
      { id: 'logic', name: 'Logical Reasoning' },
      { id: 'eng', name: 'English' },
      { id: 'ga', name: 'GK & CA' },
    ],
  },
];

// Icon mapping
const ICONS = { Landmark, Atom, Stethoscope, BarChart3, Briefcase, Cpu, Scale, BookOpen };

// Study modes for carousel (original design from V2)
const STUDY_MODES = [
  { id: 1, image: "/images/topic-practice-3d.svg", title: "Topic Practice", desc: "Master specific topics with customizable quizzes. Choose difficulty and question count.", headerColor: "bg-orange-200", cta: "Start Learning" },
  { id: 2, image: "/images/mock-tests-3d.svg", title: "Mock Tests", desc: "Full-length timed tests that simulate real exam conditions. Get detailed performance reports.", headerColor: "bg-emerald-200", cta: "Take Mock Test" },
  { id: 3, image: "/images/smart-review-3d.svg", title: "Smart Review", desc: "AI-powered spaced repetition. Review at the perfect moment to maximize retention.", headerColor: "bg-sky-200", cta: "Review Now" },
  { id: 4, image: "/images/level-mode-3d.svg", title: "Level Mode", desc: "Progress through levels from beginner to expert. Unlock harder topics as you master basics.", headerColor: "bg-[#F58972]", cta: "Play Levels" },
  { id: 5, image: "/images/pressure-mode-3d.svg", title: "Pressure Mode", desc: "Build mental toughness with adaptive timers. Train your brain to perform under stress.", headerColor: "bg-rose-200", cta: "Start Training" },
  { id: 6, image: "/images/daily-practice-3d.svg", title: "Daily Practice", desc: "10 questions, 10 minutes. Build your streak and stay consistent every day.", headerColor: "bg-cyan-200", cta: "Start Challenge" },
  { id: 7, image: "/images/english-practice-3d.svg", title: "Master English", desc: "TOEFL prep, Business English, and Foundation skills. Build vocabulary, grammar, and fluency.", headerColor: "bg-sky-300", cta: "Learn English" },
];

// Testimonials
const TESTIMONIALS = [
  { name: "Priya S.", exam: "JEE Main 2026", review: "Finally understand WHY I got questions wrong, not just WHAT the answer is. Game changer for JEE prep!" },
  { name: "Rahul M.", exam: "NEET UG 2026", review: "The mistake tracker helped me realize I was making the same careless errors. Fixed it in 2 weeks!" },
  { name: "Anjali K.", exam: "UPSC CSE 2026", review: "Best ₹79 I've spent on exam prep. Better than coaching classes charging ₹50,000!" },
];

export function LandingEmergent() {
  const { setShowLoginModal } = useUser();
  const [carouselIndex, setCarouselIndex] = useState(4); // Start at position 4 (first real card after clones)
  const [isTransitioning, setIsTransitioning] = useState(true);
  const carouselTrackRef = useRef<HTMLDivElement>(null);
  const [visibleFeatures, setVisibleFeatures] = useState<Set<number>>(new Set());
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [imageOffsets, setImageOffsets] = useState<number[]>([0, 0, 0, 0]);

  const upcomingExams = getUpcomingExams(15);

  // Create infinite loop by cloning last 4 cards at start and first 4 cards at end (for 4-card display)
  const infiniteModes = [
    ...STUDY_MODES.slice(-4), // Last 4 cards (clones at start)
    ...STUDY_MODES,           // All 7 real cards
    ...STUDY_MODES.slice(0, 4) // First 4 cards (clones at end)
  ];

  // Handle infinite loop seamlessly with cloned cards
  useEffect(() => {
    // After sliding to last clone (index 11), jump to first real card (index 4)
    if (carouselIndex === 11 && isTransitioning) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCarouselIndex(4);
        setTimeout(() => setIsTransitioning(true), 50);
      }, 500);
    }
    // After sliding to first clone (index 0), jump to last real card (index 7)
    else if (carouselIndex === 0 && isTransitioning) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCarouselIndex(7);
        setTimeout(() => setIsTransitioning(true), 50);
      }, 500);
    }
  }, [carouselIndex, isTransitioning]);

  // Intersection Observer for scroll animations (What Makes Different section)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = featureRefs.current.indexOf(entry.target as HTMLDivElement);
            if (index !== -1) {
              setVisibleFeatures((prev) => new Set(prev).add(index));
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px' }
    );

    featureRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Parallax effect for What Makes Different images
  useEffect(() => {
    const handleScroll = () => {
      const newOffsets = imageRefs.current.map((imageRef) => {
        if (!imageRef) return 0;

        const rect = imageRef.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        const progress = Math.max(0, Math.min(1,
          (windowHeight - rect.top) / (windowHeight + rect.height)
        ));

        return progress * -80;
      });

      setImageOffsets(newOffsets);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

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

        {/* 3. FEATURES CAROUSEL - Original Design with Infinite Loop */}
        <section id="features" className="py-16 bg-[#FAF8F5]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-8">
              <div className="text-xs font-bold tracking-[0.2em] uppercase text-[#F26A4B] mb-2">
                STUDY MODES
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-black text-[#16213E]">
                Learn your way
              </h2>
            </div>

            {/* Carousel with Arrows */}
            <div className="relative">
              {/* Left Arrow - hidden on mobile, visible on desktop */}
              <button
                onClick={() => setCarouselIndex(carouselIndex - 1)}
                className="hidden md:flex absolute left-0 top-[190px] z-20 w-14 h-14 bg-white rounded-full shadow-xl items-center justify-center hover:scale-110 transition-all border-2 border-[rgba(22,33,62,0.08)]"
              >
                <ChevronLeft className="w-6 h-6 text-[#16213E]" />
              </button>

              {/* Right Arrow - hidden on mobile, visible on desktop */}
              <button
                onClick={() => setCarouselIndex(carouselIndex + 1)}
                className="hidden md:flex absolute right-0 top-[190px] z-20 w-14 h-14 bg-white rounded-full shadow-xl items-center justify-center hover:scale-110 transition-all border-2 border-[rgba(22,33,62,0.08)]"
              >
                <ChevronRight className="w-6 h-6 text-[#16213E]" />
              </button>

              {/* Mobile: Show as horizontal scroll, Desktop: Show carousel */}
              <div className="md:hidden overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 pb-4">
                <div className="flex gap-4 pt-6">
                  {STUDY_MODES.map((mode) => (
                    <div
                      key={mode.id}
                      className="flex-shrink-0 snap-center"
                      style={{ width: 'calc(100vw - 64px)' }}
                    >
                      <button
                        onClick={() => setShowLoginModal(true)}
                        className="bg-[#FAF8F5] rounded-2xl overflow-hidden shadow-md hover:shadow-xl cursor-pointer text-left w-full flex flex-col h-full"
                      >
                        <div className={`${mode.headerColor} h-40 flex items-center justify-center relative overflow-hidden pt-3`}>
                          <div className="relative w-full h-full flex items-center justify-center">
                            <Image
                              src={mode.image}
                              alt={mode.title}
                              width={140}
                              height={140}
                              className="object-contain"
                            />
                          </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col bg-[#FAF8F5] justify-between">
                          <div>
                            <h3 className="text-base font-bold text-[#16213E] mb-2 text-center">{mode.title}</h3>
                            <p className="text-[#5A6478] text-xs leading-relaxed mb-3 text-center">
                              {mode.desc}
                            </p>
                          </div>
                          <div className="text-[#F26A4B] font-semibold text-xs flex items-center justify-center gap-1.5">
                            {mode.cta}
                            <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop: Show animated carousel */}
              <div className="hidden md:block overflow-hidden px-4">
                <div
                  ref={carouselTrackRef}
                  className="flex gap-6"
                  style={{
                    transform: `translateX(calc(-${carouselIndex * 25}% - ${carouselIndex * 6}px))`,
                    transition: isTransitioning ? 'transform 600ms cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                    paddingTop: '24px',
                    paddingBottom: '24px'
                  }}
                >
                  {infiniteModes.map((mode, index) => (
                    <div
                      key={`${mode.id}-${index}`}
                      className="flex-shrink-0"
                      style={{ width: 'calc(25% - 18px)' }}
                    >
                      <button
                        onClick={() => setShowLoginModal(true)}
                        className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl cursor-pointer group text-left w-full flex flex-col"
                        style={{
                          minHeight: '380px',
                          transform: 'translateY(0) scale(1)',
                          transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-12px) scale(1.03)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        }}
                      >
                        <div className={`${mode.headerColor} h-48 flex items-center justify-center relative overflow-hidden pt-4`}>
                          <div className="relative w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                            <Image
                              src={mode.image}
                              alt={mode.title}
                              width={160}
                              height={160}
                              className="object-contain"
                            />
                          </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col bg-white justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-[#16213E] mb-2 text-center">{mode.title}</h3>
                            <p className="text-[#5A6478] text-sm leading-relaxed mb-4 text-center">
                              {mode.desc}
                            </p>
                          </div>
                          <div className="text-[#F26A4B] font-semibold text-sm flex items-center justify-center gap-1.5 group-hover:gap-2.5 transition-all">
                            {mode.cta}
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. EXAM CATEGORIES GRID - Emergent Structure */}
        <section id="exams" className="py-8" data-testid="exam-categories-section">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-xs font-bold tracking-[0.2em] uppercase text-[#F26A4B]">
                Pick your battle
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
            {EXAMS.map((exam, idx) => {
              const Icon = ICONS[exam.icon as keyof typeof ICONS] || BookOpen;
              const featured = idx === 0;
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
                    style={{ backgroundColor: exam.accent }}
                  />
                  <div className="relative flex items-start justify-between">
                    <div
                      className="w-12 h-12 rounded-2xl grid place-items-center"
                      style={{ backgroundColor: `${exam.accent}20`, color: exam.accent }}
                    >
                      <Icon className="w-6 h-6" strokeWidth={2.5} />
                    </div>
                    <div className="text-xs text-[#5A6478] font-mono">{exam.learners}</div>
                  </div>
                  <div className="relative mt-6">
                    <div className="text-xs font-bold uppercase tracking-widest text-[#5A6478]">
                      {exam.tagline}
                    </div>
                    <div className="font-heading text-2xl sm:text-3xl font-black text-[#16213E] mt-1">
                      {exam.name}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {exam.subjects.slice(0, featured ? 4 : 3).map((s) => (
                        <span
                          key={s.id}
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
            })}
          </div>
        </section>

        {/* 5. WHAT MAKES DIFFERENT - Snake Pattern */}
        <section className="pt-8 md:pt-16 pb-12 md:pb-20">
          <div className="text-center mb-12 md:mb-16">
            <div className="text-xs font-bold tracking-[0.2em] uppercase text-[#F26A4B] mb-2">
              WHY KRAKKIFY
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#16213E] mb-3 md:mb-4">
              What makes Krakkify different
            </h2>
            <p className="text-[#5A6478] text-sm md:text-base lg:text-lg max-w-2xl mx-auto px-2">
              Intelligent AI features designed specifically for Indian competitive exams
            </p>
          </div>

          {/* Feature 1 - Image Left, Text Right */}
          <div
            ref={(el) => { featureRefs.current[0] = el; }}
            className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-12 mb-12 md:mb-24"
          >
            {/* Image */}
            <div className="w-full md:w-2/5 flex-shrink-0">
              <div
                ref={(el) => { imageRefs.current[0] = el; }}
                className="rounded-2xl overflow-hidden shadow-xl max-w-sm mx-auto"
                style={{
                  transform: visibleFeatures.has(0) ? `translateY(${imageOffsets[0]}px)` : 'translateY(0px)',
                  opacity: visibleFeatures.has(0) ? 1 : 0,
                  transition: visibleFeatures.has(0) ? 'opacity 0.6s ease-out' : 'none',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80"
                  alt="Rich Explanations - Student studying with detailed notes"
                  className="w-full h-auto object-cover aspect-[4/3]"
                />
              </div>
            </div>
            {/* Text */}
            <div
              className="w-full md:w-3/5"
              style={{
                opacity: visibleFeatures.has(0) ? 1 : 0,
                transition: 'opacity 0.8s ease-out',
              }}
            >
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#16213E] mb-3 md:mb-4">
                Rich Explanations
              </h3>
              <p className="text-[#5A6478] text-sm md:text-base lg:text-lg leading-relaxed">
                Understand the WHY behind every answer. Get step-by-step breakdowns, trap alerts, formulas, and common
                mistakes highlighted for each question. Never waste time wondering why you got it wrong—our detailed explanations show you the logic behind correct answers and help you avoid traps that confuse most students.
              </p>
            </div>
          </div>

          {/* Feature 2 - Text Left, Image Right */}
          <div
            ref={(el) => { featureRefs.current[1] = el; }}
            className="flex flex-col md:flex-row-reverse items-center md:items-start gap-6 md:gap-12 mb-12 md:mb-24"
          >
            {/* Image */}
            <div className="w-full md:w-2/5 flex-shrink-0">
              <div
                ref={(el) => { imageRefs.current[1] = el; }}
                className="rounded-2xl overflow-hidden shadow-xl max-w-sm mx-auto"
                style={{
                  transform: visibleFeatures.has(1) ? `translateY(${imageOffsets[1]}px)` : 'translateY(0px)',
                  opacity: visibleFeatures.has(1) ? 1 : 0,
                  transition: visibleFeatures.has(1) ? 'opacity 0.6s ease-out' : 'none',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
                  alt="Mistake Map - Analytics dashboard showing performance data"
                  className="w-full h-auto object-cover aspect-[4/3]"
                />
              </div>
            </div>
            {/* Text */}
            <div
              className="w-full md:w-3/5"
              style={{
                opacity: visibleFeatures.has(1) ? 1 : 0,
                transition: 'opacity 0.8s ease-out',
              }}
            >
              <h3 className="text-2xl md:text-3xl font-bold text-[#16213E] mb-4">
                Mistake Map
              </h3>
              <p className="text-[#5A6478] text-lg leading-relaxed">
                AI identifies your weakness patterns—calculation errors, concept gaps, time pressure issues, and careless
                mistakes. Our smart algorithm categorizes every wrong answer and reveals patterns with visual charts and
                topic-wise breakdowns. Focus your revision strategically instead of studying blindly.
              </p>
            </div>
          </div>

          {/* Feature 3 - Image Left, Text Right */}
          <div
            ref={(el) => { featureRefs.current[2] = el; }}
            className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-12 mb-12 md:mb-24"
          >
            {/* Image */}
            <div className="w-full md:w-2/5 flex-shrink-0">
              <div
                ref={(el) => { imageRefs.current[2] = el; }}
                className="rounded-2xl overflow-hidden shadow-xl max-w-sm mx-auto"
                style={{
                  transform: visibleFeatures.has(2) ? `translateY(${imageOffsets[2]}px)` : 'translateY(0px)',
                  opacity: visibleFeatures.has(2) ? 1 : 0,
                  transition: visibleFeatures.has(2) ? 'opacity 0.6s ease-out' : 'none',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"
                  alt="Midnight Doubt AI - Student learning online at night"
                  className="w-full h-auto object-cover aspect-[4/3]"
                />
              </div>
            </div>
            {/* Text */}
            <div
              className="w-full md:w-3/5"
              style={{
                opacity: visibleFeatures.has(2) ? 1 : 0,
                transition: 'opacity 0.8s ease-out',
              }}
            >
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#16213E] mb-3 md:mb-4">
                Midnight Doubt AI
              </h3>
              <p className="text-[#5A6478] text-sm md:text-base lg:text-lg leading-relaxed">
                Stuck at 2 AM? Ask our AI tutor anything, anytime. Get instant clarifications in simple language—English
                or Hindi. No more waiting for teachers or WhatsApp groups to respond—our AI understands your exact question and explains concepts in a way that clicks instantly.
              </p>
            </div>
          </div>

          {/* Feature 4 - Text Left, Image Right */}
          <div
            ref={(el) => { featureRefs.current[3] = el; }}
            className="flex flex-col md:flex-row-reverse items-center md:items-start gap-6 md:gap-12 mb-12 md:mb-24"
          >
            {/* Image */}
            <div className="w-full md:w-2/5 flex-shrink-0">
              <div
                ref={(el) => { imageRefs.current[3] = el; }}
                className="rounded-2xl overflow-hidden shadow-xl max-w-sm mx-auto"
                style={{
                  transform: visibleFeatures.has(3) ? `translateY(${imageOffsets[3]}px)` : 'translateY(0px)',
                  opacity: visibleFeatures.has(3) ? 1 : 0,
                  transition: visibleFeatures.has(3) ? 'opacity 0.6s ease-out' : 'none',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
                  alt="Smart Dashboard - Progress tracking and analytics"
                  className="w-full h-auto object-cover aspect-[4/3]"
                />
              </div>
            </div>
            {/* Text */}
            <div
              className="w-full md:w-3/5"
              style={{
                opacity: visibleFeatures.has(3) ? 1 : 0,
                transition: 'opacity 0.8s ease-out',
              }}
            >
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#16213E] mb-3 md:mb-4">
                Smart Dashboard
              </h3>
              <p className="text-[#5A6478] text-sm md:text-base lg:text-lg leading-relaxed">
                Track your progress with beautiful stats and charts—questions solved, accuracy trends, daily streaks,
                and achievement badges all in one place. See exactly where you stand with subject-wise breakdowns and identify weak topics at a glance. Your entire exam preparation journey visualized in one powerful dashboard that keeps you motivated and focused on what matters most.
              </p>
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

        {/* 7. UPCOMING EXAM CALENDAR - Marquee Style */}
        <section className="bg-transparent py-16">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="text-xs font-bold tracking-[0.2em] uppercase text-[#F26A4B] mb-2">
              MARK YOUR CALENDAR
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-[#16213E]">
              Upcoming Exams
            </h2>
          </div>

          {/* Dark Navy Marquee Container - Same width as ticker */}
          <div className="relative overflow-hidden rounded-3xl bg-[#16213E] text-white py-5">
            <div className="flex whitespace-nowrap animate-marquee gap-8">
              {/* First set of exams - inline marquee style */}
              {[...Array(2)].map((_, k) => (
                <div key={k} className="flex items-center gap-8">
                  {upcomingExams.map((exam, idx) => (
                    <span key={`${k}-${exam.id}`} className="inline-flex items-center gap-3 font-heading text-base font-semibold">
                      <span className="inline-flex items-center gap-2">
                        <span className="text-white">{exam.examName}</span>
                        {exam.phase && (
                          <span className="text-white/60 text-sm">({exam.phase})</span>
                        )}
                      </span>
                      <span className="text-[#F26A4B]">·</span>
                      <span className="text-white/80 text-sm">{exam.date}</span>
                      <span className="text-[#F26A4B] text-xl">✦</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* View Full Calendar Button */}
          <div className="text-center mt-8">
            <button
              onClick={() => setShowLoginModal(true)}
              className="text-[#F26A4B] font-semibold hover:text-[#E15838] transition-colors"
            >
              View full calendar →
            </button>
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
// Build: 1783432158
