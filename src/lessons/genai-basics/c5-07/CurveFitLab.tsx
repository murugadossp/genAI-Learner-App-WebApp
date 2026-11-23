"use client";

import { useState } from "react";
import styles from "./lesson.module.css";

type FitMode = "underfit" | "good" | "overfit";

interface DayPoint {
  temp: number;
  scoops: number;
}

// Invented illustrative dataset: Sam's Neighbourhood Ice-Cream Cart
// 8 training days spaced by 2.5°C from 14°C to 31.5°C
const TRAINING_DAYS: DayPoint[] = [
  { temp: 14.0, scoops: 22 },
  { temp: 16.5, scoops: 31 },
  { temp: 19.0, scoops: 57 },
  { temp: 21.5, scoops: 61 },
  { temp: 24.0, scoops: 81 },
  { temp: 26.5, scoops: 77 },
  { temp: 29.0, scoops: 92 },
  { temp: 31.5, scoops: 83 },
];

// 6 unseen validation days held back to check generalisation
const VALIDATION_DAYS: DayPoint[] = [
  { temp: 15.25, scoops: 26 },
  { temp: 17.75, scoops: 43 },
  { temp: 20.25, scoops: 62 },
  { temp: 22.75, scoops: 69 },
  { temp: 25.25, scoops: 77 },
  { temp: 30.25, scoops: 90 },
];

const TEMP_MIN = 13.5;
const TEMP_MAX = 32.5;
const SCOOPS_MIN = 0;
const SCOOPS_MAX = 120;

// Flat average of the 8 training days: (22+31+57+61+81+77+92+83)/8 = 63
function predictUnderfit(): number {
  return 63;
}

// Smooth quadratic capturing the rise-and-plateau pattern
function predictGood(temp: number): number {
  const x = (temp - 14) / 18;
  return 18 + 145 * x - 75 * x * x;
}

// Piecewise-linear interpolant through training days plus a wiggle between them
// Hits every training day exactly (0.0 error) while swinging wildly on unseen days
function predictOverfit(temp: number): number {
  let base: number;
  if (temp <= TRAINING_DAYS[0].temp) {
    base = TRAINING_DAYS[0].scoops;
  } else if (temp >= TRAINING_DAYS[TRAINING_DAYS.length - 1].temp) {
    base = TRAINING_DAYS[TRAINING_DAYS.length - 1].scoops;
  } else {
    let i = 0;
    while (i < TRAINING_DAYS.length - 2 && temp > TRAINING_DAYS[i + 1].temp) {
      i++;
    }
    const a = TRAINING_DAYS[i];
    const b = TRAINING_DAYS[i + 1];
    const frac = (temp - a.temp) / (b.temp - a.temp);
    base = a.scoops + frac * (b.scoops - a.scoops);
  }
  const wiggle = 22 * Math.sin((Math.PI * (temp - 14)) / 2.5);
  return Math.max(4, Math.min(116, base + wiggle));
}

function predict(mode: FitMode, temp: number): number {
  if (mode === "underfit") return predictUnderfit();
  if (mode === "good") return predictGood(temp);
  return predictOverfit(temp);
}

function meanAbsoluteError(mode: FitMode, points: DayPoint[]): number {
  const total = points.reduce(
    (sum, p) => sum + Math.abs(p.scoops - predict(mode, p.temp)),
    0,
  );
  return total / points.length;
}

const FIT_OPTIONS: {
  id: FitMode;
  label: string;
  diagnosis: string;
  summary: string;
  hiddenSummary: string;
}[] = [
  {
    id: "underfit",
    label: "Too simple (Underfit)",
    diagnosis: "Underfitting — misses the pattern",
    summary:
      "A single flat average (63 scoops) ignores temperature altogether, so both training error and validation error stay high.",
    hiddenSummary:
      "Even on the training days alone, this flat line misses cool days and warm days by a wide margin.",
  },
  {
    id: "good",
    label: "Balanced (Good fit)",
    diagnosis: "Good fit — captures the pattern",
    summary:
      "The smooth curve follows the upward trend without chasing every daily bump. Both training error and validation error stay low and close.",
    hiddenSummary:
      "The smooth curve stays close to most training days without bending sharply to hit every single bump.",
  },
  {
    id: "overfit",
    label: "Too flexible (Overfit)",
    diagnosis: "Overfitting — memorises training noise",
    summary:
      "The wiggly curve hits every training day (0.0 scoops error), yet swings wildly away from the unseen validation days.",
    hiddenSummary:
      "On training days alone this looks like a perfect 0.0-scoop fit—turn on unseen validation days to see if it holds up.",
  },
];

