"use client";

import { useState } from "react";
import styles from "./lesson.module.css";

type ClusterMode = 0 | 2 | 3 | 4;

interface BookRecord {
  id: number;
  title: string;
  pages: number;
  daysKept: number;
  x: number; // normalized 0..100 (pages / 4)
  y: number; // normalized 0..100 (daysKept * 5)
  shelf: string;
}

const BOOKS: BookRecord[] = [
  {
    id: 1,
    title: "The Foggy Harbor",
    pages: 60,
    daysKept: 3,
    x: 15,
    y: 15,
    shelf: "Picture books",
  },
  {
    id: 2,
    title: "Puddle Boots",
    pages: 72,
    daysKept: 4,
    x: 18,
    y: 20,
    shelf: "Picture books",
  },
  {
    id: 3,
    title: "Kyoto Pocket Phrases",
    pages: 80,
    daysKept: 3,
    x: 20,
    y: 15,
    shelf: "Travel",
  },
  {
    id: 4,
    title: "Winter Sparrows",
    pages: 88,
    daysKept: 4,
    x: 22,
    y: 20,
    shelf: "Poetry",
  },
  {
    id: 5,
    title: "Weeknight Soups",
    pages: 96,
    daysKept: 14,
    x: 24,
    y: 70,
    shelf: "Cookbooks",
  },
  {
    id: 6,
    title: "Sourdough Basics",
    pages: 108,
    daysKept: 16,
    x: 27,
    y: 80,
    shelf: "Cookbooks",
  },
  {
    id: 7,
    title: "Home Bike Fixes",
    pages: 112,
    daysKept: 15,
    x: 28,
    y: 75,
    shelf: "Repair manuals",
  },
  {
    id: 8,
    title: "Simple Sewing Mends",
    pages: 120,
    daysKept: 14,
    x: 30,
    y: 70,
    shelf: "Repair manuals",
  },
  {
    id: 9,
    title: "The Glass Orchard",
    pages: 304,
    daysKept: 15,
    x: 76,
    y: 75,
    shelf: "Novels",
  },
  {
    id: 10,
    title: "Salt and Lanterns",
    pages: 320,
    daysKept: 16,
    x: 80,
    y: 80,
    shelf: "Novels",
  },
  {
    id: 11,
    title: "Life of a Mapmaker",
    pages: 332,
    daysKept: 14,
    x: 83,
    y: 70,
    shelf: "Biographies",
  },
  {
    id: 12,
    title: "Letters from the North",
    pages: 344,
    daysKept: 16,
    x: 86,
    y: 80,
    shelf: "Biographies",
  },
];

// Exact minimum squared-distance (k-means objective) partitions on normalized [0, 100] coordinates.
const ASSIGNMENTS: Record<Exclude<ClusterMode, 0>, Record<number, number>> = {
  2: {
    1: 1,
    2: 1,
    3: 1,
    4: 1,
    5: 2,
    6: 2,
    7: 2,
    8: 2,
    9: 2,
    10: 2,
    11: 2,
    12: 2,
  },
  3: {
    1: 1,
    2: 1,
    3: 1,
    4: 1,
    5: 2,
    6: 2,
    7: 2,
    8: 2,
    9: 3,
    10: 3,
    11: 3,
    12: 3,
  },
  4: {
    1: 1,
    2: 1,
    3: 1,
    4: 1,
    5: 2,
    6: 2,
    7: 2,
    8: 2,
    9: 3,
    10: 4,
    11: 3,
    12: 4,
  },
};

const CLUSTER_STYLES: Record<
  number,
  {
    fill: string;
    ink: string;
    symbol: string;
    shape: "circle" | "square" | "diamond" | "triangle";
  }
> = {
  1: { fill: "#2563eb", ink: "#ffffff", symbol: "●", shape: "circle" },
  2: { fill: "#0d9488", ink: "#ffffff", symbol: "■", shape: "square" },
  3: { fill: "#d97706", ink: "#ffffff", symbol: "◆", shape: "diamond" },
  4: { fill: "#c026d3", ink: "#ffffff", symbol: "▲", shape: "triangle" },
};

const PLOT_LEFT = 56;
const PLOT_TOP = 24;
const PLOT_SIZE = 280; // Square plotting area: 2.8px per unit on both X and Y

