/**
 * IELTS Speaking Questions Database
 * Part 1: Introduction & Interview (4-5 mins)
 * Part 2: Long Turn / Cue Card (3-4 mins)
 * Part 3: Discussion (4-5 mins)
 */

export interface SpeakingQuestion {
  id: number;
  part: 1 | 2 | 3;
  topic: string;
  question?: string;
  cueCard?: {
    title: string;
    points: string[];
    prepTime: number; // seconds
    speakTime: number; // seconds
  };
  sampleAnswer: string;
  tips: string[];
  keywords: string[];
}

export const speakingQuestions: SpeakingQuestion[] = [
  // PART 1: Introduction & Interview (30 questions)
  {
    id: 1,
    part: 1,
    topic: "Hometown",
    question: "Can you describe your hometown?",
    sampleAnswer: "I come from Mumbai, a vibrant coastal city in western India. It's known for being the financial capital of the country and home to Bollywood. What I love most about my hometown is its diversity - you can find people from all over India here, which creates a rich cultural tapestry. The city never sleeps, and there's always something happening, from street food markets to cultural festivals.",
    tips: [
      "Mention the location and size",
      "Describe what it's known for",
      "Express your personal feelings about it",
      "Keep it conversational and natural"
    ],
    keywords: ["coastal", "metropolitan", "diverse", "vibrant", "culture"]
  },
  {
    id: 2,
    part: 1,
    topic: "Work/Study",
    question: "Do you work or are you a student?",
    sampleAnswer: "I'm currently a student pursuing my engineering degree at a local university. I chose this field because I've always been fascinated by technology and how things work. What I enjoy most about my studies is the hands-on projects where we get to apply theoretical concepts to solve real-world problems. It's challenging but very rewarding.",
    tips: [
      "Clearly state whether you work or study",
      "Mention your field or job",
      "Explain why you chose it",
      "Share what you enjoy about it"
    ],
    keywords: ["student", "engineering", "technology", "projects", "university"]
  },
  {
    id: 3,
    part: 1,
    topic: "Hobbies",
    question: "What do you like to do in your free time?",
    sampleAnswer: "In my free time, I really enjoy reading, particularly science fiction novels. I find them a great escape from daily stress. I also like to go for evening walks in the nearby park - it helps me clear my mind and stay fit. On weekends, I often meet up with friends to try out new restaurants or watch movies.",
    tips: [
      "Mention 2-3 activities",
      "Explain why you enjoy them",
      "Give specific examples",
      "Show enthusiasm"
    ],
    keywords: ["reading", "walking", "relaxation", "socializing", "recreation"]
  },
  {
    id: 4,
    part: 1,
    topic: "Music",
    question: "What kind of music do you like?",
    sampleAnswer: "I have quite varied taste in music, but I'm particularly drawn to indie rock and alternative music. I appreciate music that has meaningful lyrics and interesting instrumentals. I usually listen to music while commuting or working - it helps me focus and puts me in a good mood. Artists like Arctic Monkeys and Tame Impala are some of my favorites.",
    tips: [
      "Mention specific genres",
      "Explain what you like about it",
      "Talk about when you listen",
      "Name some favorite artists if relevant"
    ],
    keywords: ["indie", "rock", "lyrics", "commuting", "mood"]
  },
  {
    id: 5,
    part: 1,
    topic: "Food",
    question: "What is your favorite type of food?",
    sampleAnswer: "I absolutely love Indian cuisine, especially dishes from my home region. There's something special about traditional curry with fresh naan bread. However, I also enjoy trying international cuisines - I've recently discovered a love for Japanese food, particularly sushi. I think trying different foods is a great way to experience different cultures.",
    tips: [
      "Be specific about the type of food",
      "Explain why you like it",
      "Mention variety if applicable",
      "Keep it personal"
    ],
    keywords: ["cuisine", "traditional", "international", "flavors", "culture"]
  },

  // PART 2: Cue Card Topics (20 questions)
  {
    id: 31,
    part: 2,
    topic: "Memorable Event",
    cueCard: {
      title: "Describe a memorable event in your life",
      points: [
        "What the event was",
        "When it happened",
        "Who was there with you",
        "And explain why it was memorable"
      ],
      prepTime: 60,
      speakTime: 120
    },
    sampleAnswer: "One of the most memorable events in my life was my graduation ceremony last year. It took place in June at my university's main auditorium, and my entire family was there to celebrate with me - my parents, siblings, and even my grandparents traveled from another city to attend.\n\nThe ceremony was beautifully organized, with all the graduates dressed in traditional robes. When my name was called and I walked across the stage to receive my degree, I felt an overwhelming sense of accomplishment. I could see my parents in the audience with proud smiles on their faces, which made the moment even more special.\n\nThis event is memorable for several reasons. Firstly, it marked the end of four years of hard work and dedication. There were times during my studies when I felt like giving up, especially during exam periods, but persevering through those challenges made this achievement even sweeter. Secondly, having my whole family there meant the world to me - their support throughout my education had been unwavering, and I was glad they could share this special moment. Finally, it represented the beginning of a new chapter in my life, transitioning from student to professional, which was both exciting and slightly daunting.",
    tips: [
      "Use past tenses throughout",
      "Organize your answer following the cue card points",
      "Add specific details and emotions",
      "Aim to speak for the full 2 minutes",
      "Use time expressions (firstly, secondly, finally)"
    ],
    keywords: ["graduation", "achievement", "family", "milestone", "accomplishment"]
  },
  {
    id: 32,
    part: 2,
    topic: "Book",
    cueCard: {
      title: "Describe a book you recently read",
      points: [
        "What the book was about",
        "When you read it",
        "Why you chose to read it",
        "And explain what you learned from it"
      ],
      prepTime: 60,
      speakTime: 120
    },
    sampleAnswer: "I'd like to talk about a fascinating book I read a few months ago called 'Sapiens' by Yuval Noah Harari. This book provides a sweeping overview of human history, from the evolution of Homo sapiens in Africa to the present day, and even speculates about our future.\n\nI read it during the summer holidays when I had more free time. I chose this book because several friends had recommended it, and I was curious about understanding human history from a broader perspective rather than just focusing on specific events or periods that we typically learn about in school.\n\nThe book is divided into four main parts, covering the cognitive revolution, the agricultural revolution, the unification of humankind, and the scientific revolution. What fascinated me most was Harari's ability to connect seemingly unrelated historical events and show how they shaped modern society. For instance, he explains how the agricultural revolution, which we often think of as progress, actually made life harder for average humans in many ways.\n\nWhat I learned from this book was truly eye-opening. It made me realize how much of what we consider 'natural' or 'obvious' in modern society is actually a result of human imagination and collective beliefs - things like money, nations, and companies only exist because we collectively believe in them. This book also taught me to question assumptions and look at familiar things from different angles. It's changed the way I think about human progress and our future as a species.",
    tips: [
      "Describe the book's content clearly",
      "Explain your motivation for reading it",
      "Discuss the impact it had on you",
      "Use specific examples from the book",
      "Show genuine interest and enthusiasm"
    ],
    keywords: ["history", "perspective", "insights", "thought-provoking", "learning"]
  },
  {
    id: 33,
    part: 2,
    topic: "Place",
    cueCard: {
      title: "Describe a place you would like to visit",
      points: [
        "Where it is",
        "What it is famous for",
        "How you know about this place",
        "And explain why you want to visit there"
      ],
      prepTime: 60,
      speakTime: 120
    },
    sampleAnswer: "I would absolutely love to visit Japan, specifically the city of Kyoto. It's located in the central part of Japan's main island and is known for being the cultural heart of the country.\n\nKyoto is famous for its classical Buddhist temples, beautiful gardens, imperial palaces, and traditional wooden houses. It's particularly stunning during cherry blossom season in spring and the autumn foliage season. The city also maintains many traditional arts and crafts, including tea ceremonies and geisha culture.\n\nI first learned about Kyoto through travel documentaries and social media posts from friends who had visited. What really captured my imagination were the photos of the Fushimi Inari shrine with its thousands of red torii gates, and the stunning bamboo forests of Arashiyama. I've also read about the city in several books about Japanese culture and history.\n\nThere are several reasons why I want to visit Kyoto. Firstly, I'm fascinated by Japanese culture, and Kyoto seems to be the perfect place to experience traditional Japan, unlike modern cities like Tokyo. I'd love to visit the ancient temples, participate in a traditional tea ceremony, and maybe even stay in a ryokan, which is a traditional Japanese inn. Secondly, I'm a photography enthusiast, and Kyoto offers countless opportunities for stunning photos, from zen gardens to historic streets. Lastly, I'm curious about experiencing the seasons there - I've heard that both spring and autumn are absolutely spectacular. I think visiting Kyoto would be not just a vacation, but a truly enriching cultural experience.",
    tips: [
      "Clearly identify the location",
      "Explain what makes it special",
      "Share how you discovered it",
      "Give multiple reasons for wanting to visit",
      "Show genuine enthusiasm"
    ],
    keywords: ["Japan", "culture", "temples", "traditional", "photography"]
  },
  {
    id: 34,
    part: 2,
    topic: "Person",
    cueCard: {
      title: "Describe a person who has influenced you",
      points: [
        "Who this person is",
        "How you know them",
        "What qualities they have",
        "And explain how they have influenced you"
      ],
      prepTime: 60,
      speakTime: 120
    },
    sampleAnswer: "The person who has influenced me the most is my high school mathematics teacher, Mr. Sharma. I knew him for three years during my senior secondary education, and his impact on my life extends far beyond just teaching me mathematics.\n\nMr. Sharma had several remarkable qualities. First and foremost, he had an incredible passion for teaching. He would arrive early and stay late, always available to help students who were struggling. He had this unique ability to make complex mathematical concepts seem simple and intuitive. But what struck me most was his patience - he never made anyone feel stupid for asking questions, no matter how basic.\n\nBeyond his teaching skills, Mr. Sharma was also very principled and honest. He treated all students equally and encouraged us to think independently rather than just memorizing formulas. He often shared life lessons alongside mathematical ones, teaching us about perseverance, integrity, and the importance of continuous learning.\n\nHis influence on me has been profound. Firstly, he helped me overcome my fear of mathematics. I used to find the subject intimidating, but his teaching methods made me not just understand it, but actually enjoy it. This eventually led me to choose engineering as my field of study. Secondly, he taught me the value of asking questions and being curious. I learned that admitting you don't understand something is not a weakness but the first step toward learning. Finally, his dedication and passion for his work inspired me to approach my own pursuits with similar commitment. Whenever I face challenges now, I remember his patience and persistence, which motivates me to keep going.",
    tips: [
      "Clearly identify the person and your relationship",
      "Describe their character with specific examples",
      "Explain concrete ways they influenced you",
      "Use various tenses appropriately",
      "Show emotion and personal connection"
    ],
    keywords: ["teacher", "mentor", "inspiration", "dedication", "influence"]
  },
  {
    id: 35,
    part: 2,
    topic: "Skill",
    cueCard: {
      title: "Describe a skill you would like to learn",
      points: [
        "What the skill is",
        "How you would learn it",
        "Why you want to learn it",
        "And explain how it would help you"
      ],
      prepTime: 60,
      speakTime: 120
    },
    sampleAnswer: "A skill I've been eager to learn is playing the guitar. It's something I've wanted to do since I was a teenager, but I never had the opportunity or time to pursue it seriously.\n\nMy plan to learn guitar would involve a combination of approaches. I would start with online tutorials and courses - there are excellent resources on YouTube and platforms like Fender Play that teach beginners step by step. I'd also consider taking a few private lessons from a local music teacher to ensure I'm learning proper technique from the beginning. Additionally, I'd practice daily, starting with simple chords and gradually moving to more complex songs. I believe consistent practice of at least 30 minutes every day would be crucial.\n\nThere are several reasons why I want to learn this skill. Firstly, I've always been passionate about music, and I think being able to create music myself rather than just listening would be incredibly fulfilling. Playing an instrument is a form of creative expression that I currently lack in my life. Secondly, many of my friends play musical instruments, and I'd love to be able to jam with them or even form a casual band for fun. There's something special about making music together. Lastly, I've heard that learning an instrument is excellent for mental health - it requires focus and can be very meditative, which would help me manage stress.\n\nLearning guitar would help me in multiple ways. It would give me a productive hobby that I could enjoy for the rest of my life. It would also boost my confidence - there's something empowering about mastering a new skill, especially one that can entertain others. Moreover, it would provide a healthy outlet for emotions and creativity. I think it would also help improve my discipline and patience, as learning an instrument requires consistent effort over a long period.",
    tips: [
      "Be specific about the skill",
      "Show you've thought about how to learn it",
      "Provide multiple reasons for wanting to learn",
      "Explain both personal and practical benefits",
      "Use future tenses appropriately (would, will)"
    ],
    keywords: ["guitar", "music", "creativity", "hobby", "self-improvement"]
  },

  // PART 3: Discussion Questions (25 questions)
  {
    id: 51,
    part: 3,
    topic: "Technology & Communication",
    question: "How has technology changed the way people communicate?",
    sampleAnswer: "Technology has revolutionized communication in profound ways. Firstly, it's made communication instantaneous regardless of distance. We can now video call someone on the other side of the world as easily as texting a neighbor. Social media platforms have also created new forms of communication that are more visual and interactive.\n\nHowever, there are both positive and negative aspects to consider. On the positive side, technology has made it easier to maintain relationships across distances and connect with people who share similar interests globally. It's also made professional communication more efficient. On the negative side, some argue that digital communication lacks the warmth and nuance of face-to-face interaction. People might feel more connected superficially but less deeply.\n\nLooking ahead, I think we'll see even more integration of virtual and augmented reality in communication, making remote interactions feel more lifelike. The challenge will be balancing technological convenience with maintaining genuine human connections.",
    tips: [
      "Give a clear, direct answer first",
      "Discuss both advantages and disadvantages",
      "Provide specific examples",
      "Show ability to think abstractly",
      "Use complex sentence structures",
      "Consider different perspectives"
    ],
    keywords: ["instant", "social media", "global", "connectivity", "virtual"]
  },
  {
    id: 52,
    part: 3,
    topic: "Education",
    question: "Do you think traditional education will be replaced by online learning?",
    sampleAnswer: "I don't think traditional education will be completely replaced, but it will certainly be transformed significantly. Online learning has proven its value, especially during recent global events, but there are irreplaceable aspects of traditional education.\n\nPhysical classrooms provide social learning experiences that are difficult to replicate online - the spontaneous discussions, group projects, and social skills development that come from daily interaction with peers. Young children especially benefit from structured in-person learning environments. However, online learning offers flexibility, accessibility, and often more personalized pacing that can be highly effective for certain students and subjects.\n\nI believe the future will be a hybrid model that combines the best of both. Universities might use online platforms for lectures and theoretical content while reserving in-person time for discussions, labs, and collaborative work. This blended approach could actually enhance education by leveraging the strengths of each method. The key is not to see them as competing alternatives but as complementary tools in education.",
    tips: [
      "Present a balanced argument",
      "Consider different educational levels",
      "Discuss practical implications",
      "Mention current trends",
      "Conclude with a thoughtful prediction"
    ],
    keywords: ["hybrid", "flexibility", "social learning", "accessibility", "transformation"]
  },
  {
    id: 53,
    part: 3,
    topic: "Environment",
    question: "What role should governments play in protecting the environment?",
    sampleAnswer: "Governments have a crucial role to play in environmental protection because individual actions alone aren't sufficient to address large-scale environmental challenges like climate change and pollution.\n\nFirstly, governments should implement and enforce environmental regulations. This includes setting emission standards for industries, protecting natural habitats, and penalizing environmental violations. Without government oversight, companies might prioritize profits over environmental responsibility. Secondly, governments should invest in renewable energy infrastructure and research. The transition to sustainable energy sources requires massive investment that only governments can realistically provide.\n\nHowever, government action shouldn't come at the expense of economic development, especially in developing countries. There needs to be a balance - perhaps through incentives for green technologies rather than just punitive measures. Governments should also focus on education, helping citizens understand why environmental protection matters and how they can contribute.\n\nInternational cooperation is also essential since environmental issues don't respect borders. Governments should work together on global agreements and share technologies and resources. Ultimately, the government's role should be to create a framework where environmental protection and economic progress can coexist.",
    tips: [
      "Address the question directly",
      "Provide specific examples of government actions",
      "Acknowledge different perspectives",
      "Discuss both developed and developing countries",
      "Use formal, academic language"
    ],
    keywords: ["regulations", "renewable energy", "cooperation", "sustainable", "policies"]
  },
  {
    id: 54,
    part: 3,
    topic: "Society & Culture",
    question: "How have family structures changed in recent decades?",
    sampleAnswer: "Family structures have undergone significant transformations in recent decades due to various social and economic factors. Traditional extended families living together have become less common in many societies, particularly in urban areas, with nuclear families or even single-person households becoming more prevalent.\n\nSeveral factors have driven this change. Economic pressures and job opportunities often require people to move away from their hometowns, breaking up extended family units. Women's increased participation in the workforce has also changed family dynamics, with more egalitarian divisions of household responsibilities. Additionally, there's greater social acceptance of diverse family structures - single-parent families, blended families, and same-sex couples raising children are more common and accepted than before.\n\nThese changes have both advantages and disadvantages. On one hand, smaller family units can be more mobile and flexible, which suits modern economic demands. There's also potentially more individual freedom and equality within these structures. On the other hand, the loss of extended family support networks can lead to increased isolation and stress, particularly for parents raising children. Elderly care becomes more challenging when families are scattered.\n\nLooking forward, I think technology will play an interesting role - video calls and social media help maintain family connections despite physical distance. However, there might also be a trend toward intentional communities or co-housing arrangements as people seek to rebuild the support networks that extended families once provided.",
    tips: [
      "Show awareness of social changes",
      "Discuss causes and effects",
      "Consider multiple perspectives",
      "Use appropriate sociological terms",
      "Maintain a balanced, analytical tone"
    ],
    keywords: ["nuclear family", "extended family", "urbanization", "workforce", "social change"]
  },
  {
    id: 55,
    part: 3,
    topic: "Work & Career",
    question: "Is work-life balance becoming more or less important?",
    sampleAnswer: "I believe work-life balance is becoming increasingly important in people's minds, although achieving it remains challenging. There's growing awareness that constantly prioritizing work over personal life leads to burnout, health issues, and decreased overall life satisfaction.\n\nSeveral trends reflect this shift. Many companies, particularly in the tech sector, now offer flexible working hours and remote work options. There's more discussion about mental health in workplaces, and some countries have even implemented laws around employees' right to disconnect from work communications outside working hours. Younger generations entering the workforce seem to prioritize work-life balance more than previous generations did.\n\nHowever, the reality is complex. While awareness has increased, economic pressures often force people to work longer hours. The rise of the gig economy and remote work, while offering flexibility, can also blur boundaries between work and personal time. When your home is your office, it becomes harder to 'switch off' from work mentally.\n\nI think the key issue is not just the number of hours worked but the quality of both work and personal time. Some people find fulfillment in their work, so the traditional concept of work-life 'balance' might not apply. Perhaps we need to think more about work-life integration - finding ways to make both aspects of life meaningful and sustainable rather than treating them as competing demands.",
    tips: [
      "Show awareness of current trends",
      "Discuss the complexity of the issue",
      "Consider generational differences",
      "Balance ideals with practical realities",
      "Offer a nuanced conclusion"
    ],
    keywords: ["flexibility", "burnout", "remote work", "mental health", "integration"]
  }
];

/**
 * Get speaking questions by part
 */
export function getQuestionsByPart(part: 1 | 2 | 3): SpeakingQuestion[] {
  return speakingQuestions.filter(q => q.part === part);
}

/**
 * Get random question from a specific part
 */
export function getRandomQuestion(part: 1 | 2 | 3): SpeakingQuestion {
  const questions = getQuestionsByPart(part);
  return questions[Math.floor(Math.random() * questions.length)];
}

/**
 * Get question by ID
 */
export function getQuestionById(id: number): SpeakingQuestion | undefined {
  return speakingQuestions.find(q => q.id === id);
}
