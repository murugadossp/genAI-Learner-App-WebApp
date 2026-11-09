import { parts, type PartId } from "./parts";
import styles from "./lesson.module.css";

export function PartsMap({
  active = [],
  appCode = false,
  caption,
}: {
  active?: PartId[];
  appCode?: boolean;
  caption: string;
}) {
  return (
    <figure className={styles.map}>
      <ul className={styles.mapList} aria-label="Parts of Leaf Buddy">
        {parts.map((p) => {
          const on = active.includes(p.id);
          return (
            <li
              key={p.id}
              className={styles.mapPart}
              data-active={on}
              data-testid={`part-${p.id}`}
            >
              <strong>{p.name}</strong>
              <span>{p.job}</span>
              {on && <span className={styles.badge}>In use</span>}
            </li>
          );
        })}
      </ul>
      <div
        className={styles.mapGlue}
        data-active={appCode}
        data-testid="part-appcode"
      >
        App code connects the parts and decides the order
        {appCode && <span className={styles.badge}>In use</span>}
      </div>
      <figcaption className="micro">{caption}</figcaption>
    </figure>
  );
}
