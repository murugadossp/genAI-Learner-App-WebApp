"use client";

import { useState } from "react";
import styles from "./lesson.module.css";

const PRESETS = [1500, 1000, 999, 500, 200, 199, 0];
const MAX = 1500;

// Line indexes in the chain shown below.
// 0 tokens_left = ..., 1 if test, 2 full body, 3 elif test, 4 summary body, 5 else, 6 new chat body, 7 print
// Highlighted: the assignment and print lines, the tests Python checked, and the body that ran.
function branchFor(value: number) {
  if (value >= 1000) {
    return {
      action: "send_full_history",
      tested: [1],
      on: [2],
      checked: "1000 or more? was True, so the chain stopped there.",
    };
  }
  if (value >= 200) {
    return {
      action: "send_summary",
      tested: [1, 3],
      on: [4],
      checked:
        "1000 or more? was False, then 200 or more? was True, so the chain stopped there.",
    };
  }
  return {
    action: "start_new_chat",
    tested: [1, 3],
    on: [5, 6],
    checked:
      "Both tests were False, so the else branch ran. else has no test of its own.",
  };
}

export function IfLab() {
  const [value, setValue] = useState(500);
  const branch = branchFor(value);

  const lines = [
    `tokens_left = ${value}`,
    "if tokens_left >= 1000:",
    '    action = "send_full_history"',
    "elif tokens_left >= 200:",
    '    action = "send_summary"',
    "else:",
    '    action = "start_new_chat"',
    "print(action)",
  ];

  return (
    <div className={`lab card ${styles.labContainer}`}>
      <p className="micro">
        Toy sandbox: invented values and the same chain as the lesson, not a
        live Python interpreter. Highlighted lines are the assignment, the
        print, the tests Python checked, and the branch that ran. Dimmed lines
        were skipped.
      </p>
      <div className={styles.inspectorCard}>
        <div className={styles.sliderRow}>
          <label htmlFor="tokens-left-slider" className={styles.resultLabel}>
            tokens_left (invented value):{" "}
            <strong data-testid="token-value">{value}</strong>
          </label>
          <input
            id="tokens-left-slider"
            type="range"
            min={0}
            max={MAX}
            step={1}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
          />
        </div>
        <div
          className={styles.presetRow}
          role="group"
          aria-label="Preset token values"
        >
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={value === p}
              className={`${styles.presetBtn} ${value === p ? styles.presetBtnActive : ""}`}
              onClick={() => setValue(p)}
            >
              {p}
            </button>
          ))}
        </div>
        <pre
          className={styles.codeLines}
          tabIndex={0}
          role="region"
          aria-label="The if, elif, else chain with the lines that ran highlighted"
        >
          {lines.map((line, i) => (
            <span
              key={line}
              className={
                i === 0 ||
                i === 7 ||
                branch.tested.includes(i) ||
                branch.on.includes(i)
                  ? styles.lineOn
                  : styles.lineOff
              }
            >
              {line}
            </span>
          ))}
        </pre>
        <div className={styles.resultBox} role="status" aria-live="polite">
          <div className={styles.resultRow}>
            <span className={styles.resultLabel}>Printed</span>
            <code data-testid="action-result">{branch.action}</code>
          </div>
          <div className={styles.infoNote} data-testid="checked-note">
            {branch.checked}
          </div>
        </div>
      </div>
    </div>
  );
}
