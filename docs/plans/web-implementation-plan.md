# Web implementation plan

Status: approved plan, PR 1 in progress on `feature/web-shell`.
Related: Architecture decision 001 (`docs/decisions/001-web-architecture.md`, forthcoming in PR 1) · [Design system](../design/design-system.md) · [Light theme](../design/light-theme.md) · [Dark theme](../design/dark-theme.md)

## 1. Goal

Turn the approved learning-studio mockup (`mockups/`) into a production web app. Ship one production-shaped shell and one sample lesson first, then prove the lesson format with a second, differently shaped lesson, then add accounts and progress.

The mockup stays in the repo as the visual reference. It is not the source code for the new app.

## 2. Decisions

| Area | Decision |
| --- | --- |
| Framework | Next.js 16, App Router, TypeScript. Versions pinned. |
| Styling | Global theme tokens in `app/tokens.css`; CSS Modules for components and lesson layouts. No Tailwind. |
| Lessons | Written in JSX (`Lesson.tsx`), authored independently for web. Labs are `"use client"` components. MDX may be added later for prose-heavy lessons. |
| Lesson location | This repo, under `src/lessons/`. |
| Curriculum identity | Canonical lesson IDs from the content repo's `curriculum.json`; module and slug format from `module_registry.json`. |
| Web routes | Defined for web, not copied from mobile asset paths. Shape: `/learn/<module>/<lessonId>`, where `<module>` is a `module_registry.json` key. |
| Publication | Separate from mobile. A lesson in the repo is not learner-visible until `webStatus: 'published'`. |
| Auth and data | Supabase, added in PR 3. Lesson pages stay static. |
| Hosting | Vercel Hobby while use is personal and non-commercial. Before the project becomes commercial (paying learners, ads, sponsorship, or operating as a business), move to Vercel Pro or Cloudflare. |
| Cloudflare fallback | Not assumed. Verified with an OpenNext test preview in PR 2. |
| Vendor lock-in | No Vercel-only services (KV, Postgres, Blob). |

## 3. Theme mapping

The theme is already documented. Do not repeat token values here.

