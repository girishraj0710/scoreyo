"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mic, Square, Play, Volume2, RefreshCw, CheckCircle } from "lucide-react";

interface PronunciationWord {
  id: string;
  word: string;
  phonetic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  audioUrl: string; // In real app, would be actual audio file
  tips: string[];
  commonMistakes: string[];
  exampleSentence: string;
}

const pronunciationWords: PronunciationWord[] = [
  {
    id: "1",
    word: "Entrepreneur",
    phonetic: "/ˌɒntrəprəˈnɜː(r)/",
    difficulty: "Hard",
    category: "Business",
    audioUrl: "https://ssl.gstatic.com/dictionary/static/sounds/20220808/entrepreneur--_gb_1.mp3",
    tips: [
      "Stress on the last syllable: en-tre-pre-NEUR",
      "The 'eur' ending sounds like 'nur' not 'noor'",
      "Silent 't' in the middle: ON-trə-prə-nur",
    ],
    commonMistakes: [
      "❌ en-tre-PRE-neur (wrong stress)",
      "❌ en-TER-pre-neur (adding extra syllable)",
    ],
    exampleSentence: "She is a successful entrepreneur who started three companies.",
  },
  {
    id: "2",
    word: "Colonel",
    phonetic: "/ˈkɜːnl/",
    difficulty: "Hard",
    category: "Military",
    audioUrl: "https://ssl.gstatic.com/dictionary/static/sounds/20220808/colonel--_gb_1.mp3",
    tips: [
      "Pronounced like 'kernel' (the nut inside a shell)",
      "The 'o' is NOT pronounced",
      "KER-nel, not CO-lo-nel",
    ],
    commonMistakes: [
      "❌ co-lo-NEL (pronouncing all letters)",
      "❌ CO-lo-nal",
    ],
    exampleSentence: "The colonel gave orders to his troops.",
  },
  {
    id: "3",
    word: "Chaos",
    phonetic: "/ˈkeɪɒs/",
    difficulty: "Medium",
    category: "Common",
    audioUrl: "https://ssl.gstatic.com/dictionary/static/sounds/20220808/chaos--_gb_1.mp3",
    tips: [
      "Starts with 'K' sound, not 'CH' sound",
      "KAY-os, not CHAY-os",
      "Two syllables only",
    ],
    commonMistakes: [
      "❌ CHAY-os (wrong beginning sound)",
      "❌ CHA-os",
    ],
    exampleSentence: "The office was in complete chaos after the announcement.",
  },
  {
    id: "4",
    word: "Quinoa",
    phonetic: "/ˈkiːnwɑː/",
    difficulty: "Hard",
    category: "Food",
    audioUrl: "https://ssl.gstatic.com/dictionary/static/sounds/20220808/quinoa--_gb_1.mp3",
    tips: [
      "KEEN-wah, not KWIN-oh-ah",
      "Three syllables become two",
      "Stress on first syllable",
    ],
    commonMistakes: [
      "❌ kwin-OH-ah (adding extra syllable)",
      "❌ QUIN-oa (wrong stress)",
    ],
    exampleSentence: "I added quinoa to my salad for extra protein.",
  },
  {
    id: "5",
    word: "Breakfast",
    phonetic: "/ˈbrekfəst/",
    difficulty: "Easy",
    category: "Daily Life",
    audioUrl: "https://ssl.gstatic.com/dictionary/static/sounds/20220808/breakfast--_gb_1.mp3",
    tips: [
      "BREK-fəst, not BREAK-fast",
      "First syllable sounds like 'breck'",
      "Don't pronounce 'ea' like 'ee'",
    ],
    commonMistakes: [
      "❌ BREEK-fast (wrong vowel sound)",
      "❌ break-FAST (wrong stress)",
    ],
    exampleSentence: "I always have breakfast before going to work.",
  },
  {
    id: "6",
    word: "Wednesday",
    phonetic: "/ˈwenzdeɪ/",
    difficulty: "Medium",
    category: "Time",
    audioUrl: "https://ssl.gstatic.com/dictionary/static/sounds/20220808/wednesday--_gb_1.mp3",
    tips: [
      "WENZ-day, not WED-nes-day",
      "The 'd' in the middle is silent",
      "Two syllables, not three",
    ],
    commonMistakes: [
      "❌ WED-nes-day (pronouncing all letters)",
      "❌ WENDS-day",
    ],
    exampleSentence: "The meeting is scheduled for Wednesday morning.",
  },
  {
    id: "7",
    word: "Comfortable",
    phonetic: "/ˈkʌmftəbl/",
    difficulty: "Medium",
    category: "Common",
    audioUrl: "https://ssl.gstatic.com/dictionary/static/sounds/20220808/comfortable--_gb_1.mp3",
    tips: [
      "KUMF-tə-bəl, not com-FOR-table",
      "Three syllables, not four",
      "The 'or' is barely pronounced",
    ],
    commonMistakes: [
      "❌ com-FOR-ta-ble (four syllables)",
      "❌ COM-for-table (wrong stress)",
    ],
    exampleSentence: "This chair is very comfortable to sit in.",
  },
  {
    id: "8",
    word: "Recipe",
    phonetic: "/ˈresɪpi/",
    difficulty: "Easy",
    category: "Food",
    audioUrl: "https://ssl.gstatic.com/dictionary/static/sounds/20220808/recipe--_gb_1.mp3",
    tips: [
      "RES-ə-pee, not re-SEEP",
      "Stress on first syllable",
      "Short 'i' sound at the end",
    ],
    commonMistakes: [
      "❌ re-SEEP (wrong stress and sound)",
      "❌ REH-kipe",
    ],
    exampleSentence: "I found a great recipe for chocolate cake online.",
  },
  {
    id: "9",
    word: "Mischievous",
    phonetic: "/ˈmɪstʃɪvəs/",
    difficulty: "Hard",
    category: "Common",
    audioUrl: "https://ssl.gstatic.com/dictionary/static/sounds/20220808/mischievous--_gb_1.mp3",
    tips: [
      "MIS-chə-vəs (three syllables)",
      "NOT mis-CHEEV-ee-us",
      "No 'i' sound before 'ous'",
    ],
    commonMistakes: [
      "❌ mis-CHEEV-ee-us (adding extra syllable)",
      "❌ MIS-chiv-ee-ous",
    ],
    exampleSentence: "The mischievous child hid his brother's toys.",
  },
  {
    id: "10",
    word: "Nuclear",
    phonetic: "/ˈnjuːklɪə(r)/",
    difficulty: "Medium",
    category: "Science",
    audioUrl: "https://ssl.gstatic.com/dictionary/static/sounds/20220808/nuclear--_gb_1.mp3",
    tips: [
      "NEW-klee-ər, not NEW-kyə-lər",
      "'lear' not 'lur'",
      "Three syllables",
    ],
    commonMistakes: [
      "❌ NEW-kyə-lər (wrong order)",
      "❌ nuke-YOU-lər",
    ],
    exampleSentence: "Nuclear energy is a controversial topic.",
  },
];

