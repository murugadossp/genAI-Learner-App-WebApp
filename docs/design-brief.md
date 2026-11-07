# GenAI learning studio

The maintained implementation guide is in [docs/design](design/README.md), including the full design system, separate light/dark theme references, and a new-page guide. This file retains the original brief and rationale.

## Enhanced design prompt

Create a fresh, responsive learning studio for engineers and curious beginners learning AI. Cover foundations through Python, mathematics, LLM internals, retrieval, agents, LangGraph, and systems engineering. Use the existing projects as curriculum references, not visual templates. Author web explanations independently with more depth, wide diagrams, engineering examples, and interactive experiments.

The experience should feel clear, capable, and quietly playful. Use warm neutral backgrounds, dark ink, cobalt actions, restrained green/amber accents, and geometric visual explanations. Give reading comfortable space. Let experimentation and useful feedback supply the playfulness. Establish reusable tokens, navigation patterns, cards, and a data-driven catalog that can grow without redesigning every page.

Connect a public landing page, learner home, course outline, and complete sample lesson. Make the main actions functional with local demo state. Use plain HTML, CSS, and JavaScript; no build or external runtime dependencies. Keep initial assets below 500 KB. Support keyboard navigation, light/dark themes, reduced motion, and responsive layouts.

Deliver on a dedicated branch in `genAI-Learner-App-WebApp` as an unmerged review PR. Do not deploy or change learner publication status.

See [design-system.md](design/design-system.md) for the canonical layout, breakpoint, and component rules.

## Design decisions

- System sans-serif typography keeps loading immediate and the interface familiar. Geometric blocks and a manipulable prediction preview provide visual character.
- Landing introduces the learning method; home supports return visits; a course provides sequence; the lesson gives reading and experiments most of the space.
- Course cards are driven by one collection of metadata; visual roles use CSS tokens. This demonstrates UI scalability without committing to production infrastructure.
- Canonical sample identity: `c2-02`. The sample probability distributions and chosen sequence are hand-authored simulations, not model outputs.

## References and boundaries

[Brilliant](https://brilliant.org/ai/) illustrates learning through visual experimentation. [Boot.dev](https://www.boot.dev/paths/backend) illustrates structured paths toward engineering competence. These inform learning principles, not copied styling or assets.

The source curriculum includes AI Foundations, How GenAI Works, prompting, machine learning, evaluation, neural networks, multimodal AI, RAG, tools and agents, AI feature design, operations, responsible AI, Python, and mathematics. The catalog groups representative topics; it does not claim to implement every course.

Full curriculum authoring, account management, payments, database integration, production framework choice, and deployment remain outside this mockup.

## Wide lesson prototype

The sample lesson expands its three-stage generation experiment beyond the prose width. Context, model, and next-token distribution run horizontally when space permits and stack vertically on smaller screens. Expand workspace opens a native modal dialog with the same lab DOM node, preserving simulation state on return. The modal includes a theme toggle and an explicit Return to lesson control; native Escape dismissal also restores the lab. Both modes inherit the same light/dark semantic tokens.

This is a lesson-layout prototype only. Define the reusable web lesson-authoring workflow after the owner approves the mockup.

Knowledge checks use a visually distinct Try it yourself card with a question legend, native radio choices, explicit selection instructions, and a separate Check answer action. Feedback appears only after submission; learners can change their answer and retry. The card uses semantic theme tokens in both light and dark modes.
