"use client";

import { useId, useState } from "react";
import styles from "./lesson.module.css";

type ReferenceClass = "Spam" | "Wanted";

type EmailItem = {
  id: string;
  subject: string;
  context: string;
  score: number;
  reference: ReferenceClass;
};

const EMAILS: EmailItem[] = [
  {
    id: "cruise",
    subject: "Win a FREE cruise today!!!",
    context: "Mass giveaway scam.",
    score: 0.94,
    reference: "Spam",
  },
  {
    id: "bank",
    subject: "Urgent: verify your bank password now",
    context: "Fake bank message trying to steal a password.",
    score: 0.8,
    reference: "Spam",
  },
  {
    id: "promo",
    subject: "FLASH SALE: 30% off mystery novels this weekend",
    context: "Real publisher offer Sam signed up for.",
    score: 0.66,
    reference: "Wanted",
  },
  {
    id: "seo",
    subject: "Quick question about your website listing",
    context: "Unsolicited sales pitch Sam considers spam.",
    score: 0.52,
    reference: "Spam",
  },
  {
    id: "cookbook",
    subject: "Can you hold 2 copies of the new cookbook?",
    context: "Customer order question.",
    score: 0.26,
    reference: "Wanted",
  },
  {
    id: "invoice",
    subject: "Invoice #412 for Tuesday's book delivery",
    context: "Regular supplier invoice.",
    score: 0.1,
    reference: "Wanted",
  },
];

const PRESETS = [
  { label: "Flag more (0.20)", value: 0.2 },
  { label: "Default (0.50)", value: 0.5 },
  { label: "Flag less (0.75)", value: 0.75 },
] as const;

const DEFAULT_THRESHOLD = 0.5;

function formatScore(value: number) {
  return value.toFixed(2);
}

export function ThresholdLab() {
  const [threshold, setThreshold] = useState<number>(DEFAULT_THRESHOLD);
  const sliderId = useId();
  const statusId = useId();

  const evaluated = EMAILS.map((email) => {
    const decision = email.score >= threshold ? "Spam" : "Inbox";
    let outcome: "Match" | "False alarm" | "Missed spam" = "Match";
    if (decision === "Spam" && email.reference === "Wanted") {
      outcome = "False alarm";
    } else if (decision === "Inbox" && email.reference === "Spam") {
      outcome = "Missed spam";
    }
    return { ...email, decision, outcome };
  });

  const flaggedCount = evaluated.filter((e) => e.decision === "Spam").length;
  const inboxCount = evaluated.length - flaggedCount;
  const falseAlarms = evaluated.filter(
    (e) => e.outcome === "False alarm",
  ).length;
  const missedSpam = evaluated.filter(
    (e) => e.outcome === "Missed spam",
  ).length;

  let summaryNote = "";
  if (falseAlarms === 0 && missedSpam === 0) {
    summaryNote = "Every email matched Sam's reference label at this cutoff.";
  } else if (falseAlarms > 0 && missedSpam === 0) {
    summaryNote = `Cutoff ${formatScore(threshold)} catches all 3 spam emails, but causes ${falseAlarms} false ${falseAlarms === 1 ? "alarm" : "alarms"} on wanted mail.`;
  } else if (falseAlarms === 0 && missedSpam > 0) {
    summaryNote = `Cutoff ${formatScore(threshold)} causes 0 false alarms, so all wanted mail stays in Inbox, but ${missedSpam} spam ${missedSpam === 1 ? "email slips" : "emails slip"} through.`;
  } else {
    summaryNote = `Cutoff ${formatScore(threshold)} produces both kinds of mistake at once: ${falseAlarms} false ${falseAlarms === 1 ? "alarm" : "alarms"} and ${missedSpam} missed spam.`;
  }

  return (
    <div className={styles.labBox} data-testid="threshold-lab">
      <div className={styles.labHeader}>
        <h3>Sam&rsquo;s bookstore spam cutoff</h3>
        <button
          type="button"
          className={styles.presetBtn}
          onClick={() => setThreshold(DEFAULT_THRESHOLD)}
        >
          Reset to 0.50
        </button>
      </div>

      <div className={styles.sliderBlock}>
        <div className={styles.sliderTop}>
          <label className={styles.sliderLabel} htmlFor={sliderId}>
            Spam cutoff (flag as Spam at or above this score)
          </label>
          <span className={styles.sliderValue} data-testid="threshold-value">
            {formatScore(threshold)}
          </span>
        </div>
        <input
          id={sliderId}
          type="range"
          min={0.1}
          max={0.95}
          step={0.05}
          value={threshold}
          aria-describedby={statusId}
          className={styles.rangeInput}
          onChange={(e) => setThreshold(Number(e.target.value))}
        />
        <div className={styles.sliderScale} aria-hidden="true">
          <span>0.10 (flag more)</span>
          <span>0.50</span>
          <span>0.95 (flag less)</span>
        </div>
      </div>

      <div className={styles.controlGroup}>
        <span className={styles.controlLabel}>Quick cutoffs</span>
        <div className={styles.buttonRow}>
          {PRESETS.map((preset) => {
            const active = Math.abs(threshold - preset.value) < 0.001;
            return (
              <button
                key={preset.label}
                type="button"
                className={styles.presetBtn}
                aria-pressed={active}
                onClick={() => setThreshold(preset.value)}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Flagged as Spam</span>
          <span className={styles.statValue} data-testid="flagged-count">
            {flaggedCount}
          </span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Kept in Inbox</span>
          <span className={styles.statValue} data-testid="inbox-count">
            {inboxCount}
          </span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>False alarms</span>
          <span className={styles.statValue} data-testid="false-alarm-count">
            {falseAlarms}
          </span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Missed spam</span>
          <span className={styles.statValue} data-testid="missed-spam-count">
            {missedSpam}
          </span>
        </div>
      </div>

      <div
        id={statusId}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={styles.statusNote}
        data-testid="lab-status"
      >
        <p>{summaryNote}</p>
      </div>

      <ul className={styles.emailList}>
        {evaluated.map((email) => (
          <li
            key={email.id}
            className={styles.emailCard}
            data-testid={`email-${email.id}`}
          >
            <div className={styles.emailTop}>
              <span className={styles.emailSubject}>
                &ldquo;{email.subject}&rdquo;
              </span>
              <span className={styles.emailScore}>
                Score {formatScore(email.score)}
              </span>
            </div>
            <p className={styles.emailNote}>{email.context}</p>
            <div className={styles.barTrack} aria-hidden="true">
              <div
                className={styles.barFill}
                style={{ width: `${Math.round(email.score * 100)}%` }}
              />
              <div
                className={styles.cutoffMarker}
                style={{ left: `${Math.round(threshold * 100)}%` }}
              />
            </div>
            <div className={styles.badgeRow}>
              <span className={styles.badge}>
                Sam&rsquo;s label: {email.reference}
              </span>
              <span className={`${styles.badge} ${styles.badgeAccent}`}>
                Filter: {email.decision}
              </span>
              <span
                className={`${styles.badge} ${
                  email.outcome === "Match"
                    ? styles.badgeGood
                    : styles.badgeWarn
                }`}
              >
                {email.outcome}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <p className="micro">
        Illustrative example: these six emails and fixed spam scores are
        invented for this lesson so you can see how moving the cutoff changes
        decisions without changing the model.
      </p>
    </div>
  );
}
