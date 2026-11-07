"use client";
import { useId, useState } from "react";
export function Check({
  question,
  options,
  correct,
  explanation,
  wrongFeedback,
  id,
  title = "Check your understanding.",
}: {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  wrongFeedback: string[];
  id?: string;
  title?: string;
}) {
  const [choice, setChoice] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const name = useId();
  return (
    <section id={id} className="knowledge-check">
      <div className="quiz-heading">
        <span className="eyebrow">✎ Try it yourself</span>
        <span className="pill">Knowledge check · Practice only</span>
      </div>
      <h2 tabIndex={-1}>{title}</h2>
      <fieldset>
        <legend>{question}</legend>
        {options.map((option, i) => (
          <label className="quiz-option" key={option}>
            <input
              type="radio"
              name={name}
              checked={choice === i}
              onChange={() => {
                setChoice(i);
                setChecked(false);
              }}
            />
            <span>{option}</span>
          </label>
        ))}
      </fieldset>
      <div className="quiz-actions">
        <button
          className="button"
          disabled={choice === null}
          onClick={() => setChecked(true)}
        >
          Check answer →
        </button>
        {checked && (
          <button
            onClick={() => {
              setChoice(null);
              setChecked(false);
            }}
          >
            Try again
          </button>
        )}
      </div>
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={`feedback ${checked ? "" : "visually-hidden"}`}
        data-result={choice === correct ? "correct" : "retry"}
      >
        {checked && choice !== null
          ? choice === correct
            ? "✓ Correct. " + explanation
            : "↻ Not quite. " + wrongFeedback[choice]
          : ""}
      </div>
    </section>
  );
}
