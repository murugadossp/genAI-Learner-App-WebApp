# Topic-neutral web lesson template

Use this as a planning and implementation scaffold. Replace every bracketed field with lesson-specific content. Choose the number and order of sections based on the curriculum; remove parts that do not serve the topic. Do not carry bracketed fields into a finished lesson.

## Learning design

- **Module and lesson ID:** [registry key and canonical slug]
- **Learner outcome:** [what the learner can explain or do]
- **Prior knowledge and boundary:** [what is assumed and what belongs elsewhere]
- **Misconception:** [specific incorrect idea the lesson addresses]
- **Running example:** [one coherent, independently authored example]
- **Interaction:** [learner action → observable change → insight]
- **Truth and fidelity:** [source for facts; invented values, rules, or limitations to disclose]
- **Knowledge check:** [question testing the outcome; each wrong answer and its specific feedback]
- **Takeaway:** [short transferable idea]

## Suggested lesson flow

1. **Orient:** explain the idea in plain language and why it matters.
2. **Explore:** introduce an interactive visual or exercise with a clear learner action and observable result. Include nearby simulation disclosures where needed.
3. **Explain:** trace the mechanism through the same example; include appropriate technical detail, boundaries and a practical connection.
4. **Check:** use the shared local quiz with one defensible answer, targeted feedback for each wrong choice and a retry.
5. **Take away:** summarize the idea in a distinct card and, when appropriate, link to the next available lesson.

## Repository shape

Confirm the current component APIs and route generation before use. A typical folder is:

```text
src/lessons/<module>/<lessonId>/
  meta.json             # canonical ID, module, title, draft web status, ordered section IDs
  Lesson.tsx            # topic-specific content and shared lesson frame
  <Interactive>.tsx     # client component only where interaction requires it
  lesson.module.css     # optional topic-specific layout using shared tokens
```

Metadata must match the registry's module and slug rules, and its ordered section IDs must match the rendered sections. Check the current `LessonFrame` context and `Check` props before implementing. The shared frame must show the correct module/chapter; adapt it when needed. Generated routes and generated lesson manifests are build outputs, not authoring inputs.

## Review before delivery

- The lesson meets its curriculum outcome without silently expanding into adjacent topics.
- Every example and visual is original for this topic, technically consistent, and explicit about its fidelity; no copied lesson prose or answers.
- Interactive controls are labelled and usable with keyboard and touch. Test reset, wrong feedback, retry, focus, and state preservation where applicable.
- The worked example is plain, needs no side skill, states every constraint it relies on, and has a unique answer. Prose, interaction, image text and alt text use the same terms and example values.
- A worked example appears before the interaction, and the interaction has ordered "try this" steps.
- Claims that could not be checked against a primary source are hedged in the lesson and listed as unverified in the report.
- Each concept has its own short section and shows where it sits among the others; terms are explained before an interaction uses them.
- Paragraphs are one or two sentences, steps are lists, and every definition, example and practice item uses the same criterion for the categories.
- Practice items state the facts needed to answer them, and explanations are announced to screen readers.
- Check sections and metadata in order, contrast in both themes, and local overflow at mobile, tablet and desktop widths.
- The plan, content and final reviews were run and logged, and every claim that could not be verified is marked unverified.
- Run the repository's actual formatting, build, browser and production-gating commands. Record real results and separately flag any manual browser or screen-reader review not performed.
