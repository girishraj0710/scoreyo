"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Play, Pause, Volume2, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface IELTSSection {
  id: number;
  title: string;
  description: string;
  audioUrl: string;
  duration: string;
  questions: IELTSQuestion[];
}

interface IELTSQuestion {
  id: number;
  type: "multiple-choice" | "fill-blank" | "matching" | "map-labeling";
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
}

const ieltsListeningTest: IELTSSection[] = [
  {
    id: 1,
    title: "Section 1: Social Needs",
    description: "A conversation between two people in an everyday social context (e.g., booking accommodation)",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: "4:30",
    questions: [
      {
        id: 1,
        type: "fill-blank",
        question: "The customer wants to book accommodation for ____ nights.",
        correctAnswer: "5",
        explanation: "The customer mentions staying for 5 nights specifically.",
      },
      {
        id: 2,
        type: "fill-blank",
        question: "The check-in date is ____ June.",
        correctAnswer: "15th",
        explanation: "The date mentioned is the 15th of June.",
      },
      {
        id: 3,
        type: "multiple-choice",
        question: "What type of room does the customer prefer?",
        options: ["Single room", "Double room", "Twin room", "Suite"],
        correctAnswer: 2,
        explanation: "The customer requests a twin room with two separate beds.",
      },
      {
        id: 4,
        type: "fill-blank",
        question: "The breakfast is served from 7:00 AM to ____ AM.",
        correctAnswer: "10:00",
        explanation: "Breakfast service ends at 10:00 AM.",
      },
      {
        id: 5,
        type: "multiple-choice",
        question: "How will the customer pay?",
        options: ["Cash", "Credit card", "Bank transfer", "Debit card"],
        correctAnswer: 1,
        explanation: "The customer mentions paying with a credit card.",
      },
    ],
  },
  {
    id: 2,
    title: "Section 2: Social Context",
    description: "A monologue set in an everyday social context (e.g., a speech about local facilities)",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: "5:00",
    questions: [
      {
        id: 6,
        type: "multiple-choice",
        question: "When was the community center built?",
        options: ["1985", "1990", "1995", "2000"],
        correctAnswer: 1,
        explanation: "The speaker mentions the center was built in 1990.",
      },
      {
        id: 7,
        type: "fill-blank",
        question: "The center has ____ meeting rooms available for rent.",
        correctAnswer: "3",
        explanation: "Three meeting rooms are available for public rental.",
      },
      {
        id: 8,
        type: "multiple-choice",
        question: "Which facility was recently renovated?",
        options: ["Swimming pool", "Gym", "Library", "Cafeteria"],
        correctAnswer: 0,
        explanation: "The swimming pool underwent renovation last year.",
      },
      {
        id: 9,
        type: "fill-blank",
        question: "The annual membership fee is £____.",
        correctAnswer: "50",
        explanation: "Annual membership costs £50.",
      },
      {
        id: 10,
        type: "multiple-choice",
        question: "What classes are offered on weekends?",
        options: ["Yoga only", "Dance only", "Both yoga and dance", "Neither"],
        correctAnswer: 2,
        explanation: "Both yoga and dance classes are available on weekends.",
      },
    ],
  },
  {
    id: 3,
    title: "Section 3: Educational/Training",
    description: "A conversation between up to four people in an educational or training context (e.g., university discussion)",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: "5:30",
    questions: [
      {
        id: 11,
        type: "multiple-choice",
        question: "What is the main topic of the group project?",
        options: [
          "Climate change",
          "Renewable energy",
          "Water conservation",
          "Urban planning"
        ],
        correctAnswer: 1,
        explanation: "The group is working on a renewable energy project.",
      },
      {
        id: 12,
        type: "fill-blank",
        question: "The project deadline is ____ March.",
        correctAnswer: "28th",
        explanation: "The deadline is set for the 28th of March.",
      },
      {
        id: 13,
        type: "multiple-choice",
        question: "Who will research solar panel efficiency?",
        options: ["Emma", "David", "Sarah", "Professor"],
        correctAnswer: 0,
        explanation: "Emma volunteers to research solar panel efficiency.",
      },
      {
        id: 14,
        type: "fill-blank",
        question: "The group will meet ____ times per week.",
        correctAnswer: "2",
        explanation: "They agree to meet twice weekly.",
      },
      {
        id: 15,
        type: "multiple-choice",
        question: "Where will they conduct their field research?",
        options: [
          "University campus",
          "Local power plant",
          "Nearby solar farm",
          "Community center"
        ],
        correctAnswer: 2,
        explanation: "They plan to visit a nearby solar farm for field research.",
      },
    ],
  },
  {
    id: 4,
    title: "Section 4: Academic Lecture",
    description: "A monologue on an academic subject (e.g., university lecture)",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    duration: "6:00",
    questions: [
      {
        id: 16,
        type: "fill-blank",
        question: "Photosynthesis converts light energy into ____ energy.",
        correctAnswer: "chemical",
        explanation: "Photosynthesis converts light into chemical energy stored in glucose.",
      },
      {
        id: 17,
        type: "multiple-choice",
        question: "What is produced as a byproduct of photosynthesis?",
        options: ["Carbon dioxide", "Oxygen", "Nitrogen", "Hydrogen"],
        correctAnswer: 1,
        explanation: "Oxygen is released as a byproduct of photosynthesis.",
      },
      {
        id: 18,
        type: "fill-blank",
        question: "Chlorophyll is found in organelles called ____.",
        correctAnswer: "chloroplasts",
        explanation: "Chlorophyll is contained within chloroplasts.",
      },
      {
        id: 19,
        type: "multiple-choice",
        question: "Which wavelength of light is LEAST absorbed by chlorophyll?",
        options: ["Red", "Blue", "Green", "Violet"],
        correctAnswer: 2,
        explanation: "Green light is reflected, not absorbed, which is why plants appear green.",
      },
      {
        id: 20,
        type: "fill-blank",
        question: "The light-independent reactions are also called the ____ cycle.",
        correctAnswer: "Calvin",
        explanation: "The Calvin cycle is another name for light-independent reactions.",
      },
    ],
  },
];

