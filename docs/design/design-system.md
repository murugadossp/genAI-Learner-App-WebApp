# Complete web design system

## 1. Product character

Build a learning studio for engineers and curious beginners. The interface should make complex ideas approachable while allowing technical depth. Use plain explanations, inspectable mechanisms, and meaningful experiments. Playfulness comes from changing inputs, seeing consequences, and receiving useful feedback.

The visual identity uses warm neutral surfaces, dark ink, cobalt actions in light mode, a lighter blue accent in dark mode, and restrained secondary color. System sans-serif typography, geometric visuals, modest rounding, and fine borders keep the experience clear and fast. Avoid decorative motion, excessive badges, dense status panels, and large effects that compete with reading.

The existing mobile app and `llm-concepts` inform topic coverage only. New web pages should follow this system rather than importing those themes.

## 2. Information architecture

| Surface | Primary purpose | Required emphasis |
| --- | --- | --- |
| Landing | Explain what learners gain | Clear promise, interactive preview, starting-point action |
| Learner home | Resume or discover learning | Continue-learning card, searchable paths, understandable progress |
| Course | Explain sequence and prerequisites | Outcomes, chapter groups, lesson availability, clear start/resume action |
| Lesson | Build understanding | Readable explanation, experiment, engineering connection, knowledge check |
| Expanded workspace | Inspect a large experiment | Maximum useful canvas, controls, state continuity, obvious return |

Navigation labels describe destinations. A card that appears navigable must work. Placeholder availability must be explicit; never disguise it as completed or published content. Catalog organization can evolve without changing canonical curriculum slugs.

## 3. Layout and responsive rules

Use three content widths, not one fixed-width canvas:

- **Reading:** prose and ordinary lesson sections have a maximum width of 720px, centered within the lesson shell.
- **Wide:** experiments can use the lesson shell, which has a maximum width of 1240px including horizontal padding. At desktop widths the shell uses 32px horizontal padding; phones use 20px.
- **Workspace:** a large dialog can use almost the viewport width, up to 1500px. On phones it becomes a full-height view using `100dvh`.

The global header/footer use a maximum width of 1440px. Landing/course containers use 1240px. Do not force prose to fill these larger containers.

### Lesson navigation

Do not add permanent left and right lesson sidebars. Desktop uses a compact toolbar with Course contents and In this lesson menu buttons. Phone layouts use a sticky bottom bar: Contents, Sections, Next section. Menus become bottom sheets; content and page padding account for the bar and device safe area.

The lesson section list must match rendered section IDs and heading order. Next section means the next section in the current lesson, not an unpublished next lesson.

### Responsive behavior

| Width condition | Intended behavior |
| --- | --- |
| Above 1100px | Spacious landing layout; broad catalog and course layouts |
| 761–1100px | Reduce gaps; retain readable content rather than forcing dense columns |
| At or below 1000px | Sample generation flow stacks its stages vertically |
| At or below 760px | Single-column cards/course layout, mobile lesson bar, bottom-sheet menus |

These are current prototype breakpoints, not device categories. New components may need their own content-driven breakpoint. Check intermediate widths as well as named test sizes. The page must not gain horizontal overflow.

## 4. Typography and spacing

Use the system stack from the prototype: `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`. Use `ui-monospace, monospace` for code and small technical labels. No remote font is required.

| Role | Current reference |
| --- | --- |
| Body | 15px / 1.6 |
| Lesson paragraphs | Body size with 1.85 line height |
| Lesson lead | 18px |
| Lesson title | 46px desktop; 37px phone |
| Lesson section heading | 26px |
| Landing title | Responsive 42–76px |
| Supporting metadata | 12–13px |
| Eyebrow | 11px uppercase monospace, expanded letter spacing |

Keep metadata visually subordinate; do not use tiny metadata styling for essential explanations or instructions. Use one h1 per page, descriptive h2 section headings, and h3 only where a true subsection exists.

