# Designing a new web page

Use this guide to create a page that belongs to the learning studio. It applies to landing, catalog, course, lesson, and workspace surfaces. It does not prescribe a production content schema or replace the future lesson-authoring workflow.

## 1. Define the page before the layout

Write a short Markdown brief using the template below. Identify the audience, the page’s job, the primary action, and the state the learner arrives in. For a lesson, find its canonical curriculum identity, outcome, misconception, and boundaries in the content project. Do not infer those from a mobile page’s visual presentation.

Choose an existing page pattern from the [design system](design-system.md). A new page should reuse navigation, typography, tokens, cards, and controls wherever their behavior fits. If a genuinely new component is needed, specify its narrow/wide layouts and both theme states before implementation.

## 2. Lay out content in reading order

Use a single h1 and a clear heading hierarchy. Introduce the purpose before presenting controls. Set the primary action where the learner has enough context to use it. Keep a clear return destination.

For a lesson, use this default sequence, adapting it to the learning objective:

1. Title, outcome, and prerequisite context.
2. Plain-language mental model and a concrete example.
3. A diagram or experiment that exposes the mechanism.
4. A deeper explanation, code, or engineering tradeoff when relevant.
5. A distinct knowledge check with meaningful feedback.
6. Takeaway, completion state, and next destination.

This is a useful page composition, not a requirement to pad every lesson with all six blocks. Avoid inventing progress numbers, durations, ratings, or publication states. Demo data should be explicitly identified.

## 3. Assign widths deliberately

| Content type | Default choice |
| --- | --- |
| Explanations, question cards, short code | Centered reading column, up to 720px |
| Architecture flow, multi-stage experiment, comparison | Wide section inside the lesson shell |
| Complex lab requiring more room | Embedded preview plus Expand workspace |
| Large spatial diagram | Responsive overview; bounded viewer if reflow would lose meaning |

Wide HTML is not a fixed-size image. Use fluid dimensions, `minmax(0, 1fr)` grid tracks, wrapping labels, and content-driven stacking. Test long text and realistic code rather than only short placeholder strings.

If a diagram cannot reflow meaningfully, plan accessible zoom/pan and a textual explanation. Such a viewer is not yet implemented in the current prototype; do not promise it by adding an inert Expand control. Tables/code may scroll locally, but the page must remain within the viewport.

## 4. Specify every interaction

For each control, record its trigger, resulting state, keyboard behavior, and reset/return path. Use native HTML controls first.

- **Navigation:** real destination, descriptive link, browser back behavior, appropriate heading focus after page changes.
- **Experiment:** initial inputs, visible output, simulation disclosure, step/reset behavior, limits, and completion state.
- **Workspace:** preserve the same experiment state; offer Return to lesson and Escape; contain focus; restore focus to the trigger; prevent background scrolling.
- **Knowledge check:** fieldset/legend and native radio inputs, explicit choose-one instructions, disabled Check answer until selection, feedback on submission, retry after changing the answer.
- **Search/filter:** visible label, retained context where appropriate, results count or understandable results, and an empty state with a recovery action.
- **Theme:** shared choice across all views; no loss of state on toggle.

Do not silently connect demo controls to production records. Progress, authentication, grading, or network behavior require an explicit integration design.

## 5. Apply both themes together

Read [light theme](light-theme.md) and [dark theme](dark-theme.md). Use their shared semantic variables rather than page-specific color literals. Test the component’s actual background/foreground combinations in both themes, including hover, focus, selected, disabled, correct, and retry states.

Do not create separate light and dark page markup. Layout and content remain identical. Any new color role needs a documented value and purpose in both themes.

## 6. Implement within the current scope

For this prototype, pages are local HTML/CSS/JavaScript views in `mockups/`, with hash navigation and no build step. Extend its renderer and shared styles; do not introduce a framework, network service, secret, or backend mutation merely to demonstrate a design.

A future production application can use different rendering technology while retaining these design and interaction contracts. Keep curriculum identity independent of navigation labels and visual grouping. Do not import mobile lesson HTML as the web page.

Document added asset weight, any dependency, and any behavior that remains simulated. Follow the [review checklist](review-checklist.md) and update the validation record with evidence and limitations. Request review on a branch/PR; design review is not deployment or lesson publication.

## Reusable page brief

Copy this into the new page’s design proposal. Keep only sections relevant to the page, but resolve every user-facing behavior before implementation.

```markdown
# Page design: <title>

## Purpose
- Page type:
- Audience and assumed knowledge:
- Learner goal / outcome:
- Primary action:
- Entry and return destinations:
- Canonical lesson ID and curriculum references, if applicable:
- In scope / out of scope:

## Content structure
- H1 and introductory promise:
- Ordered sections and their purpose:
- Example or scenario:
- Misconception addressed:
- Takeaway and next action:

## Layout
- Reading-column sections:
- Wide sections and why they need width:
- Expanded workspace, if needed:
- Small-screen reflow and navigation:
- Long-text, code, and overflow handling:

## Components and interactions
- Shared components reused:
- New components and rationale:
- Each control's initial, active, completed, and reset states:
- Keyboard behavior and focus destination:
- Feedback and empty/unavailable states:
- What is simulated versus real:
- State retained when navigating, expanding, or switching theme:

## Themes and accessibility
- Shared tokens used:
- Any new semantic roles, with light/dark values:
- Labels, reading order, live feedback, and diagram alternatives:
- Reduced-motion behavior:

## Delivery and review
- Preview route:
- Assets and size budget:
- Acceptance scenarios:
- Browser/device/theme evidence:
- Remaining limitations:
```
