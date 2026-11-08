"use client";
import { useState } from "react";
import styles from "./lesson.module.css";

type Doc = { id: string; source: string; text: string; next: string };
const prompt = "The capital of Australia is";
const docs: Doc[] = [
  {
    id: "t1",
    source: "Travel blog",
    text: "Day one: harbour views, ferries, and the capital of Australia is Sydney, I figured.",
    next: "Sydney",
  },
  {
    id: "t2",
    source: "Travel blog",
    text: "Packing list for my trip. The capital of Australia is Sydney, so I booked there.",
    next: "Sydney",
  },
  {
    id: "t3",
    source: "Travel blog",
    text: "Opera House photos! The capital of Australia is Sydney, right?",
    next: "Sydney",
  },
  {
    id: "f1",
    source: "Forum chat",
    text: "Quick question: the capital of Australia is Sydney, no?",
    next: "Sydney",
  },
  {
    id: "f2",
    source: "Forum chat",
    text: "Pretty sure the capital of Australia is Melbourne, it felt that big.",
    next: "Melbourne",
  },
  {
    id: "t4",
    source: "Travel blog",
    text: "Update after the tour: the capital of Australia is Canberra, not Sydney!",
    next: "Canberra",
  },
  {
    id: "r1",
    source: "Reference page",
    text: "Country facts. The capital of Australia is Canberra.",
    next: "Canberra",
  },
  {
    id: "r2",
    source: "Reference page",
    text: "Atlas entry: the capital of Australia is Canberra, in the Australian Capital Territory.",
    next: "Canberra",
  },
  {
    id: "r3",
    source: "Reference page",
    text: "Parliament overview: the capital of Australia is Canberra.",
    next: "Canberra",
  },
  {
    id: "r4",
    source: "School notes",
    text: "Quiz answer: the capital of Australia is Canberra.",
    next: "Canberra",
  },
  {
    id: "r5",
    source: "Reference page",
    text: "Government guide: the capital of Australia is Canberra.",
    next: "Canberra",
  },
];
const dietA = ["t1", "t2", "t3", "f1", "f2", "t4", "r1"];
const dietB = ["r1", "r2", "r3", "r4", "r5", "t4", "t1"];
const words = ["Canberra", "Sydney", "Melbourne"];

function same(a: string[], b: string[]) {
  return a.length === b.length && a.every((x) => b.includes(x));
}
function distribution(ids: string[]) {
  const counts = words.map(
    (w) => docs.filter((d) => ids.includes(d.id) && d.next === w).length,
  );
  const total = counts.reduce((a, b) => a + b, 0);
  return words
    .map((word, i) => ({
      word,
      count: counts[i],
      pct: total ? Math.round((counts[i] / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

export function DietLab() {
  const [draft, setDraft] = useState<string[]>(dietA);
  const [trained, setTrained] = useState<string[]>(dietA);
  const [message, setMessage] = useState("");
  const dist = distribution(trained);
  const total = dist.reduce((a, b) => a + b.count, 0);
  const pending = !same(draft, trained);
  const toggle = (id: string) =>
    setDraft((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]));
  const train = () => {
    const next = distribution(draft);
    const t = next.reduce((a, b) => a + b.count, 0);
    setTrained(draft);
    setMessage(
      t
        ? `Trained on ${draft.length} documents. Most likely next word: ${next[0].word}, ${next[0].pct} percent.`
        : "Trained on no matching documents. The toy has no examples to learn from.",
    );
  };
  return (
    <div className="lab">
      <div className="lab-head">
        <strong>01 / Choose the training data</strong>
        <span className="pill">SIMULATION</span>
      </div>
      <div className="lab-body">
        <div className={styles.grid}>
          <div>
            <p className="micro">
              Tick the documents the toy model trains on, or start from a
              preset. Ticking changes the data, not the model, until you press
              Train.
            </p>
            <div className={styles.presets}>
              <button
                type="button"
                aria-pressed={same(draft, dietA)}
                onClick={() => setDraft(dietA)}
              >
                Preset A: mostly casual posts
              </button>
              <button
                type="button"
                aria-pressed={same(draft, dietB)}
                onClick={() => setDraft(dietB)}
              >
                Preset B: mostly reference pages
              </button>
              <button
                type="button"
                aria-pressed={draft.length === 0}
                onClick={() => setDraft([])}
              >
                Clear
              </button>
            </div>
            <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
              <legend className="visually-hidden">Training documents</legend>
              <ul className={styles.docs}>
                {docs.map((d) => (
                  <li key={d.id}>
                    <label
                      className={styles.doc}
                      data-on={draft.includes(d.id)}
                    >
                      <input
                        type="checkbox"
                        checked={draft.includes(d.id)}
                        onChange={() => toggle(d.id)}
                      />
                      <span className={styles.docText}>
                        <span className={styles.source}>{d.source}</span>“
                        {d.text}”
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </fieldset>
          </div>
          <div className={styles.panel}>
            <button
              type="button"
              className="button"
              onClick={train}
              disabled={!pending}
            >
              Train toy model →
            </button>
            <h3 style={{ margin: "1rem 0 0.5rem" }}>Trained model, asked:</h3>
            <p className={styles.prompt}>{prompt} …</p>
            <p className="micro">
              Trained on {trained.length} of {docs.length} documents ({total}{" "}
              match this prompt).
            </p>
            {total === 0 ? (
              <p className="micro">
                No examples of this pattern in the training snapshot. This toy
                just counts, so it has nothing to say. A real model has seen
                many other patterns and can still produce a fluent guess, which
                may be wrong.
              </p>
            ) : (
              dist.map((r, i) => (
                <div
                  className={styles.row}
                  key={r.word}
                  data-top={i === 0}
                  data-testid="prob-row"
                >
                  <span>{r.word}</span>
                  <span className={styles.bar} aria-hidden="true">
                    <span style={{ width: `${r.pct}%` }} />
                  </span>
                  <span>{r.pct}%</span>
                </div>
              ))
            )}
            {pending && (
              <p className={styles.stale}>
                Your ticked documents differ from what the model was trained on.
                The answer above is unchanged. The model does not look at them
                when you ask. Press Train to rebuild it.
              </p>
            )}
            <div role="status" aria-live="polite" className="visually-hidden">
              {message}
            </div>
          </div>
        </div>
        <p className="micro lab-disclosure">
          Everything here is invented: eleven short documents, a count-based
          “model”, and percentages that are just shares of matching documents.
          Real pretraining uses vast amounts of text and a neural network that
          adjusts numerical weights, not a tally of words, and real data
          mixtures are not this clean. The fact that Canberra is Australia’s
          capital is real; the made-up posts exist only to show how a skewed
          diet can skew an answer.
        </p>
      </div>
    </div>
  );
}
