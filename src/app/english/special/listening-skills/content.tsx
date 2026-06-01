"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Play, Pause, RotateCcw, CheckCircle, XCircle, Volume2, FileText } from "lucide-react";

interface ListeningExercise {
  id: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  duration: string;
  audioUrl: string; // In real app, actual audio files
  transcript: string;
  questions: {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
}

const listeningExercises: ListeningExercise[] = [
  {
    id: "news-report",
    title: "News Report: Climate Change",
    level: "Advanced",
    category: "News & Media",
    duration: "2:30",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Placeholder
    transcript: `Good evening. In today's top story, scientists have released a new report on climate change. The report, published by the International Climate Research Institute, shows that global temperatures have risen by 1.2 degrees Celsius since the pre-industrial era. Dr. Sarah Chen, lead researcher on the project, stated that immediate action is needed to prevent further warming. "We have a narrow window of opportunity," Dr. Chen explained. "If we don't reduce carbon emissions by 50% within the next decade, we risk irreversible damage to our planet." The report recommends transitioning to renewable energy sources, implementing stricter environmental regulations, and investing in green technology. Several governments have already pledged to increase their climate commitments in response to these findings.`,
    questions: [
      {
        id: 1,
        question: "How much have global temperatures risen since the pre-industrial era?",
        options: ["0.8 degrees Celsius", "1.2 degrees Celsius", "1.5 degrees Celsius", "2.0 degrees Celsius"],
        correctAnswer: 1,
        explanation: "The report states temperatures have risen by 1.2 degrees Celsius.",
      },
      {
        id: 2,
        question: "Who is Dr. Sarah Chen?",
        options: [
          "A government official",
          "Lead researcher on the climate project",
          "Environmental activist",
          "News reporter"
        ],
        correctAnswer: 1,
        explanation: "Dr. Sarah Chen is identified as the lead researcher on the project.",
      },
      {
        id: 3,
        question: "By how much do carbon emissions need to be reduced?",
        options: ["30%", "40%", "50%", "60%"],
        correctAnswer: 2,
        explanation: "Dr. Chen states emissions must be reduced by 50% within the next decade.",
      },
      {
        id: 4,
        question: "What is one recommendation from the report?",
        options: [
          "Building more nuclear plants",
          "Transitioning to renewable energy",
          "Reducing population growth",
          "Banning all fossil fuels immediately"
        ],
        correctAnswer: 1,
        explanation: "The report recommends transitioning to renewable energy sources.",
      },
    ],
  },
  {
    id: "conversation-restaurant",
    title: "Conversation: Making a Reservation",
    level: "Beginner",
    category: "Daily Life",
    duration: "1:15",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    transcript: `Host: Good afternoon, Luigi's Italian Restaurant. How may I help you?
Customer: Hi, I'd like to make a reservation for dinner tonight.
Host: Certainly! For how many people?
Customer: Four people, please.
Host: And what time would you prefer?
Customer: Is 7:30 PM available?
Host: Let me check... Yes, we have a table for four at 7:30. May I have your name?
Customer: It's Sarah Johnson. J-O-H-N-S-O-N.
Host: Perfect, Ms. Johnson. I have you down for four people at 7:30 this evening. Do you have any special requirements?
Customer: Yes, could we have a table by the window if possible?
Host: I'll make a note of that. We'll do our best to accommodate you. See you tonight!
Customer: Thank you very much.`,
    questions: [
      {
        id: 1,
        question: "How many people is the reservation for?",
        options: ["Two", "Three", "Four", "Five"],
        correctAnswer: 2,
        explanation: "The customer clearly states the reservation is for four people.",
      },
      {
        id: 2,
        question: "What time is the reservation?",
        options: ["6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM"],
        correctAnswer: 2,
        explanation: "The customer requests and confirms 7:30 PM.",
      },
      {
        id: 3,
        question: "What is the customer's name?",
        options: ["Sarah Jackson", "Sarah Johnson", "Sara Johnson", "Sarah Thomson"],
        correctAnswer: 1,
        explanation: "The customer gives her name as Sarah Johnson and spells it out.",
      },
      {
        id: 4,
        question: "What special request does the customer make?",
        options: [
          "A quiet corner",
          "A table by the window",
          "A private room",
          "No special request"
        ],
        correctAnswer: 1,
        explanation: "The customer asks for a table by the window if possible.",
      },
    ],
  },
  {
    id: "lecture-history",
    title: "Academic Lecture: Ancient Rome",
    level: "Intermediate",
    category: "Academic",
    duration: "3:00",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    transcript: `Today we'll discuss the rise and fall of the Roman Empire. The Roman Empire, at its peak in 117 AD, controlled approximately 5 million square kilometers of territory. This vast empire was home to an estimated 50 to 90 million people, making it one of the largest empires in ancient history. The Romans were remarkable engineers and architects. They built an extensive network of roads, spanning over 400,000 kilometers, which facilitated trade and military movement throughout the empire. They also constructed impressive aqueducts to transport water to cities. One of the most famous is the Aqua Claudia, which carried water over 69 kilometers. However, the empire faced numerous challenges. Internal political corruption, economic instability, and external invasions by barbarian tribes all contributed to its decline. In 476 AD, the Western Roman Empire officially fell when the last emperor, Romulus Augustulus, was deposed. The Eastern Roman Empire, also known as the Byzantine Empire, continued for another thousand years until 1453.`,
    questions: [
      {
        id: 1,
        question: "When was the Roman Empire at its peak?",
        options: ["117 AD", "100 AD", "200 AD", "150 AD"],
        correctAnswer: 0,
        explanation: "The lecture states the empire was at its peak in 117 AD.",
      },
      {
        id: 2,
        question: "How long was the Roman road network?",
        options: ["200,000 km", "300,000 km", "400,000 km", "500,000 km"],
        correctAnswer: 2,
        explanation: "The road network spanned over 400,000 kilometers.",
      },
      {
        id: 3,
        question: "What was the Aqua Claudia?",
        options: ["A Roman road", "An aqueduct", "A building", "A military fort"],
        correctAnswer: 1,
        explanation: "The Aqua Claudia was a famous aqueduct that carried water.",
      },
      {
        id: 4,
        question: "When did the Western Roman Empire fall?",
        options: ["456 AD", "466 AD", "476 AD", "486 AD"],
        correctAnswer: 2,
        explanation: "The Western Roman Empire fell in 476 AD.",
      },
      {
        id: 5,
        question: "Who was the last emperor of the Western Roman Empire?",
        options: [
          "Julius Caesar",
          "Augustus",
          "Romulus Augustulus",
          "Constantine"
        ],
        correctAnswer: 2,
        explanation: "Romulus Augustulus was the last emperor of the Western Roman Empire.",
      },
    ],
  },
  {
    id: "podcast-technology",
    title: "Podcast: Future of AI",
    level: "Advanced",
    category: "Technology",
    duration: "2:45",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    transcript: `Welcome to Tech Talk. Today we're discussing artificial intelligence with Dr. James Park, an AI researcher at MIT. Dr. Park, there's a lot of excitement and concern about AI. What's your perspective? "Well, AI is advancing rapidly. We're seeing applications in healthcare, where AI can diagnose diseases from medical images with accuracy matching or exceeding human doctors. In transportation, self-driving cars are becoming more reliable. However, we need to address important ethical questions. Who's responsible when an AI system makes a mistake? How do we prevent bias in AI algorithms? These are critical issues." Some people worry AI will replace human jobs. "That's a valid concern. Some jobs will indeed be automated, but history shows that technology also creates new types of employment. The key is education and adaptation. We need to prepare people for jobs that require skills AI can't easily replicate, like creative thinking, emotional intelligence, and complex problem-solving." What about AI regulation? "Governments worldwide are beginning to establish frameworks, but it's challenging because technology evolves faster than legislation."`,
    questions: [
      {
        id: 1,
        question: "Where does Dr. James Park work?",
        options: ["Stanford", "Harvard", "MIT", "Oxford"],
        correctAnswer: 2,
        explanation: "Dr. Park is identified as an AI researcher at MIT.",
      },
      {
        id: 2,
        question: "In which field can AI match human diagnostic accuracy?",
        options: ["Law", "Healthcare", "Education", "Agriculture"],
        correctAnswer: 1,
        explanation: "The discussion mentions AI in healthcare can diagnose diseases with accuracy matching human doctors.",
      },
      {
        id: 3,
        question: "What ethical question is NOT mentioned?",
        options: [
          "Who's responsible for AI mistakes",
          "How to prevent AI bias",
          "How to ensure AI privacy",
          "Both A and B are mentioned"
        ],
        correctAnswer: 2,
        explanation: "The podcast mentions responsibility and bias, but not privacy specifically.",
      },
      {
        id: 4,
        question: "What skills does Dr. Park say AI can't easily replicate?",
        options: [
          "Data analysis",
          "Creative thinking and emotional intelligence",
          "Mathematical calculations",
          "Pattern recognition"
        ],
        correctAnswer: 1,
        explanation: "Dr. Park mentions creative thinking, emotional intelligence, and complex problem-solving as skills AI can't easily replicate.",
      },
    ],
  },
  {
    id: "announcement-airport",
    title: "Airport Announcement",
    level: "Beginner",
    category: "Travel",
    duration: "0:45",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    transcript: `Attention passengers. This is a final boarding call for flight AI 234 to Mumbai. All passengers holding tickets for this flight should proceed immediately to gate number 7. I repeat, this is the final boarding call for Air India flight 234 to Mumbai, departing from gate 7. The gate will close in 10 minutes. Any passengers who have not yet boarded should make their way to gate 7 immediately. Thank you.`,
    questions: [
      {
        id: 1,
        question: "What is the flight number?",
        options: ["AI 243", "AI 234", "AI 324", "AI 432"],
        correctAnswer: 1,
        explanation: "The announcement clearly states flight AI 234.",
      },
      {
        id: 2,
        question: "What is the destination?",
        options: ["Delhi", "Bangalore", "Mumbai", "Kolkata"],
        correctAnswer: 2,
        explanation: "The flight is going to Mumbai.",
      },
      {
        id: 3,
        question: "Which gate should passengers go to?",
        options: ["Gate 5", "Gate 6", "Gate 7", "Gate 8"],
        correctAnswer: 2,
        explanation: "Passengers should proceed to gate number 7.",
      },
      {
        id: 4,
        question: "When will the gate close?",
        options: ["5 minutes", "10 minutes", "15 minutes", "20 minutes"],
        correctAnswer: 1,
        explanation: "The announcement states the gate will close in 10 minutes.",
      },
    ],
  },
];

export default function ListeningSkillsPage() {
  const router = useRouter();
  const [selectedExercise, setSelectedExercise] = useState<ListeningExercise>(listeningExercises[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [filterLevel, setFilterLevel] = useState<string>("All");

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const filteredExercises = filterLevel === "All"
    ? listeningExercises
    : listeningExercises.filter(ex => ex.level === filterLevel);

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

  const restartAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleAnswerSelect = (questionId: number, optionIndex: number) => {
    if (!showResults) {
      setUserAnswers({ ...userAnswers, [questionId]: optionIndex });
    }
  };

  const submitAnswers = () => {
    if (Object.keys(userAnswers).length === selectedExercise.questions.length) {
      setShowResults(true);
    } else {
      alert("Please answer all questions before submitting.");
    }
  };

  const resetExercise = () => {
    setUserAnswers({});
    setShowResults(false);
    setShowTranscript(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.pause();
    }
    setIsPlaying(false);
  };

  const calculateScore = () => {
    let correct = 0;
    selectedExercise.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "text-green-600 bg-green-100";
      case "Intermediate": return "text-orange-600 bg-orange-100";
      case "Advanced": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Listening Skills Practice</h1>
            <button
              onClick={() => router.push("/english/foundation/listening-skills")}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              ← Back
            </button>
          </div>

          {/* Level Filter */}
          <div className="flex gap-2 mb-4">
            {["All", "Beginner", "Intermediate", "Advanced"].map((level) => (
              <button
                key={level}
                onClick={() => setFilterLevel(level)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterLevel === level
                    ? "bg-gradient-to-r from-[#00A1E0] to-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          {/* Exercise Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filteredExercises.map((exercise) => (
              <button
                key={exercise.id}
                onClick={() => {
                  setSelectedExercise(exercise);
                  resetExercise();
                }}
                className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition ${
                  selectedExercise.id === exercise.id
                    ? "bg-gradient-to-r from-[#00A1E0] to-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {exercise.title}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Audio Player & Info */}
          <div className="space-y-6">
            {/* Exercise Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{selectedExercise.title}</h2>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(selectedExercise.level)}`}>
                  {selectedExercise.level}
                </span>
                <span className="px-3 py-1 bg-[#E6F4F9] text-[#0070A8] rounded-full text-xs font-semibold">
                  {selectedExercise.category}
                </span>
                <span className="text-sm text-gray-600">⏱️ {selectedExercise.duration}</span>
              </div>

              {/* Audio Player */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-[#80CFED] rounded-lg p-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Volume2 className="w-6 h-6 text-[#00A1E0]" />
                  <h3 className="font-semibold text-gray-900">Audio Player</h3>
                </div>

                <audio
                  ref={audioRef}
                  src={selectedExercise.audioUrl}
                  onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                  onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                  onEnded={() => setIsPlaying(false)}
                />

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[#00A1E0] to-purple-600 h-2 rounded-full transition-all"
                      style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={togglePlayPause}
                    className="flex-1 bg-[#00A1E0] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#0070A8] transition flex items-center justify-center gap-2"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    {isPlaying ? "Pause" : "Play"}
                  </button>
                  <button
                    onClick={restartAudio}
                    className="bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Restart
                  </button>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-[#E6F4F9] border border-[#80CFED] rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">📋 Instructions:</h4>
              <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                <li>Listen to the audio carefully (you can replay)</li>
                <li>Answer all questions below</li>
                <li>Submit to see your score and explanations</li>
                <li>Review the transcript to improve understanding</li>
              </ol>
            </div>

            {/* Transcript */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {!showTranscript ? (
                <button
                  onClick={() => setShowTranscript(true)}
                  className="w-full bg-gradient-to-r from-[#00A1E0] to-purple-600 text-white py-3 px-6 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  Show Transcript
                </button>
              ) : (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#00A1E0]" />
                    Transcript
                  </h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {selectedExercise.transcript}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowTranscript(false)}
                    className="mt-3 text-sm text-gray-600 hover:text-gray-900"
                  >
                    Hide Transcript
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Questions */}
          <div className="space-y-6">
            {/* Results Summary */}
            {showResults && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">📊 Your Results</h3>
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-[#80CFED] rounded-lg p-6 text-center">
                  <p className="text-5xl font-bold text-[#00A1E0] mb-2">
                    {calculateScore()}/{selectedExercise.questions.length}
                  </p>
                  <p className="text-gray-700 font-semibold">
                    {Math.round((calculateScore() / selectedExercise.questions.length) * 100)}% Correct
                  </p>
                </div>
                <button
                  onClick={resetExercise}
                  className="w-full mt-4 bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 transition"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Questions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Questions</h3>
              <div className="space-y-6">
                {selectedExercise.questions.map((question, qIdx) => {
                  const userAnswer = userAnswers[question.id];
                  const isCorrect = userAnswer === question.correctAnswer;

                  return (
                    <div key={question.id} className="border-b border-gray-200 pb-6 last:border-0">
                      <p className="font-semibold text-gray-900 mb-3">
                        {qIdx + 1}. {question.question}
                      </p>

                      <div className="space-y-2">
                        {question.options.map((option, optIdx) => {
                          const isSelected = userAnswer === optIdx;
                          const isCorrectOption = optIdx === question.correctAnswer;

                          let optionClass = "border-gray-200 hover:bg-gray-50";
                          if (showResults) {
                            if (isCorrectOption) {
                              optionClass = "border-green-500 bg-green-50";
                            } else if (isSelected && !isCorrect) {
                              optionClass = "border-red-500 bg-red-50";
                            }
                          } else if (isSelected) {
                            optionClass = "border-[#00A1E0] bg-[#E6F4F9]";
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleAnswerSelect(question.id, optIdx)}
                              disabled={showResults}
                              className={`w-full text-left p-3 border-2 rounded-lg transition ${optionClass} ${
                                showResults ? "cursor-default" : "cursor-pointer"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-800">{option}</span>
                                {showResults && isCorrectOption && (
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                )}
                                {showResults && isSelected && !isCorrect && (
                                  <XCircle className="w-5 h-5 text-red-600" />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {showResults && (
                        <div className="mt-3 bg-[#E6F4F9] border border-blue-200 rounded-lg p-3">
                          <p className="text-sm text-blue-900">
                            <strong>Explanation:</strong> {question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {!showResults && (
                <button
                  onClick={submitAnswers}
                  className="w-full mt-6 bg-gradient-to-r from-[#00A1E0] to-purple-600 text-white py-4 px-6 rounded-lg font-semibold transition"
                >
                  Submit Answers
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
