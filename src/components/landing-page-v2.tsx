"use client";
// v84 - Fixed parallax effect with reduced movement and -40px cap
import { useState, useMemo, useEffect, useRef } from "react";
import { useUser } from "@/context/user-context";
import { examCategories } from "@/lib/exams";
import Image from "next/image";
import {
  Sparkles,
  Search,
  ArrowRight,
  Star,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  User,
  ExternalLink,
  Calendar,
  X
} from "lucide-react";
import { ColorfulExamIcon } from "@/lib/colorful-exam-icons";
import { getUpcomingExams } from "@/lib/exam-calendar";
import { PrivacyPolicyContent, TermsContent } from "@/components/legal-content";

// Student testimonials data
const testimonials = [
  { name: "Priya S.", exam: "JEE Main 2026", review: "Finally understand WHY I got questions wrong, not just WHAT the answer is. Game changer for JEE prep!" },
  { name: "Rahul M.", exam: "NEET UG 2026", review: "The mistake tracker helped me realize I was making the same careless errors. Fixed it in 2 weeks!" },
  { name: "Anjali K.", exam: "UPSC CSE 2026", review: "Best ₹79 I've spent on exam prep. Better than coaching classes charging ₹50,000!" },
  { name: "Arjun P.", exam: "CAT 2026", review: "Mock tests feel exactly like the real exam. The performance analytics helped me identify weak areas quickly!" },
  { name: "Sneha R.", exam: "SSC CGL 2026", review: "The spaced repetition feature is brilliant. I remember topics for months now, not just till the exam!" },
  { name: "Karthik V.", exam: "GATE 2026", review: "AI-generated questions are so diverse. Never felt like I was practicing the same type over and over." },
  { name: "Meera D.", exam: "NEET PG 2026", review: "The detailed explanations after each question saved me hours of googling. Everything is right there!" },
  { name: "Vikram S.", exam: "Banking PO 2026", review: "Daily practice problems keep me consistent. The streak feature is surprisingly motivating!" },
  { name: "Divya L.", exam: "CLAT 2026", review: "Exactly what I needed for law prep. Questions are up-to-date with current affairs and legal reasoning." },
];

