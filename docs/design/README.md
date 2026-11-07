# Web design guide

This directory records the design direction established by the interactive web mockup and the rules for extending it. The audience is designers, engineers, and agents creating new web pages. The user has reviewed the direction positively; this is not a production-readiness or lesson-publication record.

## Read in this order

1. [Complete design system](design-system.md): product character, page anatomy, layout, typography, components, responsive behavior, and interaction rules.
2. [Light theme](light-theme.md) and [dark theme](dark-theme.md): exact current tokens, their roles, and theme-specific guidance.
3. [New page guide](new-page.md): how to design and implement a page, with a reusable page brief.
4. [Review checklist](review-checklist.md): acceptance checks before requesting design approval.

## Source of truth and scope

- These documents describe the intended reusable design and identify prototype limitations explicitly.
- [Prototype CSS](../../mockups/styles.css) contains current token values and implemented layout rules. [Prototype JavaScript](../../mockups/app.js) contains demo interactions and screen markup.
- Change token values in the implementation and both relevant documentation references together. New pages should consume shared styling, not copy a private theme into each page.
- [Original design brief](../design-brief.md) explains the project brief and learning references. [Validation record](../mockup-validation.md) distinguishes completed checks from browser review still pending.
- The web experience has its own authoring and visual design. The content project supplies curriculum topics, canonical lesson identities, and scope boundaries—not mobile HTML templates.
- Production framework, content format, authoring automation, backend integration, and publication workflows are not defined here. A Markdown page brief is a planning artifact, not an executable lesson format.

## Current reference screens

Serve the repository with `python3 -m http.server 8765` and open:

| Screen | Preview path |
| --- | --- |
| Landing | `/mockups/#landing` |
| Learner home | `/mockups/#home` |
| Course | `/mockups/#course` |
| Lesson | `/mockups/#lesson` |
| Wide experiment | `/mockups/#lesson/experiment` |
| Knowledge check | `/mockups/#lesson/check` |

The sample is `c2-02`, next-token prediction. Its landscape generation flow demonstrates the wide-workspace pattern; it is not a full architecture course. The remaining catalog cards are representative topics linking to this sample experience.
