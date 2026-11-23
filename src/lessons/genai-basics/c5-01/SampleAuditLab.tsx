"use client";

import { useState } from "react";
import { AUDIT_SCENARIOS, COLLECTION_STRATEGIES } from "./data";
import styles from "./lesson.module.css";

type LabMode = "audit" | "more-data";

export function SampleAuditLab() {
  const [mode, setMode] = useState<LabMode>("audit");
  const [scenarioId, setScenarioId] = useState<string>(AUDIT_SCENARIOS[0].id);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [strategyId, setStrategyId] = useState<string>(
    COLLECTION_STRATEGIES[0].id,
  );

  const scenario =
    AUDIT_SCENARIOS.find((s) => s.id === scenarioId) ?? AUDIT_SCENARIOS[0];
  const selectedGroup =
    scenario.groups.find((g) => g.id === selectedGroupId) ?? null;
  const maxScenarioCount = Math.max(...scenario.groups.map((g) => g.count), 1);

  const strategy =
    COLLECTION_STRATEGIES.find((s) => s.id === strategyId) ??
    COLLECTION_STRATEGIES[0];
  const maxStrategyCount = Math.max(...strategy.counts.map((c) => c.count), 1);

  function handleReset() {
    setMode("audit");
    setScenarioId(AUDIT_SCENARIOS[0].id);
    setSelectedGroupId(null);
    setStrategyId(COLLECTION_STRATEGIES[0].id);
  }

  return (
    <div className={styles.labBox} data-testid="sample-audit-lab">
      <div className={styles.labHeader}>
        <div
          className={styles.buttonRow}
          role="group"
          aria-label="Lab activity mode"
        >
          <button
            type="button"
            className={styles.modeBtn}
            aria-pressed={mode === "audit"}
            onClick={() => setMode("audit")}
          >
            1. Find the missing group
          </button>
          <button
            type="button"
            className={styles.modeBtn}
            aria-pressed={mode === "more-data"}
            onClick={() => setMode("more-data")}
          >
            2. Test “more data”
          </button>
        </div>
        <button type="button" onClick={handleReset}>
          Reset lab
        </button>
      </div>

      {mode === "audit" ? (
        <div>
          <div className={styles.controlGroup}>
            <span id="audit-scenario-label" className={styles.controlLabel}>
              Choose a sample to audit
            </span>
            <div
              className={styles.buttonRow}
              role="group"
              aria-labelledby="audit-scenario-label"
            >
              {AUDIT_SCENARIOS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={styles.presetBtn}
                  aria-pressed={scenario.id === item.id}
                  onClick={() => {
                    setScenarioId(item.id);
                    setSelectedGroupId(null);
                  }}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.contextBox}>
            <p>
              <strong>Who and what it serves:</strong>{" "}
              {scenario.targetPopulation}
            </p>
            <p>
              <strong>How this sample was collected:</strong>{" "}
              {scenario.collectionNote}
            </p>
            <p className="micro">
              <strong>Grouping criterion:</strong> {scenario.criterion}
            </p>
          </div>

          <p id="audit-question">
            <strong>
              Which group or setting is missing or severely under-represented in
              this sample?
            </strong>
          </p>

          <div
            className={styles.groupGrid}
            role="group"
            aria-labelledby="audit-question"
          >
            {scenario.groups.map((group) => {
              const pct =
                group.count === 0
                  ? 0
                  : Math.max(
                      4,
                      Math.round((group.count / maxScenarioCount) * 100),
                    );
              return (
                <button
                  key={group.id}
                  type="button"
                  className={styles.groupBtn}
                  aria-pressed={selectedGroupId === group.id}
                  aria-describedby="audit-feedback-box"
                  onClick={() => setSelectedGroupId(group.id)}
                >
                  <span className={styles.groupTop}>
                    <span>{group.label}</span>
                    <span
                      className={`${styles.badge} ${
                        group.status === "Covered"
                          ? styles.badgeGood
                          : styles.badgeWarn
                      }`}
                    >
                      {group.status}
                    </span>
                  </span>
                  <span className={styles.groupMeta}>
                    {group.count.toLocaleString()} {scenario.unit} ·{" "}
                    {group.detail}
                  </span>
                  <span className={styles.barTrack} aria-hidden="true">
                    <span
                      className={styles.barFill}
                      style={{ width: `${pct}%` }}
                    />
                  </span>
                </button>
              );
            })}
          </div>

          <div
            id="audit-feedback-box"
            className={styles.feedbackBox}
            role="status"
            aria-live="polite"
            data-testid="audit-feedback"
          >
            <p>
              {selectedGroup
                ? selectedGroup.feedback
                : "Select one group above to check whether it is the coverage gap in this sample."}
            </p>
          </div>
        </div>
      ) : (
        <div>
          <div className={styles.controlGroup}>
            <span id="strategy-label" className={styles.controlLabel}>
              Pick a collection strategy for the Metro Bus Voice Helper
            </span>
            <div
              className={styles.buttonRow}
              role="group"
              aria-labelledby="strategy-label"
            >
              {COLLECTION_STRATEGIES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={styles.presetBtn}
                  aria-pressed={strategy.id === item.id}
                  onClick={() => setStrategyId(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div
            className={styles.resultSummary}
            role="status"
            aria-live="polite"
            data-testid="strategy-summary"
          >
            <span
              className={`${styles.badge} ${
                strategy.coveredCount === 4
                  ? styles.badgeGood
                  : styles.badgeWarn
              }`}
            >
              {strategy.coveredCount} of 4 settings present
            </span>
            <p>{strategy.summary}</p>
          </div>

          <div className={styles.strategyRows}>
            {strategy.counts.map((row) => {
              const pct =
                row.count === 0
                  ? 0
                  : Math.max(
                      8,
                      Math.round((row.count / maxStrategyCount) * 100),
                    );
              return (
                <div key={row.id} className={styles.strategyRow}>
                  <div className={styles.strategyRowTop}>
                    <strong>{row.label}</strong>
                    <span>
                      {row.count.toLocaleString()} clips{" "}
                      <span
                        className={`${styles.badge} ${
                          row.status === "Covered"
                            ? styles.badgeGood
                            : styles.badgeWarn
                        }`}
                      >
                        {row.status}
                      </span>
                    </span>
                  </div>
                  <div className={styles.barTrack} aria-hidden="true">
                    <div
                      className={styles.barFill}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <p className={`micro ${styles.disclaimer}`}>
        Illustrative lab: all scenarios, counts, and labels above are invented
        for this exercise rather than real measurements. “Covered” means
        examples appear in this illustrative sample (not a guarantee of
        sufficient real-world accuracy), and “Scarce” is a relative label within
        this example (8 essays versus 320–450 in each other band), not a
        universal numerical cutoff.
      </p>
    </div>
  );
}
