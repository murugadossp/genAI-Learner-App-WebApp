# LangGraph content into Chapter 9 (Tools and Agents)

Status: plan, revised after Codex plan review rounds 1 and 2 (six findings each, all addressed below). Lesson `c9-02` is built and published (PRs #48 and #54). `c9-04`, `c9-05` and `c9-06` are not started.
Source: `~/projects/llm-concepts` (LangGraph standalone library, `apps/web/public/library/langgraph/`, and `src/content/chapters/` MDX). The plan records which statements come from the source headings and which are additions. Reviewers without access to that project should judge against the headings listed in section 5.
Target: `src/lessons/genai-basics/c9-NN/` in this repo, curriculum Chapter 9 "Tools and Agents Fundamentals".

## 1. Decisions

| Area | Decision | Why |
| --- | --- | --- |
| Start | Chapter 9 course page comes from the generic chapter pages in PR #49 (merged). No hand-written Chapter 9 page | `write-web-lesson` says not to build a lesson in a chapter with no course page; #49 provides one from curriculum data |
| Lesson scope | Four lessons: `c9-02`, `c9-04`, `c9-05`, `c9-06` | Each maps to a curriculum outcome and to a source. The agent loop (`c9-03`) has no direct source: the fundamentals material is a graph of nodes, not a loop |
| Framework | Lessons teach the curriculum outcome first. LangGraph is the worked example, not the subject | The curriculum is framework-neutral |
| Images | Generated WebP images, as in c9-02. Its first wide images had labels too small on a phone and were replaced by code-drawn SVG; the owner then asked for generated images, which were redone in portrait or square layouts with large labels. Generation uses `agy` with an explicit `generate_image` call from a scratch folder | Legibility at 390 px; user instruction for generation |
| Reuse | Use the source's concepts, quiz questions and worked examples as reference only; write new wording for each lesson. Rewrite each lab in React on the shared `LessonFrame`, `Check` and tokens. Do not copy the source CSS or Google Fonts | Lessons must use `app/tokens.css` |
| Reviews | Plan and content reviews use Codex. Rounds run when the usage limit allows | Codex is the reviewer named in the lesson skill |
| Publication | Every new lesson starts as `draft`. Nothing is published without an instruction. `c9-02` was published on instruction (PR #54) | AGENTS boundaries |
| Provenance | Content is re-authored for the web. Each report's fidelity log names the source file it was adapted from | Keeps verified and invented claims separate |

## 2. Shared prerequisite (superseded by PR #49)

- The first version of this branch added a hand-written Chapter 9 page, route and `.gitignore` line. That was removed from this branch (commit `437554f`).
- PR #49 (`course-pages-general`, merged) replaces per-chapter pages with one generic chapter page. It generates a page for any chapter with web lessons, with copy from the curriculum.
- Lessons in this plan depend on #49. PR #48 (`c9-02`) was merged to `main` after #49.
- `LessonFrame` needs no change. Lessons pass their own `chapter={{ label, href }}` (see `c1-01`).
- Not changed: `src/studio/Course.tsx` (still chapter 2 at `/course`).

#49 is merged, so `c9-04` to `c9-06` can rely on the generic Chapter 9 page.

## 3. Mapping

Statements about a source come from the headings in section 5. Anything not in those headings is marked as an addition.

| Curriculum lesson | Outcome (from `curriculum.json`) | LangGraph source | Action |
| --- | --- | --- | --- |
| `c9-01` Tool calling and structured actions | Model proposes, software validates and executes | none direct | Not in this plan. Gap |
| `c9-02` Workflows versus agents | Fixed steps versus model-selected next actions | Ticket routing (workflow half: shared path, one conditional branch) | **Built and published.** The agent-loop and combined examples are additions, not from the source |
| `c9-03` The agent loop | Goals, observations, decisions and actions | Fundamentals (partial). The source is a graph, not a loop | Deferred |
| `c9-04` Agent state, memory and planning | State, memory, plans and weights differ | Contract review: state schema and checkpointing. Plans and weights are not in the source headings | **Build.** Plans and weights are additions |
| `c9-05` Permissions and approval gates | Action scope and approval match risk | Contract review: pause for a human. Permission boundaries are not in the source headings | **Build.** Permission boundaries are an addition |
| `c9-06` Failure recovery and safe stopping | Retry only when safe; stop, ask or compensate | Resilient workflows: retry-style failure modes and fallbacks. Loop caps are in the contract-review headings. Compensation, idempotence and retry limits are not | **Build.** Compensation, idempotence and retry limits are additions |
| `c9-07` Evaluating agents across runs | Representative runs and failure cases | none (the multi-agent case study is only loosely related) | Gap |

## 4. Not covered: multi-agent content

These source chapters have no curriculum entry, so they cannot be lessons yet. They need entries in the content repo first (`genAI-Learner-App`), then a snapshot refresh with `scripts/sync-curriculum.py`.

- `langgraph-multi-agent-intro.html`
- `langgraph-coordinator-pattern.html`
- `langgraph-specialist-team-pattern.html`
- `langgraph-event-driven-collaboration.html`
- `langgraph-advanced-coordination.html`
- `langgraph-pattern-selection.html`
- `case-study-multi-agent-research.html`, `case-studies.html`

## 5. Source headings (copied from the LangGraph pages)

These are the only source statements the lessons may cite as "from the source". Other content is an addition and must be labelled as one.

- **Contract review:** What LangGraph actually is (nodes, edges, state); Nodes, edges, and conditional logic; Run the workflow, step by step; State schema, reducers, and checkpointing (checkpointing = durable memory; status as a state machine); Make every decision auditable; Guardrails: loops, limits, and humans (cap the loop; pause for a human, don't abandon).
- **Fundamentals and quiz:** state schema; nodes and edges; conditional edges and routing; visibility and debugging; node-based design and scalability.
- **Ticket routing:** classify, assess urgency, route; shared state; four focused nodes; one shared path with one branch; a coded conditional edge.
- **Resilient workflows:** external API failure; data quality issue; processing timeout; a fallback is a planned downgrade; if you can't see the failure, you can't fix it.

## 6. Reuse inventory

| Source | Used for | Reuse |
| --- | --- | --- |
| `langgraph-ticket-routing.html` | `c9-02` | Ticket example, the workflow's shared path and coded branch |
| `langgraph-contract-review.html` | `c9-04`, `c9-05` | Run walkthrough, state schema, checkpointing, human pause |
| `langgraph-resilient-workflows.html` | `c9-06` | Failure modes, planned downgrade, visibility of failures |
| `langgraph-fundamentals-quiz.html` | Quick checks | Question ideas only; wording is new and re-checked |
| `llm-concepts/src/content/chapters/*.mdx` | Background only | Not needed for these four lessons |
| `multi-agent-series.js` | Reference only | Rewrite, do not copy |
| `genai-basics/c2-09/images/*.png` | Style reference | Existing lesson images show house style |

## 7. Lesson outlines

Each lesson: one short section per concept, a worked example, one everyday example from outside the running example, a "try it in this order" lab, a Check, and a takeaway. Each lab item states every fact needed to answer it, so the answer is unique.

### c9-02 Workflows versus agents (published, PRs #48 and #54)

- Running example: a support ticket.
- Sections: who picks the next step; a workflow (predefined steps that can branch on coded rules); an agent loop (the model picks each step); a coded branch is still a workflow; many systems mix the two.
- Lab: five systems, each labelled workflow, agent loop or combination.
- Built with generated WebP images (hero, workflow, agent loop, combined). Verification and review status are in `docs/lesson-reports/genai-basics/c9-02.md`.

### c9-04 Agent state, memory and planning

- Running example: one contract review run, from upload to decision.
- Sections:
  - **State:** what the run currently holds. Source: state schema.
  - **Memory:** has two lifetimes. A checkpoint lets the same run resume after a pause or failure. Stored memory can also carry information to later runs. Source: "checkpointing = durable memory"; the second lifetime is an addition.
  - **Plan:** what the run intends to do next. Addition.
  - **Weights:** the model's parameters; one run does not change them. Addition.
- Prerequisites: `c9-02` (published). The curriculum lists `c9-03` as the prerequisite; it is deferred, so as a deliberate deviation this lesson defines "step" and "loop" in its own text.
- Lab: the learner classifies each piece of information by role (what the run knows now, what it intends next, what it keeps for later, or the model's parameters) and by lifetime (this run only, resumable after a pause, or carried to later runs). A piece can fit more than one role; the item then says so and the learner selects every role that applies. Reasons are not typed: the feedback for each choice gives the reason. Each item states the facts the label depends on.

### c9-05 Permissions and approval gates

- Running example: a contract reply that is drafted, then sent.
- Sections:
  - **Permission boundary:** which actions a given actor may perform at all. Addition.
  - **Reversible actions** (draft, label) and **consequential actions** (send, delete). Addition.
  - **Approval gate:** the run pauses for a person before a consequential action. Source: pause for a human.
- Prerequisites: the curriculum lists `c9-01` and `c9-02`. `c9-02` is published. `c9-01` is not built (a gap in this plan), so the lesson defines "action" in one sentence.
- Lab: each action gives its consequence and which actors may perform it. A written approval policy is shown with the item. The learner decides whether and where a gate belongs, and names the fact that decided it.

### c9-06 Failure recovery and safe stopping

- Running example: a document-processing step that calls an API and writes to a store.
- Prerequisites: the curriculum lists `c9-03` and `c9-05`. `c9-05` is built first. `c9-03` is deferred, so as a deliberate deviation the lesson defines "step" and "loop" in its own text.
- Sections:
  - **Retry** only when a repeat has no unwanted effect, for example because the action is idempotent. An action that may already have completed needs a status check first. Source: retry-style failure modes; the idempotence rule is an addition.
  - **Fallback** as a planned downgrade when one is defined. Source: planned downgrade.
  - **Compensate:** undo or offset an earlier write that must not stand. Addition.
  - **Ask** a person when the run cannot choose safely but a person can supply the decision. Source: pause for a human.
  - **Stop** when a loop cap is reached or no safe option exists. Loop caps: source (contract review: cap the loop). Numerical retry limits: addition.
  - The curriculum interaction names retry, ask, compensate and stop. Fallback is added from the source.
- Recovery policy shown with the lab: retry only when a repeat is safe; check status after a timed-out write before any retry; use a fallback when a planned downgrade exists; compensate when an earlier write must be undone; ask when a person can supply a decision the run cannot make safely; stop when a cap is reached or no safe option exists.
- Lab: six scenarios, one for each policy step, each stating its facts (side effects, whether completion can be checked, whether a fallback exists, whether an earlier write must be undone, whether a person is available to decide, and whether a cap was reached). Only one policy step applies to each scenario, and the learner applies it.

## 8. Verification plan (per lesson)

Playwright at 390, 768 and 1440 px, light and dark. Checks: lab interaction, Check wrong-answer feedback and retry, theme switch keeps lab state, diagram titles and text, no horizontal page overflow. Production gating test: draft returns 404, published returns 200.

## 9. Effort (estimate)

- Shared prerequisite: done by #49 (merged).
- Each lesson: medium. Includes plan review, diagrams, build, Playwright, content review rounds, report and draft PR.
- Multi-agent content is blocked on curriculum entries.

## 10. Gates and status

| Item | Status |
| --- | --- |
| Shared Chapter 9 page | Done by #49 (merged) |
| `c9-02` | Merged (PR #48) and published (PR #54). Content review: round 1 found four items, round 2 found one, both fixed. Rounds 3 and 4 clean, so the gate was met |
| Plan review round 1 (Codex) | Done: six findings, all addressed |
| Plan review round 2 (Codex) | Done: six findings (c9-04, c9-05, c9-06 lab design, prerequisites, loop-cap attribution). Addressed in this revision; round 3 not yet run |
| `c9-04`, `c9-05`, `c9-06` | Not started |
| Publication | `c9-02` published (PR #54). No other Chapter 9 lesson is published |

## 11. Open questions

1. `c9-02` is already published on its own. Should `c9-04`, `c9-05` and `c9-06` each be published after review, or stay draft until all three are ready?
2. Should the multi-agent entries be requested from the content repo now, or after these four lessons?
3. Chapter 9 copy comes from curriculum data via #49. Is that acceptable, or should a hand-written intro be added to the generic page?
