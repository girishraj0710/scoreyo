"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Clock, FileText, TrendingUp } from "lucide-react";

interface WritingPrompt {
  id: string;
  task: 1 | 2;
  type: string;
  title: string;
  prompt: string;
  wordCount: number;
  timeLimit: number;
  tips: string[];
  sampleAnswer?: string;
}

const writingPrompts: WritingPrompt[] = [
  {
    id: "task1-line-graph",
    task: 1,
    type: "Line Graph",
    title: "Internet Users Growth",
    prompt: `The line graph below shows the number of internet users in three different countries between 2000 and 2020.

Summarize the information by selecting and reporting the main features, and make comparisons where relevant.

Write at least 150 words.

[Imagine a line graph showing:
- USA: Starting at 50 million (2000), rising to 300 million (2020)
- India: Starting at 5 million (2000), rising to 500 million (2020)
- UK: Starting at 20 million (2000), rising to 60 million (2020)]`,
    wordCount: 150,
    timeLimit: 20,
    tips: [
      "Start with an overview statement",
      "Don't copy the question directly",
      "Use comparative language (higher, lower, more than)",
      "Describe trends (increased, declined, fluctuated)",
      "Include specific numbers from the graph",
      "Use paragraphs: Introduction, Overview, Details",
    ],
    sampleAnswer: `The line graph illustrates the number of internet users in the USA, India, and the UK from 2000 to 2020.

Overall, all three countries experienced significant growth in internet usage over the two-decade period, with India showing the most dramatic increase.

In 2000, the USA had the highest number of internet users at 50 million, while the UK had 20 million and India had just 5 million. By 2020, however, India had surpassed both countries with 500 million users, representing a 100-fold increase. The USA's internet user base grew to 300 million, a six-fold increase, while the UK reached 60 million users, a three-fold rise.

The most notable trend is India's exponential growth, particularly after 2010, when affordable smartphones became widespread. In contrast, the USA and UK showed steadier, more gradual growth throughout the period.

(155 words)`,
  },
  {
    id: "task2-opinion",
    task: 2,
    type: "Opinion Essay",
    title: "Technology and Education",
    prompt: `Some people believe that technology has made learning easier and more accessible, while others think it has made students less focused and more distracted.

Discuss both views and give your own opinion.

Give reasons for your answer and include any relevant examples from your own knowledge or experience.

Write at least 250 words.`,
    wordCount: 250,
    timeLimit: 40,
    tips: [
      "Introduction: Paraphrase the question + your opinion",
      "Body Paragraph 1: First viewpoint",
      "Body Paragraph 2: Second viewpoint",
      "Body Paragraph 3: Your opinion with examples",
      "Conclusion: Summarize main points",
      "Use linking words (However, Moreover, Furthermore)",
      "Include personal examples if relevant",
    ],
    sampleAnswer: `Technology's role in education has sparked considerable debate. While some argue it has democratized learning, others contend it creates more distractions than benefits. In my view, technology is a powerful educational tool when used appropriately.

Proponents of educational technology highlight its accessibility. Online courses, educational apps, and digital libraries have made quality education available to students worldwide, regardless of geographic or economic barriers. For instance, platforms like Khan Academy provide free, comprehensive lessons to millions of learners who might otherwise lack educational resources.

However, critics point out legitimate concerns about digital distractions. Social media notifications, gaming apps, and endless internet browsing can significantly reduce students' attention spans and study time. Research shows that students who use devices during lectures retain less information than those who take traditional notes.

Nevertheless, I believe technology's benefits outweigh its drawbacks when implemented thoughtfully. The key lies in teaching digital literacy and self-discipline alongside academic subjects. Schools that integrate technology with clear guidelines—such as designated device-free study periods or monitored computer lab sessions—successfully harness its advantages while minimizing distractions.

In conclusion, technology has transformed education profoundly, offering unprecedented access to knowledge while presenting new challenges. Rather than rejecting technology, educators should focus on teaching students to use it responsibly and effectively.

(235 words)`,
  },
  {
    id: "task2-problem-solution",
    task: 2,
    type: "Problem-Solution Essay",
    title: "Urban Traffic Congestion",
    prompt: `In many cities around the world, traffic congestion has become a serious problem.

What are the causes of this problem, and what measures can be taken to solve it?

Give reasons for your answer and include any relevant examples from your own knowledge or experience.

Write at least 250 words.`,
    wordCount: 250,
    timeLimit: 40,
    tips: [
      "Introduction: Present the problem",
      "Body Paragraph 1: Causes (2-3 main causes)",
      "Body Paragraph 2: Solutions (corresponding solutions)",
      "Conclusion: Summarize and restate importance",
      "Match solutions to causes logically",
      "Use examples from real cities if possible",
    ],
  },
];

