"use client";

import { useState } from "react";
import styles from "./lesson.module.css";

type PresetId = "zero" | "one" | "few" | "messy" | "new-chat";

interface ExamplePair {
  label: string;
  note: string;
  board: string;
}

interface Preset {
  id: PresetId;
  buttonLabel: string;
  shotLabel: string;
  contextBadge: string;
  examples: ExamplePair[];
  reply: string;
  shiftSummary: string;
  announcement: string;
}

const SHARED_INSTRUCTION =
  "Rewrite this bakery staff note as a short, calm entry for the daily staff board.";

const TARGET_NOTE =
  "Oven 2 runs 10 minutes slow today, so start the bread tray early.";

const PRESETS: Preset[] = [
  {
    id: "zero",
    buttonLabel: "0 examples",
    shotLabel: "Zero-shot (instruction only)",
    contextBadge: "Current context: 0 examples",
    examples: [],
    reply:
      "Oven 2 is running about 10 minutes slow today. Please put the bread tray in earlier than usual so it finishes on time.",
    shiftSummary:
      "The reply is calm and useful, so zero-shot works for a simple rewrite. Without examples, the model picks its own phrasing and leaves out the shop's [Category] Action — reason house style.",
    announcement:
      "Zero-shot selected. Zero examples in context. Model weights remain unchanged. Reply uses plain sentences without the bracket tag format.",
  },
  {
    id: "one",
    buttonLabel: "1 example",
    shotLabel: "One-shot (1 example)",
    contextBadge: "Current context: 1 example",
    examples: [
      {
        label: "Example 1",
        note: "We are down to two boxes of takeaway cups, please order more before noon.",
        board:
          "[Supplies] Order takeaway cups before noon — only two boxes left.",
      },
    ],
    reply:
      "[Kitchen] Start the bread tray early — Oven 2 is running 10 minutes slow.",
    shiftSummary:
      "One example steers the reply into the [Tag] Action — reason shape. Because the shared instruction does not list the shop's three categories and only [Supplies] was shown, the model has not seen [Equipment] yet and invents a plausible tag ([Kitchen]) instead.",
    announcement:
      "One-shot selected. One example in context. Model weights remain unchanged. Reply matches the bracket-and-dash shape but guesses the tag name Kitchen.",
  },
  {
    id: "few",
    buttonLabel: "3 varied examples",
    shotLabel: "Few-shot (3 varied examples)",
    contextBadge: "Current context: 3 examples",
    examples: [
      {
        label: "Example 1",
        note: "We are down to two boxes of takeaway cups, please order more before noon.",
        board:
          "[Supplies] Order takeaway cups before noon — only two boxes left.",
      },
      {
        label: "Example 2",
        note: "Sam is taking the afternoon counter shift instead of Maya today.",
        board:
          "[Schedule] Sam is on the afternoon counter — swapped with Maya.",
      },
      {
        label: "Example 3",
        note: "Coffee grinder jammed twice this morning; use the backup grinder.",
        board:
          "[Equipment] Use the backup grinder — main coffee grinder jammed.",
      },
    ],
    reply: "[Equipment] Start bread tray early — Oven 2 is 10 min slow today.",
    shiftSummary:
      "Three consistent, varied examples show both the one-line structure and the three board categories. The reply matches the [Equipment] tag, action-first order, and brief tone.",
    announcement:
      "Few-shot selected. Three varied examples in context. Model weights remain unchanged. Reply matches the Equipment tag and short board format.",
  },
  {
    id: "messy",
    buttonLabel: "Messy examples",
    shotLabel: "Few-shot (2 conflicting examples)",
    contextBadge: "Current context: 2 mixed examples",
    examples: [
      {
        label: "Example 1 (short tag)",
        note: "We are down to two boxes of takeaway cups, please order more before noon.",
        board:
          "[Supplies] Order takeaway cups before noon — only two boxes left.",
      },
      {
        label: "Example 2 (chatty note)",
        note: "Sam is taking the afternoon counter shift instead of Maya today.",
        board:
          "Hey team! Just a quick heads-up that Sam is covering the afternoon counter for Maya today. Thanks everyone!",
      },
    ],
    reply:
      "[Oven] Hey team! Please start the bread tray early because Oven 2 is running 10 minutes slow today.",
    shiftSummary:
      "When examples disagree, the model can blend both patterns. Examples steer toward whatever pattern is actually in the prompt, including mixed styles.",
    announcement:
      "Messy examples selected. Two conflicting examples in context. Model weights remain unchanged. Reply blends a bracket tag with a chatty greeting.",
  },
  {
    id: "new-chat",
    buttonLabel: "New chat (no examples)",
    shotLabel: "Fresh chat (0 examples in context)",
    contextBadge: "Current context: 0 examples (new chat)",
    examples: [],
    reply:
      "Oven 2 is running 10 minutes slow today. Start the bread tray early to keep baking on schedule.",
    shiftSummary:
      "Even right after sending three great examples, opening a new chat clears them from context. Because the examples did not change the model's weights, the [Category] style is no longer guaranteed to appear.",
    announcement:
      "New chat selected. Zero examples in context. Model weights remain unchanged. Reply drops the bracket format because the earlier examples are no longer in context.",
  },
];

