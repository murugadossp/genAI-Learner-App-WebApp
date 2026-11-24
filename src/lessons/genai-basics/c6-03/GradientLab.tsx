"use client";

import { useState } from "react";
import { gradientAt, lossAt, START, stepDown, TARGET } from "./gradient";
import styles from "./lesson.module.css";

type Point = { w: number; loss: number };
const INITIAL_RATE = 0.25;
const MAX_STEPS = 8;

const firstPoint: Point = { w: START, loss: lossAt(START) };

const number = (value: number) =>
  Number.isFinite(value) ? value.toFixed(2) : "not finite";

export function GradientLab() {
  const [learningRate, setLearningRate] = useState(INITIAL_RATE);
  const [trajectory, setTrajectory] = useState<Point[]>([firstPoint]);
  const current = trajectory[trajectory.length - 1];
  const gradient = gradientAt(current.w);

  function appendSteps(count: number) {
    setTrajectory((previous) => {
      const next = [...previous];
      for (let i = 0; i < count; i++) {
        const w = stepDown(next[next.length - 1].w, learningRate);
        next.push({ w, loss: lossAt(w) });
      }
      return next;
    });
  }

  function reset() {
    setTrajectory([firstPoint]);
  }

  const values = trajectory.map((point) => point.w);
  const xMin = Math.min(...values, TARGET) - 2;
  const xMax = Math.max(...values, TARGET) + 2;
  const lossMax = Math.max(...trajectory.map((point) => point.loss), 1) * 1.15;
  const left = 56;
  const right = 544;
  const top = 28;
  const bottom = 250;
  const x = (w: number) => left + ((w - xMin) / (xMax - xMin)) * (right - left);
  const y = (loss: number) => bottom - (loss / lossMax) * (bottom - top);
  const curvePoints = Array.from({ length: 81 }, (_, index) => {
    const w = xMin + ((xMax - xMin) * index) / 80;
    return `${x(w)},${y(lossAt(w))}`;
  }).join(" ");
  const visitedPoints = trajectory
    .map((point) => `${x(point.w)},${y(point.loss)}`)
    .join(" ");
  const stepCount = trajectory.length - 1;

  return (
    <div className="lab" data-testid="gradient-lab">
      <div className="lab-head">
        <strong>01 / Follow the loss downhill</strong>
        <span className="pill">TOY SIMULATION</span>
      </div>
      <div className={`lab-body ${styles.labBody}`}>
        <p className={styles.labIntro}>
          This made-up example has one adjustable prediction, <var>w</var>, and
          one known target: 4. Start at <var>w</var> = 0. Each step uses the
          slope of this bowl and the selected rate to calculate a new value.
        </p>

        <label className={styles.rateLabel} htmlFor="learning-rate">
          <strong>Learning rate (step size): {learningRate.toFixed(2)}</strong>
          <span className="micro">
            When the slope is non-zero, a larger rate makes a larger change.
          </span>
        </label>
        <input
          id="learning-rate"
          className={styles.slider}
          type="range"
          min="0.05"
          max="2.2"
          step="0.05"
          value={learningRate}
          onChange={(event) =>
            setLearningRate(Number(event.currentTarget.value))
          }
        />

        <div
          className={styles.controls}
          role="group"
          aria-label="Gradient descent controls"
        >
          <button className="button" onClick={() => appendSteps(1)}>
            Take one step
          </button>
          <button onClick={() => appendSteps(MAX_STEPS)}>
            Run 8 more steps
          </button>
          <button onClick={reset}>Reset</button>
        </div>

        <div className={styles.readout} data-testid="gradient-readout">
          <p aria-live="polite" role="status" aria-atomic="true">
            <strong>Step {stepCount}.</strong> Prediction <var>w</var> ={" "}
            <output data-testid="prediction">{number(current.w)}</output>; loss
            = <output data-testid="loss">{number(current.loss)}</output>.
          </p>
          <p className="micro">
            Current slope = {number(gradient)}. The next update is <var>w</var>−
            rate × slope.
          </p>
        </div>

        <figure className={styles.chart}>
          <svg
            viewBox="0 0 600 320"
            role="img"
            aria-labelledby="loss-plot-title"
            aria-describedby="loss-plot-description"
            data-testid="loss-plot"
          >
            <title id="loss-plot-title">
              The toy loss bowl and update path
            </title>
            <desc id="loss-plot-description">
              A U-shaped curve shows the loss for each prediction. Its lowest
              point is at the target, 4. The highlighted marker shows the
              current prediction, and the connected dots show earlier update
              positions in order.
            </desc>
            <line
              className={styles.axis}
              x1={left}
              y1={bottom}
              x2={right}
              y2={bottom}
            />
            <line
              className={styles.axis}
              x1={left}
              y1={top}
              x2={left}
              y2={bottom}
            />
            <line
              className={styles.targetLine}
              x1={x(TARGET)}
              y1={top}
              x2={x(TARGET)}
              y2={bottom}
            />
            <polyline className={styles.lossCurve} points={curvePoints} />
            {trajectory.length > 1 && (
              <polyline className={styles.updatePath} points={visitedPoints} />
            )}
            {trajectory.slice(0, -1).map((point, index) => (
              <circle
                className={styles.pastPoint}
                cx={x(point.w)}
                cy={y(point.loss)}
                r="4"
                key={`point-${index}`}
              />
            ))}
            <circle
              className={styles.currentPoint}
              cx={x(current.w)}
              cy={y(current.loss)}
              r="8"
              data-testid="current-point"
            />
            <text
              className={styles.targetLabel}
              x={x(TARGET)}
              y={bottom + 21}
              textAnchor="middle"
            >
              target 4
            </text>
            <text
              className={styles.targetLabel}
              x={left}
              y={bottom + 21}
              textAnchor="start"
              data-testid="x-min"
            >
              {xMin.toFixed(1)}
            </text>
            <text
              className={styles.targetLabel}
              x={right}
              y={bottom + 21}
              textAnchor="end"
              data-testid="x-max"
            >
              {xMax.toFixed(1)}
            </text>
            <text
              className={styles.axisLabel}
              x={(left + right) / 2}
              y="310"
              textAnchor="middle"
            >
              Prediction w
            </text>
            <text
              className={styles.axisLabel}
              x="16"
              y={(top + bottom) / 2}
              textAnchor="middle"
              transform={`rotate(-90 16 ${(top + bottom) / 2})`}
            >
              Loss L(w)
            </text>
          </svg>
          <figcaption className="micro">
            The vertical axis rescales to keep the whole path visible. Each dot
            is a calculated update; the ball-shaped marker is repositioned
            between steps, with no simulated rolling or momentum.
          </figcaption>
        </figure>

        <p className="micro lab-disclosure">
          Invented target and values. This deterministic toy uses the exact
          gradient of <var>L(w) = ½(w − 4)²</var>, with no added randomness. It
          is not a live model or a complete training setup.
        </p>
      </div>
    </div>
  );
}
