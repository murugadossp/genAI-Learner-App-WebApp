"use client";

import { useState } from "react";
import styles from "./lesson.module.css";

type DiagnosisId = "target" | "duplicate" | "preprocessing" | "clean";

interface PipelineCase {
  id: string;
  label: string;
  title: string;
  predictionMoment: string;
  features: string;
  splitRule: string;
  prepOrder: string;
  offlineScore: number;
  liveScore: number;
  fixedOfflineScore: number;
  fixedLiveScore: number;
  fixedSummary: string;
  correctDiagnosis: DiagnosisId;
  diagnosisFeedback: Record<DiagnosisId, string>;
}

const DIAGNOSIS_OPTIONS: { id: DiagnosisId; label: string; desc: string }[] = [
  {
    id: "target",
    label: "Target leakage (future clue)",
    desc: "An input column records information only known after 8:00 AM dispatch.",
  },
  {
    id: "duplicate",
    label: "Duplicate / group overlap",
    desc: "Copied or linked records appear in both training and test splits.",
  },
  {
    id: "preprocessing",
    label: "Preprocessing leakage",
    desc: "Summary statistics were calculated across the whole table before splitting.",
  },
  {
    id: "clean",
    label: "No leakage — honest split",
    desc: "Only 8:00 AM features are used, duplicates are removed, and prep fits on training only.",
  },
];

const PIPELINE_CASES: PipelineCase[] = [
  {
    id: "refund-column",
    label: "Case 1: Refund column",
    title: "Case 1 — Delivery refund included as an input",
    predictionMoment: "8:00 AM warehouse dispatch",
    features:
      "Parcel weight, route zone, forecast rain, Customer delay refund issued",
    splitRule: "Split by week (past weeks train, last week test)",
    prepOrder: "Scaling fit on training weeks only",
    offlineScore: 97,
    liveScore: 61,
    fixedOfflineScore: 73,
    fixedLiveScore: 72,
    fixedSummary:
      "Removed Customer delay refund issued. Without the future shortcut, the model learns genuine dispatch signals and the offline score (73%) moves close to the new-week live score (72%).",
    correctDiagnosis: "target",
    diagnosisFeedback: {
      target:
        "Correct. Customer delay refund issued is recorded only after a parcel arrives late, so it leaks the answer in historical tables but is unavailable at 8:00 AM dispatch.",
      duplicate:
        "Not quite. The rows are split cleanly by week with no duplicate orders mentioned; look closely at the feature list for a column recorded after delivery.",
      preprocessing:
        "Not quite. Scaling was fit on the training weeks only, so preparation order is clean here. Check whether every input column is known at 8:00 AM.",
      clean:
        "Not quite. A 36-point drop from 97% offline to 61% live is a major warning sign. Look at Customer delay refund issued in the features list.",
    },
  },
  {
    id: "duplicate-orders",
    label: "Case 2: Duplicate rows",
    title: "Case 2 — Re-imported shipping scans split randomly",
    predictionMoment: "8:00 AM warehouse dispatch",
    features: "Parcel weight, route zone, forecast rain",
    splitRule:
      "Random row split across a log where 30% of orders appear twice after a scanner re-import",
    prepOrder: "Scaling fit on training split only",
    offlineScore: 93,
    liveScore: 64,
    fixedOfflineScore: 73,
    fixedLiveScore: 72,
    fixedSummary:
      "Deduplicated orders by Order ID and switched to a week-based split. The offline test score drops from 93% to 73%—now close to the 72% live score.",
    correctDiagnosis: "duplicate",
    diagnosisFeedback: {
      target:
        "Not quite. Weight, route zone, and forecast rain are all known at 8:00 AM dispatch. Look at the split rule instead.",
      duplicate:
        "Correct. When duplicate order rows are split randomly, one copy lands in training and the other in test, so the test rewards memorizing seen orders instead of handling new ones.",
      preprocessing:
        "Not quite. Scaling was fit on the training split only. The problem is in how repeated order rows were split.",
      clean:
        "Not quite. The 29-point gap between 93% offline and 64% live points to a split problem—check what happened to the re-imported order rows.",
    },
  },
  {
    id: "full-table-prep",
    label: "Case 3: Full-table prep",
    title: "Case 3 — Missing values filled before splitting",
    predictionMoment: "8:00 AM warehouse dispatch",
    features: "Parcel weight, route zone, expected travel time",
    splitRule: "Deduplicated by Order ID, then split by week",
    prepOrder:
      "Missing travel times filled with the whole dataset’s average and weights scaled across all rows before splitting",
    offlineScore: 79,
    liveScore: 71,
    fixedOfflineScore: 73,
    fixedLiveScore: 72,
    fixedSummary:
      "Moved imputation and scaling inside the training split only, then reused those training values on test rows. The offline score settles to 73%, close to the 72% live score.",
    correctDiagnosis: "preprocessing",
    diagnosisFeedback: {
      target:
        "Not quite. All three columns are available at 8:00 AM dispatch. Check the preparation order.",
      duplicate:
        "Not quite. Orders were already deduplicated by Order ID and split by week. Look at when the average and scaling were computed.",
      preprocessing:
        "Correct. The problem is the pipeline order: calculating averages and scaling across all rows lets held-back test information shape preparation before the split. This pipeline is not leakage-safe even if its scores happened to be close.",
      clean:
        "Not quite. Computing averages and scaling ranges across all rows before splitting lets test-set information bleed into preparation.",
    },
  },
  {
    id: "clean-pipeline",
    label: "Case 4: Clean split",
    title: "Case 4 — Time-based split with train-only prep",
    predictionMoment: "8:00 AM warehouse dispatch",
    features: "Parcel weight, route zone, forecast rain, expected travel time",
    splitRule:
      "Deduplicated by Order ID; past weeks in train, latest week in test",
    prepOrder: "Imputation and scaling fit on training weeks only",
    offlineScore: 73,
    liveScore: 72,
    fixedOfflineScore: 73,
    fixedLiveScore: 72,
    fixedSummary:
      "This pipeline is already leakage-safe: the offline score (73%) is modest, yet it closely reflects the new-week live score (72%).",
    correctDiagnosis: "clean",
    diagnosisFeedback: {
      target:
        "Not quite. Weight, route zone, forecast rain, and expected travel time are all known at 8:00 AM dispatch.",
      duplicate:
        "Not quite. Orders were deduplicated by Order ID and separated by week, so no order appears in both splits.",
      preprocessing:
        "Not quite. Imputation and scaling were fit on the training weeks only, after the split.",
      clean:
        "Correct. This pipeline follows the stated leakage checks: it deduplicates, tests a later week, and fits preparation on training weeks only. The illustrative 73% and 72% scores are close, but that gap alone does not prove an estimate is fair.",
    },
  },
];

