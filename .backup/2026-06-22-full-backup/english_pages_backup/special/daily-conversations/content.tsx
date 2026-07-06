"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mic, Square, Play, Download, MessageCircle, Clock, Users } from "lucide-react";

interface ConversationScenario {
  id: string;
  title: string;
  description: string;
  setting: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  dialogue: {
    speaker: "You" | "Other";
    text: string;
    isRecordingPoint?: boolean;
  }[];
  tips: string[];
  vocabulary: { word: string; meaning: string }[];
}

const conversationScenarios: ConversationScenario[] = [
  {
    id: "shopping",
    title: "Shopping at a Store",
    description: "Practice common shopping conversations and asking for help",
    setting: "Clothing Store",
    difficulty: "Beginner",
    dialogue: [
      { speaker: "Other", text: "Good afternoon! Welcome to Fashion Hub. How can I help you today?" },
      { speaker: "You", text: "[Your response: Greet and say what you're looking for]", isRecordingPoint: true },
      { speaker: "Other", text: "Certainly! We have a great collection of shirts. What size do you wear?" },
      { speaker: "You", text: "[Your response: Tell your size and preferences]", isRecordingPoint: true },
      { speaker: "Other", text: "Perfect! These blue and white shirts are very popular. Would you like to try them on?" },
      { speaker: "You", text: "[Your response: Accept and ask about fitting rooms]", isRecordingPoint: true },
      { speaker: "Other", text: "The fitting rooms are right over there. Take your time." },
      { speaker: "You", text: "[After trying: Express your opinion and ask about price]", isRecordingPoint: true },
      { speaker: "Other", text: "That shirt is ₹1,200. We currently have a 20% discount on all formal wear." },
      { speaker: "You", text: "[Your response: Decide to buy and ask about payment]", isRecordingPoint: true },
    ],
    tips: [
      "Be polite and use 'please' and 'thank you'",
      "Ask questions if you need clarification",
      "Use phrases like 'I'm looking for...' or 'Do you have...'",
      "Practice asking about sizes, colors, and prices",
      "Learn to negotiate politely if appropriate",
    ],
    vocabulary: [
      { word: "fitting room", meaning: "A place to try on clothes" },
      { word: "discount", meaning: "A reduction in price" },
      { word: "collection", meaning: "A group of items for sale" },
      { word: "formal wear", meaning: "Professional/business clothing" },
    ],
  },
  {
    id: "restaurant",
    title: "Ordering at a Restaurant",
    description: "Learn to order food, ask questions about menu items, and handle bills",
    setting: "Restaurant",
    difficulty: "Beginner",
    dialogue: [
      { speaker: "Other", text: "Good evening! Welcome to Spice Garden. Table for how many?" },
      { speaker: "You", text: "[Your response: Tell number of people]", isRecordingPoint: true },
      { speaker: "Other", text: "Right this way, please. Here's your menu. Would you like to order drinks first?" },
      { speaker: "You", text: "[Your response: Order drinks or say you need time]", isRecordingPoint: true },
      { speaker: "Other", text: "No problem. I'll give you a few minutes to look at the menu." },
      { speaker: "You", text: "[Your response: Ask about a dish you don't understand]", isRecordingPoint: true },
      { speaker: "Other", text: "That's our special chicken curry with herbs and mild spices. It's not too spicy." },
      { speaker: "You", text: "[Your response: Place your order]", isRecordingPoint: true },
      { speaker: "Other", text: "Excellent choice! Your food will be ready in about 15 minutes." },
      { speaker: "You", text: "[Later: Ask for the bill and mention the service]", isRecordingPoint: true },
    ],
    tips: [
      "Learn food-related vocabulary (appetizers, main course, dessert)",
      "Don't hesitate to ask about ingredients if you have allergies",
      "Use phrases like 'I'd like...' or 'Can I have...'",
      "Practice asking about spice levels, cooking methods",
      "Know how to politely get the waiter's attention",
    ],
    vocabulary: [
      { word: "appetizer", meaning: "Small dish served before the main meal" },
      { word: "main course", meaning: "The primary dish in a meal" },
      { word: "bill", meaning: "The statement of money owed for food/services" },
      { word: "spicy", meaning: "Having a hot, pungent taste" },
    ],
  },
  {
    id: "doctor",
    title: "Visiting a Doctor",
    description: "Describe symptoms, understand medical advice, and ask health questions",
    setting: "Doctor's Clinic",
    difficulty: "Intermediate",
    dialogue: [
      { speaker: "Other", text: "Good morning! Please have a seat. What seems to be the problem today?" },
      { speaker: "You", text: "[Your response: Describe your symptoms]", isRecordingPoint: true },
      { speaker: "Other", text: "I see. How long have you been experiencing these symptoms?" },
      { speaker: "You", text: "[Your response: Tell duration and any other details]", isRecordingPoint: true },
      { speaker: "Other", text: "Have you taken any medication for this? Do you have any allergies?" },
      { speaker: "You", text: "[Your response: Answer about medicines and allergies]", isRecordingPoint: true },
      { speaker: "Other", text: "Let me examine you. Please say 'Ahh' and let me check your throat." },
      { speaker: "You", text: "[After examination: Ask about diagnosis and treatment]", isRecordingPoint: true },
      { speaker: "Other", text: "You have a throat infection. I'm prescribing antibiotics. Take them twice daily for 5 days." },
      { speaker: "You", text: "[Your response: Confirm understanding and ask about precautions]", isRecordingPoint: true },
    ],
    tips: [
      "Learn body parts and common symptoms vocabulary",
      "Be specific about when symptoms started",
      "Mention any medications you're already taking",
      "Don't be shy to ask questions about prescriptions",
      "Confirm you understand all instructions before leaving",
    ],
    vocabulary: [
      { word: "symptom", meaning: "A sign of illness or disease" },
      { word: "prescription", meaning: "Written instruction for medicine from a doctor" },
      { word: "antibiotic", meaning: "Medicine that fights bacterial infections" },
      { word: "allergy", meaning: "Bad reaction to certain substances" },
    ],
  },
  {
    id: "travel",
    title: "Booking Travel Tickets",
    description: "Inquire about tickets, schedules, and make reservations",
    setting: "Travel Agency / Railway Station",
    difficulty: "Intermediate",
    dialogue: [
      { speaker: "Other", text: "Hello! How may I assist you with your travel plans today?" },
      { speaker: "You", text: "[Your response: State destination and travel dates]", isRecordingPoint: true },
      { speaker: "Other", text: "Let me check availability. Would you prefer train or flight?" },
      { speaker: "You", text: "[Your response: Choose mode and ask about timings]", isRecordingPoint: true },
      { speaker: "Other", text: "We have a train departing at 6:30 AM and another at 2:00 PM. Which works better?" },
      { speaker: "You", text: "[Your response: Choose timing and ask about classes/prices]", isRecordingPoint: true },
      { speaker: "Other", text: "The 2 PM train has AC 2-tier for ₹1,500 and AC 3-tier for ₹900." },
      { speaker: "You", text: "[Your response: Select class and confirm booking details]", isRecordingPoint: true },
      { speaker: "Other", text: "Great! I'll need your ID proof for booking. How would you like to pay?" },
      { speaker: "You", text: "[Your response: Provide payment method and ask about confirmation]", isRecordingPoint: true },
    ],
    tips: [
      "Know travel-related vocabulary (departure, arrival, platform, boarding)",
      "Always confirm dates, times, and prices",
      "Ask about cancellation policies",
      "Keep your booking reference number safe",
      "Inquire about luggage allowances if needed",
    ],
    vocabulary: [
      { word: "departure", meaning: "The act of leaving or going away" },
      { word: "reservation", meaning: "An arrangement to secure a seat/room" },
      { word: "confirmation", meaning: "Statement that something is definitely true/will happen" },
      { word: "boarding", meaning: "Getting on a train/plane/bus" },
    ],
  },
  {
    id: "bank",
    title: "Banking Services",
    description: "Open accounts, inquire about services, handle transactions",
    setting: "Bank",
    difficulty: "Advanced",
    dialogue: [
      { speaker: "Other", text: "Good morning! Welcome to City Bank. How can I help you today?" },
      { speaker: "You", text: "[Your response: State purpose - opening account/inquiry/transaction]", isRecordingPoint: true },
      { speaker: "Other", text: "Certainly! We offer savings accounts and current accounts. Which would you prefer?" },
      { speaker: "You", text: "[Your response: Choose type and ask about requirements]", isRecordingPoint: true },
      { speaker: "Other", text: "For a savings account, you'll need ID proof, address proof, and two photographs. There's a minimum balance requirement of ₹5,000." },
      { speaker: "You", text: "[Your response: Confirm you have documents and ask about benefits]", isRecordingPoint: true },
      { speaker: "Other", text: "You'll get a debit card, mobile banking, internet banking, and 4% interest annually." },
      { speaker: "You", text: "[Your response: Ask about charges, ATM services, or other features]", isRecordingPoint: true },
      { speaker: "Other", text: "There are no monthly charges if you maintain the minimum balance. You get 5 free ATM transactions per month." },
      { speaker: "You", text: "[Your response: Agree to proceed and ask about timeline]", isRecordingPoint: true },
    ],
    tips: [
      "Learn banking terminology (account, deposit, withdrawal, balance)",
      "Understand different account types and their features",
      "Always ask about fees and charges",
      "Inquire about online and mobile banking options",
      "Keep all account details and passwords secure",
    ],
    vocabulary: [
      { word: "savings account", meaning: "Account for saving money with interest" },
      { word: "minimum balance", meaning: "Lowest amount that must be kept in account" },
      { word: "debit card", meaning: "Card for withdrawing money or making payments" },
      { word: "transaction", meaning: "An instance of buying, selling, or transferring money" },
    ],
  },
  {
    id: "job-interview",
    title: "Job Interview",
    description: "Professional interview conversation and responses",
    setting: "Office Interview Room",
    difficulty: "Advanced",
    dialogue: [
      { speaker: "Other", text: "Good morning! Please have a seat. Thank you for coming. Can you tell me about yourself?" },
      { speaker: "You", text: "[Your response: Brief professional introduction]", isRecordingPoint: true },
      { speaker: "Other", text: "That's impressive. What interests you about this position at our company?" },
      { speaker: "You", text: "[Your response: Express interest and align with company values]", isRecordingPoint: true },
      { speaker: "Other", text: "Can you describe a challenging situation you faced at work and how you handled it?" },
      { speaker: "You", text: "[Your response: Use STAR method - Situation, Task, Action, Result]", isRecordingPoint: true },
      { speaker: "Other", text: "Good problem-solving skills. What are your salary expectations?" },
      { speaker: "You", text: "[Your response: State range professionally]", isRecordingPoint: true },
      { speaker: "Other", text: "That's within our range. Do you have any questions for us?" },
      { speaker: "You", text: "[Your response: Ask thoughtful questions about role/company]", isRecordingPoint: true },
    ],
    tips: [
      "Research the company before the interview",
      "Use the STAR method for behavioral questions",
      "Be confident but not arrogant",
      "Prepare questions to ask the interviewer",
      "Follow up with a thank-you email after",
    ],
    vocabulary: [
      { word: "qualification", meaning: "Skills or experience needed for a job" },
      { word: "responsibility", meaning: "A duty or task you're expected to do" },
      { word: "expectation", meaning: "What you hope or believe will happen" },
      { word: "collaborative", meaning: "Working together with others" },
    ],
  },
];

