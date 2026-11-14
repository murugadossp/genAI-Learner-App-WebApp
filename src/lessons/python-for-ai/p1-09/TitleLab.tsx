"use client";

import { useState } from "react";
import styles from "./lesson.module.css";

// Lines of the toy code shown in the lab.
// 0 def make_title, 1 its return, 2 blank, 3 def show_title, 4 its print, 5 blank, 6 the call.
const FUNCTION_LINES = [
  'def make_title(topic, prefix="Chat"):',
  '    return prefix + ": " + topic',
  "",
  "def show_title(topic):",
  '    print("Title: " + topic)',
  "",
];

const DEF_LINES = [0, 3];

type Preset = {
  call: string;
  lines: number[];
  shown: string;
  returned: string;
  note: string;
};

const PRESETS: Preset[] = [
  {
    call: 'make_title("Pasta")',
    lines: [0, 1, 6],
    shown: "Nothing",
    returned: '"Chat: Pasta"',
    note: "The prefix was left out, so the default Chat is used. The value is handed back, but nothing is shown.",
  },
  {
    call: 'make_title("Pasta", "Recipe")',
    lines: [0, 1, 6],
    shown: "Nothing",
    returned: '"Recipe: Pasta"',
    note: 'The second argument, "Recipe", takes the place of the default for prefix in this call only.',
  },
  {
    call: 'show_title("Pasta")',
    lines: [3, 4, 6],
    shown: "Title: Pasta",
    returned: "None",
    note: "print shows the text on screen. show_title has no return line, so the caller receives None.",
  },
  {
    call: 'print(make_title("Pasta"))',
    lines: [0, 1, 6],
    shown: "Chat: Pasta",
    returned: "None, from the outer print call",
    note: "make_title returns the text, and the outer print shows it. print itself hands back None.",
  },
];

export function TitleLab() {
  const [index, setIndex] = useState(0);
  const preset = PRESETS[index];
  const lines = [...FUNCTION_LINES, preset.call];

  return (
    <div className={`lab card ${styles.labContainer}`}>
      <p className="micro">
        Toy sandbox: a made-up Python snippet with the two functions from this
        lesson, not a live interpreter. Highlighted lines ran. Dimmed body lines
        were skipped. The def lines always run to store the functions.
      </p>
      <div className={styles.inspectorCard}>
        <div
          className={styles.presetRow}
          role="group"
          aria-label="Preset calls to try"
        >
          {PRESETS.map((p, i) => (
            <button
              key={p.call}
              type="button"
              aria-pressed={index === i}
              className={`${styles.presetBtn} ${index === i ? styles.presetBtnActive : ""}`}
              onClick={() => setIndex(i)}
            >
              {p.call}
            </button>
          ))}
        </div>
        <pre
          className={styles.codeLines}
          tabIndex={0}
          role="region"
          aria-label="The two functions and the call, with the lines that ran highlighted"
        >
          {lines.map((line, i) => (
            <span
              key={`${i}-${line}`}
              className={
                preset.lines.includes(i) || DEF_LINES.includes(i)
                  ? styles.lineOn
                  : styles.lineOff
              }
            >
              {line || " "}
            </span>
          ))}
        </pre>
        <div className={styles.resultBox} role="status" aria-live="polite">
          <div className={styles.resultRow}>
            <span className={styles.resultLabel}>Shown on screen</span>
            <code data-testid="shown-result">{preset.shown}</code>
          </div>
          <div className={styles.resultRow}>
            <span className={styles.resultLabel}>
              Handed back to the caller
            </span>
            <code data-testid="returned-result">{preset.returned}</code>
          </div>
          <div className={styles.infoNote} data-testid="lab-note">
            {preset.note}
          </div>
        </div>
      </div>
    </div>
  );
}
