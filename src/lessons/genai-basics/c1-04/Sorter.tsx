"use client";
import { useId, useState } from "react";
import { parts, type PartId } from "./parts";
import styles from "./lesson.module.css";

const items: { text: string; part: PartId; why: string }[] = [
  {
    text: "The camera button and the result card on your screen.",
    part: "interface",
    why: "They are where you put information in and read results out.",
  },
  {
    text: "The part that turns your leaf photo into the guess “tomato plant”.",
    part: "model",
    why: "It turns an input, a photo, into an output, a best guess.",
  },
  {
    text: "The list of watering tips that gardeners wrote and the app stored ahead of time.",
    part: "data",
    why: "It is information stored ahead of time and looked up as it is.",
  },
  {
    text: "The outside weather service that the app calls to find out whether rain is due today.",
    part: "tool",
    why: "It is an outside service the app calls when it needs live information.",
  },
  {
    text: "In Leaf Buddy, the part that learned to recognise plants from many labelled example photos.",
    part: "model",
    why: "It is Leaf Buddy’s plant model, the part described as learning to recognise plants from labelled photos.",
  },
  {
    text: "Gardeners reword the tomato tip in the stored list. Which part was edited?",
    part: "data",
    why: "The stored list changed. The model’s guessing was not touched by this edit.",
  },
];

const name = (id: PartId) => parts.find((p) => p.id === id)!;

export function Sorter() {
  const uid = useId();
  const [answers, setAnswers] = useState<(PartId | null)[]>(
    items.map(() => null),
  );
  const [message, setMessage] = useState("");
  const right = answers.filter((a, i) => a === items[i].part).length;
  const feedback = (i: number, p: PartId) => {
    const item = items[i];
    if (p === item.part) return `Right: ${name(p).name}. ${item.why}`;
    return `Not quite. ${name(p).name} means: ${name(p).job} Here, ${item.why.charAt(0).toLowerCase()}${item.why.slice(1)}`;
  };
  const choose = (i: number, p: PartId) => {
    setAnswers((prev) => prev.map((a, j) => (j === i ? p : a)));
    setMessage(`Item ${i + 1}. ${feedback(i, p)}`);
  };
  return (
    <div className="lab">
      <div className="lab-head">
        <strong>Name the part in Leaf Buddy</strong>
        <span className="pill">PRACTICE</span>
      </div>
      <div className="lab-body">
        <p>Try it in this order:</p>
        <ol>
          <li>Read the description of one piece of Leaf Buddy.</li>
          <li>Ask what its job is in handling a request.</li>
          <li>Choose the matching part. You can change any answer.</li>
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
                    {parts.map((p) => (
                      <label className={styles.choice} key={p.id}>
                        <input
                          type="radio"
                          name={`${uid}-${i}`}
                          checked={a === p.id}
                          onChange={() => choose(i, p.id)}
                        />
                        <span>{p.name}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                {a !== null && (
                  <p
                    id={`${uid}-fb-${i}`}
                    className={styles.itemFeedback}
                    data-ok={a === item.part}
                    data-testid="item-feedback"
                  >
                    {a === item.part ? "✓ " : "↻ "}
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
          All six items are about the invented Leaf Buddy example. In a real app
          the lines can blur, so each item here is written to fit one part.
        </p>
      </div>
    </div>
  );
}
