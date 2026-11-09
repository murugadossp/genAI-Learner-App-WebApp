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
4. Choose the running example for the easiest reader. Prefer one that needs no side skill (no arithmetic unless maths is the topic). Write down every constraint the example depends on and check that the answer is unique and that every wrong answer you show really is wrong. Re-check this whenever the wording changes.
5. When the lesson teaches categories or nested ideas, pick one criterion for the categories and use it everywhere (intro, each section, practice items, quiz, takeaway). Lead each category with a representative example, not the trivial edge case, because a trivial example misleads about what the category is. Mark borderline examples as borderline. Avoid absolute definitions ("X is always Y"); say what is typical and note the simplification.
6. Plan what the lesson will not be able to prove. If a claim cannot be checked against a primary source (a page may refuse automated fetches), write it as a hedged tendency in the lesson and record it in the report as unverified and needing subject-matter review. Do not log it as a verified fact.
7. Before writing, run the plan review described in Review gates.

## Build

- Follow the repository's current routing, metadata, and component contracts. At this version, web lessons live under `src/lessons/<module>/<lessonId>/`, use `meta.json`, are discovered by `scripts/lesson-registry.mjs`, and start as `webStatus: "draft"`. Do not edit generated routes or make mobile status determine web publication. Re-check these details in the repository before editing.
- Use `next/link` for internal links. Reuse the shared lesson frame, quiz, navigation, tokens, and established design patterns. Pass the lesson's own chapter context to the shared frame (its `chapter` prop) instead of relying on defaults, so no lesson shows another chapter's label. Use lesson-specific CSS Modules and semantic tokens for new layout where suitable.
- Design visuals around the learning goal. Use an architecture diagram, comparison, simulation, or another form only when it clarifies the topic; choose vertical or horizontal flow for readability. In a multi-stage explanation, carry one coherent example through the steps, explicitly map each transformation, and explain the result. Prefer native web controls and code-based diagrams for interactive or precise content; create image assets only when useful.
- Prefer one short section per concept, each with the same small diagram (so learners can relate the concepts), then a simple practice activity. A single explorer with several controls that change at once is hard to correlate and hard to use on a phone. Open with a short roadmap that names every term in order, and do not use a term in an interaction before it has been explained.
- Write for a phone. Keep paragraphs to one or two sentences, use a list for steps or rules, and keep "in the running example" boxes to about three lines. When you shorten text, re-run the accuracy review: shortening twice dropped a qualifier that made the claim wrong.
- Explain before the learner interacts. Put a short worked example, with a plain analogy first and the technical wording second, ahead of any lab, and give the lab a numbered "try it in this order" list. Use short sentences. Qualify what an analogy implies so it does not overstate reliability or capability.
- When you generate an explainer image (for example with Codex), save it next to the lesson, confirm the file exists (the tool may write to the worktree root), view it, and keep its text identical to the lesson's wording. Regenerate it and update the alt text and surrounding prose together whenever either changes. Image text is small on phones, so keep it short. Put the exact label text in the prompt and ask for no other text, read every image for spelling, run the tool from the worktree root and move the files, and convert to JPEG about 1200px wide (for example `sips -s format jpeg -s formatOptions 85 -Z 1200` on macOS, or ImageMagick elsewhere) so each file is a few hundred KB at most. Repeat the labels in the alt text. Text inside an image cannot be edited, so keep the lesson prose as the source of truth.
- Lessons must not need chapter-specific code. Do not add per-chapter components, routes, or tests in a lesson PR. If the lesson belongs to a chapter whose course page or label does not exist yet, leave that part out, say so in the report, and propose a separate change that builds chapter pages from the curriculum data rather than copying an earlier chapter's files.
- Practice items and checks must be answerable from what they state: if the answer depends on a fact (such as how a model is built), put that fact in the prompt. Give each option a one-line plain description. Put the explanation in the live region as well as on screen, and link the feedback to its question with `aria-describedby`.
- A simulation must respond meaningfully to the learner and clearly distinguish invented values, simplified rules, and hypothetical outcomes from real measurements or production behavior. Keep examples internally consistent and explain relevant limitations near the interaction. Do not imply a toy is a live model or a specific provider's implementation.
- Build the knowledge check around the lesson outcome or misconception. Include feedback specific to each wrong option, a clear correct explanation, and retry; vary the position of the correct answer. Checks are local and ungraded unless the user explicitly changes that contract. End with a visually distinct, concise takeaway.
- Use semantic controls, stable section IDs and matching ordered metadata, visible focus, labels, and restrained live announcements. Ensure keyboard operation. If a lab expands or changes layout, preserve its state; support focus management, Escape and return focus. Theme changes must not reset lab or quiz state.

