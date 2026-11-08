"use client";
import { useEffect, useId, useRef, useState } from "react";
import styles from "./lesson.module.css";

type Scenario = {
  id: "story" | "fact";
  label: string;
  prompt: string;
  note: string;
  choices: { word: string; score: number }[];
  truth?: string;
};

const scenarios: Scenario[] = [
  {
    id: "story",
    label: "Open-ended: finish a story line",
    prompt: "The lighthouse keeper opened the …",
    note: "Several continuations are fine here. There is no single right word.",
    choices: [
      { word: "door", score: 2.0 },
      { word: "lantern", score: 1.4 },
      { word: "window", score: 1.0 },
      { word: "logbook", score: 0.6 },
      { word: "hatch", score: 0.2 },
      { word: "storm", score: -0.3 },
      { word: "ocean", score: -0.9 },
      { word: "sandwich", score: -2.0 },
    ],
  },
  {
    id: "fact",
    label: "Factual: a model that often gets this wrong",
    prompt: "The capital of Australia is …",
    note: "In this invented model, a common mix-up is slightly more likely than the right answer.",
    choices: [
      { word: "Sydney", score: 2.6 },
      { word: "Canberra", score: 2.2 },
      { word: "Melbourne", score: 1.0 },
      { word: "Perth", score: -0.2 },
      { word: "Auckland", score: -1.0 },
    ],
    truth: "Canberra",
  },
];

const trims = [
  { id: "none", label: "Keep every choice" },
  { id: "k", label: "Top-k: keep only the 3 most likely" },
  { id: "p", label: "Top-p: keep the fewest choices that add up to 80%" },
] as const;
type TrimId = (typeof trims)[number]["id"];

const DRAWS = 20;

