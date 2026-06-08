"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { SpeakingQuestion } from "@/lib/ielts-speaking-questions";

interface Criterion {
  score: number;
  feedback: string;
  improvements: string[];
}

interface SpeakingEvaluation {
  bandScore: number;
  fluencyCoherence: Criterion;
  lexicalResource: Criterion;
  grammaticalRange: Criterion;
  pronunciation: Criterion;
  overallFeedback: string;
}

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
  const [transcript, setTranscript] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<SpeakingEvaluation | null>(null);
  const [evalError, setEvalError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

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

      // Start transcription only AFTER microphone permission is granted
      startTranscription();

      // Auto-stop after speak time for Part 2
      if (question?.part === 2 && question.cueCard) {
        startTimer(question.cueCard.speakTime, "speak");
        setTimeout(() => {
          if (mediaRecorderRef.current && isRecording) {
            stopRecording();
            stopTranscription();
          }
        }, question.cueCard.speakTime * 1000);
      }
    } catch (error) {
      console.error("Recording error:", error);
      const errorMessage = error instanceof DOMException
        ? error.name === 'NotAllowedError'
          ? "Microphone permission denied. Please grant permission and try again."
          : error.name === 'NotFoundError'
          ? "No microphone found. Please connect a microphone and try again."
          : "Microphone access failed. Please check your settings."
        : "Microphone access denied. Please enable microphone permissions in your browser.";
      setRecordingError(errorMessage);
    }
  };

  // Stop voice recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopTranscription(); // Stop transcription when recording stops
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

  // Start transcription using Web Speech API
  const startTranscription = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported in this browser");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsTranscribing(true);
        setTranscript("");
      };

      recognition.onresult = (event: any) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setTranscript((prev) => (prev ? prev + " " + transcript : transcript));
          } else {
            interim += transcript;
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        // Only show error if it's a permission-related issue
        if (event.error === "not-allowed" || event.error === "network") {
          // Silent fail - user can still type transcript manually
        }
        setIsTranscribing(false);
      };

      recognition.onend = () => {
        setIsTranscribing(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (error) {
      console.error("Failed to start speech recognition:", error);
      // Silent fail - transcription is optional, user can type manually
    }
  };

  // Stop transcription
  const stopTranscription = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsTranscribing(false);
    }
  };

  // Evaluate speaking answer
  const handleSpeakingEvaluate = async () => {
    if (!transcript.trim()) {
      setEvalError("Please provide a transcription or answer to evaluate.");
      return;
    }

    setIsEvaluating(true);
    setEvaluation(null);
    setEvalError(null);

    try {
      const questionText = question?.question || (question?.cueCard?.title || "");
      const res = await fetch("/api/english/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "speaking",
          prompt: questionText,
          userText: transcript,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setEvalError(data.error || "Failed to evaluate");
      } else {
        setEvaluation(data.evaluation);
      }
    } catch (error) {
      setEvalError(error instanceof Error ? error.message : "Evaluation failed");
    } finally {
      setIsEvaluating(false);
    }
  };

  const getBandScoreColor = (score: number) => {
    if (score < 5) return "text-red-600";
    if (score < 6.5) return "text-orange-600";
    if (score < 8) return "text-green-600";
    return "text-blue-600";
  };

  const getBandScoreBarColor = (score: number) => {
    if (score < 5) return "bg-red-600";
    if (score < 6.5) return "bg-orange-600";
    if (score < 8) return "bg-green-600";
    return "bg-blue-600";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--primary-bg)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-[var(--foreground-secondary)]">Loading question...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--primary-bg)] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-[var(--card-bg)] rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-[var(--foreground)]">IELTS Speaking Practice</h1>
            <button
              onClick={() => router.push('/english/ielts-toefl/ielts-speaking')}
              className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)] font-medium transition"
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
                    : "bg-[var(--hover-bg)] text-[var(--foreground-secondary)] hover:bg-[rgba(0,0,0,0.1)] dark:hover:bg-[rgba(255,255,255,0.1)]"
                }`}
              >
                Part {part}
              </button>
            ))}
          </div>
        </div>

        {/* Question Card */}
        {question && (
          <div className="bg-[var(--card-bg)] rounded-2xl shadow-lg p-8 mb-6">
            {/* Part 1: Simple Question */}
            {question.part === 1 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-[rgba(168,85,247,0.15)] text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full text-sm font-semibold">
                    Part 1: Interview
                  </span>
                  <span className="text-[var(--foreground-secondary)] text-sm">Topic: {question.topic}</span>
                </div>
                <div className="bg-[var(--hover-bg)] border-l-4 border-purple-600 p-6 rounded-lg mb-6">
                  <p className="text-xl font-semibold text-[var(--foreground)]">{question.question}</p>
                </div>
              </div>
            )}

            {/* Part 2: Cue Card */}
            {question.part === 2 && question.cueCard && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-[rgba(66,85,255,0.15)] text-[#4255FF] dark:text-[#6B7EFF] px-3 py-1 rounded-full text-sm font-semibold">
                    Part 2: Long Turn
                  </span>
                  <span className="text-[var(--foreground-secondary)] text-sm">Topic: {question.topic}</span>
                </div>
                <div className="bg-[var(--hover-bg)] border-l-4 border-[#4255FF] p-6 rounded-lg mb-6">
                  <h3 className="text-xl font-bold text-[var(--foreground)] mb-4">{question.cueCard.title}</h3>
                  <p className="text-[var(--foreground-secondary)] mb-3 font-semibold">You should say:</p>
                  <ul className="space-y-2 mb-4">
                    {question.cueCard.points.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[var(--foreground-secondary)]">
                        <span className="text-[#4255FF] font-bold">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-4 text-sm text-[var(--foreground-secondary)] mt-4 pt-4 border-t border-[var(--card-border)]">
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
                    className="flex-1 bg-[#4255FF] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#3242CC] disabled:bg-[var(--hover-bg)] disabled:text-[var(--foreground-secondary)] disabled:cursor-not-allowed transition"
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
                  <span className="bg-[rgba(34,197,94,0.15)] text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                    Part 3: Discussion
                  </span>
                  <span className="text-[var(--foreground-secondary)] text-sm">Topic: {question.topic}</span>
                </div>
                <div className="bg-[var(--hover-bg)] border-l-4 border-green-600 p-6 rounded-lg mb-6">
                  <p className="text-xl font-semibold text-[var(--foreground)]">{question.question}</p>
                </div>
              </div>
            )}

            {/* Timer Display */}
            {timerType && (
              <div className="bg-[rgba(253,224,71,0.15)] border border-[rgba(234,179,8,0.3)] dark:border-[rgba(253,224,71,0.3)] rounded-lg p-4 mb-6 text-center">
                <p className="text-sm text-[rgba(234,179,8,0.8)] dark:text-[rgba(253,224,71,0.7)] mb-1">
                  {timerType === "prep" ? "⏱️ Preparation Time" : "🎤 Speaking Time"}
                </p>
                <p className="text-3xl font-bold text-[rgba(180,83,9,0.8)] dark:text-[rgba(253,224,71,0.9)]">{formatTime(timer)}</p>
              </div>
            )}

            {/* Recording Controls */}
            <div className="bg-[var(--hover-bg)] rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-[var(--foreground)] mb-3 flex items-center gap-2">
                <span>🎙️</span>
                Voice Recording
              </h3>
              {recordingError && (
                <div className="bg-[rgba(220,38,38,0.1)] border border-[rgba(220,38,38,0.3)] text-[#DC2626] rounded-lg p-3 mb-4 text-sm">
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
                    className="flex-1 bg-[var(--muted)] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[rgba(0,0,0,0.5)] dark:hover:bg-[rgba(255,255,255,0.3)] transition flex items-center justify-center gap-2 animate-pulse"
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
                      className="bg-[var(--hover-bg)] text-[var(--foreground-secondary)] py-3 px-6 rounded-lg font-semibold hover:bg-[rgba(0,0,0,0.1)] dark:hover:bg-[rgba(255,255,255,0.1)] transition"
                    >
                      Record Again
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-[var(--hover-bg)] rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-[var(--foreground)] mb-3 flex items-center gap-2">
                <span>💡</span>
                Tips
              </h3>
              <ul className="space-y-2">
                {question.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[var(--foreground-secondary)]">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Keywords */}
            <div className="bg-[var(--hover-bg)] rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-[var(--foreground)] mb-3 flex items-center gap-2">
                <span>🔑</span>
                Useful Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {question.keywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="bg-[rgba(66,85,255,0.15)] text-[#4255FF] dark:text-[#6B7EFF] px-3 py-1 rounded-full text-sm font-medium"
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
                <div className="bg-[var(--hover-bg)] border-2 border-[var(--card-border)] rounded-lg p-6">
                  <h3 className="font-semibold text-[var(--foreground)] mb-3 flex items-center gap-2">
                    <span>📝</span>
                    Sample Answer
                  </h3>
                  <p className="text-[var(--foreground-secondary)] leading-relaxed whitespace-pre-line">
                    {question.sampleAnswer}
                  </p>
                </div>
              )}
            </div>

            {/* Transcription & Evaluation */}
            {audioUrl && (
              <div className="mt-6 bg-[var(--card-bg)] border-2 border-[var(--card-border)] rounded-lg p-6 space-y-4">
                <h3 className="font-semibold text-[var(--foreground)] flex items-center gap-2">
                  <span>🎤</span> Transcription
                </h3>

                {/* Transcription Text Area */}
                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Your speech will appear here... You can also type or edit your answer manually"
                  className="w-full h-[200px] p-4 border-2 border-[var(--card-border)] rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition resize-none font-sans text-[var(--foreground)] bg-[var(--primary-bg)]"
                />

                <div className="text-xs text-[var(--foreground-secondary)] space-y-1">
                  <p>ℹ️ <strong>Speech Recognition:</strong> If enabled, your answer will auto-transcribe here. {isTranscribing ? "🎤 Recording..." : "Or type/paste your answer below."}</p>
                  <p>✏️ You can edit the transcription to correct any errors before evaluation.</p>
                </div>

                {/* Evaluation Error */}
                {evalError && (
                  <div className="bg-[rgba(220,38,38,0.1)] border border-[rgba(220,38,38,0.3)] dark:border-[rgba(220,38,38,0.5)] rounded-lg p-4">
                    <p className="text-sm text-[#DC2626] dark:text-[#FF6B6B]">
                      <strong>Evaluation Error:</strong> {evalError}
                    </p>
                  </div>
                )}

                {/* Evaluate Button */}
                {!evaluation && (
                  <button
                    onClick={handleSpeakingEvaluate}
                    disabled={!transcript.trim() || isEvaluating}
                    className="w-full bg-[#4255FF] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#3242CC] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isEvaluating ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Evaluating...
                      </>
                    ) : (
                      <>✨ Evaluate with AI</>
                    )}
                  </button>
                )}

                {/* Evaluation Results */}
                {evaluation && !evalError && (
                  <div className="bg-[rgba(66,85,255,0.1)] border border-[rgba(66,85,255,0.3)] rounded-lg p-6 space-y-4">
                    {/* Header with Band Score */}
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-[var(--foreground)] flex items-center gap-2">
                        <span>🎯</span> AI Evaluation
                      </h4>
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${getBandScoreColor(evaluation.bandScore)}`}>
                          {evaluation.bandScore.toFixed(1)}
                        </p>
                        <p className="text-xs text-[var(--foreground-secondary)]">Band Score</p>
                      </div>
                    </div>

                    {/* Criteria */}
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-[var(--foreground)] text-sm">Fluency & Coherence</span>
                          <span className={`font-bold text-sm ${getBandScoreColor(evaluation.fluencyCoherence.score)}`}>
                            {evaluation.fluencyCoherence.score.toFixed(1)}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--foreground-secondary)]">{evaluation.fluencyCoherence.feedback}</p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-[var(--foreground)] text-sm">Lexical Resource</span>
                          <span className={`font-bold text-sm ${getBandScoreColor(evaluation.lexicalResource.score)}`}>
                            {evaluation.lexicalResource.score.toFixed(1)}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--foreground-secondary)]">{evaluation.lexicalResource.feedback}</p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-[var(--foreground)] text-sm">Grammar & Range</span>
                          <span className={`font-bold text-sm ${getBandScoreColor(evaluation.grammaticalRange.score)}`}>
                            {evaluation.grammaticalRange.score.toFixed(1)}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--foreground-secondary)]">{evaluation.grammaticalRange.feedback}</p>
                      </div>
                    </div>

                    {/* Overall Feedback */}
                    <div className="border-t border-[rgba(66,85,255,0.3)] pt-3">
                      <p className="text-sm text-[var(--foreground-secondary)]">{evaluation.overallFeedback}</p>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => {
                        setEvaluation(null);
                        setTranscript("");
                      }}
                      className="w-full bg-[var(--hover-bg)] text-[var(--foreground)] py-2 px-4 rounded-lg font-semibold hover:bg-[rgba(0,0,0,0.1)] dark:hover:bg-[rgba(255,255,255,0.1)] transition text-sm"
                    >
                      Try New Question
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={loadQuestion}
            className="flex-1 bg-[var(--card-bg)] text-[var(--foreground)] py-4 px-6 rounded-lg font-semibold hover:bg-[var(--hover-bg)] transition shadow-lg"
          >
            Next Question
          </button>
        </div>
      </div>
    </div>
  );
}