export function ExamplesLab() {
  const [activeId, setActiveId] = useState<PresetId>("zero");
  const active = PRESETS.find((p) => p.id === activeId) ?? PRESETS[0];

  return (
    <div className={styles.lab} data-testid="examples-lab">
      <div className={styles.labTop}>
        <div>
          <span className="eyebrow">Scripted simulation · Bakery board</span>
          <p className="micro" style={{ margin: "4px 0 0" }}>
            Illustrative replies only (not a live model call). The task
            instruction stays identical in every step so you can see what the
            examples change.
          </p>
        </div>
        <button
          type="button"
          className={styles.resetBtn}
          onClick={() => setActiveId("zero")}
        >
          Reset
        </button>
      </div>

      <div
        className={styles.presetRow}
        role="group"
        aria-label="Choose how many examples to include in the prompt"
      >
        {PRESETS.map((preset) => {
          const pressed = preset.id === activeId;
          return (
            <button
              key={preset.id}
              type="button"
              aria-pressed={pressed}
              className={`${styles.presetBtn} ${
                pressed ? styles.presetBtnActive : ""
              }`}
              onClick={() => setActiveId(preset.id)}
            >
              {preset.buttonLabel}
            </button>
          );
        })}
      </div>

      <div className={styles.statusStrip}>
        <span className={styles.badge} data-testid="context-badge">
          {active.contextBadge}
        </span>
        <span className={styles.weightsBadge} data-testid="weights-badge">
          Model weights: unchanged
        </span>
      </div>

      <div className={styles.labGrid}>
        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>1. Prompt sent in this request</h3>
          <p className={styles.shotMeta}>{active.shotLabel}</p>

          <div className={styles.promptBlock}>
            <span className={styles.blockLabel}>Shared instruction</span>
            <p className={styles.blockText}>{SHARED_INSTRUCTION}</p>
          </div>

          {active.examples.length > 0 ? (
            <div className={styles.examplesList} data-testid="prompt-examples">
              <span className={styles.blockLabel}>
                Prompt examples ({active.examples.length})
              </span>
              {active.examples.map((ex) => (
                <div key={ex.label} className={styles.examplePair}>
                  <p className={styles.pairLine}>
                    <strong>{ex.label} note:</strong> “{ex.note}”
                  </p>
                  <p className={styles.pairLine}>
                    <strong>Board:</strong> {ex.board}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.emptyExamples} data-testid="no-examples-note">
              No examples attached to this request.
            </p>
          )}

          <div className={styles.promptBlock}>
            <span className={styles.blockLabel}>New staff note to rewrite</span>
            <p className={styles.blockText}>“{TARGET_NOTE}”</p>
          </div>
        </div>

        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>2. Illustrative model reply</h3>
          <div className={styles.replyBox} data-testid="lab-reply">
            {active.reply}
          </div>
          <div className={styles.noteBox} data-testid="lab-explanation">
            <strong>What shifted:</strong> {active.shiftSummary}
          </div>
        </div>
      </div>

      <div role="status" aria-live="polite" className="visually-hidden">
        {active.announcement}
      </div>
    </div>
  );
}
