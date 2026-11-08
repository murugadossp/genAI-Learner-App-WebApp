"use client";
import { useState } from "react";
import styles from "./lesson.module.css";

type Level = {
  id: string;
  label: string;
  evidence: string;
  dist: { year: string; pct: number }[];
  draws: string[];
};
const levels: Level[] = [
  {
    id: "many",
    label: "Many documents agree",
    evidence:
      "In this toy world, 40 imaginary documents state the opening year.",
    dist: [
      { year: "1962", pct: 92 },
      { year: "1965", pct: 4 },
      { year: "1926", pct: 3 },
      { year: "1952", pct: 1 },
    ],
    draws: ["1962", "1962", "1962", "1962"],
  },
  {
    id: "thin",
    label: "One passing mention",
    evidence:
      "In this toy world, a single imaginary document hints at the year.",
    dist: [
      { year: "1962", pct: 40 },
      { year: "1965", pct: 25 },
      { year: "1926", pct: 20 },
      { year: "1952", pct: 15 },
    ],
    draws: ["1962", "1965", "1962", "1926"],
  },
  {
    id: "none",
    label: "Nothing at all",
    evidence: "In this toy world, no imaginary document mentions the library.",
    dist: [
      { year: "1958", pct: 25 },
      { year: "1961", pct: 25 },
      { year: "1964", pct: 25 },
      { year: "1968", pct: 25 },
    ],
    draws: ["1964", "1958", "1961", "1968"],
  },
];

export function BlankLab() {
  const [levelId, setLevelId] = useState("many");
  const [draw, setDraw] = useState(0);
  const level = levels.find((l) => l.id === levelId) ?? levels[0];
  const year = level.draws[draw % level.draws.length];
  const sentence = `The Lantern Bay Library opened in ${year}.`;
  return (
    <div className="lab">
      <div className="lab-head">
        <strong>01 / Complete the sentence</strong>
        <span className="pill">SIMULATION</span>
      </div>
      <div className="lab-body">
        <div className={styles.grid}>
          <div>
            <p className="micro">
              Choose how much the toy model’s training text says about the
              Lantern Bay Library, an invented place. Then ask it to complete
              the sentence.
            </p>
            <div className={styles.levels} role="group" aria-label="Evidence">
              {levels.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  aria-pressed={l.id === levelId}
                  onClick={() => {
                    setLevelId(l.id);
                    setDraw(0);
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <p className="micro">{level.evidence}</p>
            <div className={styles.actions}>
              <button type="button" onClick={() => setDraw((d) => d + 1)}>
                Ask again
              </button>
              <button type="button" onClick={() => setDraw(0)}>
                Reset draws
              </button>
            </div>
            <p className="micro">
              Draw number {(draw % level.draws.length) + 1} of{" "}
              {level.draws.length}, scripted so you can repeat it.
            </p>
          </div>
          <div className={styles.panel}>
            <p className={styles.prompt}>The Lantern Bay Library opened in …</p>
            <h3 style={{ margin: "1rem 0 0.5rem" }}>Candidate years</h3>
            {level.dist.map((r) => (
              <div
                className={styles.row}
                key={r.year}
                data-picked={r.year === year}
                data-testid="year-row"
              >
                <span>{r.year}</span>
                <span className={styles.bar} aria-hidden="true">
                  <span style={{ width: `${r.pct}%` }} />
                </span>
                <span>{r.pct}%</span>
              </div>
            ))}
            <h3 style={{ margin: "1rem 0 0.5rem" }}>What you would read</h3>
            <p className={styles.answer} data-testid="sentence">
              {sentence}
            </p>
            <p className={styles.note}>
              {level.id === "many"
                ? "Strong evidence: one year dominates, and the sentence is right to the extent that the documents are."
                : level.id === "thin"
                  ? "Weak evidence: in this toy several years compete. The sentence still reads exactly the same."
                  : "No evidence: in this toy the years are equally likely, yet a complete, confident-sounding sentence still comes out. Ask again and the year changes while the tone does not."}
            </p>
            <div role="status" aria-live="polite" className="visually-hidden">
              {sentence}
            </div>
          </div>
        </div>
        <p className="micro lab-disclosure">
          Everything here is invented: the library, the years, the percentages
          and the “draws”, which follow a fixed script instead of true random
          sampling. A real model scores a very large vocabulary with a neural
          network, not a four-item list, and a real chat reply does not show you
          these percentages. The toy only illustrates that a completion can be
          produced whether or not evidence exists.
        </p>
      </div>
    </div>
  );
}
