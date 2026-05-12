/**
 * Configuration for English topics that require special practice interfaces
 * (not standard MCQ quizzes)
 */

export type SpecialTopicType = 'writing' | 'listening' | 'speaking' | 'pronunciation';

export interface SpecialTopic {
  topicId: string;
  type: SpecialTopicType;
  redirectPath: string;
  description: string;
  comingSoon?: boolean;
}

/**
 * Topics that should NOT use MCQ quiz interface
 */
export const specialTopics: SpecialTopic[] = [
  // Speaking topics - Voice recording required
  {
    topicId: 'ielts-speaking',
    type: 'speaking',
    redirectPath: '/english/foundation/ielts-speaking/practice',
    description: 'Voice-based speaking practice with Parts 1, 2, 3',
    comingSoon: false,
  },
  {
    topicId: 'pronunciation',
    type: 'pronunciation',
    redirectPath: '/english/special/pronunciation',
    description: 'Audio pronunciation with recording feature',
    comingSoon: true,
  },
  {
    topicId: 'pronunciation-basics',
    type: 'pronunciation',
    redirectPath: '/english/special/pronunciation',
    description: 'Basic pronunciation practice with audio',
    comingSoon: true,
  },
  {
    topicId: 'pronunciation-practice',
    type: 'pronunciation',
    redirectPath: '/english/special/pronunciation',
    description: 'Advanced pronunciation with v/w, th, r/l sounds',
    comingSoon: true,
  },
  {
    topicId: 'daily-conversations',
    type: 'speaking',
    redirectPath: '/english/special/conversations',
    description: 'Interactive dialogue practice with scenarios',
    comingSoon: true,
  },
  {
    topicId: 'presentations',
    type: 'speaking',
    redirectPath: '/english/special/presentations',
    description: 'Presentation script writing with recording',
    comingSoon: true,
  },

  // Listening topics - Audio playback required
  {
    topicId: 'ielts-listening',
    type: 'listening',
    redirectPath: '/english/special/ielts-listening',
    description: 'IELTS listening practice with audio',
    comingSoon: true,
  },
  {
    topicId: 'listening-skills',
    type: 'listening',
    redirectPath: '/english/special/listening',
    description: 'General listening comprehension with audio',
    comingSoon: true,
  },

  // Writing topics - Text composition interface required
  {
    topicId: 'ielts-writing',
    type: 'writing',
    redirectPath: '/english/special/ielts-writing',
    description: 'IELTS essay writing with Task 1 & 2',
    comingSoon: false,
  },
  {
    topicId: 'paragraph-writing',
    type: 'writing',
    redirectPath: '/english/special/paragraph-writing',
    description: 'Paragraph composition with structure guidance',
    comingSoon: false,
  },
  {
    topicId: 'essay-writing',
    type: 'writing',
    redirectPath: '/english/special/essay-writing',
    description: 'Essay writing with introduction, body, conclusion',
    comingSoon: false,
  },
  {
    topicId: 'essay-writing-basics',
    type: 'writing',
    redirectPath: '/english/special/essay-writing',
    description: 'Basic essay structure and composition',
    comingSoon: false,
  },
  {
    topicId: 'letter-writing',
    type: 'writing',
    redirectPath: '/english/special/letter-writing',
    description: 'Formal and informal letter writing',
    comingSoon: false,
  },
  {
    topicId: 'email-writing',
    type: 'writing',
    redirectPath: '/english/special/email-writing',
    description: 'Professional email composition',
    comingSoon: false,
  },
];

/**
 * Check if a topic requires special interface
 */
export function isSpecialTopic(topicId: string): boolean {
  return specialTopics.some(t => t.topicId === topicId);
}

/**
 * Get special topic configuration
 */
export function getSpecialTopic(topicId: string): SpecialTopic | undefined {
  return specialTopics.find(t => t.topicId === topicId);
}

/**
 * Get all special topics by type
 */
export function getSpecialTopicsByType(type: SpecialTopicType): SpecialTopic[] {
  return specialTopics.filter(t => t.type === type);
}
