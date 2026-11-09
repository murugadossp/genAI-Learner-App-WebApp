import { cellLabels } from "./tasks";
import styles from "./lesson.module.css";

type Focus = "stakes" | "checkable" | "levels";

const alt: Record<Focus, string> = {
  stakes:
    "Small grid. Rows are stakes: low on top, high below. Columns are checkability: easy on the left, hard on the right. The stakes rows are highlighted.",
  checkable:
    "Small grid. Rows are stakes: low on top, high below. Columns are checkability: easy on the left, hard on the right. The checkability columns are highlighted.",
  levels:
    "Grid of four check levels. Low stakes and easy to check: look it over, then use it. Low stakes and hard to check: unconfirmed, proceed knowing that, or choose another way. High stakes and easy to check: check against the source first. High stakes and hard to check: not on the AI alone, get a reliable source or a qualified person.",
};

export function Grid({ focus }: { focus: Focus }) {
  const cells = ["low-easy", "low-hard", "high-easy", "high-hard"] as const;
  return (
    <figure className={styles.gridFigure}>
      <div
        className={styles.grid}
        data-focus={focus}
        role="img"
        aria-label={alt[focus]}
      >
        <span className={styles.corner} aria-hidden="true" />
        <span className={styles.colHead} aria-hidden="true">
          Easy to check
        </span>
        <span className={styles.colHead} aria-hidden="true">
          Hard to check
        </span>
        {cells.map((c, i) => (
          <span key={c} style={{ display: "contents" }} aria-hidden="true">
            {i % 2 === 0 && (
              <span className={styles.rowHead}>
                {c.startsWith("low") ? "Low stakes" : "High stakes"}
              </span>
            )}
            <span className={styles.cell} data-cell={c}>
              {focus === "levels" ? cellLabels[c] : ""}
            </span>
          </span>
        ))}
      </div>
      <figcaption className="micro">
        {focus === "levels"
          ? "The four check levels. A teaching simplification, not an industry standard."
          : "The same grid every time: stakes down the side, checkability across the top."}
      </figcaption>
    </figure>
  );
}
