"use client";

import { useState, useEffect } from "react";
import { useLocale } from "@/context/locale-context";

export default function MinimalReportsPage() {
  const { t } = useLocale();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/reports");
        if (res.ok) {
          const jsonData = await res.json();
          setData(jsonData);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading) {
    return <div className="p-8">{t("loading") || "Loading..."}</div>;
  }

  if (!data) {
    return <div className="p-8">No data</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">{t("reportsTitle")}</h1>
      <div className="mb-4">Total Sessions: {data.stats.totalSessions}</div>
      <div className="mb-4">Total Questions: {data.stats.totalQuestions}</div>
      <div className="mb-4">Accuracy: {data.stats.accuracy}%</div>
    </div>
  );
}