export default function IELTSWritingPage() {
  const router = useRouter();
  const [selectedTask, setSelectedTask] = useState<1 | 2>(2);
  const [selectedPrompt, setSelectedPrompt] = useState<WritingPrompt>(writingPrompts[1]);
  const [userEssay, setUserEssay] = useState("");
  const [showSample, setShowSample] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const handleEssayChange = (text: string) => {
    setUserEssay(text);
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    setWordCount(words.length);
  };

  const getPromptsForTask = (task: 1 | 2) => {
    return writingPrompts.filter(p => p.task === task);
  };

  const progressColor = wordCount >= selectedPrompt.wordCount ? "text-green-600" : "text-orange-600";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">IELTS Writing Practice</h1>
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              ← Back
            </button>
          </div>

          {/* Task Selector */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => {
                setSelectedTask(1);
                setSelectedPrompt(writingPrompts[0]);
                setUserEssay("");
                setWordCount(0);
                setShowSample(false);
              }}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                selectedTask === 1
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Task 1 - Data Description (150 words)
            </button>
            <button
              onClick={() => {
                setSelectedTask(2);
                setSelectedPrompt(writingPrompts[1]);
                setUserEssay("");
                setWordCount(0);
                setShowSample(false);
              }}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                selectedTask === 2
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Task 2 - Essay Writing (250 words)
            </button>
          </div>

          {/* Prompt Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {getPromptsForTask(selectedTask).map((prompt) => (
              <button
                key={prompt.id}
                onClick={() => {
                  setSelectedPrompt(prompt);
                  setUserEssay("");
                  setWordCount(0);
                  setShowSample(false);
                }}
                className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition ${
                  selectedPrompt.id === prompt.id
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {prompt.type}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Prompt & Tips */}
          <div className="space-y-6">
            {/* Prompt Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  selectedTask === 1 ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                }`}>
                  Task {selectedTask}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{selectedPrompt.title}</h3>
              </div>

              <div className="bg-gray-50 border-l-4 border-blue-600 p-4 rounded-lg mb-4">
                <pre className="whitespace-pre-wrap text-gray-700 font-sans">
                  {selectedPrompt.prompt}
                </pre>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  <span>Min. {selectedPrompt.wordCount} words</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{selectedPrompt.timeLimit} minutes</span>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Writing Tips
              </h3>
              <ul className="space-y-2">
                {selectedPrompt.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-700">
                    <span className="text-blue-600 font-bold">•</span>
                    <span className="text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sample Answer (if available) */}
            {selectedPrompt.sampleAnswer && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                {!showSample ? (
                  <button
                    onClick={() => setShowSample(true)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition"
                  >
                    Show Sample Answer
                  </button>
                ) : (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Sample Answer (Band 7-8)</h3>
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-4">
                      <pre className="whitespace-pre-wrap text-gray-700 font-sans text-sm leading-relaxed">
                        {selectedPrompt.sampleAnswer}
                      </pre>
                    </div>
                    <button
                      onClick={() => setShowSample(false)}
                      className="mt-3 text-sm text-gray-600 hover:text-gray-900"
                    >
                      Hide Sample
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Writing Area */}
          <div className="space-y-6">
            {/* Writing Status */}
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className={`w-5 h-5 ${progressColor}`} />
                  <span className={`font-semibold ${progressColor}`}>
                    {wordCount} / {selectedPrompt.wordCount} words
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-600">{selectedPrompt.timeLimit} min suggested</span>
                </div>
              </div>
            </div>

            {/* Writing Area */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Your Answer</h3>
              <textarea
                value={userEssay}
                onChange={(e) => handleEssayChange(e.target.value)}
                placeholder="Start writing your answer here..."
                className="w-full h-[500px] p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition resize-none font-sans text-gray-700"
              />

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => {
                    setUserEssay("");
                    setWordCount(0);
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Clear
                </button>
                <button
                  disabled={wordCount < selectedPrompt.wordCount}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ✓ Submit for Review
                </button>
              </div>

              {wordCount < selectedPrompt.wordCount && wordCount > 0 && (
                <p className="mt-2 text-sm text-orange-600">
                  ⚠️ You need {selectedPrompt.wordCount - wordCount} more words to meet the minimum requirement
                </p>
              )}
            </div>

            {/* Note */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> AI evaluation and band score prediction is coming soon!
                For now, compare your answer with the sample answer to self-assess.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
