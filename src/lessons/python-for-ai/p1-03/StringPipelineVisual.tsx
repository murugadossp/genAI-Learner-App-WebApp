"use client";

import { useState } from "react";
import styles from "./lesson.module.css";

interface Stage {
  num: string;
  label: string;
  code: string;
  result: string;
  action: string;
}

const STAGES: Stage[] = [
  {
    num: "Stage 1",
    label: "Raw Webhook Input",
    code: 'raw = "   RefunD for Order #881   "',
    result: '"   RefunD for Order #881   "',
    action: "Preserves spaces & mixed case",
  },
  {
    num: "Stage 2",
    label: ".strip() Whitespace Trim",
    code: "clean = raw.strip()",
    result: '"RefunD for Order #881"',
    action: "Trims outer spaces; interior remains",
  },
  {
    num: "Stage 3",
    label: ".lower() Normalization",
    code: "clean = clean.lower()",
    result: '"refund for order #881"',
    action: "Consistent lowercase casing",
  },
  {
    num: "Stage 4",
    label: 'f"..." Prompt Injection',
    code: 'prompt = f"Intent: {clean}"',
    result: '"Intent: refund for order #881"',
    action: "Interpolates clean value into template",
  },
];

export function StringPipelineVisual() {
  const [selectedStage, setSelectedStage] = useState<number>(0);

  return (
    <div
      className={styles.pipelineContainer}
      aria-label="String Processing Pipeline Diagram"
    >
      <div className={styles.pipelineHeader}>
        <h3 className={styles.pipelineTitle}>
          String Pipeline: The Immutability Chain
        </h3>
        <span className={styles.pipelineBadge}>
          Every method returns a new object
        </span>
      </div>

      <div className={styles.stagesFlow} role="list">
        {STAGES.map((st, idx) => {
          const isSelected = selectedStage === idx;
          return (
            <div
              key={st.num}
              role="listitem"
              className={styles.stageCard}
              style={{
                borderColor: isSelected ? "var(--accent)" : "var(--line)",
                boxShadow: isSelected ? "0 0 0 2px var(--accent-soft)" : "none",
                cursor: "pointer",
              }}
              onClick={() => setSelectedStage(idx)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedStage(idx);
                }
              }}
              tabIndex={0}
              aria-label={`${st.num}: ${st.label}`}
              aria-current={isSelected ? "step" : undefined}
            >
              <span className={styles.stageNum}>{st.num}</span>
              <p className={styles.stageLabel}>{st.label}</p>
              <div className={styles.stageContent}>{st.result}</div>
              <div className={styles.stageAction}>{st.action}</div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: "1rem",
          padding: "0.75rem 1rem",
          background: "var(--canvas)",
          border: "1px solid var(--line)",
          borderRadius: "var(--radius-sm, 4px)",
          fontSize: "0.85rem",
        }}
      >
        <strong>Selected Code: </strong>
        <code style={{ color: "var(--accent)", fontWeight: 600 }}>
          {STAGES[selectedStage].code}
        </code>
        <div style={{ color: "var(--muted)", marginTop: "0.25rem" }}>
          Notice how the variable names are reassigned. Python never modifies
          the original string in place!
        </div>
      </div>
    </div>
  );
}
