"use client";

import { useState } from "react";
import styles from "./lesson.module.css";

type BlockKind = "context" | "constraint" | "distracting" | "sensitive";

interface PromptBlock {
  id: string;
  label: string;
  text: string;
  kind: BlockKind;
}

const BASE_TASK =
  "Write a public Thanksgiving hours and repair drop-off notice for Cedar Bike Shop's website.";

const BLOCKS: PromptBlock[] = [
  {
    id: "hours",
    label: "Thanksgiving 2026 schedule",
    text: "Thanksgiving 2026: Closed Thu, Nov 26. Open Fri, Nov 27 from 10:00 a.m. to 4:00 p.m. Regular hours resume Sat, Nov 28.",
    kind: "context",
  },
  {
    id: "dropoff",
    label: "Repair drop-off cutoff",
    text: "Repair drop-off cutoff for pre-holiday service is Wed, Nov 25 at 5:00 p.m.",
    kind: "context",
  },
  {
    id: "format",
    label: "Length, tone, and bullets",
    text: "Keep it under 60 words, use a friendly tone, and list the three days as bullet points.",
    kind: "constraint",
  },
  {
    id: "boundary",
    label: "Do-not-add boundary",
    text: "Do not mention discounts or sales, and do not add phone numbers.",
    kind: "constraint",
  },
  {
    id: "noise",
    label: "Old sale & supplier note",
    text: "Last year's summer sale offered 15% off helmets. Also remember to order 20 inner tubes from the supplier next Tuesday.",
    kind: "distracting",
  },
  {
    id: "sensitive",
    label: "Customer contact & card note",
    text: "Customer Priya Nair's cell: 555-0194, home address: 412 Oak Lane, credit card last four digits: 8821.",
    kind: "sensitive",
  },
];

function buildSimulatedReply(selected: Set<string>): string {
  const hasHours = selected.has("hours");
  const hasDropoff = selected.has("dropoff");
  const hasFormat = selected.has("format");
  const hasBoundary = selected.has("boundary");
  const hasNoise = selected.has("noise");
  const hasSensitive = selected.has("sensitive");

  const lines: string[] = [];

  if (hasFormat) {
    lines.push("Happy Thanksgiving from Cedar Bike Shop!");
    if (hasHours) {
      lines.push(
        "• Thu, Nov 26: Closed\n• Fri, Nov 27: Open 10:00 a.m.–4:00 p.m.\n• Sat, Nov 28: Regular hours resume",
      );
    } else {
      lines.push(
        "• Thanksgiving Day: [Guessed: Closed]\n• Friday: [Guessed: Limited hours]\n• Saturday: [Guessed: Open]",
      );
    }
    if (hasDropoff) {
      lines.push(
        "Drop off bikes for pre-holiday repair by Wed, Nov 25 at 5:00 p.m.",
      );
    } else {
      lines.push(
        "Repair drop-off cutoff: [Guessed: ask the shop for pre-holiday times].",
      );
    }
  } else {
    lines.push(
      "Dear valued Cedar Bike Shop community, as the autumn season brings us together for Thanksgiving, we want to share a quick update about our holiday schedule and workshop plans so you can plan every ride smoothly.",
    );
    if (hasHours) {
      lines.push(
        "For Thanksgiving 2026, we will be closed on Thursday, November 26, open from 10:00 a.m. to 4:00 p.m. on Friday, November 27, and back to regular hours on Saturday, November 28.",
      );
    } else {
      lines.push(
        "We expect to be closed on Thanksgiving Day and may operate with reduced hours over the holiday weekend—check the door for exact times.",
      );
    }
    if (hasDropoff) {
      lines.push(
        "Our repair drop-off cutoff for pre-holiday service is Wednesday, November 25 at 5:00 p.m.",
      );
    } else {
      lines.push(
        "Our repair bench fills up quickly around holidays, so stop by earlier in the week if you need tune-up work.",
      );
    }
  }

  if (!hasBoundary) {
    lines.push("Call us at (555) 010-0000 to ask about holiday specials!");
  }

  if (hasNoise) {
    lines.push(
      "Don't miss our 15% off helmet sale, and please note we are ordering 20 inner tubes from our supplier next Tuesday.",
    );
  }

  if (hasSensitive) {
    lines.push(
      "[Privacy risk: Priya Nair's phone 555-0194, address 412 Oak Lane, and card ending 8821 were sent in the prompt and could be logged or echoed in a draft.]",
    );
  }

  return lines.join("\n\n");
}

