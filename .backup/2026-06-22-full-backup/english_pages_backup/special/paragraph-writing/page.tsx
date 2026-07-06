"use client";

import WritingPracticeInterface, { WritingPrompt } from "@/components/writing-practice-interface";

const paragraphPrompts: WritingPrompt[] = [
  {
    id: "descriptive-1",
    title: "My Favorite Place",
    category: "Descriptive",
    prompt: `Write a descriptive paragraph about your favorite place.

Include:
- Where it is located
- What it looks like
- Why you like it
- How it makes you feel

Write at least 100 words.`,
    wordCount: 100,
    timeLimit: 15,
    tips: [
      "Start with a topic sentence introducing the place",
      "Use sensory details (sight, sound, smell, touch)",
      "Describe specific features that make it special",
      "End with a concluding sentence about its importance to you",
      "Use vivid adjectives and descriptive language",
    ],
    sampleAnswer: `My favorite place is the local library near my house. It is a beautiful two-story building with large windows that let in plenty of natural light. Inside, the smell of books fills the air, creating a calming atmosphere. Tall wooden bookshelves line the walls, packed with thousands of books on every subject imaginable. I love this place because it offers me a peaceful escape from the busy world outside. The comfortable reading chairs by the windows are perfect for getting lost in a good book. The library also has a quiet study area where I can concentrate on my work without any distractions. Whenever I feel stressed or overwhelmed, I visit the library, and within minutes, I feel relaxed and refreshed. This special place has been my sanctuary for years, and I cherish every moment I spend there.

(150 words)`,
  },
  {
    id: "narrative-1",
    title: "An Unforgettable Experience",
    category: "Narrative",
    prompt: `Write a narrative paragraph about an unforgettable experience in your life.

Include:
- When and where it happened
- What happened (chronological order)
- How you felt
- Why it was memorable

Write at least 120 words.`,
    wordCount: 120,
    timeLimit: 15,
    tips: [
      "Begin with a strong opening sentence that hooks the reader",
      "Tell the story in chronological order (first, then, finally)",
      "Include specific details about what happened",
      "Express your emotions and reactions",
      "End with a reflection on why this experience matters",
    ],
    sampleAnswer: `Last summer, I had an unforgettable experience when I went trekking in the Himalayas with my friends. We started our journey early in the morning, filled with excitement and anticipation. The trail was challenging, with steep climbs and rocky paths, but the breathtaking views kept us motivated. After six hours of continuous walking, we finally reached the summit just as the sun was setting. The sight before us was absolutely magical – snow-capped peaks glowing in golden light, with clouds floating beneath our feet like a soft white carpet. At that moment, standing 4,000 meters above sea level, I felt on top of the world. My legs were tired, my lungs burned from the thin air, but my heart was full of joy and accomplishment. This experience taught me that the most rewarding moments in life often come after the hardest struggles. I will never forget that incredible day.

(160 words)`,
  },
  {
    id: "expository-1",
    title: "Benefits of Reading",
    category: "Expository",
    prompt: `Write an expository paragraph explaining the benefits of reading books.

Include:
- Main benefit as topic sentence
- 2-3 supporting points with examples
- Concluding sentence

Write at least 100 words.`,
    wordCount: 100,
    timeLimit: 12,
    tips: [
      "Start with a clear topic sentence stating the main idea",
      "Present facts and information, not opinions",
      "Use transition words (firstly, moreover, furthermore)",
      "Support each point with examples or explanations",
      "End with a strong conclusion summarizing the benefits",
    ],
    sampleAnswer: `Reading books offers numerous benefits that enhance both mental and emotional well-being. Firstly, regular reading improves vocabulary and language skills by exposing readers to new words and sentence structures in context. This expanded vocabulary helps in better communication and expression of ideas. Secondly, reading enhances concentration and focus, as it requires sustained attention to follow a story or understand complex concepts. In today's world of constant digital distractions, this skill is increasingly valuable. Moreover, reading reduces stress and promotes relaxation by allowing readers to escape into different worlds and temporarily forget their daily worries. Studies have shown that just six minutes of reading can reduce stress levels by up to 68%. Finally, books expand knowledge and understanding of diverse cultures, perspectives, and ideas, making readers more empathetic and well-rounded individuals. Therefore, incorporating regular reading into one's daily routine is one of the best investments in personal growth and mental health.

(160 words)`,
  },
  {
    id: "persuasive-1",
    title: "Should Students Have Homework?",
    category: "Persuasive",
    prompt: `Write a persuasive paragraph arguing your position on whether students should have homework.

Include:
- Clear position statement
- 2-3 strong arguments
- Counter-argument acknowledgment (optional)
- Call to action or conclusion

Write at least 120 words.`,
    wordCount: 120,
    timeLimit: 15,
    tips: [
      "State your position clearly in the first sentence",
      "Use persuasive language and strong arguments",
      "Support arguments with logical reasoning or examples",
      "Address potential counter-arguments to strengthen your case",
      "End with a compelling conclusion or call to action",
    ],
    sampleAnswer: `Students should have homework in moderation as it reinforces classroom learning and builds essential life skills. Firstly, homework allows students to practice and apply concepts taught in school, which strengthens understanding and retention. Without regular practice, students may forget important information and struggle with more advanced topics later. Secondly, homework teaches valuable skills like time management, self-discipline, and independent learning – abilities that are crucial for success in college and careers. While critics argue that excessive homework causes stress and reduces family time, the solution is not to eliminate homework entirely but to assign reasonable amounts that balance learning with well-being. Research shows that moderate homework (30-60 minutes per day) correlates with improved academic performance without causing undue stress. Therefore, instead of debating whether homework should exist, we should focus on ensuring that homework assignments are meaningful, appropriate for the student's age, and contribute genuinely to learning rather than being busywork.

(160 words)`,
  },
  {
    id: "compare-contrast-1",
    title: "Online vs. Classroom Learning",
    category: "Compare & Contrast",
    prompt: `Write a paragraph comparing online learning with traditional classroom learning.

Include:
- Introduction to both types
- Similarities and differences
- Your conclusion

Write at least 120 words.`,
    wordCount: 120,
    timeLimit: 15,
    tips: [
      "Introduce both subjects being compared",
      "Use comparison words (similarly, whereas, on the other hand)",
      "Discuss both similarities and differences",
      "Organize point-by-point or subject-by-subject",
      "End with a conclusion about the comparison",
    ],
    sampleAnswer: `Online learning and traditional classroom learning both aim to educate students, but they differ significantly in delivery and experience. In traditional classrooms, students learn face-to-face with teachers, benefiting from immediate feedback and personal interaction with peers. This environment fosters social skills and allows for hands-on activities and group discussions. On the other hand, online learning offers flexibility and convenience, allowing students to study from anywhere at their own pace. It uses digital tools, videos, and interactive platforms to deliver content. Both methods have their strengths: classroom learning excels in creating community and providing structure, whereas online learning offers accessibility and personalized scheduling. However, online learning requires more self-discipline and can feel isolating without in-person connections. Traditional classrooms provide routine and accountability but may not suit everyone's learning style or schedule. Ultimately, the best approach might be a hybrid model that combines the flexibility of online learning with the personal interaction of classroom education, giving students the advantages of both worlds.

(165 words)`,
  },
];

export default function ParagraphWritingPage() {
  return (
    <WritingPracticeInterface
      title="Paragraph Writing Practice"
      description="Master paragraph structure with guided prompts and tips"
      prompts={paragraphPrompts}
      categories={["Descriptive", "Narrative", "Expository", "Persuasive", "Compare & Contrast"]}
      showCategories={true}
      backPath="/english/foundation/paragraph-writing"
    />
  );
}
