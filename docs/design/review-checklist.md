# Design review checklist

Record results as passed, failed, or not checked. Do not turn an untested requirement into a success claim. For the current prototype, [mockup validation](../mockup-validation.md) contains the existing evidence and browser limitations.

## Content and purpose

- [ ] The page has a clear purpose and primary action.
- [ ] Heading order, labels, examples, and instructions make sense without surrounding project context.
- [ ] Lesson identity/outcome align with the curriculum; web content is independently authored.
- [ ] Simulations, placeholder catalog entries, local progress, and unavailable lessons are disclosed.
- [ ] Every visible control works or is explicitly unavailable with an understandable reason.

## Layout and responsiveness

- [ ] Review at 390px, 768px, and 1440px, plus intermediate widths around changed breakpoints.
- [ ] Repeat relevant checks with long headings, labels, and realistic code.
- [ ] Prose stays readable; wide diagrams use available space without stretching all paragraphs.
- [ ] The page has no horizontal overflow; any intentional local scrolling is contained and understandable.
- [ ] Mobile navigation remains reachable without obscuring content or controls, including safe-area padding.
- [ ] Reflowed diagrams preserve reading order and relationships.
- [ ] Expanded workspaces fit the viewport and offer an obvious return path.

## Light and dark themes

- [ ] Review all screens and interactive states in both themes.
- [ ] Verify actual text contrast: target at least 4.5:1 for normal text and 3:1 for large text; essential control/graphic boundaries target 3:1 where applicable.
- [ ] Inspect focus, selected, disabled, feedback, code, diagram connectors, and native controls separately.
- [ ] Theme toggling preserves experiment state, selected answers, and the open workspace.
- [ ] Stored preference and reset behave as documented; note reload flash or other limitations.
- [ ] Color is never the sole indicator of a selected answer, outcome, or diagram relationship.

## Keyboard and assistive interaction

- [ ] Tab order follows the task; controls have meaningful accessible names.
- [ ] Radio options use native keyboard behavior and an associated question legend.
- [ ] Selection alone does not submit the knowledge check; Check answer provides feedback.
- [ ] Changing an answer clears obsolete feedback and permits retry.
- [ ] Dialogs contain focus, close with Escape and the visible close control, and restore trigger focus.
- [ ] Background scrolling is locked while dialogs are open and restored afterward.
- [ ] Status updates are announced without stealing focus unnecessarily.
- [ ] Reduced motion and enlarged text do not prevent task completion.

## State, performance, and delivery

- [ ] Direct links, navigation, back/forward, and section links work in a browser.
- [ ] Experiments retain state across workspace entry/exit and theme toggles.
- [ ] Empty searches, reset, and unavailable storage do not break core functionality.
- [ ] No browser console errors or unexpected network calls occur.
- [ ] Initial prototype assets fit the 500 KB budget; additional media is justified and deferred where appropriate.
- [ ] No secrets, scratch notes, or unintended files enter the commit.
- [ ] PR includes preview instructions, meaningful checks, visual evidence when available, and explicit unverified items.

Passing DOM tests is useful evidence for logic. It does not replace browser rendering, native dialog, keyboard, contrast, or responsive review. Documentation of a design does not publish a lesson or authorize production promotion.
