"use client";

import { useId, useState } from "react";
import styles from "./lesson.module.css";

type ReqStatus = {
  passed: boolean;
  note: string;
};

type DraftState = {
  versionLabel: string;
  sentenceSummary: string;
  text: string;
  reqs: [ReqStatus, ReqStatus, ReqStatus];
  insight: string;
};

type Round1Key = "vague-polish" | "targeted-facts" | "vague-shorten";
type Round2Key = "r2-1" | "r2-2" | "r2-3";

type ChoiceOption<K extends string> = {
  key: K;
  tag: string;
  prompt: string;
  result: DraftState;
};

const REQ_LABELS = [
  "Swap rule: bring one book to take one book",
  "Time and place: Saturday, 2 p.m. at Oak Park Pavilion",
  "Plain and short: 3 short sentences or fewer, plain everyday words",
] as const;

const DRAFT_1: DraftState = {
  versionLabel: "Draft 1 (starting draft)",
  sentenceSummary: "3 short plain sentences",
  text: "Come to Oak Park Pavilion on Saturday afternoon for a neighborhood book swap. Everyone in the area is welcome to browse books and meet other readers. Stop by anytime and find a new story to take home.",
  reqs: [
    {
      passed: false,
      note: "Missing: does not state the bring-one-take-one rule.",
    },
    { passed: false, note: "Missing 2 p.m.: only says “Saturday afternoon”." },
    { passed: true, note: "Meets limit: 3 short sentences in plain words." },
  ],
  insight:
    "Draft 1 is short and plain, but it leaves out the swap rule and the 2 p.m. start time. Pick a Round 1 follow-up note below.",
};

const DRAFT_3_ALL_PASS: DraftState = {
  versionLabel: "Draft 3 (after Round 2)",
  sentenceSummary: "3 short plain sentences",
  text: "Join neighbors for a book swap this Saturday at 2 p.m. at Oak Park Pavilion. Bring one book to take one book. Stop by to trade stories and find your next read.",
  reqs: [
    { passed: true, note: "Includes “Bring one book to take one book.”" },
    { passed: true, note: "Includes Saturday, 2 p.m., and Oak Park Pavilion." },
    { passed: true, note: "Meets limit: 3 short sentences in plain words." },
  ],
  insight:
    "All three original requirements pass. Naming both what to change and what to keep prevented drift, so Sam can stop iterating.",
};

const ROUND_1_OPTIONS: ChoiceOption<Round1Key>[] = [
  {
    key: "vague-polish",
    tag: "Vague polish",
    prompt: "Make it better and more exciting.",
    result: {
      versionLabel: "Draft 2A (after Round 1)",
      sentenceSummary: "3 flowery sentences",
      text: "Step into a vibrant afternoon of literary magic at Oak Park Pavilion this Saturday! Join neighbors for an unforgettable celebration of storytelling, fresh inspiration, and community spirit. Let your weekend sparkle with pages waiting to be turned!",
      reqs: [
        { passed: false, note: "Still missing the bring-one-take-one rule." },
        { passed: false, note: "Still missing the 2 p.m. start time." },
        {
          passed: false,
          note: "Slipped: uses flowery hype instead of plain everyday words.",
        },
      ],
      insight:
        "Polish did not improve the flyer: the wording sounds livelier, yet both missing details stayed missing and the plain-language requirement broke.",
    },
  },
  {
    key: "targeted-facts",
    tag: "Targeted — add missing facts",
    prompt:
      "Add two missing facts: the time is 2 p.m., and the rule is bring one book to take one book.",
    result: {
      versionLabel: "Draft 2B (after Round 1)",
      sentenceSummary: "4 sentences (too long)",
      text: "Come to Oak Park Pavilion this Saturday at 2 p.m. for a neighborhood book swap. Bring one book to take one book, and browse a wide table of novels, cookbooks, and children’s stories from neighbors across the street. You can stay to chat about favorite authors, share reading tips, and pick out a book for the week ahead. Everyone in the neighborhood is welcome to join.",
      reqs: [
        { passed: true, note: "Includes “Bring one book to take one book.”" },
        {
          passed: true,
          note: "Includes Saturday, 2 p.m., and Oak Park Pavilion.",
        },
        {
          passed: false,
          note: "Drift caught: grew to 4 sentences with wordy middle lines.",
        },
      ],
      insight:
        "Naming the missing facts fixed both gaps, but because the note did not say to keep three short sentences, Draft 2B drifted to 4 sentences. Now choose a Round 2 revision.",
    },
  },
  {
    key: "vague-shorten",
    tag: "Vague shorten",
    prompt: "Make it shorter and punchier.",
    result: {
      versionLabel: "Draft 2C (after Round 1)",
      sentenceSummary: "2 short plain sentences",
      text: "Join our neighborhood book swap at Oak Park Pavilion this Saturday afternoon! Drop in and pick up your next read.",
      reqs: [
        { passed: false, note: "Still missing the bring-one-take-one rule." },
        { passed: false, note: "Still says “Saturday afternoon” (no 2 p.m.)." },
        {
          passed: true,
          note: "Meets limit: 2 short sentences in plain words.",
        },
      ],
      insight:
        "Shortening kept the flyer brief, but it did not name the missing swap rule or 2 p.m. start time, so both gaps remained.",
    },
  },
];

