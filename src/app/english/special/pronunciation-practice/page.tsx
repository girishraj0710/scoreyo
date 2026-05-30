"use client";

import dynamic from "next/dynamic";
import { LoadingSkeleton } from "@/components/loading-skeleton";

const PronunciationPractice = dynamic(() => import("./content"), {
  loading: () => <LoadingSkeleton type="page" />,
});

export default function PronunciationPracticePage() {
  return <PronunciationPractice />;
}
