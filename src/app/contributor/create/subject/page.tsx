"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/context/user-context";
import { examCategories, getExamById } from "@/lib/exams";
import { ArrowRight, BookOpen, CheckCircle, Search, X } from "lucide-react";
import { ColorfulSubjectIcon, ColorfulExamIcon } from "@/lib/colorful-exam-icons";
import { isAdmin } from "@/lib/admin";
import { Icon3DBook, Icon3DGraduationCap, Icon3DRocket, Icon3DTarget, Icon3DTrophy, Icon3DChart, Icon3DNotebook } from "@/components/premium-3d-icons";

function SelectSubjectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading } = useUser();
  const examId = searchParams.get("examId");
  const [subjectSearch, setSubjectSearch] = useState('');
  const isMountedRef = useRef(false);

  // Check if user is contributor or admin
  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      return;
    }

    if (!isLoading && user && !isAdmin(user.role, user.email) && !['contributor'].includes(user.role || 'student')) {
      router.push('/');
    }
  }, [user, isLoading]);

  useEffect(() => {
    if (!examId) {
      router.push('/contributor/create');
    }
  }, [examId, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
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

  const exam = getExamById(examId || '');

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <div className="text-center">
          <p className="mb-4" style={{ color: "var(--foreground-secondary)" }}>Exam not found</p>
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

  // Get appropriate icon based on exam category
  const getExamIcon = (category: string) => {
    const iconMap: Record<string, React.ComponentType<{size?: number}>> = {
      'engineering': Icon3DRocket,
      'medical': Icon3DGraduationCap,
      'civil-services': Icon3DTrophy,
      'government': Icon3DTarget,
      'banking': Icon3DChart,
      'banking-ssc': Icon3DChart,
      'law': Icon3DBook,
      'management': Icon3DChart,
      'mba': Icon3DChart,
      'defence': Icon3DTarget,
      'defense': Icon3DTarget,
      'teaching': Icon3DGraduationCap,
      'railways': Icon3DRocket,
      'police': Icon3DTarget,
      'state': Icon3DTrophy,
      'state-psc': Icon3DTrophy,
    };
    const IconComponent = iconMap[category] || Icon3DNotebook;
    return <IconComponent size={72} />;
  };

  const handleSubjectSelect = (subjectId: string) => {
    router.push(`/contributor/create/upload?examId=${examId}&subjectId=${subjectId}`);
  };

  return (
    <div className="min-h-screen pt-8 pb-12 px-4" style={{ background: "var(--background)" }}>
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
          <h1 className="text-4xl font-bold mb-3" style={{ color: "var(--foreground)" }}>
            Create Question Set
          </h1>
          <p className="text-lg" style={{ color: "var(--foreground-secondary)" }}>
            Step 2 of 3: Select the subject for <span className="font-semibold text-indigo-600">{exam.name}</span>
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-600 text-white font-bold text-sm flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
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
            <div className="flex-1 h-1" style={{ background: "var(--card-border)" }}></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full font-bold text-sm flex items-center justify-center" style={{ background: "var(--hover-bg)", color: "var(--foreground)" }}>
                3
              </div>
              <span style={{ color: "var(--muted)" }}>Upload & Generate</span>
            </div>
          </div>
        </div>

        {/* Selected Exam Summary */}
        <div className="rounded-xl p-6 mb-8" style={{ background: "var(--background)", borderColor: "#818cf8", borderWidth: "2px", borderStyle: "solid" }}>
          <div className="flex items-center gap-4">
            {getExamIcon(exam.category)}
            <div>
              <div className="text-sm text-indigo-600 font-medium mb-1">Selected Exam</div>
              <div className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>{exam.name}</div>
              <div className="text-sm mt-1" style={{ color: "var(--foreground-secondary)" }}>{exam.fullName}</div>
            </div>
          </div>
        </div>

        {/* Subject Grid */}
        <section>
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--foreground)" }}>Choose Subject</h2>

          {/* Search Input */}
          <div className="mb-6 relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5" style={{ color: "var(--muted)" }} />
            <input
              type="text"
              placeholder="Search subjects..."
              value={subjectSearch}
              onChange={(e) => setSubjectSearch(e.target.value)}
              className="w-full pl-12 pr-10 py-3 rounded-lg border-2 focus:outline-none focus:border-indigo-600 placeholder-opacity-50"
              style={{
                borderColor: "var(--card-border)",
                background: "var(--card-bg)",
                color: "var(--foreground)"
              }}
            />
            {subjectSearch && (
              <button
                onClick={() => setSubjectSearch('')}
                className="absolute right-3 top-3.5 hover:opacity-70"
                style={{ color: "var(--muted)" }}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Filtered Subjects */}
          {exam.subjects.filter(s => s.name.toLowerCase().includes(subjectSearch.toLowerCase())).length === 0 ? (
            <div className="text-center py-12">
              <p style={{ color: "var(--muted)" }}>No subjects found matching "{subjectSearch}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {exam.subjects
                .filter(s => s.name.toLowerCase().includes(subjectSearch.toLowerCase()))
                .map((subject) => (
                  <button
                    key={subject.id}
                    onClick={() => handleSubjectSelect(subject.id)}
                    className="p-6 rounded-xl transition-all text-center group min-h-[160px] flex flex-col items-center justify-center"
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
                    <div className="flex justify-center mb-3">
                      <ColorfulSubjectIcon subjectId={subject.id} size={56} />
                    </div>
                    <div className="text-base font-semibold group-hover:text-indigo-600 mb-2" style={{ color: "var(--foreground)" }}>
                      {subject.name}
                    </div>
                    <div className="text-xs mb-3" style={{ color: "var(--muted)" }}>
                      {subject.topics.length} topics
                    </div>
                    <div className="flex items-center gap-2 text-indigo-600 font-medium text-sm group-hover:gap-3 transition-all">
                      Select <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>
                ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function SelectSubjectPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
          <p style={{ color: "var(--foreground-secondary)" }}>Loading...</p>
        </div>
      </div>
    }>
      <SelectSubjectContent />
    </Suspense>
  );
}
