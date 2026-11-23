export type CoverageStatus = "Covered" | "Scarce" | "Missing";

export interface BusSettingRow {
  id: string;
  setting: string;
  realUse: string;
  initialClips: number;
  status: CoverageStatus;
}

export const INITIAL_BUS_SETTINGS: BusSettingRow[] = [
  {
    id: "quiet-indoor",
    setting: "Quiet indoor hall",
    realUse: "Quiet indoor speech (office stand-in for transit lobbies)",
    initialClips: 1000,
    status: "Covered",
  },
  {
    id: "busy-roadside",
    setting: "Busy roadside stop",
    realUse: "Dry outdoor stop beside passing buses and traffic",
    initialClips: 0,
    status: "Missing",
  },
  {
    id: "moving-bus",
    setting: "Inside moving bus",
    realUse: "Riders speaking over engine hum and cabin chatter",
    initialClips: 0,
    status: "Missing",
  },
  {
    id: "rainy-stop",
    setting: "Rainy outdoor stop",
    realUse: "Riders speaking through wind and heavy rain",
    initialClips: 0,
    status: "Missing",
  },
];

export interface SampleGroup {
  id: string;
  label: string;
  count: number;
  status: CoverageStatus;
  detail: string;
  feedback: string;
}

export interface AuditScenario {
  id: string;
  title: string;
  criterion: string;
  targetPopulation: string;
  collectionNote: string;
  unit: string;
  gapId: string;
  groups: SampleGroup[];
}

export const AUDIT_SCENARIOS: AuditScenario[] = [
  {
    id: "bus-helper",
    title: "Metro Bus Voice Helper",
    criterion:
      "Primary recording condition (quiet indoor, dry roadside stop, inside a moving bus, or rainy outdoor stop—non-overlapping)",
    targetPopulation:
      "Riders asking spoken bus questions in quiet indoor halls, at dry busy roadside stops, inside moving buses, and at rainy outdoor stops.",
    collectionNote:
      "Recorded across transit halls, roadside stops, and buses on dry afternoons, skipping rainy days.",
    unit: "clips",
    gapId: "rainy-stop",
    groups: [
      {
        id: "quiet-indoor",
        label: "Quiet indoor hall",
        count: 800,
        status: "Covered",
        detail: "Indoor transit lobbies",
        feedback:
          "Quiet indoor hall already has 800 clips in this sample—it is the most heavily covered setting, not the missing one.",
      },
      {
        id: "busy-roadside",
        label: "Busy roadside stop",
        count: 220,
        status: "Covered",
        detail: "Dry street-side stops",
        feedback:
          "Busy roadside stop has 220 clips in this sample, so the model sees examples of street traffic noise.",
      },
      {
        id: "moving-bus",
        label: "Inside moving bus",
        count: 180,
        status: "Covered",
        detail: "Engine and cabin noise",
        feedback:
          "Inside moving bus has 180 clips in this sample, giving the model examples of cabin hum and chatter.",
      },
      {
        id: "rainy-stop",
        label: "Rainy outdoor stop",
        count: 0,
        status: "Missing",
        detail: "Wind and rain background",
        feedback:
          "Correct. Rainy outdoor stop has 0 clips because recording only happened on dry afternoons—leaving a clear coverage gap for bad weather.",
      },
    ],
  },
  {
    id: "bike-share",
    title: "City Bike-Share Demand",
    criterion:
      "Weather and day bucket (sunny weekday, sunny weekend, overcast with no rain, or rainy—no trip falls into two buckets)",
    targetPopulation:
      "City bike trips across sunny weekdays, sunny weekends, overcast dry days, and rainy days.",
    collectionNote:
      "Docking sensors logged trips during a single dry summer month with no rainfall.",
    unit: "trips",
    gapId: "rainy-day",
    groups: [
      {
        id: "sunny-weekday",
        label: "Sunny weekday",
        count: 620,
        status: "Covered",
        detail: "Dry commuter workdays",
        feedback:
          "Sunny weekday has 620 trips—it is well covered in this dry-summer sample.",
      },
      {
        id: "sunny-weekend",
        label: "Sunny weekend",
        count: 310,
        status: "Covered",
        detail: "Dry Saturday and Sunday rides",
        feedback:
          "Sunny weekend has 310 trips, so weekend leisure patterns in dry weather are represented.",
      },
      {
        id: "overcast-dry",
        label: "Overcast dry day",
        count: 270,
        status: "Covered",
        detail: "Cloudy days without rain",
        feedback:
          "Overcast dry day has 270 trips, so cloudy dry conditions are covered in this sample.",
      },
      {
        id: "rainy-day",
        label: "Rainy day",
        count: 0,
        status: "Missing",
        detail: "Wet commutes and showers",
        feedback:
          "Correct. Rainy day has 0 trips because the sample came from one dry summer month—so the model has never seen how demand shifts in rain.",
      },
    ],
  },
  {
    id: "homework-helper",
    title: "School Homework Helper",
    criterion: "Learner age band (each writing sample comes from one band)",
    targetPopulation:
      "Writing drafts from primary pupils (ages 7–10), middle-school students (ages 11–13), high-school students (ages 14–16), and adult evening learners (ages 18+).",
    collectionNote:
      "Collected from daytime school classrooms, with only a handful of submissions from adult evening classes.",
    unit: "essays",
    gapId: "adult-evening",
    groups: [
      {
        id: "primary",
        label: "Primary (ages 7–10)",
        count: 450,
        status: "Covered",
        detail: "Short early-grade drafts",
        feedback:
          "Primary (ages 7–10) has 450 essays in this sample—it is well represented.",
      },
      {
        id: "middle",
        label: "Middle school (ages 11–13)",
        count: 380,
        status: "Covered",
        detail: "Paragraph-length assignments",
        feedback:
          "Middle school (ages 11–13) has 380 essays, so this age band is well covered.",
      },
      {
        id: "high",
        label: "High school (ages 14–16)",
        count: 320,
        status: "Covered",
        detail: "Structured school essays",
        feedback:
          "High school (ages 14–16) has 320 essays, so daytime high-school writing is well covered.",
      },
      {
        id: "adult-evening",
        label: "Adult evening learners (18+)",
        count: 8,
        status: "Scarce",
        detail: "Adult literacy and night-class drafts",
        feedback:
          "Correct. Adult evening learners (18+) have only 8 essays compared with 320–450 in each other band—making them severely under-represented in this daytime-school sample.",
      },
    ],
  },
];

