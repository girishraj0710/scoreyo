"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";
import { motion } from "framer-motion";
import {
  Search,
  Sparkles,
  ChevronRight,
  Layers,
  BookOpen,
  Zap,
  TrendingUp,
  Clock,
  Target,
  Award,
  Users,
  Flame,
  Share2,
  X,
  Copy,
  Check,
} from "lucide-react";
import { examCategories } from "@/lib/exams";
import { getHeadersWithCsrf } from "@/lib/csrf-client";
import { InteractiveStarRating } from "@/components/interactive-star-rating";
import { RatingModal } from "@/components/rating-modal";

export default function FlashcardsPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExamId, setSelectedExamId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");

  // Search states and dropdown visibility
  const [examSearch, setExamSearch] = useState("");
  const [subjectSearch, setSubjectSearch] = useState("");
  const [topicSearch, setTopicSearch] = useState("");
  const [showExamDropdown, setShowExamDropdown] = useState(false);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [showTopicDropdown, setShowTopicDropdown] = useState(false);

  // Track if user is actively typing (to enable filtering)
  const [isTypingExam, setIsTypingExam] = useState(false);
  const [isTypingSubject, setIsTypingSubject] = useState(false);
  const [isTypingTopic, setIsTypingTopic] = useState(false);

  // Get all exams from categories
  const allExams = examCategories.flatMap(cat => cat.exams);

  // Get ALL subjects from ALL exams (no dependency on exam selection)
  const allSubjects = allExams.flatMap(exam =>
    exam.subjects.map(subject => ({
      ...subject,
      examName: exam.name,
      examId: exam.id
    }))
  );

  // Get subjects filtered by selected exam (for smart suggestions)
  const smartSubjects = selectedExamId
    ? allSubjects.filter(s => s.examId === selectedExamId)
    : allSubjects;

  // Get ALL topics from ALL subjects
  const allTopics = allSubjects.flatMap(subject =>
    subject.topics.map(topic => ({
      topic,
      subjectName: subject.name,
      subjectId: subject.id,
      examName: subject.examName
    }))
  );

  // Get topics filtered by selected subject (for smart suggestions)
  const smartTopics = selectedSubjectId
    ? allTopics.filter(t => t.subjectId === selectedSubjectId)
    : allTopics;

  // Filter based on search ONLY if user is actively typing
  const filteredExams = (examSearch && isTypingExam)
    ? allExams.filter(exam =>
        exam.name.toLowerCase().includes(examSearch.toLowerCase()) ||
        exam.fullName.toLowerCase().includes(examSearch.toLowerCase())
      )
    : allExams;

  const filteredSubjects = (subjectSearch && isTypingSubject)
    ? smartSubjects.filter(subject =>
        subject.name.toLowerCase().includes(subjectSearch.toLowerCase()) ||
        subject.examName.toLowerCase().includes(subjectSearch.toLowerCase())
      )
    : smartSubjects;

  const filteredTopics = (topicSearch && isTypingTopic)
    ? smartTopics.filter(item =>
        item.topic.toLowerCase().includes(topicSearch.toLowerCase()) ||
        item.subjectName.toLowerCase().includes(topicSearch.toLowerCase())
      )
    : smartTopics;

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-[#F26A4B]/20 border-t-[#F26A4B] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  // Sample decks data (will be replaced with API call)
  const sampleDecks = [
    {
      exam: "UPSC",
      examColor: "#E76F51",
      subject: "Indian Polity",
      topic: "Constitution",
      cards: 6,
      mastered: 4,
      progress: 67,
    },
    {
      exam: "JEE",
      examColor: "#2A9D8F",
      subject: "Physics",
      topic: "Kinematics",
      cards: 6,
      mastered: 3,
      progress: 50,
    },
    {
      exam: "NEET",
      examColor: "#264653",
      subject: "Biology",
      topic: "Cell Biology",
      cards: 8,
      mastered: 5,
      progress: 63,
    },
    {
      exam: "NEET",
      examColor: "#264653",
      subject: "Physics",
      topic: "Optics",
      cards: 8,
      mastered: 2,
      progress: 25,
    },
    {
      exam: "CAT",
      examColor: "#E9C46A",
      subject: "Quantitative Aptitude",
      topic: "Number Systems",
      cards: 10,
      mastered: 7,
      progress: 70,
    },
    {
      exam: "SSC & BANKING",
      examColor: "#F4A261",
      subject: "Reasoning",
      topic: "Logical Reasoning",
      cards: 12,
      mastered: 9,
      progress: 75,
    },
  ];

  const [isGenerating, setIsGenerating] = useState(false);
  const [realDecks, setRealDecks] = useState<any[]>([]);
  const [deckStats, setDeckStats] = useState<any>(null);
  const [deckFilter, setDeckFilter] = useState<'all' | 'mine' | 'popular'>('all');

  // Daily Goal State
  const [dailyGoal, setDailyGoal] = useState<{
    target: number;
    studied: number;
    progress: number;
    goalReached: boolean;
    dueCards: number;
  } | null>(null);

  // Share Modal State
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareDeckData, setShareDeckData] = useState<{
    id: number;
    title: string;
    shareUrl: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Rating Modal State
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [ratingDeckData, setRatingDeckData] = useState<{
    id: number;
    title: string;
    existingRating?: { rating: number; reviewText?: string };
  } | null>(null);

  // Fetch user's decks and daily goal
  useEffect(() => {
    if (user) {
      fetchDecks();
      fetchStats();
      fetchDailyGoal();
    }
  }, [user]);

  const fetchDecks = async () => {
    try {
      console.log('📥 Fetching decks from API...');
      const response = await fetch("/api/flashcards/decks");
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Decks fetched:', data.decks?.length || 0, 'decks');
        console.log('📋 Deck list:', data.decks);
        setRealDecks(data.decks);
      } else {
        console.error('❌ Failed to fetch decks:', response.status);
      }
    } catch (error) {
      console.error("Error fetching decks:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/flashcards/progress");
      if (response.ok) {
        const data = await response.json();
        setDeckStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchDailyGoal = async () => {
    try {
      const response = await fetch("/api/flashcards/daily-goal");
      if (response.ok) {
        const data = await response.json();
        setDailyGoal(data.goal);
      }
    } catch (error) {
      console.error("Error fetching daily goal:", error);
    }
  };

  // Filter decks based on selection
  const filteredDecks = realDecks.filter(deck => {
    if (deckFilter === 'mine') return deck.isMine;
    if (deckFilter === 'popular') return (deck.analytics?.studiesToday || 0) > 5;
    return true;
  });

  // Count deck types
  const myDecksCount = realDecks.filter(d => d.isMine).length;
  const communityDecksCount = realDecks.filter(d => !d.isMine).length;

  const handleShareDeck = async (e: React.MouseEvent, deckId: number, deckTitle: string) => {
    e.stopPropagation(); // Prevent navigation to study page

    try {
      const response = await fetch(`/api/flashcards/share/${deckId}`, {
        method: 'POST',
        headers: getHeadersWithCsrf(),
      });

      if (response.ok) {
        const data = await response.json();
        setShareDeckData({
          id: deckId,
          title: deckTitle,
          shareUrl: data.shareUrl,
        });
        setShareModalOpen(true);
      } else {
        alert('Failed to generate share link');
      }
    } catch (error) {
      console.error('Error sharing deck:', error);
      alert('Failed to share deck');
    }
  };

  const copyShareLink = () => {
    if (shareDeckData) {
      navigator.clipboard.writeText(shareDeckData.shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRateDeck = async (e: React.MouseEvent, deckId: number, deckTitle: string) => {
    e.stopPropagation(); // Prevent navigation to study page

    // Check if user has already rated this deck
    try {
      const response = await fetch(`/api/flashcards/rate/${deckId}`);
      if (response.ok) {
        const data = await response.json();
        setRatingDeckData({
          id: deckId,
          title: deckTitle,
          existingRating: data.hasRated ? {
            rating: data.rating,
            reviewText: data.reviewText,
          } : undefined,
        });
      } else {
        setRatingDeckData({
          id: deckId,
          title: deckTitle,
        });
      }
      setRatingModalOpen(true);
    } catch (error) {
      console.error('Error checking rating:', error);
      setRatingDeckData({
        id: deckId,
        title: deckTitle,
      });
      setRatingModalOpen(true);
    }
  };

  const handleRatingSuccess = () => {
    // Refresh decks to show updated rating
    fetchDecks();
  };

  const handleGenerateDeck = async () => {
    if (!selectedTopic) {
      alert("Please select at least a topic to generate a deck");
      return;
    }

    setIsGenerating(true);

    try {
      const selectedTopicData = allTopics.find(t => t.topic === selectedTopic);

      // Use IDs for database, names for AI prompt
      const examId = selectedExamId || selectedTopicData?.examId || '';
      const subjectId = selectedSubjectId || selectedTopicData?.subjectId || '';
      const examName = examId ? allExams.find(e => e.id === examId)?.name : selectedTopicData?.examName || '';
      const subjectName = subjectId ? allSubjects.find(s => s.id === subjectId)?.name : selectedTopicData?.subjectName || '';

      console.log('📤 Sending to API:', {
        examId,
        subjectId,
        examName,
        subjectName,
        topic: selectedTopic
      });

      const response = await fetch("/api/flashcards/generate", {
        method: "POST",
        headers: getHeadersWithCsrf(),
        body: JSON.stringify({
          examId,        // For database storage
          subjectId,     // For database storage
          exam: examName,     // For AI prompt
          subject: subjectName, // For AI prompt
          topic: selectedTopic,
          cardCount: 15,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Generation response:', data);
        console.log('📦 Deck created:', data.deck);
        console.log('🔑 Deck ID:', data.deck?.id);

        alert(`✅ Generated ${data.cards.length} flashcards for ${selectedTopic}!`);

        // Refresh decks list
        console.log('🔄 Refreshing decks...');
        await fetchDecks();
        await fetchStats();

        // Clear selections
        setSelectedExamId("");
        setSelectedSubjectId("");
        setSelectedTopic("");
        setExamSearch("");
        setSubjectSearch("");
        setTopicSearch("");

        // Navigate to study the new deck
        if (data.deck?.id) {
          console.log('🚀 Navigating to:', `/flashcards/study/${data.deck.id}`);
          router.push(`/flashcards/study/${data.deck.id}`);
        } else {
          console.error('❌ No deck ID in response, staying on page');
          // Just stay on flashcards page to see the new deck
        }
      } else {
        const error = await response.json();
        alert(`❌ Failed to generate deck: ${error.error}`);
      }
    } catch (error) {
      console.error("Error generating deck:", error);
      alert("❌ Failed to generate deck. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-slate-950 px-6 md:px-10 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search any exam, topic, flashcard deck, or mock test..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-16 py-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#F26A4B]/20 focus:border-[#F26A4B]"
            />
            <kbd className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-xs font-mono text-slate-500 dark:text-slate-400">
              ⌘ K
            </kbd>
          </div>
        </div>

        {/* Page Title */}
        <div className="text-center mb-6">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#F26A4B] mb-3">
            FLASHCARDS {user?.preferred_exam && `FOR ${user.preferred_exam.toUpperCase()} STUDENTS`}
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-black text-[#16213E] dark:text-white mb-3">
            Learn from your peers.
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base max-w-2xl mx-auto">
            {myDecksCount > 0 && communityDecksCount > 0
              ? `Your ${myDecksCount} decks + ${communityDecksCount} from other ${user?.preferred_exam?.toUpperCase()} students`
              : "Create decks and discover content from fellow students"}
          </p>
        </div>

        {/* Daily Goal Progress Bar */}
        {dailyGoal && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mb-10"
          >
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-[#F26A4B]" />
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Daily Goal
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {dailyGoal.studied}/{dailyGoal.target}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    cards studied
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${dailyGoal.progress}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className={`absolute left-0 top-0 h-full rounded-full ${
                    dailyGoal.goalReached
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                      : 'bg-gradient-to-r from-[#F26A4B] to-[#E76F51]'
                  }`}
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                {dailyGoal.goalReached ? (
                  <span className="text-green-600 dark:text-green-400 font-semibold flex items-center gap-1">
                    🎉 Goal reached!
                  </span>
                ) : (
                  <span className="text-slate-600 dark:text-slate-400">
                    {dailyGoal.target - dailyGoal.studied} cards to go
                  </span>
                )}
                {dailyGoal.dueCards > 0 && (
                  <span className="text-slate-600 dark:text-slate-400">
                    {dailyGoal.dueCards} due for review
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* AI Deck Generator - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl text-white p-6 md:p-8 mb-12 relative"
          style={{
            background: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
            overflow: 'visible'
          }}
        >
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-[#E76F51] opacity-5 blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] font-bold text-white/50 mb-3">
              <Sparkles className="w-3.5 h-3.5" /> AI DECK GENERATOR
            </div>
            <h2 className="font-heading text-2xl md:text-3xl font-black mb-6 text-white">
              Build a deck on any topic — instantly.
            </h2>

            <div className="flex flex-col md:flex-row gap-3">
              {/* Exam Combobox - Type OR Select */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Type or select exam..."
                  value={examSearch}
                  onChange={(e) => {
                    setExamSearch(e.target.value);
                    setIsTypingExam(true);
                    setShowExamDropdown(true);

                    // If cleared, reset dependent fields
                    if (e.target.value === "") {
                      setSelectedExamId("");
                      setSelectedSubjectId("");
                      setSubjectSearch("");
                      setSelectedTopic("");
                      setTopicSearch("");
                    }
                  }}
                  onFocus={(e) => {
                    setIsTypingExam(false); // Not typing yet, just opened
                    setShowExamDropdown(true);
                  }}
                  onBlur={() => {
                    setTimeout(() => setShowExamDropdown(false), 200);
                    setIsTypingExam(false);
                  }}
                  className="w-full px-5 py-3 rounded-xl bg-[#34495E] border border-slate-600/30 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#E76F51]/30 focus:border-[#E76F51]/50"
                  style={{ color: 'white' }}
                />
                {showExamDropdown && (
                  <div className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto rounded-xl bg-[#2C3E50] border border-slate-600/30 shadow-2xl">
                    {examCategories.map(category => {
                      const categoryExams = filteredExams.filter(exam =>
                        category.exams.some(e => e.id === exam.id)
                      );
                      if (categoryExams.length === 0) return null;
                      return (
                        <div key={category.id}>
                          <div className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                            {category.name}
                          </div>
                          {categoryExams.map(exam => (
                            <button
                              key={exam.id}
                              onClick={() => {
                                setSelectedExamId(exam.id);
                                setExamSearch(exam.name);
                                setShowExamDropdown(false);
                              }}
                              className="w-full px-5 py-2.5 text-left text-white text-sm hover:bg-[#34495E] transition-colors"
                            >
                              {exam.name}
                            </button>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Subject Combobox - Type OR Select */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Type or select subject..."
                  value={subjectSearch}
                  onChange={(e) => {
                    setSubjectSearch(e.target.value);
                    setIsTypingSubject(true);
                    setShowSubjectDropdown(true);

                    // If cleared, reset dependent fields
                    if (e.target.value === "") {
                      setSelectedSubjectId("");
                      setSelectedTopic("");
                      setTopicSearch("");
                    }
                  }}
                  onFocus={(e) => {
                    setIsTypingSubject(false); // Not typing yet, just opened
                    setShowSubjectDropdown(true);
                  }}
                  onBlur={() => {
                    setTimeout(() => setShowSubjectDropdown(false), 200);
                    setIsTypingSubject(false);
                  }}
                  className="w-full px-5 py-3 rounded-xl bg-[#34495E] border border-slate-600/30 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#E76F51]/30 focus:border-[#E76F51]/50"
                  style={{ color: 'white' }}
                />
                {showSubjectDropdown && (
                  <div className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto rounded-xl bg-[#2C3E50] border border-slate-600/30 shadow-2xl">
                    {selectedExamId && (
                      <div className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                        {allExams.find(e => e.id === selectedExamId)?.name} Subjects
                      </div>
                    )}
                    {filteredSubjects.slice(0, 50).map((subject, idx) => (
                      <button
                        key={`${subject.id}-${idx}`}
                        onClick={() => {
                          setSelectedSubjectId(subject.id);
                          setSubjectSearch(subject.name);
                          setShowSubjectDropdown(false);
                          // Auto-set exam if not selected
                          if (!selectedExamId && subject.examId) {
                            setSelectedExamId(subject.examId);
                            setExamSearch(subject.examName);
                          }
                        }}
                        className="w-full px-5 py-2.5 text-left text-white text-sm hover:bg-[#34495E] transition-colors"
                      >
                        {subject.name}
                        {!selectedExamId && (
                          <span className="text-slate-400 text-xs ml-2">({subject.examName})</span>
                        )}
                      </button>
                    ))}
                    {filteredSubjects.length === 0 && (
                      <div className="px-5 py-2.5 text-slate-400 text-sm">No subjects found</div>
                    )}
                  </div>
                )}
              </div>

              {/* Topic Combobox - Type OR Select */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Type or select topic..."
                  value={topicSearch}
                  onChange={(e) => {
                    setTopicSearch(e.target.value);
                    setIsTypingTopic(true);
                    setShowTopicDropdown(true);

                    // If cleared, reset selection
                    if (e.target.value === "") {
                      setSelectedTopic("");
                    }
                  }}
                  onFocus={(e) => {
                    setIsTypingTopic(false); // Not typing yet, just opened
                    setShowTopicDropdown(true);
                  }}
                  onBlur={() => {
                    setTimeout(() => setShowTopicDropdown(false), 200);
                    setIsTypingTopic(false);
                  }}
                  className="w-full px-5 py-3 rounded-xl bg-[#34495E] border border-slate-600/30 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#E76F51]/30 focus:border-[#E76F51]/50"
                  style={{ color: 'white' }}
                />
                {showTopicDropdown && (
                  <div className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto rounded-xl bg-[#2C3E50] border border-slate-600/30 shadow-2xl">
                    {selectedSubjectId && (
                      <div className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                        {allSubjects.find(s => s.id === selectedSubjectId)?.name} Topics
                      </div>
                    )}
                    {filteredTopics.slice(0, 50).map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedTopic(item.topic);
                          setTopicSearch(item.topic);
                          setShowTopicDropdown(false);
                          // Auto-set subject if not selected
                          if (!selectedSubjectId && item.subjectId) {
                            setSelectedSubjectId(item.subjectId);
                            setSubjectSearch(item.subjectName);
                          }
                        }}
                        className="w-full px-5 py-2.5 text-left text-white text-sm hover:bg-[#34495E] transition-colors"
                      >
                        {item.topic}
                        {!selectedSubjectId && (
                          <span className="text-slate-400 text-xs ml-2">
                            ({item.subjectName})
                          </span>
                        )}
                      </button>
                    ))}
                    {filteredTopics.length === 0 && (
                      <div className="px-5 py-2.5 text-slate-400 text-sm">No topics found</div>
                    )}
                  </div>
                )}
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerateDeck}
                disabled={isGenerating || !selectedTopic}
                className="px-6 py-3 rounded-xl bg-[#E76F51] hover:bg-[#D35D42] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate deck
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        {realDecks.length > 0 && (
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setDeckFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  deckFilter === 'all'
                    ? 'bg-[#F26A4B] text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                All Decks ({realDecks.length})
              </button>
              <button
                onClick={() => setDeckFilter('mine')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  deckFilter === 'mine'
                    ? 'bg-[#F26A4B] text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                My Decks ({myDecksCount})
              </button>
              {realDecks.some(d => (d.analytics?.studiesToday || 0) > 5) && (
                <button
                  onClick={() => setDeckFilter('popular')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1 ${
                    deckFilter === 'popular'
                      ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <Flame className="w-4 h-4" />
                  Popular
                </button>
              )}
            </div>
          </div>
        )}

        {/* Deck Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(filteredDecks.length > 0 ? filteredDecks : sampleDecks).map((deck, index) => (
            <motion.div
              key={deck.id || index}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group cursor-pointer"
              onClick={() => deck.id ? router.push(`/flashcards/study/${deck.id}`) : null}
            >
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 hover:border-[#F26A4B]/40 hover:-translate-y-1 hover:shadow-xl transition-all relative overflow-hidden">
                {/* Quarter Circle Decorative Element - Top Right */}
                <div
                  className="absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-15 group-hover:opacity-25 transition-opacity"
                  style={{ backgroundColor: deck.examColor }}
                />

                {/* Content */}
                <div className="relative">
                  {/* Header: Exam Tag + Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <p
                      className="text-[10px] font-bold uppercase tracking-[0.15em] transition-colors"
                      style={{ color: deck.examColor }}
                    >
                      {deck.exam}
                    </p>

                    {deck.isMine ? (
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 rounded text-[10px] font-semibold">
                        You created
                      </span>
                    ) : (deck.analytics?.studiesToday || 0) > 10 ? (
                      <span className="px-2 py-0.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded text-[10px] font-semibold flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        {deck.analytics.studiesToday} today
                      </span>
                    ) : null}
                  </div>

                  {/* Subject Title */}
                  <h3 className="font-heading text-xl font-black text-[#16213E] dark:text-white leading-tight mb-1 group-hover:text-[#E76F51] transition-colors">
                    {deck.subject}
                  </h3>

                  {/* Topic Subtitle */}
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    {deck.topic}
                  </p>

                  {/* Quiz Mistakes Badge */}
                  {deck.sourceType === 'quiz_mistakes' && (
                    <div className="flex items-center gap-2 mb-4">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-orange-100 to-pink-100 dark:from-orange-900/30 dark:to-pink-900/30 text-orange-700 dark:text-orange-300 rounded-lg text-xs font-semibold">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        From Quiz Mistakes
                      </span>
                    </div>
                  )}

                  {/* Creator Info (if not mine) */}
                  {!deck.isMine && deck.creator && (
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#F26A4B] to-[#E76F51] flex items-center justify-center text-white text-xs font-bold">
                        {deck.creator.name?.[0] || '?'}
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        by @{deck.creator.username}
                      </span>
                    </div>
                  )}

                  {/* Rating Display & Rate Button */}
                  {deck.id && !deck.isMine && (
                    <div className="flex items-center justify-between mb-4">
                      {/* Average Rating */}
                      {(deck.averageRating || 0) > 0 ? (
                        <div className="flex items-center gap-2">
                          <InteractiveStarRating
                            rating={deck.averageRating || 0}
                            readonly
                            size="sm"
                          />
                          <span className="text-xs text-slate-600 dark:text-slate-400">
                            {deck.averageRating?.toFixed(1)} ({deck.ratingCount || 0})
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          No ratings yet
                        </span>
                      )}

                      {/* Rate Button */}
                      <button
                        onClick={(e) => handleRateDeck(e, deck.id, deck.title || `${deck.subject} - ${deck.topic}`)}
                        className="text-xs font-semibold text-[#F26A4B] hover:text-[#E76F51] transition-colors"
                      >
                        Rate this deck
                      </button>
                    </div>
                  )}

                  {/* Bottom Row: Cards count + Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {deck.cards} cards
                    </span>

                    <div className="flex items-center gap-3">
                      {/* Engagement */}
                      {(deck.analytics?.uniqueStudents || 0) > 0 && (
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-slate-500" />
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {deck.analytics.uniqueStudents}
                          </span>
                        </div>
                      )}

                      {/* Share button (only for user's decks) */}
                      {deck.isMine && deck.id && (
                        <button
                          onClick={(e) => handleShareDeck(e, deck.id, deck.title || `${deck.subject} - ${deck.topic}`)}
                          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Share this deck"
                        >
                          <Share2 className="w-4 h-4 text-slate-500 hover:text-[#E76F51]" />
                        </button>
                      )}

                      {/* Study button */}
                      <div className="flex items-center gap-1 text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-[#E76F51] transition-colors">
                        Study <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 text-center">
            <div className="w-11 h-11 rounded-lg bg-[#F26A4B]/10 flex items-center justify-center mx-auto mb-3">
              <Zap className="w-5 h-5 text-[#F26A4B]" />
            </div>
            <div className="text-2xl font-bold font-mono text-[#16213E] dark:text-white mb-1">
              {deckStats?.cards_studied_today || 0}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Cards studied today
            </div>
          </div>

          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 text-center">
            <div className="w-11 h-11 rounded-lg bg-[#2A9D8F]/10 flex items-center justify-center mx-auto mb-3">
              <Award className="w-5 h-5 text-[#2A9D8F]" />
            </div>
            <div className="text-2xl font-bold font-mono text-[#16213E] dark:text-white mb-1">
              {deckStats?.cards_mastered || 0}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Cards mastered
            </div>
          </div>

          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 text-center">
            <div className="w-11 h-11 rounded-lg bg-[#E9C46A]/10 flex items-center justify-center mx-auto mb-3">
              <Target className="w-5 h-5 text-[#E9C46A]" />
            </div>
            <div className="text-2xl font-bold font-mono text-[#16213E] dark:text-white mb-1">
              {deckStats?.accuracy_rate || 0}%
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Accuracy rate
            </div>
          </div>
        </div>

        {/* Share Modal */}
        {shareModalOpen && shareDeckData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
                  Share Deck
                </h3>
                <button
                  onClick={() => setShareModalOpen(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Deck Title */}
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                {shareDeckData.title}
              </p>

              {/* Share URL */}
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mb-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  Share Link
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={shareDeckData.shareUrl}
                    readOnly
                    className="flex-1 text-sm text-slate-900 dark:text-white bg-transparent border-none focus:outline-none"
                  />
                  <button
                    onClick={copyShareLink}
                    className="px-3 py-2 bg-[#F26A4B] hover:bg-[#E76F51] text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Share Options */}
              <div className="space-y-2">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  Or share via
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`Check out this flashcard deck: ${shareDeckData.title}\n${shareDeckData.shareUrl}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 bg-[#25D366] hover:bg-[#1DA851] text-white rounded-lg text-sm font-semibold text-center transition-colors"
                  >
                    WhatsApp
                  </a>

                  {/* Telegram */}
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(shareDeckData.shareUrl)}&text=${encodeURIComponent(shareDeckData.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 bg-[#0088cc] hover:bg-[#0077b5] text-white rounded-lg text-sm font-semibold text-center transition-colors"
                  >
                    Telegram
                  </a>
                </div>
              </div>

              {/* Close */}
              <button
                onClick={() => setShareModalOpen(false)}
                className="w-full mt-4 px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-lg text-sm font-semibold transition-colors"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}

        {/* Rating Modal */}
        {ratingModalOpen && ratingDeckData && (
          <RatingModal
            deckId={ratingDeckData.id}
            deckTitle={ratingDeckData.title}
            existingRating={ratingDeckData.existingRating}
            onClose={() => setRatingModalOpen(false)}
            onSuccess={handleRatingSuccess}
          />
        )}
      </div>
    </div>
  );
}