const ROUND_2_AFTER_FACTS: ChoiceOption<Round2Key>[] = [
  {
    key: "r2-1",
    tag: "Vague tighten (forgets what to keep)",
    prompt: "Tighten this up and make it snappier.",
    result: {
      versionLabel: "Draft 3A (after Round 2)",
      sentenceSummary: "2 short plain sentences",
      text: "Join neighbors at Oak Park Pavilion this Saturday for a book swap. Bring one book to take one book.",
      reqs: [
        { passed: true, note: "Includes “Bring one book to take one book.”" },
        {
          passed: false,
          note: "Drift caught: tightening dropped “2 p.m.” from the draft.",
        },
        {
          passed: true,
          note: "Meets limit: 2 short sentences in plain words.",
        },
      ],
      insight:
        "Because the note did not say what to keep, tightening cut the flyer to two sentences but accidentally dropped 2 p.m. Try the targeted Round 2 note instead.",
    },
  },
  {
    key: "r2-2",
    tag: "Targeted — what to change + what to keep",
    prompt:
      "Cut this to three short, plain sentences. Keep Saturday at 2 p.m., Oak Park Pavilion, and “bring one book to take one book”.",
    result: DRAFT_3_ALL_PASS,
  },
  {
    key: "r2-3",
    tag: "Over-polish",
    prompt:
      "Rewrite this in a warm, poetic tone while keeping all the details.",
    result: {
      versionLabel: "Draft 3C (after Round 2)",
      sentenceSummary: "4 poetic sentences",
      text: "Gather beneath the welcoming roof of Oak Park Pavilion this Saturday at 2 p.m. for a joyful exchange of cherished tales. Bring one book to take one book, and let every shared volume weave a new thread of friendship across our street. Linger over whispered recommendations and carry a fresh literary treasure home. Every neighbor’s story has a place at our table.",
      reqs: [
        { passed: true, note: "Includes “Bring one book to take one book.”" },
        {
          passed: true,
          note: "Includes Saturday, 2 p.m., and Oak Park Pavilion.",
        },
        {
          passed: false,
          note: "Still fails: 4 sentences and poetic wording instead of plain language.",
        },
      ],
      insight:
        "All facts stayed in, yet asking for poetic polish moved the flyer further from the plain, three-sentence requirement.",
    },
  },
];

const ROUND_2_AFTER_MISSING: ChoiceOption<Round2Key>[] = [
  {
    key: "r2-1",
    tag: "Vague retry",
    prompt: "Try again and make it clearer.",
    result: {
      versionLabel: "Draft 3A (after Round 2)",
      sentenceSummary: "2 short plain sentences",
      text: "Come to Oak Park Pavilion this Saturday afternoon for our local book swap. Neighbors can stop by to browse books and meet people from the street.",
      reqs: [
        { passed: false, note: "Still missing the bring-one-take-one rule." },
        { passed: false, note: "Still missing the 2 p.m. start time." },
        {
          passed: true,
          note: "Meets limit: 2 short sentences in plain words.",
        },
      ],
      insight:
        "Asking to “make it clearer” calmed the tone, but without naming the missing requirements, both the swap rule and 2 p.m. are still absent.",
    },
  },
  {
    key: "r2-2",
    tag: "Targeted — what to change + what to keep",
    prompt:
      "Write three short, plain sentences. Include Saturday at 2 p.m., Oak Park Pavilion, and the rule “bring one book to take one book”.",
    result: DRAFT_3_ALL_PASS,
  },
  {
    key: "r2-3",
    tag: "Partial fix — swap rule only",
    prompt:
      "Keep three short, plain sentences and add the rule: bring one book to take one book.",
    result: {
      versionLabel: "Draft 3C (after Round 2)",
      sentenceSummary: "3 short plain sentences",
      text: "Come to Oak Park Pavilion this Saturday afternoon for a neighborhood book swap. Bring one book to take one book. Stop by to trade stories and find your next read.",
      reqs: [
        { passed: true, note: "Includes “Bring one book to take one book.”" },
        {
          passed: false,
          note: "Still says “Saturday afternoon” (missing 2 p.m.).",
        },
        {
          passed: true,
          note: "Meets limit: 3 short sentences in plain words.",
        },
      ],
      insight:
        "Good progress — the swap rule is now in and the length stayed short. Comparing against the original list shows 2 p.m. is still missing.",
    },
  },
];

