"use client";

import dynamic from "next/dynamic";
import { LoadingSkeleton } from "@/components/loading-skeleton";

const LandingEmergent = dynamic(() => import("@/components/landing-emergent").then(mod => ({ default: mod.LandingEmergent })), {
  loading: () => <LoadingSkeleton type="page" />,
  ssr: false,
});

export default function LandingTestPage() {
  return <LandingEmergent />;
}
