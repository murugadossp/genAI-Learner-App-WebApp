import styles from "./lesson.module.css";
import { columns, rows } from "./data";

export function FruitTable({ blank }: { blank?: string[] }) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <caption>
          Fruit-crate scanner (toy data, invented for this lesson)
        </caption>
        <thead>
          <tr>
            {columns.map((c) => (
              <th scope="col" key={c}>
                {c}
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
          {blank && (
            <tr className={styles.newRow}>
              {blank.map((v, i) => (
                <td key={columns[i]}>{v}</td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
