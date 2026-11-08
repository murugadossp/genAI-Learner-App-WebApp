---
name: write-web-lesson
description: Create or substantially revise an interactive curriculum-aligned web lesson in the GenAI Learner web app. Use for lesson authoring from a module and lesson slug; do not use for mobile lesson generation or a generic site change.
---

# Write a web lesson

Create a detailed, accurate web learning experience from the requested curriculum topic. Use the [lesson template](references/lesson-template.md) as a flexible starting point, not as prescribed prose or a fixed visual design. Invent fresh, topic-appropriate explanations, examples, questions, and interactions; do not copy the contents of existing lessons as a template.

## Set up an isolated workspace

Every lesson gets its own git worktree, branch and draft PR, so lessons can be built in parallel without touching each other or `main`. Do this before editing anything:

1. Confirm the module and lesson ID (see below), then `git fetch origin main`.
2. From the main checkout run `git worktree add ../genai-learner-<lessonId> -b lessons/<lessonId> origin/main`. If the branch or worktree already exists, reuse it after checking it is clean; do not overwrite someone else's work.
3. Work only inside that worktree. Run `npm ci` there, since each worktree needs its own `node_modules`.

## Ground the lesson

1. Read `AGENTS.md` (commands, layout, conventions, boundaries), `docs/plans/web-implementation-plan.md`, the current curriculum snapshot and module registry in `src/data/curriculum/`, and the relevant shared components and tests. Check actual code when plans and implementation differ. If no module or lesson can be identified unambiguously, offer a pick list of the next missing curriculum lessons (or ask for it) rather than inventing a curriculum entry.
2. Locate the canonical lesson ID, outcome, misconception, prerequisites, and adjacent lessons. Use the topic and scope as the contract; do not copy mobile lesson pages or infer web readiness from mobile status. Use authoritative sources when needed to establish technical accuracy; distinguish verified facts from an illustrative assumption.
3. Plan the learning progression and a concrete, topic-appropriate interaction before coding. Explain the mechanism, not just terminology: introduce a mental model, use a consistent worked example, let the learner inspect or change something, connect the result to its implications and limits, then check understanding and summarize. Adapt the structure and depth to the subject.

## Build

- Follow the repository's current routing, metadata, and component contracts. At this version, web lessons live under `src/lessons/<module>/<lessonId>/`, use `meta.json`, are discovered by `scripts/lesson-registry.mjs`, and start as `webStatus: "draft"`. Do not edit generated routes or make mobile status determine web publication. Re-check these details in the repository before editing.
- Use `next/link` for internal links. Reuse the shared lesson frame, quiz, navigation, tokens, and established design patterns. The current `LessonFrame` has a hardcoded chapter label and `/course` links, and `src/studio/Course.tsx` is fixed to chapter 2 and `genai-basics`: generalize them with defaults when the requested lesson needs a different module or chapter, so existing lessons and tests render unchanged. Do not leave another lesson with a misleading label. Use lesson-specific CSS Modules and semantic tokens for new layout where suitable.
- Design visuals around the learning goal. Use an architecture diagram, comparison, simulation, or another form only when it clarifies the topic; choose vertical or horizontal flow for readability. In a multi-stage explanation, carry one coherent example through the steps, explicitly map each transformation, and explain the result. Prefer native web controls and code-based diagrams for interactive or precise content; create image assets only when useful.
- A simulation must respond meaningfully to the learner and clearly distinguish invented values, simplified rules, and hypothetical outcomes from real measurements or production behavior. Keep examples internally consistent and explain relevant limitations near the interaction. Do not imply a toy is a live model or a specific provider's implementation.
- Build the knowledge check around the lesson outcome or misconception. Include feedback specific to each wrong option, a clear correct explanation, and retry; vary the position of the correct answer. Checks are local and ungraded unless the user explicitly changes that contract. End with a visually distinct, concise takeaway.
- Use semantic controls, stable section IDs and matching ordered metadata, visible focus, labels, and restrained live announcements. Ensure keyboard operation. If a lab expands or changes layout, preserve its state; support focus management, Escape and return focus. Theme changes must not reset lab or quiz state.

## Verify and report

Add or update meaningful Playwright coverage for the lesson. Check 390, 768, and 1440px in light and dark themes; inspect the rendered lesson for readability, contrast, bounded overflow and correct section order. Exercise the actual interaction, quiz selection, wrong feedback, retry and theme persistence. If the lab has an expanded workspace, test state, keyboard focus, Escape and return focus. Verify the draft is excluded from production; run the checks listed in `AGENTS.md` (`format:check`, `typecheck`, `npm test`). Report manual screen-reader or browser checks only if performed, and identify any untested cases.

## Report

Write the report with [the report template](references/report-template.md): fill every section with real evidence (commands run and their results, the viewport and theme matrix, a fidelity log of verified versus invented values, decisions and deviations, what was not tested, and publication readiness). Save it to `docs/lesson-reports/<module>/<lessonId>.md` and mark anything not performed as "not tested".

## Deliver

1. Commit the lesson, its tests and the report on `lessons/<lessonId>`. Keep the lesson `webStatus: "draft"`.
2. Push the branch and open a **draft** PR against `main` titled `Draft lesson: <lessonId> <title>`, using the report as the PR description (`gh pr create --draft --base main --body-file docs/lesson-reports/<module>/<lessonId>.md`). If `gh` or push access is unavailable, say so and give the branch name and the exact commands instead.
3. Wait for CI and report its result. Fix failures caused by the lesson, such as formatting.
4. Give the user a short summary with the PR link and the worktree path, then stop and ask what to do next.

Never merge, mark the PR ready, publish (`webStatus: "published"`), or deploy unless the user explicitly asks. Remove the worktree only after the PR is merged or closed and the user agrees (`git worktree remove ../genai-learner-<lessonId>`).
