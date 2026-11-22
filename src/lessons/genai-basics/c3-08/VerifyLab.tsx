"use client";

import { useState } from "react";
import styles from "./lesson.module.css";

type StepId = "fact" | "source" | "code";

type VerdictOption = {
  id: string;
  label: string;
  description: string;
  correct: boolean;
  feedback: string;
};

const FACT_OPTIONS: VerdictOption[] = [
  {
    id: "supported",
    label: "Supported by the notice",
    description:
      "Both the $6 fee and the under-10 cutoff match the official record.",
    correct: false,
    feedback:
      "Not quite. The $6 pass matches, but the official 2026 notice says ages 5 and under enter free — not under 10.",
  },
  {
    id: "wrong-detail",
    label: "Wrong detail in the reply",
    description:
      "At least one specific number conflicts with the official notice.",
    correct: true,
    feedback:
      "Correct. Opening the primary notice catches the wrong cutoff: ages 5 and under enter free, not children under 10.",
  },
  {
    id: "cannot-tell",
    label: "Cannot tell from the notice",
    description: "The official notice does not say who enters free.",
    correct: false,
    feedback:
      "Not quite. Open the Official 2026 Notice above — it states the exact free-entry cutoff (ages 5 and under).",
  },
];

const SOURCE_OPTIONS: VerdictOption[] = [
  {
    id: "proves",
    label: "Citation proves the rule",
    description: "Naming Section 4 means the assistant verified daily booking.",
    correct: false,
    feedback:
      "Not quite. A formatted section title is not proof; open the Official 2026 Notice to see whether Section 4 exists and what the rule says.",
  },
  {
    id: "invented-and-wrong",
    label: "Invented section and wrong rule",
    description:
      "The cited section does not exist and the notice states a different rule.",
    correct: true,
    feedback:
      "Correct. The official notice is a single page with no Section 4, and lap-swim booking is required only on weekends.",
  },
  {
    id: "outdated",
    label: "Outdated 2023 flyer",
    description: "The notice confirms Section 4 existed in 2023.",
    correct: false,
    feedback:
      "Not quite. The 2026 notice is the current record, and it shows both that Section 4 does not exist and that weekday booking is not required.",
  },
];

const CODE_OPTIONS: VerdictOption[] = [
  {
    id: "ready",
    label: "Ready to publish",
    description: "Every age returns the exact price listed on the 2026 notice.",
    correct: false,
    feedback:
      "Not quite. Age 30 and Age 3 pass, but run the boundary cases Age 5 and Age 65 to see where the rule overcharges.",
  },
  {
    id: "boundary-bug",
    label: "Bug on boundary ages",
    description:
      "The rule passes normal ages but fails right on the 5 and 65 cutoffs.",
    correct: true,
    feedback:
      "Correct. The rule checks age < 5 and age > 65, so it charges $6 at age 5 (should be $0) and age 65 (should be $4).",
  },
  {
    id: "age-30-proves",
    label: "Age 30 proves it works",
    description: "Passing one standard adult age is enough to trust the rule.",
    correct: false,
    feedback:
      "Not quite. One normal case only checks the middle range; boundary cases (5 and 65) expose the edge bug.",
  },
];

type TestCase = {
  id: string;
  label: string;
  kind: string;
  age: number;
  expected: number;
  expectedNote: string;
};

const TEST_CASES: TestCase[] = [
  {
    id: "age-30",
    label: "Age 30 (normal)",
    kind: "Normal case",
    age: 30,
    expected: 6,
    expectedNote: "$6 (standard resident day pass)",
  },
  {
    id: "age-5",
    label: "Age 5 (boundary)",
    kind: "Boundary case",
    age: 5,
    expected: 0,
    expectedNote: "$0 (ages 5 and under enter free)",
  },
  {
    id: "age-65",
    label: "Age 65 (boundary)",
    kind: "Boundary case",
    age: 65,
    expected: 4,
    expectedNote: "$4 (ages 65 and older senior rate)",
  },
  {
    id: "age-3",
    label: "Age 3 (under 5)",
    kind: "Under-5 case",
    age: 3,
    expected: 0,
    expectedNote: "$0 (ages 5 and under enter free)",
  },
];

function runBuggyRule(age: number): number {
  if (age < 5) {
    return 0;
  } else if (age > 65) {
    return 4;
  } else {
    return 6;
  }
}

