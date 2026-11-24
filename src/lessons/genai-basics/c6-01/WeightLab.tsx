"use client";

import { useState } from "react";
import styles from "./lesson.module.css";

const INITIAL = { rain: true, clouds: false, rainWeight: 2, cloudWeight: -1 };

export function WeightLab() {
  const [rain, setRain] = useState(INITIAL.rain);
  const [clouds, setClouds] = useState(INITIAL.clouds);
  const [rainWeight, setRainWeight] = useState(INITIAL.rainWeight);
  const [cloudWeight, setCloudWeight] = useState(INITIAL.cloudWeight);
  const bias = -1;
  const rainValue = Number(rain);
  const cloudValue = Number(clouds);
  const score = rainValue * rainWeight + cloudValue * cloudWeight + bias;
  const reminder = score >= 0;
  const format = (value: number) =>
    Number.isInteger(value) ? String(value) : value.toFixed(1);

  function reset() {
    setRain(INITIAL.rain);
    setClouds(INITIAL.clouds);
    setRainWeight(INITIAL.rainWeight);
    setCloudWeight(INITIAL.cloudWeight);
  }

  return (
    <div className={styles.lab} data-testid="weight-lab">
      <p className={styles.labNote}>
        <strong>Invented teaching example:</strong> these signals and numbers
        are made up. This is not a weather forecast or a live AI model.
      </p>
      <div className={styles.controls}>
        <fieldset className={styles.inputGroup}>
          <legend>Set the toy input signals</legend>
          <label className={styles.toggleRow}>
            <input
              type="checkbox"
              checked={rain}
              onChange={(event) => setRain(event.target.checked)}
            />
            <span>Rain signal</span>
            <output>{rainValue}</output>
          </label>
          <label className={styles.toggleRow}>
            <input
              type="checkbox"
              checked={clouds}
              onChange={(event) => setClouds(event.target.checked)}
            />
            <span>Dark-cloud signal</span>
            <output>{cloudValue}</output>
          </label>
          <p className="micro">Each signal is 0 (off) or 1 (on).</p>
        </fieldset>

        <fieldset className={styles.inputGroup}>
          <legend>Change each weight</legend>
          <label className={styles.rangeLabel} htmlFor="rain-weight">
            <span>Rain weight</span>
            <output>{format(rainWeight)}</output>
          </label>
          <input
            className={styles.range}
            id="rain-weight"
            type="range"
            min="-2"
            max="2"
            step="0.5"
            value={rainWeight}
            onChange={(event) => setRainWeight(Number(event.target.value))}
          />
          <label className={styles.rangeLabel} htmlFor="cloud-weight">
            <span>Dark-cloud weight</span>
            <output>{format(cloudWeight)}</output>
          </label>
          <input
            className={styles.range}
            id="cloud-weight"
            type="range"
            min="-2"
            max="2"
            step="0.5"
            value={cloudWeight}
            onChange={(event) => setCloudWeight(Number(event.target.value))}
          />
        </fieldset>
      </div>

      <div className={styles.flow} aria-label="The neuron calculation">
        <div className={styles.flowBranch}>
          <span>{rainValue} rain</span>
          <span aria-hidden="true">×</span>
          <span>{format(rainWeight)} weight</span>
        </div>
        <div className={styles.flowBranch}>
          <span>{cloudValue} clouds</span>
          <span aria-hidden="true">×</span>
          <span>{format(cloudWeight)} weight</span>
        </div>
        <div className={styles.flowResult}>
          Add both products and bias ({bias})
        </div>
        <div className={styles.scoreBox}>
          <span>Score</span>
          <strong data-testid="score-value">{format(score)}</strong>
        </div>
      </div>

      <p className={styles.equation}>
        {rainValue} × {format(rainWeight)} + {cloudValue} ×{" "}
        {format(cloudWeight)} + ({bias}) = <strong>{format(score)}</strong>
      </p>
      <p className={styles.result} data-testid="reminder-result">
        <strong>Toy reminder rule:</strong> show a reminder when the score is 0
        or higher. <span>{reminder ? "Reminder on" : "Reminder off"}</span>
      </p>
      <p
        className="visually-hidden"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        Score {format(score)}. {reminder ? "Reminder on." : "Reminder off."}
      </p>
      <button type="button" className="button" onClick={reset}>
        Reset example
      </button>
    </div>
  );
}
