"use client";
import { useEffect, useId, useRef, useState } from "react";
import styles from "./lesson.module.css";

type PId = "ferry" | "sum";
type Mode = "quick" | "prompted" | "reasoning";
type Show = "full" | "summary" | "none";

type Problem = {
  id: PId;
  label: string;
  text: string;
  truth: string;
  quick: string;
  promptedSteps: string[];
  promptedAnswer: string;
  promptedNote: string;
  work: { text: string; cost: number; answer: string }[];
  summary: { at: number; text: string }[];
};

const problems: Problem[] = [
  {
    id: "ferry",
    label: "Ferry puzzle (several steps, one catch)",
    text: "A ferry makes 4 trips a day and carries 18 passengers on a full trip. The first trip each day is only half full. How many passengers does it carry in 3 days?",
    truth: "189",
    quick: "216",
    promptedSteps: [
      "Each trip carries 18 passengers.",
      "4 trips × 18 = 72 passengers a day.",
      "72 × 3 days = 216.",
    ],
    promptedAnswer: "216",
    promptedNote:
      "The toy writes tidy steps, but they follow the most familiar pattern and skip the half-full trip. In real models, asking for steps often does help; it just is not a guarantee, and it is not the same as being trained to work first.",
    work: [
      {
        text: "List the facts: 4 trips a day, 18 when full, first trip half full, 3 days.",
        cost: 60,
        answer: "216",
      },
      {
        text: "First attempt: 4 × 18 × 3 = 216.",
        cost: 50,
        answer: "216",
      },
      {
        text: "Re-read the facts. The first trip carries 9, not 18, so 216 is too high. Discard it. One day is 9 + 3 × 18 = 63, and 3 days is 189.",
        cost: 90,
        answer: "189",
      },
      {
        text: "Check: 189 is less than 216 by 27, which is 3 days × 9 empty seats. That matches.",
        cost: 60,
        answer: "189",
      },
    ],
    summary: [
      { at: 1, text: "Noted the half-full first trip." },
      { at: 3, text: "Worked out one day, then three days." },
      { at: 4, text: "Checked the result." },
    ],
  },
  {
    id: "sum",
    label: "Quick sum (one step)",
    text: "What is 15 + 27?",
    truth: "42",
    quick: "42",
    promptedSteps: ["15 + 27 = 42."],
    promptedAnswer: "42",
    promptedNote:
      "A single step needs no help. Asking for steps changes the length of the reply, not the answer.",
    work: [
      { text: "Read the sum: 15 + 27.", cost: 20, answer: "42" },
      { text: "15 + 20 = 35, then 35 + 7 = 42.", cost: 30, answer: "42" },
      { text: "Check by adding 27 + 15: also 42.", cost: 30, answer: "42" },
      { text: "Nothing new to check. Answer 42.", cost: 20, answer: "42" },
    ],
    summary: [
      { at: 2, text: "Added the numbers." },
      { at: 3, text: "Checked the result." },
    ],
  },
];

const modes: { id: Mode; label: string }[] = [
  { id: "quick", label: "Quick model: answers straight away" },
  {
    id: "prompted",
    label: "Ordinary model, prompt says “show your steps”",
  },
  { id: "reasoning", label: "Reasoning model: works first, then answers" },
];
const shows: { id: Show; label: string }[] = [
  { id: "full", label: "Show the full work" },
  { id: "summary", label: "Show a short summary" },
  { id: "none", label: "Show nothing but the answer" },
];

const BASE = 8;

function run(p: Problem, mode: Mode, budget: number) {
  if (mode === "quick")
    return {
      answer: p.quick,
      cost: BASE,
      steps: [] as string[],
      note: "No intermediate text was written. The reply starts with the answer.",
    };
  if (mode === "prompted")
    return {
      answer: p.promptedAnswer,
      cost: BASE + p.promptedSteps.length * 12,
      steps: p.promptedSteps,
      note: p.promptedNote,
    };
  const used = p.work.slice(0, budget);
  const answer = used.length ? used[used.length - 1].answer : p.quick;
  const cost = BASE + used.reduce((n, w) => n + w.cost, 0);
  const note =
    p.id === "sum"
      ? "The answer was right from the start. Extra work only added cost."
      : budget < 3
        ? "Not enough work yet. The toy still holds its first guess."
        : budget === 3
          ? "Re-reading the facts caught the slip. The toy’s answer changed."
          : "The same answer, now with a check. The check cost more and changed nothing here.";
  return { answer, cost, steps: used.map((w) => w.text), note };
}

