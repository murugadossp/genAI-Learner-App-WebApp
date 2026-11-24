"use client";

import { useId, useState } from "react";

export function KnowledgeCheck() {
  const [choice, setChoice] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const id = useId();
  const questionId = id + "-question";
  const options = [
    {
      title: "Increase rain weight from 2 to 3.",
      detail: "Adjusts the number attached to the rain signal.",
      feedback:
        "Rain is 0 here, so 0 times a different rain weight still contributes 0.",
    },
    {
      title: "Change bias from −1 to 0.",
      detail: "Adjusts the added offset.",
      feedback:
        "Correct. Bias is added to the weighted inputs, so changing it changes the score even when both inputs are 0.",
    },
    {
      title: "Change dark-cloud weight from −1 to +1.",
      detail: "Adjusts the number attached to the cloud signal.",
      feedback:
        "Dark clouds are 0 here, so 0 times a different cloud weight still contributes 0.",
    },
    {
      title: "Lower the reminder cutoff from 0 to −1.",
      detail: "Adjusts the rule for turning a score into a reminder.",
      feedback:
        "The cutoff changes when the reminder turns on, but it does not change the computed score.",
    },
  ];
  const correct = 1;

  return (
    <section id="check" className="knowledge-check">
      <div className="quiz-heading">
        <span className="eyebrow">✎ Try it yourself</span>
        <span className="pill">Knowledge check · Practice only</span>
      </div>
      <h2 tabIndex={-1}>Check your understanding.</h2>
      <fieldset>
        <legend id={questionId}>
          Both toy signals are 0. Rain weight is 2, dark-cloud weight is −1, and
          bias is −1. The score is their weighted sum plus the bias. The
          reminder cutoff stays at 0. Which one edit changes the computed score?
        </legend>
        {options.map((option, index) => (
          <label className="quiz-option" key={option.title}>
            <input
              type="radio"
              name={id}
              checked={choice === index}
              onChange={() => {
                setChoice(index);
                setChecked(false);
              }}
            />
            <span>
              <strong>{option.title}</strong> {option.detail}
            </span>
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
        id={id + "-feedback"}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        aria-describedby={questionId}
        className={"feedback " + (checked ? "" : "visually-hidden")}
      >
        {checked && choice !== null ? options[choice].feedback : ""}
      </div>
    </section>
  );
}
