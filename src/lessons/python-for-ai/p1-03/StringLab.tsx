"use client";

import { useState } from "react";
import styles from "./lesson.module.css";

interface Preset {
  id: string;
  name: string;
  raw: string;
  user: string;
  replaceOld: string;
  replaceNew: string;
}

const PRESETS: Preset[] = [
  {
    id: "support",
    name: "Customer Support",
    raw: "   RefunD for Order #881   ",
    user: "Alex",
    replaceOld: "#",
    replaceNew: "no. ",
  },
  {
    id: "doc",
    name: "Doc Summarization",
    raw: "   Summary: AI hallucination warning!   ",
    user: "DocBot",
    replaceOld: "!",
    replaceNew: ".",
  },
  {
    id: "tokens",
    name: "Token Log",
    raw: "  Tokens Used: 1202  ",
    user: "Analyst",
    replaceOld: "tokens used: ",
    replaceNew: "count=",
  },
];

export function StringLab() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>("support");
  const [rawText, setRawText] = useState<string>(PRESETS[0].raw);
  const [userName, setUserName] = useState<string>(PRESETS[0].user);
  const [replaceOld, setReplaceOld] = useState<string>(PRESETS[0].replaceOld);
  const [replaceNew, setReplaceNew] = useState<string>(PRESETS[0].replaceNew);

  const [applyStrip, setApplyStrip] = useState<boolean>(true);
  const [applyLower, setApplyLower] = useState<boolean>(true);
  const [applyReplace, setApplyReplace] = useState<boolean>(true);
  const [applySplit, setApplySplit] = useState<boolean>(false);
  const [hasFPrefix, setHasFPrefix] = useState<boolean>(true);

  const handleSelectPreset = (p: Preset) => {
    setSelectedPresetId(p.id);
    setRawText(p.raw);
    setUserName(p.user);
    setReplaceOld(p.replaceOld);
    setReplaceNew(p.replaceNew);
    setApplyStrip(true);
    setApplyLower(true);
    setApplyReplace(true);
    setApplySplit(false);
    setHasFPrefix(true);
  };

  const handleReset = () => {
    handleSelectPreset(PRESETS[0]);
  };

  // Compute transformation pipeline
  let cleanText = rawText;
  if (applyStrip) {
    cleanText = cleanText.trim();
  }
  if (applyLower) {
    cleanText = cleanText.toLowerCase();
  }
  if (applyReplace && replaceOld.length > 0) {
    cleanText = cleanText.split(replaceOld).join(replaceNew);
  }

  const words =
    cleanText.trim().length > 0 ? cleanText.trim().split(/\s+/) : [];

  // Prompt formatting
  const promptOutput = hasFPrefix
    ? `User: ${userName}\nQuery: ${cleanText}`
    : `User: {user_id}\nQuery: {clean_query}`;

  const promptLength = promptOutput.length;

  return (
    <div
      className={styles.labCard}
      aria-label="Interactive AI String Processing Sandbox"
    >
      <div className={styles.labHeader}>
        <h3 className={styles.labTitle}>AI Prompt &amp; String Sandbox</h3>
        <button type="button" className={styles.resetBtn} onClick={handleReset}>
          Reset sandbox
        </button>
      </div>

      <p
        className="micro"
        style={{ color: "var(--muted)", margin: "0 0 1rem 0" }}
      >
        Test how Python quotes, whitespace stripping, case normalization, and
        f-string prompt templating prepare unstructured user input for AI
        models.
      </p>

      {/* Preset selection */}
      <div className={styles.presetGroup}>
        <span className={styles.presetLabel}>Presets:</span>
        {PRESETS.map((p) => {
          const isActive = selectedPresetId === p.id;
          return (
            <button
              key={p.id}
              type="button"
              className={`${styles.presetBtn} ${
                isActive ? styles.presetBtnActive : ""
              }`}
              onClick={() => handleSelectPreset(p)}
              aria-pressed={isActive}
            >
              {p.name}
            </button>
          );
        })}
      </div>

      {/* Controls Grid */}
      <div className={styles.controlsGrid}>
        <div className={styles.controlField}>
          <label htmlFor="rawInput" className={styles.controlLabel}>
            Raw Webhook Text (<code>raw_query</code>):
          </label>
          <input
            id="rawInput"
            type="text"
            className={styles.textInput}
            value={rawText}
            onChange={(e) => {
              setRawText(e.target.value);
              setSelectedPresetId("");
            }}
          />
        </div>

        <div className={styles.controlField}>
          <label htmlFor="userInput" className={styles.controlLabel}>
            User Name Variable (<code>user_id</code>):
          </label>
          <input
            id="userInput"
            type="text"
            className={styles.textInput}
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
              setSelectedPresetId("");
            }}
          />
        </div>

        <div className={styles.controlField}>
          <label htmlFor="replaceOldInput" className={styles.controlLabel}>
            Replace Target (<code>old</code>):
          </label>
          <input
            id="replaceOldInput"
            type="text"
            className={styles.textInput}
            value={replaceOld}
            onChange={(e) => {
              setReplaceOld(e.target.value);
              setSelectedPresetId("");
            }}
          />
        </div>

        <div className={styles.controlField}>
          <label htmlFor="replaceNewInput" className={styles.controlLabel}>
            Replace Replacement (<code>new</code>):
          </label>
          <input
            id="replaceNewInput"
            type="text"
            className={styles.textInput}
            value={replaceNew}
            onChange={(e) => {
              setReplaceNew(e.target.value);
              setSelectedPresetId("");
            }}
          />
        </div>
      </div>

      {/* Pipeline Method Toggles */}
      <div className={styles.togglesRow}>
        <label className={styles.toggleLabel}>
          <input
            type="checkbox"
            className={styles.toggleCheckbox}
            checked={applyStrip}
            onChange={(e) => setApplyStrip(e.target.checked)}
          />
          Apply <code>.strip()</code> (Outer whitespace)
        </label>

        <label className={styles.toggleLabel}>
          <input
            type="checkbox"
            className={styles.toggleCheckbox}
            checked={applyLower}
            onChange={(e) => setApplyLower(e.target.checked)}
          />
          Apply <code>.lower()</code> (Case normalization)
        </label>

        <label className={styles.toggleLabel}>
          <input
            type="checkbox"
            className={styles.toggleCheckbox}
            checked={applyReplace}
            onChange={(e) => setApplyReplace(e.target.checked)}
          />
          Apply <code>.replace()</code>
        </label>

        <label className={styles.toggleLabel}>
          <input
            type="checkbox"
            className={styles.toggleCheckbox}
            checked={applySplit}
            onChange={(e) => setApplySplit(e.target.checked)}
          />
          Preview <code>.split()</code> (Words)
        </label>

        <label className={styles.toggleLabel}>
          <input
            type="checkbox"
            className={styles.toggleCheckbox}
            checked={hasFPrefix}
            onChange={(e) => setHasFPrefix(e.target.checked)}
          />
          Include <code>f</code> prefix (<code>f&quot;...&quot;</code>)
        </label>
      </div>

      {/* Immutability Inspector */}
      <div className={styles.immutabilityBanner}>
        <div className={styles.immutabilityHeader}>
          <span
            style={{
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "var(--ink)",
            }}
          >
            Immutability Inspector: Separate Memory Objects
          </span>
          <span className={styles.immutabilityStatus}>
            ✓ raw_query UNCHANGED in memory
          </span>
        </div>

        <div className={styles.memorySlots}>
          <div className={styles.memorySlot}>
            <div className={styles.slotTag}>Name tag: raw_query</div>
            <div className={styles.slotVal}>&quot;{rawText}&quot;</div>
            <div
              className="micro"
              style={{ color: "var(--muted)", marginTop: "0.25rem" }}
            >
              Original object in memory: never modified.
            </div>
          </div>

          <div className={styles.memorySlot}>
            <div className={styles.slotTag}>Name tag: clean_query</div>
            <div className={styles.slotVal}>&quot;{cleanText}&quot;</div>
            <div
              className="micro"
              style={{ color: "var(--muted)", marginTop: "0.25rem" }}
            >
              Brand new string created by method chaining.
            </div>
          </div>
        </div>
      </div>

      {/* Word / Token segmentation display */}
      {applySplit && (
        <div style={{ marginBottom: "1.25rem" }}>
          <div
            style={{
              fontSize: "0.82rem",
              fontWeight: 600,
              color: "var(--ink)",
              marginBottom: "0.35rem",
            }}
          >
            <code>.split()</code> Tokenized Word List ({words.length} items):
          </div>
          <div className={styles.tokenPillsRow}>
            {words.map((w, idx) => (
              <span key={`${w}-${idx}`} className={styles.tokenPill}>
                [{idx}] &quot;{w}&quot;
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Rendered Prompt Output */}
      <div className={styles.outputContainer}>
        <div className={styles.outputHeader}>
          <span className={styles.outputTitle}>
            Rendered Prompt to LLM API (
            <code>{hasFPrefix ? 'f"..."' : '"..."'}</code>)
          </span>
          <span className={styles.charMetric}>
            len(prompt) = {promptLength} chars
          </span>
        </div>

        <pre className={styles.outputBox}>{promptOutput}</pre>

        {!hasFPrefix && (
          <div
            style={{
              marginTop: "0.65rem",
              padding: "0.5rem 0.75rem",
              background: "rgba(220, 38, 38, 0.1)",
              border: "1px solid rgba(220, 38, 38, 0.3)",
              borderRadius: "var(--radius-sm, 4px)",
              fontSize: "0.82rem",
              color: "var(--ink)",
            }}
          >
            <strong>Warning: Missing &apos;f&apos; prefix!</strong> Notice that
            Python rendered literal curly braces{" "}
            <code>&#123;user_id&#125;</code> and{" "}
            <code>&#123;clean_query&#125;</code>. The AI model receives the
            literal placeholder names rather than the actual user data.
          </div>
        )}
      </div>

      <div style={{ marginTop: "1rem" }}>
        <h4
          style={{
            fontSize: "0.85rem",
            margin: "0 0 0.35rem 0",
            color: "var(--ink)",
          }}
        >
          Try it in this order:
        </h4>
        <ol className={styles.tryList}>
          <li>
            Observe how unchecking <code>.strip()</code> leaves dirty leading
            and trailing spaces in the prompt.
          </li>
          <li>
            Inspect the <strong>Immutability Inspector</strong> to verify that{" "}
            <code>raw_query</code> remains completely unchanged regardless of
            what methods run.
          </li>
          <li>
            Toggle off the <strong>Include &apos;f&apos; prefix</strong>{" "}
            checkbox to observe the infamous missing &apos;f&apos; bug where
            braces leak into the API call.
          </li>
          <li>
            Turn on <strong>Preview .split()</strong> to see how Python slices
            the string into discrete word items.
          </li>
        </ol>
      </div>
    </div>
  );
}
