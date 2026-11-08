"use client";
import { useId, useState } from "react";
import styles from "./lesson.module.css";

const TODAY = 24;
const WINDOW = 3;
const WELL = 0.8;

type Key = "fare" | "station" | "end";
type Event = {
  month: number;
  text: string;
  sets?: Partial<Record<Key, string>>;
};
const events: Event[] = [
  {
    month: 2,
    text: "Linden Line tram opens. Stops include Dock Street; the last stop is Westbank.",
    sets: { station: "Dock Street", end: "Westbank" },
  },
  {
    month: 6,
    text: "Fare cap set at 5 coins.",
    sets: { fare: "5 coins" },
  },
  { month: 10, text: "Night service added." },
  {
    month: 14,
    text: "Dock Street station is renamed Harbour Gate.",
    sets: { station: "Harbour Gate" },
  },
  {
    month: 18,
    text: "Fare cap raised to 6 coins.",
    sets: { fare: "6 coins" },
  },
  {
    month: 22,
    text: "Line extended; the new last stop is Eastfield.",
    sets: { end: "Eastfield" },
  },
];

const questions = [
  { id: "fare", label: "What is the Linden Line fare cap?" },
  {
    id: "station",
    label:
      "What is the Linden Line’s Dock Street / Harbour Gate station called?",
  },
  { id: "end", label: "Which stop is the last stop?" },
  { id: "today", label: "What month is it today?" },
] as const;
type QId = (typeof questions)[number]["id"];

const sources = [
  { id: "alone", label: "Model alone: nothing added to the request" },
  { id: "old", label: "Add an old notice, dated month 8" },
  { id: "new", label: "Add a current notice, dated month 24" },
] as const;
type SId = (typeof sources)[number]["id"];
const noticeMonth: Record<SId, number> = { alone: 0, old: 8, new: 24 };

type Status = "current" | "stale" | "unsteady" | "none";
const tagText: Record<Status, string> = {
  current: "Matches today in this toy world",
  stale: "Out of date",
  unsteady: "Unsteady",
  none: "No basis",
};

function versions(key: Key) {
  return events
    .filter((e) => e.sets?.[key])
    .map((e) => ({ month: e.month, value: e.sets![key]! }));
}
function coverage(eventMonth: number, cutoff: number) {
  return Math.max(0, Math.min(1, (cutoff - eventMonth) / WINDOW));
}
function stateOf(eventMonth: number, cutoff: number) {
  if (eventMonth > cutoff) return "absent" as const;
  return coverage(eventMonth, cutoff) >= WELL
    ? ("well" as const)
    : ("thin" as const);
}

function answer(q: QId, s: SId, cutoff: number) {
  const n = noticeMonth[s];
  if (q === "today") {
    if (s === "alone")
      return {
        status: "unsteady" as Status,
        text: `Probably around month ${cutoff}.`,
        note: "Nothing in training text says what today is. This toy guesses near its own cutoff, which is too early. Real models vary; many apps put the current date in the request.",
      };
    return {
      status: (n === TODAY ? "current" : "stale") as Status,
      text: `Month ${n}.`,
      note: `Read from the supplied notice, dated month ${n}. ${n === TODAY ? "The notice is current." : "The notice is old, so the answer is old."}`,
    };
  }
  const v = versions(q);
  const final = v[v.length - 1];
  if (s !== "alone") {
    const seen = v.filter((x) => x.month <= n);
    if (!seen.length)
      return {
        status: "none" as Status,
        text: "The notice does not say.",
        note: "Supplied text only helps when it contains the fact.",
      };
    const latest = seen[seen.length - 1];
    return {
      status: (latest === final ? "current" : "stale") as Status,
      text: latest.value,
      note: `Taken from the notice, dated month ${n}. ${latest === final ? "A current source gives a current answer." : "The notice predates a later change, so the answer is old."} The toy cannot check the notice itself.`,
    };
  }
  const seen = v.filter((x) => x.month <= cutoff);
  if (!seen.length)
    return {
      status: "none" as Status,
      text: "No answer from training.",
      note: "No text about this existed before the cutoff. A real model might still produce a fluent guess, so unsupported answers need checking.",
    };
  const latest = seen[seen.length - 1];
  const prev = seen[seen.length - 2];
  const newer = latest !== final;
  if (coverage(latest.month, cutoff) < WELL) {
    return {
      status: "unsteady" as Status,
      text: prev
        ? `${latest.value} or ${prev.value}`
        : `${latest.value} (not sure)`,
      note: prev
        ? `The newer fact (month ${latest.month}) had little text behind it when training stopped, and the older one had more. The toy cannot tell which wins.${newer ? " A still-later change came after the cutoff." : ""}`
        : "Only a little text about this existed when training stopped.",
    };
  }
  return {
    status: (newer ? "stale" : "current") as Status,
    text: latest.value,
    note: newer
      ? "This was true as far as the training text goes. A later change happened after the cutoff, and the toy states the old fact with the same confidence."
      : "Matches today in this toy world. For anything important, still check against a source.",
  };
}

