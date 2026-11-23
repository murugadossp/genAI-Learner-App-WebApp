"use client";

import { useRef, useState } from "react";
import styles from "./lesson.module.css";

type DeliveryPoint = {
  km: number;
  min: number;
};

type PresetId = "default" | "tight" | "outlier" | "custom";

const DEFAULT_POINTS: DeliveryPoint[] = [
  { km: 1, min: 9 },
  { km: 2, min: 11 },
  { km: 3, min: 14 },
  { km: 4, min: 22 },
  { km: 5, min: 25 },
  { km: 6, min: 27 },
];

const TIGHT_POINTS: DeliveryPoint[] = [
  { km: 1, min: 8 },
  { km: 2, min: 13 },
  { km: 3, min: 15 },
  { km: 4, min: 19 },
  { km: 5, min: 25 },
  { km: 6, min: 28 },
];

const OUTLIER_POINTS: DeliveryPoint[] = [
  { km: 1, min: 9 },
  { km: 2, min: 11 },
  { km: 3, min: 14 },
  { km: 4, min: 22 },
  { km: 5, min: 25 },
  { km: 6, min: 45 },
];

const QUERY_KM = 3.5;
const MIN_Y = 4;
const MAX_Y = 48;
const Y_MIN = -8;
const Y_MAX = 60;
const Y_TICKS = [0, 10, 20, 30, 40, 50, 60];

// SVG coordinate frame
const SVG_W = 560;
const SVG_H = 320;
const PAD_LEFT = 54;
const PAD_RIGHT = 24;
const PAD_TOP = 20;
const PAD_BOTTOM = 46;
const PLOT_W = SVG_W - PAD_LEFT - PAD_RIGHT;
const PLOT_H = SVG_H - PAD_TOP - PAD_BOTTOM;

function toSvgX(km: number): number {
  return PAD_LEFT + (km / 7) * PLOT_W;
}

function toSvgY(min: number): number {
  return PAD_TOP + ((Y_MAX - min) / (Y_MAX - Y_MIN)) * PLOT_H;
}

function fromSvgY(svgY: number): number {
  const raw = Y_MAX - ((svgY - PAD_TOP) / PLOT_H) * (Y_MAX - Y_MIN);
  return Math.max(MIN_Y, Math.min(MAX_Y, Math.round(raw)));
}

function fitOLS(points: DeliveryPoint[]) {
  const n = points.length;
  const meanX = points.reduce((s, p) => s + p.km, 0) / n;
  const meanY = points.reduce((s, p) => s + p.min, 0) / n;
  let num = 0;
  let den = 0;
  for (const p of points) {
    num += (p.km - meanX) * (p.min - meanY);
    den += (p.km - meanX) * (p.km - meanX);
  }
  const slope = den === 0 ? 0 : num / den;
  const intercept = meanY - slope * meanX;
  const predict = (km: number) => slope * km + intercept;
  const avgGap =
    points.reduce((s, p) => s + Math.abs(p.min - predict(p.km)), 0) / n;
  return { slope, intercept, predict, avgGap };
}

function clipLineToBox(
  slope: number,
  intercept: number,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
): { x1: number; y1: number; x2: number; y2: number } {
  let lo = xMin;
  let hi = xMax;
  if (Math.abs(slope) > 1e-9) {
    const xAtYMin = (yMin - intercept) / slope;
    const xAtYMax = (yMax - intercept) / slope;
    const yLo = Math.min(xAtYMin, xAtYMax);
    const yHi = Math.max(xAtYMin, xAtYMax);
    lo = Math.max(lo, yLo);
    hi = Math.min(hi, yHi);
  }
  if (lo > hi) {
    return {
      x1: xMin,
      y1: Math.max(yMin, Math.min(yMax, slope * xMin + intercept)),
      x2: xMax,
      y2: Math.max(yMin, Math.min(yMax, slope * xMax + intercept)),
    };
  }
  return {
    x1: lo,
    y1: slope * lo + intercept,
    x2: hi,
    y2: slope * hi + intercept,
  };
}

