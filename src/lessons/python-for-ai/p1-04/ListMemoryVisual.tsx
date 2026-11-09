"use client";

import { useState } from "react";
import styles from "./lesson.module.css";

interface SlotData {
  posIdx: number;
  negIdx: number;
  value: string;
  isSliced: boolean;
}

const INITIAL_SLOTS: SlotData[] = [
  { posIdx: 0, negIdx: -4, value: "refund_policy", isSliced: false },
  { posIdx: 1, negIdx: -3, value: "shipping_faq", isSliced: true },
  { posIdx: 2, negIdx: -2, value: "order_tracking", isSliced: true },
  { posIdx: 3, negIdx: -1, value: "warranty_terms", isSliced: false },
];

export function ListMemoryVisual() {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"indices" | "slice" | "mutation">(
    "indices",
  );

  const selectedSlot = INITIAL_SLOTS[selectedIdx];

  return (
    <div
      className={styles.visualContainer}
      aria-label="Interactive List Structure & Indexing Diagram"
    >
      <div className={styles.visualHeader}>
        <h3 className={styles.visualTitle}>
          List Structure: Slots &amp; Dual Indices
        </h3>
        <span className={styles.visualBadge}>Ordered Mutable Sequence</span>
      </div>

      <div
        className={styles.visualTabs}
        role="group"
        aria-label="Diagram display modes"
      >
        <button
          type="button"
          aria-pressed={activeTab === "indices"}
          className={`${styles.tabBtn} ${
            activeTab === "indices" ? styles.tabBtnActive : ""
          }`}
          onClick={() => setActiveTab("indices")}
        >
          1. Dual Indexing
        </button>
        <button
          type="button"
          aria-pressed={activeTab === "slice"}
          className={`${styles.tabBtn} ${
            activeTab === "slice" ? styles.tabBtnActive : ""
          }`}
          onClick={() => setActiveTab("slice")}
        >
          2. Slice Window [1:3]
        </button>
        <button
          type="button"
          aria-pressed={activeTab === "mutation"}
          className={`${styles.tabBtn} ${
            activeTab === "mutation" ? styles.tabBtnActive : ""
          }`}
          onClick={() => setActiveTab("mutation")}
        >
          3. In-Place Mutation
        </button>
      </div>

      {/* Visual Slot Row */}
      <div className={styles.slotsRow} role="list">
        {INITIAL_SLOTS.map((slot) => {
          const isSelected = selectedIdx === slot.posIdx;
          const isHighlighted =
            activeTab === "slice"
              ? slot.isSliced
              : activeTab === "mutation"
                ? slot.posIdx === 1
                : isSelected;

          return (
            <div key={slot.posIdx} role="listitem">
              <button
                type="button"
                className={`${styles.slotCard} ${
                  isHighlighted ? styles.slotHighlighted : ""
                } ${isSelected ? styles.slotSelected : ""}`}
                onClick={() => setSelectedIdx(slot.posIdx)}
                aria-pressed={isSelected}
                aria-label={`Slot ${slot.posIdx}: ${slot.value}`}
              >
                <div className={styles.posIndexBadge}>+{slot.posIdx}</div>
                <div className={styles.slotContent}>
                  <span className={styles.slotQuotes}>&quot;</span>
                  <span className={styles.slotText}>{slot.value}</span>
                  <span className={styles.slotQuotes}>&quot;</span>
                </div>
                <div className={styles.negIndexBadge}>{slot.negIdx}</div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Dynamic Detail Card */}
      <div className={styles.visualDetail} aria-live="polite">
        {activeTab === "indices" && (
          <div className={styles.detailText}>
            <p className={styles.detailCode}>
              <code>retrieved_docs[{selectedSlot.posIdx}]</code> or{" "}
              <code>retrieved_docs[{selectedSlot.negIdx}]</code> →{" "}
              <strong>&quot;{selectedSlot.value}&quot;</strong>
            </p>
            <p className="micro" style={{ margin: 0, color: "var(--muted)" }}>
              Every list item can be reached via positive indexing from head (
              <code>0</code> to <code>3</code>) or negative indexing from tail (
              <code>-1</code> to <code>-4</code>).
            </p>
          </div>
        )}

        {activeTab === "slice" && (
          <div className={styles.detailText}>
            <p className={styles.detailCode}>
              <code>retrieved_docs[1:3]</code> →{" "}
              <strong>
                [&quot;shipping_faq&quot;, &quot;order_tracking&quot;]
              </strong>
            </p>
            <p className="micro" style={{ margin: 0, color: "var(--muted)" }}>
              Slicing starts at index 1 and stops <em>before</em> index 3.
              Slicing creates a brand new list containing exactly{" "}
              <code>3 - 1 = 2</code> items without altering the original list.
            </p>
          </div>
        )}

        {activeTab === "mutation" && (
          <div className={styles.detailText}>
            <p className={styles.detailCode}>
              <code>retrieved_docs[1] = &quot;shipping_v2&quot;</code>
            </p>
            <p className="micro" style={{ margin: 0, color: "var(--muted)" }}>
              Lists are <strong>mutable</strong>. Assigning to a slot replaces
              the reference at that index in place, modifying the list object
              without changing its identity in memory.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
