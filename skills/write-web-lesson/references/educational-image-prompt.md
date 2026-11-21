# Educational image prompt (CLI-agnostic)

One master prompt for every lesson illustration. It works with any CLI that can call an image-generation tool (agy, Codex, or another). Keep this file as the single standard; put topic-specific values in a JSON file and fill the placeholders with `scripts/fill_image_prompt.py`.

## How to use

1. Copy `example-values.json` (or write a new JSON file with the keys below) and replace `REPLACE_WITH_ABSOLUTE_SCRATCH_PATH` in `OUTPUT_PATH` and `REFERENCE_IMAGE` with your real absolute scratch folder path. Every key is required.
2. Fill the template: `python3 "<repo>/skills/write-web-lesson/scripts/fill_image_prompt.py" "values.json" --out "prompt.txt"` (quote the paths, so folders with spaces work). The script fails if a placeholder is left unfilled or a key is not used.
3. Send `prompt.txt` to the CLI (see `tooling.yaml`). The same file works for agy and Codex.

Recommended values for lesson images:

- **ASPECT_RATIO:** `3:2`. On a 390px phone a 3:2 image is about 260px tall, which leaves room for the diagram. 16:9 gives less height for the same width, and 1:1 takes more vertical space than most lessons can spare.
- **TEXT_POLICY:** list every exact string that should appear in `KEY_ELEMENTS` (including banner title, subtitle, card labels, table values, and bottom strip), and say that they are the only text allowed. Keep each label short and avoid embedding multi-line code blocks inside images (render code in the lesson's `<Code>` component instead). View the result and check each label's spelling.
- **REFERENCE_IMAGE:** Copy `skills/write-web-lesson/references/infographic-style-ref.webp` into your image scratch folder (for example `<scratch>/style-ref.webp`) and pass that absolute scratch path here so sandboxed CLIs (`agy --sandbox --add-dir "$PWD"` and `codex exec --sandbox workspace-write` run from `<scratch>`) can read it. Use it for visual style only (layout, palette, card shapes, typography), never its Python/DataFrame subject matter. Use `None` only if you intentionally want a different visual style.
- **OUTPUT_PATH:** an absolute path in the scratch folder, for example `<scratch>/<name>.png`. The image is converted to WebP afterwards.

Learned from the next-token tests (these shaped the template):
- List every word that must appear in KEY_ELEMENTS: token words, candidate words, the output word, and each box or chip name. A box name left out of the list did not appear in the first images.
- Name the layout in VISUAL_RELATIONSHIPS, for example "left to right", so the composition matches the lesson.
- Say that the listed words are the only text allowed. Without that, a generator added extra text such as "AI model".
- Check the result against the list. If a word is missing or misspelled, regenerate once and view it again.
- Codex and agy both followed the list when it was complete. Where they differed, Codex rendered text more legibly and agy kept the layout more compact.

<!-- PROMPT START -->

# Educational Illustration Generator

You are an expert educational illustrator, instructional designer, and visual communication specialist creating illustrations for a mobile-first Generative AI learning platform.

## INPUT PARAMETERS

- **TOPIC:** {{TOPIC}}
- **LEARNING_OBJECTIVE:** {{LEARNING_OBJECTIVE}}
- **VISUAL_DESCRIPTION:** {{VISUAL_DESCRIPTION}}
- **KEY_ELEMENTS:** {{KEY_ELEMENTS}}
- **VISUAL_RELATIONSHIPS:** {{VISUAL_RELATIONSHIPS}}
- **TECHNICAL_CONSTRAINTS:** {{TECHNICAL_CONSTRAINTS}}
- **AUDIENCE:** {{AUDIENCE}}
- **ASPECT_RATIO:** {{ASPECT_RATIO}}
- **OUTPUT_PATH:** {{OUTPUT_PATH}}
- **TEXT_POLICY:** {{TEXT_POLICY}}
- **REFERENCE_IMAGE:** {{REFERENCE_IMAGE}}

## TASK

Generate ONE polished, technically accurate educational illustration explaining {{TOPIC}}.

You MUST use an available image-generation tool to create the actual illustration.

Do not substitute programmatically drawn SVGs, CSS graphics, Mermaid diagrams, stock images, placeholders, or ASCII art.

Use the environment's available image-generation capability, regardless of the CLI, model, or tool provider.

If no image-generation capability is available, report that limitation instead of fabricating an output.

## EDUCATIONAL OBJECTIVE

The illustration must help {{AUDIENCE}} understand:

{{LEARNING_OBJECTIVE}}

Visualize the following:

{{VISUAL_DESCRIPTION}}

Essential visual elements:

{{KEY_ELEMENTS}}

Relationships, information flow, hierarchy, or sequence:

{{VISUAL_RELATIONSHIPS}}

Technical correctness requirements:

{{TECHNICAL_CONSTRAINTS}}

Favor conceptual accuracy and clarity over decoration.

## DESIGN SYSTEM

Infographic layout structure (3-band pastel card):
- Top band: a soft-lavender rounded header banner containing a short bold title and a one-line subtitle, using only exact strings listed in `KEY_ELEMENTS`.
- Middle band: the main concept flow arranged cleanly inside pastel semantic cards connected by crisp directional arrows. Do not embed multi-line code blocks; keep labels short and scannable.
- Bottom band: a full-width soft-amber or cream reinforcement strip holding one concise takeaway that reinforces the same single concept — an everyday analogy, a one-line key takeaway, or a single short valid-vs-error contrast (green check vs red X) when the middle band does not already show a separate comparison. Use only exact strings listed in `KEY_ELEMENTS`; if `KEY_ELEMENTS` provides no text for a band, omit that band's text rather than inventing copy.

Visual style:
- Premium 2D vector-style educational illustration.
- Clean, modern, minimal, visually engaging.
- Rounded geometric shapes and soft shadows.
- Subtle depth without excessive gradients.
- Professional instructional design aesthetic.
- Light neutral background.
- High contrast and generous negative space.
- Consistent shapes, line weights, colors, and visual hierarchy.

Semantic color palette (use soft pastel tints for card fills and the hex accents for icons, borders, arrows, and highlights):
- Soft blue / cyan tint (accent `#06B6D4` / `#3B82F6`): inputs, source data, prompts, context.
- Soft lavender / indigo tint (accent `#4F46E5`): header banner, AI models, operations, transformations (with minimal icons such as gears).
- Soft green / emerald tint (accent `#10B981`): valid outputs, results, completed actions.
- Soft red / rose tint (accent `#EF4444`): errors, invalid cases, warnings.
- Soft amber / cream tint (accent `#F59E0B`): bottom takeaway, analogy, or reinforcement strip.
- Slate `#0F172A`: text and outlines.
- Off-white `#F8FAFC`: canvas background.

Use color consistently across all educational illustrations.

If {{REFERENCE_IMAGE}} is a file path (not `None`), treat it strictly as a visual style reference: match its 3-band layout, pastel palette, rounded card shapes, arrow styling, typography, and spacing, while keeping 100% of the text, data, icons, and subject matter specific to {{TOPIC}} and {{KEY_ELEMENTS}} (never copy words, tables, or domain content from the reference image).

## MOBILE-FIRST COMPOSITION

Target aspect ratio: {{ASPECT_RATIO}}

The SAME image will be displayed on mobile, tablet, and desktop.

Primary target:
360–430 CSS pixels wide.

Composition rules:
- Design for readability at 390px width (about 260px tall at 3:2).
- Keep generous outer margins around all three bands so no text or card sits flush against the image boundaries.
- Prefer one dominant visual flow in the middle band with at most three major visual groups where possible.
- Keep top-banner subtitles and bottom-strip takeaways to one short, scannable line.
- If a card includes a mini-table, keep it compact (at most 3–4 short columns and 3–5 short rows with brief values); if the data is denser, simplify to label chips rather than shrinking text.
- Use large recognizable objects.
- Make arrows, connections, and relationships immediately understandable.
- Avoid dense information, tiny objects, and crowded layouts.
- Ensure all educational content remains visible when scaled down.
- Do not rely on cropping for responsive display.
- Maintain generous spacing between all elements.

Prioritize visual legibility over the number of details.

## TEXT POLICY

Follow: {{TEXT_POLICY}}

Default behavior:
- Embed text only for the exact quoted strings listed in KEY_ELEMENTS (surrounding unquoted prose in KEY_ELEMENTS is visual/layout guidance and must not be rendered as text). Every listed quoted string must appear exactly as written. A string may appear more than once where the concept needs it (for example a candidate that is also the output). No other words may appear.
- Communicate concepts through objects, connections, and visual metaphors; use text for the listed quoted strings only.
- Label each listed element (boxes, chips, bars, outputs) with its listed quoted string.
- Never include lengthy explanations, paragraphs, or tiny annotations.
- Avoid unreliable image-generated code or mathematical expressions.
- Do not generate watermarks, logos, or decorative captions.

## QUALITY REQUIREMENTS

The illustration must:
1. Teach a single clear concept.
2. Be technically accurate.
3. Remain understandable on a mobile screen.
4. Use an unambiguous visual hierarchy.
5. Have consistent visual styling.
6. Contain no unnecessary decorations.
7. Have no cropped educational elements.
8. Be suitable for reuse on desktop without modification.
9. Be visually clear without requiring extensive accompanying text.

## GENERATION AND DELIVERY

1. Interpret all input parameters.
2. Select the most suitable educational visual structure.
3. Compose a clear, mobile-first illustration.
4. Invoke the available image-generation tool.
5. Inspect the generated result if inspection is supported: check that every word listed in KEY_ELEMENTS appears exactly as written and that no other text appears.
6. Regenerate or refine if major issues are identified and the tool supports it.
7. Save or copy the generated image to:

{{OUTPUT_PATH}}

8. Confirm the output file exists before reporting success.
9. Report the final path and a concise descriptive alt text.

Do not generate multiple variations unless explicitly requested.

## FINAL INSTRUCTION

Generate the actual illustration now.

Prioritize:
Educational clarity > Technical accuracy > Mobile readability > Visual consistency > Decoration.
