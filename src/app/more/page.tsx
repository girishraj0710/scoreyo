"use client";

import Link from "next/link";
import { useUser } from "@/context/user-context";
import { useRouter } from "next/navigation";
import {
  FileText,
  Trophy,
  Zap,
  Settings,
  CreditCard,
  LogOut,
  Globe,
  User,
  Shield,
  Mail,
  BookOpen,
} from "lucide-react";
import { AccessibilityWrapper } from "@/components/accessibility-wrapper";

export default function MorePage() {
  const { user, logout } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const menuSections = [
    {
      title: "Features",
      items: [
        {
          href: "/mock-test",
          icon: FileText,
          label: "Mock Tests",
          badge: "Pro",
        },
        {
          href: "/reports",
          icon: Trophy,
          label: "Performance Reports",
          badge: "Pro",
        },
        { href: "/leaderboard", icon: Trophy, label: "Leaderboard" },
        { href: "/achievements", icon: Trophy, label: "Badges & Achievements" },
        { href: "/sprint", icon: Zap, label: "Live Sprints" },
        { href: "/study-materials", icon: BookOpen, label: "Study Materials" },
      ],
    },
    {
      title: "Account",
      items: [
        { href: "/profile", icon: User, label: "Profile" },
        { href: "/pricing", icon: CreditCard, label: "Upgrade to Pro" },
        { href: "/settings", icon: Settings, label: "Settings" },
      ],
    },
    {
      title: "Support",
      items: [
        { href: "/contact", icon: Mail, label: "Contact Us" },
        { href: "/privacy", icon: Shield, label: "Privacy Policy" },
        { href: "/terms", icon: FileText, label: "Terms of Service" },
      ],
    },
  ];

  return (
    <AccessibilityWrapper>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 md:pb-8">
      {/* User Info */}
      <div className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
            style={{ backgroundColor: user?.avatar_color || "#6366f1" }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className="text-indigo-100 text-sm">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      {menuSections.map((section) => (
        <div key={section.title} className="mb-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 px-2" style={{ color: "var(--foreground-secondary)" }}>
            {section.title}
          </h3>
          <div className="rounded-xl shadow-sm border border-[var(--card-border)] overflow-hidden" style={{ background: "var(--card-bg)" }}>
            {section.items.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-4 transition-all cursor-pointer ${
                    index !== section.items.length - 1
                      ? "border-b border-[var(--card-border)]"
                      : ""
                  }`}
                  style={{ color: "var(--foreground)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--hover-bg)";
                    const icon = e.currentTarget.querySelector('svg');
                    if (icon) {
                      icon.style.color = "#E76F51";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    const icon = e.currentTarget.querySelector('svg');
                    if (icon) {
                      icon.style.color = "var(--muted)";
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" style={{ color: "var(--muted)" }} />
                    <span className="font-medium" style={{ color: "var(--foreground)" }}>
                      {item.label}
                    </span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-1 bg-gradient-to-r from-indigo-600 to-violet-500 text-white text-xs font-bold rounded-full">
                      {item.badge}
                    </span>
                  )}
                  <svg
                    className="w-5 h-5"
                    style={{ color: "var(--muted)" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              );
            })}
          </div>
        </div>
      ))}

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-semibold hover:bg-red-100 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>

      {/* App Version */}
      <div className="mt-6 text-center text-sm text-slate-400">
        Krakkify v1.0.0
      </div>
    </div>
    </AccessibilityWrapper>
  );
}
