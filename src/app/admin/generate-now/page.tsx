'use client';

/**
 * Instant Generation - NO AUTH REQUIRED
 * Just click and generate!
 */

import { useState } from 'react';

const TARGETS = [
  { exam: 'jee-main', subject: 'jee-physics', topic: 'Mechanics', count: 30 },
  { exam: 'jee-main', subject: 'jee-chemistry', topic: 'Organic Chemistry', count: 30 },
  { exam: 'jee-main', subject: 'jee-maths', topic: 'Calculus', count: 30 },
];

export default function GenerateNowPage() {
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [total, setTotal] = useState(0);

  function addLog(msg: string) {
    setLog(prev => [...prev, `${new Date().toLocaleTimeString()} ${msg}`]);
  }

  async function generate() {
    setRunning(true);
    setLog([]);
    setTotal(0);

    addLog('🚀 Starting generation...');

    for (const target of TARGETS) {
      addLog(`\n📝 ${target.exam} - ${target.topic}`);

      const batches = Math.ceil(target.count / 10);
      let taskTotal = 0;

      for (let i = 0; i < batches; i++) {
        const size = Math.min(10, target.count - i * 10);

        try {
          const res = await fetch('/api/admin/bulk-generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              examId: target.exam,
              subjectId: target.subject,
              topic: target.topic,
              numberOfQuestions: size,
              difficulty: 'mixed',
            }),
          });

          const data = await res.json();

          if (data.success) {
            taskTotal += data.generated;
            setTotal(prev => prev + data.generated);
            addLog(`   ✅ Batch ${i + 1}/${batches}: ${data.generated} questions`);
          } else {
            addLog(`   ❌ Batch ${i + 1}/${batches}: ${data.error || data.message}`);
          }

          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (err) {
          addLog(`   ❌ Batch ${i + 1}/${batches}: ${(err as Error).message}`);
        }
      }

      addLog(`   ✅ ${taskTotal} questions generated\n`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    addLog(`\n✅ Complete! Total: ${total} questions`);
    setRunning(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Generate Questions Now
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          No login required • Testing with JEE Physics/Chemistry/Maths
        </p>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
          {!running && log.length === 0 && (
            <div className="text-center">
              <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
                This will generate {TARGETS.reduce((s, t) => s + t.count, 0)} questions
              </p>
              <button
                onClick={generate}
                className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-lg text-xl font-bold"
              >
                🚀 Generate Now
              </button>
            </div>
          )}

          {running && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                Generating... {total} questions so far
              </p>
            </div>
          )}

          {!running && log.length > 0 && (
            <div className="text-center">
              <div className="text-6xl mb-4">✅</div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-6">
                {total} Questions Generated!
              </p>
              <button
                onClick={generate}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
              >
                Generate More
              </button>
            </div>
          )}
        </div>

        {log.length > 0 && (
          <div className="bg-gray-900 rounded-lg shadow-lg p-6 font-mono text-sm">
            <h2 className="text-white text-lg font-semibold mb-4">Log</h2>
            <div className="space-y-1 max-h-96 overflow-y-auto text-green-400">
              {log.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
