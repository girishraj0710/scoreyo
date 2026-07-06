"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Volume2, Mic, Square, Clock, FileText, CheckCircle } from "lucide-react";

interface TOEFLTask {
  id: string;
  type: "Integrated Writing" | "Integrated Speaking";
  title: string;
  readingPassage: string;
  readingTime: number; // seconds
  audioTranscript: string;
  audioUrl: string;
  audioLength: number; // seconds
  prompt: string;
  responseTime: number; // seconds (20 min for writing, 60s for speaking)
  wordLimit?: { min: number; max: number };
  tips: string[];
  sampleResponse?: string;
}

const toeflTasks: TOEFLTask[] = [
  {
    id: "writing-1",
    type: "Integrated Writing",
    title: "Integrated Writing Task 1: Academic Topic",
    readingTime: 180,
    readingPassage: `The Benefits of Remote Work

Remote work has become increasingly popular in recent years, with many companies adopting flexible work-from-home policies. Proponents of remote work argue that it offers several significant advantages for both employers and employees.

First, remote work increases productivity. Studies have shown that employees working from home are often more productive than their office-based counterparts. Without the distractions of office chatter, unnecessary meetings, and long commutes, remote workers can focus better on their tasks and complete them more efficiently.

Second, remote work reduces operational costs for companies. By allowing employees to work from home, businesses can save money on office space, utilities, equipment, and other overhead expenses. Some companies have reported savings of up to 30% on operational costs after implementing remote work policies.

Third, remote work improves employee satisfaction and retention. Employees value the flexibility to work from home, as it allows them to better balance their professional and personal lives. This increased satisfaction leads to higher employee retention rates, reducing recruitment and training costs for companies.`,
    audioTranscript: `Now listen to part of a lecture on the same topic.

Professor: While the reading passage highlights the benefits of remote work, there are several significant drawbacks that the passage fails to mention. Let me address each point.

First, regarding productivity - yes, some employees are more productive at home, but many others struggle. The lack of clear boundaries between work and personal life can actually decrease productivity. Many remote workers report working longer hours without accomplishing more, leading to burnout. Additionally, collaboration becomes much harder when teams aren't physically together. Spontaneous brainstorming sessions and quick problem-solving discussions that happen naturally in offices are lost in remote settings.

Second, while companies might save on office costs, they face other expenses. They need to invest in technology infrastructure - better security systems, collaboration software, and communication tools. They also need to provide equipment and internet allowances to employees. When you factor in these costs, the savings aren't as significant as claimed.

Third, regarding employee satisfaction - remote work can actually lead to isolation and mental health issues. Many employees report feeling lonely and disconnected from their colleagues. This isolation can decrease job satisfaction over time. Furthermore, remote workers often face difficulty advancing their careers because they're "out of sight, out of mind" when promotion opportunities arise. This lack of career growth opportunities can actually increase turnover, not reduce it.`,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    audioLength: 120,
    prompt: "Summarize the points made in the lecture, being sure to explain how they challenge the specific points made in the reading passage.",
    responseTime: 1200, // 20 minutes
    wordLimit: { min: 150, max: 225 },
    tips: [
      "Read the passage carefully and take notes on main points",
      "Listen carefully to the lecture - it will contradict the reading",
      "Organize your response: Introduction, 3 body paragraphs (one for each point), conclusion",
      "Don't give your personal opinion - just summarize both sources",
      "Use transition words like 'The reading states... However, the lecture argues...'",
      "Aim for 150-225 words",
    ],
    sampleResponse: `The reading passage argues that remote work offers significant benefits, while the lecture challenges each of these claims.

First, the reading asserts that remote work increases productivity due to fewer distractions and no commuting. However, the professor counters that many employees actually struggle with productivity at home because work-life boundaries blur, leading to burnout. Additionally, the lecture points out that collaboration suffers without face-to-face interaction.

Second, regarding cost savings, the reading claims companies save up to 30% on operational expenses like office space and utilities. The lecture challenges this by arguing that companies must invest heavily in technology infrastructure, security systems, and employee equipment. When these costs are considered, the savings are not as substantial as suggested.

Third, the reading states that remote work improves employee satisfaction and retention by offering better work-life balance. The professor disputes this, explaining that remote workers often experience isolation and mental health issues. Furthermore, remote employees face career advancement difficulties because they're less visible, which can actually increase turnover rather than reduce it.

(169 words)`,
  },
  {
    id: "speaking-1",
    type: "Integrated Speaking",
    title: "Integrated Speaking Task 1: Campus Situation",
    readingTime: 45,
    readingPassage: `University Announces New Parking Fee Policy

Beginning next semester, the university will implement a new parking fee structure. Students who wish to park on campus will be required to purchase a parking permit for $200 per semester. Previously, parking was free for all students. The university administration states that this fee is necessary to fund improvements to campus parking facilities, including better lighting, security cameras, and the addition of 500 new parking spaces. The revenue will also support the maintenance of existing parking lots.`,
    audioTranscript: `Student 1 (Male): Did you see this announcement about parking fees? I can't believe they're charging us $200!

Student 2 (Female): I know, it seems expensive, but honestly, I think it's necessary. Have you tried to find parking after 9 AM? It's impossible. Last week I circled the parking lot for 30 minutes and ended up being late to class. If they add 500 new spaces, it'll be so much easier.

Student 1: But $200 is a lot of money. That's like two textbooks!

Student 2: True, but think about it - the parking lots are in terrible condition. There are potholes everywhere, and at night it's really dark and unsafe. My friend's car got broken into last month because there's no security. If the fee pays for better lighting and cameras, I'd feel much safer parking here. Plus, if you divide $200 by the number of days we're actually on campus, it's only like $2 per day. That's less than a coffee.

Student 1: I guess when you put it that way... but still, it's one more expense for students who are already struggling financially.

Student 2: That's fair, but the improvements will benefit everyone. And if more people can find parking easily, we'll all save time and stress. I think it's worth it.`,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    audioLength: 90,
    prompt: "The woman expresses her opinion about the university's new parking fee policy. State her opinion and explain the reasons she gives for holding that opinion.",
    responseTime: 60, // 60 seconds
    tips: [
      "Read the announcement and identify the main points",
      "Listen for the woman's opinion (she supports or opposes?)",
      "Note her two main reasons",
      "Structure: State her opinion, give reason 1, give reason 2",
      "Speak clearly and at a moderate pace",
      "You have 60 seconds - practice timing yourself",
    ],
    sampleResponse: "The woman supports the university's new parking fee policy. She gives two main reasons. First, she believes the additional parking spaces are necessary because finding parking is extremely difficult, especially after 9 AM. She mentions spending 30 minutes looking for parking and being late to class. Second, she thinks the improvements to safety and security are important. She explains that the current parking lots have poor lighting and no security cameras, and her friend's car was broken into. She feels that better lighting and cameras would make parking safer. Although she acknowledges the fee is expensive, she calculates it's only about $2 per day, which she considers reasonable for the benefits.",
  },
  {
    id: "writing-2",
    type: "Integrated Writing",
    title: "Integrated Writing Task 2: Environmental Science",
    readingTime: 180,
    readingPassage: `The Impact of Wind Farms on Bird Populations

Wind energy has become an increasingly popular renewable energy source, with thousands of wind farms operating worldwide. However, environmental scientists have raised concerns about the impact of wind turbines on bird populations. Three main issues have been identified.

First, wind turbines cause direct mortality through collisions. Birds flying through areas with wind turbines may collide with the spinning blades, resulting in death. Studies estimate that hundreds of thousands of birds are killed annually by wind turbines in the United States alone. Raptors, such as eagles and hawks, are particularly vulnerable because they hunt in open areas where wind farms are typically located.

Second, wind farms disrupt bird migration patterns. Many bird species follow traditional migration routes that have been used for generations. When wind farms are constructed along these routes, birds must alter their flight paths, which can lead to increased energy expenditure and stress. Some birds may avoid areas with wind turbines entirely, effectively losing important habitat.

Third, wind farms cause habitat fragmentation. The construction of wind farms requires roads, power lines, and other infrastructure that divides natural habitats into smaller, isolated patches. This fragmentation can reduce the quality of nesting and feeding areas for birds, ultimately affecting their reproductive success and survival rates.`,
    audioTranscript: `Professor: The reading raises valid concerns, but recent research suggests the threat to bird populations from wind farms has been overstated. Let me address each point.

Regarding collision mortality, yes, birds do collide with wind turbines, but the numbers need context. Recent comprehensive studies show that wind turbines cause far fewer bird deaths than other human structures. For instance, communication towers kill about 6 million birds annually in the US, and buildings with glass windows kill nearly one billion birds each year. By comparison, wind turbines cause fewer than 300,000 deaths annually. Additionally, newer turbine designs rotate more slowly and are painted with patterns that make them more visible to birds, significantly reducing collision rates.

As for migration disruption, birds are remarkably adaptable. Tracking studies using GPS tags have shown that birds quickly learn to fly around wind farms. Within one or two migration seasons, most bird populations adjust their routes with minimal impact on their energy reserves. In fact, some birds have been observed using wind farm structures as resting spots during migration.

Finally, concerning habitat fragmentation, well-planned wind farms actually have minimal impact. Modern wind farms are designed with spacing that allows wildlife to move freely between turbines. The actual footprint of each turbine is quite small - the tower base occupies less than half an acre. The land between turbines can still be used for agriculture or left as natural habitat, meaning birds retain access to feeding and nesting areas.`,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    audioLength: 120,
    prompt: "Summarize the points made in the lecture, explaining how they respond to the specific concerns raised in the reading passage.",
    responseTime: 1200,
    wordLimit: { min: 150, max: 225 },
    tips: [
      "Identify the three main concerns in the reading passage",
      "Note how the lecture addresses each concern with counterarguments",
      "Use clear transitions between paragraphs",
      "Stay objective - don't add your own opinions",
      "Manage your time: 3-4 minutes planning, 15 minutes writing, 2 minutes reviewing",
    ],
  },
];

