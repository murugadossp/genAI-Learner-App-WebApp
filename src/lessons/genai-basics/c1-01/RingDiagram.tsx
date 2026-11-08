import styles from "./lesson.module.css";
export const ringNames = [
  "Artificial intelligence",
  "Machine learning",
  "Deep learning",
  "Generative AI",
];
export function RingDiagram({ current }: { current: number }) {
  const ring = (level: number): React.ReactNode => (
    <div
      className={styles.ring}
      data-member={level <= current}
      data-current={level === current}
      data-level={level}
    >
      <span className={styles.ringLabel}>{ringNames[level]}</span>
      {level < 3 ? ring(level + 1) : null}
    </div>
  );
  return (
    <div
      className={styles.where}
      role="img"
      aria-label={`Nested rings, outside to inside: ${ringNames.join(", ")}. Highlighted: ${ringNames[current]}.`}
    >
      <div aria-hidden="true" data-testid="ring-diagram">
        {ring(0)}
      </div>
      <p aria-hidden="true">
        <strong>Highlighted: {ringNames[current]}.</strong>{" "}
        {current === 0
          ? "Everything inside the other rings belongs here too."
          : `It sits inside ${ringNames
              .slice(0, current)
              .join(", ")
              .replace(/, ([^,]*)$/, " and $1")}.`}
      </p>
    </div>
  );
}
