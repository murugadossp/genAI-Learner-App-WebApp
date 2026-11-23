export type SplitName = "train" | "val" | "test";

export type LoanRecord = {
  id: string;
  item: string;
  term: string;
  outcome: "On time" | "Late";
};

export const LOANS: LoanRecord[] = [
  { id: "Loan #1", item: "Mystery novel", term: "14 days", outcome: "On time" },
  {
    id: "Loan #2",
    item: "Exam study guide",
    term: "7 days",
    outcome: "Late",
  },
  {
    id: "Loan #3",
    item: "Children’s picture book",
    term: "14 days",
    outcome: "On time",
  },
  {
    id: "Loan #4",
    item: "Popular new release",
    term: "7 days",
    outcome: "Late",
  },
  {
    id: "Loan #5",
    item: "Gardening handbook",
    term: "21 days",
    outcome: "On time",
  },
  {
    id: "Loan #6",
    item: "Travel phrasebook",
    term: "7 days",
    outcome: "Late",
  },
  { id: "Loan #7", item: "Cookbook", term: "14 days", outcome: "On time" },
  {
    id: "Loan #8",
    item: "Local history book",
    term: "14 days",
    outcome: "Late",
  },
  { id: "Loan #9", item: "Biography", term: "21 days", outcome: "On time" },
  {
    id: "Loan #10",
    item: "DIY repair manual",
    term: "7 days",
    outcome: "Late",
  },
];

export type SplitPreset = {
  id: string;
  label: string;
  assignments: Record<string, SplitName>;
};

export const SPLIT_PRESETS: SplitPreset[] = [
  {
    id: "balanced",
    label: "Balanced 6 / 2 / 2",
    assignments: {
      "Loan #1": "train",
      "Loan #2": "train",
      "Loan #3": "train",
      "Loan #4": "train",
      "Loan #5": "train",
      "Loan #6": "train",
      "Loan #7": "val",
      "Loan #8": "val",
      "Loan #9": "test",
      "Loan #10": "test",
    },
  },
  {
    id: "no-val",
    label: "Train & test only (8 / 0 / 2)",
    assignments: {
      "Loan #1": "train",
      "Loan #2": "train",
      "Loan #3": "train",
      "Loan #4": "train",
      "Loan #5": "train",
      "Loan #6": "train",
      "Loan #7": "train",
      "Loan #8": "train",
      "Loan #9": "test",
      "Loan #10": "test",
    },
  },
  {
    id: "all-train",
    label: "All in training (10 / 0 / 0)",
    assignments: {
      "Loan #1": "train",
      "Loan #2": "train",
      "Loan #3": "train",
      "Loan #4": "train",
      "Loan #5": "train",
      "Loan #6": "train",
      "Loan #7": "train",
      "Loan #8": "train",
      "Loan #9": "train",
      "Loan #10": "train",
    },
  },
  {
    id: "one-class-test",
    label: "Only On-time in test (6 / 2 / 2)",
    assignments: {
      "Loan #1": "train",
      "Loan #2": "train",
      "Loan #3": "train",
      "Loan #4": "train",
      "Loan #5": "val",
      "Loan #6": "train",
      "Loan #7": "test",
      "Loan #8": "train",
      "Loan #9": "test",
      "Loan #10": "val",
    },
  },
];

export type CandidateSetting = {
  id: "A" | "B" | "C" | "D";
  label: string;
  detail: string;
  valScore: number;
  testScore: number;
  newLoansScore: number;
  reusedOnly?: boolean;
};

export const CANDIDATE_SETTINGS: CandidateSetting[] = [
  {
    id: "A",
    label: "Setting A (simple rule)",
    detail: "Checks loan length only.",
    valScore: 75,
    testScore: 75,
    newLoansScore: 75,
  },
  {
    id: "B",
    label: "Setting B (medium detail)",
    detail: "Checks loan length and book category.",
    valScore: 85,
    testScore: 85,
    newLoansScore: 83,
  },
  {
    id: "C",
    label: "Setting C (strict rule)",
    detail: "Flags most short loans as Late.",
    valScore: 80,
    testScore: 80,
    newLoansScore: 78,
  },
  {
    id: "D",
    label: "Setting D (tweaked for Test)",
    detail:
      "Adds special exceptions tailored to mistakes seen on the test set.",
    valScore: 75,
    testScore: 95,
    newLoansScore: 70,
    reusedOnly: true,
  },
];