export default function TOEFLIntegratedPage() {
  const router = useRouter();
  const [selectedTask, setSelectedTask] = useState<TOEFLTask>(toeflTasks[0]);
  const [stage, setStage] = useState<"reading" | "listening" | "response">("reading");
  const [readingTimeLeft, setReadingTimeLeft] = useState(selectedTask.readingTime);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [responseTimeLeft, setResponseTimeLeft] = useState(selectedTask.responseTime);
  const [userResponse, setUserResponse] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [showSample, setShowSample] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const readingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const responseTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startReadingTimer = () => {
    if (readingTimerRef.current) clearInterval(readingTimerRef.current);
    setReadingTimeLeft(selectedTask.readingTime);
    readingTimerRef.current = setInterval(() => {
      setReadingTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(readingTimerRef.current!);
          setStage("listening");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsAudioPlaying(true);
    }
  };

  const startResponseTimer = () => {
    if (responseTimerRef.current) clearInterval(responseTimerRef.current);
    setResponseTimeLeft(selectedTask.responseTime);
    responseTimerRef.current = setInterval(() => {
      setResponseTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(responseTimerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startRecording = async () => {
    try {
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
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      alert("Microphone access denied. Please enable microphone permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const resetTask = () => {
    setStage("reading");
    setUserResponse("");
    setAudioBlob(null);
    setShowSample(false);
    if (readingTimerRef.current) clearInterval(readingTimerRef.current);
    if (responseTimerRef.current) clearInterval(responseTimerRef.current);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const wordCount = userResponse.trim().split(/\s+/).filter(w => w.length > 0).length;

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: "var(--primary-bg)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-[var(--card-bg)] rounded-2xl shadow-lg p-6 mb-6" style={{ borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>TOEFL Integrated Tasks</h1>
            <button
              onClick={() => router.push("/english/ielts-toefl/toefl-integrated")}
              className="font-medium transition-colors"
              style={{ color: "var(--foreground-secondary)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--foreground)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--foreground-secondary)";
              }}
            >
              ← Back
            </button>
          </div>

          {/* Task Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {toeflTasks.map((task) => (
              <button
                key={task.id}
                onClick={() => {
                  setSelectedTask(task);
                  resetTask();
                }}
                className="px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-all"
                style={
                  selectedTask.id === task.id
                    ? {
                        background: "linear-gradient(to right, #4255FF, #4255FF)",
                        color: "#ffffff"
                      }
                    : {
                        background: "var(--hover-bg)",
                        color: "var(--foreground-secondary)",
                        border: "1px solid var(--card-border)"
                      }
                }
                onMouseEnter={(e) => {
                  if (selectedTask.id !== task.id) {
                    e.currentTarget.style.background = "rgba(66, 85, 255, 0.1)";
                    e.currentTarget.style.color = "var(--foreground)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedTask.id !== task.id) {
                    e.currentTarget.style.background = "var(--hover-bg)";
                    e.currentTarget.style.color = "var(--foreground-secondary)";
                  }
                }}
              >
                {task.title}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Instructions & Tips */}
          <div className="space-y-6">
            {/* Task Info */}
            <div className="bg-[var(--card-bg)] rounded-2xl shadow-lg p-6" style={{ borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 text-[#3242CC] rounded-full text-sm font-semibold" style={{ background: "rgba(66, 85, 255, 0.15)" }}>
                  {selectedTask.type}
                </span>
              </div>
              <h2 className="text-xl font-bold mb-2" style={{ color: "var(--foreground)" }}>{selectedTask.title}</h2>
              <p className="text-sm" style={{ color: "var(--foreground-secondary)" }}>{selectedTask.prompt}</p>
            </div>

            {/* Tips */}
            <div className="bg-[var(--card-bg)] rounded-2xl shadow-lg p-6" style={{ borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}>
              <h3 className="font-semibold mb-3" style={{ color: "var(--foreground)" }}>💡 Tips</h3>
              <ul className="space-y-2">
                {selectedTask.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm" style={{ color: "var(--foreground-secondary)" }}>
                    <span className="text-[#4255FF] font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stage Progress */}
            <div className="rounded-lg p-4" style={{ background: "rgba(66, 85, 255, 0.1)", borderColor: "rgba(66, 85, 255, 0.3)", borderWidth: "1px", borderStyle: "solid" }}>
              <h4 className="font-semibold mb-3" style={{ color: "var(--foreground)" }}>Task Stages:</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2" style={{ color: stage === "reading" ? "#4255FF" : "var(--muted)", fontWeight: stage === "reading" ? "600" : "400" }}>
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm">1. Reading ({selectedTask.readingTime / 60} min)</span>
                </div>
                <div className="flex items-center gap-2" style={{ color: stage === "listening" ? "#4255FF" : "var(--muted)", fontWeight: stage === "listening" ? "600" : "400" }}>
                  <Volume2 className="w-4 h-4" />
                  <span className="text-sm">2. Listening (~{Math.round(selectedTask.audioLength / 60)} min)</span>
                </div>
                <div className="flex items-center gap-2" style={{ color: stage === "response" ? "#4255FF" : "var(--muted)", fontWeight: stage === "response" ? "600" : "400" }}>
                  {selectedTask.type === "Integrated Writing" ? <FileText className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  <span className="text-sm">3. Response ({selectedTask.responseTime / 60} min)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Reading Stage */}
            {stage === "reading" && (
              <div className="bg-[var(--card-bg)] rounded-2xl shadow-lg p-6" style={{ borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>Reading Passage</h3>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: "rgba(66, 85, 255, 0.15)" }}>
                    <Clock className="w-5 h-5 text-[#4255FF]" />
                    <span className="font-semibold text-[#4255FF]">{formatTime(readingTimeLeft)}</span>
                  </div>
                </div>
                <div className="rounded-lg p-6 max-h-96 overflow-y-auto mb-4" style={{ background: "var(--hover-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid", color: "var(--foreground)" }}>
                  <p className="whitespace-pre-wrap leading-relaxed">{selectedTask.readingPassage}</p>
                </div>
                <button
                  onClick={startReadingTimer}
                  className="w-full text-white py-4 px-6 rounded-lg font-semibold transition-all"
                  style={{
                    background: "linear-gradient(to right, #4255FF, #4255FF)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#3242CC";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(66, 85, 255, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "linear-gradient(to right, #4255FF, #4255FF)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  Start Reading Timer
                </button>
              </div>
            )}

            {/* Listening Stage */}
            {stage === "listening" && (
              <div className="bg-[var(--card-bg)] rounded-2xl shadow-lg p-6" style={{ borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: "var(--foreground)" }}>Listening</h3>
                <div className="border-2 rounded-lg p-8 text-center mb-4" style={{ background: "rgba(66, 85, 255, 0.08)", borderColor: "rgba(66, 85, 255, 0.3)" }}>
                  <Volume2 className="w-16 h-16 text-[#4255FF] mx-auto mb-4" />
                  <p className="mb-4" style={{ color: "var(--foreground-secondary)" }}>Listen to the lecture carefully. You can only play it once.</p>
                  <audio
                    ref={audioRef}
                    src={selectedTask.audioUrl}
                    onEnded={() => {
                      setIsAudioPlaying(false);
                      setTimeout(() => {
                        setStage("response");
                        startResponseTimer();
                      }, 1000);
                    }}
                  />
                  <button
                    onClick={playAudio}
                    disabled={isAudioPlaying}
                    className="text-white py-3 px-8 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: "#4255FF"
                    }}
                    onMouseEnter={(e) => {
                      if (!e.currentTarget.disabled) {
                        e.currentTarget.style.background = "#3242CC";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(66, 85, 255, 0.3)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#4255FF";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {isAudioPlaying ? "Playing..." : "Play Audio"}
                  </button>
                </div>
                <div className="rounded-lg p-4" style={{ background: "rgba(245, 158, 11, 0.1)", borderColor: "rgba(245, 158, 11, 0.3)", borderWidth: "1px", borderStyle: "solid" }}>
                  <p className="text-sm" style={{ color: "var(--foreground-secondary)" }}>⚠️ The audio will play only once, just like in the real TOEFL test. Take notes while listening!</p>
                </div>
              </div>
            )}

            {/* Response Stage */}
            {stage === "response" && (
              <div className="bg-[var(--card-bg)] rounded-2xl shadow-lg p-6" style={{ borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>Your Response</h3>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: "rgba(66, 85, 255, 0.15)" }}>
                    <Clock className="w-5 h-5 text-[#4255FF]" />
                    <span className="font-semibold text-[#4255FF]">{formatTime(responseTimeLeft)}</span>
                  </div>
                </div>

                {selectedTask.type === "Integrated Writing" ? (
                  <div className="space-y-4">
                    <textarea
                      value={userResponse}
                      onChange={(e) => setUserResponse(e.target.value)}
                      placeholder="Write your response here..."
                      className="w-full h-96 p-4 border-2 rounded-lg focus:outline-none transition-colors"
                      style={{
                        background: "var(--hover-bg)",
                        color: "var(--foreground)",
                        borderColor: "var(--card-border)"
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#4255FF";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "var(--card-border)";
                      }}
                    />
                    <div className="flex justify-between text-sm" style={{ color: "var(--muted)" }}>
                      <span>Word count: {wordCount}</span>
                      {selectedTask.wordLimit && (
                        <span style={{ color: wordCount < selectedTask.wordLimit.min || wordCount > selectedTask.wordLimit.max ? "#f97316" : "#10b981", fontWeight: wordCount < selectedTask.wordLimit.min || wordCount > selectedTask.wordLimit.max ? "600" : "400" }}>
                          Target: {selectedTask.wordLimit.min}-{selectedTask.wordLimit.max} words
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="border rounded-lg p-6 text-center" style={{ background: "rgba(66, 85, 255, 0.08)", borderColor: "rgba(66, 85, 255, 0.3)" }}>
                      <Mic className="w-12 h-12 text-[#4255FF] mx-auto mb-3" />
                      <p className="mb-4" style={{ color: "var(--foreground-secondary)" }}>Record your spoken response (60 seconds)</p>
                      {!isRecording && !audioBlob && (
                        <button
                          onClick={startRecording}
                          className="text-white py-3 px-6 rounded-lg font-semibold transition-all"
                          style={{
                            background: "#ef4444"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#dc2626";
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(239, 68, 68, 0.3)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#ef4444";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          Start Recording
                        </button>
                      )}
                      {isRecording && (
                        <button
                          onClick={stopRecording}
                          className="text-white py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 mx-auto"
                          style={{
                            background: "#6b7280"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#4b5563";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#6b7280";
                          }}
                        >
                          <Square className="w-5 h-5" />
                          Stop Recording
                        </button>
                      )}
                      {audioBlob && (
                        <div className="space-y-3">
                          <div className="rounded-lg p-3" style={{ background: "rgba(16, 185, 129, 0.1)", borderColor: "rgba(16, 185, 129, 0.3)", borderWidth: "1px", borderStyle: "solid" }}>
                            <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                            <p className="font-semibold" style={{ color: "#10b981" }}>Recording Complete!</p>
                          </div>
                          <audio src={URL.createObjectURL(audioBlob)} controls className="w-full" style={{ accentColor: "#4255FF" }} />
                          <button
                            onClick={() => setAudioBlob(null)}
                            className="py-2 px-4 rounded-lg font-semibold transition-all"
                            style={{
                              background: "var(--hover-bg)",
                              color: "var(--foreground-secondary)"
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "rgba(0, 0, 0, 0.1)";
                              e.currentTarget.style.color = "var(--foreground)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "var(--hover-bg)";
                              e.currentTarget.style.color = "var(--foreground-secondary)";
                            }}
                          >
                            Record Again
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={resetTask}
                    className="flex-1 py-3 px-4 rounded-lg font-semibold transition-all"
                    style={{
                      background: "var(--hover-bg)",
                      color: "var(--foreground-secondary)"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(0, 0, 0, 0.1)";
                      e.currentTarget.style.color = "var(--foreground)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "var(--hover-bg)";
                      e.currentTarget.style.color = "var(--foreground-secondary)";
                    }}
                  >
                    Restart Task
                  </button>
                  {selectedTask.sampleResponse && (
                    <button
                      onClick={() => setShowSample(!showSample)}
                      className="flex-1 text-white py-3 px-4 rounded-lg font-semibold transition-all"
                      style={{
                        background: "#4255FF"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#3242CC";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(66, 85, 255, 0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#4255FF";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      {showSample ? "Hide" : "Show"} Sample Response
                    </button>
                  )}
                </div>

                {showSample && selectedTask.sampleResponse && (
                  <div className="mt-6 rounded-lg p-6" style={{ background: "rgba(16, 185, 129, 0.08)", borderColor: "rgba(16, 185, 129, 0.3)", borderWidth: "2px", borderStyle: "solid" }}>
                    <h4 className="font-semibold mb-3" style={{ color: "var(--foreground)" }}>Sample Response:</h4>
                    <p className="whitespace-pre-wrap" style={{ color: "var(--foreground-secondary)" }}>{selectedTask.sampleResponse}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
