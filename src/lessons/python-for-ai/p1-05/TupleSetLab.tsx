"use client";

import { useState } from "react";
import styles from "./lesson.module.css";

interface Preset {
  id: string;
  label: string;
  description: string;
  modelName: string;
  maxTokens: number;
  tagWord: string;
  defaultComma: boolean;
  defaultTryMutate: boolean;
  rawSources: string[];
  newCandidate: string;
  dupCandidate: string;
  presentQuery: string;
  absentQuery: string;
  defaultQueryPresent: boolean;
}

const PRESETS: Preset[] = [
  {
    id: "citations",
    label: "Citation Deduplicator",
    description:
      "Lock model settings in a 2-item tuple and deduplicate retrieved document IDs with a set.",
    modelName: "gpt-4o-mini",
    maxTokens: 4096,
    tagWord: "billing",
    defaultComma: true,
    defaultTryMutate: false,
    rawSources: ["doc_12", "doc_05", "doc_12"],
    newCandidate: "doc_09",
    dupCandidate: "doc_12",
    presentQuery: "doc_05",
    absentQuery: "doc_99",
    defaultQueryPresent: true,
  },
  {
    id: "vision",
    label: "Vision Tile Config",
    description:
      "Unpack fixed vision model settings and filter duplicate image tile IDs before captioning.",
    modelName: "vision-v2",
    maxTokens: 1024,
    tagWord: "ocr",
    defaultComma: true,
    defaultTryMutate: false,
    rawSources: ["img_01", "img_02", "img_01"],
    newCandidate: "img_09",
    dupCandidate: "img_01",
    presentQuery: "img_02",
    absentQuery: "img_99",
    defaultQueryPresent: true,
  },
  {
    id: "comma-trap",
    label: "Single-Tag Trap",
    description:
      "Inspect what happens when a 1-item tuple omits its trailing comma and becomes a plain string.",
    modelName: "gpt-4o-mini",
    maxTokens: 4096,
    tagWord: "billing",
    defaultComma: false,
    defaultTryMutate: false,
    rawSources: ["doc_12", "doc_05", "doc_12"],
    newCandidate: "doc_09",
    dupCandidate: "doc_12",
    presentQuery: "doc_05",
    absentQuery: "doc_99",
    defaultQueryPresent: false,
  },
];

