import styles from "./lesson.module.css";
export const ringNames = [
  "Artificial intelligence",
  "Machine learning",
  "Deep learning",
  "Generative AI",
];
export function RingDiagram({
  current,
  wholeField = false,
}: {
  current: number;
  wholeField?: boolean;
}) {
  const ring = (level: number): React.ReactNode => (
    <div
      className={styles.ring}
      data-member={wholeField || level <= current}
      data-current={wholeField || level === current}
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
      aria-label={`Nested rings, outside to inside: ${ringNames.join(", ")}. ${wholeField ? "Highlighted: the whole box, which is all of AI." : `Highlighted: ${ringNames[current]}.`}`}
    >
      <div aria-hidden="true" data-testid="ring-diagram">
        {ring(0)}
      </div>
      <p aria-hidden="true">
        {wholeField ? (
          <>
            <strong>The whole box is AI.</strong> Machine learning, deep
            learning and generative AI are all kinds of AI, drawn inside it.
          </>
        ) : (
          <>
            <strong>Highlighted: {ringNames[current]}.</strong>{" "}
            {`It sits inside ${ringNames
              .slice(0, current)
              .join(", ")
              .replace(/, ([^,]*)$/, " and $1")}.`}
          </>
        )}
      </p>
    </div>
  );
}
