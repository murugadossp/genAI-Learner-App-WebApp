"use client";
import { useMemo, useState } from "react";
import {
  MAX_PARAMS,
  fit,
  heldOut,
  hiddenPattern,
  predict,
  rmse,
  trainingSets,
} from "./fit";
import styles from "./lesson.module.css";

type Data = "few" | "many";
const W = 480;
const H = 280;
const sx = (x: number) => ((x + 1) / 2) * W;
const sy = (y: number) => H / 2 - (y / 1.3) * (H / 2);
const path = (f: (x: number) => number) =>
  Array.from({ length: 121 }, (_, i) => {
    const x = -1 + (2 * i) / 120;
    return `${i ? "L" : "M"}${sx(x).toFixed(1)} ${sy(f(x)).toFixed(1)}`;
  }).join(" ");

function verdict(m: number, best: number, test: number, bestTest: number) {
  if (test <= bestTest * 1.15)
    return "Close to the best held-out error this data allows.";
  return m < best
    ? "Too small: too few adjustable numbers to follow the pattern."
    : "Too flexible: it bends to chase the noise in these examples.";
}

export function FitLab() {
  const [m, setM] = useState(3);
  const [data, setData] = useState<Data>("few");
  const train = trainingSets[data];
  const all = useMemo(
    () =>
      Array.from({ length: MAX_PARAMS }, (_, i) => {
        const w = fit(train, i + 1);
        return { n: i + 1, w, tr: rmse(w, train), te: rmse(w, heldOut) };
      }),
    [train],
  );
  const best = all.reduce((a, b) => (b.te < a.te ? b : a));
  const cur = all[m - 1];
  const worst = 0.7;
  return (
    <div className="lab">
      <div className="lab-head">
        <strong>01 / Turn the size dial</strong>
        <span className="pill">SIMULATION</span>
      </div>
      <div className="lab-body">
        <div className={styles.controls}>
          <div>
            <label htmlFor="size">
              <strong>
                Model size: {m} adjustable {m === 1 ? "number" : "numbers"}
              </strong>
            </label>
            <input
              className="window-slider"
              id="size"
              type="range"
              min={1}
              max={MAX_PARAMS}
              step={1}
              value={m}
              onChange={(e) => setM(Number(e.target.value))}
            />
          </div>
          <fieldset className={styles.fieldset}>
            <legend>
              <strong>Examples to learn from</strong>
            </legend>
            {(["few", "many"] as const).map((d) => (
              <label key={d} className={styles.choice}>
                <input
                  type="radio"
                  name="amount"
                  checked={data === d}
                  onChange={() => setData(d)}
                />
                {d === "few" ? "12 examples" : "40 examples"}
              </label>
            ))}
          </fieldset>
          <button
            type="button"
            onClick={() => {
              setM(3);
              setData("few");
            }}
          >
            Reset
          </button>
        </div>
        <div className={styles.grid}>
          <figure className={styles.plot}>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              role="img"
              aria-label={`Toy fit with ${m} adjustable numbers to ${train.length} examples. Training error ${cur.tr.toFixed(2)}, held-out error ${cur.te.toFixed(2)}.`}
            >
              <defs>
                <clipPath id="plot-clip">
                  <rect width={W} height={H} />
                </clipPath>
              </defs>
              <g clipPath="url(#plot-clip)">
                <path
                  d={path(hiddenPattern)}
                  className={styles.hidden}
                  data-testid="hidden"
                />
                <path
                  d={path((x) => predict(cur.w, x))}
                  className={styles.curve}
                  data-testid="curve"
                />
                {train.map((p, i) => (
                  <circle
                    key={i}
                    cx={sx(p.x)}
                    cy={sy(p.y)}
                    r={4}
                    className={styles.dot}
                  />
                ))}
              </g>
            </svg>
            <figcaption className="micro">
              Dots: invented training examples. Dashed: the hidden pattern they
              were drawn from (plus noise). Solid: what the model learned.
            </figcaption>
          </figure>
          <div className={styles.panel}>
            <p className={styles.stat}>
              <span>Error on training examples</span>
              <strong data-testid="train-err">{cur.tr.toFixed(2)}</strong>
            </p>
            <p className={styles.stat}>
              <span>Error on held-out examples</span>
              <strong data-testid="test-err">{cur.te.toFixed(2)}</strong>
            </p>
            <p className={styles.verdict} role="status">
              {verdict(m, best.n, cur.te, best.te)}
            </p>
            <h3 className={styles.h3}>Learned numbers</h3>
            <ul className={styles.weights} data-testid="weights">
              {cur.w.map((v, i) => (
                <li key={i}>
                  w{i + 1} <strong>{v.toFixed(2)}</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <h3 className={styles.h3}>
          Held-out error at every size ({train.length} examples)
        </h3>
        <p className="micro">
          Bars stop at an error of 0.70; values are exact.
        </p>
        <ol className={styles.bars} data-testid="bars">
          {all.map((r) => (
            <li key={r.n} data-current={r.n === m} data-best={r.n === best.n}>
              <span>{r.n}</span>
              <span className={styles.bar} aria-hidden="true">
                <span
                  style={{ width: `${Math.min(r.te / worst, 1) * 100}%` }}
                />
              </span>
              <span>
                {r.te.toFixed(2)}
                {r.n === best.n ? " lowest" : ""}
              </span>
            </li>
          ))}
        </ol>
        <p className="micro lab-disclosure">
          Everything here is invented: the hidden pattern, the noisy examples
          and the errors, which are root-mean-square gaps between the curve and
          the dots. The “model” is a curve fitted by least squares, not a neural
          network, and its “parameters” are curve coefficients. Real language
          models have millions to billions of weights arranged in layers and are
          trained very differently, so this shows the idea of capacity versus
          data, not how any real model behaves.
        </p>
      </div>
    </div>
  );
}
