"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "../../../components/ThemeToggle";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import meta from "./meta.json";
const sections = meta.sections.map(({ id, title }) => [id, title]);
const stages = [
  {
    text: "The sky is",
    words: [
      ["blue", 62],
      ["clear", 25],
      ["dark", 13],
    ],
  },
  {
    text: "The sky is blue",
    words: [
      ["today", 50],
      [".", 35],
      ["and", 15],
    ],
  },
  {
    text: "The sky is blue today",
    words: [
      [".", 80],
      ["because", 15],
      ["and", 5],
    ],
  },
  { text: "The sky is blue today.", words: [] },
];
function Menu({
  close,
  select,
}: {
  close: () => void;
  select: (id: string) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  return (
    <dialog
      ref={ref}
      className="menu-dialog"
      aria-labelledby="app-menu-title"
      onClose={close}
    >
      <div className="dialog-heading">
        <h2 id="app-menu-title">Lesson navigation</h2>
        <button
          onClick={() => ref.current?.close()}
          aria-label="Close navigation"
        >
          ✕
        </button>
      </div>
      <div className="app-menu-links">
        <Link href="/course">← Learning path</Link>
        {sections.map(([id, title]) => (
          <button key={id} onClick={() => select(id)}>
            {title}
          </button>
        ))}
      </div>
    </dialog>
  );
}
export function LessonInteractive() {
  const [step, setStep] = useState(0),
    [expanded, setExpanded] = useState(false),
    [menu, setMenu] = useState(false),
    [complete, setComplete] = useState(false);
  const expand = useRef<HTMLButtonElement>(null),
    workspace = useRef<HTMLDivElement>(null);
  useEffect(() => {
    try {
      setComplete(localStorage.getItem("genai-demo-complete") === "true");
    } catch {}
  }, []);
  useEffect(() => {
    if (!expanded) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    workspace.current?.focus();
    function key(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setExpanded(false);
        requestAnimationFrame(() => expand.current?.focus());
      }
      if (e.key === "Tab" && workspace.current) {
        const items = Array.from(
          workspace.current.querySelectorAll<HTMLElement>(
            "button:not(:disabled),a[href],input:not(:disabled)",
          ),
        );
        if (!items.length) return;
        const first = items[0],
          last = items[items.length - 1];
        if (
          e.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === workspace.current)
        ) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = old;
      document.removeEventListener("keydown", key);
    };
  }, [expanded]);
  function focusSection(id: string) {
    setMenu(false);
    requestAnimationFrame(() => {
      const el = document.querySelector<HTMLElement>(`#${id} h2`);
      el?.focus();
      el?.scrollIntoView({ behavior: "smooth" });
    });
  }
  const s = stages[step];
  return (
    <>
      <LessonFrame
        embedded
        footer={false}
        number="02"
        title="One token at a time."
        lead="A language model doesn’t write an answer all at once. It repeatedly predicts what could come next."
        toolbar={
          <div>
            <button onClick={() => setMenu(true)}>Course contents</button>
            <button onClick={() => setMenu(true)}>In this lesson ↓</button>
          </div>
        }
      >
        <section id="idea">
          <h2 tabIndex={-1}>A prediction, then another.</h2>
          <p>
            Imagine the model sees <strong>“The sky is”</strong>. It assigns
            probabilities to possible next tokens. “Blue” might receive a high
            probability, but “clear” or “dark” could also fit. The model
            produces scores over its vocabulary; these become a probability
            distribution.
          </p>
          <p>
            A decoding rule chooses a token. That token is added to the context,
            and the model makes a new prediction using the updated sequence.
            This repeated process is called{" "}
            <strong>autoregressive generation</strong>.
          </p>
          <div className="callout">
            <strong>The key distinction:</strong> a probable continuation is
            text that fits the context. It is not necessarily a true statement
            about the world.
          </div>
        </section>
        <section id="experiment">
          <h2 tabIndex={-1}>Watch the context grow.</h2>
          <p>
            Step through a tiny illustrative sequence. Notice that each choice
            changes the context for the next prediction.
          </p>
          <div className={expanded ? "app-workspace-overlay" : undefined}>
            <div
              className={expanded ? "app-workspace" : undefined}
              ref={workspace}
              role={expanded ? "dialog" : undefined}
              aria-modal={expanded ? true : undefined}
              aria-label={expanded ? "The generation loop" : undefined}
              tabIndex={expanded ? -1 : undefined}
            >
              {expanded && (
                <div className="dialog-heading">
                  <div>
                    <div className="eyebrow">
                      Interactive workspace · simulation
                    </div>
                    <h2>The generation loop</h2>
                  </div>
                  <div className="dialog-controls">
                    <ThemeToggle label="◐ Theme" />
                    <button
                      onClick={() => {
                        setExpanded(false);
                        requestAnimationFrame(() => expand.current?.focus());
                      }}
                    >
                      ← Return to lesson
                    </button>
                  </div>
                </div>
              )}
              <div className="lab" id="generation-lab">
                <div className="lab-head">
                  <strong>01 / The generation loop</strong>
                  {!expanded && (
                    <button ref={expand} onClick={() => setExpanded(true)}>
                      Expand workspace ↗
                    </button>
                  )}
                </div>
                <div className="lab-body">
                  <div className="generation-flow">
                    <div className="flow-stage">
                      <span className="eyebrow">01 / Context</span>
                      <h3>Read the sequence</h3>
                      <div className="sentence" aria-live="polite">
                        {s.text}
                      </div>
                      <p className="micro">
                        The prompt plus everything generated so far.
                      </p>
                    </div>
                    <span className="flow-arrow" aria-hidden="true">
                      →
                    </span>
                    <div className="flow-stage model-stage">
                      <span className="eyebrow">02 / Model</span>
                      <h3>Score what comes next</h3>
                      <div className="model-visual" aria-hidden="true">
                        ⠿ → ⠿ → ⠿
                      </div>
                      <p className="micro">
                        Learned weights produce scores. Softmax turns scores
                        into probabilities.
                      </p>
                    </div>
                    <span className="flow-arrow" aria-hidden="true">
                      →
                    </span>
                    <div className="flow-stage">
                      <span className="eyebrow">03 / Choose &amp; append</span>
                      <h3>One possible continuation</h3>
                      {s.words.length ? (
                        s.words.map(([word, p]) => (
                          <div className="prob-row" key={word}>
                            <span>{word}</span>
                            <div className="bar">
                              <span style={{ width: `${p}%` }} />
                            </div>
                            <span>{p}%</span>
                          </div>
                        ))
                      ) : (
                        <p className="completion">
                          Sequence complete. Each prediction used the updated
                          context.
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="loop-caption">
                    ↳ Append the chosen token to the context. Repeat with the
                    updated sequence.
                  </div>
                  <div className="lab-actions">
                    <button
                      className="button small"
                      disabled={step === 3}
                      onClick={() => setStep(step + 1)}
                    >
                      {step === 3
                        ? "Sequence complete ✓"
                        : "Choose next token →"}
                    </button>
                    <button onClick={() => setStep(0)}>↻ Reset</button>
                    <span className="micro">{step} of 3 steps</span>
                  </div>
                  <p className="micro lab-disclosure">
                    Hand-authored probabilities and preset choices, not a real
                    model or tokenizer. Real models score a much larger
                    vocabulary; tokens can be word fragments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="mechanics">
          <h2 tabIndex={-1}>What the loop is doing.</h2>
          <p>
            In a real system, the model outputs scores called <em>logits</em>. A
            softmax operation converts those scores to probabilities. A decoding
            strategy can choose the highest-probability token or sample from the
            distribution.
          </p>
          <pre>
            <code>{`# Illustrative pseudocode — not executable here
context = tokenize(prompt)
for _ in range(max_new_tokens):
    logits = model(context)
    probabilities = softmax(logits[-1])
    token = sample(probabilities)
    if token == end_token:
        break
    context.append(token)`}</code>
          </pre>
          <p>
            The next call includes the new token. Generating a longer answer
            repeats this loop, subject to stopping rules and context limits. The
            example above omits implementation details such as caching.
          </p>
          <div className="callout">
            <strong>Engineering connection:</strong> streaming exposes this
            incremental generation to the user. Seeing text appear early
            improves perceived responsiveness even while the rest of the answer
            is still being generated.
          </div>
        </section>
        <Check
          id="check"
          title="Likely doesn’t mean verified."
          question="A model assigns a high probability to the next token in a factual claim. What can you conclude?"
          options={[
            "The claim has been checked against a trusted source.",
            "That token is a likely continuation given the model and context.",
            "The model is retrieving an exact sentence from its training data.",
          ]}
          correct={1}
          explanation="The probability reflects a likely continuation, not a fact-check. You still need evidence to verify the claim."
          wrongFeedback={[
            "Prediction alone does not check a trusted source.",
            "",
            "A prediction does not prove that an exact sentence was retrieved from training data.",
          ]}
        />
        <section id="takeaway">
          <h2 tabIndex={-1}>Take this with you.</h2>
          <p>
            Generation is a loop:{" "}
            <strong>predict → choose → append → repeat</strong>. The
            distribution describes possible continuations, and the decoding
            strategy selects among them. Neither step alone verifies a claim.
          </p>
        </section>
        <div className="end-lesson">
          <Link className="text-link" href="/course">
            ← Back to the learning path
          </Link>
          <button
            className="button"
            onClick={() => {
              setComplete(true);
              try {
                localStorage.setItem("genai-demo-complete", "true");
              } catch {}
            }}
          >
            {complete ? "Completed ✓" : "Mark sample complete ✓"}
          </button>
        </div>
        <p className="micro">
          Completion is stored on this browser only. This is a design preview.
        </p>
      </LessonFrame>
      <nav className="mobile-lesson-bar" aria-label="Lesson navigation">
        <button onClick={() => setMenu(true)}>☷ Contents</button>
        <button onClick={() => setMenu(true)}>≡ Sections</button>
        <button
          onClick={() => {
            const next = sections.find(([id]) => {
              const top = document
                .getElementById(id)
                ?.getBoundingClientRect().top;
              return top !== undefined && top > 100;
            });
            if (next) focusSection(next[0]);
          }}
        >
          Next section ↓
        </button>
      </nav>
      {menu && <Menu close={() => setMenu(false)} select={focusSection} />}
    </>
  );
}
