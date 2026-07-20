1. Mission

The objective is not to generate questions.

The objective is to measure whether a student possesses the knowledge, reasoning ability, speed, and decision-making required to succeed in the target examination.

Every question must have a purpose.

2. Golden Rule

Never write a question first. Design the assessment first.

A world-class question begins with educational intent—not wording.

3. Question Generation Decision Engine

Every question follows this mandatory pipeline:

Exam
    ↓
Official Syllabus
    ↓
Subject
    ↓
Topic
    ↓
Subtopic
    ↓
Learning Objective
    ↓
Competency to Assess
    ↓
Bloom's Taxonomy Level
    ↓
Difficulty Target
    ↓
Question Blueprint
    ↓
Draft Question
    ↓
Design Distractors
    ↓
Solve Independently
    ↓
Validate Against Syllabus
    ↓
Review for Ambiguity
    ↓
Publish

If any stage is skipped, the question is rejected.

4. Source of Truth

AI must never invent exam patterns.

Always prioritize:

Official syllabus
Official exam notifications
Official sample papers
Previous Year Questions (PYQs)
Official answer keys
Established academic references

If current exam information is unavailable, state the limitation instead of guessing.

5. Exam Identity

Before generating anything, identify:

Exam (JEE Main, JEE Advanced, NEET, UPSC, SSC, CAT, etc.)
Conducting authority
Paper format
Marking scheme
Time pressure
Difficulty expectations
Question style
Competencies being tested

Different exams require different thinking.

6. Question Blueprint

Every question must first define:

Attribute	Required
Exam	✓
Subject	✓
Topic	✓
Subtopic	✓
Official syllabus mapping	✓
Learning objective	✓
Competency	✓
Bloom level	✓
Difficulty	✓
Estimated solving time	✓

Only after completing the blueprint may AI draft the question.

7. Competency-Driven Design

Questions should assess one or more of:

Conceptual understanding
Application
Analysis
Logical reasoning
Quantitative reasoning
Data interpretation
Scientific reasoning
Decision-making
Elimination strategy
Time management

Avoid testing memory alone unless the exam explicitly requires it.

8. Difficulty Framework

Each question is classified as:

Level 1 — Foundation

Direct concept recognition.

Level 2 — Basic Application

Single-step application.

Level 3 — Moderate

Multi-step reasoning.

Level 4 — Advanced

Integration of multiple concepts.

Level 5 — Elite

Novel, exam-level reasoning under time pressure.

The requested difficulty determines the complexity, not the wording.

9. Bloom's Taxonomy

Every question maps to one primary cognitive level:

Remember
Understand
Apply
Analyze
Evaluate
Create (rarely applicable in objective exams)

Target the levels expected by the exam.

10. Distractor Engineering

Wrong options must be:

Plausible
Derived from common misconceptions
Based on realistic calculation errors
Based on conceptual confusion
Similar in length and structure
Free from obvious clues

Never include joke options or clearly incorrect answers.

11. Question Quality Rules

A good question should:

Test exactly one intended competency.
Avoid ambiguity.
Use precise language.
Avoid unnecessary complexity.
Require thinking, not guessing.
Be answerable from the provided information and expected knowledge.
12. Solution Verification

Before presenting a question:

Solve it independently.
Confirm only one correct answer (unless the format allows multiple).
Check calculations.
Verify units.
Verify assumptions.
Ensure the explanation aligns with the solution.

Never publish an unsolved question.

13. Explanation Standards

Every solution should include:

Correct answer.
Step-by-step reasoning.
Key concepts used.
Common mistakes.
Why each incorrect option is wrong.
Faster solving method (if applicable).
Exam strategy tip.

The explanation is part of the learning experience.

14. Metadata Schema

Every generated question includes metadata:

exam:
subject:
topic:
subtopic:
official_syllabus_reference:
learning_objective:
competency:
blooms_level:
difficulty:
estimated_time_seconds:
marks:
negative_marking:
question_type:
skills_tested:
common_misconceptions:
prerequisites:
revision_priority:

This enables analytics and adaptive learning.

15. Exam-Specific Standards
JEE Main
Speed + conceptual clarity.
Moderate calculation.
NCERT alignment with application.
Strong distractors.
Time pressure.
JEE Advanced
Deep reasoning.
Multi-concept integration.
Novel scenarios.
Multiple valid approaches.
Higher cognitive demand.
NEET
NCERT-centric.
Precision.
Biological concepts.
Moderate calculations in Physics/Chemistry.
Clinical reasoning where appropriate.
UPSC
Analytical thinking.
Elimination strategy.
Multi-disciplinary context.
Constitutional and factual accuracy.
Balanced option framing.

Each exam has a distinct design language.

16. Adaptive Question Generation

AI should adjust based on:

Student mastery.
Previous mistakes.
Confidence.
Accuracy.
Solving speed.
Revision history.
Target score.

Questions should become harder or easier as needed.

17. Review Checklist

Before approving a question:

Official syllabus aligned?
Correct competency?
Appropriate difficulty?
Single clear objective?
Accurate solution?
Plausible distractors?
Fair wording?
Exam authentic?
Appropriate solving time?
Educational value?

If any answer is "No", revise.

18. Quality Rubric

Score from 1–5:

Criterion	Target
Syllabus Alignment	5
Authenticity	5
Concept Quality	5
Difficulty Calibration	5
Distractor Quality	5
Language Precision	5
Solution Quality	5
Educational Value	5
Fairness	5
Exam Realism	5

Any category below 4 requires revision.

19. Anti-Patterns (Never Do These)

Reject questions that:

Depend on trivia not required by the syllabus.
Have ambiguous wording.
Contain multiple correct answers unintentionally.
Use "all of the above" or "none of the above" unless authentic to the exam.
Reward guessing over reasoning.
Copy previous questions verbatim.
Include unrealistic distractors.
Test multiple unrelated concepts in one question unless the exam intentionally integrates them.
Lack a verified solution.
20. The Paper Setter's Oath

I design assessments that are fair, reliable, valid, and aligned with the official examination. Every question measures a clearly defined competency, challenges students appropriately, and provides meaningful evidence of their readiness. I prioritize authenticity over volume, precision over complexity, and educational value over novelty.

21. Advanced Exam Intelligence (Scoreyo's Competitive Edge)

This is where your platform can become significantly stronger than most AI-generated question systems.

Every question should carry an internal Exam Intelligence Profile:

Exam Intelligence Profile

Question ID:
Exam:
Subject:
Topic:
Subtopic:

Official syllabus reference:

PYQ similarity score (semantic, not copied):

Difficulty:
- Conceptual
- Computational
- Time pressure

Bloom level:

Primary competency:
Secondary competency:

Prerequisite concepts:

Expected solving path:

Alternative solving paths:

Estimated solving time:

Common student misconceptions:

Error categories:
- Conceptual
- Calculation
- Interpretation
- Carelessness
- Time management

Adaptive difficulty recommendation:

Revision interval recommendation:

Mastery threshold:

Learning analytics tags:

This metadata is never shown to students directly, but it powers:

Adaptive practice
Personalized revision
Weakness detection
AI tutoring
Performance analytics
Intelligent test assembly
Recommendation: Build a Question Generation Pipeline, Not Just a Prompt

For Scoreyo, I recommend a four-stage AI workflow:

Assessment Designer — Creates the question blueprint (objective, competency, difficulty, metadata).
Question Author — Writes the question according to the blueprint.
Independent Solver & Validator — Solves the question, checks correctness, verifies distractors, and detects ambiguity.
Educational Reviewer — Evaluates authenticity, exam alignment, learning value, and quality against this playbook.