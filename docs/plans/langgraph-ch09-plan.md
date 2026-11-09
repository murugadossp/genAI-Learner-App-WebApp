# LangGraph content into Chapter 9 (Tools and Agents)

Status: plan, first shared change in progress (branch `ch09/foundation`). No lesson is started yet.
Source: `~/projects/llm-concepts` (LangGraph standalone library, `apps/web/public/library/langgraph/`, and `src/content/chapters/` MDX).
Target: `src/lessons/genai-basics/c9-NN/` in this repo, curriculum Chapter 9 "Tools and Agents Fundamentals".

## 1. Decisions

| Area | Decision | Why |
| --- | --- | --- |
| Start | Shared Chapter 9 course page and route first, then lessons in the order below | Recommendation accepted; `write-web-lesson` says not to build a lesson in a chapter that has no course page |
| Lesson scope | Four lessons: `c9-02`, `c9-04`, `c9-05`, `c9-06` | Each maps to a curriculum outcome and to a LangGraph source. This changes the earlier suggestion of `c9-03`: the agent loop has no direct LangGraph source (fundamentals is a graph of nodes, not a loop). State (`c9-04`) is better covered by contract review |
| Framework | Lessons teach the curriculum outcome first. LangGraph is the worked example, not the subject. Each lesson names LangGraph once, where the example needs it | The curriculum is framework-neutral; a lesson titled "LangGraph" would not match a curriculum entry |
| Images | Generated with `agy` using `gemini-3.8-flash-medium`, not Codex. Codex stays the default for other image requests. Saved next to the lesson, viewed, and converted to JPEG about 1200 px | User instruction for this work |
| Reuse | Reuse the source's concepts, quiz questions, worked examples and SVG diagrams as reference. Rewrite each lab in React on the shared `LessonFrame`, `Check` and tokens. Do not copy the source CSS (`multi-agent-series.css`) or the Google Fonts it loads | Lessons must use `app/tokens.css`; the source uses its own palette and fonts |
| Reviews | Plan and content reviews use Codex, as the lesson skill requires. Only image generation changed | The instruction named image generation only |
| Publication | Every new lesson starts as `draft`. Nothing is pushed or published without an instruction | AGENTS boundaries |
| Provenance | The source is the author's own llm-concepts project. Content is re-authored for the web, and each report's fidelity log names the source file it was adapted from | Keeps the verified/invented split visible |

## 2. Shared prerequisite (done in this branch)

- `src/studio/CourseChapter9.tsx`: course page for Chapter 9, same pattern as `CourseChapter1` and `CourseChapterP1`. Copy is written for the chapter, not taken from the source.
- `scripts/prepare-routes.mjs`: route `app/course/chapter-9`, published only once a `genai-basics` lesson with a `c9-` ID is published (same gating as `chapter-p1`).
- `LessonFrame` needs no change. Lessons pass their own `chapter={{ label, href }}`, which is already supported (see `c1-01`).
- Not changed: `src/studio/Course.tsx` (still chapter 2 at `/course`). It is a default, not a problem for Chapter 9.

Open: the course page still has hand-written copy per chapter. A data-driven chapter page is a later change; it is not needed for these four lessons.

## 3. Mapping

| Curriculum lesson | Outcome (from `curriculum.json`) | LangGraph source | Action |
| --- | --- | --- | --- |
| `c9-01` Tool calling and structured actions | Model proposes, software validates and executes | none direct | Not in this plan. Gap |
| `c9-02` Workflows versus agents | Fixed steps versus model-selected next actions | `langgraph-ticket-routing.html` | **Build** (strong fit) |
| `c9-03` The agent loop | Goals, observations, decisions and actions | `langgraph-fundamentals-quiz.html` (partial) | Deferred. Source is a graph, not a loop |
| `c9-04` Agent state, memory and planning | State, memory, plans and weights are different things | `langgraph-contract-review.html` (state schema, checkpointing) | **Build** |
| `c9-05` Permissions and approval gates | Action scope and approval match risk | `langgraph-contract-review.html` (human pause) | **Build** |
| `c9-06` Failure recovery and safe stopping | Retry only when safe; stop, ask or compensate | `langgraph-resilient-workflows.html` | **Build** (strong fit) |
| `c9-07` Evaluating agents across runs | Representative runs and failure cases | none (`case-study-multi-agent-research.html` is only loosely related) | Gap |

## 4. Not covered: multi-agent content

These source chapters have no curriculum entry, so they cannot be lessons yet. They need entries in the content repo first (`genAI-Learner-App`), then a snapshot refresh with `scripts/sync-curriculum.py`.

