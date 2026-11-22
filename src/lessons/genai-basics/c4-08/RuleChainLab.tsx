"use client";

import { useState } from "react";
import styles from "./lesson.module.css";

type PastryId = "croissant" | "brownie" | "muffin";

type FactDef = {
  id: string;
  label: string;
};

type PastrySpec = {
  id: PastryId;
  name: string;
  facts: FactDef[];
};

const PASTRIES: Record<PastryId, PastrySpec> = {
  croissant: {
    id: "croissant",
    name: "Almond Croissant",
    facts: [
      { id: "c1", label: "Almond Croissant — contains → Almond Paste" },
      { id: "c2", label: "Almond Paste — made from → Almonds" },
      { id: "c3", label: "Almonds — is a → Tree Nut" },
    ],
  },
  brownie: {
    id: "brownie",
    name: "Walnut Brownie",
    facts: [
      { id: "b1", label: "Walnut Brownie — contains → Walnuts" },
      { id: "b2", label: "Walnuts — is a → Tree Nut" },
    ],
  },
  muffin: {
    id: "muffin",
    name: "Oat Muffin",
    facts: [
      { id: "m1", label: "Oat Muffin — contains → Rolled Oats" },
      { id: "m2", label: "Rolled Oats — made from → Oats" },
      { id: "m3", label: "Oats — is a → Grain" },
    ],
  },
};

function defaultFactState(pastryId: PastryId): Record<string, boolean> {
  const entries = PASTRIES[pastryId].facts.map((f) => [f.id, true] as const);
  return Object.fromEntries(entries);
}

type TraceResult = {
  flagged: boolean;
  headline: string;
  steps: string[];
  summary: string;
};

