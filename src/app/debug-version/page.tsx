'use client';

export default function DebugVersion() {
  const buildTime = new Date().toISOString();
  const codeVersion = "v2.0-role-fix-final";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">🔥 Code Version Check 🔥</h1>
        <div className="space-y-2">
          <p className="text-2xl">Code Version: <span className="text-green-400 font-mono">{codeVersion}</span></p>
          <p className="text-lg">Build Time: <span className="text-blue-400 font-mono">{buildTime}</span></p>
        </div>
        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <p className="text-sm">If you see <span className="text-green-400">v2.0-role-fix-final</span>, your browser has the latest code.</p>
          <p className="text-sm mt-2">If not, do a hard refresh: <kbd className="bg-gray-700 px-2 py-1 rounded">Cmd+Shift+R</kbd> (Mac) or <kbd className="bg-gray-700 px-2 py-1 rounded">Ctrl+Shift+R</kbd> (Windows)</p>
        </div>
        <div className="mt-8">
          <a href="/" className="text-blue-400 hover:underline">← Back to Home</a>
        </div>
      </div>
    </div>
  );
}
