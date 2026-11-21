"use client";

import { useState } from "react";
import styles from "./lesson.module.css";

interface PromptRow {
  index: number;
  promptId: string;
  model: "gemini" | "claude" | "gpt";
  tokens: number;
  status: "ok" | "timeout";
}

const PROMPT_LOG: PromptRow[] = [
  { index: 0, promptId: "p1", model: "gemini", tokens: 12, status: "ok" },
  { index: 1, promptId: "p2", model: "claude", tokens: 28, status: "ok" },
  { index: 2, promptId: "p3", model: "gpt", tokens: 18, status: "timeout" },
  { index: 3, promptId: "p4", model: "gemini", tokens: 35, status: "ok" },
  { index: 4, promptId: "p5", model: "claude", tokens: 40, status: "timeout" },
];

type Cond1Key = "tokens_gt_20" | "model_claude" | "model_gemini";
type Cond2Key = "status_ok" | "status_timeout" | "tokens_gt_30";
type ViewMode = "mask" | "filtered";

const COND1_OPTIONS: {
  key: Cond1Key;
  label: string;
  code: string;
  test: (row: PromptRow) => boolean;
}[] = [
  {
    key: "tokens_gt_20",
    label: "tokens > 20",
    code: 'df["tokens"] > 20',
    test: (row) => row.tokens > 20,
  },
  {
    key: "model_claude",
    label: 'model == "claude"',
    code: 'df["model"] == "claude"',
    test: (row) => row.model === "claude",
  },
  {
    key: "model_gemini",
    label: 'model == "gemini"',
    code: 'df["model"] == "gemini"',
    test: (row) => row.model === "gemini",
  },
];

const COND2_OPTIONS: {
  key: Cond2Key;
  label: string;
  code: string;
  test: (row: PromptRow) => boolean;
}[] = [
  {
    key: "status_ok",
    label: 'status == "ok"',
    code: 'df["status"] == "ok"',
    test: (row) => row.status === "ok",
  },
  {
    key: "status_timeout",
    label: 'status == "timeout"',
    code: 'df["status"] == "timeout"',
    test: (row) => row.status === "timeout",
  },
  {
    key: "tokens_gt_30",
    label: "tokens > 30",
    code: 'df["tokens"] > 30',
    test: (row) => row.tokens > 30,
  },
];

