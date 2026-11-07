---
name: write-web-lesson
description: Create or substantially revise an interactive curriculum-aligned web lesson in the GenAI Learner web app. Use for lesson authoring from a module and lesson slug; do not use for mobile lesson generation or a generic site change.
---

# Write a web lesson

Create a detailed, accurate web learning experience from the requested curriculum topic. Use the [lesson template](references/lesson-template.md) as a flexible starting point, not as prescribed prose or a fixed visual design. Invent fresh, topic-appropriate explanations, examples, questions, and interactions; do not copy the contents of existing lessons as a template.

## Ground the lesson

1. Read the repository's applicable instructions, `docs/plans/web-implementation-plan.md`, the current curriculum snapshot and module registry in `src/data/curriculum/`, and the relevant shared components and tests. Check actual code when plans and implementation differ. If no module or lesson can be identified unambiguously, ask for it rather than inventing a curriculum entry.
2. Locate the canonical lesson ID, outcome, misconception, prerequisites, and adjacent lessons. Use the topic and scope as the contract; do not copy mobile lesson pages or infer web readiness from mobile status. Use authoritative sources when needed to establish technical accuracy; distinguish verified facts from an illustrative assumption.
3. Plan the learning progression and a concrete, topic-appropriate interaction before coding. Explain the mechanism, not just terminology: introduce a mental model, use a consistent worked example, let the learner inspect or change something, connect the result to its implications and limits, then check understanding and summarize. Adapt the structure and depth to the subject.

## Build

- Follow the repository's current routing, metadata, and component contracts. At this version, web lessons live under `src/lessons/<module>/<lessonId>/`, use `meta.json`, are discovered by `scripts/lesson-registry.mjs`, and start as `webStatus: "draft"`. Do not edit generated routes or make mobile status determine web publication. Re-check these details in the repository before editing.
- Reuse the shared lesson frame, quiz, navigation, tokens, and established design patterns. The current `LessonFrame` has a hardcoded chapter label: generalize it to accept the correct curriculum context when the requested lesson needs a different module or chapter. Do not leave another lesson with a misleading label. Use lesson-specific CSS Modules and semantic tokens for new layout where suitable.
- Design visuals around the learning goal. Use an architecture diagram, comparison, simulation, or another form only when it clarifies the topic; choose vertical or horizontal flow for readability. In a multi-stage explanation, carry one coherent example through the steps, explicitly map each transformation, and explain the result. Prefer native web controls and code-based diagrams for interactive or precise content; create image assets only when useful.
- A simulation must respond meaningfully to the learner and clearly distinguish invented values, simplified rules, and hypothetical outcomes from real measurements or production behavior. Keep examples internally consistent and explain relevant limitations near the interaction. Do not imply a toy is a live model or a specific provider's implementation.
- Build the knowledge check around the lesson outcome or misconception. Include feedback specific to each wrong option, a clear correct explanation, and retry; vary the position of the correct answer. Checks are local and ungraded unless the user explicitly changes that contract. End with a visually distinct, concise takeaway.
- Use semantic controls, stable section IDs and matching ordered metadata, visible focus, labels, and restrained live announcements. Ensure keyboard operation. If a lab expands or changes layout, preserve its state; support focus management, Escape and return focus. Theme changes must not reset lab or quiz state.

## Verify and report

Add or update meaningful Playwright coverage for the lesson. Check 390, 768, and 1440px in light and dark themes; inspect the rendered lesson for readability, contrast, bounded overflow and correct section order. Exercise the actual interaction, quiz selection, wrong feedback, retry and theme persistence. If the lab has an expanded workspace, test state, keyboard focus, Escape and return focus. Verify the draft is excluded from production; run the repository's required format, build, web and production checks. Report manual screen-reader or browser checks only if performed, and identify any untested cases.

Summarize the curriculum alignment, what the interaction demonstrates, any important simulation assumptions, tests run and remaining limitations. Do not merge, publish, change `webStatus` to published, or deploy solely because a lesson was authored; follow the user's explicit instructions and the repository's publication workflow.
