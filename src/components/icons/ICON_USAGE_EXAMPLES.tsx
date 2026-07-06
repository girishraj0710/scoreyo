/**
 * Usage Examples for Premium 3D Topic Icons
 * Created: July 1, 2026
 *
 * Import and use the new premium 3D icons in your components
 */

import {
  QuestionMarkIcon,
  ImperativeMoodIcon,
  ClockIcon,
  ModalVerbsIcon,
} from './PremiumTopicIcons';

// ===== EXAMPLE 1: Basic Usage =====
export function BasicIconExample() {
  return (
    <div className="flex gap-4 p-8 bg-slate-100 dark:bg-slate-900 rounded-lg">
      <QuestionMarkIcon className="w-16 h-16" />
      <ImperativeMoodIcon className="w-16 h-16" />
      <ClockIcon className="w-16 h-16" />
      <ModalVerbsIcon className="w-16 h-16" />
    </div>
  );
}

// ===== EXAMPLE 2: Topic Card with Icon =====
export function TopicCardExample() {
  return (
    <div className="group p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <ImperativeMoodIcon className="w-12 h-12 flex-shrink-0" />

        {/* Content */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Imperative Mood
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Learn how to give commands and instructions effectively
          </p>
        </div>
      </div>
    </div>
  );
}

// ===== EXAMPLE 3: Question Type Indicator =====
export function QuestionTypeExample() {
  return (
    <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
      <QuestionMarkIcon className="w-10 h-10" />
      <div>
        <p className="text-sm font-medium text-purple-900 dark:text-purple-200">
          Question Formation
        </p>
        <p className="text-xs text-purple-700 dark:text-purple-300">
          10 practice questions
        </p>
      </div>
    </div>
  );
}

// ===== EXAMPLE 4: Tense Timeline =====
export function TenseTimelineExample() {
  return (
    <div className="flex items-center justify-between p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl">
      {/* Past */}
      <div className="text-center">
        <ClockIcon className="w-12 h-12 mx-auto mb-2" />
        <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">Past</p>
      </div>

      {/* Present */}
      <div className="text-center">
        <ClockIcon className="w-14 h-14 mx-auto mb-2" />
        <p className="text-base font-bold text-blue-900 dark:text-blue-200">Present</p>
      </div>

      {/* Future */}
      <div className="text-center">
        <ClockIcon className="w-12 h-12 mx-auto mb-2" />
        <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">Future</p>
      </div>
    </div>
  );
}

// ===== EXAMPLE 5: Modal Verbs Feature Card =====
export function ModalVerbsFeatureExample() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-2xl p-6">
      {/* Icon */}
      <div className="absolute top-4 right-4">
        <ModalVerbsIcon className="w-20 h-20 opacity-30" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-amber-900 dark:text-amber-200 mb-2">
          Modal Verbs
        </h3>
        <p className="text-amber-800 dark:text-amber-300 mb-4">
          Master can, could, may, might, must, should, will, would
        </p>
        <button className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors">
          Start Learning
        </button>
      </div>
    </div>
  );
}

// ===== EXAMPLE 6: Responsive Grid =====
export function IconGridExample() {
  const topics = [
    { icon: QuestionMarkIcon, name: 'Question Formation', color: 'purple' },
    { icon: ImperativeMoodIcon, name: 'Imperative Mood', color: 'red' },
    { icon: ClockIcon, name: 'Verb Tenses', color: 'blue' },
    { icon: ModalVerbsIcon, name: 'Modal Verbs', color: 'amber' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8">
      {topics.map((topic) => (
        <div
          key={topic.name}
          className="flex flex-col items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <topic.icon className="w-16 h-16" />
          <p className="text-sm font-medium text-center text-slate-900 dark:text-white">
            {topic.name}
          </p>
        </div>
      ))}
    </div>
  );
}

// ===== EXAMPLE 7: With Hover Effects =====
export function HoverEffectExample() {
  return (
    <div className="group relative p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer overflow-hidden">
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Content */}
      <div className="relative z-10 flex items-center gap-6">
        <div className="transform group-hover:scale-110 group-hover:rotate-3 transition-transform">
          <QuestionMarkIcon className="w-20 h-20" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Interactive Questions
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Hover to see the animation effect
          </p>
        </div>
      </div>
    </div>
  );
}

// ===== EXAMPLE 8: Different Sizes =====
export function SizeVariationsExample() {
  return (
    <div className="flex items-end gap-6 p-8 bg-slate-100 dark:bg-slate-900 rounded-lg">
      <div className="text-center">
        <ClockIcon className="w-8 h-8 mx-auto mb-2" />
        <p className="text-xs text-slate-600 dark:text-slate-400">Small</p>
      </div>
      <div className="text-center">
        <ClockIcon className="w-12 h-12 mx-auto mb-2" />
        <p className="text-xs text-slate-600 dark:text-slate-400">Medium</p>
      </div>
      <div className="text-center">
        <ClockIcon className="w-16 h-16 mx-auto mb-2" />
        <p className="text-xs text-slate-600 dark:text-slate-400">Large</p>
      </div>
      <div className="text-center">
        <ClockIcon className="w-24 h-24 mx-auto mb-2" />
        <p className="text-xs text-slate-600 dark:text-slate-400">X-Large</p>
      </div>
    </div>
  );
}
