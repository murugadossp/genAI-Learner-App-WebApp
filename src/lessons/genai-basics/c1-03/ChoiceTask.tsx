"use client";
import { useId, useState } from "react";
import styles from "./lesson.module.css";

export function ChoiceTask({
  question,
  options,
  correct,
  feedback,
  title = "Quick practice",
}: {
  question: string;
  options: string[];
  correct: number;
  feedback: string[];
  title?: string;
}) {
  const uid = useId();
  const [choice, setChoice] = useState<number | null>(null);
  const ok = choice === correct;
  return (
    <div className={styles.task}>
      <span className="pill">PRACTICE</span>
      <fieldset aria-describedby={choice !== null ? `${uid}-fb` : undefined}>
        <legend>
          {title}: {question}
        </legend>
        {options.map((o, i) => (
          <label className={styles.option} key={o}>
            <input
              type="radio"
              name={uid}
              checked={choice === i}
              onChange={() => setChoice(i)}
            />
            <span>{o}</span>
          </label>
        ))}
      </fieldset>
      {choice !== null && (
        <p
          id={`${uid}-fb`}
          className={styles.itemFeedback}
          data-ok={ok}
          data-testid="task-feedback"
        >
          {ok ? "✓ Right. " : "↻ Not quite. "}
          {feedback[choice]}
        </p>
      )}
      <div role="status" aria-live="polite" className="visually-hidden">
        {choice !== null &&
          `${ok ? "Right." : "Not quite."} ${feedback[choice]}`}
      </div>
    </div>
  );
}
