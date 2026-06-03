"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";
import { examCategories } from "@/lib/exams";
import { ArrowRight } from "lucide-react";
import { ColorfulExamIcon, ColorfulCategoryIcon } from "@/lib/colorful-exam-icons";
import { isAdmin } from "@/lib/admin";

export default function CreateQuestionSelectExamPage() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Check if user is contributor or admin
  useEffect(() => {
    if (!isLoading && user && !isAdmin(user.role, user.email) && !['contributor'].includes(user.role || 'student')) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
          <p className="text-slate-600">Loading...</p>
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
    <div className="min-h-screen bg-white pt-8 pb-12 px-4">
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
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Create Question Set
          </h1>
          <p className="text-lg text-slate-600">
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
            <div className="flex-1 h-1 bg-slate-200"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-400 font-bold text-sm flex items-center justify-center">
                2
              </div>
              <span className="text-slate-400">Select Subject</span>
            </div>
            <div className="flex-1 h-1 bg-slate-200"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-400 font-bold text-sm flex items-center justify-center">
                3
              </div>
              <span className="text-slate-400">Upload & Generate</span>
            </div>
          </div>
        </div>

        {/* Category Selection (Optional - for better UX) */}
        {!selectedCategory && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Choose Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {examCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className="p-4 rounded-xl border-2 text-center border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md transition-all min-h-[140px]"
                >
                  <div className="flex justify-center mb-2">
                    <ColorfulCategoryIcon
                      categoryId={category.id}
                      size={56}
                    />
                  </div>
                  <div className="text-sm font-medium text-slate-700 leading-tight">
                    {category.name}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">
                {examCategories.find(c => c.id === selectedCategory)?.name} Exams
              </h2>
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                ← Change Category
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {examCategories
                .find((c) => c.id === selectedCategory)
                ?.exams.map((exam) => (
                  <button
                    key={exam.id}
                    onClick={() => handleExamSelect(exam.id)}
                    className="p-6 rounded-xl border-2 border-slate-200 bg-white hover:border-indigo-500 hover:shadow-lg transition-all text-left group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-16 h-16 flex items-center justify-center shrink-0">
                        <ColorfulExamIcon examId={exam.id} size={48} />
                      </div>
                      <div className="flex-1">
                        <div className="text-lg font-semibold text-slate-800 group-hover:text-indigo-600">
                          {exam.name}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {exam.fullName}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 mb-3">
                      {exam.subjects.length} subjects | {exam.subjects.reduce((sum, s) => sum + s.topics.length, 0)} topics
                    </div>
                    <div className="flex items-center gap-2 text-indigo-600 font-medium text-sm group-hover:gap-3 transition-all">
                      Select Exam <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>
                ))}
            </div>
          </section>
        )}

        {/* Show all exams if no category selected */}
        {!selectedCategory && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Or Browse All Exams</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {examCategories.flatMap(cat => cat.exams).map((exam) => (
                <button
                  key={exam.id}
                  onClick={() => handleExamSelect(exam.id)}
                  className="p-6 rounded-xl border-2 border-slate-200 bg-white hover:border-indigo-500 hover:shadow-lg transition-all text-left group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-16 h-16 flex items-center justify-center shrink-0">
                      <ColorfulExamIcon examId={exam.id} size={48} />
                    </div>
                    <div className="flex-1">
                      <div className="text-lg font-semibold text-slate-800 group-hover:text-indigo-600">
                        {exam.name}
                      </div>
                      <div className="text-xs text-slate-500 mt-1 line-clamp-1">
                        {exam.fullName}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 mb-3">
                    {exam.subjects.length} subjects | {exam.subjects.reduce((sum, s) => sum + s.topics.length, 0)} topics
                  </div>
                  <div className="flex items-center gap-2 text-indigo-600 font-medium text-sm group-hover:gap-3 transition-all">
                    Select Exam <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
