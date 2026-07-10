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
} from "lucide-react";
import { examCategories } from "@/lib/exams";
import { getHeadersWithCsrf } from "@/lib/csrf-client";

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

  // Fetch user's decks
  useEffect(() => {
    if (user) {
      fetchDecks();
      fetchStats();
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
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#F26A4B] mb-3">
            FLASHCARDS
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-black text-[#16213E] dark:text-white mb-3">
            Memorize like a topper.
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base max-w-2xl mx-auto">
            Flip. Rate. Repeat. Or let AI generate a personalised deck on any topic in seconds.
          </p>
        </div>

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

        {/* Deck Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(realDecks.length > 0 ? realDecks : sampleDecks).map((deck, index) => (
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
                  {/* Exam Tag */}
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2 transition-colors"
                    style={{ color: deck.examColor }}
                  >
                    {deck.exam}
                  </p>

                  {/* Subject Title */}
                  <h3 className="font-heading text-xl font-black text-[#16213E] dark:text-white leading-tight mb-1 group-hover:text-[#E76F51] transition-colors">
                    {deck.subject}
                  </h3>

                  {/* Topic Subtitle */}
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                    {deck.topic}
                  </p>

                  {/* Bottom Row: Cards count + Study link */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {deck.cards} cards
                    </span>
                    <div className="flex items-center gap-1 text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-[#E76F51] transition-colors">
                      Study <ChevronRight className="w-4 h-4" />
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
      </div>
    </div>
  );
}
