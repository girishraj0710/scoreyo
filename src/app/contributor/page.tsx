"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";
import { ArrowRight, Zap, CheckCircle, Upload } from "lucide-react";
import Link from "next/link";
import { isAdmin } from "@/lib/admin";
import { Icon3DTarget, Icon3DSparkle, Icon3DNotebook, Icon3DChart, Icon3DGraduationCap, Icon3DTrophy, Icon3DRocket } from "@/components/premium-3d-icons";
import { AccessibilityWrapper } from "@/components/accessibility-wrapper";

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
      <AccessibilityWrapper>
        <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
          <p style={{ color: "var(--foreground-secondary)" }}>Loading contributor portal...</p>
        </div>
      </div>
      </AccessibilityWrapper>
    );
  }

  if (!user || (!isAdmin(user.role, user.email) && !['contributor'].includes(user.role || 'student'))) {
    return null;
  }

  return (
    <AccessibilityWrapper>
      <div className="min-h-screen pt-8 pb-12 px-4" style={{ background: "var(--background)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-3">
            <Icon3DTarget size={56} />
            <h1 className="text-4xl font-bold" style={{ color: "var(--foreground)" }}>
              Contributor Portal
            </h1>
          </div>
          <p className="text-lg" style={{ color: "var(--foreground-secondary)" }}>
            Create and submit verified questions to help students succeed
          </p>
        </div>

        {/* Quick Actions - Large Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Link
            href="/contributor/create"
            className="group p-8 rounded-2xl transition-all flex flex-col"
            style={{
              background: "var(--card-bg)",
              borderColor: "var(--card-border)",
              borderWidth: "2px",
              borderStyle: "solid"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.12)";
              e.currentTarget.style.borderColor = "#818cf8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "var(--card-border)";
            }}
          >
            <div>
              <div className="mb-4 group-hover:scale-110 transition-transform flex justify-center">
                <Icon3DSparkle size={72} />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-600" style={{ color: "var(--foreground)" }}>
                Create Question Set
              </h3>
              <p className="text-sm mb-4" style={{ color: "var(--foreground-secondary)" }}>
                Upload study material and generate AI-powered questions
              </p>
            </div>
            <div className="flex items-center gap-2 text-indigo-600 font-medium mt-auto">
              Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/contributor/materials"
            className="group p-8 rounded-2xl transition-all flex flex-col"
            style={{
              background: "var(--card-bg)",
              borderColor: "var(--card-border)",
              borderWidth: "2px",
              borderStyle: "solid"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.12)";
              e.currentTarget.style.borderColor = "#818cf8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "var(--card-border)";
            }}
          >
            <div>
              <div className="mb-4 group-hover:scale-110 transition-transform flex justify-center">
                <Upload size={72} className="text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-600" style={{ color: "var(--foreground)" }}>
                Upload Study Materials
              </h3>
              <p className="text-sm mb-4" style={{ color: "var(--foreground-secondary)" }}>
                Share PDF, DOCX, PPT files with the community
              </p>
            </div>
            <div className="flex items-center gap-2 text-indigo-600 font-medium mt-auto">
              Upload Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/contributor/submissions"
            className="group p-8 rounded-2xl transition-all flex flex-col"
            style={{
              background: "var(--card-bg)",
              borderColor: "var(--card-border)",
              borderWidth: "2px",
              borderStyle: "solid"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.12)";
              e.currentTarget.style.borderColor = "#818cf8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "var(--card-border)";
            }}
          >
            <div>
              <div className="mb-4 group-hover:scale-110 transition-transform flex justify-center">
                <Icon3DNotebook size={72} />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-600" style={{ color: "var(--foreground)" }}>
                My Submissions
              </h3>
              <p className="text-sm mb-4" style={{ color: "var(--foreground-secondary)" }}>
                Track your submitted questions and approval status
              </p>
            </div>
            <div className="flex items-center gap-2 text-indigo-600 font-medium mt-auto">
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/contributor/stats"
            className="group p-8 rounded-2xl transition-all flex flex-col"
            style={{
              background: "var(--card-bg)",
              borderColor: "var(--card-border)",
              borderWidth: "2px",
              borderStyle: "solid"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.12)";
              e.currentTarget.style.borderColor = "#818cf8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "var(--card-border)";
            }}
          >
            <div>
              <div className="mb-4 group-hover:scale-110 transition-transform flex justify-center">
                <Icon3DChart size={72} />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-600" style={{ color: "var(--foreground)" }}>
                Contribution Stats
              </h3>
              <p className="text-sm mb-4" style={{ color: "var(--foreground-secondary)" }}>
                View your contribution analytics and points
              </p>
            </div>
            <div className="flex items-center gap-2 text-indigo-600 font-medium mt-auto">
              See Stats <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* How It Works */}
        <div className="rounded-2xl p-8 mb-8" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "2px", borderStyle: "solid" }}>
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-7 h-7 text-yellow-500" />
            <h2 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>How It Works</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: "light-dark(#4255FF, var(--hover-bg))" }}>
                <span className="text-2xl font-bold" style={{ color: "light-dark(white, var(--foreground))" }}>1</span>
              </div>
              <h3 className="font-semibold mb-2" style={{ color: "var(--foreground)" }}>Select Exam</h3>
              <p className="text-sm" style={{ color: "var(--foreground-secondary)" }}>
                Choose from JEE, NEET, UPSC, and 20+ exams
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: "light-dark(#4255FF, var(--hover-bg))" }}>
                <span className="text-2xl font-bold" style={{ color: "light-dark(white, var(--foreground))" }}>2</span>
              </div>
              <h3 className="font-semibold mb-2" style={{ color: "var(--foreground)" }}>Select Subject</h3>
              <p className="text-sm" style={{ color: "var(--foreground-secondary)" }}>
                Pick the subject for your questions
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: "light-dark(#4255FF, var(--hover-bg))" }}>
                <span className="text-2xl font-bold" style={{ color: "light-dark(white, var(--foreground))" }}>3</span>
              </div>
              <h3 className="font-semibold mb-2" style={{ color: "var(--foreground)" }}>Upload Material</h3>
              <p className="text-sm" style={{ color: "var(--foreground-secondary)" }}>
                Upload PDF, DOCX, or paste text from your notes
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Icon3DSparkle size={48} />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: "var(--foreground)" }}>AI Generates</h3>
              <p className="text-sm" style={{ color: "var(--foreground-secondary)" }}>
                Questions are created and submitted for review
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-xl p-6" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "2px", borderStyle: "solid" }}>
            <div className="mb-3 flex justify-center">
              <Icon3DGraduationCap size={56} />
            </div>
            <h3 className="font-bold mb-2 text-center" style={{ color: "var(--foreground)" }}>Help Students</h3>
            <p className="text-sm text-center" style={{ color: "var(--foreground-secondary)" }}>
              Your questions help thousands of students prepare for their exams
            </p>
          </div>

          <div className="rounded-xl p-6" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "2px", borderStyle: "solid" }}>
            <div className="mb-3 flex justify-center">
              <Icon3DTrophy size={56} />
            </div>
            <h3 className="font-bold mb-2 text-center" style={{ color: "var(--foreground)" }}>Earn Points</h3>
            <p className="text-sm text-center" style={{ color: "var(--foreground-secondary)" }}>
              Get contribution points for every approved question
            </p>
          </div>

          <div className="rounded-xl p-6" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "2px", borderStyle: "solid" }}>
            <div className="mb-3 flex justify-center">
              <Icon3DRocket size={56} />
            </div>
            <h3 className="font-bold mb-2 text-center" style={{ color: "var(--foreground)" }}>Build Reputation</h3>
            <p className="text-sm text-center" style={{ color: "var(--foreground-secondary)" }}>
              Top contributors get featured and special badges
            </p>
          </div>
        </div>

        {/* Guidelines */}
        <div className="mt-8 rounded-xl p-6" style={{
          background: "light-dark(#ede9fe, var(--card-bg))",
          borderColor: "light-dark(#ddd6fe, var(--card-border))",
          borderWidth: "2px",
          borderStyle: "solid"
        }}>
          <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
            <Icon3DSparkle size={24} /> Quality Guidelines
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
              <span style={{ color: "var(--foreground-secondary)" }}>Upload relevant, accurate study material from trusted sources</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
              <span style={{ color: "var(--foreground-secondary)" }}>Ensure content matches the selected exam and subject</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
              <span style={{ color: "var(--foreground-secondary)" }}>More content = better question quality (aim for 500+ words)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
              <span style={{ color: "var(--foreground-secondary)" }}>Questions go through admin review before being published</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    </AccessibilityWrapper>
  );
}
