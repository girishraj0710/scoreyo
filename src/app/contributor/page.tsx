"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";
import { ArrowRight, Zap, Sparkles, FileText, BarChart3, GraduationCap, Rocket, Award, Target } from "lucide-react";
import Link from "next/link";
import { isAdmin } from "@/lib/admin";

export default function ContributorPortalPage() {
  const router = useRouter();
  const { user, isLoading } = useUser();

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
          <p className="text-slate-600">Loading contributor portal...</p>
        </div>
      </div>
    );
  }

  if (!user || (!isAdmin(user.role, user.email) && !['contributor'].includes(user.role || 'student'))) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white pt-8 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Target className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900">
              Contributor Portal
            </h1>
          </div>
          <p className="text-lg text-slate-600">
            Create and submit verified questions to help students succeed
          </p>
        </div>

        {/* Quick Actions - Large Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Link
            href="/contributor/create"
            className="group p-8 rounded-2xl border-2 border-slate-200 bg-white hover:border-indigo-400 hover:shadow-xl transition-all"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600">
              Create Question Set
            </h3>
            <p className="text-slate-600 text-sm mb-4">
              Upload study material and generate AI-powered questions
            </p>
            <div className="flex items-center gap-2 text-indigo-600 font-medium">
              Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/contributor/submissions"
            className="group p-8 rounded-2xl border-2 border-slate-200 bg-white hover:border-indigo-400 hover:shadow-xl transition-all"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600">
              My Submissions
            </h3>
            <p className="text-slate-600 text-sm mb-4">
              Track your submitted questions and approval status
            </p>
            <div className="flex items-center gap-2 text-indigo-600 font-medium">
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/contributor/stats"
            className="group p-8 rounded-2xl border-2 border-slate-200 bg-white hover:border-indigo-400 hover:shadow-xl transition-all"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600">
              Contribution Stats
            </h3>
            <p className="text-slate-600 text-sm mb-4">
              View your contribution analytics and points
            </p>
            <div className="flex items-center gap-2 text-indigo-600 font-medium">
              See Stats <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* How It Works */}
        <div className="rounded-2xl border-2 border-slate-200 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-7 h-7 text-yellow-500" />
            <h2 className="text-2xl font-bold text-slate-900">How It Works</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-indigo-600">1</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Select Exam</h3>
              <p className="text-sm text-slate-600">
                Choose from JEE, NEET, UPSC, and 20+ exams
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-indigo-600">2</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Select Subject</h3>
              <p className="text-sm text-slate-600">
                Pick the subject for your questions
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-indigo-600">3</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Upload Material</h3>
              <p className="text-sm text-slate-600">
                Upload PDF, DOCX, or paste text from your notes
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">AI Generates</h3>
              <p className="text-sm text-slate-600">
                Questions are created and submitted for review
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border-2 border-slate-200 rounded-xl p-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-3 shadow-md">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Help Students</h3>
            <p className="text-sm text-slate-600">
              Your questions help thousands of students prepare for their exams
            </p>
          </div>

          <div className="border-2 border-slate-200 rounded-xl p-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-3 shadow-md">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Earn Points</h3>
            <p className="text-sm text-slate-600">
              Get contribution points for every approved question
            </p>
          </div>

          <div className="border-2 border-slate-200 rounded-xl p-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-3 shadow-md">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Build Reputation</h3>
            <p className="text-sm text-slate-600">
              Top contributors get featured and special badges
            </p>
          </div>
        </div>

        {/* Guidelines */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-3">💡 Quality Guidelines</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">✓</span>
              <span>Upload relevant, accurate study material from trusted sources</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">✓</span>
              <span>Ensure content matches the selected exam and subject</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">✓</span>
              <span>More content = better question quality (aim for 500+ words)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">✓</span>
              <span>Questions go through admin review before being published</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
