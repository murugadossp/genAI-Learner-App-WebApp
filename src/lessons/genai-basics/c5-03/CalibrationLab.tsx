"use client";

import { useId, useState } from "react";
import {
  CALIBRATION_CHOICES,
  JUDGE_SCENARIOS,
  WEATHER_APPS,
  type CalibrationStatus,
} from "./data";
import styles from "./lesson.module.css";

type LabMode = "inspect" | "judge";

function statusBadgeClass(status: CalibrationStatus) {
  if (status === "Well calibrated")
    return `${styles.badge} ${styles.badgeGood}`;
  if (status === "Overconfident") return `${styles.badge} ${styles.badgeWarn}`;
  return `${styles.badge} ${styles.badgeAccent}`;
}

export function CalibrationLab() {
  const [mode, setMode] = useState<LabMode>("inspect");
  const [appId, setAppId] =
    useState<(typeof WEATHER_APPS)[number]["id"]>("well-calibrated");
  const [bucketIndex, setBucketIndex] = useState<number>(3);
  const [scenarioId, setScenarioId] = useState<string>(JUDGE_SCENARIOS[0].id);
  const [judgeChoice, setJudgeChoice] = useState<CalibrationStatus | null>(
    null,
  );

  const feedbackId = useId();
  const activeApp =
    WEATHER_APPS.find((app) => app.id === appId) ?? WEATHER_APPS[0];
  const activeBucket = activeApp.buckets[bucketIndex] ?? activeApp.buckets[3];
  const activeScenario =
    JUDGE_SCENARIOS.find((item) => item.id === scenarioId) ??
    JUDGE_SCENARIOS[0];

  const gap = activeBucket.observed - activeBucket.predicted;
  const gapLabel =
    gap === 0
      ? "0 percentage-point gap"
      : `${gap > 0 ? "+" : ""}${gap} percentage-point gap`;

  function handleReset() {
    setMode("inspect");
    setAppId("well-calibrated");
    setBucketIndex(3);
    setScenarioId(JUDGE_SCENARIOS[0].id);
    setJudgeChoice(null);
  }

  return (
    <div className={styles.labBox} data-testid="calibration-lab">
      <div className={styles.labHeader}>
        <div
          className={styles.buttonRow}
          role="group"
          aria-label="Lab activity"
        >
          <button
            type="button"
            className={styles.modeBtn}
            aria-pressed={mode === "inspect"}
            onClick={() => setMode("inspect")}
          >
            1. Compare weather apps
          </button>
          <button
            type="button"
            className={styles.modeBtn}
            aria-pressed={mode === "judge"}
            onClick={() => setMode("judge")}
          >
            2. Judge the forecast
          </button>
        </div>
        <button type="button" onClick={handleReset}>
          Reset lab
        </button>
      </div>

      {mode === "inspect" ? (
        <div>
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>
              Choose an invented Riverside weather app:
            </span>
            <div className={styles.buttonRow}>
              {WEATHER_APPS.map((app) => (
                <button
                  key={app.id}
                  type="button"
                  className={styles.appBtn}
                  aria-pressed={app.id === activeApp.id}
                  onClick={() => setAppId(app.id)}
                >
                  {app.name}
                </button>
              ))}
            </div>
          </div>

          <p className="micro">{activeApp.summary}</p>

          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>
              Pick a forecast group (100 past days each):
            </span>
            <div className={styles.buttonRow}>
              {activeApp.buckets.map((bucket, index) => (
                <button
                  key={bucket.predicted}
                  type="button"
                  className={styles.bucketBtn}
                  aria-pressed={index === bucketIndex}
                  onClick={() => setBucketIndex(index)}
                >
                  {bucket.predicted}% forecast
                </button>
              ))}
            </div>
          </div>

          <div className={styles.barPanel} data-testid="reliability-panel">
            <div className={styles.barPanelHead}>
              <strong>
                Reliability bar: {activeApp.name} — {activeBucket.predicted}%
                group
              </strong>
              <span className={statusBadgeClass(activeBucket.bucketStatus)}>
                {activeBucket.bucketStatus}
              </span>
            </div>

            <div className={styles.barRow}>
              <div className={styles.barMeta}>
                <span>Predicted probability</span>
                <strong>{activeBucket.predicted}%</strong>
              </div>
              <div className={styles.barTrack} aria-hidden="true">
                <div
                  className={styles.barFillPredicted}
                  style={{ width: `${activeBucket.predicted}%` }}
                />
              </div>
            </div>

            <div className={styles.barRow}>
              <div className={styles.barMeta}>
                <span>
                  Observed rate ({activeBucket.rainyDays} of{" "}
                  {activeBucket.totalDays} days rained)
                </span>
                <strong>{activeBucket.observed}%</strong>
              </div>
              <div className={styles.barTrack} aria-hidden="true">
                <div
                  className={
                    gap === 0
                      ? styles.barFillObservedGood
                      : styles.barFillObservedGap
                  }
                  style={{ width: `${activeBucket.observed}%` }}
                />
              </div>
            </div>

            <p className="micro">
              <strong>Gap:</strong> {gapLabel}
            </p>
            <p className={styles.barNote}>{activeBucket.note}</p>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th scope="col">Forecast group</th>
                  <th scope="col">Rainy days (of 100)</th>
                  <th scope="col">Observed rate</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {activeApp.buckets.map((bucket, index) => (
                  <tr
                    key={bucket.predicted}
                    className={
                      index === bucketIndex ? styles.rowActive : undefined
                    }
                  >
                    <td>
                      <strong>{bucket.predicted}%</strong>
                    </td>
                    <td>{bucket.rainyDays}</td>
                    <td>{bucket.observed}%</td>
                    <td>
                      <span className={statusBadgeClass(bucket.bucketStatus)}>
                        {bucket.bucketStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div>
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>
              Pick an invented scenario:
            </span>
            <div className={styles.buttonRow}>
              {JUDGE_SCENARIOS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={styles.appBtn}
                  aria-pressed={item.id === activeScenario.id}
                  onClick={() => {
                    setScenarioId(item.id);
                    setJudgeChoice(null);
                  }}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.barPanel} aria-describedby={feedbackId}>
            <p>{activeScenario.prompt}</p>
            <div className={styles.barRow}>
              <div className={styles.barMeta}>
                <span>Predicted probability</span>
                <strong>{activeScenario.predicted}%</strong>
              </div>
              <div className={styles.barTrack} aria-hidden="true">
                <div
                  className={styles.barFillPredicted}
                  style={{ width: `${activeScenario.predicted}%` }}
                />
              </div>
            </div>
            <div className={styles.barRow}>
              <div className={styles.barMeta}>
                <span>Observed rate ({activeScenario.observedCountText})</span>
                <strong>{activeScenario.observed}%</strong>
              </div>
              <div className={styles.barTrack} aria-hidden="true">
                <div
                  className={
                    Math.abs(
                      activeScenario.observed - activeScenario.predicted,
                    ) <= 2
                      ? styles.barFillObservedGood
                      : styles.barFillObservedGap
                  }
                  style={{ width: `${activeScenario.observed}%` }}
                />
              </div>
            </div>
          </div>

          <span className={styles.controlLabel}>
            How would you describe this forecast?
          </span>
          <div className={styles.choiceGrid}>
            {CALIBRATION_CHOICES.map((option) => (
              <button
                key={option.value}
                type="button"
                className={styles.choiceBtn}
                aria-pressed={judgeChoice === option.value}
                aria-describedby={feedbackId}
                onClick={() => setJudgeChoice(option.value)}
              >
                <span>{option.value}</span>
                <span className={styles.choiceHint}>{option.hint}</span>
              </button>
            ))}
          </div>

          <div
            id={feedbackId}
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className={styles.feedbackBox}
            data-testid="judge-feedback"
          >
            <p>
              {judgeChoice === null
                ? "Select one calibration label above to check your reading of the bars."
                : activeScenario.feedback[judgeChoice]}
            </p>
          </div>
        </div>
      )}

      <p className={`micro ${styles.disclaimer}`}>
        Invented illustrative numbers for learning—not measurements from a live
        weather service or production model. Real calibration checks use larger
        sets of separate test examples and expect small random variation.
      </p>
    </div>
  );
}