export function RevisionLab() {
  const [round1, setRound1] = useState<Round1Key | null>(null);
  const [round2, setRound2] = useState<Round2Key | null>(null);
  const statusId = useId();

  const round1Option =
    ROUND_1_OPTIONS.find((item) => item.key === round1) ?? null;
  const round2Options =
    round1 === "targeted-facts" ? ROUND_2_AFTER_FACTS : ROUND_2_AFTER_MISSING;
  const round2Option =
    round1 !== null
      ? (round2Options.find((item) => item.key === round2) ?? null)
      : null;

  const activeDraft: DraftState =
    round2Option?.result ?? round1Option?.result ?? DRAFT_1;
  const passCount = activeDraft.reqs.filter((r) => r.passed).length;

  function selectRound1(key: Round1Key) {
    setRound1(key);
    setRound2(null);
  }

  function resetLab() {
    setRound1(null);
    setRound2(null);
  }

  return (
    <div className={styles.lab} data-testid="revision-lab">
      <div className={styles.labHeader}>
        <h3>Sam’s Book Swap Flyer — Scripted Revision Lab</h3>
        <button
          type="button"
          onClick={resetLab}
          disabled={round1 === null && round2 === null}
        >
          Reset to Draft 1
        </button>
      </div>

      <div
        className={styles.checklist}
        aria-label="Original requirements checklist"
      >
        <div className={styles.checklistTitle}>
          <span>Original requirements</span>
          <span className={styles.scoreBadge} data-testid="req-score">
            {passCount} of 3 passing
          </span>
        </div>
        <ul className={styles.reqList}>
          {REQ_LABELS.map((label, idx) => {
            const status = activeDraft.reqs[idx];
            return (
              <li className={styles.reqItem} key={label}>
                <div className={styles.reqText}>
                  <strong>{label}</strong>
                  <span className={styles.reqNote}>{status.note}</span>
                </div>
                <span
                  className={
                    status.passed ? styles.badgePass : styles.badgeFail
                  }
                >
                  {status.passed ? "Pass" : "Fail"}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className={styles.draftBox} data-testid="current-draft">
        <div className={styles.draftMeta}>
          <strong>{activeDraft.versionLabel}</strong>
          <span>{activeDraft.sentenceSummary}</span>
        </div>
        <p className={styles.draftQuote}>“{activeDraft.text}”</p>
      </div>

      <fieldset className={styles.roundBlock} aria-describedby={statusId}>
        <legend>Round 1: choose your first follow-up note</legend>
        <div className={styles.choiceGrid}>
          {ROUND_1_OPTIONS.map((option) => (
            <button
              key={option.key}
              type="button"
              className={styles.choiceBtn}
              aria-pressed={round1 === option.key}
              onClick={() => selectRound1(option.key)}
            >
              <span className={styles.choiceTag}>{option.tag}</span>
              <span>“{option.prompt}”</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.roundBlock} aria-describedby={statusId}>
        <legend>
          Round 2: compare the draft, then choose your second note
        </legend>
        {round1 === null ? (
          <p className={styles.lockedNote}>
            Choose a Round 1 follow-up note first to unlock Round 2.
          </p>
        ) : (
          <div className={styles.choiceGrid}>
            {round2Options.map((option) => (
              <button
                key={option.key}
                type="button"
                className={styles.choiceBtn}
                aria-pressed={round2 === option.key}
                onClick={() => setRound2(option.key)}
              >
                <span className={styles.choiceTag}>{option.tag}</span>
                <span>“{option.prompt}”</span>
              </button>
            ))}
          </div>
        )}
      </fieldset>

      <div
        id={statusId}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={styles.statusBox}
        data-testid="lab-status"
      >
        <p>
          <strong>
            {activeDraft.versionLabel} — {passCount} of 3 requirements passing.
          </strong>
        </p>
        <p>{activeDraft.insight}</p>
      </div>

      <p className="micro">
        Scripted simulation: every draft and requirement check above is
        pre-written for this example, not generated by a live AI model. Real
        models can respond differently from run to run.
      </p>
    </div>
  );
}
