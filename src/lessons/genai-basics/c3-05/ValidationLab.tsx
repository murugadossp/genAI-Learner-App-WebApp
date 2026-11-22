"use client";

import { useId, useMemo, useState } from "react";
import styles from "./lesson.module.css";

interface Preset {
  id: string;
  label: string;
  description: string;
  text: string;
}

const REQUIRED_FIELDS = ["event", "date", "location", "cost"] as const;
const ALLOWED_COSTS = ["free", "paid", "unknown"] as const;

const PRESETS: Preset[] = [
  {
    id: "clean",
    label: "Clean reply",
    description: "Valid JSON, exact field names, allowed values, matches note.",
    text: `{
  "event": "Bike repair clinic",
  "date": "Saturday, May 16",
  "location": "Oak Park Shelter",
  "cost": "free"
}`,
  },
  {
    id: "wrapper",
    label: "Wrapper text",
    description: "Includes conversational intro text outside the JSON braces.",
    text: `Sure! Here is the event in JSON:
{
  "event": "Bike repair clinic",
  "date": "Saturday, May 16",
  "location": "Oak Park Shelter",
  "cost": "free"
}`,
  },
  {
    id: "renamed",
    label: "Renamed field",
    description: 'Uses "place" instead of the required "location" field.',
    text: `{
  "event": "Bike repair clinic",
  "date": "Saturday, May 16",
  "place": "Oak Park Shelter",
  "cost": "free"
}`,
  },
  {
    id: "unallowed",
    label: "Unallowed value",
    description: 'Uses "$0 (drop-in)" instead of "free", "paid", or "unknown".',
    text: `{
  "event": "Bike repair clinic",
  "date": "Saturday, May 16",
  "location": "Oak Park Shelter",
  "cost": "$0 (drop-in)"
}`,
  },
  {
    id: "wrong-fact",
    label: "Wrong fact",
    description: "Passes every format check, but gets the location wrong.",
    text: `{
  "event": "Bike repair clinic",
  "date": "Saturday, May 16",
  "location": "Maple Park Shelter",
  "cost": "free"
}`,
  },
];

type CheckState = "pass" | "fail" | "skip";

interface ValidationResult {
  syntax: { state: CheckState; detail: string };
  fields: { state: CheckState; detail: string };
  values: { state: CheckState; detail: string };
  allFormatPassed: boolean;
  parsedLocation: string | null;
  summary: string;
}

function validateReply(raw: string): ValidationResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {
      syntax: {
        state: "fail",
        detail:
          "Cannot parse as JSON. Remove any extra text before or after { ... } and check quotes, commas, and braces.",
      },
      fields: {
        state: "skip",
        detail: "Skipped until the reply parses as a valid JSON object.",
      },
      values: {
        state: "skip",
        detail: "Skipped until the reply parses as a valid JSON object.",
      },
      allFormatPassed: false,
      parsedLocation: null,
      summary:
        "Format validation failed at step 1 (Valid JSON syntax). Fix the syntax before checking fields or values.",
    };
  }

  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    return {
      syntax: {
        state: "fail",
        detail:
          "Parsed as JSON, but the top-level value must be an object wrapped in { ... }.",
      },
      fields: {
        state: "skip",
        detail: "Skipped until the top-level JSON value is an object.",
      },
      values: {
        state: "skip",
        detail: "Skipped until the top-level JSON value is an object.",
      },
      allFormatPassed: false,
      parsedLocation: null,
      summary:
        "Format validation failed at step 1: expected a JSON object wrapped in curly braces.",
    };
  }

  const record = parsed as Record<string, unknown>;
  const keys = Object.keys(record);
  const missing = REQUIRED_FIELDS.filter((key) => !(key in record));
  const extra = keys.filter(
    (key) => !(REQUIRED_FIELDS as readonly string[]).includes(key),
  );

  const fieldsPassed = missing.length === 0 && extra.length === 0;
  let fieldsDetail =
    "All four required fields (event, date, location, cost) are present with exact names.";
  if (!fieldsPassed) {
    const parts: string[] = [];
    if (missing.length > 0) {
      parts.push(`Missing: ${missing.join(", ")}`);
    }
    if (extra.length > 0) {
      parts.push(`Unexpected: ${extra.join(", ")}`);
    }
    fieldsDetail = `${parts.join(". ")}.`;
  }

  const valueErrors: string[] = [];
  for (const textField of ["event", "date", "location"] as const) {
    if (textField in record) {
      const val = record[textField];
      if (typeof val !== "string" || val.trim().length === 0) {
        valueErrors.push(`${textField} must be non-empty text`);
      }
    }
  }
  if ("cost" in record) {
    const costVal = record.cost;
    if (
      typeof costVal !== "string" ||
      !(ALLOWED_COSTS as readonly string[]).includes(costVal)
    ) {
      valueErrors.push('cost must be "free", "paid", or "unknown"');
    }
  }

  let valuesState: CheckState = "pass";
  let valuesDetail =
    'Every field is non-empty text and cost is one of "free", "paid", or "unknown".';

  if (missing.length > 0) {
    valuesState = valueErrors.length > 0 ? "fail" : "skip";
    valuesDetail =
      valueErrors.length > 0
        ? `${valueErrors.join("; ")}.`
        : "Cannot finish checking values while required fields are missing.";
  } else if (valueErrors.length > 0) {
    valuesState = "fail";
    valuesDetail = `${valueErrors.join("; ")}.`;
  }

  const allFormatPassed = fieldsPassed && valuesState === "pass";
  const parsedLocation =
    typeof record.location === "string" ? record.location : null;

  let summary: string;
  if (allFormatPassed) {
    summary =
      "All 3 format checks passed. The JSON shape is valid—now compare the values against the source note.";
  } else if (!fieldsPassed) {
    summary = `Format validation failed at step 2 (Required fields): ${fieldsDetail}`;
  } else {
    summary = `Format validation failed at step 3 (Allowed values): ${valuesDetail}`;
  }

  return {
    syntax: {
      state: "pass",
      detail: "Parses cleanly as a single JSON object.",
    },
    fields: {
      state: fieldsPassed ? "pass" : "fail",
      detail: fieldsDetail,
    },
    values: {
      state: valuesState,
      detail: valuesDetail,
    },
    allFormatPassed,
    parsedLocation,
    summary,
  };
}

