export const tasks = [
  {
    name: "Predict",
    asks: "What is likely to happen, or be true, that we do not know yet?",
    gives:
      "An estimate of something unknown, such as an amount, a time or a yes/no outcome.",
  },
  {
    name: "Classify",
    asks: "Which group does this belong to right now?",
    gives:
      "A label chosen from a fixed list for something already in front of it.",
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
