export interface TestPreset {
  id: string;
  label: string;
  summary: string;
  baseRatePct: number;
  detectionRatePct: number;
  falseAlarmRatePct: number;
}

export const POPULATION_SIZE = 1000;

export const TEST_PRESETS: TestPreset[] = [
  {
    id: "rare-blight",
    label: "Rare blight (1%)",
    summary:
      "Nora's whole orchard: 1% base rate, 90% detection, 10% false alarms.",
    baseRatePct: 1,
    detectionRatePct: 90,
    falseAlarmRatePct: 10,
  },
  {
    id: "damp-corner",
    label: "Damp corner (20%)",
    summary:
      "Higher-risk orchard patch: 20% base rate with the exact same 90% / 10% test.",
    baseRatePct: 20,
    detectionRatePct: 90,
    falseAlarmRatePct: 10,
  },
  {
    id: "stricter-test",
    label: "Stricter test (1% false alarm)",
    summary:
      "Rare 1% blight tested with a sharper strip that cuts false alarms to 1%.",
    baseRatePct: 1,
    detectionRatePct: 90,
    falseAlarmRatePct: 1,
  },
  {
    id: "common-event",
    label: "Even split (50%)",
    summary:
      "Half the trees are blighted (50% base rate): here a 90% / 10% test gives 90.0%.",
    baseRatePct: 50,
    detectionRatePct: 90,
    falseAlarmRatePct: 10,
  },
];

export interface BayesBreakdown {
  trulyPresent: number;
  trulyAbsent: number;
  truePositives: number;
  falseNegatives: number;
  falsePositives: number;
  trueNegatives: number;
  totalPositives: number;
  posteriorPct: number;
  secondTestPosteriorPct: number;
}

export function computeBayes(
  baseRatePct: number,
  detectionRatePct: number,
  falseAlarmRatePct: number,
): BayesBreakdown {
  const prior = baseRatePct / 100;
  const tpr = detectionRatePct / 100;
  const fpr = falseAlarmRatePct / 100;

  const trulyPresent = POPULATION_SIZE * prior;
  const trulyAbsent = POPULATION_SIZE * (1 - prior);

  const truePositives = trulyPresent * tpr;
  const falseNegatives = trulyPresent * (1 - tpr);
  const falsePositives = trulyAbsent * fpr;
  const trueNegatives = trulyAbsent * (1 - fpr);

  const totalPositives = truePositives + falsePositives;
  const posterior = totalPositives > 0 ? truePositives / totalPositives : 0;

  const secondNum = posterior * tpr;
  const secondDen = secondNum + (1 - posterior) * fpr;
  const secondPosterior = secondDen > 0 ? secondNum / secondDen : 0;

  return {
    trulyPresent,
    trulyAbsent,
    truePositives,
    falseNegatives,
    falsePositives,
    trueNegatives,
    totalPositives,
    posteriorPct: posterior * 100,
    secondTestPosteriorPct: secondPosterior * 100,
  };
}

export function formatCount(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export function formatPct(value: number): string {
  return `${value.toFixed(1)}%`;
}
