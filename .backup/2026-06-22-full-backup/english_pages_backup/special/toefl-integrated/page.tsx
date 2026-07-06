"use client";

import dynamic from "next/dynamic";
import { LoadingSkeleton } from "@/components/loading-skeleton";

const TOEFLIntegrated = dynamic(() => import("./content"), {
  loading: () => <LoadingSkeleton type="page" />,
});

export default function TOEFLIntegratedPage() {
  return <TOEFLIntegrated />;
}