export function softmax(scores: number[], temperature: number) {
  if (temperature <= 0) {
    const top = scores.indexOf(Math.max(...scores));
    return scores.map((_, i) => (i === top ? 1 : 0));
  }
  const scaled = scores.map((s) => s / temperature);
  const m = Math.max(...scaled);
  const exps = scaled.map((s) => Math.exp(s - m));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

export function trim(probs: number[], mode: TrimId) {
  const order = probs
    .map((p, i) => [p, i] as const)
    .sort((a, b) => b[0] - a[0]);
  const keep = new Set<number>();
  if (mode === "none") order.forEach(([, i]) => keep.add(i));
  else if (mode === "k") order.slice(0, 3).forEach(([, i]) => keep.add(i));
  else {
    let total = 0;
    for (const [p, i] of order) {
      keep.add(i);
      total += p;
      if (total >= 0.8 - 1e-9) break;
    }
  }
  const kept = probs.map((p, i) => (keep.has(i) ? p : 0));
  const sum = kept.reduce((a, b) => a + b, 0);
  return kept.map((p) => p / sum);
}

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function draw(probs: number[], seed: number) {
  const r = rng(seed);
  const counts = probs.map(() => 0);
  for (let n = 0; n < DRAWS; n++) {
    const x = r();
    let acc = 0;
    let pick = probs.findIndex((p) => p > 0);
    for (let i = 0; i < probs.length; i++) {
      acc += probs[i];
      if (x < acc && probs[i] > 0) {
        pick = i;
        break;
      }
    }
    counts[pick]++;
  }
  return counts;
}

const pct = (p: number) => `${Math.round(p * 1000) / 10}%`;

export function SamplingLab() {
  const [sid, setSid] = useState<Scenario["id"]>("story");
  const [temp, setTemp] = useState(1);
  const [mode, setMode] = useState<TrimId>("none");
  const [seed, setSeed] = useState(1);
  const [message, setMessage] = useState("");
  const uid = useId();
  const sc = scenarios.find((s) => s.id === sid)!;
  const scores = sc.choices.map((c) => c.score);
  const base = softmax(scores, temp);
  const final = trim(base, mode);
  const counts = draw(final, seed);
  const top = base.indexOf(Math.max(...base));
  const label = temp === 0 ? "0 (always take the top choice)" : temp.toFixed(1);

  const drawn = sc.choices
    .map((c, i) => (counts[i] > 0 ? `${c.word} ${counts[i]}` : ""))
    .filter(Boolean)
    .join(", ");
  const announce = `Temperature ${temp === 0 ? "0" : temp.toFixed(1)}. Top choice ${sc.choices[top].word} at ${pct(final[top])}. Draw set ${seed}, ${DRAWS} draws: ${drawn}.`;
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const t = setTimeout(() => setMessage(announce), 600);
    return () => clearTimeout(t);
  }, [announce]);

  const reset = () => {
    setSid("story");
    setTemp(1);
    setMode("none");
    setSeed(1);
    setMessage("Lab reset.");
  };

  const truthIdx = sc.truth
    ? sc.choices.findIndex((c) => c.word === sc.truth)
    : -1;

  return (
    <div className="lab">
      <div className="lab-head">
        <strong>01 / Change how adventurous the pick is</strong>
        <span className="pill">SIMULATION</span>
      </div>
      <div className="lab-body">
        <fieldset className={styles.row}>
          <legend>Prompt</legend>
          {scenarios.map((x) => (
            <label className={styles.choice} key={x.id}>
              <input
                type="radio"
                name={`${uid}-sc`}
                checked={sid === x.id}
                onChange={() => setSid(x.id)}
              />
              <span>{x.label}</span>
            </label>
          ))}
        </fieldset>
        <p className={styles.prompt}>
          <strong>{sc.prompt}</strong>
        </p>
        <p className="micro">{sc.note}</p>
        <div className={styles.slider}>
          <label htmlFor={`${uid}-t`}>
            <strong>Temperature:</strong> {label}
          </label>
          <input
            id={`${uid}-t`}
            type="range"
            min={0}
            max={2}
            step={0.1}
            value={temp}
            aria-valuetext={temp === 0 ? "0, greedy" : temp.toFixed(1)}
            onChange={(e) => setTemp(Number(e.target.value))}
          />
        </div>
        <fieldset className={styles.row}>
          <legend>Then trim the list</legend>
          {trims.map((x) => (
            <label className={styles.choice} key={x.id}>
              <input
                type="radio"
                name={`${uid}-trim`}
                checked={mode === x.id}
                onChange={() => setMode(x.id)}
              />
              <span>{x.label}</span>
            </label>
          ))}
        </fieldset>
        <table className={styles.table} data-testid="choices">
          <caption className="visually-hidden">
            Probability of each candidate next word, and how many of the {DRAWS}{" "}
            draws picked it
          </caption>
          <thead>
            <tr>
              <th scope="col">Candidate</th>
              <th scope="col">Invented score</th>
              <th scope="col">Chance of being picked</th>
              <th scope="col">Of {DRAWS} draws</th>
            </tr>
          </thead>
          <tbody>
            {sc.choices.map((c, i) => (
              <tr
                key={c.word}
                data-removed={final[i] === 0 && base[i] > 0 ? "yes" : "no"}
                data-testid="choice-row"
              >
                <th scope="row">
                  {c.word}
                  {i === truthIdx && (
                    <span className={styles.right}> (correct)</span>
                  )}
                </th>
                <td>{c.score.toFixed(1)}</td>
                <td>
                  <span className={styles.meter}>
                    <span className={styles.bar} aria-hidden="true">
                      <span style={{ width: `${final[i] * 100}%` }} />
                    </span>
                    <span data-testid="prob">
                      {final[i] === 0 && base[i] > 0
                        ? "Trimmed (0%)"
                        : pct(final[i])}
                    </span>
                  </span>
                </td>
                <td data-testid="count">{counts[i]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className={styles.summary} data-testid="summary">
          {sc.truth
            ? `Chance of the correct answer, ${sc.truth}: ${pct(final[truthIdx])}. Chance of the top-scored mix-up: ${pct(final[0])}.`
            : `Choices that actually get picked: ${counts.filter((n) => n > 0).length} of ${sc.choices.length}.`}
        </p>
        <p className={styles.actions}>
          <button type="button" onClick={() => setSeed((s) => s + 1)}>
            Draw {DRAWS} again
          </button>{" "}
          <button type="button" onClick={reset}>
            Reset lab
          </button>
        </p>
        <div role="status" aria-live="polite" className="visually-hidden">
          {message}
        </div>
        <p className="micro lab-disclosure">
          Everything here is invented: the candidate words, their scores, and
          the idea that the model’s mix-up is a close second. The “draws” come
          from a seeded random generator, so they repeat until you press Draw
          again. The arithmetic is the real part: dividing scores by the
          temperature, converting them to probabilities with softmax, then
          optionally trimming with top-k or top-p, is how common sampling
          settings are described. This is a toy, not a live model, and no
          provider’s exact implementation. Names, ranges and defaults for these
          settings differ between providers and models.
        </p>
      </div>
    </div>
  );
}
