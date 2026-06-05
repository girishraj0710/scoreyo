"use client";

import dynamic from "next/dynamic";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { AccessibilityWrapper } from "@/components/accessibility-wrapper";

/**
 * Admin Dashboard Page - Dynamic Import Wrapper
 *
 * Admin pages don't need SSR and are only accessed by admins.
 * By dynamically importing with ssr: false, we:
 * 1. Remove ~100KB from main bundle
 * 2. Improve initial load for all users
 * 3. Load admin code only when needed
 */

const AdminDashboard = dynamic(() => import("./admin-content"), {
  loading: () => <LoadingSkeleton type="page" />,
  ssr: false, // Admin dashboard doesn't need server-side rendering
});

export default function AdminPage() {
  return <AdminDashboard />;
}
