export type IssueKind = "clean" | "format" | "error" | "missing";

export interface RawDeliveryRow {
  id: string;
  rawArea: string;
  cleanArea: "Town Centre" | "Hilltop";
  rawTime: string;
  rawNumericTime: number | null;
  cleanNumericTime: number | null;
  issueKind: IssueKind;
  issueLabel: string;
  note: string;
}

export const RAW_DELIVERIES: RawDeliveryRow[] = [
  {
    id: "D1",
    rawArea: "Town Centre",
    cleanArea: "Town Centre",
    rawTime: "18",
    rawNumericTime: 18,
    cleanNumericTime: 18,
    issueKind: "clean",
    issueLabel: "Clean",
    note: "Recorded cleanly.",
  },
  {
    id: "D2",
    rawArea: "town centre",
    cleanArea: "Town Centre",
    rawTime: "22",
    rawNumericTime: 22,
    cleanNumericTime: 22,
    issueKind: "format",
    issueLabel: "Format mismatch",
    note: "Lowercase area name—software can count it as a separate neighbourhood.",
  },
  {
    id: "D3",
    rawArea: "Town Centre",
    cleanArea: "Town Centre",
    rawTime: "20 mins",
    rawNumericTime: null,
    cleanNumericTime: 20,
    issueKind: "format",
    issueLabel: "Format mismatch",
    note: "Text unit 'mins' mixed with a number—numeric formulas skip or reject it.",
  },
  {
    id: "D4",
    rawArea: "Hilltop",
    cleanArea: "Hilltop",
    rawTime: "-15",
    rawNumericTime: -15,
    cleanNumericTime: null,
    issueKind: "error",
    issueLabel: "Data error",
    note: "Impossible negative delivery time—marked missing rather than guessed.",
  },
  {
    id: "D5",
    rawArea: "Hilltop",
    cleanArea: "Hilltop",
    rawTime: "(blank)",
    rawNumericTime: null,
    cleanNumericTime: null,
    issueKind: "missing",
    issueLabel: "Missing value",
    note: "No time logged—driver app lost mobile signal on the hill.",
  },
  {
    id: "D6",
    rawArea: "Hilltop",
    cleanArea: "Hilltop",
    rawTime: "44",
    rawNumericTime: 44,
    cleanNumericTime: 44,
    issueKind: "clean",
    issueLabel: "Clean",
    note: "Recorded cleanly.",
  },
];

export type MissingStrategyId =
  "flag" | "drop" | "overall-avg" | "group-avg" | "zero";

export interface MissingStrategyOption {
  id: MissingStrategyId;
  label: string;
  shortDesc: string;
}

export const MISSING_STRATEGIES: MissingStrategyOption[] = [
  {
    id: "flag",
    label: "Keep visible & flag missing",
    shortDesc:
      "Keep all rows, add a missing flag, and average valid times only.",
  },
  {
    id: "drop",
    label: "Drop incomplete rows",
    shortDesc: "Remove every row whose delivery time is missing.",
  },
  {
    id: "overall-avg",
    label: "Fill with overall average",
    shortDesc: "Replace each missing time with the average of all valid times.",
  },
  {
    id: "group-avg",
    label: "Fill with Hilltop average",
    shortDesc: "Replace Hilltop gaps with Hilltop's own known average time.",
  },
  {
    id: "zero",
    label: "Fill with 0 (pitfall)",
    shortDesc: "Replace every missing time with 0 so no cell is blank.",
  },
];

export const TARGET_MINUTES = 30;
