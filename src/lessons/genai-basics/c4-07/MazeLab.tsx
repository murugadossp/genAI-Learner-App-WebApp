"use client";

import { useMemo, useState } from "react";
import styles from "./lesson.module.css";

type Strategy = "bfs" | "dfs" | "greedy";
type MapId = "warehouse" | "detour";

interface Coord {
  r: number;
  c: number;
}

interface MapPreset {
  id: MapId;
  label: string;
  description: string;
  start: Coord;
  goal: Coord;
  walls: string[];
}

const GRID_SIZE = 5;

// Fixed neighbor order disclosed in the lesson: Right, Down, Left, Up.
const DIRS: readonly Coord[] = [
  { r: 0, c: 1 },
  { r: 1, c: 0 },
  { r: 0, c: -1 },
  { r: -1, c: 0 },
];

const keyOf = (r: number, c: number) => `${r},${c}`;

const formatCoord = (r: number, c: number) => `Row ${r + 1}, Col ${c + 1}`;

const MAPS: Record<MapId, MapPreset> = {
  warehouse: {
    id: "warehouse",
    label: "Warehouse aisle",
    description:
      "Two horizontal crate shelves create a short left corridor and a long outer loop.",
    start: { r: 0, c: 0 },
    goal: { r: 4, c: 1 },
    walls: ["1,1", "1,2", "1,3", "3,1", "3,2", "3,3"],
  },
  detour: {
    id: "detour",
    label: "Detour trap",
    description:
      "Crates block the direct middle lane, tempting goal-guided search into an 8-step detour while layer-by-layer finds a 6-step route.",
    start: { r: 2, c: 0 },
    goal: { r: 2, c: 4 },
    walls: ["0,0", "0,3", "2,1", "2,3", "3,4", "4,3"],
  },
};

const STRATEGIES: { id: Strategy; label: string; summary: string }[] = [
  {
    id: "bfs",
    label: "Layer-by-layer (BFS)",
    summary:
      "Checks squares in order of fewest steps from Start. Guaranteed to find a shortest-step route when every step costs the same.",
  },
  {
    id: "dfs",
    label: "Corridor-first (DFS)",
    summary:
      "Follows one branch until no unchecked legal moves remain, then backtracks to the most recent fork with an untried option.",
  },
  {
    id: "greedy",
    label: "Goal-guided (Heuristic)",
    summary:
      "Picks from all discovered-but-unchecked squares using only estimated grid steps to Goal (ignoring walls). Ties go to the earliest-discovered square.",
  },
];

interface SearchStep {
  current: Coord;
  checked: string[];
  frontier: string[];
  note: string;
}

interface SearchTrace {
  steps: SearchStep[];
  found: boolean;
  path: string[];
}

function manhattan(a: Coord, b: Coord): number {
  return Math.abs(a.r - b.r) + Math.abs(a.c - b.c);
}

