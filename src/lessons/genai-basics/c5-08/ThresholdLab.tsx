"use client";

import { useId, useState } from "react";
import styles from "./lesson.module.css";

interface Transaction {
  id: string;
  label: string;
  score: number;
  actualFraud: boolean;
}

const TRANSACTIONS: Transaction[] = [
  {
    id: "t01",
    label: "#01 Overseas electronics",
    score: 92,
    actualFraud: true,
  },
  {
    id: "t02",
    label: "#02 Late-night gift cards",
    score: 84,
    actualFraud: true,
  },
  { id: "t03", label: "#03 First hotel abroad", score: 78, actualFraud: false },
  { id: "t04", label: "#04 Rapid fuel charges", score: 73, actualFraud: true },
  { id: "t05", label: "#05 New laptop order", score: 64, actualFraud: false },
  {
    id: "t06",
    label: "#06 Midnight wallet top-up",
    score: 58,
    actualFraud: true,
  },
  {
    id: "t07",
    label: "#07 Airline seat upgrade",
    score: 52,
    actualFraud: false,
  },
  {
    id: "t08",
    label: "#08 Four concert tickets",
    score: 47,
    actualFraud: false,
  },
  { id: "t09", label: "#09 Appliance repair", score: 41, actualFraud: false },
  {
    id: "t10",
    label: "#10 Small online test charge",
    score: 36,
    actualFraud: true,
  },
  { id: "t11", label: "#11 Hardware checkout", score: 33, actualFraud: false },
  { id: "t12", label: "#12 Weekend train pass", score: 28, actualFraud: false },
  { id: "t13", label: "#13 Pharmacy pickup", score: 25, actualFraud: false },
  { id: "t14", label: "#14 Local bookstore", score: 22, actualFraud: false },
  { id: "t15", label: "#15 Weekly groceries", score: 19, actualFraud: false },
  { id: "t16", label: "#16 Streaming renewal", score: 16, actualFraud: false },
  { id: "t17", label: "#17 Corner coffee shop", score: 14, actualFraud: false },
  { id: "t18", label: "#18 City bus fare", score: 11, actualFraud: false },
  { id: "t19", label: "#19 Morning bakery", score: 8, actualFraud: false },
  { id: "t20", label: "#20 Parking meter", score: 5, actualFraud: false },
];

const PRESETS = [
  { label: "Low (30)", value: 30 },
  { label: "Middle (50)", value: 50 },
  { label: "High (70)", value: 70 },
] as const;

const DEFAULT_THRESHOLD = 50;

function formatPercent(numerator: number, denominator: number): string {
  if (denominator === 0) return "N/A";
  return `${Math.round((numerator / denominator) * 100)}%`;
}

