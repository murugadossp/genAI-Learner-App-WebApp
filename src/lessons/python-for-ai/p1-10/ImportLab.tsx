"use client";

import { useState } from "react";
import styles from "./lesson.module.css";

type ImportId = "none" | "plain" | "from" | "as";
type CallId = "json" | "loads" | "j";

const IMPORTS: { id: ImportId; label: string; code: string; name: string }[] = [
  { id: "none", label: "No import line", code: "", name: "" },
  { id: "plain", label: "import json", code: "import json", name: "json" },
  {
    id: "from",
    label: "from json import loads",
    code: "from json import loads",
    name: "loads",
  },
  { id: "as", label: "import json as j", code: "import json as j", name: "j" },
];

// `first` is the name Python has to find before it can run the call.
const CALLS: { id: CallId; code: string; first: string }[] = [
  { id: "json", code: "json.loads(reply)", first: "json" },
  { id: "loads", code: "loads(reply)", first: "loads" },
  { id: "j", code: "j.loads(reply)", first: "j" },
];

const REPLY_LINE = `reply = '{"topic": "refund", "urgent": true}'`;

export function ImportLab() {
  const [importId, setImportId] = useState<ImportId>("none");
  const [callId, setCallId] = useState<CallId>("json");
  const chosenImport = IMPORTS.find((i) => i.id === importId) ?? IMPORTS[0];
  const chosenCall = CALLS.find((c) => c.id === callId) ?? CALLS[0];
  const works = chosenImport.name === chosenCall.first;

  const program = [
    chosenImport.code || "# (no import line)",
    REPLY_LINE,
    `data = ${chosenCall.code}`,
    `print(data["topic"])`,
  ].join("\n");

  const created = chosenImport.name
    ? `The import line created the name ${chosenImport.name}.`
    : "There is no import line, so it created no name.";
  const message = works
    ? `${created} The call starts with ${chosenCall.first}, so Python finds it and runs loads. data is a dict, and data["topic"] is "refund".`
    : `${created} The call starts with ${chosenCall.first}, which was not created, so Python stops with a NameError.`;

  return (
    <div className={`lab card ${styles.labContainer}`}>
      <p className="micro">
        Toy simulator: it applies one rule, &quot;the call works only if its
        first name was created by the import line&quot;. It is not a live Python
        interpreter, and the reply text is invented.
      </p>

      <div
        className={styles.controlStack}
        role="group"
        aria-label="Import line"
      >
        <span className={styles.resultLabel}>1. Import line</span>
        <div className={styles.presetRow}>
          {IMPORTS.map((i) => (
            <button
              key={i.id}
              type="button"
              aria-pressed={importId === i.id}
              className={`${styles.presetBtn} ${importId === i.id ? styles.presetBtnActive : ""}`}
              onClick={() => setImportId(i.id)}
            >
              {i.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.resultRow}>
        <span className={styles.resultLabel}>
          Name created by the import line
        </span>
        <code data-testid="lab-name">{chosenImport.name || "none"}</code>
      </div>

      <div className={styles.controlStack} role="group" aria-label="Call">
        <span className={styles.resultLabel}>2. Call</span>
        <div className={styles.presetRow}>
          {CALLS.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={callId === c.id}
              className={`${styles.presetBtn} ${styles.codeBtn} ${callId === c.id ? styles.presetBtnActive : ""}`}
              onClick={() => setCallId(c.id)}
            >
              {c.code}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.labGrid}>
        <pre
          className={styles.codePanel}
          tabIndex={0}
          role="region"
          aria-label="Program built from your choices"
          data-testid="lab-program"
        >
          <code>{program}</code>
        </pre>
        <div
          className={`${styles.resultBox} ${works ? styles.resultOk : styles.resultError}`}
        >
          <div className={styles.resultRow}>
            <span className={styles.resultLabel}>
              {works ? "Output" : "Error"}
            </span>
            <code data-testid="lab-output">
              {works
                ? "refund"
                : `NameError: name '${chosenCall.first}' is not defined`}
            </code>
          </div>
          {works && (
            <div className={styles.resultRow}>
              <span className={styles.resultLabel}>data</span>
              <code data-testid="lab-data">
                {"{'topic': 'refund', 'urgent': True}"}
              </code>
            </div>
          )}
          <p
            className={styles.statusLine}
            role="status"
            aria-live="polite"
            data-testid="lab-message"
          >
            {message}
          </p>
        </div>
      </div>

      <div className={styles.controlRow}>
        <button
          type="button"
          onClick={() => {
            setImportId("none");
            setCallId("json");
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
