"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { SpeakingQuestion } from "@/lib/ielts-speaking-questions";

export default function IELTSSpeakingPracticePage() {
  const router = useRouter();
  const [selectedPart, setSelectedPart] = useState<1 | 2 | 3>(1);
  const [question, setQuestion] = useState<SpeakingQuestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSampleAnswer, setShowSampleAnswer] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const [timerType, setTimerType] = useState<"prep" | "speak" | null>(null);
  const [recordingError, setRecordingError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load a random question for the selected part
  const loadQuestion = async () => {
    setLoading(true);
    setShowSampleAnswer(false);
    setAudioBlob(null);
    setAudioUrl(null);
    setTimer(0);
    setTimerType(null);
    setRecordingError(null);

    try {
      const res = await fetch(`/api/english/speaking?part=${selectedPart}&random=true`);
      const data = await res.json();
      setQuestion(data.question);
    } catch (error) {
      console.error("Failed to load question:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestion();
  }, [selectedPart]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  // Timer countdown logic
  const startTimer = (seconds: number, type: "prep" | "speak") => {
    setTimer(seconds);
    setTimerType(type);

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    timerIntervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
          }
          setTimerType(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Start voice recording
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

      // Auto-stop after speak time for Part 2
      if (question?.part === 2 && question.cueCard) {
        startTimer(question.cueCard.speakTime, "speak");
        setTimeout(() => {
          if (mediaRecorderRef.current && isRecording) {
            stopRecording();
          }
        }, question.cueCard.speakTime * 1000);
      }
    } catch (error) {
      console.error("Recording error:", error);
      setRecordingError("Microphone access denied. Please enable microphone permissions in your browser.");
    }
  };

  // Stop voice recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      setTimerType(null);
    }
  };

  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading question...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">IELTS Speaking Practice</h1>
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              ← Back
            </button>
          </div>

          {/* Part Selector */}
          <div className="flex gap-2">
            {[1, 2, 3].map((part) => (
              <button
                key={part}
                onClick={() => setSelectedPart(part as 1 | 2 | 3)}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                  selectedPart === part
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Part {part}
              </button>
            ))}
          </div>
        </div>

        {/* Question Card */}
        {question && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            {/* Part 1: Simple Question */}
            {question.part === 1 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                    Part 1: Interview
                  </span>
                  <span className="text-gray-600 text-sm">Topic: {question.topic}</span>
                </div>
                <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded-lg mb-6">
                  <p className="text-xl font-semibold text-gray-900">{question.question}</p>
                </div>
              </div>
            )}

            {/* Part 2: Cue Card */}
            {question.part === 2 && question.cueCard && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-blue-100 text-[#0070A8] px-3 py-1 rounded-full text-sm font-semibold">
                    Part 2: Long Turn
                  </span>
                  <span className="text-gray-600 text-sm">Topic: {question.topic}</span>
                </div>
                <div className="bg-[#E6F4F9] border-l-4 border-[#00A1E0] p-6 rounded-lg mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{question.cueCard.title}</h3>
                  <p className="text-gray-700 mb-3 font-semibold">You should say:</p>
                  <ul className="space-y-2 mb-4">
                    {question.cueCard.points.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-700">
                        <span className="text-[#00A1E0] font-bold">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-4 text-sm text-gray-600 mt-4 pt-4 border-t border-blue-200">
                    <div className="flex items-center gap-1">
                      <span>⏱️</span>
                      <span>Preparation: {question.cueCard.prepTime / 60} minute</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>🎤</span>
                      <span>Speaking: {question.cueCard.speakTime / 60} minutes</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mb-6">
                  <button
                    onClick={() => startTimer(question.cueCard!.prepTime, "prep")}
                    disabled={timerType !== null}
                    className="flex-1 bg-[#00A1E0] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#0070A8] disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                  >
                    Start Preparation Timer
                  </button>
                </div>
              </div>
            )}

            {/* Part 3: Discussion */}
            {question.part === 3 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    Part 3: Discussion
                  </span>
                  <span className="text-gray-600 text-sm">Topic: {question.topic}</span>
                </div>
                <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-lg mb-6">
                  <p className="text-xl font-semibold text-gray-900">{question.question}</p>
                </div>
              </div>
            )}

            {/* Timer Display */}
            {timerType && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-center">
                <p className="text-sm text-yellow-700 mb-1">
                  {timerType === "prep" ? "⏱️ Preparation Time" : "🎤 Speaking Time"}
                </p>
                <p className="text-3xl font-bold text-yellow-900">{formatTime(timer)}</p>
              </div>
            )}

            {/* Recording Controls */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span>🎙️</span>
                Voice Recording
              </h3>
              {recordingError && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
                  {recordingError}
                </div>
              )}
              <div className="flex gap-3">
                {!isRecording && !audioUrl && (
                  <button
                    onClick={startRecording}
                    className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
                  >
                    <span className="text-xl">●</span>
                    Start Recording
                  </button>
                )}
                {isRecording && (
                  <button
                    onClick={stopRecording}
                    className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition flex items-center justify-center gap-2 animate-pulse"
                  >
                    <span className="text-xl">■</span>
                    Stop Recording
                  </button>
                )}
                {audioUrl && !isRecording && (
                  <div className="flex-1 flex gap-3">
                    <audio src={audioUrl} controls className="flex-1" />
                    <button
                      onClick={() => {
                        setAudioBlob(null);
                        setAudioUrl(null);
                      }}
                      className="bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition"
                    >
                      Record Again
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-purple-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span>💡</span>
                Tips
              </h3>
              <ul className="space-y-2">
                {question.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-700">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Keywords */}
            <div className="bg-[#E6F4F9] rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span>🔑</span>
                Useful Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {question.keywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* Sample Answer */}
            <div>
              {!showSampleAnswer ? (
                <button
                  onClick={() => setShowSampleAnswer(true)}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition"
                >
                  Show Sample Answer
                </button>
              ) : (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span>📝</span>
                    Sample Answer
                  </h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {question.sampleAnswer}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={loadQuestion}
            className="flex-1 bg-white text-gray-900 py-4 px-6 rounded-lg font-semibold hover:bg-gray-50 transition shadow-lg"
          >
            Next Question
          </button>
        </div>
      </div>
    </div>
  );
}
