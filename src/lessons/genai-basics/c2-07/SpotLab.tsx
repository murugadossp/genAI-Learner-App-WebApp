"use client";
import { useState } from "react";
import styles from "./lesson.module.css";

type Verdict = "supported" | "unsupported" | "contradicted";
type Claim = { id: string; text: string; truth: Verdict; why: string };

const notice =
  "Lantern Bay Library notice (invented): The library opened in 1962 in the old ferry office. It has two reading rooms and is open Tuesday to Saturday, 10:00 to 17:00. Membership is free for residents of Lantern Bay.";

const sets: Record<string, { title: string; claims: Claim[] }> = {
  without: {
    title: "Answer A: the model was not given the notice",
    claims: [
      {
        id: "a1",
        text: "The Lantern Bay Library opened in 1964.",
        truth: "contradicted",
        why: "The notice says 1962. Without it, the year had no support, like the “nothing at all” case in the first lab.",
      },
      {
        id: "a2",
        text: "It was designed by the architect Elena Marsh.",
        truth: "unsupported",
        why: "The notice names no architect. A name-shaped gap got a name-shaped fill.",
      },
      {
        id: "a3",
        text: "It has two reading rooms.",
        truth: "supported",
        why: "The notice says two reading rooms. Here the guess happened to agree, which is luck, not checking.",
      },
      {
        id: "a4",
        text: "It is open every day from 9:00 to 20:00.",
        truth: "contradicted",
        why: "The notice gives Tuesday to Saturday, 10:00 to 17:00.",
      },
    ],
  },
  with: {
    title: "Answer B: the model was given the notice",
    claims: [
      {
        id: "b1",
        text: "The library opened in 1962 in the old ferry office.",
        truth: "supported",
        why: "Matches the notice.",
      },
      {
        id: "b2",
        text: "It is open Tuesday to Sunday, 10:00 to 17:00.",
        truth: "contradicted",
        why: "The notice says Tuesday to Saturday. A close paraphrase slipped one detail.",
      },
      {
        id: "b3",
        text: "Membership is free for residents of Lantern Bay.",
        truth: "supported",
        why: "Matches the notice.",
      },
      {
        id: "b4",
        text: "It is the busiest library on the coast.",
        truth: "unsupported",
        why: "The notice says nothing about visitor numbers. A fluent flourish was added beyond the source.",
      },
    ],
  },
};
const options: { v: Verdict; label: string }[] = [
  { v: "supported", label: "Matches the notice" },
  { v: "unsupported", label: "Not in the notice" },
  { v: "contradicted", label: "Contradicts the notice" },
];
const names: Record<Verdict, string> = {
  supported: "Matches the notice",
  unsupported: "Not in the notice",
  contradicted: "Contradicts the notice",
};

export function SpotLab() {
  const [setId, setSetId] = useState<"without" | "with">("without");
  const [marks, setMarks] = useState<Record<string, Verdict>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  // revealed is keyed by claim id so correcting one mark keeps other feedback.
  const set = sets[setId];
  const done = set.claims.every((c) => revealed[c.id]);
  const score = set.claims.filter((c) => marks[c.id] === c.truth).length;
  const allMarked = set.claims.every((c) => marks[c.id]);
  return (
    <div className="lab">
      <div className="lab-head">
        <strong>02 / Check the claims against the notice</strong>
        <span className="pill">SIMULATION</span>
      </div>
      <div className="lab-body">
        <p className={styles.source}>
          <strong>Source notice.</strong> {notice}
        </p>
        <div className={styles.tabs} role="group" aria-label="Answer to check">
          <button
            type="button"
            aria-pressed={setId === "without"}
            onClick={() => setSetId("without")}
          >
            Answer A: no notice given
          </button>
          <button
            type="button"
            aria-pressed={setId === "with"}
            onClick={() => setSetId("with")}
          >
            Answer B: notice given
          </button>
        </div>
        <h3>{set.title}</h3>
        <ul className={styles.claims}>
          {set.claims.map((c) => {
            const shown = revealed[c.id];
            const result = shown
              ? marks[c.id] === c.truth
                ? "right"
                : "wrong"
              : undefined;
            return (
              <li
                key={c.id}
                className={styles.claim}
                data-result={result}
                data-testid="claim"
              >
                <fieldset
                  aria-describedby={shown ? `${c.id}-verdict` : undefined}
                >
                  <legend>“{c.text}”</legend>
                  {options.map((o) => (
                    <label key={o.v}>
                      <input
                        type="radio"
                        name={c.id}
                        checked={marks[c.id] === o.v}
                        onChange={() => {
                          setMarks((m) => ({ ...m, [c.id]: o.v }));
                          setRevealed((r) => ({ ...r, [c.id]: false }));
                        }}
                      />
                      {o.label}
                    </label>
                  ))}
                </fieldset>
                {shown && (
                  <p id={`${c.id}-verdict`} className={styles.verdict}>
                    <strong>
                      {marks[c.id] === c.truth
                        ? "✓ Right. "
                        : "↻ Check again. "}
                      Verdict: {names[c.truth]}.
                    </strong>{" "}
                    {c.why}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
        <div className={styles.actions}>
          <button
            type="button"
            className="button"
            disabled={!allMarked}
            onClick={() =>
              setRevealed((r) => ({
                ...r,
                ...Object.fromEntries(set.claims.map((c) => [c.id, true])),
              }))
            }
          >
            Check my marks →
          </button>
          <button
            type="button"
            onClick={() => {
              const ids = set.claims.map((c) => c.id);
              setMarks((m) =>
                Object.fromEntries(
                  Object.entries(m).filter(([k]) => !ids.includes(k)),
                ),
              );
              setRevealed((r) => ({
                ...r,
                ...Object.fromEntries(ids.map((id) => [id, false])),
              }));
            }}
          >
            Clear this answer
          </button>
        </div>
        <div
          role="status"
          aria-live="polite"
          className={done ? styles.note : "visually-hidden"}
        >
          {done
            ? `You matched ${score} of ${set.claims.length} verdicts. Each claim now shows its own verdict and explanation, and its group is described by it.`
            : ""}
        </div>
        <p className="micro lab-disclosure">
          The library, the notice and both answers are invented and scripted.
          They are not output from a real model. They are written to show
          typical patterns: unsupported details when no source is given, and
          paraphrase slips or additions even when one is. Real error rates vary
          widely by model, task and source, and are not what this toy shows.
        </p>
      </div>
    </div>
  );
}
