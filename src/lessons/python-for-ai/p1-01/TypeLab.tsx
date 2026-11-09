"use client";

import { useState } from "react";
import styles from "./lesson.module.css";

type PresetKey = "tokens" | "temp" | "model" | "stream";

interface Preset {
  key: PresetKey;
  name: string;
  rawValue: string;
  baseType: "int" | "float" | "str" | "bool";
  label: string;
  canQuote: boolean;
}

const PRESETS: Record<PresetKey, Preset> = {
  tokens: {
    key: "tokens",
    name: "max_tokens",
    rawValue: "500",
    baseType: "int",
    label: "max_tokens (int)",
    canQuote: true,
  },
  temp: {
    key: "temp",
    name: "temperature",
    rawValue: "0.7",
    baseType: "float",
    label: "temperature (float)",
    canQuote: true,
  },
  model: {
    key: "model",
    name: "model_name",
    rawValue: "gemini-1.5-flash",
    baseType: "str",
    label: "model_name (str)",
    canQuote: false,
  },
  stream: {
    key: "stream",
    name: "stream",
    rawValue: "True",
    baseType: "bool",
    label: "stream (bool)",
    canQuote: true,
  },
};

export function TypeLab() {
  const [selectedPreset, setSelectedPreset] = useState<PresetKey>("tokens");
  const [isQuoted, setIsQuoted] = useState(false);
  const [selectedOp, setSelectedOp] = useState<string>("op1");

  const preset = PRESETS[selectedPreset];
  const isStringWrapped = isQuoted && preset.canQuote;

  const currentType = isStringWrapped ? "str" : preset.baseType;
  const displayValue =
    currentType === "str" ? `"${preset.rawValue}"` : preset.rawValue;
  const pythonRepr =
    currentType === "str" ? `'${preset.rawValue}'` : preset.rawValue;

  const typeRepresentation = `<class '${currentType}'>`;

  // Determine operations and outcomes
  let opButtons: { id: string; label: string }[] = [];
  let opResult = {
    isError: false,
    code: "",
    desc: "",
  };

  if (selectedPreset === "tokens") {
    opButtons = [
      { id: "op1", label: "+ 100 (numeric)" },
      { id: "op2", label: '+ "100" (text)' },
      { id: "op3", label: "API validation" },
    ];

    if (selectedOp === "op1") {
      if (!isStringWrapped) {
        opResult = {
          isError: false,
          code: "max_tokens + 100  # Result: 600",
          desc: "Numeric addition: Python adds the integers together, producing 600.",
        };
      } else {
        opResult = {
          isError: true,
          code: 'max_tokens + 100  # TypeError: can only concatenate str (not "int") to str',
          desc: 'TypeError! Python refuses to add an int (100) to a str ("500"). Python requires explicit conversion.',
        };
      }
    } else if (selectedOp === "op2") {
      if (!isStringWrapped) {
        opResult = {
          isError: true,
          code: 'max_tokens + "100"  # TypeError: unsupported operand type(s) for +: "int" and "str"',
          desc: 'TypeError! You cannot add a text string ("100") to an integer (500).',
        };
      } else {
        opResult = {
          isError: false,
          code: 'max_tokens + "100"  # Result: "500100"',
          desc: 'String concatenation! Both sides are strings, so Python joins them into "500100" instead of doing math.',
        };
      }
    } else {
      if (!isStringWrapped) {
        opResult = {
          isError: false,
          code: "isinstance(max_tokens, int)  # Result: True",
          desc: "Valid! The AI provider API accepts this parameter as a generation limit.",
        };
      } else {
        opResult = {
          isError: true,
          code: "isinstance(max_tokens, int)  # Result: False (is str)",
          desc: 'Validation error: The API expects an integer, but received "500" as text. The API call fails.',
        };
      }
    }
  } else if (selectedPreset === "temp") {
    opButtons = [
      { id: "op1", label: "* 2 (scale)" },
      { id: "op2", label: "+ 0.1 (shift)" },
      { id: "op3", label: "API validation" },
    ];

    if (selectedOp === "op1") {
      if (!isStringWrapped) {
        opResult = {
          isError: false,
          code: "temperature * 2  # Result: 1.4",
          desc: "Floating-point math: 0.7 * 2 = 1.4.",
        };
      } else {
        opResult = {
          isError: false,
          code: 'temperature * 2  # Result: "0.70.7"',
          desc: "String repetition! In Python, multiplying a string by an integer repeats the characters.",
        };
      }
    } else if (selectedOp === "op2") {
      if (!isStringWrapped) {
        opResult = {
          isError: false,
          code: "temperature + 0.1  # Result: 0.8 (approx)",
          desc: "Floating-point addition adjusts the randomness parameter.",
        };
      } else {
        opResult = {
          isError: true,
          code: 'temperature + 0.1  # TypeError: can only concatenate str (not "float") to str',
          desc: "TypeError! A string cannot be added to a float.",
        };
      }
    } else {
      if (!isStringWrapped) {
        opResult = {
          isError: false,
          code: "isinstance(temperature, float)  # Result: True",
          desc: "Valid! Expected float parameter accepted by LLM API.",
        };
      } else {
        opResult = {
          isError: true,
          code: "isinstance(temperature, float)  # Result: False (is str)",
          desc: 'Validation error: Expected float, got "0.7" (str).',
        };
      }
    }
  } else if (selectedPreset === "model") {
    opButtons = [
      { id: "op1", label: '+ "-preview"' },
      { id: "op2", label: ".upper()" },
      { id: "op3", label: "API validation" },
    ];

    if (selectedOp === "op1") {
      opResult = {
        isError: false,
        code: 'model_name + "-preview"  # Result: "gemini-1.5-flash-preview"',
        desc: "String concatenation combines model names and version tags.",
      };
    } else if (selectedOp === "op2") {
      opResult = {
        isError: false,
        code: 'model_name.upper()  # Result: "GEMINI-1.5-FLASH"',
        desc: "String method returns an uppercase copy of the text.",
      };
    } else {
      opResult = {
        isError: false,
        code: "isinstance(model_name, str)  # Result: True",
        desc: "Valid string identifier accepted by LLM client.",
      };
    }
  } else {
    // stream
    opButtons = [
      { id: "op1", label: "not stream" },
      { id: "op2", label: 'bool("False") gotcha' },
      { id: "op3", label: "API validation" },
    ];

    if (selectedOp === "op1") {
      if (!isStringWrapped) {
        opResult = {
          isError: false,
          code: "not stream  # Result: False",
          desc: "Logical NOT inverts True into False.",
        };
      } else {
        opResult = {
          isError: false,
          code: 'not stream  # Result: False (because "True" is non-empty)',
          desc: 'In Python, non-empty strings are truthy, so not "True" evaluates to False.',
        };
      }
    } else if (selectedOp === "op2") {
      opResult = {
        isError: true,
        code: 'bool("False")  # Result: True! (Python gotcha)',
        desc: 'Common AI bug! Passing the text "False" to bool() produces True, because any non-empty string is truthy in Python. To disable a flag, use the literal False without quotes.',
      };
    } else {
      if (!isStringWrapped) {
        opResult = {
          isError: false,
          code: "isinstance(stream, bool)  # Result: True",
          desc: "Valid boolean flag enabling streaming output.",
        };
      } else {
        opResult = {
          isError: true,
          code: "isinstance(stream, bool)  # Result: False (is str)",
          desc: 'Validation error: Expected bool, received "True" (str).',
        };
      }
    }
  }

  const handleReset = () => {
    setSelectedPreset("tokens");
    setIsQuoted(false);
    setSelectedOp("op1");
  };

  return (
    <div
      className={styles.lab}
      role="region"
      aria-label="Interactive Python Type Sandbox"
    >
      <div className={styles.labHeader}>
        <h3 className={styles.labTitle}>AI Parameter &amp; Type Sandbox</h3>
        <span className={styles.badge}>Live Inspection</span>
      </div>

      <div className={styles.presetGroup}>
        <label className={styles.tagLabel} id="preset-label">
          Choose a parameter to inspect:
        </label>
        <div
          className={styles.presetButtons}
          role="group"
          aria-labelledby="preset-label"
        >
          {(Object.keys(PRESETS) as PresetKey[]).map((key) => {
            const p = PRESETS[key];
            const isActive = selectedPreset === key;
            return (
              <button
                key={key}
                type="button"
                className={`${styles.presetBtn} ${isActive ? styles.presetBtnActive : ""}`}
                aria-pressed={isActive}
                onClick={() => {
                  setSelectedPreset(key);
                  setIsQuoted(false);
                  setSelectedOp("op1");
                }}
              >
                {p.name}
              </button>
            );
          })}
        </div>
      </div>

      {preset.canQuote && (
        <div className={styles.toggleRow}>
          <label className={styles.toggleLabel}>
            <input
              type="checkbox"
              className={styles.toggleCheckbox}
              checked={isQuoted}
              onChange={(e) => setIsQuoted(e.target.checked)}
            />
            <span>
              Wrap in quotes (treat as string <code>"{preset.rawValue}"</code>)
            </span>
          </label>
        </div>
      )}

      <div className={styles.codePanel}>
        <div className={styles.codeComment}># 1. Assignment in Python code</div>
        <p className={styles.codeLine}>
          <span className={styles.codeVar}>{preset.name}</span>{" "}
          <span className={styles.codeOp}>=</span>{" "}
          <span className={styles.codeVal}>{displayValue}</span>
        </p>
      </div>

      <div className={styles.memoryDiagram}>
        <h4 className={styles.memoryHeading}>
          2. Mental Model: Name points to Object in Memory
        </h4>
        <div className={styles.memoryFlow}>
          <div className={styles.nameTag}>
            <div className={styles.tagLabel}>Variable Name</div>
            <div className={styles.tagName}>{preset.name}</div>
          </div>
          <div className={styles.arrow} aria-hidden="true">
            ──►
          </div>
          <div className={styles.heapObject}>
            <span className={styles.heapType}>{typeRepresentation}</span>
            <span className={styles.heapValue}>{displayValue}</span>
          </div>
        </div>
      </div>

      <div className={styles.inspectorGrid}>
        <div className={styles.card}>
          <h4 className={styles.cardTitle}>Runtime Inspection</h4>
          <div>
            <div className={styles.tagLabel}>type({preset.name})</div>
            <div className={styles.cardValue}>{typeRepresentation}</div>
          </div>
          <div>
            <div className={styles.tagLabel}>repr({preset.name})</div>
            <div className={styles.cardValue}>{pythonRepr}</div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.operationSelector}>
            <h4 className={styles.cardTitle}>3. Test an Operation</h4>
            <div
              className={styles.opButtons}
              role="group"
              aria-label="Available operations"
            >
              {opButtons.map((btn) => (
                <button
                  key={btn.id}
                  type="button"
                  className={`${styles.opBtn} ${selectedOp === btn.id ? styles.opBtnActive : ""}`}
                  aria-pressed={selectedOp === btn.id}
                  onClick={() => setSelectedOp(btn.id)}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <div
              className={`${styles.resultBox} ${opResult.isError ? styles.resultBoxError : styles.resultBoxSuccess}`}
              role="status"
              aria-live="polite"
            >
              <code className={styles.resultCode}>{opResult.code}</code>
              <p className={styles.resultDesc}>{opResult.desc}</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.resetRow}>
        <button type="button" className={styles.resetBtn} onClick={handleReset}>
          ↺ Reset Sandbox
        </button>
      </div>
    </div>
  );
}
