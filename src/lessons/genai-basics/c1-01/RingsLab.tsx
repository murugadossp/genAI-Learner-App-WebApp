"use client";
import { useId, useState } from "react";
import styles from "./lesson.module.css";

const tasks = [
  {
    id: "predict",
    label: "Predict",
    hint: "Guess a number, such as how many days until a parcel arrives.",
  },
  {
    id: "classify",
    label: "Classify",
    hint: "Put something in a group, such as spam or not spam.",
  },
  {
    id: "recommend",
    label: "Recommend",
    hint: "Pick what to show next, such as the next article to read.",
  },
  {
    id: "generate",
    label: "Generate",
    hint: "Write something new, such as a draft reply.",
  },
] as const;
type TaskId = (typeof tasks)[number]["id"];

const approaches = [
  {
    id: "rules",
    label: "Hand-written rules",
    hint: "A person writes every rule. Nothing is learned.",
    rings: 1,
  },
  {
    id: "learned",
    label: "A simple learned model",
    hint: "Learns from many examples, using clues a person picked, such as how many links a message has.",
    rings: 2,
  },
  {
    id: "deep",
    label: "A deep neural network",
    hint: "Also learns from examples, but finds its own clues in raw text or pixels. Built from many layers.",
    rings: 3,
  },
  {
    id: "generative",
    label: "A generative neural network",
    hint: "A deep network trained to write new text, or make images or audio.",
    rings: 4,
  },
] as const;
type ApproachId = (typeof approaches)[number]["id"];

const ringNames = [
  "Artificial intelligence",
  "Machine learning",
  "Deep learning",
  "Generative AI",
];

type Fit = "strong" | "workable" | "poor";
const fitText: Record<Fit, string> = {
  strong: "A natural fit",
  workable: "Workable, with caveats",
  poor: "A poor fit",
};

const cells: Record<ApproachId, Record<TaskId, { fit: Fit; text: string }>> = {
  rules: {
    predict: {
      fit: "workable",
      text: "A lookup table a person wrote: parcels from the same city arrive in 2 days, other cities in 5. It never changes until someone edits it.",
    },
    classify: {
      fit: "workable",
      text: "A rule: if the subject says “WINNER” and the message has three or more links, mark it spam. Spammers who avoid those words slip past.",
    },
    recommend: {
      fit: "workable",
      text: "A rule: show the newest saved article from a topic the reader starred. Predictable, but it has no sense of the reader’s taste.",
    },
    generate: {
      fit: "poor",
      text: "Pick a canned reply by keyword: if the message says “invoice”, send the invoice template. This fills in a template; it does not compose anything new.",
    },
  },
  learned: {
    predict: {
      fit: "strong",
      text: "A model fitted to past parcels learns how distance, weekday and carrier relate to delivery time, then outputs an estimate for a new parcel.",
    },
    classify: {
      fit: "strong",
      text: "A model fitted to thousands of labelled emails learns how much weight to give features a person chose, such as the number of links and certain words.",
    },
    recommend: {
      fit: "strong",
      text: "A model fitted to past reading notices that readers who finished article A often finished article B, and ranks B higher for the next reader of A.",
    },
    generate: {
      fit: "poor",
      text: "A small model that counts which word tends to follow which can string together short phrases, but the text is clumsy. Fluent drafts need the later rings.",
    },
  },
  deep: {
    predict: {
      fit: "strong",
      text: "A network with many layers takes the raw tracking-event history and learns its own features before outputting an estimate.",
    },
    classify: {
      fit: "strong",
      text: "A deep network reads the message text itself and learns its own features, such as phrasing and layout patterns, then outputs spam or not spam.",
    },
    recommend: {
      fit: "strong",
      text: "A deep network turns readers and articles into learned numeric descriptions and ranks the articles that best match a reader’s history.",
    },
    generate: {
      fit: "poor",
      text: "A deep network that only scores or labels cannot write a reply. Writing takes a model trained to produce text, which is the next ring.",
    },
  },
  generative: {
    predict: {
      fit: "workable",
      text: "Asked in words, a generative model will produce a plausible arrival estimate, but only from what the request tells it. A model fitted to parcel data is often more dependable for numbers.",
    },
    classify: {
      fit: "workable",
      text: "Asked “is this spam?”, a generative model answers in words. That can work for many messages, but answers can vary, so they need checking.",
    },
    recommend: {
      fit: "workable",
      text: "Given a described reading history, a generative model suggests articles in words. A ranking model fitted to real reading behaviour measures taste more directly.",
    },
    generate: {
      fit: "strong",
      text: "A generative model writes a new, fluent reply to this message in the tone you ask for. It is new text, not a stored template, and it can be wrong, so you read it before sending.",
    },
  },
};

