export type CalibrationStatus =
  "Well calibrated" | "Overconfident" | "Underconfident";

export interface TenDayRow {
  day: string;
  forecast: string;
  outcome: "Rain" | "Dry";
}

export const TEN_DAY_EXAMPLE: TenDayRow[] = [
  { day: "Day 1", forecast: "90%", outcome: "Rain" },
  { day: "Day 2", forecast: "90%", outcome: "Rain" },
  { day: "Day 3", forecast: "90%", outcome: "Rain" },
  { day: "Day 4", forecast: "90%", outcome: "Dry" },
  { day: "Day 5", forecast: "90%", outcome: "Rain" },
  { day: "Day 6", forecast: "90%", outcome: "Rain" },
  { day: "Day 7", forecast: "90%", outcome: "Rain" },
  { day: "Day 8", forecast: "90%", outcome: "Rain" },
  { day: "Day 9", forecast: "90%", outcome: "Rain" },
  { day: "Day 10", forecast: "90%", outcome: "Rain" },
];

export interface ForecastBucket {
  predicted: number;
  observed: number;
  rainyDays: number;
  totalDays: number;
  bucketStatus: CalibrationStatus;
  note: string;
}

export interface WeatherAppProfile {
  id: "well-calibrated" | "overconfident" | "underconfident";
  name: string;
  summary: string;
  overallStatus: CalibrationStatus;
  buckets: ForecastBucket[];
}

export const WEATHER_APPS: WeatherAppProfile[] = [
  {
    id: "well-calibrated",
    name: "App A (Well calibrated)",
    summary:
      "Across 100 past days in each forecast group, rain actually fell at the same rate App A predicted.",
    overallStatus: "Well calibrated",
    buckets: [
      {
        predicted: 20,
        observed: 20,
        rainyDays: 20,
        totalDays: 100,
        bucketStatus: "Well calibrated",
        note: "Predicted a 20% chance of rain, and rain fell on 20 of 100 days (20%). The estimate matches the observed rate.",
      },
      {
        predicted: 50,
        observed: 50,
        rainyDays: 50,
        totalDays: 100,
        bucketStatus: "Well calibrated",
        note: "Predicted a 50% chance of rain, and rain fell on 50 of 100 days (50%). A 50% forecast leaves an even split between rain and dry.",
      },
      {
        predicted: 70,
        observed: 70,
        rainyDays: 70,
        totalDays: 100,
        bucketStatus: "Well calibrated",
        note: "Predicted a 70% chance of rain, and rain fell on 70 of 100 days (70%). Across many similar days in this example, the 70% forecast lines up with the observed rate.",
      },
      {
        predicted: 90,
        observed: 90,
        rainyDays: 90,
        totalDays: 100,
        bucketStatus: "Well calibrated",
        note: "Predicted a 90% chance of rain, and rain fell on 90 of 100 days (90%). The remaining 10 dry days are expected uncertainty, not a bug.",
      },
    ],
  },
  {
    id: "overconfident",
    name: "App B (Overconfident)",
    summary:
      "App B pushes probabilities further from 50% than real outcomes support—making forecasts too extreme in either direction (too high on likely-rain forecasts and too low on low-rain forecasts).",
    overallStatus: "Overconfident",
    buckets: [
      {
        predicted: 20,
        observed: 35,
        rainyDays: 35,
        totalDays: 100,
        bucketStatus: "Overconfident",
        note: "Predicted only a 20% chance of rain (80% dry), yet rain fell on 35 of 100 days (35%). It was overconfident that the day would stay dry.",
      },
      {
        predicted: 50,
        observed: 50,
        rainyDays: 50,
        totalDays: 100,
        bucketStatus: "Well calibrated",
        note: "At 50%, rain fell on 50 of 100 days (50%). App B’s overconfidence shows up when it makes more extreme predictions away from 50%.",
      },
      {
        predicted: 70,
        observed: 55,
        rainyDays: 55,
        totalDays: 100,
        bucketStatus: "Overconfident",
        note: "Predicted a 70% chance of rain, but rain fell on only 55 of 100 days (55%)—15 percentage points below the forecast.",
      },
      {
        predicted: 90,
        observed: 60,
        rainyDays: 60,
        totalDays: 100,
        bucketStatus: "Overconfident",
        note: "Predicted a 90% chance of rain, but rain fell on only 60 of 100 days (60%). Treating this 90% as reliable leads to carrying an umbrella on 40 dry days.",
      },
    ],
  },
  {
    id: "underconfident",
    name: "App C (Underconfident)",
    summary:
      "App C keeps probabilities closer to 50% than real outcomes support—sounding more hesitant than the actual results.",
    overallStatus: "Underconfident",
    buckets: [
      {
        predicted: 20,
        observed: 10,
        rainyDays: 10,
        totalDays: 100,
        bucketStatus: "Underconfident",
        note: "Predicted a 20% chance of rain, yet rain fell on only 10 of 100 days (10%). It stayed closer to 50% than reality.",
      },
      {
        predicted: 50,
        observed: 50,
        rainyDays: 50,
        totalDays: 100,
        bucketStatus: "Well calibrated",
        note: "At 50%, rain fell on 50 of 100 days (50%). App C’s caution shows up when real outcomes are much more decisive than its numbers suggest.",
      },
      {
        predicted: 70,
        observed: 80,
        rainyDays: 80,
        totalDays: 100,
        bucketStatus: "Underconfident",
        note: "Predicted a 70% chance of rain, while rain actually fell on 80 of 100 days (80%)—10 percentage points higher than stated.",
      },
      {
        predicted: 90,
        observed: 98,
        rainyDays: 98,
        totalDays: 100,
        bucketStatus: "Underconfident",
        note: "Predicted a 90% chance of rain, while rain actually fell on 98 of 100 days (98%). Its estimate was more cautious than reality.",
      },
    ],
  },
];

