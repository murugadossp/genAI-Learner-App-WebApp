# Lesson report: [lessonId] [title]

Copy this template to `docs/lesson-reports/<module>/<lessonId>.md`, fill every section, and paste the same text into the PR description. Write "not tested" or "not applicable" with a reason instead of leaving a section empty. Report only what actually ran.

## 1. Summary

- **Module / lesson ID:** [registry key / canonical slug]
- **Branch and PR:** [branch] / [PR link]. In the saved file write "see PR description"; the PR description holds the real values.
- **Head commit:** [short SHA]. In the saved file write "see PR description"; update the PR description when the head changes.
- **webStatus (read from `meta.json` at the reviewed commit):** [draft / published]
- **Status changed by this work:** [no / yes, and who asked for it]. Agents do not publish unless the user asks.
- **Date and author:** [date, agent or person]

## 2. Curriculum alignment

- **Learner outcome:** [from the curriculum]
- **Misconception addressed:** [specific idea]
- **Prerequisites and adjacent lessons:** [IDs]
- **Out of scope (deliberately left to other lessons):** [list]

## 3. What was built

- **Files added or changed:** [list]
- **Content added after user feedback (if any):** [what was asked and what changed]
- **Interaction:** [learner action, observable change, insight]
- **Knowledge check:** [question, correct option position, one line per wrong option's feedback]
- **Shared code touched:** [`LessonFrame`, `Check`, `Course.tsx`, none] and why. Confirm existing lessons render unchanged.

## 4. Truth and fidelity log

| Claim or value                  | Verified fact or invented?             | Source (URL, doc) | Where it is disclosed in the lesson |
| ------------------------------- | -------------------------------------- | ----------------- | ----------------------------------- |
| [example number, rule, diagram] | [verified / unverified / illustrative] | [source]          | [section id]                        |

List anything uncertain that a subject-matter reviewer should check.

## 5. Decisions and deviations

- [Decision, alternative considered, reason]
- [Departure from the skill, template or plan, and why]

## 6. Verification evidence

### Commands

| Command                   | Result      | Notes                                                                                                           |
| ------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------- |
| `npm run format:check`    | [pass/fail] |                                                                                                                 |
| `npm run typecheck`       | [pass/fail] |                                                                                                                 |
| `npm test`                | [pass/fail] | [specs added/changed]                                                                                           |
| `npm run test:production` | [pass/fail] | draft returns 404; published (incl. a revision) returns 200                                                     |
| CI run                    | [link]      | optional: the commit tested when the report was written. CI on the final head is recorded in the PR description |

### Review log

| Gate (plan / content) | Round | Provider and model | Finding | Action or reason rejected |
| --------------------- | ----- | ------------------ | ------- | ------------------------- |
| [gate]                | [n]   | [provider: model]  | [text]  | [fixed / rejected: why]   |

Tooling (from `references/tooling.yaml`): reviewers tried in order and why any earlier provider was skipped: [e.g. codex: out of usage; used agy-gemini: gemini-4-argon-medium]. Image provider and model: [provider: model, or no images].

Gate checklist: [ ] reviewer and image providers follow the `tooling.yaml` order (skips explained above) [ ] plan review handled [ ] checks pass [ ] content review done [ ] every plan and content round logged (the final review is recorded in the PR description, not in this report)

Stopped after: [two clean rounds / round cap with open findings listed / reviewer unavailable, and what was used instead].

Round count: [number of content rounds and whether two clean rounds in a row were reached]. If the user requested a substantial expansion after review, list those rounds as a new count and say so.

Stacking: [not stacked / stacked on `<parent-branch>`, PR base, and plan to rebase onto `main`].

### Rendered checks (mark each cell: pass, fail, or not tested)

| Viewport | Light | Dark |
| -------- | ----- | ---- |
| 390      |       |      |
| 768      |       |      |
| 1440     |       |      |

Screenshots saved at: [path or "none"]

### Behaviour checklist

- [ ] Sections render in the same order as `meta.json`
- [ ] No horizontal overflow; text readable; contrast acceptable in both themes
- [ ] Active interactive controls maintain high contrast on hover without falling back to light panel backgrounds
- [ ] Conceptual diagrams (if any) load, have descriptive alt text (>40 chars), and are verified in Playwright tests
- [ ] Interaction responds meaningfully, including reset
- [ ] Wrong answer shows its specific feedback; retry works; correct answer is not always in the same position as other lessons
- [ ] Keyboard operation and visible focus throughout
- [ ] Expanded workspace (if any): state kept, Escape closes, focus returns
- [ ] Theme switch does not reset lab or quiz state
- [ ] Internal links use `next/link`
- [ ] Production route matches `webStatus`: draft returns 404, published returns 200

## 7. Not tested / limitations

- Manual screen-reader pass: [done with X / not done]
- Real-device or other-browser checks: [done / not done]
- Known limitations of the simulation or content: [list]

## 8. Publication readiness

- **Current status and route:** [draft or published] and whether `/learn/<module>/<lessonId>` is live in production.
- **Production navigation (separate from the lesson route):** state whether `/`, `/studio` and `/course` are the placeholder or 404 in production. While they are, a published lesson is reachable only by direct URL, and its "Learning path" and "Next lesson" links may lead to 404. Say so plainly, and do not describe the lesson as reachable through the live site unless navigation is also published.
- **Needed before publishing or linking:** [content review, screen-reader pass, course page or learning-path changes]
- **Publish step (human decision):** a PR changing `webStatus` to `published` in `meta.json`, with `test:production` passing. Navigation changes are a separate decision.

## 9. Reviewer handoff

- **Look at first:** [files or risks]
- **Questions for the owner:** [list]
