'use client';

/**
 * Admin: AI Question Generation UI
 * Simple browser interface to generate questions
 */

import { useState } from 'react';

const TARGETS = [
  { exam: 'IELTS', subject: 'Reading', topic: 'Academic Reading', count: 50 },
  { exam: 'IELTS', subject: 'Reading', topic: 'General Training', count: 50 },
  { exam: 'IELTS', subject: 'Writing', topic: 'Task 1', count: 25 },
  { exam: 'IELTS', subject: 'Writing', topic: 'Task 2', count: 25 },
  { exam: 'JEE', subject: 'Physics', topic: 'Mechanics', count: 30 },
  { exam: 'JEE', subject: 'Chemistry', topic: 'Organic Chemistry', count: 35 },
  { exam: 'JEE', subject: 'Mathematics', topic: 'Calculus', count: 35 },
  { exam: 'NEET', subject: 'Biology', topic: 'Cell Biology', count: 40 },
  { exam: 'NEET', subject: 'Chemistry', topic: 'Inorganic Chemistry', count: 40 },
  { exam: 'UPSC', subject: 'Polity', topic: 'Indian Constitution', count: 25 },
  { exam: 'UPSC', subject: 'History', topic: 'Modern India', count: 25 },
  { exam: 'SSC', subject: 'Reasoning', topic: 'Logical Reasoning', count: 25 },
  { exam: 'SSC', subject: 'Quantitative', topic: 'Arithmetic', count: 25 },
];

export default function GeneratePage() {
  const [running, setRunning] = useState(false);
  const [currentTask, setCurrentTask] = useState(0);
  const [results, setResults] = useState<any[]>([]);
  const [totalGenerated, setTotalGenerated] = useState(0);
  const [totalSaved, setTotalSaved] = useState(0);

  async function runGeneration() {
    setRunning(true);
    setResults([]);
    setTotalGenerated(0);
    setTotalSaved(0);

    for (let i = 0; i < TARGETS.length; i++) {
      setCurrentTask(i + 1);
      const target = TARGETS[i];

      try {
        const response = await fetch('/api/admin/generate-questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...target, difficulty: 'mixed' }),
        });

        const data = await response.json();

        setResults(prev => [...prev, { target, data }]);
        setTotalGenerated(prev => prev + (data.generated || 0));
        setTotalSaved(prev => prev + (data.saved || 0));

        // Wait 2 seconds between requests
        if (i < TARGETS.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (err) {
        setResults(prev => [...prev, { target, data: { error: (err as Error).message } }]);
      }
    }

    setRunning(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          AI Question Generation
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Generation Targets
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {TARGETS.length} tasks · {TARGETS.reduce((sum, t) => sum + t.count, 0)} total questions
          </p>

          {!running && results.length === 0 && (
            <button
              onClick={runGeneration}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              Start Generation
            </button>
          )}

          {running && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span className="text-gray-700 dark:text-gray-300">
                  Task {currentTask} / {TARGETS.length}
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Generated: {totalGenerated} · Saved: {totalSaved}
              </div>
            </div>
          )}

          {!running && results.length > 0 && (
            <div className="space-y-4">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                ✅ Complete: {totalSaved} questions saved
              </div>
              <button
                onClick={runGeneration}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
              >
                Run Again
              </button>
            </div>
          )}
        </div>

        {results.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Results
            </h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {r.target.exam} - {r.target.topic}
                  </span>
                  {r.data.success ? (
                    <span className="text-sm text-green-600 dark:text-green-400">
                      ✅ {r.data.saved} saved
                    </span>
                  ) : (
                    <span className="text-sm text-red-600 dark:text-red-400">
                      ❌ {r.data.error || 'Failed'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