export interface JudgeScenario {
  id: string;
  title: string;
  prompt: string;
  predicted: number;
  observed: number;
  observedCountText: string;
  correct: CalibrationStatus;
  feedback: Record<CalibrationStatus, string>;
}

export const JUDGE_SCENARIOS: JudgeScenario[] = [
  {
    id: "parcel-tracker",
    title: "Parcel tracker",
    prompt:
      "An invented parcel-delivery app predicts an 80% chance a parcel arrives today. Across 100 past parcels given an 80% forecast, 79 arrived on time (79%).",
    predicted: 80,
    observed: 79,
    observedCountText: "79 of 100 parcels arrived on time",
    correct: "Well calibrated",
    feedback: {
      "Well calibrated":
        "Correct. 79% is right next to 80%. Small random differences like 1 parcel in 100 are normal even for a well-calibrated model.",
      Overconfident:
        "Not quite. Overconfident would mean noticeably fewer than 80 of 100 parcels arrived on time—79 out of 100 closely matches the 80% estimate.",
      Underconfident:
        "Not quite. Underconfident would mean noticeably more than 80 of 100 parcels arrived on time—79 out of 100 closely matches the 80% estimate.",
    },
  },
  {
    id: "loan-tool",
    title: "Loan-approval tool",
    prompt:
      "An invented lending model predicts a 90% chance of on-time repayment. Across 100 past loans given a 90% forecast, 65 were repaid on time (65%).",
    predicted: 90,
    observed: 65,
    observedCountText: "65 of 100 loans repaid on time",
    correct: "Overconfident",
    feedback: {
      "Well calibrated":
        "Not quite. A well-calibrated 90% forecast should land close to 90 out of 100 loans, not 65 out of 100.",
      Overconfident:
        "Correct. The model predicted a 90% chance, which is much more extreme than the 65% observed rate.",
      Underconfident:
        "Not quite. Underconfident means the model was too cautious (closer to 50% than reality). Here it predicted 90% when only 65% succeeded.",
    },
  },
  {
    id: "frost-alert",
    title: "Crop-frost alert",
    prompt:
      "An invented farm alert predicts a 60% chance of overnight frost. Across 100 past nights given a 60% forecast, 85 had frost (85%).",
    predicted: 60,
    observed: 85,
    observedCountText: "85 of 100 nights had frost",
    correct: "Underconfident",
    feedback: {
      "Well calibrated":
        "Not quite. A well-calibrated 60% forecast should land close to 60 out of 100 nights, not 85 out of 100.",
      Overconfident:
        "Not quite. Overconfident would mean frost happened less often than the 60% forecast. Here frost happened much more often (85%).",
      Underconfident:
        "Correct. The alert predicted a cautious 60% chance, even though frost actually occurred on 85% of those nights.",
    },
  },
];

export const CALIBRATION_CHOICES: {
  value: CalibrationStatus;
  hint: string;
}[] = [
  {
    value: "Well calibrated",
    hint: "Predicted % closely matches observed %",
  },
  {
    value: "Overconfident",
    hint: "Predicted % is further from 50% than reality",
  },
  {
    value: "Underconfident",
    hint: "Predicted % is closer to 50% than reality",
  },
];
