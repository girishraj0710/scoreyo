"use client";

import { useState, useEffect } from "react";

export default function MinimalReportsPage() {
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
    return <div className="p-8">Loading...</div>;
  }

  if (!data) {
    return <div className="p-8">No data</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Minimal Reports Test</h1>
      <pre>{JSON.stringify(data.stats, null, 2)}</pre>
    </div>
  );
}
