Purpose

This document defines the mandatory design philosophy, UX principles, UI standards, review process, and quality gates that every screen, component, interaction, and workflow in Scoreyo must follow.

The objective is not to create beautiful screens.

The objective is to create interfaces that maximize student learning while minimizing cognitive load.

1. The Design Mission

Every interface must answer one question:

Does this interface help a student achieve their learning goal faster, with less confusion and more confidence?

A beautiful interface that slows learning is a failure.

A simple interface that improves learning is a success.

2. Design Philosophy

Scoreyo follows these principles:

Student First

Every design decision must improve the student's experience, not showcase visual creativity.

Clarity Before Beauty

Users should understand a screen within 3 seconds.

If they cannot, redesign it.

Simplicity Wins

Every button, card, icon, and piece of text must justify its existence.

If removing an element does not reduce usability, remove it.

Consistency Builds Trust

Identical interactions should behave identically across the application.

Consistency reduces cognitive effort.

Speed Feels Like Intelligence

Fast interfaces create confidence.

Design must support perceived and actual performance.

3. The UI Thinking Process

Claude must never start by placing components.

Instead, it follows this decision engine:

Understand User Goal
        ↓
Understand User Context
        ↓
Define Primary Action
        ↓
Define Secondary Actions
        ↓
Organize Information Hierarchy
        ↓
Choose Layout
        ↓
Choose Components
        ↓
Validate Accessibility
        ↓
Validate Mobile Experience
        ↓
Review and Simplify

If any step is skipped, redesign the screen.

4. UX Decision Framework

For every screen, answer:

Who is the user?

Examples:

Beginner student
Returning student
Teacher
Admin
What is their goal?

Examples:

Start today's study session
Practice Physics
Review mistakes
Analyze progress
What is the fastest path to success?

Reduce unnecessary choices.

Reduce unnecessary scrolling.

Reduce unnecessary clicks.

What information is essential?

Only show what helps the current task.

Everything else is secondary.

5. Information Hierarchy

Every screen must contain:

Primary Content

The reason the screen exists.

It should dominate visual attention.

Secondary Content

Supporting information.

Visible but not distracting.

Tertiary Content

Advanced settings.

Hidden until needed.

Never overwhelm first-time users.

6. Visual Hierarchy

Claude must use hierarchy intentionally:

Size indicates importance.
Weight indicates emphasis.
Position indicates priority.
Spacing indicates relationships.
Color indicates state, not decoration.

Avoid relying on color alone to communicate meaning.

7. Typography Rules

Typography is the primary design tool.

Requirements:

Use a clear typographic scale.
Limit font sizes to a small, consistent set.
Prefer generous line spacing.
Left-align long-form text.
Avoid center-aligned paragraphs.
Use font weight for emphasis instead of multiple colors.

Never use typography for decoration.

8. Spacing System

Adopt an 8-point spacing system.

Rules:

Consistent margins.
Predictable padding.
Even vertical rhythm.
White space is functional, not wasted.

Crowded interfaces increase cognitive load.

9. Color Principles

Color has purpose.

Use it to communicate:

Success
Warning
Error
Information
Focus
Progress

Never use color simply to make a screen "look attractive."

Maintain sufficient contrast for readability.

10. Component Design

Every component must satisfy:

Single responsibility.
Consistent styling.
Reusable API.
Responsive behavior.
Accessible interactions.
Predictable states.

Each component defines:

Default
Hover
Focus
Active
Disabled
Loading
Error
Success
11. Navigation Principles

Navigation should answer:

Where am I?
What can I do?
How do I go back?
What happens next?

Users should never feel lost.

12. Forms

Forms must:

Ask only necessary information.
Validate early.
Explain errors clearly.
Preserve entered data.
Support keyboard navigation.
Be optimized for mobile input.

Avoid generic error messages.

13. Feedback & System Status

The interface must always communicate state.

Examples:

Loading
Saving
Syncing
Success
Failure
Offline
Empty

Never leave users wondering whether something happened.

14. Mobile-First Design

Design for the smallest practical screen first.

Requirements:

Comfortable thumb reach.
Large touch targets.
Responsive layouts.
Minimal horizontal scrolling.
Readable typography.

Desktop layouts should enhance, not redefine, the experience.

15. Accessibility Standards

Accessibility is mandatory.

Support:

Keyboard navigation
Screen readers
High contrast
Color-independent cues
Focus indicators
Semantic structure

Design for all users.

16. Learning Experience Principles

Education interfaces differ from productivity tools.

Every learning screen should:

Highlight progress.
Reduce anxiety.
Encourage focus.
Reward completion.
Support active recall.
Make revision effortless.
Minimize distractions.

Learning is the primary interaction.

17. Micro-Interactions

Use motion sparingly.

Animations should:

Confirm actions.
Guide attention.
Explain transitions.
Improve perceived performance.

Avoid decorative animations that delay interaction.

18. Error Handling

Errors should:

Explain what happened.
Explain why.
Suggest recovery.
Preserve user work.

Never blame the user.

19. Empty States

Every empty state should:

Explain why it is empty.
Tell the user what to do next.
Encourage meaningful action.

Avoid blank screens.

20. AI Design Review Checklist

Before presenting any UI, Claude must review:

User Understanding
Can a new user identify the screen's purpose within three seconds?
Is the primary action obvious?
Simplicity
Can any element be removed without reducing value?
Is the number of choices appropriate?
Consistency
Do components match the design system?
Are interactions predictable?
Accessibility
Keyboard support
Contrast
Focus states
Screen reader compatibility
Responsiveness
Mobile
Tablet
Desktop
Educational Value
Does the layout reduce cognitive load?
Does it support learning rather than distract?
21. UI Quality Rubric

Every screen receives a score from 1–5:

Criterion	Target
Clarity	5
Simplicity	5
Visual Hierarchy	5
Accessibility	5
Consistency	5
Responsiveness	5
Educational Effectiveness	5
Interaction Quality	5
Performance Perception	5
Delight Without Distraction	5

Any category scoring below 4 requires redesign.

22. Anti-Patterns (Never Do These)

Claude must avoid:

Dashboard clutter.
Multiple competing primary actions.
Walls of text.
Inconsistent spacing.
Decorative gradients without purpose.
Low-contrast text.
Hidden critical actions.
Long forms without progress indicators.
Unlabeled icons.
Excessive animations.
Generic admin-template layouts.
Card overload.
Infinite scrolling for educational content without navigation aids.
Pop-ups that interrupt study flow.
23. Final Design Oath

Every interface I create must reduce cognitive load, increase student confidence, support learning, and maintain visual consistency. I will prioritize clarity over decoration, usability over novelty, accessibility over convenience, and long-term maintainability over short-term aesthetics. Every screen should feel intentional, predictable, and worthy of a student who is trusting Scoreyo with their future.

One recommendation that will elevate this from "good" to "world-class"

Don't stop at a UI/UX Bible. Build a complete Design System alongside it, including:

Design Tokens — colors, spacing, typography, radius, shadows, motion.
Component Specifications — buttons, cards, inputs, tabs, navigation, dialogs, tables, charts, etc., with usage rules.
Screen Templates — dashboards, question screens, test-taking, analytics, revision, onboarding, profile, payment, and admin.
Interaction Patterns — loading, errors, success states, empty states, offline behavior, gestures, keyboard shortcuts.
Educational UX Patterns — optimized layouts for studying, taking exams, reviewing mistakes, flashcards, adaptive practice, and progress tracking.