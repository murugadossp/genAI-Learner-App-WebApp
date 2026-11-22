"use client";

import { useState } from "react";
import styles from "./lesson.module.css";

type Mode = "goal" | "tap-bonus";
type Direction = "Up" | "Down" | "Left" | "Right";
type Pos = { col: number; row: number };

type StepEntry = {
  step: number;
  action: Direction;
  pos: Pos;
  reward: number;
  note: string;
};

const COLS = 4;
const ROWS = 3;
const MAX_STEPS = 10;

const START: Pos = { col: 0, row: 0 };
const TAP: Pos = { col: 1, row: 0 };
const PUDDLES: Pos[] = [
  { col: 2, row: 0 },
  { col: 1, row: 1 },
];
const SEEDLING: Pos = { col: 3, row: 2 };

const SAME = (a: Pos, b: Pos) => a.col === b.col && a.row === b.row;
const IS_PUDDLE = (p: Pos) => PUDDLES.some((q) => SAME(p, q));

const DELTA: Record<Direction, Pos> = {
  Up: { col: 0, row: -1 },
  Down: { col: 0, row: 1 },
  Left: { col: -1, row: 0 },
  Right: { col: 1, row: 0 },
};

const GOAL_RUN: Direction[] = ["Down", "Down", "Right", "Right", "Right"];
const TAP_LOOP_RUN: Direction[] = [
  "Right",
  "Left",
  "Right",
  "Left",
  "Right",
  "Left",
  "Right",
  "Left",
  "Right",
  "Left",
];

function formatReward(value: number): string {
  if (value > 0) return `+${value}`;
  if (value < 0) return `−${Math.abs(value)}`;
  return "0";
}

function stepResult(pos: Pos, mode: Mode): { reward: number; note: string } {
  if (SAME(pos, SEEDLING)) {
    return { reward: 10, note: "Seedling watered" };
  }
  if (IS_PUDDLE(pos)) {
    return { reward: -5, note: "Wet puddle" };
  }
  if (SAME(pos, TAP) && mode === "tap-bonus") {
    return { reward: 4, note: "Tap bonus" };
  }
  return { reward: 0, note: "Safe tile" };
}

function simulateRun(actions: Direction[], mode: Mode) {
  let pos = START;
  let total = 0;
  const trail: StepEntry[] = [];
  let watered = false;

  for (const action of actions) {
    if (trail.length >= MAX_STEPS || watered) break;
    const next: Pos = {
      col: pos.col + DELTA[action].col,
      row: pos.row + DELTA[action].row,
    };
    const { reward, note } = stepResult(next, mode);
    pos = next;
    total += reward;
    trail.push({ step: trail.length + 1, action, pos, reward, note });
    if (SAME(pos, SEEDLING)) {
      watered = true;
    }
  }

  return { pos, total, trail, watered };
}

