/**
 * Complete Premium 3D Illustrated Topic Icons Library
 *
 * Maps all 52 current English learning topics (Foundation 32, Advanced 14,
 * IELTS/TOEFL 4, Real-world 2) to a genuinely unique icon each.
 *
 * Rule: NO icon is reused across more than one topic ID.
 *
 * Rebuilt: July 2, 2026
 */

import React from 'react';

interface IconProps {
  className?: string;
}

// ===== 16 pre-existing unique icons (still relevant to current topic IDs) =====

import {
  AlphabetBlocksIcon,
  PartsOfSpeechIcon,
  NounsIcon,
  PronounsIcon,
  AdjectivesIcon,
  QuestionMarkIcon,
  ClockIcon,
  ModalVerbsIcon,
} from './PremiumTopicIcons';

import {
  PassiveVoiceIcon,
  GerundsInfinitivesIcon,
  ConditionalsIcon,
  RelativeClausesIcon,
} from './NewPremiumIcons';

import { AcademicVocabularyIcon } from './AcademicVocabularyIcon';
import { EssayWritingIcon } from './EssayWritingIcon';
import { PresentationsIcon } from './PresentationsIcon';
import { DebateIcon } from './DebateIcon';

// ===== 36 newly generated unique icons =====

import { PrepositionsMasteryIcon } from './PrepositionsMasteryIcon';
import { BasicVerbsSentencesIcon } from './BasicVerbsSentencesIcon';
import { ConjunctionsConnectorsIcon } from './ConjunctionsConnectorsIcon';
import { WordFormationIcon } from './WordFormationIcon';
import { PhrasalVerbsIcon } from './PhrasalVerbsIcon';
import { IdiomsExpressionsIcon } from './IdiomsExpressionsIcon';
import { PastTensesIcon } from './PastTensesIcon';
import { FutureTensesIcon } from './FutureTensesIcon';
import { PresentPerfectIcon } from './PresentPerfectIcon';
import { PastPerfectIcon } from './PastPerfectIcon';
import { PastHabitsIcon } from './PastHabitsIcon';
import { ReportedSpeechIcon } from './ReportedSpeechIcon';
import { EssentialVocabularyIcon } from './EssentialVocabularyIcon';
import { SpeakingEssentialsIcon } from './SpeakingEssentialsIcon';
import { WritingFundamentalsIcon } from './WritingFundamentalsIcon';
import { ListeningComprehensionIcon } from './ListeningComprehensionIcon';
import { ReadingStrategiesIcon } from './ReadingStrategiesIcon';
import { SentenceTypesPunctuationIcon } from './SentenceTypesPunctuationIcon';
import { CommonMistakesIcon } from './CommonMistakesIcon';
import { PracticalScenariosIcon } from './PracticalScenariosIcon';
import { AdvancedTenseCombinationsIcon } from './AdvancedTenseCombinationsIcon';
import { ThirdMixedConditionalsIcon } from './ThirdMixedConditionalsIcon';
import { ConditionalInversionIcon } from './ConditionalInversionIcon';
import { SubjunctiveMoodIcon } from './SubjunctiveMoodIcon';
import { ScissorsRibbonIcon } from './ScissorsRibbonIcon';
import { ClockKeyringIcon } from './ClockKeyringIcon';
import { ConveyorArmIcon } from './ConveyorArmIcon';
import { PuzzleCollocationIcon } from './PuzzleCollocationIcon';
import { ScrollOwlIcon } from './ScrollOwlIcon';
import { BriefcaseReportIcon } from './BriefcaseReportIcon';
import { IeltsToeflReadingIcon } from './IeltsToeflReadingIcon';
import { IeltsToeflWritingIcon } from './IeltsToeflWritingIcon';
import { IeltsToeflListeningIcon } from './IeltsToeflListeningIcon';
import { IeltsToeflSpeakingIcon } from './IeltsToeflSpeakingIcon';
import { WorkplaceCommunicationIcon } from './WorkplaceCommunicationIcon';
import { SocialTravelEnglishIcon } from './SocialTravelEnglishIcon';

// Fallback icon for any topic ID not found in the map below
import { Book3DIcon } from './Illustrated3DIcons';

/**
 * Complete Icon Mapping — 52 current topics, each with a unique icon.
 *
 * Foundation (32): building-blocks, sentence-essentials, core-tenses,
 *   modals-voice, complex-grammar, vocabulary-building, communication-skills, refinement
 * Advanced (14): advanced-tenses-conditionals, advanced-modals-voice,
 *   advanced-vocabulary, advanced-communication
 * IELTS/TOEFL (4) + Real-world (2)
 */
