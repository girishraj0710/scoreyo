"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mic, Square, Play, Download, FileText, Clock, Target } from "lucide-react";

interface PresentationTopic {
  id: string;
  title: string;
  description: string;
  duration: number;
  outline: string[];
  tips: string[];
  sampleScript?: string;
}

const presentationTopics: PresentationTopic[] = [
  {
    id: "intro-yourself",
    title: "Introduce Yourself",
    description: "A 2-minute self-introduction for professional settings",
    duration: 120,
    outline: [
      "Opening greeting",
      "Name and background",
      "Education and expertise",
      "Current role/achievements",
      "Personal interests",
      "Closing statement",
    ],
    tips: [
      "Maintain confident posture and eye contact",
      "Speak clearly and at moderate pace",
      "Smile and show enthusiasm",
      "Use simple, professional language",
      "Practice multiple times before recording",
    ],
    sampleScript: `Good morning everyone! My name is Priya Sharma, and I'm delighted to have this opportunity to introduce myself.

I hold a Bachelor's degree in Computer Science from Delhi University and have been working in the software development field for the past three years. Currently, I'm employed as a Senior Developer at Tech Solutions, where I specialize in mobile app development and user experience design.

Throughout my career, I've successfully led several projects from conception to deployment, including a healthcare app that's now used by over 50,000 people. I'm passionate about creating technology that makes a real difference in people's lives.

Outside of work, I enjoy photography and hiking. These hobbies help me maintain work-life balance and often inspire creative solutions to technical challenges.

I'm excited to be here today and look forward to contributing my skills and learning from all of you. Thank you for your time!

(Duration: ~90 seconds)`,
  },
  {
    id: "product-pitch",
    title: "Product Pitch",
    description: "A 3-minute presentation pitching a product or service",
    duration: 180,
    outline: [
      "Hook - grab attention",
      "Problem statement",
      "Your solution",
      "Key features and benefits",
      "Proof/evidence",
      "Call to action",
    ],
    tips: [
      "Start with a compelling hook or statistic",
      "Focus on benefits, not just features",
      "Use storytelling to make it memorable",
      "Show enthusiasm for your product",
      "End with a clear call to action",
    ],
    sampleScript: `Imagine wasting 30 minutes every day looking for your car keys, phone, or wallet. That's 182 hours per year – over a week of your life lost!

Hello everyone, I'm here to introduce FindIt – a small Bluetooth tracker that solves this frustrating daily problem. Simply attach FindIt tags to your valuable items, and you'll never lose them again.

Here's how it works: When you misplace something, open our app and make the tag beep. Within seconds, you'll locate your item. If it's out of Bluetooth range, our community network helps you find it using other users' phones anonymously.

FindIt offers three key benefits: First, it saves you time – no more frantic searching. Second, it reduces stress – peace of mind knowing you can always find your belongings. Third, it's affordable – just $20 for a pack of four tags.

Over 100,000 users worldwide already trust FindIt. Customer Sarah says, "This tiny device saved my wedding rings when I left them at a restaurant."

Ready to stop wasting time? Visit FindIt.com today and use code PRESENT20 for 20% off. Thank you!

(Duration: ~120 seconds)`,
  },
  {
    id: "company-overview",
    title: "Company Overview",
    description: "A 3-minute presentation about your company",
    duration: 180,
    outline: [
      "Company name and tagline",
      "Mission and vision",
      "Products/services",
      "Achievements and milestones",
      "Team and values",
      "Future goals",
    ],
    tips: [
      "Tell your company's story compellingly",
      "Highlight unique selling points",
      "Include impressive metrics or achievements",
      "Show passion for your company's mission",
      "Make it engaging, not just factual",
    ],
  },
  {
    id: "project-update",
    title: "Project Status Update",
    description: "A 2-minute update on project progress",
    duration: 120,
    outline: [
      "Project overview",
      "Completed milestones",
      "Current status",
      "Challenges faced",
      "Next steps",
      "Timeline",
    ],
    tips: [
      "Be transparent about both progress and challenges",
      "Use visuals if possible (describe them)",
      "Highlight team contributions",
      "Address concerns proactively",
      "Be specific about timelines",
    ],
  },
  {
    id: "persuasive-speech",
    title: "Persuasive Speech",
    description: "A 3-minute speech to persuade your audience",
    duration: 180,
    outline: [
      "Attention-grabbing opening",
      "State your position",
      "Present evidence",
      "Address counterarguments",
      "Emotional appeal",
      "Strong conclusion",
    ],
    tips: [
      "Use rhetorical questions",
      "Include statistics and facts",
      "Appeal to emotions and logic",
      "Acknowledge opposing views",
      "End with memorable statement",
    ],
  },
];

