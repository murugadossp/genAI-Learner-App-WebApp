"use client";
import { useState } from "react";
import { PartsMap } from "./PartsMap";
import type { PartId } from "./parts";
import styles from "./lesson.module.css";

const steps: {
  title: string;
  who: string;
  part: PartId | null;
  input: string;
  output: string;
}[] = [
  {
    title: "You take a photo",
    who: "Interface",
    part: "interface",
    input: "Your tap on the camera button.",
    output: "A photo of a leaf, sent into the app.",
  },
  {
    title: "The model guesses the plant",
    who: "Model",
    part: "model",
    input: "The leaf photo. Nothing else.",
    output: "A best guess: “tomato plant”.",
  },
  {
    title: "The app looks up care tips",
    who: "Data source",
    part: "data",
    input: "The guess “tomato plant”.",
    output: "The stored tip: “Water when the top of the soil is dry.”",
  },
  {
    title: "The app asks a weather service",
    who: "Tool",
    part: "tool",
    input: "A question: is rain due today where you are?",
    output: "An answer: “Rain is due today.”",
  },
  {
    title: "The app’s code combines the answers",
    who: "App code",
    part: null,
    input:
      "The guess “tomato plant”, the stored tip, the weather answer and a rule from the app’s makers: if rain is due, add “skip today”.",
    output:
      "The finished text: “Tomato plant. Water when the top of the soil is dry, but skip today: rain is due.”",
  },
  {
    title: "You read the result",
    who: "Interface",
    part: "interface",
    input: "The finished text from the app code.",
    output: "The same text, shown to you on a result card.",
  },
];

export function Trace() {
  const [i, setI] = useState(0);
  const [message, setMessage] = useState("");
  const s = steps[i];
  const go = (n: number) => {
    setI(n);
    const t = steps[n];
    setMessage(
      `Step ${n + 1} of ${steps.length}. ${t.title}. Part: ${t.who}. Goes in: ${t.input} Comes out: ${t.output}`,
    );
  };
  return (
    <div className="lab">
      <div className="lab-head">
        <strong>Leaf Buddy: one request, step by step</strong>
        <span className="pill">EXPLORE</span>
      </div>
      <div className="lab-body">
        <p>Try it in this order:</p>
        <ol>
          <li>Press Next and read what goes in and what comes out.</li>
          <li>Watch which part is marked “In use” in the list.</li>
          <li>
            Find the one step where the model works. Then use Back to compare.
          </li>
        </ol>
        <div className={styles.step} data-testid="trace-step">
          <strong>
            Step {i + 1} of {steps.length}: {s.title}
          </strong>
          <p>
            <b>Part:</b> {s.who}
          </p>
          <p>
            <b>Goes in:</b> {s.input}
          </p>
          <p>
            <b>Comes out:</b> {s.output}
          </p>
        </div>
        <div className={styles.score}>
          <button type="button" disabled={i === 0} onClick={() => go(i - 1)}>
            ← Back
          </button>
          <button
            type="button"
            className="button"
            disabled={i === steps.length - 1}
            onClick={() => go(i + 1)}
          >
            Next →
          </button>
          <button
            type="button"
            onClick={() => {
              setI(0);
              setMessage("Trace reset to step 1.");
            }}
          >
            Reset
          </button>
        </div>
        <div role="status" aria-live="polite" className="visually-hidden">
          {message}
        </div>
        <PartsMap
          active={s.part ? [s.part] : []}
          appCode={s.part === null}
          caption="Leaf Buddy is invented. The parts are the same ones shown above."
        />
        <p className="micro lab-disclosure">
          Leaf Buddy is an invented app. The answers, the tip and the rule are
          made up to show the idea. This is not a real product or a real model.
        </p>
      </div>
    </div>
  );
}
