"use client";
import { useState } from "react";
import styles from "./lesson.module.css";

interface RowData {
  prompt_id: string;
  model: string;
  tokens: number;
}

const DATA_ROWS: RowData[] = [
  { prompt_id: "p1", model: "gemini", tokens: 10 },
  { prompt_id: "p2", model: "gemini", tokens: 20 },
  { prompt_id: "p3", model: "claude", tokens: 30 },
  { prompt_id: "p4", model: "gpt", tokens: 15 },
  { prompt_id: "p5", model: "claude", tokens: 25 },
];

export function PandasLab() {
  const [mode, setMode] = useState<"pandas" | "loop">("pandas");
  const [metric, setMetric] = useState<"sum" | "mean">("sum");
  const [step, setStep] = useState(0);

  const maxSteps = metric === "sum" ? 5 : 6;

  function handleReset() {
    setStep(0);
  }

  function handleNextStep() {
    if (step < maxSteps) {
      setStep((prev) => prev + 1);
    }
  }

  // Calculate accumulator values up to current step
  let currentAccumulator = 0;
  for (let i = 0; i < Math.min(step, 5); i++) {
    currentAccumulator += DATA_ROWS[i].tokens;
  }

  return (
    <div
      className={styles.labBox}
      role="region"
      aria-label="Prompt Log Analyzer"
    >
      <div className={styles.labHeader}>
        <h3 className={styles.labTitle}>
          Interactive Lab: Prompt Log Analyzer
        </h3>
        <p className={styles.labDescription}>
          Toy simulator with illustrative values. Compares explicit loop steps
          against a single pandas column call without running a live Python
          runtime.
        </p>
      </div>

      <div className={styles.instructions}>
        <h4>Try it in this order:</h4>
        <ol>
          <li>
            Leave Approach on <strong>pandas 1-step call</strong>. Toggle
            between <strong>.sum()</strong> (100) and <strong>.mean()</strong>{" "}
            (20.0) to see the column evaluated in a single call.
          </li>
          <li>
            Switch Approach to <strong>Manual loop walkthrough</strong> with{" "}
            <strong>.sum()</strong> selected. Click{" "}
            <strong>Start loop &rarr;</strong>, then <strong>Next step</strong>{" "}
            four more times to watch the accumulator update row by row.
          </li>
          <li>
            Switch Operation to <strong>.mean()</strong> while in loop mode.
            Step through all 5 rows, then click{" "}
            <strong>Divide total by count &rarr;</strong> to see the extra
            division step.
          </li>
        </ol>
      </div>

      <div className={styles.controlsRow}>
        <div className={styles.controlGroup}>
          <span className={styles.controlLabel}>Approach:</span>
          <div
            className={styles.btnGroup}
            role="group"
            aria-label="Approach selector"
          >
            <button
              type="button"
              aria-pressed={mode === "pandas"}
              className={`${styles.toggleBtn} ${mode === "pandas" ? styles.toggleBtnActive : ""}`}
              onClick={() => {
                setMode("pandas");
                setStep(0);
              }}
            >
              pandas 1-step call
            </button>
            <button
              type="button"
              aria-pressed={mode === "loop"}
              className={`${styles.toggleBtn} ${mode === "loop" ? styles.toggleBtnActive : ""}`}
              onClick={() => {
                setMode("loop");
                setStep(0);
              }}
            >
              Manual loop walkthrough
            </button>
          </div>
        </div>

        <div className={styles.controlGroup}>
          <span className={styles.controlLabel}>Operation:</span>
          <div
            className={styles.btnGroup}
            role="group"
            aria-label="Operation selector"
          >
            <button
              type="button"
              aria-pressed={metric === "sum"}
              className={`${styles.toggleBtn} ${metric === "sum" ? styles.toggleBtnActive : ""}`}
              onClick={() => {
                setMetric("sum");
                setStep(0);
              }}
            >
              .sum()
            </button>
            <button
              type="button"
              aria-pressed={metric === "mean"}
              className={`${styles.toggleBtn} ${metric === "mean" ? styles.toggleBtnActive : ""}`}
              onClick={() => {
                setMetric("mean");
                setStep(0);
              }}
            >
              .mean()
            </button>
          </div>
        </div>

        {mode === "loop" && (
          <div className={styles.controlGroup}>
            <button
              type="button"
              className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
              disabled={step >= maxSteps}
              onClick={handleNextStep}
            >
              {step === 0
                ? "Start loop →"
                : step < 5
                  ? `Next step (row ${step + 1} of 5) →`
                  : step === 5 && metric === "mean"
                    ? "Divide total by count →"
                    : "Loop finished ✓"}
            </button>
            <button
              type="button"
              className={styles.actionBtn}
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        )}
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.dataTable}>
          <caption className="visually-hidden">
            Prompt evaluation dataset with prompt ID, model, and tokens
          </caption>
          <thead>
            <tr>
              <th scope="col">Index</th>
              <th scope="col">prompt_id</th>
              <th scope="col">model</th>
              <th
                scope="col"
                className={mode === "pandas" ? styles.colHighlighted : ""}
              >
                tokens
                {mode === "pandas" && (
                  <span className="visually-hidden"> (selected Series)</span>
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {DATA_ROWS.map((row, idx) => {
              const isCurrentRow = mode === "loop" && step === idx + 1;
              const isVisitedRow = mode === "loop" && step > idx + 1;
              return (
                <tr
                  key={row.prompt_id}
                  className={
                    isCurrentRow
                      ? styles.rowHighlighted
                      : isVisitedRow
                        ? styles.rowVisited
                        : ""
                  }
                >
                  <th scope="row">{idx}</th>
                  <td>{row.prompt_id}</td>
                  <td>{row.model}</td>
                  <td
                    className={mode === "pandas" ? styles.colHighlighted : ""}
                  >
                    {row.tokens}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div
        className={styles.statusCard}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {mode === "pandas" ? (
          <div>
            <div className={styles.statusTrace}>
              {metric === "sum" ? (
                <>
                  <code>df[&quot;tokens&quot;].sum()</code> &rarr;{" "}
                  <span className={styles.accumulatorBadge}>100</span>
                </>
              ) : (
                <>
                  <code>df[&quot;tokens&quot;].mean()</code> &rarr;{" "}
                  <span className={styles.accumulatorBadge}>20.0</span>
                </>
              )}
            </div>
            <p className={styles.statusMessage}>
              {metric === "sum"
                ? "pandas processes all 5 token values in one direct call, returning the total 100 without manual loop code."
                : "pandas divides the column sum by the count of rows in one direct call, returning 20.0."}
            </p>
          </div>
        ) : (
          <div>
            <div className={styles.statusTrace}>
              {step === 0 ? (
                <span>
                  Loop initialized: <code>total = 0</code>. Ready to begin
                  iteration.
                </span>
              ) : step <= 5 ? (
                <span>
                  Row {step - 1} (<code>{DATA_ROWS[step - 1].prompt_id}</code>):
                  adding <code>{DATA_ROWS[step - 1].tokens}</code> tokens &rarr;{" "}
                  <span className={styles.accumulatorBadge}>
                    total = {currentAccumulator}
                  </span>
                </span>
              ) : (
                <span>
                  Final step: <code>average = total / 5</code> &rarr;{" "}
                  <span className={styles.accumulatorBadge}>
                    average = 20.0
                  </span>
                </span>
              )}
            </div>
            <p className={styles.statusMessage}>
              {step === 0
                ? "Press Start loop to begin stepping through the records."
                : step < 5
                  ? `Pass ${step} of 5. The accumulator variable total is updated by adding the current row's token count.`
                  : step === 5
                    ? metric === "sum"
                      ? "Loop complete! The manual accumulator loop required 5 individual passes to produce the same result (100) that df['tokens'].sum() computes in one line."
                      : "All 5 rows visited. Click 'Divide total by count' to complete the average calculation."
                    : "Calculation complete! The manual approach needed a 5-pass accumulator loop plus an explicit division step to reach 20.0."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
