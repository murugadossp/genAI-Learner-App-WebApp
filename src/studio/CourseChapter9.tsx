import ChapterCourse from "./ChapterCourse";
export default function CourseChapter9() {
  return (
    <ChapterCourse
      copy={{
        chapterId: 9,
        icon: "⚙",
        eyebrow: "GenAI Basics / Chapter 9",
        subtitle: "From a model that answers to a system that acts.",
        callout:
          "Learn how models propose actions, how software keeps control, and how to stop, recover or ask a person when a run goes wrong.",
        asideTitle: "Tools and agents, in practice",
        outcomes: [
          "Tell a fixed workflow from an agent loop, and choose between them.",
          "Explain how agent state differs from memory, plans and model weights.",
          "Design approval gates that match the risk of an action.",
          "Choose a safe response when a tool fails or a run exceeds its limits.",
        ],
        startHref: "/learn/genai-basics/c9-02",
      }}
    />
  );
}