export function ThresholdLab() {
  const [threshold, setThreshold] = useState<number>(DEFAULT_THRESHOLD);
  const sliderId = useId();

  let tp = 0;
  let fp = 0;
  let fn = 0;
  let tn = 0;

  const evaluated = TRANSACTIONS.map((tx) => {
    const flagged = tx.score >= threshold;
    let outcome: "TP" | "FP" | "FN" | "TN";
    if (tx.actualFraud && flagged) {
      tp += 1;
      outcome = "TP";
    } else if (!tx.actualFraud && flagged) {
      fp += 1;
      outcome = "FP";
    } else if (tx.actualFraud && !flagged) {
      fn += 1;
      outcome = "FN";
    } else {
      tn += 1;
      outcome = "TN";
    }
    return { ...tx, flagged, outcome };
  });

  const total = TRANSACTIONS.length;
  const flaggedCount = tp + fp;
  const actualFraudCount = tp + fn;

  const accuracyPct = formatPercent(tp + tn, total);
  const precisionPct = formatPercent(tp, flaggedCount);
  const recallPct = formatPercent(tp, actualFraudCount);

  let tradeoffNote =
    "Middle threshold: balances catching most fraud against keeping false alarms moderate.";
  if (threshold <= 30) {
    tradeoffNote =
      "Low threshold: catches every fraud in this batch (high recall), but triggers many false alarms (lower precision).";
  } else if (threshold >= 70) {
    tradeoffNote =
      "High threshold: keeps alerts clean with few or no false alarms (higher precision), but lets more fraud slip through (lower recall).";
  }

  return (
    <div className={styles.labBox} data-testid="threshold-lab">
      <div className={styles.labHeader}>
        <strong>Northgate Bank threshold simulator (20 scored items)</strong>
        <button
          type="button"
          onClick={() => setThreshold(DEFAULT_THRESHOLD)}
          disabled={threshold === DEFAULT_THRESHOLD}
        >
          Reset threshold
        </button>
      </div>

      <div className={styles.controlGroup}>
        <label className={styles.controlLabel} htmlFor={sliderId}>
          Decision threshold (flag if risk score is at or above this cutoff)
        </label>
        <div className={styles.sliderRow}>
          <input
            id={sliderId}
            className={styles.slider}
            type="range"
            min={10}
            max={90}
            step={10}
            value={threshold}
            aria-valuetext={`Threshold ${threshold}`}
            onChange={(e) => setThreshold(Number(e.target.value))}
          />
          <span className={styles.thresholdBadge} data-testid="threshold-value">
            Cutoff: {threshold}
          </span>
        </div>
      </div>

      <div className={styles.controlGroup}>
        <span className={styles.controlLabel}>Quick presets</span>
        <div className={styles.buttonRow}>
          {PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              className={styles.presetBtn}
              aria-pressed={threshold === preset.value}
              onClick={() => setThreshold(preset.value)}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard} data-testid="metric-accuracy">
          <div className={styles.metricLabel}>Accuracy</div>
          <div className={styles.metricValue}>{accuracyPct}</div>
          <div className={styles.metricDetail}>
            {tp + tn} / {total} right overall
          </div>
        </div>
        <div className={styles.metricCard} data-testid="metric-precision">
          <div className={styles.metricLabel}>Precision</div>
          <div className={styles.metricValue}>{precisionPct}</div>
          <div className={styles.metricDetail}>
            {tp} / {flaggedCount} flagged are fraud
          </div>
        </div>
        <div className={styles.metricCard} data-testid="metric-recall">
          <div className={styles.metricLabel}>Recall</div>
          <div className={styles.metricValue}>{recallPct}</div>
          <div className={styles.metricDetail}>
            {tp} / {actualFraudCount} actual fraud caught
          </div>
        </div>
      </div>

      <div className={styles.matrixWrap}>
        <table className={styles.matrixTable} data-testid="confusion-table">
          <thead>
            <tr>
              <th scope="col">Actual \ Predicted</th>
              <th scope="col">Predicted: Fraud (Flagged)</th>
              <th scope="col">Predicted: Legitimate (Allowed)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Actual: Fraud (5)</th>
              <td className={styles.cellGood} data-testid="cell-tp">
                <span className={styles.cellCount}>{tp}</span>
                <span className={styles.cellName}>True Positive (caught)</span>
              </td>
              <td className={styles.cellWarn} data-testid="cell-fn">
                <span className={styles.cellCount}>{fn}</span>
                <span className={styles.cellName}>False Negative (missed)</span>
              </td>
            </tr>
            <tr>
              <th scope="row">Actual: Legitimate (15)</th>
              <td className={styles.cellWarn} data-testid="cell-fp">
                <span className={styles.cellCount}>{fp}</span>
                <span className={styles.cellName}>
                  False Positive (false alarm)
                </span>
              </td>
              <td className={styles.cellGood} data-testid="cell-tn">
                <span className={styles.cellCount}>{tn}</span>
                <span className={styles.cellName}>True Negative (cleared)</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        className={styles.summaryBanner}
        role="status"
        aria-live="polite"
        data-testid="tradeoff-summary"
      >
        <strong>At threshold {threshold}:</strong> {tradeoffNote}
      </div>

      <div className={styles.controlGroup}>
        <span className={styles.controlLabel}>
          All 20 transactions (sorted by invented risk score)
        </span>
        <ul className={styles.txList}>
          {evaluated.map((tx) => {
            const badgeClass =
              tx.outcome === "TP"
                ? styles.badgeGood
                : tx.outcome === "FP" || tx.outcome === "FN"
                  ? styles.badgeWarn
                  : styles.badgeNeutral;
            const badgeText =
              tx.outcome === "TP"
                ? "TP · Caught"
                : tx.outcome === "FP"
                  ? "FP · False alarm"
                  : tx.outcome === "FN"
                    ? "FN · Missed"
                    : "TN · Cleared";
            return (
              <li key={tx.id} className={styles.txItem}>
                <span className={styles.txMain}>
                  <span className={styles.txName}>{tx.label}</span>
                  <span className={styles.txMeta}>
                    Score {tx.score} · Actual:{" "}
                    {tx.actualFraud ? "Fraud" : "Legitimate"}
                  </span>
                </span>
                <span className={`${styles.badge} ${badgeClass}`}>
                  {badgeText}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <p className={`micro ${styles.disclaimer}`}>
        Illustrative simulation: these 20 transactions and their 0–100 risk
        scores are invented for this lesson. The score reflects how suspicious
        this toy model treats each item and is not necessarily a calibrated
        probability.
      </p>
    </div>
  );
}
