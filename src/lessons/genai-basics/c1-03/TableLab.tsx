"use client";
import { useId, useState } from "react";
import styles from "./lesson.module.css";
import { columns, rows, goals, type Role } from "./data";

type Answers = (Role | null)[];
const empty = (): Answers => columns.map(() => null);

export function TableLab() {
  const uid = useId();
  const [goalIdx, setGoalIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers[]>(goals.map(empty));
  const [message, setMessage] = useState("");
  const goal = goals[goalIdx];
  const mine = answers[goalIdx];
  const right = mine.filter((a, i) => a === goal.roles[i]).length;
  const feedback = (i: number, a: Role) =>
    a === goal.roles[i] ? `Right: ${goal.why[i]}` : `Not quite. ${goal.why[i]}`;
  const choose = (i: number, a: Role) => {
    setAnswers((prev) =>
      prev.map((list, g) =>
        g === goalIdx ? list.map((x, j) => (j === i ? a : x)) : list,
      ),
    );
    setMessage(`${columns[i]}. ${feedback(i, a)}`);
  };
  return (
    <div className="lab">
      <div className="lab-head">
        <strong>Tap the label and the features</strong>
        <span className="pill">PRACTICE</span>
      </div>
      <div className="lab-body">
        <fieldset className={styles.goalPick}>
          <legend>Pick a goal</legend>
          {goals.map((g, k) => (
            <label className={styles.option} key={g.id}>
              <input
                type="radio"
                name={`${uid}-goal`}
                checked={goalIdx === k}
                onChange={() => {
                  setGoalIdx(k);
                  setMessage(`${g.short} selected.`);
                }}
              />
              <span>{g.short}</span>
            </label>
          ))}
        </fieldset>
        <p data-testid="goal-text">
          <strong>{goal.text}</strong>
        </p>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption>Same table for both goals</caption>
            <thead>
              <tr>
                {columns.map((c, i) => (
                  <th scope="col" key={c}>
                    {c}
                    {mine[i] && (
                      <span className={styles.roleTag} data-role={mine[i]}>
                        {mine[i] === "Feature" ? "clue" : "answer"}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.join()}>
                  {r.map((v, i) => (
                    <td key={columns[i]}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ol className={styles.items}>
          {columns.map((c, i) => {
            const a = mine[i];
            return (
              <li className={styles.item} key={c}>
                <fieldset aria-describedby={a ? `${uid}-fb-${i}` : undefined}>
                  <legend>Column: {c}</legend>
                  <div className={styles.choices}>
                    {(["Feature", "Label"] as Role[]).map((role) => (
                      <label className={styles.choice} key={role}>
                        <input
                          type="radio"
                          name={`${uid}-${goalIdx}-${i}`}
                          checked={a === role}
                          onChange={() => choose(i, role)}
                        />
                        <span>
                          {role === "Feature"
                            ? "Feature (clue)"
                            : "Label (answer)"}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                {a && (
                  <p
                    id={`${uid}-fb-${i}`}
                    className={styles.itemFeedback}
                    data-ok={a === goal.roles[i]}
                    data-testid="item-feedback"
                  >
                    {a === goal.roles[i] ? "✓ " : "↻ "}
                    {feedback(i, a)}
                  </p>
                )}
              </li>
            );
          })}
        </ol>
        <div className={styles.score}>
          <strong data-testid="score">
            {right} of {columns.length} correct for this goal
          </strong>
          <button
            type="button"
            onClick={() => {
              setAnswers((prev) =>
                prev.map((l, g) => (g === goalIdx ? empty() : l)),
              );
              setMessage("This goal was reset.");
            }}
          >
            Reset this goal
          </button>
        </div>
        <div role="status" aria-live="polite" className="visually-hidden">
          {message}
        </div>
        <p className="micro lab-disclosure">
          The table and both goals are invented for teaching. Your answers for
          each goal are kept when you switch goals. The rules here are
          simplifications: pick exactly one label, and treat every other column
          as a clue. Real projects can be looser than this.
        </p>
      </div>
    </div>
  );
}
