export type PartId = "model" | "interface" | "data" | "tool";

export const parts: { id: PartId; name: string; job: string }[] = [
  {
    id: "model",
    name: "Model",
    job: "Turns an input into an output, using what it learned from examples.",
  },
  {
    id: "interface",
    name: "Interface",
    job: "Where information goes in and out for the person.",
  },
  {
    id: "data",
    name: "Data source",
    job: "Information the app stored ahead of time and looks up as it is.",
  },
  {
    id: "tool",
    name: "Tool",
    job: "An outside service or action the app calls when it needs it.",
  },
];
