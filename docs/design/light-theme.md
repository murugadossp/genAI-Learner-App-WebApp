# Light theme

## Intent

A warm, quiet canvas with crisp reading surfaces and cobalt actions. Keep large reading areas neutral. Use accent backgrounds to distinguish interactive or instructional regions without tinting every card.

## Current tokens

CSS in [styles.css](../../mockups/styles.css) is canonical. The values below are a documentation snapshot for review; verify them against CSS when tokens change.

| Token | Value | Role |
| --- | --- | --- |
| `--bg` | `#f8f7f3` | Page and recessed reading background |
| `--paper` | `#ffffff` | Cards, answer options, dialog details |
| `--ink` | `#202720` | Primary text |
| `--muted` | `#62695f` | Supporting text |
| `--line` | `#dcded4` | Separators and quiet borders |
| `--accent` | `#304fe8` | Primary actions, links, focus, selected borders |
| `--accent-soft` | `#e9edff` | Callouts, model stage, practice background |
| `--green` | `#dce9a7` | Reserved secondary highlight |
| `--orange` | `#f5c38a` | Reserved warm highlight |
| `--panel` | `#edf0e7` | Muted panels and bar tracks |
| `--dark` | `#202d29` | Inverse panels and code surfaces |
| `--radius` | `16px` | Base card radius reference |

Use `color-scheme: light` so native controls match the theme. Primary buttons currently use white text over the cobalt accent. Inverse panels need their own light foreground; do not apply the default dark ink to them.

## Usage examples

```css
.lesson-surface {
  background: var(--paper);
  color: var(--ink);
  border: 1px solid var(--line);
}
.lesson-hint {
  background: var(--accent-soft);
  border-left: 3px solid var(--accent);
  color: var(--ink);
}
```

The same component CSS should work in dark mode without a second hardcoded palette.

## Interaction and readability

- Use accent borders plus native control state for selected answers. Do not rely on background tint alone.
- Supporting text uses `--muted`; placeholder text must not substitute for an input label.
- Thin separators are decoration, not sufficient identification for every essential control. Review control boundaries and focus independently.
- Secondary highlights are not predefined success/warning semantics. Add an explicit semantic role and define both theme values if a new product state requires one.
- Do not add persistent glows or gradients behind lesson prose.

## Review

Check all text on paper, canvas, callout, and inverse surfaces. Verify primary and secondary actions, selected radios, feedback, code, diagrams, dialogs, and disabled controls. Measure contrast for actual foreground/background pairs; token names alone do not establish accessibility. The prototype has not yet passed visual browser contrast review.
