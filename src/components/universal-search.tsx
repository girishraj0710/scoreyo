"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X, BookOpen, FileText, Zap, Clock } from "lucide-react";

interface SearchResult {
  id: string;
  type: "topic" | "quiz" | "study-guide" | "flashcard";
  title: string;
  subtitle?: string;
  category: string;
  href: string;
  icon: any;
}

// Recommended items (shown when search is empty)
const RECOMMENDED_ITEMS: SearchResult[] = [
  {
    id: "1",
    type: "topic",
    title: "English Grammar Fundamentals",
    subtitle: "Foundation Path • 43 topics",
    category: "Learn English",
    href: "/learn/english/foundation",
    icon: BookOpen,
  },
  {
    id: "2",
    type: "quiz",
    title: "JEE Physics - Mechanics",
    subtitle: "100 questions • 120 min",
    category: "JEE Main",
    href: "/quiz/jee-physics-mechanics",
    icon: FileText,
  },
  {
    id: "3",
    type: "study-guide",
    title: "UPSC History - Modern India",
    subtitle: "Complete syllabus coverage",
    category: "UPSC CSE",
    href: "/study-guides/upsc-history",
    icon: BookOpen,
  },
  {
    id: "4",
    type: "quiz",
    title: "SSC CGL Quantitative Aptitude",
    subtitle: "50 questions • 60 min",
    category: "SSC CGL",
    href: "/quiz/ssc-cgl-quant",
    icon: Zap,
  },
  {
    id: "5",
    type: "topic",
    title: "NEET Biology - Cell Structure",
    subtitle: "Study + Practice Questions",
    category: "NEET",
    href: "/study-guides/neet-biology-cell",
    icon: BookOpen,
  },
  {
    id: "6",
    type: "flashcard",
    title: "Banking Awareness - Current Affairs",
    subtitle: "200 flashcards",
    category: "Banking",
    href: "/flashcards/banking-current-affairs",
    icon: Zap,
  },
];

export function UniversalSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Keyboard shortcut (Ctrl+K / Cmd+K)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      // Escape to close
      if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Search functionality (will integrate with API later)
  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    // Mock search (will replace with actual API call)
    const filtered = RECOMMENDED_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setResults(filtered);
  };

  // Handle input change with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle selecting a result
  const handleSelectResult = (result: SearchResult) => {
    // Save to recent searches
    const updated = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));

    // Navigate
    router.push(result.href);
    setIsOpen(false);
    setQuery("");
  };

  // Handle clicking on search input (show recommendations)
  const handleInputClick = () => {
    setIsOpen(true);
  };

  // Clear search
  const handleClear = () => {
    setQuery("");
    setResults([]);
    inputRef.current?.focus();
  };

  const displayItems = query.trim() ? results : RECOMMENDED_ITEMS;
  const headerText = query.trim()
    ? `${results.length} results for "${query}"`
    : "Recommended for you";

  return (
    <div className="relative flex-1 max-w-2xl mx-auto" ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border-2 border-transparent focus-within:border-[#E76F51] dark:focus-within:border-[#E76F51] transition-all">
          <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClick={handleInputClick}
            placeholder="Search for topics, quizzes, study guides..."
            className="bg-transparent border-none outline-none flex-1 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm"
          />
          {query && (
            <button
              onClick={handleClear}
              className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          )}
        </div>

        {/* Keyboard shortcut hint */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1 text-xs text-slate-400 pointer-events-none">
          <kbd className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">
            Ctrl
          </kbd>
          <span>+</span>
          <kbd className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">
            K
          </kbd>
        </div>
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[500px] overflow-hidden z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {headerText}
            </p>
          </div>

          {/* Results List */}
          <div className="overflow-y-auto max-h-[420px]">
            {displayItems.length > 0 ? (
              <div className="py-2">
                {displayItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectResult(item)}
                    className="w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left group"
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-[#E76F51]/10 dark:group-hover:bg-[#E76F51]/20 transition-colors">
                      <item.icon className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-[#E76F51] transition-colors" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-[#E76F51] transition-colors">
                        {item.title}
                      </h4>
                      {item.subtitle && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Category Badge */}
                    <div className="flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        {item.category}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <Search className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  No results found for "{query}"
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  Try searching for topics, exams, or subjects
                </p>
              </div>
            )}
          </div>

          {/* Footer - View all results */}
          {query.trim() && results.length > 0 && (
            <div className="border-t border-slate-200 dark:border-slate-800 p-3">
              <button
                onClick={() => {
                  router.push(`/search?q=${encodeURIComponent(query)}`);
                  setIsOpen(false);
                }}
                className="w-full py-2 text-sm font-semibold text-[#E76F51] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                View all {results.length} results →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
