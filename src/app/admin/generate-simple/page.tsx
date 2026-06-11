'use client';

/**
 * Simple Question Generation
 * Uses existing /api/quiz endpoint (which already works!)
 */

import { useState } from 'react';

const TARGETS = [
  { exam: 'ielts', subject: 'reading', topic: 'Academic Reading', count: 50 },
  { exam: 'ielts', subject: 'reading', topic: 'General Training', count: 50 },
  { exam: 'ielts', subject: 'writing', topic: 'Task 1', count: 25 },
  { exam: 'ielts', subject: 'writing', topic: 'Task 2', count: 25 },
  { exam: 'jee', subject: 'physics', topic: 'Mechanics', count: 30 },
  { exam: 'jee', subject: 'chemistry', topic: 'Organic Chemistry', count: 35 },
  { exam: 'jee', subject: 'math', topic: 'Calculus', count: 35 },
  { exam: 'neet', subject: 'biology', topic: 'Cell Biology', count: 40 },
  { exam: 'neet', subject: 'chemistry', topic: 'Inorganic Chemistry', count: 40 },
  { exam: 'upsc', subject: 'polity', topic: 'Indian Constitution', count: 25 },
  { exam: 'upsc', subject: 'history', topic: 'Modern India', count: 25 },
  { exam: 'ssc', subject: 'reasoning', topic: 'Logical Reasoning', count: 25 },
  { exam: 'ssc', subject: 'quantitative', topic: 'Arithmetic', count: 25 },
];

export default function GenerateSimplePage() {
  const [running, setRunning] = useState(false);
  const [currentTask, setCurrentTask] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const [totalGenerated, setTotalGenerated] = useState(0);

  function addLog(message: string) {
    setLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  }

  async function runGeneration() {
    setRunning(true);
    setLog([]);
    setTotalGenerated(0);

    addLog('🚀 Starting generation using existing /api/quiz endpoint...');
    addLog(`📋 ${TARGETS.length} targets, ${TARGETS.reduce((s, t) => s + t.count, 0)} total questions`);

    for (let i = 0; i < TARGETS.length; i++) {
      setCurrentTask(i + 1);
      const target = TARGETS[i];

      addLog(`\n📝 Task ${i + 1}/${TARGETS.length}: ${target.exam.toUpperCase()} - ${target.topic}`);

      // Generate in batches of 10 (quiz API limit)
      const batches = Math.ceil(target.count / 10);
      let taskTotal = 0;

      for (let batch = 0; batch < batches; batch++) {
        const batchSize = Math.min(10, target.count - batch * 10);

        try {
          const response = await fetch('/api/admin/bulk-generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              examId: target.exam,
              subjectId: target.subject,
              topic: target.topic,
              numberOfQuestions: batchSize,
              difficulty: 'mixed',
            }),
          });

          const data = await response.json();

          if (data.success && data.generated) {
            taskTotal += data.generated;
            setTotalGenerated(prev => prev + data.generated);
            addLog(`   ✅ Batch ${batch + 1}/${batches}: Generated ${data.generated} questions`);
          } else if (data.error) {
            addLog(`   ❌ Batch ${batch + 1}/${batches}: ${data.error}`);
          }

          // Rate limit: wait 1 second between batches
          if (batch < batches - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (err) {
          addLog(`   ❌ Batch ${batch + 1}/${batches}: ${(err as Error).message}`);
        }
      }

      addLog(`   📊 Task complete: ${taskTotal}/${target.count} questions generated`);

      // Wait 2 seconds between tasks
      if (i < TARGETS.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    addLog('\n✅ Generation complete!');
    addLog(`📈 Total generated: ${totalGenerated} questions`);
    addLog('\n💡 Note: Questions were generated via /api/quiz and saved to database automatically');

    setRunning(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          Simple AI Question Generation
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Uses your existing /api/quiz endpoint (which already works!)
        </p>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          {!running && log.length === 0 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  Ready to Generate
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {TARGETS.length} tasks · {TARGETS.reduce((sum, t) => sum + t.count, 0)} questions · ~1 hour
                </p>
              </div>

              <button
                onClick={runGeneration}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium text-lg"
              >
                🚀 Start Generation
              </button>
            </div>
          )}

          {running && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  Task {currentTask} / {TARGETS.length}
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Generated: {totalGenerated} questions
              </div>
            </div>
          )}

          {!running && log.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✅</span>
                <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                  Complete: {totalGenerated} questions generated
                </span>
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

        {log.length > 0 && (
          <div className="bg-gray-900 rounded-lg shadow p-6 font-mono text-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">
                Generation Log
              </h2>
              <button
                onClick={() => {
                  const logText = log.join('\n');
                  navigator.clipboard.writeText(logText);
                }}
                className="text-xs text-gray-400 hover:text-white"
              >
                Copy Log
              </button>
            </div>
            <div className="space-y-1 max-h-96 overflow-y-auto text-green-400">
              {log.map((line, i) => (
                <div key={i} className="whitespace-pre-wrap">
                  {line}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