- `langgraph-multi-agent-intro.html`
- `langgraph-coordinator-pattern.html`
- `langgraph-specialist-team-pattern.html`
- `langgraph-event-driven-collaboration.html`
- `langgraph-advanced-coordination.html`
- `langgraph-pattern-selection.html`
- `case-study-multi-agent-research.html`, `case-studies.html`

## 5. Reuse inventory

Source counts come from the HTML files (`svg` = inline SVG elements; `quiz` = elements with a quiz class).

| Source | Used for | Reuse |
| --- | --- | --- |
| `langgraph-ticket-routing.html` (4 SVG, 24 buttons) | `c9-02` | Ticket examples, the four-node walkthrough, the four sample tickets as lab inputs |
| `langgraph-contract-review.html` (26 SVG, 16 buttons, 1 select) | `c9-04`, `c9-05` | Step-by-step run, state schema, checkpoint idea, pause-for-human idea |
| `langgraph-resilient-workflows.html` (7 SVG, 28 buttons) | `c9-06` | Three failure modes and their plans, the "planned downgrade" idea, the four contracts |
| `langgraph-fundamentals-quiz.html` (8 SVG, 34 quiz items) | Quick checks for `c9-02`, `c9-04` | Question wording, adapted and re-checked |
| `llm-concepts/src/content/chapters/*.mdx` | Background only | Not needed for these four lessons |
| `apps/web/public/library/langgraph/multi-agent-series.js` | Reference only | Interaction logic for pause, retry and sample runs. Rewrite, do not copy |
| `genai-basics/c2-09/images/*.png` | Image style reference | Existing lesson images show the house style |

## 6. Lesson outlines

Each lesson: one short section per concept, each with one image, a worked example, one everyday example from outside the running example, a "try it in this order" lab, a Check, and a takeaway. Running examples are chosen so the answer is unique.

### c9-02 Workflows versus agents

- Running example: a support ticket arriving in a queue.
- Sections: fixed workflow (same steps every time); agent loop (the model picks the next step); when to combine them.
- Lab: four tickets. The learner sorts each as a fixed workflow, a loop, or a combination. Each ticket states the facts needed to answer.
- Images: one per concept (fixed path, model-picked path, combined path).

### c9-04 Agent state, memory and planning

- Running example: one contract review run, from upload to decision.
- Sections: state (what this run knows now); memory (what is stored for later runs); plan (what the run intends to do next); weights (the model's parameters, which do not change because of a single run).
- Lab: step through a run; the learner marks which of the four things changes at each step.
- Images: one per concept.

### c9-05 Permissions and approval gates

- Running example: a contract reply that is drafted, then sent.
- Sections: reversible actions (draft, label); consequential actions (send, delete); a gate in front of the second kind.
- Lab: a list of actions; the learner sets a gate level for each one based on its stated risk.
- Images: one per gate level.

### c9-06 Failure recovery and safe stopping

- Running example: a document-processing step that calls an API.
- Sections: retry when the action is safe to repeat; fallback when a planned downgrade is possible; stop or ask a person when neither is safe.
- Lab: three failure modes (API error, bad input, timeout). The learner picks a response for each.
- Images: one per failure mode.

## 7. Verification plan (per lesson)

Playwright at 390, 768 and 1440 px, light and dark. Checks: lab interaction, Check wrong-answer feedback and retry, theme switch keeps lab state, image rendering and alt text, no horizontal page overflow. Production gating test: draft returns 404, published returns 200.

## 8. Effort (estimate)

- Shared prerequisite: small (done in this branch, still to verify).
- Each lesson: medium. Includes plan review, four to six images (agy), build, Playwright, content review rounds, report and draft PR.
- The four lessons together are the bulk of the work. Multi-agent content is blocked on curriculum entries.

## 9. Gates and status

| Item | Status |
| --- | --- |
| Shared Chapter 9 course page and route | Written; verify with `format:check`, `typecheck`, build |
| Plan review (Codex) | Not started |
| Lesson builds | Not started |
| Image generation test (agy) | Not started |
| Content reviews, draft PRs | Not started |

## 10. Open questions

1. Should the lesson IDs `c9-02`, `c9-04`, `c9-05`, `c9-06` be published after review, or stay draft until all four are ready?
2. Should the multi-agent entries be requested from the content repo now, or after these four lessons?
3. The Chapter 9 course page copy is written by hand. Keep that for now, or add a data-driven chapter page first?
