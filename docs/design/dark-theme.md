# Dark theme

## Intent

Use layered charcoal-green surfaces with soft light text. The theme should preserve the light layout and hierarchy while making prolonged reading comfortable. Avoid turning every border, diagram edge, or action into a bright glow.

## Current tokens

These values match `body.dark` in [styles.css](../../mockups/styles.css).

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

`--radius` remains `16px`; geometry does not change. Use `color-scheme: dark` for native controls. Primary buttons use dark foreground `#151c32` over the light accent, rather than white text. Most ordinary text uses `--ink`.

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

## Review

Inspect the lesson, expanded workspace, navigation sheets, knowledge check, search, and course cards. Check native radio appearance, backdrop separation, disabled button legibility, focus rings, and text on accent-soft panels. Verify there is no accidental black-on-dark or white-on-light-accent text. Browser rendering and measured contrast remain pending in the prototype validation record.
