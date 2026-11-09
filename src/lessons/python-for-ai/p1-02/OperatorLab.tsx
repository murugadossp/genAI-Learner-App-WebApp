"use client";

import { useState } from "react";
import styles from "./lesson.module.css";

type LabMode = "chunks" | "powers" | "comparisons" | "logic";
type PresetKey = "standard" | "short" | "large";

interface PresetData {
  key: PresetKey;
  label: string;
  totalTokens: number;
  chunkSize: number;
  contextLimit: number;
}

const PRESETS: Record<PresetKey, PresetData> = {
  standard: {
    key: "standard",
    label: "Standard Document (1350 tokens)",
    totalTokens: 1350,
    chunkSize: 500,
    contextLimit: 1024,
  },
  short: {
    key: "short",
    label: "Short Prompt (450 tokens)",
    totalTokens: 450,
    chunkSize: 500,
    contextLimit: 1024,
  },
  large: {
    key: "large",
    label: "Large Article (2048 tokens)",
    totalTokens: 2048,
    chunkSize: 500,
    contextLimit: 2048,
  },
};

export function OperatorLab() {
  const [activePreset, setActivePreset] = useState<PresetKey>("standard");
  const [totalTokens, setTotalTokens] = useState<number>(1350);
  const [chunkSize, setChunkSize] = useState<number>(500);
  const [contextLimit, setContextLimit] = useState<number>(1024);
  const [activeMode, setActiveMode] = useState<LabMode>("chunks");
  const [powerExponent, setPowerExponent] = useState<number>(10);
  const [useFloatTotal, setUseFloatTotal] = useState<boolean>(false);

  // Apply a preset
  const selectPreset = (key: PresetKey) => {
    const p = PRESETS[key];
    setActivePreset(key);
    setTotalTokens(p.totalTokens);
    setChunkSize(p.chunkSize);
    setContextLimit(p.contextLimit);
    setUseFloatTotal(false);
  };

  // Reset to initial state
  const resetLab = () => {
    selectPreset("standard");
    setActiveMode("chunks");
    setPowerExponent(10);
    setUseFloatTotal(false);
  };

  // Stepper handlers
  const adjustTokens = (delta: number) => {
    setTotalTokens((prev) => Math.max(100, Math.min(8000, prev + delta)));
  };

  // Calculated values
  const effectiveTotal = useFloatTotal
    ? parseFloat(totalTokens.toFixed(1))
    : totalTokens;
  const trueDiv = effectiveTotal / chunkSize;
  const floorDiv = Math.floor(effectiveTotal / chunkSize);
  const remainder = effectiveTotal % chunkSize;

  // Formatted display strings for accurate Python representation
  const displayTotal = useFloatTotal ? `${totalTokens}.0` : `${totalTokens}`;
  const displayQuotient = useFloatTotal ? `${floorDiv}.0` : `${floorDiv}`;
  const displayRemainder = useFloatTotal ? `${remainder}.0` : `${remainder}`;

  // Power values
  const powerResult = 2 ** powerExponent;
  // Bitwise XOR in JS and Python: 2 ^ powerExponent
  const xorResult = 2 ^ powerExponent;

  // Comparisons
  const fitsContext = effectiveTotal <= contextLimit;
  const hasRemainder = remainder > 0;
  const isExactChunk = chunkSize === 500;

  // Logic guards
  const condFits = effectiveTotal <= contextLimit;
  const condPositive = effectiveTotal > 0;
  const guardSinglePrompt = condFits && condPositive;

  const condExceeds = effectiveTotal > contextLimit;
  const condNonPositive = effectiveTotal <= 0;
  const guardNeedsWarning = condExceeds || condNonPositive;

  const guardSafeToSend = !condExceeds;

  return (
    <div
      className={styles.lab}
      role="region"
      aria-labelledby="operator-lab-title"
    >
      <div className={styles.labHeader}>
        <h3 id="operator-lab-title" className={styles.labTitle}>
          AI Pipeline Operator Sandbox
        </h3>
        <span className={styles.badge}>Interactive Lab</span>
      </div>

      <div className={styles.controlGroup}>
        <span className={styles.controlLabel}>Presets</span>
        <div
          className={styles.buttonRow}
          role="group"
          aria-label="Preset scenarios"
        >
          {(Object.keys(PRESETS) as PresetKey[]).map((key) => {
            const p = PRESETS[key];
            const isSelected = activePreset === key;
            return (
              <button
                key={key}
                type="button"
                className={`${styles.presetBtn} ${isSelected ? styles.presetBtnActive : ""}`}
                aria-pressed={isSelected}
                onClick={() => selectPreset(key)}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.controlGroup}>
        <span className={styles.controlLabel}>Adjust Pipeline Parameters</span>
        <div className={styles.stepperContainer}>
          <div className={styles.stepperDisplay}>
            Total: {useFloatTotal ? `${totalTokens}.0` : totalTokens} tokens
          </div>
          <button
            type="button"
            className={styles.stepperBtn}
            onClick={() => adjustTokens(-100)}
            aria-label="Decrease total tokens by 100"
          >
            - 100
          </button>
          <button
            type="button"
            className={styles.stepperBtn}
            onClick={() => adjustTokens(100)}
            aria-label="Increase total tokens by 100"
          >
            + 100
          </button>
          <button
            type="button"
            className={`${styles.choiceBtn} ${useFloatTotal ? styles.choiceBtnActive : ""}`}
            aria-pressed={useFloatTotal}
            onClick={() => setUseFloatTotal(!useFloatTotal)}
            aria-label="Toggle float total tokens"
          >
            {useFloatTotal ? "Type: float (1350.0)" : "Type: int (1350)"}
          </button>
        </div>
      </div>

      <div className={styles.controlGroup}>
        <span className={styles.controlLabel}>Operator Category</span>
        <div
          className={styles.buttonRow}
          role="tablist"
          aria-label="Operator categories"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeMode === "chunks"}
            aria-controls="panel-chunks"
            id="tab-chunks"
            className={`${styles.modeBtn} ${activeMode === "chunks" ? styles.modeBtnActive : ""}`}
            onClick={() => setActiveMode("chunks")}
          >
            Division & Chunks (/, //, %)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeMode === "powers"}
            aria-controls="panel-powers"
            id="tab-powers"
            className={`${styles.modeBtn} ${activeMode === "powers" ? styles.modeBtnActive : ""}`}
            onClick={() => setActiveMode("powers")}
          >
            Powers vs XOR (** vs ^)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeMode === "comparisons"}
            aria-controls="panel-comparisons"
            id="tab-comparisons"
            className={`${styles.modeBtn} ${activeMode === "comparisons" ? styles.modeBtnActive : ""}`}
            onClick={() => setActiveMode("comparisons")}
          >
            Thresholds & Equality (== vs =)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeMode === "logic"}
            aria-controls="panel-logic"
            id="tab-logic"
            className={`${styles.modeBtn} ${activeMode === "logic" ? styles.modeBtnActive : ""}`}
            onClick={() => setActiveMode("logic")}
          >
            Boolean Guards (and, or, not)
          </button>
        </div>
      </div>

      {/* Mode 1: Chunks */}
      {activeMode === "chunks" && (
        <div
          id="panel-chunks"
          role="tabpanel"
          aria-labelledby="tab-chunks"
          className={styles.controlGroup}
        >
          <div className={styles.cardsGrid}>
            <div className={styles.calcCard}>
              <div className={styles.calcHeader}>
                <span className={styles.calcOpName}>/ True division</span>
                <span className={styles.calcType}>float</span>
              </div>
              <code className={styles.calcExpr}>
                {displayTotal} / {chunkSize} ={" "}
                {Number.isInteger(trueDiv)
                  ? `${trueDiv}.0`
                  : trueDiv.toFixed(2)}
              </code>
              <p className={styles.calcMeaning}>
                Always returns a float, even if the division is perfectly exact.
              </p>
            </div>

            <div className={styles.calcCard}>
              <div className={styles.calcHeader}>
                <span className={styles.calcOpName}>// Floor division</span>
                <span className={styles.calcType}>
                  {useFloatTotal ? "float" : "int"}
                </span>
              </div>
              <code className={styles.calcExpr}>
                {displayTotal} // {chunkSize} = {displayQuotient}
              </code>
              <p className={styles.calcMeaning}>
                Counts completed chunks.{" "}
                {useFloatTotal
                  ? "Because total is float, result is float 2.0."
                  : "Both operands are int, so result is int 2."}
              </p>
            </div>

            <div className={styles.calcCard}>
              <div className={styles.calcHeader}>
                <span className={styles.calcOpName}>% Modulo</span>
                <span className={styles.calcType}>
                  {useFloatTotal ? "float" : "int"}
                </span>
              </div>
              <code className={styles.calcExpr}>
                {displayTotal} % {chunkSize} = {displayRemainder}
              </code>
              <p className={styles.calcMeaning}>
                Leftover tokens remaining in the partial final chunk.
              </p>
            </div>
          </div>

          <div
            className={`${styles.resultBox} ${styles.resultBoxNotice}`}
            aria-live="polite"
          >
            <span className={styles.resultCode}>
              chunks = {displayTotal} // {chunkSize} # {displayQuotient}
              <br />
              remainder = {displayTotal} % {chunkSize} # {displayRemainder}
            </span>
            <p className={styles.resultDesc}>
              Reconstruction identity:{" "}
              <code>
                ({displayQuotient} * {chunkSize}) + {displayRemainder} =={" "}
                {displayTotal}
              </code>{" "}
              evaluates to <strong>True</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Mode 2: Powers */}
      {activeMode === "powers" && (
        <div
          id="panel-powers"
          role="tabpanel"
          aria-labelledby="tab-powers"
          className={styles.controlGroup}
        >
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>
              Select Exponent (Power of 2 for context & dimensions)
            </span>
            <div
              className={styles.buttonRow}
              role="group"
              aria-label="Exponent values"
            >
              {[8, 9, 10, 11, 12].map((exp) => (
                <button
                  key={exp}
                  type="button"
                  className={`${styles.choiceBtn} ${powerExponent === exp ? styles.choiceBtnActive : ""}`}
                  aria-pressed={powerExponent === exp}
                  onClick={() => setPowerExponent(exp)}
                >
                  2 ** {exp} ({2 ** exp})
                </button>
              ))}
            </div>
          </div>

          <div className={styles.cardsGrid}>
            <div className={styles.calcCard}>
              <div className={styles.calcHeader}>
                <span className={styles.calcOpName}>** Exponentiation</span>
                <span className={styles.calcType}>int</span>
              </div>
              <code className={styles.calcExpr}>
                2 ** {powerExponent} = {powerResult}
              </code>
              <p className={styles.calcMeaning}>
                In Python, <code>**</code> raises the base to the power.
                Standard for context window sizes and embedding dimensions.
              </p>
            </div>

            <div className={styles.calcCard}>
              <div className={styles.calcHeader}>
                <span className={styles.calcOpName}>^ Bitwise XOR</span>
                <span className={styles.calcType}>int (not a power!)</span>
              </div>
              <code className={styles.calcExpr}>
                2 ^ {powerExponent} = {xorResult}
              </code>
              <p className={styles.calcMeaning}>
                The caret <code>^</code> does NOT compute powers! In Python, it
                is bitwise XOR.
              </p>
            </div>
          </div>

          <div
            className={`${styles.resultBox} ${styles.resultBoxWarn}`}
            aria-live="polite"
          >
            <span className={styles.resultCode}>
              # Common AI developer bug:
              <br />
              limit = 2 ^ {powerExponent} # Evaluates to {xorResult}, NOT{" "}
              {powerResult}!
              <br />
              limit = 2 ** {powerExponent} # Correct: {powerResult}
            </span>
            <p className={styles.resultDesc}>
              Always use <code>**</code> for powers. In math notation people
              write ^, but in Python ^ will silently corrupt your calculations.
            </p>
          </div>
        </div>
      )}

      {/* Mode 3: Comparisons */}
      {activeMode === "comparisons" && (
        <div
          id="panel-comparisons"
          role="tabpanel"
          aria-labelledby="tab-comparisons"
          className={styles.controlGroup}
        >
          <div className={styles.cardsGrid}>
            <div className={styles.calcCard}>
              <div className={styles.calcHeader}>
                <span className={styles.calcOpName}>&lt;= (Less or equal)</span>
                <span className={styles.calcType}>bool</span>
              </div>
              <code className={styles.calcExpr}>
                {displayTotal} &lt;= {contextLimit} ={" "}
                {fitsContext ? "True" : "False"}
              </code>
              <p className={styles.calcMeaning}>
                Checks whether total tokens fit inside the model context window.
              </p>
            </div>

            <div className={styles.calcCard}>
              <div className={styles.calcHeader}>
                <span className={styles.calcOpName}>&gt; (Greater than)</span>
                <span className={styles.calcType}>bool</span>
              </div>
              <code className={styles.calcExpr}>
                {displayRemainder} &gt; 0 = {hasRemainder ? "True" : "False"}
              </code>
              <p className={styles.calcMeaning}>
                Checks whether any leftover tokens remain after full chunking.
              </p>
            </div>

            <div className={styles.calcCard}>
              <div className={styles.calcHeader}>
                <span className={styles.calcOpName}>== (Equality check)</span>
                <span className={styles.calcType}>bool</span>
              </div>
              <code className={styles.calcExpr}>
                {chunkSize} == 500 = {isExactChunk ? "True" : "False"}
              </code>
              <p className={styles.calcMeaning}>
                Compares values. Single = would reassign; == checks for
                equality.
              </p>
            </div>
          </div>

          <div
            className={`${styles.resultBox} ${styles.resultBoxNotice}`}
            aria-live="polite"
          >
            <span className={styles.resultCode}>
              fits_context = total_tokens &lt;= context_limit # Result:{" "}
              {fitsContext ? "True" : "False"} (&lt;class &apos;bool&apos;&gt;)
            </span>
            <p className={styles.resultDesc}>
              Comparison operators always evaluate to a <code>bool</code> (
              <code>True</code> or <code>False</code>).
            </p>
          </div>
        </div>
      )}

      {/* Mode 4: Boolean Logic */}
      {activeMode === "logic" && (
        <div
          id="panel-logic"
          role="tabpanel"
          aria-labelledby="tab-logic"
          className={styles.controlGroup}
        >
          <div className={styles.logicSteps} aria-live="polite">
            <div className={styles.stepRow}>
              <strong>Guard 1 (and):</strong>
              <code>
                fits_single = ({displayTotal} &lt;= {contextLimit}) and (
                {displayTotal} &gt; 0)
              </code>
            </div>
            <div className={styles.stepRow}>
              <span>Breakdown:</span>
              <span
                className={`${styles.stepBadge} ${condFits ? styles.stepTrue : styles.stepFalse}`}
              >
                {condFits ? "True" : "False"}
              </span>
              <span>and</span>
              <span
                className={`${styles.stepBadge} ${condPositive ? styles.stepTrue : styles.stepFalse}`}
              >
                {condPositive ? "True" : "False"}
              </span>
              <span>
                -&gt; Result:{" "}
                <strong>{guardSinglePrompt ? "True" : "False"}</strong>
              </span>
            </div>
            <p className={styles.resultDesc}>
              <strong>Short-circuiting:</strong> With <code>and</code>, if the
              first condition is False, Python stops immediately because the
              whole check can never be True.
            </p>

            <hr style={{ borderColor: "var(--line)", margin: "0.25rem 0" }} />

            <div className={styles.stepRow}>
              <strong>Guard 2 (or):</strong>
              <code>
                needs_warning = ({displayTotal} &gt; {contextLimit}) or (
                {displayTotal} &lt;= 0)
              </code>
            </div>
            <div className={styles.stepRow}>
              <span>Breakdown:</span>
              <span
                className={`${styles.stepBadge} ${condExceeds ? styles.stepTrue : styles.stepFalse}`}
              >
                {condExceeds ? "True" : "False"}
              </span>
              <span>or</span>
              <span
                className={`${styles.stepBadge} ${condNonPositive ? styles.stepTrue : styles.stepFalse}`}
              >
                {condNonPositive ? "True" : "False"}
              </span>
              <span>
                -&gt; Result:{" "}
                <strong>{guardNeedsWarning ? "True" : "False"}</strong>
              </span>
            </div>
            <p className={styles.resultDesc}>
              <strong>Short-circuiting:</strong> With <code>or</code>, if the
              first condition is True, Python stops immediately because the
              whole check is already guaranteed to be True.
            </p>

            <hr style={{ borderColor: "var(--line)", margin: "0.25rem 0" }} />

            <div className={styles.stepRow}>
              <strong>Guard 3 (not):</strong>
              <code>
                is_safe = not ({displayTotal} &gt; {contextLimit})
              </code>
            </div>
            <div className={styles.stepRow}>
              <span>Breakdown:</span>
              <span>not</span>
              <span
                className={`${styles.stepBadge} ${condExceeds ? styles.stepTrue : styles.stepFalse}`}
              >
                {condExceeds ? "True" : "False"}
              </span>
              <span>
                -&gt; Result:{" "}
                <strong>{guardSafeToSend ? "True" : "False"}</strong>
              </span>
            </div>
            <p className={styles.resultDesc}>
              <strong>Grouping:</strong> The <code>not</code> operator inverts
              the boolean. Using parentheses ensures the comparison runs before
              the inversion.
            </p>
          </div>
        </div>
      )}

      <div className={styles.resetRow}>
        <button type="button" className={styles.stepperBtn} onClick={resetLab}>
          Reset sandbox
        </button>
      </div>
    </div>
  );
}