function runEngine(
  pastryId: PastryId,
  enabledFacts: Record<string, boolean>,
  ruleAEnabled: boolean,
  ruleBEnabled: boolean,
): TraceResult {
  if (pastryId === "croissant") {
    const hasC1 = Boolean(enabledFacts.c1);
    const hasC2 = Boolean(enabledFacts.c2);
    const hasC3 = Boolean(enabledFacts.c3);
    const steps: string[] = [];

    let derivedContainsAlmonds = false;
    if (!ruleAEnabled) {
      steps.push(
        "Rule A (Unpack ingredient) is off, so Almond Paste is not unpacked into Almonds.",
      );
    } else if (hasC1 && hasC2) {
      derivedContainsAlmonds = true;
      steps.push(
        "Rule A applied: from “Almond Croissant contains Almond Paste” and “Almond Paste made from Almonds”, derived new fact: “Almond Croissant contains Almonds”.",
      );
    } else {
      const missing: string[] = [];
      if (!hasC1) missing.push("“Almond Croissant contains Almond Paste”");
      if (!hasC2) missing.push("“Almond Paste made from Almonds”");
      steps.push(
        `Rule A stopped: missing stored ${missing.length > 1 ? "facts" : "fact"} ${missing.join(" and ")}, so no derived fact was created.`,
      );
    }

    if (!ruleBEnabled) {
      steps.push(
        "Rule B (Tree-nut warning) is off, so no tree-nut check was applied.",
      );
      return {
        flagged: false,
        headline: "Tree-nut check disabled",
        steps,
        summary:
          "Trace stopped because Rule B is disabled. Enable Rule B to check for tree nuts.",
      };
    }

    if (derivedContainsAlmonds && hasC3) {
      steps.push(
        "Rule B applied: combined derived fact “Almond Croissant contains Almonds” with stored fact “Almonds is a Tree Nut” → Warning: Contains tree nuts.",
      );
      return {
        flagged: true,
        headline: "Flagged: Contains tree nuts",
        steps,
        summary:
          "Two rules chained together: Rule A derived the hidden ingredient, and Rule B matched it against the Tree Nut category.",
      };
    }

    if (derivedContainsAlmonds && !hasC3) {
      steps.push(
        "Rule B stopped: “Almond Croissant contains Almonds” was derived, but stored fact “Almonds is a Tree Nut” is off.",
      );
    } else {
      steps.push(
        "Rule B did not apply: no direct or derived ingredient on Almond Croissant matched an enabled Tree Nut fact.",
      );
    }

    return {
      flagged: false,
      headline: "No tree-nut flag from the available facts",
      steps,
      summary:
        "The chain broke before Rule B could match. A missing stored fact or disabled rule hides the allergen from the engine.",
    };
  }

  if (pastryId === "brownie") {
    const hasB1 = Boolean(enabledFacts.b1);
    const hasB2 = Boolean(enabledFacts.b2);
    const steps: string[] = [];

    steps.push(
      ruleAEnabled
        ? "Rule A checked: no “made from” link applies to Walnut Brownie."
        : "Rule A is off.",
    );

    if (!ruleBEnabled) {
      steps.push(
        "Rule B (Tree-nut warning) is off, so no tree-nut check was applied.",
      );
      return {
        flagged: false,
        headline: "Tree-nut check disabled",
        steps,
        summary:
          "Trace stopped because Rule B is disabled. Enable Rule B to check for tree nuts.",
      };
    }

    if (hasB1 && hasB2) {
      steps.push(
        "Rule B applied directly: combined “Walnut Brownie contains Walnuts” with “Walnuts is a Tree Nut” → Warning: Contains tree nuts.",
      );
      return {
        flagged: true,
        headline: "Flagged: Contains tree nuts",
        steps,
        summary:
          "One rule was enough because Walnuts is linked directly to Walnut Brownie.",
      };
    }

    const missing: string[] = [];
    if (!hasB1) missing.push("“Walnut Brownie contains Walnuts”");
    if (!hasB2) missing.push("“Walnuts is a Tree Nut”");
    steps.push(
      `Rule B stopped: missing stored ${missing.length > 1 ? "facts" : "fact"} ${missing.join(" and ")}.`,
    );
    return {
      flagged: false,
      headline: "No tree-nut flag from the available facts",
      steps,
      summary:
        "Without both stored facts enabled, Rule B cannot match Walnut Brownie.",
    };
  }

  // Oat Muffin
  const hasM1 = Boolean(enabledFacts.m1);
  const hasM2 = Boolean(enabledFacts.m2);
  const hasM3 = Boolean(enabledFacts.m3);
  const steps: string[] = [];

  let derivedContainsOats = false;
  if (!ruleAEnabled) {
    steps.push(
      "Rule A (Unpack ingredient) is off, so Rolled Oats is not unpacked into Oats.",
    );
  } else if (hasM1 && hasM2) {
    derivedContainsOats = true;
    steps.push(
      "Rule A applied: from “Oat Muffin contains Rolled Oats” and “Rolled Oats made from Oats”, derived new fact: “Oat Muffin contains Oats”.",
    );
  } else {
    const missing: string[] = [];
    if (!hasM1) missing.push("“Oat Muffin contains Rolled Oats”");
    if (!hasM2) missing.push("“Rolled Oats made from Oats”");
    steps.push(
      `Rule A stopped: missing stored ${missing.length > 1 ? "facts" : "fact"} ${missing.join(" and ")}, so no derived fact was created.`,
    );
  }

  if (!ruleBEnabled) {
    steps.push(
      "Rule B (Tree-nut warning) is off, so no tree-nut check was applied.",
    );
    return {
      flagged: false,
      headline: "Tree-nut check disabled",
      steps,
      summary: derivedContainsOats
        ? "Rule A derived “Oat Muffin contains Oats”, and Rule B is disabled so no tree-nut check ran."
        : "Rule A did not derive Oats, and Rule B is disabled so no tree-nut check ran.",
    };
  }

  if (derivedContainsOats && hasM3) {
    steps.push(
      "Rule B checked: no enabled ingredient on Oat Muffin has an “is a Tree Nut” fact (the enabled record lists “Oats is a Grain”), so Rule B did not apply.",
    );
    return {
      flagged: false,
      headline: "No tree-nut flag from the available facts",
      steps,
      summary:
        "Rule A derived “Oat Muffin contains Oats”. Rule B found no enabled Tree Nut classification for its ingredients (Oats is recorded as a Grain).",
    };
  }

  steps.push(
    "Rule B checked: no enabled direct or derived ingredient on Oat Muffin has an “is a Tree Nut” fact.",
  );
  return {
    flagged: false,
    headline: "No tree-nut flag from the available facts",
    steps,
    summary: derivedContainsOats
      ? "Rule A derived “Oat Muffin contains Oats”. Rule B found no enabled Tree Nut classification for its ingredients."
      : "Rule A did not derive Oats. Rule B found no enabled Tree Nut classification for its ingredients.",
  };
}