export function FilterLab() {
  const [cond1Key, setCond1Key] = useState<Cond1Key>("tokens_gt_20");
  const [combine, setCombine] = useState(false);
  const [cond2Key, setCond2Key] = useState<Cond2Key>("status_ok");
  const [viewMode, setViewMode] = useState<ViewMode>("mask");

  const cond1 = COND1_OPTIONS.find((c) => c.key === cond1Key)!;
  const cond2 = COND2_OPTIONS.find((c) => c.key === cond2Key)!;

  const evaluated = PROMPT_LOG.map((row) => {
    const m1 = cond1.test(row);
    const m2 = cond2.test(row);
    const finalMask = combine ? m1 && m2 : m1;
    return { row, m1, m2, finalMask };
  });

  const keptRows = evaluated.filter((item) => item.finalMask);
  const keptIndices = keptRows.map((item) => item.row.index).join(", ");
  const trueCount = keptRows.length;
  const falseCount = PROMPT_LOG.length - trueCount;

  const maskCode = combine ? `(${cond1.code}) & (${cond2.code})` : cond1.code;
  const activeCode =
    viewMode === "mask" ? `mask = ${maskCode}` : `filtered = df[${maskCode}]`;

  const handleReset = () => {
    setCond1Key("tokens_gt_20");
    setCombine(false);
    setCond2Key("status_ok");
    setViewMode("mask");
  };

  return (
    <div className={styles.labBox} role="region" aria-label="Row Filter Lab">
      <div className={styles.labHeader}>
        <h3 className={styles.labTitle}>Row Filter Lab</h3>
        <p className={styles.labDescription}>
          Inspect how a comparison builds a <code>True</code>/<code>False</code>{" "}
          mask first, then toggle to <code>df[mask]</code> to see which rows are
          kept while <code>df</code> stays intact.
        </p>
      </div>

      <div className={styles.instructions}>
        <h4>Try it in this order</h4>
        <ol>
          <li>
            Keep <strong>Show mask (Series)</strong> selected and click{" "}
            <strong>Condition 1</strong> presets to watch the <code>True</code>/
            <code>False</code> mask update row by row.
          </li>
          <li>
            Switch View to <strong>Apply df[mask]</strong> to see only the{" "}
            <code>True</code> rows kept with their original index labels.
          </li>
          <li>
            Turn on <strong>Combine with &amp;</strong> and pick a second
            condition (try <code>model == &quot;gemini&quot;</code> with{" "}
            <code>status == &quot;timeout&quot;</code> to see an empty 0-row
            result).
          </li>
          <li>
            Click <strong>Reset</strong> to return to the starting view.
          </li>
        </ol>
      </div>

      <div className={styles.controlsStack}>
        <div className={styles.controlGroup}>
          <span className={styles.controlLabel}>Condition 1</span>
          <div className={styles.btnGroup}>
            {COND1_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                className={`${styles.toggleBtn} ${
                  cond1Key === opt.key ? styles.toggleBtnActive : ""
                }`}
                aria-pressed={cond1Key === opt.key}
                onClick={() => setCond1Key(opt.key)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.controlGroup}>
          <span className={styles.controlLabel}>Mode</span>
          <div className={styles.btnGroup}>
            <button
              type="button"
              className={`${styles.toggleBtn} ${
                !combine ? styles.toggleBtnActive : ""
              }`}
              aria-pressed={!combine}
              onClick={() => setCombine(false)}
            >
              Single condition
            </button>
            <button
              type="button"
              className={`${styles.toggleBtn} ${
                combine ? styles.toggleBtnActive : ""
              }`}
              aria-pressed={combine}
              onClick={() => setCombine(true)}
            >
              Combine with &amp;
            </button>
          </div>
        </div>

        {combine && (
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Condition 2</span>
            <div className={styles.btnGroup}>
              {COND2_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  className={`${styles.toggleBtn} ${
                    cond2Key === opt.key ? styles.toggleBtnActive : ""
                  }`}
                  aria-pressed={cond2Key === opt.key}
                  onClick={() => setCond2Key(opt.key)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className={styles.controlGroup}>
          <span className={styles.controlLabel}>View</span>
          <div className={styles.btnGroup}>
            <button
              type="button"
              className={`${styles.toggleBtn} ${
                viewMode === "mask" ? styles.toggleBtnActive : ""
              }`}
              aria-pressed={viewMode === "mask"}
              onClick={() => setViewMode("mask")}
            >
              Show mask (Series)
            </button>
            <button
              type="button"
              className={`${styles.toggleBtn} ${
                viewMode === "filtered" ? styles.toggleBtnActive : ""
              }`}
              aria-pressed={viewMode === "filtered"}
              onClick={() => setViewMode("filtered")}
            >
              Apply df[mask]
            </button>
            <button
              type="button"
              className={styles.resetBtn}
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <pre
        className={`${styles.codePanel} ${styles.labCodePanel}`}
        tabIndex={0}
        role="region"
        aria-label="Active pandas filter expression"
      >
        <code>{activeCode}</code>
      </pre>

      <div className={styles.tableWrapper}>
        {viewMode === "mask" ? (
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th scope="col">Index</th>
                <th scope="col">{combine ? "Mask 1" : "Mask"}</th>
                {combine && <th scope="col">Mask 2</th>}
                {combine && <th scope="col">1 &amp; 2</th>}
                <th scope="col">prompt_id</th>
                <th scope="col">model</th>
                <th scope="col">tokens</th>
                <th scope="col">status</th>
              </tr>
            </thead>
            <tbody>
              {evaluated.map(({ row, m1, m2, finalMask }) => (
                <tr
                  key={row.index}
                  className={finalMask ? styles.rowKept : styles.rowDropped}
                >
                  <td>{row.index}</td>
                  <td>
                    <span
                      className={
                        m1 ? styles.maskBadgeTrue : styles.maskBadgeFalse
                      }
                    >
                      {m1 ? "True" : "False"}
                    </span>
                  </td>
                  {combine && (
                    <td>
                      <span
                        className={
                          m2 ? styles.maskBadgeTrue : styles.maskBadgeFalse
                        }
                      >
                        {m2 ? "True" : "False"}
                      </span>
                    </td>
                  )}
                  {combine && (
                    <td>
                      <span
                        className={
                          finalMask
                            ? styles.maskBadgeTrue
                            : styles.maskBadgeFalse
                        }
                      >
                        {finalMask ? "True" : "False"}
                      </span>
                    </td>
                  )}
                  <td>{row.promptId}</td>
                  <td>{row.model}</td>
                  <td>{row.tokens}</td>
                  <td>{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : keptRows.length > 0 ? (
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th scope="col">Index</th>
                <th scope="col">prompt_id</th>
                <th scope="col">model</th>
                <th scope="col">tokens</th>
                <th scope="col">status</th>
              </tr>
            </thead>
            <tbody>
              {keptRows.map(({ row }) => (
                <tr key={row.index} className={styles.rowKept}>
                  <td>{row.index}</td>
                  <td>{row.promptId}</td>
                  <td>{row.model}</td>
                  <td>{row.tokens}</td>
                  <td>{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.emptyState}>
            Empty DataFrame (0 rows matched). Filtering still succeeds without
            an error, and original <code>df</code> still has all 5 rows.
          </div>
        )}
      </div>

      <div
        className={styles.statusCard}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <p className={styles.statusSummary}>
          {viewMode === "mask"
            ? `Boolean mask (Series): ${trueCount} True, ${falseCount} False · Original df: 5 rows`
            : trueCount > 0
              ? `Filtered DataFrame: ${trueCount} ${trueCount === 1 ? "row" : "rows"} kept (index ${keptIndices}) · Original df: still 5 rows`
              : "Filtered DataFrame: 0 rows matched (empty DataFrame) · Original df: still 5 rows"}
        </p>
        <p className={styles.statusNote}>
          Toy simulator using the 5-row illustrative prompt log above — not a
          live Python runtime.
        </p>
      </div>
    </div>
  );
}
