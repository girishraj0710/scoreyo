"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";
import { examCategories } from "@/lib/exams";
import { ArrowRight, Sparkles, Search, X } from "lucide-react";
import { ColorfulExamIcon, ColorfulCategoryIcon } from "@/lib/colorful-exam-icons";
import { isAdmin } from "@/lib/admin";
import { PremiumIcon } from "@/components/premium-icon";

export default function CreateQuestionSelectExamPage() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [examSearch, setExamSearch] = useState('');

  // Check if user is contributor or admin
  useEffect(() => {
    if (!isLoading && user && !isAdmin(user.role, user.email) && !['contributor'].includes(user.role || 'student')) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--primary-bg)" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
          <p style={{ color: "var(--foreground-secondary)" }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || (!isAdmin(user.role, user.email) && !['contributor'].includes(user.role || 'student'))) {
    return null;
  }

  const handleExamSelect = (examId: string) => {
    router.push(`/contributor/create/subject?examId=${examId}`);
  };

  return (
    <div className="min-h-screen pt-8 pb-12 px-4" style={{ background: "var(--primary-bg)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <a
              href="/contributor"
              className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1"
            >
              ← Back to Portal
            </a>
          </div>
          <h1 className="text-4xl font-bold mb-3" style={{ color: "var(--foreground)" }}>
            Create Question Set
          </h1>
          <p className="text-lg" style={{ color: "var(--foreground-secondary)" }}>
            Step 1 of 3: Select the exam for your questions
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">
                1
              </div>
              <span className="font-semibold text-indigo-600">Select Exam</span>
            </div>
            <div className="flex-1 h-1" style={{ background: "var(--card-border)" }}></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full text-slate-400 font-bold text-sm flex items-center justify-center" style={{ background: "var(--muted)", color: "var(--muted)" }}>
                2
              </div>
              <span style={{ color: "var(--muted)" }}>Select Subject</span>
            </div>
            <div className="flex-1 h-1" style={{ background: "var(--card-border)" }}></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full text-slate-400 font-bold text-sm flex items-center justify-center" style={{ background: "var(--muted)", color: "var(--muted)" }}>
                3
              </div>
              <span style={{ color: "var(--muted)" }}>Upload & Generate</span>
            </div>
          </div>
        </div>

        {/* Category Selection (Optional - for better UX) */}
        {!selectedCategory && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4" style={{ color: "var(--foreground)" }}>Choose Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {examCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className="p-4 rounded-xl text-center transition-all min-h-[140px]"
                  style={{
                    background: "var(--card-bg)",
                    borderColor: "var(--card-border)",
                    borderWidth: "2px",
                    borderStyle: "solid"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#818cf8";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--card-border)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div className="flex justify-center mb-2">
                    <ColorfulCategoryIcon
                      categoryId={category.id}
                      size={56}
                    />
                  </div>
                  <div className="text-sm font-medium leading-tight" style={{ color: "var(--foreground)" }}>
                    {category.name}
                  </div>
                  <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                    {category.exams.length} exam{category.exams.length > 1 ? "s" : ""}
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Exam Grid */}
        {selectedCategory && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
                {examCategories.find(c => c.id === selectedCategory)?.name} Exams
              </h2>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setExamSearch('');
                }}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                ← Change Category
              </button>
            </div>

            {/* Search Input */}
            <div className="mb-6 relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5" style={{ color: "var(--muted)" }} />
              <input
                type="text"
                placeholder="Search exams..."
                value={examSearch}
                onChange={(e) => setExamSearch(e.target.value)}
                className="w-full pl-12 pr-10 py-3 rounded-lg border-2 focus:outline-none focus:border-indigo-600 placeholder-opacity-50"
                style={{
                  borderColor: "var(--card-border)",
                  background: "var(--card-bg)",
                  color: "var(--foreground)"
                }}
              />
              {examSearch && (
                <button
                  onClick={() => setExamSearch('')}
                  className="absolute right-3 top-3.5 hover:opacity-70"
                  style={{ color: "var(--muted)" }}
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Filtered Exams */}
            {examCategories
              .find((c) => c.id === selectedCategory)
              ?.exams.filter(e => e.name.toLowerCase().includes(examSearch.toLowerCase())).length === 0 ? (
              <div className="text-center py-12">
                <p style={{ color: "var(--muted)" }}>No exams found matching "{examSearch}"</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {examCategories
                  .find((c) => c.id === selectedCategory)
                  ?.exams.filter(e => e.name.toLowerCase().includes(examSearch.toLowerCase()))
                  .map((exam) => (
                    <button
                      key={exam.id}
                      onClick={() => handleExamSelect(exam.id)}
                      className="p-6 rounded-xl transition-all text-left group"
                      style={{
                        background: "var(--card-bg)",
                        borderColor: "var(--card-border)",
                        borderWidth: "2px",
                        borderStyle: "solid"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#6366f1";
                        e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--card-border)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-16 h-16 flex items-center justify-center shrink-0">
                          <ColorfulExamIcon examId={exam.id} size={48} />
                        </div>
                        <div className="flex-1">
                          <div className="text-lg font-semibold group-hover:text-indigo-600" style={{ color: "var(--foreground)" }}>
                            {exam.name}
                          </div>
                          <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                            {exam.fullName}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs mb-3" style={{ color: "var(--muted)" }}>
                        {exam.subjects.length} subjects | {exam.subjects.reduce((sum, s) => sum + s.topics.length, 0)} topics
                      </div>
                      <div className="flex items-center gap-2 text-indigo-600 font-medium text-sm group-hover:gap-3 transition-all">
                        Select Exam <ArrowRight className="w-4 h-4" />
                      </div>
                    </button>
                  ))}
              </div>
            )}
          </section>
        )}

        {/* Show all exams if no category selected */}
        {!selectedCategory && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>Or Browse All Exams</h2>
            </div>

            {/* Search Input */}
            <div className="mb-6 relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5" style={{ color: "var(--muted)" }} />
              <input
                type="text"
                placeholder="Search all exams..."
                value={examSearch}
                onChange={(e) => setExamSearch(e.target.value)}
                className="w-full pl-12 pr-10 py-3 rounded-lg border-2 focus:outline-none focus:border-indigo-600 placeholder-opacity-50"
                style={{
                  borderColor: "var(--card-border)",
                  background: "var(--card-bg)",
                  color: "var(--foreground)"
                }}
              />
              {examSearch && (
                <button
                  onClick={() => setExamSearch('')}
                  className="absolute right-3 top-3.5 hover:opacity-70"
                  style={{ color: "var(--muted)" }}
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Filtered All Exams */}
            {examCategories
              .flatMap(cat => cat.exams)
              .filter(e => e.name.toLowerCase().includes(examSearch.toLowerCase())).length === 0 ? (
              <div className="text-center py-12">
                <p style={{ color: "var(--muted)" }}>No exams found matching "{examSearch}"</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {examCategories
                  .flatMap(cat => cat.exams)
                  .filter(e => e.name.toLowerCase().includes(examSearch.toLowerCase()))
                  .map((exam) => (
                    <button
                      key={exam.id}
                      onClick={() => handleExamSelect(exam.id)}
                      className="p-6 rounded-xl transition-all text-left group"
                      style={{
                        background: "var(--card-bg)",
                        borderColor: "var(--card-border)",
                        borderWidth: "2px",
                        borderStyle: "solid"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#6366f1";
                        e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--card-border)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-16 h-16 flex items-center justify-center shrink-0">
                          <ColorfulExamIcon examId={exam.id} size={48} />
                        </div>
                        <div className="flex-1">
                          <div className="text-lg font-semibold group-hover:text-indigo-600" style={{ color: "var(--foreground)" }}>
                            {exam.name}
                          </div>
                          <div className="text-xs mt-1 line-clamp-1" style={{ color: "var(--muted)" }}>
                            {exam.fullName}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs mb-3" style={{ color: "var(--muted)" }}>
                        {exam.subjects.length} subjects | {exam.subjects.reduce((sum, s) => sum + s.topics.length, 0)} topics
                      </div>
                      <div className="flex items-center gap-2 text-indigo-600 font-medium text-sm group-hover:gap-3 transition-all">
                        Select Exam <ArrowRight className="w-4 h-4" />
                      </div>
                    </button>
                  ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
