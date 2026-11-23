"use client";
import { useId, useState } from "react";
import styles from "./lesson.module.css";

type LossMode = "mae" | "mse";

interface Trip {
  id: number;
  km: number;
  actual: number;
  note: string;
}

const BASE_MINUTES = 10;

const TRIPS: Trip[] = [
  { id: 1, km: 1, actual: 14, note: "Typical" },
  { id: 2, km: 2, actual: 18, note: "Typical" },
  { id: 3, km: 3, actual: 22, note: "Typical" },
  { id: 4, km: 4, actual: 26, note: "Typical" },
  { id: 5, km: 5, actual: 52, note: "Bridge delay" },
];

const PRESETS = [
  { label: "Best MAE (4.0)", slope: 4 },
  { label: "Best MSE (6.0)", slope: 6 },
  { label: "Steep (8.0)", slope: 8 },
];

const CHART = {
  width: 420,
  height: 240,
  padLeft: 46,
  padRight: 20,
  padTop: 18,
  padBottom: 38,
  maxKm: 5.5,
  maxMin: 60,
};

function toX(km: number) {
  const usable = CHART.width - CHART.padLeft - CHART.padRight;
  return CHART.padLeft + (km / CHART.maxKm) * usable;
}

function toY(minutes: number) {
  const usable = CHART.height - CHART.padTop - CHART.padBottom;
  const clamped = Math.max(0, Math.min(CHART.maxMin, minutes));
  return CHART.padTop + usable - (clamped / CHART.maxMin) * usable;
}

function formatSigned(value: number) {
  if (value === 0) return "0";
  const rounded = Number.isInteger(value) ? String(value) : value.toFixed(1);
  return value > 0 ? `+${rounded}` : rounded;
}

