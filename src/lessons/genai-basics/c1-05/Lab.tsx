"use client";
import { useState } from "react";
import styles from "./lesson.module.css";

type Entry = { text: string; version: "v1" | "v2" };

export function Lab() {
  const [version, setVersion] = useState<"v1" | "v2">("v1");
  const [log, setLog] = useState<Entry[]>([]);
  const [announce, setAnnounce] = useState("");

  function add(text: string, v = version) {
    setLog((l) => [...l, { text, version: v }]);
    setAnnounce(text);
  }
  const tag = (email: string, hint: boolean) => {
    const result = version === "v2" || hint ? "billing" : "delivery";
    const hintText = hint ? ' with the hint "this is about money"' : "";
    const verdict =
      result === "billing"
        ? "billing (right)"
        : "delivery (wrong, it should be billing)";
    add(`${email}${hintText} → ${verdict}. Learned settings: ${version}.`);
  };
  const A = "Email 1";
  const B = "Email 2";
  return (
    <div className={styles.lab}>
      <p className="micro">
        This is an invented toy with scripted answers. It is not a real model.
      </p>
      <div className={styles.emails}>
        <p>
          <strong>Email 1:</strong> “My parcel charge is wrong.”
        </p>
        <p>
          <strong>Email 2:</strong> “The parcel charge on my card is wrong.”
          (from a different customer, sent later)
        </p>
      </div>
      <p className={styles.state} data-testid="settings">
        Learned settings: <strong>{version}</strong>
      </p>
      <ol className={styles.steps}>
        <li>
          <button onClick={() => tag(A, false)}>1. Tag email 1</button>
        </li>
        <li>
          <button onClick={() => tag(A, true)}>
            2. Tag email 1 with the hint
          </button>
        </li>
        <li>
          <button onClick={() => tag(B, false)}>
            3. Tag email 2 with no hint
          </button>
        </li>
        <li>
          <button
            disabled={version === "v2"}
            onClick={() => {
              setVersion("v2");
              add(
                "Training run: v2 was taught from extra labelled money emails. Learned settings: v2.",
                "v2",
              );
            }}
          >
            4. Train v2
          </button>
        </li>
      </ol>
      <p className="micro">
        Try them in this order, then repeat step 3. You can press any button at
        any time.
      </p>
      <button
        onClick={() => {
          setVersion("v1");
          setLog([]);
          setAnnounce("Reset. Learned settings: v1.");
        }}
      >
        Reset
      </button>
      <div role="status" aria-live="polite" className="visually-hidden">
        {announce}
      </div>
      <ol className={styles.log} aria-label="Log" data-testid="log">
        {log.map((e, i) => (
          <li key={i} data-testid="log-entry">
            {e.text}
          </li>
        ))}
      </ol>
    </div>
  );
}
