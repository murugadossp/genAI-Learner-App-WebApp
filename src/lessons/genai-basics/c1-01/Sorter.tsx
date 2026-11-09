"use client";
import { useId, useState } from "react";
import { ringNames } from "./RingDiagram";
import styles from "./lesson.module.css";

const glosses = [
  "Designed by people, with rules or search. Nothing is learned.",
  "Learns from examples, but is not a many-layer network.",
  "A many-layer network. It labels or scores, and does not write new content.",
  "A deep model that makes new text, images or audio.",
];

const items = [
  {
    text: "A tic-tac-toe computer player that follows rules people wrote: win if it can, otherwise block, otherwise take the centre.",
    ring: 0,
    why: "People wrote the rules and nothing was learned from data, so it is AI but outside machine learning.",
  },
  {
    text: "A spam model that adds up weighted clue counts, such as the number of links and certain words. The weights were fitted to thousands of labelled emails.",
    ring: 1,
    why: "Its weights were learned from examples, so it is machine learning. A single weighted sum of clues a person chose is not a many-layer network, so it is not deep learning.",
  },
  {
    text: "A many-layer network reads the raw message text and learns its own clues to decide spam or not spam.",
    ring: 2,
    why: "It is deep learning, learning its own clues. It only labels messages, so it is not generative.",
  },
  {
    text: "A large many-layer network trained to write a brand-new reply to a message, in a tone you ask for.",
    ring: 3,
    why: "It is a deep model trained to produce new content, which is what today’s generative AI is. It is also inside the three outer rings.",
  },
  {
    text: "A rule in Postbox: show the newest saved article from a topic the reader starred.",
    ring: 0,
    why: "Another hand-written rule. Simple and predictable, with nothing learned.",
  },
  {
    text: "A parcel-time estimate fitted to past deliveries, using a straight-line fit on distance and weekday.",
    ring: 1,
    why: "Fitted from examples, so it is machine learning. A straight-line fit is not a many-layer network, so it is not deep learning.",
  },
];

export function Sorter() {
  const uid = useId();
  const [answers, setAnswers] = useState<(number | null)[]>(
    items.map(() => null),
  );
  const [message, setMessage] = useState("");
  const right = answers.filter((a, i) => a === items[i].ring).length;
  const feedback = (i: number, ring: number) => {
    const item = items[i];
    if (ring === item.ring) return `Right. ${item.why}`;
    return ring < item.ring
      ? `Not quite. It is inside ${ringNames[ring]}, but it belongs to a more specific ring too. ${item.why}`
      : `Not quite. That is further in than it goes. ${item.why}`;
  };
  const choose = (i: number, ring: number) => {
    setAnswers((prev) => prev.map((a, j) => (j === i ? ring : a)));
    setMessage(`Item ${i + 1}. ${feedback(i, ring)}`);
  };
  return (
    <div className="lab">
      <div className="lab-head">
        <strong>Sort Postbox’s parts into rings</strong>
        <span className="pill">PRACTICE</span>
      </div>
      <div className="lab-body">
        <p>
          For each part of Postbox, pick the{" "}
          <strong>one description that fits best</strong>. A deep network is
          also machine learning and AI, but pick the most specific ring, which
          is the innermost one that fits. You can change an answer at any time.
        </p>
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
                  <div className={styles.ringChoices}>
                    {ringNames.map((name, r) => (
                      <label className={styles.choice} key={name}>
                        <input
                          type="radio"
                          name={`${uid}-${i}`}
                          checked={a === r}
                          onChange={() => choose(i, r)}
                        />
                        <span className={styles.choiceText}>
                          <strong>{name}</strong>
                          <small>{glosses[r]}</small>
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                {a !== null && (
                  <p
                    id={`${uid}-fb-${i}`}
                    className={styles.itemFeedback}
                    data-ok={a === item.ring}
                    data-testid="item-feedback"
                  >
                    {a === item.ring ? "✓ " : "↻ "}
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
          Postbox is an invented mail app, and each part is a sketch of how that
          kind of approach works, not a description of a real product.
        </p>
      </div>
    </div>
  );
}
