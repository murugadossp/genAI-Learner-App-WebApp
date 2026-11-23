"use client";

import { useState } from "react";
import styles from "./lesson.module.css";

type SliceKey = "overall" | "accent" | "line" | "intersectional";
type MetricKey = "accuracy" | "fnRate" | "fpRate";

interface CellCounts {
  id: string;
  label: string;
  accent: "Local" | "Regional";
  line: "Quiet" | "Noisy";
  tp: number;
  fn: number;
  tn: number;
  fp: number;
}

const ATOMIC_CELLS: CellCounts[] = [
  {
    id: "local-quiet",
    label: "Local + Quiet",
    accent: "Local",
    line: "Quiet",
    tp: 38,
    fn: 2,
    tn: 38,
    fp: 2,
  },
  {
    id: "local-noisy",
    label: "Local + Noisy",
    accent: "Local",
    line: "Noisy",
    tp: 34,
    fn: 6,
    tn: 34,
    fp: 6,
  },
  {
    id: "regional-quiet",
    label: "Regional + Quiet",
    accent: "Regional",
    line: "Quiet",
    tp: 9,
    fn: 1,
    tn: 9,
    fp: 1,
  },
  {
    id: "regional-noisy",
    label: "Regional + Noisy",
    accent: "Regional",
    line: "Noisy",
    tp: 3,
    fn: 7,
    tn: 7,
    fp: 3,
  },
];

interface GroupRow {
  id: string;
  label: string;
  total: number;
  sharePct: number;
  urgentTotal: number;
  routineTotal: number;
  correct: number;
  fn: number;
  fp: number;
  smallSampleNote?: string;
}

function aggregate(
  id: string,
  label: string,
  cells: CellCounts[],
  smallSampleNote?: string,
): GroupRow {
  const tp = cells.reduce((s, c) => s + c.tp, 0);
  const fn = cells.reduce((s, c) => s + c.fn, 0);
  const tn = cells.reduce((s, c) => s + c.tn, 0);
  const fp = cells.reduce((s, c) => s + c.fp, 0);
  const total = tp + fn + tn + fp;
  return {
    id,
    label,
    total,
    sharePct: Math.round((total / 200) * 100),
    urgentTotal: tp + fn,
    routineTotal: tn + fp,
    correct: tp + tn,
    fn,
    fp,
    smallSampleNote,
  };
}

function buildRows(slice: SliceKey): GroupRow[] {
  if (slice === "overall") {
    return [aggregate("overall", "All test calls", ATOMIC_CELLS)];
  }
  if (slice === "accent") {
    return [
      aggregate(
        "local",
        "Local accent",
        ATOMIC_CELLS.filter((c) => c.accent === "Local"),
      ),
      aggregate(
        "regional",
        "Regional accent",
        ATOMIC_CELLS.filter((c) => c.accent === "Regional"),
      ),
    ];
  }
  if (slice === "line") {
    return [
      aggregate(
        "quiet",
        "Quiet line",
        ATOMIC_CELLS.filter((c) => c.line === "Quiet"),
      ),
      aggregate(
        "noisy",
        "Noisy line",
        ATOMIC_CELLS.filter((c) => c.line === "Noisy"),
      ),
    ];
  }
  return ATOMIC_CELLS.map((cell) =>
    aggregate(
      cell.id,
      cell.label,
      [cell],
      cell.accent === "Regional"
        ? "Small sample (10 urgent, 10 routine): 1 call shifts each error rate by 10 points."
        : undefined,
    ),
  );
}

function getMetric(row: GroupRow, metric: MetricKey) {
  if (metric === "accuracy") {
    const pct = Math.round((row.correct / row.total) * 100);
    return {
      pct,
      fraction: `${row.correct} of ${row.total} calls correct`,
      isHigherWorse: false,
    };
  }
  if (metric === "fnRate") {
    const pct = Math.round((row.fn / row.urgentTotal) * 100);
    return {
      pct,
      fraction: `${row.fn} of ${row.urgentTotal} urgent calls missed`,
      isHigherWorse: true,
    };
  }
  const pct = Math.round((row.fp / row.routineTotal) * 100);
  return {
    pct,
    fraction: `${row.fp} of ${row.routineTotal} routine calls flagged`,
    isHigherWorse: true,
  };
}

const SLICE_OPTIONS: { key: SliceKey; label: string }[] = [
  { key: "overall", label: "Overall (combined)" },
  { key: "accent", label: "By accent" },
  { key: "line", label: "By line quality" },
  { key: "intersectional", label: "Accent + line quality" },
];

const METRIC_OPTIONS: { key: MetricKey; label: string }[] = [
  { key: "accuracy", label: "Accuracy" },
  { key: "fnRate", label: "Missed urgent (FN rate)" },
  { key: "fpRate", label: "False alarms (FP rate)" },
];