export default function DailyConversationsPage() {
  const router = useRouter();
  const [selectedScenario, setSelectedScenario] = useState<ConversationScenario>(conversationScenarios[0]);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedResponses, setRecordedResponses] = useState<Record<number, string>>({});
  const [showVocabulary, setShowVocabulary] = useState(false);
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

  const currentDialogue = selectedScenario.dialogue[currentDialogueIndex];
  const isLastDialogue = currentDialogueIndex === selectedScenario.dialogue.length - 1;
  const isRecordingPoint = currentDialogue?.isRecordingPoint;

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
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setRecordedResponses({ ...recordedResponses, [currentDialogueIndex]: url });
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

  const nextDialogue = () => {
    if (!isLastDialogue) {
      setCurrentDialogueIndex(currentDialogueIndex + 1);
      setAudioBlob(null);
      setAudioUrl(null);
      setRecordingTime(0);
    }
  };

  const previousDialogue = () => {
    if (currentDialogueIndex > 0) {
      setCurrentDialogueIndex(currentDialogueIndex - 1);
      const previousRecording = recordedResponses[currentDialogueIndex - 1];
      if (previousRecording) {
        setAudioUrl(previousRecording);
      } else {
        setAudioUrl(null);
      }
    }
  };

  const resetConversation = () => {
    setCurrentDialogueIndex(0);
    setRecordedResponses({});
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
  };

  const downloadAllRecordings = () => {
    Object.entries(recordedResponses).forEach(([index, url]) => {
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedScenario.id}-response-${index}-${Date.now()}.webm`;
      a.click();
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "text-green-600";
      case "Intermediate":
        return "text-orange-600";
      case "Advanced":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getDifficultyBg = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "rgba(16, 185, 129, 0.1)";
      case "Intermediate": return "rgba(245, 158, 11, 0.1)";
      case "Advanced": return "rgba(239, 68, 68, 0.1)";
      default: return "var(--hover-bg)";
    }
  };

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: "var(--primary-bg)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-[var(--card-bg)] rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>Daily Conversations Practice</h1>
            <button
              onClick={() => router.push("/english/real-world/daily-conversations")}
              className="font-medium"
              style={{ color: "var(--foreground-secondary)", cursor: "pointer" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--foreground)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--foreground-secondary)")}
            >
              ← Back
            </button>
          </div>

          {/* Scenario Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {conversationScenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => {
                  setSelectedScenario(scenario);
                  resetConversation();
                  setShowVocabulary(false);
                }}
                className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition ${
                  selectedScenario.id === scenario.id
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "text-white"
                }`}
                style={{
                  backgroundColor: selectedScenario.id === scenario.id ? undefined : "var(--hover-bg)",
                  color: selectedScenario.id === scenario.id ? undefined : "var(--foreground-secondary)"
                }}
                onMouseEnter={(e) => {
                  if (selectedScenario.id !== scenario.id) {
                    (e.currentTarget.style as any).backgroundColor = "var(--card-border)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedScenario.id !== scenario.id) {
                    (e.currentTarget.style as any).backgroundColor = "var(--hover-bg)";
                  }
                }}
              >
                {scenario.title}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Info & Tips */}
          <div className="space-y-6">
            {/* Scenario Info */}
            <div className="bg-[var(--card-bg)] rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>{selectedScenario.title}</h2>
              <p className="mb-4" style={{ color: "var(--foreground-secondary)" }}>{selectedScenario.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span style={{ color: "var(--foreground-secondary)" }}>{selectedScenario.setting}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(selectedScenario.difficulty)}`} style={{ backgroundColor: getDifficultyBg(selectedScenario.difficulty) }}>
                  {selectedScenario.difficulty}
                </span>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-[var(--card-bg)] rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold mb-3" style={{ color: "var(--foreground)" }}>💡 Conversation Tips</h3>
              <ul className="space-y-2">
                {selectedScenario.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm" style={{ color: "var(--foreground-secondary)" }}>
                    <span className="text-purple-600 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Vocabulary */}
            <div className="bg-[var(--card-bg)] rounded-2xl shadow-lg p-6">
              {!showVocabulary ? (
                <button
                  onClick={() => setShowVocabulary(true)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition"
                >
                  Show Key Vocabulary
                </button>
              ) : (
                <div>
                  <h3 className="font-semibold mb-3" style={{ color: "var(--foreground)" }}>📚 Key Vocabulary</h3>
                  <div className="space-y-3">
                    {selectedScenario.vocabulary.map((item, idx) => (
                      <div key={idx} className="border rounded-lg p-3" style={{ backgroundColor: "rgba(168, 85, 247, 0.1)", borderColor: "var(--card-border)" }}>
                        <p className="font-semibold text-purple-600">{item.word}</p>
                        <p className="text-sm text-purple-500">{item.meaning}</p>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowVocabulary(false)}
                    className="mt-3 text-sm"
                    style={{ color: "var(--foreground-secondary)", cursor: "pointer" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--foreground)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--foreground-secondary)")}
                  >
                    Hide Vocabulary
                  </button>
                </div>
              )}
            </div>

            {/* Progress */}
            <div className="border rounded-lg p-4" style={{ backgroundColor: "rgba(66, 85, 255, 0.1)", borderColor: "var(--card-border)" }}>
              <h4 className="font-semibold mb-2" style={{ color: "var(--foreground)" }}>Progress</h4>
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded-full h-2" style={{ backgroundColor: "var(--hover-bg)" }}>
                  <div
                    className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all"
                    style={{ width: `${((currentDialogueIndex + 1) / selectedScenario.dialogue.length) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-semibold" style={{ color: "var(--foreground-secondary)" }}>
                  {currentDialogueIndex + 1}/{selectedScenario.dialogue.length}
                </span>
              </div>
              <p className="text-sm mt-2" style={{ color: "var(--foreground-secondary)" }}>
                Recorded: {Object.keys(recordedResponses).length} responses
              </p>
            </div>
          </div>

          {/* Right Column - Conversation & Recording */}
          <div className="space-y-6">
            {/* Current Dialogue */}
            <div className="bg-[var(--card-bg)] rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
                <MessageCircle className="w-5 h-5 text-purple-600" />
                Current Exchange
              </h3>

              <div className="space-y-4">
                <div className={`p-4 rounded-lg border-2 ${currentDialogue?.speaker === "You" ? "border-blue-300" : ""}`} style={{ backgroundColor: currentDialogue?.speaker === "You" ? "rgba(66, 85, 255, 0.1)" : "var(--hover-bg)", borderColor: currentDialogue?.speaker === "You" ? "rgba(66, 85, 255, 0.3)" : "transparent" }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: "var(--foreground-secondary)" }}>{currentDialogue?.speaker}</p>
                  <p style={{ color: "var(--foreground)" }}>{currentDialogue?.text}</p>
                </div>

                {/* Navigation */}
                <div className="flex gap-3">
                  <button
                    onClick={previousDialogue}
                    disabled={currentDialogueIndex === 0}
                    className="px-4 py-2 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: "var(--hover-bg)", color: "var(--foreground-secondary)", cursor: "pointer" }}
                    onMouseEnter={(e) => {
                      if (!e.currentTarget.disabled) {
                        e.currentTarget.style.backgroundColor = "var(--card-border)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--hover-bg)";
                    }}
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={nextDialogue}
                    disabled={isLastDialogue}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLastDialogue ? "Conversation Complete" : "Next →"}
                  </button>
                </div>
              </div>
            </div>

            {/* Recording Section */}
            {isRecordingPoint && (
              <div className="bg-[var(--card-bg)] rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
                  <Mic className="w-5 h-5 text-purple-600" />
                  Record Your Response
                </h3>

                {recordingError && (
                  <div className="border rounded-lg p-3 mb-4 text-sm" style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", borderColor: "rgba(239, 68, 68, 0.3)", color: "#dc2626" }}>
                    {recordingError}
                  </div>
                )}

                {isRecording && (
                  <div className="border-2 rounded-lg p-4 mb-4 text-center" style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", borderColor: "rgba(239, 68, 68, 0.3)" }}>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                      <span className="font-semibold text-red-600">Recording...</span>
                    </div>
                    <p className="text-2xl font-bold text-red-700">{formatTime(recordingTime)}</p>
                  </div>
                )}

                <div className="space-y-3">
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
                      className="w-full text-white py-4 px-6 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                      style={{ backgroundColor: "rgb(55, 65, 81)", cursor: "pointer" }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgb(31, 41, 55)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgb(55, 65, 81)")}
                    >
                      <Square className="w-5 h-5" />
                      Stop Recording
                    </button>
                  )}

                  {audioUrl && !isRecording && (
                    <div className="space-y-3">
                      <div className="border rounded-lg p-4" style={{ backgroundColor: "rgba(34, 197, 94, 0.1)", borderColor: "rgba(34, 197, 94, 0.3)" }}>
                        <p className="font-semibold mb-2 text-green-600">✓ Response Recorded!</p>
                        <p className="text-sm text-green-600">Duration: {formatTime(recordingTime)}</p>
                      </div>
                      <audio src={audioUrl} controls className="w-full" />
                      <button
                        onClick={() => {
                          setAudioBlob(null);
                          setAudioUrl(null);
                          setRecordingTime(0);
                          const newResponses = { ...recordedResponses };
                          delete newResponses[currentDialogueIndex];
                          setRecordedResponses(newResponses);
                        }}
                        className="w-full py-3 px-4 rounded-lg font-semibold transition"
                        style={{ backgroundColor: "var(--hover-bg)", color: "var(--foreground-secondary)", cursor: "pointer" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--card-border)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--hover-bg)")}
                      >
                        Record Again
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Conversation Actions */}
            {isLastDialogue && Object.keys(recordedResponses).length > 0 && (
              <div className="bg-[var(--card-bg)] rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold mb-4" style={{ color: "var(--foreground)" }}>🎉 Conversation Complete!</h3>
                <div className="space-y-3">
                  <button
                    onClick={downloadAllRecordings}
                    className="w-full bg-[#4255FF] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#3242CC] transition flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download All Recordings
                  </button>
                  <button
                    onClick={resetConversation}
                    className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 transition"
                  >
                    Practice Again
                  </button>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="border rounded-lg p-4" style={{ backgroundColor: "rgba(168, 85, 247, 0.1)", borderColor: "var(--card-border)" }}>
              <h4 className="font-semibold mb-2" style={{ color: "var(--foreground)" }}>📋 How to Practice:</h4>
              <ol className="text-sm space-y-1 list-decimal list-inside" style={{ color: "var(--foreground-secondary)" }}>
                <li>Read the dialogue carefully</li>
                <li>When you see "Your response", click Record</li>
                <li>Speak your response naturally and clearly</li>
                <li>Listen to your recording to self-evaluate</li>
                <li>Move to the next dialogue exchange</li>
                <li>Complete the full conversation practice</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
