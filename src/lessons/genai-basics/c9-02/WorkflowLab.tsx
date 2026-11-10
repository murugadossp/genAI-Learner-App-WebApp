"use client";
import { useId, useState } from "react";
import styles from "./lesson.module.css";

const kinds = [
  {
    name: "Workflow",
    means:
      "the code decides which steps run and in what order, using rules written in advance.",
  },
  {
    name: "Agent loop",
    means: "the model picks each action, reads the result and picks again.",
  },
  {
    name: "Combination",
    means: "fixed steps, with one or more open-ended agent loops inside them.",
  },
] as const;

const items = [
  {
    text: "Every ticket is classified, then checked for urgency, then routed, in that order.",
    kind: 0,
    why: "The code sets the order. The model does not choose any step.",
  },
  {
    text: "The model reads a ticket and chooses to look up the account or ask the customer a question. It reads the reply and chooses again until it is ready to route.",
    kind: 1,
    why: "The model chooses each action and chooses again after each result. That is the loop.",
  },
  {
    text: "Intake and filing always run. In between, the model decides how many records to look up, and keeps looking until it judges it has enough.",
    kind: 2,
    why: "Intake and filing are fixed. In between, the model chooses whether to look up more records or stop.",
  },
  {
    text: "Every ticket runs three fixed steps. One of them calls a model to write a one-sentence summary. The code always moves to the next step.",
    kind: 0,
    why: "The model writes a summary inside one fixed step. It does not choose what runs next.",
  },
  {
    text: "A trip planner uses a model that searches for flights, reads the prices, and chooses whether to search another date. It keeps going until the model judges the plan good enough, then stops.",
    kind: 1,
    why: "The model chooses each search and decides when to stop. That is the loop.",
  },
];

export function WorkflowLab() {
  const uid = useId();
  const [answers, setAnswers] = useState<(number | null)[]>(
    items.map(() => null),
  );
  const [message, setMessage] = useState("");
  const right = answers.filter((a, i) => a === items[i].kind).length;

  const feedback = (i: number, k: number) => {
    const item = items[i];
    if (k === item.kind) return `Right: ${kinds[k].name}. ${item.why}`;
    return `Not quite. ${kinds[k].name} means ${kinds[k].means} Here, ${item.why.charAt(0).toLowerCase()}${item.why.slice(1)}`;
  };

  const choose = (i: number, k: number) => {
    setAnswers((prev) => prev.map((a, j) => (j === i ? k : a)));
    setMessage(`System ${i + 1}. ${feedback(i, k)}`);
  };

  return (
    <div className={styles.lab}>
      <div className={styles.labHead}>
        <strong>Workflow, agent loop or combination?</strong>
        <span className="pill">PRACTICE</span>
      </div>
      <ol className={styles.items}>
        {items.map((item, i) => {
          const a = answers[i];
          return (
            <li className={styles.item} key={item.text}>
              <fieldset
                aria-describedby={a !== null ? `${uid}-fb-${i}` : undefined}
              >
                <legend>
                  {i + 1}. {item.text}
                </legend>
                <div className={styles.choices}>
                  {kinds.map((k, n) => (
                    <label className={styles.choice} key={k.name}>
                      <input
                        type="radio"
                        name={`${uid}-${i}`}
                        checked={a === n}
                        onChange={() => choose(i, n)}
                      />
                      <span>{k.name}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              {a !== null && (
                <p
                  id={`${uid}-fb-${i}`}
                  className={styles.itemFeedback}
                  data-ok={a === item.kind}
                  data-testid="item-feedback"
                >
                  {a === item.kind ? "✓ " : "↻ "}
                  {feedback(i, a)}
                </p>
              )}
            </li>
          );
        })}
      </ol>
      <div className={styles.score}>
        <strong data-testid="score">
          {right} of {items.length} correct
        </strong>
        <button
          type="button"
          onClick={() => {
            setAnswers(items.map(() => null));
            setMessage("Lab reset.");
          }}
        >
          Reset
        </button>
      </div>
      <div role="status" aria-live="polite" className="visually-hidden">
        {message}
      </div>
      <p className="micro">
        These are short, simplified descriptions written for this lesson. They
        are not descriptions of any real product. Real systems can mix these
        patterns in ways this lab does not show.
      </p>
    </div>
  );
}