export interface CollectionStrategy {
  id: string;
  label: string;
  total: number;
  coveredCount: number;
  summary: string;
  counts: {
    id: string;
    label: string;
    count: number;
    status: CoverageStatus;
  }[];
}

export const COLLECTION_STRATEGIES: CollectionStrategy[] = [
  {
    id: "baseline",
    label: "Baseline: 1,000 office clips",
    total: 1000,
    coveredCount: 1,
    summary:
      "1 of 4 settings present (1,000 total clips). All clips come from a quiet indoor office (standing in for quiet indoor halls), leaving three bus settings completely missing.",
    counts: [
      {
        id: "quiet-indoor",
        label: "Quiet indoor hall",
        count: 1000,
        status: "Covered",
      },
      {
        id: "busy-roadside",
        label: "Busy roadside stop",
        count: 0,
        status: "Missing",
      },
      {
        id: "moving-bus",
        label: "Inside moving bus",
        count: 0,
        status: "Missing",
      },
      {
        id: "rainy-stop",
        label: "Rainy outdoor stop",
        count: 0,
        status: "Missing",
      },
    ],
  },
  {
    id: "more-same",
    label: "Add 9,000 office clips (10,000 total)",
    total: 10000,
    coveredCount: 1,
    summary:
      "1 of 4 settings present (10,000 total clips). The dataset is ten times larger, yet dry roadside stops, moving buses, and rainy stops still have 0 clips.",
    counts: [
      {
        id: "quiet-indoor",
        label: "Quiet indoor hall",
        count: 10000,
        status: "Covered",
      },
      {
        id: "busy-roadside",
        label: "Busy roadside stop",
        count: 0,
        status: "Missing",
      },
      {
        id: "moving-bus",
        label: "Inside moving bus",
        count: 0,
        status: "Missing",
      },
      {
        id: "rainy-stop",
        label: "Rainy outdoor stop",
        count: 0,
        status: "Missing",
      },
    ],
  },
  {
    id: "targeted",
    label: "Add 600 targeted clips (1,600 total)",
    total: 1600,
    coveredCount: 4,
    summary:
      "4 of 4 settings present (1,600 total clips). Far smaller than 10,000 clips, yet all four settings now appear in the sample (illustrative counts show presence, not a guarantee of production accuracy).",
    counts: [
      {
        id: "quiet-indoor",
        label: "Quiet indoor hall",
        count: 1000,
        status: "Covered",
      },
      {
        id: "busy-roadside",
        label: "Busy roadside stop",
        count: 200,
        status: "Covered",
      },
      {
        id: "moving-bus",
        label: "Inside moving bus",
        count: 200,
        status: "Covered",
      },
      {
        id: "rainy-stop",
        label: "Rainy outdoor stop",
        count: 200,
        status: "Covered",
      },
    ],
  },
];
