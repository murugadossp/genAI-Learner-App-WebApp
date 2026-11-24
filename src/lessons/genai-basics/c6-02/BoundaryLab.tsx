"use client";

import { useId, useState } from "react";
import styles from "./lesson.module.css";

type Shape = "one" | "two-linear" | "relu";

const choices: { id: Shape; label: string }[] = [
  { id: "one", label: "One affine transform" },
  { id: "two-linear", label: "Two transforms, no activation" },
  { id: "relu", label: "Two transforms with ReLU" },
];

function scoreFor(shape: Shape, input: number) {
  if (shape === "relu") {
    const first = Math.max(0, input + 1);
    const second = Math.max(0, 1 - input);
    return 5 - 2 * first - 2 * second;
  }
  return input;
}

function pathFor(shape: Shape) {
  const xMin = -3;
  const xMax = 3;
  const yMin = -3.5;
  const yMax = 3.5;
  const left = 62;
  const right = 545;
  const top = 32;
  const bottom = 244;
  const xPixel = (x: number) =>
    left + ((x - xMin) / (xMax - xMin)) * (right - left);
  const yPixel = (y: number) =>
    bottom - ((y - yMin) / (yMax - yMin)) * (bottom - top);
  const points = Array.from({ length: 121 }, (_, i) => {
    const x = xMin + (i / 120) * (xMax - xMin);
    return [xPixel(x), yPixel(scoreFor(shape, x))] as const;
  });
  return points
    .map(
      ([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`,
    )
    .join(" ");
}

function description(shape: Shape) {
  if (shape === "relu")
    return "With the intermediate ReLU step, the score is above zero only between offsets minus 1.5 and 1.5, making a middle window.";
  if (shape === "two-linear")
    return "The two affine transforms compose into the same straight line and one boundary as the single-transform baseline.";
  return "The single affine transform makes one straight line with a boundary at offset zero.";
}

export function BoundaryLab() {
  const [shape, setShape] = useState<Shape>("one");
  const groupId = useId();
  const zeroY = 244 - ((0 + 3.5) / 7) * (244 - 32);
  return (
    <div className={styles.lab} data-testid="boundary-lab">
      <fieldset className={styles.choices}>
        <legend>Choose the network shape</legend>
        {choices.map((choice) => (
          <label key={choice.id} className={styles.choice}>
            <input
              type="radio"
              name={groupId}
              value={choice.id}
              checked={shape === choice.id}
              onChange={() => setShape(choice.id)}
            />
            <span>{choice.label}</span>
          </label>
        ))}
      </fieldset>
      <figure className={styles.figure}>
        <svg
          viewBox="0 0 600 300"
          role="img"
          aria-label={`Toy score plotted against signed arrival offset. ${description(shape)} Positive score means inside the window.`}
          data-testid="score-plot"
        >
          <path className={styles.axis} d="M 62 32 L 62 244 L 545 244" />
          <path
            className={styles.threshold}
            d={`M 62 ${zeroY} L 545 ${zeroY}`}
          />
          <path className={styles.graph} d={pathFor(shape)} />
          <text className={styles.axisLabel} x="252" y="282">
            Arrival offset
          </text>
          <text className={styles.axisLabel} x="8" y="20">
            Toy score
          </text>
          <text className={styles.axisLabel} x="475" y={zeroY - 7}>
            Score = 0
          </text>
          <text className={styles.axisLabel} x="64" y="266">
            −3
          </text>
          <text className={styles.axisLabel} x="299" y="266">
            0
          </text>
          <text className={styles.axisLabel} x="530" y="266">
            3
          </text>
          {shape === "relu" && (
            <text className={styles.insideLabel} x="228" y={zeroY - 14}>
              Inside window
            </text>
          )}
        </svg>
        <figcaption className="micro">
          The dashed line is the toy decision threshold. Only scores above zero
          count as inside.
        </figcaption>
      </figure>
      <p role="status" aria-live="polite" className={styles.labStatus}>
        {description(shape)}
      </p>
      <button
        className="button"
        type="button"
        onClick={() => setShape("one")}
        disabled={shape === "one"}
      >
        Reset to one transform
      </button>
    </div>
  );
}