## Verify and report

Add or update meaningful Playwright coverage for the lesson. Check 390, 768, and 1440px in light and dark themes; inspect the rendered lesson for readability, contrast, bounded overflow and correct section order. Exercise the actual interaction, quiz selection, wrong feedback, retry and theme persistence. If the lab has an expanded workspace, test state, keyboard focus, Escape and return focus. Verify production matches `webStatus` (a draft returns 404; a published lesson, including a revision of one, returns 200 with its status unchanged); run the checks listed in `AGENTS.md` (`format:check`, `typecheck`, `npm test`). Playwright runs against a production build, so rebuild (`npm test` does) before trusting a failing or passing result after an edit. Report manual screen-reader or browser checks only if performed, and identify any untested cases.

## Review gates

Use independent, read-only reviewers at three points. Each gate has its own job, so do not repeat the same check at every gate.

1. **Plan review, before writing.** Give Codex (or another independent reviewer) the plan: outline, running example with its constraints and unique answer, the criterion for any categories, the planned interaction and quiz, and the list of claims that cannot be verified. Ask for factual, teaching and scope problems. One or two rounds.
2. **Content review, after the lesson passes its checks.** The same reviewer reads the written lesson, quiz and feedback text, alt text and any shortened passages for accuracy, clarity for a beginner, and consistency with the plan. Up to four rounds; stop after two clean rounds in a row.
3. **Final review.** Run `/review-web-lesson` (read-only, on the exact PR head) for conformance, accessibility, responsive layout, tests, and whether the report matches the evidence.

Rules for every gate:

- A round is clean when it has no validated finding of P2 or higher.
- Validate each finding before acting. Fix the real ones and give a reason for any you reject. Do not "fix" a claim you cannot verify: mark it unverified for a human reviewer.
- If Codex is unavailable, use a second independent reviewer (a separate session or agent) and say so in the report.
- Tell the reviewer what earlier rounds already fixed. A Codex review can take over ten minutes: run it in the background and do not start a second copy.
- Record every round (gate, reviewer, findings, action or rejection reason) in the report's review log.
- `/review-web-lesson` posts nothing to GitHub unless the user asks.

## Tooling notes

- Open the dev server through `localhost`, not `127.0.0.1` (Next 16 blocks dev scripts from `127.0.0.1`, so pages load but nothing is interactive).
- `npm run build` and `npm test` overwrite the `.next` folder a running dev server uses, so stop it first, then `rm -rf .next` and restart.
- Free ports 3100 (Playwright) and the dev port if a run was interrupted.
- Run `npx prettier --write` only on the files you changed, since it can reformat unrelated files, and `format:check` does not cover CSS or the report.
- Treat a user comment such as "this is confusing" as a design problem and restructure the section, not only reword it.

## Report

Write the report with [the report template](references/report-template.md): fill every section with real evidence (commands run and their results, the viewport and theme matrix, a fidelity log of verified versus invented values, decisions and deviations, what was not tested, and publication readiness). Save it to `docs/lesson-reports/<module>/<lessonId>.md` and mark anything not performed as "not tested".

## Deliver

Follow the user's instructions for commit and PR attribution lines (trailers, generated-by notes) and add none the user has not asked for or the tool does not require. Do not start long-running servers from a one-shot shell command: they stop when the command ends, so use a background task or ask the user to run them, and stop only the process you started.

1. Commit the lesson, its tests and the report on `lessons/<lessonId>`. A new lesson is `webStatus: "draft"`. When revising a lesson that already exists, leave its `webStatus` exactly as it is (a published lesson must stay published, or its production route will 404) unless the user explicitly asks to change it.
2. Push the branch and open a **draft** PR against `main` titled `Draft lesson: <lessonId> <title>`, using the report as the PR description (`gh pr create --draft --base main --body-file docs/lesson-reports/<module>/<lessonId>.md`). If `gh` or push access is unavailable, say so and give the branch name and the exact commands instead. Because the PR and head commit do not exist when the report is written, the saved report file says "see PR description" for those two fields. Right after the PR is created, update the PR description (`gh pr edit`, or the REST API if GraphQL is blocked) so its Branch and PR, and Head commit, lines hold the real values, and refresh the head commit if you push further commits.
3. Wait for CI and report its result. Fix failures caused by the lesson, such as formatting.
4. Give the user a short summary with the PR link and the worktree path, then stop and ask what to do next.

Never merge, mark the PR ready, publish (`webStatus: "published"`), or deploy unless the user explicitly asks. Remove the worktree only after the PR is merged or closed and the user agrees (`git worktree remove ../genai-learner-<lessonId>`).
