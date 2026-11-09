"use client";
import { useEffect, useId, useRef, useState } from "react";
import styles from "./lesson.module.css";

type PId = "pets" | "fact";
type Mode = "quick" | "prompted" | "reasoning";
type Show = "full" | "summary" | "none";

type Problem = {
  id: PId;
  label: string;
  text: string;
  truth: string;
  quick: string;
  discarded: string;
  promptedSteps: string[];
  promptedAnswer: string;
  promptedNote: string;
  work: { text: string; cost: number; answer: string }[];
  summary: { at: number; text: string }[];
};

const problems: Problem[] = [
  {
    id: "pets",
    label: "Pet puzzle (needs several clues)",
    text: "Asha, Ben and Chen each own a different pet: a cat, a dog or a fish. Asha is allergic to fur, so she cannot own a pet with fur. Chen does not own the cat. Who owns which pet?",
    truth: "Asha: fish, Ben: cat, Chen: dog",
    quick: "Asha: cat, Ben: dog, Chen: fish",
    discarded: "Asha: cat, Ben: dog, Chen: fish",
    promptedSteps: [
      "The pets are a cat, a dog and a fish.",
      "The owners are Asha, Ben and Chen, in that order.",
      "So Asha has the cat, Ben has the dog and Chen has the fish.",
    ],
    promptedAnswer: "Asha: cat, Ben: dog, Chen: fish",
    promptedNote:
      "The toy writes tidy steps, but they just pair names and pets in listed order and never use the clues. In real models, asking for steps often does help; it just is not a guarantee, and it is not the same as being trained to work first.",
    work: [
      {
        text: "List the clues: Asha cannot own a pet with fur. Chen does not own the cat. The pets are a cat, a dog and a fish.",
        cost: 60,
        answer: "Asha: cat, Ben: dog, Chen: fish",
      },
      {
        text: "First attempt: pair them in order. Asha has the cat, Ben the dog, Chen the fish.",
        cost: 50,
        answer: "Asha: cat, Ben: dog, Chen: fish",
      },
      {
        text: "Test the first attempt against the clues. Asha cannot own a pet with fur, so she cannot have the cat. Discard it. Only the fish has no fur, so Asha has the fish. Chen does not have the cat, so Chen has the dog and Ben has the cat.",
        cost: 90,
        answer: "Asha: fish, Ben: cat, Chen: dog",
      },
      {
        text: "Check both clues against the new answer: Asha has the fish, so no fur. Chen has the dog, not the cat. Both hold.",
        cost: 60,
        answer: "Asha: fish, Ben: cat, Chen: dog",
      },
    ],
    summary: [
      { at: 1, text: "Listed the clues." },
      { at: 3, text: "Used the clues to rule options out." },
      { at: 4, text: "Checked the answer against the clues." },
    ],
  },
  {
    id: "fact",
    label: "Quick fact (one step)",
    text: "What is the capital city of France?",
    truth: "Paris",
    quick: "Paris",
    discarded: "",
    promptedSteps: ["The capital city of France is Paris."],
    promptedAnswer: "Paris",
    promptedNote:
      "A single fact needs no help. Asking for steps changes the length of the reply, not the answer.",
    work: [
      { text: "Read the question: a capital city.", cost: 20, answer: "Paris" },
      { text: "France’s capital is Paris.", cost: 30, answer: "Paris" },
      { text: "Nothing conflicts with that.", cost: 30, answer: "Paris" },
      {
        text: "Nothing new to check. Answer Paris.",
        cost: 20,
        answer: "Paris",
      },
    ],
    summary: [
      { at: 2, text: "Recalled the capital." },
      { at: 3, text: "Checked nothing conflicts." },
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
    p.id === "fact"
      ? budget === 0
        ? "The answer is right with no extra work. Raise the limit to see what more work adds."
        : "In this toy the answer was right from the start, so extra work only added cost."
      : budget < 3
        ? "Not enough work yet. The toy still holds its first guess."
        : budget === 3
          ? "Re-reading the facts caught the slip. The toy’s answer changed."
          : "The same answer, now with a check. The check cost more and changed nothing here.";
  return { answer, cost, steps: used.map((w) => w.text), note };
}

export function ReasoningLab() {
  const [pid, setPid] = useState<PId>("pets");
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
    setPid("pets");
    setMode("quick");
    setBudget(0);
    setShow("summary");
    setMessage("Lab reset.");
  };
  const summary = p.summary.filter((x) => x.at <= budget);
  return (
    <div className="lab">
      <div className="lab-head">
        <strong>01 / Mix and match: same question, three ways to answer</strong>
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
                <strong>Work before answering:</strong>{" "}
                {mode === "reasoning"
                  ? `${budget} of 4 steps`
                  : "reasoning model only"}
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
                  <span className="micro">
                    {" "}
                    Inspection view for this lesson: an app would not normally
                    show you this.
                  </span>
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
                  {show === "summary" && budget >= 3 && pid === "pets" && (
                    <p className="micro">
                      The summary leaves out the discarded first attempt (
                      {p.discarded}). It is a shorter text, not a copy of the
                      work.
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
          on multi-step problems, costs extra time and generated text, and often
          adds little on a one-step question (in this toy, nothing). The toy
          also does not show how any specific product displays reasoning, which
          differs between products.
        </p>
      </div>
    </div>
  );
}