Use 8, 12, 16, 20, 24, 32, and 40px as common spacing steps. Cards usually have 24px padding; controls use 8px rounding, cards 16px, and larger feature surfaces about 20px. Use spacing to group related information before adding borders or color.

## 5. Surfaces and components

### Cards and actions

- Base canvas uses `--bg`; ordinary cards use `--paper`; quiet nested areas use `--panel`.
- Primary actions use `--accent`. Secondary actions use transparent or paper surfaces and visible borders.
- Use action labels such as Continue lesson, Expand workspace, or Check answer. Avoid generic labels when the outcome can be stated.
- Native links navigate; buttons perform local actions. Hover styling is supplemental, never the only indication that an element is interactive.
- Disabled controls must communicate why through nearby instructions or context.

### Wide diagrams and interactive labs

An embedded lab has a short title, an explicit simulation label where applicable, understandable controls, and a textual explanation. Label stages and relationships so color alone is not required to read it.

Use a horizontal arrangement when the relationships benefit from it. Reflow to a readable vertical sequence on small screens when that preserves meaning. Do not shrink a 1600px canvas until labels become unreadable.

For future diagrams whose spatial arrangement must remain intact, put pan/zoom inside a clearly bounded viewer with an overview, reset/fit action, keyboard-accessible controls, and a textual equivalent. This is a future component requirement; the current generation flow reflows and has no pan/zoom controls.

Expanded workspaces must preserve experiment state on entry and return. The current mockup moves the same lab node into a native `<dialog>` and restores it on close. Preserve this behavior if the implementation changes. Include a return control, Escape dismissal, contained focus, focus restoration, background scroll locking, and a theme control within the expanded view.

### Knowledge checks

Use a distinct Try it yourself card with a visible Knowledge check label. Include the question, “Choose one answer” instructions, native radio choices, and a Check answer action. Use a fieldset and legend to associate the question with its inputs.

Selecting an answer changes selection styling but does not grade it. Enable Check answer once a choice exists. Submit feedback into a live status region; identify correct/incorrect outcomes with text, not color alone. Changing a selection clears stale feedback and allows retry. Keep practice feedback encouraging and explanatory. Demo questions do not create scores or backend progress.

## 6. Theme contract

Both themes have identical layout, content, and interactions. Use semantic variables from the separate [light](light-theme.md) and [dark](dark-theme.md) references. Theme changes must not reset experiments, answers, navigation, or progress.

The current mockup defaults to light and persists an explicit choice in `genai-theme`. The `dark` class on `body` selects dark tokens. The workspace toggle changes the same preference as the header toggle. System-theme detection and pre-paint preference restoration are not implemented; do not document them as existing features.

Some decorative landing artwork retains a fixed light palette, and the marketing feature panel intentionally uses an inverse dark treatment. New lesson components should use semantic tokens throughout. Review these inherited decorative exceptions in browser QA before extending them.

## 7. Accessibility, performance, and state

Use semantic landmarks, visible focus, native controls, readable link names, and logical keyboard order. The prototype focus ring is 3px in the accent color with a 4px offset. Aim for 44px touch targets and ensure the mobile bar never obscures lesson controls.

Respect reduced-motion preferences. Keep transitions short and functional. Code and genuinely wide tables can scroll within their own containers; the document itself should fit the viewport.

Use local assets and small scripts. The prototype has no framework or runtime dependencies and a 500 KB initial-asset budget. Budget is a review constraint, not proof of runtime performance. If future content requires heavier assets, lazy-load them and document the cost.

Show search empty states, reset behavior, and unavailable content explicitly. Handle unavailable browser storage without breaking core interactions. Current storage contains only theme and demo completion, not real learner progress. Authentication, network errors, and backend persistence require a separate production design.

## 8. Review boundary

Follow the [review checklist](review-checklist.md). DOM assertions verify interaction logic; they do not certify visual layouts, native dialog behavior, contrast, or mobile accessibility. Capture browser evidence when available. The existing [validation record](../mockup-validation.md) notes that browser review remains pending.