// SVG geometry
const W = 560;
const H = 280;
const PAD_L = 52;
const PAD_R = 20;
const PAD_T = 18;
const PAD_B = 42;
const PLOT_W = W - PAD_L - PAD_R;
const PLOT_H = H - PAD_T - PAD_B;

function mapX(temp: number): number {
  return PAD_L + ((temp - TEMP_MIN) / (TEMP_MAX - TEMP_MIN)) * PLOT_W;
}

function mapY(scoops: number): number {
  return (
    PAD_T +
    PLOT_H -
    ((scoops - SCOOPS_MIN) / (SCOOPS_MAX - SCOOPS_MIN)) * PLOT_H
  );
}

function buildCurvePath(mode: FitMode): string {
  const steps = 120;
  const parts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const temp = 14 + (i / steps) * (31.5 - 14);
    const x = mapX(temp).toFixed(1);
    const y = mapY(predict(mode, temp)).toFixed(1);
    parts.push(`${i === 0 ? "M" : "L"}${x},${y}`);
  }
  return parts.join(" ");
}

export function CurveFitLab() {
  const [mode, setMode] = useState<FitMode>("overfit");
  const [showValidation, setShowValidation] = useState<boolean>(false);

  const activeOption = FIT_OPTIONS.find((o) => o.id === mode)!;
  const trainMae = meanAbsoluteError(mode, TRAINING_DAYS);
  const valMae = meanAbsoluteError(mode, VALIDATION_DAYS);
  const curvePath = buildCurvePath(mode);

  const handleReset = () => {
    setMode("overfit");
    setShowValidation(false);
  };

  return (
    <div className={styles.labCard} data-testid="curve-fit-lab">
      <ol className={styles.labSteps}>
        <li>
          Start on <strong>Too flexible (Overfit)</strong> with unseen days
          hidden—notice the <strong>0.0 scoops</strong> training error.
        </li>
        <li>
          Click <strong>Show unseen validation days</strong> to reveal six new
          days the curve never saw.
        </li>
        <li>
          Switch between <strong>Too simple</strong>, <strong>Balanced</strong>,
          and <strong>Too flexible</strong> and compare both average errors.
        </li>
      </ol>

      <div className={styles.controlGroup}>
        <span className={styles.controlLabel}>Model flexibility</span>
        <div
          className={styles.presetRow}
          role="group"
          aria-label="Model flexibility"
        >
          {FIT_OPTIONS.map((opt) => {
            const active = mode === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                aria-pressed={active}
                className={`${styles.presetBtn} ${active ? styles.presetBtnActive : ""}`}
                onClick={() => setMode(opt.id)}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.secondaryRow}>
        <button
          type="button"
          aria-pressed={showValidation}
          className={`${styles.toggleBtn} ${showValidation ? styles.toggleBtnActive : ""}`}
          onClick={() => setShowValidation((v) => !v)}
        >
          {showValidation
            ? "Hide unseen validation days"
            : "Show unseen validation days"}
        </button>
        <button type="button" className={styles.resetBtn} onClick={handleReset}>
          Reset lab
        </button>
      </div>

      <div className={styles.chartWrap}>
        <svg
          className={styles.chartSvg}
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={`Scatter plot of Sam's ice-cream sales vs. afternoon temperature showing the ${activeOption.label} curve${showValidation ? " with unseen validation days visible" : " on training days only"}.`}
        >
          {/* Horizontal grid lines */}
          {[20, 40, 60, 80, 100].map((val) => {
            const y = mapY(val);
            return (
              <g key={val}>
                <line
                  x1={PAD_L}
                  y1={y}
                  x2={W - PAD_R}
                  y2={y}
                  stroke="var(--line)"
                  strokeDasharray="4 4"
                />
                <text
                  x={PAD_L - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="var(--muted)"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* X-axis ticks */}
          {[14, 18, 22, 26, 30].map((t) => {
            const x = mapX(t);
            return (
              <text
                key={t}
                x={x}
                y={H - PAD_B + 18}
                textAnchor="middle"
                fontSize="11"
                fill="var(--muted)"
              >
                {t}°C
              </text>
            );
          })}

          {/* Axes */}
          <line
            x1={PAD_L}
            y1={PAD_T}
            x2={PAD_L}
            y2={H - PAD_B}
            stroke="var(--muted)"
            strokeWidth="1.2"
          />
          <line
            x1={PAD_L}
            y1={H - PAD_B}
            x2={W - PAD_R}
            y2={H - PAD_B}
            stroke="var(--muted)"
            strokeWidth="1.2"
          />

          {/* Axis labels */}
          <text
            x={PAD_L + PLOT_W / 2}
            y={H - 6}
            textAnchor="middle"
            fontSize="12"
            fontWeight="600"
            fill="var(--ink)"
          >
            Afternoon temperature (°C)
          </text>
          <text
            x={15}
            y={PAD_T + PLOT_H / 2}
            textAnchor="middle"
            fontSize="12"
            fontWeight="600"
            fill="var(--ink)"
            transform={`rotate(-90 15 ${PAD_T + PLOT_H / 2})`}
          >
            Scoops sold
          </text>

          {/* Error stems for validation days when visible */}
          {showValidation &&
            VALIDATION_DAYS.map((p) => {
              const cx = mapX(p.temp);
              const cy = mapY(p.scoops);
              const py = mapY(predict(mode, p.temp));
              return (
                <line
                  key={`err-${p.temp}`}
                  x1={cx}
                  y1={cy}
                  x2={cx}
                  y2={py}
                  stroke="#d97706"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                  opacity="0.75"
                />
              );
            })}

          {/* Fitted curve */}
          <path
            d={curvePath}
            fill="none"
            stroke="var(--ink)"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Training points (circles) */}
          {TRAINING_DAYS.map((p) => (
            <circle
              key={`tr-${p.temp}`}
              cx={mapX(p.temp)}
              cy={mapY(p.scoops)}
              r="5.5"
              fill="var(--accent)"
              stroke="var(--paper)"
              strokeWidth="1.5"
            />
          ))}

          {/* Unseen validation points (diamonds) */}
          {showValidation &&
            VALIDATION_DAYS.map((p) => {
              const cx = mapX(p.temp);
              const cy = mapY(p.scoops);
              return (
                <polygon
                  key={`va-${p.temp}`}
                  points={`${cx},${cy - 6.5} ${cx + 6.5},${cy} ${cx},${cy + 6.5} ${cx - 6.5},${cy}`}
                  fill="#d97706"
                  stroke="var(--paper)"
                  strokeWidth="1.5"
                />
              );
            })}
        </svg>

        <div className={styles.legendRow}>
          <span className={styles.legendItem}>
            <span className={styles.dotTrain} aria-hidden="true" />
            Training days (8)
          </span>
          {showValidation && (
            <span className={styles.legendItem}>
              <span className={styles.dotVal} aria-hidden="true" />
              Unseen validation days (6)
            </span>
          )}
          <span className={styles.legendItem}>
            <span className={styles.lineCurve} aria-hidden="true" />
            Fitted curve
          </span>
        </div>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>Training error (avg. miss)</span>
          <span className={styles.metricValue} data-testid="train-error">
            {trainMae.toFixed(1)} scoops
          </span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>
            Validation error (unseen days)
          </span>
          <span className={styles.metricValue} data-testid="val-error">
            {showValidation ? `${valMae.toFixed(1)} scoops` : "Hidden"}
          </span>
        </div>
      </div>

      <div
        className={styles.diagnosisBox}
        role="status"
        aria-live="polite"
        data-testid="lab-diagnosis"
      >
        <strong>
          {showValidation
            ? activeOption.diagnosis
            : `${activeOption.label} — training view only`}
        </strong>
        <p>
          {showValidation ? activeOption.summary : activeOption.hiddenSummary}
        </p>
      </div>

      <p className={styles.caveat}>
        Illustrative simulation: these temperatures, scoop counts, and curves
        are invented to demonstrate fitting behaviour, not measurements from a
        live model.
      </p>
    </div>
  );
}