- Tokens and roles: [light theme](../design/light-theme.md) and [dark theme](../design/dark-theme.md). These now include every token in the mockup CSS, plus three new ones that replace hardcoded colours: `--on-accent`, `--code-ink`, `--backdrop`.
- Theme behaviour for the web app: [dark theme, web app behavior](../design/dark-theme.md#web-app-behavior-planned-pr-1-requirement) and the [theme contract](../design/design-system.md#6-theme-contract).
- Canonical values: `mockups/styles.css` until PR 1 lands; then `app/tokens.css` (drafted locally, not yet committed), mapped one-to-one from it. Only the selectors change: dark tokens apply under `html[data-theme="dark"]` and under `@media (prefers-color-scheme: dark)` for `html:not([data-theme="light"])`, replacing `body.dark`. See the mechanism in the dark theme doc.

PR 1 check: every token in the theme docs exists in `tokens.css` with the same value. Out of scope for PR 1: the landing page's remaining hardcoded colours, noted in the theme contract.

## 4. Lesson contract

1. Shared colours and controls come only from shell tokens. A lesson may use its own CSS Module for layout.
2. No header, theme toggle, global CSS or page wrapper inside a lesson.
3. Sections use the shared `<LessonSection id title>` component, which renders the heading and feeds the section menu. Every section has a stable `id` for navigation and direct links.
4. Labs sit inside `<LabFrame>`. Lab state lives above the part that moves between inline and workspace, either in a hook or store above the switch, or in one lab that stays mounted while only its layout changes. A React portal alone does not preserve state if its destination changes.
5. Each lesson has `meta.ts`:
   ```ts
   export const meta = {
     lessonId: "c2-02",
     module: "genai-basics", // module_registry.json key
     title: "One token at a time",
     outcome: "Explain how a model generates text one token at a time.",
     sections: [{ id: "idea", title: "The big idea" } /* … */],
     webStatus: "draft", // "draft" | "published"
   } as const;
   ```
6. Code, JSON and prompt examples are passed as a string, `<CodeBlock code={`...`} />`, never as JSX children.
7. Knowledge checks are ungraded and local. They do not call the backend.
8. Every lesson passes the Playwright checks in section 7.

### Lesson folder

```
src/lessons/genai-basics/c2-02/
  Lesson.tsx          content, using shared components
  NextTokenLab.tsx    "use client" lab
  lesson.module.css   lesson-specific layout, tokens only
  meta.ts             metadata
  assets/             diagrams, images
```

## 5. Shell

| Component | Mockup source | Responsibility |
| --- | --- | --- |
| `AppShell` | header, footer | Brand, main nav, theme toggle, skip link |
| `LessonLayout` | `.lesson-shell`, `.article` | Reading width (720px), wide width (1240px), toolbar |
| `LessonToolbar` / `MobileLessonBar` | `.lesson-toolbar`, `.mobile-lesson-bar` | Course contents, sections menu, next section |
| `SectionMenu` | `#lesson-menu` | Dialog / bottom sheet built from `meta.sections` |
| `LessonSection` | `section` + `h2` | Heading, stable ID, menu entry |
| `LabFrame` | `.lab`, `#wide-workspace` | Lab header, simulation label, Expand workspace, dialog with focus, Escape, scroll lock, theme toggle, return control |
| `Callout` | `.callout` | Highlighted explanation |
| `WideSection` | wide experiment area | Content wider than the reading column |
| `KnowledgeCheck` | `.knowledge-check` | Fieldset, native radios, Check answer, live feedback, retry |
| `CodeBlock` | `.article pre` | Code as a string prop, local horizontal scroll |

Breakpoints from the mockup: 760px, 1000px (lab stacks), 1100px.

## 6. Curriculum data

- Commit read-only copies of `curriculum.json` and `module_registry.json` to `src/data/curriculum/`.
- A `sync-curriculum` script copies them from the content repo and records the source commit SHA.
- The build fails if a `lessonId` is not in `curriculum.json`, if `meta.module` is not a `module_registry.json` key, or if the `lessonId` fails that module's `slugPattern`.
- Web lesson folders are `src/lessons/<module>/<lessonId>/`. They intentionally omit the registry's `groupFolder` (for example `ch02/`), which describes the mobile content layout, not web source paths.
- Vercel builds cannot see the content repo, so the copies keep the check identical locally, in CI and on Vercel.

## 7. Testing

- `tsc --noEmit` and the curriculum check on every build.
- Playwright, for each lesson:
  - 390, 768 and 1440px, light and dark. Set both the browser colour scheme and `genai-theme` explicitly.
  - No unintended page-level horizontal overflow. Code blocks and deliberately wide diagrams may scroll inside their own bounded container.
  - Rendered sections match `meta.sections` in order.
  - Lab: step forward, expand workspace, confirm the step survived, press Escape, confirm it still survived and focus returned to Expand workspace.
  - Knowledge check: disabled until selection, feedback only after Check answer, retry clears old feedback.
  - Section menu and next section move focus to the target heading.
  - Theme toggle keeps lab and quiz state.
- Visual comparison of the new `c2-02` against the mockup lesson in both themes.
- `mockups/` tests stay as `npm run test:mockup`, unchanged. The new tests check learner behaviour, not the mockup's DOM structure.

## 8. Delivery plan

### PR 1: Shell and sample lesson

- [ ] `app/tokens.css` mapped from the mockup (drafted locally, uncommitted)
- [ ] `docs/decisions/001-web-architecture.md` (drafted locally, uncommitted)
- [ ] Switch the theme docs' canonical-source note from `mockups/styles.css` to `app/tokens.css`
- [ ] Verify `tokens.css` against the light and dark theme docs, including `--on-accent`, `--code-ink`, `--backdrop`
- [ ] Commit and push `feature/web-shell` as a draft PR
- [ ] Confirm the chosen `next@16.x.y` is supported by `@opennextjs/cloudflare`, then pin versions
- [ ] Scaffold Next.js; theme script in `app/layout.tsx`
- [ ] Shell components from section 5
- [ ] Lesson contract doc (`docs/lesson-contract.md`)
- [ ] Port `c2-02` with `NextTokenLab` at `/learn/genai-basics/c2-02`
- [ ] Sample route built in development and preview only; excluded from production builds. `/` redirects to it in preview until the landing page is ported.
- [ ] Curriculum snapshot, sync script and build check
- [ ] Playwright tests from section 7
- [ ] Vercel preview deploys
- [x] Theme docs updated with missing tokens and planned web app behaviour (PR #2)

Not in PR 1: Supabase, production visibility, landing, catalog and course pages.

### PR 2: Prove variety

- [ ] Second lesson with a different shape (wide architecture diagram). Choose a lesson that already exists in `curriculum.json`, or register its module first.
- [ ] General `webStatus` filter for production builds
- [ ] OpenNext Cloudflare test preview
- [ ] Lesson template for AI agents

### PR 3: Accounts and progress

- [ ] Resolve the open decisions in section 9
- [ ] Add and pin `@supabase/ssr`
- [ ] `proxy.ts` session refresh only on protected routes (`/account/*`); server-side authorization for protected data and actions
- [ ] Sign-in, account area, progress; lesson completion loads client-side so lesson pages stay static

### Later

- Landing, learner home, catalog and course pages; landing colour tokens (see theme contract)
- More lessons; MDX for text-heavy lessons if needed
- Hosting decision before the project becomes commercial

## 9. Open decisions (resolve before PR 3)

1. **Web and mobile progress.** Does completing a web lesson count as mobile completion? What about XP and streaks? `submit-answer` currently updates all three.
2. **Calling `submit-answer`.** From the browser, which needs CORS added (it currently handles POST only, with no CORS headers), or through a Next.js server route, which avoids browser CORS.
3. **Web visibility on the backend.** `lessons.status = 'published'` and `visible = true` are mobile gates. Web needs its own readiness signal.
4. **Publishing workflow.** How an approved lesson is selected for production, and how each lesson PR gets a preview.