function describeView(slice: SliceKey, metric: MetricKey, gap: number): string {
  if (slice === "overall") {
    if (metric === "accuracy") {
      return "Combined across all 200 calls, accuracy is 86%. Switch to a subgroup view to see what this average hides.";
    }
    if (metric === "fnRate") {
      return "Combined across all 100 truly urgent calls, 16% are missed. Split by group to see who bears those misses.";
    }
    return "Combined across all 100 truly routine calls, 12% trigger false alarms. Split by group to check whether that rate is even.";
  }
  if (slice === "accent") {
    if (metric === "accuracy") {
      return `Splitting by accent reveals a ${gap}-percentage-point accuracy gap: Local accent (80% of calls) scores 90%, while Regional accent (20% of calls) scores 70%.`;
    }
    if (metric === "fnRate") {
      return `Splitting by accent reveals a ${gap}-percentage-point gap in missed urgent calls: 10% for Local accent versus 40% for Regional accent.`;
    }
    return `Splitting by accent shows a ${gap}-percentage-point gap in false alarms: 10% for Local accent versus 20% for Regional accent.`;
  }
  if (slice === "line") {
    if (metric === "accuracy") {
      return `Splitting by line quality reveals a ${gap}-percentage-point accuracy gap: 94% on quiet lines versus 78% on noisy lines.`;
    }
    if (metric === "fnRate") {
      return `Splitting by line quality shows a ${gap}-percentage-point gap in missed urgent calls: 6% on quiet lines versus 26% on noisy lines.`;
    }
    return `Splitting by line quality shows a ${gap}-percentage-point gap in false alarms: 6% on quiet lines versus 18% on noisy lines.`;
  }
  if (metric === "accuracy") {
    return `Combining accent and line quality reveals a ${gap}-percentage-point spread: Regional + Quiet scores 90%, while Regional + Noisy drops to 50%.`;
  }
  if (metric === "fnRate") {
    return `Combining accent and line quality reveals a ${gap}-percentage-point spread in missed urgent calls: 5% for Local + Quiet versus 70% (7 of 10 urgent calls) for Regional + Noisy.`;
  }
  return `Combining accent and line quality shows a ${gap}-percentage-point spread in false alarms: 5% for Local + Quiet versus 30% for Regional + Noisy.`;
}

export function SubgroupLab() {
  const [slice, setSlice] = useState<SliceKey>("overall");
  const [metric, setMetric] = useState<MetricKey>("accuracy");

  const rows = buildRows(slice);
  const scored = rows.map((row) => ({
    row,
    metricData: getMetric(row, metric),
  }));

  const values = scored.map((s) => s.metricData.pct);
  const maxVal = Math.max(...values);
  const minVal = Math.min(...values);
  const gap = maxVal - minVal;

  const worstValue = scored[0].metricData.isHigherWorse ? maxVal : minVal;

  return (
    <div className={styles.labBox} data-testid="subgroup-lab">
      <div className={styles.labHeader}>
        <p className={styles.labTitle}>
          CityBus Voice Desk — Evaluation Slicer
        </p>
        <button
          type="button"
          className={styles.resetBtn}
          onClick={() => {
            setSlice("overall");
            setMetric("accuracy");
          }}
        >
          Reset view
        </button>
      </div>

      <div className={styles.controlGroup}>
        <span className={styles.controlLabel} id="slice-label">
          1. Choose how to slice the 200 test calls
        </span>
        <div
          className={styles.buttonRow}
          role="group"
          aria-labelledby="slice-label"
        >
          {SLICE_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              className={styles.controlBtn}
              aria-pressed={slice === opt.key}
              onClick={() => setSlice(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.controlGroup}>
        <span className={styles.controlLabel} id="metric-label">
          2. Choose which metric to inspect
        </span>
        <div
          className={styles.buttonRow}
          role="group"
          aria-labelledby="metric-label"
        >
          {METRIC_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              className={styles.controlBtn}
              aria-pressed={metric === opt.key}
              onClick={() => setMetric(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.summaryStrip}>
        <span>
          <strong>Showing:</strong>{" "}
          {SLICE_OPTIONS.find((s) => s.key === slice)?.label} ·{" "}
          {METRIC_OPTIONS.find((m) => m.key === metric)?.label}
        </span>
        <span className={styles.gapBadge} data-testid="gap-badge">
          {slice === "overall"
            ? "Combined view (no split)"
            : `Gap: ${gap} percentage points`}
        </span>
      </div>

      <div className={styles.subgroupGrid} data-testid="subgroup-results">
        {scored.map(({ row, metricData }) => {
          const isWorst = slice !== "overall" && metricData.pct === worstValue;
          return (
            <div
              key={row.id}
              className={`${styles.subgroupCard} ${
                isWorst ? styles.subgroupCardAlert : ""
              }`}
              data-testid={`group-card-${row.id}`}
            >
              <div className={styles.subgroupTop}>
                <span className={styles.subgroupName}>{row.label}</span>
                <span className={styles.subgroupScore}>{metricData.pct}%</span>
              </div>
              <p className={styles.subgroupMeta}>
                {row.total} calls ({row.sharePct}% of test set) ·{" "}
                {metricData.fraction}
              </p>
              <div className={styles.barTrack} aria-hidden="true">
                <div
                  className={`${styles.barFill} ${
                    isWorst ? styles.barFillWarn : ""
                  }`}
                  style={{ width: `${metricData.pct}%` }}
                />
              </div>
              {row.smallSampleNote && (
                <p className={styles.subgroupNote}>{row.smallSampleNote}</p>
              )}
            </div>
          );
        })}
      </div>

      <p
        className={styles.liveSummary}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        data-testid="lab-summary"
      >
        {describeView(slice, metric, gap)}
      </p>

      <p className={`micro ${styles.disclaimer}`}>
        Illustrative lab: all 200 calls and outcomes are invented for this
        lesson, not measurements from a real transit system.
      </p>
    </div>
  );
}
