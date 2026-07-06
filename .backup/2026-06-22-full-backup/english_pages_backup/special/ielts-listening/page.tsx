"use client";

import dynamic from "next/dynamic";
import { LoadingSkeleton } from "@/components/loading-skeleton";

const IELTSListening = dynamic(() => import("./content"), {
  loading: () => <LoadingSkeleton type="page" />,
});

export default function IELTSListeningPage() {
  return <IELTSListening />;
}
