import styles from "./lesson.module.css";

export function TokenChunkVisual() {
  return (
    <figure
      className={styles.figure}
      aria-label="Diagram showing division, floor division, and modulo partitioning 1350 tokens into two 500-token chunks and 350 remainder tokens"
    >
      <div className={styles.figureContent}>
        <div className={styles.chunkBarContainer}>
          <div
            className={styles.chunkBar}
            role="img"
            aria-label="Visual bar of 1350 tokens: Chunk 1 with 500 tokens, Chunk 2 with 500 tokens, and Remainder with 350 tokens"
          >
            <div
              className={`${styles.chunkSegment} ${styles.chunkSegmentChunk}`}
              style={{ width: "37%" }}
            >
              Chunk 1 (500)
            </div>
            <div
              className={`${styles.chunkSegment} ${styles.chunkSegmentChunk}`}
              style={{ width: "37%" }}
            >
              Chunk 2 (500)
            </div>
            <div
              className={`${styles.chunkSegment} ${styles.chunkSegmentRemainder}`}
              style={{ width: "26%" }}
            >
              Remainder (350)
            </div>
          </div>
          <div className={styles.chunkLegend}>
            <div className={styles.legendItem}>
              <span
                className={`${styles.legendDot} ${styles.legendDotChunk}`}
                aria-hidden="true"
              />
              <span>Full chunks (// floor division)</span>
            </div>
            <div className={styles.legendItem}>
              <span
                className={`${styles.legendDot} ${styles.legendDotRemainder}`}
                aria-hidden="true"
              />
              <span>Remainder tokens (% modulo)</span>
            </div>
          </div>
        </div>

        <div className={styles.cardsGrid}>
          <div className={styles.calcCard}>
            <div className={styles.calcHeader}>
              <span className={styles.calcOpName}>/ (True division)</span>
              <span className={styles.calcType}>float</span>
            </div>
            <code className={styles.calcExpr}>1350 / 500 = 2.7</code>
            <p className={styles.calcMeaning}>
              Always gives a float. Represents the exact fractional ratio of
              chunks.
            </p>
          </div>

          <div className={styles.calcCard}>
            <div className={styles.calcHeader}>
              <span className={styles.calcOpName}>// (Floor division)</span>
              <span className={styles.calcType}>int</span>
            </div>
            <code className={styles.calcExpr}>1350 // 500 = 2</code>
            <p className={styles.calcMeaning}>
              Counts complete chunks that fit into the total without any
              fraction.
            </p>
          </div>

          <div className={styles.calcCard}>
            <div className={styles.calcHeader}>
              <span className={styles.calcOpName}>% (Modulo)</span>
              <span className={styles.calcType}>int</span>
            </div>
            <code className={styles.calcExpr}>1350 % 500 = 350</code>
            <p className={styles.calcMeaning}>
              Gives leftover tokens remaining after all full chunks are
              extracted.
            </p>
          </div>
        </div>

        <div className="callout">
          <strong>Mathematical relationship:</strong> In Python,{" "}
          <code>(1350 // 500) * 500 + (1350 % 500) == 1350</code> evaluates to{" "}
          <code>True</code>. The full chunks and remainder perfectly reconstruct
          the original total.
        </div>
      </div>
      <figcaption className="micro">
        How Python partitions a 1,350-token document with a 500-token chunk
        size: floor division (<code>//</code>) yields 2 full chunks, modulo (
        <code>%</code>) yields 350 leftover tokens, and true division (
        <code>/</code>) yields 2.7.
      </figcaption>
    </figure>
  );
}
