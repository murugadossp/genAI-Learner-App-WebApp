"use client";

import { useState } from "react";
import styles from "./lesson.module.css";

type Mode = "hand-over" | "work-together" | "do-myself";

interface TaskItem {
  id: string;
  label: string;
  description: string;
  answer: Mode;
  feedback: Record<Mode, string>;
}

const MODE_OPTIONS: { value: Mode; label: string; hint: string }[] = [
  {
    value: "hand-over",
    label: "Hand over",
    hint: "AI does the pass; you do a quick check",
  },
  {
    value: "work-together",
    label: "Work together",
    hint: "AI drafts or summarizes; you verify and edit",
  },
  {
    value: "do-myself",
    label: "Do myself",
    hint: "Keep this off AI",
  },
];

const TASKS: TaskItem[] = [
  {
    id: "snacks",
    label: "Task 1: Snack shopping list",
    description:
      "Group Priya’s list of eight book-club snacks into familiar categories (fruit, baked goods, and drinks) so shopping is faster. She has all eight items in front of her, knows which category each belongs in, includes no private details, and is not practicing list-sorting.",
    answer: "hand-over",
    feedback: {
      "hand-over":
        "Right. Stakes are low, checking all eight items against familiar categories takes seconds, and no stop signal applies. Priya can hand this over and give the grouped list a quick check.",
      "work-together":
        "Not quite. Stakes are low here—a misplaced snack is harmless and spotted in seconds—so this fits Hand over (with a quick check) rather than a full back-and-forth.",
      "do-myself":
        "Not quite. No stop signal applies: the list is easy for Priya to check against familiar categories, nothing is private, and she is not practicing list-sorting. Handing it over with a quick check saves time safely.",
    },
  },
  {
    id: "flyer",
    label: "Task 2: Library open-house flyer",
    description:
      "Draft a public flyer for the library bulletin board announcing the club’s open-house night. A wrong date or room number would mislead visitors once printed, and Priya has the confirmed date, room number, and accessibility notes beside her to check every detail.",
    answer: "work-together",
    feedback: {
      "hand-over":
        "Not quite. Because a wrong date or room number would mislead visitors once printed, stakes are higher than a quick glance. Priya should work together with AI and verify every detail against her notes.",
      "work-together":
        "Right. Stakes are higher, but Priya has the confirmed details right beside her and nothing is private. AI can draft the wording while she checks every fact and edits the tone before printing.",
      "do-myself":
        "Not quite. Priya has a reliable source in front of her, the event details are public, and she is not practicing flyer writing as homework. Working together lets AI help with wording while she verifies every fact.",
    },
  },
  {
    id: "spanish",
    label: "Task 3: Spanish class homework",
    description:
      "Write a five-sentence paragraph in Spanish for Priya’s weekly language-class homework, where the assignment is to practice past-tense verbs on her own.",
    answer: "do-myself",
    feedback: {
      "hand-over":
        "Not quite. The whole point of this assignment is building Priya’s own Spanish skill. Handing it to AI skips the practice she wants.",
      "work-together":
        "Not quite. Even sharing the writing removes the solo verb practice the assignment is meant to build. Keep core skill practice off AI.",
      "do-myself":
        "Right. Building her own skill is a clear stop signal: doing the writing herself is the point of the homework.",
    },
  },
  {
    id: "notes",
    label: "Task 4: Casual snack ideas",
    description:
      "Turn Priya’s six rough one-line notes about casual snack ideas into a neat bullet list for her own notebook. Nothing private is in the notes, she is not practicing formatting, and she can scan the six lines in a few seconds.",
    answer: "hand-over",
    feedback: {
      "hand-over":
        "Right. Stakes are low, she can check the six lines in seconds, and no stop signal applies. Handing it over with a quick review fits well.",
      "work-together":
        "Not quite. A minor wording quirk in a personal notebook has very low stakes, so a quick check after handing it over is enough here.",
      "do-myself":
        "Not quite. Nothing is private, the result is easy to check against her six lines, and she is not practicing list formatting. Hand over with a quick check is a good fit.",
    },
  },
  {
    id: "policy",
    label: "Task 5: Room-rental policy summary",
    description:
      "Summarize a 10-page public community-center room-rental policy into five key rules for the book club. Missing a fee or cancellation deadline could cost the club its deposit, and Priya keeps the official policy open beside her to verify every rule before sharing.",
    answer: "work-together",
    feedback: {
      "hand-over":
        "Not quite. Losing a room deposit is a higher-stakes mistake, so a quick glance is not enough. Priya needs to verify every fee and deadline against the official policy.",
      "work-together":
        "Right. Stakes are higher, but Priya has the public official policy right beside her to check every rule, fee, and deadline. AI can draft a summary while she verifies and edits it.",
      "do-myself":
        "Not quite. Because the policy is public and open beside her, Priya can reliably check AI’s summary against the source instead of reading from scratch alone.",
    },
  },
  {
    id: "allergy",
    label: "Task 6: Unmarked homemade sauce",
    description:
      "Decide whether an unmarked homemade sauce is safe for a guest with a severe peanut allergy, when Priya has no ingredient list or recipe to check against.",
    answer: "do-myself",
    feedback: {
      "hand-over":
        "Not quite. Severe allergy safety is high stakes and AI cannot inspect the food or know how it was made. Keep this off AI and do not guess—skip serving the sauce unless both its ingredients and peanut cross-contact safety are reliably confirmed.",
      "work-together":
        "Not quite. Priya has no reliable source to check an AI answer against, and AI cannot inspect an unmarked dish. Keep this off AI and do not guess—skip serving it unless both ingredients and cross-contact safety are reliably confirmed.",
      "do-myself":
        "Right. Stakes are high and checking is hard with no ingredient list, so keep this off AI. That also does not mean guessing yourself: skip serving the unmarked sauce unless the maker reliably confirms both every ingredient and peanut cross-contact safety.",
    },
  },
];

