// Optional hand-written copy for a chapter course page, keyed by curriculum
// chapter id. Any chapter without an entry gets copy derived from the
// curriculum (purpose, title and the learner summaries of its web lessons).
export type ChapterOverride = {
  icon?: string;
  subtitle?: string;
  callout?: string;
  asideTitle?: string;
  outcomes?: string[];
};
export const chapterCopy: Record<string, ChapterOverride> = {
  "1": {
    subtitle: "The big picture, before the mechanism.",
    callout:
      "Start with the map. This chapter shows how the pieces of AI fit together, what an AI system actually does, and where to trust it.",
    asideTitle: "The big picture",
    outcomes: [
      "Explain how AI, machine learning, deep learning and generative AI nest.",
      "Name the task an AI system performs.",
      "Say where AI is worth trusting and where to check its work.",
    ],
  },
  P1: {
    icon: "{ }",
    subtitle: "From primitive types to working with data and AI APIs.",
    callout:
      "Code is how ideas become systems. This chapter builds the practical Python foundations needed to configure models, process data, and parse AI responses.",
    asideTitle: "Practical foundations for AI",
    outcomes: [
      "Store, inspect, and convert core Python data types.",
      "Format prompts and model parameters safely.",
      "Catch parsing errors when handling structured outputs.",
    ],
  },
};