export function ReasoningLab() {
  const [pid, setPid] = useState<PId>("ferry");
  const [mode, setMode] = useState<Mode>("quick");
  const [budget, setBudget] = useState(0);
  const [show, setShow] = useState<Show>("summary");
  const [message, setMessage] = useState("");
  const uid = useId();
  const p = problems.find((x) => x.id === pid)!;
  const r = run(p, mode, budget);
  const right = r.answer === p.truth;
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const t = setTimeout(() => {
      const x = run(p, mode, budget);
      setMessage(
        `Answer: ${x.answer}. ${x.answer === p.truth ? "Matches the worked answer" : "Does not match the worked answer"}. Toy cost ${x.cost}.`,
      );
    }, 600);
    return () => clearTimeout(t);
  }, [p, mode, budget]);
  const reset = () => {
    setPid("ferry");
    setMode("quick");
    setBudget(0);
    setShow("summary");
    setMessage("Lab reset.");
  };
  const summary = p.summary.filter((x) => x.at <= budget);
  return (
    <div className="lab">
      <div className="lab-head">
        <strong>01 / Same question, three ways to answer</strong>
        <span className="pill">SIMULATION</span>
      </div>
      <div className="lab-body">
        <div className={styles.grid}>
          <div className={styles.panel}>
            <fieldset>
              <legend>Question</legend>
              {problems.map((x) => (
                <label className={styles.choice} key={x.id}>
                  <input
                    type="radio"
                    name={`${uid}-p`}
                    checked={pid === x.id}
                    onChange={() => setPid(x.id)}
                  />
                  <span>{x.label}</span>
                </label>
              ))}
            </fieldset>
            <fieldset>
              <legend>How it answers</legend>
              {modes.map((x) => (
                <label className={styles.choice} key={x.id}>
                  <input
                    type="radio"
                    name={`${uid}-m`}
                    checked={mode === x.id}
                    onChange={() => setMode(x.id)}
                  />
                  <span>{x.label}</span>
                </label>
              ))}
            </fieldset>
            <div className={styles.slider}>
              <label htmlFor={`${uid}-b`}>
                <strong>Work before answering:</strong> {budget} of 4 steps
              </label>
              <input
                id={`${uid}-b`}
                type="range"
                min={0}
                max={4}
                step={1}
                value={budget}
                disabled={mode !== "reasoning"}
                aria-valuetext={`${budget} steps`}
                onChange={(e) => setBudget(Number(e.target.value))}
              />
              <span className="micro">
                {mode === "reasoning"
                  ? "Think of this as a work limit set by the app."
                  : "Only the reasoning model uses this setting."}
              </span>
            </div>
            {mode === "reasoning" && (
              <fieldset>
                <legend>What the app shows you</legend>
                {shows.map((x) => (
                  <label className={styles.choice} key={x.id}>
                    <input
                      type="radio"
                      name={`${uid}-s`}
                      checked={show === x.id}
                      onChange={() => setShow(x.id)}
                    />
                    <span>{x.label}</span>
                  </label>
                ))}
              </fieldset>
            )}
            <p>
              <button type="button" onClick={reset}>
                Reset lab
              </button>
            </p>
          </div>
          <div>
            <p className={styles.question}>
              <strong>Question:</strong> {p.text}
            </p>
            {mode === "prompted" && (
              <div className={styles.trace} data-testid="shown">
                <strong>Steps the reply prints</strong>
                <ol>
                  {r.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
              </div>
            )}
            {mode === "reasoning" && (
              <>
                <div className={styles.trace} data-testid="work">
                  <strong>Work the model did (toy trace)</strong>
                  {r.steps.length ? (
                    <ol>
                      {r.steps.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ol>
                  ) : (
                    <p className="micro">
                      No work yet. It answers from its first guess.
                    </p>
                  )}
                </div>
                <div className={styles.trace} data-testid="shown">
                  <strong>What the app shows you</strong>
                  {show === "full" && (
                    <p className="micro">Everything above, as written.</p>
                  )}
                  {show === "summary" &&
                    (summary.length ? (
                      <ol>
                        {summary.map((s) => (
                          <li key={s.text}>{s.text}</li>
                        ))}
                      </ol>
                    ) : (
                      <p className="micro">Nothing to summarise yet.</p>
                    ))}
                  {show === "none" && (
                    <p className="micro">No steps, only the answer below.</p>
                  )}
                  {show === "summary" && budget >= 3 && pid === "ferry" && (
                    <p className="micro">
                      The summary leaves out the discarded first attempt (216).
                      It is a shorter text, not a copy of the work.
                    </p>
                  )}
                </div>
              </>
            )}
            <div
              className={styles.answer}
              data-status={right ? "right" : "wrong"}
              data-testid="answer"
            >
              <strong className={styles.tag}>
                {right
                  ? "Matches the worked answer"
                  : "Does not match the worked answer"}
              </strong>
              <p className={styles.answerText}>Answer: {r.answer}</p>
              <p className="micro">{r.note}</p>
              <p className={styles.truth} data-testid="cost">
                Toy cost: {r.cost} units of generated text · Worked answer:{" "}
                {p.truth}
              </p>
            </div>
            <div role="status" aria-live="polite" className="visually-hidden">
              {message}
            </div>
          </div>
        </div>
        <p className="micro lab-disclosure">
          Everything here is invented: both questions are hand-picked, the “toy
          trace” is written in advance and not produced by a model, the cost
          units are made up, and the rule that the answer changes at the third
          step is a simplification. A real reasoning model does not step through
          a fixed script, and its output varies. What is real is the general
          pattern: working through intermediate text before answering can help
          on multi-step problems, costs extra time and generated text, and does
          not help a one-step question. The toy also does not show how any
          specific product displays reasoning, which differs between products.
        </p>
      </div>
    </div>
  );
}
