"use client";

import { useId, useState } from "react";
import { TRAINING_EMAILS } from "./data";
import styles from "./lesson.module.css";

type LabMode = "spot" | "trace";

interface SpotOption {
  id: string;
  label: string;
  description: string;
  isTarget: boolean;
  feedback: string;
}

interface SpotScenario {
  id: string;
  name: string;
  prompt: string;
  options: SpotOption[];
}

const SPOT_SCENARIOS: SpotScenario[] = [
  {
    id: "spam",
    name: "Sam's spam filter",
    prompt:
      "Prediction time: as each new email arrives in Sam's inbox, the filter must decide whether to move it to the junk folder or keep it in the inbox. The filter supplies the three arrival clues to the model. Which item is the target?",
    options: [
      {
        id: "known-sender",
        label: "Known sender?",
        description:
          "Checked in the centre's address book when the email arrives.",
        isTarget: false,
        feedback:
          "Known sender? is an input—it is checked on arrival and supplied to the model as a clue.",
      },
      {
        id: "unknown-link",
        label: "Unknown link?",
        description: "Spotted by checking the web links inside the email.",
        isTarget: false,
        feedback:
          "Unknown link? is an input—the filter inspects links on arrival and supplies that clue to the model.",
      },
      {
        id: "urgent-payment",
        label: "Urgent payment?",
        description: "Spotted from the wording of the incoming message.",
        isTarget: false,
        feedback:
          "Urgent payment? is an input—it is a clue taken from the message text and supplied to the model at prediction time.",
      },
      {
        id: "spam-target",
        label: "Spam or Not spam",
        description:
          "The category volunteers recorded on past emails and the model predicts for new ones.",
        isTarget: true,
        feedback:
          "Correct. Spam or Not spam is the target: volunteers supplied it for past emails, and the model predicts it for new ones. The other three items are supplied as inputs.",
      },
    ],
  },
  {
    id: "rent",
    name: "Apartment rent estimate",
    prompt:
      "Prediction time: before posting a new flat listing, an estimator suggests a fair monthly price by supplying three property details to a model trained on past listings. Which item is the target?",
    options: [
      {
        id: "floor-area",
        label: "Floor area",
        description: "Measured in square metres before listing.",
        isTarget: false,
        feedback:
          "Floor area is an input—it is known before the flat is listed and supplied to the model as a clue.",
      },
      {
        id: "rooms",
        label: "Number of rooms",
        description: "Counted before the flat is listed.",
        isTarget: false,
        feedback:
          "Number of rooms is an input—it is counted before listing and supplied to the model at prediction time.",
      },
      {
        id: "monthly-rent",
        label: "Monthly rent",
        description:
          "The price recorded in past listings (the model predicts a suggested price for a new flat).",
        isTarget: true,
        feedback:
          "Correct. Monthly rent recorded in past listings is the target (a number here), and the model outputs a predicted rent for the new flat. Floor area, number of rooms, and neighbourhood are supplied as inputs.",
      },
      {
        id: "neighbourhood",
        label: "Neighbourhood",
        description: "Known from the flat's street address.",
        isTarget: false,
        feedback:
          "Neighbourhood is an input—it comes from the address and is supplied to the model before predicting.",
      },
    ],
  },
  {
    id: "parcel",
    name: "Parcel delivery check",
    prompt:
      "Prediction time: at dispatch, before the van leaves the warehouse, a courier system supplies three dispatch details to a model to flag parcels that may miss their promised delivery window. Which item is the target?",
    options: [
      {
        id: "distance",
        label: "Distance to destination",
        description: "Known at dispatch from the shipping address.",
        isTarget: false,
        feedback:
          "Distance to destination is an input—it is known at dispatch and supplied to the model before the van leaves.",
      },
      {
        id: "weight",
        label: "Parcel weight",
        description: "Weighed at the warehouse before dispatch.",
        isTarget: false,
        feedback:
          "Parcel weight is an input—it is measured at the warehouse and supplied to the model at dispatch.",
      },
      {
        id: "weather",
        label: "Weather forecast along route",
        description: "Checked at dispatch before the van leaves.",
        isTarget: false,
        feedback:
          "Weather forecast along route is an input—it is checked at dispatch and supplied to the model as a clue.",
      },
      {
        id: "arrived-late",
        label: "Arrived late (yes or no)",
        description: "The eventual delivery outcome recorded after drop-off.",
        isTarget: true,
        feedback:
          "Correct. Arrived late (yes or no) is the target: it is recorded after past deliveries and unknown at dispatch when the model makes its prediction. The other three items are supplied as inputs.",
      },
    ],
  },
];

