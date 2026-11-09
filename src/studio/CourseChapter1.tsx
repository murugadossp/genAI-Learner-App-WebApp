import ChapterCourse from "./ChapterCourse";
export default function CourseChapter1() {
  return (
    <ChapterCourse
      copy={{
        chapterId: 1,
        eyebrow: "GenAI Basics / Chapter 1",
        subtitle: "The big picture, before the mechanism.",
        callout:
          "Start with the map. This chapter shows how the pieces of AI fit together, what an AI system actually does, and where to trust it.",
        asideTitle: "The big picture",
        outcomes: [
          "Explain how AI, machine learning, deep learning and generative AI nest.",
          "Name the task an AI system performs.",
          "Say where AI is worth trusting and where to check its work.",
        ],
        startHref: "/learn/genai-basics/c1-01",
      }}
    />
  );
}
