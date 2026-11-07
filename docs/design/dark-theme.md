# Dark theme

## Intent

Use layered charcoal-green surfaces with soft light text. The theme should preserve the light layout and hierarchy while making prolonged reading comfortable. Avoid turning every border, diagram edge, or action into a bright glow.

## Current tokens

CSS in [styles.css](../../mockups/styles.css) is canonical. The values below are a documentation snapshot for review; verify them against CSS when tokens change. When the web app shell lands (PR 1 in the [implementation plan](../plans/web-implementation-plan.md)), `app/tokens.css` becomes canonical and this note should be updated in that PR.

| Token | Value | Role |
| --- | --- | --- |
| `--bg` | `#171d1a` | Page background |
| `--paper` | `#222b25` | Raised cards and answer options |
| `--ink` | `#edf1e8` | Primary text |
| `--muted` | `#b4bfb1` | Supporting text |
| `--line` | `#3c493f` | Quiet separators and borders |
| `--accent` | `#a1b0ff` | Links, focus, primary actions, selected borders |
| `--accent-soft` | `#30395e` | Callouts, model stage, practice background |
| `--green` | `#657b38` | Reserved secondary highlight |
| `--orange` | `#875627` | Reserved warm highlight |
| `--panel` | `#2c362e` | Muted panels and bar tracks |
| `--dark` | `#111b16` | Deeper inverse/code surfaces |
| `--inverse-ink` | `#edf1e8` | Same as light; text on inverse panels |
| `--inverse-muted` | `#bdcba9` | Same as light; supporting text on inverse panels |
| `--inverse-border` | `#71806f` | Same as light; borders on inverse panels |
| `--highlight-ink` | `#f1f4e9` | Text on highlight chips |
| `--disabled-bg` | `#39433d` | Disabled control background |
| `--disabled-ink` | `#c3ccc4` | Disabled control text |
| `--on-accent` | `#151c32` | Dark text on the light accent. Planned for the web app (PR 1); not in the mockup CSS |
| `--code-ink` | `#dce8ce` | Same as light; code text. Planned for the web app (PR 1); not in the mockup CSS |
| `--backdrop` | `rgba(9, 18, 15, 0.65)` | Same as light; dialog backdrop. Planned for the web app (PR 1); not in the mockup CSS |

`--radius` remains `16px`; geometry does not change. Use `color-scheme: dark` for native controls. Primary buttons use `--on-accent` (`#151c32`) over the light accent, rather than white text. Most ordinary text uses `--ink`.

## Surface and illustration rules

- Separate surfaces with modest luminance differences and borders. Do not rely entirely on shadows against a dark background.
- Keep diagram labels and connectors readable on each stage’s actual surface.
- Theme custom SVG fills/strokes using semantic roles. Do not blindly invert images, screenshots, or illustrations with CSS filters.
- Fixed-palette artwork must remain legible and be intentionally contained. The landing preview currently keeps a light canvas; new lesson diagrams should adapt to both themes.
- Code uses a deliberately darker panel and a light foreground. Syntax colors, if introduced, require contrast review in both themes.
- Preserve selected, disabled, focus, and feedback distinctions without relying only on hue.

## Behavior

An explicit dark choice is stored as `genai-theme=dark`. Both header and workspace theme controls affect the same `body.dark` class and stored preference. Switching themes must retain the current simulation step, selected quiz choice, and open workspace. Reset demo clears the preference and returns to light.

The current implementation applies the stored theme in deferred JavaScript. A flash of light content may occur on reload; pre-paint initialization is a production follow-up, not a completed feature. There is no System option in the mockup.

### Web app behavior (planned, PR 1 requirement)

Not implemented yet. These are requirements for the web app shell in PR 1 of the [implementation plan](../plans/web-implementation-plan.md); the mockup behaviour above remains current until then.

The web app should change three things. With no saved choice it should follow the device's system theme (`prefers-color-scheme`). A saved choice should be applied before first paint by an inline script in the root layout, using `data-theme="light"` or `data-theme="dark"` on `<html>` instead of `body.dark`. If browser storage is blocked, the toggle should still work for the session. The `genai-theme` key and the shared header/workspace toggle stay unchanged.

Mechanism: CSS handles the unset default, so it works before and without JavaScript.

```css
:root { /* light tokens */ }
html[data-theme="dark"] { /* dark tokens */ }
@media (prefers-color-scheme: dark) {
  html:not([data-theme="light"]) { /* dark tokens */ }
}
```

`data-theme` is set only when the learner chooses a theme, either restored from storage before first paint or set by the toggle for the session. With no choice, the attribute is absent and the media query applies, including live changes to the device setting. Keep the dark values in one place (for example, a shared custom-property block) so the two dark selectors cannot drift.

## Review

Inspect the lesson, expanded workspace, navigation sheets, knowledge check, search, and course cards. Check native radio appearance, backdrop separation, disabled button legibility, focus rings, and text on accent-soft panels. Verify there is no accidental black-on-dark or white-on-light-accent text. Browser rendering and measured contrast remain pending in the prototype validation record.
