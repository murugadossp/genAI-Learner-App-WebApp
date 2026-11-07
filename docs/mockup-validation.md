# Mockup validation

Validated 2026-11-07.

## Passed

- JavaScript syntax: `node --check mockups/app.js`.
- Whitespace/conflict check: `git diff --check`.
- 20 DOM assertions using jsdom installed outside the repository: landing rendering, prediction preview changes, seven catalog cards, search match and empty results, filter selection, course groups, lesson routing, all three simulation steps, simulation reset, incorrect/correct quiz feedback, completion persistence, home completion state, theme persistence, lesson section routing, demo reset, and unknown-route fallback.
- Prototype assets total approximately 33 KB, well below the 500 KB budget. All assets are local; no external network dependencies, backend requests, fonts, or model calls.

## Still requires browser review

The computer-use browser host was unavailable in this session. No screenshots were captured, and visual layout, actual browser history behavior, rendered contrast, keyboard traversal, and viewport overflow have **not** been verified in a browser. DOM checks do not substitute for these checks.

Before merging, open the mockup at 390, 768, and 1440 pixel widths in both themes. Review every view, use keyboard navigation, verify back/forward, expand course chapters, and inspect long lesson/code sections. Confirm no console errors, horizontal overflow, or network-dependent resources. Check reduced-motion behavior and readable focus/contrast.

## Review flow

1. Landing: try another prediction and enter the studio.
2. Home: search, filter, inspect the empty state, and continue the lesson.
3. Course: expand chapter groups and open the sample.
4. Lesson: step through generation, reset, answer the quiz, and mark complete.
5. Return home; refresh to check persistence; use Reset demo.

No actual learner records, publication states, or deployed lessons are changed.