export function VerifyLab() {
  const [step, setStep] = useState<StepId>("fact");
  const [factNoticeOpen, setFactNoticeOpen] = useState(false);
  const [factNoticeOpened, setFactNoticeOpened] = useState(false);
  const [factChoice, setFactChoice] = useState<string | null>(null);

  const [sourceAiAsked, setSourceAiAsked] = useState(false);
  const [sourceNoticeOpen, setSourceNoticeOpen] = useState(false);
  const [sourceNoticeOpened, setSourceNoticeOpened] = useState(false);
  const [sourceChoice, setSourceChoice] = useState<string | null>(null);

  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [testedIds, setTestedIds] = useState<string[]>([]);
  const [codeChoice, setCodeChoice] = useState<string | null>(null);

  const [announcement, setAnnouncement] = useState("");

  const factSelected = FACT_OPTIONS.find((o) => o.id === factChoice) ?? null;
  const sourceSelected =
    SOURCE_OPTIONS.find((o) => o.id === sourceChoice) ?? null;
  const codeSelected = CODE_OPTIONS.find((o) => o.id === codeChoice) ?? null;

  const boundaryTested =
    testedIds.includes("age-5") || testedIds.includes("age-65");

  const factVerified = Boolean(factSelected?.correct && factNoticeOpened);
  const sourceVerified = Boolean(sourceSelected?.correct && sourceNoticeOpened);
  const optionalVerified = Boolean(codeSelected?.correct && boundaryTested);

  const requiredSolved = (factVerified ? 1 : 0) + (sourceVerified ? 1 : 0);

  const factFeedbackText =
    factSelected === null
      ? null
      : factSelected.correct && !factNoticeOpened
        ? "Right verdict — now open the Official 2026 Notice above to complete the independent check."
        : factSelected.feedback;

  const sourceFeedbackText =
    sourceSelected === null
      ? null
      : sourceSelected.correct && !sourceNoticeOpened
        ? "Right verdict — now open the Official 2026 Notice above to complete the independent check."
        : sourceSelected.feedback;

  const codeFeedbackText =
    codeSelected === null
      ? null
      : codeSelected.correct && !boundaryTested
        ? "Right verdict — now run Age 5 (boundary) or Age 65 (boundary) above to confirm the bug directly."
        : codeSelected.feedback;

  const activeTest = TEST_CASES.find((t) => t.id === selectedTestId) ?? null;
  const activeOutput = activeTest ? runBuggyRule(activeTest.age) : null;
  const activeMatch =
    activeTest !== null && activeOutput === activeTest.expected;

  function handleSelectTest(tc: TestCase) {
    setSelectedTestId(tc.id);
    if (!testedIds.includes(tc.id)) {
      setTestedIds((prev) => [...prev, tc.id]);
    }
    const actual = runBuggyRule(tc.age);
    const matchText = actual === tc.expected ? "Match" : "Mismatch";
    setAnnouncement(
      `${tc.label}: rule returned $${actual}, official notice says $${tc.expected}. ${matchText}.`,
    );
  }

  function handleReset() {
    setStep("fact");
    setFactNoticeOpen(false);
    setFactNoticeOpened(false);
    setFactChoice(null);
    setSourceAiAsked(false);
    setSourceNoticeOpen(false);
    setSourceNoticeOpened(false);
    setSourceChoice(null);
    setSelectedTestId(null);
    setTestedIds([]);
    setCodeChoice(null);
    setAnnouncement("Lab reset. All verification steps cleared.");
  }

  return (
    <div className={styles.lab} data-testid="verify-lab">
      <div className={styles.labHeader}>
        <div className={styles.progress} data-testid="lab-progress">
          Required checks verified: {requiredSolved} of 2
          {optionalVerified ? " · Optional code check verified" : ""}
        </div>
        <button type="button" onClick={handleReset}>
          Reset lab
        </button>
      </div>

      <div
        className={styles.tabBar}
        role="group"
        aria-label="Verification steps"
      >
        <button
          type="button"
          className={`${styles.tabBtn} ${step === "fact" ? styles.tabBtnActive : ""}`}
          aria-pressed={step === "fact"}
          onClick={() => setStep("fact")}
        >
          1. Fact check{factVerified ? " ✓" : ""}
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${step === "source" ? styles.tabBtnActive : ""}`}
          aria-pressed={step === "source"}
          onClick={() => setStep("source")}
        >
          2. Source check{sourceVerified ? " ✓" : ""}
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${step === "code" ? styles.tabBtnActive : ""}`}
          aria-pressed={step === "code"}
          onClick={() => setStep("code")}
        >
          3. Code check (optional){optionalVerified ? " ✓" : ""}
        </button>
      </div>

      {step === "fact" && (
        <div data-testid="step-fact">
          <div className={styles.claimBox}>
            <span className={styles.claimLabel}>
              Maya’s AI draft — Fact claim
            </span>
            <p>
              “Resident day passes cost $6, and children under 10 enter free.”
            </p>
          </div>

          <div className={styles.actionRow}>
            <button
              type="button"
              className={`${styles.actionBtn} ${factNoticeOpen ? styles.actionBtnActive : ""}`}
              aria-pressed={factNoticeOpen}
              onClick={() => {
                const next = !factNoticeOpen;
                setFactNoticeOpen(next);
                if (next) setFactNoticeOpened(true);
                setAnnouncement(
                  next
                    ? "Opened Official 2026 Notice for the fact check."
                    : "Closed Official 2026 Notice.",
                );
              }}
            >
              {factNoticeOpen
                ? "Hide Official 2026 Notice"
                : "Open Official 2026 Notice"}
            </button>
          </div>

          {factNoticeOpen && (
            <div
              className={`${styles.evidenceBox} ${styles.evidenceGood}`}
              data-testid="fact-notice"
            >
              <strong>
                Official Riverbend Pool Notice (2026) —
                riverbend-pool.example/passes
              </strong>
              <p className="micro">Single-page notice, updated April 2026.</p>
              <ul>
                <li>Resident day pass: $6 per visit.</li>
                <li>
                  <strong>Ages 5 and under</strong> enter free ($0).
                </li>
                <li>
                  <strong>Ages 65 and older</strong> pay $4 per visit.
                </li>
              </ul>
            </div>
          )}

          <fieldset
            className={styles.verdictGroup}
            aria-describedby={factSelected ? "fact-feedback" : undefined}
          >
            <legend>
              Step 1 verdict: what did your independent check show?
            </legend>
            {FACT_OPTIONS.map((opt) => (
              <label className={styles.verdictOption} key={opt.id}>
                <input
                  type="radio"
                  name="fact-verdict"
                  checked={factChoice === opt.id}
                  onChange={() => {
                    setFactChoice(opt.id);
                    setAnnouncement(
                      opt.correct && !factNoticeOpened
                        ? "Right verdict — now open the Official 2026 Notice above to complete the independent check."
                        : opt.feedback,
                    );
                  }}
                />
                <span>
                  <strong>{opt.label}</strong>
                  <span className={styles.verdictDesc}>{opt.description}</span>
                </span>
              </label>
            ))}
          </fieldset>

          {factSelected && factFeedbackText && (
            <div
              id="fact-feedback"
              data-testid="fact-feedback"
              className={`${styles.feedbackBox} ${
                factVerified ? styles.feedbackCorrect : styles.feedbackRetry
              }`}
            >
              {factFeedbackText}
            </div>
          )}
        </div>
      )}

      {step === "source" && (
        <div data-testid="step-source">
          <div className={styles.claimBox}>
            <span className={styles.claimLabel}>
              Maya’s AI draft — Cited claim
            </span>
            <p>
              “Lap-swim lanes require advance booking every day (Source:
              Riverbend Pool Notice, Section 4: Daily Lane Policy).”
            </p>
          </div>

          <div className={styles.actionRow}>
            <button
              type="button"
              className={`${styles.actionBtn} ${sourceAiAsked ? styles.actionBtnActive : ""}`}
              aria-pressed={sourceAiAsked}
              onClick={() => {
                const next = !sourceAiAsked;
                setSourceAiAsked(next);
                setAnnouncement(
                  next
                    ? "Asked the same AI chat if it is sure. It smoothly repeated Section 4 without checking."
                    : "Hid the AI follow-up reply.",
                );
              }}
            >
              Ask AI: “Are you sure?”
            </button>
            <button
              type="button"
              className={`${styles.actionBtn} ${sourceNoticeOpen ? styles.actionBtnActive : ""}`}
              aria-pressed={sourceNoticeOpen}
              onClick={() => {
                const next = !sourceNoticeOpen;
                setSourceNoticeOpen(next);
                if (next) setSourceNoticeOpened(true);
                setAnnouncement(
                  next
                    ? "Opened Official 2026 Notice for the source check."
                    : "Closed Official 2026 Notice.",
                );
              }}
            >
              {sourceNoticeOpen
                ? "Hide Official 2026 Notice"
                : "Open Official 2026 Notice"}
            </button>
          </div>

          {sourceAiAsked && (
            <div
              className={`${styles.evidenceBox} ${styles.evidenceWarn}`}
              data-testid="source-ai-reply"
            >
              <strong>Same AI chat reply (not an independent check)</strong>
              <p>
                “Yes — daily lap-lane booking is listed under Section 4 of the
                Riverbend Pool Notice.”
              </p>
              <p className="micro">
                Scripted example: asking the same chat can produce confident
                reassurance even when the citation is invented.
              </p>
            </div>
          )}

          {sourceNoticeOpen && (
            <div
              className={`${styles.evidenceBox} ${styles.evidenceGood}`}
              data-testid="source-notice"
            >
              <strong>
                Official Riverbend Pool Notice (2026) —
                riverbend-pool.example/passes
              </strong>
              <p className="micro">
                Single-page notice (no numbered sections; replaces archived 2023
                flyer).
              </p>
              <ul>
                <li>
                  <strong>Lap-swim lane booking:</strong> required{" "}
                  <strong>only on weekends</strong> (Saturday and Sunday).
                </li>
                <li>No booking needed Monday through Friday.</li>
              </ul>
            </div>
          )}

          <fieldset
            className={styles.verdictGroup}
            aria-describedby={sourceSelected ? "source-feedback" : undefined}
          >
            <legend>
              Step 2 verdict: what did opening the actual source show?
            </legend>
            {SOURCE_OPTIONS.map((opt) => (
              <label className={styles.verdictOption} key={opt.id}>
                <input
                  type="radio"
                  name="source-verdict"
                  checked={sourceChoice === opt.id}
                  onChange={() => {
                    setSourceChoice(opt.id);
                    setAnnouncement(
                      opt.correct && !sourceNoticeOpened
                        ? "Right verdict — now open the Official 2026 Notice above to complete the independent check."
                        : opt.feedback,
                    );
                  }}
                />
                <span>
                  <strong>{opt.label}</strong>
                  <span className={styles.verdictDesc}>{opt.description}</span>
                </span>
              </label>
            ))}
          </fieldset>

          {sourceSelected && sourceFeedbackText && (
            <div
              id="source-feedback"
              data-testid="source-feedback"
              className={`${styles.feedbackBox} ${
                sourceVerified ? styles.feedbackCorrect : styles.feedbackRetry
              }`}
            >
              {sourceFeedbackText}
            </div>
          )}
        </div>
      )}

      {step === "code" && (
        <div data-testid="step-code">
          <div className={styles.claimBox}>
            <span className={styles.claimLabel}>
              Maya’s AI draft — Optional day-pass rule (whole-year ages,
              illustrative pseudocode)
            </span>
            <pre className={styles.codeBlock}>
              <code>{`if age < 5       -> $0   (under 5)
else if age > 65 -> $4   (over 65)
else             -> $6   (everyone else)`}</code>
            </pre>
            <p className="micro">
              Official 2026 notice rule: ages 5 and under = $0; ages 65 and
              older = $4; everyone else = $6.
            </p>
          </div>

          <p>
            <strong>Run test cases</strong> ({testedIds.length} of{" "}
            {TEST_CASES.length} tried):
          </p>
          <div className={styles.testGrid}>
            {TEST_CASES.map((tc) => (
              <button
                key={tc.id}
                type="button"
                className={`${styles.actionBtn} ${selectedTestId === tc.id ? styles.actionBtnActive : ""}`}
                aria-pressed={selectedTestId === tc.id}
                onClick={() => handleSelectTest(tc)}
              >
                {tc.label}
              </button>
            ))}
          </div>

          {activeTest && activeOutput !== null && (
            <div className={styles.testResult} data-testid="code-test-result">
              <div className={styles.resultRow}>
                <span>Test input</span>
                <strong>
                  Age {activeTest.age} ({activeTest.kind})
                </strong>
              </div>
              <div className={styles.resultRow}>
                <span>Generated rule output</span>
                <strong>${activeOutput}</strong>
              </div>
              <div className={styles.resultRow}>
                <span>Official 2026 notice</span>
                <strong>{activeTest.expectedNote}</strong>
              </div>
              <div className={styles.resultRow}>
                <span>Result</span>
                <span
                  className={activeMatch ? styles.badgePass : styles.badgeFail}
                >
                  {activeMatch ? "Match" : "Mismatch — boundary bug"}
                </span>
              </div>
            </div>
          )}

          <fieldset
            className={styles.verdictGroup}
            aria-describedby={codeSelected ? "code-feedback" : undefined}
          >
            <legend>
              Optional Step 3 verdict: what did running test cases show?
            </legend>
            {CODE_OPTIONS.map((opt) => (
              <label className={styles.verdictOption} key={opt.id}>
                <input
                  type="radio"
                  name="code-verdict"
                  checked={codeChoice === opt.id}
                  onChange={() => {
                    setCodeChoice(opt.id);
                    setAnnouncement(
                      opt.correct && !boundaryTested
                        ? "Right verdict — now run Age 5 (boundary) or Age 65 (boundary) above to confirm the bug directly."
                        : opt.feedback,
                    );
                  }}
                />
                <span>
                  <strong>{opt.label}</strong>
                  <span className={styles.verdictDesc}>{opt.description}</span>
                </span>
              </label>
            ))}
          </fieldset>

          {codeSelected && codeFeedbackText && (
            <div
              id="code-feedback"
              data-testid="code-feedback"
              className={`${styles.feedbackBox} ${
                optionalVerified ? styles.feedbackCorrect : styles.feedbackRetry
              }`}
            >
              {codeFeedbackText}
            </div>
          )}
        </div>
      )}

      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="visually-hidden"
        data-testid="lab-live"
      >
        {announcement}
      </div>
    </div>
  );
}
