"use client";

import { useState } from "react";
import {
  MISSING_STRATEGIES,
  RAW_DELIVERIES,
  TARGET_MINUTES,
  type MissingStrategyId,
} from "./data";
import styles from "./lesson.module.css";

function formatMinutes(value: number | null): string {
  if (value === null) return "—";
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded)
    ? `${rounded} min`
    : `${rounded.toFixed(1)} min`;
}

export function CleaningLab() {
  const [fixD2, setFixD2] = useState(false);
  const [fixD3, setFixD3] = useState(false);
  const [fixD4, setFixD4] = useState(false);
  const [strategy, setStrategy] = useState<MissingStrategyId>("flag");

  const allStep1Fixed = fixD2 && fixD3 && fixD4;

  // Build rows after Step 1 (format & error fixes)
  const step1Rows = RAW_DELIVERIES.map((row) => {
    const areaFixed = row.id === "D2" && fixD2;
    const unitFixed = row.id === "D3" && fixD3;
    const errorFlagged = row.id === "D4" && fixD4;

    const area = areaFixed ? row.cleanArea : row.rawArea;
    let numericTime: number | null = row.rawNumericTime;
    let displayTime = row.rawTime;
    let isMissing = row.issueKind === "missing";
    let statusText = row.issueLabel;
    let statusTone: "good" | "warn" | "accent" | "neutral" =
      row.issueKind === "clean"
        ? "good"
        : row.issueKind === "error"
          ? "warn"
          : "accent";

    if (areaFixed) {
      statusText = "Format fixed";
      statusTone = "good";
    }
    if (unitFixed) {
      numericTime = row.cleanNumericTime;
      displayTime = String(row.cleanNumericTime);
      statusText = "Format fixed";
      statusTone = "good";
    }
    if (errorFlagged) {
      numericTime = null;
      displayTime = "(marked missing)";
      isMissing = true;
      statusText = "Error → missing";
      statusTone = "accent";
    }

    return {
      ...row,
      area,
      numericTime,
      displayTime,
      isMissing,
      statusText,
      statusTone,
    };
  });

  // Compute reference averages from currently valid numeric times
  const validNumericRows = step1Rows.filter((r) => r.numericTime !== null);
  const validOverallAvg =
    validNumericRows.length > 0
      ? validNumericRows.reduce((sum, r) => sum + (r.numericTime ?? 0), 0) /
        validNumericRows.length
      : null;

  const hilltopValidRows = step1Rows.filter(
    (r) => r.area === "Hilltop" && r.numericTime !== null,
  );
  const hilltopValidAvg =
    hilltopValidRows.length > 0
      ? hilltopValidRows.reduce((sum, r) => sum + (r.numericTime ?? 0), 0) /
        hilltopValidRows.length
      : null;

  // Apply Step 2 (missing-value strategy)
  const finalRows = step1Rows.map((row) => {
    if (!row.isMissing) {
      return {
        ...row,
        dropped: false,
        finalTime: row.numericTime,
        finalDisplayTime: row.displayTime,
        missingFlag: "No",
      };
    }

    if (strategy === "drop") {
      return {
        ...row,
        dropped: true,
        finalTime: null,
        finalDisplayTime: "Dropped",
        missingFlag: "Dropped",
      };
    }

    if (strategy === "overall-avg" && validOverallAvg !== null) {
      const filled = Math.round(validOverallAvg * 10) / 10;
      return {
        ...row,
        dropped: false,
        finalTime: validOverallAvg,
        finalDisplayTime: `${filled} (filled)`,
        missingFlag: "Filled (overall avg)",
      };
    }

    if (strategy === "group-avg" && hilltopValidAvg !== null) {
      const filled = Math.round(hilltopValidAvg * 10) / 10;
      return {
        ...row,
        dropped: false,
        finalTime: hilltopValidAvg,
        finalDisplayTime: `${filled} (filled)`,
        missingFlag: "Filled (Hilltop avg)",
      };
    }

    if (strategy === "zero") {
      return {
        ...row,
        dropped: false,
        finalTime: 0,
        finalDisplayTime: "0 (filled)",
        missingFlag: "Filled (0)",
      };
    }

    // strategy === "flag"
    return {
      ...row,
      dropped: false,
      finalTime: null,
      finalDisplayTime: row.displayTime,
      missingFlag: "Yes (flagged)",
    };
  });

  const keptRows = finalRows.filter((r) => !r.dropped);
  const keptHilltopRows = keptRows.filter((r) => r.area === "Hilltop");
  const hilltopSharePct =
    keptRows.length > 0
      ? Math.round((keptHilltopRows.length / keptRows.length) * 100)
      : 0;

  const averagedRows = keptRows.filter((r) => r.finalTime !== null);
  const overallAvg =
    averagedRows.length > 0
      ? averagedRows.reduce((sum, r) => sum + (r.finalTime ?? 0), 0) /
        averagedRows.length
      : null;

  const hilltopAveragedRows = keptHilltopRows.filter(
    (r) => r.finalTime !== null,
  );
  const hilltopAvg =
    hilltopAveragedRows.length > 0
      ? hilltopAveragedRows.reduce((sum, r) => sum + (r.finalTime ?? 0), 0) /
        hilltopAveragedRows.length
      : null;

  const townCentreGroups = new Set(
    keptRows
      .filter((r) => r.area.toLowerCase() === "town centre")
      .map((r) => r.area),
  ).size;

  const unfixedCount = [!fixD2, !fixD3, !fixD4].filter(Boolean).length;
  const overTarget = overallAvg !== null && overallAvg > TARGET_MINUTES;

  let explanation = "";
  if (!allStep1Fixed) {
    explanation = `Unfixed issues remain (${unfixedCount} left): ${
      !fixD2 ? 'D2 ("town centre") splits Town Centre into two labels; ' : ""
    }${!fixD3 ? 'D3 ("20 mins") is skipped by numeric math; ' : ""}${
      !fixD4 ? "D4 (-15) pulls the overall average artificially low." : ""
    } Fix D2, D3, and D4 first, then compare the missing-value strategies.`;
  } else if (strategy === "flag") {
    explanation =
      "Keeping all 6 rows with a missing flag leaves the valid-only overall average at 26 min, while making it obvious that both missing times (D4 and D5) are in Hilltop—so Nadia can investigate mobile signal drops instead of guessing.";
  } else if (strategy === "drop") {
    explanation =
      "Dropping incomplete rows removes D4 and D5, shrinking Hilltop from 50% of the log (3 of 6) to 25% (1 of 4). The overall average looks safely under 30 min (26 min), but Hilltop is now under-represented.";
  } else if (strategy === "overall-avg") {
    explanation =
      "Filling Hilltop's two missing times with the overall average (26 min) keeps all 6 rows, but borrows faster Town Centre times—pulling Hilltop's average down from 44 min to 32 min while keeping the overall average at 26 min.";
  } else if (strategy === "group-avg") {
    explanation =
      "Filling Hilltop's two gaps with Hilltop's own known time (44 min) pushes the overall average to 32 min—above the 30-minute target. However, this assumes a single recorded Hilltop delivery is typical of all Hilltop trips.";
  } else {
    explanation =
      "Replacing missing values with 0 treats unrecorded deliveries as instant 0-minute trips. The overall average collapses to 17.3 min and Hilltop (14.7 min) falsely looks faster than Town Centre (20 min).";
  }

  function handleReset() {
    setFixD2(false);
    setFixD3(false);
    setFixD4(false);
    setStrategy("flag");
  }

  return (
    <div className={styles.labBox} data-testid="cleaning-lab">
      <div className={styles.labHeader}>
        <strong>Interactive table cleaner: Nadia’s delivery log</strong>
        <button type="button" className={styles.resetBtn} onClick={handleReset}>
          Reset table
        </button>
      </div>

      <div className={styles.controlGroup}>
        <span className={styles.controlLabel}>
          Step 1: Fix format mismatches and mark the impossible error as missing
        </span>
        <div className={styles.buttonRow}>
          <button
            type="button"
            className={styles.actionBtn}
            aria-pressed={fixD2}
            onClick={() => setFixD2((v) => !v)}
          >
            {fixD2 ? "✓ " : ""}D2: Fix “town centre” → “Town Centre”
          </button>
          <button
            type="button"
            className={styles.actionBtn}
            aria-pressed={fixD3}
            onClick={() => setFixD3((v) => !v)}
          >
            {fixD3 ? "✓ " : ""}D3: Fix “20 mins” → 20
          </button>
          <button
            type="button"
            className={styles.actionBtn}
            aria-pressed={fixD4}
            onClick={() => setFixD4((v) => !v)}
          >
            {fixD4 ? "✓ " : ""}D4: Mark −15 as missing
          </button>
          <button
            type="button"
            className={styles.actionBtn}
            aria-pressed={allStep1Fixed}
            onClick={() => {
              const next = !allStep1Fixed;
              setFixD2(next);
              setFixD3(next);
              setFixD4(next);
            }}
          >
            {allStep1Fixed ? "Undo Step 1 fixes" : "Fix all formats & errors"}
          </button>
        </div>
      </div>

      <div className={styles.controlGroup}>
        <span className={styles.controlLabel} id="strategy-group-label">
          Step 2: Choose how to handle missing values
        </span>
        <div
          className={styles.strategyGrid}
          role="group"
          aria-labelledby="strategy-group-label"
        >
          {MISSING_STRATEGIES.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={styles.strategyBtn}
              aria-pressed={strategy === opt.id}
              aria-describedby="cleaning-lab-explanation"
              onClick={() => setStrategy(opt.id)}
            >
              <span>{opt.label}</span>
              <span className={styles.strategyMeta}>{opt.shortDesc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th scope="col">Row</th>
              <th scope="col">Area</th>
              <th scope="col">Time</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {finalRows.map((row) => (
              <tr
                key={row.id}
                className={row.dropped ? styles.rowDropped : undefined}
              >
                <td>
                  <strong>{row.id}</strong>
                </td>
                <td>{row.area}</td>
                <td>{row.finalDisplayTime}</td>
                <td>
                  <span
                    className={`${styles.badge} ${
                      row.dropped
                        ? styles.badgeMuted
                        : row.statusTone === "good"
                          ? styles.badgeGood
                          : row.statusTone === "warn"
                            ? styles.badgeWarn
                            : styles.badgeAccent
                    }`}
                  >
                    {row.dropped
                      ? "Dropped"
                      : row.isMissing
                        ? row.missingFlag
                        : row.statusText}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.metricsGrid} data-testid="lab-summary">
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Overall average</span>
          <strong className={styles.metricValue}>
            {formatMinutes(overallAvg)}
          </strong>
          <span className="micro">
            {overTarget
              ? `Over ${TARGET_MINUTES}-min target`
              : `Under ${TARGET_MINUTES}-min target`}
          </span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Hilltop average</span>
          <strong className={styles.metricValue}>
            {formatMinutes(hilltopAvg)}
          </strong>
          <span className="micro">
            {hilltopAveragedRows.length} Hilltop{" "}
            {hilltopAveragedRows.length === 1 ? "time" : "times"} averaged
          </span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Rows kept</span>
          <strong className={styles.metricValue}>
            {keptRows.length} of {RAW_DELIVERIES.length}
          </strong>
          <span className="micro">
            Hilltop share: {hilltopSharePct}% ({keptHilltopRows.length} of{" "}
            {keptRows.length})
          </span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Area labels seen</span>
          <strong className={styles.metricValue}>
            {townCentreGroups > 1 ? "3 labels" : "2 labels"}
          </strong>
          <span className="micro">
            {townCentreGroups > 1
              ? 'Includes separate "town centre"'
              : "Town Centre + Hilltop"}
          </span>
        </div>
      </div>

      <div
        id="cleaning-lab-explanation"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={styles.feedbackBox}
        data-testid="lab-explanation"
      >
        <p>{explanation}</p>
      </div>

      <p className={`micro ${styles.disclaimer}`}>
        Illustrative simulation: these six deliveries and simplified cleaning
        rules are invented for this lesson to show how cleaning choices shift
        summaries. A real co-op would not decide staffing from six deliveries or
        one valid Hilltop trip.
      </p>
    </div>
  );
}
