"use client";
import { useId, useState } from "react";
import { tasks, levels, type Stakes, type Checkable } from "./tasks";
import styles from "./lesson.module.css";

type Answer = { stakes: Stakes | null; checkable: Checkable | null };
const blank = (): Answer[] =>
  tasks.map(() => ({ stakes: null, checkable: null }));

export function RateLab() {
  const uid = useId();
  const [answers, setAnswers] = useState<Answer[]>(blank);
  const [message, setMessage] = useState("");
  const done = answers.filter(
    (a, i) =>
      a.stakes === tasks[i].stakes && a.checkable === tasks[i].checkable,
  ).length;

  const fb = (i: number, axis: "stakes" | "checkable") => {
    const t = tasks[i];
    const a = answers[i][axis];
    if (a === null) return null;
    const ok = a === t[axis];
    const word = t[axis];
    const why = axis === "stakes" ? t.stakesWhy : t.checkWhy;
    const label = axis === "stakes" ? "Stakes" : "Checkability";
    return {
      ok,
      text: ok
        ? `${label}: right, ${word}. ${why.charAt(0).toUpperCase()}${why.slice(1)}`
        : `${label}: not quite. Here it is ${word}, because ${why}`,
    };
  };

  const choose = (
    i: number,
    axis: "stakes" | "checkable",
    value: Stakes | Checkable,
  ) => {
    const next = answers.map((a, j) => (j === i ? { ...a, [axis]: value } : a));
    setAnswers(next);
    const t = tasks[i];
    const ok = value === t[axis];
    const why = axis === "stakes" ? t.stakesWhy : t.checkWhy;
    const both = next[i].stakes !== null && next[i].checkable !== null;
    const level =
      both && next[i].stakes === t.stakes && next[i].checkable === t.checkable
        ? ` Check level: ${levels[`${t.stakes}-${t.checkable}`]}`
        : "";
    setMessage(
      `Task ${i + 1}. ${ok ? "Right" : "Not quite"}. ${ok ? "" : `Here it is ${t[axis]}, because `}${why}${level}`,
    );
  };

  const group = (
    i: number,
    axis: "stakes" | "checkable",
    legend: string,
    opts: [string, string][],
  ) => {
    const f = fb(i, axis);
    const id = `${uid}-${i}-${axis}`;
    return (
      <>
        <fieldset aria-describedby={f ? `${id}-fb` : undefined}>
          <legend>{legend}</legend>
          <div className={styles.choices}>
            {opts.map(([value, label]) => (
              <label className={styles.choice} key={value}>
                <input
                  type="radio"
                  name={id}
                  checked={answers[i][axis] === value}
                  onChange={() => choose(i, axis, value as Stakes | Checkable)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        {f && (
          <p
            id={`${id}-fb`}
            className={styles.itemFeedback}
            data-ok={f.ok}
            data-testid="item-feedback"
          >
            {f.ok ? "✓ " : "↻ "}
            {f.text}
          </p>
        )}
      </>
    );
  };

  return (
    <div className="lab">
      <div className="lab-head">
        <strong>Rate Sam’s tasks</strong>
        <span className="pill">PRACTICE</span>
      </div>
      <div className="lab-body">
        <p>Try it in this order:</p>
        <ol>
          <li>Read one task. Every fact you need is in it.</li>
          <li>Choose the stakes: low or high.</li>
          <li>Choose whether the answer is easy or hard to check.</li>
          <li>Read the feedback. You can change any answer.</li>
        </ol>
        <ol className={styles.items}>
          {tasks.map((t, i) => {
            const a = answers[i];
            const right = a.stakes === t.stakes && a.checkable === t.checkable;
            return (
              <li className={styles.item} key={t.text} data-testid="task">
                <p className={styles.taskText}>
                  <strong>Task {i + 1}.</strong> {t.text}
                </p>
                {group(i, "stakes", "Stakes if the answer is wrong", [
                  ["low", "Low"],
                  ["high", "High"],
                ])}
                {group(i, "checkable", "Can Sam check the answer?", [
                  ["easy", "Easy to check"],
                  ["hard", "Hard to check"],
                ])}
                {right && (
                  <p className={styles.level} data-testid="level">
                    <strong>Check level:</strong>{" "}
                    {levels[`${t.stakes}-${t.checkable}`]}
                  </p>
                )}
              </li>
            );
          })}
        </ol>
        <div className={styles.score}>
          <strong data-testid="score">
            {done} of {tasks.length} rated correctly
          </strong>
          <button
            type="button"
            onClick={() => {
              setAnswers(blank());
              setMessage("Practice reset.");
            }}
          >
            Reset
          </button>
        </div>
        <div role="status" aria-live="polite" className="visually-hidden">
          {message}
        </div>
        <p className="micro lab-disclosure">
          Sam and all six tasks are invented. Each task states the facts the
          rating depends on; real tasks are less tidy. The grid is this lesson’s
          own teaching framework, not an industry standard.
        </p>
      </div>
    </div>
  );
}
