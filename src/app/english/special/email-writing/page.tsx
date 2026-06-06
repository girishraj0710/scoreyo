"use client";

import WritingPracticeInterface, { WritingPrompt } from "@/components/writing-practice-interface";

const emailPrompts: WritingPrompt[] = [
  {
    id: "prof-meeting",
    title: "Meeting Request",
    category: "Professional",
    prompt: `Write a professional email to your colleague requesting a meeting to discuss a project.

Include:
- Clear subject line
- Professional greeting
- Purpose of meeting
- Proposed time options
- Agenda items
- Professional closing

Write at least 100 words.`,
    wordCount: 100,
    timeLimit: 10,
    tips: [
      "Subject line should be clear and specific",
      "Keep email concise and to the point",
      "Suggest specific dates/times",
      "Bullet points for agenda items make it scannable",
      "Always include professional signature",
    ],
    sampleAnswer: `Subject: Request for Project Discussion Meeting

Dear Sarah,

I hope this email finds you well.

I'm writing to request a meeting to discuss the upcoming marketing campaign project. There are several important aspects we need to align on before moving forward.

Would you be available for a 30-minute meeting this week? I'm free on:
- Wednesday, 2:00 PM - 4:00 PM
- Thursday, 10:00 AM - 12:00 PM
- Friday, 3:00 PM - 5:00 PM

We should cover:
- Campaign objectives and KPIs
- Budget allocation
- Timeline and milestones
- Team responsibilities

Please let me know which time works best for you, or suggest an alternative if none of these suit your schedule.

Looking forward to your response.

Best regards,
Michael Chen
Marketing Manager
Email: michael.chen@company.com
Phone: +91-98765-43210

(130 words)`,
  },
  {
    id: "prof-complaint",
    title: "Service Complaint",
    category: "Professional",
    prompt: `Write a professional complaint email to customer service about a delayed order.

Include:
- Subject line with order number
- Order details (date, product, order number)
- Problem description
- Impact/inconvenience caused
- Expected resolution
- Professional but firm tone

Write at least 120 words.`,
    wordCount: 120,
    timeLimit: 12,
    tips: [
      "Include all relevant details (order #, dates)",
      "Be factual and specific, not emotional",
      "Clearly state what went wrong",
      "Request specific action (refund/replacement)",
      "Set reasonable deadline for response",
    ],
  },
  {
    id: "prof-followup",
    title: "Follow-up Email",
    category: "Professional",
    prompt: `Write a follow-up email after a job interview.

Include:
- Thank you for the opportunity
- Reiterate interest in position
- Mention specific discussion points
- Offer to provide additional information
- Professional closing

Write at least 100 words.`,
    wordCount: 100,
    timeLimit: 10,
    tips: [
      "Send within 24 hours of interview",
      "Express genuine enthusiasm",
      "Reference specific conversation points",
      "Keep it brief but meaningful",
      "Proofread carefully for errors",
    ],
    sampleAnswer: `Subject: Thank You - Marketing Manager Interview

Dear Ms. Johnson,

Thank you for taking the time to meet with me yesterday to discuss the Marketing Manager position. I genuinely enjoyed our conversation and learning more about ABC Company's innovative marketing strategies.

I was particularly excited to hear about your plans for expanding into digital marketing and the new social media campaign launching next quarter. My experience in managing similar campaigns would allow me to contribute immediately to these initiatives.

Our discussion reinforced my strong interest in joining your team. I'm confident that my skills in data-driven marketing and team leadership align well with your requirements and company culture.

Please feel free to contact me if you need any additional information or references. I look forward to hearing about the next steps in the hiring process.

Thank you again for this opportunity.

Best regards,
Priya Sharma
priya.sharma@email.com
+91-98765-12345

(145 words)`,
  },
  {
    id: "casual-friend",
    title: "Catching Up with Friend",
    category: "Casual",
    prompt: `Write a casual email to a friend you haven't talked to in a while.

Include:
- Friendly greeting
- Acknowledge it's been a while
- Update on your life
- Ask about their life
- Suggest reconnecting
- Warm closing

Write at least 100 words.`,
    wordCount: 100,
    timeLimit: 10,
    tips: [
      "Use conversational, friendly tone",
      "Contractions are fine (I'm, we've, don't)",
      "Show genuine interest in their life",
      "Share personal updates",
      "Suggest specific ways to reconnect",
    ],
    sampleAnswer: `Subject: Long time no see!

Hey Rajesh!

Hope you're doing great! I know it's been forever since we last caught up – life just gets so busy, doesn't it?

I've been meaning to reach out for weeks now. Work has been crazy lately with the new project, but in a good way. Plus, I finally started learning guitar like we always talked about! Remember how we used to discuss starting a band? 😄

How have you been? How's the new job going? And did you ever take that trip to Goa you were planning?

We should definitely meet up soon. Maybe grab coffee next weekend? Or if you're free, we could do a video call this week and catch up properly.

Miss the old times, man. Let's not lose touch again!

Take care,
Amit

P.S. Still remember that epic cricket match in college? Good times!

(150 words)`,
  },
  {
    id: "casual-invitation",
    title: "Party Invitation",
    category: "Casual",
    prompt: `Write a casual email inviting friends to your birthday party.

Include:
- Exciting subject line
- Party details (date, time, venue)
- Dress code (if any)
- RSVP request
- Express excitement
- Casual, fun tone

Write at least 80 words.`,
    wordCount: 80,
    timeLimit: 8,
    tips: [
      "Make subject line catchy and fun",
      "Include all essential details clearly",
      "Create excitement and anticipation",
      "Request RSVP for planning purposes",
      "Can use emojis if appropriate for your friend group",
    ],
  },
  {
    id: "formal-leave",
    title: "Leave Request Email",
    category: "Professional",
    prompt: `Write a formal email to your manager requesting leave.

Include:
- Clear subject line
- Dates of leave
- Reason (if comfortable sharing)
- Work coverage plan
- Contact availability
- Professional tone

Write at least 100 words.`,
    wordCount: 100,
    timeLimit: 10,
    tips: [
      "Give advance notice when possible",
      "Be clear about dates and duration",
      "Show you've arranged work coverage",
      "Indicate if you'll be reachable",
      "Keep personal reasons brief",
    ],
    sampleAnswer: `Subject: Leave Request - October 15-20

Dear Mr. Patel,

I am writing to formally request leave from October 15 to October 20 (5 working days) due to a family commitment that requires my presence in my hometown.

I have ensured that all my current projects are either completed or can be handled in my absence:

- The Q3 report will be submitted by October 14
- Ramesh has agreed to cover my daily tasks
- I've briefed Sneha on the ongoing client presentation
- All urgent matters will be resolved before I leave

I will have limited access to email during this period but can be reached by phone for any emergencies at +91-98765-43210.

I would appreciate your approval for this leave request. Please let me know if you need any additional information or if there are concerns about this timing.

Thank you for your consideration.

Best regards,
Kavita Singh
Senior Analyst

(150 words)`,
  },
];

export default function EmailWritingPage() {
  return (
    <WritingPracticeInterface
      title="Email Writing Practice"
      description="Master professional and casual email writing"
      prompts={emailPrompts}
      categories={["Professional", "Casual"]}
      showCategories={true}
      backPath="/english/real-world/email-writing"
    />
  );
}