interface EmailPreset {
  id: string;
  label: string;
  summary: string;
  knownSender: boolean;
  unknownLink: boolean;
  urgentPayment: boolean;
}

const EMAIL_PRESETS: EmailPreset[] = [
  {
    id: "neighbour",
    label: "New neighbour asking hours",
    summary:
      "An unfamiliar address asks when the community centre opens on Saturday, with no links and no payment request.",
    knownSender: false,
    unknownLink: false,
    urgentPayment: false,
  },
  {
    id: "invoice",
    label: "Fake urgent invoice",
    summary:
      "An unfamiliar address links to an unrecognised website and demands immediate payment.",
    knownSender: false,
    unknownLink: true,
    urgentPayment: true,
  },
  {
    id: "newsletter",
    label: "Club newsletter with unfamiliar link",
    summary:
      "A known local club sends a message containing a link to a new ticket site, with no urgent payment demand.",
    knownSender: true,
    unknownLink: true,
    urgentPayment: false,
  },
];

export function SupervisedLab() {
  const [mode, setMode] = useState<LabMode>("spot");

  // Tab 1 state: Spot inputs & target
  const [scenarioId, setScenarioId] = useState<string>("spam");
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  // Tab 2 state: Trace a new email
  const [knownSender, setKnownSender] = useState<boolean>(false);
  const [unknownLink, setUnknownLink] = useState<boolean>(false);
  const [urgentPayment, setUrgentPayment] = useState<boolean>(false);

  const spotFeedbackId = useId();
  const traceFeedbackId = useId();

  const scenario =
    SPOT_SCENARIOS.find((s) => s.id === scenarioId) ?? SPOT_SCENARIOS[0];
  const selectedOption =
    scenario.options.find((o) => o.id === selectedOptionId) ?? null;

  // Compute nearest-match vote for Tab 2
  const scoredRows = TRAINING_EMAILS.map((row) => {
    const matches =
      (row.knownSender === knownSender ? 1 : 0) +
      (row.unknownLink === unknownLink ? 1 : 0) +
      (row.urgentPayment === urgentPayment ? 1 : 0);
    return { ...row, matches };
  });
  const maxMatches = Math.max(...scoredRows.map((r) => r.matches));
  const closestRows = scoredRows.filter((r) => r.matches === maxMatches);
  const spamVotes = closestRows.filter((r) => r.target === "Spam").length;
  const notSpamVotes = closestRows.length - spamVotes;
  const prediction: "Spam" | "Not spam" =
    spamVotes > notSpamVotes ? "Spam" : "Not spam";

  const activePreset = EMAIL_PRESETS.find(
    (p) =>
      p.knownSender === knownSender &&
      p.unknownLink === unknownLink &&
      p.urgentPayment === urgentPayment,
  );

  function handleReset() {
    setMode("spot");
    setScenarioId("spam");
    setSelectedOptionId(null);
    setKnownSender(false);
    setUnknownLink(false);
    setUrgentPayment(false);
  }

  return (
    <div className={styles.labBox} data-testid="supervised-lab">
      <div className={styles.labHeader}>
        <div className={styles.buttonRow} role="group" aria-label="Lab mode">
          <button
            type="button"
            className={styles.modeBtn}
            aria-pressed={mode === "spot"}
            onClick={() => setMode("spot")}
          >
            1. Spot inputs &amp; target
          </button>
          <button
            type="button"
            className={styles.modeBtn}
            aria-pressed={mode === "trace"}
            onClick={() => setMode("trace")}
          >
            2. Trace a new email
          </button>
        </div>
        <button type="button" onClick={handleReset}>
          Reset walk-through
        </button>
      </div>

      {mode === "spot" ? (
        <div>
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Choose a task:</span>
            <div
              className={styles.buttonRow}
              role="group"
              aria-label="Choose a supervised learning task"
            >
              {SPOT_SCENARIOS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={styles.presetBtn}
                  aria-pressed={scenario.id === item.id}
                  onClick={() => {
                    setScenarioId(item.id);
                    setSelectedOptionId(null);
                  }}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <p id={`${spotFeedbackId}-prompt`} data-testid="spot-prompt">
            {scenario.prompt}
          </p>

          <div
            className={styles.attrGrid}
            role="group"
            aria-labelledby={`${spotFeedbackId}-prompt`}
            aria-describedby={spotFeedbackId}
          >
            {scenario.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              const solved = Boolean(selectedOption?.isTarget);
              return (
                <button
                  key={opt.id}
                  type="button"
                  className={styles.attrBtn}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedOptionId(opt.id)}
                >
                  <span>{opt.label}</span>
                  <span className={styles.attrMeta}>{opt.description}</span>
                  {solved && (
                    <span
                      className={`${styles.badge} ${
                        opt.isTarget ? styles.badgeGood : styles.badgeAccent
                      }`}
                    >
                      {opt.isTarget ? "Target" : "Input"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div
            id={spotFeedbackId}
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className={styles.feedbackBox}
            data-testid="spot-feedback"
          >
            <p>
              {selectedOption
                ? selectedOption.feedback
                : "Select one item above to check whether it is the target or an input."}
            </p>
          </div>
        </div>
      ) : (
        <div>
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>
              Pick a preset incoming email:
            </span>
            <div
              className={styles.buttonRow}
              role="group"
              aria-label="Preset incoming emails"
            >
              {EMAIL_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={styles.presetBtn}
                  aria-pressed={activePreset?.id === preset.id}
                  onClick={() => {
                    setKnownSender(preset.knownSender);
                    setUnknownLink(preset.unknownLink);
                    setUrgentPayment(preset.urgentPayment);
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            {activePreset && (
              <p className="micro" style={{ marginTop: 8, marginBottom: 0 }}>
                {activePreset.summary}
              </p>
            )}
          </div>

          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>
              Or toggle the new email’s three input clues:
            </span>
            <div
              className={styles.buttonRow}
              role="group"
              aria-label="New email input clues"
              aria-describedby={traceFeedbackId}
            >
              <button
                type="button"
                className={styles.clueBtn}
                aria-pressed={knownSender}
                onClick={() => setKnownSender((v) => !v)}
              >
                Known sender: {knownSender ? "Yes" : "No"}
              </button>
              <button
                type="button"
                className={styles.clueBtn}
                aria-pressed={unknownLink}
                onClick={() => setUnknownLink((v) => !v)}
              >
                Unknown link: {unknownLink ? "Yes" : "No"}
              </button>
              <button
                type="button"
                className={styles.clueBtn}
                aria-pressed={urgentPayment}
                onClick={() => setUrgentPayment((v) => !v)}
              >
                Urgent payment: {urgentPayment ? "Yes" : "No"}
              </button>
            </div>
          </div>

          <div
            id={traceFeedbackId}
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className={styles.resultSummary}
            data-testid="trace-prediction"
          >
            <span
              className={`${styles.badge} ${
                prediction === "Spam" ? styles.badgeWarn : styles.badgeGood
              }`}
            >
              Prediction: {prediction}
            </span>
            <p className="micro">
              Closest past emails ({maxMatches} of 3 clues matched):{" "}
              <strong>{closestRows.map((r) => r.id).join(", ")}</strong> —{" "}
              {prediction === "Spam"
                ? `${spamVotes} Spam vs ${notSpamVotes} Not spam`
                : `${notSpamVotes} Not spam vs ${spamVotes} Spam`}
              .
            </p>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th scope="col">Past email</th>
                  <th scope="col">Known sender?</th>
                  <th scope="col">Unknown link?</th>
                  <th scope="col">Urgent payment?</th>
                  <th scope="col">Target</th>
                  <th scope="col">Match</th>
                </tr>
              </thead>
              <tbody>
                {scoredRows.map((row) => {
                  const isClosest = row.matches === maxMatches;
                  return (
                    <tr
                      key={row.id}
                      className={isClosest ? styles.rowMatch : undefined}
                    >
                      <td>
                        <strong>{row.id}</strong>
                      </td>
                      <td>{row.knownSender ? "Yes" : "No"}</td>
                      <td>{row.unknownLink ? "Yes" : "No"}</td>
                      <td>{row.urgentPayment ? "Yes" : "No"}</td>
                      <td>
                        <span
                          className={`${styles.badge} ${
                            row.target === "Spam"
                              ? styles.badgeWarn
                              : styles.badgeGood
                          }`}
                        >
                          {row.target}
                        </span>
                      </td>
                      <td>
                        {row.matches}/3{isClosest ? " (vote)" : ""}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className={`micro ${styles.disclaimer}`}>
            <strong>Illustrative simulation:</strong> These six emails are
            invented, and this nearest-match vote is a simplified teaching rule
            where each highlighted past email casts one vote for its recorded
            target. Learned spam filters typically train on far more examples
            and adjust internal numbers rather than voting directly on six
            stored rows.
          </p>
        </div>
      )}
    </div>
  );
}
