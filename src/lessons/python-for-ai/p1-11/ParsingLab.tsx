"use client";
import { useState } from "react";

const examples = [
  {
    value: "3",
    conversion: "int('3') returns 3.",
    result: "3 is within 0–5: accept it.",
  },
  {
    value: "0",
    conversion: "int('0') returns 0.",
    result: "0 is within 0–5: accept it.",
  },
  {
    value: "7",
    conversion: "int('7') returns 7.",
    result: "7 is outside 0–5: reject it.",
  },
  {
    value: "-1",
    conversion: "int('-1') returns -1.",
    result: "-1 is outside 0–5: reject it.",
  },
  {
    value: "three",
    conversion: "int('three') raises ValueError.",
    result: "The handler asks for a whole number. The range check is skipped.",
  },
  {
    value: "",
    conversion: "int('') raises ValueError.",
    result: "The handler asks for a whole number. The range check is skipped.",
  },
];
export function ParsingLab() {
  const [choice, setChoice] = useState("3");
  const selected = examples.find((example) => example.value === choice)!;
  return (
    <div className="callout">
      <label htmlFor="sample">Sample text</label>{" "}
      <select
        id="sample"
        value={choice}
        onChange={(event) => setChoice(event.target.value)}
      >
        {examples.map((example) => (
          <option key={example.value} value={example.value}>
            {example.value === "" ? "empty text" : `'${example.value}'`}
          </option>
        ))}
      </select>
      <div role="status" aria-live="polite" aria-atomic="true">
        <p>
          <strong>Conversion:</strong> {selected.conversion}
        </p>
        <p>
          <strong>Next:</strong> {selected.result}
        </p>
      </div>
      <button onClick={() => setChoice("3")}>Reset sample</button>
    </div>
  );
}
