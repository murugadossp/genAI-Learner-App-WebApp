export const tasks = [
  {
    name: "Predict",
    asks: "What value is likely?",
    gives: "An estimate of an amount or a time, usually a number.",
  },
  {
    name: "Classify",
    asks: "Which group does this belong to right now?",
    gives: "A label chosen from a fixed list.",
  },
  {
    name: "Recommend",
    asks: "Which items suit this person?",
    gives: "A short list picked from many existing items.",
  },
  {
    name: "Generate",
    asks: "What new content fits this request?",
    gives: "New text, an image or audio that did not exist before.",
  },
  {
    name: "Plan",
    asks: "Which steps reach this goal?",
    gives: "An ordered set of steps or a route.",
  },
] as const;
