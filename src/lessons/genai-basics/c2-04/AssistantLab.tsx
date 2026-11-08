"use client";

import { useState } from "react";
import styles from "./lesson.module.css";

interface Scenario {
  id: string;
  title: string;
  category: string;
  prompt: string;
  options: {
    id: "A" | "B";
    type: "base" | "assistant";
    text: string;
    why: string;
  }[];
  wrapperPrompt: string;
  wrapperBaseOutput: string;
  tokensView: {
    userTokens: string;
    assistantTokens: string;
  };
}

const SCENARIOS: Scenario[] = [
  {
    id: "recipe",
    title: "1. Scrambled eggs recipe",
    category: "Step-by-step instruction",
    prompt: "Give me a simple recipe for scrambled eggs.",
    options: [
      {
        id: "A",
        type: "base",
        text: "Give me a simple recipe for pancakes.\nGive me a simple recipe for French toast.\nGive me a simple recipe for breakfast burritos.\nGive me a simple recipe for waffles.",
        why: "Pattern continuation: The raw base model treated your prompt as line 1 of an online FAQ or breakfast recipe index. Instead of answering, it continued predicting similar titles.",
      },
      {
        id: "B",
        type: "assistant",
        text: "Here is a quick recipe for soft scrambled eggs:\n\n1. Beat 2 eggs with a pinch of salt.\n2. Melt 1 tbsp butter in a non-stick pan over low heat.\n3. Pour in eggs, gently stirring until soft curds form.\n4. Remove from heat immediately and serve.",
        why: "Instruction-following: The assistant recognized the prompt as an instruction directed to it, adopted the helper persona, and delivered a clear recipe.",
      },
    ],
    wrapperPrompt:
      "You are a helpful AI assistant. Answer: Give me a simple recipe for scrambled eggs.",
    wrapperBaseOutput:
      "You are a helpful AI assistant. Answer: Give me a simple recipe for scrambled eggs.\nAnswer: Give me a simple recipe for pancakes.\nAnswer: Give me a simple recipe for French toast.",
    tokensView: {
      userTokens:
        "<|start_header_id|>user<|end_header_id|>\nGive me a simple recipe for scrambled eggs.<|eot_id|>",
      assistantTokens:
        "<|start_header_id|>assistant<|end_header_id|>\nHere is a quick recipe...",
    },
  },
  {
    id: "code",
    title: "2. Python dictionary",
    category: "Definition & constraint",
    prompt: "Explain what a Python dictionary is in one sentence.",
    options: [
      {
        id: "A",
        type: "assistant",
        text: "A Python dictionary is a built-in data structure that stores key-value pairs, enabling fast lookup by key rather than sequential index.",
        why: "Constraint adherence: The assistant provided the definition while strictly respecting the 'in one sentence' constraint.",
      },
      {
        id: "B",
        type: "base",
        text: "Question 4: What is a tuple in Python? (3 marks)\nQuestion 5: Write a function to reverse a string. (5 marks)\nQuestion 6: Explain list comprehensions. (4 marks)\nTotal marks for Section B: 20 marks.",
        why: "Exam paper pattern: The raw base model recognized the phrasing from computer science test papers and generated subsequent exam questions.",
      },
    ],
    wrapperPrompt:
      "System: You are an AI tutor.\nUser: Explain what a Python dictionary is in one sentence.",
    wrapperBaseOutput:
      "System: You are an AI tutor.\nUser: Explain what a Python dictionary is in one sentence.\nUser: Explain what a Python list is in one sentence.\nUser: Explain what a set is in one sentence.",
    tokensView: {
      userTokens:
        "<|start_header_id|>user<|end_header_id|>\nExplain what a Python dictionary is in one sentence.<|eot_id|>",
      assistantTokens:
        "<|start_header_id|>assistant<|end_header_id|>\nA Python dictionary is...",
    },
  },
  {
    id: "email",
    title: "3. Decline meeting",
    category: "Polite workplace note",
    prompt: "Draft a polite 2-sentence note declining a meeting invitation.",
    options: [
      {
        id: "A",
        type: "base",
        text: "Subject: Team Sync Agenda\n\nHi everyone,\nPlease review the attached slide deck before our sync on Thursday at 10 AM. Let me know if anyone has additions to the agenda.\n\nBest regards,\nProject Team",
        why: "Context latching: The raw base model saw words like 'meeting invitation' and auto-completed a generic corporate calendar announcement from the web.",
      },
      {
        id: "B",
        type: "assistant",
        text: "Thank you for the invitation, but unfortunately I have a scheduling conflict and won't be able to attend. I hope the meeting goes smoothly and look forward to catching up soon.",
        why: "Task fulfillment: The assistant carried out the specific action requested (declining politely) and fulfilled the 2-sentence limit.",
      },
    ],
    wrapperPrompt:
      "Instruction: Draft a polite 2-sentence note declining a meeting invitation.",
    wrapperBaseOutput:
      "Instruction: Draft a polite 2-sentence note declining a meeting invitation.\nInstruction: Draft a polite note asking for a deadline extension.\nInstruction: Draft an email introducing a new team member.",
    tokensView: {
      userTokens:
        "<|start_header_id|>user<|end_header_id|>\nDraft a polite 2-sentence note declining a meeting invitation.<|eot_id|>",
      assistantTokens:
        "<|start_header_id|>assistant<|end_header_id|>\nThank you for the invitation...",
    },
  },
];

