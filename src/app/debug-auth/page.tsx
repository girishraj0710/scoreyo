"use client";

import { useEffect, useState } from "react";
import { getCsrfToken } from "@/lib/csrf-client";

export default function DebugAuthPage() {
  const [cookies, setCookies] = useState<Record<string, string>>({});
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [authCheck, setAuthCheck] = useState<any>(null);

  useEffect(() => {
    // Parse all cookies
    const parsedCookies: Record<string, string> = {};
    document.cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name) parsedCookies[name] = value || '';
    });
    setCookies(parsedCookies);

    // Get CSRF token
    const token = getCsrfToken();
    setCsrfToken(token);

    // Check auth status
    fetch('/api/auth')
      .then(res => res.json())
      .then(data => setAuthCheck(data))
      .catch(err => setAuthCheck({ error: err.message }));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug Page</h1>

      <div className="space-y-6">
        {/* CSRF Token Status */}
        <div className=" rounded-lg p-6 shadow border " style={{ borderColor: "var(--card-border)" }} style={{ background: "var(--card-bg)" }}>
          <h2 className="text-lg font-semibold mb-4">CSRF Token Status</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${csrfToken ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="font-medium">CSRF Token (-client cookie):</span>
              <code className="text-sm  px-2 py-1 rounded" style={{ background: "var(--background)" }}>
                {csrfToken ? 'Present' : 'Missing'}
              </code>
            </div>
            {csrfToken && (
              <div className="ml-5 text-xs  break-all" style={{ color: "var(--foreground)" }}>
                {csrfToken}
              </div>
            )}
          </div>
        </div>

        {/* Visible Cookies */}
        <div className=" rounded-lg p-6 shadow border " style={{ borderColor: "var(--card-border)" }} style={{ background: "var(--card-bg)" }}>
          <h2 className="text-lg font-semibold mb-4">Client-Readable Cookies</h2>
          <div className="text-sm  mb-3" style={{ color: "var(--foreground)" }}>
            Note: httpOnly cookies (like prepgenie-user-id and prepgenie-csrf-token) won't appear here.
          </div>
          {Object.keys(cookies).length === 0 ? (
            <div className="text-red-600">No cookies found</div>
          ) : (
            <div className="space-y-2">
              {Object.entries(cookies).map(([name, value]) => (
                <div key={name} className="border-b  pb-2" style={{ borderColor: "var(--card-border)" }}>
                  <div className="font-medium">{name}</div>
                  <div className="text-xs  break-all" style={{ color: "var(--foreground)" }}>{value}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Auth Check */}
        <div className=" rounded-lg p-6 shadow border " style={{ borderColor: "var(--card-border)" }} style={{ background: "var(--card-bg)" }}>
          <h2 className="text-lg font-semibold mb-4">Server Auth Status (GET /api/auth)</h2>
          {!authCheck ? (
            <div className="" style={{ color: "var(--foreground)" }}>Loading...</div>
          ) : (
            <div>
              {authCheck.user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="font-medium text-green-700">Logged In</span>
                  </div>
                  <div className="ml-5 space-y-1 text-sm">
                    <div><span className="font-medium">User ID:</span> {authCheck.user.id}</div>
                    <div><span className="font-medium">Name:</span> {authCheck.user.name}</div>
                    <div><span className="font-medium">Email:</span> {authCheck.user.email}</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="font-medium text-red-700">Not Logged In</span>
                  </div>
                  <div className="ml-5 text-sm text-red-600">
                    Server cannot find your session. The prepgenie-user-id cookie is missing or invalid.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div className="bg-[#E8EAFF] rounded-lg p-6 border border-blue-200">
          <h2 className="text-lg font-semibold mb-4 text-blue-900">Troubleshooting Steps</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
            <li>Verify deployment is complete on Vercel</li>
            <li>Clear ALL cookies for this site (Settings → Privacy → Cookies)</li>
            <li>Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)</li>
            <li>Log in again with OTP verification</li>
            <li>Return to this page to verify all cookies are set</li>
          </ol>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <a
            href="/login"
            className="px-6 py-2 bg-[#4255FF] text-white rounded-lg hover:bg-[#3242CC] font-medium"
          >
            Go to Login
          </a>
          <button
            onClick={() => {
              document.cookie.split(';').forEach(cookie => {
                const [name] = cookie.trim().split('=');
                if (name) {
                  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                }
              });
              window.location.reload();
            }}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
          >
            Clear All Cookies & Reload
          </button>
          <a
            href="/"
            className="px-6 py-2 bg-slate-200  rounded-lg hover: font-medium" style={{ background: "var(--background)" }} style={{ color: "var(--foreground)" }}
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
