"use client";

import { useState } from "react";
import { MODEL_PROFILES, type ModelId } from "./models";
import styles from "./lesson.module.css";

interface Scenario {
  id: string;
  number: number;
  title: string;
  description: string;
  answer: ModelId;
  feedback: Record<ModelId, string>;
}

const SCENARIOS: Scenario[] = [
  {
    id: "search-helper",
    number: 1,
    title: "Live search-bar spelling helper",
    description:
      "Cedar Bookshop’s public website fixes typos in 5-word book searches. It runs thousands of times a day on a tight budget and must reply in under 1 second.",
    answer: "quick-lite",
    feedback: {
      "quick-lite":
        "Match. No hard privacy or length limit blocks cloud models here, and this simple high-volume job needs under-1-second speed and very low cost.",
      "deep-think":
        "Not a match. Deep-Think takes several seconds per reply, which breaks the under-1-second requirement, and its high cost adds up across thousands of daily searches.",
      "long-read":
        "Not a match. Long-Read has medium speed (a few seconds), which misses the under-1-second limit, and its huge context window is unneeded for 5-word queries.",
      "local-safe":
        "Not a match. Local-Safe runs at medium speed on one office computer, so it cannot meet the under-1-second limit for thousands of live website visitors.",
    },
  },
  {
    id: "supplier-dispute",
    number: 2,
    title: "Reply to a disputed supplier invoice",
    description:
      "Maya needs one careful email reconciling three conflicting discount rules from a 2-page supplier invoice (no restricted personal data). A medium-capability model missed the hidden conflict in a test; waiting 15 seconds for this single email is fine.",
    answer: "deep-think",
    feedback: {
      "quick-lite":
        "Not a match. Quick-Lite only has basic capability, and even a medium-capability model missed the conflicting discount rules here.",
      "deep-think":
        "Match. No hard privacy or length limit blocks it, and Deep-Think is the only profile with high capability for tricky multi-step reasoning. Extra seconds and one-off cost are fine here.",
      "long-read":
        "Not a match. Long-Read has medium capability and is not built for tricky multi-step reasoning, which already failed on a test of this dispute.",
      "local-safe":
        "Not a match. Local-Safe has medium capability, which is not enough for the conflicting rules here, and no privacy rule requires staying offline.",
    },
  },
  {
    id: "distributor-contract",
    number: 3,
    title: "200-page distributor agreement check",
    description:
      "Maya wants to find every return-fee exception across a 200-page supplier agreement and catalogue in a single request. The documents contain standard business terms with no restricted personal data.",
    answer: "long-read",
    feedback: {
      "quick-lite":
        "Not a match. Quick-Lite’s short context window only holds a few pages, so it fails the hard context limit for a 200-page packet.",
      "deep-think":
        "Not a match. Deep-Think’s medium context window holds up to about 20 pages, so it fails the hard context limit for a 200-page packet.",
      "long-read":
        "Match. Context size is the hard limit here: Long-Read is the only profile whose context window fits hundreds of pages in one request.",
      "local-safe":
        "Not a match. Local-Safe’s short-to-medium context window only holds a few pages, so it cannot read 200 pages in one request.",
    },
  },
  {
    id: "staff-records",
    number: 4,
    title: "Staff medical-leave and payroll summary",
    description:
      "Maya needs a plain summary of two pages of employee payroll and medical-leave notes. Bookshop policy strictly forbids sending staff personal records to any external cloud service.",
    answer: "local-safe",
    feedback: {
      "quick-lite":
        "Not a match. Quick-Lite is cloud-hosted, which sends text to an external provider and breaks the bookshop’s privacy rule.",
      "deep-think":
        "Not a match. Deep-Think is cloud-hosted, so it fails the hard privacy limit immediately—even though it has high capability.",
      "long-read":
        "Not a match. Long-Read is cloud-hosted, which violates the rule against sending staff records to external servers.",
      "local-safe":
        "Match. Privacy is a hard limit here. Local-Safe keeps text on-device, and its medium capability and short-to-medium context fit a two-page summary.",
    },
  },
  {
    id: "council-minutes",
    number: 5,
    title: "160-page public city-council minutes search",
    description:
      "A local community group wants to pull every mention of library opening hours from 160 pages of published public meeting minutes in one pass.",
    answer: "long-read",
    feedback: {
      "quick-lite":
        "Not a match. Quick-Lite only fits a few pages at once, so 160 pages exceeds its context window.",
      "deep-think":
        "Not a match. Deep-Think fits up to about 20 pages, so 160 pages exceeds its context window.",
      "long-read":
        "Match. The minutes are public, so privacy is not a blocker, and Long-Read is the only profile whose context window fits 160 pages in one request.",
      "local-safe":
        "Not a match. Local-Safe only fits a few pages at once, so it fails the hard context limit for 160 pages.",
    },
  },
  {
    id: "forum-tagger",
    number: 6,
    title: "Live topic tagger for a public community forum",
    description:
      "A public neighbourhood forum sorts one-sentence posts into four topics (Events, Recommendations, Questions, Notices). It handles thousands of posts a day on a small budget and must respond in under 1 second.",
    answer: "quick-lite",
    feedback: {
      "quick-lite":
        "Match. The posts are short and public, and Quick-Lite is the only profile fast enough (under 1 second) and low-cost enough for thousands of simple tags a day.",
      "deep-think":
        "Not a match. Deep-Think is too slow (several seconds) and too expensive for thousands of simple one-sentence tags a day.",
      "long-read":
        "Not a match. Long-Read takes a few seconds per reply and costs more than needed for one-sentence sorting.",
      "local-safe":
        "Not a match. Local-Safe runs at medium speed on one office computer, so it cannot meet the under-1-second live web requirement.",
    },
  },
];

