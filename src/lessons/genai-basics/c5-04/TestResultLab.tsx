"use client";

import { useState } from "react";
import {
  POPULATION_SIZE,
  TEST_PRESETS,
  computeBayes,
  formatCount,
  formatPct,
} from "./data";
import styles from "./lesson.module.css";

const DEFAULT_PRESET = TEST_PRESETS[0];

export function TestResultLab() {
  const [baseRatePct, setBaseRatePct] = useState(DEFAULT_PRESET.baseRatePct);
  const [detectionRatePct, setDetectionRatePct] = useState(
    DEFAULT_PRESET.detectionRatePct,
  );
  const [falseAlarmRatePct, setFalseAlarmRatePct] = useState(
    DEFAULT_PRESET.falseAlarmRatePct,
  );

  const activePreset = TEST_PRESETS.find(
    (p) =>
      p.baseRatePct === baseRatePct &&
      p.detectionRatePct === detectionRatePct &&
      p.falseAlarmRatePct === falseAlarmRatePct,
  );

  const stats = computeBayes(baseRatePct, detectionRatePct, falseAlarmRatePct);

  const tpShare =
    stats.totalPositives > 0
      ? (stats.truePositives / stats.totalPositives) * 100
      : 0;
  const fpShare = Math.max(0, 100 - tpShare);

  function applyPreset(presetId: string) {
    const preset = TEST_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setBaseRatePct(preset.baseRatePct);
    setDetectionRatePct(preset.detectionRatePct);
    setFalseAlarmRatePct(preset.falseAlarmRatePct);
  }

  function resetLab() {
    setBaseRatePct(DEFAULT_PRESET.baseRatePct);
    setDetectionRatePct(DEFAULT_PRESET.detectionRatePct);
    setFalseAlarmRatePct(DEFAULT_PRESET.falseAlarmRatePct);
  }

  function plural(count: number, singular: string, pluralWord: string) {
    return Math.round(count * 10) / 10 === 1 ? singular : pluralWord;
  }

  return (
    <div className={styles.labBox} data-testid="test-result-lab">
      <div className={styles.labHeader}>
        <strong>
          Test-result calculator ({POPULATION_SIZE.toLocaleString()} cases)
        </strong>
        <button type="button" onClick={resetLab}>
          Reset calculator
        </button>
      </div>

      <div className={styles.controlGroup}>
        <span className={styles.controlLabel}>Pick a scenario preset</span>
        <div className={styles.buttonRow}>
          {TEST_PRESETS.map((preset) => {
            const isActive = activePreset?.id === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                className={styles.presetBtn}
                aria-pressed={isActive}
                onClick={() => applyPreset(preset.id)}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
        {activePreset && (
          <p className="micro" style={{ marginTop: 8, marginBottom: 0 }}>
            {activePreset.summary}
          </p>
        )}
      </div>

      <div className={styles.sliderGrid}>
        <div className={styles.sliderCard}>
          <div className={styles.sliderTop}>
            <label htmlFor="c5-04-base-rate">Base rate (prior)</label>
            <span className={styles.sliderValue}>{baseRatePct}%</span>
          </div>
          <input
            id="c5-04-base-rate"
            type="range"
            min={1}
            max={50}
            step={1}
            value={baseRatePct}
            onChange={(e) => setBaseRatePct(Number(e.target.value))}
          />
          <p className="micro" style={{ margin: "4px 0 0" }}>
            {formatCount(stats.trulyPresent)} real cases,{" "}
            {formatCount(stats.trulyAbsent)} absent
          </p>
        </div>

        <div className={styles.sliderCard}>
          <div className={styles.sliderTop}>
            <label htmlFor="c5-04-detection-rate">Detection rate</label>
            <span className={styles.sliderValue}>{detectionRatePct}%</span>
          </div>
          <input
            id="c5-04-detection-rate"
            type="range"
            min={50}
            max={99}
            step={1}
            value={detectionRatePct}
            onChange={(e) => setDetectionRatePct(Number(e.target.value))}
          />
          <p className="micro" style={{ margin: "4px 0 0" }}>
            Share of real cases that test positive
          </p>
        </div>

        <div className={styles.sliderCard}>
          <div className={styles.sliderTop}>
            <label htmlFor="c5-04-false-alarm">False-alarm rate</label>
            <span className={styles.sliderValue}>{falseAlarmRatePct}%</span>
          </div>
          <input
            id="c5-04-false-alarm"
            type="range"
            min={1}
            max={25}
            step={1}
            value={falseAlarmRatePct}
            onChange={(e) => setFalseAlarmRatePct(Number(e.target.value))}
          />
          <p className="micro" style={{ margin: "4px 0 0" }}>
            Share of absent cases that wrongly test positive
          </p>
        </div>
      </div>

      <div className={styles.meterGroup}>
        <div className={styles.meterRow}>
          <div className={styles.meterLabel}>
            <span>Starting belief (base rate)</span>
            <strong>{formatPct(baseRatePct)}</strong>
          </div>
          <div className={styles.meterTrack} aria-hidden="true">
            <div
              className={styles.meterFillPrior}
              style={{ width: `${baseRatePct}%` }}
            />
          </div>
        </div>

        <div className={styles.meterRow}>
          <div className={styles.meterLabel}>
            <span>Updated belief after 1 positive test (posterior)</span>
            <strong data-testid="posterior-readout">
              {formatPct(stats.posteriorPct)}
            </strong>
          </div>
          <div className={styles.meterTrack} aria-hidden="true">
            <div
              className={styles.meterFillPosterior}
              style={{ width: `${Math.min(100, stats.posteriorPct)}%` }}
            />
          </div>
        </div>

        <div className={styles.meterRow}>
          <div className={styles.meterLabel}>
            <span>
              Mix of all {formatCount(stats.totalPositives)} positive tests
            </span>
            <span>
              <strong>{formatCount(stats.truePositives)}</strong> true vs{" "}
              <strong>{formatCount(stats.falsePositives)}</strong> false
            </span>
          </div>
          <div className={styles.meterTrack} aria-hidden="true">
            <div
              className={styles.meterFillTp}
              style={{ width: `${tpShare}%` }}
            />
            <div
              className={styles.meterFillFp}
              style={{ width: `${fpShare}%` }}
            />
          </div>
        </div>
      </div>

      <div
        className={styles.countSummary}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        data-testid="lab-summary"
      >
        <p>
          <strong>Updated belief: {formatPct(stats.posteriorPct)}</strong> (
          {formatCount(stats.truePositives)} true positives out of{" "}
          {formatCount(stats.totalPositives)} total positive tests).
        </p>
        <p className="micro">
          Expected counts out of {POPULATION_SIZE.toLocaleString()} cases:{" "}
          {formatCount(stats.truePositives)}{" "}
          {plural(stats.truePositives, "true positive", "true positives")},{" "}
          {formatCount(stats.falsePositives)}{" "}
          {plural(stats.falsePositives, "false positive", "false positives")},{" "}
          {formatCount(stats.falseNegatives)}{" "}
          {plural(stats.falseNegatives, "false negative", "false negatives")},
          and {formatCount(stats.trueNegatives)}{" "}
          {plural(stats.trueNegatives, "true negative", "true negatives")}.
        </p>
      </div>

      <div className={styles.secondTestBox} data-testid="second-test-readout">
        <p className="micro">
          <strong>What if a second test is also positive?</strong> If the second
          test has the same {detectionRatePct}% detection and{" "}
          {falseAlarmRatePct}% false-alarm rates and its errors are independent
          of the first test given whether the event is truly present, the
          updated belief rises from {formatPct(stats.posteriorPct)} to{" "}
          <strong>{formatPct(stats.secondTestPosteriorPct)}</strong>.
        </p>
      </div>

      <p className={`micro ${styles.disclaimer}`}>
        Illustrative calculator: counts are expected values out of{" "}
        {POPULATION_SIZE.toLocaleString()} invented cases (shown to one decimal
        place when a rate does not divide evenly) assuming exact known test
        rates.
      </p>
    </div>
  );
}
