"use client";

import { useState } from "react";
import styles from "./lesson.module.css";

type Mode = "masked" | "next";
type CandidateKind = "exact" | "plausible" | "implausible";

interface CandidateOption {
  word: string;
  kind: CandidateKind;
  kindNext?: CandidateKind;
}

interface SelectableSlot {
  index: number;
  target: string;
  candidates: CandidateOption[];
  contextHintMasked: string;
  contextHintNext: string;
}

interface SentencePreset {
  id: string;
  label: string;
  words: string[];
  defaultSlotIndex: number;
  slots: SelectableSlot[];
}

const PRESETS: SentencePreset[] = [
  {
    id: "soup",
    label: "Soup recipe",
    words: [
      "Simmer",
      "the",
      "soup",
      "until",
      "the",
      "carrots",
      "feel",
      "soft.",
    ],
    defaultSlotIndex: 5,
    slots: [
      {
        index: 2,
        target: "soup",
        candidates: [
          { word: "sauce", kind: "plausible" },
          { word: "soup", kind: "exact" },
          { word: "broth", kind: "plausible" },
          { word: "hammer", kind: "implausible" },
        ],
        contextHintMasked:
          "Both “Simmer the” before the blank and “until the carrots feel soft.” after it point to a liquid dish.",
        contextHintNext:
          "From “Simmer the” alone, a liquid dish fits well, though many recipes could follow.",
      },
      {
        index: 5,
        target: "carrots",
        candidates: [
          { word: "potatoes", kind: "plausible" },
          { word: "carrots", kind: "exact" },
          { word: "noodles", kind: "plausible" },
          { word: "spoons", kind: "implausible" },
        ],
        contextHintMasked:
          "The words before (“Simmer the soup until the”) and after (“feel soft.”) narrow the blank to plural ingredients that soften when cooked.",
        contextHintNext:
          "Seeing only “Simmer the soup until the” leaves room for many plural ingredients or cooking cues.",
      },
      {
        index: 7,
        target: "soft",
        candidates: [
          { word: "tender", kind: "plausible" },
          { word: "warm", kind: "plausible" },
          { word: "soft", kind: "exact" },
          { word: "loud", kind: "implausible" },
        ],
        contextHintMasked:
          "At the end of the sentence, “until the carrots feel” points to a texture word.",
        contextHintNext:
          "With every earlier word visible, “until the carrots feel” points strongly to a texture word.",
      },
    ],
  },
  {
    id: "weather",
    label: "Weather note",
    words: [
      "Pack",
      "a",
      "raincoat",
      "because",
      "heavy",
      "rain",
      "starts",
      "tonight.",
    ],
    defaultSlotIndex: 5,
    slots: [
      {
        index: 2,
        target: "raincoat",
        candidates: [
          { word: "raincoat", kind: "exact" },
          { word: "poncho", kind: "plausible" },
          { word: "jacket", kind: "plausible" },
          { word: "toaster", kind: "implausible", kindNext: "plausible" },
        ],
        contextHintMasked:
          "Seeing “because heavy rain starts tonight.” after the blank narrows “Pack a” to wet-weather gear.",
        contextHintNext:
          "Seeing only “Pack a” leaves hundreds of packable items plausible before you see the weather reason.",
      },
      {
        index: 5,
        target: "rain",
        candidates: [
          { word: "snow", kind: "plausible" },
          { word: "rain", kind: "exact" },
          { word: "drizzle", kind: "plausible" },
          { word: "quickly", kind: "implausible" },
        ],
        contextHintMasked:
          "“Pack a raincoat because heavy” and “starts tonight.” point directly to wet weather.",
        contextHintNext:
          "“Pack a raincoat because heavy” already points strongly to a weather event.",
      },
      {
        index: 7,
        target: "tonight",
        candidates: [
          { word: "soon", kind: "plausible" },
          { word: "today", kind: "plausible" },
          { word: "tonight", kind: "exact" },
          { word: "purple", kind: "implausible" },
        ],
        contextHintMasked:
          "After “heavy rain starts”, a time word fits the end of the sentence.",
        contextHintNext:
          "After “heavy rain starts”, a time word is the natural continuation.",
      },
    ],
  },
  {
    id: "door",
    label: "Leaving home",
    words: ["Lock", "the", "front", "door", "before", "you", "go", "outside."],
    defaultSlotIndex: 3,
    slots: [
      {
        index: 3,
        target: "door",
        candidates: [
          { word: "gate", kind: "plausible" },
          { word: "door", kind: "exact" },
          { word: "window", kind: "plausible" },
          { word: "banana", kind: "implausible" },
        ],
        contextHintMasked:
          "“Lock the front” and “before you go outside.” point to an entry you can lock.",
        contextHintNext:
          "“Lock the front” already narrows the next word to something with a lock.",
      },
      {
        index: 6,
        target: "go",
        candidates: [
          { word: "step", kind: "plausible" },
          { word: "head", kind: "plausible" },
          { word: "go", kind: "exact" },
          { word: "melt", kind: "implausible" },
        ],
        contextHintMasked:
          "“before you” and “outside.” call for a movement verb.",
        contextHintNext:
          "“Lock the front door before you” calls for an action verb, though not yet which one.",
      },
      {
        index: 7,
        target: "outside",
        candidates: [
          { word: "away", kind: "plausible" },
          { word: "outside", kind: "exact" },
          { word: "home", kind: "plausible" },
          { word: "square", kind: "implausible" },
        ],
        contextHintMasked:
          "After “before you go”, a direction or destination fits the end of the sentence.",
        contextHintNext:
          "After “before you go”, a direction or destination fits the end of the sentence.",
      },
    ],
  },
];

