"use client";
import { useState } from "react";
import styles from "./lesson.module.css";

type ColumnKey = "model" | "in_tokens" | "out_tokens" | "total_tokens";

interface UsageRow {
  model: string;
  in_tokens: number;
  out_tokens: number;
  total_tokens: number;
}

const BASE_ROWS: UsageRow[] = [
  { model: "gemini", in_tokens: 100, out_tokens: 50, total_tokens: 150 },
  { model: "claude", in_tokens: 200, out_tokens: 100, total_tokens: 300 },
  { model: "gpt", in_tokens: 150, out_tokens: 50, total_tokens: 200 },
  { model: "gemini", in_tokens: 300, out_tokens: 100, total_tokens: 400 },
  { model: "claude", in_tokens: 250, out_tokens: 50, total_tokens: 300 },
];

const BASE_COLUMNS: ColumnKey[] = ["model", "in_tokens", "out_tokens"];

export function TableWorkbench() {
  const [hasDerived, setHasDerived] = useState(false);
  const [selectedCols, setSelectedCols] = useState<ColumnKey[]>([
    "model",
    "in_tokens",
  ]);
  const [singleAsList, setSingleAsList] = useState(false);
  const [lastAction, setLastAction] = useState<"select" | "derive" | "reset">(
    "select",
  );

  const availableColumns: ColumnKey[] = hasDerived
    ? [...BASE_COLUMNS, "total_tokens"]
    : BASE_COLUMNS;

  const isSingleSelected = selectedCols.length === 1;
  const isSeries = isSingleSelected && !singleAsList;

  function toggleColumn(col: ColumnKey) {
    setLastAction("select");
    setSelectedCols((prev) => {
      if (prev.includes(col)) {
        if (prev.length === 1) {
          return prev;
        }
        return prev.filter((c) => c !== col);
      }
      return [...prev, col];
    });
  }

  function handleAddDerived() {
    if (hasDerived) return;
    setHasDerived(true);
    setSelectedCols(["model", "in_tokens", "out_tokens", "total_tokens"]);
    setSingleAsList(false);
    setLastAction("derive");
  }

  function handleReset() {
    setHasDerived(false);
    setSelectedCols(["model", "in_tokens"]);
    setSingleAsList(false);
    setLastAction("reset");
  }

  const expression = isSeries
    ? `df["${selectedCols[0]}"]`
    : `df[[${selectedCols.map((c) => `"${c}"`).join(", ")}]]`;

  const resultType = isSeries ? "Series (1D)" : "DataFrame (2D)";
  const resultShape = isSeries ? "(5,)" : `(5, ${selectedCols.length})`;
  const dfShape = hasDerived ? "(5, 4)" : "(5, 3)";

  return (
    <div
      className={styles.labBox}
      role="region"
      aria-label="Column and Table Workbench"
    >
      <div className={styles.labHeader}>
        <h3 className={styles.labTitle}>
          Interactive Lab: Column &amp; Table Workbench
        </h3>
        <p className={styles.labDescription}>
          Toy simulator with illustrative values. Shows how pandas column
          selection and derived-column assignment change the returned object and{" "}
          <code>df.shape</code> without running a live Python runtime.
        </p>
      </div>

      <div className={styles.instructions}>
        <h4>Try it in this order:</h4>
        <ol>
          <li>
            Start with <strong>model</strong> and <strong>in_tokens</strong>{" "}
            selected. Notice the double brackets, the <strong>(5, 2)</strong>{" "}
            result shape, and that <code>df.shape</code> stays{" "}
            <strong>(5, 3)</strong>.
          </li>
          <li>
            Click <strong>model</strong> to deselect it so only{" "}
            <strong>in_tokens</strong> remains. Toggle{" "}
            <strong>Bracket style</strong> between single brackets (1D Series)
            and a 1-item list (2D DataFrame).
          </li>
          <li>
            Click <strong>Add total_tokens column</strong> to run{" "}
            <code>
              df[&quot;total_tokens&quot;] = df[&quot;in_tokens&quot;] +
              df[&quot;out_tokens&quot;]
            </code>{" "}
            and watch <code>df.shape</code> change from <strong>(5, 3)</strong>{" "}
            to <strong>(5, 4)</strong>.
          </li>
        </ol>
      </div>

      <div className={styles.stagePanel}>
        <div className={styles.controlGroup}>
          <span className={styles.controlLabel}>1. Select columns:</span>
          <div
            className={styles.chipGroup}
            role="group"
            aria-label="Column selector"
          >
            {availableColumns.map((col) => {
              const active = selectedCols.includes(col);
              return (
                <button
                  key={col}
                  type="button"
                  aria-pressed={active}
                  className={`${styles.toggleBtn} ${active ? styles.toggleBtnActive : ""}`}
                  onClick={() => toggleColumn(col)}
                >
                  {col}
                </button>
              );
            })}
          </div>
          {isSingleSelected && (
            <p className={styles.helperNote}>
              At least one column stays selected. Click another column to build
              a multi-column DataFrame.
            </p>
          )}
        </div>

        {isSingleSelected && (
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Bracket style:</span>
            <div
              className={styles.btnGroup}
              role="group"
              aria-label="Single column bracket style"
            >
              <button
                type="button"
                aria-pressed={!singleAsList}
                className={`${styles.toggleBtn} ${!singleAsList ? styles.toggleBtnActive : ""}`}
                onClick={() => {
                  setSingleAsList(false);
                  setLastAction("select");
                }}
              >
                df[&quot;{selectedCols[0]}&quot;] (Series)
              </button>
              <button
                type="button"
                aria-pressed={singleAsList}
                className={`${styles.toggleBtn} ${singleAsList ? styles.toggleBtnActive : ""}`}
                onClick={() => {
                  setSingleAsList(true);
                  setLastAction("select");
                }}
              >
                df[[&quot;{selectedCols[0]}&quot;]] (1-col DataFrame)
              </button>
            </div>
          </div>
        )}

        <div className={styles.controlGroup}>
          <span className={styles.controlLabel}>2. Derived column:</span>
          <button
            type="button"
            className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
            disabled={hasDerived}
            onClick={handleAddDerived}
          >
            {hasDerived ? "total_tokens added ✓" : "Add total_tokens column"}
          </button>
          <button
            type="button"
            className={styles.actionBtn}
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.dataTable}>
          <caption className="visually-hidden">
            Selected {resultType} from the AI API usage table
          </caption>
          <thead>
            <tr>
              <th scope="col">Index</th>
              {selectedCols.map((col) => (
                <th
                  key={col}
                  scope="col"
                  className={col === "total_tokens" ? styles.derivedCol : ""}
                >
                  {col}
                  {col === "total_tokens" && (
                    <span className="visually-hidden"> (derived column)</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BASE_ROWS.map((row, idx) => (
              <tr key={`${row.model}-${idx}`}>
                <th scope="row">{idx}</th>
                {selectedCols.map((col) => (
                  <td
                    key={col}
                    className={col === "total_tokens" ? styles.derivedCol : ""}
                  >
                    {row[col]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        className={styles.statusCard}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className={styles.statusTrace}>
          {lastAction === "derive" ? (
            <code>
              df[&quot;total_tokens&quot;] = df[&quot;in_tokens&quot;] +
              df[&quot;out_tokens&quot;]
            </code>
          ) : (
            <code>{expression}</code>
          )}
        </div>
        <div className={styles.metaRow}>
          {lastAction === "derive" ? (
            <>
              <span className={`${styles.metaBadge} ${styles.metaBadgeAccent}`}>
                Updated table: df (DataFrame)
              </span>
              <span className={styles.metaBadge}>
                Updated df.shape: {dfShape}
              </span>
            </>
          ) : (
            <>
              <span className={`${styles.metaBadge} ${styles.metaBadgeAccent}`}>
                Result: {resultType}
              </span>
              <span className={styles.metaBadge}>
                Result shape: {resultShape}
              </span>
              <span className={styles.metaBadge}>
                Original df.shape: {dfShape}
              </span>
            </>
          )}
        </div>
        <p className={styles.statusMessage}>
          {lastAction === "derive"
            ? "In-place assignment updates df directly (it does not return a new table). Each row adds in_tokens + out_tokens (100+50=150, 200+100=300, ...), growing df.shape from (5, 3) to (5, 4)."
            : isSeries
              ? `Single brackets with one string label return a 1D Series of shape ${resultShape}. Original df stays ${dfShape}.`
              : `Passing a Python list of ${selectedCols.length} column ${selectedCols.length === 1 ? "name" : "names"} returns a 2D DataFrame of shape ${resultShape}. Original df stays ${dfShape}.`}
        </p>
      </div>
    </div>
  );
}
