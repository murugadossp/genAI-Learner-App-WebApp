"use client";
import { useId, useState } from "react";
import styles from "./lesson.module.css";

type Kind = "Training" | "Inference";
const items: { text: string; answer: Kind; why: string }[] = [
  {
    text: "The builder runs 50,000 labelled emails through the model and adjusts its learned settings until it tags them well.",
    answer: "Training",
    why: "The learned settings are being changed.",
  },
  {
    text: "A customer’s email arrives and the tagger replies “delivery”. Its learned settings are not updated.",
    answer: "Inference",
    why: "The model produces an output and its settings stay as they were.",
  },
  {
    text: "You send “this one is about money” along with your email, and the tag for that request changes. The learned settings stay fixed.",
    answer: "Inference",
    why: "The hint is only part of this request’s input. The settings did not change.",
  },
  {
    text: "The company teaches the model from new labelled emails, so its learned settings change, and releases version 2.",
    answer: "Training",
    why: "Changing the settings again is training again, often called retraining.",
  },
  {
    text: "You press “try again” and get a new reply. The learned settings are not updated.",
    answer: "Inference",
    why: "A new reply uses the model as it is. Nothing about the model changed.",
  },
];

export function Sorter() {
  const name = useId();
  const [picks, setPicks] = useState<(Kind | null)[]>(items.map(() => null));
  const [announce, setAnnounce] = useState("");
  const score = picks.filter((p, i) => p === items[i].answer).length;
  return (
    <div>
      <p data-testid="score" className={styles.state}>
        {score} of {items.length} right
      </p>
      <ul className={styles.sortList}>
        {items.map((it, i) => {
          const pick = picks[i];
          const fid = `${name}-f${i}`;
          return (
            <li key={i} className={styles.sortItem}>
              <fieldset aria-describedby={pick ? fid : undefined}>
                <legend>{it.text}</legend>
                {(["Training", "Inference"] as Kind[]).map((k) => (
                  <label key={k} className={styles.sortOption}>
                    <input
                      type="radio"
                      name={`${name}-${i}`}
                      checked={pick === k}
                      onChange={() => {
                        setPicks((p) => p.map((x, j) => (j === i ? k : x)));
                        setAnnounce(
                          k === it.answer
                            ? `Right. ${it.why}`
                            : `Not quite. ${it.why}`,
                        );
                      }}
                    />
                    <span>{k}</span>
                  </label>
                ))}
              </fieldset>
              {pick && (
                <p id={fid} data-testid="item-feedback" className="micro">
                  {pick === it.answer ? "Right. " : "Not quite. "}
                  {it.why}
                </p>
              )}
            </li>
          );
        })}
      </ul>
      <button
        onClick={() => {
          setPicks(items.map(() => null));
          setAnnounce("Reset.");
        }}
      >
        Reset
      </button>
      <div role="status" aria-live="polite" className="visually-hidden">
        {announce}
      </div>
    </div>
  );
}
