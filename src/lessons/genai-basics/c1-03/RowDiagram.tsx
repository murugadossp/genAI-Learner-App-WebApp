import styles from "./lesson.module.css";
import { columns, rows } from "./data";

export type Focus = "example" | "features" | "label";

/** The same small diagram in every concept section: one fruit row as a flashcard. */
export function RowDiagram({ focus, row = 1 }: { focus: Focus; row?: number }) {
  const r = rows[row];
  return (
    <figure
      className={styles.diagram}
      data-focus={focus}
      aria-label={`One example from the table: the ${r[3]} row, shown as clues and an answer`}
    >
      <div className={styles.card} data-part="example">
        <div className={styles.side} data-part="features">
          <span className={styles.tag}>Front: clues (features)</span>
          <ul>
            {columns.slice(0, 3).map((c, i) => (
              <li key={c}>
                {c}: <strong>{r[i]}</strong>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.side} data-part="label">
          <span className={styles.tag}>Back: answer (label)</span>
          <p>
            Fruit: <strong>{r[3]}</strong>
          </p>
        </div>
      </div>
      <figcaption className="micro">
        One card is one example. This is the {r[3]} row of the table, drawn as a
        flashcard.
      </figcaption>
    </figure>
  );
}
