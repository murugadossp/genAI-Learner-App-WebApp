"use client";

import { useId, useState } from "react";
import {
  CANDIDATE_SETTINGS,
  LOANS,
  SPLIT_PRESETS,
  type SplitName,
} from "./data";
import styles from "./lesson.module.css";

type LabMode = "assign" | "workflow";
type WorkflowType = "proper" | "reused";

const DEFAULT_ASSIGNMENTS: Record<string, SplitName> = {
  ...SPLIT_PRESETS[0].assignments,
};

function summarizeSplit(
  assignments: Record<string, SplitName>,
  split: SplitName,
) {
  const rows = LOANS.filter((loan) => assignments[loan.id] === split);
  const onTime = rows.filter((loan) => loan.outcome === "On time").length;
  const late = rows.length - onTime;
  return { total: rows.length, onTime, late };
}

function diagnoseSplits(assignments: Record<string, SplitName>) {
  const train = summarizeSplit(assignments, "train");
  const val = summarizeSplit(assignments, "val");
  const test = summarizeSplit(assignments, "test");
  const notes: string[] = [];

  if (train.total === 0) {
    notes.push(
      "Training is empty—the model has no examples to learn patterns from.",
    );
  } else if (train.onTime === 0 || train.late === 0) {
    notes.push(
      "Training contains only one outcome, so the model cannot learn what separates On-time from Late loans.",
    );
  }

  if (val.total === 0 && train.total > 0 && test.total > 0) {
    notes.push(
      "Validation is empty—this train/test setup can work if you train one fixed model without comparing settings, but if you tune choices you need a separate validation split.",
    );
  } else if (val.total === 0) {
    notes.push(
      "Validation is empty—you have no separate split for comparing settings.",
    );
  } else if (val.onTime === 0 || val.late === 0) {
    notes.push(
      "Validation has only one outcome, so comparing settings on it misses the other outcome.",
    );
  }

  if (test.total === 0) {
    notes.push(
      "Test is empty—you have no held-out examples left for a final check.",
    );
  } else if (test.onTime === 0 || test.late === 0) {
    const missing = test.late === 0 ? "Late" : "On-time";
    notes.push(
      `The test split misses ${missing} loans entirely, so it cannot check how the model handles both outcomes.`,
    );
  }

  const allCovered = notes.length === 0;
  return { train, val, test, notes, allCovered };
}

