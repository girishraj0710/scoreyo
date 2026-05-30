"use client";

import dynamic from "next/dynamic";
import { LoadingSkeleton } from "@/components/loading-skeleton";

const ListeningSkills = dynamic(() => import("./content"), {
  loading: () => <LoadingSkeleton type="page" />,
});

export default function ListeningSkillsPage() {
  return <ListeningSkills />;
}