function badgeClass(state: CheckState) {
  if (state === "pass") return styles.badgePass;
  if (state === "fail") return styles.badgeFail;
  return styles.badgeSkip;
}

function badgeText(state: CheckState) {
  if (state === "pass") return "Pass";
  if (state === "fail") return "Fail";
  return "Waiting";
}

export function ValidationLab() {
  const [activePresetId, setActivePresetId] = useState<string>(PRESETS[0].id);
  const [replyText, setReplyText] = useState<string>(PRESETS[0].text);
  const editorId = useId();
  const statusId = useId();

  const result = useMemo(() => validateReply(replyText), [replyText]);

  function selectPreset(preset: Preset) {
    setActivePresetId(preset.id);
    setReplyText(preset.text);
  }

  function handleReset() {
    setActivePresetId(PRESETS[0].id);
    setReplyText(PRESETS[0].text);
  }

  return (
    <div className={`${styles.lab} lab`}>
      <div className={styles.labHeader}>
        <h3 className={styles.labTitle}>JSON Reply Validator</h3>
        <button type="button" onClick={handleReset}>
          Reset lab
        </button>
      </div>

      <div className={styles.noteBox}>
        <span className={styles.noteLabel}>Source note (for fact check)</span>
        &ldquo;Hi! Our neighborhood bike repair clinic is on Saturday, May 16 at
        Oak Park Shelter. It&apos;s free for all ages—no registration needed,
        just drop by!&rdquo;
      </div>

      <p className={styles.schemaStrip}>
        <strong>Schema rules:</strong> Valid JSON object · Exact keys{" "}
        <code>event</code>, <code>date</code>, <code>location</code>,{" "}
        <code>cost</code> · Non-empty text · <code>cost</code> must be{" "}
        <code>&quot;free&quot;</code>, <code>&quot;paid&quot;</code>, or{" "}
        <code>&quot;unknown&quot;</code>.
      </p>

      <div
        className={styles.presetRow}
        role="group"
        aria-label="Sample model replies"
      >
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            className={styles.presetBtn}
            aria-pressed={activePresetId === preset.id}
            onClick={() => selectPreset(preset)}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <label className={styles.editorLabel} htmlFor={editorId}>
        Model reply (edit directly to test fixes):
      </label>
      <textarea
        id={editorId}
        className={styles.editor}
        value={replyText}
        aria-describedby={statusId}
        spellCheck={false}
        onChange={(e) => {
          setActivePresetId("custom");
          setReplyText(e.target.value);
        }}
      />

      <ol className={styles.checksList} aria-label="Automated format checks">
        <li className={styles.checkRow} data-testid="check-syntax">
          <div className={styles.checkTop}>
            <span className={styles.checkName}>1. Valid JSON syntax</span>
            <span className={badgeClass(result.syntax.state)}>
              {badgeText(result.syntax.state)}
            </span>
          </div>
          <p className={styles.checkDetail}>{result.syntax.detail}</p>
        </li>

        <li className={styles.checkRow} data-testid="check-fields">
          <div className={styles.checkTop}>
            <span className={styles.checkName}>2. Exact required fields</span>
            <span className={badgeClass(result.fields.state)}>
              {badgeText(result.fields.state)}
            </span>
          </div>
          <p className={styles.checkDetail}>{result.fields.detail}</p>
        </li>

        <li className={styles.checkRow} data-testid="check-values">
          <div className={styles.checkTop}>
            <span className={styles.checkName}>3. Allowed values</span>
            <span className={badgeClass(result.values.state)}>
              {badgeText(result.values.state)}
            </span>
          </div>
          <p className={styles.checkDetail}>{result.values.detail}</p>
        </li>
      </ol>

      {result.allFormatPassed && (
        <div className={styles.truthBanner} data-testid="truth-check">
          <strong>Separate human check (not automated):</strong> This validator
          only checks the JSON shape. Compare the values above with the source
          note—for example, does <code>location</code> (
          <code>{result.parsedLocation}</code>) match{" "}
          <strong>Oak Park Shelter</strong>?
        </div>
      )}

      <div
        id={statusId}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={styles.statusBar}
        data-testid="lab-status"
      >
        {result.summary}
      </div>
    </div>
  );
}
