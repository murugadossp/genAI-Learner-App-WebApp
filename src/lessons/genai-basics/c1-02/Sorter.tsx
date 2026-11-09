"use client";
import { useId, useState } from "react";
import { tasks } from "./tasks";
import styles from "./lesson.module.css";

const items = [
  {
    text: "A weather app estimates how many millimetres of rain will fall tomorrow.",
    task: 0,
    why: "Its output is a number, an estimate of a value.",
  },
  {
    text: "A bank app puts each card payment into one of two groups: looks normal or looks suspicious.",
    task: 1,
    why: "It picks a label from a fixed list of two groups.",
  },
  {
    text: "A video app shows five “Up next” videos picked from millions of existing ones.",
    task: 2,
    why: "It chooses a few existing items to suit one person. Nothing new is made.",
  },
  {
    text: "A mail app writes a brand-new draft reply when you tap “Suggest a reply”.",
    task: 3,
    why: "The output is new text that did not exist before.",
  },
  {
    text: "A delivery app works out the order in which a van should visit eight addresses to finish soonest.",
    task: 4,
    why: "The output is an ordered set of steps toward a goal.",
  },
  {
    text: "A photo app files each picture under Receipts, Screenshots or People.",
    task: 1,
    why: "Each picture gets one label from a fixed list. It is sorted, not changed or created.",
  },
];

export function Sorter() {
  const uid = useId();
  const [answers, setAnswers] = useState<(number | null)[]>(
    items.map(() => null),
  );
  const [message, setMessage] = useState("");
  const right = answers.filter((a, i) => a === items[i].task).length;
  const feedback = (i: number, t: number) => {
    const item = items[i];
    if (t === item.task) return `Right: ${tasks[t].name}. ${item.why}`;
    return `Not quite. ${tasks[t].name} would mean: ${tasks[t].gives.toLowerCase()} Here, ${item.why.charAt(0).toLowerCase()}${item.why.slice(1)}`;
  };
  const choose = (i: number, t: number) => {
    setAnswers((prev) => prev.map((a, j) => (j === i ? t : a)));
    setMessage(`Feature ${i + 1}. ${feedback(i, t)}`);
  };
  return (
    <div className="lab">
      <div className="lab-head">
        <strong>Name the job each feature does</strong>
        <span className="pill">PRACTICE</span>
      </div>
      <div className="lab-body">
        <p>Try it in this order:</p>
        <ol>
          <li>
            Read what the feature is for and what it gives back to the user.
          </li>
          <li>
            Ask whether that output is a value, a label, a pick, new content or
            a set of steps.
          </li>
          <li>Choose the matching job. You can change any answer.</li>
        </ol>
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
                    {tasks.map((t, k) => (
                      <label className={styles.choice} key={t.name}>
                        <input
                          type="radio"
                          name={`${uid}-${i}`}
                          checked={a === k}
                          onChange={() => choose(i, k)}
                        />
                        <span>{t.name}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                {a !== null && (
                  <p
                    id={`${uid}-fb-${i}`}
                    className={styles.itemFeedback}
                    data-ok={a === item.task}
                    data-testid="item-feedback"
                  >
                    {a === item.task ? "✓ " : "↻ "}
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
              setMessage("Sorter reset.");
            }}
          >
            Reset
          </button>
        </div>
        <div role="status" aria-live="polite" className="visually-hidden">
          {message}
        </div>
        <p className="micro lab-disclosure">
          These are short descriptions of what each kind of feature gives back.
          They are not descriptions of any real product. Each feature is written
          so that one job fits best.
        </p>
      </div>
    </div>
  );
}