export function TupleSetLab() {
  const [presetId, setPresetId] = useState<string>(PRESETS[0].id);
  const [hasTrailingComma, setHasTrailingComma] = useState<boolean>(
    PRESETS[0].defaultComma,
  );
  const [tryMutateTuple, setTryMutateTuple] = useState<boolean>(
    PRESETS[0].defaultTryMutate,
  );
  const [addedNewItem, setAddedNewItem] = useState<boolean>(false);
  const [lastSetAction, setLastSetAction] = useState<string>(
    "Converted raw_sources list into unique_sources set (1 duplicate dropped).",
  );
  const [queryPresent, setQueryPresent] = useState<boolean>(
    PRESETS[0].defaultQueryPresent,
  );
  const [statusMsg, setStatusMsg] = useState<string>("");

  const activePreset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0];

  function applyPreset(preset: Preset, announce: string) {
    setPresetId(preset.id);
    setHasTrailingComma(preset.defaultComma);
    setTryMutateTuple(preset.defaultTryMutate);
    setAddedNewItem(false);
    setLastSetAction(
      `Converted raw_sources list into unique_sources set (1 duplicate "${preset.dupCandidate}" dropped).`,
    );
    setQueryPresent(preset.defaultQueryPresent);
    setStatusMsg(announce);
  }

  function handleReset() {
    applyPreset(PRESETS[0], "Sandbox reset to Citation Deduplicator preset.");
  }

  const baseUnique = Array.from(new Set(activePreset.rawSources));
  const uniqueItems = addedNewItem
    ? [...baseUnique, activePreset.newCandidate]
    : baseUnique;

  const tagCode = hasTrailingComma
    ? `("${activePreset.tagWord}",)`
    : `("${activePreset.tagWord}")`;
  const tagType = hasTrailingComma ? "tuple" : "str";
  const tagLen = hasTrailingComma ? 1 : activePreset.tagWord.length;

  const activeQueryDoc = queryPresent
    ? activePreset.presentQuery
    : activePreset.absentQuery;
  const isMember = uniqueItems.includes(activeQueryDoc);

  return (
    <div className={`lab ${styles.labContainer}`}>
      <div className={styles.labHeader}>
        <div>
          <span className="eyebrow">Interactive Python simulation</span>
          <h3 className={styles.labTitle}>
            Tuple &amp; Set Retrieval Pipeline Inspector
          </h3>
        </div>
        <span className="pill">Illustrative sandbox · Local state</span>
      </div>

      <p className="micro" style={{ color: "var(--muted)", marginTop: 0 }}>
        This interactive sandbox simulates Python&apos;s <code>tuple</code> and{" "}
        <code>set</code> rules on illustrative retrieval data. In live Python,
        set display order is arbitrary and not indexed.
      </p>

      <div
        className={styles.presetRow}
        role="group"
        aria-label="Pipeline presets"
      >
        {PRESETS.map((preset) => {
          const isActive = preset.id === presetId;
          return (
            <button
              key={preset.id}
              type="button"
              aria-pressed={isActive}
              className={`${styles.presetBtn} ${
                isActive ? styles.presetBtnActive : ""
              }`}
              onClick={() =>
                applyPreset(preset, `Loaded preset: ${preset.label}.`)
              }
            >
              {preset.label}
            </button>
          );
        })}
        <button type="button" className={styles.resetBtn} onClick={handleReset}>
          Reset sandbox
        </button>
      </div>

      <p className={styles.presetDesc}>{activePreset.description}</p>

      <div className={styles.labGrid}>
        {/* Panel 1: Tuple Inspector */}
        <div className={styles.inspectorCard}>
          <div className={styles.cardHeader}>
            <span className="eyebrow">1. Locked Tuple Record</span>
            <code className={styles.badgeCode}>tuple</code>
          </div>

          <div className={styles.codePanel}>
            <div className={styles.codeLine}>
              <span className={styles.codeVar}>model_spec</span> = (
              <span className={styles.codeString}>
                &quot;{activePreset.modelName}&quot;
              </span>
              , <span className={styles.codeNum}>{activePreset.maxTokens}</span>
              )
            </div>
            <div className={styles.codeLine}>
              <span className={styles.codeVar}>model_name</span>,{" "}
              <span className={styles.codeVar}>max_tokens</span> ={" "}
              <span className={styles.codeVar}>model_spec</span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.codeVar}>required_tag</span> = {tagCode}
            </div>
          </div>

          <div className={styles.controlStack}>
            <button
              type="button"
              aria-pressed={hasTrailingComma}
              className={`${styles.toggleBtn} ${
                hasTrailingComma ? styles.toggleBtnActive : ""
              }`}
              onClick={() => {
                const next = !hasTrailingComma;
                setHasTrailingComma(next);
                setStatusMsg(
                  next
                    ? `Added trailing comma: required_tag is now a 1-item tuple.`
                    : `Removed trailing comma: required_tag is now a str of length ${activePreset.tagWord.length}.`,
                );
              }}
            >
              {hasTrailingComma
                ? `✓ Trailing comma included: ("${activePreset.tagWord}",)`
                : `✗ Trailing comma omitted: ("${activePreset.tagWord}")`}
            </button>

            <button
              type="button"
              aria-pressed={tryMutateTuple}
              className={`${styles.toggleBtn} ${
                tryMutateTuple ? styles.toggleBtnActive : ""
              }`}
              onClick={() => {
                const next = !tryMutateTuple;
                setTryMutateTuple(next);
                setStatusMsg(
                  next
                    ? "Attempted model_spec[1] = 8192: blocked with TypeError."
                    : "Cleared item assignment attempt: tuple unpacked cleanly.",
                );
              }}
            >
              {tryMutateTuple
                ? "✗ Attempting: model_spec[1] = 8192"
                : "Try item assignment: model_spec[1] = 8192"}
            </button>
          </div>

          <div className={styles.resultBox}>
            <div className={styles.resultRow}>
              <span className={styles.resultLabel}>Unpacked values:</span>
              <code>
                model_name = &quot;{activePreset.modelName}&quot;, max_tokens ={" "}
                {activePreset.maxTokens}
              </code>
            </div>
            <div className={styles.resultRow}>
              <span className={styles.resultLabel}>
                <code>type(required_tag)</code> &amp; <code>len()</code>:
              </span>
              <code>
                {tagType} (len = {tagLen})
              </code>
            </div>
            {!hasTrailingComma && (
              <div className={styles.warningNote}>
                Without a comma, parentheses only group the string: Python sees
                a <code>str</code> with {tagLen} characters instead of a 1-item{" "}
                <code>tuple</code>.
              </div>
            )}
            {tryMutateTuple && (
              <div className={styles.errorNote}>
                <code>
                  TypeError: &apos;tuple&apos; object does not support item
                  assignment
                </code>{" "}
                — <code>model_spec</code> stays{" "}
                <code>
                  (&quot;{activePreset.modelName}&quot;,{" "}
                  {activePreset.maxTokens})
                </code>
                .
              </div>
            )}
          </div>
        </div>

        {/* Panel 2: Set Deduplicator */}
        <div className={styles.inspectorCard}>
          <div className={styles.cardHeader}>
            <span className="eyebrow">2. Unique Set Filter</span>
            <code className={styles.badgeCode}>set</code>
          </div>

          <div className={styles.codePanel}>
            <div className={styles.codeLine}>
              <span className={styles.codeVar}>raw_sources</span> = [
              {activePreset.rawSources.map((s, idx) => (
                <span key={`${s}-${idx}`}>
                  <span className={styles.codeString}>&quot;{s}&quot;</span>
                  {idx < activePreset.rawSources.length - 1 ? ", " : ""}
                </span>
              ))}
              ]
            </div>
            <div className={styles.codeLine}>
              <span className={styles.codeVar}>unique_sources</span> = set(
              <span className={styles.codeVar}>raw_sources</span>)
            </div>
            <div className={styles.codeLine}>
              <span className={styles.codeString}>
                &quot;{activeQueryDoc}&quot;
              </span>{" "}
              <span className={styles.codeKeyword}>in</span>{" "}
              <span className={styles.codeVar}>unique_sources</span>
            </div>
          </div>

          <div className={styles.controlStack}>
            <div
              className={styles.actionRow}
              role="group"
              aria-label="Add source ID to set"
            >
              <button
                type="button"
                aria-pressed={addedNewItem}
                className={`${styles.toggleBtn} ${
                  addedNewItem ? styles.toggleBtnActive : ""
                }`}
                onClick={() => {
                  setAddedNewItem(true);
                  const msg = `Ran unique_sources.add("${activePreset.newCandidate}"): new ID added, len(unique_sources) is now 3.`;
                  setLastSetAction(msg);
                  setStatusMsg(msg);
                }}
              >
                + .add(&quot;{activePreset.newCandidate}&quot;) (new ID)
              </button>
              <button
                type="button"
                className={styles.secondaryActionBtn}
                onClick={() => {
                  const currentLen = addedNewItem ? 3 : 2;
                  const msg = `Ran unique_sources.add("${activePreset.dupCandidate}"): "${activePreset.dupCandidate}" is already in the set, so len(unique_sources) stays ${currentLen}.`;
                  setLastSetAction(msg);
                  setStatusMsg(msg);
                }}
              >
                + .add(&quot;{activePreset.dupCandidate}&quot;) (duplicate)
              </button>
            </div>

            <div
              className={styles.actionRow}
              role="group"
              aria-label="Membership check query"
            >
              <button
                type="button"
                aria-pressed={queryPresent}
                className={`${styles.toggleBtn} ${
                  queryPresent ? styles.toggleBtnActive : ""
                }`}
                onClick={() => {
                  setQueryPresent(true);
                  setStatusMsg(
                    `Checked "${activePreset.presentQuery}" in unique_sources: True.`,
                  );
                }}
              >
                Check &quot;{activePreset.presentQuery}&quot; in set
              </button>
              <button
                type="button"
                aria-pressed={!queryPresent}
                className={`${styles.toggleBtn} ${
                  !queryPresent ? styles.toggleBtnActive : ""
                }`}
                onClick={() => {
                  setQueryPresent(false);
                  setStatusMsg(
                    `Checked "${activePreset.absentQuery}" in unique_sources: False.`,
                  );
                }}
              >
                Check &quot;{activePreset.absentQuery}&quot; in set
              </button>
            </div>
          </div>

          <div className={styles.resultBox}>
            <div className={styles.resultRow}>
              <span className={styles.resultLabel}>
                <code>unique_sources</code> (unindexed):
              </span>
              <code>
                &#123;
                {uniqueItems.map((item) => `"${item}"`).join(", ")}
                &#125; (len = {uniqueItems.length})
              </code>
            </div>
            <div className={styles.resultRow}>
              <span className={styles.resultLabel}>
                <code>&quot;{activeQueryDoc}&quot; in unique_sources</code>:
              </span>
              <code>{isMember ? "True" : "False"}</code>
            </div>
            <div className={styles.infoNote}>{lastSetAction}</div>
          </div>
        </div>
      </div>

      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="visually-hidden"
      >
        {statusMsg}
      </div>
    </div>
  );
}