function formatNum(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function LossSliderLab() {
  const [slope, setSlope] = useState<number>(4);
  const [lossMode, setLossMode] = useState<LossMode>("mae");
  const sliderId = useId();
  const insightId = useId();

  const rows = TRIPS.map((trip) => {
    const predicted = BASE_MINUTES + slope * trip.km;
    const error = trip.actual - predicted;
    const absError = Math.abs(error);
    const sqError = error * error;
    return { ...trip, predicted, error, absError, sqError };
  });

  const mae = rows.reduce((sum, r) => sum + r.absError, 0) / rows.length;
  const mse = rows.reduce((sum, r) => sum + r.sqError, 0) / rows.length;

  let insight: string;
  if (slope === 4) {
    insight =
      "At 4.0 min/km, MAE hits its lowest value (4.4 min) because 4 of 5 trips have zero error. MSE stays high (96.8) because the single +22 min delay squares to 484.";
  } else if (slope === 6) {
    insight =
      "At 6.0 min/km, MSE hits its lowest value (52.8) by tilting up toward the 52 min outlier. Notice the trade-off: MAE rises to 6.4 min because every typical trip is now overestimated by 2 to 8 minutes.";
  } else if (slope > 6) {
    insight = `At ${slope.toFixed(1)} min/km, the line overshoots the 4 typical trips so much that both MAE (${mae.toFixed(1)} min) and MSE (${mse.toFixed(1)}) get worse.`;
  } else if (slope < 4) {
    insight = `At ${slope.toFixed(1)} min/km, the line sits below every trip, so both MAE (${mae.toFixed(1)} min) and MSE (${mse.toFixed(1)}) climb.`;
  } else {
    insight = `Between 4.0 and 6.0 min/km, sliding the line up trims the big 5 km miss (lowering MSE to ${mse.toFixed(1)}) while adding error to the 4 typical trips (raising MAE to ${mae.toFixed(1)} min).`;
  }

  const lineStartY = BASE_MINUTES + slope * 0.5;
  const lineEndY = BASE_MINUTES + slope * 5.2;

  return (
    <div className={styles.labBox} data-testid="loss-slider-lab">
      <div className={styles.labHeader}>
        <strong>Rohan’s courier line &amp; loss explorer</strong>
        <button
          type="button"
          className={styles.presetBtn}
          onClick={() => {
            setSlope(4);
            setLossMode("mae");
          }}
        >
          Reset line
        </button>
      </div>

      <div className={styles.controlGroup}>
        <span className={styles.controlLabel}>
          1. Choose which loss function to highlight
        </span>
        <div className={styles.buttonRow}>
          <button
            type="button"
            className={styles.toggleBtn}
            aria-pressed={lossMode === "mae"}
            onClick={() => setLossMode("mae")}
          >
            MAE (absolute error)
          </button>
          <button
            type="button"
            className={styles.toggleBtn}
            aria-pressed={lossMode === "mse"}
            onClick={() => setLossMode("mse")}
          >
            MSE (squared error)
          </button>
        </div>
      </div>

      <div className={styles.controlGroup}>
        <label className={styles.controlLabel} htmlFor={sliderId}>
          2. Slide the line’s slope (Predicted = 10 + slope × km)
        </label>
        <div className={styles.sliderRow}>
          <input
            id={sliderId}
            type="range"
            className={styles.slider}
            min={2}
            max={8}
            step={0.5}
            value={slope}
            aria-describedby={insightId}
            onChange={(e) => setSlope(Number(e.target.value))}
          />
          <span className={styles.sliderValue} data-testid="slope-readout">
            {slope.toFixed(1)} min/km
          </span>
        </div>
      </div>

      <div className={styles.controlGroup}>
        <span className={styles.controlLabel}>Or jump to a preset line</span>
        <div className={styles.buttonRow}>
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              className={styles.presetBtn}
              aria-pressed={slope === preset.slope}
              onClick={() => setSlope(preset.slope)}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.chartWrap}>
        <svg
          className={styles.chartSvg}
          viewBox={`0 0 ${CHART.width} ${CHART.height}`}
          role="img"
          aria-label={`Scatter plot of five delivery trips with prediction line 10 plus ${slope.toFixed(1)} times kilometers. MAE is ${mae.toFixed(1)} minutes and MSE is ${mse.toFixed(1)} square minutes.`}
        >
          {[0, 15, 30, 45, 60].map((tick) => (
            <g key={tick}>
              <line
                x1={CHART.padLeft}
                y1={toY(tick)}
                x2={CHART.width - CHART.padRight}
                y2={toY(tick)}
                className={styles.gridLine}
              />
              <text
                x={CHART.padLeft - 8}
                y={toY(tick) + 4}
                textAnchor="end"
                className={styles.axisText}
              >
                {tick}m
              </text>
            </g>
          ))}

          <line
            x1={CHART.padLeft}
            y1={CHART.padTop}
            x2={CHART.padLeft}
            y2={CHART.height - CHART.padBottom}
            className={styles.axisLine}
          />
          <line
            x1={CHART.padLeft}
            y1={CHART.height - CHART.padBottom}
            x2={CHART.width - CHART.padRight}
            y2={CHART.height - CHART.padBottom}
            className={styles.axisLine}
          />

          {[1, 2, 3, 4, 5].map((km) => (
            <text
              key={km}
              x={toX(km)}
              y={CHART.height - CHART.padBottom + 18}
              textAnchor="middle"
              className={styles.axisText}
            >
              {km} km
            </text>
          ))}

          {rows.map((r) => (
            <line
              key={`res-${r.id}`}
              x1={toX(r.km)}
              y1={toY(r.actual)}
              x2={toX(r.km)}
              y2={toY(r.predicted)}
              className={styles.residualLine}
            />
          ))}

          <line
            x1={toX(0.5)}
            y1={toY(lineStartY)}
            x2={toX(5.2)}
            y2={toY(lineEndY)}
            className={styles.predLine}
          />

          {rows.map((r) => (
            <circle
              key={`pt-${r.id}`}
              cx={toX(r.km)}
              cy={toY(r.actual)}
              r={r.id === 5 ? 6 : 5}
              className={r.id === 5 ? styles.outlierPoint : styles.dataPoint}
            >
              <title>{`Trip ${r.id} (${r.km} km): actual ${r.actual} min, predicted ${formatNum(r.predicted)} min`}</title>
            </circle>
          ))}
        </svg>
      </div>

      <div className={styles.scoreGrid}>
        <div
          className={`${styles.scoreCard} ${
            lossMode === "mae" ? styles.scoreCardActive : ""
          }`}
          data-testid="mae-score"
        >
          <span className={styles.scoreLabel}>
            MAE (mean absolute error){lossMode === "mae" ? " · Active" : ""}
          </span>
          <div className={styles.scoreNumber}>{mae.toFixed(1)} min</div>
          <p className={styles.scoreNote}>Lowest possible: 4.4 min at 4.0</p>
        </div>

        <div
          className={`${styles.scoreCard} ${
            lossMode === "mse" ? styles.scoreCardActive : ""
          }`}
          data-testid="mse-score"
        >
          <span className={styles.scoreLabel}>
            MSE (mean squared error){lossMode === "mse" ? " · Active" : ""}
          </span>
          <div className={styles.scoreNumber}>{mse.toFixed(1)} min²</div>
          <p className={styles.scoreNote}>Lowest possible: 52.8 at 6.0</p>
        </div>
      </div>

      <div
        id={insightId}
        className={styles.insightBox}
        role="status"
        aria-live="polite"
        data-testid="loss-insight"
      >
        {insight}
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.tripTable}>
          <thead>
            <tr>
              <th scope="col">Trip</th>
              <th scope="col">Actual</th>
              <th scope="col">Predicted</th>
              <th scope="col">Error</th>
              <th scope="col">
                {lossMode === "mae" ? "Abs error" : "Squared"}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>
                  {r.km} km ({r.note})
                </td>
                <td>{r.actual} min</td>
                <td>{formatNum(r.predicted)} min</td>
                <td>{formatSigned(r.error)} min</td>
                <td>
                  {lossMode === "mae"
                    ? `${formatNum(r.absError)} min`
                    : formatNum(r.sqError)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className={`micro ${styles.disclaimer}`}>
        Illustrative toy dataset: five invented trips with a fixed 10-minute
        pickup base, designed to show how MAE and MSE react differently to a
        single large outlier.
      </p>
    </div>
  );
}
