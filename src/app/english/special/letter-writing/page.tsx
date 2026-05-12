"use client";

import WritingPracticeInterface, { WritingPrompt } from "@/components/writing-practice-interface";

const letterPrompts: WritingPrompt[] = [
  {
    id: "formal-job",
    title: "Job Application",
    category: "Formal",
    prompt: `Write a formal letter applying for the position of Marketing Manager at ABC Company.

Include:
- Your address and date
- Company address
- Formal salutation
- Introduction stating the position
- Your qualifications and experience
- Why you're interested
- Closing with call to action

Write at least 150 words.`,
    wordCount: 150,
    timeLimit: 20,
    tips: [
      "Use formal letter format with addresses and date",
      "Begin with 'Dear Sir/Madam' or specific name if known",
      "State the position clearly in opening paragraph",
      "Highlight relevant qualifications in body paragraphs",
      "Express enthusiasm for the role",
      "Close with 'Yours sincerely' (name known) or 'Yours faithfully' (unknown)",
    ],
    sampleAnswer: `[Your Address]
[City, PIN Code]
[Date]

The Hiring Manager
ABC Company
[Company Address]
[City, PIN Code]

Dear Sir/Madam,

I am writing to apply for the position of Marketing Manager advertised on your company website. With over five years of experience in digital marketing and a proven track record of successful campaigns, I believe I would be an excellent fit for your team.

In my current role as Senior Marketing Executive at XYZ Corporation, I have successfully managed campaigns that increased brand awareness by 40% and boosted sales by 25%. I have extensive experience in social media marketing, content creation, SEO, and data analytics. My strong leadership skills have enabled me to mentor junior team members effectively.

I am particularly attracted to ABC Company because of your innovative approach to sustainable marketing and your commitment to social responsibility. I am confident that my skills and passion align perfectly with your organization's values and goals.

I would welcome the opportunity to discuss how my experience and enthusiasm can contribute to ABC Company's continued success. I am available for an interview at your convenience.

Thank you for considering my application.

Yours faithfully,
[Your Name]

(175 words)`,
  },
  {
    id: "formal-complaint",
    title: "Complaint Letter",
    category: "Formal",
    prompt: `Write a formal letter to a company complaining about a defective product you purchased.

Include:
- Details of purchase (what, when, where)
- Description of the problem
- Impact on you
- What action you expect
- Timeline for resolution

Write at least 150 words.`,
    wordCount: 150,
    timeLimit: 20,
    tips: [
      "Maintain professional tone despite frustration",
      "Provide specific details (order number, date, product name)",
      "Clearly state the problem and its impact",
      "Request specific action (refund, replacement, compensation)",
      "Set reasonable deadline for response",
      "Keep copies of all correspondence",
    ],
  },
  {
    id: "formal-request",
    title: "Leave Request",
    category: "Formal",
    prompt: `Write a formal letter to your manager requesting leave for a family emergency.

Include:
- Purpose of leave
- Duration (start and end dates)
- Arrangements made for your responsibilities
- Contact information during absence
- Expression of gratitude

Write at least 120 words.`,
    wordCount: 120,
    timeLimit: 15,
    tips: [
      "Be brief but provide necessary details",
      "State dates clearly and number of days",
      "Show responsibility by mentioning work coverage",
      "Maintain professional tone",
      "Express willingness to provide more information if needed",
    ],
  },
  {
    id: "informal-friend",
    title: "Letter to a Friend",
    category: "Informal",
    prompt: `Write an informal letter to a friend inviting them to visit you during holidays.

Include:
- Warm greeting
- Ask about their well-being
- Extend the invitation with details
- Suggest activities you can do together
- Express excitement about meeting
- Casual closing

Write at least 120 words.`,
    wordCount: 120,
    timeLimit: 15,
    tips: [
      "Use casual, friendly language",
      "Can use contractions (I'm, we'll, don't)",
      "Show personality and emotion",
      "Ask questions to show interest",
      "Use informal closing like 'Your friend' or 'Best wishes'",
    ],
    sampleAnswer: `Dear Rahul,

Hey! How are you doing? It's been ages since we last met, and I really miss our long conversations and the fun times we used to have together.

I'm writing to invite you to visit me during the upcoming winter holidays. I'm planning to take a week off from work, and it would be amazing if you could come and stay with me. We could finally catch up properly!

I've already planned some exciting activities for us. We could visit the new adventure park that just opened, try out that amazing restaurant everyone's been talking about, and maybe even take a short trip to the nearby hill station if you're up for it. We can also just chill at home, watch movies, and talk like old times.

Please try to make it happen. These holidays would be so much better with you here. Let me know your dates soon so I can make arrangements.

Can't wait to see you!

Your friend,
Amit

(165 words)`,
  },
  {
    id: "informal-family",
    title: "Letter to Family",
    category: "Informal",
    prompt: `Write an informal letter to your parents/family updating them about your life in a new city.

Include:
- Warm greeting
- Update about accommodation and settling in
- Work/study progress
- New friends or experiences
- Reassurance that you're doing well
- Miss them and plan to visit

Write at least 150 words.`,
    wordCount: 150,
    timeLimit: 20,
    tips: [
      "Express warmth and affection",
      "Share both achievements and challenges honestly",
      "Reassure them about your well-being",
      "Ask about their health and activities",
      "Mention specific details they'd want to know",
      "End with love and plans to connect",
    ],
  },
];

export default function LetterWritingPage() {
  return (
    <WritingPracticeInterface
      title="Letter Writing Practice"
      description="Master formal and informal letter writing with templates"
      prompts={letterPrompts}
      categories={["Formal", "Informal"]}
      showCategories={true}
    />
  );
}
