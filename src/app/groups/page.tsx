"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Plus, ArrowRight, LogIn, X, Loader2 } from "lucide-react";
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

interface Group {
  id: string;
  name: string;
  description: string;
  join_code: string;
  member_count: number;
  my_role: string;
}

export default function GroupsPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  const [groups, setGroups] = useState<Group[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setErrorModalOpen(true);
  };

  const fetchGroups = async () => {
    try {
      const res = await fetch("/api/groups");
      if (res.ok) {
        const data = await res.json();
        setGroups(data.groups || []);
      }
    } catch {
      // silent — empty state handles it
    } finally {
      setLoadingGroups(false);
    }
  };

  useEffect(() => {
    if (user) fetchGroups();
  }, [user]);

  const handleCreate = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      showError("Please give your group a name.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: getHeadersWithCsrf(),
        body: JSON.stringify({ name: trimmed, description: description.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setCreateOpen(false);
        setName("");
        setDescription("");
        router.push(`/groups/${data.group.id}`);
      } else {
        showError(data.error || "Could not create the group.");
      }
    } catch {
      showError("Could not create the group. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoin = async () => {
    const code = joinCode.trim().toLowerCase();
    if (!code) {
      showError("Please enter an invite code.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/groups/join", {
        method: "POST",
        headers: getHeadersWithCsrf(),
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (res.ok) {
        setJoinOpen(false);
        setJoinCode("");
        router.push(`/groups/${data.group.id}`);
      } else {
        showError(data.error || "That invite code didn't work.");
      }
    } catch {
      showError("Could not join the group. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-[#F26A4B]/20 border-t-[#F26A4B] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-slate-950 px-6 md:px-10 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-xl bg-[#F26A4B] flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                Study Groups
              </h1>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-base">
              Team up with friends, share study material, and compete on challenges.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setJoinOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Join with code
            </button>
            <button
              onClick={() => setCreateOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F26A4B] text-white font-medium hover:bg-[#e05a3d] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create group
            </button>
          </div>
        </div>

        {/* Content */}
        {loadingGroups ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-[#F26A4B] animate-spin" />
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-20 px-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-[#F26A4B]/10 flex items-center justify-center">
              <Users className="w-8 h-8 text-[#F26A4B]" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              No study groups yet
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6">
              Create a group to study with friends, or join one using an invite code they shared
              with you.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setCreateOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F26A4B] text-white font-medium hover:bg-[#e05a3d] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create your first group
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {groups.map((group) => {
              const gradient = getAvatarGradient(group.name || "Group");
              return (
                <motion.button
                  key={group.id}
                  onClick={() => router.push(`/groups/${group.id}`)}
                  whileHover={{ y: -2 }}
                  className="text-left bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                      }}
                    >
                      {(group.name || "G").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                          {group.name}
                        </h3>
                        {group.my_role === "owner" && (
                          <span className="text-[10px] uppercase tracking-wide font-semibold text-[#F26A4B] bg-[#F26A4B]/10 px-1.5 py-0.5 rounded">
                            Owner
                          </span>
                        )}
                      </div>
                      {group.description ? (
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mt-0.5">
                          {group.description}
                        </p>
                      ) : (
                        <p className="text-sm text-slate-400 dark:text-slate-500 italic mt-0.5">
                          No description
                        </p>
                      )}
                      <div className="flex items-center gap-1.5 mt-3 text-sm text-slate-500 dark:text-slate-400">
                        <Users className="w-4 h-4" />
                        {group.member_count} {group.member_count === 1 ? "member" : "members"}
                        <ArrowRight className="w-4 h-4 ml-auto text-slate-400" />
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      {/* Create modal */}
      <AnimatePresence>
        {createOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onClick={() => !submitting && setCreateOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Create a study group
                </h2>
                <button
                  onClick={() => setCreateOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Group name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={80}
                placeholder="e.g. JEE 2027 Warriors"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F26A4B]/40 mb-4"
                autoFocus
              />
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Description <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="What's this group about?"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F26A4B]/40 mb-5 resize-none"
              />
              <button
                onClick={handleCreate}
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#F26A4B] text-white font-medium hover:bg-[#e05a3d] transition-colors disabled:opacity-60"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Create group
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Join modal */}
      <AnimatePresence>
        {joinOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onClick={() => !submitting && setJoinOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Join a study group
                </h2>
                <button
                  onClick={() => setJoinOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Invite code
              </label>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="e.g. a1b2c3d4"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F26A4B]/40 mb-5 font-mono tracking-wide"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              />
              <button
                onClick={handleJoin}
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#F26A4B] text-white font-medium hover:bg-[#e05a3d] transition-colors disabled:opacity-60"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                Join group
              </button>
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
