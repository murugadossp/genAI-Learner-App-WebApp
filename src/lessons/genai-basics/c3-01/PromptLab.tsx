"use client";

import { useState } from "react";
import styles from "./lesson.module.css";

type LabState = {
  action: boolean;
  audience: boolean;
  outcome: boolean;
  padding: boolean;
};

const INITIAL: LabState = {
  action: false,
  audience: false,
  outcome: false,
  padding: false,
};

function buildPrompt(state: LabState): string {
  const { action, audience, outcome, padding } = state;

  if (!action && !audience && !outcome && !padding) {
    return "Write something about the bike clinic.";
  }

  if (!action && !audience && !outcome && padding) {
    return "Please help me write something really nice, friendly, super helpful, clear, polished, and engaging about the bike clinic so it sounds really great, warm, welcoming, impressive, thoughtful, and very well written.";
  }

  const head = padding
    ? action
      ? "Please help me write a really nice, friendly, super helpful, polished short notice"
      : "Please help me write something really nice, friendly, super helpful, polished about the bike clinic"
    : action
      ? "Write a short notice"
      : "Write something about the bike clinic";

  const parts = [head];

  if (action && !audience && !outcome) {
    parts.push("about the bike clinic");
  }
  if (audience) {
    parts.push("for neighbors with a broken bike");
  }
  if (outcome) {
    parts.push("so they know to drop in Saturday morning for a free repair");
  }
  if (padding) {
    parts.push(
      "and make sure it sounds really great, warm, welcoming, and very well written",
    );
  }

  return `${parts.join(" ")}.`;
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function getReply(state: LabState): {
  reply: string;
  guesses: string[];
  note: string;
} {
  const { action, audience, outcome, padding } = state;
  const key = `${action ? 1 : 0}${audience ? 1 : 0}${outcome ? 1 : 0}`;
  const guesses: string[] = [];

  if (!action) {
    guesses.push(
      "Action: guessed a general format because “write something” could be a flyer, essay, or email.",
    );
  }
  if (!audience) {
    guesses.push(
      "Audience: guessed general readers instead of neighbors who have a bike needing repair.",
    );
  }
  if (!outcome) {
    guesses.push(
      "Outcome: guessed the purpose instead of telling readers to drop in Saturday morning for a free repair.",
    );
  }

  const replies: Record<string, string> = {
    "000":
      "Community bike clinics have grown popular in many towns. Volunteers often share tools, teach basic maintenance, and encourage cycling across neighborhoods.",
    "100":
      "Community Bike Clinic Notice\nJoin us at our local bike clinic to celebrate cycling, meet volunteers, and learn more about bicycle maintenance in our town.",
    "010":
      "If you live nearby and have a broken bike sitting in your garage, a local bike clinic can be a great place to learn how gears, brakes, and tires work.",
    "001":
      "Many communities now offer free Saturday morning drop-in bike repairs. These sessions help residents keep bicycles on the road without high shop costs.",
    "110":
      "Notice for Neighbors with a Broken Bike\nOur community bike clinic is here to help local riders learn about bicycle upkeep and connect with neighborhood cyclists.",
    "101":
      "Bike Clinic Notice\nDrop in Saturday morning for a free bike repair. Everyone is welcome to stop by, say hello, and learn about the clinic.",
    "011":
      "For neighbors with a broken bike, dropping in on Saturday morning for a free repair is a convenient way to get back on the road while meeting local volunteers.",
    "111":
      "Free Bike Repair This Saturday\nHave a broken bike? Drop in Saturday morning for a free repair. [Add exact hours and location before posting.]",
  };

  let reply = replies[key];
  if (padding && key !== "111") {
    reply = `Here is a warm, friendly draft for you:\n${reply}`;
  } else if (padding && key === "111") {
    reply = `Here is a warm, friendly draft for you:\n${reply}`;
  }

  const clearCount = Number(action) + Number(audience) + Number(outcome);
  const note =
    padding && clearCount < 3
      ? "Filler adjectives made the prompt longer, but the assistant still had to guess the missing task parts."
      : clearCount === 3
        ? "All three clear parts are named, so the illustrative draft matches Maya’s goal closely. She still needs to add the exact hours and address before posting."
        : "Turn on the remaining parts to remove the guesses above.";

  return { reply, guesses, note };
}

export function PromptLab() {
  const [state, setState] = useState<LabState>(INITIAL);

  const promptText = buildPrompt(state);
  const wordCount = countWords(promptText);
  const clearCount =
    Number(state.action) + Number(state.audience) + Number(state.outcome);
  const { reply, guesses, note } = getReply(state);

  const isVaguePreset =
    !state.action && !state.audience && !state.outcome && !state.padding;
  const isLongVaguePreset =
    !state.action && !state.audience && !state.outcome && state.padding;
  const isClearPreset =
    state.action && state.audience && state.outcome && !state.padding;

  const toggle = (key: keyof LabState) => {
    setState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className={styles.labBox} data-testid="prompt-lab">
      <div className={styles.labHeader}>
        <strong>Maya’s bike-clinic prompt builder</strong>
        <button
          type="button"
          onClick={() => setState(INITIAL)}
          aria-label="Reset prompt builder"
        >
          Reset
        </button>
      </div>

      <div className={styles.controlGroup}>
        <span className={styles.controlLabel}>1. Compare three presets</span>
        <div
          className={styles.buttonRow}
          role="group"
          aria-label="Prompt presets"
        >
          <button
            type="button"
            className={styles.presetBtn}
            aria-pressed={isVaguePreset}
            onClick={() =>
              setState({
                action: false,
                audience: false,
                outcome: false,
                padding: false,
              })
            }
          >
            Vague (6 words)
          </button>
          <button
            type="button"
            className={styles.presetBtn}
            aria-pressed={isLongVaguePreset}
            onClick={() =>
              setState({
                action: false,
                audience: false,
                outcome: false,
                padding: true,
              })
            }
          >
            Long &amp; vague (31 words)
          </button>
          <button
            type="button"
            className={styles.presetBtn}
            aria-pressed={isClearPreset}
            onClick={() =>
              setState({
                action: true,
                audience: true,
                outcome: true,
                padding: false,
              })
            }
          >
            Clear task (22 words)
          </button>
        </div>
      </div>

      <div className={styles.controlGroup}>
        <span className={styles.controlLabel}>
          2. Toggle individual parts on or off
        </span>
        <div
          className={styles.buttonRow}
          role="group"
          aria-label="Prompt parts"
        >
          <button
            type="button"
            className={styles.toggleBtn}
            aria-pressed={state.action}
            onClick={() => toggle("action")}
          >
            Action: short notice
          </button>
          <button
            type="button"
            className={styles.toggleBtn}
            aria-pressed={state.audience}
            onClick={() => toggle("audience")}
          >
            Audience: neighbors with a broken bike
          </button>
          <button
            type="button"
            className={styles.toggleBtn}
            aria-pressed={state.outcome}
            onClick={() => toggle("outcome")}
          >
            Outcome: drop in Saturday for free repair
          </button>
          <button
            type="button"
            className={styles.toggleBtn}
            aria-pressed={state.padding}
            onClick={() => toggle("padding")}
          >
            Add filler padding
          </button>
        </div>
      </div>

      <div className={styles.promptPreview}>
        <div className={styles.statsRow}>
          <span className={styles.badge} data-testid="word-count">
            {wordCount} words
          </span>
          <span
            className={`${styles.badge} ${
              clearCount === 3 ? styles.badgeGood : styles.badgeWarn
            }`}
            data-testid="clear-count"
          >
            {clearCount} of 3 clear parts
          </span>
        </div>
        <p className={styles.promptQuote} data-testid="prompt-text">
          “{promptText}”
        </p>
      </div>

      <div className={styles.resultGrid}>
        <div className={styles.replyCard}>
          <h3>Illustrative reply</h3>
          <p className={styles.replyText} data-testid="simulated-reply">
            {reply}
          </p>
          <p className="micro">
            Invented example for this lesson, not generated by a live AI model.
          </p>
        </div>

        <div className={styles.guessCard}>
          <h3>What the assistant had to guess</h3>
          {guesses.length > 0 ? (
            <ul className={styles.guessList} data-testid="guess-list">
              {guesses.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          ) : (
            <p data-testid="guess-list">
              None of these three—action, audience, and outcome are all named.
            </p>
          )}
        </div>
      </div>

      <p
        className="micro"
        role="status"
        aria-live="polite"
        style={{ marginTop: 14, marginBottom: 0 }}
        data-testid="lab-status"
      >
        {wordCount} words, {clearCount} of 3 clear parts. {note}
      </p>
    </div>
  );
}
