import styles from "./lesson.module.css";

export type Phase = "training" | "inference";

export function PhasesMap({
  active,
  caption,
}: {
  active: Phase[];
  caption: string;
}) {
  const on = (p: Phase) => active.includes(p);
  return (
    <figure className={styles.map}>
      <ol className={styles.phases} aria-label="Two jobs around one model">
        <li
          className={styles.phase}
          data-active={on("training")}
          data-testid="phase-training"
        >
          <strong>Training (the factory)</strong>
          <span>Changes the learned settings.</span>
          {on("training") && <span className={styles.badge}>In focus</span>}
        </li>
        <li className={styles.settings} aria-label="Learned settings">
          <strong>Learned settings</strong>
          <span>Saved as a version, such as v1.</span>
        </li>
        <li
          className={styles.phase}
          data-active={on("inference")}
          data-testid="phase-inference"
        >
          <strong>Inference (the vending machine)</strong>
          <span>Uses the settings as they are.</span>
          {on("inference") && <span className={styles.badge}>In focus</span>}
        </li>
      </ol>
      <figcaption className="micro">{caption}</figcaption>
    </figure>
  );
}