export default function PresentationsPage() {
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState<PresentationTopic>(presentationTopics[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showScript, setShowScript] = useState(false);
  const [recordingError, setRecordingError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setRecordingError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Recording error:", error);
      setRecordingError("Microphone access denied. Please enable microphone permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
  };

  const downloadRecording = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `presentation-${selectedTopic.id}-${Date.now()}.webm`;
      a.click();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Presentation Practice</h1>
            <button
              onClick={() => router.push("/english/real-world/presentations")}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              ← Back
            </button>
          </div>

          {/* Topic Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {presentationTopics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => {
                  setSelectedTopic(topic);
                  setAudioBlob(null);
                  setAudioUrl(null);
                  setRecordingTime(0);
                  setShowScript(false);
                }}
                className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition ${
                  selectedTopic.id === topic.id
                    ? "bg-gradient-to-r from-blue-600 to-[#4255FF] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {topic.title}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Guidelines */}
          <div className="space-y-6">
            {/* Topic Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedTopic.title}</h2>
              <p className="text-gray-600 mb-4">{selectedTopic.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{selectedTopic.duration / 60} minutes</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  <span>Practice speaking</span>
                </div>
              </div>
            </div>

            {/* Outline */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#4255FF]" />
                Presentation Outline
              </h3>
              <ol className="space-y-2">
                {selectedTopic.outline.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-700">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-[#4255FF] flex items-center justify-center text-sm font-semibold">
                      {idx + 1}
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Tips */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">💡 Presentation Tips</h3>
              <ul className="space-y-2">
                {selectedTopic.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-700">
                    <span className="text-[#4255FF] font-bold">•</span>
                    <span className="text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sample Script */}
            {selectedTopic.sampleScript && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                {!showScript ? (
                  <button
                    onClick={() => setShowScript(true)}
                    className="w-full bg-gradient-to-r from-blue-600 to-[#4255FF] text-white py-3 px-6 rounded-lg font-semibold transition"
                  >
                    Show Sample Script
                  </button>
                ) : (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Sample Script</h3>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4">
                      <pre className="whitespace-pre-wrap text-gray-700 font-sans text-sm leading-relaxed">
                        {selectedTopic.sampleScript}
                      </pre>
                    </div>
                    <button
                      onClick={() => setShowScript(false)}
                      className="mt-3 text-sm text-gray-600 hover:text-gray-900"
                    >
                      Hide Script
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Recording */}
          <div className="space-y-6">
            {/* Recording Timer */}
            {isRecording && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                  <span className="text-red-700 font-semibold">Recording...</span>
                </div>
                <p className="text-4xl font-bold text-red-900">{formatTime(recordingTime)}</p>
                <p className="text-sm text-red-600 mt-2">
                  Target: {formatTime(selectedTopic.duration)}
                </p>
              </div>
            )}

            {/* Recording Controls */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Mic className="w-5 h-5 text-[#4255FF]" />
                Record Your Presentation
              </h3>

              {recordingError && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
                  {recordingError}
                </div>
              )}

              <div className="space-y-4">
                {!isRecording && !audioUrl && (
                  <button
                    onClick={startRecording}
                    className="w-full bg-red-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
                  >
                    <Mic className="w-5 h-5" />
                    Start Recording
                  </button>
                )}

                {isRecording && (
                  <button
                    onClick={stopRecording}
                    className="w-full bg-gray-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-gray-700 transition flex items-center justify-center gap-2"
                  >
                    <Square className="w-5 h-5" />
                    Stop Recording
                  </button>
                )}

                {audioUrl && !isRecording && (
                  <div className="space-y-3">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-700 font-semibold mb-2">✓ Recording Complete!</p>
                      <p className="text-sm text-green-600">Duration: {formatTime(recordingTime)}</p>
                    </div>
                    <audio src={audioUrl} controls className="w-full" />
                    <div className="flex gap-3">
                      <button
                        onClick={downloadRecording}
                        className="flex-1 bg-[#4255FF] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#3242CC] transition flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                      <button
                        onClick={() => {
                          setAudioBlob(null);
                          setAudioUrl(null);
                          setRecordingTime(0);
                        }}
                        className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition"
                      >
                        Record Again
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-[#E8EAFF] border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">📋 Instructions:</h4>
              <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                <li>Review the outline and tips</li>
                <li>Prepare your presentation mentally</li>
                <li>Click "Start Recording" when ready</li>
                <li>Deliver your presentation confidently</li>
                <li>Listen to playback and self-evaluate</li>
                <li>Download your recording (optional)</li>
              </ol>
            </div>

            {/* Evaluation Criteria */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">✅ Self-Evaluation Checklist</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span>□</span>
                  <span>Clear and confident delivery</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>□</span>
                  <span>Appropriate pace (not too fast/slow)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>□</span>
                  <span>Good pronunciation and enunciation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>□</span>
                  <span>Logical structure and flow</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>□</span>
                  <span>Engaging content and examples</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>□</span>
                  <span>Appropriate use of pauses</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>□</span>
                  <span>Strong opening and closing</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