function toSvgX(x: number) {
  return PLOT_LEFT + (x / 100) * PLOT_SIZE;
}

function toSvgY(y: number) {
  return PLOT_TOP + ((100 - y) / 100) * PLOT_SIZE;
}

function renderMarker(
  shape: "circle" | "square" | "diamond" | "triangle",
  cx: number,
  cy: number,
  fill: string,
) {
  if (shape === "square") {
    return (
      <rect
        x={cx - 6.5}
        y={cy - 6.5}
        width={13}
        height={13}
        rx={2}
        fill={fill}
        stroke="#ffffff"
        strokeWidth={1.5}
      />
    );
  }
  if (shape === "diamond") {
    const pts = `${cx},${cy - 8} ${cx + 8},${cy} ${cx},${cy + 8} ${cx - 8},${cy}`;
    return (
      <polygon points={pts} fill={fill} stroke="#ffffff" strokeWidth={1.5} />
    );
  }
  if (shape === "triangle") {
    const pts = `${cx},${cy - 8} ${cx + 8},${cy + 6.5} ${cx - 8},${cy + 6.5}`;
    return (
      <polygon points={pts} fill={fill} stroke="#ffffff" strokeWidth={1.5} />
    );
  }
  return (
    <circle
      cx={cx}
      cy={cy}
      r={7}
      fill={fill}
      stroke="#ffffff"
      strokeWidth={1.5}
    />
  );
}

function summarizeShelves(books: BookRecord[]) {
  const counts = new Map<string, number>();
  for (const book of books) {
    counts.set(book.shelf, (counts.get(book.shelf) ?? 0) + 1);
  }
  return [...counts.entries()].map(([shelf, count]) => `${count} ${shelf}`);
}