function computeTrace(
  strategy: Strategy,
  start: Coord,
  goal: Coord,
  wallSet: Set<string>,
): SearchTrace {
  const startKey = keyOf(start.r, start.c);
  const goalKey = keyOf(goal.r, goal.c);

  const inBoundsOpen = (r: number, c: number) =>
    r >= 0 &&
    r < GRID_SIZE &&
    c >= 0 &&
    c < GRID_SIZE &&
    !wallSet.has(keyOf(r, c));

  const steps: SearchStep[] = [];
  const parent = new Map<string, string | null>();
  const checkedOrder: string[] = [];
  let found = false;

  if (strategy === "bfs") {
    const queue: Coord[] = [start];
    parent.set(startKey, null);

    while (queue.length > 0) {
      const cur = queue.shift()!;
      const curKey = keyOf(cur.r, cur.c);
      checkedOrder.push(curKey);

      if (curKey === goalKey) {
        found = true;
        steps.push({
          current: cur,
          checked: [...checkedOrder],
          frontier: queue.map((p) => keyOf(p.r, p.c)),
          note: `Checked ${formatCoord(cur.r, cur.c)} (Goal) — route found!`,
        });
        break;
      }

      const added: string[] = [];
      for (const d of DIRS) {
        const nr = cur.r + d.r;
        const nc = cur.c + d.c;
        const nKey = keyOf(nr, nc);
        if (inBoundsOpen(nr, nc) && !parent.has(nKey)) {
          parent.set(nKey, curKey);
          queue.push({ r: nr, c: nc });
          added.push(formatCoord(nr, nc));
        }
      }

      steps.push({
        current: cur,
        checked: [...checkedOrder],
        frontier: queue.map((p) => keyOf(p.r, p.c)),
        note:
          added.length > 0
            ? `Checked ${formatCoord(cur.r, cur.c)} and added ${added.length} neighboring ${added.length === 1 ? "square" : "squares"} to the back of the waiting list.`
            : `Checked ${formatCoord(cur.r, cur.c)} — no new open neighbors here.`,
      });
    }
  } else if (strategy === "dfs") {
    const stack: { coord: Coord; from: string | null }[] = [
      { coord: start, from: null },
    ];
    const visited = new Set<string>();

    while (stack.length > 0) {
      const item = stack.pop()!;
      const cur = item.coord;
      const curKey = keyOf(cur.r, cur.c);
      if (visited.has(curKey)) continue;

      visited.add(curKey);
      parent.set(curKey, item.from);
      checkedOrder.push(curKey);

      if (curKey === goalKey) {
        found = true;
        const remaining = Array.from(
          new Set(
            stack
              .map((s) => keyOf(s.coord.r, s.coord.c))
              .filter((k) => !visited.has(k)),
          ),
        );
        steps.push({
          current: cur,
          checked: [...checkedOrder],
          frontier: remaining,
          note: `Checked ${formatCoord(cur.r, cur.c)} (Goal) — route found!`,
        });
        break;
      }

      let pushed = 0;
      for (let i = DIRS.length - 1; i >= 0; i--) {
        const nr = cur.r + DIRS[i].r;
        const nc = cur.c + DIRS[i].c;
        const nKey = keyOf(nr, nc);
        if (inBoundsOpen(nr, nc) && !visited.has(nKey)) {
          stack.push({ coord: { r: nr, c: nc }, from: curKey });
          pushed += 1;
        }
      }

      const remaining = Array.from(
        new Set(
          stack
            .map((s) => keyOf(s.coord.r, s.coord.c))
            .filter((k) => !visited.has(k)),
        ),
      );

      steps.push({
        current: cur,
        checked: [...checkedOrder],
        frontier: remaining,
        note:
          pushed > 0
            ? `Checked ${formatCoord(cur.r, cur.c)} and continued deeper along the current corridor.`
            : remaining.length > 0
              ? `Checked ${formatCoord(cur.r, cur.c)} — dead end, backtracking to the most recent fork.`
              : `Checked ${formatCoord(cur.r, cur.c)} — dead end with no untried branches left.`,
      });
    }
  } else {
    // Greedy Best-First Search: lowest Manhattan distance, tie-break earliest discovered (FIFO).
    const open: { coord: Coord; h: number; seq: number }[] = [
      { coord: start, h: manhattan(start, goal), seq: 0 },
    ];
    parent.set(startKey, null);
    let seq = 1;

    while (open.length > 0) {
      open.sort((a, b) => a.h - b.h || a.seq - b.seq);
      const item = open.shift()!;
      const cur = item.coord;
      const curKey = keyOf(cur.r, cur.c);
      checkedOrder.push(curKey);

      if (curKey === goalKey) {
        found = true;
        steps.push({
          current: cur,
          checked: [...checkedOrder],
          frontier: open.map((p) => keyOf(p.coord.r, p.coord.c)),
          note: `Checked ${formatCoord(cur.r, cur.c)} (Goal, estimated steps left = 0) — route found!`,
        });
        break;
      }

      let added = 0;
      for (const d of DIRS) {
        const nr = cur.r + d.r;
        const nc = cur.c + d.c;
        const nKey = keyOf(nr, nc);
        if (inBoundsOpen(nr, nc) && !parent.has(nKey)) {
          parent.set(nKey, curKey);
          open.push({
            coord: { r: nr, c: nc },
            h: manhattan({ r: nr, c: nc }, goal),
            seq: seq++,
          });
          added += 1;
        }
      }

      steps.push({
        current: cur,
        checked: [...checkedOrder],
        frontier: open.map((p) => keyOf(p.coord.r, p.coord.c)),
        note:
          added > 0
            ? `Picked ${formatCoord(cur.r, cur.c)} (estimated ${item.h} ${item.h === 1 ? "step" : "steps"} to Goal) from the waiting list and discovered ${added} new ${added === 1 ? "square" : "squares"}.`
            : `Picked ${formatCoord(cur.r, cur.c)} (estimated ${item.h} ${item.h === 1 ? "step" : "steps"} to Goal) — blocked here, trying the next-closest waiting square.`,
      });
    }
  }

  const path: string[] = [];
  if (found) {
    let cursor: string | null = goalKey;
    while (cursor !== null) {
      path.push(cursor);
      cursor = parent.get(cursor) ?? null;
    }
    path.reverse();
  }

  return { steps, found, path };
}

