import ChapterCourse from "./ChapterCourse";
export default function Course() {
  return (
    <ChapterCourse
      copy={{
        chapterId: 2,
        eyebrow: "GenAI Basics / Chapter 2",
        subtitle: "From a sequence of tokens to a system you can reason about.",
        callout:
          "Learn the mechanism, then explore its limits. This chapter connects visual intuition to the decisions you make as an engineer.",
        asideTitle: "A peek inside the model",
        outcomes: [
          "Explain how text becomes tokens and token IDs.",
          "Describe next-token prediction and its limits.",
          "Explain context windows and what information a model can see.",
        ],
        startHref: "/learn/genai-basics/c2-01",
      }}
    />
  );
}