export function AssistantLab() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<"A" | "B" | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showWrapper, setShowWrapper] = useState(false);
  const [showTokens, setShowTokens] = useState(false);

  const scenario = SCENARIOS[scenarioIndex];
  const assistantOption = scenario.options.find(
    (opt) => opt.type === "assistant",
  )!;
  const isCorrect = selectedOption === assistantOption.id;

  const handleSelectScenario = (index: number) => {
    setScenarioIndex(index);
    setSelectedOption(null);
    setSubmitted(false);
    setShowWrapper(false);
    setShowTokens(false);
  };

  const handleSubmit = () => {
    if (selectedOption) {
      setSubmitted(true);
    }
  };

  const handleReset = () => {
    setSelectedOption(null);
    setSubmitted(false);
  };

  return (
    <div className={styles.labContainer}>
      <div className={styles.scenarioBar}>
        <span className={styles.scenarioLabel}>Scenarios:</span>
        {SCENARIOS.map((sc, i) => (
          <button
            key={sc.id}
            type="button"
            className={styles.scenarioBtn}
            aria-pressed={scenarioIndex === i}
            onClick={() => handleSelectScenario(i)}
          >
            {sc.title}
          </button>
        ))}
      </div>

      <div className={styles.promptCard}>
        <div className={styles.promptMeta}>
          <span>Prompt under test</span>
          <span>{scenario.category}</span>
        </div>
        <p className={styles.promptText}>“{scenario.prompt}”</p>
      </div>

      <p className={styles.instructions}>
        Two models were given this prompt. One is a raw{" "}
        <strong>base model</strong> (trained only on web next-token prediction).
        The other is an <strong>instruction-tuned assistant</strong>. Which
        completion came from the assistant?
      </p>

      <div className={styles.comparisonGrid}>
        {scenario.options.map((option) => {
          const isSelected = selectedOption === option.id;
          let cardStateClass = "";
          if (isSelected && !submitted) cardStateClass = styles.cardSelected;
          if (submitted) {
            if (option.type === "assistant") {
              cardStateClass = styles.cardCorrect;
            } else if (isSelected) {
              cardStateClass = styles.cardIncorrect;
            }
          }

          return (
            <div
              key={option.id}
              className={`${styles.card} ${cardStateClass}`}
              data-testid={`option-${option.id}`}
            >
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>Option {option.id}</span>
                {submitted && (
                  <span
                    className={`${styles.badge} ${
                      option.type === "assistant"
                        ? styles.badgeAssistant
                        : styles.badgeBase
                    }`}
                  >
                    {option.type === "assistant"
                      ? "Instruction-Tuned Assistant"
                      : "Raw Base Model"}
                  </span>
                )}
              </div>

              <div className={styles.completion}>{option.text}</div>

              <div className={styles.cardActions}>
                <button
                  type="button"
                  className={styles.selectBtn}
                  aria-pressed={isSelected}
                  disabled={submitted}
                  onClick={() => setSelectedOption(option.id)}
                >
                  {isSelected
                    ? `✓ Selected as Assistant`
                    : `Choose Option ${option.id} as Assistant`}
                </button>
              </div>

              {submitted && (
                <div className={styles.explanationBox}>
                  <strong>Why it generated this:</strong>
                  {option.why}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.labControls}>
        <div className={styles.buttonGroup}>
          {!submitted ? (
            <button
              type="button"
              className={styles.primaryBtn}
              disabled={!selectedOption}
              onClick={handleSubmit}
            >
              Check guess →
            </button>
          ) : (
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={handleReset}
            >
              Try again
            </button>
          )}

          <button
            type="button"
            className={styles.secondaryBtn}
            aria-pressed={showWrapper}
            onClick={() => setShowWrapper((prev) => !prev)}
          >
            {showWrapper ? "Hide prompt wrapper" : "Try prompt wrapper"}
          </button>

          <button
            type="button"
            className={styles.secondaryBtn}
            aria-pressed={showTokens}
            onClick={() => setShowTokens((prev) => !prev)}
          >
            {showTokens ? "Hide turn tokens" : "Inspect turn tokens"}
          </button>
        </div>
      </div>

      {submitted && (
        <div
          role="status"
          aria-live="polite"
          className={`${styles.statusMessage} ${
            isCorrect ? styles.statusSuccess : styles.statusTryAgain
          }`}
        >
          {isCorrect
            ? `✓ Correct! Option ${assistantOption.id} is the instruction-tuned assistant. Notice how it treats your prompt as a command, while the base model treats it as text to continue.`
            : `↻ Not quite! Option ${assistantOption.id} is the assistant. Option ${selectedOption} continued an internet document pattern instead of following the instruction.`}
        </div>
      )}

      {showWrapper && (
        <div className={styles.wrapperPanel} data-testid="wrapper-panel">
          <h3 className={styles.wrapperTitle}>
            What happens if you only add a prompt wrapper?
          </h3>
          <p className={styles.wrapperDesc}>
            Some believe adding a system prompt like{" "}
            <em>“You are a helpful assistant”</em> turns a base model into an
            assistant without training. Here is what a raw base model actually
            does with that prefix:
          </p>
          <div className={styles.tokenPreview}>
            {scenario.wrapperBaseOutput}
          </div>
          <p className={styles.wrapperDesc}>
            The raw model has not learned conversational roles in its weights.
            It simply sees another repetitive pattern and continues generating
            more instructions or prompt prefixes!
          </p>
        </div>
      )}

      {showTokens && (
        <div className={styles.wrapperPanel} data-testid="tokens-panel">
          <h3 className={styles.wrapperTitle}>
            How instruction-tuned models represent dialogue turns
          </h3>
          <p className={styles.wrapperDesc}>
            Instruction tuning uses special delimiter tokens to mark speaker
            boundaries so the model learns when the user is speaking and when it
            must respond as the assistant:
          </p>
          <div className={styles.tokenPreview}>
            <div>
              <span className={styles.specialToken}>
                &lt;|start_header_id|&gt;
              </span>
              user
              <span className={styles.specialToken}>
                &lt;|end_header_id|&gt;
              </span>
            </div>
            <div>{scenario.prompt}</div>
            <div>
              <span className={styles.specialToken}>&lt;|eot_id|&gt;</span>
            </div>
            <div>
              <span className={styles.specialToken}>
                &lt;|start_header_id|&gt;
              </span>
              assistant
              <span className={styles.specialToken}>
                &lt;|end_header_id|&gt;
              </span>
            </div>
            <div style={{ color: "var(--accent)" }}>
              [Model generates its answer here]
            </div>
            <div>
              <span className={styles.specialToken}>&lt;|eot_id|&gt;</span>
            </div>
          </div>
          <p className={styles.wrapperDesc}>
            These delimiter tokens prevent the model from hallucinating a
            continuation of the user’s sentence and signal that an assistant
            reply is required.
          </p>
        </div>
      )}

      <div className={styles.disclosure}>
        <strong>Simulation disclosure:</strong> Sample completions are
        illustrative examples of typical raw base model patterns (list
        continuation, exam questions, document completion) versus
        instruction-tuned conversational models (SFT). Exact continuations vary
        across model checkpoints, temperature, and sampling seeds.
      </div>
    </div>
  );
}
