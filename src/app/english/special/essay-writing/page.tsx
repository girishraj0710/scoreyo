"use client";

import WritingPracticeInterface, { WritingPrompt } from "@/components/writing-practice-interface";

const essayPrompts: WritingPrompt[] = [
  {
    id: "opinion-1",
    title: "Social Media Impact",
    category: "Opinion",
    prompt: `Write an essay giving your opinion on the following statement:

"Social media has done more harm than good to society."

Do you agree or disagree? Give reasons and examples to support your answer.

Write at least 250 words.`,
    wordCount: 250,
    timeLimit: 30,
    tips: [
      "Introduction: State your position clearly",
      "Body Paragraph 1: First main argument with examples",
      "Body Paragraph 2: Second main argument with examples",
      "Body Paragraph 3: Counter-argument (optional but strengthens essay)",
      "Conclusion: Summarize main points and restate position",
      "Use linking words (However, Moreover, Furthermore, In conclusion)",
    ],
    sampleAnswer: `In recent years, social media has become an integral part of modern life, but opinions differ on whether its impact has been primarily positive or negative. While I acknowledge that social media has some drawbacks, I believe its benefits outweigh the harms when used responsibly.

On the positive side, social media has revolutionized communication and connectivity. People can now stay in touch with friends and family across the globe instantly, share important life moments, and maintain relationships that would otherwise fade with distance. Moreover, social media platforms have democratized information sharing, allowing ordinary citizens to report news, share creative work, and build communities around shared interests without needing traditional gatekeepers like publishers or broadcasting companies.

Furthermore, social media has created enormous economic opportunities. Millions of people have built successful businesses through platforms like Instagram, YouTube, and LinkedIn. Small entrepreneurs can now reach global markets without expensive advertising campaigns, and creators can monetize their talents directly through engaged audiences.

However, I recognize the valid concerns about social media's negative effects, including cyberbullying, privacy issues, and the spread of misinformation. These problems are serious and require solutions through better regulation, digital literacy education, and responsible platform design.

In conclusion, while social media has undoubtedly created new challenges, its positive contributions to communication, information access, and economic opportunity make it a net benefit to society. The key is not to eliminate social media but to use it more mindfully and address its problems constructively.

(250 words)`,
  },
  {
    id: "discussion-1",
    title: "Working from Home",
    category: "Discussion",
    prompt: `Some people believe working from home is beneficial, while others think it has drawbacks.

Discuss both views and give your own opinion.

Write at least 250 words.`,
    wordCount: 250,
    timeLimit: 30,
    tips: [
      "Introduction: Present both sides of the debate",
      "Body Paragraph 1: Arguments for working from home",
      "Body Paragraph 2: Arguments against working from home",
      "Body Paragraph 3: Your balanced opinion",
      "Conclusion: Summarize and give final thoughts",
      "Be objective when presenting both sides",
    ],
    sampleAnswer: `The debate over working from home versus office work has intensified since the pandemic forced millions to adapt to remote work arrangements. This essay will examine both perspectives before presenting my own view.

Proponents of remote work highlight several advantages. First, eliminating commutes saves employees time and money while reducing traffic congestion and carbon emissions. A typical worker might save 2-3 hours daily just on travel. Second, working from home offers flexibility to balance professional and personal responsibilities, such as caring for children or elderly parents. Third, companies can reduce overhead costs on office space and utilities while accessing talent from anywhere in the world.

However, critics point out significant disadvantages. Working from home can lead to social isolation and mental health issues, as employees miss the casual interactions and sense of community that offices provide. Additionally, productivity may suffer due to home distractions, lack of proper workspace, or difficulty maintaining work-life boundaries when your bedroom is also your office. Furthermore, remote work can hinder collaboration, creativity, and mentorship opportunities that arise from spontaneous in-person interactions.

In my opinion, a hybrid approach offers the best solution. Employees should have flexibility to work from home 2-3 days weekly for focused individual work, while coming to the office for collaborative projects, team meetings, and social connection. This balanced model preserves the benefits of both arrangements while minimizing their respective drawbacks.

In conclusion, rather than viewing remote and office work as either-or choices, organizations should embrace flexible policies that allow employees to choose what works best for their roles and circumstances.

(270 words)`,
  },
  {
    id: "problem-solution-1",
    title: "Environmental Pollution",
    category: "Problem-Solution",
    prompt: `Environmental pollution is a serious problem in many cities worldwide.

What are the main causes of this problem, and what solutions can you suggest?

Write at least 250 words.`,
    wordCount: 250,
    timeLimit: 30,
    tips: [
      "Introduction: Present the problem and its importance",
      "Body Paragraph 1: Main causes (2-3 causes)",
      "Body Paragraph 2: Practical solutions (matching causes)",
      "Body Paragraph 3: Additional solutions or long-term strategies",
      "Conclusion: Emphasize urgency and hope",
      "Link solutions logically to causes mentioned",
    ],
    sampleAnswer: `Environmental pollution has become one of the most pressing challenges facing urban areas today, affecting air quality, water resources, and public health. This essay will examine the primary causes of this crisis and propose effective solutions.

The main causes of environmental pollution are industrial emissions, vehicle exhaust, and inadequate waste management. Factories release harmful chemicals and particulate matter into the atmosphere without proper filtration systems. The exponential growth of vehicles in cities produces dangerous levels of carbon monoxide and nitrogen oxides. Additionally, many cities lack effective waste disposal infrastructure, leading to contaminated soil and waterways when garbage is dumped improperly or plastic waste enters drainage systems.

To address industrial pollution, governments must enforce stricter environmental regulations and require companies to install modern emission-control technologies. Tax incentives could encourage businesses to adopt cleaner production methods. For vehicle emissions, cities should invest in public transportation systems and promote electric vehicles through subsidies and charging infrastructure. Implementing congestion pricing in city centers would discourage unnecessary car use.

Regarding waste management, municipalities need comprehensive recycling programs and public education campaigns about proper waste disposal. Banning single-use plastics and encouraging sustainable alternatives would significantly reduce environmental damage.

Furthermore, planting more trees in urban areas would improve air quality naturally, while green spaces provide multiple environmental and health benefits. Schools should integrate environmental education into curricula to build awareness from an early age.

In conclusion, while environmental pollution poses serious threats, implementing these solutions through coordinated efforts by governments, businesses, and citizens can create cleaner, healthier cities for future generations. The key is acting now before the damage becomes irreversible.

(270 words)`,
  },
  {
    id: "advantages-disadvantages-1",
    title: "Online Shopping",
    category: "Advantages-Disadvantages",
    prompt: `Online shopping has become increasingly popular in recent years.

What are the advantages and disadvantages of online shopping compared to traditional shopping?

Write at least 250 words.`,
    wordCount: 250,
    timeLimit: 30,
    tips: [
      "Introduction: Introduce online shopping trend",
      "Body Paragraph 1: Advantages (2-3 points with examples)",
      "Body Paragraph 2: Disadvantages (2-3 points with examples)",
      "Conclusion: Balanced view or prediction",
      "Be balanced - give equal weight to both sides",
      "Use clear examples to illustrate each point",
    ],
    sampleAnswer: `Online shopping has transformed consumer behavior dramatically over the past decade, offering an alternative to traditional brick-and-mortar retail. This essay will explore both the benefits and drawbacks of this shopping method.

The primary advantage of online shopping is convenience. Consumers can browse thousands of products from home at any time, without traveling to physical stores or dealing with crowds. This is particularly valuable for busy professionals, parents, or people living in remote areas with limited shopping options. Additionally, online platforms enable easy price comparison across multiple retailers, helping shoppers find the best deals. Many websites offer customer reviews and detailed product specifications that aid informed decision-making. Furthermore, online shopping often provides access to international products unavailable locally, expanding consumer choices significantly.

However, online shopping has notable disadvantages. The inability to physically examine products before purchase can lead to disappointment when items don't match expectations in terms of quality, size, or appearance. Return processes, while improving, remain cumbersome and time-consuming. Moreover, online shopping contributes to packaging waste and carbon emissions from delivery services. There are also security concerns regarding payment information and personal data privacy. Additionally, instant gratification is lost as customers must wait for delivery, and technical issues or website crashes can disrupt the shopping experience.

Another concern is the impact on local businesses and employment. As online retailers dominate, small physical stores struggle to compete, potentially leading to job losses and declining community shopping districts.

In conclusion, while online shopping offers undeniable convenience and choice, it comes with trade-offs in product experience and broader societal impacts. The future likely holds a hybrid model where both online and physical retail coexist, each serving different consumer needs.

(280 words)`,
  },
  {
    id: "argument-1",
    title: "University Education Value",
    category: "Argumentative",
    prompt: `Some people believe that a university degree is essential for career success, while others argue that practical experience is more valuable.

Discuss both views and give your own opinion with strong arguments.

Write at least 250 words.`,
    wordCount: 250,
    timeLimit: 30,
    tips: [
      "Introduction: Present the debate clearly",
      "Body Paragraph 1: Arguments for university education",
      "Body Paragraph 2: Arguments for practical experience",
      "Body Paragraph 3: Your position with strong reasoning",
      "Conclusion: Definitive stance with future outlook",
      "Use evidence and real-world examples",
    ],
    sampleAnswer: `The debate over whether university education or practical experience is more valuable for career success has intensified as tuition costs rise and alternative learning paths emerge. This essay will examine both perspectives before presenting my own position.

Advocates for university education argue that degrees provide structured, comprehensive knowledge that forms a strong theoretical foundation. Universities expose students to diverse subjects, critical thinking methodologies, and research skills that are difficult to acquire through work experience alone. Furthermore, many professions like medicine, law, and engineering require formal education and certification for legal and safety reasons. A degree also signals to employers that candidates possess discipline, commitment, and standardized knowledge.

Conversely, supporters of practical experience contend that real-world skills often matter more than academic credentials. Many successful entrepreneurs and professionals never completed university, yet built thriving careers through hands-on learning, networking, and adaptability. Work experience provides immediate applicability, industry connections, and income without student debt. In fast-changing fields like technology, practical skills often become outdated before degrees are completed.

In my view, the answer depends on career goals and individual circumstances. For professions requiring specialized knowledge and credentials, university education is indispensable. However, for entrepreneurship or creative fields, practical experience combined with self-directed learning might prove more valuable. Ideally, the best approach integrates both: pursuing education while gaining practical experience through internships, projects, and part-time work.

The future may see greater acceptance of alternative credentials like bootcamps and online certifications, but universities will remain relevant for their comprehensive education, research opportunities, and the critical thinking skills they develop. Success ultimately depends not on education versus experience, but on continuous learning and adaptation throughout one's career.

(280 words)`,
  },
];

export default function EssayWritingPage() {
  return (
    <WritingPracticeInterface
      title="Essay Writing Practice"
      description="Develop essay writing skills with structured prompts and guidance"
      prompts={essayPrompts}
      categories={["Opinion", "Discussion", "Problem-Solution", "Advantages-Disadvantages", "Argumentative"]}
      showCategories={true}
    />
  );
}