export const AllPremiumTopicIcons: Record<string, React.FC<IconProps>> = {
  // ===== FOUNDATION: Module 1 — Building Blocks =====
  'alphabet-pronunciation': AlphabetBlocksIcon,
  'parts-of-speech': PartsOfSpeechIcon,
  'nouns-articles': NounsIcon,
  'pronouns-determiners': PronounsIcon,
  'adjectives-adverbs': AdjectivesIcon,

  // ===== FOUNDATION: Module 2 — Sentence Essentials =====
  'prepositions-mastery': PrepositionsMasteryIcon,
  'basic-verbs-sentences': BasicVerbsSentencesIcon,
  'question-formation': QuestionMarkIcon,
  'conjunctions-connectors': ConjunctionsConnectorsIcon,

  // ===== FOUNDATION: Module 3 — Core Tenses =====
  'present-tenses': ClockIcon,
  'past-tenses': PastTensesIcon,
  'future-tenses': FutureTensesIcon,
  'present-perfect': PresentPerfectIcon,
  'past-perfect': PastPerfectIcon,

  // ===== FOUNDATION: Module 4 — Modals & Voice =====
  'modal-verbs': ModalVerbsIcon,
  'passive-voice': PassiveVoiceIcon,
  'past-habits': PastHabitsIcon,

  // ===== FOUNDATION: Module 5 — Complex Grammar =====
  'conditionals': ConditionalsIcon,
  'reported-speech': ReportedSpeechIcon,
  'relative-clauses': RelativeClausesIcon,
  'gerunds-infinitives': GerundsInfinitivesIcon,

  // ===== FOUNDATION: Module 6 — Vocabulary =====
  'essential-vocabulary': EssentialVocabularyIcon,
  'word-formation': WordFormationIcon,
  'phrasal-verbs': PhrasalVerbsIcon,
  'idioms-expressions': IdiomsExpressionsIcon,

  // ===== FOUNDATION: Module 7 — Communication Skills =====
  'speaking-essentials': SpeakingEssentialsIcon,
  'writing-fundamentals': WritingFundamentalsIcon,
  'listening-comprehension': ListeningComprehensionIcon,
  'reading-strategies': ReadingStrategiesIcon,

  // ===== FOUNDATION: Module 8 — Refinement =====
  'sentence-types-punctuation': SentenceTypesPunctuationIcon,
  'common-mistakes': CommonMistakesIcon,
  'practical-scenarios': PracticalScenariosIcon,

  // ===== ADVANCED: Module 1 — Advanced Tenses & Conditionals =====
  'advanced-tense-combinations': AdvancedTenseCombinationsIcon,
  'third-mixed-conditionals': ThirdMixedConditionalsIcon,
  'conditional-inversion': ConditionalInversionIcon,
  'reduced-relative-clauses': ScissorsRibbonIcon,
  'subjunctive-mood': SubjunctiveMoodIcon,

  // ===== ADVANCED: Module 2 — Advanced Modals & Voice =====
  'past-modals-nuances': ClockKeyringIcon,
  'advanced-passive-structures': ConveyorArmIcon,

  // ===== ADVANCED: Module 3 — Advanced Vocabulary =====
  'academic-vocabulary': AcademicVocabularyIcon,
  'collocations-register': PuzzleCollocationIcon,
  'idioms-proverbs': ScrollOwlIcon,

  // ===== ADVANCED: Module 4 — Advanced Communication =====
  'essay-writing': EssayWritingIcon,
  'report-business-writing': BriefcaseReportIcon,
  'professional-presentations': PresentationsIcon,
  'debates-formal-discussion': DebateIcon,

  // ===== IELTS/TOEFL PATH =====
  'ielts-toefl-reading': IeltsToeflReadingIcon,
  'ielts-toefl-writing': IeltsToeflWritingIcon,
  'ielts-toefl-listening': IeltsToeflListeningIcon,
  'ielts-toefl-speaking': IeltsToeflSpeakingIcon,

  // ===== REAL-WORLD PATH =====
  'workplace-communication': WorkplaceCommunicationIcon,
  'social-travel-english': SocialTravelEnglishIcon,
};

// Default export for easy import
export default AllPremiumTopicIcons;

// Helper function to get icon component by topic ID
export const getTopicIcon = (topicId: string): React.FC<IconProps> => {
  return AllPremiumTopicIcons[topicId] || Book3DIcon; // Fallback to Book3DIcon
};

// Export icon count for verification
export const TOTAL_ICONS_MAPPED = Object.keys(AllPremiumTopicIcons).length;
