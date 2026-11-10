# Educational image prompt (CLI-agnostic)

One master prompt for every lesson illustration. It works with any CLI that can call an image-generation tool (agy, Codex, or another). Keep this file as the single standard; put topic-specific values in a JSON file and fill the placeholders with `scripts/fill_image_prompt.py`.

## How to use

1. Copy `example-values.json` (or write a new JSON file with the keys below). Every key is required.
2. Fill the template: `python3 <repo>/skills/write-web-lesson/scripts/fill_image_prompt.py values.json --out prompt.txt`. The script fails if a placeholder is left unfilled or a key is not used.
3. Send `prompt.txt` to the CLI (see `tooling.yaml`). The same file works for agy and Codex.

Recommended values for lesson images:

- **ASPECT_RATIO:** `3:2`. On a 390px phone a 3:2 image is about 260px tall, which leaves room for the diagram. 16:9 gives less height for the same width, and 1:1 takes more vertical space than most lessons can spare.
- **TEXT_POLICY:** `Minimal labels: at most three short labels (one to three words each), using exactly the label text listed in KEY_ELEMENTS. No other text, no watermark, no captions.` Lesson images carry a few key words, because the lesson prose is the source of truth; longer text is unreliable and too small on a phone. View the result and check each label's spelling.
- **REFERENCE_IMAGE:** `None`, unless you want visual consistency with an existing lesson image.
- **OUTPUT_PATH:** an absolute path in the scratch folder, for example `<scratch>/<name>.png`. The image is converted to WebP afterwards.

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

Visual style:
- Premium 2D vector-style educational illustration.
- Clean, modern, minimal, visually engaging.
- Rounded geometric shapes and soft shadows.
- Subtle depth without excessive gradients.
- Professional instructional design aesthetic.
- Light neutral background.
- High contrast and generous negative space.
- Consistent shapes, line weights, colors, and visual hierarchy.

Semantic color palette:
- Indigo #4F46E5: AI models, intelligence, inference.
- Cyan #06B6D4: data, information, context.
- Amber #F59E0B: user inputs, prompts, instructions.
- Emerald #10B981: generated outputs and completed actions.
- Slate #0F172A: text and outlines.
- Off-white #F8FAFC: background.

Use color consistently across all educational illustrations.

If {{REFERENCE_IMAGE}} is provided, use it to maintain visual consistency while preserving the accuracy of the current concept.

## MOBILE-FIRST COMPOSITION

Target aspect ratio: {{ASPECT_RATIO}}

The SAME image will be displayed on mobile, tablet, and desktop.

Primary target:
360–430 CSS pixels wide.

Composition rules:
- Design for readability at 390px width.
- Keep important objects within the central 80% of the canvas.
- Prefer one dominant illustration.
- Use at most three major visual groups where possible.
- Use large recognizable objects.
- Make arrows, connections, and relationships immediately understandable.
- Avoid dense information, tiny objects, and crowded layouts.
- Ensure all educational content remains visible when scaled down.
- Avoid placing essential information near the image boundaries.
- Do not rely on cropping for responsive display.
- Maintain generous spacing between all elements.

Prioritize visual legibility over the number of details.

## TEXT POLICY

Follow: {{TEXT_POLICY}}

Default behavior:
- Prefer no embedded text.
- Communicate concepts through objects, connections, and visual metaphors.
- When necessary, use only a few large, short labels.
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
5. Inspect the generated result if inspection is supported.
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