export default function PronunciationPracticePage() {
  const router = useRouter();
  const [selectedWord, setSelectedWord] = useState<PronunciationWord>(pronunciationWords[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<string>("All");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const exampleAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  const filteredWords = filterDifficulty === "All"
    ? pronunciationWords
    : pronunciationWords.filter(w => w.difficulty === filterDifficulty);

  const playExample = () => {
    if (exampleAudioRef.current) {
      exampleAudioRef.current.play();
    }
  };

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

  const formatTime = (seconds: number) => {
    return `${seconds}s`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "text-green-600 bg-green-100";
      case "Medium": return "text-orange-600 bg-orange-100";
      case "Hard": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-[var(--card-bg)] rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Pronunciation Practice</h1>
            <button
              onClick={() => router.push("/english/foundation/pronunciation-practice")}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              ← Back
            </button>
          </div>

          {/* Difficulty Filter */}
          <div className="flex gap-2 mb-4">
            {["All", "Easy", "Medium", "Hard"].map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => setFilterDifficulty(difficulty)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterDifficulty === difficulty
                    ? "bg-gradient-to-r from-green-600 to-teal-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {difficulty}
              </button>
            ))}
          </div>

          {/* Word Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {filteredWords.map((word) => (
              <button
                key={word.id}
                onClick={() => {
                  setSelectedWord(word);
                  setAudioBlob(null);
                  setAudioUrl(null);
                  setRecordingTime(0);
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  selectedWord.id === word.id
                    ? "bg-gradient-to-r from-green-600 to-teal-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {word.word}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Word Details */}
          <div className="space-y-6">
            {/* Word Card */}
            <div className="bg-[var(--card-bg)] rounded-2xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-2">{selectedWord.word}</h2>
                  <p className="text-xl text-gray-600 font-mono">{selectedWord.phonetic}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(selectedWord.difficulty)}`}>
                  {selectedWord.difficulty}
                </span>
              </div>

              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                  {selectedWord.category}
                </span>
              </div>

              {/* Example Audio */}
              <div className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">🔊 Listen to Example</p>
                <audio ref={exampleAudioRef} src={selectedWord.audioUrl} />
                <button
                  onClick={playExample}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  <Volume2 className="w-5 h-5" />
                  Play Correct Pronunciation
                </button>
              </div>
            </div>

            {/* Pronunciation Tips */}
            <div className="bg-[var(--card-bg)] rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Pronunciation Tips
              </h3>
              <ul className="space-y-2">
                {selectedWord.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-700">
                    <span className="text-green-600 font-bold text-lg">✓</span>
                    <span className="text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Common Mistakes */}
            <div className="bg-[var(--card-bg)] rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">⚠️ Common Mistakes</h3>
              <ul className="space-y-2">
                {selectedWord.commonMistakes.map((mistake, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-sm text-red-600 font-mono bg-red-50 px-3 py-2 rounded border border-red-200">
                      {mistake}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Example Sentence */}
            <div className="bg-[#E8EAFF] border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">📝 Example Sentence:</h4>
              <p className="text-gray-700 italic">"{selectedWord.exampleSentence}"</p>
            </div>
          </div>

          {/* Right Column - Recording Practice */}
          <div className="space-y-6">
            {/* Recording Section */}
            <div className="bg-[var(--card-bg)] rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Mic className="w-5 h-5 text-green-600" />
                Practice Your Pronunciation
              </h3>

              {recordingError && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
                  {recordingError}
                </div>
              )}

              {isRecording && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                    <span className="text-red-700 font-semibold">Recording...</span>
                  </div>
                  <p className="text-2xl font-bold text-red-900">{formatTime(recordingTime)}</p>
                </div>
              )}

              <div className="space-y-3">
                {!isRecording && !audioUrl && (
                  <div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-3">
                      <p className="text-sm text-green-800 font-semibold mb-2">Instructions:</p>
                      <ol className="text-sm text-green-700 space-y-1 list-decimal list-inside">
                        <li>Listen to the example pronunciation</li>
                        <li>Click "Start Recording" below</li>
                        <li>Say the word clearly: <strong>{selectedWord.word}</strong></li>
                        <li>Click "Stop" when done</li>
                        <li>Listen to compare with the example</li>
                      </ol>
                    </div>
                    <button
                      onClick={startRecording}
                      className="w-full bg-red-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
                    >
                      <Mic className="w-5 h-5" />
                      Start Recording
                    </button>
                  </div>
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

                    <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Your Recording:</p>
                      <audio src={audioUrl} controls className="w-full" />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={playExample}
                        className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                      >
                        <Volume2 className="w-4 h-4" />
                        Example
                      </button>
                      <button
                        onClick={() => {
                          setAudioBlob(null);
                          setAudioUrl(null);
                          setRecordingTime(0);
                        }}
                        className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition flex items-center justify-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Self-Evaluation Checklist */}
            <div className="bg-[var(--card-bg)] rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">✅ Self-Evaluation</h3>
              <p className="text-sm text-gray-600 mb-3">After comparing your recording with the example, check:</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span>□</span>
                  <span>Correct syllable stress</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>□</span>
                  <span>All sounds pronounced accurately</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>□</span>
                  <span>Natural pace (not too fast/slow)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>□</span>
                  <span>Clear enunciation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>□</span>
                  <span>Avoided common mistakes listed above</span>
                </li>
              </ul>
            </div>

            {/* Practice Tips */}
            <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">💡 Practice Tips:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Record yourself multiple times</li>
                <li>• Listen carefully to the differences</li>
                <li>• Practice slowly at first, then speed up</li>
                <li>• Use a mirror to watch your mouth movements</li>
                <li>• Practice 5-10 words daily for best results</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