export function RuleChainLab() {
  const [pastryId, setPastryId] = useState<PastryId>("croissant");
  const [enabledFacts, setEnabledFacts] = useState<Record<string, boolean>>(
    () => defaultFactState("croissant"),
  );
  const [ruleAEnabled, setRuleAEnabled] = useState(true);
  const [ruleBEnabled, setRuleBEnabled] = useState(true);

  const pastry = PASTRIES[pastryId];
  const result = runEngine(pastryId, enabledFacts, ruleAEnabled, ruleBEnabled);

  function selectPastry(nextId: PastryId) {
    if (nextId === pastryId) return;
    setPastryId(nextId);
    setEnabledFacts(defaultFactState(nextId));
  }

  function toggleFact(factId: string) {
    setEnabledFacts((prev) => ({ ...prev, [factId]: !prev[factId] }));
  }

  function resetAll() {
    setPastryId("croissant");
    setEnabledFacts(defaultFactState("croissant"));
    setRuleAEnabled(true);
    setRuleBEnabled(true);
  }

  return (
    <div className={styles.labBox} data-testid="rule-chain-lab">
      <div className={styles.labHeader}>
        <strong>Toy rule engine: Mina’s recipe checker</strong>
        <button type="button" onClick={resetAll}>
          Reset rule engine
        </button>
      </div>

      <div className={styles.controlGroup}>
        <span className={styles.controlLabel}>1. Choose a pastry</span>
        <div className={styles.buttonRow}>
          {(["croissant", "brownie", "muffin"] as const).map((id) => (
            <button
              key={id}
              type="button"
              className={styles.presetBtn}
              aria-pressed={pastryId === id}
              onClick={() => selectPastry(id)}
            >
              {PASTRIES[id].name}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.controlGroup}>
        <span className={styles.controlLabel}>
          2. Stored facts for {pastry.name} (toggle to simulate missing records)
        </span>
        <div className={styles.factGrid}>
          {pastry.facts.map((fact) => {
            const on = Boolean(enabledFacts[fact.id]);
            return (
              <button
                key={fact.id}
                type="button"
                className={styles.factToggle}
                aria-pressed={on}
                onClick={() => toggleFact(fact.id)}
              >
                <span>{fact.label}</span>
                <span className={styles.factState}>
                  {on ? "Included" : "Removed"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.controlGroup}>
        <span className={styles.controlLabel}>
          3. Enabled rules (recomputes immediately)
        </span>
        <div className={styles.buttonRow}>
          <button
            type="button"
            className={styles.toggleBtn}
            aria-pressed={ruleAEnabled}
            onClick={() => setRuleAEnabled((v) => !v)}
          >
            Rule A: Unpack “made from” ingredients
          </button>
          <button
            type="button"
            className={styles.toggleBtn}
            aria-pressed={ruleBEnabled}
            onClick={() => setRuleBEnabled((v) => !v)}
          >
            Rule B: Flag if ingredient is a Tree Nut
          </button>
        </div>
      </div>

      <div className={styles.resultBox}>
        <div className={styles.resultHeader}>
          <strong>Reasoning trace</strong>
          <span
            className={`${styles.badge} ${
              result.flagged ? styles.badgeWarn : ""
            }`}
            data-testid="engine-verdict"
          >
            {result.headline}
          </span>
        </div>

        <ol className={styles.traceList} data-testid="trace-steps">
          {result.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>

        <p
          className="micro"
          role="status"
          aria-live="polite"
          data-testid="lab-status"
        >
          {result.summary}
        </p>

        <p className={`micro ${styles.disclaimer}`}>
          Simplified toy engine for learning only—not a real allergen safety
          tool. It only checks the stored facts toggled on above and cannot
          detect unrecorded ingredients or cross-contact (ingredient transfer
          through shared kitchen equipment).
        </p>
      </div>
    </div>
  );
}