export default function IELTSListeningPage() {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [testTime, setTestTime] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const section = ieltsListeningTest[currentSection];
  const totalQuestions = ieltsListeningTest.reduce((sum, sec) => sum + sec.questions.length, 0);

  const startTest = () => {
    setTestStarted(true);
    timerRef.current = setInterval(() => {
      setTestTime((prev) => prev + 1);
    }, 1000);
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextSection = () => {
    if (currentSection < ieltsListeningTest.length - 1) {
      setCurrentSection(currentSection + 1);
      setIsPlaying(false);
      setCurrentTime(0);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  };

  const previousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      setIsPlaying(false);
      setCurrentTime(0);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    if (!showResults) {
      setUserAnswers({ ...userAnswers, [questionId]: answer });
    }
  };

  const submitTest = () => {
    if (Object.keys(userAnswers).length < totalQuestions) {
      alert("Please answer all questions before submitting.");
      return;
    }
    setShowResults(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    ieltsListeningTest.forEach((section) => {
      section.questions.forEach((q) => {
        const userAnswer = userAnswers[q.id]?.toString().toLowerCase().trim();
        const correctAnswer = q.correctAnswer.toString().toLowerCase().trim();
        if (userAnswer === correctAnswer) {
          correct++;
        }
      });
    });
    return correct;
  };

  const getBandScore = (correct: number) => {
    if (correct >= 39) return 9.0;
    if (correct >= 37) return 8.5;
    if (correct >= 35) return 8.0;
    if (correct >= 32) return 7.5;
    if (correct >= 30) return 7.0;
    if (correct >= 26) return 6.5;
    if (correct >= 23) return 6.0;
    if (correct >= 18) return 5.5;
    if (correct >= 16) return 5.0;
    if (correct >= 13) return 4.5;
    return 4.0;
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const isAnswerCorrect = (questionId: number) => {
    const question = ieltsListeningTest
      .flatMap(s => s.questions)
      .find(q => q.id === questionId);
    if (!question) return false;
    const userAnswer = userAnswers[questionId]?.toString().toLowerCase().trim();
    const correctAnswer = question.correctAnswer.toString().toLowerCase().trim();
    return userAnswer === correctAnswer;
  };

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-[var(--primary-bg)] py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[var(--card-bg)] rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-[var(--foreground)]">IELTS Listening Test</h1>
              <button
                onClick={() => router.push("/english/ielts-toefl/ielts-listening")}
                className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)] font-medium"
              >
                ← Back
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-[rgba(66,85,255,0.15)] border-2 border-[var(--card-border)] rounded-lg p-6">
                <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">Test Format</h2>
                <ul className="space-y-2 text-[var(--foreground-secondary)]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#4255FF] font-bold">•</span>
                    <span>4 sections with 20 questions total</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4255FF] font-bold">•</span>
                    <span>Each section is played only ONCE</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4255FF] font-bold">•</span>
                    <span>Approximately 30 minutes listening time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4255FF] font-bold">•</span>
                    <span>Answer while listening or immediately after</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[rgba(66,85,255,0.15)] border-2 border-[var(--card-border)] rounded-lg p-6">
                <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">Sections Overview</h2>
                {ieltsListeningTest.map((section, idx) => (
                  <div key={section.id} className="mb-4 last:mb-0">
                    <h3 className="font-semibold text-[var(--foreground)]">Section {idx + 1}</h3>
                    <p className="text-sm text-[var(--foreground-secondary)]">{section.description}</p>
                    <p className="text-xs text-[var(--muted)] mt-1">
                      {section.questions.length} questions • {section.duration}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-[rgba(245,158,11,0.1)] border-2 border-[var(--card-border)] rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-[#F59E0B] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-[var(--foreground)] mb-2">Important Instructions</h3>
                    <ul className="space-y-1 text-sm text-[var(--foreground-secondary)]">
                      <li>• Read questions carefully before listening</li>
                      <li>• You can navigate between sections</li>
                      <li>• Audio plays only once per section (like real IELTS)</li>
                      <li>• Use headphones for best experience</li>
                      <li>• Timer starts when you begin the test</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={startTest}
                className="w-full bg-gradient-to-r from-blue-600 to-[#4255FF] text-white py-4 px-6 rounded-lg text-lg font-semibold transition"
              >
                Start IELTS Listening Test
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--primary-bg)] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Timer */}
        <div className="bg-[var(--card-bg)] rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-[var(--foreground)]">IELTS Listening Test</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-[rgba(66,85,255,0.15)] px-4 py-2 rounded-lg">
                <Clock className="w-5 h-5 text-[#4255FF]" />
                <span className="font-semibold text-[#4255FF]">{formatTime(testTime)}</span>
              </div>
              <button
                onClick={() => router.push("/english/ielts-toefl/ielts-listening")}
                className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)] font-medium"
              >
                ← Exit
              </button>
            </div>
          </div>

          {/* Section Navigation */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {ieltsListeningTest.map((sec, idx) => (
              <button
                key={sec.id}
                onClick={() => {
                  setCurrentSection(idx);
                  setIsPlaying(false);
                  if (audioRef.current) audioRef.current.pause();
                }}
                className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition ${
                  currentSection === idx
                    ? "bg-gradient-to-r from-blue-600 to-[#4255FF] text-white"
                    : "bg-[var(--hover-bg)] text-[var(--foreground-secondary)] hover:bg-[var(--card-border)]"
                }`}
              >
                Section {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Results Summary */}
        {showResults && (
          <div className="bg-[var(--card-bg)] rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">📊 Test Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[rgba(66,85,255,0.15)] border-2 border-[var(--card-border)] rounded-lg p-6 text-center">
                <p className="text-sm text-[var(--foreground-secondary)] mb-2">Correct Answers</p>
                <p className="text-5xl font-bold text-[#4255FF]">{calculateScore()}/{totalQuestions}</p>
              </div>
              <div className="bg-[rgba(16,185,129,0.1)] border-2 border-[var(--card-border)] rounded-lg p-6 text-center">
                <p className="text-sm text-[var(--foreground-secondary)] mb-2">Band Score</p>
                <p className="text-5xl font-bold text-[#10B981]">{getBandScore(calculateScore())}</p>
              </div>
              <div className="bg-[rgba(168,85,247,0.1)] border-2 border-[var(--card-border)] rounded-lg p-6 text-center">
                <p className="text-sm text-[var(--foreground-secondary)] mb-2">Time Taken</p>
                <p className="text-5xl font-bold text-[#A855F7]">{formatTime(testTime)}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Audio & Info */}
          <div className="space-y-6">
            {/* Section Info */}
            <div className="bg-[var(--card-bg)] rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">{section.title}</h2>
              <p className="text-sm text-[var(--foreground-secondary)] mb-4">{section.description}</p>

              {/* Audio Player */}
              <div className="bg-[rgba(66,85,255,0.15)] border-2 border-[var(--card-border)] rounded-lg p-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Volume2 className="w-6 h-6 text-[#4255FF]" />
                  <h3 className="font-semibold text-[var(--foreground)]">Section {currentSection + 1} Audio</h3>
                </div>

                <audio
                  ref={audioRef}
                  src={section.audioUrl}
                  onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                  onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                  onEnded={() => setIsPlaying(false)}
                />

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-[var(--foreground-secondary)] mb-2">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <div className="w-full bg-[var(--hover-bg)] rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-[#4255FF] h-2 rounded-full transition-all"
                      style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={togglePlayPause}
                  disabled={showResults}
                  className="w-full bg-[#4255FF] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#3242CC] transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  {isPlaying ? "Pause Audio" : "Play Audio"}
                </button>

                <p className="text-xs text-center text-[var(--muted)] mt-2">
                  ⚠️ Audio plays once only (like real IELTS test)
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-3">
              <button
                onClick={previousSection}
                disabled={currentSection === 0}
                className="flex-1 bg-[var(--hover-bg)] text-[var(--foreground-secondary)] py-3 px-4 rounded-lg font-semibold hover:bg-[var(--card-border)] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous Section
              </button>
              <button
                onClick={nextSection}
                disabled={currentSection === ieltsListeningTest.length - 1}
                className="flex-1 bg-[#4255FF] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#3242CC] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Section →
              </button>
            </div>

            {!showResults && currentSection === ieltsListeningTest.length - 1 && (
              <button
                onClick={submitTest}
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-teal-700 transition"
              >
                Submit Test
              </button>
            )}
          </div>

          {/* Right Column - Questions */}
          <div className="bg-[var(--card-bg)] rounded-2xl shadow-lg p-6">
            <h3 className="font-semibold text-[var(--foreground)] mb-4">
              Questions {section.questions[0].id} - {section.questions[section.questions.length - 1].id}
            </h3>

            <div className="space-y-6">
              {section.questions.map((question, qIdx) => {
                const isCorrect = showResults ? isAnswerCorrect(question.id) : false;

                return (
                  <div key={question.id} className="border-b border-[var(--card-border)] pb-6 last:border-0">
                    <div className="flex items-start justify-between mb-3">
                      <p className="font-semibold text-[var(--foreground)] flex-1">
                        {question.id}. {question.question}
                      </p>
                      {showResults && (
                        <div>
                          {isCorrect ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-600" />
                          )}
                        </div>
                      )}
                    </div>

                    {question.type === "multiple-choice" && question.options && (
                      <div className="space-y-2">
                        {question.options.map((option, optIdx) => {
                          const isSelected = userAnswers[question.id] === optIdx.toString();
                          const isCorrectOption = optIdx === question.correctAnswer;

                          let optionClass = "border-[var(--card-border)] hover:bg-[var(--hover-bg)]";
                          if (showResults) {
                            if (isCorrectOption) {
                              optionClass = "border-[#10B981] bg-[rgba(16,185,129,0.1)]";
                            } else if (isSelected && !isCorrect) {
                              optionClass = "border-[#EF4444] bg-[rgba(239,68,68,0.1)]";
                            }
                          } else if (isSelected) {
                            optionClass = "border-blue-500 bg-[rgba(66,85,255,0.15)]";
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleAnswerChange(question.id, optIdx.toString())}
                              disabled={showResults}
                              className={`w-full text-left p-3 border-2 rounded-lg transition ${optionClass} ${
                                showResults ? "cursor-default" : "cursor-pointer"
                              }`}
                            >
                              <span className="text-sm text-[var(--foreground)]">{option}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {question.type === "fill-blank" && (
                      <input
                        type="text"
                        value={userAnswers[question.id] || ""}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        disabled={showResults}
                        placeholder="Type your answer here"
                        className={`w-full p-3 border-2 rounded-lg ${
                          showResults
                            ? isCorrect
                              ? "border-[#10B981] bg-[rgba(16,185,129,0.1)]"
                              : "border-[#EF4444] bg-[rgba(239,68,68,0.1)]"
                            : "border-[var(--card-border)]"
                        } disabled:cursor-not-allowed text-[var(--foreground)]`}
                      />
                    )}

                    {showResults && (
                      <div className="mt-3 space-y-2">
                        {!isCorrect && (
                          <div className="bg-[rgba(16,185,129,0.1)] border border-[var(--card-border)] rounded-lg p-3">
                            <p className="text-sm text-[#10B981]">
                              <strong>Correct Answer:</strong> {question.correctAnswer}
                            </p>
                          </div>
                        )}
                        <div className="bg-[rgba(66,85,255,0.15)] border border-[var(--card-border)] rounded-lg p-3">
                          <p className="text-sm text-[#4255FF]">
                            <strong>Explanation:</strong> {question.explanation}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