export function RingsLab() {
  const [task, setTask] = useState<TaskId>("classify");
  const [approach, setApproach] = useState<ApproachId>("rules");
  const [message, setMessage] = useState("");
  const uid = useId();
  const t = tasks.find((x) => x.id === task)!;
  const a = approaches.find((x) => x.id === approach)!;
  const cell = cells[approach][task];
  const announce = (tk: TaskId, ap: ApproachId) => {
    const tl = tasks.find((x) => x.id === tk)!.label;
    const ar = approaches.find((x) => x.id === ap)!;
    setMessage(
      `${tl} with ${ar.label.toLowerCase()}. Innermost ring: ${ringNames[ar.rings - 1]}. ${cells[ap][tk].fit === "poor" ? "A poor fit." : ""}`,
    );
  };
  const reset = () => {
    setTask("classify");
    setApproach("rules");
    setMessage("Lab reset.");
  };
  const ring = (level: number): React.ReactNode => (
    <div
      className={styles.ring}
      data-member={level < a.rings}
      data-current={level === a.rings - 1}
      data-level={level}
      data-testid="ring"
    >
      <span className={styles.ringLabel}>{ringNames[level]}</span>
      {level < 3 ? ring(level + 1) : null}
    </div>
  );
  return (
    <div className="lab">
      <div className="lab-head">
        <strong>01 / Build one job four ways</strong>
        <span className="pill">ILLUSTRATIVE</span>
      </div>
      <div className="lab-body">
        <p className={styles.howto}>
          Make a choice in each step. The rings, the Inside/Outside list and the
          card below them update to show what that build looks like.
        </p>
        <div className={styles.grid}>
          <div className={styles.panel}>
            <fieldset>
              <legend>Step 1. What does Postbox need to do?</legend>
              {tasks.map((x) => (
                <label className={styles.choice} key={x.id}>
                  <input
                    type="radio"
                    name={`${uid}-task`}
                    checked={task === x.id}
                    onChange={() => {
                      setTask(x.id);
                      announce(x.id, approach);
                    }}
                  />
                  <span className={styles.choiceText}>
                    <strong>{x.label}</strong>
                    <small>{x.hint}</small>
                  </span>
                </label>
              ))}
            </fieldset>
            <fieldset>
              <legend>Step 2. How is it built?</legend>
              {approaches.map((x) => (
                <label className={styles.choice} key={x.id}>
                  <input
                    type="radio"
                    name={`${uid}-approach`}
                    checked={approach === x.id}
                    onChange={() => {
                      setApproach(x.id);
                      announce(task, x.id);
                    }}
                  />
                  <span className={styles.choiceText}>
                    <strong>{x.label}</strong>
                    <small>{x.hint}</small>
                  </span>
                </label>
              ))}
            </fieldset>
            <button type="button" onClick={reset}>
              Reset lab
            </button>
          </div>
          <div className={styles.rings}>
            <div aria-hidden="true" data-testid="rings">
              {ring(0)}
            </div>
            <ul
              className={styles.membership}
              aria-label="Rings this build belongs to"
            >
              {ringNames.map((name, i) => (
                <li key={name} data-in={i < a.rings} data-testid="membership">
                  <span className={styles.mark}>
                    {i < a.rings ? "Inside" : "Outside"}
                  </span>
                  <span>{name}</span>
                </li>
              ))}
            </ul>
            <div className={styles.result} data-testid="result">
              <h3>
                {t.label} with {a.label.toLowerCase()}
              </h3>
              <span className={styles.fit} data-fit={cell.fit}>
                {fitText[cell.fit]}
              </span>
              <p>{cell.text}</p>
              <p className="micro">
                Innermost ring reached:{" "}
                <strong>{ringNames[a.rings - 1]}</strong>. Every ring around it
                counts too.
              </p>
            </div>
            <div role="status" aria-live="polite" className="visually-hidden">
              {message}
            </div>
          </div>
        </div>
        <p className="micro lab-disclosure">
          Postbox is an invented mail app, and every example above is a sketch
          of how that kind of approach works, not a description of a real
          product. The “fit” labels are a rough judgement for this one app, not
          benchmark results; the right choice for a real system depends on its
          data, its risks and its cost. What is real is the nesting: a build in
          an inner ring also belongs to every ring around it.
        </p>
      </div>
    </div>
  );
}
