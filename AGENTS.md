# AGENTS.md

Guidance for AI coding agents working in this repository. `CLAUDE.md` imports this file, so keep it the single source of truth.

## What this repo is

The GenAI Learner web app: a Next.js 16 (App Router) + strict TypeScript learning studio with interactive lessons. `mockups/` is the original static design reference, not app source. Curriculum identity comes from the separate content repo (`genAI-Learner-App`); web lessons are authored independently of the mobile apps.

## Commands

- `npm ci`: install.
- `npm run dev`: dev server at http://localhost:3000 (runs `check-curriculum` and `prepare-routes` first). Use the npm scripts, not `next` directly.
- `npm run format:check`: Prettier check (`src`, `scripts/*.mjs`, `tests/web/*.ts`, `app/layout.tsx`, `playwright.config.ts`). Fix with `npx prettier --write <file>`.
- `npm run typecheck`: curriculum check plus `tsc --noEmit` (strict).
- `npm test`: mockup tests, production build, Playwright (`tests/web/*.spec.ts`) and `test:production`. This is what CI runs after `format:check`.
- `npm run test:production`: builds in a temp copy with `APP_ENV=production` and checks that draft lessons return 404 and published ones 200.

Run `format:check` and `typecheck` before opening a PR. New code must be Prettier-formatted or CI fails.

## Layout

- `src/lessons/<module>/<lessonId>/`: one lesson (`Lesson.tsx`, `meta.json`, optional client components). Shared `src/lessons/LessonFrame.tsx` and `Check.tsx`.
- `src/studio/`: landing, studio, course pages and `data.ts`.
- `src/data/curriculum/`: read-only snapshot of the content repo (`curriculum.json`, `module_registry.json`, `source.json`). Refresh with `scripts/sync-curriculum.py`; do not edit by hand.
- `scripts/`: `lesson-registry.mjs` (reads and validates every `meta.json`), `prepare-routes.mjs` (generates `app/**/page.tsx`), `check-curriculum.mjs`, `test-production-gating.mjs`.
- `app/`: layout and CSS (`tokens.css`, `studio.css`). Route `page.tsx` files are generated and gitignored. Never edit them.
- `tests/web/`: Playwright specs. `tests/*.test.mjs`: mockup tests.
- `docs/`: `plans/web-implementation-plan.md`, `decisions/001-web-architecture.md`, `design/` (tokens, themes, review checklist).
- `skills/`: reusable agent skills (see below).

## Conventions

- `meta.json` fields: `module`, `lessonId`, `title`, `webStatus` (`draft` or `published`), `sections[]` (`id`, `title`, unique ids matching rendered section ids). `module` and `lessonId` must match the folder names and the registry slug pattern, and the lesson must exist in the curriculum snapshot.
- New lessons start as `draft`. Only change `webStatus` to `published` when the user asks; publishing goes through a PR and `test:production`.
- `Check` props: `question`, `options`, `correct` (index), `explanation`, `wrongFeedback` (array indexed by option), optional `id`, `title`. Vary the correct answer's position.
- Use `next/link` for internal links, semantic theme tokens (`app/tokens.css`) and visible focus. Keep live regions restrained and support light and dark themes.
- Known hardcoding: `LessonFrame` shows a fixed "How GenAI works / Lesson N" label and `/course` links, and `src/studio/Course.tsx` is fixed to chapter 2 and `genai-basics`. Generalise these (with defaults, so existing lessons render unchanged) before adding a lesson in another chapter or module.

## Boundaries

- Do not merge, publish, deploy or push without the user's instruction.
- Do not copy content between lessons or from mobile lesson files.
- Do not commit generated route files, `node_modules` or secrets.

## Skills

Reusable skills live in `skills/<name>/SKILL.md`.

- `skills/write-web-lesson`: plan and build a new interactive web lesson from a curriculum module and lesson ID.

Read the relevant `SKILL.md` before the task it covers. Some tools only auto-discover skills in their own folder (for example `.claude/skills/`); if yours does not find these, read the file directly.
