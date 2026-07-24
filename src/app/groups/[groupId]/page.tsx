"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  ArrowLeft,
  Copy,
  Check,
  LogOut,
  Loader2,
  Link2,
  X,
} from "lucide-react";
import { useUser } from "@/context/user-context";
import { getHeadersWithCsrf } from "@/lib/csrf-client";
import { ErrorModal } from "@/components/error-modal";

const getAvatarGradient = (name: string) => {
  const colors = [
    { from: "#E76F51", to: "#F4A261" },
    { from: "#2A9D8F", to: "#264653" },
    { from: "#E9C46A", to: "#F4A261" },
    { from: "#F26A4B", to: "#E76F51" },
    { from: "#8B5CF6", to: "#6366F1" },
    { from: "#10B981", to: "#059669" },
    { from: "#F59E0B", to: "#D97706" },
    { from: "#EF4444", to: "#DC2626" },
    { from: "#3B82F6", to: "#2563EB" },
    { from: "#EC4899", to: "#DB2777" },
  ];
  const index = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
};

interface Member {
  user_id: string;
  role: string;
  name: string;
  avatar_color: string;
}

interface GroupDetail {
  id: string;
  name: string;
  description: string;
  join_code: string;
  my_role: string;
}

export default function GroupDetailPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const params = useParams();
  const groupId = params.groupId as string;

  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [copied, setCopied] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setErrorModalOpen(true);
  };

  const fetchGroup = async () => {
    try {
      const res = await fetch(`/api/groups/${groupId}`);
      if (res.ok) {
        const data = await res.json();
        setGroup(data.group);
        setMembers(data.members || []);
      } else if (res.status === 404) {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && groupId) fetchGroup();
  }, [user, groupId]);

  const inviteLink =
    group && typeof window !== "undefined"
      ? `${window.location.origin}/groups/join/${group.join_code}`
      : "";

  const handleCopy = async () => {
    if (!inviteLink) return;
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showError("Couldn't copy the link. Please copy it manually.");
    }
  };

  const handleLeave = async () => {
    setLeaving(true);
    try {
      const res = await fetch(`/api/groups/${groupId}`, {
        method: "DELETE",
        headers: getHeadersWithCsrf(),
      });
      if (res.ok) {
        router.push("/groups");
      } else {
        const data = await res.json();
        setLeaveOpen(false);
        showError(data.error || "Could not leave the group.");
      }
    } catch {
      setLeaveOpen(false);
      showError("Could not leave the group. Please try again.");
    } finally {
      setLeaving(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-[#F26A4B]/20 border-t-[#F26A4B] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  if (notFound || !group) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] dark:bg-slate-950 px-6 py-8">
        <div className="max-w-3xl mx-auto text-center py-24">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
            <Users className="w-8 h-8 text-slate-400" />
          </div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            Group not found
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            This group doesn't exist, or you're not a member of it.
          </p>
          <button
            onClick={() => router.push("/groups")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F26A4B] text-white font-medium hover:bg-[#e05a3d] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to groups
          </button>
        </div>
      </div>
    );
  }

  const isOwner = group.my_role === "owner";
  const gradient = getAvatarGradient(group.name || "Group");

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-slate-950 px-6 md:px-10 py-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.push("/groups")}
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-6 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          All groups
        </button>

        {/* Header card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 mb-6">
          <div className="flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl shrink-0"
              style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}
            >
              {(group.name || "G").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {group.name}
                </h1>
                {isOwner && (
                  <span className="text-[10px] uppercase tracking-wide font-semibold text-[#F26A4B] bg-[#F26A4B]/10 px-1.5 py-0.5 rounded">
                    Owner
                  </span>
                )}
              </div>
              {group.description && (
                <p className="text-slate-600 dark:text-slate-400 mt-1">{group.description}</p>
              )}
              <div className="flex items-center gap-1.5 mt-3 text-sm text-slate-500 dark:text-slate-400">
                <Users className="w-4 h-4" />
                {members.length} {members.length === 1 ? "member" : "members"}
              </div>
            </div>
          </div>
        </div>

        {/* Invite card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Link2 className="w-5 h-5 text-[#F26A4B]" />
            <h2 className="font-semibold text-slate-900 dark:text-white">Invite friends</h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Share this link with friends so they can join the group. Anyone with the link can join —
            it's free for everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-mono truncate">
              {inviteLink}
            </div>
            <button
              onClick={handleCopy}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#F26A4B] text-white font-medium hover:bg-[#e05a3d] transition-colors shrink-0"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy link"}
            </button>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">
            Invite code: <span className="font-mono">{group.join_code}</span>
          </p>
        </div>

        {/* Members list */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 mb-6">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Members</h2>
          <div className="space-y-3">
            {members.map((member) => {
              const mg = getAvatarGradient(member.name || "User");
              return (
                <div key={member.user_id} className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0"
                    style={{ background: `linear-gradient(135deg, ${mg.from}, ${mg.to})` }}
                  >
                    {(member.name || "U").charAt(0).toUpperCase()}
                  </div>
                  <span className="text-slate-800 dark:text-slate-200 font-medium">
                    {member.name}
                    {member.user_id === user.id && (
                      <span className="text-slate-400 dark:text-slate-500 font-normal"> (you)</span>
                    )}
                  </span>
                  {member.role === "owner" && (
                    <span className="ml-auto text-[10px] uppercase tracking-wide font-semibold text-[#F26A4B] bg-[#F26A4B]/10 px-1.5 py-0.5 rounded">
                      Owner
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Leave (members only) */}
        {!isOwner && (
          <button
            onClick={() => setLeaveOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Leave group
          </button>
        )}
      </div>

      {/* Leave confirm modal */}
      <AnimatePresence>
        {leaveOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onClick={() => !leaving && setLeaveOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Leave this group?
                </h2>
                <button
                  onClick={() => setLeaveOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">
                You'll need an invite link to join again.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setLeaveOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLeave}
                  disabled={leaving}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-60"
                >
                  {leaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                  Leave
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ErrorModal
        isOpen={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        title="Something went wrong"
        message={errorMessage}
      />
    </div>
  );
}
