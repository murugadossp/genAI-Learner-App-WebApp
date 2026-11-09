"use client";

import { useState } from "react";
import styles from "./lesson.module.css";

interface Preset {
  id: string;
  name: string;
  docs: string[];
}

const PRESETS: Preset[] = [
  {
    id: "rag",
    name: "RAG Candidates",
    docs: ["refund_policy", "shipping_faq", "order_tracking", "warranty_terms"],
  },
  {
    id: "chat",
    name: "Chat History",
    docs: [
      "system_instruction",
      "user_query_1",
      "assistant_reply_1",
      "user_query_2",
    ],
  },
  {
    id: "scores",
    name: "Confidence Scores",
    docs: ["conf_0.94", "conf_0.88", "conf_0.73", "conf_0.51"],
  },
];

export function ListLab() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>("rag");
  const [items, setItems] = useState<string[]>(PRESETS[0].docs);
  const [sliceStart, setSliceStart] = useState<number>(0);
  const [sliceStop, setSliceStop] = useState<number>(2);
  const [inspectedIdx, setInspectedIdx] = useState<number>(0);
  const [slotToUpdate, setSlotToUpdate] = useState<number>(0);
  const [updateText, setUpdateText] = useState<string>("pinned_priority_doc");
  const [newItemText, setNewItemText] = useState<string>("user_profile");
  const [isTrapTriggered, setIsTrapTriggered] = useState<boolean>(false);
  const [lastActionMsg, setLastActionMsg] = useState<string>(
    "Loaded preset: RAG Candidates (4 items)",
  );

  const handleSelectPreset = (p: Preset) => {
    setSelectedPresetId(p.id);
    setItems([...p.docs]);
    setSliceStart(0);
    setSliceStop(2);
    setInspectedIdx(0);
    setSlotToUpdate(0);
    setIsTrapTriggered(false);
    setLastActionMsg(`Loaded preset: ${p.name} (${p.docs.length} items)`);
  };

  const handleReset = () => {
    handleSelectPreset(PRESETS[0]);
  };

  const handleAppendSafe = () => {
    if (isTrapTriggered) return;
    const text = newItemText.trim() || "extra_context";
    setItems((prev) => [...prev, text]);
    setLastActionMsg(
      `retrieved_docs.append("${text}") -> Mutated in place (len is now ${
        items.length + 1
      })`,
    );
  };

  const handleAppendTrap = () => {
    const text = newItemText.trim() || "extra_context";
    // Mutate the underlying list in place (as Python .append() does)
    setItems((prev) => [...prev, text]);
    // But rebind the variable reference to None
    setIsTrapTriggered(true);
    setLastActionMsg(
      `retrieved_docs.append("${text}") mutated the list, but retrieved_docs = ... rebound the variable to None!`,
    );
  };

  const handlePop = () => {
    if (isTrapTriggered || items.length === 0) return;
    const popped = items[items.length - 1];
    const nextLen = items.length - 1;
    setItems((prev) => prev.slice(0, -1));
    if (inspectedIdx >= nextLen && inspectedIdx > 0) {
      setInspectedIdx(nextLen - 1);
    }
    if (slotToUpdate >= nextLen && slotToUpdate > 0) {
      setSlotToUpdate(nextLen - 1);
    }
    setLastActionMsg(
      `retrieved_docs.pop() -> Removed "${popped}" (len is now ${nextLen})`,
    );
  };

  const handleUpdateSlot = () => {
    if (isTrapTriggered || items.length === 0) return;
    const safeSlot = Math.min(Math.max(0, slotToUpdate), items.length - 1);
    const val = updateText.trim() || "updated_item";
    setItems((prev) => {
      const next = [...prev];
      next[safeSlot] = val;
      return next;
    });
    setLastActionMsg(
      `retrieved_docs[${safeSlot}] = "${val}" -> Slot updated in place`,
    );
  };

  // Compute slice result with Python semantics
  const computeSlice = (): string[] => {
    if (isTrapTriggered) return [];
    if (sliceStart >= sliceStop) return [];
    return items.slice(Math.max(0, sliceStart), Math.max(0, sliceStop));
  };

  const sliceResult = computeSlice();
  const safeInspectedIdx = Math.min(
    Math.max(0, inspectedIdx),
    Math.max(0, items.length - 1),
  );
  const inspectedItem = items[safeInspectedIdx];
  const inspectedNegIdx = safeInspectedIdx - items.length;

  return (
    <div
      className={styles.labCard}
      aria-label="Interactive AI List Processing Sandbox"
    >
      <div className={styles.labHeader}>
        <h3 className={styles.labTitle}>AI List &amp; Context Sandbox</h3>
        <button type="button" className={styles.resetBtn} onClick={handleReset}>
          Reset sandbox
        </button>
      </div>

      <p
        className="micro"
        style={{ color: "var(--muted)", margin: "0 0 1rem 0" }}
      >
        Inspect how Python lists store ordered RAG candidates, slice prompt
        context budgets, mutate in place via <code>.append()</code> and{" "}
        <code>.pop()</code>, and recover from the variable rebinding trap.
      </p>

      {/* Preset selection */}
      <div className={styles.presetGroup}>
        <span className={styles.presetLabel}>Presets:</span>
        {PRESETS.map((p) => {
          const isActive = selectedPresetId === p.id;
          return (
            <button
              key={p.id}
              type="button"
              className={`${styles.presetBtn} ${
                isActive ? styles.presetBtnActive : ""
              }`}
              onClick={() => handleSelectPreset(p)}
              aria-pressed={isActive}
            >
              {p.name}
            </button>
          );
        })}
      </div>

      {/* Trap Warning Alert */}
      {isTrapTriggered ? (
        <div className={styles.trapAlert} role="alert">
          <div className={styles.trapTitle}>
            ⚠️ The .append() Return Trap Triggered!
          </div>
          <p className={styles.trapDesc}>
            You executed{" "}
            <code>retrieved_docs = retrieved_docs.append(...)</code>. Because{" "}
            <code>.append()</code> returns <code>None</code>, the variable name
            tag <code>retrieved_docs</code> was rebound to <code>None</code>,
            permanently abandoning the list reference in real Python (the
            original list object becomes eligible for garbage collection unless
            an alias was saved beforehand).
          </p>
          <ul className={styles.trapList}>
            <li>
              Calling <code>retrieved_docs.append(...)</code> now raises:{" "}
              <strong>
                AttributeError: &apos;NoneType&apos; object has no attribute
                &apos;append&apos;
              </strong>
            </li>
            <li>
              Slicing <code>retrieved_docs[:2]</code> now raises:{" "}
              <strong>
                TypeError: &apos;NoneType&apos; object is not subscriptable
              </strong>
            </li>
          </ul>
          <p
            className="micro"
            style={{ color: "var(--muted)", margin: "0 0 0.75rem 0" }}
          >
            <em>
              Note: This sandbox retains an internal backup reference solely for
              demonstration, allowing you to inspect that .append() did mutate
              the list before the name tag was rebound.
            </em>
          </p>
          <button
            type="button"
            className={styles.restoreBtn}
            onClick={() => {
              setIsTrapTriggered(false);
              setLastActionMsg(
                `Restored retrieved_docs reference via simulation backup (${items.length} items, including appended item).`,
              );
            }}
          >
            Restore reference (Simulation demo)
          </button>
        </div>
      ) : (
        <>
          {/* Active List Slots Display */}
          <div className={styles.listContainer}>
            <div className={styles.listMeta}>
              <span className={styles.listVar}>
                <code>retrieved_docs</code>:
              </span>
              <span className={styles.listLen}>
                len(retrieved_docs) = <strong>{items.length}</strong>
              </span>
            </div>

            {items.length === 0 ? (
              <div className={styles.emptyListNotice}>
                List is empty: <code>[]</code>. Use .append() to add items.
              </div>
            ) : (
              <div className={styles.slotsGrid} role="list">
                {items.map((item, idx) => {
                  const negIdx = idx - items.length;
                  const isSliced =
                    sliceStart < sliceStop &&
                    idx >= sliceStart &&
                    idx < sliceStop;
                  const isInspected = idx === safeInspectedIdx;

                  return (
                    <div key={`${idx}-${item}`} role="listitem">
                      <button
                        type="button"
                        className={`${styles.slotBox} ${
                          isSliced ? styles.slotBoxSliced : ""
                        } ${isInspected ? styles.slotBoxInspected : ""}`}
                        onClick={() => setInspectedIdx(idx)}
                        aria-pressed={isInspected}
                        aria-label={`Index ${idx} (negative ${negIdx}): ${item}`}
                      >
                        <div className={styles.slotPosBadge}>+{idx}</div>
                        <div className={styles.slotValue}>
                          <code>&quot;{item}&quot;</code>
                        </div>
                        <div className={styles.slotNegBadge}>{negIdx}</div>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Index Inspector */}
          {items.length > 0 && (
            <div className={styles.labSection}>
              <h4 className={styles.sectionHeading}>
                Index Inspector (Click any slot above or select an index)
              </h4>
              <div className={styles.inspectorRow}>
                <label className={styles.stepperLabel}>
                  Select index:
                  <select
                    className={styles.selectInput}
                    value={safeInspectedIdx}
                    onChange={(e) => setInspectedIdx(Number(e.target.value))}
                    aria-label="Select index to inspect"
                  >
                    {items.map((_, i) => (
                      <option key={i} value={i}>
                        Index [{i}] ({i - items.length})
                      </option>
                    ))}
                  </select>
                </label>
                <div className={styles.inspectorCard} aria-live="polite">
                  <code>retrieved_docs[{safeInspectedIdx}]</code> (head) or{" "}
                  <code>retrieved_docs[{inspectedNegIdx}]</code> (tail)
                  evaluates to: <strong>&quot;{inspectedItem}&quot;</strong>
                </div>
              </div>
            </div>
          )}

          {/* Slicing Controls & Live Preview */}
          <div className={styles.labSection}>
            <h4 className={styles.sectionHeading}>
              Context Budget Slicing: <code>retrieved_docs[start : stop]</code>
            </h4>
            <div className={styles.sliceControls}>
              <label className={styles.stepperLabel}>
                Start index:
                <select
                  className={styles.selectInput}
                  value={sliceStart}
                  onChange={(e) => setSliceStart(Number(e.target.value))}
                  aria-label="Start index"
                >
                  {[0, 1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>

              <label className={styles.stepperLabel}>
                Stop index:
                <select
                  className={styles.selectInput}
                  value={sliceStop}
                  onChange={(e) => setSliceStop(Number(e.target.value))}
                  aria-label="Stop index"
                >
                  {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>

              <div className={styles.sliceBadge}>
                {sliceStart >= sliceStop ? (
                  <span className={styles.badgeWarn}>
                    Empty slice: start ({sliceStart}) &gt;= stop ({sliceStop})
                  </span>
                ) : sliceStop > items.length ? (
                  <span className={styles.badgeInfo}>
                    Stop ({sliceStop}) exceeds length ({items.length}); Python
                    clips to end
                  </span>
                ) : (
                  <span className={styles.badgeSuccess}>
                    Yields {sliceStop - sliceStart} items
                  </span>
                )}
              </div>
            </div>

            <div className={styles.codeOutputCard}>
              <div className={styles.codeSnippet}>
                <span className={styles.codeVar}>context_docs</span> ={" "}
                <span className={styles.codeVar}>retrieved_docs</span>[
                {sliceStart}:{sliceStop}]
              </div>
              <div className={styles.outputResult}>
                Result:{" "}
                <strong>
                  [
                  {sliceResult.map((d, i) => (
                    <span key={i}>
                      &quot;{d}&quot;
                      {i < sliceResult.length - 1 ? ", " : ""}
                    </span>
                  ))}
                  ]
                </strong>{" "}
                ({sliceResult.length} items)
              </div>
            </div>
          </div>

          {/* In-Place Mutation Controls */}
          <div className={styles.labSection}>
            <h4 className={styles.sectionHeading}>
              In-Place Mutation Controls
            </h4>
            <div className={styles.mutationGrid}>
              {/* Append control */}
              <div className={styles.mutationField}>
                <label htmlFor="appendInput" className={styles.mutationLabel}>
                  New Item to Append:
                </label>
                <div className={styles.actionRow}>
                  <input
                    id="appendInput"
                    type="text"
                    className={styles.textInput}
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                  />
                  <button
                    type="button"
                    className={styles.actionBtn}
                    onClick={handleAppendSafe}
                  >
                    .append()
                  </button>
                  <button
                    type="button"
                    className={styles.trapBtn}
                    onClick={handleAppendTrap}
                    title="Simulate the fatal rebinding bug: docs = docs.append(...)"
                  >
                    Trigger Bug: docs = docs.append()
                  </button>
                </div>
              </div>

              {/* Pop & Configurable Modify controls */}
              <div className={styles.mutationField}>
                <span className={styles.mutationLabel}>
                  Remove / Modify Slot:
                </span>
                <div className={styles.actionRow}>
                  <button
                    type="button"
                    className={styles.actionBtn}
                    onClick={handlePop}
                    disabled={items.length === 0}
                    title={
                      items.length === 0
                        ? "IndexError: pop from empty list"
                        : "Removes and returns the last element"
                    }
                  >
                    .pop() Tail
                  </button>

                  {items.length > 0 && (
                    <>
                      <select
                        className={styles.selectInput}
                        value={slotToUpdate}
                        onChange={(e) =>
                          setSlotToUpdate(Number(e.target.value))
                        }
                        aria-label="Select slot to update"
                      >
                        {items.map((_, i) => (
                          <option key={i} value={i}>
                            Slot [{i}]
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        className={styles.textInput}
                        value={updateText}
                        onChange={(e) => setUpdateText(e.target.value)}
                        aria-label="New text for slot"
                      />
                      <button
                        type="button"
                        className={styles.actionBtn}
                        onClick={handleUpdateSlot}
                      >
                        Assign docs[i]
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Status Bar */}
      <div className={styles.statusBar} role="status">
        <span className={styles.statusLabel}>Last operation:</span>
        <span className={styles.statusMsg}>{lastActionMsg}</span>
      </div>

      {/* Numbered instructions */}
      <div className={styles.instructions}>
        <div className={styles.instructionsTitle}>Try it in this order:</div>
        <ol className={styles.instructionsList}>
          <li>
            Click any slot in <code>retrieved_docs</code> above to inspect its
            positive index (<code>+i</code>) and negative index (<code>-i</code>
            ) in the Index Inspector.
          </li>
          <li>
            Change <strong>Stop index</strong> to <code>2</code>. Notice that{" "}
            <code>[0:2]</code> selects the first 2 items (indices 0 and 1) and
            stops before 2.
          </li>
          <li>
            Click <strong>.append()</strong> to add{" "}
            <code>&quot;user_profile&quot;</code>. See the list mutate in place
            to length 5, and note how negative indices dynamically adjust.
          </li>
          <li>
            Click <strong>Trigger Bug: docs = docs.append()</strong>. Observe
            how the variable name tag is rebound to <code>None</code>,
            abandoning the list reference, even though the underlying list was
            mutated! Click <strong>Restore reference (Simulation demo)</strong>{" "}
            to recover the reference and verify the list preserved the appended
            item.
          </li>
        </ol>
      </div>
    </div>
  );
}