export function TaskSorter() {
  const [choices, setChoices] = useState<Partial<Record<string, Mode>>>({});
  const [announcement, setAnnouncement] = useState("");

  const correctCount = TASKS.filter(
    (task) => choices[task.id] === task.answer,
  ).length;

  function handleSelect(task: TaskItem, mode: Mode) {
    setChoices((prev) => ({ ...prev, [task.id]: mode }));
    const modeLabel =
      MODE_OPTIONS.find((option) => option.value === mode)?.label ?? mode;
    setAnnouncement(
      `${task.label}, selected ${modeLabel}. ${task.feedback[mode]}`,
    );
  }

  function handleReset() {
    setChoices({});
    setAnnouncement("All six tasks cleared. Ready to sort again.");
  }

  return (
    <div>
      <p>
        Try sorting Priya’s six invented tasks using the same three questions
        from above:
      </p>
      <ol className={styles.steps}>
        <li>
          Read a task and check for any stop signal (hard to check, skill
          practice, or private/personal care).
        </li>
        <li>
          If no stop signal applies, weigh whether the stakes are low or higher.
        </li>
        <li>
          Pick <strong>Hand over</strong>, <strong>Work together</strong>, or{" "}
          <strong>Do myself</strong> and read the feedback below the card.
        </li>
      </ol>

      <div className={styles.scoreBar}>
        <strong data-testid="score">
          {correctCount} of {TASKS.length} sorted accurately
        </strong>
        <button type="button" onClick={handleReset}>
          Reset
        </button>
      </div>

      <ol className={styles.items}>
        {TASKS.map((task) => {
          const selected = choices[task.id];
          const isCorrect = selected === task.answer;
          const feedbackId = `feedback-${task.id}`;
          return (
            <li key={task.id} className={styles.item} data-testid="task">
              <div className={styles.taskHeader}>
                <span className={styles.taskTitle}>{task.label}</span>
              </div>
              <p className={styles.taskText}>{task.description}</p>
              <fieldset aria-describedby={selected ? feedbackId : undefined}>
                <legend>{task.label}: choose how to handle it</legend>
                <div className={styles.choices}>
                  {MODE_OPTIONS.map((option) => {
                    const checked = selected === option.value;
                    return (
                      <label
                        key={option.value}
                        className={styles.choice}
                        data-selected={checked ? "true" : "false"}
                      >
                        <input
                          type="radio"
                          name={`task-${task.id}`}
                          value={option.value}
                          checked={checked}
                          onChange={() => handleSelect(task, option.value)}
                        />
                        <span className={styles.choiceText}>
                          <span className={styles.choiceLabel}>
                            {option.label}
                          </span>
                          <span className={styles.choiceHint}>
                            {option.hint}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
              {selected && (
                <p
                  id={feedbackId}
                  className={styles.itemFeedback}
                  data-testid="item-feedback"
                  data-ok={isCorrect ? "true" : "false"}
                >
                  {task.feedback[selected]}
                </p>
              )}
            </li>
          );
        })}
      </ol>

      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="visually-hidden"
      >
        {announcement}
      </div>

      <p className="micro">
        Simplified teaching guide: Priya’s tasks are invented examples, and real
        tasks sit on a spectrum. A task can move between modes if your source,
        stakes, or learning goal changes.
      </p>
    </div>
  );
}