function buildStatus(selected: Set<string>): {
  tone: "good" | "warn" | "neutral";
  summary: string;
} {
  const hasSensitive = selected.has("sensitive");
  const hasNoise = selected.has("noise");
  const helpfulIds = ["hours", "dropoff", "format", "boundary"];
  const helpfulCount = helpfulIds.filter((id) => selected.has(id)).length;

  if (hasSensitive) {
    return {
      tone: "warn",
      summary:
        "Safety check failed: remove the customer's private phone, address, and card digits before sending. Private data stays out first.",
    };
  }

  if (hasNoise) {
    return {
      tone: "warn",
      summary:
        "Distracting text included: the old helmet sale and supplier note pulled the draft off track. Remove unrelated notes.",
    };
  }

  if (helpfulCount === helpfulIds.length) {
    return {
      tone: "good",
      summary:
        "Focused prompt ready: 4 of 4 helpful blocks included, 0 distracting blocks, and 0 sensitive items. Still review the draft before publishing.",
    };
  }

  const missing: string[] = [];
  if (!selected.has("hours")) missing.push("holiday hours");
  if (!selected.has("dropoff")) missing.push("drop-off cutoff");
  if (!selected.has("format")) missing.push("length/format limit");
  if (!selected.has("boundary")) missing.push("do-not-add boundary");

  return {
    tone: "neutral",
    summary: `${helpfulCount} of 4 helpful blocks included. Still missing: ${missing.join(", ")}.`,
  };
}

export function PromptBlockLab() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selectedSet = new Set(selectedIds);
  const selectedBlocks = BLOCKS.filter((block) => selectedSet.has(block.id));
  const simulatedReply = buildSimulatedReply(selectedSet);
  const status = buildStatus(selectedSet);

  function toggleBlock(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }

  function resetBlocks() {
    setSelectedIds([]);
  }

  return (
    <div className={styles.lab} data-testid="prompt-block-lab">
      <div className={styles.labHeader}>
        <strong>Select blocks to add to Sam&apos;s prompt</strong>
        <button
          type="button"
          onClick={resetBlocks}
          disabled={selectedIds.length === 0}
        >
          Reset blocks
        </button>
      </div>

      <div className={styles.labTask}>
        <span className={styles.labTaskLabel}>Base task (always included)</span>
        {BASE_TASK}
      </div>

      <div
        className={styles.blockGrid}
        role="group"
        aria-label="Candidate prompt blocks"
      >
        {BLOCKS.map((block) => {
          const active = selectedSet.has(block.id);
          return (
            <button
              key={block.id}
              type="button"
              aria-pressed={active}
              className={`${styles.blockBtn} ${active ? styles.blockBtnActive : ""}`}
              onClick={() => toggleBlock(block.id)}
            >
              <span className={styles.blockTop}>
                <span className={styles.blockTitle}>{block.label}</span>
                <span className={styles.blockState}>
                  {active ? "Included" : "Left out"}
                </span>
              </span>
              <span className={styles.blockText}>{block.text}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.outputGrid}>
        <div className={styles.outputCard}>
          <h3>Assembled prompt</h3>
          <ul className={styles.promptList}>
            <li>
              <strong>Task:</strong> {BASE_TASK}
            </li>
            {selectedBlocks.map((block) => (
              <li key={block.id}>{block.text}</li>
            ))}
          </ul>
        </div>

        <div className={styles.outputCard}>
          <h3>Illustrative reply</h3>
          <div className={styles.replyBody} data-testid="simulated-reply">
            {simulatedReply}
          </div>
        </div>
      </div>

      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        data-testid="lab-status"
        className={`${styles.statusBar} ${
          status.tone === "good"
            ? styles.statusGood
            : status.tone === "warn"
              ? styles.statusWarn
              : ""
        }`}
      >
        {status.summary}
      </div>
    </div>
  );
}