export function ScenarioMatcher() {
  const [choices, setChoices] = useState<Partial<Record<string, ModelId>>>({});
  const [liveMessage, setLiveMessage] = useState("");

  const matchedCount = SCENARIOS.filter(
    (scenario) => choices[scenario.id] === scenario.answer,
  ).length;

  function handleSelect(scenario: Scenario, modelId: ModelId) {
    setChoices((prev) => ({ ...prev, [scenario.id]: modelId }));
    const model = MODEL_PROFILES.find((m) => m.id === modelId);
    setLiveMessage(
      `Task ${scenario.number} (${scenario.title}), ${model?.name ?? modelId}: ${scenario.feedback[modelId]}`,
    );
  }

  function handleReset() {
    setChoices({});
    setLiveMessage("All six tasks reset. Matched 0 of 6 tasks.");
  }

  return (
    <div className={styles.labWrap}>
      <ol className={styles.stepsList}>
        <li>
          Read the task and check for a <strong>hard limit</strong> first
          (privacy rules or document length).
        </li>
        <li>
          If more than one model passes, balance <strong>capability</strong>,{" "}
          <strong>speed</strong>, and <strong>cost</strong> for the job.
        </li>
        <li>
          Select a model for each task to see why it fits—or which stated
          constraint it breaks.
        </li>
      </ol>

      <details className={styles.refDetails}>
        <summary>Quick reference: the four invented model profiles</summary>
        <div className={styles.profileGrid}>
          {MODEL_PROFILES.map((model) => (
            <div className={styles.profileCard} key={model.id}>
              <div className={styles.profileHead}>
                <h3>{model.name}</h3>
                <p className="micro">{model.tagline}</p>
              </div>
              <dl className={styles.profileSpecs}>
                <div>
                  <dt>Capability</dt>
                  <dd>{model.capability}</dd>
                </div>
                <div>
                  <dt>Speed</dt>
                  <dd>{model.speed}</dd>
                </div>
                <div>
                  <dt>Cost</dt>
                  <dd>{model.cost}</dd>
                </div>
                <div>
                  <dt>Context</dt>
                  <dd>{model.context}</dd>
                </div>
                <div>
                  <dt>Privacy</dt>
                  <dd>{model.privacy}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </details>

      <div className={styles.labBar}>
        <span className={styles.score} data-testid="score">
          Matched {matchedCount} of {SCENARIOS.length} tasks
        </span>
        <button type="button" onClick={handleReset}>
          Reset
        </button>
      </div>

      <div className={styles.scenarioList}>
        {SCENARIOS.map((scenario) => {
          const picked = choices[scenario.id];
          const isCorrect = picked === scenario.answer;
          const feedbackId = `feedback-${scenario.id}`;
          return (
            <div
              className={styles.scenarioCard}
              key={scenario.id}
              data-testid="scenario"
            >
              <fieldset aria-describedby={picked ? feedbackId : undefined}>
                <legend>
                  Task {scenario.number}: {scenario.title}
                </legend>
                <p className={styles.scenarioDesc}>{scenario.description}</p>
                <div className={styles.optionList}>
                  {MODEL_PROFILES.map((model) => {
                    const selected = picked === model.id;
                    return (
                      <label
                        key={model.id}
                        className={`${styles.optionLabel} ${
                          selected ? styles.optionLabelSelected : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name={`scenario-${scenario.id}`}
                          value={model.id}
                          checked={selected}
                          onChange={() => handleSelect(scenario, model.id)}
                        />
                        <span className={styles.optionText}>
                          <span className={styles.optionName}>
                            {model.name}
                          </span>
                          <span className={styles.optionHint}>
                            {model.optionSummary}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
              {picked && (
                <div
                  id={feedbackId}
                  data-testid="item-feedback"
                  data-result={isCorrect ? "correct" : "retry"}
                  className={`${styles.feedbackBox} ${
                    isCorrect ? styles.feedbackOk : styles.feedbackRetry
                  }`}
                >
                  {scenario.feedback[picked]}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="visually-hidden"
      >
        {liveMessage}
      </div>

      <p className={`${styles.disclosure} micro`}>
        <strong>Simulation note:</strong> These four model profiles and timings
        are invented for this lesson—not real products, live prices, or
        benchmarks. Real providers also offer options between local and public
        cloud, such as enterprise plans with stricter data-handling terms.
      </p>
    </div>
  );
}