export function RegressionLab() {
  const [points, setPoints] = useState<DeliveryPoint[]>(() =>
    DEFAULT_POINTS.map((p) => ({ ...p })),
  );
  const [preset, setPreset] = useState<PresetId>("default");
  const [selectedIndex, setSelectedIndex] = useState<number>(5);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>(
    "Starting with Sam's 6 deliveries. Trace 3.5 km up to the line to see the 18.0 min estimate.",
  );
  const svgRef = useRef<SVGSVGElement | null>(null);

  const { slope, intercept, predict, avgGap } = fitOLS(points);
  const estimateAtQuery = predict(QUERY_KM);

  const clippedLine = clipLineToBox(slope, intercept, 0.5, 6.5, Y_MIN, Y_MAX);

  function applyPreset(next: Exclude<PresetId, "custom">) {
    const source =
      next === "default"
        ? DEFAULT_POINTS
        : next === "tight"
          ? TIGHT_POINTS
          : OUTLIER_POINTS;
    const copy = source.map((p) => ({ ...p }));
    const fit = fitOLS(copy);
    setPoints(copy);
    setPreset(next);
    if (next === "default") {
      setStatusMessage(
        `Loaded Sam's 6 deliveries (replaced current points). Estimate at 3.5 km is ${fit.predict(QUERY_KM).toFixed(1)} min with an average gap of ${fit.avgGap.toFixed(1)} min.`,
      );
    } else if (next === "tight") {
      setStatusMessage(
        `Loaded the tight pattern preset (replaced current points). Compared with Sam's original 6 deliveries, the 3.5 km estimate is ${fit.predict(QUERY_KM).toFixed(1)} min and the average gap drops from 1.3 min to ${fit.avgGap.toFixed(1)} min.`,
      );
    } else {
      setSelectedIndex(5);
      setStatusMessage(
        `Loaded the delay outlier preset (replaced current points; changed the 6 km ride from 27 min to 45 min). Compared with Sam's original 6 deliveries, the slope is steeper at ${fit.slope.toFixed(1)} min/km and the 3.5 km estimate is ${fit.predict(QUERY_KM).toFixed(1)} min (up from 18.0 min).`,
      );
    }
  }

  function updatePoint(index: number, nextMin: number) {
    const clamped = Math.max(MIN_Y, Math.min(MAX_Y, nextMin));
    setPoints((prev) => {
      const next = prev.map((p, i) =>
        i === index ? { ...p, min: clamped } : p,
      );
      const fit = fitOLS(next);
      setStatusMessage(
        `Moved the ${next[index].km} km delivery to ${clamped} min. Estimate at 3.5 km is now ${fit.predict(QUERY_KM).toFixed(1)} min (average gap ${fit.avgGap.toFixed(1)} min).`,
      );
      return next;
    });
    setPreset("custom");
  }

  function handlePointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (draggingIndex === null || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleY = SVG_H / rect.height;
    const svgY = (e.clientY - rect.top) * scaleY;
    const nextMin = fromSvgY(svgY);
    if (points[draggingIndex].min !== nextMin) {
      updatePoint(draggingIndex, nextMin);
    }
  }

  function handlePointerUp() {
    setDraggingIndex(null);
  }

  const selectedPoint = points[selectedIndex];

  return (
    <div className={styles.lab} data-testid="regression-lab">
      <p className={`micro ${styles.labNote}`}>
        Illustrative toy model: uses ordinary least squares on 6 invented bike
        deliveries to show how a straight fitted line responds to data.
      </p>

      <div
        className={styles.presetRow}
        role="group"
        aria-label="Delivery data presets"
      >
        <button
          type="button"
          className={styles.presetBtn}
          aria-pressed={preset === "default"}
          onClick={() => applyPreset("default")}
        >
          Sam’s 6 deliveries
        </button>
        <button
          type="button"
          className={styles.presetBtn}
          aria-pressed={preset === "tight"}
          onClick={() => applyPreset("tight")}
        >
          Tight pattern
        </button>
        <button
          type="button"
          className={styles.presetBtn}
          aria-pressed={preset === "outlier"}
          onClick={() => applyPreset("outlier")}
        >
          Delay outlier
        </button>
        <button
          type="button"
          className={styles.resetBtn}
          onClick={() => applyPreset("default")}
        >
          Reset
        </button>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Estimate at 3.5 km</span>
          <span className={styles.metricValue} data-testid="estimate-value">
            {estimateAtQuery.toFixed(1)} min
          </span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Slope (min per km)</span>
          <span className={styles.metricValue} data-testid="slope-value">
            {slope.toFixed(1)} min/km
          </span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Average gap</span>
          <span className={styles.metricValue} data-testid="gap-value">
            {avgGap.toFixed(1)} min
          </span>
        </div>
      </div>

      <div className={styles.chartWrap}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className={styles.chartSvg}
          role="img"
          aria-label={`Interactive scatter plot of 6 bike deliveries with a fitted line estimating ${estimateAtQuery.toFixed(1)} minutes at 3.5 kilometers`}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Horizontal gridlines */}
          {Y_TICKS.map((tick) => (
            <g key={`y-${tick}`}>
              <line
                x1={PAD_LEFT}
                y1={toSvgY(tick)}
                x2={SVG_W - PAD_RIGHT}
                y2={toSvgY(tick)}
                className={styles.gridLine}
              />
              <text
                x={PAD_LEFT - 10}
                y={toSvgY(tick) + 4}
                textAnchor="end"
                className={styles.axisText}
              >
                {tick}
              </text>
            </g>
          ))}

          {/* Vertical ticks */}
          {[1, 2, 3, 4, 5, 6].map((km) => (
            <g key={`x-${km}`}>
              <line
                x1={toSvgX(km)}
                y1={PAD_TOP}
                x2={toSvgX(km)}
                y2={SVG_H - PAD_BOTTOM}
                className={styles.gridLine}
              />
              <text
                x={toSvgX(km)}
                y={SVG_H - PAD_BOTTOM + 18}
                textAnchor="middle"
                className={styles.axisText}
              >
                {km}
              </text>
            </g>
          ))}

          {/* Axes */}
          <line
            x1={PAD_LEFT}
            y1={PAD_TOP}
            x2={PAD_LEFT}
            y2={SVG_H - PAD_BOTTOM}
            className={styles.axisLine}
          />
          <line
            x1={PAD_LEFT}
            y1={SVG_H - PAD_BOTTOM}
            x2={SVG_W - PAD_RIGHT}
            y2={SVG_H - PAD_BOTTOM}
            className={styles.axisLine}
          />

          {/* Axis titles */}
          <text
            x={PAD_LEFT + PLOT_W / 2}
            y={SVG_H - 8}
            textAnchor="middle"
            className={styles.axisTitle}
          >
            Distance (km)
          </text>
          <text
            x={16}
            y={PAD_TOP + PLOT_H / 2}
            textAnchor="middle"
            transform={`rotate(-90 16 ${PAD_TOP + PLOT_H / 2})`}
            className={styles.axisTitle}
          >
            Time (min)
          </text>

          {/* Guide lines for 3.5 km estimate */}
          <line
            x1={toSvgX(QUERY_KM)}
            y1={SVG_H - PAD_BOTTOM}
            x2={toSvgX(QUERY_KM)}
            y2={toSvgY(estimateAtQuery)}
            className={styles.guideLine}
          />
          <line
            x1={PAD_LEFT}
            y1={toSvgY(estimateAtQuery)}
            x2={toSvgX(QUERY_KM)}
            y2={toSvgY(estimateAtQuery)}
            className={styles.guideLine}
          />

          {/* Vertical error (gap) lines */}
          {points.map((p) => {
            const predY = predict(p.km);
            return (
              <line
                key={`err-${p.km}`}
                x1={toSvgX(p.km)}
                y1={toSvgY(p.min)}
                x2={toSvgX(p.km)}
                y2={toSvgY(predY)}
                className={styles.errorLine}
              />
            );
          })}

          {/* Fitted line */}
          <line
            x1={toSvgX(clippedLine.x1)}
            y1={toSvgY(clippedLine.y1)}
            x2={toSvgX(clippedLine.x2)}
            y2={toSvgY(clippedLine.y2)}
            className={styles.fittedLine}
          />

          {/* Query estimate diamond marker at 3.5 km */}
          <polygon
            points={`${toSvgX(QUERY_KM)},${toSvgY(estimateAtQuery) - 7} ${toSvgX(QUERY_KM) + 7},${toSvgY(estimateAtQuery)} ${toSvgX(QUERY_KM)},${toSvgY(estimateAtQuery) + 7} ${toSvgX(QUERY_KM) - 7},${toSvgY(estimateAtQuery)}`}
            className={styles.estimateMarker}
          />

          {/* Draggable data points */}
          {points.map((p, index) => {
            const cx = toSvgX(p.km);
            const cy = toSvgY(p.min);
            const isSelected = index === selectedIndex;
            const predY = predict(p.km);
            const labelY = p.min < predY ? cy + 20 : cy - 12;
            return (
              <g
                key={`pt-${p.km}`}
                className={styles.pointGroup}
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  setSelectedIndex(index);
                  setDraggingIndex(index);
                }}
              >
                <circle cx={cx} cy={cy} r={18} fill="transparent" />
                <circle
                  cx={cx}
                  cy={cy}
                  r={8}
                  className={
                    isSelected ? styles.pointHandleSelected : styles.pointHandle
                  }
                />
                <text
                  x={cx}
                  y={labelY}
                  textAnchor="middle"
                  className={styles.pointLabel}
                >
                  {p.min}m
                </text>
              </g>
            );
          })}
        </svg>

        <div className={styles.legendRow} aria-hidden="true">
          <span className={styles.legendItem}>
            <span className={styles.swatchDot} /> Past delivery (drag)
          </span>
          <span className={styles.legendItem}>
            <span className={styles.swatchLine} /> Fitted line
          </span>
          <span className={styles.legendItem}>
            <span className={styles.swatchDiamond} /> 3.5 km estimate
          </span>
          <span className={styles.legendItem}>
            <span className={styles.swatchError} /> Vertical gap
          </span>
        </div>
      </div>

      <div className={styles.adjusterBox}>
        <div className={styles.adjusterHeader}>
          <strong>Adjust a delivery with buttons or keyboard:</strong>
          <span data-testid="selected-point-readout">
            {selectedPoint.km} km delivery = {selectedPoint.min} min
          </span>
        </div>
        <div
          className={styles.pointPickerRow}
          role="group"
          aria-label="Choose a delivery to adjust"
        >
          {points.map((p, i) => (
            <button
              key={`pick-${p.km}`}
              type="button"
              className={styles.pointChip}
              aria-pressed={i === selectedIndex}
              onClick={() => setSelectedIndex(i)}
            >
              {p.km} km
            </button>
          ))}
        </div>
        <div className={styles.stepControls}>
          <button
            type="button"
            className={styles.stepBtn}
            disabled={selectedPoint.min <= MIN_Y}
            onClick={() =>
              updatePoint(
                selectedIndex,
                selectedPoint.min - Math.min(2, selectedPoint.min - MIN_Y),
              )
            }
          >
            −{Math.max(1, Math.min(2, selectedPoint.min - MIN_Y))} min
          </button>
          <button
            type="button"
            className={styles.stepBtn}
            disabled={selectedPoint.min >= MAX_Y}
            onClick={() =>
              updatePoint(
                selectedIndex,
                selectedPoint.min + Math.min(2, MAX_Y - selectedPoint.min),
              )
            }
          >
            +{Math.max(1, Math.min(2, MAX_Y - selectedPoint.min))} min
          </button>
          <span className="micro">
            Range: {MIN_Y}–{MAX_Y} min
          </span>
        </div>
      </div>

      <p
        className={styles.statusBar}
        role="status"
        aria-live="polite"
        data-testid="lab-status"
      >
        {statusMessage}
      </p>
    </div>
  );
}