export function LeakInspectorLab() {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    PIPELINE_CASES[0].id,
  );
  const [answers, setAnswers] = useState<Record<string, DiagnosisId>>({});
  const [fixedCases, setFixedCases] = useState<Record<string, boolean>>({});

  const activeCase =
    PIPELINE_CASES.find((c) => c.id === selectedCaseId) ?? PIPELINE_CASES[0];
  const selectedAnswer = answers[activeCase.id] ?? null;
  const isCorrect = selectedAnswer === activeCase.correctDiagnosis;
  const isFixed = Boolean(fixedCases[activeCase.id]);
  const isLeakedCase = activeCase.correctDiagnosis !== "clean";

  const displayedOffline = isFixed
    ? activeCase.fixedOfflineScore
    : activeCase.offlineScore;
  const displayedLive = isFixed
    ? activeCase.fixedLiveScore
    : activeCase.liveScore;
  const scoreGap = displayedOffline - displayedLive;

  const auditedCount = PIPELINE_CASES.filter(
    (c) => answers[c.id] === c.correctDiagnosis,
  ).length;

  function handleSelectDiagnosis(diagnosis: DiagnosisId) {
    setAnswers((prev) => ({ ...prev, [activeCase.id]: diagnosis }));
  }

  function handleApplyFix() {
    setFixedCases((prev) => ({ ...prev, [activeCase.id]: true }));
  }

  function handleReset() {
    setSelectedCaseId(PIPELINE_CASES[0].id);
    setAnswers({});
    setFixedCases({});
  }

  const feedbackId = `leak-feedback-${activeCase.id}`;

  return (
    <div className={styles.labBox} data-testid="leak-inspector-lab">
      <div className={styles.labHeader}>
        <div className={styles.headerMeta}>
          <span className="eyebrow">Interactive pipeline audit</span>
          <span className={styles.badge} data-testid="audited-count">
            Audited: {auditedCount} of {PIPELINE_CASES.length} cases
          </span>
        </div>
        <button type="button" onClick={handleReset}>
          Reset inspector
        </button>
      </div>

      <div className={styles.controlGroup}>
        <span className={styles.controlLabel}>
          1. Choose a Northside Parcel Delivery pipeline to inspect:
        </span>
        <div className={styles.buttonRow}>
          {PIPELINE_CASES.map((item) => (
            <button
              key={item.id}
              type="button"
              className={styles.caseBtn}
              aria-pressed={activeCase.id === item.id}
              onClick={() => setSelectedCaseId(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.snapshotCard} data-testid="pipeline-snapshot">
        <div className={styles.snapshotHeader}>
          <strong>{activeCase.title}</strong>
          <span className={styles.badge} data-testid="score-gap-badge">
            {scoreGap}-point offline/live score gap
          </span>
        </div>

        <ul className={styles.snapshotList}>
          <li>
            <span className={styles.snapshotKey}>Prediction moment:</span>
            <span>{activeCase.predictionMoment}</span>
          </li>
          <li>
            <span className={styles.snapshotKey}>Features used:</span>
            <span>{activeCase.features}</span>
          </li>
          <li>
            <span className={styles.snapshotKey}>Split rule:</span>
            <span>{activeCase.splitRule}</span>
          </li>
          <li>
            <span className={styles.snapshotKey}>Prep order:</span>
            <span>{activeCase.prepOrder}</span>
          </li>
        </ul>

        <div className={styles.scoreGrid}>
          <div className={styles.scoreCard}>
            <div className={styles.scoreRow}>
              <span>Offline test score</span>
              <span className={styles.scoreValue} data-testid="offline-score">
                {displayedOffline}%
              </span>
            </div>
            <div className={styles.barTrack} aria-hidden="true">
              <div
                className={styles.barFillOffline}
                style={{ width: `${displayedOffline}%` }}
              />
            </div>
          </div>

          <div className={styles.scoreCard}>
            <div className={styles.scoreRow}>
              <span>New-week live score</span>
              <span className={styles.scoreValue} data-testid="live-score">
                {displayedLive}%
              </span>
            </div>
            <div className={styles.barTrack} aria-hidden="true">
              <div
                className={styles.barFillLive}
                style={{ width: `${displayedLive}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.controlGroup}>
        <span
          className={styles.controlLabel}
          id={`diagnose-label-${activeCase.id}`}
        >
          2. Spot the leak — what is happening in this pipeline?
        </span>
        <div
          className={styles.optionGrid}
          role="group"
          aria-labelledby={`diagnose-label-${activeCase.id}`}
          aria-describedby={selectedAnswer ? feedbackId : undefined}
        >
          {DIAGNOSIS_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={styles.optionBtn}
              aria-pressed={selectedAnswer === opt.id}
              onClick={() => handleSelectDiagnosis(opt.id)}
            >
              <span className={styles.optionTitle}>{opt.label}</span>
              <span className={styles.optionDesc}>{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div
        id={feedbackId}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={selectedAnswer ? styles.feedbackBox : "visually-hidden"}
        data-testid="diagnosis-feedback"
      >
        {selectedAnswer && (
          <>
            <p>
              <strong>{isCorrect ? "✓ " : "↻ "}</strong>
              {activeCase.diagnosisFeedback[selectedAnswer]}
            </p>
            {isFixed && (
              <p data-testid="fixed-summary">{activeCase.fixedSummary}</p>
            )}
          </>
        )}
      </div>

      {isCorrect && isLeakedCase && !isFixed && (
        <div className={styles.actionRow}>
          <button type="button" className="button" onClick={handleApplyFix}>
            Apply the fix →
          </button>
        </div>
      )}

      <p className={`micro ${styles.disclaimer}`}>
        Illustrative simulation: these percentages are invented teaching values
        to show how leakage inflates offline test scores compared with live
        performance, not measurements from a live production model.
      </p>
    </div>
  );
}
