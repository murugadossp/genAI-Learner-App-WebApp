export type ModelId = "quick-lite" | "deep-think" | "long-read" | "local-safe";

export interface ModelProfile {
  id: ModelId;
  name: string;
  tagline: string;
  capability: string;
  speed: string;
  cost: string;
  context: string;
  privacy: string;
  optionSummary: string;
}

export const MODEL_PROFILES: ModelProfile[] = [
  {
    id: "quick-lite",
    name: "Quick-Lite",
    tagline: "Small, fast, low-cost cloud model",
    capability: "Basic (simple sorting, short fixes, brief rewrites)",
    speed: "Very fast (under 1 second per reply)",
    cost: "Very low (built for thousands of routine requests)",
    context: "Short (a few pages at once)",
    privacy: "Cloud-hosted (text leaves your device)",
    optionSummary:
      "Basic capability · very fast (<1s) · very low cost · short context · cloud",
  },
  {
    id: "deep-think",
    name: "Deep-Think",
    tagline: "Large, high-capability cloud model",
    capability:
      "High (tricky multi-step reasoning, conflicting rules, subtle tone)",
    speed: "Slower (several seconds per reply)",
    cost: "High (expensive at high volume; fine for occasional key tasks)",
    context: "Medium (a short report, up to about 20 pages)",
    privacy: "Cloud-hosted (text leaves your device)",
    optionSummary:
      "High capability · slower (several seconds) · high cost · medium context · cloud",
  },
  {
    id: "long-read",
    name: "Long-Read",
    tagline: "Long-context cloud model",
    capability:
      "Medium (everyday reading across long text; not built for tricky multi-step reasoning)",
    speed: "Medium (a few seconds per reply)",
    cost: "Medium (moderate per-request cloud cost)",
    context: "Very large (hundreds of pages in one request)",
    privacy: "Cloud-hosted (text leaves your device)",
    optionSummary:
      "Medium capability · medium speed · medium cost · very large context · cloud",
  },
  {
    id: "local-safe",
    name: "Local-Safe",
    tagline: "On-device private model",
    capability:
      "Medium (everyday drafting and summarising; not built for tricky multi-step reasoning)",
    speed: "Medium (runs on one office computer; not for instant web traffic)",
    cost: "Own hardware (no per-request cloud fee, though hardware still costs money)",
    context: "Short to medium (a few pages at once)",
    privacy: "On-device (text stays on your computer or private network)",
    optionSummary:
      "Medium capability · medium speed · own hardware · short-to-medium context · on-device",
  },
];
