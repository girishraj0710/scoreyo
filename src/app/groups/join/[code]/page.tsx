"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Users, Loader2, ArrowRight, AlertTriangle } from "lucide-react";
import { useUser } from "@/context/user-context";
import { getHeadersWithCsrf } from "@/lib/csrf-client";

export default function JoinGroupPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const params = useParams();
  const code = params.code as string;

  const [status, setStatus] = useState<"joining" | "error">("joining");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isLoading) return;

    // Not logged in — send to login with a return URL. After logging in (or
    // signing up), the user lands back here and the join completes automatically.
    if (!user) {
      const back = encodeURIComponent(`/groups/join/${code}`);
      router.replace(`/login?redirect=${back}`);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/groups/join", {
          method: "POST",
          headers: getHeadersWithCsrf(),
          body: JSON.stringify({ code }),
        });
        const data = await res.json();
        if (cancelled) return;
        if (res.ok) {
          router.replace(`/groups/${data.group.id}`);
        } else {
          setErrorMessage(data.error || "That invite link is invalid or expired.");
          setStatus("error");
        }
      } catch {
        if (cancelled) return;
        setErrorMessage("Could not join the group. Please try again.");
        setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, isLoading, code, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] dark:bg-slate-950 px-6">
      <div className="text-center max-w-sm">
        {status === "joining" ? (
          <>
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-[#F26A4B]/10 flex items-center justify-center">
              <Users className="w-8 h-8 text-[#F26A4B]" />
            </div>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Joining group…
            </h1>
            <p className="text-slate-600 dark:text-slate-400 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Hang tight
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-red-100 dark:bg-red-950/40 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Couldn't join
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">{errorMessage}</p>
            <button
              onClick={() => router.push("/groups")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F26A4B] text-white font-medium hover:bg-[#e05a3d] transition-colors"
            >
              Go to my groups
              <ArrowRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