function stripPeriod(word: string): { clean: string; hasPeriod: boolean } {
  if (word.endsWith(".")) {
    return { clean: word.slice(0, -1), hasPeriod: true };
  }
  return { clean: word, hasPeriod: false };
}

export function HideAndGuessLab() {
  const [presetIndex, setPresetIndex] = useState(0);
  const [mode, setMode] = useState<Mode>("masked");
  const [hiddenIndex, setHiddenIndex] = useState(PRESETS[0].defaultSlotIndex);
  const [selectedGuess, setSelectedGuess] = useState<string | null>(null);

  const preset = PRESETS[presetIndex];
  const slot =
    preset.slots.find((s) => s.index === hiddenIndex) ?? preset.slots[0];

  const chosenCandidate = slot.candidates.find((c) => c.word === selectedGuess);
  const effectiveKind: CandidateKind | null = chosenCandidate
    ? mode === "next" && chosenCandidate.kindNext
      ? chosenCandidate.kindNext
      : chosenCandidate.kind
    : null;

  function selectPreset(idx: number) {
    setPresetIndex(idx);
    setHiddenIndex(PRESETS[idx].defaultSlotIndex);
    setSelectedGuess(null);
  }

  function selectMode(nextMode: Mode) {
    setMode(nextMode);
    setSelectedGuess(null);
  }

  function selectSlot(wordIndex: number) {
    setHiddenIndex(wordIndex);
    setSelectedGuess(null);
  }

  function resetLab() {
    setPresetIndex(0);
    setMode("masked");
    setHiddenIndex(PRESETS[0].defaultSlotIndex);
    setSelectedGuess(null);
  }

  const pairCountLabel =
    mode === "masked"
      ? "Full sentence: 8 single-word masks (3 selectable here)"
      : "Full sentence: 7 next-word pairs (3 selectable here)";

  const beforeWords = preset.words.slice(0, slot.index).join(" ");
  const afterWords = preset.words.slice(slot.index + 1).join(" ");
  const targetHasPeriod = preset.words[slot.index].endsWith(".");

  const contextBadgeLabel =
    mode === "next"
      ? "Context: earlier words only"
      : afterWords
        ? "Context: before & after"
        : "Context: before blank (end of sentence)";

  return (
    <div className={styles.labBox} data-testid="hide-guess-lab">
      <div className={styles.labHeader}>
        <div className={styles.statsRow}>
          <span className={styles.badge} data-testid="pair-count">
            {pairCountLabel}
          </span>
          <span className={styles.badge} data-testid="context-badge">
            {contextBadgeLabel}
          </span>
        </div>
        <button type="button" onClick={resetLab}>
          Reset lab
        </button>
      </div>

      <div className={styles.controlGroup}>
        <span className={styles.controlLabel}>1. Choose a raw sentence</span>
        <div className={styles.buttonRow}>
          {PRESETS.map((p, i) => (
            <button
              key={p.id}
              type="button"
              className={styles.presetBtn}
              aria-pressed={presetIndex === i}
              onClick={() => selectPreset(i)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.controlGroup}>
        <span className={styles.controlLabel}>2. Choose how to hide it</span>
        <div className={styles.buttonRow}>
          <button
            type="button"
            className={styles.modeBtn}
            aria-pressed={mode === "masked"}
            onClick={() => selectMode("masked")}
          >
            Fill in the blank
          </button>
          <button
            type="button"
            className={styles.modeBtn}
            aria-pressed={mode === "next"}
            onClick={() => selectMode("next")}
          >
            Predict next word
          </button>
        </div>
      </div>

      <div className={styles.controlGroup}>
        <span className={styles.controlLabel}>
          3. Pick a highlighted word to hide (that word becomes the target)
        </span>
        <div className={styles.sentenceStrip} data-testid="sentence-strip">
          {preset.words.map((word, idx) => {
            const isSelectable = preset.slots.some((s) => s.index === idx);
            const { clean, hasPeriod } = stripPeriod(word);
            if (!isSelectable) {
              return (
                <span key={`${preset.id}-${idx}`} className={styles.plainWord}>
                  {word}
                </span>
              );
            }
            const isHidden = slot.index === idx;
            return (
              <span key={`${preset.id}-${idx}`}>
                <button
                  type="button"
                  className={styles.wordBtn}
                  aria-pressed={isHidden}
                  aria-label={
                    isHidden
                      ? "Currently hidden word"
                      : `Hide the word ${clean}`
                  }
                  onClick={() => selectSlot(idx)}
                >
                  {isHidden ? "[hidden]" : clean}
                </button>
                {hasPeriod ? "." : ""}
              </span>
            );
          })}
        </div>
      </div>

      <div className={styles.inputPreview} data-testid="model-input">
        <span className={styles.controlLabel}>Input shown to the model</span>
        <p className={styles.inputLine}>
          {mode === "masked" ? (
            <>
              {beforeWords} <span className={styles.blankToken}>[____]</span>
              {targetHasPeriod ? "." : ""}
              {afterWords ? ` ${afterWords}` : ""}
            </>
          ) : (
            beforeWords
          )}
        </p>
        {mode === "next" && (
          <p className="micro">
            {afterWords
              ? "Later words are hidden from the model; it predicts the word immediately after this prefix."
              : "The model predicts the final word immediately after this prefix."}
          </p>
        )}
        <p className="micro">
          {mode === "masked" ? slot.contextHintMasked : slot.contextHintNext}
        </p>
      </div>

      <div className={styles.controlGroup}>
        <span className={styles.controlLabel} id="guess-prompt">
          4. Guess the word from the original sentence to reveal the
          self-supplied target
        </span>
        <div className={styles.buttonRow}>
          {slot.candidates.map((cand) => (
            <button
              key={cand.word}
              type="button"
              className={styles.guessBtn}
              aria-pressed={selectedGuess === cand.word}
              aria-describedby="lab-result-status"
              onClick={() => setSelectedGuess(cand.word)}
            >
              {cand.word}
            </button>
          ))}
        </div>
      </div>

      <div
        id="lab-result-status"
        className={styles.resultCard}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        data-testid="lab-status"
      >
        {!chosenCandidate ? (
          <>
            <h3>Waiting for your guess</h3>
            <p>
              Pick one of the four words above. The lab will reveal the hidden
              word from the original sentence—the target the data supplied on
              its own.
            </p>
          </>
        ) : (
          <>
            <h3>
              Self-supplied target: “{slot.target}”{" "}
              <span
                className={`${styles.badge} ${
                  effectiveKind === "exact"
                    ? styles.badgeGood
                    : styles.badgeWarn
                }`}
              >
                {effectiveKind === "exact"
                  ? "Exact match"
                  : effectiveKind === "plausible"
                    ? "Fits context, different target"
                    : "Unlikely in context"}
              </span>
            </h3>
            {effectiveKind === "exact" && (
              <p>
                Your guess “{chosenCandidate.word}” matched the exact hidden
                word “{slot.target}” from the original sentence. No person had
                to tag this sentence—the hidden word itself served as the
                training target.
              </p>
            )}
            {effectiveKind === "plausible" && (
              <p>
                On this single step, training simply checks whether the guess
                matched the exact target “{slot.target}”, so it treats “
                {chosenCandidate.word}” as a miss and nudges the model toward “
                {slot.target}”. To a reader, “{chosenCandidate.word}” still fits
                the visible context, and other examples can supply “
                {chosenCandidate.word}” as a target in similar contexts.
              </p>
            )}
            {effectiveKind === "implausible" && (
              <p>
                On this single step, training applies the same rule: it checks
                the guess against the exact target “{slot.target}” and nudges
                the model toward “{slot.target}”. To a reader, “
                {chosenCandidate.word}” does not fit the visible context—and
                because words like it rarely appear as targets in similar
                sentences, training gives them little support over time.
              </p>
            )}
          </>
        )}
      </div>

      <p className={`micro ${styles.disclosure}`}>
        Illustrative simulation: these sentences, candidate words, and
        explanations are pre-written for this lesson, not generated by a live
        model. In this toy lab, three highlighted words per sentence are
        interactive; real training runs across full passages and usually splits
        text into subword tokens rather than whole words.
      </p>
    </div>
  );
}
