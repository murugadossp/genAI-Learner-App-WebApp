"use client";

import { useState } from "react";
import styles from "./lesson.module.css";

type Entry = [string, string];
const START: Entry[] = [
  ["id", "T-204"],
  ["topic", "billing"],
  ["priority", "high"],
];
const KEYS = ["topic", "priority", "assignee"] as const;
type Mode = "brackets" | "get" | "getDefault";
const MODES: { id: Mode; label: string }[] = [
  { id: "brackets", label: "ticket[key]" },
  { id: "get", label: "ticket.get(key)" },
  { id: "getDefault", label: "ticket.get(key, 'unassigned')" },
];
const WRITES: { key: string; value: string; label: string }[] = [
  { key: "priority", value: "low", label: "ticket['priority'] = 'low'" },
  { key: "assignee", value: "Sam", label: "ticket['assignee'] = 'Sam'" },
  { key: "priorty", value: "low", label: "ticket['priorty'] = 'low'" },
];

export function DictLab() {
  const [entries, setEntries] = useState<Entry[]>(START);
  const [key, setKey] = useState<string>("topic");
  const [mode, setMode] = useState<Mode>("brackets");
  const [note, setNote] = useState("Ticket starts with 3 base pairs.");
  const [nestedQuery, setNestedQuery] = useState<"correct" | "wrong">(
    "correct",
  );

  const found = entries.find(([k]) => k === key);
  const call =
    mode === "brackets"
      ? `ticket['${key}']`
      : mode === "get"
        ? `ticket.get('${key}')`
        : `ticket.get('${key}', 'unassigned')`;

  let result: string;
  let kind: "value" | "error" | "none" | "default";
  if (found) {
    result = `'${found[1]}'`;
    kind = "value";
  } else if (mode === "brackets") {
    result = `KeyError: '${key}'`;
    kind = "error";
  } else if (mode === "get") {
    result = "None";
    kind = "none";
  } else {
    result = "'unassigned'";
    kind = "default";
  }

  function write(k: string, v: string, label: string) {
    const exists = entries.some(([e]) => e === k);
    setEntries(
      exists
        ? entries.map(([e, val]) => (e === k ? [e, v] : [e, val]))
        : [...entries, [k, v]],
    );
    setNote(
      exists
        ? `${label} updated the value under the existing key '${k}' in place. The length stayed ${entries.length}.`
        : `${label} inserted a new pair because '${k}' was not yet a key. The length grew to ${entries.length + 1}.`,
    );
  }

  return (
    <div className={`lab card ${styles.labContainer}`}>
      <p className="micro">
        Toy sandbox: invented ticket values and a small rule simulator, not a
        live Python interpreter.
      </p>
      <div className={styles.labGrid}>
        {/* Panel 1: Reading */}
        <div className={styles.inspectorCard}>
          <h3 className={styles.labTitle}>1. Read from the ticket</h3>
          <div
            className={styles.controlStack}
            role="group"
            aria-label="Key to look up"
          >
            <span className={styles.resultLabel}>Key to look up</span>
            <div className={styles.presetRow}>
              {KEYS.map((k) => (
                <button
                  key={k}
                  type="button"
                  aria-pressed={key === k}
                  className={`${styles.presetBtn} ${key === k ? styles.presetBtnActive : ""}`}
                  onClick={() => setKey(k)}
                >
                  &apos;{k}&apos;
                </button>
              ))}
            </div>
          </div>
          <div
            className={styles.controlStack}
            role="group"
            aria-label="How to look up"
          >
            <span className={styles.resultLabel}>How to look up</span>
            <div className={styles.presetRow}>
              {MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  aria-pressed={mode === m.id}
                  className={`${styles.presetBtn} ${mode === m.id ? styles.presetBtnActive : ""}`}
                  onClick={() => setMode(m.id)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.resultBox} role="status" aria-live="polite">
            <div className={styles.resultRow}>
              <span className={styles.resultLabel}>Python runs</span>
              <code>{call}</code>
            </div>
            <div className={styles.resultRow}>
              <span className={styles.resultLabel}>Result</span>
              <code data-testid="read-result">{result}</code>
            </div>
            {kind === "error" && (
              <div className={styles.errorNote}>
                Square brackets halt with a KeyError when the requested key is
                missing.
              </div>
            )}
            {kind === "none" && (
              <div className={styles.infoNote}>
                .get() with no default returns None (Python&apos;s &quot;no
                value here&quot; object) without error.
              </div>
            )}
            {kind === "default" && (
              <div className={styles.infoNote} data-testid="default-note">
                Key missing. .get() returned the fallback default. Nothing was
                stored or modified in the ticket.
              </div>
            )}
            {kind === "value" && (
              <div className={styles.successNote}>
                Found stored value for key &apos;{key}&apos;.
              </div>
            )}
          </div>
        </div>

        {/* Panel 2: Modifying (shared state) */}
        <div className={styles.inspectorCard}>
          <h3 className={styles.labTitle}>2. Change the ticket</h3>
          <div className={styles.controlStack}>
            {WRITES.map((w) => (
              <button
                key={w.label}
                type="button"
                className={styles.secondaryActionBtn}
                onClick={() => write(w.key, w.value, w.label)}
              >
                {w.label}
              </button>
            ))}
            <button
              type="button"
              className={styles.resetBtn}
              onClick={() => {
                setEntries(START);
                setNote("Ticket reset to its 3 starting pairs.");
              }}
            >
              Reset ticket
            </button>
          </div>
          <div className={styles.resultBox}>
            <span className={styles.resultLabel}>
              ticket currently has{" "}
              <strong data-testid="ticket-len">{entries.length}</strong> pairs:
            </span>
            <pre
              className={styles.dictPre}
              tabIndex={0}
              role="region"
              aria-label="Current ticket data"
            >
              {"{\n" +
                entries.map(([k, v]) => `  '${k}': '${v}'`).join(",\n") +
                "\n}"}
            </pre>
          </div>
          <div className={styles.infoNote}>{note}</div>
        </div>
      </div>

      {/* Panel 3: Nested Inspector */}
      <div className={styles.nestedInspector}>
        <h3 className={styles.labTitle}>3. Nested Ticket Reference</h3>
        <p className="micro">
          Inspect how Python navigates inner dictionaries step-by-step:
        </p>
        <pre
          className={styles.codePanelSmall}
          tabIndex={0}
          role="region"
          aria-label="Nested ticket structure"
        >
          {`nested_ticket = {"id": "T-204", "topic": "billing", "customer": {"name": "Ana", "plan": "pro"}}`}
        </pre>
        <div
          className={styles.presetRow}
          role="group"
          aria-label="Nested query"
        >
          <button
            type="button"
            aria-pressed={nestedQuery === "correct"}
            className={`${styles.presetBtn} ${nestedQuery === "correct" ? styles.presetBtnActive : ""}`}
            onClick={() => setNestedQuery("correct")}
          >
            nested_ticket[&apos;customer&apos;][&apos;plan&apos;]
          </button>
          <button
            type="button"
            aria-pressed={nestedQuery === "wrong"}
            className={`${styles.presetBtn} ${nestedQuery === "wrong" ? styles.presetBtnActive : ""}`}
            onClick={() => setNestedQuery("wrong")}
          >
            nested_ticket[&apos;plan&apos;]
          </button>
        </div>
        <div className={styles.resultBox} role="status" aria-live="polite">
          <div className={styles.resultRow}>
            <span className={styles.resultLabel}>Result</span>
            <code data-testid="nested-result">
              {nestedQuery === "correct" ? "'pro'" : "KeyError: 'plan'"}
            </code>
          </div>
          <div
            className={
              nestedQuery === "correct" ? styles.successNote : styles.errorNote
            }
          >
            {nestedQuery === "correct"
              ? "Step 1 reads the inner dict {'name': 'Ana', 'plan': 'pro'}, and step 2 reads 'pro' from it."
              : "'plan' is inside the inner customer dictionary, not a top-level key of nested_ticket."}
          </div>
        </div>
      </div>
    </div>
  );
}
