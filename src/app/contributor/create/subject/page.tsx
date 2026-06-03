"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/context/user-context";
import { examCategories, getExamById } from "@/lib/exams";
import { ArrowRight } from "lucide-react";
import { ColorfulSubjectIcon } from "@/lib/colorful-exam-icons";
import { isAdmin } from "@/lib/admin";

function SelectSubjectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading } = useUser();
  const examId = searchParams.get("examId");

  // Check if user is contributor or admin
  useEffect(() => {
    if (!isLoading && user && !isAdmin(user.role, user.email) && !['contributor'].includes(user.role || 'student')) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!examId) {
      router.push('/contributor/create');
    }
  }, [examId, router]);

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

  const exam = getExamById(examId || '');

  if (!exam) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Exam not found</p>
          <button
            onClick={() => router.push('/contributor/create')}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← Back to exam selection
          </button>
        </div>
      </div>
    );
  }

  const handleSubjectSelect = (subjectId: string) => {
    router.push(`/contributor/create/upload?examId=${examId}&subjectId=${subjectId}`);
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => router.push('/contributor/create')}
              className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1"
            >
              ← Back to Exams
            </button>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Create Question Set
          </h1>
          <p className="text-lg text-slate-600">
            Step 2 of 3: Select the subject for <span className="font-semibold text-indigo-600">{exam.name}</span>
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-600 text-white font-bold text-sm flex items-center justify-center">
                ✓
              </div>
              <span className="font-semibold text-green-600">Select Exam</span>
            </div>
            <div className="flex-1 h-1 bg-green-600"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">
                2
              </div>
              <span className="font-semibold text-indigo-600">Select Subject</span>
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

        {/* Selected Exam Summary */}
        <div className="bg-indigo-50 rounded-xl border-2 border-indigo-200 p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="text-5xl">{exam.icon}</div>
            <div>
              <div className="text-sm text-indigo-600 font-medium mb-1">Selected Exam</div>
              <div className="text-2xl font-bold text-slate-900">{exam.name}</div>
              <div className="text-sm text-slate-500 mt-1">{exam.fullName}</div>
            </div>
          </div>
        </div>

        {/* Subject Grid */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Choose Subject</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {exam.subjects.map((subject) => (
              <button
                key={subject.id}
                onClick={() => handleSubjectSelect(subject.id)}
                className="p-6 rounded-xl border-2 border-slate-200 bg-white hover:border-indigo-500 hover:shadow-lg transition-all text-center group min-h-[160px] flex flex-col items-center justify-center"
              >
                <div className="flex justify-center mb-3">
                  <ColorfulSubjectIcon subjectId={subject.id} size={56} />
                </div>
                <div className="text-base font-semibold text-slate-800 group-hover:text-indigo-600 mb-2">
                  {subject.name}
                </div>
                <div className="text-xs text-slate-400 mb-3">
                  {subject.topics.length} topics
                </div>
                <div className="flex items-center gap-2 text-indigo-600 font-medium text-sm group-hover:gap-3 transition-all">
                  Select <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function SelectSubjectPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    }>
      <SelectSubjectContent />
    </Suspense>
  );
}
