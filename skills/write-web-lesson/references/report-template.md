# Lesson report: [lessonId] [title]

Copy this template to `docs/lesson-reports/<module>/<lessonId>.md`, fill every section, and paste the same text into the PR description. Write "not tested" or "not applicable" with a reason instead of leaving a section empty. Report only what actually ran.

## 1. Summary

- **Module / lesson ID:** [registry key / canonical slug]
- **Branch and PR:** [branch] / [PR link or "not opened"]
- **Head commit:** [short SHA]
- **webStatus:** draft (the agent does not publish)
- **Date and author:** [date, agent or person]

## 2. Curriculum alignment

- **Learner outcome:** [from the curriculum]
- **Misconception addressed:** [specific idea]
- **Prerequisites and adjacent lessons:** [IDs]
- **Out of scope (deliberately left to other lessons):** [list]

## 3. What was built

- **Files added or changed:** [list]
- **Interaction:** [learner action, observable change, insight]
- **Knowledge check:** [question, correct option position, one line per wrong option's feedback]
- **Shared code touched:** [`LessonFrame`, `Check`, `Course.tsx`, none] and why. Confirm existing lessons render unchanged.

## 4. Truth and fidelity log

| Claim or value                  | Verified fact or invented? | Source (URL, doc) | Where it is disclosed in the lesson |
| ------------------------------- | -------------------------- | ----------------- | ----------------------------------- |
| [example number, rule, diagram] | [verified / illustrative]  | [source]          | [section id]                        |

List anything uncertain that a subject-matter reviewer should check.

## 5. Decisions and deviations

- [Decision, alternative considered, reason]
- [Departure from the skill, template or plan, and why]

## 6. Verification evidence

### Commands

| Command                   | Result      | Notes                 |
| ------------------------- | ----------- | --------------------- |
| `npm run format:check`    | [pass/fail] |                       |
| `npm run typecheck`       | [pass/fail] |                       |
| `npm test`                | [pass/fail] | [specs added/changed] |
| `npm run test:production` | [pass/fail] | draft returns 404     |
| CI run on head commit     | [link]      |                       |

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
- [ ] Interaction responds meaningfully, including reset
- [ ] Wrong answer shows its specific feedback; retry works; correct answer is not always in the same position as other lessons
- [ ] Keyboard operation and visible focus throughout
- [ ] Expanded workspace (if any): state kept, Escape closes, focus returns
- [ ] Theme switch does not reset lab or quiz state
- [ ] Internal links use `next/link`
- [ ] Draft route is 404 in production

## 7. Not tested / limitations

- Manual screen-reader pass: [done with X / not done]
- Real-device or other-browser checks: [done / not done]
- Known limitations of the simulation or content: [list]

## 8. Publication readiness

- **Needed before publishing:** [content review, screen-reader pass, course page or learning-path changes]
- **Publish step (human decision):** a PR changing `webStatus` to `published` in `meta.json`, with `test:production` passing.

## 9. Reviewer handoff

- **Look at first:** [files or risks]
- **Questions for the owner:** [list]
