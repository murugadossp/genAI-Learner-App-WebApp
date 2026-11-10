"use client";

import { useState } from "react";
import styles from "./lesson.module.css";

const PARCELS = ["sent", "lost", "sent", "returned", "sent"];

type Mode = "plain" | "count" | "break" | "continue";
const MODES: { id: Mode; label: string; code: string }[] = [
  {
    id: "plain",
    label: "Plain loop",
    code: `for p in parcels:\n    print(p)`,
  },
  {
    id: "count",
    label: "Count sent",
    code: `count = 0\nfor p in parcels:\n    if p == "sent":\n        count += 1`,
  },
  {
    id: "break",
    label: "Break at lost",
    code: `for p in parcels:\n    if p == "lost":\n        break\n    print(p)`,
  },
  {
    id: "continue",
    label: "Continue past returned",
    code: `for p in parcels:\n    if p == "returned":\n        continue\n    print(p)`,
  },
];

type Action = "print" | "count" | "none" | "skip" | "stop";
type Step = { index: number; item: string; action: Action; count: number };

// Each pass of the chosen loop, computed from the same rules as the code above.
function buildSteps(mode: Mode): Step[] {
  const steps: Step[] = [];
  let count = 0;
  for (let i = 0; i < PARCELS.length; i++) {
    const item = PARCELS[i];
    if (mode === "break" && item === "lost") {
      steps.push({ index: i, item, action: "stop", count });
      break;
    }
    if (mode === "continue" && item === "returned") {
      steps.push({ index: i, item, action: "skip", count });
      continue;
    }
    if (mode === "count") {
      if (item === "sent") {
        count += 1;
        steps.push({ index: i, item, action: "count", count });
      } else {
        steps.push({ index: i, item, action: "none", count });
      }
      continue;
    }
    steps.push({ index: i, item, action: "print", count });
  }
  return steps;
}

function describe(step: Step): string {
  const pass = `Pass ${step.index + 1}: "${step.item}".`;
  switch (step.action) {
    case "print":
      return `${pass} print(p) shows ${step.item}.`;
    case "count":
      return `${pass} It matches "sent", so count += 1. count is now ${step.count}.`;
    case "none":
      return `${pass} It does not match "sent", so count stays ${step.count}.`;
    case "skip":
      return `${pass} continue skips the rest of this pass and moves to the next item.`;
    case "stop":
      return `${pass} break runs, so the loop ends here. The items after it are not visited.`;
  }
}

function chipLabel(action: Action | null): string {
  switch (action) {
    case "print":
      return "printed";
    case "count":
      return "counted";
    case "none":
      return "no change";
    case "skip":
      return "skipped";
    case "stop":
      return "break";
    default:
      return "not visited";
  }
}

export function LoopLab() {
  const [mode, setMode] = useState<Mode>("plain");
  const [done, setDone] = useState(0);
  const steps = buildSteps(mode);
  const shown = steps.slice(0, done);
  const finished = done >= steps.length;
  const last = shown[shown.length - 1];
  const count = last ? last.count : 0;
  const printed = shown.filter((s) => s.action === "print").map((s) => s.item);

  function pick(next: Mode) {
    setMode(next);
    setDone(0);
  }

  let message = "Press Next item to run pass 1.";
  if (done > 0) {
    message = describe(steps[done - 1]);
    if (finished && steps[done - 1].action !== "stop") {
      message +=
        mode === "count"
          ? ` The loop ended. print(count) would show ${count}.`
          : " The loop reached the end of the belt.";
    }
  }

  const current = done;
  const activeCode = MODES.find((m) => m.id === mode)?.code ?? "";

  return (
    <div className={`lab card ${styles.labContainer}`}>
      <p className="micro">
        Toy simulator: it runs the same rules as the code shown here. It is not
        a live Python interpreter, and the parcel values are invented.
      </p>

      <div
        className={styles.controlStack}
        role="group"
        aria-label="Which loop to run"
      >
        <span className={styles.resultLabel}>Loop to run</span>
        <div className={styles.presetRow}>
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              aria-pressed={mode === m.id}
              className={`${styles.presetBtn} ${mode === m.id ? styles.presetBtnActive : ""}`}
              onClick={() => pick(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <ol className={styles.belt} aria-label="Parcels on the belt">
        {PARCELS.map((p, i) => {
          const step = shown.find((s) => s.index === i) ?? null;
          const isNext = !step && !finished && i === current;
          const action = step ? step.action : null;
          const cls = [
            styles.chip,
            action === "stop" ? styles.chipStop : "",
            action === "skip" ? styles.chipSkip : "",
            step && action !== "stop" && action !== "skip"
              ? styles.chipDone
              : "",
            isNext ? styles.chipCurrent : "",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <li key={i} className={cls} data-testid={`chip-${i}`}>
              <span className={styles.chipText}>&quot;{p}&quot;</span>
              <span className={styles.chipStatus}>
                {isNext ? "next" : chipLabel(action)}
              </span>
            </li>
          );
        })}
      </ol>

      <div className={styles.labGrid}>
        <div className={styles.controlStack}>
          <pre className={styles.codePanel} aria-label="Code for this loop">
            <code>{activeCode}</code>
          </pre>
        </div>
        <div className={styles.resultBox}>
          <div className={styles.resultRow}>
            <span className={styles.resultLabel}>Printed so far</span>
            <code data-testid="lab-output">
              {printed.length ? printed.join(", ") : "nothing yet"}
            </code>
          </div>
          {mode === "count" && (
            <div className={styles.resultRow}>
              <span className={styles.resultLabel}>count</span>
              <code data-testid="lab-count">{count}</code>
            </div>
          )}
          <p
            className={styles.statusLine}
            role="status"
            aria-live="polite"
            data-testid="lab-message"
          >
            {message}
          </p>
        </div>
      </div>

      <div className={styles.controlRow}>
        <button
          type="button"
          className="button"
          disabled={finished}
          onClick={() => setDone((d) => Math.min(d + 1, steps.length))}
        >
          Next item →
        </button>
        <button type="button" onClick={() => setDone(0)}>
          Reset
        </button>
      </div>
    </div>
  );
}