export function SplitLab() {
  const [mode, setMode] = useState<LabMode>("assign");
  const [assignments, setAssignments] =
    useState<Record<string, SplitName>>(DEFAULT_ASSIGNMENTS);
  const [activePreset, setActivePreset] = useState<string>("balanced");

  const [workflow, setWorkflow] = useState<WorkflowType>("proper");
  const [selectedSettingId, setSelectedSettingId] = useState<
    "A" | "B" | "C" | "D"
  >("B");
  const [properTestChecked, setProperTestChecked] = useState(false);
  const [newLoansRevealed, setNewLoansRevealed] = useState(false);
  const [reusedChecks, setReusedChecks] = useState(1);

  const splitFeedbackId = useId();
  const workflowFeedbackId = useId();

  const diagnosis = diagnoseSplits(assignments);

  const availableSettings =
    workflow === "proper"
      ? CANDIDATE_SETTINGS.filter((s) => !s.reusedOnly)
      : CANDIDATE_SETTINGS;

  const selectedSetting =
    availableSettings.find((s) => s.id === selectedSettingId) ??
    availableSettings[0];

  function applyPreset(presetId: string) {
    const preset = SPLIT_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setAssignments({ ...preset.assignments });
    setActivePreset(preset.id);
  }

  function assignLoan(loanId: string, split: SplitName) {
    setAssignments((prev) => ({ ...prev, [loanId]: split }));
    setActivePreset("custom");
  }

  function switchWorkflow(next: WorkflowType) {
    setWorkflow(next);
    setProperTestChecked(false);
    setNewLoansRevealed(false);
    if (next === "proper") {
      setSelectedSettingId("B");
    } else {
      setSelectedSettingId("D");
      setReusedChecks(4);
    }
  }

  function selectSetting(id: "A" | "B" | "C" | "D") {
    setSelectedSettingId(id);
    setProperTestChecked(false);
    setNewLoansRevealed(false);
    if (workflow === "reused") {
      setReusedChecks((n) => n + 1);
    }
  }

  function resetAll() {
    setMode("assign");
    setAssignments({ ...DEFAULT_ASSIGNMENTS });
    setActivePreset("balanced");
    setWorkflow("proper");
    setSelectedSettingId("B");
    setProperTestChecked(false);
    setNewLoansRevealed(false);
    setReusedChecks(1);
  }

  return (
    <div className={styles.labBox} data-testid="split-lab">
      <div className={styles.labHeader}>
        <div className={styles.buttonRow} role="group" aria-label="Lab mode">
          <button
            type="button"
            className={styles.modeBtn}
            aria-pressed={mode === "assign"}
            onClick={() => setMode("assign")}
          >
            1. Assign examples to splits
          </button>
          <button
            type="button"
            className={styles.modeBtn}
            aria-pressed={mode === "workflow"}
            onClick={() => setMode("workflow")}
          >
            2. Proper check vs reusing test
          </button>
        </div>
        <button type="button" onClick={resetAll}>
          Reset lab
        </button>
      </div>

      {mode === "assign" ? (
        <div>
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>
              Try a preset split (10 invented past loans):
            </span>
            <div className={styles.buttonRow}>
              {SPLIT_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={styles.presetBtn}
                  aria-pressed={activePreset === preset.id}
                  aria-describedby={splitFeedbackId}
                  onClick={() => applyPreset(preset.id)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.summaryGrid} aria-label="Split counts">
            <div className={styles.summaryCard}>
              <strong>Training (learn)</strong>
              <div className={styles.summaryCount}>
                {diagnosis.train.total} / 10
              </div>
              <span className="micro">
                {diagnosis.train.onTime} On time · {diagnosis.train.late} Late
              </span>
            </div>
            <div className={styles.summaryCard}>
              <strong>Validation (choose)</strong>
              <div className={styles.summaryCount}>
                {diagnosis.val.total} / 10
              </div>
              <span className="micro">
                {diagnosis.val.onTime} On time · {diagnosis.val.late} Late
              </span>
            </div>
            <div className={styles.summaryCard}>
              <strong>Test (final check)</strong>
              <div className={styles.summaryCount}>
                {diagnosis.test.total} / 10
              </div>
              <span className="micro">
                {diagnosis.test.onTime} On time · {diagnosis.test.late} Late
              </span>
            </div>
          </div>

          <div
            id={splitFeedbackId}
            className={styles.feedbackBox}
            role="status"
            aria-live="polite"
            data-testid="split-feedback"
          >
            {diagnosis.allCovered ? (
              <p>
                <strong>All three roles are covered:</strong> Training has both
                outcomes to learn from, Validation can compare settings, and
                Test stays held out with both outcomes for a final check.
              </p>
            ) : (
              <>
                <p>
                  <strong>Check your split:</strong>
                </p>
                <ul className={styles.feedbackList}>
                  {diagnosis.notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <span className={styles.controlLabel}>
            Or reassign any individual loan:
          </span>
          <ul className={styles.loanList}>
            {LOANS.map((loan) => {
              const current = assignments[loan.id];
              return (
                <li key={loan.id} className={styles.loanRow}>
                  <div className={styles.loanMeta}>
                    <strong>{loan.id}</strong>
                    <span>
                      {loan.item} ({loan.term})
                    </span>
                    <span
                      className={`${styles.badge} ${
                        loan.outcome === "Late"
                          ? styles.badgeWarn
                          : styles.badgeGood
                      }`}
                    >
                      {loan.outcome}
                    </span>
                  </div>
                  <div
                    className={styles.splitToggleGroup}
                    role="group"
                    aria-label={`Split for ${loan.id}`}
                  >
                    {(
                      [
                        ["train", "Train"],
                        ["val", "Val"],
                        ["test", "Test"],
                      ] as const
                    ).map(([splitKey, label]) => (
                      <button
                        key={splitKey}
                        type="button"
                        className={styles.splitBtn}
                        aria-pressed={current === splitKey}
                        aria-label={`Assign ${loan.id} to ${label}`}
                        aria-describedby={splitFeedbackId}
                        onClick={() => assignLoan(loan.id, splitKey)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div>
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Choose a workflow:</span>
            <div className={styles.buttonRow}>
              <button
                type="button"
                className={styles.presetBtn}
                aria-pressed={workflow === "proper"}
                onClick={() => switchWorkflow("proper")}
              >
                Proper workflow (tune on Validation)
              </button>
              <button
                type="button"
                className={styles.presetBtn}
                aria-pressed={workflow === "reused"}
                onClick={() => switchWorkflow("reused")}
              >
                Reusing the test set (tune on Test)
              </button>
            </div>
          </div>

          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>
              {workflow === "proper"
                ? "Step 1: Compare candidate settings on the Validation set (20 loans):"
                : `Step 1: Try settings directly on the Test set (checked ${reusedChecks} times):`}
            </span>
            <div className={styles.settingGrid}>
              {availableSettings.map((setting) => (
                <button
                  key={setting.id}
                  type="button"
                  className={styles.settingBtn}
                  aria-pressed={selectedSetting.id === setting.id}
                  aria-describedby={workflowFeedbackId}
                  onClick={() => selectSetting(setting.id)}
                >
                  <span>{setting.label}</span>
                  <span className={styles.settingMeta}>
                    {workflow === "proper"
                      ? `Validation score: ${setting.valScore}%`
                      : `Reused Test score: ${setting.testScore}%`}
                  </span>
                  <span className={styles.settingMeta}>{setting.detail}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.buttonRow}>
            {workflow === "proper" && (
              <button
                type="button"
                className="button"
                disabled={properTestChecked}
                onClick={() => setProperTestChecked(true)}
              >
                {properTestChecked
                  ? "Final Test check complete"
                  : "Run final Test check once"}
              </button>
            )}
            <button
              type="button"
              className="button"
              disabled={workflow === "proper" && !properTestChecked}
              onClick={() => setNewLoansRevealed(true)}
            >
              Reveal next month’s new loans
            </button>
          </div>

          <div className={styles.scoreGrid} data-testid="workflow-scores">
            <div className={styles.scoreCard}>
              <strong>
                {workflow === "proper" ? "Validation score" : "Test-set checks"}
              </strong>
              <div className={styles.scoreValue}>
                {workflow === "proper"
                  ? `${selectedSetting.valScore}%`
                  : `${reusedChecks}×`}
              </div>
              <span className="micro">
                {workflow === "proper"
                  ? "Used to pick the setting"
                  : "Test set reused while tuning"}
              </span>
            </div>
            <div className={styles.scoreCard}>
              <strong>Test set score</strong>
              <div className={styles.scoreValue}>
                {workflow === "reused" || properTestChecked
                  ? `${selectedSetting.testScore}%`
                  : "Locked"}
              </div>
              <span className="micro">
                {workflow === "proper"
                  ? properTestChecked
                    ? "Checked once at the end"
                    : "Held out until you check"
                  : "Score on the reused test set"}
              </span>
            </div>
            <div className={styles.scoreCard}>
              <strong>Next month’s new loans</strong>
              <div className={styles.scoreValue}>
                {newLoansRevealed
                  ? `${selectedSetting.newLoansScore}%`
                  : "Hidden"}
              </div>
              <span className="micro">
                {newLoansRevealed
                  ? "Fresh loans the team never saw"
                  : "Reveal to see real-world gap"}
              </span>
            </div>
          </div>

          <div
            id={workflowFeedbackId}
            className={styles.feedbackBox}
            role="status"
            aria-live="polite"
            data-testid="workflow-feedback"
          >
            {workflow === "proper" ? (
              newLoansRevealed ? (
                <p>
                  Because <strong>{selectedSetting.label}</strong> was chosen on
                  Validation and checked once on Test (
                  <strong>{selectedSetting.testScore}%</strong>), the test score
                  stays close to next month’s brand-new loans (
                  <strong>{selectedSetting.newLoansScore}%</strong>).
                </p>
              ) : properTestChecked ? (
                <p>
                  One-time Test score for{" "}
                  <strong>{selectedSetting.label}</strong>:{" "}
                  <strong>{selectedSetting.testScore}%</strong>. Now reveal next
                  month’s new loans to see how well that estimate holds up.
                </p>
              ) : (
                <p>
                  Selected <strong>{selectedSetting.label}</strong> (Validation:{" "}
                  <strong>{selectedSetting.valScore}%</strong>). Run the final
                  Test check once when you are ready.
                </p>
              )
            ) : newLoansRevealed ? (
              <p>
                <strong>{selectedSetting.label}</strong> scored{" "}
                <strong>{selectedSetting.testScore}%</strong> on the reused Test
                set, but dropped to{" "}
                <strong>{selectedSetting.newLoansScore}%</strong> on next
                month’s new loans.{" "}
                {selectedSetting.id === "D"
                  ? "Tweaking special rules to fix mistakes on the test set inflated the test score without helping on fresh borrowers."
                  : "Try Setting D (tweaked for Test) to see how heavily tuning on the test set widens the gap."}
              </p>
            ) : (
              <p>
                Reusing the Test set shows{" "}
                <strong>{selectedSetting.testScore}%</strong> for{" "}
                <strong>{selectedSetting.label}</strong>. Reveal next month’s
                new loans to see whether that score holds up on unseen data.
              </p>
            )}
          </div>
        </div>
      )}

      <p className={`micro ${styles.disclaimer}`}>
        Illustrative simulation: these 10 loans and percentage scores are
        invented examples built to show split roles and test-set reuse, not
        measurements from a real library model.
      </p>
    </div>
  );
}
