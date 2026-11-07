# Mockup validation

Validated 2026-11-07.

## Passed

- JavaScript syntax: `node --check mockups/app.js`.
- Whitespace/conflict check: `git diff --check`.
- 7 reproducible Node test cases (`npm test`) using jsdom: landing rendering, prediction preview changes, seven catalog cards, search match and empty results, filter selection, course groups, lesson routing, all three simulation steps, simulation reset, incorrect/correct quiz feedback, completion persistence, home completion state, theme persistence, lesson section routing, demo reset, and unknown-route fallback.
- Prototype assets total approximately 50 KB, well below the 500 KB budget. All assets are local; no external network dependencies, backend requests, fonts, or model calls.

## Still requires browser review

Browser spot checks were performed in Chrome at 390px in light and dark themes; the mobile bottom bar remained visible. A 390px screenshot was captured during review. Tablet and desktop screenshots, systematic overflow checks, and measured contrast are not yet recorded. DOM tests do not substitute for these checks.

Before merging, open the mockup at 390, 768, and 1440 pixel widths in both themes. Review every view, use keyboard navigation, verify back/forward, expand course chapters, and inspect long lesson/code sections. Confirm no console errors, horizontal overflow, or network-dependent resources. Check reduced-motion behavior and readable focus/contrast.

## Review flow

1. Landing: try another prediction and enter the studio.
2. Home: search, filter, inspect the empty state, and continue the lesson.
3. Course: expand chapter groups and open the sample.
4. Lesson: step through generation, reset, answer the quiz, and mark complete.
5. Return home; refresh to check persistence; use Reset demo.

No actual learner records, publication states, or deployed lessons are changed.

## Wide workspace update

- The seven reproducible test cases verify three stages, sidebar removal, moving the single lab into/out of the workspace, simulation state continuity, workspace theme toggle, restored trigger focus, scroll-lock cleanup, navigation menu content, and mobile navigation markup.
- The added checks stub jsdom dialog methods: native focus trapping, Escape handling, bottom-sheet rendering, actual viewport reflow and scroll behavior still require browser verification. Chrome was accessible for a mobile spot check; remaining checks are listed below.
- Browser review should cover the wide lab at 1440px, stacked lab at 768px/390px, workspace open/close after stepping, both themes, Escape, Tab containment, focus restoration, and mobile bottom navigation without obscured content.

## Knowledge-check clarity update

The exercise now uses a distinct practice card, explicit choose-one instructions, native radio inputs in a fieldset, and a Check answer button disabled until selection. Selection alone does not grade the answer. Changing a selection clears stale feedback. Updated interaction checks are covered by the reproducible `npm test` suite. Browser visual verification remains partial.

## Disabled button contrast

The disabled generation button and knowledge-check action use explicit `--disabled-bg` and `--disabled-ink` tokens. They no longer inherit white-on-primary text and then fade the entire control. The values are defined for both light and dark themes so the button remains legible when the generation sequence is complete or an answer has not been selected.

Disabled controls use shared semantic color tokens in both themes; primary hover styles preserve the button background. CSS and JavaScript URLs share a version to prevent mismatched cached assets.

## Review follow-up

`npm ci` and `npm test` passed (seven cases). In Chrome, the expanded workspace opened, Tab wrapped from the last control to the first, theme toggled, and Escape returned focus to Expand workspace. The 768px and 1440px visual passes, screenshots, browser history, overflow, and measured contrast remain pending; do not treat this as a completed browser review.