export function LandingPageV2() {
  const { setShowLoginModal } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showExamsDropdown, setShowExamsDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(4); // Start at position 4 (first real card after clones)
  const [isTransitioning, setIsTransitioning] = useState(true);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const examsDropdownRef = useRef<HTMLDivElement>(null);
  const carouselTrackRef = useRef<HTMLDivElement>(null);
  const [visibleFeatures, setVisibleFeatures] = useState<Set<number>>(new Set());
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [imageOffsets, setImageOffsets] = useState<number[]>([0, 0, 0, 0]);
  const [reviewsPage, setReviewsPage] = useState(0);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Search logic
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;

    const query = searchQuery.toLowerCase();
    const results: Array<{
      type: "exam" | "subject" | "topic";
      examId: string;
      examName: string;
      subjectName?: string;
      topicName?: string;
      category: string;
    }> = [];

    examCategories.forEach((category) => {
      category.exams.forEach((exam) => {
        if (exam.name.toLowerCase().includes(query) ||
            exam.fullName.toLowerCase().includes(query) ||
            exam.description.toLowerCase().includes(query)) {
          results.push({
            type: "exam",
            examId: exam.id,
            examName: exam.name,
            category: category.name,
          });
        }

        exam.subjects.forEach((subject) => {
          if (subject.name.toLowerCase().includes(query)) {
            results.push({
              type: "subject",
              examId: exam.id,
              examName: exam.name,
              subjectName: subject.name,
              category: category.name,
            });
          }

          subject.topics.forEach((topic) => {
            if (topic.toLowerCase().includes(query)) {
              results.push({
                type: "topic",
                examId: exam.id,
                examName: exam.name,
                subjectName: subject.name,
                topicName: topic,
                category: category.name,
              });
            }
          });
        });
      });
    });

    return results.slice(0, 8);
  }, [searchQuery]);

  // Close search on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (examsDropdownRef.current && !examsDropdownRef.current.contains(event.target as Node)) {
        setShowExamsDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Intersection Observer for scroll animations
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

  // Parallax effect - calculate offset for each image based on its viewport position
  useEffect(() => {
    const handleScroll = () => {
      const newOffsets = imageRefs.current.map((imageRef) => {
        if (!imageRef) return 0;

        const rect = imageRef.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Calculate scroll progress through viewport (0 to 1)
        // When entering from bottom: progress = 0
        // When at center: progress = 0.5
        // When exiting from top: progress = 1
        const progress = Math.max(0, Math.min(1,
          (windowHeight - rect.top) / (windowHeight + rect.height)
        ));

        // Apply parallax: 0 to -80px based on progress
        return progress * -80;
      });

      setImageOffsets(newOffsets);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Handle infinite loop seamlessly with cloned cards (4-card layout)
  useEffect(() => {
    // After sliding to last clone (index 10), jump to first real card (index 4)
    if (carouselIndex === 10 && isTransitioning) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCarouselIndex(4);
        setTimeout(() => setIsTransitioning(true), 50);
      }, 500);
    }
    // After sliding to first clone (index 0), jump to last real card (index 6)
    else if (carouselIndex === 0 && isTransitioning) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCarouselIndex(6);
        setTimeout(() => setIsTransitioning(true), 50);
      }, 500);
    }
  }, [carouselIndex, isTransitioning]);

  // Study modes data - 3D illustrations style with visible colors
  const studyModes = [
    { id: 1, image: "/images/topic-practice-3d.svg", title: "Topic Practice", desc: "Master specific topics with customizable quizzes. Choose difficulty and question count.", headerColor: "bg-orange-200", cta: "Start Learning" },
    { id: 2, image: "/images/mock-tests-3d.svg", title: "Mock Tests", desc: "Full-length timed tests that simulate real exam conditions. Get detailed performance reports.", headerColor: "bg-emerald-200", cta: "Take Mock Test" },
    { id: 3, image: "/images/smart-review-3d.svg", title: "Smart Review", desc: "AI-powered spaced repetition. Review at the perfect moment to maximize retention.", headerColor: "bg-sky-200", cta: "Review Now" },
    { id: 4, image: "/images/level-mode-3d.svg", title: "Level Mode", desc: "Progress through levels from beginner to expert. Unlock harder topics as you master basics.", headerColor: "bg-purple-200", cta: "Play Levels" },
    { id: 5, image: "/images/pressure-mode-3d.svg", title: "Pressure Mode", desc: "Build mental toughness with adaptive timers. Train your brain to perform under stress.", headerColor: "bg-rose-200", cta: "Start Training" },
    { id: 6, image: "/images/daily-practice-3d.svg", title: "Daily Practice", desc: "10 questions, 10 minutes. Build your streak and stay consistent every day.", headerColor: "bg-cyan-200", cta: "Start Challenge" },
    { id: 7, image: "/images/english-practice-3d.svg", title: "Master English", desc: "TOEFL prep, Business English, and Foundation skills. Build vocabulary, grammar, and fluency.", headerColor: "bg-sky-300", cta: "Learn English" },
  ];

  // Create infinite loop by cloning last 4 cards at start and first 4 cards at end (for 4-card display)
  const infiniteModes = [
    ...studyModes.slice(-4), // Last 4 cards (clones at start)
    ...studyModes,           // All 6 real cards
    ...studyModes.slice(0, 4) // First 4 cards (clones at end)
  ];

  return (
    <div className="min-h-screen font-sans" style={{ background: "#f8fafc" }} data-version="v101-varied-icons">
      {/* Header with Exams Dropdown - Quizlet Style */}
      <header className="sticky top-0 z-50" style={{ background: "white", borderBottomColor: "#e2e8f0", borderBottomWidth: "1px", borderBottomStyle: "solid" }}>
        {/* Main Header */}
        <div className="max-w-[1400px] mx-auto w-full px-8 py-3 flex items-center gap-4 justify-between">
          {/* Left side: Logo + Exams Dropdown */}
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#4F46E5' }}>
                <span className="text-white font-semibold text-xl">P</span>
              </div>
              <span className="font-semibold text-xl" style={{ color: "#0f172a" }}>Krakkify</span>
            </div>

            {/* Exams Dropdown */}
            <div ref={examsDropdownRef} className="relative hidden lg:block">
              <button
                onClick={() => setShowExamsDropdown(!showExamsDropdown)}
                className="flex items-center gap-1.5 px-3 py-2 font-semibold text-base rounded-lg transition-colors"
                style={{ color: "#0f172a", background: "transparent" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <span>Exams</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showExamsDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Mega Menu Dropdown */}
              {showExamsDropdown && (
                <div className="absolute top-full left-0 mt-2 rounded-xl shadow-2xl overflow-hidden flex" style={{ width: '720px', maxHeight: '500px', background: "white", borderColor: "#e2e8f0", borderWidth: "1px", borderStyle: "solid" }}>
                  {/* Left Panel - Category List */}
                  <div className="w-64 overflow-y-auto" style={{ background: "#f8fafc", borderRightColor: "#e2e8f0", borderRightWidth: "1px", borderRightStyle: "solid" }}>
                    <div className="py-2">
                      {examCategories.map((category) => (
                        <button
                          key={category.id}
                          onMouseEnter={() => setSelectedCategory(category.id)}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full text-left px-4 py-3 transition-colors flex items-start justify-between group ${
                            selectedCategory === category.id
                              ? 'bg-[white] text-slate-900 border-l-4 border-blue-500'
                              : 'text-slate-700 hover:bg-[white] border-l-4 border-transparent'
                          }`}
                        >
                          <div className="flex-1">
                            <div className="font-semibold text-sm mb-0.5">{category.name}</div>
                            <div className="text-xs text-slate-500 line-clamp-1">
                              {category.exams.map(e => e.name).slice(0, 3).join(', ')}
                            </div>
                          </div>
                          <ArrowRight className={`w-4 h-4 mt-0.5 flex-shrink-0 ml-2 ${
                            selectedCategory === category.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                          }`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Right Panel - Exam Grid */}
                  <div className="flex-1 bg-[white] p-5 overflow-y-auto max-h-[500px]">
                    {selectedCategory ? (
                      <>
                        <h3 className="font-bold text-slate-900 mb-4 text-base">
                          {examCategories.find(c => c.id === selectedCategory)?.name}
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          {examCategories
                            .find(c => c.id === selectedCategory)
                            ?.exams.map((exam) => (
                              <button
                                key={exam.id}
                                onClick={() => {
                                  setShowExamsDropdown(false);
                                  setShowLoginModal(true);
                                }}
                                className="flex items-center gap-3 p-2.5 rounded-lg border border-[#e2e8f0] hover:border-blue-400 hover:bg-blue-50 transition-all group"
                              >
                                <ColorfulExamIcon examId={exam.id} size={56} />
                                <div className="flex-1 text-left">
                                  <div className="font-semibold text-sm text-slate-900 group-hover:text-blue-600">{exam.name}</div>
                                </div>
                              </button>
                            ))}
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-500 text-sm">
                        Hover over a category
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Center: Search Bar - Quizlet Style */}
          <div ref={searchContainerRef} className="flex-1 max-w-2xl relative hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search exams, subjects, topics..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-[#e2e8f0] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all bg-transparent hover:bg-[white]"
              />
            </div>

            {/* Search Results Dropdown */}
            {showSearchDropdown && searchQuery.trim() && searchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[white] rounded-xl shadow-2xl border border-[#e2e8f0] overflow-hidden z-50 max-h-[500px] overflow-y-auto">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => setShowLoginModal(true)}
                    className="w-full px-4 py-3 hover:bg-transparent transition-colors text-left border-b border-slate-100 last:border-b-0 group"
                  >
                    <div className="flex items-center gap-3">
                      <ColorfulExamIcon examId={result.examId} size={64} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-semibold text-sm text-slate-900">{result.examName}</span>
                          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                            {result.category}
                          </span>
                        </div>
                        {result.type === "subject" && (
                          <p className="text-xs text-slate-600 font-medium">{result.subjectName}</p>
                        )}
                        {result.type === "topic" && (
                          <p className="text-xs text-slate-600 font-medium">
                            {result.subjectName} → {result.topicName}
                          </p>
                        )}
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right side: Login Button */}
          <button
            onClick={() => setShowLoginModal(true)}
            className="flex items-center gap-2 px-6 py-3 text-slate-700 font-semibold rounded-lg transition-colors text-lg whitespace-nowrap group"
            style={{
              '--hover-bg': '#EEF2FF',
              '--hover-text': '#4F46E5'
            } as React.CSSProperties}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#EEF2FF';
              e.currentTarget.style.color = '#4F46E5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#475569';
            }}
          >
            <User className="w-6 h-6" />
            <span>Login</span>
          </button>
        </div>
      </header>

      {/* Hero Section - Quizlet Style - Full Width Background */}
      <section className="bg-transparent pt-6 md:pt-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6 pb-6 md:pb-8 text-center">
          {/* Main Heading - Simple & Direct */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight">
            Master Your<br className="sm:hidden" /> Competitive Exams
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-600 mb-3 max-w-3xl mx-auto leading-relaxed">
            JEE, NEET, UPSC, SSC, Banking & 60+ exams with AI-powered practice.
          </p>

          <p className="text-xs sm:text-sm md:text-base text-slate-500 mb-6 max-w-3xl mx-auto leading-relaxed">
            Smart quizzes · Mock tests · Spaced repetition · Performance analytics · Daily practice challenges
          </p>

          {/* CTA */}
          <button
            onClick={() => setShowLoginModal(true)}
            className="px-6 md:px-8 py-2.5 md:py-3 text-white font-semibold text-sm md:text-base rounded-xl hover:shadow-2xl hover:scale-105 transition-all shadow-lg"
            style={{ backgroundColor: '#4F46E5' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#4338CA';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#4F46E5';
            }}
          >
            Start Practicing Free
          </button>

          {/* Trust Stats */}
          <div className="mt-4 md:mt-3 flex flex-wrap justify-center gap-4 md:gap-6 text-center px-2">
            <div>
              <div className="text-xl md:text-2xl font-semibold mb-1" style={{ color: '#085893' }}>60+</div>
              <div className="text-[10px] md:text-xs text-slate-600">Exams Covered</div>
            </div>
            <div>
              <div className="text-xl md:text-2xl font-semibold mb-1" style={{ color: '#085893' }}>200+</div>
              <div className="text-[10px] md:text-xs text-slate-600">Subjects Covered</div>
            </div>
            <div>
              <div className="text-xl md:text-2xl font-semibold mb-1" style={{ color: '#085893' }}>1,870+</div>
              <div className="text-[10px] md:text-xs text-slate-600">Practice Topics</div>
            </div>
          </div>
        </div>
      </section>

      {/* Study Modes - Carousel (Quizlet Style) - Full Width Background */}
      <section className="bg-transparent">
        <div className="max-w-7xl mx-auto px-2 md:px-6 pb-12 md:pb-16 relative overflow-visible">
              {/* Left Arrow - hidden on mobile, visible on desktop */}
              <button
                onClick={() => setCarouselIndex(carouselIndex - 1)}
                className="hidden md:flex absolute left-0 top-[190px] z-20 w-14 h-14 bg-[white] rounded-full shadow-xl items-center justify-center hover:scale-110 transition-all border-2 border-[#e2e8f0]"
              >
                <ChevronLeft className="w-6 h-6 text-slate-800" />
              </button>

              {/* Right Arrow - hidden on mobile, visible on desktop */}
              <button
                onClick={() => setCarouselIndex(carouselIndex + 1)}
                className="hidden md:flex absolute right-0 top-[190px] z-20 w-14 h-14 bg-[white] rounded-full shadow-xl items-center justify-center hover:scale-110 transition-all border-2 border-[#e2e8f0]"
              >
                <ChevronRight className="w-6 h-6 text-slate-800" />
              </button>

              {/* Mobile: Show as horizontal scroll, Desktop: Show carousel */}
              <div className="md:hidden overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 pb-4">
                <div className="flex gap-4 pt-6">
                  {studyModes.map((mode) => (
                    <div
                      key={mode.id}
                      className="flex-shrink-0 snap-center"
                      style={{ width: 'calc(100vw - 64px)' }}
                    >
                      <button
                        onClick={() => setShowLoginModal(true)}
                        className="bg-[white] rounded-2xl overflow-hidden shadow-md hover:shadow-xl cursor-pointer text-left w-full flex flex-col h-full"
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
                        <div className="p-4 flex-1 flex flex-col bg-[white] justify-between">
                          <div>
                            <h3 className="text-base font-bold text-slate-900 mb-2 text-center">{mode.title}</h3>
                            <p className="text-slate-600 text-xs leading-relaxed mb-3 text-center">
                              {mode.desc}
                            </p>
                          </div>
                          <div className="text-indigo-600 font-semibold text-xs flex items-center justify-center gap-1.5">
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
                      className="bg-[white] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl cursor-pointer group text-left w-full flex flex-col"
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
                      <div className="p-5 flex-1 flex flex-col bg-[white] justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 mb-2 text-center">{mode.title}</h3>
                          <p className="text-slate-600 text-sm leading-relaxed mb-4 text-center">
                            {mode.desc}
                          </p>
                        </div>
                        <div className="text-indigo-600 font-semibold text-sm flex items-center justify-center gap-1.5 group-hover:gap-2.5 transition-all">
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
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* What Makes Krakkify Different - Snake Pattern */}
        <section className="pt-8 md:pt-16 pb-12 md:pb-20">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 md:mb-4">
              What makes Krakkify different
            </h2>
            <p className="text-slate-600 text-sm md:text-base lg:text-lg max-w-2xl mx-auto px-2">
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
                className="rounded-2xl overflow-hidden shadow-xl bg-indigo-200 p-4 md:p-6 max-w-sm mx-auto"
                style={{
                  transform: visibleFeatures.has(0) ? `translateY(${imageOffsets[0]}px)` : 'translateY(0px)',
                  opacity: visibleFeatures.has(0) ? 1 : 0,
                  transition: visibleFeatures.has(0) ? 'opacity 0.6s ease-out' : 'none',
                }}
              >
                <img
                  src="/images/features/rich-explanations.svg"
                  alt="Rich Explanations"
                  className="w-full h-auto"
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
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 mb-3 md:mb-4">
                Rich Explanations
              </h3>
              <p className="text-slate-600 text-sm md:text-base lg:text-lg leading-relaxed">
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
                className="rounded-2xl overflow-hidden shadow-xl bg-purple-200 p-4 md:p-6 max-w-sm mx-auto"
                style={{
                  transform: visibleFeatures.has(1) ? `translateY(${imageOffsets[1]}px)` : 'translateY(0px)',
                  opacity: visibleFeatures.has(1) ? 1 : 0,
                  transition: visibleFeatures.has(1) ? 'opacity 0.6s ease-out' : 'none',
                }}
              >
                <img
                  src="/images/features/mistake-tracker.svg"
                  alt="Mistake Tracker"
                  className="w-full h-auto"
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
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                Mistake Map
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed">
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
                className="rounded-2xl overflow-hidden shadow-xl bg-sky-200 p-4 md:p-6 max-w-sm mx-auto"
                style={{
                  transform: visibleFeatures.has(2) ? `translateY(${imageOffsets[2]}px)` : 'translateY(0px)',
                  opacity: visibleFeatures.has(2) ? 1 : 0,
                  transition: visibleFeatures.has(2) ? 'opacity 0.6s ease-out' : 'none',
                }}
              >
                <img
                  src="/images/features/ai-tutor.svg"
                  alt="24/7 AI Tutor"
                  className="w-full h-auto"
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
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 mb-3 md:mb-4">
                Midnight Doubt AI
              </h3>
              <p className="text-slate-600 text-sm md:text-base lg:text-lg leading-relaxed">
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
                className="rounded-2xl overflow-hidden shadow-xl bg-emerald-200 p-4 md:p-6 max-w-sm mx-auto"
                style={{
                  transform: visibleFeatures.has(3) ? `translateY(${imageOffsets[3]}px)` : 'translateY(0px)',
                  opacity: visibleFeatures.has(3) ? 1 : 0,
                  transition: visibleFeatures.has(3) ? 'opacity 0.6s ease-out' : 'none',
                }}
              >
                <img
                  src="/images/features/dashboard.svg"
                  alt="Smart Dashboard"
                  className="w-full h-auto"
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
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 mb-3 md:mb-4">
                Smart Dashboard
              </h3>
              <p className="text-slate-600 text-sm md:text-base lg:text-lg leading-relaxed">
                Track your progress with beautiful stats and charts—questions solved, accuracy trends, daily streaks,
                and achievement badges all in one place. See exactly where you stand with subject-wise breakdowns and identify weak topics at a glance. Your entire exam preparation journey visualized in one powerful dashboard that keeps you motivated and focused on what matters most.
              </p>
            </div>
          </div>

        </section>
        {/* Final CTA */}
        <section className="pb-8 mt-0 md:-mt-24">
          <div className="bg-[#4255FF] rounded-3xl p-8 md:p-10 text-center text-white shadow-2xl">
            <h2 className="text-2xl md:text-4xl font-semibold mb-4">
              Ready to ace your exam?
            </h2>
            <p className="text-base md:text-lg text-indigo-50 mb-6 max-w-2xl mx-auto">
              Join 50,000+ students who are already mastering their competitive exams with Krakkify
            </p>
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-8 py-3 bg-[white] text-[#4255FF] font-semibold text-base rounded-xl hover:bg-transparent hover:scale-105 transition-all shadow-xl"
            >
              Start Free Today
            </button>

            {/* App Store Badges */}
            <div className="mt-6">
              <p className="text-white text-sm sm:text-base font-bold mb-3">Learn anytime, anywhere</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                {/* Google Play Store */}
                <button className="w-full sm:w-auto bg-black rounded-lg px-4 py-3 flex items-center justify-center gap-2.5 hover:bg-slate-800 transition-colors cursor-not-allowed opacity-75 min-h-[56px]">
                  <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a1.978 1.978 0 01-.61-1.423V3.237c0-.534.212-1.043.609-1.423z" fill="#32BBFF"/>
                    <path d="M13.792 12l3.896 3.896-11.52 6.581a2.006 2.006 0 01-.559.137L13.792 12z" fill="#32BBFF"/>
                    <path d="M20.405 10.812l-2.717 1.552L13.792 12l3.896-3.896 2.717 1.552c.752.43 1.196 1.198 1.196 2.078s-.444 1.648-1.196 2.078z" fill="#32BBFF"/>
                    <path d="M6.168 1.386l11.52 6.581L13.792 12 5.609 3.813c.16-.128.347-.225.559-.29.212-.064.44-.105.677-.137h-.677z" fill="#32BBFF"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-[9px] text-slate-300 leading-tight">GET IT ON</div>
                    <div className="text-sm font-semibold text-white leading-tight">Google Play</div>
                  </div>
                </button>

                {/* Apple App Store */}
                <button className="w-full sm:w-auto bg-black rounded-lg px-4 py-3 flex items-center justify-center gap-2.5 hover:bg-slate-800 transition-colors cursor-not-allowed opacity-75 min-h-[56px]">
                  <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-[9px] text-slate-300 leading-tight">Download on the</div>
                    <div className="text-sm font-semibold text-white leading-tight">App Store</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Upcoming Exam Calendar - Infinite Marquee */}
      <section className="bg-transparent py-16">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Calendar className="w-8 h-8 text-indigo-600" />
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 text-center">Upcoming Exam Calendar</h2>
            </div>
            <p className="text-slate-600 text-center text-lg">Mark your dates and start preparing today</p>
          </div>

          {/* Infinite Scrolling Marquee - Edge to Edge */}
          <div className="relative w-screen ml-[calc(-50vw+50%)] overflow-hidden group">
            <div className="flex animate-marquee-fast gap-6 group-hover:pause-marquee">
              {/* First set of exams */}
              {getUpcomingExams(15).map((exam, idx) => (
                <div
                  key={`exam-1-${exam.id}`}
                  className="flex-shrink-0 w-80"
                >
                  <div className="bg-[white] rounded-2xl p-5 border border-[#e2e8f0] hover:border-indigo-300 hover:shadow-xl transition-all duration-300 h-full relative">
                    {/* External Link - Top Right */}
                    <a
                      href={exam.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 bg-slate-100 text-slate-700 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors z-10"
                      title="Official Website"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    {/* Compact Header */}
                    <div className="flex items-center gap-3 mb-4 pr-10">
                      <ColorfulExamIcon examId={exam.examId} size={64} className="drop-shadow-md flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-slate-900 truncate">{exam.examName}</h3>
                        {exam.phase && (
                          <p className="text-xs text-indigo-600 font-medium truncate">{exam.phase}</p>
                        )}
                      </div>
                    </div>

                    {/* Date Display */}
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-3 text-center border border-indigo-100">
                      <div className="text-xs text-indigo-700 font-semibold uppercase mb-1 flex items-center justify-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Exam Date
                      </div>
                      <div className="text-sm font-bold text-slate-900">{exam.date}</div>
                    </div>
                  </div>
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {getUpcomingExams(15).map((exam, idx) => (
                <div
                  key={`exam-2-${exam.id}`}
                  className="flex-shrink-0 w-80"
                >
                  <div className="bg-[white] rounded-2xl p-5 border border-[#e2e8f0] hover:border-indigo-300 hover:shadow-xl transition-all duration-300 h-full relative">
                    {/* External Link - Top Right */}
                    <a
                      href={exam.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 bg-slate-100 text-slate-700 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors z-10"
                      title="Official Website"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    {/* Compact Header */}
                    <div className="flex items-center gap-3 mb-4 pr-10">
                      <ColorfulExamIcon examId={exam.examId} size={64} className="drop-shadow-md flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-slate-900 truncate">{exam.examName}</h3>
                        {exam.phase && (
                          <p className="text-xs text-indigo-600 font-medium truncate">{exam.phase}</p>
                        )}
                      </div>
                    </div>

                    {/* Date Display */}
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-3 text-center border border-indigo-100">
                      <div className="text-xs text-indigo-700 font-semibold uppercase mb-1 flex items-center justify-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Exam Date
                      </div>
                      <div className="text-sm font-bold text-slate-900">{exam.date}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => window.open('https://www.google.com/search?q=india+exam+calendar+2026', '_blank')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[white] text-indigo-600 font-semibold text-lg rounded-xl border-2 border-indigo-600 hover:bg-indigo-600 hover:text-white transition-all duration-300"
            >
              View Full Exam Calendar
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <style jsx>{`
            @keyframes marquee {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }
            .animate-marquee-fast {
              animation: marquee 30s linear infinite;
            }
            .group:hover .group-hover\:pause-marquee {
              animation-play-state: paused;
            }
          `}</style>
      </section>

      {/* Social Proof */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-2 md:px-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-12 text-center">
            Trusted by 50,000+ students
          </h2>

          {/* Mobile: Horizontal scroll carousel */}
          <div className="md:hidden overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 pb-4">
            <div className="flex gap-4">
              {testimonials.map((testimonial, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 snap-center"
                  style={{ width: 'calc(100vw - 64px)' }}
                >
                  <div className="bg-[white] rounded-3xl p-6 border-2 border-[#e2e8f0] shadow-lg h-full">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-slate-700 mb-6 text-sm leading-relaxed italic">
                      "{testimonial.review}"
                    </p>
                    <div className="font-semibold text-slate-900 text-sm">{testimonial.name}</div>
                    <div className="text-xs text-slate-500">{testimonial.exam}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: Grid with arrow navigation */}
          <div className="hidden md:block px-4">
            <div className="relative">
              {/* Left Arrow - Centered with cards */}
              <button
                onClick={() => setReviewsPage(Math.max(0, reviewsPage - 1))}
                disabled={reviewsPage === 0}
                className="absolute -left-8 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-[white] rounded-full shadow-xl hover:shadow-2xl transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 border-2 border-[#e2e8f0] flex items-center justify-center"
              >
                <ChevronLeft className="w-6 h-6 text-slate-800" />
              </button>

              {/* Right Arrow - Centered with cards */}
              <button
                onClick={() => setReviewsPage(Math.min(2, reviewsPage + 1))}
                disabled={reviewsPage === 2}
                className="absolute -right-8 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-[white] rounded-full shadow-xl hover:shadow-2xl transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 border-2 border-[#e2e8f0] flex items-center justify-center"
              >
                <ChevronRight className="w-6 h-6 text-slate-800" />
              </button>

              {/* Testimonial Cards Grid */}
              <div className="grid md:grid-cols-3 gap-8">
                {testimonials.slice(reviewsPage * 3, reviewsPage * 3 + 3).map((testimonial, idx) => (
                  <div key={idx} className="bg-[white] rounded-3xl p-8 border-2 border-[#e2e8f0] hover:shadow-xl transition-shadow">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-6 h-6 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-slate-700 mb-6 text-base leading-relaxed italic">
                      "{testimonial.review}"
                    </p>
                    <div className="font-semibold text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-500">{testimonial.exam}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Full Width */}
      <footer className="bg-slate-100 text-slate-900 py-12 mt-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900">Krakkify</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Smart exam preparation for 60+ Indian competitive exams with AI-powered learning.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4 text-slate-900">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/dashboard" className="text-slate-600 hover:text-slate-900 transition-colors">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="/quiz" className="text-slate-600 hover:text-slate-900 transition-colors">
                    Practice Quiz
                  </a>
                </li>
                <li>
                  <a href="/mock-test" className="text-slate-600 hover:text-slate-900 transition-colors">
                    Mock Tests
                  </a>
                </li>
                <li>
                  <a href="/pricing" className="text-slate-600 hover:text-slate-900 transition-colors">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4 text-slate-900">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button onClick={() => setShowPrivacyModal(true)} className="text-slate-600 hover:text-slate-900 transition-colors text-left">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => setShowTermsModal(true)} className="text-slate-600 hover:text-slate-900 transition-colors text-left">
                    Terms & Conditions
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4 text-slate-900">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/contact" className="text-slate-600 hover:text-slate-900 transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="mailto:support@krakkify.co.in" className="text-slate-600 hover:text-slate-900 transition-colors">
                    support@krakkify.co.in
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-300 pt-6 text-center">
            <p className="text-slate-600 text-sm">
              © {new Date().getFullYear()} Krakkify. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowPrivacyModal(false)}>
          <div className="bg-[white] rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-[white] border-b border-[#e2e8f0] px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-slate-900">Privacy Policy</h2>
              <button onClick={() => setShowPrivacyModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>
            <div className="overflow-y-auto p-6 max-h-[calc(85vh-80px)]">
              <PrivacyPolicyContent />
            </div>
          </div>
        </div>
      )}

      {/* Terms & Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowTermsModal(false)}>
          <div className="bg-[white] rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-[white] border-b border-[#e2e8f0] px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-slate-900">Terms & Conditions</h2>
              <button onClick={() => setShowTermsModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>
            <div className="overflow-y-auto p-6 max-h-[calc(85vh-80px)]">
              <TermsContent />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