export function ClusteringLab() {
  const [mode, setMode] = useState<ClusterMode>(0);
  const [revealShelves, setRevealShelves] = useState(false);
  const [selectedId, setSelectedId] = useState<number>(3);

  const selectedBook = BOOKS.find((b) => b.id === selectedId) ?? BOOKS[0];
  const selectedCluster =
    mode === 0 ? null : ASSIGNMENTS[mode][selectedBook.id];

  const clusterGroups =
    mode === 0
      ? []
      : Array.from({ length: mode }, (_, idx) => {
          const clusterNum = idx + 1;
          const members = BOOKS.filter(
            (b) => ASSIGNMENTS[mode][b.id] === clusterNum,
          );
          const minPages = Math.min(...members.map((b) => b.pages));
          const maxPages = Math.max(...members.map((b) => b.pages));
          const minDays = Math.min(...members.map((b) => b.daysKept));
          const maxDays = Math.max(...members.map((b) => b.daysKept));
          const cx = members.reduce((sum, b) => sum + b.x, 0) / members.length;
          const cy = members.reduce((sum, b) => sum + b.y, 0) / members.length;
          return {
            clusterNum,
            members,
            minPages,
            maxPages,
            minDays,
            maxDays,
            cx,
            cy,
            shelves: summarizeShelves(members),
          };
        });

  const statusText = (() => {
    if (mode === 0) {
      return revealShelves
        ? "No clusters selected yet. Existing library shelves are shown on each book in this ungrouped view."
        : "Unlabeled view: 12 books plotted by pages and days kept, with no cluster assignments yet.";
    }
    if (mode === 2) {
      return revealShelves
        ? "2 clusters with shelves revealed: Cluster 1 mixes 3 shelves; Cluster 2 merges cookbooks, repair manuals, novels, and biographies."
        : "Grouped into 2 clusters: books kept about 2 weeks merged into Cluster 2, while short quick reads stayed in Cluster 1.";
    }
    if (mode === 3) {
      return revealShelves
        ? "3 clusters with shelves revealed: every cluster mixes multiple human shelves—Cluster 1 holds 2 Picture books, 1 Travel, and 1 Poetry."
        : "Grouped into 3 unnamed clusters (Cluster 1, Cluster 2, Cluster 3) by closeness on pages and days kept.";
    }
    return revealShelves
      ? "4 clusters with shelves revealed: asking for 4 groups split the long-book cluster into two pairs that still mix Novels and Biographies."
      : "Grouped into 4 clusters: asking for a fourth cluster split the top-right group into two nearby pairs (Cluster 3 and Cluster 4).";
  })();

  function handleReset() {
    setMode(0);
    setRevealShelves(false);
    setSelectedId(3);
  }

  return (
    <div className={styles.labBox} data-testid="clustering-lab">
      <div className={styles.labHeader}>
        <span className="eyebrow">Interactive simulation · Invented data</span>
        <button type="button" onClick={handleReset}>
          Reset lab
        </button>
      </div>

      <div className={styles.controlGroup}>
        <span className={styles.controlLabel}>
          1. Choose how many clusters to ask for
        </span>
        <div
          className={styles.buttonRow}
          role="group"
          aria-label="Cluster count"
        >
          {(
            [
              [0, "No groups"],
              [2, "2 clusters"],
              [3, "3 clusters"],
              [4, "4 clusters"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={styles.modeBtn}
              aria-pressed={mode === value}
              onClick={() => setMode(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.controlGroup}>
        <span className={styles.controlLabel}>
          2. Compare with Priya’s hidden library catalog
        </span>
        <div className={styles.buttonRow}>
          <button
            type="button"
            className={styles.toggleBtn}
            aria-pressed={revealShelves}
            onClick={() => setRevealShelves((prev) => !prev)}
          >
            {revealShelves ? "Hide human shelves" : "Reveal human shelves"}
          </button>
        </div>
      </div>

      <div className={styles.labBody}>
        <div className={styles.plotWrap}>
          <svg
            className={styles.plotSvg}
            viewBox="0 0 360 360"
            role="group"
            aria-label="Square scatter plot of 12 library books showing pages on the horizontal axis from 0 to 400 and days kept on the vertical axis from 0 to 20."
          >
            {/* Square grid lines */}
            {[0, 25, 50, 75, 100].map((v) => {
              const x = toSvgX(v);
              const y = toSvgY(v);
              return (
                <g key={v}>
                  <line
                    x1={x}
                    y1={PLOT_TOP}
                    x2={x}
                    y2={PLOT_TOP + PLOT_SIZE}
                    className={styles.gridLine}
                  />
                  <line
                    x1={PLOT_LEFT}
                    y1={y}
                    x2={PLOT_LEFT + PLOT_SIZE}
                    y2={y}
                    className={styles.gridLine}
                  />
                  <text
                    x={x}
                    y={PLOT_TOP + PLOT_SIZE + 16}
                    textAnchor="middle"
                    className={styles.axisText}
                  >
                    {v * 4}
                  </text>
                  <text
                    x={PLOT_LEFT - 10}
                    y={y + 4}
                    textAnchor="end"
                    className={styles.axisText}
                  >
                    {v / 5}
                  </text>
                </g>
              );
            })}

            {/* Axes */}
            <line
              x1={PLOT_LEFT}
              y1={PLOT_TOP + PLOT_SIZE}
              x2={PLOT_LEFT + PLOT_SIZE}
              y2={PLOT_TOP + PLOT_SIZE}
              className={styles.axisLine}
            />
            <line
              x1={PLOT_LEFT}
              y1={PLOT_TOP}
              x2={PLOT_LEFT}
              y2={PLOT_TOP + PLOT_SIZE}
              className={styles.axisLine}
            />
            <text
              x={PLOT_LEFT + PLOT_SIZE / 2}
              y={346}
              textAnchor="middle"
              className={styles.axisTitle}
            >
              Book length (pages)
            </text>
            <text
              x={16}
              y={PLOT_TOP + PLOT_SIZE / 2}
              textAnchor="middle"
              transform={`rotate(-90 16 ${PLOT_TOP + PLOT_SIZE / 2})`}
              className={styles.axisTitle}
            >
              Typical days kept
            </text>

            {/* Cluster centroids when grouped */}
            {clusterGroups.map((group) => {
              const cx = toSvgX(group.cx);
              const cy = toSvgY(group.cy);
              return (
                <g key={`c-${group.clusterNum}`} aria-hidden="true">
                  <line
                    x1={cx - 5}
                    y1={cy - 5}
                    x2={cx + 5}
                    y2={cy + 5}
                    className={styles.centroidMark}
                  />
                  <line
                    x1={cx + 5}
                    y1={cy - 5}
                    x2={cx - 5}
                    y2={cy + 5}
                    className={styles.centroidMark}
                  />
                </g>
              );
            })}

            {/* Book points */}
            {BOOKS.map((book) => {
              const cx = toSvgX(book.x);
              const cy = toSvgY(book.y);
              const clusterNum = mode === 0 ? null : ASSIGNMENTS[mode][book.id];
              const style =
                clusterNum !== null ? CLUSTER_STYLES[clusterNum] : null;
              const isSelected = book.id === selectedBook.id;
              const pointLabel = `${book.title}, ${book.pages} pages, ${book.daysKept} days kept${
                clusterNum ? `, Cluster ${clusterNum}` : ", ungrouped"
              }${revealShelves ? `, existing shelf ${book.shelf}` : ""}`;

              return (
                <g
                  key={book.id}
                  role="button"
                  tabIndex={0}
                  aria-label={pointLabel}
                  aria-pressed={isSelected}
                  className={styles.pointGroup}
                  onClick={() => setSelectedId(book.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedId(book.id);
                    }
                  }}
                >
                  {isSelected && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={12}
                      className={styles.pointRing}
                    />
                  )}
                  {renderMarker(
                    style ? style.shape : "circle",
                    cx,
                    cy,
                    style ? style.fill : "#64748b",
                  )}
                </g>
              );
            })}
          </svg>
          <p className={`micro ${styles.plotNote}`}>
            Square scale: 40 pages and 2 days kept span the same visual
            distance. Crosses (×) mark cluster centers.
          </p>
        </div>

        <div className={styles.sideCol}>
          <div className={styles.statusCard}>
            <h3>Current view</h3>
            <p
              role="status"
              aria-live="polite"
              data-testid="lab-status"
              style={{ margin: 0 }}
            >
              {statusText}
            </p>
          </div>

          <div className={styles.inspectorCard} data-testid="book-inspector">
            <h3>Selected book</h3>
            <dl className={styles.inspectorList}>
              <div className={styles.inspectorRow}>
                <dt>Title</dt>
                <dd>{selectedBook.title}</dd>
              </div>
              <div className={styles.inspectorRow}>
                <dt>Length</dt>
                <dd>{selectedBook.pages} pages</dd>
              </div>
              <div className={styles.inspectorRow}>
                <dt>Typical checkout</dt>
                <dd>{selectedBook.daysKept} days</dd>
              </div>
              <div className={styles.inspectorRow}>
                <dt>Cluster</dt>
                <dd>
                  {selectedCluster ? `Cluster ${selectedCluster}` : "None yet"}
                </dd>
              </div>
              <div className={styles.inspectorRow}>
                <dt>Existing shelf</dt>
                <dd>{revealShelves ? selectedBook.shelf : "Hidden"}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {clusterGroups.length > 0 && (
        <div className={styles.clusterGrid} data-testid="cluster-summary">
          {clusterGroups.map((group) => {
            const st = CLUSTER_STYLES[group.clusterNum];
            return (
              <div key={group.clusterNum} className={styles.clusterCard}>
                <div className={styles.clusterTitle}>
                  <span
                    className={styles.swatch}
                    style={{ background: st.fill, color: st.ink }}
                    aria-hidden="true"
                  >
                    {st.symbol}
                  </span>
                  <span>
                    Cluster {group.clusterNum} ({group.members.length} books)
                  </span>
                </div>
                <p className={styles.clusterMeta}>
                  {group.minPages}–{group.maxPages} pages · {group.minDays}–
                  {group.maxDays} days kept
                </p>
                {revealShelves ? (
                  <div className={styles.shelfChips}>
                    {group.shelves.map((label) => (
                      <span key={label} className={styles.shelfChip}>
                        {label}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="micro" style={{ margin: 0 }}>
                    Unnamed group—reveal shelves to compare with library genres.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      <p className="micro" style={{ marginTop: 14, marginBottom: 0 }}>
        Simplified simulation: shows precomputed minimum squared-distance
        groupings (each dot to its cluster center) on 12 invented books rather
        than a live library database.
      </p>
    </div>
  );
}