export function CutoffLab() {
  const [cutoff, setCutoff] = useState(14);
  const [q, setQ] = useState<QId>("fare");
  const [s, setS] = useState<SId>("alone");
  const [message, setMessage] = useState("");
  const uid = useId();
  const res = answer(q, s, cutoff);
  const qLabel = questions.find((x) => x.id === q)!.label;
  const announce = (nq: QId, ns: SId) => {
    const r = answer(nq, ns, cutoff);
    setMessage(`${tagText[r.status]}. Answer: ${r.text}`);
  };
  const lastBefore = events.filter((e) => e.month <= cutoff).length;
  const truth =
    q === "today"
      ? `Month ${TODAY}.`
      : versions(q as Key)[versions(q as Key).length - 1].value + ".";
  const reset = () => {
    setCutoff(14);
    setQ("fare");
    setS("alone");
    setMessage("Lab reset.");
  };
  const items: React.ReactNode[] = [];
  const marker = (
    <li key="marker" className={styles.marker} data-testid="cutoff-marker">
      Training cutoff: end of month {cutoff}. Anything below this line is not in
      the toy’s training text.
    </li>
  );
  if (lastBefore === 0) items.push(marker);
  events.forEach((e, i) => {
    const st = stateOf(e.month, cutoff);
    const cov = Math.round(coverage(e.month, cutoff) * 100);
    items.push(
      <li
        key={e.month}
        className={styles.event}
        data-state={st}
        data-testid="event-row"
      >
        <span className={styles.month}>Month {e.month}</span>
        <span>{e.text}</span>
        <span className={styles.state}>
          {st !== "absent" && (
            <span className={styles.bar} aria-hidden="true">
              <span style={{ width: `${cov}%` }} />
            </span>
          )}
          <span>
            {st === "absent"
              ? "Not in training"
              : st === "thin"
                ? `Thin coverage (${cov}% of the text had accumulated)`
                : `Well covered (${cov}% of the text had accumulated)`}
          </span>
        </span>
      </li>,
    );
    if (i + 1 === lastBefore) items.push(marker);
  });
  items.push(
    <li key="today" className={styles.today}>
      Today: month {TODAY}. The model is being used now.
    </li>,
  );
  return (
    <div className="lab">
      <div className="lab-head">
        <strong>01 / Move the cutoff, then ask a question</strong>
        <span className="pill">SIMULATION</span>
      </div>
      <div className="lab-body">
        <div className={styles.slider}>
          <label htmlFor={`${uid}-cut`}>
            <strong>Training cutoff:</strong> month {cutoff} of {TODAY}
          </label>
          <input
            id={`${uid}-cut`}
            type="range"
            min={3}
            max={21}
            step={1}
            value={cutoff}
            aria-valuetext={`Month ${cutoff}`}
            onChange={(e) => setCutoff(Number(e.target.value))}
          />
        </div>
        <div className={styles.grid}>
          <div>
            <h3 style={{ margin: "0 0 0.5rem" }}>
              A toy world: the Linden Line tram
            </h3>
            <ol className={styles.timeline}>{items}</ol>
          </div>
          <div className={styles.panel}>
            <fieldset>
              <legend>Ask</legend>
              {questions.map((x) => (
                <label className={styles.choice} key={x.id}>
                  <input
                    type="radio"
                    name={`${uid}-q`}
                    checked={q === x.id}
                    onChange={() => {
                      setQ(x.id);
                      announce(x.id, s);
                    }}
                  />
                  <span>{x.label}</span>
                </label>
              ))}
            </fieldset>
            <fieldset>
              <legend>What the request contains</legend>
              {sources.map((x) => (
                <label className={styles.choice} key={x.id}>
                  <input
                    type="radio"
                    name={`${uid}-s`}
                    checked={s === x.id}
                    onChange={() => {
                      setS(x.id);
                      announce(q, x.id);
                    }}
                  />
                  <span>{x.label}</span>
                </label>
              ))}
            </fieldset>
            <div
              className={styles.answer}
              data-status={res.status}
              data-testid="answer"
            >
              <strong className={`${styles.tag}`}>{tagText[res.status]}</strong>
              <div className="micro">{qLabel}</div>
              <p className={styles.answerText}>{res.text}</p>
              <p className="micro">{res.note}</p>
              <p className={styles.truth}>
                Fact today in this toy world: {truth}
              </p>
            </div>
            <p style={{ marginTop: "0.75rem" }}>
              <button type="button" onClick={reset}>
                Reset lab
              </button>
            </p>
            <div role="status" aria-live="polite" className="visually-hidden">
              {message}
            </div>
          </div>
        </div>
        <p className="micro lab-disclosure">
          Everything here is invented: the tram line, the months, the
          “three-month” window in which text about an event keeps accumulating,
          the 80 percent bar for “well covered”, and the way the toy picks an
          answer. They are a simplified rule, not measurements. Real models are
          not lookup tables and do not publish a per-event coverage score. What
          is real is the general pattern: training text stops at some date,
          writing about recent events is often still thin at that point, and
          newer facts can only arrive through the request or a tool.
        </p>
      </div>
    </div>
  );
}