export function MazeLab() {
  const [mapId, setMapId] = useState<MapId>("warehouse");
  const [strategy, setStrategy] = useState<Strategy>("bfs");
  const [walls, setWalls] = useState<string[]>(MAPS.warehouse.walls);
  const [stepIndex, setStepIndex] = useState<number>(0);

  const preset = MAPS[mapId];
  const wallSet = useMemo(() => new Set(walls), [walls]);

  const trace = useMemo(
    () => computeTrace(strategy, preset.start, preset.goal, wallSet),
    [strategy, preset.start, preset.goal, wallSet],
  );

  const totalSteps = trace.steps.length;
  const activeStep = stepIndex > 0 ? trace.steps[stepIndex - 1] : null;
  const isFinished = stepIndex >= totalSteps && totalSteps > 0;

  const checkedSet = useMemo(
    () => new Set(activeStep ? activeStep.checked : []),
    [activeStep],
  );
  const checkedOrderMap = useMemo(() => {
    const map = new Map<string, number>();
    if (activeStep) {
      activeStep.checked.forEach((k, i) => map.set(k, i + 1));
    }
    return map;
  }, [activeStep]);
  const frontierSet = useMemo(
    () => new Set(activeStep ? activeStep.frontier : []),
    [activeStep],
  );
  const routeSet = useMemo(
    () => new Set(isFinished && trace.found ? trace.path : []),
    [isFinished, trace.found, trace.path],
  );

  const selectMap = (nextId: MapId) => {
    setMapId(nextId);
    setWalls(MAPS[nextId].walls);
    setStepIndex(0);
  };

  const selectStrategy = (nextStrategy: Strategy) => {
    setStrategy(nextStrategy);
    setStepIndex(0);
  };

  const toggleWall = (r: number, c: number) => {
    const k = keyOf(r, c);
    const startKey = keyOf(preset.start.r, preset.start.c);
    const goalKey = keyOf(preset.goal.r, preset.goal.c);
    if (k === startKey || k === goalKey) return;
    setWalls((prev) =>
      prev.includes(k) ? prev.filter((item) => item !== k) : [...prev, k],
    );
    setStepIndex(0);
  };

  const handleReset = () => {
    setWalls(preset.walls);
    setStepIndex(0);
  };

  const isEdited = useMemo(() => {
    if (walls.length !== preset.walls.length) return true;
    const presetSet = new Set(preset.walls);
    return walls.some((w) => !presetSet.has(w));
  }, [walls, preset.walls]);

  const routeSteps =
    isFinished && trace.found ? Math.max(0, trace.path.length - 1) : null;

  const strategyInfo = STRATEGIES.find((s) => s.id === strategy)!;

  return (
    <div className={styles.labBox} data-testid="maze-lab">
      <div className={styles.controlGroup}>
        <span className={styles.controlLabel}>1. Choose a map</span>
        <div className={styles.buttonRow}>
          {(Object.keys(MAPS) as MapId[]).map((id) => (
            <button
              key={id}
              type="button"
              className={styles.pillBtn}
              aria-pressed={mapId === id}
              onClick={() => selectMap(id)}
            >
              {MAPS[id].label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.controlGroup}>
        <span className={styles.controlLabel}>2. Choose a search order</span>
        <div className={styles.buttonRow}>
          {STRATEGIES.map((item) => (
            <button
              key={item.id}
              type="button"
              className={styles.pillBtn}
              aria-pressed={strategy === item.id}
              onClick={() => selectStrategy(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.actionRow}>
        <button
          type="button"
          className="button"
          disabled={isFinished}
          onClick={() => setStepIndex((prev) => Math.min(totalSteps, prev + 1))}
        >
          Step forward
        </button>
        <button
          type="button"
          disabled={isFinished}
          onClick={() => setStepIndex(totalSteps)}
        >
          Run to goal
        </button>
        <button type="button" onClick={handleReset}>
          Reset map
        </button>
      </div>

      <div className={styles.labBody}>
        <div className={styles.gridWrap}>
          <div
            className={styles.mazeGrid}
            role="group"
            aria-label={`5 by 5 ${preset.label} floor grid`}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => {
              const r = Math.floor(index / GRID_SIZE);
              const c = index % GRID_SIZE;
              const k = keyOf(r, c);
              const isStart = r === preset.start.r && c === preset.start.c;
              const isGoal = r === preset.goal.r && c === preset.goal.c;
              const isWall = wallSet.has(k);
              const isChecked = checkedSet.has(k);
              const isFrontier = frontierSet.has(k);
              const isRoute = routeSet.has(k);
              const isCurrent =
                activeStep !== null &&
                activeStep.current.r === r &&
                activeStep.current.c === c;
              const orderNum = checkedOrderMap.get(k);

              const classNames = [styles.cellBtn];
              if (isStart) classNames.push(styles.cellStart);
              else if (isGoal) classNames.push(styles.cellGoal);
              else if (isWall) classNames.push(styles.cellWall);
              else if (isRoute) classNames.push(styles.cellRoute);
              else if (isCurrent) classNames.push(styles.cellCurrent);
              else if (isChecked) classNames.push(styles.cellChecked);
              else if (isFrontier) classNames.push(styles.cellFrontier);

              const est = manhattan({ r, c }, preset.goal);
              const estSuffix =
                strategy === "greedy" && !isWall && !isStart && !isGoal
                  ? ` Estimated ${est} ${est === 1 ? "step" : "steps"} to Goal.`
                  : "";

              let cellLabel = `${formatCoord(r, c)}: `;
              if (isStart) cellLabel += "Start";
              else if (isGoal) cellLabel += "Goal";
              else if (isWall) cellLabel += "crate wall. Activate to clear.";
              else if (isRoute)
                cellLabel += `on planned route.${estSuffix} Activate to place crate wall.`;
              else if (isChecked)
                cellLabel += `checked #${orderNum}.${estSuffix} Activate to place crate wall.`;
              else if (isFrontier)
                cellLabel += `on waiting list.${estSuffix} Activate to place crate wall.`;
              else
                cellLabel += `open square.${estSuffix} Activate to place crate wall.`;

              return (
                <button
                  key={k}
                  type="button"
                  className={classNames.join(" ")}
                  disabled={isStart || isGoal}
                  aria-label={cellLabel}
                  onClick={() => toggleWall(r, c)}
                >
                  <span>
                    {isStart
                      ? "S"
                      : isGoal
                        ? "G"
                        : isWall
                          ? "■"
                          : orderNum !== undefined
                            ? orderNum
                            : ""}
                  </span>
                  {strategy === "greedy" && !isWall && !isStart && !isGoal && (
                    <span className={styles.cellSub}>{est}</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className={styles.legend} aria-label="Grid legend">
            <span className={styles.legendItem}>
              <span className={`${styles.swatch} ${styles.swatchWall}`} />
              Crate wall
            </span>
            <span className={styles.legendItem}>
              <span className={`${styles.swatch} ${styles.swatchFrontier}`} />
              Waiting list
            </span>
            <span className={styles.legendItem}>
              <span className={`${styles.swatch} ${styles.swatchChecked}`} />
              Checked
            </span>
            <span className={styles.legendItem}>
              <span className={`${styles.swatch} ${styles.swatchRoute}`} />
              Planned route
            </span>
          </div>
        </div>

        <div className={styles.readout}>
          <div className={styles.statsRow}>
            <span className={styles.badge} data-testid="squares-checked">
              {stepIndex} {stepIndex === 1 ? "square" : "squares"} checked
            </span>
            <span
              className={`${styles.badge} ${
                isFinished
                  ? trace.found
                    ? styles.badgeGood
                    : styles.badgeWarn
                  : ""
              }`}
              data-testid="route-length"
            >
              {isFinished
                ? trace.found
                  ? `Route: ${routeSteps} steps`
                  : "No route found"
                : "Route: searching"}
            </span>
          </div>

          <p
            className={styles.statusText}
            role="status"
            aria-live="polite"
            aria-atomic="true"
            data-testid="lab-status"
          >
            {activeStep
              ? isFinished && !trace.found
                ? `Checked all ${stepIndex} reachable ${stepIndex === 1 ? "square" : "squares"} — no route found because crates block every path to Goal.`
                : isFinished && trace.found
                  ? `Checked ${formatCoord(activeStep.current.r, activeStep.current.c)} (Goal) — route found in ${routeSteps} ${routeSteps === 1 ? "step" : "steps"} after checking ${stepIndex} ${stepIndex === 1 ? "square" : "squares"}.`
                  : activeStep.note
              : `Ready on ${preset.label}. Click Step forward or Run to goal—or click any open square or crate to edit the map and replan with zero training examples.`}
          </p>

          <p className="micro">{strategyInfo.summary}</p>
          <p className="micro" data-testid="map-description">
            {isEdited
              ? `Custom wall layout edited on ${preset.label}. Click Reset map to restore the preset walls.`
              : preset.description}
          </p>
          <p className={`micro ${styles.rulesNote}`}>
            <strong>Simplified toy rules:</strong> Equal cost per step, no
            diagonal moves, neighbors checked in Right, Down, Left, Up order.
            “Checked” counts each square once when selected (including Start and
            Goal). In Goal-guided mode, the small number in each square is its
            estimated steps to Goal ignoring walls, and ties pick the
            earliest-discovered square.
          </p>
        </div>
      </div>
    </div>
  );
}