export function GreenhouseLab() {
  const [mode, setMode] = useState<Mode>("goal");
  const [pos, setPos] = useState<Pos>(START);
  const [totalReward, setTotalReward] = useState(0);
  const [trail, setTrail] = useState<StepEntry[]>([]);
  const [watered, setWatered] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    "Pip starts at the top-left corner carrying water. Choose a direction or show Pip’s example run.",
  );

  const stepsUsed = trail.length;
  const finished = watered || stepsUsed >= MAX_STEPS;

  function reset(nextMode: Mode = mode, customMessage?: string) {
    setMode(nextMode);
    setPos(START);
    setTotalReward(0);
    setTrail([]);
    setWatered(false);
    setStatusMessage(
      customMessage ??
        (nextMode === "goal"
          ? "Goal reward mode: safe steps score 0, puddles score −5, and watering the seedling scores +10."
          : "Flawed tap-bonus mode: the optional Water Tap now gives +4 every visit, alongside +10 for the seedling and −5 for puddles."),
    );
  }

  function move(direction: Direction) {
    if (finished) return;
    const next: Pos = {
      col: pos.col + DELTA[direction].col,
      row: pos.row + DELTA[direction].row,
    };
    if (next.col < 0 || next.col >= COLS || next.row < 0 || next.row >= ROWS) {
      return;
    }

    const { reward, note } = stepResult(next, mode);
    const nextStep = stepsUsed + 1;
    const nextTotal = totalReward + reward;
    const reachedSeedling = SAME(next, SEEDLING);

    setPos(next);
    setTotalReward(nextTotal);
    setTrail((prev) => [
      ...prev,
      { step: nextStep, action: direction, pos: next, reward, note },
    ]);
    setWatered(reachedSeedling);

    if (reachedSeedling) {
      setStatusMessage(
        `Step ${nextStep}: moved ${direction} to the Seedling (${formatReward(reward)}). Total reward: ${formatReward(nextTotal)}. Seedling watered!`,
      );
    } else if (nextStep >= MAX_STEPS) {
      setStatusMessage(
        `Step ${nextStep}: moved ${direction} (${note}, ${formatReward(reward)}). Battery limit reached with total reward ${formatReward(nextTotal)}; seedling is still dry.`,
      );
    } else {
      setStatusMessage(
        `Step ${nextStep}: moved ${direction} (${note}, ${formatReward(reward)}). Total reward so far: ${formatReward(nextTotal)}.`,
      );
    }
  }

  function runExample() {
    const actions = mode === "goal" ? GOAL_RUN : TAP_LOOP_RUN;
    const result = simulateRun(actions, mode);
    setPos(result.pos);
    setTotalReward(result.total);
    setTrail(result.trail);
    setWatered(result.watered);

    if (mode === "goal") {
      setStatusMessage(
        "Example run (Goal reward): Pip takes 4 quiet steps (0 each) around the puddles and reaches the Seedling on step 5 for +10. Seedling watered!",
      );
    } else {
      setStatusMessage(
        "Example run (Flawed tap bonus): Pip bounces between Start and the Water Tap for all 10 steps, scoring +20—more than +10—while the seedling stays dry.",
      );
    }
  }

  function canMove(direction: Direction): boolean {
    if (finished) return false;
    const nextCol = pos.col + DELTA[direction].col;
    const nextRow = pos.row + DELTA[direction].row;
    return nextCol >= 0 && nextCol < COLS && nextRow >= 0 && nextRow < ROWS;
  }

  function handleGridKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const keyMap: Record<string, Direction> = {
      ArrowUp: "Up",
      ArrowDown: "Down",
      ArrowLeft: "Left",
      ArrowRight: "Right",
    };
    const direction = keyMap[event.key];
    if (!direction) return;
    event.preventDefault();
    move(direction);
  }

  const visitedKeys = new Set(
    trail.map((entry) => `${entry.pos.col},${entry.pos.row}`),
  );

  return (
    <div className={styles.labBox} data-testid="greenhouse-lab">
      <div className={styles.labHeader}>
        <div>
          <strong>Pip’s greenhouse grid</strong>
          <p className="micro" style={{ margin: "4px 0 0" }}>
            Illustrative simulation with invented tile scores and scripted
            example runs—not a live RL training engine. Pip starts carrying
            water; the Water Tap is optional.
          </p>
        </div>
      </div>

      <div className={styles.controlGroup}>
        <span className={styles.controlLabel}>Reward rule</span>
        <div className={styles.buttonRow} role="group" aria-label="Reward rule">
          <button
            type="button"
            className={styles.modeBtn}
            aria-pressed={mode === "goal"}
            onClick={() => reset("goal")}
          >
            Goal reward (delayed)
          </button>
          <button
            type="button"
            className={styles.modeBtn}
            aria-pressed={mode === "tap-bonus"}
            onClick={() => reset("tap-bonus")}
          >
            Flawed tap bonus (+4)
          </button>
        </div>
      </div>

      <div className={styles.statsRow}>
        <span className={styles.badge} data-testid="step-count">
          {stepsUsed} / {MAX_STEPS} steps
        </span>
        <span
          className={`${styles.badge} ${
            totalReward > 0
              ? styles.badgeGood
              : totalReward < 0
                ? styles.badgeWarn
                : ""
          }`}
          data-testid="total-reward"
        >
          Reward: {formatReward(totalReward)}
        </span>
        <span
          className={`${styles.badge} ${
            watered ? styles.badgeGood : finished ? styles.badgeWarn : ""
          }`}
          data-testid="seedling-status"
        >
          Seedling: {watered ? "Watered" : finished ? "Still dry" : "Dry"}
        </span>
      </div>

      <div
        className={styles.gridWrap}
        role="region"
        aria-label="4 by 3 greenhouse grid. Use the direction buttons or arrow keys to move Pip."
        tabIndex={0}
        onKeyDown={handleGridKeyDown}
      >
        <div className={styles.grid}>
          {Array.from({ length: ROWS * COLS }, (_, idx) => {
            const col = idx % COLS;
            const row = Math.floor(idx / COLS);
            const tile: Pos = { col, row };
            const isPip = SAME(pos, tile);
            const isStart = SAME(tile, START);
            const isTap = SAME(tile, TAP);
            const isPuddle = IS_PUDDLE(tile);
            const isSeedling = SAME(tile, SEEDLING);
            const visited = visitedKeys.has(`${col},${row}`);

            let label = "Open";
            let score = "0";
            let toneClass = "";

            if (isStart) {
              label = "Start";
              score = "0";
            } else if (isTap) {
              label = "Tap";
              score = mode === "tap-bonus" ? "+4" : "0";
              if (mode === "tap-bonus") toneClass = styles.tileBonus;
            } else if (isPuddle) {
              label = "Puddle";
              score = "−5";
              toneClass = styles.tilePuddle;
            } else if (isSeedling) {
              label = "Seedling";
              score = "+10";
              toneClass = styles.tileGoal;
            }

            return (
              <div
                key={`${col}-${row}`}
                className={`${styles.tile} ${toneClass} ${visited ? styles.tileVisited : ""} ${isPip ? styles.tileCurrent : ""}`}
                data-testid={`tile-${col}-${row}`}
              >
                <span className={styles.tileName}>{label}</span>
                <span className={styles.tileScore}>{score}</span>
                {isPip && (
                  <span className={styles.pipBadge} aria-label="Pip is here">
                    Pip
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.controlGroup}>
        <span className={styles.controlLabel}>Move Pip or run example</span>
        <div className={styles.buttonRow}>
          {(["Up", "Down", "Left", "Right"] as Direction[]).map((dir) => (
            <button
              key={dir}
              type="button"
              className={styles.actionBtn}
              disabled={!canMove(dir)}
              onClick={() => move(dir)}
            >
              {dir}
            </button>
          ))}
          <button
            type="button"
            className={styles.primaryActionBtn}
            onClick={runExample}
          >
            Show Pip’s example run
          </button>
          <button
            type="button"
            className={styles.actionBtn}
            onClick={() => reset(mode)}
          >
            Reset
          </button>
        </div>
      </div>

      <p
        className={styles.statusBox}
        role="status"
        aria-live="polite"
        data-testid="lab-status"
      >
        {statusMessage}
      </p>

      <div className={styles.trailCard}>
        <h3>Step-by-step reward trail</h3>
        {trail.length === 0 ? (
          <p className="micro" data-testid="reward-trail">
            No moves yet. Take a step or click “Show Pip’s example run” to see
            how rewards arrive over time.
          </p>
        ) : (
          <ol className={styles.trailList} data-testid="reward-trail">
            {trail.map((entry) => (
              <li key={entry.step}>
                <strong>Step {entry.step}:</strong> {entry.action} →{" "}
                {entry.note} ({formatReward(entry.reward)})
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
